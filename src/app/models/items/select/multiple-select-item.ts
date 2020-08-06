import { clone } from 'lodash-es';
import { BaseSelectItem } from './base-select-item';
import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';
import { filter } from '@firestitch/common';

export class MultipleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any
  ) {
    super(itemConfig, _persistedValues);
  }

  public get value() {
    let value = clone(this.model);

    if (value && value.indexOf('__all') > -1) {
      value = null;
    }

    return value;
  }

  public checkIfValueChanged() {
    this.valueChanged = this.model && this.model.length;
  }

  public clear() {
    this.model = [];
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

    this._model = value;
  }

  protected _validateModel() {
    this.model = filter(this.model || [], (item) => {
      return this.values.find(value => {
        return value.value == item;
      });
    });
  }
}