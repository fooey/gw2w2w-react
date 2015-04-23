(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
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
    var domMounts = {
        navLangs: document.getElementById("nav-langs"),
        content: document.getElementById("content") };

    page("/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?", function (ctx) {
        var langSlug = ctx.params.langSlug;
        var lang = STATIC.langs.get(langSlug);

        var worldSlug = ctx.params.worldSlug;
        var world = getWorldFromSlug(langSlug, worldSlug);

        var App = Overview;
        var props = { lang: lang };

        if (world && Immutable.Map.isMap(world) && !world.isEmpty()) {
            App = Tracker;
            props.world = world;
        }

        React.render(React.createElement(Langs, props), domMounts.navLangs);
        React.render(React.createElement(App, props), domMounts.content);
    });

    // redirect '/' to '/en'
    page("/", redirectPage.bind(null, "/en"));

    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true });
}

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

},{"./Overview":98,"./Tracker":123,"./common/Langs":129,"./lib/static":134,"babel/polyfill":76}],2:[function(require,module,exports){
(function (global){
"use strict";

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;

require("core-js/shim");

require("regenerator/runtime");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":73,"regenerator/runtime":74}],3:[function(require,module,exports){
'use strict';
// false -> Array#indexOf
// true  -> Array#includes
var $ = require('./$');
module.exports = function(IS_INCLUDES){
  return function(el /*, fromIndex = 0 */){
    var O      = $.toObject(this)
      , length = $.toLength(O.length)
      , index  = $.toIndex(arguments[1], length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$":17}],4:[function(require,module,exports){
'use strict';
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
  return function(callbackfn/*, that = undefined */){
    var O      = Object($.assertDefined(this))
      , self   = $.ES5Object(O)
      , f      = ctx(callbackfn, arguments[1], 3)
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
},{"./$":17,"./$.ctx":11}],5:[function(require,module,exports){
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
},{"./$":17}],6:[function(require,module,exports){
var $ = require('./$');
// 19.1.2.1 Object.assign(target, source, ...)
/*eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/*eslint-enable no-unused-vars */
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = $.getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":17}],7:[function(require,module,exports){
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
},{"./$":17,"./$.wks":28}],8:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , $iter    = require('./$.iter')
  , has      = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , step     = $iter.step
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
    function C(iterable){
      var that = assert.inst(this, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
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
  getIterConstructor: function(){
    return function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    };
  },
  next: function(){
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
    if(kind == 'key'  )return step(0, entry.k);
    if(kind == 'value')return step(0, entry.v);
    return step(0, [entry.k, entry.v]);
  }
};
},{"./$":17,"./$.assert":5,"./$.ctx":11,"./$.iter":16,"./$.uid":26}],9:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.iter').forOf
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
  return find.call(store.array, function(it){
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
      var index = findIndex.call(this.array, function(it){
        return it[0] === key;
      });
      if(~index)this.array.splice(index, 1);
      return !!~index;
    }
  })[LEAK];
}

module.exports = {
  getConstructor: function(NAME, IS_MAP, ADDER){
    function C(iterable){
      $.set(assert.inst(this, C, NAME), ID, id++);
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
},{"./$":17,"./$.array-methods":4,"./$.assert":5,"./$.iter":16,"./$.uid":26}],10:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, methods, common, IS_MAP, isWeak){
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
  if(!$.isFunction(C) || !(isWeak || !$iter.BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(NAME, IS_MAP, ADDER);
    $.mix(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](isWeak ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = function(iterable){
        assertInstance(this, C, NAME);
        var that = new Base;
        if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      };
      C.prototype = proto;
      if($.FW)proto.constructor = C;
    }
    isWeak || inst.forEach(function(val, key){
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
  require('./$.species')(C);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);

  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  if(!isWeak)$iter.std(
    C, NAME,
    common.getIterConstructor(), common.next,
    IS_MAP ? 'key+value' : 'value' , !IS_MAP, true
  );

  return C;
};
},{"./$":17,"./$.assert":5,"./$.cof":7,"./$.def":12,"./$.iter":16,"./$.iter-detect":15,"./$.species":23}],11:[function(require,module,exports){
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
},{"./$.assert":5}],12:[function(require,module,exports){
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
},{"./$":17}],13:[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{"./$.wks":28}],16:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , ctx               = require('./$.ctx')
  , cof               = require('./$.cof')
  , $def              = require('./$.def')
  , assertObject      = require('./$.assert').obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = {}
  , IteratorPrototype = {};
// Safari has byggy iterators w/o `next`
var BUGGY = 'keys' in [] && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor.prototype
    , iter  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT] || value;
  // Define iterator
  if($.FW)setIterator(proto, iter);
  if(iter !== value){
    var iterProto = $.getProto(iter.call(new Constructor));
    // Set @@toStringTag to native iterators
    cof.set(iterProto, NAME + ' Iterator', true);
    // FF fix
    if($.FW)$.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = $.that;
  return iter;
}
function getIterator(it){
  var Symbol  = $.g.Symbol
    , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
  return assertObject(getIter.call(it));
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function stepCall(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
var $iter = module.exports = {
  BUGGY: BUGGY,
  Iterators: Iterators,
  prototype: IteratorPrototype,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  stepCall: stepCall,
  close: closeIterator,
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
  },
  get: getIterator,
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  },
  define: defineIterator,
  std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
    function createIter(kind){
      return function(){
        return new Constructor(this, kind);
      };
    }
    $iter.create(Constructor, NAME, next);
    var entries = createIter('key+value')
      , values  = createIter('value')
      , proto   = Base.prototype
      , methods, key;
    if(DEFAULT == 'value')values = defineIterator(Base, NAME, values, 'values');
    else entries = defineIterator(Base, NAME, entries, 'entries');
    if(DEFAULT){
      methods = {
        entries: entries,
        keys:    IS_SET ? values : createIter('key'),
        values:  values
      };
      $def($def.P + $def.F * BUGGY, NAME, methods);
      if(FORCE)for(key in methods){
        if(!(key in proto))$.hide(proto, key, methods[key]);
      }
    }
  },
  forOf: function(iterable, entries, fn, that){
    var iterator = getIterator(iterable)
      , f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done){
      if(stepCall(iterator, f, step.value, entries) === false){
        return closeIterator(iterator);
      }
    }
  }
};
},{"./$":17,"./$.assert":5,"./$.cof":7,"./$.ctx":11,"./$.def":12,"./$.wks":28}],17:[function(require,module,exports){
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
    return $.setDesc(object, key, desc(bitmap, value)); // eslint-disable-line no-use-before-define
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
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  // Dummy, fix for not array-like ES3 string in es5 module
  assertDefined: assertDefined,
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
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":13}],18:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":17}],19:[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function ownKeys(it){
  assertObject(it);
  return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);
};
},{"./$":17,"./$.assert":5}],20:[function(require,module,exports){
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
},{"./$":17,"./$.assert":5,"./$.invoke":14}],21:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],22:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/*eslint-disable no-proto */
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
},{"./$":17,"./$.assert":5,"./$.ctx":11}],23:[function(require,module,exports){
var $ = require('./$');
module.exports = function(C){
  if($.DESC && $.FW)$.setDesc(C, require('./$.wks')('species'), {
    configurable: true,
    get: $.that
  });
};
},{"./$":17,"./$.wks":28}],24:[function(require,module,exports){
'use strict';
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(pos){
    var s = String($.assertDefined(this))
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
},{"./$":17}],25:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , global             = $.g
  , isFunction         = $.isFunction
  , html               = $.html
  , document           = global.document
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
  } else if(document && ONREADYSTATECHANGE in document.createElement('script')){
    defer = function(id){
      html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function(){
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
},{"./$":17,"./$.cof":7,"./$.ctx":11,"./$.invoke":14}],26:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":17}],27:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":17,"./$.wks":28}],28:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":17,"./$.uid":26}],29:[function(require,module,exports){
var $                = require('./$')
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
  , defineProperties = Object.defineProperties
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , isFunction       = $.isFunction
  , toObject         = $.toObject
  , toLength         = $.toLength
  , IE8_DOM_DEFINE   = false;

if(!$.DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(document.createElement('div'), 'x',
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
  defineProperties = function(O, Properties){
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
  var iframe = document.createElement('iframe')
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
  forEach: $.each = $.each || arrayMethod(0),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: arrayMethod(1),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: arrayMethod(2),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: arrayMethod(3),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: arrayMethod(4),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: indexOf = indexOf || require('./$.array-includes')(false),
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
$def($def.P, 'Date', {toISOString: function(){
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
},{"./$":17,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":12,"./$.invoke":14,"./$.replacer":21,"./$.uid":26}],30:[function(require,module,exports){
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
},{"./$":17,"./$.def":12,"./$.unscope":27}],31:[function(require,module,exports){
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
},{"./$":17,"./$.def":12,"./$.unscope":27}],32:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
  findIndex: require('./$.array-methods')(6)
});
require('./$.unscope')('findIndex');
},{"./$.array-methods":4,"./$.def":12,"./$.unscope":27}],33:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
  find: require('./$.array-methods')(5)
});
require('./$.unscope')('find');
},{"./$.array-methods":4,"./$.def":12,"./$.unscope":27}],34:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , stepCall = $iter.stepCall;
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
        result[index] = mapping ? stepCall(iterator, f, [step.value, index], true) : step.value;
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
},{"./$":17,"./$.ctx":11,"./$.def":12,"./$.iter":16,"./$.iter-detect":15}],35:[function(require,module,exports){
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
$iter.std(Array, 'Array', function(iterated, kind){
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
  if(kind == 'key'  )return step(0, index);
  if(kind == 'value')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'value');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":17,"./$.iter":16,"./$.uid":26,"./$.unscope":27}],36:[function(require,module,exports){
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
},{"./$.def":12}],37:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":23}],38:[function(require,module,exports){
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
},{"./$":17}],39:[function(require,module,exports){
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
},{"./$.collection":10,"./$.collection-strong":8}],40:[function(require,module,exports){
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
},{"./$.def":12}],41:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , isObject   = $.isObject
  , isFunction = $.isFunction
  , NUMBER     = 'Number'
  , Number     = $.g[NUMBER]
  , Base       = Number
  , proto      = Number.prototype;
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
if($.FW && !(Number('0o1') && Number('0b1'))){
  Number = function Number(it){
    return this instanceof Number ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call($.DESC ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if($.has(Base, key) && !$.has(Number, key)){
        $.setDesc(Number, key, $.getDesc(Base, key));
      }
    }
  );
  Number.prototype = proto;
  proto.constructor = Number;
  $.hide($.g, NUMBER, Number);
}
},{"./$":17}],42:[function(require,module,exports){
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
},{"./$":17,"./$.def":12}],43:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":12}],44:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: function is(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
});
},{"./$.def":12}],45:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":12,"./$.set-proto":22}],46:[function(require,module,exports){
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
},{"./$":17,"./$.def":12}],47:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var $   = require('./$')
  , cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function toString(){
  return '[object ' + cof.classof(this) + ']';
});
},{"./$":17,"./$.cof":7,"./$.wks":28}],48:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , ctx     = require('./$.ctx')
  , cof     = require('./$.cof')
  , $def    = require('./$.def')
  , assert  = require('./$.assert')
  , $iter   = require('./$.iter')
  , SPECIES = require('./$.wks')('species')
  , RECORD  = require('./$.uid').safe('record')
  , forOf   = $iter.forOf
  , PROMISE = 'Promise'
  , global  = $.g
  , process = global.process
  , asap    = process && process.nextTick || require('./$.task').set
  , P       = global[PROMISE]
  , Base    = P
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , test;

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
function isUnhandled(promise){
  var record = promise[RECORD]
    , chain  = record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
}
function notify(record, isReject){
  var chain = record.c;
  if(isReject || chain.length)asap(function(){
    var promise = record.p
      , value   = record.v
      , ok      = record.s == 1
      , i       = 0;
    if(isReject && isUnhandled(promise)){
      setTimeout(function(){
        if(isUnhandled(promise)){
          if(cof(process) == 'process'){
            process.emit('unhandledRejection', value, promise);
          } else if(global.console && isFunction(console.error)){
            console.error('Unhandled promise rejection', value);
          }
        }
      }, 1e3);
    } else while(chain.length > i)!function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError(PROMISE + '-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    }(chain[i++]);
    chain.length = 0;
  });
}
function $reject(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  notify(record, true);
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
if(!(isFunction(P) && isFunction(P.resolve) && P.resolve(test = new P(function(){})) == test)){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, P, PROMISE),       // <- promise
      c: [],                                  // <- chain
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
$def($def.G + $def.W + $def.F * (P != Base), {Promise: P});
cof.set(P, PROMISE);
require('./$.species')(P);

// statics
$def($def.S, PROMISE, {
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
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
}), PROMISE, {
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
},{"./$":17,"./$.assert":5,"./$.cof":7,"./$.ctx":11,"./$.def":12,"./$.iter":16,"./$.iter-detect":15,"./$.species":23,"./$.task":25,"./$.uid":26,"./$.wks":28}],49:[function(require,module,exports){
var $         = require('./$')
  , $def      = require('./$.def')
  , setProto  = require('./$.set-proto')
  , $iter     = require('./$.iter')
  , ITER      = require('./$.uid').safe('iter')
  , step      = $iter.step
  , assert    = require('./$.assert')
  , isObject  = $.isObject
  , getDesc   = $.getDesc
  , setDesc   = $.setDesc
  , getProto  = $.getProto
  , apply     = Function.apply
  , assertObject  = assert.obj
  , _isExtensible = Object.isExtensible || $.it;
function Enumerate(iterated){
  var keys = [], key;
  for(key in iterated)keys.push(key);
  $.set(this, ITER, {o: iterated, a: keys, i: 0});
}
$iter.create(Enumerate, 'Object', function(){
  var iter = this[ITER]
    , keys = iter.a
    , key;
  do {
    if(iter.i >= keys.length)return step(1);
  } while(!((key = keys[iter.i++]) in iter.o));
  return step(0, key);
});

function wrap(fn){
  return function(it){
    assertObject(it);
    try {
      fn.apply(undefined, arguments);
      return true;
    } catch(e){
      return false;
    }
  };
}

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc = getDesc(assertObject(target), propertyKey), proto;
  if(desc)return $.has(desc, 'value')
    ? desc.value
    : desc.get === undefined
      ? undefined
      : desc.get.call(receiver);
  return isObject(proto = getProto(target))
    ? get(proto, propertyKey, receiver)
    : undefined;
}
function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = getDesc(assertObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = $.desc(0);
  }
  if($.has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = getDesc(receiver, propertyKey) || $.desc(0);
    existingDescriptor.value = V;
    setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

var reflect = {
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
  apply: require('./$.ctx')(Function.call, apply, 3),
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
  construct: function construct(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: wrap(setDesc),
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function enumerate(target){
    return new Enumerate(assertObject(target));
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: get,
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return getDesc(assertObject(target), propertyKey);
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
    return !!_isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: wrap(Object.preventExtensions || $.it),
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: set
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
$def($def.S, 'Reflect', reflect);
},{"./$":17,"./$.assert":5,"./$.ctx":11,"./$.def":12,"./$.iter":16,"./$.own-keys":19,"./$.set-proto":22,"./$.uid":26}],50:[function(require,module,exports){
var $      = require('./$')
  , cof    = require('./$.cof')
  , RegExp = $.g.RegExp
  , Base   = RegExp
  , proto  = RegExp.prototype;
if($.FW && $.DESC){
  // RegExp allows a regex with flags as the pattern
  if(!function(){try{ return RegExp(/a/g, 'i') == '/a/i'; }catch(e){ /* empty */ }}()){
    RegExp = function RegExp(pattern, flags){
      return new Base(cof(pattern) == 'RegExp' && flags !== undefined
        ? pattern.source : pattern, flags);
    };
    $.each.call($.getNames(Base), function(key){
      key in RegExp || $.setDesc(RegExp, key, {
        configurable: true,
        get: function(){ return Base[key]; },
        set: function(it){ Base[key] = it; }
      });
    });
    proto.constructor = RegExp;
    RegExp.prototype = proto;
    $.hide($.g, 'RegExp', RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')(RegExp);
},{"./$":17,"./$.cof":7,"./$.replacer":21,"./$.species":23}],51:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":10,"./$.collection-strong":8}],52:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: require('./$.string-at')(false)
});
},{"./$.def":12,"./$.string-at":24}],53:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

$def($def.P, 'String', {
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
},{"./$":17,"./$.cof":7,"./$.def":12}],54:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode;

$def($def.S, 'String', {
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
},{"./$":17,"./$.def":12}],55:[function(require,module,exports){
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
},{"./$":17,"./$.cof":7,"./$.def":12}],56:[function(require,module,exports){
var set   = require('./$').set
  , at    = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
$iter.std(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = at.call(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":17,"./$.iter":16,"./$.string-at":24,"./$.uid":26}],57:[function(require,module,exports){
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
},{"./$":17,"./$.def":12}],58:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: function repeat(count){
    var str = String($.assertDefined(this))
      , res = ''
      , n   = $.toInteger(count);
    if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
    for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
    return res;
  }
});
},{"./$":17,"./$.def":12}],59:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function startsWith(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":17,"./$.cof":7,"./$.def":12}],60:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
  , keyOf    = require('./$.keyof')
  , has      = $.has
  , hide     = $.hide
  , getNames = $.getNames
  , toObject = $.toObject
  , Symbol   = $.g.Symbol
  , Base     = Symbol
  , setter   = false
  , TAG      = uid.safe('tag')
  , SymbolRegistry = {}
  , AllSymbols     = {};

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($.create(Symbol.prototype), TAG, tag);
  $.DESC && setter && $.setDesc(Object.prototype, tag, {
    configurable: true,
    set: function(value){
      hide(this, tag, value);
    }
  });
  return sym;
}

// 19.4.1.1 Symbol([description])
if(!$.isFunction(Symbol)){
  Symbol = function Symbol(description){
    if(this instanceof Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(description));
  };
  hide(Symbol.prototype, 'toString', function(){
    return this[TAG];
  });
}
$def($def.G + $def.W, {Symbol: Symbol});

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  pure: uid.safe,
  set: $.set,
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
    symbolStatics[it] = Symbol === Base ? sym : wrap(sym);
  }
);

setter = true;

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * (Symbol != Base), 'Object', {
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: function getOwnPropertyNames(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
    return result;
  },
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: function getOwnPropertySymbols(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
    return result;
  }
});

setTag(Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":17,"./$.cof":7,"./$.def":12,"./$.keyof":18,"./$.uid":26,"./$.wks":28}],61:[function(require,module,exports){
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
},{"./$":17,"./$.collection":10,"./$.collection-weak":9}],62:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":10,"./$.collection-weak":9}],63:[function(require,module,exports){
// https://github.com/domenic/Array.prototype.includes
var $def = require('./$.def');
$def($def.P, 'Array', {
  includes: require('./$.array-includes')(true)
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":12,"./$.unscope":27}],64:[function(require,module,exports){
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
},{"./$":17,"./$.def":12,"./$.own-keys":19}],65:[function(require,module,exports){
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
},{"./$":17,"./$.def":12}],66:[function(require,module,exports){
// https://gist.github.com/kangax/9698100
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
});
},{"./$.def":12,"./$.replacer":21}],67:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def')
  , forOf = require('./$.iter').forOf;
$def($def.P, 'Set', {
  toJSON: function(){
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  }
});
},{"./$.def":12,"./$.iter":16}],68:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
var $def = require('./$.def');
$def($def.P, 'String', {
  at: require('./$.string-at')(true)
});
},{"./$.def":12,"./$.string-at":24}],69:[function(require,module,exports){
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
},{"./$":17,"./$.ctx":11,"./$.def":12}],70:[function(require,module,exports){
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
},{"./$":17,"./$.iter":16,"./$.wks":28,"./es6.array.iterator":35}],71:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":12,"./$.task":25}],72:[function(require,module,exports){
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
},{"./$":17,"./$.def":12,"./$.invoke":14,"./$.partial":20}],73:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.statics-accept-primitives');
require('./modules/es6.function.name');
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
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.to-array');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;
},{"./modules/$":17,"./modules/es5":29,"./modules/es6.array.copy-within":30,"./modules/es6.array.fill":31,"./modules/es6.array.find":33,"./modules/es6.array.find-index":32,"./modules/es6.array.from":34,"./modules/es6.array.iterator":35,"./modules/es6.array.of":36,"./modules/es6.array.species":37,"./modules/es6.function.name":38,"./modules/es6.map":39,"./modules/es6.math":40,"./modules/es6.number.constructor":41,"./modules/es6.number.statics":42,"./modules/es6.object.assign":43,"./modules/es6.object.is":44,"./modules/es6.object.set-prototype-of":45,"./modules/es6.object.statics-accept-primitives":46,"./modules/es6.object.to-string":47,"./modules/es6.promise":48,"./modules/es6.reflect":49,"./modules/es6.regexp":50,"./modules/es6.set":51,"./modules/es6.string.code-point-at":52,"./modules/es6.string.ends-with":53,"./modules/es6.string.from-code-point":54,"./modules/es6.string.includes":55,"./modules/es6.string.iterator":56,"./modules/es6.string.raw":57,"./modules/es6.string.repeat":58,"./modules/es6.string.starts-with":59,"./modules/es6.symbol":60,"./modules/es6.weak-map":61,"./modules/es6.weak-set":62,"./modules/es7.array.includes":63,"./modules/es7.object.get-own-property-descriptors":64,"./modules/es7.object.to-array":65,"./modules/es7.regexp.escape":66,"./modules/es7.set.to-json":67,"./modules/es7.string.at":68,"./modules/js.array.statics":69,"./modules/web.dom.iterable":70,"./modules/web.immediate":71,"./modules/web.timers":72}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":2}],76:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":75}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":77,"./encode":78}],80:[function(require,module,exports){
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


},{"querystring":79,"superagent":81}],81:[function(require,module,exports){
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

},{"emitter":82,"reduce":83}],82:[function(require,module,exports){

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

},{}],83:[function(require,module,exports){

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
},{}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":84,"./data/objective_labels":85,"./data/objective_map":86,"./data/objective_meta":87,"./data/objective_names":88,"./data/objective_types":89,"./data/world_names":90}],92:[function(require,module,exports){
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

},{"./MatchWorld":93}],93:[function(require,module,exports){
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

},{"./../../common/Icons/Pie":126,"./Score":94}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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

},{"./Match":92}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
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

},{"./World":96}],98:[function(require,module,exports){
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

        var dataListeners = {
            // regions     : this.onRegions.bind(this),
            // matchesByRegion: this.onMatchesByRegion.bind(this),
            // worldsByRegion : this.onWorldsByRegion.bind(this),
            onMatchData: this.onMatchData.bind(this) };

        this.dao = new DAO(dataListeners);

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

},{"./../lib/data/overview":131,"./Matches":95,"./Worlds":97}],99:[function(require,module,exports){
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

},{"../Objectives":118}],100:[function(require,module,exports){
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
                        dataReady ? React.createElement(
                            'a',
                            { href: 'http://guilds.gw2w2w.com/guilds/' + slugify(guildName), target: '_blank' },
                            React.createElement(Emblem, { guildName: guildName, size: 256 })
                        ) : React.createElement(Emblem, { size: 256 })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-20' },
                        dataReady ? React.createElement(
                            'h1',
                            null,
                            React.createElement(
                                'a',
                                { href: 'http://guilds.gw2w2w.com/guilds/' + slugify(guildName), target: '_blank' },
                                guildName,
                                ' [',
                                guildTag,
                                ']'
                            )
                        ) : loadingHtml,
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

},{"./../../common/Icons/Emblem":125,"./Claims":99}],101:[function(require,module,exports){
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

},{"./Guild":100}],102:[function(require,module,exports){
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
            var newMapFilter = !Immutable.is(this.props.mapFilter, nextProps.mapFilter);
            var newEventFilter = !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
            var shouldUpdate = newLang || newGuild || newEntry || newMapFilter || newEventFilter;

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

},{"../Objectives":118,"gw2w2w-static":91}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
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

            var newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
            var newFilterState = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

            var shouldUpdate = newLang || newGuilds || newTriggerState || newFilterState;

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

},{"./Entry":102}],105:[function(require,module,exports){
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

},{"gw2w2w-static":91}],106:[function(require,module,exports){
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

            var newMapFilter = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
            var newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);

            var shouldUpdate = newLang || newGuilds || newHistory || newMapFilter || newEventFilter;

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

},{"./EventFilters":103,"./LogEntries":104,"./MapFilters":105}],107:[function(require,module,exports){
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

            var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

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

},{"./../../lib/static":134,"./MapScores":108,"./MapSection":109}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
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
    lang: React.PropTypes.object.isRequired,
    mapSection: React.PropTypes.object.isRequired,
    guilds: React.PropTypes.object.isRequired,
    details: React.PropTypes.object.isRequired };

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

            var shouldUpdate = newLang || newGuilds || newDetails;

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
                    var owner = owners.get(objectiveId.toString());
                    var claimer = claimers.get(objectiveId.toString());

                    var guildId = claimer ? claimer.guild : null;
                    var hasClaimer = !!guildId;

                    var hasGuildData = hasClaimer && _this.props.guilds.has(guildId);
                    var guild = hasGuildData ? _this.props.guilds.get(guildId) : null;

                    return React.createElement(
                        'li',
                        { key: objectiveId, id: 'objective-' + objectiveId },
                        React.createElement(Objective, {
                            lang: _this.props.lang,
                            cols: objectiveCols,

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

},{"./../Objectives":118}],110:[function(require,module,exports){
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

            var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

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

},{"./../Log":106,"./MapDetails":107}],111:[function(require,module,exports){
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

                var id = props.guildId;
                var href = '#' + id;

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

},{"./../../common/Icons/Emblem":125}],112:[function(require,module,exports){
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

},{"./../../common/Icons/Arrow":124,"./../../common/Icons/Sprite":127,"./../../lib/static":134}],113:[function(require,module,exports){
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

},{"./../../lib/static":134}],114:[function(require,module,exports){
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

},{"./../../lib/static":134}],115:[function(require,module,exports){
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
                var expires = this.props.timestamp + 5 * 60;

                return React.createElement(
                    'span',
                    { className: 'timer countdown inactive', 'data-expires': expires },
                    spinner
                );
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

},{}],116:[function(require,module,exports){
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
                        { className: 'timer relative', 'data-timestamp': this.props.timestamp },
                        moment(this.props.timestamp * 1000).twitterShort()
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
                var timestampHtml = moment(this.props.timestamp * 1000).format('hh:mm:ss');

                return React.createElement(
                    'div',
                    { className: 'objective-timestamp' },
                    timestampHtml
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

},{}],118:[function(require,module,exports){
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

            var shouldUpdate = newLang || newCapture || newOwner || newClaimer || newGuildData;

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
                React.createElement(TimerRelative, { isEnabled: !!cols.elapsed, timestamp: props.timestamp }),
                React.createElement(Timestamp, { isEnabled: !!cols.timestamp, timestamp: props.timestamp }),
                React.createElement(MapName, { isEnabled: !!cols.mapAbbrev, objectiveId: objectiveId }),
                React.createElement(Icons, {
                    showArrow: !!cols.arrow,
                    showSprite: !!cols.sprite,
                    objectiveId: objectiveId,
                    color: this.props.worldColor
                }),
                React.createElement(Label, { isEnabled: !!cols.name, objectiveId: objectiveId, lang: this.props.lang }),
                React.createElement(
                    'div',
                    { className: 'objective-state' },
                    React.createElement(Guild, {
                        showName: cols.guildName,
                        showTag: cols.guildTag,
                        guildId: this.props.guildId,
                        guild: this.props.guild
                    }),
                    React.createElement(TimerCountdown, { isEnabled: !!cols.timer, timestamp: props.timestamp })
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

},{"./../../lib/static":134,"./Guild":111,"./Icons":112,"./Label":113,"./MapName":114,"./TimerCountdown":115,"./TimerRelative":116,"./Timestamp":117}],119:[function(require,module,exports){
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

},{"./../../../common/Icons/Sprite":127,"./../../../lib/static":134}],120:[function(require,module,exports){
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

},{"./Item":119}],121:[function(require,module,exports){
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

},{"./Holdings":120}],122:[function(require,module,exports){
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

},{"./World":121}],123:[function(require,module,exports){
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

var DataProvider = require('./../lib/data/tracker');
var GuildsLib = require('./../lib/tracker/guilds');
var STATIC = require('./../lib/static');

/*
* React Components
*/

var Scoreboard = require('./Scoreboard');
var Maps = require('./Maps');
var Guilds = require('./Guilds');

/*
*
* Component Export
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired };

var Tracker = (function (_React$Component) {
    function Tracker(props) {
        _classCallCheck(this, Tracker);

        _get(Object.getPrototypeOf(Tracker.prototype), 'constructor', this).call(this, props);

        this.mounted = true;
        this.intervals = { timers: null };
        this.timeouts = { data: null };

        this.guildLib = new GuildsLib(this);

        var dataListeners = {};
        this.dataProvider = new DataProvider(props.lang, dataListeners);

        this.state = this.dataProvider.getDefaults();
    }

    _inherits(Tracker, _React$Component);

    _createClass(Tracker, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            var initialData = !Immutable.is(this.state.hasData, nextState.hasData);
            var newMatchData = !Immutable.is(this.state.lastmod, nextState.lastmod);
            var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
            var newLang = !Immutable.is(this.props.lang, nextProps.lang);
            var shouldUpdate = initialData || newMatchData || newGuildData || newLang;

            return shouldUpdate;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log('Tracker::componentDidMount()');

            this.intervals.timers = setInterval(updateTimers.bind(this), 1000);

            setImmediate(updateTimers.bind(this));
            setImmediate(getMatchDetails.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.log('Tracker::componentWillUnmount()');

            clearTimers.call(this);

            this.mounted = false;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // console.log('componentWillReceiveProps()', newLang);

            if (!Immutable.is(this.props.lang, nextProps.lang)) {
                setMatchWorlds.call(this, nextProps.lang);
            }
        }
    }, {
        key: 'render',

        // componentWillUpdate() {
        //  console.log('Tracker::componentWillUpdate()');
        // }

        value: function render() {
            // console.log('Tracker::render()');
            setPageTitle(this.props.lang, this.props.world);

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

                            guilds: this.state.guilds,
                            claimEvents: this.state.claimEvents
                        }) : null
                    )
                )
            );
        }
    }]);

    return Tracker;
})(React.Component);

/*
*
* Private Methods
*
*/

/*
* Timers
*/

function updateTimers() {
    var component = this;
    var state = component.state;
    // console.log('updateTimers()');

    var timeOffset = state.timeOffset;
    var now = libDate.dateNow() - timeOffset;

    trackerTimers.update(now, timeOffset);
}

function clearTimers() {
    // console.log('clearTimers()');
    var component = this;

    _.forEach(component.intervals, clearInterval);
    _.forEach(component.timeouts, clearTimeout);
}

/*
*
* Match Details
*
*/

function getMatchDetails() {
    var component = this;
    var props = component.props;

    var world = props.world;
    var langSlug = props.lang.get('slug');
    var worldSlug = world.getIn([langSlug, 'slug']);

    api.getMatchDetailsByWorld(worldSlug, onMatchDetails.bind(this));
}

function onMatchDetails(err, data) {
    var component = this;
    var props = component.props;
    var state = component.state;

    if (component.mounted) {
        if (!err && data && data.match && data.details) {
            (function () {
                var lastmod = data.match.lastmod;
                var isModified = lastmod !== state.match.get('lastmod');

                // console.log('onMatchDetails', data.match.lastmod, isModified);

                if (isModified) {
                    (function () {
                        var dateNow = libDate.dateNow();
                        var timeOffset = Math.floor(dateNow - data.now / 1000);

                        var matchData = Immutable.fromJS(data.match);
                        var detailsData = Immutable.fromJS(data.details);

                        // use transactional setState
                        component.setState(function (state) {
                            return {
                                hasData: true,
                                dateNow: dateNow,
                                timeOffset: timeOffset,
                                lastmod: lastmod,

                                match: state.match.mergeDeep(matchData),
                                details: state.details.mergeDeep(detailsData) };
                        });

                        setImmediate(component.guildLib.onMatchData.bind(component.guildLib, detailsData));

                        if (state.matchWorlds.isEmpty()) {
                            setImmediate(setMatchWorlds.bind(component, props.lang));
                        }
                    })();
                }
            })();
        }

        rescheduleDataUpdate.call(component);
    }
}

function rescheduleDataUpdate() {
    var component = this;
    var refreshTime = _.random(1000 * 2, 1000 * 4);

    component.timeouts.data = setTimeout(getMatchDetails.bind(component), refreshTime);
}

/*
*
* MatchWorlds
*
*/

function setMatchWorlds(lang) {
    var component = this;

    var matchWorlds = Immutable.List(['red', 'blue', 'green']).map(getMatchWorld.bind(component, lang));

    component.setState({ matchWorlds: matchWorlds });
}

function getMatchWorld(lang, color) {
    var component = this;
    var state = component.state;

    var langSlug = lang.get('slug');
    var worldKey = color + 'Id';
    var worldId = state.match.getIn([worldKey]).toString();
    var worldByLang = STATIC.worlds.getIn([worldId, langSlug]);

    return worldByLang.set('color', color).set('link', getWorldLink(langSlug, worldByLang));
}

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}

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

},{"./../lib/api":130,"./../lib/data/tracker":132,"./../lib/date":133,"./../lib/static":134,"./../lib/tracker/guilds":136,"./../lib/trackerTimers":135,"./Guilds":101,"./Maps":110,"./Scoreboard":122}],124:[function(require,module,exports){
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

},{}],125:[function(require,module,exports){
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
    guildName: React.PropTypes.string,
    size: React.PropTypes.number.isRequired };

var defaultProps = {
    guildName: undefined,
    size: 256 };

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
            var newGuildName = this.props.guildName !== nextProps.guildName;
            var newSize = this.props.size !== nextProps.size;
            var shouldUpdate = newGuildName || newSize;

            return shouldUpdate;
        }
    }, {
        key: 'render',
        value: function render() {
            var emblemSrc = getEmblemSrc(this.props.guildName);

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

},{}],126:[function(require,module,exports){
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

},{}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
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

},{}],129:[function(require,module,exports){
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

},{"./../../lib/static":134,"./LangLink":128}],130:[function(require,module,exports){
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

},{"gw2api":80}],131:[function(require,module,exports){
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
    }, {
        key: '__setDataTimeout',
        value: function __setDataTimeout() {
            var interval = getInterval();
            // console.log('lib::data::overview::__setDataTimeout()', interval);

            this.__timeouts.matchData = setTimeout(this.__getData.bind(this), interval);
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

},{"./../api":130,"./../static":134}],132:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var libDate = require('./../../date');
var api = require('./../../api');
var STATIC = require('./../../static');

var TrackerDataProvider = (function () {
    function TrackerDataProvider(lang, listeners) {
        _classCallCheck(this, TrackerDataProvider);

        // console.log('lib::data::tracker::constructor()');

        this.lang = lang;

        this.mounted = false;
        this.listeners = listeners;

        this.timeouts = {};
        this.intervals = {};
    }

    _createClass(TrackerDataProvider, [{
        key: 'init',
        value: function init() {
            // console.log('lib::data::tracker::init()');

            this.mounted = true;
        }
    }, {
        key: 'close',
        value: function close() {
            // console.log('lib::data::tracker::close()');

            this.mounted = false;

            this.timeouts = _.map(this.timeouts, function (t) {
                return clearTimeout(t);
            });
            this.intervals = _.map(this.intervals, function (i) {
                return clearInterval(i);
            });
        }
    }, {
        key: 'getDefaults',
        value: function getDefaults() {
            // console.log('lib::data::tracker::getDefaults()');

            return {
                hasData: false,

                dateNow: libDate.dateNow(),
                lastmod: 0,
                timeOffset: 0,

                match: Immutable.Map({ lastmod: 0 }),
                matchWorlds: Immutable.List(),
                details: Immutable.Map(),
                claimEvents: Immutable.List(),
                guilds: Immutable.Map() };
        }
    }]);

    return TrackerDataProvider;
})();

module.exports = TrackerDataProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../api":130,"./../../date":133,"./../../static":134}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{"gw2w2w-static":91}],135:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

function update(now, timeOffset) {
    var $timers = $('.timer');
    var $countdowns = $timers.filter('.countdown');
    var $relatives = $timers.filter('.relative');

    async.parallel([updateRelativeTimers.bind(null, $relatives, timeOffset), updateCountdownTimers.bind(null, $countdowns, now)], _.noop);
}

function updateRelativeTimers(relatives, timeOffset, cb) {
    async.each(relatives, updateRelativeTimeNode.bind(null, timeOffset), cb);
}

function updateCountdownTimers(countdowns, now, cb) {
    async.each(countdowns, updateCountdownTimerNode.bind(null, now), cb);
}

function updateRelativeTimeNode(timeOffset, el, next) {
    var $el = $(el);

    var timestamp = _.parseInt($el.attr('data-timestamp'));
    var offsetTimestamp = timestamp + timeOffset;
    var timestampMoment = moment(offsetTimestamp * 1000);
    var timestampRelative = timestampMoment.twitterShort();

    $el.text(timestampRelative);

    next();
}

function updateCountdownTimerNode(now, el, next) {
    var $el = $(el);

    var dataExpires = $el.attr('data-expires');
    var expires = _.parseInt(dataExpires);
    var secRemaining = expires - now;
    var secElapsed = 300 - secRemaining;

    var highliteTime = 10;
    var isVisible = expires + highliteTime >= now;
    var isExpired = expires < now;
    var isActive = !isExpired;
    var isTimerHighlighted = secRemaining <= Math.abs(highliteTime);
    var isTimerFresh = secElapsed <= highliteTime;

    var timerText = isActive ? moment(secRemaining * 1000).format('m:ss') : '0:00';

    if (isVisible) {
        var $objective = $el.closest('.objective');
        var hasClassHighlight = $el.hasClass('highlight');
        var hasClassFresh = $objective.hasClass('fresh');

        if (isTimerHighlighted && !hasClassHighlight) {
            $el.addClass('highlight');
        } else if (!isTimerHighlighted && hasClassHighlight) {
            $el.removeClass('highlight');
        }

        if (isTimerFresh && !hasClassFresh) {
            $objective.addClass('fresh');
        } else if (!isTimerFresh && hasClassFresh) {
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

},{}],136:[function(require,module,exports){
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

var api = require('./../api.js');

/*
 *
 * Module Globals
 *
 */

var guildDefault = Immutable.Map({
    loaded: false,
    lastClaim: 0,
    claims: Immutable.Map() });

var numQueueConcurrent = 4;

/*
 *
 * Public Methods
 *
 */

var LibGuilds = (function () {
    function LibGuilds(component) {
        _classCallCheck(this, LibGuilds);

        this.component = component;

        this.asyncGuildQueue = async.queue(this.getGuildDetails.bind(this), numQueueConcurrent);

        return this;
    }

    _createClass(LibGuilds, [{
        key: 'onMatchData',
        value: function onMatchData(matchDetails) {
            // let component = this;
            var state = this.component.state;

            // console.log('LibGuilds::onMatchData()');

            var objectiveClaimers = matchDetails.getIn(['objectives', 'claimers']);
            var claimEvents = getEventsByType(matchDetails, 'claim');
            var guildsToLookup = getUnknownGuilds(state.guilds, objectiveClaimers, claimEvents);

            // send new guilds to async queue manager for data retrieval
            if (!guildsToLookup.isEmpty()) {
                this.asyncGuildQueue.push(guildsToLookup.toArray());
            }

            var newGuilds = state.guilds;
            newGuilds = initializeGuilds(newGuilds, guildsToLookup);
            newGuilds = guildsProcessClaims(newGuilds, claimEvents);

            // update state if necessary
            if (!Immutable.is(state.guilds, newGuilds)) {
                // console.log('guilds::onMatchData()', 'has update');
                this.component.setState({
                    guilds: newGuilds
                });
            }
        }
    }, {
        key: 'getGuildDetails',
        value: function getGuildDetails(guildId, onComplete) {
            var component = this.component;
            var state = component.state;
            var hasData = state.guilds.getIn([guildId, 'loaded']);

            if (hasData) {
                // console.log('Tracker::getGuildDetails()', 'skip', guildId);
                onComplete(null);
            } else {
                // console.log('Tracker::getGuildDetails()', 'lookup', guildId);
                api.getGuildDetails(guildId, onGuildData.bind(this, onComplete));
            }
        }
    }]);

    return LibGuilds;
})();

/*
 *
 * Private Methods
 *
 */

function onGuildData(onComplete, err, data) {
    var component = this.component;

    if (component.mounted) {
        if (!err && data) {
            (function () {
                delete data.emblem;
                data.loaded = true;

                var guildId = data.guild_id;
                var guildData = Immutable.fromJS(data);

                component.setState(function (state) {
                    return {
                        guilds: state.guilds.mergeIn([guildId], guildData)
                    };
                });
            })();
        }
    }

    onComplete(null);
}

function guildsProcessClaims(guilds, claimEvents) {
    // console.log('guildsProcessClaims()', guilds.size);

    return guilds.map(guildAttachClaims.bind(null, claimEvents));
}

function guildAttachClaims(claimEvents, guild, guildId) {
    var incClaims = claimEvents.filter(function (entry) {
        return entry.get('guild') === guildId;
    }).toMap();

    var hasClaims = !guild.get('claims').isEmpty();
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

function initializeGuilds(guilds, newGuilds) {
    // console.log('initializeGuilds()');
    // console.log('newGuilds', newGuilds);

    newGuilds.forEach(function (guildId) {
        if (!guilds.has(guildId)) {
            var guild = guildDefault.set('guild_id', guildId);
            guilds = guilds.set(guildId, guild);
        }
    });

    return guilds;
}

function getEventsByType(matchDetails, eventType) {
    return matchDetails.get('history').filter(function (entry) {
        return entry.get('type') === eventType;
    }).sortBy(function (entry) {
        return -entry.get('timestamp');
    });
}

function getUnknownGuilds(stateGuilds, objectiveClaimers, claimEvents) {
    var guildsWithCurrentClaims = objectiveClaimers.map(function (entry) {
        return entry.get('guild');
    }).toSet();

    var guildsWithPreviousClaims = claimEvents.map(function (entry) {
        return entry.get('guild');
    }).toSet();

    var guildClaims = guildsWithCurrentClaims.union(guildsWithPreviousClaims);

    var knownGuilds = stateGuilds.map(function (entry) {
        return entry.get('guild_id');
    }).toSet();

    var unknownGuilds = guildClaims.subtract(knownGuilds);

    // console.log('guildClaims', guildClaims.toArray());
    // console.log('knownGuilds', knownGuilds.toArray());
    // console.log('unknownGuilds', unknownGuilds.toArray());

    return unknownGuilds;
}

/*
 *
 * Export Module
 *
 */

module.exports = LibGuilds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api.js":130}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24td2Vhay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pbnZva2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQua2V5b2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm93bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5wYXJ0aWFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRhc2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnVpZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM1LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmltbWVkaWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21ldGEuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2hXb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvU2NvcmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9DbGFpbXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRW50cnkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FdmVudEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9Mb2dFbnRyaWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTWFwRmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcERldGFpbHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2NvcmVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNlY3Rpb24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvSWNvbnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTGFiZWwuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTWFwTmFtZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lckNvdW50ZG93bi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lclJlbGF0aXZlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVzdGFtcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9JdGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9BcnJvdy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9FbWJsZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvUGllLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1Nwcml0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9MYW5nTGluay5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0YS9vdmVydmlldy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRhL3RyYWNrZXIvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9zdGF0aWMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvdHJhY2tlclRpbWVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMv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S0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLFNBQVM7S0FBQSxDQUFDLENBQUM7Q0FDckU7O0FBSUQsU0FBUyxHQUFHLEdBQUc7QUFDWCxRQUFNLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0RCxRQUFNLElBQUksR0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWhGLEtBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFLO0FBQzdCLFNBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQ2IsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksY0FBWSxJQUFJLEFBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FDakQsQ0FBQztLQUNMLENBQUMsQ0FBQztDQUNOOzs7Ozs7QUNoSUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BqQkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQVNiLElBQU0sS0FBSyxHQUFRLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQyxJQUFNLFNBQVMsR0FBSSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7OztBQU94QyxJQUFNLFVBQVUsR0FBRyxP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Qzs7QUFFYixRQUFNLGFBQWEsR0FBRyxXQUFXLENBQzVCLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7O0FBTzNCLFdBQU8sYUFBYSxDQUFDO0NBQ3hCOzs7Ozs7OztBQVlELE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBwYWdlICAgICAgPSByZXF1aXJlKCdwYWdlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTGFuZ3MgICAgID0gcmVxdWlyZSgnY29tbW9uL0xhbmdzJyk7XHJcbmNvbnN0IE92ZXJ2aWV3ICA9IHJlcXVpcmUoJ092ZXJ2aWV3Jyk7XHJcbmNvbnN0IFRyYWNrZXIgICA9IHJlcXVpcmUoJ1RyYWNrZXInKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRE9NIFJlYWR5XHJcbipcclxuKi9cclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICBhdHRhY2hSb3V0ZXMoKTtcclxuICAgIHNldEltbWVkaWF0ZShlbWwpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFJvdXRlc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhdHRhY2hSb3V0ZXMoKSB7XHJcbiAgICBjb25zdCBkb21Nb3VudHMgPSB7XHJcbiAgICAgICAgbmF2TGFuZ3M6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSxcclxuICAgICAgICBjb250ZW50IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSxcclxuICAgIH07XHJcblxyXG5cclxuICAgIHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgY29uc3QgbGFuZ1NsdWcgID0gY3R4LnBhcmFtcy5sYW5nU2x1ZztcclxuICAgICAgICBjb25zdCBsYW5nICAgICAgPSBTVEFUSUMubGFuZ3MuZ2V0KGxhbmdTbHVnKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd29ybGRTbHVnID0gY3R4LnBhcmFtcy53b3JsZFNsdWc7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgICAgID0gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcblxyXG4gICAgICAgIGxldCBBcHAgICA9IE92ZXJ2aWV3O1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHtsYW5nfTtcclxuXHJcbiAgICAgICAgaWYgKHdvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAod29ybGQpICYmICF3b3JsZC5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgQXBwID0gVHJhY2tlcjtcclxuICAgICAgICAgICAgcHJvcHMud29ybGQgPSB3b3JsZDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBSZWFjdC5yZW5kZXIoPExhbmdzIHsuLi5wcm9wc30gLz4sIGRvbU1vdW50cy5uYXZMYW5ncyk7XHJcbiAgICAgICAgUmVhY3QucmVuZGVyKDxBcHAgey4uLnByb3BzfSAvPiwgZG9tTW91bnRzLmNvbnRlbnQpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAvLyByZWRpcmVjdCAnLycgdG8gJy9lbidcclxuICAgIHBhZ2UoJy8nLCByZWRpcmVjdFBhZ2UuYmluZChudWxsLCAnL2VuJykpO1xyXG5cclxuXHJcblxyXG5cclxuICAgIHBhZ2Uuc3RhcnQoe1xyXG4gICAgICAgIGNsaWNrICAgOiB0cnVlLFxyXG4gICAgICAgIHBvcHN0YXRlOiB0cnVlLFxyXG4gICAgICAgIGRpc3BhdGNoOiB0cnVlLFxyXG4gICAgICAgIGhhc2hiYW5nOiBmYWxzZSxcclxuICAgICAgICBkZWNvZGVVUkxDb21wb25lbnRzIDogdHJ1ZSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFV0aWxcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gcmVkaXJlY3RQYWdlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICBwYWdlLnJlZGlyZWN0KGRlc3RpbmF0aW9uKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpIHtcclxuICAgIHJldHVybiBTVEFUSUMud29ybGRzXHJcbiAgICAgICAgLmZpbmQod29ybGQgPT4gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKSA9PT0gd29ybGRTbHVnKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBlbWwoKSB7XHJcbiAgICBjb25zdCBjaHVua3MgPSBbJ2d3MncydycsICdzY2h0dXBoJywgJ2NvbScsICdAJywgJy4nXTtcclxuICAgIGNvbnN0IGFkZHIgICA9IFtjaHVua3NbMF0sIGNodW5rc1szXSwgY2h1bmtzWzFdLCBjaHVua3NbNF0sIGNodW5rc1syXV0uam9pbignJyk7XHJcblxyXG4gICAgJCgnLm5vc3BhbS1wcnonKS5lYWNoKChpLCBlbCkgPT4ge1xyXG4gICAgICAgICQoZWwpLnJlcGxhY2VXaXRoKFxyXG4gICAgICAgICAgICAkKCc8YT4nLCB7aHJlZjogYG1haWx0bzoke2FkZHJ9YCwgdGV4dDogYWRkcn0pXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pZiAoZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIm9ubHkgb25lIGluc3RhbmNlIG9mIGJhYmVsL3BvbHlmaWxsIGlzIGFsbG93ZWRcIik7XG59XG5nbG9iYWwuX2JhYmVsUG9seWZpbGwgPSB0cnVlO1xuXG5yZXF1aXJlKFwiY29yZS1qcy9zaGltXCIpO1xuXG5yZXF1aXJlKFwicmVnZW5lcmF0b3IvcnVudGltZVwiKTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2ZcclxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcclxudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcclxuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAkLnRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXHJcbiAgICAgICwgdmFsdWU7XHJcbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XHJcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcclxuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcclxuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleDtcclxuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcclxuICB9O1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuLy8gMCAtPiBBcnJheSNmb3JFYWNoXHJcbi8vIDEgLT4gQXJyYXkjbWFwXHJcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXHJcbi8vIDMgLT4gQXJyYXkjc29tZVxyXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XHJcbi8vIDUgLT4gQXJyYXkjZmluZFxyXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxyXG52YXIgJCAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCA9IHJlcXVpcmUoJy4vJC5jdHgnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFKXtcclxuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxyXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXHJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcclxuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxyXG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XHJcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcclxuICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIHNlbGYgICA9ICQuRVM1T2JqZWN0KE8pXHJcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcclxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IDBcclxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBBcnJheShsZW5ndGgpIDogSVNfRklMVEVSID8gW10gOiB1bmRlZmluZWRcclxuICAgICAgLCB2YWwsIHJlcztcclxuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XHJcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xyXG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xyXG4gICAgICBpZihUWVBFKXtcclxuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcclxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XHJcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxyXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcclxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcclxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xyXG4gIH07XHJcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnMSwgbXNnMil7XHJcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XHJcbn1cclxuYXNzZXJ0LmRlZiA9ICQuYXNzZXJ0RGVmaW5lZDtcclxuYXNzZXJ0LmZuID0gZnVuY3Rpb24oaXQpe1xyXG4gIGlmKCEkLmlzRnVuY3Rpb24oaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59O1xyXG5hc3NlcnQub2JqID0gZnVuY3Rpb24oaXQpe1xyXG4gIGlmKCEkLmlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59O1xyXG5hc3NlcnQuaW5zdCA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XHJcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcclxuLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXtcclxuLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXHJcbiAgdmFyIFQgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRhcmdldCkpXHJcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGkgPSAxO1xyXG4gIHdoaWxlKGwgPiBpKXtcclxuICAgIHZhciBTICAgICAgPSAkLkVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcclxuICAgICAgLCBrZXlzICAgPSAkLmdldEtleXMoUylcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGogICAgICA9IDBcclxuICAgICAgLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIFQ7XHJcbn07IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFRBRyAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXHJcbiAgLCB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xyXG5mdW5jdGlvbiBjb2YoaXQpe1xyXG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XHJcbn1cclxuY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XHJcbiAgdmFyIE8sIFQ7XHJcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xyXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcclxufTtcclxuY29mLnNldCA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xyXG4gIGlmKGl0ICYmICEkLmhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkkLmhpZGUoaXQsIFRBRywgdGFnKTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb2Y7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcclxuICAsIHNhZmUgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcclxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCAkaXRlciAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIGhhcyAgICAgID0gJC5oYXNcclxuICAsIHNldCAgICAgID0gJC5zZXRcclxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxyXG4gICwgaGlkZSAgICAgPSAkLmhpZGVcclxuICAsIHN0ZXAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgaXNGcm96ZW4gPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxyXG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXHJcbiAgLCBPMSAgICAgICA9IHNhZmUoJ08xJylcclxuICAsIExBU1QgICAgID0gc2FmZSgnbGFzdCcpXHJcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcclxuICAsIElURVIgICAgID0gc2FmZSgnaXRlcicpXHJcbiAgLCBTSVpFICAgICA9ICQuREVTQyA/IHNhZmUoJ3NpemUnKSA6ICdzaXplJ1xyXG4gICwgaWQgICAgICAgPSAwO1xyXG5cclxuZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcclxuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XHJcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcclxuICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxyXG4gIGlmKGlzRnJvemVuKGl0KSlyZXR1cm4gJ0YnO1xyXG4gIGlmKCFoYXMoaXQsIElEKSl7XHJcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxyXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xyXG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXHJcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XHJcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxyXG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RW50cnkodGhhdCwga2V5KXtcclxuICAvLyBmYXN0IGNhc2VcclxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xyXG4gIGlmKGluZGV4ICE9ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xyXG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxyXG4gIGZvcihlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbihOQU1FLCBJU19NQVAsIEFEREVSKXtcclxuICAgIGZ1bmN0aW9uIEMoaXRlcmFibGUpe1xyXG4gICAgICB2YXIgdGhhdCA9IGFzc2VydC5pbnN0KHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICBzZXQodGhhdCwgTzEsICQuY3JlYXRlKG51bGwpKTtcclxuICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xyXG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgc2V0KHRoYXQsIEZJUlNULCB1bmRlZmluZWQpO1xyXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpJGl0ZXIuZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgfVxyXG4gICAgJC5taXgoQy5wcm90b3R5cGUsIHtcclxuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcclxuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdFtGSVJTVF0gPSB0aGF0W0xBU1RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcclxuICAgICAgICBpZihlbnRyeSl7XHJcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cclxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcclxuICAgICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcclxuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xyXG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xyXG4gICAgICAgICAgaWYodGhhdFtGSVJTVF0gPT0gZW50cnkpdGhhdFtGSVJTVF0gPSBuZXh0O1xyXG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcclxuICAgICAgICAgIHRoYXRbU0laRV0tLTtcclxuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAgICAgLCBlbnRyeTtcclxuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcclxuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XHJcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcclxuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGFzc2VydC5kZWYodGhpc1tTSVpFXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxyXG4gICAgICAsIHByZXYsIGluZGV4O1xyXG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XHJcbiAgICBpZihlbnRyeSl7XHJcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcclxuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcclxuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcclxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XHJcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcclxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxyXG4gICAgICB9O1xyXG4gICAgICBpZighdGhhdFtGSVJTVF0pdGhhdFtGSVJTVF0gPSBlbnRyeTtcclxuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcclxuICAgICAgdGhhdFtTSVpFXSsrO1xyXG4gICAgICAvLyBhZGQgdG8gaW5kZXhcclxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcclxuICBnZXRJdGVyQ29uc3RydWN0b3I6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbmV4dDogZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAsIGVudHJ5ID0gaXRlci5sO1xyXG4gICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgIC8vIGdldCBuZXh0IGVudHJ5XHJcbiAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XHJcbiAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXHJcbiAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgcmV0dXJuIHN0ZXAoMSk7XHJcbiAgICB9XHJcbiAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXHJcbiAgICBpZihraW5kID09ICdrZXknICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XHJcbiAgICBpZihraW5kID09ICd2YWx1ZScpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XHJcbiAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xyXG4gIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2FmZSAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcclxuICAsIGFzc2VydCAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgZm9yT2YgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5mb3JPZlxyXG4gICwgX2hhcyAgICAgID0gJC5oYXNcclxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcclxuICAsIGhpZGUgICAgICA9ICQuaGlkZVxyXG4gICwgaXNGcm96ZW4gID0gT2JqZWN0LmlzRnJvemVuIHx8ICQuY29yZS5PYmplY3QuaXNGcm96ZW5cclxuICAsIGlkICAgICAgICA9IDBcclxuICAsIElEICAgICAgICA9IHNhZmUoJ2lkJylcclxuICAsIFdFQUsgICAgICA9IHNhZmUoJ3dlYWsnKVxyXG4gICwgTEVBSyAgICAgID0gc2FmZSgnbGVhaycpXHJcbiAgLCBtZXRob2QgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXHJcbiAgLCBmaW5kICAgICAgPSBtZXRob2QoNSlcclxuICAsIGZpbmRJbmRleCA9IG1ldGhvZCg2KTtcclxuZnVuY3Rpb24gZmluZEZyb3plbihzdG9yZSwga2V5KXtcclxuICByZXR1cm4gZmluZC5jYWxsKHN0b3JlLmFycmF5LCBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcclxuICB9KTtcclxufVxyXG4vLyBmYWxsYmFjayBmb3IgZnJvemVuIGtleXNcclxuZnVuY3Rpb24gbGVha1N0b3JlKHRoYXQpe1xyXG4gIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGUodGhhdCwgTEVBSywge1xyXG4gICAgYXJyYXk6IFtdLFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KXJldHVybiBlbnRyeVsxXTtcclxuICAgIH0sXHJcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHJldHVybiAhIWZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KWVudHJ5WzFdID0gdmFsdWU7XHJcbiAgICAgIGVsc2UgdGhpcy5hcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XHJcbiAgICB9LFxyXG4gICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleC5jYWxsKHRoaXMuYXJyYXksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmKH5pbmRleCl0aGlzLmFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIHJldHVybiAhIX5pbmRleDtcclxuICAgIH1cclxuICB9KVtMRUFLXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKE5BTUUsIElTX01BUCwgQURERVIpe1xyXG4gICAgZnVuY3Rpb24gQyhpdGVyYWJsZSl7XHJcbiAgICAgICQuc2V0KGFzc2VydC5pbnN0KHRoaXMsIEMsIE5BTUUpLCBJRCwgaWQrKyk7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGlzW0FEREVSXSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwge1xyXG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XHJcbiAgICAgICAgcmV0dXJuIF9oYXMoa2V5LCBXRUFLKSAmJiBfaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tJRF1dO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XHJcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcclxuICAgICAgICByZXR1cm4gX2hhcyhrZXksIFdFQUspICYmIF9oYXMoa2V5W1dFQUtdLCB0aGlzW0lEXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgaWYoaXNGcm96ZW4oYXNzZXJ0Lm9iaihrZXkpKSl7XHJcbiAgICAgIGxlYWtTdG9yZSh0aGF0KS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfaGFzKGtleSwgV0VBSykgfHwgaGlkZShrZXksIFdFQUssIHt9KTtcclxuICAgICAga2V5W1dFQUtdW3RoYXRbSURdXSA9IHZhbHVlO1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGxlYWtTdG9yZTogbGVha1N0b3JlLFxyXG4gIFdFQUs6IFdFQUssXHJcbiAgSUQ6IElEXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgYXNzZXJ0SW5zdGFuY2UgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuaW5zdDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIGlzV2Vhayl7XHJcbiAgdmFyIEJhc2UgID0gJC5nW05BTUVdXHJcbiAgICAsIEMgICAgID0gQmFzZVxyXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcclxuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXHJcbiAgICAsIE8gICAgID0ge307XHJcbiAgZnVuY3Rpb24gZml4TWV0aG9kKEtFWSwgQ0hBSU4pe1xyXG4gICAgdmFyIG1ldGhvZCA9IHByb3RvW0tFWV07XHJcbiAgICBpZigkLkZXKXByb3RvW0tFWV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgdmFyIHJlc3VsdCA9IG1ldGhvZC5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7XHJcbiAgICAgIHJldHVybiBDSEFJTiA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gIH1cclxuICBpZighJC5pc0Z1bmN0aW9uKEMpIHx8ICEoaXNXZWFrIHx8ICEkaXRlci5CVUdHWSAmJiBwcm90by5mb3JFYWNoICYmIHByb3RvLmVudHJpZXMpKXtcclxuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXHJcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKE5BTUUsIElTX01BUCwgQURERVIpO1xyXG4gICAgJC5taXgoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgaW5zdCAgPSBuZXcgQ1xyXG4gICAgICAsIGNoYWluID0gaW5zdFtBRERFUl0oaXNXZWFrID8ge30gOiAtMCwgMSlcclxuICAgICAgLCBidWdneVplcm87XHJcbiAgICAvLyB3cmFwIGZvciBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcclxuICAgIGlmKCFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgbmV3IEMoaXRlcik7IH0pKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcclxuICAgICAgQyA9IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICB2YXIgdGhhdCA9IG5ldyBCYXNlO1xyXG4gICAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkkaXRlci5mb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQ7XHJcbiAgICAgIH07XHJcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XHJcbiAgICAgIGlmKCQuRlcpcHJvdG8uY29uc3RydWN0b3IgPSBDO1xyXG4gICAgfVxyXG4gICAgaXNXZWFrIHx8IGluc3QuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSl7XHJcbiAgICAgIGJ1Z2d5WmVybyA9IDEgLyBrZXkgPT09IC1JbmZpbml0eTtcclxuICAgIH0pO1xyXG4gICAgLy8gZml4IGNvbnZlcnRpbmcgLTAga2V5IHRvICswXHJcbiAgICBpZihidWdneVplcm8pe1xyXG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xyXG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xyXG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcclxuICAgIH1cclxuICAgIC8vICsgZml4IC5hZGQgJiAuc2V0IGZvciBjaGFpbmluZ1xyXG4gICAgaWYoYnVnZ3laZXJvIHx8IGNoYWluICE9PSBpbnN0KWZpeE1ldGhvZChBRERFUiwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICByZXF1aXJlKCcuLyQuY29mJykuc2V0KEMsIE5BTUUpO1xyXG4gIHJlcXVpcmUoJy4vJC5zcGVjaWVzJykoQyk7XHJcblxyXG4gIE9bTkFNRV0gPSBDO1xyXG4gICRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GICogKEMgIT0gQmFzZSksIE8pO1xyXG5cclxuICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cclxuICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXHJcbiAgaWYoIWlzV2VhaykkaXRlci5zdGQoXHJcbiAgICBDLCBOQU1FLFxyXG4gICAgY29tbW9uLmdldEl0ZXJDb25zdHJ1Y3RvcigpLCBjb21tb24ubmV4dCxcclxuICAgIElTX01BUCA/ICdrZXkrdmFsdWUnIDogJ3ZhbHVlJyAsICFJU19NQVAsIHRydWVcclxuICApO1xyXG5cclxuICByZXR1cm4gQztcclxufTsiLCIvLyBPcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcclxudmFyIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xyXG4gIGFzc2VydEZ1bmN0aW9uKGZuKTtcclxuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XHJcbiAgc3dpdGNoKGxlbmd0aCl7XHJcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XHJcbiAgICB9O1xyXG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xyXG4gICAgfTtcclxuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcclxuICAgIH07XHJcbiAgfSByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBnbG9iYWwgICAgID0gJC5nXHJcbiAgLCBjb3JlICAgICAgID0gJC5jb3JlXHJcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uO1xyXG5mdW5jdGlvbiBjdHgoZm4sIHRoYXQpe1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgfTtcclxufVxyXG5nbG9iYWwuY29yZSA9IGNvcmU7XHJcbi8vIHR5cGUgYml0bWFwXHJcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcclxuJGRlZi5HID0gMjsgIC8vIGdsb2JhbFxyXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXHJcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xyXG4kZGVmLkIgPSAxNjsgLy8gYmluZFxyXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxyXG5mdW5jdGlvbiAkZGVmKHR5cGUsIG5hbWUsIHNvdXJjZSl7XHJcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxyXG4gICAgLCBpc0dsb2JhbCA9IHR5cGUgJiAkZGVmLkdcclxuICAgICwgdGFyZ2V0ICAgPSBpc0dsb2JhbCA/IGdsb2JhbCA6IHR5cGUgJiAkZGVmLlNcclxuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pLnByb3RvdHlwZVxyXG4gICAgLCBleHBvcnRzICA9IGlzR2xvYmFsID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XHJcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcclxuICBmb3Ioa2V5IGluIHNvdXJjZSl7XHJcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcclxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XHJcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxyXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcclxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XHJcbiAgICBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xyXG4gICAgZWxzZSBleHAgPSB0eXBlICYgJGRlZi5QICYmIGlzRnVuY3Rpb24ob3V0KSA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xyXG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxyXG4gICAgaWYodGFyZ2V0ICYmICFvd24pe1xyXG4gICAgICBpZihpc0dsb2JhbCl0YXJnZXRba2V5XSA9IG91dDtcclxuICAgICAgZWxzZSBkZWxldGUgdGFyZ2V0W2tleV0gJiYgJC5oaWRlKHRhcmdldCwga2V5LCBvdXQpO1xyXG4gICAgfVxyXG4gICAgLy8gZXhwb3J0XHJcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KSQuaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gJGRlZjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCQpe1xyXG4gICQuRlcgICA9IHRydWU7XHJcbiAgJC5wYXRoID0gJC5nO1xyXG4gIHJldHVybiAkO1xyXG59OyIsIi8vIEZhc3QgYXBwbHlcclxuLy8gaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xyXG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcclxuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xyXG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XHJcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XHJcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XHJcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XHJcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XHJcbiAgICBjYXNlIDU6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSk7XHJcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xyXG59OyIsInZhciBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcclxuICAsIFNBRkVfQ0xPU0lORyAgICA9IGZhbHNlO1xyXG50cnkge1xyXG4gIHZhciByaXRlciA9IFs3XVtTWU1CT0xfSVRFUkFUT1JdKCk7XHJcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcclxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcclxufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xyXG4gIGlmKCFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xyXG4gIHZhciBzYWZlID0gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhcnIgID0gWzddXHJcbiAgICAgICwgaXRlciA9IGFycltTWU1CT0xfSVRFUkFUT1JdKCk7XHJcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcclxuICAgIGFycltTWU1CT0xfSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XHJcbiAgICBleGVjKGFycik7XHJcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gIHJldHVybiBzYWZlO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBjb2YgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGFzc2VydE9iamVjdCAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9ialxyXG4gICwgU1lNQk9MX0lURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcclxuICAsIEZGX0lURVJBVE9SICAgICAgID0gJ0BAaXRlcmF0b3InXHJcbiAgLCBJdGVyYXRvcnMgICAgICAgICA9IHt9XHJcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xyXG4vLyBTYWZhcmkgaGFzIGJ5Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXHJcbnZhciBCVUdHWSA9ICdrZXlzJyBpbiBbXSAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpO1xyXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxyXG5zZXRJdGVyYXRvcihJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcclxuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xyXG4gICQuaGlkZShPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcclxuICAvLyBBZGQgaXRlcmF0b3IgZm9yIEZGIGl0ZXJhdG9yIHByb3RvY29sXHJcbiAgaWYoRkZfSVRFUkFUT1IgaW4gW10pJC5oaWRlKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIHZhbHVlLCBERUZBVUxUKXtcclxuICB2YXIgcHJvdG8gPSBDb25zdHJ1Y3Rvci5wcm90b3R5cGVcclxuICAgICwgaXRlciAgPSBwcm90b1tTWU1CT0xfSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdIHx8IHZhbHVlO1xyXG4gIC8vIERlZmluZSBpdGVyYXRvclxyXG4gIGlmKCQuRlcpc2V0SXRlcmF0b3IocHJvdG8sIGl0ZXIpO1xyXG4gIGlmKGl0ZXIgIT09IHZhbHVlKXtcclxuICAgIHZhciBpdGVyUHJvdG8gPSAkLmdldFByb3RvKGl0ZXIuY2FsbChuZXcgQ29uc3RydWN0b3IpKTtcclxuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcclxuICAgIGNvZi5zZXQoaXRlclByb3RvLCBOQU1FICsgJyBJdGVyYXRvcicsIHRydWUpO1xyXG4gICAgLy8gRkYgZml4XHJcbiAgICBpZigkLkZXKSQuaGFzKHByb3RvLCBGRl9JVEVSQVRPUikgJiYgc2V0SXRlcmF0b3IoaXRlclByb3RvLCAkLnRoYXQpO1xyXG4gIH1cclxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XHJcbiAgSXRlcmF0b3JzW05BTUVdID0gaXRlcjtcclxuICAvLyBGRiAmIHY4IGZpeFxyXG4gIEl0ZXJhdG9yc1tOQU1FICsgJyBJdGVyYXRvciddID0gJC50aGF0O1xyXG4gIHJldHVybiBpdGVyO1xyXG59XHJcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yKGl0KXtcclxuICB2YXIgU3ltYm9sICA9ICQuZy5TeW1ib2xcclxuICAgICwgZXh0ICAgICA9IGl0W1N5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1JdXHJcbiAgICAsIGdldEl0ZXIgPSBleHQgfHwgaXRbU1lNQk9MX0lURVJBVE9SXSB8fCBJdGVyYXRvcnNbY29mLmNsYXNzb2YoaXQpXTtcclxuICByZXR1cm4gYXNzZXJ0T2JqZWN0KGdldEl0ZXIuY2FsbChpdCkpO1xyXG59XHJcbmZ1bmN0aW9uIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3Ipe1xyXG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XHJcbiAgaWYocmV0ICE9PSB1bmRlZmluZWQpYXNzZXJ0T2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XHJcbn1cclxuZnVuY3Rpb24gc3RlcENhbGwoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYXNzZXJ0T2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKTtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG59XHJcbnZhciAkaXRlciA9IG1vZHVsZS5leHBvcnRzID0ge1xyXG4gIEJVR0dZOiBCVUdHWSxcclxuICBJdGVyYXRvcnM6IEl0ZXJhdG9ycyxcclxuICBwcm90b3R5cGU6IEl0ZXJhdG9yUHJvdG90eXBlLFxyXG4gIHN0ZXA6IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcclxuICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xyXG4gIH0sXHJcbiAgc3RlcENhbGw6IHN0ZXBDYWxsLFxyXG4gIGNsb3NlOiBjbG9zZUl0ZXJhdG9yLFxyXG4gIGlzOiBmdW5jdGlvbihpdCl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxyXG4gICAgICAsIFN5bWJvbCA9ICQuZy5TeW1ib2xcclxuICAgICAgLCBTWU0gICAgPSBTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SO1xyXG4gICAgcmV0dXJuIFNZTSBpbiBPIHx8IFNZTUJPTF9JVEVSQVRPUiBpbiBPIHx8ICQuaGFzKEl0ZXJhdG9ycywgY29mLmNsYXNzb2YoTykpO1xyXG4gIH0sXHJcbiAgZ2V0OiBnZXRJdGVyYXRvcixcclxuICBzZXQ6IHNldEl0ZXJhdG9yLFxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcclxuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKHByb3RvIHx8ICRpdGVyLnByb3RvdHlwZSwge25leHQ6ICQuZGVzYygxLCBuZXh0KX0pO1xyXG4gICAgY29mLnNldChDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcclxuICB9LFxyXG4gIGRlZmluZTogZGVmaW5lSXRlcmF0b3IsXHJcbiAgc3RkOiBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJdGVyKGtpbmQpe1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgJGl0ZXIuY3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcclxuICAgIHZhciBlbnRyaWVzID0gY3JlYXRlSXRlcigna2V5K3ZhbHVlJylcclxuICAgICAgLCB2YWx1ZXMgID0gY3JlYXRlSXRlcigndmFsdWUnKVxyXG4gICAgICAsIHByb3RvICAgPSBCYXNlLnByb3RvdHlwZVxyXG4gICAgICAsIG1ldGhvZHMsIGtleTtcclxuICAgIGlmKERFRkFVTFQgPT0gJ3ZhbHVlJyl2YWx1ZXMgPSBkZWZpbmVJdGVyYXRvcihCYXNlLCBOQU1FLCB2YWx1ZXMsICd2YWx1ZXMnKTtcclxuICAgIGVsc2UgZW50cmllcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIGVudHJpZXMsICdlbnRyaWVzJyk7XHJcbiAgICBpZihERUZBVUxUKXtcclxuICAgICAgbWV0aG9kcyA9IHtcclxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxyXG4gICAgICAgIGtleXM6ICAgIElTX1NFVCA/IHZhbHVlcyA6IGNyZWF0ZUl0ZXIoJ2tleScpLFxyXG4gICAgICAgIHZhbHVlczogIHZhbHVlc1xyXG4gICAgICB9O1xyXG4gICAgICAkZGVmKCRkZWYuUCArICRkZWYuRiAqIEJVR0dZLCBOQU1FLCBtZXRob2RzKTtcclxuICAgICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcclxuICAgICAgICBpZighKGtleSBpbiBwcm90bykpJC5oaWRlKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGZvck9mOiBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xyXG4gICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpXHJcbiAgICAgICwgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxyXG4gICAgICAsIHN0ZXA7XHJcbiAgICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpe1xyXG4gICAgICBpZihzdGVwQ2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcykgPT09IGZhbHNlKXtcclxuICAgICAgICByZXR1cm4gY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgZ2xvYmFsID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxyXG4gICwgY29yZSAgID0ge31cclxuICAsIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XHJcbiAgLCBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5XHJcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxyXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXHJcbiAgLCBtYXggICA9IE1hdGgubWF4XHJcbiAgLCBtaW4gICA9IE1hdGgubWluO1xyXG4vLyBUaGUgZW5naW5lIHdvcmtzIGZpbmUgd2l0aCBkZXNjcmlwdG9ycz8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eS5cclxudmFyIERFU0MgPSAhIWZ1bmN0aW9uKCl7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMjsgfX0pLmEgPT0gMjtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbn0oKTtcclxudmFyIGhpZGUgPSBjcmVhdGVEZWZpbmVyKDEpO1xyXG4vLyA3LjEuNCBUb0ludGVnZXJcclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcclxuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxufVxyXG5mdW5jdGlvbiBkZXNjKGJpdG1hcCwgdmFsdWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXHJcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXHJcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXHJcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXHJcbiAgfTtcclxufVxyXG5mdW5jdGlvbiBzaW1wbGVTZXQob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xyXG4gIHJldHVybiBvYmplY3Q7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xyXG4gIHJldHVybiBERVNDID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICAgIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGRlc2MoYml0bWFwLCB2YWx1ZSkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXHJcbiAgfSA6IHNpbXBsZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xyXG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcclxufVxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XHJcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuXHJcbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XHJcbiAgZzogZ2xvYmFsLFxyXG4gIGNvcmU6IGNvcmUsXHJcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcclxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XHJcbiAgaXNPYmplY3Q6ICAgaXNPYmplY3QsXHJcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICBpdDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGl0O1xyXG4gIH0sXHJcbiAgdGhhdDogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbiAgdG9JbnRlZ2VyOiB0b0ludGVnZXIsXHJcbiAgLy8gNy4xLjE1IFRvTGVuZ3RoXHJcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXHJcbiAgfSxcclxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcclxuICAgIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcclxuICAgIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xyXG4gIH0sXHJcbiAgaGFzOiBmdW5jdGlvbihpdCwga2V5KXtcclxuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xyXG4gIH0sXHJcbiAgY3JlYXRlOiAgICAgT2JqZWN0LmNyZWF0ZSxcclxuICBnZXRQcm90bzogICBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXHJcbiAgREVTQzogICAgICAgREVTQyxcclxuICBkZXNjOiAgICAgICBkZXNjLFxyXG4gIGdldERlc2M6ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXHJcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXHJcbiAgZ2V0S2V5czogICAgT2JqZWN0LmtleXMsXHJcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXHJcbiAgZ2V0U3ltYm9sczogT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcclxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcclxuICBhc3NlcnREZWZpbmVkOiBhc3NlcnREZWZpbmVkLFxyXG4gIEVTNU9iamVjdDogT2JqZWN0LFxyXG4gIHRvT2JqZWN0OiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xyXG4gIH0sXHJcbiAgaGlkZTogaGlkZSxcclxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXHJcbiAgc2V0OiBnbG9iYWwuU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZSxcclxuICBtaXg6IGZ1bmN0aW9uKHRhcmdldCwgc3JjKXtcclxuICAgIGZvcih2YXIga2V5IGluIHNyYyloaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG4gIH0sXHJcbiAgZWFjaDogW10uZm9yRWFjaFxyXG59KTtcclxuaWYodHlwZW9mIF9fZSAhPSAndW5kZWZpbmVkJylfX2UgPSBjb3JlO1xyXG5pZih0eXBlb2YgX19nICE9ICd1bmRlZmluZWQnKV9fZyA9IGdsb2JhbDsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xyXG4gIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcclxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXHJcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGluZGV4ICA9IDBcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG93bktleXMoaXQpe1xyXG4gIGFzc2VydE9iamVjdChpdCk7XHJcbiAgcmV0dXJuICQuZ2V0U3ltYm9scyA/ICQuZ2V0TmFtZXMoaXQpLmNvbmNhdCgkLmdldFN5bWJvbHMoaXQpKSA6ICQuZ2V0TmFtZXMoaXQpO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcclxuICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAsIGkgICAgICA9IDBcclxuICAgICwgXyAgICAgID0gJC5wYXRoLl9cclxuICAgICwgaG9sZGVyID0gZmFsc2U7XHJcbiAgd2hpbGUobGVuZ3RoID4gaSlpZigocGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXSkgPT09IF8paG9sZGVyID0gdHJ1ZTtcclxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcclxuICAgICAgLCBfbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGogPSAwLCBrID0gMCwgYXJncztcclxuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xyXG4gICAgYXJncyA9IHBhcmdzLnNsaWNlKCk7XHJcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBqOyBqKyspaWYoYXJnc1tqXSA9PT0gXylhcmdzW2pdID0gYXJndW1lbnRzW2srK107XHJcbiAgICB3aGlsZShfbGVuZ3RoID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xyXG4gICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhhdCk7XHJcbiAgfTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVnRXhwLCByZXBsYWNlLCBpc1N0YXRpYyl7XHJcbiAgdmFyIHJlcGxhY2VyID0gcmVwbGFjZSA9PT0gT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XHJcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcclxuICB9IDogcmVwbGFjZTtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIFN0cmluZyhpc1N0YXRpYyA/IGl0IDogdGhpcykucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcclxuICB9O1xyXG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxyXG4vKmVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXHJcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgYXNzZXJ0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpO1xyXG5mdW5jdGlvbiBjaGVjayhPLCBwcm90byl7XHJcbiAgYXNzZXJ0Lm9iaihPKTtcclxuICBhc3NlcnQocHJvdG8gPT09IG51bGwgfHwgJC5pc09iamVjdChwcm90byksIHByb3RvLCBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgID8gZnVuY3Rpb24oYnVnZ3ksIHNldCl7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCAkLmdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XHJcbiAgICAgICAgICBzZXQoe30sIFtdKTtcclxuICAgICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xyXG4gICAgICAgICAgY2hlY2soTywgcHJvdG8pO1xyXG4gICAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcclxuICAgICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcclxuICAgICAgICAgIHJldHVybiBPO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0oKVxyXG4gICAgOiB1bmRlZmluZWQpLFxyXG4gIGNoZWNrOiBjaGVja1xyXG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQyl7XHJcbiAgaWYoJC5ERVNDICYmICQuRlcpJC5zZXREZXNjKEMsIHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6ICQudGhhdFxyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XHJcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHBvcyl7XHJcbiAgICB2YXIgcyA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgaSA9ICQudG9JbnRlZ2VyKHBvcylcclxuICAgICAgLCBsID0gcy5sZW5ndGhcclxuICAgICAgLCBhLCBiO1xyXG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcclxuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXHJcbiAgICAgIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxyXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXHJcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XHJcbiAgfTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIGludm9rZSA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxyXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gJC5nXHJcbiAgLCBpc0Z1bmN0aW9uICAgICAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIGh0bWwgICAgICAgICAgICAgICA9ICQuaHRtbFxyXG4gICwgZG9jdW1lbnQgICAgICAgICAgID0gZ2xvYmFsLmRvY3VtZW50XHJcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xyXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxyXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXHJcbiAgLCBwb3N0TWVzc2FnZSAgICAgICAgPSBnbG9iYWwucG9zdE1lc3NhZ2VcclxuICAsIGFkZEV2ZW50TGlzdGVuZXIgICA9IGdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcclxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcclxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XHJcbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xyXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XHJcbmZ1bmN0aW9uIHJ1bigpe1xyXG4gIHZhciBpZCA9ICt0aGlzO1xyXG4gIGlmKCQuaGFzKHF1ZXVlLCBpZCkpe1xyXG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xyXG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICAgIGZuKCk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGxpc3RuZXIoZXZlbnQpe1xyXG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xyXG59XHJcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcclxuaWYoIWlzRnVuY3Rpb24oc2V0VGFzaykgfHwgIWlzRnVuY3Rpb24oY2xlYXJUYXNrKSl7XHJcbiAgc2V0VGFzayA9IGZ1bmN0aW9uKGZuKXtcclxuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xyXG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xyXG4gICAgICBpbnZva2UoaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XHJcbiAgICB9O1xyXG4gICAgZGVmZXIoY291bnRlcik7XHJcbiAgICByZXR1cm4gY291bnRlcjtcclxuICB9O1xyXG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgfTtcclxuICAvLyBOb2RlLmpzIDAuOC1cclxuICBpZihjb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XHJcbiAgICB9O1xyXG4gIC8vIE1vZGVybiBicm93c2Vycywgc2tpcCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViV29ya2Vyc1xyXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxyXG4gIH0gZWxzZSBpZihhZGRFdmVudExpc3RlbmVyICYmIGlzRnVuY3Rpb24ocG9zdE1lc3NhZ2UpICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgcG9zdE1lc3NhZ2UoaWQsICcqJyk7XHJcbiAgICB9O1xyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcclxuICAvLyBXZWJXb3JrZXJzXHJcbiAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oTWVzc2FnZUNoYW5uZWwpKXtcclxuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XHJcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcclxuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcclxuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xyXG4gIC8vIElFOC1cclxuICB9IGVsc2UgaWYoZG9jdW1lbnQgJiYgT05SRUFEWVNUQVRFQ0hBTkdFIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBodG1sLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcclxuICB9IGVsc2Uge1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHNldDogICBzZXRUYXNrLFxyXG4gIGNsZWFyOiBjbGVhclRhc2tcclxufTsiLCJ2YXIgc2lkID0gMDtcclxuZnVuY3Rpb24gdWlkKGtleSl7XHJcbiAgcmV0dXJuICdTeW1ib2woJyArIGtleSArICcpXycgKyAoKytzaWQgKyBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxudWlkLnNhZmUgPSByZXF1aXJlKCcuLyQnKS5nLlN5bWJvbCB8fCB1aWQ7XHJcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cclxudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi8kLndrcycpKCd1bnNjb3BhYmxlcycpO1xyXG5pZigkLkZXICYmICEoVU5TQ09QQUJMRVMgaW4gW10pKSQuaGlkZShBcnJheS5wcm90b3R5cGUsIFVOU0NPUEFCTEVTLCB7fSk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICBpZigkLkZXKVtdW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcclxufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kJykuZ1xyXG4gICwgc3RvcmUgID0ge307XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XHJcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XHJcbiAgICBnbG9iYWwuU3ltYm9sICYmIGdsb2JhbC5TeW1ib2xbbmFtZV0gfHwgcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ1N5bWJvbC4nICsgbmFtZSkpO1xyXG59OyIsInZhciAkICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGludm9rZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGFycmF5TWV0aG9kICAgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXHJcbiAgLCBJRV9QUk9UTyAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ19fcHJvdG9fXycpXHJcbiAgLCBhc3NlcnQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBhc3NlcnRPYmplY3QgICAgID0gYXNzZXJ0Lm9ialxyXG4gICwgT2JqZWN0UHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGVcclxuICAsIEEgICAgICAgICAgICAgICAgPSBbXVxyXG4gICwgc2xpY2UgICAgICAgICAgICA9IEEuc2xpY2VcclxuICAsIGluZGV4T2YgICAgICAgICAgPSBBLmluZGV4T2ZcclxuICAsIGNsYXNzb2YgICAgICAgICAgPSBjb2YuY2xhc3NvZlxyXG4gICwgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXHJcbiAgLCBoYXMgICAgICAgICAgICAgID0gJC5oYXNcclxuICAsIGRlZmluZVByb3BlcnR5ICAgPSAkLnNldERlc2NcclxuICAsIGdldE93bkRlc2NyaXB0b3IgPSAkLmdldERlc2NcclxuICAsIGlzRnVuY3Rpb24gICAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIHRvT2JqZWN0ICAgICAgICAgPSAkLnRvT2JqZWN0XHJcbiAgLCB0b0xlbmd0aCAgICAgICAgID0gJC50b0xlbmd0aFxyXG4gICwgSUU4X0RPTV9ERUZJTkUgICA9IGZhbHNlO1xyXG5cclxuaWYoISQuREVTQyl7XHJcbiAgdHJ5IHtcclxuICAgIElFOF9ET01fREVGSU5FID0gZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksICd4JyxcclxuICAgICAge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDg7IH19XHJcbiAgICApLnggPT0gODtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgJC5zZXREZXNjID0gZnVuY3Rpb24oTywgUCwgQXR0cmlidXRlcyl7XHJcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XHJcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcclxuICAgIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylhc3NlcnRPYmplY3QoTylbUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfTtcclxuICAkLmdldERlc2MgPSBmdW5jdGlvbihPLCBQKXtcclxuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XHJcbiAgICAgIHJldHVybiBnZXRPd25EZXNjcmlwdG9yKE8sIFApO1xyXG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gICAgaWYoaGFzKE8sIFApKXJldHVybiAkLmRlc2MoIU9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoTywgUCksIE9bUF0pO1xyXG4gIH07XHJcbiAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKE8sIFByb3BlcnRpZXMpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KE8pO1xyXG4gICAgdmFyIGtleXMgICA9ICQuZ2V0S2V5cyhQcm9wZXJ0aWVzKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaSA9IDBcclxuICAgICAgLCBQO1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaSkkLnNldERlc2MoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XHJcbiAgICByZXR1cm4gTztcclxuICB9O1xyXG59XHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISQuREVTQywgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuNiAvIDE1LjIuMy4zIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcclxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICQuZ2V0RGVzYyxcclxuICAvLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxyXG4gIGRlZmluZVByb3BlcnR5OiAkLnNldERlc2MsXHJcbiAgLy8gMTkuMS4yLjMgLyAxNS4yLjMuNyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxyXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXNcclxufSk7XHJcblxyXG4gIC8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcclxudmFyIGtleXMxID0gKCdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLCcgK1xyXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZicpLnNwbGl0KCcsJylcclxuICAvLyBBZGRpdGlvbmFsIGtleXMgZm9yIGdldE93blByb3BlcnR5TmFtZXNcclxuICAsIGtleXMyID0ga2V5czEuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJylcclxuICAsIGtleXNMZW4xID0ga2V5czEubGVuZ3RoO1xyXG5cclxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcclxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xyXG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXHJcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXHJcbiAgICAsIGkgICAgICA9IGtleXNMZW4xXHJcbiAgICAsIGd0ICAgICA9ICc+J1xyXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcclxuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAkLmh0bWwuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXHJcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcclxuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XHJcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XHJcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoJzxzY3JpcHQ+ZG9jdW1lbnQuRj1PYmplY3Q8L3NjcmlwdCcgKyBndCk7XHJcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcclxuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcclxuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3QucHJvdG90eXBlW2tleXMxW2ldXTtcclxuICByZXR1cm4gY3JlYXRlRGljdCgpO1xyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVHZXRLZXlzKG5hbWVzLCBsZW5ndGgpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gW11cclxuICAgICAgLCBrZXk7XHJcbiAgICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXHJcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XHJcbiAgICAgIH5pbmRleE9mLmNhbGwocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn1cclxuZnVuY3Rpb24gaXNQcmltaXRpdmUoaXQpeyByZXR1cm4gISQuaXNPYmplY3QoaXQpOyB9XHJcbmZ1bmN0aW9uIEVtcHR5KCl7fVxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxyXG4gIGdldFByb3RvdHlwZU9mOiAkLmdldFByb3RvID0gJC5nZXRQcm90byB8fCBmdW5jdGlvbihPKXtcclxuICAgIE8gPSBPYmplY3QoYXNzZXJ0LmRlZihPKSk7XHJcbiAgICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcclxuICAgIGlmKGlzRnVuY3Rpb24oTy5jb25zdHJ1Y3RvcikgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xyXG4gICAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICQuZ2V0TmFtZXMgPSAkLmdldE5hbWVzIHx8IGNyZWF0ZUdldEtleXMoa2V5czIsIGtleXMyLmxlbmd0aCwgdHJ1ZSksXHJcbiAgLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXHJcbiAgY3JlYXRlOiAkLmNyZWF0ZSA9ICQuY3JlYXRlIHx8IGZ1bmN0aW9uKE8sIC8qPyovUHJvcGVydGllcyl7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYoTyAhPT0gbnVsbCl7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IGFzc2VydE9iamVjdChPKTtcclxuICAgICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XHJcbiAgICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2Ygc2hpbVxyXG4gICAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcclxuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XHJcbiAgICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXHJcbiAga2V5czogJC5nZXRLZXlzID0gJC5nZXRLZXlzIHx8IGNyZWF0ZUdldEtleXMoa2V5czEsIGtleXNMZW4xLCBmYWxzZSksXHJcbiAgLy8gMTkuMS4yLjE3IC8gMTUuMi4zLjggT2JqZWN0LnNlYWwoTylcclxuICBzZWFsOiAkLml0LCAvLyA8LSBjYXBcclxuICAvLyAxOS4xLjIuNSAvIDE1LjIuMy45IE9iamVjdC5mcmVlemUoTylcclxuICBmcmVlemU6ICQuaXQsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xNSAvIDE1LjIuMy4xMCBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcclxuICBwcmV2ZW50RXh0ZW5zaW9uczogJC5pdCwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEzIC8gMTUuMi4zLjExIE9iamVjdC5pc1NlYWxlZChPKVxyXG4gIGlzU2VhbGVkOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEyIC8gMTUuMi4zLjEyIE9iamVjdC5pc0Zyb3plbihPKVxyXG4gIGlzRnJvemVuOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjExIC8gMTUuMi4zLjEzIE9iamVjdC5pc0V4dGVuc2libGUoTylcclxuICBpc0V4dGVuc2libGU6ICQuaXNPYmplY3QgLy8gPC0gY2FwXHJcbn0pO1xyXG5cclxuLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxyXG4kZGVmKCRkZWYuUCwgJ0Z1bmN0aW9uJywge1xyXG4gIGJpbmQ6IGZ1bmN0aW9uKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xyXG4gICAgdmFyIGZuICAgICAgID0gYXNzZXJ0LmZuKHRoaXMpXHJcbiAgICAgICwgcGFydEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKXtcclxuICAgICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gJC5jcmVhdGUoZm4ucHJvdG90eXBlKSA6IHRoYXQpO1xyXG4gICAgfVxyXG4gICAgaWYoZm4ucHJvdG90eXBlKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcclxuICAgIHJldHVybiBib3VuZDtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gRml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nXHJcbmZ1bmN0aW9uIGFycmF5TWV0aG9kRml4KGZuKXtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmbi5hcHBseSgkLkVTNU9iamVjdCh0aGlzKSwgYXJndW1lbnRzKTtcclxuICB9O1xyXG59XHJcbmlmKCEoMCBpbiBPYmplY3QoJ3onKSAmJiAneidbMF0gPT0gJ3onKSl7XHJcbiAgJC5FUzVPYmplY3QgPSBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICgkLkVTNU9iamVjdCAhPSBPYmplY3QpLCAnQXJyYXknLCB7XHJcbiAgc2xpY2U6IGFycmF5TWV0aG9kRml4KHNsaWNlKSxcclxuICBqb2luOiBhcnJheU1ldGhvZEZpeChBLmpvaW4pXHJcbn0pO1xyXG5cclxuLy8gMjIuMS4yLjIgLyAxNS40LjMuMiBBcnJheS5pc0FycmF5KGFyZylcclxuJGRlZigkZGVmLlMsICdBcnJheScsIHtcclxuICBpc0FycmF5OiBmdW5jdGlvbihhcmcpe1xyXG4gICAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XHJcbiAgfVxyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlSZWR1Y2UoaXNSaWdodCl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4sIG1lbW8pe1xyXG4gICAgYXNzZXJ0LmZuKGNhbGxiYWNrZm4pO1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXHJcbiAgICAgICwgaSAgICAgID0gaXNSaWdodCA/IC0xIDogMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAyKWZvcig7Oyl7XHJcbiAgICAgIGlmKGluZGV4IGluIE8pe1xyXG4gICAgICAgIG1lbW8gPSBPW2luZGV4XTtcclxuICAgICAgICBpbmRleCArPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGluZGV4ICs9IGk7XHJcbiAgICAgIGFzc2VydChpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4LCAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xyXG4gICAgfVxyXG4gICAgZm9yKDtpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKWlmKGluZGV4IGluIE8pe1xyXG4gICAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1lbW87XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGZvckVhY2g6ICQuZWFjaCA9ICQuZWFjaCB8fCBhcnJheU1ldGhvZCgwKSxcclxuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIG1hcDogYXJyYXlNZXRob2QoMSksXHJcbiAgLy8gMjIuMS4zLjcgLyAxNS40LjQuMjAgQXJyYXkucHJvdG90eXBlLmZpbHRlcihjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGZpbHRlcjogYXJyYXlNZXRob2QoMiksXHJcbiAgLy8gMjIuMS4zLjIzIC8gMTUuNC40LjE3IEFycmF5LnByb3RvdHlwZS5zb21lKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgc29tZTogYXJyYXlNZXRob2QoMyksXHJcbiAgLy8gMjIuMS4zLjUgLyAxNS40LjQuMTYgQXJyYXkucHJvdG90eXBlLmV2ZXJ5KGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgZXZlcnk6IGFycmF5TWV0aG9kKDQpLFxyXG4gIC8vIDIyLjEuMy4xOCAvIDE1LjQuNC4yMSBBcnJheS5wcm90b3R5cGUucmVkdWNlKGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcclxuICByZWR1Y2U6IGNyZWF0ZUFycmF5UmVkdWNlKGZhbHNlKSxcclxuICAvLyAyMi4xLjMuMTkgLyAxNS40LjQuMjIgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcclxuICByZWR1Y2VSaWdodDogY3JlYXRlQXJyYXlSZWR1Y2UodHJ1ZSksXHJcbiAgLy8gMjIuMS4zLjExIC8gMTUuNC40LjE0IEFycmF5LnByb3RvdHlwZS5pbmRleE9mKHNlYXJjaEVsZW1lbnQgWywgZnJvbUluZGV4XSlcclxuICBpbmRleE9mOiBpbmRleE9mID0gaW5kZXhPZiB8fCByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKShmYWxzZSksXHJcbiAgLy8gMjIuMS4zLjE0IC8gMTUuNC40LjE1IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXHJcbiAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKGVsLCBmcm9tSW5kZXggLyogPSBAWyotMV0gKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gbGVuZ3RoIC0gMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsICQudG9JbnRlZ2VyKGZyb21JbmRleCkpO1xyXG4gICAgaWYoaW5kZXggPCAwKWluZGV4ID0gdG9MZW5ndGgobGVuZ3RoICsgaW5kZXgpO1xyXG4gICAgZm9yKDtpbmRleCA+PSAwOyBpbmRleC0tKWlmKGluZGV4IGluIE8paWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpbmRleDtcclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gMjEuMS4zLjI1IC8gMTUuNS40LjIwIFN0cmluZy5wcm90b3R5cGUudHJpbSgpXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge3RyaW06IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eXFxzKihbXFxzXFxTXSpcXFMpP1xccyokLywgJyQxJyl9KTtcclxuXHJcbi8vIDIwLjMuMy4xIC8gMTUuOS40LjQgRGF0ZS5ub3coKVxyXG4kZGVmKCRkZWYuUywgJ0RhdGUnLCB7bm93OiBmdW5jdGlvbigpe1xyXG4gIHJldHVybiArbmV3IERhdGU7XHJcbn19KTtcclxuXHJcbmZ1bmN0aW9uIGx6KG51bSl7XHJcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XHJcbn1cclxuLy8gMjAuMy40LjM2IC8gMTUuOS41LjQzIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKClcclxuJGRlZigkZGVmLlAsICdEYXRlJywge3RvSVNPU3RyaW5nOiBmdW5jdGlvbigpe1xyXG4gIGlmKCFpc0Zpbml0ZSh0aGlzKSl0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIHRpbWUgdmFsdWUnKTtcclxuICB2YXIgZCA9IHRoaXNcclxuICAgICwgeSA9IGQuZ2V0VVRDRnVsbFllYXIoKVxyXG4gICAgLCBtID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKVxyXG4gICAgLCBzID0geSA8IDAgPyAnLScgOiB5ID4gOTk5OSA/ICcrJyA6ICcnO1xyXG4gIHJldHVybiBzICsgKCcwMDAwMCcgKyBNYXRoLmFicyh5KSkuc2xpY2UocyA/IC02IDogLTQpICtcclxuICAgICctJyArIGx6KGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgbHooZC5nZXRVVENEYXRlKCkpICtcclxuICAgICdUJyArIGx6KGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBseihkLmdldFVUQ01pbnV0ZXMoKSkgK1xyXG4gICAgJzonICsgbHooZC5nZXRVVENTZWNvbmRzKCkpICsgJy4nICsgKG0gPiA5OSA/IG0gOiAnMCcgKyBseihtKSkgKyAnWic7XHJcbn19KTtcclxuXHJcbmlmKGNsYXNzb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnT2JqZWN0Jyljb2YuY2xhc3NvZiA9IGZ1bmN0aW9uKGl0KXtcclxuICB2YXIgdGFnID0gY2xhc3NvZihpdCk7XHJcbiAgcmV0dXJuIHRhZyA9PSAnT2JqZWN0JyAmJiBpc0Z1bmN0aW9uKGl0LmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHRhZztcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgY29weVdpdGhpbjogZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQvKiA9IDAgKi8sIHN0YXJ0IC8qID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICB2YXIgTyAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGxlbiAgID0gJC50b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCB0byAgICA9IHRvSW5kZXgodGFyZ2V0LCBsZW4pXHJcbiAgICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXHJcbiAgICAgICwgZW5kICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgLCBmaW4gICA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbilcclxuICAgICAgLCBjb3VudCA9IE1hdGgubWluKGZpbiAtIGZyb20sIGxlbiAtIHRvKVxyXG4gICAgICAsIGluYyAgID0gMTtcclxuICAgIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XHJcbiAgICAgIGluYyAgPSAtMTtcclxuICAgICAgZnJvbSA9IGZyb20gKyBjb3VudCAtIDE7XHJcbiAgICAgIHRvICAgPSB0byAgICsgY291bnQgLSAxO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoY291bnQtLSA+IDApe1xyXG4gICAgICBpZihmcm9tIGluIE8pT1t0b10gPSBPW2Zyb21dO1xyXG4gICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcclxuICAgICAgdG8gICArPSBpbmM7XHJcbiAgICAgIGZyb20gKz0gaW5jO1xyXG4gICAgfSByZXR1cm4gTztcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdjb3B5V2l0aGluJyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCB0b0luZGV4ID0gJC50b0luZGV4O1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxyXG4gIGZpbGw6IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXHJcbiAgICAgICwgZW5kICAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcclxuICAgIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcclxuICAgIHJldHVybiBPO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbGwnKTsiLCJ2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjMuOSBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICBmaW5kSW5kZXg6IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNilcclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbmRJbmRleCcpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICBmaW5kOiByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDUpXHJcbn0pO1xyXG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdmaW5kJyk7IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwQ2FsbCA9ICRpdGVyLnN0ZXBDYWxsO1xyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcclxuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XHJcbiAgICB2YXIgTyAgICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQoYXJyYXlMaWtlKSlcclxuICAgICAgLCBtYXBmbiAgID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcclxuICAgICAgLCBmICAgICAgID0gbWFwcGluZyA/IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKSA6IHVuZGVmaW5lZFxyXG4gICAgICAsIGluZGV4ICAgPSAwXHJcbiAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xyXG4gICAgaWYoJGl0ZXIuaXMoTykpe1xyXG4gICAgICBpdGVyYXRvciA9ICRpdGVyLmdldChPKTtcclxuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cclxuICAgICAgcmVzdWx0ICAgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpO1xyXG4gICAgICBmb3IoOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xyXG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gc3RlcENhbGwoaXRlcmF0b3IsIGYsIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cclxuICAgICAgcmVzdWx0ID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KShsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKSk7XHJcbiAgICAgIGZvcig7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcclxuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2V0VW5zY29wZSA9IHJlcXVpcmUoJy4vJC51bnNjb3BlJylcclxuICAsIElURVIgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXHJcbiAgLCAkaXRlciAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgc3RlcCAgICAgICA9ICRpdGVyLnN0ZXBcclxuICAsIEl0ZXJhdG9ycyAgPSAkaXRlci5JdGVyYXRvcnM7XHJcblxyXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXHJcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXHJcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcclxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiRpdGVyLnN0ZChBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiAkLnRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxufSwgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAsIGluZGV4ID0gaXRlci5pKys7XHJcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xyXG4gICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHN0ZXAoMSk7XHJcbiAgfVxyXG4gIGlmKGtpbmQgPT0gJ2tleScgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XHJcbiAgaWYoa2luZCA9PSAndmFsdWUnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcclxuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XHJcbn0sICd2YWx1ZScpO1xyXG5cclxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxyXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xyXG5cclxuc2V0VW5zY29wZSgna2V5cycpO1xyXG5zZXRVbnNjb3BlKCd2YWx1ZXMnKTtcclxuc2V0VW5zY29wZSgnZW50cmllcycpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMi4zIEFycmF5Lm9mKCAuLi5pdGVtcylcclxuICBvZjogZnVuY3Rpb24gb2YoLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgaW5kZXggID0gMFxyXG4gICAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cclxuICAgICAgLCByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xyXG4gICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59KTsiLCJyZXF1aXJlKCcuLyQuc3BlY2llcycpKEFycmF5KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIE5BTUUgPSAnbmFtZSdcclxuICAsIHNldERlc2MgPSAkLnNldERlc2NcclxuICAsIEZ1bmN0aW9uUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XHJcbi8vIDE5LjIuNC4yIG5hbWVcclxuTkFNRSBpbiBGdW5jdGlvblByb3RvIHx8ICQuRlcgJiYgJC5ERVNDICYmIHNldERlc2MoRnVuY3Rpb25Qcm90bywgTkFNRSwge1xyXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICBnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbWF0Y2ggPSBTdHJpbmcodGhpcykubWF0Y2goL15cXHMqZnVuY3Rpb24gKFteIChdKikvKVxyXG4gICAgICAsIG5hbWUgID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xyXG4gICAgJC5oYXModGhpcywgTkFNRSkgfHwgc2V0RGVzYyh0aGlzLCBOQU1FLCAkLmRlc2MoNSwgbmFtZSkpO1xyXG4gICAgcmV0dXJuIG5hbWU7XHJcbiAgfSxcclxuICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICQuaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgJC5kZXNjKDAsIHZhbHVlKSk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcclxuXHJcbi8vIDIzLjEgTWFwIE9iamVjdHNcclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywge1xyXG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xyXG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcclxuICB9LFxyXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG59LCBzdHJvbmcsIHRydWUpOyIsInZhciBJbmZpbml0eSA9IDEgLyAwXHJcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgRSAgICAgPSBNYXRoLkVcclxuICAsIHBvdyAgID0gTWF0aC5wb3dcclxuICAsIGFicyAgID0gTWF0aC5hYnNcclxuICAsIGV4cCAgID0gTWF0aC5leHBcclxuICAsIGxvZyAgID0gTWF0aC5sb2dcclxuICAsIHNxcnQgID0gTWF0aC5zcXJ0XHJcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxyXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXHJcbiAgLCBFUFNJTE9OICAgPSBwb3coMiwgLTUyKVxyXG4gICwgRVBTSUxPTjMyID0gcG93KDIsIC0yMylcclxuICAsIE1BWDMyICAgICA9IHBvdygyLCAxMjcpICogKDIgLSBFUFNJTE9OMzIpXHJcbiAgLCBNSU4zMiAgICAgPSBwb3coMiwgLTEyNik7XHJcbmZ1bmN0aW9uIHJvdW5kVGllc1RvRXZlbihuKXtcclxuICByZXR1cm4gbiArIDEgLyBFUFNJTE9OIC0gMSAvIEVQU0lMT047XHJcbn1cclxuXHJcbi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuZnVuY3Rpb24gc2lnbih4KXtcclxuICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XHJcbn1cclxuLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG5mdW5jdGlvbiBhc2luaCh4KXtcclxuICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IGxvZyh4ICsgc3FydCh4ICogeCArIDEpKTtcclxufVxyXG4vLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG5mdW5jdGlvbiBleHBtMSh4KXtcclxuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcclxufVxyXG5cclxuJGRlZigkZGVmLlMsICdNYXRoJywge1xyXG4gIC8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcclxuICBhY29zaDogZnVuY3Rpb24gYWNvc2goeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuICBhc2luaDogYXNpbmgsXHJcbiAgLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxyXG4gIGF0YW5oOiBmdW5jdGlvbiBhdGFuaCh4KXtcclxuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXHJcbiAgY2JydDogZnVuY3Rpb24gY2JydCh4KXtcclxuICAgIHJldHVybiBzaWduKHggPSAreCkgKiBwb3coYWJzKHgpLCAxIC8gMyk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxyXG4gIGNsejMyOiBmdW5jdGlvbiBjbHozMih4KXtcclxuICAgIHJldHVybiAoeCA+Pj49IDApID8gMzEgLSBmbG9vcihsb2coeCArIDAuNSkgKiBNYXRoLkxPRzJFKSA6IDMyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxyXG4gIGNvc2g6IGZ1bmN0aW9uIGNvc2goeCl7XHJcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuICBleHBtMTogZXhwbTEsXHJcbiAgLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXHJcbiAgZnJvdW5kOiBmdW5jdGlvbiBmcm91bmQoeCl7XHJcbiAgICB2YXIgJGFicyAgPSBhYnMoeClcclxuICAgICAgLCAkc2lnbiA9IHNpZ24oeClcclxuICAgICAgLCBhLCByZXN1bHQ7XHJcbiAgICBpZigkYWJzIDwgTUlOMzIpcmV0dXJuICRzaWduICogcm91bmRUaWVzVG9FdmVuKCRhYnMgLyBNSU4zMiAvIEVQU0lMT04zMikgKiBNSU4zMiAqIEVQU0lMT04zMjtcclxuICAgIGEgPSAoMSArIEVQU0lMT04zMiAvIEVQU0lMT04pICogJGFicztcclxuICAgIHJlc3VsdCA9IGEgLSAoYSAtICRhYnMpO1xyXG4gICAgaWYocmVzdWx0ID4gTUFYMzIgfHwgcmVzdWx0ICE9IHJlc3VsdClyZXR1cm4gJHNpZ24gKiBJbmZpbml0eTtcclxuICAgIHJldHVybiAkc2lnbiAqIHJlc3VsdDtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxyXG4gIGh5cG90OiBmdW5jdGlvbiBoeXBvdCh2YWx1ZTEsIHZhbHVlMil7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICAgIHZhciBzdW0gID0gMFxyXG4gICAgICAsIGxlbjEgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgbGVuMiA9IGxlbjFcclxuICAgICAgLCBhcmdzID0gQXJyYXkobGVuMSlcclxuICAgICAgLCBsYXJnID0gLUluZmluaXR5XHJcbiAgICAgICwgYXJnO1xyXG4gICAgd2hpbGUobGVuMS0tKXtcclxuICAgICAgYXJnID0gYXJnc1tsZW4xXSA9ICthcmd1bWVudHNbbGVuMV07XHJcbiAgICAgIGlmKGFyZyA9PSBJbmZpbml0eSB8fCBhcmcgPT0gLUluZmluaXR5KXJldHVybiBJbmZpbml0eTtcclxuICAgICAgaWYoYXJnID4gbGFyZylsYXJnID0gYXJnO1xyXG4gICAgfVxyXG4gICAgbGFyZyA9IGFyZyB8fCAxO1xyXG4gICAgd2hpbGUobGVuMi0tKXN1bSArPSBwb3coYXJnc1tsZW4yXSAvIGxhcmcsIDIpO1xyXG4gICAgcmV0dXJuIGxhcmcgKiBzcXJ0KHN1bSk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXHJcbiAgaW11bDogZnVuY3Rpb24gaW11bCh4LCB5KXtcclxuICAgIHZhciBVSW50MTYgPSAweGZmZmZcclxuICAgICAgLCB4biA9ICt4XHJcbiAgICAgICwgeW4gPSAreVxyXG4gICAgICAsIHhsID0gVUludDE2ICYgeG5cclxuICAgICAgLCB5bCA9IFVJbnQxNiAmIHluO1xyXG4gICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSW50MTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSW50MTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXHJcbiAgbG9nMXA6IGZ1bmN0aW9uIGxvZzFwKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogbG9nKDEgKyB4KTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXHJcbiAgbG9nMTA6IGZ1bmN0aW9uIGxvZzEwKHgpe1xyXG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4xMDtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcclxuICBsb2cyOiBmdW5jdGlvbiBsb2cyKHgpe1xyXG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4yO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxyXG4gIHNpZ246IHNpZ24sXHJcbiAgLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxyXG4gIHNpbmg6IGZ1bmN0aW9uIHNpbmgoeCl7XHJcbiAgICByZXR1cm4gYWJzKHggPSAreCkgPCAxID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDIgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChFIC8gMik7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXHJcbiAgdGFuaDogZnVuY3Rpb24gdGFuaCh4KXtcclxuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxyXG4gICAgICAsIGIgPSBleHBtMSgteCk7XHJcbiAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcclxuICB0cnVuYzogZnVuY3Rpb24gdHJ1bmMoaXQpe1xyXG4gICAgcmV0dXJuIChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgaXNPYmplY3QgICA9ICQuaXNPYmplY3RcclxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb25cclxuICAsIE5VTUJFUiAgICAgPSAnTnVtYmVyJ1xyXG4gICwgTnVtYmVyICAgICA9ICQuZ1tOVU1CRVJdXHJcbiAgLCBCYXNlICAgICAgID0gTnVtYmVyXHJcbiAgLCBwcm90byAgICAgID0gTnVtYmVyLnByb3RvdHlwZTtcclxuZnVuY3Rpb24gdG9QcmltaXRpdmUoaXQpe1xyXG4gIHZhciBmbiwgdmFsO1xyXG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgaWYoaXNGdW5jdGlvbihmbiA9IGl0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gbnVtYmVyXCIpO1xyXG59XHJcbmZ1bmN0aW9uIHRvTnVtYmVyKGl0KXtcclxuICBpZihpc09iamVjdChpdCkpaXQgPSB0b1ByaW1pdGl2ZShpdCk7XHJcbiAgaWYodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIgJiYgaXQuY2hhckNvZGVBdCgwKSA9PSA0OCl7XHJcbiAgICB2YXIgYmluYXJ5ID0gZmFsc2U7XHJcbiAgICBzd2l0Y2goaXQuY2hhckNvZGVBdCgxKSl7XHJcbiAgICAgIGNhc2UgNjYgOiBjYXNlIDk4ICA6IGJpbmFyeSA9IHRydWU7XHJcbiAgICAgIGNhc2UgNzkgOiBjYXNlIDExMSA6IHJldHVybiBwYXJzZUludChpdC5zbGljZSgyKSwgYmluYXJ5ID8gMiA6IDgpO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuICtpdDtcclxufVxyXG5pZigkLkZXICYmICEoTnVtYmVyKCcwbzEnKSAmJiBOdW1iZXIoJzBiMScpKSl7XHJcbiAgTnVtYmVyID0gZnVuY3Rpb24gTnVtYmVyKGl0KXtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgTnVtYmVyID8gbmV3IEJhc2UodG9OdW1iZXIoaXQpKSA6IHRvTnVtYmVyKGl0KTtcclxuICB9O1xyXG4gICQuZWFjaC5jYWxsKCQuREVTQyA/ICQuZ2V0TmFtZXMoQmFzZSkgOiAoXHJcbiAgICAgIC8vIEVTMzpcclxuICAgICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xyXG4gICAgICAvLyBFUzYgKGluIGNhc2UsIGlmIG1vZHVsZXMgd2l0aCBFUzYgTnVtYmVyIHN0YXRpY3MgcmVxdWlyZWQgYmVmb3JlKTpcclxuICAgICAgJ0VQU0lMT04saXNGaW5pdGUsaXNJbnRlZ2VyLGlzTmFOLGlzU2FmZUludGVnZXIsTUFYX1NBRkVfSU5URUdFUiwnICtcclxuICAgICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXHJcbiAgICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKCQuaGFzKEJhc2UsIGtleSkgJiYgISQuaGFzKE51bWJlciwga2V5KSl7XHJcbiAgICAgICAgJC5zZXREZXNjKE51bWJlciwga2V5LCAkLmdldERlc2MoQmFzZSwga2V5KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIE51bWJlci5wcm90b3R5cGUgPSBwcm90bztcclxuICBwcm90by5jb25zdHJ1Y3RvciA9IE51bWJlcjtcclxuICAkLmhpZGUoJC5nLCBOVU1CRVIsIE51bWJlcik7XHJcbn0iLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGFicyAgID0gTWF0aC5hYnNcclxuICAsIGZsb29yID0gTWF0aC5mbG9vclxyXG4gICwgX2lzRmluaXRlID0gJC5nLmlzRmluaXRlXHJcbiAgLCBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZjsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MTtcclxuZnVuY3Rpb24gaXNJbnRlZ2VyKGl0KXtcclxuICByZXR1cm4gISQuaXNPYmplY3QoaXQpICYmIF9pc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcclxufVxyXG4kZGVmKCRkZWYuUywgJ051bWJlcicsIHtcclxuICAvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxyXG4gIEVQU0lMT046IE1hdGgucG93KDIsIC01MiksXHJcbiAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcclxuICBpc0Zpbml0ZTogZnVuY3Rpb24gaXNGaW5pdGUoaXQpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXHJcbiAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuICBpc05hTjogZnVuY3Rpb24gaXNOYU4obnVtYmVyKXtcclxuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxyXG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKXtcclxuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxyXG4gIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXHJcbiAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcclxuICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXHJcbiAgcGFyc2VJbnQ6IHBhcnNlSW50XHJcbn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vJC5hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICBpczogZnVuY3Rpb24gaXMoeCwgeSl7XHJcbiAgICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxuICB9XHJcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldH0pOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XHJcbiAgLCB0b09iamVjdCA9ICQudG9PYmplY3Q7XHJcbmZ1bmN0aW9uIHdyYXBPYmplY3RNZXRob2QoTUVUSE9ELCBNT0RFKXtcclxuICB2YXIgZm4gID0gKCQuY29yZS5PYmplY3QgfHwge30pW01FVEhPRF0gfHwgT2JqZWN0W01FVEhPRF1cclxuICAgICwgZiAgID0gMFxyXG4gICAgLCBvICAgPSB7fTtcclxuICBvW01FVEhPRF0gPSBNT0RFID09IDEgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XHJcbiAgfSA6IE1PREUgPT0gMiA/IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xyXG4gIH0gOiBNT0RFID09IDMgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XHJcbiAgfSA6IE1PREUgPT0gNCA/IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcclxuICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XHJcbiAgfSA6IE1PREUgPT0gNSA/IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KXtcclxuICAgIHJldHVybiBmbihPYmplY3QoJC5hc3NlcnREZWZpbmVkKGl0KSkpO1xyXG4gIH0gOiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpKTtcclxuICB9O1xyXG4gIHRyeSB7XHJcbiAgICBmbigneicpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICBmID0gMTtcclxuICB9XHJcbiAgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiBmLCAnT2JqZWN0Jywgbyk7XHJcbn1cclxud3JhcE9iamVjdE1ldGhvZCgnZnJlZXplJywgMSk7XHJcbndyYXBPYmplY3RNZXRob2QoJ3NlYWwnLCAxKTtcclxud3JhcE9iamVjdE1ldGhvZCgncHJldmVudEV4dGVuc2lvbnMnLCAxKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNGcm96ZW4nLCAyKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNTZWFsZWQnLCAyKTtcclxud3JhcE9iamVjdE1ldGhvZCgnaXNFeHRlbnNpYmxlJywgMyk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIDQpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdnZXRQcm90b3R5cGVPZicsIDUpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdrZXlzJyk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2dldE93blByb3BlcnR5TmFtZXMnKTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxyXG52YXIgJCAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgdG1wID0ge307XHJcbnRtcFtyZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xyXG5pZigkLkZXICYmIGNvZih0bXApICE9ICd6JykkLmhpZGUoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcclxuICByZXR1cm4gJ1tvYmplY3QgJyArIGNvZi5jbGFzc29mKHRoaXMpICsgJ10nO1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcclxuICAsIGNvZiAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGFzc2VydCAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcclxuICAsICRpdGVyICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBTUEVDSUVTID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJylcclxuICAsIFJFQ09SRCAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgncmVjb3JkJylcclxuICAsIGZvck9mICAgPSAkaXRlci5mb3JPZlxyXG4gICwgUFJPTUlTRSA9ICdQcm9taXNlJ1xyXG4gICwgZ2xvYmFsICA9ICQuZ1xyXG4gICwgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzXHJcbiAgLCBhc2FwICAgID0gcHJvY2VzcyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IHJlcXVpcmUoJy4vJC50YXNrJykuc2V0XHJcbiAgLCBQICAgICAgID0gZ2xvYmFsW1BST01JU0VdXHJcbiAgLCBCYXNlICAgID0gUFxyXG4gICwgaXNGdW5jdGlvbiAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIGlzT2JqZWN0ICAgICAgID0gJC5pc09iamVjdFxyXG4gICwgYXNzZXJ0RnVuY3Rpb24gPSBhc3NlcnQuZm5cclxuICAsIGFzc2VydE9iamVjdCAgID0gYXNzZXJ0Lm9ialxyXG4gICwgdGVzdDtcclxuXHJcbi8vIGhlbHBlcnNcclxuZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3IoQyl7XHJcbiAgdmFyIFMgPSBhc3NlcnRPYmplY3QoQylbU1BFQ0lFU107XHJcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XHJcbn1cclxuZnVuY3Rpb24gaXNUaGVuYWJsZShpdCl7XHJcbiAgdmFyIHRoZW47XHJcbiAgaWYoaXNPYmplY3QoaXQpKXRoZW4gPSBpdC50aGVuO1xyXG4gIHJldHVybiBpc0Z1bmN0aW9uKHRoZW4pID8gdGhlbiA6IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIGlzVW5oYW5kbGVkKHByb21pc2Upe1xyXG4gIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cclxuICAgICwgY2hhaW4gID0gcmVjb3JkLmNcclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCByZWFjdDtcclxuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XHJcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XHJcbiAgICByZWFjdCA9IGNoYWluW2krK107XHJcbiAgICBpZihyZWFjdC5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdC5QKSlyZXR1cm4gZmFsc2U7XHJcbiAgfSByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBub3RpZnkocmVjb3JkLCBpc1JlamVjdCl7XHJcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XHJcbiAgaWYoaXNSZWplY3QgfHwgY2hhaW4ubGVuZ3RoKWFzYXAoZnVuY3Rpb24oKXtcclxuICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcclxuICAgICAgLCB2YWx1ZSAgID0gcmVjb3JkLnZcclxuICAgICAgLCBvayAgICAgID0gcmVjb3JkLnMgPT0gMVxyXG4gICAgICAsIGkgICAgICAgPSAwO1xyXG4gICAgaWYoaXNSZWplY3QgJiYgaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xyXG4gICAgICAgICAgaWYoY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmKGdsb2JhbC5jb25zb2xlICYmIGlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxZTMpO1xyXG4gICAgfSBlbHNlIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpIWZ1bmN0aW9uKHJlYWN0KXtcclxuICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcclxuICAgICAgICAsIHJldCwgdGhlbjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZihjYil7XHJcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xyXG4gICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcclxuICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XHJcbiAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoUFJPTUlTRSArICctY2hhaW4gY3ljbGUnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XHJcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcclxuICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcclxuICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlYWN0LnJlaihlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9KGNoYWluW2krK10pO1xyXG4gICAgY2hhaW4ubGVuZ3RoID0gMDtcclxuICB9KTtcclxufVxyXG5mdW5jdGlvbiAkcmVqZWN0KHZhbHVlKXtcclxuICB2YXIgcmVjb3JkID0gdGhpcztcclxuICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgcmVjb3JkLmQgPSB0cnVlO1xyXG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICByZWNvcmQucyA9IDI7XHJcbiAgbm90aWZ5KHJlY29yZCwgdHJ1ZSk7XHJcbn1cclxuZnVuY3Rpb24gJHJlc29sdmUodmFsdWUpe1xyXG4gIHZhciByZWNvcmQgPSB0aGlzXHJcbiAgICAsIHRoZW4sIHdyYXBwZXI7XHJcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gIHJlY29yZC5kID0gdHJ1ZTtcclxuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxyXG4gIHRyeSB7XHJcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xyXG4gICAgICB3cmFwcGVyID0ge3I6IHJlY29yZCwgZDogZmFsc2V9OyAvLyB3cmFwXHJcbiAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgIHJlY29yZC5zID0gMTtcclxuICAgICAgbm90aWZ5KHJlY29yZCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaChlcnIpe1xyXG4gICAgJHJlamVjdC5jYWxsKHdyYXBwZXIgfHwge3I6IHJlY29yZCwgZDogZmFsc2V9LCBlcnIpOyAvLyB3cmFwXHJcbiAgfVxyXG59XHJcblxyXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxyXG5pZighKGlzRnVuY3Rpb24oUCkgJiYgaXNGdW5jdGlvbihQLnJlc29sdmUpICYmIFAucmVzb2x2ZSh0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KSkgPT0gdGVzdCkpe1xyXG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXHJcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xyXG4gICAgYXNzZXJ0RnVuY3Rpb24oZXhlY3V0b3IpO1xyXG4gICAgdmFyIHJlY29yZCA9IHtcclxuICAgICAgcDogYXNzZXJ0Lmluc3QodGhpcywgUCwgUFJPTUlTRSksICAgICAgIC8vIDwtIHByb21pc2VcclxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoYWluXHJcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxyXG4gICAgICBkOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gZG9uZVxyXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgaDogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXHJcbiAgICB9O1xyXG4gICAgJC5oaWRlKHRoaXMsIFJFQ09SRCwgcmVjb3JkKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xyXG4gICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAkcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgJC5taXgoUC5wcm90b3R5cGUsIHtcclxuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXHJcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcclxuICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoYXNzZXJ0T2JqZWN0KHRoaXMpLmNvbnN0cnVjdG9yKVtTUEVDSUVTXTtcclxuICAgICAgdmFyIHJlYWN0ID0ge1xyXG4gICAgICAgIG9rOiAgIGlzRnVuY3Rpb24ob25GdWxmaWxsZWQpID8gb25GdWxmaWxsZWQgOiB0cnVlLFxyXG4gICAgICAgIGZhaWw6IGlzRnVuY3Rpb24ob25SZWplY3RlZCkgID8gb25SZWplY3RlZCAgOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICB2YXIgcHJvbWlzZSA9IHJlYWN0LlAgPSBuZXcgKFMgIT0gdW5kZWZpbmVkID8gUyA6IFApKGZ1bmN0aW9uKHJlcywgcmVqKXtcclxuICAgICAgICByZWFjdC5yZXMgPSBhc3NlcnRGdW5jdGlvbihyZXMpO1xyXG4gICAgICAgIHJlYWN0LnJlaiA9IGFzc2VydEZ1bmN0aW9uKHJlaik7XHJcbiAgICAgIH0pO1xyXG4gICAgICB2YXIgcmVjb3JkID0gdGhpc1tSRUNPUkRdO1xyXG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0KTtcclxuICAgICAgcmVjb3JkLnMgJiYgbm90aWZ5KHJlY29yZCk7XHJcbiAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfSxcclxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXHJcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcclxuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBleHBvcnRcclxuJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAoUCAhPSBCYXNlKSwge1Byb21pc2U6IFB9KTtcclxuY29mLnNldChQLCBQUk9NSVNFKTtcclxucmVxdWlyZSgnLi8kLnNwZWNpZXMnKShQKTtcclxuXHJcbi8vIHN0YXRpY3NcclxuJGRlZigkZGVmLlMsIFBST01JU0UsIHtcclxuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxyXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xyXG4gICAgcmV0dXJuIG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlcywgcmVqKXtcclxuICAgICAgcmVqKHIpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcclxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHgpICYmIFJFQ09SRCBpbiB4ICYmICQuZ2V0UHJvdG8oeCkgPT09IHRoaXMucHJvdG90eXBlXHJcbiAgICAgID8geCA6IG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgcmVzKHgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcclxuICBQLmFsbChpdGVyKVsnY2F0Y2gnXShmdW5jdGlvbigpe30pO1xyXG59KSwgUFJPTUlTRSwge1xyXG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxyXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcclxuICAgIHZhciBDICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxyXG4gICAgICAsIHZhbHVlcyA9IFtdO1xyXG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcclxuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCB2YWx1ZXMucHVzaCwgdmFsdWVzKTtcclxuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcclxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XHJcbiAgICAgIGlmKHJlbWFpbmluZykkLmVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcclxuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzKHJlc3VsdHMpO1xyXG4gICAgICAgIH0sIHJlaik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBlbHNlIHJlcyhyZXN1bHRzKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxyXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xyXG4gICAgdmFyIEMgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XHJcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzLCByZWopO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7IiwidmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHNldFByb3RvICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKVxyXG4gICwgJGl0ZXIgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgSVRFUiAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgc3RlcCAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XHJcbiAgLCBnZXREZXNjICAgPSAkLmdldERlc2NcclxuICAsIHNldERlc2MgICA9ICQuc2V0RGVzY1xyXG4gICwgZ2V0UHJvdG8gID0gJC5nZXRQcm90b1xyXG4gICwgYXBwbHkgICAgID0gRnVuY3Rpb24uYXBwbHlcclxuICAsIGFzc2VydE9iamVjdCAgPSBhc3NlcnQub2JqXHJcbiAgLCBfaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCAkLml0O1xyXG5mdW5jdGlvbiBFbnVtZXJhdGUoaXRlcmF0ZWQpe1xyXG4gIHZhciBrZXlzID0gW10sIGtleTtcclxuICBmb3Ioa2V5IGluIGl0ZXJhdGVkKWtleXMucHVzaChrZXkpO1xyXG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgYToga2V5cywgaTogMH0pO1xyXG59XHJcbiRpdGVyLmNyZWF0ZShFbnVtZXJhdGUsICdPYmplY3QnLCBmdW5jdGlvbigpe1xyXG4gIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAsIGtleTtcclxuICBkbyB7XHJcbiAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpcmV0dXJuIHN0ZXAoMSk7XHJcbiAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XHJcbiAgcmV0dXJuIHN0ZXAoMCwga2V5KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiB3cmFwKGZuKXtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoKGUpe1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cclxuICAgICwgZGVzYyA9IGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XHJcbiAgaWYoZGVzYylyZXR1cm4gJC5oYXMoZGVzYywgJ3ZhbHVlJylcclxuICAgID8gZGVzYy52YWx1ZVxyXG4gICAgOiBkZXNjLmdldCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XHJcbiAgcmV0dXJuIGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSlcclxuICAgID8gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpXHJcbiAgICA6IHVuZGVmaW5lZDtcclxufVxyXG5mdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcclxuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxyXG4gICAgLCBvd25EZXNjICA9IGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxyXG4gICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xyXG4gIGlmKCFvd25EZXNjKXtcclxuICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSkpe1xyXG4gICAgICByZXR1cm4gc2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xyXG4gICAgfVxyXG4gICAgb3duRGVzYyA9ICQuZGVzYygwKTtcclxuICB9XHJcbiAgaWYoJC5oYXMob3duRGVzYywgJ3ZhbHVlJykpe1xyXG4gICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XHJcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgJC5kZXNjKDApO1xyXG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcclxuICAgIHNldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xyXG59XHJcblxyXG52YXIgcmVmbGVjdCA9IHtcclxuICAvLyAyNi4xLjEgUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdClcclxuICBhcHBseTogcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsIGFwcGx5LCAzKSxcclxuICAvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXHJcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XHJcbiAgICB2YXIgcHJvdG8gICAgPSBhc3NlcnQuZm4oYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl0pLnByb3RvdHlwZVxyXG4gICAgICAsIGluc3RhbmNlID0gJC5jcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3QucHJvdG90eXBlKVxyXG4gICAgICAsIHJlc3VsdCAgID0gYXBwbHkuY2FsbCh0YXJnZXQsIGluc3RhbmNlLCBhcmd1bWVudHNMaXN0KTtcclxuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XHJcbiAgfSxcclxuICAvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxyXG4gIGRlZmluZVByb3BlcnR5OiB3cmFwKHNldERlc2MpLFxyXG4gIC8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgdmFyIGRlc2MgPSBnZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS41IFJlZmxlY3QuZW51bWVyYXRlKHRhcmdldClcclxuICBlbnVtZXJhdGU6IGZ1bmN0aW9uIGVudW1lcmF0ZSh0YXJnZXQpe1xyXG4gICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxyXG4gIGdldDogZ2V0LFxyXG4gIC8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgcmV0dXJuIGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICB9LFxyXG4gIC8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcclxuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KXtcclxuICAgIHJldHVybiBnZXRQcm90byhhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgfSxcclxuICAvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICBoYXM6IGZ1bmN0aW9uIGhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XHJcbiAgfSxcclxuICAvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcclxuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZSh0YXJnZXQpe1xyXG4gICAgcmV0dXJuICEhX2lzRXh0ZW5zaWJsZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgfSxcclxuICAvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXHJcbiAgb3duS2V5czogcmVxdWlyZSgnLi8kLm93bi1rZXlzJyksXHJcbiAgLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcclxuICBwcmV2ZW50RXh0ZW5zaW9uczogd3JhcChPYmplY3QucHJldmVudEV4dGVuc2lvbnMgfHwgJC5pdCksXHJcbiAgLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcclxuICBzZXQ6IHNldFxyXG59O1xyXG4vLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcclxuaWYoc2V0UHJvdG8pcmVmbGVjdC5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pe1xyXG4gIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xyXG4gIHRyeSB7XHJcbiAgICBzZXRQcm90by5zZXQodGFyZ2V0LCBwcm90byk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbiRkZWYoJGRlZi5HLCB7UmVmbGVjdDoge319KTtcclxuJGRlZigkZGVmLlMsICdSZWZsZWN0JywgcmVmbGVjdCk7IiwidmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIFJlZ0V4cCA9ICQuZy5SZWdFeHBcclxuICAsIEJhc2UgICA9IFJlZ0V4cFxyXG4gICwgcHJvdG8gID0gUmVnRXhwLnByb3RvdHlwZTtcclxuaWYoJC5GVyAmJiAkLkRFU0Mpe1xyXG4gIC8vIFJlZ0V4cCBhbGxvd3MgYSByZWdleCB3aXRoIGZsYWdzIGFzIHRoZSBwYXR0ZXJuXHJcbiAgaWYoIWZ1bmN0aW9uKCl7dHJ5eyByZXR1cm4gUmVnRXhwKC9hL2csICdpJykgPT0gJy9hL2knOyB9Y2F0Y2goZSl7IC8qIGVtcHR5ICovIH19KCkpe1xyXG4gICAgUmVnRXhwID0gZnVuY3Rpb24gUmVnRXhwKHBhdHRlcm4sIGZsYWdzKXtcclxuICAgICAgcmV0dXJuIG5ldyBCYXNlKGNvZihwYXR0ZXJuKSA9PSAnUmVnRXhwJyAmJiBmbGFncyAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyBwYXR0ZXJuLnNvdXJjZSA6IHBhdHRlcm4sIGZsYWdzKTtcclxuICAgIH07XHJcbiAgICAkLmVhY2guY2FsbCgkLmdldE5hbWVzKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBrZXkgaW4gUmVnRXhwIHx8ICQuc2V0RGVzYyhSZWdFeHAsIGtleSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBCYXNlW2tleV07IH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbihpdCl7IEJhc2Vba2V5XSA9IGl0OyB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBwcm90by5jb25zdHJ1Y3RvciA9IFJlZ0V4cDtcclxuICAgIFJlZ0V4cC5wcm90b3R5cGUgPSBwcm90bztcclxuICAgICQuaGlkZSgkLmcsICdSZWdFeHAnLCBSZWdFeHApO1xyXG4gIH1cclxuICAvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXHJcbiAgaWYoLy4vZy5mbGFncyAhPSAnZycpJC5zZXREZXNjKHByb3RvLCAnZmxhZ3MnLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eLipcXC8oXFx3KikkLywgJyQxJylcclxuICB9KTtcclxufVxyXG5yZXF1aXJlKCcuLyQuc3BlY2llcycpKFJlZ0V4cCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XHJcblxyXG4vLyAyMy4yIFNldCBPYmplY3RzXHJcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1NldCcsIHtcclxuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XHJcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XHJcbiAgfVxyXG59LCBzdHJvbmcpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMyBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KHBvcylcclxuICBjb2RlUG9pbnRBdDogcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKGZhbHNlKVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvTGVuZ3RoID0gJC50b0xlbmd0aDtcclxuXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcclxuICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xyXG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgICB2YXIgdGhhdCA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgZW5kUG9zaXRpb24gPSBhcmd1bWVudHNbMV1cclxuICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcclxuICAgICAgLCBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogTWF0aC5taW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xyXG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoU3RyaW5nLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoU3RyaW5nO1xyXG4gIH1cclxufSk7IiwidmFyICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSByZXF1aXJlKCcuLyQnKS50b0luZGV4XHJcbiAgLCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xyXG5cclxuJGRlZigkZGVmLlMsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcclxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgICB2YXIgcmVzID0gW11cclxuICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgaSAgID0gMFxyXG4gICAgICAsIGNvZGU7XHJcbiAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcclxuICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XHJcbiAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXHJcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcclxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXHJcbiAgICAgICk7XHJcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxyXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICAgIHJldHVybiAhIX5TdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKS5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKTtcclxuICB9XHJcbn0pOyIsInZhciBzZXQgICA9IHJlcXVpcmUoJy4vJCcpLnNldFxyXG4gICwgYXQgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSlcclxuICAsIElURVIgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwICA9ICRpdGVyLnN0ZXA7XHJcblxyXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiRpdGVyLnN0ZChTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XHJcbiAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxufSwgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAsIGluZGV4ID0gaXRlci5pXHJcbiAgICAsIHBvaW50O1xyXG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xyXG4gIHBvaW50ID0gYXQuY2FsbChPLCBpbmRleCk7XHJcbiAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcclxuICByZXR1cm4gc3RlcCgwLCBwb2ludCk7XHJcbn0pOyIsInZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUywgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxyXG4gIHJhdzogZnVuY3Rpb24gcmF3KGNhbGxTaXRlKXtcclxuICAgIHZhciB0cGwgPSAkLnRvT2JqZWN0KGNhbGxTaXRlLnJhdylcclxuICAgICAgLCBsZW4gPSAkLnRvTGVuZ3RoKHRwbC5sZW5ndGgpXHJcbiAgICAgICwgc2xuID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIHJlcyA9IFtdXHJcbiAgICAgICwgaSAgID0gMDtcclxuICAgIHdoaWxlKGxlbiA+IGkpe1xyXG4gICAgICByZXMucHVzaChTdHJpbmcodHBsW2krK10pKTtcclxuICAgICAgaWYoaSA8IHNsbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XHJcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXHJcbiAgcmVwZWF0OiBmdW5jdGlvbiByZXBlYXQoY291bnQpe1xyXG4gICAgdmFyIHN0ciA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgcmVzID0gJydcclxuICAgICAgLCBuICAgPSAkLnRvSW50ZWdlcihjb3VudCk7XHJcbiAgICBpZihuIDwgMCB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcclxuICAgIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG5cclxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcclxuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xyXG4gICAgdmFyIHRoYXQgID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBpbmRleCA9ICQudG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xyXG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2V0VGFnICAgPSByZXF1aXJlKCcuLyQuY29mJykuc2V0XHJcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxyXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcclxuICAsIGhhcyAgICAgID0gJC5oYXNcclxuICAsIGhpZGUgICAgID0gJC5oaWRlXHJcbiAgLCBnZXROYW1lcyA9ICQuZ2V0TmFtZXNcclxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxyXG4gICwgU3ltYm9sICAgPSAkLmcuU3ltYm9sXHJcbiAgLCBCYXNlICAgICA9IFN5bWJvbFxyXG4gICwgc2V0dGVyICAgPSBmYWxzZVxyXG4gICwgVEFHICAgICAgPSB1aWQuc2FmZSgndGFnJylcclxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0ge31cclxuICAsIEFsbFN5bWJvbHMgICAgID0ge307XHJcblxyXG5mdW5jdGlvbiB3cmFwKHRhZyl7XHJcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCQuY3JlYXRlKFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XHJcbiAgJC5ERVNDICYmIHNldHRlciAmJiAkLnNldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgdGFnLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgaGlkZSh0aGlzLCB0YWcsIHZhbHVlKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gc3ltO1xyXG59XHJcblxyXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcclxuaWYoISQuaXNGdW5jdGlvbihTeW1ib2wpKXtcclxuICBTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pe1xyXG4gICAgaWYodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgcmV0dXJuIHdyYXAodWlkKGRlc2NyaXB0aW9uKSk7XHJcbiAgfTtcclxuICBoaWRlKFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpc1tUQUddO1xyXG4gIH0pO1xyXG59XHJcbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiBTeW1ib2x9KTtcclxuXHJcbnZhciBzeW1ib2xTdGF0aWNzID0ge1xyXG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxyXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxyXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cclxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gU3ltYm9sKGtleSk7XHJcbiAgfSxcclxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcclxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xyXG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xyXG4gIH0sXHJcbiAgcHVyZTogdWlkLnNhZmUsXHJcbiAgc2V0OiAkLnNldCxcclxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXHJcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxyXG59O1xyXG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2VcclxuLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxyXG4vLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3JcclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXHJcbi8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXHJcbi8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcclxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXHJcbi8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcclxuLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxyXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXHJcbi8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcclxuJC5lYWNoLmNhbGwoKFxyXG4gICAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCwnICtcclxuICAgICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xyXG4gICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xyXG4gICAgdmFyIHN5bSA9IHJlcXVpcmUoJy4vJC53a3MnKShpdCk7XHJcbiAgICBzeW1ib2xTdGF0aWNzW2l0XSA9IFN5bWJvbCA9PT0gQmFzZSA/IHN5bSA6IHdyYXAoc3ltKTtcclxuICB9XHJcbik7XHJcblxyXG5zZXR0ZXIgPSB0cnVlO1xyXG5cclxuJGRlZigkZGVmLlMsICdTeW1ib2wnLCBzeW1ib2xTdGF0aWNzKTtcclxuXHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKFN5bWJvbCAhPSBCYXNlKSwgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xyXG4gICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcclxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XHJcbiAgICB2YXIgbmFtZXMgPSBnZXROYW1lcyh0b09iamVjdChpdCkpLCByZXN1bHQgPSBbXSwga2V5LCBpID0gMDtcclxuICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7XHJcblxyXG5zZXRUYWcoU3ltYm9sLCAnU3ltYm9sJyk7XHJcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cclxuc2V0VGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XHJcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXHJcbnNldFRhZygkLmcuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgd2VhayAgICAgID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpXHJcbiAgLCBsZWFrU3RvcmUgPSB3ZWFrLmxlYWtTdG9yZVxyXG4gICwgSUQgICAgICAgID0gd2Vhay5JRFxyXG4gICwgV0VBSyAgICAgID0gd2Vhay5XRUFLXHJcbiAgLCBoYXMgICAgICAgPSAkLmhhc1xyXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxyXG4gICwgaXNGcm96ZW4gID0gT2JqZWN0LmlzRnJvemVuIHx8ICQuY29yZS5PYmplY3QuaXNGcm96ZW5cclxuICAsIHRtcCAgICAgICA9IHt9O1xyXG5cclxuLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcclxudmFyIFdlYWtNYXAgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdXZWFrTWFwJywge1xyXG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcclxuICAgIGlmKGlzT2JqZWN0KGtleSkpe1xyXG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuZ2V0KGtleSk7XHJcbiAgICAgIGlmKGhhcyhrZXksIFdFQUspKXJldHVybiBrZXlbV0VBS11bdGhpc1tJRF1dO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG59LCB3ZWFrLCB0cnVlLCB0cnVlKTtcclxuXHJcbi8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcclxuaWYoJC5GVyAmJiBuZXcgV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDcpe1xyXG4gICQuZWFjaC5jYWxsKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uKGtleSl7XHJcbiAgICB2YXIgbWV0aG9kID0gV2Vha01hcC5wcm90b3R5cGVba2V5XTtcclxuICAgIFdlYWtNYXAucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gbGVha3kgbWFwXHJcbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmIGlzRnJvemVuKGEpKXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbGVha1N0b3JlKHRoaXMpW2tleV0oYSwgYik7XHJcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxyXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcclxuICAgIH07XHJcbiAgfSk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpO1xyXG5cclxuLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha1NldCcsIHtcclxuICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xyXG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIHZhbHVlLCB0cnVlKTtcclxuICB9XHJcbn0sIHdlYWssIGZhbHNlLCB0cnVlKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vZG9tZW5pYy9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcclxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgaW5jbHVkZXM6IHJlcXVpcmUoJy4vJC5hcnJheS1pbmNsdWRlcycpKHRydWUpXHJcbn0pO1xyXG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdpbmNsdWRlcycpOyIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vOTM1Mzc4MVxyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBvd25LZXlzID0gcmVxdWlyZSgnLi8kLm93bi1rZXlzJyk7XHJcblxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCl7XHJcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXHJcbiAgICAgICwgcmVzdWx0ID0ge307XHJcbiAgICAkLmVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAkLnNldERlc2MocmVzdWx0LCBrZXksICQuZGVzYygwLCAkLmdldERlc2MoTywga2V5KSkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcclxuICAgICAgLCBrZXk7XHJcbiAgICBpZihpc0VudHJpZXMpd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBba2V5ID0ga2V5c1tpKytdLCBPW2tleV1dO1xyXG4gICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICB2YWx1ZXM6ICBjcmVhdGVPYmplY3RUb0FycmF5KGZhbHNlKSxcclxuICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXHJcbn0pOyIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2thbmdheC85Njk4MTAwXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ1JlZ0V4cCcsIHtcclxuICBlc2NhcGU6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC8oW1xcXFxcXC1bXFxde30oKSorPy4sXiR8XSkvZywgJ1xcXFwkMScsIHRydWUpXHJcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cclxudmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBmb3JPZiA9IHJlcXVpcmUoJy4vJC5pdGVyJykuZm9yT2Y7XHJcbiRkZWYoJGRlZi5QLCAnU2V0Jywge1xyXG4gIHRvSlNPTjogZnVuY3Rpb24oKXtcclxuICAgIHZhciBhcnIgPSBbXTtcclxuICAgIGZvck9mKHRoaXMsIGZhbHNlLCBhcnIucHVzaCwgYXJyKTtcclxuICAgIHJldHVybiBhcnI7XHJcbiAgfVxyXG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICBhdDogcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpXHJcbn0pOyIsIi8vIEphdmFTY3JpcHQgMS42IC8gU3RyYXdtYW4gYXJyYXkgc3RhdGljcyBzaGltXHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRBcnJheSAgPSAkLmNvcmUuQXJyYXkgfHwgQXJyYXlcclxuICAsIHN0YXRpY3MgPSB7fTtcclxuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xyXG4gICQuZWFjaC5jYWxsKGtleXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmKGxlbmd0aCA9PSB1bmRlZmluZWQgJiYga2V5IGluICRBcnJheSlzdGF0aWNzW2tleV0gPSAkQXJyYXlba2V5XTtcclxuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xyXG4gIH0pO1xyXG59XHJcbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcclxuc2V0U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xyXG5zZXRTdGF0aWNzKCdqb2luLHNsaWNlLGNvbmNhdCxwdXNoLHNwbGljZSx1bnNoaWZ0LHNvcnQsbGFzdEluZGV4T2YsJyArXHJcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xyXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywgc3RhdGljcyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcclxudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcclxuICAsIElURVJBVE9SICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXHJcbiAgLCBBcnJheVZhbHVlcyA9IEl0ZXJhdG9ycy5BcnJheVxyXG4gICwgTm9kZUxpc3QgICAgPSAkLmcuTm9kZUxpc3Q7XHJcbmlmKCQuRlcgJiYgTm9kZUxpc3QgJiYgIShJVEVSQVRPUiBpbiBOb2RlTGlzdC5wcm90b3R5cGUpKXtcclxuICAkLmhpZGUoTm9kZUxpc3QucHJvdG90eXBlLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xyXG59XHJcbkl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEFycmF5VmFsdWVzOyIsInZhciAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJHRhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpO1xyXG4kZGVmKCRkZWYuRyArICRkZWYuQiwge1xyXG4gIHNldEltbWVkaWF0ZTogICAkdGFzay5zZXQsXHJcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXHJcbn0pOyIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGludm9rZSAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxyXG4gICwgcGFydGlhbCAgID0gcmVxdWlyZSgnLi8kLnBhcnRpYWwnKVxyXG4gICwgbmF2aWdhdG9yID0gJC5nLm5hdmlnYXRvclxyXG4gICwgTVNJRSAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xyXG5mdW5jdGlvbiB3cmFwKHNldCl7XHJcbiAgcmV0dXJuIE1TSUUgPyBmdW5jdGlvbihmbiwgdGltZSAvKiwgLi4uYXJncyAqLyl7XHJcbiAgICByZXR1cm4gc2V0KGludm9rZShcclxuICAgICAgcGFydGlhbCxcclxuICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxyXG4gICAgICAkLmlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbilcclxuICAgICksIHRpbWUpO1xyXG4gIH0gOiBzZXQ7XHJcbn1cclxuJGRlZigkZGVmLkcgKyAkZGVmLkIgKyAkZGVmLkYgKiBNU0lFLCB7XHJcbiAgc2V0VGltZW91dDogIHdyYXAoJC5nLnNldFRpbWVvdXQpLFxyXG4gIHNldEludGVydmFsOiB3cmFwKCQuZy5zZXRJbnRlcnZhbClcclxufSk7IiwicmVxdWlyZSgnLi9tb2R1bGVzL2VzNScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuaXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3InKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJhdycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkub2YnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbGwnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnByb21pc2UnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXAnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LndlYWstc2V0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi50aW1lcnMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5pbW1lZGlhdGUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL21vZHVsZXMvJCcpLmNvcmU7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgaXRlcmF0b3JTeW1ib2wgPVxuICAgIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZSgob3V0ZXJGbiB8fCBHZW5lcmF0b3IpLnByb3RvdHlwZSk7XG5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoXG4gICAgICBpbm5lckZuLCBzZWxmIHx8IG51bGwsXG4gICAgICBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSBHZW5lcmF0b3IucHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbmVyYXRvciA9IHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpO1xuICAgICAgdmFyIGNhbGxOZXh0ID0gc3RlcC5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgICAgdmFyIGNhbGxUaHJvdyA9IHN0ZXAuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG5cbiAgICAgIGZ1bmN0aW9uIHN0ZXAobWV0aG9kLCBhcmcpIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUoaW5mby52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGluZm8udmFsdWUpLnRoZW4oY2FsbE5leHQsIGNhbGxUaHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbE5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fFxuICAgICAgICAgICAgICAobWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgLy8gQSByZXR1cm4gb3IgdGhyb3cgKHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyB0aHJvd1xuICAgICAgICAgICAgLy8gbWV0aG9kKSBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgICAgdmFyIHJldHVybk1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdO1xuICAgICAgICAgICAgaWYgKHJldHVybk1ldGhvZCkge1xuICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gocmV0dXJuTWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmV0dXJuIG1ldGhvZCB0aHJldyBhbiBleGNlcHRpb24sIGxldCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gZXhjZXB0aW9uIHByZXZhaWwgb3ZlciB0aGUgb3JpZ2luYWwgcmV0dXJuIG9yIHRocm93LlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgb3V0ZXIgcmV0dXJuLCBub3cgdGhhdCB0aGUgZGVsZWdhdGVcbiAgICAgICAgICAgICAgLy8gaXRlcmF0b3IgaGFzIGJlZW4gdGVybWluYXRlZC5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKFxuICAgICAgICAgICAgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSxcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yLFxuICAgICAgICAgICAgYXJnXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LnNlbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVHZW5lcmF0b3JNZXRob2QobWV0aG9kKSB7XG4gICAgR3BbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgfTtcbiAgfVxuICBkZWZpbmVHZW5lcmF0b3JNZXRob2QoXCJuZXh0XCIpO1xuICBkZWZpbmVHZW5lcmF0b3JNZXRob2QoXCJ0aHJvd1wiKTtcbiAgZGVmaW5lR2VuZXJhdG9yTWV0aG9kKFwicmV0dXJuXCIpO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICB0aGlzLnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgLy8gUHJlLWluaXRpYWxpemUgYXQgbGVhc3QgMjAgdGVtcG9yYXJ5IHZhcmlhYmxlcyB0byBlbmFibGUgaGlkZGVuXG4gICAgICAvLyBjbGFzcyBvcHRpbWl6YXRpb25zIGZvciBzaW1wbGUgZ2VuZXJhdG9ycy5cbiAgICAgIGZvciAodmFyIHRlbXBJbmRleCA9IDAsIHRlbXBOYW1lO1xuICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCB0ZW1wTmFtZSA9IFwidFwiICsgdGVtcEluZGV4KSB8fCB0ZW1wSW5kZXggPCAyMDtcbiAgICAgICAgICAgKyt0ZW1wSW5kZXgpIHtcbiAgICAgICAgdGhpc1t0ZW1wTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG4gICAgICAgIHJldHVybiAhIWNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4gIC8vIG9iamVjdCwgdGhpcyBzZWVtcyB0byBiZSB0aGUgbW9zdCByZWxpYWJsZSB0ZWNobmlxdWUgdGhhdCBkb2VzIG5vdFxuICAvLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxuICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6XG4gIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6IHRoaXNcbik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9iYWJlbC9wb2x5ZmlsbFwiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLWNvcmUvcG9seWZpbGxcIik7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L25vZGUtZ3cyXHJcbiogICBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSTpNYWluXHJcbipcclxuXHJcbiovXHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgREVGSU5FIEVYUE9SVFxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXRNYXRjaGVzOiBnZXRNYXRjaGVzLFxyXG5cdGdldE1hdGNoZXNTdGF0ZTogZ2V0TWF0Y2hlc1N0YXRlLFxyXG5cdGdldE9iamVjdGl2ZU5hbWVzOiBnZXRPYmplY3RpdmVOYW1lcyxcclxuXHRnZXRNYXRjaERldGFpbHM6IGdldE1hdGNoRGV0YWlscyxcclxuXHRnZXRNYXRjaERldGFpbHNTdGF0ZTogZ2V0TWF0Y2hEZXRhaWxzU3RhdGUsXHJcblxyXG5cdGdldEl0ZW1zOiBnZXRJdGVtcyxcclxuXHRnZXRJdGVtRGV0YWlsczogZ2V0SXRlbURldGFpbHMsXHJcblx0Z2V0UmVjaXBlczogZ2V0UmVjaXBlcyxcclxuXHRnZXRSZWNpcGVEZXRhaWxzOiBnZXRSZWNpcGVEZXRhaWxzLFxyXG5cclxuXHRnZXRXb3JsZE5hbWVzOiBnZXRXb3JsZE5hbWVzLFxyXG5cdGdldEd1aWxkRGV0YWlsczogZ2V0R3VpbGREZXRhaWxzLFxyXG5cclxuXHRnZXRNYXBOYW1lczogZ2V0TWFwTmFtZXMsXHJcblx0Z2V0Q29udGluZW50czogZ2V0Q29udGluZW50cyxcclxuXHRnZXRNYXBzOiBnZXRNYXBzLFxyXG5cdGdldE1hcEZsb29yOiBnZXRNYXBGbG9vcixcclxuXHJcblx0Z2V0QnVpbGQ6IGdldEJ1aWxkLFxyXG5cdGdldENvbG9yczogZ2V0Q29sb3JzLFxyXG5cclxuXHRnZXRGaWxlczogZ2V0RmlsZXMsXHJcblx0Z2V0RmlsZTogZ2V0RmlsZSxcclxuXHRnZXRGaWxlUmVuZGVyVXJsOiBnZXRGaWxlUmVuZGVyVXJsLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFJJVkFURSBQUk9QRVJUSUVTXHJcbipcclxuKi9cclxuXHJcbnZhciBlbmRQb2ludHMgPSB7XHJcblx0d29ybGROYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YyL3dvcmxkcycsXHRcdFx0XHRcdFx0XHQvLyBodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHM/cGFnZT0wXHJcblx0Y29sb3JzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvY29sb3JzLmpzb24nLFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvY29sb3JzXHJcblx0Z3VpbGREZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2d1aWxkX2RldGFpbHNcclxuXHJcblx0aXRlbXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9pdGVtcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbXNcclxuXHRpdGVtRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tdjEvaXRlbV9kZXRhaWxzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtX2RldGFpbHNcclxuXHRyZWNpcGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlcy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZXNcclxuXHRyZWNpcGVEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVfZGV0YWlsc1xyXG5cclxuXHRtYXBOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9uYW1lcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfbmFtZXNcclxuXHRjb250aW5lbnRzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvY29udGluZW50cy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvY29udGluZW50c1xyXG5cdG1hcHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBzLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBzXHJcblx0bWFwRmxvb3I6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfZmxvb3IuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX2Zsb29yXHJcblxyXG5cdG9iamVjdGl2ZU5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L29iamVjdGl2ZV9uYW1lcy5qc29uJyxcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoZXNcclxuXHRtYXRjaGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoX2RldGFpbHNcclxuXHRtYXRjaERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hfZGV0YWlscy5qc29uJyxcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvb2JqZWN0aXZlX25hbWVzXHJcblxyXG5cdG1hdGNoZXNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tL21hdGNoZXMnLFxyXG5cdG1hdGNoRGV0YWlsc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vJyxcclxufTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFVCTElDIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRXT1JMRCB2cyBXT1JMRFxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ29iamVjdGl2ZU5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ21hdGNoZXMnLCB7fSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHR2YXIgd3Z3X21hdGNoZXMgPSAoZGF0YSAmJiBkYXRhLnd2d19tYXRjaGVzKSA/IGRhdGEud3Z3X21hdGNoZXMgOiBbXTtcclxuXHRcdGNhbGxiYWNrKGVyciwgd3Z3X21hdGNoZXMpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHR0aHJvdyAoJ21hdGNoX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWF0Y2hEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzLm1hdGNoZXNTdGF0ZTtcclxuXHJcblx0aWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAoJycgKyBwYXJhbXMubWF0Y2hfaWQpO1xyXG5cdH1cclxuXHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWQgfHwgd29ybGRfc2x1Z1xyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHMubWF0Y2hEZXRhaWxzU3RhdGU7XHJcblxyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkICYmICFwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgbWF0Y2hfaWQgb3Igd29ybGRfc2x1ZyBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gcGFyYW1zLm1hdGNoX2lkO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnd29ybGQvJyArIHBhcmFtcy53b3JsZF9zbHVnO1xyXG5cdH1cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRHRU5FUkFMXHJcbiovXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmcsIGlkc1xyXG5mdW5jdGlvbiBnZXRXb3JsZE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdGlmICghcGFyYW1zLmlkcykge1xyXG5cdFx0cGFyYW1zLnBhZ2UgPSAwO1xyXG5cdH1cclxuXHRlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5pZHMpKSB7XHJcblx0XHRwYXJhbXMuaWRzID0gcGFyYW1zLmlkcy5qb2luKCcsJyk7XHJcblx0fVxyXG5cdGdldCgnd29ybGROYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBndWlsZF9pZCB8fCBndWlsZF9uYW1lIChpZCB0YWtlcyBwcmlvcml0eSlcclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5ndWlsZF9pZCAmJiAhcGFyYW1zLmd1aWxkX25hbWUpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIGd1aWxkX2lkIG9yIGd1aWxkX25hbWUgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblxyXG5cdGdldCgnZ3VpbGREZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0SVRFTVNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRJdGVtcyhjYWxsYmFjaykge1xyXG5cdGdldCgnaXRlbXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGl0ZW1faWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0SXRlbURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLml0ZW1faWQpIHtcclxuXHRcdHRocm93ICgnaXRlbV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ2l0ZW1EZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0UmVjaXBlcyhjYWxsYmFjaykge1xyXG5cdGdldCgncmVjaXBlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIFJFUVVJUkVEOiByZWNpcGVfaWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0UmVjaXBlRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMucmVjaXBlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ3JlY2lwZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ3JlY2lwZURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNQVAgSU5GT1JNQVRJT05cclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0Q29udGluZW50cyhjYWxsYmFjaykge1xyXG5cdGdldCgnY29udGluZW50cycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWFwX2lkLCBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBjb250aW5lbnRfaWQsIGZsb29yXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcEZsb29yKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5jb250aW5lbnRfaWQpIHtcclxuXHRcdHRocm93ICgnY29udGluZW50X2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmxvb3IpIHtcclxuXHRcdHRocm93ICgnZmxvb3IgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXBGbG9vcicsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TWlzY2VsbGFuZW91c1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEJ1aWxkKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdidWlsZCcsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRDb2xvcnMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ2NvbG9ycycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbi8vIHRvIGdldCBmaWxlczogaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS97c2lnbmF0dXJlfS97ZmlsZV9pZH0ue2Zvcm1hdH1cclxuZnVuY3Rpb24gZ2V0RmlsZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2ZpbGVzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBVVElMSVRZIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuXHJcbi8vIFNQRUNJQUwgQ0FTRVxyXG4vLyBSRVFVSVJFRDogc2lnbmF0dXJlLCBmaWxlX2lkLCBmb3JtYXRcclxuZnVuY3Rpb24gZ2V0RmlsZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuc2lnbmF0dXJlKSB7XHJcblx0XHR0aHJvdyAoJ3NpZ25hdHVyZSBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZpbGVfaWQpIHtcclxuXHRcdHRocm93ICgnZmlsZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZvcm1hdCkge1xyXG5cdFx0dGhyb3cgKCdmb3JtYXQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblxyXG5cclxuXHRyZXF1ZXN0XHJcblx0XHQuZ2V0KGdldEZpbGVSZW5kZXJVcmwocGFyYW1zKSlcclxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHRcdGNhbGxiYWNrKGVyciwgcGFyc2VKc29uKGRhdGEudGV4dCkpO1xyXG5cdFx0fSk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogc2lnbmF0dXJlLCBmaWxlX2lkLCBmb3JtYXRcclxuZnVuY3Rpb24gZ2V0RmlsZVJlbmRlclVybChwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuc2lnbmF0dXJlKSB7XHJcblx0XHR0aHJvdyAoJ3NpZ25hdHVyZSBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZpbGVfaWQpIHtcclxuXHRcdHRocm93ICgnZmlsZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZvcm1hdCkge1xyXG5cdFx0dGhyb3cgKCdmb3JtYXQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblxyXG5cdHZhciByZW5kZXJVcmwgPSAoXHJcblx0XHQnaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8nXHJcblx0XHQrIHBhcmFtcy5zaWduYXR1cmVcclxuXHRcdCsgJy8nXHJcblx0XHQrIHBhcmFtcy5maWxlX2lkXHJcblx0XHQrICcuJ1xyXG5cdFx0KyBwYXJhbXMuZm9ybWF0XHJcblx0KTtcclxuXHRyZXR1cm4gcmVuZGVyVXJsO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFJJVkFURSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldChrZXksIHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcblxyXG5cdHZhciBhcGlVcmwgPSBnZXRBcGlVcmwoa2V5LCBwYXJhbXMpO1xyXG5cclxuXHRyZXF1ZXN0XHJcblx0XHQuZ2V0KGFwaVVybClcclxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHRcdGNhbGxiYWNrKGVyciwgcGFyc2VKc29uKGRhdGEudGV4dCkpO1xyXG5cdFx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QXBpVXJsKHJlcXVlc3RVcmwsIHBhcmFtcykge1xyXG5cdHZhciBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XHJcblxyXG5cdHJlcXVlc3RVcmwgPSAoZW5kUG9pbnRzW3JlcXVlc3RVcmxdKVxyXG5cdFx0PyBlbmRQb2ludHNbcmVxdWVzdFVybF1cclxuXHRcdDogcmVxdWVzdFVybDtcclxuXHJcblx0dmFyIHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KHBhcmFtcyk7XHJcblxyXG5cdGlmIChxdWVyeS5sZW5ndGgpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gJz8nICsgcXVlcnk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVxdWVzdFVybDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSnNvbihkYXRhKSB7XHJcblx0dmFyIHJlc3VsdHM7XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXN1bHRzID0gSlNPTi5wYXJzZShkYXRhKTtcclxuXHR9XHJcblx0Y2F0Y2ggKGUpIHt9XHJcblxyXG5cdHJldHVybiByZXN1bHRzO1xyXG59XHJcblxyXG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgncmVkdWNlJyk7XG5cbi8qKlxuICogUm9vdCByZWZlcmVuY2UgZm9yIGlmcmFtZXMuXG4gKi9cblxudmFyIHJvb3QgPSAndW5kZWZpbmVkJyA9PSB0eXBlb2Ygd2luZG93XG4gID8gdGhpc1xuICA6IHdpbmRvdztcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gZnVuY3Rpb24gKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICYmICgnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2wgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzIHx8IDEyMjMgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcblxuICAgIHNlbGYuY2FsbGJhY2soZXJyIHx8IG5ld19lcnIsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcyl7XG4gIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQoZmllbGQsIGZpbGUsIGZpbGVuYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgLCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIHF1ZXJ5c3RyaW5nXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbXVsdGlwbGUgZGF0YSBcIndyaXRlc1wiXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5zZW5kKHsgc2VhcmNoOiAncXVlcnknIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgcmFuZ2U6ICcxLi41JyB9KVxuICogICAgICAgICAuc2VuZCh7IG9yZGVyOiAnZGVzYycgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAgKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IGlzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ09yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB0cnkge1xuICAgIGlmICh4aHIudXBsb2FkICYmIHRoaXMuaGFzTGlzdGVuZXJzKCdwcm9ncmVzcycpKSB7XG4gICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wZXJjZW50ID0gZS5sb2FkZWQgLyBlLnRvdGFsICogMTAwO1xuICAgICAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplW3RoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKV07XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG4gIHhoci5zZW5kKGRhdGEpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZGVsID0gZnVuY3Rpb24odXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogXCIxXCIsIFwiZW5cIjogXCJPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmVcIiwgXCJlc1wiOiBcIk1pcmFkb3JcIiwgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiBcIjJcIiwgXCJlblwiOiBcIlZhbGxleVwiLCBcImZyXCI6IFwiVmFsbMOpZVwiLCBcImVzXCI6IFwiVmFsbGVcIiwgXCJkZVwiOiBcIlRhbFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogXCIzXCIsIFwiZW5cIjogXCJMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlc1wiLCBcImVzXCI6IFwiVmVnYVwiLCBcImRlXCI6IFwiVGllZmxhbmRcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IFwiNFwiLCBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLCBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCIsIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiBcIjVcIiwgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIiwgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIiwgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLCBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogXCI2XCIsIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIiwgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsIFwiZGVcIjogXCJTcGVsZGFuIEthaGxzY2hsYWdcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IFwiN1wiLCBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIiwgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IFwiOFwiLCBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLCBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIiwgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIiwgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IFwiOVwiLCBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLCBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIiwgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLCBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogXCIxMFwiLCBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIiwgXCJmclwiOiBcIkNhcnJpw6hyZSBkZXMgdm9sZXVyc1wiLCBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLCBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IFwiMTFcIiwgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIiwgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIiwgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIiwgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiBcIjEyXCIsIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsIFwiZnJcIjogXCJQaXN0ZSBkdSBSdWlzc2VhdSBzYXV2YWdlXCIsIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsIFwiZGVcIjogXCJXaWxkYmFjaHN0cmVja2VcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiBcIjEzXCIsIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLCBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIiwgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIiwgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiBcIjE0XCIsIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIiwgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiLCBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiBcIjE1XCIsIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiLCBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsIFwiZGVcIjogXCJMYW5nb3IgLSBTY2hsdWNodFwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IFwiMTZcIiwgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLCBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIiwgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLCBcImRlXCI6IFwiUXVlbnRpbnNlZVwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IFwiMTdcIiwgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLCBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiLCBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogXCIxOFwiLCBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLCBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIiwgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIiwgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiBcIjE5XCIsIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCIsIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIiwgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IFwiMjBcIiwgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCIsIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IFwiMjFcIiwgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIiwgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IFwiMjJcIiwgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLCBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCIsIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IFwiMjNcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogXCIyNFwiLCBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lbnNlXCIsIFwiZnJcIjogXCJGaWVmIGR1IGNoYW1waW9uXCIsIFwiZXNcIjogXCJEb21pbmlvIGRlbCBDYW1wZcOzblwiLCBcImRlXCI6IFwiTGFuZGd1dCBkZXMgQ2hhbXBpb25zXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogXCIyNVwiLCBcImVuXCI6IFwiUmVkYnJpYXJcIiwgXCJmclwiOiBcIkJydXllcm91Z2VcIiwgXCJlc1wiOiBcIlphcnphcnJvamFcIiwgXCJkZVwiOiBcIlJvdGRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogXCIyNlwiLCBcImVuXCI6IFwiR3JlZW5sYWtlXCIsIFwiZnJcIjogXCJMYWMgVmVydFwiLCBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnNlZVwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IFwiMjdcIiwgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIiwgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsIFwiZGVcIjogXCJCdWNodCBkZXMgQXVmc3RpZWdzXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogXCIyOFwiLCBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsIFwiZnJcIjogXCJQcm9tb250b2lyZSBkZSBsJ2F1YmVcIiwgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZGFtbWVydW5nXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogXCIyOVwiLCBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsIFwiZnJcIjogXCJMJ2FudHJlIGRlcyBlc3ByaXRzXCIsIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLCBcImRlXCI6IFwiRGVyIEdlaXN0ZXJob2xtXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogXCIzMFwiLCBcImVuXCI6IFwiV29vZGhhdmVuXCIsIFwiZnJcIjogXCJHZW50ZXN5bHZlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsIFwiZGVcIjogXCJXYWxkIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogXCIzMVwiLCBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIiwgXCJkZVwiOiBcIkFza2FsaW9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogXCIzMlwiLCBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIiwgXCJkZVwiOiBcIkV0aGVyb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiBcIjMzXCIsIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiLCBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogXCIzNFwiLCBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IHZhaW5xdWV1clwiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsIFwiZGVcIjogXCJTaWVnZXIgLSBIw7x0dGVcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiBcIjM1XCIsIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsIFwiZnJcIjogXCJWZXJ0ZWJyYW5jaGVcIiwgXCJlc1wiOiBcIlphcnphdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IFwiMzZcIiwgXCJlblwiOiBcIkJsdWVsYWtlXCIsIFwiZnJcIjogXCJMYWMgYmxldVwiLCBcImVzXCI6IFwiTGFnb2F6dWxcIiwgXCJkZVwiOiBcIkJsYXVzZWVcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiBcIjM3XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IFwiMzhcIiwgXCJlblwiOiBcIkxvbmd2aWV3XCIsIFwiZnJcIjogXCJMb25ndWV2dWVcIiwgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsIFwiZGVcIjogXCJXZWl0c2ljaHRcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiBcIjM5XCIsIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIiwgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCIsIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLCBcImRlXCI6IFwiRGFzIEdvdHRzY2h3ZXJ0XCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogXCI0MFwiLCBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCIsIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIiwgXCJkZVwiOiBcIkZlbHN3YW5kXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogXCI0MVwiLCBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGRlIFNoYWRhcmFuXCIsIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsIFwiZGVcIjogXCJTaGFkYXJhbiBIw7xnZWxcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiBcIjQyXCIsIFwiZW5cIjogXCJSZWRsYWtlXCIsIFwiZnJcIjogXCJSb3VnZWxhY1wiLCBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsIFwiZGVcIjogXCJSb3RzZWVcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiBcIjQzXCIsIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLCBcImRlXCI6IFwiSMO8dHRlIGRlcyBIZWxkZW5cIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiBcIjQ0XCIsIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiLCBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLCBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwgLSBCdWNodFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IFwiNDVcIiwgXCJlblwiOiBcIkJsdWVicmlhclwiLCBcImZyXCI6IFwiQnJ1eWF6dXJcIiwgXCJlc1wiOiBcIlphcnphenVsXCIsIFwiZGVcIjogXCJCbGF1ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiBcIjQ2XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IFwiNDdcIiwgXCJlblwiOiBcIlN1bm55aGlsbFwiLCBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIiwgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsIFwiZGVcIjogXCJTb25uZW5saWNodGjDvGdlbFwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IFwiNDhcIiwgXCJlblwiOiBcIkZhaXRobGVhcFwiLCBcImZyXCI6IFwiRmVydmV1clwiLCBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIiwgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogXCI0OVwiLCBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgYmxldXZhbFwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IFwiNTBcIiwgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IFwiNTFcIiwgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZnJcIjogXCJBc3RyYWxob2xtZVwiLCBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLCBcImRlXCI6IFwiQXN0cmFsaG9sbVwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IFwiNTJcIiwgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCIsIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLCBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiBcIjUzXCIsIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiLCBcImVzXCI6IFwiUmVmdWdpbyBkZSBWYWxsZXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogXCI1NFwiLCBcImVuXCI6IFwiRm9naGF2ZW5cIiwgXCJmclwiOiBcIkhhdnJlIGdyaXNcIiwgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsIFwiZGVcIjogXCJOZWJlbCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IFwiNTVcIiwgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsIFwiZGVcIjogXCJSb3R3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IFwiNTZcIiwgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLCBcImZyXCI6IFwiQnJhcyBkdSB0aXRhblwiLCBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLCBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiBcIjU3XCIsIFwiZW5cIjogXCJDcmFndG9wXCIsIFwiZnJcIjogXCJTb21tZXQgZGUgbCdlc2NhcnBlbWVudFwiLCBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIiwgXCJkZVwiOiBcIkZlbHNlbnNwaXR6ZVwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IFwiNThcIiwgXCJlblwiOiBcIkdvZHNsb3JlXCIsIFwiZnJcIjogXCJEaXZpbmF0aW9uXCIsIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIiwgXCJkZVwiOiBcIkfDtnR0ZXJrdW5kZVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IFwiNTlcIiwgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVyb2pvXCIsIFwiZGVcIjogXCJSb3R0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IFwiNjBcIiwgXCJlblwiOiBcIlN0YXJncm92ZVwiLCBcImZyXCI6IFwiQm9zcXVldCBzdGVsbGFpcmVcIiwgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIiwgXCJkZVwiOiBcIlN0ZXJuZW5oYWluXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogXCI2MVwiLCBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG53YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IFwiNjJcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiBcIjYzXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogXCI2NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IFwiNjVcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogXCI2NlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IFwiNjdcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiBcIjY4XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IFwiNjlcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiBcIjcwXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogXCI3MVwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IFwiNzJcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiBcIjczXCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IFwiNzRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiBcIjc1XCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogXCI3NlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0XCJrZXlcIjogXCJDZW50ZXJcIixcclxuXHRcdFwibmFtZVwiOiBcIkV0ZXJuYWwgQmF0dGxlZ3JvdW5kc1wiLFxyXG5cdFx0XCJhYmJyXCI6IFwiRUJHXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcImNvbG9yXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJDYXN0bGVcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzldLCBcdFx0XHRcdFx0XHRcdFx0Ly8gc21cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJSZWQgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzEsIDE3LCAyMCwgMTgsIDE5LCA2LCA1XSxcdFx0Ly8gb3Zlcmxvb2ssIG1lbmRvbnMsIHZlbG9rYSwgYW56LCBvZ3JlLCBzcGVsZGFuLCBwYW5nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQmx1ZSBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIsIDE1LCAyMiwgMTYsIDIxLCA3LCA4XVx0XHRcdC8vIHZhbGxleSwgbGFuZ29yLCBicmF2b3N0LCBxdWVudGluLCBkdXJpb3MsIGRhbmUsIHVtYmVyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiR3JlZW4gQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMywgMTEsIDEzLCAxMiwgMTQsIDEwLCA0XSBcdFx0Ly8gbG93bGFuZHMsIGFsZG9ucywgamVycmlmZXIsIHdpbGRjcmVlaywga2xvdmFuLCByb2d1ZXMsIGdvbGFudGFcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiUmVkXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcImNvbG9yXCI6IFwicmVkXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzgsIDQwLCAzOSwgNTIsIDUxXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM1LCAzNiwgMzQsIDUzLCA1MF0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs2MiwgNjMsIDY0LCA2NSwgNjZdIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiQmx1XCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDIsXHJcblx0XHRcImNvbG9yXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjMsIDI3LCAzMV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMwLCAyOCwgMjksIDU4LCA2MF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjUsIDI2LCAyNCwgNTksIDYxXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBjaGFtcCwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzcxLCA3MCwgNjksIDY4LCA2N10gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkdyblwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJjb2xvclwiOiBcImdyZWVuXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDYsIDQ0LCA0MV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NywgNTcsIDU2LCA0OCwgNTRdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ1LCA0MiwgNDMsIDQ5LCA1NV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3NiAsIDc1ICwgNzQgLCA3MyAsIDcyIF0gXHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF1cclxuXHR9LFxyXG5dO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQvL1x0RUJHXHJcblx0XCI5XCI6XHR7XCJ0eXBlXCI6IDEsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDAsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFN0b25lbWlzdCBDYXN0bGVcclxuXHJcblx0Ly9cdFJlZCBDb3JuZXJcclxuXHRcIjFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gUmVkIEtlZXAgLSBPdmVybG9va1xyXG5cdFwiMTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gTWVuZG9uJ3MgR2FwXHJcblx0XCIyMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBWZWxva2EgU2xvcGVcclxuXHRcIjE4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIEFuemFsaWFzIFBhc3NcclxuXHRcIjE5XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIE9ncmV3YXRjaCBDdXRcclxuXHRcIjZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIENhbXAgLSBNaWxsIC0gU3BlbGRhblxyXG5cdFwiNVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgQ2FtcCAtIE1pbmUgLSBQYW5nbG9zc1xyXG5cclxuXHQvL1x0Qmx1ZSBDb3JuZXJcclxuXHRcIjJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBLZWVwIC0gVmFsbGV5XHJcblx0XCIxNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gTGFuZ29yIEd1bGNoXHJcblx0XCIyMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gQnJhdm9zdCBFc2NhcnBtZW50XHJcblx0XCIxNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gUXVlbnRpbiBMYWtlXHJcblx0XCIyMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gRHVyaW9zIEd1bGNoXHJcblx0XCI3XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbmUgLSBEYW5lbG9uXHJcblx0XCI4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbGwgLSBVbWJlcmdsYWRlXHJcblxyXG5cdC8vXHRHcmVlbiBDb3JuZXJcclxuXHRcIjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gS2VlcCAtIExvd2xhbmRzXHJcblx0XCIxMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIEFsZG9uc1xyXG5cdFwiMTNcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBKZXJyaWZlcidzIFNsb3VnaFxyXG5cdFwiMTJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBXaWxkY3JlZWtcclxuXHRcIjE0XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gS2xvdmFuIEd1bGx5XHJcblx0XCIxMFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBDYW1wIC0gTWluZSAtIFJvZ3VlcyBRdWFycnlcclxuXHRcIjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbGwgLSBHb2xhbnRhXHJcblxyXG5cclxuXHQvL1x0UmVkSG9tZVxyXG5cdFwiMzdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjMzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFtaW5nIEJheVxyXG5cdFwiMzJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBFdGhlcm9uIEhpbGxzXHJcblx0XCIzOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIExvbmd2aWV3XHJcblx0XCI0MFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENsaWZmc2lkZVxyXG5cdFwiMzlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgR29kc3dvcmRcclxuXHRcIjUyXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gQXJhaCdzIEhvcGVcclxuXHRcIjUxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gQXN0cmFsaG9sbWVcclxuXHJcblx0XCIzNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEdyZWVuYnJpYXJcclxuXHRcIjM2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gQmx1ZWxha2VcclxuXHRcIjM0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gVmljdG9yJ3MgTG9kZ2VcclxuXHRcIjUzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEdyZWVudmFsZSBSZWZ1Z2VcclxuXHRcIjUwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBCbHVld2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRHcmVlbkhvbWVcclxuXHRcIjQ2XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCI0NFwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhZGZhbGwgQmF5XHJcblx0XCI0MVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIFNoYWRhcmFuIEhpbGxzXHJcblx0XCI0N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFN1bm55aGlsbFxyXG5cdFwiNTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDcmFndG9wXHJcblx0XCI1NlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBUaXRhbnBhd1xyXG5cdFwiNDhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBGYWl0aGxlYXBcclxuXHRcIjU0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gRm9naGF2ZW5cclxuXHJcblx0XCI0NVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEJsdWVicmlhclxyXG5cdFwiNDJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBSZWRsYWtlXHJcblx0XCI0M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIEhlcm8ncyBMb2RnZVxyXG5cdFwiNDlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gQmx1ZXZhbGUgUmVmdWdlXHJcblx0XCI1NVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gUmVkd2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRCbHVlSG9tZVxyXG5cdFwiMjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjI3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIEFzY2Vuc2lvbiBCYXlcclxuXHRcIjMxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gQXNrYWxpb24gSGlsbHNcclxuXHRcIjMwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gV29vZGhhdmVuXHJcblx0XCIyOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIERhd24ncyBFeXJpZVxyXG5cdFwiMjlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgU3Bpcml0aG9sbWVcclxuXHRcIjU4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gR29kc2xvcmVcclxuXHRcIjYwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gU3Rhcmdyb3ZlXHJcblxyXG5cdFwiMjVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBSZWRicmlhclxyXG5cdFwiMjZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBHcmVlbmxha2VcclxuXHRcIjI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gQ2hhbXBpb24ncyBEZW1lbnNlXHJcblx0XCI1OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBSZWR2YWxlIFJlZnVnZVxyXG5cdFwiNjFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEdyZWVud2F0ZXIgTG93bGFuZHNcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwibmFtZVwiOiBcIkdyZWVuIE1pbGxcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwibmFtZVwiOiBcIlJlZCBNaW5lXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcIm5hbWVcIjogXCJSZWQgTWlsbFwifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJuYW1lXCI6IFwiQmx1ZSBNaW5lXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcIm5hbWVcIjogXCJCbHVlIE1pbGxcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwibmFtZVwiOiBcIkNhc3RsZVwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IDEwLCBcIm5hbWVcIjogXCJHcmVlbiBNaW5lXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogMTEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogMTIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogMTMsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogMTQsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogMTUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogMTYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogMTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogMTgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogMTksIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogMjAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogMjEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogMjIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogMjMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiAyNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiAyNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IDI2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IDI3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogMjgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogMjksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiAzMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiAzMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IDMyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogMzMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiAzNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IDM1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IDM2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IDM3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogMzgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogMzksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiA0MCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiA0MSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IDQyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IDQzLCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogNDQsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiA0NSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiA0NiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IDQ3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IDQ4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiA0OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiA1MCwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogNTEsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogNTIsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IDUzLCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IDU0LCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IDU1LCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiA1NiwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IDU3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IDU4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiA1OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiA2MCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiA2MSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogNjIsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogNjMsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiA2NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogNjUsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogNjYsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiA2NywgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IDY4LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IDY5LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiA3MCwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IDcxLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IDcyLCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogNzMsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogNzQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IDc1LCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogNzYsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMzUsIFwibmFtZVwiOiBcImNhc3RsZVwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDI1LCBcIm5hbWVcIjogXCJrZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMTAsIFwibmFtZVwiOiBcInRvd2VyXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogNSwgXCJuYW1lXCI6IFwiY2FtcFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcInRlbXBsZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImhvbGxvd1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImVzdGF0ZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcIm92ZXJsb29rXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiYXNjZW50XCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0bGFuZ3M6IHJlcXVpcmUoJy4vZGF0YS9sYW5ncycpLFxyXG5cdHdvcmxkczogcmVxdWlyZSgnLi9kYXRhL3dvcmxkX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX25hbWVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX3R5cGVzJyksXHJcblx0b2JqZWN0aXZlX21ldGE6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWV0YScpLFxyXG5cdG9iamVjdGl2ZV9sYWJlbHM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbGFiZWxzJyksXHJcblx0b2JqZWN0aXZlX21hcDogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tYXAnKSxcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hXb3JsZCA9IHJlcXVpcmUoJy4vTWF0Y2hXb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIG1hdGNoIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdTY29yZXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KFwic2NvcmVzXCIpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KFwic2NvcmVzXCIpKTtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KFwic3RhcnRUaW1lXCIpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KFwic3RhcnRUaW1lXCIpKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld01hdGNoIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoOjpyZW5kZXIoKScsIHByb3BzLm1hdGNoLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHdvcmxkQ29sb3JzID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddO1xyXG5cclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtYXRjaENvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwibWF0Y2hcIj5cclxuICAgICAgICAgICAgICAgIHt3b3JsZENvbG9ycy5tYXAoKGNvbG9yLCBpeENvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBwcm9wcy5tYXRjaC5nZXQod29ybGRLZXkpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgICAgPSBwcm9wcy53b3JsZHMuZ2V0KHdvcmxkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3JlcyAgID0gcHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxNYXRjaFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgID0ge3dvcmxkSWR9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZCAgICAgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyAgICA9IHtzY29yZXN9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl4Q29sb3IgICA9IHtpeENvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllICAgPSB7aXhDb2xvciA9PT0gMH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTWF0Y2g7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZSAgICAgPSByZXF1aXJlKCcuL1Njb3JlJyk7XHJcbmNvbnN0IFBpZSAgICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9QaWUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgc2NvcmVzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBjb2xvciAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBpeENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBzaG93UGllOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld0NvbG9yIHx8IG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaFdvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld1Njb3JlcywgbmV3Q29sb3IsIG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG4gICAgICAgIHJldHVybiA8dHI+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtwcm9wcy5jb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7cHJvcHMuY29sb3J9YH0+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVcclxuICAgICAgICAgICAgICAgICAgICB0ZWFtICA9IHtwcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICBzY29yZSA9IHtwcm9wcy5zY29yZXMuZ2V0KHByb3BzLml4Q29sb3IpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgeyhwcm9wcy5zaG93UGllKVxyXG4gICAgICAgICAgICAgICAgPyA8dGQgcm93U3Bhbj1cIjNcIiBjbGFzc05hbWU9XCJwaWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8UGllXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyA9IHtwcm9wcy5zY29yZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICA9IHs2MH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC90cj47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoV29ybGQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hdGNoV29ybGQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG4vLyBjb25zdCAkICAgID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IG51bWVyYWwgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9e1xyXG4gICAgc2NvcmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9e1xyXG4gICAgc2NvcmU6IDAsXHJcbn07XHJcblxyXG5jbGFzcyBTY29yZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBkaWZmOiAwLFxyXG4gICAgICAgICAgICAkZGlmZk5vZGU6IG51bGwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyl7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtkaWZmOiBuZXh0UHJvcHMuc2NvcmUgLSBwcm9wcy5zY29yZX0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgaWYoc3RhdGUuZGlmZiAhPT0gMCkge1xyXG4gICAgICAgICAgICBhbmltYXRlU2NvcmVEaWZmKHRoaXMuc3RhdGUuJGRpZmZOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICAvLyBjYWNoZSBqUXVlcnkgb2JqZWN0IHRvIHN0YXRlXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICRkaWZmTm9kZTogJCh0aGlzLnJlZnMuZGlmZi5nZXRET01Ob2RlKCkpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpZmZcIiByZWY9XCJkaWZmXCI+e2dldERpZmZUZXh0KHRoaXMuc3RhdGUuZGlmZil9PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPntnZXRTY29yZVRleHQodGhpcy5wcm9wcy5zY29yZSl9PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVTY29yZURpZmYoJGVsKSB7XHJcbiAgICAkZWxcclxuICAgICAgICAudmVsb2NpdHkoJ3N0b3AnKVxyXG4gICAgICAgIC52ZWxvY2l0eSh7b3BhY2l0eTogMH0sIHtkdXJhdGlvbjogMH0pXHJcbiAgICAgICAgLnZlbG9jaXR5KHtvcGFjaXR5OiAxfSwge2R1cmF0aW9uOiAyMDB9KVxyXG4gICAgICAgIC52ZWxvY2l0eSh7b3BhY2l0eTogMH0sIHtkdXJhdGlvbjogODAwLCBkZWxheTogMTAwMH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RGlmZlRleHQoZGlmZikge1xyXG4gICAgcmV0dXJuIChkaWZmKVxyXG4gICAgICAgID8gbnVtZXJhbChkaWZmKS5mb3JtYXQoJyswLDAnKVxyXG4gICAgICAgIDogbnVsbDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNjb3JlVGV4dChzY29yZSkge1xyXG4gICAgcmV0dXJuIChzY29yZSlcclxuICAgICAgICA/IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJylcclxuICAgICAgICA6IG51bGw7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuU2NvcmUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5TY29yZS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFNjb3JlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoICAgICA9IHJlcXVpcmUoJy4vTWF0Y2gnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17e3BhZGRpbmdMZWZ0OiAnLjVlbSd9fT48aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgcmVnaW9uIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHMgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UmVnaW9uICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbiwgbmV4dFByb3BzLnJlZ2lvbik7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hlcyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoZXMsIG5leHRQcm9wcy5tYXRjaGVzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UmVnaW9uIHx8IG5ld01hdGNoZXMgfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld1JlZ2lvbiwgbmV3TWF0Y2hlcywgbmV3V29ybGRzfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdyZWdpb24nLCBwcm9wcy5yZWdpb24udG9KUygpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ21hdGNoZXMnLCBwcm9wcy5tYXRjaGVzLnRvSlMoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICd3b3JsZHMnLCBwcm9wcy53b3JsZHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAge3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IE1hdGNoZXNcclxuICAgICAgICAgICAgICAgICAgICB7IXByb3BzLm1hdGNoZXMuc2l6ZSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAge3Byb3BzLm1hdGNoZXMubWFwKG1hdGNoID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICA9IHttYXRjaC5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICdtYXRjaCdcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgICA9IHtwcm9wcy53b3JsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoICAgICA9IHttYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoZXMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IE1hdGNoZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgd29ybGQgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGQgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnV29ybGQ6OnJlbmRlcicsIHByb3BzLndvcmxkLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgIHtwcm9wcy53b3JsZC5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvbGk+O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbldvcmxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gV29ybGQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgV29ybGQgICAgID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFdvcmxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3UmVnaW9uICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpLCBuZXh0UHJvcHMucmVnaW9uLmdldCgnd29ybGRzJykpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld1JlZ2lvbik7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6UmVnaW9uV29ybGRzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgbmV3TGFuZywgbmV3UmVnaW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6V29ybGRzOjpyZW5kZXIoKScsIHByb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyksIHByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUmVnaW9uV29ybGRzXCI+XHJcbiAgICAgICAgICAgICAgICA8aDI+e3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IFdvcmxkczwvaDI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtwcm9wcy53b3JsZHMubWFwKHdvcmxkID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxXb3JsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgPSB7d29ybGQuZ2V0KCdpZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZHMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgID0gV29ybGRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiAgIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG4vKlxyXG4qICAgRGF0YVxyXG4qL1xyXG5cclxuY29uc3QgREFPID0gcmVxdWlyZSgnbGliL2RhdGEvb3ZlcnZpZXcnKTtcclxuXHJcblxyXG4vKlxyXG4qICAgUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hlcyAgICAgID0gcmVxdWlyZSgnLi9NYXRjaGVzJyk7XHJcbmNvbnN0IFdvcmxkcyAgICAgICA9IHJlcXVpcmUoJy4vV29ybGRzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE92ZXJ2aWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgICAgUmVhY3QgTGlmZWN5Y2xlXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhTGlzdGVuZXJzID0ge1xyXG4gICAgICAgICAgICAvLyByZWdpb25zICAgICA6IHRoaXMub25SZWdpb25zLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIC8vIG1hdGNoZXNCeVJlZ2lvbjogdGhpcy5vbk1hdGNoZXNCeVJlZ2lvbi5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAvLyB3b3JsZHNCeVJlZ2lvbiA6IHRoaXMub25Xb3JsZHNCeVJlZ2lvbi5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBvbk1hdGNoRGF0YSAgICA6IHRoaXMub25NYXRjaERhdGEuYmluZCh0aGlzKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRhbyA9IG5ldyBEQU8oZGF0YUxpc3RlbmVycyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICByZWdpb25zOiBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgICAgICAgICAgICAgICcxJzoge2xhYmVsOiAnTkEnLCBpZDogJzEnfSxcclxuICAgICAgICAgICAgICAgICcyJzoge2xhYmVsOiAnRVUnLCBpZDogJzInfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbWF0Y2hlc0J5UmVnaW9uOiBJbW11dGFibGUuZnJvbUpTKHsnMSc6IHt9LCAnMic6IHt9fSksXHJcbiAgICAgICAgICAgIHdvcmxkc0J5UmVnaW9uOiB0aGlzLmRhby5nZXRXb3JsZHNCeVJlZ2lvbihwcm9wcy5sYW5nKSAvL0ltbXV0YWJsZS5mcm9tSlMoeycxJzoge30sICcyJzoge319KVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGNoRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5tYXRjaGVzQnlSZWdpb24sIG5leHRTdGF0ZS5tYXRjaGVzQnlSZWdpb24pO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld01hdGNoRGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCB7c2hvdWxkVXBkYXRlLCBuZXdMYW5nLCBuZXdNYXRjaERhdGF9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nKTtcclxuICAgICAgICAvLyBzZXRXb3JsZHMuY2FsbCh0aGlzLCB0aGlzLnByb3BzLmxhbmcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kYW8uaW5pdCh0aGlzLnByb3BzLmxhbmcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBpZiAoIUltbXV0YWJsZS5pcyhuZXh0UHJvcHMubGFuZywgdGhpcy5wcm9wcy5sYW5nKSkge1xyXG4gICAgICAgICAgICBjb25zdCB3b3JsZHNCeVJlZ2lvbiA9IHRoaXMuZGFvLmdldFdvcmxkc0J5UmVnaW9uKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7d29ybGRzQnlSZWdpb259KTtcclxuXHJcbiAgICAgICAgICAgIHNldFBhZ2VUaXRsZShuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kYW8uY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPGRpdiBpZD1cIm92ZXJ2aWV3XCI+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPnt0aGlzLnN0YXRlLnJlZ2lvbnMubWFwKChyZWdpb24sIHJlZ2lvbklkKSA9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTJcIiBrZXk9e3JlZ2lvbklkfT5cclxuICAgICAgICAgICAgICAgICAgICA8TWF0Y2hlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb24gID0ge3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHt0aGlzLnN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZHMgID0ge3RoaXMuc3RhdGUud29ybGRzQnlSZWdpb24uZ2V0KHJlZ2lvbklkKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9PC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8aHIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3RoaXMuc3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXb3JsZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uID0ge3JlZ2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGRzID0ge3RoaXMuc3RhdGUud29ybGRzQnlSZWdpb24uZ2V0KHJlZ2lvbklkKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9PC9kaXY+XHJcblxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgRGF0YSBMaXN0ZW5lcnNcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgb25NYXRjaERhdGEobWF0Y2hEYXRhKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hlc0J5UmVnaW9uID0gdGhpcy5kYW8uZ2V0TWF0Y2hlc0J5UmVnaW9uKG1hdGNoRGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgbWF0Y2hlc0J5UmVnaW9uOiBzdGF0ZS5tYXRjaGVzQnlSZWdpb24ubWVyZ2VEZWVwKG5ld01hdGNoZXNCeVJlZ2lvbilcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgbGV0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG4gICAgaWYgKGxhbmcuZ2V0KCdzbHVnJykgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcuZ2V0KCduYW1lJykpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk92ZXJ2aWV3LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgID0gT3ZlcnZpZXc7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCcuLi9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogdHJ1ZSxcclxuICAgIHRpbWVzdGFtcDogdHJ1ZSxcclxuICAgIG1hcEFiYnJldjogdHJ1ZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiBmYWxzZSxcclxuICAgIHRpbWVyICAgIDogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID17XHJcbiAgICBsYW5nIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGRDbGFpbXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3Q2xhaW1zICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLmdldCgnY2xhaW1zJyksIG5leHRQcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3Q2xhaW1zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBndWlsZElkID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcbiAgICAgICAgY29uc3QgY2xhaW1zICA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LXVuc3R5bGVkXCI+XHJcbiAgICAgICAgICAgICAgICB7Y2xhaW1zLm1hcChlbnRyeSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2VudHJ5LmdldCgnaWQnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxPYmplY3RpdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHMgICAgICAgID0ge29iamVjdGl2ZUNvbHN9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZyAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCAgICAgPSB7Z3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkICAgICAgID0ge3RoaXMucHJvcHMuZ3VpbGR9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7ZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ybGRDb2xvciAgPSB7ZW50cnkuZ2V0KCd3b3JsZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7ZW50cnkuZ2V0KCd0aW1lc3RhbXAnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGRDbGFpbXMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgPSBHdWlsZENsYWltcztcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcbmNvbnN0IENsYWltcyAgICA9IHJlcXVpcmUoJy4vQ2xhaW1zJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7d2hpdGVTcGFjZTogXCJub3dyYXBcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wifX0+XHJcbiAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPlxyXG4gICAgeycgTG9hZGluZy4uLid9XHJcbjwvaDE+O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBkYXRhUmVhZHkgICA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdsb2FkZWQnKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGRJZCAgICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBndWlsZE5hbWUgICA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJyk7XHJcbiAgICAgICAgY29uc3QgZ3VpbGRUYWcgICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgndGFnJyk7XHJcbiAgICAgICAgY29uc3QgZ3VpbGRDbGFpbXMgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnY2xhaW1zJyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdHdWlsZDo6cmVuZGVyKCknLCBndWlsZElkLCBndWlsZE5hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJndWlsZFwiIGlkPXtndWlsZElkfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyhkYXRhUmVhZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxhIGhyZWY9e2BodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLyR7c2x1Z2lmeShndWlsZE5hbWUpfWB9IHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFbWJsZW0gZ3VpbGROYW1lPXtndWlsZE5hbWV9IHNpemU9ezI1Nn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPEVtYmxlbSBzaXplPXsyNTZ9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMjBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyhkYXRhUmVhZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxoMT48YSBocmVmPXtgaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tL2d1aWxkcy8ke3NsdWdpZnkoZ3VpbGROYW1lKX1gfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3VpbGROYW1lfSBbe2d1aWxkVGFnfV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsb2FkaW5nSHRtbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IWd1aWxkQ2xhaW1zLmlzRW1wdHkoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8Q2xhaW1zIHsuLi50aGlzLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcclxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoLyAvZywgJy0nKSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEd1aWxkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgR3VpbGQgICAgID0gcmVxdWlyZSgnLi9HdWlsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEd1aWxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdHdWlsZHM6OnJlbmRlcigpJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Byb3BzLmd1aWxkcycsIHByb3BzLmd1aWxkcy50b09iamVjdCgpKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc29ydGVkR3VpbGRzID0gcHJvcHMuZ3VpbGRzLnRvU2VxKClcclxuICAgICAgICAgICAgLnNvcnRCeShndWlsZCA9PiBndWlsZC5nZXQoJ2d1aWxkX25hbWUnKSlcclxuICAgICAgICAgICAgLnNvcnRCeShndWlsZCA9PiAtZ3VpbGQuZ2V0KCdsYXN0Q2xhaW0nKSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGlkPVwiZ3VpbGRzXCI+XHJcbiAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkZXJcIj5HdWlsZCBDbGFpbXM8L2gyPlxyXG4gICAgICAgICAgICAgICAge3NvcnRlZEd1aWxkcy5tYXAoZ3VpbGQgPT5cclxuICAgICAgICAgICAgICAgICAgICA8R3VpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgPSB7Z3VpbGQuZ2V0KCdndWlsZF9pZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nICA9IHtwcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZCA9IHtndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkd1aWxkcy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgPSBHdWlsZHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0ICQgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGNhcHR1cmVDb2xzID0ge1xyXG4gICAgZWxhcHNlZCAgOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiB0cnVlLFxyXG4gICAgbWFwQWJicmV2OiB0cnVlLFxyXG4gICAgYXJyb3cgICAgOiB0cnVlLFxyXG4gICAgc3ByaXRlICAgOiB0cnVlLFxyXG4gICAgbmFtZSAgICAgOiB0cnVlLFxyXG4gICAgZXZlbnRUeXBlOiBmYWxzZSxcclxuICAgIGd1aWxkTmFtZTogZmFsc2UsXHJcbiAgICBndWlsZFRhZyA6IGZhbHNlLFxyXG4gICAgdGltZXIgICAgOiBmYWxzZSxcclxufTtcclxuXHJcbmNvbnN0IGNsYWltQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogdHJ1ZSxcclxuICAgIHRpbWVzdGFtcDogdHJ1ZSxcclxuICAgIG1hcEFiYnJldjogdHJ1ZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IHRydWUsXHJcbiAgICBndWlsZFRhZyA6IHRydWUsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZW50cnkgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbiAgICBtYXBGaWx0ZXIgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGQgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcbiAgICAgICAgY29uc3QgbmV3RW50cnkgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZW50cnksIG5leHRQcm9wcy5lbnRyeSk7XHJcbiAgICAgICAgY29uc3QgbmV3TWFwRmlsdGVyICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdFdmVudEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgICA9IChuZXdMYW5nIHx8IG5ld0d1aWxkIHx8IG5ld0VudHJ5IHx8IG5ld01hcEZpbHRlciB8fCBuZXdFdmVudEZpbHRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0VudHJ5OnJlbmRlcigpJyk7XHJcbiAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKTtcclxuICAgICAgICBjb25zdCBjb2xzICAgICAgPSAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSA/IGNsYWltQ29scyA6IGNhcHR1cmVDb2xzO1xyXG4gICAgICAgIGNvbnN0IG9NZXRhICAgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YVt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKV07XHJcbiAgICAgICAgY29uc3QgbWFwQ29sb3IgID0gXy5maW5kKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXAgPT4gbWFwLm1hcEluZGV4ID09PSBvTWV0YS5tYXApLmNvbG9yO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlc01hcEZpbHRlciAgID0gdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSBtYXBDb2xvcjtcclxuICAgICAgICBjb25zdCBtYXRjaGVzRXZlbnRGaWx0ZXIgPSB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSBldmVudFR5cGU7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkQmVWaXNpYmxlICAgID0gKG1hdGNoZXNNYXBGaWx0ZXIgJiYgbWF0Y2hlc0V2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBjbGFzc05hbWUgICAgICAgICAgPSBzaG91bGRCZVZpc2libGUgPyAnc2hvdy1lbnRyeScgOiAnaGlkZS1lbnRyeSc7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7Y29sc31cclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHt0aGlzLnByb3BzLmd1aWxkSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZW50cnlJZCAgICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGRDb2xvciAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSAgID0ge3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0eXBlJyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkVudHJ5LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gRW50cnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2FsbCcsICdjYXB0dXJlJywgJ2NsYWltJ10pLmlzUmVxdWlyZWQsXHJcbiAgICBzZXRFdmVudCAgIDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcEZpbHRlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5ldmVudEZpbHRlciAhPT0gbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBsaW5rQ2xhaW1zICAgPSA8YSBvbkNsaWNrPXt0aGlzLnByb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImNsYWltXCI+Q2xhaW1zPC9hPjtcclxuICAgICAgICBjb25zdCBsaW5rQ2FwdHVyZXMgPSA8YSBvbkNsaWNrPXt0aGlzLnByb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImNhcHR1cmVcIj5DYXB0dXJlczwvYT47XHJcbiAgICAgICAgY29uc3QgbGlua0FsbCAgICAgID0gPGEgb25DbGljaz17dGhpcy5wcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJsb2ctZXZlbnQtZmlsdGVyc1wiIGNsYXNzTmFtZT1cIm5hdiBuYXYtcGlsbHNcIj5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9eyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnY2xhaW0nKSAgID8gJ2FjdGl2ZSc6IG51bGx9PntsaW5rQ2xhaW1zfTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXsodGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gJ2NhcHR1cmUnKSA/ICdhY3RpdmUnOiBudWxsfT57bGlua0NhcHR1cmVzfTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXsodGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gJ2FsbCcpICAgPyAnYWN0aXZlJzogbnVsbH0+e2xpbmtBbGx9PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRmlsdGVycy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRmlsdGVycztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEVudHJ5ICAgICA9IHJlcXVpcmUoJy4vRW50cnknKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBkZWZhdWx0UHJvcHMgPXtcclxuICAgIGd1aWxkczoge30sXHJcbn07XHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzICAgICAgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcbiAgICB0cmlnZ2VyTm90aWZpY2F0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgbWFwRmlsdGVyICAgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRGaWx0ZXIgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTG9nRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3VHJpZ2dlclN0YXRlID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24sIG5leHRQcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uKTtcclxuICAgICAgICBjb25zdCBuZXdGaWx0ZXJTdGF0ZSAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKSB8fCAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIsIG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSAgICA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdUcmlnZ2VyU3RhdGUgfHwgbmV3RmlsdGVyU3RhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xvZ0VudHJpZXM6OnJlbmRlcigpJywgcHJvcHMubWFwRmlsdGVyLCBwcm9wcy5ldmVudEZpbHRlciwgcHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBpZD1cImxvZ1wiPlxyXG4gICAgICAgICAgICAgICAge3Byb3BzLmV2ZW50SGlzdG9yeS5tYXAoZW50cnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IGVudHJ5LmdldCgndHlwZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5SWQgICA9IGVudHJ5LmdldCgnaWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGd1aWxkSWQsIGd1aWxkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudFR5cGUgPT09ICdjbGFpbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCA9IGVudHJ5LmdldCgnZ3VpbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICA9IChwcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHByb3BzLmd1aWxkcy5nZXQoZ3VpbGRJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8RW50cnlcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgICAgICAgICA9IHtlbnRyeUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgICAgICAgICAgID0gJ2xpJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbiA9IHtwcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgID0ge3Byb3BzLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGaWx0ZXIgICAgICAgICA9IHtwcm9wcy5ldmVudEZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgICAgICAgICAgPSB7cHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgICAgICAgICAgICAgPSB7Z3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkgICAgICAgICAgICAgICA9IHtlbnRyeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgICAgICAgICA9IHtndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxvZ0VudHJpZXMuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xyXG5Mb2dFbnRyaWVzLnByb3BUeXBlcyAgICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgPSBMb2dFbnRyaWVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9e1xyXG4gICAgbWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBzZXRXb3JsZCA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubWFwRmlsdGVyICE9PSBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBpZD1cImxvZy1tYXAtZmlsdGVyc1wiIGNsYXNzTmFtZT1cIm5hdiBuYXYtcGlsbHNcIj5cclxuXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXsocHJvcHMubWFwRmlsdGVyID09PSAnYWxsJykgPyAnYWN0aXZlJzogJ251bGwnfT5cclxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICAgICAgICAgIHtfLm1hcChTVEFUSUMub2JqZWN0aXZlX21hcCwgbWFwTWV0YSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e21hcE1ldGEubWFwSW5kZXh9IGNsYXNzTmFtZT17KHByb3BzLm1hcEZpbHRlciA9PT0gbWFwTWV0YS5jb2xvcikgPyAnYWN0aXZlJzogbnVsbH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3Byb3BzLnNldFdvcmxkfSBkYXRhLWZpbHRlcj17bWFwTWV0YS5jb2xvcn0+e21hcE1ldGEuYWJicn08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hcEZpbHRlcnM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbi8vIGNvbnN0IFNUQVRJQyAgICAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBGaWx0ZXJzICAgPSByZXF1aXJlKCcuL01hcEZpbHRlcnMnKTtcclxuY29uc3QgRXZlbnRGaWx0ZXJzID0gcmVxdWlyZSgnLi9FdmVudEZpbHRlcnMnKTtcclxuY29uc3QgTG9nRW50cmllcyAgID0gcmVxdWlyZSgnLi9Mb2dFbnRyaWVzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgOiAnYWxsJyxcclxuICAgICAgICAgICAgZXZlbnRGaWx0ZXIgICAgICAgIDogJ2FsbCcsXHJcbiAgICAgICAgICAgIHRyaWdnZXJOb3RpZmljYXRpb246IGZhbHNlLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdIaXN0b3J5ICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpLCBuZXh0UHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld01hcEZpbHRlciAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hcEZpbHRlciwgbmV4dFN0YXRlLm1hcEZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgbmV3RXZlbnRGaWx0ZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZXZlbnRGaWx0ZXIsIG5leHRTdGF0ZS5ldmVudEZpbHRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSAgID0gKG5ld0xhbmcgfHwgbmV3R3VpbGRzIHx8IG5ld0hpc3RvcnkgfHwgbmV3TWFwRmlsdGVyIHx8IG5ld0V2ZW50RmlsdGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEhpc3RvcnkgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJsb2ctY29udGFpbmVyXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTE2XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWFwRmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlciA9IHt0aGlzLnN0YXRlLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRXb3JsZCAgPSB7c2V0V29ybGQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXZlbnRGaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGaWx0ZXIgPSB7dGhpcy5zdGF0ZS5ldmVudEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFdmVudCAgICA9IHtzZXRFdmVudC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7IWV2ZW50SGlzdG9yeS5pc0VtcHR5KClcclxuICAgICAgICAgICAgICAgICAgICA/IDxMb2dFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJOb3RpZmljYXRpb24gPSB7dGhpcy5zdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgID0ge3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZpbHRlciAgICAgICAgID0ge3RoaXMuc3RhdGUuZXZlbnRGaWx0ZXJ9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICAgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRzICAgICAgICAgICAgICA9IHt0aGlzLnByb3BzLmd1aWxkc31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50SGlzdG9yeSAgICAgICAgPSB7ZXZlbnRIaXN0b3J5fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRXb3JsZChlKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcbiAgICBsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7bWFwRmlsdGVyOiBmaWx0ZXIsIHRyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRFdmVudChlKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcbiAgICBsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7ZXZlbnRGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTG9nLnByb3BUeXBlcyAgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzID0gTG9nO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCAgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzICA9IHJlcXVpcmUoJy4vTWFwU2NvcmVzJyk7XHJcbmNvbnN0IE1hcFNlY3Rpb24gPSByZXF1aXJlKCcuL01hcFNlY3Rpb24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBkZXRhaWxzICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkcyAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdEZXRhaWxzICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGRzIHx8IG5ld0RldGFpbHMgfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBtYXBNZXRhICAgPSBTVEFUSUMub2JqZWN0aXZlX21hcC5maW5kKG1tID0+IG1tLmdldCgna2V5JykgPT09IHRoaXMucHJvcHMubWFwS2V5KTtcclxuICAgICAgICBjb25zdCBtYXBJbmRleCAgPSBtYXBNZXRhLmdldCgnbWFwSW5kZXgnKS50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnN0IG1hcFNjb3JlcyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ21hcHMnLCAnc2NvcmVzJywgbWFwSW5kZXhdKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6Ok1hcHM6Ok1hcERldGFpbHM6cmVuZGVyKCknLCBtYXBTY29yZXMudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXBcIj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9eyd0ZWFtICcgKyBtYXBNZXRhLmdldCgnY29sb3InKX0gb25DbGljaz17b25UaXRsZUNsaWNrfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge21hcE1ldGEuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8TWFwU2NvcmVzIHNjb3Jlcz17bWFwU2NvcmVzfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ3NlY3Rpb25zJykubWFwKChtYXBTZWN0aW9uLCBpeFNlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWFwU2VjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCAgPSBcInVsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgICAgICAgID0ge2l4U2VjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBTZWN0aW9uID0ge21hcFNlY3Rpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwTWV0YSAgICA9IHttYXBNZXRhfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBvblRpdGxlQ2xpY2soZSkge1xyXG4gICAgbGV0ICRtYXBzICAgID0gJCgnLm1hcCcpO1xyXG4gICAgbGV0ICRtYXAgICAgID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLm1hcCcsICRtYXBzKTtcclxuXHJcbiAgICBsZXQgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG4gICAgaWYoIWhhc0ZvY3VzKSB7XHJcbiAgICAgICAgJG1hcFxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcbiAgICAgICAgJG1hcHMubm90KCRtYXApXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdtYXAtYmx1cicpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgJG1hcHNcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRGV0YWlscy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRGV0YWlscztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbnVtZXJhbCAgID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwU2NvcmVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdTY29yZXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2NvcmVzLCBuZXh0UHJvcHMuc2NvcmVzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnNjb3Jlcy5tYXAoKHNjb3JlLCBpeFNjb3JlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkID0gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZWFtICAgICAgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ11baXhTY29yZV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXt0ZWFtfSBjbGFzc05hbWU9e2B0ZWFtICR7dGVhbX1gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdHRlZH1cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBTY29yZXMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gTWFwU2NvcmVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnVHJhY2tlci9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIE1vZHVsZSBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcbiAgICBlbGFwc2VkICA6IGZhbHNlLFxyXG4gICAgdGltZXN0YW1wOiBmYWxzZSxcclxuICAgIG1hcEFiYnJldjogZmFsc2UsXHJcbiAgICBhcnJvdyAgICA6IHRydWUsXHJcbiAgICBzcHJpdGUgICA6IHRydWUsXHJcbiAgICBuYW1lICAgICA6IHRydWUsXHJcbiAgICBldmVudFR5cGU6IGZhbHNlLFxyXG4gICAgZ3VpbGROYW1lOiBmYWxzZSxcclxuICAgIGd1aWxkVGFnIDogdHJ1ZSxcclxuICAgIHRpbWVyICAgIDogdHJ1ZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgbWFwU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzICAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgZGV0YWlscyAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwU2VjdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdEZXRhaWxzICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdvYmplY3RpdmVzJyk7XHJcbiAgICAgICAgY29uc3Qgb3duZXJzICAgICAgICA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IGNsYWltZXJzICAgICAgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb25DbGFzcyAgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT17YGxpc3QtdW5zdHlsZWQgJHtzZWN0aW9uQ2xhc3N9YH0+XHJcbiAgICAgICAgICAgICAgICB7bWFwT2JqZWN0aXZlcy5tYXAob2JqZWN0aXZlSWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG93bmVyICAgICAgICA9IG93bmVycy5nZXQob2JqZWN0aXZlSWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xhaW1lciAgICAgID0gY2xhaW1lcnMuZ2V0KG9iamVjdGl2ZUlkLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBndWlsZElkICAgICAgPSAoY2xhaW1lcikgPyBjbGFpbWVyLmd1aWxkIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYXNDbGFpbWVyICAgPSAhIWd1aWxkSWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc0d1aWxkRGF0YSA9IGhhc0NsYWltZXIgJiYgdGhpcy5wcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGd1aWxkICAgICAgICA9IGhhc0d1aWxkRGF0YSA/IHRoaXMucHJvcHMuZ3VpbGRzLmdldChndWlsZElkKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e29iamVjdGl2ZUlkfSBpZD17J29iamVjdGl2ZS0nICsgb2JqZWN0aXZlSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzICAgICAgICA9IHtvYmplY3RpdmVDb2xzfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZENvbG9yICA9IHtvd25lci5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7b3duZXIuZ2V0KCd0aW1lc3RhbXAnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkICAgICAgID0ge2d1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldFNlY3Rpb25DbGFzcyhtYXBLZXksIHNlY3Rpb25MYWJlbCkge1xyXG4gICAgbGV0IHNlY3Rpb25DbGFzcyA9IFtcclxuICAgICAgICAnY29sLW1kLTI0JyxcclxuICAgICAgICAnbWFwLXNlY3Rpb24nLFxyXG4gICAgXTtcclxuXHJcbiAgICBpZiAobWFwS2V5ID09PSAnQ2VudGVyJykge1xyXG4gICAgICAgIGlmIChzZWN0aW9uTGFiZWwgPT09ICdDYXN0bGUnKSB7XHJcbiAgICAgICAgICAgIHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tMjQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzZWN0aW9uQ2xhc3Muam9pbignICcpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwU2VjdGlvbi5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwU2VjdGlvbjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBEZXRhaWxzID0gcmVxdWlyZSgnLi9NYXBEZXRhaWxzJyk7XHJcbmNvbnN0IExvZyAgICAgICAgPSByZXF1aXJlKCdUcmFja2VyL0xvZycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZGV0YWlscyAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGV0YWlscyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBjb25zdCBpc0RhdGFJbml0aWFsaXplZCA9IHByb3BzLmRldGFpbHMuZ2V0KCdpbml0aWFsaXplZCcpO1xyXG5cclxuICAgICAgICBpZiAoIWlzRGF0YUluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGlkPVwibWFwc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNlwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJDZW50ZXJcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0xOFwiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiUmVkSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC04XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkJsdWVIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiR3JlZW5Ib21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMjRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TG9nIHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBNYXBzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNob3dOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1RhZyA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZElkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGd1aWxkICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRJZCwgbmV4dFByb3BzLmd1aWxkSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGQgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgICAgID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc3QgaGFzR3VpbGQgID0gISF0aGlzLnByb3BzLmd1aWxkSWQ7XHJcbiAgICAgICAgY29uc3QgaXNFbmFibGVkID0gKGhhc0d1aWxkICYmICh0aGlzLnByb3BzLnNob3dOYW1lIHx8IHRoaXMucHJvcHMuc2hvd1RhZykpO1xyXG5cclxuICAgICAgICBpZiAoIWlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0d1aWxkRGF0YSA9IChwcm9wcy5ndWlsZCAmJiBwcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlkICAgID0gcHJvcHMuZ3VpbGRJZDtcclxuICAgICAgICAgICAgY29uc3QgaHJlZiAgPSBgIyR7aWR9YDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPjtcclxuICAgICAgICAgICAgbGV0IHRpdGxlICAgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhhc0d1aWxkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFnICA9IHByb3BzLmd1aWxkLmdldCgndGFnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLnNob3dOYW1lICYmIHByb3BzLnNob3dUYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtgJHtuYW1lfSBbJHt0YWd9XSBgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGd1aWxkTmFtZT17bmFtZX0gc2l6ZT17MjB9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BzLnNob3dOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGAke25hbWV9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBgJHt0YWd9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGAke25hbWV9IFske3RhZ31dYDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxhIGNsYXNzTmFtZT1cImd1aWxkbmFtZVwiIGhyZWY9e2hyZWZ9IHRpdGxlPXt0aXRsZX0+XHJcbiAgICAgICAgICAgICAgICB7Y29udGVudH1cclxuICAgICAgICAgICAgPC9hPjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gR3VpbGQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTcHJpdGUgICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvU3ByaXRlJyk7XHJcbmNvbnN0IEFycm93ICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9BcnJvdycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzaG93QXJyb3cgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHNob3dTcHJpdGUgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgb2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGNvbG9yICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBJY29ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLnNob3dBcnJvdyAmJiAhdGhpcy5wcm9wcy5zaG93U3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb01ldGEgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9UeXBlSWQgPSBvTWV0YS5nZXQoJ3R5cGUnKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjb25zdCBvVHlwZSAgID0gU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQob1R5cGVJZCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtaWNvbnNcIj5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy5zaG93QXJyb3cpID9cclxuICAgICAgICAgICAgICAgICAgICA8QXJyb3cgb01ldGE9e29NZXRhfSAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsfVxyXG5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy5zaG93U3ByaXRlKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlICA9IHtvVHlwZS5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5JY29ucy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEljb25zO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9MYWJlbCAgID0gU1RBVElDLm9iamVjdGl2ZV9sYWJlbHMuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e29MYWJlbC5nZXQobGFuZ1NsdWcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTGFiZWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZCAgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgb2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcE5hbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgLy8gbWFwIG5hbWUgY2FuIG5ldmVyIGNoYW5nZSwgbm90IGxvY2FsaXplZFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb01ldGEgICAgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXBJbmRleCA9IG9NZXRhLmdldCgnbWFwJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcE1ldGEgID0gU1RBVElDLm9iamVjdGl2ZV9tYXAuZmluZChtbSA9PiBtbS5nZXQoJ21hcEluZGV4JykgPT09IG1hcEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1tYXBcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRpdGxlPXttYXBNZXRhLmdldCgnbmFtZScpfT5cclxuICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ2FiYnInKX1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwTmFtZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgID0gTWFwTmFtZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5jb25zdCBzcGlubmVyID0gIDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT47XHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVGltZXJDb3VudGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzID0gdGhpcy5wcm9wcy50aW1lc3RhbXAgKyAoNSAqIDYwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9J3RpbWVyIGNvdW50ZG93biBpbmFjdGl2ZScgZGF0YS1leHBpcmVzPXtleHBpcmVzfT5cclxuICAgICAgICAgICAgICAgIHtzcGlubmVyfVxyXG4gICAgICAgICAgICA8L3NwYW4+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVGltZXJDb3VudGRvd24ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgICAgPSBUaW1lckNvdW50ZG93bjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVGltZXJSZWxhdGl2ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1yZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGltZXIgcmVsYXRpdmVcIiBkYXRhLXRpbWVzdGFtcD17dGhpcy5wcm9wcy50aW1lc3RhbXB9PlxyXG4gICAgICAgICAgICAgICAgICAgIHttb21lbnQodGhpcy5wcm9wcy50aW1lc3RhbXAgKiAxMDAwKS50d2l0dGVyU2hvcnQoKX1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVGltZXJSZWxhdGl2ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgICAgID0gVGltZXJSZWxhdGl2ZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVGltZXN0YW1wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wSHRtbCA9IG1vbWVudCgodGhpcy5wcm9wcy50aW1lc3RhbXApICogMTAwMCkuZm9ybWF0KCdoaDptbTpzcycpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXRpbWVzdGFtcFwiPlxyXG4gICAgICAgICAgICAgICAge3RpbWVzdGFtcEh0bWx9XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRpbWVzdGFtcC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBUaW1lc3RhbXA7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDICAgICAgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgVGltZXJSZWxhdGl2ZSAgPSByZXF1aXJlKCcuL1RpbWVyUmVsYXRpdmUnKTtcclxuY29uc3QgVGltZXN0YW1wICAgICAgPSByZXF1aXJlKCcuL1RpbWVzdGFtcCcpO1xyXG5jb25zdCBNYXBOYW1lICAgICAgICA9IHJlcXVpcmUoJy4vTWFwTmFtZScpO1xyXG5jb25zdCBJY29ucyAgICAgICAgICA9IHJlcXVpcmUoJy4vSWNvbnMnKTtcclxuY29uc3QgTGFiZWwgICAgICAgICAgPSByZXF1aXJlKCcuL0xhYmVsJyk7XHJcbmNvbnN0IEd1aWxkICAgICAgICAgID0gcmVxdWlyZSgnLi9HdWlsZCcpO1xyXG5jb25zdCBUaW1lckNvdW50ZG93biA9IHJlcXVpcmUoJy4vVGltZXJDb3VudGRvd24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogTW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgY29sRGVmYXVsdHMgPSB7XHJcbiAgICBlbGFwc2VkICA6IGZhbHNlLFxyXG4gICAgdGltZXN0YW1wOiBmYWxzZSxcclxuICAgIG1hcEFiYnJldjogZmFsc2UsXHJcbiAgICBhcnJvdyAgICA6IGZhbHNlLFxyXG4gICAgc3ByaXRlICAgOiBmYWxzZSxcclxuICAgIG5hbWUgICAgIDogZmFsc2UsXHJcbiAgICBldmVudFR5cGU6IGZhbHNlLFxyXG4gICAgZ3VpbGROYW1lOiBmYWxzZSxcclxuICAgIGd1aWxkVGFnIDogZmFsc2UsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcbiAgICBvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGRDb2xvciA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcCAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBldmVudFR5cGUgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICBndWlsZElkICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGd1aWxkICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuXHJcbiAgICBjb2xzICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxufTtcclxuXHJcbmNsYXNzIE9iamVjdGl2ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdDYXB0dXJlICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBuZXdPd25lciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRDb2xvciwgbmV4dFByb3BzLndvcmxkQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NsYWltZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ09iamVjdGl2ZTpyZW5kZXIoKScsIHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG5cclxuICAgICAgICBjb25zdCBvYmplY3RpdmVJZCA9IHRoaXMucHJvcHMub2JqZWN0aXZlSWQudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCBvTWV0YSAgICAgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQob2JqZWN0aXZlSWQpO1xyXG5cclxuICAgICAgICAvLyBzaG9ydCBjaXJjdWl0XHJcbiAgICAgICAgaWYgKG9NZXRhLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbHMgPSBfLmRlZmF1bHRzKHRoaXMucHJvcHMuY29scywgY29sRGVmYXVsdHMpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWUgPSB7YG9iamVjdGl2ZSB0ZWFtICR7dGhpcy5wcm9wcy53b3JsZENvbG9yfWB9PlxyXG4gICAgICAgICAgICAgICAgPFRpbWVyUmVsYXRpdmUgaXNFbmFibGVkID0geyEhY29scy5lbGFwc2VkfSB0aW1lc3RhbXAgPSB7cHJvcHMudGltZXN0YW1wfSAvPlxyXG4gICAgICAgICAgICAgICAgPFRpbWVzdGFtcCBpc0VuYWJsZWQgPSB7ISFjb2xzLnRpbWVzdGFtcH0gdGltZXN0YW1wID0ge3Byb3BzLnRpbWVzdGFtcH0gLz5cclxuICAgICAgICAgICAgICAgIDxNYXBOYW1lIGlzRW5hYmxlZCA9IHshIWNvbHMubWFwQWJicmV2fSBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8SWNvbnNcclxuICAgICAgICAgICAgICAgICAgICBzaG93QXJyb3cgICA9IHshIWNvbHMuYXJyb3d9XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1Nwcml0ZSAgPSB7ISFjb2xzLnNwcml0ZX1cclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgICA9IHt0aGlzLnByb3BzLndvcmxkQ29sb3J9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxMYWJlbCBpc0VuYWJsZWQgPSB7ISFjb2xzLm5hbWV9IG9iamVjdGl2ZUlkID0ge29iamVjdGl2ZUlkfSBsYW5nID0ge3RoaXMucHJvcHMubGFuZ30gLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TmFtZSA9IHtjb2xzLmd1aWxkTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1RhZyAgPSB7Y29scy5ndWlsZFRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCAgPSB7dGhpcy5wcm9wcy5ndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZCAgICA9IHt0aGlzLnByb3BzLmd1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxUaW1lckNvdW50ZG93biBpc0VuYWJsZWQgPSB7ISFjb2xzLnRpbWVyfSB0aW1lc3RhbXAgPSB7cHJvcHMudGltZXN0YW1wfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk9iamVjdGl2ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBPYmplY3RpdmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy8vU3ByaXRlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgY29sb3IgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICB0eXBlUXVhbnRpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHR5cGVJZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3NJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQocHJvcHMudHlwZUlkKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UXVhbnRpdHkgID0gKHRoaXMucHJvcHMudHlwZVF1YW50aXR5ICE9PSBuZXh0UHJvcHMudHlwZVF1YW50aXR5KTtcclxuICAgICAgICBjb25zdCBuZXdUeXBlICAgICAgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbG9yICAgICA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdRdWFudGl0eSB8fCBuZXdUeXBlIHx8IG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblxyXG4gICAgICAgIGlmIChuZXdUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe29UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldCh0aGlzLnByb3BzLnR5cGVJZCl9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OlNjb3JlYm9hcmQ6OkhvbGRpbmdzSXRlbTpyZW5kZXIoKScsIHRoaXMuc3RhdGUub1R5cGUudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge3RoaXMuc3RhdGUub1R5cGUuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAge2AgeCR7dGhpcy5wcm9wcy50eXBlUXVhbnRpdHl9YH1cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5nc0l0ZW0ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgID0gSG9sZGluZ3NJdGVtOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBJdGVtICAgICAgPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBjb2xvciAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0hvbGRpbmdzICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ob2xkaW5ncywgbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMuaG9sZGluZ3MubWFwKCh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIDxJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgID0ge3R5cGVJbmRleH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgICAgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlUXVhbnRpdHkgPSB7dHlwZVF1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVJZCAgICAgICA9IHsodHlwZUluZGV4KzEpLnRvU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvdWw+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICA9IEhvbGRpbmdzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBudW1lcmFsICAgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBIb2xkaW5ncyAgPSByZXF1aXJlKCcuL0hvbGRpbmdzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7aGVpZ2h0OiAnOTBweCcsIGZvbnRTaXplOiAnMzJwdCcsIGxpbmVIZWlnaHQ6ICc5MHB4J319PlxyXG4gICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHNjb3JlICAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB0aWNrICAgIDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZSAgICAgPSAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuICAgICAgICBjb25zdCBuZXdUaWNrICAgICAgPSAodGhpcy5wcm9wcy50aWNrICE9PSBuZXh0UHJvcHMudGljayk7XHJcbiAgICAgICAgY29uc3QgbmV3SG9sZGluZ3MgID0gKHRoaXMucHJvcHMuaG9sZGluZ3MgIT09IG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkIHx8IG5ld1Njb3JlIHx8IG5ld1RpY2sgfHwgbmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1gfT5cclxuICAgICAgICAgICAgICAgICAgICB7KHRoaXMucHJvcHMud29ybGQgJiYgSW1tdXRhYmxlLk1hcC5pc01hcCh0aGlzLnByb3BzLndvcmxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48YSBocmVmPXt0aGlzLnByb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy53b3JsZC5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtudW1lcmFsKHRoaXMucHJvcHMuc2NvcmUpLmZvcm1hdCgnMCwwJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bnVtZXJhbCh0aGlzLnByb3BzLnRpY2spLmZvcm1hdCgnKzAsMCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SG9sZGluZ3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2NvbG9yJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9sZGluZ3M9e3RoaXMucHJvcHMuaG9sZGluZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBsb2FkaW5nSHRtbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFNjb3JlYm9hcmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuICAgICAgICBjb25zdCBuZXdTY29yZXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc2NvcmVzJykpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZHMgfHwgbmV3U2NvcmVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBzY29yZXMgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuICAgICAgICBjb25zdCB0aWNrcyAgICA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCd0aWNrcycpO1xyXG4gICAgICAgIGNvbnN0IGhvbGRpbmdzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ2hvbGRpbmdzJyk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInJvd1wiIGlkPVwic2NvcmVib2FyZHNcIj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hdGNoV29ybGRzLm1hcCgod29ybGQsIGl4V29ybGQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgID0ge2l4V29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkICAgID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZSAgICA9IHtzY29yZXMuZ2V0KGl4V29ybGQpIHx8IDB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sgICAgID0ge3RpY2tzLmdldChpeFdvcmxkKSB8fCAwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob2xkaW5ncyA9IHtob2xkaW5ncy5nZXQoaXhXb3JsZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBTY29yZWJvYXJkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBsaWJzXHJcbiovXHJcblxyXG5jb25zdCBhcGkgICAgICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBsaWJEYXRlICAgICAgID0gcmVxdWlyZSgnbGliL2RhdGUnKTtcclxuY29uc3QgdHJhY2tlclRpbWVycyA9IHJlcXVpcmUoJ2xpYi90cmFja2VyVGltZXJzJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5jb25zdCBEYXRhUHJvdmlkZXIgID0gcmVxdWlyZSgnbGliL2RhdGEvdHJhY2tlcicpO1xyXG5jb25zdCBHdWlsZHNMaWIgICAgID0gcmVxdWlyZSgnbGliL3RyYWNrZXIvZ3VpbGRzJyk7XHJcbmNvbnN0IFNUQVRJQyAgICAgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmVib2FyZCAgICA9IHJlcXVpcmUoJy4vU2NvcmVib2FyZCcpO1xyXG5jb25zdCBNYXBzICAgICAgICAgID0gcmVxdWlyZSgnLi9NYXBzJyk7XHJcbmNvbnN0IEd1aWxkcyAgICAgICAgPSByZXF1aXJlKCcuL0d1aWxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUcmFja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5tb3VudGVkICAgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxzID0ge3RpbWVyczogbnVsbH07XHJcbiAgICAgICAgdGhpcy50aW1lb3V0cyAgPSB7ZGF0YTogbnVsbH07XHJcblxyXG4gICAgICAgIHRoaXMuZ3VpbGRMaWIgID0gbmV3IEd1aWxkc0xpYih0aGlzKTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGFMaXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICB0aGlzLmRhdGFQcm92aWRlciA9IG5ldyBEYXRhUHJvdmlkZXIocHJvcHMubGFuZywgZGF0YUxpc3RlbmVycyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmRhdGFQcm92aWRlci5nZXREZWZhdWx0cygpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBpbml0aWFsRGF0YSAgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuaGFzRGF0YSwgbmV4dFN0YXRlLmhhc0RhdGEpO1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGNoRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5sYXN0bW9kLCBuZXh0U3RhdGUubGFzdG1vZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmd1aWxkcywgbmV4dFN0YXRlLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAoaW5pdGlhbERhdGEgfHwgbmV3TWF0Y2hEYXRhIHx8IG5ld0d1aWxkRGF0YSB8fCBuZXdMYW5nKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxzLnRpbWVycyA9IHNldEludGVydmFsKHVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCAxMDAwKTtcclxuXHJcbiAgICAgICAgc2V0SW1tZWRpYXRlKHVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBzZXRJbW1lZGlhdGUoZ2V0TWF0Y2hEZXRhaWxzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KCknKTtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lcnMuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCknLCBuZXdMYW5nKTtcclxuXHJcbiAgICAgICAgaWYgKCFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZykpIHtcclxuICAgICAgICAgICAgc2V0TWF0Y2hXb3JsZHMuY2FsbCh0aGlzLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLy8gY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcclxuICAgIC8vICBjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVwZGF0ZSgpJyk7XHJcbiAgICAvLyB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OnJlbmRlcigpJyk7XHJcbiAgICAgICAgc2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGFzRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cInRyYWNrZXJcIj5cclxuXHJcbiAgICAgICAgICAgICAgICB7PFNjb3JlYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFdvcmxkcyA9IHt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoICAgICAgID0ge3RoaXMuc3RhdGUubWF0Y2h9XHJcbiAgICAgICAgICAgICAgICAvPn1cclxuXHJcbiAgICAgICAgICAgICAgICB7PE1hcHNcclxuICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlscyAgICAgPSB7dGhpcy5zdGF0ZS5kZXRhaWxzfVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoV29ybGRzID0ge3RoaXMuc3RhdGUubWF0Y2hXb3JsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGRzICAgICAgPSB7dGhpcy5zdGF0ZS5ndWlsZHN9XHJcbiAgICAgICAgICAgICAgICAvPn1cclxuXHJcbiAgICAgICAgICAgICAgICB7PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7KCF0aGlzLnN0YXRlLmd1aWxkcy5pc0VtcHR5KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxHdWlsZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcyAgICAgID0ge3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltRXZlbnRzID0ge3RoaXMuc3RhdGUuY2xhaW1FdmVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2Pn1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFRpbWVyc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGltZXJzKCkge1xyXG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcbiAgICBjb25zdCBzdGF0ZSAgID0gY29tcG9uZW50LnN0YXRlO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZVRpbWVycygpJyk7XHJcblxyXG4gICAgY29uc3QgdGltZU9mZnNldCA9IHN0YXRlLnRpbWVPZmZzZXQ7XHJcbiAgICBjb25zdCBub3cgICAgICAgID0gbGliRGF0ZS5kYXRlTm93KCkgLSB0aW1lT2Zmc2V0O1xyXG5cclxuICAgIHRyYWNrZXJUaW1lcnMudXBkYXRlKG5vdywgdGltZU9mZnNldCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2xlYXJUaW1lcnMoKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjbGVhclRpbWVycygpJyk7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcbiAgICBfLmZvckVhY2goY29tcG9uZW50LmludGVydmFscywgY2xlYXJJbnRlcnZhbCk7XHJcbiAgICBfLmZvckVhY2goY29tcG9uZW50LnRpbWVvdXRzLCBjbGVhclRpbWVvdXQpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBNYXRjaCBEZXRhaWxzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscygpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG4gICAgY29uc3QgcHJvcHMgICA9IGNvbXBvbmVudC5wcm9wcztcclxuXHJcbiAgICBjb25zdCB3b3JsZCAgICAgPSBwcm9wcy53b3JsZDtcclxuICAgIGNvbnN0IGxhbmdTbHVnICA9IHByb3BzLmxhbmcuZ2V0KCdzbHVnJyk7XHJcbiAgICBjb25zdCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG5cclxuICAgIGFwaS5nZXRNYXRjaERldGFpbHNCeVdvcmxkKFxyXG4gICAgICAgIHdvcmxkU2x1ZyxcclxuICAgICAgICBvbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uTWF0Y2hEZXRhaWxzKGVyciwgZGF0YSkge1xyXG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcbiAgICBjb25zdCBwcm9wcyAgID0gY29tcG9uZW50LnByb3BzO1xyXG4gICAgY29uc3Qgc3RhdGUgICA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblxyXG4gICAgaWYgKGNvbXBvbmVudC5tb3VudGVkKSB7XHJcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSAmJiBkYXRhLm1hdGNoICYmIGRhdGEuZGV0YWlscykge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0bW9kICAgID0gZGF0YS5tYXRjaC5sYXN0bW9kO1xyXG4gICAgICAgICAgICBjb25zdCBpc01vZGlmaWVkID0gKGxhc3Rtb2QgIT09IHN0YXRlLm1hdGNoLmdldCgnbGFzdG1vZCcpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsIGRhdGEubWF0Y2gubGFzdG1vZCwgaXNNb2RpZmllZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZU5vdyAgICAgPSBsaWJEYXRlLmRhdGVOb3coKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVPZmZzZXQgID0gTWF0aC5mbG9vcihkYXRlTm93ICAtIChkYXRhLm5vdyAvIDEwMDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERhdGEgICA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5tYXRjaCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5kZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB1c2UgdHJhbnNhY3Rpb25hbCBzZXRTdGF0ZVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlTm93LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdG1vZCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggOiBzdGF0ZS5tYXRjaC5tZXJnZURlZXAobWF0Y2hEYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzIDogc3RhdGUuZGV0YWlscy5tZXJnZURlZXAoZGV0YWlsc0RhdGEpLFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoY29tcG9uZW50Lmd1aWxkTGliLm9uTWF0Y2hEYXRhLmJpbmQoY29tcG9uZW50Lmd1aWxkTGliLCBkZXRhaWxzRGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5tYXRjaFdvcmxkcy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoc2V0TWF0Y2hXb3JsZHMuYmluZChjb21wb25lbnQsIHByb3BzLmxhbmcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJlc2NoZWR1bGVEYXRhVXBkYXRlLmNhbGwoY29tcG9uZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiByZXNjaGVkdWxlRGF0YVVwZGF0ZSgpIHtcclxuICAgIGxldCBjb21wb25lbnQgICAgID0gdGhpcztcclxuICAgIGNvbnN0IHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCoyLCAxMDAwKjQpO1xyXG5cclxuICAgIGNvbXBvbmVudC50aW1lb3V0cy5kYXRhID0gc2V0VGltZW91dChnZXRNYXRjaERldGFpbHMuYmluZChjb21wb25lbnQpLCByZWZyZXNoVGltZSk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIE1hdGNoV29ybGRzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldE1hdGNoV29ybGRzKGxhbmcpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IG1hdGNoV29ybGRzID0gSW1tdXRhYmxlXHJcbiAgICAgICAgLkxpc3QoWydyZWQnLCAnYmx1ZScsICdncmVlbiddKVxyXG4gICAgICAgIC5tYXAoZ2V0TWF0Y2hXb3JsZC5iaW5kKGNvbXBvbmVudCwgbGFuZykpO1xyXG5cclxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7bWF0Y2hXb3JsZHN9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaFdvcmxkKGxhbmcsIGNvbG9yKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuICAgIGNvbnN0IHN0YXRlICAgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG4gICAgY29uc3QgbGFuZ1NsdWcgICAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGRLZXkgICAgPSBjb2xvciArICdJZCc7XHJcbiAgICBjb25zdCB3b3JsZElkICAgICA9IHN0YXRlLm1hdGNoLmdldEluKFt3b3JsZEtleV0pLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCB3b3JsZEJ5TGFuZyA9IFNUQVRJQy53b3JsZHMuZ2V0SW4oW3dvcmxkSWQsIGxhbmdTbHVnXSk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkQnlMYW5nXHJcbiAgICAgICAgLnNldCgnY29sb3InLCBjb2xvcilcclxuICAgICAgICAuc2V0KCdsaW5rJywgZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZykpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuICAgIHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZC5nZXQoJ3NsdWcnKV0uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBsZXQgbGFuZ1NsdWcgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgIGxldCB3b3JsZE5hbWUgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICduYW1lJ10pO1xyXG5cclxuICAgIGxldCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICAkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVHJhY2tlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgID0gVHJhY2tlcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIG9NZXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0aXZlTWV0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vTWV0YSwgbmV4dFByb3BzLm9NZXRhKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3T2JqZWN0aXZlTWV0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGltZ1NyYyA9IGdldEFycm93U3JjKHRoaXMucHJvcHMub01ldGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lID0gXCJkaXJlY3Rpb25cIj5cclxuICAgICAgICAgICAgeyhpbWdTcmMpXHJcbiAgICAgICAgICAgICAgICA/IDxpbWcgc3JjID0ge2ltZ1NyY30gLz5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC9zcGFuPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRBcnJvd1NyYyhtZXRhKSB7XHJcbiAgICBpZiAoIW1ldGEuZ2V0KCdkJykpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ24nKSkgICAgICB7c3JjLnB1c2goJ25vcnRoJyk7fVxyXG4gICAgZWxzZSBpZiAobWV0YS5nZXQoJ3MnKSkge3NyYy5wdXNoKCdzb3V0aCcpO31cclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ3cnKSkgICAgICB7c3JjLnB1c2goJ3dlc3QnKTt9XHJcbiAgICBlbHNlIGlmIChtZXRhLmdldCgnZScpKSB7c3JjLnB1c2goJ2Vhc3QnKTt9XHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5BcnJvdy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEFycm93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBndWlsZE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBzaXplICAgICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGd1aWxkTmFtZTogdW5kZWZpbmVkLFxyXG4gICAgc2l6ZTogMjU2LFxyXG59O1xyXG5cclxuY2xhc3MgRW1ibGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZE5hbWUgPSAodGhpcy5wcm9wcy5ndWlsZE5hbWUgIT09IG5leHRQcm9wcy5ndWlsZE5hbWUpO1xyXG4gICAgICAgIGNvbnN0IG5ld1NpemUgICAgICA9ICh0aGlzLnByb3BzLnNpemUgIT09IG5leHRQcm9wcy5zaXplKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGROYW1lIHx8IG5ld1NpemUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBlbWJsZW1TcmMgPSBnZXRFbWJsZW1TcmModGhpcy5wcm9wcy5ndWlsZE5hbWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBcImVtYmxlbVwiXHJcbiAgICAgICAgICAgIHNyYyAgICAgICA9IHtlbWJsZW1TcmN9XHJcbiAgICAgICAgICAgIHdpZHRoICAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCAgICA9IHt0aGlzLnByb3BzLnNpemV9XHJcbiAgICAgICAgICAgIG9uRXJyb3IgICA9IHtpbWdPbkVycm9yfVxyXG4gICAgICAgIC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcbiAgICByZXR1cm4gKGd1aWxkTmFtZSlcclxuICAgICAgICA/IGBodHRwOlxcL1xcL2d1aWxkcy5ndzJ3MncuY29tXFwvZ3VpbGRzXFwvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9XFwvMjU2LnN2Z2BcclxuICAgICAgICA6IGltZ1BsYWNlaG9sZGVyO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW1nT25FcnJvcihlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50U3JjID0gJChlLnRhcmdldCkuYXR0cignc3JjJyk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRTcmMgIT09IGltZ1BsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgJChlLnRhcmdldCkuYXR0cignc3JjJywgaW1nUGxhY2Vob2xkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkVtYmxlbS5wcm9wVHlwZXMgICAgPSBwcm9wVHlwZXM7XHJcbkVtYmxlbS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gRW1ibGVtO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIENvbXBvbmVudCBHbG9iYWxzXHJcbiAqL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcbiAgICBzaXplICA6IDYwLFxyXG4gICAgc3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1BpZTo6cmVuZGVyJywgcHJvcHMuc2NvcmVzLnRvQXJyYXkoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8aW1nXHJcbiAgICAgICAgICAgIHdpZHRoID0ge0lOU1RBTkNFLnNpemV9XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgICAgICBzcmMgPSB7Z2V0SW1hZ2VTb3VyY2UocHJvcHMuc2NvcmVzLnRvQXJyYXkoKSl9XHJcbiAgICAgICAgLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuICAgIHJldHVybiBgaHR0cDpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLmpvaW4oJywnKX0/c3Ryb2tlV2lkdGg9JHtJTlNUQU5DRS5zdHJva2V9YDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5QaWUucHJvcFR5cGVzICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBQaWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgdHlwZSA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBTcHJpdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld1R5cGUgICAgICA9ICh0aGlzLnByb3BzLnR5cGUgIT09IG5leHRQcm9wcy50eXBlKTtcclxuICAgICAgICBjb25zdCBuZXdDb2xvciAgICAgPSAodGhpcy5wcm9wcy5jb2xvciAhPT0gbmV4dFByb3BzLmNvbG9yKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VHlwZSB8fCBuZXdDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZSA9IHtgc3ByaXRlICR7dGhpcy5wcm9wcy50eXBlfSAke3RoaXMucHJvcHMuY29sb3J9YH0gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5TcHJpdGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgID0gU3ByaXRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydGVkIENvbXBvbmVudFxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgd29ybGQgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG4gICAgbGlua0xhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYW5nTGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgID0gSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy5saW5rTGFuZyk7XHJcbiAgICAgICAgY29uc3QgbGlzdENsYXNzID0gaXNBY3RpdmUgPyAnYWN0aXZlJyA6ICcnO1xyXG5cclxuICAgICAgICBjb25zdCB0aXRsZSAgICAgPSB0aGlzLnByb3BzLmxpbmtMYW5nLmdldCgnbmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGxhYmVsICAgICA9IHRoaXMucHJvcHMubGlua0xhbmcuZ2V0KCdsYWJlbCcpO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgICAgICA9IGdldExpbmsodGhpcy5wcm9wcy5saW5rTGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lID0ge2xpc3RDbGFzc30gdGl0bGUgPSB7dGl0bGV9PlxyXG4gICAgICAgICAgICA8YSBocmVmID0ge2xpbmt9PntsYWJlbH08L2E+XHJcbiAgICAgICAgPC9saT47IH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG4gICAgbGV0IGxpbmsgPSBgLyR7bGFuZ1NsdWd9YDtcclxuXHJcbiAgICBpZiAod29ybGQpIHtcclxuICAgICAgICBsZXQgd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuICAgICAgICBsaW5rICs9IGAvJHt3b3JsZFNsdWd9YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGluaztcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkxhbmdMaW5rLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBMYW5nTGluaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5jb25zdCBMYW5nTGluayAgPSByZXF1aXJlKCcuL0xhbmdMaW5rJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0ZWQgQ29tcG9uZW50XHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbn07XHJcblxyXG5jbGFzcyBMYW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMYW5nczo6cmVuZGVyKCknLCB0aGlzLnByb3BzLmxhbmcudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDx1bCBjbGFzc05hbWUgPSAnbmF2IG5hdmJhci1uYXYnPlxyXG4gICAgICAgICAgICB7U1RBVElDLmxhbmdzLm1hcCgobGlua0xhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHtrZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua0xhbmcgPSB7bGlua0xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7dGhpcy5wcm9wcy53b3JsZH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5MYW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IExhbmdzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZ2V0R3VpbGREZXRhaWxzICAgICAgIDogZ2V0R3VpbGREZXRhaWxzLFxyXG4gICAgZ2V0TWF0Y2hlcyAgICAgICAgICAgIDogZ2V0TWF0Y2hlcyxcclxuICAgIGdldE1hdGNoRGV0YWlsc0J5V29ybGQ6IGdldE1hdGNoRGV0YWlsc0J5V29ybGQsXHJcbiAgICAvLyBnZXRNYXRjaERldGFpbHMgICAgOiBnZXRNYXRjaERldGFpbHMsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuICAgIGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG4gICAgZ3cyYXBpLmdldEd1aWxkRGV0YWlscyh7XHJcbiAgICAgICAgZ3VpbGRfaWQ6IGd1aWxkSWRcclxuICAgIH0sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRNYXRjaERldGFpbHMobWF0Y2hJZCwgY2FsbGJhY2spIHtcclxuLy8gICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe21hdGNoX2lkOiBtYXRjaElkfSwgY2FsbGJhY2spO1xyXG4vLyB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc0J5V29ybGQod29ybGRTbHVnLCBjYWxsYmFjaykge1xyXG4gICAgLy8gc2V0VGltZW91dChcclxuICAgIC8vICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUuYmluZChudWxsLCB7d29ybGRfc2x1Zzogd29ybGRTbHVnfSwgY2FsbGJhY2spLFxyXG4gICAgLy8gIDMwMDBcclxuICAgIC8vICk7XHJcbiAgICBndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe1xyXG4gICAgICAgIHdvcmxkX3NsdWc6IHdvcmxkU2x1Z1xyXG4gICAgfSwgY2FsbGJhY2spO1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IF8gICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgYXBpICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuY2xhc3MgT3ZlcnZpZXdEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3Ojpjb25zdHJ1Y3RvcigpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9fZ2V0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0V29ybGRzQnlSZWdpb24obGFuZykge1xyXG4gICAgICAgIHJldHVybiBJbW11dGFibGVcclxuICAgICAgICAgICAgLlNlcShTVEFUSUMud29ybGRzKVxyXG4gICAgICAgICAgICAubWFwKHdvcmxkICAgICA9PiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkpXHJcbiAgICAgICAgICAgIC5zb3J0Qnkod29ybGQgID0+IHdvcmxkLmdldCgnbmFtZScpKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldE1hdGNoZXNCeVJlZ2lvbihtYXRjaERhdGEpIHtcclxuICAgICAgICByZXR1cm4gSW1tdXRhYmxlXHJcbiAgICAgICAgICAgIC5TZXEobWF0Y2hEYXRhKVxyXG4gICAgICAgICAgICAuZ3JvdXBCeShtYXRjaCA9PiBtYXRjaC5nZXQoXCJyZWdpb25cIikudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIF9fZ2V0RGF0YSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19nZXREYXRhKCknKTtcclxuICAgICAgICBhcGkuZ2V0TWF0Y2hlcyh0aGlzLl9fb25NYXRjaERhdGEuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX29uTWF0Y2hEYXRhKGVyciwgZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpfX29uTWF0Y2hEYXRhKCknLCBkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9fbW91bnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYXRjaERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIWVyciAmJiBtYXRjaERhdGEgJiYgIW1hdGNoRGF0YS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgKHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERhdGEgfHwgXy5ub29wKShtYXRjaERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX3NldERhdGFUaW1lb3V0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX3NldERhdGFUaW1lb3V0KCkge1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gZ2V0SW50ZXJ2YWwoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6X19zZXREYXRhVGltZW91dCgpJywgaW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMubWF0Y2hEYXRhID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgdGhpcy5fX2dldERhdGEuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgaW50ZXJ2YWxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqIERhdGEgLSBXb3JsZHNcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkge1xyXG4gICAgY29uc3QgbGFuZ1NsdWcgICAgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG4gICAgY29uc3Qgd29ybGRCeUxhbmcgPSB3b3JsZC5nZXQobGFuZ1NsdWcpO1xyXG5cclxuICAgIGNvbnN0IHJlZ2lvbiAgICAgID0gd29ybGQuZ2V0KCdyZWdpb24nKTtcclxuICAgIGNvbnN0IGxpbmsgICAgICAgID0gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZyk7XHJcblxyXG4gICAgcmV0dXJuIHdvcmxkQnlMYW5nLm1lcmdlKHtcclxuICAgICAgICBsaW5rLCByZWdpb25cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcbiAgICByZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGQuZ2V0KCdzbHVnJyldLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCgpIHtcclxuICAgIHJldHVybiBfLnJhbmRvbSgyMDAwLCA0MDAwKTtcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3RGF0YVByb3ZpZGVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGxpYkRhdGUgICA9IHJlcXVpcmUoJ2xpYi9kYXRlJyk7XHJcbmNvbnN0IGFwaSAgICAgICA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmNsYXNzIFRyYWNrZXJEYXRhUHJvdmlkZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxhbmcsIGxpc3RlbmVycykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmNvbnN0cnVjdG9yKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYW5nID0gbGFuZztcclxuXHJcbiAgICAgICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcblxyXG4gICAgICAgIHRoaXMudGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbHMgPSB7fTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6aW5pdCgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW91bnRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjp0cmFja2VyOjpjbG9zZSgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW91bnRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMudGltZW91dHMgID0gXy5tYXAodGhpcy50aW1lb3V0cywgIHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcclxuICAgICAgICB0aGlzLmludGVydmFscyA9IF8ubWFwKHRoaXMuaW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0RGVmYXVsdHMoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Z2V0RGVmYXVsdHMoKScpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBoYXNEYXRhICAgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICBkYXRlTm93ICAgIDogbGliRGF0ZS5kYXRlTm93KCksXHJcbiAgICAgICAgICAgIGxhc3Rtb2QgICAgOiAwLFxyXG4gICAgICAgICAgICB0aW1lT2Zmc2V0IDogMCxcclxuXHJcbiAgICAgICAgICAgIG1hdGNoICAgICAgOiBJbW11dGFibGUuTWFwKHtsYXN0bW9kOjB9KSxcclxuICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IEltbXV0YWJsZS5MaXN0KCksXHJcbiAgICAgICAgICAgIGRldGFpbHMgICAgOiBJbW11dGFibGUuTWFwKCksXHJcbiAgICAgICAgICAgIGNsYWltRXZlbnRzOiBJbW11dGFibGUuTGlzdCgpLFxyXG4gICAgICAgICAgICBndWlsZHMgICAgIDogSW1tdXRhYmxlLk1hcCgpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrZXJEYXRhUHJvdmlkZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZGF0ZU5vdzogZGF0ZU5vdyxcclxuICAgIGFkZDUgICA6IGFkZDUsXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZGF0ZU5vdygpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKF8ubm93KCkgLyAxMDAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZDUoaW5EYXRlKSB7XHJcbiAgICBsZXQgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcbiAgICByZXR1cm4gKF9iYXNlRGF0ZSArICg1ICogNjApKTtcclxufVxyXG4iLCJjb25zdCBzdGF0aWNzID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuY29uc3QgaW1tdXRhYmxlU3RhdGljcyA9IHtcclxuICAgIGxhbmdzICAgICAgICAgICA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5sYW5ncyksXHJcbiAgICB3b3JsZHMgICAgICAgICAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mud29ybGRzKSxcclxuICAgIG9iamVjdGl2ZV9uYW1lcyA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbmFtZXMpLFxyXG4gICAgb2JqZWN0aXZlX3R5cGVzIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV90eXBlcyksXHJcbiAgICBvYmplY3RpdmVfbWV0YSAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX21ldGEpLFxyXG4gICAgb2JqZWN0aXZlX2xhYmVsczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9sYWJlbHMpLFxyXG4gICAgb2JqZWN0aXZlX21hcCAgIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGltbXV0YWJsZVN0YXRpY3M7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgXyAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKG5vdywgdGltZU9mZnNldCkge1xyXG4gICAgbGV0ICR0aW1lcnMgICAgID0gJCgnLnRpbWVyJyk7XHJcbiAgICBsZXQgJGNvdW50ZG93bnMgPSAkdGltZXJzLmZpbHRlcignLmNvdW50ZG93bicpO1xyXG4gICAgbGV0ICRyZWxhdGl2ZXMgID0gJHRpbWVycy5maWx0ZXIoJy5yZWxhdGl2ZScpO1xyXG5cclxuICAgIGFzeW5jLnBhcmFsbGVsKFtcclxuICAgICAgICB1cGRhdGVSZWxhdGl2ZVRpbWVycy5iaW5kKG51bGwsICRyZWxhdGl2ZXMsIHRpbWVPZmZzZXQpLFxyXG4gICAgICAgIHVwZGF0ZUNvdW50ZG93blRpbWVycy5iaW5kKG51bGwsICRjb3VudGRvd25zLCBub3cpLFxyXG4gICAgXSwgXy5ub29wKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZVRpbWVycyhyZWxhdGl2ZXMsIHRpbWVPZmZzZXQsIGNiKSB7XHJcbiAgICBhc3luYy5lYWNoKFxyXG4gICAgICAgIHJlbGF0aXZlcyxcclxuICAgICAgICB1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlLmJpbmQobnVsbCwgdGltZU9mZnNldCksXHJcbiAgICAgICAgY2JcclxuICAgICk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJzKGNvdW50ZG93bnMsIG5vdywgY2IpIHtcclxuICAgIGFzeW5jLmVhY2goXHJcbiAgICAgICAgY291bnRkb3ducyxcclxuICAgICAgICB1cGRhdGVDb3VudGRvd25UaW1lck5vZGUuYmluZChudWxsLCBub3cpLFxyXG4gICAgICAgIGNiXHJcbiAgICApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbGF0aXZlVGltZU5vZGUodGltZU9mZnNldCwgZWwsIG5leHQpIHtcclxuICAgIGxldCAkZWwgPSAkKGVsKTtcclxuXHJcbiAgICBjb25zdCB0aW1lc3RhbXAgICAgICAgICA9IF8ucGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdGltZXN0YW1wJykpO1xyXG4gICAgY29uc3Qgb2Zmc2V0VGltZXN0YW1wICAgPSB0aW1lc3RhbXAgKyB0aW1lT2Zmc2V0O1xyXG4gICAgY29uc3QgdGltZXN0YW1wTW9tZW50ICAgPSBtb21lbnQob2Zmc2V0VGltZXN0YW1wICogMTAwMCk7XHJcbiAgICBjb25zdCB0aW1lc3RhbXBSZWxhdGl2ZSA9IHRpbWVzdGFtcE1vbWVudC50d2l0dGVyU2hvcnQoKTtcclxuXHJcbiAgICAkZWwudGV4dCh0aW1lc3RhbXBSZWxhdGl2ZSk7XHJcblxyXG4gICAgbmV4dCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZShub3csIGVsLCBuZXh0KSB7XHJcbiAgICBsZXQgJGVsID0gJChlbCk7XHJcblxyXG4gICAgY29uc3QgZGF0YUV4cGlyZXMgID0gJGVsLmF0dHIoJ2RhdGEtZXhwaXJlcycpO1xyXG4gICAgY29uc3QgZXhwaXJlcyAgICAgID0gXy5wYXJzZUludChkYXRhRXhwaXJlcyk7XHJcbiAgICBjb25zdCBzZWNSZW1haW5pbmcgPSAoZXhwaXJlcyAtIG5vdyk7XHJcbiAgICBjb25zdCBzZWNFbGFwc2VkICAgPSAzMDAgLSBzZWNSZW1haW5pbmc7XHJcblxyXG5cclxuICAgIGNvbnN0IGhpZ2hsaXRlVGltZSAgICAgICA9IDEwO1xyXG4gICAgY29uc3QgaXNWaXNpYmxlICAgICAgICAgID0gZXhwaXJlcyArIGhpZ2hsaXRlVGltZSA+PSBub3c7XHJcbiAgICBjb25zdCBpc0V4cGlyZWQgICAgICAgICAgPSBleHBpcmVzIDwgbm93O1xyXG4gICAgY29uc3QgaXNBY3RpdmUgICAgICAgICAgID0gIWlzRXhwaXJlZDtcclxuICAgIGNvbnN0IGlzVGltZXJIaWdobGlnaHRlZCA9IChzZWNSZW1haW5pbmcgPD0gTWF0aC5hYnMoaGlnaGxpdGVUaW1lKSk7XHJcbiAgICBjb25zdCBpc1RpbWVyRnJlc2ggICAgICAgPSAoc2VjRWxhcHNlZCA8PSBoaWdobGl0ZVRpbWUpO1xyXG5cclxuXHJcbiAgICBjb25zdCB0aW1lclRleHQgPSAoaXNBY3RpdmUpID8gbW9tZW50KHNlY1JlbWFpbmluZyAqIDEwMDApLmZvcm1hdCgnbTpzcycpIDogJzA6MDAnO1xyXG5cclxuXHJcbiAgICBpZiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgbGV0ICRvYmplY3RpdmUgICAgICAgID0gJGVsLmNsb3Nlc3QoJy5vYmplY3RpdmUnKTtcclxuICAgICAgICBsZXQgaGFzQ2xhc3NIaWdobGlnaHQgPSAkZWwuaGFzQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgIGxldCBoYXNDbGFzc0ZyZXNoICAgICA9ICRvYmplY3RpdmUuaGFzQ2xhc3MoJ2ZyZXNoJyk7XHJcblxyXG4gICAgICAgIGlmIChpc1RpbWVySGlnaGxpZ2h0ZWQgJiYgIWhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghaXNUaW1lckhpZ2hsaWdodGVkICYmIGhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNUaW1lckZyZXNoICYmICFoYXNDbGFzc0ZyZXNoKSB7XHJcbiAgICAgICAgICAgICRvYmplY3RpdmUuYWRkQ2xhc3MoJ2ZyZXNoJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghaXNUaW1lckZyZXNoICYmIGhhc0NsYXNzRnJlc2gpIHtcclxuICAgICAgICAgICAgJG9iamVjdGl2ZS5yZW1vdmVDbGFzcygnZnJlc2gnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRlbC50ZXh0KHRpbWVyVGV4dClcclxuICAgICAgICAgICAgLmZpbHRlcignLmluYWN0aXZlJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJylcclxuICAgICAgICAgICAgLmVuZCgpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJGVsLmZpbHRlcignLmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnaW5hY3RpdmUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0JylcclxuICAgICAgICAgICAgLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IGFzeW5jICAgICA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5jb25zdCBhcGkgICAgICAgPSByZXF1aXJlKCdsaWIvYXBpLmpzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogTW9kdWxlIEdsb2JhbHNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBndWlsZERlZmF1bHQgPSBJbW11dGFibGUuTWFwKHtcclxuICAgICdsb2FkZWQnICAgOiBmYWxzZSxcclxuICAgICdsYXN0Q2xhaW0nOiAwLFxyXG4gICAgJ2NsYWltcycgICA6IEltbXV0YWJsZS5NYXAoKSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbnVtUXVldWVDb25jdXJyZW50ID0gNDtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFB1YmxpYyBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuY2xhc3MgTGliR3VpbGRzIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgICB0aGlzLmFzeW5jR3VpbGRRdWV1ZSA9IGFzeW5jLnF1ZXVlKFxyXG4gICAgICAgICAgICB0aGlzLmdldEd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBudW1RdWV1ZUNvbmN1cnJlbnRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIG9uTWF0Y2hEYXRhKG1hdGNoRGV0YWlscykge1xyXG4gICAgICAgIC8vIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5jb21wb25lbnQuc3RhdGU7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMaWJHdWlsZHM6Om9uTWF0Y2hEYXRhKCknKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0aXZlQ2xhaW1lcnMgPSBtYXRjaERldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IGNsYWltRXZlbnRzICAgICAgID0gZ2V0RXZlbnRzQnlUeXBlKG1hdGNoRGV0YWlscywgJ2NsYWltJyk7XHJcbiAgICAgICAgY29uc3QgZ3VpbGRzVG9Mb29rdXAgICAgPSBnZXRVbmtub3duR3VpbGRzKHN0YXRlLmd1aWxkcywgb2JqZWN0aXZlQ2xhaW1lcnMsIGNsYWltRXZlbnRzKTtcclxuXHJcbiAgICAgICAgLy8gc2VuZCBuZXcgZ3VpbGRzIHRvIGFzeW5jIHF1ZXVlIG1hbmFnZXIgZm9yIGRhdGEgcmV0cmlldmFsXHJcbiAgICAgICAgaWYgKCFndWlsZHNUb0xvb2t1cC5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hc3luY0d1aWxkUXVldWUucHVzaChndWlsZHNUb0xvb2t1cC50b0FycmF5KCkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxldCBuZXdHdWlsZHMgPSBzdGF0ZS5ndWlsZHM7XHJcbiAgICAgICAgbmV3R3VpbGRzICAgICA9IGluaXRpYWxpemVHdWlsZHMobmV3R3VpbGRzLCBndWlsZHNUb0xvb2t1cCk7XHJcbiAgICAgICAgbmV3R3VpbGRzICAgICA9IGd1aWxkc1Byb2Nlc3NDbGFpbXMobmV3R3VpbGRzLCBjbGFpbUV2ZW50cyk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBzdGF0ZSBpZiBuZWNlc3NhcnlcclxuICAgICAgICBpZiAoIUltbXV0YWJsZS5pcyhzdGF0ZS5ndWlsZHMsIG5ld0d1aWxkcykpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2d1aWxkczo6b25NYXRjaERhdGEoKScsICdoYXMgdXBkYXRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIGd1aWxkczogbmV3R3VpbGRzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBvbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50O1xyXG4gICAgICAgIGNvbnN0IHN0YXRlICAgPSBjb21wb25lbnQuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgaGFzRGF0YSA9IHN0YXRlLmd1aWxkcy5nZXRJbihbZ3VpbGRJZCwgJ2xvYWRlZCddKTtcclxuXHJcbiAgICAgICAgaWYgKGhhc0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmdldEd1aWxkRGV0YWlscygpJywgJ3NraXAnLCBndWlsZElkKTtcclxuICAgICAgICAgICAgb25Db21wbGV0ZShudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Z2V0R3VpbGREZXRhaWxzKCknLCAnbG9va3VwJywgZ3VpbGRJZCk7XHJcbiAgICAgICAgICAgIGFwaS5nZXRHdWlsZERldGFpbHMoXHJcbiAgICAgICAgICAgICAgICBndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgb25HdWlsZERhdGEuYmluZCh0aGlzLCBvbkNvbXBsZXRlKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEob25Db21wbGV0ZSwgZXJyLCBkYXRhKSB7XHJcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQ7XHJcblxyXG4gICAgaWYgKGNvbXBvbmVudC5tb3VudGVkKSB7XHJcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkge1xyXG4gICAgICAgICAgICBkZWxldGUgZGF0YS5lbWJsZW07XHJcbiAgICAgICAgICAgIGRhdGEubG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGd1aWxkSWQgICA9IGRhdGEuZ3VpbGRfaWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGd1aWxkRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgICAgIGd1aWxkczogc3RhdGUuZ3VpbGRzLm1lcmdlSW4oW2d1aWxkSWRdLCBndWlsZERhdGEpXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29tcGxldGUobnVsbCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ3VpbGRzUHJvY2Vzc0NsYWltcyhndWlsZHMsIGNsYWltRXZlbnRzKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ3VpbGRzUHJvY2Vzc0NsYWltcygpJywgZ3VpbGRzLnNpemUpO1xyXG5cclxuICAgIHJldHVybiBndWlsZHMubWFwKFxyXG4gICAgICAgIGd1aWxkQXR0YWNoQ2xhaW1zLmJpbmQobnVsbCwgY2xhaW1FdmVudHMpXHJcbiAgICApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWxkQXR0YWNoQ2xhaW1zKGNsYWltRXZlbnRzLCBndWlsZCwgZ3VpbGRJZCkge1xyXG4gICAgY29uc3QgaW5jQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSA9PT0gZ3VpbGRJZClcclxuICAgICAgICAudG9NYXAoKTtcclxuXHJcbiAgICBjb25zdCBoYXNDbGFpbXMgICAgICA9ICFndWlsZC5nZXQoJ2NsYWltcycpLmlzRW1wdHkoKTtcclxuICAgIGNvbnN0IG5ld2VzdENsYWltICAgID0gaGFzQ2xhaW1zID8gZ3VpbGQuZ2V0KCdjbGFpbXMnKS5maXJzdCgpIDogbnVsbDtcclxuICAgIGNvbnN0IGluY0hhc0NsYWltcyAgID0gIWluY0NsYWltcy5pc0VtcHR5KCk7XHJcbiAgICBjb25zdCBpbmNOZXdlc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY0NsYWltcy5maXJzdCgpIDogbnVsbDtcclxuXHJcbiAgICBjb25zdCBoYXNOZXdDbGFpbXMgICA9ICghSW1tdXRhYmxlLmlzKG5ld2VzdENsYWltLCBpbmNOZXdlc3RDbGFpbSkpO1xyXG5cclxuXHJcbiAgICBpZiAoaGFzTmV3Q2xhaW1zKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdENsYWltID0gaW5jSGFzQ2xhaW1zID8gaW5jTmV3ZXN0Q2xhaW0uZ2V0KCd0aW1lc3RhbXAnKSA6IDA7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsYWltcyBhbHRlcmVkJywgZ3VpbGRJZCwgaGFzTmV3Q2xhaW1zLCBsYXN0Q2xhaW0pO1xyXG4gICAgICAgIGd1aWxkID0gZ3VpbGQuc2V0KCdjbGFpbXMnLCBpbmNDbGFpbXMpO1xyXG4gICAgICAgIGd1aWxkID0gZ3VpbGQuc2V0KCdsYXN0Q2xhaW0nLCBsYXN0Q2xhaW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBndWlsZDtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplR3VpbGRzKGd1aWxkcywgbmV3R3VpbGRzKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZUd1aWxkcygpJyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnbmV3R3VpbGRzJywgbmV3R3VpbGRzKTtcclxuXHJcbiAgICBuZXdHdWlsZHMuZm9yRWFjaChndWlsZElkID0+IHtcclxuICAgICAgICBpZiAoIWd1aWxkcy5oYXMoZ3VpbGRJZCkpIHtcclxuICAgICAgICAgICAgbGV0IGd1aWxkID0gZ3VpbGREZWZhdWx0LnNldCgnZ3VpbGRfaWQnLCBndWlsZElkKTtcclxuICAgICAgICAgICAgZ3VpbGRzICAgID0gZ3VpbGRzLnNldChndWlsZElkLCBndWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGd1aWxkcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCBldmVudFR5cGUpIHtcclxuICAgIHJldHVybiBtYXRjaERldGFpbHNcclxuICAgICAgICAuZ2V0KCdoaXN0b3J5JylcclxuICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgndHlwZScpID09PSBldmVudFR5cGUpXHJcbiAgICAgICAgLnNvcnRCeShlbnRyeSA9PiAtZW50cnkuZ2V0KCd0aW1lc3RhbXAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZUd1aWxkcywgb2JqZWN0aXZlQ2xhaW1lcnMsIGNsYWltRXZlbnRzKSB7XHJcbiAgICBjb25zdCBndWlsZHNXaXRoQ3VycmVudENsYWltcyA9IG9iamVjdGl2ZUNsYWltZXJzXHJcbiAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcbiAgICAgICAgLnRvU2V0KCk7XHJcblxyXG4gICAgY29uc3QgZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuICAgICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSlcclxuICAgICAgICAudG9TZXQoKTtcclxuXHJcbiAgICBjb25zdCBndWlsZENsYWltcyA9IGd1aWxkc1dpdGhDdXJyZW50Q2xhaW1zXHJcbiAgICAgICAgLnVuaW9uKGd1aWxkc1dpdGhQcmV2aW91c0NsYWltcyk7XHJcblxyXG5cclxuICAgIGNvbnN0IGtub3duR3VpbGRzID0gc3RhdGVHdWlsZHNcclxuICAgICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGRfaWQnKSlcclxuICAgICAgICAudG9TZXQoKTtcclxuXHJcbiAgICBjb25zdCB1bmtub3duR3VpbGRzID0gZ3VpbGRDbGFpbXNcclxuICAgICAgICAuc3VidHJhY3Qoa25vd25HdWlsZHMpO1xyXG5cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ3VpbGRDbGFpbXMnLCBndWlsZENsYWltcy50b0FycmF5KCkpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2tub3duR3VpbGRzJywga25vd25HdWlsZHMudG9BcnJheSgpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd1bmtub3duR3VpbGRzJywgdW5rbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cclxuICAgIHJldHVybiB1bmtub3duR3VpbGRzO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGliR3VpbGRzO1xyXG4iXX0=
