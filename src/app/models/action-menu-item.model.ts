import { BehaviorSubject, Observable } from 'rxjs';

import { MenuActionMode } from '../enums';
import {
  FsFilterActionClickFn, FsFilterActionShowFn,
  FsFilterFileActionErrorFn,
  FsFilterFileActionSelectFn,
  IFsFilterMenuActionFileItem,
  IFsFilterMenuActionGroupItem,
  IFsFilterMenuActionItem, IFsFilterMenuActionLink,
} from '../interfaces/action.interface';


export class ActionMenuItem {

  public icon: string;
  public label: string;
  public mode: MenuActionMode;
  public fileSelected: FsFilterFileActionSelectFn;
  public fileError: FsFilterFileActionErrorFn;
  public multiple: boolean;
  public accept: string;
  public minWidth: number;
  public minHeight: number;
  public maxWidth: number;
  public maxHeight: number;
  public imageQuality: number;
  public click: FsFilterActionClickFn;
  public routerLink: IFsFilterMenuActionLink;
  public items: ActionMenuItem[] = [];

  private _isGroup = false;
  private _showFn: FsFilterActionShowFn;
  private _visible$ = new BehaviorSubject<boolean>(true);
  private _disabled$ = new BehaviorSubject<boolean>(false);

  constructor(
    config: IFsFilterMenuActionGroupItem | IFsFilterMenuActionItem = {},
    private _parent?: ActionMenuItem,
  ) {
    this._init(config);
  }

  public get isGroup(): boolean {
    return this._isGroup;
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

    if (!visible || !this.isGroup) {
      this._visible$.next(visible);

      return;
    }

    const numberOfVisibleChildren = this.items
      .reduce((acc, item) => {
        item.updateVisibility();

        if (item.visible) {
          acc++;
        }

        return acc;
      }, 0);

    this._visible$.next(!!numberOfVisibleChildren);
  }

  private _initFile(config: IFsFilterMenuActionFileItem): void {
    this.multiple = config.multiple;
    this.accept = config.accept;
    this.minWidth = config.minWidth;
    this.minHeight = config.minHeight;
    this.maxWidth = config.maxWidth;
    this.maxHeight = config.maxHeight;
    this.imageQuality = config.imageQuality;
    this.fileSelected = config.fileSelected;
  }

  private _init(
    config: IFsFilterMenuActionGroupItem | IFsFilterMenuActionItem | IFsFilterMenuActionFileItem,
  ) {
    this.label = config.label;
    this.icon = config.icon;
    this.mode = config.mode || MenuActionMode.Menu;
    this._showFn = config.show;

    if (this.mode === MenuActionMode.File) {
      this._initFile(config as IFsFilterMenuActionFileItem);
    }

    if ('items' in config) {
      this._isGroup = true;

      if (Array.isArray(config.items)) {
        this.items = config
          .items
          .map((item) => new ActionMenuItem(item, this));
      }

      this.updateVisibility();
    } else {
      this.click = config.click;
      this.routerLink = config.link;

      if (!this._parent) {
        this.updateVisibility();
      }
    }
  }
}
