import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterComponent, FilterConfig, FsFilterAction } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


@Component({
  selector: 'primary-search-chips',
  templateUrl: './primary-search-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FilterComponent, JsonPipe],
})
export class PrimarySearchChipsComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      change: (query) => {
        this.query = query;
      },
      actions: this._actions(),
      items: [
        this._filterItems.keyword(),
        this._filterItems.userSelect({ primary: true }),
        this._filterItems.statusSelect(),
        this._filterItems.date(),
      ],
    };
  }

  private _actions(): FsFilterAction[] {
    return [
      {
        label: 'Create',
        click: () => {
          console.log('Create clicked');
        },
      },
    ];
  }
}
