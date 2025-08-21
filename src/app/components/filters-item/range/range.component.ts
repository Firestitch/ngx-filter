import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  KeyValueDiffers, OnInit, ViewChild,
} from '@angular/core';

import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { RangeItem } from '../../../models/items/range-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-range',
    templateUrl: './range.component.html',
    styleUrls: ['./range.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatPrefix,
        MatInput,
        FormsModule,
        FocusToItemDirective,
        FsFormModule,
        MatSuffix,
    ],
})
export class RangeComponent extends BaseItemComponent<RangeItem> implements OnInit {

  @ViewChild('from', { static: true })
  public from: ElementRef;

  @ViewChild('to', { static: true })
  public to;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit(): void {
    this.listenChanges();
  }

  public listenChanges() {
    const fromListener = fromEvent(this.from.nativeElement, 'keyup')
      .pipe(
        distinctUntilChanged(),
      );

    const toListener = fromEvent(this.to.nativeElement, 'keyup')
      .pipe(
        distinctUntilChanged(),
      );

    merge(fromListener, toListener)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.itemChange();
      });
  }
}
