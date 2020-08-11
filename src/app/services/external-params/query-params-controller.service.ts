import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { list as arrayList } from '@firestitch/common';

import { RangeItem } from '../../models/items/range-item';
import { getRangeName } from '../../helpers/get-range-name';
import { DateRangeItem } from '../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';
import { parseItemValueFromStored } from '../../helpers/parse-item-value-from-stored';
import { MultipleSelectItem } from '../../models/items/select/multiple-select-item';
import { FsFilterItemsStore } from '../../classes/items-store';
import { filterToQueryParam } from '../../helpers/query-param-transformers';
import { isArray, isEqual, isObject, pickBy } from 'lodash-es';
import { BaseItem } from '../../models/items/base-item';
import { IFilterConfigItem } from '../../interfaces/config.interface';


@Injectable()
export class QueryParamsController {

  private _enabled = false;
  private _paramsCase: 'snake' | 'camel';
  private _queryParams: Record<string, any>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _itemsStore: FsFilterItemsStore
  ) {}

  public get enabled(): boolean {
    return this._enabled;
  }

  public get queryParams() {
    // this._queryParams = this._queryParams || this.buildQueryParams();

    return this._queryParams;
  }

  public init(enabled: boolean, paramsCase: 'snake' | 'camel') {
    this._enabled = enabled;
    this._paramsCase = paramsCase;

    if (this.enabled) {
      this.fetchFromQueryParams();
    }
  }

  public writeStateToQueryParams(d) {
    debugger;
    if (!this._enabled) { return }

    const params = d;

    // Update query
    this._router.navigate([], {
      replaceUrl: true,
      relativeTo: this._route,
      queryParams: params,
      queryParamsHandling: 'merge',
    }).then(() => {});
  }

  /**
   * Parse query and update filter values
   */
  public fetchFromQueryParams() {
    const params = this._route.snapshot.queryParams;
    const result = {};

    Object.keys(params)
      .forEach((name) => {
        const foundItem = this._itemsStore.items
          .find((filterItem) => {
            if (filterItem instanceof RangeItem) {
              return  name === getRangeName(filterItem.case, filterItem.name, 'min') ||
                name === getRangeName(filterItem.case, filterItem.name, 'max') ||
                name === filterItem.name;
            } else if (filterItem instanceof DateRangeItem || filterItem instanceof DateTimeRangeItem) {
              return name === getRangeName(filterItem.case, filterItem.name, 'from') ||
                name ===  getRangeName(filterItem.case, filterItem.name, 'to');
            }

            return filterItem.name === name;
          });

        if (foundItem) {
          result[foundItem.name] = parseItemValueFromStored(foundItem, params, this._paramsCase);
        }
    });

    this._queryParams = result;
  }

  public buildQueryParams(d) {
    const flattenedParams = d;

    this._itemsStore.items.forEach(filterItem => {

      if (filterItem instanceof MultipleSelectItem && filterItem.isolate) {
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
