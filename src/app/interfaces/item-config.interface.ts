import { ItemType } from '../models/filter-item';

export interface IFilterConfigItem {
  name: string;
  type: ItemType;
  label: string | string[];
  chipLabel?: string;
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
