import { EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { FILTER_DRAWER_DATA } from '../injectors/filter-drawer-data';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { FilterDrawerComponent } from '../components/filter-drawer/filter-drawer.component';

@Injectable()
export class FsFilterOverlayService {
  constructor(private _overlay: Overlay) {
  }

  public open(injector: Injector, data: any) {
    const overlayRef = this._createOverlay();

    return this.openPortalPreview(injector, overlayRef, data);
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private openPortalPreview(
    parentInjector: Injector,
    overlayRef: OverlayRef,
    data: any,
  ) {
    const injector = this._createInjector(parentInjector, data);
    const containerPortal = new ComponentPortal(FilterDrawerComponent, undefined, injector);
    const containerRef = overlayRef.attach<FilterDrawerComponent>(containerPortal);

    return containerRef.instance;
  }


  private _createInjector(parentInjector, data) {
    const injectionTokens = new WeakMap<any, any>([
      [FILTER_DRAWER_DATA, data]
    ]);

    return new PortalInjector(parentInjector, injectionTokens);
  }
}
