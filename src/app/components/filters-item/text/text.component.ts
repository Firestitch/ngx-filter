import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

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
export class TextComponent extends BaseItemComponent<TextItem> implements OnInit, OnDestroy {

  public textControl = new FormControl();
  public destroy$ = new Subject();

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit(): void {
    this.textControl.setValue(this.item.model);

    this.textControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.item.model = value;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
