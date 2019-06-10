import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnDestroy
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends BaseItemComponent implements OnDestroy {

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
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.itemChange();
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
