import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends BaseItemComponent {

  // For case when we have multiple selection with __all option
  // If _all has been selected than we must disable all other items
  public allItemsOptionSelected = false;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public selectChange() {
    if (this.item.isolate) {

      this.item.isolate.enabled = false;

      if (this.item.multiple && Array.isArray(this.item.tmpModel)) {
        const index = this.item.tmpModel.indexOf(this.item.isolate.value);

        if (index > -1) {
          this.item.tmpModel.splice(index, 1);
        }
      }
    }

    this.itemChange();
  }

  public selectItem() {
    const allKeyPosition = this.item.tmpModel.indexOf('__all');

    if (
      Array.isArray(this.item.tmpModel)
      && allKeyPosition > -1
    ) {
      if (this.allItemsOptionSelected) {
        this.item.tmpModel.splice(allKeyPosition, 1);
        this.item.tmpModel = this.item.tmpModel.slice();
        this.allItemsOptionSelected = false;
      } else {
        this.item.tmpModel = ['__all'];
        this.allItemsOptionSelected = true;
      }
    }
  }
}
