import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends BaseItemComponent {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

}
