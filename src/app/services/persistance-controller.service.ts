import { Location } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';

import { getNormalizedPath } from '@firestitch/common';
import { DrawerRef } from '@firestitch/drawer';
import { FsStore } from '@firestitch/store';

import { Observable, of } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FsFilterPersistance, FsFilterPersistanceConfig } from '../interfaces';

import { FilterController } from './filter-controller.service';


@Injectable()
export class PersistanceController {

  private _store = inject(FsStore);
  private _filterController: FilterController;
  private _name: string;
  private _data: any = {};
  private readonly _location = inject(Location);
  private readonly _storeKey = 'fs-filter-persist';
  private readonly _dialogRef = inject(MatDialogRef, { optional: true });
  private readonly _drawerRef = inject(DrawerRef, { optional: true });  
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _route = inject(ActivatedRoute);
  
  public get enabled() {
    return !this._dialogRef && 
      !this._drawerRef && 
      this._route.snapshot.queryParams.persist !== 'disable' &&
      this._filterController.config.persist;
  }

  public init(filterController: FilterController): Observable<any> {
    this._filterController = filterController;

    if (this.enabled) {    
      const persistanceConfig = this._initConfig(filterController.config.persist);
      this._name = persistanceConfig.name;

      if(this._route.snapshot.queryParams.persist === 'clear') {
        this._set({});
      }

      this._data = this._get() || {};
    
      this._filterController.change$
        .pipe(
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe(() => {
          this._set(this._filterController.values);
        });
    }

    return of(null);
  }

  public getQuery() {
    return this._data.query || {};
  }

  private _set(value: any) {
    this._data['query'] = value;
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

  private _initConfig(config: FsFilterPersistance): FsFilterPersistanceConfig {
    let persistanceConfig = this._getConfig(config);

    if(persistanceConfig) {
      persistanceConfig = {
        name: persistanceConfig.name || getNormalizedPath(this._location),
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

