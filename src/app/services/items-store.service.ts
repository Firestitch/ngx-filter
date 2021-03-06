import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { pickBy } from 'lodash-es';

import {
  FilterSort,
  IFilterConfigItem,
} from '../interfaces/config.interface';
import { ItemType } from '../enums/item-type.enum';
import { BaseItem } from '../models/items/base-item';
import { SimpleSelectItem } from '../models/items/select/simple-select-item';
import { IFilterConfigSelectItem } from '../interfaces/items/select.interface';
import { FsFilterConfig, SORT_BY_FIELD, SORT_DIRECTION_FIELD } from '../models/filter-config';
import { createFilterItem } from '../helpers/create-filter-item';
import { RangeItem } from '../models/items/range-item';
import { BaseDateRangeItem } from '../models/items/date-range/base-date-range-item';
import { ISortingChangeEvent } from '../interfaces/filter.interface';
import { TextItem } from '../models/items/text-item';
import { IFilterExternalParams } from '../interfaces/external-params.interface';
import { IFilterConfigBaseItem } from '../interfaces/items/base.interface';


@Injectable()
export class FsFilterItemsStore implements OnDestroy {

  public sortByItem: BaseItem<IFilterConfigItem> = null;
  public sortDirectionItem: BaseItem<IFilterConfigItem> = null;
  public keywordItem: TextItem = null;

  private _items: BaseItem<IFilterConfigItem>[] = [];
  private _visibleItems$ = new BehaviorSubject<BaseItem<IFilterConfigItem>[]>([]);
  private _itemsByName = new Map<string, BaseItem<IFilterConfigItem>>();

  private _itemsValuesLoaded = false;
  private _hasKeyword = false;
  private _config: FsFilterConfig;

  private _itemsChange$ = new Subject();

  constructor() {
  }

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._items;
  }

  public get visibleItems(): BaseItem<IFilterConfigItem>[] {
    return this._visibleItems$.getValue();
  }

  public get visibleItems$(): Observable<BaseItem<IFilterConfigItem>[]> {
    return this._visibleItems$.asObservable();
  }

  public set visibleItems(items: BaseItem<IFilterConfigItem>[]) {
    this._visibleItems$.next(items);
  }

  public get hasKeyword(): boolean {
    return this._hasKeyword;
  }

  public get itemsChange$() {
    return this._itemsChange$.pipe(debounceTime(30));
  }

  public ngOnDestroy() {
    this.destroyItems();
  }

  public setConfig(config) {
    this._itemsByName.clear();
    this._config = config;
    this.initItems(config.items);
  }

  public getItemByName(name: string): BaseItem<IFilterConfigBaseItem> {
    return this._itemsByName.get(name);
  }

  public initItems(items: IFilterConfigItem[]) {
    this._itemsValuesLoaded = false;
    if (Array.isArray(items)) {
      this._createItems(items);
      this.updateVisibleItems();
      this._setKeywordItem();
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
        this.sortByItem.model = this._config.sort.value
      } else {
        this.sortByItem.clear(this.sortByItem.defaultValue);
      }
    }

    if (this.sortDirectionItem) {
      if (this._config.sort) {
        this.sortDirectionItem.model = this._config.sort.direction
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

  public getSort(): FilterSort {
    let sortBy = this.getSortByValue();
    sortBy = sortBy === '__all' ? null : sortBy;

    let sortDirection = this.getSortDirectionValue();
    sortDirection = sortDirection === '__all' ? null : sortDirection;

    return {
      value: sortBy,
      direction: sortDirection,
    }
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

  public valuesAsQuery(
    onlyPresented = false,
    items: BaseItem<IFilterConfigItem>[] = null
  ): Record<string, unknown> {
    const params = {};

    (items || this.items).forEach((filterItem: BaseItem<any>) => {
      Object.assign(params, filterItem.valueAsQuery);
    });

    if (onlyPresented) {
      return pickBy(params, (val) => {
        return val !== null && val !== void 0;
      });
    }

    return params;
  }


  public initItemValues(p: IFilterExternalParams) {
    this.items
      .forEach((item) => {
        item.initValues(p[item.name]);
      });

    this._createSortingItems(p);
    this._subscribeToItemsChanges();
  }

  public updateItemsWithValues(values: IFilterExternalParams) {
    this.items
      .forEach((item) => {
        if (values[item.name]) {
          item.model = values[item.name];
        } else {
          item.clear();
        }
      });

    if (this.sortByItem) { this.sortByItem.clear(); }
    if (this.sortDirectionItem) { this.sortDirectionItem.clear(); }
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

  public updateVisibleItems(): void {
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
        const filterItem = createFilterItem(item, { case: this._config.case });

        if (filterItem.type === ItemType.Keyword) {
          this._hasKeyword = true;
        }

        this._itemsByName.set(item.name, filterItem);

        return filterItem;
      });

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
          })
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

  private _createSortingItems(p) {
    if (this._config.sortValues?.length > 0) {
      const sortByItem = {
        name: SORT_BY_FIELD,
        type: ItemType.Select,
        label: 'Sort By',
        values: this._config.sortValues
      } as IFilterConfigSelectItem;


      if (this._config.sort && this._config.sort.value) {
        sortByItem.default = this._config.sort.value;
      }

      this.sortByItem = new SimpleSelectItem(
        sortByItem,
        null,
      );
      this.sortByItem.initValues(p[this.sortByItem.name]);

      const sortDirectionItem = {
        name: SORT_DIRECTION_FIELD,
        type: ItemType.Select,
        label: 'Sort Direction',
        values: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' }
        ]
      } as IFilterConfigSelectItem;

      if (this._config.sort && this._config.sort.direction) {
        sortDirectionItem.default = this._config.sort.direction;
      }

      this.sortDirectionItem = new SimpleSelectItem(
        sortDirectionItem,
        null
      );
      this.sortDirectionItem.initValues(p[this.sortDirectionItem.name]);
    }
  }

  private _setKeywordItem() {
    this.keywordItem = this
      .items
      .find((item) => item.isTypeKeyword) as TextItem;
  }
}
