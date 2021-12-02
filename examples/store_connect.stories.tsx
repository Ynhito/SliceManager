import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit'
import {manager} from './base.stories';

export const rootReducer = combineReducers({
    manager: manager.slice.reducer,
    //...other reducers
    // secondManager: secondManager.slice.reducer,
  });
  
  // if several managers
  const managersMiddlewares = [
    manager.middleware,
    // secondManager.middleware,
  ]
  
  const store =  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        thunk: true,
      }).concat(managersMiddlewares); // concat
    },
  })