import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../../services';


/**
 * Every date-flavoured item side by side. The range types write two query params — a
 * `<name>From` and a `<name>To` — and read them back the same way, which is what
 * `restoreItems` exists to unpick.
 */
@Component({
  selector: 'date-items',
  templateUrl: './date-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class DateItemsComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      persist: false,
      minSecondaryItems: 5,
      change: (query) => {
        this.query = query;
      },
      init: (query) => {
        this.query = query;
      },
      items: [
        this._filterItems.date(),
        this._filterItems.dateTime(),
        this._filterItems.dateRange(),
        this._filterItems.monthRange(),
        this._filterItems.scrollDate(),
      ],
    };
  }
}
