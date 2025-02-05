import { format } from '@firestitch/date';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemDateMode } from '../../enums/item-date-mode.enum';
import { IFilterConfigDateItem } from '../../interfaces/items/date.interface';

import { BaseDateItem } from './date/base-date-item';


export class DateItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem, filter: FilterComponent) {
    return new DateItem(config, null, filter);
  }

  public getChipsContent(): string {
    let dateFormat = 'date';

    if (this.mode === ItemDateMode.ScrollMonthYear) {
      dateFormat = 'full-date-dayless';
    }

    return format(this.model, dateFormat);
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? undefined;
  }
}
