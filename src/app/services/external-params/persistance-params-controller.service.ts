import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';

import { getNormalizedPath } from '@firestitch/common';
import { DrawerRef } from '@firestitch/drawer';
import { FsPersistanceStore, FsStore } from '@firestitch/store';

import { restoreItems } from '../../helpers/restore-items';
import { FsFilterPersistance } from '../../interfaces/config.interface';
import { FsFilterItemsStore } from '../items-store.service';

const FILTER_STORE_KEY = 'fs-filter-persist';


@Injectable()
export class PersistanceParamsController extends FsPersistanceStore<FsFilterPersistance> {

  protected STORE_KEY = FILTER_STORE_KEY;
  protected _paramsCase: 'snake' | 'camel';

  constructor(
    _store: FsStore,
    _route: ActivatedRoute,
    private _location: Location,
    private _itemsStore: FsFilterItemsStore,
    @Optional() private _dialogRef: MatDialogRef<unknown>,
    @Optional() private _drawerRef: DrawerRef<unknown>,
  ) {
    super(_store, _route);
  }

  public init(
    persistanceConfig: FsFilterPersistance,
    namespace: string,
    paramsCase: 'snake' | 'camel',
  ): void {
    this._paramsCase = paramsCase;

    namespace = namespace ?? getNormalizedPath(this._location);
    const persistanceDisabled = !!this._dialogRef || !!this._drawerRef;

    this.setConfig(persistanceConfig, namespace, persistanceDisabled);
  }

  public restore(): void {
    if (!this.enabled) {
      return;
    }

    super.restore();

    const items = [
      ...this._itemsStore.items,
      this._itemsStore.sortByItem,
      this._itemsStore.sortDirectionItem,
    ].filter((item) => !!item);

    if (this._value) {
      this._value.data = restoreItems(
        this._value.data,
        items,
      );
    }
  }

}
