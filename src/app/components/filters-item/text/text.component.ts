import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';

import { BaseItemComponent } from '../base-item/base-item.component';
import { TextItem } from '../../../models/items/text-item';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends BaseItemComponent<TextItem> implements OnDestroy {

  public inputChange$ = new Subject();
  public destroy$ = new Subject();

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);

    this.inputChange$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.item.valueChanged();
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
