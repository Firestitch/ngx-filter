import { Pipe, PipeTransform } from '@angular/core';

import { BaseItem } from '../models/items/base-item';


@Pipe({
  name: 'fsFilterIsolateValues',
  standalone: true,
})
export class FsFilterIsolateValues implements PipeTransform {
  public transform(values: BaseItem<any>[], isolate) {
    if (!isolate) {
      return values;
    }

    return values.filter((value) => {
      return value.value !== isolate.value;
    });

  }
}
