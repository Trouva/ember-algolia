import Ember from 'ember';

const { setProperties } = Ember;

export function serialize(mappings, params) {
    const items = {};

    // Iterate over mappings
    Object.keys(mappings).forEach(key => {
        const mapping = mappings[key];

        // if type is value, set to items object
        if(mapping.type === 'value') {
            items[mapping.key] = params[key];
        }

        // if array, reduce down to string, set to items object
        if(mapping.type === 'array') {
            if(params && params[key]) {
                items[mapping.key] = params[key].reduce((prev, curr, index) => index === 0? curr : `${prev}||${curr}`, '');
            } else {
                // if params is empty, set the item to object as empty string
                items[mapping.key] = '';
            }
        }

        // if any object, recurse, set to items object
        if(mapping.type === 'object') {
            const subparams = serialize(mapping.keys, params[key]);
            setProperties(items, subparams);
        }
    });

    return items;
}

export function deserialize(mappings, params) {
    const items = {};
    const isNumeric = num => +num === +num && num !== '';

    Object.keys(mappings).forEach(key => {
        const mapping = mappings[key];

        if(mapping.type === 'value') {
            items[key] = params[mapping.key];
        }

        if(mapping.type === 'array') {
            if(params[mapping.key]) {
                items[key] = params[mapping.key].split('||').map(v => isNumeric(v) && mapping.values === 'number'? Number(v) : v);
            }
        }

        if(mapping.type === 'object') {
            const recRes = deserialize(mapping.keys, params);
            if(Object.keys(recRes).length !== 0 || mapping.keepEmpty) {
                items[key] = recRes;
            }
        }
    });

    return items;
}


export function findSerializedKey(mappings, parameter) {
    let result = undefined;

    // Use .find() and return true, to stop when the iterator finds the result
    Object.keys(mappings).find(key => {
        if(mappings[key] && mappings[key].keys) {
            const foundKey = findSerializedKey(mappings[key].keys, parameter);
            if(foundKey) {
                result = foundKey;
                return true;
            }
            return false;
        } else {
            if(key === parameter) {
                result = mappings[key].key;
                return true;
            } else {
                return false;
            }
        }
    });

    return result;
}

export function mergeStates(mappings, originalState = {}, newState = {}) {
    const items = Object.assign({}, originalState);

    Object.keys(mappings).forEach(key => {
        const mapping = mappings[key];

        if((mapping.type === 'value' || mapping.type === 'array') && newState[key] !== '') {
            if(newState[key] !== undefined) {
                items[key] = newState[key];
            } else {
                delete items[key];
            }
        }

        if(mapping.type === 'object') {
            const merged = mergeStates(mapping.keys, originalState[key], newState[key]);
            // Remove empty objects
            if(Object.keys(merged).length !== 0) {
                items[key] = merged;
            } else {
                delete items[key];
            }
        }
    });

    return items;
}

export default {
    serialize,
    deserialize,
    findSerializedKey,
    mergeStates
};
