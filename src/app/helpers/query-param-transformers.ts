export function filterToQueryParam(value, name): string {
  return `${encodeURIComponent(value)}:${encodeURIComponent(name)}`;
}

export function filterFromQueryParam(param: string): string[] {
  const parts = param.split(/(?<!\\):/);

  return [decodeURIComponent(parts[0]), decodeURIComponent(parts[1])];
}

