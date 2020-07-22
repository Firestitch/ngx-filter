import { Pipe, PipeTransform } from '@angular/core';
import { FsFilterConfigItem } from '../models/filter-item';


@Pipe({
  name: 'fsFilterIsolateValues'
})
export class FsFilterIsolateValues implements PipeTransform {
  transform(values: FsFilterConfigItem[], isolate) {
    if (!isolate) {
      return values;
    } else {
      return values.filter((value) => {
        return value.value !== isolate.value
      });
    }
  }
}
