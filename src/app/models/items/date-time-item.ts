import {
  IFilterConfigDateItem,
} from '../../interfaces/item-config.interface';
import { BaseDateItem } from './date/base-date-item';
import { ItemType } from '@firestitch/filter';


export class DateTimeItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem) {
    return new DateTimeItem(config, null);
  }

  public readonly type: ItemType.DateTime;

  public isTypeDateTime() {
    return true;
  }

}
