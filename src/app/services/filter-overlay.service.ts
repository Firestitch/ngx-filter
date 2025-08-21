import { inject, Injectable, Injector, OnDestroy, StaticProvider } from '@angular/core';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { HtmlClassRenderer } from '@firestitch/html';

import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FilterDrawerComponent } from '../components/filter-drawer/filter-drawer.component';
import { FILTER_DRAWER_DATA } from '../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../injectors/filter-drawer-overlay';
import { FS_FILTER_META } from '../providers/filter-meta';

import { FocusControllerService } from './focus-controller.service';


@Injectable()
export class FsFilterOverlayService implements OnDestroy {

  private _detach$ = new Subject<void>();
  private _attach$ = new Subject<void>();
  private _clearFn: () => void;
  private _doneFn: () => void;

  private _destroy$ = new Subject();
  private _overlayRef: OverlayRef;
  private _injector = inject(Injector);
  private _overlay = inject(Overlay);
  private _focusController = inject(FocusControllerService);
  private _htmlClassRenderer = inject(HtmlClassRenderer);
  private _filterMeta = inject(FS_FILTER_META);

  constructor() {
    this._openWhenChipClicked();
  }

  public get detach$(): Observable<void> {
    return this._detach$.asObservable();
  }

  public get attach$(): Observable<void> {
    return this._attach$.asObservable();
  }

  public get isOpened() {
    return !!this._overlayRef;
  }

  public setClearFn(fn: () => void) {
    this._clearFn = fn;
  }

  public setDoneFn(fn: () => void) {
    this._doneFn = fn;
  }

  public close() {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._removeFilterClass();
    } 
  }

  public open() {
    if (this._overlayRef) {
      return;
    }

    this._overlayRef = this._createOverlay();
    this._overlayRef.detachments()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._detach$.next(null);
        this._overlayRef = null;
      });

    this._overlayRef.attachments()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._attach$.next(null);
      });

    this._addFilterClass();

    return this._openPortalPreview();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
    });

    return this._overlay.create(overlayConfig);
  }

  private _openPortalPreview() {
    const data = {
      done: this._doneFn,
      clear: this._clearFn,
    };
    const injector = this._createInjector(this._injector, data, this._overlayRef);
    const containerPortal = new ComponentPortal(FilterDrawerComponent, undefined, injector);
    const containerRef = this._overlayRef.attach<FilterDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(parentInjector: Injector, data: any, overlayRef: any): Injector {
    const providers: StaticProvider[] = [
      { provide: FILTER_DRAWER_DATA, useValue: data },
      { provide: FILTER_DRAWER_OVERLAY, useValue: overlayRef },
    ];
  
    return Injector.create({
      providers,
      parent: parentInjector,
    });
  }
  private _removeFilterClass() {
    this._filterMeta.openedFilters--;

    if (this._filterMeta.openedFilters === 0) {
      this._htmlClassRenderer.removeClass('fs-filter-open');
    }
  }

  private _addFilterClass() {
    this._filterMeta.openedFilters++;

    if (this._filterMeta.openedFilters === 1) {
      this._htmlClassRenderer.addClass('fs-filter-open');
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
