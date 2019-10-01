import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  KeyValueDiffers,
  ViewChild,
} from '@angular/core';
import { remove as arrayRemove } from '@firestitch/common';

import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html',
  // Commented out because autocomplete not updating properly. Need to figure this out.
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
    // if (this._kvDiffer) {
    //   const changes = this._kvDiffer.diff(this.item);
    //
    //   if (changes) {
    //     if (!this.item.selectedValue) {
    //       this.chipsInput.nativeElement.value = '';
    //     }
    //     this._cd.detectChanges();
    //   }
    // }
  }

  // public onAutocompleteChipsChange(input) {
  //   if (!isObject(this.item.selectedValue)) {
  //     this.item.values$ = this.item.values(this.item.selectedValue)
  //       .pipe(
  //         map(values => {
  //           const selected = arrayList(this.item.model, 'value');
  //           return arrayFilter(values, (value) => {
  //             return (<any[]>selected).indexOf(value.value) === -1;
  //           });
  //         })
  //       );
  //   } else {
  //     input.value = '';
  //   }
  // }

  public addAutocompleteChipItem(event) {
    if (event.data && this.item.model.indexOf(event.data.value) === -1) {
      this.item.model.push(event.data);
      this.itemChange();
    }
  }

  public setSelectedValue(event) {
    this.item.selectedValue = event
      .filter((val) => !!val.data)
      .map((val) => val.data);
  }

  public removeAutocompleteChipItem(event) {
    arrayRemove(this.item.model, {value: event.data.value});
    this.itemChange();
  }
}
