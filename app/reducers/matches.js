
import {
    REQUEST_MATCHES,
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';



const defaultState = {
    data: {},
    ids: [],
    isFetching: false,
    lastUpdated: 0,
};


const matches = (state = defaultState, action) => {
    // console.log('reducer::matches', state, action);

    switch (action.type) {
        // case SET_MATCHES:
        //     return Object.assign({}, { data: action.matches }, state);

        case REQUEST_MATCHES:
            // console.log('reducer::matches', REQUEST_MATCHES, state, action);
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_MATCHES:
            // console.log('reducer::matches', RECEIVE_MATCHES, state, action);
            return {
                ...state,
                data: action.data,
                ids: Object.keys(action.data).sort(),
                isFetching: false,
                lastUpdated: action.lastUpdated,
            };

        case RECEIVE_MATCHES_FAILED:
            // console.log('reducer::matches', RECEIVE_MATCHES_FAILED, state, action);
            return {
                ...state,
                error: action.error,
                isFetching: false,
            };

        default:
            return state;
    }
};




export default matches;