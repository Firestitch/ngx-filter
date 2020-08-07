import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseItem } from '../../models/items/base-item';
import { DateRangeItem } from '../../models/items/date-range-item';
import { RangeItem } from '../../models/items/range-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';

type Item = DateRangeItem | RangeItem | DateTimeRangeItem | BaseItem<any>;

@Component({
  selector: 'fs-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipComponent implements OnInit, OnDestroy {
  @Input() public item: Item;

  @Output() public remove = new EventEmitter<{ item: Item, type: string }>();

  private _destroy$ = new Subject();

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.listenValueChangesForRanges();

    if (this.item.hasPendingValues) {
      this.item.values$
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
        this._cdRef.markForCheck();
      })
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public removeItem(item, type = null) {
    this.remove.next({ item: item, type: type });
  }

  public listenValueChangesForRanges() {
    this.item.valueChanged$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }
}
