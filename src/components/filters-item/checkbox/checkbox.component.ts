import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-checkbox',
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent extends BaseItemComponent {

  constructor() {
    super();
  }

  public onFilterChange() {

  }
}
