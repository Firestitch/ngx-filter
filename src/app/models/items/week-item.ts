import { formatPeriodObject } from '@firestitch/datepicker';


import type { FilterComponent } from '../../components/filter/filter.component';
import { getRangeName } from '../../helpers/get-range-name';
import { parseDate } from '../../helpers/parse-date';
import { IFilterConfigWeekItem } from '../../interfaces/items/week.interface';

import { BaseItem } from './base-item';


export class WeekItem extends BaseItem<IFilterConfigWeekItem> {

  public declare seedDate: Date;
  
  constructor(
    itemConfig: IFilterConfigWeekItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.seedDate = itemConfig.seedDate;
  }

  public static create(config: IFilterConfigWeekItem, filter: FilterComponent) {
    return new WeekItem(config, filter);
  }

  public setValue(value, emitChange = true) {
    if (value) {
      value.from = parseDate(value.from);
      value.to = parseDate(value.to);
      value.period = parseInt(value.period, 10) || undefined;
    }

    super.setValue(value, emitChange);
  }

  public get query() {
    const value = this.value;
    const name = this.name;
    const paramFromName = getRangeName(name, 'from');
    const paramToName = getRangeName(name, 'to');
    const paramPeriodName = `${name}Period`;

    return {
      [paramFromName]: value?.from || undefined,
      [paramToName]: value?.to || undefined,
      [paramPeriodName]: value?.period || undefined,
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.hasValue) {
      return [];
    }

    return [
      {
        value: formatPeriodObject(this.value),
        label: this.label,
      },
    ];
  }
}
