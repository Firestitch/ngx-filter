import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { ExternalParamsController } from '../../services/external-params-controller.service';
import { SavedFiltersController } from '../../services/external-params/saved-filters-controller.service';


@Component({
  selector: 'fs-filter-drawer-actions',
  templateUrl: './filter-drawer-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterDrawerActionsComponent {

  @Output('clear')
  private _clear = new EventEmitter<void>();

  @Output('done')
  private _done = new EventEmitter<void>();

  constructor(public externalParams: ExternalParamsController) { }

  public get savedFilters(): SavedFiltersController {
    return this.externalParams.savedFiltersController;
  }

  public done(): void {
    this._done.emit();
  }

  public clear(): void {
    this._clear.emit();
  }

  public saveFilters() {
    this.externalParams
      .savedFiltersController
      .openSavedFilterEditDialog();
  }
}
