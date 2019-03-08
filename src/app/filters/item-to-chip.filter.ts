import { Pipe, PipeTransform } from '@angular/core';
import { format } from '@firestitch/date';
import { FsFilterConfigItem, ItemType } from '../models/filter-item';


@Pipe({
  name: 'fsItemToChip'
})
export class FsItemToChip implements PipeTransform {
  transform(model: any, item: FsFilterConfigItem) {
    let result = '';

    switch (item.type) {
      case ItemType.date: {
       result = format(model, 'date');
      } break;
      case ItemType.checkbox: {
        result = item.label;
      } break;
      case ItemType.range: {
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
      case ItemType.autocomplete: {
        result = item.model.name;
      } break;
      case ItemType.autocompletechips: case ItemType.chips: {
        result = item.model.reduce((acc, item) => {
          acc.push(item.name);

          return acc;
        }, []).join(', ');
      } break;
      case ItemType.daterange:
      case ItemType.datetimerange: {
        const formatTo = model.type === ItemType.daterange ? 'date' : 'date-time';
        const min = model.min;
        const minFilled = model.min !== void 0;
        const max = model.max;
        const maxFilled = model.max !== void 0;

        if (minFilled && maxFilled) {
          result = `${format(min, formatTo)} - ${format(max, formatTo)}`;
        } else if (minFilled && !maxFilled) {
          result = `from ${format(min, formatTo)}`;
        } else if (!minFilled && maxFilled) {
          result = `to ${format(max, formatTo)}`;
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
          const itemValue = item.values.find((val) => val.value === model);

          result = itemValue && itemValue.name
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
