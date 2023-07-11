import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseItem } from '../../models/items/base-item';
import { ItemType } from '../../enums';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipsComponent {

  @Input() public filters: BaseItem<any>[];

  public ItemType = ItemType;
  public chips = [];
}
