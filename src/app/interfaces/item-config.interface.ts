import { ItemType } from '../enums/item-type.enum';
import { ItemDateMode } from '../enums/item-date-mode.enum';

export interface IFilterConfigItem {
  name: string;
  type: ItemType;
  label: string | string[];
  chipLabel?: string | string[];
  children?: string;
  multiple?: boolean;
  groups?: any;
  wait?: boolean;
  query?: string;
  values?: any;
  values$?: any;
  selectedValue?: any;
  model?: any;
  isolate?: any;
  names?: any;
  primary?: boolean;
  search?: any;
  unchecked?: any;
  checked?: any;
  alias?: any;
  placeholder?: any;
  default?: any;
  prefix?: any;
  change?(item: IFilterConfigItem): any
}

export interface IFilterConfigDateItem extends IFilterConfigItem {
  type: ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange,
  maxYear?: number,
  mode?: ItemDateMode
}

export interface IFilterConfigAutocompleteItem extends IFilterConfigItem {
  type: ItemType.AutoComplete | ItemType.AutoCompleteChips
  fetchOnFocus?: boolean
}
