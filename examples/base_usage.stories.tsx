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