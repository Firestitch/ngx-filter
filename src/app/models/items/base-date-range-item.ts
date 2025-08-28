import { format, iso8601 } from '@firestitch/date';


import { isDate, isValid, parseISO } from 'date-fns';

import { ItemType } from '../../enums/item-type.enum';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigDateRangeItem,
} from '../../interfaces/items/date-range.interface';

import { BaseItem } from './base-item';


export abstract class BaseDateRangeItem extends BaseItem<IFilterConfigDateRangeItem> {

  public get isTypeDateRange(): boolean {
    return this.type === ItemType.DateRange;
  }

  public get isTypeDateTimeRange(): boolean {
    return this.type === ItemType.DateTimeRange;
  }

  public get hasValue(): boolean {
    return this.value?.from instanceof Date || this.value?.to instanceof Date;
  }

  public setValue(value, emitChange = true) {
    let from = value?.from;
    let to = value?.to;

    if (value) {
      if (from && (!isDate(from) || !isValid(from))) {
        from = parseISO(from);
      }
      if (to && (!isDate(to) || !isValid(to))) {
        to = parseISO(to);
      }
    }

    super.setValue({ from, to }, emitChange);
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }
    
    const value: { from?: Date, to?: Date } = {};
    const paramFromName = getRangeName(this.name, 'from');
    const paramToName = getRangeName(this.name, 'to');

    if(this.value.from) {
      value[paramFromName] = iso8601(this.value.from);
    }

    if(this.value.to) {
      value[paramToName] = iso8601(this.value.to);
    }

    return value;
  }

  public get query(): Record<string, Date> {
    if(!this.hasValue) {
      return {};
    }

    const value: { from?: Date, to?: Date } = {};
    const paramFromName = getRangeName(this.name, 'from');
    const paramToName = getRangeName(this.name, 'to');

    if(this.value.from) {
      value[paramFromName] = this.value.from;
    }

    if(this.value.to) {
      value[paramToName] = this.value.to;
    }

    return value;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    const dateFormat = this.type === ItemType.DateRange ? 'date' : 'date-time';
    const chips = [];

    if (this.value?.from) {
      chips.push({
        name: 'from',
        value: format(this.value.from, dateFormat),
        label: this.label[0],
      });
    }

    if (this.value?.to) {
      chips.push({
        name: 'to',
        value: format(this.value.to, dateFormat),
        label: this.label[1],
      });
    }

    return chips;
  }

  public clear(
    name: string = null,
  ) {
    if (name === 'from') {
      delete this.value.from;

      if (this.defaultValue?.from) {
        this.value.from = this.defaultValue.from;
      }

      this.value = { ...this.value };
    } else if (name === 'to') {
      delete this.value.to;

      if (this.defaultValue?.to) {
        this.value.to = this.defaultValue.to;
      }

      this.value = { ...this.value };
    } else {
      this.value = this.defaultValue ? { ...this.defaultValue } : {};
    }
  }

}
