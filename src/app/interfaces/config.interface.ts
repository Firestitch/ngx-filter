import { FilterConfigItem } from './item-config.interface';

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  autofocus?: boolean;
  namespace?: string;
  persist?: any;
  reload?: (query: any) => void | false;
  items: FilterConfigItem[];
  init?: (any) => void;
  change?: (...any) => void;
}
