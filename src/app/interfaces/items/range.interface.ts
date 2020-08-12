import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from './base.interface';
import { IFilterItemWithPrefixSuffix } from './text.interface';


export interface IFilterConfigRangeItem
  extends IFilterConfigBaseItem<ItemType.Range, string[]>, IFilterItemWithPrefixSuffix {
  default?: IFilterItemDefaultRange;
  options?: { scale?: number }
}

export interface IFilterItemDefaultRange {
  min?: any;
  max?: any;
}
