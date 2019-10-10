import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';
import { remove as arrayRemove } from '@firestitch/common';

import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletechipsComponent extends BaseItemComponent {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public addAutocompleteChipItem(event) {
    if (event.data && this.item.model.indexOf(event.data.value) === -1) {
      this.item.model.push(event.data);
      this.itemChange();
    }
  }

  public setSelectedValue(event) {
    this.item.selectedValue = event
      .filter((val) => !!val.data)
      .map((val) => val.data);
  }

  public removeAutocompleteChipItem(event) {
    arrayRemove(this.item.model, {value: event.data.value});
    this.itemChange();
  }
}
