import { clone, isObject } from 'lodash-es';

import { IFilterConfigAutocompleteItem } from '../../interfaces/item-config.interface';
import { ItemType } from '../../enums/item-type.enum';

import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';
import { filterToQueryParam } from '../../helpers/query-param-transformers';


export class AutocompleteChipsItem extends BaseAutocompleteItem {

  public static create(config: IFilterConfigAutocompleteItem) {
    return new AutocompleteChipsItem(config, null);
  }

  public type: ItemType.AutoCompleteChips;

  public get value() {
    if (Array.isArray(this.model) && this.model.length === 0) {
      return null;
    }

    return clone(this.model);
  }

  public get flattenedParams() {
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

  public get valueAsQueryParam(): any {
    if (Array.isArray(this.model) && this.model.length) {
      return this.model.map((item) => {
        return filterToQueryParam(item.value, item.name);
      }).join(',');
    }

    return null;
  }

  // public checkIfValueChanged() {
  //   this.valueChanged = this.model && this.model.length;
  // }

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
      this.model = [];
    }
  }

  protected _clearValue() {
    this.model = [];
    this.search = '';
  }

}
