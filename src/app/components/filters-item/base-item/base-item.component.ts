import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FsFilterConfigItem } from '../../../models/filter-item';


@Component({
  selector: 'base-item',
  template: ''
})
export class BaseItemComponent {
  @Input() public item: FsFilterConfigItem;
  @Input() public inline = false;
  @Output() public itemChanged = new EventEmitter();

  public itemChange() {
    debugger;
    this.itemChanged.next(this.item);
  }
}
