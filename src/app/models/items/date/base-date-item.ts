import { isDate, isValid, parseISO } from 'date-fns';
import { clone } from 'lodash-es';

import { BaseItem } from '../base-item';
import { IFilterConfigDateItem } from '../../../interfaces/items/date.interface';
import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { simpleFormat } from '@firestitch/date';


export abstract class BaseDateItem extends BaseItem<IFilterConfigDateItem> {

  public maxYear: number;
  public mode: ItemDateMode

  public get value() {
    const value = clone(this.model);

    if (!value || !isValid(value) || !isDate(value)) {
      return null;
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

  public get persistanceObject(): Record<string, string> {
    const value = this.queryObject[this.name];

    return {
      [this.name]: value ? simpleFormat(value) : null,
    }
  }

  protected _validateModel() {
  }

  protected _setModel(value) {
    if (value) {
      if (!isDate(value) || !isValid(value)) {
        value = parseISO(value);
      }
    }

    super._setModel(value);
  }

  protected _parseConfig(item: IFilterConfigDateItem) {
    this.maxYear = item.maxYear;
    this.mode = item.mode || ItemDateMode.Calendar;

    super._parseConfig(item);
  }

  protected _init() {
    if (!this.label) {
      this.label = ['Min', 'Max'];
    }
  }

}
