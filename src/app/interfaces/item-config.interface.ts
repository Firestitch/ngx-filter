import { ItemType } from '../enums/item-type.enum';
import { ItemDateMode } from '../enums/item-date-mode.enum';

export interface IFilterConfigBaseItem {
  name: string;
  type: ItemType;
  label: string;
  chipLabel?: string | string[];
  children?: string;
  multiple?: boolean;
  groups?: any;
  hide?: boolean;
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
  change?(item: IFilterConfigBaseItem): any
}

export interface IFilterConfigDateItem extends IFilterConfigBaseItem {
  type: ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange,
  maxYear?: number,
  mode?: ItemDateMode
}

export interface IFilterConfigAutocompleteItem extends IFilterConfigBaseItem {
  type: ItemType.AutoComplete | ItemType.AutoCompleteChips
  fetchOnFocus?: boolean
}


export interface IFilterConfigRangeItem {
  type: ItemType.Range;
  label?: string[];
  default?: IFilterItemDefaultRange;
}

export interface IFilterConfigDateRangeItem {
  type: ItemType.DateRange | ItemType.DateTimeRange;
  label?: string[];
  default?: IFilterItemDefaultDateRange;
}

export interface IFilterItemDefaultRange {
  min?: any;
  max?: any;
}

export interface IFilterItemDefaultDateRange {
  from?: any;
  to?: any;
}
