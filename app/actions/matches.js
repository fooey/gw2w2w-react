import _ from 'lodash';

import api from 'lib/api';


import {
    requestOpen,
    requestSuccess,
    requestFailed,
} from './api';

import {
    REQUEST_MATCHES,
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';



export const requestMatches = () => {
    // console.log('action::requestMatches');

    return ;
};



export const fetchMatches = () => {
    // console.log('action::fetchMatches');

    return (dispatch) => {
        const requestKey = 'matches';

        dispatch(requestOpen({ requestKey }));

        api.getMatches({
            success: (data) => {
                // console.log('action::fetchMatches::success', data);
                dispatch(requestSuccess({ requestKey }));
                dispatch(receiveMatches({
                    data,
                    lastUpdated: getMatchesLastmod(data),
                }));
            },
            error: (err) => {
                // console.log('action::fetchMatches::error', err);
                dispatch(requestFailed({ requestKey }));
                dispatch(receiveMatchesFailed(err));
            },
            // complete: () => {
            //     console.log('action::fetchMatches::complete');
            // },
        });
    };
};



export const receiveMatches = ({ data, lastUpdated }) => {
    // console.log('action::receiveMatches', data);

    return {
        type: RECEIVE_MATCHES,
        data,
        lastUpdated,
    };
};



export const receiveMatchesFailed = (err) => {
    // console.log('action::receiveMatchesFailed', err);

    return {
        type: RECEIVE_MATCHES_FAILED,
        err,
    };
};



function getMatchesLastmod(matchesData) {
    return _.reduce(
        matchesData,
        (acc, match) => Math.max(match.lastmod),
        0
    );
}