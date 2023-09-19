import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsExampleModule } from '@firestitch/example';
import { ButtonStyle, FsFilterModule } from '@firestitch/filter';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { ExamplesComponent, KitchenSinkComponent, NofiltersComponent } from './components';
import { DialogComponent } from './components/dialog';
import { DialogExampleComponent } from './components/dialog-example';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsFilterModule.forRoot({
      button: {
        style: ButtonStyle.Flat,
        label: '',
      },
    }),
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
    ],
      { relativeLinkResolution: 'legacy' }),
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
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } }
  ],
})
export class PlaygroundModule {
}
