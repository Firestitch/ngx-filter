import { IFilterConfigDateRangeItem } from '../../interfaces/item-config.interface';
import { BaseDateRangeItem } from './date-range/base-date-range-item';
import { ItemType } from '@firestitch/filter';


export class DateTimeRangeItem extends BaseDateRangeItem {

  public static create(config: IFilterConfigDateRangeItem) {
    return new DateTimeRangeItem(config, null);
  }

  public readonly type: ItemType.DateTimeRange;
}
