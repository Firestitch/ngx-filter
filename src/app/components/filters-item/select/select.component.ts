import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  KeyValueDiffers,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { Observable } from 'rxjs';

import { BaseSelectItem } from '../../../models/items/select/base-select-item';
import { MultipleSelectItem } from '../../../models/items/select/multiple-select-item';
import { SimpleSelectItem } from '../../../models/items/select/simple-select-item';
import { BaseItemComponent } from '../base-item/base-item.component';

import { SelectGroupsComponent } from './groups/groups.component';
import { SelectMultipleComponent } from './multiple/multiple.component';
import { SelectSimpleComponent } from './simple/simple.component';


@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    SelectMultipleComponent,
    SelectSimpleComponent,
    SelectGroupsComponent,
    AsyncPipe,
  ],
})
export class SelectComponent 
  extends BaseItemComponent<BaseSelectItem> 
  implements DoCheck, OnChanges {

  @ViewChild('selectItem')
  public selectedItem: SelectSimpleComponent | SelectMultipleComponent;
  // For case when we have multiple selection with __all option
  // If _all has been selected than we must disable all other items
  public allItemsOptionSelected = false;

  public get multipleSelectItem(): MultipleSelectItem {
    return this.item as MultipleSelectItem;
  }

  public get simpleSelectItem(): SimpleSelectItem {
    return this.item as SimpleSelectItem;
  }

  public values$: Observable<unknown[]>;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef,
  ) {
    super(_kvDiffers, _cd);
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.values$ = this.item.values$ as Observable<unknown[]>;
    }
  }

  public ngDoCheck() {
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        this._cd.markForCheck();

        if (this.selectedItem) {
          this.selectedItem.markForCheck();
        }
      }
    }
  }
}
