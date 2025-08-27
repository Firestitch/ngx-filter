import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigDateRangeItem } from '../../interfaces/items/date-range.interface';

import { BaseDateRangeItem } from './base-date-range-item';


export class DateTimeRangeItem extends BaseDateRangeItem {

  public static create(config: IFilterConfigDateRangeItem, filter: FilterComponent) {
    return new DateTimeRangeItem(config, null, filter);
  }

}
