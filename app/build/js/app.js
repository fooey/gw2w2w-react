(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.receiveMatchesFailed = exports.receiveMatches = exports.fetchMatches = exports.requestMatches = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _api = require('lib/api');

var _api2 = _interopRequireDefault(_api);

var _actionTypes = require('constants/actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestMatches = exports.requestMatches = function requestMatches() {
    // console.log('action::requestMatches');

    return {
        type: _actionTypes.REQUEST_MATCHES
    };
};

var fetchMatches = exports.fetchMatches = function fetchMatches() {
    // console.log('action::fetchMatches');

    return function (dispatch) {
        dispatch(requestMatches());

        _api2.default.getMatches({
            success: function success(data) {
                // console.log('action::fetchMatches::success', data);
                dispatch(receiveMatches({
                    data: data,
                    lastUpdated: getMatchesLastmod(data)
                }));
            },
            error: function error(err) {
                // console.log('action::fetchMatches::error', err);
                dispatch(receiveMatchesFailed(err));
            }
        });
    };
};

// complete: () => {
//     console.log('action::fetchMatches::complete');
// },
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

var receiveMatchesFailed = exports.receiveMatchesFailed = function receiveMatchesFailed(err) {
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

},{"constants/actionTypes":33,"lib/api":34,"lodash":"lodash"}],3:[function(require,module,exports){
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

},{"constants/actionTypes":33}],4:[function(require,module,exports){
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

},{"constants/actionTypes":33}],5:[function(require,module,exports){
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

},{"constants/actionTypes":33}],6:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

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

var store = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default));

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

},{"actions/lang":1,"actions/route":3,"actions/world":5,"components/Layout/Container":7,"components/Overview":16,"components/Tracker":27,"domready":"domready","page":"page","react":"react","react-dom":"react-dom","react-redux":"react-redux","reducers":39,"redux":"redux","redux-thunk":48}],7:[function(require,module,exports){
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

},{"components/Layout/Footer":8,"components/Layout/Langs":10,"components/Layout/NavbarHeader":11,"lodash":"lodash","react":"react","react-redux":"react-redux"}],8:[function(require,module,exports){
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

},{"react":"react"}],9:[function(require,module,exports){
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

},{"classnames":"classnames","lib/static":37,"react":"react","react-redux":"react-redux"}],10:[function(require,module,exports){
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

},{"./LangLink":9,"lib/static":37,"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
    return { lang: state.lang };
};

var NavbarHeader = function NavbarHeader(_ref) {
    var lang = _ref.lang;
    return _react2.default.createElement(
        'div',
        { className: 'navbar-header' },
        _react2.default.createElement(
            'a',
            { className: 'navbar-brand', href: '/' + lang.slug },
            _react2.default.createElement('img', { src: '/img/logo/logo-96x36.png' })
        )
    );
};

NavbarHeader.propTypes = {
    lang: _react2.default.PropTypes.object.isRequired
};

NavbarHeader = (0, _reactRedux.connect)(mapStateToProps)(NavbarHeader);

exports.default = NavbarHeader;

},{"react":"react","react-redux":"react-redux"}],12:[function(require,module,exports){
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

},{"./MatchWorld":13,"lib/static":37,"react":"react","react-redux":"react-redux"}],13:[function(require,module,exports){
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

},{"components/common/Icons/Pie":28,"numeral":"numeral","react":"react"}],14:[function(require,module,exports){
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

},{"./Match":12,"lodash":"lodash","react":"react","react-redux":"react-redux"}],15:[function(require,module,exports){
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

},{"lib/static":37,"react":"react","react-redux":"react-redux"}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _matches = require('actions/matches');

var matchesActions = _interopRequireWildcard(_matches);

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
        matchesIsFetching: state.matches.isFetching
    };
};

// timeouts: state.timeouts,
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        fetchMatches: function fetchMatches() {
            return dispatch(matchesActions.fetchMatches());
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

},{"./Matches":14,"./Worlds":15,"actions/matches":2,"actions/timeouts":4,"react":"react","react-redux":"react-redux"}],17:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Emblem":31,"lodash":"lodash","react":"react"}],18:[function(require,module,exports){
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

},{"components/common/icons/Arrow":30,"components/common/icons/Emblem":31,"components/common/icons/Objective":32,"lib/static":37,"moment":"moment","react":"react"}],19:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Objective":32,"lib/static":37,"react":"react"}],20:[function(require,module,exports){
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

},{"./Entries":18,"./Tabs":19,"react":"react"}],21:[function(require,module,exports){
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

},{"./Objective":22,"classnames":"classnames","lib/static":37,"lodash":"lodash","react":"react"}],22:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Arrow":30,"components/common/icons/Emblem":31,"components/common/icons/Objective":32,"lib/static":37,"lodash":"lodash","moment":"moment","react":"react"}],23:[function(require,module,exports){
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

},{"./MatchMap":21,"lib/static":37,"lodash":"lodash","react":"react"}],24:[function(require,module,exports){
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

},{"components/common/Icons/Sprite":29,"react":"react"}],25:[function(require,module,exports){
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

},{"./Holdings":24,"lib/static":37,"lodash":"lodash","numeral":"numeral","react":"react"}],26:[function(require,module,exports){
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

},{"./World":25,"lodash":"lodash","react":"react"}],27:[function(require,module,exports){
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

},{"./Guilds":17,"./Log":20,"./Maps":23,"./Scoreboard":26,"lib/data/tracker":36,"lodash":"lodash","moment":"moment","react":"react"}],28:[function(require,module,exports){
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

},{"react":"react"}],29:[function(require,module,exports){
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

},{"react":"react"}],30:[function(require,module,exports){
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

},{"react":"react"}],31:[function(require,module,exports){
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

},{"react":"react"}],32:[function(require,module,exports){
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

},{"react":"react"}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// matches
var RECEIVE_MATCHES = exports.RECEIVE_MATCHES = 'RECEIVE_MATCHES';
var RECEIVE_MATCHES_FAILED = exports.RECEIVE_MATCHES_FAILED = 'RECEIVE_MATCHES_FAILED';
var REQUEST_MATCHES = exports.REQUEST_MATCHES = 'REQUEST_MATCHES';

// routes
var SET_ROUTE = exports.SET_ROUTE = 'SET_ROUTE';

// timeouts
var ADD_TIMEOUT = exports.ADD_TIMEOUT = 'ADD_TIMEOUT';
var REMOVE_TIMEOUT = exports.REMOVE_TIMEOUT = 'REMOVE_TIMEOUT';
// export const REMOVE_ALL_TIMEOUTS = 'REMOVE_ALL_TIMEOUTS';

// worlds
var SET_WORLD = exports.SET_WORLD = 'SET_WORLD';
var CLEAR_WORLD = exports.CLEAR_WORLD = 'CLEAR_WORLD';

},{}],34:[function(require,module,exports){
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

},{"superagent":"superagent"}],35:[function(require,module,exports){
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

},{"async":"async","lib/api":34,"lodash":"lodash"}],36:[function(require,module,exports){
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

},{"./guilds":35,"lib/api":34,"lib/static":37,"lodash":"lodash"}],37:[function(require,module,exports){
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

},{"gw2w2w-static/data/langs":45,"gw2w2w-static/data/objectives_v2_merged":46,"gw2w2w-static/data/world_names":47,"lodash":"lodash"}],38:[function(require,module,exports){
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

},{"lib/static":37}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

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

var appReducers = (0, _redux.combineReducers)({
    lang: _lang2.default,
    matches: _matches2.default,
    route: _route2.default,
    timeouts: _timeouts2.default,
    world: _world2.default
});

exports.default = appReducers;

},{"./lang":40,"./matches":41,"./route":42,"./timeouts":43,"./world":44,"redux":"redux"}],40:[function(require,module,exports){
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

},{"lib/static":37}],41:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = require('constants/actionTypes');

var defaultState = {
    data: {},
    ids: [],
    isFetching: false,
    lastUpdated: 0
};

var matches = function matches() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    // console.log('reducer::matches', state, action);

    switch (action.type) {
        // case SET_MATCHES:
        //     return Object.assign({}, { data: action.matches }, state);

        case _actionTypes.REQUEST_MATCHES:
            // console.log('reducer::matches', REQUEST_MATCHES, state, action);
            return _extends({}, state, {
                isFetching: true
            });

        case _actionTypes.RECEIVE_MATCHES:
            // console.log('reducer::matches', RECEIVE_MATCHES, state, action);
            return _extends({}, state, {
                data: action.data,
                ids: Object.keys(action.data).sort(),
                isFetching: false,
                lastUpdated: action.lastUpdated
            });

        case _actionTypes.RECEIVE_MATCHES_FAILED:
            // console.log('reducer::matches', RECEIVE_MATCHES_FAILED, state, action);
            return _extends({}, state, {
                error: action.error,
                isFetching: false
            });

        default:
            return state;
    }
};

exports.default = matches;

},{"constants/actionTypes":33}],42:[function(require,module,exports){
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

},{"constants/actionTypes":33}],43:[function(require,module,exports){
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

},{"constants/actionTypes":33,"lodash":"lodash"}],44:[function(require,module,exports){
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

},{"constants/actionTypes":33,"lib/worlds":38}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGxhbmcuanMiLCJhcHBcXGFjdGlvbnNcXG1hdGNoZXMuanMiLCJhcHBcXGFjdGlvbnNcXHJvdXRlLmpzIiwiYXBwXFxhY3Rpb25zXFx0aW1lb3V0cy5qcyIsImFwcFxcYWN0aW9uc1xcd29ybGQuanMiLCJhcHBcXGFwcC5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxDb250YWluZXIuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcRm9vdGVyLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXExhbmdzXFxMYW5nTGluay5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxMYW5nc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTmF2YmFySGVhZGVyLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2guanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxNYXRjaFdvcmxkLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXE92ZXJ2aWV3XFxXb3JsZHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXEd1aWxkc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcRW50cmllcy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxUYWJzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxNYXBzXFxNYXRjaE1hcC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcT2JqZWN0aXZlLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxNYXBzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcSG9sZGluZ3MuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXFdvcmxkLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcSWNvbnNcXFBpZS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxJY29uc1xcU3ByaXRlLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXGljb25zXFxBcnJvdy5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcRW1ibGVtLmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXGljb25zXFxPYmplY3RpdmUuanMiLCJhcHBcXGNvbnN0YW50c1xcYWN0aW9uVHlwZXMuanMiLCJhcHBcXGxpYlxcYXBpLmpzIiwiYXBwXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGd1aWxkcy5qcyIsImFwcFxcbGliXFxkYXRhXFx0cmFja2VyXFxpbmRleC5qcyIsImFwcFxcbGliXFxzdGF0aWNcXGluZGV4LmpzIiwiYXBwXFxsaWJcXHdvcmxkcy5qcyIsImFwcFxccmVkdWNlcnNcXGluZGV4LmpzIiwiYXBwXFxyZWR1Y2Vyc1xcbGFuZy5qcyIsImFwcFxccmVkdWNlcnNcXG1hdGNoZXMuanMiLCJhcHBcXHJlZHVjZXJzXFxyb3V0ZS5qcyIsImFwcFxccmVkdWNlcnNcXHRpbWVvdXRzLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcd29ybGQuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL2xhbmdzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVzX3YyX21lcmdlZC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMuanMiLCJub2RlX21vZHVsZXMvcmVkdXgtdGh1bmsvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNDTyxJQUFNLDRCQUFVLFNBQVYsT0FBVSxPQUFROzs7QUFHM0IsV0FBTztBQUNILGNBQU0sVUFBTjtBQUNBLGtCQUZHO0tBQVAsQ0FIMkI7Q0FBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1doQixJQUFNLDBDQUFpQixTQUFqQixjQUFpQixHQUFNOzs7QUFHaEMsV0FBTztBQUNILDBDQURHO0tBQVAsQ0FIZ0M7Q0FBTjs7QUFXdkIsSUFBTSxzQ0FBZSxTQUFmLFlBQWUsR0FBTTs7O0FBRzlCLFdBQU8sVUFBQyxRQUFELEVBQWM7QUFDakIsaUJBQVMsZ0JBQVQsRUFEaUI7O0FBR2pCLHNCQUFJLFVBQUosQ0FBZTtBQUNYLHFCQUFTLGlCQUFDLElBQUQsRUFBVTs7QUFFZix5QkFBUyxlQUFlO0FBQ3BCLDhCQURvQjtBQUVwQixpQ0FBYSxrQkFBa0IsSUFBbEIsQ0FBYjtpQkFGSyxDQUFULEVBRmU7YUFBVjtBQU9ULG1CQUFPLGVBQUMsR0FBRCxFQUFTOztBQUVaLHlCQUFTLHFCQUFxQixHQUFyQixDQUFULEVBRlk7YUFBVDtTQVJYLEVBSGlCO0tBQWQsQ0FIdUI7Q0FBTjs7Ozs7QUEyQnJCLElBQU0sMENBQWlCLFNBQWpCLGNBQWlCLE9BQTJCO1FBQXhCLGlCQUF3QjtRQUFsQiwrQkFBa0I7Ozs7QUFHckQsV0FBTztBQUNILDBDQURHO0FBRUgsa0JBRkc7QUFHSCxnQ0FIRztLQUFQLENBSHFEO0NBQTNCOztBQVl2QixJQUFNLHNEQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxHQUFELEVBQVM7OztBQUd6QyxXQUFPO0FBQ0gsaURBREc7QUFFSCxnQkFGRztLQUFQLENBSHlDO0NBQVQ7O0FBV3BDLFNBQVMsaUJBQVQsQ0FBMkIsV0FBM0IsRUFBd0M7QUFDcEMsV0FBTyxpQkFBRSxNQUFGLENB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdC9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG5leHBvcnQgY29uc3Qgc2V0TGFuZyA9IHNsdWcgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0TGFuZycsIHNsdWcpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ1NFVF9MQU5HJyxcclxuICAgICAgICBzbHVnLFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgUkVRVUVTVF9NQVRDSEVTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTLFxyXG4gICAgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcmVxdWVzdE1hdGNoZXMgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZXF1ZXN0TWF0Y2hlcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogUkVRVUVTVF9NQVRDSEVTLFxyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaE1hdGNoZXMgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpmZXRjaE1hdGNoZXMnKTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2gocmVxdWVzdE1hdGNoZXMoKSk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaGVzKHtcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6c3VjY2VzcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZU1hdGNoZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IGdldE1hdGNoZXNMYXN0bW9kKGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6ZmV0Y2hNYXRjaGVzOjplcnJvcicsIGVycik7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlTWF0Y2hlc0ZhaWxlZChlcnIpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhY3Rpb246OmZldGNoTWF0Y2hlczo6Y29tcGxldGUnKTtcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hlcyA9ICh7IGRhdGEsIGxhc3RVcGRhdGVkIH0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzJywgZGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRUNFSVZFX01BVENIRVMsXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBsYXN0VXBkYXRlZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWNlaXZlTWF0Y2hlc0ZhaWxlZCA9IChlcnIpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnJlY2VpdmVNYXRjaGVzRmFpbGVkJywgZXJyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQsXHJcbiAgICAgICAgZXJyLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc0xhc3Rtb2QobWF0Y2hlc0RhdGEpIHtcclxuICAgIHJldHVybiBfLnJlZHVjZShcclxuICAgICAgICBtYXRjaGVzRGF0YSxcclxuICAgICAgICAoYWNjLCBtYXRjaCkgPT4gTWF0aC5tYXgobWF0Y2gubGFzdG1vZCksXHJcbiAgICAgICAgMFxyXG4gICAgKTtcclxufSIsIlxyXG5pbXBvcnQge1xyXG4gICAgU0VUX1JPVVRFLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFJvdXRlID0gKGN0eCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBTRVRfUk9VVEUsXHJcbiAgICAgICAgcGF0aDogY3R4LnBhdGgsXHJcbiAgICAgICAgcGFyYW1zOiBjdHgucGFyYW1zLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBBRERfVElNRU9VVCxcclxuICAgIFJFTU9WRV9USU1FT1VULFxyXG4gICAgLy8gUkVNT1ZFX0FMTF9USU1FT1VUUyxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0QXBwVGltZW91dCA9ICh7XHJcbiAgICBuYW1lLFxyXG4gICAgY2IsXHJcbiAgICB0aW1lb3V0LFxyXG59KSA9PiB7XHJcbiAgICB0aW1lb3V0ID0gKHR5cGVvZiB0aW1lb3V0ID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgID8gdGltZW91dCgpXHJcbiAgICAgICAgOiB0aW1lb3V0O1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OnNldEFwcFRpbWVvdXQnLCBuYW1lLCB0aW1lb3V0KTtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJBcHBUaW1lb3V0KHsgbmFtZSB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlZiA9IHNldFRpbWVvdXQoY2IsIHRpbWVvdXQpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChzYXZlVGltZW91dCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHJlZixcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2F2ZVRpbWVvdXQgPSAoe1xyXG4gICAgbmFtZSxcclxuICAgIHJlZixcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBBRERfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHJlZixcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFwcFRpbWVvdXQgPSAoeyBuYW1lIH0pID0+IHtcclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQXBwVGltZW91dCcsIG5hbWUsIHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRzW25hbWVdKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2gocmVtb3ZlVGltZW91dCh7IG5hbWUgfSkpO1xyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckFsbFRpbWVvdXRzID0gKCkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGltZW91dHMgfSA9IGdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb246OmNsZWFyQWxsVGltZW91dHMnLCBnZXRTdGF0ZSgpLnRpbWVvdXRzKTtcclxuXHJcbiAgICAgICAgXy5mb3JFYWNoKHRpbWVvdXRzLCAodCwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhckFwcFRpbWVvdXQoeyBuYW1lIH0pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6Y2xlYXJBbGxUaW1lb3V0cycsIGdldFN0YXRlKCkudGltZW91dHMpO1xyXG5cclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVUaW1lb3V0ID0gKHsgbmFtZSB9KSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpyZW1vdmVUaW1lb3V0JywgbmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBSRU1PVkVfVElNRU9VVCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfV09STEQsXHJcbiAgICBDTEVBUl9XT1JMRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0V29ybGQgPSAobGFuZ1NsdWcsIHdvcmxkU2x1ZykgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFNFVF9XT1JMRCxcclxuICAgICAgICBsYW5nU2x1ZyxcclxuICAgICAgICB3b3JsZFNsdWcsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyV29ybGQgPSAoKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRXb3JsZCcsIGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogQ0xFQVJfV09STEQsXHJcbiAgICB9O1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJztcclxuXHJcblxyXG5pbXBvcnQgZG9tcmVhZHkgZnJvbSAnZG9tcmVhZHknO1xyXG5pbXBvcnQgcGFnZSBmcm9tICdwYWdlJztcclxuXHJcblxyXG5cclxuXHJcbmltcG9ydCBDb250YWluZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvQ29udGFpbmVyJztcclxuaW1wb3J0IE92ZXJ2aWV3IGZyb20gJ2NvbXBvbmVudHMvT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdjb21wb25lbnRzL1RyYWNrZXInO1xyXG5cclxuaW1wb3J0IGFwcFJlZHVjZXJzIGZyb20gJ3JlZHVjZXJzJztcclxuXHJcbmltcG9ydCB7IHNldFJvdXRlIH0gZnJvbSAnYWN0aW9ucy9yb3V0ZSc7XHJcbmltcG9ydCB7IHNldExhbmcgfSBmcm9tICdhY3Rpb25zL2xhbmcnO1xyXG5pbXBvcnQgeyBzZXRXb3JsZCwgY2xlYXJXb3JsZCB9IGZyb20gJ2FjdGlvbnMvd29ybGQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDcmVhdGUgUmVkdXggU3RvcmVcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIGFwcFJlZHVjZXJzLFxyXG4gICAgYXBwbHlNaWRkbGV3YXJlKHRodW5rTWlkZGxld2FyZSlcclxuKTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgU3RhcnQgQXBwXHJcbipcclxuKi9cclxuXHJcbmRvbXJlYWR5KCgpID0+IHtcclxuICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBBcHBsaWNhdGlvbicpO1xyXG5cclxuXHJcbiAgICBhdHRhY2hNaWRkbGV3YXJlKCk7XHJcbiAgICBhdHRhY2hSb3V0ZXMoKTtcclxuXHJcbiAgICBwYWdlLnN0YXJ0KHtcclxuICAgICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgICBwb3BzdGF0ZTogZmFsc2UsXHJcbiAgICAgICAgZGlzcGF0Y2g6IHRydWUsXHJcbiAgICAgICAgaGFzaGJhbmc6IGZhbHNlLFxyXG4gICAgICAgIGRlY29kZVVSTENvbXBvbmVudHM6IHRydWUsXHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcihBcHApIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXIoKScpO1xyXG5cclxuICAgIFJlYWN0RE9NLnJlbmRlcihcclxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgPENvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgIHtBcHB9XHJcbiAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1hcHAnKVxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYXR0YWNoTWlkZGxld2FyZSgpIHtcclxuICAgIHBhZ2UoKGN0eCwgbmV4dCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgcm91dGUgPT4gJHtjdHgucGF0aH1gKTtcclxuXHJcbiAgICAgICAgLy8gYXR0YWNoIHN0b3JlIHRvIHRoZSByb3V0ZXIgY29udGV4dFxyXG4gICAgICAgIGN0eC5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRSb3V0ZShjdHgpKTtcclxuXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgKGN0eCwgbmV4dCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZ1NsdWcsIHdvcmxkU2x1ZyB9ID0gY3R4LnBhcmFtcztcclxuXHJcbiAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKHNldExhbmcobGFuZ1NsdWcpKTtcclxuXHJcbiAgICAgICAgaWYgKHdvcmxkU2x1Zykge1xyXG4gICAgICAgICAgICBjdHguc3RvcmUuZGlzcGF0Y2goc2V0V29ybGQobGFuZ1NsdWcsIHdvcmxkU2x1ZykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LnN0b3JlLmRpc3BhdGNoKGNsZWFyV29ybGQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBhdHRhY2hSb3V0ZXMoKSB7XHJcbiAgICBwYWdlKCcvJywgJy9lbicpO1xyXG5cclxuICAgIHBhZ2UoXHJcbiAgICAgICAgJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyknLFxyXG4gICAgICAgIChjdHgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgeyBsYW5nU2x1Zywgd29ybGRTbHVnIH0gPSBjdHgucGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgLy8gY3R4LnN0b3JlLmRpc3BhdGNoKHNldExhbmcobGFuZ1NsdWcpKTtcclxuICAgICAgICAgICAgLy8gY3R4LnN0b3JlLmRpc3BhdGNoKHNldFdvcmxkKGxhbmdTbHVnLCB3b3JsZFNsdWcpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgbGFuZywgd29ybGQgfSA9IGN0eC5zdG9yZS5nZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyKDxUcmFja2VyIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0gLz4pO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmciknLFxyXG4gICAgICAgIChjdHgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgeyBsYW5nU2x1ZyB9ID0gY3R4LnBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChzZXRMYW5nKGxhbmdTbHVnKSk7XHJcbiAgICAgICAgICAgIC8vIGN0eC5zdG9yZS5kaXNwYXRjaChjbGVhcldvcmxkKCkpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyKDxPdmVydmlldyAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuXHJcbmltcG9ydCBMYW5ncyBmcm9tICdjb21wb25lbnRzL0xheW91dC9MYW5ncyc7XHJcbmltcG9ydCBOYXZiYXJIZWFkZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvTmF2YmFySGVhZGVyJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICdjb21wb25lbnRzL0xheW91dC9Gb290ZXInO1xyXG5cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4gICAgICAgIHdvcmxkOiBzdGF0ZS53b3JsZCxcclxuICAgIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpc0VxdWFsQnlQaWNrKGN1cnJlbnRQcm9wcywgbmV4dFByb3BzLCBrZXlzKSB7XHJcbiAgICByZXR1cm4gXy5pc0VxdWFsKFxyXG4gICAgICAgIF8ucGljayhjdXJyZW50UHJvcHMsIGtleXMpLFxyXG4gICAgICAgIF8ucGljayhuZXh0UHJvcHMsIGtleXMpLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyByZXR1cm4gXy5yZWR1Y2Uoa2V5cywgKGEsIGtleSkgPT4ge1xyXG4gICAgLy8gICAgIHJldHVybiBhIHx8ICFfLmlzRXF1YWwoY3VycmVudFByb3BzW2tleV0sIG5leHRQcm9wc1trZXldKTtcclxuICAgIC8vIH0sIGZhbHNlKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgIH07XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9ICFpc0VxdWFsQnlQaWNrKHRoaXMucHJvcHMsIG5leHRQcm9wcywgWydsYW5nJywgJ3dvcmxkJywgJ2NoaWxkcmVuJ10pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBDb250YWluZXI6OmNvbXBvbmVudFNob3VsZFVwZGF0ZSgpYCwgc2hvdWxkVXBkYXRlKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xhbmcnLCBfLmlzRXF1YWwodGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyksIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnd29ybGQnLCBfLmlzRXF1YWwodGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKSwgbmV4dFByb3BzLndvcmxkKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhgQ29udGFpbmVyOjpjb21wb25lbnRXaWxsTW91bnQoKWApO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICAvLyBjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50RGlkVXBkYXRlKClgKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgLy8gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coYENvbnRhaW5lcjo6Y29tcG9uZW50V2lsbFVubW91bnQoKWApO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPSduYXZiYXIgbmF2YmFyLWRlZmF1bHQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFySGVhZGVyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMYW5ncyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9uYXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gaWQ9J2NvbnRlbnQnIGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgICAgICAgPEZvb3RlciBvYnNmdUVtYWlsPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtzOiBbJ2d3MncydycsICdzY2h0dXBoJywgJ2NvbScsICdAJywgJy4nXSxcclxuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiAnMDMxNDInLFxyXG4gICAgICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuQ29udGFpbmVyID0gY29ubmVjdChcclxuICAgIG1hcFN0YXRlVG9Qcm9wc1xyXG4pKENvbnRhaW5lcik7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbnRhaW5lcjsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIG9ic2Z1RW1haWwsXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXInPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXhzLTI0Jz5cclxuICAgICAgICAgICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPSdzbWFsbCBtdXRlZCB0ZXh0LWNlbnRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDCqSAyMDEzIEFyZW5hTmV0LCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOQ3NvZnQsIHRoZSBpbnRlcmxvY2tpbmcgTkMgbG9nbywgQXJlbmFOZXQsIEd1aWxkIFdhcnMsIEd1aWxkIFdhcnMgRmFjdGlvbnMsIEd1aWxkIFdhcnMgTmlnaHRmYWxsLCBHdWlsZCBXYXJzOkV5ZSBvZiB0aGUgTm9ydGgsIEd1aWxkIFdhcnMgMiwgYW5kIGFsbCBhc3NvY2lhdGVkIGxvZ29zIGFuZCBkZXNpZ25zIGFyZSB0cmFkZW1hcmtzIG9yIHJlZ2lzdGVyZWQgdHJhZGVtYXJrcyBvZiBOQ3NvZnQgQ29ycG9yYXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbGwgb3RoZXIgdHJhZGVtYXJrcyBhcmUgdGhlIHByb3BlcnR5IG9mIHRoZWlyIHJlc3BlY3RpdmUgb3duZXJzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsZWFzZSBzZW5kIGNvbW1lbnRzIGFuZCBidWdzIHRvIDxPYnNmdUVtYWlsIG9ic2Z1RW1haWw9e29ic2Z1RW1haWx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3VwcG9ydGluZyBtaWNyb3NlcnZpY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL2d1aWxkcy5ndzJ3MncuY29tLyc+Z3VpbGRzLmd3Mncydy5jb208L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmbmJzcDsmbmRhc2g7Jm5ic3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPSdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS8nPnN0YXRlLmd3Mncydy5jb208L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmbmJzcDsmbmRhc2g7Jm5ic3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPSdodHRwOi8vd3d3LnBpZWx5Lm5ldC8nPnd3dy5waWVseS5uZXQ8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU291cmNlIGF2YWlsYWJsZSBhdCA8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vZm9vZXkvZ3cydzJ3LXJlYWN0Jz5odHRwczovL2dpdGh1Yi5jb20vZm9vZXkvZ3cydzJ3LXJlYWN0PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Zvb3Rlcj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcblxyXG5jb25zdCBPYnNmdUVtYWlsID0gKHtvYnNmdUVtYWlsfSkgPT4ge1xyXG4gICAgY29uc3QgcmVjb25zdHJ1Y3RlZCA9IG9ic2Z1RW1haWwucGF0dGVyblxyXG4gICAgICAgIC5zcGxpdCgnJylcclxuICAgICAgICAubWFwKGl4Q2h1bmsgPT4gb2JzZnVFbWFpbC5jaHVua3NbaXhDaHVua10pXHJcbiAgICAgICAgLmpvaW4oJycpO1xyXG5cclxuICAgIHJldHVybiA8YSBocmVmPXtgbWFpbHRvOiR7cmVjb25zdHJ1Y3RlZH1gfT57cmVjb25zdHJ1Y3RlZH08L2E+O1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5pbXBvcnQgeyB3b3JsZHMgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnbGFuZycsIHN0YXRlLmxhbmcpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhY3RpdmVMYW5nOiBzdGF0ZS5sYW5nLFxyXG4gICAgICAgIC8vIGFjdGl2ZVdvcmxkOiBzdGF0ZS53b3JsZCxcclxuICAgICAgICB3b3JsZDogc3RhdGUud29ybGQgPyB3b3JsZHNbc3RhdGUud29ybGQuaWRdW3Byb3BzLmxhbmcuc2x1Z10gOiBudWxsLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5sZXQgTGFuZyA9ICh7XHJcbiAgICBhY3RpdmVMYW5nLFxyXG4gICAgLy8gYWN0aXZlV29ybGQsXHJcbiAgICBsYW5nLFxyXG4gICAgd29ybGQsXHJcbn0pID0+IChcclxuICAgIDxsaVxyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogYWN0aXZlTGFuZy5sYWJlbCA9PT0gbGFuZy5sYWJlbCxcclxuICAgICAgICB9KX1cclxuICAgICAgICB0aXRsZT17bGFuZy5uYW1lfVxyXG4gICAgPlxyXG4gICAgICAgIDxhIGhyZWY9e2dldExpbmsobGFuZywgd29ybGQpfT5cclxuICAgICAgICAgICAge2xhbmcubGFiZWx9XHJcbiAgICAgICAgPC9hPlxyXG4gICAgPC9saT5cclxuKTtcclxuTGFuZy5wcm9wVHlwZXMgPSB7XHJcbiAgICBhY3RpdmVMYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICBhY3RpdmVXb3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuTGFuZyA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4gIC8vIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKExhbmcpO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gKHdvcmxkKVxyXG4gICAgICAgID8gd29ybGQubGlua1xyXG4gICAgICAgIDogbGFuZy5saW5rO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmc7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBsYW5ncyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IExhbmdMaW5rIGZyb20gJy4vTGFuZ0xpbmsnO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgTGFuZ3MgPSAoKSA9PiAoXHJcbiAgICA8ZGl2IGlkPSduYXYtbGFuZ3MnIGNsYXNzTmFtZT0ncHVsbC1yaWdodCc+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZSA9ICduYXYgbmF2YmFyLW5hdic+XHJcbiAgICAgICAgICAgIHtfLm1hcChsYW5ncywgKGxhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGluayBrZXk9e2tleX0gbGFuZz17bGFuZ30gLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExhbmdzOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiAoeyBsYW5nOiBzdGF0ZS5sYW5nIH0pO1xyXG5cclxubGV0IE5hdmJhckhlYWRlciA9ICh7IGxhbmcgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J25hdmJhci1oZWFkZXInPlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT0nbmF2YmFyLWJyYW5kJyBocmVmPXtgLyR7bGFuZy5zbHVnfWB9PlxyXG4gICAgICAgICAgICA8aW1nIHNyYz0nL2ltZy9sb2dvL2xvZ28tOTZ4MzYucG5nJyAvPlxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuTmF2YmFySGVhZGVyLnByb3BUeXBlcyA9IHtcclxuICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbk5hdmJhckhlYWRlciA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHNcclxuKShOYXZiYXJIZWFkZXIpO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2YmFySGVhZGVyOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuLy8gaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IE1hdGNoV29ybGQgZnJvbSAnLi9NYXRjaFdvcmxkJztcclxuXHJcbmltcG9ydCB7IHdvcmxkcyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5jb25zdCBXT1JMRF9DT0xPUlMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG5cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuICAgICAgICBtYXRjaDogc3RhdGUubWF0Y2hlcy5kYXRhW3Byb3BzLm1hdGNoSWRdLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5cclxuY2xhc3MgTWF0Y2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5pc05ld01hdGNoRGF0YShuZXh0UHJvcHMpXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TWF0Y2hEYXRhKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5tYXRjaC5sYXN0bW9kICE9PSBuZXh0UHJvcHMubWF0Y2gubGFzdG1vZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdMYW5nKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5sYW5nLnNsdWcgIT09IG5leHRQcm9wcy5sYW5nLnNsdWcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZywgbWF0Y2ggfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXRjaENvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPSdtYXRjaCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoV09STERfQ09MT1JTLCAoY29sb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkSWQgID0gbWF0Y2gud29ybGRzW2NvbG9yXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkID0gd29ybGRzW3dvcmxkSWRdW2xhbmcuc2x1Z107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAndHInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHt3b3JsZElkfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0ge21hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllID0ge2NvbG9yID09PSAncmVkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Lyo8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17Mn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17e3RleHRBbGlnbjogJ2NlbnRlcid9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+e21vbWVudChtYXRjaC5sYXN0bW9kICogMTAwMCkuZm9ybWF0KCdoaDptbTpzcycpfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPiovfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5NYXRjaCA9IGNvbm5lY3QoXHJcbiAgICBtYXBTdGF0ZVRvUHJvcHMsXHJcbikoTWF0Y2gpO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdGNoOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgbnVtZXJhbCBmcm9tICdudW1lcmFsJztcclxuXHJcbmltcG9ydCBQaWUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vSWNvbnMvUGllJztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IE1hdGNoV29ybGQgPSAoe1xyXG4gICAgY29sb3IsXHJcbiAgICBtYXRjaCxcclxuICAgIHNob3dQaWUsXHJcbiAgICB3b3JsZCxcclxufSkgPT4gKFxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtjb2xvcn1gfT48YSBocmVmPXt3b3JsZC5saW5rfT57d29ybGQubmFtZX08L2E+PC90ZD5cclxuICAgICAgICB7Lyo8dGQgY2xhc3NOYW1lPXtgdGVhbSBraWxscyAke2NvbG9yfWB9PnttYXRjaC5raWxscyA/IG51bWVyYWwobWF0Y2gua2lsbHNbY29sb3JdKS5mb3JtYXQoJzAsMCcpIDogbnVsbH08L3RkPiovfVxyXG4gICAgICAgIHsvKjx0ZCBjbGFzc05hbWU9e2B0ZWFtIGRlYXRocyAke2NvbG9yfWB9PnttYXRjaC5kZWF0aHMgPyBudW1lcmFsKG1hdGNoLmRlYXRoc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+Ki99XHJcbiAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gc2NvcmUgJHtjb2xvcn1gfT57bWF0Y2guc2NvcmVzID8gbnVtZXJhbChtYXRjaC5zY29yZXNbY29sb3JdKS5mb3JtYXQoJzAsMCcpIDogbnVsbH08L3RkPlxyXG5cclxuICAgICAgICB7KHNob3dQaWUgJiYgbWF0Y2guc2NvcmVzKVxyXG4gICAgICAgICAgICA/IDx0ZCBjbGFzc05hbWU9J3BpZScgcm93U3Bhbj0nMyc+PFBpZSBzY29yZXM9e21hdGNoLnNjb3Jlc30gc2l6ZT17NjB9IC8+PC90ZD5cclxuICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgPC90cj5cclxuKTtcclxuTWF0Y2hXb3JsZC5wcm9wVHlwZXMgPSB7XHJcbiAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgbWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIHNob3dQaWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaFdvcmxkOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBNYXRjaCBmcm9tICcuL01hdGNoJztcclxuXHJcblxyXG5jb25zdCBsb2FkaW5nSHRtbCA9IDxzcGFuIHN0eWxlPXt7IHBhZGRpbmdMZWZ0OiAnLjVlbScgfX0+PGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nIC8+PC9zcGFuPjtcclxuXHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtYXRjaElkczogXy5maWx0ZXIoXHJcbiAgICAgICAgICAgIHN0YXRlLm1hdGNoZXMuaWRzLFxyXG4gICAgICAgICAgICBpZCA9PiBwcm9wcy5yZWdpb24uaWQgPT09IGlkLmNoYXJBdCgwKVxyXG4gICAgICAgICksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcbmxldCBNYXRjaGVzID0gKHtcclxuICAgIG1hdGNoSWRzLFxyXG4gICAgcmVnaW9uLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICB7cmVnaW9uLmxhYmVsfSBNYXRjaGVzXHJcbiAgICAgICAgICAgIHtfLmlzRW1wdHkobWF0Y2hJZHMpID8gbG9hZGluZ0h0bWwgOiBudWxsfVxyXG4gICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgbWF0Y2hJZHMsXHJcbiAgICAgICAgICAgIChtYXRjaElkKSA9PlxyXG4gICAgICAgICAgICA8TWF0Y2gga2V5PXttYXRjaElkfSBtYXRjaElkPXttYXRjaElkfSAvPlxyXG4gICAgICAgICl9XHJcbiAgICAgICAgey8qXy5tYXAobWF0Y2hlcywgKG1hdGNoKSA9PiA8ZGl2IGtleT17bWF0Y2guaWR9PntKU09OLnN0cmluZ2lmeShtYXRjaCl9PC9kaXY+KSovfVxyXG4gICAgPC9kaXY+XHJcbik7XHJcbk1hdGNoZXMucHJvcFR5cGVzID0ge1xyXG4gICAgbWF0Y2hJZHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxyXG4gICAgcmVnaW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcbk1hdGNoZXMgPSBjb25uZWN0KFxyXG4gICAgbWFwU3RhdGVUb1Byb3BzXHJcbikoTWF0Y2hlcyk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRjaGVzOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsYW5nOiBzdGF0ZS5sYW5nLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5sZXQgV29ybGRzID0gKHtcclxuICAgIGxhbmcsXHJcbiAgICByZWdpb24sXHJcbn0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdSZWdpb25Xb3JsZHMnPlxyXG4gICAgICAgIDxoMj57cmVnaW9uLmxhYmVsfSBXb3JsZHM8L2gyPlxyXG4gICAgICAgIDx1bCBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgICAgICB7Xy5jaGFpbih3b3JsZHMpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHdvcmxkID0+IHdvcmxkLnJlZ2lvbiA9PT0gcmVnaW9uLmlkKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh3b3JsZCA9PiB3b3JsZFtsYW5nLnNsdWddKVxyXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgnbmFtZScpXHJcbiAgICAgICAgICAgICAgICAubWFwKHdvcmxkID0+IDxsaSBrZXk9e3dvcmxkLnNsdWd9PjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L2xpPilcclxuICAgICAgICAgICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbik7XHJcbldvcmxkcy5wcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbldvcmxkcyA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzKShXb3JsZHMpO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmxkczsiLCJcclxuLypcclxuKlxyXG4qICAgRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlZHV4IEFjdGlvbnNcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIG1hdGNoZXNBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbWF0Y2hlcyc7XHJcbmltcG9ydCAqIGFzIHRpbWVvdXRBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdGltZW91dHMnO1xyXG5cclxuXHJcbi8qXHJcbiogICBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5pbXBvcnQgTWF0Y2hlcyBmcm9tICcuL01hdGNoZXMnO1xyXG5pbXBvcnQgV29ybGRzIGZyb20gJy4vV29ybGRzJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSRUdJT05TID0ge1xyXG4gICAgMTogeyBsYWJlbDogJ05BJywgaWQ6ICcxJyB9LFxyXG4gICAgMjogeyBsYWJlbDogJ0VVJywgaWQ6ICcyJyB9LFxyXG59O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBSZWR1eCBIZWxwZXJzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0ZScsIHN0YXRlLnRpbWVvdXRzKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IHN0YXRlLm1hdGNoZXMuZGF0YSxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IHN0YXRlLm1hdGNoZXMubGFzdFVwZGF0ZWQsXHJcbiAgICAgICAgbWF0Y2hlc0lzRmV0Y2hpbmc6IHN0YXRlLm1hdGNoZXMuaXNGZXRjaGluZyxcclxuICAgICAgICAvLyB0aW1lb3V0czogc3RhdGUudGltZW91dHMsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoTWF0Y2hlczogKCkgPT4gZGlzcGF0Y2gobWF0Y2hlc0FjdGlvbnMuZmV0Y2hNYXRjaGVzKCkpLFxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6ICh7IG5hbWUsIGNiLCB0aW1lb3V0IH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLnNldEFwcFRpbWVvdXQoeyBuYW1lLCBjYiwgdGltZW91dCB9KSksXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiAoeyBuYW1lIH0pID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQXBwVGltZW91dCh7IG5hbWUgfSkpLFxyXG4gICAgICAgIC8vIGNsZWFyQWxsVGltZW91dHM6ICgpID0+IGRpc3BhdGNoKHRpbWVvdXRBY3Rpb25zLmNsZWFyQWxsVGltZW91dHMoKSksXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2hlc0RhdGE6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzTGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaGVzSXNGZXRjaGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgICAgICAvLyB0aW1lb3V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxuICAgICAgICBmZXRjaE1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgICAgIHNldEFwcFRpbWVvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICAgICAgY2xlYXJBcHBUaW1lb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcy8qLCBuZXh0U3RhdGUqLykge1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWQgIT09IG5leHRQcm9wcy5tYXRjaGVzTGFzdFVwZGF0ZWRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy5tYXRjaGVzSXNGZXRjaGluZyAhPT0gbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMubGFuZy5zbHVnICE9PSBuZXh0UHJvcHMubGFuZy5zbHVnXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3OjpzaG91bGRVcGRhdGVgLCB0aGlzLnByb3BzLCBuZXh0UHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OnNob3VsZFVwZGF0ZWAsIHNob3VsZFVwZGF0ZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojppc05ld01hdGNoZXNEYXRhYCwgdGhpcy5pc05ld01hdGNoZXNEYXRhKG5leHRQcm9wcykpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6aXNOZXdMYW5nYCwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE92ZXJ2aWV3Ojpjb21wb25lbnRXaWxsTW91bnQoKWApO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBPdmVydmlldzo6Y29tcG9uZW50RGlkTW91bnQoKWApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmZldGNoTWF0Y2hlcygpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKWApO1xyXG5cclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgIG1hdGNoZXNJc0ZldGNoaW5nLFxyXG4gICAgICAgICAgICBmZXRjaE1hdGNoZXMsXHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQsXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmIChsYW5nLm5hbWUgIT09IG5leHRQcm9wcy5sYW5nLm5hbWUpIHtcclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzSXNGZXRjaGluZyAmJiAhbmV4dFByb3BzLm1hdGNoZXNJc0ZldGNoaW5nKSB7XHJcbiAgICAgICAgICAgIHNldEFwcFRpbWVvdXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZldGNoTWF0Y2hlcycsXHJcbiAgICAgICAgICAgICAgICBjYjogKCkgPT4gZmV0Y2hNYXRjaGVzKCksXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAoKSA9PiBfLnJhbmRvbSg0ICogMTAwMCwgOCAqIDEwMDApLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcnZpZXc6OmNvbXBvbmVudFdpbGxVbm1vdW50KClgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jbGVhckFwcFRpbWVvdXQoeyBuYW1lOiAnZmV0Y2hNYXRjaGVzJyB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIG1hdGNoZXMgKi99XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbikgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS0xMicga2V5PXtyZWdpb24uaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hdGNoZXMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7Lyogd29ybGRzICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxXb3JsZHMgcmVnaW9uPXtyZWdpb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk92ZXJ2aWV3ID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXHJcbikoT3ZlcnZpZXcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERpcmVjdCBET00gTWFuaXB1bGF0aW9uXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IFsnZ3cydzJ3LmNvbSddO1xyXG5cclxuICAgIGlmIChsYW5nLnNsdWcgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZS5qb2luKCcgLSAnKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcnZpZXc7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbn0pID0+IChcclxuICAgIDx1bCBpZD0nZ3VpbGRzJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgIHtfXHJcbiAgICAgICAgICAgIC5jaGFpbihndWlsZHMpXHJcbiAgICAgICAgICAgIC5zb3J0QnkoJ25hbWUnKVxyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgICAgZ3VpbGQgPT5cclxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2d1aWxkLmlkfSBjbGFzc05hbWU9J2d1aWxkJyBpZD17Z3VpbGQuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2BodHRwczovL2d1aWxkcy5ndzJ3MncuY29tLyR7Z3VpbGQuaWR9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17Z3VpbGQuaWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGQubmFtZX0gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkLnRhZ31dIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIC52YWx1ZSgpfVxyXG4gICAgPC91bD5cclxuKTtcclxuXHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuLy8gaW1wb3J0IFNwcml0ZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9TcHJpdGUnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5pbXBvcnQgQXJyb3dJY29uIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0Fycm93JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGxvZyxcclxuICAgIG5vdyxcclxuICAgIG1hcEZpbHRlcixcclxuICAgIHR5cGVGaWx0ZXIsXHJcbn0pID0+IChcclxuICAgIDxvbCBpZD0nbG9nJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgIHtfLmNoYWluKGxvZylcclxuICAgICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBieVR5cGUodHlwZUZpbHRlciwgZW50cnkpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkpXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT5cclxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2VudHJ5LmlkfSBjbGFzc05hbWU9e2B0ZWFtICR7ZW50cnkub3duZXJ9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCBsb2ctb2JqZWN0aXZlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWV4cGlyZSc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KGVudHJ5LmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLXRpbWUnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb21lbnQoKS5kaWZmKGVudHJ5Lmxhc3RGbGlwcGVkLCAnaG91cnMnKSA8IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0RmxpcHBlZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGVudHJ5Lmxhc3RGbGlwcGVkLmZyb21Ob3codHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1nZW8nPjxBcnJvd0ljb24gZGlyZWN0aW9uPXtnZXRPYmplY3RpdmVEaXJlY3Rpb24oZW50cnkpfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXtlbnRyeS5vd25lcn0gdHlwZT17ZW50cnkudHlwZX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KG1hcEZpbHRlciA9PT0gJycpID8gPGxpIGNsYXNzTmFtZT0nbG9nLW1hcCc+e2dldE1hcChlbnRyeSkuYWJicn08L2xpPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1uYW1lJz57U1RBVElDLm9iamVjdGl2ZXNbZW50cnkuaWRdLm5hbWVbbGFuZy5zbHVnXX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Lyo8bGkgY2xhc3NOYW1lPSdsb2ctY2xhaW1lZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkubGFzdENsYWltZWQuaXNWYWxpZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0Q2xhaW1lZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1ndWlsZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZ3VpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxhIGhyZWY9eycjJyArIGVudHJ5Lmd1aWxkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXtlbnRyeS5ndWlsZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkc1tlbnRyeS5ndWlsZF0gPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGRzW2VudHJ5Lmd1aWxkXS5uYW1lfSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtndWlsZHNbZW50cnkuZ3VpbGRdID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkc1tlbnRyeS5ndWlsZF0udGFnfV0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAudmFsdWUoKX1cclxuICAgIDwvb2w+XHJcbik7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlRGlyZWN0aW9uKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgYmFzZUlkID0gb2JqZWN0aXZlLmlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXAob2JqZWN0aXZlKSB7XHJcbiAgICBjb25zdCBtYXBJZCA9IG9iamVjdGl2ZS5pZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgcmV0dXJuIF8uZmluZChTVEFUSUMubWFwc01ldGEsIG1tID0+IG1tLmlkID09IG1hcElkKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdHlwZUZpbHRlcltlbnRyeS50eXBlXTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgaWYgKG1hcEZpbHRlcikge1xyXG4gICAgICAgIHJldHVybiBlbnRyeS5tYXBJZCA9PT0gbWFwRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBtYXBzLFxyXG4gICAgbWFwRmlsdGVyID0gJycsXHJcbiAgICB0eXBlRmlsdGVyID0gJycsXHJcblxyXG4gICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2ssXHJcbiAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2ssXHJcbn0pID0+IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBpZD0nbG9nLXRhYnMnIGNsYXNzTmFtZT0nZmxleC10YWJzJz5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7dGFiOiB0cnVlLCBhY3RpdmU6ICFtYXBGaWx0ZXJ9KX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZU1hcEZpbHRlckNsaWNrKCcnKX1cclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuPXsnQWxsJ31cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgU1RBVElDLm1hcHNNZXRhLFxyXG4gICAgICAgICAgICAgICAgKG1tKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKF8uc29tZShtYXBzLCBtYXRjaE1hcCA9PiBtYXRjaE1hcC5pZCA9PSBtbS5pZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bW0uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe3RhYjogdHJ1ZSwgYWN0aXZlOiBtYXBGaWx0ZXIgPT0gbW0uaWR9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZU1hcEZpbHRlckNsaWNrKF8ucGFyc2VJbnQobW0uaWQpKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXttbS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW49e21tLmFiYnJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBbJ2Nhc3RsZScsICdrZWVwJywgJ3Rvd2VyJywgJ2NhbXAnXSxcclxuICAgICAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICAgIDxhICBrZXk9e3R9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHlwZUZpbHRlclt0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IHQgPT09ICdjYXN0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVR5cGVGaWx0ZXJDbGljayh0KX0gPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8T2JqZWN0aXZlSWNvbiB0eXBlPXt0fSBzaXplPXsxOH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuaW1wb3J0IEVudHJpZXMgZnJvbSAnLi9FbnRyaWVzJztcclxuaW1wb3J0IFRhYnMgZnJvbSAnLi9UYWJzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbG9nOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcclxuICAgICAgICBndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBtYXRjaDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXBGaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgICB0eXBlRmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjYXN0bGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBrZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdG93ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW1wOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0nbG9nLWNvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICA8VGFic1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcHM9e3RoaXMucHJvcHMubWF0Y2gubWFwc31cclxuICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXI9e3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVGaWx0ZXI9e3RoaXMuc3RhdGUudHlwZUZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlTWFwRmlsdGVyQ2xpY2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2s9e3RoaXMuaGFuZGxlVHlwZUZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPEVudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICBndWlsZHM9e3RoaXMucHJvcHMuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICBsb2c9e3RoaXMucHJvcHMubG9nfVxyXG4gICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5wcm9wcy5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaGFuZGxlTWFwRmlsdGVyQ2xpY2sobWFwRmlsdGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NldCBtYXBGaWx0ZXInLCBtYXBGaWx0ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHttYXBGaWx0ZXJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUeXBlRmlsdGVyQ2xpY2sodG9nZ2xlVHlwZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUgdHlwZUZpbHRlcicsIHRvZ2dsZVR5cGUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXSA9ICFzdGF0ZS50eXBlRmlsdGVyW3RvZ2dsZVR5cGVdO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcbmltcG9ydCBPYmplY3RpdmUgZnJvbSAnLi9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbWF0Y2hNYXAsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcC1zZWN0aW9ucyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIGdldE1hcE9iamVjdGl2ZXNNZXRhKG1hdGNoTWFwLmlkKSxcclxuICAgICAgICAgICAgICAgIChzZWN0aW9uLCBpeCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFwLXNlY3Rpb24nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvbG86IHNlY3Rpb24ubGVuZ3RoID09PSAxLFxyXG4gICAgICAgICAgICAgICAgfSl9IGtleT17aXh9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGdlbykgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtnZW8uaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17Z2VvLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXtndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uPXtnZW8uZGlyZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hdGNoTWFwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93PXtub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwT2JqZWN0aXZlc01ldGEobWFwSWQpIHtcclxuICAgIGxldCBtYXBDb2RlID0gJ2JsMic7XHJcblxyXG4gICAgaWYgKG1hcElkID09PSAzOCkge1xyXG4gICAgICAgIG1hcENvZGUgPSAnZWInO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKFNUQVRJQy5vYmplY3RpdmVzTWV0YSlcclxuICAgICAgICAuY2xvbmVEZWVwKClcclxuICAgICAgICAuZmlsdGVyKG9tID0+IG9tLm1hcCA9PT0gbWFwQ29kZSlcclxuICAgICAgICAuZ3JvdXBCeShvbSA9PiBvbS5ncm91cClcclxuICAgICAgICAudmFsdWUoKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSdtb21lbnQnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9FbWJsZW0nO1xyXG5pbXBvcnQgQXJyb3cgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvQXJyb3cnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9PYmplY3RpdmUnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBpZCxcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBkaXJlY3Rpb24sXHJcbiAgICBtYXRjaE1hcCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG4gICAgY29uc3Qgb2JqZWN0aXZlSWQgPSBgJHttYXRjaE1hcC5pZH0tJHtpZH1gO1xyXG4gICAgY29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlc1tvYmplY3RpdmVJZF07XHJcbiAgICBjb25zdCBtbyA9IF8uZmluZChtYXRjaE1hcC5vYmplY3RpdmVzLCBvID0+IG8uaWQgPT09IG9iamVjdGl2ZUlkKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgJ2xpc3QtdW5zdHlsZWQnOiB0cnVlLFxyXG4gICAgICAgICAgICAndHJhY2stb2JqZWN0aXZlJzogdHJ1ZSxcclxuICAgICAgICAgICAgZnJlc2g6IG5vdy5kaWZmKG1vLmxhc3RGbGlwcGVkLCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyaW5nOiBtby5leHBpcmVzLmlzQWZ0ZXIobm93KSAmJiBtby5leHBpcmVzLmRpZmYobm93LCAnc2Vjb25kcycpIDwgMzAsXHJcbiAgICAgICAgICAgIGV4cGlyZWQ6IG5vdy5pc0FmdGVyKG1vLmV4cGlyZXMpLFxyXG4gICAgICAgICAgICBhY3RpdmU6IG5vdy5pc0JlZm9yZShtby5leHBpcmVzKSxcclxuICAgICAgICB9KX0+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xlZnQnPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1nZW8nPjxBcnJvdyBkaXJlY3Rpb249e2RpcmVjdGlvbn0gLz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLXNwcml0ZSc+PE9iamVjdGl2ZUljb24gY29sb3I9e21vLm93bmVyfSB0eXBlPXttby50eXBlfSAvPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stbmFtZSc+e29NZXRhLm5hbWVbbGFuZy5zbHVnXX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J3JpZ2h0Jz5cclxuICAgICAgICAgICAgICAgIHttby5ndWlsZFxyXG4gICAgICAgICAgICAgICAgICAgID8gPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0cmFjay1ndWlsZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17JyMnICsgbW8uZ3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtndWlsZHNbbW8uZ3VpbGRdID8gYCR7Z3VpbGRzW21vLmd1aWxkXS5uYW1lfSBbJHtndWlsZHNbbW8uZ3VpbGRdLnRhZ31dYCA6ICdMb2FkaW5nLi4uJ31cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17bW8uZ3VpbGR9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stZXhwaXJlJz5cclxuICAgICAgICAgICAgICAgICAgICB7bW8uZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBtb21lbnQobW8uZXhwaXJlcy5kaWZmKG5vdywgJ21pbGxpc2Vjb25kcycpKS5mb3JtYXQoJ206c3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICk7XHJcbn07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgTWF0Y2hNYXAgZnJvbSAnLi9NYXRjaE1hcCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaCxcclxuICAgIG5vdyxcclxufSkgPT4ge1xyXG5cclxuICAgIGlmIChfLmlzRW1wdHkobWF0Y2gpKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFwcyA9IF8ua2V5QnkobWF0Y2gubWFwcywgJ2lkJyk7XHJcbiAgICBjb25zdCBjdXJyZW50TWFwSWRzID0gXy5rZXlzKG1hcHMpO1xyXG4gICAgY29uc3QgbWFwc01ldGFBY3RpdmUgPSBfLmZpbHRlcihcclxuICAgICAgICBTVEFUSUMubWFwc01ldGEsXHJcbiAgICAgICAgbWFwTWV0YSA9PiBfLmluZGV4T2YoY3VycmVudE1hcElkcywgXy5wYXJzZUludChtYXBNZXRhLmlkKSAhPT0gLTEpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9J21hcHMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBtYXBzTWV0YUFjdGl2ZSxcclxuICAgICAgICAgICAgICAgIChtYXBNZXRhKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hcCcga2V5PXttYXBNZXRhLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8aDI+e21hcE1ldGEubmFtZX08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaE1hcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e2d1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwTWV0YT17bWFwTWV0YX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hNYXA9e21hcHNbbWFwTWV0YS5pZF19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTYnPns8TWFwRGV0YWlscyBtYXBLZXk9J0NlbnRlcicgbWFwTWV0YT17Z2V0TWFwTWV0YSgnQ2VudGVyJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0xOCc+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtOCc+ezxNYXBEZXRhaWxzIG1hcEtleT0nUmVkSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnUmVkSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0JsdWVIb21lJyBtYXBNZXRhPXtnZXRNYXBNZXRhKCdCbHVlSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J0dyZWVuSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnR3JlZW5Ib21lJyl9IHsuLi50aGlzLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICovIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgU3ByaXRlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL0ljb25zL1Nwcml0ZSc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgaG9sZGluZ3MsXHJcbn0pID0+IChcclxuICAgIDx1bCBjbGFzc05hbWU9J2xpc3QtaW5saW5lJz5cclxuICAgICAgICB7Xy5tYXAoaG9sZGluZ3MsICh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgPGxpIGtleT17dHlwZUluZGV4fT5cclxuICAgICAgICAgICAgICAgIDxTcHJpdGVcclxuICAgICAgICAgICAgICAgICAgICB0eXBlICA9IHt0eXBlSW5kZXh9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncXVhbnRpdHknPnh7dHlwZVF1YW50aXR5fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApfVxyXG4gICAgPC91bD5cclxuKTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IEhvbGRpbmdzIGZyb20gJy4vSG9sZGluZ3MnO1xyXG5cclxuXHJcbmltcG9ydCB7d29ybGRzIGFzIFdPUkxEU30gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuY29uc3QgTG9hZGluZyA9ICgpID0+IChcclxuICAgIDxoMSBzdHlsZT17e2hlaWdodDogJzkwcHgnLCBmb250U2l6ZTogJzMycHQnLCBsaW5lSGVpZ2h0OiAnOTBweCd9fT5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvcixcclxuICAgIGRlYXRocyxcclxuICAgIGlkLFxyXG4gICAgaG9sZGluZ3MsXHJcbiAgICBraWxscyxcclxuICAgIGxhbmcsXHJcbiAgICBzY29yZSxcclxuICAgIHRpY2ssXHJcbn0pID0+IHtcclxuICAgIGNvbnN0IHdvcmxkID0gV09STERTW2lkXVtsYW5nLnNsdWddO1xyXG5cclxuICAgIGlmICghd29ybGQgJiYgXy5pc0VtcHR5KHdvcmxkKSkge1xyXG4gICAgICAgIHJldHVybiA8TG9hZGluZyAvPjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHtjb2xvcn1gfT5cclxuICAgICAgICAgICAgPGgxPjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L2gxPlxyXG4gICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc3RhdHMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBTY29yZSc+e251bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIFRpY2snPntudW1lcmFsKHRpY2spLmZvcm1hdCgnKzAsMCcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge2tpbGxzXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT0nc3ViLXN0YXRzJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIEtpbGxzJz57bnVtZXJhbChraWxscykuZm9ybWF0KCcwLDAnKX1rPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgRGVhdGhzJz57bnVtZXJhbChkZWF0aHMpLmZvcm1hdCgnMCwwJyl9ZDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgIDxIb2xkaW5nc1xyXG4gICAgICAgICAgICAgICAgY29sb3I9e2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgaG9sZGluZ3M9e2hvbGRpbmdzfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi9Xb3JsZCc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBtYXRjaCxcclxuICAgIGxhbmcsXHJcbn0pID0+ICB7XHJcbiAgICBjb25zdCB3b3JsZHNQcm9wcyA9IGdldFdvcmxkc1Byb3BzKG1hdGNoLCBsYW5nKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0ncm93JyBpZD0nc2NvcmVib2FyZHMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICB3b3JsZHNQcm9wcyxcclxuICAgICAgICAgICAgICAgICh3b3JsZFByb3BzKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS04JyBrZXk9e3dvcmxkUHJvcHMuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXb3JsZCB7Li4ud29ybGRQcm9wc30gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRzUHJvcHMobWF0Y2gsIGxhbmcpIHtcclxuICAgIHJldHVybiBfLnJlZHVjZShcclxuICAgICAgICBtYXRjaC53b3JsZHMsXHJcbiAgICAgICAgKGFjYywgd29ybGRJZCwgY29sb3IpID0+IHtcclxuICAgICAgICAgICAgYWNjW2NvbG9yXSA9IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgbGFuZyxcclxuICAgICAgICAgICAgICAgIGlkOiB3b3JsZElkLFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IF8uZ2V0KG1hdGNoLCBbJ3Njb3JlcycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICBkZWF0aHM6IF8uZ2V0KG1hdGNoLCBbJ2RlYXRocycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICBraWxsczogXy5nZXQobWF0Y2gsIFsna2lsbHMnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAgdGljazogXy5nZXQobWF0Y2gsIFsndGlja3MnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAgaG9sZGluZ3M6IF8uZ2V0KG1hdGNoLCBbJ2hvbGRpbmdzJywgY29sb3JdLCBbXSksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7cmVkOiB7fSwgYmx1ZToge30sIGdyZWVuOiB7fX1cclxuICAgICk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSdsb2Rhc2gnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcblxyXG5cclxuLypcclxuICogICBEYXRhXHJcbiAqL1xyXG5cclxuaW1wb3J0IERBTyBmcm9tICdsaWIvZGF0YS90cmFja2VyJztcclxuXHJcblxyXG5cclxuLypcclxuICogUmVhY3QgQ29tcG9uZW50c1xyXG4gKi9cclxuXHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vU2NvcmVib2FyZCc7XHJcbmltcG9ydCBNYXBzIGZyb20gJy4vTWFwcyc7XHJcbmltcG9ydCBMb2cgZnJvbSAnLi9Mb2cnO1xyXG5pbXBvcnQgR3VpbGRzIGZyb20gJy4vR3VpbGRzJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgdXBkYXRlVGltZUludGVydmFsID0gMTAwMDtcclxuXHJcbmNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4gKFxyXG4gICAgPGgxIGlkPSdBcHBMb2FkaW5nJz5cclxuICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPlxyXG4gICAgPC9oMT5cclxuKTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcz17XHJcbiAgICAgICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgICAgUmVhY3QgTGlmZWN5Y2xlXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcblxyXG5cclxuICAgICAgICBjb25zdCBkYXRhTGlzdGVuZXJzID0ge1xyXG4gICAgICAgICAgICBvbk1hdGNoRGV0YWlsczogdGhpcy5vbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBvbkd1aWxkRGV0YWlsczogdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyhkYXRhTGlzdGVuZXJzKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoYXNEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgbWF0Y2g6IHt9LFxyXG4gICAgICAgICAgICBsb2c6IFtdLFxyXG4gICAgICAgICAgICBndWlsZHM6IHt9LFxyXG4gICAgICAgICAgICBub3c6IG5vdygpLFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzLnNldERhdGUgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICAgKCkgPT4gdGhpcy5zZXRTdGF0ZSh7bm93OiBub3coKX0pLFxyXG4gICAgICAgICAgICB1cGRhdGVUaW1lSW50ZXJ2YWxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudERpZE1vdW50KCknKTtcclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy53b3JsZCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYFRyYWNrZXI6OmNvbXBvbmVudFdpbGxNb3VudCgpYCk7XHJcbiAgICAgICAgLy8gc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZywgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICB0aGlzLmRhby5zZXRXb3JsZChuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5pc05ld1NlY29uZChuZXh0U3RhdGUpXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNOZXdMYW5nKG5leHRQcm9wcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3U2Vjb25kKG5leHRTdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5zdGF0ZS5ub3cuaXNTYW1lKG5leHRTdGF0ZS5ub3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnRXaWxsVW5tb3VudCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG5cclxuICAgICAgICB0aGlzLmRhby5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J3RyYWNrZXInPlxyXG5cclxuICAgICAgICAgICAgICAgIHsoIXRoaXMuc3RhdGUuaGFzRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxMb2FkaW5nU3Bpbm5lciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubWF0Y2ggJiYgIV8uaXNFbXB0eSh0aGlzLnN0YXRlLm1hdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxTY29yZWJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubWF0Y2ggJiYgIV8uaXNFbXB0eSh0aGlzLnN0YXRlLm1hdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxNYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5zdGF0ZS5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTI0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZz17dGhpcy5zdGF0ZS5sb2d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17dGhpcy5zdGF0ZS5tYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17dGhpcy5zdGF0ZS5ub3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUuZ3VpbGRzICYmICFfLmlzRW1wdHkodGhpcy5zdGF0ZS5ndWlsZHMpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMjQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEd1aWxkcyBndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICAvLyB1cGRhdGVUaW1lcnMoY2IgPSBfLm5vb3ApIHtcclxuICAgIC8vICAgICBpZiAodGhpcy5fX21vdW50ZWQpIHtcclxuICAgIC8vICAgICAgICAgdHJhY2tlclRpbWVycy51cGRhdGUodGhpcy5zdGF0ZS50aW1lLm9mZnNldCwgY2IpO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9fdGltZW91dHMudXBkYXRlVGltZXJzID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCB1cGRhdGVUaW1lSW50ZXJ2YWwpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcblxyXG5cclxuICAgIG9uTWF0Y2hEZXRhaWxzKG1hdGNoKSB7XHJcbiAgICAgICAgY29uc3QgbG9nID0gZ2V0TG9nKG1hdGNoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0RhdGE6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgICAgICBsb2csXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrbm93bkd1aWxkcyA9IF8ua2V5cyh0aGlzLnN0YXRlLmd1aWxkcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSBnZXROZXdDbGFpbXMobG9nLCBrbm93bkd1aWxkcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRhby5ndWlsZHMubG9va3VwKHVua25vd25HdWlsZHMsIHRoaXMub25HdWlsZERldGFpbHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBvbkd1aWxkRGV0YWlscyhndWlsZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xyXG4gICAgICAgICAgICBzdGF0ZS5ndWlsZHNbZ3VpbGQuaWRdID0gZ3VpbGQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge2d1aWxkczogc3RhdGUuZ3VpbGRzfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIG1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3coKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICogMTAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgPSBsYW5nLnNsdWc7XHJcbiAgICBjb25zdCB3b3JsZE5hbWUgPSB3b3JsZC5uYW1lO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlICAgICA9IFt3b3JsZE5hbWUsICdndzJ3MncnXTtcclxuXHJcbiAgICBpZiAobGFuZ1NsdWcgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZS5qb2luKCcgLSAnKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMb2cobWF0Y2gpIHtcclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKG1hdGNoLm1hcHMpXHJcbiAgICAgICAgLm1hcCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLmZsYXR0ZW4oKVxyXG4gICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgLnNvcnRCeSgnbGFzdEZsaXBwZWQnKVxyXG4gICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAubWFwKG8gPT4ge1xyXG4gICAgICAgICAgICBvLm1hcElkID0gXy5wYXJzZUludChvLmlkLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICBvLmxhc3Rtb2QgPSBtb21lbnQoby5sYXN0bW9kLCAnWCcpO1xyXG4gICAgICAgICAgICBvLmxhc3RGbGlwcGVkID0gbW9tZW50KG8ubGFzdEZsaXBwZWQsICdYJyk7XHJcbiAgICAgICAgICAgIG8ubGFzdENsYWltZWQgPSBtb21lbnQoby5sYXN0Q2xhaW1lZCwgJ1gnKTtcclxuICAgICAgICAgICAgby5leHBpcmVzID0gbW9tZW50KG8ubGFzdEZsaXBwZWQpLmFkZCg1LCAnbWludXRlcycpO1xyXG4gICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5ld0NsYWltcyhsb2csIGtub3duR3VpbGRzKSB7XHJcbiAgICByZXR1cm4gIF9cclxuICAgICAgICAuY2hhaW4obG9nKVxyXG4gICAgICAgIC5yZWplY3QobyA9PiBfLmlzRW1wdHkoby5ndWlsZCkpXHJcbiAgICAgICAgLm1hcCgnZ3VpbGQnKVxyXG4gICAgICAgIC51bmlxKClcclxuICAgICAgICAuZGlmZmVyZW5jZShrbm93bkd1aWxkcylcclxuICAgICAgICAudmFsdWUoKTtcclxufSIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7c2NvcmVzfSkgPT4gKFxyXG4gICAgPGltZ1xyXG4gICAgICAgIHNyYyA9IHtnZXRJbWFnZVNvdXJjZShzY29yZXMpfVxyXG5cclxuICAgICAgICB3aWR0aCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cHM6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5yZWR9LCR7c2NvcmVzLmJsdWV9LCR7c2NvcmVzLmdyZWVufT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IsXHJcbiAgICB0eXBlLFxyXG59KSA9PiAoXHJcbiAgICA8c3BhbiBjbGFzc05hbWUgPSB7YHNwcml0ZSAke3R5cGV9ICR7Y29sb3J9YH0gLz5cclxuKTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe2RpcmVjdGlvbn0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBpZiAoIWRpcmVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvciA9ICdibGFjaycsXHJcbiAgICB0eXBlLFxyXG4gICAgc2l6ZSxcclxufSkgPT4ge1xyXG4gICAgbGV0IHNyYyA9ICcvaW1nL2ljb25zL2Rpc3QvJztcclxuICAgIHNyYyArPSB0eXBlO1xyXG4gICAgaWYgKGNvbG9yICE9PSAnYmxhY2snKSB7XHJcbiAgICAgICAgc3JjICs9ICctJyArIGNvbG9yO1xyXG4gICAgfVxyXG4gICAgc3JjICs9ICcuc3ZnJztcclxuXHJcbiAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgIHNyYz17c3JjfVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGljb24tb2JqZWN0aXZlIGljb24tb2JqZWN0aXZlLSR7dHlwZX1gfVxyXG4gICAgICAgIHdpZHRoPXtzaXplID8gc2l6ZTogbnVsbH1cclxuICAgICAgICBoZWlnaHQ9e3NpemUgPyBzaXplOiBudWxsfVxyXG4gICAgLz47XHJcbn07IiwiXHJcbi8vIG1hdGNoZXNcclxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfTUFUQ0hFUyA9ICdSRUNFSVZFX01BVENIRVMnO1xyXG5leHBvcnQgY29uc3QgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCA9ICdSRUNFSVZFX01BVENIRVNfRkFJTEVEJztcclxuZXhwb3J0IGNvbnN0IFJFUVVFU1RfTUFUQ0hFUyA9ICdSRVFVRVNUX01BVENIRVMnO1xyXG5cclxuLy8gcm91dGVzXHJcbmV4cG9ydCBjb25zdCBTRVRfUk9VVEUgPSAnU0VUX1JPVVRFJztcclxuXHJcbi8vIHRpbWVvdXRzXHJcbmV4cG9ydCBjb25zdCBBRERfVElNRU9VVCA9ICdBRERfVElNRU9VVCc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfVElNRU9VVCA9ICdSRU1PVkVfVElNRU9VVCc7XHJcbi8vIGV4cG9ydCBjb25zdCBSRU1PVkVfQUxMX1RJTUVPVVRTID0gJ1JFTU9WRV9BTExfVElNRU9VVFMnO1xyXG5cclxuLy8gd29ybGRzXHJcbmV4cG9ydCBjb25zdCBTRVRfV09STEQgPSAnU0VUX1dPUkxEJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX1dPUkxEID0gJ0NMRUFSX1dPUkxEJzsiLCJcclxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCc7XHJcblxyXG5jb25zdCBub29wID0gKCkgPT4gbnVsbDtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBnZXRNYXRjaGVzLFxyXG4gICAgZ2V0TWF0Y2hCeVdvcmxkU2x1ZyxcclxuICAgIGdldE1hdGNoQnlXb3JsZElkLFxyXG4gICAgZ2V0R3VpbGRCeUlkLFxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaGVzKHtcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRNYXRjaGVzKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL21hdGNoZXNgKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hCeVdvcmxkU2x1Zyh7XHJcbiAgICB3b3JsZFNsdWcsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hCeVdvcmxkU2x1ZygpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vc3RhdGUuZ3cydzJ3LmNvbS93b3JsZC8ke3dvcmxkU2x1Z31gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hCeVdvcmxkSWQoe1xyXG4gICAgd29ybGRJZCxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRNYXRjaEJ5V29ybGRJZCgpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vc3RhdGUuZ3cydzJ3LmNvbS93b3JsZC8ke3dvcmxkSWR9YClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEd1aWxkQnlJZCh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldEd1aWxkQnlJZCgpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2d1aWxkX2RldGFpbHMuanNvbj9ndWlsZF9pZD0ke2d1aWxkSWR9YClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvblJlcXVlc3QoY2FsbGJhY2tzLCBlcnIsIHJlcykge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6b25SZXF1ZXN0KCknLCBlcnIsIHJlcyAmJiByZXMuYm9keSk7XHJcblxyXG4gICAgaWYgKGVyciB8fCByZXMuZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFja3MuZXJyb3IoZXJyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrcy5zdWNjZXNzKHJlcy5ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsYmFja3MuY29tcGxldGUoKTtcclxufSIsIlxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgYXN5bmMgZnJvbSAnYXN5bmMnO1xyXG5cclxuaW1wb3J0ICogYXMgYXBpIGZyb20gJ2xpYi9hcGknO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIE1vZHVsZSBHbG9iYWxzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgTlVNX1FVRVVFX0NPTkNVUlJFTlQgPSA0O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHVibGljIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaWJHdWlsZHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuX19hc3luY0d1aWxkUXVldWUgPSBhc3luYy5xdWV1ZShcclxuICAgICAgICAgICAgZ2V0R3VpbGREZXRhaWxzRnJvbVF1ZXVlLFxyXG4gICAgICAgICAgICBOVU1fUVVFVUVfQ09OQ1VSUkVOVFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxvb2t1cChndWlsZHMsIG9uRGF0YUxpc3RlbmVyKSB7XHJcbiAgICAgICAgY29uc3QgdG9RdWV1ZSA9IF8ubWFwKFxyXG4gICAgICAgICAgICBndWlsZHMsXHJcbiAgICAgICAgICAgIGd1aWxkSWQgPT4gKHtcclxuICAgICAgICAgICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBvbkRhdGE6IG9uRGF0YUxpc3RlbmVyLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9fYXN5bmNHdWlsZFF1ZXVlLnB1c2godG9RdWV1ZSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlsc0Zyb21RdWV1ZShjYXJnbywgb25Db21wbGV0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dldEd1aWxkRGV0YWlsc0Zyb21RdWV1ZScsIGNhcmdvLCBjYXJnby5ndWlsZElkKTtcclxuXHJcbiAgICBhcGkuZ2V0R3VpbGRCeUlkKHtcclxuICAgICAgICBndWlsZElkOiBjYXJnby5ndWlsZElkLFxyXG4gICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiBvbkd1aWxkRGF0YShkYXRhLCBjYXJnbyksXHJcbiAgICAgICAgY29tcGxldGU6IG9uQ29tcGxldGUsXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvbkd1aWxkRGF0YShkYXRhLCBjYXJnbykge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ29uR3VpbGREYXRhJywgZGF0YSk7XHJcblxyXG4gICAgaWYgKGRhdGEgJiYgIV8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgIGNhcmdvLm9uRGF0YSh7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLmd1aWxkX2lkLFxyXG4gICAgICAgICAgICBuYW1lOiBkYXRhLmd1aWxkX25hbWUsXHJcbiAgICAgICAgICAgIHRhZzogZGF0YS50YWcsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBHdWlsZHNEQU8gZnJvbSAnLi9ndWlsZHMnO1xyXG5pbXBvcnQgYXBpIGZyb20gJ2xpYi9hcGknO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE92ZXJ2aWV3RGF0YVByb3ZpZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0ZW5lcnMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19sYW5nU2x1ZyAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX193b3JsZFNsdWcgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmd1aWxkcyAgICAgID0gbmV3IEd1aWxkc0RBTygpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX19saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBpbml0KHdvcmxkKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6aW5pdCgpJywgbGFuZywgd29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFdvcmxkKHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX19nZXREYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0V29ybGQod29ybGQpIHtcclxuICAgICAgICB0aGlzLl9fd29ybGRJZCA9IHdvcmxkLmlkO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y2xvc2UoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRNYXRjaFdvcmxkcyhtYXRjaCkge1xyXG4gICAgICAgIHJldHVybiBfLm1hcChcclxuICAgICAgICAgICAge3JlZDoge30sIGJsdWU6IHt9LCBncmVlbjoge319LFxyXG4gICAgICAgICAgICAoaiwgY29sb3IpID0+IGdldE1hdGNoV29ybGQobWF0Y2gsIGNvbG9yKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIF9fZ2V0RGF0YSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpfX2dldERhdGEoKScpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYXBpLmdldE1hdGNoQnlXb3JsZFNsdWcoe1xyXG4gICAgICAgIC8vICAgICB3b3JsZFNsdWc6IHRoaXMuX193b3JsZFNsdWcsXHJcbiAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB0aGlzLl9fb25NYXRjaERldGFpbHMoZGF0YSksXHJcbiAgICAgICAgLy8gICAgIGNvbXBsZXRlOiAoKSA9PiB0aGlzLl9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSxcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICBhcGkuZ2V0TWF0Y2hCeVdvcmxkSWQoe1xyXG4gICAgICAgICAgICB3b3JsZElkOiB0aGlzLl9fd29ybGRJZCxcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHRoaXMuX19vbk1hdGNoRGV0YWlscyhkYXRhKSxcclxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19vbk1hdGNoRGV0YWlscyhkYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19vbk1hdGNoRGF0YSgpJywgZGF0YSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChkYXRhICYmICFfLmlzRW1wdHkoZGF0YSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fX2xpc3RlbmVycy5vbk1hdGNoRGV0YWlscyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCAqIDQsIDEwMDAgKiA4KTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RhdGEgcmVmcmVzaDogJywgcmVmcmVzaFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMuZGF0YSA9IHNldFRpbWVvdXQodGhpcy5fX2dldERhdGEuYmluZCh0aGlzKSwgcmVmcmVzaFRpbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgV29ybGRzXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaFdvcmxkKG1hdGNoLCBjb2xvcikge1xyXG4gICAgY29uc3Qgd29ybGRJZCA9IG1hdGNoLndvcmxkc1tjb2xvcl0udG9TdHJpbmcoKTtcclxuXHJcbiAgICBjb25zdCB3b3JsZCA9IF8ubWVyZ2UoXHJcbiAgICAgICAge2NvbG9yOiBjb2xvcn0sXHJcbiAgICAgICAgU1RBVElDLndvcmxkc1t3b3JsZElkXVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gd29ybGQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBTVEFUSUNfTEFOR1MgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL2xhbmdzJztcclxuaW1wb3J0IFNUQVRJQ19XT1JMRFMgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzJztcclxuaW1wb3J0IFNUQVRJQ19PQkpFQ1RJVkVTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVzX3YyX21lcmdlZCc7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGRbbGFuZ1NsdWddLnNsdWddLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlcyA9IFNUQVRJQ19PQkpFQ1RJVkVTO1xyXG5leHBvcnQgY29uc3QgbGFuZ3MgPSBTVEFUSUNfTEFOR1M7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHdvcmxkcyA9IF9cclxuICAgIC5jaGFpbihTVEFUSUNfV09STERTKVxyXG4gICAgLmtleUJ5KCdpZCcpXHJcbiAgICAubWFwVmFsdWVzKCh3b3JsZCkgPT4ge1xyXG4gICAgICAgIF8uZm9yRWFjaChcclxuICAgICAgICAgICAgU1RBVElDX0xBTkdTLFxyXG4gICAgICAgICAgICAobGFuZykgPT5cclxuICAgICAgICAgICAgd29ybGRbbGFuZy5zbHVnXS5saW5rID0gZ2V0V29ybGRMaW5rKGxhbmcuc2x1Zywgd29ybGQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gd29ybGQ7XHJcbiAgICB9KVxyXG4gICAgLnZhbHVlKCk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzTWV0YSA9IF8ua2V5QnkoW1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDEsIGlkOiAnOScsIGRpcmVjdGlvbjogJyd9LCAgICAgICAgICAvLyBzdG9uZW1pc3RcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAgLy8gb3Zlcmxvb2tcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE3JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gbWVuZG9uc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMjAnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAvLyB2ZWxva2FcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE4JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgLy8gYW56XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxOScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgIC8vIG9ncmVcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAgLy8gc3BlbGRhblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnNScsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgICAvLyBwYW5nXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIHZhbGxleVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMTUnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBsYW5nb3JcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzIyJywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8gYnJhdm9zdFxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMTYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBxdWVudGluXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGR1cmlvc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnNycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBkYW5lXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICc4JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgIC8vIHVtYmVyXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICczJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGxvd2xhbmRzXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMScsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIGFsZG9uc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTMnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBqZXJyaWZlclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTInLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyB3aWxkY3JlZWtcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8ga2xvdmFuXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMCcsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIHJvZ3Vlc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnNCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyBnb2xhbnRhXHJcblxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzExMycsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgLy8gcmFtcGFydFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzEwNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgLy8gdW5kZXJjcm9mdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAxLCBpZDogJzExNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgLy8gcGFsYWNlXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTAyJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBhY2FkZW15XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTA0JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyBuZWNyb3BvbGlzXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnOTknLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBsYWJcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMTUnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGhpZGVhd2F5XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTA5JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyByZWZ1Z2VcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMTAnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIG91dHBvc3RcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDUnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGRlcG90XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTAxJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBlbmNhbXBcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDAnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGZhcm1cclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMTYnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgIC8vIHdlbGxcclxuXSwgJ2lkJyk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBtYXBzTWV0YSA9IFtcclxuICAgIHtpZDogMzgsIG5hbWU6ICdFdGVybmFsIEJhdHRsZWdyb3VuZHMnLCBhYmJyOiAnRUInfSxcclxuICAgIHtpZDogMTA5OSwgbmFtZTogJ1JlZCBCb3JkZXJsYW5kcycsIGFiYnI6ICdSZWQnfSxcclxuICAgIHtpZDogMTEwMiwgbmFtZTogJ0dyZWVuIEJvcmRlcmxhbmRzJywgYWJicjogJ0dybid9LFxyXG4gICAge2lkOiAxMTQzLCBuYW1lOiAnQmx1ZSBCb3JkZXJsYW5kcycsIGFiYnI6ICdCbHUnfSxcclxuXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlc0dlbyA9IHtcclxuICAgIGViOiBbW1xyXG4gICAgICAgIHtpZDogJzknLCBkaXJlY3Rpb246ICcnfSwgICAgICAgICAgLy8gc3RvbmVtaXN0XHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgICAvLyBvdmVybG9va1xyXG4gICAgICAgIHtpZDogJzE3JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gbWVuZG9uc1xyXG4gICAgICAgIHtpZDogJzIwJywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgLy8gdmVsb2thXHJcbiAgICAgICAge2lkOiAnMTgnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAvLyBhbnpcclxuICAgICAgICB7aWQ6ICcxOScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgIC8vIG9ncmVcclxuICAgICAgICB7aWQ6ICc2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgIC8vIHNwZWxkYW5cclxuICAgICAgICB7aWQ6ICc1JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgIC8vIHBhbmdcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcyJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIHZhbGxleVxyXG4gICAgICAgIHtpZDogJzE1JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gbGFuZ29yXHJcbiAgICAgICAge2lkOiAnMjInLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBicmF2b3N0XHJcbiAgICAgICAge2lkOiAnMTYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBxdWVudGluXHJcbiAgICAgICAge2lkOiAnMjEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBkdXJpb3NcclxuICAgICAgICB7aWQ6ICc3JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGRhbmVcclxuICAgICAgICB7aWQ6ICc4JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgIC8vIHVtYmVyXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBsb3dsYW5kc1xyXG4gICAgICAgIHtpZDogJzExJywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gYWxkb25zXHJcbiAgICAgICAge2lkOiAnMTMnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBqZXJyaWZlclxyXG4gICAgICAgIHtpZDogJzEyJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gd2lsZGNyZWVrXHJcbiAgICAgICAge2lkOiAnMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBrbG92YW5cclxuICAgICAgICB7aWQ6ICcxMCcsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIHJvZ3Vlc1xyXG4gICAgICAgIHtpZDogJzQnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gZ29sYW50YVxyXG4gICAgXV0sXHJcbiAgICBibDI6IFtbXHJcbiAgICAgICAge2lkOiAnMTEzJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAvLyByYW1wYXJ0XHJcbiAgICAgICAge2lkOiAnMTA2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAvLyB1bmRlcmNyb2Z0XHJcbiAgICAgICAge2lkOiAnMTE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAvLyBwYWxhY2VcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxMDInLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGFjYWRlbXlcclxuICAgICAgICB7aWQ6ICcxMDQnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIG5lY3JvcG9saXNcclxuICAgICAgICB7aWQ6ICc5OScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGxhYlxyXG4gICAgICAgIHtpZDogJzExNScsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gaGlkZWF3YXlcclxuICAgICAgICB7aWQ6ICcxMDknLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIHJlZnVnZVxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzExMCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gb3V0cG9zdFxyXG4gICAgICAgIHtpZDogJzEwNScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZGVwb3RcclxuICAgICAgICB7aWQ6ICcxMDEnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIGVuY2FtcFxyXG4gICAgICAgIHtpZDogJzEwMCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZmFybVxyXG4gICAgICAgIHtpZDogJzExNicsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgLy8gd2VsbFxyXG4gICAgXV0sXHJcbn07XHJcbiIsImltcG9ydCB7IHdvcmxkcyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRXb3JsZEZyb21TbHVnKCknLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICBjb25zdCB3b3JsZCA9IF8uZmluZChcclxuICAgICAgICB3b3JsZHMsXHJcbiAgICAgICAgdyA9PiB3W2xhbmdTbHVnXS5zbHVnID09PSB3b3JsZFNsdWdcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpZDogd29ybGQuaWQsXHJcbiAgICAgICAgLi4ud29ybGRbbGFuZ1NsdWddLFxyXG4gICAgfTtcclxufSIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJy4vbGFuZyc7XHJcbmltcG9ydCBtYXRjaGVzIGZyb20gJy4vbWF0Y2hlcyc7XHJcbmltcG9ydCByb3V0ZSBmcm9tICcuL3JvdXRlJztcclxuaW1wb3J0IHRpbWVvdXRzIGZyb20gJy4vdGltZW91dHMnO1xyXG5pbXBvcnQgd29ybGQgZnJvbSAnLi93b3JsZCc7XHJcblxyXG5cclxuY29uc3QgYXBwUmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgbGFuZyxcclxuICAgIG1hdGNoZXMsXHJcbiAgICByb3V0ZSxcclxuICAgIHRpbWVvdXRzLFxyXG4gICAgd29ybGQsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXBwUmVkdWNlcnM7IiwiXHJcbmNvbnN0IFNFVF9MQU5HID0gJ1NFVF9MQU5HJztcclxuXHJcblxyXG5pbXBvcnQgeyBsYW5ncyB9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuY29uc3QgZGVmYXVsdFNsdWcgPSAnZW4nO1xyXG5jb25zdCBkZWZhdWx0TGFuZyA9IGxhbmdzW2RlZmF1bHRTbHVnXTtcclxuXHJcblxyXG5jb25zdCBsYW5nID0gKHN0YXRlID0gZGVmYXVsdExhbmcsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0VUX0xBTkc6XHJcbiAgICAgICAgICAgIHJldHVybiBsYW5nc1thY3Rpb24uc2x1Z107XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxhbmc7IiwiXHJcbmltcG9ydCB7XHJcbiAgICBSRVFVRVNUX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVMsXHJcbiAgICBSRUNFSVZFX01BVENIRVNfRkFJTEVELFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgIGRhdGE6IHt9LFxyXG4gICAgaWRzOiBbXSxcclxuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxyXG4gICAgbGFzdFVwZGF0ZWQ6IDAsXHJcbn07XHJcblxyXG5cclxuY29uc3QgbWF0Y2hlcyA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIHN0YXRlLCBhY3Rpb24pO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICAvLyBjYXNlIFNFVF9NQVRDSEVTOlxyXG4gICAgICAgIC8vICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgeyBkYXRhOiBhY3Rpb24ubWF0Y2hlcyB9LCBzdGF0ZSk7XHJcblxyXG4gICAgICAgIGNhc2UgUkVRVUVTVF9NQVRDSEVTOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIFJFUVVFU1RfTUFUQ0hFUywgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGNhc2UgUkVDRUlWRV9NQVRDSEVTOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVkdWNlcjo6bWF0Y2hlcycsIFJFQ0VJVkVfTUFUQ0hFUywgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGFjdGlvbi5kYXRhLFxyXG4gICAgICAgICAgICAgICAgaWRzOiBPYmplY3Qua2V5cyhhY3Rpb24uZGF0YSkuc29ydCgpLFxyXG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogYWN0aW9uLmxhc3RVcGRhdGVkLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYXNlIFJFQ0VJVkVfTUFUQ0hFU19GQUlMRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjptYXRjaGVzJywgUkVDRUlWRV9NQVRDSEVTX0ZBSUxFRCwgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hlczsiLCJcclxuaW1wb3J0IHtcclxuICAgIFNFVF9ST1VURSxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgIHBhdGg6ICcvJyxcclxuICAgIHBhcmFtczoge30sXHJcbn07XHJcblxyXG5jb25zdCByb3V0ZSA9IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfUk9VVEU6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF0aCxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogYWN0aW9uLnBhcmFtcyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGU7XHJcbiIsIlxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEFERF9USU1FT1VULFxyXG4gICAgUkVNT1ZFX1RJTUVPVVQsXHJcbiAgICAvLyBSRU1PVkVfQUxMX1RJTUVPVVRTLFxyXG59IGZyb20gJ2NvbnN0YW50cy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuXHJcbmNvbnN0IHRpbWVvdXRzID0gKHN0YXRlID0ge30sIGFjdGlvbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgc3RhdGUsIGFjdGlvbik7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgQUREX1RJTUVPVVQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWR1Y2VyOjp0aW1lb3V0cycsIEFERF9USU1FT1VULCBzdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogYWN0aW9uLnJlZixcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2FzZSBSRU1PVkVfVElNRU9VVDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgUkVNT1ZFX1RJTUVPVVQsIHN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gXy5vbWl0KHN0YXRlLCBhY3Rpb24ubmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGNhc2UgUkVNT1ZFX0FMTF9USU1FT1VUUzpcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3JlZHVjZXI6OnRpbWVvdXRzJywgUkVNT1ZFX0FMTF9USU1FT1VUUywgc3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiB7fTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdGltZW91dHM7IiwiXHJcbmltcG9ydCB7XHJcbiAgICBTRVRfV09STEQsXHJcbiAgICBDTEVBUl9XT1JMRCxcclxufSBmcm9tICdjb25zdGFudHMvYWN0aW9uVHlwZXMnO1xyXG5cclxuaW1wb3J0IHsgZ2V0V29ybGRGcm9tU2x1ZyB9IGZyb20gJ2xpYi93b3JsZHMnO1xyXG5cclxuXHJcbmNvbnN0IHdvcmxkID0gKHN0YXRlID0gbnVsbCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBTRVRfV09STEQ6XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRXb3JsZEZyb21TbHVnKGFjdGlvbi5sYW5nU2x1ZywgYWN0aW9uLndvcmxkU2x1Zyk7XHJcblxyXG4gICAgICAgIGNhc2UgQ0xFQVJfV09STEQ6XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgd29ybGQ7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFwiMTA5OS05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFtbSdzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgSGFtbVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGFtbXMgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIEhhbW1cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwODY0LCA5NTU5LjQ5XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGVzaCdzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgTGVzaFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTGVzaHMgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIExlc2hcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI3OS45NSwgMTIxMTkuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlpha2sncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIFpha2tcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlpha2tzIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBaYWtrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQ0NDgsIDExNDc5LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhdWVyIEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJhdWVyLUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEJhdWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc5My43LCAxMTI1OC40XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXJyZXR0IEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmFycmV0dFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmFycmV0dC1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBCYXJyZXR0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMDkuNzEsIDEzODE4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdlZSBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEdlZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2VlLUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEdlZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1Mzc3LjcsIDEzMTc4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk1jTGFpbidzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgTWNMYWluXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJNY0xhaW5zIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZGUgTWNMYWluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzEyLjgsIDExMjYzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhdHJpY2sncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIFBhdHJpY2tcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlBhdHJpY2tzIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZGUgUGF0cmlja1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MTI4LjgsIDEzODIzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhYmliJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBIYWJpYlwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGFiaWJzIExhZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYW1wZW1lbnQgZCdIYWJpYlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMjk2LjgsIDEzMTgzLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk8nZGVsIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIE8nZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPJ2RlbC1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIE8nZGVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTgzMi40LCA5NTk0LjYzXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJZJ2xhbiBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBZJ2xhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWSdsYW4tQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBZJ2xhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjI0OC40LCAxMjE1NC42XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJLYXknbGkgQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgS2F5J2xpXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLYXknbGktQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBLYXknbGlcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzNyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM0MTYuNCwgMTE1MTQuNl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRXRlcm5hbCBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBFdGVybmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkV3aWdlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSDDqXRlcm5lbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE4MDIuNywgOTY2NC43NV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVhdGhsZXNzIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIElubW9ydGFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUb2Rsb3NlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSBpbW1vcnRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjE4LjcyLCAxMjIyNC43XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJVbmR5aW5nIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIEltcGVyZWNlZGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW5zdGVyYmxpY2hlIE5la3JvcG9sZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTsOpY3JvcG9sZSBpbXDDqXJpc3NhYmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1Mzg2LjcsIDExNTg0LjddXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNyYW5rc2hhZnQgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBQYWxhbmNhbWFuaWphc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS3VyYmVsd2VsbGVuLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IFZpbGVicmVxdWluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyNjQuMywgMTE2MDkuNF1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3BhcmtwbHVnIERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgQnVqw61hc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWsO8bmRmdW5rZW4tRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgQm91Z2llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3NjgwLjMyLCAxNDE2OS40XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGbHl3aGVlbCBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIFZvbGFudGVzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2h3dW5ncmFkLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IEVuZ3JlbmFnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzMyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDg0OC4zLCAxMzUyOS40XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbGlzdGVyaW5nIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gQWNoaWNoYXJyYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJlbm5lbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgZW1icmFzw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODU0LjU4LCAxMDU3OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTY29yY2hpbmcgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBBYnJhc2Fkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlcnNlbmdlbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgY3Vpc2FudGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5NSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjI3MC41OCwgMTMxMzguNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVG9ycmlkIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gU29mb2NhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbMO8aGVuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSB0b3JyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM0MzguNiwgMTI0OTguNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTIwMjIuNSwgMTE3ODkuOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4NDM4LjQ5LCAxNDM0OS45XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTU2MDYuNSwgMTM3MDkuOV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTY0MS43LCAxMTc0OS42XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYwNTcuNywgMTQzMDkuNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMjI1LjcsIDEzNjY5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJveSdzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBSb3lcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJveXMgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBSb3lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyMixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExOTU0LjYsIDEwMDY4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk5vcmZvbGsncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgTm9yZm9sa1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTm9yZm9sa3MgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBOb3Jmb2xrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgzNzAuNiwgMTI2MjguNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2xpdmllcidzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBPbGl2aWVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPbGl2aWVycyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGQnT2xpdmllclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1NTM4LjYsIDExOTg4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhcmNoZWQgT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIEFicmFzYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZXJkw7ZycnRlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIGTDqXZhc3TDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjc3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjU1LCAxMTU3Nl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV2l0aGVyZWQgT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIERlc29sYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWxrZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSByYXZhZ8OpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2NjcxLjA1LCAxNDEzNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmFycmVuIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBBYmFuZG9uYWRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDlmRlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIGTDqWxhYnLDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzgzOSwgMTM0OTZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b2ljIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgRXN0b2ljYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RvaXNjaGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBzdG/Dr3F1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA4MTIuMywgMTAxMDIuOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW1wYXNzaXZlIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgSW1wZXJ0dXJiYWJsZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW5iZWVpbmRydWNrdGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBpbXBhc3NpYmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyMjguMzIsIDEyNjYyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhcmRlbmVkIFJhbXBhcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk11cmFsbGEgRW5kdXJlY2lkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RhaGxoYXJ0ZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IGR1cmNpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQzOTYuMywgMTIwMjIuOV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3NwcmV5J3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCDDgWd1aWxhIFBlc2NhZG9yYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmlzY2hhZGxlci1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkdSBiYWxidXphcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzg4LCAxMDY2MC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYXJyaWVyJ3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCBBZ3VpbHVjaG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlaWhlbi1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkdSBjaXJjYcOodGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIwNCwgMTMyMjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hyaWtlJ3MgUGFsYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYWxhY2lvIGRlbCBBbGNhdWTDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlfDvHJnZXItUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZGUgbGEgcGllLWdyacOoY2hlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzNzIsIDEyNTgwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvZXR0aWdlcidzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEJvZXR0aWdlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQm9ldHRpZ2VycyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgQm9ldHRpZ2VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NTg1LjksIDEwMDM3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkh1Z2hlJ3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgSHVnaGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkh1Z2hlcyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgSHVnaGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjAwMS45LCAxMjU5Ny4xXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCZXJkcm93J3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgQmVyZHJvd1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmVyZHJvd3MgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEJlcmRyb3dcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzE2OS45LCAxMTk1Ny4xXVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEdXN0d2hpc3BlciBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIGRlbCBNdXJtdWxsbyBkZSBQb2x2b1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXMgU3RhdWJmbMO8c3Rlcm5zXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBTb3VmZmxlLXBvdXNzacOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNzczLjMsIDExNjUyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNtYXNoZWRob3BlIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gVHJhZ2Flc3BlcmFuemFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVyIFplcnNjaGxhZ2VuZW4gSG9mZm51bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IFLDqnZlLWJyaXPDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MTg5LjI5LCAxNDIxMi41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMYXN0Z2FzcCBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIGRlbCDDmmx0aW1vIFN1c3Bpcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVzIExldHp0ZW4gU2NobmF1ZmVyc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgRGVybmllci1zb3VwaXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDM1Ny4zLCAxMzU3Mi41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA1OTAuMiwgOTE2OS4xOV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzAwNi4xOSwgMTE3MjkuMl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjc5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDE3NC4yLCAxMTA4OS4yXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGYWl0aGxlYXBcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhbHRvIGRlIEZlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbGF1YmVuc3NwcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2F1dCBkZSBsYSBGb2lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAxMCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTExXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODgyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk0MTcuMzksIDE0NzkwLjddXHJcbiAgICB9LFxyXG4gICAgXCI5NS00M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhlcm8ncyBMb2RnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSGVsZGVuaGFsbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTYyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTMxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMzFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXNjZW5zaW9uIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIGRlIGxhIEFzY2Vuc2nDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkF1ZnN0aWVnc2J1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGRlIGwnQXNjZW5zaW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTI5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGVyIEdlaXN0aG9sbVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGUgSGVhdW1lIHNwaXJpdHVlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVybG9va1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTWlyYWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXVzc2ljaHRzcHVua3Qgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEJlbHbDqWTDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNjk4LjQsIDEzNzYxXVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIExhbmdvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTGFuZ29yLVNjaGx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSYXZpbiBkZSBMYW5nb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNDY1LjMsIDE1NTY5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0zXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBiYWphc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGllZmxhbmQgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEJhc3NlcyB0ZXJyZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTg0MC4yNSwgMTQ5ODMuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTWVuZG9uJ3MgR2FwXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYW5qYSBkZSBNZW5kb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk1lbmRvbnMgU3BhbHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZhaWxsZSBkZSBNZW5kb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMTkyLjcsIDEzNDEwLjhdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVuYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVmVydC1icnV5w6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC03XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYW5lbG9uIFBhc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhc3NhZ2UgRGFuZWxvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk5Ni40LCAxNTU0NS44XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMDNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMDNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTMwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMzBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV29vZGhhdmVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXYWxkLUZyZWlzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9pc3JlZnVnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaGFkYXJhbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBTaGFkYXJhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2hhZGFyYW4tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBTaGFkYXJhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJFdGhlcm9uIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkV0aGVyb24tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0V0aGVyb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NS01NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJyYXMgZHUgVGl0YW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTc1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FzdGlsbG8gUGllZHJhbmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hsb3NzIFN0ZWlubmViZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNow6J0ZWF1IEJydW1lcGllcnJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzMyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYXN0bGVcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA2MjcuMywgMTQ1MDEuM11cclxuICAgIH0sXHJcbiAgICBcIjk1LTU3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ3JhZ3RvcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJvZmZnaXBmZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNvbW1ldCBkZSBIYXV0Y3JhZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC01XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYW5nbG9zcyBSaXNlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmEgUGFuZ2xvc3NcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlBhbmdsb3NzLUFuaMO2aGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyMDEuNiwgMTM3MTguNF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTMzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHJlYW1pbmcgQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgT27DrXJpY2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRyYXVtYnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk1LTQyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkbGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3RzZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyByb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gRHVyaW9zXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEdXJpb3MtU2NobHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJhdmluIGRlIER1cmlvc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyMDcuMSwgMTQ1OTVdXHJcbiAgICB9LFxyXG4gICAgXCI5NS01NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZvZ2hhdmVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIE5lYmxpbm9zb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTmViZWwtRnJlaXN0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJIYXZyZSBncmlzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS01NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWFycm9qYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90d2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwMyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVubGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIHZlcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTIwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmVsb2thIFNsb3BlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTAxNy40LCAxMzQxNC40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgU2FsdG8gQWNpYWdvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyZWNrZW5zZmFsbC1CdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkdSBOb2lyIGTDqWNsaW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTQ1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZWJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJydXlhenVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiS2xvdmFuIEd1bGx5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBLbG92YW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIktsb3Zhbi1TZW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGV0aXQgcmF2aW4gZGUgS2xvdmFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDIxOS41LCAxNTEwNy42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2VuYWdhbCBkZSBKZXJyaWZlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSmVycmlmZXJzIFN1bXBmbG9jaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3NTcuMDYsIDE1NDY3LjhdXHJcbiAgICB9LFxyXG4gICAgXCI5NC02NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxvbmd2aWV3XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJWaXN0YWx1ZW5nYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2VpdHNpY2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMb25ndWV2dWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3BlbGRhbiBDbGVhcmN1dFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2xhcm8gRXNwZWxkaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNwZWxkYW4tS2FobHNjaGxhZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9yw6p0IHJhc8OpZSBkZSBTcGVsZGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0NCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3MzkuODEsIDEzNTg2LjldXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBHb2Rzd29yZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgSG9qYSBEaXZpbmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRhcyBHb3R0ZXNzY2h3ZXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMJ0Vww6llIGRpdmluZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTY0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTM3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWYWxsZXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlZhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUYWwgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIFZhbGzDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEyNjguOSwgMTUwODcuN11cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3VubnloaWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmEgU29sZWFkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU29ubmVuaMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lIGVuc29sZWlsbMOpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTUzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW52YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHZlcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTcxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldpbGRjcmVlayBSdW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBpc3RhIEFycm95b3NhbHZhamVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldpbGRiYWNoLVN0cmVja2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBpc3RlIGR1IHJ1aXNzZWF1IHNhdXZhZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk5NTguMjMsIDE0NjA1LjddXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZGJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXJyb2phXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3RzdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcnV5ZXJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTExMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTExMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNzFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni03MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTQ2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTUyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJhaCdzIEhvcGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzcGVyYW56YSBkZSBBcmFoXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBcmFocyBIb2ZmbnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRXNwb2lyIGQnQXJhaFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUXVlbnRpbiBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFF1ZW50aW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlF1ZW50aW4tU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgUXVlbnRpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5NTEuOCwgMTUxMjEuMl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTIyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQnJhdm9zdCBFc2NhcnBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc1MC4yLCAxNDg1OS40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVldmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVhenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1dGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgQmxldXZhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTE5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2dyZXdhdGNoIEN1dFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGFqbyBkZSBsYSBHdWFyZGlhIGRlbCBPZ3JvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPZ2Vyd2FjaHQtS2FuYWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBlcmPDqWUgZGUgR2FyZG9ncmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTY1LCAxMzk1MV1cclxuICAgIH0sXHJcbiAgICBcIjk1LTc2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJJc2xldGEgQXN0cmFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBc3RyYWxob2xtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJIZWF1bWUgYXN0cmFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNjZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2xhcm8gR29sYW50YVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR29sYW50YS1MaWNodHVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0OSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMTk4LjksIDE1NTIwLjJdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZpY3RvcidzIExvZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgVmVuY2Vkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNpZWdlci1IYWxsZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGF2aWxsb24gZHUgVmFpbnF1ZXVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMjhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYXduJ3MgRXlyaWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZMOkbW1lcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVwYWlyZSBkZSBsJ2F1YmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTU5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkdmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVycm9qb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90dGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMzZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVlbGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnb2F6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXVzZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBibGV1XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTUwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZXdhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXV3YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtQXp1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC04XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlVtYmVyZ2xhZGUgV29vZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvaXMgZCdPbWJyZWNsYWlyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNjgwLjksIDE0MzUzLjZdXHJcbiAgICB9LFxyXG4gICAgXCI5NC02M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTYzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni03MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTcwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTYwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3Rhcmdyb3ZlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBcmJvbGVkYSBkZSBsYXMgRXN0cmVsbGFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVybmhhaW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvc3F1ZXQgw6l0b2lsw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtNDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC00MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDbGlmZnNpZGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlc3Blw7FhZGVyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVsc3dhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZsYW5jIGRlIGZhbGFpc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNjFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbndhdGVyIExvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIGJhamFzIGRlIEFndWF2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG53YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtVmVyZG95YW50ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTIzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFza2FsaW9uIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIEFza2FsaW9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBc2thbGlvbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNzRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJvZ3VlJ3MgUXVhcnJ5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW50ZXJhIGRlbCBQw61jYXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2h1cmtlbmJydWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDYXJyacOocmUgZHUgdm9sZXVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg1MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk2MTIuNTQsIDE0NDYyLjhdXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNoYW1waW9uJ3MgRGVtZXNuZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGF0cmltb25pbyBkZWwgQ2FtcGXDs25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkNoYW1waW9ucyBMYW5kc2l0elwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmllZiBkdSBDaGFtcGlvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFuemFsaWFzIFBhc3NcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbCBkJ0FuemFsaWFzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDI0My4zLCAxMzk3NC40XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5Ni01OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTU4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdvZHNsb3JlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdvdHRlc3NhZ2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhdm9pciBkaXZpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV3VybSBUdW5uZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlTDum5lbCBkZSBsYSBTaWVycGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIld1cm10dW5uZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlR1bm5lbCBkZSBndWl2cmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NixcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY3NTAuOTIsIDEwMjExLjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8wODc0OTFDREQ1NkY3RkI5OThDMzMyMzYwRDMyRkQyNkE4QjJBOTlELzczMDQyOC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFpcnBvcnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFlcm9wdWVydG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZsdWdoYWZlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQcOpcm9wb3J0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MDU0LjE2LCAxMDQyMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0FDQ0NCMUJENjE3NTk4QzBFQTlDNzU2RUFERTUzREYzNkMyNTc4RUMvNzMwNDI3LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGh1bmRlciBIb2xsb3cgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBIb25kb25hZGEgZGVsIFRydWVub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRG9ubmVyc2Vua2VucmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIFRvbm5lY3JldmFzc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjgyLjc3LCAxMDQyNS45XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGb3JnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRm9yamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaG1pZWRlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3JnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIyMy42NCwgMTA2OTIuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0QxQUI1NDFGQzNCRTEyQUM1QkJCMDIwMjEyQkVCRTNGNUMwQzQzMTUvNzMwNDE1LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmdyb3duIEZhbmUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBGYW5vIEdpZ2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOcYmVyd3VjaGVydGVyIEdvdHRlc2hhdXMtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFRlbXBsZSBzdXJkaW1lbnNpb25uw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MixcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTEzLjgzLCA5MDU5Ljk2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaHJpbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhbnR1YXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NocmVpblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2FuY3R1YWlyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODYxNC44OSwgMTAyNDYuNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0I1NzA5OTQxQjAzNTJGRDRDQTNCN0FGREE0Mjg3M0Q4RUZEQjE1QUQvNzMwNDE0LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXV0ZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNDAuNjYsIDkyNTMuOV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0RDMDFFQzQxRDg4MDlCNTlCODVCRUVEQzQ1RTk1NTZENzMwQkQyMUEvNzMwNDEzLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV29ya3Nob3BcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRhbGxlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2Vya3N0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdGVsaWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2ODM3LjYsIDEwODQ1LjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9CMzRDMkUzRDBGMzRGRDAzRjQ0QkI1RUQ0RTE4RENERDAwNTlBNUM0LzczMDQyOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyaWQgRm9ydHJlc3MgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBGb3J0YWxlemEgw4FyaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw7xycmVmZXN0dW5ncmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIGxhIEZvcnRlcmVzc2UgYXJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MyxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2ODIzLjgzLCAxMDQ3OS41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZWdhemUgU3BpcmUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBBZ3VqYSBkZSBNaXJhcGllZHJhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RlaW5ibGljay1aYWNrZW5zdGFicmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFBpYyBkZSBQaWVycmVnYXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI0OS4yMSwgOTc2My44N10sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmVsbCBUb3dlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFuYXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2xvY2tlbnR1cm1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNsb2NoZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MyxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgxODAuNjgsIDEwMzI1LjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENDE4MDc3NEREMDNBNEJDNzI1MkI5NTI2ODBFNDUxRjE2Njc5QTcyLzczMDQxMC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9ic2VydmF0b3J5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJPYnNlcnZhdG9yaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9ic2VydmF0b3JpdW1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk9ic2VydmF0b2lyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzk1My42NywgOTA2Mi43OV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzAxNUNGMTZDNzhERkRBRDc0MkUxQTU2MTNGQjc0QjY0NjNCRjRBNzAvNzMwNDExLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmdyb3duIEZhbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZhbm8gR2lnYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5xiZXJ3dWNoZXJ0ZXMgR290dGVzaGF1c1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVGVtcGxlIHN1cmRpbWVuc2lvbm7DqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzYwNi43LCA4ODgyLjE0XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmlkIEZvcnRyZXNzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGb3J0YWxlemEgw4FyaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw7xycmVmZXN0dW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3J0ZXJlc3NlIGFyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2NDQyLjE3LCAxMDg4MS44XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUeXRvbmUgUGVyY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBlcmNoYSBkZSBUeXRvbmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlR5dG9uZW53YXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGVyY2hvaXIgZGUgVHl0b25lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzg4NC44MSwgOTgwOS4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaHVuZGVyIEhvbGxvd1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSG9uZG9uYWRhIGRlbCBUcnVlbm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRvbm5lcnNlbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUb25uZWNyZXZhc3NlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4NTA2Ljc1LCAxMDgyNC41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvOTYxNUQ5NzVCMTZDMkNGNDZBRjZCMjBFMjU0MUNFRDk5M0VGQTFFRS83MzA0MDkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUeXRvbmUgUGVyY2ggUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBQZXJjaGEgZGUgVHl0b25lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUeXRvbmVud2FydGUtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGR1IFBlcmNob2lyIGRlIFR5dG9uZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc4NTIuODksIDk4NTUuNTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkluZmVybm8ncyBOZWVkbGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWphIGRlbCBJbmZpZXJub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSW5mZXJub25hZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBaWd1aWxsZSBpbmZlcm5hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTA0Ljg0LCAxMDU5OC41XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZWdhemUgU3BpcmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFndWphIGRlIE1pcmFwaWVkcmFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVpbmJsaWNrLVphY2tlbnN0YWJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBpYyBkZSBQaWVycmVnYXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzE2NC40NiwgOTgwNS4xNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW5mZXJubydzIE5lZWRsZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEFndWphIGRlbCBJbmZpZXJub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSW5mZXJub25hZGVsLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBsJ0FpZ3VpbGxlIGluZmVybmFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1ODEuOTEsIDEwMzE2LjRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0YXR1YXJ5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc3RhdHVhcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGF0dWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlN0YXR1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzU1My4xMiwgOTM2MC4xNl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzRDMDExM0I2REYyRTRFMkNCQjkzMjQ0QUQ1MERBNDk0NTZENTAxNEUvNzMwNDEyLnBuZ1wiXHJcbiAgICB9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB0aHVua01pZGRsZXdhcmUoX3JlZikge1xuICB2YXIgZGlzcGF0Y2ggPSBfcmVmLmRpc3BhdGNoO1xuICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIDogbmV4dChhY3Rpb24pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGh1bmtNaWRkbGV3YXJlOyJdfQ==
