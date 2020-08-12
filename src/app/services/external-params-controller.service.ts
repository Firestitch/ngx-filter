import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { list as arrayList } from '@firestitch/common';

import { isEqual, isObject } from 'lodash-es';

import { FsFilterConfig } from '../models/filter-config';
import { MultipleSelectItem } from '../models/items/select/multiple-select-item';
import { filterToQueryParam } from '../helpers/query-param-transformers';

import { FsFilterItemsStore } from './items-store.service';
import { PersistanceParamsController } from './external-params/persistance-params-controller.service';
import { QueryParamsController } from './external-params/query-params-controller.service';


@Injectable()
export class ExternalParamsController {

  private _config: FsFilterConfig

  constructor(
    private _itemsStore: FsFilterItemsStore,
    private _persistanceStore: PersistanceParamsController,
    private _queryParams: QueryParamsController,
    private _route: ActivatedRoute,
  ) {}

  public get params() {
    const result = {};

    if (this._persistanceStore.enalbed) {
      Object.assign(result, this._persistanceStore.value?.data);
    }

    if (this._queryParams.enabled) {
      Object.assign(result, this._queryParams.fetchedParams);
    }

    return result;
  }

  public setConfig(config) {
    this._config = config;

    this._initPersistance();
    this._initQueryParams();

    this._sync();

    this._initItemsValues();

    this._listenItemsChange();
  }

  private _sync() {

  }

  private _initPersistance() {
    this._persistanceStore.init(
      this._config.persist,
      this._config.namespace,
      this._config.case
    );
  }

  private _initQueryParams() {
    this._queryParams.init(this._config.queryParam, this._config.case);
  }

  private _initItemsValues() {
    this._itemsStore._initItemValues(this.params);

    const params = this.buildQueryParams();
    this._queryParams.writeStateToQueryParams(params);
    this._persistanceStore.save(params);
  }

  private _listenItemsChange() {
    this._itemsStore
      .itemsChange$
      .subscribe(() => {
        const params = this.buildQueryParams();

        this._queryParams.writeStateToQueryParams(params);
        this._persistanceStore.save(params);
      });
  }

  public buildQueryParams() {
    const flattenedParams = this._itemsStore.valuesAsQuery();

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
        if (Array.isArray(filterItem.model) && filterItem.model.length) {
          flattenedParams[filterItem.name] = filterItem.model.map((item) => {
            return filterToQueryParam(item.value, item.name);
          }).join(',');
        }
      }
    });

    return flattenedParams;
  }
}
