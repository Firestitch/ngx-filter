import { isEmpty, list as arrayList } from '@firestitch/common';
import { Alias, Model } from 'tsmodels';

import { Observable, Subject } from 'rxjs';

import { isValid, isDate, format } from 'date-fns';
import { isObject, clone } from 'lodash-es';

import { FsFilterConfigItem, ItemType } from './filter-item';
import { simpleFormat } from '@firestitch/date';

export const SORT_BY_FIELD = 'system_sort_by';
export const SORT_DIRECTION_FIELD = 'system_sort_direction';

export class FsFilterConfig extends Model {

  @Alias() public load = true;
  @Alias() public persist: any = false;
  @Alias() public inline = false;
  @Alias() public autofocus = false;
  @Alias('sorting') public sortingValues: any[] = null;
  @Alias() public sortingDirection = null;
  @Alias() public namespace = 'filter';
  @Alias() public init: Function;
  @Alias() public change: Function;
  @Alias() public reload: Function;
  @Alias() public sortChange: Function;

  public items: FsFilterConfigItem[] = [];
  public sortByItem: FsFilterConfigItem = null;
  public sortDirectionItem: FsFilterConfigItem = null;
  public searchInput = null;
  public singleTextFilter = false;

  private _filtersNames = [];
  private _destroy$ = new Subject<void>();

  constructor(data: any = {}) {
    super();

    this._fromJSON(data);
  }

  get destroy$(): Observable<void> {
    return this._destroy$.asObservable();
  }

  public initItems(items, route, persists) {
    if (items && Array.isArray(items)) {

      this.items = items.map((item) => {

        if (item && item.name && this._filtersNames.indexOf(item.name) === -1) {
          this._filtersNames.push(item.name);

          return new FsFilterConfigItem(item, this, route, persists)
        } else {
          throw Error('Filter init error. Items name must be uniq.')
        }

      });
    }

    this.initSorting(route, persists);

    this.searchInput = this.items.find((item) => item.type === ItemType.text);

    if (this.items.length === 1 && this.items[0].type === ItemType.text) {
      this.singleTextFilter = true;
    }
  }

  public initSorting(route, persists) {
    if (this.sortingValues) {
      const sortByItem = {
        name: SORT_BY_FIELD,
        type: ItemType.select,
        label: 'Sort By',
        values: this.sortingValues
      };


      const defaultSortBy = this.sortingValues.find((value: any) => value.default);
      if (defaultSortBy && defaultSortBy.value) {
        sortByItem['default'] = defaultSortBy.value;
      }

      this.sortByItem = new FsFilterConfigItem(sortByItem, this, route, persists);

      const sortDirectionItem = {
        name: SORT_DIRECTION_FIELD,
        type: ItemType.select,
        label: 'Sort Direction',
        values: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' }
        ]
      };

      if (this.sortingDirection) {
        sortDirectionItem['default'] = this.sortingDirection;
      }

      this.sortDirectionItem = new FsFilterConfigItem(sortDirectionItem, this, route, persists);
    }
  }

  public gets(opts: any = {}) {

    const query = {};

    for (const filter of this.items) {

      let value = clone(filter.model);

      if (filter.type == ItemType.select) {

        if (filter.multiple) {

          if (filter.isolate) {
            if (!Array.isArray(filter.model) || !filter.model.length) {
              value = arrayList(filter.values, 'value');
            }
          }

          if (filter.model.indexOf('__all') > -1) {
            value = null;
          }

        } else {

          if (filter.isolate) {
            if (filter.model == '__all') {
              value = arrayList(filter.values, 'value');
            }
          } else {
            if (filter.model == '__all') {
              value = null;
            }
          }
        }
      } else if (filter.type == ItemType.autocompletechips) {
        if (Array.isArray(filter.model) && filter.model.length && !opts.expand) {
          value = arrayList(filter.model, 'value');
        }
      } else if (filter.type == ItemType.checkbox) {
        value = filter.model ? filter.checked : filter.unchecked;
      }

      // @TODO
      if (isEmpty(value, { zero: true })) {
        continue;
      }

      if (filter.type == ItemType.date || filter.type == ItemType.datetime) {

        if (value && isValid(value) && isDate(value)) {
          value = simpleFormat(value);
        }

      } else if (filter.type == ItemType.daterange || filter.type == ItemType.datetimerange) {

        const from = value.from;
        const to = value.to;

        value = {};
        if (from) {
          value.from = format(from, 'yyyy-MM-dd\THH:mm:ssxxxxx');
        }

        if (to) {
          value.to = format(to, 'yyyy-MM-dd\THH:mm:ssxxxxx');
        }

      } else if (filter.type == ItemType.autocomplete) {

        if (isEmpty(filter.model.value, {zero: true})) {
          continue;
        }

        value = opts.expand ? filter.model : filter.model.value;
      }

      if (isObject(filter.names) && opts.names !== false) {
        for (const key in filter.names) {
          if (value[filter.names[key]]) {
            query[key] = value[filter.names[key]];
          }
        }
      } else {
        query[filter.name] = value;
      }
    }

    if (opts.flatten) {
      for (const name in query) {
        if (Array.isArray(query[name])) {
          query[name] = query[name].join(',');
        }
      }
    }

    return query;
  }

  public getSorting() {
    return {
      sortBy: this.sortByItem.model,
      sortDirection: this.sortDirectionItem.model,
    }
  }

  public updateSorting(sorting) {
    if (sorting.sortBy) {
      this.sortByItem.model = sorting.sortBy;
    }

    if (sorting.sortDirection) {
      this.sortDirectionItem.model = sorting.sortDirection;
    }
  }

  public countOfFilledItems() {
    return this.items.reduce((counter, filter) => {

      switch (filter.type) {
        case ItemType.select: {

          if (
            (filter.multiple && filter.isolate && Array.isArray(filter.model) && filter.model.length) ||
            (
              filter.multiple &&
              Array.isArray(filter.model) &&
              filter.model.length &&
              filter.model.indexOf('__all') === -1
            ) ||
            (!filter.multiple && filter.model && filter.model !== '__all')
          ) {
            counter++;
          }
        } break;

        case ItemType.autocompletechips: {
          if (Array.isArray(filter.model) && filter.model.length) {
            counter++;
          }
        } break;

        case ItemType.checkbox: {
          if (filter.model) {
            counter++;
          }
        } break;

        case ItemType.daterange: case ItemType.datetimerange: {
          if (filter.model.from || filter.model.to) {
            counter++;
          }
        } break;

        default: {
          if (filter.model &&
            filter !== this.searchInput &&
            (!isEmpty(filter.model, {zero: true}) || !isEmpty(filter.model.value, {zero: true}))
          ) {
            counter++;
          }
        }

      }

      return counter;
    }, 0);
  }

  public filtersClear() {
    for (const filter of this.items) {
      filter.model = undefined;

      switch (filter.type) {
        case ItemType.autocomplete: {
          filter.model = null;
          filter.search = '';
        } break;

        case ItemType.autocompletechips: {
          filter.model = [];
          filter.search = '';
        } break;

        case ItemType.checkbox: {
          filter.model = false;
        } break;

        case ItemType.select: {
          if (filter.multiple) {
            filter.model = [];
          } else {
            filter.model = Array.isArray(filter.values) && filter.values.some((val) => val.value === '__all')
              ? '__all'
              : null;
          }

          if (filter.isolate) {
            filter.isolate.enabled = false;
          }
        } break;

        case ItemType.range: {
          filter.model = {};
        } break;

        case ItemType.text: {
          filter.model = '';
        } break;

        case ItemType.date: case ItemType.datetime: {
          filter.model = null;
        } break;
      }
    }
  }

  public loadValuesForPendingItems() {
    this.items
      .filter((item) => item.hasPendingValues)
      .forEach((item) => item.loadRemoteValues());
  }

  public destroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
