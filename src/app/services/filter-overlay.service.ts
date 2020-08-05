import { Inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FILTER_DRAWER_DATA } from '../injectors/filter-drawer-data';
import { FilterDrawerComponent } from '../components/filter-drawer/filter-drawer.component';
import { FILTER_DRAWER_OVERLAY } from '../injectors/filter-drawer-overlay';
import { FS_FILTER_META, FsFilterMeta } from '../providers/filter-meta';


@Injectable()
export class FsFilterOverlayService implements OnDestroy {

  public detach$ = new Subject();
  public attach$ = new Subject();

  private _destroy$ = new Subject();
  private _overlayRef: OverlayRef;

  constructor(
    @Inject(FS_FILTER_META) private _filterMeta: FsFilterMeta,
    private _overlay: Overlay
  ) {

    // this.detach$
    // .pipe(
    //   takeUntil(this._destroy$)
    // )
    // .subscribe(() => {
    //   this.detach();
    // });
    //
    // this.attach$
    // .pipe(
    //   takeUntil(this._destroy$)
    // )
    // .subscribe(() => {
    //   this.attach();
    // });
  }

  private removeFilterClass() {
    this._filterMeta.openedFilters--;

    if (this._filterMeta.openedFilters === 0) {
      window.document.body.classList.remove('fs-filter-open');
    }
  }

  private addFilterClass() {
    this._filterMeta.openedFilters++;

    if (this._filterMeta.openedFilters === 1) {
      window.document.body.classList.add('fs-filter-open');
    }
  }

  public close() {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef = null;

      this.removeFilterClass();
    }
  }

  public open(injector: Injector, data: any) {

    this._overlayRef = this._createOverlay();

    this._overlayRef.backdropClick()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this._overlayRef.detach();
    });

    this._overlayRef.detachments()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this.detach$.next();
    });

    this._overlayRef.attachments()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this.attach$.next();
    });

    this.addFilterClass();

    return this.openPortalPreview(injector, this._overlayRef, data);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'fs-filter-backdrop'
    });

    return this._overlay.create(overlayConfig);
  }

  private openPortalPreview(
    parentInjector: Injector,
    overlayRef: OverlayRef,
    data: any,
  ) {
    const injector = this._createInjector(parentInjector, data, overlayRef);
    const containerPortal = new ComponentPortal(FilterDrawerComponent, undefined, injector);
    const containerRef = overlayRef.attach<FilterDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(parentInjector, data, overlayRef) {
    const injectionTokens = new WeakMap<any, any>([
      [FILTER_DRAWER_DATA, data],
      [FILTER_DRAWER_OVERLAY, overlayRef],
    ]);

    return new PortalInjector(parentInjector, injectionTokens);
  }
}
