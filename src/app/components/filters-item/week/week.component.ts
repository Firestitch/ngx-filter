import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { WeekItem } from '../../../models/items/week-item';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-week',
    templateUrl: './week.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        FsDatePickerModule,
        FocusToItemDirective,
        FsFormModule,
    ],
})
export class WeekComponent extends BaseItemComponent<WeekItem> implements OnInit {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {}
}
