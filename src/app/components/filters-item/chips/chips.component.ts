import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';

import { ChipsItem } from '../../../models/items/chips-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { FsLabelModule } from '@firestitch/label';
import { FsChipModule } from '@firestitch/chip';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';


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
    ],
})
export class ChipsComponent extends BaseItemComponent<ChipsItem> {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public compareFn = (modelValue, chipValue) => {
    return String(modelValue.value) === String(chipValue.value);
  };
}
