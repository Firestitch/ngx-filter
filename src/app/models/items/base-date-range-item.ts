import { format, iso8601, range } from '@firestitch/date';


import { isDate, isValid, parseISO } from 'date-fns';

import { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';
import { distillRangeLabel } from '../../helpers/distill-range-label';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigDateRangeItem,
} from '../../interfaces/items/date-range.interface';

import { BaseItem } from './base-item';


export abstract class BaseDateRangeItem extends BaseItem<IFilterConfigDateRangeItem> {

  public fromLabel: string;
  public toLabel: string;

  /**
   * What the range goes by wherever it is named once — the "More filters" list,
   * the unset chip, the value chip. A string label is that name already, and a
   * from/to pair earns one when both ends distill to the same stem, which is
   * nearly always: 'From Create Date' and 'To Create Date' are the 'Create Date'
   * filter. Null only when the two labels name unrelated ends, and then there is
   * nothing honest to show but both.
   */
  public rangeLabel: string;

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

    this.rangeLabel = typeof itemConfig.label === 'string' ?
      itemConfig.label : distillRangeLabel(this.fromLabel, this.toLabel);
  }

  public get mergedLabel(): string {
    return this.rangeLabel ?? `${this.fromLabel} / ${this.toLabel}`;
  }

  /**
   * How the ends are written wherever the range is shown. Each range type says
   * how much of a date it is about — a month range names no day
   * drops the year while the range sits inside the current one.
   */
  protected get dateFormat(): string {
    return 'date';
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

  /**
   * One chip for the whole range once it has a name to go by, so a filled range
   * reads as the one thing it is. A half-filled range still says which end it
   * has and keeps that end's name, so removing the chip clears only that end;
   * a full range has no one end to name, and removing it clears both.
   */
  public get chips(): { name?: string, value: string, label: any }[] {
    const fromDate = this.value?.from;
    const toDate = this.value?.to;
    const from = fromDate ? format(fromDate, this.dateFormat) : null;
    const to = toDate ? format(toDate, this.dateFormat) : null;

    if(!this.rangeLabel) {
      const chips = [];

      if (from) {
        chips.push({ name: 'from', value: from, label: this.fromLabel });
      }

      if (to) {
        chips.push({ name: 'to', value: to, label: this.toLabel });
      }

      return chips;
    }

    if (from && to) {
      return [{ value: range(fromDate, toDate, this.dateFormat), label: this.rangeLabel }];
    }

    if (from) {
      return [{ name: 'from', value: from, label: `${this.rangeLabel} from` }];
    }

    if (to) {
      return [{ name: 'to', value: to, label: `${this.rangeLabel} to` }];
    }

    return [];
  }

  public clear(emitChange: boolean = true, restoreDefault: boolean = false) {
    this.setValue(restoreDefault ? this.defaultValue ?? {} : {}, emitChange);
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
