import { Draft } from "@reduxjs/toolkit";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.substring(1);
export const decapitalize = <T extends string>(str: T): T =>
  (str.charAt(0).toLowerCase() + str.substring(1)) as T;

export function recurAssign(obj: Draft<any>, outKey: string, value: any) {
  Object.keys(obj).forEach((key: keyof typeof obj) => {
    if (typeof obj[key] === "object") {
      recurAssign(obj[key], outKey, value);
    }
    if (outKey === key) {
      obj[key] = value;
    }
  });
}

export function getDeepKeys<T>(obj: T): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    keys.push(key);
    if (typeof obj[key] === "object") {
      const subkeys = getDeepKeys(obj[key]);
      keys = keys.concat(
        subkeys.map(function (subkey) {
          return `${key}.${subkey}`;
        })
      );
    }
  }
  return keys;
}

export function getHandlerName(keys: string[]) {
  return keys.map((e) => {
    const deepKeys = e.split(".");
    return {
      handlerName: `change${e.split(".").map(capitalize).join("")}`,
      key: deepKeys[deepKeys.length - 1] || '',
    }
  });
}
