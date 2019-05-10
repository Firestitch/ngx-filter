import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, isString } from 'lodash-es';
import { FsFilterConfigItem, ItemType } from '../models/filter-item';


export class QueryParams {
  private _queryKeys = [];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _filterItems: FsFilterConfigItem[],
  ) {
    this._queryParamsToFilter(this._route.snapshot.queryParams, this._filterItems);
  }

  /**
   * Update query with filter values
   * @param filterParams
   */
  public updateQueryParams(filterParams) {
    // transform selected filter values to query string
    const newParams = this._filterToQueryParams(filterParams, this._filterItems);

    // Remove empty keys
    this._clearKeys(newParams);

    // Store query keys
    this._queryKeys = Object.keys(newParams);

    // Update query
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: newParams,
      queryParamsHandling: 'merge'
    }).then(() => {});
  }

  /**
   * Transformation for selected filter values to query string
   * @param params
   * @param items
   */
  private _filterToQueryParams(params, items: FsFilterConfigItem[]) {
    // selected filter keys
    const filterKeys = Object.keys(params);

    return filterKeys.reduce((acc, filterKey) => {

      // looking filter item
      const filterItem = items.find((item) => item.name === filterKey);

      if (filterItem) {
        if (filterItem.type === ItemType.Range) {
          acc[filterKey] = [params[filterKey].min, params[filterKey].max].join(',')
        } else if (filterItem.isTypeSelect() && filterItem.multiple && filterItem.model && filterItem.model.length > 0) {
          acc[filterKey] = filterItem.model.join(',');
        } else if (filterItem.isTypeAutocomplete()) {
          acc[filterKey] = [filterItem.model.value, filterItem.model.name].join(',');
        } else if (filterItem.type === ItemType.AutoCompleteChips) {
          acc[filterKey] = filterItem.model.map((item) => [item.value, item.name].join(',')).join(';');
        } else {
          acc[filterKey] = params[filterKey];
        }
      }

      return acc;
    }, {});
  }

  /**
   * Parse query and update filter values
   * @param params
   * @param items
   */
  private _queryParamsToFilter(params, items: FsFilterConfigItem[]) {
    this._queryKeys = Object.keys(params);

    return this._queryKeys.forEach((queryKey) => {

      const filterItem = items.find((item) => item.name === queryKey);

      if (filterItem) {
        if (filterItem.type === ItemType.Select && filterItem.multiple) {
          const values = params[queryKey]
            .split(',');

          filterItem.parseAndSetValue(values);
        } else if (filterItem.type === ItemType.Range) {
          if (params[queryKey] && isString(params[queryKey])) {
            const filterParts = params[queryKey].split(',');
            filterItem.model = {
              min: filterParts[0],
              max: filterParts[1]
            };
          }
        } else if (filterItem.type === ItemType.Chips) {
          const chipIds = params[queryKey]
            .split(',')
            .map((value) => +value);

          filterItem.parseAndSetValue(chipIds);
        } else if (filterItem.type === ItemType.Checkbox) {
          filterItem.parseAndSetValue(params[queryKey] === 'true');
        } else if (filterItem.type === ItemType.AutoComplete) {
          const filterParts = params[queryKey].split(',');

          filterItem.model = {
            name: filterParts[1],
            value: +filterParts[0]
          }
        } else if (filterItem.type === ItemType.AutoCompleteChips) {
          const filterParts = params[queryKey].split(';');

          filterItem.model = filterParts.reduce((acc, value) => {

            const chipParts = value.split(',');

            acc.push({
              name: chipParts[1],
              value: +chipParts[0],
            });

            return acc;
          }, [])

        } else {
          filterItem.parseAndSetValue(params[queryKey]);
        }
      }
    });
  }

  private _clearKeys(params) {
    this._queryKeys.forEach((key) => {
      if (!params[key]) {
        params[key] = null;
      }
    })
  }
}
