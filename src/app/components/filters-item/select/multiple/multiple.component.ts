import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'filter-item-select-multiple',
  templateUrl: './multiple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent {

  @Input() public item;
  @Output() public change = new EventEmitter();

  constructor(public cd: ChangeDetectorRef) {}

  public changed(opened) {
    if (!opened) {
      this.change.emit(this.item.tmpModel);
    }
  }
}
