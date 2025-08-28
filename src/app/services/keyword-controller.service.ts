import { DestroyRef, inject, Injectable } from '@angular/core';

import { BehaviorSubject, distinctUntilChanged, filter, Observable, switchMap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TextItem } from '../models/items/text-item';

import { FilterController } from './filter-controller.service';


@Injectable()
export class KeywordController {

  private _keywordItem$ = new BehaviorSubject<TextItem>(null);
  private _keywordVisible$ = new BehaviorSubject(false);
  private _destroyRef = inject(DestroyRef);
  private _filterController: FilterController;

  public init(filterController: FilterController) {
    this._filterController = filterController;
    this._keywordItem$
      .pipe(
        filter((item) => !!item),
        // when item changes, unsubscribe from the previous visible$
        switchMap((item) => item.visible$),
        // avoid redundant writes
        distinctUntilChanged(),
        // clean up on destroy,
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((visible) => this._keywordVisible$.next(visible));
  }

  public get keywordItem$(): Observable<TextItem> {
    return this._keywordItem$.asObservable();
  }

  public get keywordItem(): TextItem {
    return this._keywordItem$.value;
  }

  public set keywordItem(item: TextItem) {
    this._keywordItem$.next(item);
  }

  public clear() {
    this.keywordItem.value = '';
  }

  public show() {
    this.keywordItem.show();
  }

  public hide() {
    this.keywordItem.hide();
  }

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordVisible$.asObservable();
  }

}

