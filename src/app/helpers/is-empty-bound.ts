/**
 * A range bound is unset only when nothing was entered: null, undefined or ''.
 * 0 is a real bound, so a truthiness test would drop it.
 */
export function isEmptyBound(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}
