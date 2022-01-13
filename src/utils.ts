import { PayloadAction } from "@reduxjs/toolkit";
import { Deps, KeyOfDeps, ManagerReducers } from "./types";
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

function getKeysByArr<T extends string[], Result>(keys: T, callback: (keyByArr: string[]) => Result) {
  return keys.map(e => callback(e.split('.')));
}
function capitalizeAllKeys(keys: string[], includeFirst = true) {
  return keys
    .map((key, i) => {
      const firstKeyCheck = includeFirst ? capitalize(key) : key;
      return i > 0 ? capitalize(key) : firstKeyCheck;
    })
    .join('')
}

export const getCapitalizeFields = (fields: Deps<unknown>) => 
  getKeysByArr(fields, (keyByArr) => capitalizeAllKeys(keyByArr, false))

export function getHandlerNames(keys: string[]) {
  return getKeysByArr(keys, (keyByArr) => ({
    handlerName: `change${capitalizeAllKeys(keyByArr)}`,
    key: keyByArr,
  }))
}

export function generateReducers<T extends Record<string, unknown>>(initialState: T) {
  const keys = getDeepKeys(initialState);
  const handlerNames = getHandlerNames(keys);

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