'use strict';
/*eslint camelcase: 0 */

import _ from 'lodash';

import statics from 'gw2w2w-static';


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
    langs: statics.langs,
    worlds: worlds,
    objectives: enhanceObjectives(statics.objectives_v2),
    objectivesGeo: getObjectiveGeo(),
    mapsMeta: getMapsMeta(),
    // objectives      : objectives2,
    // objective_names : statics.objective_names,
    // objective_types : statics.objective_types,
    // objective_meta  : statics.objective_meta,
    // objective_labels: statics.objective_labels,
    // objective_map   : statics.objective_map,
};





function getWorldLink(langSlug, world) {
    return ['', langSlug, world[langSlug].slug].join('/');
}


function enhanceObjectives(objectives) {
    console.log('objectives', objectives);

    return objectives;
}


function getMapsMeta() {
    return [
        {id: 38, name: 'Eternal Battlegrounds', abbr: 'EB'},
        {id: 1099, name: 'Red Borderlands', abbr: 'Red'},
        {id: 1102, name: 'Green Borderlands', abbr: 'Grn'},
        {id: 1143, name: 'Blue Borderlands', abbr: 'Blu'},
    ]
}


function getObjectiveGeo() {
    return {
        eb: [{
            9: '',          // stonemist
        }, {
            1: 'N',         // overlook
            17: 'NW',       // mendons
            20: 'NE',       // veloka
            18: 'SW',       // anz
            19: 'SE',       // ogre
            6: 'W',         // speldan
            5: 'E',         // pang
        }, {
            2: 'SE',        // valley
            15: 'S',        // langor
            22: 'E',        // bravost
            16: 'W',        // quentin
            21: 'N',        // durios
            7: 'SW',        // dane
            8: 'NE',        // umber
        }, {
            3: 'SW',        // lowlands
            11: 'W',        // aldons
            13: 'S',        // jerrifer
            12: 'N',        // wildcreek
            14: 'E',        // klovan
            10: 'NW',       // rogues
            4: 'SE',        // golanta
        }],
        bl2: [{
            113: 'N',       // rampart
            102: 'NW',      // academy
            104: 'NW',      // necropolis
        }, {
            99: 'N',        // lab
            115: 'NW',      // hideaway
            109: 'NE',      // refuge
        }, {
            106: 'W',       // undercroft
            115: 'E',       // palace
        }, {
            110: 'SW',      // outpost
            105: 'SE',      // depot
        }, {
            101: 'SW',      // encamp
            106: 'SE',      // farm
            116: 'SE',      // well
        }],
    };
}