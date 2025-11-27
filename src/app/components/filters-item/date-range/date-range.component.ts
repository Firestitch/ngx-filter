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


import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    super.ngOnInit();

    this.viewType = this.item.type === ItemType.DateTimeRange ? 
      PickerViewType.DateTime : PickerViewType.Date;

    if(this.item.primary) {
      this.autofocusName = null;
    } else if(!this.autofocusName) {
      this.autofocusName = this.from ? 'to' : 'from';
    }

    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.from = value?.from;
        this.to = value?.to;
        this._cdRef.detectChanges();
      });
  }
  
  public ngOnDestroy(): void {
    if(this.triggerChangeOn === 'close') {
      this.item.value = this.getValue;
    }
  }  
  
  public change() {
    if(this.triggerChangeOn === 'change') {
      this.item.value = this.getValue;
    }
  }

  public get getValue() {
    return {
      from: this.from,
      to: this.to,
    };
  }
}
