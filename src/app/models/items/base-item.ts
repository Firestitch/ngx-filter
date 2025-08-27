
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { isFunction } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';
import { IFilterConfigItem } from '../../interfaces/config.interface';
import { IFilterDefaultFn } from '../../interfaces/items/base.interface';


export abstract class BaseItem<T extends IFilterConfigItem> {

  public name: string;
  public label: any;
  public chipLabel: string | string[];
  public defaultValueFn: IFilterDefaultFn;
  public defaultValue: any;
  public showClear: boolean;
  public persistanceDisabled: boolean;
  public queryParamsDisabled: boolean;
  public changeCallback: (item: BaseItem<T>, filter: FilterComponent) => void;
  public initCallback: (item: BaseItem<T>, filter?) => void;

  protected readonly _type: T['type'];

  protected _valuesFn: (keyword?: string, filter?: FilterComponent) => Observable<any> | any[];

  private _hidden$ = new BehaviorSubject(false);
  private _value$ = new BehaviorSubject<{ value: any, emitChange: boolean }>({ value: undefined, emitChange: true });
  private _values$ = new BehaviorSubject<any[]>(null);
  private _destroy$ = new Subject<void>();
  private _emitChange = true;

  constructor(
    itemConfig: T,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    this._type = itemConfig.type;
    this._initConfig(itemConfig);
  }

  public get filter(): FilterComponent {
    return this._filter;
  }

  public get hidden$(): Observable<boolean> {
    return this._hidden$.asObservable();
  }

  public get visible$(): Observable<boolean> {
    return this._hidden$
      .pipe(
        map((hidden) => !hidden),
      );
  }

  public get hidden(): boolean {
    return this._hidden$.getValue();
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
    return this.hasValue;
  }

  public get destroy$() {
    return this._destroy$.asObservable();
  }

  public get type(): T['type'] {
    return this._type;
  }

  public get hasValue() {
    return this.value !== null && this.value !== undefined;
  }

  public get hasValue$() {
    return this.value$
      .pipe(
        map(() => this.hasValue),
      );
  }

  public get chips$() {
    return this.value$
      .pipe(
        map(() => this.chips),
      );
  }

  public set values(values) {
    this._values$.next(values);
  }

  public get values() {
    return this._values$.getValue();
  }

  public get values$(): Observable<any> {
    return this._values$.asObservable()
      .pipe(
        filter(() => this._emitChange),
      );
  }

  public get value$() {
    return this._value$.asObservable()
      .pipe(
        filter((event) => event.emitChange),
        map((event) => event.value),
      );
  }

  public get value() {
    return this._value$.getValue().value;
  }
  
  public set value(value) {
    this.setValue(value);
  }

  public setValue(value: unknown, emitChange: boolean = true) {
    this._value$.next({ value, emitChange });
  }

  public get queryParam(): Record<string, unknown> {
    return this.query;
  }

  public hide() {
    this._hidden$.next(true);
  }

  public show() {
    this._hidden$.next(false);
  }

  public get query(): Record<string, any> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.value,
    };
  }

  public init(value: unknown): Observable<any> {
    return forkJoin([
      this.loadDefault(),
      this.loadValues(),
    ])
      .pipe(
        tap(() => {
          this.initValue(value);
        }),
      );
  }

  public loadDefault(): Observable<any> {
    return this.defaultValueFn()
      .pipe(
        tap((value) => {
          this.defaultValue = value;
        }),
      );
  }

  public loadValues() {
    return of(null)
      .pipe(
        switchMap(() => {
          if((this.type === ItemType.AutoComplete || this.type === ItemType.AutoCompleteChips)) {
            return of([]);
          } 

          if (typeof this._valuesFn === 'function') {
            const values = this._valuesFn();

            return values instanceof Observable ? values : of(values);
          }
 
          return of(this.values);
        }),
        tap((values) => this.values = values || []),
      );
  }

  public initValue(value: unknown) {
    this.value = value === undefined ? this.defaultValue : value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public clear(name: string = null) {
    this.value = this.defaultValue ?? undefined;
  }

  public destroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public clone(): BaseItem<T> {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)), 
      this,
    );
  }

  private _initConfig(item: T) {
    this.name = item.name;
    this.label = item.label;
    this.chipLabel = item.chipLabel;
    this._hidden$.next(item.hide ?? false);
    this.showClear = item.clear ?? true;
    this.persistanceDisabled = item.disablePersist ?? false;
    this.queryParamsDisabled = item.disableQueryParams ?? false;

    this.defaultValueFn = typeof item.default === 'function' ?
      item.default as IFilterDefaultFn : () => of(item.default);

    this.initCallback = item.init || (() => {
      //
    });

    this.changeCallback = item.change || (() => {
      //
    });

    if (isFunction(item.values)) {
      this._valuesFn = item.values;
    } else {
      this.values = item.values;
    }
  }
  
  public abstract get chips(): { name?: string, value: string, label: string }[];

}
