import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsFilterModule } from '@firestitch/filter';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';

import { ExamplesComponent, NofiltersComponent, KitchenSinkComponent } from './components';
import { DialogExampleComponent } from './components/dialog-example';
import { DialogComponent } from './components/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FsFormModule } from '@firestitch/form';
import { FsFileModule } from '@firestitch/file';


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
    { path: 'dialog', component: DialogExampleComponent }
], { relativeLinkResolution: 'legacy' }),
    FsFileModule.forRoot({
      allowDownload: true,
      allowRemove: true,
      dragoverMessage: true,
    }),
  ],
  entryComponents: [
    DialogComponent
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
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } }
  ],
})
export class PlaygroundModule {
}
