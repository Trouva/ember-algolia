import computed from 'ember-computed';

export default function defaultTo(value) {
    return computed({
        get() { return value; },
        set(_, newVal) { return newVal === undefined ? value : newVal; }
    });
}
