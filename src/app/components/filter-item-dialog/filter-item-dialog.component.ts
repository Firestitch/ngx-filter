import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatButton } from '@angular/material/button';

import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { filter, fromEvent, take, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FILTER_DRAWER_DATA } from '../../injectors';
import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items';
import { FilterItemComponent } from '../filters-item/filter-item.component';

/**
 * A chip's popup. Closing it keeps what was picked (Apply, a click away, a pick that
 * closes it); closing it with Escape puts the filter back as the popup found it.
 */
@Component({
  templateUrl: './filter-item-dialog.component.html',
  styleUrls: ['./filter-item-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsFormModule,
    FsSkeletonModule,
    FilterItemComponent,
    MatButton,
  ],
})
export class FilterItemDialogComponent {

  public item: BaseItem<IFilterConfigItem> = inject(FILTER_DRAWER_DATA)?.item;
  public autofocusName: string = inject(FILTER_DRAWER_DATA)?.autofocusName;
  public overlayRef: OverlayRef = inject(FILTER_DRAWER_DATA)?.overlayRef;

  private _canceled = inject(FILTER_DRAWER_DATA).canceled;
  // Taken as the popup opens, before any field has touched the item.
  private _restore = this.item.snapshot();
  private _document = inject(DOCUMENT);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._listenEscape();
  }

  /**
   * Closes the popup the way a click on the backdrop does. Each field applies what it holds as
   * it goes away (an open list emits its close, a text, range or multiple select field writes
   * on destroy), so nothing is applied here. An open multiple select lays its backdrop over
   * this button; the select passes a click there on to it.
   */
  public apply(): void {
    this.overlayRef.dispose();
  }

  /**
   * Closes the popup and undoes it. Canceled first, so the fields drop what they hold as
   * they go away rather than apply it; then the item goes back to how the popup found it,
   * which reloads only if the popup had already applied something (an exclude or isolate
   * toggle, picks applied as their list closed).
   */
  public cancel(): void {
    this._canceled.set(true);
    this.overlayRef.dispose();
    this._restore();
  }

  /**
   * Escape cancels the popup even with a list or calendar open inside it. Focus is often
   * not in the popup (a pick in an autocomplete list or opening a select leaves it on the
   * page), so the key is caught on its way down from the document, before the open list
   * can close just itself or a dialog under the page closes instead.
   */
  private _listenEscape(): void {
    fromEvent<KeyboardEvent>(this._document, 'keydown', { capture: true })
      .pipe(
        filter((event) => event.key === 'Escape' && !hasModifierKey(event)),
        filter((event) => !this._pressedAbove(event)),
        take(1),
        tap((event) => {
          event.preventDefault();
          event.stopPropagation();
          this.cancel();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  /**
   * A key pressed in an overlay opened after the popup, such as a dialog a panel action
   * opens, belongs to that overlay: it closes itself and the popup stays.
   */
  private _pressedAbove(event: KeyboardEvent): boolean {
    const pane = event.target instanceof Element ? event.target.closest('.cdk-overlay-pane') : null;

    return !!pane
      && !this.overlayRef.hostElement.contains(pane)
      && !!(this.overlayRef.hostElement.compareDocumentPosition(pane) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

}
