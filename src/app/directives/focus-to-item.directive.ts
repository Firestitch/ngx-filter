import { AfterViewInit, DestroyRef, Directive, Input, inject } from '@angular/core';

import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

import { FsAutocompleteComponent } from '@firestitch/autocomplete';
import { FsAutocompleteChipsComponent } from '@firestitch/autocomplete-chips';
import {
  DateRangePickerFromComponent, DateRangePickerToComponent,
  FsDatePickerComponent,
  FsDateScrollPickerComponent,
} from '@firestitch/datepicker';

import { tap, timer } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Directive({
  selector: '[fsFilterFocusTrigger]',
  standalone: true,
})
export class FocusToItemDirective implements AfterViewInit {

  @Input('fsFilterFocusTrigger')
  public focusEnabled = true;

  private _targetSelect = inject(MatSelect, { optional: true, self: true });
  private _targetText = inject(MatInput, { optional: true, self: true });
  private _targetDate = inject(FsDatePickerComponent, { optional: true, self: true });
  private _targetDateScroll = inject(FsDateScrollPickerComponent, { optional: true, self: true });
  private _targetDateRangeFrom = inject(DateRangePickerFromComponent, { optional: true, self: true });
  private _targetDateRangeTo = inject(DateRangePickerToComponent, { optional: true, self: true });
  private _targetAutocomplete = inject(FsAutocompleteComponent, { optional: true, self: true });
  private _targetAutocompleteChips = inject(FsAutocompleteChipsComponent, { optional: true, self: true });
  private _destroyRef = inject(DestroyRef);


  public ngAfterViewInit(): void {
    if(this.focusEnabled) {
      // Deferred so the control is settled before it is opened, and tied to this view's
      // lifetime because the popover hosting it can be torn down in the meantime.
      // Opening a control that has already been destroyed attaches an overlay nothing
      // owns — it resolves to the viewport origin and never closes.
      timer(0)
        .pipe(
          tap(() => {
            this._focus();
          }),
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe();
    }
  }

  private _focus() {
    if(this._targetSelect) {
      // open() is not idempotent — every call attaches another options panel.
      if(!this._targetSelect.panelOpen) {
        this._targetSelect.open();
      }
    } else if(this._targetDateRangeFrom || this._targetDateRangeTo || this._targetDate) {
      // Don't call open() directly on date pickers.
      // Date picker directives bind @HostListener('focus') → open(), so focusing
      // the input is enough.  Calling open() directly creates a dual-trigger:
      // open() → _doFocus() → focus event → @HostListener('focus') → open() again.
      this._targetText?.focus();
    } else if(this._targetDateScroll) {
      this._targetDateScroll.open();
    } else if(this._targetAutocomplete) {
      this._targetAutocomplete.focus();
    } else if(this._targetAutocompleteChips) {
      this._targetAutocompleteChips.focus();
    } else if(this._targetText) {
      this._targetText.focus();
    }
  }
}
