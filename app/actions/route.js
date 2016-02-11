
import {
    SET_ROUTE,
} from 'constants/actionTypes';


export const setRoute = (ctx) => {
    return {
        type: SET_ROUTE,
        path: ctx.path,
        params: ctx.params,
    };
};
