import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import {
  DateRangePickerFromComponent,
  DateRangePickerToComponent,
  FsDatePickerModule,
} from '@firestitch/datepicker';
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

  @ViewChild(DateRangePickerFromComponent)
  private _fromPicker: DateRangePickerFromComponent;

  @ViewChild(DateRangePickerToComponent)
  private _toPicker: DateRangePickerToComponent;

  public viewType = PickerViewType.Date;
  public from: Date;
  public to: Date;
  public initialized = false;

  public ngOnInit() {
    super.ngOnInit();
    console.log('[DateRangeComponent] ngOnInit', this.item.name);

    this.viewType = this.item.type === ItemType.DateTimeRange ? 
      PickerViewType.DateTime : PickerViewType.Date;

    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value: { from?: Date; to?: Date }) => {
        this.from = value?.from;
        this.to = value?.to;

        if(!this.initialized) {
          this.initialized = true;
          if(this.item.primary) {
            this.autofocusName = null;
          } else {
            this.autofocusName = this.from ? 'to' : 'from';
          }
          console.log('[DateRangeComponent] initialized, autofocusName:', this.autofocusName);
        }

        this._cdRef.markForCheck();
      });
  }
  
  public ngOnDestroy(): void {
    console.log('[DateRangeComponent] ngOnDestroy', this.item.name, {
      fromDialogOpen: !!this._fromPicker?.dateDialogRef,
      toDialogOpen: !!this._toPicker?.dateDialogRef,
    });
    
    // Close any open datepicker dialogs to prevent overlay leaks.
    // RangePickerComponent.ngOnDestroy() does not call close() (unlike
    // FsDatePickerBaseComponent), so the calendar overlay stays in the DOM
    // if we don't clean it up here.
    this._fromPicker?.dateDialogRef?.close();
    this._toPicker?.dateDialogRef?.close();

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
