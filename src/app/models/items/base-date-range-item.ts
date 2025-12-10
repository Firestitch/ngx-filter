import { format, iso8601 } from '@firestitch/date';


import { isDate, isValid, parseISO } from 'date-fns';

import { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigDateRangeItem,
} from '../../interfaces/items/date-range.interface';

import { BaseItem } from './base-item';


export abstract class BaseDateRangeItem extends BaseItem<IFilterConfigDateRangeItem> {

  public fromLabel: string;
  public toLabel: string;

  constructor(
    itemConfig: IFilterConfigDateRangeItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    if(itemConfig.label instanceof Array) {
      this.fromLabel = itemConfig.label[0];
      this.toLabel = itemConfig.label[1];
    } else if (typeof itemConfig.label === 'string') {
      this.fromLabel = `${itemConfig.label} from`;
      this.toLabel = `${itemConfig.label} to`;
    } else if (typeof itemConfig.label === 'object') {
      this.fromLabel = itemConfig.label.from;
      this.toLabel = itemConfig.label.to;
    }
  }

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
    const value: { from?: Date, to?: Date } = {};
    const paramFromName = getRangeName(this.name, 'from');
    const paramToName = getRangeName(this.name, 'to');

    value[paramFromName] = this.value.from ? iso8601(this.value.from) : undefined;
    value[paramToName] = this.value.to ? iso8601(this.value.to) : undefined;

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

  public get chips(): { name?: string, value: string, label: any }[] {
    const dateFormat = this.type === ItemType.DateRange ? 'date' : 'date-time';
    const chips = [];

    if (this.value?.from) {
      chips.push({
        name: 'from',
        value: format(this.value.from, dateFormat),
        label: this.fromLabel,
      });
    }

    if (this.value?.to) {
      chips.push({
        name: 'to',
        value: format(this.value.to, dateFormat),
        label: this.toLabel,
      });
    }

    return chips;
  }

  public clear(emitChange: boolean = true) {
    this.setValue({}, emitChange);
  }
  
  public clearByName(name: string, emitChange: boolean = true) {
    if (name === 'from') {
      this.setValue({ 
        ...this.value,
        from: null,
      }, emitChange);
    } else if (name === 'to') {
      this.setValue({ 
        ...this.value,
        to: null,
      }, emitChange);
    }
  }

}
