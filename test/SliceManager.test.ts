import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createSliceManager } from "../src/SliceManager";
import { SliceManager } from "../src/types";

const initialState = {
    counter: 1,
    short: false
}
type State = {counter: number, short: boolean}
const actionNames = ['changeCounter', 'changeShort']

const initialize = (customManager?: SliceManager<State>) => {
    const manager = customManager || createSliceManager<State>({
        name: 'manager', 
        initialState,
        watchers: [
            {
                handler: (state) => (dispatch) => {
                    dispatch(manager.actions.changeCounter(state.counter + 10));
                }, 
                fields: ['short']
            },
        ]
    })
    const rootReducer = combineReducers({
        manager: manager.slice.reducer,
    });
      
    const store =  configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
          return getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
            thunk: true,
          }).concat(manager.middleware);
        },
      })

      return {manager, store}
}

describe('SliceManager', () => {
    let manager = initialize().manager;
    let store = initialize().store;

    beforeEach(() => {
        manager = initialize().manager;
        store = initialize().store;
    })

   it('get initialState', () => {
    const state = store.getState().manager;
    expect(state).toBe(initialState);
   });

   it('get actions', () => {
    const isHasNames = Object.keys(manager.actions).every(e => actionNames.includes(e))
    expect(isHasNames).toBe(true);
   });

   it('change state value', () => {
    store.dispatch(manager.actions.changeCounter(5))
    const {counter} = store.getState().manager;
    expect(counter).toBe(5);

    store.dispatch(manager.actions.changeShort(true))
    const {short} = store.getState().manager;
    expect(short).toBe(true);
   });

   it('watcher', () => {
    const prevValue = store.getState().manager.counter;
    store.dispatch(manager.actions.changeShort(true));
    const newValue = store.getState().manager.counter;
    expect(newValue).toBe(prevValue + 10);
   });
});