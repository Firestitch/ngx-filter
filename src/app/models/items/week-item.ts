import { isEmpty } from '@firestitch/common';
import { simpleFormat } from '@firestitch/date';
import { formatPeriodObject } from '@firestitch/datepicker';

import { isDate, isValid, parseISO } from 'date-fns';
import { clone, isObject, isString } from 'lodash-es';

import { BaseItem } from './base-item';
import { IFilterConfigWeekItem } from '../../interfaces/items/week.interface';
import { getRangeName } from '../../helpers/get-range-name';
import { parseDate } from '../../helpers/parse-date';


export class WeekItem extends BaseItem<IFilterConfigWeekItem> {

  public static create(config: IFilterConfigWeekItem) {
    return new WeekItem(config, null);
  }

  public seedDate: Date;

  public get value() {
    let value = clone(this.model);

    if (!isObject(this.model) ||
      (isEmpty(this.model.from, { zero: true }) && isEmpty(this.model.to, { zero: true }))) {
      value = null;
    }

    if (isEmpty(value, { zero: true })) {
      return null;
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
      if (isString(period)) {
        value.period = parseInt(period, 10);
      } else {
        value.period = period;
      }
    }


    return value;
  }

  public get queryObject() {
    const value = this.value;
    const name = this.name;
    const paramFromName = getRangeName('camel', name, 'from');
    const paramToName = getRangeName('camel', name, 'to');
    const paramPeriodName = `${name}Period`;

    return {
      [paramFromName]: value?.from || null,
      [paramToName]: value?.to || null,
      [paramPeriodName]: value?.period || null,
    };
  }

  public get persistanceObject(): Record<string, string> {
    const query = this.queryObject;
    const name = this.name;
    const paramFromName = getRangeName('camel', name, 'from');
    const paramFromValue = query[paramFromName] && simpleFormat(query[paramFromName]) || query[paramFromName];
    const paramToName = getRangeName('camel', name, 'to');
    const paramToValue = query[paramToName] && simpleFormat(query[paramToName]) || query[paramToName];
    const paramPeriodName = `${name}Period`;

    return {
      [paramFromName]: paramFromValue,
      [paramToName]: paramToValue,
      [paramPeriodName]: query[paramPeriodName],
    }
  }

  public getChipsContent(type = null): string {
    return formatPeriodObject(this.value);
  }

  protected _validateModel() {}

  protected _setModel(value) {
    value.from = parseDate(value.from);
    value.to = parseDate(value.to);
    value.period = parseInt(value.period, 10) || null;

    super._setModel(value);
  }

  protected _parseConfig(item: IFilterConfigWeekItem) {
    super._parseConfig(item);

    this.seedDate = item.seedDate;
  }

  protected _init() {}

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? {};
  }
}
