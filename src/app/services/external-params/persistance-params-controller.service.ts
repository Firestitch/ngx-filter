import { Injectable, Optional } from '@angular/core';
import { Location } from '@angular/common';

import { FsPersistanceStore } from '@firestitch/store';

import { FsFilterPersistance } from '../../interfaces/config.interface';
import { getNormalizedPath } from '@firestitch/common';
import { FsStore } from '@firestitch/store';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawerRef } from '@firestitch/drawer';

const FILTER_STORE_KEY = 'fs-filter-persist';


@Injectable()
export class PersistanceParamsController extends FsPersistanceStore<FsFilterPersistance> {

  protected STORE_KEY = FILTER_STORE_KEY;

  constructor(
    _store: FsStore,
    _route: ActivatedRoute,
    private _location: Location,
    @Optional() private _dialogRef: MatDialogRef<unknown>,
    @Optional() private _drawerRef: DrawerRef<unknown>,
  ) {
    super(_store, _route);
  }

  public get enalbed(): boolean {
    return this._enabled;
  }

  public init(persistanceConfig: FsFilterPersistance, namespace: string) {
    namespace = namespace ?? getNormalizedPath(this._location);
    const persistanceDisabled = !!this._dialogRef || !!this._drawerRef;

    this.setConfig(persistanceConfig, namespace, persistanceDisabled);
  }

}
