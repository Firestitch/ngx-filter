import { IFilterConfigDateRangeItem } from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseDateRangeItem } from './date-range/base-date-range-item';


export class DateTimeRangeItem extends BaseDateRangeItem {

  public static create(config: IFilterConfigDateRangeItem) {
    return new DateTimeRangeItem(config, null);
  }

  public readonly type: ItemType.DateTimeRange;
}
