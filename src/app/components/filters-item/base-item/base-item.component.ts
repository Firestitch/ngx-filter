import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers, OnChanges, OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseItem } from '../../../models/items/base-item';
import { IFilterConfigItem } from '../../../interfaces/config.interface';


@Component({
  selector: 'base-item',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseItemComponent<T extends BaseItem<IFilterConfigItem>> implements DoCheck, OnChanges, OnDestroy {

  @Input()
  set item(value: T) {
    this._item = value;
  };

  @Input()
  public inline = false;

  public label!: string;

  protected _item: T;
  protected _kvDiffer: KeyValueDiffer<string, any>;
  protected _destroy$ = new Subject();

  private _debouncer$ = new Subject();

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    this._kvDiffer = this._kvDiffers.find(this.item || {}).create();
    this.listenWithDebounce();
  }

  get item(): T {
    return this._item
  }

  public ngDoCheck(): void {
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        this._cd.detectChanges();
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      if (Array.isArray(this.item.label)) {
        this.label = this.item.label[0];
      } else {
        this.label = this.item.label;
      }
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public listenWithDebounce() {
    this._debouncer$
      .pipe(
        debounceTime(150),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.item.valueChanged();
      })
  }

  public itemChange() {
    this._debouncer$.next();
  }
}
