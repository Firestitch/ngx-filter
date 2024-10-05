import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';

import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { distinctUntilChanged, map, mapTo, startWith, take, takeUntil } from 'rxjs/operators';

import { IFilterConfigItem } from '../../interfaces/config.interface';
import { BaseItem } from '../../models/items/base-item';
import { DateRangeItem } from '../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';
import { RangeItem } from '../../models/items/range-item';
import { FocusControllerService } from '../../services/focus-controller.service';


@Component({
  selector: 'fs-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<IFilterConfigItem>;

  public itemVisible: boolean;
  public rangeItem: boolean;

  public chipDelayedRender$: Observable<boolean>;

  private _chipRenderTimer$ = timer(500)
    .pipe(
      mapTo(true),
    );

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
    this._updateVisibility();

    if (this.item.hasPendingValues) {
      this.item.loadAsyncValues(false);

      this.item.values$
        .pipe(
          take(2),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._updateVisibility();
          this._cdRef.markForCheck();
        });

      this._initDelayRender();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
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
        this._updateVisibility();
        this._cdRef.markForCheck();
      });
  }

  private _updateVisibility() {
    this.itemVisible = this.item.isChipVisible;
  }

  private _initDelayRender() {
    this.chipDelayedRender$ = combineLatest([
      this.item.values$,
      this._chipRenderTimer$.pipe(startWith(false)),
    ])
      .pipe(
        map(([values, timerValue]) => {
          return !!values || timerValue;
        }),
      );
  }
}
