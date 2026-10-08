import { DefaultUrlSerializer } from '@angular/router';

import { filterFromQueryParam, filterToQueryParam } from './query-param-transformers';

/**
 * Writes the param the way QueryParamController._replaceState does, then reads it back the
 * way the router does when the address is reloaded or pasted into a new tab.
 */
function throughAddressBar(param: string): string {
  const url = new URL('https://example.com/donors');
  url.searchParams.set('environmentId', param);

  return new DefaultUrlSerializer()
    .parse(url.pathname + url.search.replace(/%3A/gi, ':'))
    .queryParams.environmentId;
}

function roundTrip(value, name): [string, string | null] {
  return filterFromQueryParam(throughAddressBar(filterToQueryParam(value, name)));
}

describe('filterToQueryParam / filterFromQueryParam', () => {
  it('should round-trip a name holding a percent sign', () => {
    const name = 'Golden Oak Family Clinic !@$%{²╣(Producing-Donor)';

    expect(roundTrip(30, name)).toEqual(['30', name]);
  });

  it('should round-trip a name holding a valid percent escape without decoding it', () => {
    expect(roundTrip(5, '50%20off')).toEqual(['5', '50%20off']);
  });

  it('should round-trip a name holding the delimiters', () => {
    expect(roundTrip(7, 'Smith, John: Jr.')).toEqual(['7', 'Smith, John: Jr.']);
  });

  it('should round-trip a name holding characters the query string reserves', () => {
    expect(roundTrip(9, 'R&D #4 = + ?')).toEqual(['9', 'R&D #4 = + ?']);
  });

  it('should round-trip a name holding an apostrophe or a trailing percent sign', () => {
    expect(roundTrip(16, 'Riverbend Women\'s Health')).toEqual(['16', 'Riverbend Women\'s Health']);
    expect(roundTrip(4, '100%')).toEqual(['4', '100%']);
  });

  it('should write a value with no name as the value alone', () => {
    expect(filterToQueryParam(30, null)).toBe('30');
    expect(filterToQueryParam(30, undefined)).toBe('30');
  });

  it('should read a param with no name as a null name', () => {
    expect(filterFromQueryParam('30')).toEqual(['30', null]);
    expect(roundTrip(30, null)).toEqual(['30', null]);
  });
});
