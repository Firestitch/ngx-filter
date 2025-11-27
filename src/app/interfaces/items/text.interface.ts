import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigTextItem
  extends IFilterConfigBaseItem<ItemType.Text | ItemType.Keyword>, IFilterItemWithPrefixSuffix {
  default?: string | number;
  placeholder?: string;
}


export interface IFilterItemWithPrefixSuffix {
  prefix?: string;
  suffix?: string;
}
