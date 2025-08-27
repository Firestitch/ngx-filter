import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FsChipModule } from '@firestitch/chip';

import { ItemType } from '../../enums';
import { IFilterConfigItem } from '../../interfaces/config.interface';
import { BaseItem } from '../../models/items/base-item';
import { FilterController } from '../../services/filter-controller.service';
import { FsFilterChipComponent } from '../filter-chip/filter-chip.component';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsFilterChipComponent,
    AsyncPipe,
    FsChipModule,
  ],
})
export class FsFilterChipsComponent {

  public ItemType = ItemType;

  private _filterController = inject(FilterController);

  public get items() {
    return this._filterController.items;
  }

  public click(item: BaseItem<IFilterConfigItem>, chip: { name?: string, value: string, label: string }) {
    //this._focusController.click(this.item, chip.name);
  }

  public remove(item: BaseItem<IFilterConfigItem>, chip: { name?: string, value: string, label: string }) {
    item.clear(chip.name);
  }

}
