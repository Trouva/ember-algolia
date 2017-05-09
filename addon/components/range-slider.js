import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../templates/components/range-slider';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

const { setProperties } = Ember;

export default Ember.Component.extend({
    layout,

    // Public API
    attributeName: defaultTo(''),
    precision: defaultTo(2),

    // Actions
    registerFilter: defaultTo(() => {}),
    unregisterFilter: defaultTo(() => {}),

    change: defaultTo(() => {}),

    // Slider Public API
    start: defaultTo([0,50]),
    margin: defaultTo(0),
    animate: defaultTo(true),
    snap: defaultTo(false),
    connect: defaultTo(false),
    disabled: defaultTo(false),
    orientation: defaultTo('horizontal'),
    direction: defaultTo('ltr'),
    behaviour: defaultTo('tap'),
    tooltips: defaultTo(false),

    limit: undefined,
    pips: undefined,

    step: defaultTo(1),
    min: defaultTo(0),
    max: defaultTo(100),

    formatTo: defaultTo(value => value),
    formatFrom: defaultTo(value => value),

    // Private API
    classNames: ['filter-root','filter-range-slider'],

    updateOptions(results, helper) {
        const userSelections = this._getCurrentRefinement.call(this, helper);
        const limits = this._getCurrentLimit.call(this, results);

        set(this, 'start', [userSelections.min, userSelections.max]);

        // min and max limit cannot be equal because noUI slider throws an error.
        if(limits.min !== limits.max) {
            setProperties(this, { min: limits.min, max: limits.max });
        }
    },

    _getCurrentRefinement(helper) {
        const attributeName = get(this, 'attributeName');
        let min = helper.state.getNumericRefinement(attributeName, '>=');
        let max = helper.state.getNumericRefinement(attributeName, '<=');

        if (min && min.length) {
            min = min[0];
        } else {
            min = -Infinity;
        }

        if (max && max.length) {
            max = max[0];
        } else {
            max = Infinity;
        }

        return {
            min,
            max
        };
    },
    _getCurrentLimit(results) {
        const attributeName = get(this, 'attributeName');
        const facet = results.getFacetByName(attributeName);

        if(!facet || !facet.stats) {
            return { min: null, max: null };
        }
        return {
            min: get(facet, 'stats.min'),
            max: get(facet, 'stats.max')
        };
    },
    willInsertElement() {
        const registerFilter = get(this, 'registerFilter');
        return registerFilter(this);
    },
    willDestroyElement() {
        const unregisterFilter = get(this, 'unregisterFilter');
        return unregisterFilter(this);
    },
    formatToNumber(v, precision) {
        return Number(Number(v).toFixed(precision));
    },

    actions: {
        change([min, max]) {
            const change = get(this, 'change');
            const precision = get(this, 'precision');

            const formatFrom = get(this, 'formatFrom');

            min = formatFrom(min);
            max = formatFrom(max);

            let formattedMin = this.formatToNumber(min, precision);
            let formattedMax = this.formatToNumber(max, precision);

            // Return null for min or max if they are at the limits
            if(min === get(this, 'min')) {
                formattedMin = null;
            }
            if(max === get(this, 'max')) {
                formattedMax = null;
            }

            change({ min: formattedMin, max: formattedMax });
        }
    }
});
