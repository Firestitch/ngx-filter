import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BaseItem } from '../models/items/base-item';
import { FsFilterOverlayService } from './filter-overlay.service';


@Injectable()
export class FocusControllerService {

  private _focusOn = new ReplaySubject<{ item: BaseItem<any>, type: 'from' | 'to'}>(1);

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
        filter(({ item, type }) => {
          return targetItem === item && targetType === type;
        })
      )
  }
}
