import { ButtonStyle } from '../enums';
import { FsFilterAction } from '../interfaces/action.interface';
import { ChangeFn, FilterSort, FsFilterAutoReload, Sort } from '../interfaces/config.interface';
import { IFilterSavedFiltersConfig } from '../interfaces/saved-filters.interface';

import {
  FilterButton,
  FilterConfig,
  FsFilterPersistance,
  IFilterConfigItem,
} from './../interfaces/config.interface';

export const SORT_BY_FIELD = 'sortName';
export const SORT_DIRECTION_FIELD = 'sortDirection';


export class FsFilterConfig {

  public load = true;
  public persist: FsFilterPersistance = false;
  public savedFilters: IFilterSavedFiltersConfig;
  public inline = false;
  public autofocus = false;
  public chips = false;
  public sortValues: any[] = null;
  public sort: Sort = null;
  // public sortDirection = null;
  public queryParam = false;
  public init: (query?: any, sort?: FilterSort | null, filter?) => void;
  public change: ChangeFn;
  public reload: ChangeFn;
  public autoReload: FsFilterAutoReload;
  public clear: ChangeFn;
  public sortChange: ChangeFn;
  public case: 'snake' | 'camel' = 'camel';
  public reloadWhenConfigChanged: boolean;
  public button: FilterButton;
  public items: IFilterConfigItem[];
  public actions: FsFilterAction[];

  public namespace: string; // for persistance

  constructor(data: FilterConfig = {}) {
    this._init(data);
  }

  private _init(data: FilterConfig = {}) {
    this.load = data.load ?? true;
    this.persist = data.persist;
    this.savedFilters = data.savedFilters;
    this.inline = data.inline ?? false;
    this.autofocus = data.autofocus ?? false;
    this.chips = data.chips ?? false;
    this.sortValues = data.sorts;
    this.sort = data.sort;
    this.queryParam = data.queryParam ?? false;
    this.init = data.init;
    this.change = data.change;
    this.reload = data.reload;
    this.autoReload = data.autoReload;
    this.clear = data.clear;
    this.sortChange = data.sortChange;
    this.case = data.case ?? 'camel';
    this.reloadWhenConfigChanged = data.reloadWhenConfigChanged;
    this.button = data.button;
    this.items = data.items;
    this.actions = data.actions;
    this.case = data.case ?? 'camel';

    if (this.persist) {
      if (typeof this.persist === 'object') {
        if (this.persist.name) {
          this.namespace = this.persist.name;
        }
      }
    }

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
      this.button.style = ButtonStyle.Raised;
    }

    if (this.button.color === undefined) {
      this.button.color = 'default';
    }

    if (this.clear === undefined) {
      this.clear = () => { };
    }
  }
}
