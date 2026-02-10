import { AfterViewInit, Directive, Input, inject } from '@angular/core';

import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

import { FsAutocompleteComponent } from '@firestitch/autocomplete';
import { FsAutocompleteChipsComponent } from '@firestitch/autocomplete-chips';
import {
  DateRangePickerFromComponent, DateRangePickerToComponent,
  FsDatePickerComponent,
  FsDateScrollPickerComponent,
} from '@firestitch/datepicker';


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


  public ngAfterViewInit(): void {
    if(this.focusEnabled) {
      setTimeout(() => {
        this._focus();
      });
    }
  }

  private _focus() {
    if(this._targetSelect) {
      this._targetSelect.open();
    } else if(this._targetDateRangeFrom) {
      this._targetDateRangeFrom.open();
    } else if(this._targetDateRangeTo) {
      this._targetDateRangeTo.open();
    } else if(this._targetDate) {
      this._targetDate.open();
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
