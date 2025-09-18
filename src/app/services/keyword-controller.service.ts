import { DestroyRef, inject, Injectable } from '@angular/core';

import { BehaviorSubject, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { KeywordItem } from '../models/items';


@Injectable()
export class KeywordController {

  private _keywordItem$ = new BehaviorSubject<KeywordItem>(null);
  private _keywordVisible$ = new BehaviorSubject(null);
  private _keywordFullWidth$ = new BehaviorSubject(null);
  private _destroyRef = inject(DestroyRef);

  public init() {
    this._keywordItem$
      .pipe(
        // when item changes, unsubscribe from the previous visible$
        switchMap((item) => item ? item.visible$ : of(false)),
        // avoid redundant writes
        distinctUntilChanged(),
        tap((visible) => this._keywordVisible$.next(visible)),
        // clean up on destroy,
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
      
    this._keywordItem$
      .pipe(
        map((item) => !!item?.fullWidth),
        // avoid redundant writes
        distinctUntilChanged(),
        tap((fullWidth) => this._keywordFullWidth$.next(fullWidth)),
        // clean up on destroy,
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  public get keywordItem$(): Observable<KeywordItem> {
    return this._keywordItem$.asObservable();
  }

  public get keywordItem(): KeywordItem {
    return this._keywordItem$.value;
  }

  public set keywordItem(item: KeywordItem) {
    this._keywordItem$.next(item);
  }

  public clear(emitChange: boolean = true) {
    this.keywordItem?.setValue('', emitChange);
  }

  public show() {
    this.keywordItem?.show();
  }

  public hide() {
    this.keywordItem?.hide();
  }

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordVisible$.asObservable();
  }

  public get keywordFullWidth$(): Observable<boolean> {
    return this._keywordFullWidth$.asObservable();
  }

}

