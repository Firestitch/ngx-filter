import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


@Component({
  selector: 'keyword-full-width',
  templateUrl: './keyword-full-width.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class KeywordFullWidthComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      change: (query) => {
        this.query = query;
      },
      items: [
        this._filterItems.keyword({ fullWidth: true }),
      ],
    };
  }
}
