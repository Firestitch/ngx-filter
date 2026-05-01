import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterAction, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


@Component({
  selector: 'chips-heading',
  templateUrl: './chips-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class ChipsHeadingComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      heading: 'Chips and Heading',
      subheading: 'Heading with chip filters, no keyword search',
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
