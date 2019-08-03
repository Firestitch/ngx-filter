import { ActivatedRoute, Router, Params } from '@angular/router';
import { pickBy, isEqual, isObject, isArray } from 'lodash-es';
import { list as arrayList } from '@firestitch/common';
import { FsFilterConfigItem } from '../models/filter-item';


export class FilterParams {

  private _preserveParams = {}

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

  public getFlattenedParams(options: any = {}) {

    const params = {};
    this._filterItems.forEach((filterItem: FsFilterConfigItem) => {
      Object.assign(params, filterItem.flattenedParams);
    });

    return pickBy(params);
  }

  public updateQueryParams() {

    const flattenedParams = this.getFlattenedParams();

    this._filterItems.forEach(filterItem => {

      if (filterItem.isTypeSelect && filterItem.isolate) {

        const isolated = arrayList(filterItem.values, 'value').sort();
        const value = filterItem.value.sort();

        if (isEqual(value, isolated)) {
          flattenedParams[filterItem.name] = null;
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

    const params = Object.assign(
        {},
        this._preserveParams,
        flattenedParams);

    // Update query
    this._router.navigate([], {
      replaceUrl: true,
      relativeTo: this._route,
      queryParams: params
    }).then(() => {});
  }

  /**
   * Parse query and update filter values
   * @param params
   * @param items
   */
  public updateFromQueryParams(params: Params) {

    Object.keys(params).forEach((name) => {

      const found = this._filterItems.some(filterItem => {

        if (filterItem.isTypeRange) {
          return  name === filterItem.name.concat('_min') ||
                  name === filterItem.name.concat('_max') ||
                  name === filterItem.name;

        } else if (filterItem.isTypeDateRange || filterItem.isTypeDateTimeRange) {
          return name === filterItem.name.concat('_from') || name === filterItem.name.concat('_to');
        }

        return filterItem.name === name;
      });

      if (!found) {
        this._preserveParams[name] = params[name];
      }
    });

    this._filterItems.forEach(filterItem => {

      const param = params[filterItem.name];

      if (filterItem.isTypeRange) {

        const min = params[filterItem.name + '_min'];
        const max = params[filterItem.name + '_max'];

        filterItem.model = { min: min, max: max };

      } else if (filterItem.isTypeDateRange || filterItem.isTypeDateTimeRange) {

        const from = params[filterItem.name + '_from'];
        const to = params[filterItem.name + '_to'];

        filterItem.model = { from: from, to: to };

      } else if (param) {

        if (filterItem.isTypeSelect && filterItem.multiple) {

          if (filterItem.isolate && param === filterItem.isolate.value) {
            filterItem.model = [param];
            filterItem.isolate.enabled = true;
          } else {
            filterItem.model = param.split(',');
          }

        } else if (filterItem.isTypeChips) {

            filterItem.model = param
                                .split(',')
                                .map((value) => +value);

        } else if (filterItem.isTypeCheckbox) {
          filterItem.model = param;

        } else if (filterItem.isTypeAutocomplete) {
          const filterParts = param.split(':');

          filterItem.model = {
            name: filterParts[1],
            value: +filterParts[0]
          }
        } else if (filterItem.isTypeAutocompleteChips) {
          const filterParts = param.split(',');

          filterItem.model = filterParts.reduce((arry, value) => {

            const chipParts = value.split(':');

            arry.push({
              name: chipParts[1],
              value: +chipParts[0],
            });

            return arry;
          }, [])

        } else {
          filterItem.model = param;
        }
      }
    });
  }
}
