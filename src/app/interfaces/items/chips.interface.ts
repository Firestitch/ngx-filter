import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigChipsItem extends IFilterConfigBaseItem<ItemType.Chips> {
  multiple?: boolean;
}
