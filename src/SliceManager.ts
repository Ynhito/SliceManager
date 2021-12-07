import {
   createSlice,
   PayloadAction,
   Slice,
   SliceCaseReducers,
 } from "@reduxjs/toolkit";
 import {
   ManagerActions,
   ManagerExtraReducers,
   ManagerMiddleware,
   ManagerReducers,
   WatcherHandlerAction,
   Deps,
   KeyOfDeps,
 } from "./types";
 import { getDeepKeys, getStateKey, getHandlerName, recurAssign, decapitalize } from "./utils";
 
 export class SliceManager<T extends Record<string, unknown>> {
   public slice: Slice<T, SliceCaseReducers<T>>;
   public actions: ManagerActions<T>;
   constructor(
     readonly name: string,
     initialState: T,
     readonly watchers: Array<{
       handler: (params: T) => WatcherHandlerAction<T>;
       fields: Deps<T>
     }> = [],
     extraReducers?: ManagerExtraReducers<T>
   ) {
     const keys = getDeepKeys(initialState);
     const handlerNames = getHandlerName(keys);
     const reducers = handlerNames.reduce(
       (acc: ManagerReducers<T>, handlerKey: string) => {
         const key = getStateKey(handlerKey);
         acc[handlerKey] = (state, action) => {
           recurAssign(state, key, action.payload);
         };
         return acc;
       },
       {}
     );
 
     this.slice = createSlice<T, SliceCaseReducers<T>>({
       name,
       initialState: initialState,
       reducers,
       extraReducers,
     });
     this.actions = this.slice.actions;
   }
 
   public middleware: ManagerMiddleware<T> =
     ({ dispatch, getState }) =>
     (next) =>
     (action: PayloadAction) => {
       next(action);
       const managerName = action.type.split(`/`);
       if (managerName[0] !== this.name) {
         return;
       }
       const field = managerName[1].split("change")[1];
       const actionName = decapitalize<KeyOfDeps<T>>(field);
       const params: T = getState()[this.name];
       for (const watcher of this.watchers) {
         if (watcher.fields.includes(actionName)) {
           return watcher.handler(params)(dispatch, getState, undefined);
         }
       }
     };
 }
 