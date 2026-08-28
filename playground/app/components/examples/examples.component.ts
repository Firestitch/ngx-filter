import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsExampleModule } from '@firestitch/example';

import { environment } from '../../../environments/environment';
import { ActionButtonsComponent, ActionMenusComponent } from '../actions';
import { KitchenSinkComponent } from '../advanced';
import {
  AutocompleteChipsItemsComponent,
  AutocompleteItemsComponent,
  ChipsCheckboxItemsComponent,
  DateItemsComponent,
  RangeItemsComponent,
  SelectItemsComponent,
} from '../items';
import {
  ChipsHeadingComponent,
  ChipsOnlyComponent,
  HeadingOnlyComponent,
  KeywordFullWidthComponent,
  PrimarySearchChipsComponent,
} from '../layout';


@Component({
  templateUrl: './examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsExampleModule,
    KitchenSinkComponent,
    SelectItemsComponent,
    DateItemsComponent,
    RangeItemsComponent,
    AutocompleteItemsComponent,
    AutocompleteChipsItemsComponent,
    ChipsCheckboxItemsComponent,
    ActionButtonsComponent,
    ActionMenusComponent,
    ChipsOnlyComponent,
    ChipsHeadingComponent,
    PrimarySearchChipsComponent,
    HeadingOnlyComponent,
    KeywordFullWidthComponent,
  ],
})
export class ExamplesComponent {
  public config = environment;
}
