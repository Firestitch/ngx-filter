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
import { FsFilterConfigItem } from '../../../models/filter-item';


@Component({
  selector: 'filter-item-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent extends BaseItemComponent implements OnInit {

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

    if (this.item.mode === ItemDateMode.ScrollMonthYear) {
      this.showDay = false;
    }
  }
}
