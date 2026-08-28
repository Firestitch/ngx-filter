import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../../services';


/**
 * The four shapes a select item takes: one value, many values, options nested under an
 * unselectable parent, and a multi-select with one value promoted to its own toggle.
 */
@Component({
  selector: 'select-items',
  templateUrl: './select-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class SelectItemsComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      persist: false,
      minSecondaryItems: 4,
      change: (query) => {
        this.query = query;
      },
      init: (query) => {
        this.query = query;
      },
      items: [
        this._filterItems.userSelect(),
        this._filterItems.statusSelect(),
        this._filterItems.subjectSelect(),
        this._filterItems.isolateSelect(),
      ],
    };
  }
}
