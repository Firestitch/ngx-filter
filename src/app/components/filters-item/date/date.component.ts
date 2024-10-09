import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';

import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { ItemType } from '../../../enums/item-type.enum';
import { PickerViewType } from '../../../enums/picker-view-type.enum';
import { DateItem } from '../../../models/items/date-item';
import { DateTimeItem } from '../../../models/items/date-time-item';
import { BaseDateItem } from '../../../models/items/date/base-date-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent extends BaseItemComponent<DateItem | DateTimeItem> implements OnInit {

  public viewType = PickerViewType.Date;

  public itemDateMode = ItemDateMode;
  public showYear = true;
  public showMonth = true;
  public showDay = true;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {
    this.viewType = this.item.type === ItemType.DateTime ? PickerViewType.DateTime : PickerViewType.Date;

    if ((this.item as BaseDateItem).mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }
  }
}
