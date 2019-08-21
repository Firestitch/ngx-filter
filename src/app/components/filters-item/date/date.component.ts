import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { ItemType } from '../../../enums/item-type-enum';


@Component({
  selector: 'filter-item-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent extends BaseItemComponent implements OnInit {

  public viewType = 'date';

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
  }
}
