import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { MatSelect } from '@angular/material/select';

import { ActionMode, ButtonStyle } from '../../enums';
import { Action } from '../../models/action.model';
import { FsFilterActionButtonComponent } from '../action-button/action-button.component';
import { FsPopoverModule } from '@firestitch/popover';
import { FsMenuModule } from '@firestitch/menu';
import { MatIcon } from '@angular/material/icon';
import { FsSelectButtonModule } from '@firestitch/selectbutton';
import { NgClass, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatOption } from '@angular/material/core';
import { FsFileModule } from '@firestitch/file';
import { FsFilterActionKebabActionsComponent } from '../action-kebab-actions/action-kebab-actions.component';


@Component({
    selector: 'fs-filter-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsFilterActionButtonComponent,
        FsPopoverModule,
        FsMenuModule,
        MatIcon,
        MatSelect,
        FsSelectButtonModule,
        NgClass,
        FormsModule,
        FsFormModule,
        MatOption,
        FsFileModule,
        FsFilterActionKebabActionsComponent,
        AsyncPipe,
    ],
})
export class FsFilterActionsComponent {

  @Input()
  public kebabActions: Action[] = [];

  @Input()
  public actions: Action[] = [];

  public ButtonStyle = ButtonStyle;
  public ActionMode = ActionMode;

  public actionChange(action: Action, value: any, selectButton: MatSelect): void {
    if(action.change) {
      action.change(value);      

      if(action.deselect) {
        selectButton.writeValue(null);
      }
    }
  }

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
  }

}
