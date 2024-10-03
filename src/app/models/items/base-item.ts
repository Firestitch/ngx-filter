
import { BehaviorSubject, isObservable, Observable, Subject } from 'rxjs';
import {
  finalize,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { isFunction } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigItem } from '../../interfaces/config.interface';
import { IFilterDefaultFn } from '../../interfaces/items/base.interface';
import { IFilterItemDefaultRange } from '../../interfaces/items/range.interface';


export abstract class BaseItem<T extends IFilterConfigItem> {

  public name: string;
  public label: any;
  public chipLabel: string | string[];
  public hide: boolean;
  public defaultValue: any | IFilterItemDefaultRange;
  public defaultValueFn: IFilterDefaultFn;
  public persistedValue: unknown;
  public showClear: boolean;
  public persistanceDisabled: boolean;
  public queryParamsDisabled: boolean;
  public change: (item: BaseItem<T>, filter: FilterComponent) => void;
  public init: (item: BaseItem<T>, filter?) => void;

  protected readonly _type: T['type'];

  protected _model: any;
  protected _pendingValues = false;
  protected _pendingDefaultValue = false;
  protected _initializedValues = false;
  protected _loading$ = new BehaviorSubject(false);
  protected _value$ = new BehaviorSubject(null);
  protected _valueChange$ = new Subject<void>();
  protected _values$ = new BehaviorSubject(null);
  protected _valuesFn: (keyword?: string, filter?: FilterComponent) => Observable<any> | any;

  protected _destroy$ = new Subject<void>();

  private _clear$ = new Subject<unknown>();

  constructor(
    itemConfig: T,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    this._type = itemConfig.type;
    this._parseConfig(itemConfig);
  }

  public abstract get value();

  public get filter(): FilterComponent {
    return this._filter;
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

  public get isChipVisible(): boolean {
    return !!this.model;
  }

  public get destroy$() {
    return this._destroy$.asObservable();
  }

  public get type(): T['type'] {
    return this._type;
  }

  public get hasPendingValues(): boolean {
    return this._pendingValues;
  }

  public get hasPendingDefaultValue(): boolean {
    return this._pendingDefaultValue;
  }

  public get model() {
    return this._model;
  }

  public set model(value) {
    this._setModel(value);
    this.valueChanged();
  }

  public set values(values) {
    this._values$.next(values);
  }

  public get values() {
    return this._values$.getValue();
  }

  public get values$(): Observable<unknown> {
    return this._values$.asObservable();
  }

  public get valueChange$() {
    return this._valueChange$.asObservable();
  }

  public get value$() {
    return this._value$.asObservable();
  }

  public get clear$() {
    return this._clear$.asObservable();
  }

  public get initialized() {
    return this._initialized;
  }

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  public get loading(): boolean {
    return this._loading$.getValue();
  }

  public set loading(value: boolean) {
    this._loading$.next(value);
  }

  protected get _initialized(): boolean {
    return !this._pendingDefaultValue && !this._pendingValues && this._initializedValues;
  }

  public valueChanged() {
    this._value$.next(this.value);

    if (this.change) {
      this.change(this, this._filter);
    }

    if (this.initialized) {
      this._valueChange$.next();
    }
  }

  public get queryObject(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;
    const params = {};

    if (Array.isArray(value)) {
      params[this.name] = value.join(',');
    } else {
      params[name] = value;
    }

    return params;
  }

  public get persistanceObject(): Record<string, unknown> {
    return this.queryObject;
  }

  public loadDefaultValue(): Observable<any> {
    this._pendingDefaultValue = true;

    return this.defaultValueFn()
      .pipe(
        tap((value) => {
          this.defaultValue = value;

          this._initDefaultModel();
        }),
        finalize(() => {
          this._pendingDefaultValue = false;
        }),
      );
  }

  public initValues(persistedValue: unknown) {
    this._initializedValues = false;
    this.persistedValue = persistedValue;
    this._initDefaultModel();

    const isAutocomplete = this.type === ItemType.AutoComplete || this.type === ItemType.AutoCompleteChips;

    if (this._valuesFn && !isAutocomplete) {
      const valuesResult = this._valuesFn(null, this._filter);

      if (isObservable(valuesResult)) {
        this._pendingValues = true;
      } else {
        this.values = valuesResult;
        this._init();
        this._initializedValues = true;
      }

    } else {
      this._init();
      this._initializedValues = true;
    }
  }

  public loadAsyncValues(reload = true) {
    if (reload || (!this.loading && this.hasPendingValues)) {
      this.loading = true;

      (this._valuesFn(null, this._filter) as Observable<unknown>)
        .pipe(
          take(1),
          takeUntil(this._destroy$),
        )
        .subscribe((values) => {
          this.values = values;
          this._pendingValues = false;
          this.loading = false;
          this._init();
          this._validateModel();
          this._initializedValues = true;
        });

    }
  }

  public clear(defaultValue: unknown = undefined) {
    if (this.isTypeRange || this.isTypeDateRange || this.isTypeDateTimeRange) {
      console.warn(`
        Filter ${this.name} can not be cleared with .clear() method!
        Use special .clearRange() or clearDateRange() instead.
      `);
    }

    this._clear$.next(defaultValue);
    this._clearValue(defaultValue);
  }

  public getChipsContent(type): string {
    return '';
  }


  public destroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected _setModel(value) {
    this._model = value;
  }

  protected _parseConfig(item: T) {
    this.name = item.name;
    this.label = item.label;
    this.chipLabel = item.chipLabel;

    if (typeof item.default === 'function') {
      this.defaultValueFn = item.default as IFilterDefaultFn;
    } else {
      this.defaultValue = item.default;
    }

    this.change = item.change;
    this.init = item.init || ((_) => {
      //
    });
    this.hide = item.hide;
    this.showClear = item.clear ?? true;
    this.persistanceDisabled = item.disablePersist ?? false;
    this.queryParamsDisabled = item.disableQueryParams ?? false;

    if (isFunction(item.values)) {
      this._valuesFn = item.values;
    } else {
      this.values = item.values;
    }
  }

  protected _initDefaultModel() {
    const model = this.persistedValue ?? this.defaultValue;

    if (model !== undefined) {
      this._setModel(model);
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    this.model = defaultValue ?? undefined;
  }

  protected abstract _init();
  protected abstract _validateModel();
}
