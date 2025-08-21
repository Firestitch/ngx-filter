import { simpleFormat } from '@firestitch/date';

import { isDate, isValid, parseISO } from 'date-fns';
import { clone } from 'lodash-es';

import { FilterComponent } from '../../../components/filter/filter.component';
import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { IFilterConfigDateItem } from '../../../interfaces/items/date.interface';
import { BaseItem } from '../base-item';


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

  public get value() {
    const value = clone(this.model);

    if (!value || !isValid(value) || !isDate(value)) {
      return undefined;
    }

    return value;
  }

  public get queryObject(): Record<string, Date> {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = value;

    return params;
  }

  public setModel(value) {
    if (value) {
      if (!isDate(value) || !isValid(value)) {
        value = parseISO(value);
      }
    }

    super.setModel(value);
  }

  public get persistanceObject(): Record<string, string> {
    const value = this.queryObject[this.name];

    return {
      [this.name]: value ? simpleFormat(value) : undefined,
    };
  }

  protected _validateModel() {
    //
  }

  protected _init() {
    if (!this.label) {
      this.label = ['Min', 'Max'];
    }
  }

}
