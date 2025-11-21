import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatSlideToggle } from '@angular/material/slide-toggle';

import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';


import { CheckboxItem } from '../../../models/items/checkbox-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    MatSlideToggle,
    FormsModule,
    FsFormModule,
  ],
})
export class CheckboxComponent extends BaseItemComponent<CheckboxItem> implements OnInit {

  public value: boolean;

  public ngOnInit() {
    this.value = this.item.value;
  }

  public change() {
    this.item.setValue(this.value);
    this.close();
  }
  
}
