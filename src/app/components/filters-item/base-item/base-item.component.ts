import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';


import { OverlayRef } from '@angular/cdk/overlay';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  protected _destroyRef = inject(DestroyRef);
  protected _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.value = value;
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
