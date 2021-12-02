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