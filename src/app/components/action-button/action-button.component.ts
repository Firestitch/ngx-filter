import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionType } from '../../enums/action-type.enum';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-filter-action-button',
  templateUrl: './action-button.component.html',
  host: {
    class: 'action-button',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterActionButtonComponent {

  public ActionType = ActionType;

  @Input()
  public action: Action;

}
