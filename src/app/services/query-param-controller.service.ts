import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';

import { DrawerRef } from '@firestitch/drawer';

import { filter, merge, Observable, of, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { restoreItems } from '../helpers/restore-items';
import { KeyValue } from '../interfaces';

import { FilterController } from './filter-controller.service';
import { SortController } from './sort-controller.service';


@Injectable()
export class QueryParamController {
  
  private _filterController: FilterController;
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _sortController = inject(SortController);
  private readonly _route = inject(ActivatedRoute);
  private readonly _dialogRef = inject(MatDialogRef, { optional: true });
  private readonly _drawerRef = inject(DrawerRef, { optional: true });  

  public get enabled() {
    return !this._dialogRef && 
      !this._drawerRef && 
      this._filterController.config.queryParam;
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

    if (this.enabled) {
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
    }

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
        const value = data[name];
        if(value === undefined || value === null) {
          url.searchParams.delete(name);
        } else {
          url.searchParams.set(name, value);
        }
      });

    // Decode only the id:label separator, never %25. This method re-reads the
    // URL it wrote last time, so decoding the whole query string made it strip
    // one layer of encoding per call: %2523 -> %23 -> a literal #, which then
    // reads as a fragment marker and drops every later param out of the query
    // string. Leaving %25 encoded keeps the method idempotent. Any label
    // holding #, & or = depends on this — see the query-param-encoding
    // playground example.
    history.replaceState({}, null, url.pathname + url.search.replace(/%3A/gi, ':'));
  }
}
