import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FsStore } from '@firestitch/store';
import { isAfter, subMinutes } from 'date-fns';
import { pickBy } from 'lodash-es';

import { FsFilterPersistance, FsFilterPersistanceConfig } from '../interfaces/config.interface';


@Injectable()
export class PersistanceStoreBase<T extends FsFilterPersistance> {

  protected _value: { data: any[], date: Date };
  protected _enabled = false;
  protected _namespace: string;
  protected _openedInDialog = false;
  protected _persistConfig: FsFilterPersistanceConfig;

  protected STORE_KEY: string;

  constructor(
    protected _store: FsStore,
    protected _route: ActivatedRoute,
  ) {
    // Initialize store
    if (!this._store.get(this.STORE_KEY)) {
      this._store.set(this.STORE_KEY, {});
    }
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public get value(): { data: any[], date: Date } {
    return this._value;
  }

  public get namespace(): string {
    return this._namespace;
  }

  private get _persists() {
    const storeData = this._store.get(this.STORE_KEY);

    if (storeData) {
      return storeData[this._namespace];
    } else {
      return {};
    }
  }

  private set _persists(value) {
    const storeData = this._store.get(this.STORE_KEY) || {};
    storeData[this._namespace] = value;

    this._store.set(this.STORE_KEY, storeData);
  }

  public configUpdated(persistanceConfig: T, namespace: string, inDialog = false) {
    this._namespace = namespace;
    this._openedInDialog = inDialog;

    if (typeof persistanceConfig === 'object') {
      this._persistConfig = { ...persistanceConfig } as FsFilterPersistanceConfig;
    } else {
      this._persistConfig = {};
    }

    if (this._route.snapshot.queryParams.persist === 'clear') {
      this.save({}, true);
    }

    // if filter in dialog - we should disable persistance
    if (
      this._route.snapshot.queryParams.persist !== 'disable'
      && persistanceConfig
      && !this._openedInDialog
    ) {
      this._enabled = true;
    }
  }

  public save(data, force = false) {
    if (!this._enabled && !force) {
      return;
    }

    data = pickBy(data, (val) => {
      return val !== null && val !== void 0;
    });

    // if filter in dialog - we should disable persistance
    if (!this._namespace && !force) {
      return;
    }

    this._persists = {
      data,
      date: new Date()
    };
  }

  /**
   * Restoring values from local storage
   */
  public restore() {
    if (!this.enabled) {
      return;
    }

    let value = this._persists;

    // Default value if data doesn't exists
    if (!value || !value.data) {
      value = { data: {}, date: new Date() };
    } else if (value) {
      // Check if data is too old
      if (this._persistConfig.timeout) {
        const date = new Date(value.date);

        if (isAfter(subMinutes(date, this._persistConfig.timeout), new Date())) {
          value = { data: {}, date: new Date() };
        }
      }
    }

    this._value = value;
  }

  public getDataForScope(name: string) {
    return this.value.data[name];
  }

  public setDataForScope(name: string, value: any) {
    this.value.data = {
      ...this.value.data,
      [name]: value
    };

    this.save(this.value.data);
  }

}
