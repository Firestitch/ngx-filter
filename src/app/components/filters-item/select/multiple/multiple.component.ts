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
  selector: 'filter-item-select-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent {

  @ViewChild('select') select: MatSelect;
  @Input() public item;
  @Output() public change = new EventEmitter();

  constructor(public cd: ChangeDetectorRef) {}

  public changed() {

    if (this.item.isolate) {

      this.item.isolate.enabled = false;

      if (this.item.multiple && Array.isArray(this.item.model)) {
        const index = this.item.model.indexOf(this.item.isolate.value);

        if (index > -1) {
          this.item.model.splice(index, 1);
        }
      }
    }
  }

  public isolateChange(filter) {

    if (filter.isolate.enabled) {
      filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
    } else {
      filter.model = filter.multiple ? [] : null;
    }

    this.change.next(filter);
  }
}
