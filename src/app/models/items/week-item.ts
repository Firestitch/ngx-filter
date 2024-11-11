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

  public static create(config: IFilterConfigWeekItem, filter: FilterComponent) {
    return new WeekItem(config, null, filter);
  }

  public get value() {
    let value = clone(this.model);

    if (!isObject(this.model) ||
      (isEmpty(this.model.from, { zero: true }) && isEmpty(this.model.to, { zero: true }))) {
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

  public get queryObject() {
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
    const query = this.queryObject;
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

  public getChipsContent(type = null): string {
    return formatPeriodObject(this.value);
  }

  protected _validateModel() {
    //
  }

  protected _setModel(value) {
    if (value) {
      value.from = parseDate(value.from);
      value.to = parseDate(value.to);
      value.period = parseInt(value.period, 10) || undefined;
    }

    super._setModel(value);
  }

  protected _parseConfig(item: IFilterConfigWeekItem) {
    super._parseConfig(item);

    this.seedDate = item.seedDate;
  }

  protected _init() { }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? undefined;
  }
}
