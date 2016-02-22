
import moment from 'moment';



import {
    OBJECTIVES_RESET,
    OBJECTIVES_UPDATE,
    OBJECTIVE_UPDATE,
} from 'constants/actionTypes';



export const resetObjectives = () => {
    // console.log('action::resetObjectives');

    return {
        type: OBJECTIVES_RESET,
    };
};



export const updateObjectives = ({ objectives }) => {
    // console.log('action::updateObjectives', objectives.toJS());

    objectives = objectives.map(
        objective =>
        objective
            .update('lastFlipped', v => moment.unix(v))
            .update('lastClaimed', v => moment.unix(v))
            .update('lastmod', v => moment.unix(v))
            .update(v => v.set('expires', v.get('lastFlipped').add(5, 'm')))
    );
//
    return {
        type: OBJECTIVES_UPDATE,
        objectives,
    };
};



export const updateObjective = ({ objective }) => {
    // console.log('action::updateObjective', objective.toJS());

    // objective = objective.set('expires', objective.get('lastFlipped') + (5 * 60 * 1000));
    // objective = objective
    //     .update('lastFlipped', v => moment(v * 1000))
    //     .update('lastClaimed', v => moment(v * 1000))
    //     .update('lastmod', v => moment(v * 1000));
//
    return {
        type: OBJECTIVE_UPDATE,
        objective,
    };
};