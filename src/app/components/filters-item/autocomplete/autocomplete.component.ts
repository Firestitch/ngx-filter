import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsFormModule } from '@firestitch/form';

import { Observable } from 'rxjs';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { AutocompleteItem } from '../../../models/items/autocomplete-item';
import { BaseItemComponent } from '../base-item/base-item.component';


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

  @Input() public autofocus: boolean = false;

  public displayWith = (data) => {
    return data ? data.name : data;
  };

  public fetch = (keyword): Observable<any> => {
    return this.item.valuesFn(keyword, this.item.filter) as Observable<any>;
  };
}
