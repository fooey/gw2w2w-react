import { combineReducers } from 'redux';

import api from './api';
import guilds from './guilds';
import lang from './lang';
import matches from './matches';
import matchDetails from './matchDetails';
import now from './now';
import objectives from './objectives';
import route from './route';
import timeouts from './timeouts';
import world from './world';



export default combineReducers({
    api,
    guilds,
    lang,
    matches,
    matchDetails,
    now,
    objectives,
    route,
    timeouts,
    world,
});