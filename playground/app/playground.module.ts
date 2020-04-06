import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsFilterModule } from '@firestitch/filter';
import { FsDatePickerModule } from '@firestitch/datepicker';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';

import { ExamplesComponent, NofiltersComponent, KitchenSinkComponent } from './components';
import { DialogExampleComponent } from './components/dialog-example';
import { DialogComponent } from './components/dialog';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsFilterModule.forRoot(),
    FsDatePickerModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot({ iframeObserveBody: true }),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot([
      { path: '', component: ExamplesComponent, pathMatch: 'full' },
      { path: 'nofilters', component: NofiltersComponent },
      { path: 'dialog', component: DialogExampleComponent }
    ])
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
    DialogComponent
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }
  ],
})
export class PlaygroundModule {
}
