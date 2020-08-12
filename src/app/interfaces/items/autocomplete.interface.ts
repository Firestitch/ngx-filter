import { FilterAutoCompleteType, IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigAutocompleteItem extends IFilterConfigBaseItem<FilterAutoCompleteType> {
  fetchOnFocus?: boolean;
}
