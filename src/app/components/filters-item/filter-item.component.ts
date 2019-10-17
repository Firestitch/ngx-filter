import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { FsFilterConfigItem } from '../../models/filter-item';
import { ItemType } from '../../enums/item-type.enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterItemComponent implements OnInit, OnDestroy {

  @Input() public item: FsFilterConfigItem;
  @Output() public itemChanged = new EventEmitter();

  private _destroy$ = new Subject<void>();

  constructor(private _cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.item.valueChanged$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public itemType = ItemType;

  public itemChange(event) {
    this.itemChanged.next(event);
  }
}
