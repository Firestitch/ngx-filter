import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'filters-list',
  templateUrl: './filters-list.component.html'
})
export class FiltersListComponent {
  @Input() public items = [];
  @Input() public showSortBy;
  @Input() public sortBy = null;
  @Input() public sortDirection = null;
  @Input() public inline = false;

  @Output() public filterChanged = new EventEmitter();
  @Output() public search = new EventEmitter();
  @Output() public clear = new EventEmitter();
  // @Output() public cancel = new EventEmitter();

  public doSearch() {
    this.search.next();
  }

  public clearAll() {
    this.clear.next();
  }

  // public doCancel() {
  //   this.cancel.next();
  // }

  public filterChange(event) {
    this.filterChanged.next(event);
  }
}
