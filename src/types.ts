import { CaseReducer, CaseReducerWithPrepare, PayloadAction, ThunkAction, Action, CaseReducerActions, SliceCaseReducers, CreateSliceOptions, ValidateSliceCaseReducers } from "@reduxjs/toolkit"
import { ThunkMiddleware } from 'redux-thunk';
import { AnyAction } from 'redux';
// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object

export type Cast<T, U> = T extends U ? T : any

export type GetObjValues<T> = T extends Record<any, infer V> ? V : never

export type SwitchKeyValue<
  T,
  T1 extends Record<string, any> = {
    [K in keyof T]: { key: K; value: T[K] }
  },
  T2 = {
    [K in GetObjValues<T1>['value']]: Extract<GetObjValues<T1>, { value: K }>['key']
  }
> = T2

export type TransformKeysToCamelCase<
  T extends Record<string, any>,
  T0 = { [K in keyof T]: `change${Capitalize<Cast<K, string>>}` },
  T1 = SwitchKeyValue<T0>,
  T2 = {
    [K in keyof T1]:T[Cast<T1[K], string>]
  }
> = T2

export type Handlers<T extends Record<string, unknown>> = {
    [K in keyof T]: CaseReducer<T, PayloadAction<T[K]>> | CaseReducerWithPrepare<T, PayloadAction<any, string, any, any>>;
}

export type HookHandlers<T extends Record<string, unknown>> = {
  [K in keyof T]: (value: T[K]) => void;
}

export type Reducers<T extends Record<string, unknown>> = {
  [K in keyof T]?: CaseReducer<T, PayloadAction<any>> | CaseReducerWithPrepare<T, PayloadAction<any, string, any, any>>;
};

export type CapitalizeHandlers<S extends Record<string, unknown>> = TransformKeysToCamelCase<Handlers<GetTypesByDeppKeys<S>>>;
export type CapitalizeHookHandlers<S extends Record<string, unknown>> = TransformKeysToCamelCase<HookHandlers<GetTypesByDeppKeys<S>>>;

export type WatcherHandlerAction<T> = ThunkAction<any, T & any, undefined, Action<string>>
export type ManagerMiddleware<T> = ThunkMiddleware<T & any, AnyAction, undefined>
export type ManagerActions<T extends Record<string, unknown>> = CaseReducerActions<CapitalizeHandlers<T>>
| CaseReducerActions<SliceCaseReducers<T>>
export type ManagerActionCreatorReducers<S extends Record<string, unknown>> = TransformKeysToCamelCase<Reducers<S>>
export type ManagerReducers<T> = ValidateSliceCaseReducers<T, SliceCaseReducers<T>>;
export type ManagerExtraReducers<T> = CreateSliceOptions<T, SliceCaseReducers<T>, string>['extraReducers']

// ------------------------

export type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

export type DotNestedKeys<T> = T extends (Number | Date | Function | Array<any> | Boolean | String) ? "" : (T extends Object ?
    { [K in Exclude<keyof T, symbol>]: `${K}` | `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : "") extends infer D ? Extract<D, string> : never;

type GetTypesByDeppKeys<
  T,
  D extends string = '.',
  T0 = {
    [key in DotNestedKeys<T>]: JoinByDot<Split<key, D>>
  },
  T1 = SwitchKeyValue<T0>,
  T2 = { [K in keyof T1]: GetTypeByKeys<Split<Cast<T1[K], string>, D>, T>}
> = T2

export type Deps<T> = Array<keyof GetTypesByDeppKeys<T>>
export type KeyOfDeps<T> = Cast<keyof Deps<T>, string>

export type Split<S extends string, D extends string> =
    string extends S ? string[] :
    S extends '' ? [] :
    S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type GetTypeByKeys<T extends (string | number)[], Obj> =
  T extends { length: 1 } ? Obj[Cast<T[0], string>]
  : T extends { length: 2 } ? Obj[Cast<T[0], string>][Cast<T[1], string>]
  : T extends { length: 3 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>]
  : T extends { length: 4 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>]
  : T extends { length: 5 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>]
  : T extends { length: 6 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>][Cast<T[5], string>]
  : T extends { length: 7 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>][Cast<T[5], string>][Cast<T[6], string>]
  : T extends { length: 8 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>][Cast<T[5], string>][Cast<T[6], string>][Cast<T[7], string>]
  : T extends { length: 9 } ? Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>][Cast<T[5], string>][Cast<T[6], string>][Cast<T[7], string>][Cast<T[8], string>]
  : Obj[Cast<T[0], string>][Cast<T[1], string>][Cast<T[2], string>][Cast<T[3], string>][Cast<T[4], string>][Cast<T[5], string>][Cast<T[6], string>][Cast<T[7], string>][Cast<T[8], string>][Cast<T[9], string>];

type CapitalizeStr<T> = Capitalize<Cast<T, string>>

type JoinByDot<T extends (string | number)[]> =
T extends { length: 1 } ? `${T[0]}`
: T extends { length: 2 } ? `${T[0]}${CapitalizeStr<T[1]>}`
: T extends { length: 3 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}`
: T extends { length: 4 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}`
: T extends { length: 5 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}`
: T extends { length: 6 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}${CapitalizeStr<T[5]>}`
: T extends { length: 7 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}${CapitalizeStr<T[5]>}${CapitalizeStr<T[6]>}`
: T extends { length: 8 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}${CapitalizeStr<T[5]>}${CapitalizeStr<T[6]>}${CapitalizeStr<T[7]>}`
: T extends { length: 9 } ? `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}${CapitalizeStr<T[5]>}${CapitalizeStr<T[6]>}${CapitalizeStr<T[7]>}${CapitalizeStr<T[8]>}`
: `${T[0]}${CapitalizeStr<T[1]>}${CapitalizeStr<T[2]>}${CapitalizeStr<T[3]>}${CapitalizeStr<T[4]>}${CapitalizeStr<T[5]>}${CapitalizeStr<T[6]>}${CapitalizeStr<T[7]>}${CapitalizeStr<T[8]>}${CapitalizeStr<T[9]>}`;