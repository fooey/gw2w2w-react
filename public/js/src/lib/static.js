'use strict';
/*eslint camelcase: 0 */


import _ from 'lodash';

import statics from 'gw2w2w-static';


const objectives2 = _.map(statics.objectives_v2,
    langObjectives => _.indexBy(langObjectives, 'id')
);

const worlds = _
    .chain(statics.worlds)
    .map((world) => {
        _.forEach(
            statics.langs,
            (lang) =>
            world[lang.slug].link = getWorldLink(lang.slug, world)
        );
        return world;
    })
    .indexBy('id')
    .value();


export default {
    langs           : statics.langs,
    worlds          : worlds,
    objectives2     : objectives2,
    objective_names : statics.objective_names,
    objective_types : statics.objective_types,
    objective_meta  : statics.objective_meta,
    objective_labels: statics.objective_labels,
    objective_map   : statics.objective_map,
};





function getWorldLink(langSlug, world) {
    return ['', langSlug, world[langSlug].slug].join('/');
}