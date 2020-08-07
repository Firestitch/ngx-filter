import { clone } from 'lodash-es';
import { isEmpty } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { IFilterConfigAutocompleteItem } from '../../interfaces/item-config.interface';
import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';


export class AutocompleteItem extends BaseAutocompleteItem {

  public static create(config: IFilterConfigAutocompleteItem) {
    return new AutocompleteItem(config, null);
  }

  public type: ItemType.AutoComplete;

  public get isTypeAutocomplete(): boolean {
    return true;
  }

  public get value() {
    let value = clone(this.model);

    if (!this.model || isEmpty(this.model.value, { zero: true })) {
      return null;
    }

    value = this.model.value;

    return value;
  }

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  public clear() {
    super.clear();

    this.model = null;
    this.search = '';
  }

  public checkIfValueChanged() {
    this.valueChanged = !!this.model;
  }

  protected _init() {
  }

}
