import { FsFilterConfig } from './filter-config';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isArray, isEqual, isObject, pickBy } from 'lodash-es';
import { list as arrayList } from '@firestitch/common';

import { FsFilterConfigItem } from '../models/filter-item';
import { parseItemValueFromStored } from '../helpers/parse-item-value-from-stored';


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
        parseItemValueFromStored(foundItem, params);
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
}
