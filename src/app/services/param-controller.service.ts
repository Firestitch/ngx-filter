import { inject, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { buildQueryParams } from '../helpers/build-query-params';
import { KeyValue } from '../interfaces';
import { FsFilterConfig } from '../models/filter-config';

import {
  PersistanceController,
  QueryParamController,
  SavedFilterController,
} from '.';
import { ItemStore } from './item-store.service';


@Injectable()
export class ParamController implements OnDestroy {

  private _pending$ = new BehaviorSubject(false);
  private _config: FsFilterConfig;
  private _destroy$ = new Subject<void>();
  private _itemStore = inject(ItemStore);
  private _persistanceController = inject(PersistanceController);
  private _queryParams = inject(QueryParamController);
  private _savedFilterController = inject(SavedFilterController);

  public get params(): KeyValue {
    let result: KeyValue = {};

    if (this._persistanceController.queryEnabled) {
      result = {
        ...result, 
        ...this._persistanceController.getQuery(),
      };
    }

    if (this._savedFilterController.enabled && this._savedFilterController.activeFilter) {
      const query = Object.keys(result)
        .filter((key) => !this._itemStore.itemNames.includes(key))
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: result[key],
          };
        }, {});

      result = {
        ...query, 
        ...this._savedFilterController.activeFilterData,
      };
    } else if (this._queryParams.enabled) {
      result = {
        ...result, 
        ...this._queryParams.params,
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

  public reloadFiltersWithValues(params: KeyValue) {
    this._itemStore.updateItemsWithValues(params);

    this._saveQueryParams();
    this._savePersistedParams();
  }

  public initItems(): void {
    of(null)
      .pipe(
        tap(() => this._pending$.next(true)),
        switchMap(() => this._savedFilterController.load() ),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._initItemsValues();
        this._pending$.next(false);
        this._listenItemsChange();
        this._listenSavedFilterChange();
      });
  }

  public _initItemsValues() {
    this._itemStore.init(this.params);
    this._saveQueryParams();
    this._savePersistedParams();
  }

  public fetchQueryParams(): void {
    this._initQueryParams();
    this._itemStore.updateItemsWithValues(this.params);
  }

  private _initQueryParams() {
    this._queryParams.init(this._config.queryParam);
  }

  private _initSavedFilters() {
    this._savedFilterController.init(this._config.savedFilters);
  }

  private _listenSavedFilterChange() {
    this._savedFilterController.activeFilter$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((savedFilter) => {
        if (savedFilter) {
          this.reloadFiltersWithValues(savedFilter.filters);
        } else {
          this._itemStore.filtersClear();
        }
      });
  }

  private _listenItemsChange() {
    this._itemStore.ready$
      .pipe(
        filter((v) => v),
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._saveQueryParams();
        this._savePersistedParams();
      });

    this._itemStore
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
      this._itemStore
        .valuesAsQuery({
          onlyPresented: false,
          items: this._itemStore.items,
          persisted: true,
        }),
      this._itemStore.items,
    );
   
    this._itemStore.items
      .filter((item) => item.queryParamsDisabled || !item.isQueryParamVisible)
      .forEach((item) => {
        params[item.name] = undefined;
      });

    this._queryParams.writeStateToQueryParams(params);
  }

  private _savePersistedParams() {
    if(this._persistanceController.queryEnabled) {
      const targetItems = this._itemStore.items
        .filter((item) => !item.persistanceDisabled)
        .filter((item) => item.value !== undefined)
        .reduce((acc, item) => {
          acc[item.name] = item.model;

          return acc;
        }, {});

      this._persistanceController.setQuery(targetItems);
    }
  }
}
