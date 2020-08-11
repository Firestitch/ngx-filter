import { isEmpty } from '@firestitch/common';
import { format, simpleFormat } from '@firestitch/date';
import { ItemType } from '../../../enums/item-type.enum';

import { isDate, isValid, parse, parseISO } from 'date-fns';

import { clone, isObject, isString } from 'lodash-es';
import { BaseItem } from '../base-item';
import { getRangeName } from '../../../helpers/get-range-name';
import { IFilterConfigDateRangeItem } from '../../../interfaces/item-config.interface';


export abstract class BaseDateRangeItem extends BaseItem<IFilterConfigDateRangeItem> {

  public case: 'snake' | 'camel';

  public get isTypeDateRange(): boolean {
    return this.type === ItemType.DateRange;
  }

  public get isTypeDateTimeRange(): boolean {
    return this.type === ItemType.DateTimeRange;
  }

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

    value = {};

    if (from) {
      if (isString(from)) {
        from = parseISO(from);
      }

      if (isValid(from) && isDate(from)) {
        value.from = simpleFormat(from);
      }
    }

    if (to) {
      if (isString(to)) {
        to = parseISO(to);
      }

      if (isValid(to) && isDate(to)) {
        value.to = simpleFormat(to);
      }
    }

    return value;
  }

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    if (isObject(value)) {
      if (value.from) {
        const paramName = getRangeName(this.case, name, 'from');

        params[paramName] = value.from;
      }

      if (value.to) {
        const paramName = getRangeName(this.case, name, 'to');

        params[paramName] = value.to;
      }
    } else {
      const paramFromName = getRangeName(this.case, name, 'from');
      const paramToName = getRangeName(this.case, name, 'to');

      params[name] = null;
      params[paramFromName] = null;
      params[paramToName] = null;
    }

    return params;
  }

  public clear() {
    super.clear();

    this.model = {};
  }

  // public checkIfValueChanged() {
  //   this.valueChanged = false;
  // }

  public getChipsContent(type = null): string {
    const formatTo = this.type === ItemType.DateRange ? 'date' : 'date-time';

    if (type === 'from') {
      const from = this.model.from;
      return `${format(from, formatTo)}`;
    } else if (type === 'to') {
      const to = this.model.to;
      return `${format(to, formatTo)}`;
    }
  }

  protected _validateModel() {
  }

  protected _setModel(value) {
    if (value) {
      if (value.from && (!isDate(value.from) || !isValid(value.from))) {
        value.from = parse(value.from, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
      }
      if (value.to && (!isDate(value.to) || !isValid(value.to))) {
        value.to = parse(value.to, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
      }
    }

    super._setModel(value);
  }

  protected _parseConfig(item: IFilterConfigDateRangeItem) {
    this.case = this._additionalConfig?.case ?? 'camel';

    super._parseConfig(item);
  }

  protected _init() {
    if (!this.label) {
      this.label = ['Date From', 'Date To'];
    }

    if (!this.model) {
      this.model = this.defaultValue || {};
    }
  }

}
