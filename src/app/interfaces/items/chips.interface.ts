import { IFilterConfigBaseItem, ItemType } from '@firestitch/filter';


export interface IFilterConfigChipsItem extends IFilterConfigBaseItem<ItemType.Chips> {
  multiple?: boolean;
}
