import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { WeekItem } from '../../../models/items/week-item';


@Component({
  selector: 'filter-item-week',
  templateUrl: './week.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent extends BaseItemComponent<WeekItem> implements OnInit {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit() {}
}
