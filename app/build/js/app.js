(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchMatches = exports.requestFailed = exports.requestSuccess = exports.requestOpen = undefined;

var _reduxBatchedActions = require('redux-batched-actions');

var _api = require('lib/api');

var _api2 = _interopRequireDefault(_api);

var _actionTypes = require('constants/actionTypes');

var _matches = require('./matches');

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
                dispatch((0, _reduxBatchedActions.batchActions)([requestSuccess({ requestKey: requestKey }), (0, _matches.receiveMatches)({
                    data: data,
                    lastUpdated: (0, _matches.getMatchesLastmod)(data)
                })]));
            },
            error: function error(err) {
                // console.log('action::fetchMatches::error', err);
                dispatch((0, _reduxBatchedActions.batchActions)([requestFailed({ requestKey: requestKey }), receiveMatchesFailed({ err: err })]));
            }
        });
    };
};

},{"./matches":3,"constants/actionTypes":34,"lib/api":35,"redux-batched-actions":50}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setLang = exports.setLang = function setLang(slug) {
    // console.log('action::setLang', slug);

    return {
        type: 'SET_LANG',
        slug: slug
    };
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveMatchesFailed = exports.receiveMatches = undefined;
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

},{"constants/actionTypes":34,"lodash":"lodash"}],4:[function(require,module,exports){
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

},{"constants/actionTypes":34}],5:[function(require,module,exports){
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

},{"constants/actionTypes":34}],6:[function(require,module,exports){
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

},{"constants/actionTypes":34}],7:[function(require,module,exports){
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

    attachMiddleware();
    attachRoutes();

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

function attachMiddleware() {
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
            ctx.store.dispatch((0, _world.setWorld)(langSlug, worldSlug));
        } else {
            ctx.store.dispatch((0, _world.clearWorld)());
        }

        next();
    });
}

function attachRoutes() {
    (0, _page2.default)('/', '/en');

    (0, _page2.default)('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', function (ctx) {
        // const { langSlug, worldSlug } = ctx.params;

        // ctx.store.dispatch(setLang(langSlug));
        // ctx.store.dispatch(setWorld(langSlug, worldSlug));

        var _ctx$store$getState = ctx.store.getState();

        var lang = _ctx$store$getState.lang;
        var world = _ctx$store$getState.world;

        render(_react2.default.createElement(_Tracker2.default, { lang: lang, world: world }));
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)', function (ctx) {
        // const { langSlug } = ctx.params;

        // ctx.store.dispatch(setLang(langSlug));
        // ctx.store.dispatch(clearWorld());

        render(_react2.default.createElement(_Overview2.default, null));
    });
}

},{"actions/lang":2,"actions/route":4,"actions/world":6,"components/Layout/Container":8,"components/Overview":17,"components/Tracker":28,"domready":"domready","page":"page","react":"react","react-dom":"react-dom","react-redux":"react-redux","reducers":41,"redux":"redux","redux-batched-actions":50,"redux-thunk":51}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

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
            var shouldUpdate = !isEqualByPick(this.props, nextProps, ['lang', 'world', 'children']);
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
    lang: _react2.default.PropTypes.object.isRequired,
    world: _react2.default.PropTypes.object
};

Container = (0, _reactRedux.connect)(mapStateToProps)(Container);

exports.default = Container;

},{"components/Layout/Footer":9,"components/Layout/Langs":11,"components/Layout/NavbarHeader":12,"lodash":"lodash","react":"react","react-redux":"react-redux"}],9:[function(require,module,exports){
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

},{"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state, props) {
    // console.log('lang', state.lang);
    return {
        activeLang: state.lang,
        // activeWorld: state.world,
        world: state.world ? _static.worlds[state.world.id][props.lang.slug] : null
    };
};

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
                active: activeLang.label === lang.label
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
    activeLang: _react2.default.PropTypes.object.isRequired,
    activeWorld: _react2.default.PropTypes.object,
    lang: _react2.default.PropTypes.object.isRequired
};
Lang = (0, _reactRedux.connect)(mapStateToProps)(
// mapDispatchToProps
Lang);

function getLink(lang, world) {
    return world ? world.link : lang.link;
}

exports.default = Lang;

},{"classnames":"classnames","lib/static":38,"react":"react","react-redux":"react-redux"}],11:[function(require,module,exports){
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

},{"./LangLink":10,"lib/static":38,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    return {
        lang: state.lang,
        hasPendingRequests: state.api.pending.length > 0
    };
};

var NavbarHeader = function NavbarHeader(_ref) {
    var lang = _ref.lang;
    var hasPendingRequests = _ref.hasPendingRequests;
    return _react2.default.createElement(
        'div',
        { className: 'navbar-header' },
        _react2.default.createElement(
            'a',
            { className: 'navbar-brand', href: '/' + lang.slug },
            _react2.default.createElement('img', { src: '/img/logo/logo-96x36.png' })
        ),
        _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)({
                    'navbar-spinner': true,
                    'active': hasPendingRequests
                }) },
            _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
        )
    );
};

NavbarHeader.propTypes = {
    lang: _react2.default.PropTypes.object.isRequired,
    hasPendingRequests: _react2.default.PropTypes.bool.isRequired
};

NavbarHeader = (0, _reactRedux.connect)(mapStateToProps)(NavbarHeader);

exports.default = NavbarHeader;

},{"classnames":"classnames","react":"react","react-redux":"react-redux"}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _MatchWorld = require('./MatchWorld');

var _MatchWorld2 = _interopRequireDefault(_MatchWorld);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import moment from 'moment';

var WORLD_COLORS = ['red', 'blue', 'green'];

var mapStateToProps = function mapStateToProps(state, props) {
    return {
        lang: state.lang,
        match: state.matches.data[props.matchId]
    };
};

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
            return this.props.match.lastmod !== nextProps.match.lastmod;
        }
    }, {
        key: 'isNewLang',
        value: function isNewLang(nextProps) {
            return this.props.lang.slug !== nextProps.lang.slug;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var lang = _props.lang;
            var match = _props.match;

            return _react2.default.createElement(
                'div',
                { className: 'matchContainer' },
                _react2.default.createElement(
                    'table',
                    { className: 'match' },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _.map(WORLD_COLORS, function (color) {
                            var worldId = match.worlds[color];
                            var world = _static.worlds[worldId][lang.slug];

                            return _react2.default.createElement(_MatchWorld2.default, {
                                component: 'tr',
                                key: worldId,

                                color: color,
                                match: match,
                                showPie: color === 'red',
                                world: world
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
    lang: _react2.default.PropTypes.object.isRequired,
    match: _react2.default.PropTypes.object.isRequired
};

Match = (0, _reactRedux.connect)(mapStateToProps)(Match);

exports.default = Match;

},{"./MatchWorld":14,"lib/static":38,"react":"react","react-redux":"react-redux"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _Pie = require('components/common/Icons/Pie');

var _Pie2 = _interopRequireDefault(_Pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MatchWorld = function MatchWorld(_ref) {
    var color = _ref.color;
    var match = _ref.match;
    var showPie = _ref.showPie;
    var world = _ref.world;
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
            match.scores ? (0, _numeral2.default)(match.scores[color]).format('0,0') : null
        ),
        showPie && match.scores ? _react2.default.createElement(
            'td',
            { className: 'pie', rowSpan: '3' },
            _react2.default.createElement(_Pie2.default, { scores: match.scores, size: 60 })
        ) : null
    );
};
MatchWorld.propTypes = {
    color: _react2.default.PropTypes.string.isRequired,
    match: _react2.default.PropTypes.object.isRequired,
    showPie: _react2.default.PropTypes.bool.isRequired,
    world: _react2.default.PropTypes.object.isRequired
};

exports.default = MatchWorld;

},{"components/common/Icons/Pie":29,"numeral":"numeral","react":"react"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Match = require('./Match');

var _Match2 = _interopRequireDefault(_Match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadingHtml = _react2.default.createElement(
    'span',
    { style: { paddingLeft: '.5em' } },
    _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

var mapStateToProps = function mapStateToProps(state, props) {
    return {
        matchIds: _lodash2.default.filter(state.matches.ids, function (id) {
            return props.region.id === id.charAt(0);
        })
    };
};

var Matches = function Matches(_ref) {
    var matchIds = _ref.matchIds;
    var region = _ref.region;
    return _react2.default.createElement(
        'div',
        { className: 'RegionMatches' },
        _react2.default.createElement(
            'h2',
            null,
            region.label,
            ' Matches',
            _lodash2.default.isEmpty(matchIds) ? loadingHtml : null
        ),
        _lodash2.default.map(matchIds, function (matchId) {
            return _react2.default.createElement(_Match2.default, { key: matchId, matchId: matchId });
        })
    );
};
Matches.propTypes = {
    matchIds: _react2.default.PropTypes.array.isRequired,
    region: _react2.default.PropTypes.object.isRequired
};
Matches = (0, _reactRedux.connect)(mapStateToProps)(Matches);

exports.default = Matches;

},{"./Match":13,"lodash":"lodash","react":"react","react-redux":"react-redux"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    return {
        lang: state.lang
    };
};

var Worlds = function Worlds(_ref) {
    var lang = _ref.lang;
    var region = _ref.region;
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
            _.chain(_static.worlds).filter(function (world) {
                return world.region === region.id;
            }).map(function (world) {
                return world[lang.slug];
            }).sortBy('name').map(function (world) {
                return _react2.default.createElement(
                    'li',
                    { key: world.slug },
                    _react2.default.createElement(
                        'a',
                        { href: world.link },
                        world.name
                    )
                );
            }).value()
        )
    );
};
Worlds.propTypes = {
    lang: _react2.default.PropTypes.object.isRequired,
    region: _react2.default.PropTypes.object.isRequired
};

Worlds = (0, _reactRedux.connect)(mapStateToProps)(Worlds);

exports.default = Worlds;

},{"lib/static":38,"react":"react","react-redux":"react-redux"}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

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

/*
*
*   Redux Helpers
*
*/

var mapStateToProps = function mapStateToProps(state) {

    // console.log('state', state.timeouts);

    return {
        lang: state.lang,
        matchesData: state.matches.data,
        matchesLastUpdated: state.matches.lastUpdated,
        matchesIsFetching: _.includes(state.api.pending, 'matches')
    };
};

// timeouts: state.timeouts,
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
            var shouldUpdate = this.props.matchesLastUpdated !== nextProps.matchesLastUpdated || this.props.matchesIsFetching !== nextProps.matchesIsFetching || this.props.lang.slug !== nextProps.lang.slug;

            // console.log(`Overview::shouldUpdate`, this.props, nextProps);

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
                        return _.random(4 * 1000, 8 * 1000);
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
            return _react2.default.createElement(
                'div',
                { id: 'overview' },
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
    lang: _react2.default.PropTypes.object.isRequired,
    matchesData: _react2.default.PropTypes.object.isRequired,
    matchesLastUpdated: _react2.default.PropTypes.number.isRequired,
    matchesIsFetching: _react2.default.PropTypes.bool.isRequired,
    // timeouts: React.PropTypes.object.isRequired,

    fetchMatches: _react2.default.PropTypes.func.isRequired,

    setAppTimeout: _react2.default.PropTypes.func.isRequired,
    clearAppTimeout: _react2.default.PropTypes.func.isRequired
};

Overview = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Overview);

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

},{"./Matches":15,"./Worlds":16,"actions/api":1,"actions/timeouts":5,"react":"react","react-redux":"react-redux"}],18:[function(require,module,exports){
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

var _Emblem = require('components/common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var guilds = _ref.guilds;
    return _react2.default.createElement(
        'ul',
        { id: 'guilds', className: 'list-unstyled' },
        _lodash2.default.chain(guilds).sortBy('name').map(function (guild) {
            return _react2.default.createElement(
                'li',
                { key: guild.id, className: 'guild', id: guild.id },
                _react2.default.createElement(
                    'a',
                    { href: 'https://guilds.gw2w2w.com/' + guild.id },
                    _react2.default.createElement(_Emblem2.default, { guildId: guild.id }),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'span',
                            { className: 'guild-name' },
                            ' ',
                            guild.name,
                            ' '
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'guild-tag' },
                            ' [',
                            guild.tag,
                            '] '
                        )
                    )
                )
            );
        }).value()
    );
};

},{"classnames":"classnames","components/common/icons/Emblem":32,"lodash":"lodash","react":"react"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

// import Sprite from 'components/common/icons/Sprite';

exports.default = function (_ref) {
    var guilds = _ref.guilds;
    var lang = _ref.lang;
    var log = _ref.log;
    var now = _ref.now;
    var mapFilter = _ref.mapFilter;
    var typeFilter = _ref.typeFilter;
    return _react2.default.createElement(
        'ol',
        { id: 'log', className: 'list-unstyled' },
        _.chain(log).filter(function (entry) {
            return byType(typeFilter, entry);
        }).filter(function (entry) {
            return byMapId(mapFilter, entry);
        }).map(function (entry) {
            return _react2.default.createElement(
                'li',
                { key: entry.id, className: 'team ' + entry.owner },
                _react2.default.createElement(
                    'ul',
                    { className: 'list-unstyled log-objective' },
                    _react2.default.createElement(
                        'li',
                        { className: 'log-expire' },
                        entry.expires.isAfter(now) ? (0, _moment2.default)(entry.expires.diff(now, 'milliseconds')).format('m:ss') : null
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-time' },
                        (0, _moment2.default)().diff(entry.lastFlipped, 'hours') < 4 ? entry.lastFlipped.format('hh:mm:ss') : entry.lastFlipped.fromNow(true)
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-geo' },
                        _react2.default.createElement(_Arrow2.default, { direction: getObjectiveDirection(entry) })
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-sprite' },
                        _react2.default.createElement(_Objective2.default, { color: entry.owner, type: entry.type })
                    ),
                    mapFilter === '' ? _react2.default.createElement(
                        'li',
                        { className: 'log-map' },
                        getMap(entry).abbr
                    ) : null,
                    _react2.default.createElement(
                        'li',
                        { className: 'log-name' },
                        STATIC.objectives[entry.id].name[lang.slug]
                    ),
                    _react2.default.createElement(
                        'li',
                        { className: 'log-guild' },
                        entry.guild ? _react2.default.createElement(
                            'a',
                            { href: '#' + entry.guild },
                            _react2.default.createElement(_Emblem2.default, { guildId: entry.guild }),
                            guilds[entry.guild] ? _react2.default.createElement(
                                'span',
                                { className: 'guild-name' },
                                ' ',
                                guilds[entry.guild].name,
                                ' '
                            ) : null,
                            guilds[entry.guild] ? _react2.default.createElement(
                                'span',
                                { className: 'guild-tag' },
                                ' [',
                                guilds[entry.guild].tag,
                                '] '
                            ) : null
                        ) : null
                    )
                )
            );
        }).value()
    );
};

function getObjectiveDirection(objective) {
    var baseId = objective.id.split('-')[1].toString();
    var meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}

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

},{"components/common/icons/Arrow":31,"components/common/icons/Emblem":32,"components/common/icons/Objective":33,"lib/static":38,"moment":"moment","react":"react"}],20:[function(require,module,exports){
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
            return _.some(maps, function (matchMap) {
                return matchMap.id == mm.id;
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

},{"classnames":"classnames","components/common/icons/Objective":33,"lib/static":38,"react":"react"}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Entries = require('./Entries');

var _Entries2 = _interopRequireDefault(_Entries);

var _Tabs = require('./Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            return _react2.default.createElement(
                'div',
                { id: 'log-container' },
                _react2.default.createElement(_Tabs2.default, {
                    maps: this.props.match.maps,
                    mapFilter: this.state.mapFilter,
                    typeFilter: this.state.typeFilter,

                    handleMapFilterClick: this.handleMapFilterClick.bind(this),
                    handleTypeFilterClick: this.handleTypeFilterClick.bind(this)
                }),
                _react2.default.createElement(_Entries2.default, {
                    guilds: this.props.guilds,
                    lang: this.props.lang,
                    log: this.props.log,
                    now: this.props.now,
                    mapFilter: this.state.mapFilter,
                    typeFilter: this.state.typeFilter
                })
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
    lang: _react2.default.PropTypes.object.isRequired,
    log: _react2.default.PropTypes.array.isRequired,
    guilds: _react2.default.PropTypes.object.isRequired,
    match: _react2.default.PropTypes.object.isRequired
};
exports.default = LogContainer;

},{"./Entries":19,"./Tabs":20,"react":"react"}],22:[function(require,module,exports){
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

},{"./Objective":23,"classnames":"classnames","lib/static":38,"lodash":"lodash","react":"react"}],23:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Arrow":31,"components/common/icons/Emblem":32,"components/common/icons/Objective":33,"lib/static":38,"lodash":"lodash","moment":"moment","react":"react"}],24:[function(require,module,exports){
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

},{"./MatchMap":22,"lib/static":38,"lodash":"lodash","react":"react"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Sprite = require('components/common/Icons/Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var color = _ref.color;
    var holdings = _ref.holdings;
    return _react2.default.createElement(
        'ul',
        { className: 'list-inline' },
        _.map(holdings, function (typeQuantity, typeIndex) {
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

},{"components/common/Icons/Sprite":30,"react":"react"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _Holdings = require('./Holdings');

var _Holdings2 = _interopRequireDefault(_Holdings);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loading = function Loading() {
    return _react2.default.createElement(
        'h1',
        { style: { height: '90px', fontSize: '32pt', lineHeight: '90px' } },
        _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
    );
};

exports.default = function (_ref) {
    var color = _ref.color;
    var deaths = _ref.deaths;
    var id = _ref.id;
    var holdings = _ref.holdings;
    var kills = _ref.kills;
    var lang = _ref.lang;
    var score = _ref.score;
    var tick = _ref.tick;

    var world = _static.worlds[id][lang.slug];

    if (!world && _lodash2.default.isEmpty(world)) {
        return _react2.default.createElement(Loading, null);
    }

    return _react2.default.createElement(
        'div',
        { className: 'scoreboard team-bg team text-center ' + color },
        _react2.default.createElement(
            'h1',
            null,
            _react2.default.createElement(
                'a',
                { href: world.link },
                world.name
            )
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
                    (0, _numeral2.default)(score).format('0,0')
                ),
                ' ',
                _react2.default.createElement(
                    'span',
                    { title: 'Total Tick' },
                    (0, _numeral2.default)(tick).format('+0,0')
                )
            ),
            kills ? _react2.default.createElement(
                'div',
                { className: 'sub-stats' },
                _react2.default.createElement(
                    'span',
                    { title: 'Total Kills' },
                    (0, _numeral2.default)(kills).format('0,0'),
                    'k'
                ),
                ' ',
                _react2.default.createElement(
                    'span',
                    { title: 'Total Deaths' },
                    (0, _numeral2.default)(deaths).format('0,0'),
                    'd'
                )
            ) : null
        ),
        _react2.default.createElement(_Holdings2.default, {
            color: color,
            holdings: holdings
        })
    );
};

},{"./Holdings":25,"lib/static":38,"lodash":"lodash","numeral":"numeral","react":"react"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _World = require('./World');

var _World2 = _interopRequireDefault(_World);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
* Component Definition
*
*/

exports.default = function (_ref) {
    var match = _ref.match;
    var lang = _ref.lang;

    var worldsProps = getWorldsProps(match, lang);

    return _react2.default.createElement(
        'section',
        { className: 'row', id: 'scoreboards' },
        _lodash2.default.map(worldsProps, function (worldProps) {
            return _react2.default.createElement(
                'div',
                { className: 'col-sm-8', key: worldProps.id },
                _react2.default.createElement(_World2.default, worldProps)
            );
        })
    );
};

function getWorldsProps(match, lang) {
    return _lodash2.default.reduce(match.worlds, function (acc, worldId, color) {
        acc[color] = {
            color: color,
            lang: lang,
            id: worldId,
            score: _lodash2.default.get(match, ['scores', color], 0),
            deaths: _lodash2.default.get(match, ['deaths', color], 0),
            kills: _lodash2.default.get(match, ['kills', color], 0),
            tick: _lodash2.default.get(match, ['ticks', color], 0),
            holdings: _lodash2.default.get(match, ['holdings', color], [])
        };
        return acc;
    }, { red: {}, blue: {}, green: {} });
}

},{"./World":26,"lodash":"lodash","react":"react"}],28:[function(require,module,exports){
'use strict';

/*
*
* Dependencies
*
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _tracker = require('lib/data/tracker');

var _tracker2 = _interopRequireDefault(_tracker);

var _Scoreboard = require('./Scoreboard');

var _Scoreboard2 = _interopRequireDefault(_Scoreboard);

var _Maps = require('./Maps');

var _Maps2 = _interopRequireDefault(_Maps);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

var _Guilds = require('./Guilds');

var _Guilds2 = _interopRequireDefault(_Guilds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *   Data
 */

/*
 * React Components
 */

/*
* Globals
*/

var updateTimeInterval = 1000;

var LoadingSpinner = function LoadingSpinner() {
    return _react2.default.createElement(
        'h1',
        { id: 'AppLoading' },
        _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
    );
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

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tracker).call(this, props));

        _this.__mounted = false;
        _this.__timeouts = {};
        _this.__intervals = {};

        var dataListeners = {
            onMatchDetails: _this.onMatchDetails.bind(_this),
            onGuildDetails: _this.onGuildDetails.bind(_this)
        };

        _this.dao = new _tracker2.default(dataListeners);

        _this.state = {
            hasData: false,
            match: {},
            log: [],
            guilds: {},
            now: now()
        };

        _this.__intervals.setDate = setInterval(function () {
            return _this.setState({ now: now() });
        }, updateTimeInterval);
        return _this;
    }

    _createClass(Tracker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log('Tracker::componentDidMount()');
            this.__mounted = true;

            setPageTitle(this.props.lang, this.props.world);

            this.dao.init(this.props.world);
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
            setPageTitle(nextProps.lang, nextProps.world);
            this.dao.setWorld(nextProps.world);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return this.isNewSecond(nextState) || this.isNewLang(nextProps);
        }
    }, {
        key: 'isNewSecond',
        value: function isNewSecond(nextState) {
            return !this.state.now.isSame(nextState.now);
        }
    }, {
        key: 'isNewLang',
        value: function isNewLang(nextProps) {
            return this.props.lang.name !== nextProps.lang.name;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.log('Tracker::componentWillUnmount()');

            this.__mounted = false;
            this.__timeouts = _lodash2.default.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _lodash2.default.map(this.__intervals, function (i) {
                return clearInterval(i);
            });

            this.dao.close();
        }
    }, {
        key: 'render',
        value: function render() {
            // console.log('Tracker::render()');

            return _react2.default.createElement(
                'div',
                { id: 'tracker' },
                !this.state.hasData ? _react2.default.createElement(LoadingSpinner, null) : null,
                this.state.match && !_lodash2.default.isEmpty(this.state.match) ? _react2.default.createElement(_Scoreboard2.default, {
                    lang: this.props.lang,
                    match: this.state.match
                }) : null,
                this.state.match && !_lodash2.default.isEmpty(this.state.match) ? _react2.default.createElement(_Maps2.default, {
                    guilds: this.state.guilds,
                    lang: this.props.lang,
                    match: this.state.match,
                    now: this.state.now
                }) : null,
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-24' },
                        _react2.default.createElement(_Log2.default, {
                            guilds: this.state.guilds,
                            lang: this.props.lang,
                            log: this.state.log,
                            match: this.state.match,
                            now: this.state.now
                        })
                    )
                ),
                this.state.guilds && !_lodash2.default.isEmpty(this.state.guilds) ? _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-24' },
                        _react2.default.createElement(_Guilds2.default, { guilds: this.state.guilds })
                    )
                ) : null
            );
        }

        /*
        *
        *   Data Listeners
        *
        */

        // updateTimers(cb = _.noop) {
        //     if (this.__mounted) {
        //         trackerTimers.update(this.state.time.offset, cb);
        //         this.__timeouts.updateTimers = setTimeout(this.updateTimers.bind(this), updateTimeInterval);
        //     }
        // }

    }, {
        key: 'onMatchDetails',
        value: function onMatchDetails(match) {
            var _this2 = this;

            var log = getLog(match);

            this.setState({
                hasData: true,
                match: match,
                log: log
            });

            setImmediate(function () {
                var knownGuilds = _lodash2.default.keys(_this2.state.guilds);
                var unknownGuilds = getNewClaims(log, knownGuilds);

                _this2.dao.guilds.lookup(unknownGuilds, _this2.onGuildDetails.bind(_this2));
            });
        }
    }, {
        key: 'onGuildDetails',
        value: function onGuildDetails(guild) {
            this.setState(function (state) {
                state.guilds[guild.id] = guild;

                return { guilds: state.guilds };
            });
        }
    }]);

    return Tracker;
}(_react2.default.Component);

/*
*
* Private methods
*
*/

Tracker.propTypes = {
    lang: _react2.default.PropTypes.object.isRequired,
    world: _react2.default.PropTypes.object.isRequired
};
exports.default = Tracker;
function now() {
    return (0, _moment2.default)(Math.floor(Date.now() / 1000) * 1000);
}

function setPageTitle(lang, world) {
    var langSlug = lang.slug;
    var worldName = world.name;

    var title = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.name);
    }

    document.title = title.join(' - ');
}

function getLog(match) {
    return _lodash2.default.chain(match.maps).map('objectives').flatten().clone().sortBy('lastFlipped').reverse().map(function (o) {
        o.mapId = _lodash2.default.parseInt(o.id.split('-')[0]);
        o.lastmod = (0, _moment2.default)(o.lastmod, 'X');
        o.lastFlipped = (0, _moment2.default)(o.lastFlipped, 'X');
        o.lastClaimed = (0, _moment2.default)(o.lastClaimed, 'X');
        o.expires = (0, _moment2.default)(o.lastFlipped).add(5, 'minutes');
        return o;
    }).value();
};

function getNewClaims(log, knownGuilds) {
    return _lodash2.default.chain(log).reject(function (o) {
        return _lodash2.default.isEmpty(o.guild);
    }).map('guild').uniq().difference(knownGuilds).value();
}

},{"./Guilds":18,"./Log":21,"./Maps":24,"./Scoreboard":27,"lib/data/tracker":37,"lodash":"lodash","moment":"moment","react":"react"}],29:[function(require,module,exports){
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

exports.default = function (_ref) {
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

},{"react":"react"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var color = _ref.color;
    var type = _ref.type;
    return _react2.default.createElement('span', { className: 'sprite ' + type + ' ' + color });
};

},{"react":"react"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var direction = _ref.direction;
    return direction ? _react2.default.createElement('img', { src: getArrowSrc(direction), className: 'arrow' }) : _react2.default.createElement('span', null);
};

/*
 *
 * Private Methods
 *
 */

function getArrowSrc(direction) {
    if (!direction) {
        return null;
    }

    var src = ['/img/icons/dist/arrow'];

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

},{"react":"react"}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';

exports.default = function (_ref) {
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

},{"react":"react"}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
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

},{"react":"react"}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/*
*   Generic
*/

// routes
var SET_ROUTE = exports.SET_ROUTE = 'SET_ROUTE';

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
var RECEIVE_MATCHES_FAILED = exports.RECEIVE_MATCHES_FAILED = 'RECEIVE_MATCHES_FAILED';

/*
*   Tracker
*/

},{}],35:[function(require,module,exports){
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

},{"superagent":"superagent"}],36:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _api = require('lib/api');

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 * Module Globals
 *
 */

var NUM_QUEUE_CONCURRENT = 4;

/*
 *
 * Public Methods
 *
 */

var LibGuilds = function () {
    function LibGuilds() {
        _classCallCheck(this, LibGuilds);

        // this.component = component;

        this.__asyncGuildQueue = _async2.default.queue(getGuildDetailsFromQueue, NUM_QUEUE_CONCURRENT);
    }

    _createClass(LibGuilds, [{
        key: 'lookup',
        value: function lookup(guilds, onDataListener) {
            var toQueue = _lodash2.default.map(guilds, function (guildId) {
                return {
                    guildId: guildId,
                    onData: onDataListener
                };
            });

            this.__asyncGuildQueue.push(toQueue);
        }
    }]);

    return LibGuilds;
}();

/*
 *
 * Private Methods
 *
 */

exports.default = LibGuilds;
function getGuildDetailsFromQueue(cargo, onComplete) {
    // console.log('getGuildDetailsFromQueue', cargo, cargo.guildId);

    api.getGuildById({
        guildId: cargo.guildId,
        success: function success(data) {
            return onGuildData(data, cargo);
        },
        complete: onComplete
    });
}

function onGuildData(data, cargo) {
    // console.log('onGuildData', data);

    if (data && !_lodash2.default.isEmpty(data)) {
        cargo.onData({
            id: data.guild_id,
            name: data.guild_name,
            tag: data.tag
        });
    }
}

},{"async":"async","lib/api":35,"lodash":"lodash"}],37:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _guilds = require('./guilds');

var _guilds2 = _interopRequireDefault(_guilds);

var _api = require('lib/api');

var _api2 = _interopRequireDefault(_api);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OverviewDataProvider = function () {
    function OverviewDataProvider(listeners) {
        _classCallCheck(this, OverviewDataProvider);

        // console.log('lib::data::tracker::constructor()');

        this.__langSlug = null;
        this.__worldSlug = null;

        this.guilds = new _guilds2.default();

        this.__mounted = false;
        this.__listeners = listeners;

        this.__timeouts = {};
        this.__intervals = {};
    }

    _createClass(OverviewDataProvider, [{
        key: 'init',
        value: function init(world) {
            // console.log('lib::data::tracker::init()', lang, world);

            this.setWorld(world);

            this.__mounted = true;
            this.__getData();
        }
    }, {
        key: 'setWorld',
        value: function setWorld(world) {
            this.__worldId = world.id;
        }
    }, {
        key: 'close',
        value: function close() {
            // console.log('lib::data::tracker::close()');

            this.__mounted = false;

            this.__timeouts = _lodash2.default.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _lodash2.default.map(this.__intervals, function (i) {
                return clearInterval(i);
            });
        }
    }, {
        key: 'getMatchWorlds',
        value: function getMatchWorlds(match) {
            return _lodash2.default.map({ red: {}, blue: {}, green: {} }, function (j, color) {
                return getMatchWorld(match, color);
            });
        }

        /*
        *
        *   Private Methods
        *
        */

    }, {
        key: '__getData',
        value: function __getData() {
            var _this = this;

            // console.log('lib::data::tracker::__getData()');

            // api.getMatchByWorldSlug({
            //     worldSlug: this.__worldSlug,
            //     success: (data) => this.__onMatchDetails(data),
            //     complete: () => this.__rescheduleDataUpdate(),
            // });
            _api2.default.getMatchByWorldId({
                worldId: this.__worldId,
                success: function success(data) {
                    return _this.__onMatchDetails(data);
                },
                complete: function complete() {
                    return _this.__rescheduleDataUpdate();
                }
            });
        }
    }, {
        key: '__onMatchDetails',
        value: function __onMatchDetails(data) {
            // console.log('lib::data::tracker::__onMatchData()', data);

            if (!this.__mounted) {
                return;
            }

            if (data && !_lodash2.default.isEmpty(data)) {
                this.__listeners.onMatchDetails(data);
            }
        }
    }, {
        key: '__rescheduleDataUpdate',
        value: function __rescheduleDataUpdate() {
            var refreshTime = _lodash2.default.random(1000 * 4, 1000 * 8);

            // console.log('data refresh: ', refreshTime);

            this.__timeouts.data = setTimeout(this.__getData.bind(this), refreshTime);
        }
    }]);

    return OverviewDataProvider;
}();

/*
*   Worlds
*/

exports.default = OverviewDataProvider;
function getMatchWorld(match, color) {
    var worldId = match.worlds[color].toString();

    var world = _lodash2.default.merge({ color: color }, STATIC.worlds[worldId]);

    return world;
}

},{"./guilds":36,"lib/api":35,"lib/static":38,"lodash":"lodash"}],38:[function(require,module,exports){
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

},{"gw2w2w-static/data/langs":47,"gw2w2w-static/data/objectives_v2_merged":48,"gw2w2w-static/data/world_names":49,"lodash":"lodash"}],39:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

},{"lib/static":38}],40:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultState = {
    pending: []
};

var api = function api() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::api', state, action);

    switch (action.type) {

        case _actionTypes.API_REQUEST_OPEN:
            // console.log('reducer::api', action.type, state, action);
            return _extends({}, state, {
                pending: [action.requestKey].concat(_toConsumableArray(state.pending))
            });

        case _actionTypes.API_REQUEST_SUCCESS:
        case _actionTypes.API_REQUEST_FAILED:
            // console.log('reducer::api', action.type, state, action);
            return _extends({}, state, {
                pending: _lodash2.default.without(state.pending, action.requestKey)
            });

        default:
            return state;
    }
};

exports.default = api;

},{"constants/actionTypes":34,"lodash":"lodash"}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _matches = require('./matches');

var _matches2 = _interopRequireDefault(_matches);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _timeouts = require('./timeouts');

var _timeouts2 = _interopRequireDefault(_timeouts);

var _world = require('./world');

var _world2 = _interopRequireDefault(_world);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
    api: _api2.default,
    lang: _lang2.default,
    matches: _matches2.default,
    route: _route2.default,
    timeouts: _timeouts2.default,
    world: _world2.default
});

},{"./api":40,"./lang":42,"./matches":43,"./route":44,"./timeouts":45,"./world":46,"redux":"redux"}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _static = require('lib/static');

var SET_LANG = 'SET_LANG';

var defaultSlug = 'en';
var defaultLang = _static.langs[defaultSlug];

var lang = function lang() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultLang : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case SET_LANG:
            return _static.langs[action.slug];

        default:
            return state;
    }
};

exports.default = lang;

},{"lib/static":38}],43:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = require('constants/actionTypes');

var defaultState = {
    data: {},
    ids: [],
    lastUpdated: 0
};

var matches = function matches() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::matches', state, action);

    switch (action.type) {

        case _actionTypes.RECEIVE_MATCHES:
            // console.log('reducer::matches', RECEIVE_MATCHES, state, action);
            return _extends({}, state, {
                data: action.data,
                ids: Object.keys(action.data).sort(),
                lastUpdated: action.lastUpdated
            });

        case _actionTypes.RECEIVE_MATCHES_FAILED:
            // console.log('reducer::matches', RECEIVE_MATCHES_FAILED, state, action);
            return _extends({}, state, {
                error: action.error
            });

        default:
            return state;
    }
};

exports.default = matches;

},{"constants/actionTypes":34}],44:[function(require,module,exports){
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

},{"constants/actionTypes":34}],45:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

},{"constants/actionTypes":34,"lodash":"lodash"}],46:[function(require,module,exports){
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

},{"constants/actionTypes":34,"lib/worlds":39}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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
},{}],51:[function(require,module,exports){
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
},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGFwaS5qcyIsImFwcFxcYWN0aW9uc1xcbGFuZy5qcyIsImFwcFxcYWN0aW9uc1xcbWF0Y2hlcy5qcyIsImFwcFxcYWN0aW9uc1xccm91dGUuanMiLCJhcHBcXGFjdGlvbnNcXHRpbWVvdXRzLmpzIiwiYXBwXFxhY3Rpb25zXFx3b3JsZC5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXENvbnRhaW5lci5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxGb290ZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTGFuZ3NcXExhbmdMaW5rLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXExhbmdzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxOYXZiYXJIZWFkZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxNYXRjaC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXE1hdGNoV29ybGQuanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXFdvcmxkc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcR3VpbGRzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxFbnRyaWVzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXFRhYnMuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXE1hdGNoTWFwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxNYXBzXFxPYmplY3RpdmUuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxIb2xkaW5ncy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcV29ybGQuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxJY29uc1xcUGllLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXEljb25zXFxTcHJpdGUuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXEFycm93LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXGljb25zXFxFbWJsZW0uanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXE9iamVjdGl2ZS5qcyIsImFwcFxcY29uc3RhbnRzXFxhY3Rpb25UeXBlcy5qcyIsImFwcFxcbGliXFxhcGkuanMiLCJhcHBcXGxpYlxcZGF0YVxcdHJhY2tlclxcZ3VpbGRzLmpzIiwiYXBwXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxsaWJcXHN0YXRpY1xcaW5kZXguanMiLCJhcHBcXGxpYlxcd29ybGRzLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcYXBpLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcaW5kZXguanMiLCJhcHBcXHJlZHVjZXJzXFxsYW5nLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbWF0Y2hlcy5qcyIsImFwcFxccmVkdWNlcnNcXHJvdXRlLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcdGltZW91dHMuanMiLCJhcHBcXHJlZHVjZXJzXFx3b3JsZC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZXNfdjJfbWVyZ2VkLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC1iYXRjaGVkLWFjdGlvbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LXRodW5rL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNxQk8sSUFBTSxvQ0FBYyxTQUFkLFdBQWMsT0FBb0I7UUFBakIsNkJBQWlCOzs7O0FBRzNDLFdBQU87QUFDSCwyQ0FERztBQUVILDhCQUZHO0tBQVAsQ0FIMkM7Q0FBcEI7O0FBV3BCLElBQU0sMENBQWlCLFNBQWpCLGNBQWlCLFFBQW9CO1FBQWpCLDhCQUFpQjs7OztBQUc5QyxXQUFPO0FBQ0gsOENBREc7QUFFSCw4QkFGRztLQUFQLENBSDhDO0NBQXBCOztBQVd2QixJQUFNLHdDQUFnQixTQUFoQixhQUFnQixRQUFvQjtRQUFqQiw4QkFBaUI7Ozs7QUFHN0MsV0FBTztBQUNILDZDQURHO0FBRUgsOEJBRkc7S0FBUCxDQUg2QztDQUFwQjs7QUFXdEIsSUFBTSxzQ0FBZSxTQUFmLFlBQWUsR0FBTTs7O0FBRzlCLFdBQU8sVUFBQyxRQUFELEVBQWM7QUFDakIsWUFBTSxhQUFhLFNBQWIsQ0FEVzs7QUFHakIsaUJBQVMsWUFBWSxFQUFFLHNCQUFGLEVBQVosQ0FBVCxFQUhpQjs7QUFLakIsc0JBQUksVUFBSixDQUFlO0FBQ1gscUJBQVMsaUJBQUMsSUFBRCxFQUFVOztBQUVmLHlCQUFTLHVDQUFhLENBQ2xCLGVBQWUsRUFBRSxzQkFBRixFQUFmLENBRGtCLEVBRWxCLDZCQUFlO0FBQ1gsOEJBRFc7QUFFWCxpQ0FBYSxnQ0FBa0IsSUFBbEIsQ0FBYjtpQkFGSixDQUZrQixDQUFiLENBQVQsRUFGZTthQUFWO0FBVVQsbUJBQU8sZUFBQyxHQUFELEVBQVM7O0FBRVoseUJBQVMsdUNBQWEsQ0FD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdC9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuaW1wb3J0IHsgYmF0Y2hBY3Rpb25zIH0gZnJvbSAncmVkdXgtYmF0Y2hlZC1hY3Rpb25zJztcclxuXHJcbmltcG9ydCBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICBBUElfUkVRVUVTVF9TVUNDRVNTLFxyXG4gICAgQVBJX1JFUVVFU1RfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIHJlY2VpdmVNYXRjaGVzLFxyXG4gICAgZ2V0TWF0Y2hlc0xhc3Rtb2QsXHJcbn0gZnJvbSAnLi9tYXRjaGVzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0T3BlbiA9ICh7IHJlcXVlc3RLZXkgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVxdWVzdE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICAgICAgcmVxdWVzdEtleSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0U3VjY2VzcyA9ICh7IHJlcXVlc3RLZXkgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVxdWVzdE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IEFQSV9SRVFVRVNUX1NVQ0NFU1MsXHJcbiAgICAgICAgcmVxdWVzdEtleSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0RmFpbGVkID0gKHsgcmVxdWVzdEtleSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXF1ZXN0TWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQVBJX1JFUVVFU1RfRkFJTEVELFxyXG4gICAgICAgIHJlcXVlc3RLZXksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hNYXRjaGVzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzJyk7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RLZXkgPSAnbWF0Y2hlcyc7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHJlcXVlc3RPcGVuKHsgcmVxdWVzdEtleSB9KSk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaGVzKHtcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6c3VjY2VzcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYmF0Y2hBY3Rpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3VjY2Vzcyh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogZ2V0TWF0Y2hlc0xhc3Rtb2QoZGF0YSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OmVycm9yJywgZXJyKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGJhdGNoQWN0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEZhaWxlZCh7IHJlcXVlc3RLZXkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU1hdGNoZXNGYWlsZWQoeyBlcnIgfSksXHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXM6OmNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59OyIsIlxyXG5leHBvcnQgY29uc3Qgc2V0TGFuZyA9IHNsdWcgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0TGFuZycsIHNsdWcpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ1NFVF9MQU5HJyxcclxuICAgICAgICBzbHVnLFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICAvLyBSRVFVRVNUX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzID0gKHsgZGF0YSwgbGFzdFVwZGF0ZWQgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVjZWl2ZU1hdGNoZXMnLCBkYXRhKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFUyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGxhc3RVcGRhdGVkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXRjaGVzRmFpbGVkID0gKHsgZXJyIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbiAgICAgICAgZXJyLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXNMYXN0bW9kKG1hdGNoZXNEYXRhKSB7XHJcbiAgICByZXR1cm4gXy5yZWR1Y2UoXHJcbiAgICAgICAgbWF0Y2hlc0RhdGEsXHJcbiAgICAgICAgKGFjYywgbWF0Y2gpID0+IE1hdGgubWF4KG1hdGNoLmxhc3Rtb2QpLFxyXG4gICAgICAgIDBcclxuICAgICk7XHJcbn0iLCJcclxuaW1wb3J0IHtcclxuICAgIFNFVF9ST1VURSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRSb3V0ZSA9IChjdHgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogU0VUX1JPVVRFLFxyXG4gICAgICAgIHBhdGg6IGN0eC5wYXRoLFxyXG4gICAgICAgIHBhcmFtczogY3R4LnBhcmFtcyxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQge1xyXG4gICAgQUREX1RJTUVPVVQsXHJcbiAgICBSRU1PVkVfVElNRU9VVCxcclxuICAgIC8vIFJFTU9WRV9BTExfVElNRU9VVFMsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEFwcFRpbWVvdXQgPSAoe1xyXG4gICAgbmFtZSxcclxuICAgIGNiLFxyXG4gICAgdGltZW91dCxcclxufSkgPT4ge1xyXG4gICAgdGltZW91dCA9ICh0eXBlb2YgdGltZW91dCA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICA/IHRpbWVvdXQoKVxyXG4gICAgICAgIDogdGltZW91dDtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRBcHBUaW1lb3V0JywgbmFtZSwgdGltZW91dCk7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpO1xyXG5cclxuICAgICAgICBjb25zdCByZWYgPSBzZXRUaW1lb3V0KGNiLCB0aW1lb3V0KTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goc2F2ZVRpbWVvdXQoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICByZWYsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmVUaW1lb3V0ID0gKHtcclxuICAgIG5hbWUsXHJcbiAgICByZWYsXHJcbn0pID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQUREX1RJTUVPVVQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICByZWYsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJBcHBUaW1lb3V0ID0gKHsgbmFtZSB9KSA9PiB7XHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRpbWVvdXRzIH0gPSBnZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhckFwcFRpbWVvdXQnLCBuYW1lLCB0aW1lb3V0c1tuYW1lXSk7XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0c1tuYW1lXSk7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHJlbW92ZVRpbWVvdXQoeyBuYW1lIH0pKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJBbGxUaW1lb3V0cyA9ICgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRpbWVvdXRzIH0gPSBnZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpjbGVhckFsbFRpbWVvdXRzJywgZ2V0U3RhdGUoKS50aW1lb3V0cyk7XHJcblxyXG4gICAgICAgIF8uZm9yRWFjaCh0aW1lb3V0cywgKHQsIG5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnLCBnZXRTdGF0ZSgpLnRpbWVvdXRzKTtcclxuXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlVGltZW91dCA9ICh7IG5hbWUgfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6cmVtb3ZlVGltZW91dCcsIG5hbWUpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVNT1ZFX1RJTUVPVVQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1dPUkxELFxyXG4gICAgQ0xFQVJfV09STEQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFdvcmxkID0gKGxhbmdTbHVnLCB3b3JsZFNsdWcpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldFdvcmxkJywgbGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfV09STEQsXHJcbiAgICAgICAgbGFuZ1NsdWcsXHJcbiAgICAgICAgd29ybGRTbHVnLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhcldvcmxkID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IENMRUFSX1dPUkxELFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHRodW5rTWlkZGxld2FyZSBmcm9tICdyZWR1eC10aHVuayc7XHJcbmltcG9ydCB7IGVuYWJsZUJhdGNoaW5nIH0gZnJvbSAncmVkdXgtYmF0Y2hlZC1hY3Rpb25zJztcclxuXHJcblxyXG5pbXBvcnQgZG9tcmVhZHkgZnJvbSAnZG9tcmVhZHknO1xyXG5pbXBvcnQgcGFnZSBmcm9tICdwYWdlJztcclxuXHJcblxyXG5cclxuXHJcbmltcG9ydCBDb250YWluZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvQ29udGFpbmVyJztcclxuaW1wb3J0IE92ZXJ2aWV3IGZyb20gJ2NvbXBvbmVudHMvT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdjb21wb25lbnRzL1RyYWNrZXInO1xyXG5cclxuaW1wb3J0IGFwcFJlZHVjZXJzIGZyb20gJ3JlZHVjZXJzJztcclxuXHJcbmltcG9ydCB7IHNldFJvdXRlIH0gZnJvbSAnYWN0aW9ucy9yb3V0ZSc7XHJcbmltcG9ydCB7IHNldExhbmcgfSBmcm9tICdhY3Rpb25zL2xhbmcnO1xyXG5pbXBvcnQgeyBzZXRXb3JsZCwgY2xlYXJXb3JsZCB9IGZyb20gJ2FjdGlvbnMvd29ybGQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDcmVhdGUgUmVkdXggU3RvcmVcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIGVuYWJsZUJhdGNoaW5nKGFwcFJlZHVjZXJzKSxcclxuICAgIGFwcGx5TWlkZGxld2FyZSh0aHVua01pZGRsZXdhcmUpXHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFN0YXJ0IEFwcFxyXG4qXHJcbiovXHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgQXBwbGljYXRpb24nKTtcclxuXHJcblxyXG4gICAgYXR0YWNoTWlkZGxld2FyZSgpO1xyXG4gICAgYXR0YWNoUm91dGVzKCk7XHJcblxyXG4gICAgcGFnZS5zdGFydCh7XHJcbiAgICAgICAgY2xpY2s6IHRydWUsXHJcbiAgICAgICAgcG9wc3RhdGU6IGZhbHNlLFxyXG4gICAgICAgIGRpc3BhdGNoOiB0cnVlLFxyXG4gICAgICAgIGhhc2hiYW5nOiBmYWxzZSxcclxuICAgICAgICBkZWNvZGVVUkxDb21wb25lbnRzOiB0cnVlLFxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiByZW5kZXIoQXBwKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyKCknKTtcclxuXHJcbiAgICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgICAgIDxDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICB7QXBwfVxyXG4gICAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICA8L1Byb3ZpZGVyPixcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYXBwJylcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGF0dGFjaE1pZGRsZXdhcmUoKSB7XHJcbiAgICBwYWdlKChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmluZm8oYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFjaCBzdG9yZSB0byB0aGUgcm91dGVyIGNvbnRleHRcclxuICAgICAgICBjdHguc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goc2V0Um91dGUoY3R4KSk7XHJcblxyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIChjdHgsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmdTbHVnLCB3b3JsZFNsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcblxyXG4gICAgICAgIGlmICh3b3JsZFNsdWcpIHtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHNldFdvcmxkKGxhbmdTbHVnLCB3b3JsZFNsdWcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoUm91dGVzKCkge1xyXG4gICAgcGFnZSgnLycsICcvZW4nKTtcclxuXHJcbiAgICBwYWdlKFxyXG4gICAgICAgICcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspJyxcclxuICAgICAgICAoY3R4KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHsgbGFuZ1NsdWcsIHdvcmxkU2x1ZyB9ID0gY3R4LnBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRXb3JsZChsYW5nU2x1Zywgd29ybGRTbHVnKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB7IGxhbmcsIHdvcmxkIH0gPSBjdHguc3RvcmUuZ2V0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcig8VHJhY2tlciBsYW5nPXtsYW5nfSB3b3JsZD17d29ybGR9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHBhZ2UoXHJcbiAgICAgICAgJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpJyxcclxuICAgICAgICAoY3R4KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHsgbGFuZ1NsdWcgfSA9IGN0eC5wYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goc2V0TGFuZyhsYW5nU2x1ZykpO1xyXG4gICAgICAgICAgICAvLyBjdHguc3RvcmUuZGlzcGF0Y2goY2xlYXJXb3JsZCgpKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlcig8T3ZlcnZpZXcgLz4pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcblxyXG5pbXBvcnQgTGFuZ3MgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvTGFuZ3MnO1xyXG5pbXBvcnQgTmF2YmFySGVhZGVyIGZyb20gJ2NvbXBvbmVudHMvTGF5b3V0L05hdmJhckhlYWRlcic7XHJcbmltcG9ydCBGb290ZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvRm9vdGVyJztcclxuXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuICAgICAgICB3b3JsZDogc3RhdGUud29ybGQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaXNFcXVhbEJ5UGljayhjdXJyZW50UHJvcHMsIG5leHRQcm9wcywga2V5cykge1xyXG4gICAgcmV0dXJuIF8uaXNFcXVhbChcclxuICAgICAgICBfLnBpY2soY3VycmVudFByb3BzLCBrZXlzKSxcclxuICAgICAgICBfLnBpY2sobmV4dFByb3BzLCBrZXlzKSxcclxuICAgICk7XHJcblxyXG4gICAgLy8gcmV0dXJuIF8ucmVkdWNlKGtleXMsIChhLCBrZXkpID0+IHtcclxuICAgIC8vICAgICByZXR1cm4gYSB8fCAhXy5pc0VxdWFsKGN1cnJlbnRQcm9wc1trZXldLCBuZXh0UHJvcHNba2V5XSk7XHJcbiAgICAvLyB9LCBmYWxzZSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAhaXNFcXVhbEJ5UGljayh0aGlzLnByb3BzLCBuZXh0UHJvcHMsIFsnbGFuZycsICd3b3JsZCcsICdjaGlsZHJlbiddKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnRTaG91bGRVcGRhdGUoKWAsIHNob3VsZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYW5nJywgXy5pc0VxdWFsKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3dvcmxkJywgXy5pc0VxdWFsKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCksIG5leHRQcm9wcy53b3JsZCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50V2lsbE1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgLy8gY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudERpZFVwZGF0ZSgpYCk7XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT0nbmF2YmFyIG5hdmJhci1kZWZhdWx0Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhckhlYWRlciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGlkPSdjb250ZW50JyBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxGb290ZXIgb2JzZnVFbWFpbD17e1xyXG4gICAgICAgICAgICAgICAgICAgIGNodW5rczogWydndzJ3MncnLCAnc2NodHVwaCcsICdjb20nLCAnQCcsICcuJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogJzAzMTQyJyxcclxuICAgICAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNvbnRhaW5lciA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShDb250YWluZXIpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb250YWluZXI7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBvYnNmdUVtYWlsLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC14cy0yNCc+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT0nc21hbGwgbXV0ZWQgdGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgwqkgMjAxMyBBcmVuYU5ldCwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTkNzb2Z0LCB0aGUgaW50ZXJsb2NraW5nIE5DIGxvZ28sIEFyZW5hTmV0LCBHdWlsZCBXYXJzLCBHdWlsZCBXYXJzIEZhY3Rpb25zLCBHdWlsZCBXYXJzIE5pZ2h0ZmFsbCwgR3VpbGQgV2FyczpFeWUgb2YgdGhlIE5vcnRoLCBHdWlsZCBXYXJzIDIsIGFuZCBhbGwgYXNzb2NpYXRlZCBsb2dvcyBhbmQgZGVzaWducyBhcmUgdHJhZGVtYXJrcyBvciByZWdpc3RlcmVkIHRyYWRlbWFya3Mgb2YgTkNzb2Z0IENvcnBvcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxsIG90aGVyIHRyYWRlbWFya3MgYXJlIHRoZSBwcm9wZXJ0eSBvZiB0aGVpciByZXNwZWN0aXZlIG93bmVycy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2Ugc2VuZCBjb21tZW50cyBhbmQgYnVncyB0byA8T2JzZnVFbWFpbCBvYnNmdUVtYWlsPXtvYnNmdUVtYWlsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1cHBvcnRpbmcgbWljcm9zZXJ2aWNlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8nPmd1aWxkcy5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3N0YXRlLmd3Mncydy5jb20vJz5zdGF0ZS5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3d3dy5waWVseS5uZXQvJz53d3cucGllbHkubmV0PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNvdXJjZSBhdmFpbGFibGUgYXQgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdCc+aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9mb290ZXI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuY29uc3QgT2JzZnVFbWFpbCA9ICh7b2JzZnVFbWFpbH0pID0+IHtcclxuICAgIGNvbnN0IHJlY29uc3RydWN0ZWQgPSBvYnNmdUVtYWlsLnBhdHRlcm5cclxuICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgLm1hcChpeENodW5rID0+IG9ic2Z1RW1haWwuY2h1bmtzW2l4Q2h1bmtdKVxyXG4gICAgICAgIC5qb2luKCcnKTtcclxuXHJcbiAgICByZXR1cm4gPGEgaHJlZj17YG1haWx0bzoke3JlY29uc3RydWN0ZWR9YH0+e3JlY29uc3RydWN0ZWR9PC9hPjtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2xhbmcnLCBzdGF0ZS5sYW5nKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWN0aXZlTGFuZzogc3RhdGUubGFuZyxcclxuICAgICAgICAvLyBhY3RpdmVXb3JsZDogc3RhdGUud29ybGQsXHJcbiAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkID8gd29ybGRzW3N0YXRlLndvcmxkLmlkXVtwcm9wcy5sYW5nLnNsdWddIDogbnVsbCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxubGV0IExhbmcgPSAoe1xyXG4gICAgYWN0aXZlTGFuZyxcclxuICAgIC8vIGFjdGl2ZVdvcmxkLFxyXG4gICAgbGFuZyxcclxuICAgIHdvcmxkLFxyXG59KSA9PiAoXHJcbiAgICA8bGlcclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IGFjdGl2ZUxhbmcubGFiZWwgPT09IGxhbmcubGFiZWwsXHJcbiAgICAgICAgfSl9XHJcbiAgICAgICAgdGl0bGU9e2xhbmcubmFtZX1cclxuICAgID5cclxuICAgICAgICA8YSBocmVmPXtnZXRMaW5rKGxhbmcsIHdvcmxkKX0+XHJcbiAgICAgICAgICAgIHtsYW5nLmxhYmVsfVxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbik7XHJcbkxhbmcucHJvcFR5cGVzID0ge1xyXG4gICAgYWN0aXZlTGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgYWN0aXZlV29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcbkxhbmcgPSBjb25uZWN0KFxyXG4gIG1hcFN0YXRlVG9Qcm9wcyxcclxuICAvLyBtYXBEaXNwYXRjaFRvUHJvcHNcclxuKShMYW5nKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TGluayhsYW5nLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuICh3b3JsZClcclxuICAgICAgICA/IHdvcmxkLmxpbmtcclxuICAgICAgICA6IGxhbmcubGluaztcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYW5nOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IHsgbGFuZ3MgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBMYW5nTGluayBmcm9tICcuL0xhbmdMaW5rJztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IExhbmdzID0gKCkgPT4gKFxyXG4gICAgPGRpdiBpZD0nbmF2LWxhbmdzJyBjbGFzc05hbWU9J3B1bGwtcmlnaHQnPlxyXG4gICAgICAgIDx1bCBjbGFzc05hbWUgPSAnbmF2IG5hdmJhci1uYXYnPlxyXG4gICAgICAgICAgICB7Xy5tYXAobGFuZ3MsIChsYW5nLCBrZXkpID0+XHJcbiAgICAgICAgICAgICAgICA8TGFuZ0xpbmsga2V5PXtrZXl9IGxhbmc9e2xhbmd9IC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYW5nczsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiAoe1xyXG4gICAgbGFuZzogc3RhdGUubGFuZyxcclxuICAgIGhhc1BlbmRpbmdSZXF1ZXN0czogc3RhdGUuYXBpLnBlbmRpbmcubGVuZ3RoID4gMCxcclxufSk7XHJcblxyXG5sZXQgTmF2YmFySGVhZGVyID0gKHtcclxuICAgIGxhbmcsXHJcbiAgICBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXItaGVhZGVyJz5cclxuICAgICAgICA8YSBjbGFzc05hbWU9J25hdmJhci1icmFuZCcgaHJlZj17YC8ke2xhbmcuc2x1Z31gfT5cclxuICAgICAgICAgICAgPGltZyBzcmM9Jy9pbWcvbG9nby9sb2dvLTk2eDM2LnBuZycgLz5cclxuICAgICAgICA8L2E+XHJcblxyXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICduYXZiYXItc3Bpbm5lcic6IHRydWUsXHJcbiAgICAgICAgICAgICdhY3RpdmUnOiBoYXNQZW5kaW5nUmVxdWVzdHMsXHJcbiAgICAgICAgfSl9PlxyXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz5cclxuICAgICAgICA8L3NwYW4+XHJcblxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5OYXZiYXJIZWFkZXIucHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgaGFzUGVuZGluZ1JlcXVlc3RzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuTmF2YmFySGVhZGVyID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKE5hdmJhckhlYWRlcik7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZiYXJIZWFkZXI7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG4vLyBpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgTWF0Y2hXb3JsZCBmcm9tICcuL01hdGNoV29ybGQnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcbmNvbnN0IFdPUkxEX0NPTE9SUyA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXTtcclxuXHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4gICAgICAgIG1hdGNoOiBzdGF0ZS5tYXRjaGVzLmRhdGFbcHJvcHMubWF0Y2hJZF0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLmlzTmV3TWF0Y2hEYXRhKG5leHRQcm9wcylcclxuICAgICAgICAgICAgfHwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdNYXRjaERhdGEobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLm1hdGNoLmxhc3Rtb2QgIT09IG5leHRQcm9wcy5tYXRjaC5sYXN0bW9kKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLmxhbmcuc2x1ZyAhPT0gbmV4dFByb3BzLmxhbmcuc2x1Zyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nLCBtYXRjaCB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hdGNoQ29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J21hdGNoJz5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtfLm1hcChXT1JMRF9DT0xPUlMsIChjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBtYXRjaC53b3JsZHNbY29sb3JdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgPSB3b3JsZHNbd29ybGRJZF1bbGFuZy5zbHVnXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXRjaFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0ge3dvcmxkSWR9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHtjb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB7bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dQaWUgPSB7Y29sb3IgPT09ICdyZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZCA9IHt3b3JsZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKjx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXsyfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7dGV4dEFsaWduOiAnY2VudGVyJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD57bW9tZW50KG1hdGNoLmxhc3Rtb2QgKiAxMDAwKS5mb3JtYXQoJ2hoOm1tOnNzJyl9PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1hdGNoID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wcyxcclxuKShNYXRjaCk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0Y2g7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IFBpZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9JY29ucy9QaWUnO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgTWF0Y2hXb3JsZCA9ICh7XHJcbiAgICBjb2xvcixcclxuICAgIG1hdGNoLFxyXG4gICAgc2hvd1BpZSxcclxuICAgIHdvcmxkLFxyXG59KSA9PiAoXHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke2NvbG9yfWB9PjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgIHsvKjx0ZCBjbGFzc05hbWU9e2B0ZWFtIGtpbGxzICR7Y29sb3J9YH0+e21hdGNoLmtpbGxzID8gbnVtZXJhbChtYXRjaC5raWxsc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+Ki99XHJcbiAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0gZGVhdGhzICR7Y29sb3J9YH0+e21hdGNoLmRlYXRocyA/IG51bWVyYWwobWF0Y2guZGVhdGhzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke2NvbG9yfWB9PnttYXRjaC5zY29yZXMgPyBudW1lcmFsKG1hdGNoLnNjb3Jlc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+XHJcblxyXG4gICAgICAgIHsoc2hvd1BpZSAmJiBtYXRjaC5zY29yZXMpXHJcbiAgICAgICAgICAgID8gPHRkIGNsYXNzTmFtZT0ncGllJyByb3dTcGFuPSczJz48UGllIHNjb3Jlcz17bWF0Y2guc2NvcmVzfSBzaXplPXs2MH0gLz48L3RkPlxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgICAgICB9XHJcbiAgICA8L3RyPlxyXG4pO1xyXG5NYXRjaFdvcmxkLnByb3BUeXBlcyA9IHtcclxuICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1BpZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGNoV29ybGQ7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoIGZyb20gJy4vTWF0Y2gnO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3sgcGFkZGluZ0xlZnQ6ICcuNWVtJyB9fT48aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz48L3NwYW4+O1xyXG5cclxuXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG1hdGNoSWRzOiBfLmZpbHRlcihcclxuICAgICAgICAgICAgc3RhdGUubWF0Y2hlcy5pZHMsXHJcbiAgICAgICAgICAgIGlkID0+IHByb3BzLnJlZ2lvbi5pZCA9PT0gaWQuY2hhckF0KDApXHJcbiAgICAgICAgKSxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxubGV0IE1hdGNoZXMgPSAoe1xyXG4gICAgbWF0Y2hJZHMsXHJcbiAgICByZWdpb24sXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdSZWdpb25NYXRjaGVzJz5cclxuICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgIHtyZWdpb24ubGFiZWx9IE1hdGNoZXNcclxuICAgICAgICAgICAge18uaXNFbXB0eShtYXRjaElkcykgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcbiAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICBtYXRjaElkcyxcclxuICAgICAgICAgICAgKG1hdGNoSWQpID0+XHJcbiAgICAgICAgICAgIDxNYXRjaCBrZXk9e21hdGNoSWR9IG1hdGNoSWQ9e21hdGNoSWR9IC8+XHJcbiAgICAgICAgKX1cclxuICAgICAgICB7LypfLm1hcChtYXRjaGVzLCAobWF0Y2gpID0+IDxkaXYga2V5PXttYXRjaC5pZH0+e0pTT04uc3RyaW5naWZ5KG1hdGNoKX08L2Rpdj4pKi99XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuTWF0Y2hlcy5wcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaElkczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuTWF0Y2hlcyA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShNYXRjaGVzKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGNoZXM7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcbmxldCBXb3JsZHMgPSAoe1xyXG4gICAgbGFuZyxcclxuICAgIHJlZ2lvbixcclxufSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J1JlZ2lvbldvcmxkcyc+XHJcbiAgICAgICAgPGgyPntyZWdpb24ubGFiZWx9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgIHtfLmNoYWluKHdvcmxkcylcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIod29ybGQgPT4gd29ybGQucmVnaW9uID09PSByZWdpb24uaWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKHdvcmxkID0+IHdvcmxkW2xhbmcuc2x1Z10pXHJcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCduYW1lJylcclxuICAgICAgICAgICAgICAgIC5tYXAod29ybGQgPT4gPGxpIGtleT17d29ybGQuc2x1Z30+PGEgaHJlZj17d29ybGQubGlua30+e3dvcmxkLm5hbWV9PC9hPjwvbGk+KVxyXG4gICAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuV29ybGRzLnByb3BUeXBlcyA9IHtcclxuICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuV29ybGRzID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKFdvcmxkcyk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV29ybGRzOyIsIlxyXG4vKlxyXG4qXHJcbiogICBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcblxyXG4vKlxyXG4qICAgUmVkdXggQWN0aW9uc1xyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgYXBpQWN0aW9ucyBmcm9tICdhY3Rpb25zL2FwaSc7XHJcbmltcG9ydCAqIGFzIHRpbWVvdXRBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdGltZW91dHMnO1xyXG5cclxuXHJcbi8qXHJcbiogICBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5pbXBvcnQgTWF0Y2hlcyBmcm9tICcuL01hdGNoZXMnO1xyXG5pbXBvcnQgV29ybGRzIGZyb20gJy4vV29ybGRzJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSRUdJT05TID0ge1xyXG4gICAgMTogeyBsYWJlbDogJ05BJywgaWQ6ICcxJyB9LFxyXG4gICAgMjogeyBsYWJlbDogJ0VVJywgaWQ6ICcyJyB9LFxyXG59O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0ZScsIHN0YXRlLnRpbWVvdXRzKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IHN0YXRlLm1hdGNoZXMuZGF0YSxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IHN0YXRlLm1hdGNoZXMubGFzdFVwZGF0ZWQsXHJcbiAgICAgICAgbWF0Y2hlc0lzRmV0Y2hpbmc6IF8uaW5jbHVkZXMoc3RhdGUuYXBpLnBlbmRpbmcsICdtYXRjaGVzJyksXHJcbiAgICAgICAgLy8gdGltZW91dHM6IHN0YXRlLnRpbWVvdXRzLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmZXRjaE1hdGNoZXM6ICgpID0+IGRpc3BhdGNoKGFwaUFjdGlvbnMuZmV0Y2hNYXRjaGVzKCkpLFxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6ICh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLnNldEFwcFRpbWVvdXQoeyBuYW1lLCBjYiwgdGltZW91dCB9KSksXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiAoeyBuYW1lIH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpLFxyXG4gICAgICAgIC8vIGNsZWFyQWxsVGltZW91dHM6ICgpID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQWxsVGltZW91dHMoKSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyB0aW1lb3V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBmZXRjaE1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcy8qLCBuZXh0U3RhdGUqLykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWQgIT09IG5leHRQcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy5tYXRjaGVzSXNGZXRjaGluZyAhPT0gbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMubGFuZy5zbHVnICE9PSBuZXh0UHJvcHMubGFuZy5zbHVnXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3OjpzaG91bGRVcGRhdGVgLCB0aGlzLnByb3BzLCBuZXh0UHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OnNob3VsZFVwZGF0ZWAsIHNob3VsZFVwZGF0ZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojppc05ld01hdGNoZXNEYXRhYCwgdGhpcy5pc05ld01hdGNoZXNEYXRhKG5leHRQcm9wcykpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6aXNOZXdMYW5nYCwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojpjb21wb25lbnRXaWxsTW91bnQoKWApO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50RGlkTW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmZldGNoTWF0Y2hlcygpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKWApO1xyXG5cclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoZXNJc0ZldGNoaW5nLFxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoZXMsXHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmIChsYW5nLm5hbWUgIT09IG5leHRQcm9wcy5sYW5nLm5hbWUpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzSXNGZXRjaGluZyAmJiAhbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hlcycsXHJcbiAgICAgICAgICAgICAgICBjYjogKCkgPT4gZmV0Y2hNYXRjaGVzKCksXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAoKSA9PiBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaGVzJyB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIG1hdGNoZXMgKi99XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbikgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS0xMicga2V5PXtyZWdpb24uaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hdGNoZXMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7Lyogd29ybGRzICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxXb3JsZHMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk92ZXJ2aWV3ID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXHJcbikoT3ZlcnZpZXcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERpcmVjdCBET00gTWFuaXB1bGF0aW9uXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IFsnZ3cydzJ3LmNvbSddO1xyXG5cclxuICAgIGlmIChsYW5nLnNsdWcgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZS5qb2luKCcgLSAnKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcnZpZXc7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbn0pID0+IChcclxuICAgIDx1bCBpZD0nZ3VpbGRzJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgIHtfXHJcbiAgICAgICAgICAgIC5jaGFpbihndWlsZHMpXHJcbiAgICAgICAgICAgIC5zb3J0QnkoJ25hbWUnKVxyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgICAgZ3VpbGQgPT5cclxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2d1aWxkLmlkfSBjbGFzc05hbWU9J2d1aWxkJyBpZD17Z3VpbGQuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2BodHRwczovL2d1aWxkcy5ndzJ3MncuY29tLyR7Z3VpbGQuaWR9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17Z3VpbGQuaWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGQubmFtZX0gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkLnRhZ31dIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIC52YWx1ZSgpfVxyXG4gICAgPC91bD5cclxuKTtcclxuXHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuLy8gaW1wb3J0IFNwcml0ZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9TcHJpdGUnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5pbXBvcnQgQXJyb3dJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0Fycm93JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGxvZyxcclxuICAgIG5vdyxcclxuICAgIG1hcEZpbHRlcixcclxuICAgIHR5cGVGaWx0ZXIsXHJcbn0pID0+IChcclxuICAgIDxvbCBpZD0nbG9nJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgIHtfLmNoYWluKGxvZylcclxuICAgICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBieVR5cGUodHlwZUZpbHRlciwgZW50cnkpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkpXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT5cclxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2VudHJ5LmlkfSBjbGFzc05hbWU9e2B0ZWFtICR7ZW50cnkub3duZXJ9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCBsb2ctb2JqZWN0aXZlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWV4cGlyZSc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KGVudHJ5LmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLXRpbWUnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb21lbnQoKS5kaWZmKGVudHJ5Lmxhc3RGbGlwcGVkLCAnaG91cnMnKSA8IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0RmxpcHBlZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGVudHJ5Lmxhc3RGbGlwcGVkLmZyb21Ob3codHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1nZW8nPjxBcnJvd0ljb24gZGlyZWN0aW9uPXtnZXRPYmplY3RpdmVEaXJlY3Rpb24oZW50cnkpfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXtlbnRyeS5vd25lcn0gdHlwZT17ZW50cnkudHlwZX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KG1hcEZpbHRlciA9PT0gJycpID8gPGxpIGNsYXNzTmFtZT0nbG9nLW1hcCc+e2dldE1hcChlbnRyeSkuYWJicn08L2xpPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1uYW1lJz57U1RBVElDLm9iamVjdGl2ZXNbZW50cnkuaWRdLm5hbWVbbGFuZy5zbHVnXX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Lyo8bGkgY2xhc3NOYW1lPSdsb2ctY2xhaW1lZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkubGFzdENsYWltZWQuaXNWYWxpZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0Q2xhaW1lZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1ndWlsZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZ3VpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxhIGhyZWY9eycjJyArIGVudHJ5Lmd1aWxkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXtlbnRyeS5ndWlsZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkc1tlbnRyeS5ndWlsZF0gPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGRzW2VudHJ5Lmd1aWxkXS5uYW1lfSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtndWlsZHNbZW50cnkuZ3VpbGRdID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkc1tlbnRyeS5ndWlsZF0udGFnfV0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAudmFsdWUoKX1cclxuICAgIDwvb2w+XHJcbik7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlRGlyZWN0aW9uKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgYmFzZUlkID0gb2JqZWN0aXZlLmlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXAob2JqZWN0aXZlKSB7XHJcbiAgICBjb25zdCBtYXBJZCA9IG9iamVjdGl2ZS5pZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgcmV0dXJuIF8uZmluZChTVEFUSUMubWFwc01ldGEsIG1tID0+IG1tLmlkID09IG1hcElkKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdHlwZUZpbHRlcltlbnRyeS50eXBlXTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgaWYgKG1hcEZpbHRlcikge1xyXG4gICAgICAgIHJldHVybiBlbnRyeS5tYXBJZCA9PT0gbWFwRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBtYXBzLFxyXG4gICAgbWFwRmlsdGVyID0gJycsXHJcbiAgICB0eXBlRmlsdGVyID0gJycsXHJcblxyXG4gICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2ssXHJcbiAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2ssXHJcbn0pID0+IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBpZD0nbG9nLXRhYnMnIGNsYXNzTmFtZT0nZmxleC10YWJzJz5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7dGFiOiB0cnVlLCBhY3RpdmU6ICFtYXBGaWx0ZXJ9KX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZU1hcEZpbHRlckNsaWNrKCcnKX1cclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuPXsnQWxsJ31cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgU1RBVElDLm1hcHNNZXRhLFxyXG4gICAgICAgICAgICAgICAgKG1tKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKF8uc29tZShtYXBzLCBtYXRjaE1hcCA9PiBtYXRjaE1hcC5pZCA9PSBtbS5pZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bW0uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe3RhYjogdHJ1ZSwgYWN0aXZlOiBtYXBGaWx0ZXIgPT0gbW0uaWR9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZU1hcEZpbHRlckNsaWNrKF8ucGFyc2VJbnQobW0uaWQpKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXttbS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW49e21tLmFiYnJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBbJ2Nhc3RsZScsICdrZWVwJywgJ3Rvd2VyJywgJ2NhbXAnXSxcclxuICAgICAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICAgIDxhICBrZXk9e3R9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHlwZUZpbHRlclt0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IHQgPT09ICdjYXN0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVR5cGVGaWx0ZXJDbGljayh0KX0gPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlSWNvbiB0eXBlPXt0fSBzaXplPXsxOH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuaW1wb3J0IEVudHJpZXMgZnJvbSAnLi9FbnRyaWVzJztcclxuaW1wb3J0IFRhYnMgZnJvbSAnLi9UYWJzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbG9nOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcclxuICAgICAgICBndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXBGaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgICB0eXBlRmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjYXN0bGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBrZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdG93ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW1wOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0nbG9nLWNvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICA8VGFic1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcHM9e3RoaXMucHJvcHMubWF0Y2gubWFwc31cclxuICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXI9e3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVGaWx0ZXI9e3RoaXMuc3RhdGUudHlwZUZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlTWFwRmlsdGVyQ2xpY2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlVHlwZUZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPEVudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICBndWlsZHM9e3RoaXMucHJvcHMuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICBsb2c9e3RoaXMucHJvcHMubG9nfVxyXG4gICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5wcm9wcy5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2sobWFwRmlsdGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NldCBtYXBGaWx0ZXInLCBtYXBGaWx0ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHttYXBGaWx0ZXJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2sodG9nZ2xlVHlwZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUgdHlwZUZpbHRlcicsIHRvZ2dsZVR5cGUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXSA9ICFzdGF0ZS50eXBlRmlsdGVyW3RvZ2dsZVR5cGVdO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcbmltcG9ydCBPYmplY3RpdmUgZnJvbSAnLi9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbWF0Y2hNYXAsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcC1zZWN0aW9ucyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIGdldE1hcE9iamVjdGl2ZXNNZXRhKG1hdGNoTWFwLmlkKSxcclxuICAgICAgICAgICAgICAgIChzZWN0aW9uLCBpeCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFwLXNlY3Rpb24nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvbG86IHNlY3Rpb24ubGVuZ3RoID09PSAxLFxyXG4gICAgICAgICAgICAgICAgfSl9IGtleT17aXh9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGdlbykgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtnZW8uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17Z2VvLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXtndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uPXtnZW8uZGlyZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hdGNoTWFwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93PXtub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwT2JqZWN0aXZlc01ldGEobWFwSWQpIHtcclxuICAgIGxldCBtYXBDb2RlID0gJ2JsMic7XHJcblxyXG4gICAgaWYgKG1hcElkID09PSAzOCkge1xyXG4gICAgICAgIG1hcENvZGUgPSAnZWInO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKFNUQVRJQy5vYmplY3RpdmVzTWV0YSlcclxuICAgICAgICAuY2xvbmVEZWVwKClcclxuICAgICAgICAuZmlsdGVyKG9tID0+IG9tLm1hcCA9PT0gbWFwQ29kZSlcclxuICAgICAgICAuZ3JvdXBCeShvbSA9PiBvbS5ncm91cClcclxuICAgICAgICAudmFsdWUoKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSdtb21lbnQnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5pbXBvcnQgQXJyb3cgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvQXJyb3cnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBpZCxcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBkaXJlY3Rpb24sXHJcbiAgICBtYXRjaE1hcCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG4gICAgY29uc3Qgb2JqZWN0aXZlSWQgPSBgJHttYXRjaE1hcC5pZH0tJHtpZH1gO1xyXG4gICAgY29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlc1tvYmplY3RpdmVJZF07XHJcbiAgICBjb25zdCBtbyA9IF8uZmluZChtYXRjaE1hcC5vYmplY3RpdmVzLCBvID0+IG8uaWQgPT09IG9iamVjdGl2ZUlkKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgJ2xpc3QtdW5zdHlsZWQnOiB0cnVlLFxyXG4gICAgICAgICAgICAndHJhY2stb2JqZWN0aXZlJzogdHJ1ZSxcclxuICAgICAgICAgICAgZnJlc2g6IG5vdy5kaWZmKG1vLmxhc3RGbGlwcGVkLCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyaW5nOiBtby5leHBpcmVzLmlzQWZ0ZXIobm93KSAmJiBtby5leHBpcmVzLmRpZmYobm93LCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyZWQ6IG5vdy5pc0FmdGVyKG1vLmV4cGlyZXMpLFxyXG4gICAgICAgICAgICBhY3RpdmU6IG5vdy5pc0JlZm9yZShtby5leHBpcmVzKSxcclxuICAgICAgICB9KX0+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xlZnQnPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1nZW8nPjxBcnJvdyBkaXJlY3Rpb249e2RpcmVjdGlvbn0gLz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLXNwcml0ZSc+PE9iamVjdGl2ZUljb24gY29sb3I9e21vLm93bmVyfSB0eXBlPXttby50eXBlfSAvPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stbmFtZSc+e29NZXRhLm5hbWVbbGFuZy5zbHVnXX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J3JpZ2h0Jz5cclxuICAgICAgICAgICAgICAgIHttby5ndWlsZFxyXG4gICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0cmFjay1ndWlsZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17JyMnICsgbW8uZ3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtndWlsZHNbbW8uZ3VpbGRdID8gYCR7Z3VpbGRzW21vLmd1aWxkXS5uYW1lfSBbJHtndWlsZHNbbW8uZ3VpbGRdLnRhZ31dYCA6ICdMb2FkaW5nLi4uJ31cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17bW8uZ3VpbGR9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stZXhwaXJlJz5cclxuICAgICAgICAgICAgICAgICAgICB7bW8uZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBtb21lbnQobW8uZXhwaXJlcy5kaWZmKG5vdywgJ21pbGxpc2Vjb25kcycpKS5mb3JtYXQoJ206c3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICk7XHJcbn07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgTWF0Y2hNYXAgZnJvbSAnLi9NYXRjaE1hcCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG5cclxuICAgIGlmIChfLmlzRW1wdHkobWF0Y2gpKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFwcyA9IF8ua2V5QnkobWF0Y2gubWFwcywgJ2lkJyk7XHJcbiAgICBjb25zdCBjdXJyZW50TWFwSWRzID0gXy5rZXlzKG1hcHMpO1xyXG4gICAgY29uc3QgbWFwc01ldGFBY3RpdmUgPSBfLmZpbHRlcihcclxuICAgICAgICBTVEFUSUMubWFwc01ldGEsXHJcbiAgICAgICAgbWFwTWV0YSA9PiBfLmluZGV4T2YoY3VycmVudE1hcElkcywgXy5wYXJzZUludChtYXBNZXRhLmlkKSAhPT0gLTEpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9J21hcHMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBtYXBzTWV0YUFjdGl2ZSxcclxuICAgICAgICAgICAgICAgIChtYXBNZXRhKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcCcga2V5PXttYXBNZXRhLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8aDI+e21hcE1ldGEubmFtZX08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaE1hcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e2d1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwTWV0YT17bWFwTWV0YX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hcHNbbWFwTWV0YS5pZF19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTYnPns8TWFwRGV0YWlscyBtYXBLZXk9J0NlbnRlcicgbWFwTWV0YT17Z2V0TWFwTWV0YSgnQ2VudGVyJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0xOCc+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nUmVkSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnUmVkSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0JsdWVIb21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdCbHVlSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0dyZWVuSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnR3JlZW5Ib21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICovIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgU3ByaXRlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL0ljb25zL1Nwcml0ZSc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgaG9sZGluZ3MsXHJcbn0pID0+IChcclxuICAgIDx1bCBjbGFzc05hbWU9J2xpc3QtaW5saW5lJz5cclxuICAgICAgICB7Xy5tYXAoaG9sZGluZ3MsICh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgPGxpIGtleT17dHlwZUluZGV4fT5cclxuICAgICAgICAgICAgICAgIDxTcHJpdGVcclxuICAgICAgICAgICAgICAgICAgICB0eXBlICA9IHt0eXBlSW5kZXh9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncXVhbnRpdHknPnh7dHlwZVF1YW50aXR5fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApfVxyXG4gICAgPC91bD5cclxuKTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IEhvbGRpbmdzIGZyb20gJy4vSG9sZGluZ3MnO1xyXG5cclxuXHJcbmltcG9ydCB7d29ybGRzIGFzIFdPUkxEU30gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuY29uc3QgTG9hZGluZyA9ICgpID0+IChcclxuICAgIDxoMSBzdHlsZT17e2hlaWdodDogJzkwcHgnLCBmb250U2l6ZTogJzMycHQnLCBsaW5lSGVpZ2h0OiAnOTBweCd9fT5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvcixcclxuICAgIGRlYXRocyxcclxuICAgIGlkLFxyXG4gICAgaG9sZGluZ3MsXHJcbiAgICBraWxscyxcclxuICAgIGxhbmcsXHJcbiAgICBzY29yZSxcclxuICAgIHRpY2ssXHJcbn0pID0+IHtcclxuICAgIGNvbnN0IHdvcmxkID0gV09STERTW2lkXVtsYW5nLnNsdWddO1xyXG5cclxuICAgIGlmICghd29ybGQgJiYgXy5pc0VtcHR5KHdvcmxkKSkge1xyXG4gICAgICAgIHJldHVybiA8TG9hZGluZyAvPjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHtjb2xvcn1gfT5cclxuICAgICAgICAgICAgPGgxPjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L2gxPlxyXG4gICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc3RhdHMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBTY29yZSc+e251bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIFRpY2snPntudW1lcmFsKHRpY2spLmZvcm1hdCgnKzAsMCcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge2tpbGxzXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT0nc3ViLXN0YXRzJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIEtpbGxzJz57bnVtZXJhbChraWxscykuZm9ybWF0KCcwLDAnKX1rPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgRGVhdGhzJz57bnVtZXJhbChkZWF0aHMpLmZvcm1hdCgnMCwwJyl9ZDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgIDxIb2xkaW5nc1xyXG4gICAgICAgICAgICAgICAgY29sb3I9e2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgaG9sZGluZ3M9e2hvbGRpbmdzfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi9Xb3JsZCc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBtYXRjaCxcclxuICAgIGxhbmcsXHJcbn0pID0+ICB7XHJcbiAgICBjb25zdCB3b3JsZHNQcm9wcyA9IGdldFdvcmxkc1Byb3BzKG1hdGNoLCBsYW5nKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0ncm93JyBpZD0nc2NvcmVib2FyZHMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICB3b3JsZHNQcm9wcyxcclxuICAgICAgICAgICAgICAgICh3b3JsZFByb3BzKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS04JyBrZXk9e3dvcmxkUHJvcHMuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXb3JsZCB7Li4ud29ybGRQcm9wc30gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRzUHJvcHMobWF0Y2gsIGxhbmcpIHtcclxuICAgIHJldHVybiBfLnJlZHVjZShcclxuICAgICAgICBtYXRjaC53b3JsZHMsXHJcbiAgICAgICAgKGFjYywgd29ybGRJZCwgY29sb3IpID0+IHtcclxuICAgICAgICAgICAgYWNjW2NvbG9yXSA9IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgICAgIGlkOiB3b3JsZElkLFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IF8uZ2V0KG1hdGNoLCBbJ3Njb3JlcycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICBkZWF0aHM6IF8uZ2V0KG1hdGNoLCBbJ2RlYXRocycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICBraWxsczogXy5nZXQobWF0Y2gsIFsna2lsbHMnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAgdGljazogXy5nZXQobWF0Y2gsIFsndGlja3MnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAgaG9sZGluZ3M6IF8uZ2V0KG1hdGNoLCBbJ2hvbGRpbmdzJywgY29sb3JdLCBbXSksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7cmVkOiB7fSwgYmx1ZToge30sIGdyZWVuOiB7fX1cclxuICAgICk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSdsb2Rhc2gnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcblxyXG5cclxuLypcclxuICogICBEYXRhXHJcbiAqL1xyXG5cclxuaW1wb3J0IERBTyBmcm9tICdsaWIvZGF0YS90cmFja2VyJztcclxuXHJcblxyXG5cclxuLypcclxuICogUmVhY3QgQ29tcG9uZW50c1xyXG4gKi9cclxuXHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vU2NvcmVib2FyZCc7XHJcbmltcG9ydCBNYXBzIGZyb20gJy4vTWFwcyc7XHJcbmltcG9ydCBMb2cgZnJvbSAnLi9Mb2cnO1xyXG5pbXBvcnQgR3VpbGRzIGZyb20gJy4vR3VpbGRzJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgdXBkYXRlVGltZUludGVydmFsID0gMTAwMDtcclxuXHJcbmNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4gKFxyXG4gICAgPGgxIGlkPSdBcHBMb2FkaW5nJz5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcz17XHJcbiAgICAgICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgICAgUmVhY3QgTGlmZWN5Y2xlXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcblxyXG5cclxuICAgICAgICBjb25zdCBkYXRhTGlzdGVuZXJzID0ge1xyXG4gICAgICAgICAgICBvbk1hdGNoRGV0YWlsczogdGhpcy5vbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBvbkd1aWxkRGV0YWlsczogdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyhkYXRhTGlzdGVuZXJzKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoYXNEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgbWF0Y2g6IHt9LFxyXG4gICAgICAgICAgICBsb2c6IFtdLFxyXG4gICAgICAgICAgICBndWlsZHM6IHt9LFxyXG4gICAgICAgICAgICBub3c6IG5vdygpLFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzLnNldERhdGUgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgKCkgPT4gdGhpcy5zZXRTdGF0ZSh7bm93OiBub3coKX0pLFxyXG4gICAgICAgICAgICB1cGRhdGVUaW1lSW50ZXJ2YWxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudERpZE1vdW50KCknKTtcclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy53b3JsZCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYFRyYWNrZXI6OmNvbXBvbmVudFdpbGxNb3VudCgpYCk7XHJcbiAgICAgICAgLy8gc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZywgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICB0aGlzLmRhby5zZXRXb3JsZChuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5pc05ld1NlY29uZChuZXh0U3RhdGUpXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3U2Vjb25kKG5leHRTdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5zdGF0ZS5ub3cuaXNTYW1lKG5leHRTdGF0ZS5ub3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnRXaWxsVW5tb3VudCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG5cclxuICAgICAgICB0aGlzLmRhby5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J3RyYWNrZXInPlxyXG5cclxuICAgICAgICAgICAgICAgIHsoIXRoaXMuc3RhdGUuaGFzRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxMb2FkaW5nU3Bpbm5lciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubWF0Y2ggJiYgIV8uaXNFbXB0eSh0aGlzLnN0YXRlLm1hdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxTY29yZWJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubWF0Y2ggJiYgIV8uaXNFbXB0eSh0aGlzLnN0YXRlLm1hdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxNYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5zdGF0ZS5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTI0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZz17dGhpcy5zdGF0ZS5sb2d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17dGhpcy5zdGF0ZS5tYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5zdGF0ZS5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUuZ3VpbGRzICYmICFfLmlzRW1wdHkodGhpcy5zdGF0ZS5ndWlsZHMpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMjQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEd1aWxkcyBndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICAvLyB1cGRhdGVUaW1lcnMoY2IgPSBfLm5vb3ApIHtcclxuICAgIC8vICAgICBpZiAodGhpcy5fX21vdW50ZWQpIHtcclxuICAgIC8vICAgICAgICAgdHJhY2tlclRpbWVycy51cGRhdGUodGhpcy5zdGF0ZS50aW1lLm9mZnNldCwgY2IpO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9fdGltZW91dHMudXBkYXRlVGltZXJzID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCB1cGRhdGVUaW1lSW50ZXJ2YWwpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcblxyXG5cclxuICAgIG9uTWF0Y2hEZXRhaWxzKG1hdGNoKSB7XHJcbiAgICAgICAgY29uc3QgbG9nID0gZ2V0TG9nKG1hdGNoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0RhdGE6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgICAgICBsb2csXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrbm93bkd1aWxkcyA9IF8ua2V5cyh0aGlzLnN0YXRlLmd1aWxkcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSBnZXROZXdDbGFpbXMobG9nLCBrbm93bkd1aWxkcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRhby5ndWlsZHMubG9va3VwKHVua25vd25HdWlsZHMsIHRoaXMub25HdWlsZERldGFpbHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBvbkd1aWxkRGV0YWlscyhndWlsZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xyXG4gICAgICAgICAgICBzdGF0ZS5ndWlsZHNbZ3VpbGQuaWRdID0gZ3VpbGQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge2d1aWxkczogc3RhdGUuZ3VpbGRzfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3coKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICogMTAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgPSBsYW5nLnNsdWc7XHJcbiAgICBjb25zdCB3b3JsZE5hbWUgPSB3b3JsZC5uYW1lO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlICAgICA9IFt3b3JsZE5hbWUsICdndzJ3MncnXTtcclxuXHJcbiAgICBpZiAobGFuZ1NsdWcgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZS5qb2luKCcgLSAnKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMb2cobWF0Y2gpIHtcclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKG1hdGNoLm1hcHMpXHJcbiAgICAgICAgLm1hcCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLmZsYXR0ZW4oKVxyXG4gICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgLnNvcnRCeSgnbGFzdEZsaXBwZWQnKVxyXG4gICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAubWFwKG8gPT4ge1xyXG4gICAgICAgICAgICBvLm1hcElkID0gXy5wYXJzZUludChvLmlkLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICBvLmxhc3Rtb2QgPSBtb21lbnQoby5sYXN0bW9kLCAnWCcpO1xyXG4gICAgICAgICAgICBvLmxhc3RGbGlwcGVkID0gbW9tZW50KG8ubGFzdEZsaXBwZWQsICdYJyk7XHJcbiAgICAgICAgICAgIG8ubGFzdENsYWltZWQgPSBtb21lbnQoby5sYXN0Q2xhaW1lZCwgJ1gnKTtcclxuICAgICAgICAgICAgby5leHBpcmVzID0gbW9tZW50KG8ubGFzdEZsaXBwZWQpLmFkZCg1LCAnbWludXRlcycpO1xyXG4gICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5ld0NsYWltcyhsb2csIGtub3duR3VpbGRzKSB7XHJcbiAgICByZXR1cm4gIF9cclxuICAgICAgICAuY2hhaW4obG9nKVxyXG4gICAgICAgIC5yZWplY3QobyA9PiBfLmlzRW1wdHkoby5ndWlsZCkpXHJcbiAgICAgICAgLm1hcCgnZ3VpbGQnKVxyXG4gICAgICAgIC51bmlxKClcclxuICAgICAgICAuZGlmZmVyZW5jZShrbm93bkd1aWxkcylcclxuICAgICAgICAudmFsdWUoKTtcclxufSIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7c2NvcmVzfSkgPT4gKFxyXG4gICAgPGltZ1xyXG4gICAgICAgIHNyYyA9IHtnZXRJbWFnZVNvdXJjZShzY29yZXMpfVxyXG5cclxuICAgICAgICB3aWR0aCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cHM6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5yZWR9LCR7c2NvcmVzLmJsdWV9LCR7c2NvcmVzLmdyZWVufT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IsXHJcbiAgICB0eXBlLFxyXG59KSA9PiAoXHJcbiAgICA8c3BhbiBjbGFzc05hbWUgPSB7YHNwcml0ZSAke3R5cGV9ICR7Y29sb3J9YH0gLz5cclxuKTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe2RpcmVjdGlvbn0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBpZiAoIWRpcmVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvciA9ICdibGFjaycsXHJcbiAgICB0eXBlLFxyXG4gICAgc2l6ZSxcclxufSkgPT4ge1xyXG4gICAgbGV0IHNyYyA9ICcvaW1nL2ljb25zL2Rpc3QvJztcclxuICAgIHNyYyArPSB0eXBlO1xyXG4gICAgaWYgKGNvbG9yICE9PSAnYmxhY2snKSB7XHJcbiAgICAgICAgc3JjICs9ICctJyArIGNvbG9yO1xyXG4gICAgfVxyXG4gICAgc3JjICs9ICcuc3ZnJztcclxuXHJcbiAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgIHNyYz17c3JjfVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGljb24tb2JqZWN0aXZlIGljb24tb2JqZWN0aXZlLSR7dHlwZX1gfVxyXG4gICAgICAgIHdpZHRoPXtzaXplID8gc2l6ZTogbnVsbH1cclxuICAgICAgICBoZWlnaHQ9e3NpemUgPyBzaXplOiBudWxsfVxyXG4gICAgLz47XHJcbn07IiwiXHJcbi8qXHJcbiogICBHZW5lcmljXHJcbiovXHJcblxyXG4vLyByb3V0ZXNcclxuZXhwb3J0IGNvbnN0IFNFVF9ST1VURSA9ICdTRVRfUk9VVEUnO1xyXG5cclxuLy8gdGltZW91dHNcclxuZXhwb3J0IGNvbnN0IEFERF9USU1FT1VUID0gJ0FERF9USU1FT1VUJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9USU1FT1VUID0gJ1JFTU9WRV9USU1FT1VUJztcclxuLy8gZXhwb3J0IGNvbnN0IFJFTU9WRV9BTExfVElNRU9VVFMgPSAnUkVNT1ZFX0FMTF9USU1FT1VUUyc7XHJcblxyXG4vLyB3b3JsZHNcclxuZXhwb3J0IGNvbnN0IFNFVF9XT1JMRCA9ICdTRVRfV09STEQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfV09STEQgPSAnQ0xFQVJfV09STEQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgQVBJXHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgQVBJX1JFUVVFU1RfT1BFTiA9ICdBUElfUkVRVUVTVF9PUEVOJztcclxuZXhwb3J0IGNvbnN0IEFQSV9SRVFVRVNUX1NVQ0NFU1MgPSAnQVBJX1JFUVVFU1RfU1VDQ0VTUyc7XHJcbmV4cG9ydCBjb25zdCBBUElfUkVRVUVTVF9GQUlMRUQgPSAnQVBJX1JFUVVFU1RfRkFJTEVEJztcclxuXHJcblxyXG5cclxuLypcclxuKiAgIE92ZXJ2aWV3XHJcbiovXHJcblxyXG4vLyBtYXRjaGVzXHJcbmV4cG9ydCBjb25zdCBSRUNFSVZFX01BVENIRVMgPSAnUkVDRUlWRV9NQVRDSEVTJztcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQgPSAnUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBUcmFja2VyXHJcbiovIiwiXHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVyYWdlbnQnO1xyXG5cclxuY29uc3Qgbm9vcCA9ICgpID0+IG51bGw7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoQnlXb3JsZFNsdWcsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRJZCxcclxuICAgIGdldEd1aWxkQnlJZCxcclxufTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hlcyh7XHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hlcygpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzYClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZFNsdWcoe1xyXG4gICAgd29ybGRTbHVnLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZFNsdWcoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZFNsdWd9YClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgIHdvcmxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hCeVdvcmxkSWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRHdWlsZEJ5SWQoe1xyXG4gICAgZ3VpbGRJZCxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRHdWlsZEJ5SWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24/Z3VpbGRfaWQ9JHtndWlsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25SZXF1ZXN0KGNhbGxiYWNrcywgZXJyLCByZXMpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6Om9uUmVxdWVzdCgpJywgZXJyLCByZXMgJiYgcmVzLmJvZHkpO1xyXG5cclxuICAgIGlmIChlcnIgfHwgcmVzLmVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLmVycm9yKGVycik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjYWxsYmFja3Muc3VjY2VzcyhyZXMuYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2tzLmNvbXBsZXRlKCk7XHJcbn0iLCJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJztcclxuXHJcbmltcG9ydCAqIGFzIGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBNb2R1bGUgR2xvYmFsc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IE5VTV9RVUVVRV9DT05DVVJSRU5UID0gNDtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFB1YmxpYyBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGliR3VpbGRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgICB0aGlzLl9fYXN5bmNHdWlsZFF1ZXVlID0gYXN5bmMucXVldWUoXHJcbiAgICAgICAgICAgIGdldEd1aWxkRGV0YWlsc0Zyb21RdWV1ZSxcclxuICAgICAgICAgICAgTlVNX1FVRVVFX0NPTkNVUlJFTlRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsb29rdXAoZ3VpbGRzLCBvbkRhdGFMaXN0ZW5lcikge1xyXG4gICAgICAgIGNvbnN0IHRvUXVldWUgPSBfLm1hcChcclxuICAgICAgICAgICAgZ3VpbGRzLFxyXG4gICAgICAgICAgICBndWlsZElkID0+ICh7XHJcbiAgICAgICAgICAgICAgICBndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgb25EYXRhOiBvbkRhdGFMaXN0ZW5lcixcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX2FzeW5jR3VpbGRRdWV1ZS5wdXNoKHRvUXVldWUpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHNGcm9tUXVldWUoY2FyZ28sIG9uQ29tcGxldGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRHdWlsZERldGFpbHNGcm9tUXVldWUnLCBjYXJnbywgY2FyZ28uZ3VpbGRJZCk7XHJcblxyXG4gICAgYXBpLmdldEd1aWxkQnlJZCh7XHJcbiAgICAgICAgZ3VpbGRJZDogY2FyZ28uZ3VpbGRJZCxcclxuICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4gb25HdWlsZERhdGEoZGF0YSwgY2FyZ28pLFxyXG4gICAgICAgIGNvbXBsZXRlOiBvbkNvbXBsZXRlLFxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEoZGF0YSwgY2FyZ28pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvbkd1aWxkRGF0YScsIGRhdGEpO1xyXG5cclxuICAgIGlmIChkYXRhICYmICFfLmlzRW1wdHkoZGF0YSkpIHtcclxuICAgICAgICBjYXJnby5vbkRhdGEoe1xyXG4gICAgICAgICAgICBpZDogZGF0YS5ndWlsZF9pZCxcclxuICAgICAgICAgICAgbmFtZTogZGF0YS5ndWlsZF9uYW1lLFxyXG4gICAgICAgICAgICB0YWc6IGRhdGEudGFnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgR3VpbGRzREFPIGZyb20gJy4vZ3VpbGRzJztcclxuaW1wb3J0IGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdmVydmlld0RhdGFQcm92aWRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y29uc3RydWN0b3IoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGFuZ1NsdWcgID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9fd29ybGRTbHVnID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ndWlsZHMgICAgICA9IG5ldyBHdWlsZHNEQU8oKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCh3b3JsZCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmluaXQoKScsIGxhbmcsIHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRXb3JsZCh3b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFdvcmxkKHdvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5fX3dvcmxkSWQgPSB3b3JsZC5pZDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0TWF0Y2hXb3JsZHMobWF0Y2gpIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoXHJcbiAgICAgICAgICAgIHtyZWQ6IHt9LCBibHVlOiB7fSwgZ3JlZW46IHt9fSxcclxuICAgICAgICAgICAgKGosIGNvbG9yKSA9PiBnZXRNYXRjaFdvcmxkKG1hdGNoLCBjb2xvcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19nZXREYXRhKCknKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGFwaS5nZXRNYXRjaEJ5V29ybGRTbHVnKHtcclxuICAgICAgICAvLyAgICAgd29ybGRTbHVnOiB0aGlzLl9fd29ybGRTbHVnLFxyXG4gICAgICAgIC8vICAgICBzdWNjZXNzOiAoZGF0YSkgPT4gdGhpcy5fX29uTWF0Y2hEZXRhaWxzKGRhdGEpLFxyXG4gICAgICAgIC8vICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCksXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgYXBpLmdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgICAgICAgICAgd29ybGRJZDogdGhpcy5fX3dvcmxkSWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB0aGlzLl9fb25NYXRjaERldGFpbHMoZGF0YSksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB0aGlzLl9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERldGFpbHMoZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6Ol9fb25NYXRjaERhdGEoKScsIGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAoZGF0YSAmJiAhXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERldGFpbHMoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAgKiA0LCAxMDAwICogOCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXRhIHJlZnJlc2g6ICcsIHJlZnJlc2hUaW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzLmRhdGEgPSBzZXRUaW1lb3V0KHRoaXMuX19nZXREYXRhLmJpbmQodGhpcyksIHJlZnJlc2hUaW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiAgIFdvcmxkc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hXb3JsZChtYXRjaCwgY29sb3IpIHtcclxuICAgIGNvbnN0IHdvcmxkSWQgPSBtYXRjaC53b3JsZHNbY29sb3JdLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgY29uc3Qgd29ybGQgPSBfLm1lcmdlKFxyXG4gICAgICAgIHtjb2xvcjogY29sb3J9LFxyXG4gICAgICAgIFNUQVRJQy53b3JsZHNbd29ybGRJZF1cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgU1RBVElDX0xBTkdTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncyc7XHJcbmltcG9ydCBTVEFUSUNfV09STERTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcyc7XHJcbmltcG9ydCBTVEFUSUNfT0JKRUNUSVZFUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQnO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkW2xhbmdTbHVnXS5zbHVnXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXMgPSBTVEFUSUNfT0JKRUNUSVZFUztcclxuZXhwb3J0IGNvbnN0IGxhbmdzID0gU1RBVElDX0xBTkdTO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB3b3JsZHMgPSBfXHJcbiAgICAuY2hhaW4oU1RBVElDX1dPUkxEUylcclxuICAgIC5rZXlCeSgnaWQnKVxyXG4gICAgLm1hcFZhbHVlcygod29ybGQpID0+IHtcclxuICAgICAgICBfLmZvckVhY2goXHJcbiAgICAgICAgICAgIFNUQVRJQ19MQU5HUyxcclxuICAgICAgICAgICAgKGxhbmcpID0+XHJcbiAgICAgICAgICAgIHdvcmxkW2xhbmcuc2x1Z10ubGluayA9IGdldFdvcmxkTGluayhsYW5nLnNsdWcsIHdvcmxkKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHdvcmxkO1xyXG4gICAgfSlcclxuICAgIC52YWx1ZSgpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlc01ldGEgPSBfLmtleUJ5KFtcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAxLCBpZDogJzknLCBkaXJlY3Rpb246ICcnfSwgICAgICAgICAgLy8gc3RvbmVtaXN0XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgIC8vIG92ZXJsb29rXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzIwJywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgLy8gdmVsb2thXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxOCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgIC8vIGFuelxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICc2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgIC8vIHNwZWxkYW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzUnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAgLy8gcGFuZ1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE1JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gbGFuZ29yXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyMicsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGJyYXZvc3RcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMjEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBkdXJpb3NcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzcnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gZGFuZVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBsb3dsYW5kc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTEnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBhbGRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEyJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gd2lsZGNyZWVrXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGtsb3ZhblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzQnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gZ29sYW50YVxyXG5cclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTMnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgIC8vIHJhbXBhcnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMDYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgIC8vIHVuZGVyY3JvZnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgIC8vIHBhbGFjZVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwMicsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gYWNhZGVteVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwNCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gbmVjcm9wb2xpc1xyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzk5JywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gbGFiXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTE1JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBoaWRlYXdheVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwOScsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gcmVmdWdlXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTEwJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBvdXRwb3N0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTA1JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBkZXBvdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwMScsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gZW5jYW1wXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTAwJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBmYXJtXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTE2JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAvLyB3ZWxsXHJcbl0sICdpZCcpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWFwc01ldGEgPSBbXHJcbiAgICB7aWQ6IDM4LCBuYW1lOiAnRXRlcm5hbCBCYXR0bGVncm91bmRzJywgYWJicjogJ0VCJ30sXHJcbiAgICB7aWQ6IDEwOTksIG5hbWU6ICdSZWQgQm9yZGVybGFuZHMnLCBhYmJyOiAnUmVkJ30sXHJcbiAgICB7aWQ6IDExMDIsIG5hbWU6ICdHcmVlbiBCb3JkZXJsYW5kcycsIGFiYnI6ICdHcm4nfSxcclxuICAgIHtpZDogMTE0MywgbmFtZTogJ0JsdWUgQm9yZGVybGFuZHMnLCBhYmJyOiAnQmx1J30sXHJcbl07XHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXNHZW8gPSB7XHJcbiAgICBlYjogW1tcclxuICAgICAgICB7aWQ6ICc5JywgZGlyZWN0aW9uOiAnJ30sICAgICAgICAgIC8vIHN0b25lbWlzdFxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAgLy8gb3Zlcmxvb2tcclxuICAgICAgICB7aWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgICAgICB7aWQ6ICcyMCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgIC8vIHZlbG9rYVxyXG4gICAgICAgIHtpZDogJzE4JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgLy8gYW56XHJcbiAgICAgICAge2lkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICAgICAge2lkOiAnNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgICAvLyBzcGVsZGFuXHJcbiAgICAgICAge2lkOiAnNScsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgICAvLyBwYW5nXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgICAgICB7aWQ6ICcxNScsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGxhbmdvclxyXG4gICAgICAgIHtpZDogJzIyJywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8gYnJhdm9zdFxyXG4gICAgICAgIHtpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAgICAgIHtpZDogJzIxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gZHVyaW9zXHJcbiAgICAgICAge2lkOiAnNycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBkYW5lXHJcbiAgICAgICAge2lkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzMnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gbG93bGFuZHNcclxuICAgICAgICB7aWQ6ICcxMScsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIGFsZG9uc1xyXG4gICAgICAgIHtpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgICAgICB7aWQ6ICcxMicsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIHdpbGRjcmVla1xyXG4gICAgICAgIHtpZDogJzE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8ga2xvdmFuXHJcbiAgICAgICAge2lkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgICAgICB7aWQ6ICc0JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIGdvbGFudGFcclxuICAgIF1dLFxyXG4gICAgYmwyOiBbW1xyXG4gICAgICAgIHtpZDogJzExMycsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgLy8gcmFtcGFydFxyXG4gICAgICAgIHtpZDogJzEwNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgLy8gdW5kZXJjcm9mdFxyXG4gICAgICAgIHtpZDogJzExNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgLy8gcGFsYWNlXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMTAyJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBhY2FkZW15XHJcbiAgICAgICAge2lkOiAnMTA0JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyBuZWNyb3BvbGlzXHJcbiAgICAgICAge2lkOiAnOTknLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBsYWJcclxuICAgICAgICB7aWQ6ICcxMTUnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGhpZGVhd2F5XHJcbiAgICAgICAge2lkOiAnMTA5JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyByZWZ1Z2VcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxMTAnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIG91dHBvc3RcclxuICAgICAgICB7aWQ6ICcxMDUnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGRlcG90XHJcbiAgICAgICAge2lkOiAnMTAxJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBlbmNhbXBcclxuICAgICAgICB7aWQ6ICcxMDAnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGZhcm1cclxuICAgICAgICB7aWQ6ICcxMTYnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgIC8vIHdlbGxcclxuICAgIF1dLFxyXG59O1xyXG4iLCJpbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ2V0V29ybGRGcm9tU2x1ZygpJywgbGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4gICAgY29uc3Qgd29ybGQgPSBfLmZpbmQoXHJcbiAgICAgICAgd29ybGRzLFxyXG4gICAgICAgIHcgPT4gd1tsYW5nU2x1Z10uc2x1ZyA9PT0gd29ybGRTbHVnXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQ6IHdvcmxkLmlkLFxyXG4gICAgICAgIC4uLndvcmxkW2xhbmdTbHVnXSxcclxuICAgIH07XHJcbn0iLCJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIEFQSV9SRVFVRVNUX09QRU4sXHJcbiAgICBBUElfUkVRVUVTVF9TVUNDRVNTLFxyXG4gICAgQVBJX1JFUVVFU1RfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICBwZW5kaW5nOiBbXSxcclxufTtcclxuXHJcblxyXG5jb25zdCBhcGkgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OmFwaScsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBBUElfUkVRVUVTVF9PUEVOOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6YXBpJywgYWN0aW9uLnR5cGUsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nOiBbYWN0aW9uLnJlcXVlc3RLZXksIC4uLnN0YXRlLnBlbmRpbmddLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYXNlIEFQSV9SRVFVRVNUX1NVQ0NFU1M6XHJcbiAgICAgICAgY2FzZSBBUElfUkVRVUVTVF9GQUlMRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjphcGknLCBhY3Rpb24udHlwZSwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIHBlbmRpbmc6IF8ud2l0aG91dChzdGF0ZS5wZW5kaW5nLCBhY3Rpb24ucmVxdWVzdEtleSksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFwaTsiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XHJcblxyXG5pbXBvcnQgYXBpIGZyb20gJy4vYXBpJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnLi9sYW5nJztcclxuaW1wb3J0IG1hdGNoZXMgZnJvbSAnLi9tYXRjaGVzJztcclxuaW1wb3J0IHJvdXRlIGZyb20gJy4vcm91dGUnO1xyXG5pbXBvcnQgdGltZW91dHMgZnJvbSAnLi90aW1lb3V0cyc7XHJcbmltcG9ydCB3b3JsZCBmcm9tICcuL3dvcmxkJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGFwaSxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaGVzLFxyXG4gICAgcm91dGUsXHJcbiAgICB0aW1lb3V0cyxcclxuICAgIHdvcmxkLFxyXG59KTsiLCJcclxuY29uc3QgU0VUX0xBTkcgPSAnU0VUX0xBTkcnO1xyXG5cclxuXHJcbmltcG9ydCB7IGxhbmdzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5jb25zdCBkZWZhdWx0U2x1ZyA9ICdlbic7XHJcbmNvbnN0IGRlZmF1bHRMYW5nID0gbGFuZ3NbZGVmYXVsdFNsdWddO1xyXG5cclxuXHJcbmNvbnN0IGxhbmcgPSAoc3RhdGUgPSBkZWZhdWx0TGFuZywgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfTEFORzpcclxuICAgICAgICAgICAgcmV0dXJuIGxhbmdzW2FjdGlvbi5zbHVnXTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGFuZzsiLCJcclxuaW1wb3J0IHtcclxuICAgIFJFQ0VJVkVfTUFUQ0hFUyxcclxuICAgIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgZGF0YToge30sXHJcbiAgICBpZHM6IFtdLFxyXG4gICAgbGFzdFVwZGF0ZWQ6IDAsXHJcbn07XHJcblxyXG5cclxuY29uc3QgbWF0Y2hlcyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX01BVENIRVM6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgUkVDRUlWRV9NQVRDSEVTLCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogYWN0aW9uLmRhdGEsXHJcbiAgICAgICAgICAgICAgICBpZHM6IE9iamVjdC5rZXlzKGFjdGlvbi5kYXRhKS5zb3J0KCksXHJcbiAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogYWN0aW9uLmxhc3RVcGRhdGVkLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3IsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1hdGNoZXM7IiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfUk9VVEUsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICBwYXRoOiAnLycsXHJcbiAgICBwYXJhbXM6IHt9LFxyXG59O1xyXG5cclxuY29uc3Qgcm91dGUgPSAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX1JPVVRFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IGFjdGlvbi5wYXJhbXMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlO1xyXG4iLCJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBRERfVElNRU9VVCxcclxuICAgIFJFTU9WRV9USU1FT1VULFxyXG4gICAgLy8gUkVNT1ZFX0FMTF9USU1FT1VUUyxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5jb25zdCB0aW1lb3V0cyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEFERF9USU1FT1VUOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6dGltZW91dHMnLCBBRERfVElNRU9VVCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIFthY3Rpb24ubmFtZV06IGFjdGlvbi5yZWYsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGNhc2UgUkVNT1ZFX1RJTUVPVVQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIFJFTU9WRV9USU1FT1VULCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIF8ub21pdChzdGF0ZSwgYWN0aW9uLm5hbWUpO1xyXG5cclxuICAgICAgICAvLyBjYXNlIFJFTU9WRV9BTExfVElNRU9VVFM6XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIFJFTU9WRV9BTExfVElNRU9VVFMsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgIC8vICAgICByZXR1cm4ge307XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRpbWVvdXRzOyIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1dPUkxELFxyXG4gICAgQ0xFQVJfV09STEQsXHJcbn0gZnJvbSAnY29uc3RhbnRzL2FjdGlvblR5cGVzJztcclxuXHJcbmltcG9ydCB7IGdldFdvcmxkRnJvbVNsdWcgfSBmcm9tICdsaWIvd29ybGRzJztcclxuXHJcblxyXG5jb25zdCB3b3JsZCA9IChzdGF0ZSA9IG51bGwsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX1dPUkxEOlxyXG4gICAgICAgICAgICByZXR1cm4gZ2V0V29ybGRGcm9tU2x1ZyhhY3Rpb24ubGFuZ1NsdWcsIGFjdGlvbi53b3JsZFNsdWcpO1xyXG5cclxuICAgICAgICBjYXNlIENMRUFSX1dPUkxEOlxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdvcmxkOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcIjEwOTktOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhbW0ncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIEhhbW1cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhbW1zIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBIYW1tXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDg2NCwgOTU1OS40OV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxlc2gncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIExlc2hcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxlc2hzIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBMZXNoXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNzkuOTUsIDEyMTE5LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJaYWtrJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBaYWtrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaYWtrcyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgWmFra1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0NDQ4LCAxMTQ3OS41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXVlciBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCYXVlci1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBCYXVlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3OTMuNywgMTEyNTguNF1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmFycmV0dCBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhcnJldHRcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJhcnJldHQtR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgQmFycmV0dFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQ1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjA5LjcxLCAxMzgxOC40XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHZWUgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBHZWVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdlZS1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBHZWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM3Ny43LCAxMzE3OC40XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJNY0xhaW4ncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIE1jTGFpblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTWNMYWlucyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIE1jTGFpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTcxMi44LCAxMTI2My41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXRyaWNrJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBQYXRyaWNrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYXRyaWNrcyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIFBhdHJpY2tcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjEyOC44LCAxMzgyMy41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYWJpYidzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgSGFiaWJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhYmlicyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGQnSGFiaWJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzI5Ni44LCAxMzE4My41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPJ2RlbCBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBPJ2RlbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTydkZWwtQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBPJ2RlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4MzIuNCwgOTU5NC42M11cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiWSdsYW4gQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgWSdsYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlknbGFuLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgWSdsYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNDguNCwgMTIxNTQuNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiS2F5J2xpIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIEtheSdsaVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS2F5J2xpLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgS2F5J2xpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDE2LjQsIDExNTE0LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkV0ZXJuYWwgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgRXRlcm5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFd2lnZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgw6l0ZXJuZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExODAyLjcsIDk2NjQuNzVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlYXRobGVzcyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbm1vcnRhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVG9kbG9zZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1tb3J0ZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIxOC43MiwgMTIyMjQuN11cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVW5keWluZyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbXBlcmVjZWRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuc3RlcmJsaWNoZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1ww6lyaXNzYWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM4Ni43LCAxMTU4NC43XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDcmFua3NoYWZ0IERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgUGFsYW5jYW1hbmlqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkt1cmJlbHdlbGxlbi1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBWaWxlYnJlcXVpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY0LjMsIDExNjA5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwYXJrcGx1ZyBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIEJ1asOtYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlrDvG5kZnVua2VuLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IEJvdWdpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzY4MC4zMiwgMTQxNjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmx5d2hlZWwgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBWb2xhbnRlc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2Nod3VuZ3JhZC1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBFbmdyZW5hZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzMixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQ4NDguMywgMTM1MjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmxpc3RlcmluZyBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIEFjaGljaGFycmFudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJyZW5uZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGVtYnJhc8OpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTg1NC41OCwgMTA1NzguNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2NvcmNoaW5nIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gQWJyYXNhZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZXJzZW5nZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGN1aXNhbnRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNzAuNTgsIDEzMTM4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRvcnJpZCBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIFNvZm9jYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2zDvGhlbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgdG9ycmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDM4LjYsIDEyNDk4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzExLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEyMDIyLjUsIDExNzg5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzEwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODQzOC40OSwgMTQzNDkuOV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1NjA2LjUsIDEzNzA5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk2NDEuNywgMTE3NDkuNl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MDU3LjcsIDE0MzA5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzIyNS43LCAxMzY2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb3kncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgUm95XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3lzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgUm95XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTk1NC42LCAxMDA2OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJOb3Jmb2xrJ3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIE5vcmZvbGtcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5vcmZvbGtzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgTm9yZm9sa1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MzcwLjYsIDEyNjI4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9saXZpZXIncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgT2xpdmllclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2xpdmllcnMgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkJ09saXZpZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTUzOC42LCAxMTk4OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXJjaGVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBBYnJhc2Fkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVyZMO2cnJ0ZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6l2YXN0w6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDI1NSwgMTE1NzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldpdGhlcmVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBEZXNvbGFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2Vsa2VyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgcmF2YWfDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjY3MS4wNSwgMTQxMzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhcnJlbiBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gQWJhbmRvbmFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5ZkZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6lsYWJyw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM4MzksIDEzNDk2XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9pYyBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVzdG9pY2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0b2lzY2hlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgc3Rvw69xdWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwODEyLjMsIDEwMTAyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkltcGFzc2l2ZSBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEltcGVydHVyYmFibGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuYmVlaW5kcnVja3RlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgaW1wYXNzaWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjI4LjMyLCAxMjY2Mi45XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYXJkZW5lZCBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVuZHVyZWNpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0YWhsaGFydGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBkdXJjaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0Mzk2LjMsIDEyMDIyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9zcHJleSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgw4FndWlsYSBQZXNjYWRvcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZpc2NoYWRsZXItUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgYmFsYnV6YXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc4OCwgMTA2NjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFycmllcidzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWd1aWx1Y2hvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWloZW4tUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgY2lyY2HDqHRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMDQsIDEzMjIwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNocmlrZSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWxjYXVkw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXw7xyZ2VyLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGRlIGxhIHBpZS1ncmnDqGNoZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1MzcyLCAxMjU4MC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb2V0dGlnZXIncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBCb2V0dGlnZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJvZXR0aWdlcnMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEJvZXR0aWdlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTU4NS45LCAxMDAzNy4xXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIdWdoZSdzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEh1Z2hlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIdWdoZXMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEh1Z2hlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYwMDEuOSwgMTI1OTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmVyZHJvdydzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEJlcmRyb3dcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJlcmRyb3dzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBCZXJkcm93XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMxNjkuOSwgMTE5NTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHVzdHdoaXNwZXIgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgTXVybXVsbG8gZGUgUG9sdm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVzIFN0YXViZmzDvHN0ZXJuc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgU291ZmZsZS1wb3Vzc2nDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDc3My4zLCAxMTY1Mi41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTbWFzaGVkaG9wZSBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIFRyYWdhZXNwZXJhbnphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlciBaZXJzY2hsYWdlbmVuIEhvZmZudW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBSw6p2ZS1icmlzw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzOCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzE4OS4yOSwgMTQyMTIuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFzdGdhc3AgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgw5psdGltbyBTdXNwaXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlcyBMZXR6dGVuIFNjaG5hdWZlcnNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IERlcm5pZXItc291cGlyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQzNTcuMywgMTM1NzIuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNTkwLjIsIDkxNjkuMTldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcwMDYuMTksIDExNzI5LjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQxNzQuMiwgMTEwODkuMl1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmFpdGhsZWFwXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhdXQgZGUgbGEgRm9pXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NDE3LjM5LCAxNDc5MC43XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhlbGRlbmhhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC02MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTYyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBdWZzdGllZ3NidWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRlciBHZWlzdGhvbG1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxlIEhlYXVtZSBzcGlyaXR1ZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmxvb2tcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk1pcmFkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0IHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCZWx2w6lkw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDY5OC40LCAxMzc2MV1cclxuICAgIH0sXHJcbiAgICBcIjM4LTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxhbmdvci1TY2hsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTQ2NS4zLCAxNTU2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgYmFqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRpZWZsYW5kIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCYXNzZXMgdGVycmVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0OCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4NDAuMjUsIDE0OTgzLjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5Mi43LCAxMzQxMC44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlZlcnQtYnJ1ecOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTY0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5OTYuNCwgMTU1NDUuOF1cclxuICAgIH0sXHJcbiAgICBcIjk2LTI3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTAzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTAzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvb2RoYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2FsZC1GcmVpc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvaXNyZWZ1Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTQxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNoYWRhcmFuLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgU2hhZGFyYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTMyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFdGhlcm9uLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTUtNTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcmFzIGR1IFRpdGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS03NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC05XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FzdGxlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNjI3LjMsIDE0NTAxLjNdXHJcbiAgICB9LFxyXG4gICAgXCI5NS01N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNyYWd0b3BcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyb2ZmZ2lwZmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTb21tZXQgZGUgSGF1dGNyYWdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjAxLjYsIDEzNzE4LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTMzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NS00MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZGxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgcm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMjFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjA3LjEsIDE0NTk1XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGb2doYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5lYmVsLUZyZWlzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHdhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG5zZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyB2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVsb2thLUhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEwMTcuNCwgMTM0MTQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwtQnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWVicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXVzdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcnV5YXp1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyMTkuNSwgMTUxMDcuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzU3LjA2LCAxNTQ2Ny44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMzhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMb25ndmlld1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlaXRzaWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTG9uZ3VldnVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC02XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTcGVsZGFuLUthaGxzY2hsYWdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzM5LjgxLCAxMzU4Ni45XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEYXMgR290dGVzc2Nod2VydFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC02NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmFsbGV5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJWYWxsZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGFsIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBWYWxsw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY4LjksIDE1MDg3LjddXHJcbiAgICB9LFxyXG4gICAgXCI5NS00N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN1bm55aGlsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNvbm5lbmjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNjdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC01M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGV2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG50YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXaWxkYmFjaC1TdHJlY2tlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaXN0ZSBkdSBydWlzc2VhdSBzYXV2YWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5OTU4LjIzLCAxNDYwNS43XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWRicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemFycm9qYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTExXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTExXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTcxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNzFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJRdWVudGluLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTUxLjgsIDE1MTIxLjJdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3NTAuMiwgMTQ4NTkuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIEJsZXV2YWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk2NSwgMTM5NTFdXHJcbiAgICB9LFxyXG4gICAgXCI5NS03NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTczXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXN0cmFsaG9sbVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGVhdW1lIGFzdHJhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTY2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC00XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5OC45LCAxNTUyMC4yXVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTaWVnZXItSGFsbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhdmlsbG9uIGR1IFZhaW5xdWV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTI4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmTDpG1tZXJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlcGFpcmUgZGUgbCdhdWJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni01OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTU5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcnJvam9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTM2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZWxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29henVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgYmxldVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1d2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC04XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTY4MC45LCAxNDM1My42XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNzBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni03MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTYwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0YXJncm92ZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3Rlcm5oYWluXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb3NxdWV0IMOpdG9pbMOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTQwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlbHN3YW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTYxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBiYWphcyBkZSBBZ3VhdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xud2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtMjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXNrYWxpb24tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTc0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FycmnDqHJlIGR1IHZvbGV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NjEyLjU0LCAxNDQ2Mi44XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVzbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhdHJpbW9uaW8gZGVsIENhbXBlw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJDaGFtcGlvbnMgTGFuZHNpdHpcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZpZWYgZHUgQ2hhbXBpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyNDMuMywgMTM5NzQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTcyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni01OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHb2RzbG9yZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHb3R0ZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYXZvaXIgZGl2aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIld1cm0gVHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUw7puZWwgZGUgbGEgU2llcnBlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXdXJtdHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUdW5uZWwgZGUgZ3VpdnJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2NzUwLjkyLCAxMDIxMS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvMDg3NDkxQ0RENTZGN0ZCOTk4QzMzMjM2MEQzMkZEMjZBOEIyQTk5RC83MzA0MjgucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBaXJwb3J0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZXJvcHVlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGbHVnaGFmZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkHDqXJvcG9ydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzA1NC4xNiwgMTA0MjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9BQ0NDQjFCRDYxNzU5OEMwRUE5Qzc1NkVBREU1M0RGMzZDMjU3OEVDLzczMDQyNy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRodW5kZXIgSG9sbG93IFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgSG9uZG9uYWRhIGRlbCBUcnVlbm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRvbm5lcnNlbmtlbnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBUb25uZWNyZXZhc3NlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODI4Mi43NywgMTA0MjUuOV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRm9yZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZvcmphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2htaWVkZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9yZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMjMuNjQsIDEwNjkyLjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EMUFCNTQxRkMzQkUxMkFDNUJCQjAyMDIxMkJFQkUzRjVDMEM0MzE1LzczMDQxNS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRmFubyBHaWdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDnGJlcnd1Y2hlcnRlciBHb3R0ZXNoYXVzLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBUZW1wbGUgc3VyZGltZW5zaW9ubsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUxMy44MywgOTA1OS45Nl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hyaW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYW50dWFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJlaW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhbmN0dWFpcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg2MTQuODksIDEwMjQ2LjRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9CNTcwOTk0MUIwMzUyRkQ0Q0EzQjdBRkRBNDI4NzNEOEVGREIxNUFELzczMDQxNC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF1dGVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjQwLjY2LCA5MjUzLjldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EQzAxRUM0MUQ4ODA5QjU5Qjg1QkVFREM0NUU5NTU2RDczMEJEMjFBLzczMDQxMy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvcmtzaG9wXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUYWxsZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlcmtzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXRlbGllclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgzNy42LCAxMDg0NS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQjM0QzJFM0QwRjM0RkQwM0Y0NEJCNUVENEUxOERDREQwMDU5QTVDNC83MzA0MjkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmlkIEZvcnRyZXNzIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ3JlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBsYSBGb3J0ZXJlc3NlIGFyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgyMy44MywgMTA0NzkuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgQWd1amEgZGUgTWlyYXBpZWRyYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZWluYmxpY2stWmFja2Vuc3RhYnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNDkuMjEsIDk3NjMuODddLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJlbGwgVG93ZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbmFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsb2NrZW50dXJtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDbG9jaGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MTgwLjY4LCAxMDMyNS4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDQxODA3NzRERDAzQTRCQzcyNTJCOTUyNjgwRTQ1MUYxNjY3OUE3Mi83MzA0MTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPYnNlcnZhdG9yeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiT2JzZXJ2YXRvcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPYnNlcnZhdG9yaXVtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJPYnNlcnZhdG9pcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc5NTMuNjcsIDkwNjIuNzldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8wMTVDRjE2Qzc4REZEQUQ3NDJFMUE1NjEzRkI3NEI2NDYzQkY0QTcwLzczMDQxMS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGYW5vIEdpZ2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOcYmVyd3VjaGVydGVzIEdvdHRlc2hhdXNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlRlbXBsZSBzdXJkaW1lbnNpb25uw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc2MDYuNywgODg4Mi4xNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJpZCBGb3J0cmVzc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9ydGVyZXNzZSBhcmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjQ0Mi4xNywgMTA4ODEuOF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQZXJjaGEgZGUgVHl0b25lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUeXRvbmVud2FydGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBlcmNob2lyIGRlIFR5dG9uZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc4ODQuODEsIDk4MDkuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGh1bmRlciBIb2xsb3dcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZWwgVHJ1ZW5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEb25uZXJzZW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVG9ubmVjcmV2YXNzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODUwNi43NSwgMTA4MjQuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgUGVyY2hhIGRlIFR5dG9uZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHl0b25lbndhcnRlLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQZXJjaG9pciBkZSBUeXRvbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3ODUyLjg5LCA5ODU1LjU2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbmZlcm5vJ3MgTmVlZGxlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWlndWlsbGUgaW5mZXJuYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUwNC44NCwgMTA1OTguNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZSBNaXJhcGllZHJhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RlaW5ibGljay1aYWNrZW5zdGFiXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcxNjQuNDYsIDk4MDUuMTVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkluZmVybm8ncyBOZWVkbGUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbC1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgbCdBaWd1aWxsZSBpbmZlcm5hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NixcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTgxLjkxLCAxMDMxNi40XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdGF0dWFyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXN0YXR1YXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RhdHVlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTdGF0dWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1NTMuMTIsIDkzNjAuMTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS80QzAxMTNCNkRGMkU0RTJDQkI5MzI0NEFENTBEQTQ5NDU2RDUwMTRFLzczMDQxMi5wbmdcIlxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJhdGNoQWN0aW9ucyA9IGJhdGNoQWN0aW9ucztcbmV4cG9ydHMuZW5hYmxlQmF0Y2hpbmcgPSBlbmFibGVCYXRjaGluZztcbnZhciBCQVRDSCA9ICdCQVRDSElOR19SRURVQ0VSLkJBVENIJztcblxuZXhwb3J0cy5CQVRDSCA9IEJBVENIO1xuXG5mdW5jdGlvbiBiYXRjaEFjdGlvbnMoYWN0aW9ucykge1xuXHRyZXR1cm4geyB0eXBlOiBCQVRDSCwgcGF5bG9hZDogYWN0aW9ucyB9O1xufVxuXG5mdW5jdGlvbiBlbmFibGVCYXRjaGluZyhyZWR1Y2UpIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGJhdGNoaW5nUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG5cdFx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXHRcdFx0Y2FzZSBCQVRDSDpcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi5wYXlsb2FkLnJlZHVjZShiYXRjaGluZ1JlZHVjZXIsIHN0YXRlKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiByZWR1Y2Uoc3RhdGUsIGFjdGlvbik7XG5cdFx0fVxuXHR9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdGh1bmtNaWRkbGV3YXJlKF9yZWYpIHtcbiAgdmFyIGRpc3BhdGNoID0gX3JlZi5kaXNwYXRjaDtcbiAgdmFyIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicgPyBhY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSA6IG5leHQoYWN0aW9uKTtcbiAgICB9O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRodW5rTWlkZGxld2FyZTsiXX0=
