
import {
    ADD_TIMEOUT,
    REMOVE_TIMEOUT,
    // REMOVE_ALL_TIMEOUTS,
} from 'constants/actionTypes';



export const setAppTimeout = ({
    name,
    cb,
    timeout,
}) => {
    timeout = (typeof timeout === 'function')
        ? timeout()
        : timeout;

    // console.log('action::setAppTimeout', name, timeout);

    return (dispatch) => {
        dispatch(clearAppTimeout({ name }));

        const ref = setTimeout(cb, timeout);

        dispatch(saveTimeout({
            name,
            ref,
        }));
    };
};



export const saveTimeout = ({
    name,
    ref,
}) => {
    return {
        type: ADD_TIMEOUT,
        name,
        ref,
    };
};



export const clearAppTimeout = ({ name }) => {

    return (dispatch, getState) => {
        const { timeouts } = getState();

        // console.log('action::clearAppTimeout', name, timeouts[name]);

        clearTimeout(timeouts[name]);

        dispatch(removeTimeout({ name }));
    };
};




export const clearAllTimeouts = () => {
    // console.log('action::clearAllTimeouts');


    return (dispatch, getState) => {
        const { timeouts } = getState();

        // console.log('action::clearAllTimeouts', getState().timeouts);

        _.forEach(timeouts, (t, name) => {
            dispatch(clearAppTimeout({ name }));
        });

        // console.log('action::clearAllTimeouts', getState().timeouts);

    };
};



export const removeTimeout = ({ name }) => {
    // console.log('action::removeTimeout', name);

    return {
        type: REMOVE_TIMEOUT,
        name,
    };
};
