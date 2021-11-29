import { Draft } from "@reduxjs/toolkit";
import {Cast} from './types';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
export const decapitalize = (str: string) => str.charAt(0).toLowerCase() + str.substring(1).toLowerCase()

export function capitalizeKey<T>(key: keyof Draft<T>) {
    const stableKey = <Cast<typeof key, string>>key;
    const keyName = `change${capitalize(stableKey)}`;
    return keyName;
}