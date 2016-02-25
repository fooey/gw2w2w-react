
import Immutable from 'immutable';
import { batchActions } from 'redux-batched-actions';

import api from 'lib/api';


import {
    API_REQUEST_OPEN,
    API_REQUEST_SUCCESS,
    API_REQUEST_FAILED,
} from 'constants/actionTypes';


import {
    receiveMatches,
    receiveMatchesFailed,
    receiveMatchesSuccess,
    getMatchesLastmod,
} from './matches';


import {
    processMatchDetails,
    // receiveMatchDetails,
    receiveMatchDetailsSuccess,
    receiveMatchDetailsFailed,
} from './matchDetails';



import {
    initializeGuild,
    receiveGuild,
    receiveGuildFailed,
} from './guilds';




export const requestOpen = ({ requestKey }) => {
    // console.log('action::requestMatches');

    return {
        type: API_REQUEST_OPEN,
        requestKey,
    };
};



export const requestSuccess = ({ requestKey }) => {
    // console.log('action::requestMatches');

    return {
        type: API_REQUEST_SUCCESS,
        requestKey,
    };
};



export const requestFailed = ({ requestKey }) => {
    // console.log('action::requestMatches');

    return {
        type: API_REQUEST_FAILED,
        requestKey,
    };
};



export const fetchMatches = () => {
    // console.log('action::fetchMatches');

    return (dispatch) => {
        const requestKey = 'matches';

        dispatch(requestOpen({ requestKey }));

        api.getMatches({
            success: (data) => {
                // console.log('action::fetchMatches::success', data);
                dispatch(batchActions([
                    requestSuccess({ requestKey }),
                    receiveMatchesSuccess(),
                    receiveMatches({
                        data: Immutable.fromJS(data),
                        lastUpdated: getMatchesLastmod(data),
                    }),
                ]));
            },
            error: (err) => {
                // console.log('action::fetchMatches::error', err);
                dispatch(batchActions([
                    requestFailed({ requestKey }),
                    receiveMatchesFailed({ err }),
                ]));
            },
            // complete: () => {
            //     console.log('action::fetchMatches::complete');
            // },
        });
    };
};



export const fetchMatchDetails = ({ world }) => {
    // console.log('action::fetchMatches', world);

    return (dispatch) => {
        const requestKey = `matchDetails`;

        dispatch(requestOpen({ requestKey }));

        api.getMatchByWorldId({
            worldId: world.id,
            success: (data) => {
                // console.log('action::fetchMatches::success', data);
                dispatch(batchActions([
                    requestSuccess({ requestKey }),
                    receiveMatchDetailsSuccess(),
                ]));
                dispatch(
                    processMatchDetails({
                        data: Immutable.fromJS(data),
                    })
                );
            },
            error: (err) => {
                console.log('action::fetchMatches::error', err);
                dispatch(batchActions([
                    requestFailed({ requestKey }),
                    receiveMatchDetailsFailed({ err }),
                ]));
            },
            // complete: () => {
            //     console.log('action::fetchMatches::complete');
            // },
        });
    };
};





export const fetchGuildById = ({ guildId }) => {

    return (dispatch) => {
        const requestKey = `guild-${ guildId }`;

        // console.log('action::fetchGuildById:', requestKey);

        dispatch(batchActions([
            requestOpen({ requestKey }),
            initializeGuild({ guildId }),
        ]));

        api.getGuildById({
            guildId,
            success: (data) => {
                // console.log('action::fetchGuildById::success', requestKey, data);

                dispatch(batchActions([
                    requestSuccess({ requestKey }),
                    receiveGuild({ guildId, data }),
                ]));
            },
            error: (err) => {
                console.log('action::fetchGuildById::error', requestKey, err);

                dispatch(batchActions([
                    requestFailed({ requestKey }),
                    receiveGuildFailed({ guildId, err }),
                ]));
            },
            // complete: () => {
            //     console.log('action::fetchGuildById::complete');
            // },
        });;
    };
};

