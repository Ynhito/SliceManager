import {
   createSlice,
   PayloadAction,
   Slice,
   SliceCaseReducers,
 } from "@reduxjs/toolkit";
 import {
   ManagerActions,
   ManagerMiddleware,
   Watcher,
   ManagerOptions,
 } from "./types";
 import {generateReducers, getMetaByAction} from "./utils";
 
 export class SliceManager<T extends Record<string, unknown>> {
   public slice: Slice<T, SliceCaseReducers<T>>;
   public actions: ManagerActions<T>;
   public name: string = '';
   public watchers: Watcher<T>[] = [];
   constructor({initialState, name, watchers = [], reducers, extraReducers}: ManagerOptions<T>) {
     const baseReducers = generateReducers(initialState);
     const reducersResult = {...baseReducers, ...reducers};
 
     this.slice = createSlice<T, SliceCaseReducers<T>>({
       name,
       initialState: initialState,
       reducers: reducersResult,
       extraReducers,
     });
 
     this.watchers = watchers;
     this.name = name;
     this.actions = this.slice.actions;
   }
 
   public middleware: ManagerMiddleware<T> =
     ({ dispatch, getState }) =>
     (next) =>
     (action: PayloadAction) => {
       next(action);
       const {fieldName, managerName} = getMetaByAction(action);
       if (managerName !== this.name) {
         return;
       }
       const params: T = getState()[this.name];
       for (const watcher of this.watchers) {
         if (watcher.fields.includes(fieldName)) {
           return watcher.handler(params)(dispatch, getState, undefined);
         }
       }
     };
 }
 