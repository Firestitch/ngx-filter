import { FilterConfig } from './interfaces/config.interface';
import { FS_FILTER_CONFIG } from './injectors/filter-config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { FlexLayoutModule } from '@angular/flex-layout';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsCommonModule } from '@firestitch/common';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FsChipModule } from '@firestitch/chip';
import { FsLabelModule } from '@firestitch/label';
import { FsScrollModule } from '@firestitch/scroll';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

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
import { FsItemToChip } from './pipes/item-to-chip.pipe';
import { SelectBackdropComponent } from './components/filters-item/select/backdrop/backdrop.component';
import { FsFilterChipComponent } from './components/filter-chip/filter-chip.component';
import { FsFilterIsolateValues } from './pipes/remove-isolate-value.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
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

    // Pipes
    FsItemToChip,
    FsFilterIsolateValues,
  ],
  providers: [
    FsStore,
  ],
  exports: [
    FilterComponent,
  ],
  entryComponents: [
    FilterDrawerComponent
  ]
})
export class FsFilterModule {
  static forRoot(config: FilterConfig = {}): ModuleWithProviders {
    return {
      ngModule: FsFilterModule,
      providers: [
        { provide: FS_FILTER_CONFIG, useValue: config || {} }
      ]
    };
  }
}
