
import { map, Observable, tap } from 'rxjs';


import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigSelectItem } from '../../interfaces/items/select.interface';

import { BaseItem } from './base-item';


export class SelectItem extends BaseItem<IFilterConfigSelectItem> {

  public declare children: string;
  public declare multiple: boolean;
  public declare isolate: boolean;
  public declare isolated: boolean;
  public declare isolateLabel: string;
  public declare isolateValues: number[] | string[] | boolean[];

  constructor(
    itemConfig: IFilterConfigSelectItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.multiple = itemConfig.multiple || false;
    this.children = itemConfig.children || null;

    if (itemConfig.isolate) {
      this.isolate = true;
      this.isolateLabel = itemConfig.isolate.label;
      this.isolateValues = Array.isArray(itemConfig.isolate.value) ? 
        itemConfig.isolate.value as any : [itemConfig.isolate.value];
    }
  }

  public static create(itemConfig: IFilterConfigSelectItem, filter: FilterComponent) {
    return new SelectItem(itemConfig, {}, filter);
  }

  public clear(emitChange: boolean = true) {
    this.setValue(this.multiple ? [] : undefined, emitChange);
  }
  
  public init(value: unknown): Observable<unknown> {
    return super.init(value)
      .pipe(
        tap(() => {
          if(this.isolate) {
            const v = Array.isArray(value) ? value : [value];
            this.isolated = v.some((_v) => {
              return this.isolateValues.includes(_v as never);
            });
          }
        }),
      );
  }

  public get values$(): Observable<any> {
    return super.values$
      .pipe(
        map((values) => { 
          if(!this.isolate) {
            return values;
          }

          return values
            .filter((value) => {
              return !this.isolateValues.includes(value.value as never);
            });
        }),
      );
  }

  public setValue(value, emitChange = true) {
    if(this.multiple) {
      value = Array.isArray(value) ? value : [];
    } else {
      value = Array.isArray(value) ? value[0] : value;
    }

    super.setValue(value, emitChange);
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.multiple ? this.value.join(',') : this.value,
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]:  Array.isArray(this.value) ? this.value.join(',') : this.value,
    };
  }

  public get hasValue() {
    if(this.multiple) {
      return Array.isArray(super.value) && super.value.length > 0;
    }

    return super.hasValue;
  }

  public get flattenedValues(): { name: string, value: any }[] {
    if(this.children) {
      return this.values.reduce((acc, item) => {
        return acc.concat(item[this.children] || []);
      }, []);
    }

    return this.values;
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if (!this.hasValue) {
      return [];
    }

    const options = this.flattenedValues
      .filter((item) => {
        return this.multiple ? this.value
          .includes(item.value) : `${this.value}` === `${item.value}`;
      })
      .map((item) => {
        return item.name;
      });


    return [
      {
        value: options.join(', '),
        label: this.label,
      },
    ];
  }
}
