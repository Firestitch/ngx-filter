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
import { FsFilterComponent } from './components/fsfilter/fsfilter.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FsFilter } from './classes/fsfilter.class';
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
    FsFilterComponent
  ],
  providers: [
    FsFilter,
    { provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'never' } }
  ],
  exports: [
    FsFilterComponent
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
