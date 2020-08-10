import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ItemType } from '../../enums/item-type.enum';
import { BaseItem } from '../../models/items/base-item';


@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterItemComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<any>;

  private _destroy$ = new Subject<void>();

  constructor(private _cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.item.value$
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
}
