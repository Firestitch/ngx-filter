import { Observable } from 'rxjs';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';

import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';


/**
 * Passed straight through to fs-autocomplete-chips' own `shape` input, so the names are
 * its names. Note that a single-select without a chip background renders as plain text
 * regardless of this — that is the autocomplete-chips component's own rule.
 */
export type FilterAutocompleteChipsShape = 'roundChip' | 'squareChip' | 'none';

/**
 * Builds the second line rendered under an option's label, in the panel and on the
 * selected chip alike. Receives the value object the `values` fn produced.
 */
export type FilterAutocompleteChipsSubcontentFn = (data: any) => string;

export interface IFilterConfigAutocompleteChipsItem extends IFilterConfigBaseItem<ItemType.AutoCompleteChips> {
  fetchOnFocus?: boolean;
  // Defaults to true, which is how this item type has always behaved. false holds a single
  // {name, value} rather than an array of them, the way ItemType.AutoComplete does.
  multiple?: boolean;
  shape?: FilterAutocompleteChipsShape;
  chipImage?: string;
  chipColor?: string;
  chipIconColor?: string;
  chipBackground?: string;
  chipIcon?: string;
  chipClass?: string;
  subcontent?: FilterAutocompleteChipsSubcontentFn;
  default?: IFilterDefaultFn<FilterNameValue[] | FilterNameValue> | FilterNameValue[] | FilterNameValue;
  values?: (keyword?: string, filter?: FilterComponent) => Observable<any[]>;
  panelActions?: {
    label: string;
    click: (filter: FilterComponent) => void;
  }[];
}
