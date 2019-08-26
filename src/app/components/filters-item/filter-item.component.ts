import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FsFilterConfigItem } from '../../models/filter-item';
import { ItemType } from '../../enums/item-type.enum';


@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html'
})
export class FilterItemComponent {

  @Input() public item: FsFilterConfigItem;
  @Output() public itemChanged = new EventEmitter();

  public itemType = ItemType;

  public itemChange(event) {
    this.itemChanged.next(event);
  }
}
