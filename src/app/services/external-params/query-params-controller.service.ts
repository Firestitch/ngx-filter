import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { restoreItems } from '../../helpers/restore-items';
import { FsFilterItemsStore } from '../items-store.service';


@Injectable()
export class QueryParamsController {

  private _enabled = false;
  private _paramsCase: 'snake' | 'camel';
  private _fetchedParams: Record<string, any>;

  constructor(
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
    if (this._enabled) { 
      this._replaceState(params);
    }
  }

  /**
   * Parse query and update filter values
   */
  public fetchFromQueryParams() {
    const items = [
      ...this._itemsStore.items,
      this._itemsStore.sortByItem,
      this._itemsStore.sortDirectionItem,
    ].filter((item) => !!item);

    this._fetchedParams = restoreItems(
      this._route.snapshot.queryParams,
      items,
      this._paramsCase
    );
  }

  private _replaceState(data) {
    const url = new URL(window.location.href);

    Object.keys(data)
      .filter((name) => data[name] !== undefined && data[name] !== null)
      .forEach((name) => {
        url.searchParams.set(name,data[name]);
      });

    history.replaceState({}, null, url.pathname + url.search);
  }
}
