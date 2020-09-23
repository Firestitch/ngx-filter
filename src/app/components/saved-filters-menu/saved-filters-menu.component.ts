import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { SavedFiltersController } from '../../services/external-params/saved-filters-controller.service';
import { ExternalParamsController } from '../../services/external-params-controller.service';
import { FsFilterItemsStore } from '../../services/items-store.service';
import { IFilterSavedFilter } from '../../interfaces/saved-filters.interface';


@Component({
  selector: 'fs-filter-saved-filters-menu',
  templateUrl: './saved-filters-menu.component.html',
  styleUrls: [
    './saved-filters-menu.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsSavedFiltersMenuComponent {

  @Output()
  public select = new EventEmitter<IFilterSavedFilter>();

  @Output()
  public clear = new EventEmitter<void>();

  @Output()
  public manage = new EventEmitter<void>();

  constructor(
    private _itemsStore: FsFilterItemsStore,
    private _externalParams: ExternalParamsController,
    private _savedFilters: SavedFiltersController
  ) {}

  public get filters$(): Observable<IFilterSavedFilter[]> {
    return this._savedFilters.savedFilters$;
  }

  public get activeFilter$(): Observable<IFilterSavedFilter> {
    return this._savedFilters.activeFilter$;
  }

  public selectFilter(savedFilter: IFilterSavedFilter): void {
    this._externalParams.setActiveSavedFilter(savedFilter);

    this.select.emit(savedFilter);
  }

  public removeActiveFilter(): void {
    this._itemsStore.filtersClear();
    this._externalParams.setActiveSavedFilter(null);

    this.clear.emit();
  }

  public manageFilters(): void {
    this.manage.emit();
  }
}
