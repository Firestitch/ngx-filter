import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';

import {
  ActionMode,
  FilterComponent,
  FilterConfig,
  FsFilterAction,
  FsFilterModule,
} from '@firestitch/filter';

import { ExampleLogService, FilterItemsService } from '../../../services';


/**
 * Where an action lands is decided by two flags rather than by a slot: `primary` puts it
 * at the right of the bar, `menu` moves it into the kebab. An action can also be a
 * segmented control (`ActionMode.SelectButton`) rather than a button.
 *
 * `updateActions` swaps the whole set at runtime — the "Reorder" item below hands the bar
 * over to a single Done button, which is the shape a list uses while reordering.
 */
@Component({
  selector: 'action-buttons',
  templateUrl: './action-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule],
})
export class ActionButtonsComponent {

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);
  private _log = inject(ExampleLogService);

  constructor() {
    this.conf = {
      heading: 'Action Buttons',
      chips: true,
      persist: false,
      actions: this._actions(),
      items: [
        this._filterItems.keyword(),
        this._filterItems.statusSelect(),
      ],
    };
  }

  private _actions(): FsFilterAction[] {
    return [
      {
        mode: ActionMode.SelectButton,
        label: 'View',
        primary: false,
        change: (value) => this._log.log('Select button change', value),
        values: [
          { name: 'Month', value: 'month' },
          { name: 'Week', value: 'week' },
          { name: 'Day', value: 'day' },
        ],
      },
      {
        label: 'Secondary',
        primary: false,
        click: (event) => this._log.log('Secondary clicked', event),
      },
      {
        label: 'Kebab only button',
        menu: true,
        click: () => this._log.log('Kebab only button clicked'),
      },
      {
        label: 'Reorder',
        menu: true,
        click: () => {
          this.filter.updateActions(this._doneActions());
          this.filter.hideKeywordField();
        },
      },
      {
        label: 'Primary',
        click: (event) => this._log.log('Primary clicked', event),
      },
    ];
  }

  private _doneActions(): FsFilterAction[] {
    return [
      {
        label: 'Done',
        primary: false,
        click: () => {
          this.filter.updateActions(this._actions());
          this.filter.showKeywordField();
        },
      },
    ];
  }
}
