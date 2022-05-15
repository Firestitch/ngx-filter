import { IDatePickerPeriod } from '@firestitch/datepicker';

import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigBaseItem } from './base.interface';


export interface IFilterConfigWeekItem extends IFilterConfigBaseItem<ItemType.Week> {
  default?: IDatePickerPeriod | any;
  seedDate?: Date;
}
