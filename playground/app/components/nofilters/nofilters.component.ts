import { Component, EventEmitter } from '@angular/core';
@Component({
  templateUrl: 'nofilters.component.html'
})
export class NofiltersComponent {


  public conf: any;
  public sortUpdated = new EventEmitter();
  public query = null;

  public users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Bob Tom' }
    ];

  constructor() {
    this.conf = {
     
    };
  }
}
