
import {
    API_REQUEST_OPEN,
    API_REQUEST_SUCCESS,
    API_REQUEST_FAILED,
} from 'constants/actionTypes';




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