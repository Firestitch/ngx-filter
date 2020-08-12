import { BaseItem } from '../base-item';
import { IFilterConfigAutocompleteItem } from '../../../interfaces/items/autocomplete.interface';


export abstract class BaseAutocompleteItem extends BaseItem<IFilterConfigAutocompleteItem> {

  public search: string;

  public fetchOnFocus: boolean;

  protected _validateModel() {
  }

  protected _parseConfig(item: IFilterConfigAutocompleteItem) {
    this.fetchOnFocus = item.fetchOnFocus;

    super._parseConfig(item);
  }
}
