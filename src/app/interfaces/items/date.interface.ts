import { FilterConfigDateType, IFilterConfigBaseItem } from './base.interface';
import { ItemDateMode } from '../../enums/item-date-mode.enum';

export interface IFilterConfigDateItem extends IFilterConfigBaseItem<FilterConfigDateType> {
  maxYear?: number;
  mode?: ItemDateMode;
  clear?: boolean;
}
