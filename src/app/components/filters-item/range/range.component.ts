import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsCommonModule } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    FsCommonModule,
  ],
})
export class RangeComponent extends BaseItemComponent<RangeItem> implements OnInit, OnDestroy {

  @Input() public autofocusName: string;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  public min: number;
  public max: number;

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.min = value?.min;
        this.max = value?.max;
        this._cdRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    if(this.triggerChangeOn === 'close') {
      this.item.value = {
        min: this.min,
        max: this.max,
      };
    }
  }

  public change() {
    if(this.triggerChangeOn === 'change') {
      this.item.value = {
        min: this.min,
        max: this.max,
      };
    }
  }

  public keyup(event: KeyboardEvent) {
    if(this.triggerChangeOn === 'close' && (event.key === 'Enter' || event.code === 'Tab')) {
      this.close();
    }
  }
}
