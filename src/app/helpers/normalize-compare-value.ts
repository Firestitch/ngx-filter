/**
 * A value ready for a deep compare with numbers stringified, so a value that round-trips
 * through the URL ({value: '7'}) still equals the number it started as ({value: 7}).
 */
export function normalizeCompareValue(value: unknown): unknown {
  if(typeof value === 'number') {
    return String(value);
  }

  if(Array.isArray(value)) {
    return value.map(normalizeCompareValue);
  }

  if(value && typeof value === 'object') {
    return Object.entries(value)
      .reduce((acc, [key, val]) => ({ ...acc, [key]: normalizeCompareValue(val) }), {});
  }

  return value;
}
