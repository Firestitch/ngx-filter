import { toString } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigCheckboxItem } from '../../interfaces/items/checkbox.interface';

import { BaseItem } from './base-item';


export class CheckboxItem extends BaseItem<IFilterConfigCheckboxItem> {

  public checked: unknown;
  public unchecked: unknown;

  public static create(config: IFilterConfigCheckboxItem, filter: FilterComponent) {
    return new CheckboxItem(config, null, filter);
  }

  public get isTypeCheckbox(): boolean {
    return true;
  }

  public get isChipVisible() {
    return this.value === (this as any).checked;
  }

  public get value() {
    const value = this.model ? this.checked : this.unchecked;

    if (!value) {
      return undefined;
    }

    return value;
  }

  public get queryObject(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = this.model ? value : undefined;

    return params;
  }

  public getChipsContent(type = null): string {
    return this.label as string;
  }

  protected _validateModel() {
    //
  }

  protected _parseConfig(item: IFilterConfigCheckboxItem) {
    this.checked = item.checked;
    this.unchecked = item.unchecked;

    this.checked = item.checked ? toString(item.checked) : true;
    this.unchecked = item.unchecked ? toString(item.unchecked) : false;
    this.defaultValue = item.default === undefined ? this.unchecked : toString(this.defaultValue);

    super._parseConfig(item);
  }

  protected _init() {
    if (this.model === undefined) {
      this._model = this.checked === this.defaultValue;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? false;
  }

}
