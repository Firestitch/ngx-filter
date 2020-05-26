import { QUERY_PARAM_DELIMITER } from '../consts/query-param-delimiter';

export function filterToQueryParam(value, name): string {
  return `${value}${QUERY_PARAM_DELIMITER}${encodeURIComponent(name)}`;
}

export function filterFromQueryParam(param: string): string[] {
  const parts = param.split(QUERY_PARAM_DELIMITER);

  return [parts[0], decodeURIComponent(parts[1])];
}

