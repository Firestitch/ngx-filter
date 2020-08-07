import { IFilterConfigDateRangeItem } from '../../interfaces/item-config.interface';
import { BaseDateItem } from './date/base-date-item';
import { ItemType } from '@firestitch/filter';


export class DateItem extends BaseDateItem {

  public static create(config: IFilterConfigDateRangeItem) {
    return new DateItem(config, null);
  }

  public readonly type: ItemType.Date;

  public isTypeDate() {
    return true;
  }

}
