import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { MatSelect } from '@angular/material/select';

import { FsAutocompleteComponent } from '@firestitch/autocomplete';
import { FsAutocompleteChipsComponent } from '@firestitch/autocomplete-chips';
import {
  DateRangePickerFromComponent, DateRangePickerToComponent,
  FsDatePickerComponent,
  FsDateScrollPickerComponent,
} from '@firestitch/datepicker';

import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { ItemDateMode } from '../enums/item-date-mode.enum';
import { ItemType } from '../enums/item-type.enum';
import { FocusControllerService } from '../services/focus-controller.service';


@Directive({
  selector: '[fsFilterFocusTrigger]',
  standalone: true,
})
export class FocusToItemDirective implements OnInit, OnDestroy {
  private _el = inject(ElementRef);
  private _focusController = inject(FocusControllerService);
  private _targetSelect = inject(MatSelect, { optional: true, self: true });
  private _targetDate = inject(FsDatePickerComponent, { optional: true, self: true });
  private _targetDateScroll = inject(FsDateScrollPickerComponent, { optional: true, self: true });
  private _targetDateRangeFrom = inject(DateRangePickerFromComponent, { optional: true, self: true });
  private _targetDateRangeTo = inject(DateRangePickerToComponent, { optional: true, self: true });
  private _targetAutocomplete = inject(FsAutocompleteComponent, { optional: true, self: true });
  private _targetAutocompleteChips = inject(FsAutocompleteChipsComponent, { optional: true, self: true });


  @Input('fsFilterFocusTrigger')
  private _item;

  @Input('focusTargetType')
  private _focusTargetType;

  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._focusController
      .listenFocusFor$(this._item, this._focusTargetType)
      .pipe(
        delay(500),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._focus();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _focus() {
    switch (this._item.type) {
      case ItemType.Select: {
        this._targetSelect.open();
      } break;

      case ItemType.Text: case ItemType.Range: {
        this._el.nativeElement.focus();
      } break;

      case ItemType.Date: {
        if (this._item.mode === ItemDateMode.Calendar) {
          this._targetDate.open();
        } else {
          this._targetDateScroll.open();
        }
      } break;
      case ItemType.DateRange: {
        if (this._focusTargetType === 'from') {
          this._targetDateRangeFrom.open();
        } else {
          this._targetDateRangeTo.open();
        }
      } break;

      case ItemType.AutoComplete: {
        this._targetAutocomplete.focus();
      } break;

      case ItemType.AutoCompleteChips: {
        this._targetAutocompleteChips.focus();
      } break;
    }
  }
}
