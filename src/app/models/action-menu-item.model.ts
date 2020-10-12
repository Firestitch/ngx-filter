import { BehaviorSubject, Observable } from 'rxjs';
import {
  FsFilterAction, FsFilterActionClickFn, FsFilterActionShowFn,
  IFsFilterMenuActionGroupItem,
  IFsFilterMenuActionItem, IFsFilterMenuActionLink
} from '../interfaces/action.interface';


export class ActionMenuItem {

  public icon: string;
  public label: string;
  public click: FsFilterActionClickFn;
  public routerLink: IFsFilterMenuActionLink;
  public items: ActionMenuItem[] = [];

  private _isGroup = false;
  private _showFn: FsFilterActionShowFn;
  private _visible$ = new BehaviorSubject<boolean>(true);
  private _disabled$ = new BehaviorSubject<boolean>(false);

  constructor(
    config: FsFilterAction = {},
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
    const visible = !!this._showFn ? this._showFn() : true;

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

  private _init(config: IFsFilterMenuActionGroupItem | IFsFilterMenuActionItem) {
    this.label = config.label;
    this._showFn = config.show;

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
