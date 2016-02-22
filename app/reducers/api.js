
import Immutable from 'immutable';



import {
    API_REQUEST_OPEN,
    API_REQUEST_SUCCESS,
    API_REQUEST_FAILED,
} from 'constants/actionTypes';




const defaultState = Immutable.Map({
    pending: Immutable.List([]),
});


const api = (state = defaultState, action) => {
    // console.log('reducer::api', state, action);

    switch (action.type) {
        case API_REQUEST_OPEN:
            // console.log('reducer::api', action.type, action.requestKey);
            return state.update(
                'pending',
                u => u.push(action.requestKey)
            );

        case API_REQUEST_SUCCESS:
        case API_REQUEST_FAILED:
            // console.log('reducer::api', action.type, action.requestKey);
            return state.update(
                'pending',
                u => u.filterNot(f => f === action.requestKey)
            );

        default:
            return state;
    }
};




export default api;