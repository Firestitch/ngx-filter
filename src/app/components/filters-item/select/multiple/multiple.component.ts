import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'filter-item-select-multiple',
  templateUrl: './multiple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent {

  @Input() public item;
  @Output() public change = new EventEmitter();

  public changed($event) {
    this.change.emit($event);
  }
}
