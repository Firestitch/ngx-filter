import type { FilterComponent } from '../../components/filter/filter.component';
import {
  IFilterConfigDateItem,
} from '../../interfaces/items/date.interface';

import { BaseDateItem } from './base-date-item';


export class DateTimeItem extends BaseDateItem {

  public static create(config: IFilterConfigDateItem, filter: FilterComponent) {
    return new DateTimeItem(config, filter);
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    return [];
  }
}
