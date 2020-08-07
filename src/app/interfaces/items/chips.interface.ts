import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from '../item-config.interface';


export interface IFilterConfigChipsItem extends IFilterConfigBaseItem<ItemType.Chips> {
  multiple?: boolean;
}
