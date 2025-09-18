
import { isDate, isValid, parseISO } from 'date-fns';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemDateMode } from '../../enums/item-date-mode.enum';
import { IFilterConfigDateItem } from '../../interfaces/items/date.interface';

import { BaseItem } from './base-item';


export abstract class BaseDateItem extends BaseItem<IFilterConfigDateItem> {

  public maxYear: number;
  public mode: ItemDateMode;
  
  constructor(
    itemConfig: any,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.maxYear = itemConfig.maxYear;
    this.mode = itemConfig.mode || ItemDateMode.Calendar;
  }

  public setValue(value, emitChange = true) {
    if (value) {
      if (!isDate(value) || !isValid(value)) {
        value = parseISO(value);
      }
    }

    super.setValue(value, emitChange);
  }

}
