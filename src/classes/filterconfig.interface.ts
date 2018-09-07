import { FilterConfigItem } from './filterconfigitem.interface';

export interface FilterConfig {
    inline?: boolean;
    load?: boolean;
    autofocus?: boolean;
    namespace?: string;
    persist?: any;
    items: FilterConfigItem[];
    init?: (any) => void;
    change?: (...any) => void;
  }
