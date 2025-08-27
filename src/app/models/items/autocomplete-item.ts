
import { clone } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigAutocompleteItem } from '../../interfaces/items/autocomplete.interface';

import { BaseAutocompleteItem } from './base-autocomplete-item';


export class AutocompleteItem extends BaseAutocompleteItem<IFilterConfigAutocompleteItem> {

  public static create(config: IFilterConfigAutocompleteItem, filter: FilterComponent) {
    return new AutocompleteItem(config, null, filter);
  }

  public get value() {
    let value = clone(super.value);

    if (!super.value || super.value.value === undefined) {
      return undefined;
    }

    value = super.value.value;

    return value;
  }

  public get query() {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = value;

    return params;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    return [
      {
        value: this.value ? this.value.name : '', 
        label: this.value.label,
      },
    ];
  }
}
