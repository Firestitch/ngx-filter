import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


import { FsCommonModule } from '@firestitch/common';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { TextItem } from '../../../models/items/text-item';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatPrefix,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    FocusToItemDirective,
    MatSuffix,
    FsCommonModule,
  ],
})
export class TextComponent extends BaseItemComponent<TextItem> implements OnInit, OnDestroy {

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';
  
  public value: string;

  public ngOnInit(): void {
    this.value = this.item.value;
  }

  public ngOnDestroy(): void {
    this.item.value = this.value;
  }

  public keyup(event: KeyboardEvent) {
    if(event.key === 'Enter' || event.code === 'Tab') {
      this.close();
    }
  }

}
