import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';

import { createFilterItem } from '../../../../../helpers';
import { IFilterConfigItem } from '../../../../../interfaces';
import { IFilterSavedFilter } from '../../../../../interfaces/saved-filters.interface';
import { BaseItem } from '../../../../../models/items';
import { FilterController } from '../../../../../services';


@Component({
  selector: 'fs-saved-filter-chips',
  templateUrl: './saved-filter-chips.component.html',
  styleUrls: ['./saved-filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipModule,
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

        const config = {
          ...this._filterController.config.items
            .find((configItem) => item.name === configItem.name),
        };

        const filterItem = createFilterItem(config, this._filterController.filter);
        filterItem.values = item.values;
        filterItem.initValue(this.savedFilter.filters[item.name]);
        
        return filterItem;
      });
  }
}
