import { Component } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import * as _isObject from 'lodash/isObject';


@Component({
  selector: 'filter-item-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent extends BaseItemComponent {

  constructor() {
    super();
  }

  public onAutocompleteChange() {
    if (_isObject(this.item.model)) {
      this.itemChange();
    } else {
      this.item.values$ = this.item.values(this.item.model);
    }
  }

  public displayAutocomplete(data): string {
    return data ? data.name : data;
  }
}
