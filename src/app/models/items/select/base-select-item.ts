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
      this.values = this.values.filter((item) => {
        if (Array.isArray(this.isolate.value)) {
          return (this.isolate.value as unknown[]).indexOf(item.value) === -1;
        } else {
          return item.value !== this.isolate.value;
        }
      });
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    if (this.isolate) {
      this.isolate.enabled = false;
    }
  }

}
