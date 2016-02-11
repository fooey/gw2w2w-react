
import { batchActions } from 'redux-batched-actions';

import api from 'lib/api';


import {
    API_REQUEST_OPEN,
    API_REQUEST_SUCCESS,
    API_REQUEST_FAILED,
} from 'constants/actionTypes';


import {
    receiveMatches,
    getMatchesLastmod,
} from './matches';




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
                    receiveMatches({
                        data,
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