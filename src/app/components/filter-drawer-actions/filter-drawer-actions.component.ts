import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs';

import type { SavedFiltersController } from '../../services/saved-filters-controller.service';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'fs-filter-drawer-actions',
    templateUrl: './filter-drawer-actions.component.html',
    styleUrls: ['./filter-drawer-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButton,
        FsFormModule,
        AsyncPipe,
    ],
})
export class FsFilterDrawerActionsComponent {

  @Input()
  public savedFiltersController: SavedFiltersController;

  @Output('clear')
  private _clear = new EventEmitter<void>();

  @Output('done')
  private _done = new EventEmitter<void>();

  private _message = inject(FsMessage);

  public done(): void {
    this._done.emit();
  }

  public clear(): void {
    this._clear.emit();
  }

  public createFilter(): void {
    this.savedFiltersController.create() 
      .pipe(
        tap(() => {
          this._message
            .success(`Created ${this.savedFiltersController.singularLabel}`,
              { positionClass: 'toast-bottom-left' },
            );
        }),
      )
      .subscribe();
  }
 
}
