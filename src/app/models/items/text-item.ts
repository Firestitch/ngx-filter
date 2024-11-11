
import type { FilterComponent } from '../../components/filter/filter.component';
import {
  IFilterConfigTextItem,
} from '../../interfaces/items/text.interface';

import { BaseItem } from './base-item';


export class TextItem extends BaseItem<IFilterConfigTextItem> {

  public declare prefix: string;
  public declare suffix: string;

  public static create(config: IFilterConfigTextItem, filter: FilterComponent) {
    return new TextItem(config, null, filter);
  }

  public get value() {
    return !!this.model ? this.model : undefined;
  }

  public get queryObject() {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = value;

    return params;
  }

  public getChipsContent() {
    return this.model;
  }

  protected _validateModel() {
    //
  }

  protected _parseConfig(item: IFilterConfigTextItem) {
    this.prefix = item.prefix;
    this.suffix = item.suffix;

    super._parseConfig(item);
  }

  protected _init() {
    //
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? '';
  }
}
