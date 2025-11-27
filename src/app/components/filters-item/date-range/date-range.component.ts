import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { ItemType } from '../../../enums/item-type.enum';
import { PickerViewType } from '../../../enums/picker-view-type.enum';
import { DateRangeItem } from '../../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../../models/items/date-time-range-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    FocusToItemDirective,
    FsDatePickerModule,
    FsFormModule,
  ],
})
export class  DateRangeComponent 
  extends BaseItemComponent<DateRangeItem | DateTimeRangeItem> implements OnInit, OnDestroy {

  @Input() public autofocusName: string;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  public viewType = PickerViewType.Date;
  public from: Date;
  public to: Date;

  public ngOnInit() {
    this.viewType = this.item.type === ItemType.DateTimeRange ? 
      PickerViewType.DateTime : PickerViewType.Date;

    if(!this.autofocusName) {
      this.autofocusName = this.from ? 'to' : 'from';
    }

    this.from = this.item.value?.from;
    this.to = this.item.value?.to;
  }
  
  public ngOnDestroy(): void {
    if(this.triggerChangeOn === 'close') {
      this.item.value = this.value;
    }
  }  
  
  public change() {
    if(this.triggerChangeOn === 'change') {
      this.item.value = this.value;
    }
  }

  public get value() {
    return {
      from: this.from,
      to: this.to,
    };
  }
}
