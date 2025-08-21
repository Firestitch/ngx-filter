import { clone } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigAutocompleteChipsItem } from '../../interfaces/items/autocomplete-chips.interface';

import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';


export class AutocompleteChipsItem
  extends BaseAutocompleteItem<IFilterConfigAutocompleteChipsItem> {

  public declare chipImage: string;
  public declare chipIcon: string;
  public declare chipColor: string;
  public declare chipIconColor: string;
  public declare chipBackground: string;
  public declare chipClass: string;

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
  }

  public static create(config: IFilterConfigAutocompleteChipsItem, filter: FilterComponent) {
    return new AutocompleteChipsItem(config, null, filter);
  }

  public get value() {
    if (Array.isArray(this.model) && this.model.length === 0) {
      return undefined;
    }

    return clone(this.model);
  }

  public get queryObject(): Record<string, unknown> {
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

  public get isChipVisible(): boolean {
    return Array.isArray(this.model) && this.model.length > 0;
  }

  public getChipsContent() {
    return this.model
      .reduce((acc, i) => {
        acc.push(i.name);

        return acc;
      }, [])
      .join(', ');
  }

  public setModel(value) {
    super.setModel(value || []);
  }

  protected _init() {
    if (this.model === undefined) {
      this._model = [];
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? [];
    this.search = '';
  }

}
