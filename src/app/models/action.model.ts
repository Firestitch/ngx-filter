import { ThemePalette } from '@angular/material/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ActionType } from '../enums/action-type.enum';
import { FsFilterAction, FsFilterActionClickFn } from '../interfaces/action.interface';
import { ActionMode } from '../enums/action-mode.enum';
import { ActionMenuItem } from './action-menu-item.model';


export class Action {

  public primary = true;
  public icon: string;
  public label: string;
  public menu: boolean;
  public color: ThemePalette;
  public customize: boolean;
  public className: string;
  public click: FsFilterActionClickFn;
  public type: ActionType;
  public tabIndex: number;

  public mode: ActionMode;

  public isReorderAction = false;

  public classArray: string[] = [];
  public items: ActionMenuItem[] = [];

  private _visible$ = new BehaviorSubject<boolean>(true);
  private _disabled$ = new BehaviorSubject<boolean>(false);

  private _showFn: () => boolean;
  private _disabledFn: () => boolean;

  constructor(config: FsFilterAction = {}) {
    this._init(config);
  }

  public get visible(): boolean {
    return this._visible$.getValue();
  }

  public get visible$(): Observable<boolean> {
    return this._visible$.asObservable();
  }

  public set disabled(value: boolean) {
    this._disabled$.next(value);
  }

  public get disabled(): boolean {
    return this._disabled$.getValue();
  }

  public get disabled$(): Observable<boolean> {
    return this._disabled$.asObservable();
  }

  public updateVisibility(): void {
    const visible = !!this._showFn ? this._showFn() : true;

    if (!visible || this.mode !== ActionMode.Menu) {
      this._visible$.next(visible);

      return;
    }

    const hasVisibleChildren = this.items.some((item) => item.visible);
    this._visible$.next(hasVisibleChildren);
  }

  public updateDisabledState(): void {
    if (this._disabled$) {
      this.disabled = this._disabledFn();
    }
  }

  private _init(config: FsFilterAction): void {
    config.mode = config.mode ?? ActionMode.Button;

    this.primary = config.primary ?? true;
    this.color = config.color;
    this.type = config.type ?? ActionType.Raised;
    this.label = config.label;
    this.mode = config.mode;
    this._showFn = config.show;

    if (config.className) {
      this.className = config.className;
      this.classArray = this.className
        .split(' ');
    }

    if (this.primary) {
      this.color = 'primary';
    }

    switch (config.mode) {
      case ActionMode.Button: {
        this.icon = config.icon;
        this.menu = config.menu;
        this.customize = config.customize;
        this.tabIndex = config.tabIndex ?? 0;
        this.primary = config.primary ?? true;
        this._showFn = config.show;
        this._disabledFn = config.disabled;
        this.click = config.click ?? (() => { });
      } break;

      case ActionMode.Menu: {
        if (config.items && Array.isArray(config.items)) {
          this.items = config.items.map((item) => new ActionMenuItem(item));
        }
      } break;
    }

    this.updateVisibility();
  }
}
