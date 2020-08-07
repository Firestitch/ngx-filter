import { Pipe, PipeTransform } from '@angular/core';
import { BaseItem } from '../models/items/base-item';


@Pipe({
  name: 'fsFilterIsolateValues'
})
export class FsFilterIsolateValues implements PipeTransform {
  transform(values: BaseItem<any>[], isolate) {
    if (!isolate) {
      return values;
    } else {
      return values.filter((value) => {
        return value.value !== isolate.value
      });
    }
  }
}
