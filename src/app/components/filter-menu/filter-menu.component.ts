import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatActionList, MatListItem } from '@angular/material/list';

import { filter, merge, take, takeUntil, tap } from 'rxjs';

import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items/base-item';
import { FilterController } from '../../services/filter-controller.service';
import { SavedFilterController } from '../../services/saved-filter-controller.service';


/**
 * The filters button beside reload: a count of the filters applied, and a flyout that adds
 * a filter not yet in the chip row and resets them all. The flyout is a panel sized to what
 * it holds, opened under the button, rather than a menu.
 */
@Component({
  selector: 'fs-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatBadge,
    MatButton,
    MatIconButton,
    MatDivider,
    MatIcon,
    MatActionList,
    MatListItem,
  ],
})
export class FsFilterMenuComponent implements OnDestroy {

  // Picked from the flyout; the chip row shows the filter and opens it.
  public add = output<BaseItem<IFilterConfigItem>>();

  public panel = viewChild.required<TemplateRef<unknown>>('panel');
  public panelOpen = signal(false);
  public appliedCount = signal(0);
  public addItems = signal<BaseItem<IFilterConfigItem>[]>([]);
  public disabled = toSignal(inject(FilterController).disabled$, { initialValue: false });

  private _filterController = inject(FilterController);
  private _savedFilterController = inject(SavedFilterController);
  private _overlay = inject(Overlay);
  private _elementRef = inject(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);
  private _destroyRef = inject(DestroyRef);
  private _overlayRef: OverlayRef = null;
  private _nonDefaultValue = signal(false);

  constructor() {
    this._init();
  }

  // The overlay is attached at document level, outside this view, so nothing tears it down
  // with us; left behind it would outlive the page that destroyed the filter.
  public ngOnDestroy(): void {
    this.close();
  }

  public open(): void {
    if (this._overlayRef) {
      return;
    }

    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .withPositions(this._positions())
        .withViewportMargin(16),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      // Never share a panel class: overlay CSS is global, so another package's rules would restyle this.
      panelClass: 'fs-filter-menu-overlay-pane',
    });

    this._listenClose(this._overlayRef);
    this._overlayRef.attach(new TemplatePortal(this.panel(), this._viewContainerRef));
    this.panelOpen.set(true);
  }

  public close(): void {
    this._overlayRef?.dispose();
  }

  public addItem(item: BaseItem<IFilterConfigItem>): void {
    this.close();
    this.add.emit(item);
  }

  // Reset follows the host's rule when it sets one (config.clearVisible), else an item
  // holding a value other than its default. Called on each check of the flyout, so a rule
  // that reads signals stays current.
  public resetEnabled(): boolean {
    const rule = this._filterController.config?.clearVisible;

    return rule ? !!rule() : this._nonDefaultValue();
  }

  public reset(): void {
    this.close();

    // Hide first so the chip row has settled before filtersClear() fires change().
    // Items promoted by minSecondaryItems carry secondary === true and keep their chip;
    // items showing only because they held a value are hidden.
    this._filterController.items
      .filter((item) => item.clearable && !item.secondary)
      .forEach((item) => item.secondaryHide());

    this._filterController.filtersClear();
    this._savedFilterController.setActiveFilter(null);

    if (this._filterController.config.clear) {
      this._filterController.config.clear();
    }
  }

  private _init(): void {
    this._filterController.itemsState$
      .pipe(
        tap((items) => {
          const filterItems = items
            .filter((item) => item.visible && !item.isTypeKeyword);

          // A filter preselected on load narrows the list as much as one picked by hand,
          // so a default value counts as applied.
          this.appliedCount.set(filterItems.filter((item) => item.hasValue).length);
          this.addItems.set(filterItems.filter((item) => !item.primary && !item.secondaryVisible));
          // Reset also clears the keyword search, so typed text is something to reset.
          this._nonDefaultValue.set(items
            .some((item) => item.visible && item.clearable && item.hasNonDefaultValue));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  // Under the button, right edges aligned since it sits at the bar's right end; flipped to
  // its left edge, then above it, when the viewport has no room.
  private _positions(): ConnectedPosition[] {
    return [
      { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 5 },
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 5 },
      { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -5 },
    ];
  }

  private _listenClose(overlayRef: OverlayRef): void {
    merge(
      overlayRef.backdropClick(),
      overlayRef.keydownEvents().pipe(filter((event) => event.key === 'Escape')),
    )
      .pipe(
        take(1),
        tap(() => this.close()),
        takeUntil(overlayRef.detachments()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    overlayRef.detachments()
      .pipe(
        take(1),
        tap(() => {
          this._overlayRef = null;
          this.panelOpen.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

}
