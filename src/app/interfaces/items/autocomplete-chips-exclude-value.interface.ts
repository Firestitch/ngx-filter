import { FilterNameValue } from './base.interface';


/**
 * The value of an AutoCompleteChips item while its exclude toggle is on: the picks in
 * the shape the item holds them (a list, or one pick when `multiple` is false) and the
 * mode. A plain list (or pick) is an include, so the item's value only takes this shape
 * when something is excluded. Pass it as a default or a value to open the item in
 * exclude mode; the item's config must have `exclude` for it to count.
 */
export interface FilterAutocompleteChipsExcludeValue {
  exclude: boolean;
  selected: FilterNameValue[] | FilterNameValue | null;
}
