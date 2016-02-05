import { combineReducers } from 'redux';

import lang from './lang';
import route from './route';
import world from './world';


const appReducers = combineReducers({
    lang,
    route,
    world,
});

export default appReducers;