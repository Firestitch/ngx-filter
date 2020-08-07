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
import { Subject } from 'rxjs';
import { BaseItem } from '../../models/items/base-item';

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

  @Input() public items: Item[] = [];
  @Input() public showSortBy;
  @Input() public sortItem: Item;
  @Input() public sortDirectionItem: Item;
  @Input() public inline = false;

  protected _differ: IterableDiffer<Item>;
  protected _clear: Function;
  protected _done: Function;
  protected _search: Function;
  protected _filterChanged$: Subject<Item>;
  protected _click: Function;
  public windowDesktop = false;

  constructor(protected _differs: IterableDiffers,
              protected _cd: ChangeDetectorRef,
              @Inject(FILTER_DRAWER_OVERLAY) private overlayRef: OverlayRef,
              @Inject(FILTER_DRAWER_DATA) private data) {
    this.items = data.items;
    this.showSortBy = data.showSortBy;
    this.sortItem = data.sortItem;
    this.sortDirectionItem = data.sortDirectionItem;
    this._clear = data.clear;
    this._done = data.done;
    this._search = data.search;
    this._filterChanged$ = data.filterChanged;
    this._click = data.click;
    this._differ = this._differs.find(this.items).create<Item>((index, item) => {
      return item.model;
    });

    this.updateWindowWidth();
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
    this.overlayRef.detach();
  }

  public done() {
    this._done();
    this.overlayRef.detach();
  }

  public filterChanged(event) {
    this._filterChanged$.next(event);
  }

  public backdropClick() {
    this.done();
  }
}
