import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { KeyOfDeps, ManagerReducers } from "./types";

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

  return obj;
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

export function getNamesByKeys(keys: string[]) {
  return keys.map((key) => {
    const keyByArr = key.split(".");
    return {
      handlerName: `change${keyByArr.map(capitalize).join("")}`,
      key: keyByArr[keyByArr.length - 1] || '',
    }
  });
}

export function generateReducers<T extends Record<string, unknown>>(initialState: T) {
  const keys = getDeepKeys(initialState);
  const names = getNamesByKeys(keys);

  return names.reduce(
    (acc: ManagerReducers<T>, {handlerName, key}) => {
      acc[handlerName] = (state, action) => {
        recurAssign(state, key, action.payload);
      };
      return acc;
    },
    {}
  );
}

export function getMetaByAction<T extends Record<string, unknown>>(action: PayloadAction) {
  const actionByArr = action.type.split(`/`);
  const field = actionByArr[1].split("change")[1];
  const fieldName = decapitalize<KeyOfDeps<T>>(field);

  return {fieldName, managerName: actionByArr[0]}
}