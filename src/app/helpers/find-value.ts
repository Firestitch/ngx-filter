export function findValue(values, value, children) {
  for (let i = 0; i < values.length; i++) {
    const val = values[i];

    if (val[children]) {
      return findValue(val[children], value, children);
    }

    if (val.value === value) {
      return val;
    }
  }

  return undefined;
}
