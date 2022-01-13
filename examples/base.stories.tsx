import {createSliceManager} from '../src';

export type State = {counter: number, short: boolean}

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