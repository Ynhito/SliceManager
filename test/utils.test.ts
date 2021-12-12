import { capitalize, decapitalize, generateReducers, getDeepKeys, getNamesByKeys, getMetaByAction } from '../src/utils';
import {actionByMetaMap, handlerNames, keys, namesByKeys, object} from './constants';

describe('SliceManager utils', () => {

   it('capitalize', () => {
    const result = capitalize('world')
    expect(result).toBe('World');
   });

   it('decapitalize', () => {
    const result = decapitalize('World')
    expect(result).toBe('world');
   });

   it('getDeepKeys', () => {
    const result = getDeepKeys(object)
    expect(result).toEqual(keys);
   });

   it('getNamesByKeys', () => {
    const result = getNamesByKeys(keys)
    expect(result).toEqual(namesByKeys);
   });

   it('getMetaByAction', () => {
    for (const actionType of Object.keys(actionByMetaMap)) {
        const result = getMetaByAction({type: actionType, payload: void 0})
        expect(result).toEqual(actionByMetaMap[actionType]);
    }
   });

   it('generateReducers', () => {
    const reducers = generateReducers(object)
    const reducerNames = Object.keys(reducers);
    expect(reducerNames).toEqual(handlerNames);
   });
});