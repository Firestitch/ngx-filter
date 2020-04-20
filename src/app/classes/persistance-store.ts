import { FsStore } from '@firestitch/store';
import { pickBy } from 'lodash-es';

import { isAfter, subMinutes } from 'date-fns';
import { FsFilterConfig } from '../models/filter-config';
import { FsFilterPersistanceConfig } from '../interfaces/config.interface';

const FILTER_STORE_KEY = 'fs-filter-persist';

export class PersistanceStore {

  public value: { data: any[], date: Date };

  private _enabled = false;
  private _namespace: string;
  private _openedInDialog = false;
  private _persistConfig: FsFilterPersistanceConfig;

  constructor(
    private _store: FsStore,
  ) {
    // Initialize store
    if (!this._store.get(FILTER_STORE_KEY)) {
      this._store.set(FILTER_STORE_KEY, {});
    }
  }

  public get name(): string {
    return this._persistConfig.name;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  private get _storeKey(): string {
    return this._namespace + '-persist';
  }

  private get _persists() {
    return this._store.get(FILTER_STORE_KEY)[this._storeKey] || {};
  }

  private set _persists(value) {
    const storeData = this._store.get(FILTER_STORE_KEY);
    storeData[this._storeKey] = value;

    this._store.set(FILTER_STORE_KEY, storeData);
  }

  public configUpdated(filterConfig: FsFilterConfig, inDialog: boolean) {
    this._namespace = filterConfig.namespace;
    this._openedInDialog = inDialog;
    this._enabled = filterConfig.persist !== false;

    if (typeof filterConfig.persist === 'object') {
      this._persistConfig = filterConfig.persist;
    } else {
      this._persistConfig = {};
    }
  }

  public save(data) {
    data = pickBy(data, (val) => {
      return val !== null && val !== void 0;
    });
    // if filter in dialog - we should disable persistance
    if ((this._openedInDialog && !this._namespace) || !this._enabled) {
      return;
    }

    if (this._persistConfig) {
      const persists = this._persists;
      persists[this.name] = {
        data,
        date: new Date()
      };

      this._persists = persists;
    }
  }

  /**
   * Restoring values from local storage
   */
  public restore() {
    // if filter in dialog - we should disable persistance
    if (this._openedInDialog && !this._namespace) {
      return;
    }

    // If special name wasn't defined - use current path
    if (!this._persistConfig.name) {
      this._persistConfig.name = 'default';
    }

    let value = this._persists[this.name];

    // Default value if data doesn't exists
    if (!value || !value.data) {
      value = { data: {}, date: new Date() };
    } else if (value) {
      // Check if data is too old
      if (this._persistConfig.timeout) {
        const date = new Date(value[this.name].date);

        if (isAfter(subMinutes(date, this._persistConfig.timeout), new Date())) {
          value = { data: {}, date: new Date() };
        }
      }
    }

    this.value = value;
  }

  public getData(name: string) {
    return this.value.data[name];
  }
}
