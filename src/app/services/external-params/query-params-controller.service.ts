import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { RangeItem } from '../../models/items/range-item';
import { getRangeName } from '../../helpers/get-range-name';
import { DateRangeItem } from '../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';
import { parseItemValueFromStored } from '../../helpers/parse-item-value-from-stored';
import { FsFilterItemsStore } from '../items-store.service';


@Injectable()
export class QueryParamsController {

  private _enabled = false;
  private _paramsCase: 'snake' | 'camel';
  private _fetchedParams: Record<string, any>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _itemsStore: FsFilterItemsStore
  ) {}

  public get enabled(): boolean {
    return this._enabled;
  }

  public get fetchedParams() {
    return this._fetchedParams;
  }

  public init(enabled: boolean, paramsCase: 'snake' | 'camel') {
    this._enabled = enabled;
    this._paramsCase = paramsCase;

    if (this.enabled) {
      this.fetchFromQueryParams();
    }
  }

  public writeStateToQueryParams(params) {
    if (!this._enabled) { return }

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

    this._fetchedParams = result;
  }
}
