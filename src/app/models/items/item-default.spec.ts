import { ItemType } from '../../enums/item-type.enum';
import { isEmptyFilterValue } from '../../helpers/is-empty-filter-value';

import { CheckboxItem } from './checkbox-item';
import { SelectItem } from './select-item';


// The filters flyout counts as active only the filters moved off the page's defaults, the
// same ones its Reset puts back.
function inUseOnly(): CheckboxItem {
  return new CheckboxItem({
    name: 'isInUse',
    type: ItemType.Checkbox,
    label: 'In use only',
    default: true,
  }, null);
}

function kind(defaultValue?: string[]): SelectItem {
  const item = new SelectItem({
    name: 'kind',
    type: ItemType.Select,
    label: 'Kind',
    multiple: true,
    values: [],
    default: defaultValue,
  }, null);
  item.loadDefault().subscribe();

  return item;
}

describe('A filter changed from its default (the filters flyout\'s active count)', () => {

  it('should not count a default sitting on the page', () => {
    const item = inUseOnly();
    item.initValue(undefined);

    expect(item.hasNonDefaultValue).toBe(false);
  });

  it('should count a default the person switched off', () => {
    const item = inUseOnly();
    item.initValue(undefined);
    item.clear();

    expect(item.hasNonDefaultValue).toBe(true);
  });

  it('should stop counting a filter picked back to its default', () => {
    const item = inUseOnly();
    item.initValue(undefined);
    item.clear();
    item.setValue(true);

    expect(item.hasNonDefaultValue).toBe(false);
  });

  it('should stop counting once Reset puts the default back', () => {
    const item = inUseOnly();
    item.initValue(undefined);
    item.clear();
    item.clear(true, true);

    expect(item.hasNonDefaultValue).toBe(false);
  });

  it('should count a pick on a filter without a default, and not an empty one', () => {
    const item = kind();
    item.initValue(undefined);

    expect(item.hasNonDefaultValue).toBe(false);

    item.setValue(['provider']);

    expect(item.hasNonDefaultValue).toBe(true);

    item.clear();

    expect(item.hasNonDefaultValue).toBe(false);
  });

  it('should count a pick other than the default', () => {
    const item = kind(['provider']);
    item.initValue(undefined);

    expect(item.hasNonDefaultValue).toBe(false);

    item.setValue(['agency']);

    expect(item.hasNonDefaultValue).toBe(true);
  });

});

describe('isEmptyFilterValue', () => {

  it('should hold nothing for unset, unticked, unpicked and unbounded values', () => {
    expect(isEmptyFilterValue(undefined)).toBe(true);
    expect(isEmptyFilterValue(null)).toBe(true);
    expect(isEmptyFilterValue('')).toBe(true);
    expect(isEmptyFilterValue(false)).toBe(true);
    expect(isEmptyFilterValue([])).toBe(true);
    expect(isEmptyFilterValue({ min: undefined, max: null })).toBe(true);
  });

  it('should hold a value for a pick, a bound, a tick or a date', () => {
    expect(isEmptyFilterValue(true)).toBe(false);
    expect(isEmptyFilterValue(0)).toBe(false);
    expect(isEmptyFilterValue(['provider'])).toBe(false);
    expect(isEmptyFilterValue({ min: 0 })).toBe(false);
    expect(isEmptyFilterValue(new Date())).toBe(false);
  });

});
