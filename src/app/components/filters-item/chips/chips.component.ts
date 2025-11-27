import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsChipModule } from '@firestitch/chip';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';


import { ChipsItem } from '../../../models/items/chips-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    FsChipModule,
    FormsModule,
    FsFormModule,
    AsyncPipe,
  ],
})
export class ChipsComponent extends BaseItemComponent<ChipsItem> implements OnDestroy {

  public ngOnDestroy(): void {
    this.item.value = this.value;
  }

  public compareFn = (modelValue, chipValue) => {
    return String(modelValue.value) === String(chipValue.value);
  };
}
