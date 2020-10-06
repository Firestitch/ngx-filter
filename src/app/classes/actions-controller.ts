import { BehaviorSubject, Observable } from 'rxjs';

import { Action } from '../models/action.model';
import { IFsFilterAction } from '../interfaces/action.interface';


export class ActionsController {

  private _visible$ = new BehaviorSubject(false);
  private _actions$ = new BehaviorSubject<Action[]>([]);
  private _menuActions$ = new BehaviorSubject<Action[]>([]);

  private _allActions: Action[] = [];
  private _reorderAction: Action;

  constructor() {}

  public get menuActions(): Action[] {
    return this._menuActions$.value;
  }

  public get actions(): Action[] {
    return this._actions$.value;
  }

  public get actions$(): Observable<Action[]> {
    return this._actions$.asObservable();
  }

  public get menuActions$(): Observable<Action[]> {
    return this._menuActions$.asObservable();
  }

  public get visible$(): Observable<boolean> {
    return this._visible$.asObservable();
  }

  public initActions(rawActions: IFsFilterAction[]) {
    this.show();

    this._allActions = rawActions
      .map((action) => new Action(action));

    if (this._reorderAction) {
      this._allActions.unshift(this._reorderAction);
    }

    this._classifyActions();
  }

  public show() {
    this._visible$.next(true);
  }

  public hide() {
    this._visible$.next(false);
  }

  public addReorderAction(action: Action) {
    this._allActions.unshift(action);

    action.isReorderAction = true;

    this._classifyAction(action);
    this._reorderAction = action;
  }

  public clearActions() {
    this._allActions = [];
    this._setActions([]);
    this._setKebabActions([]);
  }

  public updateActionsVisibility() {
    this._allActions.forEach((action) => action.updateVisibility());
    this._classifyActions();
  }

  public updateDisabledState() {
    this.actions.forEach((action) => action.updateDisabledState())
  }

  private _setKebabActions(actions: Action[]) {
    this._menuActions$.next(actions);
  }

  private _setActions(actions: Action[]) {
    this._actions$.next(actions);
  }

  private _classifyActions() {
    const kebabActions = [];
    const actions = [];

    this._allActions
      .filter((action) => {
        return action.visible;
      })
      .forEach((action) => {
        if (action.menu) {
          kebabActions.push(action);
        } else {
          actions.push(action);
        }
      });

    this._setKebabActions(kebabActions);
    this._setActions(actions);
  }

  private _classifyAction(action: Action) {
    if (action.menu) {
      this._setKebabActions([...this.menuActions, action ]);
    } else {
      this._setActions( [...this.actions, action ]);
    }
  }
}
