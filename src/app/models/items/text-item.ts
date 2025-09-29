
import type { FilterComponent } from '../../components/filter/filter.component';
import {
  IFilterConfigTextItem,
} from '../../interfaces/items/text.interface';

import { BaseItem } from './base-item';


export class TextItem extends BaseItem<IFilterConfigTextItem> {

  public declare prefix: string;
  public declare suffix: string;

  constructor(
    itemConfig: IFilterConfigTextItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.prefix = itemConfig.prefix;
    this.suffix = itemConfig.suffix;
  }

  public static create(config: IFilterConfigTextItem, filter: FilterComponent) {
    return new TextItem(config, filter);
  }

  public get hasValue() {
    return this.value !== undefined && this.value !== null && this.value !== '';
  }

  public get query() {
    if(!this.hasValue) {
      return {};
    }

    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = value;

    return params;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.hasValue || this.isTypeKeyword) {
      return [];
    }

    let value = this.value;

    if(this.prefix) {
      value = `${this.prefix.length > 1 ? `${this.prefix} ` : this.prefix}${value}`;
    }

    if(this.suffix) {
      value = `${value}${this.suffix.length > 1 ? ` ${this.suffix}` : this.suffix}`;
    }

    return [
      {
        value,
        label: this.label,
      },
    ];
  }
}
