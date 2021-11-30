import { CaseReducer, CaseReducerWithPrepare, PayloadAction } from "@reduxjs/toolkit"

export type Cast<T, U> = T extends U ? T : any

export type GetObjValues<T> = T extends Record<any, infer V> ? V : never

export type SwitchKeyValue<
  T,
  // step 1
  T1 extends Record<string, any> = {
    [K in keyof T]: { key: K; value: T[K] }
  },
  // step 2
  T2 = {
    [K in GetObjValues<T1>['value']]: Extract<GetObjValues<T1>, { value: K }>['key']
  }
> = T2

export type TransformKeysToCamelCase<
  T extends Record<string, any>,
  // step 1
  T0 = { [K in keyof T]: `change${Capitalize<Cast<K, string>>}` },
  // step 2
  T1 = SwitchKeyValue<T0>,
  // step 3
  T2 = {
    [K in keyof T1]:T[Cast<T1[K], string>]
  }
> = T2

export type Handlers<T extends Record<string, unknown>> = {
    [K in keyof T]: CaseReducer<T, PayloadAction<any>> | CaseReducerWithPrepare<T, PayloadAction<any, string, any, any>>;
}

export type HookHandlers<T extends Record<string, unknown>> = {
  [K in keyof T]: (value: T[K]) => void;
}

export type CapitalizeHandlers<S extends Record<string, unknown>> = TransformKeysToCamelCase<Handlers<S>>;
export type CapitalizeHookHandlers<S extends Record<string, unknown>> = TransformKeysToCamelCase<HookHandlers<S>>;