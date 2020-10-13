import { ThemePalette } from '@angular/material/core';

import { ActionType } from '../enums/action-type.enum';
import { ActionMode } from '../enums/action-mode.enum';
import { FsFile } from '@firestitch/file';


type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type FsFilterAction = (IFsFilterButtonAction | IFsFilterMenuAction | IFsFilterFileAction);
export type FsFilterActionShowFn = () => boolean;
export type FsFilterActionDisabledFn = () => boolean;
export type FsFilterActionClickFn = (event?: MouseEvent) => void;
export type FsFilterFileActionSelectFn = (file: FsFile) => void;
export type FsFilterFileActionErrorFn = (error: unknown) => void;


interface IFsFilterBaseAction {
  type?: ActionType;
  className?: string;
  color?: ThemePalette;
  icon?: string;
  label?: string;
  primary?: boolean;
  show?: FsFilterActionShowFn;
  click?: FsFilterActionClickFn;
  tabIndex?: number;
}

export interface IFsFilterButtonAction extends IFsFilterBaseAction {
  menu?: boolean;
  mode?: ActionMode.Button;
  customize?: boolean;
  disabled?: FsFilterActionDisabledFn;
}

export interface IFsFilterMenuAction extends IFsFilterBaseAction {
  mode: ActionMode.Menu;
  label?: string;
  items: XOR<IFsFilterMenuActionGroupItem, IFsFilterMenuActionItem>[];
}

export interface IFsFilterFileAction extends IFsFilterBaseAction {
  mode: ActionMode.File;
  select: FsFilterFileActionSelectFn;
  error?: FsFilterFileActionErrorFn;
  click?: FsFilterActionClickFn;
  multiple?: boolean;
  accept?: string;
  disabled?: FsFilterActionDisabledFn;
}

export interface IFsFilterMenuActionGroupItem {
  label?: string;
  show?: FsFilterActionShowFn;
  items: IFsFilterMenuActionItem[];
}

export interface IFsFilterMenuActionItem {
  label?: string;
  click?: FsFilterActionClickFn;
  link?: IFsFilterMenuActionLink;
  show?: FsFilterActionShowFn;
}

export interface IFsFilterMenuActionLink {
  link: any[] | string;
  queryParams?: Record<string, any>;
}
