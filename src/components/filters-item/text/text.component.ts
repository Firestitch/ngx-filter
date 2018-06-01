import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html'
})
export class TextComponent extends BaseItemComponent {

  constructor() {
    super();
  }

}
