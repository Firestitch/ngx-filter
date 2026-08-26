import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigDateRangeItem } from '../../interfaces/items/date-range.interface';

import { BaseDateRangeItem } from './base-date-range-item';


export class MonthRangeItem extends BaseDateRangeItem {

  // A month range is about months, so the day is left off both ends.
  protected override get dateFormat(): string {
    return 'date';
  }

  public static create(config: IFilterConfigDateRangeItem, filter: FilterComponent) {
    return new MonthRangeItem(config, filter);
  }

}
