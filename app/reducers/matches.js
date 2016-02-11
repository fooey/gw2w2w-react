
import {
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';



const defaultState = {
    data: {},
    ids: [],
    lastUpdated: 0,
};


const matches = (state = defaultState, action) => {
    // console.log('reducer::matches', state, action);

    switch (action.type) {

        case RECEIVE_MATCHES:
            // console.log('reducer::matches', RECEIVE_MATCHES, state, action);
            return {
                ...state,
                data: action.data,
                ids: Object.keys(action.data).sort(),
                lastUpdated: action.lastUpdated,
            };

        case RECEIVE_MATCHES_FAILED:
            // console.log('reducer::matches', RECEIVE_MATCHES_FAILED, state, action);
            return {
                ...state,
                error: action.error,
            };

        default:
            return state;
    }
};




export default matches;