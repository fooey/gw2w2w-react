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
        eb: [[
            {id: '9', direction: ''},          // stonemist
        ], [
            {id: '1', direction: 'N'},         // overlook
            {id: '17', direction: 'NW'},       // mendons
            {id: '20', direction: 'NE'},       // veloka
            {id: '18', direction: 'SW'},       // anz
            {id: '19', direction: 'SE'},       // ogre
            {id: '6', direction: 'W'},         // speldan
            {id: '5', direction: 'E'},         // pang
        ], [
            {id: '2', direction: 'SE'},        // valley
            {id: '15', direction: 'S'},        // langor
            {id: '22', direction: 'E'},        // bravost
            {id: '16', direction: 'W'},        // quentin
            {id: '21', direction: 'N'},        // durios
            {id: '7', direction: 'SW'},        // dane
            {id: '8', direction: 'NE'},        // umber
        ], [
            {id: '3', direction: 'SW'},        // lowlands
            {id: '11', direction: 'W'},        // aldons
            {id: '13', direction: 'S'},        // jerrifer
            {id: '12', direction: 'N'},        // wildcreek
            {id: '14', direction: 'E'},        // klovan
            {id: '10', direction: 'NW'},       // rogues
            {id: '4', direction: 'SE'},        // golanta
        ]],
        bl2: [[
            {id: '113', direction: 'N'},       // rampart
            {id: '106', direction: 'W'},       // undercroft
            {id: '114', direction: 'E'},       // palace
        ], [
            {id: '102', direction: 'NW'},      // academy
            {id: '104', direction: 'NE'},      // necropolis
            {id: '99', direction: 'N'},        // lab
            {id: '115', direction: 'NW'},      // hideaway
            {id: '109', direction: 'NE'},      // refuge
        ], [
            {id: '110', direction: 'SW'},      // outpost
            {id: '105', direction: 'SE'},      // depot
            {id: '101', direction: 'SW'},      // encamp
            {id: '100', direction: 'SE'},      // farm
            {id: '116', direction: 'S'},       // well
        ]],
    };
}