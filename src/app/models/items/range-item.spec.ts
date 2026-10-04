import { RangeItemConfig } from '../../../test/fixtures/models/range-item-config';
import { IFilterItemRangeObjectLabel } from '../../interfaces/items/range.interface';

import { RangeItem } from './range-item';


// The range inputs are type="number", so a typed bound arrives as a number (or null once
// it is cleared), whatever setValue's declared string type says.
function rangeItem(
  value: { min?: number | string | null, max?: number | string | null },
  label: IFilterItemRangeObjectLabel = 'Amount',
): RangeItem {
  const item = new RangeItem({ ...RangeItemConfig, label }, null);
  item.setValue(value as { min?: string, max?: string }, false);

  return item;
}

describe('RangeItem', () => {

  it('should keep a 0 min in the value and the query', () => {
    const item = rangeItem({ min: 0 });

    expect(item.value.min).toBe(0);
    expect(item.query).toEqual({ rangeMin: 0, rangeMax: undefined });
  });

  it('should keep a 0 max in the value and the query', () => {
    const item = rangeItem({ max: 0 });

    expect(item.value.max).toBe(0);
    expect(item.query).toEqual({ rangeMin: undefined, rangeMax: 0 });
  });

  it('should keep both ends at 0', () => {
    expect(rangeItem({ min: 0, max: 0 }).query).toEqual({ rangeMin: 0, rangeMax: 0 });
  });

  it('should treat null, undefined and an empty string as unset', () => {
    expect(rangeItem({ min: null, max: '' }).query).toEqual({ rangeMin: undefined, rangeMax: undefined });
    expect(rangeItem({}).chips).toEqual([]);
  });

  it('should print a 0 min on its chip', () => {
    expect(rangeItem({ min: 0 }).chips).toEqual([{ name: 'min', label: 'Min Amount', value: '0' }]);
  });

  it('should print a 0 max on its chip', () => {
    expect(rangeItem({ max: 0 }).chips).toEqual([{ name: 'max', label: 'Max Amount', value: '0' }]);
  });

  it('should print a range from 0 on one chip', () => {
    expect(rangeItem({ min: 0, max: 50 }).chips).toEqual([{ label: 'Amount', value: '0 – 50' }]);
  });

  it('should print a 0 bound on its own chip when the two labels name no one thing', () => {
    expect(rangeItem({ min: 0, max: 0 }, ['Low', 'High']).chips).toEqual([
      { name: 'min', label: 'Low', value: '0' },
      { name: 'max', label: 'High', value: '0' },
    ]);
  });

});
