import Ember from 'ember';
import defaultTo from 'sunflower/util/default-to';
import layout from '../templates/components/refinement-list';
import get from 'ember-metal/get';

export default Ember.Component.extend({
    layout,
    // Public API
    attributeName: defaultTo(''),
    limit: defaultTo(10),
    sortBy: defaultTo(['count:desc', 'name:asc']),

    registerFilter: defaultTo(() => {}),
    unregisterFilter: defaultTo(() => {}),

    addFilter: defaultTo(() => {}),
    removeFilter: defaultTo(() => {}),

    // Private API
    classNames: ['ais-root'],
    classNameBindings: ['hasOptions:ais-refinement-list'],

    hasOptions: Ember.computed.gt('options.length', 0),
    options: defaultTo([]),
    _options: Ember.computed('options,limit', {
        get() {
            const limit = get(this, 'limit');
            return get(this, 'options').slice(0, limit);
        }
    }),

    updateOptions(results) {
        const attributeName = get(this, 'attributeName');
        const sortBy = get(this, 'sortBy');

        const options = results.getFacetValues(attributeName, { sortBy });
        this.set('options', options);
    },

    willInsertElement() {
        const limit = get(this, 'limit');
        const registerFilter = get(this, 'registerFilter');

        // https://github.com/algolia/algoliasearch-helper-js#query-parameters
        const queryParamters = {
            maxValuesPerFacet: limit
        };

        return registerFilter(this, queryParamters);
    },
    willDestroyElement() {
        const unregisterFilter = get(this, 'unregisterFilter');
        return unregisterFilter(this);
    },
    actions: {
        addFilter(option) {
            const attributeName = get(this, 'attributeName');
            const addFilter = this.get('addFilter');
            Ember.set(option, 'isRefined', !option.isRefined);

            Ember.run.scheduleOnce('afterRender', this, addFilter, attributeName, option.name);
        },
        removeFilter(option) {
            const attributeName = get(this, 'attributeName');
            const removeFilter = this.get('removeFilter');
            Ember.set(option, 'isRefined', !option.isRefined);

            Ember.run.scheduleOnce('afterRender', this, removeFilter, attributeName, option.name);
        }
    }
});
