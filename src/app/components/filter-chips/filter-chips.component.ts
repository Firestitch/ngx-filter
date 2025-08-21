import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ItemType } from '../../enums';
import { BaseItem } from '../../models/items/base-item';
import { FsFilterChipComponent } from '../filter-chip/filter-chip.component';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterChipComponent, AsyncPipe],
})
export class FsFilterChipsComponent {

  @Input() public filters: BaseItem<any>[];

  public ItemType = ItemType;
}
