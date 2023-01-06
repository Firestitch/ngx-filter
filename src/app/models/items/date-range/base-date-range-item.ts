import { isEmpty } from '@firestitch/common';
import { format, simpleFormat } from '@firestitch/date';
import { ItemType } from '../../../enums/item-type.enum';

import { isDate, isValid, parseISO } from 'date-fns';

import { clone, isObject, isString } from 'lodash-es';
import { BaseItem } from '../base-item';
import { getRangeName } from '../../../helpers/get-range-name';
import {
  IFilterConfigDateRangeItem,
  IFilterItemDefaultDateRange,
} from '../../../interfaces/items/date-range.interface';


export abstract class BaseDateRangeItem extends BaseItem<IFilterConfigDateRangeItem> {

  public case: 'snake' | 'camel';

  protected readonly _additionalConfig: { case: 'camel' | 'snake' }

  public get isTypeDateRange(): boolean {
    return this.type === ItemType.DateRange;
  }

  public get isTypeDateTimeRange(): boolean {
    return this.type === ItemType.DateTimeRange;
  }

  public get isChipVisible(): boolean {
    return this.model && (this.model.from !== undefined || this.model.to !== undefined);
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

    return value;
  }

  public get queryObject(): Record<string, Date> {
    const value = this.value || {};
    const name = this.name;
    const paramFromName = getRangeName(this.case, name, 'from');
    const paramToName = getRangeName(this.case, name, 'to');

    return {
      [paramFromName]: value.from || undefined,
      [paramToName]: value.to || undefined,
    };
  }

  public get persistanceObject(): Record<string, string> {
    const query = this.queryObject;

    return Object.keys(this.queryObject)
      .reduce((acc, key) => {
        if (!!query[key]) {
          acc[key] = simpleFormat(query[key]);
        } else {
          acc[key] = query[key];
        }

        return acc;
      }, {});
  }

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

  public clearDateRange(type: 'from' | 'to' = null, defaultValue: IFilterItemDefaultDateRange = undefined) {
    if (type === 'from') {
      delete this.model.from;

      if (defaultValue?.from) {
        this.model.from = defaultValue.from;
      }

      this.model = { ...this.model };
    } else if (type === 'to') {
      delete this.model.to;

      if (defaultValue?.to) {
        this.model.to = defaultValue.to;
      }

      this.model = { ...this.model };
    } else {
      if (defaultValue) {
        this.model = { ...defaultValue };
      } else {
        this.model = {};
      }
    }
  }

  protected _validateModel() {
  }

  protected _setModel(value) {
    if (value) {
      if (value.from && (!isDate(value.from) || !isValid(value.from))) {
        value.from = parseISO(value.from);
      }
      if (value.to && (!isDate(value.to) || !isValid(value.to))) {
        value.to = parseISO(value.to);
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

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = this.defaultValue ?? {};
  }

}
