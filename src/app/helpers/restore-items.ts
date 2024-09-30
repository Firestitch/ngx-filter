import { DateRangeItem } from '../models/items/date-range-item';
import { DateTimeRangeItem } from '../models/items/date-time-range-item';
import { RangeItem } from '../models/items/range-item';
import { WeekItem } from '../models/items/week-item';

import { getRangeName } from './get-range-name';
import { parseItemValueFromStored } from './parse-item-value-from-stored';


/**
 * We need this function because when we store persisted/query/remote filter values
 * it stores with different format, ex.: Range will be stored as RangeFrom && RangeTo
 * and in this case we don't know how to restroe those values.
 *
 * This function do convertation for those kinds of stored values
 *
 * @param params
 * @param items
 * @param paramsCase
 */
export function restoreItems(params, items, paramsCase) {
  const result = {};

  Object.keys(params)
    .forEach((name) => {
      const item = findItemWidthName(items, name);

      if (item) {
        result[item.name] = parseItemValueFromStored(item, params, paramsCase);
      }
    });

  return result;
}

function findItemWidthName(items, name) {
  return items
    .find((filterItem) => {
      if (filterItem instanceof RangeItem) {
        return  name === getRangeName(filterItem.case, filterItem.name, 'min') ||
          name === getRangeName(filterItem.case, filterItem.name, 'max') ||
          name === filterItem.name;
      } else if (filterItem instanceof DateRangeItem || filterItem instanceof DateTimeRangeItem) {
        return name === getRangeName(filterItem.case, filterItem.name, 'from') ||
          name ===  getRangeName(filterItem.case, filterItem.name, 'to');
      } else if (filterItem instanceof WeekItem) {
        return name === getRangeName('camel', filterItem.name, 'from')
          || name ===  getRangeName('camel', filterItem.name, 'to')
          || name ===  `${filterItem.name}Period`;
      }

      return filterItem.name === name;
    });
}
