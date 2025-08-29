import { inject, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';


import type { FilterComponent } from '../components/filter/filter.component';
import { ItemType } from '../enums/item-type.enum';
import { createFilterItem } from '../helpers/create-filter-item';
import {
  IFilterConfigItem,
} from '../interfaces/config.interface';
import { KeyValue } from '../interfaces/external-params.interface';
import { FsFilterConfig } from '../models/filter-config';
import { BaseItem } from '../models/items/base-item';

import { KeywordController } from './keyword-controller.service';
import { PersistanceController } from './persistance-controller.service';
import { QueryParamController } from './query-param-controller.service';
import { SavedFilterController } from './saved-filter-controller.service';
import { SortController } from './sort-controller.service';


@Injectable()
export class FilterController implements OnDestroy {

  public filter: FilterComponent;

  private _ready$ = new BehaviorSubject(false);
  private _items = new Map<string, BaseItem<IFilterConfigItem>>();
  private _config: FsFilterConfig;
  private _add$ = new Subject<void>();
  private _init$ = new Subject<void>();
  private _change$ = new Subject<BaseItem<IFilterConfigItem>[]>();
  private _destroy$ = new Subject<void>();
  private _persistanceController = inject(PersistanceController);
  private _savedFilterController = inject(SavedFilterController);
  private _queryParamController = inject(QueryParamController);
  private _keywordController = inject(KeywordController);
  private _sortController = inject(SortController);

  public get items(): BaseItem<IFilterConfigItem>[] {
    return Array.from(this._items.values());
  }

  public get itemNames(): string[] {
    return this.items.map((item) => item.name);
  }

  public get config(): FsFilterConfig {
    return this._config;
  }

  public get init$() {
    return this._init$.asObservable();
  }

  public get add$() {
    return this._add$.asObservable();
  }

  public get change$() {
    return this._change$
      .pipe(
        debounceTime(30),
      );
  }

  public change() {
    this._change$.next(null);
  }

  public get ready$() {
    return this._ready$.asObservable();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public init(config: FsFilterConfig) {
    this._config = config;
    of(null)
      .pipe(
        tap(() => this._addItems(this._config.items || [])),
        tap(() => this._keywordController.init(this)),
        tap(() => this._sortController.init(this)),
        switchMap(() => forkJoin({
          savedFilters: this._savedFilterController.init(this),
          persistance: this._persistanceController.init(this),
          queryParams: this._queryParamController.init(this),
        })),
        switchMap(() => this._initItems()),        
        tap(() => this._initChanges()),
        tap(() => {
          this._init$.next();
          if (this._config.init) {
            this._config.init(this.query, this._sortController.getSort(), this.filter);
          }
        }),
        finalize(() => this._ready$.next(true)),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public getItem(name: string): BaseItem<IFilterConfigItem> {
    return this._items.get(name);
  }

  public filtersClear() {
    this.items
      .filter((item) => item.clearable)
      .forEach((item) => {
        item.clear();
      });

    this._keywordController.clear();
    this._sortController.clear();
  }

  public get queryParam(): Record<string, unknown> {
    return this.items
      .reduce((accum, item) => {
        return {
          ...accum,
          ...item.queryParam,
        };
      }, {});
  }

  public get query(): KeyValue {
    return {
      ...this.items
        .reduce((accum, item) => {
          return {
            ...accum,
            ...item.query,
          };
        }, {}),
      ...this._sortController.query(),
    };
  }

  public set values(values: Record<string, unknown>) {
    this.items.forEach((item) => {
      item.setValue(values[item.name], false);
    });

    this.change();
  }

  public get values(): Record<string, unknown> {
    return this.items
      .reduce((acc, item) => {
        const value = item.value;

        if (value !== null) {
          acc[item.name] = value;
        }

        return acc;
      }, {});
  }
  
  private _getInitValues(): KeyValue {
    let result: KeyValue = {};

    if (this._savedFilterController.enabled && this._savedFilterController.activeFilter) {
      const query = Object.keys(result)
        .filter((key) => !this.itemNames.includes(key))
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

    } else {
      if (this._persistanceController.enabled) {
        result = {
          ...result, 
          ...this._persistanceController.getQuery(),
        };
      }
      
      if (this._config.queryParam) {
        result = {
          ...result, 
          ...this._queryParamController.params,
        };
      }
    }

    return result;
  }

  private _initItems(): Observable<any> {
    if(!this.items.length) {
      return of(null);
    }
    
    const values = this._getInitValues();

    return forkJoin(
      this.items
        .map((item) => {
          return item.init(values[item.name]);
        }),
    )
      .pipe(
        tap(() => this.items.forEach((item) => {
          item.initCallback(item, this.filter);
        })),
      );
  }

  private _addItems(items: IFilterConfigItem[]) {
    this._add$.next();

    this._items = new Map(
      items      
        .filter((item) => {
          if (this._items.has(item.name)) {
            throw Error('Filter init error. Items name must be unique.');
          }

          return true;
        })
        .map((item) => {
          const filterItem = createFilterItem(item, { }, this.filter);

          if (filterItem.type === ItemType.Keyword) {
            this._keywordController.keywordItem = filterItem;
          }

          this._items.set(item.name, filterItem);

          return [item.name, filterItem];
        }),
    );
  }

  private _initChanges() {
    merge(
      ...this.items
        .map((item) => item.valueEvent$
          .pipe(
            filter((event) => event.emitChange),
            map(() => item),
          )),
    )
      .pipe(
        tap((item) => this._change$.next([item])),
        takeUntil(this._destroy$),
      )
      .subscribe();

    this._change$
      .pipe(
        tap((items: BaseItem<IFilterConfigItem>[]) => {
          if (this._config.change) {
            this._config.change(this.query, this._sortController.getSort());
          }

          items?.forEach((item) => {
            if (item.changeCallback) {
              item.changeCallback(item, this.filter);
            }
          });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

}
