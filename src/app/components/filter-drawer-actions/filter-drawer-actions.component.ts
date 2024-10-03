import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'fs-filter-drawer-actions',
  templateUrl: './filter-drawer-actions.component.html',
  styleUrls: ['./filter-drawer-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterDrawerActionsComponent {

  @Output('clear')
  private _clear = new EventEmitter<void>();

  @Output('done')
  private _done = new EventEmitter<void>();

  public done(): void {
    this._done.emit();
  }

  public clear(): void {
    this._clear.emit();
  }
 
}
