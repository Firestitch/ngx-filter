import { Injectable } from '@angular/core';

import { nameValue } from '@firestitch/common';
import {
  FilterAutocompleteChipsShape,
  FilterAutocompleteChipsSubcontentFn,
  FilterComponent,
  FilterNameValue,
  IFilterConfigItem,
  ItemDateMode,
  ItemType,
} from '@firestitch/filter';

import { map, Observable, of } from 'rxjs';


export interface ExampleUser {
  id: number;
  name: string;
  email: string;
  title: string;
  image: string;
}

/**
 * The item configs every example is built from. Keeping them here is what lets each
 * example component stay short enough to read in one screen — an example should show off
 * one idea, not re-declare a cast of users and weekdays to do it.
 */
@Injectable({ providedIn: 'root' })
export class FilterItemsService {

  public users: ExampleUser[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      title: 'Field Technician',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    {
      id: 2,
      name: 'Sam Smith',
      email: 'sam.smith@example.com',
      title: 'Dispatcher',
      image: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    {
      id: 3,
      name: 'Billy Bob',
      email: 'billy.bob@example.com',
      title: 'Account Manager',
      image: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
    {
      id: 4,
      name: 'James Bond',
      email: 'james.bond@example.com',
      title: 'Operations Lead',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
    },
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

  public subjects = [
    { value: null, name: 'Any' },
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

  // ---------------------------------------------------------------- text

  public keyword(opts: { label?: string; fullWidth?: boolean } = {}): IFilterConfigItem {
    return {
      name: 'keyword',
      type: ItemType.Keyword,
      label: opts.label ?? 'Search',
      fullWidth: opts.fullWidth,
    };
  }

  public text(opts: { name?: string; label?: string; prefix?: string; suffix?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'reference',
      type: ItemType.Text,
      label: opts.label ?? 'Reference',
      prefix: opts.prefix,
      suffix: opts.suffix,
    };
  }

  // -------------------------------------------------------------- select

  public statusSelect(opts: { primary?: boolean; multiple?: boolean } = {}): IFilterConfigItem {
    return {
      name: 'status',
      type: ItemType.Select,
      label: 'Status',
      primary: opts.primary,
      multiple: opts.multiple ?? true,
      values: [
        { name: 'Active', value: 'active' },
        { name: 'Pending', value: 'pending' },
        { name: 'Deleted', value: 'deleted' },
      ],
    };
  }

  public userSelect(opts: { primary?: boolean; multiple?: boolean } = {}): IFilterConfigItem {
    return {
      name: 'user',
      type: ItemType.Select,
      label: 'User',
      primary: opts.primary,
      multiple: opts.multiple,
      values: () => this._users$().pipe(
        map((users) => nameValue(users, 'name', 'id')),
      ),
    };
  }

  /** Options nested under a parent that is itself unselectable. */
  public subjectSelect(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'subject',
      type: ItemType.Select,
      label: opts.label ?? 'Grouped select',
      children: 'types',
      values: () => this.subjects,
    };
  }

  /** A multi-select with one value promoted to its own toggle beside the list. */
  public isolateSelect(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'isolateStatus',
      type: ItemType.Select,
      label: opts.label ?? 'Isolate select',
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
    };
  }

  // ---------------------------------------------------------------- date

  public date(opts: { primary?: boolean; name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'date',
      type: ItemType.Date,
      label: opts.label ?? 'Date',
      primary: opts.primary,
    };
  }

  public dateTime(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'dateTime',
      type: ItemType.DateTime,
      label: opts.label ?? 'Date & Time',
    };
  }

  public dateRange(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'dateRange',
      type: ItemType.DateRange,
      label: opts.label ?? 'Date Range',
    };
  }

  public monthRange(opts: { name?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'monthRange',
      type: ItemType.MonthRange,
      label: ['From Billing Month', 'To Billing Month'],
    };
  }

  /** Month/year picked by scrolling rather than off a calendar. */
  public scrollDate(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'scrollDate',
      type: ItemType.Date,
      label: opts.label ?? 'Scroll Date',
      maxYear: (new Date()).getFullYear(),
      mode: ItemDateMode.ScrollMonthYear,
    };
  }

  // --------------------------------------------------------------- range

  public priceRange(opts: { name?: string; chipLabel?: string[] } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'price',
      type: ItemType.Range,
      label: 'Price',
      prefix: '$',
      suffix: 'USD',
      placeholder: 'Enter price',
      chipLabel: opts.chipLabel,
    };
  }

  // ------------------------------------------------- chips and checkbox

  public weekdayChips(opts: { name?: string; label?: string; multiple?: boolean } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'dayChips',
      type: ItemType.Chips,
      label: opts.label ?? 'Weekdays',
      multiple: opts.multiple ?? true,
      values: () => of(this.weekdays)
        .pipe(
          map((weekdays) => nameValue(weekdays, 'name', 'id')),
        ),
    };
  }

  public showDeletedCheckbox(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'showDeleted',
      type: ItemType.Checkbox,
      label: opts.label ?? 'Show Deleted',
      checked: 'deleted',
    };
  }

  // -------------------------------------------------------- autocomplete

  public userAutocomplete(
    opts: {
      name?: string;
      label?: string;
      primary?: boolean;
      default?: { name: string; value: unknown };
    } = {},
  ): IFilterConfigItem {
    return {
      name: opts.name ?? 'userId',
      type: ItemType.AutoComplete,
      label: opts.label ?? 'User',
      primary: opts.primary,
      default: opts.default,
      values: (keyword) => this._users$()
        .pipe(
          map((users) => this._matchKeyword(users, keyword)),
          map((users) => nameValue(users, 'name', 'id')),
        ),
    };
  }

  /**
   * Same autocomplete, but each option's label carries the record id the way a
   * "Name #id" picker label does. The `#` is the character the query-param
   * encoding example exercises — see QueryParamEncodingComponent.
   */
  public userAutocompleteWithId(opts: { name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'userId',
      type: ItemType.AutoComplete,
      label: opts.label ?? 'User',
      values: (keyword) => this._users$()
        .pipe(
          map((users) => this._matchKeyword(users, keyword)),
          map((users) => users.map((user) => ({
            name: `${user.name} #${user.id}`,
            value: user.id,
          }))),
        ),
    };
  }

  /**
   * Each option carries the whole user, not just name/value, so `chipImage` has an
   * `image` to read and a `subcontent` fn has something to put on the second line.
   */
  public userAutocompleteChips(
    opts: {
      name?: string;
      label?: string;
      primary?: boolean;
      multiple?: boolean;
      shape?: FilterAutocompleteChipsShape;
      subcontent?: FilterAutocompleteChipsSubcontentFn;
      chipImage?: string;
      default?: FilterNameValue[] | FilterNameValue;
      panelActions?: { label: string; click: (filter: FilterComponent) => void }[];
    } = {},
  ): IFilterConfigItem {
    return {
      name: opts.name ?? 'userIds',
      type: ItemType.AutoCompleteChips,
      label: opts.label ?? 'Users',
      primary: opts.primary,
      multiple: opts.multiple,
      shape: opts.shape,
      subcontent: opts.subcontent,
      // '' opts out of the default 'image' lookup for the examples that want a bare chip.
      chipImage: opts.chipImage,
      default: opts.default,
      panelActions: opts.panelActions,
      values: (keyword) => this._users$()
        .pipe(
          map((users) => this._matchKeyword(users, keyword)),
          map((users) => users.map((user) => ({
            name: user.name,
            value: user.id,
            email: user.email,
            title: user.title,
            image: user.image,
          }))),
        ),
    };
  }

  private _matchKeyword(users: ExampleUser[], keyword: string): ExampleUser[] {
    const needle = (keyword ?? '').toLowerCase();

    return users.filter((user) => user.name.toLowerCase().includes(needle));
  }

  private _users$(): Observable<ExampleUser[]> {
    return of(this.users);
  }
}
