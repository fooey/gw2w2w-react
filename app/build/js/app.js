(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchGuildById = exports.fetchMatchDetails = exports.fetchMatches = exports.requestFailed = exports.requestSuccess = exports.requestOpen = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxBatchedActions = require('redux-batched-actions');

var _api = require('lib/api');

var _api2 = _interopRequireDefault(_api);

var _actionTypes = require('constants/actionTypes');

var _matches = require('./matches');

var _matchDetails = require('./matchDetails');

var _guilds = require('./guilds');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestOpen = exports.requestOpen = function requestOpen(_ref) {
    var requestKey = _ref.requestKey;

    // console.log('action::requestMatches');

    return {
        type: _actionTypes.API_REQUEST_OPEN,
        requestKey: requestKey
    };
};

var requestSuccess = exports.requestSuccess = function requestSuccess(_ref2) {
    var requestKey = _ref2.requestKey;

    // console.log('action::requestMatches');

    return {
        type: _actionTypes.API_REQUEST_SUCCESS,
        requestKey: requestKey
    };
};

var requestFailed = exports.requestFailed = function requestFailed(_ref3) {
    var requestKey = _ref3.requestKey;

    // console.log('action::requestMatches');

    return {
        type: _actionTypes.API_REQUEST_FAILED,
        requestKey: requestKey
    };
};

var fetchMatches = exports.fetchMatches = function fetchMatches() {
    // console.log('action::fetchMatches');

    return function (dispatch) {
        var requestKey = 'matches';

        dispatch(requestOpen({ requestKey: requestKey }));

        _api2.default.getMatches({
            success: function success(data) {
                // console.log('action::fetchMatches::success', data);
                dispatch((0, _reduxBatchedActions.batchActions)([requestSuccess({ requestKey: requestKey }), (0, _matches.receiveMatchesSuccess)(), (0, _matches.receiveMatches)({
                    data: _immutable2.default.fromJS(data),
                    lastUpdated: (0, _matches.getMatchesLastmod)(data)
                })]));
            },
            error: function error(err) {
                // console.log('action::fetchMatches::error', err);
                dispatch((0, _reduxBatchedActions.batchActions)([requestFailed({ requestKey: requestKey }), (0, _matches.receiveMatchesFailed)({ err: err })]));
            }
        });
    };
};

// complete: () => {
//     console.log('action::fetchMatches::complete');
// },
var fetchMatchDetails = exports.fetchMatchDetails = function fetchMatchDetails(_ref4) {
    var world = _ref4.world;

    // console.log('action::fetchMatches', world);

    return function (dispatch) {
        var requestKey = 'matchDetails';

        dispatch(requestOpen({ requestKey: requestKey }));

        _api2.default.getMatchByWorldId({
            worldId: world.id,
            success: function success(data) {
                // console.log('action::fetchMatches::success', data);
                dispatch((0, _reduxBatchedActions.batchActions)([requestSuccess({ requestKey: requestKey }), (0, _matchDetails.receiveMatchDetailsSuccess)()]));
                dispatch((0, _matchDetails.processMatchDetails)({
                    data: _immutable2.default.fromJS(data)
                }));
            },
            error: function error(err) {
                console.log('action::fetchMatches::error', err);
                dispatch((0, _reduxBatchedActions.batchActions)([requestFailed({ requestKey: requestKey }), (0, _matchDetails.receiveMatchDetailsFailed)({ err: err })]));
            }
        });
    };
};

// complete: () => {
//     console.log('action::fetchMatches::complete');
// },
var fetchGuildById = exports.fetchGuildById = function fetchGuildById(_ref5) {
    var guildId = _ref5.guildId;


    return function (dispatch) {
        var requestKey = 'guild-' + guildId;

        // console.log('action::fetchGuildById:', requestKey);

        dispatch((0, _reduxBatchedActions.batchActions)([requestOpen({ requestKey: requestKey }), (0, _guilds.initializeGuild)({ guildId: guildId })]));

        _api2.default.getGuildById({
            guildId: guildId,
            success: function success(data) {
                // console.log('action::fetchGuildById::success', requestKey, data);

                dispatch((0, _reduxBatchedActions.batchActions)([requestSuccess({ requestKey: requestKey }), (0, _guilds.receiveGuild)({ guildId: guildId, data: data })]));
            },
            error: function error(err) {
                console.log('action::fetchGuildById::error', requestKey, err);

                dispatch((0, _reduxBatchedActions.batchActions)([requestFailed({ requestKey: requestKey }), (0, _guilds.receiveGuildFailed)({ guildId: guildId, err: err })]));
            }
        }); // complete: () => {
        //     console.log('action::fetchGuildById::complete');
        // },
        ;
    };
};

},{"./guilds":2,"./matchDetails":5,"./matches":6,"constants/actionTypes":45,"immutable":"immutable","lib/api":46,"redux-batched-actions":65}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveGuildFailed = exports.receiveGuild = exports.initializeGuild = undefined;

var _actionTypes = require('constants/actionTypes');

var initializeGuild = exports.initializeGuild = function initializeGuild(_ref) {
    var guildId = _ref.guildId;

    // console.log('action::receiveGuild', guildId);

    return {
        type: _actionTypes.INITIALIZE_GUILD,
        guildId: guildId
    };
}; // import _ from 'lodash';

var receiveGuild = exports.receiveGuild = function receiveGuild(_ref2) {
    var guildId = _ref2.guildId;
    var data = _ref2.data;

    // console.log('action::receiveGuild', guildId, data);
    //
    return {
        type: _actionTypes.RECEIVE_GUILD,
        guildId: guildId,
        name: data.guild_name,
        tag: data.tag
    };
};

var receiveGuildFailed = exports.receiveGuildFailed = function receiveGuildFailed(_ref3) {
    var guildId = _ref3.guildId;
    var err = _ref3.err;

    // console.log('action::receiveGuildFailed', guildId, err);

    return {
        type: _actionTypes.RECEIVE_GUILD_FAILED,
        guildId: guildId,
        err: err
    };
};

},{"constants/actionTypes":45}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLang = undefined;

var _actionTypes = require('constants/actionTypes');

var setLang = exports.setLang = function setLang(slug) {
    // console.log('action::setLang', slug);

    return {
        type: _actionTypes.SET_LANG,
        slug: slug
    };
};

},{"constants/actionTypes":45}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toggleEventType = exports.toggleObjectiveType = exports.toggleMap = undefined;

var _actionTypes = require('constants/actionTypes');

var toggleMap = exports.toggleMap = function toggleMap(_ref) {
    var mapId = _ref.mapId;

    return {
        type: _actionTypes.LOG_FILTERS_TOGGLE_MAP,
        mapId: mapId
    };
};

var toggleObjectiveType = exports.toggleObjectiveType = function toggleObjectiveType(_ref2) {
    var objectiveType = _ref2.objectiveType;

    return {
        type: _actionTypes.LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE,
        objectiveType: objectiveType
    };
};

var toggleEventType = exports.toggleEventType = function toggleEventType(_ref3) {
    var eventType = _ref3.eventType;

    return {
        type: _actionTypes.LOG_FILTERS_TOGGLE_EVENT_TYPE,
        eventType: eventType
    };
};

},{"constants/actionTypes":45}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveMatchDetailsFailed = exports.receiveMatchDetailsSuccess = exports.receiveMatchDetails = exports.processMatchDetails = exports.clearMatchDetails = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

var _api = require('actions/api');

var _objectives = require('actions/objectives');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as actions from 'actions/matchDetails';
var clearMatchDetails = exports.clearMatchDetails = function clearMatchDetails() {
    console.log('action::clearMatchDetails');

    return {
        type: _actionTypes.CLEAR_MATCHDETAILS
    };
};
// import { batchActions } from 'redux-batched-actions';

// import { worlds as STATIC_WORLDS } from 'lib/static';

var processMatchDetails = exports.processMatchDetails = function processMatchDetails(_ref) {
    var data = _ref.data;

    // console.log('action::processMatchDetails');

    var id = data.get('id');
    var region = data.get('region');
    var worlds = data.get('worlds');

    var maps = getMaps(data);
    var stats = getStats(data);
    var times = getTimes(data);
    // const worlds = getWorlds(data);

    var guildIds = getGuildIds(maps);
    var objectiveIds = getObjectiveIds(maps);

    // console.log('action::receiveMatchDetails', 'id', id);
    // console.log('action::receiveMatchDetails', 'region', region);
    // console.log('action::receiveMatchDetails', 'stats', stats.toJS());
    // console.log('action::receiveMatchDetails', 'times', times.toJS());
    // console.log('action::receiveMatchDetails', 'worlds', worlds);
    // console.log('action::receiveMatchDetails', 'maps', maps.toJS());
    // console.log('action::receiveMatchDetails', 'guildIds', guildIds.toJS());
    // console.log('action::receiveMatchDetails', 'objectiveIds', objectiveIds.toJS());

    return function (dispatch, getState) {
        dispatch(receiveMatchDetails({
            id: id,
            region: region,

            guildIds: guildIds,
            maps: maps,
            objectiveIds: objectiveIds,
            stats: stats,
            times: times,
            worlds: worlds
        }));

        dispatchGuildLookups(dispatch, getState().guilds, guildIds);
        dispatchObjectiveUpdates(dispatch, data.get('maps'));
    };

    // return {
    //     type: RECEIVE_MATCHDETAILS,

    //     id,
    //     region,

    //     guildIds,
    //     maps,
    //     objectiveIds,
    //     stats,
    //     times,
    //     worlds,
    // };
};

function dispatchGuildLookups(dispatch, stateGuilds, guildIds) {
    var knownGuilds = stateGuilds.keySeq().toSet();
    var unknownGuilds = guildIds.subtract(knownGuilds);

    unknownGuilds.forEach(function (guildId) {
        return dispatch((0, _api.fetchGuildById)({ guildId: guildId }));
    });
}

function dispatchObjectiveUpdates(dispatch, maps) {
    var objectives = _immutable2.default.Map();

    maps.forEach(function (m) {
        return m.get('objectives').forEach(function (objective) {
            objectives = objectives.setIn([objective.get('id')], objective);
        });
    });
    // maps.forEach(
    //     m => m.get('objectives').forEach(
    //         (objective) => dispatch(updateObjective({ objective }))
    //     )
    // );

    dispatch((0, _objectives.updateObjectives)({ objectives: objectives }));
}

var receiveMatchDetails = exports.receiveMatchDetails = function receiveMatchDetails(_ref2) {
    var id = _ref2.id;
    var region = _ref2.region;
    var guildIds = _ref2.guildIds;
    var maps = _ref2.maps;
    var objectiveIds = _ref2.objectiveIds;
    var stats = _ref2.stats;
    var times = _ref2.times;
    var worlds = _ref2.worlds;
    return {
        type: _actionTypes.RECEIVE_MATCHDETAILS,

        id: id,
        region: region,

        guildIds: guildIds,
        maps: maps,
        objectiveIds: objectiveIds,
        stats: stats,
        times: times,
        worlds: worlds
    };
};

var receiveMatchDetailsSuccess = exports.receiveMatchDetailsSuccess = function receiveMatchDetailsSuccess() {
    // console.log('action::receiveMatchDetailsSuccess');

    return {
        type: _actionTypes.RECEIVE_MATCHDETAILS_SUCCESS
    };
};

var receiveMatchDetailsFailed = exports.receiveMatchDetailsFailed = function receiveMatchDetailsFailed(_ref3) {
    var err = _ref3.err;

    console.log('action::receiveMatchDetailsFailed', err);

    return {
        type: _actionTypes.RECEIVE_MATCHDETAILS_FAILED,
        err: err
    };
};

function getMaps(node) {
    var maps = node.get('maps')
    // .map(
    //     m => m.set('stats', getStats(m))
    //         .delete('deaths')
    //         .delete('holdings')
    //         .delete('kills')
    //         .delete('scores')
    //         .delete('ticks')
    //         .set('guilds', getMapGuilds(m))
    //         .update('objectives', os => os.map(o => o.get('id')).toOrderedSet())
    // );
    .map(function (m) {
        return _immutable2.default.Map({
            id: m.get('id'),
            type: m.get('type'),
            lastmod: m.get('lastmod'),
            stats: getStats(m),
            guilds: getMapGuildIds(m),
            objectives: getMapObjectiveIds(m)
        });
    });

    return maps;
}

function getGuildIds(mapNodes) {
    var guilds = mapNodes.map(function (m) {
        return m.get('guilds');
    }).flatten().toOrderedSet();

    return guilds;
}

function getMapGuildIds(mapNode) {
    var mapGuilds = mapNode.get('objectives').map(function (o) {
        return o.get('guild');
    }).flatten().filterNot(function (g) {
        return g === null;
    }).toOrderedSet();

    return mapGuilds;
}

function getObjectiveIds(mapNodes) {
    var objectives = mapNodes.map(function (m) {
        return m.get('objectives');
    }).flatten().toOrderedSet();

    return objectives;
}

function getMapObjectiveIds(mapNode) {
    return mapNode.get('objectives').map(function (o) {
        return o.get('id');
    }).toOrderedSet();
}

function getStats(node) {
    return _immutable2.default.Map({
        deaths: node.get('deaths'),
        kills: node.get('kills'),
        holdings: node.get('holdings'),
        scores: node.get('scores'),
        ticks: node.get('ticks')
    });
}

function getTimes(detailsNode) {
    return _immutable2.default.Map({
        lastmod: detailsNode.get('lastmod'),
        endTime: detailsNode.get('startTime'),
        startTime: detailsNode.get('endTime')
    });
}

// function getWorlds(detailsNode) {
//     return detailsNode
//         .get('worlds')
//         .map(worldId => Immutable.fromJS(STATIC_WORLDS[worldId]));
// }

},{"actions/api":1,"actions/objectives":8,"constants/actionTypes":45,"immutable":"immutable"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveMatchesFailed = exports.receiveMatchesSuccess = exports.receiveMatches = undefined;
exports.getMatchesLastmod = getMatchesLastmod;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var receiveMatches = exports.receiveMatches = function receiveMatches(_ref) {
    var data = _ref.data;
    var lastUpdated = _ref.lastUpdated;

    // console.log('action::receiveMatches', data);

    return {
        type: _actionTypes.RECEIVE_MATCHES,
        data: data,
        lastUpdated: lastUpdated
    };
};

var receiveMatchesSuccess = exports.receiveMatchesSuccess = function receiveMatchesSuccess() {
    // console.log('action::receiveMatchesFailed', err);

    return {
        type: _actionTypes.RECEIVE_MATCHES_SUCCESS
    };
};

var receiveMatchesFailed = exports.receiveMatchesFailed = function receiveMatchesFailed(_ref2) {
    var err = _ref2.err;

    // console.log('action::receiveMatchesFailed', err);

    return {
        type: _actionTypes.RECEIVE_MATCHES_FAILED,
        err: err
    };
};

function getMatchesLastmod(matchesData) {
    return _lodash2.default.reduce(matchesData, function (acc, match) {
        return Math.max(match.lastmod);
    }, 0);
}

},{"constants/actionTypes":45,"lodash":"lodash"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setNow = undefined;

var _actionTypes = require('constants/actionTypes');

var setNow = exports.setNow = function setNow() {
    // console.log('action::setNow');

    return {
        type: _actionTypes.SET_NOW
    };
};

},{"constants/actionTypes":45}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateObjective = exports.updateObjectives = exports.resetObjectives = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetObjectives = exports.resetObjectives = function resetObjectives() {
    // console.log('action::resetObjectives');

    return {
        type: _actionTypes.OBJECTIVES_RESET
    };
};

var updateObjectives = exports.updateObjectives = function updateObjectives(_ref) {
    var objectives = _ref.objectives;

    // console.log('action::updateObjectives', objectives.toJS());

    objectives = objectives.map(function (objective) {
        return objective.update('lastFlipped', function (v) {
            return _moment2.default.unix(v);
        }).update('lastClaimed', function (v) {
            return _moment2.default.unix(v);
        }).update('lastmod', function (v) {
            return _moment2.default.unix(v);
        }).update(function (v) {
            return v.set('expires', v.get('lastFlipped').add(5, 'm'));
        });
    });
    //
    return {
        type: _actionTypes.OBJECTIVES_UPDATE,
        objectives: objectives
    };
};

var updateObjective = exports.updateObjective = function updateObjective(_ref2) {
    var objective = _ref2.objective;

    // console.log('action::updateObjective', objective.toJS());

    // objective = objective.set('expires', objective.get('lastFlipped') + (5 * 60 * 1000));
    // objective = objective
    //     .update('lastFlipped', v => moment(v * 1000))
    //     .update('lastClaimed', v => moment(v * 1000))
    //     .update('lastmod', v => moment(v * 1000));
    //
    return {
        type: _actionTypes.OBJECTIVE_UPDATE,
        objective: objective
    };
};

},{"constants/actionTypes":45,"moment":"moment"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setRoute = undefined;

var _actionTypes = require('constants/actionTypes');

var setRoute = exports.setRoute = function setRoute(ctx) {
    return {
        type: _actionTypes.SET_ROUTE,
        path: ctx.path,
        params: ctx.params
    };
};

},{"constants/actionTypes":45}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeTimeout = exports.clearAllTimeouts = exports.clearAppTimeout = exports.saveTimeout = exports.setAppTimeout = undefined;

var _actionTypes = require('constants/actionTypes');

var setAppTimeout = exports.setAppTimeout = function setAppTimeout(_ref) {
    var name = _ref.name;
    var cb = _ref.cb;
    var timeout = _ref.timeout;

    timeout = typeof timeout === 'function' ? timeout() : timeout;

    // console.log('action::setAppTimeout', name, timeout);

    return function (dispatch) {
        dispatch(clearAppTimeout({ name: name }));

        var ref = setTimeout(cb, timeout);

        dispatch(saveTimeout({
            name: name,
            ref: ref
        }));
    };
};

var saveTimeout = exports.saveTimeout = function saveTimeout(_ref2) {
    var name = _ref2.name;
    var ref = _ref2.ref;

    return {
        type: _actionTypes.ADD_TIMEOUT,
        name: name,
        ref: ref
    };
};

var clearAppTimeout = exports.clearAppTimeout = function clearAppTimeout(_ref3) {
    var name = _ref3.name;


    return function (dispatch, getState) {
        var _getState = getState();

        var timeouts = _getState.timeouts;

        // console.log('action::clearAppTimeout', name, timeouts[name]);

        clearTimeout(timeouts[name]);

        dispatch(removeTimeout({ name: name }));
    };
};

var clearAllTimeouts = exports.clearAllTimeouts = function clearAllTimeouts() {
    // console.log('action::clearAllTimeouts');

    return function (dispatch, getState) {
        var _getState2 = getState();

        var timeouts = _getState2.timeouts;

        // console.log('action::clearAllTimeouts', getState().timeouts);

        _.forEach(timeouts, function (t, name) {
            dispatch(clearAppTimeout({ name: name }));
        });

        // console.log('action::clearAllTimeouts', getState().timeouts);
    };
};

var removeTimeout = exports.removeTimeout = function removeTimeout(_ref4) {
    var name = _ref4.name;

    // console.log('action::removeTimeout', name);

    return {
        type: _actionTypes.REMOVE_TIMEOUT,
        name: name
    };
};

},{"constants/actionTypes":45}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clearWorld = exports.setWorld = undefined;

var _actionTypes = require('constants/actionTypes');

var setWorld = exports.setWorld = function setWorld(langSlug, worldSlug) {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: _actionTypes.SET_WORLD,
        langSlug: langSlug,
        worldSlug: worldSlug
    };
};

var clearWorld = exports.clearWorld = function clearWorld() {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: _actionTypes.CLEAR_WORLD
    };
};

},{"constants/actionTypes":45}],12:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxBatchedActions = require('redux-batched-actions');

var _reactAddonsPerf = require('react-addons-perf');

var _reactAddonsPerf2 = _interopRequireDefault(_reactAddonsPerf);

var _Perf = require('components/util/Perf');

var _Perf2 = _interopRequireDefault(_Perf);

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _page = require('page');

var _page2 = _interopRequireDefault(_page);

var _Container = require('components/Layout/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Overview = require('components/Overview');

var _Overview2 = _interopRequireDefault(_Overview);

var _Tracker = require('components/Tracker');

var _Tracker2 = _interopRequireDefault(_Tracker);

var _reducers = require('reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _route = require('actions/route');

var _lang = require('actions/lang');

var _world = require('actions/world');

var _objectives = require('actions/objectives');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
*   Create Redux Store
*
*/

var store = (0, _redux.createStore)((0, _reduxBatchedActions.enableBatching)(_reducers2.default), (0, _redux.applyMiddleware)(_reduxThunk2.default));

/*
*
*   Start App
*
*/

(0, _domready2.default)(function () {
    console.clear();
    console.log('Starting Application');

    // Perf.start();
    // console.log('Perf started');

    console.log('process.env.NODE_ENV', "development");

    attachPageMiddleware();
    attachPageRoutes();

    _page2.default.start({
        click: true,
        popstate: false,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true
    });
});

function render(App) {

    // console.log('render()');
    _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
            _Container2.default,
            null,
            App
        )
    ), document.getElementById('react-app'));
}

function attachPageMiddleware() {
    (0, _page2.default)(function (ctx, next) {
        console.info('route => ' + ctx.path);

        // attach store to the router context
        ctx.store = store;
        ctx.store.dispatch((0, _route.setRoute)(ctx));

        next();
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', function (ctx, next) {
        var _ctx$params = ctx.params;
        var langSlug = _ctx$params.langSlug;
        var worldSlug = _ctx$params.worldSlug;


        ctx.store.dispatch((0, _lang.setLang)(langSlug));

        if (worldSlug) {
            ctx.store.dispatch((0, _objectives.resetObjectives)());
            ctx.store.dispatch((0, _world.setWorld)(langSlug, worldSlug));
        } else {
            ctx.store.dispatch((0, _world.clearWorld)());
        }

        next();
    });
}

function attachPageRoutes() {
    (0, _page2.default)('/', '/en');

    (0, _page2.default)('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', function (ctx) {
        // const { langSlug, worldSlug } = ctx.params;

        // ctx.store.dispatch(setLang(langSlug));
        // ctx.store.dispatch(setWorld(langSlug, worldSlug));

        var _ctx$store$getState = ctx.store.getState();

        var lang = _ctx$store$getState.lang;
        var world = _ctx$store$getState.world;


        render(_react2.default.createElement(_Tracker2.default, null));
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)', function (ctx) {
        // const { langSlug } = ctx.params;

        // ctx.store.dispatch(setLang(langSlug));
        // ctx.store.dispatch(clearWorld());

        render(_react2.default.createElement(_Overview2.default, null));
    });
}

},{"actions/lang":3,"actions/objectives":8,"actions/route":9,"actions/world":11,"components/Layout/Container":13,"components/Overview":23,"components/Tracker":36,"components/util/Perf":44,"domready":"domready","page":"page","react":"react","react-addons-perf":"react-addons-perf","react-dom":"react-dom","react-redux":"react-redux","reducers":52,"redux":"redux","redux-batched-actions":65,"redux-thunk":66}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Langs = require('components/Layout/Langs');

var _Langs2 = _interopRequireDefault(_Langs);

var _NavbarHeader = require('components/Layout/NavbarHeader');

var _NavbarHeader2 = _interopRequireDefault(_NavbarHeader);

var _Footer = require('components/Layout/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapStateToProps = function mapStateToProps(state) {
    return {
        lang: state.lang,
        world: state.world
    };
};

function isEqualByPick(currentProps, nextProps, keys) {
    return _lodash2.default.isEqual(_lodash2.default.pick(currentProps, keys), _lodash2.default.pick(nextProps, keys));

    // return _.reduce(keys, (a, key) => {
    //     return a || !_.isEqual(currentProps[key], nextProps[key]);
    // }, false);
}

var Container = function (_React$Component) {
    _inherits(Container, _React$Component);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Container).apply(this, arguments));
    }

    _createClass(Container, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var shouldUpdate = !isEqualByPick(this.props, nextProps, ['world', 'children']) || !this.props.lang.equals(nextProps.lang);
            // console.log(`Container::componentShouldUpdate()`, shouldUpdate);

            // console.log('lang', _.isEqual(this.props.lang, nextProps.lang), nextProps.lang);
            // console.log('world', _.isEqual(this.props.world, nextProps.world), nextProps.world);

            return shouldUpdate;
        }
    }, {
        key: 'render',


        // componentWillMount() {
        //     console.log(`Container::componentWillMount()`);
        // };

        // componentDidUpdate() {
        //     console.log(`Container::componentDidUpdate()`);
        // };

        // componentWillUnmount() {
        //     console.log(`Container::componentWillUnmount()`);
        // };

        value: function render() {
            var children = this.props.children;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'nav',
                    { className: 'navbar navbar-default' },
                    _react2.default.createElement(
                        'div',
                        { className: 'container' },
                        _react2.default.createElement(_NavbarHeader2.default, null),
                        _react2.default.createElement(_Langs2.default, null)
                    )
                ),
                _react2.default.createElement(
                    'section',
                    { id: 'content', className: 'container' },
                    children
                ),
                _react2.default.createElement(_Footer2.default, { obsfuEmail: {
                        chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
                        pattern: '03142'
                    } })
            );
        }
    }]);

    return Container;
}(_react2.default.Component);

Container.propTypes = {
    children: _react2.default.PropTypes.node.isRequired,
    lang: _reactImmutableProptypes2.default.map.isRequired,
    world: _react2.default.PropTypes.object
};


Container = (0, _reactRedux.connect)(mapStateToProps)(Container);

exports.default = Container;

},{"components/Layout/Footer":14,"components/Layout/Langs":16,"components/Layout/NavbarHeader":17,"lodash":"lodash","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var obsfuEmail = _ref.obsfuEmail;
    return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-xs-24' },
                _react2.default.createElement(
                    'footer',
                    { className: 'small muted text-center' },
                    _react2.default.createElement('hr', null),
                    _react2.default.createElement(
                        'p',
                        null,
                        '© 2013 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars:Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.'
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        'Please send comments and bugs to ',
                        _react2.default.createElement(ObsfuEmail, { obsfuEmail: obsfuEmail })
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        'Supporting microservices:',
                        _react2.default.createElement(
                            'a',
                            { href: 'http://guilds.gw2w2w.com/' },
                            'guilds.gw2w2w.com'
                        ),
                        ' – ',
                        _react2.default.createElement(
                            'a',
                            { href: 'http://state.gw2w2w.com/' },
                            'state.gw2w2w.com'
                        ),
                        ' – ',
                        _react2.default.createElement(
                            'a',
                            { href: 'http://www.piely.net/' },
                            'www.piely.net'
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        'Source available at ',
                        _react2.default.createElement(
                            'a',
                            { href: 'https://github.com/fooey/gw2w2w-react' },
                            'https://github.com/fooey/gw2w2w-react'
                        )
                    )
                )
            )
        )
    );
};

var ObsfuEmail = function ObsfuEmail(_ref2) {
    var obsfuEmail = _ref2.obsfuEmail;

    var reconstructed = obsfuEmail.pattern.split('').map(function (ixChunk) {
        return obsfuEmail.chunks[ixChunk];
    }).join('');

    return _react2.default.createElement(
        'a',
        { href: 'mailto:' + reconstructed },
        reconstructed
    );
};

},{"react":"react"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
*   Redux Helpers
*
*/

var activeLangSelector = function activeLangSelector(state) {
    return state.lang;
};
var langSelector = function langSelector(state, props) {
    return props.lang;
};
var worldSelector = function worldSelector(state) {
    return state.world;
};
var worldDataSelector = (0, _reselect.createSelector)(activeLangSelector, langSelector, worldSelector, function (activeLang, lang, world) {
    return {
        activeLang: activeLang,
        world: world ? _static.worlds[world.id][lang.slug] : null
    };
});

// const mapStateToProps = (state, props) => {
//     // console.log('lang', state.lang);
//     return {
//         activeLang: state.lang,
//         // activeWorld: state.world,
//         world: state.world ? worlds[state.world.id][props.lang.slug] : null,
//     };
// };

var Lang = function Lang(_ref) {
    var activeLang = _ref.activeLang;
    var
    // activeWorld,
    lang = _ref.lang;
    var world = _ref.world;
    return _react2.default.createElement(
        'li',
        {
            className: (0, _classnames2.default)({
                active: activeLang.get('label') === lang.label
            }),
            title: lang.name
        },
        _react2.default.createElement(
            'a',
            { href: getLink(lang, world) },
            lang.label
        )
    );
};
Lang.propTypes = {
    activeLang: _reactImmutableProptypes2.default.map.isRequired,
    activeWorld: _react2.default.PropTypes.object,
    lang: _react2.default.PropTypes.object.isRequired
};
Lang = (0, _reactRedux.connect)(worldDataSelector)(
// mapDispatchToProps
Lang);

function getLink(lang, world) {
    return world ? world.link : lang.link;
}

exports.default = Lang;

},{"classnames":"classnames","lib/static":48,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _static = require('lib/static');

var _LangLink = require('./LangLink');

var _LangLink2 = _interopRequireDefault(_LangLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Langs = function Langs() {
    return _react2.default.createElement(
        'div',
        { id: 'nav-langs', className: 'pull-right' },
        _react2.default.createElement(
            'ul',
            { className: 'nav navbar-nav' },
            _.map(_static.langs, function (lang, key) {
                return _react2.default.createElement(_LangLink2.default, { key: key, lang: lang });
            })
        )
    );
};

exports.default = Langs;

},{"./LangLink":15,"lib/static":48,"react":"react"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
*   Redux Helpers
*
*/
;
var langSelector = function langSelector(state) {
    return state.lang;
};
var apiSelector = function apiSelector(state) {
    return state.api;
};
var apiPendingSelector = (0, _reselect.createSelector)(apiSelector, function (api) {
    return api.get('pending');
});
var hasPendingSelector = (0, _reselect.createSelector)(apiPendingSelector, function (pending) {
    return !pending.isEmpty();
});

var mapStateToProps = (0, _reselect.createSelector)(langSelector, hasPendingSelector, function (lang, hasPendingRequests) {
    return {
        lang: lang,
        hasPendingRequests: hasPendingRequests
    };
});
// const mapStateToProps = (state) => {
//     return {
//         lang: state.lang,
//         hasPendingRequests: !state.api.get('pending').isEmpty(),
//     };
// };

var NavbarHeader = function NavbarHeader(_ref) {
    var lang = _ref.lang;
    var hasPendingRequests = _ref.hasPendingRequests;
    return _react2.default.createElement(
        'div',
        { className: 'navbar-header' },
        _react2.default.createElement(
            'a',
            { className: 'navbar-brand', href: '/' + lang.get('slug') },
            _react2.default.createElement('img', { src: '/img/logo/logo-96x36.png' })
        ),
        _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)({
                    'navbar-spinner': true,
                    active: hasPendingRequests
                }) },
            _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
        )
    );
};

NavbarHeader.propTypes = {
    lang: _reactImmutableProptypes2.default.map.isRequired,
    hasPendingRequests: _react2.default.PropTypes.bool.isRequired
};

NavbarHeader = (0, _reactRedux.connect)(mapStateToProps)(NavbarHeader);

exports.default = NavbarHeader;

},{"classnames":"classnames","immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _MatchWorld = require('./MatchWorld');

var _MatchWorld2 = _interopRequireDefault(_MatchWorld);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WORLD_COLORS = ['red', 'blue', 'green'];

/*
*
*   Redux Helpers
*
*/

// const mapToProps = (state, props) => {
//     return {
//         lang: state.lang,
//         // match: state.matches.getIn(['data', props.matchId]),
//         match: (Immutable.Map.isMap(state.matches))
//             ? state.matches.getIn(['data', props.matchId])
//             : Immutable.Map({  }),
//     };
// };

var langSelector = function langSelector(state) {
    return state.lang;
};
var matchSelector = function matchSelector(state, props) {
    return props.match;
};

// const matchSelector = createSelector(
//     matchIdSelector,
//     matchesSelector,
//     (matchId, matches) => matches.get(matchId)
// );

var mapToProps = (0, _reselect.createSelector)(langSelector, matchSelector, function (lang, match) {
    return { lang: lang, match: match };
});

var Match = function (_React$Component) {
    _inherits(Match, _React$Component);

    function Match() {
        _classCallCheck(this, Match);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Match).apply(this, arguments));
    }

    _createClass(Match, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.isNewMatchData(nextProps) || this.isNewLang(nextProps);
        }
    }, {
        key: 'isNewMatchData',
        value: function isNewMatchData(nextProps) {
            return !this.props.match.equals(nextProps.match);
        }
    }, {
        key: 'isNewLang',
        value: function isNewLang(nextProps) {
            return !this.props.lang.equals(nextProps.lang);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var lang = _props.lang;
            var match = _props.match;
            // console.log('match', match.get('id'), match.toJS());

            return _react2.default.createElement(
                'div',
                { className: 'matchContainer' },
                _react2.default.createElement(
                    'table',
                    { className: 'match' },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _lodash2.default.map(WORLD_COLORS, function (color) {
                            var worldId = match.getIn(['worlds', color]);

                            return _react2.default.createElement(_MatchWorld2.default, {
                                component: 'tr',
                                key: worldId,

                                color: color,
                                match: match,
                                showPie: color === 'red',
                                worldId: worldId
                            });
                        })
                    )
                )
            );
        }
    }]);

    return Match;
}(_react2.default.Component);

Match.propTypes = {
    lang: _reactImmutableProptypes2.default.map.isRequired,
    match: _reactImmutableProptypes2.default.map.isRequired
};


Match = (0, _reactRedux.connect)(mapToProps)(Match);

exports.default = Match;

},{"./MatchWorld":20,"immutable":"immutable","lib/static":48,"lodash":"lodash","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Pie = require('components/common/Icons/Pie');

var _Pie2 = _interopRequireDefault(_Pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*
*   Redux Helpers
*
*/
// const mapStateToProps = (state, props) => {
//     return {
//         matchId: props.matchId,
//         scores: (Immutable.Map.isMap(state.matches))
//             ? state.matches.getIn(['data', props.matchId, 'scores'])
//             : Immutable.Map({ red: 0, blue: 0, green: 0 }),
//     };
// };

var matchIdSelector = function matchIdSelector(state, props) {
    return props.matchId;
};
var scoresSelector = function scoresSelector(state, props) {
    return _immutable2.default.Map.isMap(state.matches) ? state.matches.getIn(['data', props.matchId, 'scores']) : _immutable2.default.Map({ red: 0, blue: 0, green: 0 });
};

var mapSelectorsToProps = (0, _reselect.createSelector)(scoresSelector, matchIdSelector, function (scores, matchId) {
    return {
        scores: scores,
        matchId: matchId
    };
});

var MatchPie = function (_React$Component) {
    _inherits(MatchPie, _React$Component);

    function MatchPie() {
        _classCallCheck(this, MatchPie);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MatchPie).apply(this, arguments));
    }

    _createClass(MatchPie, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !this.props.scores.equals(nextProps.scores);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var scores = _props.scores;
            var matchId = _props.matchId;

            // console.log(matchId, scores.toJS());

            return _react2.default.createElement(_Pie2.default, { scores: scores.toJS(), size: 60 });
        }
    }]);

    return MatchPie;
}(_react2.default.Component);

MatchPie.propTypes = {
    scores: _reactImmutableProptypes2.default.map.isRequired,
    matchId: _react2.default.PropTypes.string.isRequired
};
;

MatchPie = (0, _reactRedux.connect)(mapSelectorsToProps)(MatchPie);

exports.default = MatchPie;

},{"components/common/Icons/Pie":40,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _static = require('lib/static');

var _MatchPie = require('./MatchPie');

var _MatchPie2 = _interopRequireDefault(_MatchPie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*
*   Redux Helpers
*
*/

var colorSelector = function colorSelector(state, props) {
    return props.color;
};
var langSelector = function langSelector(state) {
    return state.lang;
};
var matchSelector = function matchSelector(state, props) {
    return props.match;
};
var showPieSelector = function showPieSelector(state, props) {
    return props.showPie;
};
var worldIdSelector = function worldIdSelector(state, props) {
    return props.worldId;
};

var worldSelector = (0, _reselect.createSelector)(langSelector, worldIdSelector, function (lang, worldId) {
    return _static.worlds[worldId][lang.get('slug')];
});
var scoresSelector = (0, _reselect.createSelector)(matchSelector, function (match) {
    return match.get('scores');
});
var scoreSelector = (0, _reselect.createSelector)(colorSelector, scoresSelector, function (color, scores) {
    return scores.get(color);
});

var mapSelectorsToProps = (0, _reselect.createSelector)(colorSelector, langSelector, matchSelector, scoreSelector, showPieSelector, worldSelector, function (color, lang, match, score, showPie, world) {
    return {
        color: color,
        lang: lang,
        match: match,
        score: score,
        showPie: showPie,
        world: world
    };
});

var MatchWorld = function (_React$Component) {
    _inherits(MatchWorld, _React$Component);

    function MatchWorld() {
        _classCallCheck(this, MatchWorld);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MatchWorld).apply(this, arguments));
    }

    _createClass(MatchWorld, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.props.score !== nextProps.score || !this.props.lang.equals(nextProps.lang);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var color = _props.color;
            var match = _props.match;
            var score = _props.score;
            var showPie = _props.showPie;
            var world = _props.world;

            // console.log(world, score);

            return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                    'td',
                    { className: 'team name ' + color },
                    _react2.default.createElement(
                        'a',
                        { href: world.link },
                        world.name
                    )
                ),
                _react2.default.createElement(
                    'td',
                    { className: 'team score ' + color },
                    score ? (0, _numeral2.default)(score).format('0,0') : null
                ),
                showPie ? _react2.default.createElement(
                    'td',
                    { className: 'pie', rowSpan: '3' },
                    _react2.default.createElement(_MatchPie2.default, { matchId: match.get('id'), size: 60 })
                ) : null
            );
        }
    }]);

    return MatchWorld;
}(_react2.default.Component);

MatchWorld.propTypes = {
    color: _react2.default.PropTypes.string.isRequired,
    lang: _reactImmutableProptypes2.default.map.isRequired,
    match: _reactImmutableProptypes2.default.map.isRequired,
    score: _react2.default.PropTypes.number.isRequired,
    showPie: _react2.default.PropTypes.bool.isRequired,
    world: _react2.default.PropTypes.object.isRequired
};
;

MatchWorld = (0, _reactRedux.connect)(mapSelectorsToProps)(MatchWorld);

exports.default = MatchWorld;

},{"./MatchPie":19,"lib/static":48,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Match = require('./Match');

var _Match2 = _interopRequireDefault(_Match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var loadingHtml = _react2.default.createElement(
    'span',
    { style: { paddingLeft: '.5em' } },
    _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

/*
*
*   Redux Helpers
*
*/

var regionSelector = function regionSelector(state, props) {
    return props.region;
};
var matchesSelector = function matchesSelector(state) {
    return _immutable2.default.Map.isMap(state.matches) && state.matches.has('data') ? state.matches.get('data') : _immutable2.default.Map();
};

var regionMatchesSelector = (0, _reselect.createSelector)(regionSelector, matchesSelector, function (region, matches) {
    return matches.filter(function (match) {
        return region.id === match.get('region');
    });
});

var mapStateToProps = (0, _reselect.createSelector)(regionMatchesSelector, regionSelector, function (matches, region) {
    return {
        matches: matches,
        region: region
    };
});

// const mapStateToProps = (state, props) => {
//     return {
//         matchIds: _.filter(
//             state.matches.ids,
//             id => props.region.id === id.charAt(0)
//         ),
//     };
// };

var Matches = function (_React$Component) {
    _inherits(Matches, _React$Component);

    function Matches() {
        _classCallCheck(this, Matches);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Matches).apply(this, arguments));
    }

    _createClass(Matches, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var shouldUpdate = !this.props.matches.equals(nextProps.matches);

            // console.log('Overview::Matches::shouldUpdate', shouldUpdate);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var matches = _props.matches;
            var region = _props.region;


            return _react2.default.createElement(
                'div',
                { className: 'RegionMatches' },
                _react2.default.createElement(
                    'h2',
                    null,
                    region.label,
                    ' Matches',
                    matches.isEmpty() ? loadingHtml : null
                ),
                matches.map(function (match, matchId) {
                    return _react2.default.createElement(_Match2.default, { key: matchId, match: match });
                })
            );
        }
    }]);

    return Matches;
}(_react2.default.Component);

Matches.propTypes = {
    matches: _reactImmutableProptypes2.default.map.isRequired,
    region: _react2.default.PropTypes.object.isRequired
};
;
Matches = (0, _reactRedux.connect)(mapStateToProps)(Matches);

exports.default = Matches;

},{"./Match":18,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WORLDS_IMMUT = _immutable2.default.fromJS(_static.worlds);

/*
*
*   Redux Helpers
*
*/

var langSelector = function langSelector(state) {
    return state.lang;
};
var regionSelector = function regionSelector(state, props) {
    return props.region;
};
var worldsSelector = function worldsSelector() {
    return WORLDS_IMMUT;
};

var regionWorldsSelector = (0, _reselect.createSelector)(langSelector, regionSelector, worldsSelector, function (lang, region, worlds) {

    return worlds.filter(function (world) {
        return world.get('region') === region.id;
    }).map(function (world) {
        return world.get(lang.get('slug'));
    }).sortBy(function (world) {
        return world.get('name');
    });
});

var mapStateToProps = (0, _reselect.createSelector)(langSelector, regionSelector, regionWorldsSelector, function (lang, region, regionWorlds) {
    return {
        lang: lang,
        region: region,
        regionWorlds: regionWorlds
    };
});

// const mapStateToProps = (state, props) => ({
//     lang: state.lang,
//     region: props.region,
// });

var Worlds = function (_React$Component) {
    _inherits(Worlds, _React$Component);

    function Worlds() {
        _classCallCheck(this, Worlds);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Worlds).apply(this, arguments));
    }

    _createClass(Worlds, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !this.props.lang.equals(nextProps.lang);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var region = _props.region;
            var regionWorlds = _props.regionWorlds;


            return _react2.default.createElement(
                'div',
                { className: 'RegionWorlds' },
                _react2.default.createElement(
                    'h2',
                    null,
                    region.label,
                    ' Worlds'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'list-unstyled' },
                    regionWorlds.map(function (world) {
                        return _react2.default.createElement(
                            'li',
                            { key: world.get('slug') },
                            _react2.default.createElement(
                                'a',
                                { href: world.get('link') },
                                world.get('name')
                            )
                        );
                    })
                )
            );
        }
    }]);

    return Worlds;
}(_react2.default.Component);

Worlds.propTypes = {
    lang: _reactImmutableProptypes2.default.map.isRequired,
    region: _react2.default.PropTypes.object.isRequired,
    regionWorlds: _reactImmutableProptypes2.default.map.isRequired
};
;

Worlds = (0, _reactRedux.connect)(mapStateToProps)(Worlds);

exports.default = Worlds;

},{"immutable":"immutable","lib/static":48,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _api = require('actions/api');

var apiActions = _interopRequireWildcard(_api);

var _timeouts = require('actions/timeouts');

var timeoutActions = _interopRequireWildcard(_timeouts);

var _Matches = require('./Matches');

var _Matches2 = _interopRequireDefault(_Matches);

var _Worlds = require('./Worlds');

var _Worlds2 = _interopRequireDefault(_Worlds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/*
*
*   Dependencies
*
*/

/*
*   Redux Actions
*/

/*
*   React Components
*/

/*
*
*   Component Globals
*
*/

var REGIONS = {
    1: { label: 'NA', id: '1' },
    2: { label: 'EU', id: '2' }
};

var REFRESH_TIMEOUT = _.random(4 * 1000, 8 * 1000);

/*
*
*   Redux Helpers
*
*/

var apiSelector = function apiSelector(state) {
    return state.api;
};
var langSelector = function langSelector(state) {
    return state.lang;
};
var matchesSelector = function matchesSelector(state) {
    return state.matches;
};

var dataErrorSelector = (0, _reselect.createSelector)(matchesSelector, function (matches) {
    return matches.get('error');
});
var matchesDataSelector = (0, _reselect.createSelector)(matchesSelector, function (matches) {
    return matches.get('data');
});
var matchesLastUpdatedSelector = (0, _reselect.createSelector)(matchesSelector, function (matches) {
    return matches.get('lastUpdated');
});
var matchesIsFetchingSelector = (0, _reselect.createSelector)(apiSelector, function (api) {
    return api.get('pending').includes('matches');
});

var mapStateToProps = (0, _reselect.createSelector)(langSelector, dataErrorSelector, matchesDataSelector, matchesLastUpdatedSelector, matchesIsFetchingSelector, function (lang, dataError, matchesData, matchesLastUpdated, matchesIsFetching) {
    return {
        lang: lang,
        matchesData: matchesData,
        dataError: dataError,
        matchesLastUpdated: matchesLastUpdated,
        matchesIsFetching: matchesIsFetching
    };
});

// const mapStateToProps = (state) => {

//     // console.log('state', state.timeouts);

//     return {
//         lang: state.lang,
//         matchesData: state.matches.data,
//         matchesLastUpdated: state.matches.lastUpdated,
//         matchesIsFetching: _.includes(state.api.pending, 'matches'),
//         // timeouts: state.timeouts,
//     };
// };

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        fetchMatches: function fetchMatches() {
            return dispatch(apiActions.fetchMatches());
        },
        setAppTimeout: function setAppTimeout(_ref) {
            var name = _ref.name;
            var cb = _ref.cb;
            var timeout = _ref.timeout;
            return dispatch(timeoutActions.setAppTimeout({ name: name, cb: cb, timeout: timeout }));
        },
        clearAppTimeout: function clearAppTimeout(_ref2) {
            var name = _ref2.name;
            return dispatch(timeoutActions.clearAppTimeout({ name: name }));
        }
    };
};

/*
*
*   Component Definition
*
*/

var // clearAllTimeouts: () => dispatch(timeoutActions.clearAllTimeouts()),
Overview = function (_React$Component) {
    _inherits(Overview, _React$Component);

    function Overview(props) {
        _classCallCheck(this, Overview);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Overview).call(this, props));
    }

    _createClass(Overview, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps /*, nextState*/) {
            var shouldUpdate = this.props.matchesLastUpdated !== nextProps.matchesLastUpdated || this.props.matchesIsFetching !== nextProps.matchesIsFetching || this.props.dataError !== nextProps.dataError || !this.props.matchesData.equals(nextProps.matchesData) || !this.props.lang.equals(nextProps.lang);

            // console.log(`Overview::shouldUpdate`, shouldUpdate, this.props, nextProps);

            // console.log(`Overview::shouldUpdate`, shouldUpdate);
            // console.log(`Overview::isNewMatchesData`, this.isNewMatchesData(nextProps));
            // console.log(`Overview::isNewLang`, this.isNewLang(nextProps));

            return shouldUpdate;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // console.log(`Overview::componentWillMount()`);

            setPageTitle(this.props.lang);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log(`Overview::componentDidMount()`);

            this.props.fetchMatches();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // console.log(`Overview::componentWillReceiveProps()`);

            var _props = this.props;
            var lang = _props.lang;
            var matchesIsFetching = _props.matchesIsFetching;
            var fetchMatches = _props.fetchMatches;
            var setAppTimeout = _props.setAppTimeout;


            if (lang.name !== nextProps.lang.name) {
                setPageTitle(nextProps.lang);
            }

            if (matchesIsFetching && !nextProps.matchesIsFetching) {
                setAppTimeout({
                    name: 'fetchMatches',
                    cb: function cb() {
                        return fetchMatches();
                    },
                    timeout: function timeout() {
                        return REFRESH_TIMEOUT;
                    }
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.log(`Overview::componentWillUnmount()`);

            this.props.clearAppTimeout({ name: 'fetchMatches' });
        }
    }, {
        key: 'render',
        value: function render() {
            var dataError = this.props.dataError;


            return _react2.default.createElement(
                'div',
                { id: 'overview' },
                dataError ? _react2.default.createElement(
                    'pre',
                    { className: 'alert alert-danger' },
                    dataError.toString()
                ) : null,
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _.map(REGIONS, function (region) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'col-sm-12', key: region.id },
                            _react2.default.createElement(_Matches2.default, { region: region })
                        );
                    })
                ),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _.map(REGIONS, function (region) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'col-sm-12', key: region.id },
                            _react2.default.createElement(_Worlds2.default, { region: region })
                        );
                    })
                )
            );
        }
    }]);

    return Overview;
}(_react2.default.Component);

Overview.propTypes = {
    lang: _reactImmutableProptypes2.default.map.isRequired,
    dataError: _react2.default.PropTypes.string,
    matchesData: _reactImmutableProptypes2.default.map.isRequired,
    matchesLastUpdated: _react2.default.PropTypes.number.isRequired,
    matchesIsFetching: _react2.default.PropTypes.bool.isRequired,
    // timeouts: React.PropTypes.object.isRequired,

    fetchMatches: _react2.default.PropTypes.func.isRequired,

    setAppTimeout: _react2.default.PropTypes.func.isRequired,
    clearAppTimeout: _react2.default.PropTypes.func.isRequired
};


Overview = (0, _reactRedux.connect)(
// mapStateToProps,
mapStateToProps, mapDispatchToProps)(Overview);

/*
*
*   Direct DOM Manipulation
*
*/

function setPageTitle(lang) {
    var title = ['gw2w2w.com'];

    if (lang.slug !== 'en') {
        title.push(lang.name);
    }

    document.title = title.join(' - ');
}

/*
*
*   Export Module
*
*/

exports.default = Overview;

},{"./Matches":21,"./Worlds":22,"actions/api":1,"actions/timeouts":10,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Emblem = require('components/common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var spinner = _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' });

/*
*
*   Redux Helpers
*
*/
var guildsSelector = function guildsSelector(state) {
    return state.guilds;
};
var guildIdSelector = function guildIdSelector(state, props) {
    return props.guildId;
};

var mapStateToProps = (0, _reselect.createSelector)(guildsSelector, guildIdSelector, function (guilds, guildId) {
    return {
        guildId: guildId,
        guild: guilds.get(guildId)
    };
});

// const mapStateToProps = (state, props) => {
//     if (props.guildId === 'C41686DD-A201-E411-863C-E4115BDF481D') {
//         console.log(props.guildId, state.guilds[props.guildId]);
//     }

//     return {
//         guild: state.guilds[props.guildId],
//     };
// };

var Guild = function (_React$Component) {
    _inherits(Guild, _React$Component);

    function Guild() {
        _classCallCheck(this, Guild);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Guild).apply(this, arguments));
    }

    _createClass(Guild, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !this.props.guild.equals(nextProps.guild);
        }
    }, {
        key: 'render',
        value: function render() {
            var guild = this.props.guild;

            // console.log('tracker::guilds::render', guild.toJS());

            return _react2.default.createElement(
                'a',
                { href: 'https://guilds.gw2w2w.com/' + guild.get('id'), id: guild.get('id') },
                _react2.default.createElement(_Emblem2.default, { key: guild.get('id'), guildId: guild.get('id') }),
                _react2.default.createElement(
                    'div',
                    null,
                    !guild.get('loading') ? _react2.default.createElement(
                        'span',
                        null,
                        _react2.default.createElement(
                            'span',
                            { className: 'guild-name' },
                            guild.get('name')
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'guild-tag' },
                            guild.get('tag') ? ' [' + guild.get('tag') + ']' : null
                        )
                    ) : spinner
                )
            );
        }
    }]);

    return Guild;
}(_react2.default.Component);

Guild.propTypes = {
    guildId: _react2.default.PropTypes.string.isRequired,
    guild: _reactImmutableProptypes2.default.map
};


Guild.propTypes = {
    guild: _reactImmutableProptypes2.default.map
};

Guild = (0, _reactRedux.connect)(mapStateToProps)(Guild);

exports.default = Guild;

},{"components/common/icons/Emblem":38,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Guild = require('./Guild');

var _Guild2 = _interopRequireDefault(_Guild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*
*   Reselect Helpers
*
*/

var guildsSelector = function guildsSelector(state) {
    return state.guilds;
};
var matchDetailsSelector = function matchDetailsSelector(state) {
    return state.matchDetails;
};

var matchGuildIdsSelector = (0, _reselect.createSelector)(matchDetailsSelector, function (matchDetails) {
    return _immutable2.default.Map.isMap(matchDetails) && matchDetails.has('guildIds') ? matchDetails.get('guildIds') : _immutable2.default.List();
});

var matchGuildsSelector = (0, _reselect.createSelector)(guildsSelector, matchGuildIdsSelector, function (guilds, guildIds) {
    return guilds.filter(function (g) {
        return guildIds.includes(g.get('id'));
    });
});

var sortedGuildsSelector = (0, _reselect.createSelector)(matchGuildsSelector, function (guildsUnsorted) {
    var guilds = guildsUnsorted.sortBy(function (g) {
        return g.get('id');
    }).sortBy(function (g) {
        return g.get('name');
    }).map(function (g) {
        return g.get('id');
    });

    return { guilds: guilds };
});

// const sortedGuildIdsSelector = createSelector(
//     sortedGuildsSelector,
//     (unsortedGuilds) => {
//         return { guilds: unsortedGuilds.map(g => g.get('id')).toList() };
//     }
// );

var Wrapper = function Wrapper(_ref) {
    var children = _ref.children;
    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-md-24' },
            children
        )
    );
};

var Guilds = function (_React$Component) {
    _inherits(Guilds, _React$Component);

    function Guilds() {
        _classCallCheck(this, Guilds);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Guilds).apply(this, arguments));
    }

    _createClass(Guilds, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !this.props.guilds.equals(nextProps.guilds);
        }
    }, {
        key: 'render',
        value: function render() {
            var guilds = this.props.guilds;

            // console.log('tracker::guilds::render'/*, guilds.toJS()*/);

            return _react2.default.createElement(
                Wrapper,
                null,
                _react2.default.createElement(
                    'ul',
                    { id: 'guilds', className: 'list-unstyled' },
                    guilds.map(function (guildId) {
                        return _react2.default.createElement(
                            'li',
                            { key: guildId, className: 'guild' },
                            _react2.default.createElement(_Guild2.default, { guildId: guildId })
                        );
                    })
                )
            );
        }
    }]);

    return Guilds;
}(_react2.default.Component);

Guilds.propTypes = {
    guilds: _reactImmutableProptypes2.default.map.isRequired
};
;
Guilds = (0, _reactRedux.connect)(sortedGuildsSelector)(Guilds);

exports.default = Guilds;

},{"./Guild":24,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxHelpers = require('lib/reduxHelpers');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Entry = require('./Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { createSelector } from 'reselect';


// import Immutable from 'immutable';


var objectivesSelector = function objectivesSelector(state) {
    return state.objectives;
};

var sortedObjectivesSelector = (0, _reduxHelpers.createImmutableSelector)(objectivesSelector, function (objectives) {
    return objectives.sortBy(function (o) {
        return -o.get('lastFlipped');
    }).keySeq();
});

// const objectiveIdsSelector = createImmutableSelector(
//     sortedObjectivesSelector,
//     (objectives) => objectives.keySeq()
// );

var mapStateToProps = (0, _reduxHelpers.mapImmutableSelectorsToProps)({
    objectives: sortedObjectivesSelector
});

// const mapStateToProps = (state, props) => {
//     // const entries = _.chain(props.log)
//     //     .filter(entry => byType(props.typeFilter, entry))
//     //     .filter(entry => byMapId(props.mapFilter, entry))
//     //     .value();

//     const objectives = state.objectives.sortBy(o => -o.get('lastFlipped'));

//     return {
//         objectives,
//     };
// };

var Entries = function (_React$Component) {
    _inherits(Entries, _React$Component);

    function Entries() {
        _classCallCheck(this, Entries);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Entries).apply(this, arguments));
    }

    _createClass(Entries, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var _props = this.props;
            var objectives = _props.objectives;
            var mapFilter = _props.mapFilter;
            var typeFilter = _props.typeFilter;


            return !objectives.equals(nextProps.objectives);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var objectives = _props2.objectives;
            var mapFilter = _props2.mapFilter;
            var typeFilter = _props2.typeFilter;


            return _react2.default.createElement(
                'ol',
                { id: 'log', className: 'list-unstyled' },
                objectives.map(function (id) {
                    return _react2.default.createElement(_Entry2.default, { key: id, id: id });
                })
            );
        }
    }]);

    return Entries;
}(_react2.default.Component);

Entries.propTypes = {
    objectives: _reactImmutableProptypes2.default.seq.isRequired,

    // now : React.PropTypes.instanceOf(moment).isRequired,
    mapFilter: _react2.default.PropTypes.string.isRequired,
    typeFilter: _react2.default.PropTypes.object.isRequired
};
;
Entries = (0, _reactRedux.connect)(mapStateToProps)(Entries);

function getMap(objective) {
    var mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, function (mm) {
        return mm.id == mapId;
    });
}

function byType(typeFilter, entry) {
    return typeFilter[entry.type];
}

function byMapId(mapFilter, entry) {
    if (mapFilter) {
        return entry.mapId === mapFilter;
    } else {
        return true;
    }
}

exports.default = Entries;

},{"./Entry":27,"lib/reduxHelpers":47,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxHelpers = require('lib/reduxHelpers');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Name = require('components/common/objectives/Name');

var _Name2 = _interopRequireDefault(_Name);

var _Arrow = require('components/common/objectives/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _Emblem = require('components/common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

var _Objective = require('components/common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { createSelector } from 'reselect';

// import Sprite from 'components/common/icons/Sprite';


/*
*   Redux / Reselect
*/

var objectiveIdSelector = function objectiveIdSelector(state, props) {
    return props.id;
};

var langSelector = function langSelector(state) {
    return state.lang;
};
var nowSelector = function nowSelector(state) {
    return state.now;
};
var guildsSelector = function guildsSelector(state) {
    return state.guilds;
};
var objectivesSelector = function objectivesSelector(state) {
    return state.objectives;
};

var objectiveSelector = (0, _reduxHelpers.createImmutableSelector)(objectiveIdSelector, objectivesSelector, function (id, objectives) {
    return objectives.get(id);
});

var hasBuffSelector = (0, _reduxHelpers.createImmutableSelector)(nowSelector, objectiveSelector, function (now, objective) {
    return objective.get('expires').diff() > -2000;
});

var guildIdSelector = (0, _reduxHelpers.createImmutableSelector)(objectiveSelector, function (objective) {
    return objective.get('guild');
});

var guildSelector = (0, _reduxHelpers.createImmutableSelector)(guildsSelector, guildIdSelector, function (guilds, guildId) {
    return guilds.get(guildId, _immutable2.default.Map());
});

var mapStateToProps = (0, _reduxHelpers.mapImmutableSelectorsToProps)({
    guild: guildSelector,
    hasBuff: hasBuffSelector,
    id: objectiveIdSelector,
    lang: langSelector,
    now: nowSelector,
    objective: objectiveSelector
});

/*
*   Component
*/

var Entry = function (_React$Component) {
    _inherits(Entry, _React$Component);

    function Entry() {
        _classCallCheck(this, Entry);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Entry).apply(this, arguments));
    }

    _createClass(Entry, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var _props = this.props;
            var hasBuff = _props.hasBuff;
            var guild = _props.guild;
            var lang = _props.lang;
            var objective = _props.objective;
            var now = _props.now;


            var shouldUpdate = hasBuff && !now.isSame(nextProps.now) || !guild.equals(nextProps.guild) || !lang.equals(nextProps.lang) || !objective.equals(nextProps.objective);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var
            // hasBuff,
            id = _props2.id;
            var lang = _props2.lang;
            var now = _props2.now;
            var objective = _props2.objective;
            var guild = _props2.guild;


            var lastFlipped = objective.get('lastFlipped');
            var expires = objective.get('expires');
            // const lastClaimed = objective.get('lastClaimed');
            // const lastmod = objective.get('lastmod');

            return _react2.default.createElement(
                'li',
                { className: 'team ' + objective.get('owner') },
                _react2.default.createElement(
                    'ul',
                    { className: 'list-unstyled log-objective' },
                    _react2.default.createElement(
                        'li',
                        { className: 'log-expire' },
                        _react2.default.createElement(TimeRemaining, { expires: expires })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-time' },
                        _react2.default.createElement(TimeStamp, { time: lastFlipped })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-geo' },
                        _react2.default.createElement(_Arrow2.default, { id: id })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-sprite' },
                        _react2.default.createElement(_Objective2.default, { color: objective.get('owner'), type: objective.get('type') })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-name' },
                        _react2.default.createElement(_Name2.default, { id: id, lang: lang })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-guild' },
                        _react2.default.createElement(ObjectiveGuild, { objective: objective, guild: guild })
                    )
                )
            );
        }
    }]);

    return Entry;
}(_react2.default.Component);

Entry.propTypes = {
    hasBuff: _react2.default.PropTypes.bool.isRequired,
    id: _react2.default.PropTypes.string.isRequired,
    lang: _reactImmutableProptypes2.default.map.isRequired,
    now: _react2.default.PropTypes.object.isRequired,
    objective: _reactImmutableProptypes2.default.map.isRequired,

    guild: _react2.default.PropTypes.object,
    guildId: _react2.default.PropTypes.string
};
;

Entry = (0, _reactRedux.connect)(mapStateToProps)(Entry);

var TimeRemaining = function TimeRemaining(_ref) {
    var expires = _ref.expires;
    return _react2.default.createElement(
        'span',
        null,
        expires.isAfter() ? (0, _moment2.default)(expires.diff(Date.now(), 'milliseconds')).format('m:ss') : null
    );
};

var TimeStamp = function TimeStamp(_ref2) {
    var time = _ref2.time;
    var _ref2$maxAge = _ref2.maxAge;
    var maxAge = _ref2$maxAge === undefined ? 1 : _ref2$maxAge;
    return _react2.default.createElement(
        'span',
        null,
        (0, _moment2.default)().diff(time, 'hours') < maxAge ? time.format('hh:mm:ss') : time.fromNow(true)
    );
};

var ObjectiveGuild = function ObjectiveGuild(_ref3) {
    var objective = _ref3.objective;
    var guild = _ref3.guild;
    return _react2.default.createElement(
        'span',
        null,
        objective.get('guild') ? _react2.default.createElement(
            'a',
            { href: '#' + objective.get('guild') },
            _react2.default.createElement(_Emblem2.default, { guildId: objective.get('guild') }),
            guild ? _react2.default.createElement(
                'span',
                { className: 'guild-name' },
                ' ',
                guild.get('name'),
                ' '
            ) : null,
            guild ? _react2.default.createElement(
                'span',
                { className: 'guild-tag' },
                ' [',
                guild.get('tag'),
                '] '
            ) : null
        ) : null
    );
};

function getMap(objective) {
    var mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, function (mm) {
        return mm.id == mapId;
    });
}

exports.default = Entry;

},{"components/common/icons/Emblem":38,"components/common/icons/Objective":39,"components/common/objectives/Arrow":42,"components/common/objectives/Name":43,"immutable":"immutable","lib/reduxHelpers":47,"lib/static":48,"moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxHelpers = require('lib/reduxHelpers');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Objective = require('components/common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

var _logFilters = require('actions/logFilters');

var logFilterActions = _interopRequireWildcard(_logFilters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { createSelector } from 'reselect';


var logFiltersSelector = function logFiltersSelector(state) {
    return state.logFilters;
};

var mapFiltersSelector = (0, _reduxHelpers.createImmutableSelector)(logFiltersSelector, function (logFilters) {
    return logFilters.get('maps');
});

var objectiveTypeFiltersSelector = (0, _reduxHelpers.createImmutableSelector)(logFiltersSelector, function (logFilters) {
    return logFilters.get('objectiveTypes');
});

// const eventTypeFiltersSelector = createImmutableSelector(
//     logFiltersSelector,
//     (logFilters) => logFilters.get('eventTypes')
// );

var mapStateToProps = (0, _reduxHelpers.mapImmutableSelectorsToProps)({
    mapFilters: mapFiltersSelector,
    objectiveTypeFilters: objectiveTypeFiltersSelector
});

// eventTypeFilters: eventTypeFiltersSelector,
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        toggleMap: function toggleMap(mapId) {
            return dispatch(logFilterActions.toggleMap({ mapId: mapId }));
        },
        toggleObjectiveType: function toggleObjectiveType(objectiveType) {
            return dispatch(logFilterActions.toggleObjectiveType({ objectiveType: objectiveType }));
        }
    };
};

// toggleEventType: (eventType) => dispatch(logFilterActions.toggleEventType({ eventType })),

var Tabs = function (_React$Component) {
    _inherits(Tabs, _React$Component);

    function Tabs() {
        _classCallCheck(this, Tabs);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Tabs).apply(this, arguments));
    }

    _createClass(Tabs, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var shouldUpdate = !_immutable2.default.is(this.props.mapFilters, nextProps.mapFilters) || !_immutable2.default.is(this.props.objectiveTypeFilters, nextProps.objectiveTypeFilters);

            console.log('tracker::logs::tabs::shouldUpdate', shouldUpdate);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props =
            // toggleEventType,
            this.props;
            var mapFilters = _props.mapFilters;
            var objectiveTypeFilters = _props.objectiveTypeFilters;
            var
            // eventTypeFiltersSelector,

            toggleMap = _props.toggleMap;
            var toggleObjectiveType = _props.toggleObjectiveType;


            console.log('STATIC.mapsMeta', STATIC.mapsMeta);

            return _react2.default.createElement(
                'div',
                { id: 'log-tabs', className: 'flex-tabs' },
                _.map(STATIC.mapsMeta, function (mapMeta) {
                    return _react2.default.createElement(MapTab, {
                        key: mapMeta.id,
                        id: mapMeta.abbr,
                        label: mapMeta.abbr,
                        mapFilters: mapFilters,
                        title: mapMeta.name,
                        onClick: toggleMap
                    });
                }),
                _.map(['castle', 'keep', 'tower', 'camp'], function (t) {
                    return _react2.default.createElement(ObjectiveTab, {
                        key: t,
                        objectiveType: t,
                        objectiveTypeFilters: objectiveTypeFilters,
                        onClick: toggleObjectiveType
                    });
                })
            );
        }
    }]);

    return Tabs;
}(_react2.default.Component);

Tabs.propTypes = {
    mapFilters: _reactImmutableProptypes2.default.set.isRequired,
    objectiveTypeFilters: _reactImmutableProptypes2.default.set.isRequired,

    toggleMap: _react2.default.PropTypes.func.isRequired,
    toggleObjectiveType: _react2.default.PropTypes.func.isRequired
};
;
Tabs = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Tabs);

var MapTab = function MapTab(_ref) {
    var id = _ref.id;
    var label = _ref.label;
    var mapFilters = _ref.mapFilters;
    var _onClick = _ref.onClick;
    var title = _ref.title;
    return _react2.default.createElement(
        'a',
        {
            title: title,
            className: (0, _classnames2.default)({ tab: true, active: mapFilters.has(id) }),
            onClick: function onClick() {
                return _onClick(id);
            }
        },
        label
    );
};

var ObjectiveTab = function ObjectiveTab(_ref2) {
    var objectiveType = _ref2.objectiveType;
    var objectiveTypeFilters = _ref2.objectiveTypeFilters;
    var _onClick2 = _ref2.onClick;
    return _react2.default.createElement(
        'a',
        {
            className: (0, _classnames2.default)({
                check: true,
                active: objectiveTypeFilters.has(objectiveType),
                first: objectiveType === 'castle'
            }),
            onClick: function onClick() {
                return _onClick2(objectiveType);
            }
        },
        _react2.default.createElement(_Objective2.default, { type: objectiveType, size: 18 })
    );
};

exports.default = Tabs;

},{"actions/logFilters":4,"classnames":"classnames","components/common/icons/Objective":39,"immutable":"immutable","lib/reduxHelpers":47,"lib/static":48,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxHelpers = require('lib/reduxHelpers');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _Entries = require('./Entries');

var _Entries2 = _interopRequireDefault(_Entries);

var _Tabs = require('./Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { createSelector } from 'reselect';


var objectivesSelector = function objectivesSelector(state) {
    return state.objectives;
};
var mapsSelector = function mapsSelector(state) {
    return state.matchDetails.get('maps');
};

var mapStateToProps = (0, _reduxHelpers.createImmutableSelector)(mapsSelector, objectivesSelector, function (maps, objectives) {
    return { maps: maps, objectives: objectives };
});

var LogContainer = function (_React$Component) {
    _inherits(LogContainer, _React$Component);

    function LogContainer(props) {
        _classCallCheck(this, LogContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LogContainer).call(this, props));

        _this.state = {
            mapFilter: '',
            typeFilter: {
                castle: true,
                keep: true,
                tower: true,
                camp: true
            }
        };
        return _this;
    }

    _createClass(LogContainer, [{
        key: 'render',
        value: function render() {
            var _props = this.props;
            var maps = _props.maps;
            var objectives = _props.objectives;


            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                    'div',
                    { className: 'col-md-24' },
                    _react2.default.createElement(
                        'div',
                        { id: 'log-container' },
                        _react2.default.createElement(_Tabs2.default, {
                            maps: maps,
                            mapFilter: this.state.mapFilter,
                            typeFilter: this.state.typeFilter,

                            handleMapFilterClick: this.handleMapFilterClick.bind(this),
                            handleTypeFilterClick: this.handleTypeFilterClick.bind(this)
                        }),
                        _react2.default.createElement(_Entries2.default, {
                            mapFilter: this.state.mapFilter,
                            typeFilter: this.state.typeFilter
                        })
                    )
                )
            );
        }
    }, {
        key: 'handleMapFilterClick',
        value: function handleMapFilterClick(mapFilter) {
            console.log('set mapFilter', mapFilter);

            this.setState({ mapFilter: mapFilter });
        }
    }, {
        key: 'handleTypeFilterClick',
        value: function handleTypeFilterClick(toggleType) {
            console.log('toggle typeFilter', toggleType);

            this.setState(function (state) {
                state.typeFilter[toggleType] = !state.typeFilter[toggleType];
                return state;
            });
        }
    }]);

    return LogContainer;
}(_react2.default.Component);

LogContainer.propTypes = {
    maps: _reactImmutableProptypes2.default.list.isRequired,
    objectives: _reactImmutableProptypes2.default.map.isRequired
};


LogContainer = (0, _reactRedux.connect)(mapStateToProps)(LogContainer);

exports.default = LogContainer;

},{"./Entries":26,"./Tabs":28,"immutable":"immutable","lib/reduxHelpers":47,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Objective = require('./Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var guilds = _ref.guilds;
    var lang = _ref.lang;
    var matchMap = _ref.matchMap;
    var now = _ref.now;

    return _react2.default.createElement(
        'div',
        { className: 'map-sections' },
        _lodash2.default.map(getMapObjectivesMeta(matchMap.id), function (section, ix) {
            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)({
                        'map-section': true,
                        solo: section.length === 1
                    }), key: ix },
                _lodash2.default.map(section, function (geo) {
                    return _react2.default.createElement(_Objective2.default, {
                        key: geo.id,
                        id: geo.id,
                        guilds: guilds,
                        lang: lang,
                        direction: geo.direction,
                        matchMap: matchMap,
                        now: now
                    });
                })
            );
        })
    );
};

function getMapObjectivesMeta(mapId) {
    var mapCode = 'bl2';

    if (mapId === 38) {
        mapCode = 'eb';
    }

    return _lodash2.default.chain(STATIC.objectivesMeta).cloneDeep().filter(function (om) {
        return om.map === mapCode;
    }).groupBy(function (om) {
        return om.group;
    }).value();
}

},{"./Objective":31,"classnames":"classnames","lib/static":48,"lodash":"lodash","react":"react"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Emblem = require('components/common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

var _Arrow = require('components/common/icons/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _Objective = require('components/common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var id = _ref.id;
    var guilds = _ref.guilds;
    var lang = _ref.lang;
    var direction = _ref.direction;
    var matchMap = _ref.matchMap;
    var now = _ref.now;

    var objectiveId = matchMap.id + '-' + id;
    var oMeta = STATIC.objectives[objectiveId];
    var mo = _lodash2.default.find(matchMap.objectives, function (o) {
        return o.id === objectiveId;
    });

    return _react2.default.createElement(
        'ul',
        { className: (0, _classnames2.default)({
                'list-unstyled': true,
                'track-objective': true,
                fresh: now.diff(mo.lastFlipped, 'seconds') < 30,
                expiring: mo.expires.isAfter(now) && mo.expires.diff(now, 'seconds') < 30,
                expired: now.isAfter(mo.expires),
                active: now.isBefore(mo.expires)
            }) },
        _react2.default.createElement(
            'li',
            { className: 'left' },
            _react2.default.createElement(
                'span',
                { className: 'track-geo' },
                _react2.default.createElement(_Arrow2.default, { direction: direction })
            ),
            _react2.default.createElement(
                'span',
                { className: 'track-sprite' },
                _react2.default.createElement(_Objective2.default, { color: mo.owner, type: mo.type })
            ),
            _react2.default.createElement(
                'span',
                { className: 'track-name' },
                oMeta.name[lang.slug]
            )
        ),
        _react2.default.createElement(
            'li',
            { className: 'right' },
            mo.guild ? _react2.default.createElement(
                'a',
                {
                    className: 'track-guild',
                    href: '#' + mo.guild,
                    title: guilds[mo.guild] ? guilds[mo.guild].name + ' [' + guilds[mo.guild].tag + ']' : 'Loading...'
                },
                _react2.default.createElement(_Emblem2.default, { guildId: mo.guild })
            ) : null,
            _react2.default.createElement(
                'span',
                { className: 'track-expire' },
                mo.expires.isAfter(now) ? (0, _moment2.default)(mo.expires.diff(now, 'milliseconds')).format('m:ss') : null
            )
        )
    );
};

},{"classnames":"classnames","components/common/icons/Arrow":37,"components/common/icons/Emblem":38,"components/common/icons/Objective":39,"lib/static":48,"lodash":"lodash","moment":"moment","react":"react"}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _MatchMap = require('./MatchMap');

var _MatchMap2 = _interopRequireDefault(_MatchMap);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
* Component Definition
*
*/

exports.default = function (_ref) {
    var guilds = _ref.guilds;
    var lang = _ref.lang;
    var match = _ref.match;
    var now = _ref.now;


    if (_lodash2.default.isEmpty(match)) {
        return null;
    }

    var maps = _lodash2.default.keyBy(match.maps, 'id');
    var currentMapIds = _lodash2.default.keys(maps);
    var mapsMetaActive = _lodash2.default.filter(STATIC.mapsMeta, function (mapMeta) {
        return _lodash2.default.indexOf(currentMapIds, _lodash2.default.parseInt(mapMeta.id) !== -1);
    });

    return _react2.default.createElement(
        'section',
        { id: 'maps' },
        _lodash2.default.map(mapsMetaActive, function (mapMeta) {
            return _react2.default.createElement(
                'div',
                { className: 'map', key: mapMeta.id },
                _react2.default.createElement(
                    'h2',
                    null,
                    mapMeta.name
                ),
                _react2.default.createElement(_MatchMap2.default, {
                    guilds: guilds,
                    lang: lang,
                    mapMeta: mapMeta,
                    matchMap: maps[mapMeta.id],
                    now: now
                })
            );
        })
    );
};

/*


                    <div className='col-md-6'>{<MapDetails mapKey='Center' mapMeta={getMapMeta('Center')} {...this.props} />}</div>

                    <div className='col-md-18'>

                        <div className='row'>
                            <div className='col-md-8'>{<MapDetails mapKey='RedHome' mapMeta={getMapMeta('RedHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='BlueHome' mapMeta={getMapMeta('BlueHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='GreenHome' mapMeta={getMapMeta('GreenHome')} {...this.props} />}</div>
                        </div>

                    </div>
                 </div>
                 */

},{"./MatchMap":30,"lib/static":48,"lodash":"lodash","react":"react"}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Sprite = require('components/common/Icons/Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Holdings = function Holdings(_ref) {
    var color = _ref.color;
    var holdings = _ref.holdings;
    return _react2.default.createElement(
        'ul',
        { className: 'list-inline' },
        holdings.map(function (typeQuantity, typeIndex) {
            return _react2.default.createElement(
                'li',
                { key: typeIndex },
                _react2.default.createElement(_Sprite2.default, {
                    type: typeIndex,
                    color: color
                }),
                _react2.default.createElement(
                    'span',
                    { className: 'quantity' },
                    'x',
                    typeQuantity
                )
            );
        })
    );
};

exports.default = Holdings;

},{"components/common/Icons/Sprite":41,"react":"react"}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rgbNum = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _Holdings = require('./Holdings');

var _Holdings2 = _interopRequireDefault(_Holdings);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var STATIC_WORLDS = _immutable2.default.fromJS(_static.worlds);

var rgbNum = exports.rgbNum = _immutable2.default.Map({ red: 0, blue: 0, green: 0 });

var Loading = function Loading(_ref) {
    _objectDestructuringEmpty(_ref);

    return _react2.default.createElement(
        'h1',
        { style: { height: '100px', fontSize: '50px', lineHeight: '100px' } },
        _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
    );
};

/*
*
* redux helpers
*
*/

var colorSelector = function colorSelector(state, props) {
    return props.color;
};

var langSelector = function langSelector(state) {
    return state.lang;
};
var matchDetailsSelector = function matchDetailsSelector(state) {
    return state.matchDetails;
};

var worldsSelector = (0, _reselect.createSelector)(matchDetailsSelector, function (matchDetails) {
    return matchDetails.get('worlds');
});

var worldIdSelector = (0, _reselect.createSelector)(colorSelector, worldsSelector, function (color, worlds) {
    return worlds.get(color).toString();
});

var worldSelector = (0, _reselect.createSelector)(langSelector, worldIdSelector, function (lang, worldId) {
    return STATIC_WORLDS.getIn([worldId, lang.get('slug')], _immutable2.default.Map());
});

var statsSelector = (0, _reselect.createSelector)(matchDetailsSelector, function (matchDetails) {
    return matchDetails.get('stats');
});

var worldStatsSelector = (0, _reselect.createSelector)(colorSelector, statsSelector, function (color, stats) {
    return _immutable2.default.Map({
        deaths: {},
        kills: {},
        holdings: {},
        scores: {},
        ticks: {}
    }).map(function (v, key) {
        return stats.getIn([key, color]);
    });
});

var mapStateToProps = (0, _reselect.createSelector)(colorSelector, langSelector, worldStatsSelector, worldSelector, worldIdSelector, function (color, lang, stats, world, worldId) {
    return {
        color: color,
        lang: lang,
        stats: stats,
        world: world,
        worldId: worldId
    };
});

// const mapStateToProps = (state, props) => {
//     const world = Immutable.fromJS(
//         (props.worldId)
//             ? worlds[props.worldId][state.lang.get('slug')]
//             : {}
//     );

//     return {
//         color: props.color,
//         lang: state.lang,
//         worldId: props.worldId,
//         stats: Immutable.Map(),
//         world,
//     };
// };

var World = function (_React$Component) {
    _inherits(World, _React$Component);

    function World() {
        _classCallCheck(this, World);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(World).apply(this, arguments));
    }

    _createClass(World, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var _props = this.props;
            var lang = _props.lang;
            var stats = _props.stats;
            var world = _props.world;


            return !lang.equals(nextProps.lang) || !stats.equals(nextProps.stats) || !world.equals(nextProps.world);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var color = _props2.color;
            var lang = _props2.lang;
            var stats = _props2.stats;
            var world = _props2.world;
            var worldId = _props2.worldId;

            // console.log('color', color);
            // console.log('worldId', worldId);
            // console.log('world', world.toJS());
            // console.log('stats', stats.toJS());

            return _react2.default.createElement(
                'div',
                { className: 'scoreboard team-bg team text-center ' + color },
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'h1',
                        null,
                        world.has('name') ? _react2.default.createElement(
                            'a',
                            { href: world.get('link') },
                            world.get('name')
                        ) : _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
                    ),
                    _react2.default.createElement(
                        'h2',
                        null,
                        _react2.default.createElement(
                            'div',
                            { className: 'stats' },
                            _react2.default.createElement(
                                'span',
                                { title: 'Total Score' },
                                (0, _numeral2.default)(stats.get('scores')).format('0,0')
                            ),
                            ' ',
                            _react2.default.createElement(
                                'span',
                                { title: 'Total Tick' },
                                (0, _numeral2.default)(stats.get('ticks')).format('+0,0')
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'sub-stats' },
                            _react2.default.createElement(
                                'span',
                                { title: 'Total Kills' },
                                (0, _numeral2.default)(stats.get('kills')).format('0,0'),
                                'k'
                            ),
                            ' ',
                            _react2.default.createElement(
                                'span',
                                { title: 'Total Deaths' },
                                (0, _numeral2.default)(stats.get('deaths')).format('0,0'),
                                'd'
                            )
                        )
                    ),
                    _react2.default.createElement(_Holdings2.default, {
                        color: color,
                        holdings: stats.get('holdings')
                    })
                )
            );
        }
    }]);

    return World;
}(_react2.default.Component);

World.propTypes = {
    color: _react2.default.PropTypes.string.isRequired,
    lang: _reactImmutableProptypes2.default.map.isRequired,
    stats: _react2.default.PropTypes.object,
    world: _react2.default.PropTypes.object,
    worldId: _react2.default.PropTypes.string
};
;

World = (0, _reactRedux.connect)(mapStateToProps)(World);

exports.default = World;

},{"./Holdings":33,"immutable":"immutable","lib/static":48,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _World = require('./World');

var _World2 = _interopRequireDefault(_World);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
* Component Definition
*
*/

var mapStateToProps = function mapStateToProps(state) {
    return { worlds: state.matchDetails.get('worlds') };
};

var Scoreboard = function Scoreboard(_ref) {
    var worlds = _ref.worlds;

    return _react2.default.createElement(
        'section',
        { className: 'row', id: 'scoreboards' },
        _immutable2.default.Map.isMap(worlds) ? worlds.keySeq().map(function (color) {
            return _react2.default.createElement(
                'div',
                { className: 'col-sm-8', key: color },
                _react2.default.createElement(_World2.default, { color: color })
            );
        }) : null
    );
};
Scoreboard.propTypes = {
    worlds: _reactImmutableProptypes2.default.map
};

Scoreboard = (0, _reactRedux.connect)(mapStateToProps)(Scoreboard);

/*
*
* private methods
*
*/

function getWorldsProps(stats, worlds) {
    // const worldsProps = Immutable.fromJS({
    //     red: { color: 'red', world: worlds.getIn('red'), stats: getWorldStats(stats, 'red') },
    //     blue: { color: 'blue', world: worlds.getIn('blue'), stats: getWorldStats(stats, 'blue') },
    //     green: { color: 'green', world: worlds.getIn('green'), stats:  getWorldStats(stats, 'green') },
    // });

    var colors = _immutable2.default.Map({
        red: {},
        blue: {},
        green: {}
    });

    if (!_immutable2.default.Map.isMap(worlds)) {
        return colors;
    }

    var worldsProps = colors.map(function (obj, color) {
        console.log(obj, color, worlds.getIn([color]));
        return {
            color: color,
            worldId: worlds.getIn([color]),
            stats: getWorldStats(stats, color)
        };
    });

    // console.log('worldsProps', worldsProps);
    // console.log('match.worlds', match.worlds);

    // if (worlds) {
    //     worlds.forEach(
    //         (worldId, color) => {
    //             worldsProps.setIn([color, 'id'], worldId);
    //         }
    //     );
    // }

    // console.log('worldsProps', worldsProps);

    return worldsProps;
}

function getWorldStats(stats, color) {
    return _immutable2.default.fromJS({
        deaths: stats.getIn(['deaths', color], 0),
        holdings: stats.getIn(['holdings', color], [0, 0, 0, 0]),
        kills: stats.getIn(['kills', color], 0),
        score: stats.getIn(['scores', color], 0),
        tick: stats.getIn(['ticks', color], 0)
    });
}

/*
*
* export
*
*/

exports.default = Scoreboard;

},{"./World":34,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxHelpers = require('lib/reduxHelpers');

var _reactImmutableProptypes = require('react-immutable-proptypes');

var _reactImmutableProptypes2 = _interopRequireDefault(_reactImmutableProptypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _api = require('actions/api');

var apiActions = _interopRequireWildcard(_api);

var _timeouts = require('actions/timeouts');

var timeoutActions = _interopRequireWildcard(_timeouts);

var _now = require('actions/now');

var nowActions = _interopRequireWildcard(_now);

var _Scoreboard = require('./Scoreboard');

var _Scoreboard2 = _interopRequireDefault(_Scoreboard);

var _Maps = require('./Maps');

var _Maps2 = _interopRequireDefault(_Maps);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

var _Guilds = require('./Guilds');

var _Guilds2 = _interopRequireDefault(_Guilds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/*
*
* Dependencies
*
*/

// import { createSelector } from 'reselect';


// import Immutable from 'immutable';


/*
*   Redux Actions
*/

/*
 *   Data
 */

// import DAO from 'lib/data/tracker';

/*
 * React Components
 */

/*
* Globals
*/

var MATCH_REFRESH = _lodash2.default.random(4 * 1000, 8 * 1000);
var TIME_REFRESH = 1000 / 1;

// const LoadingSpinner = () => (
//     <h1 id='AppLoading'>
//         <i className='fa fa-spinner fa-spin'></i>
//     </h1>
// );

/*
*
*   Redux Helpers
*
*/
// const mapStateToProps = (state) => {
//     return {
//         lang: state.lang,
//         world: state.world,
//         guilds: state.guilds,
//         // timeouts: state.timeouts,
//     };
// };
var langSelector = function langSelector(state) {
    return state.lang;
};
var matchDetailsSelector = function matchDetailsSelector(state) {
    return state.matchDetails;
};
var worldSelector = function worldSelector(state) {
    return state.world;
};
// const apiSelector = (state) => state.api;
// const nowSelector = (state) => state.now;
// const guildsSelector = (state) => state.guilds;

// const detailsIsFetchingSelector = createImmutableSelector(
//     apiSelector,
//     (api) => api.get('pending').includes('matchDetails')
// );

var matchDetailsLastUpdateSelector = (0, _reduxHelpers.createImmutableSelector)(matchDetailsSelector, function (matchDetails) {
    return matchDetails.get('lastUpdate');
});

var mapStateToProps = (0, _reduxHelpers.mapImmutableSelectorsToProps)({
    lang: langSelector,
    matchDetailsLastUpdate: matchDetailsLastUpdateSelector,
    world: worldSelector
});

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        setNow: function setNow() {
            return dispatch(nowActions.setNow());
        },

        fetchGuildById: function fetchGuildById(id) {
            return dispatch(apiActions.fetchGuildById(id));
        },
        fetchMatchDetails: function fetchMatchDetails(worldId) {
            return dispatch(apiActions.fetchMatchDetails(worldId));
        },

        setAppTimeout: function setAppTimeout(_ref) {
            var name = _ref.name;
            var cb = _ref.cb;
            var timeout = _ref.timeout;
            return dispatch(timeoutActions.setAppTimeout({ name: name, cb: cb, timeout: timeout }));
        },
        clearAppTimeout: function clearAppTimeout(_ref2) {
            var name = _ref2.name;
            return dispatch(timeoutActions.clearAppTimeout({ name: name }));
        }
    };
};

/*
*
* Component Export
*
*/

var Tracker = function (_React$Component) {
    _inherits(Tracker, _React$Component);

    /*
    *
    *     React Lifecycle
    *
    */

    function Tracker(props) {
        _classCallCheck(this, Tracker);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Tracker).call(this, props));
    }

    _createClass(Tracker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log('Tracker::componentDidMount()');

            var _props = this.props;
            var lang = _props.lang;
            var world = _props.world;
            var fetchMatchDetails = _props.fetchMatchDetails;


            setPageTitle(lang, world);
            fetchMatchDetails({ world: world });

            this.updateNow();
        }
    }, {
        key: 'updateNow',
        value: function updateNow() {
            var _this2 = this;

            this.props.setAppTimeout({
                name: 'setNow',
                cb: function cb() {
                    _this2.props.setNow();
                    _this2.updateNow();
                },
                timeout: TIME_REFRESH
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // console.log(`Tracker::componentWillMount()`);
            // setPageTitle(this.props.lang);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _props2 = this.props;
            var lang = _props2.lang;
            var world = _props2.world;
            var matchDetailsLastUpdate = _props2.matchDetailsLastUpdate;
            var fetchMatchDetails = _props2.fetchMatchDetails;
            var setAppTimeout = _props2.setAppTimeout;


            if (!lang.equals(nextProps.lang) || world.slug !== nextProps.world.slug) {
                setPageTitle(nextProps.lang, nextProps.world);
            }

            if (matchDetailsLastUpdate !== nextProps.matchDetailsLastUpdate) {
                setAppTimeout({
                    name: 'fetchMatchDetails',
                    cb: function cb() {
                        return fetchMatchDetails({ world: world });
                    },
                    timeout: function timeout() {
                        return MATCH_REFRESH;
                    }
                });
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.isNewLang(nextProps)
            // || this.isNewSecond(nextProps)
            ;
        }
    }, {
        key: 'isNewSecond',
        value: function isNewSecond(nextProps) {
            return !this.props.now.isSame(nextProps.now);
        }
    }, {
        key: 'isNewLang',
        value: function isNewLang(nextProps) {
            return !this.props.lang.equals(nextProps.lang);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.clearAppTimeout({ name: 'fetchMatchDetails' });
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { id: 'tracker' },
                _react2.default.createElement(_Scoreboard2.default, null),
                _react2.default.createElement(_Log2.default, null),
                _react2.default.createElement(_Guilds2.default, null)
            );
        }
    }]);

    return Tracker;
}(_react2.default.Component);

Tracker.propTypes = {
    lang: _reactImmutableProptypes2.default.map.isRequired,
    world: _react2.default.PropTypes.object.isRequired,
    // detailsIsFetching: React.PropTypes.bool.isRequired,
    matchDetailsLastUpdate: _react2.default.PropTypes.number.isRequired,
    // guilds : ImmutablePropTypes.map.isRequired,
    // matchDetails : ImmutablePropTypes.map.isRequired,

    setNow: _react2.default.PropTypes.func.isRequired,
    // now: React.PropTypes.object.isRequired,

    fetchGuildById: _react2.default.PropTypes.func.isRequired,
    fetchMatchDetails: _react2.default.PropTypes.func.isRequired,

    setAppTimeout: _react2.default.PropTypes.func.isRequired,
    clearAppTimeout: _react2.default.PropTypes.func.isRequired
};


Tracker = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Tracker);

/*
*
* Private methods
*
*/

function momentNow() {
    return (0, _moment2.default)(Math.floor(Date.now() / 1000) * 1000);
}

function setPageTitle(lang, world) {
    var langSlug = lang.get('slug');
    var worldName = world.name;

    var title = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.get('name'));
    }

    document.title = title.join(' - ');
}

exports.default = Tracker;

},{"./Guilds":25,"./Log":29,"./Maps":32,"./Scoreboard":35,"actions/api":1,"actions/now":7,"actions/timeouts":10,"lib/reduxHelpers":47,"lodash":"lodash","moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Arrow = function Arrow(_ref) {
    var direction = _ref.direction;
    return direction ? _react2.default.createElement('img', { src: getArrowSrc(direction), className: 'arrow' }) : _react2.default.createElement('span', null);
};

/*
 *
 * Private Methods
 *
 */

function getArrowSrc(direction) {
    var src = ['/img/icons/dist/arrow'];

    if (!direction) {
        return null;
    }

    if (direction.indexOf('N') >= 0) {
        src.push('north');
    } else if (direction.indexOf('S') >= 0) {
        src.push('south');
    }

    if (direction.indexOf('W') >= 0) {
        src.push('west');
    } else if (direction.indexOf('E') >= 0) {
        src.push('east');
    }

    return src.join('-') + '.svg';
}

exports.default = Arrow;

},{"react":"react"}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';

var Emblem = function Emblem(_ref) {
    var guildId = _ref.guildId;
    var size = _ref.size;
    var _ref$className = _ref.className;
    var className = _ref$className === undefined ? '' : _ref$className;

    return _react2.default.createElement('img', {
        className: 'emblem ' + className,

        src: 'https://guilds.gw2w2w.com/' + guildId + '.svg',
        width: size ? size : null,
        height: size ? size : null,

        onError: function onError(e) {
            return e.target.src = imgPlaceholder;
        }
    });
};

exports.default = Emblem;

},{"react":"react"}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Objective = function Objective(_ref) {
    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? 'black' : _ref$color;
    var type = _ref.type;
    var size = _ref.size;
    return _react2.default.createElement('img', {
        src: getSrc({ color: color, type: type }),
        className: getClass({ type: type }),
        width: size ? size : null,
        height: size ? size : null
    });
};

function getSrc(_ref2) {
    var color = _ref2.color;
    var type = _ref2.type;

    var src = '/img/icons/dist/';

    src += type;

    if (color !== 'black') {
        src += '-' + color;
    }

    src += '.svg';

    return src;
}

function getClass(_ref3) {
    var type = _ref3.type;

    return 'icon-objective icon-objective-' + type;
}

exports.default = Objective;

},{"react":"react"}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Component Globals
 */

var INSTANCE = {
    size: 60,
    stroke: 2
};

var Pie = function Pie(_ref) {
    var scores = _ref.scores;
    return _react2.default.createElement('img', {
        src: getImageSource(scores),

        width: INSTANCE.size,
        height: INSTANCE.size
    });
};

function getImageSource(scores) {
    return 'https://www.piely.net/' + INSTANCE.size + '/' + scores.red + ',' + scores.blue + ',' + scores.green + '?strokeWidth=' + INSTANCE.stroke;
}

exports.default = Pie;

},{"react":"react"}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sprite = function Sprite(_ref) {
    var color = _ref.color;
    var type = _ref.type;
    return _react2.default.createElement('span', { className: 'sprite ' + type + ' ' + color });
};

exports.default = Sprite;

},{"react":"react"}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Arrow = require('components/common/icons/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectiveArrow = function ObjectiveArrow(_ref) {
    var id = _ref.id;
    return _react2.default.createElement(_Arrow2.default, { direction: getObjectiveDirection(id) });
};

function getObjectiveDirection(id) {
    var baseId = id.split('-')[1].toString();
    var meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}

exports.default = ObjectiveArrow;

},{"components/common/icons/Arrow":37,"lib/static":48,"react":"react"}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectiveName = function ObjectiveName(_ref) {
    var id = _ref.id;
    var lang = _ref.lang;
    return _react2.default.createElement(
        'span',
        null,
        STATIC.objectives[id].name[lang.get('slug')]
    );
};

exports.default = ObjectiveName;

},{"lib/static":48,"react":"react"}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPerf = require('react-addons-perf');

var _reactAddonsPerf2 = _interopRequireDefault(_reactAddonsPerf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Performance = function (_React$Component) {
    _inherits(Performance, _React$Component);

    function Performance() {
        _classCallCheck(this, Performance);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Performance).apply(this, arguments));
    }

    _createClass(Performance, [{
        key: 'onStart',
        value: function onStart() {
            _reactAddonsPerf2.default.start();
            console.log('Perf started');
        }
    }, {
        key: 'onStop',
        value: function onStop() {
            _reactAddonsPerf2.default.stop();
            console.log('Perf stopped');
            var lastMeasurements = _reactAddonsPerf2.default.getLastMeasurements();
            // console.dir(lastMeasurements);
            // Perf.printDOM(lastMeasurements);
            _reactAddonsPerf2.default.printInclusive(lastMeasurements);
            _reactAddonsPerf2.default.printExclusive(lastMeasurements);
            _reactAddonsPerf2.default.printWasted(lastMeasurements);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'p',
                null,
                _react2.default.createElement(
                    'strong',
                    null,
                    'Performance: '
                ),
                _react2.default.createElement(
                    'button',
                    { onClick: this.onStart },
                    'Start'
                ),
                _react2.default.createElement(
                    'button',
                    { onClick: this.onStop },
                    'Stop'
                )
            );
        }
    }]);

    return Performance;
}(_react2.default.Component);

exports.default = Performance;

},{"react":"react","react-addons-perf":"react-addons-perf"}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/*
*   Generic
*/

// routes
var SET_ROUTE = exports.SET_ROUTE = 'SET_ROUTE';

// langs
var SET_LANG = exports.SET_LANG = 'SET_LANG';

// timeouts
var ADD_TIMEOUT = exports.ADD_TIMEOUT = 'ADD_TIMEOUT';
var REMOVE_TIMEOUT = exports.REMOVE_TIMEOUT = 'REMOVE_TIMEOUT';
// export const REMOVE_ALL_TIMEOUTS = 'REMOVE_ALL_TIMEOUTS';

// worlds
var SET_WORLD = exports.SET_WORLD = 'SET_WORLD';
var CLEAR_WORLD = exports.CLEAR_WORLD = 'CLEAR_WORLD';

/*
*   API
*/

var API_REQUEST_OPEN = exports.API_REQUEST_OPEN = 'API_REQUEST_OPEN';
var API_REQUEST_SUCCESS = exports.API_REQUEST_SUCCESS = 'API_REQUEST_SUCCESS';
var API_REQUEST_FAILED = exports.API_REQUEST_FAILED = 'API_REQUEST_FAILED';

/*
*   Overview
*/

// matches
var RECEIVE_MATCHES = exports.RECEIVE_MATCHES = 'RECEIVE_MATCHES';
var RECEIVE_MATCHES_SUCCESS = exports.RECEIVE_MATCHES_SUCCESS = 'RECEIVE_MATCHES_SUCCESS';
var RECEIVE_MATCHES_FAILED = exports.RECEIVE_MATCHES_FAILED = 'RECEIVE_MATCHES_FAILED';

/*
*   Tracker
*/

// now
var SET_NOW = exports.SET_NOW = 'SET_NOW';

// matches
var CLEAR_MATCHDETAILS = exports.CLEAR_MATCHDETAILS = 'CLEAR_MATCHDETAILS';
var RECEIVE_MATCHDETAILS = exports.RECEIVE_MATCHDETAILS = 'RECEIVE_MATCHDETAILS';
var RECEIVE_MATCHDETAILS_SUCCESS = exports.RECEIVE_MATCHDETAILS_SUCCESS = 'RECEIVE_MATCHDETAILS_SUCCESS';
var RECEIVE_MATCHDETAILS_FAILED = exports.RECEIVE_MATCHDETAILS_FAILED = 'RECEIVE_MATCHDETAILS_FAILED';

// guilds
var INITIALIZE_GUILD = exports.INITIALIZE_GUILD = 'INITIALIZE_GUILD';
var RECEIVE_GUILD = exports.RECEIVE_GUILD = 'RECEIVE_GUILD';
var RECEIVE_GUILD_FAILED = exports.RECEIVE_GUILD_FAILED = 'RECEIVE_GUILD_FAILED';

// objectives
var OBJECTIVES_RESET = exports.OBJECTIVES_RESET = 'OBJECTIVES_RESET';
var OBJECTIVES_UPDATE = exports.OBJECTIVES_UPDATE = 'OBJECTIVES_UPDATE';
var OBJECTIVE_UPDATE = exports.OBJECTIVE_UPDATE = 'OBJECTIVE_UPDATE';

// log
var LOG_FILTERS_TOGGLE_MAP = exports.LOG_FILTERS_TOGGLE_MAP = 'LOG_FILTERS_TOGGLE_MAP';
var LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE = exports.LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE = 'LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE';
var LOG_FILTERS_TOGGLE_EVENT_TYPE = exports.LOG_FILTERS_TOGGLE_EVENT_TYPE = 'LOG_FILTERS_TOGGLE_EVENT_TYPE';

/*
*   Tracker
*/

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMatches = getMatches;
exports.getMatchByWorldSlug = getMatchByWorldSlug;
exports.getMatchByWorldId = getMatchByWorldId;
exports.getGuildById = getGuildById;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
    return null;
};

exports.default = {
    getMatches: getMatches,
    getMatchByWorldSlug: getMatchByWorldSlug,
    getMatchByWorldId: getMatchByWorldId,
    getGuildById: getGuildById
};
function getMatches(_ref) {
    var _ref$success = _ref.success;
    var success = _ref$success === undefined ? noop : _ref$success;
    var _ref$error = _ref.error;
    var error = _ref$error === undefined ? noop : _ref$error;
    var _ref$complete = _ref.complete;
    var complete = _ref$complete === undefined ? noop : _ref$complete;

    // console.log('api::getMatches()');

    _superagent2.default.get('https://state.gw2w2w.com/matches').end(onRequest.bind(this, { success: success, error: error, complete: complete }));
}

function getMatchByWorldSlug(_ref2) {
    var worldSlug = _ref2.worldSlug;
    var _ref2$success = _ref2.success;
    var success = _ref2$success === undefined ? noop : _ref2$success;
    var _ref2$error = _ref2.error;
    var error = _ref2$error === undefined ? noop : _ref2$error;
    var _ref2$complete = _ref2.complete;
    var complete = _ref2$complete === undefined ? noop : _ref2$complete;

    // console.log('api::getMatchByWorldSlug()');

    _superagent2.default.get('https://state.gw2w2w.com/world/' + worldSlug).end(onRequest.bind(this, { success: success, error: error, complete: complete }));
}

function getMatchByWorldId(_ref3) {
    var worldId = _ref3.worldId;
    var _ref3$success = _ref3.success;
    var success = _ref3$success === undefined ? noop : _ref3$success;
    var _ref3$error = _ref3.error;
    var error = _ref3$error === undefined ? noop : _ref3$error;
    var _ref3$complete = _ref3.complete;
    var complete = _ref3$complete === undefined ? noop : _ref3$complete;

    // console.log('api::getMatchByWorldId()');

    _superagent2.default.get('https://state.gw2w2w.com/world/' + worldId).end(onRequest.bind(this, { success: success, error: error, complete: complete }));
}

function getGuildById(_ref4) {
    var guildId = _ref4.guildId;
    var _ref4$success = _ref4.success;
    var success = _ref4$success === undefined ? noop : _ref4$success;
    var _ref4$error = _ref4.error;
    var error = _ref4$error === undefined ? noop : _ref4$error;
    var _ref4$complete = _ref4.complete;
    var complete = _ref4$complete === undefined ? noop : _ref4$complete;

    // console.log('api::getGuildById()');

    _superagent2.default.get('https://api.guildwars2.com/v1/guild_details.json?guild_id=' + guildId).end(onRequest.bind(this, { success: success, error: error, complete: complete }));
}

function onRequest(callbacks, err, res) {
    // console.log('api::onRequest()', err, res && res.body);

    if (err || res.error) {
        callbacks.error(err);
    } else {
        callbacks.success(res.body);
    }

    callbacks.complete();
}

},{"superagent":"superagent"}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapImmutableSelectorsToProps = exports.mapSelectorsToProps = exports.createImmutableSelector = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// create a "selector creator" that uses Immutable.is instead of ===
var createImmutableSelector = exports.createImmutableSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _immutable2.default.is);

/*
    const mapStateToProps = mapSelectorsToProps({
        key: selector,
        key2: selector2,
    });

    to

    const mapStateToProps = createSelector(
        ..selectors,
        (...keys) => ({...keys})
    );
*/

var mapSelectorsToProps = exports.mapSelectorsToProps = function mapSelectorsToProps(selectorsMap) {
    var selectorCreator = arguments.length <= 1 || arguments[1] === undefined ? _reselect.createSelector : arguments[1];

    var keys = Object.keys(selectorsMap);
    var selectors = keys.map(function (k) {
        return selectorsMap[k];
    });

    return function () {
        return selectorCreator.apply(undefined, _toConsumableArray(selectors).concat([function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return keys.reduce(function (result, val, i) {
                return _extends({}, result, _defineProperty({}, val, args[i]));
            }, {});
        }]));
    };
};

var mapImmutableSelectorsToProps = exports.mapImmutableSelectorsToProps = function mapImmutableSelectorsToProps(selectorsMap) {
    return mapSelectorsToProps(selectorsMap, createImmutableSelector);
};

},{"immutable":"immutable","reselect":"reselect"}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.objectivesGeo = exports.mapsMeta = exports.objectivesMeta = exports.worlds = exports.langs = exports.objectives = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _langs = require('gw2w2w-static/data/langs');

var _langs2 = _interopRequireDefault(_langs);

var _world_names = require('gw2w2w-static/data/world_names');

var _world_names2 = _interopRequireDefault(_world_names);

var _objectives_v2_merged = require('gw2w2w-static/data/objectives_v2_merged');

var _objectives_v2_merged2 = _interopRequireDefault(_objectives_v2_merged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWorldLink(langSlug, world) {
    return ['', langSlug, world[langSlug].slug].join('/');
}

var objectives = exports.objectives = _objectives_v2_merged2.default;
var langs = exports.langs = _langs2.default;

var worlds = exports.worlds = _lodash2.default.chain(_world_names2.default).keyBy('id').mapValues(function (world) {
    _lodash2.default.forEach(_langs2.default, function (lang) {
        return world[lang.slug].link = getWorldLink(lang.slug, world);
    });
    return world;
}).value();

var objectivesMeta = exports.objectivesMeta = _lodash2.default.keyBy([{ map: 'eb', group: 1, id: '9', direction: '' }, // stonemist
{ map: 'eb', group: 2, id: '1', direction: 'N' }, // overlook
{ map: 'eb', group: 2, id: '17', direction: 'NW' }, // mendons
{ map: 'eb', group: 2, id: '20', direction: 'NE' }, // veloka
{ map: 'eb', group: 2, id: '18', direction: 'SW' }, // anz
{ map: 'eb', group: 2, id: '19', direction: 'SE' }, // ogre
{ map: 'eb', group: 2, id: '6', direction: 'W' }, // speldan
{ map: 'eb', group: 2, id: '5', direction: 'E' }, // pang
{ map: 'eb', group: 3, id: '2', direction: 'SE' }, // valley
{ map: 'eb', group: 3, id: '15', direction: 'S' }, // langor
{ map: 'eb', group: 3, id: '22', direction: 'E' }, // bravost
{ map: 'eb', group: 3, id: '16', direction: 'W' }, // quentin
{ map: 'eb', group: 3, id: '21', direction: 'N' }, // durios
{ map: 'eb', group: 3, id: '7', direction: 'SW' }, // dane
{ map: 'eb', group: 3, id: '8', direction: 'NE' }, // umber
{ map: 'eb', group: 4, id: '3', direction: 'SW' }, // lowlands
{ map: 'eb', group: 4, id: '11', direction: 'W' }, // aldons
{ map: 'eb', group: 4, id: '13', direction: 'S' }, // jerrifer
{ map: 'eb', group: 4, id: '12', direction: 'N' }, // wildcreek
{ map: 'eb', group: 4, id: '14', direction: 'E' }, // klovan
{ map: 'eb', group: 4, id: '10', direction: 'NW' }, // rogues
{ map: 'eb', group: 4, id: '4', direction: 'SE' }, // golanta

{ map: 'bl2', group: 1, id: '113', direction: 'N' }, // rampart
{ map: 'bl2', group: 1, id: '106', direction: 'W' }, // undercroft
{ map: 'bl2', group: 1, id: '114', direction: 'E' }, // palace
{ map: 'bl2', group: 2, id: '102', direction: 'NW' }, // academy
{ map: 'bl2', group: 2, id: '104', direction: 'NE' }, // necropolis
{ map: 'bl2', group: 2, id: '99', direction: 'N' }, // lab
{ map: 'bl2', group: 2, id: '115', direction: 'NW' }, // hideaway
{ map: 'bl2', group: 2, id: '109', direction: 'NE' }, // refuge
{ map: 'bl2', group: 3, id: '110', direction: 'SW' }, // outpost
{ map: 'bl2', group: 3, id: '105', direction: 'SE' }, // depot
{ map: 'bl2', group: 3, id: '101', direction: 'SW' }, // encamp
{ map: 'bl2', group: 3, id: '100', direction: 'SE' }, // farm
{ map: 'bl2', group: 3, id: '116', direction: 'S' }], // well
'id');

var mapsMeta = exports.mapsMeta = [{ id: 38, name: 'Eternal Battlegrounds', abbr: 'EB' }, { id: 1099, name: 'Red Borderlands', abbr: 'Red' }, { id: 1102, name: 'Green Borderlands', abbr: 'Grn' }, { id: 1143, name: 'Blue Borderlands', abbr: 'Blu' }];

var objectivesGeo = exports.objectivesGeo = {
    eb: [[{ id: '9', direction: '' }], // stonemist
    [{ id: '1', direction: 'N' }, // overlook
    { id: '17', direction: 'NW' }, // mendons
    { id: '20', direction: 'NE' }, // veloka
    { id: '18', direction: 'SW' }, // anz
    { id: '19', direction: 'SE' }, // ogre
    { id: '6', direction: 'W' }, // speldan
    { id: '5', direction: 'E' }], // pang
    [{ id: '2', direction: 'SE' }, // valley
    { id: '15', direction: 'S' }, // langor
    { id: '22', direction: 'E' }, // bravost
    { id: '16', direction: 'W' }, // quentin
    { id: '21', direction: 'N' }, // durios
    { id: '7', direction: 'SW' }, // dane
    { id: '8', direction: 'NE' }], // umber
    [{ id: '3', direction: 'SW' }, // lowlands
    { id: '11', direction: 'W' }, // aldons
    { id: '13', direction: 'S' }, // jerrifer
    { id: '12', direction: 'N' }, // wildcreek
    { id: '14', direction: 'E' }, // klovan
    { id: '10', direction: 'NW' }, // rogues
    { id: '4', direction: 'SE' }]],
    // golanta
    bl2: [[{ id: '113', direction: 'N' }, // rampart
    { id: '106', direction: 'W' }, // undercroft
    { id: '114', direction: 'E' }], // palace
    [{ id: '102', direction: 'NW' }, // academy
    { id: '104', direction: 'NE' }, // necropolis
    { id: '99', direction: 'N' }, // lab
    { id: '115', direction: 'NW' }, // hideaway
    { id: '109', direction: 'NE' }], // refuge
    [{ id: '110', direction: 'SW' }, // outpost
    { id: '105', direction: 'SE' }, // depot
    { id: '101', direction: 'SW' }, // encamp
    { id: '100', direction: 'SE' }, // farm
    { id: '116', direction: 'S' }]]
};

},{"gw2w2w-static/data/langs":62,"gw2w2w-static/data/objectives_v2_merged":63,"gw2w2w-static/data/world_names":64,"lodash":"lodash"}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getWorldFromSlug = getWorldFromSlug;

var _static = require('lib/static');

function getWorldFromSlug(langSlug, worldSlug) {
    // console.log('getWorldFromSlug()', langSlug, worldSlug);

    var world = _.find(_static.worlds, function (w) {
        return w[langSlug].slug === worldSlug;
    });

    return _extends({
        id: world.id
    }, world[langSlug]);
}

},{"lib/static":48}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = _immutable2.default.Map({
    pending: _immutable2.default.List([])
});

var api = function api() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::api', state, action);

    switch (action.type) {
        case _actionTypes.API_REQUEST_OPEN:
            // console.log('reducer::api', action.type, action.requestKey);
            return state.update('pending', function (u) {
                return u.push(action.requestKey);
            });

        case _actionTypes.API_REQUEST_SUCCESS:
        case _actionTypes.API_REQUEST_FAILED:
            // console.log('reducer::api', action.type, action.requestKey);
            return state.update('pending', function (u) {
                return u.filterNot(function (f) {
                    return f === action.requestKey;
                });
            });

        default:
            return state;
    }
};

exports.default = api;

},{"constants/actionTypes":45,"immutable":"immutable"}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = _immutable2.default.Map();

var guilds = function guilds() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::guilds', state, action);

    switch (action.type) {

        case _actionTypes.INITIALIZE_GUILD:
            // console.log('reducer::guilds', INITIALIZE_GUILD, state, action);
            return state.set(action.guildId, _immutable2.default.Map({
                id: action.guildId,
                loading: true
            }));

        case _actionTypes.RECEIVE_GUILD:
            // console.log('reducer::guilds', RECEIVE_GUILD, state, action);
            return state.set(action.guildId, _immutable2.default.Map({
                id: action.guildId,
                name: action.name,
                tag: action.tag,
                loading: false
            }));

        case _actionTypes.RECEIVE_GUILD_FAILED:
            // console.log('reducer::guilds', RECEIVE_GUILD_FAILED, state, action);
            return state.setIn([action.guildId, 'error'], action.error);

        default:
            return state;
    }
};

exports.default = guilds;

},{"constants/actionTypes":45,"immutable":"immutable"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _guilds = require('./guilds');

var _guilds2 = _interopRequireDefault(_guilds);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _logFilters = require('./logFilters');

var _logFilters2 = _interopRequireDefault(_logFilters);

var _matches = require('./matches');

var _matches2 = _interopRequireDefault(_matches);

var _matchDetails = require('./matchDetails');

var _matchDetails2 = _interopRequireDefault(_matchDetails);

var _now = require('./now');

var _now2 = _interopRequireDefault(_now);

var _objectives = require('./objectives');

var _objectives2 = _interopRequireDefault(_objectives);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _timeouts = require('./timeouts');

var _timeouts2 = _interopRequireDefault(_timeouts);

var _world = require('./world');

var _world2 = _interopRequireDefault(_world);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
    api: _api2.default,
    guilds: _guilds2.default,
    lang: _lang2.default,
    logFilters: _logFilters2.default,
    matches: _matches2.default,
    matchDetails: _matchDetails2.default,
    now: _now2.default,
    objectives: _objectives2.default,
    route: _route2.default,
    timeouts: _timeouts2.default,
    world: _world2.default
});

},{"./api":50,"./guilds":51,"./lang":53,"./logFilters":54,"./matchDetails":55,"./matches":56,"./now":57,"./objectives":58,"./route":59,"./timeouts":60,"./world":61,"redux":"redux"}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSlug = 'en';
var defaultLang = _immutable2.default.fromJS(_static.langs[defaultSlug]);

var lang = function lang() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultLang : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.SET_LANG:
            return _immutable2.default.fromJS(_static.langs[action.slug]);

        default:
            return state;
    }
};

exports.default = lang;

},{"constants/actionTypes":45,"immutable":"immutable","lib/static":48}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = _immutable2.default.Map({
    maps: _immutable2.default.Set(['EB', 'Red', 'Grn', 'Blu']),
    objectiveTypes: _immutable2.default.Set(['castle', 'keep', 'tower', 'camp']),
    eventTypes: _immutable2.default.Set(['capture', 'claim'])
});

var logFilters = function logFilters() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case _actionTypes.LOG_FILTERS_TOGGLE_MAP:
            console.log('reducer::logFilters', action);

            return state.update('maps', function (v) {
                return v.has(action.mapId) ? v.delete(action.mapId) : v.add(action.mapId);
            });

        case _actionTypes.LOG_FILTERS_TOGGLE_OBJECTIVE_TYPE:
            console.log('reducer::logFilters', action);

            return state.update('objectiveTypes', function (v) {
                return v.has(action.objectiveType) ? v.delete(action.objectiveType) : v.add(action.objectiveType);
            });

        case _actionTypes.LOG_FILTERS_TOGGLE_EVENT_TYPE:
            console.log('reducer::logFilters', action);

            return state.update('eventTypes', function (v) {
                return v.has(action.eventType) ? v.delete(action.eventType) : v.add(action.eventType);
            });

        default:
            return state;
    }
};

exports.default = logFilters;

},{"constants/actionTypes":45,"immutable":"immutable"}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultState = exports.timesDefault = exports.mapsDefault = exports.mapDefault = exports.statsDefault = exports.rgbHold = exports.hold = exports.rgbNum = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rgbNum = exports.rgbNum = _immutable2.default.Map({ red: 0, blue: 0, green: 0 });
var hold = exports.hold = _immutable2.default.Map({ castle: 0, keep: 0, tower: 0, camp: 0 });
var rgbHold = exports.rgbHold = _immutable2.default.Map({ red: hold, blue: hold, green: hold });

var statsDefault = exports.statsDefault = _immutable2.default.fromJS({
    deaths: rgbNum,
    kills: rgbNum,
    holdings: rgbHold,
    scores: rgbNum,
    ticks: rgbNum
});

var mapDefault = exports.mapDefault = _immutable2.default.Map({
    id: null,
    lastmod: null,
    guilds: _immutable2.default.OrderedSet(),
    objectives: _immutable2.default.OrderedSet(),
    stats: statsDefault,
    type: null
});

var mapsDefault = exports.mapsDefault = _immutable2.default.List([mapDefault, mapDefault, mapDefault]);

var timesDefault = exports.timesDefault = _immutable2.default.Map({
    lastmod: null,
    endTime: null,
    startTime: null
});

var defaultState = exports.defaultState = _immutable2.default.Map({
    id: null,
    guilds: _immutable2.default.OrderedSet(),
    maps: mapsDefault,
    objectives: _immutable2.default.OrderedSet(),
    region: null,
    times: timesDefault,
    stats: statsDefault,
    worlds: rgbNum,
    lastUpdate: Date.now()
});

var matchDetails = function matchDetails() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::matchDetails', state, action);

    switch (action.type) {

        case _actionTypes.RECEIVE_MATCHDETAILS:
            // console.log('reducer::matchDetails', action);
            return state.withMutations(function (tmpState) {
                return tmpState.set('lastUpdate', Date.now()).set('id', action.id).set('guildIds', action.guildIds).set('maps', action.maps).set('objectiveIds', action.objectiveIds).set('region', action.region).set('stats', action.stats).set('times', action.times).set('worlds', action.worlds);
            });

        case _actionTypes.CLEAR_MATCHDETAILS:
            return defaultState;

        case _actionTypes.RECEIVE_MATCHDETAILS_SUCCESS:
            // console.log('reducer::matchDetails', action);

            return state.set('lastUpdate', Date.now()).delete('error');

        case _actionTypes.RECEIVE_MATCHDETAILS_FAILED:
            console.log('reducer::matchDetails', action);

            return state.set('lastUpdate', Date.now()).set('error', action.err.message);

        default:
            return state;
    }
};

exports.default = matchDetails;

},{"constants/actionTypes":45,"immutable":"immutable"}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = _immutable2.default.Map({
    data: _immutable2.default.Map({}),
    ids: _immutable2.default.List([]),
    lastUpdated: 0
});

var matches = function matches() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::matches', state, action);

    switch (action.type) {

        case _actionTypes.RECEIVE_MATCHES:
            return state.set('data', action.data).set('lastUpdated', action.lastUpdated);

        case _actionTypes.RECEIVE_MATCHES_SUCCESS:
            // console.log('reducer::matches', action);

            return state.has('error') ? state.delete('error') : state;

        case _actionTypes.RECEIVE_MATCHES_FAILED:
            console.log('reducer::matches', action);

            return state.set('error', action.err.message);

        default:
            return state;
    }
};

exports.default = matches;

},{"constants/actionTypes":45,"immutable":"immutable"}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = function route() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? (0, _moment2.default)() : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.SET_NOW:
            return _moment2.default.unix((0, _moment2.default)().unix()); // rounds to second
        // return moment();

        default:
            return state;
    }
};

exports.default = route;

},{"constants/actionTypes":45,"moment":"moment"}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = _immutable2.default.Map();

var objectives = function objectives() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::objectives', state, action);

    switch (action.type) {

        case _actionTypes.OBJECTIVES_RESET:
            // console.log('reducer::objectives', action);

            return defaultState;

        case _actionTypes.OBJECTIVE_UPDATE:
            // console.log('reducer::objectives', action.type, action.objective.get('id'), action.objective.toJS());

            return state.set(action.objective.get('id'), action.objective);

        case _actionTypes.OBJECTIVES_UPDATE:
            // console.log('reducer::objectives', action.type, action.objectives.toJS());

            return action.objectives;

        default:
            return state;
    }
};

exports.default = objectives;

},{"constants/actionTypes":45,"immutable":"immutable"}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = require('constants/actionTypes');

var defaultState = {
    path: '/',
    params: {}
};

var route = function route() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.SET_ROUTE:
            return {
                path: action.path,
                params: action.params
            };

        default:
            return state;
    }
};

exports.default = route;

},{"constants/actionTypes":45}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var timeouts = function timeouts() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    // console.log('reducer::timeouts', state, action);

    switch (action.type) {
        case _actionTypes.ADD_TIMEOUT:
            // console.log('reducer::timeouts', ADD_TIMEOUT, state, action);
            return _extends({}, state, _defineProperty({}, action.name, action.ref));

        case _actionTypes.REMOVE_TIMEOUT:
            // console.log('reducer::timeouts', REMOVE_TIMEOUT, state, action);
            return _lodash2.default.omit(state, action.name);

        // case REMOVE_ALL_TIMEOUTS:
        //     console.log('reducer::timeouts', REMOVE_ALL_TIMEOUTS, state, action);
        //     return {};

        default:
            return state;
    }
};

exports.default = timeouts;

},{"constants/actionTypes":45,"lodash":"lodash"}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = require('constants/actionTypes');

var _worlds = require('lib/worlds');

var world = function world() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.SET_WORLD:
            return (0, _worlds.getWorldFromSlug)(action.langSlug, action.worldSlug);

        case _actionTypes.CLEAR_WORLD:
            return null;

        default:
            return state;
    }
};

exports.default = world;

},{"constants/actionTypes":45,"lib/worlds":49}],62:[function(require,module,exports){
module.exports = {
	"en": {
		"sort": 1,
		"slug": "en",
		"label": "EN",
		"link": "/en",
		"name": "English"
	},
	"de": {
		"sort": 2,
		"slug": "de",
		"label": "DE",
		"link": "/de",
		"name": "Deutsch"
	},
	"es": {
		"sort": 3,
		"slug": "es",
		"label": "ES",
		"link": "/es",
		"name": "Español"
	},
	"fr": {
		"sort": 4,
		"slug": "fr",
		"label": "FR",
		"link": "/fr",
		"name": "Français"
	}
};

},{}],63:[function(require,module,exports){
module.exports = {
    "1099-99": {
        "id": "1099-99",
        "name": {
            "en": "Hamm's Lab",
            "es": "Laboratorio de Hamm",
            "de": "Hamms Labor",
            "fr": "Laboratoire de Hamm"
        },
        "sector_id": 1314,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [10864, 9559.49]
    },
    "1102-99": {
        "id": "1102-99",
        "name": {
            "en": "Lesh's Lab",
            "es": "Laboratorio de Lesh",
            "de": "Leshs Labor",
            "fr": "Laboratoire de Lesh"
        },
        "sector_id": 1291,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [7279.95, 12119.5]
    },
    "1143-99": {
        "id": "1143-99",
        "name": {
            "en": "Zakk's Lab",
            "es": "Laboratorio de Zakk",
            "de": "Zakks Labor",
            "fr": "Laboratoire de Zakk"
        },
        "sector_id": 1358,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [14448, 11479.5]
    },
    "1099-100": {
        "id": "1099-100",
        "name": {
            "en": "Bauer Farmstead",
            "es": "Hacienda de Bauer",
            "de": "Bauer-Gehöft",
            "fr": "Ferme Bauer"
        },
        "sector_id": 1280,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [11793.7, 11258.4]
    },
    "1102-100": {
        "id": "1102-100",
        "name": {
            "en": "Barrett Farmstead",
            "es": "Hacienda de Barrett",
            "de": "Barrett-Gehöft",
            "fr": "Ferme Barrett"
        },
        "sector_id": 1345,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [8209.71, 13818.4]
    },
    "1143-100": {
        "id": "1143-100",
        "name": {
            "en": "Gee Farmstead",
            "es": "Hacienda de Gee",
            "de": "Gee-Gehöft",
            "fr": "Ferme Gee"
        },
        "sector_id": 1292,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [15377.7, 13178.4]
    },
    "1099-101": {
        "id": "1099-101",
        "name": {
            "en": "McLain's Encampment",
            "es": "Campamento de McLain",
            "de": "McLains Lager",
            "fr": "Campement de McLain"
        },
        "sector_id": 1286,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [9712.8, 11263.5]
    },
    "1102-101": {
        "id": "1102-101",
        "name": {
            "en": "Patrick's Encampment",
            "es": "Campamento de Patrick",
            "de": "Patricks Lager",
            "fr": "Campement de Patrick"
        },
        "sector_id": 1342,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6128.8, 13823.5]
    },
    "1143-101": {
        "id": "1143-101",
        "name": {
            "en": "Habib's Encampment",
            "es": "Campamento de Habib",
            "de": "Habibs Lager",
            "fr": "Campement d'Habib"
        },
        "sector_id": 1306,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13296.8, 13183.5]
    },
    "1099-102": {
        "id": "1099-102",
        "name": {
            "en": "O'del Academy",
            "es": "Academia O'del",
            "de": "O'del-Akademie",
            "fr": "Académie de O'del"
        },
        "sector_id": 1352,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [9832.4, 9594.63]
    },
    "1102-102": {
        "id": "1102-102",
        "name": {
            "en": "Y'lan Academy",
            "es": "Academia Y'lan",
            "de": "Y'lan-Akademie",
            "fr": "Académie de Y'lan"
        },
        "sector_id": 1336,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6248.4, 12154.6]
    },
    "1143-102": {
        "id": "1143-102",
        "name": {
            "en": "Kay'li Academy",
            "es": "Academia Kay'li",
            "de": "Kay'li-Akademie",
            "fr": "Académie de Kay'li"
        },
        "sector_id": 1337,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13416.4, 11514.6]
    },
    "1099-104": {
        "id": "1099-104",
        "name": {
            "en": "Eternal Necropolis",
            "es": "Necrópolis Eterna",
            "de": "Ewige Nekropole",
            "fr": "Nécropole éternelle"
        },
        "sector_id": 1308,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [11802.7, 9664.75]
    },
    "1102-104": {
        "id": "1102-104",
        "name": {
            "en": "Deathless Necropolis",
            "es": "Necrópolis Inmortal",
            "de": "Todlose Nekropole",
            "fr": "Nécropole immortelle"
        },
        "sector_id": 1325,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [8218.72, 12224.7]
    },
    "1143-104": {
        "id": "1143-104",
        "name": {
            "en": "Undying Necropolis",
            "es": "Necrópolis Imperecedera",
            "de": "Unsterbliche Nekropole",
            "fr": "Nécropole impérissable"
        },
        "sector_id": 1355,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [15386.7, 11584.7]
    },
    "1099-105": {
        "id": "1099-105",
        "name": {
            "en": "Crankshaft Depot",
            "es": "Depósito de Palancamanijas",
            "de": "Kurbelwellen-Depot",
            "fr": "Dépôt Vilebrequin"
        },
        "sector_id": 1354,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [11264.3, 11609.4]
    },
    "1102-105": {
        "id": "1102-105",
        "name": {
            "en": "Sparkplug Depot",
            "es": "Depósito de Bujías",
            "de": "Zündfunken-Depot",
            "fr": "Dépôt Bougie"
        },
        "sector_id": 1302,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [7680.32, 14169.4]
    },
    "1143-105": {
        "id": "1143-105",
        "name": {
            "en": "Flywheel Depot",
            "es": "Depósito de Volantes",
            "de": "Schwungrad-Depot",
            "fr": "Dépôt Engrenage"
        },
        "sector_id": 1332,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [14848.3, 13529.4]
    },
    "1099-106": {
        "id": "1099-106",
        "name": {
            "en": "Blistering Undercroft",
            "es": "Sótano Achicharrante",
            "de": "Brennende Gruft",
            "fr": "Crypte embrasée"
        },
        "sector_id": 1351,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [9854.58, 10578.5]
    },
    "1102-106": {
        "id": "1102-106",
        "name": {
            "en": "Scorching Undercroft",
            "es": "Sótano Abrasador",
            "de": "Versengende Gruft",
            "fr": "Crypte cuisante"
        },
        "sector_id": 1295,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6270.58, 13138.5]
    },
    "1143-106": {
        "id": "1143-106",
        "name": {
            "en": "Torrid Undercroft",
            "es": "Sótano Sofocante",
            "de": "Glühende Gruft",
            "fr": "Crypte torride"
        },
        "sector_id": 1298,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13438.6, 12498.5]
    },
    "1099-107": {
        "id": "1099-107",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1311,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [12022.5, 11789.9]
    },
    "1102-107": {
        "id": "1102-107",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1310,
        "type": "Spawn",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [8438.49, 14349.9]
    },
    "1143-107": {
        "id": "1143-107",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1349,
        "type": "Spawn",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [15606.5, 13709.9]
    },
    "1099-108": {
        "id": "1099-108",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1350,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [9641.7, 11749.6]
    },
    "1102-108": {
        "id": "1102-108",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1359,
        "type": "Spawn",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6057.7, 14309.6]
    },
    "1143-108": {
        "id": "1143-108",
        "name": {
            "en": "Border",
            "es": "Frontera",
            "de": "Grenze von",
            "fr": "- Frontière"
        },
        "sector_id": 1285,
        "type": "Spawn",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13225.7, 13669.6]
    },
    "1099-109": {
        "id": "1099-109",
        "name": {
            "en": "Roy's Refuge",
            "es": "Refugio de Roy",
            "de": "Roys Zuflucht",
            "fr": "Refuge de Roy"
        },
        "sector_id": 1322,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [11954.6, 10068.5]
    },
    "1102-109": {
        "id": "1102-109",
        "name": {
            "en": "Norfolk's Refuge",
            "es": "Refugio de Norfolk",
            "de": "Norfolks Zuflucht",
            "fr": "Refuge de Norfolk"
        },
        "sector_id": 1290,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [8370.6, 12628.5]
    },
    "1143-109": {
        "id": "1143-109",
        "name": {
            "en": "Olivier's Refuge",
            "es": "Refugio de Olivier",
            "de": "Oliviers Zuflucht",
            "fr": "Refuge d'Olivier"
        },
        "sector_id": 1304,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [15538.6, 11988.5]
    },
    "1099-110": {
        "id": "1099-110",
        "name": {
            "en": "Parched Outpost",
            "es": "Puesto Avanzado Abrasado",
            "de": "Verdörrter Außenposten",
            "fr": "Avant-poste dévasté"
        },
        "sector_id": 1277,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [10255, 11576]
    },
    "1102-110": {
        "id": "1102-110",
        "name": {
            "en": "Withered Outpost",
            "es": "Puesto Avanzado Desolado",
            "de": "Welker Außenposten",
            "fr": "Avant-poste ravagé"
        },
        "sector_id": 1283,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6671.05, 14136]
    },
    "1143-110": {
        "id": "1143-110",
        "name": {
            "en": "Barren Outpost",
            "es": "Puesto Avanzado Abandonado",
            "de": "Öder Außenposten",
            "fr": "Avant-poste délabré"
        },
        "sector_id": 1328,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13839, 13496]
    },
    "1099-113": {
        "id": "1099-113",
        "name": {
            "en": "Stoic Rampart",
            "es": "Muralla Estoica",
            "de": "Stoischer Festungswall",
            "fr": "Rempart stoïque"
        },
        "sector_id": 1303,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [10812.3, 10102.9]
    },
    "1102-113": {
        "id": "1102-113",
        "name": {
            "en": "Impassive Rampart",
            "es": "Muralla Imperturbable",
            "de": "Unbeeindruckter Festungswall",
            "fr": "Rempart impassible"
        },
        "sector_id": 1318,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [7228.32, 12662.9]
    },
    "1143-113": {
        "id": "1143-113",
        "name": {
            "en": "Hardened Rampart",
            "es": "Muralla Endurecida",
            "de": "Stahlharter Festungswall",
            "fr": "Rempart durci"
        },
        "sector_id": 1293,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [14396.3, 12022.9]
    },
    "1099-114": {
        "id": "1099-114",
        "name": {
            "en": "Osprey's Palace",
            "es": "Palacio del Águila Pescadora",
            "de": "Fischadler-Palast",
            "fr": "Palais du balbuzard"
        },
        "sector_id": 1300,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [11788, 10660.2]
    },
    "1102-114": {
        "id": "1102-114",
        "name": {
            "en": "Harrier's Palace",
            "es": "Palacio del Aguilucho",
            "de": "Weihen-Palast",
            "fr": "Palais du circaète"
        },
        "sector_id": 1287,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [8204, 13220.2]
    },
    "1143-114": {
        "id": "1143-114",
        "name": {
            "en": "Shrike's Palace",
            "es": "Palacio del Alcaudón",
            "de": "Würger-Palast",
            "fr": "Palais de la pie-grièche"
        },
        "sector_id": 1356,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [15372, 12580.2]
    },
    "1099-115": {
        "id": "1099-115",
        "name": {
            "en": "Boettiger's Hideaway",
            "es": "Escondrijo de Boettiger",
            "de": "Boettigers Versteck",
            "fr": "Antre de Boettiger"
        },
        "sector_id": 1316,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [9585.9, 10037.1]
    },
    "1102-115": {
        "id": "1102-115",
        "name": {
            "en": "Hughe's Hideaway",
            "es": "Escondrijo de Hughe",
            "de": "Hughes Versteck",
            "fr": "Antre de Hughe"
        },
        "sector_id": 1324,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [6001.9, 12597.1]
    },
    "1143-115": {
        "id": "1143-115",
        "name": {
            "en": "Berdrow's Hideaway",
            "es": "Escondrijo de Berdrow",
            "de": "Berdrows Versteck",
            "fr": "Antre de Berdrow"
        },
        "sector_id": 1357,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [13169.9, 11957.1]
    },
    "1099-116": {
        "id": "1099-116",
        "name": {
            "en": "Dustwhisper Well",
            "es": "Pozo del Murmullo de Polvo",
            "de": "Brunnen des Staubflüsterns",
            "fr": "Puits du Souffle-poussière"
        },
        "sector_id": 1296,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [10773.3, 11652.5]
    },
    "1102-116": {
        "id": "1102-116",
        "name": {
            "en": "Smashedhope Well",
            "es": "Pozo Tragaesperanza",
            "de": "Brunnen der Zerschlagenen Hoffnung",
            "fr": "Puits du Rêve-brisé"
        },
        "sector_id": 1338,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [7189.29, 14212.5]
    },
    "1143-116": {
        "id": "1143-116",
        "name": {
            "en": "Lastgasp Well",
            "es": "Pozo del Último Suspiro",
            "de": "Brunnen des Letzten Schnaufers",
            "fr": "Puits du Dernier-soupir"
        },
        "sector_id": 1301,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [14357.3, 13572.5]
    },
    "1099-117": {
        "id": "1099-117",
        "name": {
            "en": "Citadel",
            "es": "Ciudadela",
            "de": "Zitadelle von",
            "fr": "- Citadelle"
        },
        "sector_id": 1343,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 1099,
        "coord": [10590.2, 9169.19]
    },
    "1102-117": {
        "id": "1102-117",
        "name": {
            "en": "Citadel",
            "es": "Ciudadela",
            "de": "Zitadelle von",
            "fr": "- Citadelle"
        },
        "sector_id": 1315,
        "type": "Spawn",
        "map_type": "GreenHome",
        "map_id": 1102,
        "coord": [7006.19, 11729.2]
    },
    "1143-117": {
        "id": "1143-117",
        "name": {
            "en": "Citadel",
            "es": "Ciudadela",
            "de": "Zitadelle von",
            "fr": "- Citadelle"
        },
        "sector_id": 1279,
        "type": "Spawn",
        "map_type": "BlueHome",
        "map_id": 1143,
        "coord": [14174.2, 11089.2]
    },
    "95-48": {
        "id": "95-48",
        "name": {
            "en": "Faithleap",
            "es": "Salto de Fe",
            "de": "Glaubenssprung",
            "fr": "Saut de la Foi"
        },
        "sector_id": 1010,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-11": {
        "id": "38-11",
        "name": {
            "en": "Aldon's Ledge",
            "es": "Cornisa de Aldon",
            "de": "Aldons Vorsprung",
            "fr": "Corniche d'Aldon"
        },
        "sector_id": 882,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9417.39, 14790.7]
    },
    "95-43": {
        "id": "95-43",
        "name": {
            "en": "Hero's Lodge",
            "es": "Albergue del Héroe",
            "de": "Heldenhalle",
            "fr": "Pavillon du Héros"
        },
        "sector_id": 1004,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "94-62": {
        "id": "94-62",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Ruins",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-31": {
        "id": "96-31",
        "name": {
            "en": "Ascension Bay",
            "es": "Bahía de la Ascensión",
            "de": "Aufstiegsbucht",
            "fr": "Baie de l'Ascension"
        },
        "sector_id": 973,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-29": {
        "id": "96-29",
        "name": {
            "en": "The Spiritholme",
            "es": "La Isleta Espiritual",
            "de": "Der Geistholm",
            "fr": "Le Heaume spirituel"
        },
        "sector_id": 978,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "38-1": {
        "id": "38-1",
        "name": {
            "en": "Overlook",
            "es": "Mirador",
            "de": "Aussichtspunkt von",
            "fr": "- Belvédère"
        },
        "sector_id": 843,
        "type": "Keep",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10698.4, 13761]
    },
    "38-15": {
        "id": "38-15",
        "name": {
            "en": "Langor Gulch",
            "es": "Barranco Langor",
            "de": "Langor-Schlucht",
            "fr": "Ravin de Langor"
        },
        "sector_id": 887,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11465.3, 15569.6]
    },
    "38-3": {
        "id": "38-3",
        "name": {
            "en": "Lowlands",
            "es": "Tierras bajas",
            "de": "Tiefland von",
            "fr": "- Basses terres"
        },
        "sector_id": 848,
        "type": "Keep",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9840.25, 14983.6]
    },
    "38-17": {
        "id": "38-17",
        "name": {
            "en": "Mendon's Gap",
            "es": "Zanja de Mendon",
            "de": "Mendons Spalt",
            "fr": "Faille de Mendon"
        },
        "sector_id": 890,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10192.7, 13410.8]
    },
    "94-35": {
        "id": "94-35",
        "name": {
            "en": "Greenbriar",
            "es": "Zarzaverde",
            "de": "Grünstrauch",
            "fr": "Vert-bruyère"
        },
        "sector_id": 964,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-7": {
        "id": "38-7",
        "name": {
            "en": "Danelon Passage",
            "es": "Pasaje Danelon",
            "de": "Danelon-Passage",
            "fr": "Passage Danelon"
        },
        "sector_id": 837,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10996.4, 15545.8]
    },
    "96-27": {
        "id": "96-27",
        "name": {
            "en": "Garrison",
            "es": "Fuerte",
            "de": "Festung von",
            "fr": "- Garnison"
        },
        "sector_id": 976,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "94-103": {
        "id": "94-103",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-30": {
        "id": "96-30",
        "name": {
            "en": "Woodhaven",
            "es": "Refugio Forestal",
            "de": "Wald-Freistatt",
            "fr": "Boisrefuge"
        },
        "sector_id": 988,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "95-41": {
        "id": "95-41",
        "name": {
            "en": "Shadaran Hills",
            "es": "Colinas Shadaran",
            "de": "Shadaran-Hügel",
            "fr": "Collines Shadaran"
        },
        "sector_id": 996,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "94-32": {
        "id": "94-32",
        "name": {
            "en": "Etheron Hills",
            "es": "Colinas Etheron",
            "de": "Etheron-Hügel",
            "fr": "Collines d'Etheron"
        },
        "sector_id": 962,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 94
    },
    "95-56": {
        "id": "95-56",
        "name": {
            "en": "The Titanpaw",
            "es": "La Garra del Titán",
            "de": "Die Titanenpranke",
            "fr": "Bras du Titan"
        },
        "sector_id": 998,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "95-75": {
        "id": "95-75",
        "name": {
            "en": "Daemonspell Lake",
            "es": "Lago Daemonia",
            "de": "Dämonenzauber-See",
            "fr": "Lac de Maldémon"
        },
        "sector_id": 994,
        "type": "Ruins",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-9": {
        "id": "38-9",
        "name": {
            "en": "Stonemist Castle",
            "es": "Castillo Piedraniebla",
            "de": "Schloss Steinnebel",
            "fr": "Château Brumepierre"
        },
        "sector_id": 833,
        "type": "Castle",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10627.3, 14501.3]
    },
    "95-57": {
        "id": "95-57",
        "name": {
            "en": "Cragtop",
            "es": "Cumbrepeñasco",
            "de": "Schroffgipfel",
            "fr": "Sommet de Hautcrag"
        },
        "sector_id": 1006,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-5": {
        "id": "38-5",
        "name": {
            "en": "Pangloss Rise",
            "es": "Colina Pangloss",
            "de": "Pangloss-Anhöhe",
            "fr": "Montée de Pangloss"
        },
        "sector_id": 846,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11201.6, 13718.4]
    },
    "94-33": {
        "id": "94-33",
        "name": {
            "en": "Dreaming Bay",
            "es": "Bahía Onírica",
            "de": "Traumbucht",
            "fr": "Baie des rêves"
        },
        "sector_id": 957,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 94
    },
    "95-42": {
        "id": "95-42",
        "name": {
            "en": "Redlake",
            "es": "Lagorrojo",
            "de": "Rotsee",
            "fr": "Lac rouge"
        },
        "sector_id": 1008,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-21": {
        "id": "38-21",
        "name": {
            "en": "Durios Gulch",
            "es": "Barranco Durios",
            "de": "Durios-Schlucht",
            "fr": "Ravin de Durios"
        },
        "sector_id": 888,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11207.1, 14595]
    },
    "95-54": {
        "id": "95-54",
        "name": {
            "en": "Foghaven",
            "es": "Refugio Neblinoso",
            "de": "Nebel-Freistatt",
            "fr": "Havre gris"
        },
        "sector_id": 995,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "95-55": {
        "id": "95-55",
        "name": {
            "en": "Redwater Lowlands",
            "es": "Tierras Bajas de Aguarroja",
            "de": "Rotwasser-Tiefland",
            "fr": "Basses terres de Rubicon"
        },
        "sector_id": 1003,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "96-26": {
        "id": "96-26",
        "name": {
            "en": "Greenlake",
            "es": "Lagoverde",
            "de": "Grünsee",
            "fr": "Lac vert"
        },
        "sector_id": 989,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "38-20": {
        "id": "38-20",
        "name": {
            "en": "Veloka Slope",
            "es": "Pendiente Veloka",
            "de": "Veloka-Hang",
            "fr": "Flanc de Veloka"
        },
        "sector_id": 891,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11017.4, 13414.4]
    },
    "95-44": {
        "id": "95-44",
        "name": {
            "en": "Dreadfall Bay",
            "es": "Bahía Salto Aciago",
            "de": "Schreckensfall-Bucht",
            "fr": "Baie du Noir déclin"
        },
        "sector_id": 999,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "95-45": {
        "id": "95-45",
        "name": {
            "en": "Bluebriar",
            "es": "Zarzazul",
            "de": "Blaustrauch",
            "fr": "Bruyazur"
        },
        "sector_id": 1009,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-14": {
        "id": "38-14",
        "name": {
            "en": "Klovan Gully",
            "es": "Barranco Klovan",
            "de": "Klovan-Senke",
            "fr": "Petit ravin de Klovan"
        },
        "sector_id": 884,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10219.5, 15107.6]
    },
    "38-13": {
        "id": "38-13",
        "name": {
            "en": "Jerrifer's Slough",
            "es": "Cenagal de Jerrifer",
            "de": "Jerrifers Sumpfloch",
            "fr": "Bourbier de Jerrifer"
        },
        "sector_id": 883,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9757.06, 15467.8]
    },
    "94-65": {
        "id": "94-65",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Ruins",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-38": {
        "id": "94-38",
        "name": {
            "en": "Longview",
            "es": "Vistaluenga",
            "de": "Weitsicht",
            "fr": "Longuevue"
        },
        "sector_id": 955,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-6": {
        "id": "38-6",
        "name": {
            "en": "Speldan Clearcut",
            "es": "Claro Espeldia",
            "de": "Speldan-Kahlschlag",
            "fr": "Forêt rasée de Speldan"
        },
        "sector_id": 844,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9739.81, 13586.9]
    },
    "94-39": {
        "id": "94-39",
        "name": {
            "en": "The Godsword",
            "es": "La Hoja Divina",
            "de": "Das Gottesschwert",
            "fr": "L'Epée divine"
        },
        "sector_id": 953,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-64": {
        "id": "94-64",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Ruins",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-37": {
        "id": "94-37",
        "name": {
            "en": "Garrison",
            "es": "Fuerte",
            "de": "Festung von",
            "fr": "- Garnison"
        },
        "sector_id": 952,
        "type": "Keep",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-2": {
        "id": "38-2",
        "name": {
            "en": "Valley",
            "es": "Valle",
            "de": "Tal von",
            "fr": "- Vallée"
        },
        "sector_id": 834,
        "type": "Keep",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11268.9, 15087.7]
    },
    "95-47": {
        "id": "95-47",
        "name": {
            "en": "Sunnyhill",
            "es": "Colina Soleada",
            "de": "Sonnenhügel",
            "fr": "Colline ensoleillée"
        },
        "sector_id": 1007,
        "type": "Tower",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "96-67": {
        "id": "96-67",
        "name": {
            "en": "Devilheart Lake",
            "es": "Lago Corazonvil",
            "de": "Teufelsherz-See",
            "fr": "Lac Diablecœur"
        },
        "sector_id": 975,
        "type": "Ruins",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-68": {
        "id": "96-68",
        "name": {
            "en": "Devilheart Lake",
            "es": "Lago Corazonvil",
            "de": "Teufelsherz-See",
            "fr": "Lac Diablecœur"
        },
        "sector_id": 975,
        "type": "Ruins",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "94-53": {
        "id": "94-53",
        "name": {
            "en": "Greenvale Refuge",
            "es": "Refugio Valleverde",
            "de": "Grüntal-Zuflucht",
            "fr": "Refuge de Valvert"
        },
        "sector_id": 971,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-12": {
        "id": "38-12",
        "name": {
            "en": "Wildcreek Run",
            "es": "Pista Arroyosalvaje",
            "de": "Wildbach-Strecke",
            "fr": "Piste du ruisseau sauvage"
        },
        "sector_id": 885,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9958.23, 14605.7]
    },
    "96-25": {
        "id": "96-25",
        "name": {
            "en": "Redbriar",
            "es": "Zarzarroja",
            "de": "Rotstrauch",
            "fr": "Bruyerouge"
        },
        "sector_id": 990,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "94-111": {
        "id": "94-111",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-112": {
        "id": "94-112",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Spawn",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-71": {
        "id": "96-71",
        "name": {
            "en": "Devilheart Lake",
            "es": "Lago Corazonvil",
            "de": "Teufelsherz-See",
            "fr": "Lac Diablecœur"
        },
        "sector_id": 975,
        "type": "Ruins",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "95-46": {
        "id": "95-46",
        "name": {
            "en": "Garrison",
            "es": "Fuerte",
            "de": "Festung von",
            "fr": "- Garnison"
        },
        "sector_id": 992,
        "type": "Keep",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "94-52": {
        "id": "94-52",
        "name": {
            "en": "Arah's Hope",
            "es": "Esperanza de Arah",
            "de": "Arahs Hoffnung",
            "fr": "Espoir d'Arah"
        },
        "sector_id": 956,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-16": {
        "id": "38-16",
        "name": {
            "en": "Quentin Lake",
            "es": "Lago Quentin",
            "de": "Quentin-See",
            "fr": "Lac Quentin"
        },
        "sector_id": 889,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10951.8, 15121.2]
    },
    "38-22": {
        "id": "38-22",
        "name": {
            "en": "Bravost Escarpment",
            "es": "Escarpadura Bravost",
            "de": "Bravost-Abhang",
            "fr": "Falaise de Bravost"
        },
        "sector_id": 886,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11750.2, 14859.4]
    },
    "95-49": {
        "id": "95-49",
        "name": {
            "en": "Bluevale Refuge",
            "es": "Refugio Valleazul",
            "de": "Blautal-Zuflucht",
            "fr": "Refuge de Bleuval"
        },
        "sector_id": 1005,
        "type": "Camp",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-19": {
        "id": "38-19",
        "name": {
            "en": "Ogrewatch Cut",
            "es": "Tajo de la Guardia del Ogro",
            "de": "Ogerwacht-Kanal",
            "fr": "Percée de Gardogre"
        },
        "sector_id": 892,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10965, 13951]
    },
    "95-76": {
        "id": "95-76",
        "name": {
            "en": "Daemonspell Lake",
            "es": "Lago Daemonia",
            "de": "Dämonenzauber-See",
            "fr": "Lac de Maldémon"
        },
        "sector_id": 994,
        "type": "Ruins",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "95-73": {
        "id": "95-73",
        "name": {
            "en": "Daemonspell Lake",
            "es": "Lago Daemonia",
            "de": "Dämonenzauber-See",
            "fr": "Lac de Maldémon"
        },
        "sector_id": 994,
        "type": "Ruins",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "94-51": {
        "id": "94-51",
        "name": {
            "en": "Astralholme",
            "es": "Isleta Astral",
            "de": "Astralholm",
            "fr": "Heaume astral"
        },
        "sector_id": 960,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-66": {
        "id": "94-66",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Ruins",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-4": {
        "id": "38-4",
        "name": {
            "en": "Golanta Clearing",
            "es": "Claro Golanta",
            "de": "Golanta-Lichtung",
            "fr": "Clairière de Golanta"
        },
        "sector_id": 849,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10198.9, 15520.2]
    },
    "94-34": {
        "id": "94-34",
        "name": {
            "en": "Victor's Lodge",
            "es": "Albergue del Vencedor",
            "de": "Sieger-Halle",
            "fr": "Pavillon du Vainqueur"
        },
        "sector_id": 963,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-28": {
        "id": "96-28",
        "name": {
            "en": "Dawn's Eyrie",
            "es": "Aguilera del Alba",
            "de": "Horst der Morgendämmerung",
            "fr": "Repaire de l'aube"
        },
        "sector_id": 987,
        "type": "Tower",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-59": {
        "id": "96-59",
        "name": {
            "en": "Redvale Refuge",
            "es": "Refugio Vallerrojo",
            "de": "Rottal-Zuflucht",
            "fr": "Refuge de Valrouge"
        },
        "sector_id": 985,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "94-36": {
        "id": "94-36",
        "name": {
            "en": "Bluelake",
            "es": "Lagoazul",
            "de": "Blausee",
            "fr": "Lac bleu"
        },
        "sector_id": 965,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 94
    },
    "94-50": {
        "id": "94-50",
        "name": {
            "en": "Bluewater Lowlands",
            "es": "Tierras Bajas de Aguazul",
            "de": "Blauwasser-Tiefland",
            "fr": "Basses terres d'Eau-Azur"
        },
        "sector_id": 972,
        "type": "Camp",
        "map_type": "RedHome",
        "map_id": 94
    },
    "38-8": {
        "id": "38-8",
        "name": {
            "en": "Umberglade Woods",
            "es": "Bosques Clarosombra",
            "de": "Umberlichtung-Forst",
            "fr": "Bois d'Ombreclair"
        },
        "sector_id": 835,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [11680.9, 14353.6]
    },
    "94-63": {
        "id": "94-63",
        "name": {
            "en": "Demontrance Lake",
            "es": "Lago Trancedemoníaco",
            "de": "Dämonentrance-See",
            "fr": "Lac Maletranse"
        },
        "sector_id": 958,
        "type": "Ruins",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-70": {
        "id": "96-70",
        "name": {
            "en": "Devilheart Lake",
            "es": "Lago Corazonvil",
            "de": "Teufelsherz-See",
            "fr": "Lac Diablecœur"
        },
        "sector_id": 975,
        "type": "Ruins",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-69": {
        "id": "96-69",
        "name": {
            "en": "Devilheart Lake",
            "es": "Lago Corazonvil",
            "de": "Teufelsherz-See",
            "fr": "Lac Diablecœur"
        },
        "sector_id": 975,
        "type": "Ruins",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-60": {
        "id": "96-60",
        "name": {
            "en": "Stargrove",
            "es": "Arboleda de las Estrellas",
            "de": "Sternhain",
            "fr": "Bosquet étoilé"
        },
        "sector_id": 986,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "94-40": {
        "id": "94-40",
        "name": {
            "en": "Cliffside",
            "es": "Despeñadero",
            "de": "Felswand",
            "fr": "Flanc de falaise"
        },
        "sector_id": 959,
        "type": "Tower",
        "map_type": "RedHome",
        "map_id": 94
    },
    "96-61": {
        "id": "96-61",
        "name": {
            "en": "Greenwater Lowlands",
            "es": "Tierras bajas de Aguaverde",
            "de": "Grünwasser-Tiefland",
            "fr": "Basses terres d'Eau-Verdoyante"
        },
        "sector_id": 983,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "96-23": {
        "id": "96-23",
        "name": {
            "en": "Askalion Hills",
            "es": "Colinas Askalion",
            "de": "Askalion-Hügel",
            "fr": "Collines d'Askalion"
        },
        "sector_id": 979,
        "type": "Keep",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "95-74": {
        "id": "95-74",
        "name": {
            "en": "Daemonspell Lake",
            "es": "Lago Daemonia",
            "de": "Dämonenzauber-See",
            "fr": "Lac de Maldémon"
        },
        "sector_id": 994,
        "type": "Ruins",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "38-10": {
        "id": "38-10",
        "name": {
            "en": "Rogue's Quarry",
            "es": "Cantera del Pícaro",
            "de": "Schurkenbruch",
            "fr": "Carrière du voleur"
        },
        "sector_id": 851,
        "type": "Camp",
        "map_type": "Center",
        "map_id": 38,
        "coord": [9612.54, 14462.8]
    },
    "96-24": {
        "id": "96-24",
        "name": {
            "en": "Champion's Demesne",
            "es": "Patrimonio del Campeón",
            "de": "Champions Landsitz",
            "fr": "Fief du Champion"
        },
        "sector_id": 984,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "38-18": {
        "id": "38-18",
        "name": {
            "en": "Anzalias Pass",
            "es": "Paso Anzalias",
            "de": "Anzalias-Pass",
            "fr": "Col d'Anzalias"
        },
        "sector_id": 893,
        "type": "Tower",
        "map_type": "Center",
        "map_id": 38,
        "coord": [10243.3, 13974.4]
    },
    "95-72": {
        "id": "95-72",
        "name": {
            "en": "Daemonspell Lake",
            "es": "Lago Daemonia",
            "de": "Dämonenzauber-See",
            "fr": "Lac de Maldémon"
        },
        "sector_id": 994,
        "type": "Ruins",
        "map_type": "GreenHome",
        "map_id": 95
    },
    "96-58": {
        "id": "96-58",
        "name": {
            "en": "Godslore",
            "es": "Sabiduría de los Dioses",
            "de": "Gottessage",
            "fr": "Savoir divin"
        },
        "sector_id": 991,
        "type": "Camp",
        "map_type": "BlueHome",
        "map_id": 96
    },
    "968-98": {
        "id": "968-98",
        "name": {
            "en": "Wurm Tunnel",
            "es": "Túnel de la Sierpe",
            "de": "Wurmtunnel",
            "fr": "Tunnel de guivre"
        },
        "sector_id": 1156,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [6750.92, 10211.1],
        "marker": "https://render.guildwars2.com/file/087491CDD56F7FB998C332360D32FD26A8B2A99D/730428.png"
    },
    "968-96": {
        "id": "968-96",
        "name": {
            "en": "Airport",
            "es": "Aeropuerto",
            "de": "Flughafen",
            "fr": "Aéroport"
        },
        "sector_id": 1153,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7054.16, 10421],
        "marker": "https://render.guildwars2.com/file/ACCCB1BD617598C0EA9C756EADE53DF36C2578EC/730427.png"
    },
    "968-82": {
        "id": "968-82",
        "name": {
            "en": "Thunder Hollow Reactor",
            "es": "Reactor de Hondonada del Trueno",
            "de": "Donnersenkenreaktor",
            "fr": "Réacteur de Tonnecrevasse"
        },
        "sector_id": 1168,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [8282.77, 10425.9],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-93": {
        "id": "968-93",
        "name": {
            "en": "Forge",
            "es": "Forja",
            "de": "Schmiede",
            "fr": "Forge"
        },
        "sector_id": 1154,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [8223.64, 10692.2],
        "marker": "https://render.guildwars2.com/file/D1AB541FC3BE12AC5BBB020212BEBE3F5C0C4315/730415.png"
    },
    "968-80": {
        "id": "968-80",
        "name": {
            "en": "Overgrown Fane Reactor",
            "es": "Reactor de Fano Gigante",
            "de": "Überwucherter Gotteshaus-Reaktor",
            "fr": "Réacteur du Temple surdimensionné"
        },
        "sector_id": 1162,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7513.83, 9059.96],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-94": {
        "id": "968-94",
        "name": {
            "en": "Shrine",
            "es": "Santuario",
            "de": "Schrein",
            "fr": "Sanctuaire"
        },
        "sector_id": 1164,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [8614.89, 10246.4],
        "marker": "https://render.guildwars2.com/file/B5709941B0352FD4CA3B7AFDA42873D8EFDB15AD/730414.png"
    },
    "968-90": {
        "id": "968-90",
        "name": {
            "en": "Altar",
            "es": "Altar",
            "de": "Altar",
            "fr": "Autel"
        },
        "sector_id": 1160,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7240.66, 9253.9],
        "marker": "https://render.guildwars2.com/file/DC01EC41D8809B59B85BEEDC45E9556D730BD21A/730413.png"
    },
    "968-97": {
        "id": "968-97",
        "name": {
            "en": "Workshop",
            "es": "Taller",
            "de": "Werkstatt",
            "fr": "Atelier"
        },
        "sector_id": 1152,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [6837.6, 10845.1],
        "marker": "https://render.guildwars2.com/file/B34C2E3D0F34FD03F44BB5ED4E18DCDD0059A5C4/730429.png"
    },
    "968-81": {
        "id": "968-81",
        "name": {
            "en": "Arid Fortress Reactor",
            "es": "Reactor de Fortaleza Árida",
            "de": "Dürrefestungreaktor",
            "fr": "Réacteur de la Forteresse aride"
        },
        "sector_id": 1163,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [6823.83, 10479.5],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-83": {
        "id": "968-83",
        "name": {
            "en": "Stonegaze Spire Reactor",
            "es": "Reactor de Aguja de Mirapiedras",
            "de": "Steinblick-Zackenstabreaktor",
            "fr": "Réacteur du Pic de Pierregard"
        },
        "sector_id": 1167,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7249.21, 9763.87],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-95": {
        "id": "968-95",
        "name": {
            "en": "Bell Tower",
            "es": "Campanario",
            "de": "Glockenturm",
            "fr": "Clocher"
        },
        "sector_id": 1173,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [8180.68, 10325.2],
        "marker": "https://render.guildwars2.com/file/D4180774DD03A4BC7252B952680E451F16679A72/730410.png"
    },
    "968-91": {
        "id": "968-91",
        "name": {
            "en": "Observatory",
            "es": "Observatorio",
            "de": "Observatorium",
            "fr": "Observatoire"
        },
        "sector_id": 1158,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7953.67, 9062.79],
        "marker": "https://render.guildwars2.com/file/015CF16C78DFDAD742E1A5613FB74B6463BF4A70/730411.png"
    },
    "968-78": {
        "id": "968-78",
        "name": {
            "en": "Overgrown Fane",
            "es": "Fano Gigante",
            "de": "Überwuchertes Gotteshaus",
            "fr": "Temple surdimensionné"
        },
        "sector_id": 1161,
        "type": "Keep",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7606.7, 8882.14],
        "marker": "https://render.guildwars2.com/file/9615D975B16C2CF46AF6B20E2541CED993EFA1EE/730409.png"
    },
    "968-88": {
        "id": "968-88",
        "name": {
            "en": "Arid Fortress",
            "es": "Fortaleza Árida",
            "de": "Dürrefestung",
            "fr": "Forteresse aride"
        },
        "sector_id": 1157,
        "type": "Keep",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [6442.17, 10881.8],
        "marker": "https://render.guildwars2.com/file/9615D975B16C2CF46AF6B20E2541CED993EFA1EE/730409.png"
    },
    "968-89": {
        "id": "968-89",
        "name": {
            "en": "Tytone Perch",
            "es": "Percha de Tytone",
            "de": "Tytonenwarte",
            "fr": "Perchoir de Tytone"
        },
        "sector_id": 1172,
        "type": "Tower",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7884.81, 9809.2],
        "marker": "https://render.guildwars2.com/file/D73DBE6D90140DC127F1DFBD90ACB77EE8701370/730416.png"
    },
    "968-79": {
        "id": "968-79",
        "name": {
            "en": "Thunder Hollow",
            "es": "Hondonada del Trueno",
            "de": "Donnersenke",
            "fr": "Tonnecrevasse"
        },
        "sector_id": 1169,
        "type": "Keep",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [8506.75, 10824.5],
        "marker": "https://render.guildwars2.com/file/9615D975B16C2CF46AF6B20E2541CED993EFA1EE/730409.png"
    },
    "968-85": {
        "id": "968-85",
        "name": {
            "en": "Tytone Perch Reactor",
            "es": "Reactor de Percha de Tytone",
            "de": "Tytonenwarte-Reaktor",
            "fr": "Réacteur du Perchoir de Tytone"
        },
        "sector_id": 1165,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7852.89, 9855.56],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-77": {
        "id": "968-77",
        "name": {
            "en": "Inferno's Needle",
            "es": "Aguja del Infierno",
            "de": "Infernonadel",
            "fr": "Aiguille infernale"
        },
        "sector_id": 1171,
        "type": "Tower",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7504.84, 10598.5],
        "marker": "https://render.guildwars2.com/file/D73DBE6D90140DC127F1DFBD90ACB77EE8701370/730416.png"
    },
    "968-87": {
        "id": "968-87",
        "name": {
            "en": "Stonegaze Spire",
            "es": "Aguja de Mirapiedras",
            "de": "Steinblick-Zackenstab",
            "fr": "Pic de Pierregard"
        },
        "sector_id": 1170,
        "type": "Tower",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7164.46, 9805.15],
        "marker": "https://render.guildwars2.com/file/D73DBE6D90140DC127F1DFBD90ACB77EE8701370/730416.png"
    },
    "968-84": {
        "id": "968-84",
        "name": {
            "en": "Inferno's Needle Reactor",
            "es": "Reactor de Aguja del Infierno",
            "de": "Infernonadel-Reaktor",
            "fr": "Réacteur de l'Aiguille infernale"
        },
        "sector_id": 1166,
        "type": "Resource",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7581.91, 10316.4],
        "marker": "https://render.guildwars2.com/file/E89AAD28DA43D545D7E3681499049CB73C0E2FEE/102650.png"
    },
    "968-92": {
        "id": "968-92",
        "name": {
            "en": "Statuary",
            "es": "Estatuario",
            "de": "Statue",
            "fr": "Statue"
        },
        "sector_id": 1159,
        "type": "Generic",
        "map_type": "EdgeOfTheMists",
        "map_id": 968,
        "coord": [7553.12, 9360.16],
        "marker": "https://render.guildwars2.com/file/4C0113B6DF2E4E2CBB93244AD50DA49456D5014E/730412.png"
    }
};

},{}],64:[function(require,module,exports){
module.exports = {
	"1001": {
		"id": "1001",
		"region": "1",
		"de": {
			"name": "Ambossfels",
			"slug": "ambossfels"
		},
		"en": {
			"name": "Anvil Rock",
			"slug": "anvil-rock"
		},
		"es": {
			"name": "Roca del Yunque",
			"slug": "roca-del-yunque"
		},
		"fr": {
			"name": "Rocher de l'enclume",
			"slug": "rocher-de-lenclume"
		}
	},
	"1002": {
		"id": "1002",
		"region": "1",
		"de": {
			"name": "Borlis-Pass",
			"slug": "borlis-pass"
		},
		"en": {
			"name": "Borlis Pass",
			"slug": "borlis-pass"
		},
		"es": {
			"name": "Paso de Borlis",
			"slug": "paso-de-borlis"
		},
		"fr": {
			"name": "Passage de Borlis",
			"slug": "passage-de-borlis"
		}
	},
	"1003": {
		"id": "1003",
		"region": "1",
		"de": {
			"name": "Jakbiegung",
			"slug": "jakbiegung"
		},
		"en": {
			"name": "Yak's Bend",
			"slug": "yaks-bend"
		},
		"es": {
			"name": "Declive del Yak",
			"slug": "declive-del-yak"
		},
		"fr": {
			"name": "Courbe du Yak",
			"slug": "courbe-du-yak"
		}
	},
	"1004": {
		"id": "1004",
		"region": "1",
		"de": {
			"name": "Denravis Erdwerk",
			"slug": "denravis-erdwerk"
		},
		"en": {
			"name": "Henge of Denravi",
			"slug": "henge-of-denravi"
		},
		"es": {
			"name": "Círculo de Denravi",
			"slug": "circulo-de-denravi"
		},
		"fr": {
			"name": "Cromlech de Denravi",
			"slug": "cromlech-de-denravi"
		}
	},
	"1005": {
		"id": "1005",
		"region": "1",
		"de": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"en": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"es": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"fr": {
			"name": "Maguuma",
			"slug": "maguuma"
		}
	},
	"1006": {
		"id": "1006",
		"region": "1",
		"de": {
			"name": "Hochofen der Betrübnis",
			"slug": "hochofen-der-betrubnis"
		},
		"en": {
			"name": "Sorrow's Furnace",
			"slug": "sorrows-furnace"
		},
		"es": {
			"name": "Fragua del Pesar",
			"slug": "fragua-del-pesar"
		},
		"fr": {
			"name": "Fournaise des lamentations",
			"slug": "fournaise-des-lamentations"
		}
	},
	"1007": {
		"id": "1007",
		"region": "1",
		"de": {
			"name": "Tor des Irrsinns",
			"slug": "tor-des-irrsinns"
		},
		"en": {
			"name": "Gate of Madness",
			"slug": "gate-of-madness"
		},
		"es": {
			"name": "Puerta de la Locura",
			"slug": "puerta-de-la-locura"
		},
		"fr": {
			"name": "Porte de la folie",
			"slug": "porte-de-la-folie"
		}
	},
	"1008": {
		"id": "1008",
		"region": "1",
		"de": {
			"name": "Jade-Steinbruch",
			"slug": "jade-steinbruch"
		},
		"en": {
			"name": "Jade Quarry",
			"slug": "jade-quarry"
		},
		"es": {
			"name": "Cantera de Jade",
			"slug": "cantera-de-jade"
		},
		"fr": {
			"name": "Carrière de jade",
			"slug": "carriere-de-jade"
		}
	},
	"1009": {
		"id": "1009",
		"region": "1",
		"de": {
			"name": "Fort Espenwald",
			"slug": "fort-espenwald"
		},
		"en": {
			"name": "Fort Aspenwood",
			"slug": "fort-aspenwood"
		},
		"es": {
			"name": "Fuerte Aspenwood",
			"slug": "fuerte-aspenwood"
		},
		"fr": {
			"name": "Fort Trembleforêt",
			"slug": "fort-trembleforet"
		}
	},
	"1010": {
		"id": "1010",
		"region": "1",
		"de": {
			"name": "Ehmry-Bucht",
			"slug": "ehmry-bucht"
		},
		"en": {
			"name": "Ehmry Bay",
			"slug": "ehmry-bay"
		},
		"es": {
			"name": "Bahía de Ehmry",
			"slug": "bahia-de-ehmry"
		},
		"fr": {
			"name": "Baie d'Ehmry",
			"slug": "baie-dehmry"
		}
	},
	"1011": {
		"id": "1011",
		"region": "1",
		"de": {
			"name": "Sturmklippen-Insel",
			"slug": "sturmklippen-insel"
		},
		"en": {
			"name": "Stormbluff Isle",
			"slug": "stormbluff-isle"
		},
		"es": {
			"name": "Isla Cimatormenta",
			"slug": "isla-cimatormenta"
		},
		"fr": {
			"name": "Ile de la Falaise tumultueuse",
			"slug": "ile-de-la-falaise-tumultueuse"
		}
	},
	"1012": {
		"id": "1012",
		"region": "1",
		"de": {
			"name": "Finsterfreistatt",
			"slug": "finsterfreistatt"
		},
		"en": {
			"name": "Darkhaven",
			"slug": "darkhaven"
		},
		"es": {
			"name": "Refugio Oscuro",
			"slug": "refugio-oscuro"
		},
		"fr": {
			"name": "Refuge noir",
			"slug": "refuge-noir"
		}
	},
	"1013": {
		"id": "1013",
		"region": "1",
		"de": {
			"name": "Heilige Halle von Rall",
			"slug": "heilige-halle-von-rall"
		},
		"en": {
			"name": "Sanctum of Rall",
			"slug": "sanctum-of-rall"
		},
		"es": {
			"name": "Sagrario de Rall",
			"slug": "sagrario-de-rall"
		},
		"fr": {
			"name": "Sanctuaire de Rall",
			"slug": "sanctuaire-de-rall"
		}
	},
	"1014": {
		"id": "1014",
		"region": "1",
		"de": {
			"name": "Kristallwüste",
			"slug": "kristallwuste"
		},
		"en": {
			"name": "Crystal Desert",
			"slug": "crystal-desert"
		},
		"es": {
			"name": "Desierto de Cristal",
			"slug": "desierto-de-cristal"
		},
		"fr": {
			"name": "Désert de cristal",
			"slug": "desert-de-cristal"
		}
	},
	"1015": {
		"id": "1015",
		"region": "1",
		"de": {
			"name": "Janthir-Insel",
			"slug": "janthir-insel"
		},
		"en": {
			"name": "Isle of Janthir",
			"slug": "isle-of-janthir"
		},
		"es": {
			"name": "Isla de Janthir",
			"slug": "isla-de-janthir"
		},
		"fr": {
			"name": "Ile de Janthir",
			"slug": "ile-de-janthir"
		}
	},
	"1016": {
		"id": "1016",
		"region": "1",
		"de": {
			"name": "Meer des Leids",
			"slug": "meer-des-leids"
		},
		"en": {
			"name": "Sea of Sorrows",
			"slug": "sea-of-sorrows"
		},
		"es": {
			"name": "El Mar de los Pesares",
			"slug": "el-mar-de-los-pesares"
		},
		"fr": {
			"name": "Mer des lamentations",
			"slug": "mer-des-lamentations"
		}
	},
	"1017": {
		"id": "1017",
		"region": "1",
		"de": {
			"name": "Befleckte Küste",
			"slug": "befleckte-kuste"
		},
		"en": {
			"name": "Tarnished Coast",
			"slug": "tarnished-coast"
		},
		"es": {
			"name": "Costa de Bronce",
			"slug": "costa-de-bronce"
		},
		"fr": {
			"name": "Côte ternie",
			"slug": "cote-ternie"
		}
	},
	"1018": {
		"id": "1018",
		"region": "1",
		"de": {
			"name": "Nördliche Zittergipfel",
			"slug": "nordliche-zittergipfel"
		},
		"en": {
			"name": "Northern Shiverpeaks",
			"slug": "northern-shiverpeaks"
		},
		"es": {
			"name": "Picosescalofriantes del Norte",
			"slug": "picosescalofriantes-del-norte"
		},
		"fr": {
			"name": "Cimefroides nordiques",
			"slug": "cimefroides-nordiques"
		}
	},
	"1019": {
		"id": "1019",
		"region": "1",
		"de": {
			"name": "Schwarztor",
			"slug": "schwarztor"
		},
		"en": {
			"name": "Blackgate",
			"slug": "blackgate"
		},
		"es": {
			"name": "Puertanegra",
			"slug": "puertanegra"
		},
		"fr": {
			"name": "Portenoire",
			"slug": "portenoire"
		}
	},
	"1020": {
		"id": "1020",
		"region": "1",
		"de": {
			"name": "Fergusons Kreuzung",
			"slug": "fergusons-kreuzung"
		},
		"en": {
			"name": "Ferguson's Crossing",
			"slug": "fergusons-crossing"
		},
		"es": {
			"name": "Encrucijada de Ferguson",
			"slug": "encrucijada-de-ferguson"
		},
		"fr": {
			"name": "Croisée de Ferguson",
			"slug": "croisee-de-ferguson"
		}
	},
	"1021": {
		"id": "1021",
		"region": "1",
		"de": {
			"name": "Drachenbrand",
			"slug": "drachenbrand"
		},
		"en": {
			"name": "Dragonbrand",
			"slug": "dragonbrand"
		},
		"es": {
			"name": "Marca del Dragón",
			"slug": "marca-del-dragon"
		},
		"fr": {
			"name": "Stigmate du dragon",
			"slug": "stigmate-du-dragon"
		}
	},
	"1022": {
		"id": "1022",
		"region": "1",
		"de": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"en": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"es": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"fr": {
			"name": "Kaineng",
			"slug": "kaineng"
		}
	},
	"1023": {
		"id": "1023",
		"region": "1",
		"de": {
			"name": "Devonas Rast",
			"slug": "devonas-rast"
		},
		"en": {
			"name": "Devona's Rest",
			"slug": "devonas-rest"
		},
		"es": {
			"name": "Descanso de Devona",
			"slug": "descanso-de-devona"
		},
		"fr": {
			"name": "Repos de Devona",
			"slug": "repos-de-devona"
		}
	},
	"1024": {
		"id": "1024",
		"region": "1",
		"de": {
			"name": "Eredon-Terrasse",
			"slug": "eredon-terrasse"
		},
		"en": {
			"name": "Eredon Terrace",
			"slug": "eredon-terrace"
		},
		"es": {
			"name": "Terraza de Eredon",
			"slug": "terraza-de-eredon"
		},
		"fr": {
			"name": "Plateau d'Eredon",
			"slug": "plateau-deredon"
		}
	},
	"2001": {
		"id": "2001",
		"region": "2",
		"de": {
			"name": "Klagenriss",
			"slug": "klagenriss"
		},
		"en": {
			"name": "Fissure of Woe",
			"slug": "fissure-of-woe"
		},
		"es": {
			"name": "Fisura de la Aflicción",
			"slug": "fisura-de-la-afliccion"
		},
		"fr": {
			"name": "Fissure du malheur",
			"slug": "fissure-du-malheur"
		}
	},
	"2002": {
		"id": "2002",
		"region": "2",
		"de": {
			"name": "Ödnis",
			"slug": "odnis"
		},
		"en": {
			"name": "Desolation",
			"slug": "desolation"
		},
		"es": {
			"name": "Desolación",
			"slug": "desolacion"
		},
		"fr": {
			"name": "Désolation",
			"slug": "desolation"
		}
	},
	"2003": {
		"id": "2003",
		"region": "2",
		"de": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"en": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"es": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"fr": {
			"name": "Gandara",
			"slug": "gandara"
		}
	},
	"2004": {
		"id": "2004",
		"region": "2",
		"de": {
			"name": "Schwarzflut",
			"slug": "schwarzflut"
		},
		"en": {
			"name": "Blacktide",
			"slug": "blacktide"
		},
		"es": {
			"name": "Marea Negra",
			"slug": "marea-negra"
		},
		"fr": {
			"name": "Noirflot",
			"slug": "noirflot"
		}
	},
	"2005": {
		"id": "2005",
		"region": "2",
		"de": {
			"name": "Feuerring",
			"slug": "feuerring"
		},
		"en": {
			"name": "Ring of Fire",
			"slug": "ring-of-fire"
		},
		"es": {
			"name": "Anillo de Fuego",
			"slug": "anillo-de-fuego"
		},
		"fr": {
			"name": "Cercle de feu",
			"slug": "cercle-de-feu"
		}
	},
	"2006": {
		"id": "2006",
		"region": "2",
		"de": {
			"name": "Unterwelt",
			"slug": "unterwelt"
		},
		"en": {
			"name": "Underworld",
			"slug": "underworld"
		},
		"es": {
			"name": "Inframundo",
			"slug": "inframundo"
		},
		"fr": {
			"name": "Outre-monde",
			"slug": "outre-monde"
		}
	},
	"2007": {
		"id": "2007",
		"region": "2",
		"de": {
			"name": "Ferne Zittergipfel",
			"slug": "ferne-zittergipfel"
		},
		"en": {
			"name": "Far Shiverpeaks",
			"slug": "far-shiverpeaks"
		},
		"es": {
			"name": "Lejanas Picosescalofriantes",
			"slug": "lejanas-picosescalofriantes"
		},
		"fr": {
			"name": "Lointaines Cimefroides",
			"slug": "lointaines-cimefroides"
		}
	},
	"2008": {
		"id": "2008",
		"region": "2",
		"de": {
			"name": "Weißflankgrat",
			"slug": "weissflankgrat"
		},
		"en": {
			"name": "Whiteside Ridge",
			"slug": "whiteside-ridge"
		},
		"es": {
			"name": "Cadena Laderablanca",
			"slug": "cadena-laderablanca"
		},
		"fr": {
			"name": "Crête de Verseblanc",
			"slug": "crete-de-verseblanc"
		}
	},
	"2009": {
		"id": "2009",
		"region": "2",
		"de": {
			"name": "Ruinen von Surmia",
			"slug": "ruinen-von-surmia"
		},
		"en": {
			"name": "Ruins of Surmia",
			"slug": "ruins-of-surmia"
		},
		"es": {
			"name": "Ruinas de Surmia",
			"slug": "ruinas-de-surmia"
		},
		"fr": {
			"name": "Ruines de Surmia",
			"slug": "ruines-de-surmia"
		}
	},
	"2010": {
		"id": "2010",
		"region": "2",
		"de": {
			"name": "Seemannsrast",
			"slug": "seemannsrast"
		},
		"en": {
			"name": "Seafarer's Rest",
			"slug": "seafarers-rest"
		},
		"es": {
			"name": "Refugio del Viajante",
			"slug": "refugio-del-viajante"
		},
		"fr": {
			"name": "Repos du Marin",
			"slug": "repos-du-marin"
		}
	},
	"2011": {
		"id": "2011",
		"region": "2",
		"de": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"en": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"es": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"fr": {
			"name": "Vabbi",
			"slug": "vabbi"
		}
	},
	"2012": {
		"id": "2012",
		"region": "2",
		"de": {
			"name": "Piken-Platz",
			"slug": "piken-platz"
		},
		"en": {
			"name": "Piken Square",
			"slug": "piken-square"
		},
		"es": {
			"name": "Plaza de Piken",
			"slug": "plaza-de-piken"
		},
		"fr": {
			"name": "Place Piken",
			"slug": "place-piken"
		}
	},
	"2013": {
		"id": "2013",
		"region": "2",
		"de": {
			"name": "Lichtung der Morgenröte",
			"slug": "lichtung-der-morgenrote"
		},
		"en": {
			"name": "Aurora Glade",
			"slug": "aurora-glade"
		},
		"es": {
			"name": "Claro de la Aurora",
			"slug": "claro-de-la-aurora"
		},
		"fr": {
			"name": "Clairière de l'aurore",
			"slug": "clairiere-de-laurore"
		}
	},
	"2014": {
		"id": "2014",
		"region": "2",
		"de": {
			"name": "Gunnars Feste",
			"slug": "gunnars-feste"
		},
		"en": {
			"name": "Gunnar's Hold",
			"slug": "gunnars-hold"
		},
		"es": {
			"name": "Fuerte de Gunnar",
			"slug": "fuerte-de-gunnar"
		},
		"fr": {
			"name": "Campement de Gunnar",
			"slug": "campement-de-gunnar"
		}
	},
	"2101": {
		"id": "2101",
		"region": "2",
		"de": {
			"name": "Jademeer [FR]",
			"slug": "jademeer-fr"
		},
		"en": {
			"name": "Jade Sea [FR]",
			"slug": "jade-sea-fr"
		},
		"es": {
			"name": "Mar de Jade [FR]",
			"slug": "mar-de-jade-fr"
		},
		"fr": {
			"name": "Mer de Jade [FR]",
			"slug": "mer-de-jade-fr"
		}
	},
	"2102": {
		"id": "2102",
		"region": "2",
		"de": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		},
		"en": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		},
		"es": {
			"name": "Fuerte Ranik [FR]",
			"slug": "fuerte-ranik-fr"
		},
		"fr": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		}
	},
	"2103": {
		"id": "2103",
		"region": "2",
		"de": {
			"name": "Augurenstein [FR]",
			"slug": "augurenstein-fr"
		},
		"en": {
			"name": "Augury Rock [FR]",
			"slug": "augury-rock-fr"
		},
		"es": {
			"name": "Roca del Augurio [FR]",
			"slug": "roca-del-augurio-fr"
		},
		"fr": {
			"name": "Roche de l'Augure [FR]",
			"slug": "roche-de-laugure-fr"
		}
	},
	"2104": {
		"id": "2104",
		"region": "2",
		"de": {
			"name": "Vizunah-Platz [FR]",
			"slug": "vizunah-platz-fr"
		},
		"en": {
			"name": "Vizunah Square [FR]",
			"slug": "vizunah-square-fr"
		},
		"es": {
			"name": "Plaza de Vizunah [FR]",
			"slug": "plaza-de-vizunah-fr"
		},
		"fr": {
			"name": "Place de Vizunah [FR]",
			"slug": "place-de-vizunah-fr"
		}
	},
	"2105": {
		"id": "2105",
		"region": "2",
		"de": {
			"name": "Laubenstein [FR]",
			"slug": "laubenstein-fr"
		},
		"en": {
			"name": "Arborstone [FR]",
			"slug": "arborstone-fr"
		},
		"es": {
			"name": "Piedra Arbórea [FR]",
			"slug": "piedra-arborea-fr"
		},
		"fr": {
			"name": "Pierre Arborea [FR]",
			"slug": "pierre-arborea-fr"
		}
	},
	"2201": {
		"id": "2201",
		"region": "2",
		"de": {
			"name": "Kodasch [DE]",
			"slug": "kodasch-de"
		},
		"en": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		},
		"es": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		},
		"fr": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		}
	},
	"2202": {
		"id": "2202",
		"region": "2",
		"de": {
			"name": "Flussufer [DE]",
			"slug": "flussufer-de"
		},
		"en": {
			"name": "Riverside [DE]",
			"slug": "riverside-de"
		},
		"es": {
			"name": "Ribera [DE]",
			"slug": "ribera-de"
		},
		"fr": {
			"name": "Provinces fluviales [DE]",
			"slug": "provinces-fluviales-de"
		}
	},
	"2203": {
		"id": "2203",
		"region": "2",
		"de": {
			"name": "Elonafels [DE]",
			"slug": "elonafels-de"
		},
		"en": {
			"name": "Elona Reach [DE]",
			"slug": "elona-reach-de"
		},
		"es": {
			"name": "Cañón de Elona [DE]",
			"slug": "canon-de-elona-de"
		},
		"fr": {
			"name": "Bief d'Elona [DE]",
			"slug": "bief-delona-de"
		}
	},
	"2204": {
		"id": "2204",
		"region": "2",
		"de": {
			"name": "Abaddons Mund [DE]",
			"slug": "abaddons-mund-de"
		},
		"en": {
			"name": "Abaddon's Mouth [DE]",
			"slug": "abaddons-mouth-de"
		},
		"es": {
			"name": "Boca de Abaddon [DE]",
			"slug": "boca-de-abaddon-de"
		},
		"fr": {
			"name": "Bouche d'Abaddon [DE]",
			"slug": "bouche-dabaddon-de"
		}
	},
	"2205": {
		"id": "2205",
		"region": "2",
		"de": {
			"name": "Drakkar-See [DE]",
			"slug": "drakkar-see-de"
		},
		"en": {
			"name": "Drakkar Lake [DE]",
			"slug": "drakkar-lake-de"
		},
		"es": {
			"name": "Lago Drakkar [DE]",
			"slug": "lago-drakkar-de"
		},
		"fr": {
			"name": "Lac Drakkar [DE]",
			"slug": "lac-drakkar-de"
		}
	},
	"2206": {
		"id": "2206",
		"region": "2",
		"de": {
			"name": "Millersund [DE]",
			"slug": "millersund-de"
		},
		"en": {
			"name": "Miller's Sound [DE]",
			"slug": "millers-sound-de"
		},
		"es": {
			"name": "Estrecho de Miller [DE]",
			"slug": "estrecho-de-miller-de"
		},
		"fr": {
			"name": "Détroit de Miller [DE]",
			"slug": "detroit-de-miller-de"
		}
	},
	"2207": {
		"id": "2207",
		"region": "2",
		"de": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"en": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"es": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"fr": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		}
	},
	"2301": {
		"id": "2301",
		"region": "2",
		"de": {
			"name": "Baruch-Bucht [SP]",
			"slug": "baruch-bucht-sp"
		},
		"en": {
			"name": "Baruch Bay [SP]",
			"slug": "baruch-bay-sp"
		},
		"es": {
			"name": "Bahía de Baruch [ES]",
			"slug": "bahia-de-baruch-es"
		},
		"fr": {
			"name": "Baie de Baruch [SP]",
			"slug": "baie-de-baruch-sp"
		}
	},
};

},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.batchActions = batchActions;
exports.enableBatching = enableBatching;
var BATCH = 'BATCHING_REDUCER.BATCH';

exports.BATCH = BATCH;

function batchActions(actions) {
	return { type: BATCH, payload: actions };
}

function enableBatching(reduce) {
	return function batchingReducer(state, action) {
		switch (action.type) {
			case BATCH:
				return action.payload.reduce(batchingReducer, state);
			default:
				return reduce(state, action);
		}
	};
}
},{}],66:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = thunkMiddleware;
function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      return next(action);
    };
  };
}
},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGFwaS5qcyIsImFwcFxcYWN0aW9uc1xcZ3VpbGRzLmpzIiwiYXBwXFxhY3Rpb25zXFxsYW5nLmpzIiwiYXBwXFxhY3Rpb25zXFxsb2dGaWx0ZXJzLmpzIiwiYXBwXFxhY3Rpb25zXFxtYXRjaERldGFpbHMuanMiLCJhcHBcXGFjdGlvbnNcXG1hdGNoZXMuanMiLCJhcHBcXGFjdGlvbnNcXG5vdy5qcyIsImFwcFxcYWN0aW9uc1xcb2JqZWN0aXZlcy5qcyIsImFwcFxcYWN0aW9uc1xccm91dGUuanMiLCJhcHBcXGFjdGlvbnNcXHRpbWVvdXRzLmpzIiwiYXBwXFxhY3Rpb25zXFx3b3JsZC5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXENvbnRhaW5lci5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxGb290ZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTGFuZ3NcXExhbmdMaW5rLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXExhbmdzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxOYXZiYXJIZWFkZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxNYXRjaC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXE1hdGNoUGllLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2hXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcV29ybGRzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXEd1aWxkLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXEVudHJpZXMuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcRW50cnkuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcVGFicy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcTWF0Y2hNYXAuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXE9iamVjdGl2ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXEhvbGRpbmdzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXGljb25zXFxBcnJvdy5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcRW1ibGVtLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXGljb25zXFxPYmplY3RpdmUuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXFBpZS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcU3ByaXRlLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXG9iamVjdGl2ZXNcXEFycm93LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXG9iamVjdGl2ZXNcXE5hbWUuanMiLCJhcHBcXGNvbXBvbmVudHNcXHV0aWxcXFBlcmYuanMiLCJhcHBcXGNvbnN0YW50c1xcYWN0aW9uVHlwZXMuanMiLCJhcHBcXGxpYlxcYXBpLmpzIiwiYXBwXFxsaWJcXHJlZHV4SGVscGVycy5qcyIsImFwcFxcbGliXFxzdGF0aWNcXGluZGV4LmpzIiwiYXBwXFxsaWJcXHdvcmxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGFwaS5qcyIsImFwcFxccmVkdWNlcnNcXGd1aWxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGluZGV4LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbGFuZy5qcyIsImFwcFxccmVkdWNlcnNcXGxvZ0ZpbHRlcnMuanMiLCJhcHBcXHJlZHVjZXJzXFxtYXRjaERldGFpbHMuanMiLCJhcHBcXHJlZHVjZXJzXFxtYXRjaGVzLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbm93LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcb2JqZWN0aXZlcy5qcyIsImFwcFxccmVkdWNlcnNcXHJvdXRlLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcdGltZW91dHMuanMiLCJhcHBcXHJlZHVjZXJzXFx3b3JsZC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZXNfdjJfbWVyZ2VkLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC1iYXRjaGVkLWFjdGlvbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LXRodW5rL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQTs7OztBQUNBOztBQUVBOzs7O0FBR0E7O0FBT0E7O0FBUUE7O0FBU0E7Ozs7QUFTTyxJQUFNLG9DQUFjLFNBQWQsV0FBYyxPQUFvQjtBQUFBLFFBQWpCLFVBQWlCLFFBQWpCLFVBQWlCOzs7O0FBRzNDLFdBQU87QUFDSCwyQ0FERztBQUVIO0FBRkcsS0FBUDtBQUlILENBUE07O0FBV0EsSUFBTSwwQ0FB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RUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxHQUE3QyxFQXhCa0MsRTtBQXlCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxHQUE3QyxFQXpCa0MsRTtBQTBCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxHQUE3QyxFQTFCa0MsRTtBQTJCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQTNCa0MsRTtBQTRCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQTVCa0MsRTtBQTZCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksSUFBM0IsRUFBaUMsV0FBVyxHQUE1QyxFQTdCa0MsRTtBQThCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQTlCa0MsRTtBQStCbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQS9Ca0MsRTtBQWdDbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQWhDa0MsRTtBQWlDbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQWpDa0MsRTtBQWtDbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFPLENBQXBCLEVBQXVCLElBQUksS0FBM0IsRUFBa0MsV0FBVyxJQUE3QyxFQWxDa0MsRTtBQW1DbEMsRUFBQyxLQUFLLEtBQU4sRUFBYSxPQUFP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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdC9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCB7IGJhdGNoQWN0aW9ucyB9IGZyb20gJ3JlZHV4LWJhdGNoZWQtYWN0aW9ucyc7XHJcblxyXG5pbXBvcnQgYXBpIGZyb20gJ2xpYi9hcGknO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBBUElfUkVRVUVTVF9PUEVOLFxyXG4gICAgQVBJX1JFUVVFU1RfU1VDQ0VTUyxcclxuICAgIEFQSV9SRVFVRVNUX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICByZWNlaXZlTWF0Y2hlcyxcclxuICAgIHJlY2VpdmVNYXRjaGVzRmFpbGVkLFxyXG4gICAgcmVjZWl2ZU1hdGNoZXNTdWNjZXNzLFxyXG4gICAgZ2V0TWF0Y2hlc0xhc3Rtb2QsXHJcbn0gZnJvbSAnLi9tYXRjaGVzJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgcHJvY2Vzc01hdGNoRGV0YWlscyxcclxuICAgIC8vIHJlY2VpdmVNYXRjaERldGFpbHMsXHJcbiAgICByZWNlaXZlTWF0Y2hEZXRhaWxzU3VjY2VzcyxcclxuICAgIHJlY2VpdmVNYXRjaERldGFpbHNGYWlsZWQsXHJcbn0gZnJvbSAnLi9tYXRjaERldGFpbHMnO1xyXG5cclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgaW5pdGlhbGl6ZUd1aWxkLFxyXG4gICAgcmVjZWl2ZUd1aWxkLFxyXG4gICAgcmVjZWl2ZUd1aWxkRmFpbGVkLFxyXG59IGZyb20gJy4vZ3VpbGRzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0T3BlbiA9ICh7IHJlcXVlc3RLZXkgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVxdWVzdE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICAgICAgcmVxdWVzdEtleSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0U3VjY2VzcyA9ICh7IHJlcXVlc3RLZXkgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVxdWVzdE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IEFQSV9SRVFVRVNUX1NVQ0NFU1MsXHJcbiAgICAgICAgcmVxdWVzdEtleSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0RmFpbGVkID0gKHsgcmVxdWVzdEtleSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXF1ZXN0TWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQVBJX1JFUVVFU1RfRkFJTEVELFxyXG4gICAgICAgIHJlcXVlc3RLZXksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hNYXRjaGVzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzJyk7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RLZXkgPSAnbWF0Y2hlcyc7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHJlcXVlc3RPcGVuKHsgcmVxdWVzdEtleSB9KSk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaGVzKHtcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6c3VjY2VzcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3VjY2Vzcyh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoZXNTdWNjZXNzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBJbW11dGFibGUuZnJvbUpTKGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogZ2V0TWF0Y2hlc0xhc3Rtb2QoZGF0YSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OmVycm9yJywgZXJyKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEZhaWxlZCh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoZXNGYWlsZWQoeyBlcnIgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OmNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hNYXRjaERldGFpbHMgPSAoeyB3b3JsZCB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXMnLCB3b3JsZCk7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RLZXkgPSBgbWF0Y2hEZXRhaWxzYDtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2gocmVxdWVzdE9wZW4oeyByZXF1ZXN0S2V5IH0pKTtcclxuXHJcbiAgICAgICAgYXBpLmdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgICAgICAgICAgd29ybGRJZDogd29ybGQuaWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OnN1Y2Nlc3MnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFN1Y2Nlc3MoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYXRjaERldGFpbHNTdWNjZXNzKCksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzTWF0Y2hEZXRhaWxzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogSW1tdXRhYmxlLmZyb21KUyhkYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6ZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RmFpbGVkKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkKHsgZXJyIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjpjb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hHdWlsZEJ5SWQgPSAoeyBndWlsZElkIH0pID0+IHtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdEtleSA9IGBndWlsZC0keyBndWlsZElkIH1gO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDonLCByZXF1ZXN0S2V5KTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgcmVxdWVzdE9wZW4oeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplR3VpbGQoeyBndWlsZElkIH0pLFxyXG4gICAgICAgIF0pKTtcclxuXHJcbiAgICAgICAgYXBpLmdldEd1aWxkQnlJZCh7XHJcbiAgICAgICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDo6c3VjY2VzcycsIHJlcXVlc3RLZXksIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFN1Y2Nlc3MoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVHdWlsZCh7IGd1aWxkSWQsIGRhdGEgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDo6ZXJyb3InLCByZXF1ZXN0S2V5LCBlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEZhaWxlZCh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZUd1aWxkRmFpbGVkKHsgZ3VpbGRJZCwgZXJyIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hHdWlsZEJ5SWQ6OmNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7O1xyXG4gICAgfTtcclxufTtcclxuXHJcbiIsIi8vIGltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgSU5JVElBTElaRV9HVUlMRCxcclxuICAgIFJFQ0VJVkVfR1VJTEQsXHJcbiAgICBSRUNFSVZFX0dVSUxEX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUd1aWxkID0gKHsgZ3VpbGRJZCB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlR3VpbGQnLCBndWlsZElkKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IElOSVRJQUxJWkVfR1VJTEQsXHJcbiAgICAgICAgZ3VpbGRJZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlR3VpbGQgPSAoeyBndWlsZElkLCBkYXRhIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVHdWlsZCcsIGd1aWxkSWQsIGRhdGEpO1xyXG4vL1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX0dVSUxELFxyXG4gICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgbmFtZTogZGF0YS5ndWlsZF9uYW1lLFxyXG4gICAgICAgIHRhZzogZGF0YS50YWcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZUd1aWxkRmFpbGVkID0gKHsgZ3VpbGRJZCwgZXJyIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVHdWlsZEZhaWxlZCcsIGd1aWxkSWQsIGVycik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX0dVSUxEX0ZBSUxFRCxcclxuICAgICAgICBndWlsZElkLFxyXG4gICAgICAgIGVycixcclxuICAgIH07XHJcbn07IiwiaW1wb3J0IHsgU0VUX0xBTkcgfSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRMYW5nID0gc2x1ZyA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRMYW5nJywgc2x1Zyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfTEFORyxcclxuICAgICAgICBzbHVnLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBMT0dfRklMVEVSU19UT0dHTEVfTUFQLFxyXG4gICAgTE9HX0ZJTFRFUlNfVE9HR0xFX09CSkVDVElWRV9UWVBFLFxyXG4gICAgTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZU1hcCA9ICh7IG1hcElkIH0pID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogTE9HX0ZJTFRFUlNfVE9HR0xFX01BUCxcclxuICAgICAgICBtYXBJZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB0b2dnbGVPYmplY3RpdmVUeXBlID0gKHsgb2JqZWN0aXZlVHlwZSB9KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IExPR19GSUxURVJTX1RPR0dMRV9PQkpFQ1RJVkVfVFlQRSxcclxuICAgICAgICBvYmplY3RpdmVUeXBlLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZUV2ZW50VHlwZSA9ICh7IGV2ZW50VHlwZSB9KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IExPR19GSUxURVJTX1RPR0dMRV9FVkVOVF9UWVBFLFxyXG4gICAgICAgIGV2ZW50VHlwZSxcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuLy8gaW1wb3J0IHsgYmF0Y2hBY3Rpb25zIH0gZnJvbSAncmVkdXgtYmF0Y2hlZC1hY3Rpb25zJztcclxuXHJcblxyXG4vLyBpbXBvcnQgeyB3b3JsZHMgYXMgU1RBVElDX1dPUkxEUyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBDTEVBUl9NQVRDSERFVEFJTFMsXHJcbiAgICBSRUNFSVZFX01BVENIREVUQUlMUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX1NVQ0NFU1MsXHJcbiAgICBSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcbi8vIGltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnYWN0aW9ucy9tYXRjaERldGFpbHMnO1xyXG5pbXBvcnQgeyBmZXRjaEd1aWxkQnlJZCB9IGZyb20gJ2FjdGlvbnMvYXBpJztcclxuaW1wb3J0IHtcclxuICAgIC8vIHVwZGF0ZU9iamVjdGl2ZSxcclxuICAgIHVwZGF0ZU9iamVjdGl2ZXMsXHJcbn0gZnJvbSAnYWN0aW9ucy9vYmplY3RpdmVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyTWF0Y2hEZXRhaWxzID0gKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJNYXRjaERldGFpbHMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IENMRUFSX01BVENIREVUQUlMUyxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBwcm9jZXNzTWF0Y2hEZXRhaWxzID0gKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpwcm9jZXNzTWF0Y2hEZXRhaWxzJyk7XHJcblxyXG4gICAgY29uc3QgaWQgPSBkYXRhLmdldCgnaWQnKTtcclxuICAgIGNvbnN0IHJlZ2lvbiA9IGRhdGEuZ2V0KCdyZWdpb24nKTtcclxuICAgIGNvbnN0IHdvcmxkcyA9IGRhdGEuZ2V0KCd3b3JsZHMnKTtcclxuXHJcbiAgICBjb25zdCBtYXBzID0gZ2V0TWFwcyhkYXRhKTtcclxuICAgIGNvbnN0IHN0YXRzID0gZ2V0U3RhdHMoZGF0YSk7XHJcbiAgICBjb25zdCB0aW1lcyA9IGdldFRpbWVzKGRhdGEpO1xyXG4gICAgLy8gY29uc3Qgd29ybGRzID0gZ2V0V29ybGRzKGRhdGEpO1xyXG5cclxuICAgIGNvbnN0IGd1aWxkSWRzID0gZ2V0R3VpbGRJZHMobWFwcyk7XHJcbiAgICBjb25zdCBvYmplY3RpdmVJZHMgPSBnZXRPYmplY3RpdmVJZHMobWFwcyk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdpZCcsIGlkKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAncmVnaW9uJywgcmVnaW9uKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnc3RhdHMnLCBzdGF0cy50b0pTKCkpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICd0aW1lcycsIHRpbWVzLnRvSlMoKSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ3dvcmxkcycsIHdvcmxkcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ21hcHMnLCBtYXBzLnRvSlMoKSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ2d1aWxkSWRzJywgZ3VpbGRJZHMudG9KUygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnb2JqZWN0aXZlSWRzJywgb2JqZWN0aXZlSWRzLnRvSlMoKSk7XHJcblxyXG5cclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZU1hdGNoRGV0YWlscyh7XHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICByZWdpb24sXHJcblxyXG4gICAgICAgICAgICBndWlsZElkcyxcclxuICAgICAgICAgICAgbWFwcyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlSWRzLFxyXG4gICAgICAgICAgICBzdGF0cyxcclxuICAgICAgICAgICAgdGltZXMsXHJcbiAgICAgICAgICAgIHdvcmxkcyxcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoR3VpbGRMb29rdXBzKGRpc3BhdGNoLCBnZXRTdGF0ZSgpLmd1aWxkcywgZ3VpbGRJZHMpO1xyXG4gICAgICAgIGRpc3BhdGNoT2JqZWN0aXZlVXBkYXRlcyhkaXNwYXRjaCwgZGF0YS5nZXQoJ21hcHMnKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHJldHVybiB7XHJcbiAgICAvLyAgICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFMsXHJcblxyXG4gICAgLy8gICAgIGlkLFxyXG4gICAgLy8gICAgIHJlZ2lvbixcclxuXHJcbiAgICAvLyAgICAgZ3VpbGRJZHMsXHJcbiAgICAvLyAgICAgbWFwcyxcclxuICAgIC8vICAgICBvYmplY3RpdmVJZHMsXHJcbiAgICAvLyAgICAgc3RhdHMsXHJcbiAgICAvLyAgICAgdGltZXMsXHJcbiAgICAvLyAgICAgd29ybGRzLFxyXG4gICAgLy8gfTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaEd1aWxkTG9va3VwcyhkaXNwYXRjaCwgc3RhdGVHdWlsZHMsIGd1aWxkSWRzKSB7XHJcbiAgICBjb25zdCBrbm93bkd1aWxkcyA9IHN0YXRlR3VpbGRzLmtleVNlcSgpLnRvU2V0KCk7XHJcbiAgICBjb25zdCB1bmtub3duR3VpbGRzID0gZ3VpbGRJZHMuc3VidHJhY3Qoa25vd25HdWlsZHMpO1xyXG5cclxuXHJcbiAgICB1bmtub3duR3VpbGRzLmZvckVhY2goXHJcbiAgICAgICAgKGd1aWxkSWQpID0+IGRpc3BhdGNoKGZldGNoR3VpbGRCeUlkKHsgZ3VpbGRJZCB9KSlcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaE9iamVjdGl2ZVVwZGF0ZXMoZGlzcGF0Y2gsIG1hcHMpIHtcclxuICAgIGxldCBvYmplY3RpdmVzID0gSW1tdXRhYmxlLk1hcCgpO1xyXG5cclxuXHJcbiAgICBtYXBzLmZvckVhY2goXHJcbiAgICAgICAgbSA9PiBtLmdldCgnb2JqZWN0aXZlcycpLmZvckVhY2goXHJcbiAgICAgICAgICAgIChvYmplY3RpdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdGl2ZXMgPSBvYmplY3RpdmVzLnNldEluKFxyXG4gICAgICAgICAgICAgICAgICAgIFtvYmplY3RpdmUuZ2V0KCdpZCcpXSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICApO1xyXG4gICAgLy8gbWFwcy5mb3JFYWNoKFxyXG4gICAgLy8gICAgIG0gPT4gbS5nZXQoJ29iamVjdGl2ZXMnKS5mb3JFYWNoKFxyXG4gICAgLy8gICAgICAgICAob2JqZWN0aXZlKSA9PiBkaXNwYXRjaCh1cGRhdGVPYmplY3RpdmUoeyBvYmplY3RpdmUgfSkpXHJcbiAgICAvLyAgICAgKVxyXG4gICAgLy8gKTtcclxuXHJcbiAgICBkaXNwYXRjaCh1cGRhdGVPYmplY3RpdmVzKHsgb2JqZWN0aXZlcyB9KSk7XHJcblxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hEZXRhaWxzID0gKHtcclxuICAgIGlkLFxyXG4gICAgcmVnaW9uLFxyXG4gICAgZ3VpbGRJZHMsXHJcbiAgICBtYXBzLFxyXG4gICAgb2JqZWN0aXZlSWRzLFxyXG4gICAgc3RhdHMsXHJcbiAgICB0aW1lcyxcclxuICAgIHdvcmxkcyxcclxufSkgPT4gKHtcclxuICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hERVRBSUxTLFxyXG5cclxuICAgIGlkLFxyXG4gICAgcmVnaW9uLFxyXG5cclxuICAgIGd1aWxkSWRzLFxyXG4gICAgbWFwcyxcclxuICAgIG9iamVjdGl2ZUlkcyxcclxuICAgIHN0YXRzLFxyXG4gICAgdGltZXMsXHJcbiAgICB3b3JsZHMsXHJcbn0pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoRGV0YWlsc1N1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzU3VjY2VzcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoRGV0YWlsc0ZhaWxlZCA9ICh7IGVyciB9KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCxcclxuICAgICAgICBlcnIsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwcyhub2RlKSB7XHJcbiAgICBjb25zdCBtYXBzID0gbm9kZVxyXG4gICAgICAgIC5nZXQoJ21hcHMnKVxyXG4gICAgICAgIC8vIC5tYXAoXHJcbiAgICAgICAgLy8gICAgIG0gPT4gbS5zZXQoJ3N0YXRzJywgZ2V0U3RhdHMobSkpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdkZWF0aHMnKVxyXG4gICAgICAgIC8vICAgICAgICAgLmRlbGV0ZSgnaG9sZGluZ3MnKVxyXG4gICAgICAgIC8vICAgICAgICAgLmRlbGV0ZSgna2lsbHMnKVxyXG4gICAgICAgIC8vICAgICAgICAgLmRlbGV0ZSgnc2NvcmVzJylcclxuICAgICAgICAvLyAgICAgICAgIC5kZWxldGUoJ3RpY2tzJylcclxuICAgICAgICAvLyAgICAgICAgIC5zZXQoJ2d1aWxkcycsIGdldE1hcEd1aWxkcyhtKSlcclxuICAgICAgICAvLyAgICAgICAgIC51cGRhdGUoJ29iamVjdGl2ZXMnLCBvcyA9PiBvcy5tYXAobyA9PiBvLmdldCgnaWQnKSkudG9PcmRlcmVkU2V0KCkpXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICBtID0+IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IG0uZ2V0KCdpZCcpLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogbS5nZXQoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgIGxhc3Rtb2Q6IG0uZ2V0KCdsYXN0bW9kJyksXHJcbiAgICAgICAgICAgICAgICBzdGF0czogZ2V0U3RhdHMobSksXHJcbiAgICAgICAgICAgICAgICBndWlsZHM6IGdldE1hcEd1aWxkSWRzKG0pLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0aXZlczogZ2V0TWFwT2JqZWN0aXZlSWRzKG0pLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgcmV0dXJuIG1hcHM7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0R3VpbGRJZHMobWFwTm9kZXMpIHtcclxuICAgIGNvbnN0IGd1aWxkcyA9IG1hcE5vZGVzXHJcbiAgICAgICAgLm1hcChtID0+IG0uZ2V0KCdndWlsZHMnKSlcclxuICAgICAgICAuZmxhdHRlbigpXHJcbiAgICAgICAgLnRvT3JkZXJlZFNldCgpO1xyXG5cclxuICAgIHJldHVybiBndWlsZHM7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwR3VpbGRJZHMobWFwTm9kZSkge1xyXG4gICAgY29uc3QgbWFwR3VpbGRzID0gbWFwTm9kZVxyXG4gICAgICAgIC5nZXQoJ29iamVjdGl2ZXMnKVxyXG4gICAgICAgIC5tYXAobyA9PiBvLmdldCgnZ3VpbGQnKSlcclxuICAgICAgICAuZmxhdHRlbigpXHJcbiAgICAgICAgLmZpbHRlck5vdChnID0+IGcgPT09IG51bGwpXHJcbiAgICAgICAgLnRvT3JkZXJlZFNldCgpO1xyXG5cclxuICAgIHJldHVybiBtYXBHdWlsZHM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVJZHMobWFwTm9kZXMpIHtcclxuICAgIGNvbnN0IG9iamVjdGl2ZXMgPSBtYXBOb2Rlc1xyXG4gICAgICAgIC5tYXAobSA9PiBtLmdldCgnb2JqZWN0aXZlcycpKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcblxyXG4gICAgcmV0dXJuIG9iamVjdGl2ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1hcE9iamVjdGl2ZUlkcyhtYXBOb2RlKSB7XHJcbiAgICByZXR1cm4gbWFwTm9kZVxyXG4gICAgICAgIC5nZXQoJ29iamVjdGl2ZXMnKVxyXG4gICAgICAgIC5tYXAobyA9PiBvLmdldCgnaWQnKSlcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTdGF0cyhub2RlKSB7XHJcbiAgICByZXR1cm4gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICAgICAgZGVhdGhzOiBub2RlLmdldCgnZGVhdGhzJyksXHJcbiAgICAgICAga2lsbHM6IG5vZGUuZ2V0KCdraWxscycpLFxyXG4gICAgICAgIGhvbGRpbmdzOiBub2RlLmdldCgnaG9sZGluZ3MnKSxcclxuICAgICAgICBzY29yZXM6IG5vZGUuZ2V0KCdzY29yZXMnKSxcclxuICAgICAgICB0aWNrczogbm9kZS5nZXQoJ3RpY2tzJyksXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGltZXMoZGV0YWlsc05vZGUpIHtcclxuICAgIHJldHVybiBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICBsYXN0bW9kOiBkZXRhaWxzTm9kZS5nZXQoJ2xhc3Rtb2QnKSxcclxuICAgICAgICBlbmRUaW1lOiBkZXRhaWxzTm9kZS5nZXQoJ3N0YXJ0VGltZScpLFxyXG4gICAgICAgIHN0YXJ0VGltZTogZGV0YWlsc05vZGUuZ2V0KCdlbmRUaW1lJyksXHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gZ2V0V29ybGRzKGRldGFpbHNOb2RlKSB7XHJcbi8vICAgICByZXR1cm4gZGV0YWlsc05vZGVcclxuLy8gICAgICAgICAuZ2V0KCd3b3JsZHMnKVxyXG4vLyAgICAgICAgIC5tYXAod29ybGRJZCA9PiBJbW11dGFibGUuZnJvbUpTKFNUQVRJQ19XT1JMRFNbd29ybGRJZF0pKTtcclxuLy8gfSIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgLy8gUkVRVUVTVF9NQVRDSEVTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzID0gKHsgZGF0YSwgbGFzdFVwZGF0ZWQgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoZXMnLCBkYXRhKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFUyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGxhc3RVcGRhdGVkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzU3VjY2VzcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFU19TVUNDRVNTLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hlc0ZhaWxlZCA9ICh7IGVyciB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hlc0ZhaWxlZCcsIGVycik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX01BVENIRVNfRkFJTEVELFxyXG4gICAgICAgIGVycixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaGVzTGFzdG1vZChtYXRjaGVzRGF0YSkge1xyXG4gICAgcmV0dXJuIF8ucmVkdWNlKFxyXG4gICAgICAgIG1hdGNoZXNEYXRhLFxyXG4gICAgICAgIChhY2MsIG1hdGNoKSA9PiBNYXRoLm1heChtYXRjaC5sYXN0bW9kKSxcclxuICAgICAgICAwXHJcbiAgICApO1xyXG59IiwiaW1wb3J0IHsgU0VUX05PVyB9IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldE5vdyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldE5vdycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogU0VUX05PVyxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBPQkpFQ1RJVkVTX1JFU0VULFxyXG4gICAgT0JKRUNUSVZFU19VUERBVEUsXHJcbiAgICBPQkpFQ1RJVkVfVVBEQVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXNldE9iamVjdGl2ZXMgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXNldE9iamVjdGl2ZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IE9CSkVDVElWRVNfUkVTRVQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlT2JqZWN0aXZlcyA9ICh7IG9iamVjdGl2ZXMgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6dXBkYXRlT2JqZWN0aXZlcycsIG9iamVjdGl2ZXMudG9KUygpKTtcclxuXHJcbiAgICBvYmplY3RpdmVzID0gb2JqZWN0aXZlcy5tYXAoXHJcbiAgICAgICAgb2JqZWN0aXZlID0+XHJcbiAgICAgICAgb2JqZWN0aXZlXHJcbiAgICAgICAgICAgIC51cGRhdGUoJ2xhc3RGbGlwcGVkJywgdiA9PiBtb21lbnQudW5peCh2KSlcclxuICAgICAgICAgICAgLnVwZGF0ZSgnbGFzdENsYWltZWQnLCB2ID0+IG1vbWVudC51bml4KHYpKVxyXG4gICAgICAgICAgICAudXBkYXRlKCdsYXN0bW9kJywgdiA9PiBtb21lbnQudW5peCh2KSlcclxuICAgICAgICAgICAgLnVwZGF0ZSh2ID0+IHYuc2V0KCdleHBpcmVzJywgdi5nZXQoJ2xhc3RGbGlwcGVkJykuYWRkKDUsICdtJykpKVxyXG4gICAgKTtcclxuLy9cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogT0JKRUNUSVZFU19VUERBVEUsXHJcbiAgICAgICAgb2JqZWN0aXZlcyxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVPYmplY3RpdmUgPSAoeyBvYmplY3RpdmUgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6dXBkYXRlT2JqZWN0aXZlJywgb2JqZWN0aXZlLnRvSlMoKSk7XHJcblxyXG4gICAgLy8gb2JqZWN0aXZlID0gb2JqZWN0aXZlLnNldCgnZXhwaXJlcycsIG9iamVjdGl2ZS5nZXQoJ2xhc3RGbGlwcGVkJykgKyAoNSAqIDYwICogMTAwMCkpO1xyXG4gICAgLy8gb2JqZWN0aXZlID0gb2JqZWN0aXZlXHJcbiAgICAvLyAgICAgLnVwZGF0ZSgnbGFzdEZsaXBwZWQnLCB2ID0+IG1vbWVudCh2ICogMTAwMCkpXHJcbiAgICAvLyAgICAgLnVwZGF0ZSgnbGFzdENsYWltZWQnLCB2ID0+IG1vbWVudCh2ICogMTAwMCkpXHJcbiAgICAvLyAgICAgLnVwZGF0ZSgnbGFzdG1vZCcsIHYgPT4gbW9tZW50KHYgKiAxMDAwKSk7XHJcbi8vXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IE9CSkVDVElWRV9VUERBVEUsXHJcbiAgICAgICAgb2JqZWN0aXZlLFxyXG4gICAgfTtcclxufTsiLCJcclxuaW1wb3J0IHtcclxuICAgIFNFVF9ST1VURSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRSb3V0ZSA9IChjdHgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogU0VUX1JPVVRFLFxyXG4gICAgICAgIHBhdGg6IGN0eC5wYXRoLFxyXG4gICAgICAgIHBhcmFtczogY3R4LnBhcmFtcyxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQge1xyXG4gICAgQUREX1RJTUVPVVQsXHJcbiAgICBSRU1PVkVfVElNRU9VVCxcclxuICAgIC8vIFJFTU9WRV9BTExfVElNRU9VVFMsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEFwcFRpbWVvdXQgPSAoe1xyXG4gICAgbmFtZSxcclxuICAgIGNiLFxyXG4gICAgdGltZW91dCxcclxufSkgPT4ge1xyXG4gICAgdGltZW91dCA9ICh0eXBlb2YgdGltZW91dCA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICA/IHRpbWVvdXQoKVxyXG4gICAgICAgIDogdGltZW91dDtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRBcHBUaW1lb3V0JywgbmFtZSwgdGltZW91dCk7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpO1xyXG5cclxuICAgICAgICBjb25zdCByZWYgPSBzZXRUaW1lb3V0KGNiLCB0aW1lb3V0KTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goc2F2ZVRpbWVvdXQoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICByZWYsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmVUaW1lb3V0ID0gKHtcclxuICAgIG5hbWUsXHJcbiAgICByZWYsXHJcbn0pID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQUREX1RJTUVPVVQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICByZWYsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJBcHBUaW1lb3V0ID0gKHsgbmFtZSB9KSA9PiB7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRpbWVvdXRzIH0gPSBnZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhckFwcFRpbWVvdXQnLCBuYW1lLCB0aW1lb3V0c1tuYW1lXSk7XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0c1tuYW1lXSk7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHJlbW92ZVRpbWVvdXQoeyBuYW1lIH0pKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJBbGxUaW1lb3V0cyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRpbWVvdXRzIH0gPSBnZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhckFsbFRpbWVvdXRzJywgZ2V0U3RhdGUoKS50aW1lb3V0cyk7XHJcblxyXG4gICAgICAgIF8uZm9yRWFjaCh0aW1lb3V0cywgKHQsIG5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnLCBnZXRTdGF0ZSgpLnRpbWVvdXRzKTtcclxuXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlVGltZW91dCA9ICh7IG5hbWUgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVtb3ZlVGltZW91dCcsIG5hbWUpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVNT1ZFX1RJTUVPVVQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1dPUkxELFxyXG4gICAgQ0xFQVJfV09STEQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFdvcmxkID0gKGxhbmdTbHVnLCB3b3JsZFNsdWcpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldFdvcmxkJywgbGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfV09STEQsXHJcbiAgICAgICAgbGFuZ1NsdWcsXHJcbiAgICAgICAgd29ybGRTbHVnLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhcldvcmxkID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IENMRUFSX1dPUkxELFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHRodW5rTWlkZGxld2FyZSBmcm9tICdyZWR1eC10aHVuayc7XHJcbmltcG9ydCB7IGVuYWJsZUJhdGNoaW5nIH0gZnJvbSAncmVkdXgtYmF0Y2hlZC1hY3Rpb25zJztcclxuXHJcbmltcG9ydCBQZXJmIGZyb20gJ3JlYWN0LWFkZG9ucy1wZXJmJztcclxuaW1wb3J0IFBlcmZDb250cm9scyBmcm9tICdjb21wb25lbnRzL3V0aWwvUGVyZic7XHJcblxyXG5cclxuaW1wb3J0IGRvbXJlYWR5IGZyb20gJ2RvbXJlYWR5JztcclxuaW1wb3J0IHBhZ2UgZnJvbSAncGFnZSc7XHJcblxyXG5cclxuXHJcblxyXG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L0NvbnRhaW5lcic7XHJcbmltcG9ydCBPdmVydmlldyBmcm9tICdjb21wb25lbnRzL092ZXJ2aWV3JztcclxuaW1wb3J0IFRyYWNrZXIgZnJvbSAnY29tcG9uZW50cy9UcmFja2VyJztcclxuXHJcbmltcG9ydCBhcHBSZWR1Y2VycyBmcm9tICdyZWR1Y2Vycyc7XHJcblxyXG5pbXBvcnQgeyBzZXRSb3V0ZSB9IGZyb20gJ2FjdGlvbnMvcm91dGUnO1xyXG5pbXBvcnQgeyBzZXRMYW5nIH0gZnJvbSAnYWN0aW9ucy9sYW5nJztcclxuaW1wb3J0IHsgc2V0V29ybGQsIGNsZWFyV29ybGQgfSBmcm9tICdhY3Rpb25zL3dvcmxkJztcclxuaW1wb3J0IHsgcmVzZXRPYmplY3RpdmVzIH0gZnJvbSAnYWN0aW9ucy9vYmplY3RpdmVzJztcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ3JlYXRlIFJlZHV4IFN0b3JlXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoXHJcbiAgICBlbmFibGVCYXRjaGluZyhhcHBSZWR1Y2VycyksXHJcbiAgICBhcHBseU1pZGRsZXdhcmUodGh1bmtNaWRkbGV3YXJlKVxyXG4pO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBTdGFydCBBcHBcclxuKlxyXG4qL1xyXG5cclxuZG9tcmVhZHkoKCkgPT4ge1xyXG4gICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIEFwcGxpY2F0aW9uJyk7XHJcblxyXG4gICAgLy8gUGVyZi5zdGFydCgpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ1BlcmYgc3RhcnRlZCcpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdwcm9jZXNzLmVudi5OT0RFX0VOVicsIHByb2Nlc3MuZW52Lk5PREVfRU5WKTtcclxuXHJcblxyXG4gICAgYXR0YWNoUGFnZU1pZGRsZXdhcmUoKTtcclxuICAgIGF0dGFjaFBhZ2VSb3V0ZXMoKTtcclxuXHJcbiAgICBwYWdlLnN0YXJ0KHtcclxuICAgICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgICBwb3BzdGF0ZTogZmFsc2UsXHJcbiAgICAgICAgZGlzcGF0Y2g6IHRydWUsXHJcbiAgICAgICAgaGFzaGJhbmc6IGZhbHNlLFxyXG4gICAgICAgIGRlY29kZVVSTENvbXBvbmVudHM6IHRydWUsXHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcihBcHApIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXIoKScpO1xyXG5cclxuICAgIFJlYWN0RE9NLnJlbmRlcihcclxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgPENvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgIHsvKjxQZXJmQ29udHJvbHMgLz4qL31cclxuXHJcbiAgICAgICAgICAgICAgICB7QXBwfVxyXG4gICAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICA8L1Byb3ZpZGVyPixcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYXBwJylcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGF0dGFjaFBhZ2VNaWRkbGV3YXJlKCkge1xyXG4gICAgcGFnZSgoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKGByb3V0ZSA9PiAke2N0eC5wYXRofWApO1xyXG5cclxuICAgICAgICAvLyBhdHRhY2ggc3RvcmUgdG8gdGhlIHJvdXRlciBjb250ZXh0XHJcbiAgICAgICAgY3R4LnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHNldFJvdXRlKGN0eCkpO1xyXG5cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgcGFnZSgnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcikvOndvcmxkU2x1ZyhbYS16LV0rKT8nLCAoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nU2x1Zywgd29ybGRTbHVnIH0gPSBjdHgucGFyYW1zO1xyXG5cclxuICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goc2V0TGFuZyhsYW5nU2x1ZykpO1xyXG5cclxuICAgICAgICBpZiAod29ybGRTbHVnKSB7XHJcbiAgICAgICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChyZXNldE9iamVjdGl2ZXMoKSk7XHJcbiAgICAgICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRXb3JsZChsYW5nU2x1Zywgd29ybGRTbHVnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goY2xlYXJXb3JsZCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGF0dGFjaFBhZ2VSb3V0ZXMoKSB7XHJcbiAgICBwYWdlKCcvJywgJy9lbicpO1xyXG5cclxuICAgIHBhZ2UoXHJcbiAgICAgICAgJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyknLFxyXG4gICAgICAgIChjdHgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgeyBsYW5nU2x1Zywgd29ybGRTbHVnIH0gPSBjdHgucGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgLy8gY3R4LnN0b3JlLmRpc3BhdGNoKHNldExhbmcobGFuZ1NsdWcpKTtcclxuICAgICAgICAgICAgLy8gY3R4LnN0b3JlLmRpc3BhdGNoKHNldFdvcmxkKGxhbmdTbHVnLCB3b3JsZFNsdWcpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgbGFuZywgd29ybGQgfSA9IGN0eC5zdG9yZS5nZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyKDxUcmFja2VyIC8+KTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHBhZ2UoXHJcbiAgICAgICAgJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpJyxcclxuICAgICAgICAoY3R4KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHsgbGFuZ1NsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0TGFuZyhsYW5nU2x1ZykpO1xyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goY2xlYXJXb3JsZCgpKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcig8T3ZlcnZpZXcgLz4pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuXHJcbmltcG9ydCBMYW5ncyBmcm9tICdjb21wb25lbnRzL0xheW91dC9MYW5ncyc7XHJcbmltcG9ydCBOYXZiYXJIZWFkZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvTmF2YmFySGVhZGVyJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICdjb21wb25lbnRzL0xheW91dC9Gb290ZXInO1xyXG5cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4gICAgICAgIHdvcmxkOiBzdGF0ZS53b3JsZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpc0VxdWFsQnlQaWNrKGN1cnJlbnRQcm9wcywgbmV4dFByb3BzLCBrZXlzKSB7XHJcbiAgICByZXR1cm4gXy5pc0VxdWFsKFxyXG4gICAgICAgIF8ucGljayhjdXJyZW50UHJvcHMsIGtleXMpLFxyXG4gICAgICAgIF8ucGljayhuZXh0UHJvcHMsIGtleXMpLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyByZXR1cm4gXy5yZWR1Y2Uoa2V5cywgKGEsIGtleSkgPT4ge1xyXG4gICAgLy8gICAgIHJldHVybiBhIHx8ICFfLmlzRXF1YWwoY3VycmVudFByb3BzW2tleV0sIG5leHRQcm9wc1trZXldKTtcclxuICAgIC8vIH0sIGZhbHNlKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgIWlzRXF1YWxCeVBpY2sodGhpcy5wcm9wcywgbmV4dFByb3BzLCBbJ3dvcmxkJywgJ2NoaWxkcmVuJ10pXHJcbiAgICAgICAgICAgIHx8ICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50U2hvdWxkVXBkYXRlKClgLCBzaG91bGRVcGRhdGUpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGFuZycsIF8uaXNFcXVhbCh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKSwgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd3b3JsZCcsIF8uaXNFcXVhbCh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpLCBuZXh0UHJvcHMud29ybGQpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudFdpbGxNb3VudCgpYCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnREaWRVcGRhdGUoKWApO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICAvLyBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnRXaWxsVW5tb3VudCgpYCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9J25hdmJhciBuYXZiYXItZGVmYXVsdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXJIZWFkZXIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExhbmdzIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L25hdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBpZD0nY29udGVudCcgY2xhc3NOYW1lPSdjb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICAgICAgICAgICAgICA8Rm9vdGVyIG9ic2Z1RW1haWw9e3tcclxuICAgICAgICAgICAgICAgICAgICBjaHVua3M6IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm46ICcwMzE0MicsXHJcbiAgICAgICAgICAgICAgICB9fSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5Db250YWluZXIgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoQ29udGFpbmVyKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29udGFpbmVyOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgb2JzZnVFbWFpbCxcclxufSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wteHMtMjQnPlxyXG4gICAgICAgICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9J3NtYWxsIG11dGVkIHRleHQtY2VudGVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIMKpIDIwMTMgQXJlbmFOZXQsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5Dc29mdCwgdGhlIGludGVybG9ja2luZyBOQyBsb2dvLCBBcmVuYU5ldCwgR3VpbGQgV2FycywgR3VpbGQgV2FycyBGYWN0aW9ucywgR3VpbGQgV2FycyBOaWdodGZhbGwsIEd1aWxkIFdhcnM6RXllIG9mIHRoZSBOb3J0aCwgR3VpbGQgV2FycyAyLCBhbmQgYWxsIGFzc29jaWF0ZWQgbG9nb3MgYW5kIGRlc2lnbnMgYXJlIHRyYWRlbWFya3Mgb3IgcmVnaXN0ZXJlZCB0cmFkZW1hcmtzIG9mIE5Dc29mdCBDb3Jwb3JhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFsbCBvdGhlciB0cmFkZW1hcmtzIGFyZSB0aGUgcHJvcGVydHkgb2YgdGhlaXIgcmVzcGVjdGl2ZSBvd25lcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHNlbmQgY29tbWVudHMgYW5kIGJ1Z3MgdG8gPE9ic2Z1RW1haWwgb2JzZnVFbWFpbD17b2JzZnVFbWFpbH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdXBwb3J0aW5nIG1pY3Jvc2VydmljZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPSdodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vJz5ndWlsZHMuZ3cydzJ3LmNvbTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICZuYnNwOyZuZGFzaDsmbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tLyc+c3RhdGUuZ3cydzJ3LmNvbTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICZuYnNwOyZuZGFzaDsmbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly93d3cucGllbHkubmV0Lyc+d3d3LnBpZWx5Lm5ldDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTb3VyY2UgYXZhaWxhYmxlIGF0IDxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ndzJ3MnctcmVhY3QnPmh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ndzJ3MnctcmVhY3Q8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDwvZm9vdGVyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcbmNvbnN0IE9ic2Z1RW1haWwgPSAoe29ic2Z1RW1haWx9KSA9PiB7XHJcbiAgICBjb25zdCByZWNvbnN0cnVjdGVkID0gb2JzZnVFbWFpbC5wYXR0ZXJuXHJcbiAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgIC5tYXAoaXhDaHVuayA9PiBvYnNmdUVtYWlsLmNodW5rc1tpeENodW5rXSlcclxuICAgICAgICAuam9pbignJyk7XHJcblxyXG4gICAgcmV0dXJuIDxhIGhyZWY9e2BtYWlsdG86JHtyZWNvbnN0cnVjdGVkfWB9PntyZWNvbnN0cnVjdGVkfTwvYT47XHJcbn07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBhY3RpdmVMYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmxhbmc7XHJcbmNvbnN0IHdvcmxkU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLndvcmxkO1xyXG5jb25zdCB3b3JsZERhdGFTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgYWN0aXZlTGFuZ1NlbGVjdG9yLFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgd29ybGRTZWxlY3RvcixcclxuICAgIChhY3RpdmVMYW5nLCBsYW5nLCB3b3JsZCkgPT4gKHtcclxuICAgICAgICBhY3RpdmVMYW5nLFxyXG4gICAgICAgIHdvcmxkOiB3b3JsZCA/IHdvcmxkc1t3b3JsZC5pZF1bbGFuZy5zbHVnXSA6IG51bGwsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgLy8gY29uc29sZS5sb2coJ2xhbmcnLCBzdGF0ZS5sYW5nKTtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgYWN0aXZlTGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICAvLyBhY3RpdmVXb3JsZDogc3RhdGUud29ybGQsXHJcbi8vICAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkID8gd29ybGRzW3N0YXRlLndvcmxkLmlkXVtwcm9wcy5sYW5nLnNsdWddIDogbnVsbCxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxubGV0IExhbmcgPSAoe1xyXG4gICAgYWN0aXZlTGFuZyxcclxuICAgIC8vIGFjdGl2ZVdvcmxkLFxyXG4gICAgbGFuZyxcclxuICAgIHdvcmxkLFxyXG59KSA9PiAoXHJcbiAgICA8bGlcclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IGFjdGl2ZUxhbmcuZ2V0KCdsYWJlbCcpID09PSBsYW5nLmxhYmVsLFxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHRpdGxlPXtsYW5nLm5hbWV9XHJcbiAgICA+XHJcbiAgICAgICAgPGEgaHJlZj17Z2V0TGluayhsYW5nLCB3b3JsZCl9PlxyXG4gICAgICAgICAgICB7bGFuZy5sYWJlbH1cclxuICAgICAgICA8L2E+XHJcbiAgICA8L2xpPlxyXG4pO1xyXG5MYW5nLnByb3BUeXBlcyA9IHtcclxuICAgIGFjdGl2ZUxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIGFjdGl2ZVdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5MYW5nID0gY29ubmVjdChcclxuICB3b3JsZERhdGFTZWxlY3RvcixcclxuICAvLyBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShMYW5nKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TGluayhsYW5nLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuICh3b3JsZClcclxuICAgICAgICA/IHdvcmxkLmxpbmtcclxuICAgICAgICA6IGxhbmcubGluaztcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYW5nOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IHsgbGFuZ3MgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBMYW5nTGluayBmcm9tICcuL0xhbmdMaW5rJztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IExhbmdzID0gKCkgPT4gKFxyXG4gICAgPGRpdiBpZD0nbmF2LWxhbmdzJyBjbGFzc05hbWU9J3B1bGwtcmlnaHQnPlxyXG4gICAgICAgIDx1bCBjbGFzc05hbWUgPSAnbmF2IG5hdmJhci1uYXYnPlxyXG4gICAgICAgICAgICB7Xy5tYXAobGFuZ3MsIChsYW5nLCBrZXkpID0+XHJcbiAgICAgICAgICAgICAgICA8TGFuZ0xpbmsga2V5PXtrZXl9IGxhbmc9e2xhbmd9IC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYW5nczsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG47XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgYXBpU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmFwaTtcclxuY29uc3QgYXBpUGVuZGluZ1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoYXBpU2VsZWN0b3IsIChhcGkpID0+IGFwaS5nZXQoJ3BlbmRpbmcnKSk7XHJcbmNvbnN0IGhhc1BlbmRpbmdTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKGFwaVBlbmRpbmdTZWxlY3RvciwgKHBlbmRpbmcpID0+ICFwZW5kaW5nLmlzRW1wdHkoKSk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIGhhc1BlbmRpbmdTZWxlY3RvcixcclxuICAgIChsYW5nLCBoYXNQZW5kaW5nUmVxdWVzdHMpID0+ICh7XHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbiAgICB9KVxyXG4pO1xyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICBoYXNQZW5kaW5nUmVxdWVzdHM6ICFzdGF0ZS5hcGkuZ2V0KCdwZW5kaW5nJykuaXNFbXB0eSgpLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxubGV0IE5hdmJhckhlYWRlciA9ICh7XHJcbiAgICBsYW5nLFxyXG4gICAgaGFzUGVuZGluZ1JlcXVlc3RzLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nbmF2YmFyLWhlYWRlcic+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPSduYXZiYXItYnJhbmQnIGhyZWY9e2AvJHtsYW5nLmdldCgnc2x1ZycpfWB9PlxyXG4gICAgICAgICAgICA8aW1nIHNyYz0nL2ltZy9sb2dvL2xvZ28tOTZ4MzYucG5nJyAvPlxyXG4gICAgICAgIDwvYT5cclxuXHJcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgJ25hdmJhci1zcGlubmVyJzogdHJ1ZSxcclxuICAgICAgICAgICAgYWN0aXZlOiBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbiAgICAgICAgfSl9PlxyXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz5cclxuICAgICAgICA8L3NwYW4+XHJcblxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5OYXZiYXJIZWFkZXIucHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgaGFzUGVuZGluZ1JlcXVlc3RzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuTmF2YmFySGVhZGVyID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKE5hdmJhckhlYWRlcik7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZiYXJIZWFkZXI7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBNYXRjaFdvcmxkIGZyb20gJy4vTWF0Y2hXb3JsZCc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuY29uc3QgV09STERfQ09MT1JTID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbi8vIGNvbnN0IG1hcFRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgLy8gbWF0Y2g6IHN0YXRlLm1hdGNoZXMuZ2V0SW4oWydkYXRhJywgcHJvcHMubWF0Y2hJZF0pLFxyXG4vLyAgICAgICAgIG1hdGNoOiAoSW1tdXRhYmxlLk1hcC5pc01hcChzdGF0ZS5tYXRjaGVzKSlcclxuLy8gICAgICAgICAgICAgPyBzdGF0ZS5tYXRjaGVzLmdldEluKFsnZGF0YScsIHByb3BzLm1hdGNoSWRdKVxyXG4vLyAgICAgICAgICAgICA6IEltbXV0YWJsZS5NYXAoeyAgfSksXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBtYXRjaFNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMubWF0Y2g7XHJcblxyXG4vLyBjb25zdCBtYXRjaFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbi8vICAgICBtYXRjaElkU2VsZWN0b3IsXHJcbi8vICAgICBtYXRjaGVzU2VsZWN0b3IsXHJcbi8vICAgICAobWF0Y2hJZCwgbWF0Y2hlcykgPT4gbWF0Y2hlcy5nZXQobWF0Y2hJZClcclxuLy8gKTtcclxuXHJcbmNvbnN0IG1hcFRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIG1hdGNoU2VsZWN0b3IsXHJcbiAgICAobGFuZywgbWF0Y2gpID0+ICh7IGxhbmcsIG1hdGNoIH0pXHJcbik7XHJcblxyXG5cclxuXHJcbmNsYXNzIE1hdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdNYXRjaERhdGEobmV4dFByb3BzKVxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzTmV3TGFuZyhuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld01hdGNoRGF0YShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubWF0Y2guZXF1YWxzKG5leHRQcm9wcy5tYXRjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdMYW5nKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICBtYXRjaCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbWF0Y2gnLCBtYXRjaC5nZXQoJ2lkJyksIG1hdGNoLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXRjaENvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPSdtYXRjaCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoV09STERfQ09MT1JTLCAoY29sb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkSWQgID0gbWF0Y2guZ2V0SW4oWyd3b3JsZHMnLCBjb2xvcl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hdGNoV29ybGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gJ3RyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB7d29ybGRJZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0ge2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHttYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BpZSA9IHtjb2xvciA9PT0gJ3JlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkSWQgPSB7d29ybGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKjx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXsyfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7dGV4dEFsaWduOiAnY2VudGVyJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD57bW9tZW50KG1hdGNoLmxhc3Rtb2QgKiAxMDAwKS5mb3JtYXQoJ2hoOm1tOnNzJyl9PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1hdGNoID0gY29ubmVjdChcclxuICAgIG1hcFRvUHJvcHMsXHJcbikoTWF0Y2gpO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGNoOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBQaWUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vSWNvbnMvUGllJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbWF0Y2hJZDogcHJvcHMubWF0Y2hJZCxcclxuLy8gICAgICAgICBzY29yZXM6IChJbW11dGFibGUuTWFwLmlzTWFwKHN0YXRlLm1hdGNoZXMpKVxyXG4vLyAgICAgICAgICAgICA/IHN0YXRlLm1hdGNoZXMuZ2V0SW4oWydkYXRhJywgcHJvcHMubWF0Y2hJZCwgJ3Njb3JlcyddKVxyXG4vLyAgICAgICAgICAgICA6IEltbXV0YWJsZS5NYXAoeyByZWQ6IDAsIGJsdWU6IDAsIGdyZWVuOiAwIH0pLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcbmNvbnN0IG1hdGNoSWRTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLm1hdGNoSWQ7XHJcbmNvbnN0IHNjb3Jlc1NlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gKFxyXG4gICAgKEltbXV0YWJsZS5NYXAuaXNNYXAoc3RhdGUubWF0Y2hlcykpXHJcbiAgICA/IHN0YXRlLm1hdGNoZXMuZ2V0SW4oWydkYXRhJywgcHJvcHMubWF0Y2hJZCwgJ3Njb3JlcyddKVxyXG4gICAgOiBJbW11dGFibGUuTWFwKHsgcmVkOiAwLCBibHVlOiAwLCBncmVlbjogMCB9KVxyXG4pO1xyXG5cclxuY29uc3QgbWFwU2VsZWN0b3JzVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgc2NvcmVzU2VsZWN0b3IsXHJcbiAgICBtYXRjaElkU2VsZWN0b3IsXHJcbiAgICAoc2NvcmVzLCBtYXRjaElkKSA9PiAoe1xyXG4gICAgICAgIHNjb3JlcyxcclxuICAgICAgICBtYXRjaElkLFxyXG4gICAgfSlcclxuKTtcclxuXHJcblxyXG5jbGFzcyBNYXRjaFBpZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIHNjb3JlczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5zY29yZXMuZXF1YWxzKG5leHRQcm9wcy5zY29yZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHNjb3JlcyxcclxuICAgICAgICAgICAgbWF0Y2hJZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobWF0Y2hJZCwgc2NvcmVzLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxQaWUgc2NvcmVzPXtzY29yZXMudG9KUygpfSBzaXplPXs2MH0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTWF0Y2hQaWUgPSBjb25uZWN0KFxyXG4gICAgbWFwU2VsZWN0b3JzVG9Qcm9wc1xyXG4pKE1hdGNoUGllKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2hQaWU7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5pbXBvcnQgTWF0Y2hQaWUgZnJvbSAnLi9NYXRjaFBpZSc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgY29sb3JTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmNvbG9yO1xyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IG1hdGNoU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5tYXRjaDtcclxuY29uc3Qgc2hvd1BpZVNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMuc2hvd1BpZTtcclxuY29uc3Qgd29ybGRJZFNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMud29ybGRJZDtcclxuXHJcbmNvbnN0IHdvcmxkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIHdvcmxkSWRTZWxlY3RvcixcclxuICAgIChsYW5nLCB3b3JsZElkKSA9PiB3b3JsZHNbd29ybGRJZF1bbGFuZy5nZXQoJ3NsdWcnKV1cclxuKTtcclxuY29uc3Qgc2NvcmVzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIG1hdGNoU2VsZWN0b3IsXHJcbiAgICAobWF0Y2gpID0+IG1hdGNoLmdldCgnc2NvcmVzJylcclxuKTtcclxuY29uc3Qgc2NvcmVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgY29sb3JTZWxlY3RvcixcclxuICAgIHNjb3Jlc1NlbGVjdG9yLFxyXG4gICAgKGNvbG9yLCBzY29yZXMpID0+IHNjb3Jlcy5nZXQoY29sb3IpXHJcbik7XHJcblxyXG5jb25zdCBtYXBTZWxlY3RvcnNUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBjb2xvclNlbGVjdG9yLFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hTZWxlY3RvcixcclxuICAgIHNjb3JlU2VsZWN0b3IsXHJcbiAgICBzaG93UGllU2VsZWN0b3IsXHJcbiAgICB3b3JsZFNlbGVjdG9yLFxyXG4gICAgKGNvbG9yLCBsYW5nLCBtYXRjaCwgc2NvcmUsIHNob3dQaWUsIHdvcmxkKSA9PiAoe1xyXG4gICAgICAgIGNvbG9yLFxyXG4gICAgICAgIGxhbmcsXHJcbiAgICAgICAgbWF0Y2gsXHJcbiAgICAgICAgc2NvcmUsXHJcbiAgICAgICAgc2hvd1BpZSxcclxuICAgICAgICB3b3JsZCxcclxuICAgIH0pXHJcbik7XHJcblxyXG5cclxuY2xhc3MgTWF0Y2hXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgc2NvcmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBzaG93UGllOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKVxyXG4gICAgICAgICAgICB8fCAoIXRoaXMucHJvcHMubGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgICAgICBzY29yZSxcclxuICAgICAgICAgICAgc2hvd1BpZSxcclxuICAgICAgICAgICAgd29ybGQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHdvcmxkLCBzY29yZSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtjb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt3b3JsZC5saW5rfT57d29ybGQubmFtZX08L2E+XHJcbiAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0ga2lsbHMgJHtjb2xvcn1gfT57bWF0Y2gua2lsbHMgPyBudW1lcmFsKG1hdGNoLmtpbGxzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICAgICAgICAgIHsvKjx0ZCBjbGFzc05hbWU9e2B0ZWFtIGRlYXRocyAke2NvbG9yfWB9PnttYXRjaC5kZWF0aHMgPyBudW1lcmFsKG1hdGNoLmRlYXRoc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+Ki99XHJcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke2NvbG9yfWB9PntcclxuICAgICAgICAgICAgICAgICAgICBzY29yZVxyXG4gICAgICAgICAgICAgICAgICAgID8gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKVxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTwvdGQ+XHJcblxyXG4gICAgICAgICAgICAgICAgeyhzaG93UGllKSA/IDx0ZCBjbGFzc05hbWU9J3BpZScgcm93U3Bhbj0nMyc+PE1hdGNoUGllIG1hdGNoSWQ9e21hdGNoLmdldCgnaWQnKX0gc2l6ZT17NjB9IC8+PC90ZD4gOiBudWxsfVxyXG4gICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NYXRjaFdvcmxkID0gY29ubmVjdChcclxuICAgIG1hcFNlbGVjdG9yc1RvUHJvcHNcclxuKShNYXRjaFdvcmxkKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2hXb3JsZDsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IE1hdGNoIGZyb20gJy4vTWF0Y2gnO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3sgcGFkZGluZ0xlZnQ6ICcuNWVtJyB9fT48aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz48L3NwYW4+O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCByZWdpb25TZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLnJlZ2lvbjtcclxuY29uc3QgbWF0Y2hlc1NlbGVjdG9yID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4gKEltbXV0YWJsZS5NYXAuaXNNYXAoc3RhdGUubWF0Y2hlcykgJiYgc3RhdGUubWF0Y2hlcy5oYXMoJ2RhdGEnKSlcclxuICAgICAgICA/IHN0YXRlLm1hdGNoZXMuZ2V0KCdkYXRhJylcclxuICAgICAgICA6IEltbXV0YWJsZS5NYXAoKTtcclxufTtcclxuXHJcbmNvbnN0IHJlZ2lvbk1hdGNoZXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICBtYXRjaGVzU2VsZWN0b3IsXHJcbiAgICAocmVnaW9uLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmZpbHRlcihtYXRjaCA9PiByZWdpb24uaWQgPT09IG1hdGNoLmdldCgncmVnaW9uJykpXHJcbik7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIHJlZ2lvbk1hdGNoZXNTZWxlY3RvcixcclxuICAgIHJlZ2lvblNlbGVjdG9yLFxyXG4gICAgKG1hdGNoZXMsIHJlZ2lvbikgPT4gKHtcclxuICAgICAgICBtYXRjaGVzLFxyXG4gICAgICAgIHJlZ2lvbixcclxuICAgIH0pXHJcbik7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIG1hdGNoSWRzOiBfLmZpbHRlcihcclxuLy8gICAgICAgICAgICAgc3RhdGUubWF0Y2hlcy5pZHMsXHJcbi8vICAgICAgICAgICAgIGlkID0+IHByb3BzLnJlZ2lvbi5pZCA9PT0gaWQuY2hhckF0KDApXHJcbi8vICAgICAgICAgKSxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIG1hdGNoZXM6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgIXRoaXMucHJvcHMubWF0Y2hlcy5lcXVhbHMobmV4dFByb3BzLm1hdGNoZXMpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ092ZXJ2aWV3OjpNYXRjaGVzOjpzaG91bGRVcGRhdGUnLCBzaG91bGRVcGRhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG1hdGNoZXMsXHJcbiAgICAgICAgICAgIHJlZ2lvbixcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J1JlZ2lvbk1hdGNoZXMnPlxyXG4gICAgICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZWdpb24ubGFiZWx9IE1hdGNoZXNcclxuICAgICAgICAgICAgICAgICAgICB7bWF0Y2hlcy5pc0VtcHR5KCkgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICA8L2gyPlxyXG5cclxuICAgICAgICAgICAgICAgIHttYXRjaGVzLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAobWF0Y2gsIG1hdGNoSWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoIGtleT17bWF0Y2hJZH0gbWF0Y2g9e21hdGNofSAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuTWF0Y2hlcyA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShNYXRjaGVzKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGNoZXM7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCB7IHdvcmxkcyBhcyBTVEFUSUNfV09STERTIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5jb25zdCBXT1JMRFNfSU1NVVQgPSBJbW11dGFibGUuZnJvbUpTKFNUQVRJQ19XT1JMRFMpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5cclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCByZWdpb25TZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLnJlZ2lvbjtcclxuY29uc3Qgd29ybGRzU2VsZWN0b3IgPSAoKSA9PiBXT1JMRFNfSU1NVVQ7XHJcblxyXG5jb25zdCByZWdpb25Xb3JsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICB3b3JsZHNTZWxlY3RvcixcclxuICAgIChsYW5nLCByZWdpb24sIHdvcmxkcykgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gd29ybGRzXHJcbiAgICAgICAgICAgIC5maWx0ZXIod29ybGQgPT4gd29ybGQuZ2V0KCdyZWdpb24nKSA9PT0gcmVnaW9uLmlkKVxyXG4gICAgICAgICAgICAubWFwKHdvcmxkID0+IHdvcmxkLmdldChsYW5nLmdldCgnc2x1ZycpKSlcclxuICAgICAgICAgICAgLnNvcnRCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ25hbWUnKSk7XHJcbiAgICB9XHJcbik7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIHJlZ2lvblNlbGVjdG9yLFxyXG4gICAgcmVnaW9uV29ybGRzU2VsZWN0b3IsXHJcbiAgICAobGFuZywgcmVnaW9uLCByZWdpb25Xb3JsZHMpID0+ICh7XHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICByZWdpb24sXHJcbiAgICAgICAgcmVnaW9uV29ybGRzLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+ICh7XHJcbi8vICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgcmVnaW9uOiBwcm9wcy5yZWdpb24sXHJcbi8vIH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmNsYXNzIFdvcmxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICByZWdpb25Xb3JsZHM6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHJlZ2lvbixcclxuICAgICAgICAgICAgcmVnaW9uV29ybGRzLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uV29ybGRzJz5cclxuICAgICAgICAgICAgICAgIDxoMj57cmVnaW9uLmxhYmVsfSBXb3JsZHM8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgICAgICAgICAge3JlZ2lvbldvcmxkcy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3dvcmxkLmdldCgnc2x1ZycpfT48YSBocmVmPXt3b3JsZC5nZXQoJ2xpbmsnKX0+e3dvcmxkLmdldCgnbmFtZScpfTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuV29ybGRzID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKFdvcmxkcyk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV29ybGRzOyIsIlxyXG4vKlxyXG4qXHJcbiogICBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuXHJcbi8qXHJcbiogICBSZWR1eCBBY3Rpb25zXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBhcGlBY3Rpb25zIGZyb20gJ2FjdGlvbnMvYXBpJztcclxuaW1wb3J0ICogYXMgdGltZW91dEFjdGlvbnMgZnJvbSAnYWN0aW9ucy90aW1lb3V0cyc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmltcG9ydCBNYXRjaGVzIGZyb20gJy4vTWF0Y2hlcyc7XHJcbmltcG9ydCBXb3JsZHMgZnJvbSAnLi9Xb3JsZHMnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIENvbXBvbmVudCBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJFR0lPTlMgPSB7XHJcbiAgICAxOiB7IGxhYmVsOiAnTkEnLCBpZDogJzEnIH0sXHJcbiAgICAyOiB7IGxhYmVsOiAnRVUnLCBpZDogJzInIH0sXHJcbn07XHJcblxyXG5jb25zdCBSRUZSRVNIX1RJTUVPVVQgPSBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGFwaVNlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5hcGk7XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hlc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5tYXRjaGVzO1xyXG5cclxuY29uc3QgZGF0YUVycm9yU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihtYXRjaGVzU2VsZWN0b3IsIChtYXRjaGVzKSA9PiBtYXRjaGVzLmdldCgnZXJyb3InKSk7XHJcbmNvbnN0IG1hdGNoZXNEYXRhU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihtYXRjaGVzU2VsZWN0b3IsIChtYXRjaGVzKSA9PiBtYXRjaGVzLmdldCgnZGF0YScpKTtcclxuY29uc3QgbWF0Y2hlc0xhc3RVcGRhdGVkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihtYXRjaGVzU2VsZWN0b3IsIChtYXRjaGVzKSA9PiBtYXRjaGVzLmdldCgnbGFzdFVwZGF0ZWQnKSk7XHJcbmNvbnN0IG1hdGNoZXNJc0ZldGNoaW5nU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihhcGlTZWxlY3RvciwgKGFwaSkgPT4gYXBpLmdldCgncGVuZGluZycpLmluY2x1ZGVzKCdtYXRjaGVzJykpO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICBkYXRhRXJyb3JTZWxlY3RvcixcclxuICAgIG1hdGNoZXNEYXRhU2VsZWN0b3IsXHJcbiAgICBtYXRjaGVzTGFzdFVwZGF0ZWRTZWxlY3RvcixcclxuICAgIG1hdGNoZXNJc0ZldGNoaW5nU2VsZWN0b3IsXHJcbiAgICAobGFuZywgZGF0YUVycm9yLCBtYXRjaGVzRGF0YSwgbWF0Y2hlc0xhc3RVcGRhdGVkLCBtYXRjaGVzSXNGZXRjaGluZykgPT4gKHtcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIG1hdGNoZXNEYXRhLFxyXG4gICAgICAgIGRhdGFFcnJvcixcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQsXHJcbiAgICAgICAgbWF0Y2hlc0lzRmV0Y2hpbmcsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG5cclxuLy8gICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0ZScsIHN0YXRlLnRpbWVvdXRzKTtcclxuXHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgbWF0Y2hlc0RhdGE6IHN0YXRlLm1hdGNoZXMuZGF0YSxcclxuLy8gICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IHN0YXRlLm1hdGNoZXMubGFzdFVwZGF0ZWQsXHJcbi8vICAgICAgICAgbWF0Y2hlc0lzRmV0Y2hpbmc6IF8uaW5jbHVkZXMoc3RhdGUuYXBpLnBlbmRpbmcsICdtYXRjaGVzJyksXHJcbi8vICAgICAgICAgLy8gdGltZW91dHM6IHN0YXRlLnRpbWVvdXRzLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmZXRjaE1hdGNoZXM6ICgpID0+IGRpc3BhdGNoKGFwaUFjdGlvbnMuZmV0Y2hNYXRjaGVzKCkpLFxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6ICh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLnNldEFwcFRpbWVvdXQoeyBuYW1lLCBjYiwgdGltZW91dCB9KSksXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiAoeyBuYW1lIH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpLFxyXG4gICAgICAgIC8vIGNsZWFyQWxsVGltZW91dHM6ICgpID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQWxsVGltZW91dHMoKSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgZGF0YUVycm9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1hdGNoZXNEYXRhOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hlc0xhc3RVcGRhdGVkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hlc0lzRmV0Y2hpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gdGltZW91dHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuXHJcbiAgICAgICAgZmV0Y2hNYXRjaGVzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXRBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGNsZWFyQXBwVGltZW91dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMvKiwgbmV4dFN0YXRlKi8pIHtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMubWF0Y2hlc0xhc3RVcGRhdGVkICE9PSBuZXh0UHJvcHMubWF0Y2hlc0xhc3RVcGRhdGVkXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMubWF0Y2hlc0lzRmV0Y2hpbmcgIT09IG5leHRQcm9wcy5tYXRjaGVzSXNGZXRjaGluZ1xyXG4gICAgICAgICAgICB8fCB0aGlzLnByb3BzLmRhdGFFcnJvciAhPT0gbmV4dFByb3BzLmRhdGFFcnJvclxyXG4gICAgICAgICAgICB8fCAhdGhpcy5wcm9wcy5tYXRjaGVzRGF0YS5lcXVhbHMobmV4dFByb3BzLm1hdGNoZXNEYXRhKVxyXG4gICAgICAgICAgICB8fCAhdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OnNob3VsZFVwZGF0ZWAsIHNob3VsZFVwZGF0ZSwgdGhpcy5wcm9wcywgbmV4dFByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3OjpzaG91bGRVcGRhdGVgLCBzaG91bGRVcGRhdGUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6aXNOZXdNYXRjaGVzRGF0YWAsIHRoaXMuaXNOZXdNYXRjaGVzRGF0YShuZXh0UHJvcHMpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmlzTmV3TGFuZ2AsIHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcykpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuXHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudERpZE1vdW50KClgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5mZXRjaE1hdGNoZXMoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojpjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKClgKTtcclxuXHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICBtYXRjaGVzSXNGZXRjaGluZyxcclxuICAgICAgICAgICAgZmV0Y2hNYXRjaGVzLFxyXG4gICAgICAgICAgICBzZXRBcHBUaW1lb3V0LFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBpZiAobGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWF0Y2hlc0lzRmV0Y2hpbmcgJiYgIW5leHRQcm9wcy5tYXRjaGVzSXNGZXRjaGluZykge1xyXG4gICAgICAgICAgICBzZXRBcHBUaW1lb3V0KHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdmZXRjaE1hdGNoZXMnLFxyXG4gICAgICAgICAgICAgICAgY2I6ICgpID0+IGZldGNoTWF0Y2hlcygpLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogKCkgPT4gUkVGUkVTSF9USU1FT1VULFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaGVzJyB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGRhdGFFcnJvcixcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0nb3ZlcnZpZXcnPlxyXG5cclxuICAgICAgICAgICAgICAgIHsoZGF0YUVycm9yKSA/IDxwcmUgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1kYW5nZXInPntkYXRhRXJyb3IudG9TdHJpbmcoKX08L3ByZT4gOiBudWxsfVxyXG5cclxuICAgICAgICAgICAgICAgIHsvKiBtYXRjaGVzICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzIHJlZ2lvbj17cmVnaW9ufSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGhyIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIHdvcmxkcyAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgIHtfLm1hcChSRUdJT05TLCAocmVnaW9uKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTEyJyBrZXk9e3JlZ2lvbi5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8V29ybGRzIHJlZ2lvbj17cmVnaW9ufSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5PdmVydmlldyA9IGNvbm5lY3QoXHJcbiAgLy8gbWFwU3RhdGVUb1Byb3BzLFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuICBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShPdmVydmlldyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgRGlyZWN0IERPTSBNYW5pcHVsYXRpb25cclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG4gICAgaWYgKGxhbmcuc2x1ZyAhPT0gJ2VuJykge1xyXG4gICAgICAgIHRpdGxlLnB1c2gobGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLmpvaW4oJyAtICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPdmVydmlldztcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuXHJcblxyXG5cclxuY29uc3Qgc3Bpbm5lciA9IDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJz48L2k+O1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5jb25zdCBndWlsZHNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUuZ3VpbGRzO1xyXG5jb25zdCBndWlsZElkU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5ndWlsZElkO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBndWlsZHNTZWxlY3RvcixcclxuICAgIGd1aWxkSWRTZWxlY3RvcixcclxuICAgIChndWlsZHMsIGd1aWxkSWQpID0+ICh7XHJcbiAgICAgICAgZ3VpbGRJZCxcclxuICAgICAgICBndWlsZDogZ3VpbGRzLmdldChndWlsZElkKSxcclxuICAgIH0pXHJcbik7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICBpZiAocHJvcHMuZ3VpbGRJZCA9PT0gJ0M0MTY4NkRELUEyMDEtRTQxMS04NjNDLUU0MTE1QkRGNDgxRCcpIHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhwcm9wcy5ndWlsZElkLCBzdGF0ZS5ndWlsZHNbcHJvcHMuZ3VpbGRJZF0pO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgZ3VpbGQ6IHN0YXRlLmd1aWxkc1twcm9wcy5ndWlsZElkXSxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgZ3VpbGRJZCA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgICAgICBndWlsZCA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMuZ3VpbGQuZXF1YWxzKG5leHRQcm9wcy5ndWlsZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGd1aWxkIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndHJhY2tlcjo6Z3VpbGRzOjpyZW5kZXInLCBndWlsZC50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YSBocmVmPXtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkLmdldCgnaWQnKX1gfSBpZD17Z3VpbGQuZ2V0KCdpZCcpfT5cclxuICAgICAgICAgICAgICAgIDxFbWJsZW0ga2V5PXtndWlsZC5nZXQoJ2lkJyl9IGd1aWxkSWQ9e2d1aWxkLmdldCgnaWQnKX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2PntcclxuICAgICAgICAgICAgICAgICAgICAoIWd1aWxkLmdldCgnbG9hZGluZycpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtbmFtZSc+e2d1aWxkLmdldCgnbmFtZScpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPntndWlsZC5nZXQoJ3RhZycpID8gYCBbJHtndWlsZC5nZXQoJ3RhZycpfV1gIDogbnVsbH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDogc3Bpbm5lclxyXG4gICAgICAgICAgICAgICAgfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHtcclxuICAgIGd1aWxkIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcCxcclxufTtcclxuXHJcbkd1aWxkID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShHdWlsZCk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEd1aWxkOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcblxyXG5pbXBvcnQgR3VpbGQgZnJvbSAnLi9HdWlsZCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlc2VsZWN0IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuXHJcbmNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcbmNvbnN0IG1hdGNoRGV0YWlsc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5tYXRjaERldGFpbHM7XHJcblxyXG5cclxuY29uc3QgbWF0Y2hHdWlsZElkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBtYXRjaERldGFpbHNTZWxlY3RvcixcclxuICAgIChtYXRjaERldGFpbHMpID0+IChJbW11dGFibGUuTWFwLmlzTWFwKG1hdGNoRGV0YWlscykgJiYgbWF0Y2hEZXRhaWxzLmhhcygnZ3VpbGRJZHMnKSlcclxuICAgICAgICA/IG1hdGNoRGV0YWlscy5nZXQoJ2d1aWxkSWRzJylcclxuICAgICAgICA6IEltbXV0YWJsZS5MaXN0KClcclxuKTtcclxuXHJcblxyXG5jb25zdCBtYXRjaEd1aWxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBndWlsZHNTZWxlY3RvcixcclxuICAgIG1hdGNoR3VpbGRJZHNTZWxlY3RvcixcclxuICAgIChndWlsZHMsIGd1aWxkSWRzKSA9PiBndWlsZHMuZmlsdGVyKGcgPT4gZ3VpbGRJZHMuaW5jbHVkZXMoZy5nZXQoJ2lkJykpKVxyXG4pO1xyXG5cclxuY29uc3Qgc29ydGVkR3VpbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIG1hdGNoR3VpbGRzU2VsZWN0b3IsXHJcbiAgICAoZ3VpbGRzVW5zb3J0ZWQpID0+IHtcclxuICAgICAgICBjb25zdCBndWlsZHMgPSBndWlsZHNVbnNvcnRlZFxyXG4gICAgICAgICAgICAuc29ydEJ5KGcgPT4gZy5nZXQoJ2lkJykpXHJcbiAgICAgICAgICAgIC5zb3J0QnkoZyA9PiBnLmdldCgnbmFtZScpKVxyXG4gICAgICAgICAgICAubWFwKGcgPT4gZy5nZXQoJ2lkJykpO1xyXG5cclxuICAgICAgICByZXR1cm4geyBndWlsZHMgfTtcclxuICAgIH1cclxuKTtcclxuXHJcbi8vIGNvbnN0IHNvcnRlZEd1aWxkSWRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuLy8gICAgIHNvcnRlZEd1aWxkc1NlbGVjdG9yLFxyXG4vLyAgICAgKHVuc29ydGVkR3VpbGRzKSA9PiB7XHJcbi8vICAgICAgICAgcmV0dXJuIHsgZ3VpbGRzOiB1bnNvcnRlZEd1aWxkcy5tYXAoZyA9PiBnLmdldCgnaWQnKSkudG9MaXN0KCkgfTtcclxuLy8gICAgIH1cclxuLy8gKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3QgV3JhcHBlciA9ICh7IGNoaWxkcmVuIH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMjQnPlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcblxyXG5jbGFzcyBHdWlsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBndWlsZHMgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMuZ3VpbGRzLmVxdWFscyhuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBndWlsZHMsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0cmFja2VyOjpndWlsZHM6OnJlbmRlcicvKiwgZ3VpbGRzLnRvSlMoKSovKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFdyYXBwZXI+XHJcbiAgICAgICAgICAgICAgICA8dWwgaWQ9J2d1aWxkcycgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7Z3VpbGRzLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtndWlsZElkfSBjbGFzc05hbWU9J2d1aWxkJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxHdWlsZCBndWlsZElkPXtndWlsZElkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L1dyYXBwZXI+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICB9XHJcbn07XHJcbkd1aWxkcyA9IGNvbm5lY3QoXHJcbiAgc29ydGVkR3VpbGRzU2VsZWN0b3JcclxuKShHdWlsZHMpO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEd1aWxkczsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG4vLyBpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yLFxyXG4gICAgbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyxcclxufSBmcm9tICdsaWIvcmVkdXhIZWxwZXJzJztcclxuXHJcbi8vIGltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5cclxuaW1wb3J0IEVudHJ5IGZyb20gJy4vRW50cnknO1xyXG5cclxuXHJcblxyXG5jb25zdCBvYmplY3RpdmVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm9iamVjdGl2ZXM7XHJcblxyXG5jb25zdCBzb3J0ZWRPYmplY3RpdmVzU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIG9iamVjdGl2ZXNTZWxlY3RvcixcclxuICAgIChvYmplY3RpdmVzKSA9PiBvYmplY3RpdmVzXHJcbiAgICAgICAgLnNvcnRCeShvID0+IC1vLmdldCgnbGFzdEZsaXBwZWQnKSlcclxuICAgICAgICAua2V5U2VxKClcclxuKTtcclxuXHJcbi8vIGNvbnN0IG9iamVjdGl2ZUlkc1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbi8vICAgICBzb3J0ZWRPYmplY3RpdmVzU2VsZWN0b3IsXHJcbi8vICAgICAob2JqZWN0aXZlcykgPT4gb2JqZWN0aXZlcy5rZXlTZXEoKVxyXG4vLyApO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyh7XHJcbiAgICBvYmplY3RpdmVzOiBzb3J0ZWRPYmplY3RpdmVzU2VsZWN0b3IsXHJcbn0pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgLy8gY29uc3QgZW50cmllcyA9IF8uY2hhaW4ocHJvcHMubG9nKVxyXG4vLyAgICAgLy8gICAgIC5maWx0ZXIoZW50cnkgPT4gYnlUeXBlKHByb3BzLnR5cGVGaWx0ZXIsIGVudHJ5KSlcclxuLy8gICAgIC8vICAgICAuZmlsdGVyKGVudHJ5ID0+IGJ5TWFwSWQocHJvcHMubWFwRmlsdGVyLCBlbnRyeSkpXHJcbi8vICAgICAvLyAgICAgLnZhbHVlKCk7XHJcblxyXG4vLyAgICAgY29uc3Qgb2JqZWN0aXZlcyA9IHN0YXRlLm9iamVjdGl2ZXMuc29ydEJ5KG8gPT4gLW8uZ2V0KCdsYXN0RmxpcHBlZCcpKTtcclxuXHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIG9iamVjdGl2ZXMsXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuXHJcbmNsYXNzIEVudHJpZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBvYmplY3RpdmVzIDogSW1tdXRhYmxlUHJvcFR5cGVzLnNlcS5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICAvLyBub3cgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihtb21lbnQpLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWFwRmlsdGVyIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHR5cGVGaWx0ZXIgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgb2JqZWN0aXZlcyxcclxuXHJcbiAgICAgICAgICAgIG1hcEZpbHRlcixcclxuICAgICAgICAgICAgdHlwZUZpbHRlcixcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuICFvYmplY3RpdmVzLmVxdWFscyhuZXh0UHJvcHMub2JqZWN0aXZlcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvYmplY3RpdmVzLFxyXG4gICAgICAgICAgICBtYXBGaWx0ZXIsXHJcbiAgICAgICAgICAgIHR5cGVGaWx0ZXIsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxvbCBpZD0nbG9nJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgICAgICAgICAge29iamVjdGl2ZXMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPEVudHJ5IGtleT17aWR9IGlkPXtpZH0gLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuRW50cmllcyA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzXHJcbikoRW50cmllcyk7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hcChvYmplY3RpdmUpIHtcclxuICAgIGNvbnN0IG1hcElkID0gb2JqZWN0aXZlLmlkLnNwbGl0KCctJylbMF07XHJcbiAgICByZXR1cm4gXy5maW5kKFNUQVRJQy5tYXBzTWV0YSwgbW0gPT4gbW0uaWQgPT0gbWFwSWQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5VHlwZSh0eXBlRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgcmV0dXJuIHR5cGVGaWx0ZXJbZW50cnkudHlwZV07XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBieU1hcElkKG1hcEZpbHRlciwgZW50cnkpIHtcclxuICAgIGlmIChtYXBGaWx0ZXIpIHtcclxuICAgICAgICByZXR1cm4gZW50cnkubWFwSWQgPT09IG1hcEZpbHRlcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudHJpZXM7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuLy8gaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCB7XHJcbiAgICBjcmVhdGVJbW11dGFibGVTZWxlY3RvcixcclxuICAgIG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMsXHJcbn0gZnJvbSAnbGliL3JlZHV4SGVscGVycyc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IE9iamVjdGl2ZU5hbWUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vb2JqZWN0aXZlcy9OYW1lJztcclxuaW1wb3J0IE9iamVjdGl2ZUFycm93IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL29iamVjdGl2ZXMvQXJyb3cnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG4vLyBpbXBvcnQgU3ByaXRlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL1Nwcml0ZSc7XHJcbmltcG9ydCBPYmplY3RpdmVJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL09iamVjdGl2ZSc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgUmVkdXggLyBSZXNlbGVjdFxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlSWRTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmlkO1xyXG5cclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBub3dTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubm93O1xyXG5jb25zdCBndWlsZHNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUuZ3VpbGRzO1xyXG5jb25zdCBvYmplY3RpdmVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm9iamVjdGl2ZXM7XHJcblxyXG5jb25zdCBvYmplY3RpdmVTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgb2JqZWN0aXZlSWRTZWxlY3RvcixcclxuICAgIG9iamVjdGl2ZXNTZWxlY3RvcixcclxuICAgIChpZCwgb2JqZWN0aXZlcykgPT4gb2JqZWN0aXZlcy5nZXQoaWQpXHJcbik7XHJcblxyXG5jb25zdCBoYXNCdWZmU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIG5vd1NlbGVjdG9yLFxyXG4gICAgb2JqZWN0aXZlU2VsZWN0b3IsXHJcbiAgICAobm93LCBvYmplY3RpdmUpID0+IChvYmplY3RpdmUuZ2V0KCdleHBpcmVzJykuZGlmZigpID4gLTIwMDApXHJcbik7XHJcblxyXG5jb25zdCBndWlsZElkU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIG9iamVjdGl2ZVNlbGVjdG9yLFxyXG4gICAgKG9iamVjdGl2ZSkgPT4gb2JqZWN0aXZlLmdldCgnZ3VpbGQnKVxyXG4pO1xyXG5cclxuY29uc3QgZ3VpbGRTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgZ3VpbGRzU2VsZWN0b3IsXHJcbiAgICBndWlsZElkU2VsZWN0b3IsXHJcbiAgICAoZ3VpbGRzLCBndWlsZElkKSA9PiBndWlsZHMuZ2V0KGd1aWxkSWQsIEltbXV0YWJsZS5NYXAoKSlcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMoe1xyXG4gICAgZ3VpbGQ6IGd1aWxkU2VsZWN0b3IsXHJcbiAgICBoYXNCdWZmOiBoYXNCdWZmU2VsZWN0b3IsXHJcbiAgICBpZDogb2JqZWN0aXZlSWRTZWxlY3RvcixcclxuICAgIGxhbmc6IGxhbmdTZWxlY3RvcixcclxuICAgIG5vdzogbm93U2VsZWN0b3IsXHJcbiAgICBvYmplY3RpdmU6IG9iamVjdGl2ZVNlbGVjdG9yLFxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgQ29tcG9uZW50XHJcbiovXHJcblxyXG5jbGFzcyBFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGhhc0J1ZmYgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGlkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxhbmcgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbm93IDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG9iamVjdGl2ZSA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuXHJcbiAgICAgICAgZ3VpbGQgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIGd1aWxkSWQgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGhhc0J1ZmYsXHJcbiAgICAgICAgICAgIGd1aWxkLFxyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICBvYmplY3RpdmUsXHJcbiAgICAgICAgICAgIG5vdyxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAoaGFzQnVmZiAmJiAhbm93LmlzU2FtZShuZXh0UHJvcHMubm93KSlcclxuICAgICAgICAgICAgfHwgIWd1aWxkLmVxdWFscyhuZXh0UHJvcHMuZ3VpbGQpXHJcbiAgICAgICAgICAgIHx8ICFsYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZylcclxuICAgICAgICAgICAgfHwgIW9iamVjdGl2ZS5lcXVhbHMobmV4dFByb3BzLm9iamVjdGl2ZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgLy8gaGFzQnVmZixcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG5vdyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlLFxyXG4gICAgICAgICAgICBndWlsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdEZsaXBwZWQgPSBvYmplY3RpdmUuZ2V0KCdsYXN0RmxpcHBlZCcpO1xyXG4gICAgICAgIGNvbnN0IGV4cGlyZXMgPSBvYmplY3RpdmUuZ2V0KCdleHBpcmVzJyk7XHJcbiAgICAgICAgLy8gY29uc3QgbGFzdENsYWltZWQgPSBvYmplY3RpdmUuZ2V0KCdsYXN0Q2xhaW1lZCcpO1xyXG4gICAgICAgIC8vIGNvbnN0IGxhc3Rtb2QgPSBvYmplY3RpdmUuZ2V0KCdsYXN0bW9kJyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2B0ZWFtICR7IG9iamVjdGl2ZS5nZXQoJ293bmVyJykgfWB9PlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCBsb2ctb2JqZWN0aXZlJz5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctZXhwaXJlJz48VGltZVJlbWFpbmluZyBleHBpcmVzPXtleHBpcmVzfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLXRpbWUnPjxUaW1lU3RhbXAgdGltZT17bGFzdEZsaXBwZWR9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctZ2VvJz48T2JqZWN0aXZlQXJyb3cgaWQ9e2lkfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLXNwcml0ZSc+PE9iamVjdGl2ZUljb24gY29sb3I9e29iamVjdGl2ZS5nZXQoJ293bmVyJyl9IHR5cGU9e29iamVjdGl2ZS5nZXQoJ3R5cGUnKX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1uYW1lJz48T2JqZWN0aXZlTmFtZSBpZD17aWR9IGxhbmc9e2xhbmd9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctZ3VpbGQnPjxPYmplY3RpdmVHdWlsZCBvYmplY3RpdmU9e29iamVjdGl2ZX0gZ3VpbGQ9e2d1aWxkfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbnRyeSA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzXHJcbikoRW50cnkpO1xyXG5cclxuXHJcblxyXG5jb25zdCBUaW1lUmVtYWluaW5nID0gKHsgZXhwaXJlcyB9KSA9PiAoXHJcbiAgICA8c3Bhbj57XHJcbiAgICAgICAgZXhwaXJlcy5pc0FmdGVyKClcclxuICAgICAgICAgICAgPyBtb21lbnQoZXhwaXJlcy5kaWZmKERhdGUubm93KCksICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgOiBudWxsXHJcbiAgICB9PC9zcGFuPlxyXG4pO1xyXG5cclxuY29uc3QgVGltZVN0YW1wID0gKHsgdGltZSwgbWF4QWdlID0gMSB9KSA9PiAoXHJcbiAgICA8c3Bhbj57XHJcbiAgICAgICAgKG1vbWVudCgpLmRpZmYodGltZSwgJ2hvdXJzJykgPCBtYXhBZ2UpXHJcbiAgICAgICAgICAgID8gdGltZS5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgOiB0aW1lLmZyb21Ob3codHJ1ZSlcclxuICAgIH08L3NwYW4+XHJcbik7XHJcblxyXG5jb25zdCBPYmplY3RpdmVHdWlsZCA9ICh7IG9iamVjdGl2ZSwgZ3VpbGQgfSkgPT4gKFxyXG4gICAgPHNwYW4+e1xyXG4gICAgICAgIChvYmplY3RpdmUuZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgICAgICA/IDxhIGhyZWY9eycjJyArIG9iamVjdGl2ZS5nZXQoJ2d1aWxkJyl9PlxyXG4gICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXtvYmplY3RpdmUuZ2V0KCdndWlsZCcpfSAvPlxyXG4gICAgICAgICAgICAgICAge2d1aWxkID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz4ge2d1aWxkLmdldCgnbmFtZScpfSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICB7Z3VpbGQgPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLXRhZyc+IFt7Z3VpbGQuZ2V0KCd0YWcnKX1dIDwvc3Bhbj4gOiAgbnVsbH1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgIH08L3NwYW4+XHJcbik7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hcChvYmplY3RpdmUpIHtcclxuICAgIGNvbnN0IG1hcElkID0gb2JqZWN0aXZlLmlkLnNwbGl0KCctJylbMF07XHJcbiAgICByZXR1cm4gXy5maW5kKFNUQVRJQy5tYXBzTWV0YSwgbW0gPT4gbW0uaWQgPT0gbWFwSWQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW50cnk7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuLy8gaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCB7XHJcbiAgICBjcmVhdGVJbW11dGFibGVTZWxlY3RvcixcclxuICAgIG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMsXHJcbn0gZnJvbSAnbGliL3JlZHV4SGVscGVycyc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSdjbGFzc25hbWVzJztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuaW1wb3J0ICogYXMgbG9nRmlsdGVyQWN0aW9ucyBmcm9tICdhY3Rpb25zL2xvZ0ZpbHRlcnMnO1xyXG5cclxuXHJcbmNvbnN0IGxvZ0ZpbHRlcnNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubG9nRmlsdGVycztcclxuXHJcbmNvbnN0IG1hcEZpbHRlcnNTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbG9nRmlsdGVyc1NlbGVjdG9yLFxyXG4gICAgKGxvZ0ZpbHRlcnMpID0+IGxvZ0ZpbHRlcnMuZ2V0KCdtYXBzJylcclxuKTtcclxuXHJcbmNvbnN0IG9iamVjdGl2ZVR5cGVGaWx0ZXJzU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIGxvZ0ZpbHRlcnNTZWxlY3RvcixcclxuICAgIChsb2dGaWx0ZXJzKSA9PiBsb2dGaWx0ZXJzLmdldCgnb2JqZWN0aXZlVHlwZXMnKVxyXG4pO1xyXG5cclxuLy8gY29uc3QgZXZlbnRUeXBlRmlsdGVyc1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbi8vICAgICBsb2dGaWx0ZXJzU2VsZWN0b3IsXHJcbi8vICAgICAobG9nRmlsdGVycykgPT4gbG9nRmlsdGVycy5nZXQoJ2V2ZW50VHlwZXMnKVxyXG4vLyApO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyh7XHJcbiAgICBtYXBGaWx0ZXJzOiBtYXBGaWx0ZXJzU2VsZWN0b3IsXHJcbiAgICBvYmplY3RpdmVUeXBlRmlsdGVyczogb2JqZWN0aXZlVHlwZUZpbHRlcnNTZWxlY3RvcixcclxuICAgIC8vIGV2ZW50VHlwZUZpbHRlcnM6IGV2ZW50VHlwZUZpbHRlcnNTZWxlY3RvcixcclxufSk7XHJcblxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvZ2dsZU1hcDogKG1hcElkKSA9PiBkaXNwYXRjaChsb2dGaWx0ZXJBY3Rpb25zLnRvZ2dsZU1hcCh7IG1hcElkIH0pKSxcclxuICAgICAgICB0b2dnbGVPYmplY3RpdmVUeXBlOiAob2JqZWN0aXZlVHlwZSkgPT4gZGlzcGF0Y2gobG9nRmlsdGVyQWN0aW9ucy50b2dnbGVPYmplY3RpdmVUeXBlKHsgb2JqZWN0aXZlVHlwZSB9KSksXHJcbiAgICAgICAgLy8gdG9nZ2xlRXZlbnRUeXBlOiAoZXZlbnRUeXBlKSA9PiBkaXNwYXRjaChsb2dGaWx0ZXJBY3Rpb25zLnRvZ2dsZUV2ZW50VHlwZSh7IGV2ZW50VHlwZSB9KSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY2xhc3MgVGFicyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIG1hcEZpbHRlcnMgOiBJbW11dGFibGVQcm9wVHlwZXMuc2V0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgb2JqZWN0aXZlVHlwZUZpbHRlcnMgOiBJbW11dGFibGVQcm9wVHlwZXMuc2V0LmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIHRvZ2dsZU1hcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgICAgICB0b2dnbGVPYmplY3RpdmVUeXBlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVycywgbmV4dFByb3BzLm1hcEZpbHRlcnMpXHJcbiAgICAgICAgICAgIHx8ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vYmplY3RpdmVUeXBlRmlsdGVycywgbmV4dFByb3BzLm9iamVjdGl2ZVR5cGVGaWx0ZXJzKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0cmFja2VyOjpsb2dzOjp0YWJzOjpzaG91bGRVcGRhdGUnLCBzaG91bGRVcGRhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG1hcEZpbHRlcnMsXHJcbiAgICAgICAgICAgIG9iamVjdGl2ZVR5cGVGaWx0ZXJzLFxyXG4gICAgICAgICAgICAvLyBldmVudFR5cGVGaWx0ZXJzU2VsZWN0b3IsXHJcblxyXG4gICAgICAgICAgICB0b2dnbGVNYXAsXHJcbiAgICAgICAgICAgIHRvZ2dsZU9iamVjdGl2ZVR5cGUsXHJcbiAgICAgICAgICAgIC8vIHRvZ2dsZUV2ZW50VHlwZSxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1NUQVRJQy5tYXBzTWV0YScsIFNUQVRJQy5tYXBzTWV0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J2xvZy10YWJzJyBjbGFzc05hbWU9J2ZsZXgtdGFicyc+XHJcblxyXG4gICAgICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIFNUQVRJQy5tYXBzTWV0YSxcclxuICAgICAgICAgICAgICAgICAgICAobWFwTWV0YSkgPT5cclxuICAgICAgICAgICAgICAgICAgICA8TWFwVGFiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bWFwTWV0YS5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e21hcE1ldGEuYWJicn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw9e21hcE1ldGEuYWJicn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVycz17bWFwRmlsdGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e21hcE1ldGEubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlTWFwfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgICAgICBbJ2Nhc3RsZScsICdrZWVwJywgJ3Rvd2VyJywgJ2NhbXAnXSxcclxuICAgICAgICAgICAgICAgICAgICB0ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVRhYlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3R9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZVR5cGU9e3R9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZVR5cGVGaWx0ZXJzPXtvYmplY3RpdmVUeXBlRmlsdGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlT2JqZWN0aXZlVHlwZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuVGFicyA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKFRhYnMpO1xyXG5cclxuXHJcbmNvbnN0IE1hcFRhYiA9ICh7XHJcbiAgICBpZCxcclxuICAgIGxhYmVsLFxyXG4gICAgbWFwRmlsdGVycyxcclxuICAgIG9uQ2xpY2ssXHJcbiAgICB0aXRsZSxcclxufSkgPT4gKFxyXG4gICAgPGFcclxuICAgICAgICB0aXRsZT17dGl0bGV9XHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHsgdGFiOiB0cnVlLCBhY3RpdmU6IG1hcEZpbHRlcnMuaGFzKGlkKSB9KX1cclxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKGlkKX1cclxuICAgID5cclxuICAgICAgICB7bGFiZWx9XHJcbiAgICA8L2E+XHJcbik7XHJcblxyXG5cclxuY29uc3QgT2JqZWN0aXZlVGFiID0gKHtcclxuICAgIG9iamVjdGl2ZVR5cGUsXHJcbiAgICBvYmplY3RpdmVUeXBlRmlsdGVycyxcclxuICAgIG9uQ2xpY2ssXHJcbn0pID0+IChcclxuICAgIDxhXHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgY2hlY2s6IHRydWUsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogb2JqZWN0aXZlVHlwZUZpbHRlcnMuaGFzKG9iamVjdGl2ZVR5cGUpLFxyXG4gICAgICAgICAgICBmaXJzdDogb2JqZWN0aXZlVHlwZSA9PT0gJ2Nhc3RsZScsXHJcbiAgICAgICAgfSl9XHJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhvYmplY3RpdmVUeXBlKX1cclxuICAgID5cclxuXHJcbiAgICAgICAgPE9iamVjdGl2ZUljb24gdHlwZT17b2JqZWN0aXZlVHlwZX0gc2l6ZT17MTh9IC8+XHJcblxyXG4gICAgPC9hPlxyXG4pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJzOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVJbW11dGFibGVTZWxlY3RvciB9IGZyb20gJ2xpYi9yZWR1eEhlbHBlcnMnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcblxyXG5pbXBvcnQgRW50cmllcyBmcm9tICcuL0VudHJpZXMnO1xyXG5pbXBvcnQgVGFicyBmcm9tICcuL1RhYnMnO1xyXG5cclxuXHJcbmNvbnN0IG9iamVjdGl2ZXNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUub2JqZWN0aXZlcztcclxuY29uc3QgbWFwc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5tYXRjaERldGFpbHMuZ2V0KCdtYXBzJyk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIG1hcHNTZWxlY3RvcixcclxuICAgIG9iamVjdGl2ZXNTZWxlY3RvcixcclxuICAgIChtYXBzLCBvYmplY3RpdmVzKSA9PiAoeyBtYXBzLCBvYmplY3RpdmVzIH0pXHJcbik7XHJcblxyXG5cclxuY2xhc3MgTG9nQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbWFwczogSW1tdXRhYmxlUHJvcFR5cGVzLmxpc3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBvYmplY3RpdmVzOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1hcEZpbHRlcjogJycsXHJcbiAgICAgICAgICAgIHR5cGVGaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGNhc3RsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGtlZXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0b3dlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNhbXA6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG1hcHMsXHJcbiAgICAgICAgICAgIG9iamVjdGl2ZXMsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0yNCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nbG9nLWNvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBzPXttYXBzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVGaWx0ZXI9e3RoaXMuc3RhdGUudHlwZUZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVNYXBGaWx0ZXJDbGljaz17dGhpcy5oYW5kbGVNYXBGaWx0ZXJDbGljay5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZVR5cGVGaWx0ZXJDbGljay5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW50cmllc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVGaWx0ZXI9e3RoaXMuc3RhdGUudHlwZUZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2sobWFwRmlsdGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NldCBtYXBGaWx0ZXInLCBtYXBGaWx0ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbWFwRmlsdGVyIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVR5cGVGaWx0ZXJDbGljayh0b2dnbGVUeXBlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZSB0eXBlRmlsdGVyJywgdG9nZ2xlVHlwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xyXG4gICAgICAgICAgICBzdGF0ZS50eXBlRmlsdGVyW3RvZ2dsZVR5cGVdID0gIXN0YXRlLnR5cGVGaWx0ZXJbdG9nZ2xlVHlwZV07XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuTG9nQ29udGFpbmVyID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHMsXHJcbikoTG9nQ29udGFpbmVyKTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dDb250YWluZXI7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IE9iamVjdGl2ZSBmcm9tICcuL09iamVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaE1hcCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWFwLXNlY3Rpb25zJz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgZ2V0TWFwT2JqZWN0aXZlc01ldGEobWF0Y2hNYXAuaWQpLFxyXG4gICAgICAgICAgICAgICAgKHNlY3Rpb24sIGl4KSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICdtYXAtc2VjdGlvbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29sbzogc2VjdGlvbi5sZW5ndGggPT09IDEsXHJcbiAgICAgICAgICAgICAgICB9KX0ga2V5PXtpeH0+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZ2VvKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2dlby5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtnZW8uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e2d1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e2xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb249e2dlby5kaXJlY3Rpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaE1hcD17bWF0Y2hNYXB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3c9e25vd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBPYmplY3RpdmVzTWV0YShtYXBJZCkge1xyXG4gICAgbGV0IG1hcENvZGUgPSAnYmwyJztcclxuXHJcbiAgICBpZiAobWFwSWQgPT09IDM4KSB7XHJcbiAgICAgICAgbWFwQ29kZSA9ICdlYic7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF9cclxuICAgICAgICAuY2hhaW4oU1RBVElDLm9iamVjdGl2ZXNNZXRhKVxyXG4gICAgICAgIC5jbG9uZURlZXAoKVxyXG4gICAgICAgIC5maWx0ZXIob20gPT4gb20ubWFwID09PSBtYXBDb2RlKVxyXG4gICAgICAgIC5ncm91cEJ5KG9tID0+IG9tLmdyb3VwKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgRW1ibGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcbmltcG9ydCBBcnJvdyBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9BcnJvdyc7XHJcbmltcG9ydCBPYmplY3RpdmVJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL09iamVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGlkLFxyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGRpcmVjdGlvbixcclxuICAgIG1hdGNoTWFwLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcbiAgICBjb25zdCBvYmplY3RpdmVJZCA9IGAke21hdGNoTWFwLmlkfS0ke2lkfWA7XHJcbiAgICBjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVzW29iamVjdGl2ZUlkXTtcclxuICAgIGNvbnN0IG1vID0gXy5maW5kKG1hdGNoTWFwLm9iamVjdGl2ZXMsIG8gPT4gby5pZCA9PT0gb2JqZWN0aXZlSWQpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDx1bCBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAnbGlzdC11bnN0eWxlZCc6IHRydWUsXHJcbiAgICAgICAgICAgICd0cmFjay1vYmplY3RpdmUnOiB0cnVlLFxyXG4gICAgICAgICAgICBmcmVzaDogbm93LmRpZmYobW8ubGFzdEZsaXBwZWQsICdzZWNvbmRzJykgPCAzMCxcclxuICAgICAgICAgICAgZXhwaXJpbmc6IG1vLmV4cGlyZXMuaXNBZnRlcihub3cpICYmIG1vLmV4cGlyZXMuZGlmZihub3csICdzZWNvbmRzJykgPCAzMCxcclxuICAgICAgICAgICAgZXhwaXJlZDogbm93LmlzQWZ0ZXIobW8uZXhwaXJlcyksXHJcbiAgICAgICAgICAgIGFjdGl2ZTogbm93LmlzQmVmb3JlKG1vLmV4cGlyZXMpLFxyXG4gICAgICAgIH0pfT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGVmdCc+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLWdlbyc+PEFycm93IGRpcmVjdGlvbj17ZGlyZWN0aW9ufSAvPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stc3ByaXRlJz48T2JqZWN0aXZlSWNvbiBjb2xvcj17bW8ub3duZXJ9IHR5cGU9e21vLnR5cGV9IC8+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1uYW1lJz57b01ldGEubmFtZVtsYW5nLnNsdWddfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0ncmlnaHQnPlxyXG4gICAgICAgICAgICAgICAge21vLmd1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3RyYWNrLWd1aWxkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXsnIycgKyBtby5ndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2d1aWxkc1ttby5ndWlsZF0gPyBgJHtndWlsZHNbbW8uZ3VpbGRdLm5hbWV9IFske2d1aWxkc1ttby5ndWlsZF0udGFnfV1gIDogJ0xvYWRpbmcuLi4nfVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXttby5ndWlsZH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1leHBpcmUnPlxyXG4gICAgICAgICAgICAgICAgICAgIHttby5leHBpcmVzLmlzQWZ0ZXIobm93KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG1vbWVudChtby5leHBpcmVzLmRpZmYobm93LCAnbWlsbGlzZWNvbmRzJykpLmZvcm1hdCgnbTpzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgKTtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBNYXRjaE1hcCBmcm9tICcuL01hdGNoTWFwJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIG1hdGNoLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcblxyXG4gICAgaWYgKF8uaXNFbXB0eShtYXRjaCkpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYXBzID0gXy5rZXlCeShtYXRjaC5tYXBzLCAnaWQnKTtcclxuICAgIGNvbnN0IGN1cnJlbnRNYXBJZHMgPSBfLmtleXMobWFwcyk7XHJcbiAgICBjb25zdCBtYXBzTWV0YUFjdGl2ZSA9IF8uZmlsdGVyKFxyXG4gICAgICAgIFNUQVRJQy5tYXBzTWV0YSxcclxuICAgICAgICBtYXBNZXRhID0+IF8uaW5kZXhPZihjdXJyZW50TWFwSWRzLCBfLnBhcnNlSW50KG1hcE1ldGEuaWQpICE9PSAtMSlcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8c2VjdGlvbiBpZD0nbWFwcyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIG1hcHNNZXRhQWN0aXZlLFxyXG4gICAgICAgICAgICAgICAgKG1hcE1ldGEpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWFwJyBrZXk9e21hcE1ldGEuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj57bWFwTWV0YS5uYW1lfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoTWFwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17Z3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBNZXRhPXttYXBNZXRhfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaE1hcD17bWFwc1ttYXBNZXRhLmlkXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93PXtub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtNic+ezxNYXBEZXRhaWxzIG1hcEtleT0nQ2VudGVyJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdDZW50ZXInKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTE4Jz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdSZWRIb21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdSZWRIb21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nQmx1ZUhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0JsdWVIb21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nR3JlZW5Ib21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdHcmVlbkhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgKi8iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vSWNvbnMvU3ByaXRlJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBIb2xkaW5ncyA9ICh7XHJcbiAgICBjb2xvcixcclxuICAgIGhvbGRpbmdzLFxyXG59KSA9PiAoXHJcbiAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LWlubGluZSc+XHJcbiAgICAgICAge2hvbGRpbmdzLm1hcChcclxuICAgICAgICAgICAgKHR5cGVRdWFudGl0eSwgdHlwZUluZGV4KSA9PlxyXG4gICAgICAgICAgICA8bGkga2V5PXt0eXBlSW5kZXh9PlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB7dHlwZUluZGV4fVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0ge2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3F1YW50aXR5Jz54e3R5cGVRdWFudGl0eX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKX1cclxuICAgIDwvdWw+XHJcbik7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9sZGluZ3M7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IEhvbGRpbmdzIGZyb20gJy4vSG9sZGluZ3MnO1xyXG5cclxuXHJcbmltcG9ydCB7IHdvcmxkcyBhcyBzdGF0aWNXb3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuY29uc3QgU1RBVElDX1dPUkxEUyA9IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljV29ybGRzKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZ2JOdW0gPSBJbW11dGFibGUuTWFwKHsgcmVkOiAwLCBibHVlOiAwLCBncmVlbjogMCB9KTtcclxuXHJcbmNvbnN0IExvYWRpbmcgPSAoeyAgfSkgPT4gKFxyXG4gICAgPGgxIHN0eWxlPXt7IGhlaWdodDogJzEwMHB4JywgZm9udFNpemU6ICc1MHB4JywgbGluZUhlaWdodDogJzEwMHB4JyB9fT5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiByZWR1eCBoZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGNvbG9yU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5jb2xvcjtcclxuXHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuXHJcbmNvbnN0IHdvcmxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBtYXRjaERldGFpbHNTZWxlY3RvcixcclxuICAgIChtYXRjaERldGFpbHMpID0+IG1hdGNoRGV0YWlscy5nZXQoJ3dvcmxkcycpXHJcbik7XHJcblxyXG5jb25zdCB3b3JsZElkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICB3b3JsZHNTZWxlY3RvcixcclxuICAgIChjb2xvciwgd29ybGRzKSA9PiB3b3JsZHMuZ2V0KGNvbG9yKS50b1N0cmluZygpXHJcbik7XHJcblxyXG5jb25zdCB3b3JsZFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICB3b3JsZElkU2VsZWN0b3IsXHJcbiAgICAobGFuZywgd29ybGRJZCkgPT4gU1RBVElDX1dPUkxEUy5nZXRJbihcclxuICAgICAgICBbd29ybGRJZCwgbGFuZy5nZXQoJ3NsdWcnKV0sXHJcbiAgICAgICAgSW1tdXRhYmxlLk1hcCgpXHJcbiAgICApXHJcbik7XHJcblxyXG5jb25zdCBzdGF0c1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBtYXRjaERldGFpbHNTZWxlY3RvcixcclxuICAgIChtYXRjaERldGFpbHMpID0+IG1hdGNoRGV0YWlscy5nZXQoJ3N0YXRzJylcclxuKTtcclxuXHJcbmNvbnN0IHdvcmxkU3RhdHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgY29sb3JTZWxlY3RvcixcclxuICAgIHN0YXRzU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIHN0YXRzKSA9PiBJbW11dGFibGVcclxuICAgICAgICAuTWFwKHtcclxuICAgICAgICAgICAgZGVhdGhzOiB7fSxcclxuICAgICAgICAgICAga2lsbHM6IHt9LFxyXG4gICAgICAgICAgICBob2xkaW5nczoge30sXHJcbiAgICAgICAgICAgIHNjb3Jlczoge30sXHJcbiAgICAgICAgICAgIHRpY2tzOiB7fSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tYXAoKHYsIGtleSkgPT4gc3RhdHMuZ2V0SW4oW2tleSwgY29sb3JdKSlcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgY29sb3JTZWxlY3RvcixcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIHdvcmxkU3RhdHNTZWxlY3RvcixcclxuICAgIHdvcmxkU2VsZWN0b3IsXHJcbiAgICB3b3JsZElkU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIGxhbmcsIHN0YXRzLCB3b3JsZCwgd29ybGRJZCkgPT4gKHtcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIHN0YXRzLFxyXG4gICAgICAgIHdvcmxkLFxyXG4gICAgICAgIHdvcmxkSWQsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgY29uc3Qgd29ybGQgPSBJbW11dGFibGUuZnJvbUpTKFxyXG4vLyAgICAgICAgIChwcm9wcy53b3JsZElkKVxyXG4vLyAgICAgICAgICAgICA/IHdvcmxkc1twcm9wcy53b3JsZElkXVtzdGF0ZS5sYW5nLmdldCgnc2x1ZycpXVxyXG4vLyAgICAgICAgICAgICA6IHt9XHJcbi8vICAgICApO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgY29sb3I6IHByb3BzLmNvbG9yLFxyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgd29ybGRJZDogcHJvcHMud29ybGRJZCxcclxuLy8gICAgICAgICBzdGF0czogSW1tdXRhYmxlLk1hcCgpLFxyXG4vLyAgICAgICAgIHdvcmxkLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHN0YXRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHdvcmxkSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIHN0YXRzLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgIWxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICAgICB8fCAhc3RhdHMuZXF1YWxzKG5leHRQcm9wcy5zdGF0cylcclxuICAgICAgICAgICAgfHwgIXdvcmxkLmVxdWFscyhuZXh0UHJvcHMud29ybGQpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgc3RhdHMsXHJcbiAgICAgICAgICAgIHdvcmxkLFxyXG4gICAgICAgICAgICB3b3JsZElkLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY29sb3InLCBjb2xvcik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkSWQnLCB3b3JsZElkKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnd29ybGQnLCB3b3JsZC50b0pTKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0cycsIHN0YXRzLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHtjb2xvcn1gfT5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh3b3JsZC5oYXMoJ25hbWUnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPGEgaHJlZj17d29ybGQuZ2V0KCdsaW5rJyl9Pnt3b3JsZC5nZXQoJ25hbWUnKX08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJz48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgfTwvaDE+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N0YXRzJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBTY29yZSc+e251bWVyYWwoc3RhdHMuZ2V0KCdzY29yZXMnKSkuZm9ybWF0KCcwLDAnKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIFRpY2snPntudW1lcmFsKHN0YXRzLmdldCgndGlja3MnKSkuZm9ybWF0KCcrMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N1Yi1zdGF0cyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgS2lsbHMnPntudW1lcmFsKHN0YXRzLmdldCgna2lsbHMnKSkuZm9ybWF0KCcwLDAnKX1rPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBEZWF0aHMnPntudW1lcmFsKHN0YXRzLmdldCgnZGVhdGhzJykpLmZvcm1hdCgnMCwwJyl9ZDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPEhvbGRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGluZ3M9e3N0YXRzLmdldCgnaG9sZGluZ3MnKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuV29ybGQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKFdvcmxkKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiAoeyB3b3JsZHM6IHN0YXRlLm1hdGNoRGV0YWlscy5nZXQoJ3dvcmxkcycpIH0pO1xyXG5cclxuXHJcbmxldCBTY29yZWJvYXJkID0gKHtcclxuICAgIHdvcmxkcyxcclxufSkgPT4gIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdyb3cnIGlkPSdzY29yZWJvYXJkcyc+e1xyXG4gICAgICAgICAgICAoSW1tdXRhYmxlLk1hcC5pc01hcCh3b3JsZHMpKVxyXG4gICAgICAgICAgICA/IHdvcmxkcy5rZXlTZXEoKS5tYXAoXHJcbiAgICAgICAgICAgICAgICAoY29sb3IpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTgnIGtleT17Y29sb3J9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V29ybGQgY29sb3I9e2NvbG9yfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgIH08L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcCxcclxufTtcclxuXHJcblNjb3JlYm9hcmQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKFNjb3JlYm9hcmQpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIHByaXZhdGUgbWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZHNQcm9wcyhzdGF0cywgd29ybGRzKSB7XHJcbiAgICAvLyBjb25zdCB3b3JsZHNQcm9wcyA9IEltbXV0YWJsZS5mcm9tSlMoe1xyXG4gICAgLy8gICAgIHJlZDogeyBjb2xvcjogJ3JlZCcsIHdvcmxkOiB3b3JsZHMuZ2V0SW4oJ3JlZCcpLCBzdGF0czogZ2V0V29ybGRTdGF0cyhzdGF0cywgJ3JlZCcpIH0sXHJcbiAgICAvLyAgICAgYmx1ZTogeyBjb2xvcjogJ2JsdWUnLCB3b3JsZDogd29ybGRzLmdldEluKCdibHVlJyksIHN0YXRzOiBnZXRXb3JsZFN0YXRzKHN0YXRzLCAnYmx1ZScpIH0sXHJcbiAgICAvLyAgICAgZ3JlZW46IHsgY29sb3I6ICdncmVlbicsIHdvcmxkOiB3b3JsZHMuZ2V0SW4oJ2dyZWVuJyksIHN0YXRzOiAgZ2V0V29ybGRTdGF0cyhzdGF0cywgJ2dyZWVuJykgfSxcclxuICAgIC8vIH0pO1xyXG5cclxuICAgIGNvbnN0IGNvbG9ycyA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgIHJlZDoge30sXHJcbiAgICAgICAgYmx1ZToge30sXHJcbiAgICAgICAgZ3JlZW46IHt9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkcykpIHtcclxuICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHdvcmxkc1Byb3BzID0gY29sb3JzLm1hcChcclxuICAgICAgICAob2JqLCBjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvYmosIGNvbG9yLCB3b3JsZHMuZ2V0SW4oW2NvbG9yXSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKHtcclxuICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgd29ybGRJZDogd29ybGRzLmdldEluKFtjb2xvcl0pLFxyXG4gICAgICAgICAgICAgICAgc3RhdHM6IGdldFdvcmxkU3RhdHMoc3RhdHMsIGNvbG9yKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3dvcmxkc1Byb3BzJywgd29ybGRzUHJvcHMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ21hdGNoLndvcmxkcycsIG1hdGNoLndvcmxkcyk7XHJcblxyXG4gICAgLy8gaWYgKHdvcmxkcykge1xyXG4gICAgLy8gICAgIHdvcmxkcy5mb3JFYWNoKFxyXG4gICAgLy8gICAgICAgICAod29ybGRJZCwgY29sb3IpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIHdvcmxkc1Byb3BzLnNldEluKFtjb2xvciwgJ2lkJ10sIHdvcmxkSWQpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnd29ybGRzUHJvcHMnLCB3b3JsZHNQcm9wcyk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkc1Byb3BzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRTdGF0cyhzdGF0cywgY29sb3IpIHtcclxuICAgIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgICAgICBkZWF0aHM6IHN0YXRzLmdldEluKFsnZGVhdGhzJywgY29sb3JdLCAwKSxcclxuICAgICAgICBob2xkaW5nczogc3RhdHMuZ2V0SW4oWydob2xkaW5ncycsIGNvbG9yXSwgWzAsIDAsIDAsIDBdKSxcclxuICAgICAgICBraWxsczogc3RhdHMuZ2V0SW4oWydraWxscycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgc2NvcmU6IHN0YXRzLmdldEluKFsnc2NvcmVzJywgY29sb3JdLCAwKSxcclxuICAgICAgICB0aWNrOiBzdGF0cy5nZXRJbihbJ3RpY2tzJywgY29sb3JdLCAwKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBleHBvcnRcclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2NvcmVib2FyZDsiLCJcclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IsXHJcbiAgICBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzLFxyXG59IGZyb20gJ2xpYi9yZWR1eEhlbHBlcnMnO1xyXG5cclxuLy8gaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBfIGZyb20nbG9kYXNoJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQgKiBhcyB0aW1lb3V0QWN0aW9ucyBmcm9tICdhY3Rpb25zL3RpbWVvdXRzJztcclxuaW1wb3J0ICogYXMgbm93QWN0aW9ucyBmcm9tICdhY3Rpb25zL25vdyc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqICAgRGF0YVxyXG4gKi9cclxuXHJcbi8vIGltcG9ydCBEQU8gZnJvbSAnbGliL2RhdGEvdHJhY2tlcic7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIFJlYWN0IENvbXBvbmVudHNcclxuICovXHJcblxyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL1Njb3JlYm9hcmQnO1xyXG5pbXBvcnQgTWFwcyBmcm9tICcuL01hcHMnO1xyXG5pbXBvcnQgTG9nIGZyb20gJy4vTG9nJztcclxuaW1wb3J0IEd1aWxkcyBmcm9tICcuL0d1aWxkcyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IE1BVENIX1JFRlJFU0ggPSBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApO1xyXG5jb25zdCBUSU1FX1JFRlJFU0ggPSAxMDAwIC8gMTtcclxuXHJcbi8vIGNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4gKFxyXG4vLyAgICAgPGgxIGlkPSdBcHBMb2FkaW5nJz5cclxuLy8gICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4vLyAgICAgPC9oMT5cclxuLy8gKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkLFxyXG4vLyAgICAgICAgIGd1aWxkczogc3RhdGUuZ3VpbGRzLFxyXG4vLyAgICAgICAgIC8vIHRpbWVvdXRzOiBzdGF0ZS50aW1lb3V0cyxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUud29ybGQ7XHJcbi8vIGNvbnN0IGFwaVNlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5hcGk7XHJcbi8vIGNvbnN0IG5vd1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ub3c7XHJcbi8vIGNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcblxyXG4vLyBjb25zdCBkZXRhaWxzSXNGZXRjaGluZ1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbi8vICAgICBhcGlTZWxlY3RvcixcclxuLy8gICAgIChhcGkpID0+IGFwaS5nZXQoJ3BlbmRpbmcnKS5pbmNsdWRlcygnbWF0Y2hEZXRhaWxzJylcclxuLy8gKTtcclxuXHJcbmNvbnN0IG1hdGNoRGV0YWlsc0xhc3RVcGRhdGVTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hEZXRhaWxzU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hEZXRhaWxzKSA9PiBtYXRjaERldGFpbHMuZ2V0KCdsYXN0VXBkYXRlJylcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMoe1xyXG4gICAgbGFuZzogbGFuZ1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hEZXRhaWxzTGFzdFVwZGF0ZTogbWF0Y2hEZXRhaWxzTGFzdFVwZGF0ZVNlbGVjdG9yLFxyXG4gICAgd29ybGQ6IHdvcmxkU2VsZWN0b3IsXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXROb3c6ICgpID0+IGRpc3BhdGNoKG5vd0FjdGlvbnMuc2V0Tm93KCkpLFxyXG5cclxuICAgICAgICBmZXRjaEd1aWxkQnlJZDogKGlkKSA9PiBkaXNwYXRjaChhcGlBY3Rpb25zLmZldGNoR3VpbGRCeUlkKGlkKSksXHJcbiAgICAgICAgZmV0Y2hNYXRjaERldGFpbHM6ICh3b3JsZElkKSA9PiBkaXNwYXRjaChhcGlBY3Rpb25zLmZldGNoTWF0Y2hEZXRhaWxzKHdvcmxkSWQpKSxcclxuXHJcbiAgICAgICAgc2V0QXBwVGltZW91dDogKHsgbmFtZSwgY2IsIHRpbWVvdXQgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuc2V0QXBwVGltZW91dCh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pKSxcclxuICAgICAgICBjbGVhckFwcFRpbWVvdXQ6ICh7IG5hbWUgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuXHJcbmNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcz17XHJcbiAgICAgICAgbGFuZyA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIC8vIGRldGFpbHNJc0ZldGNoaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoRGV0YWlsc0xhc3RVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyBndWlsZHMgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbWF0Y2hEZXRhaWxzIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXROb3c6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbm93OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIGZldGNoR3VpbGRCeUlkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXRBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGNsZWFyQXBwVGltZW91dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgd29ybGQsXHJcbiAgICAgICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpO1xyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzKHsgd29ybGQgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm93KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0QXBwVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWU6ICdzZXROb3cnLFxyXG4gICAgICAgICAgICBjYjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXROb3coKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVfUkVGUkVTSCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVHJhY2tlcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgICAgICAvLyBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuXHJcbiAgICAgICAgICAgIG1hdGNoRGV0YWlsc0xhc3RVcGRhdGUsXHJcblxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoRGV0YWlscyxcclxuICAgICAgICAgICAgc2V0QXBwVGltZW91dCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgaWYgKCFsYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykgfHwgd29ybGQuc2x1ZyAhPT0gbmV4dFByb3BzLndvcmxkLnNsdWcpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nLCBuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1hdGNoRGV0YWlsc0xhc3RVcGRhdGUgIT09IG5leHRQcm9wcy5tYXRjaERldGFpbHNMYXN0VXBkYXRlKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgIGNiOiAoKSA9PiBmZXRjaE1hdGNoRGV0YWlscyh7IHdvcmxkIH0pLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogKCkgPT4gTUFUQ0hfUkVGUkVTSCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICAgICAgLy8gfHwgdGhpcy5pc05ld1NlY29uZChuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld1NlY29uZChuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubm93LmlzU2FtZShuZXh0UHJvcHMubm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICghdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaERldGFpbHMnIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0ndHJhY2tlcic+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVib2FyZCAvPlxyXG4gICAgICAgICAgICAgICAgPExvZyAvPlxyXG4gICAgICAgICAgICAgICAgPEd1aWxkcyAvPlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB7LypcclxuICAgICAgICAgICAgICAgIHsobWF0Y2ggJiYgIV8uaXNFbXB0eShtYXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAqL31cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblRyYWNrZXIgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuICBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShUcmFja2VyKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBtb21lbnROb3coKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICogMTAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGROYW1lID0gd29ybGQubmFtZTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLmpvaW4oJyAtICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEFycm93ID0gKHsgZGlyZWN0aW9uIH0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBjb25zdCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmICghZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcnJvdzsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEVtYmxlbSA9ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbWJsZW07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gKHtcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxcclxuICAgIHR5cGUsXHJcbiAgICBzaXplLFxyXG59KSA9PiAoXHJcbiAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtnZXRTcmMoeyBjb2xvciwgdHlwZSB9KX1cclxuICAgICAgICBjbGFzc05hbWU9e2dldENsYXNzKHsgdHlwZSB9KX1cclxuICAgICAgICB3aWR0aD17c2l6ZSA/IHNpemUgOiBudWxsfVxyXG4gICAgICAgIGhlaWdodD17c2l6ZSA/IHNpemUgOiBudWxsfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U3JjKHsgY29sb3IsIHR5cGUgfSkge1xyXG4gICAgbGV0IHNyYyA9ICcvaW1nL2ljb25zL2Rpc3QvJztcclxuXHJcbiAgICBzcmMgKz0gdHlwZTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09ICdibGFjaycpIHtcclxuICAgICAgICBzcmMgKz0gJy0nICsgY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc3JjICs9ICcuc3ZnJztcclxuXHJcbiAgICByZXR1cm4gc3JjO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldENsYXNzKHsgdHlwZSB9KSB7XHJcbiAgICByZXR1cm4gYGljb24tb2JqZWN0aXZlIGljb24tb2JqZWN0aXZlLSR7dHlwZX1gO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdGl2ZTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcblxyXG4vKlxyXG4gKiBDb21wb25lbnQgR2xvYmFsc1xyXG4gKi9cclxuXHJcbmNvbnN0IElOU1RBTkNFID0ge1xyXG4gICAgc2l6ZSAgOiA2MCxcclxuICAgIHN0cm9rZTogMixcclxufTtcclxuXHJcblxyXG5jb25zdCBQaWUgPSAoeyBzY29yZXMgfSkgPT4gKFxyXG4gICAgPGltZ1xyXG4gICAgICAgIHNyYyA9IHtnZXRJbWFnZVNvdXJjZShzY29yZXMpfVxyXG5cclxuICAgICAgICB3aWR0aCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cHM6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5yZWR9LCR7c2NvcmVzLmJsdWV9LCR7c2NvcmVzLmdyZWVufT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGllOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBTcHJpdGUgPSAoe1xyXG4gICAgY29sb3IsXHJcbiAgICB0eXBlLFxyXG59KSA9PiAoXHJcbiAgICA8c3BhbiBjbGFzc05hbWUgPSB7YHNwcml0ZSAke3R5cGV9ICR7Y29sb3J9YH0gLz5cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNwcml0ZTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IEFycm93SWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9BcnJvdyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IE9iamVjdGl2ZUFycm93ID0gKHtcclxuICAgIGlkLFxyXG59KSA9PiAoXHJcbiAgICA8QXJyb3dJY29uIGRpcmVjdGlvbj17IGdldE9iamVjdGl2ZURpcmVjdGlvbihpZCkgfSAvPlxyXG4pO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVEaXJlY3Rpb24oaWQpIHtcclxuICAgIGNvbnN0IGJhc2VJZCA9IGlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdGl2ZUFycm93OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IE9iamVjdGl2ZU5hbWUgPSAoe1xyXG4gICAgaWQsXHJcbiAgICBsYW5nLFxyXG59KSA9PiAoXHJcbiAgICA8c3Bhbj57U1RBVElDLm9iamVjdGl2ZXNbaWRdLm5hbWVbbGFuZy5nZXQoJ3NsdWcnKV19PC9zcGFuPlxyXG4pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmplY3RpdmVOYW1lOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQZXJmIGZyb20gJ3JlYWN0LWFkZG9ucy1wZXJmJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmZvcm1hbmNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIG9uU3RhcnQoKSB7XHJcbiAgICAgICAgUGVyZi5zdGFydCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQZXJmIHN0YXJ0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0b3AoKSB7XHJcbiAgICAgICAgUGVyZi5zdG9wKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1BlcmYgc3RvcHBlZCcpO1xyXG4gICAgICAgIGNvbnN0IGxhc3RNZWFzdXJlbWVudHMgPSBQZXJmLmdldExhc3RNZWFzdXJlbWVudHMoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmRpcihsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgICAgICAvLyBQZXJmLnByaW50RE9NKGxhc3RNZWFzdXJlbWVudHMpO1xyXG4gICAgICAgIFBlcmYucHJpbnRJbmNsdXNpdmUobGFzdE1lYXN1cmVtZW50cyk7XHJcbiAgICAgICAgUGVyZi5wcmludEV4Y2x1c2l2ZShsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgICAgICBQZXJmLnByaW50V2FzdGVkKGxhc3RNZWFzdXJlbWVudHMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPlBlcmZvcm1hbmNlOiA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5vblN0YXJ0fT5TdGFydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLm9uU3RvcH0+U3RvcDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIlxyXG4vKlxyXG4qICAgR2VuZXJpY1xyXG4qL1xyXG5cclxuLy8gcm91dGVzXHJcbmV4cG9ydCBjb25zdCBTRVRfUk9VVEUgPSAnU0VUX1JPVVRFJztcclxuXHJcbi8vIGxhbmdzXHJcbmV4cG9ydCBjb25zdCBTRVRfTEFORyA9ICdTRVRfTEFORyc7XHJcblxyXG4vLyB0aW1lb3V0c1xyXG5leHBvcnQgY29uc3QgQUREX1RJTUVPVVQgPSAnQUREX1RJTUVPVVQnO1xyXG5leHBvcnQgY29uc3QgUkVNT1ZFX1RJTUVPVVQgPSAnUkVNT1ZFX1RJTUVPVVQnO1xyXG4vLyBleHBvcnQgY29uc3QgUkVNT1ZFX0FMTF9USU1FT1VUUyA9ICdSRU1PVkVfQUxMX1RJTUVPVVRTJztcclxuXHJcbi8vIHdvcmxkc1xyXG5leHBvcnQgY29uc3QgU0VUX1dPUkxEID0gJ1NFVF9XT1JMRCc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9XT1JMRCA9ICdDTEVBUl9XT1JMRCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBBUElcclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBBUElfUkVRVUVTVF9PUEVOID0gJ0FQSV9SRVFVRVNUX09QRU4nO1xyXG5leHBvcnQgY29uc3QgQVBJX1JFUVVFU1RfU1VDQ0VTUyA9ICdBUElfUkVRVUVTVF9TVUNDRVNTJztcclxuZXhwb3J0IGNvbnN0IEFQSV9SRVFVRVNUX0ZBSUxFRCA9ICdBUElfUkVRVUVTVF9GQUlMRUQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgT3ZlcnZpZXdcclxuKi9cclxuXHJcbi8vIG1hdGNoZXNcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFUyA9ICdSRUNFSVZFX01BVENIRVMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MgPSAnUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCA9ICdSRUNFSVZFX01BVENIRVNfRkFJTEVEJztcclxuXHJcblxyXG5cclxuLypcclxuKiAgIFRyYWNrZXJcclxuKi9cclxuXHJcbi8vIG5vd1xyXG5leHBvcnQgY29uc3QgU0VUX05PVyA9ICdTRVRfTk9XJztcclxuXHJcbi8vIG1hdGNoZXNcclxuZXhwb3J0IGNvbnN0IENMRUFSX01BVENIREVUQUlMUyA9ICdDTEVBUl9NQVRDSERFVEFJTFMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSERFVEFJTFMgPSAnUkVDRUlWRV9NQVRDSERFVEFJTFMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyA9ICdSRUNFSVZFX01BVENIREVUQUlMU19TVUNDRVNTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCA9ICdSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQnO1xyXG5cclxuXHJcbi8vIGd1aWxkc1xyXG5leHBvcnQgY29uc3QgSU5JVElBTElaRV9HVUlMRCA9ICdJTklUSUFMSVpFX0dVSUxEJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfR1VJTEQgPSAnUkVDRUlWRV9HVUlMRCc7XHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX0dVSUxEX0ZBSUxFRCA9ICdSRUNFSVZFX0dVSUxEX0ZBSUxFRCc7XHJcblxyXG4vLyBvYmplY3RpdmVzXHJcbmV4cG9ydCBjb25zdCBPQkpFQ1RJVkVTX1JFU0VUID0gJ09CSkVDVElWRVNfUkVTRVQnO1xyXG5leHBvcnQgY29uc3QgT0JKRUNUSVZFU19VUERBVEUgPSAnT0JKRUNUSVZFU19VUERBVEUnO1xyXG5leHBvcnQgY29uc3QgT0JKRUNUSVZFX1VQREFURSA9ICdPQkpFQ1RJVkVfVVBEQVRFJztcclxuXHJcbi8vIGxvZ1xyXG5leHBvcnQgY29uc3QgTE9HX0ZJTFRFUlNfVE9HR0xFX01BUCA9ICdMT0dfRklMVEVSU19UT0dHTEVfTUFQJztcclxuZXhwb3J0IGNvbnN0IExPR19GSUxURVJTX1RPR0dMRV9PQkpFQ1RJVkVfVFlQRSA9ICdMT0dfRklMVEVSU19UT0dHTEVfT0JKRUNUSVZFX1RZUEUnO1xyXG5leHBvcnQgY29uc3QgTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUgPSAnTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgVHJhY2tlclxyXG4qLyIsIlxyXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcclxuXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiBudWxsO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGdldE1hdGNoZXMsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRTbHVnLFxyXG4gICAgZ2V0TWF0Y2hCeVdvcmxkSWQsXHJcbiAgICBnZXRHdWlsZEJ5SWQsXHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXMoe1xyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoZXMoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlc2ApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRTbHVnKHtcclxuICAgIHdvcmxkU2x1ZyxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRNYXRjaEJ5V29ybGRTbHVnKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRTbHVnfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRJZCh7XHJcbiAgICB3b3JsZElkLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZElkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpbGRCeUlkKHtcclxuICAgIGd1aWxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0R3VpbGRCeUlkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uP2d1aWxkX2lkPSR7Z3VpbGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uUmVxdWVzdChjYWxsYmFja3MsIGVyciwgcmVzKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpvblJlcXVlc3QoKScsIGVyciwgcmVzICYmIHJlcy5ib2R5KTtcclxuXHJcbiAgICBpZiAoZXJyIHx8IHJlcy5lcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrcy5lcnJvcihlcnIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLnN1Y2Nlc3MocmVzLmJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrcy5jb21wbGV0ZSgpO1xyXG59IiwiXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZVNlbGVjdG9yLFxyXG4gICAgY3JlYXRlU2VsZWN0b3JDcmVhdG9yLFxyXG4gICAgZGVmYXVsdE1lbW9pemUsXHJcbiB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcblxyXG5cclxuLy8gY3JlYXRlIGEgXCJzZWxlY3RvciBjcmVhdG9yXCIgdGhhdCB1c2VzIEltbXV0YWJsZS5pcyBpbnN0ZWFkIG9mID09PVxyXG5leHBvcnQgY29uc3QgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXHJcbiAgZGVmYXVsdE1lbW9pemUsXHJcbiAgSW1tdXRhYmxlLmlzXHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAgICBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBtYXBTZWxlY3RvcnNUb1Byb3BzKHtcclxuICAgICAgICBrZXk6IHNlbGVjdG9yLFxyXG4gICAgICAgIGtleTI6IHNlbGVjdG9yMixcclxuICAgIH0pO1xyXG5cclxuICAgIHRvXHJcblxyXG4gICAgY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICAgICAgLi5zZWxlY3RvcnMsXHJcbiAgICAgICAgKC4uLmtleXMpID0+ICh7Li4ua2V5c30pXHJcbiAgICApO1xyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcFNlbGVjdG9yc1RvUHJvcHMgPSAoc2VsZWN0b3JzTWFwLCBzZWxlY3RvckNyZWF0b3IgPSBjcmVhdGVTZWxlY3RvcikgPT4ge1xyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9yc01hcCk7XHJcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBrZXlzLm1hcChrID0+IHNlbGVjdG9yc01hcFtrXSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHNlbGVjdG9yQ3JlYXRvcihcclxuICAgICAgICAuLi5zZWxlY3RvcnMsXHJcbiAgICAgICAgKC4uLmFyZ3MpID0+IGtleXMucmVkdWNlKFxyXG4gICAgICAgICAgICAocmVzdWx0LCB2YWwsIGkpID0+XHJcbiAgICAgICAgICAgICh7IC4uLnJlc3VsdCwgW3ZhbF06IGFyZ3NbaV0gfSksIHt9KVxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzID0gKHNlbGVjdG9yc01hcCkgPT4gbWFwU2VsZWN0b3JzVG9Qcm9wcyhzZWxlY3RvcnNNYXAsIGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IFNUQVRJQ19MQU5HUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MnO1xyXG5pbXBvcnQgU1RBVElDX1dPUkxEUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMnO1xyXG5pbXBvcnQgU1RBVElDX09CSkVDVElWRVMgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZXNfdjJfbWVyZ2VkJztcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuICAgIHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZFtsYW5nU2x1Z10uc2x1Z10uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzID0gU1RBVElDX09CSkVDVElWRVM7XHJcbmV4cG9ydCBjb25zdCBsYW5ncyA9IFNUQVRJQ19MQU5HUztcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgd29ybGRzID0gX1xyXG4gICAgLmNoYWluKFNUQVRJQ19XT1JMRFMpXHJcbiAgICAua2V5QnkoJ2lkJylcclxuICAgIC5tYXBWYWx1ZXMoKHdvcmxkKSA9PiB7XHJcbiAgICAgICAgXy5mb3JFYWNoKFxyXG4gICAgICAgICAgICBTVEFUSUNfTEFOR1MsXHJcbiAgICAgICAgICAgIChsYW5nKSA9PlxyXG4gICAgICAgICAgICB3b3JsZFtsYW5nLnNsdWddLmxpbmsgPSBnZXRXb3JsZExpbmsobGFuZy5zbHVnLCB3b3JsZClcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiB3b3JsZDtcclxuICAgIH0pXHJcbiAgICAudmFsdWUoKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXNNZXRhID0gXy5rZXlCeShbXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMSwgaWQ6ICc5JywgZGlyZWN0aW9uOiAnJ30sICAgICAgICAgIC8vIHN0b25lbWlzdFxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgICAvLyBvdmVybG9va1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTcnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyBtZW5kb25zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcyMCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgIC8vIHZlbG9rYVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTgnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAvLyBhbnpcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE5JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgLy8gb2dyZVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgICAvLyBzcGVsZGFuXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICc1JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgIC8vIHBhbmdcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzInLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gdmFsbGV5XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcxNScsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGxhbmdvclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMjInLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBicmF2b3N0XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcxNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIHF1ZW50aW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzIxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gZHVyaW9zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICc3JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGRhbmVcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzgnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAgLy8gdW1iZXJcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzMnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gbG93bGFuZHNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzExJywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gYWxkb25zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMycsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGplcnJpZmVyXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMicsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIHdpbGRjcmVla1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBrbG92YW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEwJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gcm9ndWVzXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICc0JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIGdvbGFudGFcclxuXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTEzJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAvLyByYW1wYXJ0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTA2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAvLyB1bmRlcmNyb2Z0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAvLyBwYWxhY2VcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDInLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGFjYWRlbXlcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDQnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIG5lY3JvcG9saXNcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICc5OScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGxhYlxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzExNScsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gaGlkZWF3YXlcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDknLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIHJlZnVnZVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzExMCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gb3V0cG9zdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwNScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZGVwb3RcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDEnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIGVuY2FtcFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwMCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZmFybVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzExNicsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgLy8gd2VsbFxyXG5dLCAnaWQnKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG1hcHNNZXRhID0gW1xyXG4gICAge2lkOiAzOCwgbmFtZTogJ0V0ZXJuYWwgQmF0dGxlZ3JvdW5kcycsIGFiYnI6ICdFQid9LFxyXG4gICAge2lkOiAxMDk5LCBuYW1lOiAnUmVkIEJvcmRlcmxhbmRzJywgYWJicjogJ1JlZCd9LFxyXG4gICAge2lkOiAxMTAyLCBuYW1lOiAnR3JlZW4gQm9yZGVybGFuZHMnLCBhYmJyOiAnR3JuJ30sXHJcbiAgICB7aWQ6IDExNDMsIG5hbWU6ICdCbHVlIEJvcmRlcmxhbmRzJywgYWJicjogJ0JsdSd9LFxyXG5dO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzR2VvID0ge1xyXG4gICAgZWI6IFtbXHJcbiAgICAgICAge2lkOiAnOScsIGRpcmVjdGlvbjogJyd9LCAgICAgICAgICAvLyBzdG9uZW1pc3RcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgIC8vIG92ZXJsb29rXHJcbiAgICAgICAge2lkOiAnMTcnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyBtZW5kb25zXHJcbiAgICAgICAge2lkOiAnMjAnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAvLyB2ZWxva2FcclxuICAgICAgICB7aWQ6ICcxOCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgIC8vIGFuelxyXG4gICAgICAgIHtpZDogJzE5JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgLy8gb2dyZVxyXG4gICAgICAgIHtpZDogJzYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAgLy8gc3BlbGRhblxyXG4gICAgICAgIHtpZDogJzUnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAgLy8gcGFuZ1xyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzInLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gdmFsbGV5XHJcbiAgICAgICAge2lkOiAnMTUnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBsYW5nb3JcclxuICAgICAgICB7aWQ6ICcyMicsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGJyYXZvc3RcclxuICAgICAgICB7aWQ6ICcxNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIHF1ZW50aW5cclxuICAgICAgICB7aWQ6ICcyMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGR1cmlvc1xyXG4gICAgICAgIHtpZDogJzcnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gZGFuZVxyXG4gICAgICAgIHtpZDogJzgnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAgLy8gdW1iZXJcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICczJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGxvd2xhbmRzXHJcbiAgICAgICAge2lkOiAnMTEnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBhbGRvbnNcclxuICAgICAgICB7aWQ6ICcxMycsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGplcnJpZmVyXHJcbiAgICAgICAge2lkOiAnMTInLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyB3aWxkY3JlZWtcclxuICAgICAgICB7aWQ6ICcxNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGtsb3ZhblxyXG4gICAgICAgIHtpZDogJzEwJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gcm9ndWVzXHJcbiAgICAgICAge2lkOiAnNCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyBnb2xhbnRhXHJcbiAgICBdXSxcclxuICAgIGJsMjogW1tcclxuICAgICAgICB7aWQ6ICcxMTMnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgIC8vIHJhbXBhcnRcclxuICAgICAgICB7aWQ6ICcxMDYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgIC8vIHVuZGVyY3JvZnRcclxuICAgICAgICB7aWQ6ICcxMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgIC8vIHBhbGFjZVxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzEwMicsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gYWNhZGVteVxyXG4gICAgICAgIHtpZDogJzEwNCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gbmVjcm9wb2xpc1xyXG4gICAgICAgIHtpZDogJzk5JywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gbGFiXHJcbiAgICAgICAge2lkOiAnMTE1JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBoaWRlYXdheVxyXG4gICAgICAgIHtpZDogJzEwOScsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gcmVmdWdlXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMTEwJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBvdXRwb3N0XHJcbiAgICAgICAge2lkOiAnMTA1JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBkZXBvdFxyXG4gICAgICAgIHtpZDogJzEwMScsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gZW5jYW1wXHJcbiAgICAgICAge2lkOiAnMTAwJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBmYXJtXHJcbiAgICAgICAge2lkOiAnMTE2JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAvLyB3ZWxsXHJcbiAgICBdXSxcclxufTtcclxuIiwiaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zykge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dldFdvcmxkRnJvbVNsdWcoKScsIGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgIGNvbnN0IHdvcmxkID0gXy5maW5kKFxyXG4gICAgICAgIHdvcmxkcyxcclxuICAgICAgICB3ID0+IHdbbGFuZ1NsdWddLnNsdWcgPT09IHdvcmxkU2x1Z1xyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkOiB3b3JsZC5pZCxcclxuICAgICAgICAuLi53b3JsZFtsYW5nU2x1Z10sXHJcbiAgICB9O1xyXG59IiwiXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICBBUElfUkVRVUVTVF9TVUNDRVNTLFxyXG4gICAgQVBJX1JFUVVFU1RfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIHBlbmRpbmc6IEltbXV0YWJsZS5MaXN0KFtdKSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgYXBpID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjphcGknLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBBUElfUkVRVUVTVF9PUEVOOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6YXBpJywgYWN0aW9uLnR5cGUsIGFjdGlvbi5yZXF1ZXN0S2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICdwZW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHUgPT4gdS5wdXNoKGFjdGlvbi5yZXF1ZXN0S2V5KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjYXNlIEFQSV9SRVFVRVNUX1NVQ0NFU1M6XHJcbiAgICAgICAgY2FzZSBBUElfUkVRVUVTVF9GQUlMRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjphcGknLCBhY3Rpb24udHlwZSwgYWN0aW9uLnJlcXVlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXBkYXRlKFxyXG4gICAgICAgICAgICAgICAgJ3BlbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdSA9PiB1LmZpbHRlck5vdChmID0+IGYgPT09IGFjdGlvbi5yZXF1ZXN0S2V5KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcGk7IiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBJTklUSUFMSVpFX0dVSUxELFxyXG4gICAgUkVDRUlWRV9HVUlMRCxcclxuICAgIFJFQ0VJVkVfR1VJTERfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IEltbXV0YWJsZS5NYXAoKTtcclxuXHJcblxyXG5jb25zdCBndWlsZHMgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Omd1aWxkcycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBJTklUSUFMSVpFX0dVSUxEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6Z3VpbGRzJywgSU5JVElBTElaRV9HVUlMRCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5zZXQoXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX0dVSUxEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6Z3VpbGRzJywgUkVDRUlWRV9HVUlMRCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5zZXQoXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBhY3Rpb24ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB0YWc6IGFjdGlvbi50YWcsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfR1VJTERfRkFJTEVEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6Z3VpbGRzJywgUkVDRUlWRV9HVUlMRF9GQUlMRUQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuc2V0SW4oW2FjdGlvbi5ndWlsZElkLCAnZXJyb3InXSwgYWN0aW9uLmVycm9yKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ3VpbGRzOyIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcclxuXHJcbmltcG9ydCBhcGkgZnJvbSAnLi9hcGknO1xyXG5pbXBvcnQgZ3VpbGRzIGZyb20gJy4vZ3VpbGRzJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnLi9sYW5nJztcclxuaW1wb3J0IGxvZ0ZpbHRlcnMgZnJvbSAnLi9sb2dGaWx0ZXJzJztcclxuaW1wb3J0IG1hdGNoZXMgZnJvbSAnLi9tYXRjaGVzJztcclxuaW1wb3J0IG1hdGNoRGV0YWlscyBmcm9tICcuL21hdGNoRGV0YWlscyc7XHJcbmltcG9ydCBub3cgZnJvbSAnLi9ub3cnO1xyXG5pbXBvcnQgb2JqZWN0aXZlcyBmcm9tICcuL29iamVjdGl2ZXMnO1xyXG5pbXBvcnQgcm91dGUgZnJvbSAnLi9yb3V0ZSc7XHJcbmltcG9ydCB0aW1lb3V0cyBmcm9tICcuL3RpbWVvdXRzJztcclxuaW1wb3J0IHdvcmxkIGZyb20gJy4vd29ybGQnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgYXBpLFxyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGxvZ0ZpbHRlcnMsXHJcbiAgICBtYXRjaGVzLFxyXG4gICAgbWF0Y2hEZXRhaWxzLFxyXG4gICAgbm93LFxyXG4gICAgb2JqZWN0aXZlcyxcclxuICAgIHJvdXRlLFxyXG4gICAgdGltZW91dHMsXHJcbiAgICB3b3JsZCxcclxufSk7IiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuaW1wb3J0IHsgU0VUX0xBTkcgfSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCB7IGxhbmdzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5jb25zdCBkZWZhdWx0U2x1ZyA9ICdlbic7XHJcbmNvbnN0IGRlZmF1bHRMYW5nID0gSW1tdXRhYmxlLmZyb21KUyhsYW5nc1tkZWZhdWx0U2x1Z10pO1xyXG5cclxuXHJcbmNvbnN0IGxhbmcgPSAoc3RhdGUgPSBkZWZhdWx0TGFuZywgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfTEFORzpcclxuICAgICAgICAgICAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlMobGFuZ3NbYWN0aW9uLnNsdWddKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGFuZzsiLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgTE9HX0ZJTFRFUlNfVE9HR0xFX01BUCxcclxuICAgIExPR19GSUxURVJTX1RPR0dMRV9PQkpFQ1RJVkVfVFlQRSxcclxuICAgIExPR19GSUxURVJTX1RPR0dMRV9FVkVOVF9UWVBFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBtYXBzOiBJbW11dGFibGUuU2V0KFsnRUInLCAnUmVkJywgJ0dybicsICdCbHUnXSksXHJcbiAgICBvYmplY3RpdmVUeXBlczogSW1tdXRhYmxlLlNldChbJ2Nhc3RsZScsICdrZWVwJywgJ3Rvd2VyJywgJ2NhbXAnXSksXHJcbiAgICBldmVudFR5cGVzOiBJbW11dGFibGUuU2V0KFsnY2FwdHVyZScsICdjbGFpbSddKSxcclxufSk7XHJcblxyXG5jb25zdCBsb2dGaWx0ZXJzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBMT0dfRklMVEVSU19UT0dHTEVfTUFQOlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVkdWNlcjo6bG9nRmlsdGVycycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXBkYXRlKFxyXG4gICAgICAgICAgICAgICAgJ21hcHMnLFxyXG4gICAgICAgICAgICAgICAgdiA9PlxyXG4gICAgICAgICAgICAgICAgdi5oYXMoYWN0aW9uLm1hcElkKVxyXG4gICAgICAgICAgICAgICAgICAgID8gdi5kZWxldGUoYWN0aW9uLm1hcElkKVxyXG4gICAgICAgICAgICAgICAgICAgIDogdi5hZGQoYWN0aW9uLm1hcElkKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjYXNlIExPR19GSUxURVJTX1RPR0dMRV9PQkpFQ1RJVkVfVFlQRTpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6OmxvZ0ZpbHRlcnMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICdvYmplY3RpdmVUeXBlcycsXHJcbiAgICAgICAgICAgICAgICB2ID0+XHJcbiAgICAgICAgICAgICAgICB2LmhhcyhhY3Rpb24ub2JqZWN0aXZlVHlwZSlcclxuICAgICAgICAgICAgICAgICAgICA/IHYuZGVsZXRlKGFjdGlvbi5vYmplY3RpdmVUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgIDogdi5hZGQoYWN0aW9uLm9iamVjdGl2ZVR5cGUpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEU6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpsb2dGaWx0ZXJzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAnZXZlbnRUeXBlcycsXHJcbiAgICAgICAgICAgICAgICB2ID0+XHJcbiAgICAgICAgICAgICAgICB2LmhhcyhhY3Rpb24uZXZlbnRUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgID8gdi5kZWxldGUoYWN0aW9uLmV2ZW50VHlwZSlcclxuICAgICAgICAgICAgICAgICAgICA6IHYuYWRkKGFjdGlvbi5ldmVudFR5cGUpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvZ0ZpbHRlcnM7XHJcbiIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQ0xFQVJfTUFUQ0hERVRBSUxTLFxyXG4gICAgUkVDRUlWRV9NQVRDSERFVEFJTFMsXHJcbiAgICBSRUNFSVZFX01BVENIREVUQUlMU19TVUNDRVNTLFxyXG4gICAgUkVDRUlWRV9NQVRDSERFVEFJTFNfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgcmdiTnVtID0gSW1tdXRhYmxlLk1hcCh7IHJlZDogMCwgYmx1ZTogMCwgZ3JlZW46IDAgfSk7XHJcbmV4cG9ydCBjb25zdCBob2xkID0gSW1tdXRhYmxlLk1hcCh7IGNhc3RsZTogMCwga2VlcDogMCwgdG93ZXI6IDAsIGNhbXA6IDAgfSk7XHJcbmV4cG9ydCBjb25zdCByZ2JIb2xkID0gSW1tdXRhYmxlLk1hcCh7IHJlZDogaG9sZCwgYmx1ZTogaG9sZCwgZ3JlZW46IGhvbGQgfSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHN0YXRzRGVmYXVsdCA9IEltbXV0YWJsZS5mcm9tSlMoe1xyXG4gICAgZGVhdGhzOiByZ2JOdW0sXHJcbiAgICBraWxsczogcmdiTnVtLFxyXG4gICAgaG9sZGluZ3M6IHJnYkhvbGQsXHJcbiAgICBzY29yZXM6IHJnYk51bSxcclxuICAgIHRpY2tzOiByZ2JOdW0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcERlZmF1bHQgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGlkOiBudWxsLFxyXG4gICAgbGFzdG1vZDogbnVsbCxcclxuICAgIGd1aWxkczogSW1tdXRhYmxlLk9yZGVyZWRTZXQoKSxcclxuICAgIG9iamVjdGl2ZXM6IEltbXV0YWJsZS5PcmRlcmVkU2V0KCksXHJcbiAgICBzdGF0czogc3RhdHNEZWZhdWx0LFxyXG4gICAgdHlwZTogbnVsbCxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFwc0RlZmF1bHQgPSBJbW11dGFibGUuTGlzdChbXHJcbiAgICBtYXBEZWZhdWx0LFxyXG4gICAgbWFwRGVmYXVsdCxcclxuICAgIG1hcERlZmF1bHQsXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRpbWVzRGVmYXVsdCA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgbGFzdG1vZDogbnVsbCxcclxuICAgIGVuZFRpbWU6IG51bGwsXHJcbiAgICBzdGFydFRpbWU6IG51bGwsXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGlkOiBudWxsLFxyXG4gICAgZ3VpbGRzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgbWFwczogbWFwc0RlZmF1bHQsXHJcbiAgICBvYmplY3RpdmVzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgcmVnaW9uOiBudWxsLFxyXG4gICAgdGltZXM6IHRpbWVzRGVmYXVsdCxcclxuICAgIHN0YXRzOiBzdGF0c0RlZmF1bHQsXHJcbiAgICB3b3JsZHM6IHJnYk51bSxcclxuICAgIGxhc3RVcGRhdGU6IERhdGUubm93KCksXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG1hdGNoRGV0YWlscyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hEZXRhaWxzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hERVRBSUxTOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hEZXRhaWxzJywgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLndpdGhNdXRhdGlvbnMoXHJcbiAgICAgICAgICAgICAgICB0bXBTdGF0ZSA9PlxyXG4gICAgICAgICAgICAgICAgdG1wU3RhdGVcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdsYXN0VXBkYXRlJywgRGF0ZS5ub3coKSlcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdpZCcsIGFjdGlvbi5pZClcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdndWlsZElkcycsIGFjdGlvbi5ndWlsZElkcylcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdtYXBzJywgYWN0aW9uLm1hcHMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldCgnb2JqZWN0aXZlSWRzJywgYWN0aW9uLm9iamVjdGl2ZUlkcylcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdyZWdpb24nLCBhY3Rpb24ucmVnaW9uKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ3N0YXRzJywgYWN0aW9uLnN0YXRzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ3RpbWVzJywgYWN0aW9uLnRpbWVzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ3dvcmxkcycsIGFjdGlvbi53b3JsZHMpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgQ0xFQVJfTUFUQ0hERVRBSUxTOlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFN0YXRlO1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX1NVQ0NFU1M6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdsYXN0VXBkYXRlJywgRGF0ZS5ub3coKSlcclxuICAgICAgICAgICAgICAgIC5kZWxldGUoJ2Vycm9yJyk7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSERFVEFJTFNfRkFJTEVEOlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hEZXRhaWxzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgLnNldCgnbGFzdFVwZGF0ZScsIERhdGUubm93KCkpXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdlcnJvcicsIGFjdGlvbi5lcnIubWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1hdGNoRGV0YWlsczsiLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIFJFQ0VJVkVfTUFUQ0hFUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hFU19TVUNDRVNTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGRhdGE6IEltbXV0YWJsZS5NYXAoe30pLFxyXG4gICAgaWRzOiBJbW11dGFibGUuTGlzdChbXSksXHJcbiAgICBsYXN0VXBkYXRlZDogMCxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbWF0Y2hlcyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgLnNldCgnZGF0YScsIGFjdGlvbi5kYXRhKVxyXG4gICAgICAgICAgICAgICAgLnNldCgnbGFzdFVwZGF0ZWQnLCBhY3Rpb24ubGFzdFVwZGF0ZWQpO1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hFU19TVUNDRVNTOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuaGFzKCdlcnJvcicpXHJcbiAgICAgICAgICAgICAgICA/IHN0YXRlLmRlbGV0ZSgnZXJyb3InKVxyXG4gICAgICAgICAgICAgICAgOiBzdGF0ZTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIRVNfRkFJTEVEOlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuc2V0KCdlcnJvcicsIGFjdGlvbi5lcnIubWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1hdGNoZXM7IiwiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IHsgU0VUX05PVyB9IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuY29uc3Qgcm91dGUgPSAoc3RhdGUgPSBtb21lbnQoKSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfTk9XOlxyXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LnVuaXgobW9tZW50KCkudW5peCgpKTsgLy8gcm91bmRzIHRvIHNlY29uZFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gbW9tZW50KCk7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlO1xyXG4iLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgT0JKRUNUSVZFU19SRVNFVCxcclxuICAgIE9CSkVDVElWRVNfVVBEQVRFLFxyXG4gICAgT0JKRUNUSVZFX1VQREFURSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKCk7XHJcblxyXG5cclxuY29uc3Qgb2JqZWN0aXZlcyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6b2JqZWN0aXZlcycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBPQkpFQ1RJVkVTX1JFU0VUOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6b2JqZWN0aXZlcycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFN0YXRlO1xyXG5cclxuICAgICAgICBjYXNlIE9CSkVDVElWRV9VUERBVEU6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpvYmplY3RpdmVzJywgYWN0aW9uLnR5cGUsIGFjdGlvbi5vYmplY3RpdmUuZ2V0KCdpZCcpLCBhY3Rpb24ub2JqZWN0aXZlLnRvSlMoKSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuc2V0KFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uLm9iamVjdGl2ZS5nZXQoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ub2JqZWN0aXZlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgT0JKRUNUSVZFU19VUERBVEU6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpvYmplY3RpdmVzJywgYWN0aW9uLnR5cGUsIGFjdGlvbi5vYmplY3RpdmVzLnRvSlMoKSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLm9iamVjdGl2ZXM7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9iamVjdGl2ZXM7IiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfUk9VVEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICBwYXRoOiAnLycsXHJcbiAgICBwYXJhbXM6IHt9LFxyXG59O1xyXG5cclxuY29uc3Qgcm91dGUgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX1JPVVRFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IGFjdGlvbi5wYXJhbXMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlO1xyXG4iLCJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBRERfVElNRU9VVCxcclxuICAgIFJFTU9WRV9USU1FT1VULFxyXG4gICAgLy8gUkVNT1ZFX0FMTF9USU1FT1VUUyxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5jb25zdCB0aW1lb3V0cyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEFERF9USU1FT1VUOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6dGltZW91dHMnLCBBRERfVElNRU9VVCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIFthY3Rpb24ubmFtZV06IGFjdGlvbi5yZWYsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGNhc2UgUkVNT1ZFX1RJTUVPVVQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIFJFTU9WRV9USU1FT1VULCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIF8ub21pdChzdGF0ZSwgYWN0aW9uLm5hbWUpO1xyXG5cclxuICAgICAgICAvLyBjYXNlIFJFTU9WRV9BTExfVElNRU9VVFM6XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIFJFTU9WRV9BTExfVElNRU9VVFMsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgIC8vICAgICByZXR1cm4ge307XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRpbWVvdXRzOyIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1dPUkxELFxyXG4gICAgQ0xFQVJfV09STEQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcbmltcG9ydCB7IGdldFdvcmxkRnJvbVNsdWcgfSBmcm9tICdsaWIvd29ybGRzJztcclxuXHJcblxyXG5jb25zdCB3b3JsZCA9IChzdGF0ZSA9IG51bGwsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX1dPUkxEOlxyXG4gICAgICAgICAgICByZXR1cm4gZ2V0V29ybGRGcm9tU2x1ZyhhY3Rpb24ubGFuZ1NsdWcsIGFjdGlvbi53b3JsZFNsdWcpO1xyXG5cclxuICAgICAgICBjYXNlIENMRUFSX1dPUkxEOlxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdvcmxkOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcIjEwOTktOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhbW0ncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIEhhbW1cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhbW1zIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBIYW1tXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDg2NCwgOTU1OS40OV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxlc2gncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIExlc2hcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxlc2hzIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBMZXNoXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNzkuOTUsIDEyMTE5LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJaYWtrJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBaYWtrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaYWtrcyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgWmFra1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0NDQ4LCAxMTQ3OS41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXVlciBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCYXVlci1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBCYXVlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3OTMuNywgMTEyNTguNF1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmFycmV0dCBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhcnJldHRcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJhcnJldHQtR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgQmFycmV0dFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQ1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjA5LjcxLCAxMzgxOC40XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHZWUgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBHZWVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdlZS1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBHZWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM3Ny43LCAxMzE3OC40XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJNY0xhaW4ncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIE1jTGFpblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTWNMYWlucyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIE1jTGFpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTcxMi44LCAxMTI2My41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXRyaWNrJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBQYXRyaWNrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYXRyaWNrcyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIFBhdHJpY2tcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjEyOC44LCAxMzgyMy41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYWJpYidzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgSGFiaWJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhYmlicyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGQnSGFiaWJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzI5Ni44LCAxMzE4My41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPJ2RlbCBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBPJ2RlbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTydkZWwtQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBPJ2RlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4MzIuNCwgOTU5NC42M11cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiWSdsYW4gQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgWSdsYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlknbGFuLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgWSdsYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNDguNCwgMTIxNTQuNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiS2F5J2xpIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIEtheSdsaVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS2F5J2xpLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgS2F5J2xpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDE2LjQsIDExNTE0LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkV0ZXJuYWwgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgRXRlcm5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFd2lnZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgw6l0ZXJuZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExODAyLjcsIDk2NjQuNzVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlYXRobGVzcyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbm1vcnRhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVG9kbG9zZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1tb3J0ZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIxOC43MiwgMTIyMjQuN11cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVW5keWluZyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbXBlcmVjZWRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuc3RlcmJsaWNoZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1ww6lyaXNzYWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM4Ni43LCAxMTU4NC43XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDcmFua3NoYWZ0IERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgUGFsYW5jYW1hbmlqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkt1cmJlbHdlbGxlbi1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBWaWxlYnJlcXVpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY0LjMsIDExNjA5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwYXJrcGx1ZyBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIEJ1asOtYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlrDvG5kZnVua2VuLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IEJvdWdpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzY4MC4zMiwgMTQxNjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmx5d2hlZWwgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBWb2xhbnRlc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2Nod3VuZ3JhZC1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBFbmdyZW5hZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzMixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQ4NDguMywgMTM1MjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmxpc3RlcmluZyBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIEFjaGljaGFycmFudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJyZW5uZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGVtYnJhc8OpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTg1NC41OCwgMTA1NzguNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2NvcmNoaW5nIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gQWJyYXNhZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZXJzZW5nZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGN1aXNhbnRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNzAuNTgsIDEzMTM4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRvcnJpZCBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIFNvZm9jYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2zDvGhlbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgdG9ycmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDM4LjYsIDEyNDk4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzExLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEyMDIyLjUsIDExNzg5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzEwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODQzOC40OSwgMTQzNDkuOV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1NjA2LjUsIDEzNzA5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk2NDEuNywgMTE3NDkuNl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MDU3LjcsIDE0MzA5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzIyNS43LCAxMzY2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb3kncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgUm95XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3lzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgUm95XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTk1NC42LCAxMDA2OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJOb3Jmb2xrJ3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIE5vcmZvbGtcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5vcmZvbGtzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgTm9yZm9sa1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MzcwLjYsIDEyNjI4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9saXZpZXIncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgT2xpdmllclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2xpdmllcnMgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkJ09saXZpZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTUzOC42LCAxMTk4OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXJjaGVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBBYnJhc2Fkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVyZMO2cnJ0ZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6l2YXN0w6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDI1NSwgMTE1NzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldpdGhlcmVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBEZXNvbGFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2Vsa2VyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgcmF2YWfDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjY3MS4wNSwgMTQxMzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhcnJlbiBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gQWJhbmRvbmFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5ZkZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6lsYWJyw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM4MzksIDEzNDk2XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9pYyBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVzdG9pY2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0b2lzY2hlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgc3Rvw69xdWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwODEyLjMsIDEwMTAyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkltcGFzc2l2ZSBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEltcGVydHVyYmFibGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuYmVlaW5kcnVja3RlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgaW1wYXNzaWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjI4LjMyLCAxMjY2Mi45XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYXJkZW5lZCBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVuZHVyZWNpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0YWhsaGFydGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBkdXJjaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0Mzk2LjMsIDEyMDIyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9zcHJleSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgw4FndWlsYSBQZXNjYWRvcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZpc2NoYWRsZXItUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgYmFsYnV6YXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc4OCwgMTA2NjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFycmllcidzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWd1aWx1Y2hvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWloZW4tUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgY2lyY2HDqHRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMDQsIDEzMjIwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNocmlrZSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWxjYXVkw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXw7xyZ2VyLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGRlIGxhIHBpZS1ncmnDqGNoZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1MzcyLCAxMjU4MC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb2V0dGlnZXIncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBCb2V0dGlnZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJvZXR0aWdlcnMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEJvZXR0aWdlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTU4NS45LCAxMDAzNy4xXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIdWdoZSdzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEh1Z2hlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIdWdoZXMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEh1Z2hlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYwMDEuOSwgMTI1OTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmVyZHJvdydzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEJlcmRyb3dcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJlcmRyb3dzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBCZXJkcm93XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMxNjkuOSwgMTE5NTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHVzdHdoaXNwZXIgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgTXVybXVsbG8gZGUgUG9sdm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVzIFN0YXViZmzDvHN0ZXJuc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgU291ZmZsZS1wb3Vzc2nDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDc3My4zLCAxMTY1Mi41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTbWFzaGVkaG9wZSBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIFRyYWdhZXNwZXJhbnphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlciBaZXJzY2hsYWdlbmVuIEhvZmZudW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBSw6p2ZS1icmlzw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzOCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzE4OS4yOSwgMTQyMTIuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFzdGdhc3AgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgw5psdGltbyBTdXNwaXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlcyBMZXR6dGVuIFNjaG5hdWZlcnNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IERlcm5pZXItc291cGlyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQzNTcuMywgMTM1NzIuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNTkwLjIsIDkxNjkuMTldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcwMDYuMTksIDExNzI5LjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQxNzQuMiwgMTEwODkuMl1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmFpdGhsZWFwXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhdXQgZGUgbGEgRm9pXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NDE3LjM5LCAxNDc5MC43XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhlbGRlbmhhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC02MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTYyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBdWZzdGllZ3NidWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRlciBHZWlzdGhvbG1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxlIEhlYXVtZSBzcGlyaXR1ZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmxvb2tcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk1pcmFkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0IHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCZWx2w6lkw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDY5OC40LCAxMzc2MV1cclxuICAgIH0sXHJcbiAgICBcIjM4LTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxhbmdvci1TY2hsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTQ2NS4zLCAxNTU2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgYmFqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRpZWZsYW5kIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCYXNzZXMgdGVycmVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0OCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4NDAuMjUsIDE0OTgzLjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5Mi43LCAxMzQxMC44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlZlcnQtYnJ1ecOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTY0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5OTYuNCwgMTU1NDUuOF1cclxuICAgIH0sXHJcbiAgICBcIjk2LTI3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTAzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTAzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvb2RoYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2FsZC1GcmVpc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvaXNyZWZ1Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTQxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNoYWRhcmFuLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgU2hhZGFyYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTMyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFdGhlcm9uLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTUtNTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcmFzIGR1IFRpdGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS03NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC05XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FzdGxlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNjI3LjMsIDE0NTAxLjNdXHJcbiAgICB9LFxyXG4gICAgXCI5NS01N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNyYWd0b3BcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyb2ZmZ2lwZmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTb21tZXQgZGUgSGF1dGNyYWdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjAxLjYsIDEzNzE4LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTMzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NS00MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZGxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgcm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMjFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjA3LjEsIDE0NTk1XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGb2doYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5lYmVsLUZyZWlzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHdhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG5zZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyB2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVsb2thLUhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEwMTcuNCwgMTM0MTQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwtQnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWVicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXVzdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcnV5YXp1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyMTkuNSwgMTUxMDcuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzU3LjA2LCAxNTQ2Ny44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMzhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMb25ndmlld1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlaXRzaWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTG9uZ3VldnVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC02XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTcGVsZGFuLUthaGxzY2hsYWdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzM5LjgxLCAxMzU4Ni45XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEYXMgR290dGVzc2Nod2VydFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC02NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmFsbGV5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJWYWxsZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGFsIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBWYWxsw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY4LjksIDE1MDg3LjddXHJcbiAgICB9LFxyXG4gICAgXCI5NS00N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN1bm55aGlsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNvbm5lbmjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNjdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC01M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGV2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG50YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXaWxkYmFjaC1TdHJlY2tlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaXN0ZSBkdSBydWlzc2VhdSBzYXV2YWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5OTU4LjIzLCAxNDYwNS43XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWRicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemFycm9qYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTExXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTExXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTcxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNzFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJRdWVudGluLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTUxLjgsIDE1MTIxLjJdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3NTAuMiwgMTQ4NTkuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIEJsZXV2YWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk2NSwgMTM5NTFdXHJcbiAgICB9LFxyXG4gICAgXCI5NS03NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTczXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXN0cmFsaG9sbVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGVhdW1lIGFzdHJhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTY2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC00XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5OC45LCAxNTUyMC4yXVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTaWVnZXItSGFsbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhdmlsbG9uIGR1IFZhaW5xdWV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTI4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmTDpG1tZXJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlcGFpcmUgZGUgbCdhdWJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni01OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTU5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcnJvam9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTM2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZWxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29henVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgYmxldVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1d2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC04XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTY4MC45LCAxNDM1My42XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNzBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni03MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTYwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0YXJncm92ZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3Rlcm5oYWluXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb3NxdWV0IMOpdG9pbMOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTQwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlbHN3YW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTYxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBiYWphcyBkZSBBZ3VhdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xud2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtMjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXNrYWxpb24tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTc0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FycmnDqHJlIGR1IHZvbGV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NjEyLjU0LCAxNDQ2Mi44XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVzbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhdHJpbW9uaW8gZGVsIENhbXBlw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJDaGFtcGlvbnMgTGFuZHNpdHpcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZpZWYgZHUgQ2hhbXBpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyNDMuMywgMTM5NzQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTcyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni01OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHb2RzbG9yZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHb3R0ZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYXZvaXIgZGl2aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIld1cm0gVHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUw7puZWwgZGUgbGEgU2llcnBlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXdXJtdHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUdW5uZWwgZGUgZ3VpdnJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2NzUwLjkyLCAxMDIxMS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvMDg3NDkxQ0RENTZGN0ZCOTk4QzMzMjM2MEQzMkZEMjZBOEIyQTk5RC83MzA0MjgucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBaXJwb3J0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZXJvcHVlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGbHVnaGFmZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkHDqXJvcG9ydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzA1NC4xNiwgMTA0MjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9BQ0NDQjFCRDYxNzU5OEMwRUE5Qzc1NkVBREU1M0RGMzZDMjU3OEVDLzczMDQyNy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRodW5kZXIgSG9sbG93IFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgSG9uZG9uYWRhIGRlbCBUcnVlbm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRvbm5lcnNlbmtlbnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBUb25uZWNyZXZhc3NlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODI4Mi43NywgMTA0MjUuOV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRm9yZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZvcmphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2htaWVkZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9yZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMjMuNjQsIDEwNjkyLjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EMUFCNTQxRkMzQkUxMkFDNUJCQjAyMDIxMkJFQkUzRjVDMEM0MzE1LzczMDQxNS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRmFubyBHaWdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDnGJlcnd1Y2hlcnRlciBHb3R0ZXNoYXVzLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBUZW1wbGUgc3VyZGltZW5zaW9ubsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUxMy44MywgOTA1OS45Nl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hyaW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYW50dWFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJlaW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhbmN0dWFpcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg2MTQuODksIDEwMjQ2LjRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9CNTcwOTk0MUIwMzUyRkQ0Q0EzQjdBRkRBNDI4NzNEOEVGREIxNUFELzczMDQxNC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF1dGVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjQwLjY2LCA5MjUzLjldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EQzAxRUM0MUQ4ODA5QjU5Qjg1QkVFREM0NUU5NTU2RDczMEJEMjFBLzczMDQxMy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvcmtzaG9wXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUYWxsZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlcmtzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXRlbGllclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgzNy42LCAxMDg0NS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQjM0QzJFM0QwRjM0RkQwM0Y0NEJCNUVENEUxOERDREQwMDU5QTVDNC83MzA0MjkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmlkIEZvcnRyZXNzIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ3JlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBsYSBGb3J0ZXJlc3NlIGFyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgyMy44MywgMTA0NzkuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgQWd1amEgZGUgTWlyYXBpZWRyYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZWluYmxpY2stWmFja2Vuc3RhYnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNDkuMjEsIDk3NjMuODddLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJlbGwgVG93ZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbmFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsb2NrZW50dXJtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDbG9jaGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MTgwLjY4LCAxMDMyNS4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDQxODA3NzRERDAzQTRCQzcyNTJCOTUyNjgwRTQ1MUYxNjY3OUE3Mi83MzA0MTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPYnNlcnZhdG9yeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiT2JzZXJ2YXRvcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPYnNlcnZhdG9yaXVtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJPYnNlcnZhdG9pcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc5NTMuNjcsIDkwNjIuNzldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8wMTVDRjE2Qzc4REZEQUQ3NDJFMUE1NjEzRkI3NEI2NDYzQkY0QTcwLzczMDQxMS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGYW5vIEdpZ2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOcYmVyd3VjaGVydGVzIEdvdHRlc2hhdXNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlRlbXBsZSBzdXJkaW1lbnNpb25uw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc2MDYuNywgODg4Mi4xNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJpZCBGb3J0cmVzc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9ydGVyZXNzZSBhcmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjQ0Mi4xNywgMTA4ODEuOF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQZXJjaGEgZGUgVHl0b25lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUeXRvbmVud2FydGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBlcmNob2lyIGRlIFR5dG9uZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc4ODQuODEsIDk4MDkuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGh1bmRlciBIb2xsb3dcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZWwgVHJ1ZW5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEb25uZXJzZW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVG9ubmVjcmV2YXNzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODUwNi43NSwgMTA4MjQuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgUGVyY2hhIGRlIFR5dG9uZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHl0b25lbndhcnRlLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQZXJjaG9pciBkZSBUeXRvbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3ODUyLjg5LCA5ODU1LjU2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbmZlcm5vJ3MgTmVlZGxlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWlndWlsbGUgaW5mZXJuYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUwNC44NCwgMTA1OTguNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZSBNaXJhcGllZHJhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RlaW5ibGljay1aYWNrZW5zdGFiXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcxNjQuNDYsIDk4MDUuMTVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkluZmVybm8ncyBOZWVkbGUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbC1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgbCdBaWd1aWxsZSBpbmZlcm5hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NixcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTgxLjkxLCAxMDMxNi40XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdGF0dWFyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXN0YXR1YXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RhdHVlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTdGF0dWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1NTMuMTIsIDkzNjAuMTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS80QzAxMTNCNkRGMkU0RTJDQkI5MzI0NEFENTBEQTQ5NDU2RDUwMTRFLzczMDQxMi5wbmdcIlxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJhdGNoQWN0aW9ucyA9IGJhdGNoQWN0aW9ucztcbmV4cG9ydHMuZW5hYmxlQmF0Y2hpbmcgPSBlbmFibGVCYXRjaGluZztcbnZhciBCQVRDSCA9ICdCQVRDSElOR19SRURVQ0VSLkJBVENIJztcblxuZXhwb3J0cy5CQVRDSCA9IEJBVENIO1xuXG5mdW5jdGlvbiBiYXRjaEFjdGlvbnMoYWN0aW9ucykge1xuXHRyZXR1cm4geyB0eXBlOiBCQVRDSCwgcGF5bG9hZDogYWN0aW9ucyB9O1xufVxuXG5mdW5jdGlvbiBlbmFibGVCYXRjaGluZyhyZWR1Y2UpIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGJhdGNoaW5nUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG5cdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXHRcdFx0Y2FzZSBCQVRDSDpcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi5wYXlsb2FkLnJlZHVjZShiYXRjaGluZ1JlZHVjZXIsIHN0YXRlKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiByZWR1Y2Uoc3RhdGUsIGFjdGlvbik7XG5cdFx0fVxuXHR9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHRodW5rTWlkZGxld2FyZTtcbmZ1bmN0aW9uIHRodW5rTWlkZGxld2FyZShfcmVmKSB7XG4gIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2g7XG4gIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICB9O1xuICB9O1xufSJdfQ==
