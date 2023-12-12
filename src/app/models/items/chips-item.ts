import { clone } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigChipsItem } from '../../interfaces/items/chips.interface';

import { BaseItem } from './base-item';


export class ChipsItem extends BaseItem<IFilterConfigChipsItem> {

  public multiple: boolean;

  public static create(config: IFilterConfigChipsItem, filter: FilterComponent) {
    return new ChipsItem(config, null, filter);
  }

  public get isTypeChips(): boolean {
    return true;
  }

  public get value() {
    const value = clone(this.model);

    if (Array.isArray(value) && value.length === 0) {
      return undefined;
    }

    return value;
  }

  public get isChipVisible(): boolean {
    return !!this.value;
  }

  public get queryObject(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;

    return {
      [name]: value,
    };
  }

  public get persistanceObject(): Record<string, string> {
    const value = this.value;
    const name = this.name;
    const params = {};

    if (Array.isArray(value)) {
      params[name] = value.join(',');
    } else {
      params[name] = undefined;
    }

    return params;
  }

  public getChipsContent() {
    return this.model
      .reduce((acc, i) => {
        acc.push(i.name);

        return acc;
      }, [])
      .join(', ');
  }

  protected _validateModel() {
    //
  }

  protected _setModel(value) {
    if (Array.isArray(value)) {
      value = value.map((val) => {
        if (isNaN(val)) {
          return val;
        }

        return +val;

      });
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

    if (this.model && Array.isArray(this.model) && this.values.length) {
      if (Number.isInteger(this.model[0])) {
        this._model = this.model.map((id) => {
          return this.values.find((value) => value.value === id);
        });
      }
    }

    if (this.model === undefined) {
      this._model = [];
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? [];
  }

}
