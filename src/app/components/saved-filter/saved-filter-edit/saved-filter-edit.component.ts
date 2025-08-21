import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { IFilterExternalParams } from '../../../interfaces/external-params.interface';
import {
  FilterRemoteSave,
  IFilterSavedFilter,
} from '../../../interfaces/saved-filters.interface';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption, MatOptgroup } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: './saved-filter-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatOptgroup,
        MatInput,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
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
