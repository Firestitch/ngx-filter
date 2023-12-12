import { findValue } from '../../../helpers/find-value';
import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';

import { BaseSelectItem } from './base-select-item';


export class SimpleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any,
  ) {
    super(itemConfig, _persistedValues);
  }

  public get value() {
    let value = this.model;

    if (value == '__all' || value === undefined) {
      value = undefined;
    }

    return value;
  }

  public getChipsContent(type = null): string {
    if (this.children) {
      const itemValue = findValue(this.values, this.model, this.children);

      return itemValue && itemValue.name;
    }
    const itemValue = this.values.find((val) => val.value === this.model);

    if (itemValue) {
      return itemValue.name;
    } else if (this.isolate) {
      return this.isolate.label;
    }

  }

  public get isChipVisible(): boolean {
    return this.model !== '__all' && this.model !== undefined;
  }

  protected _init() {
    super._init();

    if (this.model === undefined && this.defaultValue === undefined) {
      this._model = '__all';
    }
  }

  protected get isolateOptionNotSelected() {
    const modelValue = this.model;
    const isolate = this.isolate;

    return isolate && !isolate.enabled && modelValue?.length === 0;
  }

  protected _setModel(value): void {
    if (value) {
      if (!isNaN(value)) {
        value = +value;
      }
    }

    super._setModel(value);
  }

  protected _validateModel() {
    const item = this.values.find((value) => {
      return value.value == this.model;
    });

    const value = item ? item.value : '__all';

    if (this._model !== value) {
      this.model = value;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    super._clearValue(defaultValue);

    const value = Array.isArray(this.values) && this.values.some((val) => val.value === '__all')
      ? '__all'
      : undefined;

    this.model = defaultValue ?? value;
  }
}
