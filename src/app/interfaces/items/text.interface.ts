import { ItemType } from '../../enums/item-type.enum';

import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigTextItem
  extends IFilterConfigBaseItem<ItemType.Text>, IFilterItemWithPrefixSuffix {
}


export interface IFilterItemWithPrefixSuffix {
  prefix?: string;
  suffix?: string;
}