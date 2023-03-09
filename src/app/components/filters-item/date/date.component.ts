import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { ItemType } from '../../../enums/item-type.enum';
import { ItemDateMode } from '../../../enums/item-date-mode.enum';
import { BaseDateItem } from '../../../models/items/date/base-date-item';
import { DateItem } from '../../../models/items/date-item';
import { DateTimeItem } from '../../../models/items/date-time-item';
import { PickerViewType } from '../../../enums/picker-view-type.enum';


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
  public maxDate = null;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {
    if (this.item.type === ItemType.DateTime) {
      this.viewType = PickerViewType.DateTime;
    } else {
      this.viewType = PickerViewType.Date;
    }

    if ((this.item as BaseDateItem).mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }

    if (this.item.maxYear) {
      this.maxDate = new Date(`12-15-${this.item.maxYear}`);      
    }
  }
}
