import { BehaviorSubject, Observable } from 'rxjs';
import { ActionType } from '../enums/action-type.enum';
import { IFsFilterAction } from '../interfaces/action.interface';


export class Action {

  public primary = true;
  public icon: string;
  public label: string;
  public menu: boolean;
  public customize: boolean;
  public className: string;
  public click: Function;
  public type: ActionType;
  public tabIndex: number;

  public isReorderAction = false;

  public classArray: string[] = [];

  private _visible = true;
  private _disabled$ = new BehaviorSubject<boolean>(false);

  private _showFn: () => boolean;
  private _disabledFn: () => boolean;

  constructor(config: IFsFilterAction = {}) {
    this._init(config);
  }

  public get visible(): boolean {
    return this._visible;
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

  public updateVisibility() {
    if (this._showFn) {
      this._visible = this._showFn();
    }
  }

  public updateDisabledState() {
    if (this._disabled$) {
      this.disabled = this._disabledFn();
    }
  }

  private _init(config: IFsFilterAction) {
    this.type = config.type;
    this.icon = config.icon;
    this.label = config.label;
    this.menu = config.menu;
    this.customize = config.customize;
    this.tabIndex = config.tabIndex ?? 0;
    this.primary = config.primary ?? true;
    this._showFn = config.show;
    this._disabledFn = config.disabled;

    this.click = config.click ?? (() => { });

    if (config.className) {
      this.classArray = this.className
        .split(' ');
    }

    if (this.primary) {
      this.classArray.push('mat-primary');
    }

    this.className = config.className;
  }
}
