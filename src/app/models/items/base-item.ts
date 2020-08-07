import { isFunction } from 'lodash-es';

import { BehaviorSubject, isObservable, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ItemType } from '../../enums/item-type.enum';

import {
  IFilterConfigBaseItem,
  IFilterItemDefaultRange
} from '../../interfaces/item-config.interface';

export abstract class BaseItem<T extends IFilterConfigBaseItem> {

  // Configurable properties

  public name: string;
  public label: string | string[];
  public chipLabel: string | string[];
  public hide: boolean;
  public defaultValue: any | IFilterItemDefaultRange;

  // Internal properties

  public change: (item: IFilterConfigBaseItem) => void;

  protected readonly _type: ItemType;

  protected _model: any;
  protected _initialLoading = false;
  protected _pendingValues = false;
  protected _observableValues: Observable<any>;
  protected _value$ = new BehaviorSubject(null);
  protected _valueChanged$ = new BehaviorSubject(false);
  protected _values$ = new BehaviorSubject(null);

  protected _destroy$ = new Subject<void>();

  constructor(
    itemConfig: T,
    private _persistedValues: any
  ) {
    this._type = itemConfig.type;
    this._parseConfig(itemConfig);
  }

  ///
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
  ////

  public get destroy$() {
    return this._destroy$.asObservable();
  }

  public get type(): ItemType {
    return this._type;
  }

  public get hasPendingValues(): boolean {
    return this._pendingValues;
  }

  public get model() {
    return this._model;
  }

  public set model(value) {
    this._setModel(value);
    this.checkIfValueChanged();
  }

  public set values(values) {
    this._values$.next(values);
  }

  public get values() {
    return this._values$.getValue();
  }

  public get values$() {
    return  this._values$.asObservable();
  }

  public get value$() {
    return this._value$.asObservable();
  }

  public get valueChanged$() {
    return this._valueChanged$;
  }

  public get valueChanged() {
    return this._valueChanged$.getValue();
  }

  public set valueChanged(value: boolean) {
    this._value$.next(this.value);
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
    if (reload || (!this.initialLoading && this.hasPendingValues)) {
      this.initialLoading = true;

      this._observableValues
        .pipe(
          take(1),
          takeUntil(this._destroy$)
        )
        .subscribe((values) => {
          this.values = values;
          this._pendingValues = false;
          this.initialLoading = false;
          this._init();
          this._validateModel();
        });

    }
  }


  // TODO strange intersection with loadValues
  public initValues() {
    const isAutocomplete = this.type === ItemType.AutoComplete || this.type === ItemType.AutoCompleteChips;

    if (isFunction(this.values) && !isAutocomplete) {
      const valuesResult = this.values();

      if (isObservable(valuesResult)) {
        this._pendingValues = true;
        this._observableValues = valuesResult;

        this.loadValues(false);
      } else {
        this.values = valuesResult;

        // Move to some other place
        this._init();
      }

    } else {
      this._init();
    }
  }


  public clear() {
    this.valueChanged = false;

    const oldValue = this.value;
    this.model = undefined;
    const newValue = this.value;

    if (oldValue !== newValue && this.change) {
      this.change(this);
    }
  };

  // TODO
  public updateValue(value) {

  }

  public getChipsContent(type): string {
    return '';
  }


  public destroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected abstract _init();
  protected abstract _validateModel();

  protected _setModel(value) {
    this._model = value;
  }

  protected _parseConfig(item: T) {
    this.name = item.name;
    this.label = item.label;
    this.chipLabel = item.chipLabel;
    this.defaultValue = item.default;
    this.change = item.change;
    this.hide = item.hide;

    this.values = item.values;

    this._initDefaultModel();
  };

  protected _initDefaultModel() {
    // TODO nullish change
    if (this.model === undefined && this.defaultValue !== undefined) {
      this.model = this.defaultValue;
    }
  }
}
