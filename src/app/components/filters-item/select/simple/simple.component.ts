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

  @ViewChild('select', { static: true }) 
  public select: MatSelect;

  constructor(public cd: ChangeDetectorRef) {}

  public changed() {
    if (this.item.isolate) {
      this.item.isolate.enabled = false;
    }
  }

  public isolateChange(filter) {
    filter.model = filter.isolate.enabled ? filter.isolate.value : null;
  }
}
