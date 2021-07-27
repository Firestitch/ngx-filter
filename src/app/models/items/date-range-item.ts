import { IFilterConfigDateRangeItem } from '../../interfaces/items/date-range.interface';

import { BaseDateRangeItem } from './date-range/base-date-range-item';


export class DateRangeItem extends BaseDateRangeItem {

  public static create(config: IFilterConfigDateRangeItem) {
    return new DateRangeItem(config, null);
  }

}
