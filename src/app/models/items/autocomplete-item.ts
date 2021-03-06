import { clone } from 'lodash-es';
import { isEmpty } from '@firestitch/common';

import { IFilterConfigAutocompleteItem } from '../../interfaces/items/autocomplete.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';


export class AutocompleteItem extends BaseAutocompleteItem<IFilterConfigAutocompleteItem> {

  public static create(config: IFilterConfigAutocompleteItem) {
    return new AutocompleteItem(config, null);
  }

  public type: ItemType.AutoComplete;

  public get value() {
    let value = clone(this.model);

    if (!this.model || isEmpty(this.model.value, { zero: true })) {
      return null;
    }

    value = this.model.value;

    return value;
  }

  public get valueAsQuery() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  public getChipsContent() {
    return this.model ? this.model.name : ''
  }

  protected _init() {}

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? null;
    this.search = '';
  }
}
