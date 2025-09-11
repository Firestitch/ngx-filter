import { inject, Injectable, OnDestroy } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

import { KeyValue } from '../interfaces/external-params.interface';
import {
  IFilterSavedFilter,
} from '../interfaces/saved-filters.interface';

import type { FilterController } from './filter-controller.service';


@Injectable()
export class SavedFilterController implements OnDestroy {

  private _filterController: FilterController;
  private _savedFilters$ = new BehaviorSubject<IFilterSavedFilter[]>([]);
  private _activeFilter$ = new BehaviorSubject<IFilterSavedFilter>(null);
  private _enabled$ = new BehaviorSubject<boolean>(false);
  private _destroy$ = new Subject<void>();
  private _prompt = inject(FsPrompt);

  public get singularLabel(): string {
    return this._filterController.config.savedFilters?.label?.singular || 'Saved filter';
  }

  public get singularLabelLower(): string {
    return this.singularLabel.toLowerCase();
  }

  public get labelIcon(): string {
    return this._filterController.config.savedFilters?.label?.icon || 'save';
  }

  public get pluralLabel(): string {
    return this._filterController.config.savedFilters?.label?.plural || 'Saved filters';
  }

  public get pluralLabelLower(): string {
    return this.pluralLabel.toLowerCase();
  }

  public get enabled(): boolean {
    return this._enabled$.getValue();
  }

  public get enabled$(): Observable<boolean> {
    return this._enabled$
      .pipe(
        distinctUntilChanged(),
      );
  }

  public get savedFilters(): IFilterSavedFilter[] {
    return this._savedFilters$.getValue();
  }

  public set savedFilters(filters: IFilterSavedFilter[]) {
    this._savedFilters$.next(filters);
  }

  public get savedFilters$(): Observable<IFilterSavedFilter[]> {
    return this._savedFilters$
      .pipe(
        distinctUntilChanged(),
      );
  }

  public get activeFilter(): IFilterSavedFilter {
    return this._activeFilter$.getValue();
  }

  public get activeFilter$(): Observable<IFilterSavedFilter> {
    return this._activeFilter$
      .pipe(
        distinctUntilChanged(),
      );
  }

  public get activeFilterData(): KeyValue {
    return this._activeFilter$.getValue()?.filters;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public init(
    filterController: FilterController,
  ): Observable<any> {
    this._filterController = filterController;
    
    if (!filterController.config.savedFilters) {
      this._setEnabledStatus(false);

      return of(null);
    }

    this._setEnabledStatus(true);

    return this.load();
  }

  public initSavedFilters(savedFilters: IFilterSavedFilter[]): void {
    this.savedFilters = savedFilters;
    const acitveFilter = this.savedFilters
      .find((f) => f.active);

    if (acitveFilter) {
      this._activeFilter$.next(acitveFilter);
    }
  }

  public load(): Observable<IFilterSavedFilter[]> {
    if (!this.enabled) {
      return of([]);
    }

    return this._filterController.config.savedFilters.load()
      .pipe(
        tap((savedFilters) => {
          this.initSavedFilters(savedFilters);
        }),
      );
  }

  public create(): Observable<IFilterSavedFilter> {
    return this._prompt.input({
      title: `Create ${this.singularLabelLower}`,
      label: 'Name',
      required: true,
      commitLabel: 'Create',
      dialogConfig: {
        restoreFocus: false,
      },
    })
      .pipe(
        switchMap((name) => {
          const data: IFilterSavedFilter = {
            name,
          };

          return this.save(data);
        }),
        tap((savedFilter) => {
          this.setActiveFilter(savedFilter);
        }),
      );
  }

  public save(savedFilter: IFilterSavedFilter): Observable<IFilterSavedFilter> {
    savedFilter = {
      ...(this.activeFilter || {}),
      ...savedFilter,
      filters: this._filterController.items
        .filter((item) => item.hasValue)
        .reduce((accum, item) => {
          return {
            ...accum,
            [item.name]: item.value,
          };
        }, {}),
    };  

    return this._filterController.config.savedFilters
      .save(savedFilter)
      .pipe(
        tap((_savedFilter) => {
          const exists = this.savedFilters.find((f) => f.id === _savedFilter.id);

          this.savedFilters = exists ? 
            this.savedFilters
              .map((item) => item.id === _savedFilter.id ? _savedFilter : item) : 
            [...this.savedFilters, _savedFilter];
          
          this.setActiveFilter(_savedFilter);
        }),
      );
  }

  public get orderable(): boolean {
    return !!this._filterController.config.savedFilters.order;
  }

  public order(savedFilters: IFilterSavedFilter[]): Observable<IFilterSavedFilter[]> {
    return this._filterController.config.savedFilters
      .order(savedFilters)
      .pipe(
        tap(() => {
          this.savedFilters = [
            ...savedFilters,
          ];
        }),
      );
  }

  public delete(savedFilter: IFilterSavedFilter): Observable<IFilterSavedFilter> {
    return this._filterController.config.savedFilters
      .delete(savedFilter)
      .pipe(
        tap(() => {
          this.savedFilters = this.savedFilters
            .filter((f) => f.id !== savedFilter.id);
          
          if (this.activeFilter?.id === savedFilter.id) {
            this.setActiveFilter(null);
          }
        }),
      );
  }

  public setActiveFilter(savedFilter: IFilterSavedFilter): void {
    if (savedFilter) {
      const existingFilter = this.savedFilters
        .find((f) => f.id === savedFilter.id);

      if (!existingFilter) {
        throw new Error(`Saved filter cannot be activated, because it does not exists. Filter ID = ${savedFilter.id}`);
      }

      this._filterController.values = existingFilter.filters;    
      this._activeFilter$.next(existingFilter);
    } else {
      this._activeFilter$.next(null);
    }
  }

  private _setEnabledStatus(value: boolean): void {
    this._enabled$.next(value);
  }
}
