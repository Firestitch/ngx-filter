import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  KeyValueDiffers,
  Component,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { SelectSimpleComponent } from './simple/simple.component';
import { SelectMultipleComponent } from './multiple/multiple.component';
import { BaseSelectItem } from '../../../models/items/select/base-select-item';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends BaseItemComponent<BaseSelectItem> implements DoCheck {

  @ViewChild('selectItem', { static: false })
  public selectedItem: SelectSimpleComponent | SelectMultipleComponent;
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
    this.itemChange();
  }

  public ngDoCheck() {
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        this._cd.markForCheck();

        if (this.selectedItem) {
          this.selectedItem.cd.markForCheck();
        }
      }
    }
  }
}
