// How many of a filter's picks its chip names before counting the rest.
const PICKS_NAMED = 3;

/**
 * A chip's value for a filter holding several picks: the first three named and the rest
 * only counted, so five weekdays read 'Monday, Tuesday, Wednesday +2 more' rather than
 * one chip running the width of the bar.
 */
export function summarizePicks(names: string[]): { value: string, more: number } {
  return {
    value: names.slice(0, PICKS_NAMED).join(', '),
    more: Math.max(names.length - PICKS_NAMED, 0),
  };
}
