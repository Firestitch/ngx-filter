import { toString } from 'lodash-es';
import { BaseItem } from './base-item';
import { IFilterConfigCheckboxItem } from '../../interfaces/items/checkbox.interface';
import { ItemType } from '@firestitch/filter';


export class CheckboxItem extends BaseItem<IFilterConfigCheckboxItem> {

  public static create(config: IFilterConfigCheckboxItem) {
    return new CheckboxItem(config, null);
  }

  public readonly type: ItemType.Checkbox;

  public checked: unknown;
  public unchecked: unknown;

  public get isTypeCheckbox(): boolean {
    return true;
  }

  public get value() {
    const value = this.model ? this.checked : this.unchecked;

    if (!value) {
      return null;
    }

    return value;
  }

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  public clear() {
    super.clear();

    this.model = false;
  }

  public checkIfValueChanged() {
    if (this.unchecked) {
      this.valueChanged = this.model !== this.unchecked;
    } else {
      this.valueChanged = this.model && this.model !== false;
    }
  }

  protected _validateModel() {
  }

  protected _parseConfig(item: IFilterConfigCheckboxItem) {
    this.checked = item.checked;
    this.unchecked = item.unchecked;

    super._parseConfig(item);
  }

  protected _init() {
    this.checked = this.checked ? toString(this.checked) : true;
    this.unchecked = this.unchecked ? toString(this.unchecked) : false;
    this.defaultValue = this.defaultValue === undefined ? this.unchecked : toString(this.defaultValue);

    if (this.model === undefined) {
      this.model = this.checked == this.defaultValue;
    }
  }

}
