import { Injectable } from '@angular/core';

import { nameValue } from '@firestitch/common';
import { IFilterConfigItem, ItemType } from '@firestitch/filter';

import { map, Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class FilterItemsService {

  public users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Sam Smith' },
    { id: 3, name: 'Billy Bob' },
    { id: 4, name: 'James Bond' },
  ];

  public keyword(opts: { label?: string; fullWidth?: boolean } = {}): IFilterConfigItem {
    return {
      name: 'keyword',
      type: ItemType.Keyword,
      label: opts.label ?? 'Search',
      fullWidth: opts.fullWidth,
    };
  }

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

  public date(opts: { primary?: boolean; name?: string; label?: string } = {}): IFilterConfigItem {
    return {
      name: opts.name ?? 'date',
      type: ItemType.Date,
      label: opts.label ?? 'Date',
      primary: opts.primary,
    };
  }

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
          map((users) => users.filter((user) => {
            return user.name.toLowerCase().includes((keyword ?? '').toLowerCase());
          })),
          map((users) => nameValue(users, 'name', 'id')),
        ),
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

  private _users$(): Observable<{ id: number; name: string }[]> {
    return of(this.users);
  }
}
