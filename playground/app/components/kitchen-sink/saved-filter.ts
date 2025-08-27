import { IFilterSavedFilter } from '../../../../src/public_api';

export const SavedFilters: IFilterSavedFilter[] =
  [
    {
      id: 1,
      name: 'Saved filter 1',
      filters: {
        singleSelect: 2,
        keyword: 'Test',
        autocompletechips: [{ value: 1, name: 'John Doe' }, { value: 2, name: 'Jane Doe' }],
        dayChips: [{ value: 1, name: 'Monday' }],
        date: '2020-09-22T00:00:00+03:00',
      },
    },
    {
      id: 2,
      name: 'Saved filter 2',
      filters: {
        keyword: 'Hello World',
        simpleSelect: 1,
        groupSelect: 5,
        rangeMin: '0',
        rangeMax: '9999',
      },
    },
  ];
