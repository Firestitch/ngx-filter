import { Observable } from 'rxjs';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';

import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';

export interface IFilterConfigAutocompleteItem extends IFilterConfigBaseItem<ItemType.AutoComplete> {
  fetchOnFocus?: boolean;
  default?: IFilterDefaultFn<FilterNameValue> | FilterNameValue;
  values?: (keyword?: string, filter?: FilterComponent) => Observable<any[]>;
}
