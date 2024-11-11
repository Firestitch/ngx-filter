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

  protected _init() {
    if (this.model === undefined) {
      this._model = [];
    }
  }

  protected _parseConfig(item: IFilterConfigAutocompleteChipsItem) {
    this.chipImage = item.chipImage ?? 'image';
    this.chipIcon = item.chipIcon;
    this.chipIconColor = item.chipIconColor;
    this.chipColor = item.chipColor;
    this.chipBackground = item.chipBackground;
    this.chipClass = item.chipClass;

    super._parseConfig(item);
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? [];
    this.search = '';
  }

  protected _setModel(value) {
    super._setModel(value || []);
  }

}
