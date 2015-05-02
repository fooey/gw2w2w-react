(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

require("babel/polyfill");

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

    // redirect '/' to '/en'
    page("/", redirectPage.bind(null, "/en"));

    page("/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?", function (ctx) {
        React.render(React.createElement(App, ctx.params), document.getElementById("react-app"));
    });

    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true });
}

var _ref = React.createElement(
    "div",
    { className: "navbar-header" },
    React.createElement(
        "a",
        { className: "navbar-brand", href: "/" },
        React.createElement("img", { src: "/img/logo/logo-96x36.png" })
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
        key: "render",
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
                "div",
                null,
                React.createElement(
                    "nav",
                    { className: "navbar navbar-default" },
                    React.createElement(
                        "div",
                        { className: "container" },
                        navbarHeader,
                        React.createElement(
                            "div",
                            { id: "nav-langs", className: "pull-right" },
                            React.createElement(Langs, { lang: lang, world: world })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { id: "content", className: "container" },
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
        return world.getIn([langSlug, "slug"]) === worldSlug;
    });
}

function eml() {
    var chunks = ["gw2w2w", "schtuph", "com", "@", "."];
    var addr = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join("");

    $(".nospam-prz").each(function (i, el) {
        $(el).replaceWith($("<a>", { href: "mailto:" + addr, text: addr }));
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Overview":111,"./Tracker":136,"./common/Langs":142,"./lib/static":148,"babel/polyfill":89}],2:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":86,"regenerator/runtime":87}],3:[function(require,module,exports){
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
},{"./$":23,"./$.wks":37}],8:[function(require,module,exports){
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
    $.mix(C.prototype, {
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
},{"./$":23,"./$.assert":5,"./$.ctx":12,"./$.for-of":16,"./$.iter":22,"./$.iter-define":20,"./$.uid":35}],9:[function(require,module,exports){
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
    $.mix(C.prototype, {
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
},{"./$":23,"./$.array-methods":4,"./$.assert":5,"./$.for-of":16,"./$.uid":35}],11:[function(require,module,exports){
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
    var method = proto[KEY];
    if($.FW)proto[KEY] = function(a, b){
      var result = method.call(this, a === 0 ? 0 : a, b);
      return CHAIN ? this : result;
    };
  }
  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(NAME, IS_MAP, ADDER);
    $.mix(C.prototype, methods);
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
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.for-of":16,"./$.iter":22,"./$.iter-detect":21,"./$.species":29}],12:[function(require,module,exports){
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
  , isFunction = $.isFunction;
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
    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && $.hide(target, key, out);
    }
    // export
    if(exports[key] != out)$.hide(exports, key, exp);
  }
}
module.exports = $def;
},{"./$":23}],14:[function(require,module,exports){
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
      if(!(key in proto))$.hide(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.iter":22,"./$.wks":37}],21:[function(require,module,exports){
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
},{"./$.wks":37}],22:[function(require,module,exports){
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
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.wks":37}],23:[function(require,module,exports){
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
  mix: function(target, src){
    for(var key in src)hide(target, key, src[key]);
    return target;
  },
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
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function ownKeys(it){
  assertObject(it);
  var keys       = $.getNames(it)
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":23,"./$.assert":5}],26:[function(require,module,exports){
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
},{"./$":23,"./$.assert":5,"./$.invoke":18}],27:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],28:[function(require,module,exports){
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
},{"./$":23,"./$.assert":5,"./$.ctx":12}],29:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":23,"./$.wks":37}],30:[function(require,module,exports){
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
},{"./$":23}],31:[function(require,module,exports){
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
},{"./$":23,"./$.string-repeat":32}],32:[function(require,module,exports){
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
},{"./$":23}],33:[function(require,module,exports){
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
},{"./$":23,"./$.cof":7,"./$.ctx":12,"./$.dom-create":14,"./$.invoke":18}],34:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],35:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":23}],36:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":23,"./$.wks":37}],37:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":23,"./$.uid":35}],38:[function(require,module,exports){
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
  , A                = []
  , slice            = A.slice
  , indexOf          = A.indexOf
  , classof          = cof.classof
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , isFunction       = $.isFunction
  , toObject         = $.toObject
  , toLength         = $.toLength
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
  $.html.appendChild(iframe);
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
      ~indexOf.call(result, key) || result.push(key);
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
      , partArgs = slice.call(arguments, 1);
    function bound(/* args... */){
      var args = partArgs.concat(slice.call(arguments));
      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
    }
    if(fn.prototype)bound.prototype = fn.prototype;
    return bound;
  }
});

// Fix for not array-like ES3 string
function arrayMethodFix(fn){
  return function(){
    return fn.apply($.ES5Object(this), arguments);
  };
}
if(!(0 in Object('z') && 'z'[0] == 'z')){
  $.ES5Object = function(it){
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}
$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  slice: arrayMethodFix(slice),
  join: arrayMethodFix(A.join)
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
  indexOf: indexOf = indexOf || function indexOf(el /*, fromIndex = 0 */){
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
},{"./$":23,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.dom-create":14,"./$.invoke":18,"./$.replacer":27,"./$.throws":34,"./$.uid":35}],39:[function(require,module,exports){
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
},{"./$":23,"./$.def":13,"./$.unscope":36}],40:[function(require,module,exports){
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
},{"./$":23,"./$.def":13,"./$.unscope":36}],41:[function(require,module,exports){
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
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":36}],42:[function(require,module,exports){
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
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":36}],43:[function(require,module,exports){
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
},{"./$":23,"./$.ctx":12,"./$.def":13,"./$.iter":22,"./$.iter-call":19,"./$.iter-detect":21}],44:[function(require,module,exports){
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
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.uid":35,"./$.unscope":36}],45:[function(require,module,exports){
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
},{"./$.def":13}],46:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":29}],47:[function(require,module,exports){
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
},{"./$":23,"./$.wks":37}],48:[function(require,module,exports){
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
},{"./$":23}],49:[function(require,module,exports){
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
},{"./$.collection":11,"./$.collection-strong":8}],50:[function(require,module,exports){
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
      , larg = -Infinity
      , arg;
    while(len1--){
      arg = args[len1] = +arguments[len1];
      if(arg == Infinity || arg == -Infinity)return Infinity;
      if(arg > larg)larg = arg;
    }
    larg = arg || 1;
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
},{"./$.def":13}],51:[function(require,module,exports){
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
  $.hide($.g, NUMBER, $Number);
}
},{"./$":23}],52:[function(require,module,exports){
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
},{"./$":23,"./$.def":13}],53:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":13}],54:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: function is(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
});
},{"./$.def":13}],55:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":13,"./$.set-proto":28}],56:[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
function wrapObjectMethod(METHOD, MODE){
  var fn  = ($.core.Object || {})[METHOD] || Object[METHOD]
    , f   = 0
    , o   = {};
  o[METHOD] = MODE == 1 ? function(it){
    return isObject(it) ? fn(it) : it;
  } : MODE == 2 ? function(it){
    return isObject(it) ? fn(it) : true;
  } : MODE == 3 ? function(it){
    return isObject(it) ? fn(it) : false;
  } : MODE == 4 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : MODE == 5 ? function getPrototypeOf(it){
    return fn(Object($.assertDefined(it)));
  } : function(it){
    return fn(toObject(it));
  };
  try {
    fn('z');
  } catch(e){
    f = 1;
  }
  $def($def.S + $def.F * f, 'Object', o);
}
wrapObjectMethod('freeze', 1);
wrapObjectMethod('seal', 1);
wrapObjectMethod('preventExtensions', 1);
wrapObjectMethod('isFrozen', 2);
wrapObjectMethod('isSealed', 2);
wrapObjectMethod('isExtensible', 3);
wrapObjectMethod('getOwnPropertyDescriptor', 4);
wrapObjectMethod('getPrototypeOf', 5);
wrapObjectMethod('keys');
wrapObjectMethod('getOwnPropertyNames');
},{"./$":23,"./$.def":13}],57:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var $   = require('./$')
  , cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function toString(){
  return '[object ' + cof.classof(this) + ']';
});
},{"./$":23,"./$.cof":7,"./$.wks":37}],58:[function(require,module,exports){
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
  $.mix(P.prototype, {
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
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter-detect":21,"./$.set-proto":28,"./$.species":29,"./$.task":33,"./$.uid":35,"./$.wks":37}],59:[function(require,module,exports){
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
},{"./$":23,"./$.assert":5,"./$.def":13,"./$.iter":22,"./$.own-keys":25,"./$.set-proto":28,"./$.uid":35,"./$.wks":37}],60:[function(require,module,exports){
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
    $.hide($.g, 'RegExp', $RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')($RegExp);
},{"./$":23,"./$.cof":7,"./$.replacer":27,"./$.species":29}],61:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":11,"./$.collection-strong":8}],62:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":30}],63:[function(require,module,exports){
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
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.throws":34}],64:[function(require,module,exports){
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
},{"./$":23,"./$.def":13}],65:[function(require,module,exports){
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
},{"./$":23,"./$.cof":7,"./$.def":13}],66:[function(require,module,exports){
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
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.string-at":30,"./$.uid":35}],67:[function(require,module,exports){
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
},{"./$":23,"./$.def":13}],68:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":13,"./$.string-repeat":32}],69:[function(require,module,exports){
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
},{"./$":23,"./$.cof":7,"./$.def":13,"./$.throws":34}],70:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
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
      D.enumerable = false;
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
  $Symbol = function Symbol(description){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(description));
  };
  $.hide($Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;
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
},{"./$":23,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.enum-keys":15,"./$.keyof":24,"./$.uid":35,"./$.wks":37}],71:[function(require,module,exports){
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
    WeakMap.prototype[key] = function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && isFrozen(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    };
  });
}
},{"./$":23,"./$.collection":11,"./$.collection-weak":10}],72:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":11,"./$.collection-weak":10}],73:[function(require,module,exports){
// https://github.com/domenic/Array.prototype.includes
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":13,"./$.unscope":36}],74:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":9}],75:[function(require,module,exports){
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
},{"./$":23,"./$.def":13,"./$.own-keys":25}],76:[function(require,module,exports){
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
},{"./$":23,"./$.def":13}],77:[function(require,module,exports){
// https://gist.github.com/kangax/9698100
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
});
},{"./$.def":13,"./$.replacer":27}],78:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":9}],79:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":30}],80:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  lpad: function lpad(n){
    return $pad(this, n, arguments[1], true);
  }
});
},{"./$.def":13,"./$.string-pad":31}],81:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  rpad: function rpad(n){
    return $pad(this, n, arguments[1], false);
  }
});
},{"./$.def":13,"./$.string-pad":31}],82:[function(require,module,exports){
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
},{"./$":23,"./$.ctx":12,"./$.def":13}],83:[function(require,module,exports){
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
},{"./$":23,"./$.iter":22,"./$.wks":37,"./es6.array.iterator":44}],84:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":13,"./$.task":33}],85:[function(require,module,exports){
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
},{"./$":23,"./$.def":13,"./$.invoke":18,"./$.partial":26}],86:[function(require,module,exports){
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

},{"./modules/$":23,"./modules/es5":38,"./modules/es6.array.copy-within":39,"./modules/es6.array.fill":40,"./modules/es6.array.find":42,"./modules/es6.array.find-index":41,"./modules/es6.array.from":43,"./modules/es6.array.iterator":44,"./modules/es6.array.of":45,"./modules/es6.array.species":46,"./modules/es6.function.has-instance":47,"./modules/es6.function.name":48,"./modules/es6.map":49,"./modules/es6.math":50,"./modules/es6.number.constructor":51,"./modules/es6.number.statics":52,"./modules/es6.object.assign":53,"./modules/es6.object.is":54,"./modules/es6.object.set-prototype-of":55,"./modules/es6.object.statics-accept-primitives":56,"./modules/es6.object.to-string":57,"./modules/es6.promise":58,"./modules/es6.reflect":59,"./modules/es6.regexp":60,"./modules/es6.set":61,"./modules/es6.string.code-point-at":62,"./modules/es6.string.ends-with":63,"./modules/es6.string.from-code-point":64,"./modules/es6.string.includes":65,"./modules/es6.string.iterator":66,"./modules/es6.string.raw":67,"./modules/es6.string.repeat":68,"./modules/es6.string.starts-with":69,"./modules/es6.symbol":70,"./modules/es6.weak-map":71,"./modules/es6.weak-set":72,"./modules/es7.array.includes":73,"./modules/es7.map.to-json":74,"./modules/es7.object.get-own-property-descriptors":75,"./modules/es7.object.to-array":76,"./modules/es7.regexp.escape":77,"./modules/es7.set.to-json":78,"./modules/es7.string.at":79,"./modules/es7.string.lpad":80,"./modules/es7.string.rpad":81,"./modules/js.array.statics":82,"./modules/web.dom.iterable":83,"./modules/web.immediate":84,"./modules/web.timers":85}],87:[function(require,module,exports){
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

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          return this.complete(entry.completion, entry.afterLoc);
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

},{}],88:[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":2}],89:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":88}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":90,"./encode":91}],93:[function(require,module,exports){
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


},{"querystring":92,"superagent":94}],94:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
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
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
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
  this.noContent = 204 == status || 1223 == status;
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
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = function(e){
        e.percent = e.loaded / e.total * 100;
        self.emit('progress', e);
      };
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

},{"emitter":95,"reduce":96}],95:[function(require,module,exports){

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

},{}],96:[function(require,module,exports){

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
},{}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":97,"./data/objective_labels":98,"./data/objective_map":99,"./data/objective_meta":100,"./data/objective_names":101,"./data/objective_types":102,"./data/world_names":103}],105:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./MatchWorld":106}],106:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../../common/Icons/Pie":139,"./Score":107}],107:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
                $diffNode: $(this.refs.diff.getDOMNode())
            });
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

},{}],108:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./Match":105}],109:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],110:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./World":109}],111:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
                '1': { label: 'NA', id: '1' },
                '2': { label: 'EU', id: '2' }
            }),
            matchesByRegion: Immutable.fromJS({ '1': {}, '2': {} }),
            worldsByRegion: this.dao.getWorldsByRegion(props.lang) //Immutable.fromJS({'1': {}, '2': {}})
        };
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
                React.createElement('hr', null),
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
                    matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion)
                };
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/data/overview":144,"./Matches":108,"./Worlds":110}],112:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"../Objectives":131}],113:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
                            React.createElement('br', null),
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

},{"./../../common/Icons/Emblem":138,"./Claims":112}],114:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
                React.createElement(
                    'h2',
                    { className: 'section-header' },
                    'Guild Claims'
                ),
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

},{"./Guild":113}],115:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
* Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);
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

},{"../Objectives":131,"gw2w2w-static":104}],116:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],117:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
    eventHistory: React.PropTypes.instanceOf(Immutable.Map).isRequired,

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

},{"./Entry":115}],118:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"gw2w2w-static":104}],119:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./EventFilters":116,"./LogEntries":117,"./MapFilters":118}],120:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

},{"./../../lib/static":148,"./MapScores":121,"./MapSection":122}],121:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],122:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../Objectives":131}],123:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

},{"./../Log":119,"./MapDetails":120}],124:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
            var newShow = !Immutable.is(this.props.showName, nextProps.showName) || !Immutable.is(this.props.showTag, nextProps.showTag);
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

},{"./../../common/Icons/Emblem":138}],125:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../../common/Icons/Arrow":137,"./../../common/Icons/Sprite":140,"./../../lib/static":148}],126:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../../lib/static":148}],127:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

                if (typeof _ret === 'object') {
                    return _ret.v;
                }
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

},{"./../../lib/static":148}],128:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],129:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],130:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],131:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../../lib/static":148,"./Guild":124,"./Icons":125,"./Label":126,"./MapName":127,"./TimerCountdown":128,"./TimerRelative":129,"./Timestamp":130}],132:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
            oType: STATIC.objective_types.get(props.typeId)
        };
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

},{"./../../../common/Icons/Sprite":140,"./../../../lib/static":148}],133:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./Item":132}],134:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./Holdings":133}],135:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./World":134}],136:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

var api = require('./../lib/api');
var libDate = require('./../lib/date');
var trackerTimers = require('./../lib/trackerTimers');

/*
*   Data
*/

var DAO = require('./../lib/data/tracker');
var GuildsLib = require('./../lib/data/tracker/guilds');
var STATIC = require('./../lib/static');

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
                matchWorlds: this.dao.getMatchWorlds(nextProps.lang, this.state.match)
            });
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
                            matchWorlds: _this.dao.getMatchWorlds(_this.props.lang, _this.state.match)
                        });
                        // setImmediate(setMatchWorlds.bind(component, props.lang));
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
                    guilds: state.guilds.mergeIn([_guildId], guild)
                };
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

},{"./../lib/api":143,"./../lib/data/tracker":146,"./../lib/data/tracker/guilds":145,"./../lib/date":147,"./../lib/static":148,"./../lib/trackerTimers":149,"./Guilds":114,"./Maps":123,"./Scoreboard":135}],137:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],138:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],139:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],140:[function(require,module,exports){
(function (global){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
            var newType = this.props.type !== nextProps.type;
            var newColor = this.props.color !== nextProps.color;
            var shouldUpdate = newType || newColor;

            return shouldUpdate;
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement("span", { className: "sprite " + this.props.type + " " + this.props.color });
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

},{}],141:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{}],142:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

},{"./../../lib/static":148,"./LangLink":141}],143:[function(require,module,exports){
"use strict";

var gw2api = require("gw2api");

module.exports = {
    getGuildDetails: getGuildDetails,
    getMatches: getMatches,
    getMatchDetailsByWorld: getMatchDetailsByWorld };

function getMatches(callback) {
    gw2api.getMatchesState(callback);
}

function getGuildDetails(guildId, callback) {
    gw2api.getGuildDetails({
        guild_id: guildId
    }, callback);
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
        world_slug: worldSlug
    }, callback);
}

// getMatchDetails    : getMatchDetails,

},{"gw2api":93}],144:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
        link: link, region: region
    });
}

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}

function getInterval() {
    return _.random(2000, 4000);
}

module.exports = OverviewDataProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api":143,"./../static":148}],145:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
            })
            // .sortBy(entry => -entry.get('timestamp'));
            ;
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
                    listener: listener
                });
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

},{"./../../api":143}],146:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
            var refreshTime = _.random(1000 * 2, 1000 * 4);

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

},{"./../../api":143,"./../../static":148,"./guilds":145}],147:[function(require,module,exports){
(function (global){
"use strict";

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

module.exports = {
    dateNow: dateNow,
    add5: add5 };

function dateNow() {
    return Math.floor(_.now() / 1000);
}

function add5(inDate) {
    var _baseDate = inDate || dateNow();

    return _baseDate + 5 * 60;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],148:[function(require,module,exports){
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

},{"gw2w2w-static":104}],149:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

var buffTime = 5 * 60 * 1000;
var highliteTime = 10 * 1000;

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

module.exports = {
    update: update
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24tdG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jdHguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pbnZva2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQua2V5b2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm93bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5wYXJ0aWFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1wYWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRhc2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRocm93cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC53a3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLmhhcy1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucnBhZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmltbWVkaWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21ldGEuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2hXb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvU2NvcmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9DbGFpbXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRW50cnkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FdmVudEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9Mb2dFbnRyaWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTWFwRmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcERldGFpbHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2NvcmVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNlY3Rpb24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvSWNvbnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTGFiZWwuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTWFwTmFtZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lckNvdW50ZG93bi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lclJlbGF0aXZlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVzdGFtcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9JdGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9BcnJvdy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9FbWJsZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvUGllLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1Nwcml0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9MYW5nTGluay5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0YS9vdmVydmlldy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRhL3RyYWNrZXIvZ3VpbGRzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2RhdGEvdHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3N0YXRpYy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi90cmFja2VyVGltZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLFlBQVksQ0FBQzs7Ozs7Ozs7QUFDYixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRMUIsSUFBTSxLQUFLLEdBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN2QyxJQUFNLElBQUksR0FBUSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxDLElBQU0sTUFBTSxHQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7Ozs7O0FBUXhDLElBQU0sS0FBSyxHQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFNLFFBQVEsR0FBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEMsSUFBTSxPQUFPLEdBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7Ozs7OztBQVlyQyxDQUFDLENBQUMsWUFBVztBQUNULGdCQUFZLEVBQUUsQ0FBQztBQUNmLGdCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDckIsQ0FBQyxDQUFDOzs7Ozs7OztBQVVILFNBQVMsWUFBWSxHQUFHOzs7QUFHcEIsUUFBSSxDQUFDLEdBQUcsRUFBRSxZ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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BqQkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LFdBQVcsQ0FBQyxDQUFDO1NBQ3ZDOztBQUVELFlBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQzNCLHNCQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDLE1BQU0sSUFBSSxDQUFDLE9BQU8sSUFBSSxhQUFhLEVBQUU7QUFDbEMsc0JBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7O0FBRUQsV0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDZCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQ25CLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FDbEIsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUN2QixHQUFHLEVBQUUsQ0FBQztLQUVkLE1BQU07QUFDSCxXQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUNoQixRQUFRLENBQUMsVUFBVSxDQUFDLENBQ3BCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FDckIsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUN4QixHQUFHLEVBQUUsQ0FBQztLQUNkOztBQUVELFFBQUksRUFBRSxDQUFDO0NBQ1Y7O0FBS0QsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNiLFVBQU0sRUFBTixNQUFNO0NBQ1QsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxucmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgcGFnZSAgICAgID0gcmVxdWlyZSgncGFnZScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IExhbmdzICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9MYW5ncycpO1xyXG5jb25zdCBPdmVydmlldyAgPSByZXF1aXJlKCdPdmVydmlldycpO1xyXG5jb25zdCBUcmFja2VyICAgPSByZXF1aXJlKCdUcmFja2VyJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIERPTSBSZWFkeVxyXG4qXHJcbiovXHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICAgYXR0YWNoUm91dGVzKCk7XHJcbiAgICBzZXRJbW1lZGlhdGUoZW1sKTtcclxufSk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBSb3V0ZXNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYXR0YWNoUm91dGVzKCkge1xyXG5cclxuICAgIC8vIHJlZGlyZWN0ICcvJyB0byAnL2VuJ1xyXG4gICAgcGFnZSgnLycsIHJlZGlyZWN0UGFnZS5iaW5kKG51bGwsICcvZW4nKSk7XHJcblxyXG5cclxuICAgIHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgUmVhY3QucmVuZGVyKDxBcHAgey4uLmN0eC5wYXJhbXN9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYXBwJykpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHBhZ2Uuc3RhcnQoe1xyXG4gICAgICAgIGNsaWNrICAgOiB0cnVlLFxyXG4gICAgICAgIHBvcHN0YXRlOiB0cnVlLFxyXG4gICAgICAgIGRpc3BhdGNoOiB0cnVlLFxyXG4gICAgICAgIGhhc2hiYW5nOiBmYWxzZSxcclxuICAgICAgICBkZWNvZGVVUkxDb21wb25lbnRzIDogdHJ1ZSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEFwcCBDb250YWluZXJcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBsYW5nU2x1ZyAgPSB0aGlzLnByb3BzLmxhbmdTbHVnO1xyXG4gICAgICAgIGNvbnN0IHdvcmxkU2x1ZyA9IHRoaXMucHJvcHMud29ybGRTbHVnO1xyXG5cclxuICAgICAgICBjb25zdCBsYW5nICAgICAgPSBTVEFUSUMubGFuZ3MuZ2V0KGxhbmdTbHVnKTtcclxuICAgICAgICBjb25zdCB3b3JsZCAgICAgPSBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuICAgICAgICBjb25zdCBoYXNXb3JsZCAgPSB3b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkKSAmJiAhd29ybGQuaXNFbXB0eSgpO1xyXG5cclxuICAgICAgICBjb25zdCBIYW5kbGVyICAgPSAoaGFzV29ybGQpID8gVHJhY2tlciA6IE92ZXJ2aWV3O1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnTGFuZ3M6OnJlbmRlcigpJywgdGhpcy5wcm9wcy5sYW5nLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hdmJhckhlYWRlciA9IDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvaW1nL2xvZ28vbG9nby05NngzNi5wbmdcIiAvPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+O1xyXG5cclxuICAgICAgICByZXR1cm4gPGRpdj5cclxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge25hdmJhckhlYWRlcn1cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibmF2LWxhbmdzXCIgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgbGFuZz17bGFuZ30gd29ybGQ9e3dvcmxkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNvbnRlbnRcIiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxIYW5kbGVyIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBVdGlsXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHJlZGlyZWN0UGFnZShkZXN0aW5hdGlvbikge1xyXG4gICAgcGFnZS5yZWRpcmVjdChkZXN0aW5hdGlvbik7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcbiAgICByZXR1cm4gU1RBVElDLndvcmxkc1xyXG4gICAgICAgIC5maW5kKHdvcmxkID0+IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSkgPT09IHdvcmxkU2x1Zyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZW1sKCkge1xyXG4gICAgY29uc3QgY2h1bmtzID0gWydndzJ3MncnLCAnc2NodHVwaCcsICdjb20nLCAnQCcsICcuJ107XHJcbiAgICBjb25zdCBhZGRyICAgPSBbY2h1bmtzWzBdLCBjaHVua3NbM10sIGNodW5rc1sxXSwgY2h1bmtzWzRdLCBjaHVua3NbMl1dLmpvaW4oJycpO1xyXG5cclxuICAgICQoJy5ub3NwYW0tcHJ6JykuZWFjaCgoaSwgZWwpID0+IHtcclxuICAgICAgICAkKGVsKS5yZXBsYWNlV2l0aChcclxuICAgICAgICAgICAgJCgnPGE+Jywge2hyZWY6IGBtYWlsdG86JHthZGRyfWAsIHRleHQ6IGFkZHJ9KVxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcImNvcmUtanMvc2hpbVwiKTtcblxucmVxdWlyZShcInJlZ2VuZXJhdG9yL3J1bnRpbWVcIik7XG5cbmlmIChnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwib25seSBvbmUgaW5zdGFuY2Ugb2YgYmFiZWwvcG9seWZpbGwgaXMgYWxsb3dlZFwiKTtcbn1cbmdsb2JhbC5fYmFiZWxQb2x5ZmlsbCA9IHRydWU7IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxyXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcclxuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xyXG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3QoJHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAkLnRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXHJcbiAgICAgICwgdmFsdWU7XHJcbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XHJcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcclxuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcclxuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleDtcclxuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcclxuICB9O1xyXG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxyXG4vLyAxIC0+IEFycmF5I21hcFxyXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxyXG4vLyAzIC0+IEFycmF5I3NvbWVcclxuLy8gNCAtPiBBcnJheSNldmVyeVxyXG4vLyA1IC0+IEFycmF5I2ZpbmRcclxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcclxudmFyICQgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggPSByZXF1aXJlKCcuLyQuY3R4Jyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSl7XHJcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcclxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXHJcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcclxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxyXG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKCR0aGlzKSlcclxuICAgICAgLCBzZWxmICAgPSAkLkVTNU9iamVjdChPKVxyXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxyXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoc2VsZi5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IEFycmF5KGxlbmd0aCkgOiBJU19GSUxURVIgPyBbXSA6IHVuZGVmaW5lZFxyXG4gICAgICAsIHZhbCwgcmVzO1xyXG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcclxuICAgICAgdmFsID0gc2VsZltpbmRleF07XHJcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XHJcbiAgICAgIGlmKFRZUEUpe1xyXG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcclxuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXHJcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxyXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxyXG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XHJcbiAgfTtcclxufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcclxuICBpZighY29uZGl0aW9uKXRocm93IFR5cGVFcnJvcihtc2cyID8gbXNnMSArIG1zZzIgOiBtc2cxKTtcclxufVxyXG5hc3NlcnQuZGVmID0gJC5hc3NlcnREZWZpbmVkO1xyXG5hc3NlcnQuZm4gPSBmdW5jdGlvbihpdCl7XHJcbiAgaWYoISQuaXNGdW5jdGlvbihpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbmFzc2VydC5vYmogPSBmdW5jdGlvbihpdCl7XHJcbiAgaWYoISQuaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbmFzc2VydC5pbnN0ID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcclxuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKXRocm93IFR5cGVFcnJvcihuYW1lICsgXCI6IHVzZSB0aGUgJ25ldycgb3BlcmF0b3IhXCIpO1xyXG4gIHJldHVybiBpdDtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpO1xyXG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2Upe1xyXG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXHJcbiAgdmFyIFQgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRhcmdldCkpXHJcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGkgPSAxO1xyXG4gIHdoaWxlKGwgPiBpKXtcclxuICAgIHZhciBTICAgICAgPSAkLkVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcclxuICAgICAgLCBrZXlzICAgPSBlbnVtS2V5cyhTKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaiAgICAgID0gMFxyXG4gICAgICAsIGtleTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGopVFtrZXkgPSBrZXlzW2orK11dID0gU1trZXldO1xyXG4gIH1cclxuICByZXR1cm4gVDtcclxufTsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgVEFHICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcclxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XHJcbmZ1bmN0aW9uIGNvZihpdCl7XHJcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcclxufVxyXG5jb2YuY2xhc3NvZiA9IGZ1bmN0aW9uKGl0KXtcclxuICB2YXIgTywgVDtcclxuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXHJcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUIDogY29mKE8pO1xyXG59O1xyXG5jb2Yuc2V0ID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XHJcbiAgaWYoaXQgJiYgISQuaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSQuaGlkZShpdCwgVEFHLCB0YWcpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvZjsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgc2FmZSAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxyXG4gICwgYXNzZXJ0ICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcclxuICAsIGZvck9mICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXHJcbiAgLCBzdGVwICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuc3RlcFxyXG4gICwgaGFzICAgICAgPSAkLmhhc1xyXG4gICwgc2V0ICAgICAgPSAkLnNldFxyXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XHJcbiAgLCBoaWRlICAgICA9ICQuaGlkZVxyXG4gICwgaXNGcm96ZW4gPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxyXG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXHJcbiAgLCBPMSAgICAgICA9IHNhZmUoJ08xJylcclxuICAsIExBU1QgICAgID0gc2FmZSgnbGFzdCcpXHJcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcclxuICAsIElURVIgICAgID0gc2FmZSgnaXRlcicpXHJcbiAgLCBTSVpFICAgICA9ICQuREVTQyA/IHNhZmUoJ3NpemUnKSA6ICdzaXplJ1xyXG4gICwgaWQgICAgICAgPSAwO1xyXG5cclxuZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcclxuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XHJcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcclxuICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxyXG4gIGlmKGlzRnJvemVuKGl0KSlyZXR1cm4gJ0YnO1xyXG4gIGlmKCFoYXMoaXQsIElEKSl7XHJcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxyXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xyXG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXHJcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XHJcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxyXG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RW50cnkodGhhdCwga2V5KXtcclxuICAvLyBmYXN0IGNhc2VcclxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xyXG4gIGlmKGluZGV4ICE9ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xyXG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxyXG4gIGZvcihlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbihOQU1FLCBJU19NQVAsIEFEREVSKXtcclxuICAgIGZ1bmN0aW9uIEMoKXtcclxuICAgICAgdmFyIHRoYXQgICAgID0gYXNzZXJ0Lmluc3QodGhpcywgQywgTkFNRSlcclxuICAgICAgICAsIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICBzZXQodGhhdCwgTzEsICQuY3JlYXRlKG51bGwpKTtcclxuICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xyXG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgc2V0KHRoYXQsIEZJUlNULCB1bmRlZmluZWQpO1xyXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgfVxyXG4gICAgJC5taXgoQy5wcm90b3R5cGUsIHtcclxuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcclxuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdFtGSVJTVF0gPSB0aGF0W0xBU1RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcclxuICAgICAgICBpZihlbnRyeSl7XHJcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cclxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcclxuICAgICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcclxuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xyXG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xyXG4gICAgICAgICAgaWYodGhhdFtGSVJTVF0gPT0gZW50cnkpdGhhdFtGSVJTVF0gPSBuZXh0O1xyXG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcclxuICAgICAgICAgIHRoYXRbU0laRV0tLTtcclxuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAgICAgLCBlbnRyeTtcclxuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcclxuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XHJcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcclxuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGFzc2VydC5kZWYodGhpc1tTSVpFXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxyXG4gICAgICAsIHByZXYsIGluZGV4O1xyXG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XHJcbiAgICBpZihlbnRyeSl7XHJcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcclxuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcclxuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcclxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XHJcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcclxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxyXG4gICAgICB9O1xyXG4gICAgICBpZighdGhhdFtGSVJTVF0pdGhhdFtGSVJTVF0gPSBlbnRyeTtcclxuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcclxuICAgICAgdGhhdFtTSVpFXSsrO1xyXG4gICAgICAvLyBhZGQgdG8gaW5kZXhcclxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcclxuICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cclxuICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXHJcbiAgc2V0SXRlcjogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcclxuICAgIHJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazoga2luZH0pO1xyXG4gICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xyXG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XHJcbiAgICAgIGlmKCFpdGVyLm8gfHwgIShpdGVyLmwgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IGl0ZXIub1tGSVJTVF0pKXtcclxuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxyXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gc3RlcCgxKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXHJcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XHJcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XHJcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XHJcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xyXG4gIH1cclxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXHJcbnZhciAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XHJcbiAgJGRlZigkZGVmLlAsIE5BTUUsIHtcclxuICAgIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCl7XHJcbiAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgZm9yT2YodGhpcywgZmFsc2UsIGFyci5wdXNoLCBhcnIpO1xyXG4gICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBzYWZlICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxyXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBmb3JPZiAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcclxuICAsIF9oYXMgICAgICA9ICQuaGFzXHJcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XHJcbiAgLCBoaWRlICAgICAgPSAkLmhpZGVcclxuICAsIGlzRnJvemVuICA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXHJcbiAgLCBpZCAgICAgICAgPSAwXHJcbiAgLCBJRCAgICAgICAgPSBzYWZlKCdpZCcpXHJcbiAgLCBXRUFLICAgICAgPSBzYWZlKCd3ZWFrJylcclxuICAsIExFQUsgICAgICA9IHNhZmUoJ2xlYWsnKVxyXG4gICwgbWV0aG9kICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxyXG4gICwgZmluZCAgICAgID0gbWV0aG9kKDUpXHJcbiAgLCBmaW5kSW5kZXggPSBtZXRob2QoNik7XHJcbmZ1bmN0aW9uIGZpbmRGcm96ZW4oc3RvcmUsIGtleSl7XHJcbiAgcmV0dXJuIGZpbmQoc3RvcmUuYXJyYXksIGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xyXG4gIH0pO1xyXG59XHJcbi8vIGZhbGxiYWNrIGZvciBmcm96ZW4ga2V5c1xyXG5mdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XHJcbiAgcmV0dXJuIHRoYXRbTEVBS10gfHwgaGlkZSh0aGF0LCBMRUFLLCB7XHJcbiAgICBhcnJheTogW10sXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgICAgaWYoZW50cnkpcmV0dXJuIGVudHJ5WzFdO1xyXG4gICAgfSxcclxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgcmV0dXJuICEhZmluZEZyb3plbih0aGlzLCBrZXkpO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcclxuICAgICAgZWxzZSB0aGlzLmFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcclxuICAgIH0sXHJcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHRoaXMuYXJyYXksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmKH5pbmRleCl0aGlzLmFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIHJldHVybiAhIX5pbmRleDtcclxuICAgIH1cclxuICB9KVtMRUFLXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKE5BTUUsIElTX01BUCwgQURERVIpe1xyXG4gICAgZnVuY3Rpb24gQygpe1xyXG4gICAgICAkLnNldChhc3NlcnQuaW5zdCh0aGlzLCBDLCBOQU1FKSwgSUQsIGlkKyspO1xyXG4gICAgICB2YXIgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGlzW0FEREVSXSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwge1xyXG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XHJcbiAgICAgICAgcmV0dXJuIF9oYXMoa2V5LCBXRUFLKSAmJiBfaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tJRF1dO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XHJcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcclxuICAgICAgICByZXR1cm4gX2hhcyhrZXksIFdFQUspICYmIF9oYXMoa2V5W1dFQUtdLCB0aGlzW0lEXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgaWYoaXNGcm96ZW4oYXNzZXJ0Lm9iaihrZXkpKSl7XHJcbiAgICAgIGxlYWtTdG9yZSh0aGF0KS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfaGFzKGtleSwgV0VBSykgfHwgaGlkZShrZXksIFdFQUssIHt9KTtcclxuICAgICAga2V5W1dFQUtdW3RoYXRbSURdXSA9IHZhbHVlO1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGxlYWtTdG9yZTogbGVha1N0b3JlLFxyXG4gIFdFQUs6IFdFQUssXHJcbiAgSUQ6IElEXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIEJVR0dZID0gcmVxdWlyZSgnLi8kLml0ZXInKS5CVUdHWVxyXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcclxuICAsIHNwZWNpZXMgPSByZXF1aXJlKCcuLyQuc3BlY2llcycpXHJcbiAgLCBhc3NlcnRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5pbnN0O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XHJcbiAgdmFyIEJhc2UgID0gJC5nW05BTUVdXHJcbiAgICAsIEMgICAgID0gQmFzZVxyXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcclxuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXHJcbiAgICAsIE8gICAgID0ge307XHJcbiAgZnVuY3Rpb24gZml4TWV0aG9kKEtFWSwgQ0hBSU4pe1xyXG4gICAgdmFyIG1ldGhvZCA9IHByb3RvW0tFWV07XHJcbiAgICBpZigkLkZXKXByb3RvW0tFWV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgdmFyIHJlc3VsdCA9IG1ldGhvZC5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7XHJcbiAgICAgIHJldHVybiBDSEFJTiA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gIH1cclxuICBpZighJC5pc0Z1bmN0aW9uKEMpIHx8ICEoSVNfV0VBSyB8fCAhQlVHR1kgJiYgcHJvdG8uZm9yRWFjaCAmJiBwcm90by5lbnRyaWVzKSl7XHJcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxyXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3RvcihOQU1FLCBJU19NQVAsIEFEREVSKTtcclxuICAgICQubWl4KEMucHJvdG90eXBlLCBtZXRob2RzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIGluc3QgID0gbmV3IENcclxuICAgICAgLCBjaGFpbiA9IGluc3RbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKVxyXG4gICAgICAsIGJ1Z2d5WmVybztcclxuICAgIC8vIHdyYXAgZm9yIGluaXQgY29sbGVjdGlvbnMgZnJvbSBpdGVyYWJsZVxyXG4gICAgaWYoIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBuZXcgQyhpdGVyKTsgfSkpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG4gICAgICBDID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICB2YXIgdGhhdCAgICAgPSBuZXcgQmFzZVxyXG4gICAgICAgICAgLCBpdGVyYWJsZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgICB9O1xyXG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xyXG4gICAgICBpZigkLkZXKXByb3RvLmNvbnN0cnVjdG9yID0gQztcclxuICAgIH1cclxuICAgIElTX1dFQUsgfHwgaW5zdC5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwga2V5KXtcclxuICAgICAgYnVnZ3laZXJvID0gMSAvIGtleSA9PT0gLUluZmluaXR5O1xyXG4gICAgfSk7XHJcbiAgICAvLyBmaXggY29udmVydGluZyAtMCBrZXkgdG8gKzBcclxuICAgIGlmKGJ1Z2d5WmVybyl7XHJcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XHJcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XHJcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xyXG4gICAgfVxyXG4gICAgLy8gKyBmaXggLmFkZCAmIC5zZXQgZm9yIGNoYWluaW5nXHJcbiAgICBpZihidWdneVplcm8gfHwgY2hhaW4gIT09IGluc3QpZml4TWV0aG9kKEFEREVSLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHJlcXVpcmUoJy4vJC5jb2YnKS5zZXQoQywgTkFNRSk7XHJcblxyXG4gIE9bTkFNRV0gPSBDO1xyXG4gICRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GICogKEMgIT0gQmFzZSksIE8pO1xyXG4gIHNwZWNpZXMoQyk7XHJcbiAgc3BlY2llcygkLmNvcmVbTkFNRV0pOyAvLyBmb3Igd3JhcHBlclxyXG5cclxuICBpZighSVNfV0VBSyljb21tb24uc2V0SXRlcihDLCBOQU1FLCBJU19NQVApO1xyXG5cclxuICByZXR1cm4gQztcclxufTsiLCIvLyBPcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcclxudmFyIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xyXG4gIGFzc2VydEZ1bmN0aW9uKGZuKTtcclxuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XHJcbiAgc3dpdGNoKGxlbmd0aCl7XHJcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XHJcbiAgICB9O1xyXG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xyXG4gICAgfTtcclxuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcclxuICAgIH07XHJcbiAgfSByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBnbG9iYWwgICAgID0gJC5nXHJcbiAgLCBjb3JlICAgICAgID0gJC5jb3JlXHJcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uO1xyXG5mdW5jdGlvbiBjdHgoZm4sIHRoYXQpe1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgfTtcclxufVxyXG5nbG9iYWwuY29yZSA9IGNvcmU7XHJcbi8vIHR5cGUgYml0bWFwXHJcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcclxuJGRlZi5HID0gMjsgIC8vIGdsb2JhbFxyXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXHJcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xyXG4kZGVmLkIgPSAxNjsgLy8gYmluZFxyXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxyXG5mdW5jdGlvbiAkZGVmKHR5cGUsIG5hbWUsIHNvdXJjZSl7XHJcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxyXG4gICAgLCBpc0dsb2JhbCA9IHR5cGUgJiAkZGVmLkdcclxuICAgICwgdGFyZ2V0ICAgPSBpc0dsb2JhbCA/IGdsb2JhbCA6IHR5cGUgJiAkZGVmLlNcclxuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pLnByb3RvdHlwZVxyXG4gICAgLCBleHBvcnRzICA9IGlzR2xvYmFsID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XHJcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcclxuICBmb3Ioa2V5IGluIHNvdXJjZSl7XHJcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcclxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XHJcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxyXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcclxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XHJcbiAgICBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xyXG4gICAgZWxzZSBleHAgPSB0eXBlICYgJGRlZi5QICYmIGlzRnVuY3Rpb24ob3V0KSA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xyXG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxyXG4gICAgaWYodGFyZ2V0ICYmICFvd24pe1xyXG4gICAgICBpZihpc0dsb2JhbCl0YXJnZXRba2V5XSA9IG91dDtcclxuICAgICAgZWxzZSBkZWxldGUgdGFyZ2V0W2tleV0gJiYgJC5oaWRlKHRhcmdldCwga2V5LCBvdXQpO1xyXG4gICAgfVxyXG4gICAgLy8gZXhwb3J0XHJcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KSQuaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gJGRlZjsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgZG9jdW1lbnQgPSAkLmcuZG9jdW1lbnRcclxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxyXG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xyXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XHJcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XHJcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXHJcbiAgICAsIGdldERlc2MgICAgPSAkLmdldERlc2NcclxuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcclxuICBpZihnZXRTeW1ib2xzKSQuZWFjaC5jYWxsKGdldFN5bWJvbHMoaXQpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgaWYoZ2V0RGVzYyhpdCwga2V5KS5lbnVtZXJhYmxlKWtleXMucHVzaChrZXkpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBrZXlzO1xyXG59OyIsInZhciBjdHggID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBnZXQgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5nZXRcclxuICAsIGNhbGwgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcclxuICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpXHJcbiAgICAsIGYgICAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXHJcbiAgICAsIHN0ZXA7XHJcbiAgd2hpbGUoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKXtcclxuICAgIGlmKGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpID09PSBmYWxzZSl7XHJcbiAgICAgIHJldHVybiBjYWxsLmNsb3NlKGl0ZXJhdG9yKTtcclxuICAgIH1cclxuICB9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkKXtcclxuICAkLkZXICAgPSB0cnVlO1xyXG4gICQucGF0aCA9ICQuZztcclxuICByZXR1cm4gJDtcclxufTsiLCIvLyBGYXN0IGFwcGx5XHJcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcclxuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XHJcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcclxuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xyXG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xyXG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xyXG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xyXG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xyXG4gICAgY2FzZSA1OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xyXG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcclxufTsiLCJ2YXIgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcclxuZnVuY3Rpb24gY2xvc2UoaXRlcmF0b3Ipe1xyXG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XHJcbiAgaWYocmV0ICE9PSB1bmRlZmluZWQpYXNzZXJ0T2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XHJcbn1cclxuZnVuY3Rpb24gY2FsbChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhc3NlcnRPYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGNsb3NlKGl0ZXJhdG9yKTtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG59XHJcbmNhbGwuY2xvc2UgPSBjbG9zZTtcclxubW9kdWxlLmV4cG9ydHMgPSBjYWxsOyIsInZhciAkZGVmICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICQgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRpdGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAaXRlcmF0b3InXHJcbiAgLCBLRVlTICAgICAgICAgICAgPSAna2V5cydcclxuICAsIFZBTFVFUyAgICAgICAgICA9ICd2YWx1ZXMnXHJcbiAgLCBJdGVyYXRvcnMgICAgICAgPSAkaXRlci5JdGVyYXRvcnM7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0Upe1xyXG4gICRpdGVyLmNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlTWV0aG9kKGtpbmQpe1xyXG4gICAgZnVuY3Rpb24gJCQodGhhdCl7XHJcbiAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhhdCwga2luZCk7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2goa2luZCl7XHJcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xyXG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJCQodGhpcyk7IH07XHJcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcclxuICB9XHJcbiAgdmFyIFRBRyAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXHJcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcclxuICAgICwgX25hdGl2ZSAgPSBwcm90b1tTWU1CT0xfSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXHJcbiAgICAsIF9kZWZhdWx0ID0gX25hdGl2ZSB8fCBjcmVhdGVNZXRob2QoREVGQVVMVClcclxuICAgICwgbWV0aG9kcywga2V5O1xyXG4gIC8vIEZpeCBuYXRpdmVcclxuICBpZihfbmF0aXZlKXtcclxuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9ICQuZ2V0UHJvdG8oX2RlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xyXG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xyXG4gICAgY29mLnNldChJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcclxuICAgIC8vIEZGIGZpeFxyXG4gICAgaWYoJC5GVyAmJiAkLmhhcyhwcm90bywgRkZfSVRFUkFUT1IpKSRpdGVyLnNldChJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcclxuICB9XHJcbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXHJcbiAgaWYoJC5GVykkaXRlci5zZXQocHJvdG8sIF9kZWZhdWx0KTtcclxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XHJcbiAgSXRlcmF0b3JzW05BTUVdID0gX2RlZmF1bHQ7XHJcbiAgSXRlcmF0b3JzW1RBR10gID0gJC50aGF0O1xyXG4gIGlmKERFRkFVTFQpe1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChLRVlTKSxcclxuICAgICAgdmFsdWVzOiAgREVGQVVMVCA9PSBWQUxVRVMgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChWQUxVRVMpLFxyXG4gICAgICBlbnRyaWVzOiBERUZBVUxUICE9IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKCdlbnRyaWVzJylcclxuICAgIH07XHJcbiAgICBpZihGT1JDRSlmb3Ioa2V5IGluIG1ldGhvZHMpe1xyXG4gICAgICBpZighKGtleSBpbiBwcm90bykpJC5oaWRlKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XHJcbiAgICB9IGVsc2UgJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAkaXRlci5CVUdHWSwgTkFNRSwgbWV0aG9kcyk7XHJcbiAgfVxyXG59OyIsInZhciBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcclxuICAsIFNBRkVfQ0xPU0lORyAgICA9IGZhbHNlO1xyXG50cnkge1xyXG4gIHZhciByaXRlciA9IFs3XVtTWU1CT0xfSVRFUkFUT1JdKCk7XHJcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcclxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcclxufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xyXG4gIGlmKCFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xyXG4gIHZhciBzYWZlID0gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhcnIgID0gWzddXHJcbiAgICAgICwgaXRlciA9IGFycltTWU1CT0xfSVRFUkFUT1JdKCk7XHJcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcclxuICAgIGFycltTWU1CT0xfSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XHJcbiAgICBleGVjKGFycik7XHJcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gIHJldHVybiBzYWZlO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCBhc3NlcnRPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmpcclxuICAsIFNZTUJPTF9JVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXHJcbiAgLCBGRl9JVEVSQVRPUiAgICAgICA9ICdAQGl0ZXJhdG9yJ1xyXG4gICwgSXRlcmF0b3JzICAgICAgICAgPSB7fVxyXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcclxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcclxuc2V0SXRlcmF0b3IoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XHJcbmZ1bmN0aW9uIHNldEl0ZXJhdG9yKE8sIHZhbHVlKXtcclxuICAkLmhpZGUoTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XHJcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxyXG4gIGlmKEZGX0lURVJBVE9SIGluIFtdKSQuaGlkZShPLCBGRl9JVEVSQVRPUiwgdmFsdWUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXHJcbiAgQlVHR1k6ICdrZXlzJyBpbiBbXSAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpLFxyXG4gIEl0ZXJhdG9yczogSXRlcmF0b3JzLFxyXG4gIHN0ZXA6IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcclxuICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xyXG4gIH0sXHJcbiAgaXM6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoaXQpXHJcbiAgICAgICwgU3ltYm9sID0gJC5nLlN5bWJvbFxyXG4gICAgICAsIFNZTSAgICA9IFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1I7XHJcbiAgICByZXR1cm4gU1lNIGluIE8gfHwgU1lNQk9MX0lURVJBVE9SIGluIE8gfHwgJC5oYXMoSXRlcmF0b3JzLCBjb2YuY2xhc3NvZihPKSk7XHJcbiAgfSxcclxuICBnZXQ6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBTeW1ib2wgID0gJC5nLlN5bWJvbFxyXG4gICAgICAsIGV4dCAgICAgPSBpdFtTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SXVxyXG4gICAgICAsIGdldEl0ZXIgPSBleHQgfHwgaXRbU1lNQk9MX0lURVJBVE9SXSB8fCBJdGVyYXRvcnNbY29mLmNsYXNzb2YoaXQpXTtcclxuICAgIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XHJcbiAgfSxcclxuICBzZXQ6IHNldEl0ZXJhdG9yLFxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcclxuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKHByb3RvIHx8IEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogJC5kZXNjKDEsIG5leHQpfSk7XHJcbiAgICBjb2Yuc2V0KENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xyXG4gIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpXHJcbiAgLCBjb3JlICAgPSB7fVxyXG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcclxuICAsIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHlcclxuICAsIGNlaWwgID0gTWF0aC5jZWlsXHJcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcclxuICAsIG1heCAgID0gTWF0aC5tYXhcclxuICAsIG1pbiAgID0gTWF0aC5taW47XHJcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxyXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiAyOyB9fSkuYSA9PSAyO1xyXG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cclxufSgpO1xyXG52YXIgaGlkZSA9IGNyZWF0ZURlZmluZXIoMSk7XHJcbi8vIDcuMS40IFRvSW50ZWdlclxyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xyXG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xyXG59XHJcbmZ1bmN0aW9uIGRlc2MoYml0bWFwLCB2YWx1ZSl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcclxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcclxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcclxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcclxuICB9O1xyXG59XHJcbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gIG9iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XHJcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgZGVzYyhiaXRtYXAsIHZhbHVlKSk7XHJcbiAgfSA6IHNpbXBsZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xyXG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcclxufVxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XHJcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuXHJcbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XHJcbiAgZzogZ2xvYmFsLFxyXG4gIGNvcmU6IGNvcmUsXHJcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcclxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XHJcbiAgaXNPYmplY3Q6ICAgaXNPYmplY3QsXHJcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICBpdDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGl0O1xyXG4gIH0sXHJcbiAgdGhhdDogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbiAgdG9JbnRlZ2VyOiB0b0ludGVnZXIsXHJcbiAgLy8gNy4xLjE1IFRvTGVuZ3RoXHJcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXHJcbiAgfSxcclxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcclxuICAgIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcclxuICAgIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xyXG4gIH0sXHJcbiAgaGFzOiBmdW5jdGlvbihpdCwga2V5KXtcclxuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xyXG4gIH0sXHJcbiAgY3JlYXRlOiAgICAgT2JqZWN0LmNyZWF0ZSxcclxuICBnZXRQcm90bzogICBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXHJcbiAgREVTQzogICAgICAgREVTQyxcclxuICBkZXNjOiAgICAgICBkZXNjLFxyXG4gIGdldERlc2M6ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXHJcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXHJcbiAgc2V0RGVzY3M6ICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXHJcbiAgZ2V0S2V5czogICAgT2JqZWN0LmtleXMsXHJcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXHJcbiAgZ2V0U3ltYm9sczogT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcclxuICBhc3NlcnREZWZpbmVkOiBhc3NlcnREZWZpbmVkLFxyXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxyXG4gIEVTNU9iamVjdDogT2JqZWN0LFxyXG4gIHRvT2JqZWN0OiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xyXG4gIH0sXHJcbiAgaGlkZTogaGlkZSxcclxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXHJcbiAgc2V0OiBnbG9iYWwuU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZSxcclxuICBtaXg6IGZ1bmN0aW9uKHRhcmdldCwgc3JjKXtcclxuICAgIGZvcih2YXIga2V5IGluIHNyYyloaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG4gIH0sXHJcbiAgZWFjaDogW10uZm9yRWFjaFxyXG59KTtcclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaWYodHlwZW9mIF9fZSAhPSAndW5kZWZpbmVkJylfX2UgPSBjb3JlO1xyXG5pZih0eXBlb2YgX19nICE9ICd1bmRlZmluZWQnKV9fZyA9IGdsb2JhbDsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xyXG4gIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcclxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXHJcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGluZGV4ICA9IDBcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG93bktleXMoaXQpe1xyXG4gIGFzc2VydE9iamVjdChpdCk7XHJcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldE5hbWVzKGl0KVxyXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xyXG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXHJcbiAgLCBhc3NlcnRGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5mbjtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigvKiAuLi5wYXJncyAqLyl7XHJcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXHJcbiAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgcGFyZ3MgID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIF8gICAgICA9ICQucGF0aC5fXHJcbiAgICAsIGhvbGRlciA9IGZhbHNlO1xyXG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgdmFyIHRoYXQgICAgPSB0aGlzXHJcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCBqID0gMCwgayA9IDAsIGFyZ3M7XHJcbiAgICBpZighaG9sZGVyICYmICFfbGVuZ3RoKXJldHVybiBpbnZva2UoZm4sIHBhcmdzLCB0aGF0KTtcclxuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xyXG4gICAgaWYoaG9sZGVyKWZvcig7bGVuZ3RoID4gajsgaisrKWlmKGFyZ3Nbal0gPT09IF8pYXJnc1tqXSA9IGFyZ3VtZW50c1trKytdO1xyXG4gICAgd2hpbGUoX2xlbmd0aCA+IGspYXJncy5wdXNoKGFyZ3VtZW50c1trKytdKTtcclxuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xyXG4gIH07XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlZ0V4cCwgcmVwbGFjZSwgaXNTdGF0aWMpe1xyXG4gIHZhciByZXBsYWNlciA9IHJlcGxhY2UgPT09IE9iamVjdChyZXBsYWNlKSA/IGZ1bmN0aW9uKHBhcnQpe1xyXG4gICAgcmV0dXJuIHJlcGxhY2VbcGFydF07XHJcbiAgfSA6IHJlcGxhY2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBTdHJpbmcoaXNTdGF0aWMgPyBpdCA6IHRoaXMpLnJlcGxhY2UocmVnRXhwLCByZXBsYWNlcik7XHJcbiAgfTtcclxufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cclxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cclxudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBhc3NlcnQgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jyk7XHJcbmZ1bmN0aW9uIGNoZWNrKE8sIHByb3RvKXtcclxuICBhc3NlcnQub2JqKE8pO1xyXG4gIGFzc2VydChwcm90byA9PT0gbnVsbCB8fCAkLmlzT2JqZWN0KHByb3RvKSwgcHJvdG8sIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgPyBmdW5jdGlvbihidWdneSwgc2V0KXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsICQuZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcclxuICAgICAgICAgIHNldCh7fSwgW10pO1xyXG4gICAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XHJcbiAgICAgICAgICBjaGVjayhPLCBwcm90byk7XHJcbiAgICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xyXG4gICAgICAgICAgcmV0dXJuIE87XHJcbiAgICAgICAgfTtcclxuICAgICAgfSgpXHJcbiAgICA6IHVuZGVmaW5lZCksXHJcbiAgY2hlY2s6IGNoZWNrXHJcbn07IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEMpe1xyXG4gIGlmKCQuREVTQyAmJiAhKFNQRUNJRVMgaW4gQykpJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogJC50aGF0XHJcbiAgfSk7XHJcbn07IiwiLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XHJcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XHJcbiAgICB2YXIgcyA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhhdCkpXHJcbiAgICAgICwgaSA9ICQudG9JbnRlZ2VyKHBvcylcclxuICAgICAgLCBsID0gcy5sZW5ndGhcclxuICAgICAgLCBhLCBiO1xyXG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcclxuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXHJcbiAgICAgIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxyXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXHJcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XHJcbiAgfTtcclxufTsiLCIvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1zdHJhd21hbjpzdHJpbmdfcGFkZGluZ1xyXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHJlcGVhdCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcmVwZWF0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIG1pbkxlbmd0aCwgZmlsbENoYXIsIGxlZnQpe1xyXG4gIC8vIDEuIExldCBPIGJlIENoZWNrT2JqZWN0Q29lcmNpYmxlKHRoaXMgdmFsdWUpLlxyXG4gIC8vIDIuIExldCBTIGJlIFRvU3RyaW5nKE8pLlxyXG4gIHZhciBTID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGF0KSk7XHJcbiAgLy8gNC4gSWYgaW50TWluTGVuZ3RoIGlzIHVuZGVmaW5lZCwgcmV0dXJuIFMuXHJcbiAgaWYobWluTGVuZ3RoID09PSB1bmRlZmluZWQpcmV0dXJuIFM7XHJcbiAgLy8gNC4gTGV0IGludE1pbkxlbmd0aCBiZSBUb0ludGVnZXIobWluTGVuZ3RoKS5cclxuICB2YXIgaW50TWluTGVuZ3RoID0gJC50b0ludGVnZXIobWluTGVuZ3RoKTtcclxuICAvLyA1LiBMZXQgZmlsbExlbiBiZSB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gUyBtaW51cyBpbnRNaW5MZW5ndGguXHJcbiAgdmFyIGZpbGxMZW4gPSBpbnRNaW5MZW5ndGggLSBTLmxlbmd0aDtcclxuICAvLyA2LiBJZiBmaWxsTGVuIDwgMCwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxyXG4gIC8vIDcuIElmIGZpbGxMZW4gaXMgK+KIniwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxyXG4gIGlmKGZpbGxMZW4gPCAwIHx8IGZpbGxMZW4gPT09IEluZmluaXR5KXtcclxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDYW5ub3Qgc2F0aXNmeSBzdHJpbmcgbGVuZ3RoICcgKyBtaW5MZW5ndGggKyAnIGZvciBzdHJpbmc6ICcgKyBTKTtcclxuICB9XHJcbiAgLy8gOC4gTGV0IHNGaWxsU3RyIGJlIHRoZSBzdHJpbmcgcmVwcmVzZW50ZWQgYnkgZmlsbFN0ci5cclxuICAvLyA5LiBJZiBzRmlsbFN0ciBpcyB1bmRlZmluZWQsIGxldCBzRmlsbFN0ciBiZSBhIHNwYWNlIGNoYXJhY3Rlci5cclxuICB2YXIgc0ZpbGxTdHIgPSBmaWxsQ2hhciA9PT0gdW5kZWZpbmVkID8gJyAnIDogU3RyaW5nKGZpbGxDaGFyKTtcclxuICAvLyAxMC4gTGV0IHNGaWxsVmFsIGJlIGEgU3RyaW5nIG1hZGUgb2Ygc0ZpbGxTdHIsIHJlcGVhdGVkIHVudGlsIGZpbGxMZW4gaXMgbWV0LlxyXG4gIHZhciBzRmlsbFZhbCA9IHJlcGVhdC5jYWxsKHNGaWxsU3RyLCBNYXRoLmNlaWwoZmlsbExlbiAvIHNGaWxsU3RyLmxlbmd0aCkpO1xyXG4gIC8vIHRydW5jYXRlIGlmIHdlIG92ZXJmbG93ZWRcclxuICBpZihzRmlsbFZhbC5sZW5ndGggPiBmaWxsTGVuKXNGaWxsVmFsID0gbGVmdFxyXG4gICAgPyBzRmlsbFZhbC5zbGljZShzRmlsbFZhbC5sZW5ndGggLSBmaWxsTGVuKVxyXG4gICAgOiBzRmlsbFZhbC5zbGljZSgwLCBmaWxsTGVuKTtcclxuICAvLyAxMS4gUmV0dXJuIGEgc3RyaW5nIG1hZGUgZnJvbSBzRmlsbFZhbCwgZm9sbG93ZWQgYnkgUy5cclxuICAvLyAxMS4gUmV0dXJuIGEgU3RyaW5nIG1hZGUgZnJvbSBTLCBmb2xsb3dlZCBieSBzRmlsbFZhbC5cclxuICByZXR1cm4gbGVmdCA/IHNGaWxsVmFsLmNvbmNhdChTKSA6IFMuY29uY2F0KHNGaWxsVmFsKTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcGVhdChjb3VudCl7XHJcbiAgdmFyIHN0ciA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAsIHJlcyA9ICcnXHJcbiAgICAsIG4gICA9ICQudG9JbnRlZ2VyKGNvdW50KTtcclxuICBpZihuIDwgMCB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcclxuICBmb3IoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSlpZihuICYgMSlyZXMgKz0gc3RyO1xyXG4gIHJldHVybiByZXM7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgY29mICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGNlbCAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcclxuICAsIGdsb2JhbCAgICAgICAgICAgICA9ICQuZ1xyXG4gICwgaXNGdW5jdGlvbiAgICAgICAgID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBodG1sICAgICAgICAgICAgICAgPSAkLmh0bWxcclxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXHJcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXHJcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcclxuICAsIHBvc3RNZXNzYWdlICAgICAgICA9IGdsb2JhbC5wb3N0TWVzc2FnZVxyXG4gICwgYWRkRXZlbnRMaXN0ZW5lciAgID0gZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcclxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxyXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxyXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cclxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXHJcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcclxuZnVuY3Rpb24gcnVuKCl7XHJcbiAgdmFyIGlkID0gK3RoaXM7XHJcbiAgaWYoJC5oYXMocXVldWUsIGlkKSl7XHJcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XHJcbiAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gICAgZm4oKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gbGlzdG5lcihldmVudCl7XHJcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XHJcbn1cclxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxyXG5pZighaXNGdW5jdGlvbihzZXRUYXNrKSB8fCAhaXNGdW5jdGlvbihjbGVhclRhc2spKXtcclxuICBzZXRUYXNrID0gZnVuY3Rpb24oZm4pe1xyXG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XHJcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGludm9rZShpc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcclxuICAgIH07XHJcbiAgICBkZWZlcihjb3VudGVyKTtcclxuICAgIHJldHVybiBjb3VudGVyO1xyXG4gIH07XHJcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICB9O1xyXG4gIC8vIE5vZGUuanMgMC44LVxyXG4gIGlmKGNvZihwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcclxuICAgIH07XHJcbiAgLy8gTW9kZXJuIGJyb3dzZXJzLCBza2lwIGltcGxlbWVudGF0aW9uIGZvciBXZWJXb3JrZXJzXHJcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgb2JqZWN0XHJcbiAgfSBlbHNlIGlmKGFkZEV2ZW50TGlzdGVuZXIgJiYgaXNGdW5jdGlvbihwb3N0TWVzc2FnZSkgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBwb3N0TWVzc2FnZShpZCwgJyonKTtcclxuICAgIH07XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xyXG4gIC8vIFdlYldvcmtlcnNcclxuICB9IGVsc2UgaWYoaXNGdW5jdGlvbihNZXNzYWdlQ2hhbm5lbCkpe1xyXG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcclxuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xyXG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xyXG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XHJcbiAgLy8gSUU4LVxyXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcclxuICB9IGVsc2Uge1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHNldDogICBzZXRUYXNrLFxyXG4gIGNsZWFyOiBjbGVhclRhc2tcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xyXG4gIHRyeSB7XHJcbiAgICBleGVjKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTsiLCJ2YXIgc2lkID0gMDtcclxuZnVuY3Rpb24gdWlkKGtleSl7XHJcbiAgcmV0dXJuICdTeW1ib2woJyArIGtleSArICcpXycgKyAoKytzaWQgKyBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxudWlkLnNhZmUgPSByZXF1aXJlKCcuLyQnKS5nLlN5bWJvbCB8fCB1aWQ7XHJcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cclxudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi8kLndrcycpKCd1bnNjb3BhYmxlcycpO1xyXG5pZigkLkZXICYmICEoVU5TQ09QQUJMRVMgaW4gW10pKSQuaGlkZShBcnJheS5wcm90b3R5cGUsIFVOU0NPUEFCTEVTLCB7fSk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICBpZigkLkZXKVtdW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcclxufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kJykuZ1xyXG4gICwgc3RvcmUgID0ge307XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XHJcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XHJcbiAgICBnbG9iYWwuU3ltYm9sICYmIGdsb2JhbC5TeW1ib2xbbmFtZV0gfHwgcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ1N5bWJvbC4nICsgbmFtZSkpO1xyXG59OyIsInZhciAkICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNlbCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXHJcbiAgLCBjb2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBpbnZva2UgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXHJcbiAgLCBhcnJheU1ldGhvZCAgICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxyXG4gICwgSUVfUFJPVE8gICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdfX3Byb3RvX18nKVxyXG4gICwgYXNzZXJ0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgYXNzZXJ0T2JqZWN0ICAgICA9IGFzc2VydC5vYmpcclxuICAsIE9iamVjdFByb3RvICAgICAgPSBPYmplY3QucHJvdG90eXBlXHJcbiAgLCBBICAgICAgICAgICAgICAgID0gW11cclxuICAsIHNsaWNlICAgICAgICAgICAgPSBBLnNsaWNlXHJcbiAgLCBpbmRleE9mICAgICAgICAgID0gQS5pbmRleE9mXHJcbiAgLCBjbGFzc29mICAgICAgICAgID0gY29mLmNsYXNzb2ZcclxuICAsIGhhcyAgICAgICAgICAgICAgPSAkLmhhc1xyXG4gICwgZGVmaW5lUHJvcGVydHkgICA9ICQuc2V0RGVzY1xyXG4gICwgZ2V0T3duRGVzY3JpcHRvciA9ICQuZ2V0RGVzY1xyXG4gICwgZGVmaW5lUHJvcGVydGllcyA9ICQuc2V0RGVzY3NcclxuICAsIGlzRnVuY3Rpb24gICAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIHRvT2JqZWN0ICAgICAgICAgPSAkLnRvT2JqZWN0XHJcbiAgLCB0b0xlbmd0aCAgICAgICAgID0gJC50b0xlbmd0aFxyXG4gICwgSUU4X0RPTV9ERUZJTkUgICA9IGZhbHNlXHJcbiAgLCAkaW5kZXhPZiAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykoZmFsc2UpXHJcbiAgLCAkZm9yRWFjaCAgICAgICAgID0gYXJyYXlNZXRob2QoMClcclxuICAsICRtYXAgICAgICAgICAgICAgPSBhcnJheU1ldGhvZCgxKVxyXG4gICwgJGZpbHRlciAgICAgICAgICA9IGFycmF5TWV0aG9kKDIpXHJcbiAgLCAkc29tZSAgICAgICAgICAgID0gYXJyYXlNZXRob2QoMylcclxuICAsICRldmVyeSAgICAgICAgICAgPSBhcnJheU1ldGhvZCg0KTtcclxuXHJcbmlmKCEkLkRFU0Mpe1xyXG4gIHRyeSB7XHJcbiAgICBJRThfRE9NX0RFRklORSA9IGRlZmluZVByb3BlcnR5KGNlbCgnZGl2JyksICd4JyxcclxuICAgICAge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDg7IH19XHJcbiAgICApLnggPT0gODtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgJC5zZXREZXNjID0gZnVuY3Rpb24oTywgUCwgQXR0cmlidXRlcyl7XHJcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XHJcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcclxuICAgIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylhc3NlcnRPYmplY3QoTylbUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfTtcclxuICAkLmdldERlc2MgPSBmdW5jdGlvbihPLCBQKXtcclxuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XHJcbiAgICAgIHJldHVybiBnZXRPd25EZXNjcmlwdG9yKE8sIFApO1xyXG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gICAgaWYoaGFzKE8sIFApKXJldHVybiAkLmRlc2MoIU9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoTywgUCksIE9bUF0pO1xyXG4gIH07XHJcbiAgJC5zZXREZXNjcyA9IGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihPLCBQcm9wZXJ0aWVzKXtcclxuICAgIGFzc2VydE9iamVjdChPKTtcclxuICAgIHZhciBrZXlzICAgPSAkLmdldEtleXMoUHJvcGVydGllcylcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGkgPSAwXHJcbiAgICAgICwgUDtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGkpJC5zZXREZXNjKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICEkLkRFU0MsICdPYmplY3QnLCB7XHJcbiAgLy8gMTkuMS4yLjYgLyAxNS4yLjMuMyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXHJcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkLmdldERlc2MsXHJcbiAgLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcclxuICBkZWZpbmVQcm9wZXJ0eTogJC5zZXREZXNjLFxyXG4gIC8vIDE5LjEuMi4zIC8gMTUuMi4zLjcgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcclxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzXHJcbn0pO1xyXG5cclxuICAvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXHJcbnZhciBrZXlzMSA9ICgnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSwnICtcclxuICAgICAgICAgICAgJ3RvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnKS5zcGxpdCgnLCcpXHJcbiAgLy8gQWRkaXRpb25hbCBrZXlzIGZvciBnZXRPd25Qcm9wZXJ0eU5hbWVzXHJcbiAgLCBrZXlzMiA9IGtleXMxLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpXHJcbiAgLCBrZXlzTGVuMSA9IGtleXMxLmxlbmd0aDtcclxuXHJcbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXHJcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcclxuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xyXG4gIHZhciBpZnJhbWUgPSBjZWwoJ2lmcmFtZScpXHJcbiAgICAsIGkgICAgICA9IGtleXNMZW4xXHJcbiAgICAsIGd0ICAgICA9ICc+J1xyXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcclxuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAkLmh0bWwuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXHJcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcclxuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XHJcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XHJcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoJzxzY3JpcHQ+ZG9jdW1lbnQuRj1PYmplY3Q8L3NjcmlwdCcgKyBndCk7XHJcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcclxuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcclxuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3QucHJvdG90eXBlW2tleXMxW2ldXTtcclxuICByZXR1cm4gY3JlYXRlRGljdCgpO1xyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVHZXRLZXlzKG5hbWVzLCBsZW5ndGgpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gW11cclxuICAgICAgLCBrZXk7XHJcbiAgICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXHJcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XHJcbiAgICAgIH5pbmRleE9mLmNhbGwocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn1cclxuZnVuY3Rpb24gaXNQcmltaXRpdmUoaXQpeyByZXR1cm4gISQuaXNPYmplY3QoaXQpOyB9XHJcbmZ1bmN0aW9uIEVtcHR5KCl7fVxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxyXG4gIGdldFByb3RvdHlwZU9mOiAkLmdldFByb3RvID0gJC5nZXRQcm90byB8fCBmdW5jdGlvbihPKXtcclxuICAgIE8gPSBPYmplY3QoYXNzZXJ0LmRlZihPKSk7XHJcbiAgICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcclxuICAgIGlmKGlzRnVuY3Rpb24oTy5jb25zdHJ1Y3RvcikgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xyXG4gICAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICQuZ2V0TmFtZXMgPSAkLmdldE5hbWVzIHx8IGNyZWF0ZUdldEtleXMoa2V5czIsIGtleXMyLmxlbmd0aCwgdHJ1ZSksXHJcbiAgLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXHJcbiAgY3JlYXRlOiAkLmNyZWF0ZSA9ICQuY3JlYXRlIHx8IGZ1bmN0aW9uKE8sIC8qPyovUHJvcGVydGllcyl7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYoTyAhPT0gbnVsbCl7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IGFzc2VydE9iamVjdChPKTtcclxuICAgICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XHJcbiAgICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2Ygc2hpbVxyXG4gICAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcclxuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XHJcbiAgICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXHJcbiAga2V5czogJC5nZXRLZXlzID0gJC5nZXRLZXlzIHx8IGNyZWF0ZUdldEtleXMoa2V5czEsIGtleXNMZW4xLCBmYWxzZSksXHJcbiAgLy8gMTkuMS4yLjE3IC8gMTUuMi4zLjggT2JqZWN0LnNlYWwoTylcclxuICBzZWFsOiAkLml0LCAvLyA8LSBjYXBcclxuICAvLyAxOS4xLjIuNSAvIDE1LjIuMy45IE9iamVjdC5mcmVlemUoTylcclxuICBmcmVlemU6ICQuaXQsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xNSAvIDE1LjIuMy4xMCBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcclxuICBwcmV2ZW50RXh0ZW5zaW9uczogJC5pdCwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEzIC8gMTUuMi4zLjExIE9iamVjdC5pc1NlYWxlZChPKVxyXG4gIGlzU2VhbGVkOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEyIC8gMTUuMi4zLjEyIE9iamVjdC5pc0Zyb3plbihPKVxyXG4gIGlzRnJvemVuOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjExIC8gMTUuMi4zLjEzIE9iamVjdC5pc0V4dGVuc2libGUoTylcclxuICBpc0V4dGVuc2libGU6ICQuaXNPYmplY3QgLy8gPC0gY2FwXHJcbn0pO1xyXG5cclxuLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxyXG4kZGVmKCRkZWYuUCwgJ0Z1bmN0aW9uJywge1xyXG4gIGJpbmQ6IGZ1bmN0aW9uKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xyXG4gICAgdmFyIGZuICAgICAgID0gYXNzZXJ0LmZuKHRoaXMpXHJcbiAgICAgICwgcGFydEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKXtcclxuICAgICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gJC5jcmVhdGUoZm4ucHJvdG90eXBlKSA6IHRoYXQpO1xyXG4gICAgfVxyXG4gICAgaWYoZm4ucHJvdG90eXBlKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcclxuICAgIHJldHVybiBib3VuZDtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gRml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nXHJcbmZ1bmN0aW9uIGFycmF5TWV0aG9kRml4KGZuKXtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmbi5hcHBseSgkLkVTNU9iamVjdCh0aGlzKSwgYXJndW1lbnRzKTtcclxuICB9O1xyXG59XHJcbmlmKCEoMCBpbiBPYmplY3QoJ3onKSAmJiAneidbMF0gPT0gJ3onKSl7XHJcbiAgJC5FUzVPYmplY3QgPSBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICgkLkVTNU9iamVjdCAhPSBPYmplY3QpLCAnQXJyYXknLCB7XHJcbiAgc2xpY2U6IGFycmF5TWV0aG9kRml4KHNsaWNlKSxcclxuICBqb2luOiBhcnJheU1ldGhvZEZpeChBLmpvaW4pXHJcbn0pO1xyXG5cclxuLy8gMjIuMS4yLjIgLyAxNS40LjMuMiBBcnJheS5pc0FycmF5KGFyZylcclxuJGRlZigkZGVmLlMsICdBcnJheScsIHtcclxuICBpc0FycmF5OiBmdW5jdGlvbihhcmcpe1xyXG4gICAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XHJcbiAgfVxyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlSZWR1Y2UoaXNSaWdodCl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4sIG1lbW8pe1xyXG4gICAgYXNzZXJ0LmZuKGNhbGxiYWNrZm4pO1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXHJcbiAgICAgICwgaSAgICAgID0gaXNSaWdodCA/IC0xIDogMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAyKWZvcig7Oyl7XHJcbiAgICAgIGlmKGluZGV4IGluIE8pe1xyXG4gICAgICAgIG1lbW8gPSBPW2luZGV4XTtcclxuICAgICAgICBpbmRleCArPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGluZGV4ICs9IGk7XHJcbiAgICAgIGFzc2VydChpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4LCAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xyXG4gICAgfVxyXG4gICAgZm9yKDtpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKWlmKGluZGV4IGluIE8pe1xyXG4gICAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1lbW87XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGZvckVhY2g6ICQuZWFjaCA9ICQuZWFjaCB8fCBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcclxuICB9LFxyXG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XHJcbiAgfSxcclxuICAvLyAyMi4xLjMuNyAvIDE1LjQuNC4yMCBBcnJheS5wcm90b3R5cGUuZmlsdGVyKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XHJcbiAgfSxcclxuICAvLyAyMi4xLjMuMjMgLyAxNS40LjQuMTcgQXJyYXkucHJvdG90eXBlLnNvbWUoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcclxuICBzb21lOiBmdW5jdGlvbiBzb21lKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICByZXR1cm4gJHNvbWUodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcclxuICB9LFxyXG4gIC8vIDIyLjEuMy41IC8gMTUuNC40LjE2IEFycmF5LnByb3RvdHlwZS5ldmVyeShjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgcmV0dXJuICRldmVyeSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xyXG4gIH0sXHJcbiAgLy8gMjIuMS4zLjE4IC8gMTUuNC40LjIxIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UoY2FsbGJhY2tmbiBbLCBpbml0aWFsVmFsdWVdKVxyXG4gIHJlZHVjZTogY3JlYXRlQXJyYXlSZWR1Y2UoZmFsc2UpLFxyXG4gIC8vIDIyLjEuMy4xOSAvIDE1LjQuNC4yMiBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQoY2FsbGJhY2tmbiBbLCBpbml0aWFsVmFsdWVdKVxyXG4gIHJlZHVjZVJpZ2h0OiBjcmVhdGVBcnJheVJlZHVjZSh0cnVlKSxcclxuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxyXG4gIGluZGV4T2Y6IGluZGV4T2YgPSBpbmRleE9mIHx8IGZ1bmN0aW9uIGluZGV4T2YoZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xyXG4gICAgcmV0dXJuICRpbmRleE9mKHRoaXMsIGVsLCBhcmd1bWVudHNbMV0pO1xyXG4gIH0sXHJcbiAgLy8gMjIuMS4zLjE0IC8gMTUuNC40LjE1IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXHJcbiAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKGVsLCBmcm9tSW5kZXggLyogPSBAWyotMV0gKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gbGVuZ3RoIC0gMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsICQudG9JbnRlZ2VyKGZyb21JbmRleCkpO1xyXG4gICAgaWYoaW5kZXggPCAwKWluZGV4ID0gdG9MZW5ndGgobGVuZ3RoICsgaW5kZXgpO1xyXG4gICAgZm9yKDtpbmRleCA+PSAwOyBpbmRleC0tKWlmKGluZGV4IGluIE8paWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpbmRleDtcclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gMjEuMS4zLjI1IC8gMTUuNS40LjIwIFN0cmluZy5wcm90b3R5cGUudHJpbSgpXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge3RyaW06IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eXFxzKihbXFxzXFxTXSpcXFMpP1xccyokLywgJyQxJyl9KTtcclxuXHJcbi8vIDIwLjMuMy4xIC8gMTUuOS40LjQgRGF0ZS5ub3coKVxyXG4kZGVmKCRkZWYuUywgJ0RhdGUnLCB7bm93OiBmdW5jdGlvbigpe1xyXG4gIHJldHVybiArbmV3IERhdGU7XHJcbn19KTtcclxuXHJcbmZ1bmN0aW9uIGx6KG51bSl7XHJcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XHJcbn1cclxuXHJcbi8vIDIwLjMuNC4zNiAvIDE1LjkuNS40MyBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZygpXHJcbi8vIFBoYW50b21KUyBhbmQgb2xkIHdlYmtpdCBoYWQgYSBicm9rZW4gRGF0ZSBpbXBsZW1lbnRhdGlvbi5cclxudmFyIGRhdGUgICAgICAgPSBuZXcgRGF0ZSgtNWUxMyAtIDEpXHJcbiAgLCBicm9rZW5EYXRlID0gIShkYXRlLnRvSVNPU3RyaW5nICYmIGRhdGUudG9JU09TdHJpbmcoKSA9PSAnMDM4NS0wNy0yNVQwNzowNjozOS45OTlaJ1xyXG4gICAgICAmJiByZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgbmV3IERhdGUoTmFOKS50b0lTT1N0cmluZygpOyB9KSk7XHJcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogYnJva2VuRGF0ZSwgJ0RhdGUnLCB7dG9JU09TdHJpbmc6IGZ1bmN0aW9uKCl7XHJcbiAgaWYoIWlzRmluaXRlKHRoaXMpKXRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgdGltZSB2YWx1ZScpO1xyXG4gIHZhciBkID0gdGhpc1xyXG4gICAgLCB5ID0gZC5nZXRVVENGdWxsWWVhcigpXHJcbiAgICAsIG0gPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpXHJcbiAgICAsIHMgPSB5IDwgMCA/ICctJyA6IHkgPiA5OTk5ID8gJysnIDogJyc7XHJcbiAgcmV0dXJuIHMgKyAoJzAwMDAwJyArIE1hdGguYWJzKHkpKS5zbGljZShzID8gLTYgOiAtNCkgK1xyXG4gICAgJy0nICsgbHooZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBseihkLmdldFVUQ0RhdGUoKSkgK1xyXG4gICAgJ1QnICsgbHooZC5nZXRVVENIb3VycygpKSArICc6JyArIGx6KGQuZ2V0VVRDTWludXRlcygpKSArXHJcbiAgICAnOicgKyBseihkLmdldFVUQ1NlY29uZHMoKSkgKyAnLicgKyAobSA+IDk5ID8gbSA6ICcwJyArIGx6KG0pKSArICdaJztcclxufX0pO1xyXG5cclxuaWYoY2xhc3NvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdPYmplY3QnKWNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xyXG4gIHZhciB0YWcgPSBjbGFzc29mKGl0KTtcclxuICByZXR1cm4gdGFnID09ICdPYmplY3QnICYmIGlzRnVuY3Rpb24oaXQuY2FsbGVlKSA/ICdBcmd1bWVudHMnIDogdGFnO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgdG9JbmRleCA9ICQudG9JbmRleDtcclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcclxuICBjb3B5V2l0aGluOiBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgIHZhciBPICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgbGVuICAgPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcclxuICAgICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcclxuICAgICAgLCBlbmQgICA9IGFyZ3VtZW50c1syXVxyXG4gICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxyXG4gICAgICAsIGNvdW50ID0gTWF0aC5taW4oZmluIC0gZnJvbSwgbGVuIC0gdG8pXHJcbiAgICAgICwgaW5jICAgPSAxO1xyXG4gICAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcclxuICAgICAgaW5jICA9IC0xO1xyXG4gICAgICBmcm9tID0gZnJvbSArIGNvdW50IC0gMTtcclxuICAgICAgdG8gICA9IHRvICAgKyBjb3VudCAtIDE7XHJcbiAgICB9XHJcbiAgICB3aGlsZShjb3VudC0tID4gMCl7XHJcbiAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XHJcbiAgICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xyXG4gICAgICB0byAgICs9IGluYztcclxuICAgICAgZnJvbSArPSBpbmM7XHJcbiAgICB9IHJldHVybiBPO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2NvcHlXaXRoaW4nKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgZmlsbDogZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcclxuICAgICAgLCBlbmQgICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xyXG4gICAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnZmlsbCcpOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbnZhciBLRVkgICAgPSAnZmluZEluZGV4J1xyXG4gICwgJGRlZiAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBmb3JjZWQgPSB0cnVlXHJcbiAgLCAkZmluZCAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDYpO1xyXG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xyXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XHJcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogZm9yY2VkLCAnQXJyYXknLCB7XHJcbiAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxudmFyIEtFWSAgICA9ICdmaW5kJ1xyXG4gICwgJGRlZiAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBmb3JjZWQgPSB0cnVlXHJcbiAgLCAkZmluZCAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDUpO1xyXG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xyXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XHJcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogZm9yY2VkLCAnQXJyYXknLCB7XHJcbiAgZmluZDogZnVuY3Rpb24gZmluZChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XHJcbiAgfVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKShLRVkpOyIsInZhciAkICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgY2FsbCAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcclxuICAgIHZhciBPICAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxyXG4gICAgICAsIG1hcGZuICAgPSBhcmd1bWVudHNbMV1cclxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxyXG4gICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXHJcbiAgICAgICwgaW5kZXggICA9IDBcclxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XHJcbiAgICBpZigkaXRlci5pcyhPKSl7XHJcbiAgICAgIGl0ZXJhdG9yID0gJGl0ZXIuZ2V0KE8pO1xyXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxyXG4gICAgICByZXN1bHQgICA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSk7XHJcbiAgICAgIGZvcig7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XHJcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBmLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXHJcbiAgICAgIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aCkpO1xyXG4gICAgICBmb3IoOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XHJcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn0pOyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHNldFVuc2NvcGUgPSByZXF1aXJlKCcuLyQudW5zY29wZScpXHJcbiAgLCBJVEVSICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgJGl0ZXIgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIHN0ZXAgICAgICAgPSAkaXRlci5zdGVwXHJcbiAgLCBJdGVyYXRvcnMgID0gJGl0ZXIuSXRlcmF0b3JzO1xyXG5cclxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxyXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxyXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXHJcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiAkLnRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxufSwgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAsIGluZGV4ID0gaXRlci5pKys7XHJcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xyXG4gICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHN0ZXAoMSk7XHJcbiAgfVxyXG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xyXG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xyXG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcclxufSwgJ3ZhbHVlcycpO1xyXG5cclxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxyXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xyXG5cclxuc2V0VW5zY29wZSgna2V5cycpO1xyXG5zZXRVbnNjb3BlKCd2YWx1ZXMnKTtcclxuc2V0VW5zY29wZSgnZW50cmllcycpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMi4zIEFycmF5Lm9mKCAuLi5pdGVtcylcclxuICBvZjogZnVuY3Rpb24gb2YoLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgaW5kZXggID0gMFxyXG4gICAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cclxuICAgICAgLCByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xyXG4gICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59KTsiLCJyZXF1aXJlKCcuLyQuc3BlY2llcycpKEFycmF5KTsiLCJ2YXIgJCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBIQVNfSU5TVEFOQ0UgID0gcmVxdWlyZSgnLi8kLndrcycpKCdoYXNJbnN0YW5jZScpXHJcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4vLyAxOS4yLjMuNiBGdW5jdGlvbi5wcm90b3R5cGVbQEBoYXNJbnN0YW5jZV0oVilcclxuaWYoIShIQVNfSU5TVEFOQ0UgaW4gRnVuY3Rpb25Qcm90bykpJC5zZXREZXNjKEZ1bmN0aW9uUHJvdG8sIEhBU19JTlNUQU5DRSwge3ZhbHVlOiBmdW5jdGlvbihPKXtcclxuICBpZighJC5pc0Z1bmN0aW9uKHRoaXMpIHx8ICEkLmlzT2JqZWN0KE8pKXJldHVybiBmYWxzZTtcclxuICBpZighJC5pc09iamVjdCh0aGlzLnByb3RvdHlwZSkpcmV0dXJuIE8gaW5zdGFuY2VvZiB0aGlzO1xyXG4gIC8vIGZvciBlbnZpcm9ubWVudCB3L28gbmF0aXZlIGBAQGhhc0luc3RhbmNlYCBsb2dpYyBlbm91Z2ggYGluc3RhbmNlb2ZgLCBidXQgYWRkIHRoaXM6XHJcbiAgd2hpbGUoTyA9ICQuZ2V0UHJvdG8oTykpaWYodGhpcy5wcm90b3R5cGUgPT09IE8pcmV0dXJuIHRydWU7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59fSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBOQU1FID0gJ25hbWUnXHJcbiAgLCBzZXREZXNjID0gJC5zZXREZXNjXHJcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4vLyAxOS4yLjQuMiBuYW1lXHJcbk5BTUUgaW4gRnVuY3Rpb25Qcm90byB8fCAkLkZXICYmICQuREVTQyAmJiBzZXREZXNjKEZ1bmN0aW9uUHJvdG8sIE5BTUUsIHtcclxuICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgZ2V0OiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIG1hdGNoID0gU3RyaW5nKHRoaXMpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLylcclxuICAgICAgLCBuYW1lICA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxuICAgICQuaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgJC5kZXNjKDUsIG5hbWUpKTtcclxuICAgIHJldHVybiBuYW1lO1xyXG4gIH0sXHJcbiAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYygwLCB2YWx1ZSkpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XHJcblxyXG4vLyAyMy4xIE1hcCBPYmplY3RzXHJcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ01hcCcsIHtcclxuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcclxuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XHJcbiAgfSxcclxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xyXG4gIH1cclxufSwgc3Ryb25nLCB0cnVlKTsiLCJ2YXIgSW5maW5pdHkgPSAxIC8gMFxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIEUgICAgID0gTWF0aC5FXHJcbiAgLCBwb3cgICA9IE1hdGgucG93XHJcbiAgLCBhYnMgICA9IE1hdGguYWJzXHJcbiAgLCBleHAgICA9IE1hdGguZXhwXHJcbiAgLCBsb2cgICA9IE1hdGgubG9nXHJcbiAgLCBzcXJ0ICA9IE1hdGguc3FydFxyXG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcclxuICAsIGZsb29yID0gTWF0aC5mbG9vclxyXG4gICwgRVBTSUxPTiAgID0gcG93KDIsIC01MilcclxuICAsIEVQU0lMT04zMiA9IHBvdygyLCAtMjMpXHJcbiAgLCBNQVgzMiAgICAgPSBwb3coMiwgMTI3KSAqICgyIC0gRVBTSUxPTjMyKVxyXG4gICwgTUlOMzIgICAgID0gcG93KDIsIC0xMjYpO1xyXG5mdW5jdGlvbiByb3VuZFRpZXNUb0V2ZW4obil7XHJcbiAgcmV0dXJuIG4gKyAxIC8gRVBTSUxPTiAtIDEgLyBFUFNJTE9OO1xyXG59XHJcblxyXG4vLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbmZ1bmN0aW9uIHNpZ24oeCl7XHJcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xyXG59XHJcbi8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuZnVuY3Rpb24gYXNpbmgoeCl7XHJcbiAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBsb2coeCArIHNxcnQoeCAqIHggKyAxKSk7XHJcbn1cclxuLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuZnVuY3Rpb24gZXhwbTEoeCl7XHJcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IGV4cCh4KSAtIDE7XHJcbn1cclxuXHJcbiRkZWYoJGRlZi5TLCAnTWF0aCcsIHtcclxuICAvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXHJcbiAgYWNvc2g6IGZ1bmN0aW9uIGFjb3NoKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IGlzRmluaXRlKHgpID8gbG9nKHggLyBFICsgc3FydCh4ICsgMSkgKiBzcXJ0KHggLSAxKSAvIEUpICsgMSA6IHg7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXHJcbiAgYXNpbmg6IGFzaW5oLFxyXG4gIC8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcclxuICBhdGFuaDogZnVuY3Rpb24gYXRhbmgoeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBsb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxyXG4gIGNicnQ6IGZ1bmN0aW9uIGNicnQoeCl7XHJcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcclxuICBjbHozMjogZnVuY3Rpb24gY2x6MzIoeCl7XHJcbiAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMxIC0gZmxvb3IobG9nKHggKyAwLjUpICogTWF0aC5MT0cyRSkgOiAzMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcclxuICBjb3NoOiBmdW5jdGlvbiBjb3NoKHgpe1xyXG4gICAgcmV0dXJuIChleHAoeCA9ICt4KSArIGV4cCgteCkpIC8gMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXHJcbiAgZXhwbTE6IGV4cG0xLFxyXG4gIC8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxyXG4gIGZyb3VuZDogZnVuY3Rpb24gZnJvdW5kKHgpe1xyXG4gICAgdmFyICRhYnMgID0gYWJzKHgpXHJcbiAgICAgICwgJHNpZ24gPSBzaWduKHgpXHJcbiAgICAgICwgYSwgcmVzdWx0O1xyXG4gICAgaWYoJGFicyA8IE1JTjMyKXJldHVybiAkc2lnbiAqIHJvdW5kVGllc1RvRXZlbigkYWJzIC8gTUlOMzIgLyBFUFNJTE9OMzIpICogTUlOMzIgKiBFUFNJTE9OMzI7XHJcbiAgICBhID0gKDEgKyBFUFNJTE9OMzIgLyBFUFNJTE9OKSAqICRhYnM7XHJcbiAgICByZXN1bHQgPSBhIC0gKGEgLSAkYWJzKTtcclxuICAgIGlmKHJlc3VsdCA+IE1BWDMyIHx8IHJlc3VsdCAhPSByZXN1bHQpcmV0dXJuICRzaWduICogSW5maW5pdHk7XHJcbiAgICByZXR1cm4gJHNpZ24gKiByZXN1bHQ7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcclxuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgICB2YXIgc3VtICA9IDBcclxuICAgICAgLCBsZW4xID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGxlbjIgPSBsZW4xXHJcbiAgICAgICwgYXJncyA9IEFycmF5KGxlbjEpXHJcbiAgICAgICwgbGFyZyA9IC1JbmZpbml0eVxyXG4gICAgICAsIGFyZztcclxuICAgIHdoaWxlKGxlbjEtLSl7XHJcbiAgICAgIGFyZyA9IGFyZ3NbbGVuMV0gPSArYXJndW1lbnRzW2xlbjFdO1xyXG4gICAgICBpZihhcmcgPT0gSW5maW5pdHkgfHwgYXJnID09IC1JbmZpbml0eSlyZXR1cm4gSW5maW5pdHk7XHJcbiAgICAgIGlmKGFyZyA+IGxhcmcpbGFyZyA9IGFyZztcclxuICAgIH1cclxuICAgIGxhcmcgPSBhcmcgfHwgMTtcclxuICAgIHdoaWxlKGxlbjItLSlzdW0gKz0gcG93KGFyZ3NbbGVuMl0gLyBsYXJnLCAyKTtcclxuICAgIHJldHVybiBsYXJnICogc3FydChzdW0pO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxyXG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSl7XHJcbiAgICB2YXIgVUludDE2ID0gMHhmZmZmXHJcbiAgICAgICwgeG4gPSAreFxyXG4gICAgICAsIHluID0gK3lcclxuICAgICAgLCB4bCA9IFVJbnQxNiAmIHhuXHJcbiAgICAgICwgeWwgPSBVSW50MTYgJiB5bjtcclxuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxyXG4gIGxvZzFwOiBmdW5jdGlvbiBsb2cxcCh4KXtcclxuICAgIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IGxvZygxICsgeCk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxyXG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KXtcclxuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMTA7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXHJcbiAgbG9nMjogZnVuY3Rpb24gbG9nMih4KXtcclxuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuICBzaWduOiBzaWduLFxyXG4gIC8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcclxuICBzaW5oOiBmdW5jdGlvbiBzaW5oKHgpe1xyXG4gICAgcmV0dXJuIGFicyh4ID0gK3gpIDwgMSA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoRSAvIDIpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxyXG4gIHRhbmg6IGZ1bmN0aW9uIHRhbmgoeCl7XHJcbiAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcclxuICAgICAgLCBiID0gZXhwbTEoLXgpO1xyXG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXHJcbiAgdHJ1bmM6IGZ1bmN0aW9uIHRydW5jKGl0KXtcclxuICAgIHJldHVybiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGlzT2JqZWN0ICAgPSAkLmlzT2JqZWN0XHJcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBOVU1CRVIgICAgID0gJ051bWJlcidcclxuICAsICROdW1iZXIgICAgPSAkLmdbTlVNQkVSXVxyXG4gICwgQmFzZSAgICAgICA9ICROdW1iZXJcclxuICAsIHByb3RvICAgICAgPSAkTnVtYmVyLnByb3RvdHlwZTtcclxuZnVuY3Rpb24gdG9QcmltaXRpdmUoaXQpe1xyXG4gIHZhciBmbiwgdmFsO1xyXG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgaWYoaXNGdW5jdGlvbihmbiA9IGl0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gbnVtYmVyXCIpO1xyXG59XHJcbmZ1bmN0aW9uIHRvTnVtYmVyKGl0KXtcclxuICBpZihpc09iamVjdChpdCkpaXQgPSB0b1ByaW1pdGl2ZShpdCk7XHJcbiAgaWYodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIgJiYgaXQuY2hhckNvZGVBdCgwKSA9PSA0OCl7XHJcbiAgICB2YXIgYmluYXJ5ID0gZmFsc2U7XHJcbiAgICBzd2l0Y2goaXQuY2hhckNvZGVBdCgxKSl7XHJcbiAgICAgIGNhc2UgNjYgOiBjYXNlIDk4ICA6IGJpbmFyeSA9IHRydWU7XHJcbiAgICAgIGNhc2UgNzkgOiBjYXNlIDExMSA6IHJldHVybiBwYXJzZUludChpdC5zbGljZSgyKSwgYmluYXJ5ID8gMiA6IDgpO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuICtpdDtcclxufVxyXG5pZigkLkZXICYmICEoJE51bWJlcignMG8xJykgJiYgJE51bWJlcignMGIxJykpKXtcclxuICAkTnVtYmVyID0gZnVuY3Rpb24gTnVtYmVyKGl0KXtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgJE51bWJlciA/IG5ldyBCYXNlKHRvTnVtYmVyKGl0KSkgOiB0b051bWJlcihpdCk7XHJcbiAgfTtcclxuICAkLmVhY2guY2FsbCgkLkRFU0MgPyAkLmdldE5hbWVzKEJhc2UpIDogKFxyXG4gICAgICAvLyBFUzM6XHJcbiAgICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcclxuICAgICAgLy8gRVM2IChpbiBjYXNlLCBpZiBtb2R1bGVzIHdpdGggRVM2IE51bWJlciBzdGF0aWNzIHJlcXVpcmVkIGJlZm9yZSk6XHJcbiAgICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXHJcbiAgICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xyXG4gICAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZigkLmhhcyhCYXNlLCBrZXkpICYmICEkLmhhcygkTnVtYmVyLCBrZXkpKXtcclxuICAgICAgICAkLnNldERlc2MoJE51bWJlciwga2V5LCAkLmdldERlc2MoQmFzZSwga2V5KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gICROdW1iZXIucHJvdG90eXBlID0gcHJvdG87XHJcbiAgcHJvdG8uY29uc3RydWN0b3IgPSAkTnVtYmVyO1xyXG4gICQuaGlkZSgkLmcsIE5VTUJFUiwgJE51bWJlcik7XHJcbn0iLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGFicyAgID0gTWF0aC5hYnNcclxuICAsIGZsb29yID0gTWF0aC5mbG9vclxyXG4gICwgX2lzRmluaXRlID0gJC5nLmlzRmluaXRlXHJcbiAgLCBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZjsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MTtcclxuZnVuY3Rpb24gaXNJbnRlZ2VyKGl0KXtcclxuICByZXR1cm4gISQuaXNPYmplY3QoaXQpICYmIF9pc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcclxufVxyXG4kZGVmKCRkZWYuUywgJ051bWJlcicsIHtcclxuICAvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxyXG4gIEVQU0lMT046IE1hdGgucG93KDIsIC01MiksXHJcbiAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcclxuICBpc0Zpbml0ZTogZnVuY3Rpb24gaXNGaW5pdGUoaXQpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXHJcbiAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuICBpc05hTjogZnVuY3Rpb24gaXNOYU4obnVtYmVyKXtcclxuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxyXG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKXtcclxuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxyXG4gIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXHJcbiAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcclxuICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXHJcbiAgcGFyc2VJbnQ6IHBhcnNlSW50XHJcbn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vJC5hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICBpczogZnVuY3Rpb24gaXMoeCwgeSl7XHJcbiAgICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxuICB9XHJcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldH0pOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XHJcbiAgLCB0b09iamVjdCA9ICQudG9PYmplY3Q7XHJcbmZ1bmN0aW9uIHdyYXBPYmplY3RNZXRob2QoTUVUSE9ELCBNT0RFKXtcclxuICB2YXIgZm4gID0gKCQuY29yZS5PYmplY3QgfHwge30pW01FVEhPRF0gfHwgT2JqZWN0W01FVEhPRF1cclxuICAgICwgZiAgID0gMFxyXG4gICAgLCBvICAgPSB7fTtcclxuICBvW01FVEhPRF0gPSBNT0RFID09IDEgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XHJcbiAgfSA6IE1PREUgPT0gMiA/IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xyXG4gIH0gOiBNT0RFID09IDMgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XHJcbiAgfSA6IE1PREUgPT0gNCA/IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcclxuICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XHJcbiAgfSA6IE1PREUgPT0gNSA/IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KXtcclxuICAgIHJldHVybiBmbihPYmplY3QoJC5hc3NlcnREZWZpbmVkKGl0KSkpO1xyXG4gIH0gOiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpKTtcclxuICB9O1xyXG4gIHRyeSB7XHJcbiAgICBmbigneicpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICBmID0gMTtcclxuICB9XHJcbiAgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiBmLCAnT2JqZWN0Jywgbyk7XHJcbn1cclxud3JhcE9iamVjdE1ldGhvZCgnZnJlZXplJywgMSk7XHJcbndyYXBPYmplY3RNZXRob2QoJ3NlYWwnLCAxKTtcclxud3JhcE9iamVjdE1ldGhvZCgncHJldmVudEV4dGVuc2lvbnMnLCAxKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNGcm96ZW4nLCAyKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNTZWFsZWQnLCAyKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNFeHRlbnNpYmxlJywgMyk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIDQpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdnZXRQcm90b3R5cGVPZicsIDUpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdrZXlzJyk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5TmFtZXMnKTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxyXG52YXIgJCAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgdG1wID0ge307XHJcbnRtcFtyZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xyXG5pZigkLkZXICYmIGNvZih0bXApICE9ICd6JykkLmhpZGUoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcclxuICByZXR1cm4gJ1tvYmplY3QgJyArIGNvZi5jbGFzc29mKHRoaXMpICsgJ10nO1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgY29mICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBhc3NlcnQgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcclxuICAsIHNldFByb3RvID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxyXG4gICwgc3BlY2llcyAgPSByZXF1aXJlKCcuLyQuc3BlY2llcycpXHJcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXHJcbiAgLCBSRUNPUkQgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdyZWNvcmQnKVxyXG4gICwgUFJPTUlTRSAgPSAnUHJvbWlzZSdcclxuICAsIGdsb2JhbCAgID0gJC5nXHJcbiAgLCBwcm9jZXNzICA9IGdsb2JhbC5wcm9jZXNzXHJcbiAgLCBhc2FwICAgICA9IHByb2Nlc3MgJiYgcHJvY2Vzcy5uZXh0VGljayB8fCByZXF1aXJlKCcuLyQudGFzaycpLnNldFxyXG4gICwgUCAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cclxuICAsIGlzRnVuY3Rpb24gICAgID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBpc09iamVjdCAgICAgICA9ICQuaXNPYmplY3RcclxuICAsIGFzc2VydEZ1bmN0aW9uID0gYXNzZXJ0LmZuXHJcbiAgLCBhc3NlcnRPYmplY3QgICA9IGFzc2VydC5vYmo7XHJcblxyXG52YXIgdXNlTmF0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgdGVzdCwgd29ya3MgPSBmYWxzZTtcclxuICBmdW5jdGlvbiBQMih4KXtcclxuICAgIHZhciBzZWxmID0gbmV3IFAoeCk7XHJcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbiAgfVxyXG4gIHRyeSB7XHJcbiAgICB3b3JrcyA9IGlzRnVuY3Rpb24oUCkgJiYgaXNGdW5jdGlvbihQLnJlc29sdmUpICYmIFAucmVzb2x2ZSh0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KSkgPT0gdGVzdDtcclxuICAgIHNldFByb3RvKFAyLCBQKTtcclxuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XHJcbiAgICAvLyBhY3R1YWwgRmlyZWZveCBoYXMgYnJva2VuIHN1YmNsYXNzIHN1cHBvcnQsIHRlc3QgdGhhdFxyXG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XHJcbiAgICAgIHdvcmtzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxyXG4gIHJldHVybiB3b3JrcztcclxufSgpO1xyXG5cclxuLy8gaGVscGVyc1xyXG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcclxuICB2YXIgUyA9IGFzc2VydE9iamVjdChDKVtTUEVDSUVTXTtcclxuICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcclxufVxyXG5mdW5jdGlvbiBpc1RoZW5hYmxlKGl0KXtcclxuICB2YXIgdGhlbjtcclxuICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XHJcbiAgcmV0dXJuIGlzRnVuY3Rpb24odGhlbikgPyB0aGVuIDogZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gbm90aWZ5KHJlY29yZCl7XHJcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XHJcbiAgaWYoY2hhaW4ubGVuZ3RoKWFzYXAoZnVuY3Rpb24oKXtcclxuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XHJcbiAgICAgICwgb2sgICAgPSByZWNvcmQucyA9PSAxXHJcbiAgICAgICwgaSAgICAgPSAwO1xyXG4gICAgZnVuY3Rpb24gcnVuKHJlYWN0KXtcclxuICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcclxuICAgICAgICAsIHJldCwgdGhlbjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZihjYil7XHJcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xyXG4gICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcclxuICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XHJcbiAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XHJcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcclxuICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcclxuICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlYWN0LnJlaihlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcclxuICAgIGNoYWluLmxlbmd0aCA9IDA7XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaXNVbmhhbmRsZWQocHJvbWlzZSl7XHJcbiAgdmFyIHJlY29yZCA9IHByb21pc2VbUkVDT1JEXVxyXG4gICAgLCBjaGFpbiAgPSByZWNvcmQuYSB8fCByZWNvcmQuY1xyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIHJlYWN0O1xyXG4gIGlmKHJlY29yZC5oKXJldHVybiBmYWxzZTtcclxuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcclxuICAgIHJlYWN0ID0gY2hhaW5baSsrXTtcclxuICAgIGlmKHJlYWN0LmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0LlApKXJldHVybiBmYWxzZTtcclxuICB9IHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uICRyZWplY3QodmFsdWUpe1xyXG4gIHZhciByZWNvcmQgPSB0aGlzXHJcbiAgICAsIHByb21pc2U7XHJcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gIHJlY29yZC5kID0gdHJ1ZTtcclxuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxyXG4gIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgcmVjb3JkLnMgPSAyO1xyXG4gIHJlY29yZC5hID0gcmVjb3JkLmMuc2xpY2UoKTtcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBhc2FwKGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UgPSByZWNvcmQucCkpe1xyXG4gICAgICAgIGlmKGNvZihwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xyXG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmKGdsb2JhbC5jb25zb2xlICYmIGlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpe1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZWNvcmQuYSA9IHVuZGVmaW5lZDtcclxuICAgIH0pO1xyXG4gIH0sIDEpO1xyXG4gIG5vdGlmeShyZWNvcmQpO1xyXG59XHJcbmZ1bmN0aW9uICRyZXNvbHZlKHZhbHVlKXtcclxuICB2YXIgcmVjb3JkID0gdGhpc1xyXG4gICAgLCB0aGVuLCB3cmFwcGVyO1xyXG4gIGlmKHJlY29yZC5kKXJldHVybjtcclxuICByZWNvcmQuZCA9IHRydWU7XHJcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICB0cnkge1xyXG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcclxuICAgICAgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxyXG4gICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xyXG4gICAgICByZWNvcmQucyA9IDE7XHJcbiAgICAgIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2goZXJyKXtcclxuICAgICRyZWplY3QuY2FsbCh3cmFwcGVyIHx8IHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZXJyKTsgLy8gd3JhcFxyXG4gIH1cclxufVxyXG5cclxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcclxuaWYoIXVzZU5hdGl2ZSl7XHJcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcclxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XHJcbiAgICBhc3NlcnRGdW5jdGlvbihleGVjdXRvcik7XHJcbiAgICB2YXIgcmVjb3JkID0ge1xyXG4gICAgICBwOiBhc3NlcnQuaW5zdCh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgLy8gPC0gcHJvbWlzZVxyXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXHJcbiAgICAgIGE6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xyXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcclxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcclxuICAgICAgdjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgIGg6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxyXG4gICAgfTtcclxuICAgICQuaGlkZSh0aGlzLCBSRUNPUkQsIHJlY29yZCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHJlY29yZCwgMSksIGN0eCgkcmVqZWN0LCByZWNvcmQsIDEpKTtcclxuICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcclxuICAgIH1cclxuICB9O1xyXG4gICQubWl4KFAucHJvdG90eXBlLCB7XHJcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxyXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XHJcbiAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKS5jb25zdHJ1Y3RvcilbU1BFQ0lFU107XHJcbiAgICAgIHZhciByZWFjdCA9IHtcclxuICAgICAgICBvazogICBpc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogdHJ1ZSxcclxuICAgICAgICBmYWlsOiBpc0Z1bmN0aW9uKG9uUmVqZWN0ZWQpICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgdmFyIHByb21pc2UgPSByZWFjdC5QID0gbmV3IChTICE9IHVuZGVmaW5lZCA/IFMgOiBQKShmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzKTtcclxuICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWopO1xyXG4gICAgICB9KTtcclxuICAgICAgdmFyIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcclxuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XHJcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3QpO1xyXG4gICAgICByZWNvcmQucyAmJiBub3RpZnkocmVjb3JkKTtcclxuICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9LFxyXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcclxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xyXG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIGV4cG9ydFxyXG4kZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqICF1c2VOYXRpdmUsIHtQcm9taXNlOiBQfSk7XHJcbmNvZi5zZXQoUCwgUFJPTUlTRSk7XHJcbnNwZWNpZXMoUCk7XHJcbnNwZWNpZXMoJC5jb3JlW1BST01JU0VdKTsgLy8gZm9yIHdyYXBwZXJcclxuXHJcbi8vIHN0YXRpY3NcclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCBQUk9NSVNFLCB7XHJcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcclxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcclxuICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgIHJlaihyKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXHJcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcclxuICAgIHJldHVybiBpc09iamVjdCh4KSAmJiBSRUNPUkQgaW4geCAmJiAkLmdldFByb3RvKHgpID09PSB0aGlzLnByb3RvdHlwZVxyXG4gICAgICA/IHggOiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgIHJlcyh4KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59KTtcclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhKHVzZU5hdGl2ZSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcclxuICBQLmFsbChpdGVyKVsnY2F0Y2gnXShmdW5jdGlvbigpe30pO1xyXG59KSksIFBST01JU0UsIHtcclxuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcclxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XHJcbiAgICB2YXIgQyAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcclxuICAgICAgLCB2YWx1ZXMgPSBbXTtcclxuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XHJcbiAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoXHJcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xyXG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XHJcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlcyhyZXN1bHRzKTtcclxuICAgICAgICB9LCByZWopO1xyXG4gICAgICB9KTtcclxuICAgICAgZWxzZSByZXMocmVzdWx0cyk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcclxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcclxuICAgIHZhciBDID0gZ2V0Q29uc3RydWN0b3IodGhpcyk7XHJcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xyXG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xyXG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKHJlcywgcmVqKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pOyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBzZXRQcm90byAgPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJylcclxuICAsICRpdGVyICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgSVRFUiAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgc3RlcCAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XHJcbiAgLCBnZXRQcm90byAgPSAkLmdldFByb3RvXHJcbiAgLCAkUmVmbGVjdCAgPSAkLmcuUmVmbGVjdFxyXG4gICwgX2FwcGx5ICAgID0gRnVuY3Rpb24uYXBwbHlcclxuICAsIGFzc2VydE9iamVjdCA9IGFzc2VydC5vYmpcclxuICAsIF9pc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8ICQuaXNPYmplY3RcclxuICAsIF9wcmV2ZW50RXh0ZW5zaW9ucyA9IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyB8fCAkLml0XHJcbiAgLy8gSUUgVFAgaGFzIGJyb2tlbiBSZWZsZWN0LmVudW1lcmF0ZVxyXG4gICwgYnVnZ3lFbnVtZXJhdGUgPSAhKCRSZWZsZWN0ICYmICRSZWZsZWN0LmVudW1lcmF0ZSAmJiBJVEVSQVRPUiBpbiAkUmVmbGVjdC5lbnVtZXJhdGUoe30pKTtcclxuXHJcbmZ1bmN0aW9uIEVudW1lcmF0ZShpdGVyYXRlZCl7XHJcbiAgJC5zZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiB1bmRlZmluZWQsIGk6IDB9KTtcclxufVxyXG4kaXRlci5jcmVhdGUoRW51bWVyYXRlLCAnT2JqZWN0JywgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICwga2V5cyA9IGl0ZXIua1xyXG4gICAgLCBrZXk7XHJcbiAgaWYoa2V5cyA9PSB1bmRlZmluZWQpe1xyXG4gICAgaXRlci5rID0ga2V5cyA9IFtdO1xyXG4gICAgZm9yKGtleSBpbiBpdGVyLm8pa2V5cy5wdXNoKGtleSk7XHJcbiAgfVxyXG4gIGRvIHtcclxuICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcclxuICB9IHdoaWxlKCEoKGtleSA9IGtleXNbaXRlci5pKytdKSBpbiBpdGVyLm8pKTtcclxuICByZXR1cm4gc3RlcCgwLCBrZXkpO1xyXG59KTtcclxuXHJcbnZhciByZWZsZWN0ID0ge1xyXG4gIC8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxyXG4gIGFwcGx5OiBmdW5jdGlvbiBhcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCl7XHJcbiAgICByZXR1cm4gX2FwcGx5LmNhbGwodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxyXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCAvKiwgbmV3VGFyZ2V0Ki8pe1xyXG4gICAgdmFyIHByb3RvICAgID0gYXNzZXJ0LmZuKGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdKS5wcm90b3R5cGVcclxuICAgICAgLCBpbnN0YW5jZSA9ICQuY3JlYXRlKGlzT2JqZWN0KHByb3RvKSA/IHByb3RvIDogT2JqZWN0LnByb3RvdHlwZSlcclxuICAgICAgLCByZXN1bHQgICA9IF9hcHBseS5jYWxsKHRhcmdldCwgaW5zdGFuY2UsIGFyZ3VtZW50c0xpc3QpO1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcclxuICB9LFxyXG4gIC8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXHJcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KHRhcmdldCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAkLnNldERlc2ModGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaChlKXtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICB2YXIgZGVzYyA9ICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xyXG4gICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcclxuICB9LFxyXG4gIC8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcclxuICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xyXG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cclxuICAgICAgLCBkZXNjID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSksIHByb3RvO1xyXG4gICAgaWYoZGVzYylyZXR1cm4gJC5oYXMoZGVzYywgJ3ZhbHVlJylcclxuICAgICAgPyBkZXNjLnZhbHVlXHJcbiAgICAgIDogZGVzYy5nZXQgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgICAgOiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcclxuICAgIHJldHVybiBpc09iamVjdChwcm90byA9IGdldFByb3RvKHRhcmdldCkpXHJcbiAgICAgID8gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpXHJcbiAgICAgIDogdW5kZWZpbmVkO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICByZXR1cm4gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgfSxcclxuICAvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXHJcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKHRhcmdldCl7XHJcbiAgICByZXR1cm4gZ2V0UHJvdG8oYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xyXG4gIH0sXHJcbiAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXHJcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUodGFyZ2V0KXtcclxuICAgIHJldHVybiBfaXNFeHRlbnNpYmxlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICB9LFxyXG4gIC8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcclxuICBvd25LZXlzOiByZXF1aXJlKCcuLyQub3duLWtleXMnKSxcclxuICAvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxyXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KHRhcmdldCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBfcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoKGUpe1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxyXG4gIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxyXG4gICAgICAsIG93bkRlc2MgID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcclxuICAgICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xyXG4gICAgaWYoIW93bkRlc2Mpe1xyXG4gICAgICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvKHRhcmdldCkpKXtcclxuICAgICAgICByZXR1cm4gc2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIG93bkRlc2MgPSAkLmRlc2MoMCk7XHJcbiAgICB9XHJcbiAgICBpZigkLmhhcyhvd25EZXNjLCAndmFsdWUnKSl7XHJcbiAgICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSAkLmdldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCAkLmRlc2MoMCk7XHJcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XHJcbiAgICAgICQuc2V0RGVzYyhyZWNlaXZlciwgcHJvcGVydHlLZXksIGV4aXN0aW5nRGVzY3JpcHRvcik7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XHJcbiAgfVxyXG59O1xyXG4vLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcclxuaWYoc2V0UHJvdG8pcmVmbGVjdC5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pe1xyXG4gIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xyXG4gIHRyeSB7XHJcbiAgICBzZXRQcm90by5zZXQodGFyZ2V0LCBwcm90byk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbiRkZWYoJGRlZi5HLCB7UmVmbGVjdDoge319KTtcclxuXHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogYnVnZ3lFbnVtZXJhdGUsICdSZWZsZWN0Jywge1xyXG4gIC8vIDI2LjEuNSBSZWZsZWN0LmVudW1lcmF0ZSh0YXJnZXQpXHJcbiAgZW51bWVyYXRlOiBmdW5jdGlvbiBlbnVtZXJhdGUodGFyZ2V0KXtcclxuICAgIHJldHVybiBuZXcgRW51bWVyYXRlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICB9XHJcbn0pO1xyXG5cclxuJGRlZigkZGVmLlMsICdSZWZsZWN0JywgcmVmbGVjdCk7IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJFJlZ0V4cCA9ICQuZy5SZWdFeHBcclxuICAsIEJhc2UgICAgPSAkUmVnRXhwXHJcbiAgLCBwcm90byAgID0gJFJlZ0V4cC5wcm90b3R5cGVcclxuICAsIHJlICAgICAgPSAvYS9nXHJcbiAgLy8gXCJuZXdcIiBjcmVhdGVzIGEgbmV3IG9iamVjdFxyXG4gICwgQ09SUkVDVF9ORVcgPSBuZXcgJFJlZ0V4cChyZSkgIT09IHJlXHJcbiAgLy8gUmVnRXhwIGFsbG93cyBhIHJlZ2V4IHdpdGggZmxhZ3MgYXMgdGhlIHBhdHRlcm5cclxuICAsIEFMTE9XU19SRV9XSVRIX0ZMQUdTID0gZnVuY3Rpb24oKXtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiAkUmVnRXhwKHJlLCAnaScpID09ICcvYS9pJztcclxuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cclxuICB9KCk7XHJcbmlmKCQuRlcgJiYgJC5ERVNDKXtcclxuICBpZighQ09SUkVDVF9ORVcgfHwgIUFMTE9XU19SRV9XSVRIX0ZMQUdTKXtcclxuICAgICRSZWdFeHAgPSBmdW5jdGlvbiBSZWdFeHAocGF0dGVybiwgZmxhZ3Mpe1xyXG4gICAgICB2YXIgcGF0dGVybklzUmVnRXhwICA9IGNvZihwYXR0ZXJuKSA9PSAnUmVnRXhwJ1xyXG4gICAgICAgICwgZmxhZ3NJc1VuZGVmaW5lZCA9IGZsYWdzID09PSB1bmRlZmluZWQ7XHJcbiAgICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mICRSZWdFeHApICYmIHBhdHRlcm5Jc1JlZ0V4cCAmJiBmbGFnc0lzVW5kZWZpbmVkKXJldHVybiBwYXR0ZXJuO1xyXG4gICAgICByZXR1cm4gQ09SUkVDVF9ORVdcclxuICAgICAgICA/IG5ldyBCYXNlKHBhdHRlcm5Jc1JlZ0V4cCAmJiAhZmxhZ3NJc1VuZGVmaW5lZCA/IHBhdHRlcm4uc291cmNlIDogcGF0dGVybiwgZmxhZ3MpXHJcbiAgICAgICAgOiBuZXcgQmFzZShwYXR0ZXJuSXNSZWdFeHAgPyBwYXR0ZXJuLnNvdXJjZSA6IHBhdHRlcm5cclxuICAgICAgICAgICwgcGF0dGVybklzUmVnRXhwICYmIGZsYWdzSXNVbmRlZmluZWQgPyBwYXR0ZXJuLmZsYWdzIDogZmxhZ3MpO1xyXG4gICAgfTtcclxuICAgICQuZWFjaC5jYWxsKCQuZ2V0TmFtZXMoQmFzZSksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGtleSBpbiAkUmVnRXhwIHx8ICQuc2V0RGVzYygkUmVnRXhwLCBrZXksIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gQmFzZVtrZXldOyB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24oaXQpeyBCYXNlW2tleV0gPSBpdDsgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcHJvdG8uY29uc3RydWN0b3IgPSAkUmVnRXhwO1xyXG4gICAgJFJlZ0V4cC5wcm90b3R5cGUgPSBwcm90bztcclxuICAgICQuaGlkZSgkLmcsICdSZWdFeHAnLCAkUmVnRXhwKTtcclxuICB9XHJcbiAgLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxyXG4gIGlmKC8uL2cuZmxhZ3MgIT0gJ2cnKSQuc2V0RGVzYyhwcm90bywgJ2ZsYWdzJywge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvXi4qXFwvKFxcdyopJC8sICckMScpXHJcbiAgfSk7XHJcbn1cclxucmVxdWlyZSgnLi8kLnNwZWNpZXMnKSgkUmVnRXhwKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcclxuXHJcbi8vIDIzLjIgU2V0IE9iamVjdHNcclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnU2V0Jywge1xyXG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxyXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcclxuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcclxuICB9XHJcbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKShmYWxzZSk7XHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxyXG4gIGNvZGVQb2ludEF0OiBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3Mpe1xyXG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCB0b0xlbmd0aCA9ICQudG9MZW5ndGg7XHJcblxyXG4vLyBzaG91bGQgdGhyb3cgZXJyb3Igb24gcmVnZXhcclxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAhcmVxdWlyZSgnLi8kLnRocm93cycpKGZ1bmN0aW9uKCl7ICdxJy5lbmRzV2l0aCgvLi8pOyB9KSwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXHJcbiAgZW5kc1dpdGg6IGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKXtcclxuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xyXG4gICAgdmFyIHRoYXQgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICwgbGVuID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpXHJcbiAgICAgICwgZW5kID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcclxuICAgIHNlYXJjaFN0cmluZyArPSAnJztcclxuICAgIHJldHVybiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaFN0cmluZy5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaFN0cmluZztcclxuICB9XHJcbn0pOyIsInZhciAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCB0b0luZGV4ID0gcmVxdWlyZSgnLi8kJykudG9JbmRleFxyXG4gICwgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZVxyXG4gICwgJGZyb21Db2RlUG9pbnQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludDtcclxuXHJcbi8vIGxlbmd0aCBzaG91bGQgYmUgMSwgb2xkIEZGIHByb2JsZW1cclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoISEkZnJvbUNvZGVQb2ludCAmJiAkZnJvbUNvZGVQb2ludC5sZW5ndGggIT0gMSksICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcclxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgICB2YXIgcmVzID0gW11cclxuICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgaSAgID0gMFxyXG4gICAgICAsIGNvZGU7XHJcbiAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcclxuICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XHJcbiAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXHJcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcclxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXHJcbiAgICAgICk7XHJcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxyXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICAgIHJldHVybiAhIX5TdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKS5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKTtcclxuICB9XHJcbn0pOyIsInZhciBzZXQgICA9IHJlcXVpcmUoJy4vJCcpLnNldFxyXG4gICwgJGF0ICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSlcclxuICAsIElURVIgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwICA9ICRpdGVyLnN0ZXA7XHJcblxyXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcclxuICBzZXQodGhpcywgSVRFUiwge286IFN0cmluZyhpdGVyYXRlZCksIGk6IDB9KTtcclxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG59LCBmdW5jdGlvbigpe1xyXG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICwgaW5kZXggPSBpdGVyLmlcclxuICAgICwgcG9pbnQ7XHJcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHN0ZXAoMSk7XHJcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xyXG4gIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XHJcbiAgcmV0dXJuIHN0ZXAoMCwgcG9pbnQpO1xyXG59KTsiLCJ2YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG5cclxuJGRlZigkZGVmLlMsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcclxuICByYXc6IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSl7XHJcbiAgICB2YXIgdHBsID0gJC50b09iamVjdChjYWxsU2l0ZS5yYXcpXHJcbiAgICAgICwgbGVuID0gJC50b0xlbmd0aCh0cGwubGVuZ3RoKVxyXG4gICAgICAsIHNsbiA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCByZXMgPSBbXVxyXG4gICAgICAsIGkgICA9IDA7XHJcbiAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgcmVzLnB1c2goU3RyaW5nKHRwbFtpKytdKSk7XHJcbiAgICAgIGlmKGkgPCBzbG4pcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gIH1cclxufSk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXHJcbiAgcmVwZWF0OiByZXF1aXJlKCcuLyQuc3RyaW5nLXJlcGVhdCcpXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuXHJcbi8vIHNob3VsZCB0aHJvdyBlcnJvciBvbiByZWdleFxyXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgJ3EnLnN0YXJ0c1dpdGgoLy4vKTsgfSksICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcclxuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xyXG4gICAgdmFyIHRoYXQgID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBpbmRleCA9ICQudG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xyXG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2V0VGFnICAgPSByZXF1aXJlKCcuLyQuY29mJykuc2V0XHJcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxyXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcclxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXHJcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqXHJcbiAgLCBoYXMgICAgICA9ICQuaGFzXHJcbiAgLCAkY3JlYXRlICA9ICQuY3JlYXRlXHJcbiAgLCBnZXREZXNjICA9ICQuZ2V0RGVzY1xyXG4gICwgc2V0RGVzYyAgPSAkLnNldERlc2NcclxuICAsIGRlc2MgICAgID0gJC5kZXNjXHJcbiAgLCBnZXROYW1lcyA9ICQuZ2V0TmFtZXNcclxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxyXG4gICwgJFN5bWJvbCAgPSAkLmcuU3ltYm9sXHJcbiAgLCBzZXR0ZXIgICA9IGZhbHNlXHJcbiAgLCBUQUcgICAgICA9IHVpZCgndGFnJylcclxuICAsIEhJRERFTiAgID0gdWlkKCdoaWRkZW4nKVxyXG4gICwgU3ltYm9sUmVnaXN0cnkgPSB7fVxyXG4gICwgQWxsU3ltYm9scyA9IHt9XHJcbiAgLCB1c2VOYXRpdmUgPSAkLmlzRnVuY3Rpb24oJFN5bWJvbCk7XHJcblxyXG5mdW5jdGlvbiB3cmFwKHRhZyl7XHJcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCRjcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XHJcbiAgJC5ERVNDICYmIHNldHRlciAmJiBzZXREZXNjKE9iamVjdC5wcm90b3R5cGUsIHRhZywge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcclxuICAgICAgc2V0RGVzYyh0aGlzLCB0YWcsIGRlc2MoMSwgdmFsdWUpKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gc3ltO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcclxuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcclxuICAgIGlmKCFELmVudW1lcmFibGUpe1xyXG4gICAgICBpZighaGFzKGl0LCBISURERU4pKXNldERlc2MoaXQsIEhJRERFTiwgZGVzYygxLCB7fSkpO1xyXG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcclxuICAgICAgRC5lbnVtZXJhYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcclxuICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvT2JqZWN0KFApKVxyXG4gICAgLCBpICAgID0gMFxyXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGwgPiBpKWRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XHJcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/ICRjcmVhdGUoaXQpIDogZGVmaW5lUHJvcGVydGllcygkY3JlYXRlKGl0KSwgUCk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xyXG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvT2JqZWN0KGl0KSwga2V5KTtcclxuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcclxuICByZXR1cm4gRDtcclxufVxyXG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcclxuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKVxyXG4gICAgLCByZXN1bHQgPSBbXVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIGtleTtcclxuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcclxuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKVxyXG4gICAgLCByZXN1bHQgPSBbXVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIGtleTtcclxuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxyXG5pZighdXNlTmF0aXZlKXtcclxuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKXtcclxuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICByZXR1cm4gd3JhcCh1aWQoZGVzY3JpcHRpb24pKTtcclxuICB9O1xyXG4gICQuaGlkZSgkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW1RBR107XHJcbiAgfSk7XHJcblxyXG4gICQuY3JlYXRlICAgICA9IGNyZWF0ZTtcclxuICAkLnNldERlc2MgICAgPSBkZWZpbmVQcm9wZXJ0eTtcclxuICAkLmdldERlc2MgICAgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XHJcbiAgJC5zZXREZXNjcyAgID0gZGVmaW5lUHJvcGVydGllcztcclxuICAkLmdldE5hbWVzICAgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzO1xyXG4gICQuZ2V0U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcclxufVxyXG5cclxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XHJcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXHJcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXHJcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxyXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XHJcbiAgfSxcclxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcclxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xyXG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xyXG4gIH0sXHJcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxyXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cclxufTtcclxuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXHJcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcclxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXHJcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxyXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxyXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXHJcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xyXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XHJcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcclxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xyXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXHJcbiQuZWFjaC5jYWxsKChcclxuICAgICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXHJcbiAgICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcclxuICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBzeW0gPSByZXF1aXJlKCcuLyQud2tzJykoaXQpO1xyXG4gICAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XHJcbiAgfVxyXG4pO1xyXG5cclxuc2V0dGVyID0gdHJ1ZTtcclxuXHJcbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiAkU3ltYm9sfSk7XHJcblxyXG4kZGVmKCRkZWYuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xyXG5cclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCAnT2JqZWN0Jywge1xyXG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcclxuICBjcmVhdGU6IGNyZWF0ZSxcclxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcclxuICBkZWZpbmVQcm9wZXJ0eTogZGVmaW5lUHJvcGVydHksXHJcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcclxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzLFxyXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcclxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcclxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGdldE93blByb3BlcnR5TmFtZXMsXHJcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxyXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogZ2V0T3duUHJvcGVydHlTeW1ib2xzXHJcbn0pO1xyXG5cclxuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxyXG5zZXRUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xyXG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXHJcbnNldFRhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xyXG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxyXG5zZXRUYWcoJC5nLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHdlYWsgICAgICA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKVxyXG4gICwgbGVha1N0b3JlID0gd2Vhay5sZWFrU3RvcmVcclxuICAsIElEICAgICAgICA9IHdlYWsuSURcclxuICAsIFdFQUsgICAgICA9IHdlYWsuV0VBS1xyXG4gICwgaGFzICAgICAgID0gJC5oYXNcclxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcclxuICAsIGlzRnJvemVuICA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXHJcbiAgLCB0bXAgICAgICAgPSB7fTtcclxuXHJcbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXHJcbnZhciBXZWFrTWFwID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha01hcCcsIHtcclxuICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XHJcbiAgICBpZihpc09iamVjdChrZXkpKXtcclxuICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmdldChrZXkpO1xyXG4gICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbSURdXTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIGtleSwgdmFsdWUpO1xyXG4gIH1cclxufSwgd2VhaywgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XHJcbmlmKCQuRlcgJiYgbmV3IFdlYWtNYXAoKS5zZXQoKE9iamVjdC5mcmVlemUgfHwgT2JqZWN0KSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcclxuICAkLmVhY2guY2FsbChbJ2RlbGV0ZScsICdoYXMnLCAnZ2V0JywgJ3NldCddLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgdmFyIG1ldGhvZCA9IFdlYWtNYXAucHJvdG90eXBlW2tleV07XHJcbiAgICBXZWFrTWFwLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGxlYWt5IG1hcFxyXG4gICAgICBpZihpc09iamVjdChhKSAmJiBpc0Zyb3plbihhKSl7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxlYWtTdG9yZSh0aGlzKVtrZXldKGEsIGIpO1xyXG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xyXG4gICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcclxuICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgd2VhayA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKTtcclxuXHJcbi8vIDIzLjQgV2Vha1NldCBPYmplY3RzXHJcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtTZXQnLCB7XHJcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxyXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcclxuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgfVxyXG59LCB3ZWFrLCBmYWxzZSwgdHJ1ZSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXHJcbnZhciAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRpbmNsdWRlcyA9IHJlcXVpcmUoJy4vJC5hcnJheS1pbmNsdWRlcycpKHRydWUpO1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XHJcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHNbMV0pO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2luY2x1ZGVzJyk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxyXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpOyIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vOTM1Mzc4MVxyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBvd25LZXlzID0gcmVxdWlyZSgnLi8kLm93bi1rZXlzJyk7XHJcblxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCl7XHJcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXHJcbiAgICAgICwgcmVzdWx0ID0ge307XHJcbiAgICAkLmVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAkLnNldERlc2MocmVzdWx0LCBrZXksICQuZGVzYygwLCAkLmdldERlc2MoTywga2V5KSkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcclxuICAgICAgLCBrZXk7XHJcbiAgICBpZihpc0VudHJpZXMpd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBba2V5ID0ga2V5c1tpKytdLCBPW2tleV1dO1xyXG4gICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICB2YWx1ZXM6ICBjcmVhdGVPYmplY3RUb0FycmF5KGZhbHNlKSxcclxuICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXHJcbn0pOyIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2thbmdheC85Njk4MTAwXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ1JlZ0V4cCcsIHtcclxuICBlc2NhcGU6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC8oW1xcXFxcXC1bXFxde30oKSorPy4sXiR8XSkvZywgJ1xcXFwkMScsIHRydWUpXHJcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XHJcbid1c2Ugc3RyaWN0JztcclxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIGF0OiBmdW5jdGlvbiBhdChwb3Mpe1xyXG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJHBhZCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcGFkJyk7XHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIGxwYWQ6IGZ1bmN0aW9uIGxwYWQobil7XHJcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBuLCBhcmd1bWVudHNbMV0sIHRydWUpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJHBhZCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcGFkJyk7XHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIHJwYWQ6IGZ1bmN0aW9uIHJwYWQobil7XHJcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBuLCBhcmd1bWVudHNbMV0sIGZhbHNlKTtcclxuICB9XHJcbn0pOyIsIi8vIEphdmFTY3JpcHQgMS42IC8gU3RyYXdtYW4gYXJyYXkgc3RhdGljcyBzaGltXHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRBcnJheSAgPSAkLmNvcmUuQXJyYXkgfHwgQXJyYXlcclxuICAsIHN0YXRpY3MgPSB7fTtcclxuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xyXG4gICQuZWFjaC5jYWxsKGtleXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmKGxlbmd0aCA9PSB1bmRlZmluZWQgJiYga2V5IGluICRBcnJheSlzdGF0aWNzW2tleV0gPSAkQXJyYXlba2V5XTtcclxuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xyXG4gIH0pO1xyXG59XHJcbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcclxuc2V0U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xyXG5zZXRTdGF0aWNzKCdqb2luLHNsaWNlLGNvbmNhdCxwdXNoLHNwbGljZSx1bnNoaWZ0LHNvcnQsbGFzdEluZGV4T2YsJyArXHJcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xyXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywgc3RhdGljcyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcclxudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcclxuICAsIElURVJBVE9SICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXHJcbiAgLCBBcnJheVZhbHVlcyA9IEl0ZXJhdG9ycy5BcnJheVxyXG4gICwgTm9kZUxpc3QgICAgPSAkLmcuTm9kZUxpc3Q7XHJcbmlmKCQuRlcgJiYgTm9kZUxpc3QgJiYgIShJVEVSQVRPUiBpbiBOb2RlTGlzdC5wcm90b3R5cGUpKXtcclxuICAkLmhpZGUoTm9kZUxpc3QucHJvdG90eXBlLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xyXG59XHJcbkl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEFycmF5VmFsdWVzOyIsInZhciAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJHRhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpO1xyXG4kZGVmKCRkZWYuRyArICRkZWYuQiwge1xyXG4gIHNldEltbWVkaWF0ZTogICAkdGFzay5zZXQsXHJcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXHJcbn0pOyIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGludm9rZSAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxyXG4gICwgcGFydGlhbCAgID0gcmVxdWlyZSgnLi8kLnBhcnRpYWwnKVxyXG4gICwgbmF2aWdhdG9yID0gJC5nLm5hdmlnYXRvclxyXG4gICwgTVNJRSAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xyXG5mdW5jdGlvbiB3cmFwKHNldCl7XHJcbiAgcmV0dXJuIE1TSUUgPyBmdW5jdGlvbihmbiwgdGltZSAvKiwgLi4uYXJncyAqLyl7XHJcbiAgICByZXR1cm4gc2V0KGludm9rZShcclxuICAgICAgcGFydGlhbCxcclxuICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxyXG4gICAgICAkLmlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbilcclxuICAgICksIHRpbWUpO1xyXG4gIH0gOiBzZXQ7XHJcbn1cclxuJGRlZigkZGVmLkcgKyAkZGVmLkIgKyAkZGVmLkYgKiBNU0lFLCB7XHJcbiAgc2V0VGltZW91dDogIHdyYXAoJC5nLnNldFRpbWVvdXQpLFxyXG4gIHNldEludGVydmFsOiB3cmFwKCQuZy5zZXRJbnRlcnZhbClcclxufSk7IiwicmVxdWlyZSgnLi9tb2R1bGVzL2VzNScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuaXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5mdW5jdGlvbi5oYXMtaW5zdGFuY2UnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3InKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJhdycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkub2YnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbGwnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnByb21pc2UnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXAnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LndlYWstc2V0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmxwYWQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcucnBhZCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnJlZ2V4cC5lc2NhcGUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi50aW1lcnMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5pbW1lZGlhdGUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL21vZHVsZXMvJCcpLmNvcmU7XHJcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID1cbiAgICB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKFxuICAgICAgaW5uZXJGbiwgc2VsZiB8fCBudWxsLFxuICAgICAgbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pXG4gICAgKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW5lcmF0b3IgPSB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KTtcbiAgICAgIHZhciBjYWxsTmV4dCA9IHN0ZXAuYmluZChnZW5lcmF0b3IsIFwibmV4dFwiKTtcbiAgICAgIHZhciBjYWxsVGhyb3cgPSBzdGVwLmJpbmQoZ2VuZXJhdG9yLCBcInRocm93XCIpO1xuXG4gICAgICBmdW5jdGlvbiBzdGVwKG1ldGhvZCwgYXJnKSB7XG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICByZXNvbHZlKGluZm8udmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpbmZvLnZhbHVlKS50aGVuKGNhbGxOZXh0LCBjYWxsVGhyb3cpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbGxOZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIgfHxcbiAgICAgICAgICAgICAgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiICYmIGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIC8vIEEgcmV0dXJuIG9yIHRocm93ICh3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gdGhyb3dcbiAgICAgICAgICAgIC8vIG1ldGhvZCkgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICAgIHZhciByZXR1cm5NZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChyZXR1cm5NZXRob2QpIHtcbiAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHJldHVybk1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJldHVybiBtZXRob2QgdGhyZXcgYW4gZXhjZXB0aW9uLCBsZXQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGV4Y2VwdGlvbiBwcmV2YWlsIG92ZXIgdGhlIG9yaWdpbmFsIHJldHVybiBvciB0aHJvdy5cbiAgICAgICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIG91dGVyIHJldHVybiwgbm93IHRoYXQgdGhlIGRlbGVnYXRlXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdG9yIGhhcyBiZWVuIHRlcm1pbmF0ZWQuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0sXG4gICAgICAgICAgICBkZWxlZ2F0ZS5pdGVyYXRvcixcbiAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWxlZ2F0ZSBnZW5lcmF0b3IgcmFuIGFuZCBoYW5kbGVkIGl0cyBvd24gZXhjZXB0aW9ucyBzb1xuICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCB0aGUgbWV0aG9kIHdhcywgd2UgY29udGludWUgYXMgaWYgaXQgaXNcbiAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29udGV4dC5zZW50O1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC5kZWxlZ2F0ZSAmJiBtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZGVmaW5lR2VuZXJhdG9yTWV0aG9kKG1ldGhvZCkge1xuICAgIEdwW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgIH07XG4gIH1cbiAgZGVmaW5lR2VuZXJhdG9yTWV0aG9kKFwibmV4dFwiKTtcbiAgZGVmaW5lR2VuZXJhdG9yTWV0aG9kKFwidGhyb3dcIik7XG4gIGRlZmluZUdlbmVyYXRvck1ldGhvZChcInJldHVyblwiKTtcblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgdGhpcy5zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIC8vIFByZS1pbml0aWFsaXplIGF0IGxlYXN0IDIwIHRlbXBvcmFyeSB2YXJpYWJsZXMgdG8gZW5hYmxlIGhpZGRlblxuICAgICAgLy8gY2xhc3Mgb3B0aW1pemF0aW9ucyBmb3Igc2ltcGxlIGdlbmVyYXRvcnMuXG4gICAgICBmb3IgKHZhciB0ZW1wSW5kZXggPSAwLCB0ZW1wTmFtZTtcbiAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgdGVtcE5hbWUgPSBcInRcIiArIHRlbXBJbmRleCkgfHwgdGVtcEluZGV4IDwgMjA7XG4gICAgICAgICAgICsrdGVtcEluZGV4KSB7XG4gICAgICAgIHRoaXNbdGVtcE5hbWVdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuICAvLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3RcbiAgLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvYmFiZWwvcG9seWZpbGxcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1jb3JlL3BvbHlmaWxsXCIpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdGh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ub2RlLWd3MlxyXG4qICAgaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6TWFpblxyXG4qXHJcblxyXG4qL1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cdGNvbG9yczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbG9ycy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbG9yc1xyXG5cdGd1aWxkRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2d1aWxkX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9ndWlsZF9kZXRhaWxzXHJcblxyXG5cdGl0ZW1zOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvaXRlbXMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1zXHJcblx0aXRlbURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbXYxL2l0ZW1fZGV0YWlscy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbV9kZXRhaWxzXHJcblx0cmVjaXBlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZXMuanNvbicsXHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVzXHJcblx0cmVjaXBlRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZV9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlX2RldGFpbHNcclxuXHJcblx0bWFwTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfbmFtZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX25hbWVzXHJcblx0Y29udGluZW50czogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbnRpbmVudHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbnRpbmVudHNcclxuXHRtYXBzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwc1xyXG5cdG1hcEZsb29yOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX2Zsb29yLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9mbG9vclxyXG5cclxuXHRvYmplY3RpdmVOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9vYmplY3RpdmVfbmFtZXMuanNvbicsXHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaGVzXHJcblx0bWF0Y2hlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaGVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaF9kZXRhaWxzXHJcblx0bWF0Y2hEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoX2RldGFpbHMuanNvbicsXHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L29iamVjdGl2ZV9uYW1lc1xyXG5cclxuXHRtYXRjaGVzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzJyxcclxuXHRtYXRjaERldGFpbHNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tLycsXHJcbn07XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBVQkxJQyBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlx0V09STEQgdnMgV09STERcclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZU5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdvYmplY3RpdmVOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdtYXRjaGVzJywge30sIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0dmFyIHd2d19tYXRjaGVzID0gKGRhdGEgJiYgZGF0YS53dndfbWF0Y2hlcykgPyBkYXRhLnd2d19tYXRjaGVzIDogW107XHJcblx0XHRjYWxsYmFjayhlcnIsIHd2d19tYXRjaGVzKTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0dGhyb3cgKCdtYXRjaF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hdGNoRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50cy5tYXRjaGVzU3RhdGU7XHJcblxyXG5cdGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gKCcnICsgcGFyYW1zLm1hdGNoX2lkKTtcclxuXHR9XHJcblxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkIHx8IHdvcmxkX3NsdWdcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzLm1hdGNoRGV0YWlsc1N0YXRlO1xyXG5cclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCAmJiAhcGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIG1hdGNoX2lkIG9yIHdvcmxkX3NsdWcgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9IHBhcmFtcy5tYXRjaF9pZDtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gJ3dvcmxkLycgKyBwYXJhbXMud29ybGRfc2x1ZztcclxuXHR9XHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0R0VORVJBTFxyXG4qL1xyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nLCBpZHNcclxuZnVuY3Rpb24gZ2V0V29ybGROYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHRpZiAoIXBhcmFtcy5pZHMpIHtcclxuXHRcdHBhcmFtcy5wYWdlID0gMDtcclxuXHR9XHJcblx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuaWRzKSkge1xyXG5cdFx0cGFyYW1zLmlkcyA9IHBhcmFtcy5pZHMuam9pbignLCcpO1xyXG5cdH1cclxuXHRnZXQoJ3dvcmxkTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogZ3VpbGRfaWQgfHwgZ3VpbGRfbmFtZSAoaWQgdGFrZXMgcHJpb3JpdHkpXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuZ3VpbGRfaWQgJiYgIXBhcmFtcy5ndWlsZF9uYW1lKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBndWlsZF9pZCBvciBndWlsZF9uYW1lIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cclxuXHRnZXQoJ2d1aWxkRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdElURU1TXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0SXRlbXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2l0ZW1zJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBpdGVtX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldEl0ZW1EZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5pdGVtX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2l0ZW1faWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdpdGVtRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldFJlY2lwZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ3JlY2lwZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBSRVFVSVJFRDogcmVjaXBlX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldFJlY2lwZURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnJlY2lwZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdyZWNpcGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdyZWNpcGVEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TUFQIElORk9STUFUSU9OXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldENvbnRpbmVudHMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2NvbnRpbmVudHMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hcF9pZCwgbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogY29udGluZW50X2lkLCBmbG9vclxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBGbG9vcihwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuY29udGluZW50X2lkKSB7XHJcblx0XHR0aHJvdyAoJ2NvbnRpbmVudF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZsb29yKSB7XHJcblx0XHR0aHJvdyAoJ2Zsb29yIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWFwRmxvb3InLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1pc2NlbGxhbmVvdXNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRCdWlsZChjYWxsYmFjaykge1xyXG5cdGdldCgnYnVpbGQnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0Q29sb3JzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdjb2xvcnMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG4vLyB0byBnZXQgZmlsZXM6IGh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUve3NpZ25hdHVyZX0ve2ZpbGVfaWR9Lntmb3JtYXR9XHJcbmZ1bmN0aW9uIGdldEZpbGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdmaWxlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgVVRJTElUWSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG4vLyBTUEVDSUFMIENBU0VcclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChnZXRGaWxlUmVuZGVyVXJsKHBhcmFtcykpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGVSZW5kZXJVcmwocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyVXJsID0gKFxyXG5cdFx0J2h0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvJ1xyXG5cdFx0KyBwYXJhbXMuc2lnbmF0dXJlXHJcblx0XHQrICcvJ1xyXG5cdFx0KyBwYXJhbXMuZmlsZV9pZFxyXG5cdFx0KyAnLidcclxuXHRcdCsgcGFyYW1zLmZvcm1hdFxyXG5cdCk7XHJcblx0cmV0dXJuIHJlbmRlclVybDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXQoa2V5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuXHR2YXIgYXBpVXJsID0gZ2V0QXBpVXJsKGtleSwgcGFyYW1zKTtcclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChhcGlVcmwpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHRyZXF1ZXN0VXJsID0gKGVuZFBvaW50c1tyZXF1ZXN0VXJsXSlcclxuXHRcdD8gZW5kUG9pbnRzW3JlcXVlc3RVcmxdXHJcblx0XHQ6IHJlcXVlc3RVcmw7XHJcblxyXG5cdHZhciBxdWVyeSA9IHFzLnN0cmluZ2lmeShwYXJhbXMpO1xyXG5cclxuXHRpZiAocXVlcnkubGVuZ3RoKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICc/JyArIHF1ZXJ5O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlcXVlc3RVcmw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUpzb24oZGF0YSkge1xyXG5cdHZhciByZXN1bHRzO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0cmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblx0fVxyXG5cdGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290ID0gJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHdpbmRvd1xuICA/IHRoaXNcbiAgOiB3aW5kb3c7XG5cbi8qKlxuICogTm9vcC5cbiAqL1xuXG5mdW5jdGlvbiBub29wKCl7fTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBUT0RPOiBmdXR1cmUgcHJvb2YsIG1vdmUgdG8gY29tcG9lbnQgbGFuZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0hvc3Qob2JqKSB7XG4gIHZhciBzdHIgPSB7fS50b1N0cmluZy5jYWxsKG9iaik7XG5cbiAgc3dpdGNoIChzdHIpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICBjYXNlICdbb2JqZWN0IEJsb2JdJzpcbiAgICBjYXNlICdbb2JqZWN0IEZvcm1EYXRhXSc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAmJiAoJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBhZGRlZCB0byBzdXBwb3J0IElFLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgdHJpbSA9ICcnLnRyaW1cbiAgPyBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKTsgfVxuICA6IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7IH07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgdmFyIHBhaXJzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAobnVsbCAhPSBvYmpba2V5XSkge1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICAgICArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmpba2V5XSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYXJ0cztcbiAgdmFyIHBhaXI7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBhcnRzID0gcGFpci5zcGxpdCgnPScpO1xuICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4cG9zZSBwYXJzZXIuXG4gKi9cblxucmVxdWVzdC5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG4vKipcbiAqIERlZmF1bHQgTUlNRSB0eXBlIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKi9cblxucmVxdWVzdC50eXBlcyA9IHtcbiAgaHRtbDogJ3RleHQvaHRtbCcsXG4gIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgeG1sOiAnYXBwbGljYXRpb24veG1sJyxcbiAgdXJsZW5jb2RlZDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtLWRhdGEnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHNlcmlhbGl6YXRpb24gbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihvYmope1xuICogICAgICAgcmV0dXJuICdnZW5lcmF0ZWQgeG1sIGhlcmUnO1xuICogICAgIH07XG4gKlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZSA9IHtcbiAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBzZXJpYWxpemUsXG4gICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5XG4gfTtcblxuIC8qKlxuICAqIERlZmF1bHQgcGFyc2Vycy5cbiAgKlxuICAqICAgICBzdXBlcmFnZW50LnBhcnNlWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKHN0cil7XG4gICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICAqICAgICB9O1xuICAqXG4gICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgvXFxyP1xcbi8pO1xuICB2YXIgZmllbGRzID0ge307XG4gIHZhciBpbmRleDtcbiAgdmFyIGxpbmU7XG4gIHZhciBmaWVsZDtcbiAgdmFyIHZhbDtcblxuICBsaW5lcy5wb3AoKTsgLy8gdHJhaWxpbmcgQ1JMRlxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBpbmRleCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGZpZWxkID0gbGluZS5zbGljZSgwLCBpbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZHM7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykuc2hpZnQoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcmFtcyhzdHIpe1xuICByZXR1cm4gcmVkdWNlKHN0ci5zcGxpdCgvICo7ICovKSwgZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKVxuICAgICAgLCBrZXkgPSBwYXJ0cy5zaGlmdCgpXG4gICAgICAsIHZhbCA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoa2V5ICYmIHZhbCkgb2JqW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZWAgd2l0aCB0aGUgZ2l2ZW4gYHhocmAuXG4gKlxuICogIC0gc2V0IGZsYWdzICgub2ssIC5lcnJvciwgZXRjKVxuICogIC0gcGFyc2UgaGVhZGVyXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogIEFsaWFzaW5nIGBzdXBlcmFnZW50YCBhcyBgcmVxdWVzdGAgaXMgbmljZTpcbiAqXG4gKiAgICAgIHJlcXVlc3QgPSBzdXBlcmFnZW50O1xuICpcbiAqICBXZSBjYW4gdXNlIHRoZSBwcm9taXNlLWxpa2UgQVBJLCBvciBwYXNzIGNhbGxiYWNrczpcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJykuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJywgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgU2VuZGluZyBkYXRhIGNhbiBiZSBjaGFpbmVkOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5zZW5kKClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnBvc3QoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIE9yIGZ1cnRoZXIgcmVkdWNlZCB0byBhIHNpbmdsZSBjYWxsIGZvciBzaW1wbGUgY2FzZXM6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogQHBhcmFtIHtYTUxIVFRQUmVxdWVzdH0geGhyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2UocmVxLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLnJlcSA9IHJlcTtcbiAgdGhpcy54aHIgPSB0aGlzLnJlcS54aHI7XG4gIC8vIHJlc3BvbnNlVGV4dCBpcyBhY2Nlc3NpYmxlIG9ubHkgaWYgcmVzcG9uc2VUeXBlIGlzICcnIG9yICd0ZXh0JyBhbmQgb24gb2xkZXIgYnJvd3NlcnNcbiAgdGhpcy50ZXh0ID0gKCh0aGlzLnJlcS5tZXRob2QgIT0nSEVBRCcgJiYgKHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJycgfHwgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndGV4dCcpKSB8fCB0eXBlb2YgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndW5kZWZpbmVkJylcbiAgICAgPyB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgOiBudWxsO1xuICB0aGlzLnN0YXR1c1RleHQgPSB0aGlzLnJlcS54aHIuc3RhdHVzVGV4dDtcbiAgdGhpcy5zZXRTdGF0dXNQcm9wZXJ0aWVzKHRoaXMueGhyLnN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcbiAgdGhpcy5ib2R5ID0gdGhpcy5yZXEubWV0aG9kICE9ICdIRUFEJ1xuICAgID8gdGhpcy5wYXJzZUJvZHkodGhpcy50ZXh0ID8gdGhpcy50ZXh0IDogdGhpcy54aHIucmVzcG9uc2UpXG4gICAgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgcmV0dXJuIHBhcnNlICYmIHN0ciAmJiAoc3RyLmxlbmd0aCB8fCBzdHIgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cyB8fCAxMjIzID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307XG4gIHRoaXMuX2hlYWRlciA9IHt9O1xuICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBlcnIgPSBudWxsO1xuICAgIHZhciByZXMgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcignUGFyc2VyIGlzIHVuYWJsZSB0byBwYXJzZSB0aGUgcmVzcG9uc2UnKTtcbiAgICAgIGVyci5wYXJzZSA9IHRydWU7XG4gICAgICBlcnIub3JpZ2luYWwgPSBlO1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICBpZiAocmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIHZhciBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgIG5ld19lcnIub3JpZ2luYWwgPSBlcnI7XG4gICAgbmV3X2Vyci5yZXNwb25zZSA9IHJlcztcbiAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG5cbiAgICBzZWxmLmNhbGxiYWNrKGVyciB8fCBuZXdfZXJyLCByZXMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBTZXQgdGltZW91dCB0byBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbihtcyl7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3RpbWVvdXQgPSAwO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmFib3J0ZWQpIHJldHVybjtcbiAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIuYWJvcnQoKTtcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5nZXRIZWFkZXIgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3Mpe1xuICB2YXIgc3RyID0gYnRvYSh1c2VyICsgJzonICsgcGFzcyk7XG4gIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuKlxuKiBFeGFtcGxlczpcbipcbiogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4qICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4qXG4qIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4qIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuKiBAYXBpIHB1YmxpY1xuKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpe1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkgdmFsID0gc2VyaWFsaXplKHZhbCk7XG4gIGlmICh2YWwpIHRoaXMuX3F1ZXJ5LnB1c2godmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICogcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBmaWxlbmFtZWAuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgdGhpcy5fZm9ybURhdGEuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBxdWVyeXN0cmluZ1xuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG11bHRpcGxlIGRhdGEgXCJ3cml0ZXNcIlxuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuc2VuZCh7IHNlYXJjaDogJ3F1ZXJ5JyB9KVxuICogICAgICAgICAuc2VuZCh7IHJhbmdlOiAnMS4uNScgfSlcbiAqICAgICAgICAgLnNlbmQoeyBvcmRlcjogJ2Rlc2MnIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaiB8fCBpc0hvc3QoZGF0YSkpIHJldHVybiB0aGlzO1xuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdPcmlnaW4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggdGltZW91dCBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0RXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ3RpbWVvdXQgb2YgJyArIHRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnKTtcbiAgZXJyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSB0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCk7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoNCAhPSB4aHIucmVhZHlTdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gSW4gSUU5LCByZWFkcyB0byBhbnkgcHJvcGVydHkgKGUuZy4gc3RhdHVzKSBvZmYgb2YgYW4gYWJvcnRlZCBYSFIgd2lsbFxuICAgIC8vIHJlc3VsdCBpbiB0aGUgZXJyb3IgXCJDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcIlxuICAgIHZhciBzdGF0dXM7XG4gICAgdHJ5IHsgc3RhdHVzID0geGhyLnN0YXR1cyB9IGNhdGNoKGUpIHsgc3RhdHVzID0gMDsgfVxuXG4gICAgaWYgKDAgPT0gc3RhdHVzKSB7XG4gICAgICBpZiAoc2VsZi50aW1lZG91dCkgcmV0dXJuIHNlbGYudGltZW91dEVycm9yKCk7XG4gICAgICBpZiAoc2VsZi5hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdHJ5IHtcbiAgICBpZiAoeGhyLnVwbG9hZCAmJiB0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICAgICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICAgICAgfTtcbiAgICB9XG4gIH0gY2F0Y2goZSkge1xuICAgIC8vIEFjY2Vzc2luZyB4aHIudXBsb2FkIGZhaWxzIGluIElFIGZyb20gYSB3ZWIgd29ya2VyLCBzbyBqdXN0IHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cbiAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODM3MjQ1L3htbGh0dHByZXF1ZXN0LXVwbG9hZC10aHJvd3MtaW52YWxpZC1hcmd1bWVudC13aGVuLXVzZWQtZnJvbS13ZWItd29ya2VyLWNvbnRleHRcbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QocXVlcnkpO1xuICAgIHRoaXMudXJsICs9IH50aGlzLnVybC5pbmRleE9mKCc/JylcbiAgICAgID8gJyYnICsgcXVlcnlcbiAgICAgIDogJz8nICsgcXVlcnk7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIWlzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVt0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyldO1xuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuICB4aHIuc2VuZChkYXRhKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmRlbCA9IGZ1bmN0aW9uKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcbi8qKlxuICogUmVkdWNlIGBhcnJgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge01peGVkfSBpbml0aWFsXG4gKlxuICogVE9ETzogY29tYmF0aWJsZSBlcnJvciBoYW5kbGluZz9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpeyAgXG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIGN1cnIgPSBhcmd1bWVudHMubGVuZ3RoID09IDNcbiAgICA/IGluaXRpYWxcbiAgICA6IGFycltpZHgrK107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGN1cnIgPSBmbi5jYWxsKG51bGwsIGN1cnIsIGFycltpZHhdLCArK2lkeCwgYXJyKTtcbiAgfVxuICBcbiAgcmV0dXJuIGN1cnI7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IFwiMVwiLCBcImVuXCI6IFwiT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlXCIsIFwiZXNcIjogXCJNaXJhZG9yXCIsIFwiZGVcIjogXCJBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogXCIyXCIsIFwiZW5cIjogXCJWYWxsZXlcIiwgXCJmclwiOiBcIlZhbGzDqWVcIiwgXCJlc1wiOiBcIlZhbGxlXCIsIFwiZGVcIjogXCJUYWxcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IFwiM1wiLCBcImVuXCI6IFwiTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXNcIiwgXCJlc1wiOiBcIlZlZ2FcIiwgXCJkZVwiOiBcIlRpZWZsYW5kXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiBcIjRcIiwgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIiwgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiLCBcImVzXCI6IFwiQ2xhcm8gR29sYW50YVwiLCBcImRlXCI6IFwiR29sYW50YS1MaWNodHVuZ1wifSxcclxuXHRcIjVcIjoge1wiaWRcIjogXCI1XCIsIFwiZW5cIjogXCJQYW5nbG9zcyBSaXNlXCIsIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCIsIFwiZXNcIjogXCJDb2xpbmEgUGFuZ2xvc3NcIiwgXCJkZVwiOiBcIlBhbmdsb3NzLUFuaMO2aGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IFwiNlwiLCBcImVuXCI6IFwiU3BlbGRhbiBDbGVhcmN1dFwiLCBcImZyXCI6IFwiRm9yw6p0IHJhc8OpZSBkZSBTcGVsZGFuXCIsIFwiZXNcIjogXCJDbGFybyBFc3BlbGRpYVwiLCBcImRlXCI6IFwiU3BlbGRhbiBLYWhsc2NobGFnXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiBcIjdcIiwgXCJlblwiOiBcIkRhbmVsb24gUGFzc2FnZVwiLCBcImZyXCI6IFwiUGFzc2FnZSBEYW5lbG9uXCIsIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLCBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiBcIjhcIiwgXCJlblwiOiBcIlVtYmVyZ2xhZGUgV29vZHNcIiwgXCJmclwiOiBcIkJvaXMgZCdPbWJyZWNsYWlyXCIsIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiBcIjlcIiwgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIiwgXCJmclwiOiBcIkNow6J0ZWF1IEJydW1lcGllcnJlXCIsIFwiZXNcIjogXCJDYXN0aWxsbyBQaWVkcmFuaWVibGFcIiwgXCJkZVwiOiBcIlNjaGxvc3MgU3RlaW5uZWJlbFwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IFwiMTBcIiwgXCJlblwiOiBcIlJvZ3VlJ3MgUXVhcnJ5XCIsIFwiZnJcIjogXCJDYXJyacOocmUgZGVzIHZvbGV1cnNcIiwgXCJlc1wiOiBcIkNhbnRlcmEgZGVsIFDDrWNhcm9cIiwgXCJkZVwiOiBcIlNjaHVya2VuYnJ1Y2hcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiBcIjExXCIsIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCIsIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogXCIxMlwiLCBcImVuXCI6IFwiV2lsZGNyZWVrIFJ1blwiLCBcImZyXCI6IFwiUGlzdGUgZHUgUnVpc3NlYXUgc2F1dmFnZVwiLCBcImVzXCI6IFwiUGlzdGEgQXJyb3lvc2FsdmFqZVwiLCBcImRlXCI6IFwiV2lsZGJhY2hzdHJlY2tlXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogXCIxM1wiLCBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIiwgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCIsIFwiZXNcIjogXCJDZW5hZ2FsIGRlIEplcnJpZmVyXCIsIFwiZGVcIjogXCJKZXJyaWZlcnMgU3VtcGZsb2NoXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogXCIxNFwiLCBcImVuXCI6IFwiS2xvdmFuIEd1bGx5XCIsIFwiZnJcIjogXCJQZXRpdCByYXZpbiBkZSBLbG92YW5cIiwgXCJlc1wiOiBcIkJhcnJhbmNvIEtsb3ZhblwiLCBcImRlXCI6IFwiS2xvdmFuLVNlbmtlXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogXCIxNVwiLCBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBMYW5nb3JcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIExhbmdvclwiLCBcImRlXCI6IFwiTGFuZ29yIC0gU2NobHVjaHRcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiBcIjE2XCIsIFwiZW5cIjogXCJRdWVudGluIExha2VcIiwgXCJmclwiOiBcIkxhYyBRdWVudGluXCIsIFwiZXNcIjogXCJMYWdvIFF1ZW50aW5cIiwgXCJkZVwiOiBcIlF1ZW50aW5zZWVcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiBcIjE3XCIsIFwiZW5cIjogXCJNZW5kb24ncyBHYXBcIiwgXCJmclwiOiBcIkZhaWxsZSBkZSBNZW5kb25cIiwgXCJlc1wiOiBcIlphbmphIGRlIE1lbmRvblwiLCBcImRlXCI6IFwiTWVuZG9ucyBTcGFsdFwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IFwiMThcIiwgXCJlblwiOiBcIkFuemFsaWFzIFBhc3NcIiwgXCJmclwiOiBcIkNvbCBkJ0FuemFsaWFzXCIsIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogXCIxOVwiLCBcImVuXCI6IFwiT2dyZXdhdGNoIEN1dFwiLCBcImZyXCI6IFwiUGVyY8OpZSBkZSBHYXJkb2dyZVwiLCBcImVzXCI6IFwiVGFqbyBkZSBsYSBHdWFyZGlhIGRlbCBPZ3JvXCIsIFwiZGVcIjogXCJPZ2Vyd2FjaHQtS2FuYWxcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiBcIjIwXCIsIFwiZW5cIjogXCJWZWxva2EgU2xvcGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiLCBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLCBcImRlXCI6IFwiVmVsb2thLUhhbmdcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiBcIjIxXCIsIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIER1cmlvc1wiLCBcImVzXCI6IFwiQmFycmFuY28gRHVyaW9zXCIsIFwiZGVcIjogXCJEdXJpb3MtU2NobHVjaHRcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiBcIjIyXCIsIFwiZW5cIjogXCJCcmF2b3N0IEVzY2FycG1lbnRcIiwgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiLCBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLCBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiBcIjIzXCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IFwiMjRcIiwgXCJlblwiOiBcIkNoYW1waW9uJ3MgRGVtZW5zZVwiLCBcImZyXCI6IFwiRmllZiBkdSBjaGFtcGlvblwiLCBcImVzXCI6IFwiRG9taW5pbyBkZWwgQ2FtcGXDs25cIiwgXCJkZVwiOiBcIkxhbmRndXQgZGVzIENoYW1waW9uc1wifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IFwiMjVcIiwgXCJlblwiOiBcIlJlZGJyaWFyXCIsIFwiZnJcIjogXCJCcnV5ZXJvdWdlXCIsIFwiZXNcIjogXCJaYXJ6YXJyb2phXCIsIFwiZGVcIjogXCJSb3Rkb3Juc3RyYXVjaFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IFwiMjZcIiwgXCJlblwiOiBcIkdyZWVubGFrZVwiLCBcImZyXCI6IFwiTGFjIFZlcnRcIiwgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zZWVcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiBcIjI3XCIsIFwiZW5cIjogXCJBc2NlbnNpb24gQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlIGwnQXNjZW5zaW9uXCIsIFwiZXNcIjogXCJCYWjDrWEgZGUgbGEgQXNjZW5zacOzblwiLCBcImRlXCI6IFwiQnVjaHQgZGVzIEF1ZnN0aWVnc1wifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IFwiMjhcIiwgXCJlblwiOiBcIkRhd24ncyBFeXJpZVwiLCBcImZyXCI6IFwiUHJvbW9udG9pcmUgZGUgbCdhdWJlXCIsIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLCBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmRhbW1lcnVuZ1wifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IFwiMjlcIiwgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLCBcImZyXCI6IFwiTCdhbnRyZSBkZXMgZXNwcml0c1wiLCBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIiwgXCJkZVwiOiBcIkRlciBHZWlzdGVyaG9sbVwifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IFwiMzBcIiwgXCJlblwiOiBcIldvb2RoYXZlblwiLCBcImZyXCI6IFwiR2VudGVzeWx2ZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLCBcImRlXCI6IFwiV2FsZCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IFwiMzFcIiwgXCJlblwiOiBcIkFza2FsaW9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEFza2FsaW9uXCIsIFwiZGVcIjogXCJBc2thbGlvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IFwiMzJcIiwgXCJlblwiOiBcIkV0aGVyb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnRXRoZXJvblwiLCBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsIFwiZGVcIjogXCJFdGhlcm9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogXCIzM1wiLCBcImVuXCI6IFwiRHJlYW1pbmcgQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIiwgXCJlc1wiOiBcIkJhaMOtYSBPbsOtcmljYVwiLCBcImRlXCI6IFwiVHJhdW1idWNodFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IFwiMzRcIiwgXCJlblwiOiBcIlZpY3RvcidzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSB2YWlucXVldXJcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBWZW5jZWRvclwiLCBcImRlXCI6IFwiU2llZ2VyIC0gSMO8dHRlXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogXCIzNVwiLCBcImVuXCI6IFwiR3JlZW5icmlhclwiLCBcImZyXCI6IFwiVmVydGVicmFuY2hlXCIsIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiBcIjM2XCIsIFwiZW5cIjogXCJCbHVlbGFrZVwiLCBcImZyXCI6IFwiTGFjIGJsZXVcIiwgXCJlc1wiOiBcIkxhZ29henVsXCIsIFwiZGVcIjogXCJCbGF1c2VlXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogXCIzN1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiBcIjM4XCIsIFwiZW5cIjogXCJMb25ndmlld1wiLCBcImZyXCI6IFwiTG9uZ3VldnVlXCIsIFwiZXNcIjogXCJWaXN0YWx1ZW5nYVwiLCBcImRlXCI6IFwiV2VpdHNpY2h0XCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogXCIzOVwiLCBcImVuXCI6IFwiVGhlIEdvZHN3b3JkXCIsIFwiZnJcIjogXCJMJ0Vww6llIGRpdmluZVwiLCBcImVzXCI6IFwiTGEgSG9qYSBEaXZpbmFcIiwgXCJkZVwiOiBcIkRhcyBHb3R0c2Nod2VydFwifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IFwiNDBcIiwgXCJlblwiOiBcIkNsaWZmc2lkZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgZmFsYWlzZVwiLCBcImVzXCI6IFwiRGVzcGXDsWFkZXJvXCIsIFwiZGVcIjogXCJGZWxzd2FuZFwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IFwiNDFcIiwgXCJlblwiOiBcIlNoYWRhcmFuIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkZSBTaGFkYXJhblwiLCBcImVzXCI6IFwiQ29saW5hcyBTaGFkYXJhblwiLCBcImRlXCI6IFwiU2hhZGFyYW4gSMO8Z2VsXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogXCI0MlwiLCBcImVuXCI6IFwiUmVkbGFrZVwiLCBcImZyXCI6IFwiUm91Z2VsYWNcIiwgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLCBcImRlXCI6IFwiUm90c2VlXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogXCI0M1wiLCBcImVuXCI6IFwiSGVybydzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIiwgXCJkZVwiOiBcIkjDvHR0ZSBkZXMgSGVsZGVuXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogXCI0NFwiLCBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkdSBOb2lyIGTDqWNsaW5cIiwgXCJlc1wiOiBcIkJhaMOtYSBTYWx0byBBY2lhZ29cIiwgXCJkZVwiOiBcIlNjaHJlY2tlbnNmYWxsIC0gQnVjaHRcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiBcIjQ1XCIsIFwiZW5cIjogXCJCbHVlYnJpYXJcIiwgXCJmclwiOiBcIkJydXlhenVyXCIsIFwiZXNcIjogXCJaYXJ6YXp1bFwiLCBcImRlXCI6IFwiQmxhdWRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogXCI0NlwiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiBcIjQ3XCIsIFwiZW5cIjogXCJTdW5ueWhpbGxcIiwgXCJmclwiOiBcIkNvbGxpbmUgZW5zb2xlaWxsw6llXCIsIFwiZXNcIjogXCJDb2xpbmEgU29sZWFkYVwiLCBcImRlXCI6IFwiU29ubmVubGljaHRow7xnZWxcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiBcIjQ4XCIsIFwiZW5cIjogXCJGYWl0aGxlYXBcIiwgXCJmclwiOiBcIkZlcnZldXJcIiwgXCJlc1wiOiBcIlNhbHRvIGRlIEZlXCIsIFwiZGVcIjogXCJHbGF1YmVuc3NwcnVuZ1wifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IFwiNDlcIiwgXCJlblwiOiBcIkJsdWV2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIGJsZXV2YWxcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVhenVsXCIsIFwiZGVcIjogXCJCbGF1dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiBcIjUwXCIsIFwiZW5cIjogXCJCbHVld2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtQXp1clwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsIFwiZGVcIjogXCJCbGF1d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiBcIjUxXCIsIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLCBcImZyXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJlc1wiOiBcIklzbGV0YSBBc3RyYWxcIiwgXCJkZVwiOiBcIkFzdHJhbGhvbG1cIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiBcIjUyXCIsIFwiZW5cIjogXCJBcmFoJ3MgSG9wZVwiLCBcImZyXCI6IFwiRXNwb2lyIGQnQXJhaFwiLCBcImVzXCI6IFwiRXNwZXJhbnphIGRlIEFyYWhcIiwgXCJkZVwiOiBcIkFyYWhzIEhvZmZudW5nXCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogXCI1M1wiLCBcImVuXCI6IFwiR3JlZW52YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHZlcnRcIiwgXCJlc1wiOiBcIlJlZnVnaW8gZGUgVmFsbGV2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG50YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IFwiNTRcIiwgXCJlblwiOiBcIkZvZ2hhdmVuXCIsIFwiZnJcIjogXCJIYXZyZSBncmlzXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIE5lYmxpbm9zb1wiLCBcImRlXCI6IFwiTmViZWwgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiBcIjU1XCIsIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWFycm9qYVwiLCBcImRlXCI6IFwiUm90d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiBcIjU2XCIsIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIiwgXCJmclwiOiBcIkJyYXMgZHUgdGl0YW5cIiwgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIiwgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogXCI1N1wiLCBcImVuXCI6IFwiQ3JhZ3RvcFwiLCBcImZyXCI6IFwiU29tbWV0IGRlIGwnZXNjYXJwZW1lbnRcIiwgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsIFwiZGVcIjogXCJGZWxzZW5zcGl0emVcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiBcIjU4XCIsIFwiZW5cIjogXCJHb2RzbG9yZVwiLCBcImZyXCI6IFwiRGl2aW5hdGlvblwiLCBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsIFwiZGVcIjogXCJHw7Z0dGVya3VuZGVcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiBcIjU5XCIsIFwiZW5cIjogXCJSZWR2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcm9qb1wiLCBcImRlXCI6IFwiUm90dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiBcIjYwXCIsIFwiZW5cIjogXCJTdGFyZ3JvdmVcIiwgXCJmclwiOiBcIkJvc3F1ZXQgc3RlbGxhaXJlXCIsIFwiZXNcIjogXCJBcmJvbGVkYSBkZSBsYXMgRXN0cmVsbGFzXCIsIFwiZGVcIjogXCJTdGVybmVuaGFpblwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IFwiNjFcIiwgXCJlblwiOiBcIkdyZWVud2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtVmVyZG95YW50ZVwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xud2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiBcIjYyXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogXCI2M1wiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IFwiNjRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiBcIjY1XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IFwiNjZcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiBcIjY3XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogXCI2OFwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiBcIjY5XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogXCI3MFwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IFwiNzFcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiBcIjcyXCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogXCI3M1wiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiBcIjc0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogXCI3NVwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IFwiNzZcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdHtcclxuXHRcdFwia2V5XCI6IFwiQ2VudGVyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFdGVybmFsIEJhdHRsZWdyb3VuZHNcIixcclxuXHRcdFwiYWJiclwiOiBcIkVCR1wiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAzLFxyXG5cdFx0XCJjb2xvclwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQ2FzdGxlXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs5XSwgXHRcdFx0XHRcdFx0XHRcdC8vIHNtXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiUmVkIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsxLCAxNywgMjAsIDE4LCAxOSwgNiwgNV0sXHRcdC8vIG92ZXJsb29rLCBtZW5kb25zLCB2ZWxva2EsIGFueiwgb2dyZSwgc3BlbGRhbiwgcGFuZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkJsdWUgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyLCAxNSwgMjIsIDE2LCAyMSwgNywgOF1cdFx0XHQvLyB2YWxsZXksIGxhbmdvciwgYnJhdm9zdCwgcXVlbnRpbiwgZHVyaW9zLCBkYW5lLCB1bWJlclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkdyZWVuIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMsIDExLCAxMywgMTIsIDE0LCAxMCwgNF0gXHRcdC8vIGxvd2xhbmRzLCBhbGRvbnMsIGplcnJpZmVyLCB3aWxkY3JlZWssIGtsb3Zhbiwgcm9ndWVzLCBnb2xhbnRhXHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIlJlZEhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIlJlZEhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIlJlZFwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAwLFxyXG5cdFx0XCJjb2xvclwiOiBcInJlZFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszNywgMzMsIDMyXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBsb25ndmlldywgY2xpZmZzaWRlLCBnb2Rzd29yZCwgaG9wZXMsIGFzdHJhbFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM4LCA0MCwgMzksIDUyLCA1MV0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBsb25ndmlldywgY2xpZmZzaWRlLCBnb2Rzd29yZCwgaG9wZXMsIGFzdHJhbFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszNSwgMzYsIDM0LCA1MywgNTBdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNjIsIDYzLCA2NCwgNjUsIDY2XSBcdFx0XHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkJsdVwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAyLFxyXG5cdFx0XCJjb2xvclwiOiBcImJsdWVcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIzLCAyNywgMzFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszMCwgMjgsIDI5LCA1OCwgNjBdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzI1LCAyNiwgMjQsIDU5LCA2MV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgY2hhbXAsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3MSwgNzAsIDY5LCA2OCwgNjddIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJHcm5cIixcclxuXHRcdFwibWFwSW5kZXhcIjogMSxcclxuXHRcdFwiY29sb3JcIjogXCJncmVlblwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ2LCA0NCwgNDFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDcsIDU3LCA1NiwgNDgsIDU0XSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NSwgNDIsIDQzLCA0OSwgNTVdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzYgLCA3NSAsIDc0ICwgNzMgLCA3MiBdIFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdXHJcblx0fSxcclxuXTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Ly9cdEVCR1xyXG5cdFwiOVwiOlx0e1widHlwZVwiOiAxLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAwLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTdG9uZW1pc3QgQ2FzdGxlXHJcblxyXG5cdC8vXHRSZWQgQ29ybmVyXHJcblx0XCIxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFJlZCBLZWVwIC0gT3Zlcmxvb2tcclxuXHRcIjE3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIE1lbmRvbidzIEdhcFxyXG5cdFwiMjBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gVmVsb2thIFNsb3BlXHJcblx0XCIxOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBBbnphbGlhcyBQYXNzXHJcblx0XCIxOVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBPZ3Jld2F0Y2ggQ3V0XHJcblx0XCI2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBDYW1wIC0gTWlsbCAtIFNwZWxkYW5cclxuXHRcIjVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIENhbXAgLSBNaW5lIC0gUGFuZ2xvc3NcclxuXHJcblx0Ly9cdEJsdWUgQ29ybmVyXHJcblx0XCIyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgS2VlcCAtIFZhbGxleVxyXG5cdFwiMTVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIExhbmdvciBHdWxjaFxyXG5cdFwiMjJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIEJyYXZvc3QgRXNjYXJwbWVudFxyXG5cdFwiMTZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIFF1ZW50aW4gTGFrZVxyXG5cdFwiMjFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIER1cmlvcyBHdWxjaFxyXG5cdFwiN1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBCbHVlIENhbXAgLSBNaW5lIC0gRGFuZWxvblxyXG5cdFwiOFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIENhbXAgLSBNaWxsIC0gVW1iZXJnbGFkZVxyXG5cclxuXHQvL1x0R3JlZW4gQ29ybmVyXHJcblx0XCIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIEtlZXAgLSBMb3dsYW5kc1xyXG5cdFwiMTFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBBbGRvbnNcclxuXHRcIjEzXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gSmVycmlmZXIncyBTbG91Z2hcclxuXHRcIjEyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gV2lsZGNyZWVrXHJcblx0XCIxNFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEtsb3ZhbiBHdWxseVxyXG5cdFwiMTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbmUgLSBSb2d1ZXMgUXVhcnJ5XHJcblx0XCI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIENhbXAgLSBNaWxsIC0gR29sYW50YVxyXG5cclxuXHJcblx0Ly9cdFJlZEhvbWVcclxuXHRcIjM3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIzM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhbWluZyBCYXlcclxuXHRcIjMyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gRXRoZXJvbiBIaWxsc1xyXG5cdFwiMzhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBMb25ndmlld1xyXG5cdFwiNDBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDbGlmZnNpZGVcclxuXHRcIjM5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIEdvZHN3b3JkXHJcblx0XCI1MlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEFyYWgncyBIb3BlXHJcblx0XCI1MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEFzdHJhbGhvbG1lXHJcblxyXG5cdFwiMzVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBHcmVlbmJyaWFyXHJcblx0XCIzNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEJsdWVsYWtlXHJcblx0XCIzNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIFZpY3RvcidzIExvZGdlXHJcblx0XCI1M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBHcmVlbnZhbGUgUmVmdWdlXHJcblx0XCI1MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gQmx1ZXdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0R3JlZW5Ib21lXHJcblx0XCI0NlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiNDRcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYWRmYWxsIEJheVxyXG5cdFwiNDFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBTaGFkYXJhbiBIaWxsc1xyXG5cdFwiNDdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBTdW5ueWhpbGxcclxuXHRcIjU3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ3JhZ3RvcFxyXG5cdFwiNTZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgVGl0YW5wYXdcclxuXHRcIjQ4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gRmFpdGhsZWFwXHJcblx0XCI1NFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEZvZ2hhdmVuXHJcblxyXG5cdFwiNDVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBCbHVlYnJpYXJcclxuXHRcIjQyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gUmVkbGFrZVxyXG5cdFwiNDNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBIZXJvJ3MgTG9kZ2VcclxuXHRcIjQ5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEJsdWV2YWxlIFJlZnVnZVxyXG5cdFwiNTVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIFJlZHdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0Qmx1ZUhvbWVcclxuXHRcIjIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIyN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBBc2NlbnNpb24gQmF5XHJcblx0XCIzMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEFza2FsaW9uIEhpbGxzXHJcblx0XCIzMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFdvb2RoYXZlblxyXG5cdFwiMjhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBEYXduJ3MgRXlyaWVcclxuXHRcIjI5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFNwaXJpdGhvbG1lXHJcblx0XCI1OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEdvZHNsb3JlXHJcblx0XCI2MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIFN0YXJncm92ZVxyXG5cclxuXHRcIjI1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gUmVkYnJpYXJcclxuXHRcIjI2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gR3JlZW5sYWtlXHJcblx0XCIyNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIENoYW1waW9uJ3MgRGVtZW5zZVxyXG5cdFwiNTlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gUmVkdmFsZSBSZWZ1Z2VcclxuXHRcIjYxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBHcmVlbndhdGVyIExvd2xhbmRzXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcIm5hbWVcIjogXCJHcmVlbiBNaWxsXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcIm5hbWVcIjogXCJSZWQgTWluZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJuYW1lXCI6IFwiUmVkIE1pbGxcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwibmFtZVwiOiBcIkJsdWUgTWluZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJuYW1lXCI6IFwiQmx1ZSBNaWxsXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcIm5hbWVcIjogXCJDYXN0bGVcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiAxMCwgXCJuYW1lXCI6IFwiR3JlZW4gTWluZVwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IDExLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IDEyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IDEzLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IDE0LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IDE1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IDE2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IDE3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IDE4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IDE5LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IDIwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IDIxLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IDIyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IDIzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogMjUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogMjQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiAyNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiAyNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IDI4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IDI5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogMzAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogMzEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiAzMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IDMzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogMzQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiAzNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiAzNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiAzNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IDM4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IDM5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogNDAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogNDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiA0MiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiA0MywgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IDQ0LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogNDUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogNDYsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiA0NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiA0OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogNDksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogNTAsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IDUxLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IDUyLCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiA1MywgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiA1NCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiA1NSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogNTYsIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiA1NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiA1OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogNTksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogNjAsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogNjEsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IDYyLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IDYzLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogNjQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IDY1LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IDY2LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogNjcsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiA2OCwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiA2OSwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogNzAsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiA3MSwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiA3MiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IDczLCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IDc0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiA3NSwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IDc2LCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDM1LCBcIm5hbWVcIjogXCJjYXN0bGVcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAyNSwgXCJuYW1lXCI6IFwia2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDEwLCBcIm5hbWVcIjogXCJ0b3dlclwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDUsIFwibmFtZVwiOiBcImNhbXBcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJ0ZW1wbGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJob2xsb3dcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJlc3RhdGVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJvdmVybG9va1wifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImFzY2VudFwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGxhbmdzOiByZXF1aXJlKCcuL2RhdGEvbGFuZ3MnKSxcclxuXHR3b3JsZHM6IHJlcXVpcmUoJy4vZGF0YS93b3JsZF9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV9uYW1lczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV90eXBlczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV90eXBlcycpLFxyXG5cdG9iamVjdGl2ZV9tZXRhOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21ldGEnKSxcclxuXHRvYmplY3RpdmVfbGFiZWxzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX2xhYmVscycpLFxyXG5cdG9iamVjdGl2ZV9tYXA6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWFwJyksXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoV29ybGQgPSByZXF1aXJlKCcuL01hdGNoV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaCA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSwgbmV4dFByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSk7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2ggICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldChcInN0YXJ0VGltZVwiKSwgbmV4dFByb3BzLm1hdGNoLmdldChcInN0YXJ0VGltZVwiKSk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3JlcyB8fCBuZXdNYXRjaCB8fCBuZXdXb3JsZHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaDo6cmVuZGVyKCknLCBwcm9wcy5tYXRjaC50b0pTKCkpO1xyXG5cclxuICAgICAgICBjb25zdCB3b3JsZENvbG9ycyA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibWF0Y2hDb250YWluZXJcIj5cclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cIm1hdGNoXCI+XHJcbiAgICAgICAgICAgICAgICB7d29ybGRDb2xvcnMubWFwKChjb2xvciwgaXhDb2xvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkS2V5ID0gY29sb3IgKyAnSWQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkSWQgID0gcHJvcHMubWF0Y2guZ2V0KHdvcmxkS2V5KS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkICAgID0gcHJvcHMud29ybGRzLmdldCh3b3JsZElkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29yZXMgICA9IHByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8TWF0Y2hXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAndHInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICA9IHt3b3JsZElkfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgICAgID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZXMgICAgPSB7c2NvcmVzfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgICAgID0ge2NvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpeENvbG9yICAgPSB7aXhDb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BpZSAgID0ge2l4Q29sb3IgPT09IDB9XHJcbiAgICAgICAgICAgICAgICAgICAgLz47XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXRjaC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IE1hdGNoO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmUgICAgID0gcmVxdWlyZSgnLi9TY29yZScpO1xyXG5jb25zdCBQaWUgICAgICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvUGllJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgd29ybGQgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHNjb3JlcyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG4gICAgY29sb3IgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgaXhDb2xvcjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1BpZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hdGNoV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1Njb3JlcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbG9yICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5jb2xvciwgbmV4dFByb3BzLmNvbG9yKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3JlcyB8fCBuZXdDb2xvciB8fCBuZXdXb3JsZCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdTY29yZXMsIG5ld0NvbG9yLCBuZXdXb3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoV29ybGRzOjpyZW5kZXIoKScpO1xyXG5cclxuICAgICAgICByZXR1cm4gPHRyPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBuYW1lICR7cHJvcHMuY29sb3J9YH0+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3Byb3BzLndvcmxkLmdldCgnbmFtZScpfVxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke3Byb3BzLmNvbG9yfWB9PlxyXG4gICAgICAgICAgICAgICAgPFNjb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdGVhbSAgPSB7cHJvcHMuY29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmUgPSB7cHJvcHMuc2NvcmVzLmdldChwcm9wcy5peENvbG9yKX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIHsocHJvcHMuc2hvd1BpZSlcclxuICAgICAgICAgICAgICAgID8gPHRkIHJvd1NwYW49XCIzXCIgY2xhc3NOYW1lPVwicGllXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFBpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZXMgPSB7cHJvcHMuc2NvcmVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplICAgPSB7NjB9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIDwvdHI+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXRjaFdvcmxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXRjaFdvcmxkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuLy8gY29uc3QgJCAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPXtcclxuICAgIHNjb3JlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0UHJvcHMgPXtcclxuICAgIHNjb3JlOiAwLFxyXG59O1xyXG5cclxuY2xhc3MgU2NvcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZGlmZjogMCxcclxuICAgICAgICAgICAgJGRpZmZOb2RlOiBudWxsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlmZjogbmV4dFByb3BzLnNjb3JlIC0gcHJvcHMuc2NvcmV9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIGlmKHN0YXRlLmRpZmYgIT09IDApIHtcclxuICAgICAgICAgICAgYW5pbWF0ZVNjb3JlRGlmZih0aGlzLnN0YXRlLiRkaWZmTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY2FjaGUgalF1ZXJ5IG9iamVjdCB0byBzdGF0ZVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAkZGlmZk5vZGU6ICQodGhpcy5yZWZzLmRpZmYuZ2V0RE9NTm9kZSgpKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8ZGl2PlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaWZmXCIgcmVmPVwiZGlmZlwiPntnZXREaWZmVGV4dCh0aGlzLnN0YXRlLmRpZmYpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57Z2V0U2NvcmVUZXh0KHRoaXMucHJvcHMuc2NvcmUpfTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlU2NvcmVEaWZmKCRlbCkge1xyXG4gICAgJGVsXHJcbiAgICAgICAgLnZlbG9jaXR5KCdzdG9wJylcclxuICAgICAgICAudmVsb2NpdHkoe29wYWNpdHk6IDB9LCB7ZHVyYXRpb246IDB9KVxyXG4gICAgICAgIC52ZWxvY2l0eSh7b3BhY2l0eTogMX0sIHtkdXJhdGlvbjogMjAwfSlcclxuICAgICAgICAudmVsb2NpdHkoe29wYWNpdHk6IDB9LCB7ZHVyYXRpb246IDgwMCwgZGVsYXk6IDEwMDB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldERpZmZUZXh0KGRpZmYpIHtcclxuICAgIHJldHVybiAoZGlmZilcclxuICAgICAgICA/IG51bWVyYWwoZGlmZikuZm9ybWF0KCcrMCwwJylcclxuICAgICAgICA6IG51bGw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTY29yZVRleHQoc2NvcmUpIHtcclxuICAgIHJldHVybiAoc2NvcmUpXHJcbiAgICAgICAgPyBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpXHJcbiAgICAgICAgOiBudWxsO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblNjb3JlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxuU2NvcmUuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBTY29yZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaCAgICAgPSByZXF1aXJlKCcuL01hdGNoJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3twYWRkaW5nTGVmdDogJy41ZW0nfX0+PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCIgLz48L3NwYW4+O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHJlZ2lvbiA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaGVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGRzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hdGNoZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbiAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24sIG5leHRQcm9wcy5yZWdpb24pO1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGNoZXMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaGVzLCBuZXh0UHJvcHMubWF0Y2hlcyk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1JlZ2lvbiB8fCBuZXdNYXRjaGVzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCB7c2hvdWxkVXBkYXRlLCBuZXdSZWdpb24sIG5ld01hdGNoZXMsIG5ld1dvcmxkc30pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknLCAncmVnaW9uJywgcHJvcHMucmVnaW9uLnRvSlMoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdtYXRjaGVzJywgcHJvcHMubWF0Y2hlcy50b0pTKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknLCAnd29ybGRzJywgcHJvcHMud29ybGRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J1JlZ2lvbk1hdGNoZXMnPlxyXG4gICAgICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgICAgIHtwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgeyFwcm9wcy5tYXRjaGVzLnNpemUgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICA8L2gyPlxyXG5cclxuICAgICAgICAgICAgICAgIHtwcm9wcy5tYXRjaGVzLm1hcChtYXRjaCA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgICAgICAgPSB7bWF0Y2guZ2V0KCdpZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSAnbWF0Y2gnXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZHMgICAgPSB7cHJvcHMud29ybGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCAgICAgPSB7bWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXRjaGVzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgPSBNYXRjaGVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdXb3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1dvcmxkOjpyZW5kZXInLCBwcm9wcy53b3JsZC50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+XHJcbiAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBXb3JsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbiAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSwgbmV4dFByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdSZWdpb24pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OlJlZ2lvbldvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld1JlZ2lvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Oldvcmxkczo6cmVuZGVyKCknLCBwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpLCBwcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKS50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlZ2lvbldvcmxkc1wiPlxyXG4gICAgICAgICAgICAgICAgPGgyPntwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBXb3JsZHM8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGRzLm1hcCh3b3JsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V29ybGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgID0ge3dvcmxkLmdldCgnaWQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuV29ybGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IFdvcmxkcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogICBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiAgIERhdGFcclxuKi9cclxuXHJcbmNvbnN0IERBTyA9IHJlcXVpcmUoJ2xpYi9kYXRhL292ZXJ2aWV3Jyk7XHJcblxyXG5cclxuLypcclxuKiAgIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoZXMgICAgICA9IHJlcXVpcmUoJy4vTWF0Y2hlcycpO1xyXG5jb25zdCBXb3JsZHMgICAgICAgPSByZXF1aXJlKCcuL1dvcmxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBPdmVydmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8gPSBuZXcgREFPKHtcclxuICAgICAgICAgICAgb25NYXRjaERhdGE6IHRoaXMub25NYXRjaERhdGEuYmluZCh0aGlzKSxcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHJlZ2lvbnM6IEltbXV0YWJsZS5mcm9tSlMoe1xyXG4gICAgICAgICAgICAgICAgJzEnOiB7bGFiZWw6ICdOQScsIGlkOiAnMSd9LFxyXG4gICAgICAgICAgICAgICAgJzInOiB7bGFiZWw6ICdFVScsIGlkOiAnMid9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBtYXRjaGVzQnlSZWdpb246IEltbXV0YWJsZS5mcm9tSlMoeycxJzoge30sICcyJzoge319KSxcclxuICAgICAgICAgICAgd29ybGRzQnlSZWdpb246IHRoaXMuZGFvLmdldFdvcmxkc0J5UmVnaW9uKHByb3BzLmxhbmcpIC8vSW1tdXRhYmxlLmZyb21KUyh7JzEnOiB7fSwgJzInOiB7fX0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hEYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hdGNoZXNCeVJlZ2lvbiwgbmV4dFN0YXRlLm1hdGNoZXNCeVJlZ2lvbik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3TWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld01hdGNoRGF0YX0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcpO1xyXG4gICAgICAgIC8vIHNldFdvcmxkcy5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5pbml0KHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGlmICghSW1tdXRhYmxlLmlzKG5leHRQcm9wcy5sYW5nLCB0aGlzLnByb3BzLmxhbmcpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkc0J5UmVnaW9uID0gdGhpcy5kYW8uZ2V0V29ybGRzQnlSZWdpb24obmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt3b3JsZHNCeVJlZ2lvbn0pO1xyXG5cclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGlkPVwib3ZlcnZpZXdcIj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3RoaXMuc3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbiAgPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0ge3RoaXMuc3RhdGUubWF0Y2hlc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxociAvPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj57dGhpcy5zdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb24gPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZHMgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBvbk1hdGNoRGF0YShtYXRjaERhdGEpIHtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaGVzQnlSZWdpb24gPSB0aGlzLmRhby5nZXRNYXRjaGVzQnlSZWdpb24obWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBtYXRjaGVzQnlSZWdpb246IHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5tZXJnZURlZXAobmV3TWF0Y2hlc0J5UmVnaW9uKVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERpcmVjdCBET00gTWFuaXB1bGF0aW9uXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nKSB7XHJcbiAgICBsZXQgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcbiAgICBpZiAobGFuZy5nZXQoJ3NsdWcnKSAhPT0gJ2VuJykge1xyXG4gICAgICAgIHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgndGl0bGUnKS50ZXh0KHRpdGxlLmpvaW4oJyAtICcpKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuT3ZlcnZpZXcucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgPSBPdmVydmlldztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJy4uL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBvYmplY3RpdmVDb2xzID0ge1xyXG4gICAgZWxhcHNlZCAgOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiB0cnVlLFxyXG4gICAgbWFwQWJicmV2OiB0cnVlLFxyXG4gICAgYXJyb3cgICAgOiB0cnVlLFxyXG4gICAgc3ByaXRlICAgOiB0cnVlLFxyXG4gICAgbmFtZSAgICAgOiB0cnVlLFxyXG4gICAgZXZlbnRUeXBlOiBmYWxzZSxcclxuICAgIGd1aWxkTmFtZTogZmFsc2UsXHJcbiAgICBndWlsZFRhZyA6IGZhbHNlLFxyXG4gICAgdGltZXIgICAgOiBmYWxzZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPXtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBHdWlsZENsYWltcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdDbGFpbXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSwgbmV4dFByb3BzLmd1aWxkLmdldCgnY2xhaW1zJykpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDbGFpbXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBjbGFpbXMgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgIHtjbGFpbXMubWFwKGVudHJ5ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17ZW50cnkuZ2V0KCdpZCcpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtlbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZENvbG9yICA9IHtlbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXAgICA9IHtlbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZENsYWltcy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgICA9IEd1aWxkQ2xhaW1zO1xyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEVtYmxlbSAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuY29uc3QgQ2xhaW1zICAgID0gcmVxdWlyZSgnLi9DbGFpbXMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8aDEgc3R5bGU9e3t3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLCBvdmVyZmxvdzogXCJoaWRkZW5cIiwgdGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCJ9fT5cclxuICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiIC8+XHJcbiAgICB7JyBMb2FkaW5nLi4uJ31cclxuPC9oMT47XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFSZWFkeSAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpO1xyXG5cclxuICAgICAgICBjb25zdCBndWlsZElkICAgICA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9pZCcpO1xyXG4gICAgICAgIGNvbnN0IGd1aWxkTmFtZSAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuICAgICAgICBjb25zdCBndWlsZFRhZyAgICA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCd0YWcnKTtcclxuICAgICAgICBjb25zdCBndWlsZENsYWltcyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGRMaW5rICAgPSAoZ3VpbGROYW1lKVxyXG4gICAgICAgICAgICA/IGBodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLyR7c2x1Z2lmeShndWlsZE5hbWUpfWBcclxuICAgICAgICAgICAgOiBgaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tLyR7Z3VpbGRJZH1gO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnR3VpbGQ6OnJlbmRlcigpJywgZ3VpbGRJZCwgZ3VpbGROYW1lKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3VpbGRcIiBpZD17Z3VpbGRJZH0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2d1aWxkTGlua30gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGtleT17Z3VpbGRJZH0gZ3VpbGROYW1lPXtndWlsZE5hbWV9IHNpemU9ezI1Nn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0yMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KGRhdGFSZWFkeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPGgxPjxhIGhyZWY9e2d1aWxkTGlua30gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2d1aWxkTmFtZX0gW3tndWlsZFRhZ31dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPGRpdj57bG9hZGluZ0h0bWx9PGJyIC8+e2d1aWxkSWR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHshZ3VpbGRDbGFpbXMuaXNFbXB0eSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxDbGFpbXMgey4uLnRoaXMucHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzbHVnaWZ5KHN0cikge1xyXG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIucmVwbGFjZSgvIC9nLCAnLScpKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gR3VpbGQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBHdWlsZCAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0d1aWxkczo6cmVuZGVyKCknKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvcHMuZ3VpbGRzJywgcHJvcHMuZ3VpbGRzLnRvT2JqZWN0KCkpO1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0ZWRHdWlsZHMgPSBwcm9wcy5ndWlsZHMudG9TZXEoKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IGd1aWxkLmdldCgnZ3VpbGRfbmFtZScpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IC1ndWlsZC5nZXQoJ2xhc3RDbGFpbScpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJndWlsZHNcIj5cclxuICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRlclwiPkd1aWxkIENsYWltczwvaDI+XHJcbiAgICAgICAgICAgICAgICB7c29ydGVkR3VpbGRzLm1hcChndWlsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgICA9IHtndWlsZC5nZXQoJ2d1aWxkX2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgID0ge3Byb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkID0ge2d1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IEd1aWxkcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgJCAgICAgICAgID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCcuLi9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgY2FwdHVyZUNvbHMgPSB7XHJcbiAgICBlbGFwc2VkICA6IHRydWUsXHJcbiAgICB0aW1lc3RhbXA6IHRydWUsXHJcbiAgICBtYXBBYmJyZXY6IHRydWUsXHJcbiAgICBhcnJvdyAgICA6IHRydWUsXHJcbiAgICBzcHJpdGUgICA6IHRydWUsXHJcbiAgICBuYW1lICAgICA6IHRydWUsXHJcbiAgICBldmVudFR5cGU6IGZhbHNlLFxyXG4gICAgZ3VpbGROYW1lOiBmYWxzZSxcclxuICAgIGd1aWxkVGFnIDogZmFsc2UsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuY29uc3QgY2xhaW1Db2xzID0ge1xyXG4gICAgZWxhcHNlZCAgOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiB0cnVlLFxyXG4gICAgbWFwQWJicmV2OiB0cnVlLFxyXG4gICAgYXJyb3cgICAgOiB0cnVlLFxyXG4gICAgc3ByaXRlICAgOiB0cnVlLFxyXG4gICAgbmFtZSAgICAgOiB0cnVlLFxyXG4gICAgZXZlbnRUeXBlOiBmYWxzZSxcclxuICAgIGd1aWxkTmFtZTogdHJ1ZSxcclxuICAgIGd1aWxkVGFnIDogdHJ1ZSxcclxuICAgIHRpbWVyICAgIDogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBlbnRyeSAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuICAgIG1hcEZpbHRlciAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBldmVudEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGQgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcbiAgICAgICAgY29uc3QgbmV3RW50cnkgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZW50cnksIG5leHRQcm9wcy5lbnRyeSk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgICAgPSAobmV3R3VpbGQgfHwgbmV3RW50cnkpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdNYXBGaWx0ZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXBGaWx0ZXIsIG5leHRQcm9wcy5tYXBGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld0V2ZW50RmlsdGVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld0ZpbHRlcnMgICAgID0gKG5ld01hcEZpbHRlciB8fCBuZXdFdmVudEZpbHRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSAgID0gKG5ld0xhbmcgfHwgbmV3RGF0YSB8fCBuZXdGaWx0ZXJzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OkxvZzo6RW50cnk6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgbmV3UmVtb3RlTm93LCBuZXh0UHJvcHMucmVtb3RlTm93KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnRW50cnk6cmVuZGVyKCknKTtcclxuICAgICAgICBjb25zdCBldmVudFR5cGUgPSB0aGlzLnByb3BzLmVudHJ5LmdldCgndHlwZScpO1xyXG4gICAgICAgIGNvbnN0IGNvbHMgICAgICA9IChldmVudFR5cGUgPT09ICdjbGFpbScpID8gY2xhaW1Db2xzIDogY2FwdHVyZUNvbHM7XHJcbiAgICAgICAgY29uc3Qgb01ldGEgICAgID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhW3RoaXMucHJvcHMuZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpXTtcclxuICAgICAgICBjb25zdCBtYXBDb2xvciAgPSBfLmZpbmQoU1RBVElDLm9iamVjdGl2ZV9tYXAsIG1hcCA9PiBtYXAubWFwSW5kZXggPT09IG9NZXRhLm1hcCkuY29sb3I7XHJcblxyXG5cclxuICAgICAgICBjb25zdCBtYXRjaGVzTWFwRmlsdGVyICAgPSB0aGlzLnByb3BzLm1hcEZpbHRlciA9PT0gJ2FsbCcgfHwgdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09IG1hcENvbG9yO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoZXNFdmVudEZpbHRlciA9IHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09IGV2ZW50VHlwZTtcclxuICAgICAgICBjb25zdCBzaG91bGRCZVZpc2libGUgICAgPSAobWF0Y2hlc01hcEZpbHRlciAmJiBtYXRjaGVzRXZlbnRGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSAgICAgICAgICA9IHNob3VsZEJlVmlzaWJsZSA/ICdzaG93LWVudHJ5JyA6ICdoaWRlLWVudHJ5JztcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgICAgICA8T2JqZWN0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xzICAgICAgICA9IHtjb2xzfVxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgICAgID0ge3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICBndWlsZCAgICAgICA9IHt0aGlzLnByb3BzLmd1aWxkfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbnRyeUlkICAgICA9IHt0aGlzLnByb3BzLmVudHJ5LmdldCgnaWQnKX1cclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKX1cclxuICAgICAgICAgICAgICAgICAgICB3b3JsZENvbG9yICA9IHt0aGlzLnByb3BzLmVudHJ5LmdldCgnd29ybGQnKX1cclxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXAgICA9IHt0aGlzLnByb3BzLmVudHJ5LmdldCgndGltZXN0YW1wJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuRW50cnkucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBFbnRyeTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBldmVudEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnYWxsJywgJ2NhcHR1cmUnLCAnY2xhaW0nXSkuaXNSZXF1aXJlZCxcclxuICAgIHNldEV2ZW50ICAgOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLmV2ZW50RmlsdGVyICE9PSBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGxpbmtDbGFpbXMgICA9IDxhIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiY2xhaW1cIj5DbGFpbXM8L2E+O1xyXG4gICAgICAgIGNvbnN0IGxpbmtDYXB0dXJlcyA9IDxhIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiY2FwdHVyZVwiPkNhcHR1cmVzPC9hPjtcclxuICAgICAgICBjb25zdCBsaW5rQWxsICAgICAgPSA8YSBvbkNsaWNrPXt0aGlzLnByb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImFsbFwiPkFsbDwvYT47XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBpZD1cImxvZy1ldmVudC1maWx0ZXJzXCIgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxsc1wiPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdjbGFpbScpICAgPyAnYWN0aXZlJzogbnVsbH0+e2xpbmtDbGFpbXN9PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9eyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnY2FwdHVyZScpID8gJ2FjdGl2ZSc6IG51bGx9PntsaW5rQ2FwdHVyZXN9PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9eyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJykgICA/ICdhY3RpdmUnOiBudWxsfT57bGlua0FsbH08L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBGaWx0ZXJzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBGaWx0ZXJzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgRW50cnkgICAgID0gcmVxdWlyZSgnLi9FbnRyeScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9e1xyXG4gICAgZ3VpbGRzOiB7fSxcclxufTtcclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgICAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRIaXN0b3J5ICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcbiAgICB0cmlnZ2VyTm90aWZpY2F0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgbWFwRmlsdGVyICAgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRGaWx0ZXIgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTG9nRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RXZlbnRzICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50SGlzdG9yeSwgbmV4dFByb3BzLmV2ZW50SGlzdG9yeSk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdFdmVudHMpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdUcmlnZ2VyU3RhdGUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbiwgbmV4dFByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG4gICAgICAgIGNvbnN0IG5ld0ZpbHRlclN0YXRlICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXBGaWx0ZXIsIG5leHRQcm9wcy5tYXBGaWx0ZXIpIHx8ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdPcHRpb25zICAgICAgPSAobmV3VHJpZ2dlclN0YXRlIHx8IG5ld0ZpbHRlclN0YXRlKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlICAgID0gKG5ld0xhbmcgfHwgbmV3RGF0YSB8fCBuZXdPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OkxvZ0VudHJpZXM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdEYXRhLCBuZXdPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMb2dFbnRyaWVzOjpyZW5kZXIoKScsIHByb3BzLm1hcEZpbHRlciwgcHJvcHMuZXZlbnRGaWx0ZXIsIHByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJsb2dcIj5cclxuICAgICAgICAgICAgICAgIHtwcm9wcy5ldmVudEhpc3RvcnkubWFwKGVudHJ5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBldmVudFR5cGUgPSBlbnRyeS5nZXQoJ3R5cGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyeUlkICAgPSBlbnRyeS5nZXQoJ2lkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBndWlsZElkLCBndWlsZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgPSBlbnRyeS5nZXQoJ2d1aWxkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkICAgPSAocHJvcHMuZ3VpbGRzLmhhcyhndWlsZElkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPEVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICAgICAgICAgICAgPSB7ZW50cnlJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ICAgICAgICAgICA9ICdsaSdcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJOb3RpZmljYXRpb24gPSB7cHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyICAgICAgICAgICA9IHtwcm9wcy5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50RmlsdGVyICAgICAgICAgPSB7cHJvcHMuZXZlbnRGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICAgICAgICAgID0ge3Byb3BzLmxhbmd9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICAgICAgICAgID0ge2d1aWxkSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5ICAgICAgICAgICAgICAgPSB7ZW50cnl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkICAgICAgICAgICAgICAgPSB7Z3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgLz47XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Mb2dFbnRyaWVzLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcclxuTG9nRW50cmllcy5wcm9wVHlwZXMgICAgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgICAgID0gTG9nRW50cmllcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPXtcclxuICAgIG1hcEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgc2V0V29ybGQgOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLm1hcEZpbHRlciAhPT0gbmV4dFByb3BzLm1hcEZpbHRlcik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJsb2ctbWFwLWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHByb3BzLm1hcEZpbHRlciA9PT0gJ2FsbCcpID8gJ2FjdGl2ZSc6ICdudWxsJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17cHJvcHMuc2V0V29ybGR9IGRhdGEtZmlsdGVyPVwiYWxsXCI+QWxsPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuXHJcbiAgICAgICAgICAgICAgICB7Xy5tYXAoU1RBVElDLm9iamVjdGl2ZV9tYXAsIG1hcE1ldGEgPT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXttYXBNZXRhLm1hcEluZGV4fSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09IG1hcE1ldGEuY29sb3IpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9e21hcE1ldGEuY29sb3J9PnttYXBNZXRhLmFiYnJ9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBGaWx0ZXJzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBGaWx0ZXJzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG4vLyBjb25zdCBTVEFUSUMgICAgICAgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwRmlsdGVycyAgID0gcmVxdWlyZSgnLi9NYXBGaWx0ZXJzJyk7XHJcbmNvbnN0IEV2ZW50RmlsdGVycyA9IHJlcXVpcmUoJy4vRXZlbnRGaWx0ZXJzJyk7XHJcbmNvbnN0IExvZ0VudHJpZXMgICA9IHJlcXVpcmUoJy4vTG9nRW50cmllcycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkcyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1hcEZpbHRlciAgICAgICAgICA6ICdhbGwnLFxyXG4gICAgICAgICAgICBldmVudEZpbHRlciAgICAgICAgOiAnYWxsJyxcclxuICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbjogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdIaXN0b3J5ICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpLCBuZXh0UHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKSk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgICAgPSAobmV3R3VpbGRzIHx8IG5ld0hpc3RvcnkpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdNYXBGaWx0ZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5tYXBGaWx0ZXIsIG5leHRTdGF0ZS5tYXBGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld0V2ZW50RmlsdGVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmV2ZW50RmlsdGVyLCBuZXh0U3RhdGUuZXZlbnRGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld0ZpbHRlcnMgICAgID0gKG5ld01hcEZpbHRlciB8fCBuZXdFdmVudEZpbHRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSAgID0gKG5ld0xhbmcgfHwgbmV3RGF0YSB8fCBuZXdGaWx0ZXJzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OkxvZ3M6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdEYXRhLCBuZXdGaWx0ZXJzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEhpc3RvcnkgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJsb2ctY29udGFpbmVyXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTE2XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWFwRmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlciA9IHt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRXb3JsZCAgPSB7c2V0V29ybGQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXZlbnRGaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGaWx0ZXIgPSB7dGhpcy5zdGF0ZS5ldmVudEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFdmVudCAgICA9IHtzZXRFdmVudC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7IWV2ZW50SGlzdG9yeS5pc0VtcHR5KClcclxuICAgICAgICAgICAgICAgICAgICA/IDxMb2dFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJOb3RpZmljYXRpb24gPSB7dGhpcy5zdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgID0ge3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZpbHRlciAgICAgICAgID0ge3RoaXMuc3RhdGUuZXZlbnRGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICAgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzICAgICAgICAgICAgICA9IHt0aGlzLnByb3BzLmd1aWxkc31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50SGlzdG9yeSAgICAgICAgPSB7ZXZlbnRIaXN0b3J5fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRXb3JsZChlKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcbiAgICBsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7bWFwRmlsdGVyOiBmaWx0ZXIsIHRyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRFdmVudChlKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcbiAgICBsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7ZXZlbnRGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTG9nLnByb3BUeXBlcyAgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzID0gTG9nO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCAgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzICA9IHJlcXVpcmUoJy4vTWFwU2NvcmVzJyk7XHJcbmNvbnN0IE1hcFNlY3Rpb24gPSByZXF1aXJlKCcuL01hcFNlY3Rpb24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBkZXRhaWxzICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkcyAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGV0YWlscyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBuZXdSZW1vdGVOb3csIG5leHRQcm9wcy5yZW1vdGVOb3cpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE1ldGEgICA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdrZXknKSA9PT0gdGhpcy5wcm9wcy5tYXBLZXkpO1xyXG4gICAgICAgIGNvbnN0IG1hcEluZGV4ICA9IG1hcE1ldGEuZ2V0KCdtYXBJbmRleCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgbWFwU2NvcmVzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnbWFwcycsICdzY29yZXMnLCBtYXBJbmRleF0pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczpyZW5kZXIoKScsIG1hcFNjb3Jlcy50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcFwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT17J3RlYW0gJyArIG1hcE1ldGEuZ2V0KCdjb2xvcicpfSBvbkNsaWNrPXtvblRpdGxlQ2xpY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXBTY29yZXMgc2NvcmVzPXttYXBTY29yZXN9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHttYXBNZXRhLmdldCgnc2VjdGlvbnMnKS5tYXAoKG1hcFNlY3Rpb24sIGl4U2VjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXBTZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ICA9IFwidWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICAgPSB7aXhTZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFNlY3Rpb24gPSB7bWFwU2VjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBNZXRhICAgID0ge21hcE1ldGF9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uVGl0bGVDbGljayhlKSB7XHJcbiAgICBsZXQgJG1hcHMgICAgPSAkKCcubWFwJyk7XHJcbiAgICBsZXQgJG1hcCAgICAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWFwJywgJG1hcHMpO1xyXG5cclxuICAgIGxldCBoYXNGb2N1cyA9ICRtYXAuaGFzQ2xhc3MoJ21hcC1mb2N1cycpO1xyXG5cclxuXHJcbiAgICBpZighaGFzRm9jdXMpIHtcclxuICAgICAgICAkbWFwXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWFwLWZvY3VzJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuICAgICAgICAkbWFwcy5ub3QoJG1hcClcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21hcC1ibHVyJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAkbWFwc1xyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcC1mb2N1cycpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBEZXRhaWxzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBEZXRhaWxzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBudW1lcmFsICAgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBTY29yZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1Njb3JlcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc2NvcmVzLm1hcCgoc2NvcmUsIGl4U2NvcmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWQgPSBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlYW0gICAgICA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXVtpeFNjb3JlXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxsaSBrZXk9e3RlYW19IGNsYXNzTmFtZT17YHRlYW0gJHt0ZWFtfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0dGVkfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+O1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcFNjb3Jlcy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBNYXBTY29yZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCdUcmFja2VyL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogTW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiB0cnVlLFxyXG4gICAgdGltZXIgICAgOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIGRldGFpbHMgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgbWFwU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxufTtcclxuXHJcbmNsYXNzIE1hcFNlY3Rpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBTZWN0aW9uOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdvYmplY3RpdmVzJyk7XHJcbiAgICAgICAgY29uc3Qgb3duZXJzICAgICAgICA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IGNsYWltZXJzICAgICAgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb25DbGFzcyAgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtgbGlzdC11bnN0eWxlZCAke3NlY3Rpb25DbGFzc31gfT5cclxuICAgICAgICAgICAgICAgIHttYXBPYmplY3RpdmVzLm1hcChvYmplY3RpdmVJZCA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ0lkICAgICA9IG9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXIgICAgICAgID0gb3duZXJzLmdldChzdHJpbmdJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xhaW1lciAgICAgID0gY2xhaW1lcnMuZ2V0KHN0cmluZ0lkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGRJZCAgICAgID0gKGNsYWltZXIpID8gY2xhaW1lci5nZXQoJ2d1aWxkJykgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc0NsYWltZXIgICA9ICEhZ3VpbGRJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzR3VpbGREYXRhID0gaGFzQ2xhaW1lciAmJiB0aGlzLnByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGQgICAgICAgID0gaGFzR3VpbGREYXRhID8gdGhpcy5wcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpIDogbnVsbDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtvYmplY3RpdmVJZH0gaWQ9eydvYmplY3RpdmUtJyArIG9iamVjdGl2ZUlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkQ29sb3IgID0ge293bmVyLmdldCgnd29ybGQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge293bmVyLmdldCgndGltZXN0YW1wJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7Z3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT47XHJcblxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0U2VjdGlvbkNsYXNzKG1hcEtleSwgc2VjdGlvbkxhYmVsKSB7XHJcbiAgICBsZXQgc2VjdGlvbkNsYXNzID0gW1xyXG4gICAgICAgICdjb2wtbWQtMjQnLFxyXG4gICAgICAgICdtYXAtc2VjdGlvbicsXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChtYXBLZXkgPT09ICdDZW50ZXInKSB7XHJcbiAgICAgICAgaWYgKHNlY3Rpb25MYWJlbCA9PT0gJ0Nhc3RsZScpIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlY3Rpb25DbGFzcy5qb2luKCcgJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBTZWN0aW9uLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBTZWN0aW9uO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcERldGFpbHMgPSByZXF1aXJlKCcuL01hcERldGFpbHMnKTtcclxuY29uc3QgTG9nICAgICAgICA9IHJlcXVpcmUoJ1RyYWNrZXIvTG9nJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgZGV0YWlscyAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzRGF0YUluaXRpYWxpemVkID0gcHJvcHMuZGV0YWlscy5nZXQoJ2luaXRpYWxpemVkJyk7XHJcblxyXG4gICAgICAgIGlmICghaXNEYXRhSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJtYXBzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkNlbnRlclwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTE4XCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJSZWRIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiQmx1ZUhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJHcmVlbkhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMb2cgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcHMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IEVtYmxlbSAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgc2hvd05hbWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBzaG93VGFnIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkSWQgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgZ3VpbGQgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld1Nob3cgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zaG93TmFtZSwgbmV4dFByb3BzLnNob3dOYW1lKSB8fCAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2hvd1RhZywgbmV4dFByb3BzLnNob3dUYWcpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdHdWlsZCB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyAgICAgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBjb25zdCBoYXNHdWlsZCAgPSAhIXRoaXMucHJvcHMuZ3VpbGRJZDtcclxuICAgICAgICBjb25zdCBpc0VuYWJsZWQgPSAoaGFzR3VpbGQgJiYgKHRoaXMucHJvcHMuc2hvd05hbWUgfHwgdGhpcy5wcm9wcy5zaG93VGFnKSk7XHJcblxyXG4gICAgICAgIGlmICghaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaGFzR3VpbGREYXRhID0gKHByb3BzLmd1aWxkICYmIHByb3BzLmd1aWxkLmdldCgnbG9hZGVkJykpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ3VpbGRJZCA9IHByb3BzLmd1aWxkSWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGhyZWYgICAgPSBgIyR7Z3VpbGRJZH1gO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgICA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT47XHJcbiAgICAgICAgICAgIGxldCB0aXRsZSAgICAgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhhc0d1aWxkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFnICA9IHByb3BzLmd1aWxkLmdldCgndGFnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLnNob3dOYW1lICYmIHByb3BzLnNob3dUYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtgJHtuYW1lfSBbJHt0YWd9XSBgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkTmFtZT17bmFtZX0gc2l6ZT17MjB9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BzLnNob3dOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGAke25hbWV9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBgJHt0YWd9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGAke25hbWV9IFske3RhZ31dYDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxhIGNsYXNzTmFtZT1cImd1aWxkbmFtZVwiIGhyZWY9e2hyZWZ9IHRpdGxlPXt0aXRsZX0+XHJcbiAgICAgICAgICAgICAgICB7Y29udGVudH1cclxuICAgICAgICAgICAgPC9hPjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gR3VpbGQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTcHJpdGUgICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvU3ByaXRlJyk7XHJcbmNvbnN0IEFycm93ICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9BcnJvdycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzaG93QXJyb3cgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHNob3dTcHJpdGUgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgb2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGNvbG9yICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBJY29ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLnNob3dBcnJvdyAmJiAhdGhpcy5wcm9wcy5zaG93U3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb01ldGEgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9UeXBlSWQgPSBvTWV0YS5nZXQoJ3R5cGUnKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjb25zdCBvVHlwZSAgID0gU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQob1R5cGVJZCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtaWNvbnNcIj5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy5zaG93QXJyb3cpID9cclxuICAgICAgICAgICAgICAgICAgICA8QXJyb3cgb01ldGE9e29NZXRhfSAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsfVxyXG5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy5zaG93U3ByaXRlKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlICA9IHtvVHlwZS5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5JY29ucy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEljb25zO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9MYWJlbCAgID0gU1RBVElDLm9iamVjdGl2ZV9sYWJlbHMuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e29MYWJlbC5nZXQobGFuZ1NsdWcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTGFiZWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZCAgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgb2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcE5hbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgLy8gbWFwIG5hbWUgY2FuIG5ldmVyIGNoYW5nZSwgbm90IGxvY2FsaXplZFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb01ldGEgICAgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXBJbmRleCA9IG9NZXRhLmdldCgnbWFwJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcE1ldGEgID0gU1RBVElDLm9iamVjdGl2ZV9tYXAuZmluZChtbSA9PiBtbS5nZXQoJ21hcEluZGV4JykgPT09IG1hcEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1tYXBcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPXttYXBNZXRhLmdldCgnbmFtZScpfT5cclxuICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ2FiYnInKX1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwTmFtZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgID0gTWFwTmFtZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogICBUSEUgQ09OVEVOVCBPRiBDT01QT05FTlQgSVMgTUFOQUdFRCBFWFRFUk5BTExZXHJcbiogICBsaWIudHJhY2tlclRpbWVycyBJUyBJTklUSUFMSVpFRCBJTiBUcmFja2VyLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5jb25zdCBzcGlubmVyICAgPSAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgaXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUaW1lckNvdW50ZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3SXNFbmFibGVkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmlzRW5hYmxlZCwgbmV4dFByb3BzLmlzRW5hYmxlZCk7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0lzRW5hYmxlZCB8fCBuZXdUaW1lc3RhbXApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gPHNwYW5cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndGltZXIgY291bnRkb3duIGluYWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgZGF0YS10aW1lc3RhbXA9e3RoaXMucHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICA+PC9zcGFuPjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRpbWVyQ291bnRkb3duLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgID0gVGltZXJDb3VudGRvd247XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qICAgVEhFIENPTlRFTlQgT0YgQ09NUE9ORU5UIElTIE1BTkFHRUQgRVhURVJOQUxMWVxyXG4qICAgbGliLnRyYWNrZXJUaW1lcnMgSVMgSU5JVElBTElaRUQgSU4gVHJhY2tlci5jb21wb25lbnREaWRNb3VudCgpO1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuY29uc3Qgc3Bpbm5lciAgID0gIDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT47XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICB0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFRpbWVyUmVsYXRpdmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtcmVsYXRpdmVcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGltZXIgcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGltZXN0YW1wPXt0aGlzLnByb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgID57c3Bpbm5lcn08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRpbWVyUmVsYXRpdmUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgICA9IFRpbWVyUmVsYXRpdmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG1vbWVudCAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICB0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFRpbWVzdGFtcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS10aW1lc3RhbXBcIj5cclxuICAgICAgICAgICAgICAgIHttb21lbnQoKHRoaXMucHJvcHMudGltZXN0YW1wKSAqIDEwMDApLmZvcm1hdCgnaGg6bW06c3MnKX1cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVGltZXN0YW1wLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICA9IFRpbWVzdGFtcDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICAgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBUaW1lclJlbGF0aXZlICA9IHJlcXVpcmUoJy4vVGltZXJSZWxhdGl2ZScpO1xyXG5jb25zdCBUaW1lc3RhbXAgICAgICA9IHJlcXVpcmUoJy4vVGltZXN0YW1wJyk7XHJcbmNvbnN0IE1hcE5hbWUgICAgICAgID0gcmVxdWlyZSgnLi9NYXBOYW1lJyk7XHJcbmNvbnN0IEljb25zICAgICAgICAgID0gcmVxdWlyZSgnLi9JY29ucycpO1xyXG5jb25zdCBMYWJlbCAgICAgICAgICA9IHJlcXVpcmUoJy4vTGFiZWwnKTtcclxuY29uc3QgR3VpbGQgICAgICAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcbmNvbnN0IFRpbWVyQ291bnRkb3duID0gcmVxdWlyZSgnLi9UaW1lckNvdW50ZG93bicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xEZWZhdWx0cyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogZmFsc2UsXHJcbiAgICBzcHJpdGUgICA6IGZhbHNlLFxyXG4gICAgbmFtZSAgICAgOiBmYWxzZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiBmYWxzZSxcclxuICAgIHRpbWVyICAgIDogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZENvbG9yIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGV2ZW50VHlwZSAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cclxuICAgIGd1aWxkSWQgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgZ3VpbGQgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cclxuICAgIGNvbHMgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG59O1xyXG5cclxuY2xhc3MgT2JqZWN0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdDYXB0dXJlICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBuZXdPd25lciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRDb2xvciwgbmV4dFByb3BzLndvcmxkQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NsYWltZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpPYmplY3RpdmVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdPYmplY3RpdmU6cmVuZGVyKCknLCB0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0aXZlSWQgPSB0aGlzLnByb3BzLm9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3Qgb01ldGEgICAgICAgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KG9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgLy8gc2hvcnQgY2lyY3VpdFxyXG4gICAgICAgIGlmIChvTWV0YS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb2xzID0gXy5kZWZhdWx0cyh0aGlzLnByb3BzLmNvbHMsIGNvbERlZmF1bHRzKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lID0ge2BvYmplY3RpdmUgdGVhbSAke3RoaXMucHJvcHMud29ybGRDb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxUaW1lclJlbGF0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLmVsYXBzZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7cHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxUaW1lc3RhbXBcclxuICAgICAgICAgICAgICAgICAgICBpc0VuYWJsZWQgICA9IHshIWNvbHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8TWFwTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIGlzRW5hYmxlZCAgID0geyEhY29scy5tYXBBYmJyZXZ9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxJY29uc1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dBcnJvdyAgID0geyEhY29scy5hcnJvd31cclxuICAgICAgICAgICAgICAgICAgICBzaG93U3ByaXRlICA9IHshIWNvbHMuc3ByaXRlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZUlkID0ge29iamVjdGl2ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yICAgICAgID0ge3RoaXMucHJvcHMud29ybGRDb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPExhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TmFtZSA9IHshIWNvbHMuZ3VpbGROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93VGFnICA9IHshIWNvbHMuZ3VpbGRUYWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgID0ge3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8VGltZXJDb3VudGRvd25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkID0geyEhY29scy50aW1lcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk9iamVjdGl2ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBPYmplY3RpdmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy8vU3ByaXRlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgY29sb3IgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICB0eXBlUXVhbnRpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHR5cGVJZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3NJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQocHJvcHMudHlwZUlkKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UXVhbnRpdHkgID0gKHRoaXMucHJvcHMudHlwZVF1YW50aXR5ICE9PSBuZXh0UHJvcHMudHlwZVF1YW50aXR5KTtcclxuICAgICAgICBjb25zdCBuZXdUeXBlICAgICAgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbG9yICAgICA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdRdWFudGl0eSB8fCBuZXdUeXBlIHx8IG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblxyXG4gICAgICAgIGlmIChuZXdUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe29UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldCh0aGlzLnByb3BzLnR5cGVJZCl9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OlNjb3JlYm9hcmQ6OkhvbGRpbmdzSXRlbTpyZW5kZXIoKScsIHRoaXMuc3RhdGUub1R5cGUudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge3RoaXMuc3RhdGUub1R5cGUuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAge2AgeCR7dGhpcy5wcm9wcy50eXBlUXVhbnRpdHl9YH1cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5nc0l0ZW0ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgID0gSG9sZGluZ3NJdGVtOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBJdGVtICAgICAgPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBjb2xvciAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0hvbGRpbmdzICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ob2xkaW5ncywgbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMuaG9sZGluZ3MubWFwKCh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIDxJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgID0ge3R5cGVJbmRleH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgICAgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlUXVhbnRpdHkgPSB7dHlwZVF1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVJZCAgICAgICA9IHsodHlwZUluZGV4KzEpLnRvU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvdWw+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICA9IEhvbGRpbmdzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBudW1lcmFsICAgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBIb2xkaW5ncyAgPSByZXF1aXJlKCcuL0hvbGRpbmdzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7aGVpZ2h0OiAnOTBweCcsIGZvbnRTaXplOiAnMzJwdCcsIGxpbmVIZWlnaHQ6ICc5MHB4J319PlxyXG4gICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHNjb3JlICAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB0aWNrICAgIDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZSAgICAgPSAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuICAgICAgICBjb25zdCBuZXdUaWNrICAgICAgPSAodGhpcy5wcm9wcy50aWNrICE9PSBuZXh0UHJvcHMudGljayk7XHJcbiAgICAgICAgY29uc3QgbmV3SG9sZGluZ3MgID0gKHRoaXMucHJvcHMuaG9sZGluZ3MgIT09IG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkIHx8IG5ld1Njb3JlIHx8IG5ld1RpY2sgfHwgbmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1gfT5cclxuICAgICAgICAgICAgICAgICAgICB7KHRoaXMucHJvcHMud29ybGQgJiYgSW1tdXRhYmxlLk1hcC5pc01hcCh0aGlzLnByb3BzLndvcmxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48YSBocmVmPXt0aGlzLnByb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy53b3JsZC5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtudW1lcmFsKHRoaXMucHJvcHMuc2NvcmUpLmZvcm1hdCgnMCwwJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bnVtZXJhbCh0aGlzLnByb3BzLnRpY2spLmZvcm1hdCgnKzAsMCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SG9sZGluZ3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2NvbG9yJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGluZ3M9e3RoaXMucHJvcHMuaG9sZGluZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBsb2FkaW5nSHRtbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFNjb3JlYm9hcmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc2NvcmVzJykpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZHMgfHwgbmV3U2NvcmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBzY29yZXMgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuICAgICAgICBjb25zdCB0aWNrcyAgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCd0aWNrcycpO1xyXG4gICAgICAgIGNvbnN0IGhvbGRpbmdzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ2hvbGRpbmdzJyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInJvd1wiIGlkPVwic2NvcmVib2FyZHNcIj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hdGNoV29ybGRzLm1hcCgod29ybGQsIGl4V29ybGQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgID0ge2l4V29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkICAgID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZSAgICA9IHtzY29yZXMuZ2V0KGl4V29ybGQpIHx8IDB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sgICAgID0ge3RpY2tzLmdldChpeFdvcmxkKSB8fCAwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob2xkaW5ncyA9IHtob2xkaW5ncy5nZXQoaXhXb3JsZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBTY29yZWJvYXJkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBsaWJzXHJcbiovXHJcblxyXG5jb25zdCBhcGkgICAgICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBsaWJEYXRlICAgICAgID0gcmVxdWlyZSgnbGliL2RhdGUnKTtcclxuY29uc3QgdHJhY2tlclRpbWVycyA9IHJlcXVpcmUoJ2xpYi90cmFja2VyVGltZXJzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5jb25zdCBEQU8gICAgICAgICAgID0gcmVxdWlyZSgnbGliL2RhdGEvdHJhY2tlcicpO1xyXG5jb25zdCBHdWlsZHNMaWIgICAgID0gcmVxdWlyZSgnbGliL2RhdGEvdHJhY2tlci9ndWlsZHMnKTtcclxuY29uc3QgU1RBVElDICAgICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZWJvYXJkICAgID0gcmVxdWlyZSgnLi9TY29yZWJvYXJkJyk7XHJcbmNvbnN0IE1hcHMgICAgICAgICAgPSByZXF1aXJlKCcuL01hcHMnKTtcclxuY29uc3QgR3VpbGRzICAgICAgICA9IHJlcXVpcmUoJy4vR3VpbGRzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qIEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IHVwZGF0ZVRpbWVJbnRlcnZhbCA9IDEwMDA7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUcmFja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgICAgUmVhY3QgTGlmZWN5Y2xlXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcblxyXG5cclxuICAgICAgICBjb25zdCBkYXRhTGlzdGVuZXJzID0ge1xyXG4gICAgICAgICAgICBvbk1hdGNoRGV0YWlsczogdGhpcy5vbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBvbkd1aWxkRGV0YWlsczogdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5kYW8gPSBuZXcgREFPKGRhdGFMaXN0ZW5lcnMpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhhc0RhdGEgICAgOiBmYWxzZSxcclxuICAgICAgICAgICAgbGFzdG1vZCAgICA6IDAsXHJcblxyXG4gICAgICAgICAgICB0aW1lICAgICAgIDoge1xyXG4gICAgICAgICAgICAgICAgbG9jYWwgIDogbGliRGF0ZS5kYXRlTm93KCksXHJcbiAgICAgICAgICAgICAgICByZW1vdGUgOiAwLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0IDogMCxcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG1hdGNoICAgICAgOiBJbW11dGFibGUuTWFwKHtsYXN0bW9kOjB9KSxcclxuICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IEltbXV0YWJsZS5MaXN0KCksXHJcbiAgICAgICAgICAgIGRldGFpbHMgICAgOiBJbW11dGFibGUuTWFwKCksXHJcbiAgICAgICAgICAgIGNsYWltRXZlbnRzOiBJbW11dGFibGUuTGlzdCgpLFxyXG4gICAgICAgICAgICBndWlsZHMgICAgIDogSW1tdXRhYmxlLk1hcCgpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBpbml0aWFsRGF0YSAgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuaGFzRGF0YSwgbmV4dFN0YXRlLmhhc0RhdGEpO1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGNoRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5sYXN0bW9kLCBuZXh0U3RhdGUubGFzdG1vZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmd1aWxkcywgbmV4dFN0YXRlLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKGluaXRpYWxEYXRhIHx8IG5ld01hdGNoRGF0YSB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmluaXQodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlVGltZXJzKCgpID0+IHNldEludGVydmFsKHRoaXMudXBkYXRlVGltZXJzLmJpbmQodGhpcyksIDEwMDApKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVycy5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCknLCBuZXdMYW5nKTtcclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1hdGNoV29ybGRzOiB0aGlzLmRhby5nZXRNYXRjaFdvcmxkcyhuZXh0UHJvcHMubGFuZywgdGhpcy5zdGF0ZS5tYXRjaClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XHJcbiAgICAvLyAgY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVcGRhdGUoKScpO1xyXG4gICAgLy8gfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0RhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwidHJhY2tlclwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxTY29yZWJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hXb3JsZHMgPSB7dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuICAgICAgICAgICAgICAgICAgICBtYXRjaCAgICAgICA9IHt0aGlzLnN0YXRlLm1hdGNofVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSAgICAgICAgPSB7dGhpcy5zdGF0ZS50aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHMgICAgID0ge3RoaXMuc3RhdGUuZGV0YWlsc31cclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFdvcmxkcyA9IHt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkcyAgICAgID0ge3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTI0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsoIXRoaXMuc3RhdGUuZ3VpbGRzLmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPEd1aWxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZSAgICAgICAgPSB7dGhpcy5zdGF0ZS50aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcyAgICAgID0ge3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltRXZlbnRzID0ge3RoaXMuc3RhdGUuY2xhaW1FdmVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIERhdGEgTGlzdGVuZXJzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIHVwZGF0ZVRpbWVycyhjYj1fLm5vb3ApIHtcclxuICAgICAgICBpZiAodGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgdHJhY2tlclRpbWVycy51cGRhdGUodGhpcy5zdGF0ZS50aW1lLm9mZnNldCwgY2IpO1xyXG4gICAgICAgICAgICB0aGlzLl9fdGltZW91dHMudXBkYXRlVGltZXJzID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCB1cGRhdGVUaW1lSW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBvbk1hdGNoRGV0YWlscyh0aW1lUmVtb3RlLCBtYXRjaERhdGEsIGRldGFpbHNEYXRhKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdG1vZCAgICAgID0gbWF0Y2hEYXRhLmdldCgnbGFzdG1vZCcpO1xyXG4gICAgICAgIGNvbnN0IGlzTW9kaWZpZWQgICA9IChsYXN0bW9kICE9PSB0aGlzLnN0YXRlLm1hdGNoLmdldCgnbGFzdG1vZCcpKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChpc01vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsYWltRXZlbnRzID0gdGhpcy5kYW8uZ3VpbGRzLmdldEV2ZW50c0J5VHlwZShkZXRhaWxzRGF0YSwgJ2NsYWltJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0aW1lTG9jYWwgICAgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdGVPZmZzZXQgPSB0aW1lTG9jYWwgLSB0aW1lUmVtb3RlO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lT2Zmc2V0ICAgPSAodGhpcy5zdGF0ZS50aW1lLm9mZnNldClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChyZW1vdGVPZmZzZXQgKyB0aGlzLnN0YXRlLnRpbWUub2Zmc2V0KSAvIDIgLy8gYXZlcmFnZSB3aXRoIHByZXZpb3VzIG9mZnNldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmVtb3RlT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IHtcclxuICAgICAgICAgICAgICAgIGxvY2FsIDogdGltZUxvY2FsLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJvdW5kKHRpbWVPZmZzZXQpLFxyXG4gICAgICAgICAgICAgICAgcmVtb3RlOiB0aW1lUmVtb3RlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIHVzZSB0cmFuc2FjdGlvbmFsIHNldFN0YXRlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgICAgIGhhc0RhdGE6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdG1vZCxcclxuICAgICAgICAgICAgICAgIHRpbWUsXHJcbiAgICAgICAgICAgICAgICBjbGFpbUV2ZW50cyxcclxuXHJcbiAgICAgICAgICAgICAgICBtYXRjaCAgOiBzdGF0ZS5tYXRjaC5tZXJnZURlZXAobWF0Y2hEYXRhKSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6IHN0YXRlLmRldGFpbHMubWVyZ2VEZWVwKGRldGFpbHNEYXRhKSxcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGFvLmd1aWxkcy5sb29rdXAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmd1aWxkcyxcclxuICAgICAgICAgICAgICAgIGRldGFpbHNEYXRhLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm1hdGNoV29ybGRzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IHRoaXMuZGFvLmdldE1hdGNoV29ybGRzKHRoaXMucHJvcHMubGFuZywgdGhpcy5zdGF0ZS5tYXRjaClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0SW1tZWRpYXRlKHNldE1hdGNoV29ybGRzLmJpbmQoY29tcG9uZW50LCBwcm9wcy5sYW5nKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBvbkd1aWxkRGV0YWlscyhndWlsZCwgZ3VpbGRJZCkge1xyXG4gICAgICAgIGNvbnN0IF9ndWlsZElkID0gZ3VpbGRJZCB8fCBndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmNsYWltRXZlbnRzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBndWlsZCA9IHRoaXMuZGFvLmd1aWxkcy5hdHRhY2hDbGFpbXModGhpcy5zdGF0ZS5jbGFpbUV2ZW50cywgZ3VpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBndWlsZHM6IHN0YXRlLmd1aWxkcy5tZXJnZUluKFtfZ3VpbGRJZF0sIGd1aWxkKVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBsZXQgbGFuZ1NsdWcgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgIGxldCB3b3JsZE5hbWUgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICduYW1lJ10pO1xyXG5cclxuICAgIGxldCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICAkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVHJhY2tlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgID0gVHJhY2tlcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIG9NZXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0aXZlTWV0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vTWV0YSwgbmV4dFByb3BzLm9NZXRhKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3T2JqZWN0aXZlTWV0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGltZ1NyYyA9IGdldEFycm93U3JjKHRoaXMucHJvcHMub01ldGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lID0gXCJkaXJlY3Rpb25cIj5cclxuICAgICAgICAgICAgeyhpbWdTcmMpXHJcbiAgICAgICAgICAgICAgICA/IDxpbWcgc3JjID0ge2ltZ1NyY30gLz5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC9zcGFuPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRBcnJvd1NyYyhtZXRhKSB7XHJcbiAgICBpZiAoIW1ldGEuZ2V0KCdkJykpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ24nKSkgICAgICB7c3JjLnB1c2goJ25vcnRoJyk7fVxyXG4gICAgZWxzZSBpZiAobWV0YS5nZXQoJ3MnKSkge3NyYy5wdXNoKCdzb3V0aCcpO31cclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ3cnKSkgICAgICB7c3JjLnB1c2goJ3dlc3QnKTt9XHJcbiAgICBlbHNlIGlmIChtZXRhLmdldCgnZScpKSB7c3JjLnB1c2goJ2Vhc3QnKTt9XHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5BcnJvdy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEFycm93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzaXplICAgICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkTmFtZSAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2l6ZSAgICAgOiAyNTYsXHJcbiAgICBndWlsZE5hbWUgIDogdW5kZWZpbmVkLFxyXG59O1xyXG5cclxuY2xhc3MgRW1ibGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdOYW1lICAgICAgPSAodGhpcy5wcm9wcy5ndWlsZE5hbWUgIT09IG5leHRQcm9wcy5ndWlsZE5hbWUpOyAvLyBjaGFuZ2VzIHdoZW4gZGVmaW5lZFxyXG4gICAgICAgIGNvbnN0IG5ld1NpemUgICAgICA9ICh0aGlzLnByb3BzLnNpemUgIT09IG5leHRQcm9wcy5zaXplKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2l6ZSB8fCBuZXdOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZW1ibGVtU3JjID0gZ2V0RW1ibGVtU3JjKHRoaXMucHJvcHMuZ3VpbGROYW1lKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2VtYmxlbScsIHRoaXMucHJvcHMuZ3VpbGROYW1lLCBlbWJsZW1TcmMpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBcImVtYmxlbVwiXHJcbiAgICAgICAgICAgIHNyYyAgICAgICA9IHtlbWJsZW1TcmN9XHJcbiAgICAgICAgICAgIHdpZHRoICAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIG9uRXJyb3IgICA9IHtpbWdPbkVycm9yfVxyXG4gICAgICAgIC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcbiAgICByZXR1cm4gKGd1aWxkTmFtZSlcclxuICAgICAgICA/IGBodHRwOlxcL1xcL2d1aWxkcy5ndzJ3MncuY29tXFwvZ3VpbGRzXFwvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9XFwvMjU2LnN2Z2BcclxuICAgICAgICA6IGltZ1BsYWNlaG9sZGVyO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW1nT25FcnJvcihlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50U3JjID0gJChlLnRhcmdldCkuYXR0cignc3JjJyk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRTcmMgIT09IGltZ1BsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgJChlLnRhcmdldCkuYXR0cignc3JjJywgaW1nUGxhY2Vob2xkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkVtYmxlbS5wcm9wVHlwZXMgICAgPSBwcm9wVHlwZXM7XHJcbkVtYmxlbS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gRW1ibGVtO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1BpZTo6cmVuZGVyJywgcHJvcHMuc2NvcmVzLnRvQXJyYXkoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8aW1nXHJcbiAgICAgICAgICAgIHdpZHRoID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgICAgICBzcmMgPSB7Z2V0SW1hZ2VTb3VyY2UocHJvcHMuc2NvcmVzLnRvQXJyYXkoKSl9XHJcbiAgICAgICAgLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cDpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLmpvaW4oJywnKX0/c3Ryb2tlV2lkdGg9JHtJTlNUQU5DRS5zdHJva2V9YDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5QaWUucHJvcFR5cGVzICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBQaWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgdHlwZSA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBTcHJpdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1R5cGUgICAgICA9ICh0aGlzLnByb3BzLnR5cGUgIT09IG5leHRQcm9wcy50eXBlKTtcclxuICAgICAgICBjb25zdCBuZXdDb2xvciAgICAgPSAodGhpcy5wcm9wcy5jb2xvciAhPT0gbmV4dFByb3BzLmNvbG9yKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VHlwZSB8fCBuZXdDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZSA9IHtgc3ByaXRlICR7dGhpcy5wcm9wcy50eXBlfSAke3RoaXMucHJvcHMuY29sb3J9YH0gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5TcHJpdGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgID0gU3ByaXRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydGVkIENvbXBvbmVudFxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGQgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG4gICAgbGlua0xhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYW5nTGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgID0gSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy5saW5rTGFuZyk7XHJcbiAgICAgICAgY29uc3QgbGlzdENsYXNzID0gaXNBY3RpdmUgPyAnYWN0aXZlJyA6ICcnO1xyXG5cclxuICAgICAgICBjb25zdCB0aXRsZSAgICAgPSB0aGlzLnByb3BzLmxpbmtMYW5nLmdldCgnbmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGxhYmVsICAgICA9IHRoaXMucHJvcHMubGlua0xhbmcuZ2V0KCdsYWJlbCcpO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgICAgICA9IGdldExpbmsodGhpcy5wcm9wcy5saW5rTGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lID0ge2xpc3RDbGFzc30gdGl0bGUgPSB7dGl0bGV9PlxyXG4gICAgICAgICAgICA8YSBocmVmID0ge2xpbmt9PntsYWJlbH08L2E+XHJcbiAgICAgICAgPC9saT47IH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG4gICAgbGV0IGxpbmsgPSBgLyR7bGFuZ1NsdWd9YDtcclxuXHJcbiAgICBpZiAod29ybGQpIHtcclxuICAgICAgICBsZXQgd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuICAgICAgICBsaW5rICs9IGAvJHt3b3JsZFNsdWd9YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGluaztcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkxhbmdMaW5rLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBMYW5nTGluaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5jb25zdCBMYW5nTGluayAgPSByZXF1aXJlKCcuL0xhbmdMaW5rJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0ZWQgQ29tcG9uZW50XHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbn07XHJcblxyXG5jbGFzcyBMYW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMYW5nczo6cmVuZGVyKCknLCB0aGlzLnByb3BzLmxhbmcudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDx1bCBjbGFzc05hbWUgPSAnbmF2IG5hdmJhci1uYXYnPlxyXG4gICAgICAgICAgICB7U1RBVElDLmxhbmdzLm1hcCgobGlua0xhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHtrZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua0xhbmcgPSB7bGlua0xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7dGhpcy5wcm9wcy53b3JsZH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5MYW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IExhbmdzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZ2V0R3VpbGREZXRhaWxzICAgICAgIDogZ2V0R3VpbGREZXRhaWxzLFxyXG4gICAgZ2V0TWF0Y2hlcyAgICAgICAgICAgIDogZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoRGV0YWlsc0J5V29ybGQ6IGdldE1hdGNoRGV0YWlsc0J5V29ybGQsXHJcbiAgICAvLyBnZXRNYXRjaERldGFpbHMgICAgOiBnZXRNYXRjaERldGFpbHMsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuICAgIGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG4gICAgZ3cyYXBpLmdldEd1aWxkRGV0YWlscyh7XHJcbiAgICAgICAgZ3VpbGRfaWQ6IGd1aWxkSWRcclxuICAgIH0sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRNYXRjaERldGFpbHMobWF0Y2hJZCwgY2FsbGJhY2spIHtcclxuLy8gICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe21hdGNoX2lkOiBtYXRjaElkfSwgY2FsbGJhY2spO1xyXG4vLyB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc0J5V29ybGQod29ybGRTbHVnLCBjYWxsYmFjaykge1xyXG4gICAgLy8gc2V0VGltZW91dChcclxuICAgIC8vICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUuYmluZChudWxsLCB7d29ybGRfc2x1Zzogd29ybGRTbHVnfSwgY2FsbGJhY2spLFxyXG4gICAgLy8gIDMwMDBcclxuICAgIC8vICk7XHJcbiAgICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe1xyXG4gICAgICAgIHdvcmxkX3NsdWc6IHdvcmxkU2x1Z1xyXG4gICAgfSwgY2FsbGJhY2spO1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgYXBpICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuY2xhc3MgT3ZlcnZpZXdEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3Ojpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0V29ybGRzQnlSZWdpb24obGFuZykge1xyXG4gICAgICAgIHJldHVybiBJbW11dGFibGVcclxuICAgICAgICAgICAgLlNlcShTVEFUSUMud29ybGRzKVxyXG4gICAgICAgICAgICAubWFwKHdvcmxkICAgICA9PiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkpXHJcbiAgICAgICAgICAgIC5zb3J0Qnkod29ybGQgID0+IHdvcmxkLmdldCgnbmFtZScpKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldE1hdGNoZXNCeVJlZ2lvbihtYXRjaERhdGEpIHtcclxuICAgICAgICByZXR1cm4gSW1tdXRhYmxlXHJcbiAgICAgICAgICAgIC5TZXEobWF0Y2hEYXRhKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeShtYXRjaCA9PiBtYXRjaC5nZXQoXCJyZWdpb25cIikudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIF9fZ2V0RGF0YSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19nZXREYXRhKCknKTtcclxuICAgICAgICBhcGkuZ2V0TWF0Y2hlcyh0aGlzLl9fb25NYXRjaERhdGEuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3NldERhdGFUaW1lb3V0KCkge1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gZ2V0SW50ZXJ2YWwoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19zZXREYXRhVGltZW91dCgpJywgaW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMubWF0Y2hEYXRhID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgdGhpcy5fX2dldERhdGEuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgaW50ZXJ2YWxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19vbk1hdGNoRGF0YShlcnIsIGRhdGEpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19vbk1hdGNoRGF0YSgpJywgZGF0YSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2hEYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKCFlcnIgJiYgbWF0Y2hEYXRhICYmICFtYXRjaERhdGEuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICh0aGlzLl9fbGlzdGVuZXJzLm9uTWF0Y2hEYXRhIHx8IF8ubm9vcCkobWF0Y2hEYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX19zZXREYXRhVGltZW91dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIERhdGEgLSBXb3JsZHNcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkge1xyXG4gICAgY29uc3QgbGFuZ1NsdWcgICAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGRCeUxhbmcgPSB3b3JsZC5nZXQobGFuZ1NsdWcpO1xyXG5cclxuICAgIGNvbnN0IHJlZ2lvbiAgICAgID0gd29ybGQuZ2V0KCdyZWdpb24nKTtcclxuICAgIGNvbnN0IGxpbmsgICAgICAgID0gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZyk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkQnlMYW5nLm1lcmdlKHtcclxuICAgICAgICBsaW5rLCByZWdpb25cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGQuZ2V0KCdzbHVnJyldLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCgpIHtcclxuICAgIHJldHVybiBfLnJhbmRvbSgyMDAwLCA0MDAwKTtcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3RGF0YVByb3ZpZGVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgYXN5bmMgICAgID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuXHJcbmNvbnN0IGFwaSAgICAgICA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBNb2R1bGUgR2xvYmFsc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IGd1aWxkRGVmYXVsdCA9IEltbXV0YWJsZS5NYXAoe1xyXG4gICAgbG9hZGVkICAgIDogZmFsc2UsXHJcbiAgICBsYXN0Q2xhaW0gOiAwLFxyXG4gICAgY2xhaW1zICAgIDogSW1tdXRhYmxlLk1hcCgpLFxyXG59KTtcclxuXHJcblxyXG5jb25zdCBudW1RdWV1ZUNvbmN1cnJlbnQgPSA4O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHVibGljIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5jbGFzcyBMaWJHdWlsZHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuX19hc3luY0d1aWxkUXVldWUgPSBhc3luYy5xdWV1ZShcclxuICAgICAgICAgICAgZ2V0R3VpbGREZXRhaWxzLFxyXG4gICAgICAgICAgICBudW1RdWV1ZUNvbmN1cnJlbnRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRHdWlsZERlZmF1bHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGd1aWxkRGVmYXVsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldEV2ZW50c0J5VHlwZShtYXRjaERldGFpbHMsIGV2ZW50VHlwZSkge1xyXG4gICAgICAgIHJldHVybiBtYXRjaERldGFpbHNcclxuICAgICAgICAgICAgLmdldCgnaGlzdG9yeScpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gZW50cnkuZ2V0KCd0eXBlJykgPT09IGV2ZW50VHlwZSlcclxuICAgICAgICAgICAgLy8gLnNvcnRCeShlbnRyeSA9PiAtZW50cnkuZ2V0KCd0aW1lc3RhbXAnKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFVua25vd25HdWlsZHMoc3RhdGVHdWlsZHMsIG1hdGNoRGV0YWlscykge1xyXG4gICAgICAgIGNvbnN0IGNsYWltRXZlbnRzICAgICAgID0gdGhpcy5nZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCAnY2xhaW0nKTtcclxuICAgICAgICBjb25zdCBvYmplY3RpdmVDbGFpbWVycyA9IG1hdGNoRGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnY2xhaW1lcnMnXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGtub3duR3VpbGRzID0gc3RhdGVHdWlsZHNcclxuICAgICAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkX2lkJykpXHJcbiAgICAgICAgICAgIC50b1NldCgpO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXMgPSBvYmplY3RpdmVDbGFpbWVyc1xyXG4gICAgICAgICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSlcclxuICAgICAgICAgICAgLnRvU2V0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkc1dpdGhQcmV2aW91c0NsYWltcyA9IGNsYWltRXZlbnRzXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgICAgICAudG9TZXQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGRDbGFpbXMgPSBndWlsZHNXaXRoQ3VycmVudENsYWltc1xyXG4gICAgICAgICAgICAudW5pb24oZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zKTtcclxuXHJcblxyXG5cclxuICAgICAgICBjb25zdCB1bmtub3duR3VpbGRzID0gZ3VpbGRDbGFpbXNcclxuICAgICAgICAgICAgLnN1YnRyYWN0KGtub3duR3VpbGRzKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdndWlsZENsYWltcycsIGd1aWxkQ2xhaW1zLnRvQXJyYXkoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2tub3duR3VpbGRzJywga25vd25HdWlsZHMudG9BcnJheSgpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndW5rbm93bkd1aWxkcycsIHVua25vd25HdWlsZHMudG9BcnJheSgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHVua25vd25HdWlsZHM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsb29rdXAoa25vd25HdWlsZHMsIG1hdGNoRGV0YWlscywgbGlzdGVuZXIpIHtcclxuICAgICAgICBjb25zdCB1bmtub3duR3VpbGRzID0gdGhpcy5nZXRVbmtub3duR3VpbGRzKGtub3duR3VpbGRzLCBtYXRjaERldGFpbHMpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRHdWlsZCA9IHRoaXMuZ2V0R3VpbGREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHVua25vd25HdWlsZHMuZm9yRWFjaChndWlsZElkID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemVcclxuICAgICAgICAgICAgY29uc3QgZ3VpbGQgPSBkZWZhdWx0R3VpbGQuc2V0KCdndWlsZF9pZCcsIGd1aWxkSWQpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lcihndWlsZCwgZ3VpbGRJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgZnJvbSByZW1vdGVcclxuICAgICAgICAgICAgdGhpcy5fX2FzeW5jR3VpbGRRdWV1ZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lclxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhdHRhY2hDbGFpbXMoY2xhaW1FdmVudHMsIGd1aWxkKSB7XHJcbiAgICAgICAgY29uc3QgZ3VpbGRJZCA9IGd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBpbmNDbGFpbXMgPSBjbGFpbUV2ZW50c1xyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSA9PT0gZ3VpbGRJZClcclxuICAgICAgICAgICAgLnRvTWFwKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc0NsYWltcyAgICAgID0gZ3VpbGQuZ2V0KCdjbGFpbXMnKSAmJiAhZ3VpbGQuZ2V0KCdjbGFpbXMnKS5pc0VtcHR5KCk7XHJcbiAgICAgICAgY29uc3QgbmV3ZXN0Q2xhaW0gICAgPSBoYXNDbGFpbXMgPyBndWlsZC5nZXQoJ2NsYWltcycpLmZpcnN0KCkgOiBudWxsO1xyXG4gICAgICAgIGNvbnN0IGluY0hhc0NsYWltcyAgID0gIWluY0NsYWltcy5pc0VtcHR5KCk7XHJcbiAgICAgICAgY29uc3QgaW5jTmV3ZXN0Q2xhaW0gPSBpbmNIYXNDbGFpbXMgPyBpbmNDbGFpbXMuZmlyc3QoKSA6IG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc05ld0NsYWltcyAgID0gKCFJbW11dGFibGUuaXMobmV3ZXN0Q2xhaW0sIGluY05ld2VzdENsYWltKSk7XHJcblxyXG5cclxuICAgICAgICBpZiAoaGFzTmV3Q2xhaW1zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY05ld2VzdENsYWltLmdldCgndGltZXN0YW1wJykgOiAwO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2xhaW1zIGFsdGVyZWQnLCBndWlsZElkLCBoYXNOZXdDbGFpbXMsIGxhc3RDbGFpbSk7XHJcbiAgICAgICAgICAgIGd1aWxkID0gZ3VpbGQuc2V0KCdjbGFpbXMnLCBpbmNDbGFpbXMpO1xyXG4gICAgICAgICAgICBndWlsZCA9IGd1aWxkLnNldCgnbGFzdENsYWltJywgbGFzdENsYWltKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBndWlsZDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMoY2FyZ28sIG9uQ29tcGxldGUpIHtcclxuICAgIGFwaS5nZXRHdWlsZERldGFpbHMoXHJcbiAgICAgICAgY2FyZ28uZ3VpbGRJZCxcclxuICAgICAgICBvbkd1aWxkRGF0YS5iaW5kKG51bGwsIGNhcmdvKVxyXG4gICAgKTtcclxuXHJcbiAgICBvbkNvbXBsZXRlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEoY2FyZ28sIGVyciwgZGF0YSkge1xyXG4gICAgaWYgKCFlcnIgJiYgZGF0YSkge1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmVtYmxlbTtcclxuICAgICAgICBkYXRhLmxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG4gICAgICAgIGNhcmdvLmxpc3RlbmVyKGd1aWxkRGF0YSwgY2FyZ28uZ3VpbGRJZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnQgTW9kdWxlXHJcbiAqXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWJHdWlsZHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgR3VpbGRzREFPID0gcmVxdWlyZSgnLi9ndWlsZHMnKTtcclxuXHJcbmNvbnN0IGFwaSAgICAgICA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcbmNsYXNzIE92ZXJ2aWV3RGF0YVByb3ZpZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0ZW5lcnMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19sYW5nU2x1ZyAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX193b3JsZFNsdWcgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmd1aWxkcyAgICAgID0gbmV3IEd1aWxkc0RBTygpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX19saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSB7fTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0ge307XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBpbml0KGxhbmcsIHdvcmxkKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19sYW5nU2x1ZyAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgICAgIHRoaXMuX193b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbdGhpcy5fX2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y2xvc2UoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cyAgPSBfLm1hcCh0aGlzLl9fdGltZW91dHMsICB0ID0+IGNsZWFyVGltZW91dCh0KSk7XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IF8ubWFwKHRoaXMuX19pbnRlcnZhbHMsIGkgPT4gY2xlYXJJbnRlcnZhbChpKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRNYXRjaFdvcmxkcyhsYW5nLCBtYXRjaCkge1xyXG4gICAgICAgIHJldHVybiBJbW11dGFibGVcclxuICAgICAgICAgICAgLkxpc3QoWydyZWQnLCAnYmx1ZScsICdncmVlbiddKVxyXG4gICAgICAgICAgICAubWFwKGdldE1hdGNoV29ybGQuYmluZChudWxsLCBsYW5nLCBtYXRjaCkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBfX2dldERhdGEoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19nZXREYXRhKCknKTtcclxuXHJcbiAgICAgICAgYXBpLmdldE1hdGNoRGV0YWlsc0J5V29ybGQoXHJcbiAgICAgICAgICAgIHRoaXMuX193b3JsZFNsdWcsXHJcbiAgICAgICAgICAgIHRoaXMuX19vbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fb25NYXRjaERldGFpbHMoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6X19vbk1hdGNoRGF0YSgpJywgZGF0YSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICghZXJyICYmIGRhdGEgJiYgZGF0YS5tYXRjaCAmJiBkYXRhLmRldGFpbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZVJlbW90ZSAgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubm93KTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hEYXRhICAgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubWF0Y2gpO1xyXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5kZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERldGFpbHModGltZVJlbW90ZSwgbWF0Y2hEYXRhLCBkZXRhaWxzRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fX3Jlc2NoZWR1bGVEYXRhVXBkYXRlLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3Jlc2NoZWR1bGVEYXRhVXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCoyLCAxMDAwKjQpO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMuZGF0YSA9IHNldFRpbWVvdXQodGhpcy5fX2dldERhdGEuYmluZCh0aGlzKSwgcmVmcmVzaFRpbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qICAgV29ybGRzXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaFdvcmxkKGxhbmcsIG1hdGNoLCBjb2xvcikge1xyXG4gICAgY29uc3QgbGFuZ1NsdWcgICAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGRLZXkgICAgPSBjb2xvciArICdJZCc7XHJcbiAgICBjb25zdCB3b3JsZElkICAgICA9IG1hdGNoLmdldEluKFt3b3JsZEtleV0pLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCB3b3JsZEJ5TGFuZyA9IFNUQVRJQy53b3JsZHMuZ2V0SW4oW3dvcmxkSWQsIGxhbmdTbHVnXSk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkQnlMYW5nXHJcbiAgICAgICAgLnNldCgnY29sb3InLCBjb2xvcilcclxuICAgICAgICAuc2V0KCdsaW5rJywgZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZykpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuICAgIHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZC5nZXQoJ3NsdWcnKV0uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3ZlcnZpZXdEYXRhUHJvdmlkZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZGF0ZU5vdzogZGF0ZU5vdyxcclxuICAgIGFkZDUgICA6IGFkZDUsXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZGF0ZU5vdygpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKF8ubm93KCkgLyAxMDAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZDUoaW5EYXRlKSB7XHJcbiAgICBsZXQgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcbiAgICByZXR1cm4gKF9iYXNlRGF0ZSArICg1ICogNjApKTtcclxufVxyXG4iLCJjb25zdCBzdGF0aWNzID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuY29uc3QgaW1tdXRhYmxlU3RhdGljcyA9IHtcclxuICAgIGxhbmdzICAgICAgICAgICA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5sYW5ncyksXHJcbiAgICB3b3JsZHMgICAgICAgICAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mud29ybGRzKSxcclxuICAgIG9iamVjdGl2ZV9uYW1lcyA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbmFtZXMpLFxyXG4gICAgb2JqZWN0aXZlX3R5cGVzIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV90eXBlcyksXHJcbiAgICBvYmplY3RpdmVfbWV0YSAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX21ldGEpLFxyXG4gICAgb2JqZWN0aXZlX2xhYmVsczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9sYWJlbHMpLFxyXG4gICAgb2JqZWN0aXZlX21hcCAgIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGltbXV0YWJsZVN0YXRpY3M7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgXyAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0IGFzeW5jICA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgYnVmZlRpbWUgICAgID0gNSAqIDYwICogMTAwMDtcclxuY29uc3QgaGlnaGxpdGVUaW1lID0gMTAgKiAxMDAwO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUocmVtb3RlT2Zmc2V0PTAsIGNiPV8ubm9vcCkge1xyXG4gICAgY29uc3QgdGltZUxvY2FsID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IHRpbWVSZW1vdGUgPSB0aW1lTG9jYWwgLSByZW1vdGVPZmZzZXQ7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZScsIHJlbW90ZU9mZnNldCwgdGltZUxvY2FsLCB0aW1lUmVtb3RlKTtcclxuXHJcbiAgICBsZXQgJHRpbWVycyAgICAgPSAkKCcudGltZXInKTtcclxuICAgIGxldCAkY291bnRkb3ducyA9ICR0aW1lcnMuZmlsdGVyKCcuY291bnRkb3duJyk7XHJcbiAgICBsZXQgJHJlbGF0aXZlcyAgPSAkdGltZXJzLmZpbHRlcignLnJlbGF0aXZlJyk7XHJcblxyXG4gICAgYXN5bmMucGFyYWxsZWwoW1xyXG4gICAgICAgIHVwZGF0ZVJlbGF0aXZlVGltZXJzLmJpbmQobnVsbCwgJHJlbGF0aXZlcywgcmVtb3RlT2Zmc2V0KSxcclxuICAgICAgICB1cGRhdGVDb3VudGRvd25UaW1lcnMuYmluZChudWxsLCAkY291bnRkb3ducywgdGltZVJlbW90ZSksXHJcbiAgICBdLCBjYik7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lcnMocmVsYXRpdmVzLCBvZmZzZXQsIGNiKSB7XHJcbiAgICBhc3luYy5lYWNoKFxyXG4gICAgICAgIHJlbGF0aXZlcyxcclxuICAgICAgICB1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlLmJpbmQobnVsbCwgb2Zmc2V0KSxcclxuICAgICAgICBjYlxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGRvd25UaW1lcnMoY291bnRkb3ducywgdGltZVJlbW90ZSwgY2IpIHtcclxuICAgIGFzeW5jLmVhY2goXHJcbiAgICAgICAgY291bnRkb3ducyxcclxuICAgICAgICB1cGRhdGVDb3VudGRvd25UaW1lck5vZGUuYmluZChudWxsLCB0aW1lUmVtb3RlKSxcclxuICAgICAgICBjYlxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlKG9mZnNldCwgZWwsIG5leHQpIHtcclxuICAgIGNvbnN0ICRlbCA9ICQoZWwpO1xyXG5cclxuICAgIGNvbnN0IHRpbWVzdGFtcCAgICAgICAgID0gXy5wYXJzZUludCgkZWwuYXR0cignZGF0YS10aW1lc3RhbXAnKSk7XHJcbiAgICBjb25zdCBvZmZzZXRUaW1lc3RhbXAgICA9ICh0aW1lc3RhbXAgKiAxMDAwKSArIG9mZnNldDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcE1vbWVudCAgID0gbW9tZW50KG9mZnNldFRpbWVzdGFtcCk7XHJcbiAgICBjb25zdCB0aW1lc3RhbXBSZWxhdGl2ZSA9IHRpbWVzdGFtcE1vbWVudC50d2l0dGVyU2hvcnQoKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhvZmZzZXQsICRlbCwgdGltZXN0YW1wLCBvZmZzZXRUaW1lc3RhbXAsIHRpbWVzdGFtcE1vbWVudCk7XHJcblxyXG4gICAgJGVsLnRleHQodGltZXN0YW1wUmVsYXRpdmUpO1xyXG5cclxuICAgIG5leHQoKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGRvd25UaW1lck5vZGUodGltZVJlbW90ZSwgZWwsIG5leHQpIHtcclxuICAgIGNvbnN0ICRlbCA9ICQoZWwpO1xyXG5cclxuICAgIGNvbnN0IHRpbWVzdGFtcCAgID0gXy5wYXJzZUludCgkZWwuYXR0cignZGF0YS10aW1lc3RhbXAnKSkgKiAxMDAwO1xyXG4gICAgY29uc3QgZXhwaXJlcyAgICAgPSB0aW1lc3RhbXAgKyBidWZmVGltZTtcclxuICAgIGNvbnN0IG1zUmVtYWluaW5nID0gZXhwaXJlcyAtIHRpbWVSZW1vdGU7XHJcbiAgICBjb25zdCBtc0VsYXBzZWQgICA9IGJ1ZmZUaW1lIC0gbXNSZW1haW5pbmc7XHJcblxyXG5cclxuICAgIGNvbnN0IGlzVmlzaWJsZSAgICAgPSBleHBpcmVzICsgaGlnaGxpdGVUaW1lID49IHRpbWVSZW1vdGU7XHJcbiAgICBjb25zdCBpc0V4cGlyZWQgICAgID0gZXhwaXJlcyA8IHRpbWVSZW1vdGU7XHJcbiAgICBjb25zdCBpc0FjdGl2ZSAgICAgID0gIWlzRXhwaXJlZDtcclxuICAgIGNvbnN0IGlzSGlnaGxpZ2h0ZWQgPSAobXNSZW1haW5pbmcgPD0gTWF0aC5hYnMoaGlnaGxpdGVUaW1lKSk7XHJcbiAgICBjb25zdCBpc0ZyZXNoICAgICAgID0gKG1zRWxhcHNlZCA8PSBoaWdobGl0ZVRpbWUpO1xyXG5cclxuXHJcblxyXG5cclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoaXNBY3RpdmUpID8gbW9tZW50KG1zUmVtYWluaW5nKS5mb3JtYXQoJ206c3MnKSA6ICcwOjAwJztcclxuXHJcbiAgICAgICAgY29uc3QgJG9iamVjdGl2ZSAgICAgICAgPSAkZWwuY2xvc2VzdCgnLm9iamVjdGl2ZScpO1xyXG4gICAgICAgIGNvbnN0IGhhc0NsYXNzSGlnaGxpZ2h0ID0gJG9iamVjdGl2ZS5oYXNDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgY29uc3QgaGFzQ2xhc3NGcmVzaCAgICAgPSAkb2JqZWN0aXZlLmhhc0NsYXNzKCdmcmVzaCcpO1xyXG5cclxuICAgICAgICBpZiAoaXNIaWdobGlnaHRlZCAmJiAhaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuICAgICAgICAgICAgJG9iamVjdGl2ZS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghaXNIaWdobGlnaHRlZCAmJiBoYXNDbGFzc0hpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICAkb2JqZWN0aXZlLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc0ZyZXNoICYmICFoYXNDbGFzc0ZyZXNoKSB7XHJcbiAgICAgICAgICAgICRvYmplY3RpdmUuYWRkQ2xhc3MoJ2ZyZXNoJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghaXNGcmVzaCAmJiBoYXNDbGFzc0ZyZXNoKSB7XHJcbiAgICAgICAgICAgICRvYmplY3RpdmUucmVtb3ZlQ2xhc3MoJ2ZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZWwudGV4dCh0aW1lclRleHQpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoJy5pbmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5lbmQoKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRlbC5maWx0ZXIoJy5hY3RpdmUnKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2luYWN0aXZlJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpXHJcbiAgICAgICAgICAgIC5lbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgdXBkYXRlXHJcbn07XHJcbiJdfQ==
