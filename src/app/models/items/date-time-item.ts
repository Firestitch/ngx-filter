import type { FilterComponent } from '../../components/filter/filter.component';
import {
  IFilterConfigDateItem,
} from '../../interfaces/items/date.interface';

import { BaseDateItem } from './date/base-date-item';


export class DateTimeItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem, filter: FilterComponent) {
    return new DateTimeItem(config, null, filter);
  }

  public getChipsContent() { 
    return null;
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? undefined;
  }
}
