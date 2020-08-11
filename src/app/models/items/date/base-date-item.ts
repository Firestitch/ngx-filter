import { simpleFormat } from '@firestitch/date';
import { isDate, isValid, parse } from 'date-fns';
import { clone } from 'lodash-es';

import { BaseItem } from '../base-item';
import { IFilterConfigDateItem } from '../../../interfaces/item-config.interface';
import { ItemDateMode } from '../../../enums/item-date-mode.enum';


export abstract class BaseDateItem extends BaseItem<IFilterConfigDateItem> {

  public maxYear: number;
  public mode: ItemDateMode

  public get value() {
    let value = clone(this.model);

    if (value && isValid(value) && isDate(value)) {
      value = simpleFormat(value);
    } else {
      value = null;
    }

    return value;
  }

  public get valueAsQuery() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  protected _validateModel() {
  }

  protected _setModel(value) {
    if (value) {
      if (!isDate(value) || !isValid(value)) {
        value = parse(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
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
