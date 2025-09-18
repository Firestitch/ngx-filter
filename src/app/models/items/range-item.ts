
import { Observable, tap } from 'rxjs';

import { isObject } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigRangeItem,
} from '../../interfaces/items/range.interface';

import { BaseItem } from './base-item';


export class RangeItem extends BaseItem<IFilterConfigRangeItem> {

  public declare options: { scale?: number };
  public declare prefix: string;
  public declare suffix: string;
  
  constructor(
    itemConfig: IFilterConfigRangeItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.options = itemConfig.options;
    this.prefix = itemConfig.prefix;
    this.suffix = itemConfig.suffix;
  }

  public static create(config: IFilterConfigRangeItem, filter: FilterComponent) {
    return new RangeItem(config, filter);
  }

  public get query(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;
    const params = {};
    const paramMinName = getRangeName(name, 'min');
    const paramMaxName = getRangeName(name, 'max');

    if (isObject(value)) {
      params[paramMinName] = value.min || undefined;
      params[paramMaxName] = value.max || undefined;
    } else {
      params[paramMinName] = undefined;
      params[paramMaxName] = undefined;
    }

    return params;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    const chips = [];

    if (this.value.min) {
      chips.push({
        name: 'min',
        label: this.label[0],
        value: this.value.min,
      });
    }

    if (this.value.max) {
      chips.push({
        name: 'max',
        label: this.label[1],
        value: this.value.max,
      });
    }

    return chips;
  }

  public clear(emitChange: boolean = true) {
    this.setValue({}, emitChange);
  }

  public clearByName(name: string, emitChange: boolean = true) {
    if (name === 'min') {
      this.setValue({ ...this.value, min: undefined }, emitChange);
    } else if (name === 'max') {
      this.setValue({ ...this.value, max: undefined }, emitChange);
    }
  }

  public get hasValue() {
    return this.value?.min !== undefined || super.value?.max !== undefined;
  }

  public setValue(value: { min?: string, max?: string }, emitChange: boolean = true) {
    super.setValue({
      min: value?.min,
      max: value?.max,
    }, emitChange);
  }

  public init(value: unknown): Observable<unknown> {
    return super.init(value)
      .pipe(
        tap(() => {
          if (!this.label) {
            this.label = ['Min', 'Max'];
          }

          if (!this.value) {
            this.value = this.defaultValue || {};
          }
        }),
      );
  }
}
