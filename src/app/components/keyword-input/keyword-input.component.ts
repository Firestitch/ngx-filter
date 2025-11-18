import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { FsClearModule } from '@firestitch/clear';
import { FsFormModule } from '@firestitch/form';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { KeywordController } from '../../services/keyword-controller.service';


@Component({
  selector: 'fs-keyword-input',
  styleUrls: ['./keyword-input.component.scss'],
  templateUrl: './keyword-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    NgClass,
    MatPrefix,
    MatIcon,
    MatInput,
    FormsModule,
    FsFormModule,
    FsClearModule,
    AsyncPipe,
  ],
})
export class KeywordInputComponent implements OnInit, OnDestroy {

  @ViewChild('keywordMatInput', { read: MatInput })
  public keywordMatInput: MatInput;

  @Input() public autofocus = false;

  public searchPlaceholder = 'Search';
  public keyword = '';

  private _keyword$ = new Subject();
  private _destroyRef = inject(DestroyRef);
  private _destroy$ = new Subject<void>();
  private _keywordController = inject(KeywordController);
  private _cdRef = inject(ChangeDetectorRef);

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordController.keywordVisible$;
  }

  public ngOnInit(): void {
    this._initAutoFocus();
    this._listenInputChanges();
    this._initKeyword();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public focus() {
    this.keywordMatInput?.focus();
  }

  public show() {
    this._keywordController.show();
  }

  public hide() {
    this._keywordController.hide();
  }

  public clear(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this.keyword = '';
  }

  public keywordChange(keyword) {
    this._keyword$.next(keyword);
  }

  private _listenInputChanges() {
    this._keyword$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this._keywordController.keywordItem.value = value;
      });
  }

  private _initKeyword() {
    this._keywordController.keywordItem.value$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this.keyword = value;
        this._cdRef.detectChanges();
      });
  }

  private _initAutoFocus() {
    // Avoid ngChanges error
    setTimeout(() => {
      if (this.autofocus) {
        this.focus();
      }
    });
  }

}
