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

},{"./guilds":2,"./matchDetails":4,"./matches":5,"constants/actionTypes":42,"immutable":"immutable","lib/api":43,"redux-batched-actions":61}],2:[function(require,module,exports){
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

},{"constants/actionTypes":42}],3:[function(require,module,exports){
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

},{"constants/actionTypes":42}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveMatchDetailsFailed = exports.receiveMatchDetailsSuccess = exports.receiveMatchDetails = exports.processMatchDetails = exports.clearMatchDetails = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxBatchedActions = require('redux-batched-actions');

var _static = require('lib/static');

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

},{"actions/api":1,"actions/objectives":7,"constants/actionTypes":42,"immutable":"immutable","lib/static":45,"redux-batched-actions":61}],5:[function(require,module,exports){
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

},{"constants/actionTypes":42,"lodash":"lodash"}],6:[function(require,module,exports){
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

},{"constants/actionTypes":42}],7:[function(require,module,exports){
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

},{"constants/actionTypes":42,"moment":"moment"}],8:[function(require,module,exports){
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

},{"constants/actionTypes":42}],9:[function(require,module,exports){
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

},{"constants/actionTypes":42}],10:[function(require,module,exports){
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

},{"constants/actionTypes":42}],11:[function(require,module,exports){
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

},{"actions/lang":3,"actions/objectives":7,"actions/route":8,"actions/world":10,"components/Layout/Container":12,"components/Overview":22,"components/Tracker":35,"components/util/Perf":41,"domready":"domready","page":"page","react":"react","react-addons-perf":"react-addons-perf","react-dom":"react-dom","react-redux":"react-redux","reducers":49,"redux":"redux","redux-batched-actions":61,"redux-thunk":62}],12:[function(require,module,exports){
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

},{"components/Layout/Footer":13,"components/Layout/Langs":15,"components/Layout/NavbarHeader":16,"lodash":"lodash","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],13:[function(require,module,exports){
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

},{"react":"react"}],14:[function(require,module,exports){
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

},{"classnames":"classnames","lib/static":45,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],15:[function(require,module,exports){
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

},{"./LangLink":14,"lib/static":45,"react":"react"}],16:[function(require,module,exports){
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

},{"classnames":"classnames","immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],17:[function(require,module,exports){
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

},{"./MatchWorld":19,"immutable":"immutable","lib/static":45,"lodash":"lodash","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],18:[function(require,module,exports){
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

},{"components/common/Icons/Pie":36,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],19:[function(require,module,exports){
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

},{"./MatchPie":18,"lib/static":45,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],20:[function(require,module,exports){
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

},{"./Match":17,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],21:[function(require,module,exports){
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

},{"immutable":"immutable","lib/static":45,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],22:[function(require,module,exports){
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

},{"./Matches":20,"./Worlds":21,"actions/api":1,"actions/timeouts":9,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],23:[function(require,module,exports){
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

},{"components/common/icons/Emblem":39,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],24:[function(require,module,exports){
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

},{"./Guild":23,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('lib/redux');

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

var sortedObjectivesSelector = (0, _redux.createImmutableSelector)(objectivesSelector, function (objectives) {
    return objectives.sortBy(function (o) {
        return -o.get('lastFlipped');
    });
});

var mapStateToProps = (0, _redux.createImmutableSelector)(sortedObjectivesSelector, function (sortedObjectives) {
    return { objectives: sortedObjectives };
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
                objectives.keySeq().map(function (id) {
                    return _react2.default.createElement(_Entry2.default, { key: id, id: id });
                })
            );
        }
    }]);

    return Entries;
}(_react2.default.Component);

Entries.propTypes = {
    objectives: _reactImmutableProptypes2.default.map.isRequired,

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

},{"./Entry":26,"lib/redux":44,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],26:[function(require,module,exports){
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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Emblem = require('components/common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

var _Objective = require('components/common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _Arrow = require('components/common/icons/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { createSelector } from 'reselect';

// import Sprite from 'components/common/icons/Sprite';


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

var objectiveSelector = (0, _redux.createImmutableSelector)(objectiveIdSelector, objectivesSelector, function (id, objectives) {
    return objectives.get(id);
});
var guildSelector = (0, _redux.createImmutableSelector)(guildsSelector, objectiveSelector, function (guilds, objective) {
    return guilds.get(objective.get('guild'), _immutable2.default.Map());
});

var mapStateToProps = (0, _redux.createImmutableSelector)(langSelector, nowSelector, guildSelector, objectiveSelector, objectiveIdSelector, function (lang, now, guild, objective, id) {
    return {
        lang: lang,
        now: now,
        guild: guild,
        objective: objective,
        id: id
    };
});

// const mapStateToProps = (state, props) => {
//     return {
//         lang: state.lang,
//         guild: state.guilds.get(
//             props.objective.get('guild'),
//             Immutable.Map()
//         ),
//         // entries,
//         id: props.id,
//         objective: props.objective,
//     };
// };

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
            var guild = _props.guild;
            var lang = _props.lang;
            var now = _props.now;
            var objective = _props.objective;


            var shouldUpdate = !now.isSame(nextProps.now) && objective.get('expires').diff() > -5000 || !lang.equals(nextProps.lang) || !objective.equals(nextProps.objective) || !guild.equals(nextProps.guild);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var id = _props2.id;
            var lang = _props2.lang;
            var now = _props2.now;
            var objective = _props2.objective;
            var guild = _props2.guild;

            // const lastFlipped = moment.unix(objective.get('lastFlipped'));
            // const lastClaimed = moment.unix(objective.get('lastClaimed'));
            // const lastmod = moment.unix(objective.get('lastmod'));
            // const expires = moment.unix(objective.get('expires'));

            var lastFlipped = objective.get('lastFlipped');
            var lastClaimed = objective.get('lastClaimed');
            var lastmod = objective.get('lastmod');
            var expires = objective.get('expires');

            // const expires = lastFlipped.add(5, 'm');

            // console.log(id);

            return _react2.default.createElement(
                'li',
                { key: id, className: 'team ' + objective.get('owner') },
                _react2.default.createElement(
                    'ul',
                    { className: 'list-unstyled log-objective' },
                    _react2.default.createElement(
                        'li',
                        { className: 'log-expire' },
                        expires.isAfter() ? (0, _moment2.default)(expires.diff(now, 'milliseconds')).format('m:ss') : null
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-time' },
                        (0, _moment2.default)().diff(lastFlipped, 'hours') < 1 ? lastFlipped.format('hh:mm:ss') : lastFlipped.fromNow(true)
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-geo' },
                        _react2.default.createElement(_Arrow2.default, { direction: getObjectiveDirection(objective.get('id')) })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-sprite' },
                        _react2.default.createElement(_Objective2.default, { color: objective.get('owner'), type: objective.get('type') })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-name' },
                        STATIC.objectives[id].name[lang.get('slug')]
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-guild' },
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
                    )
                )
            );
        }
    }]);

    return Entry;
}(_react2.default.Component);

Entry.propTypes = {
    id: _react2.default.PropTypes.string.isRequired,
    guild: _react2.default.PropTypes.object.isRequired,
    lang: _reactImmutableProptypes2.default.map.isRequired,
    now: _react2.default.PropTypes.object.isRequired,
    objective: _reactImmutableProptypes2.default.map.isRequired
};
;

// {_.map(entries, entry =>
//     <li key={entry.id} className={`team ${entry.owner}`}>
//         <ul className='list-unstyled log-objective'>
//             <li className='log-expire'>{
//                 entry.expires.isAfter(now)
//                     ? moment(entry.expires.diff(now, 'milliseconds')).format('m:ss')
//                     : null
//             }</li>
//             <li className='log-time'>{
//                 (moment().diff(entry.lastFlipped, 'hours') < 4)
//                     ? entry.lastFlipped.format('hh:mm:ss')
//                     : entry.lastFlipped.fromNow(true)
//             }</li>
//             <li className='log-geo'><ArrowIcon direction={getObjectiveDirection(entry)} /></li>
//             <li className='log-sprite'><ObjectiveIcon color={entry.owner} type={entry.type} /></li>
//             {(mapFilter === '') ? <li className='log-map'>{getMap(entry).abbr}</li> : null}
//             <li className='log-name'>{STATIC.objectives[entry.id].name[lang.get('slug')]}</li>
//             {/*<li className='log-claimed'>{
//                 (entry.lastClaimed.isValid())
//                     ? entry.lastClaimed.format('hh:mm:ss')
//                     : null
//             }</li>*/}
//             <li className='log-guild'>{
//                 (entry.guild)
//                     ? <a href={'#' + entry.guild}>
//                         <Emblem guildId={entry.guild} />
//                         {guild[entry.guild] ? <span className='guild-name'> {guild[entry.guild].name} </span> :  null}
//                         {guild[entry.guild] ? <span className='guild-tag'> [{guild[entry.guild].tag}] </span> :  null}
//                     </a>
//                     : null
//             }</li>
//         </ul>
//     </li>
// )}

Entry = (0, _reactRedux.connect)(mapStateToProps)(Entry);

function getObjectiveDirection(id) {
    var baseId = id.split('-')[1].toString();
    var meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}

function getMap(objective) {
    var mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, function (mm) {
        return mm.id == mapId;
    });
}

exports.default = Entry;

},{"components/common/icons/Arrow":38,"components/common/icons/Emblem":39,"components/common/icons/Objective":40,"immutable":"immutable","lib/redux":44,"lib/static":45,"moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Objective = require('components/common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var maps = _ref.maps;
    var _ref$mapFilter = _ref.mapFilter;
    var mapFilter = _ref$mapFilter === undefined ? '' : _ref$mapFilter;
    var _ref$typeFilter = _ref.typeFilter;
    var typeFilter = _ref$typeFilter === undefined ? '' : _ref$typeFilter;
    var handleMapFilterClick = _ref.handleMapFilterClick;
    var handleTypeFilterClick = _ref.handleTypeFilterClick;

    return _react2.default.createElement(
        'div',
        { id: 'log-tabs', className: 'flex-tabs' },
        _react2.default.createElement('a', {
            className: (0, _classnames2.default)({ tab: true, active: !mapFilter }),
            onClick: function onClick() {
                return handleMapFilterClick('');
            },
            children: 'All'
        }),
        _.map(STATIC.mapsMeta, function (mm) {
            return maps.find(function (matchMap) {
                return matchMap.get('id') == mm.id;
            }) ? _react2.default.createElement('a', {
                key: mm.id,
                className: (0, _classnames2.default)({ tab: true, active: mapFilter == mm.id }),
                onClick: function onClick() {
                    return handleMapFilterClick(_.parseInt(mm.id));
                },
                title: mm.name,
                children: mm.abbr
            }) : null;
        }),
        _.map(['castle', 'keep', 'tower', 'camp'], function (t) {
            return _react2.default.createElement(
                'a',
                { key: t,
                    className: (0, _classnames2.default)({
                        check: true,
                        active: typeFilter[t],
                        first: t === 'castle'
                    }),
                    onClick: function onClick() {
                        return handleTypeFilterClick(t);
                    } },
                _react2.default.createElement(_Objective2.default, { type: t, size: 18 })
            );
        })
    );
};

},{"classnames":"classnames","components/common/icons/Objective":40,"lib/static":45,"react":"react"}],28:[function(require,module,exports){
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

},{"./Entries":25,"./Tabs":27,"immutable":"immutable","lib/redux":44,"react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],29:[function(require,module,exports){
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

},{"./Objective":30,"classnames":"classnames","lib/static":45,"lodash":"lodash","react":"react"}],30:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Arrow":38,"components/common/icons/Emblem":39,"components/common/icons/Objective":40,"lib/static":45,"lodash":"lodash","moment":"moment","react":"react"}],31:[function(require,module,exports){
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

},{"./MatchMap":29,"lib/static":45,"lodash":"lodash","react":"react"}],32:[function(require,module,exports){
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

},{"components/common/Icons/Sprite":37,"react":"react"}],33:[function(require,module,exports){
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

},{"./Holdings":32,"immutable":"immutable","lib/static":45,"numeral":"numeral","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],34:[function(require,module,exports){
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

},{"./World":33,"immutable":"immutable","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux"}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _redux = require('lib/redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

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
var apiSelector = function apiSelector(state) {
    return state.api;
};
var langSelector = function langSelector(state) {
    return state.lang;
};
// const nowSelector = (state) => state.now;
// const matchDetailsSelector = (state) => state.matchDetails;
// const guildsSelector = (state) => state.guilds;
var worldSelector = function worldSelector(state) {
    return state.world;
};

var detailsIsFetchingSelector = (0, _redux.createImmutableSelector)(apiSelector, function (api) {
    return api.get('pending').includes('matchDetails');
});

var mapStateToProps = (0, _redux.createImmutableSelector)(langSelector,
// nowSelector,
// guildsSelector,
// matchDetailsSelector,
worldSelector, detailsIsFetchingSelector, function (lang,
// now,
// guilds,
// matchDetails,
world, detailsIsFetching) {
    return {
        lang: lang,
        // now,
        // guilds,
        // matchDetails,
        world: world,
        detailsIsFetching: detailsIsFetching
    };
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
            var detailsIsFetching = _props2.detailsIsFetching;
            var fetchMatchDetails = _props2.fetchMatchDetails;
            var setAppTimeout = _props2.setAppTimeout;


            if (!lang.equals(nextProps.lang) || world.slug !== nextProps.world.slug) {
                setPageTitle(nextProps.lang, nextProps.world);
            }

            if (detailsIsFetching && !nextProps.detailsIsFetching) {
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
    detailsIsFetching: _react2.default.PropTypes.bool.isRequired,
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

},{"./Guilds":24,"./Log":28,"./Maps":31,"./Scoreboard":34,"actions/api":1,"actions/now":6,"actions/timeouts":9,"immutable":"immutable","lib/redux":44,"lodash":"lodash","moment":"moment","react":"react","react-immutable-proptypes":"react-immutable-proptypes","react-redux":"react-redux","reselect":"reselect"}],36:[function(require,module,exports){
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

},{"react":"react"}],37:[function(require,module,exports){
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

},{"react":"react"}],38:[function(require,module,exports){
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

},{"react":"react"}],39:[function(require,module,exports){
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

},{"react":"react"}],40:[function(require,module,exports){
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

    var src = '/img/icons/dist/';
    src += type;
    if (color !== 'black') {
        src += '-' + color;
    }
    src += '.svg';

    return _react2.default.createElement('img', {
        src: src,
        className: 'icon-objective icon-objective-' + type,
        width: size ? size : null,
        height: size ? size : null
    });
};

exports.default = Objective;

},{"react":"react"}],41:[function(require,module,exports){
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

},{"react":"react","react-addons-perf":"react-addons-perf"}],42:[function(require,module,exports){
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

/*
*   Tracker
*/

},{}],43:[function(require,module,exports){
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

},{"superagent":"superagent"}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createImmutableSelector = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create a "selector creator" that uses Immutable.is instead of ===
var createImmutableSelector = exports.createImmutableSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _immutable2.default.is);

},{"immutable":"immutable","reselect":"reselect"}],45:[function(require,module,exports){
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

},{"gw2w2w-static/data/langs":58,"gw2w2w-static/data/objectives_v2_merged":59,"gw2w2w-static/data/world_names":60,"lodash":"lodash"}],46:[function(require,module,exports){
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

},{"lib/static":45}],47:[function(require,module,exports){
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

},{"constants/actionTypes":42,"immutable":"immutable"}],48:[function(require,module,exports){
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

},{"constants/actionTypes":42,"immutable":"immutable"}],49:[function(require,module,exports){
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
    matches: _matches2.default,
    matchDetails: _matchDetails2.default,
    now: _now2.default,
    objectives: _objectives2.default,
    route: _route2.default,
    timeouts: _timeouts2.default,
    world: _world2.default
});

},{"./api":47,"./guilds":48,"./lang":50,"./matchDetails":51,"./matches":52,"./now":53,"./objectives":54,"./route":55,"./timeouts":56,"./world":57,"redux":"redux"}],50:[function(require,module,exports){
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

},{"constants/actionTypes":42,"immutable":"immutable","lib/static":45}],51:[function(require,module,exports){
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
    worlds: rgbNum
});

var matchDetails = function matchDetails() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::matchDetails', state, action);

    switch (action.type) {

        case _actionTypes.RECEIVE_MATCHDETAILS:
            // console.log('reducer::matchDetails', action);
            return state.set('id', action.id).set('guildIds', action.guildIds).set('maps', action.maps).set('objectiveIds', action.objectiveIds).set('region', action.region).set('stats', action.stats).set('times', action.times).set('worlds', action.worlds);

        case _actionTypes.CLEAR_MATCHDETAILS:
            return defaultState;

        case _actionTypes.RECEIVE_MATCHDETAILS_SUCCESS:
            // console.log('reducer::matchDetails', action);

            return state.has('error') ? state.delete('error') : state;

        case _actionTypes.RECEIVE_MATCHDETAILS_FAILED:
            console.log('reducer::matchDetails', action);

            return state.set('error', action.err.message);

        default:
            return state;
    }
};

exports.default = matchDetails;

},{"constants/actionTypes":42,"immutable":"immutable"}],52:[function(require,module,exports){
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

},{"constants/actionTypes":42,"immutable":"immutable"}],53:[function(require,module,exports){
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

},{"constants/actionTypes":42,"moment":"moment"}],54:[function(require,module,exports){
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
            console.log('reducer::objectives', action);

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

},{"constants/actionTypes":42,"immutable":"immutable"}],55:[function(require,module,exports){
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

},{"constants/actionTypes":42}],56:[function(require,module,exports){
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

},{"constants/actionTypes":42,"lodash":"lodash"}],57:[function(require,module,exports){
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

},{"constants/actionTypes":42,"lib/worlds":46}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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
},{}],62:[function(require,module,exports){
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
},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGFwaS5qcyIsImFwcFxcYWN0aW9uc1xcZ3VpbGRzLmpzIiwiYXBwXFxhY3Rpb25zXFxsYW5nLmpzIiwiYXBwXFxhY3Rpb25zXFxtYXRjaERldGFpbHMuanMiLCJhcHBcXGFjdGlvbnNcXG1hdGNoZXMuanMiLCJhcHBcXGFjdGlvbnNcXG5vdy5qcyIsImFwcFxcYWN0aW9uc1xcb2JqZWN0aXZlcy5qcyIsImFwcFxcYWN0aW9uc1xccm91dGUuanMiLCJhcHBcXGFjdGlvbnNcXHRpbWVvdXRzLmpzIiwiYXBwXFxhY3Rpb25zXFx3b3JsZC5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXENvbnRhaW5lci5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxGb290ZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTGFuZ3NcXExhbmdMaW5rLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXExhbmdzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxOYXZiYXJIZWFkZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxNYXRjaC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXE1hdGNoUGllLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2hXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcV29ybGRzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXEd1aWxkLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXEVudHJpZXMuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcRW50cnkuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcVGFicy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcTWF0Y2hNYXAuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXE9iamVjdGl2ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXEhvbGRpbmdzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXEljb25zXFxQaWUuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcSWNvbnNcXFNwcml0ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcQXJyb3cuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXEVtYmxlbS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcT2JqZWN0aXZlLmpzIiwiYXBwXFxjb21wb25lbnRzXFx1dGlsXFxQZXJmLmpzIiwiYXBwXFxjb25zdGFudHNcXGFjdGlvblR5cGVzLmpzIiwiYXBwXFxsaWJcXGFwaS5qcyIsImFwcFxcbGliXFxyZWR1eC5qcyIsImFwcFxcbGliXFxzdGF0aWNcXGluZGV4LmpzIiwiYXBwXFxsaWJcXHdvcmxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGFwaS5qcyIsImFwcFxccmVkdWNlcnNcXGd1aWxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGluZGV4LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbGFuZy5qcyIsImFwcFxccmVkdWNlcnNcXG1hdGNoRGV0YWlscy5qcyIsImFwcFxccmVkdWNlcnNcXG1hdGNoZXMuanMiLCJhcHBcXHJlZHVjZXJzXFxub3cuanMiLCJhcHBcXHJlZHVjZXJzXFxvYmplY3RpdmVzLmpzIiwiYXBwXFxyZWR1Y2Vyc1xccm91dGUuanMiLCJhcHBcXHJlZHVjZXJzXFx0aW1lb3V0cy5qcyIsImFwcFxccmVkdWNlcnNcXHdvcmxkLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzLmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWJhdGNoZWQtYWN0aW9ucy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVkdXgtdGh1bmsvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDd0NPLElBQU0sb0NBQWMsU0FBZCxXQUFjLE9BQW9CO1FBQWpCLDZCQUFpQjs7OztBQUczQyxXQUFPO0FBQ0gsMkNBREc7QUFFSCw4QkFGRztLQUFQLENBSDJDO0NBQXBCOztBQVdwQixJQUFNLDBDQUFpQixTQUFqQixjQUFpQixRQUFvQjtRQUFqQiw4QkFBaUI7Ozs7QUFHOUMsV0FBTztBQUNILDhDQURHO0FBRUgsOEJBRkc7S0FBUCxDQUg4QztDQUFwQjs7QUFXdkIsSUFBTSx3Q0FBZ0IsU0FBaEIsYUFBZ0IsUUFBb0I7UUFBakIsOEJBQWlCOzs7O0FBRzdDLFdBQU87QUFDSCw2Q0FERztBQUVILDhCQUZHO0tBQVAsQ0FINkM7Q0FBcEI7O0FBV3RCLElBQU0s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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdC9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgeyBiYXRjaEFjdGlvbnMgfSBmcm9tICdyZWR1eC1iYXRjaGVkLWFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgQVBJX1JFUVVFU1RfT1BFTixcclxuICAgIEFQSV9SRVFVRVNUX1NVQ0NFU1MsXHJcbiAgICBBUElfUkVRVUVTVF9GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgcmVjZWl2ZU1hdGNoZXMsXHJcbiAgICByZWNlaXZlTWF0Y2hlc0ZhaWxlZCxcclxuICAgIHJlY2VpdmVNYXRjaGVzU3VjY2VzcyxcclxuICAgIGdldE1hdGNoZXNMYXN0bW9kLFxyXG59IGZyb20gJy4vbWF0Y2hlcyc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIHByb2Nlc3NNYXRjaERldGFpbHMsXHJcbiAgICAvLyByZWNlaXZlTWF0Y2hEZXRhaWxzLFxyXG4gICAgcmVjZWl2ZU1hdGNoRGV0YWlsc1N1Y2Nlc3MsXHJcbiAgICByZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkLFxyXG59IGZyb20gJy4vbWF0Y2hEZXRhaWxzJztcclxuXHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIGluaXRpYWxpemVHdWlsZCxcclxuICAgIHJlY2VpdmVHdWlsZCxcclxuICAgIHJlY2VpdmVHdWlsZEZhaWxlZCxcclxufSBmcm9tICcuL2d1aWxkcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVxdWVzdE9wZW4gPSAoeyByZXF1ZXN0S2V5IH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlcXVlc3RNYXRjaGVzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBUElfUkVRVUVTVF9PUEVOLFxyXG4gICAgICAgIHJlcXVlc3RLZXksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVxdWVzdFN1Y2Nlc3MgPSAoeyByZXF1ZXN0S2V5IH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlcXVlc3RNYXRjaGVzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBUElfUkVRVUVTVF9TVUNDRVNTLFxyXG4gICAgICAgIHJlcXVlc3RLZXksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVxdWVzdEZhaWxlZCA9ICh7IHJlcXVlc3RLZXkgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVxdWVzdE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IEFQSV9SRVFVRVNUX0ZBSUxFRCxcclxuICAgICAgICByZXF1ZXN0S2V5LFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoTWF0Y2hlcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0S2V5ID0gJ21hdGNoZXMnO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChyZXF1ZXN0T3Blbih7IHJlcXVlc3RLZXkgfSkpO1xyXG5cclxuICAgICAgICBhcGkuZ2V0TWF0Y2hlcyh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OnN1Y2Nlc3MnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFN1Y2Nlc3MoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYXRjaGVzU3VjY2VzcygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYXRjaGVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogSW1tdXRhYmxlLmZyb21KUyhkYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IGdldE1hdGNoZXNMYXN0bW9kKGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjplcnJvcicsIGVycik7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChiYXRjaEFjdGlvbnMoW1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RGYWlsZWQoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYXRjaGVzRmFpbGVkKHsgZXJyIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjpjb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoTWF0Y2hEZXRhaWxzID0gKHsgd29ybGQgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzJywgd29ybGQpO1xyXG5cclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0S2V5ID0gYG1hdGNoRGV0YWlsc2A7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHJlcXVlc3RPcGVuKHsgcmVxdWVzdEtleSB9KSk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaEJ5V29ybGRJZCh7XHJcbiAgICAgICAgICAgIHdvcmxkSWQ6IHdvcmxkLmlkLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjpzdWNjZXNzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChiYXRjaEFjdGlvbnMoW1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RTdWNjZXNzKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hEZXRhaWxzU3VjY2VzcygpLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc01hdGNoRGV0YWlscyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IEltbXV0YWJsZS5mcm9tSlMoZGF0YSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6ZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RmFpbGVkKHsgcmVxdWVzdEtleSB9KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkKHsgZXJyIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjpjb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hHdWlsZEJ5SWQgPSAoeyBndWlsZElkIH0pID0+IHtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdEtleSA9IGBndWlsZC0keyBndWlsZElkIH1gO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDonLCByZXF1ZXN0S2V5KTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgcmVxdWVzdE9wZW4oeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplR3VpbGQoeyBndWlsZElkIH0pLFxyXG4gICAgICAgIF0pKTtcclxuXHJcbiAgICAgICAgYXBpLmdldEd1aWxkQnlJZCh7XHJcbiAgICAgICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDo6c3VjY2VzcycsIHJlcXVlc3RLZXksIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFN1Y2Nlc3MoeyByZXF1ZXN0S2V5IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVHdWlsZCh7IGd1aWxkSWQsIGRhdGEgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaEd1aWxkQnlJZDo6ZXJyb3InLCByZXF1ZXN0S2V5LCBlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEZhaWxlZCh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZUd1aWxkRmFpbGVkKHsgZ3VpbGRJZCwgZXJyIH0pLFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hHdWlsZEJ5SWQ6OmNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7O1xyXG4gICAgfTtcclxufTtcclxuXHJcbiIsIi8vIGltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgSU5JVElBTElaRV9HVUlMRCxcclxuICAgIFJFQ0VJVkVfR1VJTEQsXHJcbiAgICBSRUNFSVZFX0dVSUxEX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUd1aWxkID0gKHsgZ3VpbGRJZCB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlR3VpbGQnLCBndWlsZElkKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IElOSVRJQUxJWkVfR1VJTEQsXHJcbiAgICAgICAgZ3VpbGRJZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlR3VpbGQgPSAoeyBndWlsZElkLCBkYXRhIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVHdWlsZCcsIGd1aWxkSWQsIGRhdGEpO1xyXG4vL1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX0dVSUxELFxyXG4gICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgbmFtZTogZGF0YS5ndWlsZF9uYW1lLFxyXG4gICAgICAgIHRhZzogZGF0YS50YWcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZUd1aWxkRmFpbGVkID0gKHsgZ3VpbGRJZCwgZXJyIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVHdWlsZEZhaWxlZCcsIGd1aWxkSWQsIGVycik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX0dVSUxEX0ZBSUxFRCxcclxuICAgICAgICBndWlsZElkLFxyXG4gICAgICAgIGVycixcclxuICAgIH07XHJcbn07IiwiaW1wb3J0IHsgU0VUX0xBTkcgfSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRMYW5nID0gc2x1ZyA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRMYW5nJywgc2x1Zyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfTEFORyxcclxuICAgICAgICBzbHVnLFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgeyBiYXRjaEFjdGlvbnMgfSBmcm9tICdyZWR1eC1iYXRjaGVkLWFjdGlvbnMnO1xyXG5cclxuXHJcbmltcG9ydCB7IHdvcmxkcyBhcyBTVEFUSUNfV09STERTIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIENMRUFSX01BVENIREVUQUlMUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTLFxyXG4gICAgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuLy8gaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICdhY3Rpb25zL21hdGNoRGV0YWlscyc7XHJcbmltcG9ydCB7IGZldGNoR3VpbGRCeUlkIH0gZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQge1xyXG4gICAgdXBkYXRlT2JqZWN0aXZlLFxyXG4gICAgdXBkYXRlT2JqZWN0aXZlcyxcclxufSBmcm9tICdhY3Rpb25zL29iamVjdGl2ZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJNYXRjaERldGFpbHMgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhck1hdGNoRGV0YWlscycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQ0xFQVJfTUFUQ0hERVRBSUxTLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHByb2Nlc3NNYXRjaERldGFpbHMgPSAoeyBkYXRhIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnByb2Nlc3NNYXRjaERldGFpbHMnKTtcclxuXHJcbiAgICBjb25zdCBpZCA9IGRhdGEuZ2V0KCdpZCcpO1xyXG4gICAgY29uc3QgcmVnaW9uID0gZGF0YS5nZXQoJ3JlZ2lvbicpO1xyXG4gICAgY29uc3Qgd29ybGRzID0gZGF0YS5nZXQoJ3dvcmxkcycpO1xyXG5cclxuICAgIGNvbnN0IG1hcHMgPSBnZXRNYXBzKGRhdGEpO1xyXG4gICAgY29uc3Qgc3RhdHMgPSBnZXRTdGF0cyhkYXRhKTtcclxuICAgIGNvbnN0IHRpbWVzID0gZ2V0VGltZXMoZGF0YSk7XHJcbiAgICAvLyBjb25zdCB3b3JsZHMgPSBnZXRXb3JsZHMoZGF0YSk7XHJcblxyXG4gICAgY29uc3QgZ3VpbGRJZHMgPSBnZXRHdWlsZElkcyhtYXBzKTtcclxuICAgIGNvbnN0IG9iamVjdGl2ZUlkcyA9IGdldE9iamVjdGl2ZUlkcyhtYXBzKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ2lkJywgaWQpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdyZWdpb24nLCByZWdpb24pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdzdGF0cycsIHN0YXRzLnRvSlMoKSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hEZXRhaWxzJywgJ3RpbWVzJywgdGltZXMudG9KUygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnd29ybGRzJywgd29ybGRzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnbWFwcycsIG1hcHMudG9KUygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHMnLCAnZ3VpbGRJZHMnLCBndWlsZElkcy50b0pTKCkpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoRGV0YWlscycsICdvYmplY3RpdmVJZHMnLCBvYmplY3RpdmVJZHMudG9KUygpKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChyZWNlaXZlTWF0Y2hEZXRhaWxzKHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIHJlZ2lvbixcclxuXHJcbiAgICAgICAgICAgIGd1aWxkSWRzLFxyXG4gICAgICAgICAgICBtYXBzLFxyXG4gICAgICAgICAgICBvYmplY3RpdmVJZHMsXHJcbiAgICAgICAgICAgIHN0YXRzLFxyXG4gICAgICAgICAgICB0aW1lcyxcclxuICAgICAgICAgICAgd29ybGRzLFxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2hHdWlsZExvb2t1cHMoZGlzcGF0Y2gsIGdldFN0YXRlKCkuZ3VpbGRzLCBndWlsZElkcyk7XHJcbiAgICAgICAgZGlzcGF0Y2hPYmplY3RpdmVVcGRhdGVzKGRpc3BhdGNoLCBkYXRhLmdldCgnbWFwcycpKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcmV0dXJuIHtcclxuICAgIC8vICAgICB0eXBlOiBSRUNFSVZFX01BVENIREVUQUlMUyxcclxuXHJcbiAgICAvLyAgICAgaWQsXHJcbiAgICAvLyAgICAgcmVnaW9uLFxyXG5cclxuICAgIC8vICAgICBndWlsZElkcyxcclxuICAgIC8vICAgICBtYXBzLFxyXG4gICAgLy8gICAgIG9iamVjdGl2ZUlkcyxcclxuICAgIC8vICAgICBzdGF0cyxcclxuICAgIC8vICAgICB0aW1lcyxcclxuICAgIC8vICAgICB3b3JsZHMsXHJcbiAgICAvLyB9O1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoR3VpbGRMb29rdXBzKGRpc3BhdGNoLCBzdGF0ZUd1aWxkcywgZ3VpbGRJZHMpIHtcclxuICAgIGNvbnN0IGtub3duR3VpbGRzID0gc3RhdGVHdWlsZHMua2V5U2VxKCkudG9TZXQoKTtcclxuICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSBndWlsZElkcy5zdWJ0cmFjdChrbm93bkd1aWxkcyk7XHJcblxyXG5cclxuICAgIHVua25vd25HdWlsZHMuZm9yRWFjaChcclxuICAgICAgICAoZ3VpbGRJZCkgPT4gZGlzcGF0Y2goZmV0Y2hHdWlsZEJ5SWQoeyBndWlsZElkIH0pKVxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoT2JqZWN0aXZlVXBkYXRlcyhkaXNwYXRjaCwgbWFwcykge1xyXG4gICAgbGV0IG9iamVjdGl2ZXMgPSBJbW11dGFibGUuTWFwKCk7XHJcblxyXG5cclxuICAgIG1hcHMuZm9yRWFjaChcclxuICAgICAgICBtID0+IG0uZ2V0KCdvYmplY3RpdmVzJykuZm9yRWFjaChcclxuICAgICAgICAgICAgKG9iamVjdGl2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0aXZlcyA9IG9iamVjdGl2ZXMuc2V0SW4oXHJcbiAgICAgICAgICAgICAgICAgICAgW29iamVjdGl2ZS5nZXQoJ2lkJyldLFxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgICk7XHJcbiAgICAvLyBtYXBzLmZvckVhY2goXHJcbiAgICAvLyAgICAgbSA9PiBtLmdldCgnb2JqZWN0aXZlcycpLmZvckVhY2goXHJcbiAgICAvLyAgICAgICAgIChvYmplY3RpdmUpID0+IGRpc3BhdGNoKHVwZGF0ZU9iamVjdGl2ZSh7IG9iamVjdGl2ZSB9KSlcclxuICAgIC8vICAgICApXHJcbiAgICAvLyApO1xyXG5cclxuICAgIGRpc3BhdGNoKHVwZGF0ZU9iamVjdGl2ZXMoeyBvYmplY3RpdmVzIH0pKTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaERldGFpbHMgPSAoe1xyXG4gICAgaWQsXHJcbiAgICByZWdpb24sXHJcbiAgICBndWlsZElkcyxcclxuICAgIG1hcHMsXHJcbiAgICBvYmplY3RpdmVJZHMsXHJcbiAgICBzdGF0cyxcclxuICAgIHRpbWVzLFxyXG4gICAgd29ybGRzLFxyXG59KSA9PiAoe1xyXG4gICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFMsXHJcblxyXG4gICAgaWQsXHJcbiAgICByZWdpb24sXHJcblxyXG4gICAgZ3VpbGRJZHMsXHJcbiAgICBtYXBzLFxyXG4gICAgb2JqZWN0aXZlSWRzLFxyXG4gICAgc3RhdHMsXHJcbiAgICB0aW1lcyxcclxuICAgIHdvcmxkcyxcclxufSk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hEZXRhaWxzU3VjY2VzcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHNTdWNjZXNzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX01BVENIREVUQUlMU19TVUNDRVNTLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hEZXRhaWxzRmFpbGVkID0gKHsgZXJyIH0pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaERldGFpbHNGYWlsZWQnLCBlcnIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSERFVEFJTFNfRkFJTEVELFxyXG4gICAgICAgIGVycixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBzKG5vZGUpIHtcclxuICAgIGNvbnN0IG1hcHMgPSBub2RlXHJcbiAgICAgICAgLmdldCgnbWFwcycpXHJcbiAgICAgICAgLy8gLm1hcChcclxuICAgICAgICAvLyAgICAgbSA9PiBtLnNldCgnc3RhdHMnLCBnZXRTdGF0cyhtKSlcclxuICAgICAgICAvLyAgICAgICAgIC5kZWxldGUoJ2RlYXRocycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdob2xkaW5ncycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdraWxscycpXHJcbiAgICAgICAgLy8gICAgICAgICAuZGVsZXRlKCdzY29yZXMnKVxyXG4gICAgICAgIC8vICAgICAgICAgLmRlbGV0ZSgndGlja3MnKVxyXG4gICAgICAgIC8vICAgICAgICAgLnNldCgnZ3VpbGRzJywgZ2V0TWFwR3VpbGRzKG0pKVxyXG4gICAgICAgIC8vICAgICAgICAgLnVwZGF0ZSgnb2JqZWN0aXZlcycsIG9zID0+IG9zLm1hcChvID0+IG8uZ2V0KCdpZCcpKS50b09yZGVyZWRTZXQoKSlcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgIG0gPT4gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICAgICAgICAgICAgICBpZDogbS5nZXQoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBtLmdldCgndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgbGFzdG1vZDogbS5nZXQoJ2xhc3Rtb2QnKSxcclxuICAgICAgICAgICAgICAgIHN0YXRzOiBnZXRTdGF0cyhtKSxcclxuICAgICAgICAgICAgICAgIGd1aWxkczogZ2V0TWFwR3VpbGRJZHMobSksXHJcbiAgICAgICAgICAgICAgICBvYmplY3RpdmVzOiBnZXRNYXBPYmplY3RpdmVJZHMobSksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICByZXR1cm4gbWFwcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZElkcyhtYXBOb2Rlcykge1xyXG4gICAgY29uc3QgZ3VpbGRzID0gbWFwTm9kZXNcclxuICAgICAgICAubWFwKG0gPT4gbS5nZXQoJ2d1aWxkcycpKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcblxyXG4gICAgcmV0dXJuIGd1aWxkcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXBHdWlsZElkcyhtYXBOb2RlKSB7XHJcbiAgICBjb25zdCBtYXBHdWlsZHMgPSBtYXBOb2RlXHJcbiAgICAgICAgLmdldCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLm1hcChvID0+IG8uZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAuZmlsdGVyTm90KGcgPT4gZyA9PT0gbnVsbClcclxuICAgICAgICAudG9PcmRlcmVkU2V0KCk7XHJcblxyXG4gICAgcmV0dXJuIG1hcEd1aWxkcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZUlkcyhtYXBOb2Rlcykge1xyXG4gICAgY29uc3Qgb2JqZWN0aXZlcyA9IG1hcE5vZGVzXHJcbiAgICAgICAgLm1hcChtID0+IG0uZ2V0KCdvYmplY3RpdmVzJykpXHJcbiAgICAgICAgLmZsYXR0ZW4oKVxyXG4gICAgICAgIC50b09yZGVyZWRTZXQoKTtcclxuXHJcbiAgICByZXR1cm4gb2JqZWN0aXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwT2JqZWN0aXZlSWRzKG1hcE5vZGUpIHtcclxuICAgIHJldHVybiBtYXBOb2RlXHJcbiAgICAgICAgLmdldCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLm1hcChvID0+IG8uZ2V0KCdpZCcpKVxyXG4gICAgICAgIC50b09yZGVyZWRTZXQoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRzKG5vZGUpIHtcclxuICAgIHJldHVybiBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICBkZWF0aHM6IG5vZGUuZ2V0KCdkZWF0aHMnKSxcclxuICAgICAgICBraWxsczogbm9kZS5nZXQoJ2tpbGxzJyksXHJcbiAgICAgICAgaG9sZGluZ3M6IG5vZGUuZ2V0KCdob2xkaW5ncycpLFxyXG4gICAgICAgIHNjb3Jlczogbm9kZS5nZXQoJ3Njb3JlcycpLFxyXG4gICAgICAgIHRpY2tzOiBub2RlLmdldCgndGlja3MnKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUaW1lcyhkZXRhaWxzTm9kZSkge1xyXG4gICAgcmV0dXJuIEltbXV0YWJsZS5NYXAoe1xyXG4gICAgICAgIGxhc3Rtb2Q6IGRldGFpbHNOb2RlLmdldCgnbGFzdG1vZCcpLFxyXG4gICAgICAgIGVuZFRpbWU6IGRldGFpbHNOb2RlLmdldCgnc3RhcnRUaW1lJyksXHJcbiAgICAgICAgc3RhcnRUaW1lOiBkZXRhaWxzTm9kZS5nZXQoJ2VuZFRpbWUnKSxcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBnZXRXb3JsZHMoZGV0YWlsc05vZGUpIHtcclxuLy8gICAgIHJldHVybiBkZXRhaWxzTm9kZVxyXG4vLyAgICAgICAgIC5nZXQoJ3dvcmxkcycpXHJcbi8vICAgICAgICAgLm1hcCh3b3JsZElkID0+IEltbXV0YWJsZS5mcm9tSlMoU1RBVElDX1dPUkxEU1t3b3JsZElkXSkpO1xyXG4vLyB9IiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICAvLyBSRVFVRVNUX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoZXMgPSAoeyBkYXRhLCBsYXN0VXBkYXRlZCB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZWNlaXZlTWF0Y2hlcycsIGRhdGEpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSEVTLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgbGFzdFVwZGF0ZWQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hdGNoZXNTdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoZXNGYWlsZWQnLCBlcnIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVDRUlWRV9NQVRDSEVTX1NVQ0NFU1MsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzRmFpbGVkID0gKHsgZXJyIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbiAgICAgICAgZXJyLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXNMYXN0bW9kKG1hdGNoZXNEYXRhKSB7XHJcbiAgICByZXR1cm4gXy5yZWR1Y2UoXHJcbiAgICAgICAgbWF0Y2hlc0RhdGEsXHJcbiAgICAgICAgKGFjYywgbWF0Y2gpID0+IE1hdGgubWF4KG1hdGNoLmxhc3Rtb2QpLFxyXG4gICAgICAgIDBcclxuICAgICk7XHJcbn0iLCJpbXBvcnQgeyBTRVRfTk9XIH0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0Tm93ID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0Tm93Jyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfTk9XLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIE9CSkVDVElWRVNfUkVTRVQsXHJcbiAgICBPQkpFQ1RJVkVTX1VQREFURSxcclxuICAgIE9CSkVDVElWRV9VUERBVEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc2V0T2JqZWN0aXZlcyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlc2V0T2JqZWN0aXZlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogT0JKRUNUSVZFU19SRVNFVCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVPYmplY3RpdmVzID0gKHsgb2JqZWN0aXZlcyB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjp1cGRhdGVPYmplY3RpdmVzJywgb2JqZWN0aXZlcy50b0pTKCkpO1xyXG5cclxuICAgIG9iamVjdGl2ZXMgPSBvYmplY3RpdmVzLm1hcChcclxuICAgICAgICBvYmplY3RpdmUgPT5cclxuICAgICAgICBvYmplY3RpdmVcclxuICAgICAgICAgICAgLnVwZGF0ZSgnbGFzdEZsaXBwZWQnLCB2ID0+IG1vbWVudC51bml4KHYpKVxyXG4gICAgICAgICAgICAudXBkYXRlKCdsYXN0Q2xhaW1lZCcsIHYgPT4gbW9tZW50LnVuaXgodikpXHJcbiAgICAgICAgICAgIC51cGRhdGUoJ2xhc3Rtb2QnLCB2ID0+IG1vbWVudC51bml4KHYpKVxyXG4gICAgICAgICAgICAudXBkYXRlKHYgPT4gdi5zZXQoJ2V4cGlyZXMnLCB2LmdldCgnbGFzdEZsaXBwZWQnKS5hZGQoNSwgJ20nKSkpXHJcbiAgICApO1xyXG4vL1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBPQkpFQ1RJVkVTX1VQREFURSxcclxuICAgICAgICBvYmplY3RpdmVzLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZU9iamVjdGl2ZSA9ICh7IG9iamVjdGl2ZSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjp1cGRhdGVPYmplY3RpdmUnLCBvYmplY3RpdmUudG9KUygpKTtcclxuXHJcbiAgICAvLyBvYmplY3RpdmUgPSBvYmplY3RpdmUuc2V0KCdleHBpcmVzJywgb2JqZWN0aXZlLmdldCgnbGFzdEZsaXBwZWQnKSArICg1ICogNjAgKiAxMDAwKSk7XHJcbiAgICAvLyBvYmplY3RpdmUgPSBvYmplY3RpdmVcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0RmxpcHBlZCcsIHYgPT4gbW9tZW50KHYgKiAxMDAwKSlcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0Q2xhaW1lZCcsIHYgPT4gbW9tZW50KHYgKiAxMDAwKSlcclxuICAgIC8vICAgICAudXBkYXRlKCdsYXN0bW9kJywgdiA9PiBtb21lbnQodiAqIDEwMDApKTtcclxuLy9cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogT0JKRUNUSVZFX1VQREFURSxcclxuICAgICAgICBvYmplY3RpdmUsXHJcbiAgICB9O1xyXG59OyIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1JPVVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFJvdXRlID0gKGN0eCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfUk9VVEUsXHJcbiAgICAgICAgcGF0aDogY3R4LnBhdGgsXHJcbiAgICAgICAgcGFyYW1zOiBjdHgucGFyYW1zLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBBRERfVElNRU9VVCxcclxuICAgIFJFTU9WRV9USU1FT1VULFxyXG4gICAgLy8gUkVNT1ZFX0FMTF9USU1FT1VUUyxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0QXBwVGltZW91dCA9ICh7XHJcbiAgICBuYW1lLFxyXG4gICAgY2IsXHJcbiAgICB0aW1lb3V0LFxyXG59KSA9PiB7XHJcbiAgICB0aW1lb3V0ID0gKHR5cGVvZiB0aW1lb3V0ID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgID8gdGltZW91dCgpXHJcbiAgICAgICAgOiB0aW1lb3V0O1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldEFwcFRpbWVvdXQnLCBuYW1lLCB0aW1lb3V0KTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlZiA9IHNldFRpbWVvdXQoY2IsIHRpbWVvdXQpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChzYXZlVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHJlZixcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2F2ZVRpbWVvdXQgPSAoe1xyXG4gICAgbmFtZSxcclxuICAgIHJlZixcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBRERfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHJlZixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFwcFRpbWVvdXQgPSAoeyBuYW1lIH0pID0+IHtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQXBwVGltZW91dCcsIG5hbWUsIHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2gocmVtb3ZlVGltZW91dCh7IG5hbWUgfSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFsbFRpbWVvdXRzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnLCBnZXRTdGF0ZSgpLnRpbWVvdXRzKTtcclxuXHJcbiAgICAgICAgXy5mb3JFYWNoKHRpbWVvdXRzLCAodCwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhckFwcFRpbWVvdXQoeyBuYW1lIH0pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycsIGdldFN0YXRlKCkudGltZW91dHMpO1xyXG5cclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVUaW1lb3V0ID0gKHsgbmFtZSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZW1vdmVUaW1lb3V0JywgbmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRU1PVkVfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfV09STEQsXHJcbiAgICBDTEVBUl9XT1JMRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0V29ybGQgPSAobGFuZ1NsdWcsIHdvcmxkU2x1ZykgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFNFVF9XT1JMRCxcclxuICAgICAgICBsYW5nU2x1ZyxcclxuICAgICAgICB3b3JsZFNsdWcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyV29ybGQgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRXb3JsZCcsIGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQ0xFQVJfV09STEQsXHJcbiAgICB9O1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJztcclxuaW1wb3J0IHsgZW5hYmxlQmF0Y2hpbmcgfSBmcm9tICdyZWR1eC1iYXRjaGVkLWFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IFBlcmYgZnJvbSAncmVhY3QtYWRkb25zLXBlcmYnO1xyXG5pbXBvcnQgUGVyZkNvbnRyb2xzIGZyb20gJ2NvbXBvbmVudHMvdXRpbC9QZXJmJztcclxuXHJcblxyXG5pbXBvcnQgZG9tcmVhZHkgZnJvbSAnZG9tcmVhZHknO1xyXG5pbXBvcnQgcGFnZSBmcm9tICdwYWdlJztcclxuXHJcblxyXG5cclxuXHJcbmltcG9ydCBDb250YWluZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvQ29udGFpbmVyJztcclxuaW1wb3J0IE92ZXJ2aWV3IGZyb20gJ2NvbXBvbmVudHMvT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdjb21wb25lbnRzL1RyYWNrZXInO1xyXG5cclxuaW1wb3J0IGFwcFJlZHVjZXJzIGZyb20gJ3JlZHVjZXJzJztcclxuXHJcbmltcG9ydCB7IHNldFJvdXRlIH0gZnJvbSAnYWN0aW9ucy9yb3V0ZSc7XHJcbmltcG9ydCB7IHNldExhbmcgfSBmcm9tICdhY3Rpb25zL2xhbmcnO1xyXG5pbXBvcnQgeyBzZXRXb3JsZCwgY2xlYXJXb3JsZCB9IGZyb20gJ2FjdGlvbnMvd29ybGQnO1xyXG5pbXBvcnQgeyByZXNldE9iamVjdGl2ZXMgfSBmcm9tICdhY3Rpb25zL29iamVjdGl2ZXMnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDcmVhdGUgUmVkdXggU3RvcmVcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIGVuYWJsZUJhdGNoaW5nKGFwcFJlZHVjZXJzKSxcclxuICAgIGFwcGx5TWlkZGxld2FyZSh0aHVua01pZGRsZXdhcmUpXHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFN0YXJ0IEFwcFxyXG4qXHJcbiovXHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgQXBwbGljYXRpb24nKTtcclxuXHJcbiAgICAvLyBQZXJmLnN0YXJ0KCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnUGVyZiBzdGFydGVkJyk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJywgcHJvY2Vzcy5lbnYuTk9ERV9FTlYpO1xyXG5cclxuXHJcbiAgICBhdHRhY2hQYWdlTWlkZGxld2FyZSgpO1xyXG4gICAgYXR0YWNoUGFnZVJvdXRlcygpO1xyXG5cclxuICAgIHBhZ2Uuc3RhcnQoe1xyXG4gICAgICAgIGNsaWNrOiB0cnVlLFxyXG4gICAgICAgIHBvcHN0YXRlOiBmYWxzZSxcclxuICAgICAgICBkaXNwYXRjaDogdHJ1ZSxcclxuICAgICAgICBoYXNoYmFuZzogZmFsc2UsXHJcbiAgICAgICAgZGVjb2RlVVJMQ29tcG9uZW50czogdHJ1ZSxcclxuICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKEFwcCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcigpJyk7XHJcblxyXG4gICAgUmVhY3RET00ucmVuZGVyKFxyXG4gICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgICAgICA8Q29udGFpbmVyPlxyXG4gICAgICAgICAgICAgICAgey8qPFBlcmZDb250cm9scyAvPiovfVxyXG5cclxuICAgICAgICAgICAgICAgIHtBcHB9XHJcbiAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1hcHAnKVxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoUGFnZU1pZGRsZXdhcmUoKSB7XHJcbiAgICBwYWdlKChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmluZm8oYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFjaCBzdG9yZSB0byB0aGUgcm91dGVyIGNvbnRleHRcclxuICAgICAgICBjdHguc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goc2V0Um91dGUoY3R4KSk7XHJcblxyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmdTbHVnLCB3b3JsZFNsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcblxyXG4gICAgICAgIGlmICh3b3JsZFNsdWcpIHtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHJlc2V0T2JqZWN0aXZlcygpKTtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHNldFdvcmxkKGxhbmdTbHVnLCB3b3JsZFNsdWcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoUGFnZVJvdXRlcygpIHtcclxuICAgIHBhZ2UoJy8nLCAnL2VuJyk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcikvOndvcmxkU2x1ZyhbYS16LV0rKScsXHJcbiAgICAgICAgKGN0eCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zdCB7IGxhbmdTbHVnLCB3b3JsZFNsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0TGFuZyhsYW5nU2x1ZykpO1xyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0V29ybGQobGFuZ1NsdWcsIHdvcmxkU2x1ZykpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeyBsYW5nLCB3b3JsZCB9ID0gY3R4LnN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIoPFRyYWNrZXIgLz4pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmciknLFxyXG4gICAgICAgIChjdHgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgeyBsYW5nU2x1ZyB9ID0gY3R4LnBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyKDxPdmVydmlldyAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5cclxuaW1wb3J0IExhbmdzIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L0xhbmdzJztcclxuaW1wb3J0IE5hdmJhckhlYWRlciBmcm9tICdjb21wb25lbnRzL0xheW91dC9OYXZiYXJIZWFkZXInO1xyXG5pbXBvcnQgRm9vdGVyIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L0Zvb3Rlcic7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRXF1YWxCeVBpY2soY3VycmVudFByb3BzLCBuZXh0UHJvcHMsIGtleXMpIHtcclxuICAgIHJldHVybiBfLmlzRXF1YWwoXHJcbiAgICAgICAgXy5waWNrKGN1cnJlbnRQcm9wcywga2V5cyksXHJcbiAgICAgICAgXy5waWNrKG5leHRQcm9wcywga2V5cyksXHJcbiAgICApO1xyXG5cclxuICAgIC8vIHJldHVybiBfLnJlZHVjZShrZXlzLCAoYSwga2V5KSA9PiB7XHJcbiAgICAvLyAgICAgcmV0dXJuIGEgfHwgIV8uaXNFcXVhbChjdXJyZW50UHJvcHNba2V5XSwgbmV4dFByb3BzW2tleV0pO1xyXG4gICAgLy8gfSwgZmFsc2UpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAhaXNFcXVhbEJ5UGljayh0aGlzLnByb3BzLCBuZXh0UHJvcHMsIFsnd29ybGQnLCAnY2hpbGRyZW4nXSlcclxuICAgICAgICAgICAgfHwgIXRoaXMucHJvcHMubGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnRTaG91bGRVcGRhdGUoKWAsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYW5nJywgXy5pc0VxdWFsKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkJywgXy5pc0VxdWFsKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCksIG5leHRQcm9wcy53b3JsZCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgLy8gY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudERpZFVwZGF0ZSgpYCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT0nbmF2YmFyIG5hdmJhci1kZWZhdWx0Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhckhlYWRlciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGlkPSdjb250ZW50JyBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxGb290ZXIgb2JzZnVFbWFpbD17e1xyXG4gICAgICAgICAgICAgICAgICAgIGNodW5rczogWydndzJ3MncnLCAnc2NodHVwaCcsICdjb20nLCAnQCcsICcuJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogJzAzMTQyJyxcclxuICAgICAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNvbnRhaW5lciA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShDb250YWluZXIpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb250YWluZXI7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBvYnNmdUVtYWlsLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC14cy0yNCc+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT0nc21hbGwgbXV0ZWQgdGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgwqkgMjAxMyBBcmVuYU5ldCwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTkNzb2Z0LCB0aGUgaW50ZXJsb2NraW5nIE5DIGxvZ28sIEFyZW5hTmV0LCBHdWlsZCBXYXJzLCBHdWlsZCBXYXJzIEZhY3Rpb25zLCBHdWlsZCBXYXJzIE5pZ2h0ZmFsbCwgR3VpbGQgV2FyczpFeWUgb2YgdGhlIE5vcnRoLCBHdWlsZCBXYXJzIDIsIGFuZCBhbGwgYXNzb2NpYXRlZCBsb2dvcyBhbmQgZGVzaWducyBhcmUgdHJhZGVtYXJrcyBvciByZWdpc3RlcmVkIHRyYWRlbWFya3Mgb2YgTkNzb2Z0IENvcnBvcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxsIG90aGVyIHRyYWRlbWFya3MgYXJlIHRoZSBwcm9wZXJ0eSBvZiB0aGVpciByZXNwZWN0aXZlIG93bmVycy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2Ugc2VuZCBjb21tZW50cyBhbmQgYnVncyB0byA8T2JzZnVFbWFpbCBvYnNmdUVtYWlsPXtvYnNmdUVtYWlsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1cHBvcnRpbmcgbWljcm9zZXJ2aWNlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8nPmd1aWxkcy5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3N0YXRlLmd3Mncydy5jb20vJz5zdGF0ZS5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3d3dy5waWVseS5uZXQvJz53d3cucGllbHkubmV0PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNvdXJjZSBhdmFpbGFibGUgYXQgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdCc+aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9mb290ZXI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuY29uc3QgT2JzZnVFbWFpbCA9ICh7b2JzZnVFbWFpbH0pID0+IHtcclxuICAgIGNvbnN0IHJlY29uc3RydWN0ZWQgPSBvYnNmdUVtYWlsLnBhdHRlcm5cclxuICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgLm1hcChpeENodW5rID0+IG9ic2Z1RW1haWwuY2h1bmtzW2l4Q2h1bmtdKVxyXG4gICAgICAgIC5qb2luKCcnKTtcclxuXHJcbiAgICByZXR1cm4gPGEgaHJlZj17YG1haWx0bzoke3JlY29uc3RydWN0ZWR9YH0+e3JlY29uc3RydWN0ZWR9PC9hPjtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGFjdGl2ZUxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMubGFuZztcclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUud29ybGQ7XHJcbmNvbnN0IHdvcmxkRGF0YVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBhY3RpdmVMYW5nU2VsZWN0b3IsXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICB3b3JsZFNlbGVjdG9yLFxyXG4gICAgKGFjdGl2ZUxhbmcsIGxhbmcsIHdvcmxkKSA9PiAoe1xyXG4gICAgICAgIGFjdGl2ZUxhbmcsXHJcbiAgICAgICAgd29ybGQ6IHdvcmxkID8gd29ybGRzW3dvcmxkLmlkXVtsYW5nLnNsdWddIDogbnVsbCxcclxuICAgIH0pXHJcbik7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICAvLyBjb25zb2xlLmxvZygnbGFuZycsIHN0YXRlLmxhbmcpO1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBhY3RpdmVMYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIC8vIGFjdGl2ZVdvcmxkOiBzdGF0ZS53b3JsZCxcclxuLy8gICAgICAgICB3b3JsZDogc3RhdGUud29ybGQgPyB3b3JsZHNbc3RhdGUud29ybGQuaWRdW3Byb3BzLmxhbmcuc2x1Z10gOiBudWxsLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5sZXQgTGFuZyA9ICh7XHJcbiAgICBhY3RpdmVMYW5nLFxyXG4gICAgLy8gYWN0aXZlV29ybGQsXHJcbiAgICBsYW5nLFxyXG4gICAgd29ybGQsXHJcbn0pID0+IChcclxuICAgIDxsaVxyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogYWN0aXZlTGFuZy5nZXQoJ2xhYmVsJykgPT09IGxhbmcubGFiZWwsXHJcbiAgICAgICAgfSl9XHJcbiAgICAgICAgdGl0bGU9e2xhbmcubmFtZX1cclxuICAgID5cclxuICAgICAgICA8YSBocmVmPXtnZXRMaW5rKGxhbmcsIHdvcmxkKX0+XHJcbiAgICAgICAgICAgIHtsYW5nLmxhYmVsfVxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbik7XHJcbkxhbmcucHJvcFR5cGVzID0ge1xyXG4gICAgYWN0aXZlTGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgYWN0aXZlV29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcbkxhbmcgPSBjb25uZWN0KFxyXG4gIHdvcmxkRGF0YVNlbGVjdG9yLFxyXG4gIC8vIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKExhbmcpO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gKHdvcmxkKVxyXG4gICAgICAgID8gd29ybGQubGlua1xyXG4gICAgICAgIDogbGFuZy5saW5rO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmc7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBsYW5ncyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IExhbmdMaW5rIGZyb20gJy4vTGFuZ0xpbmsnO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgTGFuZ3MgPSAoKSA9PiAoXHJcbiAgICA8ZGl2IGlkPSduYXYtbGFuZ3MnIGNsYXNzTmFtZT0ncHVsbC1yaWdodCc+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZSA9ICduYXYgbmF2YmFyLW5hdic+XHJcbiAgICAgICAgICAgIHtfLm1hcChsYW5ncywgKGxhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGluayBrZXk9e2tleX0gbGFuZz17bGFuZ30gLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmdzOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcbjtcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBhcGlTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUuYXBpO1xyXG5jb25zdCBhcGlQZW5kaW5nU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihhcGlTZWxlY3RvciwgKGFwaSkgPT4gYXBpLmdldCgncGVuZGluZycpKTtcclxuY29uc3QgaGFzUGVuZGluZ1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoYXBpUGVuZGluZ1NlbGVjdG9yLCAocGVuZGluZykgPT4gIXBlbmRpbmcuaXNFbXB0eSgpKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgaGFzUGVuZGluZ1NlbGVjdG9yLFxyXG4gICAgKGxhbmcsIGhhc1BlbmRpbmdSZXF1ZXN0cykgPT4gKHtcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIGhhc1BlbmRpbmdSZXF1ZXN0cyxcclxuICAgIH0pXHJcbik7XHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIGhhc1BlbmRpbmdSZXF1ZXN0czogIXN0YXRlLmFwaS5nZXQoJ3BlbmRpbmcnKS5pc0VtcHR5KCksXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5sZXQgTmF2YmFySGVhZGVyID0gKHtcclxuICAgIGxhbmcsXHJcbiAgICBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXItaGVhZGVyJz5cclxuICAgICAgICA8YSBjbGFzc05hbWU9J25hdmJhci1icmFuZCcgaHJlZj17YC8ke2xhbmcuZ2V0KCdzbHVnJyl9YH0+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPScvaW1nL2xvZ28vbG9nby05NngzNi5wbmcnIC8+XHJcbiAgICAgICAgPC9hPlxyXG5cclxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICAnbmF2YmFyLXNwaW5uZXInOiB0cnVlLFxyXG4gICAgICAgICAgICBhY3RpdmU6IGhhc1BlbmRpbmdSZXF1ZXN0cyxcclxuICAgICAgICB9KX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJyAvPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcbk5hdmJhckhlYWRlci5wcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICBoYXNQZW5kaW5nUmVxdWVzdHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5OYXZiYXJIZWFkZXIgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoTmF2YmFySGVhZGVyKTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmJhckhlYWRlcjsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoV29ybGQgZnJvbSAnLi9NYXRjaFdvcmxkJztcclxuXHJcbmltcG9ydCB7IHdvcmxkcyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5jb25zdCBXT1JMRF9DT0xPUlMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuLy8gY29uc3QgbWFwVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICAvLyBtYXRjaDogc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkXSksXHJcbi8vICAgICAgICAgbWF0Y2g6IChJbW11dGFibGUuTWFwLmlzTWFwKHN0YXRlLm1hdGNoZXMpKVxyXG4vLyAgICAgICAgICAgICA/IHN0YXRlLm1hdGNoZXMuZ2V0SW4oWydkYXRhJywgcHJvcHMubWF0Y2hJZF0pXHJcbi8vICAgICAgICAgICAgIDogSW1tdXRhYmxlLk1hcCh7ICB9KSxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IG1hdGNoU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5tYXRjaDtcclxuXHJcbi8vIGNvbnN0IG1hdGNoU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuLy8gICAgIG1hdGNoSWRTZWxlY3RvcixcclxuLy8gICAgIG1hdGNoZXNTZWxlY3RvcixcclxuLy8gICAgIChtYXRjaElkLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmdldChtYXRjaElkKVxyXG4vLyApO1xyXG5cclxuY29uc3QgbWFwVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hTZWxlY3RvcixcclxuICAgIChsYW5nLCBtYXRjaCkgPT4gKHsgbGFuZywgbWF0Y2ggfSlcclxuKTtcclxuXHJcblxyXG5cclxuY2xhc3MgTWF0Y2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5pc05ld01hdGNoRGF0YShuZXh0UHJvcHMpXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TWF0Y2hEYXRhKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5tYXRjaC5lcXVhbHMobmV4dFByb3BzLm1hdGNoKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtYXRjaCcsIG1hdGNoLmdldCgnaWQnKSwgbWF0Y2gudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hdGNoQ29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J21hdGNoJz5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtfLm1hcChXT1JMRF9DT0xPUlMsIChjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBtYXRjaC5nZXRJbihbJ3dvcmxkcycsIGNvbG9yXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAndHInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHt3b3JsZElkfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0ge21hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllID0ge2NvbG9yID09PSAncmVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGRJZCA9IHt3b3JsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezJ9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3t0ZXh0QWxpZ246ICdjZW50ZXInfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnttb21lbnQobWF0Y2gubGFzdG1vZCAqIDEwMDApLmZvcm1hdCgnaGg6bW06c3MnKX08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4qL31cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuTWF0Y2ggPSBjb25uZWN0KFxyXG4gICAgbWFwVG9Qcm9wcyxcclxuKShNYXRjaCk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2g7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IFBpZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9JY29ucy9QaWUnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBtYXRjaElkOiBwcm9wcy5tYXRjaElkLFxyXG4vLyAgICAgICAgIHNjb3JlczogKEltbXV0YWJsZS5NYXAuaXNNYXAoc3RhdGUubWF0Y2hlcykpXHJcbi8vICAgICAgICAgICAgID8gc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkLCAnc2NvcmVzJ10pXHJcbi8vICAgICAgICAgICAgIDogSW1tdXRhYmxlLk1hcCh7IHJlZDogMCwgYmx1ZTogMCwgZ3JlZW46IDAgfSksXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuY29uc3QgbWF0Y2hJZFNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMubWF0Y2hJZDtcclxuY29uc3Qgc2NvcmVzU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiAoXHJcbiAgICAoSW1tdXRhYmxlLk1hcC5pc01hcChzdGF0ZS5tYXRjaGVzKSlcclxuICAgID8gc3RhdGUubWF0Y2hlcy5nZXRJbihbJ2RhdGEnLCBwcm9wcy5tYXRjaElkLCAnc2NvcmVzJ10pXHJcbiAgICA6IEltbXV0YWJsZS5NYXAoeyByZWQ6IDAsIGJsdWU6IDAsIGdyZWVuOiAwIH0pXHJcbik7XHJcblxyXG5jb25zdCBtYXBTZWxlY3RvcnNUb1Byb3BzID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBzY29yZXNTZWxlY3RvcixcclxuICAgIG1hdGNoSWRTZWxlY3RvcixcclxuICAgIChzY29yZXMsIG1hdGNoSWQpID0+ICh7XHJcbiAgICAgICAgc2NvcmVzLFxyXG4gICAgICAgIG1hdGNoSWQsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuXHJcbmNsYXNzIE1hdGNoUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgc2NvcmVzOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnByb3BzLnNjb3Jlcy5lcXVhbHMobmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgc2NvcmVzLFxyXG4gICAgICAgICAgICBtYXRjaElkLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaElkLCBzY29yZXMudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFBpZSBzY29yZXM9e3Njb3Jlcy50b0pTKCl9IHNpemU9ezYwfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NYXRjaFBpZSA9IGNvbm5lY3QoXHJcbiAgICBtYXBTZWxlY3RvcnNUb1Byb3BzXHJcbikoTWF0Y2hQaWUpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaFBpZTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IG51bWVyYWwgZnJvbSAnbnVtZXJhbCc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBNYXRjaFBpZSBmcm9tICcuL01hdGNoUGllJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xvclNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMuY29sb3I7XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuY29uc3QgbWF0Y2hTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLm1hdGNoO1xyXG5jb25zdCBzaG93UGllU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy5zaG93UGllO1xyXG5jb25zdCB3b3JsZElkU2VsZWN0b3IgPSAoc3RhdGUsIHByb3BzKSA9PiBwcm9wcy53b3JsZElkO1xyXG5cclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgd29ybGRJZFNlbGVjdG9yLFxyXG4gICAgKGxhbmcsIHdvcmxkSWQpID0+IHdvcmxkc1t3b3JsZElkXVtsYW5nLmdldCgnc2x1ZycpXVxyXG4pO1xyXG5jb25zdCBzY29yZXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hTZWxlY3RvcixcclxuICAgIChtYXRjaCkgPT4gbWF0Y2guZ2V0KCdzY29yZXMnKVxyXG4pO1xyXG5jb25zdCBzY29yZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBjb2xvclNlbGVjdG9yLFxyXG4gICAgc2NvcmVzU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIHNjb3JlcykgPT4gc2NvcmVzLmdldChjb2xvcilcclxuKTtcclxuXHJcbmNvbnN0IG1hcFNlbGVjdG9yc1RvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICBtYXRjaFNlbGVjdG9yLFxyXG4gICAgc2NvcmVTZWxlY3RvcixcclxuICAgIHNob3dQaWVTZWxlY3RvcixcclxuICAgIHdvcmxkU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIGxhbmcsIG1hdGNoLCBzY29yZSwgc2hvd1BpZSwgd29ybGQpID0+ICh7XHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBtYXRjaCxcclxuICAgICAgICBzY29yZSxcclxuICAgICAgICBzaG93UGllLFxyXG4gICAgICAgIHdvcmxkLFxyXG4gICAgfSlcclxuKTtcclxuXHJcblxyXG5jbGFzcyBNYXRjaFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgICAgICBsYW5nOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHNob3dQaWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpXHJcbiAgICAgICAgICAgIHx8ICghdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgbWF0Y2gsXHJcbiAgICAgICAgICAgIHNjb3JlLFxyXG4gICAgICAgICAgICBzaG93UGllLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cod29ybGQsIHNjb3JlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke2NvbG9yfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICB7Lyo8dGQgY2xhc3NOYW1lPXtgdGVhbSBraWxscyAke2NvbG9yfWB9PnttYXRjaC5raWxscyA/IG51bWVyYWwobWF0Y2gua2lsbHNbY29sb3JdKS5mb3JtYXQoJzAsMCcpIDogbnVsbH08L3RkPiovfVxyXG4gICAgICAgICAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0gZGVhdGhzICR7Y29sb3J9YH0+e21hdGNoLmRlYXRocyA/IG51bWVyYWwobWF0Y2guZGVhdGhzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7Y29sb3J9YH0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgPyBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9PC90ZD5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHNob3dQaWUpID8gPHRkIGNsYXNzTmFtZT0ncGllJyByb3dTcGFuPSczJz48TWF0Y2hQaWUgbWF0Y2hJZD17bWF0Y2guZ2V0KCdpZCcpfSBzaXplPXs2MH0gLz48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1hdGNoV29ybGQgPSBjb25uZWN0KFxyXG4gICAgbWFwU2VsZWN0b3JzVG9Qcm9wc1xyXG4pKE1hdGNoV29ybGQpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaFdvcmxkOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgTWF0Y2ggZnJvbSAnLi9NYXRjaCc7XHJcblxyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17eyBwYWRkaW5nTGVmdDogJy41ZW0nIH19PjxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJyAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHJlZ2lvblNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMucmVnaW9uO1xyXG5jb25zdCBtYXRjaGVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiAoSW1tdXRhYmxlLk1hcC5pc01hcChzdGF0ZS5tYXRjaGVzKSAmJiBzdGF0ZS5tYXRjaGVzLmhhcygnZGF0YScpKVxyXG4gICAgICAgID8gc3RhdGUubWF0Y2hlcy5nZXQoJ2RhdGEnKVxyXG4gICAgICAgIDogSW1tdXRhYmxlLk1hcCgpO1xyXG59O1xyXG5cclxuY29uc3QgcmVnaW9uTWF0Y2hlc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICByZWdpb25TZWxlY3RvcixcclxuICAgIG1hdGNoZXNTZWxlY3RvcixcclxuICAgIChyZWdpb24sIG1hdGNoZXMpID0+IG1hdGNoZXMuZmlsdGVyKG1hdGNoID0+IHJlZ2lvbi5pZCA9PT0gbWF0Y2guZ2V0KCdyZWdpb24nKSlcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgcmVnaW9uTWF0Y2hlc1NlbGVjdG9yLFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hlcywgcmVnaW9uKSA9PiAoe1xyXG4gICAgICAgIG1hdGNoZXMsXHJcbiAgICAgICAgcmVnaW9uLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbWF0Y2hJZHM6IF8uZmlsdGVyKFxyXG4vLyAgICAgICAgICAgICBzdGF0ZS5tYXRjaGVzLmlkcyxcclxuLy8gICAgICAgICAgICAgaWQgPT4gcHJvcHMucmVnaW9uLmlkID09PSBpZC5jaGFyQXQoMClcclxuLy8gICAgICAgICApLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBNYXRjaGVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbWF0Y2hlczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG4gICAgICAgICAgICAhdGhpcy5wcm9wcy5tYXRjaGVzLmVxdWFscyhuZXh0UHJvcHMubWF0Y2hlcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnT3ZlcnZpZXc6Ok1hdGNoZXM6OnNob3VsZFVwZGF0ZScsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbWF0Y2hlcyxcclxuICAgICAgICAgICAgcmVnaW9uLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAge3JlZ2lvbi5sYWJlbH0gTWF0Y2hlc1xyXG4gICAgICAgICAgICAgICAgICAgIHttYXRjaGVzLmlzRW1wdHkoKSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAge21hdGNoZXMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChtYXRjaCwgbWF0Y2hJZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICA8TWF0Y2gga2V5PXttYXRjaElkfSBtYXRjaD17bWF0Y2h9IC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5NYXRjaGVzID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKE1hdGNoZXMpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2hlczsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIGFzIFNUQVRJQ19XT1JMRFMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmNvbnN0IFdPUkxEU19JTU1VVCA9IEltbXV0YWJsZS5mcm9tSlMoU1RBVElDX1dPUkxEUyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IHJlZ2lvblNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMucmVnaW9uO1xyXG5jb25zdCB3b3JsZHNTZWxlY3RvciA9ICgpID0+IFdPUkxEU19JTU1VVDtcclxuXHJcbmNvbnN0IHJlZ2lvbldvcmxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICByZWdpb25TZWxlY3RvcixcclxuICAgIHdvcmxkc1NlbGVjdG9yLFxyXG4gICAgKGxhbmcsIHJlZ2lvbiwgd29ybGRzKSA9PiB7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JsZHNcclxuICAgICAgICAgICAgLmZpbHRlcih3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpID09PSByZWdpb24uaWQpXHJcbiAgICAgICAgICAgIC5tYXAod29ybGQgPT4gd29ybGQuZ2V0KGxhbmcuZ2V0KCdzbHVnJykpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KHdvcmxkID0+IHdvcmxkLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgcmVnaW9uU2VsZWN0b3IsXHJcbiAgICByZWdpb25Xb3JsZHNTZWxlY3RvcixcclxuICAgIChsYW5nLCByZWdpb24sIHJlZ2lvbldvcmxkcykgPT4gKHtcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIHJlZ2lvbixcclxuICAgICAgICByZWdpb25Xb3JsZHMsXHJcbiAgICB9KVxyXG4pO1xyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4gKHtcclxuLy8gICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcclxuLy8gfSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgV29ybGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHJlZ2lvbldvcmxkczogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgcmVnaW9uLFxyXG4gICAgICAgICAgICByZWdpb25Xb3JsZHMsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdSZWdpb25Xb3JsZHMnPlxyXG4gICAgICAgICAgICAgICAgPGgyPntyZWdpb24ubGFiZWx9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7cmVnaW9uV29ybGRzLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17d29ybGQuZ2V0KCdzbHVnJyl9PjxhIGhyZWY9e3dvcmxkLmdldCgnbGluaycpfT57d29ybGQuZ2V0KCduYW1lJyl9PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Xb3JsZHMgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoV29ybGRzKTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBXb3JsZHM7IiwiXHJcbi8qXHJcbipcclxuKiAgIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQgKiBhcyB0aW1lb3V0QWN0aW9ucyBmcm9tICdhY3Rpb25zL3RpbWVvdXRzJztcclxuXHJcblxyXG4vKlxyXG4qICAgUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuaW1wb3J0IE1hdGNoZXMgZnJvbSAnLi9NYXRjaGVzJztcclxuaW1wb3J0IFdvcmxkcyBmcm9tICcuL1dvcmxkcyc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUkVHSU9OUyA9IHtcclxuICAgIDE6IHsgbGFiZWw6ICdOQScsIGlkOiAnMScgfSxcclxuICAgIDI6IHsgbGFiZWw6ICdFVScsIGlkOiAnMicgfSxcclxufTtcclxuXHJcbmNvbnN0IFJFRlJFU0hfVElNRU9VVCA9IF8ucmFuZG9tKDQgKiAxMDAwLCA4ICogMTAwMCk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgYXBpU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmFwaTtcclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBtYXRjaGVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoZXM7XHJcblxyXG5jb25zdCBkYXRhRXJyb3JTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdlcnJvcicpKTtcclxuY29uc3QgbWF0Y2hlc0RhdGFTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdkYXRhJykpO1xyXG5jb25zdCBtYXRjaGVzTGFzdFVwZGF0ZWRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKG1hdGNoZXNTZWxlY3RvciwgKG1hdGNoZXMpID0+IG1hdGNoZXMuZ2V0KCdsYXN0VXBkYXRlZCcpKTtcclxuY29uc3QgbWF0Y2hlc0lzRmV0Y2hpbmdTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKGFwaVNlbGVjdG9yLCAoYXBpKSA9PiBhcGkuZ2V0KCdwZW5kaW5nJykuaW5jbHVkZXMoJ21hdGNoZXMnKSk7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGxhbmdTZWxlY3RvcixcclxuICAgIGRhdGFFcnJvclNlbGVjdG9yLFxyXG4gICAgbWF0Y2hlc0RhdGFTZWxlY3RvcixcclxuICAgIG1hdGNoZXNMYXN0VXBkYXRlZFNlbGVjdG9yLFxyXG4gICAgbWF0Y2hlc0lzRmV0Y2hpbmdTZWxlY3RvcixcclxuICAgIChsYW5nLCBkYXRhRXJyb3IsIG1hdGNoZXNEYXRhLCBtYXRjaGVzTGFzdFVwZGF0ZWQsIG1hdGNoZXNJc0ZldGNoaW5nKSA9PiAoe1xyXG4gICAgICAgIGxhbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGEsXHJcbiAgICAgICAgZGF0YUVycm9yLFxyXG4gICAgICAgIG1hdGNoZXNMYXN0VXBkYXRlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZyxcclxuICAgIH0pXHJcbik7XHJcblxyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcblxyXG4vLyAgICAgLy8gY29uc29sZS5sb2coJ3N0YXRlJywgc3RhdGUudGltZW91dHMpO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuLy8gICAgICAgICBtYXRjaGVzRGF0YTogc3RhdGUubWF0Y2hlcy5kYXRhLFxyXG4vLyAgICAgICAgIG1hdGNoZXNMYXN0VXBkYXRlZDogc3RhdGUubWF0Y2hlcy5sYXN0VXBkYXRlZCxcclxuLy8gICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogXy5pbmNsdWRlcyhzdGF0ZS5hcGkucGVuZGluZywgJ21hdGNoZXMnKSxcclxuLy8gICAgICAgICAvLyB0aW1lb3V0czogc3RhdGUudGltZW91dHMsXHJcbi8vICAgICB9O1xyXG4vLyB9O1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoTWF0Y2hlczogKCkgPT4gZGlzcGF0Y2goYXBpQWN0aW9ucy5mZXRjaE1hdGNoZXMoKSksXHJcbiAgICAgICAgc2V0QXBwVGltZW91dDogKHsgbmFtZSwgY2IsIHRpbWVvdXQgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuc2V0QXBwVGltZW91dCh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pKSxcclxuICAgICAgICBjbGVhckFwcFRpbWVvdXQ6ICh7IG5hbWUgfSkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSksXHJcbiAgICAgICAgLy8gY2xlYXJBbGxUaW1lb3V0czogKCkgPT4gZGlzcGF0Y2godGltZW91dEFjdGlvbnMuY2xlYXJBbGxUaW1lb3V0cygpKSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBPdmVydmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBkYXRhRXJyb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyB0aW1lb3V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBmZXRjaE1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcy8qLCBuZXh0U3RhdGUqLykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWQgIT09IG5leHRQcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy5tYXRjaGVzSXNGZXRjaGluZyAhPT0gbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMuZGF0YUVycm9yICE9PSBuZXh0UHJvcHMuZGF0YUVycm9yXHJcbiAgICAgICAgICAgIHx8ICF0aGlzLnByb3BzLm1hdGNoZXNEYXRhLmVxdWFscyhuZXh0UHJvcHMubWF0Y2hlc0RhdGEpXHJcbiAgICAgICAgICAgIHx8ICF0aGlzLnByb3BzLmxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6c2hvdWxkVXBkYXRlYCwgc2hvdWxkVXBkYXRlLCB0aGlzLnByb3BzLCBuZXh0UHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OnNob3VsZFVwZGF0ZWAsIHNob3VsZFVwZGF0ZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojppc05ld01hdGNoZXNEYXRhYCwgdGhpcy5pc05ld01hdGNoZXNEYXRhKG5leHRQcm9wcykpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6aXNOZXdMYW5nYCwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojpjb21wb25lbnRXaWxsTW91bnQoKWApO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50RGlkTW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmZldGNoTWF0Y2hlcygpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKWApO1xyXG5cclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoZXNJc0ZldGNoaW5nLFxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoZXMsXHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmIChsYW5nLm5hbWUgIT09IG5leHRQcm9wcy5sYW5nLm5hbWUpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzSXNGZXRjaGluZyAmJiAhbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hlcycsXHJcbiAgICAgICAgICAgICAgICBjYjogKCkgPT4gZmV0Y2hNYXRjaGVzKCksXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAoKSA9PiBSRUZSRVNIX1RJTUVPVVQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50V2lsbFVubW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmNsZWFyQXBwVGltZW91dCh7IG5hbWU6ICdmZXRjaE1hdGNoZXMnIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgZGF0YUVycm9yLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgeyhkYXRhRXJyb3IpID8gPHByZSBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWRhbmdlcic+e2RhdGFFcnJvci50b1N0cmluZygpfTwvcHJlPiA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIG1hdGNoZXMgKi99XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbikgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS0xMicga2V5PXtyZWdpb24uaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hdGNoZXMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7Lyogd29ybGRzICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxXb3JsZHMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk92ZXJ2aWV3ID0gY29ubmVjdChcclxuICAvLyBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKE92ZXJ2aWV3KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgY29uc3QgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcbiAgICBpZiAobGFuZy5zbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUuam9pbignIC0gJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJ2aWV3O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5cclxuXHJcblxyXG5jb25zdCBzcGlubmVyID0gPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nPjwvaT47XHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVkdXggSGVscGVyc1xyXG4qXHJcbiovXHJcbmNvbnN0IGd1aWxkc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5ndWlsZHM7XHJcbmNvbnN0IGd1aWxkSWRTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmd1aWxkSWQ7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgZ3VpbGRJZFNlbGVjdG9yLFxyXG4gICAgKGd1aWxkcywgZ3VpbGRJZCkgPT4gKHtcclxuICAgICAgICBndWlsZElkLFxyXG4gICAgICAgIGd1aWxkOiBndWlsZHMuZ2V0KGd1aWxkSWQpLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIGlmIChwcm9wcy5ndWlsZElkID09PSAnQzQxNjg2REQtQTIwMS1FNDExLTg2M0MtRTQxMTVCREY0ODFEJykge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKHByb3BzLmd1aWxkSWQsIHN0YXRlLmd1aWxkc1twcm9wcy5ndWlsZElkXSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBndWlsZDogc3RhdGUuZ3VpbGRzW3Byb3BzLmd1aWxkSWRdLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBndWlsZElkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGd1aWxkIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5ndWlsZC5lcXVhbHMobmV4dFByb3BzLmd1aWxkKTtcclxuICAgIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZ3VpbGQgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0cmFja2VyOjpndWlsZHM6OnJlbmRlcicsIGd1aWxkLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGhyZWY9e2BodHRwczovL2d1aWxkcy5ndzJ3MncuY29tLyR7Z3VpbGQuZ2V0KCdpZCcpfWB9IGlkPXtndWlsZC5nZXQoJ2lkJyl9PlxyXG4gICAgICAgICAgICAgICAgPEVtYmxlbSBrZXk9e2d1aWxkLmdldCgnaWQnKX0gZ3VpbGRJZD17Z3VpbGQuZ2V0KCdpZCcpfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXY+e1xyXG4gICAgICAgICAgICAgICAgICAgICghZ3VpbGQuZ2V0KCdsb2FkaW5nJykpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz57Z3VpbGQuZ2V0KCduYW1lJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLXRhZyc+e2d1aWxkLmdldCgndGFnJykgPyBgIFske2d1aWxkLmdldCgndGFnJyl9XWAgOiBudWxsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBzcGlubmVyXHJcbiAgICAgICAgICAgICAgICB9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuR3VpbGQucHJvcFR5cGVzID0ge1xyXG4gICAgZ3VpbGQgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLFxyXG59O1xyXG5cclxuR3VpbGQgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKEd1aWxkKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3VpbGQ7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdyZXNlbGVjdCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCBHdWlsZCBmcm9tICcuL0d1aWxkJztcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUmVzZWxlY3QgSGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5cclxuY29uc3QgZ3VpbGRzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmd1aWxkcztcclxuY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuXHJcblxyXG5jb25zdCBtYXRjaEd1aWxkSWRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIG1hdGNoRGV0YWlsc1NlbGVjdG9yLFxyXG4gICAgKG1hdGNoRGV0YWlscykgPT4gKEltbXV0YWJsZS5NYXAuaXNNYXAobWF0Y2hEZXRhaWxzKSAmJiBtYXRjaERldGFpbHMuaGFzKCdndWlsZElkcycpKVxyXG4gICAgICAgID8gbWF0Y2hEZXRhaWxzLmdldCgnZ3VpbGRJZHMnKVxyXG4gICAgICAgIDogSW1tdXRhYmxlLkxpc3QoKVxyXG4pO1xyXG5cclxuXHJcbmNvbnN0IG1hdGNoR3VpbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgbWF0Y2hHdWlsZElkc1NlbGVjdG9yLFxyXG4gICAgKGd1aWxkcywgZ3VpbGRJZHMpID0+IGd1aWxkcy5maWx0ZXIoZyA9PiBndWlsZElkcy5pbmNsdWRlcyhnLmdldCgnaWQnKSkpXHJcbik7XHJcblxyXG5jb25zdCBzb3J0ZWRHdWlsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hHdWlsZHNTZWxlY3RvcixcclxuICAgIChndWlsZHNVbnNvcnRlZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGd1aWxkcyA9IGd1aWxkc1Vuc29ydGVkXHJcbiAgICAgICAgICAgIC5zb3J0QnkoZyA9PiBnLmdldCgnaWQnKSlcclxuICAgICAgICAgICAgLnNvcnRCeShnID0+IGcuZ2V0KCduYW1lJykpXHJcbiAgICAgICAgICAgIC5tYXAoZyA9PiBnLmdldCgnaWQnKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IGd1aWxkcyB9O1xyXG4gICAgfVxyXG4pO1xyXG5cclxuLy8gY29uc3Qgc29ydGVkR3VpbGRJZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4vLyAgICAgc29ydGVkR3VpbGRzU2VsZWN0b3IsXHJcbi8vICAgICAodW5zb3J0ZWRHdWlsZHMpID0+IHtcclxuLy8gICAgICAgICByZXR1cm4geyBndWlsZHM6IHVuc29ydGVkR3VpbGRzLm1hcChnID0+IGcuZ2V0KCdpZCcpKS50b0xpc3QoKSB9O1xyXG4vLyAgICAgfVxyXG4vLyApO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBXcmFwcGVyID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0yNCc+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcbmNsYXNzIEd1aWxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGd1aWxkcyA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5wcm9wcy5ndWlsZHMuZXF1YWxzKG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGd1aWxkcyxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyYWNrZXI6Omd1aWxkczo6cmVuZGVyJy8qLCBndWlsZHMudG9KUygpKi8pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8V3JhcHBlcj5cclxuICAgICAgICAgICAgICAgIDx1bCBpZD0nZ3VpbGRzJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHtndWlsZHMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2d1aWxkSWR9IGNsYXNzTmFtZT0nZ3VpbGQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEd1aWxkIGd1aWxkSWQ9e2d1aWxkSWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvV3JhcHBlcj5cclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxufTtcclxuR3VpbGRzID0gY29ubmVjdChcclxuICBzb3J0ZWRHdWlsZHNTZWxlY3RvclxyXG4pKEd1aWxkcyk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3VpbGRzOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVJbW11dGFibGVTZWxlY3RvciB9IGZyb20gJ2xpYi9yZWR1eCc7XHJcblxyXG4vLyBpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCBFbnRyeSBmcm9tICcuL0VudHJ5JztcclxuXHJcblxyXG5cclxuY29uc3Qgb2JqZWN0aXZlc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5vYmplY3RpdmVzO1xyXG5cclxuY29uc3Qgc29ydGVkT2JqZWN0aXZlc1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBvYmplY3RpdmVzU2VsZWN0b3IsXHJcbiAgICAob2JqZWN0aXZlcykgPT4gb2JqZWN0aXZlcy5zb3J0QnkobyA9PiAtby5nZXQoJ2xhc3RGbGlwcGVkJykpXHJcbik7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIHNvcnRlZE9iamVjdGl2ZXNTZWxlY3RvcixcclxuICAgIChzb3J0ZWRPYmplY3RpdmVzKSA9PiAoeyBvYmplY3RpdmVzOiBzb3J0ZWRPYmplY3RpdmVzIH0pXHJcbik7XHJcblxyXG4vLyBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbi8vICAgICAvLyBjb25zdCBlbnRyaWVzID0gXy5jaGFpbihwcm9wcy5sb2cpXHJcbi8vICAgICAvLyAgICAgLmZpbHRlcihlbnRyeSA9PiBieVR5cGUocHJvcHMudHlwZUZpbHRlciwgZW50cnkpKVxyXG4vLyAgICAgLy8gICAgIC5maWx0ZXIoZW50cnkgPT4gYnlNYXBJZChwcm9wcy5tYXBGaWx0ZXIsIGVudHJ5KSlcclxuLy8gICAgIC8vICAgICAudmFsdWUoKTtcclxuXHJcbi8vICAgICBjb25zdCBvYmplY3RpdmVzID0gc3RhdGUub2JqZWN0aXZlcy5zb3J0QnkobyA9PiAtby5nZXQoJ2xhc3RGbGlwcGVkJykpO1xyXG5cclxuLy8gICAgIHJldHVybiB7XHJcbi8vICAgICAgICAgb2JqZWN0aXZlcyxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuY2xhc3MgRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIG9iamVjdGl2ZXMgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIC8vIG5vdyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKG1vbWVudCkuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXBGaWx0ZXIgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgdHlwZUZpbHRlciA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvYmplY3RpdmVzLFxyXG5cclxuICAgICAgICAgICAgbWFwRmlsdGVyLFxyXG4gICAgICAgICAgICB0eXBlRmlsdGVyLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gIW9iamVjdGl2ZXMuZXF1YWxzKG5leHRQcm9wcy5vYmplY3RpdmVzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9iamVjdGl2ZXMsXHJcbiAgICAgICAgICAgIG1hcEZpbHRlcixcclxuICAgICAgICAgICAgdHlwZUZpbHRlcixcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPG9sIGlkPSdsb2cnIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgICAgICB7b2JqZWN0aXZlcy5rZXlTZXEoKS5tYXAoaWQgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxFbnRyeSBrZXk9e2lkfSBpZD17aWR9IC8+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5FbnRyaWVzID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShFbnRyaWVzKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgbWFwSWQgPSBvYmplY3RpdmUuaWQuc3BsaXQoJy0nKVswXTtcclxuICAgIHJldHVybiBfLmZpbmQoU1RBVElDLm1hcHNNZXRhLCBtbSA9PiBtbS5pZCA9PSBtYXBJZCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdHlwZUZpbHRlcltlbnRyeS50eXBlXTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgaWYgKG1hcEZpbHRlcikge1xyXG4gICAgICAgIHJldHVybiBlbnRyeS5tYXBJZCA9PT0gbWFwRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW50cmllczsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG4vLyBpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IHsgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IgfSBmcm9tICdsaWIvcmVkdXgnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuLy8gaW1wb3J0IFNwcml0ZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9TcHJpdGUnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5pbXBvcnQgQXJyb3dJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0Fycm93JztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3Qgb2JqZWN0aXZlSWRTZWxlY3RvciA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzLmlkO1xyXG5cclxuY29uc3QgbGFuZ1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5sYW5nO1xyXG5jb25zdCBub3dTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubm93O1xyXG5jb25zdCBndWlsZHNTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUuZ3VpbGRzO1xyXG5jb25zdCBvYmplY3RpdmVzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm9iamVjdGl2ZXM7XHJcblxyXG5jb25zdCBvYmplY3RpdmVTZWxlY3RvciA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgb2JqZWN0aXZlSWRTZWxlY3RvcixcclxuICAgIG9iamVjdGl2ZXNTZWxlY3RvcixcclxuICAgIChpZCwgb2JqZWN0aXZlcykgPT4gb2JqZWN0aXZlcy5nZXQoaWQpXHJcbik7XHJcbmNvbnN0IGd1aWxkU2VsZWN0b3IgPSBjcmVhdGVJbW11dGFibGVTZWxlY3RvcihcclxuICAgIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgb2JqZWN0aXZlU2VsZWN0b3IsXHJcbiAgICAoZ3VpbGRzLCBvYmplY3RpdmUpID0+IGd1aWxkcy5nZXQoXHJcbiAgICAgICAgb2JqZWN0aXZlLmdldCgnZ3VpbGQnKSxcclxuICAgICAgICBJbW11dGFibGUuTWFwKClcclxuICAgIClcclxuKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgbm93U2VsZWN0b3IsXHJcbiAgICBndWlsZFNlbGVjdG9yLFxyXG4gICAgb2JqZWN0aXZlU2VsZWN0b3IsXHJcbiAgICBvYmplY3RpdmVJZFNlbGVjdG9yLFxyXG4gICAgKGxhbmcsIG5vdywgZ3VpbGQsIG9iamVjdGl2ZSwgaWQpID0+ICh7XHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBub3csXHJcbiAgICAgICAgZ3VpbGQsXHJcbiAgICAgICAgb2JqZWN0aXZlLFxyXG4gICAgICAgIGlkLFxyXG4gICAgfSlcclxuKTtcclxuXHJcblxyXG5cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4vLyAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIGd1aWxkOiBzdGF0ZS5ndWlsZHMuZ2V0KFxyXG4vLyAgICAgICAgICAgICBwcm9wcy5vYmplY3RpdmUuZ2V0KCdndWlsZCcpLFxyXG4vLyAgICAgICAgICAgICBJbW11dGFibGUuTWFwKClcclxuLy8gICAgICAgICApLFxyXG4vLyAgICAgICAgIC8vIGVudHJpZXMsXHJcbi8vICAgICAgICAgaWQ6IHByb3BzLmlkLFxyXG4vLyAgICAgICAgIG9iamVjdGl2ZTogcHJvcHMub2JqZWN0aXZlLFxyXG4vLyAgICAgfTtcclxuLy8gfTtcclxuXHJcblxyXG5jbGFzcyBFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGlkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGd1aWxkIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxhbmcgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbm93IDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG9iamVjdGl2ZSA6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBndWlsZCxcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgbm93LFxyXG4gICAgICAgICAgICBvYmplY3RpdmUsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgIW5vdy5pc1NhbWUobmV4dFByb3BzLm5vdylcclxuICAgICAgICAgICAgICAgICYmIChvYmplY3RpdmUuZ2V0KCdleHBpcmVzJykuZGlmZigpID4gLTUwMDApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfHwgIWxhbmcuZXF1YWxzKG5leHRQcm9wcy5sYW5nKVxyXG4gICAgICAgICAgICB8fCAhb2JqZWN0aXZlLmVxdWFscyhuZXh0UHJvcHMub2JqZWN0aXZlKVxyXG4gICAgICAgICAgICB8fCAhZ3VpbGQuZXF1YWxzKG5leHRQcm9wcy5ndWlsZClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG5vdyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlLFxyXG4gICAgICAgICAgICBndWlsZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc3QgbGFzdEZsaXBwZWQgPSBtb21lbnQudW5peChvYmplY3RpdmUuZ2V0KCdsYXN0RmxpcHBlZCcpKTtcclxuICAgICAgICAvLyBjb25zdCBsYXN0Q2xhaW1lZCA9IG1vbWVudC51bml4KG9iamVjdGl2ZS5nZXQoJ2xhc3RDbGFpbWVkJykpO1xyXG4gICAgICAgIC8vIGNvbnN0IGxhc3Rtb2QgPSBtb21lbnQudW5peChvYmplY3RpdmUuZ2V0KCdsYXN0bW9kJykpO1xyXG4gICAgICAgIC8vIGNvbnN0IGV4cGlyZXMgPSBtb21lbnQudW5peChvYmplY3RpdmUuZ2V0KCdleHBpcmVzJykpO1xyXG5cclxuICAgICAgICBjb25zdCBsYXN0RmxpcHBlZCA9IG9iamVjdGl2ZS5nZXQoJ2xhc3RGbGlwcGVkJyk7XHJcbiAgICAgICAgY29uc3QgbGFzdENsYWltZWQgPSBvYmplY3RpdmUuZ2V0KCdsYXN0Q2xhaW1lZCcpO1xyXG4gICAgICAgIGNvbnN0IGxhc3Rtb2QgPSBvYmplY3RpdmUuZ2V0KCdsYXN0bW9kJyk7XHJcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG9iamVjdGl2ZS5nZXQoJ2V4cGlyZXMnKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgZXhwaXJlcyA9IGxhc3RGbGlwcGVkLmFkZCg1LCAnbScpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBrZXk9e2lkfSBjbGFzc05hbWU9e2B0ZWFtICR7IG9iamVjdGl2ZS5nZXQoJ293bmVyJykgfWB9PlxyXG4gICAgICAgICAgICAgICAgey8qSlNPTi5zdHJpbmdpZnkob2JqZWN0aXZlLnRvSlMoKSkqL31cclxuXHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkIGxvZy1vYmplY3RpdmUnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1leHBpcmUnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlcy5pc0FmdGVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KGV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy10aW1lJz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb21lbnQoKS5kaWZmKGxhc3RGbGlwcGVkLCAnaG91cnMnKSA8IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGxhc3RGbGlwcGVkLmZvcm1hdCgnaGg6bW06c3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsYXN0RmxpcHBlZC5mcm9tTm93KHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWdlbyc+PEFycm93SWNvbiBkaXJlY3Rpb249e2dldE9iamVjdGl2ZURpcmVjdGlvbihvYmplY3RpdmUuZ2V0KCdpZCcpKX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXtvYmplY3RpdmUuZ2V0KCdvd25lcicpfSB0eXBlPXtvYmplY3RpdmUuZ2V0KCd0eXBlJyl9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctbmFtZSc+e1NUQVRJQy5vYmplY3RpdmVzW2lkXS5uYW1lW2xhbmcuZ2V0KCdzbHVnJyldfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWd1aWxkJz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChvYmplY3RpdmUuZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8YSBocmVmPXsnIycgKyBvYmplY3RpdmUuZ2V0KCdndWlsZCcpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkSWQ9e29iamVjdGl2ZS5nZXQoJ2d1aWxkJyl9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz4ge2d1aWxkLmdldCgnbmFtZScpfSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkLmdldCgndGFnJyl9XSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbiAgICAgICAgLy8ge18ubWFwKGVudHJpZXMsIGVudHJ5ID0+XHJcbiAgICAgICAgLy8gICAgIDxsaSBrZXk9e2VudHJ5LmlkfSBjbGFzc05hbWU9e2B0ZWFtICR7ZW50cnkub3duZXJ9YH0+XHJcbiAgICAgICAgLy8gICAgICAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkIGxvZy1vYmplY3RpdmUnPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1leHBpcmUnPntcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZW50cnkuZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KGVudHJ5LmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH08L2xpPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy10aW1lJz57XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIChtb21lbnQoKS5kaWZmKGVudHJ5Lmxhc3RGbGlwcGVkLCAnaG91cnMnKSA8IDQpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICA/IGVudHJ5Lmxhc3RGbGlwcGVkLmZvcm1hdCgnaGg6bW06c3MnKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgOiBlbnRyeS5sYXN0RmxpcHBlZC5mcm9tTm93KHRydWUpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWdlbyc+PEFycm93SWNvbiBkaXJlY3Rpb249e2dldE9iamVjdGl2ZURpcmVjdGlvbihlbnRyeSl9IC8+PC9saT5cclxuICAgICAgICAvLyAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctc3ByaXRlJz48T2JqZWN0aXZlSWNvbiBjb2xvcj17ZW50cnkub3duZXJ9IHR5cGU9e2VudHJ5LnR5cGV9IC8+PC9saT5cclxuICAgICAgICAvLyAgICAgICAgICAgICB7KG1hcEZpbHRlciA9PT0gJycpID8gPGxpIGNsYXNzTmFtZT0nbG9nLW1hcCc+e2dldE1hcChlbnRyeSkuYWJicn08L2xpPiA6IG51bGx9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLW5hbWUnPntTVEFUSUMub2JqZWN0aXZlc1tlbnRyeS5pZF0ubmFtZVtsYW5nLmdldCgnc2x1ZycpXX08L2xpPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHsvKjxsaSBjbGFzc05hbWU9J2xvZy1jbGFpbWVkJz57XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIChlbnRyeS5sYXN0Q2xhaW1lZC5pc1ZhbGlkKCkpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICA/IGVudHJ5Lmxhc3RDbGFpbWVkLmZvcm1hdCgnaGg6bW06c3MnKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfTwvbGk+Ki99XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWd1aWxkJz57XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIChlbnRyeS5ndWlsZClcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgID8gPGEgaHJlZj17JyMnICsgZW50cnkuZ3VpbGR9PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17ZW50cnkuZ3VpbGR9IC8+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkW2VudHJ5Lmd1aWxkXSA/IDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtbmFtZSc+IHtndWlsZFtlbnRyeS5ndWlsZF0ubmFtZX0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHtndWlsZFtlbnRyeS5ndWlsZF0gPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLXRhZyc+IFt7Z3VpbGRbZW50cnkuZ3VpbGRdLnRhZ31dIDwvc3Bhbj4gOiAgbnVsbH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH08L2xpPlxyXG4gICAgICAgIC8vICAgICAgICAgPC91bD5cclxuICAgICAgICAvLyAgICAgPC9saT5cclxuICAgICAgICAvLyApfVxyXG5cclxuRW50cnkgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKEVudHJ5KTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVEaXJlY3Rpb24oaWQpIHtcclxuICAgIGNvbnN0IGJhc2VJZCA9IGlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXAob2JqZWN0aXZlKSB7XHJcbiAgICBjb25zdCBtYXBJZCA9IG9iamVjdGl2ZS5pZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgcmV0dXJuIF8uZmluZChTVEFUSUMubWFwc01ldGEsIG1tID0+IG1tLmlkID09IG1hcElkKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudHJ5OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20nY2xhc3NuYW1lcyc7XHJcbmltcG9ydCBPYmplY3RpdmVJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL09iamVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIG1hcHMsXHJcbiAgICBtYXBGaWx0ZXIgPSAnJyxcclxuICAgIHR5cGVGaWx0ZXIgPSAnJyxcclxuXHJcbiAgICBoYW5kbGVNYXBGaWx0ZXJDbGljayxcclxuICAgIGhhbmRsZVR5cGVGaWx0ZXJDbGljayxcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGlkPSdsb2ctdGFicycgY2xhc3NOYW1lPSdmbGV4LXRhYnMnPlxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHt0YWI6IHRydWUsIGFjdGl2ZTogIW1hcEZpbHRlcn0pfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlTWFwRmlsdGVyQ2xpY2soJycpfVxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW49eydBbGwnfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBTVEFUSUMubWFwc01ldGEsXHJcbiAgICAgICAgICAgICAgICAobW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAobWFwcy5maW5kKG1hdGNoTWFwID0+IG1hdGNoTWFwLmdldCgnaWQnKSA9PSBtbS5pZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bW0uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe3RhYjogdHJ1ZSwgYWN0aXZlOiBtYXBGaWx0ZXIgPT0gbW0uaWR9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZU1hcEZpbHRlckNsaWNrKF8ucGFyc2VJbnQobW0uaWQpKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXttbS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW49e21tLmFiYnJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBbJ2Nhc3RsZScsICdrZWVwJywgJ3Rvd2VyJywgJ2NhbXAnXSxcclxuICAgICAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICAgIDxhICBrZXk9e3R9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHlwZUZpbHRlclt0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IHQgPT09ICdjYXN0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVR5cGVGaWx0ZXJDbGljayh0KX0gPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlSWNvbiB0eXBlPXt0fSBzaXplPXsxOH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVJbW11dGFibGVTZWxlY3RvciB9IGZyb20gJ2xpYi9yZWR1eCc7XHJcblxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgIGZyb20gJ3JlYWN0LWltbXV0YWJsZS1wcm9wdHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCBFbnRyaWVzIGZyb20gJy4vRW50cmllcyc7XHJcbmltcG9ydCBUYWJzIGZyb20gJy4vVGFicyc7XHJcblxyXG5cclxuY29uc3Qgb2JqZWN0aXZlc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5vYmplY3RpdmVzO1xyXG5jb25zdCBtYXBzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscy5nZXQoJ21hcHMnKTtcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IGNyZWF0ZUltbXV0YWJsZVNlbGVjdG9yKFxyXG4gICAgbWFwc1NlbGVjdG9yLFxyXG4gICAgb2JqZWN0aXZlc1NlbGVjdG9yLFxyXG4gICAgKG1hcHMsIG9iamVjdGl2ZXMpID0+ICh7IG1hcHMsIG9iamVjdGl2ZXMgfSlcclxuKTtcclxuXHJcblxyXG5jbGFzcyBMb2dDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBtYXBzOiBJbW11dGFibGVQcm9wVHlwZXMubGlzdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG9iamVjdGl2ZXM6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVyOiAnJyxcclxuICAgICAgICAgICAgdHlwZUZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgY2FzdGxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAga2VlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRvd2VyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FtcDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbWFwcyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlcyxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTI0Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdsb2ctY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHM9e21hcHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXI9e3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUZpbHRlcj17dGhpcy5zdGF0ZS50eXBlRmlsdGVyfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZU1hcEZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlVHlwZUZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXI9e3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUZpbHRlcj17dGhpcy5zdGF0ZS50eXBlRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBoYW5kbGVNYXBGaWx0ZXJDbGljayhtYXBGaWx0ZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc2V0IG1hcEZpbHRlcicsIG1hcEZpbHRlcik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBtYXBGaWx0ZXIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrKHRvZ2dsZVR5cGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndG9nZ2xlIHR5cGVGaWx0ZXInLCB0b2dnbGVUeXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRlLnR5cGVGaWx0ZXJbdG9nZ2xlVHlwZV0gPSAhc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5Mb2dDb250YWluZXIgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuKShMb2dDb250YWluZXIpO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ0NvbnRhaW5lcjsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcbmltcG9ydCBPYmplY3RpdmUgZnJvbSAnLi9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbWF0Y2hNYXAsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcC1zZWN0aW9ucyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIGdldE1hcE9iamVjdGl2ZXNNZXRhKG1hdGNoTWFwLmlkKSxcclxuICAgICAgICAgICAgICAgIChzZWN0aW9uLCBpeCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFwLXNlY3Rpb24nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvbG86IHNlY3Rpb24ubGVuZ3RoID09PSAxLFxyXG4gICAgICAgICAgICAgICAgfSl9IGtleT17aXh9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGdlbykgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtnZW8uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17Z2VvLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXtndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uPXtnZW8uZGlyZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hdGNoTWFwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93PXtub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwT2JqZWN0aXZlc01ldGEobWFwSWQpIHtcclxuICAgIGxldCBtYXBDb2RlID0gJ2JsMic7XHJcblxyXG4gICAgaWYgKG1hcElkID09PSAzOCkge1xyXG4gICAgICAgIG1hcENvZGUgPSAnZWInO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKFNUQVRJQy5vYmplY3RpdmVzTWV0YSlcclxuICAgICAgICAuY2xvbmVEZWVwKClcclxuICAgICAgICAuZmlsdGVyKG9tID0+IG9tLm1hcCA9PT0gbWFwQ29kZSlcclxuICAgICAgICAuZ3JvdXBCeShvbSA9PiBvbS5ncm91cClcclxuICAgICAgICAudmFsdWUoKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSdtb21lbnQnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5pbXBvcnQgQXJyb3cgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvQXJyb3cnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBpZCxcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBkaXJlY3Rpb24sXHJcbiAgICBtYXRjaE1hcCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG4gICAgY29uc3Qgb2JqZWN0aXZlSWQgPSBgJHttYXRjaE1hcC5pZH0tJHtpZH1gO1xyXG4gICAgY29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlc1tvYmplY3RpdmVJZF07XHJcbiAgICBjb25zdCBtbyA9IF8uZmluZChtYXRjaE1hcC5vYmplY3RpdmVzLCBvID0+IG8uaWQgPT09IG9iamVjdGl2ZUlkKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgJ2xpc3QtdW5zdHlsZWQnOiB0cnVlLFxyXG4gICAgICAgICAgICAndHJhY2stb2JqZWN0aXZlJzogdHJ1ZSxcclxuICAgICAgICAgICAgZnJlc2g6IG5vdy5kaWZmKG1vLmxhc3RGbGlwcGVkLCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyaW5nOiBtby5leHBpcmVzLmlzQWZ0ZXIobm93KSAmJiBtby5leHBpcmVzLmRpZmYobm93LCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyZWQ6IG5vdy5pc0FmdGVyKG1vLmV4cGlyZXMpLFxyXG4gICAgICAgICAgICBhY3RpdmU6IG5vdy5pc0JlZm9yZShtby5leHBpcmVzKSxcclxuICAgICAgICB9KX0+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xlZnQnPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1nZW8nPjxBcnJvdyBkaXJlY3Rpb249e2RpcmVjdGlvbn0gLz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLXNwcml0ZSc+PE9iamVjdGl2ZUljb24gY29sb3I9e21vLm93bmVyfSB0eXBlPXttby50eXBlfSAvPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stbmFtZSc+e29NZXRhLm5hbWVbbGFuZy5zbHVnXX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J3JpZ2h0Jz5cclxuICAgICAgICAgICAgICAgIHttby5ndWlsZFxyXG4gICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0cmFjay1ndWlsZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17JyMnICsgbW8uZ3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtndWlsZHNbbW8uZ3VpbGRdID8gYCR7Z3VpbGRzW21vLmd1aWxkXS5uYW1lfSBbJHtndWlsZHNbbW8uZ3VpbGRdLnRhZ31dYCA6ICdMb2FkaW5nLi4uJ31cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17bW8uZ3VpbGR9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stZXhwaXJlJz5cclxuICAgICAgICAgICAgICAgICAgICB7bW8uZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBtb21lbnQobW8uZXhwaXJlcy5kaWZmKG5vdywgJ21pbGxpc2Vjb25kcycpKS5mb3JtYXQoJ206c3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICk7XHJcbn07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgTWF0Y2hNYXAgZnJvbSAnLi9NYXRjaE1hcCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG5cclxuICAgIGlmIChfLmlzRW1wdHkobWF0Y2gpKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFwcyA9IF8ua2V5QnkobWF0Y2gubWFwcywgJ2lkJyk7XHJcbiAgICBjb25zdCBjdXJyZW50TWFwSWRzID0gXy5rZXlzKG1hcHMpO1xyXG4gICAgY29uc3QgbWFwc01ldGFBY3RpdmUgPSBfLmZpbHRlcihcclxuICAgICAgICBTVEFUSUMubWFwc01ldGEsXHJcbiAgICAgICAgbWFwTWV0YSA9PiBfLmluZGV4T2YoY3VycmVudE1hcElkcywgXy5wYXJzZUludChtYXBNZXRhLmlkKSAhPT0gLTEpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9J21hcHMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBtYXBzTWV0YUFjdGl2ZSxcclxuICAgICAgICAgICAgICAgIChtYXBNZXRhKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcCcga2V5PXttYXBNZXRhLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8aDI+e21hcE1ldGEubmFtZX08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaE1hcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e2d1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwTWV0YT17bWFwTWV0YX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hcHNbbWFwTWV0YS5pZF19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTYnPns8TWFwRGV0YWlscyBtYXBLZXk9J0NlbnRlcicgbWFwTWV0YT17Z2V0TWFwTWV0YSgnQ2VudGVyJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0xOCc+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nUmVkSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnUmVkSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0JsdWVIb21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdCbHVlSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0dyZWVuSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnR3JlZW5Ib21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICovIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgU3ByaXRlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL0ljb25zL1Nwcml0ZSc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3QgSG9sZGluZ3MgPSAoe1xyXG4gICAgY29sb3IsXHJcbiAgICBob2xkaW5ncyxcclxufSkgPT4gKFxyXG4gICAgPHVsIGNsYXNzTmFtZT0nbGlzdC1pbmxpbmUnPlxyXG4gICAgICAgIHtob2xkaW5ncy5tYXAoXHJcbiAgICAgICAgICAgICh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgPGxpIGtleT17dHlwZUluZGV4fT5cclxuICAgICAgICAgICAgICAgIDxTcHJpdGVcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0ge3R5cGVJbmRleH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHtjb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdxdWFudGl0eSc+eHt0eXBlUXVhbnRpdHl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICl9XHJcbiAgICA8L3VsPlxyXG4pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhvbGRpbmdzOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuXHJcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuaW1wb3J0IEltbXV0YWJsZVByb3BUeXBlcyAgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XHJcblxyXG5pbXBvcnQgbnVtZXJhbCBmcm9tICdudW1lcmFsJztcclxuXHJcbmltcG9ydCBIb2xkaW5ncyBmcm9tICcuL0hvbGRpbmdzJztcclxuXHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgYXMgc3RhdGljV29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcbmNvbnN0IFNUQVRJQ19XT1JMRFMgPSBJbW11dGFibGUuZnJvbUpTKHN0YXRpY1dvcmxkcyk7XHJcblxyXG5leHBvcnQgY29uc3QgcmdiTnVtID0gSW1tdXRhYmxlLk1hcCh7IHJlZDogMCwgYmx1ZTogMCwgZ3JlZW46IDAgfSk7XHJcblxyXG5jb25zdCBMb2FkaW5nID0gKHsgIH0pID0+IChcclxuICAgIDxoMSBzdHlsZT17eyBoZWlnaHQ6ICcxMDBweCcsIGZvbnRTaXplOiAnNTBweCcsIGxpbmVIZWlnaHQ6ICcxMDBweCcgfX0+XHJcbiAgICAgICAgPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nPjwvaT5cclxuICAgIDwvaDE+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogcmVkdXggaGVscGVyc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xvclNlbGVjdG9yID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHMuY29sb3I7XHJcblxyXG5jb25zdCBsYW5nU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmxhbmc7XHJcbmNvbnN0IG1hdGNoRGV0YWlsc1NlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5tYXRjaERldGFpbHM7XHJcblxyXG5jb25zdCB3b3JsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hEZXRhaWxzU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hEZXRhaWxzKSA9PiBtYXRjaERldGFpbHMuZ2V0KCd3b3JsZHMnKVxyXG4pO1xyXG5cclxuY29uc3Qgd29ybGRJZFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXHJcbiAgICBjb2xvclNlbGVjdG9yLFxyXG4gICAgd29ybGRzU2VsZWN0b3IsXHJcbiAgICAoY29sb3IsIHdvcmxkcykgPT4gd29ybGRzLmdldChjb2xvcikudG9TdHJpbmcoKVxyXG4pO1xyXG5cclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbGFuZ1NlbGVjdG9yLFxyXG4gICAgd29ybGRJZFNlbGVjdG9yLFxyXG4gICAgKGxhbmcsIHdvcmxkSWQpID0+IFNUQVRJQ19XT1JMRFMuZ2V0SW4oXHJcbiAgICAgICAgW3dvcmxkSWQsIGxhbmcuZ2V0KCdzbHVnJyldLFxyXG4gICAgICAgIEltbXV0YWJsZS5NYXAoKVxyXG4gICAgKVxyXG4pO1xyXG5cclxuY29uc3Qgc3RhdHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxyXG4gICAgbWF0Y2hEZXRhaWxzU2VsZWN0b3IsXHJcbiAgICAobWF0Y2hEZXRhaWxzKSA9PiBtYXRjaERldGFpbHMuZ2V0KCdzdGF0cycpXHJcbik7XHJcblxyXG5jb25zdCB3b3JsZFN0YXRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICBzdGF0c1NlbGVjdG9yLFxyXG4gICAgKGNvbG9yLCBzdGF0cykgPT4gSW1tdXRhYmxlXHJcbiAgICAgICAgLk1hcCh7XHJcbiAgICAgICAgICAgIGRlYXRoczoge30sXHJcbiAgICAgICAgICAgIGtpbGxzOiB7fSxcclxuICAgICAgICAgICAgaG9sZGluZ3M6IHt9LFxyXG4gICAgICAgICAgICBzY29yZXM6IHt9LFxyXG4gICAgICAgICAgICB0aWNrczoge30sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAubWFwKCh2LCBrZXkpID0+IHN0YXRzLmdldEluKFtrZXksIGNvbG9yXSkpXHJcbik7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBjcmVhdGVTZWxlY3RvcihcclxuICAgIGNvbG9yU2VsZWN0b3IsXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICB3b3JsZFN0YXRzU2VsZWN0b3IsXHJcbiAgICB3b3JsZFNlbGVjdG9yLFxyXG4gICAgd29ybGRJZFNlbGVjdG9yLFxyXG4gICAgKGNvbG9yLCBsYW5nLCBzdGF0cywgd29ybGQsIHdvcmxkSWQpID0+ICh7XHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBzdGF0cyxcclxuICAgICAgICB3b3JsZCxcclxuICAgICAgICB3b3JsZElkLFxyXG4gICAgfSlcclxuKTtcclxuXHJcbi8vIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuLy8gICAgIGNvbnN0IHdvcmxkID0gSW1tdXRhYmxlLmZyb21KUyhcclxuLy8gICAgICAgICAocHJvcHMud29ybGRJZClcclxuLy8gICAgICAgICAgICAgPyB3b3JsZHNbcHJvcHMud29ybGRJZF1bc3RhdGUubGFuZy5nZXQoJ3NsdWcnKV1cclxuLy8gICAgICAgICAgICAgOiB7fVxyXG4vLyAgICAgKTtcclxuXHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGNvbG9yOiBwcm9wcy5jb2xvcixcclxuLy8gICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4vLyAgICAgICAgIHdvcmxkSWQ6IHByb3BzLndvcmxkSWQsXHJcbi8vICAgICAgICAgc3RhdHM6IEltbXV0YWJsZS5NYXAoKSxcclxuLy8gICAgICAgICB3b3JsZCxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcblxyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxhbmc6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcclxuICAgICAgICBzdGF0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgICAgICB3b3JsZElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgfTtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICBzdGF0cyxcclxuICAgICAgICAgICAgd29ybGQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICFsYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZylcclxuICAgICAgICAgICAgfHwgIXN0YXRzLmVxdWFscyhuZXh0UHJvcHMuc3RhdHMpXHJcbiAgICAgICAgICAgIHx8ICF3b3JsZC5lcXVhbHMobmV4dFByb3BzLndvcmxkKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIHN0YXRzLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuICAgICAgICAgICAgd29ybGRJZCxcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbG9yJywgY29sb3IpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd3b3JsZElkJywgd29ybGRJZCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkJywgd29ybGQudG9KUygpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RhdHMnLCBzdGF0cy50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHNjb3JlYm9hcmQgdGVhbS1iZyB0ZWFtIHRleHQtY2VudGVyICR7Y29sb3J9YH0+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAod29ybGQuaGFzKCduYW1lJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxhIGhyZWY9e3dvcmxkLmdldCgnbGluaycpfT57d29ybGQuZ2V0KCduYW1lJyl9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIH08L2gxPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzdGF0cyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgU2NvcmUnPntudW1lcmFsKHN0YXRzLmdldCgnc2NvcmVzJykpLmZvcm1hdCgnMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBUaWNrJz57bnVtZXJhbChzdGF0cy5nZXQoJ3RpY2tzJykpLmZvcm1hdCgnKzAsMCcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzdWItc3RhdHMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIEtpbGxzJz57bnVtZXJhbChzdGF0cy5nZXQoJ2tpbGxzJykpLmZvcm1hdCgnMCwwJyl9azwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgRGVhdGhzJz57bnVtZXJhbChzdGF0cy5nZXQoJ2RlYXRocycpKS5mb3JtYXQoJzAsMCcpfWQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxIb2xkaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRpbmdzPXtzdGF0cy5nZXQoJ2hvbGRpbmdzJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbldvcmxkID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShXb3JsZCk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmxkOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBXb3JsZCBmcm9tICcuL1dvcmxkJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gKHsgd29ybGRzOiBzdGF0ZS5tYXRjaERldGFpbHMuZ2V0KCd3b3JsZHMnKSB9KTtcclxuXHJcblxyXG5sZXQgU2NvcmVib2FyZCA9ICh7XHJcbiAgICB3b3JsZHMsXHJcbn0pID0+ICB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0ncm93JyBpZD0nc2NvcmVib2FyZHMnPntcclxuICAgICAgICAgICAgKEltbXV0YWJsZS5NYXAuaXNNYXAod29ybGRzKSlcclxuICAgICAgICAgICAgPyB3b3JsZHMua2V5U2VxKCkubWFwKFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS04JyBrZXk9e2NvbG9yfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFdvcmxkIGNvbG9yPXtjb2xvcn0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgICAgICB9PC9zZWN0aW9uPlxyXG4gICAgKTtcclxufTtcclxuU2NvcmVib2FyZC5wcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZHM6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAsXHJcbn07XHJcblxyXG5TY29yZWJvYXJkID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHNcclxuKShTY29yZWJvYXJkKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBwcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRzUHJvcHMoc3RhdHMsIHdvcmxkcykge1xyXG4gICAgLy8gY29uc3Qgd29ybGRzUHJvcHMgPSBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgIC8vICAgICByZWQ6IHsgY29sb3I6ICdyZWQnLCB3b3JsZDogd29ybGRzLmdldEluKCdyZWQnKSwgc3RhdHM6IGdldFdvcmxkU3RhdHMoc3RhdHMsICdyZWQnKSB9LFxyXG4gICAgLy8gICAgIGJsdWU6IHsgY29sb3I6ICdibHVlJywgd29ybGQ6IHdvcmxkcy5nZXRJbignYmx1ZScpLCBzdGF0czogZ2V0V29ybGRTdGF0cyhzdGF0cywgJ2JsdWUnKSB9LFxyXG4gICAgLy8gICAgIGdyZWVuOiB7IGNvbG9yOiAnZ3JlZW4nLCB3b3JsZDogd29ybGRzLmdldEluKCdncmVlbicpLCBzdGF0czogIGdldFdvcmxkU3RhdHMoc3RhdHMsICdncmVlbicpIH0sXHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICBjb25zdCBjb2xvcnMgPSBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICByZWQ6IHt9LFxyXG4gICAgICAgIGJsdWU6IHt9LFxyXG4gICAgICAgIGdyZWVuOiB7fSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghSW1tdXRhYmxlLk1hcC5pc01hcCh3b3JsZHMpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB3b3JsZHNQcm9wcyA9IGNvbG9ycy5tYXAoXHJcbiAgICAgICAgKG9iaiwgY29sb3IpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cob2JqLCBjb2xvciwgd29ybGRzLmdldEluKFtjb2xvcl0pKTtcclxuICAgICAgICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgIHdvcmxkSWQ6IHdvcmxkcy5nZXRJbihbY29sb3JdKSxcclxuICAgICAgICAgICAgICAgIHN0YXRzOiBnZXRXb3JsZFN0YXRzKHN0YXRzLCBjb2xvciksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd3b3JsZHNQcm9wcycsIHdvcmxkc1Byb3BzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdtYXRjaC53b3JsZHMnLCBtYXRjaC53b3JsZHMpO1xyXG5cclxuICAgIC8vIGlmICh3b3JsZHMpIHtcclxuICAgIC8vICAgICB3b3JsZHMuZm9yRWFjaChcclxuICAgIC8vICAgICAgICAgKHdvcmxkSWQsIGNvbG9yKSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICB3b3JsZHNQcm9wcy5zZXRJbihbY29sb3IsICdpZCddLCB3b3JsZElkKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgICk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3dvcmxkc1Byb3BzJywgd29ybGRzUHJvcHMpO1xyXG5cclxuICAgIHJldHVybiB3b3JsZHNQcm9wcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkU3RhdHMoc3RhdHMsIGNvbG9yKSB7XHJcbiAgICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh7XHJcbiAgICAgICAgZGVhdGhzOiBzdGF0cy5nZXRJbihbJ2RlYXRocycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgaG9sZGluZ3M6IHN0YXRzLmdldEluKFsnaG9sZGluZ3MnLCBjb2xvcl0sIFswLCAwLCAwLCAwXSksXHJcbiAgICAgICAga2lsbHM6IHN0YXRzLmdldEluKFsna2lsbHMnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgIHNjb3JlOiBzdGF0cy5nZXRJbihbJ3Njb3JlcycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgdGljazogc3RhdHMuZ2V0SW4oWyd0aWNrcycsIGNvbG9yXSwgMCksXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogZXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjb3JlYm9hcmQ7IiwiXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcclxuaW1wb3J0IHsgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IgfSBmcm9tICdsaWIvcmVkdXgnO1xyXG5cclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgSW1tdXRhYmxlUHJvcFR5cGVzICBmcm9tICdyZWFjdC1pbW11dGFibGUtcHJvcHR5cGVzJztcclxuXHJcbmltcG9ydCBfIGZyb20nbG9kYXNoJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9hcGknO1xyXG5pbXBvcnQgKiBhcyB0aW1lb3V0QWN0aW9ucyBmcm9tICdhY3Rpb25zL3RpbWVvdXRzJztcclxuaW1wb3J0ICogYXMgbm93QWN0aW9ucyBmcm9tICdhY3Rpb25zL25vdyc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqICAgRGF0YVxyXG4gKi9cclxuXHJcbi8vIGltcG9ydCBEQU8gZnJvbSAnbGliL2RhdGEvdHJhY2tlcic7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIFJlYWN0IENvbXBvbmVudHNcclxuICovXHJcblxyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL1Njb3JlYm9hcmQnO1xyXG5pbXBvcnQgTWFwcyBmcm9tICcuL01hcHMnO1xyXG5pbXBvcnQgTG9nIGZyb20gJy4vTG9nJztcclxuaW1wb3J0IEd1aWxkcyBmcm9tICcuL0d1aWxkcyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IE1BVENIX1JFRlJFU0ggPSBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApO1xyXG5jb25zdCBUSU1FX1JFRlJFU0ggPSAxMDAwIC8gMTtcclxuXHJcbi8vIGNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4gKFxyXG4vLyAgICAgPGgxIGlkPSdBcHBMb2FkaW5nJz5cclxuLy8gICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4vLyAgICAgPC9oMT5cclxuLy8gKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuLy8gY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbi8vICAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkLFxyXG4vLyAgICAgICAgIGd1aWxkczogc3RhdGUuZ3VpbGRzLFxyXG4vLyAgICAgICAgIC8vIHRpbWVvdXRzOiBzdGF0ZS50aW1lb3V0cyxcclxuLy8gICAgIH07XHJcbi8vIH07XHJcbmNvbnN0IGFwaVNlbGVjdG9yID0gKHN0YXRlKSA9PiBzdGF0ZS5hcGk7XHJcbmNvbnN0IGxhbmdTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUubGFuZztcclxuLy8gY29uc3Qgbm93U2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm5vdztcclxuLy8gY29uc3QgbWF0Y2hEZXRhaWxzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLm1hdGNoRGV0YWlscztcclxuLy8gY29uc3QgZ3VpbGRzU2VsZWN0b3IgPSAoc3RhdGUpID0+IHN0YXRlLmd1aWxkcztcclxuY29uc3Qgd29ybGRTZWxlY3RvciA9IChzdGF0ZSkgPT4gc3RhdGUud29ybGQ7XHJcblxyXG5jb25zdCBkZXRhaWxzSXNGZXRjaGluZ1NlbGVjdG9yID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBhcGlTZWxlY3RvciwgKGFwaSkgPT4gYXBpLmdldCgncGVuZGluZycpLmluY2x1ZGVzKCdtYXRjaERldGFpbHMnKVxyXG4pO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IoXHJcbiAgICBsYW5nU2VsZWN0b3IsXHJcbiAgICAvLyBub3dTZWxlY3RvcixcclxuICAgIC8vIGd1aWxkc1NlbGVjdG9yLFxyXG4gICAgLy8gbWF0Y2hEZXRhaWxzU2VsZWN0b3IsXHJcbiAgICB3b3JsZFNlbGVjdG9yLFxyXG4gICAgZGV0YWlsc0lzRmV0Y2hpbmdTZWxlY3RvcixcclxuICAgIChcclxuICAgICAgICBsYW5nLFxyXG4gICAgICAgIC8vIG5vdyxcclxuICAgICAgICAvLyBndWlsZHMsXHJcbiAgICAgICAgLy8gbWF0Y2hEZXRhaWxzLFxyXG4gICAgICAgIHdvcmxkLFxyXG4gICAgICAgIGRldGFpbHNJc0ZldGNoaW5nXHJcbiAgICApID0+ICh7XHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICAvLyBub3csXHJcbiAgICAgICAgLy8gZ3VpbGRzLFxyXG4gICAgICAgIC8vIG1hdGNoRGV0YWlscyxcclxuICAgICAgICB3b3JsZCxcclxuICAgICAgICBkZXRhaWxzSXNGZXRjaGluZyxcclxuICAgIH0pXHJcbik7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0Tm93OiAoKSA9PiBkaXNwYXRjaChub3dBY3Rpb25zLnNldE5vdygpKSxcclxuXHJcbiAgICAgICAgZmV0Y2hHdWlsZEJ5SWQ6IChpZCkgPT4gZGlzcGF0Y2goYXBpQWN0aW9ucy5mZXRjaEd1aWxkQnlJZChpZCkpLFxyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzOiAod29ybGRJZCkgPT4gZGlzcGF0Y2goYXBpQWN0aW9ucy5mZXRjaE1hdGNoRGV0YWlscyh3b3JsZElkKSksXHJcblxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6ICh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLnNldEFwcFRpbWVvdXQoeyBuYW1lLCBjYiwgdGltZW91dCB9KSksXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiAoeyBuYW1lIH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcblxyXG5jbGFzcyBUcmFja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXM9e1xyXG4gICAgICAgIGxhbmcgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBkZXRhaWxzSXNGZXRjaGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyBndWlsZHMgOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbWF0Y2hEZXRhaWxzIDogSW1tdXRhYmxlUHJvcFR5cGVzLm1hcC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXROb3c6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgLy8gbm93OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIGZldGNoR3VpbGRCeUlkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBzZXRBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGNsZWFyQXBwVGltZW91dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgd29ybGQsXHJcbiAgICAgICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzLFxyXG4gICAgICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpO1xyXG4gICAgICAgIGZldGNoTWF0Y2hEZXRhaWxzKHsgd29ybGQgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm93KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0QXBwVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWU6ICdzZXROb3cnLFxyXG4gICAgICAgICAgICBjYjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXROb3coKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTm93KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVfUkVGUkVTSCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVHJhY2tlcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgICAgICAvLyBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICB3b3JsZCxcclxuXHJcbiAgICAgICAgICAgIGRldGFpbHNJc0ZldGNoaW5nLFxyXG5cclxuICAgICAgICAgICAgZmV0Y2hNYXRjaERldGFpbHMsXHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmICghbGFuZy5lcXVhbHMobmV4dFByb3BzLmxhbmcpIHx8IHdvcmxkLnNsdWcgIT09IG5leHRQcm9wcy53b3JsZC5zbHVnKSB7XHJcbiAgICAgICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZywgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXRhaWxzSXNGZXRjaGluZyAmJiAhbmV4dFByb3BzLmRldGFpbHNJc0ZldGNoaW5nKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgIGNiOiAoKSA9PiBmZXRjaE1hdGNoRGV0YWlscyh7IHdvcmxkIH0pLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogKCkgPT4gTUFUQ0hfUkVGUkVTSCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICAgICAgLy8gfHwgdGhpcy5pc05ld1NlY29uZChuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld1NlY29uZChuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMucHJvcHMubm93LmlzU2FtZShuZXh0UHJvcHMubm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICghdGhpcy5wcm9wcy5sYW5nLmVxdWFscyhuZXh0UHJvcHMubGFuZykpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaERldGFpbHMnIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0ndHJhY2tlcic+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVib2FyZCAvPlxyXG4gICAgICAgICAgICAgICAgPExvZyAvPlxyXG4gICAgICAgICAgICAgICAgPEd1aWxkcyAvPlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB7LypcclxuICAgICAgICAgICAgICAgIHsobWF0Y2ggJiYgIV8uaXNFbXB0eShtYXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAqL31cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblRyYWNrZXIgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuICBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShUcmFja2VyKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBtb21lbnROb3coKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICogMTAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGROYW1lID0gd29ybGQubmFtZTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLmpvaW4oJyAtICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFja2VyOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcbmNvbnN0IFBpZSA9ICh7IHNjb3JlcyB9KSA9PiAoXHJcbiAgICA8aW1nXHJcbiAgICAgICAgc3JjID0ge2dldEltYWdlU291cmNlKHNjb3Jlcyl9XHJcblxyXG4gICAgICAgIHdpZHRoID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAgICAgaGVpZ2h0ID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAvPlxyXG4pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEltYWdlU291cmNlKHNjb3Jlcykge1xyXG4gICAgcmV0dXJuIGBodHRwczpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLnJlZH0sJHtzY29yZXMuYmx1ZX0sJHtzY29yZXMuZ3JlZW59P3N0cm9rZVdpZHRoPSR7SU5TVEFOQ0Uuc3Ryb2tlfWA7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBQaWU7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IFNwcml0ZSA9ICh7XHJcbiAgICBjb2xvcixcclxuICAgIHR5cGUsXHJcbn0pID0+IChcclxuICAgIDxzcGFuIGNsYXNzTmFtZSA9IHtgc3ByaXRlICR7dHlwZX0gJHtjb2xvcn1gfSAvPlxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3ByaXRlOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEFycm93ID0gKHsgZGlyZWN0aW9uIH0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBjb25zdCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmICghZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcnJvdzsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IEVtYmxlbSA9ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbWJsZW07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gKHtcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxcclxuICAgIHR5cGUsXHJcbiAgICBzaXplLFxyXG59KSA9PiB7XHJcbiAgICBsZXQgc3JjID0gJy9pbWcvaWNvbnMvZGlzdC8nO1xyXG4gICAgc3JjICs9IHR5cGU7XHJcbiAgICBpZiAoY29sb3IgIT09ICdibGFjaycpIHtcclxuICAgICAgICBzcmMgKz0gJy0nICsgY29sb3I7XHJcbiAgICB9XHJcbiAgICBzcmMgKz0gJy5zdmcnO1xyXG5cclxuICAgIHJldHVybiA8aW1nXHJcbiAgICAgICAgc3JjPXtzcmN9XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgaWNvbi1vYmplY3RpdmUgaWNvbi1vYmplY3RpdmUtJHt0eXBlfWB9XHJcbiAgICAgICAgd2lkdGg9e3NpemUgPyBzaXplOiBudWxsfVxyXG4gICAgICAgIGhlaWdodD17c2l6ZSA/IHNpemU6IG51bGx9XHJcbiAgICAvPjtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdGl2ZTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUGVyZiBmcm9tICdyZWFjdC1hZGRvbnMtcGVyZic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJmb3JtYW5jZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBvblN0YXJ0KCkge1xyXG4gICAgICAgIFBlcmYuc3RhcnQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnUGVyZiBzdGFydGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdG9wKCkge1xyXG4gICAgICAgIFBlcmYuc3RvcCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQZXJmIHN0b3BwZWQnKTtcclxuICAgICAgICBjb25zdCBsYXN0TWVhc3VyZW1lbnRzID0gUGVyZi5nZXRMYXN0TWVhc3VyZW1lbnRzKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5kaXIobGFzdE1lYXN1cmVtZW50cyk7XHJcbiAgICAgICAgLy8gUGVyZi5wcmludERPTShsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgICAgICBQZXJmLnByaW50SW5jbHVzaXZlKGxhc3RNZWFzdXJlbWVudHMpO1xyXG4gICAgICAgIFBlcmYucHJpbnRFeGNsdXNpdmUobGFzdE1lYXN1cmVtZW50cyk7XHJcbiAgICAgICAgUGVyZi5wcmludFdhc3RlZChsYXN0TWVhc3VyZW1lbnRzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz5QZXJmb3JtYW5jZTogPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMub25TdGFydH0+U3RhcnQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5vblN0b3B9PlN0b3A8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJcclxuLypcclxuKiAgIEdlbmVyaWNcclxuKi9cclxuXHJcbi8vIHJvdXRlc1xyXG5leHBvcnQgY29uc3QgU0VUX1JPVVRFID0gJ1NFVF9ST1VURSc7XHJcblxyXG4vLyBsYW5nc1xyXG5leHBvcnQgY29uc3QgU0VUX0xBTkcgPSAnU0VUX0xBTkcnO1xyXG5cclxuLy8gdGltZW91dHNcclxuZXhwb3J0IGNvbnN0IEFERF9USU1FT1VUID0gJ0FERF9USU1FT1VUJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9USU1FT1VUID0gJ1JFTU9WRV9USU1FT1VUJztcclxuLy8gZXhwb3J0IGNvbnN0IFJFTU9WRV9BTExfVElNRU9VVFMgPSAnUkVNT1ZFX0FMTF9USU1FT1VUUyc7XHJcblxyXG4vLyB3b3JsZHNcclxuZXhwb3J0IGNvbnN0IFNFVF9XT1JMRCA9ICdTRVRfV09STEQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfV09STEQgPSAnQ0xFQVJfV09STEQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgQVBJXHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgQVBJX1JFUVVFU1RfT1BFTiA9ICdBUElfUkVRVUVTVF9PUEVOJztcclxuZXhwb3J0IGNvbnN0IEFQSV9SRVFVRVNUX1NVQ0NFU1MgPSAnQVBJX1JFUVVFU1RfU1VDQ0VTUyc7XHJcbmV4cG9ydCBjb25zdCBBUElfUkVRVUVTVF9GQUlMRUQgPSAnQVBJX1JFUVVFU1RfRkFJTEVEJztcclxuXHJcblxyXG5cclxuLypcclxuKiAgIE92ZXJ2aWV3XHJcbiovXHJcblxyXG4vLyBtYXRjaGVzXHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX01BVENIRVMgPSAnUkVDRUlWRV9NQVRDSEVTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFU19TVUNDRVNTID0gJ1JFQ0VJVkVfTUFUQ0hFU19TVUNDRVNTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQgPSAnUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBUcmFja2VyXHJcbiovXHJcblxyXG4vLyBub3dcclxuZXhwb3J0IGNvbnN0IFNFVF9OT1cgPSAnU0VUX05PVyc7XHJcblxyXG4vLyBtYXRjaGVzXHJcbmV4cG9ydCBjb25zdCBDTEVBUl9NQVRDSERFVEFJTFMgPSAnQ0xFQVJfTUFUQ0hERVRBSUxTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hERVRBSUxTID0gJ1JFQ0VJVkVfTUFUQ0hERVRBSUxTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hERVRBSUxTX1NVQ0NFU1MgPSAnUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyc7XHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQgPSAnUkVDRUlWRV9NQVRDSERFVEFJTFNfRkFJTEVEJztcclxuXHJcblxyXG4vLyBndWlsZHNcclxuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVfR1VJTEQgPSAnSU5JVElBTElaRV9HVUlMRCc7XHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX0dVSUxEID0gJ1JFQ0VJVkVfR1VJTEQnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9HVUlMRF9GQUlMRUQgPSAnUkVDRUlWRV9HVUlMRF9GQUlMRUQnO1xyXG5cclxuLy8gb2JqZWN0aXZlc1xyXG5leHBvcnQgY29uc3QgT0JKRUNUSVZFU19SRVNFVCA9ICdPQkpFQ1RJVkVTX1JFU0VUJztcclxuZXhwb3J0IGNvbnN0IE9CSkVDVElWRVNfVVBEQVRFID0gJ09CSkVDVElWRVNfVVBEQVRFJztcclxuZXhwb3J0IGNvbnN0IE9CSkVDVElWRV9VUERBVEUgPSAnT0JKRUNUSVZFX1VQREFURSc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBUcmFja2VyXHJcbiovIiwiXHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVyYWdlbnQnO1xyXG5cclxuY29uc3Qgbm9vcCA9ICgpID0+IG51bGw7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoQnlXb3JsZFNsdWcsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRJZCxcclxuICAgIGdldEd1aWxkQnlJZCxcclxufTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hlcyh7XHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hlcygpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzYClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZFNsdWcoe1xyXG4gICAgd29ybGRTbHVnLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZFNsdWcoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZFNsdWd9YClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgIHdvcmxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hCeVdvcmxkSWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRHdWlsZEJ5SWQoe1xyXG4gICAgZ3VpbGRJZCxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRHdWlsZEJ5SWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24/Z3VpbGRfaWQ9JHtndWlsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25SZXF1ZXN0KGNhbGxiYWNrcywgZXJyLCByZXMpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6Om9uUmVxdWVzdCgpJywgZXJyLCByZXMgJiYgcmVzLmJvZHkpO1xyXG5cclxuICAgIGlmIChlcnIgfHwgcmVzLmVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLmVycm9yKGVycik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjYWxsYmFja3Muc3VjY2VzcyhyZXMuYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2tzLmNvbXBsZXRlKCk7XHJcbn0iLCJcclxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvckNyZWF0b3IsIGRlZmF1bHRNZW1vaXplIH0gZnJvbSAncmVzZWxlY3QnO1xyXG5cclxuLy8gY3JlYXRlIGEgXCJzZWxlY3RvciBjcmVhdG9yXCIgdGhhdCB1c2VzIEltbXV0YWJsZS5pcyBpbnN0ZWFkIG9mID09PVxyXG5leHBvcnQgY29uc3QgY3JlYXRlSW1tdXRhYmxlU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXHJcbiAgZGVmYXVsdE1lbW9pemUsXHJcbiAgSW1tdXRhYmxlLmlzXHJcbik7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBTVEFUSUNfTEFOR1MgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL2xhbmdzJztcclxuaW1wb3J0IFNUQVRJQ19XT1JMRFMgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzJztcclxuaW1wb3J0IFNUQVRJQ19PQkpFQ1RJVkVTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVzX3YyX21lcmdlZCc7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGRbbGFuZ1NsdWddLnNsdWddLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlcyA9IFNUQVRJQ19PQkpFQ1RJVkVTO1xyXG5leHBvcnQgY29uc3QgbGFuZ3MgPSBTVEFUSUNfTEFOR1M7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHdvcmxkcyA9IF9cclxuICAgIC5jaGFpbihTVEFUSUNfV09STERTKVxyXG4gICAgLmtleUJ5KCdpZCcpXHJcbiAgICAubWFwVmFsdWVzKCh3b3JsZCkgPT4ge1xyXG4gICAgICAgIF8uZm9yRWFjaChcclxuICAgICAgICAgICAgU1RBVElDX0xBTkdTLFxyXG4gICAgICAgICAgICAobGFuZykgPT5cclxuICAgICAgICAgICAgd29ybGRbbGFuZy5zbHVnXS5saW5rID0gZ2V0V29ybGRMaW5rKGxhbmcuc2x1Zywgd29ybGQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gd29ybGQ7XHJcbiAgICB9KVxyXG4gICAgLnZhbHVlKCk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzTWV0YSA9IF8ua2V5QnkoW1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDEsIGlkOiAnOScsIGRpcmVjdGlvbjogJyd9LCAgICAgICAgICAvLyBzdG9uZW1pc3RcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAgLy8gb3Zlcmxvb2tcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE3JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gbWVuZG9uc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMjAnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAvLyB2ZWxva2FcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE4JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgLy8gYW56XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxOScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgIC8vIG9ncmVcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAgLy8gc3BlbGRhblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnNScsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgICAvLyBwYW5nXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIHZhbGxleVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMTUnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBsYW5nb3JcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzIyJywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8gYnJhdm9zdFxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMTYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBxdWVudGluXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGR1cmlvc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnNycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBkYW5lXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICc4JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgIC8vIHVtYmVyXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICczJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGxvd2xhbmRzXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMScsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIGFsZG9uc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTMnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBqZXJyaWZlclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTInLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyB3aWxkY3JlZWtcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8ga2xvdmFuXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMCcsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIHJvZ3Vlc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnNCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyBnb2xhbnRhXHJcblxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzExMycsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgLy8gcmFtcGFydFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzEwNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgLy8gdW5kZXJjcm9mdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzExNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgLy8gcGFsYWNlXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTAyJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBhY2FkZW15XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTA0JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyBuZWNyb3BvbGlzXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnOTknLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBsYWJcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMTUnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGhpZGVhd2F5XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTA5JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyByZWZ1Z2VcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMTAnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIG91dHBvc3RcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDUnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGRlcG90XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTAxJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBlbmNhbXBcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDAnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGZhcm1cclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMTYnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgIC8vIHdlbGxcclxuXSwgJ2lkJyk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBtYXBzTWV0YSA9IFtcclxuICAgIHtpZDogMzgsIG5hbWU6ICdFdGVybmFsIEJhdHRsZWdyb3VuZHMnLCBhYmJyOiAnRUInfSxcclxuICAgIHtpZDogMTA5OSwgbmFtZTogJ1JlZCBCb3JkZXJsYW5kcycsIGFiYnI6ICdSZWQnfSxcclxuICAgIHtpZDogMTEwMiwgbmFtZTogJ0dyZWVuIEJvcmRlcmxhbmRzJywgYWJicjogJ0dybid9LFxyXG4gICAge2lkOiAxMTQzLCBuYW1lOiAnQmx1ZSBCb3JkZXJsYW5kcycsIGFiYnI6ICdCbHUnfSxcclxuXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlc0dlbyA9IHtcclxuICAgIGViOiBbW1xyXG4gICAgICAgIHtpZDogJzknLCBkaXJlY3Rpb246ICcnfSwgICAgICAgICAgLy8gc3RvbmVtaXN0XHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgICAvLyBvdmVybG9va1xyXG4gICAgICAgIHtpZDogJzE3JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gbWVuZG9uc1xyXG4gICAgICAgIHtpZDogJzIwJywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgLy8gdmVsb2thXHJcbiAgICAgICAge2lkOiAnMTgnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAvLyBhbnpcclxuICAgICAgICB7aWQ6ICcxOScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgIC8vIG9ncmVcclxuICAgICAgICB7aWQ6ICc2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgIC8vIHNwZWxkYW5cclxuICAgICAgICB7aWQ6ICc1JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgIC8vIHBhbmdcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcyJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIHZhbGxleVxyXG4gICAgICAgIHtpZDogJzE1JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gbGFuZ29yXHJcbiAgICAgICAge2lkOiAnMjInLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBicmF2b3N0XHJcbiAgICAgICAge2lkOiAnMTYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBxdWVudGluXHJcbiAgICAgICAge2lkOiAnMjEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBkdXJpb3NcclxuICAgICAgICB7aWQ6ICc3JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGRhbmVcclxuICAgICAgICB7aWQ6ICc4JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgIC8vIHVtYmVyXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBsb3dsYW5kc1xyXG4gICAgICAgIHtpZDogJzExJywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gYWxkb25zXHJcbiAgICAgICAge2lkOiAnMTMnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBqZXJyaWZlclxyXG4gICAgICAgIHtpZDogJzEyJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gd2lsZGNyZWVrXHJcbiAgICAgICAge2lkOiAnMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBrbG92YW5cclxuICAgICAgICB7aWQ6ICcxMCcsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIHJvZ3Vlc1xyXG4gICAgICAgIHtpZDogJzQnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gZ29sYW50YVxyXG4gICAgXV0sXHJcbiAgICBibDI6IFtbXHJcbiAgICAgICAge2lkOiAnMTEzJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAvLyByYW1wYXJ0XHJcbiAgICAgICAge2lkOiAnMTA2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAvLyB1bmRlcmNyb2Z0XHJcbiAgICAgICAge2lkOiAnMTE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAvLyBwYWxhY2VcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxMDInLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGFjYWRlbXlcclxuICAgICAgICB7aWQ6ICcxMDQnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIG5lY3JvcG9saXNcclxuICAgICAgICB7aWQ6ICc5OScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGxhYlxyXG4gICAgICAgIHtpZDogJzExNScsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gaGlkZWF3YXlcclxuICAgICAgICB7aWQ6ICcxMDknLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIHJlZnVnZVxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzExMCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gb3V0cG9zdFxyXG4gICAgICAgIHtpZDogJzEwNScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZGVwb3RcclxuICAgICAgICB7aWQ6ICcxMDEnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIGVuY2FtcFxyXG4gICAgICAgIHtpZDogJzEwMCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZmFybVxyXG4gICAgICAgIHtpZDogJzExNicsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgLy8gd2VsbFxyXG4gICAgXV0sXHJcbn07XHJcbiIsImltcG9ydCB7IHdvcmxkcyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRXb3JsZEZyb21TbHVnKCknLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICBjb25zdCB3b3JsZCA9IF8uZmluZChcclxuICAgICAgICB3b3JsZHMsXHJcbiAgICAgICAgdyA9PiB3W2xhbmdTbHVnXS5zbHVnID09PSB3b3JsZFNsdWdcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpZDogd29ybGQuaWQsXHJcbiAgICAgICAgLi4ud29ybGRbbGFuZ1NsdWddLFxyXG4gICAgfTtcclxufSIsIlxyXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBBUElfUkVRVUVTVF9PUEVOLFxyXG4gICAgQVBJX1JFUVVFU1RfU1VDQ0VTUyxcclxuICAgIEFQSV9SRVFVRVNUX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBwZW5kaW5nOiBJbW11dGFibGUuTGlzdChbXSksXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IGFwaSA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6YXBpJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgQVBJX1JFUVVFU1RfT1BFTjpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OmFwaScsIGFjdGlvbi50eXBlLCBhY3Rpb24ucmVxdWVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAncGVuZGluZycsXHJcbiAgICAgICAgICAgICAgICB1ID0+IHUucHVzaChhY3Rpb24ucmVxdWVzdEtleSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBBUElfUkVRVUVTVF9TVUNDRVNTOlxyXG4gICAgICAgIGNhc2UgQVBJX1JFUVVFU1RfRkFJTEVEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6YXBpJywgYWN0aW9uLnR5cGUsIGFjdGlvbi5yZXF1ZXN0S2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICdwZW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHUgPT4gdS5maWx0ZXJOb3QoZiA9PiBmID09PSBhY3Rpb24ucmVxdWVzdEtleSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXBpOyIsImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcclxuXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSU5JVElBTElaRV9HVUlMRCxcclxuICAgIFJFQ0VJVkVfR1VJTEQsXHJcbiAgICBSRUNFSVZFX0dVSUxEX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKCk7XHJcblxyXG5cclxuY29uc3QgZ3VpbGRzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjpndWlsZHMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgSU5JVElBTElaRV9HVUlMRDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Omd1aWxkcycsIElOSVRJQUxJWkVfR1VJTEQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuc2V0KFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYWN0aW9uLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9HVUlMRDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Omd1aWxkcycsIFJFQ0VJVkVfR1VJTEQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuc2V0KFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBJbW11dGFibGUuTWFwKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYWN0aW9uLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYWN0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBhY3Rpb24udGFnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX0dVSUxEX0ZBSUxFRDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Omd1aWxkcycsIFJFQ0VJVkVfR1VJTERfRkFJTEVELCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldEluKFthY3Rpb24uZ3VpbGRJZCwgJ2Vycm9yJ10sIGFjdGlvbi5lcnJvcik7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGd1aWxkczsiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XHJcblxyXG5pbXBvcnQgYXBpIGZyb20gJy4vYXBpJztcclxuaW1wb3J0IGd1aWxkcyBmcm9tICcuL2d1aWxkcyc7XHJcbmltcG9ydCBsYW5nIGZyb20gJy4vbGFuZyc7XHJcbmltcG9ydCBtYXRjaGVzIGZyb20gJy4vbWF0Y2hlcyc7XHJcbmltcG9ydCBtYXRjaERldGFpbHMgZnJvbSAnLi9tYXRjaERldGFpbHMnO1xyXG5pbXBvcnQgbm93IGZyb20gJy4vbm93JztcclxuaW1wb3J0IG9iamVjdGl2ZXMgZnJvbSAnLi9vYmplY3RpdmVzJztcclxuaW1wb3J0IHJvdXRlIGZyb20gJy4vcm91dGUnO1xyXG5pbXBvcnQgdGltZW91dHMgZnJvbSAnLi90aW1lb3V0cyc7XHJcbmltcG9ydCB3b3JsZCBmcm9tICcuL3dvcmxkJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGFwaSxcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaGVzLFxyXG4gICAgbWF0Y2hEZXRhaWxzLFxyXG4gICAgbm93LFxyXG4gICAgb2JqZWN0aXZlcyxcclxuICAgIHJvdXRlLFxyXG4gICAgdGltZW91dHMsXHJcbiAgICB3b3JsZCxcclxufSk7IiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuaW1wb3J0IHsgU0VUX0xBTkcgfSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmltcG9ydCB7IGxhbmdzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5jb25zdCBkZWZhdWx0U2x1ZyA9ICdlbic7XHJcbmNvbnN0IGRlZmF1bHRMYW5nID0gSW1tdXRhYmxlLmZyb21KUyhsYW5nc1tkZWZhdWx0U2x1Z10pO1xyXG5cclxuXHJcbmNvbnN0IGxhbmcgPSAoc3RhdGUgPSBkZWZhdWx0TGFuZywgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfTEFORzpcclxuICAgICAgICAgICAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlMobGFuZ3NbYWN0aW9uLnNsdWddKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGFuZzsiLCJpbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIENMRUFSX01BVENIREVUQUlMUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTLFxyXG4gICAgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hERVRBSUxTX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJnYk51bSA9IEltbXV0YWJsZS5NYXAoeyByZWQ6IDAsIGJsdWU6IDAsIGdyZWVuOiAwIH0pO1xyXG5leHBvcnQgY29uc3QgaG9sZCA9IEltbXV0YWJsZS5NYXAoeyBjYXN0bGU6IDAsIGtlZXA6IDAsIHRvd2VyOiAwLCBjYW1wOiAwIH0pO1xyXG5leHBvcnQgY29uc3QgcmdiSG9sZCA9IEltbXV0YWJsZS5NYXAoeyByZWQ6IGhvbGQsIGJsdWU6IGhvbGQsIGdyZWVuOiBob2xkIH0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzdGF0c0RlZmF1bHQgPSBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgIGRlYXRoczogcmdiTnVtLFxyXG4gICAga2lsbHM6IHJnYk51bSxcclxuICAgIGhvbGRpbmdzOiByZ2JIb2xkLFxyXG4gICAgc2NvcmVzOiByZ2JOdW0sXHJcbiAgICB0aWNrczogcmdiTnVtLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBEZWZhdWx0ID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBpZDogbnVsbCxcclxuICAgIGxhc3Rtb2Q6IG51bGwsXHJcbiAgICBndWlsZHM6IEltbXV0YWJsZS5PcmRlcmVkU2V0KCksXHJcbiAgICBvYmplY3RpdmVzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgc3RhdHM6IHN0YXRzRGVmYXVsdCxcclxuICAgIHR5cGU6IG51bGwsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcHNEZWZhdWx0ID0gSW1tdXRhYmxlLkxpc3QoW1xyXG4gICAgbWFwRGVmYXVsdCxcclxuICAgIG1hcERlZmF1bHQsXHJcbiAgICBtYXBEZWZhdWx0LFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lc0RlZmF1bHQgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGxhc3Rtb2Q6IG51bGwsXHJcbiAgICBlbmRUaW1lOiBudWxsLFxyXG4gICAgc3RhcnRUaW1lOiBudWxsLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0U3RhdGUgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGlkOiBudWxsLFxyXG4gICAgZ3VpbGRzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgbWFwczogbWFwc0RlZmF1bHQsXHJcbiAgICBvYmplY3RpdmVzOiBJbW11dGFibGUuT3JkZXJlZFNldCgpLFxyXG4gICAgcmVnaW9uOiBudWxsLFxyXG4gICAgdGltZXM6IHRpbWVzRGVmYXVsdCxcclxuICAgIHN0YXRzOiBzdGF0c0RlZmF1bHQsXHJcbiAgICB3b3JsZHM6IHJnYk51bSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbWF0Y2hEZXRhaWxzID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSERFVEFJTFM6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgICAgICAgICAgICAgIC5zZXQoJ2lkJywgYWN0aW9uLmlkKVxyXG4gICAgICAgICAgICAgICAgLnNldCgnZ3VpbGRJZHMnLCBhY3Rpb24uZ3VpbGRJZHMpXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdtYXBzJywgYWN0aW9uLm1hcHMpXHJcbiAgICAgICAgICAgICAgICAuc2V0KCdvYmplY3RpdmVJZHMnLCBhY3Rpb24ub2JqZWN0aXZlSWRzKVxyXG4gICAgICAgICAgICAgICAgLnNldCgncmVnaW9uJywgYWN0aW9uLnJlZ2lvbilcclxuICAgICAgICAgICAgICAgIC5zZXQoJ3N0YXRzJywgYWN0aW9uLnN0YXRzKVxyXG4gICAgICAgICAgICAgICAgLnNldCgndGltZXMnLCBhY3Rpb24udGltZXMpXHJcbiAgICAgICAgICAgICAgICAuc2V0KCd3b3JsZHMnLCBhY3Rpb24ud29ybGRzKTtcclxuXHJcbiAgICAgICAgY2FzZSBDTEVBUl9NQVRDSERFVEFJTFM6XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0U3RhdGU7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSERFVEFJTFNfU1VDQ0VTUzpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om1hdGNoRGV0YWlscycsIGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuaGFzKCdlcnJvcicpXHJcbiAgICAgICAgICAgICAgICA/IHN0YXRlLmRlbGV0ZSgnZXJyb3InKVxyXG4gICAgICAgICAgICAgICAgOiBzdGF0ZTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIREVUQUlMU19GQUlMRUQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaERldGFpbHMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldCgnZXJyb3InLCBhY3Rpb24uZXJyLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYXRjaERldGFpbHM7IiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuXHJcbmltcG9ydCB7XHJcbiAgICBSRUNFSVZFX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfU1VDQ0VTUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBkYXRhOiBJbW11dGFibGUuTWFwKHt9KSxcclxuICAgIGlkczogSW1tdXRhYmxlLkxpc3QoW10pLFxyXG4gICAgbGFzdFVwZGF0ZWQ6IDAsXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG1hdGNoZXMgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om1hdGNoZXMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSEVTOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgICAgICAgICAgICAgIC5zZXQoJ2RhdGEnLCBhY3Rpb24uZGF0YSlcclxuICAgICAgICAgICAgICAgIC5zZXQoJ2xhc3RVcGRhdGVkJywgYWN0aW9uLmxhc3RVcGRhdGVkKTtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIRVNfU1VDQ0VTUzpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om1hdGNoZXMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmhhcygnZXJyb3InKVxyXG4gICAgICAgICAgICAgICAgPyBzdGF0ZS5kZWxldGUoJ2Vycm9yJylcclxuICAgICAgICAgICAgICAgIDogc3RhdGU7XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRDpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6Om1hdGNoZXMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldCgnZXJyb3InLCBhY3Rpb24uZXJyLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYXRjaGVzOyIsImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbmltcG9ydCB7IFNFVF9OT1cgfSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmNvbnN0IHJvdXRlID0gKHN0YXRlID0gbW9tZW50KCksIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX05PVzpcclxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC51bml4KG1vbWVudCgpLnVuaXgoKSk7IC8vIHJvdW5kcyB0byBzZWNvbmRcclxuICAgICAgICAgICAgLy8gcmV0dXJuIG1vbWVudCgpO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZTtcclxuIiwiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIE9CSkVDVElWRVNfUkVTRVQsXHJcbiAgICBPQkpFQ1RJVkVTX1VQREFURSxcclxuICAgIE9CSkVDVElWRV9VUERBVEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0gSW1tdXRhYmxlLk1hcCgpO1xyXG5cclxuXHJcbmNvbnN0IG9iamVjdGl2ZXMgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6Om9iamVjdGl2ZXMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgT0JKRUNUSVZFU19SRVNFVDpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6Om9iamVjdGl2ZXMnLCBhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcclxuXHJcbiAgICAgICAgY2FzZSBPQkpFQ1RJVkVfVVBEQVRFOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6b2JqZWN0aXZlcycsIGFjdGlvbi50eXBlLCBhY3Rpb24ub2JqZWN0aXZlLmdldCgnaWQnKSwgYWN0aW9uLm9iamVjdGl2ZS50b0pTKCkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnNldChcclxuICAgICAgICAgICAgICAgIGFjdGlvbi5vYmplY3RpdmUuZ2V0KCdpZCcpLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uLm9iamVjdGl2ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjYXNlIE9CSkVDVElWRVNfVVBEQVRFOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6b2JqZWN0aXZlcycsIGFjdGlvbi50eXBlLCBhY3Rpb24ub2JqZWN0aXZlcy50b0pTKCkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5vYmplY3RpdmVzO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBvYmplY3RpdmVzOyIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1JPVVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgcGF0aDogJy8nLFxyXG4gICAgcGFyYW1zOiB7fSxcclxufTtcclxuXHJcbmNvbnN0IHJvdXRlID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFNFVF9ST1VURTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5wYXRoLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBhY3Rpb24ucGFyYW1zLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZTtcclxuIiwiXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgQUREX1RJTUVPVVQsXHJcbiAgICBSRU1PVkVfVElNRU9VVCxcclxuICAgIC8vIFJFTU9WRV9BTExfVElNRU9VVFMsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuY29uc3QgdGltZW91dHMgPSAoc3RhdGUgPSB7fSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6dGltZW91dHMnLCBzdGF0ZSwgYWN0aW9uKTtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBBRERfVElNRU9VVDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgQUREX1RJTUVPVVQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiBhY3Rpb24ucmVmLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYXNlIFJFTU9WRV9USU1FT1VUOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6dGltZW91dHMnLCBSRU1PVkVfVElNRU9VVCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBfLm9taXQoc3RhdGUsIGFjdGlvbi5uYW1lKTtcclxuXHJcbiAgICAgICAgLy8gY2FzZSBSRU1PVkVfQUxMX1RJTUVPVVRTOlxyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncmVkdWNlcjo6dGltZW91dHMnLCBSRU1PVkVfQUxMX1RJTUVPVVRTLCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIHt9O1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB0aW1lb3V0czsiLCJcclxuaW1wb3J0IHtcclxuICAgIFNFVF9XT1JMRCxcclxuICAgIENMRUFSX1dPUkxELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5pbXBvcnQgeyBnZXRXb3JsZEZyb21TbHVnIH0gZnJvbSAnbGliL3dvcmxkcyc7XHJcblxyXG5cclxuY29uc3Qgd29ybGQgPSAoc3RhdGUgPSBudWxsLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFNFVF9XT1JMRDpcclxuICAgICAgICAgICAgcmV0dXJuIGdldFdvcmxkRnJvbVNsdWcoYWN0aW9uLmxhbmdTbHVnLCBhY3Rpb24ud29ybGRTbHVnKTtcclxuXHJcbiAgICAgICAgY2FzZSBDTEVBUl9XT1JMRDpcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB3b3JsZDsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImVuXCI6IHtcclxuXHRcdFwic29ydFwiOiAxLFxyXG5cdFx0XCJzbHVnXCI6IFwiZW5cIixcclxuXHRcdFwibGFiZWxcIjogXCJFTlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VuXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFbmdsaXNoXCJcclxuXHR9LFxyXG5cdFwiZGVcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDIsXHJcblx0XHRcInNsdWdcIjogXCJkZVwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkRFXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZGVcIixcclxuXHRcdFwibmFtZVwiOiBcIkRldXRzY2hcIlxyXG5cdH0sXHJcblx0XCJlc1wiOiB7XHJcblx0XHRcInNvcnRcIjogMyxcclxuXHRcdFwic2x1Z1wiOiBcImVzXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRVNcIixcclxuXHRcdFwibGlua1wiOiBcIi9lc1wiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXNwYcOxb2xcIlxyXG5cdH0sXHJcblx0XCJmclwiOiB7XHJcblx0XHRcInNvcnRcIjogNCxcclxuXHRcdFwic2x1Z1wiOiBcImZyXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRlJcIixcclxuXHRcdFwibGlua1wiOiBcIi9mclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRnJhbsOnYWlzXCJcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgXCIxMDk5LTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYW1tJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBIYW1tXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIYW1tcyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgSGFtbVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA4NjQsIDk1NTkuNDldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMZXNoJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBMZXNoXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJMZXNocyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgTGVzaFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3Mjc5Ljk1LCAxMjExOS41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiWmFraydzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgWmFra1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWmFra3MgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIFpha2tcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDQ0OCwgMTE0NzkuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmF1ZXIgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmF1ZXItR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgQmF1ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzkzLjcsIDExMjU4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhcnJldHQgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXJyZXR0XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCYXJyZXR0LUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEJhcnJldHRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIwOS43MSwgMTM4MTguNF1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2VlIEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgR2VlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHZWUtR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgR2VlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzNzcuNywgMTMxNzguNF1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTWNMYWluJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBNY0xhaW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk1jTGFpbnMgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkZSBNY0xhaW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3MTIuOCwgMTEyNjMuNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGF0cmljaydzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgUGF0cmlja1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUGF0cmlja3MgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkZSBQYXRyaWNrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYxMjguOCwgMTM4MjMuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFiaWIncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIEhhYmliXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIYWJpYnMgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkJ0hhYmliXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMyOTYuOCwgMTMxODMuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTydkZWwgQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgTydkZWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk8nZGVsLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgTydkZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODMyLjQsIDk1OTQuNjNdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlknbGFuIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIFknbGFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJZJ2xhbi1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIFknbGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MjQ4LjQsIDEyMTU0LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIktheSdsaSBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBLYXknbGlcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIktheSdsaS1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIEtheSdsaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzQxNi40LCAxMTUxNC42XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJFdGVybmFsIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIEV0ZXJuYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRXdpZ2UgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIMOpdGVybmVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTgwMi43LCA5NjY0Ljc1XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZWF0aGxlc3MgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgSW5tb3J0YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRvZGxvc2UgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIGltbW9ydGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyNSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMTguNzIsIDEyMjI0LjddXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlVuZHlpbmcgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgSW1wZXJlY2VkZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbnN0ZXJibGljaGUgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIGltcMOpcmlzc2FibGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzODYuNywgMTE1ODQuN11cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ3JhbmtzaGFmdCBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIFBhbGFuY2FtYW5pamFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLdXJiZWx3ZWxsZW4tRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgVmlsZWJyZXF1aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTI2NC4zLCAxMTYwOS40XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTcGFya3BsdWcgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBCdWrDrWFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaw7xuZGZ1bmtlbi1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBCb3VnaWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc2ODAuMzIsIDE0MTY5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZseXdoZWVsIERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgVm9sYW50ZXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHd1bmdyYWQtRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgRW5ncmVuYWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0ODQ4LjMsIDEzNTI5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsaXN0ZXJpbmcgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBBY2hpY2hhcnJhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcmVubmVuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSBlbWJyYXPDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4NTQuNTgsIDEwNTc4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNjb3JjaGluZyBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIEFicmFzYWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVyc2VuZ2VuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSBjdWlzYW50ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MjcwLjU4LCAxMzEzOC41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUb3JyaWQgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBTb2ZvY2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsw7xoZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIHRvcnJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5OCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzQzOC42LCAxMjQ5OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxMSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMjAyMi41LCAxMTc4OS45XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxMCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg0MzguNDksIDE0MzQ5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQ5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTYwNi41LCAxMzcwOS45XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NjQxLjcsIDExNzQ5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjA1Ny43LCAxNDMwOS42XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMyMjUuNywgMTM2NjkuNl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUm95J3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIFJveVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm95cyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFJveVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzIyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE5NTQuNiwgMTAwNjguNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTm9yZm9saydzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBOb3Jmb2xrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJOb3Jmb2xrcyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIE5vcmZvbGtcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODM3MC42LCAxMjYyOC41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPbGl2aWVyJ3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIE9saXZpZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9saXZpZXJzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZCdPbGl2aWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTU1MzguNiwgMTE5ODguNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGFyY2hlZCBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gQWJyYXNhZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlcmTDtnJydGVyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgZMOpdmFzdMOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyNzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyNTUsIDExNTc2XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXaXRoZXJlZCBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gRGVzb2xhZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlbGtlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIHJhdmFnw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY2NzEuMDUsIDE0MTM2XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXJyZW4gT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIEFiYW5kb25hZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOWZGVyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgZMOpbGFicsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzODM5LCAxMzQ5Nl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvaWMgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBFc3RvaWNhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdG9pc2NoZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IHN0b8OvcXVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDgxMi4zLCAxMDEwMi45XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbXBhc3NpdmUgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBJbXBlcnR1cmJhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbmJlZWluZHJ1Y2t0ZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IGltcGFzc2libGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxOCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzIyOC4zMiwgMTI2NjIuOV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFyZGVuZWQgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBFbmR1cmVjaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGFobGhhcnRlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgZHVyY2lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDM5Ni4zLCAxMjAyMi45XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPc3ByZXkncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIMOBZ3VpbGEgUGVzY2Fkb3JhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGaXNjaGFkbGVyLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGR1IGJhbGJ1emFyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3ODgsIDEwNjYwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhcnJpZXIncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIEFndWlsdWNob1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2VpaGVuLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGR1IGNpcmNhw6h0ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjA0LCAxMzIyMC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaHJpa2UncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIEFsY2F1ZMOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV8O8cmdlci1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkZSBsYSBwaWUtZ3Jpw6hjaGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM3MiwgMTI1ODAuMl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9ldHRpZ2VyJ3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgQm9ldHRpZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCb2V0dGlnZXJzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBCb2V0dGlnZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk1ODUuOSwgMTAwMzcuMV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSHVnaGUncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBIdWdoZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSHVnaGVzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBIdWdoZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MDAxLjksIDEyNTk3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJlcmRyb3cncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBCZXJkcm93XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCZXJkcm93cyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgQmVyZHJvd1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMTY5LjksIDExOTU3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkR1c3R3aGlzcGVyIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gZGVsIE11cm11bGxvIGRlIFBvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlcyBTdGF1YmZsw7xzdGVybnNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IFNvdWZmbGUtcG91c3Npw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA3NzMuMywgMTE2NTIuNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU21hc2hlZGhvcGUgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBUcmFnYWVzcGVyYW56YVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXIgWmVyc2NobGFnZW5lbiBIb2ZmbnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgUsOqdmUtYnJpc8OpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcxODkuMjksIDE0MjEyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxhc3RnYXNwIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gZGVsIMOabHRpbW8gU3VzcGlyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXMgTGV0enRlbiBTY2huYXVmZXJzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBEZXJuaWVyLXNvdXBpclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0MzU3LjMsIDEzNTcyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0MyxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDU5MC4yLCA5MTY5LjE5XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MDA2LjE5LCAxMTcyOS4yXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyNzksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0MTc0LjIsIDExMDg5LjJdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZhaXRobGVhcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYXV0IGRlIGxhIEZvaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDEwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTExXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWxkb24ncyBMZWRnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29ybmlzYSBkZSBBbGRvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQWxkb25zIFZvcnNwcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29ybmljaGUgZCdBbGRvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTQxNy4zOSwgMTQ3OTAuN11cclxuICAgIH0sXHJcbiAgICBcIjk1LTQzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGVybydzIExvZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgSMOpcm9lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIZWxkZW5oYWxsZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGF2aWxsb24gZHUgSMOpcm9zXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMzFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0zMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc2NlbnNpb24gQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgZGUgbGEgQXNjZW5zacOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXVmc3RpZWdzYnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTczLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtMjlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgU3Bpcml0aG9sbWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIElzbGV0YSBFc3Bpcml0dWFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEZXIgR2Vpc3Rob2xtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMZSBIZWF1bWUgc3Bpcml0dWVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJsb29rXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNaXJhZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBdXNzaWNodHNwdW5rdCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQmVsdsOpZMOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA2OTguNCwgMTM3NjFdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxhbmdvciBHdWxjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJMYW5nb3ItU2NobHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE0NjUuMywgMTU1NjkuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0zXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIGJhamFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUaWVmbGFuZCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQmFzc2VzIHRlcnJlc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODQwLjI1LCAxNDk4My42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJNZW5kb24ncyBHYXBcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphbmphIGRlIE1lbmRvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTWVuZG9ucyBTcGFsdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAxOTIuNywgMTM0MTAuOF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW5icmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemF2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG5zdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJWZXJ0LWJydXnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC03XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhbmVsb24gUGFzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFzYWplIERhbmVsb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRhbmVsb24tUGFzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFzc2FnZSBEYW5lbG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTk2LjQsIDE1NTQ1LjhdXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTEwM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTEwM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMzBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0zMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXb29kaGF2ZW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gRm9yZXN0YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldhbGQtRnJlaXN0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb2lzcmVmdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4OCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS00MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNoYWRhcmFuIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTaGFkYXJhbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIFNoYWRhcmFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTMyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkV0aGVyb24gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgRXRoZXJvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRXRoZXJvbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIGQnRXRoZXJvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk1LTU2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIFRpdGFucGF3XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBHYXJyYSBkZWwgVGl0w6FuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEaWUgVGl0YW5lbnByYW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJhcyBkdSBUaXRhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC05XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZW1pc3QgQ2FzdGxlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYXN0aWxsbyBQaWVkcmFuaWVibGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaGxvc3MgU3RlaW5uZWJlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODMzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhc3RsZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDYyNy4zLCAxNDUwMS4zXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDcmFndG9wXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDdW1icmVwZcOxYXNjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2Nocm9mZmdpcGZlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU29tbWV0IGRlIEhhdXRjcmFnXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC01XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTW9udMOpZSBkZSBQYW5nbG9zc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTIwMS42LCAxMzcxOC40XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBPbsOtcmljYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHJhdW1idWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkZXMgcsOqdmVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTUtNDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWRsYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvcnJvam9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIHJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTIxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHVyaW9zIEd1bGNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4OCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTIwNy4xLCAxNDU5NV1cclxuICAgIH0sXHJcbiAgICBcIjk1LTU0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRm9naGF2ZW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJOZWJlbC1GcmVpc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkhhdnJlIGdyaXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTU1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkd2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3R3YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZGUgUnViaWNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDAzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTI2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW5sYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xuc2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgdmVydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMjBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWZWxva2EgU2xvcGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBlbmRpZW50ZSBWZWxva2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlbG9rYS1IYW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGbGFuYyBkZSBWZWxva2FcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMDE3LjQsIDEzNDE0LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRyZWFkZmFsbCBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBTYWx0byBBY2lhZ29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJlY2tlbnNmYWxsLUJ1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVlYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1c3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJ1eWF6dXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwOSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIEtsb3ZhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS2xvdmFuLVNlbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXRpdCByYXZpbiBkZSBLbG92YW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjE5LjUsIDE1MTA3LjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkplcnJpZmVyJ3MgU2xvdWdoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDZW5hZ2FsIGRlIEplcnJpZmVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJKZXJyaWZlcnMgU3VtcGZsb2NoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb3VyYmllciBkZSBKZXJyaWZlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTc1Ny4wNiwgMTU0NjcuOF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTY1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTM4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTG9uZ3ZpZXdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWl0c2ljaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxvbmd1ZXZ1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC02XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDbGFybyBFc3BlbGRpYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3BlbGRhbi1LYWhsc2NobGFnXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTczOS44MSwgMTM1ODYuOV1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIEdvZHN3b3JkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGFzIEdvdHRlc3NjaHdlcnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNjRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMzdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZhbGxleVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVmFsbGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRhbCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gVmFsbMOpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTI2OC45LCAxNTA4Ny43XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdW5ueWhpbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTb25uZW5ow7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmUgZW5zb2xlaWxsw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTY3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtNTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxldmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xudGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTEyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV2lsZGNyZWVrIFJ1blwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGlzdGEgQXJyb3lvc2FsdmFqZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2lsZGJhY2gtU3RyZWNrZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGlzdGUgZHUgcnVpc3NlYXUgc2F1dmFnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTk1OC4yMywgMTQ2MDUuN11cclxuICAgIH0sXHJcbiAgICBcIjk2LTI1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphcnJvamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJydXllcm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTExMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTExMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMTEyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTEyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni03MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTcxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmFoJ3MgSG9wZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNwZXJhbnphIGRlIEFyYWhcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFyYWhzIEhvZmZudW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJRdWVudGluIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUXVlbnRpbi1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBRdWVudGluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk1MS44LCAxNTEyMS4yXVxyXG4gICAgfSxcclxuICAgIFwiMzgtMjJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCcmF2b3N0IEVzY2FycG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY2FycGFkdXJhIEJyYXZvc3RcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJyYXZvc3QtQWJoYW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGYWxhaXNlIGRlIEJyYXZvc3RcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzUwLjIsIDE0ODU5LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWV2YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXV0YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBCbGV1dmFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGVyY8OpZSBkZSBHYXJkb2dyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5NjUsIDEzOTUxXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS03M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTczXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTUxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXN0cmFsaG9sbWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIklzbGV0YSBBc3RyYWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFzdHJhbGhvbG1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkhlYXVtZSBhc3RyYWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC02NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC00XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHb2xhbnRhIENsZWFyaW5nXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDbGFpcmnDqHJlIGRlIEdvbGFudGFcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAxOTguOSwgMTU1MjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBWZW5jZWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2llZ2VyLUhhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBWYWlucXVldXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhd24ncyBFeXJpZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1aWxlcmEgZGVsIEFsYmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhvcnN0IGRlciBNb3JnZW5kw6RtbWVydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZXBhaXJlIGRlIGwnYXViZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni01OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWR2YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXJyb2pvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3R0YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWxyb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWVsYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvYXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGJsZXVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTY1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVld2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXdhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQm9zcXVlcyBDbGFyb3NvbWJyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW1iZXJsaWNodHVuZy1Gb3JzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE2ODAuOSwgMTQzNTMuNl1cclxuICAgIH0sXHJcbiAgICBcIjk0LTYzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTcwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNzBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdGFyZ3JvdmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZXJuaGFpblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9zcXVldCDDqXRvaWzDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC00MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTQwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNsaWZmc2lkZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVzcGXDsWFkZXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZWxzd2FuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmxhbmMgZGUgZmFsYWlzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTYxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVud2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgYmFqYXMgZGUgQWd1YXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bndhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTIzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFza2FsaW9uLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgZCdBc2thbGlvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS03NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbnRlcmEgZGVsIFDDrWNhcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHVya2VuYnJ1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhcnJpw6hyZSBkdSB2b2xldXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODUxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTYxMi41NCwgMTQ0NjIuOF1cclxuICAgIH0sXHJcbiAgICBcIjk2LTI0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lc25lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXRyaW1vbmlvIGRlbCBDYW1wZcOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQ2hhbXBpb25zIExhbmRzaXR6XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGaWVmIGR1IENoYW1waW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTE4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFzbyBBbnphbGlhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQW56YWxpYXMtUGFzc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjQzLjMsIDEzOTc0LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS03MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTcyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTU4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR29kc2xvcmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhYmlkdXLDrWEgZGUgbG9zIERpb3Nlc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR290dGVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2F2b2lyIGRpdmluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2OC05OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXdXJtIFR1bm5lbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVMO6bmVsIGRlIGxhIFNpZXJwZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV3VybXR1bm5lbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVHVubmVsIGRlIGd1aXZyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjc1MC45MiwgMTAyMTEuMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzA4NzQ5MUNERDU2RjdGQjk5OEMzMzIzNjBEMzJGRDI2QThCMkE5OUQvNzMwNDI4LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWlycG9ydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWVyb3B1ZXJ0b1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmx1Z2hhZmVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBw6lyb3BvcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1MyxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcwNTQuMTYsIDEwNDIxXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQUNDQ0IxQkQ2MTc1OThDMEVBOUM3NTZFQURFNTNERjM2QzI1NzhFQy83MzA0MjcucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaHVuZGVyIEhvbGxvdyBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEhvbmRvbmFkYSBkZWwgVHJ1ZW5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEb25uZXJzZW5rZW5yZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgVG9ubmVjcmV2YXNzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyODIuNzcsIDEwNDI1LjldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZvcmdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGb3JqYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NobWllZGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcmdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjIzLjY0LCAxMDY5Mi4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDFBQjU0MUZDM0JFMTJBQzVCQkIwMjAyMTJCRUJFM0Y1QzBDNDMxNS83MzA0MTUucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVyZ3Jvd24gRmFuZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEZhbm8gR2lnYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5xiZXJ3dWNoZXJ0ZXIgR290dGVzaGF1cy1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgVGVtcGxlIHN1cmRpbWVuc2lvbm7DqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1MTMuODMsIDkwNTkuOTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNocmluZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FudHVhcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyZWluXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYW5jdHVhaXJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4NjE0Ljg5LCAxMDI0Ni40XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQjU3MDk5NDFCMDM1MkZENENBM0I3QUZEQTQyODczRDhFRkRCMTVBRC83MzA0MTQucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdXRlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI0MC42NiwgOTI1My45XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvREMwMUVDNDFEODgwOUI1OUI4NUJFRURDNDVFOTU1NkQ3MzBCRDIxQS83MzA0MTMucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXb3Jrc2hvcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGFsbGVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZXJrc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF0ZWxpZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1MixcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY4MzcuNiwgMTA4NDUuMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0IzNEMyRTNEMEYzNEZEMDNGNDRCQjVFRDRFMThEQ0REMDA1OUE1QzQvNzMwNDI5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJpZCBGb3J0cmVzcyBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEZvcnRhbGV6YSDDgXJpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDvHJyZWZlc3R1bmdyZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgbGEgRm9ydGVyZXNzZSBhcmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY4MjMuODMsIDEwNDc5LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lZ2F6ZSBTcGlyZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEFndWphIGRlIE1pcmFwaWVkcmFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVpbmJsaWNrLVphY2tlbnN0YWJyZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgUGljIGRlIFBpZXJyZWdhcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NyxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjQ5LjIxLCA5NzYzLjg3XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCZWxsIFRvd2VyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW5hcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbG9ja2VudHVybVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2xvY2hlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTczLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODE4MC42OCwgMTAzMjUuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q0MTgwNzc0REQwM0E0QkM3MjUyQjk1MjY4MEU0NTFGMTY2NzlBNzIvNzMwNDEwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2JzZXJ2YXRvcnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk9ic2VydmF0b3Jpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2JzZXJ2YXRvcml1bVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiT2JzZXJ2YXRvaXJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3OTUzLjY3LCA5MDYyLjc5XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvMDE1Q0YxNkM3OERGREFENzQyRTFBNTYxM0ZCNzRCNjQ2M0JGNEE3MC83MzA0MTEucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVyZ3Jvd24gRmFuZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRmFubyBHaWdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDnGJlcnd1Y2hlcnRlcyBHb3R0ZXNoYXVzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUZW1wbGUgc3VyZGltZW5zaW9ubsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NjA2LjcsIDg4ODIuMTRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyaWQgRm9ydHJlc3NcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZvcnRhbGV6YSDDgXJpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDvHJyZWZlc3R1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcnRlcmVzc2UgYXJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY0NDIuMTcsIDEwODgxLjhdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlR5dG9uZSBQZXJjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGVyY2hhIGRlIFR5dG9uZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHl0b25lbndhcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXJjaG9pciBkZSBUeXRvbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3ODg0LjgxLCA5ODA5LjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRodW5kZXIgSG9sbG93XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIb25kb25hZGEgZGVsIFRydWVub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRG9ubmVyc2Vua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlRvbm5lY3JldmFzc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg1MDYuNzUsIDEwODI0LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlR5dG9uZSBQZXJjaCBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIFBlcmNoYSBkZSBUeXRvbmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlR5dG9uZW53YXJ0ZS1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgUGVyY2hvaXIgZGUgVHl0b25lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzg1Mi44OSwgOTg1NS41Nl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW5mZXJubydzIE5lZWRsZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1amEgZGVsIEluZmllcm5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJJbmZlcm5vbmFkZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFpZ3VpbGxlIGluZmVybmFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1MDQuODQsIDEwNTk4LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lZ2F6ZSBTcGlyZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1amEgZGUgTWlyYXBpZWRyYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZWluYmxpY2stWmFja2Vuc3RhYlwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGljIGRlIFBpZXJyZWdhcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MTY0LjQ2LCA5ODA1LjE1XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbmZlcm5vJ3MgTmVlZGxlIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgQWd1amEgZGVsIEluZmllcm5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJJbmZlcm5vbmFkZWwtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIGwnQWlndWlsbGUgaW5mZXJuYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzU4MS45MSwgMTAzMTYuNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RhdHVhcnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzdGF0dWFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0YXR1ZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU3RhdHVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTUzLjEyLCA5MzYwLjE2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvNEMwMTEzQjZERjJFNEUyQ0JCOTMyNDRBRDUwREE0OTQ1NkQ1MDE0RS83MzA0MTIucG5nXCJcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbWJvc3NmZWxzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFtYm9zc2ZlbHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbnZpbCBSb2NrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFudmlsLXJvY2tcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBZdW5xdWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwteXVucXVlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGVyIGRlIGwnZW5jbHVtZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZXItZGUtbGVuY2x1bWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkpha2JpZWd1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFrYmllZ3VuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIllhaydzIEJlbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwieWFrcy1iZW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVjbGl2ZSBkZWwgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlY2xpdmUtZGVsLXlha1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvdXJiZSBkdSBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY291cmJlLWR1LXlha1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlbnJhdmlzIEVyZHdlcmtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVucmF2aXMtZXJkd2Vya1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlbmdlIG9mIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVuZ2Utb2YtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDrXJjdWxvIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2lyY3Vsby1kZS1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvbWxlY2ggZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9tbGVjaC1kZS1kZW5yYXZpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSG9jaG9mZW4gZGVyIEJldHLDvGJuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaG9jaG9mZW4tZGVyLWJldHJ1Ym5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNvcnJvdydzIEZ1cm5hY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic29ycm93cy1mdXJuYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhZ3VhIGRlbCBQZXNhclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmcmFndWEtZGVsLXBlc2FyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm91cm5haXNlIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm91cm5haXNlLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUb3IgZGVzIElycnNpbm5zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRvci1kZXMtaXJyc2lubnNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYXRlIG9mIE1hZG5lc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2F0ZS1vZi1tYWRuZXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhIGRlIGxhIExvY3VyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGEtZGUtbGEtbG9jdXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGUgZGUgbGEgZm9saWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGUtZGUtbGEtZm9saWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgRXNwZW53YWxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtZXNwZW53YWxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFRyZW1ibGVmb3LDqnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC10cmVtYmxlZm9yZXRcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeS1CdWNodFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1idWNodFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5IEJheVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1iYXlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtZWhtcnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGQnRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZWhtcnlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaW5zdGVyZnJlaXN0YXR0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpbnN0ZXJmcmVpc3RhdHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEYXJraGF2ZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGFya2hhdmVuXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBPc2N1cm9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1vc2N1cm9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2Ugbm9pclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2Utbm9pclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlaWxpZ2UgSGFsbGUgdm9uIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVpbGlnZS1oYWxsZS12b24tcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dW0gb2YgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVtLW9mLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYWdyYXJpbyBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhZ3JhcmlvLWRlLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVhaXJlIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1YWlyZS1kZS1yYWxsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFudGhpci1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYW50aGlyLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsZSBvZiBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGUtb2YtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWRlLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtamFudGhpclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lZXIgZGVzIExlaWRzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lZXItZGVzLWxlaWRzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhIG9mIFNvcnJvd3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhLW9mLXNvcnJvd3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbCBNYXIgZGUgbG9zIFBlc2FyZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWwtbWFyLWRlLWxvcy1wZXNhcmVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTsO2cmRsaWNoZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9yZGxpY2hlLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vcnRoZXJuIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcnRoZXJuLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGljb3Nlc2NhbG9mcmlhbnRlcyBkZWwgTm9ydGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGljb3Nlc2NhbG9mcmlhbnRlcy1kZWwtbm9ydGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDaW1lZnJvaWRlcyBub3JkaXF1ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2ltZWZyb2lkZXMtbm9yZGlxdWVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyenRvclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6dG9yXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2tnYXRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrZ2F0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YW5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGVub2lyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZW5vaXJlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhY2hlbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWNoZW5icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWdvbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWdvbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyY2EgZGVsIERyYWfDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyY2EtZGVsLWRyYWdvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0aWdtYXRlIGR1IGRyYWdvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdGlnbWF0ZS1kdS1kcmFnb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbi1UZXJyYXNzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFzc2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24gVGVycmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJhemEgZGUgRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRlcnJhemEtZGUtZXJlZG9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhdGVhdSBkJ0VyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF0ZWF1LWRlcmVkb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLbGFnZW5yaXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtsYWdlbnJpc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIG9mIFdvZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLW9mLXdvZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3VyYSBkZSBsYSBBZmxpY2Npw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3VyYS1kZS1sYS1hZmxpY2Npb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIGR1IG1hbGhldXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1kdS1tYWxoZXVyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6Zmx1dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6Zmx1dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrdGlkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja3RpZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJlYSBOZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJlYS1uZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vaXJmbG90XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vaXJmbG90XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW50ZXJ3ZWx0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVudGVyd2VsdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVuZGVyd29ybGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW5kZXJ3b3JsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkluZnJhbXVuZG9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaW5mcmFtdW5kb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk91dHJlLW1vbmRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm91dHJlLW1vbmRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVybmUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcm5lLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZhciBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmYXItc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMZWphbmFzIFBpY29zZXNjYWxvZnJpYW50ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGVqYW5hcy1waWNvc2VzY2Fsb2ZyaWFudGVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTG9pbnRhaW5lcyBDaW1lZnJvaWRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsb2ludGFpbmVzLWNpbWVmcm9pZGVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lbiB2b24gU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lbi12b24tc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbnMgb2YgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5zLW9mLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5hcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmFzLWRlLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVzLWRlLXN1cm1pYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlZW1hbm5zcmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWVtYW5uc3Jhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWFmYXJlcidzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhZmFyZXJzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIGRlbCBWaWFqYW50ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLWRlbC12aWFqYW50ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGR1IE1hcmluXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWR1LW1hcmluXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbi1QbGF0elwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1wbGF0elwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuIFNxdWFyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1zcXVhcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS1waWtlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLXBpa2VuXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGljaHR1bmcgZGVyIE1vcmdlbnLDtnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxpY2h0dW5nLWRlci1tb3JnZW5yb3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVyb3JhIEdsYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1cm9yYS1nbGFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYXJvIGRlIGxhIEF1cm9yYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFyby1kZS1sYS1hdXJvcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFpcmnDqHJlIGRlIGwnYXVyb3JlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYWlyaWVyZS1kZS1sYXVyb3JlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlbWVlciBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGVtZWVyLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBTZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXNlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyLWRlLWphZGUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZS1qYWRlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haC1QbGF0eiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtcGxhdHotZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoIFNxdWFyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtc3F1YXJlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtZGUtdml6dW5haC1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhdWJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGF1YmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBcmJvcnN0b25lIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXJib3JzdG9uZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZWRyYSBBcmLDs3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZWRyYS1hcmJvcmVhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllcnJlIEFyYm9yZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVycmUtYXJib3JlYS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmx1c3N1ZmVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmx1c3N1ZmVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUml2ZXJzaWRlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicml2ZXJzaWRlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmliZXJhIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmliZXJhLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHJvdmluY2VzIGZsdXZpYWxlcyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInByb3ZpbmNlcy1mbHV2aWFsZXMtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYWZlbHMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYWZlbHMtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYSBSZWFjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hLXJlYWNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2HDscOzbiBkZSBFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbm9uLWRlLWVsb25hLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmllZiBkJ0Vsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmllZi1kZWxvbmEtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXItU2VlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1zZWUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyIExha2UgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLWxha2UtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWdvIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWdvLWRyYWtrYXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWMgRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhYy1kcmFra2FyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyc3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnN1bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXIncyBTb3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnMtc291bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFc3RyZWNobyBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlc3RyZWNoby1kZS1taWxsZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6l0cm9pdCBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXRyb2l0LWRlLW1pbGxlci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2gtQnVjaHQgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYnVjaHQtc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2ggQmF5IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJheS1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBCYXJ1Y2ggW0VTXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1iYXJ1Y2gtZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGRlIEJhcnVjaCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGUtYmFydWNoLXNwXCJcclxuXHRcdH1cclxuXHR9LFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5iYXRjaEFjdGlvbnMgPSBiYXRjaEFjdGlvbnM7XG5leHBvcnRzLmVuYWJsZUJhdGNoaW5nID0gZW5hYmxlQmF0Y2hpbmc7XG52YXIgQkFUQ0ggPSAnQkFUQ0hJTkdfUkVEVUNFUi5CQVRDSCc7XG5cbmV4cG9ydHMuQkFUQ0ggPSBCQVRDSDtcblxuZnVuY3Rpb24gYmF0Y2hBY3Rpb25zKGFjdGlvbnMpIHtcblx0cmV0dXJuIHsgdHlwZTogQkFUQ0gsIHBheWxvYWQ6IGFjdGlvbnMgfTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlQmF0Y2hpbmcocmVkdWNlKSB7XG5cdHJldHVybiBmdW5jdGlvbiBiYXRjaGluZ1JlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuXHRcdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblx0XHRcdGNhc2UgQkFUQ0g6XG5cdFx0XHRcdHJldHVybiBhY3Rpb24ucGF5bG9hZC5yZWR1Y2UoYmF0Y2hpbmdSZWR1Y2VyLCBzdGF0ZSk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gcmVkdWNlKHN0YXRlLCBhY3Rpb24pO1xuXHRcdH1cblx0fTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHRodW5rTWlkZGxld2FyZShfcmVmKSB7XG4gIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2g7XG4gIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nID8gYWN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkgOiBuZXh0KGFjdGlvbik7XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHVua01pZGRsZXdhcmU7Il19
