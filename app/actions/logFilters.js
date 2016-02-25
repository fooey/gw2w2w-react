
import {
    LOG_FILTERS_TOGGLE_MAP,
    LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE,
    LOG_FILTERS_TOGGLE_EVENT_TYPE,
} from 'constants/actionTypes';



export const toggleMap = ({ mapId }) => {
    return {
        type: LOG_FILTERS_TOGGLE_MAP,
        mapId,
    };
};



export const toggleObjectiveType = ({ objectiveType }) => {
    return {
        type: LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE,
        objectiveType,
    };
};



export const toggleEventType = ({ eventType }) => {
    return {
        type: LOG_FILTERS_TOGGLE_EVENT_TYPE,
        eventType,
    };
};
