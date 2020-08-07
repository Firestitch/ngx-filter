import { IFilterConfigBaseItem, ItemType } from '@firestitch/filter';


export interface IFilterConfigCheckboxItem extends IFilterConfigBaseItem<ItemType.Checkbox> {
  checked?: unknown;
  unchecked?: unknown;
}
