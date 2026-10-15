import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { FsMenuModule } from '@firestitch/menu';

import { tap } from 'rxjs/operators';

import { IFilterConfigItem } from '../../../interfaces';
import { IFilterSavedFilter } from '../../../interfaces/saved-filters.interface';
import { BaseItem } from '../../../models/items';
import { FilterController } from '../../../services/filter-controller.service';
import { SavedFilterController } from '../../../services/saved-filter-controller.service';

import { FsFilterSavedFilterChipsComponent } from './components/saved-filter-chips';


@Component({
  templateUrl: './saved-filter-manage.component.html',
  styleUrls: ['./saved-filter-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    MatIcon,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FsFilterSavedFilterChipsComponent,
    FsMenuModule,
  ],
})
export class FsFilterSavedFilterManageComponent {

  public savedFilters = signal<IFilterSavedFilter[]>([]);

  private _savedFilterController = inject(SavedFilterController);
  private _filterController = inject(FilterController);
  private _dialogRef = inject(MatDialogRef);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._init();
  }

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._filterController.items;
  }

  public get pluralLabel(): string {
    return this._savedFilterController.pluralLabel;
  }

  public get orderable(): boolean {
    return this._savedFilterController.orderable;
  }

  public selectFilter(savedFilter: IFilterSavedFilter) {
    this._savedFilterController.setActiveFilter(savedFilter);
    this._dialogRef.close();
  }

  public rename(savedFilter: IFilterSavedFilter): void {
    this._savedFilterController.rename(savedFilter)
      .pipe(
        tap(() => {
          this.savedFilters.set(this._savedFilterController.savedFilters);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  public remove(savedFilter: IFilterSavedFilter) {
    this._savedFilterController.delete(savedFilter)
      .pipe(
        tap(() => {
          this.savedFilters.set(this._savedFilterController.savedFilters);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  public drop(event: CdkDragDrop<IFilterSavedFilter[]>) {
    const savedFilters = [...this.savedFilters()];
    moveItemInArray(savedFilters, event.previousIndex, event.currentIndex);
    this.savedFilters.set(savedFilters);
    this.order(savedFilters);
  }

  public order(savedFilters: IFilterSavedFilter[]) {
    this._savedFilterController.order(savedFilters)
      .subscribe();
  }

  private _init(): void {
    this.savedFilters.set(this._savedFilterController.savedFilters);
  }

}
