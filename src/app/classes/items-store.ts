import { Injectable, OnDestroy } from '@angular/core';
import { FilterSort, IFilterConfigItem } from '../interfaces/config.interface';
import { ItemType } from '../enums/item-type.enum';
import { SelectItem } from '../models/items/select-item';
import { ChipsItem } from '../models/items/chips-item';
import { RangeItem } from '../models/items/range-item';
import { DateRangeItem } from '../models/items/date-range-item';
import { DateTimeRangeItem } from '../models/items/date-time-range-item';
import { DateItem } from '../models/items/date-item';
import { DateTimeItem } from '../models/items/date-time-item';
import { AutocompleteItem } from '../models/items/autocomplete-item';
import { AutocompleteChipsItem } from '../models/items/autocomplete-chips-item';
import { CheckboxItem } from '../models/items/checkbox-item';
import { TextItem } from '../models/items/text-item';
import { BaseItem } from '../models/items/base-item';
import { SimpleSelectItem } from '../models/items/select/simple-select-item';
import { IFilterConfigSelectItem } from '../interfaces/items/select.interface';
import { FsFilterConfig, SORT_BY_FIELD, SORT_DIRECTION_FIELD } from '../models/filter-config';


@Injectable()
export class FsFilterItemsStore implements OnDestroy {

  public sortByItem: BaseItem<IFilterConfigItem> = null;
  public sortDirectionItem: BaseItem<IFilterConfigItem> = null;

  private _items: BaseItem<IFilterConfigItem>[] = [];
  private _visibleItems: BaseItem<IFilterConfigItem>[] = [];
  private _filtersNames = new Set<string>();

  private _hasKeyword = false;
  private _config: FsFilterConfig;

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._items;
  }

  public get visibleItems(): BaseItem<IFilterConfigItem>[] {
    return this._visibleItems;
  }

  public get hasKeyword(): boolean {
    return this._hasKeyword;
  }

  public ngOnDestroy() {
    this.items.forEach((item) => item.destroy());
  }

  public initItems(items: IFilterConfigItem[]) {
    if (Array.isArray(items)) {
      this._items = items
        .filter((item) => {
          if (this._filtersNames.has(item.name)) {
            throw Error('Filter init error. Items name must be unique.');
          } else {
            this._filtersNames.add(item.name);

            return true;
          }
        })
        .map((item, index) => {
          // const persistedValue = persistanceStore.enabled && persistanceStore.value.data;

          if (item.type === ItemType.Select) {
            return SelectItem.create(item);
          } else if (item.type === ItemType.Chips) {
            return ChipsItem.create(item as any);
          } else if (item.type === ItemType.Range) {
            return RangeItem.create(item as any);
          } else if (item.type === ItemType.DateRange) {
            return DateRangeItem.create(item as any);
          } else if (item.type === ItemType.DateTimeRange) {
            return DateTimeRangeItem.create(item as any);
          } else if (item.type === ItemType.Date) {
            return DateItem.create(item as any);
          } else if (item.type === ItemType.DateTime) {
            return DateTimeItem.create(item as any);
          } else if (item.type === ItemType.AutoComplete) {
            return AutocompleteItem.create(item as any);
          } else if (item.type === ItemType.AutoCompleteChips) {
            return AutocompleteChipsItem.create(item as any);
          } else if (item.type === ItemType.Checkbox) {
            return CheckboxItem.create(item as any);
          } else if (item.type === ItemType.Keyword || item.type === ItemType.Text) {
            if (item.type === ItemType.Keyword) {
              this._hasKeyword = true;
            }

            return TextItem.create(item as any);
          } else {
            throw new Error('ITEM');
            // return new FsFilterConfigItem(item, this, route, persistedValue)
          }
        });

      this._visibleItems = this.items
        .filter((item) => !item.isTypeKeyword && !item.hide);

      // After all the items have been created and added to this.items initalize the values
      // This is important if some item default values are dependent on others
      this.items
        .forEach((item) => {
          item.initValues();

          return item;
        });

      // this.loadValuesForPendingItems();
    }

    this.initSorting();

    // this.keywordFilter = !!this.items.find(e => ItemType.Keyword === e.type);
    // this.nonKeywordFilters = !!this.items.find(e => ItemType.Keyword !== e.type);
  }

  public initSorting() {
    if (this._config.sortValues) {
      const sortByItem = {
        name: SORT_BY_FIELD,
        type: ItemType.Select,
        label: 'Sort By',
        values: this._config.sortValues
      };


      if (this._config.sort && this._config.sort.value) {
        sortByItem['default'] = this._config.sort.value;
      }

      this.sortByItem = new SimpleSelectItem(
        sortByItem as IFilterConfigSelectItem,
        this
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
      };

      if (this._config.sort && this._config.sort.direction) {
        sortDirectionItem['default'] = this._config.sort.direction;
      }

      this.sortDirectionItem = new SimpleSelectItem(
        sortDirectionItem as IFilterConfigSelectItem,
        this
      );
      this.sortDirectionItem.initValues();
    }
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
}
