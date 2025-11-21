import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { FsFormModule } from '@firestitch/form';


import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { SelectItem } from '../../../models/items/select-item';
import { BaseItemComponent } from '../base-item';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
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
    MatOptgroup,
    MatCheckbox,
    AsyncPipe,  
  ],
})
export class SelectComponent extends BaseItemComponent<SelectItem> implements OnInit, OnDestroy {

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';

  @ViewChild(MatSelect, { static: true })
  public select: MatSelect;

  public value: any;

  private _cdRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);

  public changed() {
    if(!this.item.multiple) {
      this.change();
    }
  }

  public selectOpenedChange(opened: boolean) {
    if(!opened && !this.item.isolate) {
      this.close();
    }
  }

  public change() {
    let value = this.value;
    if(this.item.isolate) {
      if(this.item.multiple) {
        value = value.filter((v) => {
          return !this.item.isolateValues.includes(v.value as never);
        });
      }

      this.item.isolated = false;
    }

    this.item.value = value;
  }

  public ngOnDestroy(): void {
    if(this.item.isolate) {
      this.change();
    }
  }

  public ngOnInit(): void {
    this.value = this.item.value;
    if(this.item.isolate && !this.item.hasValue) {
      this.item.isolated = false;
    }
  }

  public markForCheck() {
    this._cdRef.markForCheck();
  }

  public isolateChange(event: MatCheckboxChange) {
    if(event.checked) {
      this.value = this.item.multiple ? this.item.isolateValues : this.item.isolateValues[0];
    } else {
      this.value = this.item.multiple ? [] : null;
    }
  }
}
