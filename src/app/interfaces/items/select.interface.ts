import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from '../item-config.interface';


export interface IFilterConfigSelectItem extends IFilterConfigBaseItem<ItemType.Select> {
  isolate?: IFilterConfigSelectIsolate;
  multiple?: boolean;
  children?: string;
}

export interface IFilterConfigSelectIsolate {
  label: string,
  value: number | string | boolean;
}
