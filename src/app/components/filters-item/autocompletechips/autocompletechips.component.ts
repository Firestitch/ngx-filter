import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
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
  implements OnInit, OnDestroy {

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';

  public value: any[];
  
  private _injector = inject(Injector);

  public ngOnInit(): void {
    this.value = this.item.value;
  }

  public ngOnDestroy(): void {
    this.item.value = this.value;
  }

  public clear() {
    this.item.clear();
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
