import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


@Component({
  selector: 'autocomplete-example',
  templateUrl: './autocomplete-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class AutocompleteExampleComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      persist: false,
      change: (query) => {
        this.query = query;
      },
      init: (query) => {
        this.query = query;
      },
      items: [
        this._filterItems.keyword(),
        // Renders as an inline input beside Search
        this._filterItems.userAutocomplete({
          name: 'inlineUserId',
          label: 'Inline User',
          primary: true,
          default: { name: 'John Doe', value: 1 },
        }),
        // Renders as a chip
        this._filterItems.userAutocomplete({
          name: 'chipUserId',
          label: 'Chip User',
          primary: false,
          default: { name: 'Sam Smith', value: 2 },
        }),
      ],
    };
  }
}
