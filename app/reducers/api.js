
import _ from 'lodash';



import {
    API_REQUEST_OPEN,
    API_REQUEST_SUCCESS,
    API_REQUEST_FAILED,
} from 'constants/actionTypes';




const defaultState = {
    pending: [],
};


const api = (state = defaultState, action) => {
    // console.log('reducer::api', state, action);

    switch (action.type) {

        case API_REQUEST_OPEN:
            // console.log('reducer::api', action.type, state, action);
            return {
                ...state,
                pending: [action.requestKey, ...state.pending],
            };

        case API_REQUEST_SUCCESS:
        case API_REQUEST_FAILED:
            // console.log('reducer::api', action.type, state, action);
            return {
                ...state,
                pending: _.without(state.pending, action.requestKey),
            };

        default:
            return state;
    }
};




export default api;