import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone, signal } from '@angular/core';


// The parts of the bar laid out in a line, in order: the keyword and primary filters, the
// chips, then the filters button, reload buttons and actions.
const BAR_PARTS = ['.filter-input-container', '.filter-chips', '.filter-actions'];

/**
 * Places the chips on the inputs bar. They sit between the inputs and the actions while all
 * of them fit on that one line. Once they would wrap, chips-below gives them a row of their
 * own under the bar that runs its full width, actions included, and they come back as soon as
 * there is room again: after the window widens, a filter is cleared or a chip's text shrinks.
 */
@Directive({
  selector: '[fsFilterChipsPlacement]',
  standalone: true,
  host: {
    '[class.chips-below]': 'chipsBelow()',
  },
})
export class FilterChipsPlacementDirective {

  public chipsBelow = signal(false);

  private _bar: HTMLElement = inject(ElementRef).nativeElement;
  private _zone = inject(NgZone);
  private _destroyRef = inject(DestroyRef);
  private _frame: number = null;

  constructor() {
    afterNextRender(() => {
      this._init();
    });
  }

  private _init(): void {
    this.chipsBelow.set(this._chipsOverflow());

    this._zone.runOutsideAngular(() => {
      this._observe();
    });
  }

  private _observe(): void {
    // Chips, inputs and actions coming and going, and a chip's text changing. Placed before
    // the change is painted, so a chip never shows on the wrong row.
    const mutations = new MutationObserver(() => {
      this._update();
    });

    // The bar resizing with the window or its container. Placed on the next frame: placing
    // inside the callback resizes the bar being reported on, which the browser will not
    // deliver in the same frame and raises as an error.
    const resizes = new ResizeObserver(() => {
      this._frame ??= requestAnimationFrame(() => {
        this._frame = null;
        this._update();
      });
    });

    mutations.observe(this._bar, { childList: true, characterData: true, subtree: true });
    resizes.observe(this._bar);

    this._destroyRef.onDestroy(() => {
      mutations.disconnect();
      resizes.disconnect();
      cancelAnimationFrame(this._frame);
    });
  }

  private _update(): void {
    const chipsBelow = this._chipsOverflow();

    if (chipsBelow !== this.chipsBelow()) {
      this._zone.run(() => {
        this.chipsBelow.set(chipsBelow);
      });
    }
  }

  // Whether the chips, beside the inputs and before the actions, would run past the end of
  // the bar. chips-measure sets every part out at its natural width on one line just long
  // enough to read it, never painted, so the answer is the same wherever the chips sit now
  // and they never flip back and forth.
  private _chipsOverflow(): boolean {
    const chips = this._bar.querySelector(':scope > .filter-chips');

    // No chips, no row of their own: an empty one would only leave a gap under the bar.
    if (!chips?.childElementCount) {
      return false;
    }

    // Read before measuring: set out on one line, the parts can stretch a bar whose
    // container sizes to its content past the width it really has.
    const barWidth = this._bar.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(this._bar).columnGap) || 0;

    this._bar.classList.add('chips-measure');

    const widths = BAR_PARTS
      .map((part) => this._bar.querySelector(`:scope > ${part}`))
      .filter((part) => !!part)
      .map((part) => part.getBoundingClientRect().width);

    this._bar.classList.remove('chips-measure');

    const lineWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);

    return lineWidth > barWidth;
  }
}
