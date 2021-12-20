import { Observable } from 'rxjs';

import { ItemType } from '../../enums/item-type.enum';
import { BaseItem } from '../../models/items/base-item';

export type FilterConfigDateType = ItemType.Date | ItemType.DateTime | ItemType.DateRange | ItemType.DateTimeRange;
export type FilterDateRangeType = ItemType.DateRange | ItemType.DateTimeRange;
export type IFilterDefaultFn = () => Observable<unknown>;


export interface IFilterConfigBaseItem<T = ItemType, U = string> {
  name: string;
  type: T;
  label: string | string[];
  chipLabel?: string | string[];
  hide?: boolean;
  disable?: boolean;
  values?: any;
  primary?: boolean;
  default?: IFilterDefaultFn | any;
  change?: (item: BaseItem<any>) => void;
  clear?: boolean;
  disablePersist?: boolean;
  disableQueryParams?: boolean;
}
