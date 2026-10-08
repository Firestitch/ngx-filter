import { ItemType } from '../enums/item-type.enum';

import { restoreItems } from './restore-items';

describe('restoreItems', () => {
  const items = [
    { name: 'environmentId', type: ItemType.AutoCompleteChips },
    { name: 'keyword', type: ItemType.Keyword },
  ];

  it('should skip a param it cannot read and restore the others', () => {
    spyOn(console, 'warn');

    // A chips param is always a string from the address bar; a number cannot be split
    expect(restoreItems({ environmentId: 30, keyword: 'oak' }, items))
      .toEqual({ keyword: 'oak' });
    expect(console.warn).toHaveBeenCalled();
  });
});
