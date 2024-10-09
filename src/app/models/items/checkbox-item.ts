import { toString } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigCheckboxItem } from '../../interfaces/items/checkbox.interface';

import { BaseItem } from './base-item';


export class CheckboxItem extends BaseItem<IFilterConfigCheckboxItem> {

  private _checked;
  private _unchecked;

  constructor(
    config: IFilterConfigCheckboxItem, _additionalConfig, filter: FilterComponent,
  ) {  
    super(config, null, filter);
    this.defaultValue = config.default === undefined ? this._unchecked : toString(this.defaultValue);
    this._checked = config.checked ? toString(config.checked) : true;
    this._unchecked = config.unchecked ? toString(config.unchecked) : false;
  }

  public get isTypeCheckbox(): boolean {
    return true;
  }

  public get isChipVisible() {
    return this.value === this._checked;
  }

  public get value() {
    const value = this.model ? this._checked || 'true' : this._unchecked;

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

  protected _init() {
    if (this.model === undefined && this.defaultValue !== undefined) {
      this._model = this._checked === this.defaultValue;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? false;
  }

}
