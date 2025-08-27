import { ThemePalette } from '@angular/material/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ButtonStyle } from '../enums';
import { ActionMode } from '../enums/action-mode.enum';
import {
  FsFilterAction,
  FsFilterActionClickFn,
  FsFilterActionDisabledFn,
  FsFilterActionShowFn,
  FsFilterFileActionErrorFn,
  FsFilterFileActionSelectFn,
  IFsFilterFileAction,
  IFsFilterSelectButtonAction,
} from '../interfaces/action.interface';

import { ActionMenuItem } from './action-menu-item.model';
import { FsFilterConfig } from './filter-config';


export class Action {

  public primary = true;
  public icon: string;
  public iconPlacement: 'left' | 'right';
  public label: string;
  public value: any;
  public menu: boolean;
  public color: ThemePalette;
  public customize: boolean;
  public className: string;
  public click: FsFilterActionClickFn;
  public style: ButtonStyle;
  public tabIndex: number;
  public fileSelected: FsFilterFileActionSelectFn;
  public fileError: FsFilterFileActionErrorFn;
  public multiple: boolean;
  public accept: string;
  public tooltip: string;
  public minWidth: number;
  public minHeight: number;
  public maxWidth: number;
  public maxHeight: number;
  public imageQuality: number;
  public change: (value: any) => void;
  public values: any[];
  public mode: ActionMode;
  public isReorderAction = false;
  public deselect = false;
  public classArray: string[] = [];
  public items: ActionMenuItem[] = [];

  private _visible$ = new BehaviorSubject<boolean>(true);
  private _disabled$ = new BehaviorSubject<boolean>(false);
  private _showFn: FsFilterActionShowFn;
  private _disabledFn: FsFilterActionDisabledFn;

  constructor(filterConfig: FsFilterConfig, actionConfig: FsFilterAction = {}) {
    this._init(filterConfig, actionConfig);
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
    const visible = this._showFn ? this._showFn() : true;

    if (!visible || this.mode !== ActionMode.Menu) {
      this._visible$.next(visible);

      return;
    }

    const hasVisibleChildren = this.items.some((item) => item.visible);
    this._visible$.next(hasVisibleChildren);
  }

  public updateDisabledState(): void {
    if (this._disabledFn) {
      this.disabled = this._disabledFn();
    }
  }

  private _init(filterConfig: FsFilterConfig, config: FsFilterAction = {}): void {
    config.mode = config.mode ?? ActionMode.Button;
    this._initCore(filterConfig, config);

    switch (config.mode) {
      case ActionMode.Button: {
        this.customize = config.customize;
        this.click = config.click ?? (() => {
          // do nothing
        });
        this._disabledFn = config.disabled;

        this.updateDisabledState();
      } break;

      case ActionMode.Menu: {
        if (config.items && Array.isArray(config.items)) {
          this.items = config.items.map((item) => new ActionMenuItem(item));
        }
      } break;

      case ActionMode.SelectButton: {
        this._initSelectButton(config);
      } break;

      case ActionMode.File: {
        this._initFile(config);
      } break;
    }

    this.updateVisibility();
  }

  private _initCore(filterConfig: FsFilterConfig, config: FsFilterAction): void {
    this.primary = config.primary ?? true;
    this.color = config.color;
    this.tooltip = config.tooltip;
    this.label = config.label;
    this.mode = config.mode;
    this.icon = config.icon;
    this.iconPlacement = config.iconPlacement;
    this._showFn = config.show;
    this.tabIndex = config.tabIndex ?? 0;
    this.menu = config.menu;

    if (!this.style) {
      this.style = config.icon && !config.label ?
        ButtonStyle.Icon :
        (config.style || filterConfig.buttonStyle || ButtonStyle.Flat);

      if(!this.primary && this.style === ButtonStyle.Flat) {
        this.style = ButtonStyle.Stroked;
      }
    }

    if (config.className) {
      this.className = config.className;
      this.classArray = this.className
        .split(' ');
    }

    if (!this.primary && this.mode === ActionMode.SelectButton) {
      this.color = null; // should be null because of styles logic in select-button
    }

    if (this.primary) {
      this.color = 'primary';
    }

  }

  private _initSelectButton(config: IFsFilterSelectButtonAction): void {
    this.values = config.values;
    this.value = config.default;
    this.change = config.change;
    this.deselect = config.deselect ?? false;
  }

  private _initFile(config: IFsFilterFileAction): void {
    this.fileSelected = config.select;
    this.fileError = config.error;
    this.accept = config.accept;
    this.imageQuality = config.imageQuality;
    this.minWidth = config.minWidth;
    this.minHeight = config.minHeight;
    this.maxWidth = config.maxWidth;
    this.maxHeight = config.maxHeight;
    this.click = config.click ?? (() => {
      //
    });
    this._disabledFn = config.disabled;

    if ((config).multiple !== undefined) {
      this.multiple = (config).multiple;
    }

    this.updateDisabledState();
  }
}
