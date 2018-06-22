import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MAT_PLACEHOLDER_GLOBAL_OPTIONS } from '@angular/material';
import {  MatIconModule,
          MatInputModule,
          MatSelectModule,
          MatChipsModule,
          MatAutocompleteModule,
          MatButtonModule,
          MatCheckboxModule
         } from '@angular/material';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsCommonModule } from '@firestitch/common';
import { FsStoreModule } from '@firestitch/store';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterComponent } from './components/filter/filter.component';
import { FiltersListComponent } from './components/filters-list/filters-list.component';
import { FilterItemComponent } from './components/filters-item/filter-item.component';
import { SelectComponent } from './components/filters-item/select/select.component';
import { TextComponent } from './components/filters-item/text/text.component';
import { RangeComponent } from './components/filters-item/range/range.component';
import { AutocompleteComponent } from './components/filters-item/autocomplete/autocomplete.component';
import { AutocompletechipsComponent } from './components/filters-item/autocompletechips/autocompletechips.component';
import { DateComponent } from './components/filters-item/date/date.component';
import { CheckboxComponent } from './components/filters-item/checkbox/checkbox.component';
import { BaseItemComponent } from './components/filters-item/base-item/base-item.component';
export * from './classes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FsCommonModule,
    FsStoreModule,
    FsDatePickerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  declarations: [
    BaseItemComponent,
    FilterComponent,
    FiltersListComponent,
    FilterItemComponent,
    SelectComponent,
    TextComponent,
    RangeComponent,
    AutocompleteComponent,
    AutocompletechipsComponent,
    DateComponent,
    CheckboxComponent,
  ],
  providers: [
    // FsFilter,
    { provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'never' } }
  ],
  exports: [
    // FsFilterComponent,
    FilterComponent,
  ]
})
export class FsFilterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsFilterModule,
      providers: []
    };
  }
}
