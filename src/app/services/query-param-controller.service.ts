import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { restoreItems } from '../helpers/restore-items';

import { ItemStore } from './item-store.service';


@Injectable()
export class QueryParamController {

  private _enabled = false;
  private _params: Record<string, any>;

  constructor(
    private _route: ActivatedRoute,
    private _itemStore: ItemStore,
  ) {}

  public get enabled(): boolean {
    return this._enabled;
  }

  public get params() {
    return this._params;
  }

  public init(enabled: boolean) {
    this._enabled = enabled;

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
      ...this._itemStore.items,
      this._itemStore.sortByItem,
      this._itemStore.sortDirectionItem,
    ]
      .filter((item) => !!item);

    this._params = restoreItems(
      this._route.snapshot.queryParams,
      items,
    );
  }

  private _replaceState(data) {
    const url = new URL(window.location.href);

    Object.keys(data)
      .forEach((name) => {
        if(data[name] === undefined || data[name] === null) {
          url.searchParams.delete(name);
        } else {
          url.searchParams.set(name,data[name]);
        }
      });

    history.replaceState({}, null, url.pathname + url.search);
  }
}
