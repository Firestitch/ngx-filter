import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output
} from '@angular/core';

import { FsFilterConfigItem } from '../../../models/filter-item';


@Component({
  selector: 'base-item',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseItemComponent implements DoCheck {
  @Input()
  set item(value) {
    this._item = value;
  };

  @Input() public inline = false;
  @Output() public itemChanged = new EventEmitter();

  protected _item: FsFilterConfigItem;
  protected _kvDiffer: KeyValueDiffer<string, any>;

  constructor(
    protected _kvDiffers: KeyValueDiffers,
    protected _cd: ChangeDetectorRef
  ) {
    this._kvDiffer = this._kvDiffers.find(this.item || {}).create();
  }

  get item() {
    return this._item
  }

  public ngDoCheck(): void {
    if (this._kvDiffer) {
      const changes = this._kvDiffer.diff(this.item);

      if (changes) {
        this._cd.detectChanges();
      }
    }
  }

  public itemChange() {

    if (this.item.change) {
      this.item.change(this.item);
    }

    this.itemChanged.next(this.item);
  }
}
