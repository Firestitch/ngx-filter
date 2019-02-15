import { Component } from '@angular/core';
import {
  filter as arrayFilter,
  list as arrayList,
  remove as arrayRemove
} from '@firestitch/common';
import { isObject } from 'lodash-es';

import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html'
})
export class AutocompletechipsComponent extends BaseItemComponent {

  constructor() {
    super();
  }

  public onAutocompleteChipsChange(input) {
    if (!isObject(this.item.selectedValue)) {
      this.item.values$ = this.item.values(this.item.selectedValue)
        .map(values => {
          const selected = arrayList(this.item.model, 'value');
          return arrayFilter(values, (value) => {
            return (<any[]>selected).indexOf(value.value) === -1;
          });
        });
    } else {
      input.value = '';
    }
  }


  public addAutocompleteChipItem($event) {
    this.item.model.push($event.option.value);
    this.itemChange();
  }

  public removeAutocompleteChipItem(item) {
    arrayRemove(this.item.model, {value: item.value});
    this.itemChange();
  }
}
