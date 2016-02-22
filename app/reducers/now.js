import moment from 'moment';

import { SET_NOW } from 'constants/actionTypes';


const route = (state = moment(), action) => {
    switch (action.type) {
        case SET_NOW:
            return moment.unix(moment().unix()); // rounds to second
            // return moment();

        default:
            return state;
    }
};




export default route;
