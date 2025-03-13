import { filter, isArrayEqual } from '@firestitch/common';

import { clone } from 'lodash-es';

import type { FilterComponent } from '../../../components/filter/filter.component';
import { arraysAreEquals } from '../../../helpers/compare';
import { IFilterConfigSelectItem } from '../../../interfaces/items/select.interface';

import { BaseSelectItem } from './base-select-item';


export class MultipleSelectItem extends BaseSelectItem {

  constructor(
    itemConfig: IFilterConfigSelectItem,
    _persistedValues: any,
    _filter: FilterComponent,
  ) {
    super(itemConfig, _persistedValues, _filter);
  }

  public get value() {
    let value = clone(this.model);

    if (this.isolateOptionNotSelected) {
      value = this.values?.map((v) => v.value);
    } else if (!Array.isArray(value) || value.length === 0 || value.indexOf('__all') > -1) {
      value = undefined;
    }

    return value;
  }

  public get isChipVisible(): boolean {
    return Array.isArray(this.model) && this.model.length > 0;
  }

  public get isolateOptionNotSelected() {
    const modelValue = this.model;
    const isolate = this.isolate;

    return isolate && !isolate.enabled && modelValue?.length === 0;
  }

  public getChipsContent(type = null): string {
    if (!this.model) {
      return '';
    }

    const options = this.model.reduce((acc, key) => {
      const itemValue = this.values.find((val) => val.value === key);
      let itemLabel: string;

      if (itemValue) {
        itemLabel = itemValue.name;
      } else if (this.isolate && this.isolate.enabled) {
        itemLabel = this.isolate.label;
      }

      if (!acc.includes(itemLabel)) {
        acc.push(itemLabel);
      }

      return acc;
    }, []);

    return options.join(', ');
  }

  protected _init() {
    super._init();

    const values = this.values.map((itemv) => itemv.value);
    const wrongDefaultValue = !this.model && !Array.isArray(this.defaultValue);

    /**
     * When multiple select is in isolate mode and have no options selected
     * it should send to the server all it's possible values,
     * but should not show them as selected in interfaces as well as in query params & persistance
     *
     * Code below prevents filling model with values from query params if query params contain all possible values
     */
    const isolate = !wrongDefaultValue
      && !this.isolateOptionNotSelected
      && arraysAreEquals(this.model, values);

    if (wrongDefaultValue || isolate) {
      this.model = [];
    }
  }
  
  protected _setModel(value) {
    if (Array.isArray(value)) {
      value = value.map((val) => {
        if (isNaN(val)) {
          return val;
        }

        return +val;
      });

      value = value.length === 0 ? undefined : value;
    }
    

    super._setModel(value);
  }

  protected _validateModel() {
    const possibleValues = filter(this.model || [], (item) => {
      return this.values.find((value) => {
        return value.value === item;
      });
    });

    if (!isArrayEqual(this.model, possibleValues)) {
      this.model = possibleValues;
    }
  }

  protected _clearValue(defaultValue: unknown = undefined) {
    super._clearValue(defaultValue);

    this.model = defaultValue ?? [];
  }
}
