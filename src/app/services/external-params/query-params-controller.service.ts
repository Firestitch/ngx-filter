import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsFilterItemsStore } from '../items-store.service';
import { restoreItems } from '../../helpers/restore-items';


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
}
