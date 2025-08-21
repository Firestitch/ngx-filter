import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers,
} from '@angular/core';

import { remove as arrayRemove } from '@firestitch/common';

import { AutocompleteChipsItem } from '../../../models/items/autocomplete-chips-item';
import { BaseItemComponent } from '../base-item/base-item.component';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'filter-item-autocompletechips',
    templateUrl: './autocompletechips.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsAutocompleteChipsModule,
        FocusToItemDirective,
        FormsModule,
        FsFormModule,
    ],
})
export class AutocompletechipsComponent extends BaseItemComponent<AutocompleteChipsItem> {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }

  public addAutocompleteChipItem(event) {
    if (event.data && this.item.model.indexOf(event.data.value) === -1) {
      this.item.model.push(event.data);
      this.itemChange();
    }
  }

  public removeAutocompleteChipItem(event) {
    arrayRemove(this.item.model, { value: event.data.value });
    this.itemChange();
  }

  public clearAutocompleteChipItem() {
    this.item.clear();
    this.itemChange();
  }

  public fetch = (keyword) => {
    return this.item.valuesFn(keyword, this.item.filter);
  };

  public compareItems(item1, item2): boolean {
    return item1?.value === item2?.value;
  }
}
