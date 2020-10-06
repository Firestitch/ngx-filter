import { ActionType } from '../enums/action-type.enum';


export interface IFsFilterAction {
  primary?: boolean;
  icon?: string;
  label?: string;
  menu?: boolean;
  className?: string;
  click?: (event) => void;
  type?: ActionType;
  customize?: boolean;
  show?: () => boolean;
  disabled?: () => boolean;
  tabIndex?: number;
}
