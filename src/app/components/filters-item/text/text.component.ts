import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { TextItem } from '../../../models/items/text-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends BaseItemComponent<TextItem> implements OnInit {

  public textControl = new UntypedFormControl();

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public ngOnInit(): void {
    this._listenControlValueChanges();
    this._listenModelChanges();
  }

  private _listenControlValueChanges(): void {
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

  private _listenModelChanges(): void {
    this._item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.textControl.setValue(this.item.model, { emitEvent: false });
      });
  }

}
