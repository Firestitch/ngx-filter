import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  KeyValueDiffers,
  Component,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';
import { SelectSimpleComponent } from './simple/simple.component';
import { SelectMultipleComponent } from './multiple/multiple.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'filter-item-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends BaseItemComponent<any> implements DoCheck {

  @ViewChild('selectItem')
  public selectedItem: SelectSimpleComponent | SelectMultipleComponent;
  // For case when we have multiple selection with __all option
  // If _all has been selected than we must disable all other items
  public allItemsOptionSelected = false;

  public values$: Observable<any>;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
    this.values$ = this.item.values$ as Observable<unknown>;
  }

  public ngDoCheck() {
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        this._cd.markForCheck();

        if (this.selectedItem) {
          this.selectedItem.cd.markForCheck();
        }
      }
    }
  }
}
