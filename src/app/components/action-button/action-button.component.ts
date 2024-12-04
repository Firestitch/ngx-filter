import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ButtonStyle } from '../../enums';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-filter-action-button',
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  host: { class: 'action-button' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterActionButtonComponent {

  public ButtonStyle = ButtonStyle;

  @Input()
  public action: Action;

}
