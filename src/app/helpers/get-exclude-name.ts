/**
 * The query key an excluding item writes its values under: `exclude` and then the item's
 * own name with its first letter upper-cased, so `region` becomes `excludeRegion`.
 */
export function getExcludeName(name: string): string {
  return `exclude${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
