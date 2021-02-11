import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-filter-action-kebab-actions',
  styleUrls: ['./action-kebab-actions.component.scss'],
  templateUrl: './action-kebab-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterActionKebabActionsComponent {

  @Input()
  public kebabActions: Action[];

}
