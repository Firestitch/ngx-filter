import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'filter-item-select-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupsComponent {

  @Input() public item;
  @Output() public change = new EventEmitter();

  public changed($event) {
    this.change.emit($event);
  }
}
