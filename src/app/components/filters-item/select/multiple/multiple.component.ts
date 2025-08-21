import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

import { MatSelect } from '@angular/material/select';

import { MultipleSelectItem } from '../../../../models/items/select/multiple-select-item';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { FocusToItemDirective } from '../../../../directives/focus-to-item/focus-to-item.directive';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { FsFilterIsolateValues } from '../../../../pipes/remove-isolate-value.pipe';


@Component({
    selector: 'filter-item-select-multiple',
    templateUrl: './multiple.component.html',
    styleUrls: ['./multiple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        NgClass,
        MatLabel,
        MatSelect,
        FocusToItemDirective,
        FormsModule,
        FsFormModule,
        MatOption,
        MatHint,
        MatCheckbox,
        FsFilterIsolateValues,
    ],
})
export class SelectMultipleComponent {

  @Input()
  public item: MultipleSelectItem;

  @ViewChild('select', { static: true })
  public select: MatSelect;

  constructor(
    private _cd: ChangeDetectorRef,
  ) {}

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

  public markForCheck() {
    this._cd.markForCheck();
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
