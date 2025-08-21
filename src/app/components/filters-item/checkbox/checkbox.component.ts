import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';


import { CheckboxItem } from '../../../models/items/checkbox-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { FsLabelModule } from '@firestitch/label';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsLabelModule,
        MatCheckbox,
        FormsModule,
        FsFormModule,
    ],
})
export class CheckboxComponent extends BaseItemComponent<CheckboxItem> {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }
  
}
