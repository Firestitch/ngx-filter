import { ActivatedRoute, Params, Router } from '@angular/router';

import { list as arrayList } from '@firestitch/common';
import { isArray, isEqual, isObject, pickBy } from 'lodash-es';

import { FsFilterConfig } from './filter-config';
import { parseItemValueFromStored } from '../helpers/parse-item-value-from-stored';
import { filterToQueryParam } from '../helpers/query-param-transformers';
import { getRangeName } from '../helpers/get-range-name';
import { BaseItem } from './items/base-item';
import { IFilterConfigItem } from '../interfaces/config.interface';


export class FilterParams {

  private _queryParams: Record<string, any>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _config: FsFilterConfig
  ) {}

  public get queryParams() {
    this._queryParams = this._queryParams || this.buildQueryParams();

    return this._queryParams;
  }

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

    this._config.items.forEach((filterItem: BaseItem<IFilterConfigItem>) => {
      Object.assign(params, filterItem.flattenedParams);
    });

    return params;
  }

  public updateQueryParams() {

    this._queryParams = this.buildQueryParams();

    // Update query
    this._router.navigate([], {
      replaceUrl: true,
      relativeTo: this._route,
      queryParams: this.queryParams,
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
          return  name === getRangeName(filterItem.case, filterItem.name, 'min') ||
                  name === getRangeName(filterItem.case, filterItem.name, 'max') ||
                  name === filterItem.name;

        } else if (filterItem.isTypeDateRange || filterItem.isTypeDateTimeRange) {
          return name === getRangeName(filterItem.case, filterItem.name, 'from') ||
                 name ===  getRangeName(filterItem.case, filterItem.name, 'to');
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
          flattenedParams[filterItem.name] = filterToQueryParam(filterItem.model.value, filterItem.model.name);
        }
      } else if (filterItem.isTypeAutocompleteChips || filterItem.isTypeChips) {
        if (isArray(filterItem.model) && filterItem.model.length) {
          flattenedParams[filterItem.name] = filterItem.model.map((item) => {
            return filterToQueryParam(item.value, item.name);
          }).join(',');
        }
      }
    });

    return flattenedParams;
  }
}
