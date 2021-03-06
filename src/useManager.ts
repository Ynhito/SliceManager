import {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CapitalizeHookHandlers, SliceManager} from './types';

export function useManager<
  T extends Record<string, unknown>,
  M extends SliceManager<T> = SliceManager<T>
>({actions, name}: M): [T, CapitalizeHookHandlers<T>] {
  const dispatch = useDispatch();
  const params: T = useSelector((state: any) => state[name]);
  const handlers = <CapitalizeHookHandlers<T>>useMemo(() => {
    return Object.keys(actions).reduce((acc, cur) => {
      const key = <keyof typeof actions>cur;
      const action = <Exclude<typeof actions[typeof key], void>>actions[key];
      return {
        ...acc,
        [cur]: (args: Parameters<typeof action>[number]) => {
          dispatch(action(args));
        },
      };
    }, {});
  }, [actions, dispatch]);

  return [params, handlers];
}
