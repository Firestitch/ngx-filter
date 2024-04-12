import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, takeUntil } from 'rxjs/operators';

import { pickBy } from 'lodash-es';

import type { FilterComponent } from '../components/filter/filter.component';
import { ItemType } from '../enums/item-type.enum';
import { createFilterItem } from '../helpers/create-filter-item';
import {
  FilterSort,
  IFilterConfigItem,
} from '../interfaces/config.interface';
import { IFilterExternalParams } from '../interfaces/external-params.interface';
import { ISortingChangeEvent } from '../interfaces/filter.interface';
import { IFilterConfigSelectItem } from '../interfaces/items/select.interface';
import { FsFilterConfig, SORT_BY_FIELD, SORT_DIRECTION_FIELD } from '../models/filter-config';
import { BaseItem } from '../models/items/base-item';
import { BaseDateRangeItem } from '../models/items/date-range/base-date-range-item';
import { RangeItem } from '../models/items/range-item';
import { MultipleSelectItem } from '../models/items/select/multiple-select-item';
import { SimpleSelectItem } from '../models/items/select/simple-select-item';
import { TextItem } from '../models/items/text-item';


interface IValueAsQuery {
  onlyPresented?: boolean;
  items?: BaseItem<IFilterConfigItem>[];
  persisted?: boolean;
}

@Injectable()
export class FsFilterItemsStore implements OnDestroy {

  public sortByItem: BaseItem<IFilterConfigItem> = null;
  public sortDirectionItem: BaseItem<IFilterConfigItem> = null;
  public keywordItem: TextItem = null;
  public filter: FilterComponent;

  private _ready$ = new BehaviorSubject(false);
  private _items: BaseItem<IFilterConfigItem>[] = [];
  private _visibleItems$ = new BehaviorSubject<BaseItem<IFilterConfigItem>[]>([]);
  private _itemsByName = new Map<string, BaseItem<IFilterConfigItem>>();

  private _itemsValuesLoaded = false;
  private _hasKeyword = false;
  private _config: FsFilterConfig;

  private _itemsChange$ = new Subject();
  private _destroy$ = new Subject<void>();

  constructor(
  ) {
    this._lazyInit();
  }

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._items;
  }

  public get visibleItems(): BaseItem<IFilterConfigItem>[] {
    return this._visibleItems$.getValue();
  }

  public set visibleItems(items: BaseItem<IFilterConfigItem>[]) {
    this._visibleItems$.next(items);
  }

  public get visibleItems$(): Observable<BaseItem<IFilterConfigItem>[]> {
    return this._visibleItems$.asObservable();
  }

  public get hasKeyword(): boolean {
    return this._hasKeyword;
  }

  public get itemsChange$() {
    return this._itemsChange$.pipe(debounceTime(30));
  }

  public get ready$() {
    return this._ready$.asObservable();
  }

  public ngOnDestroy() {
    this.destroyItems();

    this._destroy$.next();
    this._destroy$.complete();
  }

  public setConfig(config) {
    this._itemsByName.clear();
    this._config = config;
    this.initItems(config.items);
  }

  public getItemByName(name: string): BaseItem<IFilterConfigItem> {
    return this._itemsByName.get(name);
  }

  public initItems(items: IFilterConfigItem[]) {
    this._itemsValuesLoaded = false;
    if (Array.isArray(items)) {
      this._createItems(items);
    }
  }

  public filtersClear() {
    this.items.forEach((item) => {
      if (item instanceof RangeItem) {
        item.clearRange(null, item.defaultValue);
      } else if (item instanceof BaseDateRangeItem) {
        item.clearDateRange(null, item.defaultValue);
      } else {
        item.clear(item.defaultValue);
      }
    });

    if (this.sortByItem) {
      if (this._config.sort) {
        this.sortByItem.model = this._config.sort.value;
      } else {
        this.sortByItem.clear(this.sortByItem.defaultValue);
      }
    }

    if (this.sortDirectionItem) {
      if (this._config.sort) {
        this.sortDirectionItem.model = this._config.sort.direction;
      } else {
        this.sortDirectionItem.clear(this.sortDirectionItem.defaultValue);
      }
    }

    this.keywordItem?.clear();
  }

  public loadAsyncValues() {
    this.items
      .filter((item) => item.hasPendingValues)
      .forEach((item) => item.loadAsyncValues());
  }

  public loadAsyncDefaults(): void {
    // default values can be asynchronous, and we must load them if there is no persisted value instead
    const defaultValuesToBeLoaded = this.items
      .filter((item) => {
        return item.defaultValueFn
          && (item.persistedValue === null || item.persistedValue === undefined);
      });

    // special hack for isolate multiple select
    // values for this type of select must be preloaded
    // Read more in class MultipleSelectItem._init()
    const valuesToBeLoaded = this.items
      .filter((item) => {
        return (item instanceof MultipleSelectItem) && item.hasPendingValues && item.isolate;
      });

    if (defaultValuesToBeLoaded.length > 0 || valuesToBeLoaded.length > 0) {
      forkJoin(
        [
          ...defaultValuesToBeLoaded
            .map((item) => item.loadDefaultValue()),

          ...valuesToBeLoaded
            .map((item) => {
              item.loadAsyncValues();

              return item.loading$
                .pipe();
            }),
        ],
      )
        .pipe(
          finalize(() => {
            this._ready$.next(true);
          }),
          takeUntil(this._destroy$),
        )
        .subscribe();
    } else {
      this._ready$.next(true);
    }
  }

  public getSort(): FilterSort {
    let sortBy = this.getSortByValue();
    sortBy = sortBy === '__all' ? null : sortBy;

    let sortDirection = this.getSortDirectionValue();
    sortDirection = sortDirection === '__all' ? null : sortDirection;

    return {
      value: sortBy,
      direction: sortDirection,
    };
  }

  public getSortByValue() {
    return this.sortByItem ? this.sortByItem.model : null;
  }

  public getSortDirectionValue() {
    return this.sortDirectionItem ? this.sortDirectionItem.model : null;
  }

  public updateSort(sort: ISortingChangeEvent) {
    if (sort.sortBy) {
      this.sortByItem.model = sort.sortBy;
    }

    if (sort.sortDirection) {
      this.sortDirectionItem.model = sort.sortDirection;
    }
  }

  public values(onlyPresented = false): Record<string, unknown> {
    return this.items.reduce((acc, item) => {
      const value = item.value;

      if (!onlyPresented || value !== null) {
        acc[item.name] = value;
      }

      return acc;
    }, {});
  }

  public valuesAsQuery({
    onlyPresented = true,
    items = null,
    persisted = false,
  }: IValueAsQuery = {}): Record<string, unknown> {
    const params = {};

    (items || this.items).forEach((filterItem: BaseItem<any>) => {
      const values = persisted
        ? filterItem.persistanceObject
        : filterItem.queryObject;

      Object.assign(params, values);
    });

    if (onlyPresented) {
      return pickBy(params, (val) => {
        return val !== void 0;
      });
    }

    return params;
  }

  public init(p: IFilterExternalParams) {
    this.items
      .forEach((item) => {
        item.initValues(p[item.name]);
      });

    this._initSortingItems(p);
    this.loadAsyncDefaults();
    this._subscribeToItemsChanges();
  }

  public updateItemsWithValues(values: IFilterExternalParams) {
    this.items
      .forEach((item) => {
        if (values[item.name]) {
          item.model = values[item.name];
        } else {
          if (item instanceof RangeItem) {
            item.clearRange(null, item.defaultValue);
          } else if (item instanceof BaseDateRangeItem) {
            item.clearDateRange(null, item.defaultValue);
          } else {
            item.clear();
          }
        }
      });

    if (this.sortByItem) {
      this.sortByItem.clear();
    }
    if (this.sortDirectionItem) {
      this.sortDirectionItem.clear();
    }
  }

  public destroyItems() {
    this.items
      .forEach((item) => item.destroy());
    this.sortByItem?.destroy();
    this.sortDirectionItem?.destroy();

    this._items = [];
    this.sortByItem = null;
    this.sortDirectionItem = null;
  }

  /**
   * Some items might need to load async values before they will be shown
   */
  public prepareItems() {
    if (!this._itemsValuesLoaded) {
      this._itemsValuesLoaded = true;

      this.loadAsyncValues();
    }
  }

  public updateItemsVisiblity(): void {
    this.visibleItems = this.items
      .filter((item) => !item.isTypeKeyword && !item.hide);
  }

  private _createItems(items: IFilterConfigItem[]) {
    this._items = items
      .filter((item) => !item.disable)
      .filter((item) => {
        if (this._itemsByName.has(item.name)) {
          throw Error('Filter init error. Items name must be unique.');
        } else {
          this._itemsByName.set(item.name, null);

          return true;
        }
      })
      .map((item) => {
        const filterItem = createFilterItem(item, { case: this._config.case }, this.filter);

        if (filterItem.type === ItemType.Keyword) {
          this._hasKeyword = true;
        }

        this._itemsByName.set(item.name, filterItem);

        return filterItem;
      });

    this._createSortingItems();
  }

  private _subscribeToItemsChanges() {
    this.items
      .forEach((item) => {
        item.valueChange$
          .pipe(
            takeUntil(item.destroy$),
          )
          .subscribe(() => {
            this._itemsChange$.next(item);
          });
      });

    if (this._config.sortValues?.length) {
      this.sortByItem.valueChange$
        .pipe(
          takeUntil(this.sortByItem.destroy$),
        )
        .subscribe(() => {
          this._itemsChange$.next(this.sortByItem);
        });

      this.sortDirectionItem.valueChange$
        .pipe(
          takeUntil(this.sortDirectionItem.destroy$),
        )
        .subscribe(() => {
          this._itemsChange$.next(this.sortDirectionItem);
        });
    }
  }

  private _lazyInit(): void {
    this.ready$
      .pipe(
        filter((state) => state),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.updateItemsVisiblity();
        this._setKeywordItem();
      });
  }

  private _initSortingItems(p: IFilterExternalParams): void {
    if (this.sortByItem && this.sortDirectionItem) {
      this.sortByItem.initValues(p[this.sortByItem.name]);
      this.sortDirectionItem.initValues(p[this.sortDirectionItem.name]);
    }
  }

  private _createSortingItems(): void {
    if (this._config.sortValues?.length > 0) {
      const sortByItem = {
        name: SORT_BY_FIELD,
        type: ItemType.Select,
        label: 'Sort by',
        values: this._config.sortValues,
      } as IFilterConfigSelectItem;


      if (this._config.sort && this._config.sort.value) {
        sortByItem.default = this._config.sort.value;
      }

      this.sortByItem = new SimpleSelectItem(
        sortByItem,
        null,
        this.filter,
      );

      const sortDirectionItem = {
        name: SORT_DIRECTION_FIELD,
        type: ItemType.Select,
        label: 'Sort direction',
        values: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' },
        ],
      } as IFilterConfigSelectItem;

      if (this._config.sort && this._config.sort.direction) {
        sortDirectionItem.default = this._config.sort.direction;
      }

      this.sortDirectionItem = new SimpleSelectItem(
        sortDirectionItem,
        null,
        this.filter,
      );
    }
  }

  private _setKeywordItem() {
    this.keywordItem = this
      .items
      .find((item) => item.isTypeKeyword) as TextItem;
  }
}
