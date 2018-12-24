import { ActivatedRoute } from '@angular/router';
import { Alias, Model } from 'tsmodels';

import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { isObservable } from 'rxjs/internal/util/isObservable';

import * as _isFunction from 'lodash/isFunction';
import * as _isObject from 'lodash/isObject';
import * as _toString from 'lodash/toString';

import * as moment from 'moment';

import { IFilterConfigItem } from '../classes';
import { FsFilterConfig } from './fs-filter-config';

export enum ItemType {
  text            = 'text',
  select          = 'select',
  range           = 'range',
  date            = 'date',
  datetime        = 'datetime',
  daterange       = 'daterange',
  datetimerange   = 'datetimerange',
  autocomplete    = 'autocomplete',
  autocompletechips = 'autocompletechips',
  checkbox        = 'checkbox'
}

export class FsFilterConfigItem extends Model {

  @Alias() public name: string;
  @Alias() public type: ItemType;
  @Alias() public label: string;
  @Alias() public multiple: boolean;
  @Alias() public groups: any;
  @Alias() public wait: boolean;
  @Alias() public query: string;
  @Alias() public values: any;
  @Alias() public values$: any;
  @Alias() public selectedValue: any;
  @Alias() public model: any;
  @Alias() public isolate: any;
  @Alias() public names: any;
  @Alias() public primary: boolean;
  @Alias() public search: any;
  @Alias() public unchecked: any;
  @Alias() public checked: any;
  @Alias() public alias: any;
  @Alias() public placeholder: any;
  @Alias('default') public defaultValue: any;

  public initialLoading = false;

  private _pendingValues = false;

  constructor(data: IFilterConfigItem | any = {},
              private _config: FsFilterConfig,
              private _route: ActivatedRoute,
              private _persists: any) {
    super();

    this._fromJSON(data);
  }

  get hasPendingValues() {
    return this._pendingValues;
  }

  public _fromJSON(data) {
    super._fromJSON(data);

    if (this.name && _isObject(this.name)) {
      this.names = this.name;
      this.name = Object.keys(this.names).join('-');
    }

    if (this._config.persist) {

      const persisted = this._persists[this._config.persist.name].data;

      if (persisted[this.name]) {

        let value = persisted[this.name];

        if (value) {
          if (this.type === ItemType.daterange || this.type === ItemType.datetimerange) {
            value.from = value.from ? moment.utc(value.from) : null;
            value.to = value.to ? moment.utc(value.to) : null;

          } else if (
            this.type === ItemType.date ||
            this.type === ItemType.datetime
          ) {
            value = moment(value);
          } else if (
            this.type === ItemType.checkbox && this.checked !== undefined
          ) {
            value = value == this.checked;
          } else if (this.type === ItemType.select && this.multiple) {
            value = [];
          }
        }

        this.model = value;
      }
    }

    this.applyDataFromQuery();

    if (_isFunction(data.values) &&
      this.type !== ItemType.autocomplete &&
      this.type !== ItemType.autocompletechips) {
      this.values = data.values();

      if (isObservable(this.values)) {
        this._pendingValues = true;
      } else {
        const values = Array.isArray(this.values) ? (this.values as any).slice() : this.values;
        this.sanitizeItem(values);
      }
    } else {
      const values = Array.isArray(data.values) ? data.values.slice() : data.values;
      this.sanitizeItem(values);
    }
  }

  public sanitizeItem(values) {
    switch (this.type) {
      case ItemType.text: {
        //?????
      }break;
      case ItemType.select: {
        this.sanitizeSelectItem(values)
      } break;
      case ItemType.range: {
        this.sanitizeRange();
      } break;
      case ItemType.checkbox: {
        this.sanitizeCheckbox();
      } break;
    }

    if (this.model === undefined) {

      if (this.type == 'checkbox') {
        this.model = this.checked == this.defaultValue;
      } else {
        this.model = this.defaultValue;
      }
    }

    if (this.model === undefined) {

      if (this.type == 'checkbox') {
        this.model = false;

      } else if (this.type == 'select') {

        if (this.multiple) {
          if (!Array.isArray(this.defaultValue)) {
            this.model = [];
          }
        } else {
          if (this.defaultValue === undefined) {
            this.model = '__all';
          }
        }
      } else if (this.type == 'autocompletechips') {
        this.model = [];
      }
    }
  }

  public sanitizeSelectItem(values) {
    this.values = values;
    this.groups = null;

    // let data = [];

    // if (this.nested) {
    //   // generate a list of values from objects that have not been nested.
    //   if (!this.multiple) {
    //     data.push({value: '__all', name: 'All', depth: 0});
    //   }
    //
    //   Array.prototype.push.apply(data, this.walkSelectNestedValues(filter, null, this.values));
    // } else {
    //
    //   data = this.walkSelectValues(filter, this.values);
    // }

    // this.values = data;

    if (this.isolate) {
      for (const index in this.values) {
        if (this.values.hasOwnProperty(index)) {
          if (!this.values[index]) {
            continue;
          }

          if (this.values[index].value == this.isolate.value) {
            this.values.splice(index, 1);
          }
        }
      }

      if (Array.isArray(this.model)) {
        if (this.model.length == this.values.length) {
          this.model = null;
          this.isolate.enabled = false;
        } else if (this.model[0] == this.isolate.value) {
          this.isolate.enabled = true;
        }
      }
    }

    for (const value of this.values) {

      if (value.group) {

        if (!this.groups) {
          this.groups = {};
        }

        if (!this.groups[value.group]) {
          this.groups[value.group] = [];
        }

        this.groups[value.group].push(value);
      }
    }
  }

  public sanitizeCheckbox() {
    this.checked = this.checked ? _toString(this.checked) : true;
    this.unchecked = this.unchecked ? _toString(this.unchecked) : false;
    this.defaultValue = this.defaultValue === undefined ? this.unchecked : _toString(this.defaultValue);
  }

  public applyDataFromQuery() {
    if (this.query) {

      let query = this._route.snapshot.queryParams[this.query];

      if (query !== undefined) {
        query += '';
        this.model = query;

        if (!query.length) {
          this.model = undefined;
        } else if (this.type == 'select' && this.multiple) {
          this.model = this.model.split(',');
        } else if (this.type == 'daterange' || this.type == 'datetimerange') {
          const parts = this.model.split(',');
          this.model = {from: moment(parts[0]), to: moment(parts[1])};
        } else if (this.type == 'range') {
          const parts = this.model.split(',');
          this.model = {min: parts[0], max: parts[1]};
        }
      }
    }

  }

  public updateValue(value) {
    switch (this.type) {
      case ItemType.select: {

        if (value === '__all' || value === null) {
          this.model = value;

          return;
        }

        let valueExists = null;

        let isolated = null;

        if (this.multiple) {
          isolated = this.isolate && Array.isArray(value) && value[0] === this.isolate.value;

          valueExists = Array.isArray(this.values)
            ? value.every((val) => {
                return this.values.find((valueItem) => valueItem.value === val)
              })
              || isolated
            : false;
        } else {
          valueExists = Array.isArray(this.values)
            ? this.values.some((valueItem) => valueItem.value === value)
            : false;
        }

        if (valueExists) {
          this.model = value;

          if (this.isolate) {
            this.isolate.enabled = isolated;
          }
          return;
        }
      } break;

      case ItemType.range: {
        this.model = _isObject(value) ? { ...this.model, ...value } : {};
      } break;

      case ItemType.date: case ItemType.datetime: {
        this.model = moment(value);
      } break;

      case ItemType.autocompletechips: {
        if (Array.isArray(value)) {
          this.model.push(...value);
        } else if (_isObject(value)) {
          this.model.push(value);
        } else {
          this.model = [];
        }
      } break;

      default: {
        this.model = value;
      }
    }
  }

  public loadRemoteValues() {
    this.initialLoading = true;
    this.values
      .pipe(
        take(1),
        takeUntil(this._config.destroy$),
      )
      .subscribe((values) => {
        this.sanitizeItem(values);
        this.initialLoading = false;
      });
  }

  private sanitizeRange() {
    if (!this.placeholder) {
      this.placeholder = ['Min', 'Max'];
    }

    if (!this.model) {
      this.model = {};
    }
  }
}
