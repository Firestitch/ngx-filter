import { ItemDateMode } from '../../enums/item-date-mode.enum';

import { FilterConfigDateType, IFilterConfigBaseItem } from './base.interface';

export interface IFilterConfigDateItem extends IFilterConfigBaseItem<FilterConfigDateType> {
  maxYear?: number;
  mode?: ItemDateMode;
  default?: Date | string;
}
