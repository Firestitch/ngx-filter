import { ActivatedRoute } from '@angular/router';
import { toUTC } from '@firestitch/date';

import { Alias, Model } from 'tsmodels';

import { take, takeUntil } from 'rxjs/operators';
import { isObservable } from 'rxjs/internal/util/isObservable';

import { isFunction, isObject, toString, clone, filter } from 'lodash-es';
import { isDate, isValid, parse } from 'date-fns';

import { FsFilterConfig } from './filter-config';
import { IFilterConfigItem } from '../interfaces/item-config.interface';


export enum ItemType {
  Text              = 'text',
  Select            = 'select',
  Range             = 'range',
  Date              = 'date',
  DateTime          = 'datetime',
  DateRange         = 'daterange',
  DateTimeRange     = 'datetimerange',
  AutoComplete      = 'autocomplete',
  AutoCompleteChips = 'autocompletechips',
  Checkbox          = 'checkbox',
  Chips             = 'chips',
  Keyword           = 'keyword',
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
  @Alias() public change: Function;
  @Alias() public prefix: string;
  @Alias('default') public defaultValue: any;

  public initialLoading = false;
  public valueChanged = false;

  private _model: any;
  private _pendingValues = false;
  private _values: any;

  constructor(private _configItem: IFilterConfigItem | any = {},
              private _config: FsFilterConfig,
              private _route: ActivatedRoute,
              private _persists: any) {
    super();
    this._fromJSON(_configItem);
  }

  get hasPendingValues() {
    return this._pendingValues;
  }

  get model() {
    return this._model;
  }

  set model(val) {
    this._model = val;
    this.checkIfValueChanged();
  }

  set values(values) {
    this._values = values;
    this.sanitize();
  }

  get values() {
    return this._values;
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
        this.parseAndSetValue(persisted[this.name]);
      }
    }

    this.sanitize();
  }

  public initValues() {
    if (isFunction(this._configItem.values) &&
        !this.isTypeAutocomplete() &&
        !this.isTypeAutocompleteChips()) {
      const obj = this._configItem.values();

      this.values = obj;
      if (isObservable(obj)) {
        this._pendingValues = true;
      }
    } else {
      this.values = this._configItem.values;
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

      case ItemType.Range: case ItemType.DateRange: {
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

  public loadValues(reload = true) {
    if (reload || (!this.initialLoading && this.hasPendingValues)) {
      this.initialLoading = true;

      if (isFunction(this._configItem.values) &&
          !this.isTypeAutocomplete() &&
          !this.isTypeAutocompleteChips()) {

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
          this.values = obj
        }
      }
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

      case ItemType.Range: case ItemType.DateRange: {
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

  public parseAndSetValue(value) {
    if (value) {
      if (this.isTypeDateRange() || this.isTypeDateTimeRange()) {
        if (value.from && (!isDate(value.from) || !isValid(value.from))) {
          value.from = parse(value.from, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }
        if (value.to && (!isDate(value.to) || !isValid(value.to))) {
          value.to = parse(value.to, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }
      } else if (this.isTypeDate() || this.isTypeDateTime()) {
        if (!isDate(value) || !isValid(value)) {
          value = parse(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxxxx', new Date());
        }
      } else if (
        this.isTypeCheckbox() && this.checked !== undefined
      ) {
        value = value == this.checked;
      } else if (this.isTypeSelect() && this.multiple) {
        if (Array.isArray(value)) {
          value = value.map((val) => {
            if (isNaN(val)) {
              return val;
            } else {
              return +val;
            }
          })
        }
      } else if (this.isTypeSelect() || this.isTypeAutocomplete()) {
        value = +value;
      }
    }

    this.model = value;
  }

  public isTypeAutocomplete() {
    return this.type === ItemType.AutoComplete;
  }

  public isTypeAutocompleteChips() {
    return this.type === ItemType.AutoCompleteChips;
  }

  public isTypeChips() {
    return this.type === ItemType.Chips;
  }

  public isTypeCheckbox() {
    return this.type === ItemType.Checkbox;
  }

  public isTypeSelect() {
    return this.type === ItemType.Select;
  }

  public isTypeDate() {
    return this.type === ItemType.Date;
  }

  public isTypeDateRange() {
    return this.type === ItemType.DateRange;
  }

  public isTypeDateTimeRange() {
    return this.type === ItemType.DateTimeRange;
  }

  public isTypeDateTime() {
    return this.type === ItemType.DateTime;
  }

  public sanitize() {
    switch (this.type) {
      case ItemType.Text:
      case ItemType.Keyword: {
        //?????
      } break;
      case ItemType.Select: {
        this.sanitizeSelect();
      } break;
      case ItemType.Chips: {
        this.sanitizeChips();
      } break;
      case ItemType.Range: {
        this.sanitizeRange();
      } break;
      case ItemType.DateRange: {
        this.sanitizeDateRange();
      } break;
      case ItemType.Checkbox: {
        this.sanitizeCheckbox();
      } break;
    }

    if (this.model === undefined) {

      if (this.isTypeCheckbox()) {
        this.model = this.checked == this.defaultValue;
      } else {
        this.model = this.defaultValue;
      }
    }

    if (this.model === undefined) {

      if (this.isTypeCheckbox()) {
        this.model = false;

      } else if (this.isTypeSelect()) {

        if (this.multiple) {
          if (!Array.isArray(this.defaultValue)) {
            this.model = [];
          }
        } else {
          if (this.defaultValue === undefined) {
            this.model = '__all';
          }
        }
      } else if (this.isTypeAutocompleteChips() || this.isTypeChips()) {
        this.model = [];
      }
    }
  }

  public validateModel() {

    if (this.isTypeSelect()) {

      if (this.multiple) {

        this.model = filter(this.model || [], (item) => {
          return this.values.find(value => {
            return value.value === item;
          });
        });

      } else {
        const exists = this.modelValueExists(this.values);

        if (!exists) {
          this.model = '__all';
        }
      }
    }
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

  private sanitizeSelect() {

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

  private sanitizeChips() {

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

  private sanitizeCheckbox() {
    this.checked = this.checked ? toString(this.checked) : true;
    this.unchecked = this.unchecked ? toString(this.unchecked) : false;
    this.defaultValue = this.defaultValue === undefined ? this.unchecked : toString(this.defaultValue);
  }

  private sanitizeRange() {
    if (!this.placeholder) {
      this.placeholder = ['Min', 'Max'];
    }

    if (!this.model) {
      this.model = {};
    }
  }

  private sanitizeDateRange() {
    if (!this.placeholder) {
      this.placeholder = ['Date From', 'Date To'];
    }

    if (!this.model) {
      this.model = {};
    }
  }

}
