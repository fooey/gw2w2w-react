
const SET_LANG = 'SET_LANG';


import { langs } from 'lib/static';

const defaultSlug = 'en';
const defaultLang = langs[defaultSlug];


const lang = (state = defaultLang, action) => {
    switch (action.type) {
        case SET_LANG:
            return langs[action.slug];

        default:
            return state;
    }
};




export default lang;