import { ItemType } from '@firestitch/filter';

import { BaseItem } from './base-item';
import {
  IFilterConfigTextItem
} from '../../interfaces/item-config.interface';


export class TextItem extends BaseItem<IFilterConfigTextItem> {

  public static create(config: IFilterConfigTextItem) {
    return new TextItem(config, null);
  }

  public readonly type: ItemType.Text | ItemType.Keyword;

  public prefix: string;
  public suffix: string;

  public get isTypeCheckbox(): boolean {
    return true;
  }

  public get value() {
    return this.model;
  }

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    params[name] = value;

    return params;
  }

  public clear() {
    super.clear();

    this.model = '';
  }

  public checkIfValueChanged() {
    this.valueChanged = this.model && this.model !== '';
  }

  protected _validateModel() {
  }

  protected _parseConfig(item: IFilterConfigTextItem) {
    this.prefix = item.prefix;
    this.suffix = item.suffix;

    super._parseConfig(item);
  }

  protected _init() {
  }

}
