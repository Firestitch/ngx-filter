import { IFilterConfigBaseItem } from './base.interface';
import { ItemType } from '../../enums/item-type.enum';


export interface IFilterConfigAutocompleteChipsItem extends IFilterConfigBaseItem<ItemType.AutoCompleteChips> {
  fetchOnFocus?: boolean;
  chipImage?: string;
  chipColor?: string;
  chipBackground?: string;
  chipIcon?: string;
  chipClass?: string;
}
