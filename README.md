## rtk-slice-manager

[![npm version](https://badge.fury.io/js/rtk-slice-manager.svg)](https://badge.fury.io/js/rtk-slice-manager)
![npm](https://img.shields.io/npm/dm/rtk-slice-manager)
![npm bundle size](https://img.shields.io/bundlephobia/min/rtk-slice-manager)

## Description
Wrap over slice from @reduxjs/toolkit for automatic generation of actions and isolation of effect logic after changing the state of the fields

## Installation

```sh
npm i rtk-slice-manager
# or
yarn add rtk-slice-manager
```

## Examples

### example create manager instance and definition watchers
```typescript

type State = {counter: number, short: boolean}

export const manager = createSliceManager<State>({
  name: 'manager', 
  initialState: {
      counter: 1,
      short: false
  },
  watchers: [
    {
      handler: (state) => (dispatch, getState) => {
          // After changing the property short - counter increases by 10
          dispatch(manager.actions.changeCounter(state.counter + 10));
      }, 
      fields: ['short']
    },
    {
      handler: (state) => (dispatch, getState) => {
        // any action
        // Be careful not to allow circular dependencies
        // Do not change "short" here, because a cycle will appear
      }, 
      fields: ['counter']
    },
  ],
})
```

### store connect
```typescript jsx
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
```

### usage with useManager

```typescript jsx
import React from 'react';
import {manager, State} from './base.stories';
import {useManager} from '../src/useManager';

export const App = () => {
    const [{counter, short}, {changeCounter, changeShort}] = useManager<State>(manager)

    return (
        <div>
        <h1>{counter}</h1>
        <h1>{`${short}`}</h1>
        <button onClick={() => changeCounter(counter + 1)}>
          change name
        </button>
        <input type="checkbox" onChange={(e) => changeShort(e.target.checked)} />
      </div>
    )
  }
```

### nested state handlers
```typescript jsx
export type State = {
    counter: number,
    short: boolean,
    modal: {
        create: {
            open: boolean
        }
    }
}

export const manager = createSliceManager<State>({
    name: 'manager', 
    initialState: {
        counter: 1,
        short: false,
        modal: {
            create: {
                open: false
            }
        }
    },
    watchers: [
    {
      handler: (state) => (dispatch, getState) => {
        // any action
        // Be careful not to allow circular dependencies
        // Do not change "short" here, because a cycle will appear
      }, 
      // example deps by nested state value
      // ts autocomplete is present
      fields: ['modal.create.open']
    },
})

export const ComponentFirst = () => {
    const [
      {
        counter,
        short,
        modal
      },
      {
        changeCounter,
        changeShort,
        changeModalCreateOpen,
        changeModal,
        changeModalCreate
      }] = useManager<State>(manager)
  
    return (
      <>
      <h1>manager counter {counter}</h1>
        <h1>short {`${short}`}</h1>
        <h1>modal {JSON.stringify(modal)}</h1>
        <button onClick={() => changeCounter(counter + 1)}>
          change counter manager
        </button>
        <button onClick={() => changeModal({
          create: {
            open: true,
          }
        })}>
          change modal
        </button>
        <button onClick={() => changeModalCreate({open: true})}>
          change modal.create
        </button>
        <button onClick={() => changeModalCreateOpen(true)}>
          change modal.create.open
        </button>
        <input type="checkbox" onChange={(e) => changeShort(e.target.checked)} />
        <hr />
        </>
    )
  }
```

### base usage

```typescript jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {manager} from './base.stories';

export const App = () => {
    const {counter, short} = useSelector((state) => state[manager.name])
    const dispatch = useDispatch();

    return (
        <div>
        <h1>{counter}</h1>
        <h1>{`${short}`}</h1>
        <button onClick={() => dispatch(manager.actions.changeCounter(counter + 1))}>
          change name
        </button>
        <input type="checkbox" onChange={(e) => dispatch(manager.actions.changeShort(e.target.checked))} />
      </div>
    )
  }
```

## License

[MIT](LICENSE)