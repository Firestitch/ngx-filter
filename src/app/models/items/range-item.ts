
import { Observable, tap } from 'rxjs';

import { isObject } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { distillRangeLabel } from '../../helpers/distill-range-label';
import { getRangeName } from '../../helpers/get-range-name';
import {
  IFilterConfigRangeItem,
} from '../../interfaces/items/range.interface';

import { BaseItem } from './base-item';


const MIN_WORDS = ['min', 'minimum'];
const MAX_WORDS = ['max', 'maximum'];


export class RangeItem extends BaseItem<IFilterConfigRangeItem> {

  public declare options: { scale?: number };
  public declare prefix: string;
  public declare suffix: string;
  public declare minLabel: string;
  public declare maxLabel: string;

  /**
   * What the range goes by wherever it is named once — the "More filters" list,
   * the unset chip, the value chip. A string label is that name already, and a
   * min/max pair earns one when both ends distill to the same stem: 'Min Price'
   * and 'Max Price' are the 'Price' filter. Null only when the two labels name
   * unrelated ends, and then there is nothing honest to show but both.
   */
  public rangeLabel: string;

  constructor(
    itemConfig: IFilterConfigRangeItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.options = itemConfig.options;
    this.prefix = itemConfig.prefix;
    this.suffix = itemConfig.suffix;

    if(itemConfig.label instanceof Array) {
      this.minLabel = itemConfig.label[0];
      this.maxLabel = itemConfig.label[1];
    } else if (typeof itemConfig.label === 'string') {
      this.minLabel = `Min ${itemConfig.label}`;
      this.maxLabel = `Max ${itemConfig.label}`;
    } else if (itemConfig.label && typeof itemConfig.label === 'object') {
      this.minLabel = itemConfig.label.min;
      this.maxLabel = itemConfig.label.max;
    } else {
      this.minLabel = 'Min';
      this.maxLabel = 'Max';
    }

    this.rangeLabel = typeof itemConfig.label === 'string' ?
      itemConfig.label : distillRangeLabel(this.minLabel, this.maxLabel, MIN_WORDS, MAX_WORDS);
  }

  public get mergedLabel() {
    return this.rangeLabel ?? `${this.minLabel} / ${this.maxLabel}`;
  }

  public static create(config: IFilterConfigRangeItem, filter: FilterComponent) {
    return new RangeItem(config, filter);
  }

  public get query(): Record<string, unknown> {
    const value = this.value;
    const name = this.name;
    const params = {};
    const paramMinName = getRangeName(name, 'min');
    const paramMaxName = getRangeName(name, 'max');

    if (isObject(value)) {
      params[paramMinName] = value.min || undefined;
      params[paramMaxName] = value.max || undefined;
    } else {
      params[paramMinName] = undefined;
      params[paramMaxName] = undefined;
    }

    return params;
  }

  /**
   * One chip for the whole range once it has a name to go by, so a filled range
   * reads as the one thing it is. A half-filled range still says which end it
   * has and keeps that end's name, so removing the chip clears only that end;
   * a full range has no one end to name, and removing it clears both.
   */
  public get chips(): { name?: string, value: string, label: string }[] {
    const min = this.value?.min;
    const max = this.value?.max;

    if(!this.rangeLabel) {
      const chips = [];

      if (min) {
        chips.push({ name: 'min', label: this.minLabel, value: min });
      }

      if (max) {
        chips.push({ name: 'max', label: this.maxLabel, value: max });
      }

      return chips;
    }

    if (min && max) {
      return [{ label: this.rangeLabel, value: `${min} – ${max}` }];
    }

    if (min) {
      return [{ name: 'min', label: this.minLabel, value: min }];
    }

    if (max) {
      return [{ name: 'max', label: this.maxLabel, value: max }];
    }

    return [];
  }

  public clear(emitChange: boolean = true, restoreDefault: boolean = false) {
    this.setValue(restoreDefault ? this.defaultValue ?? {} : {}, emitChange);
  }

  public clearByName(name: string, emitChange: boolean = true) {
    if (name === 'min') {
      this.setValue({ ...this.value, min: undefined }, emitChange);
    } else if (name === 'max') {
      this.setValue({ ...this.value, max: undefined }, emitChange);
    }
  }

  public get hasValue() {
    return this.value?.min !== undefined || super.value?.max !== undefined;
  }

  public setValue(value: { min?: string, max?: string }, emitChange: boolean = true) {
    super.setValue({
      min: value?.min,
      max: value?.max,
    }, emitChange);
  }

  public init(value: unknown): Observable<unknown> {
    return super.init(value)
      .pipe(
        tap(() => {
          if (!this.label) {
            this.label = ['Min', 'Max'];
          }

          if (!this.value) {
            this.value = this.defaultValue || {};
          }
        }),
      );
  }
}
