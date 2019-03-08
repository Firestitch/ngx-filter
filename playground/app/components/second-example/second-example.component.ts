import { Component, EventEmitter, ViewChild } from '@angular/core';

import { ItemType } from '@firestitch/filter';
import { FilterComponent } from '@firestitch/filter';
import { nameValue, filter } from '@firestitch/common'

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'second-example',
  templateUrl: 'second-example.component.html',
  styleUrls: [ 'second-example.component.css' ]
})
export class SecondExampleComponent {

  @ViewChild('filter') public filterEl: FilterComponent;

  public conf: any;
  public sortUpdated = new EventEmitter();
  public query = null;
  public sort = null;

  public users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Bob Tom' }
  ];

  public weekdays = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
  ];

  constructor() {
    this.conf = {
      persist: 'filter',
      inline: false,
      chips: true,
      autofocus: true,
      sorting: [
        { name: 'name', value: 'n', default: true},
        { name: 'two', value: 't'}
      ],
      change: (query) => {
        console.log('Change', query);
        this.query = query;
      },
      sortChange: (sort) => {
        console.log('Sort', sort);
        this.sort = sort;
      },
      init: (query) => {
        console.log('Init', query);
        this.query = query;
      },
      reload: (query) => {
        console.log('Reload', query);
        this.query = query;
      },
      items: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search',
          query: 'keyword'
        },
        {
          name: 'simple_select',
          type: ItemType.Select,
          label: 'Simple Select',
          chipLabel: 'Special Label',
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
          type: ItemType.Range,
          label: 'Range',
          placeholder: ['Min', 'Max']
        },
        {
          name: 'observable_select',
          type: ItemType.Select,
          label: 'Observable Select',
          values: () => {
            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => nameValue(users, 'name', 'id')),
              )
          }
        },
        {
          name: 'autocomplete_user_id',
          label: 'Autocomplete User',
          type: ItemType.AutoComplete,
          values: (keyword) => {
            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => this._filterUsersByKeyword(users, keyword)),
                map((users) => nameValue(users, 'name', 'id')),
              )
          }
        },
        {
          name: 'autocompletechips_user_id',
          label: 'Autocomplete Chips User',
          type: ItemType.AutoCompleteChips,
          values: (keyword) => {
            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => this._filterUsersByKeyword(users, keyword)),
                map((users) => nameValue(users, 'name', 'id')),
              )
          }
        },
        {
          name: 'days_chips',
          label: 'Weekdays',
          type: ItemType.Chips,
          multiple: true,
          values: (keyword) => {
            return new BehaviorSubject(this.weekdays)
              .pipe(
                map((weekdays) => nameValue(weekdays, 'name', 'id')),
              )
          }
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
            { name: 'All', value: '__all' },
            { name: 'Active', value: 'active' },
            { name: 'Pending', value: 'pending' },
            { name: 'Deleted', value: 'deleted' }
          ],
          isolate: { label: 'Show Deleted', value: 'deleted' }
        }
      ]
    };

    this.sortUpdated.emit({
      sortBy: 't',
      sortDirection: 'desc'
    });
  }

  private _filterUsersByKeyword(users, keyword) {
    return filter(users, (user) => {
      return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
    })
  }
}
