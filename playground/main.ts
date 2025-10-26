import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FsFilterModule, ButtonStyle } from '@firestitch/filter';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FsScrollbarModule } from '@firestitch/scrollbar';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { provideRouter } from '@angular/router';
import { ExamplesComponent, NofiltersComponent } from './app/components';
import { DialogExampleComponent } from './app/components/dialog-example';
import { FsFileModule } from '@firestitch/file';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsFilterModule.forRoot({
            buttonStyle: ButtonStyle.Flat,
            persist: true,
        }), FsDatePickerModule.forRoot(), FsScrollbarModule, FormsModule, FsFormModule.forRoot(), FsExampleModule.forRoot({ iframeObserveBody: true }), FsMessageModule.forRoot(), FsFileModule.forRoot({
            allowDownload: true,
            allowRemove: true,
            dragoverMessage: true,
        })),
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { floatLabel: 'auto', appearance: 'outline' },
        },
        provideAnimations(),
        provideRouter([
            { path: '', component: ExamplesComponent, pathMatch: 'full' },
            { path: 'nofilters', component: NofiltersComponent },
            { path: 'dialog', component: DialogExampleComponent },
        ]),
    ]
})
  .catch(err => console.error(err));

