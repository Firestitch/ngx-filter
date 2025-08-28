import { JsonPipe } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';

import { FilterComponent } from '../../../../src/app/components/filter/filter.component';
@Component({
  templateUrl: 'nofilters.component.html',
  standalone: true,
  imports: [FilterComponent, JsonPipe],
})
export class NofiltersComponent {


  public conf: any;
  public sortUpdated = new EventEmitter();
  public query = null;

  public users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Sam Smith' },
  ];

  constructor() {
    this.conf = {
     
    };
  }
}
