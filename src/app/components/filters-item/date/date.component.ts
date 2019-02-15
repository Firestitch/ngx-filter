import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-date',
  templateUrl: './date.component.html'
})
export class DateComponent extends BaseItemComponent {
  constructor() {
    super();
  }
}
