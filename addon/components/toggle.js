import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../templates/components/toggle';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Ember.Component.extend({
    layout,

    // Public API
    attributeName: defaultTo(''),
    label: defaultTo(''),
    values: defaultTo({
        on: true,
        off: undefined      // "false" means that you will only get results with value=false.
    }),

    registerFilter: defaultTo(() => {}),
    unregisterFilter: defaultTo(() => {}),

    toggleFilter: defaultTo(() => {}),

    // Private API
    classNames: ['ais-root','ais-toggle'],

    options: defaultTo([]),
    selectedOptions: Ember.computed('options,options.@each', {
        get() {
            const options = get(this, 'options');
            // Get all possible filtered values
            const selectedValues = options.filter(option => option.isRefined);
            if(!selectedValues) return [];

            return selectedValues;
        }
    }),
    _normalisedSelectedOptions: Ember.computed('selectedOptions', function () {
        const selectedOptions = get(this, 'selectedOptions');
        return selectedOptions.reduce((previous, current, index) => {
            if(index === 0) return current.name;
            return `${previous}||${current.name}`;
        }, '');
    }),
    hasOffValue: Ember.computed('values.off', {
        get() {
            return get(this, 'values.off') !== undefined;
        }
    }),
    isRefined: Ember.computed('options','selectedOptions', {
        get() {
            const onIsArray = Ember.isArray(get(this, 'values.on'));
            let on = get(this, 'values.on');

            if(onIsArray) {
                on = on.reduce((previous, current, index) => {
                    if(index === 0) return current;
                    return `${previous}||${current}`;
                }, '');
            }

            const normalisedSelectedOptions = get(this, '_normalisedSelectedOptions');
            return String(on) === String(normalisedSelectedOptions);
        },
        set(newValue) {
            return newValue;
        }
    }),
    updateOptions(results) {
        const attributeName = get(this, 'attributeName');
        const options = results.getFacetValues(attributeName);
        this.set('options', options);
    },

    willInsertElement() {
        const registerFilter = get(this, 'registerFilter');
        return registerFilter(this);
    },
    willDestroyElement() {
        const unregisterFilter = get(this, 'unregisterFilter');
        return unregisterFilter(this);
    },

    actions: {
        toggleFilter() {
            const on = get(this, 'values.on');
            const off = get(this, 'values.off');
            const attributeName = get(this, 'attributeName');
            const isRefined = get(this, 'isRefined');
            const toggleFilter = get(this, 'toggleFilter');

            if(!isRefined) {
                set(this, 'isRefined', true);
                toggleFilter(attributeName, on);
            } else {
                set(this, 'isRefined', false);
                toggleFilter(attributeName, off);
            }
        }
    }
});
