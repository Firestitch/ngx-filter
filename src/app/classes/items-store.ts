import { Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FilterSort, IFilterConfigItem } from '../interfaces/config.interface';
import { ItemType } from '../enums/item-type.enum';
import { BaseItem } from '../models/items/base-item';
import { SimpleSelectItem } from '../models/items/select/simple-select-item';
import { IFilterConfigSelectItem } from '../interfaces/items/select.interface';
import { FsFilterConfig, SORT_BY_FIELD, SORT_DIRECTION_FIELD } from '../models/filter-config';
import { createFilterItem } from '../helpers/create-filter-item';


@Injectable()
export class FsFilterItemsStore implements OnDestroy {

  public sortByItem: BaseItem<IFilterConfigItem> = null;
  public sortDirectionItem: BaseItem<IFilterConfigItem> = null;

  private _items: BaseItem<IFilterConfigItem>[] = [];
  private _visibleItems: BaseItem<IFilterConfigItem>[] = [];
  private _filtersNames = new Set<string>();

  private _hasKeyword = false;
  private _config: FsFilterConfig;

  private _itemsChange$ = new Subject();

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._items;
  }

  public get visibleItems(): BaseItem<IFilterConfigItem>[] {
    return this._visibleItems;
  }

  public get hasKeyword(): boolean {
    return this._hasKeyword;
  }

  public get itemsChange$() {
    return this._itemsChange$.pipe(debounceTime(30));
  }

  public ngOnDestroy() {
    this.items.forEach((item) => item.destroy());
  }

  public initItems(items: IFilterConfigItem[]) {
    if (Array.isArray(items)) {
      this._createItems(items);
      this._updateVisibleItems();

      // After all the items have been created and added to this.items initalize the values
      // This is important if some item default values are dependent on others
      this._initItemValues();
    }

    this._createSortingItems();

    this._subscribeToItemsChanges();
  }

  public setConfig(config) {
    this._config = config;
  }

  public filtersClear() {
    this.items.forEach((item) => {
      item.clear();
    });

    if (this.sortByItem) {
      if (this._config.sort) {
        this.sortByItem.model = this._config.sort.value
      } else {
        this.sortByItem.clear();
      }
    }

    if (this.sortDirectionItem) {
      if (this._config.sort) {
        this.sortDirectionItem.model = this._config.sort.direction
      } else {
        this.sortDirectionItem.clear();
      }
    }
  }

  public loadAsyncValues() {
    this.items
      .filter((item) => item.hasPendingValues)
      .forEach((item) => item.loadAsyncValues());
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

  private _createItems(items: IFilterConfigItem[]) {
    this._items = items
      .filter((item) => {
        if (this._filtersNames.has(item.name)) {
          throw Error('Filter init error. Items name must be unique.');
        } else {
          this._filtersNames.add(item.name);

          return true;
        }
      })
      .map((item) => {
        const filterItem = createFilterItem(item);

        if (filterItem.type === ItemType.Keyword) {
          this._hasKeyword = true;
        }

        return filterItem;
      });

  }

  private _subscribeToItemsChanges() {
    this.items
      .forEach((item) => {
        item.value$
          .pipe(
            distinctUntilChanged(),
            takeUntil(item.destroy$)
          )
          .subscribe(() => {
            this._itemsChange$.next(item);
          })
      });
  }

  private _updateVisibleItems() {
    this._visibleItems = this.items
      .filter((item) => !item.isTypeKeyword && !item.hide);
  }

  private _initItemValues() {
    this.items
      .forEach((item) => {
        item.initValues();
      });
  }

  private _createSortingItems() {
    if (this._config.sortValues) {
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
      this.sortByItem.initValues();

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
      this.sortDirectionItem.initValues();
    }
  }
}
