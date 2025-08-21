import { inject, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { buildQueryParams } from '../helpers/build-query-params';
import { IFilterExternalParams, IFilterSavedFilter } from '../interfaces';
import { FsFilterConfig } from '../models/filter-config';

import {
  QueryParamsController, QueryPersistanceController, SavedFiltersController,
} from '.';
import { FsFilterItemsStore } from './items-store.service';


@Injectable()
export class ExternalParamsController implements OnDestroy {

  protected _init;

  private _pending$ = new BehaviorSubject(false);
  private _config: FsFilterConfig;
  private _destroy$ = new Subject<void>();
  private _itemsStore = inject(FsFilterItemsStore);
  private _persistanceStore = inject(QueryPersistanceController);
  private _queryParams = inject(QueryParamsController);
  private _savedFiltersController = inject(SavedFiltersController);

  public get params(): IFilterExternalParams {
    let result: IFilterExternalParams = {};

    if (this._persistanceStore.queryEnabled) {
      result = {
        ...result, 
        ...this._persistanceStore.getQuery(),
      };
    }

    if (this._savedFiltersController.enabled && this._savedFiltersController.activeFilter) {
      const query = Object.keys(result)
        .filter((key) => !this._itemsStore.itemNames.includes(key))
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: result[key],
          };
        }, {});

      result = {
        ...query, 
        ...this._savedFiltersController.activeFilterData,
      };
    } else if (this._queryParams.enabled) {
      result = {
        ...result, 
        ...this._queryParams.fetchedParams,
      };
    }

    return result;
  }

  public get pending(): boolean {
    return this._pending$.getValue();
  }

  public get pending$(): Observable<boolean> {
    return this._pending$.asObservable();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public setConfig(config) {
    this._config = config;

    this._initQueryParams();
    this._initSavedFilters();
    this.initItems();
  }

  public setActiveSavedFilter(savedFilter: IFilterSavedFilter) {
    this._savedFiltersController.setActiveFilter(savedFilter);

    if (savedFilter) {
      this.reloadFiltersWithValues(savedFilter.filters);
    }
  }

  public reloadFiltersWithValues(params: IFilterExternalParams) {
    this._itemsStore.updateItemsWithValues(params);

    this._saveQueryParams();
    this._savePersistedParams();
  }

  public initItems(): void {
    this._pending$.next(true);
    if (this._savedFiltersController.enabled) {
      this._savedFiltersController
        .load()
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._savedFiltersController.updateActiveFilter();
          this._initItemsValues();
          this._pending$.next(false);
        });
    } else {
      this._initItemsValues();
      this._pending$.next(false);
    }

    this._listenItemsChange();
  }

  public _initItemsValues() {
    this._itemsStore.init(this.params);
    this._saveQueryParams();
    this._savePersistedParams();
  }

  public fetchQueryParams(): void {
    this._initQueryParams();
    this._itemsStore.updateItemsWithValues(this.params);
  }

  private _initQueryParams() {
    this._queryParams.init(this._config.queryParam);
  }

  private _initSavedFilters() {
    this._savedFiltersController.init(this._config.savedFilters);
  }

  private _listenItemsChange() {
    this._itemsStore.ready$
      .pipe(
        filter((v) => v),
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._saveQueryParams();
        this._savePersistedParams();
      });

    this._itemsStore
      .itemsChange$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._saveQueryParams();
        this._savePersistedParams();
      });
  }

  private _saveQueryParams() {

    const params = buildQueryParams(
      this._itemsStore
        .valuesAsQuery({
          onlyPresented: false,
          items: this._itemsStore.items,
          persisted: true,
        }),
      this._itemsStore.items,
    );
   
    this._itemsStore.items
      .filter((item) => item.queryParamsDisabled || !item.isQueryParamVisible)
      .forEach((item) => {
        params[item.name] = undefined;
      });

    this._queryParams.writeStateToQueryParams(params);
  }

  private _savePersistedParams() {
    if(this._persistanceStore.queryEnabled) {
      const targetItems = this._itemsStore.items
        .filter((item) => !item.persistanceDisabled)
        .filter((item) => item.value !== undefined)
        .reduce((acc, item) => {
          acc[item.name] = item.model;

          return acc;
        }, {});

      this._persistanceStore.setQuery(targetItems);
    }
  }
}
