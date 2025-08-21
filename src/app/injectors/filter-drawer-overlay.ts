import { InjectionToken } from '@angular/core';

import { OverlayRef } from '@angular/cdk/overlay';

export const FILTER_DRAWER_OVERLAY = new InjectionToken<OverlayRef>('fs.filter-drawer-overlay');
