import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';


import { debounceTime, Subject, takeUntil } from 'rxjs';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { RangeItem } from '../../../models/items/range-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatPrefix,
    MatInput,
    FormsModule,
    FocusToItemDirective,
    FsFormModule,
    MatSuffix,
  ],
})
export class RangeComponent extends BaseItemComponent<RangeItem> implements OnInit {

  @Input() public name: string;

  public min: number;
  public max: number;

  private _change$ = new Subject<void>();
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.min = this.item.value?.min;
    this.max = this.item.value?.max;

    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.min = value?.min;
        this.max = value?.max;
        this._cdRef.detectChanges();
      });

    this._change$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.item.value = {
          min: this.min,
          max: this.max,
        };
      });
  }

  public change() {
    this._change$.next();
  }
}
