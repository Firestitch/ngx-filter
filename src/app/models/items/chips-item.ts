

import type { FilterComponent } from '../../components/filter/filter.component';
import { encodeQueryParam } from '../../helpers';
import { IFilterConfigChipsItem } from '../../interfaces/items/chips.interface';

import { BaseItem } from './base-item';


export class ChipsItem extends BaseItem<IFilterConfigChipsItem> {

  public declare multiple: boolean;

  constructor(
    itemConfig: IFilterConfigChipsItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.multiple = itemConfig.multiple ?? true;
  }
  
  public static create(config: IFilterConfigChipsItem, filter: FilterComponent) {
    return new ChipsItem(config, filter);
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
        .map((item) => `${item.value}:${encodeQueryParam(item.name)}`)
        .join(','),
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.value
        .map((item) => item.value)
        .join(','),
    };
  }
  
  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.hasValue) {
      return [];
    }

    const chips = this.value
      .reduce((acc, i) => {
        acc.push((`${i.name}`).trim());

        return acc;
      }, [])
      .join(', ');

    return [{
      value: chips,
      label: this.label,
    }];
  }


  public setValue(value, emitChange = true) {
    super.setValue(Array.isArray(value) ? value : [], emitChange);
  }

  public clear(emitChange: boolean = true) {
    this.setValue([], emitChange);
  }

}
