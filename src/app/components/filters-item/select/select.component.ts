import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { FsFormModule } from '@firestitch/form';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { SelectItem } from '../../../models/items/select-item';


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
    MatHint,
    MatCheckbox,
    AsyncPipe,  
  ],
})
export class SelectComponent implements OnInit {

  @Input()
  public item: SelectItem;

  @ViewChild(MatSelect, { static: true })
  public select: MatSelect;

  public value: any;

  private _cdRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);

  public changed() {
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

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.value = value;

        if(this.item.isolate && !this.item.hasValue) {
          this.item.isolated = false;
        }

        this._cdRef.detectChanges();
      });
  }

  public close() {
    this.select.close();
  }

  public markForCheck() {
    this._cdRef.markForCheck();
  }

  public isolateChange(event: MatCheckboxChange) {
    if(event.checked) {
      this.item.value = this.item.multiple ? this.item.isolateValues : this.item.isolateValues[0];
    } else {
      this.item.value = this.item.multiple ? [] : null;
    }
  }
}
