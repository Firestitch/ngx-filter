import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsMenuModule } from '@firestitch/menu';

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
    FsFilterSavedFilterChipsComponent,
    FsMenuModule,
  ],
})
export class FsFilterSavedFilterManageComponent implements OnInit {

  public savedFilters: IFilterSavedFilter[];

  private _savedFilterController = inject(SavedFilterController);
  private _cdRef = inject(ChangeDetectorRef);
  private _filterController = inject(FilterController);
  private _dialogRef = inject(MatDialogRef);

  public ngOnInit(): void {
    this.savedFilters = this._savedFilterController.savedFilters;
  }

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._filterController.items;
  }

  public get pluralLabelLower(): string {
    return this._savedFilterController.pluralLabelLower;
  }

  public get sortable(): boolean {
    return this._savedFilterController.orderable;
  }

  public selectFilter(savedFilter: IFilterSavedFilter) {
    this._savedFilterController.setActiveFilter(savedFilter);
    this._dialogRef.close();
  }

  public remove(savedFilter: IFilterSavedFilter) {
    this._savedFilterController.delete(savedFilter)
      .subscribe(() => {
        this.savedFilters = this._savedFilterController.savedFilters;
        this._cdRef.markForCheck();
      });
  }

  public order(savedFilters: IFilterSavedFilter[]) {
    this._savedFilterController.order(savedFilters)
      .subscribe();
  }

}
