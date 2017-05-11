import Ember from 'ember';
import config from 'ember-get-config';
import AlgoliaSearch from 'npm:algoliasearch';
import get from 'ember-metal/get';

const { getWithDefault } = Ember;

export default Ember.Service.extend({
    // Registered filters
    registeredFilters: [],
    // Composed search helper
    searchHelper: {},
    // The algolia client responsible for running the searches
    algoliaSearchClient: AlgoliaSearch(config.algolia.appId, config.algolia.apiKey),

    init() {
        // Check that all required data is defined in the extended search service
        Ember.assert('queryParamMappings is missing ember-algolia/services/search', this.get('queryParamMappings'));
        Ember.assert('facetsPerRoute is missing ember-algolia/services/search', this.get('facetsPerRoute'));
        this._super();
    },
    // Deprecated way to access the routeFilters
    pageFilters: Ember.computed.alias('routeFacets'),
    // Returns array of available filters for this route
    routeFacets: Ember.computed('pageType', function () {
        const facetsPerRoute = get(this, 'facetsPerRoute');
        const pageType = get(this, 'pageType');
        const camelizedRouteName = this._camelizeRouteName(pageType);
        return getWithDefault(facetsPerRoute, camelizedRouteName, []);
    }),

    _camelizeRouteName(routeName = '') {
        const routeHierarchy = routeName.split('.');
        const camelize = Ember.String.camelize;
        return routeHierarchy.reduce((previous, current, index) => {
            if(index === 0) {
                return camelize(current);
            }
            return `${previous}.${camelize(current)}`;
        }, '');
    },
    /**
     * Adds the filter in the filter array
     *
     * @param  {component} filter The filter component to be registered
     * @return {undefined}        Returns nothing
     */
    registerFilter(filter) {
        const registeredFilters = get(this, 'registeredFilters');
        registeredFilters.addObject(filter);
    },
    /**
     * Removes the filter from the filter array
     *
     * @param  {component} filter The filter component to be unregistered
     * @return {undefined}        Returns nothing
     */
    unregisterFilter(filter) {
        const registeredFilters = get(this, 'registeredFilters');
        registeredFilters.removeObject(filter);
    }
});
