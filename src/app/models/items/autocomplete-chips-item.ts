
import type { FilterComponent } from '../../components/filter/filter.component';
import { encodeQueryParam } from '../../helpers';
import { IFilterConfigAutocompleteChipsItem } from '../../interfaces/items/autocomplete-chips.interface';

import { BaseAutocompleteItem } from './base-autocomplete-item';


export class AutocompleteChipsItem
  extends BaseAutocompleteItem<IFilterConfigAutocompleteChipsItem> {

  public declare chipImage: string;
  public declare chipIcon: string;
  public declare chipColor: string;
  public declare chipIconColor: string;
  public declare chipBackground: string;
  public declare chipClass: string;
  public declare panelActions: {
    label: string;
    click: (filter: FilterComponent) => void;
  }[];

  constructor(
    itemConfig: IFilterConfigAutocompleteChipsItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.chipImage = itemConfig.chipImage ?? 'image';
    this.chipIcon = itemConfig.chipIcon;
    this.chipIconColor = itemConfig.chipIconColor;
    this.chipColor = itemConfig.chipColor;
    this.chipBackground = itemConfig.chipBackground;
    this.chipClass = itemConfig.chipClass;
    this.panelActions = itemConfig.panelActions || [];
  }

  public static create(config: IFilterConfigAutocompleteChipsItem, filter: FilterComponent) {
    return new AutocompleteChipsItem(config, null, filter);
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.value
        .filter((item) => !!item.value)
        .map((item) =>{
          return `${item.value}:${encodeQueryParam(item.name)}`;
        })
        .join(','),
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    const value = this.value;
    const name = this.name;
    const params = {};

    if (Array.isArray(value)) {
      params[this.name] = value
        .filter((item) => !!item.value)
        .map((item) => item.value)
        .join(',');
    } else {
      params[name] = value;
    }

    return params;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    return this.hasValue ? [
      {
        value: super.value
          .reduce((acc, i) => {
            acc.push((`${i.name}`).trim());

            return acc;
          }, [])
          .join(', '),
        label: this.label,
      },
    ] : [];
  }

  public get hasValue() {
    return Array.isArray(super.value) && super.value.length > 0;
  }

  public setValue(value, emitChange = true) {
    super.setValue(Array.isArray(value) ? value : [], emitChange);
  }

}
