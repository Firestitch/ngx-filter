import { ItemType } from '../../enums/item-type.enum';
import { BaseItem } from '../../models/items/base-item';

export type FilterConfigDateType = ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange;
export type FilterDateRangeType = ItemType.DateRange | ItemType.DateTimeRange;
export type FilterAutoCompleteType = ItemType.AutoComplete | ItemType.AutoCompleteChips;

export interface IFilterConfigBaseItem<T = ItemType, U = string> {
  name: string;
  type: T;
  label: string | string[];
  chipLabel?: string | string[];
  hide?: boolean;
  values?: any;
  primary?: boolean;
  default?: unknown;
  change?: (item: BaseItem<any>) => void
}
