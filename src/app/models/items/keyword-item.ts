
import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigKeywordItem } from '../../interfaces/items/keyword.interface';

import { TextItem } from './text-item';


export class KeywordItem extends TextItem {

  public declare fullWidth: boolean;

  constructor(
    itemConfig: IFilterConfigKeywordItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.fullWidth = itemConfig.fullWidth;
  }

  public static create(config: IFilterConfigKeywordItem, filter: FilterComponent) {
    return new KeywordItem(config, null, filter);
  }

  public get hasValue() {
    return typeof this.value === 'string' && this.value.length > 0;
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

    return [
      {
        value: this.value,
        label: this.label,
      },
    ];
  }
}
