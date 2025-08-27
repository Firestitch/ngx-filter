
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
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.maxYear = itemConfig.maxYear;
    this.mode = itemConfig.mode || ItemDateMode.Calendar;
  }

  public set value(value) {
    if (value) {
      if (!isDate(value) || !isValid(value)) {
        value = parseISO(value);
      }
    }

    super.value = value;
  }

  public get value() {
    return super.value;
  }

}
