import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigAutocompleteChipsItem } from '../../interfaces/items/autocomplete-chips.interface';
import { IFilterConfigAutocompleteItem } from '../../interfaces/items/autocomplete.interface';

import { BaseItem } from './base-item';

type AutoCompleteItem = IFilterConfigAutocompleteItem | IFilterConfigAutocompleteChipsItem;

export abstract class BaseAutocompleteItem<T extends AutoCompleteItem> extends BaseItem<T> {

  public search: string;

  public declare fetchOnFocus: boolean;

  public get valuesFn() {
    return this._valuesFn;
  }
  
  constructor(
    itemConfig: T,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.fetchOnFocus = itemConfig.fetchOnFocus ?? true;
  }

}
