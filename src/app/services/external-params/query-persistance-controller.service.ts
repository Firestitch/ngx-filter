import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { getNormalizedPath } from '@firestitch/common';
import { FsStore } from '@firestitch/store';

import { FsFilterPersistance, FsFilterPersistanceConfig } from '../../interfaces';
import { FsFilterConfig } from '../../models/filter-config';


@Injectable()
export class QueryPersistanceController {

  public queryEnabled = false;

  private _store = inject(FsStore);
  private _name: string;
  private _data: any = {};
  private _location = inject(Location);
  private readonly _storeKey = 'fs-filter-persist';

  public setConfig(filterConfig: FsFilterConfig, inDialog: boolean) {
    const config = this._initConfig(filterConfig.persist, inDialog);

    if(config) {
      this.queryEnabled = config.queryEnabled;
      this._name = config.name;
      this._data = this._get() || {};
    }
  }

  public setQuery(value: any) {
    this._set('query', value);
  }

  public getQuery() {
    return this._data.query || {};
  }

  private _set(key: string, value: any) {
    this._data[key] = value;
    const storeData = this._store.get(this._storeKey) || {};
    storeData[this._name] = this._data;

    this._store.set(this._storeKey, storeData);
  }

  private _get() {
    const storeData = this._store.get(this._storeKey);

    if (storeData) {
      return storeData[this._name];
    }
 
    return {};
  }

  private _initConfig(config: FsFilterPersistance, inDialog: boolean): FsFilterPersistanceConfig {
    let persistanceConfig = this._getConfig(config);

    if(persistanceConfig) {
      persistanceConfig = {
        name: persistanceConfig.name || getNormalizedPath(this._location),
        queryEnabled: !inDialog || !!persistanceConfig.name,
        ...persistanceConfig,
      };
    }
  
    return persistanceConfig;
  }

  private _getConfig(config: FsFilterPersistance): FsFilterPersistanceConfig {
    if(config) {
      return {
        ...(config === true ? {} : config),
      };
    }

    return null;
  }

}

