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

},{"./guilds":2,"./matchDetails":5,"./matches":6,"constants/actionTypes":45,"immutable":"immutable","lib/api":46,"redux-batched-actions":66}],2:[function(require,module,exports){
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

},{"actions/lang":3,"actions/objectives":8,"actions/route":9,"actions/world":11,"components/Layout/Container":13,"components/Overview":23,"components/Tracker":36,"components/util/Perf":44,"domready":"domready","page":"page","react":"react","react-addons-perf":"react-addons-perf","react-dom":"react-dom","react-redux":"react-redux","reducers":53,"redux":"redux","redux-batched-actions":66,"redux-thunk":67}],13:[function(require,module,exports){
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

},{"classnames":"classnames","lib/static":49,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],16:[function(require,module,exports){
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

},{"./LangLink":15,"lib/static":49,"react":"react"}],17:[function(require,module,exports){
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

},{"./MatchWorld":20,"immutable":"immutable","lib/static":49,"lodash":"lodash","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],19:[function(require,module,exports){
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

},{"components/common/Icons/Pie":37,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],20:[function(require,module,exports){
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

},{"./MatchPie":19,"lib/static":49,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],21:[function(require,module,exports){
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

},{"immutable":"immutable","lib/static":49,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],23:[function(require,module,exports){
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

},{"components/common/icons/Emblem":40,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],25:[function(require,module,exports){
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

},{"./Entry":27,"lib/reduxHelpers":48,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],27:[function(require,module,exports){
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

},{"components/common/icons/Emblem":40,"components/common/icons/Objective":41,"components/common/objectives/Arrow":42,"components/common/objectives/Name":43,"immutable":"immutable","lib/reduxHelpers":48,"lib/static":49,"moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],28:[function(require,module,exports){
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

},{"actions/logFilters":4,"classnames":"classnames","components/common/icons/Objective":41,"immutable":"immutable","lib/reduxHelpers":48,"lib/static":49,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('lib/redux');

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

var mapStateToProps = (0, _redux.createImmutableSelector)(mapsSelector, objectivesSelector, function (maps, objectives) {
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

},{"./Entries":26,"./Tabs":28,"immutable":"immutable","lib/redux":47,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],30:[function(require,module,exports){
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

},{"./Objective":31,"classnames":"classnames","lib/static":49,"lodash":"lodash","react":"react"}],31:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Arrow":39,"components/common/icons/Emblem":40,"components/common/icons/Objective":41,"lib/static":49,"lodash":"lodash","moment":"moment","react":"react"}],32:[function(require,module,exports){
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

},{"./MatchMap":30,"lib/static":49,"lodash":"lodash","react":"react"}],33:[function(require,module,exports){
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

},{"components/common/Icons/Sprite":38,"react":"react"}],34:[function(require,module,exports){
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

},{"./Holdings":33,"immutable":"immutable","lib/static":49,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],35:[function(require,module,exports){
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

},{"./Guilds":25,"./Log":29,"./Maps":32,"./Scoreboard":35,"actions/api":1,"actions/now":7,"actions/timeouts":10,"lib/reduxHelpers":48,"lodash":"lodash","moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],37:[function(require,module,exports){
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

},{"react":"react"}],38:[function(require,module,exports){
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

},{"react":"react"}],39:[function(require,module,exports){
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

},{"react":"react"}],40:[function(require,module,exports){
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

},{"react":"react"}],41:[function(require,module,exports){
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

},{"components/common/icons/Arrow":39,"lib/static":49,"react":"react"}],43:[function(require,module,exports){
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

},{"lib/static":49,"react":"react"}],44:[function(require,module,exports){
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
    const mapStateToProps = createImmutableSelector(
        ..selectors,
        (...keys) => ({...keys})
    );

    const mapStateToProps = mapSelectorsToProps({
        key: selector,
    });
*/

var mapSelectorsToProps = exports.mapSelectorsToProps = function mapSelectorsToProps(selectorsMap) {
    var keys = Object.keys(selectorsMap);
    var selectors = keys.map(function (k) {
        return selectorsMap[k];
    });

    return function () {
        return _reselect.createSelector.apply(undefined, _toConsumableArray(selectors).concat([function () {
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
    var keys = Object.keys(selectorsMap);
    var selectors = keys.map(function (k) {
        return selectorsMap[k];
    });

    return function () {
        return createImmutableSelector.apply(undefined, _toConsumableArray(selectors).concat([function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return keys.reduce(function (result, val, i) {
                return _extends({}, result, _defineProperty({}, val, args[i]));
            }, {});
        }]));
    };
};

},{"immutable":"immutable","reselect":"reselect"}],48:[function(require,module,exports){
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

},{"immutable":"immutable","reselect":"reselect"}],49:[function(require,module,exports){
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

},{"gw2w2w-static/data/langs":63,"gw2w2w-static/data/objectives_v2_merged":64,"gw2w2w-static/data/world_names":65,"lodash":"lodash"}],50:[function(require,module,exports){
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

},{"lib/static":49}],51:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],52:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],53:[function(require,module,exports){
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

},{"./api":51,"./guilds":52,"./lang":54,"./logFilters":55,"./matchDetails":56,"./matches":57,"./now":58,"./objectives":59,"./route":60,"./timeouts":61,"./world":62,"redux":"redux"}],54:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable","lib/static":49}],55:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],56:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],57:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],58:[function(require,module,exports){
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

},{"constants/actionTypes":45,"moment":"moment"}],59:[function(require,module,exports){
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

},{"constants/actionTypes":45,"immutable":"immutable"}],60:[function(require,module,exports){
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

},{"constants/actionTypes":45}],61:[function(require,module,exports){
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

},{"constants/actionTypes":45,"lodash":"lodash"}],62:[function(require,module,exports){
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

},{"constants/actionTypes":45,"lib/worlds":50}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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
},{}],67:[function(require,module,exports){
'use strict';

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

module.exports = thunkMiddleware;
},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGFwaS5qcyIsImFwcFxcYWN0aW9uc1xcZ3VpbGRzLmpzIiwiYXBwXFxhY3Rpb25zXFxsYW5nLmpzIiwiYXBwXFxhY3Rpb25zXFxsb2dGaWx0ZXJzLmpzIiwiYXBwXFxhY3Rpb25zXFxtYXRjaERldGFpbHMuanMiLCJhcHBcXGFjdGlvbnNcXG1hdGNoZXMuanMiLCJhcHBcXGFjdGlvbnNcXG5vdy5qcyIsImFwcFxcYWN0aW9uc1xcb2JqZWN0aXZlcy5qcyIsImFwcFxcYWN0aW9uc1xccm91dGUuanMiLCJhcHBcXGFjdGlvbnNcXHRpbWVvdXRzLmpzIiwiYXBwXFxhY3Rpb25zXFx3b3JsZC5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXENvbnRhaW5lci5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxGb290ZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTGFuZ3NcXExhbmdMaW5rLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXExhbmdzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxOYXZiYXJIZWFkZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxNYXRjaC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXE1hdGNoUGllLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2hXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcV29ybGRzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXEd1aWxkLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXEVudHJpZXMuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcRW50cnkuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcVGFicy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcTWF0Y2hNYXAuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXE9iamVjdGl2ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXEhvbGRpbmdzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXEljb25zXFxQaWUuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcSWNvbnNcXFNwcml0ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcQXJyb3cuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXEVtYmxlbS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcT2JqZWN0aXZlLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXG9iamVjdGl2ZXNcXEFycm93LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXG9iamVjdGl2ZXNcXE5hbWUuanMiLCJhcHBcXGNvbXBvbmVudHNcXHV0aWxcXFBlcmYuanMiLCJhcHBcXGNvbnN0YW50c1xcYWN0aW9uVHlwZXMuanMiLCJhcHBcXGxpYlxcYXBpLmpzIiwiYXBwXFxsaWJcXHJlZHV4LmpzIiwiYXBwXFxsaWJcXHJlZHV4SGVscGVycy5qcyIsImFwcFxcbGliXFxzdGF0aWNcXGluZGV4LmpzIiwiYXBwXFxsaWJcXHdvcmxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGFwaS5qcyIsImFwcFxccmVkdWNlcnNcXGd1aWxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGluZGV4LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbGFuZy5qcyIsImFwcFxccmVkdWNlcnNcXGxvZ0ZpbHRlcnMuanMiLCJhcHBcXHJlZHVjZXJzXFxtYXRjaERldGFpbHMuanMiLCJhcHBcXHJlZHVjZXJzXFxtYXRjaGVzLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbm93LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcb2JqZWN0aXZlcy5qcyIsImFwcFxccmVkdWNlcnNcXHJvdXRlLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcdGltZW91dHMuanMiLCJhcHBcXHJlZHVjZXJzXFx3b3JsZC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZXNfdjJfbWVyZ2VkLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC1iYXRjaGVkLWFjdGlvbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LXRodW5rL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3dDTyxJQUFNLG9DQUFjLFNBQWQsV0FBYyxPQUFvQjtRQUFqQiw2QkFBaUI7Ozs7QUFHM0MsV0FBTztBQUNILDJDQURHO0FBRUgsOEJBRkc7S0FBUCxDQUgyQztDQUFwQjs7QUFXcEIsSUFBTSwwQ0FBaUIsU0FBakIsY0FBaUIsUUFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHsgYmF0Y2hBY3Rpb25zIH0gZnJvbSAncmVkdXgtYmF0Y2hlZC1hY3Rpb25zJztcclxuXHJcbmltcG9ydCBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICBBUElfUkVRVUVTVF9TVUNDRVNTLFxyXG4gICAgQVBJX1JFUVVFU1RfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIHJlY2VpdmVNYXRjaGVzLFxyXG4gICAgcmVjZWl2ZU1hdGNoZXNGYWlsZWQsXHJcbiAgICByZWNlaXZlTWF0Y2hlc1N1Y2Nlc3MsXHJcbiAgICBnZXRNYXRjaGVzTGFzdG1vZCxcclxufSBmcm9tICcuL21hdGNoZXMnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBwcm9jZXNzTWF0Y2hEZXRhaWxzLFxyXG4gICAgLy8gcmVjZWl2ZU1hdGNoRGV0YWlscyxcclxuICAgIHJlY2VpdmVNYXRjaERldGFpbHNTdWNjZXNzLFxyXG4gICAgcmVjZWl2ZU1hdGNoRGV0YWlsc0ZhaWxlZCxcclxufSBmcm9tICcuL21hdGNoRGV0YWlscyc7XHJcblxyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBpbml0aWFsaXplR3VpbGQsXHJcbiAgICByZWNlaXZlR3VpbGQsXHJcbiAgICByZWNlaXZlR3VpbGRGYWlsZWQsXHJcbn0gZnJvbSAnLi9ndWlsZHMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3RPcGVuID0gKHsgcmVxdWVzdEtleSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXF1ZXN0TWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQVBJX1JFUVVFU1RfT1BFTixcclxuICAgICAgICByZXF1ZXN0S2V5LFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3RTdWNjZXNzID0gKHsgcmVxdWVzdEtleSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXF1ZXN0TWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQVBJX1JFUVVFU1RfU1VDQ0VTUyxcclxuICAgICAgICByZXF1ZXN0S2V5LFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3RGYWlsZWQgPSAoeyByZXF1ZXN0S2V5IH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlcXVlc3RNYXRjaGVzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBUElfUkVRVUVTVF9GQUlMRUQsXHJcbiAgICAgICAgcmVxdWVzdEtleSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaE1hdGNoZXMgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdEtleSA9ICdtYXRjaGVzJztcclxuXHJcbiAgICAgICAgZGlzcGF0Y2gocmVxdWVzdE9wZW4oeyByZXF1ZXN0S2V5IH0pKTtcclxuXHJcbiAgICAgICAgYXBpLmdldE1hdGNoZXMoe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjpzdWNjZXNzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChiYXRjaEFjdGlvbnMoW1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RTdWNjZXNzKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hlc1N1Y2Nlc3MoKSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hlcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IEltbXV0YWJsZS5mcm9tSlMoZGF0YSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVkOiBnZXRNYXRjaGVzTGFzdG1vZChkYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6ZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RmFpbGVkKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hlc0ZhaWxlZCh7IGVyciB9KSxcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6Y29tcGxldGUnKTtcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaE1hdGNoRGV0YWlscyA9ICh7IHdvcmxkIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlcycsIHdvcmxkKTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdEtleSA9IGBtYXRjaERldGFpbHNgO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChyZXF1ZXN0T3Blbih7IHJlcXVlc3RLZXkgfSkpO1xyXG5cclxuICAgICAgICBhcGkuZ2V0TWF0Y2hCeVdvcmxkSWQoe1xyXG4gICAgICAgICAgICB3b3JsZElkOiB3b3JsZC5pZCxcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6c3VjY2VzcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3VjY2Vzcyh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoRGV0YWlsc1N1Y2Nlc3MoKSxcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NNYXRjaERldGFpbHMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBJbW11dGFibGUuZnJvbUpTKGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjplcnJvcicsIGVycik7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChiYXRjaEFjdGlvbnMoW1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RGYWlsZWQoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYXRjaERldGFpbHNGYWlsZWQoeyBlcnIgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OmNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaEd1aWxkQnlJZCA9ICh7IGd1aWxkSWQgfSkgPT4ge1xyXG5cclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0S2V5ID0gYGd1aWxkLSR7IGd1aWxkSWQgfWA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoR3VpbGRCeUlkOicsIHJlcXVlc3RLZXkpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChiYXRjaEFjdGlvbnMoW1xyXG4gICAgICAgICAgICByZXF1ZXN0T3Blbih7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVHdWlsZCh7IGd1aWxkSWQgfSksXHJcbiAgICAgICAgXSkpO1xyXG5cclxuICAgICAgICBhcGkuZ2V0R3VpbGRCeUlkKHtcclxuICAgICAgICAgICAgZ3VpbGRJZCxcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoR3VpbGRCeUlkOjpzdWNjZXNzJywgcmVxdWVzdEtleSwgZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3VjY2Vzcyh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZUd1aWxkKHsgZ3VpbGRJZCwgZGF0YSB9KSxcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoR3VpbGRCeUlkOjplcnJvcicsIHJlcXVlc3RLZXksIGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RmFpbGVkKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlR3VpbGRGYWlsZWQoeyBndWlsZElkLCBlcnIgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDo6Y29tcGxldGUnKTtcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICB9KTs7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuIiwiLy8gaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBJTklUSUFMSVpFX0dVSUxELFxyXG4gICAgUkVDRUlWRV9HVUlMRCxcclxuICAgIFJFQ0VJVkVfR1VJTERfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplR3VpbGQgPSAoeyBndWlsZElkIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVHdWlsZCcsIGd1aWxkSWQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogSU5JVElBTElaRV9HVUlMRCxcclxuICAgICAgICBndWlsZElkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVHdWlsZCA9ICh7IGd1aWxkSWQsIGRhdGEgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZUd1aWxkJywgZ3VpbGRJZCwgZGF0YSk7XHJcbi8vXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfR1VJTEQsXHJcbiAgICAgICAgZ3VpbGRJZCxcclxuICAgICAgICBuYW1lOiBkYXRhLmd1aWxkX25hbWUsXHJcbiAgICAgICAgdGFnOiBkYXRhLnRhZyxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlR3VpbGRGYWlsZWQgPSAoeyBndWlsZElkLCBlcnIgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZUd1aWxkRmFpbGVkJywgZ3VpbGRJZCwgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfR1VJTERfRkFJTEVELFxyXG4gICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgZXJyLFxyXG4gICAgfTtcclxufTsiLCJpbXBvcnQgeyBTRVRfTEFORyB9IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldExhbmcgPSBzbHVnID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldExhbmcnLCBzbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFNFVF9MQU5HLFxyXG4gICAgICAgIHNsdWcsXHJcbiAgICB9O1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IHtcclxuICAgIExPR19GSUxURVJTX1RPR0dMRV9NQVAsXHJcbiAgICBMT0dfRklMVEVSU19UT0dHTEVfT0JKRUNUSVZFX1RZUEUsXHJcbiAgICBMT0dfRklMVEVSU19UT0dHTEVfRVZFTlRfVFlQRSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgdG9nZ2xlTWFwID0gKHsgbWFwSWQgfSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBMT0dfRklMVEVSU19UT0dHTEVfTUFQLFxyXG4gICAgICAgIG1hcElkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZU9iamVjdGl2ZVR5cGUgPSAoeyBvYmplY3RpdmVUeXBlIH0pID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogTE9HX0ZJTFRFUlNfVE9HR0xFX09CSkVDVElWRV9UWVBFLFxyXG4gICAgICAgIG9iamVjdGl2ZVR5cGUsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgdG9nZ2xlRXZlbnRUeXBlID0gKHsgZXZlbnRUeXBlIH0pID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUsXHJcbiAgICAgICAgZXZlbnRUeXBlLFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG4vLyBpbXBvcnQgeyBiYXRjaEFjdGlvbnMgfSBmcm9tICdyZWR1eC1iYXRjaGVkLWFjdGlvbnMnO1xyXG5cclxuXHJcbi8vIGltcG9ydCB7IHdvcmxkcyBhcyBTVEFUSUNfV09STERTIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIENMRUFSX01BVENIREVUQUlMUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTLFxyXG4gICAgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuLy8gaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICdhY3Rpb25zL21hdGNoRGV0YWlscyc7XHJcbmltcG9ydCB7IGZldGNoR3VpbGRCeUlkIH0gZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQge1xyXG4gICAgLy8gdXBkYXRlT2JqZWN0aXZlLFxyXG4gICAgdXBkYXRlT2JqZWN0aXZlcyxcclxufSBmcm9tICdhY3Rpb25zL29iamVjdGl2ZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJNYXRjaERldGFpbHMgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhck1hdGNoRGV0YWlscycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQ0xFQVJfTUFUQ0hERVRBSUxTLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHByb2Nlc3NNYXRjaERldGFpbHMgPSAoeyBkYXRhIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnByb2Nlc3NNYXRjaERldGFpbHMnKTtcclxuXHJcbiAgICBjb25zdCBpZCA9IGRhdGEuZ2V0KCdpZCcpO1xyXG4gICAgY29uc3QgcmVnaW9uID0gZGF0YS5nZXQoJ3JlZ2lvbicpO1xyXG4gICAgY29uc3Qgd29ybGRzID0gZGF0YS5nZXQoJ3dvcmxkcycpO1xyXG5cclxuICAgIGNvbnN0IG1hcHMgPSBnZXRNYXBzKGRhdGEpO1xyXG4gICAgY29uc3Qgc3RhdHMgPSBnZXRTdGF0cyhkYXRhKTtcclxuICAgIGNvbnN0IHRpbWVzID0gZ2V0VGltZXMoZGF0YSk7XHJcbiAgICAvLyBjb25zdCB3b3JsZHMgPSBnZXRXb3JsZHMoZGF0YSk7XHJcblxyXG4gICAgY29uc3QgZ3VpbGRJZHMgPSBnZXRHdWlsZElkcyhtYXBzKTtcclxuICAgIGNvbnN0IG9iamVjdGl2ZUlkcyA9IGdldE9iamVjdGl2ZUlkcyhtYXBzKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ2lkJywgaWQpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdyZWdpb24nLCByZWdpb24pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdzdGF0cycsIHN0YXRzLnRvSlMoKSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ3RpbWVzJywgdGltZXMudG9KUygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnd29ybGRzJywgd29ybGRzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnbWFwcycsIG1hcHMudG9KUygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnZ3VpbGRJZHMnLCBndWlsZElkcy50b0pTKCkpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdvYmplY3RpdmVJZHMnLCBvYmplY3RpdmVJZHMudG9KUygpKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChyZWNlaXZlTWF0Y2hEZXRhaWxzKHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIHJlZ2lvbixcclxuXHJcbiAgICAgICAgICAgIGd1aWxkSWRzLFxyXG4gICAgICAgICAgICBtYXBzLFxyXG4gICAgICAgICAgICBvYmplY3RpdmVJZHMsXHJcbiAgICAgICAgICAgIHN0YXRzLFxyXG4gICAgICAgICAgICB0aW1lcyxcclxuICAgICAgICAgICAgd29ybGRzLFxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2hHdWlsZExvb2t1cHMoZGlzcGF0Y2gsIGdldFN0YXRlKCkuZ3VpbGRzLCBndWlsZElkcyk7XHJcbiAgICAgICAgZGlzcGF0Y2hPYmplY3RpdmVVcGRhdGVzKGRpc3BhdGNoLCBkYXRhLmdldCgnbWFwcycpKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcmV0dXJuIHtcclxuICAgIC8vICAgICB0eXBlOiBSRUNFSVZFX01BVENIREVUQUlMUyxcclxuXHJcbiAgICAvLyAgICAgaWQsXHJcbiAgICAvLyAgICAgcmVnaW9uLFxyXG5cclxuICAgIC8vICAgICBndWlsZElkcyxcclxuICAgIC8vICAgICBtYXBzLFxyXG4gICAgLy8gICAgIG9iamVjdGl2ZUlkcyxcclxuICAgIC8vICAgICBzdGF0cyxcclxuICAgIC8vICAgICB0aW1lcyxcclxuICAgIC8vICAgICB3b3JsZHMsXHJcbiAgICAvLyB9O1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoR3VpbGRMb29rdXBzKGRpc3BhdGNoLCBzdGF0ZUd1aWxkcywgZ3VpbGRJZHMpIHtcclxuICAgIGNvbnN0IGtub3duR3VpbGRzID0gc3RhdGVHdWlsZHMua2V5U2VxKCkudG9TZXQoKTtcclxuICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSBndWlsZElkcy5zdWJ0cmFjdChrbm93bkd1aWxkcyk7XHJcblxyXG5cclxuICAgIHVua25vd25HdWlsZHMuZm9yRWFjaChcclxuICAgICAgICAoZ3VpbGRJZCkgPT4gZGlzcGF0Y2goZmV0Y2hHdWlsZEJ5SWQoeyBndWlsZElkIH0pKVxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoT2JqZWN0aXZlVXBkYXRlcyhkaXNwYXRjaCwgbWFwcykge1xyXG4gICAgbGV0IG9iamVjdGl2ZXMgPSBJbW11dGFibGUuTWFwKCk7XHJcblxyXG5cclxuICAgIG1hcHMuZm9yRWFjaChcclxuICAgICAgICBtID0+IG0uZ2V0KCdvYmplY3RpdmVzJykuZm9yRWFjaChcclxuICAgICAgICAgICAgKG9iamVjdGl2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0aXZlcyA9IG9iamVjdGl2ZXMuc2V0SW4oXHJcbiAgICAgICAgICAgICAgICAgICAgW29iamVjdGl2ZS5nZXQoJ2lkJyldLFxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgICk7XHJcbiAgICAvLyBtYXBzLmZvckVhY2goXHJcbiAgICAvLyAgICAgbSA9PiBtLmdldCgnb2JqZWN0aXZlcycpLmZvckVhY2goXHJcbiAgICAvLyAgICAgICAgIChvYmplY3RpdmUpID0+IGRpc3BhdGNoKHVwZGF0ZU9iamVjdGl2ZSh7IG9iamVjdGl2ZSB9KSlcclxuICAgIC8vICAgICApXHJcbiAgICAvLyApO1xyXG5cclxuICAgIGRpc3BhdGNoKHVwZGF0ZU9iamVjdGl2ZXMoeyBvYmplY3RpdmVzIH0pKTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaERldGFpbHMgPSAoe1xyXG4gICAgaWQsXHJcbiAgICByZWdpb24sXHJcbiAgICBndWlsZElkcyxcclxuICAgIG1hcHMsXHJcbiAgICBvYmplY3RpdmVJZHMsXHJcbiAgICBzdGF0cyxcclxuICAgIHRpbWVzLFxyXG4gICAgd29ybGRzLFxyXG59KSA9PiAoe1xyXG4gICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFMsXHJcblxyXG4gICAgaWQsXHJcbiAgICByZWdpb24sXHJcblxyXG4gICAgZ3VpbGRJZHMsXHJcbiAgICBtYXBzLFxyXG4gICAgb2JqZWN0aXZlSWRzLFxyXG4gICAgc3RhdHMsXHJcbiAgICB0aW1lcyxcclxuICAgIHdvcmxkcyxcclxufSk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hEZXRhaWxzU3VjY2VzcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHNTdWNjZXNzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX01BVENIREVUQUlMU19TVUNDRVNTLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkID0gKHsgZXJyIH0pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHNGYWlsZWQnLCBlcnIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFNfRkFJTEVELFxyXG4gICAgICAgIGVycixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBzKG5vZGUpIHtcclxuICAgIGNvbnN0IG1hcHMgPSBub2RlXHJcbiAgICAgICAgLmdldCgnbWFwcycpXHJcbiAgICAgICAgLy8gLm1hcChcclxuICAgICAgICAvLyAgICAgbSA9PiBtLnNldCgnc3RhdHMnLCBnZXRTdGF0cyhtKSlcclxuICAgICAgICAvLyAgICAgICAgIC5kZWxldGUoJ2RlYXRocycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdob2xkaW5ncycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdraWxscycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdzY29yZXMnKVxyXG4gICAgICAgIC8vICAgICAgICAgLmRlbGV0ZSgndGlja3MnKVxyXG4gICAgICAgIC8vICAgICAgICAgLnNldCgnZ3VpbGRzJywgZ2V0TWFwR3VpbGRzKG0pKVxyXG4gICAgICAgIC8vICAgICAgICAgLnVwZGF0ZSgnb2JqZWN0aXZlcycsIG9zID0+IG9zLm1hcChvID0+IG8uZ2V0KCdpZCcpKS50b09yZGVyZWRTZXQoKSlcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgIG0gPT4gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICAgICAgICAgICAgICBpZDogbS5nZXQoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBtLmdldCgndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgbGFzdG1vZDogbS5nZXQoJ2xhc3Rtb2QnKSxcclxuICAgICAgICAgICAgICAgIHN0YXRzOiBnZXRTdGF0cyhtKSxcclxuICAgICAgICAgICAgICAgIGd1aWxkczogZ2V0TWFwR3VpbGRJZHMobSksXHJcbiAgICAgICAgICAgICAgICBvYmplY3RpdmVzOiBnZXRNYXBPYmplY3RpdmVJZHMobSksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICByZXR1cm4gbWFwcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZElkcyhtYXBOb2Rlcykge1xyXG4gICAgY29uc3QgZ3VpbGRzID0gbWFwTm9kZXNcclxuICAgICAgICAubWFwKG0gPT4gbS5nZXQoJ2d1aWxkcycpKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcblxyXG4gICAgcmV0dXJuIGd1aWxkcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBHdWlsZElkcyhtYXBOb2RlKSB7XHJcbiAgICBjb25zdCBtYXBHdWlsZHMgPSBtYXBOb2RlXHJcbiAgICAgICAgLmdldCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLm1hcChvID0+IG8uZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAuZmlsdGVyTm90KGcgPT4gZyA9PT0gbnVsbClcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcblxyXG4gICAgcmV0dXJuIG1hcEd1aWxkcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZUlkcyhtYXBOb2Rlcykge1xyXG4gICAgY29uc3Qgb2JqZWN0aXZlcyA9IG1hcE5vZGVzXHJcbiAgICAgICAgLm1hcChtID0+IG0uZ2V0KCdvYmplY3RpdmVzJykpXHJcbiAgICAgICAgLmZsYXR0ZW4oKVxyXG4gICAgICAgIC50b09yZGVyZWRTZXQoKTtcclxuXHJcbiAgICByZXR1cm4gb2JqZWN0aXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwT2JqZWN0aXZlSWRzKG1hcE5vZGUpIHtcclxuICAgIHJldHVybiBtYXBOb2RlXHJcbiAgICAgICAgLmdldCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLm1hcChvID0+IG8uZ2V0KCdpZCcpKVxyXG4gICAgICAgIC50b09yZGVyZWRTZXQoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRzKG5vZGUpIHtcclxuICAgIHJldHVybiBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICBkZWF0aHM6IG5vZGUuZ2V0KCdkZWF0aHMnKSxcclxuICAgICAgICBraWxsczogbm9kZS5nZXQoJ2tpbGxzJyksXHJcbiAgICAgICAgaG9sZGluZ3M6IG5vZGUuZ2V0KCdob2xkaW5ncycpLFxyXG4gICAgICAgIHNjb3Jlczogbm9kZS5nZXQoJ3Njb3JlcycpLFxyXG4gICAgICAgIHRpY2tzOiBub2RlLmdldCgndGlja3MnKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUaW1lcyhkZXRhaWxzTm9kZSkge1xyXG4gICAgcmV0dXJuIEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgIGxhc3Rtb2Q6IGRldGFpbHNOb2RlLmdldCgnbGFzdG1vZCcpLFxyXG4gICAgICAgIGVuZFRpbWU6IGRldGFpbHNOb2RlLmdldCgnc3RhcnRUaW1lJyksXHJcbiAgICAgICAgc3RhcnRUaW1lOiBkZXRhaWxzTm9kZS5nZXQoJ2VuZFRpbWUnKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBnZXRXb3JsZHMoZGV0YWlsc05vZGUpIHtcclxuLy8gICAgIHJldHVybiBkZXRhaWxzTm9kZVxyXG4vLyAgICAgICAgIC5nZXQoJ3dvcmxkcycpXHJcbi8vICAgICAgICAgLm1hcCh3b3JsZElkID0+IEltbXV0YWJsZS5mcm9tSlMoU1RBVElDX1dPUkxEU1t3b3JsZElkXSkpO1xyXG4vLyB9IiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICAvLyBSRVFVRVNUX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoZXMgPSAoeyBkYXRhLCBsYXN0VXBkYXRlZCB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hlcycsIGRhdGEpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSEVTLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgbGFzdFVwZGF0ZWQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoZXNTdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoZXNGYWlsZWQnLCBlcnIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzRmFpbGVkID0gKHsgZXJyIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbiAgICAgICAgZXJyLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXNMYXN0bW9kKG1hdGNoZXNEYXRhKSB7XHJcbiAgICByZXR1cm4gXy5yZWR1Y2UoXHJcbiAgICAgICAgbWF0Y2hlc0RhdGEsXHJcbiAgICAgICAgKGFjYywgbWF0Y2gpID0+IE1hdGgubWF4KG1hdGNoLmxhc3Rtb2QpLFxyXG4gICAgICAgIDBcclxuICAgICk7XHJcbn0iLCJpbXBvcnQgeyBTRVRfTk9XIH0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0Tm93ID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0Tm93Jyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfTk9XLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIE9CSkVDVElWRVNfUkVTRVQsXHJcbiAgICBPQkpFQ1RJVkVTX1VQREFURSxcclxuICAgIE9CSkVDVElWRV9VUERBVEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc2V0T2JqZWN0aXZlcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlc2V0T2JqZWN0aXZlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogT0JKRUNUSVZFU19SRVNFVCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVPYmplY3RpdmVzID0gKHsgb2JqZWN0aXZlcyB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjp1cGRhdGVPYmplY3RpdmVzJywgb2JqZWN0aXZlcy50b0pTKCkpO1xyXG5cclxuICAgIG9iamVjdGl2ZXMgPSBvYmplY3RpdmVzLm1hcChcclxuICAgICAgICBvYmplY3RpdmUgPT5cclxuICAgICAgICBvYmplY3RpdmVcclxuICAgICAgICAgICAgLnVwZGF0ZSgnbGFzdEZsaXBwZWQnLCB2ID0+IG1vbWVudC51bml4KHYpKVxyXG4gICAgICAgICAgICAudXBkYXRlKCdsYXN0Q2xhaW1lZCcsIHYgPT4gbW9tZW50LnVuaXgodikpXHJcbiAgICAgICAgICAgIC51cGRhdGUoJ2xhc3Rtb2QnLCB2ID0+IG1vbWVudC51bml4KHYpKVxyXG4gICAgICAgICAgICAudXBkYXRlKHYgPT4gdi5zZXQoJ2V4cGlyZXMnLCB2LmdldCgnbGFzdEZsaXBwZWQnKS5hZGQoNSwgJ20nKSkpXHJcbiAgICApO1xyXG4vL1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBPQkpFQ1RJVkVTX1VQREFURSxcclxuICAgICAgICBvYmplY3RpdmVzLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZU9iamVjdGl2ZSA9ICh7IG9iamVjdGl2ZSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjp1cGRhdGVPYmplY3RpdmUnLCBvYmplY3RpdmUudG9KUygpKTtcclxuXHJcbiAgICAvLyBvYmplY3RpdmUgPSBvYmplY3RpdmUuc2V0KCdleHBpcmVzJywgb2JqZWN0aXZlLmdldCgnbGFzdEZsaXBwZWQnKSArICg1ICogNjAgKiAxMDAwKSk7XHJcbiAgICAvLyBvYmplY3RpdmUgPSBvYmplY3RpdmVcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0RmxpcHBlZCcsIHYgPT4gbW9tZW50KHYgKiAxMDAwKSlcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0Q2xhaW1lZCcsIHYgPT4gbW9tZW50KHYgKiAxMDAwKSlcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0bW9kJywgdiA9PiBtb21lbnQodiAqIDEwMDApKTtcclxuLy9cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogT0JKRUNUSVZFX1VQREFURSxcclxuICAgICAgICBvYmplY3RpdmUsXHJcbiAgICB9O1xyXG59OyIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1JPVVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFJvdXRlID0gKGN0eCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfUk9VVEUsXHJcbiAgICAgICAgcGF0aDogY3R4LnBhdGgsXHJcbiAgICAgICAgcGFyYW1zOiBjdHgucGFyYW1zLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBBRERfVElNRU9VVCxcclxuICAgIFJFTU9WRV9USU1FT1VULFxyXG4gICAgLy8gUkVNT1ZFX0FMTF9USU1FT1VUUyxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0QXBwVGltZW91dCA9ICh7XHJcbiAgICBuYW1lLFxyXG4gICAgY2IsXHJcbiAgICB0aW1lb3V0LFxyXG59KSA9PiB7XHJcbiAgICB0aW1lb3V0ID0gKHR5cGVvZiB0aW1lb3V0ID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgID8gdGltZW91dCgpXHJcbiAgICAgICAgOiB0aW1lb3V0O1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldEFwcFRpbWVvdXQnLCBuYW1lLCB0aW1lb3V0KTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlZiA9IHNldFRpbWVvdXQoY2IsIHRpbWVvdXQpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChzYXZlVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHJlZixcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2F2ZVRpbWVvdXQgPSAoe1xyXG4gICAgbmFtZSxcclxuICAgIHJlZixcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBRERfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHJlZixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFwcFRpbWVvdXQgPSAoeyBuYW1lIH0pID0+IHtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQXBwVGltZW91dCcsIG5hbWUsIHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2gocmVtb3ZlVGltZW91dCh7IG5hbWUgfSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFsbFRpbWVvdXRzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnLCBnZXRTdGF0ZSgpLnRpbWVvdXRzKTtcclxuXHJcbiAgICAgICAgXy5mb3JFYWNoKHRpbWVvdXRzLCAodCwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhckFwcFRpbWVvdXQoeyBuYW1lIH0pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycsIGdldFN0YXRlKCkudGltZW91dHMpO1xyXG5cclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVUaW1lb3V0ID0gKHsgbmFtZSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZW1vdmVUaW1lb3V0JywgbmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRU1PVkVfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfV09STEQsXHJcbiAgICBDTEVBUl9XT1JMRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0V29ybGQgPSAobGFuZ1NsdWcsIHdvcmxkU2x1ZykgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFNFVF9XT1JMRCxcclxuICAgICAgICBsYW5nU2x1ZyxcclxuICAgICAgICB3b3JsZFNsdWcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyV29ybGQgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRXb3JsZCcsIGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQ0xFQVJfV09STEQsXHJcbiAgICB9O1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJztcclxuaW1wb3J0IHsgZW5hYmxlQmF0Y2hpbmcgfSBmcm9tICdyZWR1eC1iYXRjaGVkLWFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IFBlcmYgZnJvbSAncmVhY3QtYWRkb25zLXBlcmYnO1xyXG5pbXBvcnQgUGVyZkNvbnRyb2xzIGZyb20gJ2NvbXBvbmVudHMvdXRpbC9QZXJmJztcclxuXHJcblxyXG5pbXBvcnQgZG9tcmVhZHkgZnJvbSAnZG9tcmVhZHknO1xyXG5pbXBvcnQgcGFnZSBmcm9tICdwYWdlJztcclxuXHJcblxyXG5cclxuXHJcbmltcG9ydCBDb250YWluZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvQ29udGFpbmVyJztcclxuaW1wb3J0IE92ZXJ2aWV3IGZyb20gJ2NvbXBvbmVudHMvT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdjb21wb25lbnRzL1RyYWNrZXInO1xyXG5cclxuaW1wb3J0IGFwcFJlZHVjZXJzIGZyb20gJ3JlZHVjZXJzJztcclxuXHJcbmltcG9ydCB7IHNldFJvdXRlIH0gZnJvbSAnYWN0aW9ucy9yb3V0ZSc7XHJcbmltcG9ydCB7IHNldExhbmcgfSBmcm9tICdhY3Rpb25zL2xhbmcnO1xyXG5pbXBvcnQgeyBzZXRXb3JsZCwgY2xlYXJXb3JsZCB9IGZyb20gJ2FjdGlvbnMvd29ybGQnO1xyXG5pbXBvcnQgeyByZXNldE9iamVjdGl2ZXMgfSBmcm9tICdhY3Rpb25zL29iamVjdGl2ZXMnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDcmVhdGUgUmVkdXggU3RvcmVcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIGVuYWJsZUJhdGNoaW5nKGFwcFJlZHVjZXJzKSxcclxuICAgIGFwcGx5TWlkZGxld2FyZSh0aHVua01pZGRsZXdhcmUpXHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFN0YXJ0IEFwcFxyXG4qXHJcbiovXHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgQXBwbGljYXRpb24nKTtcclxuXHJcbiAgICAvLyBQZXJmLnN0YXJ0KCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnUGVyZiBzdGFydGVkJyk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJywgcHJvY2Vzcy5lbnYuTk9ERV9FTlYpO1xyXG5cclxuXHJcbiAgICBhdHRhY2hQYWdlTWlkZGxld2FyZSgpO1xyXG4gICAgYXR0YWNoUGFnZVJvdXRlcygpO1xyXG5cclxuICAgIHBhZ2Uuc3RhcnQoe1xyXG4gICAgICAgIGNsaWNrOiB0cnVlLFxyXG4gICAgICAgIHBvcHN0YXRlOiBmYWxzZSxcclxuICAgICAgICBkaXNwYXRjaDogdHJ1ZSxcclxuICAgICAgICBoYXNoYmFuZzogZmFsc2UsXHJcbiAgICAgICAgZGVjb2RlVVJMQ29tcG9uZW50czogdHJ1ZSxcclxuICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKEFwcCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcigpJyk7XHJcblxyXG4gICAgUmVhY3RET00ucmVuZGVyKFxyXG4gICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgICAgICA8Q29udGFpbmVyPlxyXG4gICAgICAgICAgICAgICAgey8qPFBlcmZDb250cm9scyAvPiovfVxyXG5cclxuICAgICAgICAgICAgICAgIHtBcHB9XHJcbiAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1hcHAnKVxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoUGFnZU1pZGRsZXdhcmUoKSB7XHJcbiAgICBwYWdlKChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmluZm8oYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFjaCBzdG9yZSB0byB0aGUgcm91dGVyIGNvbnRleHRcclxuICAgICAgICBjdHguc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goc2V0Um91dGUoY3R4KSk7XHJcblxyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmdTbHVnLCB3b3JsZFNsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcblxyXG4gICAgICAgIGlmICh3b3JsZFNsdWcpIHtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHJlc2V0T2JqZWN0aXZlcygpKTtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHNldFdvcmxkKGxhbmdTbHVnLCB3b3JsZFNsdWcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoUGFnZVJvdXRlcygpIHtcclxuICAgIHBhZ2UoJy8nLCAnL2VuJyk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcikvOndvcmxkU2x1ZyhbYS16LV0rKScsXHJcbiAgICAgICAgKGN0eCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zdCB7IGxhbmdTbHVnLCB3b3JsZFNsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0TGFuZyhsYW5nU2x1ZykpO1xyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0V29ybGQobGFuZ1NsdWcsIHdvcmxkU2x1ZykpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeyBsYW5nLCB3b3JsZCB9ID0gY3R4LnN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIoPFRyYWNrZXIgLz4pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmciknLFxyXG4gICAgICAgIChjdHgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgeyBsYW5nU2x1ZyB9ID0gY3R4LnBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyKDxPdmVydmlldyAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5cclxuaW1wb3J0IExhbmdzIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L0xhbmdzJztcclxuaW1wb3J0IE5hdmJhckhlYWRlciBmcm9tICdjb21wb25lbnRzL0xheW91dC9OYXZiYXJIZWFkZXInO1xyXG5pbXBvcnQgRm9vdGVyIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L0Zvb3Rlcic7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRXF1YWxCeVBpY2soY3VycmVudFByb3BzLCBuZXh0UHJvcHMsIGtleXMpIHtcclxuICAgIHJldHVybiBfLmlzRXF1YWwoXHJcbiAgICAgICAgXy5waWNrKGN1cnJlbnRQcm9wcywga2V5cyksXHJcbiAgICAgICAgXy5waWNrKG5leHRQcm9wcywga2V5cyksXHJcbiAgICApO1xyXG5cclxuICAgIC8vIHJldHVybiBfLnJlZHVjZShrZXlzLCAoYSwga2V5KSA9PiB7XHJcbiAgICAvLyAgICAgcmV0dXJuIGEgfHwgIV8uaXNFcXVhbChjdXJyZW50UHJvcHNba2V5XSwgbmV4dFByb3BzW2tleV0pO1xyXG4gICAgLy8gfSwgZmFsc2UpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAhaXNFcXVhbEJ5UGljayh0aGlzLnByb3BzLCBuZXh0UHJvcHMsIFsnd29ybGQnLCAnY2hpbGRyZW4nXSlcclxuICAgICAgICAgICAgfHwgIXRoaXMucHJvcHMubGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnRTaG91bGRVcGRhdGUoKWAsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYW5nJywgXy5pc0VxdWFsKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkJywgXy5pc0VxdWFsKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCksIG5leHRQcm9wcy53b3JsZCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgLy8gY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudERpZFVwZGF0ZSgpYCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT0nbmF2YmFyIG5hdmJhci1kZWZhdWx0Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhckhlYWRlciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGlkPSdjb250ZW50JyBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxGb290ZXIgb2JzZnVFbWFpbD17e1xyXG4gICAgICAgICAgICAgICAgICAgIGNodW5rczogWydndzJ3MncnLCAnc2NodHVwaCcsICdjb20nLCAnQCcsICcuJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogJzAzMTQyJyxcclxuICAgICAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNvbnRhaW5lciA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShDb250YWluZXIpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb250YWluZXI7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBvYnNmdUVtYWlsLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC14cy0yNCc+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT0nc21hbGwgbXV0ZWQgdGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgwqkgMjAxMyBBcmVuYU5ldCwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTkNzb2Z0LCB0aGUgaW50ZXJsb2NraW5nIE5DIGxvZ28sIEFyZW5hTmV0LCBHdWlsZCBXYXJzLCBHdWlsZCBXYXJzIEZhY3Rpb25zLCBHdWlsZCBXYXJzIE5pZ2h0ZmFsbCwgR3VpbGQgV2FyczpFeWUgb2YgdGhlIE5vcnRoLCBHdWlsZCBXYXJzIDIsIGFuZCBhbGwgYXNzb2NpYXRlZCBsb2dvcyBhbmQgZGVzaWducyBhcmUgdHJhZGVtYXJrcyBvciByZWdpc3RlcmVkIHRyYWRlbWFya3Mgb2YgTkNzb2Z0IENvcnBvcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxsIG90aGVyIHRyYWRlbWFya3MgYXJlIHRoZSBwcm9wZXJ0eSBvZiB0aGVpciByZXNwZWN0aXZlIG93bmVycy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2Ugc2VuZCBjb21tZW50cyBhbmQgYnVncyB0byA8T2JzZnVFbWFpbCBvYnNmdUVtYWlsPXtvYnNmdUVtYWlsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1cHBvcnRpbmcgbWljcm9zZXJ2aWNlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8nPmd1aWxkcy5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3N0YXRlLmd3Mncydy5jb20vJz5zdGF0ZS5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3d3dy5waWVseS5uZXQvJz53d3cucGllbHkubmV0PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNvdXJjZSBhdmFpbGFibGUgYXQgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdCc+aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9mb290ZXI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuY29uc3QgT2JzZnVFbWFpbCA9ICh7b2JzZnVFbWFpbH0pID0+IHtcclxuICAgIGNvbnN0IHJlY29uc3RydWN0ZWQgPSBvYnNmdUVtYWlsLnBhdHRlcm5cclxuICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgLm1hcChpeENodW5rID0+IG9ic2Z1RW1haWwuY2h1bmtzW2l4Q2h1bmtdKVxyXG4gICAgICAgIC5qb2luKCcnKTtcclxuXHJcbiAgICByZXR1cm4gPGEgaHJlZj17YG1haWx0bzoke3JlY29uc3RydWN0ZWR9YH0+e3JlY29uc3RydWN0ZWR9PC9hPjtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGFjdGl2ZUxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMubGFuZztcclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUud29ybGQ7XHJcbmNvbnN0IHdvcmxkRGF0YVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBhY3RpdmVMYW5nU2VsZWN0b3IsXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICB3b3JsZFNlbGVjdG9yLFxyXG4gICAgKGFjdGl2ZUxhbmcsIGxhbmcsIHdvcmxkKSA9PiAoe1xyXG4gICAgICAgIGFjdGl2ZUxhbmcsXHJcbiAgICAgICAgd29ybGQ6IHdvcmxkID8gd29ybGRzW3dvcmxkLmlkXVtsYW5nLnNsdWddIDogbnVsbCxcclxuICAgIH0pXHJcbik7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICAvLyBjb25zb2xlLmxvZygnbGFuZycsIHN0YXRlLmxhbmcpO1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBhY3RpdmVMYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIC8vIGFjdGl2ZVdvcmxkOiBzdGF0ZS53b3JsZCxcclxuLy8gICAgICAgICB3b3JsZDogc3RhdGUud29ybGQgPyB3b3JsZHNbc3RhdGUud29ybGQuaWRdW3Byb3BzLmxhbmcuc2x1Z10gOiBudWxsLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5sZXQgTGFuZyA9ICh7XHJcbiAgICBhY3RpdmVMYW5nLFxyXG4gICAgLy8gYWN0aXZlV29ybGQsXHJcbiAgICBsYW5nLFxyXG4gICAgd29ybGQsXHJcbn0pID0+IChcclxuICAgIDxsaVxyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogYWN0aXZlTGFuZy5nZXQoJ2xhYmVsJykgPT09IGxhbmcubGFiZWwsXHJcbiAgICAgICAgfSl9XHJcbiAgICAgICAgdGl0bGU9e2xhbmcubmFtZX1cclxuICAgID5cclxuICAgICAgICA8YSBocmVmPXtnZXRMaW5rKGxhbmcsIHdvcmxkKX0+XHJcbiAgICAgICAgICAgIHtsYW5nLmxhYmVsfVxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbik7XHJcbkxhbmcucHJvcFR5cGVzID0ge1xyXG4gICAgYWN0aXZlTGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgYWN0aXZlV29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcbkxhbmcgPSBjb25uZWN0KFxyXG4gIHdvcmxkRGF0YVNlbGVjdG9yLFxyXG4gIC8vIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKExhbmcpO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gKHdvcmxkKVxyXG4gICAgICAgID8gd29ybGQubGlua1xyXG4gICAgICAgIDogbGFuZy5saW5rO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmc7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBsYW5ncyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IExhbmdMaW5rIGZyb20gJy4vTGFuZ0xpbmsnO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgTGFuZ3MgPSAoKSA9PiAoXHJcbiAgICA8ZGl2IGlkPSduYXYtbGFuZ3MnIGNsYXNzTmFtZT0ncHVsbC1yaWdodCc+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZSA9ICduYXYgbmF2YmFyLW5hdic+XHJcbiAgICAgICAgICAgIHtfLm1hcChsYW5ncywgKGxhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGluayBrZXk9e2tleX0gbGFuZz17bGFuZ30gLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmdzOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcbjtcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBhcGlTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUuYXBpO1xyXG5jb25zdCBhcGlQZW5kaW5nU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihhcGlTZWxlY3RvciwgKGFwaSkgPT4gYXBpLmdldCgncGVuZGluZycpKTtcclxuY29uc3QgaGFzUGVuZGluZ1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoYXBpUGVuZGluZ1NlbGVjdG9yLCAocGVuZGluZykgPT4gIXBlbmRpbmcuaXNFbXB0eSgpKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgaGFzUGVuZGluZ1NlbGVjdG9yLFxyXG4gICAgKGxhbmcsIGhhc1BlbmRpbmdSZXF1ZXN0cykgPT4gKHtcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIGhhc1BlbmRpbmdSZXF1ZXN0cyxcclxuICAgIH0pXHJcbik7XHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIGhhc1BlbmRpbmdSZXF1ZXN0czogIXN0YXRlLmFwaS5nZXQoJ3BlbmRpbmcnKS5pc0VtcHR5KCksXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5sZXQgTmF2YmFySGVhZGVyID0gKHtcclxuICAgIGxhbmcsXHJcbiAgICBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXItaGVhZGVyJz5cclxuICAgICAgICA8YSBjbGFzc05hbWU9J25hdmJhci1icmFuZCcgaHJlZj17YC8ke2xhbmcuZ2V0KCdzbHVnJyl9YH0+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPScvaW1nL2xvZ28vbG9nby05NngzNi5wbmcnIC8+XHJcbiAgICAgICAgPC9hPlxyXG5cclxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAnbmF2YmFyLXNwaW5uZXInOiB0cnVlLFxyXG4gICAgICAgICAgICBhY3RpdmU6IGhhc1BlbmRpbmdSZXF1ZXN0cyxcclxuICAgICAgICB9KX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJyAvPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcbk5hdmJhckhlYWRlci5wcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICBoYXNQZW5kaW5nUmVxdWVzdHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5OYXZiYXJIZWFkZXIgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoTmF2YmFySGVhZGVyKTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmJhckhlYWRlcjsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoV29ybGQgZnJvbSAnLi9NYXRjaFdvcmxkJztcclxuXHJcbmltcG9ydCB7IHdvcmxkcyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5jb25zdCBXT1JMRF9DT0xPUlMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuLy8gY29uc3QgbWFwVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICAvLyBtYXRjaDogc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkXSksXHJcbi8vICAgICAgICAgbWF0Y2g6IChJbW11dGFibGUuTWFwLmlzTWFwKHN0YXRlLm1hdGNoZXMpKVxyXG4vLyAgICAgICAgICAgICA/IHN0YXRlLm1hdGNoZXMuZ2V0SW4oWydkYXRhJywgcHJvcHMubWF0Y2hJZF0pXHJcbi8vICAgICAgICAgICAgIDogSW1tdXRhYmxlLk1hcCh7ICB9KSxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IG1hdGNoU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5tYXRjaDtcclxuXHJcbi8vIGNvbnN0IG1hdGNoU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuLy8gICAgIG1hdGNoSWRTZWxlY3RvcixcclxuLy8gICAgIG1hdGNoZXNTZWxlY3RvcixcclxuLy8gICAgIChtYXRjaElkLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmdldChtYXRjaElkKVxyXG4vLyApO1xyXG5cclxuY29uc3QgbWFwVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hTZWxlY3RvcixcclxuICAgIChsYW5nLCBtYXRjaCkgPT4gKHsgbGFuZywgbWF0Y2ggfSlcclxuKTtcclxuXHJcblxyXG5cclxuY2xhc3MgTWF0Y2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5pc05ld01hdGNoRGF0YShuZXh0UHJvcHMpXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TWF0Y2hEYXRhKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5tYXRjaC5lcXVhbHMobmV4dFByb3BzLm1hdGNoKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtYXRjaCcsIG1hdGNoLmdldCgnaWQnKSwgbWF0Y2gudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hdGNoQ29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J21hdGNoJz5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtfLm1hcChXT1JMRF9DT0xPUlMsIChjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBtYXRjaC5nZXRJbihbJ3dvcmxkcycsIGNvbG9yXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAndHInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHt3b3JsZElkfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0ge21hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllID0ge2NvbG9yID09PSAncmVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGRJZCA9IHt3b3JsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezJ9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3t0ZXh0QWxpZ246ICdjZW50ZXInfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnttb21lbnQobWF0Y2gubGFzdG1vZCAqIDEwMDApLmZvcm1hdCgnaGg6bW06c3MnKX08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4qL31cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuTWF0Y2ggPSBjb25uZWN0KFxyXG4gICAgbWFwVG9Qcm9wcyxcclxuKShNYXRjaCk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2g7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IFBpZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9JY29ucy9QaWUnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBtYXRjaElkOiBwcm9wcy5tYXRjaElkLFxyXG4vLyAgICAgICAgIHNjb3JlczogKEltbXV0YWJsZS5NYXAuaXNNYXAoc3RhdGUubWF0Y2hlcykpXHJcbi8vICAgICAgICAgICAgID8gc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkLCAnc2NvcmVzJ10pXHJcbi8vICAgICAgICAgICAgIDogSW1tdXRhYmxlLk1hcCh7IHJlZDogMCwgYmx1ZTogMCwgZ3JlZW46IDAgfSksXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuY29uc3QgbWF0Y2hJZFNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMubWF0Y2hJZDtcclxuY29uc3Qgc2NvcmVzU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiAoXHJcbiAgICAoSW1tdXRhYmxlLk1hcC5pc01hcChzdGF0ZS5tYXRjaGVzKSlcclxuICAgID8gc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkLCAnc2NvcmVzJ10pXHJcbiAgICA6IEltbXV0YWJsZS5NYXAoeyByZWQ6IDAsIGJsdWU6IDAsIGdyZWVuOiAwIH0pXHJcbik7XHJcblxyXG5jb25zdCBtYXBTZWxlY3RvcnNUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBzY29yZXNTZWxlY3RvcixcclxuICAgIG1hdGNoSWRTZWxlY3RvcixcclxuICAgIChzY29yZXMsIG1hdGNoSWQpID0+ICh7XHJcbiAgICAgICAgc2NvcmVzLFxyXG4gICAgICAgIG1hdGNoSWQsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuXHJcbmNsYXNzIE1hdGNoUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgc2NvcmVzOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnByb3BzLnNjb3Jlcy5lcXVhbHMobmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgc2NvcmVzLFxyXG4gICAgICAgICAgICBtYXRjaElkLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaElkLCBzY29yZXMudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFBpZSBzY29yZXM9e3Njb3Jlcy50b0pTKCl9IHNpemU9ezYwfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NYXRjaFBpZSA9IGNvbm5lY3QoXHJcbiAgICBtYXBTZWxlY3RvcnNUb1Byb3BzXHJcbikoTWF0Y2hQaWUpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaFBpZTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IG51bWVyYWwgZnJvbSAnbnVtZXJhbCc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBNYXRjaFBpZSBmcm9tICcuL01hdGNoUGllJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xvclNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMuY29sb3I7XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLm1hdGNoO1xyXG5jb25zdCBzaG93UGllU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5zaG93UGllO1xyXG5jb25zdCB3b3JsZElkU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy53b3JsZElkO1xyXG5cclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgd29ybGRJZFNlbGVjdG9yLFxyXG4gICAgKGxhbmcsIHdvcmxkSWQpID0+IHdvcmxkc1t3b3JsZElkXVtsYW5nLmdldCgnc2x1ZycpXVxyXG4pO1xyXG5jb25zdCBzY29yZXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hTZWxlY3RvcixcclxuICAgIChtYXRjaCkgPT4gbWF0Y2guZ2V0KCdzY29yZXMnKVxyXG4pO1xyXG5jb25zdCBzY29yZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBjb2xvclNlbGVjdG9yLFxyXG4gICAgc2NvcmVzU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIHNjb3JlcykgPT4gc2NvcmVzLmdldChjb2xvcilcclxuKTtcclxuXHJcbmNvbnN0IG1hcFNlbGVjdG9yc1RvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICBtYXRjaFNlbGVjdG9yLFxyXG4gICAgc2NvcmVTZWxlY3RvcixcclxuICAgIHNob3dQaWVTZWxlY3RvcixcclxuICAgIHdvcmxkU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIGxhbmcsIG1hdGNoLCBzY29yZSwgc2hvd1BpZSwgd29ybGQpID0+ICh7XHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBtYXRjaCxcclxuICAgICAgICBzY29yZSxcclxuICAgICAgICBzaG93UGllLFxyXG4gICAgICAgIHdvcmxkLFxyXG4gICAgfSlcclxuKTtcclxuXHJcblxyXG5jbGFzcyBNYXRjaFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgICAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHNob3dQaWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpXHJcbiAgICAgICAgICAgIHx8ICghdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgbWF0Y2gsXHJcbiAgICAgICAgICAgIHNjb3JlLFxyXG4gICAgICAgICAgICBzaG93UGllLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cod29ybGQsIHNjb3JlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke2NvbG9yfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICB7Lyo8dGQgY2xhc3NOYW1lPXtgdGVhbSBraWxscyAke2NvbG9yfWB9PnttYXRjaC5raWxscyA/IG51bWVyYWwobWF0Y2gua2lsbHNbY29sb3JdKS5mb3JtYXQoJzAsMCcpIDogbnVsbH08L3RkPiovfVxyXG4gICAgICAgICAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0gZGVhdGhzICR7Y29sb3J9YH0+e21hdGNoLmRlYXRocyA/IG51bWVyYWwobWF0Y2guZGVhdGhzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7Y29sb3J9YH0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgPyBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9PC90ZD5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHNob3dQaWUpID8gPHRkIGNsYXNzTmFtZT0ncGllJyByb3dTcGFuPSczJz48TWF0Y2hQaWUgbWF0Y2hJZD17bWF0Y2guZ2V0KCdpZCcpfSBzaXplPXs2MH0gLz48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1hdGNoV29ybGQgPSBjb25uZWN0KFxyXG4gICAgbWFwU2VsZWN0b3JzVG9Qcm9wc1xyXG4pKE1hdGNoV29ybGQpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaFdvcmxkOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgTWF0Y2ggZnJvbSAnLi9NYXRjaCc7XHJcblxyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17eyBwYWRkaW5nTGVmdDogJy41ZW0nIH19PjxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJyAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHJlZ2lvblNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMucmVnaW9uO1xyXG5jb25zdCBtYXRjaGVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiAoSW1tdXRhYmxlLk1hcC5pc01hcChzdGF0ZS5tYXRjaGVzKSAmJiBzdGF0ZS5tYXRjaGVzLmhhcygnZGF0YScpKVxyXG4gICAgICAgID8gc3RhdGUubWF0Y2hlcy5nZXQoJ2RhdGEnKVxyXG4gICAgICAgIDogSW1tdXRhYmxlLk1hcCgpO1xyXG59O1xyXG5cclxuY29uc3QgcmVnaW9uTWF0Y2hlc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICByZWdpb25TZWxlY3RvcixcclxuICAgIG1hdGNoZXNTZWxlY3RvcixcclxuICAgIChyZWdpb24sIG1hdGNoZXMpID0+IG1hdGNoZXMuZmlsdGVyKG1hdGNoID0+IHJlZ2lvbi5pZCA9PT0gbWF0Y2guZ2V0KCdyZWdpb24nKSlcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgcmVnaW9uTWF0Y2hlc1NlbGVjdG9yLFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hlcywgcmVnaW9uKSA9PiAoe1xyXG4gICAgICAgIG1hdGNoZXMsXHJcbiAgICAgICAgcmVnaW9uLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbWF0Y2hJZHM6IF8uZmlsdGVyKFxyXG4vLyAgICAgICAgICAgICBzdGF0ZS5tYXRjaGVzLmlkcyxcclxuLy8gICAgICAgICAgICAgaWQgPT4gcHJvcHMucmVnaW9uLmlkID09PSBpZC5jaGFyQXQoMClcclxuLy8gICAgICAgICApLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBNYXRjaGVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbWF0Y2hlczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAhdGhpcy5wcm9wcy5tYXRjaGVzLmVxdWFscyhuZXh0UHJvcHMubWF0Y2hlcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnT3ZlcnZpZXc6Ok1hdGNoZXM6OnNob3VsZFVwZGF0ZScsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbWF0Y2hlcyxcclxuICAgICAgICAgICAgcmVnaW9uLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAge3JlZ2lvbi5sYWJlbH0gTWF0Y2hlc1xyXG4gICAgICAgICAgICAgICAgICAgIHttYXRjaGVzLmlzRW1wdHkoKSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAge21hdGNoZXMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChtYXRjaCwgbWF0Y2hJZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICA8TWF0Y2gga2V5PXttYXRjaElkfSBtYXRjaD17bWF0Y2h9IC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5NYXRjaGVzID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKE1hdGNoZXMpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2hlczsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIGFzIFNUQVRJQ19XT1JMRFMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmNvbnN0IFdPUkxEU19JTU1VVCA9IEltbXV0YWJsZS5mcm9tSlMoU1RBVElDX1dPUkxEUyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IHJlZ2lvblNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMucmVnaW9uO1xyXG5jb25zdCB3b3JsZHNTZWxlY3RvciA9ICgpID0+IFdPUkxEU19JTU1VVDtcclxuXHJcbmNvbnN0IHJlZ2lvbldvcmxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICByZWdpb25TZWxlY3RvcixcclxuICAgIHdvcmxkc1NlbGVjdG9yLFxyXG4gICAgKGxhbmcsIHJlZ2lvbiwgd29ybGRzKSA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JsZHNcclxuICAgICAgICAgICAgLmZpbHRlcih3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpID09PSByZWdpb24uaWQpXHJcbiAgICAgICAgICAgIC5tYXAod29ybGQgPT4gd29ybGQuZ2V0KGxhbmcuZ2V0KCdzbHVnJykpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KHdvcmxkID0+IHdvcmxkLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICByZWdpb25Xb3JsZHNTZWxlY3RvcixcclxuICAgIChsYW5nLCByZWdpb24sIHJlZ2lvbldvcmxkcykgPT4gKHtcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIHJlZ2lvbixcclxuICAgICAgICByZWdpb25Xb3JsZHMsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4gKHtcclxuLy8gICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcclxuLy8gfSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgV29ybGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbldvcmxkczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgcmVnaW9uLFxyXG4gICAgICAgICAgICByZWdpb25Xb3JsZHMsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdSZWdpb25Xb3JsZHMnPlxyXG4gICAgICAgICAgICAgICAgPGgyPntyZWdpb24ubGFiZWx9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7cmVnaW9uV29ybGRzLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17d29ybGQuZ2V0KCdzbHVnJyl9PjxhIGhyZWY9e3dvcmxkLmdldCgnbGluaycpfT57d29ybGQuZ2V0KCduYW1lJyl9PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Xb3JsZHMgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoV29ybGRzKTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBXb3JsZHM7IiwiXHJcbi8qXHJcbipcclxuKiAgIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQgKiBhcyB0aW1lb3V0QWN0aW9ucyBmcm9tICdhY3Rpb25zL3RpbWVvdXRzJztcclxuXHJcblxyXG4vKlxyXG4qICAgUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuaW1wb3J0IE1hdGNoZXMgZnJvbSAnLi9NYXRjaGVzJztcclxuaW1wb3J0IFdvcmxkcyBmcm9tICcuL1dvcmxkcyc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUkVHSU9OUyA9IHtcclxuICAgIDE6IHsgbGFiZWw6ICdOQScsIGlkOiAnMScgfSxcclxuICAgIDI6IHsgbGFiZWw6ICdFVScsIGlkOiAnMicgfSxcclxufTtcclxuXHJcbmNvbnN0IFJFRlJFU0hfVElNRU9VVCA9IF8ucmFuZG9tKDQgKiAxMDAwLCA4ICogMTAwMCk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgYXBpU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmFwaTtcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBtYXRjaGVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoZXM7XHJcblxyXG5jb25zdCBkYXRhRXJyb3JTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdlcnJvcicpKTtcclxuY29uc3QgbWF0Y2hlc0RhdGFTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdkYXRhJykpO1xyXG5jb25zdCBtYXRjaGVzTGFzdFVwZGF0ZWRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdsYXN0VXBkYXRlZCcpKTtcclxuY29uc3QgbWF0Y2hlc0lzRmV0Y2hpbmdTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKGFwaVNlbGVjdG9yLCAoYXBpKSA9PiBhcGkuZ2V0KCdwZW5kaW5nJykuaW5jbHVkZXMoJ21hdGNoZXMnKSk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIGRhdGFFcnJvclNlbGVjdG9yLFxyXG4gICAgbWF0Y2hlc0RhdGFTZWxlY3RvcixcclxuICAgIG1hdGNoZXNMYXN0VXBkYXRlZFNlbGVjdG9yLFxyXG4gICAgbWF0Y2hlc0lzRmV0Y2hpbmdTZWxlY3RvcixcclxuICAgIChsYW5nLCBkYXRhRXJyb3IsIG1hdGNoZXNEYXRhLCBtYXRjaGVzTGFzdFVwZGF0ZWQsIG1hdGNoZXNJc0ZldGNoaW5nKSA9PiAoe1xyXG4gICAgICAgIGxhbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGEsXHJcbiAgICAgICAgZGF0YUVycm9yLFxyXG4gICAgICAgIG1hdGNoZXNMYXN0VXBkYXRlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZyxcclxuICAgIH0pXHJcbik7XHJcblxyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcblxyXG4vLyAgICAgLy8gY29uc29sZS5sb2coJ3N0YXRlJywgc3RhdGUudGltZW91dHMpO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICBtYXRjaGVzRGF0YTogc3RhdGUubWF0Y2hlcy5kYXRhLFxyXG4vLyAgICAgICAgIG1hdGNoZXNMYXN0VXBkYXRlZDogc3RhdGUubWF0Y2hlcy5sYXN0VXBkYXRlZCxcclxuLy8gICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogXy5pbmNsdWRlcyhzdGF0ZS5hcGkucGVuZGluZywgJ21hdGNoZXMnKSxcclxuLy8gICAgICAgICAvLyB0aW1lb3V0czogc3RhdGUudGltZW91dHMsXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoTWF0Y2hlczogKCkgPT4gZGlzcGF0Y2goYXBpQWN0aW9ucy5mZXRjaE1hdGNoZXMoKSksXHJcbiAgICAgICAgc2V0QXBwVGltZW91dDogKHsgbmFtZSwgY2IsIHRpbWVvdXQgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuc2V0QXBwVGltZW91dCh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pKSxcclxuICAgICAgICBjbGVhckFwcFRpbWVvdXQ6ICh7IG5hbWUgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSksXHJcbiAgICAgICAgLy8gY2xlYXJBbGxUaW1lb3V0czogKCkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBbGxUaW1lb3V0cygpKSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBPdmVydmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBkYXRhRXJyb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyB0aW1lb3V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBmZXRjaE1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcy8qLCBuZXh0U3RhdGUqLykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWQgIT09IG5leHRQcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy5tYXRjaGVzSXNGZXRjaGluZyAhPT0gbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMuZGF0YUVycm9yICE9PSBuZXh0UHJvcHMuZGF0YUVycm9yXHJcbiAgICAgICAgICAgIHx8ICF0aGlzLnByb3BzLm1hdGNoZXNEYXRhLmVxdWFscyhuZXh0UHJvcHMubWF0Y2hlc0RhdGEpXHJcbiAgICAgICAgICAgIHx8ICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6c2hvdWxkVXBkYXRlYCwgc2hvdWxkVXBkYXRlLCB0aGlzLnByb3BzLCBuZXh0UHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OnNob3VsZFVwZGF0ZWAsIHNob3VsZFVwZGF0ZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojppc05ld01hdGNoZXNEYXRhYCwgdGhpcy5pc05ld01hdGNoZXNEYXRhKG5leHRQcm9wcykpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6aXNOZXdMYW5nYCwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojpjb21wb25lbnRXaWxsTW91bnQoKWApO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50RGlkTW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmZldGNoTWF0Y2hlcygpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKWApO1xyXG5cclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoZXNJc0ZldGNoaW5nLFxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoZXMsXHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmIChsYW5nLm5hbWUgIT09IG5leHRQcm9wcy5sYW5nLm5hbWUpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzSXNGZXRjaGluZyAmJiAhbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hlcycsXHJcbiAgICAgICAgICAgICAgICBjYjogKCkgPT4gZmV0Y2hNYXRjaGVzKCksXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAoKSA9PiBSRUZSRVNIX1RJTUVPVVQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50V2lsbFVubW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmNsZWFyQXBwVGltZW91dCh7IG5hbWU6ICdmZXRjaE1hdGNoZXMnIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgZGF0YUVycm9yLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgeyhkYXRhRXJyb3IpID8gPHByZSBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWRhbmdlcic+e2RhdGFFcnJvci50b1N0cmluZygpfTwvcHJlPiA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIG1hdGNoZXMgKi99XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbikgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS0xMicga2V5PXtyZWdpb24uaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hdGNoZXMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7Lyogd29ybGRzICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxXb3JsZHMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk92ZXJ2aWV3ID0gY29ubmVjdChcclxuICAvLyBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKE92ZXJ2aWV3KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgY29uc3QgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcbiAgICBpZiAobGFuZy5zbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUuam9pbignIC0gJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJ2aWV3O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5cclxuXHJcblxyXG5jb25zdCBzcGlubmVyID0gPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nPjwvaT47XHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcbmNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcbmNvbnN0IGd1aWxkSWRTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmd1aWxkSWQ7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgZ3VpbGRJZFNlbGVjdG9yLFxyXG4gICAgKGd1aWxkcywgZ3VpbGRJZCkgPT4gKHtcclxuICAgICAgICBndWlsZElkLFxyXG4gICAgICAgIGd1aWxkOiBndWlsZHMuZ2V0KGd1aWxkSWQpLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIGlmIChwcm9wcy5ndWlsZElkID09PSAnQzQxNjg2REQtQTIwMS1FNDExLTg2M0MtRTQxMTVCREY0ODFEJykge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKHByb3BzLmd1aWxkSWQsIHN0YXRlLmd1aWxkc1twcm9wcy5ndWlsZElkXSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBndWlsZDogc3RhdGUuZ3VpbGRzW3Byb3BzLmd1aWxkSWRdLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBndWlsZElkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGd1aWxkIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5ndWlsZC5lcXVhbHMobmV4dFByb3BzLmd1aWxkKTtcclxuICAgIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZ3VpbGQgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0cmFja2VyOjpndWlsZHM6OnJlbmRlcicsIGd1aWxkLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGhyZWY9e2BodHRwczovL2d1aWxkcy5ndzJ3MncuY29tLyR7Z3VpbGQuZ2V0KCdpZCcpfWB9IGlkPXtndWlsZC5nZXQoJ2lkJyl9PlxyXG4gICAgICAgICAgICAgICAgPEVtYmxlbSBrZXk9e2d1aWxkLmdldCgnaWQnKX0gZ3VpbGRJZD17Z3VpbGQuZ2V0KCdpZCcpfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXY+e1xyXG4gICAgICAgICAgICAgICAgICAgICghZ3VpbGQuZ2V0KCdsb2FkaW5nJykpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz57Z3VpbGQuZ2V0KCduYW1lJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLXRhZyc+e2d1aWxkLmdldCgndGFnJykgPyBgIFske2d1aWxkLmdldCgndGFnJyl9XWAgOiBudWxsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBzcGlubmVyXHJcbiAgICAgICAgICAgICAgICB9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuR3VpbGQucHJvcFR5cGVzID0ge1xyXG4gICAgZ3VpbGQgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLFxyXG59O1xyXG5cclxuR3VpbGQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKEd1aWxkKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3VpbGQ7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCBHdWlsZCBmcm9tICcuL0d1aWxkJztcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVzZWxlY3QgSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5cclxuY29uc3QgZ3VpbGRzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmd1aWxkcztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuXHJcblxyXG5jb25zdCBtYXRjaEd1aWxkSWRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIG1hdGNoRGV0YWlsc1NlbGVjdG9yLFxyXG4gICAgKG1hdGNoRGV0YWlscykgPT4gKEltbXV0YWJsZS5NYXAuaXNNYXAobWF0Y2hEZXRhaWxzKSAmJiBtYXRjaERldGFpbHMuaGFzKCdndWlsZElkcycpKVxyXG4gICAgICAgID8gbWF0Y2hEZXRhaWxzLmdldCgnZ3VpbGRJZHMnKVxyXG4gICAgICAgIDogSW1tdXRhYmxlLkxpc3QoKVxyXG4pO1xyXG5cclxuXHJcbmNvbnN0IG1hdGNoR3VpbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hHdWlsZElkc1NlbGVjdG9yLFxyXG4gICAgKGd1aWxkcywgZ3VpbGRJZHMpID0+IGd1aWxkcy5maWx0ZXIoZyA9PiBndWlsZElkcy5pbmNsdWRlcyhnLmdldCgnaWQnKSkpXHJcbik7XHJcblxyXG5jb25zdCBzb3J0ZWRHdWlsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hHdWlsZHNTZWxlY3RvcixcclxuICAgIChndWlsZHNVbnNvcnRlZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGd1aWxkcyA9IGd1aWxkc1Vuc29ydGVkXHJcbiAgICAgICAgICAgIC5zb3J0QnkoZyA9PiBnLmdldCgnaWQnKSlcclxuICAgICAgICAgICAgLnNvcnRCeShnID0+IGcuZ2V0KCduYW1lJykpXHJcbiAgICAgICAgICAgIC5tYXAoZyA9PiBnLmdldCgnaWQnKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IGd1aWxkcyB9O1xyXG4gICAgfVxyXG4pO1xyXG5cclxuLy8gY29uc3Qgc29ydGVkR3VpbGRJZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4vLyAgICAgc29ydGVkR3VpbGRzU2VsZWN0b3IsXHJcbi8vICAgICAodW5zb3J0ZWRHdWlsZHMpID0+IHtcclxuLy8gICAgICAgICByZXR1cm4geyBndWlsZHM6IHVuc29ydGVkR3VpbGRzLm1hcChnID0+IGcuZ2V0KCdpZCcpKS50b0xpc3QoKSB9O1xyXG4vLyAgICAgfVxyXG4vLyApO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBXcmFwcGVyID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0yNCc+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcbmNsYXNzIEd1aWxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGd1aWxkcyA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5ndWlsZHMuZXF1YWxzKG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGd1aWxkcyxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyYWNrZXI6Omd1aWxkczo6cmVuZGVyJy8qLCBndWlsZHMudG9KUygpKi8pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8V3JhcHBlcj5cclxuICAgICAgICAgICAgICAgIDx1bCBpZD0nZ3VpbGRzJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHtndWlsZHMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2d1aWxkSWR9IGNsYXNzTmFtZT0nZ3VpbGQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEd1aWxkIGd1aWxkSWQ9e2d1aWxkSWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvV3JhcHBlcj5cclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxufTtcclxuR3VpbGRzID0gY29ubmVjdChcclxuICBzb3J0ZWRHdWlsZHNTZWxlY3RvclxyXG4pKEd1aWxkcyk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3VpbGRzOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IsXHJcbiAgICBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzLFxyXG59IGZyb20gJ2xpYi9yZWR1eEhlbHBlcnMnO1xyXG5cclxuLy8gaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcblxyXG5pbXBvcnQgRW50cnkgZnJvbSAnLi9FbnRyeSc7XHJcblxyXG5cclxuXHJcbmNvbnN0IG9iamVjdGl2ZXNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUub2JqZWN0aXZlcztcclxuXHJcbmNvbnN0IHNvcnRlZE9iamVjdGl2ZXNTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgb2JqZWN0aXZlc1NlbGVjdG9yLFxyXG4gICAgKG9iamVjdGl2ZXMpID0+IG9iamVjdGl2ZXNcclxuICAgICAgICAuc29ydEJ5KG8gPT4gLW8uZ2V0KCdsYXN0RmxpcHBlZCcpKVxyXG4gICAgICAgIC5rZXlTZXEoKVxyXG4pO1xyXG5cclxuLy8gY29uc3Qgb2JqZWN0aXZlSWRzU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuLy8gICAgIHNvcnRlZE9iamVjdGl2ZXNTZWxlY3RvcixcclxuLy8gICAgIChvYmplY3RpdmVzKSA9PiBvYmplY3RpdmVzLmtleVNlcSgpXHJcbi8vICk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzKHtcclxuICAgIG9iamVjdGl2ZXM6IHNvcnRlZE9iamVjdGl2ZXNTZWxlY3RvcixcclxufSk7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICAvLyBjb25zdCBlbnRyaWVzID0gXy5jaGFpbihwcm9wcy5sb2cpXHJcbi8vICAgICAvLyAgICAgLmZpbHRlcihlbnRyeSA9PiBieVR5cGUocHJvcHMudHlwZUZpbHRlciwgZW50cnkpKVxyXG4vLyAgICAgLy8gICAgIC5maWx0ZXIoZW50cnkgPT4gYnlNYXBJZChwcm9wcy5tYXBGaWx0ZXIsIGVudHJ5KSlcclxuLy8gICAgIC8vICAgICAudmFsdWUoKTtcclxuXHJcbi8vICAgICBjb25zdCBvYmplY3RpdmVzID0gc3RhdGUub2JqZWN0aXZlcy5zb3J0QnkobyA9PiAtby5nZXQoJ2xhc3RGbGlwcGVkJykpO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgb2JqZWN0aXZlcyxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuY2xhc3MgRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIG9iamVjdGl2ZXMgOiBJbW11dGFibGVQcm9wVHlwZXMuc2VxLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIC8vIG5vdyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKG1vbWVudCkuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXBGaWx0ZXIgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgdHlwZUZpbHRlciA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvYmplY3RpdmVzLFxyXG5cclxuICAgICAgICAgICAgbWFwRmlsdGVyLFxyXG4gICAgICAgICAgICB0eXBlRmlsdGVyLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gIW9iamVjdGl2ZXMuZXF1YWxzKG5leHRQcm9wcy5vYmplY3RpdmVzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9iamVjdGl2ZXMsXHJcbiAgICAgICAgICAgIG1hcEZpbHRlcixcclxuICAgICAgICAgICAgdHlwZUZpbHRlcixcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPG9sIGlkPSdsb2cnIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgICAgICB7b2JqZWN0aXZlcy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPT5cclxuICAgICAgICAgICAgICAgICAgICA8RW50cnkga2V5PXtpZH0gaWQ9e2lkfSAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5FbnRyaWVzID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShFbnRyaWVzKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgbWFwSWQgPSBvYmplY3RpdmUuaWQuc3BsaXQoJy0nKVswXTtcclxuICAgIHJldHVybiBfLmZpbmQoU1RBVElDLm1hcHNNZXRhLCBtbSA9PiBtbS5pZCA9PSBtYXBJZCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdHlwZUZpbHRlcltlbnRyeS50eXBlXTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgaWYgKG1hcEZpbHRlcikge1xyXG4gICAgICAgIHJldHVybiBlbnRyeS5tYXBJZCA9PT0gbWFwRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW50cmllczsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG4vLyBpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yLFxyXG4gICAgbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyxcclxufSBmcm9tICdsaWIvcmVkdXhIZWxwZXJzJztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5pbXBvcnQgT2JqZWN0aXZlTmFtZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9vYmplY3RpdmVzL05hbWUnO1xyXG5pbXBvcnQgT2JqZWN0aXZlQXJyb3cgZnJvbSAnY29tcG9uZW50cy9jb21tb24vb2JqZWN0aXZlcy9BcnJvdyc7XHJcblxyXG5pbXBvcnQgRW1ibGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcbi8vIGltcG9ydCBTcHJpdGUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvU3ByaXRlJztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBSZWR1eCAvIFJlc2VsZWN0XHJcbiovXHJcblxyXG5jb25zdCBvYmplY3RpdmVJZFNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMuaWQ7XHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IG5vd1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ub3c7XHJcbmNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcbmNvbnN0IG9iamVjdGl2ZXNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUub2JqZWN0aXZlcztcclxuXHJcbmNvbnN0IG9iamVjdGl2ZVNlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBvYmplY3RpdmVJZFNlbGVjdG9yLFxyXG4gICAgb2JqZWN0aXZlc1NlbGVjdG9yLFxyXG4gICAgKGlkLCBvYmplY3RpdmVzKSA9PiBvYmplY3RpdmVzLmdldChpZClcclxuKTtcclxuXHJcbmNvbnN0IGhhc0J1ZmZTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbm93U2VsZWN0b3IsXHJcbiAgICBvYmplY3RpdmVTZWxlY3RvcixcclxuICAgIChub3csIG9iamVjdGl2ZSkgPT4gKG9iamVjdGl2ZS5nZXQoJ2V4cGlyZXMnKS5kaWZmKCkgPiAtMjAwMClcclxuKTtcclxuXHJcbmNvbnN0IGd1aWxkSWRTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgb2JqZWN0aXZlU2VsZWN0b3IsXHJcbiAgICAob2JqZWN0aXZlKSA9PiBvYmplY3RpdmUuZ2V0KCdndWlsZCcpXHJcbik7XHJcblxyXG5jb25zdCBndWlsZFNlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBndWlsZHNTZWxlY3RvcixcclxuICAgIGd1aWxkSWRTZWxlY3RvcixcclxuICAgIChndWlsZHMsIGd1aWxkSWQpID0+IGd1aWxkcy5nZXQoZ3VpbGRJZCwgSW1tdXRhYmxlLk1hcCgpKVxyXG4pO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyh7XHJcbiAgICBndWlsZDogZ3VpbGRTZWxlY3RvcixcclxuICAgIGhhc0J1ZmY6IGhhc0J1ZmZTZWxlY3RvcixcclxuICAgIGlkOiBvYmplY3RpdmVJZFNlbGVjdG9yLFxyXG4gICAgbGFuZzogbGFuZ1NlbGVjdG9yLFxyXG4gICAgbm93OiBub3dTZWxlY3RvcixcclxuICAgIG9iamVjdGl2ZTogb2JqZWN0aXZlU2VsZWN0b3IsXHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBDb21wb25lbnRcclxuKi9cclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgaGFzQnVmZiA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgaWQgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZyA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBub3cgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgb2JqZWN0aXZlIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBndWlsZCA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgICAgZ3VpbGRJZCA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgaGFzQnVmZixcclxuICAgICAgICAgICAgZ3VpbGQsXHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG9iamVjdGl2ZSxcclxuICAgICAgICAgICAgbm93LFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcbiAgICAgICAgICAgIChoYXNCdWZmICYmICFub3cuaXNTYW1lKG5leHRQcm9wcy5ub3cpKVxyXG4gICAgICAgICAgICB8fCAhZ3VpbGQuZXF1YWxzKG5leHRQcm9wcy5ndWlsZClcclxuICAgICAgICAgICAgfHwgIWxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICAgICB8fCAhb2JqZWN0aXZlLmVxdWFscyhuZXh0UHJvcHMub2JqZWN0aXZlKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICAvLyBoYXNCdWZmLFxyXG4gICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgbm93LFxyXG4gICAgICAgICAgICBvYmplY3RpdmUsXHJcbiAgICAgICAgICAgIGd1aWxkLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBjb25zdCBsYXN0RmxpcHBlZCA9IG9iamVjdGl2ZS5nZXQoJ2xhc3RGbGlwcGVkJyk7XHJcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG9iamVjdGl2ZS5nZXQoJ2V4cGlyZXMnKTtcclxuICAgICAgICAvLyBjb25zdCBsYXN0Q2xhaW1lZCA9IG9iamVjdGl2ZS5nZXQoJ2xhc3RDbGFpbWVkJyk7XHJcbiAgICAgICAgLy8gY29uc3QgbGFzdG1vZCA9IG9iamVjdGl2ZS5nZXQoJ2xhc3Rtb2QnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17YHRlYW0gJHsgb2JqZWN0aXZlLmdldCgnb3duZXInKSB9YH0+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkIGxvZy1vYmplY3RpdmUnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1leHBpcmUnPjxUaW1lUmVtYWluaW5nIGV4cGlyZXM9e2V4cGlyZXN9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctdGltZSc+PFRpbWVTdGFtcCB0aW1lPXtsYXN0RmxpcHBlZH0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1nZW8nPjxPYmplY3RpdmVBcnJvdyBpZD17aWR9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctc3ByaXRlJz48T2JqZWN0aXZlSWNvbiBjb2xvcj17b2JqZWN0aXZlLmdldCgnb3duZXInKX0gdHlwZT17b2JqZWN0aXZlLmdldCgndHlwZScpfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLW5hbWUnPjxPYmplY3RpdmVOYW1lIGlkPXtpZH0gbGFuZz17bGFuZ30gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1ndWlsZCc+PE9iamVjdGl2ZUd1aWxkIG9iamVjdGl2ZT17b2JqZWN0aXZlfSBndWlsZD17Z3VpbGR9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbkVudHJ5ID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShFbnRyeSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IFRpbWVSZW1haW5pbmcgPSAoeyBleHBpcmVzIH0pID0+IChcclxuICAgIDxzcGFuPntcclxuICAgICAgICBleHBpcmVzLmlzQWZ0ZXIoKVxyXG4gICAgICAgICAgICA/IG1vbWVudChleHBpcmVzLmRpZmYoRGF0ZS5ub3coKSwgJ21pbGxpc2Vjb25kcycpKS5mb3JtYXQoJ206c3MnKVxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgIH08L3NwYW4+XHJcbik7XHJcblxyXG5jb25zdCBUaW1lU3RhbXAgPSAoeyB0aW1lLCBtYXhBZ2UgPSAxIH0pID0+IChcclxuICAgIDxzcGFuPntcclxuICAgICAgICAobW9tZW50KCkuZGlmZih0aW1lLCAnaG91cnMnKSA8IG1heEFnZSlcclxuICAgICAgICAgICAgPyB0aW1lLmZvcm1hdCgnaGg6bW06c3MnKVxyXG4gICAgICAgICAgICA6IHRpbWUuZnJvbU5vdyh0cnVlKVxyXG4gICAgfTwvc3Bhbj5cclxuKTtcclxuXHJcbmNvbnN0IE9iamVjdGl2ZUd1aWxkID0gKHsgb2JqZWN0aXZlLCBndWlsZCB9KSA9PiAoXHJcbiAgICA8c3Bhbj57XHJcbiAgICAgICAgKG9iamVjdGl2ZS5nZXQoJ2d1aWxkJykpXHJcbiAgICAgICAgICAgID8gPGEgaHJlZj17JyMnICsgb2JqZWN0aXZlLmdldCgnZ3VpbGQnKX0+XHJcbiAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkSWQ9e29iamVjdGl2ZS5nZXQoJ2d1aWxkJyl9IC8+XHJcbiAgICAgICAgICAgICAgICB7Z3VpbGQgPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGQuZ2V0KCduYW1lJyl9IDwvc3Bhbj4gOiAgbnVsbH1cclxuICAgICAgICAgICAgICAgIHtndWlsZCA/IDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtdGFnJz4gW3tndWlsZC5nZXQoJ3RhZycpfV0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDogbnVsbFxyXG4gICAgfTwvc3Bhbj5cclxuKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgbWFwSWQgPSBvYmplY3RpdmUuaWQuc3BsaXQoJy0nKVswXTtcclxuICAgIHJldHVybiBfLmZpbmQoU1RBVElDLm1hcHNNZXRhLCBtbSA9PiBtbS5pZCA9PSBtYXBJZCk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnRyeTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG4vLyBpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yLFxyXG4gICAgbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyxcclxufSBmcm9tICdsaWIvcmVkdXhIZWxwZXJzJztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5pbXBvcnQgKiBhcyBsb2dGaWx0ZXJBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbG9nRmlsdGVycyc7XHJcblxyXG5cclxuY29uc3QgbG9nRmlsdGVyc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sb2dGaWx0ZXJzO1xyXG5cclxuY29uc3QgbWFwRmlsdGVyc1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBsb2dGaWx0ZXJzU2VsZWN0b3IsXHJcbiAgICAobG9nRmlsdGVycykgPT4gbG9nRmlsdGVycy5nZXQoJ21hcHMnKVxyXG4pO1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlVHlwZUZpbHRlcnNTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbG9nRmlsdGVyc1NlbGVjdG9yLFxyXG4gICAgKGxvZ0ZpbHRlcnMpID0+IGxvZ0ZpbHRlcnMuZ2V0KCdvYmplY3RpdmVUeXBlcycpXHJcbik7XHJcblxyXG4vLyBjb25zdCBldmVudFR5cGVGaWx0ZXJzU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuLy8gICAgIGxvZ0ZpbHRlcnNTZWxlY3RvcixcclxuLy8gICAgIChsb2dGaWx0ZXJzKSA9PiBsb2dGaWx0ZXJzLmdldCgnZXZlbnRUeXBlcycpXHJcbi8vICk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzKHtcclxuICAgIG1hcEZpbHRlcnM6IG1hcEZpbHRlcnNTZWxlY3RvcixcclxuICAgIG9iamVjdGl2ZVR5cGVGaWx0ZXJzOiBvYmplY3RpdmVUeXBlRmlsdGVyc1NlbGVjdG9yLFxyXG4gICAgLy8gZXZlbnRUeXBlRmlsdGVyczogZXZlbnRUeXBlRmlsdGVyc1NlbGVjdG9yLFxyXG59KTtcclxuXHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdG9nZ2xlTWFwOiAobWFwSWQpID0+IGRpc3BhdGNoKGxvZ0ZpbHRlckFjdGlvbnMudG9nZ2xlTWFwKHsgbWFwSWQgfSkpLFxyXG4gICAgICAgIHRvZ2dsZU9iamVjdGl2ZVR5cGU6IChvYmplY3RpdmVUeXBlKSA9PiBkaXNwYXRjaChsb2dGaWx0ZXJBY3Rpb25zLnRvZ2dsZU9iamVjdGl2ZVR5cGUoeyBvYmplY3RpdmVUeXBlIH0pKSxcclxuICAgICAgICAvLyB0b2dnbGVFdmVudFR5cGU6IChldmVudFR5cGUpID0+IGRpc3BhdGNoKGxvZ0ZpbHRlckFjdGlvbnMudG9nZ2xlRXZlbnRUeXBlKHsgZXZlbnRUeXBlIH0pKSxcclxuICAgIH07XHJcbn07XHJcblxyXG5jbGFzcyBUYWJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbWFwRmlsdGVycyA6IEltbXV0YWJsZVByb3BUeXBlcy5zZXQuaXNSZXF1aXJlZCxcclxuICAgICAgICBvYmplY3RpdmVUeXBlRmlsdGVycyA6IEltbXV0YWJsZVByb3BUeXBlcy5zZXQuaXNSZXF1aXJlZCxcclxuXHJcbiAgICAgICAgdG9nZ2xlTWFwOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHRvZ2dsZU9iamVjdGl2ZVR5cGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcbiAgICAgICAgICAgICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXBGaWx0ZXJzLCBuZXh0UHJvcHMubWFwRmlsdGVycylcclxuICAgICAgICAgICAgfHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm9iamVjdGl2ZVR5cGVGaWx0ZXJzLCBuZXh0UHJvcHMub2JqZWN0aXZlVHlwZUZpbHRlcnMpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RyYWNrZXI6OmxvZ3M6OnRhYnM6OnNob3VsZFVwZGF0ZScsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVycyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlVHlwZUZpbHRlcnMsXHJcbiAgICAgICAgICAgIC8vIGV2ZW50VHlwZUZpbHRlcnNTZWxlY3RvcixcclxuXHJcbiAgICAgICAgICAgIHRvZ2dsZU1hcCxcclxuICAgICAgICAgICAgdG9nZ2xlT2JqZWN0aXZlVHlwZSxcclxuICAgICAgICAgICAgLy8gdG9nZ2xlRXZlbnRUeXBlLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnU1RBVElDLm1hcHNNZXRhJywgU1RBVElDLm1hcHNNZXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0nbG9nLXRhYnMnIGNsYXNzTmFtZT0nZmxleC10YWJzJz5cclxuXHJcbiAgICAgICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgU1RBVElDLm1hcHNNZXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIChtYXBNZXRhKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXBUYWJcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXttYXBNZXRhLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZD17bWFwTWV0YS5hYmJyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD17bWFwTWV0YS5hYmJyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXJzPXttYXBGaWx0ZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17bWFwTWV0YS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVNYXB9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIFsnY2FzdGxlJywgJ2tlZXAnLCAndG93ZXInLCAnY2FtcCddLFxyXG4gICAgICAgICAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlVGFiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlVHlwZT17dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlVHlwZUZpbHRlcnM9e29iamVjdGl2ZVR5cGVGaWx0ZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVPYmplY3RpdmVUeXBlfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5UYWJzID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXHJcbikoVGFicyk7XHJcblxyXG5cclxuY29uc3QgTWFwVGFiID0gKHtcclxuICAgIGlkLFxyXG4gICAgbGFiZWwsXHJcbiAgICBtYXBGaWx0ZXJzLFxyXG4gICAgb25DbGljayxcclxuICAgIHRpdGxlLFxyXG59KSA9PiAoXHJcbiAgICA8YVxyXG4gICAgICAgIHRpdGxlPXt0aXRsZX1cclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoeyB0YWI6IHRydWUsIGFjdGl2ZTogbWFwRmlsdGVycy5oYXMoaWQpIH0pfVxyXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2xpY2soaWQpfVxyXG4gICAgPlxyXG4gICAgICAgIHtsYWJlbH1cclxuICAgIDwvYT5cclxuKTtcclxuXHJcblxyXG5jb25zdCBPYmplY3RpdmVUYWIgPSAoe1xyXG4gICAgb2JqZWN0aXZlVHlwZSxcclxuICAgIG9iamVjdGl2ZVR5cGVGaWx0ZXJzLFxyXG4gICAgb25DbGljayxcclxufSkgPT4gKFxyXG4gICAgPGFcclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICBjaGVjazogdHJ1ZSxcclxuICAgICAgICAgICAgYWN0aXZlOiBvYmplY3RpdmVUeXBlRmlsdGVycy5oYXMob2JqZWN0aXZlVHlwZSksXHJcbiAgICAgICAgICAgIGZpcnN0OiBvYmplY3RpdmVUeXBlID09PSAnY2FzdGxlJyxcclxuICAgICAgICB9KX1cclxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG9iamVjdGl2ZVR5cGUpfVxyXG4gICAgPlxyXG5cclxuICAgICAgICA8T2JqZWN0aXZlSWNvbiB0eXBlPXtvYmplY3RpdmVUeXBlfSBzaXplPXsxOH0gLz5cclxuXHJcbiAgICA8L2E+XHJcbik7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYnM7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuLy8gaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCB7IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yIH0gZnJvbSAnbGliL3JlZHV4JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5cclxuaW1wb3J0IEVudHJpZXMgZnJvbSAnLi9FbnRyaWVzJztcclxuaW1wb3J0IFRhYnMgZnJvbSAnLi9UYWJzJztcclxuXHJcblxyXG5jb25zdCBvYmplY3RpdmVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm9iamVjdGl2ZXM7XHJcbmNvbnN0IG1hcHNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubWF0Y2hEZXRhaWxzLmdldCgnbWFwcycpO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBtYXBzU2VsZWN0b3IsXHJcbiAgICBvYmplY3RpdmVzU2VsZWN0b3IsXHJcbiAgICAobWFwcywgb2JqZWN0aXZlcykgPT4gKHsgbWFwcywgb2JqZWN0aXZlcyB9KVxyXG4pO1xyXG5cclxuXHJcbmNsYXNzIExvZ0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIG1hcHM6IEltbXV0YWJsZVByb3BUeXBlcy5saXN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgb2JqZWN0aXZlczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXBGaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgICB0eXBlRmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjYXN0bGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBrZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdG93ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW1wOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBtYXBzLFxyXG4gICAgICAgICAgICBvYmplY3RpdmVzLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMjQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2xvZy1jb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFic1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcz17bWFwc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlcj17dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlTWFwRmlsdGVyQ2xpY2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVR5cGVGaWx0ZXJDbGljaz17dGhpcy5oYW5kbGVUeXBlRmlsdGVyQ2xpY2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlcj17dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrKG1hcEZpbHRlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXQgbWFwRmlsdGVyJywgbWFwRmlsdGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1hcEZpbHRlciB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2sodG9nZ2xlVHlwZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUgdHlwZUZpbHRlcicsIHRvZ2dsZVR5cGUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXSA9ICFzdGF0ZS50eXBlRmlsdGVyW3RvZ2dsZVR5cGVdO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkxvZ0NvbnRhaW5lciA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4pKExvZ0NvbnRhaW5lcik7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9nQ29udGFpbmVyOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IE9iamVjdGl2ZSBmcm9tICcuL09iamVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaE1hcCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWFwLXNlY3Rpb25zJz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgZ2V0TWFwT2JqZWN0aXZlc01ldGEobWF0Y2hNYXAuaWQpLFxyXG4gICAgICAgICAgICAgICAgKHNlY3Rpb24sIGl4KSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICdtYXAtc2VjdGlvbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29sbzogc2VjdGlvbi5sZW5ndGggPT09IDEsXHJcbiAgICAgICAgICAgICAgICB9KX0ga2V5PXtpeH0+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZ2VvKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2dlby5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtnZW8uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e2d1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e2xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb249e2dlby5kaXJlY3Rpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaE1hcD17bWF0Y2hNYXB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3c9e25vd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBPYmplY3RpdmVzTWV0YShtYXBJZCkge1xyXG4gICAgbGV0IG1hcENvZGUgPSAnYmwyJztcclxuXHJcbiAgICBpZiAobWFwSWQgPT09IDM4KSB7XHJcbiAgICAgICAgbWFwQ29kZSA9ICdlYic7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF9cclxuICAgICAgICAuY2hhaW4oU1RBVElDLm9iamVjdGl2ZXNNZXRhKVxyXG4gICAgICAgIC5jbG9uZURlZXAoKVxyXG4gICAgICAgIC5maWx0ZXIob20gPT4gb20ubWFwID09PSBtYXBDb2RlKVxyXG4gICAgICAgIC5ncm91cEJ5KG9tID0+IG9tLmdyb3VwKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgRW1ibGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcbmltcG9ydCBBcnJvdyBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9BcnJvdyc7XHJcbmltcG9ydCBPYmplY3RpdmVJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL09iamVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGlkLFxyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGRpcmVjdGlvbixcclxuICAgIG1hdGNoTWFwLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcbiAgICBjb25zdCBvYmplY3RpdmVJZCA9IGAke21hdGNoTWFwLmlkfS0ke2lkfWA7XHJcbiAgICBjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVzW29iamVjdGl2ZUlkXTtcclxuICAgIGNvbnN0IG1vID0gXy5maW5kKG1hdGNoTWFwLm9iamVjdGl2ZXMsIG8gPT4gby5pZCA9PT0gb2JqZWN0aXZlSWQpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDx1bCBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAnbGlzdC11bnN0eWxlZCc6IHRydWUsXHJcbiAgICAgICAgICAgICd0cmFjay1vYmplY3RpdmUnOiB0cnVlLFxyXG4gICAgICAgICAgICBmcmVzaDogbm93LmRpZmYobW8ubGFzdEZsaXBwZWQsICdzZWNvbmRzJykgPCAzMCxcclxuICAgICAgICAgICAgZXhwaXJpbmc6IG1vLmV4cGlyZXMuaXNBZnRlcihub3cpICYmIG1vLmV4cGlyZXMuZGlmZihub3csICdzZWNvbmRzJykgPCAzMCxcclxuICAgICAgICAgICAgZXhwaXJlZDogbm93LmlzQWZ0ZXIobW8uZXhwaXJlcyksXHJcbiAgICAgICAgICAgIGFjdGl2ZTogbm93LmlzQmVmb3JlKG1vLmV4cGlyZXMpLFxyXG4gICAgICAgIH0pfT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGVmdCc+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLWdlbyc+PEFycm93IGRpcmVjdGlvbj17ZGlyZWN0aW9ufSAvPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stc3ByaXRlJz48T2JqZWN0aXZlSWNvbiBjb2xvcj17bW8ub3duZXJ9IHR5cGU9e21vLnR5cGV9IC8+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1uYW1lJz57b01ldGEubmFtZVtsYW5nLnNsdWddfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0ncmlnaHQnPlxyXG4gICAgICAgICAgICAgICAge21vLmd1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3RyYWNrLWd1aWxkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXsnIycgKyBtby5ndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2d1aWxkc1ttby5ndWlsZF0gPyBgJHtndWlsZHNbbW8uZ3VpbGRdLm5hbWV9IFske2d1aWxkc1ttby5ndWlsZF0udGFnfV1gIDogJ0xvYWRpbmcuLi4nfVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXttby5ndWlsZH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1leHBpcmUnPlxyXG4gICAgICAgICAgICAgICAgICAgIHttby5leHBpcmVzLmlzQWZ0ZXIobm93KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG1vbWVudChtby5leHBpcmVzLmRpZmYobm93LCAnbWlsbGlzZWNvbmRzJykpLmZvcm1hdCgnbTpzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgKTtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBNYXRjaE1hcCBmcm9tICcuL01hdGNoTWFwJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIG1hdGNoLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcblxyXG4gICAgaWYgKF8uaXNFbXB0eShtYXRjaCkpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYXBzID0gXy5rZXlCeShtYXRjaC5tYXBzLCAnaWQnKTtcclxuICAgIGNvbnN0IGN1cnJlbnRNYXBJZHMgPSBfLmtleXMobWFwcyk7XHJcbiAgICBjb25zdCBtYXBzTWV0YUFjdGl2ZSA9IF8uZmlsdGVyKFxyXG4gICAgICAgIFNUQVRJQy5tYXBzTWV0YSxcclxuICAgICAgICBtYXBNZXRhID0+IF8uaW5kZXhPZihjdXJyZW50TWFwSWRzLCBfLnBhcnNlSW50KG1hcE1ldGEuaWQpICE9PSAtMSlcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8c2VjdGlvbiBpZD0nbWFwcyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIG1hcHNNZXRhQWN0aXZlLFxyXG4gICAgICAgICAgICAgICAgKG1hcE1ldGEpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWFwJyBrZXk9e21hcE1ldGEuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj57bWFwTWV0YS5uYW1lfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoTWFwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17Z3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBNZXRhPXttYXBNZXRhfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaE1hcD17bWFwc1ttYXBNZXRhLmlkXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93PXtub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtNic+ezxNYXBEZXRhaWxzIG1hcEtleT0nQ2VudGVyJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdDZW50ZXInKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTE4Jz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdSZWRIb21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdSZWRIb21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nQmx1ZUhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0JsdWVIb21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nR3JlZW5Ib21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdHcmVlbkhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgKi8iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vSWNvbnMvU3ByaXRlJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBIb2xkaW5ncyA9ICh7XHJcbiAgICBjb2xvcixcclxuICAgIGhvbGRpbmdzLFxyXG59KSA9PiAoXHJcbiAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LWlubGluZSc+XHJcbiAgICAgICAge2hvbGRpbmdzLm1hcChcclxuICAgICAgICAgICAgKHR5cGVRdWFudGl0eSwgdHlwZUluZGV4KSA9PlxyXG4gICAgICAgICAgICA8bGkga2V5PXt0eXBlSW5kZXh9PlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB7dHlwZUluZGV4fVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0ge2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3F1YW50aXR5Jz54e3R5cGVRdWFudGl0eX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKX1cclxuICAgIDwvdWw+XHJcbik7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9sZGluZ3M7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IEhvbGRpbmdzIGZyb20gJy4vSG9sZGluZ3MnO1xyXG5cclxuXHJcbmltcG9ydCB7IHdvcmxkcyBhcyBzdGF0aWNXb3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuY29uc3QgU1RBVElDX1dPUkxEUyA9IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljV29ybGRzKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZ2JOdW0gPSBJbW11dGFibGUuTWFwKHsgcmVkOiAwLCBibHVlOiAwLCBncmVlbjogMCB9KTtcclxuXHJcbmNvbnN0IExvYWRpbmcgPSAoeyAgfSkgPT4gKFxyXG4gICAgPGgxIHN0eWxlPXt7IGhlaWdodDogJzEwMHB4JywgZm9udFNpemU6ICc1MHB4JywgbGluZUhlaWdodDogJzEwMHB4JyB9fT5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiByZWR1eCBoZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGNvbG9yU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5jb2xvcjtcclxuXHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuXHJcbmNvbnN0IHdvcmxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBtYXRjaERldGFpbHNTZWxlY3RvcixcclxuICAgIChtYXRjaERldGFpbHMpID0+IG1hdGNoRGV0YWlscy5nZXQoJ3dvcmxkcycpXHJcbik7XHJcblxyXG5jb25zdCB3b3JsZElkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICB3b3JsZHNTZWxlY3RvcixcclxuICAgIChjb2xvciwgd29ybGRzKSA9PiB3b3JsZHMuZ2V0KGNvbG9yKS50b1N0cmluZygpXHJcbik7XHJcblxyXG5jb25zdCB3b3JsZFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICB3b3JsZElkU2VsZWN0b3IsXHJcbiAgICAobGFuZywgd29ybGRJZCkgPT4gU1RBVElDX1dPUkxEUy5nZXRJbihcclxuICAgICAgICBbd29ybGRJZCwgbGFuZy5nZXQoJ3NsdWcnKV0sXHJcbiAgICAgICAgSW1tdXRhYmxlLk1hcCgpXHJcbiAgICApXHJcbik7XHJcblxyXG5jb25zdCBzdGF0c1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBtYXRjaERldGFpbHNTZWxlY3RvcixcclxuICAgIChtYXRjaERldGFpbHMpID0+IG1hdGNoRGV0YWlscy5nZXQoJ3N0YXRzJylcclxuKTtcclxuXHJcbmNvbnN0IHdvcmxkU3RhdHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgY29sb3JTZWxlY3RvcixcclxuICAgIHN0YXRzU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIHN0YXRzKSA9PiBJbW11dGFibGVcclxuICAgICAgICAuTWFwKHtcclxuICAgICAgICAgICAgZGVhdGhzOiB7fSxcclxuICAgICAgICAgICAga2lsbHM6IHt9LFxyXG4gICAgICAgICAgICBob2xkaW5nczoge30sXHJcbiAgICAgICAgICAgIHNjb3Jlczoge30sXHJcbiAgICAgICAgICAgIHRpY2tzOiB7fSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tYXAoKHYsIGtleSkgPT4gc3RhdHMuZ2V0SW4oW2tleSwgY29sb3JdKSlcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgY29sb3JTZWxlY3RvcixcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIHdvcmxkU3RhdHNTZWxlY3RvcixcclxuICAgIHdvcmxkU2VsZWN0b3IsXHJcbiAgICB3b3JsZElkU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIGxhbmcsIHN0YXRzLCB3b3JsZCwgd29ybGRJZCkgPT4gKHtcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIHN0YXRzLFxyXG4gICAgICAgIHdvcmxkLFxyXG4gICAgICAgIHdvcmxkSWQsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgY29uc3Qgd29ybGQgPSBJbW11dGFibGUuZnJvbUpTKFxyXG4vLyAgICAgICAgIChwcm9wcy53b3JsZElkKVxyXG4vLyAgICAgICAgICAgICA/IHdvcmxkc1twcm9wcy53b3JsZElkXVtzdGF0ZS5sYW5nLmdldCgnc2x1ZycpXVxyXG4vLyAgICAgICAgICAgICA6IHt9XHJcbi8vICAgICApO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgY29sb3I6IHByb3BzLmNvbG9yLFxyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgd29ybGRJZDogcHJvcHMud29ybGRJZCxcclxuLy8gICAgICAgICBzdGF0czogSW1tdXRhYmxlLk1hcCgpLFxyXG4vLyAgICAgICAgIHdvcmxkLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHN0YXRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHdvcmxkSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIHN0YXRzLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgIWxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICAgICB8fCAhc3RhdHMuZXF1YWxzKG5leHRQcm9wcy5zdGF0cylcclxuICAgICAgICAgICAgfHwgIXdvcmxkLmVxdWFscyhuZXh0UHJvcHMud29ybGQpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgc3RhdHMsXHJcbiAgICAgICAgICAgIHdvcmxkLFxyXG4gICAgICAgICAgICB3b3JsZElkLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY29sb3InLCBjb2xvcik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkSWQnLCB3b3JsZElkKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnd29ybGQnLCB3b3JsZC50b0pTKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0cycsIHN0YXRzLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHtjb2xvcn1gfT5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh3b3JsZC5oYXMoJ25hbWUnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPGEgaHJlZj17d29ybGQuZ2V0KCdsaW5rJyl9Pnt3b3JsZC5nZXQoJ25hbWUnKX08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJz48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgfTwvaDE+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N0YXRzJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBTY29yZSc+e251bWVyYWwoc3RhdHMuZ2V0KCdzY29yZXMnKSkuZm9ybWF0KCcwLDAnKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIFRpY2snPntudW1lcmFsKHN0YXRzLmdldCgndGlja3MnKSkuZm9ybWF0KCcrMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N1Yi1zdGF0cyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgS2lsbHMnPntudW1lcmFsKHN0YXRzLmdldCgna2lsbHMnKSkuZm9ybWF0KCcwLDAnKX1rPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBEZWF0aHMnPntudW1lcmFsKHN0YXRzLmdldCgnZGVhdGhzJykpLmZvcm1hdCgnMCwwJyl9ZDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPEhvbGRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGluZ3M9e3N0YXRzLmdldCgnaG9sZGluZ3MnKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuV29ybGQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKFdvcmxkKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiAoeyB3b3JsZHM6IHN0YXRlLm1hdGNoRGV0YWlscy5nZXQoJ3dvcmxkcycpIH0pO1xyXG5cclxuXHJcbmxldCBTY29yZWJvYXJkID0gKHtcclxuICAgIHdvcmxkcyxcclxufSkgPT4gIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdyb3cnIGlkPSdzY29yZWJvYXJkcyc+e1xyXG4gICAgICAgICAgICAoSW1tdXRhYmxlLk1hcC5pc01hcCh3b3JsZHMpKVxyXG4gICAgICAgICAgICA/IHdvcmxkcy5rZXlTZXEoKS5tYXAoXHJcbiAgICAgICAgICAgICAgICAoY29sb3IpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTgnIGtleT17Y29sb3J9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V29ybGQgY29sb3I9e2NvbG9yfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgIH08L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcCxcclxufTtcclxuXHJcblNjb3JlYm9hcmQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKFNjb3JlYm9hcmQpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIHByaXZhdGUgbWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZHNQcm9wcyhzdGF0cywgd29ybGRzKSB7XHJcbiAgICAvLyBjb25zdCB3b3JsZHNQcm9wcyA9IEltbXV0YWJsZS5mcm9tSlMoe1xyXG4gICAgLy8gICAgIHJlZDogeyBjb2xvcjogJ3JlZCcsIHdvcmxkOiB3b3JsZHMuZ2V0SW4oJ3JlZCcpLCBzdGF0czogZ2V0V29ybGRTdGF0cyhzdGF0cywgJ3JlZCcpIH0sXHJcbiAgICAvLyAgICAgYmx1ZTogeyBjb2xvcjogJ2JsdWUnLCB3b3JsZDogd29ybGRzLmdldEluKCdibHVlJyksIHN0YXRzOiBnZXRXb3JsZFN0YXRzKHN0YXRzLCAnYmx1ZScpIH0sXHJcbiAgICAvLyAgICAgZ3JlZW46IHsgY29sb3I6ICdncmVlbicsIHdvcmxkOiB3b3JsZHMuZ2V0SW4oJ2dyZWVuJyksIHN0YXRzOiAgZ2V0V29ybGRTdGF0cyhzdGF0cywgJ2dyZWVuJykgfSxcclxuICAgIC8vIH0pO1xyXG5cclxuICAgIGNvbnN0IGNvbG9ycyA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgIHJlZDoge30sXHJcbiAgICAgICAgYmx1ZToge30sXHJcbiAgICAgICAgZ3JlZW46IHt9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkcykpIHtcclxuICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHdvcmxkc1Byb3BzID0gY29sb3JzLm1hcChcclxuICAgICAgICAob2JqLCBjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvYmosIGNvbG9yLCB3b3JsZHMuZ2V0SW4oW2NvbG9yXSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKHtcclxuICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgd29ybGRJZDogd29ybGRzLmdldEluKFtjb2xvcl0pLFxyXG4gICAgICAgICAgICAgICAgc3RhdHM6IGdldFdvcmxkU3RhdHMoc3RhdHMsIGNvbG9yKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3dvcmxkc1Byb3BzJywgd29ybGRzUHJvcHMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ21hdGNoLndvcmxkcycsIG1hdGNoLndvcmxkcyk7XHJcblxyXG4gICAgLy8gaWYgKHdvcmxkcykge1xyXG4gICAgLy8gICAgIHdvcmxkcy5mb3JFYWNoKFxyXG4gICAgLy8gICAgICAgICAod29ybGRJZCwgY29sb3IpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIHdvcmxkc1Byb3BzLnNldEluKFtjb2xvciwgJ2lkJ10sIHdvcmxkSWQpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnd29ybGRzUHJvcHMnLCB3b3JsZHNQcm9wcyk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkc1Byb3BzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRTdGF0cyhzdGF0cywgY29sb3IpIHtcclxuICAgIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgICAgICBkZWF0aHM6IHN0YXRzLmdldEluKFsnZGVhdGhzJywgY29sb3JdLCAwKSxcclxuICAgICAgICBob2xkaW5nczogc3RhdHMuZ2V0SW4oWydob2xkaW5ncycsIGNvbG9yXSwgWzAsIDAsIDAsIDBdKSxcclxuICAgICAgICBraWxsczogc3RhdHMuZ2V0SW4oWydraWxscycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgc2NvcmU6IHN0YXRzLmdldEluKFsnc2NvcmVzJywgY29sb3JdLCAwKSxcclxuICAgICAgICB0aWNrOiBzdGF0cy5nZXRJbihbJ3RpY2tzJywgY29sb3JdLCAwKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBleHBvcnRcclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2NvcmVib2FyZDsiLCJcclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IsXHJcbiAgICBtYXBJbW11dGFibGVTZWxlY3RvcnNUb1Byb3BzLFxyXG59IGZyb20gJ2xpYi9yZWR1eEhlbHBlcnMnO1xyXG5cclxuLy8gaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBfIGZyb20nbG9kYXNoJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQgKiBhcyB0aW1lb3V0QWN0aW9ucyBmcm9tICdhY3Rpb25zL3RpbWVvdXRzJztcclxuaW1wb3J0ICogYXMgbm93QWN0aW9ucyBmcm9tICdhY3Rpb25zL25vdyc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqICAgRGF0YVxyXG4gKi9cclxuXHJcbi8vIGltcG9ydCBEQU8gZnJvbSAnbGliL2RhdGEvdHJhY2tlcic7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIFJlYWN0IENvbXBvbmVudHNcclxuICovXHJcblxyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL1Njb3JlYm9hcmQnO1xyXG5pbXBvcnQgTWFwcyBmcm9tICcuL01hcHMnO1xyXG5pbXBvcnQgTG9nIGZyb20gJy4vTG9nJztcclxuaW1wb3J0IEd1aWxkcyBmcm9tICcuL0d1aWxkcyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IE1BVENIX1JFRlJFU0ggPSBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApO1xyXG5jb25zdCBUSU1FX1JFRlJFU0ggPSAxMDAwIC8gMTtcclxuXHJcbi8vIGNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4gKFxyXG4vLyAgICAgPGgxIGlkPSdBcHBMb2FkaW5nJz5cclxuLy8gICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4vLyAgICAgPC9oMT5cclxuLy8gKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkLFxyXG4vLyAgICAgICAgIGd1aWxkczogc3RhdGUuZ3VpbGRzLFxyXG4vLyAgICAgICAgIC8vIHRpbWVvdXRzOiBzdGF0ZS50aW1lb3V0cyxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUud29ybGQ7XHJcbi8vIGNvbnN0IGFwaVNlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5hcGk7XHJcbi8vIGNvbnN0IG5vd1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ub3c7XHJcbi8vIGNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcblxyXG4vLyBjb25zdCBkZXRhaWxzSXNGZXRjaGluZ1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbi8vICAgICBhcGlTZWxlY3RvcixcclxuLy8gICAgIChhcGkpID0+IGFwaS5nZXQoJ3BlbmRpbmcnKS5pbmNsdWRlcygnbWF0Y2hEZXRhaWxzJylcclxuLy8gKTtcclxuXHJcbmNvbnN0IG1hdGNoRGV0YWlsc0xhc3RVcGRhdGVTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hEZXRhaWxzU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hEZXRhaWxzKSA9PiBtYXRjaERldGFpbHMuZ2V0KCdsYXN0VXBkYXRlJylcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMoe1xyXG4gICAgbGFuZzogbGFuZ1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hEZXRhaWxzTGFzdFVwZGF0ZTogbWF0Y2hEZXRhaWxzTGFzdFVwZGF0ZVNlbGVjdG9yLFxyXG4gICAgd29ybGQ6IHdvcmxkU2VsZWN0b3IsXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXROb3c6ICgpID0+IGRpc3BhdGNoKG5vd0FjdGlvbnMuc2V0Tm93KCkpLFxyXG5cclxuICAgICAgICBmZXRjaEd1aWxkQnlJZDogKGlkKSA9PiBkaXNwYXRjaChhcGlBY3Rpb25zLmZldGNoR3VpbGRCeUlkKGlkKSksXHJcbiAgICAgICAgZmV0Y2hNYXRjaERldGFpbHM6ICh3b3JsZElkKSA9PiBkaXNwYXRjaChhcGlBY3Rpb25zLmZldGNoTWF0Y2hEZXRhaWxzKHdvcmxkSWQpKSxcclxuXHJcbiAgICAgICAgc2V0QXBwVGltZW91dDogKHsgbmFtZSwgY2IsIHRpbWVvdXQgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuc2V0QXBwVGltZW91dCh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pKSxcclxuICAgICAgICBjbGVhckFwcFRpbWVvdXQ6ICh7IG5hbWUgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuXHJcbmNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcz17XHJcbiAgICAgICAgbGFuZyA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIC8vIGRldGFpbHNJc0ZldGNoaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoRGV0YWlsc0xhc3RVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyBndWlsZHMgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbWF0Y2hEZXRhaWxzIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXROb3c6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbm93OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIGZldGNoR3VpbGRCeUlkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXRBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGNsZWFyQXBwVGltZW91dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgd29ybGQsXHJcbiAgICAgICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpO1xyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzKHsgd29ybGQgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm93KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0QXBwVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWU6ICdzZXROb3cnLFxyXG4gICAgICAgICAgICBjYjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXROb3coKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVfUkVGUkVTSCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVHJhY2tlcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgICAgICAvLyBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuXHJcbiAgICAgICAgICAgIG1hdGNoRGV0YWlsc0xhc3RVcGRhdGUsXHJcblxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoRGV0YWlscyxcclxuICAgICAgICAgICAgc2V0QXBwVGltZW91dCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgaWYgKCFsYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykgfHwgd29ybGQuc2x1ZyAhPT0gbmV4dFByb3BzLndvcmxkLnNsdWcpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nLCBuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1hdGNoRGV0YWlsc0xhc3RVcGRhdGUgIT09IG5leHRQcm9wcy5tYXRjaERldGFpbHNMYXN0VXBkYXRlKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgIGNiOiAoKSA9PiBmZXRjaE1hdGNoRGV0YWlscyh7IHdvcmxkIH0pLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogKCkgPT4gTUFUQ0hfUkVGUkVTSCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICAgICAgLy8gfHwgdGhpcy5pc05ld1NlY29uZChuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld1NlY29uZChuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubm93LmlzU2FtZShuZXh0UHJvcHMubm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICghdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaERldGFpbHMnIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0ndHJhY2tlcic+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVib2FyZCAvPlxyXG4gICAgICAgICAgICAgICAgPExvZyAvPlxyXG4gICAgICAgICAgICAgICAgPEd1aWxkcyAvPlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB7LypcclxuICAgICAgICAgICAgICAgIHsobWF0Y2ggJiYgIV8uaXNFbXB0eShtYXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAqL31cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblRyYWNrZXIgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuICBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShUcmFja2VyKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBtb21lbnROb3coKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICogMTAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGROYW1lID0gd29ybGQubmFtZTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLmpvaW4oJyAtICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcbmNvbnN0IFBpZSA9ICh7IHNjb3JlcyB9KSA9PiAoXHJcbiAgICA8aW1nXHJcbiAgICAgICAgc3JjID0ge2dldEltYWdlU291cmNlKHNjb3Jlcyl9XHJcblxyXG4gICAgICAgIHdpZHRoID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAgICAgaGVpZ2h0ID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAvPlxyXG4pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEltYWdlU291cmNlKHNjb3Jlcykge1xyXG4gICAgcmV0dXJuIGBodHRwczpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLnJlZH0sJHtzY29yZXMuYmx1ZX0sJHtzY29yZXMuZ3JlZW59P3N0cm9rZVdpZHRoPSR7SU5TVEFOQ0Uuc3Ryb2tlfWA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBQaWU7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IFNwcml0ZSA9ICh7XHJcbiAgICBjb2xvcixcclxuICAgIHR5cGUsXHJcbn0pID0+IChcclxuICAgIDxzcGFuIGNsYXNzTmFtZSA9IHtgc3ByaXRlICR7dHlwZX0gJHtjb2xvcn1gfSAvPlxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3ByaXRlOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEFycm93ID0gKHsgZGlyZWN0aW9uIH0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBjb25zdCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmICghZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcnJvdzsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEVtYmxlbSA9ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbWJsZW07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gKHtcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxcclxuICAgIHR5cGUsXHJcbiAgICBzaXplLFxyXG59KSA9PiAoXHJcbiAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtnZXRTcmMoeyBjb2xvciwgdHlwZSB9KX1cclxuICAgICAgICBjbGFzc05hbWU9e2dldENsYXNzKHsgdHlwZSB9KX1cclxuICAgICAgICB3aWR0aD17c2l6ZSA/IHNpemUgOiBudWxsfVxyXG4gICAgICAgIGhlaWdodD17c2l6ZSA/IHNpemUgOiBudWxsfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U3JjKHsgY29sb3IsIHR5cGUgfSkge1xyXG4gICAgbGV0IHNyYyA9ICcvaW1nL2ljb25zL2Rpc3QvJztcclxuXHJcbiAgICBzcmMgKz0gdHlwZTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09ICdibGFjaycpIHtcclxuICAgICAgICBzcmMgKz0gJy0nICsgY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc3JjICs9ICcuc3ZnJztcclxuXHJcbiAgICByZXR1cm4gc3JjO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldENsYXNzKHsgdHlwZSB9KSB7XHJcbiAgICByZXR1cm4gYGljb24tb2JqZWN0aXZlIGljb24tb2JqZWN0aXZlLSR7dHlwZX1gO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdGl2ZTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IEFycm93SWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9BcnJvdyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IE9iamVjdGl2ZUFycm93ID0gKHtcclxuICAgIGlkLFxyXG59KSA9PiAoXHJcbiAgICA8QXJyb3dJY29uIGRpcmVjdGlvbj17IGdldE9iamVjdGl2ZURpcmVjdGlvbihpZCkgfSAvPlxyXG4pO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVEaXJlY3Rpb24oaWQpIHtcclxuICAgIGNvbnN0IGJhc2VJZCA9IGlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdGl2ZUFycm93OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IE9iamVjdGl2ZU5hbWUgPSAoe1xyXG4gICAgaWQsXHJcbiAgICBsYW5nLFxyXG59KSA9PiAoXHJcbiAgICA8c3Bhbj57U1RBVElDLm9iamVjdGl2ZXNbaWRdLm5hbWVbbGFuZy5nZXQoJ3NsdWcnKV19PC9zcGFuPlxyXG4pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmplY3RpdmVOYW1lOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQZXJmIGZyb20gJ3JlYWN0LWFkZG9ucy1wZXJmJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmZvcm1hbmNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIG9uU3RhcnQoKSB7XHJcbiAgICAgICAgUGVyZi5zdGFydCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQZXJmIHN0YXJ0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0b3AoKSB7XHJcbiAgICAgICAgUGVyZi5zdG9wKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1BlcmYgc3RvcHBlZCcpO1xyXG4gICAgICAgIGNvbnN0IGxhc3RNZWFzdXJlbWVudHMgPSBQZXJmLmdldExhc3RNZWFzdXJlbWVudHMoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmRpcihsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgICAgICAvLyBQZXJmLnByaW50RE9NKGxhc3RNZWFzdXJlbWVudHMpO1xyXG4gICAgICAgIFBlcmYucHJpbnRJbmNsdXNpdmUobGFzdE1lYXN1cmVtZW50cyk7XHJcbiAgICAgICAgUGVyZi5wcmludEV4Y2x1c2l2ZShsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgICAgICBQZXJmLnByaW50V2FzdGVkKGxhc3RNZWFzdXJlbWVudHMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPlBlcmZvcm1hbmNlOiA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5vblN0YXJ0fT5TdGFydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLm9uU3RvcH0+U3RvcDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIlxyXG4vKlxyXG4qICAgR2VuZXJpY1xyXG4qL1xyXG5cclxuLy8gcm91dGVzXHJcbmV4cG9ydCBjb25zdCBTRVRfUk9VVEUgPSAnU0VUX1JPVVRFJztcclxuXHJcbi8vIGxhbmdzXHJcbmV4cG9ydCBjb25zdCBTRVRfTEFORyA9ICdTRVRfTEFORyc7XHJcblxyXG4vLyB0aW1lb3V0c1xyXG5leHBvcnQgY29uc3QgQUREX1RJTUVPVVQgPSAnQUREX1RJTUVPVVQnO1xyXG5leHBvcnQgY29uc3QgUkVNT1ZFX1RJTUVPVVQgPSAnUkVNT1ZFX1RJTUVPVVQnO1xyXG4vLyBleHBvcnQgY29uc3QgUkVNT1ZFX0FMTF9USU1FT1VUUyA9ICdSRU1PVkVfQUxMX1RJTUVPVVRTJztcclxuXHJcbi8vIHdvcmxkc1xyXG5leHBvcnQgY29uc3QgU0VUX1dPUkxEID0gJ1NFVF9XT1JMRCc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9XT1JMRCA9ICdDTEVBUl9XT1JMRCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBBUElcclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBBUElfUkVRVUVTVF9PUEVOID0gJ0FQSV9SRVFVRVNUX09QRU4nO1xyXG5leHBvcnQgY29uc3QgQVBJX1JFUVVFU1RfU1VDQ0VTUyA9ICdBUElfUkVRVUVTVF9TVUNDRVNTJztcclxuZXhwb3J0IGNvbnN0IEFQSV9SRVFVRVNUX0ZBSUxFRCA9ICdBUElfUkVRVUVTVF9GQUlMRUQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgT3ZlcnZpZXdcclxuKi9cclxuXHJcbi8vIG1hdGNoZXNcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFUyA9ICdSRUNFSVZFX01BVENIRVMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MgPSAnUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCA9ICdSRUNFSVZFX01BVENIRVNfRkFJTEVEJztcclxuXHJcblxyXG5cclxuLypcclxuKiAgIFRyYWNrZXJcclxuKi9cclxuXHJcbi8vIG5vd1xyXG5leHBvcnQgY29uc3QgU0VUX05PVyA9ICdTRVRfTk9XJztcclxuXHJcbi8vIG1hdGNoZXNcclxuZXhwb3J0IGNvbnN0IENMRUFSX01BVENIREVUQUlMUyA9ICdDTEVBUl9NQVRDSERFVEFJTFMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSERFVEFJTFMgPSAnUkVDRUlWRV9NQVRDSERFVEFJTFMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyA9ICdSRUNFSVZFX01BVENIREVUQUlMU19TVUNDRVNTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCA9ICdSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQnO1xyXG5cclxuXHJcbi8vIGd1aWxkc1xyXG5leHBvcnQgY29uc3QgSU5JVElBTElaRV9HVUlMRCA9ICdJTklUSUFMSVpFX0dVSUxEJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfR1VJTEQgPSAnUkVDRUlWRV9HVUlMRCc7XHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX0dVSUxEX0ZBSUxFRCA9ICdSRUNFSVZFX0dVSUxEX0ZBSUxFRCc7XHJcblxyXG4vLyBvYmplY3RpdmVzXHJcbmV4cG9ydCBjb25zdCBPQkpFQ1RJVkVTX1JFU0VUID0gJ09CSkVDVElWRVNfUkVTRVQnO1xyXG5leHBvcnQgY29uc3QgT0JKRUNUSVZFU19VUERBVEUgPSAnT0JKRUNUSVZFU19VUERBVEUnO1xyXG5leHBvcnQgY29uc3QgT0JKRUNUSVZFX1VQREFURSA9ICdPQkpFQ1RJVkVfVVBEQVRFJztcclxuXHJcbi8vIGxvZ1xyXG5leHBvcnQgY29uc3QgTE9HX0ZJTFRFUlNfVE9HR0xFX01BUCA9ICdMT0dfRklMVEVSU19UT0dHTEVfTUFQJztcclxuZXhwb3J0IGNvbnN0IExPR19GSUxURVJTX1RPR0dMRV9PQkpFQ1RJVkVfVFlQRSA9ICdMT0dfRklMVEVSU19UT0dHTEVfT0JKRUNUSVZFX1RZUEUnO1xyXG5leHBvcnQgY29uc3QgTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUgPSAnTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgVHJhY2tlclxyXG4qLyIsIlxyXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcclxuXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiBudWxsO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGdldE1hdGNoZXMsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRTbHVnLFxyXG4gICAgZ2V0TWF0Y2hCeVdvcmxkSWQsXHJcbiAgICBnZXRHdWlsZEJ5SWQsXHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXMoe1xyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoZXMoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlc2ApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRTbHVnKHtcclxuICAgIHdvcmxkU2x1ZyxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRNYXRjaEJ5V29ybGRTbHVnKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRTbHVnfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRJZCh7XHJcbiAgICB3b3JsZElkLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZElkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpbGRCeUlkKHtcclxuICAgIGd1aWxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0R3VpbGRCeUlkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uP2d1aWxkX2lkPSR7Z3VpbGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uUmVxdWVzdChjYWxsYmFja3MsIGVyciwgcmVzKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpvblJlcXVlc3QoKScsIGVyciwgcmVzICYmIHJlcy5ib2R5KTtcclxuXHJcbiAgICBpZiAoZXJyIHx8IHJlcy5lcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrcy5lcnJvcihlcnIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLnN1Y2Nlc3MocmVzLmJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrcy5jb21wbGV0ZSgpO1xyXG59IiwiXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZVNlbGVjdG9yLFxyXG4gICAgY3JlYXRlU2VsZWN0b3JDcmVhdG9yLFxyXG4gICAgZGVmYXVsdE1lbW9pemUsXHJcbiB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcblxyXG5cclxuLy8gY3JlYXRlIGEgXCJzZWxlY3RvciBjcmVhdG9yXCIgdGhhdCB1c2VzIEltbXV0YWJsZS5pcyBpbnN0ZWFkIG9mID09PVxyXG5leHBvcnQgY29uc3QgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXHJcbiAgZGVmYXVsdE1lbW9pemUsXHJcbiAgSW1tdXRhYmxlLmlzXHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAgICBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgICAgICAuLnNlbGVjdG9ycyxcclxuICAgICAgICAoLi4ua2V5cykgPT4gKHsuLi5rZXlzfSlcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gbWFwU2VsZWN0b3JzVG9Qcm9wcyh7XHJcbiAgICAgICAga2V5OiBzZWxlY3RvcixcclxuICAgIH0pO1xyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcFNlbGVjdG9yc1RvUHJvcHMgPSAoc2VsZWN0b3JzTWFwKSA9PiB7XHJcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzTWFwKTtcclxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IGtleXMubWFwKGsgPT4gc2VsZWN0b3JzTWFwW2tdKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICAgICAgLi4uc2VsZWN0b3JzLFxyXG4gICAgICAgICguLi5hcmdzKSA9PiBrZXlzLnJlZHVjZShcclxuICAgICAgICAgICAgKHJlc3VsdCwgdmFsLCBpKSA9PlxyXG4gICAgICAgICAgICAoeyAuLi5yZXN1bHQsIFt2YWxdOiBhcmdzW2ldIH0pLCB7fSlcclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbWFwSW1tdXRhYmxlU2VsZWN0b3JzVG9Qcm9wcyA9IChzZWxlY3RvcnNNYXApID0+IHtcclxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnNNYXApO1xyXG4gICAgY29uc3Qgc2VsZWN0b3JzID0ga2V5cy5tYXAoayA9PiBzZWxlY3RvcnNNYXBba10pO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgICAgICAuLi5zZWxlY3RvcnMsXHJcbiAgICAgICAgKC4uLmFyZ3MpID0+IGtleXMucmVkdWNlKFxyXG4gICAgICAgICAgICAocmVzdWx0LCB2YWwsIGkpID0+XHJcbiAgICAgICAgICAgICh7IC4uLnJlc3VsdCwgW3ZhbF06IGFyZ3NbaV0gfSksIHt9KVxyXG4gICAgKTtcclxufTsiLCJcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQge1xyXG4gICAgY3JlYXRlU2VsZWN0b3IsXHJcbiAgICBjcmVhdGVTZWxlY3RvckNyZWF0b3IsXHJcbiAgICBkZWZhdWx0TWVtb2l6ZSxcclxuIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuXHJcblxyXG4vLyBjcmVhdGUgYSBcInNlbGVjdG9yIGNyZWF0b3JcIiB0aGF0IHVzZXMgSW1tdXRhYmxlLmlzIGluc3RlYWQgb2YgPT09XHJcbmV4cG9ydCBjb25zdCBjcmVhdGVJbW11dGFibGVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yQ3JlYXRvcihcclxuICBkZWZhdWx0TWVtb2l6ZSxcclxuICBJbW11dGFibGUuaXNcclxuKTtcclxuXHJcblxyXG5cclxuLypcclxuICAgIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IG1hcFNlbGVjdG9yc1RvUHJvcHMoe1xyXG4gICAgICAgIGtleTogc2VsZWN0b3IsXHJcbiAgICAgICAga2V5Mjogc2VsZWN0b3IyLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdG9cclxuXHJcbiAgICBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgICAgICAuLnNlbGVjdG9ycyxcclxuICAgICAgICAoLi4ua2V5cykgPT4gKHsuLi5rZXlzfSlcclxuICAgICk7XHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgbWFwU2VsZWN0b3JzVG9Qcm9wcyA9IChzZWxlY3RvcnNNYXAsIHNlbGVjdG9yQ3JlYXRvciA9IGNyZWF0ZVNlbGVjdG9yKSA9PiB7XHJcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzTWFwKTtcclxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IGtleXMubWFwKGsgPT4gc2VsZWN0b3JzTWFwW2tdKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4gc2VsZWN0b3JDcmVhdG9yKFxyXG4gICAgICAgIC4uLnNlbGVjdG9ycyxcclxuICAgICAgICAoLi4uYXJncykgPT4ga2V5cy5yZWR1Y2UoXHJcbiAgICAgICAgICAgIChyZXN1bHQsIHZhbCwgaSkgPT5cclxuICAgICAgICAgICAgKHsgLi4ucmVzdWx0LCBbdmFsXTogYXJnc1tpXSB9KSwge30pXHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcEltbXV0YWJsZVNlbGVjdG9yc1RvUHJvcHMgPSAoc2VsZWN0b3JzTWFwKSA9PiBtYXBTZWxlY3RvcnNUb1Byb3BzKHNlbGVjdG9yc01hcCwgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgU1RBVElDX0xBTkdTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncyc7XHJcbmltcG9ydCBTVEFUSUNfV09STERTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcyc7XHJcbmltcG9ydCBTVEFUSUNfT0JKRUNUSVZFUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQnO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkW2xhbmdTbHVnXS5zbHVnXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXMgPSBTVEFUSUNfT0JKRUNUSVZFUztcclxuZXhwb3J0IGNvbnN0IGxhbmdzID0gU1RBVElDX0xBTkdTO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB3b3JsZHMgPSBfXHJcbiAgICAuY2hhaW4oU1RBVElDX1dPUkxEUylcclxuICAgIC5rZXlCeSgnaWQnKVxyXG4gICAgLm1hcFZhbHVlcygod29ybGQpID0+IHtcclxuICAgICAgICBfLmZvckVhY2goXHJcbiAgICAgICAgICAgIFNUQVRJQ19MQU5HUyxcclxuICAgICAgICAgICAgKGxhbmcpID0+XHJcbiAgICAgICAgICAgIHdvcmxkW2xhbmcuc2x1Z10ubGluayA9IGdldFdvcmxkTGluayhsYW5nLnNsdWcsIHdvcmxkKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHdvcmxkO1xyXG4gICAgfSlcclxuICAgIC52YWx1ZSgpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlc01ldGEgPSBfLmtleUJ5KFtcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAxLCBpZDogJzknLCBkaXJlY3Rpb246ICcnfSwgICAgICAgICAgLy8gc3RvbmVtaXN0XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgIC8vIG92ZXJsb29rXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzIwJywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgLy8gdmVsb2thXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxOCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgIC8vIGFuelxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICc2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgIC8vIHNwZWxkYW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzUnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAgLy8gcGFuZ1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE1JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gbGFuZ29yXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyMicsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGJyYXZvc3RcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMjEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBkdXJpb3NcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzcnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gZGFuZVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBsb3dsYW5kc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTEnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBhbGRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEyJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gd2lsZGNyZWVrXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGtsb3ZhblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzQnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gZ29sYW50YVxyXG5cclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTMnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgIC8vIHJhbXBhcnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMDYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgIC8vIHVuZGVyY3JvZnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgIC8vIHBhbGFjZVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwMicsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gYWNhZGVteVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwNCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gbmVjcm9wb2xpc1xyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzk5JywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gbGFiXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTE1JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBoaWRlYXdheVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwOScsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gcmVmdWdlXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTEwJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBvdXRwb3N0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTA1JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBkZXBvdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwMScsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gZW5jYW1wXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTAwJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBmYXJtXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTE2JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAvLyB3ZWxsXHJcbl0sICdpZCcpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWFwc01ldGEgPSBbXHJcbiAgICB7aWQ6IDM4LCBuYW1lOiAnRXRlcm5hbCBCYXR0bGVncm91bmRzJywgYWJicjogJ0VCJ30sXHJcbiAgICB7aWQ6IDEwOTksIG5hbWU6ICdSZWQgQm9yZGVybGFuZHMnLCBhYmJyOiAnUmVkJ30sXHJcbiAgICB7aWQ6IDExMDIsIG5hbWU6ICdHcmVlbiBCb3JkZXJsYW5kcycsIGFiYnI6ICdHcm4nfSxcclxuICAgIHtpZDogMTE0MywgbmFtZTogJ0JsdWUgQm9yZGVybGFuZHMnLCBhYmJyOiAnQmx1J30sXHJcbl07XHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXNHZW8gPSB7XHJcbiAgICBlYjogW1tcclxuICAgICAgICB7aWQ6ICc5JywgZGlyZWN0aW9uOiAnJ30sICAgICAgICAgIC8vIHN0b25lbWlzdFxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAgLy8gb3Zlcmxvb2tcclxuICAgICAgICB7aWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgICAgICB7aWQ6ICcyMCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgIC8vIHZlbG9rYVxyXG4gICAgICAgIHtpZDogJzE4JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgLy8gYW56XHJcbiAgICAgICAge2lkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICAgICAge2lkOiAnNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgICAvLyBzcGVsZGFuXHJcbiAgICAgICAge2lkOiAnNScsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgICAvLyBwYW5nXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgICAgICB7aWQ6ICcxNScsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGxhbmdvclxyXG4gICAgICAgIHtpZDogJzIyJywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8gYnJhdm9zdFxyXG4gICAgICAgIHtpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAgICAgIHtpZDogJzIxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gZHVyaW9zXHJcbiAgICAgICAge2lkOiAnNycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBkYW5lXHJcbiAgICAgICAge2lkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzMnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gbG93bGFuZHNcclxuICAgICAgICB7aWQ6ICcxMScsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIGFsZG9uc1xyXG4gICAgICAgIHtpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgICAgICB7aWQ6ICcxMicsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIHdpbGRjcmVla1xyXG4gICAgICAgIHtpZDogJzE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8ga2xvdmFuXHJcbiAgICAgICAge2lkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgICAgICB7aWQ6ICc0JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIGdvbGFudGFcclxuICAgIF1dLFxyXG4gICAgYmwyOiBbW1xyXG4gICAgICAgIHtpZDogJzExMycsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgLy8gcmFtcGFydFxyXG4gICAgICAgIHtpZDogJzEwNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgLy8gdW5kZXJjcm9mdFxyXG4gICAgICAgIHtpZDogJzExNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgLy8gcGFsYWNlXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMTAyJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBhY2FkZW15XHJcbiAgICAgICAge2lkOiAnMTA0JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyBuZWNyb3BvbGlzXHJcbiAgICAgICAge2lkOiAnOTknLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBsYWJcclxuICAgICAgICB7aWQ6ICcxMTUnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGhpZGVhd2F5XHJcbiAgICAgICAge2lkOiAnMTA5JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyByZWZ1Z2VcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxMTAnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIG91dHBvc3RcclxuICAgICAgICB7aWQ6ICcxMDUnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGRlcG90XHJcbiAgICAgICAge2lkOiAnMTAxJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBlbmNhbXBcclxuICAgICAgICB7aWQ6ICcxMDAnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGZhcm1cclxuICAgICAgICB7aWQ6ICcxMTYnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgIC8vIHdlbGxcclxuICAgIF1dLFxyXG59O1xyXG4iLCJpbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ2V0V29ybGRGcm9tU2x1ZygpJywgbGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4gICAgY29uc3Qgd29ybGQgPSBfLmZpbmQoXHJcbiAgICAgICAgd29ybGRzLFxyXG4gICAgICAgIHcgPT4gd1tsYW5nU2x1Z10uc2x1ZyA9PT0gd29ybGRTbHVnXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQ6IHdvcmxkLmlkLFxyXG4gICAgICAgIC4uLndvcmxkW2xhbmdTbHVnXSxcclxuICAgIH07XHJcbn0iLCJcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQVBJX1JFUVVFU1RfT1BFTixcclxuICAgIEFQSV9SRVFVRVNUX1NVQ0NFU1MsXHJcbiAgICBBUElfUkVRVUVTVF9GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgcGVuZGluZzogSW1tdXRhYmxlLkxpc3QoW10pLFxyXG59KTtcclxuXHJcblxyXG5jb25zdCBhcGkgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OmFwaScsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEFQSV9SRVFVRVNUX09QRU46XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjphcGknLCBhY3Rpb24udHlwZSwgYWN0aW9uLnJlcXVlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXBkYXRlKFxyXG4gICAgICAgICAgICAgICAgJ3BlbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdSA9PiB1LnB1c2goYWN0aW9uLnJlcXVlc3RLZXkpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgQVBJX1JFUVVFU1RfU1VDQ0VTUzpcclxuICAgICAgICBjYXNlIEFQSV9SRVFVRVNUX0ZBSUxFRDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OmFwaScsIGFjdGlvbi50eXBlLCBhY3Rpb24ucmVxdWVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAncGVuZGluZycsXHJcbiAgICAgICAgICAgICAgICB1ID0+IHUuZmlsdGVyTm90KGYgPT4gZiA9PT0gYWN0aW9uLnJlcXVlc3RLZXkpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFwaTsiLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIElOSVRJQUxJWkVfR1VJTEQsXHJcbiAgICBSRUNFSVZFX0dVSUxELFxyXG4gICAgUkVDRUlWRV9HVUlMRF9GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0gSW1tdXRhYmxlLk1hcCgpO1xyXG5cclxuXHJcbmNvbnN0IGd1aWxkcyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6Z3VpbGRzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICBjYXNlIElOSVRJQUxJWkVfR1VJTEQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpndWlsZHMnLCBJTklUSUFMSVpFX0dVSUxELCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldChcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgSW1tdXRhYmxlLk1hcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGFjdGlvbi5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfR1VJTEQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpndWlsZHMnLCBSRUNFSVZFX0dVSUxELCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldChcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgSW1tdXRhYmxlLk1hcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGFjdGlvbi5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjdGlvbi5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogYWN0aW9uLnRhZyxcclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9HVUlMRF9GQUlMRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpndWlsZHMnLCBSRUNFSVZFX0dVSUxEX0ZBSUxFRCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5zZXRJbihbYWN0aW9uLmd1aWxkSWQsICdlcnJvciddLCBhY3Rpb24uZXJyb3IpO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBndWlsZHM7IiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnO1xyXG5cclxuaW1wb3J0IGFwaSBmcm9tICcuL2FwaSc7XHJcbmltcG9ydCBndWlsZHMgZnJvbSAnLi9ndWlsZHMnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICcuL2xhbmcnO1xyXG5pbXBvcnQgbG9nRmlsdGVycyBmcm9tICcuL2xvZ0ZpbHRlcnMnO1xyXG5pbXBvcnQgbWF0Y2hlcyBmcm9tICcuL21hdGNoZXMnO1xyXG5pbXBvcnQgbWF0Y2hEZXRhaWxzIGZyb20gJy4vbWF0Y2hEZXRhaWxzJztcclxuaW1wb3J0IG5vdyBmcm9tICcuL25vdyc7XHJcbmltcG9ydCBvYmplY3RpdmVzIGZyb20gJy4vb2JqZWN0aXZlcyc7XHJcbmltcG9ydCByb3V0ZSBmcm9tICcuL3JvdXRlJztcclxuaW1wb3J0IHRpbWVvdXRzIGZyb20gJy4vdGltZW91dHMnO1xyXG5pbXBvcnQgd29ybGQgZnJvbSAnLi93b3JsZCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBhcGksXHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbG9nRmlsdGVycyxcclxuICAgIG1hdGNoZXMsXHJcbiAgICBtYXRjaERldGFpbHMsXHJcbiAgICBub3csXHJcbiAgICBvYmplY3RpdmVzLFxyXG4gICAgcm91dGUsXHJcbiAgICB0aW1lb3V0cyxcclxuICAgIHdvcmxkLFxyXG59KTsiLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5pbXBvcnQgeyBTRVRfTEFORyB9IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuaW1wb3J0IHsgbGFuZ3MgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmNvbnN0IGRlZmF1bHRTbHVnID0gJ2VuJztcclxuY29uc3QgZGVmYXVsdExhbmcgPSBJbW11dGFibGUuZnJvbUpTKGxhbmdzW2RlZmF1bHRTbHVnXSk7XHJcblxyXG5cclxuY29uc3QgbGFuZyA9IChzdGF0ZSA9IGRlZmF1bHRMYW5nLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFNFVF9MQU5HOlxyXG4gICAgICAgICAgICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyhsYW5nc1thY3Rpb24uc2x1Z10pO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBsYW5nOyIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBMT0dfRklMVEVSU19UT0dHTEVfTUFQLFxyXG4gICAgTE9HX0ZJTFRFUlNfVE9HR0xFX09CSkVDVElWRV9UWVBFLFxyXG4gICAgTE9HX0ZJTFRFUlNfVE9HR0xFX0VWRU5UX1RZUEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIG1hcHM6IEltbXV0YWJsZS5TZXQoWydFQicsICdSZWQnLCAnR3JuJywgJ0JsdSddKSxcclxuICAgIG9iamVjdGl2ZVR5cGVzOiBJbW11dGFibGUuU2V0KFsnY2FzdGxlJywgJ2tlZXAnLCAndG93ZXInLCAnY2FtcCddKSxcclxuICAgIGV2ZW50VHlwZXM6IEltbXV0YWJsZS5TZXQoWydjYXB0dXJlJywgJ2NsYWltJ10pLFxyXG59KTtcclxuXHJcbmNvbnN0IGxvZ0ZpbHRlcnMgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICBjYXNlIExPR19GSUxURVJTX1RPR0dMRV9NQVA6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpsb2dGaWx0ZXJzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAnbWFwcycsXHJcbiAgICAgICAgICAgICAgICB2ID0+XHJcbiAgICAgICAgICAgICAgICB2LmhhcyhhY3Rpb24ubWFwSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgPyB2LmRlbGV0ZShhY3Rpb24ubWFwSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgOiB2LmFkZChhY3Rpb24ubWFwSWQpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgTE9HX0ZJTFRFUlNfVE9HR0xFX09CSkVDVElWRV9UWVBFOlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVkdWNlcjo6bG9nRmlsdGVycycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXBkYXRlKFxyXG4gICAgICAgICAgICAgICAgJ29iamVjdGl2ZVR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHYgPT5cclxuICAgICAgICAgICAgICAgIHYuaGFzKGFjdGlvbi5vYmplY3RpdmVUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgID8gdi5kZWxldGUoYWN0aW9uLm9iamVjdGl2ZVR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgOiB2LmFkZChhY3Rpb24ub2JqZWN0aXZlVHlwZSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBMT0dfRklMVEVSU19UT0dHTEVfRVZFTlRfVFlQRTpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6OmxvZ0ZpbHRlcnMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICdldmVudFR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHYgPT5cclxuICAgICAgICAgICAgICAgIHYuaGFzKGFjdGlvbi5ldmVudFR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgPyB2LmRlbGV0ZShhY3Rpb24uZXZlbnRUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgIDogdi5hZGQoYWN0aW9uLmV2ZW50VHlwZSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbG9nRmlsdGVycztcclxuIiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBDTEVBUl9NQVRDSERFVEFJTFMsXHJcbiAgICBSRUNFSVZFX01BVENIREVUQUlMUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX1NVQ0NFU1MsXHJcbiAgICBSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCByZ2JOdW0gPSBJbW11dGFibGUuTWFwKHsgcmVkOiAwLCBibHVlOiAwLCBncmVlbjogMCB9KTtcclxuZXhwb3J0IGNvbnN0IGhvbGQgPSBJbW11dGFibGUuTWFwKHsgY2FzdGxlOiAwLCBrZWVwOiAwLCB0b3dlcjogMCwgY2FtcDogMCB9KTtcclxuZXhwb3J0IGNvbnN0IHJnYkhvbGQgPSBJbW11dGFibGUuTWFwKHsgcmVkOiBob2xkLCBibHVlOiBob2xkLCBncmVlbjogaG9sZCB9KTtcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc3RhdHNEZWZhdWx0ID0gSW1tdXRhYmxlLmZyb21KUyh7XHJcbiAgICBkZWF0aHM6IHJnYk51bSxcclxuICAgIGtpbGxzOiByZ2JOdW0sXHJcbiAgICBob2xkaW5nczogcmdiSG9sZCxcclxuICAgIHNjb3JlczogcmdiTnVtLFxyXG4gICAgdGlja3M6IHJnYk51bSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFwRGVmYXVsdCA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgaWQ6IG51bGwsXHJcbiAgICBsYXN0bW9kOiBudWxsLFxyXG4gICAgZ3VpbGRzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgb2JqZWN0aXZlczogSW1tdXRhYmxlLk9yZGVyZWRTZXQoKSxcclxuICAgIHN0YXRzOiBzdGF0c0RlZmF1bHQsXHJcbiAgICB0eXBlOiBudWxsLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBzRGVmYXVsdCA9IEltbXV0YWJsZS5MaXN0KFtcclxuICAgIG1hcERlZmF1bHQsXHJcbiAgICBtYXBEZWZhdWx0LFxyXG4gICAgbWFwRGVmYXVsdCxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgdGltZXNEZWZhdWx0ID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBsYXN0bW9kOiBudWxsLFxyXG4gICAgZW5kVGltZTogbnVsbCxcclxuICAgIHN0YXJ0VGltZTogbnVsbCxcclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRTdGF0ZSA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgaWQ6IG51bGwsXHJcbiAgICBndWlsZHM6IEltbXV0YWJsZS5PcmRlcmVkU2V0KCksXHJcbiAgICBtYXBzOiBtYXBzRGVmYXVsdCxcclxuICAgIG9iamVjdGl2ZXM6IEltbXV0YWJsZS5PcmRlcmVkU2V0KCksXHJcbiAgICByZWdpb246IG51bGwsXHJcbiAgICB0aW1lczogdGltZXNEZWZhdWx0LFxyXG4gICAgc3RhdHM6IHN0YXRzRGVmYXVsdCxcclxuICAgIHdvcmxkczogcmdiTnVtLFxyXG4gICAgbGFzdFVwZGF0ZTogRGF0ZS5ub3coKSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbWF0Y2hEZXRhaWxzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSERFVEFJTFM6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUud2l0aE11dGF0aW9ucyhcclxuICAgICAgICAgICAgICAgIHRtcFN0YXRlID0+XHJcbiAgICAgICAgICAgICAgICB0bXBTdGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ2xhc3RVcGRhdGUnLCBEYXRlLm5vdygpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ2lkJywgYWN0aW9uLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ2d1aWxkSWRzJywgYWN0aW9uLmd1aWxkSWRzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ21hcHMnLCBhY3Rpb24ubWFwcylcclxuICAgICAgICAgICAgICAgICAgICAuc2V0KCdvYmplY3RpdmVJZHMnLCBhY3Rpb24ub2JqZWN0aXZlSWRzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ3JlZ2lvbicsIGFjdGlvbi5yZWdpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldCgnc3RhdHMnLCBhY3Rpb24uc3RhdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldCgndGltZXMnLCBhY3Rpb24udGltZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldCgnd29ybGRzJywgYWN0aW9uLndvcmxkcylcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBDTEVBUl9NQVRDSERFVEFJTFM6XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0U3RhdGU7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUzpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om1hdGNoRGV0YWlscycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgICAgICAgICAgICAgIC5zZXQoJ2xhc3RVcGRhdGUnLCBEYXRlLm5vdygpKVxyXG4gICAgICAgICAgICAgICAgLmRlbGV0ZSgnZXJyb3InKTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdsYXN0VXBkYXRlJywgRGF0ZS5ub3coKSlcclxuICAgICAgICAgICAgICAgIC5zZXQoJ2Vycm9yJywgYWN0aW9uLmVyci5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hEZXRhaWxzOyIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgUkVDRUlWRV9NQVRDSEVTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgZGF0YTogSW1tdXRhYmxlLk1hcCh7fSksXHJcbiAgICBpZHM6IEltbXV0YWJsZS5MaXN0KFtdKSxcclxuICAgIGxhc3RVcGRhdGVkOiAwLFxyXG59KTtcclxuXHJcblxyXG5jb25zdCBtYXRjaGVzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hFUzpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdkYXRhJywgYWN0aW9uLmRhdGEpXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdsYXN0VXBkYXRlZCcsIGFjdGlvbi5sYXN0VXBkYXRlZCk7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1M6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5oYXMoJ2Vycm9yJylcclxuICAgICAgICAgICAgICAgID8gc3RhdGUuZGVsZXRlKCdlcnJvcicpXHJcbiAgICAgICAgICAgICAgICA6IHN0YXRlO1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5zZXQoJ2Vycm9yJywgYWN0aW9uLmVyci5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hlczsiLCJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgeyBTRVRfTk9XIH0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5jb25zdCByb3V0ZSA9IChzdGF0ZSA9IG1vbWVudCgpLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFNFVF9OT1c6XHJcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQudW5peChtb21lbnQoKS51bml4KCkpOyAvLyByb3VuZHMgdG8gc2Vjb25kXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBtb21lbnQoKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGU7XHJcbiIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBPQkpFQ1RJVkVTX1JFU0VULFxyXG4gICAgT0JKRUNUSVZFU19VUERBVEUsXHJcbiAgICBPQkpFQ1RJVkVfVVBEQVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IEltbXV0YWJsZS5NYXAoKTtcclxuXHJcblxyXG5jb25zdCBvYmplY3RpdmVzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpvYmplY3RpdmVzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICBjYXNlIE9CSkVDVElWRVNfUkVTRVQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpvYmplY3RpdmVzJywgYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0U3RhdGU7XHJcblxyXG4gICAgICAgIGNhc2UgT0JKRUNUSVZFX1VQREFURTpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om9iamVjdGl2ZXMnLCBhY3Rpb24udHlwZSwgYWN0aW9uLm9iamVjdGl2ZS5nZXQoJ2lkJyksIGFjdGlvbi5vYmplY3RpdmUudG9KUygpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5zZXQoXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ub2JqZWN0aXZlLmdldCgnaWQnKSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5vYmplY3RpdmVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBPQkpFQ1RJVkVTX1VQREFURTpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om9iamVjdGl2ZXMnLCBhY3Rpb24udHlwZSwgYWN0aW9uLm9iamVjdGl2ZXMudG9KUygpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ub2JqZWN0aXZlcztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0aXZlczsiLCJcclxuaW1wb3J0IHtcclxuICAgIFNFVF9ST1VURSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgIHBhdGg6ICcvJyxcclxuICAgIHBhcmFtczoge30sXHJcbn07XHJcblxyXG5jb25zdCByb3V0ZSA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfUk9VVEU6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF0aCxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogYWN0aW9uLnBhcmFtcyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGU7XHJcbiIsIlxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEFERF9USU1FT1VULFxyXG4gICAgUkVNT1ZFX1RJTUVPVVQsXHJcbiAgICAvLyBSRU1PVkVfQUxMX1RJTUVPVVRTLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IHRpbWVvdXRzID0gKHN0YXRlID0ge30sIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgQUREX1RJTUVPVVQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIEFERF9USU1FT1VULCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogYWN0aW9uLnJlZixcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2FzZSBSRU1PVkVfVElNRU9VVDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgUkVNT1ZFX1RJTUVPVVQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gXy5vbWl0KHN0YXRlLCBhY3Rpb24ubmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGNhc2UgUkVNT1ZFX0FMTF9USU1FT1VUUzpcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgUkVNT1ZFX0FMTF9USU1FT1VUUywgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiB7fTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdGltZW91dHM7IiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfV09STEQsXHJcbiAgICBDTEVBUl9XT1JMRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuaW1wb3J0IHsgZ2V0V29ybGRGcm9tU2x1ZyB9IGZyb20gJ2xpYi93b3JsZHMnO1xyXG5cclxuXHJcbmNvbnN0IHdvcmxkID0gKHN0YXRlID0gbnVsbCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfV09STEQ6XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRXb3JsZEZyb21TbHVnKGFjdGlvbi5sYW5nU2x1ZywgYWN0aW9uLndvcmxkU2x1Zyk7XHJcblxyXG4gICAgICAgIGNhc2UgQ0xFQVJfV09STEQ6XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgd29ybGQ7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFwiMTA5OS05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFtbSdzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgSGFtbVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGFtbXMgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIEhhbW1cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwODY0LCA5NTU5LjQ5XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGVzaCdzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgTGVzaFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTGVzaHMgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIExlc2hcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI3OS45NSwgMTIxMTkuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlpha2sncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIFpha2tcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlpha2tzIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBaYWtrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQ0NDgsIDExNDc5LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhdWVyIEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJhdWVyLUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEJhdWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc5My43LCAxMTI1OC40XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXJyZXR0IEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmFycmV0dFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmFycmV0dC1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBCYXJyZXR0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMDkuNzEsIDEzODE4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdlZSBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEdlZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2VlLUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEdlZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1Mzc3LjcsIDEzMTc4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk1jTGFpbidzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgTWNMYWluXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJNY0xhaW5zIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZGUgTWNMYWluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzEyLjgsIDExMjYzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhdHJpY2sncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIFBhdHJpY2tcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlBhdHJpY2tzIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZGUgUGF0cmlja1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MTI4LjgsIDEzODIzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhYmliJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBIYWJpYlwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGFiaWJzIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZCdIYWJpYlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMjk2LjgsIDEzMTgzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk8nZGVsIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIE8nZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPJ2RlbC1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIE8nZGVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTgzMi40LCA5NTk0LjYzXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJZJ2xhbiBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBZJ2xhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWSdsYW4tQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBZJ2xhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjI0OC40LCAxMjE1NC42XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJLYXknbGkgQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgS2F5J2xpXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLYXknbGktQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBLYXknbGlcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzNyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM0MTYuNCwgMTE1MTQuNl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRXRlcm5hbCBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBFdGVybmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkV3aWdlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSDDqXRlcm5lbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE4MDIuNywgOTY2NC43NV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVhdGhsZXNzIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIElubW9ydGFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUb2Rsb3NlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSBpbW1vcnRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjE4LjcyLCAxMjIyNC43XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJVbmR5aW5nIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIEltcGVyZWNlZGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW5zdGVyYmxpY2hlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSBpbXDDqXJpc3NhYmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1Mzg2LjcsIDExNTg0LjddXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNyYW5rc2hhZnQgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBQYWxhbmNhbWFuaWphc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS3VyYmVsd2VsbGVuLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IFZpbGVicmVxdWluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyNjQuMywgMTE2MDkuNF1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3BhcmtwbHVnIERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgQnVqw61hc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWsO8bmRmdW5rZW4tRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgQm91Z2llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3NjgwLjMyLCAxNDE2OS40XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGbHl3aGVlbCBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIFZvbGFudGVzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2h3dW5ncmFkLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IEVuZ3JlbmFnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzMyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDg0OC4zLCAxMzUyOS40XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbGlzdGVyaW5nIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gQWNoaWNoYXJyYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJlbm5lbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgZW1icmFzw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODU0LjU4LCAxMDU3OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTY29yY2hpbmcgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBBYnJhc2Fkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlcnNlbmdlbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgY3Vpc2FudGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5NSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjI3MC41OCwgMTMxMzguNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVG9ycmlkIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gU29mb2NhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbMO8aGVuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSB0b3JyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM0MzguNiwgMTI0OTguNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTIwMjIuNSwgMTE3ODkuOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4NDM4LjQ5LCAxNDM0OS45XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTU2MDYuNSwgMTM3MDkuOV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTY0MS43LCAxMTc0OS42XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYwNTcuNywgMTQzMDkuNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMjI1LjcsIDEzNjY5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJveSdzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBSb3lcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJveXMgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBSb3lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyMixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExOTU0LjYsIDEwMDY4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk5vcmZvbGsncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgTm9yZm9sa1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTm9yZm9sa3MgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBOb3Jmb2xrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgzNzAuNiwgMTI2MjguNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2xpdmllcidzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBPbGl2aWVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPbGl2aWVycyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGQnT2xpdmllclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1NTM4LjYsIDExOTg4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhcmNoZWQgT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIEFicmFzYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZXJkw7ZycnRlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIGTDqXZhc3TDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjc3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjU1LCAxMTU3Nl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV2l0aGVyZWQgT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIERlc29sYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWxrZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSByYXZhZ8OpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2NjcxLjA1LCAxNDEzNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmFycmVuIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBBYmFuZG9uYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDlmRlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIGTDqWxhYnLDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzgzOSwgMTM0OTZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b2ljIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgRXN0b2ljYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RvaXNjaGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBzdG/Dr3F1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA4MTIuMywgMTAxMDIuOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW1wYXNzaXZlIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgSW1wZXJ0dXJiYWJsZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW5iZWVpbmRydWNrdGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBpbXBhc3NpYmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyMjguMzIsIDEyNjYyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhcmRlbmVkIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgRW5kdXJlY2lkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RhaGxoYXJ0ZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IGR1cmNpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQzOTYuMywgMTIwMjIuOV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3NwcmV5J3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCDDgWd1aWxhIFBlc2NhZG9yYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmlzY2hhZGxlci1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkdSBiYWxidXphcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzg4LCAxMDY2MC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYXJyaWVyJ3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCBBZ3VpbHVjaG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlaWhlbi1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkdSBjaXJjYcOodGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIwNCwgMTMyMjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hyaWtlJ3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCBBbGNhdWTDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlfDvHJnZXItUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZGUgbGEgcGllLWdyacOoY2hlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzNzIsIDEyNTgwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvZXR0aWdlcidzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEJvZXR0aWdlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQm9ldHRpZ2VycyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgQm9ldHRpZ2VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NTg1LjksIDEwMDM3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkh1Z2hlJ3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgSHVnaGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkh1Z2hlcyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgSHVnaGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjAwMS45LCAxMjU5Ny4xXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCZXJkcm93J3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgQmVyZHJvd1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmVyZHJvd3MgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEJlcmRyb3dcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzE2OS45LCAxMTk1Ny4xXVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEdXN0d2hpc3BlciBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIGRlbCBNdXJtdWxsbyBkZSBQb2x2b1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXMgU3RhdWJmbMO8c3Rlcm5zXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBTb3VmZmxlLXBvdXNzacOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNzczLjMsIDExNjUyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNtYXNoZWRob3BlIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gVHJhZ2Flc3BlcmFuemFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVyIFplcnNjaGxhZ2VuZW4gSG9mZm51bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IFLDqnZlLWJyaXPDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MTg5LjI5LCAxNDIxMi41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMYXN0Z2FzcCBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIGRlbCDDmmx0aW1vIFN1c3Bpcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVzIExldHp0ZW4gU2NobmF1ZmVyc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgRGVybmllci1zb3VwaXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDM1Ny4zLCAxMzU3Mi41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA1OTAuMiwgOTE2OS4xOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzAwNi4xOSwgMTE3MjkuMl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjc5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDE3NC4yLCAxMTA4OS4yXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGYWl0aGxlYXBcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhbHRvIGRlIEZlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbGF1YmVuc3NwcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2F1dCBkZSBsYSBGb2lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAxMCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTExXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODgyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk0MTcuMzksIDE0NzkwLjddXHJcbiAgICB9LFxyXG4gICAgXCI5NS00M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhlcm8ncyBMb2RnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGVsZGVuaGFsbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTYyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTMxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMzFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXNjZW5zaW9uIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIGRlIGxhIEFzY2Vuc2nDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkF1ZnN0aWVnc2J1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGRlIGwnQXNjZW5zaW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTI5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGVyIEdlaXN0aG9sbVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGUgSGVhdW1lIHNwaXJpdHVlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVybG9va1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTWlyYWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXVzc2ljaHRzcHVua3Qgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEJlbHbDqWTDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNjk4LjQsIDEzNzYxXVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIExhbmdvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTGFuZ29yLVNjaGx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSYXZpbiBkZSBMYW5nb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNDY1LjMsIDE1NTY5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0zXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBiYWphc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGllZmxhbmQgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEJhc3NlcyB0ZXJyZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTg0MC4yNSwgMTQ5ODMuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTWVuZG9uJ3MgR2FwXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYW5qYSBkZSBNZW5kb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk1lbmRvbnMgU3BhbHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZhaWxsZSBkZSBNZW5kb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMTkyLjcsIDEzNDEwLjhdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVuYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVmVydC1icnV5w6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC03XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYW5lbG9uIFBhc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhc3NhZ2UgRGFuZWxvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk5Ni40LCAxNTU0NS44XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMDNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMDNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTMwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMzBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV29vZGhhdmVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXYWxkLUZyZWlzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9pc3JlZnVnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaGFkYXJhbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBTaGFkYXJhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2hhZGFyYW4tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBTaGFkYXJhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJFdGhlcm9uIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkV0aGVyb24tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0V0aGVyb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NS01NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJyYXMgZHUgVGl0YW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTc1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FzdGlsbG8gUGllZHJhbmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hsb3NzIFN0ZWlubmViZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNow6J0ZWF1IEJydW1lcGllcnJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzMyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYXN0bGVcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA2MjcuMywgMTQ1MDEuM11cclxuICAgIH0sXHJcbiAgICBcIjk1LTU3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ3JhZ3RvcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJvZmZnaXBmZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNvbW1ldCBkZSBIYXV0Y3JhZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC01XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYW5nbG9zcyBSaXNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmEgUGFuZ2xvc3NcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlBhbmdsb3NzLUFuaMO2aGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyMDEuNiwgMTM3MTguNF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTMzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHJlYW1pbmcgQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgT27DrXJpY2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRyYXVtYnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk1LTQyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkbGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3RzZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyByb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gRHVyaW9zXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEdXJpb3MtU2NobHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJhdmluIGRlIER1cmlvc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyMDcuMSwgMTQ1OTVdXHJcbiAgICB9LFxyXG4gICAgXCI5NS01NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZvZ2hhdmVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIE5lYmxpbm9zb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTmViZWwtRnJlaXN0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJIYXZyZSBncmlzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS01NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWFycm9qYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90d2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwMyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVubGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIHZlcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTIwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmVsb2thIFNsb3BlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTAxNy40LCAxMzQxNC40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgU2FsdG8gQWNpYWdvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyZWNrZW5zZmFsbC1CdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkdSBOb2lyIGTDqWNsaW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTQ1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZWJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJydXlhenVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiS2xvdmFuIEd1bGx5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBLbG92YW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIktsb3Zhbi1TZW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGV0aXQgcmF2aW4gZGUgS2xvdmFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDIxOS41LCAxNTEwNy42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2VuYWdhbCBkZSBKZXJyaWZlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSmVycmlmZXJzIFN1bXBmbG9jaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3NTcuMDYsIDE1NDY3LjhdXHJcbiAgICB9LFxyXG4gICAgXCI5NC02NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxvbmd2aWV3XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJWaXN0YWx1ZW5nYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2VpdHNpY2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMb25ndWV2dWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3BlbGRhbiBDbGVhcmN1dFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2xhcm8gRXNwZWxkaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNwZWxkYW4tS2FobHNjaGxhZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9yw6p0IHJhc8OpZSBkZSBTcGVsZGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0NCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3MzkuODEsIDEzNTg2LjldXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBHb2Rzd29yZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgSG9qYSBEaXZpbmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRhcyBHb3R0ZXNzY2h3ZXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMJ0Vww6llIGRpdmluZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTY0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTM3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWYWxsZXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlZhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUYWwgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIFZhbGzDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyNjguOSwgMTUwODcuN11cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3VubnloaWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmEgU29sZWFkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU29ubmVuaMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lIGVuc29sZWlsbMOpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTUzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW52YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHZlcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTcxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldpbGRjcmVlayBSdW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBpc3RhIEFycm95b3NhbHZhamVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldpbGRiYWNoLVN0cmVja2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBpc3RlIGR1IHJ1aXNzZWF1IHNhdXZhZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk5NTguMjMsIDE0NjA1LjddXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZGJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXJyb2phXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3RzdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcnV5ZXJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTExMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTExMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNzFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni03MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTQ2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTUyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJhaCdzIEhvcGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzcGVyYW56YSBkZSBBcmFoXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBcmFocyBIb2ZmbnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRXNwb2lyIGQnQXJhaFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUXVlbnRpbiBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFF1ZW50aW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlF1ZW50aW4tU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgUXVlbnRpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5NTEuOCwgMTUxMjEuMl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTIyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQnJhdm9zdCBFc2NhcnBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc1MC4yLCAxNDg1OS40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVldmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVhenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1dGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgQmxldXZhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTE5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2dyZXdhdGNoIEN1dFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGFqbyBkZSBsYSBHdWFyZGlhIGRlbCBPZ3JvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPZ2Vyd2FjaHQtS2FuYWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBlcmPDqWUgZGUgR2FyZG9ncmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTY1LCAxMzk1MV1cclxuICAgIH0sXHJcbiAgICBcIjk1LTc2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJJc2xldGEgQXN0cmFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBc3RyYWxob2xtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJIZWF1bWUgYXN0cmFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNjZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2xhcm8gR29sYW50YVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR29sYW50YS1MaWNodHVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0OSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMTk4LjksIDE1NTIwLjJdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZpY3RvcidzIExvZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgVmVuY2Vkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNpZWdlci1IYWxsZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGF2aWxsb24gZHUgVmFpbnF1ZXVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMjhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYXduJ3MgRXlyaWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZMOkbW1lcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVwYWlyZSBkZSBsJ2F1YmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTU5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkdmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVycm9qb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90dGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMzZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVlbGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb2F6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXVzZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBibGV1XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTUwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZXdhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXV3YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtQXp1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC04XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlVtYmVyZ2xhZGUgV29vZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvaXMgZCdPbWJyZWNsYWlyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNjgwLjksIDE0MzUzLjZdXHJcbiAgICB9LFxyXG4gICAgXCI5NC02M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTYzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni03MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTcwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTYwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3Rhcmdyb3ZlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBcmJvbGVkYSBkZSBsYXMgRXN0cmVsbGFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVybmhhaW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvc3F1ZXQgw6l0b2lsw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtNDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC00MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDbGlmZnNpZGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlc3Blw7FhZGVyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVsc3dhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZsYW5jIGRlIGZhbGFpc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNjFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbndhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIGJhamFzIGRlIEFndWF2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG53YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtVmVyZG95YW50ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTIzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFza2FsaW9uIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIEFza2FsaW9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBc2thbGlvbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNzRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJvZ3VlJ3MgUXVhcnJ5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW50ZXJhIGRlbCBQw61jYXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2h1cmtlbmJydWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYXJyacOocmUgZHUgdm9sZXVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg1MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk2MTIuNTQsIDE0NDYyLjhdXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNoYW1waW9uJ3MgRGVtZXNuZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGF0cmltb25pbyBkZWwgQ2FtcGXDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkNoYW1waW9ucyBMYW5kc2l0elwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmllZiBkdSBDaGFtcGlvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFuemFsaWFzIFBhc3NcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbCBkJ0FuemFsaWFzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDI0My4zLCAxMzk3NC40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni01OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTU4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdvZHNsb3JlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdvdHRlc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhdm9pciBkaXZpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV3VybSBUdW5uZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlTDum5lbCBkZSBsYSBTaWVycGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIld1cm10dW5uZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlR1bm5lbCBkZSBndWl2cmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NixcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY3NTAuOTIsIDEwMjExLjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8wODc0OTFDREQ1NkY3RkI5OThDMzMyMzYwRDMyRkQyNkE4QjJBOTlELzczMDQyOC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFpcnBvcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFlcm9wdWVydG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZsdWdoYWZlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQcOpcm9wb3J0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MDU0LjE2LCAxMDQyMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0FDQ0NCMUJENjE3NTk4QzBFQTlDNzU2RUFERTUzREYzNkMyNTc4RUMvNzMwNDI3LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGh1bmRlciBIb2xsb3cgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBIb25kb25hZGEgZGVsIFRydWVub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRG9ubmVyc2Vua2VucmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIFRvbm5lY3JldmFzc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjgyLjc3LCAxMDQyNS45XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGb3JnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRm9yamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaG1pZWRlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3JnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIyMy42NCwgMTA2OTIuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0QxQUI1NDFGQzNCRTEyQUM1QkJCMDIwMjEyQkVCRTNGNUMwQzQzMTUvNzMwNDE1LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmdyb3duIEZhbmUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBGYW5vIEdpZ2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOcYmVyd3VjaGVydGVyIEdvdHRlc2hhdXMtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFRlbXBsZSBzdXJkaW1lbnNpb25uw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MixcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTEzLjgzLCA5MDU5Ljk2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaHJpbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhbnR1YXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NocmVpblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2FuY3R1YWlyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODYxNC44OSwgMTAyNDYuNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0I1NzA5OTQxQjAzNTJGRDRDQTNCN0FGREE0Mjg3M0Q4RUZEQjE1QUQvNzMwNDE0LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXV0ZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNDAuNjYsIDkyNTMuOV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0RDMDFFQzQxRDg4MDlCNTlCODVCRUVEQzQ1RTk1NTZENzMwQkQyMUEvNzMwNDEzLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV29ya3Nob3BcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRhbGxlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2Vya3N0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdGVsaWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2ODM3LjYsIDEwODQ1LjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9CMzRDMkUzRDBGMzRGRDAzRjQ0QkI1RUQ0RTE4RENERDAwNTlBNUM0LzczMDQyOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyaWQgRm9ydHJlc3MgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBGb3J0YWxlemEgw4FyaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw7xycmVmZXN0dW5ncmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIGxhIEZvcnRlcmVzc2UgYXJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MyxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2ODIzLjgzLCAxMDQ3OS41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZWdhemUgU3BpcmUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBBZ3VqYSBkZSBNaXJhcGllZHJhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RlaW5ibGljay1aYWNrZW5zdGFicmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFBpYyBkZSBQaWVycmVnYXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI0OS4yMSwgOTc2My44N10sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmVsbCBUb3dlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFuYXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2xvY2tlbnR1cm1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNsb2NoZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MyxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgxODAuNjgsIDEwMzI1LjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENDE4MDc3NEREMDNBNEJDNzI1MkI5NTI2ODBFNDUxRjE2Njc5QTcyLzczMDQxMC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9ic2VydmF0b3J5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJPYnNlcnZhdG9yaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9ic2VydmF0b3JpdW1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk9ic2VydmF0b2lyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzk1My42NywgOTA2Mi43OV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzAxNUNGMTZDNzhERkRBRDc0MkUxQTU2MTNGQjc0QjY0NjNCRjRBNzAvNzMwNDExLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmdyb3duIEZhbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZhbm8gR2lnYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5xiZXJ3dWNoZXJ0ZXMgR290dGVzaGF1c1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVGVtcGxlIHN1cmRpbWVuc2lvbm7DqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzYwNi43LCA4ODgyLjE0XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmlkIEZvcnRyZXNzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGb3J0YWxlemEgw4FyaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw7xycmVmZXN0dW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3J0ZXJlc3NlIGFyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2NDQyLjE3LCAxMDg4MS44XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUeXRvbmUgUGVyY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBlcmNoYSBkZSBUeXRvbmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlR5dG9uZW53YXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGVyY2hvaXIgZGUgVHl0b25lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzg4NC44MSwgOTgwOS4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaHVuZGVyIEhvbGxvd1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSG9uZG9uYWRhIGRlbCBUcnVlbm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRvbm5lcnNlbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUb25uZWNyZXZhc3NlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4NTA2Ljc1LCAxMDgyNC41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUeXRvbmUgUGVyY2ggUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBQZXJjaGEgZGUgVHl0b25lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUeXRvbmVud2FydGUtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFBlcmNob2lyIGRlIFR5dG9uZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc4NTIuODksIDk4NTUuNTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkluZmVybm8ncyBOZWVkbGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWphIGRlbCBJbmZpZXJub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSW5mZXJub25hZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBaWd1aWxsZSBpbmZlcm5hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTA0Ljg0LCAxMDU5OC41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZWdhemUgU3BpcmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWphIGRlIE1pcmFwaWVkcmFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVpbmJsaWNrLVphY2tlbnN0YWJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBpYyBkZSBQaWVycmVnYXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzE2NC40NiwgOTgwNS4xNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW5mZXJubydzIE5lZWRsZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEFndWphIGRlbCBJbmZpZXJub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSW5mZXJub25hZGVsLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBsJ0FpZ3VpbGxlIGluZmVybmFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1ODEuOTEsIDEwMzE2LjRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0YXR1YXJ5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc3RhdHVhcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGF0dWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlN0YXR1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzU1My4xMiwgOTM2MC4xNl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzRDMDExM0I2REYyRTRFMkNCQjkzMjQ0QUQ1MERBNDk0NTZENTAxNEUvNzMwNDEyLnBuZ1wiXHJcbiAgICB9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYmF0Y2hBY3Rpb25zID0gYmF0Y2hBY3Rpb25zO1xuZXhwb3J0cy5lbmFibGVCYXRjaGluZyA9IGVuYWJsZUJhdGNoaW5nO1xudmFyIEJBVENIID0gJ0JBVENISU5HX1JFRFVDRVIuQkFUQ0gnO1xuXG5leHBvcnRzLkJBVENIID0gQkFUQ0g7XG5cbmZ1bmN0aW9uIGJhdGNoQWN0aW9ucyhhY3Rpb25zKSB7XG5cdHJldHVybiB7IHR5cGU6IEJBVENILCBwYXlsb2FkOiBhY3Rpb25zIH07XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUJhdGNoaW5nKHJlZHVjZSkge1xuXHRyZXR1cm4gZnVuY3Rpb24gYmF0Y2hpbmdSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcblx0XHRzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cdFx0XHRjYXNlIEJBVENIOlxuXHRcdFx0XHRyZXR1cm4gYWN0aW9uLnBheWxvYWQucmVkdWNlKGJhdGNoaW5nUmVkdWNlciwgc3RhdGUpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHJlZHVjZShzdGF0ZSwgYWN0aW9uKTtcblx0XHR9XG5cdH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB0aHVua01pZGRsZXdhcmUoX3JlZikge1xuICB2YXIgZGlzcGF0Y2ggPSBfcmVmLmRpc3BhdGNoO1xuICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIDogbmV4dChhY3Rpb24pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGh1bmtNaWRkbGV3YXJlOyJdfQ==
