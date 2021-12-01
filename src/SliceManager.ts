import {
  createSlice,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { ManagerActions, ManagerExtraReducers, ManagerMiddleware, ManagerReducers, WatcherHandlerAction } from './types';
import { capitalizeKey, decapitalize } from './utils';

export class SliceManager<T extends Record<string, unknown>> {
  public slice: Slice<T, SliceCaseReducers<T>>;
  public actions: ManagerActions<T>;
  constructor(
    readonly name: string,
    initialState: T,
    readonly watchers: Array<{
      handler: (params: T) => WatcherHandlerAction<T>;
      fields: Array<keyof T>;
    }> = [],
    extraReducers?: ManagerExtraReducers<T>,
  ) {
    const reducers = Object.keys(initialState).reduce(
      (acc: ManagerReducers<T>, cur: keyof Draft<T>) => {
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
  public middleware: ManagerMiddleware<T> = ({ dispatch, getState }) => (
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
