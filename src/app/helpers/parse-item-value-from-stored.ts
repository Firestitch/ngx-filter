import { ItemType } from '../enums/item-type.enum';

export function parseItemValueFromStored(item, params) {
  const param = params[item.name];

  switch (item.type) {
    case ItemType.Range: {
      const min = params[item.getRangeName('min')];
      const max = params[item.getRangeName('max')];

      item.model = { min: min, max: max };
    } break;

    case ItemType.DateRange: case ItemType.DateTimeRange: {
      const from = params[item.getRangeName('from')];
      const to = params[item.getRangeName('to')];

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
      const filterParts = param.split(':');

      item.model = {
        name: filterParts[1],
        value: +filterParts[0]
      }
    } break;

    case ItemType.AutoCompleteChips: case ItemType.Chips: {
      const filterParts = param.split(',');

      item.model = filterParts.reduce((arry, value) => {

        const chipParts = value.split(':');

        arry.push({
          name: chipParts[1],
          value: +chipParts[0],
        });

        return arry;
      }, [])
    } break;

    default: {
      item.model = param;
    }
  }
}
