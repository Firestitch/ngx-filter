
import type { FilterComponent } from '../../components/filter/filter.component';
import {
  IFilterConfigTextItem,
} from '../../interfaces/items/text.interface';

import { BaseItem } from './base-item';


export class TextItem extends BaseItem<IFilterConfigTextItem> {

  public declare prefix: string;
  public declare suffix: string;

  constructor(
    itemConfig: IFilterConfigTextItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.prefix = itemConfig.prefix;
    this.suffix = itemConfig.suffix;
  }

  public static create(config: IFilterConfigTextItem, filter: FilterComponent) {
    return new TextItem(config, null, filter);
  }

  public get value() {
    return this.model ? this.model : undefined;
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

  protected _init() {
    //
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? '';
  }
}
