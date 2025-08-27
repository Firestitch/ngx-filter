import { InjectionToken } from '@angular/core';

export interface FsFilterMeta {
  openedFilters: number;
}

export const FS_FILTER_META =
  new InjectionToken<FsFilterMeta>('fs.filter.meta',
    {
      providedIn: 'root',
      factory: () => {
        return {
          openedFilters: 0,
        };
      },
    },
  );
