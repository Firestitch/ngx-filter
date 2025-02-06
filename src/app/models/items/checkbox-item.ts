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
    this._checked = itemConfig.checked ? toString(itemConfig.checked) : 'true';
    this._unchecked = itemConfig.unchecked ? toString(itemConfig.unchecked) : undefined;
    this.defaultValue = itemConfig.default;
  }

  public get isTypeCheckbox(): boolean {
    return true;
  }

  public get isChipVisible() {
    return this.model;
  }

  public get value() {
    return this.model;
  }

  public get checked(): boolean {
    return this._checked;
  }

  public get unchecked(): boolean {
    return this._unchecked;
  }

  public get queryObject(): Record<string, unknown> {
    const params = {};
    params[this.name] = this.model ? this.checked : this.unchecked;

    return params;
  }

  public getChipsContent(): string {
    return this.label as string;
  }

  protected _validateModel() {
    //
  }

  public get isQueryParamVisible(): boolean {
    return this.model === true;
  }

  protected _init() {
    if (this.model === undefined) {
      this._model = this.defaultValue;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = false;
  }

}
