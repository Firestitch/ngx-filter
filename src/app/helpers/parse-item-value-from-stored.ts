import { ItemType } from '../enums/item-type.enum';
import { SelectItem } from '../models/items';

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
      return itemTypeSelect(item, param);      
    }

    case ItemType.Checkbox: {
      return param === 'true' || param === true;
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

function itemTypeSelect(item: SelectItem, param) {
  if (!param) {
    return [];
  }

  const values = param.split(',');

  if (item.isolate) {
    const isolatedValue =  item.isolateValues;

    item.isolate = arraysHaveSameElements(isolatedValue, values);

    return item.isolate
      ? isolatedValue
      : values;
  }

  return values;
}


function arraysHaveSameElements(arr1: unknown[], arr2: unknown[]): boolean {

  arr1 = [...arr1].sort();
  arr2 = [...arr2].sort();

  return arr1.some((item) => {
    return arr2.includes(item);
  });
}
