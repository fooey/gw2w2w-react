
import {
    SET_WORLD,
    CLEAR_WORLD,
} from 'constants/actionTypes';

import { getWorldFromSlug } from 'lib/worlds';


const world = (state = null, action) => {
    switch (action.type) {
        case SET_WORLD:
            return getWorldFromSlug(action.langSlug, action.worldSlug);

        case CLEAR_WORLD:
            return null;

        default:
            return state;
    }
};








export default world;