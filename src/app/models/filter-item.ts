import { ActivatedRoute } from '@angular/router';
import { toUTC } from '@firestitch/date';

import { Alias, Model } from 'tsmodels';

import { take, takeUntil } from 'rxjs/operators';
import { isObservable } from 'rxjs/internal/util/isObservable';

import { isFunction, isObject, toString, clone } from 'lodash-es';
import { isDate, isValid, parse } from 'date-fns';

import { FsFilterConfig } from './filter-config';
import { IFilterConfigItem } from '../interfaces/item-config.interface';


export enum ItemType {
  Text            = 'text',
  Select          = 'select',
  Range           = 'range',
  Date            = 'date',
  DateTime        = 'datetime',
  DateRange       = 'daterange',
  DateTimeRange   = 'datetimerange',
  AutoComplete    = 'autocomplete',
  AutoCompleteChips = 'autocompletechips',
  Checkbox        = 'checkbox',
  Chips           = 'chips',
}

export class FsFilterConfigItem extends Model {

  @Alias() public name: string;
  @Alias() public type: ItemType;
  @Alias() public label: string;
  @Alias() public chipLabel: string;
  @Alias() public children: string;
  @Alias() public multiple: boolean;
  @Alias() public groups: any;
  @Alias() public wait: boolean;
  @Alias() public query: string;
  @Alias() public values: any;
  @Alias() public values$: any;
  @Alias() public selectedValue: any;
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
  public valueChanged = false;

  private _model: any;
  private _tmpModel: any;
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

  get model() {
    return this._model;
  }

  set model(val) {
    this._model = val;
    this._tmpModel = val;
    this.checkIfValueChanged();
  }

  get tmpModel() {
    return this._tmpModel;
  }

  set tmpModel(val) {
    this._tmpModel = val;
  }

  public _fromJSON(data) {
    super._fromJSON(data);

    if (this.name && isObject(this.name)) {
      this.names = this.name;
      this.name = Object.keys(this.names).join('-');
    }

    if (this._config.persist) {
      const persisted = this._persists[this._config.persist.name].data;

      if (persisted[this.name]) {

        let value = persisted[this.name];

        if (value) {
          if (this.type === ItemType.DateRange || this.type === ItemType.DateTimeRange) {
            value.from = value.from ? toUTC(value.from) : null;
            value.to = value.to ? toUTC(value.to) : null;

          } else if (
            this.type === ItemType.Date ||
            this.type === ItemType.DateTime
          ) {
            if (!isDate(value) || !isValid(value)) {
              value = parse(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
            }
          } else if (
            this.type === ItemType.Checkbox && this.checked !== undefined
          ) {
            value = value == this.checked;
          } else if (this.type === ItemType.Select && this.multiple) {
            value = clone(value);
          }
        }

        this.model = value;
      }
    }

    this.applyDataFromQuery();

    if (isFunction(data.values) &&
      this.type !== ItemType.AutoComplete &&
      this.type !== ItemType.AutoCompleteChips) {
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
      case ItemType.Text: {
        //?????
      }break;
      case ItemType.Select: {
        this.sanitizeSelectItem(values)
      } break;
      case ItemType.Chips: {
        this.sanitizeChipsItem(values)
      } break;
      case ItemType.Range: {
        this.sanitizeRange();
      } break;
      case ItemType.Checkbox: {
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
      } else if (this.type == ItemType.AutoCompleteChips || this.type == ItemType.Chips) {
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
  }

  public sanitizeChipsItem(values) {
    this.values = values;
    this.groups = null;

    // if (this.isolate) {
    //   for (const index in this.values) {
    //     if (this.values.hasOwnProperty(index)) {
    //       if (!this.values[index]) {
    //         continue;
    //       }
    //
    //       if (this.values[index].value == this.isolate.value) {
    //         this.values.splice(index, 1);
    //       }
    //     }
    //   }
    //
    //   if (Array.isArray(this.model)) {
    //     if (this.model.length == this.values.length) {
    //       this.model = null;
    //       this.isolate.enabled = false;
    //     } else if (this.model[0] == this.isolate.value) {
    //       this.isolate.enabled = true;
    //     }
    //   }
    // }
    //
    // for (const value of this.values) {
    //
    //   if (value.group) {
    //
    //     if (!this.groups) {
    //       this.groups = {};
    //     }
    //
    //     if (!this.groups[value.group]) {
    //       this.groups[value.group] = [];
    //     }
    //
    //     this.groups[value.group].push(value);
    //   }
    // }
  }


  public sanitizeCheckbox() {
    this.checked = this.checked ? toString(this.checked) : true;
    this.unchecked = this.unchecked ? toString(this.unchecked) : false;
    this.defaultValue = this.defaultValue === undefined ? this.unchecked : toString(this.defaultValue);
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
          this.model = {from: parts[0], to: parts[1]};
        } else if (this.type == 'range') {
          const parts = this.model.split(',');
          this.model = {min: parts[0], max: parts[1]};
        }
      }
    }

  }

  public updateValue(value) {
    switch (this.type) {
      case ItemType.Select: {

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

      case ItemType.Range: {
        this.model = isObject(value) ? { ...this.model, ...value } : {};
      } break;

      case ItemType.Chips: {
        this.model = [];
      } break;

      case ItemType.Date: case ItemType.DateTime: {
        this.model = value;
      } break;

      case ItemType.AutoCompleteChips: {
        if (Array.isArray(value)) {
          this.model.push(...value);
        } else if (isObject(value)) {
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
    if (!this.initialLoading && this._pendingValues) {
      this.initialLoading = true;

      this.values
        .pipe(
          take(1),
          takeUntil(this._config.destroy$),
        )
        .subscribe((values) => {
          this._pendingValues = false;
          this.sanitizeItem(values);
          this.initialLoading = false;
        });

    }
  }

  public clear() {
    this.valueChanged = false;
    this.model = undefined;

    switch (this.type) {
      case ItemType.AutoComplete: {
        this.model = null;
        this.tmpModel = null;
        this.search = '';
      } break;

      case ItemType.AutoCompleteChips: case ItemType.Chips: {
        this.model = [];
        this.tmpModel = [];
        this.search = '';
      } break;

      case ItemType.Checkbox: {
        this.model = false;
        this.tmpModel = false;
      } break;

      case ItemType.Select: {
        if (this.multiple) {
          this.model = [];
          this.tmpModel = [];
        } else {
          this.model = Array.isArray(this.values) && this.values.some((val) => val.value === '__all')
            ? '__all'
            : null;
          this.tmpModel = this.model;
        }

        if (this.isolate) {
          this.isolate.enabled = false;
        }
      } break;

      case ItemType.Range: {
        this.model = {};
        this.tmpModel = {};
      } break;

      case ItemType.Text: {
        this.model = '';
        this.tmpModel = '';
      } break;


      case ItemType.Date: case ItemType.DateTime: {
        this.model = null;
        this.tmpModel = null;
      } break;
    }
  }

  public checkIfValueChanged() {
    switch (this.type) {
      case ItemType.AutoCompleteChips: {
        this.valueChanged = this.model && this.model.length;
      } break;

      case ItemType.Checkbox: {
        this.valueChanged = this.model && this.model !== false;
      } break;

      case ItemType.Select: {
        if (this.multiple) {
          this.valueChanged = this.model && this.model.length;
        } else {
          const hasAllOption = Array.isArray(this.values) && this.values.some((val) => val.value === '__all');
          if (hasAllOption && this.model && this.model !== '__all') {
            this.valueChanged = true;
          } else {
            this.valueChanged = !!this.model;
          }
        }
      } break;

      case ItemType.Range: {
        if (this.model && Object.keys(this.model).length > 0) {
          this.valueChanged = true;
        }
      } break;

      case ItemType.Text: {
        this.valueChanged = this.model && this.model !== '';
      } break;

      case ItemType.AutoComplete: case ItemType.Date: case ItemType.DateTime: {
        this.valueChanged = !!this.model;
      } break;

      default: {
        this.valueChanged = false;
      }
    }
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
