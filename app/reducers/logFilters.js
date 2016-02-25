import Immutable from 'immutable';

import {
    LOG_FILTERS_TOGGLE_MAP,
    LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE,
    LOG_FILTERS_TOGGLE_EVENT_TYPE,
} from 'constants/actionTypes';


const defaultState = Immutable.Map({
    maps: Immutable.Set(['EB', 'Red', 'Grn', 'Blu']),
    objectiveTypes: Immutable.Set(['castle', 'keep', 'tower', 'camp']),
    eventTypes: Immutable.Set(['capture', 'claim']),
});

const logFilters = (state = defaultState, action) => {
    switch (action.type) {

        case LOG_FILTERS_TOGGLE_MAP:
            console.log('reducer::logFilters', action);

            return state.update(
                'maps',
                v =>
                v.has(action.mapId)
                    ? v.delete(action.mapId)
                    : v.add(action.mapId)
            );

        case LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE:
            console.log('reducer::logFilters', action);

            return state.update(
                'objectiveTypes',
                v =>
                v.has(action.objectiveType)
                    ? v.delete(action.objectiveType)
                    : v.add(action.objectiveType)
            );

        case LOG_FILTERS_TOGGLE_EVENT_TYPE:
            console.log('reducer::logFilters', action);

            return state.update(
                'eventTypes',
                v =>
                v.has(action.eventType)
                    ? v.delete(action.eventType)
                    : v.add(action.eventType)
            );

        default:
            return state;
    }
};




export default logFilters;
