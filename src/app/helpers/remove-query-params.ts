export function removeQueryParams(path: string) {
  return path.split('?')[0];
}
