import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigDateRangeItem } from '../../interfaces/items/date-range.interface';

import { BaseDateRangeItem } from './base-date-range-item';


export class DateRangeItem extends BaseDateRangeItem {

  public get mergedLabel() {
    return `${this.fromLabel} / ${this.toLabel}`;
  }

  public static create(config: IFilterConfigDateRangeItem, filter: FilterComponent) {
    return new DateRangeItem(config, filter);
  }

}
