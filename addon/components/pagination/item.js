import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../../templates/components/pagination/item';
import get from 'ember-metal/get';

export default Ember.Component.extend({
    layout,
    // Public API
    item: defaultTo({}),
    onSelect: defaultTo(() => {}),

    // Private API
    tagName: 'li',
    classNames: ['ais-pagination--item'],
    classNameBindings: ['_isActive'],

    _isActive: Ember.computed('item.active', function () {
        if(get(this, 'item.active') === true) {
            return 'ais-pagination--item__active active';
        }
        return false;
    })
});
