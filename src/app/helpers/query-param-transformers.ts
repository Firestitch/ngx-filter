import { decodeQueryParam, encodeQueryParam } from './encode-query-parm';

/**
 * Writes an item's `value:name` pair for the address bar. Only the delimiters are escaped:
 * the address is percent-encoded once when it is written and the router decodes it once
 * when it is read, so filterFromQueryParam receives exactly this string.
 */
export function filterToQueryParam(value, name): string {
  return `${value}:${encodeQueryParam(name)}`;
}

/**
 * Reverses filterToQueryParam. The param must not be URI-decoded again: the router already
 * has, and a second pass corrupts a name holding a literal % or throws URIError on one like
 * `100%{`, which stops the whole filter from initializing.
 */
export function filterFromQueryParam(param: string): string[] {
  const [value, name] = param.split(/(?<!\\):/);

  return [value, decodeQueryParam(name ?? '')];
}
