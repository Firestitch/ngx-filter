import { IFilterConfigItem } from './item-config.interface';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  chips?: boolean;
  autofocus?: boolean;
  namespace?: string;
  persist?: any;
  reload?: (query: any) => void | false;
  items: IFilterConfigItem[];
  init?: (any) => void;
  change?: (...any) => void;
}
