import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';


import { OverlayRef } from '@angular/cdk/overlay';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FILTER_DRAWER_DATA } from '../../../injectors/filter-drawer-data';
import { IFilterConfigItem } from '../../../interfaces/config.interface';
import { BaseItem } from '../../../models/items/base-item';


@Component({
  selector: 'base-item',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BaseItemComponent<T extends BaseItem<IFilterConfigItem>> implements OnInit {


  @Input() public item: T;
  @Input() public overlayRef: OverlayRef;
  @Input() public triggerChangeOn: 'close' | 'change' = 'close';

  public value: any;
  public disabled = false;

  protected _destroyRef = inject(DestroyRef);
  protected _cdRef = inject(ChangeDetectorRef);

  // The chip popup this field sits in; null in the filter bar.
  private _popup = inject(FILTER_DRAWER_DATA, { optional: true });

  // True once the popup is closed with Escape. The popup puts the item back as it found it,
  // so whatever the field still holds as it goes away is dropped, not applied.
  protected get _canceled(): boolean {
    return !!this._popup?.canceled();
  }

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });

    this.item.disabled$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((disabled) => {
        this.disabled = disabled;
        this._cdRef.detectChanges();
      });
  }
  
  public close() {
    if(this.overlayRef) {
      this.overlayRef.detachBackdrop();
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }

}
