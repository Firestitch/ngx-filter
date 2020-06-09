export function tryConvertToNumber(val: any) {
  return isNaN(val)
    ? val
    : +val;
}
