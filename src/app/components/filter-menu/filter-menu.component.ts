import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
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
import {
  MatActionList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';

import { filter, merge, take, takeUntil, tap } from 'rxjs';

import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items/base-item';
import { FilterController } from '../../services/filter-controller.service';
import { SavedFilterController } from '../../services/saved-filter-controller.service';
import { FsFilterChipTextComponent } from '../filter-chip-text';



/**
 * The filters button beside reload: a count of the filters applied, and a flyout that lists
 * every filter of the chip row and resets them all to their defaults. The flyout is a panel
 * sized to what it holds, opened under the button, rather than a menu.
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
    FsFilterChipTextComponent,
    MatActionList,
    MatListItem,
    MatListItemLine,
    MatListItemTitle,
    MatTooltip,
  ],
})
export class FsFilterMenuComponent implements OnDestroy {

  // Picked from the flyout; the chip row shows the filter if it is not already and opens it.
  public pick = output<BaseItem<IFilterConfigItem>>();

  public panel = viewChild.required<TemplateRef<unknown>>('panel');
  public panelOpen = signal(false);
  public activeCount = signal(0);
  public label = computed(() => this.activeCount()
    ? `Filters · ${this.activeCount()} active`
    : 'Filters');
  public items = signal<BaseItem<IFilterConfigItem>[]>([]);
  // Applied filters head the flyout and the rest follow, each group in its configured order,
  // so what narrows the list sits at the top, under the count and Reset. Grouped by what
  // was applied when the flyout opened: a checkbox toggled in place keeps its row until the
  // flyout opens again, rather than jumping to the other group under the cursor.
  public groups = computed(() => {
    const applied = this._appliedOnOpen();

    return [
      this.items().filter((item) => applied.has(item.name)),
      this.items().filter((item) => !applied.has(item.name)),
    ].filter((group) => group.length);
  });
  public disabled = toSignal(inject(FilterController).disabled$, { initialValue: false });

  private _filterController = inject(FilterController);
  private _savedFilterController = inject(SavedFilterController);
  private _overlay = inject(Overlay);
  private _elementRef = inject(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);
  private _destroyRef = inject(DestroyRef);
  private _overlayRef: OverlayRef = null;
  private _appliedOnOpen = signal(new Set<string>());

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

    this._appliedOnOpen.set(new Set(this.items()
      .filter((item) => item.hasValue)
      .map((item) => item.name)));

    this._listenClose(this._overlayRef);
    this._overlayRef.attach(new TemplatePortal(this.panel(), this._viewContainerRef));
    this.panelOpen.set(true);
  }

  public close(): void {
    this._overlayRef?.dispose();
  }

  // A checkbox filter has no popup, so its row turns it on and off in place and the flyout
  // stays open. Any other row opens the filter's popup, the same one its chip opens.
  public pickItem(item: BaseItem<IFilterConfigItem>): void {
    if (item.isTypeCheckbox) {
      if (item.hasValue) {
        item.clear();
      } else {
        item.setValue(true);
      }

      return;
    }

    this.close();
    this.pick.emit(item);
  }

  // The applied value under a filter's name, worded as its chips word it. A chip carrying
  // the filter's own name gives just its value ('Active'); one named otherwise keeps its
  // name ('From: Nov 1', 'Exclude Region: West'), and picks a chip only counts are counted
  // here too ('+2 more'). A checkbox filter's chip is only ever its name, so its row reads
  // 'Selected' instead. Called on each check of the flyout, as the value can change
  // without the filter gaining or losing one.
  public summary(item: BaseItem<IFilterConfigItem>): { text: string, more: number } {
    if (item.isTypeCheckbox) {
      return { text: 'Selected', more: 0 };
    }

    const chips = item.shownChips;
    const text = chips
      .map((chip) => {
        if (!chip.value) {
          return chip.label;
        }

        return chip.label === item.mergedLabel ? chip.value : `${chip.label}: ${chip.value}`;
      })
      .join(', ');

    return { text, more: chips.reduce((sum, chip) => sum + (chip.more ?? 0), 0) };
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
          // so a default value counts as active.
          this.activeCount.set(filterItems.filter((item) => item.hasValue).length);
          // Primary filters are inputs in the bar already, so the flyout leaves them out.
          this.items.set(filterItems.filter((item) => !item.primary));
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
