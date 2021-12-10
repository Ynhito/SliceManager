import { capitalize, decapitalize, generateReducers, getDeepKeys, getNamesByKeys, getMetaByAction, recurAssign } from '../src/utils';
import {actionByMetaMap, handlerNames, keys, mutateObj1, mutateObj2, mutateObj3, namesByKeys, object} from './constants';

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

   it('recurAssign', () => {
    const result1 = recurAssign(JSON.parse(JSON.stringify(object)), 'name', 'newTest')
    const result2 = recurAssign(JSON.parse(JSON.stringify(object)), 'camelCase', 13)
    const result3 = recurAssign(JSON.parse(JSON.stringify(object)), 'open', true)
    expect(result1).toEqual(mutateObj1);
    expect(result2).toEqual(mutateObj2);
    expect(result3).toEqual(mutateObj3);
   });

});