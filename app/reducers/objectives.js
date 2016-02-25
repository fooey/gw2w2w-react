import Immutable from 'immutable';

import {
    OBJECTIVES_RESET,
    OBJECTIVES_UPDATE,
    OBJECTIVE_UPDATE,
} from 'constants/actionTypes';



const defaultState = Immutable.Map();


const objectives = (state = defaultState, action) => {
    // console.log('reducer::objectives', state, action);

    switch (action.type) {

        case OBJECTIVES_RESET:
            // console.log('reducer::objectives', action);

            return defaultState;

        case OBJECTIVE_UPDATE:
            // console.log('reducer::objectives', action.type, action.objective.get('id'), action.objective.toJS());

            return state.set(
                action.objective.get('id'),
                action.objective
            );

        case OBJECTIVES_UPDATE:
            // console.log('reducer::objectives', action.type, action.objectives.toJS());

            return action.objectives;

        default:
            return state;
    }
};




export default objectives;