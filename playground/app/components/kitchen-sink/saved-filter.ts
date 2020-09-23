export const savedFilters: any =
  [
    {
      id: 1,
      name: 'Saved filter 1',
      active: false,
      filters: {
        simple_select: 2,
        group_select: 3,
        range_min: "50",
        range_max: "300",
        observable_select: 3,
        autocomplete_user_id: "2:Jane%20Doe",
        autocompletechips_user_id: "1:John%20Doe,3:Bob%20Tom",
        days_chips: "1:Monday",
        date: "2020-09-22T00:00:00+03:00",
        'scroll-date': "2020-10-01T00:00:00+03:00"
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
        range_min: "0",
        range_max: "9999"
      },
    },
  ];
