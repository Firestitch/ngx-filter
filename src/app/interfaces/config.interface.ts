import { IFilterConfigItem } from './item-config.interface';
import { FsFilterConfig } from '../models/filter-config';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  namespace?: string;
  persist?: any;
  reload?: (query: any, config: any) => void | false;
  items: IFilterConfigItem[];
  init?: (any) => void;
  change?: (...any) => void;
  sorting?: SortingItem[];
  sortChange?: SortChangeFn;
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

export interface SortChangeFn {
  (value?: string, direction?: string, config?: FsFilterConfig): void;
}
