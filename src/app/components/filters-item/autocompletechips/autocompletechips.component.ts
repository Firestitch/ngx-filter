import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteChipsComponent, FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsFormModule } from '@firestitch/form';


import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { AutocompleteChipsItem } from '../../../models/items/autocomplete-chips-item';
import { FilterComponent } from '../../filter/filter.component';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html',
  styleUrls: ['./autocompletechips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsAutocompleteChipsModule,
    FocusToItemDirective,
    FormsModule,
    FsFormModule,
  ],
})
export class AutocompletechipsComponent 
  extends BaseItemComponent<AutocompleteChipsItem> 
  implements OnInit {

  @ViewChild(FsAutocompleteChipsComponent)
  public autocompleteChips: FsAutocompleteChipsComponent;

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  private _injector = inject(Injector);

  public panelClosed() {
    this.item.value = this.value;
  }

  public removed() {
    if(!this.autocompleteChips.panelOpen) {
      this.item.value = this.value;
    }
  }

  public clear() {
    this.item.clear();
    this.close();
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
