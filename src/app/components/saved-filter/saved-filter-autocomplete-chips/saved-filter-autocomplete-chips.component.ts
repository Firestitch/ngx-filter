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
import { ItemStore } from '../../../services/item-store.service';
import { ParamController } from '../../../services/param-controller.service';
import type { SavedFilterController } from '../../../services/saved-filter-controller.service';
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

  private _itemStore = inject(ItemStore);
  private _paramController = inject(ParamController);
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

  public selectFilter(savedFilter: IFilterSavedFilter): void {
    this._paramController.setActiveSavedFilter(savedFilter);
  }

  public selectedFilterChange(savedFilter: IFilterSavedFilter): void {
    this._paramController.setActiveSavedFilter(savedFilter);

    if (!savedFilter) {
      this._itemStore.filtersClear();
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
            name,
            filters: { ...this.savedFiltersController.activeFilter.filters },
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
