import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';

import { takeUntil } from 'rxjs/operators';

import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { ItemType } from '../../../enums/item-type.enum';
import { PickerViewType } from '../../../enums/picker-view-type.enum';
import { DateRangeItem } from '../../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../../models/items/date-time-range-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-date-range',
  templateUrl: './date-range.component.html',
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
export class DateRangeComponent extends BaseItemComponent<DateRangeItem | DateTimeRangeItem> implements OnInit {

  public viewType = PickerViewType.Date;
  public from: Date;
  public to: Date;

  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this.viewType = this.item.type === ItemType.DateTimeRange ? PickerViewType.DateTime : PickerViewType.Date;

    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.from = value?.from;
        this.to = value?.to;
        this._cdRef.detectChanges();
      });
  }

  public change() {
    this.item.value = {
      from: this.from,
      to: this.to,
    };
  }
}
