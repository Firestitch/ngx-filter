import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FsFilterConfigItem } from '../../models/filter-item';
import { ItemType } from '../../enums/item-type.enum';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipsComponent {
  @Input() public filters: FsFilterConfigItem[];
  @Output() public remove = new EventEmitter<{ item: FsFilterConfigItem, type: string }>();

  public chips = [];

  public removeItem(event) {
    this.remove.next(event);
  }
}
