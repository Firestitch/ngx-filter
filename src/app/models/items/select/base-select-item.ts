import type { FilterComponent } from '../../../components/filter/filter.component';
import {
  IFilterConfigSelectIsolate,
  IFilterConfigSelectItem,
} from '../../../interfaces/items/select.interface';
import { BaseItem } from '../base-item';

export interface IFilterIsolate extends IFilterConfigSelectIsolate {
  enabled: boolean;
}

export abstract class BaseSelectItem extends BaseItem<IFilterConfigSelectItem> {

  public declare children: string;
  public declare multiple: boolean;
  public declare isolate: IFilterIsolate;

  constructor(
    itemConfig: IFilterConfigSelectItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.multiple = itemConfig.multiple;
    this.children = itemConfig.children;

    if (itemConfig.isolate) {
      this.isolate = {
        ...itemConfig.isolate,
        enabled: false,
      };
    }
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
        }

        return item.value !== this.isolate.value;

      });
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    if (this.isolate) {
      this.isolate.enabled = false;
    }
  }

}
