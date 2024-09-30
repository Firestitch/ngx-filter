import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { IFilterSavedFilter } from '../../../interfaces/saved-filters.interface';
import { ExternalParamsController } from '../../../services/external-params-controller.service';
import { SavedFiltersController } from '../../../services/external-params/saved-filters-controller.service';
import { FsFilterItemsStore } from '../../../services/items-store.service';
import { FsFilterSavedFilterManageComponent } from '../saved-filter-manage';


@Component({
  selector: 'fs-filter-saved-filters-menu',
  templateUrl: './saved-filters-menu.component.html',
  styleUrls: ['./saved-filters-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsSavedFiltersMenuComponent {

  @Output()
  public clear = new EventEmitter<void>();

  constructor(
    private _itemsStore: FsFilterItemsStore,
    private _externalParams: ExternalParamsController,
    private _savedFilters: SavedFiltersController,
    private _dialog: MatDialog,
  ) {}

  public get filters$(): Observable<IFilterSavedFilter[]> {
    return this._savedFilters.savedFilters$;
  }

  public get activeFilter$(): Observable<IFilterSavedFilter> {
    return this._savedFilters.activeFilter$;
  }

  public selectFilter(savedFilter: IFilterSavedFilter): void {
    this._externalParams.setActiveSavedFilter(savedFilter);
  }

  public removeActiveFilter(): void {
    this._itemsStore.filtersClear();
    this._externalParams.setActiveSavedFilter(null);

    this.clear.emit();
  }

  public manageFilters(): void {
    this._dialog.open(FsFilterSavedFilterManageComponent, {
      data: {
        savedFiltersController: this._savedFilters,
      },
    });
  }
}
