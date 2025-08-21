import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Action } from '../../models/action.model';
import { MatIconButton } from '@angular/material/button';
import { FsMenuModule } from '@firestitch/menu';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'fs-filter-action-kebab-actions',
    styleUrls: ['./action-kebab-actions.component.scss'],
    templateUrl: './action-kebab-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconButton,
        FsMenuModule,
        MatIcon,
        AsyncPipe,
    ],
})
export class FsFilterActionKebabActionsComponent {

  @Input()
  public kebabActions: Action[];

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
  }
}
