import { Injectable, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import { DrawerRef } from '@firestitch/drawer';
import { FsPersistanceStore } from '@firestitch/store';
import { getNormalizedPath } from '@firestitch/common';
import { FsStore } from '@firestitch/store';

import { FsFilterPersistance } from '../../interfaces/config.interface';
import { restoreItems } from '../../helpers/restore-items';
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

  public get enalbed(): boolean {
    return this._enabled;
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
        this._paramsCase
      );
    }
  }

}
