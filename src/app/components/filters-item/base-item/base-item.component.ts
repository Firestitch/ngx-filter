import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  KeyValueDiffer,
  KeyValueDiffers, OnChanges, OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { IFilterConfigItem } from '../../../interfaces/config.interface';
import { BaseItem } from '../../../models/items/base-item';


@Component({
  selector: 'base-item',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BaseItemComponent<T extends BaseItem<IFilterConfigItem>>
implements OnChanges, OnDestroy {

  @Input() public item: T;

  @Input()
  public inline = false;

  public label!: string;

  protected _kvDiffer: KeyValueDiffer<string, any>;

  private _destroy$ = new Subject();

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
  }

  public get destroy$(): Observable<any> {
    return this._destroy$.asObservable();
  }

  public destroy() {
    return this._destroy$.asObservable();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.label = Array.isArray(this.item.label) ? this.item.label[0] : this.item.label;
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
