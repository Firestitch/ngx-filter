import type { FilterComponent } from '../../components/filter/filter.component';
import { encodeQueryParam } from '../../helpers';
import { IFilterConfigAutocompleteItem } from '../../interfaces/items/autocomplete.interface';

import { BaseAutocompleteItem } from './base-autocomplete-item';


export class AutocompleteItem extends BaseAutocompleteItem<IFilterConfigAutocompleteItem> {

  public static create(config: IFilterConfigAutocompleteItem, filter: FilterComponent) {
    return new AutocompleteItem(config, filter);
  }

  /**
   * Returns the unwrapped primitive value (e.g. 123) from the
   * underlying {name, value} object stored via BaseItem.
   */
  public get value() {
    if (!super.value || super.value.value === undefined) {
      return undefined;
    }

    return super.value.value;
  }

  /**
   * API-ready query: returns the raw primitive value keyed by item name.
   */
  public get query(): Record<string, any> {
    if (!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.value,
    };
  }

  /**
   * URL-ready query param: returns `value:encodedName` format for
   * round-tripping through browser query strings.
   * Uses super.value to access the full {name, value} object.
   */
  public get queryParam(): Record<string, unknown> {
    if (!this.hasValue) {
      return {};
    }

    return {
      [this.name]: `${super.value.value}:${encodeQueryParam(super.value.name)}`,
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if (!this.hasValue) {
      return [];
    }

    return [
      {
        value: super.value.name ?? '',
        label: this.label,
      },
    ];
  }
}
