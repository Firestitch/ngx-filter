import { ButtonStyle } from '../enums';

import { FsFilterAction } from './action.interface';
import { IFilterConfigKeywordItem } from './items';
import { IFilterConfigAutocompleteChipsItem } from './items/autocomplete-chips.interface';
import { IFilterConfigAutocompleteItem } from './items/autocomplete.interface';
import { IFilterConfigBaseItem } from './items/base.interface';
import { IFilterConfigCheckboxItem } from './items/checkbox.interface';
import { IFilterConfigChipsItem } from './items/chips.interface';
import { IFilterConfigDateRangeItem } from './items/date-range.interface';
import { IFilterConfigDateItem } from './items/date.interface';
import { IFilterConfigRangeItem } from './items/range.interface';
import { IFilterConfigSelectItem } from './items/select.interface';
import { IFilterConfigTextItem } from './items/text.interface';
import { IFilterSavedFiltersConfig } from './saved-filters.interface';

export interface FilterConfig {
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  queryParam?: boolean;
  namespace?: string;
  persist?: FsFilterPersistance;
  reload?: boolean;
  clear?: ChangeFn;
  items?: IFilterConfigItem[];
  init?: ChangeFn;
  change?: ChangeFn;
  sort?: Sort;
  sortChange?: ChangeFn;
  reloadWhenConfigChanged?: boolean;
  case?: 'snake' | 'camel';
  button?: FilterButton;
  buttonStyle?: ButtonStyle;
  savedFilters?: IFilterSavedFiltersConfig;
  actions?: FsFilterAction[];
  autoReload?: FsFilterAutoReload;  
  heading?: string;
  subheading?: string;
}

export interface FsFilterAutoReload {
  enabled?: boolean;
  seconds?: number;
}

export type IFilterConfigItem =
  (
    IFilterConfigBaseItem
    | IFilterConfigCheckboxItem
    | IFilterConfigSelectItem
    | IFilterConfigChipsItem
    | IFilterConfigTextItem
    | IFilterConfigKeywordItem
    | IFilterConfigDateItem
    | IFilterConfigAutocompleteItem
    | IFilterConfigAutocompleteChipsItem
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
  style?: ButtonStyle;
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
