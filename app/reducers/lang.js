import Immutable from 'immutable';

import { SET_LANG } from 'constants/actionTypes';


import { langs } from 'lib/static';

const defaultSlug = 'en';
const defaultLang = Immutable.fromJS(langs[defaultSlug]);


const lang = (state = defaultLang, action) => {
    switch (action.type) {
        case SET_LANG:
            return Immutable.fromJS(langs[action.slug]);

        default:
            return state;
    }
};




export default lang;