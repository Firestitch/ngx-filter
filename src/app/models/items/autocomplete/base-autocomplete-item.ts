import { BaseItem } from '../base-item';
import { IFilterConfigAutocompleteItem } from '../../../interfaces/items/autocomplete.interface';
import { IFilterConfigAutocompleteChipsItem } from '../../../interfaces/items/autocomplete-chips.interface';

type AutoCompleteItem = IFilterConfigAutocompleteItem | IFilterConfigAutocompleteChipsItem;

export abstract class BaseAutocompleteItem<T extends AutoCompleteItem> extends BaseItem<T> {

  public search: string;

  public fetchOnFocus: boolean;

  protected _validateModel() {
  }

  protected _parseConfig(item: T) {
    this.fetchOnFocus = item.fetchOnFocus ?? true;

    super._parseConfig(item);
  }
}
