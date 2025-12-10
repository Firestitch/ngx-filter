import { FilterDateRangeType, IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigDateRangeItem extends IFilterConfigBaseItem<FilterDateRangeType, string[]> {
  default?: IFilterItemDateRangeDefault;
  label: IFilterItemDateRangeObjectLabel;
}

export interface IFilterItemDateRangeDefault {
  from?: any;
  to?: any;
}


export type IFilterItemDateRangeObjectLabel = {
  from: string;
  to: string;
} | [ string, string ] | string;
