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

import { FsFormModule } from '@firestitch/form';


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
export class RangeComponent extends BaseItemComponent<RangeItem> implements OnInit, OnDestroy {

  @Input() public autofocusName: string;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  public min: number;
  public max: number;

  public ngOnInit(): void {
    this.min = this.item.value?.min;
    this.max = this.item.value?.max;
  }

  public ngOnDestroy(): void {
    this.item.value = {
      min: this.min,
      max: this.max,
    };
  }
}
