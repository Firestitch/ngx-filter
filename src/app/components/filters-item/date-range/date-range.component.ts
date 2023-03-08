import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers, OnInit
} from '@angular/core';

import { BaseItemComponent } from '../base-item/base-item.component';
import { ItemType } from '../../../enums/item-type.enum';
import { DateRangeItem } from '../../../models/items/date-range-item';
import { DateTimeRangeItem } from '../../../models/items/date-time-range-item';
import { PickerViewType } from '../../../enums/picker-view-type.enum';


@Component({
  selector: 'filter-item-date-range',
  templateUrl: './date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent extends BaseItemComponent<DateRangeItem | DateTimeRangeItem> implements OnInit {

  public viewType = PickerViewType.Date;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {
    if (this.item.type === ItemType.DateTimeRange) {
      this.viewType = PickerViewType.DateTime;
    } else {
      this.viewType = PickerViewType.Date;
    }
  }
}
