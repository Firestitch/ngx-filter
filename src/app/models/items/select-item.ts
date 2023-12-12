
import type { FilterComponent } from '../../components/filter/filter.component';
import { ItemType } from '../../enums/item-type.enum';

import { MultipleSelectItem } from './select/multiple-select-item';
import { SimpleSelectItem } from './select/simple-select-item';


export class SelectItem {

  public readonly type: ItemType.Select;

  public static create(config, filter: FilterComponent): SimpleSelectItem | MultipleSelectItem {
    if (config.multiple) {
      return new MultipleSelectItem(config, null, filter);
    }

    return new SimpleSelectItem(config, null, filter);

  }
}
