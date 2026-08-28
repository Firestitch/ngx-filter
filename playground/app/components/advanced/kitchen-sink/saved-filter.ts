import { IFilterSavedFilter } from '@firestitch/filter';

/**
 * A saved filter's `filters` map is keyed by item name and holds each item's raw value —
 * the same shape `FilterController.values` produces — not the query params it emits.
 */
export const SavedFilters: IFilterSavedFilter[] =
  [
    {
      id: 1,
      name: 'Saved filter 1',
      filters: {
        keyword: 'Test',
        status: ['active'],
        userIds: [{ value: 1, name: 'John Doe' }, { value: 2, name: 'Sam Smith' }],
        dayChips: [{ value: '11', name: 'Monday' }],
        date: '2020-09-22T00:00:00+03:00',
      },
    },
    {
      id: 2,
      name: 'Saved filter 2',
      filters: {
        keyword: 'Hello World',
        user: ['1'],
        subject: '5',
        price: { min: '0', max: '9999' },
      },
    },
  ];
