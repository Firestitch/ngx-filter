import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  Inject,
  HostListener
} from '@angular/core';
import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { OverlayRef } from '@angular/cdk/overlay';
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
export class FilterDrawerComponent implements DoCheck {

  @HostListener('window:resize')
  updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  @Input() public inline = false;

  protected _differ: IterableDiffer<Item>;
  protected _clear: Function;
  protected _done: Function;

  public windowDesktop = false;

  constructor(
    public externalParams: ExternalParamsController,
    protected _differs: IterableDiffers,
    protected _cd: ChangeDetectorRef,
    protected _itemsStore: FsFilterItemsStore,
    @Inject(FILTER_DRAWER_OVERLAY) private overlayRef: OverlayRef,
    @Inject(FILTER_DRAWER_DATA) private data,
  ) {
    this._itemsStore.prepareItems();

    this._clear = data.clear;
    this._done = data.done;

    this._differ = this._differs.find(this.items).create<Item>((index, item) => {
      return item.model;
    });

    this.updateWindowWidth();
  }

  public get items(): Item[] {
    return this._itemsStore.visibleItems;
  }

  public get sortItem(): Item {
    return this._itemsStore.sortByItem;
  }

  public get sortDirectionItem(): Item {
    return this._itemsStore.sortDirectionItem;
  }

  public ngDoCheck() {
    if (this._differ) {
      const changes = this._differ.diff(this.items);

      if (changes) {
        this._cd.detectChanges();
      }
    }
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
