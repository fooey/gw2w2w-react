(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

require('babel/polyfill');

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var page = (typeof window !== "undefined" ? window.page : typeof global !== "undefined" ? global.page : null);

var STATIC = require('./lib/static');

/*
* React Components
*/

var Langs = require('./common/Langs');
var Overview = require('./Overview');
var Tracker = require('./Tracker');

/*
*
* DOM Ready
*
*/

$(function () {
    attachRoutes();
    setImmediate(eml);
});

/*
*
* Routes
*
*/

function attachRoutes() {

    // Redirect '/' to '/en'
    page('/', redirectPage.bind(null, '/en'));

    page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', function (ctx) {
        React.render(React.createElement(App, ctx.params), document.getElementById('react-app'));
    });

    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true });
}

var _ref = React.createElement(
    'div',
    { className: 'navbar-header' },
    React.createElement(
        'a',
        { className: 'navbar-brand', href: '/' },
        React.createElement('img', { src: '/img/logo/logo-96x36.png' })
    )
);

/*
*
* App Container
*
*/

var App = (function (_React$Component) {
    function App() {
        _classCallCheck(this, App);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(App, _React$Component);

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('App Started!');
        }
    }, {
        key: 'render',
        value: function render() {
            var langSlug = this.props.langSlug;
            var worldSlug = this.props.worldSlug;

            var lang = STATIC.langs.get(langSlug);
            var world = getWorldFromSlug(langSlug, worldSlug);

            var hasWorld = world && Immutable.Map.isMap(world) && !world.isEmpty();

            var Handler = hasWorld ? Tracker : Overview;

            // console.log('Langs::render()', this.props.lang.toJS());

            var navbarHeader = _ref;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'nav',
                    { className: 'navbar navbar-default' },
                    React.createElement(
                        'div',
                        { className: 'container' },
                        navbarHeader,
                        React.createElement(
                            'div',
                            { id: 'nav-langs', className: 'pull-right' },
                            React.createElement(Langs, { lang: lang, world: world })
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'content', className: 'container' },
                    React.createElement(Handler, { lang: lang, world: world })
                )
            );
        }
    }]);

    return App;
})(React.Component);

/*
*
* Util
*
*/

function redirectPage(destination) {
    page.redirect(destination);
}

function getWorldFromSlug(langSlug, worldSlug) {
    return STATIC.worlds.find(function (world) {
        return world.getIn([langSlug, 'slug']) === worldSlug;
    });
}

function eml() {
    var chunks = ['gw2w2w', 'schtuph', 'com', '@', '.'];
    var addr = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join('');

    $('.nospam-prz').each(function (i, el) {
        $(el).replaceWith($('<a>', { href: 'mailto:' + addr, text: addr }));
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Overview":113,"./Tracker":138,"./common/Langs":144,"./lib/static":150,"babel/polyfill":91}],2:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":88,"regenerator/runtime":89}],3:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var $ = require('./$');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = $.toObject($this)
      , length = $.toLength(O.length)
      , index  = $.toIndex(fromIndex, length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$":23}],4:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var $   = require('./$')
  , ctx = require('./$.ctx');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = Object($.assertDefined($this))
      , self   = $.ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = $.toLength(self.length)
      , index  = 0
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$":23,"./$.ctx":12}],5:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":23}],6:[function(require,module,exports){
var $        = require('./$')
  , enumKeys = require('./$.enum-keys');
// 19.1.2.1 Object.assign(target, source, ...)
/* eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/* eslint-enable no-unused-vars */
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":23,"./$.enum-keys":15}],7:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
};
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
};
module.exports = cof;
},{"./$":23,"./$.wks":39}],8:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , has      = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isFrozen = Object.isFrozen || $.core.Object.isFrozen
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
  // can't set id to frozen object
  if(isFrozen(it))return 'F';
  if(!has(it, ID)){
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
}

function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index != 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(NAME, IS_MAP, ADDER){
    function C(){
      var that     = assert.inst(this, C, NAME)
        , iterable = arguments[0];
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    }
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that[FIRST] = that[LAST] = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that[O1][entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that[FIRST] == entry)that[FIRST] = next;
          if(that[LAST] == entry)that[LAST] = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this[FIRST]){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if($.DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return assert.def(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index != 'F')that[O1][index] = entry;
    } return that;
  },
  getEntry: getEntry,
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  setIter: function(C, NAME, IS_MAP){
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
  }
};
},{"./$":23,"./$.assert":5,"./$.ctx":12,"./$.for-of":16,"./$.iter":22,"./$.iter-define":20,"./$.mix":25,"./$.uid":37}],9:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def')
  , forOf = require('./$.for-of');
module.exports = function(NAME){
  $def($def.P, NAME, {
    toJSON: function toJSON(){
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    }
  });
};
},{"./$.def":13,"./$.for-of":16}],10:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.for-of')
  , _has      = $.has
  , isObject  = $.isObject
  , hide      = $.hide
  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
  , id        = 0
  , ID        = safe('id')
  , WEAK      = safe('weak')
  , LEAK      = safe('leak')
  , method    = require('./$.array-methods')
  , find      = method(5)
  , findIndex = method(6);
function findFrozen(store, key){
  return find(store.array, function(it){
    return it[0] === key;
  });
}
// fallback for frozen keys
function leakStore(that){
  return that[LEAK] || hide(that, LEAK, {
    array: [],
    get: function(key){
      var entry = findFrozen(this, key);
      if(entry)return entry[1];
    },
    has: function(key){
      return !!findFrozen(this, key);
    },
    set: function(key, value){
      var entry = findFrozen(this, key);
      if(entry)entry[1] = value;
      else this.array.push([key, value]);
    },
    'delete': function(key){
      var index = findIndex(this.array, function(it){
        return it[0] === key;
      });
      if(~index)this.array.splice(index, 1);
      return !!~index;
    }
  })[LEAK];
}

module.exports = {
  getConstructor: function(NAME, IS_MAP, ADDER){
    function C(){
      $.set(assert.inst(this, C, NAME), ID, id++);
      var iterable = arguments[0];
      if(iterable != undefined)forOf(iterable, IS_MAP, this[ADDER], this);
    }
    require('./$.mix')(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(isFrozen(key))return leakStore(this)['delete'](key);
        return _has(key, WEAK) && _has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(isFrozen(key))return leakStore(this).has(key);
        return _has(key, WEAK) && _has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(isFrozen(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      _has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":23,"./$.array-methods":4,"./$.assert":5,"./$.for-of":16,"./$.mix":25,"./$.uid":37}],11:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , BUGGY = require('./$.iter').BUGGY
  , forOf = require('./$.for-of')
  , species = require('./$.species')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  function fixMethod(KEY, CHAIN){
    if($.FW){
      var method = proto[KEY];
      require('./$.redef')(proto, KEY, function(a, b){
        var result = method.call(this, a === 0 ? 0 : a, b);
        return CHAIN ? this : result;
      });
    }
  }
  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = function(){
        assertInstance(this, C, NAME);
        var that     = new Base
          , iterable = arguments[0];
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      };
      C.prototype = proto;
      if($.FW)proto.constructor = C;
    }
    IS_WEAK || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixMethod(ADDER, true);
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);
  species(C);
  species($.core[NAME]); // for wrapper

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.for-of":16,"./$.iter":22,"./$.iter-detect":21,"./$.mix":25,"./$.redef":28,"./$.species":31}],12:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.assert":5}],13:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction
  , $redef     = require('./$.redef');
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)$.hide(exports, key, exp);
    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$":23,"./$.redef":28}],14:[function(require,module,exports){
var $        = require('./$')
  , document = $.g.document
  , isObject = $.isObject
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$":23}],15:[function(require,module,exports){
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getDesc    = $.getDesc
    , getSymbols = $.getSymbols;
  if(getSymbols)$.each.call(getSymbols(it), function(key){
    if(getDesc(it, key).enumerable)keys.push(key);
  });
  return keys;
};
},{"./$":23}],16:[function(require,module,exports){
var ctx  = require('./$.ctx')
  , get  = require('./$.iter').get
  , call = require('./$.iter-call');
module.exports = function(iterable, entries, fn, that){
  var iterator = get(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done){
    if(call(iterator, f, step.value, entries) === false){
      return call.close(iterator);
    }
  }
};
},{"./$.ctx":12,"./$.iter":22,"./$.iter-call":19}],17:[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],18:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],19:[function(require,module,exports){
var assertObject = require('./$.assert').obj;
function close(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function call(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    close(iterator);
    throw e;
  }
}
call.close = close;
module.exports = call;
},{"./$.assert":5}],20:[function(require,module,exports){
var $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , $               = require('./$')
  , cof             = require('./$.cof')
  , $iter           = require('./$.iter')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values'
  , Iterators       = $iter.Iterators;
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iter.create(Constructor, NAME, next);
  function createMethod(kind){
    function $$(that){
      return new Constructor(that, kind);
    }
    switch(kind){
      case KEYS: return function keys(){ return $$(this); };
      case VALUES: return function values(){ return $$(this); };
    } return function entries(){ return $$(this); };
  }
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = $.getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    cof.set(IteratorPrototype, TAG, true);
    // FF fix
    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
  }
  // Define iterator
  if($.FW)$iter.set(proto, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = $.that;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.iter":22,"./$.redef":28,"./$.wks":39}],21:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":39}],22:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , assertObject      = require('./$.assert').obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = {}
  , IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}

module.exports = {
  // Safari has buggy iterators w/o `next`
  BUGGY: 'keys' in [] && !('next' in [].keys()),
  Iterators: Iterators,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
  },
  get: function(it){
    var Symbol  = $.g.Symbol
      , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
      , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.wks":39}],23:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  it: function(it){
    return it;
  },
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":17}],24:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":23}],25:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":28}],26:[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function ownKeys(it){
  assertObject(it);
  var keys       = $.getNames(it)
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":23,"./$.assert":5}],27:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , invoke = require('./$.invoke')
  , assertFunction = require('./$.assert').fn;
module.exports = function(/* ...pargs */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = $.path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(_length > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$":23,"./$.assert":5,"./$.invoke":18}],28:[function(require,module,exports){
var $   = require('./$')
  , tpl = String({}.hasOwnProperty)
  , SRC = require('./$.uid').safe('src')
  , _toString = Function.toString;

function $redef(O, key, val, safe){
  if($.isFunction(val)){
    var base = O[key];
    $.hide(val, SRC, base ? String(base) : tpl.replace(/hasOwnProperty/, String(key)));
  }
  if(O === $.g){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    $.hide(O, key, val);
  }
}

// add fake Function#toString for correct work wrapped methods / constructors
// with methods similar to LoDash isNative
$redef(Function.prototype, 'toString', function toString(){
  return $.has(this, SRC) ? this[SRC] : _toString.call(this);
});

$.core.inspectSource = function(it){
  return _toString.call(it);
};

module.exports = $redef;
},{"./$":23,"./$.uid":37}],29:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],30:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
function check(O, proto){
  assert.obj(O);
  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
}
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":23,"./$.assert":5,"./$.ctx":12}],31:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":23,"./$.wks":39}],32:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String($.assertDefined(that))
      , i = $.toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$":23}],33:[function(require,module,exports){
// http://wiki.ecmascript.org/doku.php?id=strawman:string_padding
var $      = require('./$')
  , repeat = require('./$.string-repeat');

module.exports = function(that, minLength, fillChar, left){
  // 1. Let O be CheckObjectCoercible(this value).
  // 2. Let S be ToString(O).
  var S = String($.assertDefined(that));
  // 4. If intMinLength is undefined, return S.
  if(minLength === undefined)return S;
  // 4. Let intMinLength be ToInteger(minLength).
  var intMinLength = $.toInteger(minLength);
  // 5. Let fillLen be the number of characters in S minus intMinLength.
  var fillLen = intMinLength - S.length;
  // 6. If fillLen < 0, then throw a RangeError exception.
  // 7. If fillLen is +∞, then throw a RangeError exception.
  if(fillLen < 0 || fillLen === Infinity){
    throw new RangeError('Cannot satisfy string length ' + minLength + ' for string: ' + S);
  }
  // 8. Let sFillStr be the string represented by fillStr.
  // 9. If sFillStr is undefined, let sFillStr be a space character.
  var sFillStr = fillChar === undefined ? ' ' : String(fillChar);
  // 10. Let sFillVal be a String made of sFillStr, repeated until fillLen is met.
  var sFillVal = repeat.call(sFillStr, Math.ceil(fillLen / sFillStr.length));
  // truncate if we overflowed
  if(sFillVal.length > fillLen)sFillVal = left
    ? sFillVal.slice(sFillVal.length - fillLen)
    : sFillVal.slice(0, fillLen);
  // 11. Return a string made from sFillVal, followed by S.
  // 11. Return a String made from S, followed by sFillVal.
  return left ? sFillVal.concat(S) : S.concat(sFillVal);
};
},{"./$":23,"./$.string-repeat":34}],34:[function(require,module,exports){
'use strict';
var $ = require('./$');

module.exports = function repeat(count){
  var str = String($.assertDefined(this))
    , res = ''
    , n   = $.toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$":23}],35:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , cel    = require('./$.dom-create')
  , global             = $.g
  , isFunction         = $.isFunction
  , html               = $.html
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , postMessage        = global.postMessage
  , addEventListener   = global.addEventListener
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
function run(){
  var id = +this;
  if($.has(queue, id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
}
function listner(event){
  run.call(event.data);
}
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!isFunction(setTask) || !isFunction(clearTask)){
  setTask = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(cof(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
    defer = function(id){
      postMessage(id, '*');
    };
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$":23,"./$.cof":7,"./$.ctx":12,"./$.dom-create":14,"./$.invoke":18}],36:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],37:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":23}],38:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":23,"./$.wks":39}],39:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":23,"./$.uid":37}],40:[function(require,module,exports){
var $                = require('./$')
  , cel              = require('./$.dom-create')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid').safe('__proto__')
  , assert           = require('./$.assert')
  , assertObject     = assert.obj
  , ObjectProto      = Object.prototype
  , html             = $.html
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , classof          = cof.classof
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , isFunction       = $.isFunction
  , toObject         = $.toObject
  , toLength         = $.toLength
  , toIndex          = $.toIndex
  , IE8_DOM_DEFINE   = false
  , $indexOf         = require('./$.array-includes')(false)
  , $forEach         = arrayMethod(0)
  , $map             = arrayMethod(1)
  , $filter          = arrayMethod(2)
  , $some            = arrayMethod(3)
  , $every           = arrayMethod(4);

if(!$.DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x',
      {get: function(){ return 8; }}
    ).x == 8;
  } catch(e){ /* empty */ }
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    assertObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !$.DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length){
  return function(object){
    var O      = toObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
}
function isPrimitive(it){ return !$.isObject(it); }
function Empty(){}
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = Object(assert.def(O));
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(isFunction(O.constructor) && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = assertObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
  seal: $.it, // <- cap
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: $.it, // <- cap
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: $.it, // <- cap
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: isPrimitive, // <- cap
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: isPrimitive, // <- cap
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: $.isObject // <- cap
});

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = assert.fn(this)
      , partArgs = _slice.call(arguments, 1);
    function bound(/* args... */){
      var args = partArgs.concat(_slice.call(arguments));
      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
    }
    if(fn.prototype)bound.prototype = fn.prototype;
    return bound;
  }
});

// Fix for not array-like ES3 string and DOM objects
if(!(0 in Object('z') && 'z'[0] == 'z')){
  $.ES5Object = function(it){
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}

var buggySlice = true;
try {
  if(html)_slice.call(html);
  buggySlice = false;
} catch(e){ /* empty */ }

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  join: function join(){
    return _join.apply($.ES5Object(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {
  isArray: function(arg){
    return cof(arg) == 'Array';
  }
});
function createArrayReduce(isRight){
  return function(callbackfn, memo){
    assert.fn(callbackfn);
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
}
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || function forEach(callbackfn/*, that = undefined */){
    return $forEach(this, callbackfn, arguments[1]);
  },
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn/*, that = undefined */){
    return $map(this, callbackfn, arguments[1]);
  },
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn/*, that = undefined */){
    return $filter(this, callbackfn, arguments[1]);
  },
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn/*, that = undefined */){
    return $some(this, callbackfn, arguments[1]);
  },
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn/*, that = undefined */){
    return $every(this, callbackfn, arguments[1]);
  },
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(el /*, fromIndex = 0 */){
    return $indexOf(this, el, arguments[1]);
  },
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
$def($def.P, 'String', {trim: require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1')});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){
  return +new Date;
}});

function lz(num){
  return num > 9 ? num : '0' + num;
}

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && require('./$.throws')(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {toISOString: function(){
  if(!isFinite(this))throw RangeError('Invalid time value');
  var d = this
    , y = d.getUTCFullYear()
    , m = d.getUTCMilliseconds()
    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
}});

if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
  var tag = classof(it);
  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
};
},{"./$":23,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.dom-create":14,"./$.invoke":18,"./$.replacer":29,"./$.throws":36,"./$.uid":37}],41:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  copyWithin: function copyWithin(target/* = 0 */, start /* = 0, end = @length */){
    var O     = Object($.assertDefined(this))
      , len   = $.toLength(O.length)
      , to    = toIndex(target, len)
      , from  = toIndex(start, len)
      , end   = arguments[2]
      , fin   = end === undefined ? len : toIndex(end, len)
      , count = Math.min(fin - from, len - to)
      , inc   = 1;
    if(from < to && to < from + count){
      inc  = -1;
      from = from + count - 1;
      to   = to   + count - 1;
    }
    while(count-- > 0){
      if(from in O)O[to] = O[from];
      else delete O[to];
      to   += inc;
      from += inc;
    } return O;
  }
});
require('./$.unscope')('copyWithin');
},{"./$":23,"./$.def":13,"./$.unscope":38}],42:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  fill: function fill(value /*, start = 0, end = @length */){
    var O      = Object($.assertDefined(this))
      , length = $.toLength(O.length)
      , index  = toIndex(arguments[1], length)
      , end    = arguments[2]
      , endPos = end === undefined ? length : toIndex(end, length);
    while(endPos > index)O[index++] = value;
    return O;
  }
});
require('./$.unscope')('fill');
},{"./$":23,"./$.def":13,"./$.unscope":38}],43:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":38}],44:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":38}],45:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , call  = require('./$.iter-call');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object($.assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result   = new (typeof this == 'function' ? this : Array);
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$":23,"./$.ctx":12,"./$.def":13,"./$.iter":22,"./$.iter-call":19,"./$.iter-detect":21}],46:[function(require,module,exports){
var $          = require('./$')
  , setUnscope = require('./$.unscope')
  , ITER       = require('./$.uid').safe('iter')
  , $iter      = require('./$.iter')
  , step       = $iter.step
  , Iterators  = $iter.Iterators;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.uid":37,"./$.unscope":38}],47:[function(require,module,exports){
var $def = require('./$.def');
$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , length = arguments.length
      // strange IE quirks mode bug -> use typeof instead of isFunction
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":13}],48:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":31}],49:[function(require,module,exports){
var $             = require('./$')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(!$.isFunction(this) || !$.isObject(O))return false;
  if(!$.isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":23,"./$.wks":39}],50:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , NAME = 'name'
  , setDesc = $.setDesc
  , FunctionProto = Function.prototype;
// 19.2.4.2 name
NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
  configurable: true,
  get: function(){
    var match = String(this).match(/^\s*function ([^ (]*)/)
      , name  = match ? match[1] : '';
    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
    return name;
  },
  set: function(value){
    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
  }
});
},{"./$":23}],51:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":11,"./$.collection-strong":8}],52:[function(require,module,exports){
var Infinity = 1 / 0
  , $def  = require('./$.def')
  , E     = Math.E
  , pow   = Math.pow
  , abs   = Math.abs
  , exp   = Math.exp
  , log   = Math.log
  , sqrt  = Math.sqrt
  , ceil  = Math.ceil
  , floor = Math.floor
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);
function roundTiesToEven(n){
  return n + 1 / EPSILON - 1 / EPSILON;
}

// 20.2.2.28 Math.sign(x)
function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
}
// 20.2.2.5 Math.asinh(x)
function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}
// 20.2.2.14 Math.expm1(x)
function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
}

$def($def.S, 'Math', {
  // 20.2.2.3 Math.acosh(x)
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
  },
  // 20.2.2.5 Math.asinh(x)
  asinh: asinh,
  // 20.2.2.7 Math.atanh(x)
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  },
  // 20.2.2.9 Math.cbrt(x)
  cbrt: function cbrt(x){
    return sign(x = +x) * pow(abs(x), 1 / 3);
  },
  // 20.2.2.11 Math.clz32(x)
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * Math.LOG2E) : 32;
  },
  // 20.2.2.12 Math.cosh(x)
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  },
  // 20.2.2.14 Math.expm1(x)
  expm1: expm1,
  // 20.2.2.16 Math.fround(x)
  fround: function fround(x){
    var $abs  = abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  },
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , len1 = arguments.length
      , len2 = len1
      , args = Array(len1)
      , larg = 0
      , arg;
    while(len1--){
      arg = args[len1] = abs(arguments[len1]);
      if(arg == Infinity)return Infinity;
      if(arg > larg)larg = arg;
    }
    larg = larg || 1;
    while(len2--)sum += pow(args[len2] / larg, 2);
    return larg * sqrt(sum);
  },
  // 20.2.2.18 Math.imul(x, y)
  imul: function imul(x, y){
    var UInt16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UInt16 & xn
      , yl = UInt16 & yn;
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
  },
  // 20.2.2.20 Math.log1p(x)
  log1p: function log1p(x){
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
  },
  // 20.2.2.21 Math.log10(x)
  log10: function log10(x){
    return log(x) / Math.LN10;
  },
  // 20.2.2.22 Math.log2(x)
  log2: function log2(x){
    return log(x) / Math.LN2;
  },
  // 20.2.2.28 Math.sign(x)
  sign: sign,
  // 20.2.2.30 Math.sinh(x)
  sinh: function sinh(x){
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  },
  // 20.2.2.33 Math.tanh(x)
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  },
  // 20.2.2.34 Math.trunc(x)
  trunc: function trunc(it){
    return (it > 0 ? floor : ceil)(it);
  }
});
},{"./$.def":13}],53:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , isObject   = $.isObject
  , isFunction = $.isFunction
  , NUMBER     = 'Number'
  , $Number    = $.g[NUMBER]
  , Base       = $Number
  , proto      = $Number.prototype;
function toPrimitive(it){
  var fn, val;
  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
}
function toNumber(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
}
if($.FW && !($Number('0o1') && $Number('0b1'))){
  $Number = function Number(it){
    return this instanceof $Number ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call($.DESC ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if($.has(Base, key) && !$.has($Number, key)){
        $.setDesc($Number, key, $.getDesc(Base, key));
      }
    }
  );
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redef')($.g, NUMBER, $Number);
}
},{"./$":23,"./$.redef":28}],54:[function(require,module,exports){
var $     = require('./$')
  , $def  = require('./$.def')
  , abs   = Math.abs
  , floor = Math.floor
  , _isFinite = $.g.isFinite
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
function isInteger(it){
  return !$.isObject(it) && _isFinite(it) && floor(it) === it;
}
$def($def.S, 'Number', {
  // 20.1.2.1 Number.EPSILON
  EPSILON: Math.pow(2, -52),
  // 20.1.2.2 Number.isFinite(number)
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  },
  // 20.1.2.3 Number.isInteger(number)
  isInteger: isInteger,
  // 20.1.2.4 Number.isNaN(number)
  isNaN: function isNaN(number){
    return number != number;
  },
  // 20.1.2.5 Number.isSafeInteger(number)
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
  },
  // 20.1.2.6 Number.MAX_SAFE_INTEGER
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
  // 20.1.2.10 Number.MIN_SAFE_INTEGER
  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
  // 20.1.2.12 Number.parseFloat(string)
  parseFloat: parseFloat,
  // 20.1.2.13 Number.parseInt(string, radix)
  parseInt: parseInt
});
},{"./$":23,"./$.def":13}],55:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":13}],56:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: function is(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
});
},{"./$.def":13}],57:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":13,"./$.set-proto":30}],58:[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
, function(KEY, ID){
  var fn     = ($.core.Object || {})[KEY] || Object[KEY]
    , forced = 0
    , method = {};
  method[KEY] = ID == 0 ? function freeze(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 1 ? function seal(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 2 ? function preventExtensions(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 3 ? function isFrozen(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 4 ? function isSealed(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 5 ? function isExtensible(it){
    return isObject(it) ? fn(it) : false;
  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : ID == 7 ? function getPrototypeOf(it){
    return fn(Object($.assertDefined(it)));
  } : ID == 8 ? function keys(it){
    return fn(toObject(it));
  } : function getOwnPropertyNames(it){
    return fn(toObject(it));
  };
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":23,"./$.def":13}],59:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if(require('./$').FW && cof(tmp) != 'z'){
  require('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + cof.classof(this) + ']';
  }, true);
}
},{"./$":23,"./$.cof":7,"./$.redef":28,"./$.wks":39}],60:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , setProto = require('./$.set-proto').set
  , species  = require('./$.species')
  , SPECIES  = require('./$.wks')('species')
  , RECORD   = require('./$.uid').safe('record')
  , PROMISE  = 'Promise'
  , global   = $.g
  , process  = global.process
  , asap     = process && process.nextTick || require('./$.task').set
  , P        = global[PROMISE]
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj;

var useNative = function(){
  var test, works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = isFunction(P) && isFunction(P.resolve) && P.resolve(test = new P(function(){})) == test;
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
function isThenable(it){
  var then;
  if(isObject(it))then = it.then;
  return isFunction(then) ? then : false;
}
function notify(record){
  var chain = record.c;
  if(chain.length)asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    function run(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    }
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
  });
}
function isUnhandled(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
}
function $reject(value){
  var record = this
    , promise;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  setTimeout(function(){
    asap(function(){
      if(isUnhandled(promise = record.p)){
        if(cof(process) == 'process'){
          process.emit('unhandledRejection', value, promise);
        } else if(global.console && isFunction(console.error)){
          console.error('Unhandled promise rejection', value);
        }
      }
      record.a = undefined;
    });
  }, 1);
  notify(record);
}
function $resolve(value){
  var record = this
    , then, wrapper;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      wrapper = {r: record, d: false}; // wrap
      then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
    } else {
      record.v = value;
      record.s = 1;
      notify(record);
    }
  } catch(err){
    $reject.call(wrapper || {r: record, d: false}, err); // wrap
  }
}

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, P, PROMISE),       // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      record.s && notify(record);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
cof.set(P, PROMISE);
species(P);
species($.core[PROMISE]); // for wrapper

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new (getConstructor(this))(function(res, rej){
      rej(r);
    });
  },
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isObject(x) && RECORD in x && $.getProto(x) === this.prototype
      ? x : new (getConstructor(this))(function(res){
        res(x);
      });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter-detect":21,"./$.mix":25,"./$.set-proto":30,"./$.species":31,"./$.task":35,"./$.uid":37,"./$.wks":39}],61:[function(require,module,exports){
var $         = require('./$')
  , $def      = require('./$.def')
  , setProto  = require('./$.set-proto')
  , $iter     = require('./$.iter')
  , ITERATOR  = require('./$.wks')('iterator')
  , ITER      = require('./$.uid').safe('iter')
  , step      = $iter.step
  , assert    = require('./$.assert')
  , isObject  = $.isObject
  , getProto  = $.getProto
  , $Reflect  = $.g.Reflect
  , _apply    = Function.apply
  , assertObject = assert.obj
  , _isExtensible = Object.isExtensible || $.isObject
  , _preventExtensions = Object.preventExtensions || $.it
  // IE TP has broken Reflect.enumerate
  , buggyEnumerate = !($Reflect && $Reflect.enumerate && ITERATOR in $Reflect.enumerate({}));

function Enumerate(iterated){
  $.set(this, ITER, {o: iterated, k: undefined, i: 0});
}
$iter.create(Enumerate, 'Object', function(){
  var iter = this[ITER]
    , keys = iter.k
    , key;
  if(keys == undefined){
    iter.k = keys = [];
    for(key in iter.o)keys.push(key);
  }
  do {
    if(iter.i >= keys.length)return step(1);
  } while(!((key = keys[iter.i++]) in iter.o));
  return step(0, key);
});

var reflect = {
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  },
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
  construct: function construct(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = _apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: function defineProperty(target, propertyKey, attributes){
    assertObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = $.getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: function get(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = $.getDesc(assertObject(target), propertyKey), proto;
    if(desc)return $.has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getProto(target))
      ? get(proto, propertyKey, receiver)
      : undefined;
  },
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(assertObject(target), propertyKey);
  },
  // 26.1.8 Reflect.getPrototypeOf(target)
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(assertObject(target));
  },
  // 26.1.9 Reflect.has(target, propertyKey)
  has: function has(target, propertyKey){
    return propertyKey in target;
  },
  // 26.1.10 Reflect.isExtensible(target)
  isExtensible: function isExtensible(target){
    return _isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: function preventExtensions(target){
    assertObject(target);
    try {
      _preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: function set(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = $.getDesc(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getProto(target))){
        return set(proto, propertyKey, V, receiver);
      }
      ownDesc = $.desc(0);
    }
    if($.has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = $.getDesc(receiver, propertyKey) || $.desc(0);
      existingDescriptor.value = V;
      $.setDesc(receiver, propertyKey, existingDescriptor);
      return true;
    }
    return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
  }
};
// 26.1.14 Reflect.setPrototypeOf(target, proto)
if(setProto)reflect.setPrototypeOf = function setPrototypeOf(target, proto){
  setProto.check(target, proto);
  try {
    setProto.set(target, proto);
    return true;
  } catch(e){
    return false;
  }
};

$def($def.G, {Reflect: {}});

$def($def.S + $def.F * buggyEnumerate, 'Reflect', {
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function enumerate(target){
    return new Enumerate(assertObject(target));
  }
});

$def($def.S, 'Reflect', reflect);
},{"./$":23,"./$.assert":5,"./$.def":13,"./$.iter":22,"./$.own-keys":26,"./$.set-proto":30,"./$.uid":37,"./$.wks":39}],62:[function(require,module,exports){
var $       = require('./$')
  , cof     = require('./$.cof')
  , $RegExp = $.g.RegExp
  , Base    = $RegExp
  , proto   = $RegExp.prototype
  , re      = /a/g
  // "new" creates a new object
  , CORRECT_NEW = new $RegExp(re) !== re
  // RegExp allows a regex with flags as the pattern
  , ALLOWS_RE_WITH_FLAGS = function(){
    try {
      return $RegExp(re, 'i') == '/a/i';
    } catch(e){ /* empty */ }
  }();
if($.FW && $.DESC){
  if(!CORRECT_NEW || !ALLOWS_RE_WITH_FLAGS){
    $RegExp = function RegExp(pattern, flags){
      var patternIsRegExp  = cof(pattern) == 'RegExp'
        , flagsIsUndefined = flags === undefined;
      if(!(this instanceof $RegExp) && patternIsRegExp && flagsIsUndefined)return pattern;
      return CORRECT_NEW
        ? new Base(patternIsRegExp && !flagsIsUndefined ? pattern.source : pattern, flags)
        : new Base(patternIsRegExp ? pattern.source : pattern
          , patternIsRegExp && flagsIsUndefined ? pattern.flags : flags);
    };
    $.each.call($.getNames(Base), function(key){
      key in $RegExp || $.setDesc($RegExp, key, {
        configurable: true,
        get: function(){ return Base[key]; },
        set: function(it){ Base[key] = it; }
      });
    });
    proto.constructor = $RegExp;
    $RegExp.prototype = proto;
    require('./$.redef')($.g, 'RegExp', $RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')($RegExp);
},{"./$":23,"./$.cof":7,"./$.redef":28,"./$.replacer":29,"./$.species":31}],63:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":11,"./$.collection-strong":8}],64:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":32}],65:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.endsWith(/./); }), 'String', {
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that = String($.assertDefined(this))
      , endPosition = arguments[1]
      , len = toLength(that.length)
      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    searchString += '';
    return that.slice(end - searchString.length, end) === searchString;
  }
});
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.throws":36}],66:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$":23,"./$.def":13}],67:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
  includes: function includes(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
  }
});
},{"./$":23,"./$.cof":7,"./$.def":13}],68:[function(require,module,exports){
var set   = require('./$').set
  , $at   = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = $at(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.string-at":32,"./$.uid":37}],69:[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl = $.toObject(callSite.raw)
      , len = $.toLength(tpl.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$":23,"./$.def":13}],70:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":13,"./$.string-repeat":34}],71:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.startsWith(/./); }), 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function startsWith(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.throws":36}],72:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
  , $redef   = require('./$.redef')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , getNames = $.getNames
  , toObject = $.toObject
  , $Symbol  = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , _propertyIsEnumerable = {}.propertyIsEnumerable
  , SymbolRegistry = {}
  , AllSymbols = {}
  , useNative = $.isFunction($Symbol);

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
  $.DESC && setter && setDesc(Object.prototype, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setDesc(this, tag, desc(1, value));
    }
  });
  return sym;
}

function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = $create(D, {enumerable: desc(0, false)});
    }
  } return setDesc(it, key, D);
}
function defineProperties(it, P){
  assertObject(it);
  var keys = enumKeys(P = toObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)defineProperty(it, key = keys[i++], P[key]);
  return it;
}
function create(it, P){
  return P === undefined ? $create(it) : defineProperties($create(it), P);
}
function propertyIsEnumerable(key){
  var E = _propertyIsEnumerable.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
}
function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
}
function getOwnPropertyNames(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
}
function getOwnPropertySymbols(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
}

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;

  if($.DESC && $.FW)$redef(Object.prototype, 'propertyIsEnumerable', propertyIsEnumerable, true);
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
    'species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), function(it){
    var sym = require('./$.wks')(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.enum-keys":15,"./$.keyof":24,"./$.redef":28,"./$.uid":37,"./$.wks":39}],73:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , weak      = require('./$.collection-weak')
  , leakStore = weak.leakStore
  , ID        = weak.ID
  , WEAK      = weak.WEAK
  , has       = $.has
  , isObject  = $.isObject
  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
  , tmp       = {};

// 23.3 WeakMap Objects
var WeakMap = require('./$.collection')('WeakMap', {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(isFrozen(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if($.FW && new WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var method = WeakMap.prototype[key];
    require('./$.redef')(WeakMap.prototype, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && isFrozen(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":23,"./$.collection":11,"./$.collection-weak":10,"./$.redef":28}],74:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":11,"./$.collection-weak":10}],75:[function(require,module,exports){
// https://github.com/domenic/Array.prototype.includes
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":13,"./$.unscope":38}],76:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":9}],77:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O      = $.toObject(object)
      , result = {};
    $.each.call(ownKeys(O), function(key){
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
    });
    return result;
  }
});
},{"./$":23,"./$.def":13,"./$.own-keys":26}],78:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $    = require('./$')
  , $def = require('./$.def');
function createObjectToArray(isEntries){
  return function(object){
    var O      = $.toObject(object)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = Array(length)
      , key;
    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
    else while(length > i)result[i] = O[keys[i++]];
    return result;
  };
}
$def($def.S, 'Object', {
  values:  createObjectToArray(false),
  entries: createObjectToArray(true)
});
},{"./$":23,"./$.def":13}],79:[function(require,module,exports){
// https://gist.github.com/kangax/9698100
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
});
},{"./$.def":13,"./$.replacer":29}],80:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":9}],81:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":32}],82:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  lpad: function lpad(n){
    return $pad(this, n, arguments[1], true);
  }
});
},{"./$.def":13,"./$.string-pad":33}],83:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  rpad: function rpad(n){
    return $pad(this, n, arguments[1], false);
  }
});
},{"./$.def":13,"./$.string-pad":33}],84:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , $Array  = $.core.Array || Array
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill,turn');
$def($def.S, 'Array', statics);
},{"./$":23,"./$.ctx":12,"./$.def":13}],85:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NodeList    = $.g.NodeList;
if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
  $.hide(NodeList.prototype, ITERATOR, ArrayValues);
}
Iterators.NodeList = ArrayValues;
},{"./$":23,"./$.iter":22,"./$.wks":39,"./es6.array.iterator":46}],86:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":13,"./$.task":35}],87:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var $         = require('./$')
  , $def      = require('./$.def')
  , invoke    = require('./$.invoke')
  , partial   = require('./$.partial')
  , navigator = $.g.navigator
  , MSIE      = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
function wrap(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      $.isFunction(fn) ? fn : Function(fn)
    ), time);
  } : set;
}
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap($.g.setTimeout),
  setInterval: wrap($.g.setInterval)
});
},{"./$":23,"./$.def":13,"./$.invoke":18,"./$.partial":27}],88:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.statics-accept-primitives');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.statics');
require('./modules/es6.math');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.lpad');
require('./modules/es7.string.rpad');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.to-array');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;

},{"./modules/$":23,"./modules/es5":40,"./modules/es6.array.copy-within":41,"./modules/es6.array.fill":42,"./modules/es6.array.find":44,"./modules/es6.array.find-index":43,"./modules/es6.array.from":45,"./modules/es6.array.iterator":46,"./modules/es6.array.of":47,"./modules/es6.array.species":48,"./modules/es6.function.has-instance":49,"./modules/es6.function.name":50,"./modules/es6.map":51,"./modules/es6.math":52,"./modules/es6.number.constructor":53,"./modules/es6.number.statics":54,"./modules/es6.object.assign":55,"./modules/es6.object.is":56,"./modules/es6.object.set-prototype-of":57,"./modules/es6.object.statics-accept-primitives":58,"./modules/es6.object.to-string":59,"./modules/es6.promise":60,"./modules/es6.reflect":61,"./modules/es6.regexp":62,"./modules/es6.set":63,"./modules/es6.string.code-point-at":64,"./modules/es6.string.ends-with":65,"./modules/es6.string.from-code-point":66,"./modules/es6.string.includes":67,"./modules/es6.string.iterator":68,"./modules/es6.string.raw":69,"./modules/es6.string.repeat":70,"./modules/es6.string.starts-with":71,"./modules/es6.symbol":72,"./modules/es6.weak-map":73,"./modules/es6.weak-set":74,"./modules/es7.array.includes":75,"./modules/es7.map.to-json":76,"./modules/es7.object.get-own-property-descriptors":77,"./modules/es7.object.to-array":78,"./modules/es7.regexp.escape":79,"./modules/es7.set.to-json":80,"./modules/es7.string.at":81,"./modules/es7.string.lpad":82,"./modules/es7.string.rpad":83,"./modules/js.array.statics":84,"./modules/web.dom.iterable":85,"./modules/web.immediate":86,"./modules/web.timers":87}],89:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(
      innerFn, self || null,
      new Context(tryLocsList || [])
    );

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    return new Promise(function(resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryLocsList);
      var callNext = step.bind(generator, "next");
      var callThrow = step.bind(generator, "throw");

      function step(method, arg) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
          return;
        }

        var info = record.arg;
        if (info.done) {
          resolve(info.value);
        } else {
          Promise.resolve(info.value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  function defineGeneratorMethod(method) {
    Gp[method] = function(arg) {
      return this._invoke(method, arg);
    };
  }
  defineGeneratorMethod("next");
  defineGeneratorMethod("throw");
  defineGeneratorMethod("return");

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset();
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName;
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
           ++tempIndex) {
        this[tempName] = null;
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],90:[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":2}],91:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":90}],92:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],93:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],94:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":92,"./encode":93}],95:[function(require,module,exports){
'use strict';

/*
*
*	https://github.com/fooey/node-gw2
*   http://wiki.guildwars2.com/wiki/API:Main
*

*/
var request = require('superagent');




/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	getMatches: getMatches,
	getMatchesState: getMatchesState,
	getObjectiveNames: getObjectiveNames,
	getMatchDetails: getMatchDetails,
	getMatchDetailsState: getMatchDetailsState,

	getItems: getItems,
	getItemDetails: getItemDetails,
	getRecipes: getRecipes,
	getRecipeDetails: getRecipeDetails,

	getWorldNames: getWorldNames,
	getGuildDetails: getGuildDetails,

	getMapNames: getMapNames,
	getContinents: getContinents,
	getMaps: getMaps,
	getMapFloor: getMapFloor,

	getBuild: getBuild,
	getColors: getColors,

	getFiles: getFiles,
	getFile: getFile,
	getFileRenderUrl: getFileRenderUrl,
};




/*
*
*   PRIVATE PROPERTIES
*
*/

var endPoints = {
	worldNames: 'https://api.guildwars2.com/v2/worlds',							// https://api.guildwars2.com/v2/worlds?page=0
	colors: 'https://api.guildwars2.com/v1/colors.json',						// http://wiki.guildwars2.com/wiki/API:1/colors
	guildDetails: 'https://api.guildwars2.com/v1/guild_details.json',			// http://wiki.guildwars2.com/wiki/API:1/guild_details

	items: 'https://api.guildwars2.com/v1/items.json',							// http://wiki.guildwars2.com/wiki/API:1/items
	itemDetails: 'https://api.guildwars2.comv1/item_details.json',				// http://wiki.guildwars2.com/wiki/API:1/item_details
	recipes: 'https://api.guildwars2.com/v1/recipes.json',						// http://wiki.guildwars2.com/wiki/API:1/recipes
	recipeDetails: 'https://api.guildwars2.com/v1/recipe_details.json',			// http://wiki.guildwars2.com/wiki/API:1/recipe_details

	mapNames: 'https://api.guildwars2.com/v1/map_names.json',					// http://wiki.guildwars2.com/wiki/API:1/map_names
	continents: 'https://api.guildwars2.com/v1/continents.json',				// http://wiki.guildwars2.com/wiki/API:1/continents
	maps: 'https://api.guildwars2.com/v1/maps.json',							// http://wiki.guildwars2.com/wiki/API:1/maps
	mapFloor: 'https://api.guildwars2.com/v1/map_floor.json',					// http://wiki.guildwars2.com/wiki/API:1/map_floor

	objectiveNames: 'https://api.guildwars2.com/v1/wvw/objective_names.json',	// http://wiki.guildwars2.com/wiki/API:1/wvw/matches
	matches: 'https://api.guildwars2.com/v1/wvw/matches.json',					// http://wiki.guildwars2.com/wiki/API:1/wvw/match_details
	matchDetails: 'https://api.guildwars2.com/v1/wvw/match_details.json',		// http://wiki.guildwars2.com/wiki/API:1/wvw/objective_names

	matchesState: 'http://state.gw2w2w.com/matches',
	matchDetailsState: 'http://state.gw2w2w.com/',
};



/*
*
*   PUBLIC METHODS
*
*/



/*
*	WORLD vs WORLD
*/

// OPTIONAL: lang
function getObjectiveNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('objectiveNames', params, callback);
}



// NO PARAMS
function getMatches(callback) {
	get('matches', {}, function(err, data) {
		var wvw_matches = (data && data.wvw_matches) ? data.wvw_matches : [];
		callback(err, wvw_matches);
	});
}



// REQUIRED: match_id
function getMatchDetails(params, callback) {
	if (!params.match_id) {
		throw ('match_id is a required parameter');
	}
	get('matchDetails', params, callback);
}





// OPTIONAL: match_id
function getMatchesState(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}

	var requestUrl = endPoints.matchesState;

	if (params.match_id) {
		requestUrl += ('' + params.match_id);
	}

	get(requestUrl, {}, callback);
}


// REQUIRED: match_id || world_slug
function getMatchDetailsState(params, callback) {
	var requestUrl = endPoints.matchDetailsState;

	if (!params.match_id && !params.world_slug) {
		throw ('Either match_id or world_slug must be passed');
	}
	else if (params.match_id) {
		requestUrl += params.match_id;
	}
	else if (params.world_slug) {
		requestUrl += 'world/' + params.world_slug;
	}
	get(requestUrl, {}, callback);
}



/*
*	GENERAL
*/


// OPTIONAL: lang, ids
function getWorldNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}

	if (!params.ids) {
		params.page = 0;
	}
	else if (Array.isArray(params.ids)) {
		params.ids = params.ids.join(',');
	}
	get('worldNames', params, callback);
}



// REQUIRED: guild_id || guild_name (id takes priority)
function getGuildDetails(params, callback) {
	if (!params.guild_id && !params.guild_name) {
		throw ('Either guild_id or guild_name must be passed');
	}

	get('guildDetails', params, callback);
}



/*
*	ITEMS
*/

// NO PARAMS
function getItems(callback) {
	get('items', {}, callback);
}


// REQUIRED: item_id
// OPTIONAL: lang
function getItemDetails(params, callback) {
	if (!params.item_id) {
		throw ('item_id is a required parameter');
	}
	get('itemDetails', params, callback);
}


// NO PARAMS
function getRecipes(callback) {
	get('recipes', {}, callback);
}

// REQUIRED: recipe_id
// OPTIONAL: lang
function getRecipeDetails(params, callback) {
	if (!params.recipe_id) {
		throw ('recipe_id is a required parameter');
	}
	get('recipeDetails', params, callback);
}



/*
*	MAP INFORMATION
*/

// OPTIONAL: lang
function getMapNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('mapNames', params, callback);
}

// NO PARAMS
function getContinents(callback) {
	get('continents', {}, callback);
}


// OPTIONAL: map_id, lang
function getMaps(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('maps', params, callback);
}


// REQUIRED: continent_id, floor
// OPTIONAL: lang
function getMapFloor(params, callback) {
	if (!params.continent_id) {
		throw ('continent_id is a required parameter');
	}
	else if (!params.floor) {
		throw ('floor is a required parameter');
	}
	get('mapFloor', {}, callback);
}



/*
*	Miscellaneous
*/

// NO PARAMS
function getBuild(callback) {
	get('build', {}, callback);
}


// OPTIONAL: lang
function getColors(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('colors', params, callback);
}


// NO PARAMS
// to get files: https://render.guildwars2.com/file/{signature}/{file_id}.{format}
function getFiles(callback) {
	get('files', {}, callback);
}



/*
*
*   UTILITY METHODS
*
*/


// SPECIAL CASE
// REQUIRED: signature, file_id, format
function getFile(params, callback) {
	if (!params.signature) {
		throw ('signature is a required parameter');
	}
	else if (!params.file_id) {
		throw ('file_id is a required parameter');
	}
	else if (!params.format) {
		throw ('format is a required parameter');
	}


	request
		.get(getFileRenderUrl(params))
		.end(function(err, data) {
			callback(err, parseJson(data.text));
		});
}


// REQUIRED: signature, file_id, format
function getFileRenderUrl(params, callback) {
	if (!params.signature) {
		throw ('signature is a required parameter');
	}
	else if (!params.file_id) {
		throw ('file_id is a required parameter');
	}
	else if (!params.format) {
		throw ('format is a required parameter');
	}

	var renderUrl = (
		'https://render.guildwars2.com/file/'
		+ params.signature
		+ '/'
		+ params.file_id
		+ '.'
		+ params.format
	);
	return renderUrl;
}





/*
*
*   PRIVATE METHODS
*
*/

function get(key, params, callback) {
	params = params || {};

	var apiUrl = getApiUrl(key, params);

	request
		.get(apiUrl)
		.end(function(err, data) {
			callback(err, parseJson(data.text));
		});
}



function getApiUrl(requestUrl, params) {
	var qs = require('querystring');

	requestUrl = (endPoints[requestUrl])
		? endPoints[requestUrl]
		: requestUrl;

	var query = qs.stringify(params);

	if (query.length) {
		requestUrl += '?' + query;
	}

	return requestUrl;
}


function parseJson(data) {
	var results;

	try {
		results = JSON.parse(data);
	}
	catch (e) {}

	return results;
}


},{"querystring":94,"superagent":96}],96:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? (this || self)
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(err || new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":97,"reduce":98}],97:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],98:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
module.exports = {
	"1": {"id": "1", "en": "Overlook", "fr": "Belvédère", "es": "Mirador", "de": "Aussichtspunkt"},
	"2": {"id": "2", "en": "Valley", "fr": "Vallée", "es": "Valle", "de": "Tal"},
	"3": {"id": "3", "en": "Lowlands", "fr": "Basses terres", "es": "Vega", "de": "Tiefland"},
	"4": {"id": "4", "en": "Golanta Clearing", "fr": "Clairière de Golanta", "es": "Claro Golanta", "de": "Golanta-Lichtung"},
	"5": {"id": "5", "en": "Pangloss Rise", "fr": "Montée de Pangloss", "es": "Colina Pangloss", "de": "Pangloss-Anhöhe"},
	"6": {"id": "6", "en": "Speldan Clearcut", "fr": "Forêt rasée de Speldan", "es": "Claro Espeldia", "de": "Speldan Kahlschlag"},
	"7": {"id": "7", "en": "Danelon Passage", "fr": "Passage Danelon", "es": "Pasaje Danelon", "de": "Danelon-Passage"},
	"8": {"id": "8", "en": "Umberglade Woods", "fr": "Bois d'Ombreclair", "es": "Bosques Clarosombra", "de": "Umberlichtung-Forst"},
	"9": {"id": "9", "en": "Stonemist Castle", "fr": "Château Brumepierre", "es": "Castillo Piedraniebla", "de": "Schloss Steinnebel"},
	"10": {"id": "10", "en": "Rogue's Quarry", "fr": "Carrière des voleurs", "es": "Cantera del Pícaro", "de": "Schurkenbruch"},
	"11": {"id": "11", "en": "Aldon's Ledge", "fr": "Corniche d'Aldon", "es": "Cornisa de Aldon", "de": "Aldons Vorsprung"},
	"12": {"id": "12", "en": "Wildcreek Run", "fr": "Piste du Ruisseau sauvage", "es": "Pista Arroyosalvaje", "de": "Wildbachstrecke"},
	"13": {"id": "13", "en": "Jerrifer's Slough", "fr": "Bourbier de Jerrifer", "es": "Cenagal de Jerrifer", "de": "Jerrifers Sumpfloch"},
	"14": {"id": "14", "en": "Klovan Gully", "fr": "Petit ravin de Klovan", "es": "Barranco Klovan", "de": "Klovan-Senke"},
	"15": {"id": "15", "en": "Langor Gulch", "fr": "Ravin de Langor", "es": "Barranco Langor", "de": "Langor - Schlucht"},
	"16": {"id": "16", "en": "Quentin Lake", "fr": "Lac Quentin", "es": "Lago Quentin", "de": "Quentinsee"},
	"17": {"id": "17", "en": "Mendon's Gap", "fr": "Faille de Mendon", "es": "Zanja de Mendon", "de": "Mendons Spalt"},
	"18": {"id": "18", "en": "Anzalias Pass", "fr": "Col d'Anzalias", "es": "Paso Anzalias", "de": "Anzalias-Pass"},
	"19": {"id": "19", "en": "Ogrewatch Cut", "fr": "Percée de Gardogre", "es": "Tajo de la Guardia del Ogro", "de": "Ogerwacht-Kanal"},
	"20": {"id": "20", "en": "Veloka Slope", "fr": "Flanc de Veloka", "es": "Pendiente Veloka", "de": "Veloka-Hang"},
	"21": {"id": "21", "en": "Durios Gulch", "fr": "Ravin de Durios", "es": "Barranco Durios", "de": "Durios-Schlucht"},
	"22": {"id": "22", "en": "Bravost Escarpment", "fr": "Falaise de Bravost", "es": "Escarpadura Bravost", "de": "Bravost-Abhang"},
	"23": {"id": "23", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"24": {"id": "24", "en": "Champion's Demense", "fr": "Fief du champion", "es": "Dominio del Campeón", "de": "Landgut des Champions"},
	"25": {"id": "25", "en": "Redbriar", "fr": "Bruyerouge", "es": "Zarzarroja", "de": "Rotdornstrauch"},
	"26": {"id": "26", "en": "Greenlake", "fr": "Lac Vert", "es": "Lagoverde", "de": "Grünsee"},
	"27": {"id": "27", "en": "Ascension Bay", "fr": "Baie de l'Ascension", "es": "Bahía de la Ascensión", "de": "Bucht des Aufstiegs"},
	"28": {"id": "28", "en": "Dawn's Eyrie", "fr": "Promontoire de l'aube", "es": "Aguilera del Alba", "de": "Horst der Morgendammerung"},
	"29": {"id": "29", "en": "The Spiritholme", "fr": "L'antre des esprits", "es": "La Isleta Espiritual", "de": "Der Geisterholm"},
	"30": {"id": "30", "en": "Woodhaven", "fr": "Gentesylve", "es": "Refugio Forestal", "de": "Wald - Freistatt"},
	"31": {"id": "31", "en": "Askalion Hills", "fr": "Collines d'Askalion", "es": "Colinas Askalion", "de": "Askalion - Hügel"},
	"32": {"id": "32", "en": "Etheron Hills", "fr": "Collines d'Etheron", "es": "Colinas Etheron", "de": "Etheron - Hügel"},
	"33": {"id": "33", "en": "Dreaming Bay", "fr": "Baie des rêves", "es": "Bahía Onírica", "de": "Traumbucht"},
	"34": {"id": "34", "en": "Victor's Lodge", "fr": "Pavillon du vainqueur", "es": "Albergue del Vencedor", "de": "Sieger - Hütte"},
	"35": {"id": "35", "en": "Greenbriar", "fr": "Vertebranche", "es": "Zarzaverde", "de": "Grünstrauch"},
	"36": {"id": "36", "en": "Bluelake", "fr": "Lac bleu", "es": "Lagoazul", "de": "Blausee"},
	"37": {"id": "37", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"38": {"id": "38", "en": "Longview", "fr": "Longuevue", "es": "Vistaluenga", "de": "Weitsicht"},
	"39": {"id": "39", "en": "The Godsword", "fr": "L'Epée divine", "es": "La Hoja Divina", "de": "Das Gottschwert"},
	"40": {"id": "40", "en": "Cliffside", "fr": "Flanc de falaise", "es": "Despeñadero", "de": "Felswand"},
	"41": {"id": "41", "en": "Shadaran Hills", "fr": "Collines de Shadaran", "es": "Colinas Shadaran", "de": "Shadaran Hügel"},
	"42": {"id": "42", "en": "Redlake", "fr": "Rougelac", "es": "Lagorrojo", "de": "Rotsee"},
	"43": {"id": "43", "en": "Hero's Lodge", "fr": "Pavillon du Héros", "es": "Albergue del Héroe", "de": "Hütte des Helden"},
	"44": {"id": "44", "en": "Dreadfall Bay", "fr": "Baie du Noir déclin", "es": "Bahía Salto Aciago", "de": "Schreckensfall - Bucht"},
	"45": {"id": "45", "en": "Bluebriar", "fr": "Bruyazur", "es": "Zarzazul", "de": "Blaudornstrauch"},
	"46": {"id": "46", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"47": {"id": "47", "en": "Sunnyhill", "fr": "Colline ensoleillée", "es": "Colina Soleada", "de": "Sonnenlichthügel"},
	"48": {"id": "48", "en": "Faithleap", "fr": "Ferveur", "es": "Salto de Fe", "de": "Glaubenssprung"},
	"49": {"id": "49", "en": "Bluevale Refuge", "fr": "Refuge de bleuval", "es": "Refugio Valleazul", "de": "Blautal - Zuflucht"},
	"50": {"id": "50", "en": "Bluewater Lowlands", "fr": "Basses terres d'Eau-Azur", "es": "Tierras Bajas de Aguazul", "de": "Blauwasser - Tiefland"},
	"51": {"id": "51", "en": "Astralholme", "fr": "Astralholme", "es": "Isleta Astral", "de": "Astralholm"},
	"52": {"id": "52", "en": "Arah's Hope", "fr": "Espoir d'Arah", "es": "Esperanza de Arah", "de": "Arahs Hoffnung"},
	"53": {"id": "53", "en": "Greenvale Refuge", "fr": "Refuge de Valvert", "es": "Refugio de Valleverde", "de": "Grüntal - Zuflucht"},
	"54": {"id": "54", "en": "Foghaven", "fr": "Havre gris", "es": "Refugio Neblinoso", "de": "Nebel - Freistatt"},
	"55": {"id": "55", "en": "Redwater Lowlands", "fr": "Basses terres de Rubicon", "es": "Tierras Bajas de Aguarroja", "de": "Rotwasser - Tiefland"},
	"56": {"id": "56", "en": "The Titanpaw", "fr": "Bras du titan", "es": "La Garra del Titán", "de": "Die Titanenpranke"},
	"57": {"id": "57", "en": "Cragtop", "fr": "Sommet de l'escarpement", "es": "Cumbrepeñasco", "de": "Felsenspitze"},
	"58": {"id": "58", "en": "Godslore", "fr": "Divination", "es": "Sabiduría de los Dioses", "de": "Götterkunde"},
	"59": {"id": "59", "en": "Redvale Refuge", "fr": "Refuge de Valrouge", "es": "Refugio Vallerojo", "de": "Rottal - Zuflucht"},
	"60": {"id": "60", "en": "Stargrove", "fr": "Bosquet stellaire", "es": "Arboleda de las Estrellas", "de": "Sternenhain"},
	"61": {"id": "61", "en": "Greenwater Lowlands", "fr": "Basses terres d'Eau-Verdoyante", "es": "Tierras Bajas de Aguaverde", "de": "Grünwasser - Tiefland"},
	"62": {"id": "62", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
	"63": {"id": "63", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"64": {"id": "64", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"65": {"id": "65", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"66": {"id": "66", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"67": {"id": "67", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"68": {"id": "68", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"69": {"id": "69", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"70": {"id": "70", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"71": {"id": "71", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
	"72": {"id": "72", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"73": {"id": "73", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"74": {"id": "74", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"75": {"id": "75", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"76": {"id": "76", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
};

},{}],101:[function(require,module,exports){
module.exports = [
	{
		"key": "Center",
		"name": "Eternal Battlegrounds",
		"abbr": "EBG",
		"mapIndex": 3,
		"color": "neutral",
		"sections": [{
				"label": "Castle",
				"groupType": "neutral",
				"objectives": [9], 								// sm
			}, {
				"label": "Red Corner",
				"groupType": "red",
				"objectives": [1, 17, 20, 18, 19, 6, 5],		// overlook, mendons, veloka, anz, ogre, speldan, pang
			}, {
				"label": "Blue Corner",
				"groupType": "blue",
				"objectives": [2, 15, 22, 16, 21, 7, 8]			// valley, langor, bravost, quentin, durios, dane, umber
			}, {
				"label": "Green Corner",
				"groupType": "green",
				"objectives": [3, 11, 13, 12, 14, 10, 4] 		// lowlands, aldons, jerrifer, wildcreek, klovan, rogues, golanta
			},],
	}, {
		"key": "RedHome",
		"name": "RedHome",
		"abbr": "Red",
		"mapIndex": 0,
		"color": "red",
		"sections": [{
				"label": "Keeps",
				"groupType": "red",
				"objectives": [37, 33, 32] 						// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {
				"label": "North",
				"groupType": "red",
				"objectives": [38, 40, 39, 52, 51] 				// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [35, 36, 34, 53, 50] 				// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [62, 63, 64, 65, 66] 				// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "BlueHome",
		"name": "BlueHome",
		"abbr": "Blu",
		"mapIndex": 2,
		"color": "blue",
		"sections": [{
				"label": "Keeps",
				"groupType": "blue",
				"objectives": [23, 27, 31] 						// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "North",
				"groupType": "blue",
				"objectives": [30, 28, 29, 58, 60] 				// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [25, 26, 24, 59, 61] 				// briar, lake, champ, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [71, 70, 69, 68, 67] 				// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "GreenHome",
		"name": "GreenHome",
		"abbr": "Grn",
		"mapIndex": 1,
		"color": "green",
		"sections": [{
				"label": "Keeps",
				"groupType": "green",
				"objectives": [46, 44, 41] 						// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "North",
				"groupType": "green",
				"objectives": [47, 57, 56, 48, 54] 				// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [45, 42, 43, 49, 55] 				// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [76 , 75 , 74 , 73 , 72 ] 		// temple, hollow, estate, orchard, ascent
			},]
	},
];

},{}],102:[function(require,module,exports){
module.exports = {
	//	EBG
	"9":	{"type": 1, "timer": 1, "map": 3, "d": 0, "n": 0, "s": 0, "w": 0, "e": 0},	// Stonemist Castle

	//	Red Corner
	"1":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Red Keep - Overlook
	"17":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Red Tower - Mendon's Gap
	"20":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Red Tower - Veloka Slope
	"18":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Red Tower - Anzalias Pass
	"19":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Red Tower - Ogrewatch Cut
	"6":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Red Camp - Mill - Speldan
	"5":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Red Camp - Mine - Pangloss

	//	Blue Corner
	"2":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Keep - Valley
	"15":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Blue Tower - Langor Gulch
	"22":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Tower - Bravost Escarpment
	"16":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Blue Tower - Quentin Lake
	"21":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Blue Tower - Durios Gulch
	"7":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// Blue Camp - Mine - Danelon
	"8":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Blue Camp - Mill - Umberglade

	//	Green Corner
	"3":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Keep - Lowlands
	"11":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Green Tower - Aldons
	"13":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Green Tower - Jerrifer's Slough
	"12":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Green Tower - Wildcreek
	"14":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Green Tower - Klovan Gully
	"10":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Camp - Mine - Rogues Quarry
	"4":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Green Camp - Mill - Golanta


	//	RedHome
	"37":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"33":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreaming Bay
	"32":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Etheron Hills
	"38":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Longview
	"40":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cliffside
	"39":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Godsword
	"52":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Arah's Hope
	"51":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Astralholme

	"35":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Greenbriar
	"36":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Bluelake
	"34":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Victor's Lodge
	"53":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Greenvale Refuge
	"50":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Bluewater Lowlands


	//	GreenHome
	"46":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"44":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreadfall Bay
	"41":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Shadaran Hills
	"47":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Sunnyhill
	"57":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cragtop
	"56":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Titanpaw
	"48":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Faithleap
	"54":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Foghaven

	"45":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Bluebriar
	"42":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Redlake
	"43":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Hero's Lodge
	"49":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Bluevale Refuge
	"55":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Redwater Lowlands


	//	BlueHome
	"23":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"27":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Ascension Bay
	"31":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Askalion Hills
	"30":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Woodhaven
	"28":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Dawn's Eyrie
	"29":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Spiritholme
	"58":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Godslore
	"60":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Stargrove

	"25":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Redbriar
	"26":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Greenlake
	"24":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Champion's Demense
	"59":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Redvale Refuge
	"61":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Greenwater Lowlands
};

},{}],103:[function(require,module,exports){
module.exports = {
	"1": {"id": 1, "name": "Keep"},
	"2": {"id": 2, "name": "Keep"},
	"3": {"id": 3, "name": "Keep"},
	"4": {"id": 4, "name": "Green Mill"},
	"5": {"id": 5, "name": "Red Mine"},
	"6": {"id": 6, "name": "Red Mill"},
	"7": {"id": 7, "name": "Blue Mine"},
	"8": {"id": 8, "name": "Blue Mill"},
	"9": {"id": 9, "name": "Castle"},
	"10": {"id": 10, "name": "Green Mine"},
	"11": {"id": 11, "name": "Tower"},
	"12": {"id": 12, "name": "Tower"},
	"13": {"id": 13, "name": "Tower"},
	"14": {"id": 14, "name": "Tower"},
	"15": {"id": 15, "name": "Tower"},
	"16": {"id": 16, "name": "Tower"},
	"17": {"id": 17, "name": "Tower"},
	"18": {"id": 18, "name": "Tower"},
	"19": {"id": 19, "name": "Tower"},
	"20": {"id": 20, "name": "Tower"},
	"21": {"id": 21, "name": "Tower"},
	"22": {"id": 22, "name": "Tower"},
	"23": {"id": 23, "name": "Keep"},
	"25": {"id": 25, "name": "Tower"},
	"24": {"id": 24, "name": "Orchard"},
	"26": {"id": 26, "name": "Tower"},
	"27": {"id": 27, "name": "Keep"},
	"28": {"id": 28, "name": "Tower"},
	"29": {"id": 29, "name": "Crossroads"},
	"30": {"id": 30, "name": "Tower"},
	"31": {"id": 31, "name": "Keep"},
	"32": {"id": 32, "name": "Keep"},
	"33": {"id": 33, "name": "Keep"},
	"34": {"id": 34, "name": "Orchard"},
	"35": {"id": 35, "name": "Tower"},
	"36": {"id": 36, "name": "Tower"},
	"37": {"id": 37, "name": "Keep"},
	"38": {"id": 38, "name": "Tower"},
	"39": {"id": 39, "name": "Crossroads"},
	"40": {"id": 40, "name": "Tower"},
	"41": {"id": 41, "name": "Keep"},
	"42": {"id": 42, "name": "Tower"},
	"43": {"id": 43, "name": "Orchard"},
	"44": {"id": 44, "name": "Keep"},
	"45": {"id": 45, "name": "Tower"},
	"46": {"id": 46, "name": "Keep"},
	"47": {"id": 47, "name": "Tower"},
	"48": {"id": 48, "name": "Quarry"},
	"49": {"id": 49, "name": "Workshop"},
	"50": {"id": 50, "name": "Fishing Village"},
	"51": {"id": 51, "name": "Lumber Mill"},
	"52": {"id": 52, "name": "Quarry"},
	"53": {"id": 53, "name": "Workshop"},
	"54": {"id": 54, "name": "Lumber Mill"},
	"55": {"id": 55, "name": "Fishing Village"},
	"56": {"id": 56, "name": "Crossroads"},
	"57": {"id": 57, "name": "Tower"},
	"58": {"id": 58, "name": "Quarry"},
	"59": {"id": 59, "name": "Workshop"},
	"60": {"id": 60, "name": "Lumber Mill"},
	"61": {"id": 61, "name": "Fishing Village"},
	"62": {"id": 62, "name": "((Temple of Lost Prayers))"},
	"63": {"id": 63, "name": "((Battle's Hollow))"},
	"64": {"id": 64, "name": "((Bauer's Estate))"},
	"65": {"id": 65, "name": "((Orchard Overlook))"},
	"66": {"id": 66, "name": "((Carver's Ascent))"},
	"67": {"id": 67, "name": "((Carver's Ascent))"},
	"68": {"id": 68, "name": "((Orchard Overlook))"},
	"69": {"id": 69, "name": "((Bauer's Estate))"},
	"70": {"id": 70, "name": "((Battle's Hollow))"},
	"71": {"id": 71, "name": "((Temple of Lost Prayers))"},
	"72": {"id": 72, "name": "((Carver's Ascent))"},
	"73": {"id": 73, "name": "((Orchard Overlook))"},
	"74": {"id": 74, "name": "((Bauer's Estate))"},
	"75": {"id": 75, "name": "((Battle's Hollow))"},
	"76": {"id": 76, "name": "((Temple of Lost Prayers))"}
};

},{}],104:[function(require,module,exports){
module.exports = {
	"1": {"id": 1, "timer": 1, "value": 35, "name": "castle"},
	"2": {"id": 2, "timer": 1, "value": 25, "name": "keep"},
	"3": {"id": 3, "timer": 1, "value": 10, "name": "tower"},
	"4": {"id": 4, "timer": 1, "value": 5, "name": "camp"},
	"5": {"id": 5, "timer": 0, "value": 0, "name": "temple"},
	"6": {"id": 6, "timer": 0, "value": 0, "name": "hollow"},
	"7": {"id": 7, "timer": 0, "value": 0, "name": "estate"},
	"8": {"id": 8, "timer": 0, "value": 0, "name": "overlook"},
	"9": {"id": 9, "timer": 0, "value": 0, "name": "ascent"}
};

},{}],105:[function(require,module,exports){
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

},{}],106:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":99,"./data/objective_labels":100,"./data/objective_map":101,"./data/objective_meta":102,"./data/objective_names":103,"./data/objective_types":104,"./data/world_names":105}],107:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var MatchWorld = require('./MatchWorld');

/*
*
* Component Export
*
*/

var propTypes = {
    match: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

var Match = (function (_React$Component) {
    function Match() {
        _classCallCheck(this, Match);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Match, _React$Component);

    _createClass(Match, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newScores = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
            var newMatch = !Immutable.is(this.props.match.get('startTime'), nextProps.match.get('startTime'));
            var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
            var shouldUpdate = newScores || newMatch || newWorlds;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('overview::Match::render()', props.match.toJS());

            var worldColors = ['red', 'blue', 'green'];

            return React.createElement(
                'div',
                { className: 'matchContainer' },
                React.createElement(
                    'table',
                    { className: 'match' },
                    React.createElement(
                        'tbody',
                        null,
                        worldColors.map(function (color, ixColor) {
                            var worldKey = color + 'Id';
                            var worldId = props.match.get(worldKey).toString();
                            var world = props.worlds.get(worldId);
                            var scores = props.match.get('scores');

                            return React.createElement(MatchWorld, {
                                component: 'tr',
                                key: worldId,

                                world: world,
                                scores: scores,

                                color: color,
                                ixColor: ixColor,
                                showPie: ixColor === 0
                            });
                        })
                    )
                )
            );
        }
    }]);

    return Match;
})(React.Component);

/*
*
* Export Module
*
*/

Match.propTypes = propTypes;
module.exports = Match;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./MatchWorld":108}],108:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Score = require('./Score');
var Pie = require('./../../common/Icons/Pie');

/*
*
* Component Export
*
*/

var propTypes = {
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    scores: React.PropTypes.instanceOf(Immutable.List).isRequired,
    color: React.PropTypes.string.isRequired,
    ixColor: React.PropTypes.number.isRequired,
    showPie: React.PropTypes.bool.isRequired };

var MatchWorld = (function (_React$Component) {
    function MatchWorld() {
        _classCallCheck(this, MatchWorld);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MatchWorld, _React$Component);

    _createClass(MatchWorld, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newScores = !Immutable.is(this.props.scores, nextProps.scores);
            var newColor = !Immutable.is(this.props.color, nextProps.color);
            var newWorld = !Immutable.is(this.props.world, nextProps.world);
            var shouldUpdate = newScores || newColor || newWorld;

            // console.log('overview::MatchWorlds::shouldComponentUpdate()', shouldUpdate, newScores, newColor, newWorld);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('overview::MatchWorlds::render()');

            return React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    { className: 'team name ' + props.color },
                    React.createElement(
                        'a',
                        { href: props.world.get('link') },
                        props.world.get('name')
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'team score ' + props.color },
                    React.createElement(Score, {
                        team: props.color,
                        score: props.scores.get(props.ixColor)
                    })
                ),
                props.showPie ? React.createElement(
                    'td',
                    { rowSpan: '3', className: 'pie' },
                    React.createElement(Pie, {
                        scores: props.scores,
                        size: 60
                    })
                ) : null
            );
        }
    }]);

    return MatchWorld;
})(React.Component);

/*
*
* Export Module
*
*/

MatchWorld.propTypes = propTypes;
module.exports = MatchWorld;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Pie":141,"./Score":109}],109:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

// const $    = require('jQuery');
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
*
* Component Definition
*
*/

var propTypes = {
    score: React.PropTypes.number.isRequired };

var defaultProps = {
    score: 0 };

var Score = (function (_React$Component) {
    function Score(props) {
        _classCallCheck(this, Score);

        _get(Object.getPrototypeOf(Score.prototype), 'constructor', this).call(this, props);
        this.state = {
            diff: 0,
            $diffNode: null };
    }

    _inherits(Score, _React$Component);

    _createClass(Score, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.props.score !== nextProps.score;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var props = this.props;

            this.setState({ diff: nextProps.score - props.score });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var state = this.state;

            if (state.diff !== 0) {
                animateScoreDiff(this.state.$diffNode);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // cache jQuery object to state
            this.setState({
                $diffNode: $('.diff', React.findDOMNode(this)) });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'diff', ref: 'diff' },
                    getDiffText(this.state.diff)
                ),
                React.createElement(
                    'span',
                    { className: 'value' },
                    getScoreText(this.props.score)
                )
            );
        }
    }]);

    return Score;
})(React.Component);

/*
*
* Private Methods
*
*/

function animateScoreDiff($el) {
    $el.velocity('stop').velocity({ opacity: 0 }, { duration: 0 }).velocity({ opacity: 1 }, { duration: 200 }).velocity({ opacity: 0 }, { duration: 800, delay: 1000 });
}

function getDiffText(diff) {
    return diff ? numeral(diff).format('+0,0') : null;
}

function getScoreText(score) {
    return score ? numeral(score).format('0,0') : null;
}

/*
*
* Export Module
*
*/

Score.propTypes = propTypes;
Score.defaultProps = defaultProps;
module.exports = Score;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],110:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Match = require('./Match');

/*
* Component Globals
*/

var loadingHtml = React.createElement(
    'span',
    { style: { paddingLeft: '.5em' } },
    React.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

/*
*
* Component Definition
*
*/

var propTypes = {
    region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    matches: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

var Matches = (function (_React$Component) {
    function Matches() {
        _classCallCheck(this, Matches);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Matches, _React$Component);

    _createClass(Matches, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newRegion = !Immutable.is(this.props.region, nextProps.region);
            var newMatches = !Immutable.is(this.props.matches, nextProps.matches);
            var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
            var shouldUpdate = newRegion || newMatches || newWorlds;

            // console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('overview::Matches::render()');
            // console.log('overview::Matches::render()', 'region', props.region.toJS());
            // console.log('overview::Matches::render()', 'matches', props.matches.toJS());
            // console.log('overview::Matches::render()', 'worlds', props.worlds);

            return React.createElement(
                'div',
                { className: 'RegionMatches' },
                React.createElement(
                    'h2',
                    null,
                    props.region.get('label'),
                    ' Matches',
                    !props.matches.size ? loadingHtml : null
                ),
                props.matches.map(function (match) {
                    return React.createElement(Match, {
                        key: match.get('id'),
                        className: 'match',

                        worlds: props.worlds,
                        match: match
                    });
                })
            );
        }
    }]);

    return Matches;
})(React.Component);

/*
*
* Export Module
*
*/

Matches.propTypes = propTypes;
module.exports = Matches;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Match":107}],111:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*
* Component Definition
*
*/

var propTypes = {
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var World = (function (_React$Component) {
    function World() {
        _classCallCheck(this, World);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(World, _React$Component);

    _createClass(World, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var newWorld = !Immutable.is(this.props.world, nextProps.world);
            var shouldUpdate = newLang || newWorld;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('World::render', props.world.toJS());

            return React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    { href: props.world.get('link') },
                    props.world.get('name')
                )
            );
        }
    }]);

    return World;
})(React.Component);

/*
*
* Export Module
*
*/

World.propTypes = propTypes;
module.exports = World;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],112:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var World = require('./World');

/*
*
* Component Definition
*
*/

var propTypes = {
    region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

var Worlds = (function (_React$Component) {
    function Worlds() {
        _classCallCheck(this, Worlds);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Worlds, _React$Component);

    _createClass(Worlds, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.worlds, nextProps.worlds);
            var newRegion = !Immutable.is(this.props.region.get('worlds'), nextProps.region.get('worlds'));
            var shouldUpdate = newLang || newRegion;

            // console.log('overview::RegionWorlds::shouldComponentUpdate()', shouldUpdate, newLang, newRegion);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('overview::Worlds::render()', props.region.get('label'), props.region.get('worlds').toJS());

            return React.createElement(
                'div',
                { className: 'RegionWorlds' },
                React.createElement(
                    'h2',
                    null,
                    props.region.get('label'),
                    ' Worlds'
                ),
                React.createElement(
                    'ul',
                    { className: 'list-unstyled' },
                    props.worlds.map(function (world) {
                        return React.createElement(World, {
                            key: world.get('id'),
                            world: world
                        });
                    })
                )
            );
        }
    }]);

    return Worlds;
})(React.Component);

/*
*
* Export Module
*
*/

Worlds.propTypes = propTypes;
module.exports = Worlds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./World":111}],113:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
*   Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*   Data
*/

var DAO = require('./../lib/data/overview');

/*
*   React Components
*/

var Matches = require('./Matches');
var Worlds = require('./Worlds');

/*
*
*   Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var _ref = React.createElement('hr', null);

var Overview = (function (_React$Component) {

    /*
    *
    *     React Lifecycle
    *
    */

    function Overview(props) {
        _classCallCheck(this, Overview);

        _get(Object.getPrototypeOf(Overview.prototype), 'constructor', this).call(this, props);

        this.dao = new DAO({
            onMatchData: this.onMatchData.bind(this) });

        this.state = {
            regions: Immutable.fromJS({
                1: { label: 'NA', id: '1' },
                2: { label: 'EU', id: '2' } }),
            matchesByRegion: Immutable.fromJS({ 1: {}, 2: {} }),
            worldsByRegion: this.dao.getWorldsByRegion(props.lang) };
    }

    _inherits(Overview, _React$Component);

    _createClass(Overview, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var newMatchData = !Immutable.is(this.state.matchesByRegion, nextState.matchesByRegion);
            var shouldUpdate = newLang || newMatchData;

            // console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

            return shouldUpdate;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            setPageTitle(this.props.lang);
            // setWorlds.call(this, this.props.lang);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.dao.init(this.props.lang);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!Immutable.is(nextProps.lang, this.props.lang)) {
                var worldsByRegion = this.dao.getWorldsByRegion(nextProps.lang);
                this.setState({ worldsByRegion: worldsByRegion });

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
            var _this = this;

            return React.createElement(
                'div',
                { id: 'overview' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    this.state.regions.map(function (region, regionId) {
                        return React.createElement(
                            'div',
                            { className: 'col-sm-12', key: regionId },
                            React.createElement(Matches, {
                                region: region,
                                matches: _this.state.matchesByRegion.get(regionId),
                                worlds: _this.state.worldsByRegion.get(regionId)
                            })
                        );
                    })
                ),
                _ref,
                React.createElement(
                    'div',
                    { className: 'row' },
                    this.state.regions.map(function (region, regionId) {
                        return React.createElement(
                            'div',
                            { className: 'col-sm-12', key: regionId },
                            React.createElement(Worlds, {
                                region: region,
                                worlds: _this.state.worldsByRegion.get(regionId)
                            })
                        );
                    })
                )
            );
        }
    }, {
        key: 'onMatchData',

        /*
        *
        *   Data Listeners
        *
        */

        value: function onMatchData(matchData) {
            var newMatchesByRegion = this.dao.getMatchesByRegion(matchData);

            this.setState(function (state) {
                return {
                    matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion) };
            });
        }
    }]);

    return Overview;
})(React.Component);

/*
*
*   Direct DOM Manipulation
*
*/

function setPageTitle(lang) {
    var title = ['gw2w2w.com'];

    if (lang.get('slug') !== 'en') {
        title.push(lang.get('name'));
    }

    $('title').text(title.join(' - '));
}

/*
*
*   Export Module
*
*/

Overview.propTypes = propTypes;
module.exports = Overview;
// Immutable.fromJS({'1': {}, '2': {}})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/data/overview":146,"./Matches":110,"./Worlds":112}],114:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Objective = require('../Objectives');

/*
* Component Globals
*/

var objectiveCols = {
    elapsed: true,
    timestamp: true,
    mapAbbrev: true,
    arrow: true,
    sprite: true,
    name: true,
    eventType: false,
    guildName: false,
    guildTag: false,
    timer: false };

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guild: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var GuildClaims = (function (_React$Component) {
    function GuildClaims() {
        _classCallCheck(this, GuildClaims);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(GuildClaims, _React$Component);

    _createClass(GuildClaims, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var newClaims = !Immutable.is(this.props.guild.get('claims'), nextProps.guild.get('claims'));

            var shouldUpdate = newLang || newClaims;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var guildId = this.props.guild.get('guild_id');
            var claims = this.props.guild.get('claims');

            return React.createElement(
                'ul',
                { className: 'list-unstyled' },
                claims.map(function (entry) {
                    return React.createElement(
                        'li',
                        { key: entry.get('id') },
                        React.createElement(Objective, {
                            cols: objectiveCols,

                            lang: _this.props.lang,
                            guildId: guildId,
                            guild: _this.props.guild,

                            objectiveId: entry.get('objectiveId'),
                            worldColor: entry.get('world'),
                            timestamp: entry.get('timestamp')
                        })
                    );
                })
            );
        }
    }]);

    return GuildClaims;
})(React.Component);

/*
*
* Export Module
*
*/

GuildClaims.propTypes = propTypes;
module.exports = GuildClaims;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Objectives":133}],115:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Emblem = require('./../../common/Icons/Emblem');
var Claims = require('./Claims');

/*
* Component Globals
*/

var loadingHtml = React.createElement(
    'h1',
    { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
    React.createElement('i', { className: 'fa fa-spinner fa-spin' }),
    ' Loading...'
);

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guild: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var _ref = React.createElement('br', null);

var Guild = (function (_React$Component) {
    function Guild() {
        _classCallCheck(this, Guild);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Guild, _React$Component);

    _createClass(Guild, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

            var shouldUpdate = newLang || newGuildData;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var dataReady = this.props.guild.get('loaded');

            var guildId = this.props.guild.get('guild_id');
            var guildName = this.props.guild.get('guild_name');
            var guildTag = this.props.guild.get('tag');
            var guildClaims = this.props.guild.get('claims');

            var guildLink = guildName ? 'http://guilds.gw2w2w.com/guilds/' + slugify(guildName) : 'http://guilds.gw2w2w.com/' + guildId;

            // console.log('Guild::render()', guildId, guildName);

            return React.createElement(
                'div',
                { className: 'guild', id: guildId },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-4' },
                        React.createElement(
                            'a',
                            { href: guildLink, target: '_blank' },
                            React.createElement(Emblem, { key: guildId, guildName: guildName, size: 256 })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-20' },
                        dataReady ? React.createElement(
                            'h1',
                            null,
                            React.createElement(
                                'a',
                                { href: guildLink, target: '_blank' },
                                guildName,
                                ' [',
                                guildTag,
                                ']'
                            )
                        ) : React.createElement(
                            'div',
                            null,
                            loadingHtml,
                            _ref,
                            guildId
                        ),
                        !guildClaims.isEmpty() ? React.createElement(Claims, this.props) : null
                    )
                )
            );
        }
    }]);

    return Guild;
})(React.Component);

/*
*
* Private Methods
*
*/

function slugify(str) {
    return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}

/*
*
* Export Module
*
*/

Guild.propTypes = propTypes;
module.exports = Guild;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Emblem":140,"./Claims":114}],116:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Guild = require('./Guild');

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var _ref = React.createElement(
    'h2',
    { className: 'section-header' },
    'Guild Claims'
);

var Guilds = (function (_React$Component) {
    function Guilds() {
        _classCallCheck(this, Guilds);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Guilds, _React$Component);

    _createClass(Guilds, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var newGuildData = !Immutable.is(this.props.guilds, nextProps.guilds);

            var shouldUpdate = newLang || newGuildData;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('Guilds::render()');
            // console.log('props.guilds', props.guilds.toObject());

            var sortedGuilds = props.guilds.toSeq().sortBy(function (guild) {
                return guild.get('guild_name');
            }).sortBy(function (guild) {
                return -guild.get('lastClaim');
            });

            return React.createElement(
                'section',
                { id: 'guilds' },
                _ref,
                sortedGuilds.map(function (guild) {
                    return React.createElement(Guild, {
                        key: guild.get('guild_id'),
                        lang: props.lang,
                        guild: guild
                    });
                })
            );
        }
    }]);

    return Guilds;
})(React.Component);

/*
*
* Export Module
*
*/

Guilds.propTypes = propTypes;
module.exports = Guilds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Guild":115}],117:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

// const $         = require('jQuery');
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('gw2w2w-static');

/*
* React Components
*/

var Objective = require('../Objectives');

/*
* Component Globals
*/

var captureCols = {
    elapsed: true,
    timestamp: true,
    mapAbbrev: true,
    arrow: true,
    sprite: true,
    name: true,
    eventType: false,
    guildName: false,
    guildTag: false,
    timer: false };

var claimCols = {
    elapsed: true,
    timestamp: true,
    mapAbbrev: true,
    arrow: true,
    sprite: true,
    name: true,
    eventType: false,
    guildName: true,
    guildTag: true,
    timer: false };

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    entry: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guild: React.PropTypes.instanceOf(Immutable.Map),
    mapFilter: React.PropTypes.string.isRequired,
    eventFilter: React.PropTypes.string.isRequired };

var Entry = (function (_React$Component) {
    function Entry() {
        _classCallCheck(this, Entry);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Entry, _React$Component);

    _createClass(Entry, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuild = !Immutable.is(this.props.guild, nextProps.guild);
            var newEntry = !Immutable.is(this.props.entry, nextProps.entry);
            var newData = newGuild || newEntry;

            var newMapFilter = !Immutable.is(this.props.mapFilter, nextProps.mapFilter);
            var newEventFilter = !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
            var newFilters = newMapFilter || newEventFilter;

            var shouldUpdate = newLang || newData || newFilters;

            // console.log('Tracker::Log::Entry::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            // console.log('Entry:render()');
            var eventType = this.props.entry.get('type');
            var cols = eventType === 'claim' ? claimCols : captureCols;
            var oMeta = STATIC.objective_meta[this.props.entry.get('objectiveId')];
            var mapColor = _.find(STATIC.objective_map, function (map) {
                return map.mapIndex === oMeta.map;
            }).color;

            var matchesMapFilter = this.props.mapFilter === 'all' || this.props.mapFilter === mapColor;
            var matchesEventFilter = this.props.eventFilter === 'all' || this.props.eventFilter === eventType;
            var shouldBeVisible = matchesMapFilter && matchesEventFilter;
            var className = shouldBeVisible ? 'show-entry' : 'hide-entry';

            return React.createElement(
                'li',
                { className: className },
                React.createElement(Objective, {
                    lang: this.props.lang,

                    cols: cols,
                    guildId: this.props.guildId,
                    guild: this.props.guild,

                    entryId: this.props.entry.get('id'),
                    objectiveId: this.props.entry.get('objectiveId'),
                    worldColor: this.props.entry.get('world'),
                    timestamp: this.props.entry.get('timestamp'),
                    eventType: this.props.entry.get('type')
                })
            );
        }
    }]);

    return Entry;
})(React.Component);

/*
*
* Export Module
*
*/

Entry.propTypes = propTypes;
module.exports = Entry;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Objectives":133,"gw2w2w-static":106}],118:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

/*
*
* Component Definition
*
*/

var propTypes = {
    eventFilter: React.PropTypes.oneOf(['all', 'capture', 'claim']).isRequired,
    setEvent: React.PropTypes.func.isRequired };

var MapFilters = (function (_React$Component) {
    function MapFilters() {
        _classCallCheck(this, MapFilters);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapFilters, _React$Component);

    _createClass(MapFilters, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.props.eventFilter !== nextProps.eventFilter;
        }
    }, {
        key: 'render',
        value: function render() {
            var linkClaims = React.createElement(
                'a',
                { onClick: this.props.setEvent, 'data-filter': 'claim' },
                'Claims'
            );
            var linkCaptures = React.createElement(
                'a',
                { onClick: this.props.setEvent, 'data-filter': 'capture' },
                'Captures'
            );
            var linkAll = React.createElement(
                'a',
                { onClick: this.props.setEvent, 'data-filter': 'all' },
                'All'
            );

            return React.createElement(
                'ul',
                { id: 'log-event-filters', className: 'nav nav-pills' },
                React.createElement(
                    'li',
                    { className: this.props.eventFilter === 'claim' ? 'active' : null },
                    linkClaims
                ),
                React.createElement(
                    'li',
                    { className: this.props.eventFilter === 'capture' ? 'active' : null },
                    linkCaptures
                ),
                React.createElement(
                    'li',
                    { className: this.props.eventFilter === 'all' ? 'active' : null },
                    linkAll
                )
            );
        }
    }]);

    return MapFilters;
})(React.Component);

/*
*
* Export Module
*
*/

MapFilters.propTypes = propTypes;
module.exports = MapFilters;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],119:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Entry = require('./Entry');

/*
*
* Component Definition
*
*/

var defaultProps = {
    guilds: {} };

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    eventHistory: React.PropTypes.instanceOf(Immutable.List).isRequired,

    triggerNotification: React.PropTypes.bool.isRequired,
    mapFilter: React.PropTypes.string.isRequired,
    eventFilter: React.PropTypes.string.isRequired };

var LogEntries = (function (_React$Component) {
    function LogEntries() {
        _classCallCheck(this, LogEntries);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(LogEntries, _React$Component);

    _createClass(LogEntries, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
            var newEvents = !Immutable.is(this.props.eventHistory, nextProps.eventHistory);
            var newData = newGuilds || newEvents;

            var newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
            var newFilterState = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
            var newOptions = newTriggerState || newFilterState;

            var shouldUpdate = newLang || newData || newOptions;

            // console.log('Tracker::LogEntries::shouldComponentUpdate()', shouldUpdate, newData, newOptions);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('LogEntries::render()', props.mapFilter, props.eventFilter, props.triggerNotification);

            return React.createElement(
                'ul',
                { id: 'log' },
                props.eventHistory.map(function (entry) {
                    var eventType = entry.get('type');
                    var entryId = entry.get('id');

                    var guildId = undefined,
                        guild = undefined;
                    if (eventType === 'claim') {
                        guildId = entry.get('guild');
                        guild = props.guilds.has(guildId) ? props.guilds.get(guildId) : null;
                    }

                    return React.createElement(Entry, {
                        key: entryId,
                        component: 'li',

                        triggerNotification: props.triggerNotification,
                        mapFilter: props.mapFilter,
                        eventFilter: props.eventFilter,

                        lang: props.lang,

                        guildId: guildId,
                        entry: entry,
                        guild: guild
                    });
                })
            );
        }
    }]);

    return LogEntries;
})(React.Component);

/*
*
* Export Module
*
*/

LogEntries.defaultProps = defaultProps;
LogEntries.propTypes = propTypes;
module.exports = LogEntries;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Entry":117}],120:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('gw2w2w-static');

/*
*
* Component Definition
*
*/

var propTypes = {
    mapFilter: React.PropTypes.string.isRequired,
    setWorld: React.PropTypes.func.isRequired };

var MapFilters = (function (_React$Component) {
    function MapFilters() {
        _classCallCheck(this, MapFilters);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapFilters, _React$Component);

    _createClass(MapFilters, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.props.mapFilter !== nextProps.mapFilter;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            return React.createElement(
                'ul',
                { id: 'log-map-filters', className: 'nav nav-pills' },
                React.createElement(
                    'li',
                    { className: props.mapFilter === 'all' ? 'active' : 'null' },
                    React.createElement(
                        'a',
                        { onClick: props.setWorld, 'data-filter': 'all' },
                        'All'
                    )
                ),
                _.map(STATIC.objective_map, function (mapMeta) {
                    return React.createElement(
                        'li',
                        { key: mapMeta.mapIndex, className: props.mapFilter === mapMeta.color ? 'active' : null },
                        React.createElement(
                            'a',
                            { onClick: props.setWorld, 'data-filter': mapMeta.color },
                            mapMeta.abbr
                        )
                    );
                })
            );
        }
    }]);

    return MapFilters;
})(React.Component);

/*
*
* Export Module
*
*/

MapFilters.propTypes = propTypes;
module.exports = MapFilters;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":106}],121:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

// const STATIC       = require('gw2w2w-static');

/*
* React Components
*/

var MapFilters = require('./MapFilters');
var EventFilters = require('./EventFilters');
var LogEntries = require('./LogEntries');

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var Log = (function (_React$Component) {
    function Log(props) {
        _classCallCheck(this, Log);

        _get(Object.getPrototypeOf(Log.prototype), 'constructor', this).call(this, props);

        this.state = {
            mapFilter: 'all',
            eventFilter: 'all',
            triggerNotification: false };
    }

    _inherits(Log, _React$Component);

    _createClass(Log, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
            var newHistory = !Immutable.is(this.props.details.get('history'), nextProps.details.get('history'));
            var newData = newGuilds || newHistory;

            var newMapFilter = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
            var newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);
            var newFilters = newMapFilter || newEventFilter;

            var shouldUpdate = newLang || newData || newFilters;

            // console.log('Tracker::Logs::shouldComponentUpdate()', shouldUpdate, newData, newFilters);

            return shouldUpdate;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ triggerNotification: true });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (!this.state.triggerNotification) {
                this.setState({ triggerNotification: true });
            }
        }
    }, {
        key: 'render',
        value: function render() {

            var eventHistory = this.props.details.get('history');

            return React.createElement(
                'div',
                { id: 'log-container' },
                React.createElement(
                    'div',
                    { className: 'log-tabs' },
                    React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'div',
                            { className: 'col-sm-16' },
                            React.createElement(MapFilters, {
                                mapFilter: this.state.mapFilter,
                                setWorld: setWorld.bind(this)
                            })
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-8' },
                            React.createElement(EventFilters, {
                                eventFilter: this.state.eventFilter,
                                setEvent: setEvent.bind(this)
                            })
                        )
                    )
                ),
                !eventHistory.isEmpty() ? React.createElement(LogEntries, {
                    triggerNotification: this.state.triggerNotification,
                    mapFilter: this.state.mapFilter,
                    eventFilter: this.state.eventFilter,

                    lang: this.props.lang,
                    guilds: this.props.guilds,

                    eventHistory: eventHistory
                }) : null
            );
        }
    }]);

    return Log;
})(React.Component);

/*
*
* Private Methods
*
*/

function setWorld(e) {
    var component = this;

    var filter = e.target.getAttribute('data-filter');

    component.setState({ mapFilter: filter, triggerNotification: true });
}

function setEvent(e) {
    var component = this;

    var filter = e.target.getAttribute('data-filter');

    component.setState({ eventFilter: filter, triggerNotification: true });
}

/*
*
* Export Module
*
*/

Log.propTypes = propTypes;
module.exports = Log;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./EventFilters":118,"./LogEntries":119,"./MapFilters":120}],122:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);

var STATIC = require('./../../lib/static');

/*
* React Components
*/

var MapScores = require('./MapScores');
var MapSection = require('./MapSection');

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var MapDetails = (function (_React$Component) {
    function MapDetails() {
        _classCallCheck(this, MapDetails);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapDetails, _React$Component);

    _createClass(MapDetails, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
            var newDetails = !Immutable.is(this.props.details, nextProps.details);
            var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
            var newData = newGuilds || newDetails || newWorlds;

            var shouldUpdate = newLang || newData;

            // console.log('Tracker::Maps::MapDetails::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var mapMeta = STATIC.objective_map.find(function (mm) {
                return mm.get('key') === _this.props.mapKey;
            });
            var mapIndex = mapMeta.get('mapIndex').toString();
            var mapScores = this.props.details.getIn(['maps', 'scores', mapIndex]);

            // console.log('Tracker::Maps::MapDetails:render()', mapScores.toJS());

            return React.createElement(
                'div',
                { className: 'map' },
                React.createElement(
                    'div',
                    { className: 'mapScores' },
                    React.createElement(
                        'h2',
                        { className: 'team ' + mapMeta.get('color'), onClick: onTitleClick },
                        mapMeta.get('name')
                    ),
                    React.createElement(MapScores, { scores: mapScores })
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    mapMeta.get('sections').map(function (mapSection, ixSection) {

                        return React.createElement(MapSection, _extends({
                            component: 'ul',
                            key: ixSection,
                            mapSection: mapSection,
                            mapMeta: mapMeta

                        }, _this.props));
                    })
                )
            );
        }
    }]);

    return MapDetails;
})(React.Component);

/*
*
* Private Methods
*
*/

function onTitleClick(e) {
    var $maps = $('.map');
    var $map = $(e.target).closest('.map', $maps);

    var hasFocus = $map.hasClass('map-focus');

    if (!hasFocus) {
        $map.addClass('map-focus').removeClass('map-blur');

        $maps.not($map).removeClass('map-focus').addClass('map-blur');
    } else {
        $maps.removeClass('map-focus').removeClass('map-blur');
    }
}

/*
*
* Export Module
*
*/

MapDetails.propTypes = propTypes;
module.exports = MapDetails;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":150,"./MapScores":123,"./MapSection":124}],123:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
*
* Component Definition
*
*/

var propTypes = {
    scores: React.PropTypes.instanceOf(Immutable.List).isRequired };

var MapScores = (function (_React$Component) {
    function MapScores() {
        _classCallCheck(this, MapScores);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapScores, _React$Component);

    _createClass(MapScores, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newScores = !Immutable.is(this.props.scores, nextProps.scores);
            var shouldUpdate = newScores;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'ul',
                { className: 'list-inline' },
                this.props.scores.map(function (score, ixScore) {
                    var formatted = numeral(score).format('0,0');
                    var team = ['red', 'blue', 'green'][ixScore];

                    return React.createElement(
                        'li',
                        { key: team, className: 'team ' + team },
                        formatted
                    );
                })
            );
        }
    }]);

    return MapScores;
})(React.Component);

/*
*
* Export Module
*
*/

MapScores.propTypes = propTypes;
module.exports = MapScores;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],124:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Objective = require('./../Objectives');

/*
*
* Module Globals
*
*/

var objectiveCols = {
    elapsed: false,
    timestamp: false,
    mapAbbrev: false,
    arrow: true,
    sprite: true,
    name: true,
    eventType: false,
    guildName: false,
    guildTag: true,
    timer: true };

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    mapSection: React.PropTypes.object.isRequired };

var MapSection = (function (_React$Component) {
    function MapSection() {
        _classCallCheck(this, MapSection);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapSection, _React$Component);

    _createClass(MapSection, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
            var newDetails = !Immutable.is(this.props.details, nextProps.details);
            var newData = newGuilds || newDetails;

            var shouldUpdate = newLang || newData;

            // console.log('Tracker::Maps::MapSection::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var mapObjectives = this.props.mapSection.get('objectives');
            var owners = this.props.details.getIn(['objectives', 'owners']);
            var claimers = this.props.details.getIn(['objectives', 'claimers']);
            var sectionClass = getSectionClass(this.props.mapMeta.get('key'), this.props.mapSection.get('label'));

            return React.createElement(
                'ul',
                { className: 'list-unstyled ' + sectionClass },
                mapObjectives.map(function (objectiveId) {

                    var stringId = objectiveId.toString();
                    var owner = owners.get(stringId);
                    var claimer = claimers.get(stringId);

                    var guildId = claimer ? claimer.get('guild') : null;
                    var hasClaimer = !!guildId;

                    var hasGuildData = hasClaimer && _this.props.guilds.has(guildId);
                    var guild = hasGuildData ? _this.props.guilds.get(guildId) : null;

                    return React.createElement(
                        'li',
                        { key: objectiveId, id: 'objective-' + objectiveId },
                        React.createElement(Objective, {
                            cols: objectiveCols,
                            lang: _this.props.lang,

                            objectiveId: objectiveId,
                            worldColor: owner.get('world'),
                            timestamp: owner.get('timestamp'),
                            guildId: guildId,
                            guild: guild
                        })
                    );
                })
            );
        }
    }]);

    return MapSection;
})(React.Component);

/*
*
* Private Methods
*
*/

function getSectionClass(mapKey, sectionLabel) {
    var sectionClass = ['col-md-24', 'map-section'];

    if (mapKey === 'Center') {
        if (sectionLabel === 'Castle') {
            sectionClass.push('col-sm-24');
        } else {
            sectionClass.push('col-sm-8');
        }
    } else {
        sectionClass.push('col-sm-8');
    }

    return sectionClass.join(' ');
}

/*
*
* Export Module
*
*/

MapSection.propTypes = propTypes;
module.exports = MapSection;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../Objectives":133}],125:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var MapDetails = require('./MapDetails');
var Log = require('./../Log');

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var Maps = (function (_React$Component) {
    function Maps() {
        _classCallCheck(this, Maps);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Maps, _React$Component);

    _createClass(Maps, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
            var newDetails = !Immutable.is(this.props.details, nextProps.details);
            var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
            var newData = newGuilds || newDetails || newWorlds;

            var shouldUpdate = newLang || newData;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            var isDataInitialized = props.details.get('initialized');

            if (!isDataInitialized) {
                return null;
            }

            return React.createElement(
                'section',
                { id: 'maps' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(MapDetails, _extends({ mapKey: 'Center' }, props))
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-18' },
                        React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                                'div',
                                { className: 'col-md-8' },
                                React.createElement(MapDetails, _extends({ mapKey: 'RedHome' }, props))
                            ),
                            React.createElement(
                                'div',
                                { className: 'col-md-8' },
                                React.createElement(MapDetails, _extends({ mapKey: 'BlueHome' }, props))
                            ),
                            React.createElement(
                                'div',
                                { className: 'col-md-8' },
                                React.createElement(MapDetails, _extends({ mapKey: 'GreenHome' }, props))
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                                'div',
                                { className: 'col-md-24' },
                                React.createElement(Log, props)
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Maps;
})(React.Component);

/*
*
* Export Module
*
*/

Maps.propTypes = propTypes;
module.exports = Maps;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../Log":121,"./MapDetails":122}],126:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var Emblem = require('./../../common/Icons/Emblem');

/*
*
* Component Definition
*
*/

var propTypes = {
    showName: React.PropTypes.bool.isRequired,
    showTag: React.PropTypes.bool.isRequired,
    guildId: React.PropTypes.string,
    guild: React.PropTypes.instanceOf(Immutable.Map) };

var _ref = React.createElement('i', { className: 'fa fa-spinner fa-spin' });

var Guild = (function (_React$Component) {
    function Guild() {
        _classCallCheck(this, Guild);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Guild, _React$Component);

    _createClass(Guild, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newGuild = !Immutable.is(this.props.guildId, nextProps.guildId);
            var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
            var shouldUpdate = newGuild || newGuildData;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            var hasGuild = !!this.props.guildId;
            var isEnabled = hasGuild && (this.props.showName || this.props.showTag);

            if (!isEnabled) {
                return null;
            } else {
                var hasGuildData = props.guild && props.guild.get('loaded');

                var guildId = props.guildId;
                var href = '#' + guildId;

                var content = _ref;
                var title = null;

                if (hasGuildData) {
                    var _name = props.guild.get('guild_name');
                    var tag = props.guild.get('tag');

                    if (props.showName && props.showTag) {
                        content = React.createElement(
                            'span',
                            null,
                            '' + _name + ' [' + tag + '] ',
                            React.createElement(Emblem, { guildName: _name, size: 20 })
                        );
                    } else if (props.showName) {
                        content = '' + _name;
                    } else {
                        content = '' + tag;
                    }

                    title = '' + _name + ' [' + tag + ']';
                }

                return React.createElement(
                    'a',
                    { className: 'guildname', href: href, title: title },
                    content
                );
            }
        }
    }]);

    return Guild;
})(React.Component);

/*
*
* Export Module
*
*/

Guild.propTypes = propTypes;
module.exports = Guild;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Emblem":140}],127:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('./../../lib/static');

/*
* React Components
*/

var Sprite = require('./../../common/Icons/Sprite');
var Arrow = require('./../../common/Icons/Arrow');

/*
*
* Component Definition
*
*/

var propTypes = {
    showArrow: React.PropTypes.bool.isRequired,
    showSprite: React.PropTypes.bool.isRequired,
    objectiveId: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired };

var Icons = (function (_React$Component) {
    function Icons() {
        _classCallCheck(this, Icons);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Icons, _React$Component);

    _createClass(Icons, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newColor = !Immutable.is(this.props.color, nextProps.color);
            var shouldUpdate = newColor;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.showArrow && !this.props.showSprite) {
                return null;
            } else {
                var oMeta = STATIC.objective_meta.get(this.props.objectiveId);
                var oTypeId = oMeta.get('type').toString();
                var oType = STATIC.objective_types.get(oTypeId);

                return React.createElement(
                    'div',
                    { className: 'objective-icons' },
                    this.props.showArrow ? React.createElement(Arrow, { oMeta: oMeta }) : null,
                    this.props.showSprite ? React.createElement(Sprite, {
                        type: oType.get('name'),
                        color: this.props.color
                    }) : null
                );
            }
        }
    }]);

    return Icons;
})(React.Component);

/*
*
* Export Module
*
*/

Icons.propTypes = propTypes;
module.exports = Icons;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Arrow":139,"./../../common/Icons/Sprite":142,"./../../lib/static":150}],128:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var STATIC = require('./../../lib/static');

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    isEnabled: React.PropTypes.bool.isRequired,
    objectiveId: React.PropTypes.string.isRequired };

var Label = (function (_React$Component) {
    function Label() {
        _classCallCheck(this, Label);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Label, _React$Component);

    _createClass(Label, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var shouldUpdate = newLang;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.isEnabled) {
                return null;
            } else {
                var oLabel = STATIC.objective_labels.get(this.props.objectiveId);
                var langSlug = this.props.lang.get('slug');

                return React.createElement(
                    'div',
                    { className: 'objective-label' },
                    React.createElement(
                        'span',
                        null,
                        oLabel.get(langSlug)
                    )
                );
            }
        }
    }]);

    return Label;
})(React.Component);

/*
*
* Export Module
*
*/

Label.propTypes = propTypes;
module.exports = Label;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":150}],129:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var STATIC = require('./../../lib/static');

/*
*
* Component Definition
*
*/

var propTypes = {
    isEnabled: React.PropTypes.bool.isRequired,
    objectiveId: React.PropTypes.string.isRequired };

var MapName = (function (_React$Component) {
    function MapName() {
        _classCallCheck(this, MapName);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapName, _React$Component);

    _createClass(MapName, [{
        key: 'shouldComponentUpdate',

        // map name can never change, not localized
        value: function shouldComponentUpdate() {
            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            if (!this.props.isEnabled) {
                return null;
            } else {
                var _ret = (function () {
                    var oMeta = STATIC.objective_meta.get(_this.props.objectiveId);
                    var mapIndex = oMeta.get('map');
                    var mapMeta = STATIC.objective_map.find(function (mm) {
                        return mm.get('mapIndex') === mapIndex;
                    });

                    return {
                        v: React.createElement(
                            'div',
                            { className: 'objective-map' },
                            React.createElement(
                                'span',
                                { title: mapMeta.get('name') },
                                mapMeta.get('abbr')
                            )
                        )
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    }]);

    return MapName;
})(React.Component);

/*
*
* Export Module
*
*/

MapName.propTypes = propTypes;
module.exports = MapName;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":150}],130:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
*   THE CONTENT OF COMPONENT IS MANAGED EXTERNALLY
*   lib.trackerTimers IS INITIALIZED IN Tracker.componentDidMount();
*
*/

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

// const spinner   =  <i className='fa fa-spinner fa-spin'></i>;

/*
*
* Component Definition
*
*/

var propTypes = {
    isEnabled: React.PropTypes.bool.isRequired,
    timestamp: React.PropTypes.number.isRequired };

var TimerCountdown = (function (_React$Component) {
    function TimerCountdown() {
        _classCallCheck(this, TimerCountdown);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(TimerCountdown, _React$Component);

    _createClass(TimerCountdown, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newIsEnabled = !Immutable.is(this.props.isEnabled, nextProps.isEnabled);
            var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
            var shouldUpdate = newIsEnabled || newTimestamp;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.isEnabled) {
                return null;
            } else {
                return React.createElement('span', {
                    className: 'timer countdown inactive',
                    'data-timestamp': this.props.timestamp
                });
            }
        }
    }]);

    return TimerCountdown;
})(React.Component);

/*
*
* Export Module
*
*/

TimerCountdown.propTypes = propTypes;
module.exports = TimerCountdown;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],131:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
*   THE CONTENT OF COMPONENT IS MANAGED EXTERNALLY
*   lib.trackerTimers IS INITIALIZED IN Tracker.componentDidMount();
*
*/

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var spinner = React.createElement('i', { className: 'fa fa-spinner fa-spin' });

/*
*
* Component Definition
*
*/

var propTypes = {
    isEnabled: React.PropTypes.bool.isRequired,
    timestamp: React.PropTypes.number.isRequired };

var TimerRelative = (function (_React$Component) {
    function TimerRelative() {
        _classCallCheck(this, TimerRelative);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(TimerRelative, _React$Component);

    _createClass(TimerRelative, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
            var shouldUpdate = newTimestamp;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.isEnabled) {
                return null;
            } else {
                return React.createElement(
                    'div',
                    { className: 'objective-relative' },
                    React.createElement(
                        'span',
                        {
                            className: 'timer relative',
                            'data-timestamp': this.props.timestamp
                        },
                        spinner
                    )
                );
            }
        }
    }]);

    return TimerRelative;
})(React.Component);

/*
*
* Export Module
*
*/

TimerRelative.propTypes = propTypes;
module.exports = TimerRelative;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],132:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

/*
*
* Component Definition
*
*/

var propTypes = {
    isEnabled: React.PropTypes.bool.isRequired,
    timestamp: React.PropTypes.number.isRequired };

var Timestamp = (function (_React$Component) {
    function Timestamp() {
        _classCallCheck(this, Timestamp);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Timestamp, _React$Component);

    _createClass(Timestamp, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
            var shouldUpdate = newTimestamp;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.isEnabled) {
                return null;
            } else {
                return React.createElement(
                    'div',
                    { className: 'objective-timestamp' },
                    moment(this.props.timestamp * 1000).format('hh:mm:ss')
                );
            }
        }
    }]);

    return Timestamp;
})(React.Component);

/*
*
* Export Module
*
*/

Timestamp.propTypes = propTypes;
module.exports = Timestamp;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],133:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('./../../lib/static');

/*
* React Components
*/

var TimerRelative = require('./TimerRelative');
var Timestamp = require('./Timestamp');
var MapName = require('./MapName');
var Icons = require('./Icons');
var Label = require('./Label');
var Guild = require('./Guild');
var TimerCountdown = require('./TimerCountdown');

/*
*
* Module Globals
*
*/

var colDefaults = {
    elapsed: false,
    timestamp: false,
    mapAbbrev: false,
    arrow: false,
    sprite: false,
    name: false,
    eventType: false,
    guildName: false,
    guildTag: false,
    timer: false };

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    objectiveId: React.PropTypes.number.isRequired,
    worldColor: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.number.isRequired,
    eventType: React.PropTypes.string,

    guildId: React.PropTypes.string,
    guild: React.PropTypes.instanceOf(Immutable.Map),

    cols: React.PropTypes.object };

var Objective = (function (_React$Component) {
    function Objective() {
        _classCallCheck(this, Objective);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Objective, _React$Component);

    _createClass(Objective, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var newCapture = !Immutable.is(this.props.timestamp, nextProps.timestamp);
            var newOwner = !Immutable.is(this.props.worldColor, nextProps.worldColor);
            var newClaimer = !Immutable.is(this.props.guildId, nextProps.guildId);
            var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
            var newData = newCapture || newOwner || newClaimer || newGuildData;

            var shouldUpdate = newLang || newData;

            // console.log('Tracker::Objectives::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;
            // console.log('Objective:render()', this.props.objectiveId);

            var objectiveId = this.props.objectiveId.toString();
            var oMeta = STATIC.objective_meta.get(objectiveId);

            // short circuit
            if (oMeta.isEmpty()) {
                return null;
            }

            var cols = _.defaults(this.props.cols, colDefaults);

            return React.createElement(
                'div',
                { className: 'objective team ' + this.props.worldColor },
                React.createElement(TimerRelative, {
                    isEnabled: !!cols.elapsed,
                    timestamp: props.timestamp
                }),
                React.createElement(Timestamp, {
                    isEnabled: !!cols.timestamp,
                    timestamp: props.timestamp
                }),
                React.createElement(MapName, {
                    isEnabled: !!cols.mapAbbrev,
                    objectiveId: objectiveId
                }),
                React.createElement(Icons, {
                    showArrow: !!cols.arrow,
                    showSprite: !!cols.sprite,
                    objectiveId: objectiveId,
                    color: this.props.worldColor
                }),
                React.createElement(Label, {
                    isEnabled: !!cols.name,
                    objectiveId: objectiveId,
                    lang: this.props.lang
                }),
                React.createElement(
                    'div',
                    { className: 'objective-state' },
                    React.createElement(Guild, {
                        showName: !!cols.guildName,
                        showTag: !!cols.guildTag,
                        guildId: this.props.guildId,
                        guild: this.props.guild
                    }),
                    React.createElement(TimerCountdown, {
                        isEnabled: !!cols.timer,
                        timestamp: props.timestamp
                    })
                )
            );
        }
    }]);

    return Objective;
})(React.Component);

/*
*
* Export Module
*
*/

Objective.propTypes = propTypes;
module.exports = Objective;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":150,"./Guild":126,"./Icons":127,"./Label":128,"./MapName":129,"./TimerCountdown":130,"./TimerRelative":131,"./Timestamp":132}],134:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var STATIC = require('./../../../lib/static');

/*
* React Components
*/

var Sprite = require('./../../../common/Icons/Sprite');

/*
*
* Component Definition
*
*/

var propTypes = {
    color: React.PropTypes.string.isRequired,
    typeQuantity: React.PropTypes.number.isRequired,
    typeId: React.PropTypes.string.isRequired };

var HoldingsItem = (function (_React$Component) {
    function HoldingsItem(props) {
        _classCallCheck(this, HoldingsItem);

        _get(Object.getPrototypeOf(HoldingsItem.prototype), 'constructor', this).call(this, props);

        this.state = {
            oType: STATIC.objective_types.get(props.typeId) };
    }

    _inherits(HoldingsItem, _React$Component);

    _createClass(HoldingsItem, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newQuantity = this.props.typeQuantity !== nextProps.typeQuantity;
            var newType = this.props.typeId !== nextProps.typeId;
            var newColor = this.props.color !== nextProps.color;
            var shouldUpdate = newQuantity || newType || newColor;

            return shouldUpdate;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var newType = this.props.typeId !== nextProps.typeId;

            if (newType) {
                this.setState({ oType: STATIC.objective_types.get(this.props.typeId) });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            // console.log('Tracker::Scoreboard::HoldingsItem:render()', this.state.oType.toJS());

            return React.createElement(
                'li',
                null,
                React.createElement(Sprite, {
                    type: this.state.oType.get('name'),
                    color: this.props.color
                }),
                ' x' + this.props.typeQuantity
            );
        }
    }]);

    return HoldingsItem;
})(React.Component);

/*
*
* Export Module
*
*/

HoldingsItem.propTypes = propTypes;
module.exports = HoldingsItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../../common/Icons/Sprite":142,"./../../../lib/static":150}],135:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var Item = require('./Item');

/*
*
* Component Definition
*
*/

var propTypes = {
    color: React.PropTypes.string.isRequired,
    holdings: React.PropTypes.instanceOf(Immutable.List).isRequired };

var Holdings = (function (_React$Component) {
    function Holdings() {
        _classCallCheck(this, Holdings);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Holdings, _React$Component);

    _createClass(Holdings, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newHoldings = !Immutable.is(this.props.holdings, nextProps.holdings);
            var shouldUpdate = newHoldings;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            return React.createElement(
                'ul',
                { className: 'list-inline' },
                this.props.holdings.map(function (typeQuantity, typeIndex) {
                    return React.createElement(Item, {
                        key: typeIndex,
                        color: _this.props.color,
                        typeQuantity: typeQuantity,
                        typeId: (typeIndex + 1).toString()
                    });
                })
            );
        }
    }]);

    return Holdings;
})(React.Component);

/*
*
* Export Module
*
*/

Holdings.propTypes = propTypes;
module.exports = Holdings;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Item":134}],136:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
* React Components
*/

var Holdings = require('./Holdings');

/*
* Component Globals
*/

var loadingHtml = React.createElement(
    'h1',
    { style: { height: '90px', fontSize: '32pt', lineHeight: '90px' } },
    React.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

/*
*
* Component Definition
*
*/

var propTypes = {
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    score: React.PropTypes.number.isRequired,
    tick: React.PropTypes.number.isRequired,
    holdings: React.PropTypes.instanceOf(Immutable.List).isRequired };

var World = (function (_React$Component) {
    function World() {
        _classCallCheck(this, World);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(World, _React$Component);

    _createClass(World, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newWorld = !Immutable.is(this.props.world, nextProps.world);
            var newScore = this.props.score !== nextProps.score;
            var newTick = this.props.tick !== nextProps.tick;
            var newHoldings = this.props.holdings !== nextProps.holdings;
            var shouldUpdate = newWorld || newScore || newTick || newHoldings;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'col-sm-8' },
                React.createElement(
                    'div',
                    { className: 'scoreboard team-bg team text-center ' + this.props.world.get('color') },
                    this.props.world && Immutable.Map.isMap(this.props.world) ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h1',
                            null,
                            React.createElement(
                                'a',
                                { href: this.props.world.get('link') },
                                this.props.world.get('name')
                            )
                        ),
                        React.createElement(
                            'h2',
                            null,
                            numeral(this.props.score).format('0,0'),
                            ' ',
                            numeral(this.props.tick).format('+0,0')
                        ),
                        React.createElement(Holdings, {
                            color: this.props.world.get('color'),
                            holdings: this.props.holdings
                        })
                    ) : loadingHtml
                )
            );
        }
    }]);

    return World;
})(React.Component);

/*
*
* Export Module
*
*/

World.propTypes = propTypes;
module.exports = World;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Holdings":135}],137:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
* React Components
*/

var World = require('./World');

/*
*
* Component Definition
*
*/

var propTypes = {
    matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    match: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var Scoreboard = (function (_React$Component) {
    function Scoreboard() {
        _classCallCheck(this, Scoreboard);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Scoreboard, _React$Component);

    _createClass(Scoreboard, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
            var newScores = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
            var shouldUpdate = newWorlds || newScores;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var scores = this.props.match.get('scores');
            var ticks = this.props.match.get('ticks');
            var holdings = this.props.match.get('holdings');

            return React.createElement(
                'section',
                { className: 'row', id: 'scoreboards' },
                this.props.matchWorlds.map(function (world, ixWorld) {
                    return React.createElement(World, {
                        key: ixWorld,
                        world: world,
                        score: scores.get(ixWorld) || 0,
                        tick: ticks.get(ixWorld) || 0,
                        holdings: holdings.get(ixWorld)
                    });
                })
            );
        }
    }]);

    return Scoreboard;
})(React.Component);

/*
*
* Export Module
*
*/

Scoreboard.propTypes = propTypes;
module.exports = Scoreboard;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./World":136}],138:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

/*
*   libs
*/

var libDate = require('./../lib/date');
var trackerTimers = require('./../lib/trackerTimers');

/*
*   Data
*/

var DAO = require('./../lib/data/tracker');

/*
* React Components
*/

var Scoreboard = require('./Scoreboard');
var Maps = require('./Maps');
var Guilds = require('./Guilds');

/*
* Globals
*/

var updateTimeInterval = 1000;

/*
*
* Component Export
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var Tracker = (function (_React$Component) {

    /*
    *
    *     React Lifecycle
    *
    */

    function Tracker(props) {
        _classCallCheck(this, Tracker);

        _get(Object.getPrototypeOf(Tracker.prototype), 'constructor', this).call(this, props);

        this.__mounted = false;
        this.__timeouts = {};
        this.__intervals = {};

        var dataListeners = {
            onMatchDetails: this.onMatchDetails.bind(this),
            onGuildDetails: this.onGuildDetails.bind(this) };
        this.dao = new DAO(dataListeners);

        this.state = {
            hasData: false,
            lastmod: 0,

            time: {
                local: libDate.dateNow(),
                remote: 0,
                offset: 0 },

            match: Immutable.Map({ lastmod: 0 }),
            matchWorlds: Immutable.List(),
            details: Immutable.Map(),
            claimEvents: Immutable.List(),
            guilds: Immutable.Map() };
    }

    _inherits(Tracker, _React$Component);

    _createClass(Tracker, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);

            var initialData = !Immutable.is(this.state.hasData, nextState.hasData);
            var newMatchData = !Immutable.is(this.state.lastmod, nextState.lastmod);
            var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
            var newData = initialData || newMatchData || newGuildData;

            var shouldUpdate = newLang || newData;

            return shouldUpdate;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log('Tracker::componentDidMount()');
            this.__mounted = true;

            this.dao.init(this.props.lang, this.props.world);

            setPageTitle(this.props.lang, this.props.world);

            // this.updateTimers(() => setInterval(this.updateTimers.bind(this), 1000));
            this.updateTimers.call(this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.log('Tracker::componentWillUnmount()');

            this.__mounted = false;
            this.__timeouts = _.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _.map(this.__intervals, function (i) {
                return clearInterval(i);
            });

            this.dao.close();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // console.log('componentWillReceiveProps()', newLang);
            setPageTitle(this.props.lang, this.props.world);

            this.setState({
                matchWorlds: this.dao.getMatchWorlds(nextProps.lang, this.state.match) });
        }
    }, {
        key: 'render',

        // componentWillUpdate() {
        //  console.log('Tracker::componentWillUpdate()');
        // }

        value: function render() {
            // console.log('Tracker::render()');

            if (!this.state.hasData) {
                return null;
            }

            return React.createElement(
                'div',
                { id: 'tracker' },
                React.createElement(Scoreboard, {
                    matchWorlds: this.state.matchWorlds,
                    match: this.state.match
                }),
                React.createElement(Maps, {
                    lang: this.props.lang,

                    time: this.state.time,
                    details: this.state.details,
                    matchWorlds: this.state.matchWorlds,
                    guilds: this.state.guilds
                }),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-24' },
                        !this.state.guilds.isEmpty() ? React.createElement(Guilds, {
                            lang: this.props.lang,

                            time: this.state.time,
                            guilds: this.state.guilds,
                            claimEvents: this.state.claimEvents
                        }) : null
                    )
                )
            );
        }
    }, {
        key: 'updateTimers',

        /*
        *
        *   Data Listeners
        *
        */

        value: function updateTimers() {
            var cb = arguments[0] === undefined ? _.noop : arguments[0];

            if (this.__mounted) {
                trackerTimers.update(this.state.time.offset, cb);
                this.__timeouts.updateTimers = setTimeout(this.updateTimers.bind(this), updateTimeInterval);
            }
        }
    }, {
        key: 'onMatchDetails',
        value: function onMatchDetails(timeRemote, matchData, detailsData) {
            var _this = this;

            var lastmod = matchData.get('lastmod');
            var isModified = lastmod !== this.state.match.get('lastmod');

            if (isModified) {
                (function () {
                    var claimEvents = _this.dao.guilds.getEventsByType(detailsData, 'claim');

                    var timeLocal = Date.now();
                    var remoteOffset = timeLocal - timeRemote;
                    var timeOffset = _this.state.time.offset ? (remoteOffset + _this.state.time.offset) / 2 // average with previous offset
                    : remoteOffset;

                    var time = {
                        local: timeLocal,
                        offset: Math.round(timeOffset),
                        remote: timeRemote };

                    // use transactional setState
                    _this.setState(function (state) {
                        return {
                            hasData: true,

                            lastmod: lastmod,
                            time: time,
                            claimEvents: claimEvents,

                            match: state.match.mergeDeep(matchData),
                            details: state.details.mergeDeep(detailsData) };
                    });

                    _this.dao.guilds.lookup(_this.state.guilds, detailsData, _this.onGuildDetails.bind(_this));

                    if (_this.state.matchWorlds.isEmpty()) {
                        _this.setState({
                            matchWorlds: _this.dao.getMatchWorlds(_this.props.lang, _this.state.match) });
                    }
                })();
            }
        }
    }, {
        key: 'onGuildDetails',
        value: function onGuildDetails(guild, guildId) {
            var _guildId = guildId || guild.get('guild_id');
            if (!this.state.claimEvents.isEmpty()) {
                guild = this.dao.guilds.attachClaims(this.state.claimEvents, guild);
            }

            this.setState(function (state) {
                return {
                    guilds: state.guilds.mergeIn([_guildId], guild) };
            });
        }
    }]);

    return Tracker;
})(React.Component);

/*
*
* Match Details
*
*/

function setPageTitle(lang, world) {
    var langSlug = lang.get('slug');
    var worldName = world.getIn([langSlug, 'name']);

    var title = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.get('name'));
    }

    $('title').text(title.join(' - '));
}

/*
*
* Export Module
*
*/

Tracker.propTypes = propTypes;
module.exports = Tracker;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/data/tracker":148,"./../lib/date":149,"./../lib/trackerTimers":151,"./Guilds":116,"./Maps":125,"./Scoreboard":137}],139:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
 *
 * Component Definition
 *
 */

var propTypes = {
    oMeta: React.PropTypes.object.isRequired };

var Arrow = (function (_React$Component) {
    function Arrow() {
        _classCallCheck(this, Arrow);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Arrow, _React$Component);

    _createClass(Arrow, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newObjectiveMeta = !Immutable.is(this.props.oMeta, nextProps.oMeta);
            var shouldUpdate = newObjectiveMeta;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var imgSrc = getArrowSrc(this.props.oMeta);

            return React.createElement(
                'span',
                { className: 'direction' },
                imgSrc ? React.createElement('img', { src: imgSrc }) : null
            );
        }
    }]);

    return Arrow;
})(React.Component);

/*
 *
 * Private Methods
 *
 */

function getArrowSrc(meta) {
    if (!meta.get('d')) {
        return null;
    }

    var src = ['/img/icons/dist/arrow'];

    if (meta.get('n')) {
        src.push('north');
    } else if (meta.get('s')) {
        src.push('south');
    }

    if (meta.get('w')) {
        src.push('west');
    } else if (meta.get('e')) {
        src.push('east');
    }

    return src.join('-') + '.svg';
}

/*
 *
 * Export Module
 *
 */

Arrow.propTypes = propTypes;
module.exports = Arrow;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],140:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

/*
 *
 * Component Globals
 *
 */

var imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';

/*
 *
 * Component Definition
 *
 */

var propTypes = {
    size: React.PropTypes.number.isRequired,
    guildName: React.PropTypes.string };

var defaultProps = {
    size: 256,
    guildName: undefined };

var Emblem = (function (_React$Component) {
    function Emblem() {
        _classCallCheck(this, Emblem);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Emblem, _React$Component);

    _createClass(Emblem, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newName = this.props.guildName !== nextProps.guildName; // changes when defined
            var newSize = this.props.size !== nextProps.size;
            var shouldUpdate = newSize || newName;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var emblemSrc = getEmblemSrc(this.props.guildName);

            // console.log('emblem', this.props.guildName, emblemSrc);

            return React.createElement('img', {
                className: 'emblem',
                src: emblemSrc,
                width: this.props.size,
                height: this.props.size,
                onError: imgOnError
            });
        }
    }]);

    return Emblem;
})(React.Component);

/*
 *
 * Private Methods
 *
 */

function getEmblemSrc(guildName) {
    return guildName ? 'http://guilds.gw2w2w.com/guilds/' + slugify(guildName) + '/256.svg' : imgPlaceholder;
}

function slugify(str) {
    return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}

function imgOnError(e) {
    var currentSrc = $(e.target).attr('src');

    if (currentSrc !== imgPlaceholder) {
        $(e.target).attr('src', imgPlaceholder);
    }
}

/*
 *
 * Export Module
 *
 */

Emblem.propTypes = propTypes;
Emblem.defaultProps = defaultProps;

module.exports = Emblem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],141:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
 * Component Globals
 */

var INSTANCE = {
    size: 60,
    stroke: 2 };

/*
 *
 * Component Definition
 *
 */

var propTypes = {
    scores: React.PropTypes.instanceOf(Immutable.List).isRequired };

var Pie = (function (_React$Component) {
    function Pie() {
        _classCallCheck(this, Pie);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Pie, _React$Component);

    _createClass(Pie, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return !Immutable.is(this.props.scores, nextProps.scores);
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            // console.log('Pie::render', props.scores.toArray());

            return React.createElement('img', {
                width: INSTANCE.size,
                height: INSTANCE.size,
                src: getImageSource(props.scores.toArray())
            });
        }
    }]);

    return Pie;
})(React.Component);

/*
 *
 * Private Methods
 *
 */

function getImageSource(scores) {
    return 'http://www.piely.net/' + INSTANCE.size + '/' + scores.join(',') + '?strokeWidth=' + INSTANCE.stroke;
}

/*
 *
 * Export Module
 *
 */

Pie.propTypes = propTypes;
module.exports = Pie;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],142:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

/*
 *
 * Component Definition
 *
 */

var propTypes = {
    type: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired };

var Sprite = (function (_React$Component) {
    function Sprite() {
        _classCallCheck(this, Sprite);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Sprite, _React$Component);

    _createClass(Sprite, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var newType = this.props.type !== nextProps.type;
            var newColor = this.props.color !== nextProps.color;
            var shouldUpdate = newType || newColor;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('span', { className: 'sprite ' + this.props.type + ' ' + this.props.color });
        }
    }]);

    return Sprite;
})(React.Component);

/*
 *
 * Export Module
 *
 */

Sprite.propTypes = propTypes;
module.exports = Sprite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],143:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
 *
 * Exported Component
 *
 */

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    world: React.PropTypes.instanceOf(Immutable.Map),
    linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var LangLink = (function (_React$Component) {
    function LangLink() {
        _classCallCheck(this, LangLink);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(LangLink, _React$Component);

    _createClass(LangLink, [{
        key: 'render',
        value: function render() {
            var isActive = Immutable.is(this.props.lang, this.props.linkLang);
            var listClass = isActive ? 'active' : '';

            var title = this.props.linkLang.get('name');
            var label = this.props.linkLang.get('label');
            var link = getLink(this.props.linkLang, this.props.world);

            return React.createElement(
                'li',
                { className: listClass, title: title },
                React.createElement(
                    'a',
                    { href: link },
                    label
                )
            );
        }
    }]);

    return LangLink;
})(React.Component);

/*
 *
 * Private Methods
 *
 */

function getLink(lang, world) {
    var langSlug = lang.get('slug');

    var link = '/' + langSlug;

    if (world) {
        var worldSlug = world.getIn([langSlug, 'slug']);
        link += '/' + worldSlug;
    }

    return link;
}

/*
 *
 * Export Module
 *
 */

LangLink.propTypes = propTypes;
module.exports = LangLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],144:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*
 *
 * Dependencies
 *
 */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('./../../lib/static');

var LangLink = require('./LangLink');

/*
 *
 * Exported Component
 *
 */

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    world: React.PropTypes.instanceOf(Immutable.Map) };

var Langs = (function (_React$Component) {
    function Langs() {
        _classCallCheck(this, Langs);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Langs, _React$Component);

    _createClass(Langs, [{
        key: 'render',
        value: function render() {
            var _this = this;

            // console.log('Langs::render()', this.props.lang.toJS());

            return React.createElement(
                'ul',
                { className: 'nav navbar-nav' },
                STATIC.langs.map(function (linkLang, key) {
                    return React.createElement(LangLink, {
                        key: key,
                        linkLang: linkLang,
                        lang: _this.props.lang,
                        world: _this.props.world
                    });
                })
            );
        }
    }]);

    return Langs;
})(React.Component);

/*
 *
 * Export Module
 *
 */

Langs.propTypes = propTypes;
module.exports = Langs;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":150,"./LangLink":143}],145:[function(require,module,exports){
'use strict';

var gw2api = require('gw2api');

module.exports = {
    getGuildDetails: getGuildDetails,
    getMatches: getMatches,
    getMatchDetailsByWorld: getMatchDetailsByWorld };

function getMatches(callback) {
    gw2api.getMatchesState(callback);
}

function getGuildDetails(guildId, callback) {
    gw2api.getGuildDetails({
        guild_id: guildId }, callback);
}

// function getMatchDetails(matchId, callback) {
//   gw2api.getMatchDetailsState({match_id: matchId}, callback);
// }

function getMatchDetailsByWorld(worldSlug, callback) {
    // setTimeout(
    //  gw2api.getMatchDetailsState.bind(null, {world_slug: worldSlug}, callback),
    //  3000
    // );
    gw2api.getMatchDetailsState({
        world_slug: worldSlug }, callback);
}

// getMatchDetails    : getMatchDetails,

},{"gw2api":95}],146:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var api = require('./../api');
var STATIC = require('./../static');

var OverviewDataProvider = (function () {
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

            this.__timeouts = _.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _.map(this.__intervals, function (i) {
                return clearInterval(i);
            });
        }
    }, {
        key: 'getWorldsByRegion',
        value: function getWorldsByRegion(lang) {
            return Immutable.Seq(STATIC.worlds).map(function (world) {
                return getWorldByLang(lang, world);
            }).sortBy(function (world) {
                return world.get('name');
            }).groupBy(function (world) {
                return world.get('region');
            });
        }
    }, {
        key: 'getMatchesByRegion',
        value: function getMatchesByRegion(matchData) {
            return Immutable.Seq(matchData).groupBy(function (match) {
                return match.get('region').toString();
            });
        }
    }, {
        key: '__getData',

        /*
        *
        *   Private Methods
        *
        */

        value: function __getData() {
            // console.log('lib::data::overview::__getData()');
            api.getMatches(this.__onMatchData.bind(this));
        }
    }, {
        key: '__setDataTimeout',
        value: function __setDataTimeout() {
            var interval = getInterval();
            // console.log('lib::data::overview::__setDataTimeout()', interval);

            this.__timeouts.matchData = setTimeout(this.__getData.bind(this), interval);
        }
    }, {
        key: '__onMatchData',
        value: function __onMatchData(err, data) {
            // console.log('lib::data::overview::__onMatchData()', data);

            if (!this.__mounted) {
                return;
            }

            var matchData = Immutable.fromJS(data);

            if (!err && matchData && !matchData.isEmpty()) {
                (this.__listeners.onMatchData || _.noop)(matchData);
            }

            this.__setDataTimeout();
        }
    }]);

    return OverviewDataProvider;
})();

/*
 * Data - Worlds
 */

function getWorldByLang(lang, world) {
    var langSlug = lang.get('slug');
    var worldByLang = world.get(langSlug);

    var region = world.get('region');
    var link = getWorldLink(langSlug, worldByLang);

    return worldByLang.merge({
        link: link,
        region: region });
}

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}

function getInterval() {
    return _.random(2000, 4000);
}

module.exports = OverviewDataProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api":145,"./../static":150}],147:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 *
 * Dependencies
 *
 */

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

var api = require('./../../api');

/*
 *
 * Module Globals
 *
 */

var guildDefault = Immutable.Map({
    loaded: false,
    lastClaim: 0,
    claims: Immutable.Map() });

var numQueueConcurrent = 8;

/*
 *
 * Public Methods
 *
 */

var LibGuilds = (function () {
    function LibGuilds() {
        _classCallCheck(this, LibGuilds);

        // this.component = component;

        this.__asyncGuildQueue = async.queue(getGuildDetails, numQueueConcurrent);
    }

    _createClass(LibGuilds, [{
        key: 'getGuildDefault',
        value: function getGuildDefault() {
            return guildDefault;
        }
    }, {
        key: 'getEventsByType',
        value: function getEventsByType(matchDetails, eventType) {
            return matchDetails.get('history').filter(function (entry) {
                return entry.get('type') === eventType;
            });
            // .sortBy(entry => -entry.get('timestamp'));
        }
    }, {
        key: 'getUnknownGuilds',
        value: function getUnknownGuilds(stateGuilds, matchDetails) {
            var claimEvents = this.getEventsByType(matchDetails, 'claim');
            var objectiveClaimers = matchDetails.getIn(['objectives', 'claimers']);

            var knownGuilds = stateGuilds.map(function (entry) {
                return entry.get('guild_id');
            }).toSet();

            var guildsWithCurrentClaims = objectiveClaimers.map(function (entry) {
                return entry.get('guild');
            }).toSet();

            var guildsWithPreviousClaims = claimEvents.map(function (entry) {
                return entry.get('guild');
            }).toSet();

            var guildClaims = guildsWithCurrentClaims.union(guildsWithPreviousClaims);

            var unknownGuilds = guildClaims.subtract(knownGuilds);

            // console.log('guildClaims', guildClaims.toArray());
            // console.log('knownGuilds', knownGuilds.toArray());
            // console.log('unknownGuilds', unknownGuilds.toArray());

            return unknownGuilds;
        }
    }, {
        key: 'lookup',
        value: function lookup(knownGuilds, matchDetails, listener) {
            var _this = this;

            var unknownGuilds = this.getUnknownGuilds(knownGuilds, matchDetails);
            var defaultGuild = this.getGuildDefault();

            unknownGuilds.forEach(function (guildId) {

                // initialize
                var guild = defaultGuild.set('guild_id', guildId);
                listener(guild, guildId);

                // get from remote
                _this.__asyncGuildQueue.push({
                    guildId: guildId,
                    listener: listener });
            });
        }
    }, {
        key: 'attachClaims',
        value: function attachClaims(claimEvents, guild) {
            var guildId = guild.get('guild_id');
            var incClaims = claimEvents.filter(function (entry) {
                return entry.get('guild') === guildId;
            }).toMap();

            var hasClaims = guild.get('claims') && !guild.get('claims').isEmpty();
            var newestClaim = hasClaims ? guild.get('claims').first() : null;
            var incHasClaims = !incClaims.isEmpty();
            var incNewestClaim = incHasClaims ? incClaims.first() : null;

            var hasNewClaims = !Immutable.is(newestClaim, incNewestClaim);

            if (hasNewClaims) {
                var lastClaim = incHasClaims ? incNewestClaim.get('timestamp') : 0;
                // console.log('claims altered', guildId, hasNewClaims, lastClaim);
                guild = guild.set('claims', incClaims);
                guild = guild.set('lastClaim', lastClaim);
            }

            return guild;
        }
    }]);

    return LibGuilds;
})();

/*
 *
 * Private Methods
 *
 */

function getGuildDetails(cargo, onComplete) {
    api.getGuildDetails(cargo.guildId, onGuildData.bind(null, cargo));

    onComplete();
}

function onGuildData(cargo, err, data) {
    if (!err && data) {
        delete data.emblem;
        data.loaded = true;

        var guildData = Immutable.fromJS(data);

        cargo.listener(guildData, cargo.guildId);
    }
}

/*
 *
 * Export Module
 *
 */

module.exports = LibGuilds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../api":145}],148:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var GuildsDAO = require('./guilds');

var api = require('./../../api');
var STATIC = require('./../../static');

var OverviewDataProvider = (function () {
    function OverviewDataProvider(listeners) {
        _classCallCheck(this, OverviewDataProvider);

        // console.log('lib::data::tracker::constructor()');

        this.__langSlug = null;
        this.__worldSlug = null;

        this.guilds = new GuildsDAO();

        this.__mounted = false;
        this.__listeners = listeners;

        this.__timeouts = {};
        this.__intervals = {};
    }

    _createClass(OverviewDataProvider, [{
        key: 'init',
        value: function init(lang, world) {
            // console.log('lib::data::tracker::init()');

            this.__langSlug = lang.get('slug');
            this.__worldSlug = world.getIn([this.__langSlug, 'slug']);

            this.__mounted = true;
            this.__getData();
        }
    }, {
        key: 'close',
        value: function close() {
            // console.log('lib::data::tracker::close()');

            this.__mounted = false;

            this.__timeouts = _.map(this.__timeouts, function (t) {
                return clearTimeout(t);
            });
            this.__intervals = _.map(this.__intervals, function (i) {
                return clearInterval(i);
            });
        }
    }, {
        key: 'getMatchWorlds',
        value: function getMatchWorlds(lang, match) {
            return Immutable.List(['red', 'blue', 'green']).map(getMatchWorld.bind(null, lang, match));
        }
    }, {
        key: '__getData',

        /*
        *
        *   Private Methods
        *
        */

        value: function __getData() {
            // console.log('lib::data::tracker::__getData()');

            api.getMatchDetailsByWorld(this.__worldSlug, this.__onMatchDetails.bind(this));
        }
    }, {
        key: '__onMatchDetails',
        value: function __onMatchDetails(err, data) {
            // console.log('lib::data::tracker::__onMatchData()', data);

            if (!this.__mounted) {
                return;
            }

            if (!err && data && data.match && data.details) {
                var timeRemote = Immutable.fromJS(data.now);
                var matchData = Immutable.fromJS(data.match);
                var detailsData = Immutable.fromJS(data.details);

                this.__listeners.onMatchDetails(timeRemote, matchData, detailsData);
            }

            this.__rescheduleDataUpdate.call(this);
        }
    }, {
        key: '__rescheduleDataUpdate',
        value: function __rescheduleDataUpdate() {
            var refreshTime = _.random(2000, 4000);

            this.__timeouts.data = setTimeout(this.__getData.bind(this), refreshTime);
        }
    }]);

    return OverviewDataProvider;
})();

/*
*   Worlds
*/

function getMatchWorld(lang, match, color) {
    var langSlug = lang.get('slug');
    var worldKey = color + 'Id';
    var worldId = match.getIn([worldKey]).toString();
    var worldByLang = STATIC.worlds.getIn([worldId, langSlug]);

    return worldByLang.set('color', color).set('link', getWorldLink(langSlug, worldByLang));
}

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}

module.exports = OverviewDataProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../api":145,"./../../static":150,"./guilds":147}],149:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

module.exports = {
    dateNow: dateNow,
    add5: add5 };

function dateNow() {
    return Math.floor(_.now() / 1000);
}

function add5(inDate) {
    var _baseDate = inDate || dateNow();

    return _baseDate + 300;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],150:[function(require,module,exports){
(function (global){
'use strict';

var statics = require('gw2w2w-static');
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var immutableStatics = {
    langs: Immutable.fromJS(statics.langs),
    worlds: Immutable.fromJS(statics.worlds),
    objective_names: Immutable.fromJS(statics.objective_names),
    objective_types: Immutable.fromJS(statics.objective_types),
    objective_meta: Immutable.fromJS(statics.objective_meta),
    objective_labels: Immutable.fromJS(statics.objective_labels),
    objective_map: Immutable.fromJS(statics.objective_map) };

module.exports = immutableStatics;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":106}],151:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

var buffTime = 300000;
var highliteTime = 10000;

function update() {
    var remoteOffset = arguments[0] === undefined ? 0 : arguments[0];
    var cb = arguments[1] === undefined ? _.noop : arguments[1];

    var timeLocal = Date.now();
    var timeRemote = timeLocal - remoteOffset;

    // console.log('update', remoteOffset, timeLocal, timeRemote);

    var $timers = $('.timer');
    var $countdowns = $timers.filter('.countdown');
    var $relatives = $timers.filter('.relative');

    async.parallel([updateRelativeTimers.bind(null, $relatives, remoteOffset), updateCountdownTimers.bind(null, $countdowns, timeRemote)], cb);
}

function updateRelativeTimers(relatives, offset, cb) {
    async.each(relatives, updateRelativeTimeNode.bind(null, offset), cb);
}

function updateCountdownTimers(countdowns, timeRemote, cb) {
    async.each(countdowns, updateCountdownTimerNode.bind(null, timeRemote), cb);
}

function updateRelativeTimeNode(offset, el, next) {
    var $el = $(el);

    var timestamp = _.parseInt($el.attr('data-timestamp'));
    var offsetTimestamp = timestamp * 1000 + offset;
    var timestampMoment = moment(offsetTimestamp);
    var timestampRelative = timestampMoment.twitterShort();

    // console.log(offset, $el, timestamp, offsetTimestamp, timestampMoment);

    $el.text(timestampRelative);

    next();
}

function updateCountdownTimerNode(timeRemote, el, next) {
    var $el = $(el);

    var timestamp = _.parseInt($el.attr('data-timestamp')) * 1000;
    var expires = timestamp + buffTime;
    var msRemaining = expires - timeRemote;
    var msElapsed = buffTime - msRemaining;

    var isVisible = expires + highliteTime >= timeRemote;
    var isExpired = expires < timeRemote;
    var isActive = !isExpired;
    var isHighlighted = msRemaining <= Math.abs(highliteTime);
    var isFresh = msElapsed <= highliteTime;

    if (isVisible) {
        var timerText = isActive ? moment(msRemaining).format('m:ss') : '0:00';

        var $objective = $el.closest('.objective');
        var hasClassHighlight = $objective.hasClass('highlight');
        var hasClassFresh = $objective.hasClass('fresh');

        if (isHighlighted && !hasClassHighlight) {
            $objective.addClass('highlight');
        } else if (!isHighlighted && hasClassHighlight) {
            $objective.removeClass('highlight');
        }

        if (isFresh && !hasClassFresh) {
            $objective.addClass('fresh');
        } else if (!isFresh && hasClassFresh) {
            $objective.removeClass('fresh');
        }

        $el.text(timerText).filter('.inactive').addClass('active').removeClass('inactive').end();
    } else {
        $el.filter('.active').addClass('inactive').removeClass('active').removeClass('highlight').end();
    }

    next();
}

module.exports = { update: update };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24tdG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jdHguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pbnZva2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQua2V5b2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm1peC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnBhcnRpYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnJlZGVmLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1wYWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRhc2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRocm93cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC53a3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLmhhcy1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucnBhZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmltbWVkaWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21ldGEuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2hXb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvU2NvcmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9DbGFpbXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRW50cnkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FdmVudEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9Mb2dFbnRyaWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTWFwRmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcERldGFpbHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2NvcmVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNlY3Rpb24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvSWNvbnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTGFiZWwuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTWFwTmFtZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lckNvdW50ZG93bi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lclJlbGF0aXZlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVzdGFtcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9JdGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9BcnJvdy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9FbWJsZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvUGllLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1Nwcml0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9MYW5nTGluay5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0YS9vdmVydmlldy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRhL3RyYWNrZXIvZ3VpbGRzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2RhdGEvdHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3N0YXRpYy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi90cmFja2VyVGltZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLGFBQWE7Ozs7Ozs7O0FBRWIsT0FBTyxrQkFBa0IsQ0FBQzs7Ozs7Ozs7QUFRMUIsSUFBTSxLQUFLLEdBQU8sT0FBTyxTQUFTLENBQUM7QUFDbkMsSUFBTSxTQUFTLEdBQUcsT0FBTyxhQUFhLENBQUM7QUFDdkMsSUFBTSxJQUFJLEdBQVEsT0FBTyxRQUFRLENBQUM7O0FBRWxDLElBQU0sTUFBTSxHQUFNLE9BQU8sY0FBYyxDQUFDOzs7Ozs7QUFReEMsSUFBTSxLQUFLLEdBQU8sT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQyxJQUFNLFFBQVEsR0FBSSxPQUFPLFlBQVksQ0FBQztBQUN0QyxJQUFNLE9BQU8sR0FBSyxPQUFPLFdBQVcsQ0FBQzs7Ozs7Ozs7QUFZckMsQ0FBQyxDQUFDLFlBQVc7QUFDVCxnQkFBWSxFQUFFLENBQUM7QUFDZixnQkFBWSxDQUFDLEdB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TSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQzs7QUFFaEYsS0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBSztBQUM3QixTQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUNiLENBQUMsUUFBUSxFQUFDLElBQUksY0FBWSxJQUFJLEFBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FDakQsQ0FBQztLQUNMLENBQUMsQ0FBQztDQUNOOzs7Ozs7QUN4SkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwakJBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbm1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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V0FBVyxhQUFhLENBQUM7U0FDdkM7O0FBRUQsWUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDM0Isc0JBQVUsQ0FBQyxRQUFRLFNBQVMsQ0FBQztTQUNoQyxNQUFNLElBQUksQ0FBQyxPQUFPLElBQUksYUFBYSxFQUFFO0FBQ2xDLHNCQUFVLENBQUMsV0FBVyxTQUFTLENBQUM7U0FDbkM7O0FBRUQsV0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDZCxNQUFNLGFBQWEsQ0FDbkIsUUFBUSxVQUFVLENBQ2xCLFdBQVcsWUFBWSxDQUN2QixHQUFHLEVBQUUsQ0FBQztLQUVkLE1BQU07QUFDSCxXQUFHLENBQUMsTUFBTSxXQUFXLENBQ2hCLFFBQVEsWUFBWSxDQUNwQixXQUFXLFVBQVUsQ0FDckIsV0FBVyxhQUFhLENBQ3hCLEdBQUcsRUFBRSxDQUFDO0tBQ2Q7O0FBRUQsUUFBSSxFQUFFLENBQUM7Q0FDVjs7QUFLRCxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUMsTUFBTSxFQUFOLE1BQU0sRUFBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBwYWdlICAgICAgPSByZXF1aXJlKCdwYWdlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTGFuZ3MgICAgID0gcmVxdWlyZSgnY29tbW9uL0xhbmdzJyk7XHJcbmNvbnN0IE92ZXJ2aWV3ICA9IHJlcXVpcmUoJ092ZXJ2aWV3Jyk7XHJcbmNvbnN0IFRyYWNrZXIgICA9IHJlcXVpcmUoJ1RyYWNrZXInKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRE9NIFJlYWR5XHJcbipcclxuKi9cclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICBhdHRhY2hSb3V0ZXMoKTtcclxuICAgIHNldEltbWVkaWF0ZShlbWwpO1xyXG59KTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFJvdXRlc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhdHRhY2hSb3V0ZXMoKSB7XHJcblxyXG4gICAgLy8gUmVkaXJlY3QgJy8nIHRvICcvZW4nXHJcbiAgICBwYWdlKCcvJywgcmVkaXJlY3RQYWdlLmJpbmQobnVsbCwgJy9lbicpKTtcclxuXHJcbiAgICBwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIGZ1bmN0aW9uKGN0eCkge1xyXG4gICAgICAgIFJlYWN0LnJlbmRlcihcclxuICAgICAgICAgICAgPEFwcCB7Li4uY3R4LnBhcmFtc30gLz4sXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1hcHAnKVxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgcGFnZS5zdGFydCh7XHJcbiAgICAgICAgY2xpY2sgICA6IHRydWUsXHJcbiAgICAgICAgcG9wc3RhdGU6IHRydWUsXHJcbiAgICAgICAgZGlzcGF0Y2g6IHRydWUsXHJcbiAgICAgICAgaGFzaGJhbmc6IGZhbHNlLFxyXG4gICAgICAgIGRlY29kZVVSTENvbXBvbmVudHM6IHRydWUsXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBBcHAgQ29udGFpbmVyXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXBwIFN0YXJ0ZWQhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGxhbmdTbHVnICA9IHRoaXMucHJvcHMubGFuZ1NsdWc7XHJcbiAgICAgICAgY29uc3Qgd29ybGRTbHVnID0gdGhpcy5wcm9wcy53b3JsZFNsdWc7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhbmcgICAgICA9IFNUQVRJQy5sYW5ncy5nZXQobGFuZ1NsdWcpO1xyXG4gICAgICAgIGNvbnN0IHdvcmxkICAgICA9IGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc1dvcmxkICA9ICh3b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkKSAmJiAhd29ybGQuaXNFbXB0eSgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgSGFuZGxlciAgID0gKGhhc1dvcmxkKSA/IFRyYWNrZXIgOiBPdmVydmlldztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xhbmdzOjpyZW5kZXIoKScsIHRoaXMucHJvcHMubGFuZy50b0pTKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBuYXZiYXJIZWFkZXIgPSA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIi9cIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2ltZy9sb2dvL2xvZ28tOTZ4MzYucG5nXCIgLz5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PjtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtuYXZiYXJIZWFkZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cIm5hdi1sYW5nc1wiIGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExhbmdzIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L25hdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjb250ZW50XCIgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8SGFuZGxlciBsYW5nPXtsYW5nfSB3b3JsZD17d29ybGR9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogVXRpbFxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiByZWRpcmVjdFBhZ2UoZGVzdGluYXRpb24pIHtcclxuICAgIHBhZ2UucmVkaXJlY3QoZGVzdGluYXRpb24pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zykge1xyXG4gICAgcmV0dXJuIFNUQVRJQy53b3JsZHNcclxuICAgICAgICAuZmluZCh3b3JsZCA9PiB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pID09PSB3b3JsZFNsdWcpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGVtbCgpIHtcclxuICAgIGNvbnN0IGNodW5rcyA9IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddO1xyXG4gICAgY29uc3QgYWRkciAgID0gW2NodW5rc1swXSwgY2h1bmtzWzNdLCBjaHVua3NbMV0sIGNodW5rc1s0XSwgY2h1bmtzWzJdXS5qb2luKCcnKTtcclxuXHJcbiAgICAkKCcubm9zcGFtLXByeicpLmVhY2goKGksIGVsKSA9PiB7XHJcbiAgICAgICAgJChlbCkucmVwbGFjZVdpdGgoXHJcbiAgICAgICAgICAgICQoJzxhPicsIHtocmVmOiBgbWFpbHRvOiR7YWRkcn1gLCB0ZXh0OiBhZGRyfSlcclxuICAgICAgICApO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL3NoaW1cIik7XG5cbnJlcXVpcmUoXCJyZWdlbmVyYXRvci9ydW50aW1lXCIpO1xuXG5pZiAoZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIm9ubHkgb25lIGluc3RhbmNlIG9mIGJhYmVsL3BvbHlmaWxsIGlzIGFsbG93ZWRcIik7XG59XG5nbG9iYWwuX2JhYmVsUG9seWZpbGwgPSB0cnVlOyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9ICQudG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4O1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyICQgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ID0gcmVxdWlyZSgnLi8kLmN0eCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCgkdGhpcykpXG4gICAgICAsIHNlbGYgICA9ICQuRVM1T2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IEFycmF5KGxlbmd0aCkgOiBJU19GSUxURVIgPyBbXSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XG59XG5hc3NlcnQuZGVmID0gJC5hc3NlcnREZWZpbmVkO1xuYXNzZXJ0LmZuID0gZnVuY3Rpb24oaXQpe1xuICBpZighJC5pc0Z1bmN0aW9uKGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuYXNzZXJ0Lm9iaiA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoISQuaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbmFzc2VydC5pbnN0ID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcbiAgcmV0dXJuIGl0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZW51bUtleXMgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJyk7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gIHZhciBUID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0YXJnZXQpKVxuICAgICwgbCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGkgPSAxO1xuICB3aGlsZShsID4gaSl7XG4gICAgdmFyIFMgICAgICA9ICQuRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxuICAgICAgLCBrZXlzICAgPSBlbnVtS2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcbiAgfVxuICByZXR1cm4gVDtcbn07IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBUQUcgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5mdW5jdGlvbiBjb2YoaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufVxuY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBUO1xuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcbn07XG5jb2Yuc2V0ID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICEkLmhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkkLmhpZGUoaXQsIFRBRywgdGFnKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGNvZjsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgc2FmZSAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdGVwICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuc3RlcFxuICAsIGhhcyAgICAgID0gJC5oYXNcbiAgLCBzZXQgICAgICA9ICQuc2V0XG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gICwgaGlkZSAgICAgPSAkLmhpZGVcbiAgLCBpc0Zyb3plbiA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgTzEgICAgICAgPSBzYWZlKCdPMScpXG4gICwgTEFTVCAgICAgPSBzYWZlKCdsYXN0JylcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcbiAgLCBJVEVSICAgICA9IHNhZmUoJ2l0ZXInKVxuICAsIFNJWkUgICAgID0gJC5ERVNDID8gc2FmZSgnc2l6ZScpIDogJ3NpemUnXG4gICwgaWQgICAgICAgPSAwO1xuXG5mdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XG4gIGlmKGlzRnJvemVuKGl0KSlyZXR1cm4gJ0YnO1xuICBpZighaGFzKGl0LCBJRCkpe1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG9iamVjdCBpZFxuICAgIGhpZGUoaXQsIElELCArK2lkKTtcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxuICB9IHJldHVybiAnTycgKyBpdFtJRF07XG59XG5cbmZ1bmN0aW9uIGdldEVudHJ5KHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPSAnRicpcmV0dXJuIHRoYXRbTzFdW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbihOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICBmdW5jdGlvbiBDKCl7XG4gICAgICB2YXIgdGhhdCAgICAgPSBhc3NlcnQuaW5zdCh0aGlzLCBDLCBOQU1FKVxuICAgICAgICAsIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xuICAgICAgc2V0KHRoYXQsIE8xLCAkLmNyZWF0ZShudWxsKSk7XG4gICAgICBzZXQodGhhdCwgU0laRSwgMCk7XG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcbiAgICAgIHNldCh0aGF0LCBGSVJTVCwgdW5kZWZpbmVkKTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfVxuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdFtPMV1bZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gYXNzZXJ0LmRlZih0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0W0xBU1RdLCAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgc2V0SXRlcjogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAgICAgLCBraW5kICA9IGl0ZXIua1xuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JPZiA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gICRkZWYoJGRlZi5QLCBOQU1FLCB7XG4gICAgdG9KU09OOiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgIGZvck9mKHRoaXMsIGZhbHNlLCBhcnIucHVzaCwgYXJyKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgc2FmZSAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcbiAgLCBhc3NlcnQgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBmb3JPZiAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBfaGFzICAgICAgPSAkLmhhc1xuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcbiAgLCBoaWRlICAgICAgPSAkLmhpZGVcbiAgLCBpc0Zyb3plbiAgPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxuICAsIGlkICAgICAgICA9IDBcbiAgLCBJRCAgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgV0VBSyAgICAgID0gc2FmZSgnd2VhaycpXG4gICwgTEVBSyAgICAgID0gc2FmZSgnbGVhaycpXG4gICwgbWV0aG9kICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsIGZpbmQgICAgICA9IG1ldGhvZCg1KVxuICAsIGZpbmRJbmRleCA9IG1ldGhvZCg2KTtcbmZ1bmN0aW9uIGZpbmRGcm96ZW4oc3RvcmUsIGtleSl7XG4gIHJldHVybiBmaW5kKHN0b3JlLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufVxuLy8gZmFsbGJhY2sgZm9yIGZyb3plbiBrZXlzXG5mdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XG4gIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGUodGhhdCwgTEVBSywge1xuICAgIGFycmF5OiBbXSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgICBpZihlbnRyeSlyZXR1cm4gZW50cnlbMV07XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XG4gICAgICByZXR1cm4gISFmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgdmFyIGVudHJ5ID0gZmluZEZyb3plbih0aGlzLCBrZXkpO1xuICAgICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcbiAgICAgIGVsc2UgdGhpcy5hcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgfSxcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCh0aGlzLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgICBpZih+aW5kZXgpdGhpcy5hcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcmV0dXJuICEhfmluZGV4O1xuICAgIH1cbiAgfSlbTEVBS107XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24oTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgZnVuY3Rpb24gQygpe1xuICAgICAgJC5zZXQoYXNzZXJ0Lmluc3QodGhpcywgQywgTkFNRSksIElELCBpZCsrKTtcbiAgICAgIHZhciBpdGVyYWJsZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGlzW0FEREVSXSwgdGhpcyk7XG4gICAgfVxuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcbiAgICAgICAgcmV0dXJuIF9oYXMoa2V5LCBXRUFLKSAmJiBfaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tJRF1dO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjMuMy40IFdlYWtNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcbiAgICAgICAgcmV0dXJuIF9oYXMoa2V5LCBXRUFLKSAmJiBfaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIGlmKGlzRnJvemVuKGFzc2VydC5vYmooa2V5KSkpe1xuICAgICAgbGVha1N0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2hhcyhrZXksIFdFQUspIHx8IGhpZGUoa2V5LCBXRUFLLCB7fSk7XG4gICAgICBrZXlbV0VBS11bdGhhdFtJRF1dID0gdmFsdWU7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgbGVha1N0b3JlOiBsZWFrU3RvcmUsXG4gIFdFQUs6IFdFQUssXG4gIElEOiBJRFxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgQlVHR1kgPSByZXF1aXJlKCcuLyQuaXRlcicpLkJVR0dZXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzcGVjaWVzID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxuICAsIGFzc2VydEluc3RhbmNlID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmluc3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSAkLmdbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGZ1bmN0aW9uIGZpeE1ldGhvZChLRVksIENIQUlOKXtcbiAgICBpZigkLkZXKXtcbiAgICAgIHZhciBtZXRob2QgPSBwcm90b1tLRVldO1xuICAgICAgcmVxdWlyZSgnLi8kLnJlZGVmJykocHJvdG8sIEtFWSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIHZhciByZXN1bHQgPSBtZXRob2QuY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gQ0hBSU4gPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmKCEkLmlzRnVuY3Rpb24oQykgfHwgIShJU19XRUFLIHx8ICFCVUdHWSAmJiBwcm90by5mb3JFYWNoICYmIHByb3RvLmVudHJpZXMpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3IoTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW5zdCAgPSBuZXcgQ1xuICAgICAgLCBjaGFpbiA9IGluc3RbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKVxuICAgICAgLCBidWdneVplcm87XG4gICAgLy8gd3JhcCBmb3IgaW5pdCBjb2xsZWN0aW9ucyBmcm9tIGl0ZXJhYmxlXG4gICAgaWYoIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBuZXcgQyhpdGVyKTsgfSkpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgICAgQyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIEMsIE5BTUUpO1xuICAgICAgICB2YXIgdGhhdCAgICAgPSBuZXcgQmFzZVxuICAgICAgICAgICwgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfTtcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XG4gICAgICBpZigkLkZXKXByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgSVNfV0VBSyB8fCBpbnN0LmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpe1xuICAgICAgYnVnZ3laZXJvID0gMSAvIGtleSA9PT0gLUluZmluaXR5O1xuICAgIH0pO1xuICAgIC8vIGZpeCBjb252ZXJ0aW5nIC0wIGtleSB0byArMFxuICAgIGlmKGJ1Z2d5WmVybyl7XG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xuICAgIH1cbiAgICAvLyArIGZpeCAuYWRkICYgLnNldCBmb3IgY2hhaW5pbmdcbiAgICBpZihidWdneVplcm8gfHwgY2hhaW4gIT09IGluc3QpZml4TWV0aG9kKEFEREVSLCB0cnVlKTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vJC5jb2YnKS5zZXQoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GICogKEMgIT0gQmFzZSksIE8pO1xuICBzcGVjaWVzKEMpO1xuICBzcGVjaWVzKCQuY29yZVtOQU1FXSk7IC8vIGZvciB3cmFwcGVyXG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldEl0ZXIoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwiLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhc3NlcnRGdW5jdGlvbihmbik7XG4gIGlmKH5sZW5ndGggJiYgdGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGdsb2JhbCAgICAgPSAkLmdcbiAgLCBjb3JlICAgICAgID0gJC5jb3JlXG4gICwgaXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvblxuICAsICRyZWRlZiAgICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKTtcbmZ1bmN0aW9uIGN0eChmbiwgdGhhdCl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufVxuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcbiRkZWYuUyA9IDQ7ICAvLyBzdGF0aWNcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xuJGRlZi5CID0gMTY7IC8vIGJpbmRcbiRkZWYuVyA9IDMyOyAvLyB3cmFwXG5mdW5jdGlvbiAkZGVmKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmICRkZWYuR1xuICAgICwgaXNQcm90byAgPSB0eXBlICYgJGRlZi5QXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogdHlwZSAmICRkZWYuU1xuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pLnByb3RvdHlwZVxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gISh0eXBlICYgJGRlZi5GKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xuICAgIGVsc2UgZXhwID0gaXNQcm90byAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYodGFyZ2V0ICYmICFvd24pJHJlZGVmKHRhcmdldCwga2V5LCBvdXQpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpJC5oaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZihpc1Byb3RvKShleHBvcnRzLnByb3RvdHlwZSB8fCAoZXhwb3J0cy5wcm90b3R5cGUgPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gJGRlZjsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRvY3VtZW50ID0gJC5nLmRvY3VtZW50XG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXG4gICAgLCBnZXREZXNjICAgID0gJC5nZXREZXNjXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICBpZihnZXRTeW1ib2xzKSQuZWFjaC5jYWxsKGdldFN5bWJvbHMoaXQpLCBmdW5jdGlvbihrZXkpe1xuICAgIGlmKGdldERlc2MoaXQsIGtleSkuZW51bWVyYWJsZSlrZXlzLnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiBrZXlzO1xufTsiLCJ2YXIgY3R4ICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGdldCAgPSByZXF1aXJlKCcuLyQuaXRlcicpLmdldFxuICAsIGNhbGwgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyYXRvciA9IGdldChpdGVyYWJsZSlcbiAgICAsIGYgICAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBzdGVwO1xuICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpe1xuICAgIGlmKGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpID09PSBmYWxzZSl7XG4gICAgICByZXR1cm4gY2FsbC5jbG9zZShpdGVyYXRvcik7XG4gICAgfVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJCl7XG4gICQuRlcgICA9IHRydWU7XG4gICQucGF0aCA9ICQuZztcbiAgcmV0dXJuICQ7XG59OyIsIi8vIEZhc3QgYXBwbHlcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICBjYXNlIDU6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsInZhciBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqO1xuZnVuY3Rpb24gY2xvc2UoaXRlcmF0b3Ipe1xuICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICBpZihyZXQgIT09IHVuZGVmaW5lZClhc3NlcnRPYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbn1cbmZ1bmN0aW9uIGNhbGwoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhc3NlcnRPYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIH0gY2F0Y2goZSl7XG4gICAgY2xvc2UoaXRlcmF0b3IpO1xuICAgIHRocm93IGU7XG4gIH1cbn1cbmNhbGwuY2xvc2UgPSBjbG9zZTtcbm1vZHVsZS5leHBvcnRzID0gY2FsbDsiLCJ2YXIgJGRlZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHJlZGVmICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJylcbiAgLCAkICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRpdGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBGRl9JVEVSQVRPUiAgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICAgPSAndmFsdWVzJ1xuICAsIEl0ZXJhdG9ycyAgICAgICA9ICRpdGVyLkl0ZXJhdG9ycztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0Upe1xuICAkaXRlci5jcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICBmdW5jdGlvbiBjcmVhdGVNZXRob2Qoa2luZCl7XG4gICAgZnVuY3Rpb24gJCQodGhhdCl7XG4gICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoYXQsIGtpbmQpO1xuICAgIH1cbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgfVxuICB2YXIgVEFHICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsIF9uYXRpdmUgID0gcHJvdG9bU1lNQk9MX0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgX2RlZmF1bHQgPSBfbmF0aXZlIHx8IGNyZWF0ZU1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKF9uYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9ICQuZ2V0UHJvdG8oX2RlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBjb2Yuc2V0KEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgIC8vIEZGIGZpeFxuICAgIGlmKCQuRlcgJiYgJC5oYXMocHJvdG8sIEZGX0lURVJBVE9SKSkkaXRlci5zZXQoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCQuRlcpJGl0ZXIuc2V0KHByb3RvLCBfZGVmYXVsdCk7XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gX2RlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9ICQudGhhdDtcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgICAgICAgID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoS0VZUyksXG4gICAgICB2YWx1ZXM6ICBERUZBVUxUID09IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKFZBTFVFUyksXG4gICAgICBlbnRyaWVzOiBERUZBVUxUICE9IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpJHJlZGVmKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRkZWYoJGRlZi5QICsgJGRlZi5GICogJGl0ZXIuQlVHR1ksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG59OyIsInZhciBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgICAgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtTWU1CT0xfSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgaWYoIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltTWU1CT0xfSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW1NZTUJPTF9JVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBhc3NlcnRPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmpcbiAgLCBTWU1CT0xfSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEZGX0lURVJBVE9SICAgICAgID0gJ0BAaXRlcmF0b3InXG4gICwgSXRlcmF0b3JzICAgICAgICAgPSB7fVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxuc2V0SXRlcmF0b3IoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XG5mdW5jdGlvbiBzZXRJdGVyYXRvcihPLCB2YWx1ZSl7XG4gICQuaGlkZShPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxuICBpZihGRl9JVEVSQVRPUiBpbiBbXSkkLmhpZGUoTywgRkZfSVRFUkFUT1IsIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgQlVHR1k6ICdrZXlzJyBpbiBbXSAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpLFxuICBJdGVyYXRvcnM6IEl0ZXJhdG9ycyxcbiAgc3RlcDogZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xuICB9LFxuICBpczogZnVuY3Rpb24oaXQpe1xuICAgIHZhciBPICAgICAgPSBPYmplY3QoaXQpXG4gICAgICAsIFN5bWJvbCA9ICQuZy5TeW1ib2xcbiAgICAgICwgU1lNICAgID0gU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUjtcbiAgICByZXR1cm4gU1lNIGluIE8gfHwgU1lNQk9MX0lURVJBVE9SIGluIE8gfHwgJC5oYXMoSXRlcmF0b3JzLCBjb2YuY2xhc3NvZihPKSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oaXQpe1xuICAgIHZhciBTeW1ib2wgID0gJC5nLlN5bWJvbFxuICAgICAgLCBleHQgICAgID0gaXRbU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUl1cbiAgICAgICwgZ2V0SXRlciA9IGV4dCB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdIHx8IEl0ZXJhdG9yc1tjb2YuY2xhc3NvZihpdCldO1xuICAgIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XG4gIH0sXG4gIHNldDogc2V0SXRlcmF0b3IsXG4gIGNyZWF0ZTogZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShwcm90byB8fCBJdGVyYXRvclByb3RvdHlwZSwge25leHQ6ICQuZGVzYygxLCBuZXh0KX0pO1xuICAgIGNvZi5zZXQoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClcbiAgLCBjb3JlICAgPSB7fVxuICAsIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICwgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eVxuICAsIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXG4gICwgbWF4ICAgPSBNYXRoLm1heFxuICAsIG1pbiAgID0gTWF0aC5taW47XG4vLyBUaGUgZW5naW5lIHdvcmtzIGZpbmUgd2l0aCBkZXNjcmlwdG9ycz8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eS5cbnZhciBERVNDID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMjsgfX0pLmEgPT0gMjtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xudmFyIGhpZGUgPSBjcmVhdGVEZWZpbmVyKDEpO1xuLy8gNy4xLjQgVG9JbnRlZ2VyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn1cbmZ1bmN0aW9uIGRlc2MoYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufVxuZnVuY3Rpb24gc2ltcGxlU2V0KG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59XG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XG4gIHJldHVybiBERVNDID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gJC5zZXREZXNjKG9iamVjdCwga2V5LCBkZXNjKGJpdG1hcCwgdmFsdWUpKTtcbiAgfSA6IHNpbXBsZVNldDtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xuICByZXR1cm4gaXQgIT09IG51bGwgJiYgKHR5cGVvZiBpdCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn1cblxudmFyICQgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mdycpKHtcbiAgZzogZ2xvYmFsLFxuICBjb3JlOiBjb3JlLFxuICBodG1sOiBnbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XG4gIGlzT2JqZWN0OiAgIGlzT2JqZWN0LFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpdDogZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdDtcbiAgfSxcbiAgdGhhdDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXG4gIHRvSW50ZWdlcjogdG9JbnRlZ2VyLFxuICAvLyA3LjEuMTUgVG9MZW5ndGhcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxuICB9LFxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oaXQsIGtleSl7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG4gIH0sXG4gIGNyZWF0ZTogICAgIE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgREVTQzogICAgICAgREVTQyxcbiAgZGVzYzogICAgICAgZGVzYyxcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxuICBFUzVPYmplY3Q6IE9iamVjdCxcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xuICB9LFxuICBoaWRlOiBoaWRlLFxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXG4gIHNldDogZ2xvYmFsLlN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGUsXG4gIGVhY2g6IFtdLmZvckVhY2hcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmlmKHR5cGVvZiBfX2UgIT0gJ3VuZGVmaW5lZCcpX19lID0gY29yZTtcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsInZhciAkcmVkZWYgPSByZXF1aXJlKCcuLyQucmVkZWYnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XHJcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSRyZWRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3duS2V5cyhpdCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXROYW1lcyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBfICAgICAgPSAkLnBhdGguX1xuICAgICwgaG9sZGVyID0gZmFsc2U7XG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaiA9IDAsIGsgPSAwLCBhcmdzO1xuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGo7IGorKylpZihhcmdzW2pdID09PSBfKWFyZ3Nbal0gPSBhcmd1bWVudHNbaysrXTtcbiAgICB3aGlsZShfbGVuZ3RoID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xufTsiLCJ2YXIgJCAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHRwbCA9IFN0cmluZyh7fS5oYXNPd25Qcm9wZXJ0eSlcclxuICAsIFNSQyA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdzcmMnKVxyXG4gICwgX3RvU3RyaW5nID0gRnVuY3Rpb24udG9TdHJpbmc7XHJcblxyXG5mdW5jdGlvbiAkcmVkZWYoTywga2V5LCB2YWwsIHNhZmUpe1xyXG4gIGlmKCQuaXNGdW5jdGlvbih2YWwpKXtcclxuICAgIHZhciBiYXNlID0gT1trZXldO1xyXG4gICAgJC5oaWRlKHZhbCwgU1JDLCBiYXNlID8gU3RyaW5nKGJhc2UpIDogdHBsLnJlcGxhY2UoL2hhc093blByb3BlcnR5LywgU3RyaW5nKGtleSkpKTtcclxuICB9XHJcbiAgaWYoTyA9PT0gJC5nKXtcclxuICAgIE9ba2V5XSA9IHZhbDtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIXNhZmUpZGVsZXRlIE9ba2V5XTtcclxuICAgICQuaGlkZShPLCBrZXksIHZhbCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9yc1xyXG4vLyB3aXRoIG1ldGhvZHMgc2ltaWxhciB0byBMb0Rhc2ggaXNOYXRpdmVcclxuJHJlZGVmKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcclxuICByZXR1cm4gJC5oYXModGhpcywgU1JDKSA/IHRoaXNbU1JDXSA6IF90b1N0cmluZy5jYWxsKHRoaXMpO1xyXG59KTtcclxuXHJcbiQuY29yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiBfdG9TdHJpbmcuY2FsbChpdCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICRyZWRlZjsiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlZ0V4cCwgcmVwbGFjZSwgaXNTdGF0aWMpe1xuICB2YXIgcmVwbGFjZXIgPSByZXBsYWNlID09PSBPYmplY3QocmVwbGFjZSkgPyBmdW5jdGlvbihwYXJ0KXtcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcbiAgfSA6IHJlcGxhY2U7XG4gIHJldHVybiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIFN0cmluZyhpc1N0YXRpYyA/IGl0IDogdGhpcykucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcbiAgfTtcbn07IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgYXNzZXJ0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpO1xuZnVuY3Rpb24gY2hlY2soTywgcHJvdG8pe1xuICBhc3NlcnQub2JqKE8pO1xuICBhc3NlcnQocHJvdG8gPT09IG51bGwgfHwgJC5pc09iamVjdChwcm90byksIHByb3RvLCBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICA/IGZ1bmN0aW9uKGJ1Z2d5LCBzZXQpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCAkLmdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgICAgc2V0KHt9LCBbXSk7XG4gICAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgICByZXR1cm4gTztcbiAgICAgICAgfTtcbiAgICAgIH0oKVxuICAgIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsInZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBTUEVDSUVTID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEMpe1xuICBpZigkLkRFU0MgJiYgIShTUEVDSUVTIGluIEMpKSQuc2V0RGVzYyhDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogJC50aGF0XG4gIH0pO1xufTsiLCIvLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gJC50b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbFxuICAgICAgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1zdHJhd21hbjpzdHJpbmdfcGFkZGluZ1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgcmVwZWF0ID0gcmVxdWlyZSgnLi8kLnN0cmluZy1yZXBlYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aGF0LCBtaW5MZW5ndGgsIGZpbGxDaGFyLCBsZWZ0KXtcbiAgLy8gMS4gTGV0IE8gYmUgQ2hlY2tPYmplY3RDb2VyY2libGUodGhpcyB2YWx1ZSkuXG4gIC8vIDIuIExldCBTIGJlIFRvU3RyaW5nKE8pLlxuICB2YXIgUyA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhhdCkpO1xuICAvLyA0LiBJZiBpbnRNaW5MZW5ndGggaXMgdW5kZWZpbmVkLCByZXR1cm4gUy5cbiAgaWYobWluTGVuZ3RoID09PSB1bmRlZmluZWQpcmV0dXJuIFM7XG4gIC8vIDQuIExldCBpbnRNaW5MZW5ndGggYmUgVG9JbnRlZ2VyKG1pbkxlbmd0aCkuXG4gIHZhciBpbnRNaW5MZW5ndGggPSAkLnRvSW50ZWdlcihtaW5MZW5ndGgpO1xuICAvLyA1LiBMZXQgZmlsbExlbiBiZSB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gUyBtaW51cyBpbnRNaW5MZW5ndGguXG4gIHZhciBmaWxsTGVuID0gaW50TWluTGVuZ3RoIC0gUy5sZW5ndGg7XG4gIC8vIDYuIElmIGZpbGxMZW4gPCAwLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gIC8vIDcuIElmIGZpbGxMZW4gaXMgK+KIniwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICBpZihmaWxsTGVuIDwgMCB8fCBmaWxsTGVuID09PSBJbmZpbml0eSl7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0Nhbm5vdCBzYXRpc2Z5IHN0cmluZyBsZW5ndGggJyArIG1pbkxlbmd0aCArICcgZm9yIHN0cmluZzogJyArIFMpO1xuICB9XG4gIC8vIDguIExldCBzRmlsbFN0ciBiZSB0aGUgc3RyaW5nIHJlcHJlc2VudGVkIGJ5IGZpbGxTdHIuXG4gIC8vIDkuIElmIHNGaWxsU3RyIGlzIHVuZGVmaW5lZCwgbGV0IHNGaWxsU3RyIGJlIGEgc3BhY2UgY2hhcmFjdGVyLlxuICB2YXIgc0ZpbGxTdHIgPSBmaWxsQ2hhciA9PT0gdW5kZWZpbmVkID8gJyAnIDogU3RyaW5nKGZpbGxDaGFyKTtcbiAgLy8gMTAuIExldCBzRmlsbFZhbCBiZSBhIFN0cmluZyBtYWRlIG9mIHNGaWxsU3RyLCByZXBlYXRlZCB1bnRpbCBmaWxsTGVuIGlzIG1ldC5cbiAgdmFyIHNGaWxsVmFsID0gcmVwZWF0LmNhbGwoc0ZpbGxTdHIsIE1hdGguY2VpbChmaWxsTGVuIC8gc0ZpbGxTdHIubGVuZ3RoKSk7XG4gIC8vIHRydW5jYXRlIGlmIHdlIG92ZXJmbG93ZWRcbiAgaWYoc0ZpbGxWYWwubGVuZ3RoID4gZmlsbExlbilzRmlsbFZhbCA9IGxlZnRcbiAgICA/IHNGaWxsVmFsLnNsaWNlKHNGaWxsVmFsLmxlbmd0aCAtIGZpbGxMZW4pXG4gICAgOiBzRmlsbFZhbC5zbGljZSgwLCBmaWxsTGVuKTtcbiAgLy8gMTEuIFJldHVybiBhIHN0cmluZyBtYWRlIGZyb20gc0ZpbGxWYWwsIGZvbGxvd2VkIGJ5IFMuXG4gIC8vIDExLiBSZXR1cm4gYSBTdHJpbmcgbWFkZSBmcm9tIFMsIGZvbGxvd2VkIGJ5IHNGaWxsVmFsLlxuICByZXR1cm4gbGVmdCA/IHNGaWxsVmFsLmNvbmNhdChTKSA6IFMuY29uY2F0KHNGaWxsVmFsKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBlYXQoY291bnQpe1xuICB2YXIgc3RyID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAsIHJlcyA9ICcnXG4gICAgLCBuICAgPSAkLnRvSW50ZWdlcihjb3VudCk7XG4gIGlmKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpdGhyb3cgUmFuZ2VFcnJvcihcIkNvdW50IGNhbid0IGJlIG5lZ2F0aXZlXCIpO1xuICBmb3IoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSlpZihuICYgMSlyZXMgKz0gc3RyO1xuICByZXR1cm4gcmVzO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBjZWwgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gJC5nXG4gICwgaXNGdW5jdGlvbiAgICAgICAgID0gJC5pc0Z1bmN0aW9uXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gJC5odG1sXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgcG9zdE1lc3NhZ2UgICAgICAgID0gZ2xvYmFsLnBvc3RNZXNzYWdlXG4gICwgYWRkRXZlbnRMaXN0ZW5lciAgID0gZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xuZnVuY3Rpb24gcnVuKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZigkLmhhcyhxdWV1ZSwgaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59XG5mdW5jdGlvbiBsaXN0bmVyKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighaXNGdW5jdGlvbihzZXRUYXNrKSB8fCAhaXNGdW5jdGlvbihjbGVhclRhc2spKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKGlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYoY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gTW9kZXJuIGJyb3dzZXJzLCBza2lwIGltcGxlbWVudGF0aW9uIGZvciBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxuICB9IGVsc2UgaWYoYWRkRXZlbnRMaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKHBvc3RNZXNzYWdlKSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcG9zdE1lc3NhZ2UoaWQsICcqJyk7XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xuICAvLyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBzaWQgPSAwO1xuZnVuY3Rpb24gdWlkKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK3NpZCArIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KSk7XG59XG51aWQuc2FmZSA9IHJlcXVpcmUoJy4vJCcpLmcuU3ltYm9sIHx8IHVpZDtcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3Vuc2NvcGFibGVzJyk7XG5pZigkLkZXICYmICEoVU5TQ09QQUJMRVMgaW4gW10pKSQuaGlkZShBcnJheS5wcm90b3R5cGUsIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIGlmKCQuRlcpW11bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kJykuZ1xuICAsIHN0b3JlICA9IHt9O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgZ2xvYmFsLlN5bWJvbCAmJiBnbG9iYWwuU3ltYm9sW25hbWVdIHx8IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyICQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNlbCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgY29mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpbnZva2UgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYXJyYXlNZXRob2QgICAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJylcbiAgLCBJRV9QUk9UTyAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ19fcHJvdG9fXycpXG4gICwgYXNzZXJ0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGFzc2VydE9iamVjdCAgICAgPSBhc3NlcnQub2JqXG4gICwgT2JqZWN0UHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGVcbiAgLCBodG1sICAgICAgICAgICAgID0gJC5odG1sXG4gICwgQSAgICAgICAgICAgICAgICA9IFtdXG4gICwgX3NsaWNlICAgICAgICAgICA9IEEuc2xpY2VcbiAgLCBfam9pbiAgICAgICAgICAgID0gQS5qb2luXG4gICwgY2xhc3NvZiAgICAgICAgICA9IGNvZi5jbGFzc29mXG4gICwgaGFzICAgICAgICAgICAgICA9ICQuaGFzXG4gICwgZGVmaW5lUHJvcGVydHkgICA9ICQuc2V0RGVzY1xuICAsIGdldE93bkRlc2NyaXB0b3IgPSAkLmdldERlc2NcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzID0gJC5zZXREZXNjc1xuICAsIGlzRnVuY3Rpb24gICAgICAgPSAkLmlzRnVuY3Rpb25cbiAgLCB0b09iamVjdCAgICAgICAgID0gJC50b09iamVjdFxuICAsIHRvTGVuZ3RoICAgICAgICAgPSAkLnRvTGVuZ3RoXG4gICwgdG9JbmRleCAgICAgICAgICA9ICQudG9JbmRleFxuICAsIElFOF9ET01fREVGSU5FICAgPSBmYWxzZVxuICAsICRpbmRleE9mICAgICAgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCAkZm9yRWFjaCAgICAgICAgID0gYXJyYXlNZXRob2QoMClcbiAgLCAkbWFwICAgICAgICAgICAgID0gYXJyYXlNZXRob2QoMSlcbiAgLCAkZmlsdGVyICAgICAgICAgID0gYXJyYXlNZXRob2QoMilcbiAgLCAkc29tZSAgICAgICAgICAgID0gYXJyYXlNZXRob2QoMylcbiAgLCAkZXZlcnkgICAgICAgICAgID0gYXJyYXlNZXRob2QoNCk7XG5cbmlmKCEkLkRFU0Mpe1xuICB0cnkge1xuICAgIElFOF9ET01fREVGSU5FID0gZGVmaW5lUHJvcGVydHkoY2VsKCdkaXYnKSwgJ3gnLFxuICAgICAge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDg7IH19XG4gICAgKS54ID09IDg7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgJC5zZXREZXNjID0gZnVuY3Rpb24oTywgUCwgQXR0cmlidXRlcyl7XG4gICAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gICAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gICAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKWFzc2VydE9iamVjdChPKVtQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gICAgcmV0dXJuIE87XG4gIH07XG4gICQuZ2V0RGVzYyA9IGZ1bmN0aW9uKE8sIFApe1xuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgICByZXR1cm4gZ2V0T3duRGVzY3JpcHRvcihPLCBQKTtcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gICAgaWYoaGFzKE8sIFApKXJldHVybiAkLmRlc2MoIU9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoTywgUCksIE9bUF0pO1xuICB9O1xuICAkLnNldERlc2NzID0gZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKE8sIFByb3BlcnRpZXMpe1xuICAgIGFzc2VydE9iamVjdChPKTtcbiAgICB2YXIga2V5cyAgID0gJC5nZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGkgPSAwXG4gICAgICAsIFA7XG4gICAgd2hpbGUobGVuZ3RoID4gaSkkLnNldERlc2MoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gICAgcmV0dXJuIE87XG4gIH07XG59XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICEkLkRFU0MsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi42IC8gMTUuMi4zLjMgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICQuZ2V0RGVzYyxcbiAgLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICQuc2V0RGVzYyxcbiAgLy8gMTkuMS4yLjMgLyAxNS4yLjMuNyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzXG59KTtcblxuICAvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG52YXIga2V5czEgPSAoJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsJyArXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZicpLnNwbGl0KCcsJylcbiAgLy8gQWRkaXRpb25hbCBrZXlzIGZvciBnZXRPd25Qcm9wZXJ0eU5hbWVzXG4gICwga2V5czIgPSBrZXlzMS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKVxuICAsIGtleXNMZW4xID0ga2V5czEubGVuZ3RoO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gY2VsKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0ga2V5c0xlbjFcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKCc8c2NyaXB0PmRvY3VtZW50LkY9T2JqZWN0PC9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0LnByb3RvdHlwZVtrZXlzMVtpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuZnVuY3Rpb24gY3JlYXRlR2V0S2V5cyhuYW1lcywgbGVuZ3RoKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcbiAgICAgICwgaSAgICAgID0gMFxuICAgICAgLCByZXN1bHQgPSBbXVxuICAgICAgLCBrZXk7XG4gICAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAgIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgICB+JGluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShpdCl7IHJldHVybiAhJC5pc09iamVjdChpdCk7IH1cbmZ1bmN0aW9uIEVtcHR5KCl7fVxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG4gIGdldFByb3RvdHlwZU9mOiAkLmdldFByb3RvID0gJC5nZXRQcm90byB8fCBmdW5jdGlvbihPKXtcbiAgICBPID0gT2JqZWN0KGFzc2VydC5kZWYoTykpO1xuICAgIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICAgIGlmKGlzRnVuY3Rpb24oTy5jb25zdHJ1Y3RvcikgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG4gIH0sXG4gIC8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJC5nZXROYW1lcyA9ICQuZ2V0TmFtZXMgfHwgY3JlYXRlR2V0S2V5cyhrZXlzMiwga2V5czIubGVuZ3RoLCB0cnVlKSxcbiAgLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJC5jcmVhdGUgPSAkLmNyZWF0ZSB8fCBmdW5jdGlvbihPLCAvKj8qL1Byb3BlcnRpZXMpe1xuICAgIHZhciByZXN1bHQ7XG4gICAgaWYoTyAhPT0gbnVsbCl7XG4gICAgICBFbXB0eS5wcm90b3R5cGUgPSBhc3NlcnRPYmplY3QoTyk7XG4gICAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHNoaW1cbiAgICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gICAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbiAgfSxcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG4gIGtleXM6ICQuZ2V0S2V5cyA9ICQuZ2V0S2V5cyB8fCBjcmVhdGVHZXRLZXlzKGtleXMxLCBrZXlzTGVuMSwgZmFsc2UpLFxuICAvLyAxOS4xLjIuMTcgLyAxNS4yLjMuOCBPYmplY3Quc2VhbChPKVxuICBzZWFsOiAkLml0LCAvLyA8LSBjYXBcbiAgLy8gMTkuMS4yLjUgLyAxNS4yLjMuOSBPYmplY3QuZnJlZXplKE8pXG4gIGZyZWV6ZTogJC5pdCwgLy8gPC0gY2FwXG4gIC8vIDE5LjEuMi4xNSAvIDE1LjIuMy4xMCBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcbiAgcHJldmVudEV4dGVuc2lvbnM6ICQuaXQsIC8vIDwtIGNhcFxuICAvLyAxOS4xLjIuMTMgLyAxNS4yLjMuMTEgT2JqZWN0LmlzU2VhbGVkKE8pXG4gIGlzU2VhbGVkOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXG4gIC8vIDE5LjEuMi4xMiAvIDE1LjIuMy4xMiBPYmplY3QuaXNGcm96ZW4oTylcbiAgaXNGcm96ZW46IGlzUHJpbWl0aXZlLCAvLyA8LSBjYXBcbiAgLy8gMTkuMS4yLjExIC8gMTUuMi4zLjEzIE9iamVjdC5pc0V4dGVuc2libGUoTylcbiAgaXNFeHRlbnNpYmxlOiAkLmlzT2JqZWN0IC8vIDwtIGNhcFxufSk7XG5cbi8vIDE5LjIuMy4yIC8gMTUuMy40LjUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQodGhpc0FyZywgYXJncy4uLilcbiRkZWYoJGRlZi5QLCAnRnVuY3Rpb24nLCB7XG4gIGJpbmQ6IGZ1bmN0aW9uKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xuICAgIHZhciBmbiAgICAgICA9IGFzc2VydC5mbih0aGlzKVxuICAgICAgLCBwYXJ0QXJncyA9IF9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgZnVuY3Rpb24gYm91bmQoLyogYXJncy4uLiAqLyl7XG4gICAgICB2YXIgYXJncyA9IHBhcnRBcmdzLmNvbmNhdChfc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoaXMgaW5zdGFuY2VvZiBib3VuZCA/ICQuY3JlYXRlKGZuLnByb3RvdHlwZSkgOiB0aGF0KTtcbiAgICB9XG4gICAgaWYoZm4ucHJvdG90eXBlKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH1cbn0pO1xuXG4vLyBGaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgYW5kIERPTSBvYmplY3RzXG5pZighKDAgaW4gT2JqZWN0KCd6JykgJiYgJ3onWzBdID09ICd6Jykpe1xuICAkLkVTNU9iamVjdCA9IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG4gIH07XG59XG5cbnZhciBidWdneVNsaWNlID0gdHJ1ZTtcbnRyeSB7XG4gIGlmKGh0bWwpX3NsaWNlLmNhbGwoaHRtbCk7XG4gIGJ1Z2d5U2xpY2UgPSBmYWxzZTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBidWdneVNsaWNlLCAnQXJyYXknLCB7XG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShiZWdpbiwgZW5kKXtcbiAgICB2YXIgbGVuICAgPSB0b0xlbmd0aCh0aGlzLmxlbmd0aClcbiAgICAgICwga2xhc3MgPSBjb2YodGhpcyk7XG4gICAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiBlbmQ7XG4gICAgaWYoa2xhc3MgPT0gJ0FycmF5JylyZXR1cm4gX3NsaWNlLmNhbGwodGhpcywgYmVnaW4sIGVuZCk7XG4gICAgdmFyIHN0YXJ0ICA9IHRvSW5kZXgoYmVnaW4sIGxlbilcbiAgICAgICwgdXBUbyAgID0gdG9JbmRleChlbmQsIGxlbilcbiAgICAgICwgc2l6ZSAgID0gdG9MZW5ndGgodXBUbyAtIHN0YXJ0KVxuICAgICAgLCBjbG9uZWQgPSBBcnJheShzaXplKVxuICAgICAgLCBpICAgICAgPSAwO1xuICAgIGZvcig7IGkgPCBzaXplOyBpKyspY2xvbmVkW2ldID0ga2xhc3MgPT0gJ1N0cmluZydcbiAgICAgID8gdGhpcy5jaGFyQXQoc3RhcnQgKyBpKVxuICAgICAgOiB0aGlzW3N0YXJ0ICsgaV07XG4gICAgcmV0dXJuIGNsb25lZDtcbiAgfVxufSk7XG5cbiRkZWYoJGRlZi5QICsgJGRlZi5GICogKCQuRVM1T2JqZWN0ICE9IE9iamVjdCksICdBcnJheScsIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbigpe1xuICAgIHJldHVybiBfam9pbi5hcHBseSgkLkVTNU9iamVjdCh0aGlzKSwgYXJndW1lbnRzKTtcbiAgfVxufSk7XG5cbi8vIDIyLjEuMi4yIC8gMTUuNC4zLjIgQXJyYXkuaXNBcnJheShhcmcpXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xuICBpc0FycmF5OiBmdW5jdGlvbihhcmcpe1xuICAgIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xuICB9XG59KTtcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5UmVkdWNlKGlzUmlnaHQpe1xuICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2tmbiwgbWVtbyl7XG4gICAgYXNzZXJ0LmZuKGNhbGxiYWNrZm4pO1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXG4gICAgICAsIGkgICAgICA9IGlzUmlnaHQgPyAtMSA6IDE7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDIpZm9yKDs7KXtcbiAgICAgIGlmKGluZGV4IGluIE8pe1xuICAgICAgICBtZW1vID0gT1tpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggKz0gaTtcbiAgICAgIGFzc2VydChpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4LCAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgIH1cbiAgICBmb3IoO2lzUmlnaHQgPyBpbmRleCA+PSAwIDogbGVuZ3RoID4gaW5kZXg7IGluZGV4ICs9IGkpaWYoaW5kZXggaW4gTyl7XG4gICAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn1cbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmb3JFYWNoOiAkLmVhY2ggPSAkLmVhY2ggfHwgZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZm9yRWFjaCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy43IC8gMTUuNC40LjIwIEFycmF5LnByb3RvdHlwZS5maWx0ZXIoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbHRlcih0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMjMgLyAxNS40LjQuMTcgQXJyYXkucHJvdG90eXBlLnNvbWUoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkc29tZSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuNSAvIDE1LjQuNC4xNiBBcnJheS5wcm90b3R5cGUuZXZlcnkoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRldmVyeSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMTggLyAxNS40LjQuMjEgQXJyYXkucHJvdG90eXBlLnJlZHVjZShjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXG4gIHJlZHVjZTogY3JlYXRlQXJyYXlSZWR1Y2UoZmFsc2UpLFxuICAvLyAyMi4xLjMuMTkgLyAxNS40LjQuMjIgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcbiAgcmVkdWNlUmlnaHQ6IGNyZWF0ZUFycmF5UmVkdWNlKHRydWUpLFxuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcbiAgICByZXR1cm4gJGluZGV4T2YodGhpcywgZWwsIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy4xNCAvIDE1LjQuNC4xNSBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBsYXN0SW5kZXhPZjogZnVuY3Rpb24oZWwsIGZyb21JbmRleCAvKiA9IEBbKi0xXSAqLyl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSBsZW5ndGggLSAxO1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsICQudG9JbnRlZ2VyKGZyb21JbmRleCkpO1xuICAgIGlmKGluZGV4IDwgMClpbmRleCA9IHRvTGVuZ3RoKGxlbmd0aCArIGluZGV4KTtcbiAgICBmb3IoO2luZGV4ID49IDA7IGluZGV4LS0paWYoaW5kZXggaW4gTylpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIGluZGV4O1xuICAgIHJldHVybiAtMTtcbiAgfVxufSk7XG5cbi8vIDIxLjEuMy4yNSAvIDE1LjUuNC4yMCBTdHJpbmcucHJvdG90eXBlLnRyaW0oKVxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7dHJpbTogcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoL15cXHMqKFtcXHNcXFNdKlxcUyk/XFxzKiQvLCAnJDEnKX0pO1xuXG4vLyAyMC4zLjMuMSAvIDE1LjkuNC40IERhdGUubm93KClcbiRkZWYoJGRlZi5TLCAnRGF0ZScsIHtub3c6IGZ1bmN0aW9uKCl7XG4gIHJldHVybiArbmV3IERhdGU7XG59fSk7XG5cbmZ1bmN0aW9uIGx6KG51bSl7XG4gIHJldHVybiBudW0gPiA5ID8gbnVtIDogJzAnICsgbnVtO1xufVxuXG4vLyAyMC4zLjQuMzYgLyAxNS45LjUuNDMgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcoKVxuLy8gUGhhbnRvbUpTIGFuZCBvbGQgd2Via2l0IGhhZCBhIGJyb2tlbiBEYXRlIGltcGxlbWVudGF0aW9uLlxudmFyIGRhdGUgICAgICAgPSBuZXcgRGF0ZSgtNWUxMyAtIDEpXG4gICwgYnJva2VuRGF0ZSA9ICEoZGF0ZS50b0lTT1N0cmluZyAmJiBkYXRlLnRvSVNPU3RyaW5nKCkgPT0gJzAzODUtMDctMjVUMDc6MDY6MzkuOTk5WidcbiAgICAgICYmIHJlcXVpcmUoJy4vJC50aHJvd3MnKShmdW5jdGlvbigpeyBuZXcgRGF0ZShOYU4pLnRvSVNPU3RyaW5nKCk7IH0pKTtcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogYnJva2VuRGF0ZSwgJ0RhdGUnLCB7dG9JU09TdHJpbmc6IGZ1bmN0aW9uKCl7XG4gIGlmKCFpc0Zpbml0ZSh0aGlzKSl0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIHRpbWUgdmFsdWUnKTtcbiAgdmFyIGQgPSB0aGlzXG4gICAgLCB5ID0gZC5nZXRVVENGdWxsWWVhcigpXG4gICAgLCBtID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKVxuICAgICwgcyA9IHkgPCAwID8gJy0nIDogeSA+IDk5OTkgPyAnKycgOiAnJztcbiAgcmV0dXJuIHMgKyAoJzAwMDAwJyArIE1hdGguYWJzKHkpKS5zbGljZShzID8gLTYgOiAtNCkgK1xuICAgICctJyArIGx6KGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgbHooZC5nZXRVVENEYXRlKCkpICtcbiAgICAnVCcgKyBseihkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgbHooZC5nZXRVVENNaW51dGVzKCkpICtcbiAgICAnOicgKyBseihkLmdldFVUQ1NlY29uZHMoKSkgKyAnLicgKyAobSA+IDk5ID8gbSA6ICcwJyArIGx6KG0pKSArICdaJztcbn19KTtcblxuaWYoY2xhc3NvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdPYmplY3QnKWNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGFnID0gY2xhc3NvZihpdCk7XG4gIHJldHVybiB0YWcgPT0gJ09iamVjdCcgJiYgaXNGdW5jdGlvbihpdC5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiB0YWc7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgdG9JbmRleCA9ICQudG9JbmRleDtcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxuICBjb3B5V2l0aGluOiBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcbiAgICB2YXIgTyAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBsZW4gICA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcbiAgICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXG4gICAgICAsIGVuZCAgID0gYXJndW1lbnRzWzJdXG4gICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxuICAgICAgLCBjb3VudCA9IE1hdGgubWluKGZpbiAtIGZyb20sIGxlbiAtIHRvKVxuICAgICAgLCBpbmMgICA9IDE7XG4gICAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcbiAgICAgIGluYyAgPSAtMTtcbiAgICAgIGZyb20gPSBmcm9tICsgY291bnQgLSAxO1xuICAgICAgdG8gICA9IHRvICAgKyBjb3VudCAtIDE7XG4gICAgfVxuICAgIHdoaWxlKGNvdW50LS0gPiAwKXtcbiAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XG4gICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIHRvICAgKz0gaW5jO1xuICAgICAgZnJvbSArPSBpbmM7XG4gICAgfSByZXR1cm4gTztcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdjb3B5V2l0aGluJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b0luZGV4ID0gJC50b0luZGV4O1xuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4gIGZpbGw6IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XG4gICAgdmFyIE8gICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXG4gICAgICAsIGVuZCAgICA9IGFyZ3VtZW50c1syXVxuICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xuICAgIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcbiAgICByZXR1cm4gTztcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdmaWxsJyk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgS0VZICAgID0gJ2ZpbmRJbmRleCdcbiAgLCAkZGVmICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JjZWQgPSB0cnVlXG4gICwgJGZpbmQgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKSg2KTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgS0VZICAgID0gJ2ZpbmQnXG4gICwgJGRlZiAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgZm9yY2VkID0gdHJ1ZVxuICAsICRmaW5kICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNSk7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYoS0VZIGluIFtdKUFycmF5KDEpW0tFWV0oZnVuY3Rpb24oKXsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZDogZnVuY3Rpb24gZmluZChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoS0VZKTsiLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBjYWxsICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxuICAgICAgLCBtYXBmbiAgID0gYXJndW1lbnRzWzFdXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXG4gICAgICAsIGluZGV4ICAgPSAwXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZigkaXRlci5pcyhPKSl7XG4gICAgICBpdGVyYXRvciA9ICRpdGVyLmdldChPKTtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXG4gICAgICByZXN1bHQgICA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSk7XG4gICAgICBmb3IoOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIGYsIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cbiAgICAgIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aCkpO1xuICAgICAgZm9yKDsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNldFVuc2NvcGUgPSByZXF1aXJlKCcuLyQudW5zY29wZScpXG4gICwgSVRFUiAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcbiAgLCAkaXRlciAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIHN0ZXAgICAgICAgPSAkaXRlci5zdGVwXG4gICwgSXRlcmF0b3JzICA9ICRpdGVyLkl0ZXJhdG9ycztcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgJC5zZXQodGhpcywgSVRFUiwge286ICQudG9PYmplY3QoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAsIE8gICAgID0gaXRlci5vXG4gICAgLCBraW5kICA9IGl0ZXIua1xuICAgICwgaW5kZXggPSBpdGVyLmkrKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuc2V0VW5zY29wZSgna2V5cycpO1xuc2V0VW5zY29wZSgndmFsdWVzJyk7XG5zZXRVbnNjb3BlKCdlbnRyaWVzJyk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXG4gIG9mOiBmdW5jdGlvbiBvZigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICAgICAgLCByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCk7XG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsInJlcXVpcmUoJy4vJC5zcGVjaWVzJykoQXJyYXkpOyIsInZhciAkICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBIQVNfSU5TVEFOQ0UgID0gcmVxdWlyZSgnLi8kLndrcycpKCdoYXNJbnN0YW5jZScpXG4gICwgRnVuY3Rpb25Qcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbi8vIDE5LjIuMy42IEZ1bmN0aW9uLnByb3RvdHlwZVtAQGhhc0luc3RhbmNlXShWKVxuaWYoIShIQVNfSU5TVEFOQ0UgaW4gRnVuY3Rpb25Qcm90bykpJC5zZXREZXNjKEZ1bmN0aW9uUHJvdG8sIEhBU19JTlNUQU5DRSwge3ZhbHVlOiBmdW5jdGlvbihPKXtcbiAgaWYoISQuaXNGdW5jdGlvbih0aGlzKSB8fCAhJC5pc09iamVjdChPKSlyZXR1cm4gZmFsc2U7XG4gIGlmKCEkLmlzT2JqZWN0KHRoaXMucHJvdG90eXBlKSlyZXR1cm4gTyBpbnN0YW5jZW9mIHRoaXM7XG4gIC8vIGZvciBlbnZpcm9ubWVudCB3L28gbmF0aXZlIGBAQGhhc0luc3RhbmNlYCBsb2dpYyBlbm91Z2ggYGluc3RhbmNlb2ZgLCBidXQgYWRkIHRoaXM6XG4gIHdoaWxlKE8gPSAkLmdldFByb3RvKE8pKWlmKHRoaXMucHJvdG90eXBlID09PSBPKXJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59fSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIE5BTUUgPSAnbmFtZSdcbiAgLCBzZXREZXNjID0gJC5zZXREZXNjXG4gICwgRnVuY3Rpb25Qcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRnVuY3Rpb25Qcm90byB8fCAkLkZXICYmICQuREVTQyAmJiBzZXREZXNjKEZ1bmN0aW9uUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1hdGNoID0gU3RyaW5nKHRoaXMpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLylcbiAgICAgICwgbmFtZSAgPSBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG4gICAgJC5oYXModGhpcywgTkFNRSkgfHwgc2V0RGVzYyh0aGlzLCBOQU1FLCAkLmRlc2MoNSwgbmFtZSkpO1xuICAgIHJldHVybiBuYW1lO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYygwLCB2YWx1ZSkpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ01hcCcsIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwidmFyIEluZmluaXR5ID0gMSAvIDBcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIEUgICAgID0gTWF0aC5FXG4gICwgcG93ICAgPSBNYXRoLnBvd1xuICAsIGFicyAgID0gTWF0aC5hYnNcbiAgLCBleHAgICA9IE1hdGguZXhwXG4gICwgbG9nICAgPSBNYXRoLmxvZ1xuICAsIHNxcnQgID0gTWF0aC5zcXJ0XG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcbiAgLCBFUFNJTE9OICAgPSBwb3coMiwgLTUyKVxuICAsIEVQU0lMT04zMiA9IHBvdygyLCAtMjMpXG4gICwgTUFYMzIgICAgID0gcG93KDIsIDEyNykgKiAoMiAtIEVQU0lMT04zMilcbiAgLCBNSU4zMiAgICAgPSBwb3coMiwgLTEyNik7XG5mdW5jdGlvbiByb3VuZFRpZXNUb0V2ZW4obil7XG4gIHJldHVybiBuICsgMSAvIEVQU0lMT04gLSAxIC8gRVBTSUxPTjtcbn1cblxuLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxuZnVuY3Rpb24gc2lnbih4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xufVxuLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxuZnVuY3Rpb24gYXNpbmgoeCl7XG4gIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogbG9nKHggKyBzcXJ0KHggKiB4ICsgMSkpO1xufVxuLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbmZ1bmN0aW9uIGV4cG0xKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcbn1cblxuJGRlZigkZGVmLlMsICdNYXRoJywge1xuICAvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXG4gIGFjb3NoOiBmdW5jdGlvbiBhY29zaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcbiAgfSxcbiAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxuICBhc2luaDogYXNpbmgsXG4gIC8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcbiAgYXRhbmg6IGZ1bmN0aW9uIGF0YW5oKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xuICB9LFxuICAvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcbiAgY2JydDogZnVuY3Rpb24gY2JydCh4KXtcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xuICB9LFxuICAvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxuICBjbHozMjogZnVuY3Rpb24gY2x6MzIoeCl7XG4gICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMSAtIGZsb29yKGxvZyh4ICsgMC41KSAqIE1hdGguTE9HMkUpIDogMzI7XG4gIH0sXG4gIC8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcbiAgY29zaDogZnVuY3Rpb24gY29zaCh4KXtcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xuICB9LFxuICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxuICBleHBtMTogZXhwbTEsXG4gIC8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxuICBmcm91bmQ6IGZ1bmN0aW9uIGZyb3VuZCh4KXtcbiAgICB2YXIgJGFicyAgPSBhYnMoeClcbiAgICAgICwgJHNpZ24gPSBzaWduKHgpXG4gICAgICAsIGEsIHJlc3VsdDtcbiAgICBpZigkYWJzIDwgTUlOMzIpcmV0dXJuICRzaWduICogcm91bmRUaWVzVG9FdmVuKCRhYnMgLyBNSU4zMiAvIEVQU0lMT04zMikgKiBNSU4zMiAqIEVQU0lMT04zMjtcbiAgICBhID0gKDEgKyBFUFNJTE9OMzIgLyBFUFNJTE9OKSAqICRhYnM7XG4gICAgcmVzdWx0ID0gYSAtIChhIC0gJGFicyk7XG4gICAgaWYocmVzdWx0ID4gTUFYMzIgfHwgcmVzdWx0ICE9IHJlc3VsdClyZXR1cm4gJHNpZ24gKiBJbmZpbml0eTtcbiAgICByZXR1cm4gJHNpZ24gKiByZXN1bHQ7XG4gIH0sXG4gIC8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHN1bSAgPSAwXG4gICAgICAsIGxlbjEgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGxlbjIgPSBsZW4xXG4gICAgICAsIGFyZ3MgPSBBcnJheShsZW4xKVxuICAgICAgLCBsYXJnID0gMFxuICAgICAgLCBhcmc7XG4gICAgd2hpbGUobGVuMS0tKXtcbiAgICAgIGFyZyA9IGFyZ3NbbGVuMV0gPSBhYnMoYXJndW1lbnRzW2xlbjFdKTtcbiAgICAgIGlmKGFyZyA9PSBJbmZpbml0eSlyZXR1cm4gSW5maW5pdHk7XG4gICAgICBpZihhcmcgPiBsYXJnKWxhcmcgPSBhcmc7XG4gICAgfVxuICAgIGxhcmcgPSBsYXJnIHx8IDE7XG4gICAgd2hpbGUobGVuMi0tKXN1bSArPSBwb3coYXJnc1tsZW4yXSAvIGxhcmcsIDIpO1xuICAgIHJldHVybiBsYXJnICogc3FydChzdW0pO1xuICB9LFxuICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSl7XG4gICAgdmFyIFVJbnQxNiA9IDB4ZmZmZlxuICAgICAgLCB4biA9ICt4XG4gICAgICAsIHluID0gK3lcbiAgICAgICwgeGwgPSBVSW50MTYgJiB4blxuICAgICAgLCB5bCA9IFVJbnQxNiAmIHluO1xuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XG4gIH0sXG4gIC8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXG4gIGxvZzFwOiBmdW5jdGlvbiBsb2cxcCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPiAtMWUtOCAmJiB4IDwgMWUtOCA/IHggLSB4ICogeCAvIDIgOiBsb2coMSArIHgpO1xuICB9LFxuICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCl7XG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4xMDtcbiAgfSxcbiAgLy8gMjAuMi4yLjIyIE1hdGgubG9nMih4KVxuICBsb2cyOiBmdW5jdGlvbiBsb2cyKHgpe1xuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcbiAgfSxcbiAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxuICBzaWduOiBzaWduLFxuICAvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXG4gIHNpbmg6IGZ1bmN0aW9uIHNpbmgoeCl7XG4gICAgcmV0dXJuIGFicyh4ID0gK3gpIDwgMSA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoRSAvIDIpO1xuICB9LFxuICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXG4gIHRhbmg6IGZ1bmN0aW9uIHRhbmgoeCl7XG4gICAgdmFyIGEgPSBleHBtMSh4ID0gK3gpXG4gICAgICAsIGIgPSBleHBtMSgteCk7XG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcbiAgdHJ1bmM6IGZ1bmN0aW9uIHRydW5jKGl0KXtcbiAgICByZXR1cm4gKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaXNPYmplY3QgICA9ICQuaXNPYmplY3RcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uXG4gICwgTlVNQkVSICAgICA9ICdOdW1iZXInXG4gICwgJE51bWJlciAgICA9ICQuZ1tOVU1CRVJdXG4gICwgQmFzZSAgICAgICA9ICROdW1iZXJcbiAgLCBwcm90byAgICAgID0gJE51bWJlci5wcm90b3R5cGU7XG5mdW5jdGlvbiB0b1ByaW1pdGl2ZShpdCl7XG4gIHZhciBmbiwgdmFsO1xuICBpZihpc0Z1bmN0aW9uKGZuID0gaXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZihpc0Z1bmN0aW9uKGZuID0gaXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gbnVtYmVyXCIpO1xufVxuZnVuY3Rpb24gdG9OdW1iZXIoaXQpe1xuICBpZihpc09iamVjdChpdCkpaXQgPSB0b1ByaW1pdGl2ZShpdCk7XG4gIGlmKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyAmJiBpdC5sZW5ndGggPiAyICYmIGl0LmNoYXJDb2RlQXQoMCkgPT0gNDgpe1xuICAgIHZhciBiaW5hcnkgPSBmYWxzZTtcbiAgICBzd2l0Y2goaXQuY2hhckNvZGVBdCgxKSl7XG4gICAgICBjYXNlIDY2IDogY2FzZSA5OCAgOiBiaW5hcnkgPSB0cnVlO1xuICAgICAgY2FzZSA3OSA6IGNhc2UgMTExIDogcmV0dXJuIHBhcnNlSW50KGl0LnNsaWNlKDIpLCBiaW5hcnkgPyAyIDogOCk7XG4gICAgfVxuICB9IHJldHVybiAraXQ7XG59XG5pZigkLkZXICYmICEoJE51bWJlcignMG8xJykgJiYgJE51bWJlcignMGIxJykpKXtcbiAgJE51bWJlciA9IGZ1bmN0aW9uIE51bWJlcihpdCl7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiAkTnVtYmVyID8gbmV3IEJhc2UodG9OdW1iZXIoaXQpKSA6IHRvTnVtYmVyKGl0KTtcbiAgfTtcbiAgJC5lYWNoLmNhbGwoJC5ERVNDID8gJC5nZXROYW1lcyhCYXNlKSA6IChcbiAgICAgIC8vIEVTMzpcbiAgICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcbiAgICAgIC8vIEVTNiAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTNiBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICAgJ0VQU0lMT04saXNGaW5pdGUsaXNJbnRlZ2VyLGlzTmFOLGlzU2FmZUludGVnZXIsTUFYX1NBRkVfSU5URUdFUiwnICtcbiAgICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xuICAgICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgIGlmKCQuaGFzKEJhc2UsIGtleSkgJiYgISQuaGFzKCROdW1iZXIsIGtleSkpe1xuICAgICAgICAkLnNldERlc2MoJE51bWJlciwga2V5LCAkLmdldERlc2MoQmFzZSwga2V5KSk7XG4gICAgICB9XG4gICAgfVxuICApO1xuICAkTnVtYmVyLnByb3RvdHlwZSA9IHByb3RvO1xuICBwcm90by5jb25zdHJ1Y3RvciA9ICROdW1iZXI7XG4gIHJlcXVpcmUoJy4vJC5yZWRlZicpKCQuZywgTlVNQkVSLCAkTnVtYmVyKTtcbn0iLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYWJzICAgPSBNYXRoLmFic1xuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIF9pc0Zpbml0ZSA9ICQuZy5pc0Zpbml0ZVxuICAsIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFmZmZmZmZmZmZmZmZmOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxO1xuZnVuY3Rpb24gaXNJbnRlZ2VyKGl0KXtcbiAgcmV0dXJuICEkLmlzT2JqZWN0KGl0KSAmJiBfaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XG59XG4kZGVmKCRkZWYuUywgJ051bWJlcicsIHtcbiAgLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cbiAgRVBTSUxPTjogTWF0aC5wb3coMiwgLTUyKSxcbiAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uIGlzRmluaXRlKGl0KXtcbiAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIF9pc0Zpbml0ZShpdCk7XG4gIH0sXG4gIC8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcbiAgaXNOYU46IGZ1bmN0aW9uIGlzTmFOKG51bWJlcil7XG4gICAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XG4gIH0sXG4gIC8vIDIwLjEuMi41IE51bWJlci5pc1NhZmVJbnRlZ2VyKG51bWJlcilcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpe1xuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xuICB9LFxuICAvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxuICAvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbiAgTUlOX1NBRkVfSU5URUdFUjogLU1BWF9TQUZFX0lOVEVHRVIsXG4gIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXG4gIHBhcnNlRmxvYXQ6IHBhcnNlRmxvYXQsXG4gIC8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcbiAgcGFyc2VJbnQ6IHBhcnNlSW50XG59KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vJC5hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xuICBpczogZnVuY3Rpb24gaXMoeCwgeSl7XG4gICAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG4gIH1cbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0fSk7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdDtcbiQuZWFjaC5jYWxsKCgnZnJlZXplLHNlYWwscHJldmVudEV4dGVuc2lvbnMsaXNGcm96ZW4saXNTZWFsZWQsaXNFeHRlbnNpYmxlLCcgK1xuICAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLGdldFByb3RvdHlwZU9mLGtleXMsZ2V0T3duUHJvcGVydHlOYW1lcycpLnNwbGl0KCcsJylcbiwgZnVuY3Rpb24oS0VZLCBJRCl7XG4gIHZhciBmbiAgICAgPSAoJC5jb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZm9yY2VkID0gMFxuICAgICwgbWV0aG9kID0ge307XG4gIG1ldGhvZFtLRVldID0gSUQgPT0gMCA/IGZ1bmN0aW9uIGZyZWV6ZShpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMSA/IGZ1bmN0aW9uIHNlYWwoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcbiAgfSA6IElEID09IDIgPyBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyhpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMyA/IGZ1bmN0aW9uIGlzRnJvemVuKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcbiAgfSA6IElEID09IDQgPyBmdW5jdGlvbiBpc1NlYWxlZChpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IHRydWU7XG4gIH0gOiBJRCA9PSA1ID8gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XG4gIH0gOiBJRCA9PSA2ID8gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XG4gIH0gOiBJRCA9PSA3ID8gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YoaXQpe1xuICAgIHJldHVybiBmbihPYmplY3QoJC5hc3NlcnREZWZpbmVkKGl0KSkpO1xuICB9IDogSUQgPT0gOCA/IGZ1bmN0aW9uIGtleXMoaXQpe1xuICAgIHJldHVybiBmbih0b09iamVjdChpdCkpO1xuICB9IDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XG4gIH07XG4gIHRyeSB7XG4gICAgZm4oJ3onKTtcbiAgfSBjYXRjaChlKXtcbiAgICBmb3JjZWQgPSAxO1xuICB9XG4gICRkZWYoJGRlZi5TICsgJGRlZi5GICogZm9yY2VkLCAnT2JqZWN0JywgbWV0aG9kKTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIHRtcCA9IHt9O1xudG1wW3JlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKV0gPSAneic7XG5pZihyZXF1aXJlKCcuLyQnKS5GVyAmJiBjb2YodG1wKSAhPSAneicpe1xuICByZXF1aXJlKCcuLyQucmVkZWYnKShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiAnW29iamVjdCAnICsgY29mLmNsYXNzb2YodGhpcykgKyAnXSc7XG4gIH0sIHRydWUpO1xufSIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjb2YgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYXNzZXJ0ICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBmb3JPZiAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHNldFByb3RvID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNwZWNpZXMgID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJylcbiAgLCBSRUNPUkQgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdyZWNvcmQnKVxuICAsIFBST01JU0UgID0gJ1Byb21pc2UnXG4gICwgZ2xvYmFsICAgPSAkLmdcbiAgLCBwcm9jZXNzICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgYXNhcCAgICAgPSBwcm9jZXNzICYmIHByb2Nlc3MubmV4dFRpY2sgfHwgcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcbiAgLCBQICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIGlzRnVuY3Rpb24gICAgID0gJC5pc0Z1bmN0aW9uXG4gICwgaXNPYmplY3QgICAgICAgPSAkLmlzT2JqZWN0XG4gICwgYXNzZXJ0RnVuY3Rpb24gPSBhc3NlcnQuZm5cbiAgLCBhc3NlcnRPYmplY3QgICA9IGFzc2VydC5vYmo7XG5cbnZhciB1c2VOYXRpdmUgPSBmdW5jdGlvbigpe1xuICB2YXIgdGVzdCwgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBpc0Z1bmN0aW9uKFApICYmIGlzRnVuY3Rpb24oUC5yZXNvbHZlKSAmJiBQLnJlc29sdmUodGVzdCA9IG5ldyBQKGZ1bmN0aW9uKCl7fSkpID09IHRlc3Q7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xuZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3IoQyl7XG4gIHZhciBTID0gYXNzZXJ0T2JqZWN0KEMpW1NQRUNJRVNdO1xuICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcbn1cbmZ1bmN0aW9uIGlzVGhlbmFibGUoaXQpe1xuICB2YXIgdGhlbjtcbiAgaWYoaXNPYmplY3QoaXQpKXRoZW4gPSBpdC50aGVuO1xuICByZXR1cm4gaXNGdW5jdGlvbih0aGVuKSA/IHRoZW4gOiBmYWxzZTtcbn1cbmZ1bmN0aW9uIG5vdGlmeShyZWNvcmQpe1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgaWYoY2hhaW4ubGVuZ3RoKWFzYXAoZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSByZWNvcmQudlxuICAgICAgLCBvayAgICA9IHJlY29yZC5zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIGZ1bmN0aW9uIHJ1bihyZWFjdCl7XG4gICAgICB2YXIgY2IgPSBvayA/IHJlYWN0Lm9rIDogcmVhY3QuZmFpbFxuICAgICAgICAsIHJldCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGNiKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJldCA9IGNiID09PSB0cnVlID8gdmFsdWUgOiBjYih2YWx1ZSk7XG4gICAgICAgICAgaWYocmV0ID09PSByZWFjdC5QKXtcbiAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJldCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJldCwgcmVhY3QucmVzLCByZWFjdC5yZWopO1xuICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcbiAgICAgICAgfSBlbHNlIHJlYWN0LnJlaih2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHJlYWN0LnJlaihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzVW5oYW5kbGVkKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXG4gICAgLCBjaGFpbiAgPSByZWNvcmQuYSB8fCByZWNvcmQuY1xuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVhY3Q7XG4gIGlmKHJlY29yZC5oKXJldHVybiBmYWxzZTtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3QgPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0LmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0LlApKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uICRyZWplY3QodmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgcHJvbWlzZTtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSA9IHJlY29yZC5wKSl7XG4gICAgICAgIGlmKGNvZihwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoZ2xvYmFsLmNvbnNvbGUgJiYgaXNGdW5jdGlvbihjb25zb2xlLmVycm9yKSl7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZWNvcmQuYSA9IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfSwgMSk7XG4gIG5vdGlmeShyZWNvcmQpO1xufVxuZnVuY3Rpb24gJHJlc29sdmUodmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgdGhlbiwgd3JhcHBlcjtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQpO1xuICAgIH1cbiAgfSBjYXRjaChlcnIpe1xuICAgICRyZWplY3QuY2FsbCh3cmFwcGVyIHx8IHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZXJyKTsgLy8gd3JhcFxuICB9XG59XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighdXNlTmF0aXZlKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFzc2VydEZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgcDogYXNzZXJ0Lmluc3QodGhpcywgUCwgUFJPTUlTRSksICAgICAgIC8vIDwtIHByb21pc2VcbiAgICAgIGM6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICAgIGE6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgICAgczogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgICBkOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gZG9uZVxuICAgICAgdjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICBoOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gaGFuZGxlZCByZWplY3Rpb25cbiAgICB9O1xuICAgICQuaGlkZSh0aGlzLCBSRUNPUkQsIHJlY29yZCk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbChyZWNvcmQsIGVycik7XG4gICAgfVxuICB9O1xuICByZXF1aXJlKCcuLyQubWl4JykoUC5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoYXNzZXJ0T2JqZWN0KHRoaXMpLmNvbnN0cnVjdG9yKVtTUEVDSUVTXTtcbiAgICAgIHZhciByZWFjdCA9IHtcbiAgICAgICAgb2s6ICAgaXNGdW5jdGlvbihvbkZ1bGZpbGxlZCkgPyBvbkZ1bGZpbGxlZCA6IHRydWUsXG4gICAgICAgIGZhaWw6IGlzRnVuY3Rpb24ob25SZWplY3RlZCkgID8gb25SZWplY3RlZCAgOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHZhciBwcm9taXNlID0gcmVhY3QuUCA9IG5ldyAoUyAhPSB1bmRlZmluZWQgPyBTIDogUCkoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgICByZWFjdC5yZXMgPSBhc3NlcnRGdW5jdGlvbihyZXMpO1xuICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWopO1xuICAgICAgfSk7XG4gICAgICB2YXIgcmVjb3JkID0gdGhpc1tSRUNPUkRdO1xuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XG4gICAgICBpZihyZWNvcmQuYSlyZWNvcmQuYS5wdXNoKHJlYWN0KTtcbiAgICAgIHJlY29yZC5zICYmIG5vdGlmeShyZWNvcmQpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIGV4cG9ydFxuJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCB7UHJvbWlzZTogUH0pO1xuY29mLnNldChQLCBQUk9NSVNFKTtcbnNwZWNpZXMoUCk7XG5zcGVjaWVzKCQuY29yZVtQUk9NSVNFXSk7IC8vIGZvciB3cmFwcGVyXG5cbi8vIHN0YXRpY3NcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICByZXR1cm4gbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgcmVqKHIpO1xuICAgIH0pO1xuICB9LFxuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICByZXR1cm4gaXNPYmplY3QoeCkgJiYgUkVDT1JEIGluIHggJiYgJC5nZXRQcm90byh4KSA9PT0gdGhpcy5wcm90b3R5cGVcbiAgICAgID8geCA6IG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgIHJlcyh4KTtcbiAgICAgIH0pO1xuICB9XG59KTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISh1c2VOYXRpdmUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgdmFsdWVzID0gW107XG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlcyhyZXN1bHRzKTtcbiAgICAgICAgfSwgcmVqKTtcbiAgICAgIH0pO1xuICAgICAgZWxzZSByZXMocmVzdWx0cyk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzLCByZWopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pOyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHNldFByb3RvICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKVxuICAsICRpdGVyICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJVEVSICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgc3RlcCAgICAgID0gJGl0ZXIuc3RlcFxuICAsIGFzc2VydCAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcbiAgLCBnZXRQcm90byAgPSAkLmdldFByb3RvXG4gICwgJFJlZmxlY3QgID0gJC5nLlJlZmxlY3RcbiAgLCBfYXBwbHkgICAgPSBGdW5jdGlvbi5hcHBseVxuICAsIGFzc2VydE9iamVjdCA9IGFzc2VydC5vYmpcbiAgLCBfaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCAkLmlzT2JqZWN0XG4gICwgX3ByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zIHx8ICQuaXRcbiAgLy8gSUUgVFAgaGFzIGJyb2tlbiBSZWZsZWN0LmVudW1lcmF0ZVxuICAsIGJ1Z2d5RW51bWVyYXRlID0gISgkUmVmbGVjdCAmJiAkUmVmbGVjdC5lbnVtZXJhdGUgJiYgSVRFUkFUT1IgaW4gJFJlZmxlY3QuZW51bWVyYXRlKHt9KSk7XG5cbmZ1bmN0aW9uIEVudW1lcmF0ZShpdGVyYXRlZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazogdW5kZWZpbmVkLCBpOiAwfSk7XG59XG4kaXRlci5jcmVhdGUoRW51bWVyYXRlLCAnT2JqZWN0JywgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXG4gICAgLCBrZXlzID0gaXRlci5rXG4gICAgLCBrZXk7XG4gIGlmKGtleXMgPT0gdW5kZWZpbmVkKXtcbiAgICBpdGVyLmsgPSBrZXlzID0gW107XG4gICAgZm9yKGtleSBpbiBpdGVyLm8pa2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgZG8ge1xuICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcbiAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XG4gIHJldHVybiBzdGVwKDAsIGtleSk7XG59KTtcblxudmFyIHJlZmxlY3QgPSB7XG4gIC8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxuICBhcHBseTogZnVuY3Rpb24gYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3Qpe1xuICAgIHJldHVybiBfYXBwbHkuY2FsbCh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCk7XG4gIH0sXG4gIC8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XG4gICAgdmFyIHByb3RvICAgID0gYXNzZXJ0LmZuKGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdKS5wcm90b3R5cGVcbiAgICAgICwgaW5zdGFuY2UgPSAkLmNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICAsIHJlc3VsdCAgID0gX2FwcGx5LmNhbGwodGFyZ2V0LCBpbnN0YW5jZSwgYXJndW1lbnRzTGlzdCk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcbiAgfSxcbiAgLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpe1xuICAgIGFzc2VydE9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICAkLnNldERlc2ModGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHZhciBkZXNjID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcbiAgfSxcbiAgLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxuICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXG4gICAgICAsIGRlc2MgPSAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XG4gICAgaWYoZGVzYylyZXR1cm4gJC5oYXMoZGVzYywgJ3ZhbHVlJylcbiAgICAgID8gZGVzYy52YWx1ZVxuICAgICAgOiBkZXNjLmdldCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSlcbiAgICAgID8gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfSxcbiAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHJldHVybiAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgfSxcbiAgLy8gMjYuMS44IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVxuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KXtcbiAgICByZXR1cm4gZ2V0UHJvdG8oYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9LFxuICAvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcbiAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuIHByb3BlcnR5S2V5IGluIHRhcmdldDtcbiAgfSxcbiAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKHRhcmdldCl7XG4gICAgcmV0dXJuIF9pc0V4dGVuc2libGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9LFxuICAvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXG4gIG93bktleXM6IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpLFxuICAvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcbiAgICBhc3NlcnRPYmplY3QodGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgX3ByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxuICAgICAgLCBvd25EZXNjICA9ICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpXG4gICAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XG4gICAgaWYoIW93bkRlc2Mpe1xuICAgICAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90byh0YXJnZXQpKSl7XG4gICAgICAgIHJldHVybiBzZXQocHJvdG8sIHByb3BlcnR5S2V5LCBWLCByZWNlaXZlcik7XG4gICAgICB9XG4gICAgICBvd25EZXNjID0gJC5kZXNjKDApO1xuICAgIH1cbiAgICBpZigkLmhhcyhvd25EZXNjLCAndmFsdWUnKSl7XG4gICAgICBpZihvd25EZXNjLndyaXRhYmxlID09PSBmYWxzZSB8fCAhaXNPYmplY3QocmVjZWl2ZXIpKXJldHVybiBmYWxzZTtcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9ICQuZ2V0RGVzYyhyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8ICQuZGVzYygwKTtcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XG4gICAgICAkLnNldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xuICB9XG59O1xuLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXG5pZihzZXRQcm90bylyZWZsZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byl7XG4gIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xuICB0cnkge1xuICAgIHNldFByb3RvLnNldCh0YXJnZXQsIHByb3RvKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbiRkZWYoJGRlZi5HLCB7UmVmbGVjdDoge319KTtcblxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiBidWdneUVudW1lcmF0ZSwgJ1JlZmxlY3QnLCB7XG4gIC8vIDI2LjEuNSBSZWZsZWN0LmVudW1lcmF0ZSh0YXJnZXQpXG4gIGVudW1lcmF0ZTogZnVuY3Rpb24gZW51bWVyYXRlKHRhcmdldCl7XG4gICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9XG59KTtcblxuJGRlZigkZGVmLlMsICdSZWZsZWN0JywgcmVmbGVjdCk7IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkUmVnRXhwID0gJC5nLlJlZ0V4cFxuICAsIEJhc2UgICAgPSAkUmVnRXhwXG4gICwgcHJvdG8gICA9ICRSZWdFeHAucHJvdG90eXBlXG4gICwgcmUgICAgICA9IC9hL2dcbiAgLy8gXCJuZXdcIiBjcmVhdGVzIGEgbmV3IG9iamVjdFxuICAsIENPUlJFQ1RfTkVXID0gbmV3ICRSZWdFeHAocmUpICE9PSByZVxuICAvLyBSZWdFeHAgYWxsb3dzIGEgcmVnZXggd2l0aCBmbGFncyBhcyB0aGUgcGF0dGVyblxuICAsIEFMTE9XU19SRV9XSVRIX0ZMQUdTID0gZnVuY3Rpb24oKXtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICRSZWdFeHAocmUsICdpJykgPT0gJy9hL2knO1xuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgfSgpO1xuaWYoJC5GVyAmJiAkLkRFU0Mpe1xuICBpZighQ09SUkVDVF9ORVcgfHwgIUFMTE9XU19SRV9XSVRIX0ZMQUdTKXtcbiAgICAkUmVnRXhwID0gZnVuY3Rpb24gUmVnRXhwKHBhdHRlcm4sIGZsYWdzKXtcbiAgICAgIHZhciBwYXR0ZXJuSXNSZWdFeHAgID0gY29mKHBhdHRlcm4pID09ICdSZWdFeHAnXG4gICAgICAgICwgZmxhZ3NJc1VuZGVmaW5lZCA9IGZsYWdzID09PSB1bmRlZmluZWQ7XG4gICAgICBpZighKHRoaXMgaW5zdGFuY2VvZiAkUmVnRXhwKSAmJiBwYXR0ZXJuSXNSZWdFeHAgJiYgZmxhZ3NJc1VuZGVmaW5lZClyZXR1cm4gcGF0dGVybjtcbiAgICAgIHJldHVybiBDT1JSRUNUX05FV1xuICAgICAgICA/IG5ldyBCYXNlKHBhdHRlcm5Jc1JlZ0V4cCAmJiAhZmxhZ3NJc1VuZGVmaW5lZCA/IHBhdHRlcm4uc291cmNlIDogcGF0dGVybiwgZmxhZ3MpXG4gICAgICAgIDogbmV3IEJhc2UocGF0dGVybklzUmVnRXhwID8gcGF0dGVybi5zb3VyY2UgOiBwYXR0ZXJuXG4gICAgICAgICAgLCBwYXR0ZXJuSXNSZWdFeHAgJiYgZmxhZ3NJc1VuZGVmaW5lZCA/IHBhdHRlcm4uZmxhZ3MgOiBmbGFncyk7XG4gICAgfTtcbiAgICAkLmVhY2guY2FsbCgkLmdldE5hbWVzKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xuICAgICAga2V5IGluICRSZWdFeHAgfHwgJC5zZXREZXNjKCRSZWdFeHAsIGtleSwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIEJhc2Vba2V5XTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbihpdCl7IEJhc2Vba2V5XSA9IGl0OyB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm90by5jb25zdHJ1Y3RvciA9ICRSZWdFeHA7XG4gICAgJFJlZ0V4cC5wcm90b3R5cGUgPSBwcm90bztcbiAgICByZXF1aXJlKCcuLyQucmVkZWYnKSgkLmcsICdSZWdFeHAnLCAkUmVnRXhwKTtcbiAgfVxuICAvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG4gIGlmKC8uL2cuZmxhZ3MgIT0gJ2cnKSQuc2V0RGVzYyhwcm90bywgJ2ZsYWdzJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eLipcXC8oXFx3KikkLywgJyQxJylcbiAgfSk7XG59XG5yZXF1aXJlKCcuLyQuc3BlY2llcycpKCRSZWdFeHApOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnU2V0Jywge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykoZmFsc2UpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxuICBjb2RlUG9pbnRBdDogZnVuY3Rpb24gY29kZVBvaW50QXQocG9zKXtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvTGVuZ3RoID0gJC50b0xlbmd0aDtcblxuLy8gc2hvdWxkIHRocm93IGVycm9yIG9uIHJlZ2V4XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgJ3EnLmVuZHNXaXRoKC8uLyk7IH0pLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXG4gIGVuZHNXaXRoOiBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2hTdHJpbmcgLyosIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgdmFyIHRoYXQgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1sxXVxuICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcbiAgICAgICwgZW5kID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoU3RyaW5nLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoU3RyaW5nO1xuICB9XG59KTsiLCJ2YXIgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvSW5kZXggPSByZXF1aXJlKCcuLyQnKS50b0luZGV4XG4gICwgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAsICRmcm9tQ29kZVBvaW50ID0gU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cbi8vIGxlbmd0aCBzaG91bGQgYmUgMSwgb2xkIEZGIHByb2JsZW1cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKCEhJGZyb21Db2RlUG9pbnQgJiYgJGZyb21Db2RlUG9pbnQubGVuZ3RoICE9IDEpLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHJlcyA9IFtdXG4gICAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaSAgID0gMFxuICAgICAgLCBjb2RlO1xuICAgIHdoaWxlKGxlbiA+IGkpe1xuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcbiAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xuICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxuICAgICAgKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy43IFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbiA9IDApXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICEhflN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTsiLCJ2YXIgc2V0ICAgPSByZXF1aXJlKCcuLyQnKS5zZXRcbiAgLCAkYXQgICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKVxuICAsIElURVIgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIHN0ZXAgID0gJGl0ZXIuc3RlcDtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICBzZXQodGhpcywgSVRFUiwge286IFN0cmluZyhpdGVyYXRlZCksIGk6IDB9KTtcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAsIE8gICAgID0gaXRlci5vXG4gICAgLCBpbmRleCA9IGl0ZXIuaVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiBzdGVwKDAsIHBvaW50KTtcbn0pOyIsInZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4kZGVmKCRkZWYuUywgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcbiAgcmF3OiBmdW5jdGlvbiByYXcoY2FsbFNpdGUpe1xuICAgIHZhciB0cGwgPSAkLnRvT2JqZWN0KGNhbGxTaXRlLnJhdylcbiAgICAgICwgbGVuID0gJC50b0xlbmd0aCh0cGwubGVuZ3RoKVxuICAgICAgLCBzbG4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIHJlcyA9IFtdXG4gICAgICAsIGkgICA9IDA7XG4gICAgd2hpbGUobGVuID4gaSl7XG4gICAgICByZXMucHVzaChTdHJpbmcodHBsW2krK10pKTtcbiAgICAgIGlmKGkgPCBzbG4pcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXG4gIHJlcGVhdDogcmVxdWlyZSgnLi8kLnN0cmluZy1yZXBlYXQnKVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4vLyBzaG91bGQgdGhyb3cgZXJyb3Igb24gcmVnZXhcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC50aHJvd3MnKShmdW5jdGlvbigpeyAncScuc3RhcnRzV2l0aCgvLi8pOyB9KSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgdmFyIHRoYXQgID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAgICwgaW5kZXggPSAkLnRvTGVuZ3RoKE1hdGgubWluKGFyZ3VtZW50c1sxXSwgdGhhdC5sZW5ndGgpKTtcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBzZXRUYWcgICA9IHJlcXVpcmUoJy4vJC5jb2YnKS5zZXRcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHJlZGVmICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKVxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcbiAgLCBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vJC5lbnVtLWtleXMnKVxuICAsIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmpcbiAgLCBoYXMgICAgICA9ICQuaGFzXG4gICwgJGNyZWF0ZSAgPSAkLmNyZWF0ZVxuICAsIGdldERlc2MgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgPSAkLnNldERlc2NcbiAgLCBkZXNjICAgICA9ICQuZGVzY1xuICAsIGdldE5hbWVzID0gJC5nZXROYW1lc1xuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxuICAsICRTeW1ib2wgID0gJC5nLlN5bWJvbFxuICAsIHNldHRlciAgID0gZmFsc2VcbiAgLCBUQUcgICAgICA9IHVpZCgndGFnJylcbiAgLCBISURERU4gICA9IHVpZCgnaGlkZGVuJylcbiAgLCBfcHJvcGVydHlJc0VudW1lcmFibGUgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0ge31cbiAgLCBBbGxTeW1ib2xzID0ge31cbiAgLCB1c2VOYXRpdmUgPSAkLmlzRnVuY3Rpb24oJFN5bWJvbCk7XG5cbmZ1bmN0aW9uIHdyYXAodGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCRjcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XG4gICQuREVTQyAmJiBzZXR0ZXIgJiYgc2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCB0YWcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXREZXNjKHRoaXMsIHRhZywgZGVzYygxLCB2YWx1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzeW07XG59XG5cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBkZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9ICRjcmVhdGUoRCwge2VudW1lcmFibGU6IGRlc2MoMCwgZmFsc2UpfSk7XG4gICAgfVxuICB9IHJldHVybiBzZXREZXNjKGl0LCBrZXksIEQpO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSlkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59XG5mdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gJGNyZWF0ZShpdCkgOiBkZWZpbmVQcm9wZXJ0aWVzKCRjcmVhdGUoaXQpLCBQKTtcbn1cbmZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gX3Byb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59XG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvT2JqZWN0KGl0KSwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b09iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHNbMF0pKTtcbiAgfTtcbiAgJHJlZGVmKCRTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzW1RBR107XG4gIH0pO1xuXG4gICQuY3JlYXRlICAgICA9IGNyZWF0ZTtcbiAgJC5zZXREZXNjICAgID0gZGVmaW5lUHJvcGVydHk7XG4gICQuZ2V0RGVzYyAgICA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJC5zZXREZXNjcyAgID0gZGVmaW5lUHJvcGVydGllcztcbiAgJC5nZXROYW1lcyAgID0gZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKCQuREVTQyAmJiAkLkZXKSRyZWRlZihPYmplY3QucHJvdG90eXBlLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCBwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG59XG5cbnZhciBzeW1ib2xTdGF0aWNzID0ge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIHJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59O1xuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXG4vLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXG4vLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3Jcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxuLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2Vcbi8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xuLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxuLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xuLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xuJC5lYWNoLmNhbGwoKFxuICAgICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICAgJ3NwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4gICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xuICAgIHZhciBzeW0gPSByZXF1aXJlKCcuLyQud2tzJykoaXQpO1xuICAgIHN5bWJvbFN0YXRpY3NbaXRdID0gdXNlTmF0aXZlID8gc3ltIDogd3JhcChzeW0pO1xuICB9XG4pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZGVmKCRkZWYuRyArICRkZWYuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZGVmKCRkZWYuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiBjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKCQuZy5KU09OLCAnSlNPTicsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHdlYWsgICAgICA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKVxuICAsIGxlYWtTdG9yZSA9IHdlYWsubGVha1N0b3JlXG4gICwgSUQgICAgICAgID0gd2Vhay5JRFxuICAsIFdFQUsgICAgICA9IHdlYWsuV0VBS1xuICAsIGhhcyAgICAgICA9ICQuaGFzXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxuICAsIGlzRnJvemVuICA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXG4gICwgdG1wICAgICAgID0ge307XG5cbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXG52YXIgV2Vha01hcCA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtNYXAnLCB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgaWYoaXNPYmplY3Qoa2V5KSl7XG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuZ2V0KGtleSk7XG4gICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbSURdXTtcbiAgICB9XG4gIH0sXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHdlYWssIHRydWUsIHRydWUpO1xuXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XG5pZigkLkZXICYmIG5ldyBXZWFrTWFwKCkuc2V0KChPYmplY3QuZnJlZXplIHx8IE9iamVjdCkodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XG4gICQuZWFjaC5jYWxsKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIG1ldGhvZCA9IFdlYWtNYXAucHJvdG90eXBlW2tleV07XG4gICAgcmVxdWlyZSgnLi8kLnJlZGVmJykoV2Vha01hcC5wcm90b3R5cGUsIGtleSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmIGlzRnJvemVuKGEpKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxlYWtTdG9yZSh0aGlzKVtrZXldKGEsIGIpO1xuICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxuICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XG4gICAgfSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpO1xuXG4vLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha1NldCcsIHtcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIHZhbHVlLCB0cnVlKTtcbiAgfVxufSwgd2VhaywgZmFsc2UsIHRydWUpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb21lbmljL0FycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xudmFyICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRpbmNsdWRlcyA9IHJlcXVpcmUoJy4vJC5hcnJheS1pbmNsdWRlcycpKHRydWUpO1xuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2luY2x1ZGVzJyk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKTsiLCIvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzkzNTM3ODFcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgb3duS2V5cyA9IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpO1xuXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3Qpe1xuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcbiAgICAgICwgcmVzdWx0ID0ge307XG4gICAgJC5lYWNoLmNhbGwob3duS2V5cyhPKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgICQuc2V0RGVzYyhyZXN1bHQsIGtleSwgJC5kZXNjKDAsICQuZ2V0RGVzYyhPLCBrZXkpKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcbiAgICAgICwga2V5O1xuICAgIGlmKGlzRW50cmllcyl3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IFtrZXkgPSBrZXlzW2krK10sIE9ba2V5XV07XG4gICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIHZhbHVlczogIGNyZWF0ZU9iamVjdFRvQXJyYXkoZmFsc2UpLFxuICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXG59KTsiLCIvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9rYW5nYXgvOTY5ODEwMFxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ1JlZ0V4cCcsIHtcbiAgZXNjYXBlOiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvKFtcXFxcXFwtW1xcXXt9KCkqKz8uLF4kfF0pL2csICdcXFxcJDEnLCB0cnVlKVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4ndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgYXQ6IGZ1bmN0aW9uIGF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRwYWQgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIGxwYWQ6IGZ1bmN0aW9uIGxwYWQobil7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbiwgYXJndW1lbnRzWzFdLCB0cnVlKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcGFkID0gcmVxdWlyZSgnLi8kLnN0cmluZy1wYWQnKTtcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICBycGFkOiBmdW5jdGlvbiBycGFkKG4pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG4sIGFyZ3VtZW50c1sxXSwgZmFsc2UpO1xuICB9XG59KTsiLCIvLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkQXJyYXkgID0gJC5jb3JlLkFycmF5IHx8IEFycmF5XG4gICwgc3RhdGljcyA9IHt9O1xuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xuICAkLmVhY2guY2FsbChrZXlzLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gICAgaWYobGVuZ3RoID09IHVuZGVmaW5lZCAmJiBrZXkgaW4gJEFycmF5KXN0YXRpY3Nba2V5XSA9ICRBcnJheVtrZXldO1xuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xuICB9KTtcbn1cbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcbnNldFN0YXRpY3MoJ2luZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMnLCAzKTtcbnNldFN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xuJGRlZigkZGVmLlMsICdBcnJheScsIHN0YXRpY3MpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcbiAgLCBJVEVSQVRPUiAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5XG4gICwgTm9kZUxpc3QgICAgPSAkLmcuTm9kZUxpc3Q7XG5pZigkLkZXICYmIE5vZGVMaXN0ICYmICEoSVRFUkFUT1IgaW4gTm9kZUxpc3QucHJvdG90eXBlKSl7XG4gICQuaGlkZShOb2RlTGlzdC5wcm90b3R5cGUsIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG59XG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBBcnJheVZhbHVlczsiLCJ2YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkdGFzayA9IHJlcXVpcmUoJy4vJC50YXNrJyk7XG4kZGVmKCRkZWYuRyArICRkZWYuQiwge1xuICBzZXRJbW1lZGlhdGU6ICAgJHRhc2suc2V0LFxuICBjbGVhckltbWVkaWF0ZTogJHRhc2suY2xlYXJcbn0pOyIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGludm9rZSAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIHBhcnRpYWwgICA9IHJlcXVpcmUoJy4vJC5wYXJ0aWFsJylcbiAgLCBuYXZpZ2F0b3IgPSAkLmcubmF2aWdhdG9yXG4gICwgTVNJRSAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xuZnVuY3Rpb24gd3JhcChzZXQpe1xuICByZXR1cm4gTVNJRSA/IGZ1bmN0aW9uKGZuLCB0aW1lIC8qLCAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gc2V0KGludm9rZShcbiAgICAgIHBhcnRpYWwsXG4gICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAkLmlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbilcbiAgICApLCB0aW1lKTtcbiAgfSA6IHNldDtcbn1cbiRkZWYoJGRlZi5HICsgJGRlZi5CICsgJGRlZi5GICogTVNJRSwge1xuICBzZXRUaW1lb3V0OiAgd3JhcCgkLmcuc2V0VGltZW91dCksXG4gIHNldEludGVydmFsOiB3cmFwKCQuZy5zZXRJbnRlcnZhbClcbn0pOyIsInJlcXVpcmUoJy4vbW9kdWxlcy9lczUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmlzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5mdW5jdGlvbi5oYXMtaW5zdGFuY2UnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcucmF3Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5zdGFydHMtd2l0aCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5Lm9mJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmlsbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVnZXhwJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLXNldCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnN0cmluZy5hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcucnBhZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIudGltZXJzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLmltbWVkaWF0ZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzLyQnKS5jb3JlO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgaXRlcmF0b3JTeW1ib2wgPVxuICAgIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZSgob3V0ZXJGbiB8fCBHZW5lcmF0b3IpLnByb3RvdHlwZSk7XG5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoXG4gICAgICBpbm5lckZuLCBzZWxmIHx8IG51bGwsXG4gICAgICBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSBHZW5lcmF0b3IucHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbmVyYXRvciA9IHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpO1xuICAgICAgdmFyIGNhbGxOZXh0ID0gc3RlcC5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgICAgdmFyIGNhbGxUaHJvdyA9IHN0ZXAuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG5cbiAgICAgIGZ1bmN0aW9uIHN0ZXAobWV0aG9kLCBhcmcpIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUoaW5mby52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGluZm8udmFsdWUpLnRoZW4oY2FsbE5leHQsIGNhbGxUaHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbE5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fFxuICAgICAgICAgICAgICAobWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgLy8gQSByZXR1cm4gb3IgdGhyb3cgKHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyB0aHJvd1xuICAgICAgICAgICAgLy8gbWV0aG9kKSBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgICAgdmFyIHJldHVybk1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdO1xuICAgICAgICAgICAgaWYgKHJldHVybk1ldGhvZCkge1xuICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gocmV0dXJuTWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmV0dXJuIG1ldGhvZCB0aHJldyBhbiBleGNlcHRpb24sIGxldCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gZXhjZXB0aW9uIHByZXZhaWwgb3ZlciB0aGUgb3JpZ2luYWwgcmV0dXJuIG9yIHRocm93LlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgb3V0ZXIgcmV0dXJuLCBub3cgdGhhdCB0aGUgZGVsZWdhdGVcbiAgICAgICAgICAgICAgLy8gaXRlcmF0b3IgaGFzIGJlZW4gdGVybWluYXRlZC5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKFxuICAgICAgICAgICAgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSxcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yLFxuICAgICAgICAgICAgYXJnXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LnNlbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVHZW5lcmF0b3JNZXRob2QobWV0aG9kKSB7XG4gICAgR3BbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgfTtcbiAgfVxuICBkZWZpbmVHZW5lcmF0b3JNZXRob2QoXCJuZXh0XCIpO1xuICBkZWZpbmVHZW5lcmF0b3JNZXRob2QoXCJ0aHJvd1wiKTtcbiAgZGVmaW5lR2VuZXJhdG9yTWV0aG9kKFwicmV0dXJuXCIpO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICB0aGlzLnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgLy8gUHJlLWluaXRpYWxpemUgYXQgbGVhc3QgMjAgdGVtcG9yYXJ5IHZhcmlhYmxlcyB0byBlbmFibGUgaGlkZGVuXG4gICAgICAvLyBjbGFzcyBvcHRpbWl6YXRpb25zIGZvciBzaW1wbGUgZ2VuZXJhdG9ycy5cbiAgICAgIGZvciAodmFyIHRlbXBJbmRleCA9IDAsIHRlbXBOYW1lO1xuICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCB0ZW1wTmFtZSA9IFwidFwiICsgdGVtcEluZGV4KSB8fCB0ZW1wSW5kZXggPCAyMDtcbiAgICAgICAgICAgKyt0ZW1wSW5kZXgpIHtcbiAgICAgICAgdGhpc1t0ZW1wTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG4gICAgICAgIHJldHVybiAhIWNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuICAvLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3RcbiAgLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvYmFiZWwvcG9seWZpbGxcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1jb3JlL3BvbHlmaWxsXCIpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdGh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ub2RlLWd3MlxyXG4qICAgaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6TWFpblxyXG4qXHJcblxyXG4qL1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cdGNvbG9yczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbG9ycy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbG9yc1xyXG5cdGd1aWxkRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2d1aWxkX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9ndWlsZF9kZXRhaWxzXHJcblxyXG5cdGl0ZW1zOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvaXRlbXMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1zXHJcblx0aXRlbURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbXYxL2l0ZW1fZGV0YWlscy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbV9kZXRhaWxzXHJcblx0cmVjaXBlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZXMuanNvbicsXHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVzXHJcblx0cmVjaXBlRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZV9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlX2RldGFpbHNcclxuXHJcblx0bWFwTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfbmFtZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX25hbWVzXHJcblx0Y29udGluZW50czogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbnRpbmVudHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbnRpbmVudHNcclxuXHRtYXBzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwc1xyXG5cdG1hcEZsb29yOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX2Zsb29yLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9mbG9vclxyXG5cclxuXHRvYmplY3RpdmVOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9vYmplY3RpdmVfbmFtZXMuanNvbicsXHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaGVzXHJcblx0bWF0Y2hlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaGVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaF9kZXRhaWxzXHJcblx0bWF0Y2hEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoX2RldGFpbHMuanNvbicsXHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L29iamVjdGl2ZV9uYW1lc1xyXG5cclxuXHRtYXRjaGVzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzJyxcclxuXHRtYXRjaERldGFpbHNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tLycsXHJcbn07XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBVQkxJQyBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlx0V09STEQgdnMgV09STERcclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZU5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdvYmplY3RpdmVOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdtYXRjaGVzJywge30sIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0dmFyIHd2d19tYXRjaGVzID0gKGRhdGEgJiYgZGF0YS53dndfbWF0Y2hlcykgPyBkYXRhLnd2d19tYXRjaGVzIDogW107XHJcblx0XHRjYWxsYmFjayhlcnIsIHd2d19tYXRjaGVzKTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0dGhyb3cgKCdtYXRjaF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hdGNoRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50cy5tYXRjaGVzU3RhdGU7XHJcblxyXG5cdGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gKCcnICsgcGFyYW1zLm1hdGNoX2lkKTtcclxuXHR9XHJcblxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkIHx8IHdvcmxkX3NsdWdcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzLm1hdGNoRGV0YWlsc1N0YXRlO1xyXG5cclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCAmJiAhcGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIG1hdGNoX2lkIG9yIHdvcmxkX3NsdWcgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9IHBhcmFtcy5tYXRjaF9pZDtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gJ3dvcmxkLycgKyBwYXJhbXMud29ybGRfc2x1ZztcclxuXHR9XHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0R0VORVJBTFxyXG4qL1xyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nLCBpZHNcclxuZnVuY3Rpb24gZ2V0V29ybGROYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHRpZiAoIXBhcmFtcy5pZHMpIHtcclxuXHRcdHBhcmFtcy5wYWdlID0gMDtcclxuXHR9XHJcblx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuaWRzKSkge1xyXG5cdFx0cGFyYW1zLmlkcyA9IHBhcmFtcy5pZHMuam9pbignLCcpO1xyXG5cdH1cclxuXHRnZXQoJ3dvcmxkTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogZ3VpbGRfaWQgfHwgZ3VpbGRfbmFtZSAoaWQgdGFrZXMgcHJpb3JpdHkpXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuZ3VpbGRfaWQgJiYgIXBhcmFtcy5ndWlsZF9uYW1lKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBndWlsZF9pZCBvciBndWlsZF9uYW1lIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cclxuXHRnZXQoJ2d1aWxkRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdElURU1TXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0SXRlbXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2l0ZW1zJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBpdGVtX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldEl0ZW1EZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5pdGVtX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2l0ZW1faWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdpdGVtRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldFJlY2lwZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ3JlY2lwZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBSRVFVSVJFRDogcmVjaXBlX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldFJlY2lwZURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnJlY2lwZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdyZWNpcGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdyZWNpcGVEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TUFQIElORk9STUFUSU9OXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldENvbnRpbmVudHMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2NvbnRpbmVudHMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hcF9pZCwgbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogY29udGluZW50X2lkLCBmbG9vclxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBGbG9vcihwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuY29udGluZW50X2lkKSB7XHJcblx0XHR0aHJvdyAoJ2NvbnRpbmVudF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZsb29yKSB7XHJcblx0XHR0aHJvdyAoJ2Zsb29yIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWFwRmxvb3InLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1pc2NlbGxhbmVvdXNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRCdWlsZChjYWxsYmFjaykge1xyXG5cdGdldCgnYnVpbGQnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0Q29sb3JzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdjb2xvcnMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG4vLyB0byBnZXQgZmlsZXM6IGh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUve3NpZ25hdHVyZX0ve2ZpbGVfaWR9Lntmb3JtYXR9XHJcbmZ1bmN0aW9uIGdldEZpbGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdmaWxlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgVVRJTElUWSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG4vLyBTUEVDSUFMIENBU0VcclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChnZXRGaWxlUmVuZGVyVXJsKHBhcmFtcykpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGVSZW5kZXJVcmwocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyVXJsID0gKFxyXG5cdFx0J2h0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvJ1xyXG5cdFx0KyBwYXJhbXMuc2lnbmF0dXJlXHJcblx0XHQrICcvJ1xyXG5cdFx0KyBwYXJhbXMuZmlsZV9pZFxyXG5cdFx0KyAnLidcclxuXHRcdCsgcGFyYW1zLmZvcm1hdFxyXG5cdCk7XHJcblx0cmV0dXJuIHJlbmRlclVybDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXQoa2V5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuXHR2YXIgYXBpVXJsID0gZ2V0QXBpVXJsKGtleSwgcGFyYW1zKTtcclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChhcGlVcmwpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHRyZXF1ZXN0VXJsID0gKGVuZFBvaW50c1tyZXF1ZXN0VXJsXSlcclxuXHRcdD8gZW5kUG9pbnRzW3JlcXVlc3RVcmxdXHJcblx0XHQ6IHJlcXVlc3RVcmw7XHJcblxyXG5cdHZhciBxdWVyeSA9IHFzLnN0cmluZ2lmeShwYXJhbXMpO1xyXG5cclxuXHRpZiAocXVlcnkubGVuZ3RoKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICc/JyArIHF1ZXJ5O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlcXVlc3RVcmw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUpzb24oZGF0YSkge1xyXG5cdHZhciByZXN1bHRzO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0cmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblx0fVxyXG5cdGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290ID0gJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHdpbmRvd1xuICA/ICh0aGlzIHx8IHNlbGYpXG4gIDogd2luZG93O1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgICAmJiAoIXJvb3QubG9jYXRpb24gfHwgJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sXG4gICAgICAgICAgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcblxuICAgIHNlbGYuY2FsbGJhY2soZXJyIHx8IG5ld19lcnIsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcyl7XG4gIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQoZmllbGQsIGZpbGUsIGZpbGVuYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgLCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIHF1ZXJ5c3RyaW5nXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbXVsdGlwbGUgZGF0YSBcIndyaXRlc1wiXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5zZW5kKHsgc2VhcmNoOiAncXVlcnknIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgcmFuZ2U6ICcxLi41JyB9KVxuICogICAgICAgICAuc2VuZCh7IG9yZGVyOiAnZGVzYycgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAgKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IGlzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ09yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplW3RoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKV07XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG4gIHhoci5zZW5kKGRhdGEpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZGVsID0gZnVuY3Rpb24odXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogXCIxXCIsIFwiZW5cIjogXCJPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmVcIiwgXCJlc1wiOiBcIk1pcmFkb3JcIiwgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiBcIjJcIiwgXCJlblwiOiBcIlZhbGxleVwiLCBcImZyXCI6IFwiVmFsbMOpZVwiLCBcImVzXCI6IFwiVmFsbGVcIiwgXCJkZVwiOiBcIlRhbFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogXCIzXCIsIFwiZW5cIjogXCJMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlc1wiLCBcImVzXCI6IFwiVmVnYVwiLCBcImRlXCI6IFwiVGllZmxhbmRcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IFwiNFwiLCBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLCBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCIsIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiBcIjVcIiwgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIiwgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIiwgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLCBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogXCI2XCIsIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIiwgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsIFwiZGVcIjogXCJTcGVsZGFuIEthaGxzY2hsYWdcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IFwiN1wiLCBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIiwgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IFwiOFwiLCBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLCBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIiwgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIiwgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IFwiOVwiLCBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLCBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIiwgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLCBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogXCIxMFwiLCBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIiwgXCJmclwiOiBcIkNhcnJpw6hyZSBkZXMgdm9sZXVyc1wiLCBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLCBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IFwiMTFcIiwgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIiwgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIiwgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIiwgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiBcIjEyXCIsIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsIFwiZnJcIjogXCJQaXN0ZSBkdSBSdWlzc2VhdSBzYXV2YWdlXCIsIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsIFwiZGVcIjogXCJXaWxkYmFjaHN0cmVja2VcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiBcIjEzXCIsIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLCBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIiwgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIiwgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiBcIjE0XCIsIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIiwgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiLCBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiBcIjE1XCIsIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiLCBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsIFwiZGVcIjogXCJMYW5nb3IgLSBTY2hsdWNodFwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IFwiMTZcIiwgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLCBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIiwgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLCBcImRlXCI6IFwiUXVlbnRpbnNlZVwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IFwiMTdcIiwgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLCBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiLCBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogXCIxOFwiLCBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLCBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIiwgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIiwgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiBcIjE5XCIsIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCIsIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIiwgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IFwiMjBcIiwgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCIsIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IFwiMjFcIiwgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIiwgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IFwiMjJcIiwgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLCBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCIsIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IFwiMjNcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogXCIyNFwiLCBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lbnNlXCIsIFwiZnJcIjogXCJGaWVmIGR1IGNoYW1waW9uXCIsIFwiZXNcIjogXCJEb21pbmlvIGRlbCBDYW1wZcOzblwiLCBcImRlXCI6IFwiTGFuZGd1dCBkZXMgQ2hhbXBpb25zXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogXCIyNVwiLCBcImVuXCI6IFwiUmVkYnJpYXJcIiwgXCJmclwiOiBcIkJydXllcm91Z2VcIiwgXCJlc1wiOiBcIlphcnphcnJvamFcIiwgXCJkZVwiOiBcIlJvdGRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogXCIyNlwiLCBcImVuXCI6IFwiR3JlZW5sYWtlXCIsIFwiZnJcIjogXCJMYWMgVmVydFwiLCBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnNlZVwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IFwiMjdcIiwgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIiwgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsIFwiZGVcIjogXCJCdWNodCBkZXMgQXVmc3RpZWdzXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogXCIyOFwiLCBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsIFwiZnJcIjogXCJQcm9tb250b2lyZSBkZSBsJ2F1YmVcIiwgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZGFtbWVydW5nXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogXCIyOVwiLCBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsIFwiZnJcIjogXCJMJ2FudHJlIGRlcyBlc3ByaXRzXCIsIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLCBcImRlXCI6IFwiRGVyIEdlaXN0ZXJob2xtXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogXCIzMFwiLCBcImVuXCI6IFwiV29vZGhhdmVuXCIsIFwiZnJcIjogXCJHZW50ZXN5bHZlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsIFwiZGVcIjogXCJXYWxkIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogXCIzMVwiLCBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIiwgXCJkZVwiOiBcIkFza2FsaW9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogXCIzMlwiLCBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIiwgXCJkZVwiOiBcIkV0aGVyb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiBcIjMzXCIsIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiLCBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogXCIzNFwiLCBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IHZhaW5xdWV1clwiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsIFwiZGVcIjogXCJTaWVnZXIgLSBIw7x0dGVcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiBcIjM1XCIsIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsIFwiZnJcIjogXCJWZXJ0ZWJyYW5jaGVcIiwgXCJlc1wiOiBcIlphcnphdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IFwiMzZcIiwgXCJlblwiOiBcIkJsdWVsYWtlXCIsIFwiZnJcIjogXCJMYWMgYmxldVwiLCBcImVzXCI6IFwiTGFnb2F6dWxcIiwgXCJkZVwiOiBcIkJsYXVzZWVcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiBcIjM3XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IFwiMzhcIiwgXCJlblwiOiBcIkxvbmd2aWV3XCIsIFwiZnJcIjogXCJMb25ndWV2dWVcIiwgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsIFwiZGVcIjogXCJXZWl0c2ljaHRcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiBcIjM5XCIsIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIiwgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCIsIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLCBcImRlXCI6IFwiRGFzIEdvdHRzY2h3ZXJ0XCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogXCI0MFwiLCBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCIsIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIiwgXCJkZVwiOiBcIkZlbHN3YW5kXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogXCI0MVwiLCBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGRlIFNoYWRhcmFuXCIsIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsIFwiZGVcIjogXCJTaGFkYXJhbiBIw7xnZWxcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiBcIjQyXCIsIFwiZW5cIjogXCJSZWRsYWtlXCIsIFwiZnJcIjogXCJSb3VnZWxhY1wiLCBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsIFwiZGVcIjogXCJSb3RzZWVcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiBcIjQzXCIsIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLCBcImRlXCI6IFwiSMO8dHRlIGRlcyBIZWxkZW5cIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiBcIjQ0XCIsIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiLCBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLCBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwgLSBCdWNodFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IFwiNDVcIiwgXCJlblwiOiBcIkJsdWVicmlhclwiLCBcImZyXCI6IFwiQnJ1eWF6dXJcIiwgXCJlc1wiOiBcIlphcnphenVsXCIsIFwiZGVcIjogXCJCbGF1ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiBcIjQ2XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IFwiNDdcIiwgXCJlblwiOiBcIlN1bm55aGlsbFwiLCBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIiwgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsIFwiZGVcIjogXCJTb25uZW5saWNodGjDvGdlbFwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IFwiNDhcIiwgXCJlblwiOiBcIkZhaXRobGVhcFwiLCBcImZyXCI6IFwiRmVydmV1clwiLCBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIiwgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogXCI0OVwiLCBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgYmxldXZhbFwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IFwiNTBcIiwgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IFwiNTFcIiwgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZnJcIjogXCJBc3RyYWxob2xtZVwiLCBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLCBcImRlXCI6IFwiQXN0cmFsaG9sbVwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IFwiNTJcIiwgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCIsIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLCBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiBcIjUzXCIsIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiLCBcImVzXCI6IFwiUmVmdWdpbyBkZSBWYWxsZXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogXCI1NFwiLCBcImVuXCI6IFwiRm9naGF2ZW5cIiwgXCJmclwiOiBcIkhhdnJlIGdyaXNcIiwgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsIFwiZGVcIjogXCJOZWJlbCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IFwiNTVcIiwgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsIFwiZGVcIjogXCJSb3R3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IFwiNTZcIiwgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLCBcImZyXCI6IFwiQnJhcyBkdSB0aXRhblwiLCBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLCBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiBcIjU3XCIsIFwiZW5cIjogXCJDcmFndG9wXCIsIFwiZnJcIjogXCJTb21tZXQgZGUgbCdlc2NhcnBlbWVudFwiLCBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIiwgXCJkZVwiOiBcIkZlbHNlbnNwaXR6ZVwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IFwiNThcIiwgXCJlblwiOiBcIkdvZHNsb3JlXCIsIFwiZnJcIjogXCJEaXZpbmF0aW9uXCIsIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIiwgXCJkZVwiOiBcIkfDtnR0ZXJrdW5kZVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IFwiNTlcIiwgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVyb2pvXCIsIFwiZGVcIjogXCJSb3R0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IFwiNjBcIiwgXCJlblwiOiBcIlN0YXJncm92ZVwiLCBcImZyXCI6IFwiQm9zcXVldCBzdGVsbGFpcmVcIiwgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIiwgXCJkZVwiOiBcIlN0ZXJuZW5oYWluXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogXCI2MVwiLCBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG53YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IFwiNjJcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiBcIjYzXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogXCI2NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IFwiNjVcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogXCI2NlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IFwiNjdcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiBcIjY4XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IFwiNjlcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiBcIjcwXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogXCI3MVwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IFwiNzJcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiBcIjczXCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IFwiNzRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiBcIjc1XCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogXCI3NlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0XCJrZXlcIjogXCJDZW50ZXJcIixcclxuXHRcdFwibmFtZVwiOiBcIkV0ZXJuYWwgQmF0dGxlZ3JvdW5kc1wiLFxyXG5cdFx0XCJhYmJyXCI6IFwiRUJHXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcImNvbG9yXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJDYXN0bGVcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzldLCBcdFx0XHRcdFx0XHRcdFx0Ly8gc21cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJSZWQgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzEsIDE3LCAyMCwgMTgsIDE5LCA2LCA1XSxcdFx0Ly8gb3Zlcmxvb2ssIG1lbmRvbnMsIHZlbG9rYSwgYW56LCBvZ3JlLCBzcGVsZGFuLCBwYW5nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQmx1ZSBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIsIDE1LCAyMiwgMTYsIDIxLCA3LCA4XVx0XHRcdC8vIHZhbGxleSwgbGFuZ29yLCBicmF2b3N0LCBxdWVudGluLCBkdXJpb3MsIGRhbmUsIHVtYmVyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiR3JlZW4gQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMywgMTEsIDEzLCAxMiwgMTQsIDEwLCA0XSBcdFx0Ly8gbG93bGFuZHMsIGFsZG9ucywgamVycmlmZXIsIHdpbGRjcmVlaywga2xvdmFuLCByb2d1ZXMsIGdvbGFudGFcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiUmVkXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcImNvbG9yXCI6IFwicmVkXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzgsIDQwLCAzOSwgNTIsIDUxXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM1LCAzNiwgMzQsIDUzLCA1MF0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs2MiwgNjMsIDY0LCA2NSwgNjZdIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiQmx1XCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDIsXHJcblx0XHRcImNvbG9yXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjMsIDI3LCAzMV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMwLCAyOCwgMjksIDU4LCA2MF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjUsIDI2LCAyNCwgNTksIDYxXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBjaGFtcCwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzcxLCA3MCwgNjksIDY4LCA2N10gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkdyblwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJjb2xvclwiOiBcImdyZWVuXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDYsIDQ0LCA0MV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NywgNTcsIDU2LCA0OCwgNTRdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ1LCA0MiwgNDMsIDQ5LCA1NV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3NiAsIDc1ICwgNzQgLCA3MyAsIDcyIF0gXHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF1cclxuXHR9LFxyXG5dO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQvL1x0RUJHXHJcblx0XCI5XCI6XHR7XCJ0eXBlXCI6IDEsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDAsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFN0b25lbWlzdCBDYXN0bGVcclxuXHJcblx0Ly9cdFJlZCBDb3JuZXJcclxuXHRcIjFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gUmVkIEtlZXAgLSBPdmVybG9va1xyXG5cdFwiMTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gTWVuZG9uJ3MgR2FwXHJcblx0XCIyMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBWZWxva2EgU2xvcGVcclxuXHRcIjE4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIEFuemFsaWFzIFBhc3NcclxuXHRcIjE5XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIE9ncmV3YXRjaCBDdXRcclxuXHRcIjZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIENhbXAgLSBNaWxsIC0gU3BlbGRhblxyXG5cdFwiNVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgQ2FtcCAtIE1pbmUgLSBQYW5nbG9zc1xyXG5cclxuXHQvL1x0Qmx1ZSBDb3JuZXJcclxuXHRcIjJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBLZWVwIC0gVmFsbGV5XHJcblx0XCIxNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gTGFuZ29yIEd1bGNoXHJcblx0XCIyMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gQnJhdm9zdCBFc2NhcnBtZW50XHJcblx0XCIxNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gUXVlbnRpbiBMYWtlXHJcblx0XCIyMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gRHVyaW9zIEd1bGNoXHJcblx0XCI3XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbmUgLSBEYW5lbG9uXHJcblx0XCI4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbGwgLSBVbWJlcmdsYWRlXHJcblxyXG5cdC8vXHRHcmVlbiBDb3JuZXJcclxuXHRcIjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gS2VlcCAtIExvd2xhbmRzXHJcblx0XCIxMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIEFsZG9uc1xyXG5cdFwiMTNcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBKZXJyaWZlcidzIFNsb3VnaFxyXG5cdFwiMTJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBXaWxkY3JlZWtcclxuXHRcIjE0XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gS2xvdmFuIEd1bGx5XHJcblx0XCIxMFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBDYW1wIC0gTWluZSAtIFJvZ3VlcyBRdWFycnlcclxuXHRcIjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbGwgLSBHb2xhbnRhXHJcblxyXG5cclxuXHQvL1x0UmVkSG9tZVxyXG5cdFwiMzdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjMzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFtaW5nIEJheVxyXG5cdFwiMzJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBFdGhlcm9uIEhpbGxzXHJcblx0XCIzOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIExvbmd2aWV3XHJcblx0XCI0MFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENsaWZmc2lkZVxyXG5cdFwiMzlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgR29kc3dvcmRcclxuXHRcIjUyXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gQXJhaCdzIEhvcGVcclxuXHRcIjUxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gQXN0cmFsaG9sbWVcclxuXHJcblx0XCIzNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEdyZWVuYnJpYXJcclxuXHRcIjM2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gQmx1ZWxha2VcclxuXHRcIjM0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gVmljdG9yJ3MgTG9kZ2VcclxuXHRcIjUzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEdyZWVudmFsZSBSZWZ1Z2VcclxuXHRcIjUwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBCbHVld2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRHcmVlbkhvbWVcclxuXHRcIjQ2XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCI0NFwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhZGZhbGwgQmF5XHJcblx0XCI0MVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIFNoYWRhcmFuIEhpbGxzXHJcblx0XCI0N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFN1bm55aGlsbFxyXG5cdFwiNTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDcmFndG9wXHJcblx0XCI1NlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBUaXRhbnBhd1xyXG5cdFwiNDhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBGYWl0aGxlYXBcclxuXHRcIjU0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gRm9naGF2ZW5cclxuXHJcblx0XCI0NVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEJsdWVicmlhclxyXG5cdFwiNDJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBSZWRsYWtlXHJcblx0XCI0M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIEhlcm8ncyBMb2RnZVxyXG5cdFwiNDlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gQmx1ZXZhbGUgUmVmdWdlXHJcblx0XCI1NVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gUmVkd2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRCbHVlSG9tZVxyXG5cdFwiMjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjI3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIEFzY2Vuc2lvbiBCYXlcclxuXHRcIjMxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gQXNrYWxpb24gSGlsbHNcclxuXHRcIjMwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gV29vZGhhdmVuXHJcblx0XCIyOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIERhd24ncyBFeXJpZVxyXG5cdFwiMjlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgU3Bpcml0aG9sbWVcclxuXHRcIjU4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gR29kc2xvcmVcclxuXHRcIjYwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gU3Rhcmdyb3ZlXHJcblxyXG5cdFwiMjVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBSZWRicmlhclxyXG5cdFwiMjZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBHcmVlbmxha2VcclxuXHRcIjI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gQ2hhbXBpb24ncyBEZW1lbnNlXHJcblx0XCI1OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBSZWR2YWxlIFJlZnVnZVxyXG5cdFwiNjFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEdyZWVud2F0ZXIgTG93bGFuZHNcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwibmFtZVwiOiBcIkdyZWVuIE1pbGxcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwibmFtZVwiOiBcIlJlZCBNaW5lXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcIm5hbWVcIjogXCJSZWQgTWlsbFwifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJuYW1lXCI6IFwiQmx1ZSBNaW5lXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcIm5hbWVcIjogXCJCbHVlIE1pbGxcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwibmFtZVwiOiBcIkNhc3RsZVwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IDEwLCBcIm5hbWVcIjogXCJHcmVlbiBNaW5lXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogMTEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogMTIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogMTMsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogMTQsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogMTUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogMTYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogMTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogMTgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogMTksIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogMjAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogMjEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogMjIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogMjMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiAyNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiAyNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IDI2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IDI3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogMjgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogMjksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiAzMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiAzMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IDMyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogMzMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiAzNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IDM1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IDM2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IDM3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogMzgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogMzksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiA0MCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiA0MSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IDQyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IDQzLCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogNDQsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiA0NSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiA0NiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IDQ3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IDQ4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiA0OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiA1MCwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogNTEsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogNTIsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IDUzLCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IDU0LCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IDU1LCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiA1NiwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IDU3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IDU4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiA1OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiA2MCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiA2MSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogNjIsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogNjMsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiA2NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogNjUsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogNjYsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiA2NywgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IDY4LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IDY5LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiA3MCwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IDcxLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IDcyLCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogNzMsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogNzQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IDc1LCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogNzYsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMzUsIFwibmFtZVwiOiBcImNhc3RsZVwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDI1LCBcIm5hbWVcIjogXCJrZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMTAsIFwibmFtZVwiOiBcInRvd2VyXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogNSwgXCJuYW1lXCI6IFwiY2FtcFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcInRlbXBsZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImhvbGxvd1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImVzdGF0ZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcIm92ZXJsb29rXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiYXNjZW50XCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0bGFuZ3M6IHJlcXVpcmUoJy4vZGF0YS9sYW5ncycpLFxyXG5cdHdvcmxkczogcmVxdWlyZSgnLi9kYXRhL3dvcmxkX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX25hbWVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX3R5cGVzJyksXHJcblx0b2JqZWN0aXZlX21ldGE6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWV0YScpLFxyXG5cdG9iamVjdGl2ZV9sYWJlbHM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbGFiZWxzJyksXHJcblx0b2JqZWN0aXZlX21hcDogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tYXAnKSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoV29ybGQgPSByZXF1aXJlKCcuL01hdGNoV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaCA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyksIG5leHRQcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpKTtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzdGFydFRpbWUnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc3RhcnRUaW1lJykpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMgfHwgbmV3TWF0Y2ggfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2g6OnJlbmRlcigpJywgcHJvcHMubWF0Y2gudG9KUygpKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd29ybGRDb2xvcnMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1hdGNoQ29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJtYXRjaFwiPjx0Ym9keT5cclxuICAgICAgICAgICAgICAgIHt3b3JsZENvbG9ycy5tYXAoKGNvbG9yLCBpeENvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBwcm9wcy5tYXRjaC5nZXQod29ybGRLZXkpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgICAgPSBwcm9wcy53b3JsZHMuZ2V0KHdvcmxkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3JlcyAgID0gcHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxNYXRjaFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgID0ge3dvcmxkSWR9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZCAgICAgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyAgICA9IHtzY29yZXN9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl4Q29sb3IgICA9IHtpeENvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllICAgPSB7aXhDb2xvciA9PT0gMH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3Rib2R5PjwvdGFibGU+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWF0Y2gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBNYXRjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZSAgICAgPSByZXF1aXJlKCcuL1Njb3JlJyk7XHJcbmNvbnN0IFBpZSAgICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9QaWUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgc2NvcmVzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBjb2xvciAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBpeENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBzaG93UGllOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld0NvbG9yIHx8IG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaFdvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld1Njb3JlcywgbmV3Q29sb3IsIG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG4gICAgICAgIHJldHVybiA8dHI+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtwcm9wcy5jb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7cHJvcHMuY29sb3J9YH0+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVcclxuICAgICAgICAgICAgICAgICAgICB0ZWFtICA9IHtwcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICBzY29yZSA9IHtwcm9wcy5zY29yZXMuZ2V0KHByb3BzLml4Q29sb3IpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgeyhwcm9wcy5zaG93UGllKVxyXG4gICAgICAgICAgICAgICAgPyA8dGQgcm93U3Bhbj1cIjNcIiBjbGFzc05hbWU9XCJwaWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8UGllXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyA9IHtwcm9wcy5zY29yZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICA9IHs2MH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC90cj47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoV29ybGQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hdGNoV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuLy8gY29uc3QgJCAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2NvcmU6IDAsXHJcbn07XHJcblxyXG5jbGFzcyBTY29yZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBkaWZmOiAwLFxyXG4gICAgICAgICAgICAkZGlmZk5vZGU6IG51bGwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlmZjogbmV4dFByb3BzLnNjb3JlIC0gcHJvcHMuc2NvcmV9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5kaWZmICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVTY29yZURpZmYodGhpcy5zdGF0ZS4kZGlmZk5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNhY2hlIGpRdWVyeSBvYmplY3QgdG8gc3RhdGVcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgJGRpZmZOb2RlOiAkKCcuZGlmZicsIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPGRpdj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGlmZlwiIHJlZj1cImRpZmZcIj57Z2V0RGlmZlRleHQodGhpcy5zdGF0ZS5kaWZmKX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e2dldFNjb3JlVGV4dCh0aGlzLnByb3BzLnNjb3JlKX08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVNjb3JlRGlmZigkZWwpIHtcclxuICAgICRlbFxyXG4gICAgICAgIC52ZWxvY2l0eSgnc3RvcCcpXHJcbiAgICAgICAgLnZlbG9jaXR5KHtvcGFjaXR5OiAwfSwge2R1cmF0aW9uOiAwfSlcclxuICAgICAgICAudmVsb2NpdHkoe29wYWNpdHk6IDF9LCB7ZHVyYXRpb246IDIwMH0pXHJcbiAgICAgICAgLnZlbG9jaXR5KHtvcGFjaXR5OiAwfSwge2R1cmF0aW9uOiA4MDAsIGRlbGF5OiAxMDAwfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXREaWZmVGV4dChkaWZmKSB7XHJcbiAgICByZXR1cm4gKGRpZmYpXHJcbiAgICAgICAgPyBudW1lcmFsKGRpZmYpLmZvcm1hdCgnKzAsMCcpXHJcbiAgICAgICAgOiBudWxsO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2NvcmVUZXh0KHNjb3JlKSB7XHJcbiAgICByZXR1cm4gKHNjb3JlKVxyXG4gICAgICAgID8gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKVxyXG4gICAgICAgIDogbnVsbDtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5TY29yZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcblNjb3JlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcclxubW9kdWxlLmV4cG9ydHMgID0gU2NvcmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoICAgICA9IHJlcXVpcmUoJy4vTWF0Y2gnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17e3BhZGRpbmdMZWZ0OiAnLjVlbSd9fT48aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgcmVnaW9uIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHMgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UmVnaW9uICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbiwgbmV4dFByb3BzLnJlZ2lvbik7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hlcyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoZXMsIG5leHRQcm9wcy5tYXRjaGVzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UmVnaW9uIHx8IG5ld01hdGNoZXMgfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld1JlZ2lvbiwgbmV3TWF0Y2hlcywgbmV3V29ybGRzfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdyZWdpb24nLCBwcm9wcy5yZWdpb24udG9KUygpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ21hdGNoZXMnLCBwcm9wcy5tYXRjaGVzLnRvSlMoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICd3b3JsZHMnLCBwcm9wcy53b3JsZHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAge3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IE1hdGNoZXNcclxuICAgICAgICAgICAgICAgICAgICB7IXByb3BzLm1hdGNoZXMuc2l6ZSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAge3Byb3BzLm1hdGNoZXMubWFwKG1hdGNoID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICA9IHttYXRjaC5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICdtYXRjaCdcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgICA9IHtwcm9wcy53b3JsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoICAgICA9IHttYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoZXMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IE1hdGNoZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdXb3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1dvcmxkOjpyZW5kZXInLCBwcm9wcy53b3JsZC50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+XHJcbiAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBXb3JsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbiAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSwgbmV4dFByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdSZWdpb24pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OlJlZ2lvbldvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld1JlZ2lvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Oldvcmxkczo6cmVuZGVyKCknLCBwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpLCBwcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKS50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlZ2lvbldvcmxkc1wiPlxyXG4gICAgICAgICAgICAgICAgPGgyPntwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBXb3JsZHM8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGRzLm1hcCh3b3JsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V29ybGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgID0ge3dvcmxkLmdldCgnaWQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuV29ybGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IFdvcmxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qICAgRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5jb25zdCBEQU8gPSByZXF1aXJlKCdsaWIvZGF0YS9vdmVydmlldycpO1xyXG5cclxuXHJcbi8qXHJcbiogICBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaGVzICAgICAgPSByZXF1aXJlKCcuL01hdGNoZXMnKTtcclxuY29uc3QgV29ybGRzICAgICAgID0gcmVxdWlyZSgnLi9Xb3JsZHMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgICBSZWFjdCBMaWZlY3ljbGVcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyh7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEYXRhOiB0aGlzLm9uTWF0Y2hEYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICByZWdpb25zOiBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgICAgICAgICAgICAgIDE6IHtsYWJlbDogJ05BJywgaWQ6ICcxJ30sXHJcbiAgICAgICAgICAgICAgICAyOiB7bGFiZWw6ICdFVScsIGlkOiAnMid9LFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbWF0Y2hlc0J5UmVnaW9uOiBJbW11dGFibGUuZnJvbUpTKHsxOiB7fSwgMjoge319KSxcclxuICAgICAgICAgICAgd29ybGRzQnlSZWdpb24gOiB0aGlzLmRhby5nZXRXb3JsZHNCeVJlZ2lvbihwcm9wcy5sYW5nKSwgLy8gSW1tdXRhYmxlLmZyb21KUyh7JzEnOiB7fSwgJzInOiB7fX0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hEYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hdGNoZXNCeVJlZ2lvbiwgbmV4dFN0YXRlLm1hdGNoZXNCeVJlZ2lvbik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3TWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld01hdGNoRGF0YX0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcpO1xyXG4gICAgICAgIC8vIHNldFdvcmxkcy5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5pbml0KHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGlmICghSW1tdXRhYmxlLmlzKG5leHRQcm9wcy5sYW5nLCB0aGlzLnByb3BzLmxhbmcpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkc0J5UmVnaW9uID0gdGhpcy5kYW8uZ2V0V29ybGRzQnlSZWdpb24obmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt3b3JsZHNCeVJlZ2lvbn0pO1xyXG5cclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGlkPVwib3ZlcnZpZXdcIj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3RoaXMuc3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbiAgPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0ge3RoaXMuc3RhdGUubWF0Y2hlc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxociAvPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj57dGhpcy5zdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb24gPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZHMgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBvbk1hdGNoRGF0YShtYXRjaERhdGEpIHtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaGVzQnlSZWdpb24gPSB0aGlzLmRhby5nZXRNYXRjaGVzQnlSZWdpb24obWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBtYXRjaGVzQnlSZWdpb246IHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5tZXJnZURlZXAobmV3TWF0Y2hlc0J5UmVnaW9uKSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgbGV0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG4gICAgaWYgKGxhbmcuZ2V0KCdzbHVnJykgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcuZ2V0KCduYW1lJykpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk92ZXJ2aWV3LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgID0gT3ZlcnZpZXc7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcbiAgICBlbGFwc2VkICA6IHRydWUsXHJcbiAgICB0aW1lc3RhbXA6IHRydWUsXHJcbiAgICBtYXBBYmJyZXY6IHRydWUsXHJcbiAgICBhcnJvdyAgICA6IHRydWUsXHJcbiAgICBzcHJpdGUgICA6IHRydWUsXHJcbiAgICBuYW1lICAgICA6IHRydWUsXHJcbiAgICBldmVudFR5cGU6IGZhbHNlLFxyXG4gICAgZ3VpbGROYW1lOiBmYWxzZSxcclxuICAgIGd1aWxkVGFnIDogZmFsc2UsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBHdWlsZENsYWltcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdDbGFpbXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSwgbmV4dFByb3BzLmd1aWxkLmdldCgnY2xhaW1zJykpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDbGFpbXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBjbGFpbXMgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgIHtjbGFpbXMubWFwKGVudHJ5ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17ZW50cnkuZ2V0KCdpZCcpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtlbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZENvbG9yICA9IHtlbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXAgICA9IHtlbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZENsYWltcy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgICA9IEd1aWxkQ2xhaW1zO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcbmNvbnN0IENsYWltcyAgICA9IHJlcXVpcmUoJy4vQ2xhaW1zJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7d2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnfX0+XHJcbiAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz5cclxuICAgIHsnIExvYWRpbmcuLi4nfVxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBHdWlsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YVJlYWR5ICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnbG9hZGVkJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkSWQgICAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcbiAgICAgICAgY29uc3QgZ3VpbGROYW1lICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGd1aWxkVGFnICAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG4gICAgICAgIGNvbnN0IGd1aWxkQ2xhaW1zID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuICAgICAgICBjb25zdCBndWlsZExpbmsgICA9IChndWlsZE5hbWUpXHJcbiAgICAgICAgICAgID8gYGh0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS9ndWlsZHMvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9YFxyXG4gICAgICAgICAgICA6IGBodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vJHtndWlsZElkfWA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdHdWlsZDo6cmVuZGVyKCknLCBndWlsZElkLCBndWlsZE5hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2d1aWxkJyBpZD17Z3VpbGRJZH0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS00Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17Z3VpbGRMaW5rfSB0YXJnZXQ9J19ibGFuayc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGtleT17Z3VpbGRJZH0gZ3VpbGROYW1lPXtndWlsZE5hbWV9IHNpemU9ezI1Nn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTIwJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyhkYXRhUmVhZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxoMT48YSBocmVmPXtndWlsZExpbmt9IHRhcmdldD0nX2JsYW5rJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3VpbGROYW1lfSBbe2d1aWxkVGFnfV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8ZGl2Pntsb2FkaW5nSHRtbH08YnIgLz57Z3VpbGRJZH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyFndWlsZENsYWltcy5pc0VtcHR5KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPENsYWltcyB7Li4udGhpcy5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBHdWlsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBHdWlsZCAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0d1aWxkczo6cmVuZGVyKCknKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvcHMuZ3VpbGRzJywgcHJvcHMuZ3VpbGRzLnRvT2JqZWN0KCkpO1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0ZWRHdWlsZHMgPSBwcm9wcy5ndWlsZHMudG9TZXEoKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IGd1aWxkLmdldCgnZ3VpbGRfbmFtZScpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IC1ndWlsZC5nZXQoJ2xhc3RDbGFpbScpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJndWlsZHNcIj5cclxuICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRlclwiPkd1aWxkIENsYWltczwvaDI+XHJcbiAgICAgICAgICAgICAgICB7c29ydGVkR3VpbGRzLm1hcChndWlsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgICA9IHtndWlsZC5nZXQoJ2d1aWxkX2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgID0ge3Byb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkID0ge2d1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IEd1aWxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbi8vIGNvbnN0ICQgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGNhcHR1cmVDb2xzID0ge1xyXG4gICAgZWxhcHNlZCAgOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiB0cnVlLFxyXG4gICAgbWFwQWJicmV2OiB0cnVlLFxyXG4gICAgYXJyb3cgICAgOiB0cnVlLFxyXG4gICAgc3ByaXRlICAgOiB0cnVlLFxyXG4gICAgbmFtZSAgICAgOiB0cnVlLFxyXG4gICAgZXZlbnRUeXBlOiBmYWxzZSxcclxuICAgIGd1aWxkTmFtZTogZmFsc2UsXHJcbiAgICBndWlsZFRhZyA6IGZhbHNlLFxyXG4gICAgdGltZXIgICAgOiBmYWxzZSxcclxufTtcclxuXHJcbmNvbnN0IGNsYWltQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogdHJ1ZSxcclxuICAgIHRpbWVzdGFtcDogdHJ1ZSxcclxuICAgIG1hcEFiYnJldjogdHJ1ZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IHRydWUsXHJcbiAgICBndWlsZFRhZyA6IHRydWUsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZW50cnkgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbiAgICBtYXBGaWx0ZXIgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0VudHJ5ICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmVudHJ5LCBuZXh0UHJvcHMuZW50cnkpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICAgID0gKG5ld0d1aWxkIHx8IG5ld0VudHJ5KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3TWFwRmlsdGVyICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdFdmVudEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdGaWx0ZXJzICAgICA9IChuZXdNYXBGaWx0ZXIgfHwgbmV3RXZlbnRGaWx0ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgICA9IChuZXdMYW5nIHx8IG5ld0RhdGEgfHwgbmV3RmlsdGVycyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpMb2c6OkVudHJ5OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0VudHJ5OnJlbmRlcigpJyk7XHJcbiAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKTtcclxuICAgICAgICBjb25zdCBjb2xzICAgICAgPSAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSA/IGNsYWltQ29scyA6IGNhcHR1cmVDb2xzO1xyXG4gICAgICAgIGNvbnN0IG9NZXRhICAgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YVt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKV07XHJcbiAgICAgICAgY29uc3QgbWFwQ29sb3IgID0gXy5maW5kKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXAgPT4gbWFwLm1hcEluZGV4ID09PSBvTWV0YS5tYXApLmNvbG9yO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlc01hcEZpbHRlciAgID0gdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSBtYXBDb2xvcjtcclxuICAgICAgICBjb25zdCBtYXRjaGVzRXZlbnRGaWx0ZXIgPSB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSBldmVudFR5cGU7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkQmVWaXNpYmxlICAgID0gKG1hdGNoZXNNYXBGaWx0ZXIgJiYgbWF0Y2hlc0V2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBjbGFzc05hbWUgICAgICAgICAgPSBzaG91bGRCZVZpc2libGUgPyAnc2hvdy1lbnRyeScgOiAnaGlkZS1lbnRyeSc7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7Y29sc31cclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHt0aGlzLnByb3BzLmd1aWxkSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZW50cnlJZCAgICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGRDb2xvciAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSAgID0ge3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0eXBlJyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkVudHJ5LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gRW50cnk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydhbGwnLCAnY2FwdHVyZScsICdjbGFpbSddKS5pc1JlcXVpcmVkLFxyXG4gICAgc2V0RXZlbnQgICA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgIT09IG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgbGlua0NsYWltcyAgID0gPGEgb25DbGljaz17dGhpcy5wcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjbGFpbVwiPkNsYWltczwvYT47XHJcbiAgICAgICAgY29uc3QgbGlua0NhcHR1cmVzID0gPGEgb25DbGljaz17dGhpcy5wcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjYXB0dXJlXCI+Q2FwdHVyZXM8L2E+O1xyXG4gICAgICAgIGNvbnN0IGxpbmtBbGwgICAgICA9IDxhIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiYWxsXCI+QWxsPC9hPjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGlkPVwibG9nLWV2ZW50LWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXsodGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gJ2NsYWltJykgICA/ICdhY3RpdmUnOiBudWxsfT57bGlua0NsYWltc308L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdjYXB0dXJlJykgPyAnYWN0aXZlJzogbnVsbH0+e2xpbmtDYXB0dXJlc308L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdhbGwnKSAgID8gJ2FjdGl2ZSc6IG51bGx9PntsaW5rQWxsfTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hcEZpbHRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgRW50cnkgICAgID0gcmVxdWlyZSgnLi9FbnRyeScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGd1aWxkczoge30sXHJcbn07XHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzICAgICAgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGV2ZW50SGlzdG9yeSAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIHRyaWdnZXJOb3RpZmljYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBtYXBGaWx0ZXIgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBldmVudEZpbHRlciAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMb2dFbnRyaWVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdFdmVudHMgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRIaXN0b3J5LCBuZXh0UHJvcHMuZXZlbnRIaXN0b3J5KTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhICAgICAgICAgPSAobmV3R3VpbGRzIHx8IG5ld0V2ZW50cyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1RyaWdnZXJTdGF0ZSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uLCBuZXh0UHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgY29uc3QgbmV3RmlsdGVyU3RhdGUgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hcEZpbHRlciwgbmV4dFByb3BzLm1hcEZpbHRlcikgfHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld09wdGlvbnMgICAgICA9IChuZXdUcmlnZ2VyU3RhdGUgfHwgbmV3RmlsdGVyU3RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgICAgPSAobmV3TGFuZyB8fCBuZXdEYXRhIHx8IG5ld09wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TG9nRW50cmllczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0RhdGEsIG5ld09wdGlvbnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xvZ0VudHJpZXM6OnJlbmRlcigpJywgcHJvcHMubWFwRmlsdGVyLCBwcm9wcy5ldmVudEZpbHRlciwgcHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBpZD1cImxvZ1wiPlxyXG4gICAgICAgICAgICAgICAge3Byb3BzLmV2ZW50SGlzdG9yeS5tYXAoZW50cnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IGVudHJ5LmdldCgndHlwZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5SWQgICA9IGVudHJ5LmdldCgnaWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGd1aWxkSWQsIGd1aWxkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudFR5cGUgPT09ICdjbGFpbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCA9IGVudHJ5LmdldCgnZ3VpbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICA9IChwcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHByb3BzLmd1aWxkcy5nZXQoZ3VpbGRJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8RW50cnlcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgICAgICAgICA9IHtlbnRyeUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgICAgICAgICAgID0gJ2xpJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbiA9IHtwcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgID0ge3Byb3BzLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGaWx0ZXIgICAgICAgICA9IHtwcm9wcy5ldmVudEZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgICAgICAgICAgPSB7cHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgICAgICAgICAgICAgPSB7Z3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkgICAgICAgICAgICAgICA9IHtlbnRyeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgICAgICAgICA9IHtndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxvZ0VudHJpZXMuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xyXG5Mb2dFbnRyaWVzLnByb3BUeXBlcyAgICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgPSBMb2dFbnRyaWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXBGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHNldFdvcmxkIDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcEZpbHRlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5tYXBGaWx0ZXIgIT09IG5leHRQcm9wcy5tYXBGaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGlkPVwibG9nLW1hcC1maWx0ZXJzXCIgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxsc1wiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnKSA/ICdhY3RpdmUnOiAnbnVsbCd9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3Byb3BzLnNldFdvcmxkfSBkYXRhLWZpbHRlcj1cImFsbFwiPkFsbDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgICAgICAgICAge18ubWFwKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXBNZXRhID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17bWFwTWV0YS5tYXBJbmRleH0gY2xhc3NOYW1lPXsocHJvcHMubWFwRmlsdGVyID09PSBtYXBNZXRhLmNvbG9yKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17cHJvcHMuc2V0V29ybGR9IGRhdGEtZmlsdGVyPXttYXBNZXRhLmNvbG9yfT57bWFwTWV0YS5hYmJyfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRmlsdGVycy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRmlsdGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbi8vIGNvbnN0IFNUQVRJQyAgICAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBGaWx0ZXJzICAgPSByZXF1aXJlKCcuL01hcEZpbHRlcnMnKTtcclxuY29uc3QgRXZlbnRGaWx0ZXJzID0gcmVxdWlyZSgnLi9FdmVudEZpbHRlcnMnKTtcclxuY29uc3QgTG9nRW50cmllcyAgID0gcmVxdWlyZSgnLi9Mb2dFbnRyaWVzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcbiAgICBkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIExvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVyICAgICAgICAgIDogJ2FsbCcsXHJcbiAgICAgICAgICAgIGV2ZW50RmlsdGVyICAgICAgICA6ICdhbGwnLFxyXG4gICAgICAgICAgICB0cmlnZ2VyTm90aWZpY2F0aW9uOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnkgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5JyksIG5leHRQcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpKTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhICAgICAgICA9IChuZXdHdWlsZHMgfHwgbmV3SGlzdG9yeSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld01hcEZpbHRlciAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hcEZpbHRlciwgbmV4dFN0YXRlLm1hcEZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgbmV3RXZlbnRGaWx0ZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZXZlbnRGaWx0ZXIsIG5leHRTdGF0ZS5ldmVudEZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgbmV3RmlsdGVycyAgICAgPSAobmV3TWFwRmlsdGVyIHx8IG5ld0V2ZW50RmlsdGVyKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlICAgPSAobmV3TGFuZyB8fCBuZXdEYXRhIHx8IG5ld0ZpbHRlcnMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TG9nczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0RhdGEsIG5ld0ZpbHRlcnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50SGlzdG9yeSA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cImxvZy1jb250YWluZXJcIj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvZy10YWJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXBGaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyID0ge3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFdvcmxkICA9IHtzZXRXb3JsZC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFdmVudEZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEZpbHRlciA9IHt0aGlzLnN0YXRlLmV2ZW50RmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEV2ZW50ICAgID0ge3NldEV2ZW50LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIHshZXZlbnRIaXN0b3J5LmlzRW1wdHkoKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPExvZ0VudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbiA9IHt0aGlzLnN0YXRlLnRyaWdnZXJOb3RpZmljYXRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlciAgICAgICAgICAgPSB7dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50RmlsdGVyICAgICAgICAgPSB7dGhpcy5zdGF0ZS5ldmVudEZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgICAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHMgICAgICAgICAgICAgID0ge3RoaXMucHJvcHMuZ3VpbGRzfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRIaXN0b3J5ICAgICAgICA9IHtldmVudEhpc3Rvcnl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFdvcmxkKGUpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuICAgIGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHttYXBGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldEV2ZW50KGUpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuICAgIGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHtldmVudEZpbHRlcjogZmlsdGVyLCB0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Mb2cucHJvcFR5cGVzICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBMb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCAgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzICA9IHJlcXVpcmUoJy4vTWFwU2NvcmVzJyk7XHJcbmNvbnN0IE1hcFNlY3Rpb24gPSByZXF1aXJlKCcuL01hcFNlY3Rpb24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBkZXRhaWxzICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkcyAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGV0YWlscyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBuZXdSZW1vdGVOb3csIG5leHRQcm9wcy5yZW1vdGVOb3cpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE1ldGEgICA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdrZXknKSA9PT0gdGhpcy5wcm9wcy5tYXBLZXkpO1xyXG4gICAgICAgIGNvbnN0IG1hcEluZGV4ICA9IG1hcE1ldGEuZ2V0KCdtYXBJbmRleCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgbWFwU2NvcmVzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnbWFwcycsICdzY29yZXMnLCBtYXBJbmRleF0pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczpyZW5kZXIoKScsIG1hcFNjb3Jlcy50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcFwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT17J3RlYW0gJyArIG1hcE1ldGEuZ2V0KCdjb2xvcicpfSBvbkNsaWNrPXtvblRpdGxlQ2xpY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXBTY29yZXMgc2NvcmVzPXttYXBTY29yZXN9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHttYXBNZXRhLmdldCgnc2VjdGlvbnMnKS5tYXAoKG1hcFNlY3Rpb24sIGl4U2VjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXBTZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ICA9IFwidWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICAgPSB7aXhTZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFNlY3Rpb24gPSB7bWFwU2VjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBNZXRhICAgID0ge21hcE1ldGF9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uVGl0bGVDbGljayhlKSB7XHJcbiAgICBsZXQgJG1hcHMgICAgPSAkKCcubWFwJyk7XHJcbiAgICBsZXQgJG1hcCAgICAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWFwJywgJG1hcHMpO1xyXG5cclxuICAgIGxldCBoYXNGb2N1cyA9ICRtYXAuaGFzQ2xhc3MoJ21hcC1mb2N1cycpO1xyXG5cclxuXHJcbiAgICBpZiAoIWhhc0ZvY3VzKSB7XHJcbiAgICAgICAgJG1hcFxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcbiAgICAgICAgJG1hcHMubm90KCRtYXApXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdtYXAtYmx1cicpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgJG1hcHNcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRGV0YWlscy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRGV0YWlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG51bWVyYWwgICA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgc2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcFNjb3JlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3Jlcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zY29yZXMubWFwKChzY29yZSwgaXhTY29yZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVhbSAgICAgID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddW2l4U2NvcmVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGtleT17dGVhbX0gY2xhc3NOYW1lPXtgdGVhbSAke3RlYW19YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXR0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT47XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwU2NvcmVzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICA9IE1hcFNjb3JlcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCdUcmFja2VyL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogTW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiB0cnVlLFxyXG4gICAgdGltZXIgICAgOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIGRldGFpbHMgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgbWFwU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxufTtcclxuXHJcbmNsYXNzIE1hcFNlY3Rpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBTZWN0aW9uOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdvYmplY3RpdmVzJyk7XHJcbiAgICAgICAgY29uc3Qgb3duZXJzICAgICAgICA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IGNsYWltZXJzICAgICAgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb25DbGFzcyAgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtgbGlzdC11bnN0eWxlZCAke3NlY3Rpb25DbGFzc31gfT5cclxuICAgICAgICAgICAgICAgIHttYXBPYmplY3RpdmVzLm1hcChvYmplY3RpdmVJZCA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ0lkICAgICA9IG9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXIgICAgICAgID0gb3duZXJzLmdldChzdHJpbmdJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xhaW1lciAgICAgID0gY2xhaW1lcnMuZ2V0KHN0cmluZ0lkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGRJZCAgICAgID0gKGNsYWltZXIpID8gY2xhaW1lci5nZXQoJ2d1aWxkJykgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc0NsYWltZXIgICA9ICEhZ3VpbGRJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzR3VpbGREYXRhID0gaGFzQ2xhaW1lciAmJiB0aGlzLnByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGQgICAgICAgID0gaGFzR3VpbGREYXRhID8gdGhpcy5wcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpIDogbnVsbDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtvYmplY3RpdmVJZH0gaWQ9eydvYmplY3RpdmUtJyArIG9iamVjdGl2ZUlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkQ29sb3IgID0ge293bmVyLmdldCgnd29ybGQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge293bmVyLmdldCgndGltZXN0YW1wJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7Z3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT47XHJcblxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0U2VjdGlvbkNsYXNzKG1hcEtleSwgc2VjdGlvbkxhYmVsKSB7XHJcbiAgICBsZXQgc2VjdGlvbkNsYXNzID0gW1xyXG4gICAgICAgICdjb2wtbWQtMjQnLFxyXG4gICAgICAgICdtYXAtc2VjdGlvbicsXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChtYXBLZXkgPT09ICdDZW50ZXInKSB7XHJcbiAgICAgICAgaWYgKHNlY3Rpb25MYWJlbCA9PT0gJ0Nhc3RsZScpIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlY3Rpb25DbGFzcy5qb2luKCcgJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBTZWN0aW9uLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBTZWN0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcERldGFpbHMgPSByZXF1aXJlKCcuL01hcERldGFpbHMnKTtcclxuY29uc3QgTG9nICAgICAgICA9IHJlcXVpcmUoJ1RyYWNrZXIvTG9nJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgZGV0YWlscyAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzRGF0YUluaXRpYWxpemVkID0gcHJvcHMuZGV0YWlscy5nZXQoJ2luaXRpYWxpemVkJyk7XHJcblxyXG4gICAgICAgIGlmICghaXNEYXRhSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJtYXBzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkNlbnRlclwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTE4XCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJSZWRIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiQmx1ZUhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJHcmVlbkhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMb2cgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcHMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNob3dOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1RhZyA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZElkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGd1aWxkICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRJZCwgbmV4dFByb3BzLmd1aWxkSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGQgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgICAgID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc3QgaGFzR3VpbGQgID0gISF0aGlzLnByb3BzLmd1aWxkSWQ7XHJcbiAgICAgICAgY29uc3QgaXNFbmFibGVkID0gKGhhc0d1aWxkICYmICh0aGlzLnByb3BzLnNob3dOYW1lIHx8IHRoaXMucHJvcHMuc2hvd1RhZykpO1xyXG5cclxuICAgICAgICBpZiAoIWlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0d1aWxkRGF0YSA9IChwcm9wcy5ndWlsZCAmJiBwcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGd1aWxkSWQgPSBwcm9wcy5ndWlsZElkO1xyXG4gICAgICAgICAgICBjb25zdCBocmVmICAgID0gYCMke2d1aWxkSWR9YDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ICAgPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG4gICAgICAgICAgICBsZXQgdGl0bGUgICAgID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNHdWlsZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhZyAgPSBwcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zaG93TmFtZSAmJiBwcm9wcy5zaG93VGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7YCR7bmFtZX0gWyR7dGFnfV0gYH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZE5hbWU9e25hbWV9IHNpemU9ezIwfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wcy5zaG93TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtuYW1lfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gYCR7dGFnfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBgJHtuYW1lfSBbJHt0YWd9XWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8YSBjbGFzc05hbWU9XCJndWlsZG5hbWVcIiBocmVmPXtocmVmfSB0aXRsZT17dGl0bGV9PlxyXG4gICAgICAgICAgICAgICAge2NvbnRlbnR9XHJcbiAgICAgICAgICAgIDwvYT47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEd1aWxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9TcHJpdGUnKTtcclxuY29uc3QgQXJyb3cgICAgID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0Fycm93Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNob3dBcnJvdyAgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1Nwcml0ZSA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgY29sb3IgICAgICA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEljb25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdDb2xvciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuY29sb3IsIG5leHRQcm9wcy5jb2xvcik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuc2hvd0Fycm93ICYmICF0aGlzLnByb3BzLnNob3dTcHJpdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvTWV0YSAgID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuICAgICAgICAgICAgY29uc3Qgb1R5cGVJZCA9IG9NZXRhLmdldCgndHlwZScpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9UeXBlICAgPSBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldChvVHlwZUlkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1pY29uc1wiPlxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnByb3BzLnNob3dBcnJvdykgP1xyXG4gICAgICAgICAgICAgICAgICAgIDxBcnJvdyBvTWV0YT17b01ldGF9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnByb3BzLnNob3dTcHJpdGUpID9cclxuICAgICAgICAgICAgICAgICAgICA8U3ByaXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge29UeXBlLmdldCgnbmFtZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHt0aGlzLnByb3BzLmNvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkljb25zLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gSWNvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9MYWJlbCAgID0gU1RBVElDLm9iamVjdGl2ZV9sYWJlbHMuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e29MYWJlbC5nZXQobGFuZ1NsdWcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTGFiZWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBOYW1lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIC8vIG1hcCBuYW1lIGNhbiBuZXZlciBjaGFuZ2UsIG5vdCBsb2NhbGl6ZWRcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9NZXRhICAgID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuICAgICAgICAgICAgY29uc3QgbWFwSW5kZXggPSBvTWV0YS5nZXQoJ21hcCcpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXBNZXRhICA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdtYXBJbmRleCcpID09PSBtYXBJbmRleCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbWFwXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT17bWFwTWV0YS5nZXQoJ25hbWUnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAge21hcE1ldGEuZ2V0KCdhYmJyJyl9XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcE5hbWUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IE1hcE5hbWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiAgIFRIRSBDT05URU5UIE9GIENPTVBPTkVOVCBJUyBNQU5BR0VEIEVYVEVSTkFMTFlcclxuKiAgIGxpYi50cmFja2VyVGltZXJzIElTIElOSVRJQUxJWkVEIElOIFRyYWNrZXIuY29tcG9uZW50RGlkTW91bnQoKTtcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8vIGNvbnN0IHNwaW5uZXIgICA9ICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgaXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUaW1lckNvdW50ZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3SXNFbmFibGVkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmlzRW5hYmxlZCwgbmV4dFByb3BzLmlzRW5hYmxlZCk7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0lzRW5hYmxlZCB8fCBuZXdUaW1lc3RhbXApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gPHNwYW5cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndGltZXIgY291bnRkb3duIGluYWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgZGF0YS10aW1lc3RhbXA9e3RoaXMucHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICA+PC9zcGFuPjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRpbWVyQ291bnRkb3duLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgID0gVGltZXJDb3VudGRvd247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiAgIFRIRSBDT05URU5UIE9GIENPTVBPTkVOVCBJUyBNQU5BR0VEIEVYVEVSTkFMTFlcclxuKiAgIGxpYi50cmFja2VyVGltZXJzIElTIElOSVRJQUxJWkVEIElOIFRyYWNrZXIuY29tcG9uZW50RGlkTW91bnQoKTtcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbmNvbnN0IHNwaW5uZXIgICA9ICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgaXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUaW1lclJlbGF0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRpbWVyIHJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRpbWVzdGFtcD17dGhpcy5wcm9wcy50aW1lc3RhbXB9XHJcbiAgICAgICAgICAgICAgICA+e3NwaW5uZXJ9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5UaW1lclJlbGF0aXZlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgPSBUaW1lclJlbGF0aXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVGltZXN0YW1wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXRpbWVzdGFtcFwiPlxyXG4gICAgICAgICAgICAgICAge21vbWVudCgodGhpcy5wcm9wcy50aW1lc3RhbXApICogMTAwMCkuZm9ybWF0KCdoaDptbTpzcycpfVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5UaW1lc3RhbXAucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gVGltZXN0YW1wO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICAgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBUaW1lclJlbGF0aXZlICA9IHJlcXVpcmUoJy4vVGltZXJSZWxhdGl2ZScpO1xyXG5jb25zdCBUaW1lc3RhbXAgICAgICA9IHJlcXVpcmUoJy4vVGltZXN0YW1wJyk7XHJcbmNvbnN0IE1hcE5hbWUgICAgICAgID0gcmVxdWlyZSgnLi9NYXBOYW1lJyk7XHJcbmNvbnN0IEljb25zICAgICAgICAgID0gcmVxdWlyZSgnLi9JY29ucycpO1xyXG5jb25zdCBMYWJlbCAgICAgICAgICA9IHJlcXVpcmUoJy4vTGFiZWwnKTtcclxuY29uc3QgR3VpbGQgICAgICAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcbmNvbnN0IFRpbWVyQ291bnRkb3duID0gcmVxdWlyZSgnLi9UaW1lckNvdW50ZG93bicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xEZWZhdWx0cyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogZmFsc2UsXHJcbiAgICBzcHJpdGUgICA6IGZhbHNlLFxyXG4gICAgbmFtZSAgICAgOiBmYWxzZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiBmYWxzZSxcclxuICAgIHRpbWVyICAgIDogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZENvbG9yIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGV2ZW50VHlwZSAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cclxuICAgIGd1aWxkSWQgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgZ3VpbGQgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cclxuICAgIGNvbHMgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG59O1xyXG5cclxuY2xhc3MgT2JqZWN0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdDYXB0dXJlICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBuZXdPd25lciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRDb2xvciwgbmV4dFByb3BzLndvcmxkQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NsYWltZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpPYmplY3RpdmVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdPYmplY3RpdmU6cmVuZGVyKCknLCB0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0aXZlSWQgPSB0aGlzLnByb3BzLm9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3Qgb01ldGEgICAgICAgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KG9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgLy8gc2hvcnQgY2lyY3VpdFxyXG4gICAgICAgIGlmIChvTWV0YS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb2xzID0gXy5kZWZhdWx0cyh0aGlzLnByb3BzLmNvbHMsIGNvbERlZmF1bHRzKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lID0ge2BvYmplY3RpdmUgdGVhbSAke3RoaXMucHJvcHMud29ybGRDb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxUaW1lclJlbGF0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLmVsYXBzZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7cHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxUaW1lc3RhbXBcclxuICAgICAgICAgICAgICAgICAgICBpc0VuYWJsZWQgICA9IHshIWNvbHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8TWFwTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIGlzRW5hYmxlZCAgID0geyEhY29scy5tYXBBYmJyZXZ9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxJY29uc1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dBcnJvdyAgID0geyEhY29scy5hcnJvd31cclxuICAgICAgICAgICAgICAgICAgICBzaG93U3ByaXRlICA9IHshIWNvbHMuc3ByaXRlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZUlkID0ge29iamVjdGl2ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yICAgICAgID0ge3RoaXMucHJvcHMud29ybGRDb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPExhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TmFtZSA9IHshIWNvbHMuZ3VpbGROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93VGFnICA9IHshIWNvbHMuZ3VpbGRUYWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgID0ge3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8VGltZXJDb3VudGRvd25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkID0geyEhY29scy50aW1lcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk9iamVjdGl2ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBPYmplY3RpdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy8vU3ByaXRlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgY29sb3IgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICB0eXBlUXVhbnRpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHR5cGVJZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3NJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQocHJvcHMudHlwZUlkKSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1F1YW50aXR5ICA9ICh0aGlzLnByb3BzLnR5cGVRdWFudGl0eSAhPT0gbmV4dFByb3BzLnR5cGVRdWFudGl0eSk7XHJcbiAgICAgICAgY29uc3QgbmV3VHlwZSAgICAgID0gKHRoaXMucHJvcHMudHlwZUlkICE9PSBuZXh0UHJvcHMudHlwZUlkKTtcclxuICAgICAgICBjb25zdCBuZXdDb2xvciAgICAgPSAodGhpcy5wcm9wcy5jb2xvciAhPT0gbmV4dFByb3BzLmNvbG9yKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UXVhbnRpdHkgfHwgbmV3VHlwZSB8fCBuZXdDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1R5cGUgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG5cclxuICAgICAgICBpZiAobmV3VHlwZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQodGhpcy5wcm9wcy50eXBlSWQpfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpTY29yZWJvYXJkOjpIb2xkaW5nc0l0ZW06cmVuZGVyKCknLCB0aGlzLnN0YXRlLm9UeXBlLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDxTcHJpdGVcclxuICAgICAgICAgICAgICAgICAgICB0eXBlICA9IHt0aGlzLnN0YXRlLm9UeXBlLmdldCgnbmFtZScpfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0ge3RoaXMucHJvcHMuY29sb3J9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIHtgIHgke3RoaXMucHJvcHMudHlwZVF1YW50aXR5fWB9XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuSG9sZGluZ3NJdGVtLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICA9IEhvbGRpbmdzSXRlbTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgSXRlbSAgICAgID0gcmVxdWlyZSgnLi9JdGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgY29sb3IgICA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGhvbGRpbmdzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEhvbGRpbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdIb2xkaW5ncyAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuaG9sZGluZ3MsIG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0hvbGRpbmdzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmhvbGRpbmdzLm1hcCgodHlwZVF1YW50aXR5LCB0eXBlSW5kZXgpID0+XHJcbiAgICAgICAgICAgICAgICA8SXRlbVxyXG4gICAgICAgICAgICAgICAgICAgIGtleSAgICAgICAgICA9IHt0eXBlSW5kZXh9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgICAgICAgID0ge3RoaXMucHJvcHMuY29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZVF1YW50aXR5ID0ge3R5cGVRdWFudGl0eX1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlSWQgICAgICAgPSB7KHR5cGVJbmRleCArIDEpLnRvU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvdWw+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICA9IEhvbGRpbmdzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBudW1lcmFsICAgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBIb2xkaW5ncyAgPSByZXF1aXJlKCcuL0hvbGRpbmdzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7aGVpZ2h0OiAnOTBweCcsIGZvbnRTaXplOiAnMzJwdCcsIGxpbmVIZWlnaHQ6ICc5MHB4J319PlxyXG4gICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHNjb3JlICAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB0aWNrICAgIDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZSAgICAgPSAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuICAgICAgICBjb25zdCBuZXdUaWNrICAgICAgPSAodGhpcy5wcm9wcy50aWNrICE9PSBuZXh0UHJvcHMudGljayk7XHJcbiAgICAgICAgY29uc3QgbmV3SG9sZGluZ3MgID0gKHRoaXMucHJvcHMuaG9sZGluZ3MgIT09IG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkIHx8IG5ld1Njb3JlIHx8IG5ld1RpY2sgfHwgbmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1gfT5cclxuICAgICAgICAgICAgICAgICAgICB7KHRoaXMucHJvcHMud29ybGQgJiYgSW1tdXRhYmxlLk1hcC5pc01hcCh0aGlzLnByb3BzLndvcmxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48YSBocmVmPXt0aGlzLnByb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy53b3JsZC5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtudW1lcmFsKHRoaXMucHJvcHMuc2NvcmUpLmZvcm1hdCgnMCwwJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bnVtZXJhbCh0aGlzLnByb3BzLnRpY2spLmZvcm1hdCgnKzAsMCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SG9sZGluZ3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2NvbG9yJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGluZ3M9e3RoaXMucHJvcHMuaG9sZGluZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBsb2FkaW5nSHRtbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFNjb3JlYm9hcmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc2NvcmVzJykpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZHMgfHwgbmV3U2NvcmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBzY29yZXMgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuICAgICAgICBjb25zdCB0aWNrcyAgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCd0aWNrcycpO1xyXG4gICAgICAgIGNvbnN0IGhvbGRpbmdzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ2hvbGRpbmdzJyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInJvd1wiIGlkPVwic2NvcmVib2FyZHNcIj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hdGNoV29ybGRzLm1hcCgod29ybGQsIGl4V29ybGQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgID0ge2l4V29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkICAgID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZSAgICA9IHtzY29yZXMuZ2V0KGl4V29ybGQpIHx8IDB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sgICAgID0ge3RpY2tzLmdldChpeFdvcmxkKSB8fCAwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob2xkaW5ncyA9IHtob2xkaW5ncy5nZXQoaXhXb3JsZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBTY29yZWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBsaWJzXHJcbiovXHJcblxyXG5jb25zdCBsaWJEYXRlICAgICAgID0gcmVxdWlyZSgnbGliL2RhdGUnKTtcclxuY29uc3QgdHJhY2tlclRpbWVycyA9IHJlcXVpcmUoJ2xpYi90cmFja2VyVGltZXJzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5jb25zdCBEQU8gICAgICAgICAgID0gcmVxdWlyZSgnbGliL2RhdGEvdHJhY2tlcicpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNjb3JlYm9hcmQgICAgPSByZXF1aXJlKCcuL1Njb3JlYm9hcmQnKTtcclxuY29uc3QgTWFwcyAgICAgICAgICA9IHJlcXVpcmUoJy4vTWFwcycpO1xyXG5jb25zdCBHdWlsZHMgICAgICAgID0gcmVxdWlyZSgnLi9HdWlsZHMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgdXBkYXRlVGltZUludGVydmFsID0gMTAwMDtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgICBSZWFjdCBMaWZlY3ljbGVcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IHt9O1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGFMaXN0ZW5lcnMgPSB7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEZXRhaWxzOiB0aGlzLm9uTWF0Y2hEZXRhaWxzLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIG9uR3VpbGREZXRhaWxzOiB0aGlzLm9uR3VpbGREZXRhaWxzLmJpbmQodGhpcyksXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRhbyA9IG5ldyBEQU8oZGF0YUxpc3RlbmVycyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGFzRGF0YSAgICA6IGZhbHNlLFxyXG4gICAgICAgICAgICBsYXN0bW9kICAgIDogMCxcclxuXHJcbiAgICAgICAgICAgIHRpbWUgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbCAgOiBsaWJEYXRlLmRhdGVOb3coKSxcclxuICAgICAgICAgICAgICAgIHJlbW90ZSA6IDAsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgOiAwLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbWF0Y2ggICAgICA6IEltbXV0YWJsZS5NYXAoe2xhc3Rtb2Q6IDB9KSxcclxuICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IEltbXV0YWJsZS5MaXN0KCksXHJcbiAgICAgICAgICAgIGRldGFpbHMgICAgOiBJbW11dGFibGUuTWFwKCksXHJcbiAgICAgICAgICAgIGNsYWltRXZlbnRzOiBJbW11dGFibGUuTGlzdCgpLFxyXG4gICAgICAgICAgICBndWlsZHMgICAgIDogSW1tdXRhYmxlLk1hcCgpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBpbml0aWFsRGF0YSAgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuaGFzRGF0YSwgbmV4dFN0YXRlLmhhc0RhdGEpO1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGNoRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5sYXN0bW9kLCBuZXh0U3RhdGUubGFzdG1vZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmd1aWxkcywgbmV4dFN0YXRlLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKGluaXRpYWxEYXRhIHx8IG5ld01hdGNoRGF0YSB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlVGltZXJzKCgpID0+IHNldEludGVydmFsKHRoaXMudXBkYXRlVGltZXJzLmJpbmQodGhpcyksIDEwMDApKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVycy5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCknLCBuZXdMYW5nKTtcclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1hdGNoV29ybGRzOiB0aGlzLmRhby5nZXRNYXRjaFdvcmxkcyhuZXh0UHJvcHMubGFuZywgdGhpcy5zdGF0ZS5tYXRjaCksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvLyBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xyXG4gICAgLy8gIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnRXaWxsVXBkYXRlKCknKTtcclxuICAgIC8vIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6cmVuZGVyKCknKTtcclxuXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cInRyYWNrZXJcIj5cclxuXHJcbiAgICAgICAgICAgICAgICA8U2NvcmVib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoV29ybGRzID0ge3RoaXMuc3RhdGUubWF0Y2hXb3JsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggICAgICAgPSB7dGhpcy5zdGF0ZS5tYXRjaH1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPE1hcHNcclxuICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUgICAgICAgID0ge3RoaXMuc3RhdGUudGltZX1cclxuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzICAgICA9IHt0aGlzLnN0YXRlLmRldGFpbHN9XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hXb3JsZHMgPSB7dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuICAgICAgICAgICAgICAgICAgICBndWlsZHMgICAgICA9IHt0aGlzLnN0YXRlLmd1aWxkc31cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KCF0aGlzLnN0YXRlLmd1aWxkcy5pc0VtcHR5KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxHdWlsZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgICAgICAgID0ge3RoaXMuc3RhdGUudGltZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZHMgICAgICA9IHt0aGlzLnN0YXRlLmd1aWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFpbUV2ZW50cyA9IHt0aGlzLnN0YXRlLmNsYWltRXZlbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICB1cGRhdGVUaW1lcnMoY2I9Xy5ub29wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAgICAgICAgIHRyYWNrZXJUaW1lcnMudXBkYXRlKHRoaXMuc3RhdGUudGltZS5vZmZzZXQsIGNiKTtcclxuICAgICAgICAgICAgdGhpcy5fX3RpbWVvdXRzLnVwZGF0ZVRpbWVycyA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVUaW1lcnMuYmluZCh0aGlzKSwgdXBkYXRlVGltZUludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgb25NYXRjaERldGFpbHModGltZVJlbW90ZSwgbWF0Y2hEYXRhLCBkZXRhaWxzRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGxhc3Rtb2QgICAgICA9IG1hdGNoRGF0YS5nZXQoJ2xhc3Rtb2QnKTtcclxuICAgICAgICBjb25zdCBpc01vZGlmaWVkICAgPSAobGFzdG1vZCAhPT0gdGhpcy5zdGF0ZS5tYXRjaC5nZXQoJ2xhc3Rtb2QnKSk7XHJcblxyXG5cclxuICAgICAgICBpZiAoaXNNb2RpZmllZCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGFpbUV2ZW50cyA9IHRoaXMuZGFvLmd1aWxkcy5nZXRFdmVudHNCeVR5cGUoZGV0YWlsc0RhdGEsICdjbGFpbScpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGltZUxvY2FsICAgID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgY29uc3QgcmVtb3RlT2Zmc2V0ID0gdGltZUxvY2FsIC0gdGltZVJlbW90ZTtcclxuICAgICAgICAgICAgY29uc3QgdGltZU9mZnNldCAgID0gKHRoaXMuc3RhdGUudGltZS5vZmZzZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAocmVtb3RlT2Zmc2V0ICsgdGhpcy5zdGF0ZS50aW1lLm9mZnNldCkgLyAyIC8vIGF2ZXJhZ2Ugd2l0aCBwcmV2aW91cyBvZmZzZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHJlbW90ZU9mZnNldDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbCA6IHRpbWVMb2NhbCxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogTWF0aC5yb3VuZCh0aW1lT2Zmc2V0KSxcclxuICAgICAgICAgICAgICAgIHJlbW90ZTogdGltZVJlbW90ZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAvLyB1c2UgdHJhbnNhY3Rpb25hbCBzZXRTdGF0ZVxyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgICAgICBoYXNEYXRhOiB0cnVlLFxyXG5cclxuICAgICAgICAgICAgICAgIGxhc3Rtb2QsXHJcbiAgICAgICAgICAgICAgICB0aW1lLFxyXG4gICAgICAgICAgICAgICAgY2xhaW1FdmVudHMsXHJcblxyXG4gICAgICAgICAgICAgICAgbWF0Y2ggIDogc3RhdGUubWF0Y2gubWVyZ2VEZWVwKG1hdGNoRGF0YSksXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiBzdGF0ZS5kZXRhaWxzLm1lcmdlRGVlcChkZXRhaWxzRGF0YSksXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLmRhby5ndWlsZHMubG9va3VwKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ndWlsZHMsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzRGF0YSxcclxuICAgICAgICAgICAgICAgIHRoaXMub25HdWlsZERldGFpbHMuYmluZCh0aGlzKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5tYXRjaFdvcmxkcy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoV29ybGRzOiB0aGlzLmRhby5nZXRNYXRjaFdvcmxkcyh0aGlzLnByb3BzLmxhbmcsIHRoaXMuc3RhdGUubWF0Y2gpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBvbkd1aWxkRGV0YWlscyhndWlsZCwgZ3VpbGRJZCkge1xyXG4gICAgICAgIGNvbnN0IF9ndWlsZElkID0gZ3VpbGRJZCB8fCBndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmNsYWltRXZlbnRzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBndWlsZCA9IHRoaXMuZGFvLmd1aWxkcy5hdHRhY2hDbGFpbXModGhpcy5zdGF0ZS5jbGFpbUV2ZW50cywgZ3VpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBndWlsZHM6IHN0YXRlLmd1aWxkcy5tZXJnZUluKFtfZ3VpbGRJZF0sIGd1aWxkKSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBNYXRjaCBEZXRhaWxzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nLCB3b3JsZCkge1xyXG4gICAgbGV0IGxhbmdTbHVnICA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcbiAgICBsZXQgd29ybGROYW1lID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnbmFtZSddKTtcclxuXHJcbiAgICBsZXQgdGl0bGUgICAgID0gW3dvcmxkTmFtZSwgJ2d3MncydyddO1xyXG5cclxuICAgIGlmIChsYW5nU2x1ZyAhPT0gJ2VuJykge1xyXG4gICAgICAgIHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgndGl0bGUnKS50ZXh0KHRpdGxlLmpvaW4oJyAtICcpKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRyYWNrZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IFRyYWNrZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgb01ldGE6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdPYmplY3RpdmVNZXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm9NZXRhLCBuZXh0UHJvcHMub01ldGEpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdPYmplY3RpdmVNZXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaW1nU3JjID0gZ2V0QXJyb3dTcmModGhpcy5wcm9wcy5vTWV0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWUgPSBcImRpcmVjdGlvblwiPlxyXG4gICAgICAgICAgICB7KGltZ1NyYylcclxuICAgICAgICAgICAgICAgID8gPGltZyBzcmMgPSB7aW1nU3JjfSAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICA8L3NwYW4+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFByaXZhdGUgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEFycm93U3JjKG1ldGEpIHtcclxuICAgIGlmICghbWV0YS5nZXQoJ2QnKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuICAgIGlmIChtZXRhLmdldCgnbicpKSAgICAgIHtzcmMucHVzaCgnbm9ydGgnKTt9XHJcbiAgICBlbHNlIGlmIChtZXRhLmdldCgncycpKSB7c3JjLnB1c2goJ3NvdXRoJyk7fVxyXG5cclxuICAgIGlmIChtZXRhLmdldCgndycpKSAgICAgIHtzcmMucHVzaCgnd2VzdCcpO31cclxuICAgIGVsc2UgaWYgKG1ldGEuZ2V0KCdlJykpIHtzcmMucHVzaCgnZWFzdCcpO31cclxuXHJcbiAgICByZXR1cm4gc3JjLmpvaW4oJy0nKSArICcuc3ZnJztcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkFycm93LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gQXJyb3c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzaXplICAgICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkTmFtZSAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2l6ZSAgICAgOiAyNTYsXHJcbiAgICBndWlsZE5hbWUgIDogdW5kZWZpbmVkLFxyXG59O1xyXG5cclxuY2xhc3MgRW1ibGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdOYW1lICAgICAgPSAodGhpcy5wcm9wcy5ndWlsZE5hbWUgIT09IG5leHRQcm9wcy5ndWlsZE5hbWUpOyAvLyBjaGFuZ2VzIHdoZW4gZGVmaW5lZFxyXG4gICAgICAgIGNvbnN0IG5ld1NpemUgICAgICA9ICh0aGlzLnByb3BzLnNpemUgIT09IG5leHRQcm9wcy5zaXplKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2l6ZSB8fCBuZXdOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZW1ibGVtU3JjID0gZ2V0RW1ibGVtU3JjKHRoaXMucHJvcHMuZ3VpbGROYW1lKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2VtYmxlbScsIHRoaXMucHJvcHMuZ3VpbGROYW1lLCBlbWJsZW1TcmMpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBcImVtYmxlbVwiXHJcbiAgICAgICAgICAgIHNyYyAgICAgICA9IHtlbWJsZW1TcmN9XHJcbiAgICAgICAgICAgIHdpZHRoICAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIG9uRXJyb3IgICA9IHtpbWdPbkVycm9yfVxyXG4gICAgICAgIC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcbiAgICByZXR1cm4gKGd1aWxkTmFtZSlcclxuICAgICAgICA/IGBodHRwOlxcL1xcL2d1aWxkcy5ndzJ3MncuY29tXFwvZ3VpbGRzXFwvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9XFwvMjU2LnN2Z2BcclxuICAgICAgICA6IGltZ1BsYWNlaG9sZGVyO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW1nT25FcnJvcihlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50U3JjID0gJChlLnRhcmdldCkuYXR0cignc3JjJyk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRTcmMgIT09IGltZ1BsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgJChlLnRhcmdldCkuYXR0cignc3JjJywgaW1nUGxhY2Vob2xkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkVtYmxlbS5wcm9wVHlwZXMgICAgPSBwcm9wVHlwZXM7XHJcbkVtYmxlbS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gRW1ibGVtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1BpZTo6cmVuZGVyJywgcHJvcHMuc2NvcmVzLnRvQXJyYXkoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8aW1nXHJcbiAgICAgICAgICAgIHdpZHRoID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgICAgICBzcmMgPSB7Z2V0SW1hZ2VTb3VyY2UocHJvcHMuc2NvcmVzLnRvQXJyYXkoKSl9XHJcbiAgICAgICAgLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cDpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLmpvaW4oJywnKX0/c3Ryb2tlV2lkdGg9JHtJTlNUQU5DRS5zdHJva2V9YDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5QaWUucHJvcFR5cGVzICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBQaWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHR5cGUgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgU3ByaXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUeXBlICAgICAgPSAodGhpcy5wcm9wcy50eXBlICE9PSBuZXh0UHJvcHMudHlwZSk7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gKHRoaXMucHJvcHMuY29sb3IgIT09IG5leHRQcm9wcy5jb2xvcik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1R5cGUgfHwgbmV3Q29sb3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWUgPSB7YHNwcml0ZSAke3RoaXMucHJvcHMudHlwZX0gJHt0aGlzLnByb3BzLmNvbG9yfWB9IC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnQgTW9kdWxlXHJcbiAqXHJcbiAqL1xyXG5cclxuU3ByaXRlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IFNwcml0ZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnRlZCBDb21wb25lbnRcclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuICAgIGxpbmtMYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTGFuZ0xpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlICA9IEltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIHRoaXMucHJvcHMubGlua0xhbmcpO1xyXG4gICAgICAgIGNvbnN0IGxpc3RDbGFzcyA9IGlzQWN0aXZlID8gJ2FjdGl2ZScgOiAnJztcclxuXHJcbiAgICAgICAgY29uc3QgdGl0bGUgICAgID0gdGhpcy5wcm9wcy5saW5rTGFuZy5nZXQoJ25hbWUnKTtcclxuICAgICAgICBjb25zdCBsYWJlbCAgICAgPSB0aGlzLnByb3BzLmxpbmtMYW5nLmdldCgnbGFiZWwnKTtcclxuICAgICAgICBjb25zdCBsaW5rICAgICAgPSBnZXRMaW5rKHRoaXMucHJvcHMubGlua0xhbmcsIHRoaXMucHJvcHMud29ybGQpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZSA9IHtsaXN0Q2xhc3N9IHRpdGxlID0ge3RpdGxlfT5cclxuICAgICAgICAgICAgPGEgaHJlZiA9IHtsaW5rfT57bGFiZWx9PC9hPlxyXG4gICAgICAgIDwvbGk+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFByaXZhdGUgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldExpbmsobGFuZywgd29ybGQpIHtcclxuICAgIGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcbiAgICBsZXQgbGluayA9IGAvJHtsYW5nU2x1Z31gO1xyXG5cclxuICAgIGlmICh3b3JsZCkge1xyXG4gICAgICAgIGxldCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG4gICAgICAgIGxpbmsgKz0gYC8ke3dvcmxkU2x1Z31gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsaW5rO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnQgTW9kdWxlXHJcbiAqXHJcbiAqL1xyXG5cclxuTGFuZ0xpbmsucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyA9IExhbmdMaW5rO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcbmNvbnN0IExhbmdMaW5rICA9IHJlcXVpcmUoJy4vTGFuZ0xpbmsnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnRlZCBDb21wb25lbnRcclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcbmNsYXNzIExhbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xhbmdzOjpyZW5kZXIoKScsIHRoaXMucHJvcHMubGFuZy50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gPHVsIGNsYXNzTmFtZSA9ICduYXYgbmF2YmFyLW5hdic+XHJcbiAgICAgICAgICAgIHtTVEFUSUMubGFuZ3MubWFwKChsaW5rTGFuZywga2V5KSA9PlxyXG4gICAgICAgICAgICAgICAgPExhbmdMaW5rXHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID0ge2tleX1cclxuICAgICAgICAgICAgICAgICAgICBsaW5rTGFuZyA9IHtsaW5rTGFuZ31cclxuICAgICAgICAgICAgICAgICAgICBsYW5nID0ge3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICB3b3JsZCA9IHt0aGlzLnByb3BzLndvcmxkfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L3VsPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkxhbmdzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTGFuZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZ2V0R3VpbGREZXRhaWxzICAgICAgIDogZ2V0R3VpbGREZXRhaWxzLFxyXG4gICAgZ2V0TWF0Y2hlcyAgICAgICAgICAgIDogZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoRGV0YWlsc0J5V29ybGQ6IGdldE1hdGNoRGV0YWlsc0J5V29ybGQsXHJcbiAgICAvLyBnZXRNYXRjaERldGFpbHMgICAgOiBnZXRNYXRjaERldGFpbHMsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuICAgIGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG4gICAgZ3cyYXBpLmdldEd1aWxkRGV0YWlscyh7XHJcbiAgICAgICAgZ3VpbGRfaWQ6IGd1aWxkSWQsXHJcbiAgICB9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKG1hdGNoSWQsIGNhbGxiYWNrKSB7XHJcbi8vICAgZ3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlKHttYXRjaF9pZDogbWF0Y2hJZH0sIGNhbGxiYWNrKTtcclxuLy8gfVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHNCeVdvcmxkKHdvcmxkU2x1ZywgY2FsbGJhY2spIHtcclxuICAgIC8vIHNldFRpbWVvdXQoXHJcbiAgICAvLyAgZ3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlLmJpbmQobnVsbCwge3dvcmxkX3NsdWc6IHdvcmxkU2x1Z30sIGNhbGxiYWNrKSxcclxuICAgIC8vICAzMDAwXHJcbiAgICAvLyApO1xyXG4gICAgZ3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlKHtcclxuICAgICAgICB3b3JsZF9zbHVnOiB3b3JsZFNsdWcsXHJcbiAgICB9LCBjYWxsYmFjayk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgYXBpICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuY2xhc3MgT3ZlcnZpZXdEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3Ojpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0V29ybGRzQnlSZWdpb24obGFuZykge1xyXG4gICAgICAgIHJldHVybiBJbW11dGFibGVcclxuICAgICAgICAgICAgLlNlcShTVEFUSUMud29ybGRzKVxyXG4gICAgICAgICAgICAubWFwKHdvcmxkICAgICA9PiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkpXHJcbiAgICAgICAgICAgIC5zb3J0Qnkod29ybGQgID0+IHdvcmxkLmdldCgnbmFtZScpKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldE1hdGNoZXNCeVJlZ2lvbihtYXRjaERhdGEpIHtcclxuICAgICAgICByZXR1cm4gSW1tdXRhYmxlXHJcbiAgICAgICAgICAgIC5TZXEobWF0Y2hEYXRhKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeShtYXRjaCA9PiBtYXRjaC5nZXQoJ3JlZ2lvbicpLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fZ2V0RGF0YSgpJyk7XHJcbiAgICAgICAgYXBpLmdldE1hdGNoZXModGhpcy5fX29uTWF0Y2hEYXRhLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19zZXREYXRhVGltZW91dCgpIHtcclxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IGdldEludGVydmFsKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fc2V0RGF0YVRpbWVvdXQoKScsIGludGVydmFsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzLm1hdGNoRGF0YSA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgIHRoaXMuX19nZXREYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGludGVydmFsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERhdGEoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6Ol9fb25NYXRjaERhdGEoKScsIGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGNoRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG4gICAgICAgIGlmICghZXJyICYmIG1hdGNoRGF0YSAmJiAhbWF0Y2hEYXRhLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAodGhpcy5fX2xpc3RlbmVycy5vbk1hdGNoRGF0YSB8fCBfLm5vb3ApKG1hdGNoRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9fc2V0RGF0YVRpbWVvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gKiBEYXRhIC0gV29ybGRzXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRCeUxhbmcobGFuZywgd29ybGQpIHtcclxuICAgIGNvbnN0IGxhbmdTbHVnICAgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgIGNvbnN0IHdvcmxkQnlMYW5nID0gd29ybGQuZ2V0KGxhbmdTbHVnKTtcclxuXHJcbiAgICBjb25zdCByZWdpb24gICAgICA9IHdvcmxkLmdldCgncmVnaW9uJyk7XHJcbiAgICBjb25zdCBsaW5rICAgICAgICA9IGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGRCeUxhbmcpO1xyXG5cclxuICAgIHJldHVybiB3b3JsZEJ5TGFuZy5tZXJnZSh7XHJcbiAgICAgICAgbGluayxcclxuICAgICAgICByZWdpb24sXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SW50ZXJ2YWwoKSB7XHJcbiAgICByZXR1cm4gXy5yYW5kb20oMjAwMCwgNDAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPdmVydmlld0RhdGFQcm92aWRlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IGFzeW5jICAgICA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5jb25zdCBhcGkgICAgICAgPSByZXF1aXJlKCdsaWIvYXBpJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogTW9kdWxlIEdsb2JhbHNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBndWlsZERlZmF1bHQgPSBJbW11dGFibGUuTWFwKHtcclxuICAgIGxvYWRlZCAgICA6IGZhbHNlLFxyXG4gICAgbGFzdENsYWltIDogMCxcclxuICAgIGNsYWltcyAgICA6IEltbXV0YWJsZS5NYXAoKSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbnVtUXVldWVDb25jdXJyZW50ID0gODtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFB1YmxpYyBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuY2xhc3MgTGliR3VpbGRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgICB0aGlzLl9fYXN5bmNHdWlsZFF1ZXVlID0gYXN5bmMucXVldWUoXHJcbiAgICAgICAgICAgIGdldEd1aWxkRGV0YWlscyxcclxuICAgICAgICAgICAgbnVtUXVldWVDb25jdXJyZW50XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0R3VpbGREZWZhdWx0KCkge1xyXG4gICAgICAgIHJldHVybiBndWlsZERlZmF1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCBldmVudFR5cGUpIHtcclxuICAgICAgICByZXR1cm4gbWF0Y2hEZXRhaWxzXHJcbiAgICAgICAgICAgIC5nZXQoJ2hpc3RvcnknKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgndHlwZScpID09PSBldmVudFR5cGUpO1xyXG4gICAgICAgIC8vIC5zb3J0QnkoZW50cnkgPT4gLWVudHJ5LmdldCgndGltZXN0YW1wJykpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRVbmtub3duR3VpbGRzKHN0YXRlR3VpbGRzLCBtYXRjaERldGFpbHMpIHtcclxuICAgICAgICBjb25zdCBjbGFpbUV2ZW50cyAgICAgICA9IHRoaXMuZ2V0RXZlbnRzQnlUeXBlKG1hdGNoRGV0YWlscywgJ2NsYWltJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0aXZlQ2xhaW1lcnMgPSBtYXRjaERldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG5cclxuICAgICAgICBjb25zdCBrbm93bkd1aWxkcyA9IHN0YXRlR3VpbGRzXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZF9pZCcpKVxyXG4gICAgICAgICAgICAudG9TZXQoKTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkc1dpdGhDdXJyZW50Q2xhaW1zID0gb2JqZWN0aXZlQ2xhaW1lcnNcclxuICAgICAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcbiAgICAgICAgICAgIC50b1NldCgpO1xyXG5cclxuICAgICAgICBjb25zdCBndWlsZHNXaXRoUHJldmlvdXNDbGFpbXMgPSBjbGFpbUV2ZW50c1xyXG4gICAgICAgICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSlcclxuICAgICAgICAgICAgLnRvU2V0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkQ2xhaW1zID0gZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXNcclxuICAgICAgICAgICAgLnVuaW9uKGd1aWxkc1dpdGhQcmV2aW91c0NsYWltcyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgdW5rbm93bkd1aWxkcyA9IGd1aWxkQ2xhaW1zXHJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChrbm93bkd1aWxkcyk7XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZ3VpbGRDbGFpbXMnLCBndWlsZENsYWltcy50b0FycmF5KCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdrbm93bkd1aWxkcycsIGtub3duR3VpbGRzLnRvQXJyYXkoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Vua25vd25HdWlsZHMnLCB1bmtub3duR3VpbGRzLnRvQXJyYXkoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB1bmtub3duR3VpbGRzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbG9va3VwKGtub3duR3VpbGRzLCBtYXRjaERldGFpbHMsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgY29uc3QgdW5rbm93bkd1aWxkcyA9IHRoaXMuZ2V0VW5rbm93bkd1aWxkcyhrbm93bkd1aWxkcywgbWF0Y2hEZXRhaWxzKTtcclxuICAgICAgICBjb25zdCBkZWZhdWx0R3VpbGQgPSB0aGlzLmdldEd1aWxkRGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB1bmtub3duR3VpbGRzLmZvckVhY2goZ3VpbGRJZCA9PiB7XHJcblxyXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgICAgIGNvbnN0IGd1aWxkID0gZGVmYXVsdEd1aWxkLnNldCgnZ3VpbGRfaWQnLCBndWlsZElkKTtcclxuICAgICAgICAgICAgbGlzdGVuZXIoZ3VpbGQsIGd1aWxkSWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IGZyb20gcmVtb3RlXHJcbiAgICAgICAgICAgIHRoaXMuX19hc3luY0d1aWxkUXVldWUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGF0dGFjaENsYWltcyhjbGFpbUV2ZW50cywgZ3VpbGQpIHtcclxuICAgICAgICBjb25zdCBndWlsZElkID0gZ3VpbGQuZ2V0KCdndWlsZF9pZCcpO1xyXG4gICAgICAgIGNvbnN0IGluY0NsYWltcyA9IGNsYWltRXZlbnRzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpID09PSBndWlsZElkKVxyXG4gICAgICAgICAgICAudG9NYXAoKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzQ2xhaW1zICAgICAgPSBndWlsZC5nZXQoJ2NsYWltcycpICYmICFndWlsZC5nZXQoJ2NsYWltcycpLmlzRW1wdHkoKTtcclxuICAgICAgICBjb25zdCBuZXdlc3RDbGFpbSAgICA9IGhhc0NsYWltcyA/IGd1aWxkLmdldCgnY2xhaW1zJykuZmlyc3QoKSA6IG51bGw7XHJcbiAgICAgICAgY29uc3QgaW5jSGFzQ2xhaW1zICAgPSAhaW5jQ2xhaW1zLmlzRW1wdHkoKTtcclxuICAgICAgICBjb25zdCBpbmNOZXdlc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY0NsYWltcy5maXJzdCgpIDogbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzTmV3Q2xhaW1zICAgPSAoIUltbXV0YWJsZS5pcyhuZXdlc3RDbGFpbSwgaW5jTmV3ZXN0Q2xhaW0pKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChoYXNOZXdDbGFpbXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdENsYWltID0gaW5jSGFzQ2xhaW1zID8gaW5jTmV3ZXN0Q2xhaW0uZ2V0KCd0aW1lc3RhbXAnKSA6IDA7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGFpbXMgYWx0ZXJlZCcsIGd1aWxkSWQsIGhhc05ld0NsYWltcywgbGFzdENsYWltKTtcclxuICAgICAgICAgICAgZ3VpbGQgPSBndWlsZC5zZXQoJ2NsYWltcycsIGluY0NsYWltcyk7XHJcbiAgICAgICAgICAgIGd1aWxkID0gZ3VpbGQuc2V0KCdsYXN0Q2xhaW0nLCBsYXN0Q2xhaW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGd1aWxkO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhjYXJnbywgb25Db21wbGV0ZSkge1xyXG4gICAgYXBpLmdldEd1aWxkRGV0YWlscyhcclxuICAgICAgICBjYXJnby5ndWlsZElkLFxyXG4gICAgICAgIG9uR3VpbGREYXRhLmJpbmQobnVsbCwgY2FyZ28pXHJcbiAgICApO1xyXG5cclxuICAgIG9uQ29tcGxldGUoKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvbkd1aWxkRGF0YShjYXJnbywgZXJyLCBkYXRhKSB7XHJcbiAgICBpZiAoIWVyciAmJiBkYXRhKSB7XHJcbiAgICAgICAgZGVsZXRlIGRhdGEuZW1ibGVtO1xyXG4gICAgICAgIGRhdGEubG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGREYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhKTtcclxuXHJcbiAgICAgICAgY2FyZ28ubGlzdGVuZXIoZ3VpbGREYXRhLCBjYXJnby5ndWlsZElkKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpYkd1aWxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgR3VpbGRzREFPID0gcmVxdWlyZSgnLi9ndWlsZHMnKTtcclxuXHJcbmNvbnN0IGFwaSAgICAgICA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcbmNsYXNzIE92ZXJ2aWV3RGF0YVByb3ZpZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0ZW5lcnMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19sYW5nU2x1ZyAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX193b3JsZFNsdWcgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmd1aWxkcyAgICAgID0gbmV3IEd1aWxkc0RBTygpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX19saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBpbml0KGxhbmcsIHdvcmxkKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19sYW5nU2x1ZyAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgICAgIHRoaXMuX193b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbdGhpcy5fX2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y2xvc2UoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRNYXRjaFdvcmxkcyhsYW5nLCBtYXRjaCkge1xyXG4gICAgICAgIHJldHVybiBJbW11dGFibGVcclxuICAgICAgICAgICAgLkxpc3QoWydyZWQnLCAnYmx1ZScsICdncmVlbiddKVxyXG4gICAgICAgICAgICAubWFwKGdldE1hdGNoV29ybGQuYmluZChudWxsLCBsYW5nLCBtYXRjaCkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19nZXREYXRhKCknKTtcclxuXHJcbiAgICAgICAgYXBpLmdldE1hdGNoRGV0YWlsc0J5V29ybGQoXHJcbiAgICAgICAgICAgIHRoaXMuX193b3JsZFNsdWcsXHJcbiAgICAgICAgICAgIHRoaXMuX19vbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERldGFpbHMoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19vbk1hdGNoRGF0YSgpJywgZGF0YSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICghZXJyICYmIGRhdGEgJiYgZGF0YS5tYXRjaCAmJiBkYXRhLmRldGFpbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZVJlbW90ZSAgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubm93KTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hEYXRhICAgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubWF0Y2gpO1xyXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5kZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERldGFpbHModGltZVJlbW90ZSwgbWF0Y2hEYXRhLCBkZXRhaWxzRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGVEYXRhVXBkYXRlLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCAqIDIsIDEwMDAgKiA0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzLmRhdGEgPSBzZXRUaW1lb3V0KHRoaXMuX19nZXREYXRhLmJpbmQodGhpcyksIHJlZnJlc2hUaW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiAgIFdvcmxkc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hXb3JsZChsYW5nLCBtYXRjaCwgY29sb3IpIHtcclxuICAgIGNvbnN0IGxhbmdTbHVnICAgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgIGNvbnN0IHdvcmxkS2V5ICAgID0gY29sb3IgKyAnSWQnO1xyXG4gICAgY29uc3Qgd29ybGRJZCAgICAgPSBtYXRjaC5nZXRJbihbd29ybGRLZXldKS50b1N0cmluZygpO1xyXG4gICAgY29uc3Qgd29ybGRCeUxhbmcgPSBTVEFUSUMud29ybGRzLmdldEluKFt3b3JsZElkLCBsYW5nU2x1Z10pO1xyXG5cclxuICAgIHJldHVybiB3b3JsZEJ5TGFuZ1xyXG4gICAgICAgIC5zZXQoJ2NvbG9yJywgY29sb3IpXHJcbiAgICAgICAgLnNldCgnbGluaycsIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGRCeUxhbmcpKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGQuZ2V0KCdzbHVnJyldLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3RGF0YVByb3ZpZGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGRhdGVOb3c6IGRhdGVOb3csXHJcbiAgICBhZGQ1ICAgOiBhZGQ1LFxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRhdGVOb3coKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihfLm5vdygpIC8gMTAwMCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBhZGQ1KGluRGF0ZSkge1xyXG4gICAgY29uc3QgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcbiAgICByZXR1cm4gKF9iYXNlRGF0ZSArICg1ICogNjApKTtcclxufVxyXG4iLCJjb25zdCBzdGF0aWNzID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuY29uc3QgaW1tdXRhYmxlU3RhdGljcyA9IHtcclxuICAgIGxhbmdzICAgICAgICAgICA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5sYW5ncyksXHJcbiAgICB3b3JsZHMgICAgICAgICAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mud29ybGRzKSxcclxuICAgIG9iamVjdGl2ZV9uYW1lcyA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbmFtZXMpLFxyXG4gICAgb2JqZWN0aXZlX3R5cGVzIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV90eXBlcyksXHJcbiAgICBvYmplY3RpdmVfbWV0YSAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX21ldGEpLFxyXG4gICAgb2JqZWN0aXZlX2xhYmVsczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9sYWJlbHMpLFxyXG4gICAgb2JqZWN0aXZlX21hcCAgIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGltbXV0YWJsZVN0YXRpY3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IF8gICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCBhc3luYyAgPSByZXF1aXJlKCdhc3luYycpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IGJ1ZmZUaW1lICAgICA9IDUgKiA2MCAqIDEwMDA7XHJcbmNvbnN0IGhpZ2hsaXRlVGltZSA9IDEwICogMTAwMDtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKHJlbW90ZU9mZnNldD0wLCBjYj1fLm5vb3ApIHtcclxuICAgIGNvbnN0IHRpbWVMb2NhbCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCB0aW1lUmVtb3RlID0gdGltZUxvY2FsIC0gcmVtb3RlT2Zmc2V0O1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUnLCByZW1vdGVPZmZzZXQsIHRpbWVMb2NhbCwgdGltZVJlbW90ZSk7XHJcblxyXG4gICAgbGV0ICR0aW1lcnMgICAgID0gJCgnLnRpbWVyJyk7XHJcbiAgICBsZXQgJGNvdW50ZG93bnMgPSAkdGltZXJzLmZpbHRlcignLmNvdW50ZG93bicpO1xyXG4gICAgbGV0ICRyZWxhdGl2ZXMgID0gJHRpbWVycy5maWx0ZXIoJy5yZWxhdGl2ZScpO1xyXG5cclxuICAgIGFzeW5jLnBhcmFsbGVsKFtcclxuICAgICAgICB1cGRhdGVSZWxhdGl2ZVRpbWVycy5iaW5kKG51bGwsICRyZWxhdGl2ZXMsIHJlbW90ZU9mZnNldCksXHJcbiAgICAgICAgdXBkYXRlQ291bnRkb3duVGltZXJzLmJpbmQobnVsbCwgJGNvdW50ZG93bnMsIHRpbWVSZW1vdGUpLFxyXG4gICAgXSwgY2IpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbGF0aXZlVGltZXJzKHJlbGF0aXZlcywgb2Zmc2V0LCBjYikge1xyXG4gICAgYXN5bmMuZWFjaChcclxuICAgICAgICByZWxhdGl2ZXMsXHJcbiAgICAgICAgdXBkYXRlUmVsYXRpdmVUaW1lTm9kZS5iaW5kKG51bGwsIG9mZnNldCksXHJcbiAgICAgICAgY2JcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJzKGNvdW50ZG93bnMsIHRpbWVSZW1vdGUsIGNiKSB7XHJcbiAgICBhc3luYy5lYWNoKFxyXG4gICAgICAgIGNvdW50ZG93bnMsXHJcbiAgICAgICAgdXBkYXRlQ291bnRkb3duVGltZXJOb2RlLmJpbmQobnVsbCwgdGltZVJlbW90ZSksXHJcbiAgICAgICAgY2JcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lTm9kZShvZmZzZXQsIGVsLCBuZXh0KSB7XHJcbiAgICBjb25zdCAkZWwgPSAkKGVsKTtcclxuXHJcbiAgICBjb25zdCB0aW1lc3RhbXAgICAgICAgICA9IF8ucGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdGltZXN0YW1wJykpO1xyXG4gICAgY29uc3Qgb2Zmc2V0VGltZXN0YW1wICAgPSAodGltZXN0YW1wICogMTAwMCkgKyBvZmZzZXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXBNb21lbnQgICA9IG1vbWVudChvZmZzZXRUaW1lc3RhbXApO1xyXG4gICAgY29uc3QgdGltZXN0YW1wUmVsYXRpdmUgPSB0aW1lc3RhbXBNb21lbnQudHdpdHRlclNob3J0KCk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2cob2Zmc2V0LCAkZWwsIHRpbWVzdGFtcCwgb2Zmc2V0VGltZXN0YW1wLCB0aW1lc3RhbXBNb21lbnQpO1xyXG5cclxuICAgICRlbC50ZXh0KHRpbWVzdGFtcFJlbGF0aXZlKTtcclxuXHJcbiAgICBuZXh0KCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJOb2RlKHRpbWVSZW1vdGUsIGVsLCBuZXh0KSB7XHJcbiAgICBjb25zdCAkZWwgPSAkKGVsKTtcclxuXHJcbiAgICBjb25zdCB0aW1lc3RhbXAgICA9IF8ucGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdGltZXN0YW1wJykpICogMTAwMDtcclxuICAgIGNvbnN0IGV4cGlyZXMgICAgID0gdGltZXN0YW1wICsgYnVmZlRpbWU7XHJcbiAgICBjb25zdCBtc1JlbWFpbmluZyA9IGV4cGlyZXMgLSB0aW1lUmVtb3RlO1xyXG4gICAgY29uc3QgbXNFbGFwc2VkICAgPSBidWZmVGltZSAtIG1zUmVtYWluaW5nO1xyXG5cclxuXHJcbiAgICBjb25zdCBpc1Zpc2libGUgICAgID0gZXhwaXJlcyArIGhpZ2hsaXRlVGltZSA+PSB0aW1lUmVtb3RlO1xyXG4gICAgY29uc3QgaXNFeHBpcmVkICAgICA9IGV4cGlyZXMgPCB0aW1lUmVtb3RlO1xyXG4gICAgY29uc3QgaXNBY3RpdmUgICAgICA9ICFpc0V4cGlyZWQ7XHJcbiAgICBjb25zdCBpc0hpZ2hsaWdodGVkID0gKG1zUmVtYWluaW5nIDw9IE1hdGguYWJzKGhpZ2hsaXRlVGltZSkpO1xyXG4gICAgY29uc3QgaXNGcmVzaCAgICAgICA9IChtc0VsYXBzZWQgPD0gaGlnaGxpdGVUaW1lKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICBpZiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKGlzQWN0aXZlKSA/IG1vbWVudChtc1JlbWFpbmluZykuZm9ybWF0KCdtOnNzJykgOiAnMDowMCc7XHJcblxyXG4gICAgICAgIGNvbnN0ICRvYmplY3RpdmUgICAgICAgID0gJGVsLmNsb3Nlc3QoJy5vYmplY3RpdmUnKTtcclxuICAgICAgICBjb25zdCBoYXNDbGFzc0hpZ2hsaWdodCA9ICRvYmplY3RpdmUuaGFzQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgIGNvbnN0IGhhc0NsYXNzRnJlc2ggICAgID0gJG9iamVjdGl2ZS5oYXNDbGFzcygnZnJlc2gnKTtcclxuXHJcbiAgICAgICAgaWYgKGlzSGlnaGxpZ2h0ZWQgJiYgIWhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvYmplY3RpdmUuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIWlzSGlnaGxpZ2h0ZWQgJiYgaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuICAgICAgICAgICAgJG9iamVjdGl2ZS5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNGcmVzaCAmJiAhaGFzQ2xhc3NGcmVzaCkge1xyXG4gICAgICAgICAgICAkb2JqZWN0aXZlLmFkZENsYXNzKCdmcmVzaCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIWlzRnJlc2ggJiYgaGFzQ2xhc3NGcmVzaCkge1xyXG4gICAgICAgICAgICAkb2JqZWN0aXZlLnJlbW92ZUNsYXNzKCdmcmVzaCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGVsLnRleHQodGltZXJUZXh0KVxyXG4gICAgICAgICAgICAuZmlsdGVyKCcuaW5hY3RpdmUnKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKVxyXG4gICAgICAgICAgICAuZW5kKCk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkZWwuZmlsdGVyKCcuYWN0aXZlJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdpbmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKVxyXG4gICAgICAgICAgICAuZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHt1cGRhdGV9O1xyXG4iXX0=
