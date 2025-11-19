import { Observable } from 'rxjs';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';
import { BaseItem } from '../../models/items/base-item';

export type FilterConfigDateType = ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange;
export type FilterDateRangeType = ItemType.DateRange | ItemType.DateTimeRange;
export type IFilterDefaultFn<T extends unknown = unknown> = () => Observable<T>;
export interface FilterNameValue { name: string; value: unknown }

type DefaultItemType = ItemType.Date | ItemType.DateTime | ItemType.Week | ItemType.Keyword;

export interface IFilterConfigBaseItem<T = DefaultItemType, U = string> {
  name: string;
  type: T;
  label: string | string[];
  chipLabel?: string | string[];
  hide?: boolean;
  show?: boolean;
  values?: any;
  primary?: boolean;
  secondary?: boolean;
  default?: unknown;
  change?: (item: BaseItem<any>, filter: FilterComponent) => void;
  init?: (item: BaseItem<any>, filter?: FilterComponent) => void;
  clear?: boolean;
  disablePersist?: boolean;
  disableQueryParams?: boolean;
}
