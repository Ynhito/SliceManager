import { PayloadAction } from "@reduxjs/toolkit";
import { KeyOfDeps, ManagerReducers } from "./types";
import set from 'lodash/set'

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.substring(1);
export const decapitalize = <T extends string>(str: T): T =>
  (str.charAt(0).toLowerCase() + str.substring(1)) as T;

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
      key: keyByArr,
    }
  });
}

export function generateReducers<T extends Record<string, unknown>>(initialState: T) {
  const keys = getDeepKeys(initialState);
  const handlerNames = getNamesByKeys(keys);

  return handlerNames.reduce(
    (acc: ManagerReducers<T>, {handlerName, key}) => {
      acc[handlerName] = (state, action) => {
        set(state, key, action.payload)
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