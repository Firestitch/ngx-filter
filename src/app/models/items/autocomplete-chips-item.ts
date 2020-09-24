import { clone, isObject } from 'lodash-es';

import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigAutocompleteChipsItem } from '../../interfaces/items/autocomplete-chips.interface';

import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';


export class AutocompleteChipsItem extends BaseAutocompleteItem<IFilterConfigAutocompleteChipsItem> {

  public static create(config: IFilterConfigAutocompleteChipsItem) {
    return new AutocompleteChipsItem(config, null);
  }

  public type: ItemType.AutoCompleteChips;
  public chipImage: string;
  public chipIcon: string;
  public chipColor: string;
  public chipIconColor: string;
  public chipBackground: string;
  public chipClass: string;

  public get value() {
    if (Array.isArray(this.model) && this.model.length === 0) {
      return null;
    }

    return clone(this.model);
  }

  public get valueAsQuery() {
    const value = this.value;
    const name = this.name;
    const params = [];

    if (Array.isArray(value)) {
      params[name] = this.model
        .map(item => {
          return isObject(item) ? item.value : null;
        })
        .join(',');
    } else {
      params[name] = null;
    }

    return params;
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
    this.clearAllowed = item.clear ?? true;

    super._parseConfig(item);
  }

  protected _clearValue() {
    this.model = [];
    this.search = '';
  }

}
