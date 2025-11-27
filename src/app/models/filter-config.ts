import type { FilterComponent } from '../components/filter/filter.component';
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

export const SortByField = 'sortName';
export const SortDirectionField = 'sortDirection';


export class FsFilterConfig {

  public load = true;
  public persist: FsFilterPersistance = false;
  public savedFilters: IFilterSavedFiltersConfig;
  public inline = false;
  public autofocus = false;
  public chips = false;
  public buttonStyle: ButtonStyle;
  public sortValues: any[] = null;
  public sort: Sort = null;
  public queryParam = false;
  public init: (query?: any, sort?: FilterSort | null, filter?: FilterComponent) => void;
  public change: ChangeFn;
  public reload: boolean = true;
  public autoReload: FsFilterAutoReload;
  public clear: ChangeFn;
  public sortChange: ChangeFn;
  public button: FilterButton;
  public items: IFilterConfigItem[];
  public actions: FsFilterAction[];
  public namespace: string; // for persistance
  public heading: string;
  public subheading: string;
  public maxEnabled: number;
  public minSecondaryItems: number;

  constructor(data: FilterConfig = {}) {
    this._init(data);
  }

  private _init(data: FilterConfig = {}) {
    Object.assign(this, {
      load: data.load ?? true,
      persist: data.persist,
      savedFilters: data.savedFilters,
      autofocus: data.autofocus ?? false,
      chips: data.chips ?? false,
      maxEnabled: data.maxEnabled ?? 0,
      sort: data.sort,
      queryParam: data.queryParam ?? false,
      init: data.init,
      change: data.change,
      reload: data.reload,
      autoReload: data.autoReload ? {
        ...data.autoReload,
        enabled: data.autoReload ? data.autoReload.enabled ?? true : false,
      } : null,
      clear: data.clear,
      minSecondaryItems: data.minSecondaryItems ?? 2,
      sortChange: data.sortChange,
      case: data.case ?? 'camel',
      reloadWhenConfigChanged: data.reloadWhenConfigChanged,
      items: data.items,
      actions: data.actions,
      buttonStyle: data.buttonStyle || ButtonStyle.Flat,
      heading: data.heading,
      subheading: data.subheading,
    });

    if (this.persist) {
      if (typeof this.persist === 'object') {
        if (this.persist.name) {
          this.namespace = this.persist.name;
        }
      }
    }

    if (this.clear === undefined) {
      this.clear = () => { 
        //
      };
    }

    this._initButton(data);
  }

  private _initButton(data: FilterConfig): void {
    this.button = data.button;
    if (!this.button) {
      this.button = {};
    }

    if (this.button.label === undefined) {
      this.button.label = 'Filters';
    }

    if (this.button.icon === undefined) {
      this.button.icon = 'filterOutline';
    }

    if (this.button.style === undefined) {
      this.button.style = ButtonStyle.Raised;
    }

    if (this.button.color === undefined) {
      this.button.color = 'default';
    }
  }
}
