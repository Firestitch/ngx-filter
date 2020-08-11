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


@Component({
  selector: 'fs-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipComponent implements OnInit, OnDestroy {
  @Input() public item: BaseItem<IFilterConfigItem>;

  private _destroy$ = new Subject();

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
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

  public removeItem(item, type = null) {
    this.item.clear();
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
