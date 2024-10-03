export function getRangeName(name: string, range: string) {
  return name.concat(range.charAt(0).toUpperCase()).concat(range.slice(1));
}
