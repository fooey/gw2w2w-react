'use strict';
/*eslint camelcase: 0 */

import _ from 'lodash';

import STATIC_LANGS from 'gw2w2w-static/data/langs';
import STATIC_WORLDS from 'gw2w2w-static/data/world_names';
import STATIC_OBJECTIVES from 'gw2w2w-static/data/objectives_v2_merged';




function getWorldLink(langSlug, world) {
    return ['', langSlug, world[langSlug].slug].join('/');
}


// function enhanceObjectives(objectives) {
//     console.log('objectives', objectives);

//     return objectives;
// }


function getMapsMeta() {
    return [
        {id: 38, name: 'Eternal Battlegrounds', abbr: 'EB'},
        {id: 1099, name: 'Red Borderlands', abbr: 'Red'},
        {id: 1102, name: 'Green Borderlands', abbr: 'Grn'},
        {id: 1143, name: 'Blue Borderlands', abbr: 'Blu'},
    ];
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


export const baseObjectivesMeta = [
    {map: 'eb', group: 1, id: '9', direction: ''},          // stonemist
    {map: 'eb', group: 2, id: '1', direction: 'N'},         // overlook
    {map: 'eb', group: 2, id: '17', direction: 'NW'},       // mendons
    {map: 'eb', group: 2, id: '20', direction: 'NE'},       // veloka
    {map: 'eb', group: 2, id: '18', direction: 'SW'},       // anz
    {map: 'eb', group: 2, id: '19', direction: 'SE'},       // ogre
    {map: 'eb', group: 2, id: '6', direction: 'W'},         // speldan
    {map: 'eb', group: 2, id: '5', direction: 'E'},         // pang
    {map: 'eb', group: 3, id: '2', direction: 'SE'},        // valley
    {map: 'eb', group: 3, id: '15', direction: 'S'},        // langor
    {map: 'eb', group: 3, id: '22', direction: 'E'},        // bravost
    {map: 'eb', group: 3, id: '16', direction: 'W'},        // quentin
    {map: 'eb', group: 3, id: '21', direction: 'N'},        // durios
    {map: 'eb', group: 3, id: '7', direction: 'SW'},        // dane
    {map: 'eb', group: 3, id: '8', direction: 'NE'},        // umber
    {map: 'eb', group: 4, id: '3', direction: 'SW'},        // lowlands
    {map: 'eb', group: 4, id: '11', direction: 'W'},        // aldons
    {map: 'eb', group: 4, id: '13', direction: 'S'},        // jerrifer
    {map: 'eb', group: 4, id: '12', direction: 'N'},        // wildcreek
    {map: 'eb', group: 4, id: '14', direction: 'E'},        // klovan
    {map: 'eb', group: 4, id: '10', direction: 'NW'},       // rogues
    {map: 'eb', group: 4, id: '4', direction: 'SE'},        // golanta

    {map: 'bl2', group: 1, id: '113', direction: 'N'},       // rampart
    {map: 'bl2', group: 1, id: '106', direction: 'W'},       // undercroft
    {map: 'bl2', group: 1, id: '114', direction: 'E'},       // palace
    {map: 'bl2', group: 2, id: '102', direction: 'NW'},      // academy
    {map: 'bl2', group: 2, id: '104', direction: 'NE'},      // necropolis
    {map: 'bl2', group: 2, id: '99', direction: 'N'},        // lab
    {map: 'bl2', group: 2, id: '115', direction: 'NW'},      // hideaway
    {map: 'bl2', group: 2, id: '109', direction: 'NE'},      // refuge
    {map: 'bl2', group: 3, id: '110', direction: 'SW'},      // outpost
    {map: 'bl2', group: 3, id: '105', direction: 'SE'},      // depot
    {map: 'bl2', group: 3, id: '101', direction: 'SW'},      // encamp
    {map: 'bl2', group: 3, id: '100', direction: 'SE'},      // farm
    {map: 'bl2', group: 3, id: '116', direction: 'S'},       // well
];

function getObjectiveMeta() {
    return _.keyBy(baseObjectivesMeta, 'id');
}






export const worlds = _
    .chain(STATIC_WORLDS)
    .keyBy('id')
    .mapValues((world) => {
        _.forEach(
            STATIC_LANGS,
            (lang) =>
            world[lang.slug].link = getWorldLink(lang.slug, world)
        );
        return world;
    })
    .value();




export const langs = STATIC_LANGS;
// export const worlds = worlds;
export const objectives = STATIC_OBJECTIVES;
export const objectivesGeo = getObjectiveGeo();
export const mapsMeta = getMapsMeta();
export const objectivesMeta = getObjectiveMeta();