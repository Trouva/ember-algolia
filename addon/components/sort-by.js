import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../templates/components/sort-by';
import get from 'ember-metal/get';

export default Ember.Component.extend({
    layout,
    // Public API
    selected: { name: 'products', label: 'Recommended' },
    indices: defaultTo([
        { name: 'products', label: 'Recommended' },
        { name: 'products_newest', label: 'Newest first' },
        { name: 'products_oldest', label: 'Oldest first' },
        { name: 'products_price_asc', label: 'Lowest price' },
        { name: 'products_price_desc', label: 'Highest price' }
    ]),
    change: defaultTo(() => {}),

    // Private API
    updateOptions(results) {
        const selectedValue = get(results, 'index');
        const indices = get(this, 'indices');
        const selectedOption = this.findOption(indices, selectedValue);

        this.set('selected', selectedOption);
    },

    willInsertElement() {
        const registerFilter = get(this, 'registerFilter');
        return registerFilter(this);
    },
    willDestroyElement() {
        const unregisterFilter = get(this, 'unregisterFilter');
        return unregisterFilter(this);
    },

    findOption(indices, value) {
        return indices.find(option => option.name === value);
    },

    actions: {
        changeSortBy(event) {
            const indices = get(this, 'indices');
            const selectedValue = get(event, 'target.value');
            const selectedOption = this.findOption(indices, selectedValue);

            this.set('selected', selectedOption);
            this.get('change')(selectedValue);
        }
    }
});
