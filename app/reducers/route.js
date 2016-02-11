
import {
    SET_ROUTE,
} from 'constants/actionTypes';


const defaultState = {
    path: '/',
    params: {},
};

const route = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ROUTE:
            return {
                path: action.path,
                params: action.params,
            };

        default:
            return state;
    }
};




export default route;
