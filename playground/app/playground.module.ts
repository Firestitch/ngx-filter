import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsFormModule } from '@firestitch/form';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ExamplesComponent, KitchenSinkComponent, NofiltersComponent } from './components';
import { DialogComponent } from './components/dialog';
import { DialogExampleComponent } from './components/dialog-example';
import { AppMaterialModule } from './material.module';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsFilterModule.forRoot(),
    FsDatePickerModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FsScrollbarModule,
    FormsModule,
    FsFormModule.forRoot(),
    FsExampleModule.forRoot({ iframeObserveBody: true }),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot([
      { path: '', component: ExamplesComponent, pathMatch: 'full' },
      { path: 'nofilters', component: NofiltersComponent },
      { path: 'dialog', component: DialogExampleComponent },
    ],
      {}),
    FsFileModule.forRoot({
      allowDownload: true,
      allowRemove: true,
      dragoverMessage: true,
    }),
  ],
  declarations: [
    AppComponent,
    KitchenSinkComponent,
    NofiltersComponent,
    ExamplesComponent,
    DialogExampleComponent,
    DialogComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
  ],
})
export class PlaygroundModule {
}
