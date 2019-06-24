import { Component, EventEmitter, ViewChild } from '@angular/core';

import { FilterConfig, ItemType } from '@firestitch/filter';
import { FilterComponent } from '@firestitch/filter';
import { nameValue, filter } from '@firestitch/common'

import { BehaviorSubject, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { FsFilterConfigItem } from 'src/app/models/filter-item';
import { shuffle } from 'lodash-es';


@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: [ 'kitchen-sink.component.css' ]
})
export class KitchenSinkComponent {

  @ViewChild('filter') public filterEl: FilterComponent;

  public conf: FilterConfig;
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

  public subject = [
    {
      value: 1,
      name: 'Any',
    },
    {
      value: 2,
      name: 'None',
    },
    {
      value: 3,
      name: 'Question',
    },
    {
      name: 'Doc',
      types: [
        { value: 5, name: 'Prayer Letter 1' },
        { value: 6, name: 'Prayer Letter 2' },
        { value: 7, name: 'Prayer Letter 3' },
        { value: 8, name: 'Prayer Letter 4' },
        { value: 9, name: 'Prayer Letter 5' },
        { value: 10, name: 'Prayer Letter 6' },
      ]
    },
  ];

  constructor() {
    this.conf = {
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
      change: (query, sort) => {
        console.log('Change', query, sort);
        this.query = query;
        this.sort = sort;
      },
      init: (query, sort) => {
        console.log('Init', query, sort);
        this.query = query;
        this.sort = sort;
      },
      reload: (query, sort) => {
        console.log('Reload', query, sort);
        this.query = query;
        this.sort = sort;
      },
      sortChange: (query, sort) => {
        console.log('sortChange', query, sort);
        this.query = query;
        this.sort = sort;
      },
      items: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
          query: 'keyword'
        },
        {
          name: 'simple_select',
          type: ItemType.Select,
          label: 'Simple Select',
          chipLabel: 'Special Label',
          change: (item) => {

            // const filterItem: FsFilterConfigItem = this.filterEl.config.getItem('multiselect');
            // filterItem.values.pop();
            // //filterItem.clear();
          },
          values: () => {

            return of([
              { name: 'All', value: '__all' },
              { name: 'Option 1', value: 1 },
              { name: 'Option 2', value: 2 },
              { name: 'Option 3', value: 3 }
          ]).pipe(
            delay(3000)
          )
          }
        },
        {
          name: 'group_select',
          type: ItemType.Select,
          label: 'Group Select',
          children: 'types',
          values: () => {
            return this.subject;
          }
        },
        {
          name: 'range',
          type: ItemType.Range,
          label: 'Range',
          prefix: '$&nbsp;',
          placeholder: ['Min Price', 'Max Price']
        },
        {
          name: 'observable_select',
          type: ItemType.Select,
          label: 'Observable Select',
          values: () => {

            const filterItem: FsFilterConfigItem = this.filterEl.config.getItem('simple_select');
            console.log(filterItem);
            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => shuffle(nameValue(users, 'name', 'id'))),
              )
          }
        },
        {
          name: 'autocomplete_user_id',
          label: 'Autocomplete User',
          type: ItemType.AutoComplete,
          change: (item) => {},
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
                map((users) => this._filterUsersByKeyword(users, keyword || '')),
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
        },
        {
          name: 'max_price',
          type: ItemType.Text,
          label: 'Max Price',
          prefix: '$&nbsp;'
        }
      ]
    };


    this.sortUpdated.emit({
      sortBy: 't',
      sortDirection: 'desc'
    });

    // setTimeout(() => {
    //   this.conf = Object.assign({},this.conf);

    //   this.conf.items.pop();
    //   this.conf.items.pop();

    //   this.conf.items.pop();
    // },3000)
  }

  private _filterUsersByKeyword(users, keyword) {
    return filter(users, (user) => {
      return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
    })
  }
}
