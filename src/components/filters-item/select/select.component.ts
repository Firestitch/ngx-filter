import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { list as arrayList } from '@firestitch/common/array';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html'
})
export class SelectComponent extends BaseItemComponent {

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

    // console.log('value', value)
  }
}
