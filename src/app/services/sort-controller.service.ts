import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { ISortingChangeEvent } from '../interfaces';
import {
  FilterSort,
} from '../interfaces/config.interface';
import { KeyValue } from '../interfaces/external-params.interface';

import type { FilterController } from './filter-controller.service';


@Injectable()
export class SortController { 

  private _name = null;
  private _direction = null;
  private _change$ = new Subject<{ name: string, direction: string }>();
  private _filterController: FilterController;
  private _route = inject(ActivatedRoute);

  public init(filterController: FilterController) {
    this._filterController = filterController;

    if(this._filterController.config.queryParam) {   
      this._name = this._route.snapshot.queryParams.sortName;   
      this._direction = this._route.snapshot.queryParams.sortDirection;
    }
  }

  public clear() {
    this._name = null;
    this._direction = null;
  }

  public get queryParam(): KeyValue {
    if(!this.name) {
      return {};
    }

    return {
      sortName: this.name,
      sortDirection: this.direction,
    };
  }

  public query(): KeyValue {
    if(!this.name) {
      return {};
    }

    return {
      order: `${this.name},${this.direction}`,
    };
  }

  public getSort(): FilterSort {
    return {
      value: this.name,
      direction: this.direction,
    };
  }

  public get direction() {
    return this._direction || 'asc';
  }

  public get name() {
    return this._name;
  }

  public get change$(): Observable<{ name: string, direction: string }> {
    return this._change$.asObservable();
  }

  public updateSort(sort: ISortingChangeEvent, emitChange: boolean = true) {
    this._name = sort.sortBy;
    this._direction = sort.sortDirection;
    this._change$.next({ name: this._name, direction: this._direction });
    
    if(emitChange) {
      if(this._filterController.config.sortChange) {
        this._filterController.config.sortChange(this._filterController.query, this.getSort());
      }
      
      this._filterController.change();
    }
  }

}
