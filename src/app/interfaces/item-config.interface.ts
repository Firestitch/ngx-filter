import { ItemType } from '../enums/item-type.enum';
import { ItemDateMode } from '../enums/item-date-mode.enum';

type FilterConfigDateType = ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange;
type FilterDateRangeType = ItemType.DateRange | ItemType.DateTimeRange;
type FilterAutoCompleteType = ItemType.AutoComplete | ItemType.AutoCompleteChips;

export interface IFilterConfigBaseItem<T = ItemType, U = string> {
  name: string;
  type: T;
  label: U;
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
  change?(item: IFilterConfigBaseItem): any
}

export interface IFilterConfigDateItem extends IFilterConfigBaseItem<FilterConfigDateType> {
    maxYear?: number,
    mode?: ItemDateMode
}

export interface IFilterConfigAutocompleteItem extends IFilterConfigBaseItem<FilterAutoCompleteType> {
  fetchOnFocus?: boolean
}

export interface IFilterConfigRangeItem
  extends IFilterConfigBaseItem<ItemType.Range, string[]>, IFilterItemWithPrefixSuffix {
  default?: IFilterItemDefaultRange;
  options?: { scale?: number }
}

export interface IFilterConfigDateRangeItem extends IFilterConfigBaseItem<FilterDateRangeType, string[]> {
  default?: IFilterItemDefaultDateRange;
}

export interface IFilterConfigTextItem
  extends IFilterConfigBaseItem<ItemType.Text>, IFilterItemWithPrefixSuffix {
}

export interface IFilterItemDefaultRange {
  min?: any;
  max?: any;
}

export interface IFilterItemDefaultDateRange {
  from?: any;
  to?: any;
}

export interface IFilterItemWithPrefixSuffix {
  prefix?: string;
  suffix?: string;
}
