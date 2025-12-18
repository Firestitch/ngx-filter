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
  FilterSort,
  FilterStatusBarDirective,
  IFilterConfigItem,
  IFilterSavedFiltersConfig,
  ItemType,
  SortItem,
} from '@firestitch/filter';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessage } from '@firestitch/message';

import { map, of } from 'rxjs';

import { subDays } from 'date-fns';
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
  private _message = inject(FsMessage);

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
        this._log('Change', query, sort );
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      init: (query, sort) => {
        this._log('Init', query, sort);
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      sortChange: (query, sort) => {
        this._log('sortChange', query, sort);
        this.query = query;
        this.sort = sort;
        this._cdRef.detectChanges();
      },
      items: this._filterItems(),  
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
        this._log('<====== Load Saved Filters =====>');

        return of(SavedFilters);
      },
      save: (savedFilter) => {
        this._log('====== Save Filter =====');
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

        this._log('Save Filter', savedFilter);
        this._log('Saved Filters: ', SavedFilters);

        return of(savedFilter);
      },
      // order: (filters) => {
      //   this._log('====== Order Saved Filters =====');
      //   this._log('order filters', filters);

      //   return of(null);
      // },
      delete: () => {
        this._log('====== Delete Saved Filter =====');
        this._log('order filters', filter);

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
          this._log('Item init', item, initFilter);
          
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
      //     this._log('Item Change', item);
      //   },
      //   init: (item) => {
      //     this._log('Item Init', item);
      //   },
      //   values: (keyword) => {
      //     return of(this.users)
      //       .pipe(
      //         tap(() => this._log('load autocomplete_user_id')),
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
              this._log('Added User', filterComponent);
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
        default: subDays(new Date(), 3),
        primary: true,
      },
      {
        name: 'dateRange',
        type: ItemType.DateRange,
        label: 'Date',
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
          this._log('File Action - Selected File', file);
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
              this._log('Menu Action - Test clicked');
            },
          },
          {
            label: 'Test 2',
            click: () => {
              this._log('Menu Action - Test 2 clicked');
            },
          },
          {
            label: 'File Upload',
            mode: MenuActionMode.File,
            multiple: true,
            fileSelected: (files: FsFile[]) => {
              this._log('Menu Action - File Upload', files);
            },
          },
          {
            label: 'Group 1',
            items: [
              {
                label: 'Sub Item',
                click: () => {
                  this._log('Menu Action - Group 1 Sub Item clicked');
                },
              },
              {
                label: 'File Upload',
                mode: MenuActionMode.File,
                multiple: true,
                fileSelected: (files: FsFile[]) => {
                  this._log('Menu Action - File Upload', files);
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
          this._log('Select button change',value);
        },
        values: [
          { name: 'Month', value: 'month' },
          { name: 'Week', value: 'week' },
          { name: 'Day', value: 'day' },
        ],
        // change: (file) => {
        //   this._log('Selected File', file);
        // },
      },
      {
        click: (event) => {
          this._log('Menu Action - Click Secondary', event);
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
        },
      },
      {
        click: (event) => {
          this._log('Click Primary', event);
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
        },
      },
    ];
  }

  private _filterUsersByKeyword(users, keyword) {
    return filter(users, (user) => {
      return user.name.toLowerCase().match(new RegExp(`${keyword}`));
    });
  }

  private _log(message: string, ...args: any[]) {
    this._message.info(message);
    console.log({ message, ...args });
  }
}
