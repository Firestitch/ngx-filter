import { Component } from '@angular/core';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { FilterConfig, ItemType } from '@firestitch/filter';
import { FsFormModule } from '@firestitch/form';


import { FilterComponent } from '../../../../src/app/components/filter/filter.component';


@Component({
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FilterComponent, MatDialogActions, MatButton, FsFormModule, MatDialogClose],
})
export class DialogComponent {

  public conf: FilterConfig = {
    inline: false,
    chips: true,
    autofocus: true,
    queryParam: true,
    sorts: [
      { name: 'Name', value: 'name' },
      { name: 'Date', value: 'date' },
    ],
    sort: {
      direction: 'desc',
      value: 'name',
    },
    items: [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search',
      },
      {
        name: 'range',
        type: ItemType.Range,
        label: 'Range',
      },
      {
        name: 'date',
        type: ItemType.Date,
        label: 'Date',
      },
      {
        name: 'checkbox',
        type: ItemType.Checkbox,
        label: 'Checkbox',
      },
      {
        name: 'state',
        type: ItemType.Select,
        label: 'Status',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' },
        ],
        isolate: { label: 'Show deleted', value: 'deleted' },
      },
      {
        name: 'multiselect',
        type: ItemType.Select,
        label: 'Multi Select Status',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' },
        ],
      },
    ],
  };
}
