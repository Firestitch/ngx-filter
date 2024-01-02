import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';

import { MultipleSelectItem } from '../../../../models/items/select/multiple-select-item';


@Component({
  selector: 'filter-item-select-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent {

  @Input()
  public item: MultipleSelectItem;

  @ViewChild('select', { static: true })
  public select: MatSelect;

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

  public close() {
    this.select.close();
  }

  public isolateChange(filter) {
    if (filter.isolate.enabled) {
      filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
    } else {
      if (filter.multiple) {
        filter.model = filter.defaultValue ? filter.defaultValue : [];
      } else {
        filter.model = filter.defaultValue ? filter.defaultValue : null;
      }
    }
  }
}
