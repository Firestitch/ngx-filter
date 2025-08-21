import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { IFilterSavedFilter } from '../../../interfaces/saved-filters.interface';
import { FsFilterOverlayService } from '../../../services';
import { ExternalParamsController } from '../../../services/external-params-controller.service';
import { SavedFiltersController } from '../../../services/saved-filters-controller.service';


@Component({
  templateUrl: './saved-filter-manage.component.html',
  styleUrls: ['./saved-filter-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
  ],
})
export class FsFilterSavedFilterManageComponent implements OnInit {

  public savedFilters: IFilterSavedFilter[];

  private _savedFiltersController = inject(SavedFiltersController);
  private _cdRef = inject(ChangeDetectorRef);
  private _externalParams = inject(ExternalParamsController);
  private _dialogRef = inject(MatDialogRef);
  private _filterOverlayService = inject(FsFilterOverlayService);

  public ngOnInit(): void {
    this.savedFilters = [
      ...this._savedFiltersController.savedFilters || [],
    ];
  }

  public get pluralLabelLower(): string {
    return this._savedFiltersController.pluralLabelLower;
  }

  public get sortable(): boolean {
    return this._savedFiltersController.orderable;
  }

  public selectFilter(savedFilter: IFilterSavedFilter) {
    this._externalParams.setActiveSavedFilter(savedFilter);
    this._filterOverlayService.open();
    this._dialogRef.close();
  }

  public remove(savedFilter: IFilterSavedFilter) {
    this._savedFiltersController.delete(savedFilter)
      .subscribe(() => {
        this.savedFilters = [...this._savedFiltersController.savedFilters];
        this._cdRef.markForCheck();
      });
  }

  public order(savedFilters: IFilterSavedFilter[]) {
    this._savedFiltersController.order(savedFilters)
      .subscribe();
  }

}
