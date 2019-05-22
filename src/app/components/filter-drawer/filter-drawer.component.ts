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
import { FsFilterConfigItem } from '../../models/filter-item';
import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { Subject } from 'rxjs';


@Component({
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['filter-drawer.component.scss']
  //Commented out because filter items are not updating with a delayed observable. Need to figure this out.
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerComponent implements DoCheck {
  @Input() public items: FsFilterConfigItem[] = [];
  @Input() public showSortBy;
  @Input() public sortBy = null;
  @Input() public sortDirection = null;
  @Input() public inline = false;

  protected _differ: IterableDiffer<FsFilterConfigItem>;
  protected _clear: Function;
  protected _done: Function;
  protected _search: Function;
  protected _filterChanged: Function;
  protected _click: Function;


  constructor(protected _differs: IterableDiffers,
              protected _cd: ChangeDetectorRef,
              @Inject(FILTER_DRAWER_DATA) data) {
    this.items = data.items;
    this.showSortBy = data.showSortBy;
    this.sortBy = data.sortBy;
    this.sortDirection = data.sortDirection;
    this._clear = data.clear;
    this._done = data.done;
    this._search = data.search;
    this._filterChanged = data.filterChanged;
    this._click = data.click;
    this._differ = this._differs.find(this.items).create<FsFilterConfigItem>((index, item) => {
      return item.model;
    });
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
  }

  public done() {
    this._done();
  }

  public filterChanged(event) {
    this._filterChanged(event);
  }
}
