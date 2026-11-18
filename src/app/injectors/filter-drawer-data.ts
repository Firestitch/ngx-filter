import { InjectionToken, WritableSignal } from '@angular/core';

import { OverlayRef } from '@angular/cdk/overlay';

import { IFilterConfigItem } from '../interfaces';
import { BaseItem } from '../models/items';

/**
 * A chip's popup: the item it edits, and whether it was closed with Escape (canceled), in
 * which case its fields apply nothing as they go away.
 */
export const FILTER_DRAWER_DATA = new InjectionToken<{
  item: BaseItem<IFilterConfigItem>,
  autofocusName: string,
  overlayRef: OverlayRef,
  canceled: WritableSignal<boolean>,
}>('fs.filter-drawer-data');
