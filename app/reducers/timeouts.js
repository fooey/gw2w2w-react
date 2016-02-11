
import _ from 'lodash';

import {
    ADD_TIMEOUT,
    REMOVE_TIMEOUT,
    // REMOVE_ALL_TIMEOUTS,
} from 'constants/actionTypes';



const timeouts = (state = {}, action) => {
    // console.log('reducer::timeouts', state, action);

    switch (action.type) {
        case ADD_TIMEOUT:
            // console.log('reducer::timeouts', ADD_TIMEOUT, state, action);
            return {
                ...state,
                [action.name]: action.ref,
            };

        case REMOVE_TIMEOUT:
            // console.log('reducer::timeouts', REMOVE_TIMEOUT, state, action);
            return _.omit(state, action.name);

        // case REMOVE_ALL_TIMEOUTS:
        //     console.log('reducer::timeouts', REMOVE_ALL_TIMEOUTS, state, action);
        //     return {};

        default:
            return state;
    }
};




export default timeouts;