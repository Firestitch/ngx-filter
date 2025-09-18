
import { format, iso8601 } from '@firestitch/date';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemDateMode } from '../../enums/item-date-mode.enum';
import { IFilterConfigDateItem } from '../../interfaces/items/date.interface';

import { BaseDateItem } from './base-date-item';


export class DateItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem, filter: FilterComponent) {
    return new DateItem(config, filter);
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: iso8601(super.value),
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if (!this.hasValue) {
      return [];
    }

    let dateFormat = 'date';

    if (this.mode === ItemDateMode.ScrollMonthYear) {
      dateFormat = 'full-date-dayless';
    }

    return [
      {
        value: format(super.value, dateFormat),
        label: this.label,
      },
    ];
  }
}
