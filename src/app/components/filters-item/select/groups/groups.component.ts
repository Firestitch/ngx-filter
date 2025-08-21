import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FocusToItemDirective } from '../../../../directives/focus-to-item/focus-to-item.directive';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'filter-item-select-groups',
    templateUrl: './groups.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatSelect,
        FocusToItemDirective,
        FormsModule,
        FsFormModule,
        MatOptgroup,
        MatOption,
        NgStyle,
    ],
})
export class SelectGroupsComponent {

  @ViewChild('select', { static: true }) public select: MatSelect;
  @Input() public item;

  constructor(public cd: ChangeDetectorRef) {}

  public compare(o1, o2) {
    return o1 == o2;
  }

  public markForCheck() {
    this.cd.markForCheck();
  }
}
