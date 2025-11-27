import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, inject, OnInit, ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { filter, guid, nameValue } from '@firestitch/common';
import { FsFile } from '@firestitch/file';
import {
  ActionMode,
  FilterComponent,
  FilterConfig,
  FilterHeadingDirective,
  FilterSort,
  FilterStatusBarDirective,
  IFilterConfigItem,
  IFilterSavedFiltersConfig,
  ItemType,
  SortItem,
} from '@firestitch/filter';
import { FsMenuModule } from '@firestitch/menu';

import { map, of, tap } from 'rxjs';

import { ItemDateMode, MenuActionMode } from 'src/app/enums';

import { FsFilterAction } from '../../../../src/app/interfaces/action.interface';

import { SavedFilters } from './saved-filter';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterComponent,
    FilterStatusBarDirective,
    FilterHeadingDirective,
    JsonPipe,
    FsMenuModule,
    MatButtonModule,
  ],
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

  public status = false;

  public conf: FilterConfig;
  public sortUpdated = new EventEmitter();
  public query = null;

  public sort: FilterSort;

  public sorts: SortItem[] = [
    { name: 'Name', value: 'name' },
    { name: 'Date', value: 'date' },
  ];

  public users = [
    { id: 1, name: 'John Doe', color: 'red' },
    { id: 2, name: 'Sam Smith' },
    { id: 3, name: 'Billy Bob' },
    { id: 4, name: 'James Bond' },
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
      value: null,
      name: 'Any',
    },
    {
      name: 'Fruit',
      types: [
        { value: 5, name: 'Apple' },
        { value: 6, name: 'Banana' },
      ],
    },
    {
      name: 'Vegetable',
      types: [
        { value: 7, name: 'Carrot' },
        { value: 8, name: 'Pea' },
      ],
    },

  ];
  
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.conf = {
      heading: 'Kitchen Sink',
      subheading: 'This is a subtitle',
      chips: true,
      autofocus: false,
      queryParam: true,
      persist: true,
      actions: this._filterActions(),
      sort: {
        direction: 'desc',
        value: 'name',
      },
      reload: true,
      // autoReload: {
      //   enabled: false,
      //   seconds: 5,
      // },
      change: (query, sort) => {
        const hasValues = this.filter.items
          .filter((item) => item.hasValue)
          .reduce((accum, item) => {
            return {
              ...accum,
              [item.name]: {
                value: item.value,
                model: item.value,
              },
            };
          }, {});

        console.log('Change', query, sort );
        console.log('Has Values', hasValues);
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      init: (query, sort) => {
        console.log('Init', query, sort);
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      sortChange: (query, sort) => {
        console.log('sortChange', query, sort);
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      items: this._filterItems(true),  
      savedFilters: this._savedFilters(),
    };

    // setTimeout(() => {
    //   this.conf = Object.assign({},this.conf);

    //   this.conf.items.pop();
    //   this.conf.items.pop();

    //   this.conf.items.pop();
    // },3000)
  }

  private _savedFilters(): IFilterSavedFiltersConfig {
    return {
      // label: {
      //   singular: 'Alert',
      //   plural: 'Alerts',
      //   icon: 'notifications',
      // },        
      load: () => {
        console.log('<====== Load Saved Filters =====>');

        return of(SavedFilters);
      },
      save: (savedFilter) => {
        console.log('====== Save Filter =====');
        const filterIndex = SavedFilters.findIndex((f) => {
          return f.id === savedFilter.id;
        });

        if (filterIndex > -1) {
          // Here I'm emulating like backend returned filter which automatically activated
          SavedFilters[filterIndex] = savedFilter;
        } else {
          // Here I'm emulating like backend returend new filter with ID to me
          savedFilter = {
            ...savedFilter,
            id: guid(),
          };
          SavedFilters.push(savedFilter);
        }

        console.log('Save Filter', savedFilter);
        console.log('Saved Filters: ', SavedFilters);

        return of(savedFilter);
      },
      // order: (filters) => {
      //   console.log('====== Order Saved Filters =====');
      //   console.log('order filters', filters);

      //   return of(null);
      // },
      delete: () => {
        console.log('====== Delete Saved Filter =====');
        console.log('order filters', filter);

        return of(null);
      },
    };
  }

  private _filterItems(showKeyword: boolean = true): IFilterConfigItem[] {
    return [
      {
        name: 'keyword',
        type: ItemType.Keyword,
        label: 'Search',
        show: showKeyword,
        fullWidth: false,
      },
      {
        name: 'simpleSelect',
        type: ItemType.Select,
        label: 'Single select',
        primary: true,
        disableQueryParams: true,
        chipLabel: 'Special Label',
        init: (item, initFilter: FilterComponent) => {
          console.log('Item init', item, initFilter);
          
          // setTimeout(() => {
          //   item.hide();
          // }, 5000);

          // setTimeout(() => {
          //   item.show();
          // }, 10000);
        },
        change: (item, filterComponent: FilterComponent) => {
          filterComponent.getItem('multiSelect').clear();
        },
        values: () => {
          return of(this.users)
            .pipe(
              map((users) => [
                { name: 'All', value: null },
                ...nameValue(users, 'name', 'id'),
              ]),
            );
        },
      },
      {
        name: 'groupSelect',
        type: ItemType.Select,
        label: 'Grouped select',
        disablePersist: true,
        secondary: true,
        children: 'types',
        values: () => {
          return this.subject;
        },
      },      
      {
        name: 'multiSelect',
        type: ItemType.Select,
        label: 'Multi select',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' },
        ],
      },    
      {
        name: 'isolateSelect',
        type: ItemType.Select,
        label: 'Isolate select',
        multiple: true,
        values: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Deleted', value: 'deleted' },
        ],
        isolate: {
          label: 'Show deleted',
          value: 'deleted',
        },
      },
      {
        name: 'range',
        type: ItemType.Range,
        prefix: '$&nbsp;',
        label: ['Min Price', 'Max Price'],
        chipLabel: ['Custom Min Price', 'Custom Max Price'],
      },
      // {
      //   name: 'autocompleteUserId',
      //   label: 'Autocomplete User',
      //   type: ItemType.AutoComplete,
      //   change: (item) => {
      //     console.log('Item Change', item);
      //   },
      //   init: (item) => {
      //     console.log('Item Init', item);
      //   },
      //   values: (keyword) => {
      //     return of(this.users)
      //       .pipe(
      //         tap(() => console.log('load autocomplete_user_id')),
      //         map((users) => this._filterUsersByKeyword(users, keyword)),
      //         map((users) => nameValue(users, 'name', 'id')),
      //       );
      //   },
      // },
      {
        name: 'autocompletechips',
        label: 'Autocomplete Chips',
        type: ItemType.AutoCompleteChips,
        chipImage: 'data.image',
        primary: true,
        panelActions: [
          {
            label: 'Add User',
            click: (filterComponent: FilterComponent) => {
              console.log('Added User', filterComponent);
              const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
              const item = filterComponent.getItem('autocompletechips');
              item.value = [
                ...item.value, 
                { value: randomUser.id, name: randomUser.name },
              ];
            },
          },
        ],
        values: (keyword) => {
          return of(this.users)
            .pipe(
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
        name: 'dayChips',
        label: 'Weekdays',
        type: ItemType.Chips,
        multiple: true,
        values: () => {
          return of(this.weekdays)
            .pipe(
              map((weekdays) => nameValue(weekdays, 'name', 'id')),
            );
        },
      },
      {
        name: 'showDeleted',
        type: ItemType.Checkbox,
        label: 'Show Deleted',
        // default: true,
        unchecked: 'active',
        checked: 'deleted',
      },
      {
        name: 'date',
        type: ItemType.Date,
        label: 'Date',
        clear: false,
        primary: true,
      },
      {
        name: 'dateRange',
        type: ItemType.DateRange,
        label: ['From Date', 'To Date'],
      },
      {
        name: 'scrollDate',
        type: ItemType.Date,
        label: 'Scroll Date',
        maxYear: (new Date()).getFullYear(),
        mode: ItemDateMode.ScrollMonthYear,
      },
      {
        name: 'price',
        type: ItemType.Text,
        label: 'Price',
        prefix: '$',
        suffix: 'USD',
        placeholder: 'Enter price',
      },
    ];
  }

  private _filterActions(): FsFilterAction[] {
    return [
      {
        mode: ActionMode.File,
        icon: 'cloud_upload',
        primary: false,
        multiple: true,
        select: (file) => {
          console.log('Selected File', file);
        },
      },
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
            label: 'File Upload',
            mode: MenuActionMode.File,
            multiple: true,
            fileSelected: (files: FsFile[]) => {
              console.log('File Upload', files);
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
              {
                label: 'File Upload',
                mode: MenuActionMode.File,
                multiple: true,
                fileSelected: (files: FsFile[]) => {
                  console.log('File Upload', files);
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
        mode: ActionMode.SelectButton,
        label: 'View',
        primary: false,
        //default: 'week',
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
        primary: false,
        label: 'Secondary',
      },
      {
        click: () => {
          // this.list.enableOrder();
        },
        label: 'Kebab only button',
        menu: true,
      },
      {
        label: 'Reorder',
        menu: true,
        click: () => {
          this.filter.updateActions(this._doneAction());
          this.filter.hideKeywordField();
          this.filter.hideFilters();
        },
      },
      {
        click: (event) => {
          console.log(event);
        },
        label: 'Primary',
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
          this.filter.showFilters();
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
