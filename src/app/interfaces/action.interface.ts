import { ThemePalette } from '@angular/material/core';

import { ActionType } from '../enums/action-type.enum';
import { ActionMode } from '../enums/action-mode.enum';


export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type FsFilterAction = (IFsFilterBasicAction | IFsFilterMenuAction);
export type FsFilterActionShowFn = () => boolean;
export type FsFilterActionClickFn = (event?: MouseEvent) => void;

export interface IFsFilterBasicAction {
  primary?: boolean;
  icon?: string;
  label?: string;
  menu?: boolean;
  className?: string;
  click?: FsFilterActionClickFn;
  type?: ActionType;
  mode?: ActionMode.Button;
  customize?: boolean;
  show?: FsFilterActionShowFn;
  disabled?: () => boolean;
  tabIndex?: number;
  color?: ThemePalette;
}

export interface IFsFilterMenuAction {
  type?: ActionType;
  mode: ActionMode.Menu;
  className?: string;
  color?: ThemePalette;
  label?: string;
  primary?: boolean;
  show?: FsFilterActionShowFn;
  items: XOR<IFsFilterMenuActionGroupItem, IFsFilterMenuActionItem>[];
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
