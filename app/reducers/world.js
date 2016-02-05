
import { getWorldFromSlug } from 'lib/worlds';


const world = (state = null, action) => {
    switch (action.type) {
        case 'SET_WORLD':
            return getWorldFromSlug(action.langSlug, action.worldSlug);

        default:
            return state;
    }
};








export default world;