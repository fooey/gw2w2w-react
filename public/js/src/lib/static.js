'use strict';
/*eslint camelcase: 0 */


import _ from 'lodash';

import statics from 'gw2w2w-static';
// import en_raw from 'gw2w2w-static/data/objectives_v2_en';
// import es_raw from 'gw2w2w-static/data/objectives_v2_es';
// import de_raw from 'gw2w2w-static/data/objectives_v2_de';
// import fr_raw from 'gw2w2w-static/data/objectives_v2_fr';

// let en = _.indexBy(en_raw, 'id');
// let es = _.indexBy(es_raw, 'id');
// let de = _.indexBy(de_raw, 'id');
// let fr = _.indexBy(fr_raw, 'id');


// // en = _.indexBy(en, 'id');
// // es = _.indexBy(es, 'id');
// // de = _.indexBy(de, 'id');
// // fr = _.indexBy(fr, 'id');

// let objectives2 = _
//     .chain(en)
//     .mapValues(o => {
//         o.name = {
//             en: o.name,
//             es: es[o.id].name,
//             de: de[o.id].name,
//             fr: fr[o.id].name,
//         };
//         return o;
//     })
//     .value();

// const objectives2 = _
//     .chain(statics.objectives_v2.en)
//     .map(o => {
//         o.name = {};
//         return o;
//     })
//     .indexBy('id')
//     .value();


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
    objectives      : statics.objectives_v2,
    // objectives      : objectives2,
    objective_names : statics.objective_names,
    objective_types : statics.objective_types,
    objective_meta  : statics.objective_meta,
    objective_labels: statics.objective_labels,
    objective_map   : statics.objective_map,
};





function getWorldLink(langSlug, world) {
    return ['', langSlug, world[langSlug].slug].join('/');
}