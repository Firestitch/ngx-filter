import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { FsDatepickerModule } from '@firestitch/datepicker';
import { FsCommonModule } from '@firestitch/common';
import { FsStoreModule } from '@firestitch/store';
import { FsFilterComponent } from './fsfilter.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FsCommonModule,
    FsStoreModule,
    FsDatepickerModule,
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


export interface FilterConfigItem {
  name: string;
  type: 'text' | 'select' | 'range' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'autocomplete' | 'autocompletechips' | 'checkbox';
  label: string;
  multiple?: boolean;
  groups?: any;
  wait?: boolean;
  query?: string;
  values?: any;
  values$?: any;
  selectedValue?: any;
  model?: any;
  isolate?: any;
  names?: any;
  primary?: boolean;
  search?: any;
  unchecked?: any;
  alias?: any;
  placeholder?: any;
  default?: any;
}

export interface FilterConfig {
  inline?: boolean;
  load?: boolean;
  namespace?: string;
  persist?: any;
  items: FilterConfigItem[];
  init?: (any) => void;
  change?: (...any) => void;
}



export class FsFilter {
  fsConfig: FilterConfig = {
    load: true,
    persist: false,
    inline: false,
    namespace: 'filter',
    items: []
  };

  constructor() {
  }
}

