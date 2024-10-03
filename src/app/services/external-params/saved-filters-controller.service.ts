import { Injectable, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  FsFilterSavedFilterEditComponent,
} from '../../components/saved-filter/saved-filter-edit/saved-filter-edit.component';
import { buildQueryParams } from '../../helpers/build-query-params';
import { restoreItems } from '../../helpers/restore-items';
import { IFilterExternalParams } from '../../interfaces/external-params.interface';
import {
  IFilterSavedFilter,
  IFilterSavedFiltersConfig,
} from '../../interfaces/saved-filters.interface';
import { FsFilterItemsStore } from '../items-store.service';


@Injectable()
export class SavedFiltersController implements OnDestroy {

  protected _config: IFilterSavedFiltersConfig;

  private _savedFilters$ = new BehaviorSubject<IFilterSavedFilter[]>([]);
  private _activeFilter$ = new BehaviorSubject<IFilterSavedFilter>(null);
  private _enabled$ = new BehaviorSubject<boolean>(false);
  private _paramsCase: 'snake' | 'camel';
  private _destroy$ = new Subject<void>();

  constructor(
    private _itemsStore: FsFilterItemsStore,
    private _dialog: MatDialog,
  ) {}

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
    this._destroy$.next();
    this._destroy$.complete();
  }

  public init(
    remoteParamsConfig: IFilterSavedFiltersConfig,
    paramsCase: 'snake' | 'camel',
  ): void {
    if (!remoteParamsConfig) {
      this._setEnabledStatus(false);

      return;
    }
    this._setEnabledStatus(true);

    this._paramsCase = paramsCase;
    this._config = remoteParamsConfig;
  }

  public initSavedFilters(filters: IFilterSavedFilter[]): void {
    filters = [...filters];
    filters.forEach((savedFilter) => {
      savedFilter.filters = restoreItems(
        savedFilter.filters,
        this._itemsStore.items,
      );
    });

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

  public save(savedFilter: IFilterSavedFilter): Observable<IFilterSavedFilter> {
    return this._config.save(savedFilter);
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
    const params = buildQueryParams(
      this._itemsStore.valuesAsQuery(),
      this._itemsStore.items,
    );

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
            this.resetActiveFilter();
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
    // Lookup active filter
    const acitveFilter = this.savedFilters
      .find((f) => f.active);

    if (acitveFilter) {
      this.setActiveFilter(acitveFilter);
    }
  }

  public resetActiveFilter(): void {
    // Reset all previously activated filters
    this.savedFilters.forEach((savedFilter) => {
      savedFilter.active = false;
    });

    this.setActiveFilter(null);
  }

  private _setEnabledStatus(value: boolean): void {
    this._enabled$.next(value);
  }
}
