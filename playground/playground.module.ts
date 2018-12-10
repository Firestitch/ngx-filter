import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';

import { ToastrModule } from 'ngx-toastr';

import { FsFilterModule } from '../src';
import { AppComponent } from './app/app.component';
import { AppMaterialModule } from './app/material.module';

import {  SecondExampleComponent,
          NofiltersComponent,
          ExamplesComponent } from './app/components';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsFilterModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot({ iframeObserveBody: true }),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot([
      { path: '', component: ExamplesComponent, pathMatch: 'full' },
      { path: 'nofilters', component: NofiltersComponent }
    ])
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    SecondExampleComponent,
    NofiltersComponent,
    ExamplesComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
