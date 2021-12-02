import {SliceManager} from '../src/SliceManager';

export type State = {counter: number, short: boolean}

export const manager = new SliceManager<State>(
    'manager', 
    {
        counter: 1,
        short: false
    },
    [
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
)