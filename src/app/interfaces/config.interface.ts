import {
  IFilterConfigBaseItem,
  IFilterConfigDateItem,
  IFilterConfigAutocompleteItem,
  IFilterConfigRangeItem,
  IFilterConfigDateRangeItem,
  IFilterConfigTextItem,
} from './item-config.interface';
import { IFilterConfigSelectItem } from './items/select.interface';
import { IFilterConfigChipsItem } from './items/chips.interface';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  queryParam?: boolean;
  namespace?: string;
  persist?: FsFilterPersistance;
  reload?: ChangeFn | boolean;
  clear?: ChangeFn | boolean;
  items?: IFilterConfigItem[];
  init?: ChangeFn;
  change?: ChangeFn;
  sorts?: SortItem[];
  sort?: Sort;
  sortChange?: ChangeFn;
  reloadWhenConfigChanged?: boolean;
  case?: 'snake' | 'camel';
  button?: FilterButton
}

export type IFilterConfigItem =
  (
    IFilterConfigBaseItem
    | IFilterConfigSelectItem
    | IFilterConfigChipsItem
    | IFilterConfigTextItem
    | IFilterConfigDateItem
    | IFilterConfigAutocompleteItem
    | IFilterConfigRangeItem
    | IFilterConfigDateRangeItem
  );

export interface SortItem {
  name: string;
  value: string;
}

export interface Sort {
  direction?: string;
  value?: string;
}

export interface FilterButton {
  style?: 'raised' | 'basic' | 'icon';
  color?: 'primary' | 'default',
  icon?: string,
  label?: string
}

export interface ChangeFn {
  (query?: any, sort?: FilterSort | null): void;
}

export interface FilterSort {
  value: string;
  direction: string;
}

export interface FsFilterPersistanceConfig {
  name?: string;
  timeout?: number;
}

export type FsFilterPersistance = boolean | FsFilterPersistanceConfig;
