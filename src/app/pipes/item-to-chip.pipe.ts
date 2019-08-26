import { Pipe, PipeTransform } from '@angular/core';
import { format } from '@firestitch/date';
import { FsFilterConfigItem } from '../models/filter-item';
import { findValue } from '../helpers/find-value';
import { ItemType } from '../enums/item-type.enum';
import { ItemDateMode } from '../enums/item-date-mode.enum';


@Pipe({
  name: 'fsItemToChip'
})
export class FsItemToChip implements PipeTransform {
  transform(model: any, item: FsFilterConfigItem, type: string = null) {
    let result = '';

    switch (item.type) {
      case ItemType.Date: {

        let dateFormat = 'date';

        if (item.mode == ItemDateMode.ScrollMonthYear) {
          dateFormat = 'full-date-dayless';
        }

       result = format(model, dateFormat);
      } break;
      case ItemType.Checkbox: {
        result = item.label as string;
      } break;
      case ItemType.Range: {
        if (type === 'from') {
          const min = model.min;
          result = `${min}`;
        } else if (type === 'to') {
          const max = model.max;
          result = `${max}`;
        }
      } break;
      case ItemType.AutoComplete: {
        result = item.model ? item.model.name : '';
      } break;
      case ItemType.Text:
      case ItemType.Keyword: {
        result = item.model;
      } break;
      case ItemType.AutoCompleteChips:
      case ItemType.Chips: {
        result = item.model.reduce((acc, item) => {
          acc.push(item.name);

          return acc;
        }, []).join(', ');
      } break;
      case ItemType.DateRange:
      case ItemType.DateTimeRange: {
        const formatTo = item.type === ItemType.DateRange ? 'date' : 'date-time';

        if (type === 'from') {
          const from = model.from;
          result = `${format(from, formatTo)}`;
        } else if (type === 'to') {
          const to = model.to;
          result = `${format(to, formatTo)}`;
        }
      } break;

      default: {
        if (Array.isArray(model)) {
          const options = model.reduce((acc, key) => {
            const itemValue = item.values.find((val) => val.value === key);

            if (itemValue) {
              acc.push(itemValue.name);
            } else if (item.isolate && item.isolate.enabled) {
              acc.push(item.isolate.label);
            }

            return acc;
          }, []);

          result = options.join(', ');
        } else {

          if (item.children) {
            const itemValue = findValue(item.values, model, item.children);

            result = itemValue && itemValue.name
          } else {
            const itemValue = item.values.find((val) => val.value === model);

            result = itemValue && itemValue.name
          }
        }
      }
    }

    if (item.chipLabel !== undefined) {
      if (item.chipLabel === '') {
        return `${result}`;
      } else {
        if (Array.isArray(item.chipLabel)) {
          const label = getLabelFromArray(item.chipLabel, type);
          return `${label}: ${result}`;
        } else {
          return `${item.chipLabel}: ${result}`;
        }
      }
    } else {
      if (Array.isArray(item.label)) {
        const label = getLabelFromArray(item.label, type);
        return `${label}: ${result}`;
      } else {
        return `${item.label}: ${result}`;
      }
    }
  }
}


function getLabelFromArray(labelArr, type) {
  if (type === 'from' && labelArr[0]) {
    return `${labelArr[0]}`;
  } else if (type === 'to' && labelArr[1]) {
    return `${labelArr[1]}`;
  } else {
    return '';
  }
}
