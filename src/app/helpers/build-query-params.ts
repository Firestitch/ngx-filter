import { list as arrayList } from '@firestitch/common';

import { isObject } from 'lodash-es';

import { filterToQueryParam } from './query-param-transformers';
import { MultipleSelectItem } from '../models/items/select/multiple-select-item';
import { BaseItem } from '../models/items/base-item';
import { IFilterConfigItem } from '../interfaces/config.interface';
import { arraysAreEquals } from './compare';


export function buildQueryParams(flattenedParams: Record<string, unknown>, items: BaseItem<IFilterConfigItem>[]) {
  items.forEach(filterItem => {
    if (filterItem instanceof MultipleSelectItem && filterItem.isolate) {
      if (filterItem.multiple && filterItem.value) {
        const isolated = arrayList(filterItem.values, 'value').sort();
        const value = filterItem.value.sort();

        if (arraysAreEquals(value, isolated)) {
          flattenedParams[filterItem.name] = null;
        }
      }
    }

    if (filterItem.isTypeAutocomplete) {
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
