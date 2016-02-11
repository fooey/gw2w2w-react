import { combineReducers } from 'redux';

import lang from './lang';
import matches from './matches';
import route from './route';
import timeouts from './timeouts';
import world from './world';


const appReducers = combineReducers({
    lang,
    matches,
    route,
    timeouts,
    world,
});

export default appReducers;