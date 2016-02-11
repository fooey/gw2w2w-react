import { combineReducers } from 'redux';

import api from './api';
import lang from './lang';
import matches from './matches';
import route from './route';
import timeouts from './timeouts';
import world from './world';



export default combineReducers({
    api,
    lang,
    matches,
    route,
    timeouts,
    world,
});