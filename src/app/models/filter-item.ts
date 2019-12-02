import { ActivatedRoute } from '@angular/router';
import { isEmpty, list as arrayList } from '@firestitch/common';

import { Alias, Model } from 'tsmodels';

import { take, takeUntil } from 'rxjs/operators';
import { isObservable } from 'rxjs/internal/util/isObservable';

import { isFunction, isObject, toString, isString, clone, filter } from 'lodash-es';
import { isDate, isValid, parse, parseISO } from 'date-fns';

import { FsFilterConfig } from './filter-config';
import {
  IFilterConfigAutocompleteItem,
  IFilterConfigDateItem,
  IFilterConfigItem
} from '../interfaces/item-config.interface';
import { simpleFormat } from '@firestitch/date';
import { ItemType } from '../enums/item-type.enum';
import { ItemDateMode } from '../enums/item-date-mode.enum';
import { BehaviorSubject } from 'rxjs';


export class FsFilterConfigItem extends Model {

  @Alias() public name: string;
  @Alias() public type: ItemType;
  @Alias() public label: any;
  @Alias() public chipLabel: string;
  @Alias() public children: string;
  @Alias() public multiple: boolean;
  @Alias() public groups: any;
  @Alias() public hide: boolean;
  @Alias() public wait: boolean;
  @Alias() public query: string;
  @Alias() public selectedValue: any;
  @Alias() public isolate: any;
  @Alias() public names: any;
  @Alias() public primary: boolean;
  @Alias() public search: any;
  @Alias() public unchecked: any;
  @Alias() public checked: any;
  @Alias() public alias: any;
  @Alias() public placeholder: any;
  @Alias() public change: Function;
  @Alias() public prefix: string;
  @Alias() public mode: string;
  @Alias() public maxYear: number;
  @Alias() public fetchOnFocus: boolean;
  @Alias('default') public defaultValue: any;

  public initialLoading = false;

  private _model: any;
  private _pendingValues = false;
  private _valueChanged$ = new BehaviorSubject(false);
  private _values$ = new BehaviorSubject(null);

  constructor(
    private _configItem: IFilterConfigItem | IFilterConfigDateItem | IFilterConfigAutocompleteItem,
    private _config: FsFilterConfig,
    private _route: ActivatedRoute,
    private _persists: any
  ) {
    super();
    this._fromJSON(_configItem);
  }

  get hasPendingValues() {
    return this._pendingValues;
  }

  get model() {
    return this._model;
  }

  set model(value) {
    this._setModel(value);
    this.checkIfValueChanged();
  }

  set values(values) {
    this._values$.next(values);
  }

  get values() {
    return this._values$.getValue();
  }

  get valueChanged$() {
    return this._valueChanged$.pipe(takeUntil(this._config.destroy$));
  }

  get valueChanged() {
    return this._valueChanged$.getValue();
  }

  set valueChanged(value: boolean) {
    this._valueChanged$.next(value);
  }

  get values$() {
    return this._values$.pipe(takeUntil(this._config.destroy$));
  }

  get value() {

    const opts: any = {};

    let value = clone(this.model) || null;

    if (this.isTypeSelect) {

      if (this.multiple) {

        if (this.isolate) {
          if (Array.isArray(this.model) && this.model.length) {
            value = this.model;
          }
        }

        if (this.model && this.model.indexOf('__all') > -1) {
          value = null;
        }

      } else {

        if (this.isolate) {
          if (this.model == '__all') {
            value = this.values.map(item => {
              return isObject(item) ? item.value : null;
            });
          }
        } else {
          if (this.model == '__all') {
            value = null;
          }
        }
      }
    } else if (this.isTypeAutocompleteChips || this.isTypeChips) {
      if (Array.isArray(this.model) && this.model.length) {
        value = this.model;
      }

    } else if (this.isTypeCheckbox) {
      value = this.model ? this.checked : this.unchecked;

    } else if (this.isTypeRange) {
      if (!isObject(this.model) ||
          (isEmpty(this.model.max, { zero: true }) && isEmpty(this.model.min, { zero: true }))) {
        value = null;
      }
    } else if (this.isTypeDateRange || this.isTypeDateTimeRange) {
      if (!isObject(this.model) ||
          (isEmpty(this.model.from, { zero: true }) && isEmpty(this.model.to, { zero: true }))) {
        value = null;
      }
    }

    // @TODO What is TODO?
    if (isEmpty(value, { zero: true })) {
      return null;
    }

    if (this.isTypeDate || this.isTypeDateTime) {

      if (value && isValid(value) && isDate(value)) {
        value = simpleFormat(value);
      }

    } else if (this.isTypeDateRange || this.isTypeDateTimeRange) {

      let from = value.from;
      let to = value.to;

      value = {};

      if (from) {
        if (isString(from)) {
          from = parseISO(from);
        }

        if (isValid(from) && isDate(from)) {
          value.from = simpleFormat(from);
        }
      }

      if (to) {
        if (isString(to)) {
          to = parseISO(to);
        }

        if (isValid(to) && isDate(to)) {
          value.to = simpleFormat(to);
        }
      }

    } else if (this.isTypeAutocomplete) {

      if (isEmpty(this.model.value, { zero: true })) {
        return null;
      }

      value = opts.expand ? this.model : this.model.value;
    }

    if (isObject(this.names) && opts.names !== false) {
      // What are names for?
      // for (const key in this.names) {
      //   if (value[this.names[key]]) {
      //     query[key] = value[filter.names[key]];
      //   }
      // }
    }

    return value;
  }

  public get flattenedParams() {

    const value = this.value;
    const name = this.name;
    const params = [];

    if (this.isTypeRange) {
      if (isObject(value)) {
        const values = [];
        if (!isEmpty(value.min, { zero: true })) {
          params[name + '_min'] = value.min;
          values.push(value.min);
        }

        if (!isEmpty(value.max, { zero: true })) {
          params[name + '_max'] = value.max;
          values.push(value.max);
        }

        // Legacy support
        if (values.length) {
          params[name] = values.join(',');
        }
      }
    } else if (this.isTypeDateRange || this.isTypeDateTimeRange) {
      if (isObject(value)) {
        if (value.from) {
          params[name + '_from'] = value.from;
        }

        if (value.to) {
          params[name + '_to'] = value.to;
        }
      }
    } else if (this.isTypeAutocompleteChips || this.isTypeChips) {
      if (Array.isArray(value)) {

        params[name] = this.model.map(item => {
          return isObject(item) ? item.value : null;
        }).join(',');
      }

    } else if (Array.isArray(value)) {
      params[name] = value.join(',');

    } else {
      params[name] = value;
    }

    return params;
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
        this.model = persisted[this.name];
      }
    }

    if (this.fetchOnFocus === void 0) {
      this.fetchOnFocus = false;
    }

    this.init();
  }

  public initValues() {
    if (!this._configItem) {
      return;
    }

    if (isFunction(this._configItem.values) &&
        !this.isTypeAutocomplete &&
        !this.isTypeAutocompleteChips) {
      const obj = this._configItem.values();

      this.values = obj;
      if (isObservable(obj)) {
        this._pendingValues = true;
      }

    } else {
      this.values = this._configItem.values;
    }
  }

  /*
   * This function seems redundent and the logic should be merged into _setModel()
   * Also we have to be careful with setting models that have values because of timing and
   * also values need names for human readably lists.
   */
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

      case ItemType.Range:
      case ItemType.DateRange:
      case ItemType.DateTimeRange: {
        this.model = isObject(value) ? { ...this.model, ...value } : {};
      } break;

      case ItemType.Chips: {
        this.model = [];
      } break;

      case ItemType.Date:
      case ItemType.DateTime: {
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

  public loadValues(reload = true) {
    if (reload || (!this.initialLoading && this.hasPendingValues)) {
      this.initialLoading = true;

      if (this._configItem && isFunction(this._configItem.values) &&
          !this.isTypeAutocomplete &&
          !this.isTypeAutocompleteChips) {

        const obj = this._configItem.values();

        if (isObservable(obj)) {
          // Clear out values so the interfaces go into a loading state
          this.values = [];
          obj
          .pipe(
            take(1),
            takeUntil(this._config.destroy$)
          )
          .subscribe((values) => {
            this.values = values;
            this._pendingValues = false;
            this.initialLoading = false;
            this.validateModel();
          });
        } else {
          this.values = obj;
          this.validateModel();
        }
      }
    }
  }

  public partialClear(type: string) {
    if (this.isTypeRange) {
      this.particalClearRange(type);
    } else {
      this.partialClearDateRange(type);
    }
  }

  public clear() {
    this.valueChanged = false;
    this.model = undefined;
    this.selectedValue = '';

    switch (this.type) {
      case ItemType.AutoComplete: {
        this.model = null;
        this.search = '';
      } break;

      case ItemType.AutoCompleteChips:
      case ItemType.Chips: {
        this.model = [];
        this.search = '';
      } break;

      case ItemType.Checkbox: {
        this.model = false;
      } break;

      case ItemType.Select: {
        if (this.multiple) {
          this.model = [];
        } else {
          this.model = Array.isArray(this.values) && this.values.some((val) => val.value === '__all')
            ? '__all'
            : null;
        }

        if (this.isolate) {
          this.isolate.enabled = false;
        }
      } break;

      case ItemType.Range: case ItemType.DateRange: case ItemType.DateTimeRange: {
        this.model = {};
      } break;

      case ItemType.Text:
      case ItemType.Keyword: {
        this.model = '';
      } break;


      case ItemType.Date: case ItemType.DateTime: {
        this.model = null;
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

      case ItemType.Text:
      case ItemType.Keyword: {
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

  private _setModel(value) {
    if (value) {
      if (this.isTypeDateRange || this.isTypeDateTimeRange) {

        if (value.from && (!isDate(value.from) || !isValid(value.from))) {
          value.from = parse(value.from, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }
        if (value.to && (!isDate(value.to) || !isValid(value.to))) {
          value.to = parse(value.to, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }

      } else if (this.isTypeDate || this.isTypeDateTime) {
        if (!isDate(value) || !isValid(value)) {
          value = parse(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }

      } else if (this.isTypeCheckbox && this.checked !== undefined) {
        value = this.checked;

      } else if (this.isTypeSelect) {

        if (this.multiple) {

          if (Array.isArray(value)) {
            value = value.map((val) => {
              if (isNaN(val)) {
                return val;
              } else {
                return +val;
              }
            })
          }
        } else {
          if (!isNaN(value)) {
            value = +value;
          }
        }

      }
    }

    this._model = value;
  }

  public get isTypeAutocomplete() {
    return this.type === ItemType.AutoComplete;
  }

  public get isTypeAutocompleteChips() {
    return this.type === ItemType.AutoCompleteChips;
  }

  public get isTypeChips() {
    return this.type === ItemType.Chips;
  }

  public get isTypeCheckbox() {
    return this.type === ItemType.Checkbox;
  }

  public get isTypeSelect() {
    return this.type === ItemType.Select;
  }

  public get isTypeDate() {
    return this.type === ItemType.Date;
  }

  public get isTypeDateRange() {
    return this.type === ItemType.DateRange;
  }

  public get isTypeRange() {
    return this.type === ItemType.Range;
  }

  public get isTypeDateTimeRange() {
    return this.type === ItemType.DateTimeRange;
  }

  public get isTypeDateTime() {
    return this.type === ItemType.DateTime;
  }

  public get isTypeKeyword() {
    return this.type === ItemType.Keyword;
  }

  public init() {

    switch (this.type) {
      case ItemType.Select: {
        this._initSelect();
      } break;
      case ItemType.Chips: {
        this._initChips();
      } break;
      case ItemType.Range: {
        this._initRange();
      } break;
      case ItemType.Date: {
        this._initDate();
      } break;
      case ItemType.DateRange: case ItemType.DateTimeRange: {
        this._initDateRange();
      } break;
      case ItemType.Checkbox: {
        this._initCheckbox();
      } break;
    }

    if (this.model === undefined) {

      if (this.isTypeCheckbox) {
        this.model = this.checked == this.defaultValue;
      } else {
        this.model = this.defaultValue;
      }
    }

    if (this.model === undefined) {

      if (this.isTypeCheckbox) {
        this.model = false;

      } else if (this.isTypeSelect) {

        if (this.multiple) {
          if (!Array.isArray(this.defaultValue)) {
            this.model = [];
          }
        } else {
          if (this.defaultValue === undefined) {
            this.model = '__all';
          }
        }
      } else if (this.isTypeAutocompleteChips || this.isTypeChips) {
        this.model = [];
      }
    }
  }

  public validateModel() {

    if (this.isTypeSelect) {

      if (this.multiple) {

        this.model = filter(this.model || [], (item) => {
          return this.values.find(value => {
            return value.value == item;
          });
        });

      } else {
        const item = this.values.find(value => {
            return value.value == this.model;
        });

        this.model = item ? item.value : '__all';
      }
    }
  }

  public destroy() {
    this._valueChanged$.complete();
    this._values$.complete();
  }

  private modelValueExists(values) {

    for (let i = 0; i < values.length; i++) {

      if (values[i].value === this.model) {
        return true;
      }

      if (values[i][this.children]) {
        const model = this.modelValueExists(values[i][this.children]);
        if (model) {
          return true;
        }
      }
    }

    return false;
  }

  private _initSelect() {

    if (!Array.isArray(this.values)) {
      this.values = [];
    }

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

  private _initChips() {

    if (!Array.isArray(this.values)) {
      this.values = [];
    }

    if (this.model && Array.isArray(this.model) && this.values.length) {
      if (Number.isInteger(this.model[0])) {
        this.model = this.model.map((id) => {
          return this.values.find((value) => value.value === id);
        })
      }
    }
  }

  private _initDate() {

    if (!this.mode) {
      this.mode = ItemDateMode.Calendar;
    }
  }

  private _initCheckbox() {
    this.checked = this.checked ? toString(this.checked) : true;
    this.unchecked = this.unchecked ? toString(this.unchecked) : false;
    this.defaultValue = this.defaultValue === undefined ? this.unchecked : toString(this.defaultValue);
  }

  private _initRange() {
    if (!this.label) {
      this.label = ['Min', 'Max'];
    }

    if (this.placeholder) {
      this.label = this.placeholder;
    }

    if (!this.model) {
      this.model = {};
    }
  }

  private _initDateRange() {
    if (!this.label) {
      this.label = ['Date From', 'Date To'];
    }

    if (this.placeholder) {
      this.label = this.placeholder;
    }

    if (!this.model) {
      this.model = {};
    }
  }

  private particalClearRange(type) {
    if (type === 'from') {
      delete this.model.min;

      this.valueChanged = !!this.model.max;
    } else if (type === 'to') {
      delete this.model.max;

      this.valueChanged = !!this.model.min;
    }
  }

  private partialClearDateRange(type) {
    if (type === 'from') {
      delete this.model.from;

      this.valueChanged = !!this.model.to;
    } else if (type === 'to') {
      delete this.model.to;

      this.valueChanged = !!this.model.from;
    }
  }
}
