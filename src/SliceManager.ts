import {
  CaseReducerActions,
  createSlice,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers,
  ThunkAction,
  ValidateSliceCaseReducers,
  Action,
  CreateSliceOptions,
} from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkMiddleware } from 'redux-thunk';
import { CapitalizeHandlers } from './types';
import { capitalizeKey, decapitalize } from './utils';

export class SliceManager<T extends Record<string, unknown>> {
  public slice: Slice<T, SliceCaseReducers<T>>;
  public actions:
    | CaseReducerActions<CapitalizeHandlers<T>>
    | CaseReducerActions<SliceCaseReducers<T>>;
  constructor(
    readonly name: string,
    initialState: T,
    readonly watchers: Array<{
      handler: (params: T) => ThunkAction<any, T & any, undefined, Action<string>>;
      fields: Array<keyof T>;
    }> = [],
    extraReducers?: CreateSliceOptions<T, SliceCaseReducers<T>, string>['extraReducers'],
  ) {
    const reducers = Object.keys(initialState).reduce(
      (acc: ValidateSliceCaseReducers<T, SliceCaseReducers<T>>, cur: keyof Draft<T>) => {
        const handlerKey = capitalizeKey(cur);
        acc[handlerKey] = (state, action) => {
          state[cur] = action.payload;
        };
        return acc;
      },
      {},
    );

    this.slice = createSlice<T, SliceCaseReducers<T>>({
      name,
      initialState: initialState,
      reducers,
      extraReducers,
    });
    this.actions = this.slice.actions;
  }
  public middleware: ThunkMiddleware<T & any, AnyAction, undefined> = ({ dispatch, getState }) => (
    next,
  ) => (action: PayloadAction) => {
    next(action);
    const field = action.type.split(`${this.name}/`)[1].split('change')[1];
    const actionName = decapitalize(field);
    const params: T = getState()[this.name];
    for (const watcher of this.watchers) {
      if (watcher.fields.includes(actionName)) {
        return watcher.handler(params)(dispatch, getState, undefined);
      }
    }
  };
}
