import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';

import { IFilterConfigItem } from '../../../../../interfaces';
import { IFilterSavedFilter } from '../../../../../interfaces/saved-filters.interface';
import { BaseItem } from '../../../../../models/items';
import { FilterController } from '../../../../../services';
import { FsFilterChipComponent } from '../../../../filter-chip/filter-chip.component';


@Component({
  selector: 'fs-saved-filter-chips',
  templateUrl: './saved-filter-chips.component.html',
  styleUrls: ['./saved-filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsFilterChipComponent,
  ],
})
export class FsFilterSavedFilterChipsComponent implements OnInit {

  @Input() public savedFilter: IFilterSavedFilter;

  public items: BaseItem<IFilterConfigItem>[] = [];

  private _filterController = inject(FilterController);

  public ngOnInit(): void {
    this.items = [...this._filterController.items]
      .filter((item) => !!this.savedFilter.filters[item.name])
      .map((item: BaseItem<IFilterConfigItem>): BaseItem<IFilterConfigItem> => {
        item.value = this.savedFilter.filters[item.name];

        return item;
      });
  }
}
