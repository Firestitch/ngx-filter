import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  KeyValueDiffers,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { remove as arrayRemove } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';

import { FocusToItemDirective } from '../../../directives/focus-to-item/focus-to-item.directive';
import { AutocompleteChipsItem } from '../../../models/items/autocomplete-chips-item';
import { FilterComponent } from '../../filter/filter.component';
import { BaseItemComponent } from '../base-item/base-item.component';


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
  
  private _injector = inject(Injector);

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

  public actionClick(action: any) {
    const filterComponent = this._injector.get(FilterComponent);
    action.click(filterComponent);
  }
}
