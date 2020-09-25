import { BaseItem } from '../base-item';
import {
  IFilterConfigSelectIsolate,
  IFilterConfigSelectItem
} from '../../../interfaces/items/select.interface';

export interface IFilterIsolate extends IFilterConfigSelectIsolate {
  enabled: boolean;
}

export abstract class BaseSelectItem extends BaseItem<IFilterConfigSelectItem> {

  public children: string;
  public multiple: boolean;
  public isolate: IFilterIsolate;

  protected _parseConfig(item: IFilterConfigSelectItem) {
    this.multiple = item.multiple;
    this.children = item.children;

    // TODO nullish
    if (item.isolate) {
      this.isolate = {
        ...item.isolate,
        enabled: false,
      };
    }

    super._parseConfig(item);
  }

  protected _init() {
    if (!Array.isArray(this.values)) {
      this.values = [];
    }

    // TODO Refactor
    if (this.isolate) {
      for (const index in this.values) {
        if (this.values.hasOwnProperty(index)) {
          if (!this.values[index]) {
            continue;
          }

          if (this.values[index].value == this.isolate.value) {
            this.values.splice(index, 1);
          }
        }
      }
    }
  }

  protected _clearValue() {
    if (this.isolate) {
      this.isolate.enabled = false;
    }
  }

}
