import { inject, Injectable, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  FsFilterSavedFilterEditComponent,
} from '../components/saved-filter/saved-filter-edit/saved-filter-edit.component';
import { restoreItems } from '../helpers/restore-items';
import { IFilterExternalParams } from '../interfaces/external-params.interface';
import {
  IFilterSavedFilter,
  IFilterSavedFiltersConfig,
} from '../interfaces/saved-filters.interface';

import { FsFilterItemsStore } from './items-store.service';


@Injectable()
export class SavedFilterController implements OnDestroy {

  private _config: IFilterSavedFiltersConfig;
  private _savedFilters$ = new BehaviorSubject<IFilterSavedFilter[]>([]);
  private _activeFilter$ = new BehaviorSubject<IFilterSavedFilter>(null);
  private _enabled$ = new BehaviorSubject<boolean>(false);
  private _destroy$ = new Subject<void>();
  private _itemsStore = inject(FsFilterItemsStore);
  private _dialog = inject(MatDialog);
  private _prompt = inject(FsPrompt);

  public get singularLabel(): string {
    return this._config?.label?.singular || 'Saved filter';
  }

  public get singularLabelLower(): string {
    return this.singularLabel.toLowerCase();
  }

  public get labelIcon(): string {
    return this._config?.label?.icon || 'save';
  }

  public get pluralLabel(): string {
    return this._config?.label?.plural || 'Saved filters';
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

  public get activeFilterData(): IFilterExternalParams {
    return this._activeFilter$.getValue()?.filters;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public init(
    filterSavedFiltersConfig: IFilterSavedFiltersConfig,
  ): void {
    if (!filterSavedFiltersConfig) {
      this._setEnabledStatus(false);

      return;
    }
    this._setEnabledStatus(true);

    this._config = filterSavedFiltersConfig;
  }

  public initSavedFilters(filters: IFilterSavedFilter[]): void {
    this.savedFilters = filters;
  }

  public load(): Observable<IFilterSavedFilter[]> {
    return this._config.load()
      .pipe(
        tap((response) => {
          this.initSavedFilters(response);
        }),
      );
  }

  public create(): Observable<IFilterSavedFilter> {
    return this._prompt.input({
      title: `Create ${this.singularLabel}`,
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
            filters: this._itemsStore.queryParams(),
          };

          return this.save(data);
        }),
        tap((savedFilter) => {
          this.setActiveFilter(savedFilter);
        }),
      );
  }

  public save(savedFilter: IFilterSavedFilter): Observable<IFilterSavedFilter> {
    const exists = !!savedFilter.id;

    savedFilter = {
      ...this.activeFilter,
      ...savedFilter,
      filters: this._itemsStore.models(),
    };  

    return this._config.save(savedFilter)
      .pipe(
        tap((_savedFilter) => {
          this.savedFilters = exists ? this.savedFilters
            .map((f) => f.id === savedFilter.id ? _savedFilter : f) : [
            ...this.savedFilters,
            _savedFilter,
          ];
          
          this.setActiveFilter(_savedFilter);
        }),
      );
  }

  public get orderable(): boolean {
    return !!this._config.order;
  }

  public order(savedFilters: IFilterSavedFilter[]): Observable<IFilterSavedFilter[]> {
    return this._config.order(savedFilters)
      .pipe(
        tap(() => {
          this.savedFilters = [
            ...savedFilters,
          ];
        }),
      );
  }

  public delete(savedFilter: IFilterSavedFilter): Observable<IFilterSavedFilter> {
    return this._config.delete(savedFilter)
      .pipe(
        tap(() => {
          this.savedFilters = this.savedFilters
            .filter((f) => f.id !== savedFilter.id);
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
      
      this._activeFilter$.next(existingFilter);
    } else {
      this._activeFilter$.next(null);
    }
  }

  public openSavedFilterEditDialog(): void {
    const params = this._itemsStore.queryParams();

    const dialogConfig = {
      data: {
        params: params,
        savedFilters: this.savedFilters,
        saveCallback: this.save.bind(this),
      },
    };

    this._dialog
      .open(FsFilterSavedFilterEditComponent, dialogConfig)
      .beforeClosed()
      .pipe(
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe((updatedFilter: IFilterSavedFilter | null) => {
        if (updatedFilter) {
          // get already saved related filter object
          const savedFilter = this.savedFilters
            .find((f) => f.id === updatedFilter.id);

          // restore values from query string
          updatedFilter.filters = restoreItems(
            updatedFilter.filters,
            this._itemsStore.items,
          );


          if (savedFilter) {
            Object.assign(savedFilter, updatedFilter);
          } else {
            this.updateActiveFilter();
            this.savedFilters = [
              ...this.savedFilters,
              updatedFilter,
            ];
          }

          this.updateActiveFilter();
        }
      });
  }

  public updateActiveFilter(): void {
    const acitveFilter = this.savedFilters
      .find((f) => f.active);

    if (acitveFilter) {
      this.setActiveFilter(acitveFilter);
    }
  }

  private _setEnabledStatus(value: boolean): void {
    this._enabled$.next(value);
  }
}
