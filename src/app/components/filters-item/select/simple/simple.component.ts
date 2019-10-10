import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'filter-item-select-simple',
  templateUrl: './simple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSimpleComponent {

  @ViewChild('select', { static: true }) select: MatSelect;
  @Input() public item;
  @Output() public change = new EventEmitter();

  constructor(public cd: ChangeDetectorRef) {}

  public changed($event) {
    this.change.emit($event);
  }
}
