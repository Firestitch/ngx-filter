import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
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

  @Input() public item: SimpleSelectItem;

  @ViewChild('select', { static: true }) select: MatSelect;

  constructor(public cd: ChangeDetectorRef) {}

  public changed() {
    if (this.item.isolate) {
      this.item.isolate.enabled = false;
    }
  }

  public isolateChange(filter) {

    if (filter.isolate.enabled) {
      filter.model = filter.isolate.value;
    } else {
      filter.model = null;
    }
  }
}
