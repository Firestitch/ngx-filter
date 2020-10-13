import { FilterConfig } from './interfaces/config.interface';
import { FS_FILTER_CONFIG } from './injectors/filter-config';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PortalModule } from '@angular/cdk/portal';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsCommonModule } from '@firestitch/common';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FsChipModule } from '@firestitch/chip';
import { FsLabelModule } from '@firestitch/label';
import { FsScrollModule } from '@firestitch/scroll';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsMaskModule } from '@firestitch/mask';
import { FsMenuModule } from '@firestitch/menu';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsFormModule } from '@firestitch/form';

import { FilterComponent } from './components/filter/filter.component';
import { FilterItemComponent } from './components/filters-item/filter-item.component';
import { SelectComponent } from './components/filters-item/select/select.component';
import { SelectGroupsComponent } from './components/filters-item/select/groups/groups.component';
import { SelectSimpleComponent } from './components/filters-item/select/simple/simple.component';
import { SelectMultipleComponent } from './components/filters-item/select/multiple/multiple.component';
import { ChipsComponent } from './components/filters-item/chips/chips.component';
import { TextComponent } from './components/filters-item/text/text.component';
import { RangeComponent } from './components/filters-item/range/range.component';
import { AutocompleteComponent } from './components/filters-item/autocomplete/autocomplete.component';
import { AutocompletechipsComponent } from './components/filters-item/autocompletechips/autocompletechips.component';
import { DateComponent } from './components/filters-item/date/date.component';
import { DateRangeComponent } from './components/filters-item/date-range/date-range.component';
import { CheckboxComponent } from './components/filters-item/checkbox/checkbox.component';
import { BaseItemComponent } from './components/filters-item/base-item/base-item.component';
import { FsFilterChipsComponent } from './components/filter-chips/filter-chips.component';
import { FilterDrawerComponent } from './components/filter-drawer/filter-drawer.component';
import { SelectBackdropComponent } from './components/filters-item/select/backdrop/backdrop.component';
import { FsFilterChipComponent } from './components/filter-chip/filter-chip.component';
import { FsFilterDrawerActionsComponent } from './components/filter-drawer-actions/filter-drawer-actions.component';
import { FsFilterIsolateValues } from './pipes/remove-isolate-value.pipe';
import { FilterStatusBarDirective } from './directives/status-bar/status-bar.directive';
import { FocusToItemDirective } from './directives/focus-to-item/focus-to-item.directive';
import { FsFilterChipContentComponent } from './components/filter-chip-content/filter-chip-content.component';
import { FsFilterSavedFilterEditComponent } from './components/saved-filter-edit/saved-filter-edit.component';
import { FsSavedFiltersMenuComponent } from './components/saved-filters-menu/saved-filters-menu.component';
import { FsFilterActionsComponent } from './components/actions/actions.component';
import { FsFilterActionButtonComponent } from './components/action-button/action-button.component';
import { FsFilterActionKebabActionsComponent } from './components/action-kebab-actions/action-kebab-actions.component';
import { FsFileModule } from '@firestitch/file';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    FlexLayoutModule,
    FsChipModule,
    FsCommonModule,
    FsStoreModule,
    FsDatePickerModule,
    FsLabelModule,
    FsAutocompleteModule,
    FsAutocompleteChipsModule,
    FsScrollModule,
    PortalModule,
    FsMaskModule,
    FsMenuModule,
    FsSkeletonModule,
    FsFormModule,
    FsFileModule,
  ],
  declarations: [
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
    FsFilterSavedFilterEditComponent,
    FsSavedFiltersMenuComponent,
    FsFilterActionsComponent,
    FsFilterActionButtonComponent,
    FsFilterActionKebabActionsComponent,

    FilterStatusBarDirective,
    FocusToItemDirective,

    // Pipes
    FsFilterIsolateValues,
  ],
  providers: [
    FsStore,
  ],
  exports: [
    FilterComponent,
    FilterStatusBarDirective,
    FsSavedFiltersMenuComponent,
  ],
  entryComponents: [
    FilterDrawerComponent
  ]
})
export class FsFilterModule {
  static forRoot(config: FilterConfig = {}): ModuleWithProviders<FsFilterModule> {
    return {
      ngModule: FsFilterModule,
      providers: [
        { provide: FS_FILTER_CONFIG, useValue: config || {} }
      ]
    };
  }
}
