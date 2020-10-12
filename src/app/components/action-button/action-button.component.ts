import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  @Input()
  public action: Action;

}
