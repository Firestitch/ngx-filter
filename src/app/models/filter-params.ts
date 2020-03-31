import { ActivatedRoute, Params, Router } from '@angular/router';
import { isArray, isEqual, isObject, pickBy } from 'lodash-es';
import { list as arrayList } from '@firestitch/common';

import { FsFilterConfigItem } from '../models/filter-item';
import { ItemType } from '../enums/item-type.enum';


export class FilterParams {

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _filterItems: FsFilterConfigItem[],
  ) {}

  public getValues() {

    const values = {};
    this._filterItems.forEach(filter => {
      values[filter.name] = filter.value;
    });

    return values;
  }

  public getFlattenedParams() {
    const params = this.getRawFlattenedParams();

    return pickBy(params, (val) => {
      return val !== null && val !== void 0;
    });
  }

  public getRawFlattenedParams() {
    const params = {};

    this._filterItems.forEach((filterItem: FsFilterConfigItem) => {
      Object.assign(params, filterItem.flattenedParams);
    });

    return params;
  }

  public updateQueryParams() {

    const flattenedParams = this.getRawFlattenedParams();

    this._filterItems.forEach(filterItem => {

      if (filterItem.isTypeSelect && filterItem.isolate) {
        if (filterItem.multiple && filterItem.value) {
          const isolated = arrayList(filterItem.values, 'value').sort();
          const value = filterItem.value.sort();

          if (isEqual(value, isolated)) {
            flattenedParams[filterItem.name] = null;
          }
        }
      }

      if (filterItem.isTypeAutocomplete) {
        if (isObject(filterItem.model)) {
          flattenedParams[filterItem.name] = filterItem.model.value + ':' + filterItem.model.name;
        }
      } else if (filterItem.isTypeAutocompleteChips) {
        if (isArray(filterItem.model) && filterItem.model.length) {
          flattenedParams[filterItem.name] = filterItem.model.map((item) => {
            return item.value + ':' + item.name;
          }).join(',');
        }
      }
    });

    // Update query
    this._router.navigate([], {
      replaceUrl: true,
      relativeTo: this._route,
      queryParams: flattenedParams,
      queryParamsHandling: 'merge',
    }).then(() => {});
  }

  /**
   * Parse query and update filter values
   * @param params
   */
  public updateFromQueryParams(params: Params) {
    Object.keys(params).forEach((name) => {

      const foundItem = this._filterItems.find(filterItem => {

        if (filterItem.isTypeRange) {
          return  name === filterItem.name.concat('_min') ||
                  name === filterItem.name.concat('_max') ||
                  name === filterItem.name;

        } else if (filterItem.isTypeDateRange || filterItem.isTypeDateTimeRange) {
          return name === filterItem.name.concat('_from') || name === filterItem.name.concat('_to');
        }

        return filterItem.name === name;
      });

      if (foundItem) {
        this._fillFilterItemWithQueryValue(foundItem, params);
      }
    });
  }

  private _fillFilterItemWithQueryValue(item, params) {
    const param = params[name];

    switch (item.type) {
      case ItemType.Range: {
        const min = params[item.name + '_min'];
        const max = params[item.name + '_max'];

        item.model = { min: min, max: max };
      } break;

      case ItemType.DateRange: case ItemType.DateTimeRange: {
        const from = params[item.name + '_from'];
        const to = params[item.name + '_to'];

        item.model = { from: from, to: to };
      } break;

      case ItemType.Select: {
        if (item.multiple) {
          if (item.isolate && param === item.isolate.value) {
            item.model = [param];
            item.isolate.enabled = true;
          } else {
            item.model = param.split(',');
          }
        }
      } break;

      case ItemType.Chips: {
        item.model = param
          .split(',')
          .map((value) => +value);
      } break;

      case ItemType.Checkbox: {
        item.model = param;
      } break;

      case ItemType.AutoComplete: {
        const filterParts = param.split(':');

        item.model = {
          name: filterParts[1],
          value: +filterParts[0]
        }
      } break;

      case ItemType.AutoCompleteChips: {
        const filterParts = param.split(',');

        item.model = filterParts.reduce((arry, value) => {

          const chipParts = value.split(':');

          arry.push({
            name: chipParts[1],
            value: +chipParts[0],
          });

          return arry;
        }, [])
      } break;

      default: {
        item.model = param;
      }
    }
  }
}
