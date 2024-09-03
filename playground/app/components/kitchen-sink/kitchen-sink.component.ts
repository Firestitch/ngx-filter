import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { filter, nameValue } from '@firestitch/common';
import { getFirstDayOfFirstYearWeek, getPeriodForDate } from '@firestitch/datepicker';
import {
  ActionMode,
  FilterComponent,
  FilterConfig,
  ItemDateMode,
  ItemType,
} from '@firestitch/filter';

import { BehaviorSubject, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

import { shuffle } from 'lodash-es';

import { FsFilterAction } from '../../../../src/app/interfaces/action.interface';
import { SimpleSelectItem } from '../../../../src/app/models/items/select/simple-select-item';

import { savedFilters } from './saved-filter';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

  public status = false;

  public conf: FilterConfig;
  public sortUpdated = new EventEmitter();
  public query = null;
  public sort = null;

  public users = [
    { id: 1, name: 'John Doe', color: 'red' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Bob Tom' },
  ];

  public weekdays = [
    { id: '11', name: 'Monday' },
    { id: '12', name: 'Tuesday' },
    { id: '13', name: 'Wednesday' },
    { id: '14', name: 'Thursday' },
    { id: '15', name: 'Friday' },
    { id: '16', name: 'Saturday' },
    { id: '17', name: 'Sunday' },
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
      ],
    },
  ];

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.conf = {
      persist: false,
      inline: false,
      chips: true,
      autofocus: true,
      queryParam: true,
      sorts: [
        { name: 'Name', value: 'name' },
        { name: 'Date', value: 'date' },
      ],
      actions: this._filterActions(),
      sort: {
        direction: 'desc',
        value: 'name',
      },
      autoReload: {
        seconds: 5,
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
          values: (keyword, filterComponent: FilterComponent) => {
            return of([]);
          },
        },
        {
          name: 'simpleSelect',
          type: ItemType.Select,
          label: 'Simple Select',
          disableQueryParams: true,
          chipLabel: 'Special Label',
          change: (item, filterComponent: FilterComponent) => {
            const filterItem = filterComponent.getItem('multiselect');
            filterItem.values.pop();
            setTimeout(() => {
              filterItem.clear();
            }, 2000);
          },
          values: () => {

            return of([
              { name: 'All', value: '__all' },
              { name: 'Option 1', value: 1 },
              { name: 'Option 2', value: 2 },
              { name: 'Option 3', value: 3 },
            ]);
          },
        },
        {
          name: 'groupSelect',
          type: ItemType.Select,
          label: 'Group Select',
          disablePersist: true,
          children: 'types',
          values: () => {
            return this.subject;
          },
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
            this.filter.getItem('simple_select') as SimpleSelectItem;

            return new BehaviorSubject(this.users)
              .pipe(
                map((users) => shuffle(nameValue(users, 'name', 'id'))),
              );
          },
        },
        {
          name: 'autocompleteUserId',
          label: 'Autocomplete User',
          type: ItemType.AutoComplete,
          clear: false,
          change: (item, filterComponent: FilterComponent) => {
            console.log('Item Change', item);
          },
          init: (item) => {
            console.log('Item Init', item);
          },
          values: (keyword, filterComponent: FilterComponent) => {
            return new BehaviorSubject(this.users)
              .pipe(
                tap(() => console.log('load autocomplete_user_id')),
                map((users) => this._filterUsersByKeyword(users, keyword)),
                map((users) => nameValue(users, 'name', 'id')),
              );
          },
        },
        {
          name: 'autocompletechipsUserId',
          label: 'Autocomplete Chips User',
          type: ItemType.AutoCompleteChips,
          chipImage: 'data.image',
          chipColor: '#fff',
          chipBackground: 'color',
          values: (keyword, filterComponent: FilterComponent) => {
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
              );
          },
        },
        {
          name: 'daysChips',
          label: 'Weekdays',
          type: ItemType.Chips,
          multiple: true,
          values: (keyword, filterComponent: FilterComponent) => {
            return of(this.weekdays)
              .pipe(
                map((weekdays) => nameValue(weekdays, 'name', 'id')),
              );
          },
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
          label: ['From Date', 'To Date'],
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
            { name: 'All', value: '__all' },
            { name: 'Active', value: 'active' },
            { name: 'Pending', value: 'pending' },
            { name: 'Deleted', value: 'deleted' },
          ],
        },
        {
          name: 'maxPrice',
          type: ItemType.Text,
          label: 'Max Price',
        },
      ],
      savedFilters: {
        load: () => {
          console.log('<====== Load Saved Filters =====>');

          return of(savedFilters);
        },
        save: (savedFilter) => {
          console.log('<====== Save Filter =====>');
          const filterIndex = savedFilters.findIndex((f) => {
            return f.id === savedFilter.id;
          });

          if (filterIndex > -1) {
            // Here I'm emulating like backend returend filter which automatically activated
            savedFilter.active = true;
            savedFilters[filterIndex] = savedFilter;
          } else {
            // Here I'm emulating like backend returend new filter with ID to me
            savedFilter = {
              ...savedFilter,
              id: 999,
            };
            savedFilters.push(savedFilter);
          }

          console.log('Save Filter', savedFilter);
          console.log('Saved Filters: ', savedFilters);

          return of(savedFilter)
            .pipe(
              delay(2000),
            );
        },
        order: (filters) => {
          console.log('<====== Order Saved Filters =====>');
          console.log('order filters', filters);

          return of();
        },
        delete: (savedFilter) => {
          console.log('<====== Delete Saved Filter =====>');
          console.log('order filters', filter);

          return of();
        },
      },
      // button: {
      //   label: '',
      //   style: ButtonStyle.Stroked,
      // }
    };


    this.sortUpdated.emit({
      sortBy: 't',
      sortDirection: 'desc',
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
        primary: false,
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
            ],
          },
        ],
      },
      // {
      //   label: 'Columns',
      //   customize: true,
      //   primary: false,
      //   color: 'warn',
      //   tooltip: 'Tooltip',
      // },
      {
        mode: ActionMode.File,
        label: 'Upload',
        menu: false,
        icon: 'cloud_upload',
        primary: false,
        multiple: true,
        select: (file) => {
          console.log('Selected File', file);
        },
      },
      {
        mode: ActionMode.SelectButton,
        label: 'View',
        primary: false,
        default: 'week',
        change: (value) => {
          console.log('Select button change',value);
        },
        values: [
          { name: 'Month', value: 'month' },
          { name: 'Week', value: 'week' },
          { name: 'Day', value: 'day' },
        ],
        // change: (file) => {
        //   console.log('Selected File', file);
        // },
      },
      {
        click: (event) => {
          console.log(event);
        },
        icon: 'delete',
        primary: false,
        label: 'Secondary Button',
      },
      {
        click: (event) => {
          // this.list.enableOrder();
        },
        label: 'Kebab only button',
        menu: true,
      },
      {
        label: 'Reorder',
        menu: true,
        click: (event) => {
          this.filter.updateActions(this._doneAction());
          this.filter.hideKeywordField();
          this.filter.hideFiltersBtn();
        },
      },
      {
        click: (event) => {
          console.log(event);
        },
        label: 'Primary Button',
      },
    ];
  }

  private _doneAction(): FsFilterAction[] {
    return [
      {
        label: 'Done',
        primary: false,
        click: () => {
          this.filter.updateActions(this._filterActions());
          this.filter.showKeywordField();
          this.filter.showFiltersBtn();
        },
      },
    ];
  }

  private _filterUsersByKeyword(users, keyword) {
    return filter(users, (user) => {
      return user.name.toLowerCase().match(new RegExp(`${keyword}`));
    });
  }
}
