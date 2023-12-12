import { Inject, Injectable, Injector, OnDestroy } from '@angular/core';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FilterDrawerComponent } from '../components/filter-drawer/filter-drawer.component';
import { FilterComponent } from '../components/filter/filter.component';
import { FILTER_DRAWER_DATA } from '../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../injectors/filter-drawer-overlay';
import { FS_FILTER_META, FsFilterMeta } from '../providers/filter-meta';

import { FocusControllerService } from './focus-controller.service';


@Injectable()
export class FsFilterOverlayService implements OnDestroy {

  public detach$ = new Subject();
  public attach$ = new Subject();
  public filter: FilterComponent;

  private _clearFn: Function;
  private _doneFn: Function;

  private _destroy$ = new Subject();
  private _overlayRef: OverlayRef;

  constructor(
    @Inject(FS_FILTER_META) private _filterMeta: FsFilterMeta,
    private _injector: Injector,
    private _overlay: Overlay,
    private _focusController: FocusControllerService,
  ) {
    this._openWhenChipClicked();
  }

  public get isOpened() {
    return !!this._overlayRef;
  }

  public setClearFn(fn: Function) {
    this._clearFn = fn;
  }

  public setDoneFn(fn: Function) {
    this._doneFn = fn;
  }

  public close() {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef = null;

      this._removeFilterClass();
    }
  }

  public open() {
    this._overlayRef = this._createOverlay();

    this._overlayRef.backdropClick()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._overlayRef.detach();
      });

    this._overlayRef.detachments()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.detach$.next();
      });

    this._overlayRef.attachments()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.attach$.next();
      });

    this._addFilterClass();

    return this._openPortalPreview();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'fs-filter-backdrop',
    });

    return this._overlay.create(overlayConfig);
  }

  private _openPortalPreview() {
    const data = {
      done: this._doneFn,
      clear: this._clearFn,
      filter: this.filter,
    };
    const injector = this._createInjector(this._injector, data, this._overlayRef);
    const containerPortal = new ComponentPortal(FilterDrawerComponent, undefined, injector);
    const containerRef = this._overlayRef.attach<FilterDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(parentInjector, data, overlayRef) {
    const injectionTokens = new WeakMap<any, any>([
      [FILTER_DRAWER_DATA, data],
      [FILTER_DRAWER_OVERLAY, overlayRef],
    ]);

    return new PortalInjector(parentInjector, injectionTokens);
  }

  private _removeFilterClass() {
    this._filterMeta.openedFilters--;

    if (this._filterMeta.openedFilters === 0) {
      window.document.body.classList.remove('fs-filter-open');
    }
  }

  private _addFilterClass() {
    this._filterMeta.openedFilters++;

    if (this._filterMeta.openedFilters === 1) {
      window.document.body.classList.add('fs-filter-open');
    }
  }

  private _openWhenChipClicked(): void {
    this._focusController.focusOn$
      .pipe(
        filter((v) => !!v),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        if (!this.isOpened) {
          this.open();
        }
      });
  }
}
