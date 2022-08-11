import { ItemType } from '../../enums/item-type.enum';
import { FilterNameValue, IFilterConfigBaseItem, IFilterDefaultFn } from './base.interface';


export interface IFilterConfigChipsItem extends IFilterConfigBaseItem<ItemType.Chips> {
  multiple?: boolean;
  default?: IFilterDefaultFn<FilterNameValue[]> | FilterNameValue[];
}
