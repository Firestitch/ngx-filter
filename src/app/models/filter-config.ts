import { Alias, Model } from 'tsmodels';

import {
  FilterButton,
  FilterConfig,
  FsFilterPersistance,
  IFilterConfigItem
} from './../interfaces/config.interface';
import { ChangeFn, Sort } from '../interfaces/config.interface';
import { IFilterSavedFiltersConfig } from '../interfaces/saved-filters.interface';
import { IFsFilterAction } from '../interfaces/action.interface';

export const SORT_BY_FIELD = 'system_sort_by';
export const SORT_DIRECTION_FIELD = 'system_sort_direction';


export class FsFilterConfig extends Model {

  @Alias() public load = true;
  @Alias() public persist: FsFilterPersistance = false;
  @Alias() public savedFilters: IFilterSavedFiltersConfig;
  @Alias() public inline = false;
  @Alias() public autofocus = false;
  @Alias() public chips = false;
  @Alias('sorts') public sortValues: any[] = null;
  @Alias() public sort: Sort = null;
  @Alias() public sortDirection = null;
  @Alias() public queryParam = false;
  @Alias() public init: ChangeFn;
  @Alias() public change: ChangeFn;
  @Alias() public reload: ChangeFn;
  @Alias() public clear: ChangeFn;
  @Alias() public sortChange: ChangeFn;
  @Alias() public case: 'snake' | 'camel' = 'snake';
  @Alias() public reloadWhenConfigChanged: boolean;
  @Alias() public button: FilterButton;
  @Alias() public items: IFilterConfigItem[];
  @Alias() public actions: IFsFilterAction[];

  public namespace: string; // for persistance

  constructor(data: FilterConfig = {}) {
    super();
    this._fromJSON(data);
    this._init();
  }

  private _init() {
    if (!this.button) {
      this.button = {};
    }

    if (this.button.label === undefined) {
      this.button.label = 'Filters';
    }

    if (this.button.icon === undefined) {
      this.button.icon = 'tune';
    }

    if (this.button.style === undefined) {
      this.button.style = 'raised';
    }

    if (this.button.color === undefined) {
      this.button.color = 'default';
    }

    if (this.clear === undefined) {
      this.clear = () => {}
    }
  }

  public _fromJSON(value: any) {
    super._fromJSON(value);

    this.case = value.case ?? 'snake';

    if (this.persist) {
      if (typeof this.persist === 'object') {
        if (this.persist.name) {
          this.namespace = this.persist.name;
        }
      }
    }
  }
}
