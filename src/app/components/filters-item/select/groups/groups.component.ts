import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'filter-item-select-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupsComponent {

  @ViewChild('select', { static: true }) select: MatSelect;
  @Input() public item;

  constructor(public cd: ChangeDetectorRef) {}

  public compare(o1, o2) {
    return o1 == o2;
  }
}
