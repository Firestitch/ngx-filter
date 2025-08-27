import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsChipModule } from '@firestitch/chip';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ChipsItem } from '../../../models/items/chips-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    FsChipModule,
    FormsModule,
    FsFormModule,
    AsyncPipe,
  ],
})
export class ChipsComponent extends BaseItemComponent<ChipsItem> implements OnInit {

  public value: any;

  private _destroyRef = inject(DestroyRef);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });
  }

  public compareFn = (modelValue, chipValue) => {
    return String(modelValue.value) === String(chipValue.value);
  };
}
