import { FilterDateRangeType, IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigDateRangeItem extends IFilterConfigBaseItem<FilterDateRangeType, string[]> {
  default?: IFilterItemDefaultDateRange;
}

export interface IFilterItemDefaultDateRange {
  from?: any;
  to?: any;
}
