import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { ItemType } from '../../../enums/item-type.enum';
import { PickerViewType } from '../../../enums/picker-view-type.enum';
import type { BaseDateItem } from '../../../models/items/base-date-item';
import type { DateItem } from '../../../models/items/date-item';
import type { DateTimeItem } from '../../../models/items/date-time-item';
import { BaseItemComponent } from '../base-item/base-item.component';


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

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  public viewType = PickerViewType.Date;

  public itemDateMode = ItemDateMode;
  public showYear = true;
  public showMonth = true;
  public showDay = true;
  public value: any;

  public ngOnInit() {
    this.viewType = this.item.type === ItemType.DateTime ? 
      PickerViewType.DateTime : PickerViewType.Date;

    if ((this.item as BaseDateItem).mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }

    this.value = this.item.value;
  }

  public change(event: any) {
    this.item.value = event;
    this.close();
  }
}
