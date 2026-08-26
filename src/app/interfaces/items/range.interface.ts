import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';
import { IFilterItemWithPrefixSuffix } from './text.interface';


export interface IFilterConfigRangeItem
  extends IFilterConfigBaseItem<ItemType.Range, string[]>, IFilterItemWithPrefixSuffix {
  default?: IFilterItemDefaultRange;
  label: IFilterItemRangeObjectLabel;
  options?: { scale?: number }
}

export type IFilterItemRangeObjectLabel = {
  min: string;
  max: string;
} | [ string, string ] | string;

export interface IFilterItemDefaultRange {
  min?: any;
  max?: any;
}
