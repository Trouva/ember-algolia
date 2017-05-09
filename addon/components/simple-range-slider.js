import RangeSlider from 'ember-cli-nouislider/components/range-slider';
import defaultTo from 'ember-algolia/utils/default-to';
import layout from '../templates/components/simple-range-slider';

// Full documentation:
// http://kennethkalmer.github.io/ember-cli-nouislider/#/options

export default RangeSlider.extend({
    layout,

    // Public API
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
    step: undefined,

    min: defaultTo(0),
    max: defaultTo(100),

    formatFrom: defaultTo(value => value),
    formatTo: defaultTo(value => value)
});
