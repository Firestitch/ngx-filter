import { isEmpty } from '@firestitch/common';

import { clone, isObject } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigRangeItem,
  IFilterItemDefaultRange,
} from '../../interfaces/items/range.interface';

import { BaseItem } from './base-item';


export class RangeItem extends BaseItem<IFilterConfigRangeItem> {

  public static create(config: IFilterConfigRangeItem, additionalConfig: unknown, filter: FilterComponent) {
    return new RangeItem(config, additionalConfig, filter);
  }

  public case: 'snake' | 'camel';
  public options: { scale?: number };
  public prefix: string;
  public suffix: string;

  protected readonly _additionalConfig: { case: 'camel' | 'snake' };

  public get value() {
    let value = clone(this.model);

    if (!isObject(this.model) ||
      (isEmpty(this.model.max, { zero: true }) && isEmpty(this.model.min, { zero: true }))) {
      value = undefined;
    }

    return value;
  }

  public get queryObject() {
    const value = this.value;
    const name = this.name;
    const params = {};
    const paramMinName = getRangeName(this.case, name, 'min');
    const paramMaxName = getRangeName(this.case, name, 'max');

    if (isObject(value)) {
      params[paramMinName] = value.min || undefined;
      params[paramMaxName] = value.max || undefined;
    } else {
      params[paramMinName] = undefined;
      params[paramMaxName] = undefined;
    }

    return params;
  }

  public get isChipVisible(): boolean {
    return this.model && (this.model.min !== undefined || this.model.max !== undefined);
  }

  public getChipsContent(type): string {
    if (type === 'from') {
      const min = this.model.min;

      return `${min}`;
    } else if (type === 'to') {
      const max = this.model.max;

      return `${max}`;
    }
  }

  public clearRange(type: 'from' | 'to' = null, defaultValue: IFilterItemDefaultRange = undefined) {
    if (type === 'from') {
      delete this.model.min;

      if (defaultValue?.min) {
        this.model.min = defaultValue.min;
      }

      this.model = { ...this.model };
    } else if (type === 'to') {
      delete this.model.max;

      if (defaultValue?.max) {
        this.model.max = defaultValue.max;
      }

      this.model = { ...this.model };
    } else {
      this.model = defaultValue ? { ...defaultValue } : {};
    }
  }

  protected _validateModel() {
  }

  protected _parseConfig(item: IFilterConfigRangeItem) {
    this.options = item.options;
    this.prefix = item.prefix;
    this.suffix = item.suffix;
    this.case = this._additionalConfig?.case ?? 'camel';

    super._parseConfig(item);
  }

  protected _init() {
    if (!this.label) {
      this.label = ['Min', 'Max'];
    }

    if (!this.model) {
      this.model = this.defaultValue || {};
    }
  }
}
