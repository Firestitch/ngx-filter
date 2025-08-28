

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigChipsItem } from '../../interfaces/items/chips.interface';

import { BaseItem } from './base-item';


export class ChipsItem extends BaseItem<IFilterConfigChipsItem> {

  public declare multiple: boolean;

  constructor(
    itemConfig: IFilterConfigChipsItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.multiple = itemConfig.multiple ?? true;
  }
  
  public static create(config: IFilterConfigChipsItem, filter: FilterComponent) {
    return new ChipsItem(config, null, filter);
  }

  public get hasValue() {
    return this.value.length > 0;
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }
  
    return {
      [this.name]: this.value
        .map((item) => `${item.value}:${item.name}`)
        .join(','),
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.value) {
      return {};
    }

    return {
      [this.name]: this.value
        .map((item) => item.value)
        .join(','),
    };
  }
  
  public get chips(): { name?: string, value: string, label: string }[] {
    return this.hasValue ? [
      {
        value: this.value
          .reduce((acc, i) => {
            acc.push((`${i.name}`).trim());

            return acc;
          }, [])
          .join(', '),
        label: this.label,
      },
    ] : [];
  }

  public setValue(value, emitChange = true) {
    super.setValue(Array.isArray(value) ? value : [], emitChange);
  }

  public clear() {
    this.value = [];
  }

}
