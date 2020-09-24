import { BaseItem } from '../base-item';
import { IFilterConfigAutocompleteItem } from '../../../interfaces/items/autocomplete.interface';
import { IFilterConfigAutocompleteChipsItem } from '../../../interfaces/items/autocomplete-chips.interface';

type AutoCompleteItem = IFilterConfigAutocompleteItem | IFilterConfigAutocompleteChipsItem;

export abstract class BaseAutocompleteItem<T extends AutoCompleteItem> extends BaseItem<T> {

  public search: string;

  public fetchOnFocus: boolean;
  public clearAllowed: boolean;

  protected _validateModel() {
  }

  protected _parseConfig(item: T) {
    this.fetchOnFocus = item.fetchOnFocus ?? true;
    this.clearAllowed = item.clear ?? true;

    super._parseConfig(item);
  }
}
