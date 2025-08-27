import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';

import { map, Observable, switchMap, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IFilterSavedFilter } from '../../../interfaces/saved-filters.interface';
import type { SavedFilterController } from '../../../services';
import { FilterController } from '../../../services/filter-controller.service';
import { FsFilterSavedFilterManageComponent } from '../saved-filter-manage';


@Component({
  selector: 'fs-saved-filter-autocomplete-chips',
  templateUrl: './saved-filter-autocomplete-chips.component.html',
  styleUrls: ['./saved-filter-autocomplete-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsAutocompleteChipsModule,
    FormsModule,
  ],
})
export class FsSavedFilterAutocompleteChipsComponent implements OnInit {

  @Input()
  public savedFiltersController: SavedFilterController;

  public selectedFilter: IFilterSavedFilter;

  private _filterController = inject(FilterController);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private _injector = inject(Injector);
  private _cdRef = inject(ChangeDetectorRef);
  private _prompt = inject(FsPrompt);
  private _message = inject(FsMessage);
  
  public get filters$(): Observable<IFilterSavedFilter[]> {
    return this.savedFiltersController.savedFilters$;
  }

  public get activeFilter$(): Observable<IFilterSavedFilter> {
    return this.savedFiltersController.activeFilter$;
  }

  public get pluralLabelLower(): string {
    return this.savedFiltersController.pluralLabelLower;
  }

  public get pluralLabel(): string {
    return this.savedFiltersController.pluralLabel;
  }

  public get labelIcon(): string {
    return this.savedFiltersController.labelIcon;
  }

  public compareWith = (o1: IFilterSavedFilter, o2: IFilterSavedFilter): boolean => {
    return o1?.id === o2?.id;
  };

  public selectFilter(savedFilter: IFilterSavedFilter): void {
    this.savedFiltersController.setActiveFilter(savedFilter);
  }

  public selectedFilterChange(savedFilter: IFilterSavedFilter): void {
    this.savedFiltersController.setActiveFilter(savedFilter);

    if (!savedFilter) {
      this._filterController.filtersClear();
    }
  }

  public ngOnInit(): void {
    this.savedFiltersController.activeFilter$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((savedFilter) => {
        this.selectedFilter = savedFilter;
        this._cdRef.markForCheck();
      });
  }

  public save(): void {
    this.savedFiltersController
      .save(this.selectedFilter)
      .pipe(
        tap(() => {
          this._message.success(`Saved ${this.savedFiltersController.singularLabel}`);
        }),
      )
      .subscribe();
  }

  public create(): void {
    this.savedFiltersController.create()
      .pipe(
        tap(() => {
          this._message
            .success(`Created ${this.savedFiltersController.singularLabel}`,
            );
        }),
      )
      .subscribe();
  }

  public saveAs(): void {
    this._prompt.input({
      title: 'Save as new alert',
      label: 'Name',
      required: true,
      commitLabel: 'Save',
      dialogConfig: {
        restoreFocus: false,
      },
    })
      .pipe(
        switchMap((name) => {
          const data: IFilterSavedFilter = {
            id: null,
            name,
          };

          return this.savedFiltersController.save(data);
        }),
        tap(() => {
          this._message.success(`Saved ${this.savedFiltersController.singularLabel}`);
        }),
      )
      .subscribe();
  } 


  public fetch = (query: string) => {
    return this.savedFiltersController.savedFilters$
      .pipe(
        map((filters: IFilterSavedFilter[]) => filters
          .filter((filter: IFilterSavedFilter) => filter
            .name.toLowerCase().includes(query.toLowerCase()))),
      );
  };

  public manageFilters(): void {
    this._dialog
      .open(FsFilterSavedFilterManageComponent, {
        injector: this._injector,
        restoreFocus: false,
      });
  }
}
