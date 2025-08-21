import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';

import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { ItemType } from '../../../enums/item-type.enum';
import { PickerViewType } from '../../../enums/picker-view-type.enum';
import type { DateItem } from '../../../models/items/date-item';
import type { DateTimeItem } from '../../../models/items/date-time-item';
import type { BaseDateItem } from '../../../models/items/date/base-date-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-date',
    templateUrl: './date.component.html',
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
export class DateComponent extends BaseItemComponent<DateItem | DateTimeItem> implements OnInit {

  public viewType = PickerViewType.Date;

  public itemDateMode = ItemDateMode;
  public showYear = true;
  public showMonth = true;
  public showDay = true;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {
    this.viewType = this.item.type === ItemType.DateTime ? PickerViewType.DateTime : PickerViewType.Date;

    if ((this.item as BaseDateItem).mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }
  }
}
