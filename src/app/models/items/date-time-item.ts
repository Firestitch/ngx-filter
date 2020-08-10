import {
  IFilterConfigDateItem,
} from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseDateItem } from './date/base-date-item';


export class DateTimeItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem) {
    return new DateTimeItem(config, null);
  }

  public readonly type: ItemType.DateTime;

  protected _clearValue() {
    this.model = null;
  }
}
