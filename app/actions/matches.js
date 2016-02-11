import _ from 'lodash';

import {
    // REQUEST_MATCHES,
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';


export const receiveMatches = ({ data, lastUpdated }) => {
    // console.log('action::receiveMatches', data);

    return {
        type: RECEIVE_MATCHES,
        data,
        lastUpdated,
    };
};



export const receiveMatchesFailed = ({ err }) => {
    // console.log('action::receiveMatchesFailed', err);

    return {
        type: RECEIVE_MATCHES_FAILED,
        err,
    };
};



export function getMatchesLastmod(matchesData) {
    return _.reduce(
        matchesData,
        (acc, match) => Math.max(match.lastmod),
        0
    );
}