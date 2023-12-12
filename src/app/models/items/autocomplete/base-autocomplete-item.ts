import { IFilterConfigAutocompleteChipsItem } from '../../../interfaces/items/autocomplete-chips.interface';
import { IFilterConfigAutocompleteItem } from '../../../interfaces/items/autocomplete.interface';
import { BaseItem } from '../base-item';

type AutoCompleteItem = IFilterConfigAutocompleteItem | IFilterConfigAutocompleteChipsItem;

export abstract class BaseAutocompleteItem<T extends AutoCompleteItem> extends BaseItem<T> {

  public search: string;

  public fetchOnFocus: boolean;

  public get valuesFn() {
    return this._valuesFn;
  }

  protected _validateModel() {
    //
  }

  protected _parseConfig(item: T) {
    this.fetchOnFocus = item.fetchOnFocus ?? true;

    super._parseConfig(item);
  }
}
