import { clone } from 'lodash-es';
import { isEmpty } from '@firestitch/common';

import { IFilterConfigAutocompleteItem } from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';
import { filterToQueryParam } from '../../helpers/query-param-transformers';
import { isObject } from 'rxjs/internal-compatibility';


export class AutocompleteItem extends BaseAutocompleteItem {

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

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  public get valueAsQueryParam(): any {
    if (isObject(this.model)) {
      return filterToQueryParam(this.model.value, this.model.name);
    }

    return null;
  }

  public clear() {
    super.clear();

    this.model = null;
    this.search = '';
  }

  // public checkIfValueChanged() {
  //   this.valueChanged = !!this.model;
  // }

  public getChipsContent() {
    return this.model ? this.model.name : ''
  }

  protected _init() {
  }

  protected _clearValue() {
    this.model = null;
    this.search = '';
  }
}
