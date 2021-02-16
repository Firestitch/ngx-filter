import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  Inject,
  HostListener
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable } from 'rxjs';

import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../../injectors/filter-drawer-overlay';
import { BaseItem } from '../../models/items/base-item';
import { FsFilterItemsStore } from '../../services/items-store.service';
import { ExternalParamsController } from '../../services/external-params-controller.service';

type Item = BaseItem<any>;

@Component({
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['filter-drawer.component.scss'],
  // Commented out because filter items are not updating with a delayed observable. Need to figure this out.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerComponent {

  @HostListener('window:resize')
  updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  @Input() public inline = false;

  protected _clear: Function;
  protected _done: Function;

  public windowDesktop = false;

  constructor(
    public externalParams: ExternalParamsController,
    protected _cd: ChangeDetectorRef,
    protected _itemsStore: FsFilterItemsStore,
    @Inject(FILTER_DRAWER_OVERLAY) private overlayRef: OverlayRef,
    @Inject(FILTER_DRAWER_DATA) private data,
  ) {
    this._itemsStore.prepareItems();

    this._clear = data.clear;
    this._done = data.done;

    this.updateWindowWidth();
  }

  public get items$(): Observable<Item[]> {
    return this._itemsStore.visibleItems$;
  }

  public get sortItem(): Item {
    return this._itemsStore.sortByItem;
  }

  public get sortDirectionItem(): Item {
    return this._itemsStore.sortDirectionItem;
  }

  public clear() {
    this._clear();
    // this.overlayRef.detach();
  }

  public done() {
    this._done();
    this.overlayRef.detach();
  }

  public backdropClick() {
    this.done();
  }
}
