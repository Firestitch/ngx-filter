import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AutocompleteItem } from '../../../models/items/autocomplete-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-autocomplete',
    templateUrl: './autocomplete.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsAutocompleteModule,
        FocusToItemDirective,
        FormsModule,
        FsFormModule,
    ],
})
export class AutocompleteComponent extends BaseItemComponent<AutocompleteItem> {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public displayWith = (data) => {
    return data ? data.name : data;
  };

  public fetch = (keyword): Observable<any> => {
    return this.item.valuesFn(keyword, this.item.filter) as Observable<any>;
  };
}
