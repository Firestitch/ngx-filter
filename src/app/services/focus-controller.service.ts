import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { BaseItem } from '../models/items/base-item';
import { FsFilterOverlayService } from './filter-overlay.service';


@Injectable()
export class FocusControllerService {

  private _focusOn = new BehaviorSubject<{ item: BaseItem<any>, type: 'from' | 'to'}>(null);

  constructor(
    private _filterOverlay: FsFilterOverlayService,
  ) {}

  public get focusOn$() {
    return this._focusOn.asObservable();
  }

  public click(item: BaseItem<any>, type: 'from' | 'to' = null) {
    if (!this._filterOverlay.isOpened) {
      this._filterOverlay.open();
    }

    this._focusOn.next({ item, type })
  }

  public listenFocusFor$(targetItem: BaseItem<any>, targetType: 'from' | 'to' = null) {
    return this._focusOn
      .pipe(
        filter((event) => !!event),
        filter(({ item, type }) => {
          return targetItem === item && targetType === type;
        }),
        tap(() => this.clearFocus()),
      )
  }

  public clearFocus() {
    this._focusOn.next(null);
  }
}
