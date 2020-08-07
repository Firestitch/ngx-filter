import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from '../item-config.interface';


export interface IFilterConfigCheckboxItem extends IFilterConfigBaseItem<ItemType.Checkbox> {
  checked?: unknown;
  unchecked?: unknown;
}
