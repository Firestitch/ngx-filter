import { BaseSelectItem } from './base-select-item';
import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';

export class SimpleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any
  ) {
    super(itemConfig, _persistedValues);
  }

  public get value() {
    let value = this.model;

    if (value == '__all') {
      value = null;
    }

    return value;
  }

  public checkIfValueChanged() {
    const hasAllOption = Array.isArray(this.values) && this.values.some((val) => val.value === '__all');

    if (hasAllOption && this.model && this.model !== '__all') {
      this.valueChanged = true;
    } else {
      this.valueChanged = !!this.model;
    }
  }

  public clear() {
    super.clear();

    this.model = Array.isArray(this.values) && this.values.some((val) => val.value === '__all')
      ? '__all'
      : null;
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
}
