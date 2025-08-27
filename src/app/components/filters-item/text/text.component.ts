import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { TextItem } from '../../../models/items/text-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatPrefix,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    FocusToItemDirective,
    MatSuffix,
  ],
})
export class TextComponent extends BaseItemComponent<TextItem> implements OnInit {

  public value: string;

  private _change$ = new Subject<string>();
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this._listenControlValueChanges();
    this._listenValueChanges();
  }

  public change() {
    this._change$.next(this.value);
  }

  private _listenControlValueChanges(): void {
    this._change$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.item.value = value;
      });
  }

  private _listenValueChanges(): void {
    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });
  }

}
