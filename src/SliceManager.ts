import {
   createSlice,
   PayloadAction,
   Slice,
   SliceCaseReducers,
 } from "@reduxjs/toolkit";
 import {
   ManagerActions,
   ManagerMiddleware,
   ManagerOptions,
   SliceManager,
 } from "./types";
 import {generateReducers, getCapitalizeFields, getMetaByAction} from "./utils";
 
 export function createSliceManager<T extends Record<string, unknown>>(
   {initialState, name, watchers = [], reducers, extraReducers}: ManagerOptions<T>
 ): SliceManager<T> {
   const baseReducers = generateReducers(initialState);
   const reducersResult = {...baseReducers, ...reducers};
 
   const slice: Slice<T, SliceCaseReducers<T>> = createSlice<T, SliceCaseReducers<T>>({
       name,
       initialState: initialState,
       reducers: reducersResult,
       extraReducers,
   });
   const actions: ManagerActions<T> = slice.actions;
 
   const middleware: ManagerMiddleware<T> =
     ({ dispatch, getState }) =>
     (next) =>
     (action: PayloadAction) => {
       next(action);
       const {fieldName, managerName} = getMetaByAction(action);
       if (managerName !== name) {
         return;
       }
       const params: T = getState()[name];
       for (const watcher of watchers) {
         const fields = getCapitalizeFields(watcher.fields);
         if (fields.includes(fieldName)) {
           return watcher.handler(params)(dispatch, getState, undefined);
         }
       }
     };
 
     return {
       actions,
       name,
       middleware,
       slice,
     }
 }
 