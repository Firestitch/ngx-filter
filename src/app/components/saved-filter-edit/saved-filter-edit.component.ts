import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { IFilterExternalParams } from '../../interfaces/external-params.interface';
import {
  FilterRemoteSave,
  IFilterSavedFilter,
} from '../../interfaces/saved-filters.interface';


@Component({
  templateUrl: './saved-filter-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterSavedFilterEditComponent {

  public filterParams: IFilterExternalParams;
  public saveAsFilter: IFilterSavedFilter | 'new' = 'new';
  public savedFilters: IFilterSavedFilter[];
  public savedFilterName = '';

  private _saveCallback: FilterRemoteSave;
  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<FsFilterSavedFilterEditComponent>,
  ) {
    this.savedFilters = this.data.savedFilters;
    this._saveCallback = this.data.saveCallback;
  }

  public save = () => {
    const savedFilter: IFilterSavedFilter = this.saveAsFilter === 'new' ? 
      {
        name: this.savedFilterName,
        active: true,
        filters: this.data.params,
      } : {
        ...this.saveAsFilter,
        filters: this.data.params,
      };

    return this._saveCallback(savedFilter)
      .pipe(
        tap((filter) => {
          this._dialogRef.close(filter);
        }),
        takeUntil(this._destroy$),
      );
  };

}
