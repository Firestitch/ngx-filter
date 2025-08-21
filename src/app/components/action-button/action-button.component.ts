import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ButtonStyle } from '../../enums';
import { Action } from '../../models/action.model';
import { NgSwitch, NgSwitchCase, NgClass, NgTemplateOutlet, NgSwitchDefault, NgIf, AsyncPipe } from '@angular/common';
import { MatIconButton, MatFabButton, MatMiniFabButton, MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'fs-filter-action-button',
    templateUrl: './action-button.component.html',
    styleUrl: './action-button.component.scss',
    host: { class: 'action-button' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgSwitch,
        NgSwitchCase,
        MatIconButton,
        NgClass,
        NgTemplateOutlet,
        MatFabButton,
        MatMiniFabButton,
        NgSwitchDefault,
        MatButton,
        FsFormModule,
        NgIf,
        MatIcon,
        AsyncPipe,
    ],
})
export class FsFilterActionButtonComponent {

  public ButtonStyle = ButtonStyle;

  @Input()
  public action: Action;

}
