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
import { AutocompleteChipsItem } from '../../models/items/autocomplete-chips-item';
import { AutocompleteItem } from '../../models/items/autocomplete-item';
import { BaseItem } from '../../models/items/base-item';
import { CheckboxItem } from '../../models/items/checkbox-item';
import { ChipsItem } from '../../models/items/chips-item';
import { DateItem } from '../../models/items/date-item';
import { DateRangeItem } from '../../models/items/date-range-item';
import { DateTimeItem } from '../../models/items/date-time-item';
import { DateTimeRangeItem } from '../../models/items/date-time-range-item';
import { RangeItem } from '../../models/items/range-item';
import { BaseSelectItem } from '../../models/items/select/base-select-item';
import { TextItem } from '../../models/items/text-item';
import { WeekItem } from '../../models/items/week-item';


@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterItemComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<any>;

  public itemType = ItemType;

  public get textItem(): TextItem {
    return this.item as TextItem;
  }

  public get chipsItem(): ChipsItem {
    return this.item as ChipsItem;
  }

  public get baseSelectItem(): BaseSelectItem {
    return this.item as BaseSelectItem;
  }

  public get rangeItem(): RangeItem {
    return this.item as RangeItem;
  }

  public get autocompleteItem(): AutocompleteItem {
    return this.item as AutocompleteItem;
  }

  public get autocompleteChipsItem(): AutocompleteChipsItem {
    return this.item as AutocompleteChipsItem;
  }

  public get dateItem(): DateItem {
    return this.item as DateItem;
  }

  public get dateRangeItem(): DateRangeItem {
    return this.item as DateRangeItem;
  }

  public get dateTimeItem(): DateTimeItem {
    return this.item as DateTimeItem;
  }

  public get dateTimeRangeItem(): DateTimeRangeItem {
    return this.item as DateTimeRangeItem;
  }

  public get weekItem(): WeekItem {
    return this.item as WeekItem;
  }

  public get checkboxItem(): CheckboxItem {
    return this.item as CheckboxItem;
  }

  private _destroy$ = new Subject<void>();

  constructor(private _cdRef: ChangeDetectorRef) { }

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

}
