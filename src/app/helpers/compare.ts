import { isObject } from 'lodash-es';


export function objectsAreEquals(obj1, obj2) {
  const oldKeys = Object.keys(obj1);
  const currKeys = Object.keys(obj2);

  if (oldKeys.length !== currKeys.length) {
    return false;
  }

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      const oldItem = obj1[key];
      const currItem = obj2[key];
      const isArrays = Array.isArray(oldItem) && Array.isArray(currItem);
      const isObjects = isObject(oldItem) && isObject(currItem);

      if (isArrays && !arraysAreEquals(oldItem, currItem)) {
        return false;
      } else if (isObjects && !objectsAreEquals(oldItem, currItem)) {
        return false;
      } else if (!isArrays && !isObjects && oldItem !== currItem) {
        return false;
      }
    }
  }

  return true;
}

export function arraysAreEquals(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (const el of arr1) {
    if (arr2.indexOf(el) === -1) {
      return false;
    }
  }

  return true;
}
