export const SavedFilters: any =
  [
    {
      id: 1,
      name: 'Saved filter 1',
      active: true,
      filters: {
        simpleSelect: 2,
        observableSelect: 3,
        autocompleteUserId: '2:Jane%20Doe',
        autocompletechipsUserId: '1:John%20Doe',
        dayChips: '1:Monday',
        date: '2020-09-22T00:00:00+03:00',
      },
    },
    {
      id: 2,
      name: 'Saved filter 2',
      active: false,
      filters: {
        keyword: 'Hello World',
        simple_select: 1,
        group_select: 5,
        range_min: '0',
        range_max: '9999',
      },
    },
  ];
