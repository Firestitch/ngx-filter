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
import { ParamController } from '../../../services/param-controller.service';
import { SavedFilterController } from '../../../services/saved-filter-controller.service';


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

  private _savedFilterController = inject(SavedFilterController);
  private _cdRef = inject(ChangeDetectorRef);
  private _paramCointroller = inject(ParamController);
  private _dialogRef = inject(MatDialogRef);
  private _filterOverlayService = inject(FsFilterOverlayService);

  public ngOnInit(): void {
    this.savedFilters = [
      ...this._savedFilterController.savedFilters || [],
    ];
  }

  public get pluralLabelLower(): string {
    return this._savedFilterController.pluralLabelLower;
  }

  public get sortable(): boolean {
    return this._savedFilterController.orderable;
  }

  public selectFilter(savedFilter: IFilterSavedFilter) {
    this._paramCointroller.setActiveSavedFilter(savedFilter);
    this._filterOverlayService.open();
    this._dialogRef.close();
  }

  public remove(savedFilter: IFilterSavedFilter) {
    this._savedFilterController.delete(savedFilter)
      .subscribe(() => {
        this.savedFilters = [...this._savedFilterController.savedFilters];
        this._cdRef.markForCheck();
      });
  }

  public order(savedFilters: IFilterSavedFilter[]) {
    this._savedFilterController.order(savedFilters)
      .subscribe();
  }

}
