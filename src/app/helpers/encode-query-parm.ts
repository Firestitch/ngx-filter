/**
 * Escapes commas and colons in a query-param value so they are not
 * misinterpreted as delimiters during deserialization.
 *
 * Accepts nullish input defensively — AutocompleteItem.value can
 * resolve to a bare primitive whose `.name` is undefined.
 */
export function encodeQueryParam(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/,/g, '\\,')
    .replace(/:/g, '\\:');
}
