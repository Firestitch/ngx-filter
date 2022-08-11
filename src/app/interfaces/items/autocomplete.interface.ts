import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';
import { ItemType } from '../../enums/item-type.enum';


export interface IFilterConfigAutocompleteItem extends IFilterConfigBaseItem<ItemType.AutoComplete> {
  fetchOnFocus?: boolean;
  default?: IFilterDefaultFn<FilterNameValue> | FilterNameValue;
}
