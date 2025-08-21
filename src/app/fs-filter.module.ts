import { ModuleWithProviders, NgModule } from '@angular/core';

import { FsStore } from '@firestitch/store';

import { FsFilterActionButtonComponent } from './components/action-button/action-button.component';
import { FsFilterActionKebabActionsComponent } from './components/action-kebab-actions/action-kebab-actions.component';
import { FsFilterActionsComponent } from './components/actions/actions.component';
import { FsFilterChipContentComponent } from './components/filter-chip-content/filter-chip-content.component';
import { FsFilterChipComponent } from './components/filter-chip/filter-chip.component';
import { FsFilterChipsComponent } from './components/filter-chips/filter-chips.component';
import { FsFilterDrawerActionsComponent } from './components/filter-drawer-actions/filter-drawer-actions.component';
import { FilterDrawerComponent } from './components/filter-drawer/filter-drawer.component';
import { FilterComponent } from './components/filter/filter.component';
import { AutocompleteComponent } from './components/filters-item/autocomplete/autocomplete.component';
import { AutocompletechipsComponent } from './components/filters-item/autocompletechips/autocompletechips.component';
import { BaseItemComponent } from './components/filters-item/base-item/base-item.component';
import { CheckboxComponent } from './components/filters-item/checkbox/checkbox.component';
import { ChipsComponent } from './components/filters-item/chips/chips.component';
import { DateRangeComponent } from './components/filters-item/date-range/date-range.component';
import { DateComponent } from './components/filters-item/date/date.component';
import { FilterItemComponent } from './components/filters-item/filter-item.component';
import { RangeComponent } from './components/filters-item/range/range.component';
import { SelectBackdropComponent } from './components/filters-item/select/backdrop/backdrop.component';
import { SelectGroupsComponent } from './components/filters-item/select/groups/groups.component';
import { SelectMultipleComponent } from './components/filters-item/select/multiple/multiple.component';
import { SelectComponent } from './components/filters-item/select/select.component';
import { SelectSimpleComponent } from './components/filters-item/select/simple/simple.component';
import { TextComponent } from './components/filters-item/text/text.component';
import { WeekComponent } from './components/filters-item/week/week.component';
import { FsSavedFilterAutocompleteChipsComponent } from './components/saved-filter';
import { FocusToItemDirective } from './directives/focus-to-item/focus-to-item.directive';
import { FilterStatusBarDirective } from './directives/status-bar/status-bar.directive';
import { FS_FILTER_CONFIG } from './injectors/filter-config';
import { FilterConfig } from './interfaces/config.interface';
import { FsFilterIsolateValues } from './pipes/remove-isolate-value.pipe';


@NgModule({
  imports: [
    FsSavedFilterAutocompleteChipsComponent,
    BaseItemComponent,
    FilterComponent,
    FilterItemComponent,
    FsFilterChipsComponent,
    SelectComponent,
    SelectGroupsComponent,
    SelectSimpleComponent,
    SelectMultipleComponent,
    ChipsComponent,
    TextComponent,
    WeekComponent,
    RangeComponent,
    AutocompleteComponent,
    AutocompletechipsComponent,
    DateComponent,
    DateRangeComponent,
    CheckboxComponent,
    FilterDrawerComponent,
    SelectBackdropComponent,
    FsFilterChipComponent,
    FsFilterChipContentComponent,
    FsFilterDrawerActionsComponent,
    FsFilterActionsComponent,
    FsFilterActionButtonComponent,
    FsFilterActionKebabActionsComponent,
    FilterStatusBarDirective,
    FocusToItemDirective,
    FsFilterIsolateValues,
  ],
  providers: [
    FsStore,
  ],
  exports: [
    FilterComponent,
    FilterStatusBarDirective,
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
