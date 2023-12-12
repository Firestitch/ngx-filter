import { Observable } from 'rxjs';

import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigSelectItem extends IFilterConfigBaseItem<ItemType.Select> {
  isolate?: IFilterConfigSelectIsolate;
  multiple?: boolean;
  children?: string;
  values?: FilterValuesReturnFn;
  default?: string[] | string;
}

export interface IFilterConfigSelectIsolate {
  label: string;
  value: number | string | boolean | number[] | string[] | boolean[];
}

export interface IFilterSelectValue {
  name: string;
  value?: number | string | boolean;
  types?: any;
}

export type FilterValuesReturnFn = IFilterSelectValue[]
  | (() => IFilterSelectValue[])
  | (() => Observable<IFilterSelectValue[]>);
