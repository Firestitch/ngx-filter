import { clone, isObject } from 'lodash-es';
import { isEmpty } from '@firestitch/common';

import { getRangeName } from '../../helpers/get-range-name';
import { IFilterConfigRangeItem } from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseItem } from './base-item';


export class RangeItem extends BaseItem<IFilterConfigRangeItem> {

  public static create(config: IFilterConfigRangeItem) {
    return new RangeItem(config, null);
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

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    if (isObject(value)) {
      const values = [];
      if (!isEmpty(value.min, { zero: true })) {
        const paramName = getRangeName(this.case, name, 'min');

        params[paramName] = value.min;
        values.push(value.min);
      }

      if (!isEmpty(value.max, { zero: true })) {
        const paramName = getRangeName(this.case, name, 'max');

        params[paramName] = value.max;
        values.push(value.max);
      }

      // Legacy support
      if (values.length) {
        params[name] = values.join(',');
      }
    } else {
      params[name] = null;
      const paramMinName = getRangeName(this.case, name, 'min');
      const paramMaxName = getRangeName(this.case, name, 'max');

      params[paramMinName] = null;
      params[paramMaxName] = null;
    }


    return params;
  }

  public clear() {
    super.clear();

    this.model = {};
  }

  public checkIfValueChanged() {
    if (this.model && Object.keys(this.model).length > 0) {
      this.valueChanged = true;
    }
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

  protected _validateModel() {
  }

  protected _parseConfig(item: IFilterConfigRangeItem) {
    this.options = item.options;
    this.prefix = item.prefix;
    this.suffix = item.suffix;

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
