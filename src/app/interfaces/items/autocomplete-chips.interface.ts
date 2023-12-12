import { Observable } from 'rxjs';

import type { FilterComponent } from '../../components/filter';
import { ItemType } from '../../enums/item-type.enum';

import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';


export interface IFilterConfigAutocompleteChipsItem extends IFilterConfigBaseItem<ItemType.AutoCompleteChips> {
  fetchOnFocus?: boolean;
  chipImage?: string;
  chipColor?: string;
  chipIconColor?: string;
  chipBackground?: string;
  chipIcon?: string;
  chipClass?: string;
  default?: IFilterDefaultFn<FilterNameValue[]> | FilterNameValue[];
  values?: (keyword?: string, filter?: FilterComponent) => Observable<any[]>;
}
