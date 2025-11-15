import { ModuleWithProviders, NgModule } from '@angular/core';

import { FsStore } from '@firestitch/store';

import { FilterComponent } from './components/filter/filter.component';
import { FilterHeadingDirective, FilterStatusBarDirective, FocusToItemDirective } from './directives';
import { FS_FILTER_CONFIG } from './injectors/filter-config';
import { FilterConfig } from './interfaces/config.interface';


@NgModule({
  imports: [
    FilterComponent,
    FilterStatusBarDirective,
    FilterHeadingDirective,
    FocusToItemDirective,
  ],
  providers: [
    FsStore,
  ],
  exports: [
    FilterComponent,
    FilterStatusBarDirective,
    FilterHeadingDirective, 
  ],
})
export class FsFilterModule {
  public static forRoot(config: FilterConfig = {}): ModuleWithProviders<FsFilterModule> {
    return {
      ngModule: FsFilterModule,
      providers: [
        {
          provide: FS_FILTER_CONFIG,
          useValue: {
            button: {
              label: '',
            },
            ...config,
          } as FilterConfig,
        },
      ],
    };
  }
}
