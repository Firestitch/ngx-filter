import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'filter-item-select-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupsComponent {

  @ViewChild('select') select: MatSelect;
  @Input() public item;
  @Output() public change = new EventEmitter();

  constructor(public cd: ChangeDetectorRef) {}

  public changed($event) {
    this.change.emit($event);
  }

  public compare(o1, o2) {
    return o1 == o2;
  }
}
