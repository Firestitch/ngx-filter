// Modules
export { FsFilterModule } from './app/fs-filter.module';

// Components
export { FilterComponent } from './app/components/filter/filter.component';
export { FilterItemComponent } from './app/components/filters-item/filter-item.component';

// Interfaces
export {
  IFilterConfigBaseItem,
  IFilterConfigDateItem,
  IFilterConfigAutocompleteItem,
  IFilterItemDefaultRange,
  IFilterConfigDateRangeItem,
  IFilterConfigRangeItem,
  IFilterItemDefaultDateRange
} from './app/interfaces/item-config.interface';

export {
  FilterConfig,
  SortItem,
  ChangeFn,
  FilterSort,
  Sort,
  IFilterConfigItem,
} from './app/interfaces/config.interface';

// Enums/Models
export { ItemType } from './app/enums/item-type.enum';
export { ItemDateMode } from './app/enums/item-date-mode.enum';
