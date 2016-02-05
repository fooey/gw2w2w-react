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
var setRoute = exports.setRoute = function setRoute(ctx) {
    return {
        type: 'SET_ROUTE',
        path: ctx.path,
        params: ctx.params
    };
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setWorld = exports.setWorld = function setWorld(langSlug, worldSlug) {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: 'SET_WORLD',
        langSlug: langSlug,
        worldSlug: worldSlug
    };
};

},{}],4:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _page = require('page');

var _page2 = _interopRequireDefault(_page);

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _static = require('lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Langs = require('components/Layout/Langs');

var _Langs2 = _interopRequireDefault(_Langs);

var _NavbarHeader = require('components/Layout/NavbarHeader');

var _NavbarHeader2 = _interopRequireDefault(_NavbarHeader);

var _Footer = require('components/Layout/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Overview = require('components/Overview');

var _Overview2 = _interopRequireDefault(_Overview);

var _Tracker = require('components/Tracker');

var _Tracker2 = _interopRequireDefault(_Tracker);

var _reducers = require('reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _route = require('actions/route');

var _lang = require('actions/lang');

var _world = require('actions/world');

var _worlds = require('lib/worlds');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
* Launch App
*
*/

/*
* React Components
*/

(0, _domready2.default)(function () {
    return start();
});

/*
*
* container
*
*/

var Container = function Container(_ref) {
    var children = _ref.children;

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
};

Container.propTypes = {
    children: _react2.default.PropTypes.node.isRequired,
    world: _react2.default.PropTypes.object
};

// }

function start() {
    var store = (0, _redux.createStore)(_reducers2.default);

    console.clear();
    console.log('Starting Application');

    (0, _page2.default)('/', function () {
        return _page2.default.redirect('/en');
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', function (ctx) {
        console.log('route => ' + ctx.path);

        var lang = STATIC.langs[ctx.params.langSlug];
        var world = (0, _worlds.getWorldFromSlug)(ctx.params.langSlug, ctx.params.worldSlug);

        store.dispatch((0, _route.setRoute)(ctx));
        store.dispatch((0, _lang.setLang)(ctx.params.langSlug));
        store.dispatch((0, _world.setWorld)(ctx.params.langSlug, ctx.params.worldSlug));

        _reactDom2.default.render(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(
                Container,
                null,
                _react2.default.createElement(_Tracker2.default, { lang: lang, world: world })
            )
        ), document.getElementById('react-app'));
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)', function (ctx) {
        console.log('route => ' + ctx.path);

        store.dispatch((0, _route.setRoute)(ctx));
        store.dispatch((0, _lang.setLang)(ctx.params.langSlug));

        _reactDom2.default.render(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(
                Container,
                null,
                _react2.default.createElement(_Overview2.default, null)
            )
        ), document.getElementById('react-app'));
    });

    _page2.default.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true
    });
}

/*
*
* Util
*
*/

},{"actions/lang":1,"actions/route":2,"actions/world":3,"components/Layout/Footer":5,"components/Layout/Langs":7,"components/Layout/NavbarHeader":8,"components/Overview":13,"components/Tracker":24,"domready":"domready","lib/static":34,"lib/worlds":35,"page":"page","react":"react","react-dom":"react-dom","react-redux":"react-redux","reducers":36,"redux":"redux"}],5:[function(require,module,exports){
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

},{"react":"react"}],6:[function(require,module,exports){
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
    // console.log('lang', state.lang);
    return {
        activeLang: state.lang,
        activeWorld: state.world
    };
};

var Lang = function Lang(_ref) {
    var activeLang = _ref.activeLang;
    var activeWorld = _ref.activeWorld;
    var lang = _ref.lang;
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
            { href: getLink(lang, activeWorld) },
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

},{"classnames":"classnames","react":"react","react-redux":"react-redux"}],7:[function(require,module,exports){
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

},{"./LangLink":6,"lib/static":34,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    return _react2.default.createElement(
        'div',
        { className: 'navbar-header' },
        _react2.default.createElement(
            'a',
            { className: 'navbar-brand', href: '/' },
            _react2.default.createElement('img', { src: '/img/logo/logo-96x36.png' })
        )
    );
};

},{"react":"react"}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MatchWorld = require('./MatchWorld');

var _MatchWorld2 = _interopRequireDefault(_MatchWorld);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WORLD_COLORS = ['red', 'blue', 'green'];

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
            return this.props.lang.name !== nextProps.lang.name;
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
                            var worldKey = color;
                            var worldId = match.worlds[worldKey];
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
exports.default = Match;

},{"./MatchWorld":10,"lib/static":34,"react":"react"}],10:[function(require,module,exports){
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

exports.default = function (_ref) {
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

},{"components/common/Icons/Pie":25,"numeral":"numeral","react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

exports.default = function (_ref) {
    var lang = _ref.lang;
    var matches = _ref.matches;
    var region = _ref.region;
    return _react2.default.createElement(
        'div',
        { className: 'RegionMatches' },
        _react2.default.createElement(
            'h2',
            null,
            region.label,
            ' Matches',
            _lodash2.default.isEmpty(matches) ? loadingHtml : null
        ),
        _lodash2.default.chain(matches).sortBy('id').map(function (match) {
            return _react2.default.createElement(_Match2.default, {
                key: match.id,
                lang: lang,
                match: match
            });
        }).value()
    );
};

},{"./Match":9,"lodash":"lodash","react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _static = require('lib/static');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*
* Component Definition
*
*/

exports.default = function (_ref) {
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

},{"lib/static":34,"react":"react"}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _overview = require('lib/data/overview');

var _overview2 = _interopRequireDefault(_overview);

var _Matches = require('./Matches');

var _Matches2 = _interopRequireDefault(_Matches);

var _Worlds = require('./Worlds');

var _Worlds2 = _interopRequireDefault(_Worlds);

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
*   Data
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
    return {
        lang: state.lang,
        world: state.world
    };
};

/*
*
*   Component Definition
*
*/

var Overview = function (_React$Component) {
    _inherits(Overview, _React$Component);

    function Overview(props) {
        _classCallCheck(this, Overview);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Overview).call(this, props));

        _this.dao = new _overview2.default({
            onMatchData: _this.onMatchData.bind(_this)
        });

        _this.state = {
            matchData: {}
        };
        return _this;
    }

    _createClass(Overview, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return this.isNewMatchData(nextState) || this.isNewLang(nextProps);
        }
    }, {
        key: 'isNewMatchData',
        value: function isNewMatchData(nextState) {
            return getLastmod(this.state.matchData) !== getLastmod(nextState.matchData);
        }
    }, {
        key: 'isNewLang',
        value: function isNewLang(nextProps) {
            return this.props.lang.name !== nextProps.lang.name;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            setPageTitle(this.props.lang);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.dao.init(this.props.lang);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.lang.name !== nextProps.lang.name) {
                setPageTitle(nextProps.lang);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.dao.close();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { id: 'overview' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _.map(REGIONS, function (region, regionId) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'col-sm-12', key: regionId },
                            _react2.default.createElement(_Matches2.default, {
                                lang: _this2.props.lang,
                                matches: _.filter(_this2.state.matchData, function (match) {
                                    return match.region === regionId;
                                }),
                                region: region
                            })
                        );
                    })
                ),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _.map(REGIONS, function (region, regionId) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'col-sm-12', key: regionId },
                            _react2.default.createElement(_Worlds2.default, {
                                lang: _this2.props.lang,
                                region: region
                            })
                        );
                    })
                )
            );
        }

        /*
        *
        *   Data Listeners
        *
        */

    }, {
        key: 'onMatchData',
        value: function onMatchData(matchData) {
            this.setState({ matchData: matchData });
        }
    }]);

    return Overview;
}(_react2.default.Component);

Overview.propTypes = {
    lang: _react2.default.PropTypes.object.isRequired
};

Overview = (0, _reactRedux.connect)(mapStateToProps)(
// mapDispatchToProps
Overview);

function getLastmod(matchData) {
    return _.reduce(matchData, function (acc, match) {
        return Math.max(match.lastmod);
    }, 0);
}

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

},{"./Matches":11,"./Worlds":12,"lib/data/overview":31,"react":"react","react-redux":"react-redux"}],14:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Emblem":28,"lodash":"lodash","react":"react"}],15:[function(require,module,exports){
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

},{"components/common/icons/Arrow":27,"components/common/icons/Emblem":28,"components/common/icons/Objective":29,"lib/static":34,"moment":"moment","react":"react"}],16:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Objective":29,"lib/static":34,"react":"react"}],17:[function(require,module,exports){
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

},{"./Entries":15,"./Tabs":16,"react":"react"}],18:[function(require,module,exports){
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

},{"./Objective":19,"classnames":"classnames","lib/static":34,"lodash":"lodash","react":"react"}],19:[function(require,module,exports){
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

},{"classnames":"classnames","components/common/icons/Arrow":27,"components/common/icons/Emblem":28,"components/common/icons/Objective":29,"lib/static":34,"lodash":"lodash","moment":"moment","react":"react"}],20:[function(require,module,exports){
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

},{"./MatchMap":18,"lib/static":34,"lodash":"lodash","react":"react"}],21:[function(require,module,exports){
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

},{"components/common/Icons/Sprite":26,"react":"react"}],22:[function(require,module,exports){
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

},{"./Holdings":21,"lib/static":34,"lodash":"lodash","numeral":"numeral","react":"react"}],23:[function(require,module,exports){
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

},{"./World":22,"lodash":"lodash","react":"react"}],24:[function(require,module,exports){
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

},{"./Guilds":14,"./Log":17,"./Maps":20,"./Scoreboard":23,"lib/data/tracker":33,"lodash":"lodash","moment":"moment","react":"react"}],25:[function(require,module,exports){
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

},{"react":"react"}],26:[function(require,module,exports){
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

},{"react":"react"}],27:[function(require,module,exports){
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

},{"react":"react"}],28:[function(require,module,exports){
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

},{"react":"react"}],29:[function(require,module,exports){
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

},{"react":"react"}],30:[function(require,module,exports){
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

},{"superagent":"superagent"}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _api = require('lib/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OverviewDataProvider = function () {
    function OverviewDataProvider(listeners) {
        _classCallCheck(this, OverviewDataProvider);

        // console.log('lib::data::overview::constructor()');

        this.__mounted = false;
        this.__listeners = listeners;

        this.__timeouts = {};
        this.__intervals = {};
    }

    _createClass(OverviewDataProvider, [{
        key: 'init',
        value: function init() {
            // console.log('lib::data::overview::init()');

            this.__mounted = true;
            this.__getData();
        }
    }, {
        key: 'close',
        value: function close() {
            // console.log('lib::data::overview::close()');

            this.__mounted = false;

            this.__timeouts = _lodash2.default.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _lodash2.default.map(this.__intervals, function (i) {
                return clearInterval(i);
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

            // console.log('lib::data::overview::__getData()');

            _api2.default.getMatches({
                worldId: this.__worldId,
                success: function success(data) {
                    return _this.__onMatchData(data);
                },
                complete: function complete() {
                    return _this.__rescheduleDataUpdate();
                }
            });
        }
    }, {
        key: '__onMatchData',
        value: function __onMatchData(data) {
            // console.log('lib::data::overview::__onMatchData()', textStatus, jqXHR, data);

            if (data && !_lodash2.default.isEmpty(data)) {
                (this.__listeners.onMatchData || _lodash2.default.noop)(data);
            }
        }
    }, {
        key: '__rescheduleDataUpdate',
        value: function __rescheduleDataUpdate() {
            var interval = getInterval();

            // console.log('lib::data::overview::__rescheduleDataUpdate()', interval);

            this.__timeouts.matchData = setTimeout(this.__getData.bind(this), interval);
        }
    }]);

    return OverviewDataProvider;
}();

exports.default = OverviewDataProvider;

function getInterval() {
    return _lodash2.default.random(4000, 8000);
}

},{"lib/api":30,"lodash":"lodash"}],32:[function(require,module,exports){
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

},{"async":"async","lib/api":30,"lodash":"lodash"}],33:[function(require,module,exports){
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

},{"./guilds":32,"lib/api":30,"lib/static":34,"lodash":"lodash"}],34:[function(require,module,exports){
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

},{"gw2w2w-static/data/langs":40,"gw2w2w-static/data/objectives_v2_merged":41,"gw2w2w-static/data/world_names":42,"lodash":"lodash"}],35:[function(require,module,exports){
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

},{"lib/static":34}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _world = require('./world');

var _world2 = _interopRequireDefault(_world);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appReducers = (0, _redux.combineReducers)({
    lang: _lang2.default,
    route: _route2.default,
    world: _world2.default
});

exports.default = appReducers;

},{"./lang":37,"./route":38,"./world":39,"redux":"redux"}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _static = require('lib/static');

var defaultSlug = 'en';
var defaultLang = _static.langs[defaultSlug];

var lang = function lang() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultLang : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'SET_LANG':
            return _static.langs[action.slug];

        default:
            return state;
    }
};

exports.default = lang;

},{"lib/static":34}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaultState = {
    path: '/',
    params: {}
};

var route = function route() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'SET_ROUTE':
            return {
                path: action.path,
                params: action.params
            };

        default:
            return state;
    }
};

exports.default = route;

},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _worlds = require('lib/worlds');

var world = function world() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'SET_WORLD':
            return (0, _worlds.getWorldFromSlug)(action.langSlug, action.worldSlug);

        default:
            return state;
    }
};

exports.default = world;

},{"lib/worlds":35}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFjdGlvbnNcXGxhbmcuanMiLCJhcHBcXGFjdGlvbnNcXHJvdXRlLmpzIiwiYXBwXFxhY3Rpb25zXFx3b3JsZC5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXEZvb3Rlci5qcyIsImFwcFxcY29tcG9uZW50c1xcTGF5b3V0XFxMYW5nc1xcTGFuZ0xpbmsuanMiLCJhcHBcXGNvbXBvbmVudHNcXExheW91dFxcTGFuZ3NcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxMYXlvdXRcXE5hdmJhckhlYWRlci5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXE1hdGNoLmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2hXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxPdmVydmlld1xcV29ybGRzXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcT3ZlcnZpZXdcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxHdWlsZHNcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxMb2dcXEVudHJpZXMuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXExvZ1xcVGFicy5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTG9nXFxpbmRleC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcTWF0Y2hNYXAuanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXE1hcHNcXE9iamVjdGl2ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcTWFwc1xcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXEhvbGRpbmdzLmpzIiwiYXBwXFxjb21wb25lbnRzXFxUcmFja2VyXFxTY29yZWJvYXJkXFxXb3JsZC5qcyIsImFwcFxcY29tcG9uZW50c1xcVHJhY2tlclxcU2NvcmVib2FyZFxcaW5kZXguanMiLCJhcHBcXGNvbXBvbmVudHNcXFRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxjb21wb25lbnRzXFxjb21tb25cXEljb25zXFxQaWUuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcSWNvbnNcXFNwcml0ZS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcQXJyb3cuanMiLCJhcHBcXGNvbXBvbmVudHNcXGNvbW1vblxcaWNvbnNcXEVtYmxlbS5qcyIsImFwcFxcY29tcG9uZW50c1xcY29tbW9uXFxpY29uc1xcT2JqZWN0aXZlLmpzIiwiYXBwXFxsaWJcXGFwaS5qcyIsImFwcFxcbGliXFxkYXRhXFxvdmVydmlldy5qcyIsImFwcFxcbGliXFxkYXRhXFx0cmFja2VyXFxndWlsZHMuanMiLCJhcHBcXGxpYlxcZGF0YVxcdHJhY2tlclxcaW5kZXguanMiLCJhcHBcXGxpYlxcc3RhdGljXFxpbmRleC5qcyIsImFwcFxcbGliXFx3b3JsZHMuanMiLCJhcHBcXHJlZHVjZXJzXFxpbmRleC5qcyIsImFwcFxccmVkdWNlcnNcXGxhbmcuanMiLCJhcHBcXHJlZHVjZXJzXFxyb3V0ZS5qcyIsImFwcFxccmVkdWNlcnNcXHdvcmxkLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNDTyxJQUFNLDRCQUFVLFNBQVYsT0FBVSxPQUFROzs7QUFHM0IsV0FBTztBQUNILGNBQU0sVUFBTjtBQUNBLGtCQUZHO0tBQVAs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdC9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbmV4cG9ydCBjb25zdCBzZXRMYW5nID0gc2x1ZyA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uOjpzZXRMYW5nJywgc2x1Zyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnU0VUX0xBTkcnLFxyXG4gICAgICAgIHNsdWcsXHJcbiAgICB9O1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3Qgc2V0Um91dGUgPSAoY3R4KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdTRVRfUk9VVEUnLFxyXG4gICAgICAgIHBhdGg6IGN0eC5wYXRoLFxyXG4gICAgICAgIHBhcmFtczogY3R4LnBhcmFtcyxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5leHBvcnQgY29uc3Qgc2V0V29ybGQgPSAobGFuZ1NsdWcsIHdvcmxkU2x1ZykgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FjdGlvbjo6c2V0V29ybGQnLCBsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdTRVRfV09STEQnLFxyXG4gICAgICAgIGxhbmdTbHVnLFxyXG4gICAgICAgIHdvcmxkU2x1ZyxcclxuICAgIH07XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IGNvbm5lY3QsIFByb3ZpZGVyICB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcbmltcG9ydCBwYWdlIGZyb20gJ3BhZ2UnO1xyXG5pbXBvcnQgZG9tcmVhZHkgZnJvbSAnZG9tcmVhZHknO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmltcG9ydCBMYW5ncyBmcm9tICdjb21wb25lbnRzL0xheW91dC9MYW5ncyc7XHJcbmltcG9ydCBOYXZiYXJIZWFkZXIgZnJvbSAnY29tcG9uZW50cy9MYXlvdXQvTmF2YmFySGVhZGVyJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICdjb21wb25lbnRzL0xheW91dC9Gb290ZXInO1xyXG5cclxuaW1wb3J0IE92ZXJ2aWV3IGZyb20gJ2NvbXBvbmVudHMvT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdjb21wb25lbnRzL1RyYWNrZXInO1xyXG5cclxuaW1wb3J0IGFwcFJlZHVjZXJzIGZyb20gJ3JlZHVjZXJzJztcclxuXHJcbmltcG9ydCB7c2V0Um91dGV9IGZyb20gJ2FjdGlvbnMvcm91dGUnO1xyXG5pbXBvcnQge3NldExhbmd9IGZyb20gJ2FjdGlvbnMvbGFuZyc7XHJcbmltcG9ydCB7c2V0V29ybGR9IGZyb20gJ2FjdGlvbnMvd29ybGQnO1xyXG5pbXBvcnQge2dldFdvcmxkRnJvbVNsdWd9IGZyb20gJ2xpYi93b3JsZHMnO1xyXG5cclxuLypcclxuKlxyXG4qIExhdW5jaCBBcHBcclxuKlxyXG4qL1xyXG5cclxuZG9tcmVhZHkoKCkgPT4gc3RhcnQoKSk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBjb250YWluZXJcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgQ29udGFpbmVyID0gKHtcclxuICAgIGNoaWxkcmVuLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPSduYXZiYXIgbmF2YmFyLWRlZmF1bHQnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPE5hdmJhckhlYWRlciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMYW5ncyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9J2NvbnRlbnQnIGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgPEZvb3RlciBvYnNmdUVtYWlsPXt7XHJcbiAgICAgICAgICAgICAgICBjaHVua3M6IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddLFxyXG4gICAgICAgICAgICAgICAgcGF0dGVybjogJzAzMTQyJyxcclxuICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5Db250YWluZXIucHJvcFR5cGVzID0ge1xyXG4gICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxufTtcclxuXHJcbi8vIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKGFwcFJlZHVjZXJzKTtcclxuXHJcblxyXG4gICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIEFwcGxpY2F0aW9uJyk7XHJcblxyXG5cclxuICAgIHBhZ2UoJy8nLCAoKSA9PiBwYWdlLnJlZGlyZWN0KCcvZW4nKSk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcikvOndvcmxkU2x1ZyhbYS16LV0rKScsXHJcbiAgICAgICAgY3R4ID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsYW5nID0gU1RBVElDLmxhbmdzW2N0eC5wYXJhbXMubGFuZ1NsdWddO1xyXG4gICAgICAgICAgICBjb25zdCB3b3JsZCA9IGdldFdvcmxkRnJvbVNsdWcoY3R4LnBhcmFtcy5sYW5nU2x1ZywgY3R4LnBhcmFtcy53b3JsZFNsdWcpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goc2V0Um91dGUoY3R4KSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHNldExhbmcoY3R4LnBhcmFtcy5sYW5nU2x1ZykpO1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChzZXRXb3JsZChjdHgucGFyYW1zLmxhbmdTbHVnLCBjdHgucGFyYW1zLndvcmxkU2x1ZykpO1xyXG5cclxuICAgICAgICAgICAgUmVhY3RET00ucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRyYWNrZXIgbGFuZz17bGFuZ30gd29ybGQ9e3dvcmxkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgICAgICAgICAgPC9Qcm92aWRlcj4sXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYXBwJylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHBhZ2UoXHJcbiAgICAgICAgJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpJyxcclxuICAgICAgICBjdHggPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcm91dGUgPT4gJHtjdHgucGF0aH1gKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHNldFJvdXRlKGN0eCkpO1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChzZXRMYW5nKGN0eC5wYXJhbXMubGFuZ1NsdWcpKTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihcclxuICAgICAgICAgICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxPdmVydmlldyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgICAgICAgICAgPC9Qcm92aWRlcj4sXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYXBwJylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxuXHJcbiAgICBwYWdlLnN0YXJ0KHtcclxuICAgICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgICBwb3BzdGF0ZTogdHJ1ZSxcclxuICAgICAgICBkaXNwYXRjaDogdHJ1ZSxcclxuICAgICAgICBoYXNoYmFuZzogZmFsc2UsXHJcbiAgICAgICAgZGVjb2RlVVJMQ29tcG9uZW50czogdHJ1ZSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFV0aWxcclxuKlxyXG4qLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgb2JzZnVFbWFpbCxcclxufSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wteHMtMjQnPlxyXG4gICAgICAgICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9J3NtYWxsIG11dGVkIHRleHQtY2VudGVyJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIMKpIDIwMTMgQXJlbmFOZXQsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5Dc29mdCwgdGhlIGludGVybG9ja2luZyBOQyBsb2dvLCBBcmVuYU5ldCwgR3VpbGQgV2FycywgR3VpbGQgV2FycyBGYWN0aW9ucywgR3VpbGQgV2FycyBOaWdodGZhbGwsIEd1aWxkIFdhcnM6RXllIG9mIHRoZSBOb3J0aCwgR3VpbGQgV2FycyAyLCBhbmQgYWxsIGFzc29jaWF0ZWQgbG9nb3MgYW5kIGRlc2lnbnMgYXJlIHRyYWRlbWFya3Mgb3IgcmVnaXN0ZXJlZCB0cmFkZW1hcmtzIG9mIE5Dc29mdCBDb3Jwb3JhdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFsbCBvdGhlciB0cmFkZW1hcmtzIGFyZSB0aGUgcHJvcGVydHkgb2YgdGhlaXIgcmVzcGVjdGl2ZSBvd25lcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHNlbmQgY29tbWVudHMgYW5kIGJ1Z3MgdG8gPE9ic2Z1RW1haWwgb2JzZnVFbWFpbD17b2JzZnVFbWFpbH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdXBwb3J0aW5nIG1pY3Jvc2VydmljZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPSdodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vJz5ndWlsZHMuZ3cydzJ3LmNvbTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICZuYnNwOyZuZGFzaDsmbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tLyc+c3RhdGUuZ3cydzJ3LmNvbTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICZuYnNwOyZuZGFzaDsmbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly93d3cucGllbHkubmV0Lyc+d3d3LnBpZWx5Lm5ldDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTb3VyY2UgYXZhaWxhYmxlIGF0IDxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ndzJ3MnctcmVhY3QnPmh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ndzJ3MnctcmVhY3Q8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDwvZm9vdGVyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuXHJcbmNvbnN0IE9ic2Z1RW1haWwgPSAoe29ic2Z1RW1haWx9KSA9PiB7XHJcbiAgICBjb25zdCByZWNvbnN0cnVjdGVkID0gb2JzZnVFbWFpbC5wYXR0ZXJuXHJcbiAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgIC5tYXAoaXhDaHVuayA9PiBvYnNmdUVtYWlsLmNodW5rc1tpeENodW5rXSlcclxuICAgICAgICAuam9pbignJyk7XHJcblxyXG4gICAgcmV0dXJuIDxhIGhyZWY9e2BtYWlsdG86JHtyZWNvbnN0cnVjdGVkfWB9PntyZWNvbnN0cnVjdGVkfTwvYT47XHJcbn07IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdsYW5nJywgc3RhdGUubGFuZyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGFjdGl2ZUxhbmc6IHN0YXRlLmxhbmcsXHJcbiAgICAgICAgYWN0aXZlV29ybGQ6IHN0YXRlLndvcmxkLFxyXG4gICAgfTtcclxufTtcclxuXHJcblxyXG5sZXQgTGFuZyA9ICh7XHJcbiAgICBhY3RpdmVMYW5nLFxyXG4gICAgYWN0aXZlV29ybGQsXHJcbiAgICBsYW5nLFxyXG59KSA9PiAgKFxyXG4gICAgPGxpXHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcclxuICAgICAgICAgICAgYWN0aXZlOiBhY3RpdmVMYW5nLmxhYmVsID09PSBsYW5nLmxhYmVsLFxyXG4gICAgICAgIH0pfVxyXG4gICAgICAgIHRpdGxlPXtsYW5nLm5hbWV9XHJcbiAgICA+XHJcbiAgICAgICAgPGEgaHJlZj17Z2V0TGluayhsYW5nLCBhY3RpdmVXb3JsZCl9PlxyXG4gICAgICAgICAgICB7bGFuZy5sYWJlbH1cclxuICAgICAgICA8L2E+XHJcbiAgICA8L2xpPlxyXG4pO1xyXG5MYW5nLnByb3BUeXBlcyA9IHtcclxuICAgIGFjdGl2ZUxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIGFjdGl2ZVdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5MYW5nID0gY29ubmVjdChcclxuICBtYXBTdGF0ZVRvUHJvcHMsXHJcbiAgLy8gbWFwRGlzcGF0Y2hUb1Byb3BzXHJcbikoTGFuZyk7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldExpbmsobGFuZywgd29ybGQpIHtcclxuICAgIHJldHVybiAod29ybGQpXHJcbiAgICAgICAgPyB3b3JsZC5saW5rXHJcbiAgICAgICAgOiBsYW5nLmxpbms7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGFuZzsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCB7IGxhbmdzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5pbXBvcnQgTGFuZ0xpbmsgZnJvbSAnLi9MYW5nTGluayc7XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBMYW5ncyA9ICgpID0+IChcclxuICAgIDxkaXYgaWQ9J25hdi1sYW5ncycgY2xhc3NOYW1lPSdwdWxsLXJpZ2h0Jz5cclxuICAgICAgICA8dWwgY2xhc3NOYW1lID0gJ25hdiBuYXZiYXItbmF2Jz5cclxuICAgICAgICAgICAge18ubWFwKGxhbmdzLCAobGFuZywga2V5KSA9PlxyXG4gICAgICAgICAgICAgICAgPExhbmdMaW5rIGtleT17a2V5fSBsYW5nPXtsYW5nfSAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGFuZ3M7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nbmF2YmFyLWhlYWRlcic+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPSduYXZiYXItYnJhbmQnIGhyZWY9Jy8nPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz0nL2ltZy9sb2dvL2xvZ28tOTZ4MzYucG5nJyAvPlxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvZGl2PlxyXG4pOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IE1hdGNoV29ybGQgZnJvbSAnLi9NYXRjaFdvcmxkJztcclxuXHJcbmltcG9ydCB7d29ybGRzfSBmcm9tICdsaWIvc3RhdGljJztcclxuY29uc3QgV09STERfQ09MT1JTID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdNYXRjaERhdGEobmV4dFByb3BzKVxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzTmV3TGFuZyhuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld01hdGNoRGF0YShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubWF0Y2gubGFzdG1vZCAhPT0gbmV4dFByb3BzLm1hdGNoLmxhc3Rtb2QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7bGFuZywgbWF0Y2h9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hdGNoQ29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J21hdGNoJz48dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFdPUkxEX0NPTE9SUywgKGNvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkS2V5ID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkSWQgID0gbWF0Y2gud29ybGRzW3dvcmxkS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgPSB3b3JsZHNbd29ybGRJZF1bbGFuZy5zbHVnXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB7d29ybGRJZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB7bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BpZSA9IHtjb2xvciA9PT0gJ3JlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT48L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBudW1lcmFsIGZyb20gJ251bWVyYWwnO1xyXG5cclxuaW1wb3J0IFBpZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9JY29ucy9QaWUnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgbWF0Y2gsXHJcbiAgICBzaG93UGllLFxyXG4gICAgd29ybGQsXHJcbn0pID0+ICAoXHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke2NvbG9yfWB9PjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgIHsvKjx0ZCBjbGFzc05hbWU9e2B0ZWFtIGtpbGxzICR7Y29sb3J9YH0+e21hdGNoLmtpbGxzID8gbnVtZXJhbChtYXRjaC5raWxsc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+Ki99XHJcbiAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0gZGVhdGhzICR7Y29sb3J9YH0+e21hdGNoLmRlYXRocyA/IG51bWVyYWwobWF0Y2guZGVhdGhzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke2NvbG9yfWB9PnttYXRjaC5zY29yZXMgPyBudW1lcmFsKG1hdGNoLnNjb3Jlc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+XHJcblxyXG4gICAgICAgIHsoc2hvd1BpZSAmJiBtYXRjaC5zY29yZXMpID8gPHRkIGNsYXNzTmFtZT0ncGllJyByb3dTcGFuPSczJz48UGllIHNjb3Jlcz17bWF0Y2guc2NvcmVzfSBzaXplPXs2MH0gLz48L3RkPiA6IG51bGx9XHJcbiAgICA8L3RyPlxyXG4pOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoIGZyb20gJy4vTWF0Y2gnO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3twYWRkaW5nTGVmdDogJy41ZW0nfX0+PGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nIC8+PC9zcGFuPjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaGVzLFxyXG4gICAgcmVnaW9uLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICB7cmVnaW9uLmxhYmVsfSBNYXRjaGVzXHJcbiAgICAgICAgICAgIHtfLmlzRW1wdHkobWF0Y2hlcykgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcbiAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAge18uY2hhaW4obWF0Y2hlcylcclxuICAgICAgICAgICAgLnNvcnRCeSgnaWQnKVxyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgICAgKG1hdGNoKSA9PlxyXG4gICAgICAgICAgICAgICAgPE1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAga2V5PXttYXRjaC5pZH1cclxuICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoPXttYXRjaH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICB9XHJcbiAgICA8L2Rpdj5cclxuKTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCB7d29ybGRzfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgbGFuZyxcclxuICAgIHJlZ2lvbixcclxufSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J1JlZ2lvbldvcmxkcyc+XHJcbiAgICAgICAgPGgyPntyZWdpb24ubGFiZWx9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgIHtfLmNoYWluKHdvcmxkcylcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIod29ybGQgPT4gd29ybGQucmVnaW9uID09PSByZWdpb24uaWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKHdvcmxkID0+IHdvcmxkW2xhbmcuc2x1Z10pXHJcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCduYW1lJylcclxuICAgICAgICAgICAgICAgIC5tYXAod29ybGQgPT4gPGxpIGtleT17d29ybGQuc2x1Z30+PGEgaHJlZj17d29ybGQubGlua30+e3dvcmxkLm5hbWV9PC9hPjwvbGk+KVxyXG4gICAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuKTsiLCJcclxuLypcclxuKlxyXG4qICAgRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcblxyXG4vKlxyXG4qICAgRGF0YVxyXG4qL1xyXG5cclxuaW1wb3J0IERBTyBmcm9tICdsaWIvZGF0YS9vdmVydmlldyc7XHJcblxyXG5cclxuLypcclxuKiAgIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmltcG9ydCBNYXRjaGVzIGZyb20gJy4vTWF0Y2hlcyc7XHJcbmltcG9ydCBXb3JsZHMgZnJvbSAnLi9Xb3JsZHMnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIENvbXBvbmVudCBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSRUdJT05TID0ge1xyXG4gICAgMToge2xhYmVsOiAnTkEnLCBpZDogJzEnfSxcclxuICAgIDI6IHtsYWJlbDogJ0VVJywgaWQ6ICcyJ30sXHJcbn07XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFJlZHV4IEhlbHBlcnNcclxuKlxyXG4qL1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGFuZzogc3RhdGUubGFuZyxcclxuICAgICAgICB3b3JsZDogc3RhdGUud29ybGQsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyh7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEYXRhOiB0aGlzLm9uTWF0Y2hEYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXRjaERhdGE6IHt9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLmlzTmV3TWF0Y2hEYXRhKG5leHRTdGF0ZSlcclxuICAgICAgICAgICAgfHwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdNYXRjaERhdGEobmV4dFN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldExhc3Rtb2QodGhpcy5zdGF0ZS5tYXRjaERhdGEpICE9PSBnZXRMYXN0bW9kKG5leHRTdGF0ZS5tYXRjaERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kYW8uY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24sIHJlZ2lvbklkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTEyJyBrZXk9e3JlZ2lvbklkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXM9e18uZmlsdGVyKHRoaXMuc3RhdGUubWF0Y2hEYXRhLCBtYXRjaCA9PiBtYXRjaC5yZWdpb24gPT09IHJlZ2lvbklkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb249e3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFdvcmxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb249e3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIERhdGEgTGlzdGVuZXJzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIG9uTWF0Y2hEYXRhKG1hdGNoRGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21hdGNoRGF0YX0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5PdmVydmlldyA9IGNvbm5lY3QoXHJcbiAgbWFwU3RhdGVUb1Byb3BzLFxyXG4gIC8vIG1hcERpc3BhdGNoVG9Qcm9wc1xyXG4pKE92ZXJ2aWV3KTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMYXN0bW9kKG1hdGNoRGF0YSkge1xyXG4gICAgcmV0dXJuIF8ucmVkdWNlKFxyXG4gICAgICAgIG1hdGNoRGF0YSxcclxuICAgICAgICAoYWNjLCBtYXRjaCkgPT4gTWF0aC5tYXgobWF0Y2gubGFzdG1vZCksXHJcbiAgICAgICAgMFxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERpcmVjdCBET00gTWFuaXB1bGF0aW9uXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nKSB7XHJcbiAgICBsZXQgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcbiAgICBpZiAobGFuZy5zbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUuam9pbignIC0gJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJ2aWV3O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG59KSA9PiAoXHJcbiAgICA8dWwgaWQ9J2d1aWxkcycgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkJz5cclxuICAgICAgICB7X1xyXG4gICAgICAgICAgICAuY2hhaW4oZ3VpbGRzKVxyXG4gICAgICAgICAgICAuc29ydEJ5KCduYW1lJylcclxuICAgICAgICAgICAgLm1hcChcclxuICAgICAgICAgICAgICAgIGd1aWxkID0+XHJcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtndWlsZC5pZH0gY2xhc3NOYW1lPSdndWlsZCcgaWQ9e2d1aWxkLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkLmlkfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkSWQ9e2d1aWxkLmlkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz4ge2d1aWxkLm5hbWV9IDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtdGFnJz4gW3tndWlsZC50YWd9XSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAudmFsdWUoKX1cclxuICAgIDwvdWw+XHJcbik7XHJcblxyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5pbXBvcnQgRW1ibGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcbi8vIGltcG9ydCBTcHJpdGUgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvU3ByaXRlJztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuaW1wb3J0IEFycm93SWNvbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9BcnJvdyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxuICAgIGxhbmcsXHJcbiAgICBsb2csXHJcbiAgICBub3csXHJcbiAgICBtYXBGaWx0ZXIsXHJcbiAgICB0eXBlRmlsdGVyLFxyXG59KSA9PiAoXHJcbiAgICA8b2wgaWQ9J2xvZycgY2xhc3NOYW1lPSdsaXN0LXVuc3R5bGVkJz5cclxuICAgICAgICB7Xy5jaGFpbihsb2cpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSlcclxuICAgICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBieU1hcElkKG1hcEZpbHRlciwgZW50cnkpKVxyXG4gICAgICAgICAgICAubWFwKGVudHJ5ID0+XHJcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtlbnRyeS5pZH0gY2xhc3NOYW1lPXtgdGVhbSAke2VudHJ5Lm93bmVyfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQgbG9nLW9iamVjdGl2ZSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1leHBpcmUnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5LmV4cGlyZXMuaXNBZnRlcihub3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG1vbWVudChlbnRyeS5leHBpcmVzLmRpZmYobm93LCAnbWlsbGlzZWNvbmRzJykpLmZvcm1hdCgnbTpzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy10aW1lJz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW9tZW50KCkuZGlmZihlbnRyeS5sYXN0RmxpcHBlZCwgJ2hvdXJzJykgPCA0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZW50cnkubGFzdEZsaXBwZWQuZm9ybWF0KCdoaDptbTpzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBlbnRyeS5sYXN0RmxpcHBlZC5mcm9tTm93KHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctZ2VvJz48QXJyb3dJY29uIGRpcmVjdGlvbj17Z2V0T2JqZWN0aXZlRGlyZWN0aW9uKGVudHJ5KX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctc3ByaXRlJz48T2JqZWN0aXZlSWNvbiBjb2xvcj17ZW50cnkub3duZXJ9IHR5cGU9e2VudHJ5LnR5cGV9IC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyhtYXBGaWx0ZXIgPT09ICcnKSA/IDxsaSBjbGFzc05hbWU9J2xvZy1tYXAnPntnZXRNYXAoZW50cnkpLmFiYnJ9PC9saT4gOiBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctbmFtZSc+e1NUQVRJQy5vYmplY3RpdmVzW2VudHJ5LmlkXS5uYW1lW2xhbmcuc2x1Z119PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qPGxpIGNsYXNzTmFtZT0nbG9nLWNsYWltZWQnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5Lmxhc3RDbGFpbWVkLmlzVmFsaWQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZW50cnkubGFzdENsYWltZWQuZm9ybWF0KCdoaDptbTpzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH08L2xpPiovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsb2ctZ3VpbGQnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5Lmd1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8YSBocmVmPXsnIycgKyBlbnRyeS5ndWlsZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGRJZD17ZW50cnkuZ3VpbGR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtndWlsZHNbZW50cnkuZ3VpbGRdID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC1uYW1lJz4ge2d1aWxkc1tlbnRyeS5ndWlsZF0ubmFtZX0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3VpbGRzW2VudHJ5Lmd1aWxkXSA/IDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtdGFnJz4gW3tndWlsZHNbZW50cnkuZ3VpbGRdLnRhZ31dIDwvc3Bhbj4gOiAgbnVsbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgLnZhbHVlKCl9XHJcbiAgICA8L29sPlxyXG4pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZURpcmVjdGlvbihvYmplY3RpdmUpIHtcclxuICAgIGNvbnN0IGJhc2VJZCA9IG9iamVjdGl2ZS5pZC5zcGxpdCgnLScpWzFdLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtZXRhID0gU1RBVElDLm9iamVjdGl2ZXNNZXRhW2Jhc2VJZF07XHJcblxyXG4gICAgcmV0dXJuIG1ldGEuZGlyZWN0aW9uO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWFwKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgbWFwSWQgPSBvYmplY3RpdmUuaWQuc3BsaXQoJy0nKVswXTtcclxuICAgIHJldHVybiBfLmZpbmQoU1RBVElDLm1hcHNNZXRhLCBtbSA9PiBtbS5pZCA9PSBtYXBJZCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5VHlwZSh0eXBlRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgcmV0dXJuIHR5cGVGaWx0ZXJbZW50cnkudHlwZV07XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBieU1hcElkKG1hcEZpbHRlciwgZW50cnkpIHtcclxuICAgIGlmIChtYXBGaWx0ZXIpIHtcclxuICAgICAgICByZXR1cm4gZW50cnkubWFwSWQgPT09IG1hcEZpbHRlcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSdjbGFzc25hbWVzJztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgbWFwcyxcclxuICAgIG1hcEZpbHRlciA9ICcnLFxyXG4gICAgdHlwZUZpbHRlciA9ICcnLFxyXG5cclxuICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrLFxyXG4gICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgaWQ9J2xvZy10YWJzJyBjbGFzc05hbWU9J2ZsZXgtdGFicyc+XHJcbiAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe3RhYjogdHJ1ZSwgYWN0aXZlOiAhbWFwRmlsdGVyfSl9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVNYXBGaWx0ZXJDbGljaygnJyl9XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbj17J0FsbCd9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIFNUQVRJQy5tYXBzTWV0YSxcclxuICAgICAgICAgICAgICAgIChtbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIChfLnNvbWUobWFwcywgbWF0Y2hNYXAgPT4gbWF0Y2hNYXAuaWQgPT0gbW0uaWQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e21tLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHt0YWI6IHRydWUsIGFjdGl2ZTogbWFwRmlsdGVyID09IG1tLmlkfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVNYXBGaWx0ZXJDbGljayhfLnBhcnNlSW50KG1tLmlkKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17bW0ubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuPXttbS5hYmJyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgWydjYXN0bGUnLCAna2VlcCcsICd0b3dlcicsICdjYW1wJ10sXHJcbiAgICAgICAgICAgICAgICB0ID0+XHJcbiAgICAgICAgICAgICAgICA8YSAga2V5PXt0fVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHR5cGVGaWx0ZXJbdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiB0ID09PSAnY2FzdGxlJyxcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUeXBlRmlsdGVyQ2xpY2sodCl9ID5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZUljb24gdHlwZT17dH0gc2l6ZT17MTh9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcbmltcG9ydCBFbnRyaWVzIGZyb20gJy4vRW50cmllcyc7XHJcbmltcG9ydCBUYWJzIGZyb20gJy4vVGFicyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxvZzogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgZ3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVyOiAnJyxcclxuICAgICAgICAgICAgdHlwZUZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgY2FzdGxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAga2VlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRvd2VyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FtcDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J2xvZy1jb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgPFRhYnNcclxuICAgICAgICAgICAgICAgICAgICBtYXBzPXt0aGlzLnByb3BzLm1hdGNoLm1hcHN9XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZU1hcEZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZVR5cGVGaWx0ZXJDbGljay5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXt0aGlzLnByb3BzLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICBsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nPXt0aGlzLnByb3BzLmxvZ31cclxuICAgICAgICAgICAgICAgICAgICBub3c9e3RoaXMucHJvcHMubm93fVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlcj17dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZUZpbHRlcj17dGhpcy5zdGF0ZS50eXBlRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrKG1hcEZpbHRlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXQgbWFwRmlsdGVyJywgbWFwRmlsdGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWFwRmlsdGVyfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrKHRvZ2dsZVR5cGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndG9nZ2xlIHR5cGVGaWx0ZXInLCB0b2dnbGVUeXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRlLnR5cGVGaWx0ZXJbdG9nZ2xlVHlwZV0gPSAhc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5pbXBvcnQgT2JqZWN0aXZlIGZyb20gJy4vT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIG1hdGNoTWFwLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXAtc2VjdGlvbnMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBnZXRNYXBPYmplY3RpdmVzTWV0YShtYXRjaE1hcC5pZCksXHJcbiAgICAgICAgICAgICAgICAoc2VjdGlvbiwgaXgpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcC1zZWN0aW9uJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzb2xvOiBzZWN0aW9uLmxlbmd0aCA9PT0gMSxcclxuICAgICAgICAgICAgICAgIH0pfSBrZXk9e2l4fT5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChnZW8pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxPYmplY3RpdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17Z2VvLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2dlby5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17Z3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbj17Z2VvLmRpcmVjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoTWFwPXttYXRjaE1hcH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hcE9iamVjdGl2ZXNNZXRhKG1hcElkKSB7XHJcbiAgICBsZXQgbWFwQ29kZSA9ICdibDInO1xyXG5cclxuICAgIGlmIChtYXBJZCA9PT0gMzgpIHtcclxuICAgICAgICBtYXBDb2RlID0gJ2ViJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gX1xyXG4gICAgICAgIC5jaGFpbihTVEFUSUMub2JqZWN0aXZlc01ldGEpXHJcbiAgICAgICAgLmNsb25lRGVlcCgpXHJcbiAgICAgICAgLmZpbHRlcihvbSA9PiBvbS5tYXAgPT09IG1hcENvZGUpXHJcbiAgICAgICAgLmdyb3VwQnkob20gPT4gb20uZ3JvdXApXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvRW1ibGVtJztcclxuaW1wb3J0IEFycm93IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL0Fycm93JztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgaWQsXHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgZGlyZWN0aW9uLFxyXG4gICAgbWF0Y2hNYXAsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuICAgIGNvbnN0IG9iamVjdGl2ZUlkID0gYCR7bWF0Y2hNYXAuaWR9LSR7aWR9YDtcclxuICAgIGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZXNbb2JqZWN0aXZlSWRdO1xyXG4gICAgY29uc3QgbW8gPSBfLmZpbmQobWF0Y2hNYXAub2JqZWN0aXZlcywgbyA9PiBvLmlkID09PSBvYmplY3RpdmVJZCk7XHJcblxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICdsaXN0LXVuc3R5bGVkJzogdHJ1ZSxcclxuICAgICAgICAgICAgJ3RyYWNrLW9iamVjdGl2ZSc6IHRydWUsXHJcbiAgICAgICAgICAgIGZyZXNoOiBub3cuZGlmZihtby5sYXN0RmxpcHBlZCwgJ3NlY29uZHMnKSA8IDMwLFxyXG4gICAgICAgICAgICBleHBpcmluZzogbW8uZXhwaXJlcy5pc0FmdGVyKG5vdykgJiYgbW8uZXhwaXJlcy5kaWZmKG5vdywgJ3NlY29uZHMnKSA8IDMwLFxyXG4gICAgICAgICAgICBleHBpcmVkOiBub3cuaXNBZnRlcihtby5leHBpcmVzKSxcclxuICAgICAgICAgICAgYWN0aXZlOiBub3cuaXNCZWZvcmUobW8uZXhwaXJlcyksXHJcbiAgICAgICAgfSl9PlxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsZWZ0Jz5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stZ2VvJz48QXJyb3cgZGlyZWN0aW9uPXtkaXJlY3Rpb259IC8+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXttby5vd25lcn0gdHlwZT17bW8udHlwZX0gLz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLW5hbWUnPntvTWV0YS5uYW1lW2xhbmcuc2x1Z119PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdyaWdodCc+XHJcbiAgICAgICAgICAgICAgICB7bW8uZ3VpbGRcclxuICAgICAgICAgICAgICAgICAgICA/IDxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndHJhY2stZ3VpbGQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9eycjJyArIG1vLmd1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17Z3VpbGRzW21vLmd1aWxkXSA/IGAke2d1aWxkc1ttby5ndWlsZF0ubmFtZX0gWyR7Z3VpbGRzW21vLmd1aWxkXS50YWd9XWAgOiAnTG9hZGluZy4uLid9XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkSWQ9e21vLmd1aWxkfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLWV4cGlyZSc+XHJcbiAgICAgICAgICAgICAgICAgICAge21vLmV4cGlyZXMuaXNBZnRlcihub3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KG1vLmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICApO1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoTWFwIGZyb20gJy4vTWF0Y2hNYXAnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbWF0Y2gsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuXHJcbiAgICBpZiAoXy5pc0VtcHR5KG1hdGNoKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1hcHMgPSBfLmtleUJ5KG1hdGNoLm1hcHMsICdpZCcpO1xyXG4gICAgY29uc3QgY3VycmVudE1hcElkcyA9IF8ua2V5cyhtYXBzKTtcclxuICAgIGNvbnN0IG1hcHNNZXRhQWN0aXZlID0gXy5maWx0ZXIoXHJcbiAgICAgICAgU1RBVElDLm1hcHNNZXRhLFxyXG4gICAgICAgIG1hcE1ldGEgPT4gXy5pbmRleE9mKGN1cnJlbnRNYXBJZHMsIF8ucGFyc2VJbnQobWFwTWV0YS5pZCkgIT09IC0xKVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxzZWN0aW9uIGlkPSdtYXBzJz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgbWFwc01ldGFBY3RpdmUsXHJcbiAgICAgICAgICAgICAgICAobWFwTWV0YSkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXAnIGtleT17bWFwTWV0YS5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPnttYXBNZXRhLm5hbWV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8TWF0Y2hNYXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXtndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e2xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcE1ldGE9e21hcE1ldGF9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoTWFwPXttYXBzW21hcE1ldGEuaWRdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3c9e25vd31cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC02Jz57PE1hcERldGFpbHMgbWFwS2V5PSdDZW50ZXInIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0NlbnRlcicpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMTgnPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J1JlZEhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ1JlZEhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdCbHVlSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnQmx1ZUhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdHcmVlbkhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0dyZWVuSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAqLyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IFNwcml0ZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9JY29ucy9TcHJpdGUnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvcixcclxuICAgIGhvbGRpbmdzLFxyXG59KSA9PiAoXHJcbiAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LWlubGluZSc+XHJcbiAgICAgICAge18ubWFwKGhvbGRpbmdzLCAodHlwZVF1YW50aXR5LCB0eXBlSW5kZXgpID0+XHJcbiAgICAgICAgICAgIDxsaSBrZXk9e3R5cGVJbmRleH0+XHJcbiAgICAgICAgICAgICAgICA8U3ByaXRlXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgPSB7dHlwZUluZGV4fVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0ge2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3F1YW50aXR5Jz54e3R5cGVRdWFudGl0eX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKX1cclxuICAgIDwvdWw+XHJcbik7XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgbnVtZXJhbCBmcm9tICdudW1lcmFsJztcclxuXHJcbmltcG9ydCBIb2xkaW5ncyBmcm9tICcuL0hvbGRpbmdzJztcclxuXHJcblxyXG5pbXBvcnQge3dvcmxkcyBhcyBXT1JMRFN9IGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcbmNvbnN0IExvYWRpbmcgPSAoKSA9PiAoXHJcbiAgICA8aDEgc3R5bGU9e3toZWlnaHQ6ICc5MHB4JywgZm9udFNpemU6ICczMnB0JywgbGluZUhlaWdodDogJzkwcHgnfX0+XHJcbiAgICAgICAgPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nPjwvaT5cclxuICAgIDwvaDE+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IsXHJcbiAgICBkZWF0aHMsXHJcbiAgICBpZCxcclxuICAgIGhvbGRpbmdzLFxyXG4gICAga2lsbHMsXHJcbiAgICBsYW5nLFxyXG4gICAgc2NvcmUsXHJcbiAgICB0aWNrLFxyXG59KSA9PiB7XHJcbiAgICBjb25zdCB3b3JsZCA9IFdPUkxEU1tpZF1bbGFuZy5zbHVnXTtcclxuXHJcbiAgICBpZiAoIXdvcmxkICYmIF8uaXNFbXB0eSh3b3JsZCkpIHtcclxuICAgICAgICByZXR1cm4gPExvYWRpbmcgLz47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHNjb3JlYm9hcmQgdGVhbS1iZyB0ZWFtIHRleHQtY2VudGVyICR7Y29sb3J9YH0+XHJcbiAgICAgICAgICAgIDxoMT48YSBocmVmPXt3b3JsZC5saW5rfT57d29ybGQubmFtZX08L2E+PC9oMT5cclxuICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N0YXRzJz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgU2NvcmUnPntudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBUaWNrJz57bnVtZXJhbCh0aWNrKS5mb3JtYXQoJyswLDAnKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtraWxsc1xyXG4gICAgICAgICAgICAgICAgICAgID8gPGRpdiBjbGFzc05hbWU9J3N1Yi1zdGF0cyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBLaWxscyc+e251bWVyYWwoa2lsbHMpLmZvcm1hdCgnMCwwJyl9azwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIERlYXRocyc+e251bWVyYWwoZGVhdGhzKS5mb3JtYXQoJzAsMCcpfWQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICA8SG9sZGluZ3NcclxuICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICAgICAgICAgIGhvbGRpbmdzPXtob2xkaW5nc31cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgbWF0Y2gsXHJcbiAgICBsYW5nLFxyXG59KSA9PiAge1xyXG4gICAgY29uc3Qgd29ybGRzUHJvcHMgPSBnZXRXb3JsZHNQcm9wcyhtYXRjaCwgbGFuZyk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3JvdycgaWQ9J3Njb3JlYm9hcmRzJz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgd29ybGRzUHJvcHMsXHJcbiAgICAgICAgICAgICAgICAod29ybGRQcm9wcykgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tOCcga2V5PXt3b3JsZFByb3BzLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8V29ybGQgey4uLndvcmxkUHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkc1Byb3BzKG1hdGNoLCBsYW5nKSB7XHJcbiAgICByZXR1cm4gXy5yZWR1Y2UoXHJcbiAgICAgICAgbWF0Y2gud29ybGRzLFxyXG4gICAgICAgIChhY2MsIHdvcmxkSWQsIGNvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgIGFjY1tjb2xvcl0gPSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgIGxhbmcsXHJcbiAgICAgICAgICAgICAgICBpZDogd29ybGRJZCxcclxuICAgICAgICAgICAgICAgIHNjb3JlOiBfLmdldChtYXRjaCwgWydzY29yZXMnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAgZGVhdGhzOiBfLmdldChtYXRjaCwgWydkZWF0aHMnLCBjb2xvcl0sIDApLFxyXG4gICAgICAgICAgICAgICAga2lsbHM6IF8uZ2V0KG1hdGNoLCBbJ2tpbGxzJywgY29sb3JdLCAwKSxcclxuICAgICAgICAgICAgICAgIHRpY2s6IF8uZ2V0KG1hdGNoLCBbJ3RpY2tzJywgY29sb3JdLCAwKSxcclxuICAgICAgICAgICAgICAgIGhvbGRpbmdzOiBfLmdldChtYXRjaCwgWydob2xkaW5ncycsIGNvbG9yXSwgW10pLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge3JlZDoge30sIGJsdWU6IHt9LCBncmVlbjoge319XHJcbiAgICApO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcbmltcG9ydCBfIGZyb20nbG9kYXNoJztcclxuaW1wb3J0IG1vbWVudCBmcm9tJ21vbWVudCc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqICAgRGF0YVxyXG4gKi9cclxuXHJcbmltcG9ydCBEQU8gZnJvbSAnbGliL2RhdGEvdHJhY2tlcic7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIFJlYWN0IENvbXBvbmVudHNcclxuICovXHJcblxyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL1Njb3JlYm9hcmQnO1xyXG5pbXBvcnQgTWFwcyBmcm9tICcuL01hcHMnO1xyXG5pbXBvcnQgTG9nIGZyb20gJy4vTG9nJztcclxuaW1wb3J0IEd1aWxkcyBmcm9tICcuL0d1aWxkcyc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IHVwZGF0ZVRpbWVJbnRlcnZhbCA9IDEwMDA7XHJcblxyXG5jb25zdCBMb2FkaW5nU3Bpbm5lciA9ICgpID0+IChcclxuICAgIDxoMSBpZD0nQXBwTG9hZGluZyc+XHJcbiAgICAgICAgPGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nPjwvaT5cclxuICAgIDwvaDE+XHJcbik7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXM9e1xyXG4gICAgICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgZGF0YUxpc3RlbmVycyA9IHtcclxuICAgICAgICAgICAgb25NYXRjaERldGFpbHM6IHRoaXMub25NYXRjaERldGFpbHMuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgb25HdWlsZERldGFpbHM6IHRoaXMub25HdWlsZERldGFpbHMuYmluZCh0aGlzKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRhbyA9IG5ldyBEQU8oZGF0YUxpc3RlbmVycyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGFzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIG1hdGNoOiB7fSxcclxuICAgICAgICAgICAgbG9nOiBbXSxcclxuICAgICAgICAgICAgZ3VpbGRzOiB7fSxcclxuICAgICAgICAgICAgbm93OiBub3coKSxcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscy5zZXREYXRlID0gc2V0SW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICgpID0+IHRoaXMuc2V0U3RhdGUoe25vdzogbm93KCl9KSxcclxuICAgICAgICAgICAgdXBkYXRlVGltZUludGVydmFsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IHRydWU7XHJcblxyXG4gICAgICAgIHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcsIHRoaXMucHJvcHMud29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLmRhby5pbml0KHRoaXMucHJvcHMud29ybGQpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBzZXRQYWdlVGl0bGUobmV4dFByb3BzLmxhbmcsIG5leHRQcm9wcy53b3JsZCk7XHJcbiAgICAgICAgdGhpcy5kYW8uc2V0V29ybGQobmV4dFByb3BzLndvcmxkKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdTZWNvbmQobmV4dFN0YXRlKVxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzTmV3TGFuZyhuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld1NlY29uZChuZXh0U3RhdGUpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuc3RhdGUubm93LmlzU2FtZShuZXh0U3RhdGUubm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld0xhbmcobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLmxhbmcubmFtZSAhPT0gbmV4dFByb3BzLmxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVubW91bnQoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IF8ubWFwKHRoaXMuX190aW1lb3V0cywgIHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0gXy5tYXAodGhpcy5fX2ludGVydmFscywgaSA9PiBjbGVhckludGVydmFsKGkpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8uY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6cmVuZGVyKCknKTtcclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSd0cmFja2VyJz5cclxuXHJcbiAgICAgICAgICAgICAgICB7KCF0aGlzLnN0YXRlLmhhc0RhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8TG9hZGluZ1NwaW5uZXIgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLm1hdGNoICYmICFfLmlzRW1wdHkodGhpcy5zdGF0ZS5tYXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8U2NvcmVib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoPXt0aGlzLnN0YXRlLm1hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLm1hdGNoICYmICFfLmlzRW1wdHkodGhpcy5zdGF0ZS5tYXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoPXt0aGlzLnN0YXRlLm1hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3c9e3RoaXMuc3RhdGUubm93fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0yNCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2c9e3RoaXMuc3RhdGUubG9nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3c9e3RoaXMuc3RhdGUubm93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmd1aWxkcyAmJiAhXy5pc0VtcHR5KHRoaXMuc3RhdGUuZ3VpbGRzKSlcclxuICAgICAgICAgICAgICAgICAgICA/IDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTI0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxHdWlsZHMgZ3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgRGF0YSBMaXN0ZW5lcnNcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgLy8gdXBkYXRlVGltZXJzKGNiID0gXy5ub29wKSB7XHJcbiAgICAvLyAgICAgaWYgKHRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAvLyAgICAgICAgIHRyYWNrZXJUaW1lcnMudXBkYXRlKHRoaXMuc3RhdGUudGltZS5vZmZzZXQsIGNiKTtcclxuICAgIC8vICAgICAgICAgdGhpcy5fX3RpbWVvdXRzLnVwZGF0ZVRpbWVycyA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVUaW1lcnMuYmluZCh0aGlzKSwgdXBkYXRlVGltZUludGVydmFsKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG5cclxuXHJcbiAgICBvbk1hdGNoRGV0YWlscyhtYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGxvZyA9IGdldExvZyhtYXRjaCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBoYXNEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaCxcclxuICAgICAgICAgICAgbG9nLFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga25vd25HdWlsZHMgPSBfLmtleXModGhpcy5zdGF0ZS5ndWlsZHMpO1xyXG4gICAgICAgICAgICBjb25zdCB1bmtub3duR3VpbGRzID0gZ2V0TmV3Q2xhaW1zKGxvZywga25vd25HdWlsZHMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kYW8uZ3VpbGRzLmxvb2t1cCh1bmtub3duR3VpbGRzLCB0aGlzLm9uR3VpbGREZXRhaWxzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgb25HdWlsZERldGFpbHMoZ3VpbGQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgc3RhdGUuZ3VpbGRzW2d1aWxkLmlkXSA9IGd1aWxkO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtndWlsZHM6IHN0YXRlLmd1aWxkc307XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBtZXRob2RzXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93KCkge1xyXG4gICAgcmV0dXJuIG1vbWVudChNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSAqIDEwMDApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nLCB3b3JsZCkge1xyXG4gICAgY29uc3QgbGFuZ1NsdWcgID0gbGFuZy5zbHVnO1xyXG4gICAgY29uc3Qgd29ybGROYW1lID0gd29ybGQubmFtZTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUuam9pbignIC0gJyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TG9nKG1hdGNoKSB7XHJcbiAgICByZXR1cm4gX1xyXG4gICAgICAgIC5jaGFpbihtYXRjaC5tYXBzKVxyXG4gICAgICAgIC5tYXAoJ29iamVjdGl2ZXMnKVxyXG4gICAgICAgIC5mbGF0dGVuKClcclxuICAgICAgICAuY2xvbmUoKVxyXG4gICAgICAgIC5zb3J0QnkoJ2xhc3RGbGlwcGVkJylcclxuICAgICAgICAucmV2ZXJzZSgpXHJcbiAgICAgICAgLm1hcChvID0+IHtcclxuICAgICAgICAgICAgby5tYXBJZCA9IF8ucGFyc2VJbnQoby5pZC5zcGxpdCgnLScpWzBdKTtcclxuICAgICAgICAgICAgby5sYXN0bW9kID0gbW9tZW50KG8ubGFzdG1vZCwgJ1gnKTtcclxuICAgICAgICAgICAgby5sYXN0RmxpcHBlZCA9IG1vbWVudChvLmxhc3RGbGlwcGVkLCAnWCcpO1xyXG4gICAgICAgICAgICBvLmxhc3RDbGFpbWVkID0gbW9tZW50KG8ubGFzdENsYWltZWQsICdYJyk7XHJcbiAgICAgICAgICAgIG8uZXhwaXJlcyA9IG1vbWVudChvLmxhc3RGbGlwcGVkKS5hZGQoNSwgJ21pbnV0ZXMnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXROZXdDbGFpbXMobG9nLCBrbm93bkd1aWxkcykge1xyXG4gICAgcmV0dXJuICBfXHJcbiAgICAgICAgLmNoYWluKGxvZylcclxuICAgICAgICAucmVqZWN0KG8gPT4gXy5pc0VtcHR5KG8uZ3VpbGQpKVxyXG4gICAgICAgIC5tYXAoJ2d1aWxkJylcclxuICAgICAgICAudW5pcSgpXHJcbiAgICAgICAgLmRpZmZlcmVuY2Uoa25vd25HdWlsZHMpXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcblxyXG4vKlxyXG4gKiBDb21wb25lbnQgR2xvYmFsc1xyXG4gKi9cclxuXHJcbmNvbnN0IElOU1RBTkNFID0ge1xyXG4gICAgc2l6ZSAgOiA2MCxcclxuICAgIHN0cm9rZTogMixcclxufTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe3Njb3Jlc30pID0+IChcclxuICAgIDxpbWdcclxuICAgICAgICBzcmMgPSB7Z2V0SW1hZ2VTb3VyY2Uoc2NvcmVzKX1cclxuXHJcbiAgICAgICAgd2lkdGggPSB7SU5TVEFOQ0Uuc2l6ZX1cclxuICAgICAgICBoZWlnaHQgPSB7SU5TVEFOQ0Uuc2l6ZX1cclxuICAgIC8+XHJcbik7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SW1hZ2VTb3VyY2Uoc2NvcmVzKSB7XHJcbiAgICByZXR1cm4gYGh0dHBzOlxcL1xcL3d3dy5waWVseS5uZXRcXC8ke0lOU1RBTkNFLnNpemV9XFwvJHtzY29yZXMucmVkfSwke3Njb3Jlcy5ibHVlfSwke3Njb3Jlcy5ncmVlbn0/c3Ryb2tlV2lkdGg9JHtJTlNUQU5DRS5zdHJva2V9YDtcclxufVxyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgdHlwZSxcclxufSkgPT4gKFxyXG4gICAgPHNwYW4gY2xhc3NOYW1lID0ge2BzcHJpdGUgJHt0eXBlfSAke2NvbG9yfWB9IC8+XHJcbik7IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtkaXJlY3Rpb259KSA9PiAoXHJcbiAgICAoZGlyZWN0aW9uKVxyXG4gICAgICAgID8gPGltZyBzcmM9e2dldEFycm93U3JjKGRpcmVjdGlvbil9IGNsYXNzTmFtZT0nYXJyb3cnIC8+XHJcbiAgICAgICAgOiA8c3BhbiAvPlxyXG4pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFByaXZhdGUgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEFycm93U3JjKGRpcmVjdGlvbikge1xyXG4gICAgaWYgKCFkaXJlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ04nKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ25vcnRoJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24uaW5kZXhPZignUycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnc291dGgnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ1cnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ3dlc3QnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdFJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdlYXN0Jyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBzcmMuam9pbignLScpICsgJy5zdmcnO1xyXG59IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tJ3JlYWN0JztcclxuXHJcbmNvbnN0IGltZ1BsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjwvc3ZnPic7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRJZCxcclxuICAgIHNpemUsXHJcbiAgICBjbGFzc05hbWUgPSAnJyxcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHtgZW1ibGVtICR7Y2xhc3NOYW1lfWB9XHJcblxyXG4gICAgICAgICAgICBzcmMgPSB7YGh0dHBzOi8vZ3VpbGRzLmd3Mncydy5jb20vJHtndWlsZElkfS5zdmdgfVxyXG4gICAgICAgICAgICB3aWR0aCA9IHtzaXplID8gc2l6ZSA6IG51bGx9XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHtzaXplID8gc2l6ZSA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICBvbkVycm9yID0geyhlKSA9PiAoZS50YXJnZXQuc3JjID0gaW1nUGxhY2Vob2xkZXIpfVxyXG4gICAgICAgIC8+XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IgPSAnYmxhY2snLFxyXG4gICAgdHlwZSxcclxuICAgIHNpemUsXHJcbn0pID0+IHtcclxuICAgIGxldCBzcmMgPSAnL2ltZy9pY29ucy9kaXN0Lyc7XHJcbiAgICBzcmMgKz0gdHlwZTtcclxuICAgIGlmIChjb2xvciAhPT0gJ2JsYWNrJykge1xyXG4gICAgICAgIHNyYyArPSAnLScgKyBjb2xvcjtcclxuICAgIH1cclxuICAgIHNyYyArPSAnLnN2Zyc7XHJcblxyXG4gICAgcmV0dXJuIDxpbWdcclxuICAgICAgICBzcmM9e3NyY31cclxuICAgICAgICBjbGFzc05hbWU9e2BpY29uLW9iamVjdGl2ZSBpY29uLW9iamVjdGl2ZS0ke3R5cGV9YH1cclxuICAgICAgICB3aWR0aD17c2l6ZSA/IHNpemU6IG51bGx9XHJcbiAgICAgICAgaGVpZ2h0PXtzaXplID8gc2l6ZTogbnVsbH1cclxuICAgIC8+O1xyXG59OyIsIlxyXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcclxuXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiBudWxsO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGdldE1hdGNoZXMsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRTbHVnLFxyXG4gICAgZ2V0TWF0Y2hCeVdvcmxkSWQsXHJcbiAgICBnZXRHdWlsZEJ5SWQsXHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoZXMoe1xyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoZXMoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlc2ApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRTbHVnKHtcclxuICAgIHdvcmxkU2x1ZyxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRNYXRjaEJ5V29ybGRTbHVnKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRTbHVnfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRjaEJ5V29ybGRJZCh7XHJcbiAgICB3b3JsZElkLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZElkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9zdGF0ZS5ndzJ3MncuY29tL3dvcmxkLyR7d29ybGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpbGRCeUlkKHtcclxuICAgIGd1aWxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0R3VpbGRCeUlkKCknKTtcclxuXHJcbiAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldChgaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uP2d1aWxkX2lkPSR7Z3VpbGRJZH1gKVxyXG4gICAgICAgIC5lbmQob25SZXF1ZXN0LmJpbmQodGhpcywge3N1Y2Nlc3MsIGVycm9yLCBjb21wbGV0ZX0pKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uUmVxdWVzdChjYWxsYmFja3MsIGVyciwgcmVzKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpvblJlcXVlc3QoKScsIGVyciwgcmVzICYmIHJlcy5ib2R5KTtcclxuXHJcbiAgICBpZiAoZXJyIHx8IHJlcy5lcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrcy5lcnJvcihlcnIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLnN1Y2Nlc3MocmVzLmJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrcy5jb21wbGV0ZSgpO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3ZlcnZpZXdEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3Ojpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fZ2V0RGF0YSgpJyk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaGVzKHtcclxuICAgICAgICAgICAgd29ybGRJZDogdGhpcy5fX3dvcmxkSWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB0aGlzLl9fb25NYXRjaERhdGEoZGF0YSksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB0aGlzLl9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERhdGEoZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpfX29uTWF0Y2hEYXRhKCknLCB0ZXh0U3RhdHVzLCBqcVhIUiwgZGF0YSk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhICYmICFfLmlzRW1wdHkoZGF0YSkpIHtcclxuICAgICAgICAgICAgKHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERhdGEgfHwgXy5ub29wKShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gZ2V0SW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKScsIGludGVydmFsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzLm1hdGNoRGF0YSA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXREYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGludGVydmFsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SW50ZXJ2YWwoKSB7XHJcbiAgICByZXR1cm4gXy5yYW5kb20oNDAwMCwgODAwMCk7XHJcbn1cclxuIiwiXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBhc3luYyBmcm9tICdhc3luYyc7XHJcblxyXG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogTW9kdWxlIEdsb2JhbHNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBOVU1fUVVFVUVfQ09OQ1VSUkVOVCA9IDQ7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQdWJsaWMgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpYkd1aWxkcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgICAgdGhpcy5fX2FzeW5jR3VpbGRRdWV1ZSA9IGFzeW5jLnF1ZXVlKFxyXG4gICAgICAgICAgICBnZXRHdWlsZERldGFpbHNGcm9tUXVldWUsXHJcbiAgICAgICAgICAgIE5VTV9RVUVVRV9DT05DVVJSRU5UXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgbG9va3VwKGd1aWxkcywgb25EYXRhTGlzdGVuZXIpIHtcclxuICAgICAgICBjb25zdCB0b1F1ZXVlID0gXy5tYXAoXHJcbiAgICAgICAgICAgIGd1aWxkcyxcclxuICAgICAgICAgICAgZ3VpbGRJZCA9PiAoe1xyXG4gICAgICAgICAgICAgICAgZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIG9uRGF0YTogb25EYXRhTGlzdGVuZXIsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19hc3luY0d1aWxkUXVldWUucHVzaCh0b1F1ZXVlKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFByaXZhdGUgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzRnJvbVF1ZXVlKGNhcmdvLCBvbkNvbXBsZXRlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ2V0R3VpbGREZXRhaWxzRnJvbVF1ZXVlJywgY2FyZ28sIGNhcmdvLmd1aWxkSWQpO1xyXG5cclxuICAgIGFwaS5nZXRHdWlsZEJ5SWQoe1xyXG4gICAgICAgIGd1aWxkSWQ6IGNhcmdvLmd1aWxkSWQsXHJcbiAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IG9uR3VpbGREYXRhKGRhdGEsIGNhcmdvKSxcclxuICAgICAgICBjb21wbGV0ZTogb25Db21wbGV0ZSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uR3VpbGREYXRhKGRhdGEsIGNhcmdvKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnb25HdWlsZERhdGEnLCBkYXRhKTtcclxuXHJcbiAgICBpZiAoZGF0YSAmJiAhXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgY2FyZ28ub25EYXRhKHtcclxuICAgICAgICAgICAgaWQ6IGRhdGEuZ3VpbGRfaWQsXHJcbiAgICAgICAgICAgIG5hbWU6IGRhdGEuZ3VpbGRfbmFtZSxcclxuICAgICAgICAgICAgdGFnOiBkYXRhLnRhZyxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IEd1aWxkc0RBTyBmcm9tICcuL2d1aWxkcyc7XHJcbmltcG9ydCBhcGkgZnJvbSAnbGliL2FwaSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3ZlcnZpZXdEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmNvbnN0cnVjdG9yKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2xhbmdTbHVnICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fX3dvcmxkU2x1ZyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZ3VpbGRzICAgICAgPSBuZXcgR3VpbGRzREFPKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX2xpc3RlbmVycyA9IGxpc3RlbmVycztcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IHt9O1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSB7fTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGluaXQod29ybGQpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjppbml0KCknLCBsYW5nLCB3b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0V29ybGQod29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fX2dldERhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRXb3JsZCh3b3JsZCkge1xyXG4gICAgICAgIHRoaXMuX193b3JsZElkID0gd29ybGQuaWQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpjbG9zZSgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IF8ubWFwKHRoaXMuX190aW1lb3V0cywgIHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0gXy5tYXAodGhpcy5fX2ludGVydmFscywgaSA9PiBjbGVhckludGVydmFsKGkpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldE1hdGNoV29ybGRzKG1hdGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKFxyXG4gICAgICAgICAgICB7cmVkOiB7fSwgYmx1ZToge30sIGdyZWVuOiB7fX0sXHJcbiAgICAgICAgICAgIChqLCBjb2xvcikgPT4gZ2V0TWF0Y2hXb3JsZChtYXRjaCwgY29sb3IpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBQcml2YXRlIE1ldGhvZHNcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgX19nZXREYXRhKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6Ol9fZ2V0RGF0YSgpJyk7XHJcblxyXG5cclxuICAgICAgICAvLyBhcGkuZ2V0TWF0Y2hCeVdvcmxkU2x1Zyh7XHJcbiAgICAgICAgLy8gICAgIHdvcmxkU2x1ZzogdGhpcy5fX3dvcmxkU2x1ZyxcclxuICAgICAgICAvLyAgICAgc3VjY2VzczogKGRhdGEpID0+IHRoaXMuX19vbk1hdGNoRGV0YWlscyhkYXRhKSxcclxuICAgICAgICAvLyAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpLFxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIGFwaS5nZXRNYXRjaEJ5V29ybGRJZCh7XHJcbiAgICAgICAgICAgIHdvcmxkSWQ6IHRoaXMuX193b3JsZElkLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4gdGhpcy5fX29uTWF0Y2hEZXRhaWxzKGRhdGEpLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX29uTWF0Y2hEZXRhaWxzKGRhdGEpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpfX29uTWF0Y2hEYXRhKCknLCBkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9fbW91bnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKGRhdGEgJiYgIV8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9fbGlzdGVuZXJzLm9uTWF0Y2hEZXRhaWxzKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSB7XHJcbiAgICAgICAgY29uc3QgcmVmcmVzaFRpbWUgPSBfLnJhbmRvbSgxMDAwICogNCwgMTAwMCAqIDgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGF0YSByZWZyZXNoOiAnLCByZWZyZXNoVGltZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cy5kYXRhID0gc2V0VGltZW91dCh0aGlzLl9fZ2V0RGF0YS5iaW5kKHRoaXMpLCByZWZyZXNoVGltZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBXb3JsZHNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoV29ybGQobWF0Y2gsIGNvbG9yKSB7XHJcbiAgICBjb25zdCB3b3JsZElkID0gbWF0Y2gud29ybGRzW2NvbG9yXS50b1N0cmluZygpO1xyXG5cclxuICAgIGNvbnN0IHdvcmxkID0gXy5tZXJnZShcclxuICAgICAgICB7Y29sb3I6IGNvbG9yfSxcclxuICAgICAgICBTVEFUSUMud29ybGRzW3dvcmxkSWRdXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB3b3JsZDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IFNUQVRJQ19MQU5HUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MnO1xyXG5pbXBvcnQgU1RBVElDX1dPUkxEUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMnO1xyXG5pbXBvcnQgU1RBVElDX09CSkVDVElWRVMgZnJvbSAnZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZXNfdjJfbWVyZ2VkJztcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuICAgIHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZFtsYW5nU2x1Z10uc2x1Z10uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzID0gU1RBVElDX09CSkVDVElWRVM7XHJcbmV4cG9ydCBjb25zdCBsYW5ncyA9IFNUQVRJQ19MQU5HUztcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgd29ybGRzID0gX1xyXG4gICAgLmNoYWluKFNUQVRJQ19XT1JMRFMpXHJcbiAgICAua2V5QnkoJ2lkJylcclxuICAgIC5tYXBWYWx1ZXMoKHdvcmxkKSA9PiB7XHJcbiAgICAgICAgXy5mb3JFYWNoKFxyXG4gICAgICAgICAgICBTVEFUSUNfTEFOR1MsXHJcbiAgICAgICAgICAgIChsYW5nKSA9PlxyXG4gICAgICAgICAgICB3b3JsZFtsYW5nLnNsdWddLmxpbmsgPSBnZXRXb3JsZExpbmsobGFuZy5zbHVnLCB3b3JsZClcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiB3b3JsZDtcclxuICAgIH0pXHJcbiAgICAudmFsdWUoKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXNNZXRhID0gXy5rZXlCeShbXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMSwgaWQ6ICc5JywgZGlyZWN0aW9uOiAnJ30sICAgICAgICAgIC8vIHN0b25lbWlzdFxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgICAvLyBvdmVybG9va1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTcnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyBtZW5kb25zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcyMCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgIC8vIHZlbG9rYVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTgnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAvLyBhbnpcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzE5JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgLy8gb2dyZVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgICAvLyBzcGVsZGFuXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICc1JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgIC8vIHBhbmdcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzInLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gdmFsbGV5XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcxNScsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGxhbmdvclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMjInLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBicmF2b3N0XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcxNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIHF1ZW50aW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzIxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gZHVyaW9zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICc3JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGRhbmVcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzgnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAgLy8gdW1iZXJcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzMnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gbG93bGFuZHNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzExJywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gYWxkb25zXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMycsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGplcnJpZmVyXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxMicsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIHdpbGRjcmVla1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAvLyBrbG92YW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEwJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gcm9ndWVzXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICc0JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIGdvbGFudGFcclxuXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTEzJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAvLyByYW1wYXJ0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTA2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAvLyB1bmRlcmNyb2Z0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDEsIGlkOiAnMTE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAvLyBwYWxhY2VcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDInLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGFjYWRlbXlcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDQnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIG5lY3JvcG9saXNcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICc5OScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGxhYlxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzExNScsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gaGlkZWF3YXlcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMiwgaWQ6ICcxMDknLCBkaXJlY3Rpb246ICdORSd9LCAgICAgIC8vIHJlZnVnZVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzExMCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gb3V0cG9zdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwNScsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZGVwb3RcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMywgaWQ6ICcxMDEnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIGVuY2FtcFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwMCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgLy8gZmFybVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzExNicsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgLy8gd2VsbFxyXG5dLCAnaWQnKTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG1hcHNNZXRhID0gW1xyXG4gICAge2lkOiAzOCwgbmFtZTogJ0V0ZXJuYWwgQmF0dGxlZ3JvdW5kcycsIGFiYnI6ICdFQid9LFxyXG4gICAge2lkOiAxMDk5LCBuYW1lOiAnUmVkIEJvcmRlcmxhbmRzJywgYWJicjogJ1JlZCd9LFxyXG4gICAge2lkOiAxMTAyLCBuYW1lOiAnR3JlZW4gQm9yZGVybGFuZHMnLCBhYmJyOiAnR3JuJ30sXHJcbiAgICB7aWQ6IDExNDMsIG5hbWU6ICdCbHVlIEJvcmRlcmxhbmRzJywgYWJicjogJ0JsdSd9LFxyXG5dO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBvYmplY3RpdmVzR2VvID0ge1xyXG4gICAgZWI6IFtbXHJcbiAgICAgICAge2lkOiAnOScsIGRpcmVjdGlvbjogJyd9LCAgICAgICAgICAvLyBzdG9uZW1pc3RcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgIC8vIG92ZXJsb29rXHJcbiAgICAgICAge2lkOiAnMTcnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyBtZW5kb25zXHJcbiAgICAgICAge2lkOiAnMjAnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAvLyB2ZWxva2FcclxuICAgICAgICB7aWQ6ICcxOCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgIC8vIGFuelxyXG4gICAgICAgIHtpZDogJzE5JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgLy8gb2dyZVxyXG4gICAgICAgIHtpZDogJzYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAgLy8gc3BlbGRhblxyXG4gICAgICAgIHtpZDogJzUnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAgLy8gcGFuZ1xyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzInLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gdmFsbGV5XHJcbiAgICAgICAge2lkOiAnMTUnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgICAvLyBsYW5nb3JcclxuICAgICAgICB7aWQ6ICcyMicsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGJyYXZvc3RcclxuICAgICAgICB7aWQ6ICcxNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIHF1ZW50aW5cclxuICAgICAgICB7aWQ6ICcyMScsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIGR1cmlvc1xyXG4gICAgICAgIHtpZDogJzcnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gZGFuZVxyXG4gICAgICAgIHtpZDogJzgnLCBkaXJlY3Rpb246ICdORSd9LCAgICAgICAgLy8gdW1iZXJcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICczJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgIC8vIGxvd2xhbmRzXHJcbiAgICAgICAge2lkOiAnMTEnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBhbGRvbnNcclxuICAgICAgICB7aWQ6ICcxMycsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGplcnJpZmVyXHJcbiAgICAgICAge2lkOiAnMTInLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyB3aWxkY3JlZWtcclxuICAgICAgICB7aWQ6ICcxNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGtsb3ZhblxyXG4gICAgICAgIHtpZDogJzEwJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAgLy8gcm9ndWVzXHJcbiAgICAgICAge2lkOiAnNCcsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyBnb2xhbnRhXHJcbiAgICBdXSxcclxuICAgIGJsMjogW1tcclxuICAgICAgICB7aWQ6ICcxMTMnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgIC8vIHJhbXBhcnRcclxuICAgICAgICB7aWQ6ICcxMDYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgIC8vIHVuZGVyY3JvZnRcclxuICAgICAgICB7aWQ6ICcxMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgIC8vIHBhbGFjZVxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzEwMicsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gYWNhZGVteVxyXG4gICAgICAgIHtpZDogJzEwNCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gbmVjcm9wb2xpc1xyXG4gICAgICAgIHtpZDogJzk5JywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gbGFiXHJcbiAgICAgICAge2lkOiAnMTE1JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBoaWRlYXdheVxyXG4gICAgICAgIHtpZDogJzEwOScsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gcmVmdWdlXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMTEwJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBvdXRwb3N0XHJcbiAgICAgICAge2lkOiAnMTA1JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBkZXBvdFxyXG4gICAgICAgIHtpZDogJzEwMScsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gZW5jYW1wXHJcbiAgICAgICAge2lkOiAnMTAwJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBmYXJtXHJcbiAgICAgICAge2lkOiAnMTE2JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAvLyB3ZWxsXHJcbiAgICBdXSxcclxufTtcclxuIiwiaW1wb3J0IHsgd29ybGRzIH0gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zykge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dldFdvcmxkRnJvbVNsdWcoKScsIGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgIGNvbnN0IHdvcmxkID0gXy5maW5kKFxyXG4gICAgICAgIHdvcmxkcyxcclxuICAgICAgICB3ID0+IHdbbGFuZ1NsdWddLnNsdWcgPT09IHdvcmxkU2x1Z1xyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkOiB3b3JsZC5pZCxcclxuICAgICAgICAuLi53b3JsZFtsYW5nU2x1Z10sXHJcbiAgICB9O1xyXG59IiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnO1xyXG5cclxuaW1wb3J0IGxhbmcgZnJvbSAnLi9sYW5nJztcclxuaW1wb3J0IHJvdXRlIGZyb20gJy4vcm91dGUnO1xyXG5pbXBvcnQgd29ybGQgZnJvbSAnLi93b3JsZCc7XHJcblxyXG5cclxuY29uc3QgYXBwUmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgbGFuZyxcclxuICAgIHJvdXRlLFxyXG4gICAgd29ybGQsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXBwUmVkdWNlcnM7IiwiaW1wb3J0IHsgbGFuZ3MgfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcbmNvbnN0IGRlZmF1bHRTbHVnID0gJ2VuJztcclxuY29uc3QgZGVmYXVsdExhbmcgPSBsYW5nc1tkZWZhdWx0U2x1Z107XHJcblxyXG5cclxuY29uc3QgbGFuZyA9IChzdGF0ZSA9IGRlZmF1bHRMYW5nLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdTRVRfTEFORyc6XHJcbiAgICAgICAgICAgIHJldHVybiBsYW5nc1thY3Rpb24uc2x1Z107XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxhbmc7IiwiY29uc3QgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgcGF0aDogJy8nLFxyXG4gICAgcGFyYW1zOiB7fSxcclxufTtcclxuXHJcbmNvbnN0IHJvdXRlID0gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdTRVRfUk9VVEUnOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IGFjdGlvbi5wYXJhbXMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlO1xyXG4iLCJcclxuaW1wb3J0IHsgZ2V0V29ybGRGcm9tU2x1ZyB9IGZyb20gJ2xpYi93b3JsZHMnO1xyXG5cclxuXHJcbmNvbnN0IHdvcmxkID0gKHN0YXRlID0gbnVsbCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnU0VUX1dPUkxEJzpcclxuICAgICAgICAgICAgcmV0dXJuIGdldFdvcmxkRnJvbVNsdWcoYWN0aW9uLmxhbmdTbHVnLCBhY3Rpb24ud29ybGRTbHVnKTtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdvcmxkOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcIjEwOTktOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhbW0ncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIEhhbW1cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhbW1zIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBIYW1tXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDg2NCwgOTU1OS40OV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItOTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTk5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxlc2gncyBMYWJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhYm9yYXRvcmlvIGRlIExlc2hcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxlc2hzIExhYm9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWJvcmF0b2lyZSBkZSBMZXNoXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNzkuOTUsIDEyMTE5LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJaYWtrJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBaYWtrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaYWtrcyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgWmFra1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0NDQ4LCAxMTQ3OS41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXVlciBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCYXVlci1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBCYXVlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3OTMuNywgMTEyNTguNF1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmFycmV0dCBGYXJtc3RlYWRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhcnJldHRcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJhcnJldHQtR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgQmFycmV0dFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQ1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjA5LjcxLCAxMzgxOC40XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHZWUgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBHZWVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdlZS1HZWjDtmZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGZXJtZSBHZWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM3Ny43LCAxMzE3OC40XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJNY0xhaW4ncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIE1jTGFpblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTWNMYWlucyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIE1jTGFpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTcxMi44LCAxMTI2My41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXRyaWNrJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBQYXRyaWNrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYXRyaWNrcyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGRlIFBhdHJpY2tcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjEyOC44LCAxMzgyMy41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYWJpYidzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgSGFiaWJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhhYmlicyBMYWdlclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FtcGVtZW50IGQnSGFiaWJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzI5Ni44LCAxMzE4My41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPJ2RlbCBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBPJ2RlbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTydkZWwtQWthZGVtaWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFjYWTDqW1pZSBkZSBPJ2RlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4MzIuNCwgOTU5NC42M11cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiWSdsYW4gQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgWSdsYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlknbGFuLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgWSdsYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNDguNCwgMTIxNTQuNl1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiS2F5J2xpIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIEtheSdsaVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS2F5J2xpLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgS2F5J2xpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDE2LjQsIDExNTE0LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkV0ZXJuYWwgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgRXRlcm5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFd2lnZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgw6l0ZXJuZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzA4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExODAyLjcsIDk2NjQuNzVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlYXRobGVzcyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbm1vcnRhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVG9kbG9zZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1tb3J0ZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIxOC43MiwgMTIyMjQuN11cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVW5keWluZyBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJOZWNyw7Nwb2xpcyBJbXBlcmVjZWRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuc3RlcmJsaWNoZSBOZWtyb3BvbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIk7DqWNyb3BvbGUgaW1ww6lyaXNzYWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM4Ni43LCAxMTU4NC43XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDcmFua3NoYWZ0IERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgUGFsYW5jYW1hbmlqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkt1cmJlbHdlbGxlbi1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBWaWxlYnJlcXVpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY0LjMsIDExNjA5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwYXJrcGx1ZyBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIEJ1asOtYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlrDvG5kZnVua2VuLURlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJEw6lww7R0IEJvdWdpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzY4MC4zMiwgMTQxNjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmx5d2hlZWwgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBWb2xhbnRlc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2Nod3VuZ3JhZC1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBFbmdyZW5hZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzMixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQ4NDguMywgMTM1MjkuNF1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmxpc3RlcmluZyBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIEFjaGljaGFycmFudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJyZW5uZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGVtYnJhc8OpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTg1NC41OCwgMTA1NzguNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2NvcmNoaW5nIFVuZGVyY3JvZnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlPDs3Rhbm8gQWJyYXNhZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJWZXJzZW5nZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIGN1aXNhbnRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYyNzAuNTgsIDEzMTM4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRvcnJpZCBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIFNvZm9jYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2zDvGhlbmRlIEdydWZ0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDcnlwdGUgdG9ycmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzNDM4LjYsIDEyNDk4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzExLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEyMDIyLjUsIDExNzg5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzEwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODQzOC40OSwgMTQzNDkuOV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTA3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1NjA2LjUsIDEzNzA5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzUwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk2NDEuNywgMTE3NDkuNl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGcm9udGVyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3JlbnplIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBGcm9udGnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MDU3LjcsIDE0MzA5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzIyNS43LCAxMzY2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb3kncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgUm95XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3lzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgUm95XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTk1NC42LCAxMDA2OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJOb3Jmb2xrJ3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIE5vcmZvbGtcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5vcmZvbGtzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgTm9yZm9sa1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MzcwLjYsIDEyNjI4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9saXZpZXIncyBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gZGUgT2xpdmllclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2xpdmllcnMgWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkJ09saXZpZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTUzOC42LCAxMTk4OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJQYXJjaGVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBBYnJhc2Fkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVyZMO2cnJ0ZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6l2YXN0w6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDI1NSwgMTE1NzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldpdGhlcmVkIE91dHBvc3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlB1ZXN0byBBdmFuemFkbyBEZXNvbGFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2Vsa2VyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgcmF2YWfDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjY3MS4wNSwgMTQxMzZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTEwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhcnJlbiBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gQWJhbmRvbmFkb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5ZkZXIgQXXDn2VucG9zdGVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdmFudC1wb3N0ZSBkw6lsYWJyw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTM4MzksIDEzNDk2XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9pYyBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVzdG9pY2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0b2lzY2hlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgc3Rvw69xdWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwODEyLjMsIDEwMTAyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkltcGFzc2l2ZSBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEltcGVydHVyYmFibGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlVuYmVlaW5kcnVja3RlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgaW1wYXNzaWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjI4LjMyLCAxMjY2Mi45XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYXJkZW5lZCBSYW1wYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNdXJhbGxhIEVuZHVyZWNpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0YWhsaGFydGVyIEZlc3R1bmdzd2FsbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVtcGFydCBkdXJjaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0Mzk2LjMsIDEyMDIyLjldXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9zcHJleSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgw4FndWlsYSBQZXNjYWRvcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZpc2NoYWRsZXItUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgYmFsYnV6YXJkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTc4OCwgMTA2NjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFycmllcidzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWd1aWx1Y2hvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWloZW4tUGFsYXN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYWxhaXMgZHUgY2lyY2HDqHRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMDQsIDEzMjIwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNocmlrZSdzIFBhbGFjZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFsYWNpbyBkZWwgQWxjYXVkw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXw7xyZ2VyLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGRlIGxhIHBpZS1ncmnDqGNoZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE1MzcyLCAxMjU4MC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb2V0dGlnZXIncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBCb2V0dGlnZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJvZXR0aWdlcnMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEJvZXR0aWdlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTU4NS45LCAxMDAzNy4xXVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIdWdoZSdzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEh1Z2hlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIdWdoZXMgVmVyc3RlY2tcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFudHJlIGRlIEh1Z2hlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYwMDEuOSwgMTI1OTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmVyZHJvdydzIEhpZGVhd2F5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc2NvbmRyaWpvIGRlIEJlcmRyb3dcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJlcmRyb3dzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBCZXJkcm93XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNTcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMxNjkuOSwgMTE5NTcuMV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHVzdHdoaXNwZXIgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgTXVybXVsbG8gZGUgUG9sdm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJydW5uZW4gZGVzIFN0YXViZmzDvHN0ZXJuc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgU291ZmZsZS1wb3Vzc2nDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDc3My4zLCAxMTY1Mi41XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTbWFzaGVkaG9wZSBXZWxsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQb3pvIFRyYWdhZXNwZXJhbnphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlciBaZXJzY2hsYWdlbmVuIEhvZmZudW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBSw6p2ZS1icmlzw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMzOCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzE4OS4yOSwgMTQyMTIuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFzdGdhc3AgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBkZWwgw5psdGltbyBTdXNwaXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlcyBMZXR6dGVuIFNjaG5hdWZlcnNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IERlcm5pZXItc291cGlyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQzNTcuMywgMTM1NzIuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2l0YWRlbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2l1ZGFkZWxhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaaXRhZGVsbGUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIENpdGFkZWxsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNTkwLjIsIDkxNjkuMTldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcwMDYuMTksIDExNzI5LjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTQxNzQuMiwgMTEwODkuMl1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRmFpdGhsZWFwXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhdXQgZGUgbGEgRm9pXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NDE3LjM5LCAxNDc5MC43XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhlbGRlbmhhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC02MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTYyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBdWZzdGllZ3NidWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRlciBHZWlzdGhvbG1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxlIEhlYXVtZSBzcGlyaXR1ZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT3Zlcmxvb2tcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk1pcmFkb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0IHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCZWx2w6lkw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDY5OC40LCAxMzc2MV1cclxuICAgIH0sXHJcbiAgICBcIjM4LTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkxhbmdvci1TY2hsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTQ2NS4zLCAxNTU2OS42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgYmFqYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRpZWZsYW5kIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBCYXNzZXMgdGVycmVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0OCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4NDAuMjUsIDE0OTgzLjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5Mi43LCAxMzQxMC44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlZlcnQtYnJ1ecOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTY0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5OTYuNCwgMTU1NDUuOF1cclxuICAgIH0sXHJcbiAgICBcIjk2LTI3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2Fycmlzb25cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmVzdHVuZyB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gR2Fybmlzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTAzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTAzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0zMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTMwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvb2RoYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2FsZC1GcmVpc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvaXNyZWZ1Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTQxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNoYWRhcmFuLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgU2hhZGFyYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTMyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJFdGhlcm9uLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTUtNTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcmFzIGR1IFRpdGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS03NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC05XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FzdGxlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwNjI3LjMsIDE0NTAxLjNdXHJcbiAgICB9LFxyXG4gICAgXCI5NS01N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTU3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNyYWd0b3BcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyb2ZmZ2lwZmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTb21tZXQgZGUgSGF1dGNyYWdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg0NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjAxLjYsIDEzNzE4LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NC0zM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTMzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NS00MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZGxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgcm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMjFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjA3LjEsIDE0NTk1XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJGb2doYXZlblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk5lYmVsLUZyZWlzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHdhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbmxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG5zZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyB2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVsb2thLUhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTEwMTcuNCwgMTM0MTQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwtQnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWVicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXVzdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCcnV5YXp1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDA5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyMTkuNSwgMTUxMDcuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzU3LjA2LCAxNTQ2Ny44XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMzhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMb25ndmlld1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlaXRzaWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTG9uZ3VldnVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC02XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTcGVsZGFuLUthaGxzY2hsYWdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NzM5LjgxLCAxMzU4Ni45XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEYXMgR290dGVzc2Nod2VydFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC02NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmFsbGV5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJWYWxsZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGFsIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBWYWxsw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMjY4LjksIDE1MDg3LjddXHJcbiAgICB9LFxyXG4gICAgXCI5NS00N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN1bm55aGlsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNvbm5lbmjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNjdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC01M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGV2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG50YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXaWxkYmFjaC1TdHJlY2tlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaXN0ZSBkdSBydWlzc2VhdSBzYXV2YWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5OTU4LjIzLCAxNDYwNS43XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWRicmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemFycm9qYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm90c3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtMTExXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTExXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC0xMTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0xMTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTcxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNzFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS00NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJRdWVudGluLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTUxLjgsIDE1MTIxLjJdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0yMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTIyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3NTAuMiwgMTQ4NTkuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTQ5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIEJsZXV2YWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwNSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC0xOVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg5MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk2NSwgMTM5NTFdXHJcbiAgICB9LFxyXG4gICAgXCI5NS03NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTczXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXN0cmFsaG9sbVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiSGVhdW1lIGFzdHJhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTY2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC00XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDE5OC45LCAxNTUyMC4yXVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTaWVnZXItSGFsbGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhdmlsbG9uIGR1IFZhaW5xdWV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTI4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmTDpG1tZXJ1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlcGFpcmUgZGUgbCdhdWJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni01OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTU5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcnJvam9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHRhbC1adWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTM2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmx1ZWxha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ29henVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1c2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgYmxldVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC01MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTUwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1d2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC04XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTY4MC45LCAxNDM1My42XVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtNzBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni03MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZXZpbGhlYXJ0IExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gQ29yYXpvbnZpbFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVGV1ZmVsc2hlcnotU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgRGlhYmxlY8WTdXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTc1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTY5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTYwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0YXJncm92ZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3Rlcm5oYWluXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb3NxdWV0IMOpdG9pbMOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTQwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlbHN3YW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTYxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGllcnJhcyBiYWphcyBkZSBBZ3VhdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xud2Fzc2VyLVRpZWZsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTgzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtMjNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXNrYWxpb24tSMO8Z2VsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk1LTc0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2FycmnDqHJlIGR1IHZvbGV1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NTEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NjEyLjU0LCAxNDQ2Mi44XVxyXG4gICAgfSxcclxuICAgIFwiOTYtMjRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVzbmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhdHJpbW9uaW8gZGVsIENhbXBlw7NuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJDaGFtcGlvbnMgTGFuZHNpdHpcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZpZWYgZHUgQ2hhbXBpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTg0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyNDMuMywgMTM5NzQuNF1cclxuICAgIH0sXHJcbiAgICBcIjk1LTcyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNzJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGFlbW9uc3BlbGwgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBEYWVtb25pYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW56YXViZXItU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgZGUgTWFsZMOpbW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTYtNThcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni01OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHb2RzbG9yZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHb3R0ZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYXZvaXIgZGl2aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIld1cm0gVHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUw7puZWwgZGUgbGEgU2llcnBlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXdXJtdHVubmVsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUdW5uZWwgZGUgZ3VpdnJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs2NzUwLjkyLCAxMDIxMS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvMDg3NDkxQ0RENTZGN0ZCOTk4QzMzMjM2MEQzMkZEMjZBOEIyQTk5RC83MzA0MjgucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBaXJwb3J0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZXJvcHVlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGbHVnaGFmZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkHDqXJvcG9ydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzA1NC4xNiwgMTA0MjFdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9BQ0NDQjFCRDYxNzU5OEMwRUE5Qzc1NkVBREU1M0RGMzZDMjU3OEVDLzczMDQyNy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRodW5kZXIgSG9sbG93IFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgSG9uZG9uYWRhIGRlbCBUcnVlbm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRvbm5lcnNlbmtlbnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBUb25uZWNyZXZhc3NlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODI4Mi43NywgMTA0MjUuOV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRm9yZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZvcmphXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2htaWVkZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9yZ2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMjMuNjQsIDEwNjkyLjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EMUFCNTQxRkMzQkUxMkFDNUJCQjAyMDIxMkJFQkUzRjVDMEM0MzE1LzczMDQxNS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRmFubyBHaWdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDnGJlcnd1Y2hlcnRlciBHb3R0ZXNoYXVzLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBUZW1wbGUgc3VyZGltZW5zaW9ubsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUxMy44MywgOTA1OS45Nl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU2hyaW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTYW50dWFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJlaW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlNhbmN0dWFpcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg2MTQuODksIDEwMjQ2LjRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9CNTcwOTk0MUIwMzUyRkQ0Q0EzQjdBRkRBNDI4NzNEOEVGREIxNUFELzczMDQxNC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF1dGVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjQwLjY2LCA5MjUzLjldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9EQzAxRUM0MUQ4ODA5QjU5Qjg1QkVFREM0NUU5NTU2RDczMEJEMjFBLzczMDQxMy5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIldvcmtzaG9wXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUYWxsZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlcmtzdGF0dFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXRlbGllclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTUyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgzNy42LCAxMDg0NS4xXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQjM0QzJFM0QwRjM0RkQwM0Y0NEJCNUVENEUxOERDREQwMDU5QTVDNC83MzA0MjkucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmlkIEZvcnRyZXNzIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ3JlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkZSBsYSBGb3J0ZXJlc3NlIGFyaWRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjgyMy44MywgMTA0NzkuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgQWd1amEgZGUgTWlyYXBpZWRyYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZWluYmxpY2stWmFja2Vuc3RhYnJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcyNDkuMjEsIDk3NjMuODddLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJlbGwgVG93ZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbmFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsb2NrZW50dXJtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDbG9jaGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MTgwLjY4LCAxMDMyNS4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDQxODA3NzRERDAzQTRCQzcyNTJCOTUyNjgwRTQ1MUYxNjY3OUE3Mi83MzA0MTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPYnNlcnZhdG9yeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiT2JzZXJ2YXRvcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJPYnNlcnZhdG9yaXVtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJPYnNlcnZhdG9pcmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc5NTMuNjcsIDkwNjIuNzldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8wMTVDRjE2Qzc4REZEQUQ3NDJFMUE1NjEzRkI3NEI2NDYzQkY0QTcwLzczMDQxMS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJncm93biBGYW5lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGYW5vIEdpZ2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOcYmVyd3VjaGVydGVzIEdvdHRlc2hhdXNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlRlbXBsZSBzdXJkaW1lbnNpb25uw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2MSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc2MDYuNywgODg4Mi4xNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJpZCBGb3J0cmVzc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRm9ydGFsZXphIMOBcmlkYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMO8cnJlZmVzdHVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRm9ydGVyZXNzZSBhcmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjQ0Mi4xNywgMTA4ODEuOF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQZXJjaGEgZGUgVHl0b25lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUeXRvbmVud2FydGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBlcmNob2lyIGRlIFR5dG9uZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc4ODQuODEsIDk4MDkuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGh1bmRlciBIb2xsb3dcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZWwgVHJ1ZW5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEb25uZXJzZW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVG9ubmVjcmV2YXNzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODUwNi43NSwgMTA4MjQuNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzk2MTVEOTc1QjE2QzJDRjQ2QUY2QjIwRTI1NDFDRUQ5OTNFRkExRUUvNzMwNDA5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVHl0b25lIFBlcmNoIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgUGVyY2hhIGRlIFR5dG9uZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHl0b25lbndhcnRlLVJlYWt0b3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlLDqWFjdGV1ciBkdSBQZXJjaG9pciBkZSBUeXRvbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3ODUyLjg5LCA5ODU1LjU2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbmZlcm5vJ3MgTmVlZGxlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWlndWlsbGUgaW5mZXJuYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNzEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzUwNC44NCwgMTA1OTguNV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q3M0RCRTZEOTAxNDBEQzEyN0YxREZCRDkwQUNCNzdFRTg3MDEzNzAvNzMwNDE2LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvbmVnYXplIFNwaXJlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBZ3VqYSBkZSBNaXJhcGllZHJhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RlaW5ibGljay1aYWNrZW5zdGFiXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQaWMgZGUgUGllcnJlZ2FyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcxNjQuNDYsIDk4MDUuMTVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkluZmVybm8ncyBOZWVkbGUgUmVhY3RvclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVhY3RvciBkZSBBZ3VqYSBkZWwgSW5maWVybm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkluZmVybm9uYWRlbC1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgbCdBaWd1aWxsZSBpbmZlcm5hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NixcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTgxLjkxLCAxMDMxNi40XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdGF0dWFyeVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXN0YXR1YXJpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3RhdHVlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTdGF0dWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1OSxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1NTMuMTIsIDkzNjAuMTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS80QzAxMTNCNkRGMkU0RTJDQkI5MzI0NEFENTBEQTQ5NDU2RDUwMTRFLzczMDQxMi5wbmdcIlxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiJdfQ==
