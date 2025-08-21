import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

import { MatSelect } from '@angular/material/select';

import { SimpleSelectItem } from '../../../../models/items/select/simple-select-item';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { FocusToItemDirective } from '../../../../directives/focus-to-item/focus-to-item.directive';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { FsFilterIsolateValues } from '../../../../pipes/remove-isolate-value.pipe';


@Component({
    selector: 'filter-item-select-simple',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.scss'],
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
        MatCheckbox,
        FsFilterIsolateValues,
    ],
})
export class SelectSimpleComponent {

  @Input() public item: SimpleSelectItem;

  @ViewChild('select', { static: true }) 
  public select: MatSelect;

  constructor(
    private _cd: ChangeDetectorRef,
  ) {}

  public changed() {
    if (this.item.isolate) {
      this.item.isolate.enabled = false;
    }
  }

  public isolateChange(filter) {
    filter.model = filter.isolate.enabled ? filter.isolate.value : null;
  }

  public markForCheck() {
    this._cd.markForCheck();
  }
}
