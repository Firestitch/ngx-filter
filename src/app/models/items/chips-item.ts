import { clone, isObject } from 'lodash-es';
import { BaseItem } from './base-item';
import { IFilterConfigChipsItem } from '../../interfaces/items/chips.interface';


export class ChipsItem extends BaseItem<IFilterConfigChipsItem> {

  public static create(config: IFilterConfigChipsItem) {
    return new ChipsItem(config, null);
  }

  public multiple: boolean;

  public get isTypeChips(): boolean {
    return true;
  }

  public get value() {
    let value = clone(this.model);

    if (Array.isArray(this.model) && this.model.length) {
      value = this.model;
    }

    return value;
  }

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    if (Array.isArray(value)) {
      params[name] = this.model.map(item => {
        return isObject(item) ? item.value : null;
      }).join(',');
    } else {
      params[name] = null;
    }

    return params;
  }

  public clear() {
    this.model = [];
  }

  public checkIfValueChanged() {
    this.valueChanged = false;
  }

  protected _validateModel() {
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

  protected _parseConfig(item: IFilterConfigChipsItem) {
    this.multiple = item.multiple;

    super._parseConfig(item);
  }

  protected _init() {
    if (!Array.isArray(this.values)) {
      this.values = [];
    }

    debugger;

    if (this.model && Array.isArray(this.model) && this.values.length) {
      if (Number.isInteger(this.model[0])) {
        this.model = this.model.map((id) => {
          return this.values.find((value) => value.value === id);
        })
      }
    }

    if (!this.model) {
      this.model = [];
    }
  }

}
