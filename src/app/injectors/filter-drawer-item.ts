import { InjectionToken } from '@angular/core';

import { IFilterConfigItem } from '../interfaces';
import { BaseItem } from '../models/items';

/** Injection token that can be used to access the data that was passed in to a drawer. */
export const FILTER_DRAWER_DATA = new InjectionToken<{ item: BaseItem<IFilterConfigItem>, name: string }>('fs.filter-drawer-data');
