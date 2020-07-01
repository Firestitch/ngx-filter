import {
  FilterButton,
  IFilterConfigItem,
  FsFilterPersistance
} from './../interfaces/config.interface';
import { isEmpty } from '@firestitch/common';
import { Alias, Model } from 'tsmodels';

import { Observable, Subject } from 'rxjs';

import { clone } from 'lodash-es';

import { FsFilterConfigItem } from './filter-item';
import { ChangeFn, FilterSort, Sort } from '../interfaces/config.interface';
import { ItemType } from '../enums/item-type.enum';
import { PersistanceStore } from '../classes/persistance-store';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

export const SORT_BY_FIELD = 'system_sort_by';
export const SORT_DIRECTION_FIELD = 'system_sort_direction';

export class FsFilterConfig extends Model {

  @Alias() public load = true;
  @Alias() public persist: FsFilterPersistance = false;
  @Alias() public inline = false;
  @Alias() public autofocus = false;
  @Alias() public chips = false;
  @Alias('sorts') public sortValues: any[] = null;
  @Alias() public sort: Sort = null;
  @Alias() public sortDirection = null;
  @Alias() public queryParam = false;
  @Alias() public init: ChangeFn;
  @Alias() public change: ChangeFn;
  @Alias() public reload: ChangeFn;
  @Alias() public clear: ChangeFn;
  @Alias() public sortChange: ChangeFn;
  @Alias() public case: 'snake' | 'camel' = 'snake';
  @Alias() public reloadWhenConfigChanged: boolean;
  @Alias() public button: FilterButton;

  public sortByItem: FsFilterConfigItem = null;
  public sortDirectionItem: FsFilterConfigItem = null;
  public keywordFilter = false;
  public nonKeywordFilters = false;
  public namespace: string; // for persistance

  private _items: FsFilterConfigItem[] = [];
  private _visibleItems: FsFilterConfigItem[] = [];
  private _filtersNames = [];
  private _itemsChanged$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(data: any = {}) {
    super();
    this._fromJSON(data);
  }

  get items() {
    return this._items;
  }

  get visibleItems() {
    return this._visibleItems;
  }

  get itemsChanged$(): Observable<void> {
    return this._itemsChanged$.pipe(takeUntil(this._destroy$));
  }

  get destroy$(): Observable<void> {
    return this._destroy$.asObservable();
  }

  public initItems(items: IFilterConfigItem[], route: ActivatedRoute, persistanceStore: PersistanceStore) {

    if (items && Array.isArray(items)) {

      this._items = items.map((item, index) => {

        if (index === 0 && item.type === ItemType.Text) {
          item.type = ItemType.Keyword;
        }

        if (item && item.name && this._filtersNames.indexOf(item.name) === -1) {
          this._filtersNames.push(item.name);

          const persistedValue = persistanceStore.enabled && persistanceStore.value.data;

          return new FsFilterConfigItem(item, this, route, persistedValue)
        } else {
          throw Error('Filter init error. Items name must be unique.')
        }
      });

      this._visibleItems = this.items.filter((item) => !item.hide);

      // After all the items have been created and added to this.items initalize the values
      // This is important if some item default values are dependent on others
      this.items.map((item) => {
        item.initValues();
        return item;
      });
    }

    this.initSorting(route, persistanceStore.value && persistanceStore.value.data);

    if (!this.button) {
      this.button = {};
    }

    if (this.button.label === undefined) {
      this.button.label = 'Filters';
    }

    if (this.button.icon === undefined) {
      this.button.icon = 'tune';
    }

    if (this.button.style === undefined) {
      this.button.style = 'raised';
    }

    if (this.button.color === undefined) {
      this.button.color = 'default';
    }

    if (this.clear === undefined) {
      this.clear = () => {}
    }

    this.keywordFilter = !!this.items.find(e => ItemType.Keyword === e.type);
    this.nonKeywordFilters = !!this.items.find(e => ItemType.Keyword !== e.type);
  }

  public getItem(name) {
    return this.items.find((item) => item.name === name);
  }

  public initSorting(route, persists) {
    if (this.sortValues) {
      const sortByItem = {
        name: SORT_BY_FIELD,
        type: ItemType.Select,
        label: 'Sort By',
        values: this.sortValues
      };


      if (this.sort && this.sort.value) {
        sortByItem['default'] = this.sort.value;
      }

      this.sortByItem = new FsFilterConfigItem(sortByItem, this, route, persists);
      this.sortByItem.initValues();

      const sortDirectionItem = {
        name: SORT_DIRECTION_FIELD,
        type: ItemType.Select,
        label: 'Sort Direction',
        values: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' }
        ]
      };

      if (this.sort && this.sort.direction) {
        sortDirectionItem['default'] = this.sort.direction;
      }

      this.sortDirectionItem = new FsFilterConfigItem(sortDirectionItem, this, route, persists);
      this.sortDirectionItem.initValues();
    }
  }

  public updateModelValues() {
    this.items.forEach((filter) => {
      filter.model = clone(filter.model);
    });

    if (this.sortByItem) {
      this.sortByItem.model = clone(this.sortByItem.model);
    }

    if (this.sortDirectionItem) {
      this.sortDirectionItem.model = clone(this.sortDirectionItem.model);
    }
  }

  public sgets(opts: any = {}) {
    console.info('FilterConfig.gets() is deprecated');
    return [];
  }

  public getSort(): FilterSort | null {
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

  public updateSort(sort) {
    if (sort.sortBy) {
      this.sortByItem.model = sort.sortBy;
    }

    if (sort.sortDirection) {
      this.sortDirectionItem.model = sort.sortDirection;
    }
  }

  public getFilledItems() {
    return this.items.reduce((acc, filter) => {

      switch (filter.type) {
        case ItemType.Select: {
          const multipleIsoldated = filter.multiple
            && filter.isolate
            && Array.isArray(filter.model)
            && filter.model.length
            && filter.model.indexOf('__all') === -1;

          const multipleHasSelectedValues = filter.multiple
            && Array.isArray(filter.model)
            && filter.model.length
            && filter.model.indexOf('__all') === -1;

          const selectedValues = !filter.multiple && filter.model && filter.model !== '__all';

          if (multipleIsoldated || multipleHasSelectedValues || selectedValues) {
            acc.push(filter);
          }
        } break;

        case ItemType.AutoCompleteChips:
        case ItemType.Chips: {
          if (Array.isArray(filter.model) && filter.model.length) {
            acc.push(filter);
          }
        } break;

        case ItemType.Checkbox: {
          if (filter.model) {
            acc.push(filter);
          }
        } break;

        case ItemType.Range: {
          if (filter.model && (filter.model.min || filter.model.max)) {
            acc.push(filter);
          }
        } break;

        case ItemType.DateRange: case ItemType.DateTimeRange: {
          if (filter.model && (filter.model.from || filter.model.to)) {
            acc.push(filter);
          }
        } break;

        case ItemType.Keyword: {} break;

        default: {
          if (filter.model &&
            (!isEmpty(filter.model, { zero: true }) || !isEmpty(filter.model.value, {zero: true}))
          ) {
            acc.push(filter);
          }
        }

      }

      return acc;
    }, []);
  }

  public filtersClear() {
    for (const filter of this.items) {
      filter.clear();
    }

    if (this.sortByItem) {
      if (this.sort) {
        this.sortByItem.model = this.sort.value
      } else {
        this.sortByItem.clear();
      }
    }

    if (this.sortDirectionItem) {
      if (this.sort) {
        this.sortDirectionItem.model = this.sort.direction
      } else {
        this.sortDirectionItem.clear();
      }
    }
  }

  public loadValuesForPendingItems() {
    this.items
      .filter((item) => item.hasPendingValues)
      .forEach((item) => item.loadValues(false));
  }

  public itemsChanged() {
    this._itemsChanged$.next();
  }

  public destroy() {
    this.items.forEach((item) => item.destroy());

    this._destroy$.next();
    this._destroy$.complete();
  }
}
