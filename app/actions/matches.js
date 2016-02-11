import _ from 'lodash';

import api from 'lib/api';

import {
    REQUEST_MATCHES,
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';



export const requestMatches = () => {
    // console.log('action::requestMatches');

    return {
        type: REQUEST_MATCHES,
    };

};



export const fetchMatches = () => {
    // console.log('action::fetchMatches');

    return (dispatch) => {
        dispatch(requestMatches());

        api.getMatches({
            success: (data) => {
                // console.log('action::fetchMatches::success', data);
                dispatch(receiveMatches({
                    data,
                    lastUpdated: getMatchesLastmod(data),
                }));
            },
            error: (err) => {
                // console.log('action::fetchMatches::error', err);
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