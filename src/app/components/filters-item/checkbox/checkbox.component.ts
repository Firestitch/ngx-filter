import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers
} from '@angular/core';

import { BaseItemComponent } from '../base-item/base-item.component';
import { CheckboxItem } from '../../../models/items/checkbox-item';


@Component({
  selector: 'filter-item-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends BaseItemComponent<CheckboxItem> {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }
}
