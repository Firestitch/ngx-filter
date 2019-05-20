import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  KeyValueDiffers,
  ViewChild,
} from '@angular/core';
import {
  filter as arrayFilter,
  list as arrayList,
  remove as arrayRemove
} from '@firestitch/common';
import { isObject } from 'lodash-es';

import { BaseItemComponent } from '../base-item/base-item.component';
import { map } from 'rxjs/operators';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletechipsComponent extends BaseItemComponent implements DoCheck {

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    super(_kvDiffers, _cd);
  }

  @ViewChild('chipsInput')
  public chipsInput;

  public ngDoCheck(): void {
    // Hack for reset chips input typed value
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        if (!this.item.selectedValue) {
          this.chipsInput.nativeElement.value = '';
        }
        this._cd.detectChanges();
      }
    }
  }


  public onAutocompleteChipsChange(input) {
    if (!isObject(this.item.selectedValue)) {
      this.item.values$ = this.item.values(this.item.selectedValue)
        .pipe(
          map(values => {
            const selected = arrayList(this.item.model, 'value');
            return arrayFilter(values, (value) => {
              return (<any[]>selected).indexOf(value.value) === -1;
            });
          })
        );
    } else {
      input.value = '';
    }
  }

  public addAutocompleteChipItem($event) {
    this.item.model.push($event.option.value);
    this.itemChange();
  }

  public removeAutocompleteChipItem(item) {
    arrayRemove(this.item.model, {value: item.value});
    this.itemChange();
  }
}
