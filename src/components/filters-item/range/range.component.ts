import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-range',
  templateUrl: './range.component.html'
})
export class RangeComponent extends BaseItemComponent {

  constructor() {
    super();
  }
}
