

import type { FilterComponent } from '../../components/filter/filter.component';
import { filterToQueryParam } from '../../helpers';
import { summarizePicks } from '../../helpers/summarize-picks';
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
        .map((item) => filterToQueryParam(item.value, item.name))
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
  
  public get chips(): { name?: string, value: string, label: string, more?: number }[] {
    if(!this.hasValue) {
      return [];
    }

    const names = this.value
      .map((i) => (`${i.name ?? i.value}`).trim());

    return [{
      ...summarizePicks(names),
      label: this.label,
    }];
  }


  public setValue(value, emitChange = true) {
    super.setValue(Array.isArray(value) ? value : [], emitChange);
  }

  public clear(emitChange: boolean = true, restoreDefault: boolean = false) {
    this.setValue(restoreDefault ? this.defaultValue ?? [] : [], emitChange);
  }

}
