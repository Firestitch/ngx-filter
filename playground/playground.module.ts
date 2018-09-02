import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FsFilterModule } from '../src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app/material.module';
import { RouterModule } from '@angular/router';
import { FsExampleModule } from '@firestitch/example';
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
    FsExampleModule,
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
