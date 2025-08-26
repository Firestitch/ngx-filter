import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';

import { pickBy } from 'lodash-es';

import type { FilterComponent } from '../components/filter/filter.component';
import { ItemType } from '../enums/item-type.enum';
import { buildQueryParams } from '../helpers/build-query-params';
import { createFilterItem } from '../helpers/create-filter-item';
import {
  FilterSort,
  IFilterConfigItem,
  SortItem,
} from '../interfaces/config.interface';
import { KeyValue } from '../interfaces/external-params.interface';
import { ISortingChangeEvent } from '../interfaces/filter.interface';
import { IFilterConfigSelectItem } from '../interfaces/items/select.interface';
import { FsFilterConfig, SortByField, SortDirectionField } from '../models/filter-config';
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
export class ItemStore implements OnDestroy {

  public sortByItem: BaseItem<IFilterConfigItem> = null;
  public sortDirectionItem: BaseItem<IFilterConfigItem> = null;
  public keywordItem: TextItem = null;
  public filter: FilterComponent;

  private _ready$ = new BehaviorSubject(false);
  private _visibleItems$ = new BehaviorSubject<BaseItem<IFilterConfigItem>[]>([]);
  private _items = new Map<string, BaseItem<IFilterConfigItem>>();
  private _itemsValuesLoaded = false;
  private _hasKeyword = false;
  private _config: FsFilterConfig;
  private _itemsChange$ = new Subject();
  private _destroy$ = new Subject<void>();

  public get items(): BaseItem<IFilterConfigItem>[] {
    return Array.from(this._items.values());
  }

  public get itemNames(): string[] {
    return this.items.map((item) => item.name);
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

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public setConfig(config) {
    this._config = config;
    this.initItems(config.items);
  }

  public getItemByName(name: string): BaseItem<IFilterConfigItem> {
    return this._items.get(name);
  }

  public initItems(items: IFilterConfigItem[]) {
    this._itemsValuesLoaded = false;
    if (Array.isArray(items)) {
      this._createItems(items);
      this._setKeywordItem();
    }
  }

  public queryParams(): KeyValue {
    return buildQueryParams(this.valuesAsQuery(), this.items);
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
    return this.items
      .reduce((acc, item) => {
        const value = item.value;

        if (!onlyPresented || value !== null) {
          acc[item.name] = value;
        }

        return acc;
      }, {});
  }

  public models(): KeyValue {
    return this.items
      .reduce((acc, item) => {
        acc[item.name] = item.model;

        return acc;
      }, {});
  }

  public valuesAsQuery({
    onlyPresented = true,
    items = null,
    persisted = false,
  }: IValueAsQuery = {}): KeyValue {
    const params = {};

    (items || this.items)
      .forEach((filterItem: BaseItem<any>) => {
        const values = persisted
          ? filterItem.persistanceObject
          : filterItem.queryObject;

        Object.assign(params, values);
      });

    if (onlyPresented) {
      return pickBy(params, (val) => {
        return val !== undefined;
      });
    }

    return params;
  }

  public init(p: KeyValue) {
    this.items
      .forEach((item) => {
        item.initValues(p[item.name]);
      });

    this._initSortingItems(p);
    this.loadAsyncDefaults();
    this._subscribeToItemsChanges();
  }

  public updateItemsWithValues(values: KeyValue) {
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

  public updateSortingItemsValues(items: SortItem[]) {
    if (!this.sortByItem) {
      return;
    }

    this.sortByItem.values = items;
  }

  public destroyItems() {
    this.items
      .forEach((item) => item.destroy());
    this.sortByItem?.destroy();
    this.sortDirectionItem?.destroy();

    this._items.clear();
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

  private _createItems(items: IFilterConfigItem[]) {
    this._items = new Map(
      items
        .filter((item) => !item.disable)
        .filter((item) => {
          if (this._items.has(item.name)) {
            throw Error('Filter init error. Items name must be unique.');
          }

          return true;
        })
        .map((item) => {
          const filterItem = createFilterItem(item, { }, this.filter);

          if (filterItem.type === ItemType.Keyword) {
            this._hasKeyword = true;
          }

          this._items.set(item.name, filterItem);

          return [item.name, filterItem];
        }),
    );

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

  private _initSortingItems(p: KeyValue): void {
    if (this.sortByItem && this.sortDirectionItem) {
      this.sortByItem.initValues(p[this.sortByItem.name]);
      this.sortDirectionItem.initValues(p[this.sortDirectionItem.name]);
    }
  }

  private _createSortingItems(): void {
    if (this._config.sortValues?.length > 0) {
      const sortByItem = {
        name: SortByField,
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
        name: SortDirectionField,
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
