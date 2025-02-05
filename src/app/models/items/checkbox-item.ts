import { toString } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigCheckboxItem } from '../../interfaces/items/checkbox.interface';

import { BaseItem } from './base-item';


export class CheckboxItem extends BaseItem<IFilterConfigCheckboxItem> {

  private declare _checked;
  private declare _unchecked;

  constructor(
    itemConfig: IFilterConfigCheckboxItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this._checked = itemConfig.checked ? toString(itemConfig.checked) : true;
    this._unchecked = itemConfig.unchecked ? toString(itemConfig.unchecked) : false;
    this.defaultValue = itemConfig.default === undefined ? this._unchecked : toString(this.defaultValue);
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

  public get checked(): boolean {
    return this._checked;
  }

  public get queryObject(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = this.model ? value : undefined;

    return params;
  }

  public getChipsContent(): string {
    return this.label as string;
  }

  protected _validateModel() {
    //
  }

  protected _init() {
    if (this.model === undefined) {
      this._model = this._checked === this.defaultValue;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? false;
  }

}
