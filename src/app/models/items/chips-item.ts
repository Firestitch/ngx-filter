import { Observable, tap } from 'rxjs';

import { clone } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { IFilterConfigChipsItem } from '../../interfaces/items/chips.interface';

import { BaseItem } from './base-item';


export class ChipsItem extends BaseItem<IFilterConfigChipsItem> {

  public declare multiple: boolean;

  constructor(
    itemConfig: IFilterConfigChipsItem,
    protected _additionalConfig: unknown,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _additionalConfig, _filter);
    this.multiple = itemConfig.multiple ?? true;
  }
  
  public static create(config: IFilterConfigChipsItem, filter: FilterComponent) {
    return new ChipsItem(config, null, filter);
  }

  public get isTypeChips(): boolean {
    return true;
  }

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }
  
    return {
      [this.name]: this.value
        .map((item) => `${item.value}:${item.name}`)
        .join(','),
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.value) {
      return {};
    }

    return {
      [this.name]: this.value
        .map((item) => item.value)
        .join(','),
    };
  }

  public get persistanceObject(): Record<string, string> {
    const value = this.value;
    const name = this.name;
    const params = {};

    params[name] = Array.isArray(value) ? value.join(',') : undefined;

    return params;
  }
  
  public get chips(): { name?: string, value: string, label: string }[] {
    return this.hasValue ? [
      {
        value: this.value
          .reduce((acc, i) => {
            acc.push((`${i.name}`).trim());

            return acc;
          }, [])
          .join(', '),
        label: this.label,
      },
    ] : [];
  }

  public set value(value) {
    if (Array.isArray(value)) {
      value = value.map((val) => {
        if (isNaN(val)) {
          return val;
        }

        return +val;

      });
    }

    super.value = value;
  }

  public get value() {
    const value = clone(super.value);

    if (Array.isArray(value) && value.length === 0) {
      return undefined;
    }

    return value;
  }

  public init(value: unknown): Observable<unknown> {
    return super.init(value)
      .pipe(
        tap(() => {
          if (!Array.isArray(this.values)) {
            this.values = [];
          }

          if (super.value && Array.isArray(super.value) && this.values.length) {
            if (Number.isInteger(super.value[0])) {
              super.value = super.value.map((id) => {
                return this.values.find((item) => item.value === id);
              });
            }
          }

          if (super.value === undefined) {
            super.value = [];
          }
        }),
      );
  }

}
