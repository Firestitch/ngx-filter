import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MAT_LABEL_GLOBAL_OPTIONS
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsCommonModule } from '@firestitch/common';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FsChipModule } from '@firestitch/chip';
import { FsLabelModule } from '@firestitch/label';

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
import { CheckboxComponent } from './components/filters-item/checkbox/checkbox.component';
import { BaseItemComponent } from './components/filters-item/base-item/base-item.component';
import { FsFilterChipsComponent } from './components/filter-chips/filter-chips.component';
import { FilterDrawerComponent } from './components/filter-drawer/filter-drawer.component';
import { FsItemToChip } from './filters/item-to-chip.filter';


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
    CheckboxComponent,
    FilterDrawerComponent,

    // Pipes
    FsItemToChip,
  ],
  providers: [
    FsStore,
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'never' } }
  ],
  exports: [
    FilterComponent,
  ],
  entryComponents: [
    FilterDrawerComponent
  ]
})
export class FsFilterModule {
}
