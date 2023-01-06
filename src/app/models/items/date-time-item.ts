import {
  IFilterConfigDateItem,
} from '../../interfaces/items/date.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseDateItem } from './date/base-date-item';


export class DateTimeItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem) {
    return new DateTimeItem(config, null);
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? undefined;
  }
}
