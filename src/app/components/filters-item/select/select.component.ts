import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { FsFormModule } from '@firestitch/form';

import { isEqual } from 'lodash-es';
import { filter, fromEvent, tap } from 'rxjs';


import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { SelectItem } from '../../../models/items/select-item';
import { BaseItemComponent } from '../base-item';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    NgClass,
    MatLabel,
    MatSelect,
    FocusToItemDirective,
    FormsModule,
    FsFormModule,
    MatOption,
    MatOptgroup,
    MatCheckbox,
    AsyncPipe,  
  ],
})
export class SelectComponent extends BaseItemComponent<SelectItem> implements OnInit, OnDestroy {

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';

  @ViewChild(MatSelect, { static: true })
  public select: MatSelect;

  private _document = inject(DOCUMENT);

  public selectionChange() {
    if(!this.item.multiple) {
      this.change();
    }
  }

  /**
   * A single list closes on a pick, and the popup with it. A multiple list in the filter bar
   * applies its picks as it closes; in a popup it only closes, and the picks wait for the
   * popup to close (see ngOnDestroy), so closing and reopening the list reloads nothing.
   */
  public selectOpenedChange(opened: boolean) {
    if(opened) {
      return;
    }

    if(!this.item.multiple) {
      this.close();

      return;
    }

    if(!this.overlayRef && this.value !== this.item.value) {
      this.change();
    }
  }

  public change() {
    let value = this.value;
    if(this.item.isolate) {
      if(this.item.multiple) {
        value = value.filter((v) => {
          return !this.item.isolateValues.includes(v.value as never);
        });
      }

      this.item.isolated = false;
    }

    this.item.value = value;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    
    if(this.item.isolate && !this.item.hasValue) {
      this.item.isolated = false;
    }

    if(this.overlayRef && this.item.multiple) {
      this._listenListBackdrop();
    }
  }

  /**
   * A multiple list in a popup applies what was picked as the popup closes, by Apply or a
   * click away. Closed with Escape, it applies nothing.
   */
  public ngOnDestroy(): void {
    if(
      this.overlayRef
      && this.item.multiple
      && !this._canceled
      && !isEqual(this.value, this.item.value)
    ) {
      this.change();
    }
  }

  public isolateChange(event: MatCheckboxChange) {
    if(event.checked) {
      this.value = this.item.multiple ? this.item.isolateValues : this.item.isolateValues[0];
    } else {
      this.value = this.item.multiple ? [] : null;
    }

    this.change();
  }

  /**
   * An open multiple list lays its backdrop over the whole page, so the first click while it
   * is open lands on that backdrop and would only close the list. The click is taken where it
   * was meant: away from the popup it closes the popup, as a click away does, and on a popup
   * button (Apply) it presses it. Anywhere else in the popup it only closes the list.
   */
  private _listenListBackdrop(): void {
    fromEvent<MouseEvent>(this._document, 'click', { capture: true })
      .pipe(
        filter((event) => this.select.panelOpen && this._isBackdrop(event.target)),
        tap((event) => {
          const under = this._document
            .elementsFromPoint(event.clientX, event.clientY)
            .find((el) => this.overlayRef.overlayElement.contains(el));

          if(!under) {
            this.close();

            return;
          }

          under.closest('button')?.click();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _isBackdrop(target: EventTarget): boolean {
    return target instanceof Element && target.classList.contains('cdk-overlay-backdrop');
  }
}
