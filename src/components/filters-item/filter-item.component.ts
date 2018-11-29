import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FsFilterConfigItem, ItemType } from '../../models/fs-filter-item';


@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html'
})
export class FilterItemComponent {

  @Input() public item: FsFilterConfigItem;
  @Input() public inline = false;

  @Output() public itemChanged = new EventEmitter();

  public itemType = ItemType;

  public isolateChange(filter) {

    if (filter.isolate.enabled) {
      filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
    } else {
      filter.model = filter.multiple ? [] : null;
    }

    this.itemChanged.next(filter);
  }

  public itemChange(event) {
    this.itemChanged.next(event);
  }
}
