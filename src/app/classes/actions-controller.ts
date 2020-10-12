import { Injectable, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { Action } from '../models/action.model';
import { FsFilterAction } from '../interfaces/action.interface';


@Injectable()
export class ActionsController implements OnDestroy {

  private _visible$ = new BehaviorSubject(false);
  private _actions$ = new BehaviorSubject<Action[]>([]);
  private _menuActions$ = new BehaviorSubject<Action[]>([]);
  private _destroy$ = new Subject<void>();

  private readonly _mobileMedia = '(max-width: 799px)';
  private _allActions: Action[] = [];
  private _reorderAction: Action;

  constructor(
    private _breakpointObserver: BreakpointObserver,
  ) {
    this._listenMobileMedia();
  }

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

  public get mobileMode(): boolean {
    return this._breakpointObserver.isMatched(this._mobileMedia);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public initActions(rawActions: FsFilterAction[]) {
    if (!rawActions || !Array.isArray(rawActions)) {
      return;
    }

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
    const mobileMode = this.mobileMode;

    this._allActions
      .filter((action) => {
        return action.visible;
      })
      .forEach((action) => {
        if (action.menu || mobileMode) {
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

  private _listenMobileMedia() {
    this._breakpointObserver.observe(this._mobileMedia)
      .pipe(
        skip(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._classifyActions();
      })
  }
}
