import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsFilterModule } from '@firestitch/filter';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';

import { ExamplesComponent, NofiltersComponent, KitchenSinkComponent } from './components';
import { DialogExampleComponent } from './components/dialog-example';
import { DialogComponent } from './components/dialog';


@NgModule({
  bootstrap: [AppComponent],
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
      { path: 'organizations', component: ExamplesComponent, pathMatch: 'full' },
      { path: 'item', component: NofiltersComponent, pathMatch: 'full' },
      { path: 'nofilters', component: NofiltersComponent },
      { path: 'dialog', component: DialogExampleComponent }
    ],
      {
        enableTracing: true,
      })
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
  providers: [],
})
export class PlaygroundModule {
}
