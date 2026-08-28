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

import { Observable } from 'rxjs';

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

  /**
   * A single select is done as soon as something is picked, so apply it and close the
   * popup the way the single autocomplete filter does. A clear arrives here as a null —
   * closing on that would eject the user before they can type a replacement.
   *
   * A multi select keeps collecting, so it waits for the panel to close instead.
   */
  public modelChange() {
    if(this.item.multiple) {
      return;
    }

    this.item.value = this.value;

    if(this.value) {
      this.close();
    }
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

  public fetch = (keyword): Observable<any> => {
    return this.item.valuesFn(keyword, this.item.filter) as Observable<any>;
  };

  public compareItems(item1, item2): boolean {
    return item1?.value === item2?.value;
  }

  public actionClick(action: any) {
    const filterComponent = this._injector.get(FilterComponent);
    action.click(filterComponent);
  }
}
