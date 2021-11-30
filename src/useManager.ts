import { useMemo } from 'react';
import { SliceManager } from './SliceManager';
import {useDispatch, useSelector} from 'react-redux';
import { CapitalizeHookHandlers } from './types';

export function useManager<
    T extends Record<string, unknown>,
    M extends SliceManager<T> = SliceManager<T>,
    >({actions, name}: M): [
    T,
    CapitalizeHookHandlers<T>
] {
    const dispatch = useDispatch();
    const params: T = useSelector((state: any) => state[name]);
    const handlers = useMemo(() => {
        return <CapitalizeHookHandlers<T>>Object.keys(actions).reduce((acc, cur) => {
            const key = <keyof typeof actions>cur;
            const action = <Exclude<typeof actions[typeof key], void>>actions[key];
            return {
                ...acc,
                [cur]: (args: Parameters<typeof action>[number]) => {
                    dispatch(action(args))
                }
            }
        }, {})
    }, [])
    
    return [
        params,
        handlers,
    ]
}
