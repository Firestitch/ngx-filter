import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AutocompleteItem } from '../../../models/items/autocomplete-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocomplete',
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
