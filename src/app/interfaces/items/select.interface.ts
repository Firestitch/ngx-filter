import { Observable } from 'rxjs';

import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigSelectItem extends IFilterConfigBaseItem<ItemType.Select> {
  isolate?: IFilterConfigSelectIsolate;
  multiple?: boolean;
  children?: string;
  values?: FilterValuesReturnFn;
  default?: string[] | string;
  // Width of the open option list, handed to mat-select's panelWidth. 'auto' (the
  // default) matches the filter field, so long options wrap; null lets the list grow
  // to its longest option; a number or CSS length sets it outright.
  panelWidth?: string | number | null;
}

export interface IFilterConfigSelectIsolate {
  label: string;
  value: number | string | boolean | number[] | string[] | boolean[];
}

export interface IFilterSelectValue {
  name: string;
  value?: number | string | boolean | IFilterSelectValue[];
}

export type FilterValuesReturnFn = IFilterSelectValue[]
  | (() => IFilterSelectValue[])
  | (() => Observable<IFilterSelectValue[]>);
