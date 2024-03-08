import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { ActionMode, ActionType } from '../../enums';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-filter-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterActionsComponent {

  @Input()
  public kebabActions: Action[] = [];

  @Input()
  public actions: Action[] = [];

  public ActionType = ActionType;
  public ActionMode = ActionMode;

  public actionChange(action, value): void {
    if(action.change) {
      action.change(value);
    }
  }

}
