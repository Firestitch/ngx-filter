import { ItemType } from '../enums/item-type.enum';

import { getRangeName } from './get-range-name';
import { filterFromQueryParam } from './query-param-transformers';

export function parseItemValueFromStored(item, params) {
  const param = params[item.name];

  switch (item.type) {
    case ItemType.Range: {
      const min = params[getRangeName(item.name, 'min')];
      const max = params[getRangeName(item.name, 'max')];

      return { min: min, max: max };
    }

    case ItemType.DateRange: case ItemType.DateTimeRange: {
      const from = params[getRangeName(item.name, 'from')];
      const to = params[getRangeName(item.name, 'to')];

      return { from: from, to: to };
    }

    case ItemType.Week: {
      const from = params[getRangeName(item.name, 'from')];
      const to = params[getRangeName(item.name, 'to')];
      const period = params[`${item.name}Period`];

      return { from, to, period };
    }

    case ItemType.Select: {
      if (item.multiple && !!param) {
        const values = param.split(',');

        if (item.isolate) {
          const isolatedValue = Array.isArray(item.isolate.value)
            ? item.isolate.value
            : [item.isolate.value];

          item.isolate.enabled = arraysHaveSameElements(isolatedValue, values);

          return item.isolate.enabled
            ? isolatedValue
            : values;
        }

        return values;
      }
 
      return param;
      
    }

    case ItemType.Checkbox: {
      return param === item.checked;
    }

    case ItemType.AutoComplete: {
      const filterParts = filterFromQueryParam(param);

      return {
        name: filterParts[1],
        value: filterParts[0],
      };
    }

    case ItemType.AutoCompleteChips: 
    case ItemType.Chips: {
      const filterParts = param.split(',');

      return filterParts.reduce((arry, value) => {

        const chipParts = filterFromQueryParam(value);

        arry.push({
          name: chipParts[1],
          value: chipParts[0],
        });

        return arry;
      }, []);
    }

    default: {
      return param;
    }
  }
}

function arraysHaveSameElements(arr1: unknown[], arr2: unknown[]): boolean {

  arr1 = [...arr1].sort();
  arr2 = [...arr2].sort();

  return arr1.some((item) => {
    return arr2.includes(item);
  });
}
