import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input, IterableDiffer, IterableDiffers,
  Output
} from '@angular/core';
import { FsFilterConfigItem } from '../../models/filter-item';


@Component({
  selector: 'filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['filters-list.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush,  Commented out because filter items are not updating when delayed observable. Need to figure this out.
})
export class FiltersListComponent implements DoCheck {
  @Input() public items: FsFilterConfigItem[] = [];
  @Input() public showSortBy;
  @Input() public sortBy = null;
  @Input() public sortDirection = null;
  @Input() public inline = false;

  @Output() public filterChanged = new EventEmitter();
  @Output() public search = new EventEmitter();
  @Output() public clear = new EventEmitter();
  @Output() public done = new EventEmitter();

  protected _differ: IterableDiffer<FsFilterConfigItem>;

  constructor(protected _differs: IterableDiffers, protected _cd: ChangeDetectorRef) {
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

  public doSearch() {
    this.search.next();
  }

  public clearAll() {
    this.clear.next();
  }

  public doneClick() {
    this.done.next();
  }

  public filterChange(event) {
    this.filterChanged.next(event);
  }
}
