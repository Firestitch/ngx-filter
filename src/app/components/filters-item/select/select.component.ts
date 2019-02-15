import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html'
})
export class SelectComponent extends BaseItemComponent {

  // For case when we have multiple selection with __all option
  // If _all has been selected than we must disable all other items
  public allItemsOptionSelected = false;

  constructor() {
    super();
  }

  public selectChange() {
    if (this.item.isolate) {

      this.item.isolate.enabled = false;

      if (this.item.multiple && Array.isArray(this.item.model)) {
        const index = this.item.model.indexOf(this.item.isolate.value);

        if (index > -1) {
          this.item.model.splice(index, 1);
        }
      }
    }

    this.itemChange();
  }

  public selectItem() {
    const allKeyPosition = this.item.model.indexOf('__all');

    if (
      Array.isArray(this.item.model)
      && allKeyPosition > -1
    ) {
      if (this.allItemsOptionSelected) {
        this.item.model.splice(allKeyPosition, 1);
        this.item.model = this.item.model.slice();
        this.allItemsOptionSelected = false;
      } else {
        this.item.model = ['__all'];
        this.allItemsOptionSelected = true;
      }
    }
  }
}
