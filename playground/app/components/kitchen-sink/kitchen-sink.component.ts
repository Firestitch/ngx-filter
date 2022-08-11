import { Component, EventEmitter, ViewChild } from '@angular/core';

import {
  ActionMode,
  FilterComponent,
  FilterConfig,
  ItemDateMode,
  ItemType
} from '@firestitch/filter';
import { filter, nameValue } from '@firestitch/common'
import { getFirstDayOfFirstYearWeek, getPeriodForDate } from '@firestitch/datepicker';

import { BehaviorSubject, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { shuffle } from 'lodash-es';

import { savedFilters } from './saved-filter';
import { FsFilterAction } from '../../../../src/app/interfaces/action.interface';
import { SimpleSelectItem } from '../../../../src/app/models/items/select/simple-select-item';


@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: [ 'kitchen-sink.component.css' ]
})
export class KitchenSinkComponent {

  @ViewChild('filter', { static: true }) public filterEl: FilterComponent;

  public conf: FilterConfig;
  public sortUpdated = new EventEmitter();
  public query = null;
  public sort = null;

  public users = [
    { id: 1, name: 'John Doe', color: 'red' },
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
      persist: true,
      inline: false,
      chips: true,
      autofocus: true,
      queryParam: true,
      sorts: [
        { name: 'Name', value: 'name'},
        { name: 'Date', value: 'date'}
      ],
      actions: this._filterActions(),
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
        },
        {
          name: 'notUsed',
          type: ItemType.Select,
          label: 'Not Used',
          default: '1',
          values: () => [],
          disable: true,
        },
        {
          name: 'paymentMethodId',
          label: 'Payment Method',
          type: ItemType.AutoComplete,
          hide: true,
          values: (keyword) => {
            return of([]);
          }
        },
        {
          name: 'simpleSelect',
          type: ItemType.Select,
          label: 'Simple Select',
          disableQueryParams: true,
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
          name: 'groupSelect',
          type: ItemType.Select,
          label: 'Group Select',
          disablePersist: true,
          children: 'types',
          values: () => {
            return this.subject;
          }
        },
        {
          name: 'range',
          type: ItemType.Range,
          prefix: '$&nbsp;',
          label: ['Min Price', 'Max Price'],
          chipLabel: ['Custom Min Price', 'Custom Max Price'],
        },
        {
          name: 'observableSelect',
          type: ItemType.Select,
          label: 'Observable Select',
          clear: false,
          values: () => {

            const filterItem = this.filterEl.getItem('simple_select') as SimpleSelectItem;
            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => shuffle(nameValue(users, 'name', 'id'))),
              )
          }
        },
        {
          name: 'autocompleteUserId',
          label: 'Autocomplete User',
          type: ItemType.AutoComplete,
          clear: false,
          change: (item) => {},
          values: (keyword) => {
            return new BehaviorSubject(this.users)
              .pipe(
                tap(() => console.log('load autocomplete_user_id')),
                map((users) => this._filterUsersByKeyword(users, keyword)),
                map((users) => nameValue(users, 'name', 'id')),
              )
          }
        },
        {
          name: 'autocompletechipsUserId',
          label: 'Autocomplete Chips User',
          type: ItemType.AutoCompleteChips,
          chipImage: 'data.image',
          chipColor: '#fff',
          chipBackground: 'color',
          values: (keyword) => {
            return new BehaviorSubject(this.users)
              .pipe(
                tap(() => console.log('load autocomplete_user_id')),
                map((users) => this._filterUsersByKeyword(users, keyword || '')),
                map((users) => nameValue(users, 'name', 'id')),
                map((users) => users.map((user, index) => {
                  user.data = {
                    image: `https://randomuser.me/api/portraits/men/${index}.jpg`,
                  };

                  return user;
                })),
                tap(console.log),
              )
          }
        },
        {
          name: 'daysChips',
          label: 'Weekdays',
          type: ItemType.Chips,
          multiple: true,
          values: (keyword) => {
            return of(this.weekdays)
              .pipe(
                map((weekdays) => nameValue(weekdays, 'name', 'id')),
              )
          }
        },
        {
          name: 'date',
          type: ItemType.Date,
          label: 'Date',
          clear: false,
        },
        {
          name: 'scrollDate',
          type: ItemType.Date,
          label: 'Scroll Date',
          maxYear: (new Date()).getFullYear(),
          mode: ItemDateMode.ScrollMonthYear,
          clear: false,
        },
        {
          name: 'dateRange',
          type: ItemType.DateRange,
          label: [ 'From Date', 'To Date'],
          clear: false,
        },
        {
          name: 'week',
          type: ItemType.Week,
          label: 'Week',
          default: getPeriodForDate(new Date(), getFirstDayOfFirstYearWeek(new Date()), 1),
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
            { name: 'All', value: '__all' },
            { name: 'Active', value: 'active' },
            { name: 'Pending', value: 'pending' },
            { name: 'Deleted', value: 'deleted' }
          ]
        },
        {
          name: 'maxPrice',
          type: ItemType.Text,
          label: 'Max Price',
          prefix: '$&nbsp;',
          suffix: '%',
        }
      ],
      savedFilters: {
        load: () => {
          console.log('<====== Load Saved Filters =====>');
          return of(savedFilters)
            .pipe(
              delay(2000),
            );
        },
        save: (filter) => {
          console.log('<====== Save Filter =====>');
          const filterIndex = savedFilters.findIndex((f) => {
            return f.id === filter.id;
          });

          if (filterIndex > -1) {
            // Here I'm emulating like backend returend filter which automatically activated
            filter.active = true;
            savedFilters[filterIndex] = filter;
          } else {
            // Here I'm emulating like backend returend new filter with ID to me
            filter = {
              ...filter,
              id: 999,
            }
            savedFilters.push(filter);
          }

          console.log('Save Filter', filter);
          console.log('Saved Filters: ', savedFilters);

          return of(filter)
            .pipe(
              delay(2000),
            );
        },
        order: (filters) => {
          console.log('<====== Order Saved Filters =====>');
          console.log('order filters', filters);

          return of();
        },
        delete: (filter) => {
          console.log('<====== Delete Saved Filter =====>');
          console.log('order filters', filter);

          return of();
        },
      }
      //clear: false,
      // button: {
      //   label: '',
      //   style: 'icon',
      // }
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

  private _filterActions(): FsFilterAction[] {
    return [
      {
        mode: ActionMode.Menu,
        label: 'Menu',
        items: [
          {
            label: 'Test',
            click: () => {
              console.log('Test clicked');
            },
          },
          {
            label: 'Test 2',
            click: () => {
              console.log('Test 2 clicked');
            },
          },
          {
            label: 'Group 1',
            items: [
              {
                label: 'Sub Item',
                click: () => {
                  console.log('Group 1 Sub Item clicked');
                },
              },
            ]
          },
        ],
      },
      {
        mode: ActionMode.Menu,
        label: 'Another Menu',
        items: [
          {
            label: 'Heh',
            icon: 'image',
            click: () => {
              console.log('Heh clicked');
            },
          },
          {
            label: 'Feh',
            click: () => {
              console.log('Feh clicked');
            },
          }
        ],
      },
      {
        label: 'Columns',
        customize: true,
        primary: false,
        color: 'warn',
      },
      {
        mode: ActionMode.File,
        label: 'Upload',
        icon: 'cloud_upload',
        color: 'accent',
        multiple: true,
        select: (file) => {
          console.log('Selected File', file);
        },
      },
      {
        click: (event) => {
          console.log(event);
        },
        icon: 'delete',
        primary: false,
        label: 'Secondary Button'
      },
      {
        click: (event) => {
          // this.list.enableOrder();
        },
        label: 'Kebab only button',
        menu: true
      },
      {
        label: 'Reorder',
        menu: true,
        click: (event) => {
          this.filterEl.updateActions(this._doneAction());
          this.filterEl.hideKeywordField();
          this.filterEl.hideFiltersBtn();
        }
      },
      {
        click: (event) => {
          console.log(event);
        },
        label: 'Primary Button'
      }
    ];
  }

  private _doneAction(): FsFilterAction[] {
    return [
      {
        label: 'Done',
        primary: false,
        click: () => {
          this.filterEl.updateActions(this._filterActions());
          this.filterEl.showKeywordField();
          this.filterEl.showFiltersBtn();
        },
      },
    ];
  }

  private _filterUsersByKeyword(users, keyword) {
    return filter(users, (user) => {
      return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
    })
  }
}
