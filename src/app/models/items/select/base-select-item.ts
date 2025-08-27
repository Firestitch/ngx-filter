
import {
  IFilterConfigSelectIsolate,
  IFilterConfigSelectItem,
} from '../../../interfaces/items/select.interface';
import { BaseItem } from '../base-item';

export interface IFilterIsolate extends IFilterConfigSelectIsolate {
  enabled: boolean;
}

export abstract class BaseSelectItem extends BaseItem<IFilterConfigSelectItem> {


}
