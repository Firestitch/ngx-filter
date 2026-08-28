import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../../services';


/**
 * Two items that render their whole option set inline rather than behind a picker: chips
 * you toggle, and a checkbox. A secondary checkbox has no popup at all — it is added and
 * removed straight off the chip row.
 */
@Component({
  selector: 'chips-checkbox-items',
  templateUrl: './chips-checkbox-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class ChipsCheckboxItemsComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      persist: false,
      minSecondaryItems: 3,
      change: (query) => {
        this.query = query;
      },
      init: (query) => {
        this.query = query;
      },
      items: [
        this._filterItems.weekdayChips(),
        this._filterItems.weekdayChips({
          name: 'singleDay',
          label: 'Single Weekday',
          multiple: false,
        }),
        this._filterItems.showDeletedCheckbox(),
      ],
    };
  }
}
