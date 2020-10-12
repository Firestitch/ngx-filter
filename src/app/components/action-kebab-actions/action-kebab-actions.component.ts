import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-filter-action-kebab-actions',
  templateUrl: './action-kebab-actions.component.html',
  host: {
    class: 'action-button',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterActionKebabActionsComponent {

  @Input()
  public kebabActions: Action[];

}
