import Ember from 'ember';
import defaultTo from 'ember-algolia/utils/default-to';
import { replaceQueryParam } from 'ember-algolia/utils/url';
import layout from '../templates/components/pagination';
import get from 'ember-metal/get';

const { setProperties } = Ember;

export default Ember.Component.extend({
    layout,
    // Public API
    page: 0,
    total: defaultTo(1),
    change: defaultTo(() => {}),
    numberOfPages: defaultTo(7),

    updateOptions({ page, nbPages }) {
        setProperties(this, {
            page,
            total: nbPages
        });
    },

    willInsertElement() {
        const registerFilter = get(this, 'registerFilter');
        return registerFilter(this);
    },
    willDestroyElement() {
        const unregisterFilter = get(this, 'unregisterFilter');
        return unregisterFilter(this);
    },

    // Private API
    _routing: Ember.inject.service('-routing'),
    //If the previous URL changed, we need to recompute the currentURL
    _currentURL: Ember.computed('_routing.router.location.previousURL', function () {
        return this.get('_routing.router.location').getURL();
    }),
    // Construct the objects needed by "shop-filter/pagination/item" component
    // to display the link to the correct location.
    _options: Ember.computed('page', 'total', '_currentURL', function () {
        const total = Number(get(this, 'total')); // 1 based index
        const page = Number(get(this, 'page')); // 0 based index
        const pageOneIndex = page + 1;
        const numberOfPages = get(this, 'numberOfPages'); // 1 based index
        let options = null; // 1 based index

        // If there's less pages than the number of pages to show.
        // Show all pages
        if (total <= numberOfPages) {
            options = Array.from({ length: total }, (v,k) => k+1);
        // If the selected page is less than halfway through the start of the list, show number of pages
        } else if(pageOneIndex <= Math.ceil(numberOfPages / 2)) {
            options = Array.from({ length: numberOfPages }, (v,k) => k+1);
        // If the selected page is at the end of the list, show last few pages
        } else if(pageOneIndex > total - Math.floor(numberOfPages / 2)) {
            options = Array.from({ length: numberOfPages }, (v,k) => total - numberOfPages + k + 1);
        // The current selected page is somewhere in the middle.
        } else {
            const offset = pageOneIndex - Math.floor(numberOfPages / 2);
            options = Array.from({ length: numberOfPages }, (v,k) => {
                return offset + k;
            });
        }

        if(!options) options = [];

        // Format data
        return options.map(option => {
            if(option === '...') {
                return { value: null, display: '...'};
            }

            return {
                value: option - 1,
                display: option,
                href: replaceQueryParam(get(this, '_currentURL'), 'p', option - 1),
                active: String(page) === String(option - 1)
            };
        });
    }),

    // Construct first page url. (Strip out query param)
    _firstPageNum: 0,
    _firstPage: Ember.computed('_currentURL', function () {
        return replaceQueryParam(get(this, '_currentURL'), 'p', undefined);
    }),

    // Construct previous page url and compute previous page number
    _previousPageNum: Ember.computed('page', function () {
        return get(this, 'page') - 1;
    }),
    _previousPage: Ember.computed('_previousPageNum,_currentURL', function () {
        let page = get(this, '_previousPageNum');

        // Strip query param if previous page is the first page
        if(page === 0) {
            page = undefined;
        }
        return replaceQueryParam(get(this, '_currentURL'), 'p', page);
    }),

    // Construct next page url and compute next page number
    _nextPageNum: Ember.computed('page', function () {
        return get(this, 'page') + 1;
    }),
    _nextPage: Ember.computed('_nextPageNum,_currentURL', function () {
        const page = get(this, '_nextPageNum');
        return replaceQueryParam(get(this, '_currentURL'), 'p', page);
    }),

    // Construct last page url and compute last page number
    _lastPageNum: Ember.computed('total', function () {
        return get(this, 'total') - 1;
    }),
    _lastPage: Ember.computed('_currentURL,_lastPageNum', function () {
        const page = get(this, '_lastPageNum');
        return replaceQueryParam(get(this, '_currentURL'), 'p', page);
    }),

    _hasPreviousButton: Ember.computed.gt('page', 0),
    _hasNextButton: Ember.computed('page', 'total', function () {
        return this.get('total') > this.get('page') + 1;
    }),

    actions: {
        changePage(page) {
            this.get('change')(page);
        }
    }
});
