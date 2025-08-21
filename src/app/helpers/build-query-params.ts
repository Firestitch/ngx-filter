import { list as arrayList } from '@firestitch/common';

import { isObject } from 'lodash-es';

import { KeyValue } from '../interfaces';
import { IFilterConfigItem } from '../interfaces/config.interface';
import { CheckboxItem, MultipleSelectItem } from '../models/items';
import { BaseItem } from '../models/items/base-item';

import { arraysAreEquals } from './compare';
import { filterToQueryParam } from './query-param-transformers';


export function buildQueryParams(flattenedParams: KeyValue, items: BaseItem<IFilterConfigItem>[]) {
  items
    .forEach((filterItem) => {
      if (filterItem instanceof MultipleSelectItem && filterItem.isolate) {
        if (filterItem.multiple && filterItem.value) {
          const isolated = arrayList(filterItem.values, 'value').sort();
          const value = filterItem.value.sort();

          if (arraysAreEquals(value, isolated)) {
            flattenedParams[filterItem.name] = null;
          }
        }
      } else if  (filterItem instanceof CheckboxItem) {
        if(filterItem.checked) {
          flattenedParams[filterItem.name] = filterItem.model;
        }
      } else if (filterItem.isTypeAutocomplete) {
        if (isObject(filterItem.model)) {
          flattenedParams[filterItem.name] = filterToQueryParam(filterItem.model.value, filterItem.model.name);
        }
      } else if (filterItem.isTypeAutocompleteChips || filterItem.isTypeChips) {
        if (Array.isArray(filterItem.model) && filterItem.model.length) {
          flattenedParams[filterItem.name] = filterItem.model.map((item) => {
            return filterToQueryParam(item.value, item.name);
          }).join(',');
        }
      }
    });

  return flattenedParams;
}
