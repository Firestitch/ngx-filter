import { Pipe, PipeTransform } from '@angular/core';
import { format } from '@firestitch/date';
import { FsFilterConfigItem, ItemType } from '../models/filter-item';
import { findValue } from '../helpers/find-value';


@Pipe({
  name: 'fsItemToChip'
})
export class FsItemToChip implements PipeTransform {
  transform(model: any, item: FsFilterConfigItem) {
    let result = '';

    switch (item.type) {
      case ItemType.Date: {
       result = format(model, 'date');
      } break;
      // case ItemType.DateRange: {
      //   const from = format(model.from, 'date');
      //   const fromFilled = !!model.min;
      //   const to = format(model.to, 'date');
      //   const toFilled = !!model.to;
      //
      //   if (fromFilled && toFilled) {
      //     result = `${from} to ${to}`;
      //   } else if (fromFilled && !toFilled) {
      //     result = `Min ${from}`;
      //   } else if (!fromFilled && toFilled) {
      //     result = `Max ${to}`;
      //   }
      // } break;
      case ItemType.Checkbox: {
        result = item.label as string;
      } break;
      case ItemType.Range: {
        const min = model.min;
        const minFilled = !!model.min;
        const max = model.max;
        const maxFilled = !!model.max;

        if (minFilled && maxFilled) {
          result = `${min} to ${max}`;
        } else if (minFilled && !maxFilled) {
          result = `Min ${min}`;
        } else if (!minFilled && maxFilled) {
          result = `Max ${max}`;
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
        const from = model.from;
        const fromFilled = !!model.from;
        const to = model.to;
        const toFilled = !!model.to;

        if (fromFilled && toFilled) {
          result = `${format(from, formatTo)} - ${format(to, formatTo)}`;
        } else if (fromFilled && !toFilled) {
          result = `from ${format(from, formatTo)}`;
        } else if (!fromFilled && toFilled) {
          result = `to ${format(to, formatTo)}`;
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
        return `${item.chipLabel}: ${result}`;
      }
    } else {
      return `${item.label}: ${result}`;
    }
  }
}
