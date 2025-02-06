import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigCheckboxItem extends IFilterConfigBaseItem<ItemType.Checkbox> {
  default?: boolean;
  checked?: unknown;
  unchecked?: unknown;
}
