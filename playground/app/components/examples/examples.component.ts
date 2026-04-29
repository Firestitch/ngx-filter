import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '../../../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { ChipsOnlyComponent } from '../chips-only/chips-only.component';
import { HeadingOnlyComponent } from '../heading-only/heading-only.component';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';
import { PrimarySearchChipsComponent } from '../primary-search-chips/primary-search-chips.component';


@Component({
    templateUrl: 'examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      FsExampleModule,
      KitchenSinkComponent,
      ChipsOnlyComponent,
      PrimarySearchChipsComponent,
      HeadingOnlyComponent,
    ],
})
export class ExamplesComponent {
  public config = environment;
}
