import { IFilterConfigItem, IFilterConfigDateItem } from './item-config.interface';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  queryParam?: boolean;
  namespace?: string;
  persist?: any;
  reload?: ChangeFn;
  items: (IFilterConfigItem | IFilterConfigDateItem)[];
  init?: ChangeFn;
  change?: ChangeFn;
  sorts?: SortItem[];
  sort?: Sort;
  sortChange?: ChangeFn;
  reloadWhenConfigChanged?: boolean;
}

export interface SortItem {
  name: string;
  value: string;
}

export interface Sort {
  direction?: string;
  value?: string;
}

export interface ChangeFn {
  (query?: any, sort?: FilterSort | null): void;
}

export interface FilterSort {
  value: string;
  direction: string;
}
