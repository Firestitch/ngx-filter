import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';
import { findValue } from '../../../helpers/find-value';
import { BaseSelectItem } from './base-select-item';


export class SimpleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any
  ) {
    super(itemConfig, _persistedValues);
  }

  public get value() {
    let value = this.model;

    if (value == '__all' || value === undefined) {
      value = null;
    }

    return value;
  }

  public getChipsContent(type = null): string {
    if (this.children) {
      const itemValue = findValue(this.values, this.model, this.children);

      return itemValue && itemValue.name
    } else {
      const itemValue = this.values.find((val) => val.value === this.model);

      if (itemValue) {
        return itemValue.name
      } else if (this.isolate) {
        return this.isolate.label
      }
    }
  }

  protected _init() {
    super._init();

    if (this.model === undefined && this.defaultValue === undefined) {
      this.model = '__all';
    }
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
    const item = this.values.find(value => {
      return value.value == this.model;
    });

    this.model = item ? item.value : '__all';
  }

  protected _clearValue() {
    this.model = Array.isArray(this.values) && this.values.some((val) => val.value === '__all')
      ? '__all'
      : null;
  }
}
