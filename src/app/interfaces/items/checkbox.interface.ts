import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';


export interface IFilterConfigCheckboxItem extends IFilterConfigBaseItem<ItemType.Checkbox> {
  default?: boolean;
  checked?: unknown;
  unchecked?: unknown;
}
