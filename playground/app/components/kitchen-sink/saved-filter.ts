export const SavedFilters: any =
  [
    {
      id: 1,
      name: 'Saved filter 1',
      filters: {
        simpleSelect: 2,
        observableSelect: 3,
        keyword: 'Test',
        autocompleteUserId: { value: 2, name: 'Jane Doe' },
        autocompletechipsUserId: [{ value: 1, name: 'John Doe' }, { value: 2, name: 'Jane Doe' }],
        dayChips: [{ value: 1, name: 'Monday' }],
        date: '2020-09-22T00:00:00+03:00',
      },
      active: true,
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
