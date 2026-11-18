import { isPlainObject } from 'lodash-es';


/**
 * True when a value holds nothing a filter would apply: nothing at all, an empty string, an
 * unticked checkbox (false), no picks ([]), or a range or period whose every bound is unset
 * ({ min: undefined }). A date is a value, though it has no fields of its own.
 */
export function isEmptyFilterValue(value: unknown): boolean {
  if(value === null || value === undefined || value === '' || value === false) {
    return true;
  }

  if(Array.isArray(value)) {
    return value.length === 0;
  }

  if(isPlainObject(value)) {
    return Object.values(value).every(isEmptyFilterValue);
  }

  return false;
}
