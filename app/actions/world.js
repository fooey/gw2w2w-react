
import {
    SET_WORLD,
    CLEAR_WORLD,
} from 'constants/actionTypes';



export const setWorld = (langSlug, worldSlug) => {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: SET_WORLD,
        langSlug,
        worldSlug,
    };
};

export const clearWorld = () => {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: CLEAR_WORLD,
    };
};
