
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
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.options = itemConfig.options;
    this.prefix = itemConfig.prefix;
    this.suffix = itemConfig.suffix;
  }

  public static create(config: IFilterConfigRangeItem, additionalConfig: unknown, filter: FilterComponent) {
    return new RangeItem(config, additionalConfig, filter);
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

  public clear(name: string = null) {
    let value = this.value;

    if (name === 'min') {
      value.min = this.defaultValue?.min;
    } else if (name === 'max') {
      value.max = this.defaultValue?.max;
    } else {
      value = this.defaultValue ? { ...this.defaultValue } : {};
    }

    this.value = { ...value };
  }

  public get value() {
    return {
      min: super.value?.min,
      max: super.value?.max,
    };
  }

  public set value(value) {
    super.value = value;
  }

  public get hasValue() {
    return this.value?.min !== undefined || super.value?.max !== undefined;
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
