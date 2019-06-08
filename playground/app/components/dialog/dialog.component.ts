import { Component } from '@angular/core';
import { ItemType } from '@firestitch/filter';


@Component({
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {


  public conf = {
    persist: 'filter',
    inline: false,
    chips: true,
    autofocus: true,
    queryParam: true,
    sorts: [
      { name: 'Name', value: 'name'},
      { name: 'Date', value: 'date'}
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
        query: 'keyword'
      },
      {
        name: 'range',
        type: ItemType.Range,
        label: 'Range',
        placeholder: ['Min', 'Max']
      },
      {
        name: 'date',
        type: ItemType.Date,
        label: 'Date'
      },
      {
        name: 'checkbox',
        type: ItemType.Checkbox,
        label: 'Checkbox'
      },
      {
        name: 'state',
        type: ItemType.Select,
        label: 'Status',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' }
        ],
        isolate: { label: 'Show Deleted', value: 'deleted' }
      },
      {
        name: 'multiselect',
        type: ItemType.Select,
        label: 'Multi Select Status',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' }
        ]
      }
    ]
  };
}
