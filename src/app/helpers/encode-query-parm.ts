export function encodeQueryParam(value) {
  return value
    .replace(/,/g, '\\,')
    .replace(/:/g, '\\:');
}
