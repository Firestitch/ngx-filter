import { clone, isObject } from 'lodash-es';
import { isEmpty } from '@firestitch/common';

import { getRangeName } from '../../helpers/get-range-name';
import { IFilterConfigRangeItem } from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseItem } from './base-item';


export class RangeItem extends BaseItem<IFilterConfigRangeItem> {

  public static create(config: IFilterConfigRangeItem, c) {
    return new RangeItem(config, c);
  }

  public readonly type: ItemType.Range;

  public case: 'snake' | 'camel';
  public options: { scale?: number }
  public prefix: string;
  public suffix: string;

  public get value() {
    let value = clone(this.model);

    if (!isObject(this.model) ||
      (isEmpty(this.model.max, { zero: true }) && isEmpty(this.model.min, { zero: true }))) {
      value = null;
    }

    return value;
  }

  public get valueAsQuery() {
    const value = this.value;
    const name = this.name;
    const params = [];
    const paramMinName = getRangeName(this.case, name, 'min');
    const paramMaxName = getRangeName(this.case, name, 'max');

    if (isObject(value)) {
      params[paramMinName] = value.min ?? null;
      params[paramMaxName] = value.max ?? null;
    } else {
      params[paramMinName] = null;
      params[paramMaxName] = null;
    }


    return params;
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

  public clearRange(type: 'from' | 'to') {
    if (type === 'from') {
      delete this.model.min;
    } else if (type === 'to') {
      delete this.model.max;
    }

    this.model = { ...this.model };
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

  protected _clearValue() {
    this.model = {};
  }

}
