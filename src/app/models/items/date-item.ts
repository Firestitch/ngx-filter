import { format } from '@firestitch/date';

import { IFilterConfigDateItem } from '../../interfaces/items/date.interface';
import { ItemType } from '../../enums/item-type.enum';
import { ItemDateMode } from '../../enums/item-date-mode.enum';

import { BaseDateItem } from './date/base-date-item';


export class DateItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem) {
    return new DateItem(config, null);
  }

  public getChipsContent(type = null): string {
    let dateFormat = 'date';

    if (this.mode == ItemDateMode.ScrollMonthYear) {
      dateFormat = 'full-date-dayless';
    }

    return format(this.model, dateFormat);
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? null;
  }
}
