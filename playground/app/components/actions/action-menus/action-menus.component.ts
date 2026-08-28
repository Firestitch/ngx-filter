import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FsFile } from '@firestitch/file';
import {
  ActionMode,
  FilterConfig,
  FsFilterAction,
  FsFilterModule,
  MenuActionMode,
} from '@firestitch/filter';

import { ExampleLogService, FilterItemsService } from '../../../services';


/**
 * The two actions that open something rather than firing a click: a menu, whose items can
 * nest one level and can themselves be file pickers, and a bare file action that is a
 * picker with no menu around it.
 */
@Component({
  selector: 'action-menus',
  templateUrl: './action-menus.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule],
})
export class ActionMenusComponent {

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);
  private _log = inject(ExampleLogService);

  constructor() {
    this.conf = {
      heading: 'Action Menus & Files',
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
        mode: ActionMode.File,
        icon: 'cloud_upload',
        primary: false,
        multiple: true,
        select: (files) => this._log.log('File action selected', files),
      },
      {
        mode: ActionMode.Menu,
        label: 'Menu',
        primary: false,
        items: [
          {
            label: 'Test',
            click: () => this._log.log('Menu: Test clicked'),
          },
          {
            label: 'File Upload',
            mode: MenuActionMode.File,
            multiple: true,
            fileSelected: (files: FsFile[]) => this._log.log('Menu: File Upload', files),
          },
          {
            label: 'Group 1',
            items: [
              {
                label: 'Sub Item',
                click: () => this._log.log('Menu: Group 1 Sub Item clicked'),
              },
              {
                label: 'File Upload',
                mode: MenuActionMode.File,
                multiple: true,
                fileSelected: (files: FsFile[]) => this._log.log('Menu: Group 1 File Upload', files),
              },
            ],
          },
        ],
      },
    ];
  }
}
