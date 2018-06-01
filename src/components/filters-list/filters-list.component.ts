import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'filters-list',
  templateUrl: './filters-list.component.html'
})
export class FiltersListComponent {
  @Input() public items = [];
  @Input() public inline = false;

  @Output() public filterChanged = new EventEmitter();
  @Output() public search = new EventEmitter();
  @Output() public cancel = new EventEmitter();

  public doSearch() {
    this.search.next();
  }

  public doCancel() {
    this.cancel.next();
  }

  public filterChange(event) {
    this.filterChanged.next(event);
  }
}
