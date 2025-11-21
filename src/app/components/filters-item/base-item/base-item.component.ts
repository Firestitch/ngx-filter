import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


import { OverlayRef } from '@angular/cdk/overlay';

import { IFilterConfigItem } from '../../../interfaces/config.interface';
import { BaseItem } from '../../../models/items/base-item';


@Component({
  selector: 'base-item',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BaseItemComponent<T extends BaseItem<IFilterConfigItem>> {

  @Input() public item: T;
  @Input() public overlayRef: OverlayRef;

  public close() {
    if(this.overlayRef) {
      this.overlayRef.detachBackdrop();
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }

}
