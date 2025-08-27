import { tap } from 'rxjs/operators';

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

  public init(value) {
    return super.init(value)
      .pipe(
        tap(() => {
          this.value = value === 'true' || value === true;
        }),
      );
  }

  public get checked(): boolean {
    return this._checked;
  }

  public get unchecked(): boolean {
    return this._unchecked;
  }
  
  public get hasValue(): boolean {
    return !!this.value;
  }

  public get query(): Record<string, unknown> {
    if(!this.hasValue && this._unchecked === undefined) {
      return {};
    }

    return {
      [this.name]: this.value ? this.checked : this.unchecked,
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.value) {
      return [];
    }

    return [
      {
        value: '',
        label: this.label,
      },
    ];
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.checked,
    };
  }

  public clear() {
    this.value = false;
  }

}
