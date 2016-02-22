import Immutable from 'immutable';
import { batchActions } from 'redux-batched-actions';


import { worlds as STATIC_WORLDS } from 'lib/static';


import {
    CLEAR_MATCHDETAILS,
    RECEIVE_MATCHDETAILS,
    RECEIVE_MATCHDETAILS_SUCCESS,
    RECEIVE_MATCHDETAILS_FAILED,
} from 'constants/actionTypes';

// import * as actions from 'actions/matchDetails';
import { fetchGuildById } from 'actions/api';
import {
    updateObjective,
    updateObjectives,
} from 'actions/objectives';



export const clearMatchDetails = () => {
    console.log('action::clearMatchDetails');

    return {
        type: CLEAR_MATCHDETAILS,
    };
};



export const processMatchDetails = ({ data }) => {
    // console.log('action::processMatchDetails');

    const id = data.get('id');
    const region = data.get('region');
    const worlds = data.get('worlds');

    const maps = getMaps(data);
    const stats = getStats(data);
    const times = getTimes(data);
    // const worlds = getWorlds(data);

    const guildIds = getGuildIds(maps);
    const objectiveIds = getObjectiveIds(maps);

    // console.log('action::receiveMatchDetails', 'id', id);
    // console.log('action::receiveMatchDetails', 'region', region);
    // console.log('action::receiveMatchDetails', 'stats', stats.toJS());
    // console.log('action::receiveMatchDetails', 'times', times.toJS());
    // console.log('action::receiveMatchDetails', 'worlds', worlds);
    // console.log('action::receiveMatchDetails', 'maps', maps.toJS());
    // console.log('action::receiveMatchDetails', 'guildIds', guildIds.toJS());
    // console.log('action::receiveMatchDetails', 'objectiveIds', objectiveIds.toJS());


    return (dispatch, getState) => {
        dispatch(receiveMatchDetails({
            id,
            region,

            guildIds,
            maps,
            objectiveIds,
            stats,
            times,
            worlds,
        }));

        dispatchGuildLookups(dispatch, getState().guilds, guildIds);
        dispatchObjectiveUpdates(dispatch, data.get('maps'));
    };

    // return {
    //     type: RECEIVE_MATCHDETAILS,

    //     id,
    //     region,

    //     guildIds,
    //     maps,
    //     objectiveIds,
    //     stats,
    //     times,
    //     worlds,
    // };
};


function dispatchGuildLookups(dispatch, stateGuilds, guildIds) {
    const knownGuilds = stateGuilds.keySeq().toSet();
    const unknownGuilds = guildIds.subtract(knownGuilds);


    unknownGuilds.forEach(
        (guildId) => dispatch(fetchGuildById({ guildId }))
    );
}


function dispatchObjectiveUpdates(dispatch, maps) {
    let objectives = Immutable.Map();


    maps.forEach(
        m => m.get('objectives').forEach(
            (objective) => {
                objectives = objectives.setIn(
                    [objective.get('id')],
                    objective
                );
            }
        )
    );
    // maps.forEach(
    //     m => m.get('objectives').forEach(
    //         (objective) => dispatch(updateObjective({ objective }))
    //     )
    // );

    dispatch(updateObjectives({ objectives }));

}



export const receiveMatchDetails = ({
    id,
    region,
    guildIds,
    maps,
    objectiveIds,
    stats,
    times,
    worlds,
}) => ({
    type: RECEIVE_MATCHDETAILS,

    id,
    region,

    guildIds,
    maps,
    objectiveIds,
    stats,
    times,
    worlds,
});



export const receiveMatchDetailsSuccess = () => {
    // console.log('action::receiveMatchDetailsSuccess');

    return {
        type: RECEIVE_MATCHDETAILS_SUCCESS,
    };
};




export const receiveMatchDetailsFailed = ({ err }) => {
    console.log('action::receiveMatchDetailsFailed', err);

    return {
        type: RECEIVE_MATCHDETAILS_FAILED,
        err,
    };
};




function getMaps(node) {
    const maps = node
        .get('maps')
        // .map(
        //     m => m.set('stats', getStats(m))
        //         .delete('deaths')
        //         .delete('holdings')
        //         .delete('kills')
        //         .delete('scores')
        //         .delete('ticks')
        //         .set('guilds', getMapGuilds(m))
        //         .update('objectives', os => os.map(o => o.get('id')).toOrderedSet())
        // );
        .map(
            m => Immutable.Map({
                id: m.get('id'),
                type: m.get('type'),
                lastmod: m.get('lastmod'),
                stats: getStats(m),
                guilds: getMapGuildIds(m),
                objectives: getMapObjectiveIds(m),
            })
        );

    return maps;
}



function getGuildIds(mapNodes) {
    const guilds = mapNodes
        .map(m => m.get('guilds'))
        .flatten()
        .toOrderedSet();

    return guilds;
}



function getMapGuildIds(mapNode) {
    const mapGuilds = mapNode
        .get('objectives')
        .map(o => o.get('guild'))
        .flatten()
        .filterNot(g => g === null)
        .toOrderedSet();

    return mapGuilds;
}


function getObjectiveIds(mapNodes) {
    const objectives = mapNodes
        .map(m => m.get('objectives'))
        .flatten()
        .toOrderedSet();

    return objectives;
}

function getMapObjectiveIds(mapNode) {
    return mapNode
        .get('objectives')
        .map(o => o.get('id'))
        .toOrderedSet();
}


function getStats(node) {
    return Immutable.Map({
        deaths: node.get('deaths'),
        kills: node.get('kills'),
        holdings: node.get('holdings'),
        scores: node.get('scores'),
        ticks: node.get('ticks'),
    });
}

function getTimes(detailsNode) {
    return Immutable.Map({
        lastmod: detailsNode.get('lastmod'),
        endTime: detailsNode.get('startTime'),
        startTime: detailsNode.get('endTime'),
    });
}

// function getWorlds(detailsNode) {
//     return detailsNode
//         .get('worlds')
//         .map(worldId => Immutable.fromJS(STATIC_WORLDS[worldId]));
// }