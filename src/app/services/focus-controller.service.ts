import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { BaseItem } from '../models/items/base-item';


@Injectable()
export class FocusControllerService {

  private _focusOn = new BehaviorSubject<{ item: BaseItem<any>, type: 'from' | 'to'}>(null);

  constructor() {}

  public get focusOn$() {
    return this._focusOn.asObservable();
  }

  public click(item: BaseItem<any>, type: 'from' | 'to' = null) {
    this._focusOn.next({ item, type });
  }

  public listenFocusFor$(targetItem: BaseItem<any>, targetType: 'from' | 'to' = null) {
    return this._focusOn
      .pipe(
        filter((event) => !!event),
        filter(({ item, type }) => {
          return targetItem === item && targetType === type;
        }),
        tap(() => this.clearFocus()),
      );
  }

  public clearFocus() {
    this._focusOn.next(null);
  }
}
