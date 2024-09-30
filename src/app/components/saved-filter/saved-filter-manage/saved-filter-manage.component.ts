import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FilterRemoteOrder, IFilterSavedFilter } from '../../../interfaces/saved-filters.interface';
import { SavedFiltersController } from '../../../services/external-params/saved-filters-controller.service';


@Component({
  templateUrl: './saved-filter-manage.component.html',
  styleUrls: ['./saved-filter-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterSavedFilterManageComponent {

  public savedFilters: IFilterSavedFilter[];

  private _savedFiltersController: SavedFiltersController;
  private _filterRemoteOrder: FilterRemoteOrder;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _cdRef: ChangeDetectorRef,
  ) {
    this._savedFiltersController = this.data.savedFiltersController;
    this.savedFilters = [...this._savedFiltersController.savedFilters];
  }

  public remove(savedFilter: IFilterSavedFilter) {
    this._savedFiltersController.delete(savedFilter)
      .subscribe(() => {
        this.savedFilters = [...this._savedFiltersController.savedFilters];
        this._cdRef.markForCheck();
      });
  }

  public drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.savedFilters, event.previousIndex, event.currentIndex);

    this._savedFiltersController.order(this.savedFilters)
      .subscribe();
  }

}
