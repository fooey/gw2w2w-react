import Immutable from 'immutable';


import {
    CLEAR_MATCHDETAILS,
    RECEIVE_MATCHDETAILS,
    RECEIVE_MATCHDETAILS_SUCCESS,
    RECEIVE_MATCHDETAILS_FAILED,
} from 'constants/actionTypes';

export const rgbNum = Immutable.Map({ red: 0, blue: 0, green: 0 });
export const hold = Immutable.Map({ castle: 0, keep: 0, tower: 0, camp: 0 });
export const rgbHold = Immutable.Map({ red: hold, blue: hold, green: hold });


export const statsDefault = Immutable.fromJS({
    deaths: rgbNum,
    kills: rgbNum,
    holdings: rgbHold,
    scores: rgbNum,
    ticks: rgbNum,
});

export const mapDefault = Immutable.Map({
    id: null,
    lastmod: null,
    guilds: Immutable.OrderedSet(),
    objectives: Immutable.OrderedSet(),
    stats: statsDefault,
    type: null,
});

export const mapsDefault = Immutable.List([
    mapDefault,
    mapDefault,
    mapDefault,
]);

export const timesDefault = Immutable.Map({
    lastmod: null,
    endTime: null,
    startTime: null,
});


export const defaultState = Immutable.Map({
    id: null,
    guilds: Immutable.OrderedSet(),
    maps: mapsDefault,
    objectives: Immutable.OrderedSet(),
    region: null,
    times: timesDefault,
    stats: statsDefault,
    worlds: rgbNum,
    lastUpdate: Date.now(),
});


const matchDetails = (state = defaultState, action) => {
    // console.log('reducer::matchDetails', state, action);

    switch (action.type) {

        case RECEIVE_MATCHDETAILS:
            // console.log('reducer::matchDetails', action);
            return state.withMutations(
                tmpState =>
                tmpState
                    .set('lastUpdate', Date.now())
                    .set('id', action.id)
                    .set('guildIds', action.guildIds)
                    .set('maps', action.maps)
                    .set('objectiveIds', action.objectiveIds)
                    .set('region', action.region)
                    .set('stats', action.stats)
                    .set('times', action.times)
                    .set('worlds', action.worlds)
            );

        case CLEAR_MATCHDETAILS:
            return defaultState;

        case RECEIVE_MATCHDETAILS_SUCCESS:
            // console.log('reducer::matchDetails', action);

            return state
                .set('lastUpdate', Date.now())
                .delete('error');

        case RECEIVE_MATCHDETAILS_FAILED:
            console.log('reducer::matchDetails', action);

            return state
                .set('lastUpdate', Date.now())
                .set('error', action.err.message);

        default:
            return state;
    }
};




export default matchDetails;