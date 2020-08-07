import { ItemType } from '../../enums/item-type.enum';
import { BehaviorSubject, isObservable, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { isFunction } from 'lodash-es';

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

  public get valueChanged$() {
    return this._valueChanged$;
  }

  public get valueChanged() {
    return this._valueChanged$.getValue();
  }

  public set valueChanged(value: boolean) {
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
    this.model = undefined;
  };

  // TODO
  public updateValue(value) {

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
    if (this.model === undefined) {
      this.model = this.defaultValue;
    }
  }
}
