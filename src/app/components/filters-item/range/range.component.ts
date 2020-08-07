import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  KeyValueDiffers, OnInit, ViewChild
} from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { BaseItemComponent } from '../base-item/base-item.component';
import { RangeItem } from '../../../models/items/range-item';


@Component({
  selector: 'filter-item-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeComponent extends BaseItemComponent<RangeItem> implements OnInit {

  @ViewChild('from', { static: true })
  public from: ElementRef;

  @ViewChild('to', { static: true })
  public to;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit(): void {
    this.listenChanges();
  }

  public listenChanges() {
    const fromListener = fromEvent(this.from.nativeElement, 'keyup')
      .pipe(
        distinctUntilChanged()
      );

    const toListener = fromEvent(this.to.nativeElement, 'keyup')
      .pipe(
        distinctUntilChanged()
      );

    merge(fromListener, toListener)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.itemChange();
      })
  }
}
