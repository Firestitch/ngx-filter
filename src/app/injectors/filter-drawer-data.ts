import { InjectionToken } from '@angular/core';

import { OverlayRef } from '@angular/cdk/overlay';

import { IFilterConfigItem } from '../interfaces';
import { BaseItem } from '../models/items';

export const FILTER_DRAWER_DATA = new InjectionToken<{ item: BaseItem<IFilterConfigItem>, autofocusName: string, overlayRef: OverlayRef }>('fs.filter-drawer-data');
