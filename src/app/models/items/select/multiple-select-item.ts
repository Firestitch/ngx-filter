import { filter } from '@firestitch/common';

import { clone } from 'lodash-es';

import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';
import { BaseSelectItem } from './base-select-item';


export class MultipleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any
  ) {
    super(itemConfig, _persistedValues);
  }

  public get value() {
    let value = clone(this.model);

    if (!Array.isArray(value) || value.length === 0 || value.indexOf('__all') > -1) {
      value = null;
    }

    return value;
  }

  public getChipsContent(type = null): string {
    const options = this.model.reduce((acc, key) => {
      const itemValue = this.values.find((val) => val.value === key);

      if (itemValue) {
        acc.push(itemValue.name);
      } else if (this.isolate && this.isolate.enabled) {
        acc.push(this.isolate.label);
      }

      return acc;
    }, []);

    return options.join(', ');
  }

  protected _init() {
    super._init();

    if (this.model === undefined && !Array.isArray(this.defaultValue)) {
      this.model = [];
    }
  }
  protected _setModel(value) {
    if (Array.isArray(value)) {
      value = value.map((val) => {
        if (isNaN(val)) {
          return val;
        } else {
          return +val;
        }
      })
    }

    super._setModel(value);
  }

  protected _validateModel() {
    this.model = filter(this.model || [], (item) => {
      return this.values.find(value => {
        return value.value == item;
      });
    });
  }

  protected _clearValue() {
    super._clearValue();

    this.model = this.defaultValue ?? [];
  }
}
