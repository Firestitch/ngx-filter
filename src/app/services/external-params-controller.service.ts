import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';

import { buildQueryParams } from '../helpers/build-query-params';
import { IFilterExternalParams, IFilterSavedFilter } from '../interfaces';
import { FsFilterConfig } from '../models/filter-config';

import {
  QueryParamsController, QueryPersistanceController, SavedFiltersController,
} from './external-params';
import { FsFilterItemsStore } from './items-store.service';


@Injectable()
export class ExternalParamsController implements OnDestroy {

  protected _init;

  private _pending$ = new BehaviorSubject(false);
  private _shouldResetSavedFilters = true;
  private _config: FsFilterConfig;
  private _destroy$ = new Subject<void>();

  constructor(
    private _itemsStore: FsFilterItemsStore,
    private _persistanceStore: QueryPersistanceController,
    private _queryParams: QueryParamsController,
    private _savedFilters: SavedFiltersController,
  ) { }

  public get params(): IFilterExternalParams {
    let result: IFilterExternalParams = {};

    if (this._persistanceStore.queryEnabled) {
      result = {
        ...result, 
        ...this._persistanceStore.getQuery(),
      };
    }

    if (this._savedFilters.enabled && this._savedFilters.activeFilter) {
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
        ...this._savedFilters.activeFilterData,
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

  public get savedFiltersController(): SavedFiltersController {
    return this._savedFilters;
  }

  public get savedFiltersEnabled(): boolean {
    return this._savedFilters.enabled;
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
    this.savedFiltersController.setActiveFilter(savedFilter);

    if (savedFilter) {
      this.reloadFiltersWithValues(savedFilter.filters, false);
    }
  }

  public reloadFiltersWithValues(params: IFilterExternalParams, shouldResetSavedFilters = true) {
    this._shouldResetSavedFilters = shouldResetSavedFilters;
    this._itemsStore.updateItemsWithValues(params);

    this._saveQueryParams();
    this._savePersistedParams();
  }

  public initItems(): void {
    this._pending$.next(true);
    if (this._savedFilters.enabled) {
      this._savedFilters
        .load()
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._savedFilters.updateActiveFilter();
          this._initItemsValues();
          this._listenAndResetSavedFilters();
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
    this._savedFilters.init(this._config.savedFilters);
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

  private _listenAndResetSavedFilters(): void {
    this._itemsStore
      .itemsChange$
      .pipe(
        filter(() => !!this.savedFiltersController.activeFilter),
        switchMap(() => {
          const shouldReset = this._shouldResetSavedFilters;

          this._shouldResetSavedFilters = true;

          return of(shouldReset);
        }),
        filter((shouldReset) => shouldReset),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.savedFiltersController.resetActiveFilter();
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
