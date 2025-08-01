import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
} from '@angular/core';

import { OverlayRef } from '@angular/cdk/overlay';

import { Observable } from 'rxjs';

import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../../injectors/filter-drawer-overlay';
import { BaseItem } from '../../models/items/base-item';
import { ExternalParamsController } from '../../services/external-params-controller.service';
import { FsFilterItemsStore } from '../../services/items-store.service';

type Item = BaseItem<any>;

@Component({
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerComponent {

  @Input() public inline = false;

  public windowDesktop = false;

  protected _clear: () => void;
  protected _done: () => void;

  constructor(
    @Inject(FILTER_DRAWER_OVERLAY) private _overlayRef: OverlayRef,
    @Inject(FILTER_DRAWER_DATA) private _data,
    public externalParams: ExternalParamsController,
    protected _cd: ChangeDetectorRef,
    protected _itemsStore: FsFilterItemsStore,
  ) {
    this._itemsStore.prepareItems();

    this._clear = this._data.clear;
    this._done = this._data.done;

    this.updateWindowWidth();
  }

  @HostListener('window:resize')
  public updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  public get items$(): Observable<Item[]> {
    return this._itemsStore.visibleItems$;
  }

  public clear() {
    this._clear();
  }

  public done() {
    this._done();
    this._overlayRef.detach();
  }

  public backdropClick() {
    this.done();
  }
}
