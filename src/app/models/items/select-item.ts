import { ItemType } from '../../enums/item-type.enum';

import { MultipleSelectItem } from './select/multiple-select-item';
import { SimpleSelectItem } from './select/simple-select-item';


export class SelectItem {

  public static create(config): SimpleSelectItem | MultipleSelectItem {
    if (config.multiple) {
      return new MultipleSelectItem(config, null);
    } else {
      return new SimpleSelectItem(config, null)
    }
  }

  public readonly type: ItemType.Select;
}
