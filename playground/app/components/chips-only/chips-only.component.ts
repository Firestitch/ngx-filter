import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterAction, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


@Component({
  selector: 'chips-only',
  templateUrl: './chips-only.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class ChipsOnlyComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      heading: 'Chips Only',
      subheading: 'No keyword search, just chip filters',
      chips: true,
      change: (query) => {
        this.query = query;
      },
      actions: this._actions(),
      items: [
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
