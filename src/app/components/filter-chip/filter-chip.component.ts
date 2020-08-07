import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output
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

  @Output() public remove = new EventEmitter<{ item: BaseItem<IFilterConfigItem>, type: string }>();

  private _destroy$ = new Subject();

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.listenValueChangesForRanges();

    if (this.item.hasPendingValues) {
      this.item.loadValues(false);

      this.item.values$
        .pipe(
          take(1),
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
    // this.remove.next({ item: item, type: type });
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
