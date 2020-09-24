import { FilterDateRangeType, IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigDateRangeItem extends IFilterConfigBaseItem<FilterDateRangeType, string[]> {
  default?: IFilterItemDefaultDateRange;
  clear?: boolean;
}

export interface IFilterItemDefaultDateRange {
  from?: any;
  to?: any;
  clear?: boolean;
}
