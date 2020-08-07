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
import { SimpleSelectItem } from '../../../../models/items/select/simple-select-item';


@Component({
  selector: 'filter-item-select-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSimpleComponent {

  @ViewChild('select', { static: true }) select: MatSelect;
  @Input() public item: SimpleSelectItem;
  @Output() public change = new EventEmitter();

  constructor(public cd: ChangeDetectorRef) {}

  public changed($event) {
    if (this.item.isolate) {
      this.item.isolate.enabled = false;
    }

    this.change.emit($event);
  }

  public isolateChange(filter) {

    if (filter.isolate.enabled) {
      filter.model = filter.isolate.value;
    } else {
      filter.model = null;
    }

    this.change.next(filter);
  }
}
