import { ItemType } from '../enums/item-type.enum';
import { filterFromQueryParam } from './query-param-transformers';
import { tryConvertToNumber } from './try-convert-to-number';
import { getRangeName } from './get-range-name';

export function parseItemValueFromStored(item, params, paramCase: 'snake' | 'camel') {
  const param = params[item.name];

  switch (item.type) {
    case ItemType.Range: {
      const min = params[getRangeName(paramCase, item.name, 'min')];
      const max = params[getRangeName(paramCase, item.name, 'max')];

      return { min: min, max: max };
    }

    case ItemType.DateRange: case ItemType.DateTimeRange: {
      const from = params[getRangeName(item.case, item.name, 'from')];
      const to = params[getRangeName(item.case, item.name, 'to')];

      return { from: from, to: to };
    }

    case ItemType.Select: {
      if (item.multiple && !!param) {
        const values = param.split(',');

        if (item.isolate) {
          const isolatedValue = Array.isArray(item.isolate.value)
            ? item.isolate.value
            : [ item.isolate.value ];

          item.isolate.enabled = arraysHaveSameElements(isolatedValue, values);

          return item.isolate.enabled
            ? isolatedValue
            : values;
        }

        return values;
      } else {
        return param;
      }
    }

    case ItemType.Checkbox: {
      if (param === 'true') {
        return true === item.checked;
      } else {
        return param === item.checked;
      }
    }

    case ItemType.AutoComplete: {
      const filterParts = filterFromQueryParam(param);

      return {
        name: filterParts[1],
        value: tryConvertToNumber(filterParts[0])
      }
    }

    case ItemType.AutoCompleteChips: case ItemType.Chips: {
      const filterParts = param.split(',');

      return filterParts.reduce((arry, value) => {

        const chipParts = filterFromQueryParam(value);

        arry.push({
          name: chipParts[1],
          value: tryConvertToNumber(chipParts[0]),
        });

        return arry;
      }, [])
    }

    default: {
      return param;
    }
  }
}

function arraysHaveSameElements(arr1: unknown[], arr2: unknown[]): boolean {

  arr1 = [ ...arr1 ].sort();
  arr2 = [ ...arr2 ].sort();

  return arr1.some((item) => {
    return arr2.includes(item);
  });
}
