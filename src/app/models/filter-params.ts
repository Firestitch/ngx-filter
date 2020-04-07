import { FsFilterConfig } from './filter-config';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isArray, isEqual, isObject, pickBy } from 'lodash-es';
import { list as arrayList } from '@firestitch/common';

import { FsFilterConfigItem } from '../models/filter-item';
import { ItemType } from '../enums/item-type.enum';


export class FilterParams {

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _config: FsFilterConfig
  ) {}

  public getValues() {

    const values = {};
    this._config.items.forEach(filter => {
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

    this._config.items.forEach((filterItem: FsFilterConfigItem) => {
      Object.assign(params, filterItem.flattenedParams);
    });

    return params;
  }

  public updateQueryParams() {

    const flattenedParams = this.buildQueryParams();

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

      const foundItem = this._config.items.find(filterItem => {

        if (filterItem.isTypeRange) {
          return  name === filterItem.getRangeName('min') ||
                  name === filterItem.getRangeName('max') ||
                  name === filterItem.name;

        } else if (filterItem.isTypeDateRange || filterItem.isTypeDateTimeRange) {
          return name === filterItem.getRangeName('from') ||
                 name ===  filterItem.getRangeName('to');
        }

        return filterItem.name === name;
      });

      if (foundItem) {
        this._fillFilterItemWithQueryValue(foundItem, params);
      }
    });
  }

  public buildQueryParams() {
    const flattenedParams = this.getRawFlattenedParams();

    this._config.items.forEach(filterItem => {

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

    return flattenedParams;
  }

  private _fillFilterItemWithQueryValue(item, params) {
    const param = params[item.name];

    switch (item.type) {
      case ItemType.Range: {
        const min = params[item.getRangeName('min')];
        const max = params[item.getRangeName('max')];

        item.model = { min: min, max: max };
      } break;

      case ItemType.DateRange: case ItemType.DateTimeRange: {
        const from = params[item.getRangeName('from')];
        const to = params[item.getRangeName('to')];

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
        } else {
          item.model = param;
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
