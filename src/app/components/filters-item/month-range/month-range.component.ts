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
  FsDatePickerModule,
  MonthRangePickerFromComponent,
  MonthRangePickerToComponent,
} from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { MonthRangeItem } from '../../../models/items/month-range-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-month-range',
  templateUrl: './month-range.component.html',
  styleUrls: ['./month-range.component.scss'],
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
export class MonthRangeComponent
  extends BaseItemComponent<MonthRangeItem> implements OnInit, OnDestroy {

  @Input() public autofocusName: string;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';

  public from: Date;
  public to: Date;
  public initialized = false;


  @ViewChild(MonthRangePickerFromComponent)
  private _fromPicker: MonthRangePickerFromComponent;

  @ViewChild(MonthRangePickerToComponent)
  private _toPicker: MonthRangePickerToComponent;

  public ngOnInit() {
    super.ngOnInit();

    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value: { from?: Date; to?: Date }) => {
        this.from = value?.from;
        this.to = value?.to;

        if(!this.initialized) {
          this.initialized = true;
          this.autofocusName = this.item.primary ? null : 'from';
        }

        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
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
