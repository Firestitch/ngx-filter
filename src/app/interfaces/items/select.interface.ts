import { IFilterConfigBaseItem, ItemType } from '@firestitch/filter';


export interface IFilterConfigSelectItem extends IFilterConfigBaseItem<ItemType.Select> {
  isolate?: IFilterConfigSelectIsolate;
  multiple?: boolean;
  children?: string;
}

export interface IFilterConfigSelectIsolate {
  label: string,
  value: number | string | boolean;
}
