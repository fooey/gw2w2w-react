(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _MatchWorld = require('./MatchWorld');

var _MatchWorld2 = _interopRequireDefault(_MatchWorld);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31,"./MatchWorld":2}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _Pie = require('./../../common/Icons/Pie');

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
            match.scores ? numeral(match.scores[color]).format('0,0') : null
        ),
        showPie && match.scores ? _react2.default.createElement(
            'td',
            { className: 'pie', rowSpan: '3' },
            _react2.default.createElement(_Pie2.default, { scores: match.scores, size: 60 })
        ) : null
    );
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Pie":18}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Match":1}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31}],5:[function(require,module,exports){
(function (global){
'use strict';

/*
*
*   Dependencies
*
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _overview = require('./../lib/data/overview');

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

module.exports = Overview;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/data/overview":28,"./Matches":3,"./Worlds":4}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = (typeof window !== "undefined" ? window['classNames'] : typeof global !== "undefined" ? global['classNames'] : null);

var _classnames2 = _interopRequireDefault(_classnames);

var _Emblem = require('./../../common/icons/Emblem');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/icons/Emblem":21}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

var _moment2 = _interopRequireDefault(_moment);

var _static = require('./../../lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Emblem = require('./../../common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

var _Objective = require('./../../common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _Arrow = require('./../../common/icons/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Sprite from 'common/icons/Sprite';

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/icons/Arrow":20,"./../../common/icons/Emblem":21,"./../../common/icons/Objective":22,"./../../lib/static":31}],8:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _classnames = (typeof window !== "undefined" ? window['classNames'] : typeof global !== "undefined" ? global['classNames'] : null);

var _classnames2 = _interopRequireDefault(_classnames);

var _Objective = require('./../../common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/icons/Objective":22,"./../../lib/static":31}],9:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Entries":7,"./Tabs":8}],10:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = (typeof window !== "undefined" ? window['classNames'] : typeof global !== "undefined" ? global['classNames'] : null);

var _classnames2 = _interopRequireDefault(_classnames);

var _Objective = require('./Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31,"./Objective":11}],11:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = (typeof window !== "undefined" ? window['classNames'] : typeof global !== "undefined" ? global['classNames'] : null);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

var _moment2 = _interopRequireDefault(_moment);

var _Emblem = require('./../../common/icons/Emblem');

var _Emblem2 = _interopRequireDefault(_Emblem);

var _Arrow = require('./../../common/icons/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _Objective = require('./../../common/icons/Objective');

var _Objective2 = _interopRequireDefault(_Objective);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/icons/Arrow":20,"./../../common/icons/Emblem":21,"./../../common/icons/Objective":22,"./../../lib/static":31}],12:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _MatchMap = require('./MatchMap');

var _MatchMap2 = _interopRequireDefault(_MatchMap);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31,"./MatchMap":10}],13:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _Sprite = require('./../../common/Icons/Sprite');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Sprite":19}],14:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = (typeof window !== "undefined" ? window['numeral'] : typeof global !== "undefined" ? global['numeral'] : null);

var _numeral2 = _interopRequireDefault(_numeral);

var _Holdings = require('./Holdings');

var _Holdings2 = _interopRequireDefault(_Holdings);

var _static = require('./../../lib/static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31,"./Holdings":13}],15:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./World":14}],16:[function(require,module,exports){
(function (global){
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

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

var _moment2 = _interopRequireDefault(_moment);

var _tracker = require('./../lib/data/tracker');

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
    var worldName = world[langSlug].name;

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/data/tracker":30,"./Guilds":6,"./Log":9,"./Maps":12,"./Scoreboard":15}],17:[function(require,module,exports){
(function (global){
'use strict';

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _page = (typeof window !== "undefined" ? window['page'] : typeof global !== "undefined" ? global['page'] : null);

var _page2 = _interopRequireDefault(_page);

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _static = require('./lib/static');

var STATIC = _interopRequireWildcard(_static);

var _Langs = require('./layout/Langs');

var _Langs2 = _interopRequireDefault(_Langs);

var _NavbarHeader = require('./layout/NavbarHeader');

var _NavbarHeader2 = _interopRequireDefault(_NavbarHeader);

var _Footer = require('./layout/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Overview = require('./Overview');

var _Overview2 = _interopRequireDefault(_Overview);

var _Tracker = require('./Tracker');

var _Tracker2 = _interopRequireDefault(_Tracker);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let store = createStore(() => {});

/*
*
* Launch App
*
*/

// import { createStore } from 'redux';
// import { connect, Provider  } from 'react-redux';

/*
*
* Dependencies
*
*/

(0, _domready2.default)(function () {
    return start();
});

/*
*
* container
*
*/

// const App = ({
//     langSlug,
//     worldSlug,
// }) => {
//     const lang = STATIC.langs[langSlug];
//     const world = getWorldFromSlug(langSlug, worldSlug);

//     const hasWorld = (world && !_.isEmpty(world));
//     const Handler = (hasWorld) ? Tracker : Overview;

//     return (
//         <div>
//             <nav className='navbar navbar-default'>
//                 <div className='container'>
//                     <NavbarHeader />
//                     <Langs lang={lang} world={world} />
//                 </div>
//             </nav>

//             <section id='content' className='container'>
//                 <Handler lang={lang} world={world} />
//             </section>

//             <Footer obsfuEmail={{
//                 chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
//                 pattern: '03142',
//             }} />
//         </div>
//     );
// };

/*
* React Components
*/

var Container = function Container(_ref) {
    var children = _ref.children;
    var lang = _ref.lang;
    var world = _ref.world;

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
                _react2.default.createElement(_Langs2.default, { lang: lang, world: world })
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
    lang: _react2.default.PropTypes.object.isRequired,
    world: _react2.default.PropTypes.object
};

// Container = connect()(Container);

// function renderApp(ctx) {
//     return ReactDOM.render(
//         <App {...ctx.params} />,
//         document.getElementById('react-app')
//     );
// }

function start() {
    console.clear();
    console.log('Starting Application');

    (0, _page2.default)('/', function () {
        return _page2.default.redirect('/en');
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', function (ctx) {
        var lang = STATIC.langs[ctx.params.langSlug];
        var world = getWorldFromSlug(ctx.params.langSlug, ctx.params.worldSlug);
        console.log('route => ' + ctx.path);

        _reactDom2.default.render(_react2.default.createElement(
            Container,
            { lang: lang, world: world },
            _react2.default.createElement(_Tracker2.default, { lang: lang, world: world })
        ), document.getElementById('react-app'));
    });

    (0, _page2.default)('/:langSlug(en|de|es|fr)', function (ctx) {
        var lang = STATIC.langs[ctx.params.langSlug];
        console.log('route => ' + ctx.path);

        _reactDom2.default.render(_react2.default.createElement(
            Container,
            { lang: lang },
            _react2.default.createElement(_Overview2.default, { lang: lang })
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

function getWorldFromSlug(langSlug, worldSlug) {
    return _.find(STATIC.worlds, function (world) {
        return world[langSlug].slug === worldSlug;
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Overview":5,"./Tracker":16,"./layout/Footer":23,"./layout/Langs":25,"./layout/NavbarHeader":26,"./lib/static":31,"domready":32}],18:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],19:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var color = _ref.color;
    var type = _ref.type;
    return _react2.default.createElement('span', { className: 'sprite ' + type + ' ' + color });
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],20:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],21:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],22:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],23:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],24:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _classnames = (typeof window !== "undefined" ? window['classNames'] : typeof global !== "undefined" ? global['classNames'] : null);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var lang = _ref.lang;
    var linkLang = _ref.linkLang;
    var world = _ref.world;
    return _react2.default.createElement(
        'li',
        {
            className: getClassname(lang, linkLang),
            title: linkLang.name
        },
        _react2.default.createElement(
            'a',
            { href: getLink(linkLang, world) },
            linkLang.label
        )
    );
};

function getClassname(lang, linkLang) {
    return (0, _classnames2.default)({
        active: lang.label === linkLang.label
    });
}

function getLink(lang, world) {
    var langSlug = lang.slug;

    var link = '/' + langSlug;

    if (world) {
        var worldSlug = world[langSlug].slug;

        link += '/' + worldSlug;
    }

    return link;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _static = require('./../../lib/static');

var _LangLink = require('./LangLink');

var _LangLink2 = _interopRequireDefault(_LangLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var lang = _ref.lang;
    var world = _ref.world;
    return _react2.default.createElement(
        'div',
        { id: 'nav-langs', className: 'pull-right' },
        _react2.default.createElement(
            'ul',
            { className: 'nav navbar-nav' },
            _.map(_static.langs, function (linkLang, key) {
                return _react2.default.createElement(_LangLink2.default, {
                    key: key,

                    lang: lang,
                    linkLang: linkLang,
                    world: world
                });
            })
        )
    );
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":31,"./LangLink":24}],26:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMatches = getMatches;
exports.getMatchByWorldSlug = getMatchByWorldSlug;
exports.getMatchByWorldId = getMatchByWorldId;
exports.getGuildById = getGuildById;

var _superagent = (typeof window !== "undefined" ? window['superagent'] : typeof global !== "undefined" ? global['superagent'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _api = require('./../api');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api":27}],29:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _async = (typeof window !== "undefined" ? window['async'] : typeof global !== "undefined" ? global['async'] : null);

var _async2 = _interopRequireDefault(_async);

var _api = require('./../../api');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../api":27}],30:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var _lodash2 = _interopRequireDefault(_lodash);

var _guilds = require('./guilds');

var _guilds2 = _interopRequireDefault(_guilds);

var _api = require('./../../api');

var _api2 = _interopRequireDefault(_api);

var _static = require('./../../static');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../api":27,"./../../static":31,"./guilds":29}],31:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.objectivesGeo = exports.mapsMeta = exports.objectivesMeta = exports.worlds = exports.langs = exports.objectives = undefined;

var _lodash = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static/data/langs":33,"gw2w2w-static/data/objectives_v2_merged":34,"gw2w2w-static/data/world_names":35}],32:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGFwcFxccHVibGljXFxqc1xcc3JjXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2guanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcT3ZlcnZpZXdcXE1hdGNoZXNcXGFwcFxccHVibGljXFxqc1xcc3JjXFxPdmVydmlld1xcTWF0Y2hlc1xcTWF0Y2hXb3JsZC5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxPdmVydmlld1xcTWF0Y2hlc1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXE92ZXJ2aWV3XFxNYXRjaGVzXFxpbmRleC5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxPdmVydmlld1xcV29ybGRzXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcT3ZlcnZpZXdcXFdvcmxkc1xcaW5kZXguanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcT3ZlcnZpZXdcXGFwcFxccHVibGljXFxqc1xcc3JjXFxPdmVydmlld1xcaW5kZXguanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcR3VpbGRzXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcR3VpbGRzXFxpbmRleC5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxMb2dcXGFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxMb2dcXEVudHJpZXMuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcTG9nXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcTG9nXFxUYWJzLmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXExvZ1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXExvZ1xcaW5kZXguanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcTWFwc1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXE1hcHNcXE1hdGNoTWFwLmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXE1hcHNcXGFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxNYXBzXFxPYmplY3RpdmUuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcTWFwc1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXE1hcHNcXGluZGV4LmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXGFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxTY29yZWJvYXJkXFxIb2xkaW5ncy5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxTY29yZWJvYXJkXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcU2NvcmVib2FyZFxcV29ybGQuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcVHJhY2tlclxcU2NvcmVib2FyZFxcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXFNjb3JlYm9hcmRcXGluZGV4LmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXFRyYWNrZXJcXGFwcFxccHVibGljXFxqc1xcc3JjXFxUcmFja2VyXFxpbmRleC5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcYXBwLmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGNvbW1vblxcSWNvbnNcXGFwcFxccHVibGljXFxqc1xcc3JjXFxjb21tb25cXEljb25zXFxQaWUuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcY29tbW9uXFxJY29uc1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGNvbW1vblxcSWNvbnNcXFNwcml0ZS5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxjb21tb25cXGljb25zXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcY29tbW9uXFxpY29uc1xcQXJyb3cuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcY29tbW9uXFxpY29uc1xcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGNvbW1vblxcaWNvbnNcXEVtYmxlbS5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxjb21tb25cXGljb25zXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcY29tbW9uXFxpY29uc1xcT2JqZWN0aXZlLmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGxheW91dFxcYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGxheW91dFxcRm9vdGVyLmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGxheW91dFxcTGFuZ3NcXGFwcFxccHVibGljXFxqc1xcc3JjXFxsYXlvdXRcXExhbmdzXFxMYW5nTGluay5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxsYXlvdXRcXExhbmdzXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGF5b3V0XFxMYW5nc1xcaW5kZXguanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGF5b3V0XFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGF5b3V0XFxOYXZiYXJIZWFkZXIuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGliXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGliXFxhcGkuanMiLCJhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGliXFxkYXRhXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGliXFxkYXRhXFxvdmVydmlldy5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGFwcFxccHVibGljXFxqc1xcc3JjXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGd1aWxkcy5qcyIsImFwcFxccHVibGljXFxqc1xcc3JjXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGFwcFxccHVibGljXFxqc1xcc3JjXFxsaWJcXGRhdGFcXHRyYWNrZXJcXGluZGV4LmpzIiwiYXBwXFxwdWJsaWNcXGpzXFxzcmNcXGxpYlxcc3RhdGljXFxhcHBcXHB1YmxpY1xcanNcXHNyY1xcbGliXFxzdGF0aWNcXGluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXJlYWR5L3JlYWR5LmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTUEsSUFBTSxlQUFlLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsT0FBaEIsQ0FBZjs7SUFHZTs7Ozs7Ozs7Ozs7OENBUUssV0FBVztBQUM3QixtQkFDSSxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsS0FDRyxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBREgsQ0FGeUI7Ozs7dUNBT2xCLFdBQVc7QUFDdEIsbUJBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixPQUFqQixLQUE2QixVQUFVLEtBQVYsQ0FBZ0IsT0FBaEIsQ0FEZjs7OztrQ0FJaEIsV0FBVztBQUNqQixtQkFBUSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLEtBQXlCLFVBQVUsSUFBVixDQUFlLElBQWYsQ0FEaEI7Ozs7aUNBTVo7eUJBQ2lCLEtBQUssS0FBTCxDQURqQjtnQkFDRSxtQkFERjtnQkFDUSxxQkFEUjs7QUFHTCxtQkFDSTs7a0JBQUssV0FBVSxnQkFBVixFQUFMO2dCQUNJOztzQkFBTyxXQUFVLE9BQVYsRUFBUDtvQkFBeUI7Ozt3QkFDcEIsRUFBRSxHQUFGLENBQU0sWUFBTixFQUFvQixVQUFDLEtBQUQsRUFBVztBQUM1QixnQ0FBTSxXQUFXLEtBQVgsQ0FEc0I7QUFFNUIsZ0NBQU0sVUFBVyxNQUFNLE1BQU4sQ0FBYSxRQUFiLENBQVgsQ0FGc0I7QUFHNUIsZ0NBQU0sUUFBUSxlQUFPLE9BQVAsRUFBZ0IsS0FBSyxJQUFMLENBQXhCLENBSHNCOztBQUs1QixtQ0FDSTtBQUNJLDJD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IE1hdGNoV29ybGQgZnJvbSAnLi9NYXRjaFdvcmxkJztcclxuXHJcbmltcG9ydCB7d29ybGRzfSBmcm9tICdsaWIvc3RhdGljJztcclxuY29uc3QgV09STERfQ09MT1JTID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIG1hdGNoOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdNYXRjaERhdGEobmV4dFByb3BzKVxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzTmV3TGFuZyhuZXh0UHJvcHMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05ld01hdGNoRGF0YShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubWF0Y2gubGFzdG1vZCAhPT0gbmV4dFByb3BzLm1hdGNoLmxhc3Rtb2QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7bGFuZywgbWF0Y2h9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21hdGNoQ29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J21hdGNoJz48dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFdPUkxEX0NPTE9SUywgKGNvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkS2V5ID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkSWQgID0gbWF0Y2gud29ybGRzW3dvcmxkS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgPSB3b3JsZHNbd29ybGRJZF1bbGFuZy5zbHVnXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB7d29ybGRJZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB7bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BpZSA9IHtjb2xvciA9PT0gJ3JlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT48L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgUGllIGZyb20gJ2NvbW1vbi9JY29ucy9QaWUnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgbWF0Y2gsXHJcbiAgICBzaG93UGllLFxyXG4gICAgd29ybGQsXHJcbn0pID0+ICAoXHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke2NvbG9yfWB9PjxhIGhyZWY9e3dvcmxkLmxpbmt9Pnt3b3JsZC5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgIHsvKjx0ZCBjbGFzc05hbWU9e2B0ZWFtIGtpbGxzICR7Y29sb3J9YH0+e21hdGNoLmtpbGxzID8gbnVtZXJhbChtYXRjaC5raWxsc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+Ki99XHJcbiAgICAgICAgey8qPHRkIGNsYXNzTmFtZT17YHRlYW0gZGVhdGhzICR7Y29sb3J9YH0+e21hdGNoLmRlYXRocyA/IG51bWVyYWwobWF0Y2guZGVhdGhzW2NvbG9yXSkuZm9ybWF0KCcwLDAnKSA6IG51bGx9PC90ZD4qL31cclxuICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke2NvbG9yfWB9PnttYXRjaC5zY29yZXMgPyBudW1lcmFsKG1hdGNoLnNjb3Jlc1tjb2xvcl0pLmZvcm1hdCgnMCwwJykgOiBudWxsfTwvdGQ+XHJcblxyXG4gICAgICAgIHsoc2hvd1BpZSAmJiBtYXRjaC5zY29yZXMpID8gPHRkIGNsYXNzTmFtZT0ncGllJyByb3dTcGFuPSczJz48UGllIHNjb3Jlcz17bWF0Y2guc2NvcmVzfSBzaXplPXs2MH0gLz48L3RkPiA6IG51bGx9XHJcbiAgICA8L3RyPlxyXG4pOyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoIGZyb20gJy4vTWF0Y2gnO1xyXG5cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3twYWRkaW5nTGVmdDogJy41ZW0nfX0+PGkgY2xhc3NOYW1lPSdmYSBmYS1zcGlubmVyIGZhLXNwaW4nIC8+PC9zcGFuPjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGxhbmcsXHJcbiAgICBtYXRjaGVzLFxyXG4gICAgcmVnaW9uLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICB7cmVnaW9uLmxhYmVsfSBNYXRjaGVzXHJcbiAgICAgICAgICAgIHtfLmlzRW1wdHkobWF0Y2hlcykgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcbiAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAge18uY2hhaW4obWF0Y2hlcylcclxuICAgICAgICAgICAgLnNvcnRCeSgnaWQnKVxyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgICAgKG1hdGNoKSA9PlxyXG4gICAgICAgICAgICAgICAgPE1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAga2V5PXttYXRjaC5pZH1cclxuICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoPXttYXRjaH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICB9XHJcbiAgICA8L2Rpdj5cclxuKTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCB7d29ybGRzfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgbGFuZyxcclxuICAgIHJlZ2lvbixcclxufSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J1JlZ2lvbldvcmxkcyc+XHJcbiAgICAgICAgPGgyPntyZWdpb24ubGFiZWx9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAgICAgIHtfLmNoYWluKHdvcmxkcylcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIod29ybGQgPT4gd29ybGQucmVnaW9uID09PSByZWdpb24uaWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKHdvcmxkID0+IHdvcmxkW2xhbmcuc2x1Z10pXHJcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCduYW1lJylcclxuICAgICAgICAgICAgICAgIC5tYXAod29ybGQgPT4gPGxpIGtleT17d29ybGQuc2x1Z30+PGEgaHJlZj17d29ybGQubGlua30+e3dvcmxkLm5hbWV9PC9hPjwvbGk+KVxyXG4gICAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogICBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5pbXBvcnQgREFPIGZyb20gJ2xpYi9kYXRhL292ZXJ2aWV3JztcclxuXHJcblxyXG4vKlxyXG4qICAgUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuaW1wb3J0IE1hdGNoZXMgZnJvbSAnLi9NYXRjaGVzJztcclxuaW1wb3J0IFdvcmxkcyBmcm9tICcuL1dvcmxkcyc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuXHJcbmNvbnN0IFJFR0lPTlMgPSB7XHJcbiAgICAxOiB7bGFiZWw6ICdOQScsIGlkOiAnMSd9LFxyXG4gICAgMjoge2xhYmVsOiAnRVUnLCBpZDogJzInfSxcclxufTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyh7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEYXRhOiB0aGlzLm9uTWF0Y2hEYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXRjaERhdGE6IHt9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLmlzTmV3TWF0Y2hEYXRhKG5leHRTdGF0ZSlcclxuICAgICAgICAgICAgfHwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdNYXRjaERhdGEobmV4dFN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldExhc3Rtb2QodGhpcy5zdGF0ZS5tYXRjaERhdGEpICE9PSBnZXRMYXN0bW9kKG5leHRTdGF0ZS5tYXRjaERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTmV3TGFuZyhuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubGFuZy5uYW1lICE9PSBuZXh0UHJvcHMubGFuZy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kYW8uY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPSdvdmVydmlldyc+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAge18ubWFwKFJFR0lPTlMsIChyZWdpb24sIHJlZ2lvbklkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTEyJyBrZXk9e3JlZ2lvbklkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXM9e18uZmlsdGVyKHRoaXMuc3RhdGUubWF0Y2hEYXRhLCBtYXRjaCA9PiBtYXRjaC5yZWdpb24gPT09IHJlZ2lvbklkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb249e3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoUkVHSU9OUywgKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFdvcmxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb249e3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIERhdGEgTGlzdGVuZXJzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIG9uTWF0Y2hEYXRhKG1hdGNoRGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21hdGNoRGF0YX0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TGFzdG1vZChtYXRjaERhdGEpIHtcclxuICAgIHJldHVybiBfLnJlZHVjZShcclxuICAgICAgICBtYXRjaERhdGEsXHJcbiAgICAgICAgKGFjYywgbWF0Y2gpID0+IE1hdGgubWF4KG1hdGNoLmxhc3Rtb2QpLFxyXG4gICAgICAgIDBcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgbGV0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG4gICAgaWYgKGxhbmcuc2x1ZyAhPT0gJ2VuJykge1xyXG4gICAgICAgIHRpdGxlLnB1c2gobGFuZy5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLmpvaW4oJyAtICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGd1aWxkcyxcclxufSkgPT4gKFxyXG4gICAgPHVsIGlkPSdndWlsZHMnIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCc+XHJcbiAgICAgICAge19cclxuICAgICAgICAgICAgLmNoYWluKGd1aWxkcylcclxuICAgICAgICAgICAgLnNvcnRCeSgnbmFtZScpXHJcbiAgICAgICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgICAgICBndWlsZCA9PlxyXG4gICAgICAgICAgICAgICAgPGxpIGtleT17Z3VpbGQuaWR9IGNsYXNzTmFtZT0nZ3VpbGQnIGlkPXtndWlsZC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17YGh0dHBzOi8vZ3VpbGRzLmd3Mncydy5jb20vJHtndWlsZC5pZH1gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXtndWlsZC5pZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nZ3VpbGQtbmFtZSc+IHtndWlsZC5uYW1lfSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLXRhZyc+IFt7Z3VpbGQudGFnfV0gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgLnZhbHVlKCl9XHJcbiAgICA8L3VsPlxyXG4pO1xyXG5cclxuIiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSdtb21lbnQnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuaW1wb3J0IEVtYmxlbSBmcm9tICdjb21tb24vaWNvbnMvRW1ibGVtJztcclxuLy8gaW1wb3J0IFNwcml0ZSBmcm9tICdjb21tb24vaWNvbnMvU3ByaXRlJztcclxuaW1wb3J0IE9iamVjdGl2ZUljb24gZnJvbSAnY29tbW9uL2ljb25zL09iamVjdGl2ZSc7XHJcbmltcG9ydCBBcnJvd0ljb24gZnJvbSAnY29tbW9uL2ljb25zL0Fycm93JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIGxvZyxcclxuICAgIG5vdyxcclxuICAgIG1hcEZpbHRlcixcclxuICAgIHR5cGVGaWx0ZXIsXHJcbn0pID0+IChcclxuICAgIDxvbCBpZD0nbG9nJyBjbGFzc05hbWU9J2xpc3QtdW5zdHlsZWQnPlxyXG4gICAgICAgIHtfLmNoYWluKGxvZylcclxuICAgICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBieVR5cGUodHlwZUZpbHRlciwgZW50cnkpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkpXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT5cclxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2VudHJ5LmlkfSBjbGFzc05hbWU9e2B0ZWFtICR7ZW50cnkub3duZXJ9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT0nbGlzdC11bnN0eWxlZCBsb2ctb2JqZWN0aXZlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLWV4cGlyZSc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZXhwaXJlcy5pc0FmdGVyKG5vdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KGVudHJ5LmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbG9nLXRpbWUnPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb21lbnQoKS5kaWZmKGVudHJ5Lmxhc3RGbGlwcGVkLCAnaG91cnMnKSA8IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0RmxpcHBlZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGVudHJ5Lmxhc3RGbGlwcGVkLmZyb21Ob3codHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1nZW8nPjxBcnJvd0ljb24gZGlyZWN0aW9uPXtnZXRPYmplY3RpdmVEaXJlY3Rpb24oZW50cnkpfSAvPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXtlbnRyeS5vd25lcn0gdHlwZT17ZW50cnkudHlwZX0gLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KG1hcEZpbHRlciA9PT0gJycpID8gPGxpIGNsYXNzTmFtZT0nbG9nLW1hcCc+e2dldE1hcChlbnRyeSkuYWJicn08L2xpPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1uYW1lJz57U1RBVElDLm9iamVjdGl2ZXNbZW50cnkuaWRdLm5hbWVbbGFuZy5zbHVnXX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Lyo8bGkgY2xhc3NOYW1lPSdsb2ctY2xhaW1lZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkubGFzdENsYWltZWQuaXNWYWxpZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBlbnRyeS5sYXN0Q2xhaW1lZC5mb3JtYXQoJ2hoOm1tOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xvZy1ndWlsZCc+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuZ3VpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxhIGhyZWY9eycjJyArIGVudHJ5Lmd1aWxkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZElkPXtlbnRyeS5ndWlsZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkc1tlbnRyeS5ndWlsZF0gPyA8c3BhbiBjbGFzc05hbWU9J2d1aWxkLW5hbWUnPiB7Z3VpbGRzW2VudHJ5Lmd1aWxkXS5uYW1lfSA8L3NwYW4+IDogIG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtndWlsZHNbZW50cnkuZ3VpbGRdID8gPHNwYW4gY2xhc3NOYW1lPSdndWlsZC10YWcnPiBbe2d1aWxkc1tlbnRyeS5ndWlsZF0udGFnfV0gPC9zcGFuPiA6ICBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAudmFsdWUoKX1cclxuICAgIDwvb2w+XHJcbik7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlRGlyZWN0aW9uKG9iamVjdGl2ZSkge1xyXG4gICAgY29uc3QgYmFzZUlkID0gb2JqZWN0aXZlLmlkLnNwbGl0KCctJylbMV0udG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGEgPSBTVEFUSUMub2JqZWN0aXZlc01ldGFbYmFzZUlkXTtcclxuXHJcbiAgICByZXR1cm4gbWV0YS5kaXJlY3Rpb247XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXAob2JqZWN0aXZlKSB7XHJcbiAgICBjb25zdCBtYXBJZCA9IG9iamVjdGl2ZS5pZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgcmV0dXJuIF8uZmluZChTVEFUSUMubWFwc01ldGEsIG1tID0+IG1tLmlkID09IG1hcElkKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYnlUeXBlKHR5cGVGaWx0ZXIsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdHlwZUZpbHRlcltlbnRyeS50eXBlXTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGJ5TWFwSWQobWFwRmlsdGVyLCBlbnRyeSkge1xyXG4gICAgaWYgKG1hcEZpbHRlcikge1xyXG4gICAgICAgIHJldHVybiBlbnRyeS5tYXBJZCA9PT0gbWFwRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgbWFwcyxcclxuICAgIG1hcEZpbHRlciA9ICcnLFxyXG4gICAgdHlwZUZpbHRlciA9ICcnLFxyXG5cclxuICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrLFxyXG4gICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgaWQ9J2xvZy10YWJzJyBjbGFzc05hbWU9J2ZsZXgtdGFicyc+XHJcbiAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe3RhYjogdHJ1ZSwgYWN0aXZlOiAhbWFwRmlsdGVyfSl9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVNYXBGaWx0ZXJDbGljaygnJyl9XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbj17J0FsbCd9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIFNUQVRJQy5tYXBzTWV0YSxcclxuICAgICAgICAgICAgICAgIChtbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIChfLnNvbWUobWFwcywgbWF0Y2hNYXAgPT4gbWF0Y2hNYXAuaWQgPT0gbW0uaWQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e21tLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHt0YWI6IHRydWUsIGFjdGl2ZTogbWFwRmlsdGVyID09IG1tLmlkfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVNYXBGaWx0ZXJDbGljayhfLnBhcnNlSW50KG1tLmlkKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17bW0ubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuPXttbS5hYmJyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgWydjYXN0bGUnLCAna2VlcCcsICd0b3dlcicsICdjYW1wJ10sXHJcbiAgICAgICAgICAgICAgICB0ID0+XHJcbiAgICAgICAgICAgICAgICA8YSAga2V5PXt0fVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHR5cGVGaWx0ZXJbdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiB0ID09PSAnY2FzdGxlJyxcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUeXBlRmlsdGVyQ2xpY2sodCl9ID5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZUljb24gdHlwZT17dH0gc2l6ZT17MTh9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcbmltcG9ydCBFbnRyaWVzIGZyb20gJy4vRW50cmllcyc7XHJcbmltcG9ydCBUYWJzIGZyb20gJy4vVGFicyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGxvZzogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgZ3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgbWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVyOiAnJyxcclxuICAgICAgICAgICAgdHlwZUZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgY2FzdGxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAga2VlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRvd2VyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FtcDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J2xvZy1jb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgPFRhYnNcclxuICAgICAgICAgICAgICAgICAgICBtYXBzPXt0aGlzLnByb3BzLm1hdGNoLm1hcHN9XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyPXt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlRmlsdGVyPXt0aGlzLnN0YXRlLnR5cGVGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZU1hcEZpbHRlckNsaWNrLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrPXt0aGlzLmhhbmRsZVR5cGVGaWx0ZXJDbGljay5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXt0aGlzLnByb3BzLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICBsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nPXt0aGlzLnByb3BzLmxvZ31cclxuICAgICAgICAgICAgICAgICAgICBub3c9e3RoaXMucHJvcHMubm93fVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlcj17dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZUZpbHRlcj17dGhpcy5zdGF0ZS50eXBlRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGhhbmRsZU1hcEZpbHRlckNsaWNrKG1hcEZpbHRlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXQgbWFwRmlsdGVyJywgbWFwRmlsdGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWFwRmlsdGVyfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVHlwZUZpbHRlckNsaWNrKHRvZ2dsZVR5cGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndG9nZ2xlIHR5cGVGaWx0ZXInLCB0b2dnbGVUeXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRlLnR5cGVGaWx0ZXJbdG9nZ2xlVHlwZV0gPSAhc3RhdGUudHlwZUZpbHRlclt0b2dnbGVUeXBlXTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5pbXBvcnQgT2JqZWN0aXZlIGZyb20gJy4vT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgZ3VpbGRzLFxyXG4gICAgbGFuZyxcclxuICAgIG1hdGNoTWFwLFxyXG4gICAgbm93LFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXAtc2VjdGlvbnMnPlxyXG4gICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICBnZXRNYXBPYmplY3RpdmVzTWV0YShtYXRjaE1hcC5pZCksXHJcbiAgICAgICAgICAgICAgICAoc2VjdGlvbiwgaXgpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcC1zZWN0aW9uJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzb2xvOiBzZWN0aW9uLmxlbmd0aCA9PT0gMSxcclxuICAgICAgICAgICAgICAgIH0pfSBrZXk9e2l4fT5cclxuICAgICAgICAgICAgICAgICAgICB7Xy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChnZW8pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxPYmplY3RpdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17Z2VvLmlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2dlby5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcz17Z3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbj17Z2VvLmRpcmVjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoTWFwPXttYXRjaE1hcH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdz17bm93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hcE9iamVjdGl2ZXNNZXRhKG1hcElkKSB7XHJcbiAgICBsZXQgbWFwQ29kZSA9ICdibDInO1xyXG5cclxuICAgIGlmIChtYXBJZCA9PT0gMzgpIHtcclxuICAgICAgICBtYXBDb2RlID0gJ2ViJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gX1xyXG4gICAgICAgIC5jaGFpbihTVEFUSUMub2JqZWN0aXZlc01ldGEpXHJcbiAgICAgICAgLmNsb25lRGVlcCgpXHJcbiAgICAgICAgLmZpbHRlcihvbSA9PiBvbS5tYXAgPT09IG1hcENvZGUpXHJcbiAgICAgICAgLmdyb3VwQnkob20gPT4gb20uZ3JvdXApXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20nbW9tZW50JztcclxuXHJcbmltcG9ydCBFbWJsZW0gZnJvbSAnY29tbW9uL2ljb25zL0VtYmxlbSc7XHJcbmltcG9ydCBBcnJvdyBmcm9tICdjb21tb24vaWNvbnMvQXJyb3cnO1xyXG5pbXBvcnQgT2JqZWN0aXZlSWNvbiBmcm9tICdjb21tb24vaWNvbnMvT2JqZWN0aXZlJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgaWQsXHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgZGlyZWN0aW9uLFxyXG4gICAgbWF0Y2hNYXAsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuICAgIGNvbnN0IG9iamVjdGl2ZUlkID0gYCR7bWF0Y2hNYXAuaWR9LSR7aWR9YDtcclxuICAgIGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZXNbb2JqZWN0aXZlSWRdO1xyXG4gICAgY29uc3QgbW8gPSBfLmZpbmQobWF0Y2hNYXAub2JqZWN0aXZlcywgbyA9PiBvLmlkID09PSBvYmplY3RpdmVJZCk7XHJcblxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XHJcbiAgICAgICAgICAgICdsaXN0LXVuc3R5bGVkJzogdHJ1ZSxcclxuICAgICAgICAgICAgJ3RyYWNrLW9iamVjdGl2ZSc6IHRydWUsXHJcbiAgICAgICAgICAgIGZyZXNoOiBub3cuZGlmZihtby5sYXN0RmxpcHBlZCwgJ3NlY29uZHMnKSA8IDMwLFxyXG4gICAgICAgICAgICBleHBpcmluZzogbW8uZXhwaXJlcy5pc0FmdGVyKG5vdykgJiYgbW8uZXhwaXJlcy5kaWZmKG5vdywgJ3NlY29uZHMnKSA8IDMwLFxyXG4gICAgICAgICAgICBleHBpcmVkOiBub3cuaXNBZnRlcihtby5leHBpcmVzKSxcclxuICAgICAgICAgICAgYWN0aXZlOiBub3cuaXNCZWZvcmUobW8uZXhwaXJlcyksXHJcbiAgICAgICAgfSl9PlxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsZWZ0Jz5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndHJhY2stZ2VvJz48QXJyb3cgZGlyZWN0aW9uPXtkaXJlY3Rpb259IC8+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd0cmFjay1zcHJpdGUnPjxPYmplY3RpdmVJY29uIGNvbG9yPXttby5vd25lcn0gdHlwZT17bW8udHlwZX0gLz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLW5hbWUnPntvTWV0YS5uYW1lW2xhbmcuc2x1Z119PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdyaWdodCc+XHJcbiAgICAgICAgICAgICAgICB7bW8uZ3VpbGRcclxuICAgICAgICAgICAgICAgICAgICA/IDxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndHJhY2stZ3VpbGQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9eycjJyArIG1vLmd1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17Z3VpbGRzW21vLmd1aWxkXSA/IGAke2d1aWxkc1ttby5ndWlsZF0ubmFtZX0gWyR7Z3VpbGRzW21vLmd1aWxkXS50YWd9XWAgOiAnTG9hZGluZy4uLid9XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkSWQ9e21vLmd1aWxkfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3RyYWNrLWV4cGlyZSc+XHJcbiAgICAgICAgICAgICAgICAgICAge21vLmV4cGlyZXMuaXNBZnRlcihub3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbW9tZW50KG1vLmV4cGlyZXMuZGlmZihub3csICdtaWxsaXNlY29uZHMnKSkuZm9ybWF0KCdtOnNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICApO1xyXG59OyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IE1hdGNoTWFwIGZyb20gJy4vTWF0Y2hNYXAnO1xyXG5cclxuaW1wb3J0ICogYXMgU1RBVElDIGZyb20gJ2xpYi9zdGF0aWMnO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZHMsXHJcbiAgICBsYW5nLFxyXG4gICAgbWF0Y2gsXHJcbiAgICBub3csXHJcbn0pID0+IHtcclxuXHJcbiAgICBpZiAoXy5pc0VtcHR5KG1hdGNoKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1hcHMgPSBfLmtleUJ5KG1hdGNoLm1hcHMsICdpZCcpO1xyXG4gICAgY29uc3QgY3VycmVudE1hcElkcyA9IF8ua2V5cyhtYXBzKTtcclxuICAgIGNvbnN0IG1hcHNNZXRhQWN0aXZlID0gXy5maWx0ZXIoXHJcbiAgICAgICAgU1RBVElDLm1hcHNNZXRhLFxyXG4gICAgICAgIG1hcE1ldGEgPT4gXy5pbmRleE9mKGN1cnJlbnRNYXBJZHMsIF8ucGFyc2VJbnQobWFwTWV0YS5pZCkgIT09IC0xKVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxzZWN0aW9uIGlkPSdtYXBzJz5cclxuICAgICAgICAgICAge18ubWFwKFxyXG4gICAgICAgICAgICAgICAgbWFwc01ldGFBY3RpdmUsXHJcbiAgICAgICAgICAgICAgICAobWFwTWV0YSkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYXAnIGtleT17bWFwTWV0YS5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPnttYXBNZXRhLm5hbWV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8TWF0Y2hNYXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXtndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc9e2xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcE1ldGE9e21hcE1ldGF9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoTWFwPXttYXBzW21hcE1ldGEuaWRdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3c9e25vd31cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC02Jz57PE1hcERldGFpbHMgbWFwS2V5PSdDZW50ZXInIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0NlbnRlcicpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMTgnPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLW1kLTgnPns8TWFwRGV0YWlscyBtYXBLZXk9J1JlZEhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ1JlZEhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdCbHVlSG9tZScgbWFwTWV0YT17Z2V0TWFwTWV0YSgnQmx1ZUhvbWUnKX0gey4uLnRoaXMucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC04Jz57PE1hcERldGFpbHMgbWFwS2V5PSdHcmVlbkhvbWUnIG1hcE1ldGE9e2dldE1hcE1ldGEoJ0dyZWVuSG9tZScpfSB7Li4udGhpcy5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAqLyIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IFNwcml0ZSBmcm9tICdjb21tb24vSWNvbnMvU3ByaXRlJztcclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IsXHJcbiAgICBob2xkaW5ncyxcclxufSkgPT4gKFxyXG4gICAgPHVsIGNsYXNzTmFtZT0nbGlzdC1pbmxpbmUnPlxyXG4gICAgICAgIHtfLm1hcChob2xkaW5ncywgKHR5cGVRdWFudGl0eSwgdHlwZUluZGV4KSA9PlxyXG4gICAgICAgICAgICA8bGkga2V5PXt0eXBlSW5kZXh9PlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge3R5cGVJbmRleH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHtjb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdxdWFudGl0eSc+eHt0eXBlUXVhbnRpdHl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICl9XHJcbiAgICA8L3VsPlxyXG4pO1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IG51bWVyYWwgZnJvbSAnbnVtZXJhbCc7XHJcblxyXG5pbXBvcnQgSG9sZGluZ3MgZnJvbSAnLi9Ib2xkaW5ncyc7XHJcblxyXG5cclxuaW1wb3J0IHt3b3JsZHMgYXMgV09STERTfSBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5jb25zdCBMb2FkaW5nID0gKCkgPT4gKFxyXG4gICAgPGgxIHN0eWxlPXt7aGVpZ2h0OiAnOTBweCcsIGZvbnRTaXplOiAnMzJwdCcsIGxpbmVIZWlnaHQ6ICc5MHB4J319PlxyXG4gICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJz48L2k+XHJcbiAgICA8L2gxPlxyXG4pO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGNvbG9yLFxyXG4gICAgZGVhdGhzLFxyXG4gICAgaWQsXHJcbiAgICBob2xkaW5ncyxcclxuICAgIGtpbGxzLFxyXG4gICAgbGFuZyxcclxuICAgIHNjb3JlLFxyXG4gICAgdGljayxcclxufSkgPT4ge1xyXG4gICAgY29uc3Qgd29ybGQgPSBXT1JMRFNbaWRdW2xhbmcuc2x1Z107XHJcblxyXG4gICAgaWYgKCF3b3JsZCAmJiBfLmlzRW1wdHkod29ybGQpKSB7XHJcbiAgICAgICAgcmV0dXJuIDxMb2FkaW5nIC8+O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BzY29yZWJvYXJkIHRlYW0tYmcgdGVhbSB0ZXh0LWNlbnRlciAke2NvbG9yfWB9PlxyXG4gICAgICAgICAgICA8aDE+PGEgaHJlZj17d29ybGQubGlua30+e3dvcmxkLm5hbWV9PC9hPjwvaDE+XHJcbiAgICAgICAgICAgIDxoMj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzdGF0cyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9J1RvdGFsIFNjb3JlJz57bnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgVGljayc+e251bWVyYWwodGljaykuZm9ybWF0KCcrMCwwJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7a2lsbHNcclxuICAgICAgICAgICAgICAgICAgICA/IDxkaXYgY2xhc3NOYW1lPSdzdWItc3RhdHMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT0nVG90YWwgS2lsbHMnPntudW1lcmFsKGtpbGxzKS5mb3JtYXQoJzAsMCcpfWs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPSdUb3RhbCBEZWF0aHMnPntudW1lcmFsKGRlYXRocykuZm9ybWF0KCcwLDAnKX1kPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8L2gyPlxyXG5cclxuICAgICAgICAgICAgPEhvbGRpbmdzXHJcbiAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XHJcbiAgICAgICAgICAgICAgICBob2xkaW5ncz17aG9sZGluZ3N9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmltcG9ydCBXb3JsZCBmcm9tICcuL1dvcmxkJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIG1hdGNoLFxyXG4gICAgbGFuZyxcclxufSkgPT4gIHtcclxuICAgIGNvbnN0IHdvcmxkc1Byb3BzID0gZ2V0V29ybGRzUHJvcHMobWF0Y2gsIGxhbmcpO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdyb3cnIGlkPSdzY29yZWJvYXJkcyc+XHJcbiAgICAgICAgICAgIHtfLm1hcChcclxuICAgICAgICAgICAgICAgIHdvcmxkc1Byb3BzLFxyXG4gICAgICAgICAgICAgICAgKHdvcmxkUHJvcHMpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTgnIGtleT17d29ybGRQcm9wcy5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkIHsuLi53b3JsZFByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZHNQcm9wcyhtYXRjaCwgbGFuZykge1xyXG4gICAgcmV0dXJuIF8ucmVkdWNlKFxyXG4gICAgICAgIG1hdGNoLndvcmxkcyxcclxuICAgICAgICAoYWNjLCB3b3JsZElkLCBjb2xvcikgPT4ge1xyXG4gICAgICAgICAgICBhY2NbY29sb3JdID0ge1xyXG4gICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICBsYW5nLFxyXG4gICAgICAgICAgICAgICAgaWQ6IHdvcmxkSWQsXHJcbiAgICAgICAgICAgICAgICBzY29yZTogXy5nZXQobWF0Y2gsIFsnc2NvcmVzJywgY29sb3JdLCAwKSxcclxuICAgICAgICAgICAgICAgIGRlYXRoczogXy5nZXQobWF0Y2gsIFsnZGVhdGhzJywgY29sb3JdLCAwKSxcclxuICAgICAgICAgICAgICAgIGtpbGxzOiBfLmdldChtYXRjaCwgWydraWxscycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICB0aWNrOiBfLmdldChtYXRjaCwgWyd0aWNrcycsIGNvbG9yXSwgMCksXHJcbiAgICAgICAgICAgICAgICBob2xkaW5nczogXy5nZXQobWF0Y2gsIFsnaG9sZGluZ3MnLCBjb2xvcl0sIFtdKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtyZWQ6IHt9LCBibHVlOiB7fSwgZ3JlZW46IHt9fVxyXG4gICAgKTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5pbXBvcnQgXyBmcm9tJ2xvZGFzaCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSdtb21lbnQnO1xyXG5cclxuXHJcblxyXG4vKlxyXG4gKiAgIERhdGFcclxuICovXHJcblxyXG5pbXBvcnQgREFPIGZyb20gJ2xpYi9kYXRhL3RyYWNrZXInO1xyXG5cclxuXHJcblxyXG4vKlxyXG4gKiBSZWFjdCBDb21wb25lbnRzXHJcbiAqL1xyXG5cclxuaW1wb3J0IFNjb3JlYm9hcmQgZnJvbSAnLi9TY29yZWJvYXJkJztcclxuaW1wb3J0IE1hcHMgZnJvbSAnLi9NYXBzJztcclxuaW1wb3J0IExvZyBmcm9tICcuL0xvZyc7XHJcbmltcG9ydCBHdWlsZHMgZnJvbSAnLi9HdWlsZHMnO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCB1cGRhdGVUaW1lSW50ZXJ2YWwgPSAxMDAwO1xyXG5cclxuY29uc3QgTG9hZGluZ1NwaW5uZXIgPSAoKSA9PiAoXHJcbiAgICA8aDEgaWQ9J0FwcExvYWRpbmcnPlxyXG4gICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lciBmYS1zcGluJz48L2k+XHJcbiAgICA8L2gxPlxyXG4pO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgcHJvcFR5cGVzPXtcclxuICAgICAgICBsYW5nIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgICBSZWFjdCBMaWZlY3ljbGVcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGFMaXN0ZW5lcnMgPSB7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEZXRhaWxzOiB0aGlzLm9uTWF0Y2hEZXRhaWxzLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIG9uR3VpbGREZXRhaWxzOiB0aGlzLm9uR3VpbGREZXRhaWxzLmJpbmQodGhpcyksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8gPSBuZXcgREFPKGRhdGFMaXN0ZW5lcnMpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhhc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYXRjaDoge30sXHJcbiAgICAgICAgICAgIGxvZzogW10sXHJcbiAgICAgICAgICAgIGd1aWxkczoge30sXHJcbiAgICAgICAgICAgIG5vdzogbm93KCksXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMuc2V0RGF0ZSA9IHNldEludGVydmFsKFxyXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnNldFN0YXRlKHtub3c6IG5vdygpfSksXHJcbiAgICAgICAgICAgIHVwZGF0ZVRpbWVJbnRlcnZhbFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50RGlkTW91bnQoKScpO1xyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSB0cnVlO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8uaW5pdCh0aGlzLnByb3BzLndvcmxkKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nLCBuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgICAgIHRoaXMuZGFvLnNldFdvcmxkKG5leHRQcm9wcy53b3JsZCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLmlzTmV3U2Vjb25kKG5leHRTdGF0ZSlcclxuICAgICAgICAgICAgfHwgdGhpcy5pc05ld0xhbmcobmV4dFByb3BzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdTZWNvbmQobmV4dFN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnN0YXRlLm5vdy5pc1NhbWUobmV4dFN0YXRlLm5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXdMYW5nKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5sYW5nLm5hbWUgIT09IG5leHRQcm9wcy5sYW5nLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OnJlbmRlcigpJyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0ndHJhY2tlcic+XHJcblxyXG4gICAgICAgICAgICAgICAgeyghdGhpcy5zdGF0ZS5oYXNEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPExvYWRpbmdTcGlubmVyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5tYXRjaCAmJiAhXy5pc0VtcHR5KHRoaXMuc3RhdGUubWF0Y2gpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPFNjb3JlYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17dGhpcy5zdGF0ZS5tYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5tYXRjaCAmJiAhXy5pc0VtcHR5KHRoaXMuc3RhdGUubWF0Y2gpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPE1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaD17dGhpcy5zdGF0ZS5tYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93PXt0aGlzLnN0YXRlLm5vd31cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2wtbWQtMjQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nPXt0aGlzLnN0YXRlLmxvZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoPXt0aGlzLnN0YXRlLm1hdGNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93PXt0aGlzLnN0YXRlLm5vd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5ndWlsZHMgJiYgIV8uaXNFbXB0eSh0aGlzLnN0YXRlLmd1aWxkcykpXHJcbiAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1tZC0yNCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8R3VpbGRzIGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIERhdGEgTGlzdGVuZXJzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIC8vIHVwZGF0ZVRpbWVycyhjYiA9IF8ubm9vcCkge1xyXG4gICAgLy8gICAgIGlmICh0aGlzLl9fbW91bnRlZCkge1xyXG4gICAgLy8gICAgICAgICB0cmFja2VyVGltZXJzLnVwZGF0ZSh0aGlzLnN0YXRlLnRpbWUub2Zmc2V0LCBjYik7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX190aW1lb3V0cy51cGRhdGVUaW1lcnMgPSBzZXRUaW1lb3V0KHRoaXMudXBkYXRlVGltZXJzLmJpbmQodGhpcyksIHVwZGF0ZVRpbWVJbnRlcnZhbCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuXHJcblxyXG4gICAgb25NYXRjaERldGFpbHMobWF0Y2gpIHtcclxuICAgICAgICBjb25zdCBsb2cgPSBnZXRMb2cobWF0Y2gpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgaGFzRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgbWF0Y2gsXHJcbiAgICAgICAgICAgIGxvZyxcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtub3duR3VpbGRzID0gXy5rZXlzKHRoaXMuc3RhdGUuZ3VpbGRzKTtcclxuICAgICAgICAgICAgY29uc3QgdW5rbm93bkd1aWxkcyA9IGdldE5ld0NsYWltcyhsb2csIGtub3duR3VpbGRzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGFvLmd1aWxkcy5sb29rdXAodW5rbm93bkd1aWxkcywgdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIG9uR3VpbGREZXRhaWxzKGd1aWxkKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRlLmd1aWxkc1tndWlsZC5pZF0gPSBndWlsZDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7Z3VpbGRzOiBzdGF0ZS5ndWlsZHN9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgbWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vdygpIHtcclxuICAgIHJldHVybiBtb21lbnQoTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkgKiAxMDAwKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpIHtcclxuICAgIGNvbnN0IGxhbmdTbHVnICA9IGxhbmcuc2x1ZztcclxuICAgIGNvbnN0IHdvcmxkTmFtZSA9IHdvcmxkW2xhbmdTbHVnXS5uYW1lO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlICAgICA9IFt3b3JsZE5hbWUsICdndzJ3MncnXTtcclxuXHJcbiAgICBpZiAobGFuZ1NsdWcgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZS5qb2luKCcgLSAnKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMb2cobWF0Y2gpIHtcclxuICAgIHJldHVybiBfXHJcbiAgICAgICAgLmNoYWluKG1hdGNoLm1hcHMpXHJcbiAgICAgICAgLm1hcCgnb2JqZWN0aXZlcycpXHJcbiAgICAgICAgLmZsYXR0ZW4oKVxyXG4gICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgLnNvcnRCeSgnbGFzdEZsaXBwZWQnKVxyXG4gICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAubWFwKG8gPT4ge1xyXG4gICAgICAgICAgICBvLm1hcElkID0gXy5wYXJzZUludChvLmlkLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgICBvLmxhc3Rtb2QgPSBtb21lbnQoby5sYXN0bW9kLCAnWCcpO1xyXG4gICAgICAgICAgICBvLmxhc3RGbGlwcGVkID0gbW9tZW50KG8ubGFzdEZsaXBwZWQsICdYJyk7XHJcbiAgICAgICAgICAgIG8ubGFzdENsYWltZWQgPSBtb21lbnQoby5sYXN0Q2xhaW1lZCwgJ1gnKTtcclxuICAgICAgICAgICAgby5leHBpcmVzID0gbW9tZW50KG8ubGFzdEZsaXBwZWQpLmFkZCg1LCAnbWludXRlcycpO1xyXG4gICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5ld0NsYWltcyhsb2csIGtub3duR3VpbGRzKSB7XHJcbiAgICByZXR1cm4gIF9cclxuICAgICAgICAuY2hhaW4obG9nKVxyXG4gICAgICAgIC5yZWplY3QobyA9PiBfLmlzRW1wdHkoby5ndWlsZCkpXHJcbiAgICAgICAgLm1hcCgnZ3VpbGQnKVxyXG4gICAgICAgIC51bmlxKClcclxuICAgICAgICAuZGlmZmVyZW5jZShrbm93bkd1aWxkcylcclxuICAgICAgICAudmFsdWUoKTtcclxufSIsIlxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG4vLyBpbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJ3JlZHV4JztcclxuLy8gaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuaW1wb3J0IHBhZ2UgZnJvbSAncGFnZSc7XHJcbmltcG9ydCBkb21yZWFkeSBmcm9tICdkb21yZWFkeSc7XHJcblxyXG5pbXBvcnQgKiBhcyBTVEFUSUMgZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuaW1wb3J0IExhbmdzIGZyb20gJ2xheW91dC9MYW5ncyc7XHJcbmltcG9ydCBOYXZiYXJIZWFkZXIgZnJvbSAnbGF5b3V0L05hdmJhckhlYWRlcic7XHJcbmltcG9ydCBGb290ZXIgZnJvbSAnbGF5b3V0L0Zvb3Rlcic7XHJcblxyXG5pbXBvcnQgT3ZlcnZpZXcgZnJvbSAnT3ZlcnZpZXcnO1xyXG5pbXBvcnQgVHJhY2tlciBmcm9tICdUcmFja2VyJztcclxuXHJcbi8vIGxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKCgpID0+IHt9KTtcclxuXHJcbi8qXHJcbipcclxuKiBMYXVuY2ggQXBwXHJcbipcclxuKi9cclxuXHJcbmRvbXJlYWR5KCgpID0+IHN0YXJ0KCkpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogY29udGFpbmVyXHJcbipcclxuKi9cclxuXHJcbi8vIGNvbnN0IEFwcCA9ICh7XHJcbi8vICAgICBsYW5nU2x1ZyxcclxuLy8gICAgIHdvcmxkU2x1ZyxcclxuLy8gfSkgPT4ge1xyXG4vLyAgICAgY29uc3QgbGFuZyA9IFNUQVRJQy5sYW5nc1tsYW5nU2x1Z107XHJcbi8vICAgICBjb25zdCB3b3JsZCA9IGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4vLyAgICAgY29uc3QgaGFzV29ybGQgPSAod29ybGQgJiYgIV8uaXNFbXB0eSh3b3JsZCkpO1xyXG4vLyAgICAgY29uc3QgSGFuZGxlciA9IChoYXNXb3JsZCkgPyBUcmFja2VyIDogT3ZlcnZpZXc7XHJcblxyXG5cclxuLy8gICAgIHJldHVybiAoXHJcbi8vICAgICAgICAgPGRpdj5cclxuLy8gICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9J25hdmJhciBuYXZiYXItZGVmYXVsdCc+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuLy8gICAgICAgICAgICAgICAgICAgICA8TmF2YmFySGVhZGVyIC8+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPExhbmdzIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0gLz5cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vLyAgICAgICAgICAgICA8L25hdj5cclxuXHJcbi8vICAgICAgICAgICAgIDxzZWN0aW9uIGlkPSdjb250ZW50JyBjbGFzc05hbWU9J2NvbnRhaW5lcic+XHJcbi8vICAgICAgICAgICAgICAgICA8SGFuZGxlciBsYW5nPXtsYW5nfSB3b3JsZD17d29ybGR9IC8+XHJcbi8vICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbi8vICAgICAgICAgICAgIDxGb290ZXIgb2JzZnVFbWFpbD17e1xyXG4vLyAgICAgICAgICAgICAgICAgY2h1bmtzOiBbJ2d3MncydycsICdzY2h0dXBoJywgJ2NvbScsICdAJywgJy4nXSxcclxuLy8gICAgICAgICAgICAgICAgIHBhdHRlcm46ICcwMzE0MicsXHJcbi8vICAgICAgICAgICAgIH19IC8+XHJcbi8vICAgICAgICAgPC9kaXY+XHJcbi8vICAgICApO1xyXG4vLyB9O1xyXG5cclxubGV0IENvbnRhaW5lciA9ICh7XHJcbiAgICBjaGlsZHJlbixcclxuICAgIGxhbmcsXHJcbiAgICB3b3JsZCxcclxufSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT0nbmF2YmFyIG5hdmJhci1kZWZhdWx0Jz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXJIZWFkZXIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgbGFuZz17bGFuZ30gd29ybGQ9e3dvcmxkfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9J2NvbnRlbnQnIGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgPEZvb3RlciBvYnNmdUVtYWlsPXt7XHJcbiAgICAgICAgICAgICAgICBjaHVua3M6IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddLFxyXG4gICAgICAgICAgICAgICAgcGF0dGVybjogJzAzMTQyJyxcclxuICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5Db250YWluZXIucHJvcFR5cGVzID0ge1xyXG4gICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxufTtcclxuXHJcbi8vIENvbnRhaW5lciA9IGNvbm5lY3QoKShDb250YWluZXIpO1xyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiByZW5kZXJBcHAoY3R4KSB7XHJcbi8vICAgICByZXR1cm4gUmVhY3RET00ucmVuZGVyKFxyXG4vLyAgICAgICAgIDxBcHAgey4uLmN0eC5wYXJhbXN9IC8+LFxyXG4vLyAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1hcHAnKVxyXG4vLyAgICAgKTtcclxuLy8gfVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBBcHBsaWNhdGlvbicpO1xyXG5cclxuICAgIHBhZ2UoJy8nLCAoKSA9PiBwYWdlLnJlZGlyZWN0KCcvZW4nKSk7XHJcblxyXG4gICAgcGFnZShcclxuICAgICAgICAnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcikvOndvcmxkU2x1ZyhbYS16LV0rKScsXHJcbiAgICAgICAgY3R4ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGFuZyA9IFNUQVRJQy5sYW5nc1tjdHgucGFyYW1zLmxhbmdTbHVnXTtcclxuICAgICAgICAgICAgY29uc3Qgd29ybGQgPSBnZXRXb3JsZEZyb21TbHVnKGN0eC5wYXJhbXMubGFuZ1NsdWcsIGN0eC5wYXJhbXMud29ybGRTbHVnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICA8Q29udGFpbmVyIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFRyYWNrZXIgbGFuZz17bGFuZ30gd29ybGQ9e3dvcmxkfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9Db250YWluZXI+LFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWFwcCcpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBwYWdlKFxyXG4gICAgICAgICcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKScsXHJcbiAgICAgICAgY3R4ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGFuZyA9IFNUQVRJQy5sYW5nc1tjdHgucGFyYW1zLmxhbmdTbHVnXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHJvdXRlID0+ICR7Y3R4LnBhdGh9YCk7XHJcblxyXG4gICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICA8Q29udGFpbmVyIGxhbmc9e2xhbmd9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxPdmVydmlldyBsYW5nPXtsYW5nfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9Db250YWluZXI+LFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWFwcCcpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcblxyXG4gICAgcGFnZS5zdGFydCh7XHJcbiAgICAgICAgY2xpY2s6IHRydWUsXHJcbiAgICAgICAgcG9wc3RhdGU6IHRydWUsXHJcbiAgICAgICAgZGlzcGF0Y2g6IHRydWUsXHJcbiAgICAgICAgaGFzaGJhbmc6IGZhbHNlLFxyXG4gICAgICAgIGRlY29kZVVSTENvbXBvbmVudHM6IHRydWUsXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBVdGlsXHJcbipcclxuKi9cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpIHtcclxuICAgIHJldHVybiBfLmZpbmQoXHJcbiAgICAgICAgU1RBVElDLndvcmxkcyxcclxuICAgICAgICB3b3JsZCA9PiB3b3JsZFtsYW5nU2x1Z10uc2x1ZyA9PT0gd29ybGRTbHVnXHJcbiAgICApO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7c2NvcmVzfSkgPT4gKFxyXG4gICAgPGltZ1xyXG4gICAgICAgIHNyYyA9IHtnZXRJbWFnZVNvdXJjZShzY29yZXMpfVxyXG5cclxuICAgICAgICB3aWR0aCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgLz5cclxuKTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cHM6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5yZWR9LCR7c2NvcmVzLmJsdWV9LCR7c2NvcmVzLmdyZWVufT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gICAgY29sb3IsXHJcbiAgICB0eXBlLFxyXG59KSA9PiAoXHJcbiAgICA8c3BhbiBjbGFzc05hbWUgPSB7YHNwcml0ZSAke3R5cGV9ICR7Y29sb3J9YH0gLz5cclxuKTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoe2RpcmVjdGlvbn0pID0+IChcclxuICAgIChkaXJlY3Rpb24pXHJcbiAgICAgICAgPyA8aW1nIHNyYz17Z2V0QXJyb3dTcmMoZGlyZWN0aW9uKX0gY2xhc3NOYW1lPSdhcnJvdycgLz5cclxuICAgICAgICA6IDxzcGFuIC8+XHJcbik7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMoZGlyZWN0aW9uKSB7XHJcbiAgICBpZiAoIWRpcmVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignTicpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnbm9ydGgnKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpcmVjdGlvbi5pbmRleE9mKCdTJykgPj0gMCkge1xyXG4gICAgICAgIHNyYy5wdXNoKCdzb3V0aCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24uaW5kZXhPZignVycpID49IDApIHtcclxuICAgICAgICBzcmMucHVzaCgnd2VzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uLmluZGV4T2YoJ0UnKSA+PSAwKSB7XHJcbiAgICAgICAgc3JjLnB1c2goJ2Vhc3QnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn0iLCJcclxuaW1wb3J0IFJlYWN0IGZyb20ncmVhY3QnO1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBndWlsZElkLFxyXG4gICAgc2l6ZSxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG59KSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0ge2BlbWJsZW0gJHtjbGFzc05hbWV9YH1cclxuXHJcbiAgICAgICAgICAgIHNyYyA9IHtgaHR0cHM6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8ke2d1aWxkSWR9LnN2Z2B9XHJcbiAgICAgICAgICAgIHdpZHRoID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuICAgICAgICAgICAgaGVpZ2h0ID0ge3NpemUgPyBzaXplIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgIG9uRXJyb3IgPSB7KGUpID0+IChlLnRhcmdldC5zcmMgPSBpbWdQbGFjZWhvbGRlcil9XHJcbiAgICAgICAgLz5cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QgZnJvbSdyZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBjb2xvciA9ICdibGFjaycsXHJcbiAgICB0eXBlLFxyXG4gICAgc2l6ZSxcclxufSkgPT4ge1xyXG4gICAgbGV0IHNyYyA9ICcvaW1nL2ljb25zL2Rpc3QvJztcclxuICAgIHNyYyArPSB0eXBlO1xyXG4gICAgaWYgKGNvbG9yICE9PSAnYmxhY2snKSB7XHJcbiAgICAgICAgc3JjICs9ICctJyArIGNvbG9yO1xyXG4gICAgfVxyXG4gICAgc3JjICs9ICcuc3ZnJztcclxuXHJcbiAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgIHNyYz17c3JjfVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGljb24tb2JqZWN0aXZlIGljb24tb2JqZWN0aXZlLSR7dHlwZX1gfVxyXG4gICAgICAgIHdpZHRoPXtzaXplID8gc2l6ZTogbnVsbH1cclxuICAgICAgICBoZWlnaHQ9e3NpemUgPyBzaXplOiBudWxsfVxyXG4gICAgLz47XHJcbn07IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBvYnNmdUVtYWlsLFxyXG59KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC14cy0yNCc+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT0nc21hbGwgbXV0ZWQgdGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgwqkgMjAxMyBBcmVuYU5ldCwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTkNzb2Z0LCB0aGUgaW50ZXJsb2NraW5nIE5DIGxvZ28sIEFyZW5hTmV0LCBHdWlsZCBXYXJzLCBHdWlsZCBXYXJzIEZhY3Rpb25zLCBHdWlsZCBXYXJzIE5pZ2h0ZmFsbCwgR3VpbGQgV2FyczpFeWUgb2YgdGhlIE5vcnRoLCBHdWlsZCBXYXJzIDIsIGFuZCBhbGwgYXNzb2NpYXRlZCBsb2dvcyBhbmQgZGVzaWducyBhcmUgdHJhZGVtYXJrcyBvciByZWdpc3RlcmVkIHRyYWRlbWFya3Mgb2YgTkNzb2Z0IENvcnBvcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxsIG90aGVyIHRyYWRlbWFya3MgYXJlIHRoZSBwcm9wZXJ0eSBvZiB0aGVpciByZXNwZWN0aXZlIG93bmVycy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2Ugc2VuZCBjb21tZW50cyBhbmQgYnVncyB0byA8T2JzZnVFbWFpbCBvYnNmdUVtYWlsPXtvYnNmdUVtYWlsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1cHBvcnRpbmcgbWljcm9zZXJ2aWNlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9J2h0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS8nPmd1aWxkcy5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3N0YXRlLmd3Mncydy5jb20vJz5zdGF0ZS5ndzJ3MncuY29tPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJm5ic3A7Jm5kYXNoOyZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0naHR0cDovL3d3dy5waWVseS5uZXQvJz53d3cucGllbHkubmV0PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNvdXJjZSBhdmFpbGFibGUgYXQgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdCc+aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L2d3Mncydy1yZWFjdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9mb290ZXI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG5cclxuY29uc3QgT2JzZnVFbWFpbCA9ICh7b2JzZnVFbWFpbH0pID0+IHtcclxuICAgIGNvbnN0IHJlY29uc3RydWN0ZWQgPSBvYnNmdUVtYWlsLnBhdHRlcm5cclxuICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgLm1hcChpeENodW5rID0+IG9ic2Z1RW1haWwuY2h1bmtzW2l4Q2h1bmtdKVxyXG4gICAgICAgIC5qb2luKCcnKTtcclxuXHJcbiAgICByZXR1cm4gPGEgaHJlZj17YG1haWx0bzoke3JlY29uc3RydWN0ZWR9YH0+e3JlY29uc3RydWN0ZWR9PC9hPjtcclxufTsiLCJcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHtcclxuICAgIGxhbmcsXHJcbiAgICBsaW5rTGFuZyxcclxuICAgIHdvcmxkLFxyXG59KSA9PiAgKFxyXG4gICAgPGxpXHJcbiAgICAgICAgY2xhc3NOYW1lPXtnZXRDbGFzc25hbWUobGFuZywgbGlua0xhbmcpfVxyXG4gICAgICAgIHRpdGxlPXtsaW5rTGFuZy5uYW1lfVxyXG4gICAgPlxyXG4gICAgICAgIDxhIGhyZWY9e2dldExpbmsobGlua0xhbmcsIHdvcmxkKX0+e2xpbmtMYW5nLmxhYmVsfTwvYT5cclxuICAgIDwvbGk+XHJcbik7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldENsYXNzbmFtZShsYW5nLCBsaW5rTGFuZykge1xyXG4gICAgcmV0dXJuIGNsYXNzbmFtZXMoe1xyXG4gICAgICAgIGFjdGl2ZTogbGFuZy5sYWJlbCA9PT0gbGlua0xhbmcubGFiZWwsXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TGluayhsYW5nLCB3b3JsZCkge1xyXG4gICAgY29uc3QgbGFuZ1NsdWcgPSBsYW5nLnNsdWc7XHJcblxyXG4gICAgbGV0IGxpbmsgPSBgLyR7bGFuZ1NsdWd9YDtcclxuXHJcbiAgICBpZiAod29ybGQpIHtcclxuICAgICAgICBjb25zdCB3b3JsZFNsdWcgPSB3b3JsZFtsYW5nU2x1Z10uc2x1ZztcclxuXHJcbiAgICAgICAgbGluayArPSBgLyR7d29ybGRTbHVnfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxpbms7XHJcbn1cclxuIiwiXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IHtsYW5nc30gZnJvbSAnbGliL3N0YXRpYyc7XHJcblxyXG5pbXBvcnQgTGFuZ0xpbmsgZnJvbSAnLi9MYW5nTGluayc7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7XHJcbiAgICBsYW5nLFxyXG4gICAgd29ybGQsXHJcbn0pID0+IChcclxuICAgIDxkaXYgaWQ9J25hdi1sYW5ncycgY2xhc3NOYW1lPSdwdWxsLXJpZ2h0Jz5cclxuICAgICAgICA8dWwgY2xhc3NOYW1lID0gJ25hdiBuYXZiYXItbmF2Jz5cclxuICAgICAgICAgICAge18ubWFwKGxhbmdzLCAobGlua0xhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHtrZXl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgPSB7bGFuZ31cclxuICAgICAgICAgICAgICAgICAgICBsaW5rTGFuZyA9IHtsaW5rTGFuZ31cclxuICAgICAgICAgICAgICAgICAgICB3b3JsZCA9IHt3b3JsZH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXItaGVhZGVyJz5cclxuICAgICAgICA8YSBjbGFzc05hbWU9J25hdmJhci1icmFuZCcgaHJlZj0nLyc+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPScvaW1nL2xvZ28vbG9nby05NngzNi5wbmcnIC8+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgPC9kaXY+XHJcbik7IiwiXHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVyYWdlbnQnO1xyXG5cclxuY29uc3Qgbm9vcCA9ICgpID0+IG51bGw7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoQnlXb3JsZFNsdWcsXHJcbiAgICBnZXRNYXRjaEJ5V29ybGRJZCxcclxuICAgIGdldEd1aWxkQnlJZCxcclxufTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hlcyh7XHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hlcygpJyk7XHJcblxyXG4gICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXQoYGh0dHBzOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzYClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZFNsdWcoe1xyXG4gICAgd29ybGRTbHVnLFxyXG4gICAgc3VjY2VzcyA9IG5vb3AsXHJcbiAgICBlcnJvciA9IG5vb3AsXHJcbiAgICBjb21wbGV0ZSA9IG5vb3AsXHJcbn0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6OmdldE1hdGNoQnlXb3JsZFNsdWcoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZFNsdWd9YClcclxuICAgICAgICAuZW5kKG9uUmVxdWVzdC5iaW5kKHRoaXMsIHtzdWNjZXNzLCBlcnJvciwgY29tcGxldGV9KSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgIHdvcmxkSWQsXHJcbiAgICBzdWNjZXNzID0gbm9vcCxcclxuICAgIGVycm9yID0gbm9vcCxcclxuICAgIGNvbXBsZXRlID0gbm9vcCxcclxufSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaTo6Z2V0TWF0Y2hCeVdvcmxkSWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL3N0YXRlLmd3Mncydy5jb20vd29ybGQvJHt3b3JsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRHdWlsZEJ5SWQoe1xyXG4gICAgZ3VpbGRJZCxcclxuICAgIHN1Y2Nlc3MgPSBub29wLFxyXG4gICAgZXJyb3IgPSBub29wLFxyXG4gICAgY29tcGxldGUgPSBub29wLFxyXG59KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYXBpOjpnZXRHdWlsZEJ5SWQoKScpO1xyXG5cclxuICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0KGBodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24/Z3VpbGRfaWQ9JHtndWlsZElkfWApXHJcbiAgICAgICAgLmVuZChvblJlcXVlc3QuYmluZCh0aGlzLCB7c3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlfSkpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25SZXF1ZXN0KGNhbGxiYWNrcywgZXJyLCByZXMpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhcGk6Om9uUmVxdWVzdCgpJywgZXJyLCByZXMgJiYgcmVzLmJvZHkpO1xyXG5cclxuICAgIGlmIChlcnIgfHwgcmVzLmVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLmVycm9yKGVycik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjYWxsYmFja3Muc3VjY2VzcyhyZXMuYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2tzLmNvbXBsZXRlKCk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdmVydmlld0RhdGFQcm92aWRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmNvbnN0cnVjdG9yKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX19saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3Ojppbml0KCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX19nZXREYXRhKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6Y2xvc2UoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIF9fZ2V0RGF0YSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19nZXREYXRhKCknKTtcclxuXHJcbiAgICAgICAgYXBpLmdldE1hdGNoZXMoe1xyXG4gICAgICAgICAgICB3b3JsZElkOiB0aGlzLl9fd29ybGRJZCxcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHRoaXMuX19vbk1hdGNoRGF0YShkYXRhKSxcclxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19vbk1hdGNoRGF0YShkYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fb25NYXRjaERhdGEoKScsIHRleHRTdGF0dXMsIGpxWEhSLCBkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEgJiYgIV8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICAodGhpcy5fX2xpc3RlbmVycy5vbk1hdGNoRGF0YSB8fCBfLm5vb3ApKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBnZXRJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpJywgaW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMubWF0Y2hEYXRhID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgdGhpcy5fX2dldERhdGEuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgaW50ZXJ2YWxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCgpIHtcclxuICAgIHJldHVybiBfLnJhbmRvbSg0MDAwLCA4MDAwKTtcclxufVxyXG4iLCJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJztcclxuXHJcbmltcG9ydCAqIGFzIGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBNb2R1bGUgR2xvYmFsc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IE5VTV9RVUVVRV9DT05DVVJSRU5UID0gNDtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFB1YmxpYyBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGliR3VpbGRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgICB0aGlzLl9fYXN5bmNHdWlsZFF1ZXVlID0gYXN5bmMucXVldWUoXHJcbiAgICAgICAgICAgIGdldEd1aWxkRGV0YWlsc0Zyb21RdWV1ZSxcclxuICAgICAgICAgICAgTlVNX1FVRVVFX0NPTkNVUlJFTlRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsb29rdXAoZ3VpbGRzLCBvbkRhdGFMaXN0ZW5lcikge1xyXG4gICAgICAgIGNvbnN0IHRvUXVldWUgPSBfLm1hcChcclxuICAgICAgICAgICAgZ3VpbGRzLFxyXG4gICAgICAgICAgICBndWlsZElkID0+ICh7XHJcbiAgICAgICAgICAgICAgICBndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgb25EYXRhOiBvbkRhdGFMaXN0ZW5lcixcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX2FzeW5jR3VpbGRRdWV1ZS5wdXNoKHRvUXVldWUpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHNGcm9tUXVldWUoY2FyZ28sIG9uQ29tcGxldGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRHdWlsZERldGFpbHNGcm9tUXVldWUnLCBjYXJnbywgY2FyZ28uZ3VpbGRJZCk7XHJcblxyXG4gICAgYXBpLmdldEd1aWxkQnlJZCh7XHJcbiAgICAgICAgZ3VpbGRJZDogY2FyZ28uZ3VpbGRJZCxcclxuICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4gb25HdWlsZERhdGEoZGF0YSwgY2FyZ28pLFxyXG4gICAgICAgIGNvbXBsZXRlOiBvbkNvbXBsZXRlLFxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEoZGF0YSwgY2FyZ28pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvbkd1aWxkRGF0YScsIGRhdGEpO1xyXG5cclxuICAgIGlmIChkYXRhICYmICFfLmlzRW1wdHkoZGF0YSkpIHtcclxuICAgICAgICBjYXJnby5vbkRhdGEoe1xyXG4gICAgICAgICAgICBpZDogZGF0YS5ndWlsZF9pZCxcclxuICAgICAgICAgICAgbmFtZTogZGF0YS5ndWlsZF9uYW1lLFxyXG4gICAgICAgICAgICB0YWc6IGRhdGEudGFnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgR3VpbGRzREFPIGZyb20gJy4vZ3VpbGRzJztcclxuaW1wb3J0IGFwaSBmcm9tICdsaWIvYXBpJztcclxuXHJcbmltcG9ydCAqIGFzIFNUQVRJQyBmcm9tICdsaWIvc3RhdGljJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdmVydmlld0RhdGFQcm92aWRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y29uc3RydWN0b3IoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGFuZ1NsdWcgID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9fd29ybGRTbHVnID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ndWlsZHMgICAgICA9IG5ldyBHdWlsZHNEQU8oKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCh3b3JsZCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmluaXQoKScsIGxhbmcsIHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRXb3JsZCh3b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFdvcmxkKHdvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5fX3dvcmxkSWQgPSB3b3JsZC5pZDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0TWF0Y2hXb3JsZHMobWF0Y2gpIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoXHJcbiAgICAgICAgICAgIHtyZWQ6IHt9LCBibHVlOiB7fSwgZ3JlZW46IHt9fSxcclxuICAgICAgICAgICAgKGosIGNvbG9yKSA9PiBnZXRNYXRjaFdvcmxkKG1hdGNoLCBjb2xvcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19nZXREYXRhKCknKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGFwaS5nZXRNYXRjaEJ5V29ybGRTbHVnKHtcclxuICAgICAgICAvLyAgICAgd29ybGRTbHVnOiB0aGlzLl9fd29ybGRTbHVnLFxyXG4gICAgICAgIC8vICAgICBzdWNjZXNzOiAoZGF0YSkgPT4gdGhpcy5fX29uTWF0Y2hEZXRhaWxzKGRhdGEpLFxyXG4gICAgICAgIC8vICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCksXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgYXBpLmdldE1hdGNoQnlXb3JsZElkKHtcclxuICAgICAgICAgICAgd29ybGRJZDogdGhpcy5fX3dvcmxkSWQsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB0aGlzLl9fb25NYXRjaERldGFpbHMoZGF0YSksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB0aGlzLl9fcmVzY2hlZHVsZURhdGFVcGRhdGUoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERldGFpbHMoZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6Ol9fb25NYXRjaERhdGEoKScsIGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAoZGF0YSAmJiAhXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERldGFpbHMoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAgKiA0LCAxMDAwICogOCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXRhIHJlZnJlc2g6ICcsIHJlZnJlc2hUaW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzLmRhdGEgPSBzZXRUaW1lb3V0KHRoaXMuX19nZXREYXRhLmJpbmQodGhpcyksIHJlZnJlc2hUaW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiAgIFdvcmxkc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hXb3JsZChtYXRjaCwgY29sb3IpIHtcclxuICAgIGNvbnN0IHdvcmxkSWQgPSBtYXRjaC53b3JsZHNbY29sb3JdLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgY29uc3Qgd29ybGQgPSBfLm1lcmdlKFxyXG4gICAgICAgIHtjb2xvcjogY29sb3J9LFxyXG4gICAgICAgIFNUQVRJQy53b3JsZHNbd29ybGRJZF1cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgU1RBVElDX0xBTkdTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncyc7XHJcbmltcG9ydCBTVEFUSUNfV09STERTIGZyb20gJ2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcyc7XHJcbmltcG9ydCBTVEFUSUNfT0JKRUNUSVZFUyBmcm9tICdndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlc192Ml9tZXJnZWQnO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkW2xhbmdTbHVnXS5zbHVnXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXMgPSBTVEFUSUNfT0JKRUNUSVZFUztcclxuZXhwb3J0IGNvbnN0IGxhbmdzID0gU1RBVElDX0xBTkdTO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB3b3JsZHMgPSBfXHJcbiAgICAuY2hhaW4oU1RBVElDX1dPUkxEUylcclxuICAgIC5rZXlCeSgnaWQnKVxyXG4gICAgLm1hcFZhbHVlcygod29ybGQpID0+IHtcclxuICAgICAgICBfLmZvckVhY2goXHJcbiAgICAgICAgICAgIFNUQVRJQ19MQU5HUyxcclxuICAgICAgICAgICAgKGxhbmcpID0+XHJcbiAgICAgICAgICAgIHdvcmxkW2xhbmcuc2x1Z10ubGluayA9IGdldFdvcmxkTGluayhsYW5nLnNsdWcsIHdvcmxkKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHdvcmxkO1xyXG4gICAgfSlcclxuICAgIC52YWx1ZSgpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgb2JqZWN0aXZlc01ldGEgPSBfLmtleUJ5KFtcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAxLCBpZDogJzknLCBkaXJlY3Rpb246ICcnfSwgICAgICAgICAgLy8gc3RvbmVtaXN0XHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgIC8vIG92ZXJsb29rXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzIwJywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAgLy8gdmVsb2thXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICcxOCcsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgIC8vIGFuelxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDIsIGlkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMiwgaWQ6ICc2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgIC8vIHNwZWxkYW5cclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAyLCBpZDogJzUnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgICAgLy8gcGFuZ1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE1JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gbGFuZ29yXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogMywgaWQ6ICcyMicsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGJyYXZvc3RcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnMjEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBkdXJpb3NcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiAzLCBpZDogJzcnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gZGFuZVxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDMsIGlkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBsb3dsYW5kc1xyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTEnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgICAvLyBhbGRvbnNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzEyJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gd2lsZGNyZWVrXHJcbiAgICB7bWFwOiAnZWInLCBncm91cDogNCwgaWQ6ICcxNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgIC8vIGtsb3ZhblxyXG4gICAge21hcDogJ2ViJywgZ3JvdXA6IDQsIGlkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgIHttYXA6ICdlYicsIGdyb3VwOiA0LCBpZDogJzQnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAgLy8gZ29sYW50YVxyXG5cclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTMnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgIC8vIHJhbXBhcnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMDYnLCBkaXJlY3Rpb246ICdXJ30sICAgICAgIC8vIHVuZGVyY3JvZnRcclxuICAgIHttYXA6ICdibDInLCBncm91cDogMSwgaWQ6ICcxMTQnLCBkaXJlY3Rpb246ICdFJ30sICAgICAgIC8vIHBhbGFjZVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwMicsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgLy8gYWNhZGVteVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwNCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gbmVjcm9wb2xpc1xyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzk5JywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gbGFiXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDIsIGlkOiAnMTE1JywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBoaWRlYXdheVxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAyLCBpZDogJzEwOScsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgLy8gcmVmdWdlXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTEwJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBvdXRwb3N0XHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTA1JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBkZXBvdFxyXG4gICAge21hcDogJ2JsMicsIGdyb3VwOiAzLCBpZDogJzEwMScsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgLy8gZW5jYW1wXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTAwJywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAvLyBmYXJtXHJcbiAgICB7bWFwOiAnYmwyJywgZ3JvdXA6IDMsIGlkOiAnMTE2JywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAvLyB3ZWxsXHJcbl0sICdpZCcpO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWFwc01ldGEgPSBbXHJcbiAgICB7aWQ6IDM4LCBuYW1lOiAnRXRlcm5hbCBCYXR0bGVncm91bmRzJywgYWJicjogJ0VCJ30sXHJcbiAgICB7aWQ6IDEwOTksIG5hbWU6ICdSZWQgQm9yZGVybGFuZHMnLCBhYmJyOiAnUmVkJ30sXHJcbiAgICB7aWQ6IDExMDIsIG5hbWU6ICdHcmVlbiBCb3JkZXJsYW5kcycsIGFiYnI6ICdHcm4nfSxcclxuICAgIHtpZDogMTE0MywgbmFtZTogJ0JsdWUgQm9yZGVybGFuZHMnLCBhYmJyOiAnQmx1J30sXHJcbl07XHJcblxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG9iamVjdGl2ZXNHZW8gPSB7XHJcbiAgICBlYjogW1tcclxuICAgICAgICB7aWQ6ICc5JywgZGlyZWN0aW9uOiAnJ30sICAgICAgICAgIC8vIHN0b25lbWlzdFxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzEnLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAgLy8gb3Zlcmxvb2tcclxuICAgICAgICB7aWQ6ICcxNycsIGRpcmVjdGlvbjogJ05XJ30sICAgICAgIC8vIG1lbmRvbnNcclxuICAgICAgICB7aWQ6ICcyMCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgIC8vIHZlbG9rYVxyXG4gICAgICAgIHtpZDogJzE4JywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAgLy8gYW56XHJcbiAgICAgICAge2lkOiAnMTknLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgICAvLyBvZ3JlXHJcbiAgICAgICAge2lkOiAnNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgICAvLyBzcGVsZGFuXHJcbiAgICAgICAge2lkOiAnNScsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgICAvLyBwYW5nXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMicsIGRpcmVjdGlvbjogJ1NFJ30sICAgICAgICAvLyB2YWxsZXlcclxuICAgICAgICB7aWQ6ICcxNScsIGRpcmVjdGlvbjogJ1MnfSwgICAgICAgIC8vIGxhbmdvclxyXG4gICAgICAgIHtpZDogJzIyJywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8gYnJhdm9zdFxyXG4gICAgICAgIHtpZDogJzE2JywgZGlyZWN0aW9uOiAnVyd9LCAgICAgICAgLy8gcXVlbnRpblxyXG4gICAgICAgIHtpZDogJzIxJywgZGlyZWN0aW9uOiAnTid9LCAgICAgICAgLy8gZHVyaW9zXHJcbiAgICAgICAge2lkOiAnNycsIGRpcmVjdGlvbjogJ1NXJ30sICAgICAgICAvLyBkYW5lXHJcbiAgICAgICAge2lkOiAnOCcsIGRpcmVjdGlvbjogJ05FJ30sICAgICAgICAvLyB1bWJlclxyXG4gICAgXSwgW1xyXG4gICAgICAgIHtpZDogJzMnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgICAgLy8gbG93bGFuZHNcclxuICAgICAgICB7aWQ6ICcxMScsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgIC8vIGFsZG9uc1xyXG4gICAgICAgIHtpZDogJzEzJywgZGlyZWN0aW9uOiAnUyd9LCAgICAgICAgLy8gamVycmlmZXJcclxuICAgICAgICB7aWQ6ICcxMicsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgIC8vIHdpbGRjcmVla1xyXG4gICAgICAgIHtpZDogJzE0JywgZGlyZWN0aW9uOiAnRSd9LCAgICAgICAgLy8ga2xvdmFuXHJcbiAgICAgICAge2lkOiAnMTAnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgICAvLyByb2d1ZXNcclxuICAgICAgICB7aWQ6ICc0JywgZGlyZWN0aW9uOiAnU0UnfSwgICAgICAgIC8vIGdvbGFudGFcclxuICAgIF1dLFxyXG4gICAgYmwyOiBbW1xyXG4gICAgICAgIHtpZDogJzExMycsIGRpcmVjdGlvbjogJ04nfSwgICAgICAgLy8gcmFtcGFydFxyXG4gICAgICAgIHtpZDogJzEwNicsIGRpcmVjdGlvbjogJ1cnfSwgICAgICAgLy8gdW5kZXJjcm9mdFxyXG4gICAgICAgIHtpZDogJzExNCcsIGRpcmVjdGlvbjogJ0UnfSwgICAgICAgLy8gcGFsYWNlXHJcbiAgICBdLCBbXHJcbiAgICAgICAge2lkOiAnMTAyJywgZGlyZWN0aW9uOiAnTlcnfSwgICAgICAvLyBhY2FkZW15XHJcbiAgICAgICAge2lkOiAnMTA0JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyBuZWNyb3BvbGlzXHJcbiAgICAgICAge2lkOiAnOTknLCBkaXJlY3Rpb246ICdOJ30sICAgICAgICAvLyBsYWJcclxuICAgICAgICB7aWQ6ICcxMTUnLCBkaXJlY3Rpb246ICdOVyd9LCAgICAgIC8vIGhpZGVhd2F5XHJcbiAgICAgICAge2lkOiAnMTA5JywgZGlyZWN0aW9uOiAnTkUnfSwgICAgICAvLyByZWZ1Z2VcclxuICAgIF0sIFtcclxuICAgICAgICB7aWQ6ICcxMTAnLCBkaXJlY3Rpb246ICdTVyd9LCAgICAgIC8vIG91dHBvc3RcclxuICAgICAgICB7aWQ6ICcxMDUnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGRlcG90XHJcbiAgICAgICAge2lkOiAnMTAxJywgZGlyZWN0aW9uOiAnU1cnfSwgICAgICAvLyBlbmNhbXBcclxuICAgICAgICB7aWQ6ICcxMDAnLCBkaXJlY3Rpb246ICdTRSd9LCAgICAgIC8vIGZhcm1cclxuICAgICAgICB7aWQ6ICcxMTYnLCBkaXJlY3Rpb246ICdTJ30sICAgICAgIC8vIHdlbGxcclxuICAgIF1dLFxyXG59O1xyXG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImVuXCI6IHtcclxuXHRcdFwic29ydFwiOiAxLFxyXG5cdFx0XCJzbHVnXCI6IFwiZW5cIixcclxuXHRcdFwibGFiZWxcIjogXCJFTlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VuXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFbmdsaXNoXCJcclxuXHR9LFxyXG5cdFwiZGVcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDIsXHJcblx0XHRcInNsdWdcIjogXCJkZVwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkRFXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZGVcIixcclxuXHRcdFwibmFtZVwiOiBcIkRldXRzY2hcIlxyXG5cdH0sXHJcblx0XCJlc1wiOiB7XHJcblx0XHRcInNvcnRcIjogMyxcclxuXHRcdFwic2x1Z1wiOiBcImVzXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRVNcIixcclxuXHRcdFwibGlua1wiOiBcIi9lc1wiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXNwYcOxb2xcIlxyXG5cdH0sXHJcblx0XCJmclwiOiB7XHJcblx0XHRcInNvcnRcIjogNCxcclxuXHRcdFwic2x1Z1wiOiBcImZyXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRlJcIixcclxuXHRcdFwibGlua1wiOiBcIi9mclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRnJhbsOnYWlzXCJcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgXCIxMDk5LTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJIYW1tJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBIYW1tXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIYW1tcyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgSGFtbVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzE0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA4NjQsIDk1NTkuNDldXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTk5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi05OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJMZXNoJ3MgTGFiXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWJvcmF0b3JpbyBkZSBMZXNoXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJMZXNocyBMYWJvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFib3JhdG9pcmUgZGUgTGVzaFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3Mjc5Ljk1LCAxMjExOS41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My05OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtOTlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiWmFraydzIExhYlwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFib3JhdG9yaW8gZGUgWmFra1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWmFra3MgTGFib3JcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYm9yYXRvaXJlIGRlIFpha2tcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDQ0OCwgMTE0NzkuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQmF1ZXIgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmF1ZXItR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgQmF1ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzkzLjcsIDExMjU4LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJhcnJldHQgRmFybXN0ZWFkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXJyZXR0XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCYXJyZXR0LUdlaMO2ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZlcm1lIEJhcnJldHRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0NSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODIwOS43MSwgMTM4MTguNF1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR2VlIEZhcm1zdGVhZFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiSGFjaWVuZGEgZGUgR2VlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHZWUtR2Vow7ZmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmVybWUgR2VlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyOTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzNzcuNywgMTMxNzguNF1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTWNMYWluJ3MgRW5jYW1wbWVudFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ2FtcGFtZW50byBkZSBNY0xhaW5cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk1jTGFpbnMgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkZSBNY0xhaW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk3MTIuOCwgMTEyNjMuNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGF0cmljaydzIEVuY2FtcG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbXBhbWVudG8gZGUgUGF0cmlja1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUGF0cmlja3MgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkZSBQYXRyaWNrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzNDIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzYxMjguOCwgMTM4MjMuNV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTAxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMDFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFiaWIncyBFbmNhbXBtZW50XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW1lbnRvIGRlIEhhYmliXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIYWJpYnMgTGFnZXJcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhbXBlbWVudCBkJ0hhYmliXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMyOTYuOCwgMTMxODMuNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTAyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTydkZWwgQWNhZGVteVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWNhZGVtaWEgTydkZWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk8nZGVsLUFrYWRlbWllXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBY2Fkw6ltaWUgZGUgTydkZWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODMyLjQsIDk1OTQuNjNdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlknbGFuIEFjYWRlbXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFjYWRlbWlhIFknbGFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJZJ2xhbi1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIFknbGFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MjQ4LjQsIDEyMTU0LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTAyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIktheSdsaSBBY2FkZW15XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBY2FkZW1pYSBLYXknbGlcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIktheSdsaS1Ba2FkZW1pZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQWNhZMOpbWllIGRlIEtheSdsaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzM3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzQxNi40LCAxMTUxNC42XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJFdGVybmFsIE5lY3JvcG9saXNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk5lY3LDs3BvbGlzIEV0ZXJuYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRXdpZ2UgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIMOpdGVybmVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwOCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTgwMi43LCA5NjY0Ljc1XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZWF0aGxlc3MgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgSW5tb3J0YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRvZGxvc2UgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIGltbW9ydGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMyNSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyMTguNzIsIDEyMjI0LjddXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlVuZHlpbmcgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTmVjcsOzcG9saXMgSW1wZXJlY2VkZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbnN0ZXJibGljaGUgTmVrcm9wb2xlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJOw6ljcm9wb2xlIGltcMOpcmlzc2FibGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTUzODYuNywgMTE1ODQuN11cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ3JhbmtzaGFmdCBEZXBvdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVww7NzaXRvIGRlIFBhbGFuY2FtYW5pamFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJLdXJiZWx3ZWxsZW4tRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgVmlsZWJyZXF1aW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTI2NC4zLCAxMTYwOS40XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTcGFya3BsdWcgRGVwb3RcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkRlcMOzc2l0byBkZSBCdWrDrWFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJaw7xuZGZ1bmtlbi1EZXBvdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRMOpcMO0dCBCb3VnaWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMwMixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc2ODAuMzIsIDE0MTY5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZseXdoZWVsIERlcG90XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJEZXDDs3NpdG8gZGUgVm9sYW50ZXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHd1bmdyYWQtRGVwb3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkTDqXDDtHQgRW5ncmVuYWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0ODQ4LjMsIDEzNTI5LjRdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsaXN0ZXJpbmcgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBBY2hpY2hhcnJhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcmVubmVuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSBlbWJyYXPDqWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk4NTQuNTgsIDEwNTc4LjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNjb3JjaGluZyBVbmRlcmNyb2Z0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJTw7N0YW5vIEFicmFzYWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVmVyc2VuZ2VuZGUgR3J1ZnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNyeXB0ZSBjdWlzYW50ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MjcwLjU4LCAxMzEzOC41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUb3JyaWQgVW5kZXJjcm9mdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU8OzdGFubyBTb2ZvY2FudGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsw7xoZW5kZSBHcnVmdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ3J5cHRlIHRvcnJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5OCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMzQzOC42LCAxMjQ5OC41XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxMSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMjAyMi41LCAxMTc4OS45XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTEwN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxMCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg0MzguNDksIDE0MzQ5LjldXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTEwN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTA3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzQ5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTYwNi41LCAxMzcwOS45XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1MCxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFs5NjQxLjcsIDExNzQ5LjZdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTEwOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTA4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJvcmRlclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnJvbnRlcmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyZW56ZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gRnJvbnRpw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjA1Ny43LCAxNDMwOS42XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDhcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwOFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCb3JkZXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZyb250ZXJhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcmVuemUgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEZyb250acOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4NSxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTMyMjUuNywgMTM2NjkuNl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUm95J3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIFJveVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUm95cyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIFJveVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzIyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE5NTQuNiwgMTAwNjguNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTA5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMDlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTm9yZm9saydzIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBkZSBOb3Jmb2xrXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJOb3Jmb2xrcyBadWZsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmVmdWdlIGRlIE5vcmZvbGtcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODM3MC42LCAxMjYyOC41XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMDlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTEwOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPbGl2aWVyJ3MgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIE9saXZpZXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9saXZpZXJzIFp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZCdPbGl2aWVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExNDMsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTU1MzguNiwgMTE5ODguNV1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUGFyY2hlZCBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gQWJyYXNhZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlcmTDtnJydGVyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgZMOpdmFzdMOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyNzcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAyNTUsIDExNTc2XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXaXRoZXJlZCBPdXRwb3N0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQdWVzdG8gQXZhbnphZG8gRGVzb2xhZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldlbGtlciBBdcOfZW5wb3N0ZW5cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF2YW50LXBvc3RlIHJhdmFnw6lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY2NzEuMDUsIDE0MTM2XVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCYXJyZW4gT3V0cG9zdFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUHVlc3RvIEF2YW56YWRvIEFiYW5kb25hZG9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIsOWZGVyIEF1w59lbnBvc3RlblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQXZhbnQtcG9zdGUgZMOpbGFicsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMjgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzODM5LCAxMzQ5Nl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RvaWMgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBFc3RvaWNhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdG9pc2NoZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IHN0b8OvcXVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDgxMi4zLCAxMDEwMi45XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbXBhc3NpdmUgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBJbXBlcnR1cmJhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJVbmJlZWluZHJ1Y2t0ZXIgRmVzdHVuZ3N3YWxsXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZW1wYXJ0IGltcGFzc2libGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxOCxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDExMDIsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzIyOC4zMiwgMTI2NjIuOV1cclxuICAgIH0sXHJcbiAgICBcIjExNDMtMTEzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTE0My0xMTNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGFyZGVuZWQgUmFtcGFydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTXVyYWxsYSBFbmR1cmVjaWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGFobGhhcnRlciBGZXN0dW5nc3dhbGxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlbXBhcnQgZHVyY2lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTI5MyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNDM5Ni4zLCAxMjAyMi45XVxyXG4gICAgfSxcclxuICAgIFwiMTA5OS0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMDk5LTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPc3ByZXkncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIMOBZ3VpbGEgUGVzY2Fkb3JhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGaXNjaGFkbGVyLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGR1IGJhbGJ1emFyZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE3ODgsIDEwNjYwLjJdXHJcbiAgICB9LFxyXG4gICAgXCIxMTAyLTExNFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExMDItMTE0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkhhcnJpZXIncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIEFndWlsdWNob1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2VpaGVuLVBhbGFzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFsYWlzIGR1IGNpcmNhw6h0ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjg3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjA0LCAxMzIyMC4yXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTaHJpa2UncyBQYWxhY2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBhbGFjaW8gZGVsIEFsY2F1ZMOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV8O8cmdlci1QYWxhc3RcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlBhbGFpcyBkZSBsYSBwaWUtZ3Jpw6hjaGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM1NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTE0MyxcclxuICAgICAgICBcImNvb3JkXCI6IFsxNTM3MiwgMTI1ODAuMl1cclxuICAgIH0sXHJcbiAgICBcIjEwOTktMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTA5OS0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQm9ldHRpZ2VyJ3MgSGlkZWF3YXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY29uZHJpam8gZGUgQm9ldHRpZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCb2V0dGlnZXJzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBCb2V0dGlnZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTMxNixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMDk5LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzk1ODUuOSwgMTAwMzcuMV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSHVnaGUncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBIdWdoZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiSHVnaGVzIFZlcnN0ZWNrXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBbnRyZSBkZSBIdWdoZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzI0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs2MDAxLjksIDEyNTk3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJlcmRyb3cncyBIaWRlYXdheVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNjb25kcmlqbyBkZSBCZXJkcm93XCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCZXJkcm93cyBWZXJzdGVja1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQW50cmUgZGUgQmVyZHJvd1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzU3LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEzMTY5LjksIDExOTU3LjFdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkR1c3R3aGlzcGVyIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gZGVsIE11cm11bGxvIGRlIFBvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCcnVubmVuIGRlcyBTdGF1YmZsw7xzdGVybnNcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlB1aXRzIGR1IFNvdWZmbGUtcG91c3Npw6hyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMjk2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDEwOTksXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA3NzMuMywgMTE2NTIuNV1cclxuICAgIH0sXHJcbiAgICBcIjExMDItMTE2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMTEwMi0xMTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU21hc2hlZGhvcGUgV2VsbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUG96byBUcmFnYWVzcGVyYW56YVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXIgWmVyc2NobGFnZW5lbiBIb2ZmbnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUHVpdHMgZHUgUsOqdmUtYnJpc8OpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMzgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTAyLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcxODkuMjksIDE0MjEyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMTQzLTExNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjExNDMtMTE2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxhc3RnYXNwIFdlbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBvem8gZGVsIMOabHRpbW8gU3VzcGlyb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQnJ1bm5lbiBkZXMgTGV0enRlbiBTY2huYXVmZXJzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQdWl0cyBkdSBEZXJuaWVyLXNvdXBpclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMzAxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0MzU3LjMsIDEzNTcyLjVdXHJcbiAgICB9LFxyXG4gICAgXCIxMDk5LTExN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjEwOTktMTE3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNpdGFkZWxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNpdWRhZGVsYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiWml0YWRlbGxlIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBDaXRhZGVsbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTM0MyxcclxuICAgICAgICBcInR5cGVcIjogXCJTcGF3blwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTA5OSxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDU5MC4yLCA5MTY5LjE5XVxyXG4gICAgfSxcclxuICAgIFwiMTEwMi0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTAyLTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEzMTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMTEwMixcclxuICAgICAgICBcImNvb3JkXCI6IFs3MDA2LjE5LCAxMTcyOS4yXVxyXG4gICAgfSxcclxuICAgIFwiMTE0My0xMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIxMTQzLTExN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDaXRhZGVsXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDaXVkYWRlbGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlppdGFkZWxsZSB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQ2l0YWRlbGxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEyNzksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAxMTQzLFxyXG4gICAgICAgIFwiY29vcmRcIjogWzE0MTc0LjIsIDExMDg5LjJdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZhaXRobGVhcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYXV0IGRlIGxhIEZvaVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDEwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTExXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWxkb24ncyBMZWRnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQ29ybmlzYSBkZSBBbGRvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQWxkb25zIFZvcnNwcnVuZ1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29ybmljaGUgZCdBbGRvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTQxNy4zOSwgMTQ3OTAuN11cclxuICAgIH0sXHJcbiAgICBcIjk1LTQzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNDNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSGVybydzIExvZGdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgSMOpcm9lXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJIZWxkZW5oYWxsZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGF2aWxsb24gZHUgSMOpcm9zXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNjJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMzFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0zMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBc2NlbnNpb24gQmF5XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYWjDrWEgZGUgbGEgQXNjZW5zacOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQXVmc3RpZWdzYnVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTczLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtMjlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0yOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaGUgU3Bpcml0aG9sbWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhIElzbGV0YSBFc3Bpcml0dWFsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEZXIgR2Vpc3Rob2xtXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMZSBIZWF1bWUgc3Bpcml0dWVsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3OCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIk92ZXJsb29rXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJNaXJhZG9yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJBdXNzaWNodHNwdW5rdCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQmVsdsOpZMOocmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIktlZXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA2OTguNCwgMTM3NjFdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xNVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTE1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxhbmdvciBHdWxjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJMYW5nb3ItU2NobHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE0NjUuMywgMTU1NjkuNl1cclxuICAgIH0sXHJcbiAgICBcIjM4LTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0zXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkxvd2xhbmRzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUaWVycmFzIGJhamFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUaWVmbGFuZCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gQmFzc2VzIHRlcnJlc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFs5ODQwLjI1LCAxNDk4My42XVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJNZW5kb24ncyBHYXBcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphbmphIGRlIE1lbmRvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiTWVuZG9ucyBTcGFsdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTAsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAxOTIuNywgMTM0MTAuOF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW5icmlhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiWmFyemF2ZXJkZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR3LDvG5zdHJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJWZXJ0LWJydXnDqHJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk2NCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC03XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhbmVsb24gUGFzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFzYWplIERhbmVsb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkRhbmVsb24tUGFzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGFzc2FnZSBEYW5lbG9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDgzNyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwOTk2LjQsIDE1NTQ1LjhdXHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yN1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdhcnJpc29uXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGdWVydGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkZlc3R1bmcgdm9uXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCItIEdhcm5pc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTEwM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTEwM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTYtMzBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni0zMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXb29kaGF2ZW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gRm9yZXN0YWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIldhbGQtRnJlaXN0YXR0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb2lzcmVmdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4OCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS00MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNoYWRhcmFuIEhpbGxzXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTaGFkYXJhbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIFNoYWRhcmFuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5NixcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zMlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTMyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkV0aGVyb24gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgRXRoZXJvblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRXRoZXJvbi1Iw7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmVzIGQnRXRoZXJvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NjIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk1LTU2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIFRpdGFucGF3XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBHYXJyYSBkZWwgVGl0w6FuXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEaWUgVGl0YW5lbnByYW5rZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJhcyBkdSBUaXRhblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCIzOC05XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdG9uZW1pc3QgQ2FzdGxlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYXN0aWxsbyBQaWVkcmFuaWVibGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaGxvc3MgU3RlaW5uZWJlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODMzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhc3RsZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDYyNy4zLCAxNDUwMS4zXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNTdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS01N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJDcmFndG9wXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDdW1icmVwZcOxYXNjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2Nocm9mZmdpcGZlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU29tbWV0IGRlIEhhdXRjcmFnXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC01XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTW9udMOpZSBkZSBQYW5nbG9zc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4NDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTIwMS42LCAxMzcxOC40XVxyXG4gICAgfSxcclxuICAgIFwiOTQtMzNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zM1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBPbsOtcmljYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHJhdW1idWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFpZSBkZXMgcsOqdmVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTUtNDJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWRsYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvcnJvam9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIHJvdWdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTIxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMjFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRHVyaW9zIEd1bGNoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4OCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTIwNy4xLCAxNDU5NV1cclxuICAgIH0sXHJcbiAgICBcIjk1LTU0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRm9naGF2ZW5cIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJOZWJlbC1GcmVpc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkhhdnJlIGdyaXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk1LTU1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTUtNTVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkd2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3R3YXNzZXItVGllZmxhbmRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZGUgUnViaWNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMDAzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTI2XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR3JlZW5sYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvdmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xuc2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgdmVydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiMzgtMjBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJWZWxva2EgU2xvcGVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlBlbmRpZW50ZSBWZWxva2FcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlZlbG9rYS1IYW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGbGFuYyBkZSBWZWxva2FcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExMDE3LjQsIDEzNDE0LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRyZWFkZmFsbCBCYXlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhaMOtYSBTYWx0byBBY2lhZ29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHJlY2tlbnNmYWxsLUJ1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDVcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVlYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphenVsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJCbGF1c3RyYXVjaFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQnJ1eWF6dXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTAwOSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkJhcnJhbmNvIEtsb3ZhblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiS2xvdmFuLVNlbmtlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXRpdCByYXZpbiBkZSBLbG92YW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjE5LjUsIDE1MTA3LjZdXHJcbiAgICB9LFxyXG4gICAgXCIzOC0xM1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LTEzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkplcnJpZmVyJ3MgU2xvdWdoXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDZW5hZ2FsIGRlIEplcnJpZmVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJKZXJyaWZlcnMgU3VtcGZsb2NoXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJCb3VyYmllciBkZSBKZXJyaWZlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODMsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTc1Ny4wNiwgMTU0NjcuOF1cclxuICAgIH0sXHJcbiAgICBcIjk0LTY1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk0LTM4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzhcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiTG9uZ3ZpZXdcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZWl0c2ljaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxvbmd1ZXZ1ZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC02XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDbGFybyBFc3BlbGRpYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU3BlbGRhbi1LYWhsc2NobGFnXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTczOS44MSwgMTM1ODYuOV1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzlcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVGhlIEdvZHN3b3JkXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRGFzIEdvdHRlc3NjaHdlcnRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNjRcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC02NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMzdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC0zN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlZhbGxleVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVmFsbGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRhbCB2b25cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIi0gVmFsbMOpZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4MzQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMTI2OC45LCAxNTA4Ny43XVxyXG4gICAgfSxcclxuICAgIFwiOTUtNDdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdW5ueWhpbGxcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTb25uZW5ow7xnZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNvbGxpbmUgZW5zb2xlaWxsw6llXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTY3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNjdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTQtNTNcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01M1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxldmVyZGVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkdyw7xudGFsLVp1Zmx1Y2h0XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjM4LTEyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiV2lsZGNyZWVrIFJ1blwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGlzdGEgQXJyb3lvc2FsdmFqZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV2lsZGJhY2gtU3RyZWNrZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGlzdGUgZHUgcnVpc3NlYXUgc2F1dmFnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4ODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTk1OC4yMywgMTQ2MDUuN11cclxuICAgIH0sXHJcbiAgICBcIjk2LTI1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjVcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUmVkYnJpYXJcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlphcnphcnJvamFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlJvdHN0cmF1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkJydXllcm91Z2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTkwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk0LTExMVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTExMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEZW1vbnRyYW5jZSBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIFRyYW5jZWRlbW9uw61hY29cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVudHJhbmNlLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIE1hbGV0cmFuc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTU4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlNwYXduXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtMTEyXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMTEyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiU3Bhd25cIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni03MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTcxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTUtNDZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS00NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHYXJyaXNvblwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZXN0dW5nIHZvblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiLSBHYXJuaXNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiOTQtNTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBcmFoJ3MgSG9wZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRXNwZXJhbnphIGRlIEFyYWhcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFyYWhzIEhvZmZudW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1NixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtMTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xNlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJRdWVudGluIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiUXVlbnRpbi1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBRdWVudGluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDg4OSxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJDZW50ZXJcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiAzOCxcclxuICAgICAgICBcImNvb3JkXCI6IFsxMDk1MS44LCAxNTEyMS4yXVxyXG4gICAgfSxcclxuICAgIFwiMzgtMjJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0yMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCcmF2b3N0IEVzY2FycG1lbnRcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzY2FycGFkdXJhIEJyYXZvc3RcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJyYXZvc3QtQWJoYW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGYWxhaXNlIGRlIEJyYXZvc3RcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODg2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzExNzUwLjIsIDE0ODU5LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS00OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTQ5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWV2YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkJsYXV0YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBCbGV1dmFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDEwMDUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJHcmVlbkhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NVxyXG4gICAgfSxcclxuICAgIFwiMzgtMTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCIzOC0xOVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGVyY8OpZSBkZSBHYXJkb2dyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA4OTIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTA5NjUsIDEzOTUxXVxyXG4gICAgfSxcclxuICAgIFwiOTUtNzZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NS03NlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJEYWVtb25zcGVsbCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIERhZW1vbmlhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnphdWJlci1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBkZSBNYWxkw6ltb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTk0LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJ1aW5zXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk1XHJcbiAgICB9LFxyXG4gICAgXCI5NS03M1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTczXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk0LTUxXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXN0cmFsaG9sbWVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIklzbGV0YSBBc3RyYWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFzdHJhbGhvbG1cIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkhlYXVtZSBhc3RyYWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5NC02NlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTY2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRlbW9udHJhbmNlIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gVHJhbmNlZGVtb27DrWFjb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRMOkbW9uZW50cmFuY2UtU2VlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJMYWMgTWFsZXRyYW5zZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCIzOC00XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJHb2xhbnRhIENsZWFyaW5nXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJDbGFpcmnDqHJlIGRlIEdvbGFudGFcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODQ5LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTAxOTguOSwgMTU1MjAuMl1cclxuICAgIH0sXHJcbiAgICBcIjk0LTM0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtMzRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBWZW5jZWRvclwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2llZ2VyLUhhbGxlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBWYWlucXVldXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTYzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni0yOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTI4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhd24ncyBFeXJpZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1aWxlcmEgZGVsIEFsYmFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkhvcnN0IGRlciBNb3JnZW5kw6RtbWVydW5nXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSZXBhaXJlIGRlIGwnYXViZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODcsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNTlcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni01OVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJSZWR2YWxlIFJlZnVnZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXJyb2pvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJSb3R0YWwtWnVmbHVjaHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWxyb3VnZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC0zNlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTM2XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkJsdWVsYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvYXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGJsZXVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogOTY1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiOTQtNTBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NC01MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCbHVld2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXp1bFwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQmxhdXdhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3MixcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIlJlZEhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NFxyXG4gICAgfSxcclxuICAgIFwiMzgtOFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjM4LThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQm9zcXVlcyBDbGFyb3NvbWJyYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVW1iZXJsaWNodHVuZy1Gb3JzdFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODM1LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbMTE2ODAuOSwgMTQzNTMuNl1cclxuICAgIH0sXHJcbiAgICBcIjk0LTYzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTQtNjNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGVtb250cmFuY2UgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBUcmFuY2VkZW1vbsOtYWNvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEw6Rtb25lbnRyYW5jZS1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBNYWxldHJhbnNlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk1OCxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJSZWRIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTRcclxuICAgIH0sXHJcbiAgICBcIjk2LTcwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNzBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiRGV2aWxoZWFydCBMYWtlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJMYWdvIENvcmF6b252aWxcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlRldWZlbHNoZXJ6LVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIERpYWJsZWPFk3VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk3NSxcclxuICAgICAgICBcInR5cGVcIjogXCJSdWluc1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02OVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTY5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRldmlsaGVhcnQgTGFrZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiTGFnbyBDb3Jhem9udmlsXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJUZXVmZWxzaGVyei1TZWVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkxhYyBEaWFibGVjxZN1clwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQmx1ZUhvbWVcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NlxyXG4gICAgfSxcclxuICAgIFwiOTYtNjBcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5Ni02MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJTdGFyZ3JvdmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZXJuaGFpblwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQm9zcXVldCDDqXRvaWzDqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5ODYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ2FtcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NC00MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk0LTQwXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkNsaWZmc2lkZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRGVzcGXDsWFkZXJvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJGZWxzd2FuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiRmxhbmMgZGUgZmFsYWlzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiVG93ZXJcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiUmVkSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk0XHJcbiAgICB9LFxyXG4gICAgXCI5Ni02MVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2LTYxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkdyZWVud2F0ZXIgTG93bGFuZHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlRpZXJyYXMgYmFqYXMgZGUgQWd1YXZlcmRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHcsO8bndhc3Nlci1UaWVmbGFuZFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4MyxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2LTIzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjNcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFza2FsaW9uLUjDvGdlbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sbGluZXMgZCdBc2thbGlvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5NzksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJCbHVlSG9tZVwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2XHJcbiAgICB9LFxyXG4gICAgXCI5NS03NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTc0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjM4LTEwXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMTBcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkNhbnRlcmEgZGVsIFDDrWNhcm9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlNjaHVya2VuYnJ1Y2hcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkNhcnJpw6hyZSBkdSB2b2xldXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODUxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkNhbXBcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiQ2VudGVyXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogMzgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbOTYxMi41NCwgMTQ0NjIuOF1cclxuICAgIH0sXHJcbiAgICBcIjk2LTI0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtMjRcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lc25lXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJQYXRyaW1vbmlvIGRlbCBDYW1wZcOzblwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQ2hhbXBpb25zIExhbmRzaXR6XCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJGaWVmIGR1IENoYW1waW9uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk4NCxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjM4LTE4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiMzgtMThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGFzbyBBbnphbGlhc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiQW56YWxpYXMtUGFzc1wiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogODkzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkNlbnRlclwiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDM4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzEwMjQzLjMsIDEzOTc0LjRdXHJcbiAgICB9LFxyXG4gICAgXCI5NS03MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk1LTcyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkRhZW1vbnNwZWxsIExha2VcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkxhZ28gRGFlbW9uaWFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDpG1vbmVuemF1YmVyLVNlZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiTGFjIGRlIE1hbGTDqW1vblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiA5OTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUnVpbnNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiR3JlZW5Ib21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTVcclxuICAgIH0sXHJcbiAgICBcIjk2LTU4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTYtNThcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiR29kc2xvcmVcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlNhYmlkdXLDrWEgZGUgbG9zIERpb3Nlc1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiR290dGVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU2F2b2lyIGRpdmluXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDk5MSxcclxuICAgICAgICBcInR5cGVcIjogXCJDYW1wXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkJsdWVIb21lXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTZcclxuICAgIH0sXHJcbiAgICBcIjk2OC05OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXdXJtIFR1bm5lbFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVMO6bmVsIGRlIGxhIFNpZXJwZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiV3VybXR1bm5lbFwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiVHVubmVsIGRlIGd1aXZyZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTU2LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNjc1MC45MiwgMTAyMTEuMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLzA4NzQ5MUNERDU2RjdGQjk5OEMzMzIzNjBEMzJGRDI2QThCMkE5OUQvNzMwNDI4LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTZcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTZcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQWlycG9ydFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWVyb3B1ZXJ0b1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRmx1Z2hhZmVuXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBw6lyb3BvcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1MyxcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzcwNTQuMTYsIDEwNDIxXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQUNDQ0IxQkQ2MTc1OThDMEVBOUM3NTZFQURFNTNERjM2QzI1NzhFQy83MzA0MjcucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MlwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJUaHVuZGVyIEhvbGxvdyBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEhvbmRvbmFkYSBkZWwgVHJ1ZW5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJEb25uZXJzZW5rZW5yZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgVG9ubmVjcmV2YXNzZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTY4LFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzgyODIuNzcsIDEwNDI1LjldLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTkzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTkzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkZvcmdlXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJGb3JqYVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiU2NobWllZGVcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcmdlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4MjIzLjY0LCAxMDY5Mi4yXSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDFBQjU0MUZDM0JFMTJBQzVCQkIwMjAyMTJCRUJFM0Y1QzBDNDMxNS83MzA0MTUucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVyZ3Jvd24gRmFuZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEZhbm8gR2lnYW50ZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiw5xiZXJ3dWNoZXJ0ZXIgR290dGVzaGF1cy1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgVGVtcGxlIHN1cmRpbWVuc2lvbm7DqVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYyLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1MTMuODMsIDkwNTkuOTZdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTk0XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTk0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlNocmluZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiU2FudHVhcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTY2hyZWluXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJTYW5jdHVhaXJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjQsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs4NjE0Ljg5LCAxMDI0Ni40XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvQjU3MDk5NDFCMDM1MkZENENBM0I3QUZEQTQyODczRDhFRkRCMTVBRC83MzA0MTQucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05MFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05MFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJBbHRhclwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWx0YXJcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkFsdGFyXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJBdXRlbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYwLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzI0MC42NiwgOTI1My45XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvREMwMUVDNDFEODgwOUI1OUI4NUJFRURDNDVFOTU1NkQ3MzBCRDIxQS83MzA0MTMucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05N1wiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05N1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJXb3Jrc2hvcFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiVGFsbGVyXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJXZXJrc3RhdHRcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkF0ZWxpZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1MixcclxuICAgICAgICBcInR5cGVcIjogXCJHZW5lcmljXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY4MzcuNiwgMTA4NDUuMV0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0IzNEMyRTNEMEYzNEZEMDNGNDRCQjVFRDRFMThEQ0REMDA1OUE1QzQvNzMwNDI5LnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtODFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtODFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiQXJpZCBGb3J0cmVzcyBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEZvcnRhbGV6YSDDgXJpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDvHJyZWZlc3R1bmdyZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZGUgbGEgRm9ydGVyZXNzZSBhcmlkZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTYzLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlJlc291cmNlXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY4MjMuODMsIDEwNDc5LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9FODlBQUQyOERBNDNENTQ1RDdFMzY4MTQ5OTA0OUNCNzNDMEUyRkVFLzEwMjY1MC5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTgzXCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTgzXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lZ2F6ZSBTcGlyZSBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIEFndWphIGRlIE1pcmFwaWVkcmFzXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJTdGVpbmJsaWNrLVphY2tlbnN0YWJyZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgUGljIGRlIFBpZXJyZWdhcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2NyxcclxuICAgICAgICBcInR5cGVcIjogXCJSZXNvdXJjZVwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MjQ5LjIxLCA5NzYzLjg3XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRTg5QUFEMjhEQTQzRDU0NUQ3RTM2ODE0OTkwNDlDQjczQzBFMkZFRS8xMDI2NTAucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC05NVwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC05NVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJCZWxsIFRvd2VyXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJDYW1wYW5hcmlvXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJHbG9ja2VudHVybVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiQ2xvY2hlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTczLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIkdlbmVyaWNcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbODE4MC42OCwgMTAzMjUuMl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0Q0MTgwNzc0REQwM0E0QkM3MjUyQjk1MjY4MEU0NTFGMTY2NzlBNzIvNzMwNDEwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTFcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTFcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiT2JzZXJ2YXRvcnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIk9ic2VydmF0b3Jpb1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiT2JzZXJ2YXRvcml1bVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiT2JzZXJ2YXRvaXJlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTgsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3OTUzLjY3LCA5MDYyLjc5XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvMDE1Q0YxNkM3OERGREFENzQyRTFBNTYxM0ZCNzRCNjQ2M0JGNEE3MC83MzA0MTEucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC03OFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC03OFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJPdmVyZ3Jvd24gRmFuZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiRmFubyBHaWdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCLDnGJlcnd1Y2hlcnRlcyBHb3R0ZXNoYXVzXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJUZW1wbGUgc3VyZGltZW5zaW9ubsOpXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjEsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiS2VlcFwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NjA2LjcsIDg4ODIuMTRdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg4XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg4XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIkFyaWQgRm9ydHJlc3NcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkZvcnRhbGV6YSDDgXJpZGFcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIkTDvHJyZWZlc3R1bmdcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkZvcnRlcmVzc2UgYXJpZGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE1NyxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzY0NDIuMTcsIDEwODgxLjhdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlR5dG9uZSBQZXJjaFwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiUGVyY2hhIGRlIFR5dG9uZVwiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiVHl0b25lbndhcnRlXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJQZXJjaG9pciBkZSBUeXRvbmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MixcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3ODg0LjgxLCA5ODA5LjJdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTc5XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTc5XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlRodW5kZXIgSG9sbG93XCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJIb25kb25hZGEgZGVsIFRydWVub1wiLFxyXG4gICAgICAgICAgICBcImRlXCI6IFwiRG9ubmVyc2Vua2VcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIlRvbm5lY3JldmFzc2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE2OSxcclxuICAgICAgICBcInR5cGVcIjogXCJLZWVwXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzg1MDYuNzUsIDEwODI0LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS85NjE1RDk3NUIxNkMyQ0Y0NkFGNkIyMEUyNTQxQ0VEOTkzRUZBMUVFLzczMDQwOS5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg1XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlR5dG9uZSBQZXJjaCBSZWFjdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZXNcIjogXCJSZWFjdG9yIGRlIFBlcmNoYSBkZSBUeXRvbmVcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlR5dG9uZW53YXJ0ZS1SZWFrdG9yXCIsXHJcbiAgICAgICAgICAgIFwiZnJcIjogXCJSw6lhY3RldXIgZHUgUGVyY2hvaXIgZGUgVHl0b25lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjUsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzg1Mi44OSwgOTg1NS41Nl0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtNzdcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtNzdcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiSW5mZXJubydzIE5lZWRsZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1amEgZGVsIEluZmllcm5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJJbmZlcm5vbmFkZWxcIixcclxuICAgICAgICAgICAgXCJmclwiOiBcIkFpZ3VpbGxlIGluZmVybmFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNlY3Rvcl9pZFwiOiAxMTcxLFxyXG4gICAgICAgIFwidHlwZVwiOiBcIlRvd2VyXCIsXHJcbiAgICAgICAgXCJtYXBfdHlwZVwiOiBcIkVkZ2VPZlRoZU1pc3RzXCIsXHJcbiAgICAgICAgXCJtYXBfaWRcIjogOTY4LFxyXG4gICAgICAgIFwiY29vcmRcIjogWzc1MDQuODQsIDEwNTk4LjVdLFxyXG4gICAgICAgIFwibWFya2VyXCI6IFwiaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS9ENzNEQkU2RDkwMTQwREMxMjdGMURGQkQ5MEFDQjc3RUU4NzAxMzcwLzczMDQxNi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwiOTY4LTg3XCI6IHtcclxuICAgICAgICBcImlkXCI6IFwiOTY4LTg3XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgXCJlblwiOiBcIlN0b25lZ2F6ZSBTcGlyZVwiLFxyXG4gICAgICAgICAgICBcImVzXCI6IFwiQWd1amEgZGUgTWlyYXBpZWRyYXNcIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0ZWluYmxpY2stWmFja2Vuc3RhYlwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUGljIGRlIFBpZXJyZWdhcmRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZWN0b3JfaWRcIjogMTE3MCxcclxuICAgICAgICBcInR5cGVcIjogXCJUb3dlclwiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3MTY0LjQ2LCA5ODA1LjE1XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvRDczREJFNkQ5MDE0MERDMTI3RjFERkJEOTBBQ0I3N0VFODcwMTM3MC83MzA0MTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcIjk2OC04NFwiOiB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjk2OC04NFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiB7XHJcbiAgICAgICAgICAgIFwiZW5cIjogXCJJbmZlcm5vJ3MgTmVlZGxlIFJlYWN0b3JcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIlJlYWN0b3IgZGUgQWd1amEgZGVsIEluZmllcm5vXCIsXHJcbiAgICAgICAgICAgIFwiZGVcIjogXCJJbmZlcm5vbmFkZWwtUmVha3RvclwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiUsOpYWN0ZXVyIGRlIGwnQWlndWlsbGUgaW5mZXJuYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNjYsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiUmVzb3VyY2VcIixcclxuICAgICAgICBcIm1hcF90eXBlXCI6IFwiRWRnZU9mVGhlTWlzdHNcIixcclxuICAgICAgICBcIm1hcF9pZFwiOiA5NjgsXHJcbiAgICAgICAgXCJjb29yZFwiOiBbNzU4MS45MSwgMTAzMTYuNF0sXHJcbiAgICAgICAgXCJtYXJrZXJcIjogXCJodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL0U4OUFBRDI4REE0M0Q1NDVEN0UzNjgxNDk5MDQ5Q0I3M0MwRTJGRUUvMTAyNjUwLnBuZ1wiXHJcbiAgICB9LFxyXG4gICAgXCI5NjgtOTJcIjoge1xyXG4gICAgICAgIFwiaWRcIjogXCI5NjgtOTJcIixcclxuICAgICAgICBcIm5hbWVcIjoge1xyXG4gICAgICAgICAgICBcImVuXCI6IFwiU3RhdHVhcnlcIixcclxuICAgICAgICAgICAgXCJlc1wiOiBcIkVzdGF0dWFyaW9cIixcclxuICAgICAgICAgICAgXCJkZVwiOiBcIlN0YXR1ZVwiLFxyXG4gICAgICAgICAgICBcImZyXCI6IFwiU3RhdHVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2VjdG9yX2lkXCI6IDExNTksXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiR2VuZXJpY1wiLFxyXG4gICAgICAgIFwibWFwX3R5cGVcIjogXCJFZGdlT2ZUaGVNaXN0c1wiLFxyXG4gICAgICAgIFwibWFwX2lkXCI6IDk2OCxcclxuICAgICAgICBcImNvb3JkXCI6IFs3NTUzLjEyLCA5MzYwLjE2XSxcclxuICAgICAgICBcIm1hcmtlclwiOiBcImh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvNEMwMTEzQjZERjJFNEUyQ0JCOTMyNDRBRDUwREE0OTQ1NkQ1MDE0RS83MzA0MTIucG5nXCJcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbWJvc3NmZWxzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFtYm9zc2ZlbHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbnZpbCBSb2NrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFudmlsLXJvY2tcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBZdW5xdWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwteXVucXVlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGVyIGRlIGwnZW5jbHVtZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZXItZGUtbGVuY2x1bWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkpha2JpZWd1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFrYmllZ3VuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIllhaydzIEJlbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwieWFrcy1iZW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVjbGl2ZSBkZWwgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlY2xpdmUtZGVsLXlha1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvdXJiZSBkdSBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY291cmJlLWR1LXlha1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlbnJhdmlzIEVyZHdlcmtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVucmF2aXMtZXJkd2Vya1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlbmdlIG9mIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVuZ2Utb2YtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDrXJjdWxvIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2lyY3Vsby1kZS1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvbWxlY2ggZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9tbGVjaC1kZS1kZW5yYXZpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSG9jaG9mZW4gZGVyIEJldHLDvGJuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaG9jaG9mZW4tZGVyLWJldHJ1Ym5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNvcnJvdydzIEZ1cm5hY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic29ycm93cy1mdXJuYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhZ3VhIGRlbCBQZXNhclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmcmFndWEtZGVsLXBlc2FyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm91cm5haXNlIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm91cm5haXNlLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUb3IgZGVzIElycnNpbm5zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRvci1kZXMtaXJyc2lubnNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYXRlIG9mIE1hZG5lc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2F0ZS1vZi1tYWRuZXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhIGRlIGxhIExvY3VyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGEtZGUtbGEtbG9jdXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGUgZGUgbGEgZm9saWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGUtZGUtbGEtZm9saWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgRXNwZW53YWxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtZXNwZW53YWxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFRyZW1ibGVmb3LDqnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC10cmVtYmxlZm9yZXRcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeS1CdWNodFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1idWNodFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5IEJheVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1iYXlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtZWhtcnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGQnRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZWhtcnlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaW5zdGVyZnJlaXN0YXR0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpbnN0ZXJmcmVpc3RhdHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEYXJraGF2ZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGFya2hhdmVuXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBPc2N1cm9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1vc2N1cm9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2Ugbm9pclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2Utbm9pclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlaWxpZ2UgSGFsbGUgdm9uIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVpbGlnZS1oYWxsZS12b24tcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dW0gb2YgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVtLW9mLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYWdyYXJpbyBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhZ3JhcmlvLWRlLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVhaXJlIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1YWlyZS1kZS1yYWxsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFudGhpci1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYW50aGlyLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsZSBvZiBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGUtb2YtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWRlLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtamFudGhpclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lZXIgZGVzIExlaWRzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lZXItZGVzLWxlaWRzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhIG9mIFNvcnJvd3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhLW9mLXNvcnJvd3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbCBNYXIgZGUgbG9zIFBlc2FyZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWwtbWFyLWRlLWxvcy1wZXNhcmVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTsO2cmRsaWNoZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9yZGxpY2hlLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vcnRoZXJuIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcnRoZXJuLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGljb3Nlc2NhbG9mcmlhbnRlcyBkZWwgTm9ydGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGljb3Nlc2NhbG9mcmlhbnRlcy1kZWwtbm9ydGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDaW1lZnJvaWRlcyBub3JkaXF1ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2ltZWZyb2lkZXMtbm9yZGlxdWVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyenRvclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6dG9yXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2tnYXRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrZ2F0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YW5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGVub2lyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZW5vaXJlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhY2hlbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWNoZW5icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWdvbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWdvbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyY2EgZGVsIERyYWfDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyY2EtZGVsLWRyYWdvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0aWdtYXRlIGR1IGRyYWdvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdGlnbWF0ZS1kdS1kcmFnb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbi1UZXJyYXNzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFzc2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24gVGVycmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJhemEgZGUgRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRlcnJhemEtZGUtZXJlZG9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhdGVhdSBkJ0VyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF0ZWF1LWRlcmVkb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLbGFnZW5yaXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtsYWdlbnJpc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIG9mIFdvZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLW9mLXdvZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3VyYSBkZSBsYSBBZmxpY2Npw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3VyYS1kZS1sYS1hZmxpY2Npb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIGR1IG1hbGhldXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1kdS1tYWxoZXVyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6Zmx1dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6Zmx1dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrdGlkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja3RpZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJlYSBOZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJlYS1uZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vaXJmbG90XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vaXJmbG90XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW50ZXJ3ZWx0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVudGVyd2VsdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVuZGVyd29ybGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW5kZXJ3b3JsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkluZnJhbXVuZG9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaW5mcmFtdW5kb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk91dHJlLW1vbmRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm91dHJlLW1vbmRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVybmUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcm5lLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZhciBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmYXItc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMZWphbmFzIFBpY29zZXNjYWxvZnJpYW50ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGVqYW5hcy1waWNvc2VzY2Fsb2ZyaWFudGVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTG9pbnRhaW5lcyBDaW1lZnJvaWRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsb2ludGFpbmVzLWNpbWVmcm9pZGVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lbiB2b24gU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lbi12b24tc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbnMgb2YgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5zLW9mLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5hcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmFzLWRlLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVzLWRlLXN1cm1pYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlZW1hbm5zcmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWVtYW5uc3Jhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWFmYXJlcidzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhZmFyZXJzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIGRlbCBWaWFqYW50ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLWRlbC12aWFqYW50ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGR1IE1hcmluXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWR1LW1hcmluXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbi1QbGF0elwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1wbGF0elwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuIFNxdWFyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1zcXVhcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS1waWtlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLXBpa2VuXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGljaHR1bmcgZGVyIE1vcmdlbnLDtnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxpY2h0dW5nLWRlci1tb3JnZW5yb3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVyb3JhIEdsYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1cm9yYS1nbGFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYXJvIGRlIGxhIEF1cm9yYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFyby1kZS1sYS1hdXJvcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFpcmnDqHJlIGRlIGwnYXVyb3JlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYWlyaWVyZS1kZS1sYXVyb3JlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlbWVlciBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGVtZWVyLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBTZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXNlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyLWRlLWphZGUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZS1qYWRlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haC1QbGF0eiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtcGxhdHotZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoIFNxdWFyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtc3F1YXJlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtZGUtdml6dW5haC1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhdWJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGF1YmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBcmJvcnN0b25lIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXJib3JzdG9uZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZWRyYSBBcmLDs3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZWRyYS1hcmJvcmVhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllcnJlIEFyYm9yZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVycmUtYXJib3JlYS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmx1c3N1ZmVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmx1c3N1ZmVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUml2ZXJzaWRlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicml2ZXJzaWRlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmliZXJhIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmliZXJhLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHJvdmluY2VzIGZsdXZpYWxlcyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInByb3ZpbmNlcy1mbHV2aWFsZXMtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYWZlbHMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYWZlbHMtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYSBSZWFjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hLXJlYWNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2HDscOzbiBkZSBFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbm9uLWRlLWVsb25hLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmllZiBkJ0Vsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmllZi1kZWxvbmEtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXItU2VlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1zZWUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyIExha2UgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLWxha2UtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWdvIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWdvLWRyYWtrYXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWMgRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhYy1kcmFra2FyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyc3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnN1bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXIncyBTb3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnMtc291bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFc3RyZWNobyBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlc3RyZWNoby1kZS1taWxsZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6l0cm9pdCBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXRyb2l0LWRlLW1pbGxlci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2gtQnVjaHQgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYnVjaHQtc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2ggQmF5IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJheS1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBCYXJ1Y2ggW0VTXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1iYXJ1Y2gtZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGRlIEJhcnVjaCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGUtYmFydWNoLXNwXCJcclxuXHRcdH1cclxuXHR9LFxyXG59O1xyXG4iXX0=
