import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../templates/components/hits-per-page';

const { get } = Ember;

export default Ember.Component.extend({
    layout,
    // Public API
    selected: { value: 24, label: '24 per page' },
    options: defaultTo([
        { value: 24, label: '24 per page' },
        { value: 48, label: '48 per page' },
        { value: 96, label: '96 per page' },
        { value: 192, label: '192 per page' }
    ]),
    change: defaultTo(() => {}),

    // Private API
    updateOptions(results) {
        const selectedValue = get(results, 'hitsPerPage');
        const options = get(this, 'options');
        const selectedOption = this.findOption(options, selectedValue);

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

    findOption(options, value) {
        return options.find(option => option.value === value);
    },

    actions: {
        changeHitsPerPage(event) {
            const options = get(this, 'options');
            const selectedValue = Number(get(event, 'target.value'));
            const selectedOption = this.findOption(options, selectedValue);

            this.set('selected', selectedOption);
            this.get('change')(selectedValue);
        }
    }
});
