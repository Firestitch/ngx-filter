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


@Component({
  selector: 'filter-item-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent extends BaseItemComponent<DateItem | DateTimeItem> implements OnInit {

  public viewType = 'date';
  public itemDateMode = ItemDateMode;
  public showYear = true;
  public showMonth = true;
  public showDay = true;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {
    if (this.item.type === ItemType.DateTime) {
      this.viewType = 'datetime';
    } else {
      this.viewType = 'date'
    }

    if ((this.item as BaseDateItem).mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }
  }
}
