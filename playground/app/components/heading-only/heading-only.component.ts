import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FilterConfig, FsFilterAction, FsFilterModule } from '@firestitch/filter';


@Component({
  selector: 'heading-only',
  templateUrl: './heading-only.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule],
})
export class HeadingOnlyComponent {

  public conf: FilterConfig;

  constructor() {
    this.conf = {
      heading: 'Heading Only',
      subheading: 'No filters, just a heading and an action',
      actions: this._actions(),
      items: [],
    };
  }

  private _actions(): FsFilterAction[] {
    return [
      {
        label: 'Create',
        click: () => {
          console.log('Create clicked');
        },
      },
    ];
  }
}
