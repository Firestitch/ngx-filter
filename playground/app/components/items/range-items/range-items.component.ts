import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../../services';


/**
 * A range item is one filter holding two bounds, so it writes a `<name>Min`/`<name>Max`
 * pair and renders as two chips. `chipLabel` takes a [min, max] pair to name them.
 * A 0 bound counts like any other; only an empty bound is unset.
 */
@Component({
  selector: 'range-items',
  templateUrl: './range-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class RangeItemsComponent {

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
        this._filterItems.priceRange(),
        this._filterItems.priceRange({
          name: 'labelledPrice',
          chipLabel: ['Custom Min Price', 'Custom Max Price'],
        }),
        // 0 is a real bound: it stays in the query (discountMin: 0) and on the chip.
        this._filterItems.priceRange({
          name: 'discount',
          label: 'Discount',
          default: { min: 0 },
        }),
        this._filterItems.text({ label: 'Reference', prefix: '#' }),
      ],
    };
  }
}
