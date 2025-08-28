import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { filter, merge, Observable, of, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { restoreItems } from '../helpers/restore-items';
import { KeyValue } from '../interfaces';

import { FilterController } from './filter-controller.service';
import { SortController } from './sort-controller.service';


@Injectable()
export class QueryParamController {
  private _destroyRef = inject(DestroyRef);
  private _enabled = false;
  private _sortController = inject(SortController);
  private _route = inject(ActivatedRoute);
  private _filterController: FilterController;

  public get enabled(): boolean {
    return this._enabled;
  }

  public get params(): Record<string, any> {
    if(!this.enabled) {
      return {};
    }

    const items = [
      ...this._filterController.items,
    ]
      .filter((item) => !!item);
      
    return restoreItems(
      this._route.snapshot.queryParams,
      items,
    );
  }

  public init(filterController: FilterController): Observable<any> {
    this._filterController = filterController;
    this._enabled = this._filterController.config.queryParam;

    merge(
      this._filterController.change$, 
      this._filterController.init$,
    )
      .pipe(
        filter(() => this.enabled),
        tap(() => this.updateQueryParams()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    return of(null);
  }

  public queryParams(): KeyValue {
    if(!this.enabled) {
      return {};
    }

    return {
      ...this._filterController.queryParam,
      ...this._sortController.queryParam,
    };
  }

  public updateQueryParams() {
    const queryParams = {
      ...this._filterController.items
        .reduce((acc, item) => {
          return {
            ...acc,
            [item.name]: undefined,
          };
        }, {}),
      ...this.queryParams(),
    };

    this._replaceState(queryParams);
  }

  private _replaceState(data) {
    const url = new URL(window.location.href);

    Object.keys(data)
      .forEach((name) => {
        if(data[name] === undefined || data[name] === null) {
          url.searchParams.delete(name);
        } else {
          url.searchParams.set(name,data[name]);
        }
      });

    history.replaceState({}, null, url.pathname + decodeURIComponent(url.search));
  }
}
