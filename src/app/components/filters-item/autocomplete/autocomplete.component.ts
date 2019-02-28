import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  KeyValueDiffers
} from '@angular/core';
import { isObject } from 'lodash-es';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocomplete',
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent extends BaseItemComponent {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  public onAutocompleteChange() {
    if (isObject(this.item.model)) {
      this.itemChange();
    } else {
      this.item.values$ = this.item.values(this.item.model);
    }
  }

  public displayAutocomplete(data): string {
    return data ? data.name : data;
  }
}
