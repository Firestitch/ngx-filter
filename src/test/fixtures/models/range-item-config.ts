import { IFilterConfigRangeItem } from '../../../app/interfaces/items/range.interface';
import { ItemType } from '../../../app/enums/item-type.enum'


export const RangeItemFullConfig: Readonly<IFilterConfigRangeItem> = {
  name: 'range',
  type: ItemType.Range,
  label: ['Min Price', 'Max Price'],
  chipLabel: ['Custom Min Price', 'Custom Max Price'],
  default: {
    min: 1,
    max: 50,
  },
  hide: true,
  clear: true,
  options: {
    scale: 2,
  },
  prefix: 'prefix',
  suffix: 'suffix',
};


export const RangeItemConfig: Readonly<IFilterConfigRangeItem> = {
  name: 'range',
  type: ItemType.Range,
  label: ['Min Price', 'Max Price'],
};
