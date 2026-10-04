import { Observable } from 'rxjs';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';

import { FilterAutocompleteChipsExcludeValue } from './autocomplete-chips-exclude-value.interface';
import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';


/**
 * Passed straight through to fs-autocomplete-chips' own `shape` input, so the names are
 * its names. Note that a single-select without a chip background renders as plain text
 * regardless of this — that is the autocomplete-chips component's own rule.
 */
export type FilterAutocompleteChipsShape = 'roundChip' | 'squareChip' | 'none';

/**
 * Formats one line of an option, in the panel and on the selected chip alike. Receives
 * the value object the `values` fn produced, so `values` can hand back whole records and
 * leave the wording to the template.
 */
export type FilterAutocompleteChipsTemplateFn = (data: any) => string;

/** What the item holds: its picks (an include), or its picks with the exclude mode. */
export type FilterAutocompleteChipsValue =
  FilterNameValue[] | FilterNameValue | FilterAutocompleteChipsExcludeValue;

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
  // Defaults to the value object's own `name`, which is what this item type has always
  // rendered.
  template?: FilterAutocompleteChipsTemplateFn;
  subTemplate?: FilterAutocompleteChipsTemplateFn;
  default?: IFilterDefaultFn<FilterAutocompleteChipsValue> | FilterAutocompleteChipsValue;
  values?: (keyword?: string, filter?: FilterComponent) => Observable<any[]>;
  panelActions?: {
    label: string;
    click: (filter: FilterComponent) => void;
  }[];
  // Shows a checkbox row at the foot of the list (label defaults to 'Exclude these').
  // While it is on, the query writes the picks under exclude<Name> instead of <name>, the
  // chip reads 'Exclude <Label>: A, B', and the item's value is a
  // FilterAutocompleteChipsExcludeValue. Turning it off keeps the picks.
  exclude?: { label?: string };
  // One muted line at the foot of the list, such as 'Showing the first 500. Type to
  // narrow.' Read when the list opens, on each keystroke and after each fetch; null hides
  // the line.
  panelNote?: () => string | null;
}
