import { isDate, isValid, parseISO } from 'date-fns';

export function parseDate(value: string) {
  if (value && (!isDate(value) || !isValid(value))) {
    return parseISO(value);
  }

  return value;
}
