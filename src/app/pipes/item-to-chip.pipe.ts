import { Pipe, PipeTransform } from '@angular/core';

import { BaseItem } from '../models/items/base-item';
import { IFilterConfigItem } from '../interfaces/config.interface';


@Pipe({
  name: 'fsItemToChip',
  pure: false,
})
export class FsItemToChip implements PipeTransform {
  transform(model: any, item: BaseItem<IFilterConfigItem>, type: string = null) {
    const result = item.getChipsContent(type);

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
