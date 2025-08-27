import { isEmpty } from '@firestitch/common';
import { simpleFormat } from '@firestitch/date';
import { formatPeriodObject } from '@firestitch/datepicker';

import { isDate, isValid, parseISO } from 'date-fns';
import { clone, isObject, isString } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { getRangeName } from '../../helpers/get-range-name';
import { parseDate } from '../../helpers/parse-date';
import { IFilterConfigWeekItem } from '../../interfaces/items/week.interface';

import { BaseItem } from './base-item';


export class WeekItem extends BaseItem<IFilterConfigWeekItem> {

  public declare seedDate: Date;
  
  constructor(
    itemConfig: IFilterConfigWeekItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.seedDate = itemConfig.seedDate;
  }

  public static create(config: IFilterConfigWeekItem, filter: FilterComponent) {
    return new WeekItem(config, null, filter);
  }

  public get value() {
    let value = clone(super.value);

    if (!isObject(value) ||
      (isEmpty(value.from, { zero: true }) && isEmpty(value.to, { zero: true }))) {
      value = undefined;
    }

    if (isEmpty(value, { zero: true })) {
      return undefined;
    }

    let from = value.from;
    let to = value.to;
    const period = value.period;

    value = {};

    if (from) {
      if (isString(from)) {
        from = parseISO(from);
      }

      if (isValid(from) && isDate(from)) {
        value.from = from;
      }
    }

    if (to) {
      if (isString(to)) {
        to = parseISO(to);
      }

      if (isValid(to) && isDate(to)) {
        value.to = to;
      }
    }

    if (period) {
      value.period = isString(period) ? parseInt(period, 10) : period;
    }

    return value;
  }

  public set value(value) {
    if (value) {
      value.from = parseDate(value.from);
      value.to = parseDate(value.to);
      value.period = parseInt(value.period, 10) || undefined;
    }

    super.value = value;
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

  public get persistanceObject(): Record<string, string> {
    const query = this.query;
    const name = this.name;
    const paramFromName = getRangeName(name, 'from');
    const paramFromValue = query[paramFromName] && simpleFormat(query[paramFromName]) || query[paramFromName];
    const paramToName = getRangeName(name, 'to');
    const paramToValue = query[paramToName] && simpleFormat(query[paramToName]) || query[paramToName];
    const paramPeriodName = `${name}Period`;

    return {
      [paramFromName]: paramFromValue,
      [paramToName]: paramToValue,
      [paramPeriodName]: query[paramPeriodName],
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
