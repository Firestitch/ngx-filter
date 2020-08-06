import { ItemType } from '../../enums/item-type.enum';
import { BehaviorSubject, isObservable, Observable } from 'rxjs';
import { IFilterConfigItem } from '../../interfaces/config.interface';
import {
  IFilterConfigBaseItem,
  IFilterItemDefaultRange
} from '../../interfaces/item-config.interface';
import { FsFilterConfig } from '../filter-config';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { isFunction } from 'rxjs/internal-compatibility';

export abstract class BaseItem<T extends IFilterConfigBaseItem> {

  public name: string;
  public type: ItemType;
  public label: string | string[];

  public chipLabel: string | string[];

  // @TODO remove
  public groups: any;

  public hide: boolean;
  public wait: boolean;
  public query: string;
  public selectedValue: any;

  // @TODO remove
  public names: any;

  // ???
  public search: any;

  public unchecked: any;
  public checked: any;

  // @TODO remove
  public alias: any;

  public options: any;
  public placeholder: any;
  public change: Function;
  public prefix: string;
  public suffix: string;
  public mode: string;
  public maxYear: number;
  public fetchOnFocus: boolean;


  protected _model: any;
  public defaultValue: any | IFilterItemDefaultRange;

  protected _initialLoading = false;

  protected _pendingValues = false;
  protected _observableValues: Observable<any>;
  protected _valueChanged$ = new BehaviorSubject(false);
  protected _values$ = new BehaviorSubject(null);

  constructor(
    itemConfig: T,
    private _persistedValues: any
  ) {
    this._parseConfig(itemConfig);
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

  get values$() {
    return  this._values$.asObservable();
  }

  get valueChanged$() {
    return this._valueChanged$;
  }

  get valueChanged() {
    return this._valueChanged$.getValue();
  }

  set valueChanged(value: boolean) {
    this._valueChanged$.next(value);
  }

  public get initialLoading(): boolean {
    return this._initialLoading;
  }

  public set initialLoading(value: boolean) {
    this._initialLoading = value;
  }

  public abstract get value();

  public abstract checkIfValueChanged();

  public get flattenedParams() {
    const value = this.value;
    const name = this.name;
    const params = [];

    if (Array.isArray(value)) {
      params[name] = value.join(',');
    } else {
      params[name] = value;
    }

    return params;
  }

  public loadValues(reload = true) {
    debugger;
    if (reload || (!this.initialLoading && this.hasPendingValues)) {
      this.initialLoading = true;

      this._observableValues
        .pipe(
          take(1),
          // takeUntil(this._config.destroy$)
        )
        .subscribe((values) => {
          debugger;
          this.values = values;
          this._pendingValues = false;
          this.initialLoading = false;
          this._validateModel();
        });

      //!this.isTypeAutocomplete &&
      //         !this.isTypeAutocompleteChips

    }
  }


  // TODO strange intersection with loadValues
  public initValues() {
    // &&
    //       !this.isTypeAutocomplete &&
    //       !this.isTypeAutocompleteChips
    debugger;
    if (isFunction(this.values)) {
      const valuesResult = this.values();

      if (isObservable(valuesResult)) {
        this._pendingValues = true;
        this._observableValues = valuesResult;
      } else {
        this.values = valuesResult;
      }

    }
  }


  public clear() {
    this.valueChanged = false;
    this.model = undefined;
  };

  // TODO
  public updateValue(value) {

  }

  protected abstract _init();
  protected abstract _validateModel();
  protected abstract _setModel(value);

  protected _parseConfig(item: T) {
    this.name = item.name;
    this.type = item.type;
    this.label = item.label;

    this.values = item.values;

    this._initDefaultModel();
  };

  protected _initDefaultModel() {
    // TODO nullish change
    if (this.model === undefined) {
      this.model = this.defaultValue;
    }
  }
}
