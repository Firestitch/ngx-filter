import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckbox } from '@angular/material/checkbox';

import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';

import { takeUntil } from 'rxjs/operators';

import { CheckboxItem } from '../../../models/items/checkbox-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    MatCheckbox,
    FormsModule,
    FsFormModule,
  ],
})
export class CheckboxComponent extends BaseItemComponent<CheckboxItem> implements OnInit {

  public value: boolean;

  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });
  }

  public change() {
    this.item.setValue(this.value);
  }
  
}
