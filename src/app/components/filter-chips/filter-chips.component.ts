import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FsFilterConfigItem, ItemType } from '../../models/filter-item';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
})
export class FsFilterChipsComponent {
  @Input() public filters: FsFilterConfigItem[];
  @Output() public remove = new EventEmitter<FsFilterConfigItem>();

  public itemType = ItemType;

  public removeItem(item) {
    this.remove.next(item);
  }
}
