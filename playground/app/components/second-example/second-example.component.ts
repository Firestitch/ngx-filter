import { Component, EventEmitter } from '@angular/core';
import { nameValue, filter } from '@firestitch/common/array'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { ItemType } from '../../../../src/models/fs-filter-item';


@Component({
  selector: 'second-example',
  templateUrl: 'second-example.component.html',
  styleUrls: [ 'second-example.component.css' ]
})
export class SecondExampleComponent {


  public conf: any;
  public sortUpdated = new EventEmitter();
  public query = null;

  public users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Bob Tom' }
    ];

  constructor() {
    this.conf = {
      persist: 'filter',
      inline: false,
      sorting: [
        { name: 'name', value: 'n', default: true},
        { name: 'two', value: 't'}
      ],
      sortingDirection: 'asc',
      items: [
        {
          name: 'keyword',
          type: ItemType.text,
          label: 'Search',
          query: 'keyword'
        },
        {
          name: 'simple_select',
          type: ItemType.select,
          label: 'Simple Select',
          values: () => {
              return [
                  { name: 'All', value: '__all' },
                  { name: 'Option 1', value: 1 },
                  { name: 'Option 2', value: 2 },
                  { name: 'Option 3', value: 3 }
              ];
          }
        },
        {
          name: 'range',
          type: ItemType.range,
          label: 'Range',
          placeholder: ['Min', 'Max']
        },
        {
          name: 'observable_select',
          type: ItemType.select,
          label: 'Observable Select',
          values: () => {
            return new BehaviorSubject(this.users)
            .map(users => nameValue(users, 'name', 'id'));
          }
        },
        {
          name: 'autocomplete_user_id',
          label: 'Autocomplete User',
          type: ItemType.autocomplete,
          values: (keyword) => {
            return new BehaviorSubject(this.users)
            .map(users => filter(users, (user) => {
              return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
            }))
            .map(users => nameValue(users, 'name', 'id'));
          }
        },
        {
          name: 'autocompletechips_user_id',
          label: 'Autocomplete Chips User',
          type: ItemType.autocompletechips,
          values: (keyword) => {
            return new BehaviorSubject(this.users)
            .map(users => filter(users, (user) => {
              return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
            }))
            .map(users => nameValue(users, 'name', 'id'));
          }
        },
        {
          name: 'date',
          type: ItemType.date,
          label: 'Date'
        },
        {
          name: 'checkbox',
          type: ItemType.checkbox,
          label: 'Checkbox'
        },
        {
          name: 'state',
          type: ItemType.select,
          label: 'Status',
          multiple: true,
          values: [
            { name: 'Active', value: 'active' },
            { name: 'Pending', value: 'pending' },
            { name: 'Deleted', value: 'deleted' }
          ],
          isolate: { label: 'Show Deleted', value: 'deleted' }
        }
      ],
      init: (instance) => {
        console.log('Init', instance.gets({ flatten: true }));
        this.query = instance.gets({ flatten: true });
      },
      change: (query, instance) => {
        console.log('Change', query);
        this.query = query;
      },
      sortChange: (instance) => {
        console.log(instance.getSorting());
      }
    };

    setTimeout(() => {
      this.sortUpdated.emit({
        sortBy: 't',
        sortDirection: 'desc'
      });
    }, 6000);
  }
  // this.sortUpdated.su
}
