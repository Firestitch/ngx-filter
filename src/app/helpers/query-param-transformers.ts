import { decodeQueryParam, encodeQueryParam } from './encode-query-parm';

/**
 * Writes an item's `value:name` pair for the address bar, or the value alone when it has no
 * name. Only the delimiters are escaped: the address is percent-encoded once when it is
 * written and the router decodes it once when it is read, so filterFromQueryParam receives
 * exactly this string.
 */
export function filterToQueryParam(value, name): string {
  return name === null || name === undefined
    ? `${value}`
    : `${value}:${encodeQueryParam(name)}`;
}

/**
 * Reverses filterToQueryParam. A param that carries only the value (an address typed or edited
 * by hand) has a null name, so whatever shows it can fall back to the value. The param must
 * not be URI-decoded again: the router already has, and a second pass corrupts a name holding
 * a literal % or throws URIError on one like `100%{`, which stops the whole filter from
 * initializing.
 */
export function filterFromQueryParam(param: string): [string, string | null] {
  const [value, name] = param.split(/(?<!\\):/);

  return [value, name === undefined ? null : decodeQueryParam(name)];
}
