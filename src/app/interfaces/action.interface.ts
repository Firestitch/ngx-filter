import { ThemePalette } from '@angular/material/core';

import { FsFile } from '@firestitch/file';

import { ActionMode } from '../enums/action-mode.enum';
import { ActionType } from '../enums/action-type.enum';


type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type FsFilterAction = (IFsFilterButtonAction | IFsFilterMenuAction | IFsFilterFileAction | IFsFilterSelectButtonAction);
export type FsFilterActionShowFn = () => boolean;
export type FsFilterActionDisabledFn = () => boolean;
export type FsFilterActionClickFn = (event?: MouseEvent) => void;
export type FsFilterFileActionSelectFn = (file: FsFile | FsFile[]) => void;
export type FsFilterFileActionErrorFn = (error: unknown) => void;


interface IFsFilterBaseAction {
  type?: ActionType;
  className?: string;
  color?: ThemePalette;
  tooltip?: string;
  icon?: string;
  iconPlacement?: 'left' | 'right';
  label?: string;
  primary?: boolean;
  show?: FsFilterActionShowFn;
  click?: FsFilterActionClickFn;
  tabIndex?: number;
  menu?: boolean;
}

export interface IFsFilterButtonAction extends IFsFilterBaseAction {
  mode?: ActionMode.Button;
  customize?: boolean;
  disabled?: FsFilterActionDisabledFn;
}

export interface IFsFilterSelectButtonAction extends IFsFilterBaseAction {
  mode?: ActionMode.SelectButton;
  disabled?: FsFilterActionDisabledFn;
  values?: { name: string, value: any }[];
  default?: any;
  change?: (value) => void;
  deselect?: boolean;
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
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  imageQuality?: number;
}

export interface IFsFilterMenuActionGroupItem {
  label?: string;
  icon?: string;
  show?: FsFilterActionShowFn;
  items: IFsFilterMenuActionItem[];
}

export interface IFsFilterMenuActionItem {
  label?: string;
  icon?: string;
  click?: FsFilterActionClickFn;
  link?: IFsFilterMenuActionLink;
  show?: FsFilterActionShowFn;
}

export interface IFsFilterMenuActionLink {
  link: any[] | string;
  queryParams?: Record<string, any>;
}
