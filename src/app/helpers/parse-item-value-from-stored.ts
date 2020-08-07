import { ItemType } from '../enums/item-type.enum';
import { filterFromQueryParam } from './query-param-transformers';
import { tryConvertToNumber } from './try-convert-to-number';
import { getRangeName } from './get-range-name';

export function parseItemValueFromStored(item, params) {
  const param = params[item.name];

  switch (item.type) {
    case ItemType.Range: {
      const min = params[getRangeName(item.case, item.name, 'min')];
      const max = params[getRangeName(item.case, item.name, 'max')];

      item.model = { min: min, max: max };
    } break;

    case ItemType.DateRange: case ItemType.DateTimeRange: {
      const from = params[getRangeName(item.case, item.name, 'from')];
      const to = params[getRangeName(item.case, item.name, 'to')];

      item.model = { from: from, to: to };
    } break;

    case ItemType.Select: {
      if (item.multiple) {
        if (item.isolate && param === item.isolate.value) {
          item.model = [param];
          item.isolate.enabled = true;
        } else {
          item.model = param.split(',');
        }
      } else {
        item.model = param;
      }
    } break;

    case ItemType.Checkbox: {
      if (param === 'true') {
        item.model = true === item.checked;
      } else {
        item.model = param === item.checked;
      }
    } break;

    case ItemType.AutoComplete: {
      const filterParts = filterFromQueryParam(param);

      item.model = {
        name: filterParts[1],
        value: tryConvertToNumber(filterParts[0])
      }
    } break;

    case ItemType.AutoCompleteChips: case ItemType.Chips: {
      const filterParts = param.split(',');

      item.model = filterParts.reduce((arry, value) => {

        const chipParts = filterFromQueryParam(value);

        arry.push({
          name: chipParts[1],
          value: tryConvertToNumber(chipParts[0]),
        });

        return arry;
      }, [])
    } break;

    default: {
      item.model = param;
    }
  }
}
