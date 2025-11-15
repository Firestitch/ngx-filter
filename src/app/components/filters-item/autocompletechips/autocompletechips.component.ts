import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsFormModule } from '@firestitch/form';

import { takeUntil } from 'rxjs';

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
export class AutocompletechipsComponent extends BaseItemComponent<AutocompleteChipsItem> implements OnInit {

  public value: any[];
  
  private _injector = inject(Injector);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.item.value$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.value = value;
        this._cdRef.detectChanges();
      });
  }

  public selected(event) {
    if (event.data && this.item.value.indexOf(event.data.value) === -1) {
      this.item.value = [
        ...this.item.value, 
        event.data,
      ];
    }
  }

  public removed(event) {
    this.item.value = this.item.value
      .filter((item) => item.value !== event.data.value);
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
