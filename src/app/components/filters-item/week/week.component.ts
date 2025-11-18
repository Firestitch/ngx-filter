import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';

import { takeUntil } from 'rxjs/operators';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { WeekItem } from '../../../models/items/week-item';
import { BaseItemComponent } from '../base-item/base-item.component';


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

  @Input() public autofocus: boolean = false;

  public value: Date;

  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });
  }
}
