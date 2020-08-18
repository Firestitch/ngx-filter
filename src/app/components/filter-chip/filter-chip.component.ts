import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { BaseItem } from '../../models/items/base-item';
import { IFilterConfigItem } from '../../interfaces/config.interface';
import { RangeItem } from '../../models/items/range-item';
import { DateRangeItem } from '../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';
import { FocusControllerService } from '../../services/focus-controller.service';


@Component({
  selector: 'fs-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<IFilterConfigItem>;

  public rangeItem: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _focusController: FocusControllerService,
  ) {
  }

  public ngOnInit() {
    this.rangeItem = this.item.isTypeDateRange
      || this.item.isTypeRange
      || this.item.isTypeDateTimeRange;

    this.listenValueChangesForRanges();

    if (this.item.hasPendingValues) {
      this.item.loadAsyncValues(false);

      this.item.values$
        .pipe(
          take(2),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._cdRef.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public focusOnItem(type = null) {
    this._focusController.click(this.item, type);
  }

  public removeItem(event: MouseEvent, type = null) {
    if (this.item instanceof RangeItem) {
      this.item.clearRange(type);
    } else if (this.item instanceof DateRangeItem || this.item instanceof DateTimeRangeItem) {
      this.item.clearDateRange(type);
    } else {
      this.item.clear();
    }
  }

  public listenValueChangesForRanges() {
    this.item.value$
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }
}
