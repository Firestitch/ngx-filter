import { clone, isObject } from 'lodash-es';
import { IFilterConfigAutocompleteItem } from '../../interfaces/item-config.interface';
import { BaseAutocompleteItem } from './autocomplete/base-autocomplete-item';
import { ItemType } from '@firestitch/filter';


export class AutocompleteChipsItem extends BaseAutocompleteItem {

  public static create(config: IFilterConfigAutocompleteItem) {
    return new AutocompleteChipsItem(config, null);
  }

  public type: ItemType.AutoCompleteChips;

  public get isTypeAutocompleteChips(): boolean {
    return true;
  }

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

  public clear() {
    super.clear();

    this.model = [];
    this.search = '';
  }

  public checkIfValueChanged() {
    this.valueChanged = this.model && this.model.length;
  }

  protected _init() {
    if (this.model === undefined) {
      this.model = [];
    }
  }

}
