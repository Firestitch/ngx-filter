import { IFilterConfigItem } from './item-config.interface';
import { FsFilterConfig } from '../models/filter-config';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  namespace?: string;
  persist?: any;
  reload?: ChangeFn;
  items: IFilterConfigItem[];
  init?: ChangeFn;
  change?: ChangeFn;
  sorting?: SortingItem[];
  sort?: SortDefaults;
}

export interface SortingItem {
  name: string;
  value: string;
}

export interface SortDefaults {
  direction?: string;
  value?: string;
}

export interface ChangeFn {
  (query?: any, sort?: FilterSort | null): void;
}

export interface FilterSort {
  sortBy: string;
  direction: string;
}
