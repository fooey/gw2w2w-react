import Immutable from 'immutable';


import {
    RECEIVE_MATCHES,
    RECEIVE_MATCHES_SUCCESS,
    RECEIVE_MATCHES_FAILED,
} from 'constants/actionTypes';



const defaultState = Immutable.Map({
    data: Immutable.Map({}),
    ids: Immutable.List([]),
    lastUpdated: 0,
});


const matches = (state = defaultState, action) => {
    // console.log('reducer::matches', state, action);

    switch (action.type) {

        case RECEIVE_MATCHES:
            return state
                .set('data', action.data)
                .set('lastUpdated', action.lastUpdated);

        case RECEIVE_MATCHES_SUCCESS:
            // console.log('reducer::matches', action);

            return state.has('error')
                ? state.delete('error')
                : state;

        case RECEIVE_MATCHES_FAILED:
            console.log('reducer::matches', action);

            return state.set('error', action.err.message);

        default:
            return state;
    }
};




export default matches;