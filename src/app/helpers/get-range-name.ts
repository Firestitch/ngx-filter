export function getRangeName(configCase: 'snake' | 'camel', name: string, range: string) {
  if (configCase === 'snake') {
    return name.concat('_').concat(range);
  }

  if (configCase === 'camel') {
    return name.concat(range.charAt(0).toUpperCase()).concat(range.slice(1));
  }
}
