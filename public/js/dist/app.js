(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';
require('babel/polyfill');

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var page = (typeof window !== "undefined" ? window.page : typeof global !== "undefined" ? global.page : null);

var STATIC = require('./lib/static');

/*
*	React Components
*/

var Langs = require('./common/Langs');
var Overview = require('./Overview');
var Tracker = require('./Tracker');

/*
*
*	DOM Ready
*
*/

$(function () {
	attachRoutes();
	setImmediate(eml);
});

/*
*
*	Routes
*
*/

function attachRoutes() {
	var domMounts = {
		navLangs: document.getElementById('nav-langs'),
		content: document.getElementById('content') };

	page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', function (ctx) {
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
	page('/', redirectPage.bind(null, '/en'));

	page.start({
		click: true,
		popstate: true,
		dispatch: true,
		hashbang: false,
		decodeURLComponents: true });
}

/*
*
*	Util
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

},{"./Overview":96,"./Tracker":121,"./common/Langs":127,"./lib/static":130,"babel/polyfill":74}],2:[function(require,module,exports){
(function (global){
"use strict";

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;

require("core-js/shim");

require("regenerator-babel/runtime");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":71,"regenerator-babel/runtime":72}],3:[function(require,module,exports){
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
},{"./$":16}],4:[function(require,module,exports){
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
},{"./$":16,"./$.ctx":11}],5:[function(require,module,exports){
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
},{"./$":16}],6:[function(require,module,exports){
var $ = require('./$');
// 19.1.2.1 Object.assign(target, source, ...)
module.exports = Object.assign || function(target, source){ // eslint-disable-line no-unused-vars
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
},{"./$":16}],7:[function(require,module,exports){
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
},{"./$":16,"./$.wks":27}],8:[function(require,module,exports){
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
      clear: function(){
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
      forEach: function(callbackfn /*, that = undefined */){
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
      has: function(key){
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
},{"./$":16,"./$.assert":5,"./$.ctx":11,"./$.iter":15,"./$.uid":25}],9:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.iter').forOf
  , has       = $.has
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
        return has(key, WEAK) && has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function(key){
        if(!isObject(key))return false;
        if(isFrozen(key))return leakStore(this).has(key);
        return has(key, WEAK) && has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(isFrozen(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":16,"./$.array-methods":4,"./$.assert":5,"./$.iter":15,"./$.uid":25}],10:[function(require,module,exports){
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
    if($iter.fail(function(iter){
      new C(iter); // eslint-disable-line no-new
    }) || $iter.DANGER_CLOSING){
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
},{"./$":16,"./$.assert":5,"./$.cof":7,"./$.def":12,"./$.iter":15,"./$.species":22}],11:[function(require,module,exports){
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
},{"./$":16}],13:[function(require,module,exports){
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
var DANGER_CLOSING = true;
!function(){
  try {
    var iter = [1].keys();
    iter['return'] = function(){ DANGER_CLOSING = false; };
    Array.from(iter, function(){ throw 2; });
  } catch(e){ /* empty */ }
}();
var $iter = module.exports = {
  BUGGY: BUGGY,
  DANGER_CLOSING: DANGER_CLOSING,
  fail: function(exec){
    var fail = true;
    try {
      var arr  = [[{}, 1]]
        , iter = arr[SYMBOL_ITERATOR]()
        , next = iter.next;
      iter.next = function(){
        fail = false;
        return next.call(this);
      };
      arr[SYMBOL_ITERATOR] = function(){
        return iter;
      };
      exec(arr);
    } catch(e){ /* empty */ }
    return fail;
  },
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
},{"./$":16,"./$.assert":5,"./$.cof":7,"./$.ctx":11,"./$.def":12,"./$.wks":27}],16:[function(require,module,exports){
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
},{"./$.fw":13}],17:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":16}],18:[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function(it){
  assertObject(it);
  return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);
};
},{"./$":16,"./$.assert":5}],19:[function(require,module,exports){
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
},{"./$":16,"./$.assert":5,"./$.invoke":14}],20:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],21:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't works with null proto objects.
/*eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
module.exports = Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
  ? function(buggy, set){
      try {
        set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
        set({}, []);
      } catch(e){ buggy = true; }
      return function(O, proto){
        assert.obj(O);
        assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }()
  : undefined);
},{"./$":16,"./$.assert":5,"./$.ctx":11}],22:[function(require,module,exports){
var $ = require('./$');
module.exports = function(C){
  if($.DESC && $.FW)$.setDesc(C, require('./$.wks')('species'), {
    configurable: true,
    get: $.that
  });
};
},{"./$":16,"./$.wks":27}],23:[function(require,module,exports){
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
},{"./$":16}],24:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , global             = $.g
  , isFunction         = $.isFunction
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
  if(cof(global.process) == 'process'){
    defer = function(id){
      global.process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !$.g.importScripts){
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
  } else if($.g.document && ONREADYSTATECHANGE in document.createElement('script')){
    defer = function(id){
      $.html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function(){
        $.html.removeChild(this);
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
},{"./$":16,"./$.cof":7,"./$.ctx":11,"./$.invoke":14}],25:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":16}],26:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":16,"./$.wks":27}],27:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":16,"./$.uid":25}],28:[function(require,module,exports){
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
    , iframeDocument;
  iframe.style.display = 'none';
  $.html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script>');
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
},{"./$":16,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":12,"./$.invoke":14,"./$.replacer":20,"./$.uid":25}],29:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  copyWithin: function(target/* = 0 */, start /* = 0, end = @length */){
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
},{"./$":16,"./$.def":12,"./$.unscope":26}],30:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  fill: function(value /*, start = 0, end = @length */){
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
},{"./$":16,"./$.def":12,"./$.unscope":26}],31:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
  findIndex: require('./$.array-methods')(6)
});
require('./$.unscope')('findIndex');
},{"./$.array-methods":4,"./$.def":12,"./$.unscope":26}],32:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
  find: require('./$.array-methods')(5)
});
require('./$.unscope')('find');
},{"./$.array-methods":4,"./$.def":12,"./$.unscope":26}],33:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , stepCall = $iter.stepCall;
$def($def.S + $def.F * $iter.DANGER_CLOSING, 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
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
},{"./$":16,"./$.ctx":11,"./$.def":12,"./$.iter":15}],34:[function(require,module,exports){
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
},{"./$":16,"./$.iter":15,"./$.uid":25,"./$.unscope":26}],35:[function(require,module,exports){
var $def = require('./$.def');
$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function(/* ...args */){
    var index  = 0
      , length = arguments.length
      // strange IE quirks mode bug -> use typeof instead of isFunction
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":12}],36:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":22}],37:[function(require,module,exports){
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
},{"./$":16}],38:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', {
  // 23.1.3.6 Map.prototype.get(key)
  get: function(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":10,"./$.collection-strong":8}],39:[function(require,module,exports){
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
  , sign  = Math.sign || function(x){
      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
    };

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
  acosh: function(x){
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
  },
  // 20.2.2.5 Math.asinh(x)
  asinh: asinh,
  // 20.2.2.7 Math.atanh(x)
  atanh: function(x){
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  },
  // 20.2.2.9 Math.cbrt(x)
  cbrt: function(x){
    return sign(x = +x) * pow(abs(x), 1 / 3);
  },
  // 20.2.2.11 Math.clz32(x)
  clz32: function(x){
    return (x >>>= 0) ? 32 - x.toString(2).length : 32;
  },
  // 20.2.2.12 Math.cosh(x)
  cosh: function(x){
    return (exp(x = +x) + exp(-x)) / 2;
  },
  // 20.2.2.14 Math.expm1(x)
  expm1: expm1,
  // 20.2.2.16 Math.fround(x)
  // TODO: fallback for IE9-
  fround: function(x){
    return new Float32Array([x])[0];
  },
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
  hypot: function(value1, value2){ // eslint-disable-line no-unused-vars
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
  imul: function(x, y){
    var UInt16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UInt16 & xn
      , yl = UInt16 & yn;
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
  },
  // 20.2.2.20 Math.log1p(x)
  log1p: function(x){
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
  },
  // 20.2.2.21 Math.log10(x)
  log10: function(x){
    return log(x) / Math.LN10;
  },
  // 20.2.2.22 Math.log2(x)
  log2: function(x){
    return log(x) / Math.LN2;
  },
  // 20.2.2.28 Math.sign(x)
  sign: sign,
  // 20.2.2.30 Math.sinh(x)
  sinh: function(x){
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  },
  // 20.2.2.33 Math.tanh(x)
  tanh: function(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  },
  // 20.2.2.34 Math.trunc(x)
  trunc: function(it){
    return (it > 0 ? floor : ceil)(it);
  }
});
},{"./$.def":12}],40:[function(require,module,exports){
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
},{"./$":16}],41:[function(require,module,exports){
var $     = require('./$')
  , $def  = require('./$.def')
  , abs   = Math.abs
  , floor = Math.floor
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
function isInteger(it){
  return !$.isObject(it) && isFinite(it) && floor(it) === it;
}
$def($def.S, 'Number', {
  // 20.1.2.1 Number.EPSILON
  EPSILON: Math.pow(2, -52),
  // 20.1.2.2 Number.isFinite(number)
  isFinite: function(it){
    return typeof it == 'number' && isFinite(it);
  },
  // 20.1.2.3 Number.isInteger(number)
  isInteger: isInteger,
  // 20.1.2.4 Number.isNaN(number)
  isNaN: function(number){
    return number != number;
  },
  // 20.1.2.5 Number.isSafeInteger(number)
  isSafeInteger: function(number){
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
},{"./$":16,"./$.def":12}],42:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":12}],43:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: function(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
});
},{"./$.def":12}],44:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto')});
},{"./$.def":12,"./$.set-proto":21}],45:[function(require,module,exports){
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
  } : MODE == 4 ? function(it, key){
    return fn(toObject(it), key);
  } : MODE == 5 ? function(it){
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
},{"./$":16,"./$.def":12}],46:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var $   = require('./$')
  , cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function(){
  return '[object ' + cof.classof(this) + ']';
});
},{"./$":16,"./$.cof":7,"./$.wks":27}],47:[function(require,module,exports){
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
  , Promise = global[PROMISE]
  , Base    = Promise
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , test;
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
isFunction(Promise) && isFunction(Promise.resolve)
&& Promise.resolve(test = new Promise(function(){})) == test
|| function(){
  function isThenable(it){
    var then;
    if(isObject(it))then = it.then;
    return isFunction(then) ? then : false;
  }
  function handledRejectionOrHasOnRejected(promise){
    var record = promise[RECORD]
      , chain  = record.c
      , i      = 0
      , react;
    if(record.h)return true;
    while(chain.length > i){
      react = chain[i++];
      if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
    }
  }
  function notify(record, isReject){
    var chain = record.c;
    if(isReject || chain.length)asap(function(){
      var promise = record.p
        , value   = record.v
        , ok      = record.s == 1
        , i       = 0;
      if(isReject && !handledRejectionOrHasOnRejected(promise)){
        setTimeout(function(){
          if(!handledRejectionOrHasOnRejected(promise)){
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
  function reject(value){
    var record = this;
    if(record.d)return;
    record.d = true;
    record = record.r || record; // unwrap
    record.v = value;
    record.s = 2;
    notify(record, true);
  }
  function resolve(value){
    var record = this
      , then, wrapper;
    if(record.d)return;
    record.d = true;
    record = record.r || record; // unwrap
    try {
      if(then = isThenable(value)){
        wrapper = {r: record, d: false}; // wrap
        then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
      } else {
        record.v = value;
        record.s = 1;
        notify(record);
      }
    } catch(err){
      reject.call(wrapper || {r: record, d: false}, err); // wrap
    }
  }
  // 25.4.3.1 Promise(executor)
  Promise = function(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, Promise, PROMISE), // <- promise
      c: [],                                  // <- chain
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx(resolve, record, 1), ctx(reject, record, 1));
    } catch(err){
      reject.call(record, err);
    }
  };
  $.mix(Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var P = react.P = new (S != undefined ? S : Promise)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      record.s && notify(record);
      return P;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}();
$def($def.G + $def.W + $def.F * (Promise != Base), {Promise: Promise});
$def($def.S, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function(r){
    return new (getConstructor(this))(function(res, rej){
      rej(r);
    });
  },
  // 25.4.4.6 Promise.resolve(x)
  resolve: function(x){
    return isObject(x) && RECORD in x && $.getProto(x) === this.prototype
      ? x : new (getConstructor(this))(function(res){
        res(x);
      });
  }
});
$def($def.S + $def.F * ($iter.fail(function(iter){
  Promise.all(iter)['catch'](function(){});
}) || $iter.DANGER_CLOSING), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(resolve, reject){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function(iterable){
    var C = getConstructor(this);
    return new C(function(resolve, reject){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(resolve, reject);
      });
    });
  }
});
cof.set(Promise, PROMISE);
require('./$.species')(Promise);
},{"./$":16,"./$.assert":5,"./$.cof":7,"./$.ctx":11,"./$.def":12,"./$.iter":15,"./$.species":22,"./$.task":24,"./$.uid":25,"./$.wks":27}],48:[function(require,module,exports){
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
  , assertObject = assert.obj
  , isExtensible = Object.isExtensible || $.it;
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

function reflectGet(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc = getDesc(assertObject(target), propertyKey), proto;
  if(desc)return $.has(desc, 'value')
    ? desc.value
    : desc.get === undefined
      ? undefined
      : desc.get.call(receiver);
  return isObject(proto = getProto(target))
    ? reflectGet(proto, propertyKey, receiver)
    : undefined;
}
function reflectSet(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = getDesc(assertObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getProto(target))){
      return reflectSet(proto, propertyKey, V, receiver);
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
  construct: function(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: wrap(setDesc),
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function(target, propertyKey){
    var desc = getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function(target){
    return new Enumerate(assertObject(target));
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: reflectGet,
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function(target, propertyKey){
    return getDesc(assertObject(target), propertyKey);
  },
  // 26.1.8 Reflect.getPrototypeOf(target)
  getPrototypeOf: function(target){
    return getProto(assertObject(target));
  },
  // 26.1.9 Reflect.has(target, propertyKey)
  has: function(target, propertyKey){
    return propertyKey in target;
  },
  // 26.1.10 Reflect.isExtensible(target)
  isExtensible: function(target){
    return !!isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: wrap(Object.preventExtensions || $.it),
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: reflectSet
};
// 26.1.14 Reflect.setPrototypeOf(target, proto)
if(setProto)reflect.setPrototypeOf = function(target, proto){
  setProto(assertObject(target), proto);
  return true;
};

$def($def.G, {Reflect: {}});
$def($def.S, 'Reflect', reflect);
},{"./$":16,"./$.assert":5,"./$.ctx":11,"./$.def":12,"./$.iter":15,"./$.own-keys":18,"./$.set-proto":21,"./$.uid":25}],49:[function(require,module,exports){
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
},{"./$":16,"./$.cof":7,"./$.replacer":20,"./$.species":22}],50:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":10,"./$.collection-strong":8}],51:[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: require('./$.string-at')(false)
});
},{"./$.def":12,"./$.string-at":23}],52:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

$def($def.P, 'String', {
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
  endsWith: function(searchString /*, endPosition = @length */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that = String($.assertDefined(this))
      , endPosition = arguments[1]
      , len = toLength(that.length)
      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    searchString += '';
    return that.slice(end - searchString.length, end) === searchString;
  }
});
},{"./$":16,"./$.cof":7,"./$.def":12}],53:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode;

$def($def.S, 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function(x){ // eslint-disable-line no-unused-vars
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
},{"./$":16,"./$.def":12}],54:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
  includes: function(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
  }
});
},{"./$":16,"./$.cof":7,"./$.def":12}],55:[function(require,module,exports){
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
},{"./$":16,"./$.iter":15,"./$.string-at":23,"./$.uid":25}],56:[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function(callSite){
    var raw = $.toObject(callSite.raw)
      , len = $.toLength(raw.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(raw[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$":16,"./$.def":12}],57:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: function(count){
    var str = String($.assertDefined(this))
      , res = ''
      , n   = $.toInteger(count);
    if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
    for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
    return res;
  }
});
},{"./$":16,"./$.def":12}],58:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":16,"./$.cof":7,"./$.def":12}],59:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
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
  Symbol = function(description){
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
  keyFor: require('./$.partial').call(require('./$.keyof'), SymbolRegistry, 0),
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
  getOwnPropertyNames: function(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
    return result;
  },
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: function(it){
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
},{"./$":16,"./$.cof":7,"./$.def":12,"./$.keyof":17,"./$.partial":19,"./$.uid":25,"./$.wks":27}],60:[function(require,module,exports){
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
  get: function(key){
    if(isObject(key)){
      if(isFrozen(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function(key, value){
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
},{"./$":16,"./$.collection":10,"./$.collection-weak":9}],61:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":10,"./$.collection-weak":9}],62:[function(require,module,exports){
// https://github.com/domenic/Array.prototype.includes
var $def = require('./$.def');
$def($def.P, 'Array', {
  includes: require('./$.array-includes')(true)
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":12,"./$.unscope":26}],63:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function(object){
    var O      = $.toObject(object)
      , result = {};
    $.each.call(ownKeys(O), function(key){
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
    });
    return result;
  }
});
},{"./$":16,"./$.def":12,"./$.own-keys":18}],64:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $    = require('./$')
  , $def = require('./$.def');
function createObjectToArray(isEntries){
  return function(object){
    var O      = $.toObject(object)
      , keys   = $.getKeys(object)
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
},{"./$":16,"./$.def":12}],65:[function(require,module,exports){
// https://gist.github.com/kangax/9698100
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
});
},{"./$.def":12,"./$.replacer":20}],66:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
var $def = require('./$.def');
$def($def.P, 'String', {
  at: require('./$.string-at')(true)
});
},{"./$.def":12,"./$.string-at":23}],67:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , core    = $.core
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in core.Array)statics[key] = core.Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill,turn');
$def($def.S, 'Array', statics);
},{"./$":16,"./$.ctx":11,"./$.def":12}],68:[function(require,module,exports){
require('./es6.array.iterator');
var $         = require('./$')
  , Iterators = require('./$.iter').Iterators
  , ITERATOR  = require('./$.wks')('iterator')
  , NodeList  = $.g.NodeList;
if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
  $.hide(NodeList.prototype, ITERATOR, Iterators.Array);
}
Iterators.NodeList = Iterators.Array;
},{"./$":16,"./$.iter":15,"./$.wks":27,"./es6.array.iterator":34}],69:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":12,"./$.task":24}],70:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var $       = require('./$')
  , $def    = require('./$.def')
  , invoke  = require('./$.invoke')
  , partial = require('./$.partial')
  , MSIE    = !!$.g.navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
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
  setTimeout:  wrap(setTimeout),
  setInterval: wrap(setInterval)
});
},{"./$":16,"./$.def":12,"./$.invoke":14,"./$.partial":19}],71:[function(require,module,exports){
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
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;
},{"./modules/$":16,"./modules/es5":28,"./modules/es6.array.copy-within":29,"./modules/es6.array.fill":30,"./modules/es6.array.find":32,"./modules/es6.array.find-index":31,"./modules/es6.array.from":33,"./modules/es6.array.iterator":34,"./modules/es6.array.of":35,"./modules/es6.array.species":36,"./modules/es6.function.name":37,"./modules/es6.map":38,"./modules/es6.math":39,"./modules/es6.number.constructor":40,"./modules/es6.number.statics":41,"./modules/es6.object.assign":42,"./modules/es6.object.is":43,"./modules/es6.object.set-prototype-of":44,"./modules/es6.object.statics-accept-primitives":45,"./modules/es6.object.to-string":46,"./modules/es6.promise":47,"./modules/es6.reflect":48,"./modules/es6.regexp":49,"./modules/es6.set":50,"./modules/es6.string.code-point-at":51,"./modules/es6.string.ends-with":52,"./modules/es6.string.from-code-point":53,"./modules/es6.string.includes":54,"./modules/es6.string.iterator":55,"./modules/es6.string.raw":56,"./modules/es6.string.repeat":57,"./modules/es6.string.starts-with":58,"./modules/es6.symbol":59,"./modules/es6.weak-map":60,"./modules/es6.weak-set":61,"./modules/es7.array.includes":62,"./modules/es7.object.get-own-property-descriptors":63,"./modules/es7.object.to-array":64,"./modules/es7.regexp.escape":65,"./modules/es7.string.at":66,"./modules/js.array.statics":67,"./modules/web.dom.iterable":68,"./modules/web.immediate":69,"./modules/web.timers":70}],72:[function(require,module,exports){
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
    return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
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
      var callNext = step.bind(generator.next);
      var callThrow = step.bind(generator["throw"]);

      function step(arg) {
        var record = tryCatch(this, null, arg);
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

  function Generator(innerFn, outerFn, self, tryLocsList) {
    var generator = outerFn ? Object.create(outerFn.prototype) : this;
    var context = new Context(tryLocsList);
    var state = GenStateSuspendedStart;

    function invoke(method, arg) {
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
          if (state === GenStateSuspendedStart &&
              typeof arg !== "undefined") {
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            throw new TypeError(
              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
            );
          }

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

          if (method === "next") {
            context.dispatchException(record.arg);
          } else {
            arg = record.arg;
          }
        }
      }
    }

    generator.next = invoke.bind(generator, "next");
    generator["throw"] = invoke.bind(generator, "throw");
    generator["return"] = invoke.bind(generator, "return");

    return generator;
  }

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
          arg < finallyEntry.finallyLoc) {
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
  typeof window === "object" ? window : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],73:[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":2}],74:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":73}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":75,"./encode":76}],78:[function(require,module,exports){
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


},{"querystring":77,"superagent":79}],79:[function(require,module,exports){
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

},{"emitter":80,"reduce":81}],80:[function(require,module,exports){

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

},{}],81:[function(require,module,exports){

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
},{}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":82,"./data/objective_labels":83,"./data/objective_map":84,"./data/objective_meta":85,"./data/objective_names":86,"./data/objective_types":87,"./data/world_names":88}],90:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var MatchWorld = require('./MatchWorld');

/*
*
*	Component Export
*
*/

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
*	Class Properties
*/

Match.propTypes = {
	match: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Match;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./MatchWorld":91}],91:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Score = require('./Score');
var Pie = require('./../../common/Icons/Pie');

/*
*
*	Component Export
*
*/

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
*	Class Properties
*/

MatchWorld.propTypes = {
	world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	scores: React.PropTypes.instanceOf(Immutable.List).isRequired,
	color: React.PropTypes.string.isRequired,
	ixColor: React.PropTypes.number.isRequired,
	showPie: React.PropTypes.bool.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MatchWorld;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Pie":124,"./Score":92}],92:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
*
*	Component Definition
*
*/

var Score = (function (_React$Component) {
	function Score(props) {
		_classCallCheck(this, Score);

		_get(Object.getPrototypeOf(Score.prototype), 'constructor', this).call(this, props);
		this.state = { diff: 0 };
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
				animateScoreDiff(this.refs.diff.getDOMNode());
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var state = this.state;

			return React.createElement(
				'div',
				null,
				React.createElement(
					'span',
					{ className: 'diff', ref: 'diff' },
					getDiffText(state.diff)
				),
				React.createElement(
					'span',
					{ className: 'value' },
					getScoreText(props.score)
				)
			);
		}
	}]);

	return Score;
})(React.Component);

/*
*	Class Properties
*/

Score.propTypes = {
	score: React.PropTypes.number.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Score;

/*
*
*	Private Methods
*
*/

function animateScoreDiff(el) {
	$(el).velocity('fadeOut', { duration: 0 }).velocity('fadeIn', { duration: 200 }).velocity('fadeOut', { duration: 1200, delay: 400 });
}

function getDiffText(diff) {
	return diff ? numeral(diff).format('+0,0') : null;
}

function getScoreText(score) {
	return score ? numeral(score).format('0,0') : null;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],93:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Match = require('./Match');

/*
*	Component Globals
*/

var loadingHtml = React.createElement(
	'span',
	{ style: { paddingLeft: '.5em' } },
	React.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Matches.propTypes = {
	region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	matches: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Matches;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Match":90}],94:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*
*	Component Definition
*
*/

var RegionWorldsWorld = (function (_React$Component) {
	function RegionWorldsWorld() {
		_classCallCheck(this, RegionWorldsWorld);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	}

	_inherits(RegionWorldsWorld, _React$Component);

	_createClass(RegionWorldsWorld, [{
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

			// console.log('RegionWorldsWorld::render', props.world.toJS());

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

	return RegionWorldsWorld;
})(React.Component);

/*
*	Class Properties
*/

RegionWorldsWorld.propTypes = {
	world: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = RegionWorldsWorld;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],95:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var World = require('./World');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Worlds.propTypes = {
	region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Worlds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./World":94}],96:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var api = require('./../lib/api');
var STATIC = require('./../lib/static');

/*
*	React Components
*/

var Matches = require('./Matches');
var Worlds = require('./Worlds');

/*
*
*	Component Definition
*
*/

var Overview = (function (_React$Component) {
	function Overview(props) {
		_classCallCheck(this, Overview);

		_get(Object.getPrototypeOf(Overview.prototype), 'constructor', this).call(this, props);

		this.mounted = true;
		this.timeouts = {};

		this.state = {
			regions: Immutable.fromJS({
				'1': { label: 'NA', id: '1' },
				'2': { label: 'EU', id: '2' } }),

			matchesByRegion: Immutable.fromJS({ '1': {}, '2': {} }),
			worldsByRegion: Immutable.fromJS({ '1': {}, '2': {} }) };
	}

	_inherits(Overview, _React$Component);

	_createClass(Overview, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var props = this.props;
			var state = this.state;

			var newLang = !Immutable.is(props.lang, nextProps.lang);
			var newMatchData = !Immutable.is(state.matchesByRegion, nextState.matchesByRegion);
			var shouldUpdate = newLang || newMatchData;

			// console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

			return shouldUpdate;
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			setPageTitle.call(this, this.props.lang);
			setWorlds.call(this, this.props.lang);

			getData.call(this);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			setPageTitle.call(this, nextProps.lang);
			setWorlds.call(this, nextProps.lang);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.mounted = false;
			clearTimeout(this.timeouts.matchData);
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var state = this.state;

			// console.log('overview::render()');
			// console.log('overview::render()', 'lang', props.lang.toJS());
			// console.log('overview::render()', 'regions', state.regions.toJS());
			// console.log('overview::render()', 'matchesByRegion', state.matchesByRegion.toJS());
			// console.log('overview::render()', 'worldsByRegion', state.worldsByRegion.toJS());

			return React.createElement(
				'div',
				{ id: 'overview' },
				React.createElement(
					'div',
					{ className: 'row' },
					state.regions.map(function (region, regionId) {
						return React.createElement(
							'div',
							{ className: 'col-sm-12', key: regionId },
							React.createElement(Matches, {
								region: region,
								matches: state.matchesByRegion.get(regionId),
								worlds: state.worldsByRegion.get(regionId)
							})
						);
					})
				),
				React.createElement('hr', null),
				React.createElement(
					'div',
					{ className: 'row' },
					state.regions.map(function (region, regionId) {
						return React.createElement(
							'div',
							{ className: 'col-sm-12', key: regionId },
							React.createElement(Worlds, {
								region: region,
								worlds: state.worldsByRegion.get(regionId)
							})
						);
					})
				)
			);
		}
	}]);

	return Overview;
})(React.Component);

/*
*	Class Properties
*/

Overview.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Overview;

/*
*
*	Private Methods
*
*/

/*
*
*	Direct DOM Manipulation
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
*	Data
*
*/

/*
*	Data - Worlds
*/

function setWorlds(lang) {
	var self = this;

	var newWorldsByRegion = Immutable.Seq(STATIC.worlds).map(function (world) {
		return getWorldByLang(lang, world);
	}).sortBy(function (world) {
		return world.get('name');
	}).groupBy(function (world) {
		return world.get('region');
	});

	self.setState({ worldsByRegion: newWorldsByRegion });
}

function getWorldByLang(lang, world) {
	var langSlug = lang.get('slug');

	var worldByLang = world.get(langSlug);

	var region = world.get('region');
	var link = getWorldLink(langSlug, worldByLang);

	return worldByLang.merge({ link: link, region: region });
}

function getWorldLink(langSlug, world) {
	return ['', langSlug, world.get('slug')].join('/');
}

/*
*	Data - Matches
*/

function getData() {
	var self = this;
	// console.log('overview::getData()');

	api.getMatches(function (err, data) {
		var matchData = Immutable.fromJS(data);

		if (self.mounted) {
			if (!err && matchData && !matchData.isEmpty()) {
				self.setState(getMatchesByRegion.bind(self, matchData));
			}

			setDataTimeout.call(self);
		}
	});
}

function getMatchesByRegion(matchData, state) {
	var newMatchesByRegion = Immutable.Seq(matchData).groupBy(function (match) {
		return match.get('region').toString();
	});

	return { matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion) };
}

function setDataTimeout() {
	var self = this;

	self.timeouts.matchData = setTimeout(getData.bind(self), getInterval());
}

function getInterval() {
	return _.random(2000, 4000);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/api":128,"./../lib/static":130,"./Matches":93,"./Worlds":95}],97:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Objective = require('../Objectives');

/*
*	Component Globals
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
*	Component Definition
*
*/

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
			// console.log('Claims::shouldComponentUpdate()', shouldUpdate, this.props.guild.get('guild_id'));

			return shouldUpdate;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var guildId = this.props.guild.get('guild_id');
			var claims = this.props.guild.get('claims');

			// console.log('Claims::render()', guildId);

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
*	Class Properties
*/

GuildClaims.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guild: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = GuildClaims;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Objectives":116}],98:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Emblem = require('./../../common/Icons/Emblem');
var Claims = require('./Claims');

/*
*	Component Globals
*/

var loadingHtml = React.createElement(
	'h1',
	{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
	React.createElement('i', { className: 'fa fa-spinner fa-spin' }),
	' Loading...'
);

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Guild.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guild: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Guild;

function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Emblem":123,"./Claims":97}],99:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Guild = require('./Guild');

/*
*
*	Component Definition
*
*/

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

		// constructor() {}
		// componentDidMount() {}

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
*	Class Properties
*/

Guilds.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Guilds;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Guild":98}],100:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('gw2w2w-static');

/*
*	React Components
*/

var Objective = require('../Objectives');

/*
*	Component Globals
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
*	Component Definition
*
*/

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

			var newFilters = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

			var shouldUpdate = newLang || newGuild || newEntry || newFilters;

			// console.log('Entry:render()', {newTriggerState, newFilters, shouldUpdate});

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
*	Class Properties
*/

Entry.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	entry: React.PropTypes.instanceOf(Immutable.Map).isRequired,

	guild: React.PropTypes.instanceOf(Immutable.Map),

	mapFilter: React.PropTypes.string.isRequired,
	eventFilter: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Entry;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Objectives":116,"gw2w2w-static":89}],101:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('gw2w2w-static');

/*
*	React Components
*/

/*
*
*	Component Definition
*
*/

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
			var props = this.props;

			return React.createElement(
				'ul',
				{ id: 'log-event-filters', className: 'nav nav-pills' },
				React.createElement(
					'li',
					{ className: props.eventFilter === 'claim' ? 'active' : null },
					React.createElement(
						'a',
						{ onClick: props.setEvent, 'data-filter': 'claim' },
						'Claims'
					)
				),
				React.createElement(
					'li',
					{ className: props.eventFilter === 'capture' ? 'active' : null },
					React.createElement(
						'a',
						{ onClick: props.setEvent, 'data-filter': 'capture' },
						'Captures'
					)
				),
				React.createElement(
					'li',
					{ className: props.eventFilter === 'all' ? 'active' : null },
					React.createElement(
						'a',
						{ onClick: props.setEvent, 'data-filter': 'all' },
						'All'
					)
				)
			);
		}
	}]);

	return MapFilters;
})(React.Component);

/*
*	Class Properties
*/

MapFilters.propTypes = {
	eventFilter: React.PropTypes.oneOf(['all', 'capture', 'claim']).isRequired,
	setEvent: React.PropTypes.func.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapFilters;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":89}],102:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('gw2w2w-static');

/*
*	React Components
*/

var Entry = require('./Entry');

/*
*
*	Component Definition
*
*/

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

		// componentDidUpdate() {
		// 	$(React.findDOMNode(this))
		// 		.children('li')
		// 			.filter('.show-entry')
		// 				.each((ixRow, el) => (ixRow % 2) ? $(el).addClass('to-alt') : null)
		// 			.end()
		// 			.filter('.alt:not(.to-alt)')
		// 				.removeClass('alt')
		// 			.end()
		// 			.filter('.to-alt')
		// 				.addClass('alt')
		// 				.removeClass('to-alt')
		// 			.end()
		// 		.end();
		// }

	}]);

	return LogEntries;
})(React.Component);

/*
*	Class Properties
*/

LogEntries.defaultProps = {
	guilds: {} };

LogEntries.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,

	triggerNotification: React.PropTypes.bool.isRequired,
	mapFilter: React.PropTypes.string.isRequired,
	eventFilter: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = LogEntries;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Entry":100,"gw2w2w-static":89}],103:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('gw2w2w-static');

/*
*	React Components
*/

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

MapFilters.propTypes = {
	mapFilter: React.PropTypes.string.isRequired,
	setWorld: React.PropTypes.func.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapFilters;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":89}],104:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('gw2w2w-static');

/*
*	React Components
*/

var MapFilters = require('./MapFilters');
var EventFilters = require('./EventFilters');
var LogEntries = require('./LogEntries');

/*
*
*	Component Definition
*
*/

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
			var component = this;
			var props = this.props;
			var state = this.state;

			// console.log('Log::render()', state.mapFilter, state.eventFilter, state.triggerNotification);

			var eventHistory = props.details.get('history');

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
								mapFilter: state.mapFilter,
								setWorld: setWorld.bind(component)
							})
						),
						React.createElement(
							'div',
							{ className: 'col-sm-8' },
							React.createElement(EventFilters, {
								eventFilter: state.eventFilter,
								setEvent: setEvent.bind(component)
							})
						)
					)
				),
				!eventHistory.isEmpty() ? React.createElement(LogEntries, {
					triggerNotification: state.triggerNotification,
					mapFilter: state.mapFilter,
					eventFilter: state.eventFilter,

					lang: props.lang,
					guilds: props.guilds,

					eventHistory: eventHistory
				}) : null
			);
		}
	}]);

	return Log;
})(React.Component);

/*
*	Class Properties
*/

Log.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Log;

/*
*
*	Private Methods
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./EventFilters":101,"./LogEntries":102,"./MapFilters":103,"gw2w2w-static":89}],105:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);

var STATIC = require('./../../lib/static');

/*
*	React Components
*/

var MapScores = require('./MapScores');
var MapSection = require('./MapSection');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

MapDetails.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapDetails;

/*
*
*	Private Methods
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":130,"./MapScores":106,"./MapSection":107}],106:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
*	React Components
*/

/*
*
*	Component Definition
*
*/

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
			var props = this.props;

			return React.createElement(
				'ul',
				{ className: 'list-inline' },
				props.scores.map(function (score, ixScore) {
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
*	Class Properties
*/

MapScores.propTypes = {
	scores: React.PropTypes.instanceOf(Immutable.List).isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapScores;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],107:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Objective = require('./../Objectives');

/*
*
*	Module Globals
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
*	Component Definition
*
*/

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

			// console.log('Tracker::Maps::MapSection:render()', mapObjectives, mapObjectives.toJS());

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
*	Class Properties
*/

MapSection.propTypes = {
	lang: React.PropTypes.object.isRequired,
	mapSection: React.PropTypes.object.isRequired,
	guilds: React.PropTypes.object.isRequired,
	details: React.PropTypes.object.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapSection;

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../Objectives":116}],108:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var MapDetails = require('./MapDetails');
var Log = require('./../Log');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Maps.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Maps;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../Log":104,"./MapDetails":105}],109:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var Emblem = require('./../../common/Icons/Emblem');

var _ref = React.createElement('i', { className: 'fa fa-spinner fa-spin' });

/*
*
*	Component Definition
*
*/

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

				// console.log('Guild:render()', id);

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
*	Class Properties
*/

Guild.propTypes = {
	showName: React.PropTypes.bool.isRequired,
	showTag: React.PropTypes.bool.isRequired,
	guildId: React.PropTypes.string,
	guild: React.PropTypes.instanceOf(Immutable.Map) };

/*
*
*	Export Module
*
*/

module.exports = Guild;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Emblem":123}],110:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('./../../lib/static');

/*
*	React Components
*/

var Sprite = require('./../../common/Icons/Sprite');
var Arrow = require('./../../common/Icons/Arrow');

/*
*
*	Component Definition
*
*/

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
				var objectiveTypeId = oMeta.get('type').toString();
				var oType = STATIC.objective_types.get(objectiveTypeId);

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
*	Class Properties
*/

Icons.propTypes = {
	showArrow: React.PropTypes.bool.isRequired,
	showSprite: React.PropTypes.bool.isRequired,
	objectiveId: React.PropTypes.string.isRequired,
	color: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Icons;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Arrow":122,"./../../common/Icons/Sprite":125,"./../../lib/static":130}],111:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var STATIC = require('./../../lib/static');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Label.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	isEnabled: React.PropTypes.bool.isRequired,
	objectiveId: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Label;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":130}],112:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var STATIC = require('./../../lib/static');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

MapName.propTypes = {
	isEnabled: React.PropTypes.bool.isRequired,
	objectiveId: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapName;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":130}],113:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*
*	Component Definition
*
*/

var TimeCountdown = (function (_React$Component) {
	function TimeCountdown() {
		_classCallCheck(this, TimeCountdown);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	}

	_inherits(TimeCountdown, _React$Component);

	_createClass(TimeCountdown, [{
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
					React.createElement('i', { className: 'fa fa-spinner fa-spin' })
				);
			}
		}
	}]);

	return TimeCountdown;
})(React.Component);

/*
*	Class Properties
*/

TimeCountdown.propTypes = {
	isEnabled: React.PropTypes.bool.isRequired,
	timestamp: React.PropTypes.number.isRequired };

/*
*
*	Export Module
*
*/

module.exports = TimeCountdown;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],114:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

TimerRelative.propTypes = {
	isEnabled: React.PropTypes.bool.isRequired,
	timestamp: React.PropTypes.number.isRequired };

/*
*
*	Export Module
*
*/

module.exports = TimerRelative;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],115:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Timestamp.propTypes = {
	isEnabled: React.PropTypes.bool.isRequired,
	timestamp: React.PropTypes.number.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Timestamp;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],116:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require('./../../lib/static');

/*
*	React Components
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
*	Module Globals
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
*	Component Definition
*
*/

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
*	Class Properties
*/

Objective.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

	objectiveId: React.PropTypes.number.isRequired,
	worldColor: React.PropTypes.string.isRequired,
	timestamp: React.PropTypes.number.isRequired,
	eventType: React.PropTypes.string,

	guildId: React.PropTypes.string,
	guild: React.PropTypes.instanceOf(Immutable.Map),

	cols: React.PropTypes.object };

/*
*
*	Export Module
*
*/

module.exports = Objective;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":130,"./Guild":109,"./Icons":110,"./Label":111,"./MapName":112,"./TimerCountdown":113,"./TimerRelative":114,"./Timestamp":115}],117:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('./../../../lib/static');

/*
*	React Components
*/

var Sprite = require('./../../../common/Icons/Sprite');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

HoldingsItem.propTypes = {
	color: React.PropTypes.string.isRequired,
	typeQuantity: React.PropTypes.number.isRequired,
	typeId: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = HoldingsItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../../common/Icons/Sprite":125,"./../../../lib/static":130}],118:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var Item = require('./Item');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Holdings.propTypes = {
	color: React.PropTypes.string.isRequired,
	holdings: React.PropTypes.instanceOf(Immutable.List).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Holdings;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Item":117}],119:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

/*
*	Component Globals
*/

var loadingHtml = React.createElement(
	'h1',
	{ style: { height: '90px', fontSize: '32pt', lineHeight: '90px' } },
	React.createElement('i', { className: 'fa fa-spinner fa-spin' })
);

/*
*	React Components
*/

var Holdings = require('./Holdings');

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

World.propTypes = {
	world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	score: React.PropTypes.number.isRequired,
	tick: React.PropTypes.number.isRequired,
	holdings: React.PropTypes.instanceOf(Immutable.List).isRequired };

/*
*
*	Export Module
*
*/

module.exports = World;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Holdings":118}],120:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	React Components
*/

var World = require('./World');

/*
*
*	Component Definition
*
*/

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
			// console.log('Scoreboard::Worlds::render()');

			var scores = this.props.match.get('scores');
			var ticks = this.props.match.get('ticks');
			var holdings = this.props.match.get('holdings');

			return React.createElement(
				'section',
				{ className: 'row', id: 'scoreboards' },
				this.props.matchWorlds.toSeq().map(function (world, ixWorld) {
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
*	Class Properties
*/

Scoreboard.propTypes = {
	matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
	match: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Scoreboard;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./World":119}],121:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

var api = require('./../lib/api.js');
var libDate = require('./../lib/date.js');
var trackerTimers = require('./../lib/trackerTimers');

var GuildsLib = require('./../lib/tracker/guilds.js');

var STATIC = require('./../lib/static');

/*
*	React Components
*/

var Scoreboard = require('./Scoreboard');
var Maps = require('./Maps');
var Guilds = require('./Guilds');

/*
*
*	Component Export
*
*/

var Tracker = (function (_React$Component) {
	function Tracker(props) {
		_classCallCheck(this, Tracker);

		_get(Object.getPrototypeOf(Tracker.prototype), 'constructor', this).call(this, props);

		this.state = {
			hasData: false,

			dateNow: libDate.dateNow(),
			lastmod: 0,
			timeOffset: 0,

			match: Immutable.Map({ lastmod: 0 }),
			matchWorlds: Immutable.List(),
			details: Immutable.Map(),
			claimEvents: Immutable.List(),
			guilds: Immutable.Map() };

		this.mounted = true;

		this.intervals = {
			timers: null
		};
		this.timeouts = {
			data: null
		};

		this.guildLib = new GuildsLib(this);
	}

	_inherits(Tracker, _React$Component);

	_createClass(Tracker, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var initialData = !_.isEqual(this.state.hasData, nextState.hasData);
			var newMatchData = !_.isEqual(this.state.lastmod, nextState.lastmod);

			var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
			var newLang = !Immutable.is(this.props.lang, nextProps.lang);

			var shouldUpdate = initialData || newMatchData || newGuildData || newLang;

			return shouldUpdate;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			console.log('Tracker::componentDidMount()');

			this.intervals.timers = setInterval(updateTimers.bind(this), 1000);
			setImmediate(updateTimers.bind(this));

			setImmediate(getMatchDetails.bind(this));
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			console.log('Tracker::componentWillUnmount()');

			clearTimers.call(this);

			this.mounted = false;
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var newLang = !Immutable.is(this.props.lang, nextProps.lang);

			console.log('componentWillReceiveProps()', newLang);

			if (newLang) {
				setMatchWorlds.call(this, nextProps.lang);
			}
		}
	}, {
		key: 'render',

		// componentWillUpdate() {
		// 	console.log('Tracker::componentWillUpdate()');
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
*	Class Properties
*/

Tracker.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Tracker;

/*
*
*	Private Methods
*
*/

/*
*	Timers
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
*	Match Details
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

				console.log('onMatchDetails', data.match.lastmod, isModified);

				if (isModified) {
					(function () {
						var dateNow = libDate.dateNow();
						var timeOffset = Math.floor(dateNow - data.now / 1000);

						var matchData = Immutable.fromJS(data.match);
						// console.log('onMatchDetails', 'match', Immutable.is(matchData, state.match));
						// console.log('onMatchDetails', match);

						var detailsData = Immutable.fromJS(data.details);
						// console.log('onMatchDetails', 'details', Immutable.is(detailsData, state.details));
						// console.log('onMatchDetails', details);

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
*	MatchWorlds
*
*/

function setMatchWorlds(lang) {
	var component = this;

	component.setState({ matchWorlds: Immutable.List(['red', 'blue', 'green']).map(getMatchWorld.bind(component, lang))
	});
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
*	Match Details
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/api.js":128,"./../lib/date.js":129,"./../lib/static":130,"./../lib/tracker/guilds.js":132,"./../lib/trackerTimers":131,"./Guilds":99,"./Maps":108,"./Scoreboard":120}],122:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Arrow.propTypes = {
	oMeta: React.PropTypes.object.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Arrow;

/*
*
*	Private Methods
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],123:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

/*
*
*	Component Globals
*
*/

var imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Emblem.defaultProps = {
	guildName: undefined,
	size: 256 };

Emblem.propTypes = {
	guildName: React.PropTypes.string,
	size: React.PropTypes.number.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Emblem;

/*
*
*	Private Methods
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],124:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*	Component Globals
*/

var INSTANCE = {
	size: 60,
	stroke: 2 };

/*
*
*	Component Definition
*
*/

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
*	Class Properties
*/

Pie.propTypes = {
	scores: React.PropTypes.instanceOf(Immutable.List).isRequired };

/*
*
*	Export Module
*
*/

module.exports = Pie;

/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	return 'http://www.piely.net/' + INSTANCE.size + '/' + scores.join(',') + '?strokeWidth=' + INSTANCE.stroke;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],125:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

/*
*
*	Component Definition
*
*/

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
			return !_.isEqual(this.props, nextProps);
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;

			return React.createElement('span', { className: 'sprite ' + props.type + ' ' + props.color });
		}
	}]);

	return Sprite;
})(React.Component);

/*
*	Class Properties
*/

Sprite.propTypes = {
	type: React.PropTypes.string.isRequired,
	color: React.PropTypes.string.isRequired };

/*
*
*	Export Module
*
*/

module.exports = Sprite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],126:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

/*
*
*	Exported Component
*
*/

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
			var props = this.props;

			var isActive = Immutable.is(props.lang, props.linkLang);
			var title = props.linkLang.get('name');
			var label = props.linkLang.get('label');
			var link = getLink(props.linkLang, props.world);

			return React.createElement(
				'li',
				{ className: isActive ? 'active' : '', title: title },
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
*	Class Properties
*/

LangLink.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world: React.PropTypes.instanceOf(Immutable.Map),
	linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired };

/*
*
*	Export Module
*
*/

module.exports = LangLink;

/*
*
*	Private Methods
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],127:[function(require,module,exports){
(function (global){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require('./../../lib/static');

/*
*	React Components
*/

var LangLink = require('./LangLink');

/*
*
*	Exported Component
*
*/

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
				STATIC.langs.toSeq().map(function (linkLang, key) {
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
*	Class Properties
*/

Langs.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world: React.PropTypes.instanceOf(Immutable.Map) };

/*
*
*	Export Module
*
*/

module.exports = Langs;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":130,"./LangLink":126}],128:[function(require,module,exports){
'use strict';

var gw2api = require('gw2api');

module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	// getMatchDetails: getMatchDetails,
	getMatchDetailsByWorld: getMatchDetailsByWorld };

function getMatches(callback) {
	gw2api.getMatchesState(callback);
}

function getGuildDetails(guildId, callback) {
	gw2api.getGuildDetails({ guild_id: guildId }, callback);
}

function getMatchDetails(matchId, callback) {
	gw2api.getMatchDetailsState({ match_id: matchId }, callback);
}

function getMatchDetailsByWorld(worldSlug, callback) {
	// setTimeout(
	// 	gw2api.getMatchDetailsState.bind(null, {world_slug: worldSlug}, callback),
	// 	3000
	// );
	gw2api.getMatchDetailsState({ world_slug: worldSlug }, callback);
}

},{"gw2api":78}],129:[function(require,module,exports){
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

	return _baseDate + 5 * 60;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],130:[function(require,module,exports){
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

},{"gw2w2w-static":89}],131:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

module.exports = { update: update };

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],132:[function(require,module,exports){
(function (global){

'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/*
*
*	Dependencies
*
*/

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

var api = require('./../api.js');

/*
*
*	Module Globals
*
*/

var guildDefault = Immutable.Map({
	loaded: false,
	lastClaim: 0,
	claims: Immutable.Map() });

var numQueueConcurrent = 4;

/*
*
*	Public Methods
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
				console.log('guilds::onMatchData()', 'has update');
				this.component.setState({ guilds: newGuilds });
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
*	Export Module
*
*/

module.exports = LibGuilds;

/*
*
*	Private Methods
*
*/

function onGuildData(onComplete, err, data) {
	var component = this.component;
	var state = component.state;

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
	var hasClaims = !guild.get('claims').isEmpty();
	var newestClaim = hasClaims ? guild.get('claims').first() : null;

	var incClaims = claimEvents.filter(function (entry) {
		return entry.get('guild') === guildId;
	}).toMap();

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
			var _guild = guildDefault.set('guild_id', guildId);
			guilds = guilds.set(guildId, _guild);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api.js":128}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24td2Vhay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pbnZva2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnBhcnRpYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnJlcGxhY2VyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC53a3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5zdGFydHMtd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuYXJyYXkuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnJlZ2V4cC5lc2NhcGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLmF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvanMuYXJyYXkuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuaW1tZWRpYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLnRpbWVycy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1iYWJlbC9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL21haW4uanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9jb21wb25lbnQtZW1pdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbm9kZV9tb2R1bGVzL3JlZHVjZS1jb21wb25lbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL2xhbmdzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbGFiZWxzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbWFwLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX25hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfdHlwZXMuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL01hdGNoLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaFdvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9TY29yZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9Xb3JsZHMvV29ybGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9Xb3JsZHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL0NsYWltcy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL0d1aWxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9HdWlsZHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FbnRyeS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL0V2ZW50RmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL0xvZ0VudHJpZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9NYXBGaWx0ZXJzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwRGV0YWlscy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9NYXBTY29yZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2VjdGlvbi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9JY29ucy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9MYWJlbC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9NYXBOYW1lLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVyQ291bnRkb3duLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVyUmVsYXRpdmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvVGltZXN0YW1wLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL0l0ZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvSG9sZGluZ3MvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvV29ybGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL0Fycm93LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL0VtYmxlbS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9QaWUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvU3ByaXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0xhbmdzL0xhbmdMaW5rLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0xhbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2FwaS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3N0YXRpYy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi90cmFja2VyVGltZXJzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3RyYWNrZXIvZ3VpbGRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLFlBQVksQ0FBQztBQUNiLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7OztBQVExQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7Ozs7QUFRckMsSUFB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QUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUUsRUFBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxFQUFFLEVBQUs7QUFDaEMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FDaEIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksY0FBWSxJQUFJLEFBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FDOUMsQ0FBQztFQUNGLENBQUMsQ0FBQztDQUNIOzs7Ozs7QUNoSUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDemhCQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LE9BQU8sQ0FBQztFQUFBLENBQUMsQ0FDaEMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSx3QkFBd0IsR0FBRyxXQUFXLENBQzFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztFQUFBLENBQUMsQ0FDaEMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSxXQUFXLEdBQUcsdUJBQXVCLENBQ3pDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUdsQyxLQUFNLFdBQVcsR0FBRyxXQUFXLENBQzdCLEdBQUcsQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztFQUFBLENBQUMsQ0FDbkMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSxhQUFhLEdBQUcsV0FBVyxDQUMvQixRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7OztBQU94QixRQUFPLGFBQWEsQ0FBQztDQUNyQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IHBhZ2UgPSByZXF1aXJlKCdwYWdlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IExhbmdzID0gcmVxdWlyZSgnY29tbW9uL0xhbmdzJyk7XHJcbmNvbnN0IE92ZXJ2aWV3ID0gcmVxdWlyZSgnT3ZlcnZpZXcnKTtcclxuY29uc3QgVHJhY2tlciA9IHJlcXVpcmUoJ1RyYWNrZXInKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERPTSBSZWFkeVxyXG4qXHJcbiovXHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdGF0dGFjaFJvdXRlcygpO1xyXG5cdHNldEltbWVkaWF0ZShlbWwpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRSb3V0ZXNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYXR0YWNoUm91dGVzKCkge1xyXG5cdGNvbnN0IGRvbU1vdW50cyA9IHtcclxuXHRcdG5hdkxhbmdzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWxhbmdzJyksXHJcblx0XHRjb250ZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxyXG5cdH07XHJcblxyXG5cclxuXHRwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIGZ1bmN0aW9uKGN0eCkge1xyXG5cdFx0Y29uc3QgbGFuZ1NsdWcgPSBjdHgucGFyYW1zLmxhbmdTbHVnO1xyXG5cdFx0Y29uc3QgbGFuZyA9IFNUQVRJQy5sYW5ncy5nZXQobGFuZ1NsdWcpO1xyXG5cclxuXHJcblx0XHRjb25zdCB3b3JsZFNsdWcgPSBjdHgucGFyYW1zLndvcmxkU2x1ZztcclxuXHRcdGNvbnN0IHdvcmxkID0gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcblxyXG5cdFx0bGV0IEFwcCA9IE92ZXJ2aWV3O1xyXG5cdFx0bGV0IHByb3BzID0ge2xhbmd9O1xyXG5cclxuXHRcdGlmICh3b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkKSAmJiAhd29ybGQuaXNFbXB0eSgpKSB7XHJcblx0XHRcdEFwcCA9IFRyYWNrZXI7XHJcblx0XHRcdHByb3BzLndvcmxkID0gd29ybGQ7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdFJlYWN0LnJlbmRlcig8TGFuZ3Mgey4uLnByb3BzfSAvPiwgZG9tTW91bnRzLm5hdkxhbmdzKTtcclxuXHRcdFJlYWN0LnJlbmRlcig8QXBwIHsuLi5wcm9wc30gLz4sIGRvbU1vdW50cy5jb250ZW50KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyByZWRpcmVjdCAnLycgdG8gJy9lbidcclxuXHRwYWdlKCcvJywgcmVkaXJlY3RQYWdlLmJpbmQobnVsbCwgJy9lbicpKTtcclxuXHJcblxyXG5cclxuXHJcblx0cGFnZS5zdGFydCh7XHJcblx0XHRjbGljazogdHJ1ZSxcclxuXHRcdHBvcHN0YXRlOiB0cnVlLFxyXG5cdFx0ZGlzcGF0Y2g6IHRydWUsXHJcblx0XHRoYXNoYmFuZzogZmFsc2UsXHJcblx0XHRkZWNvZGVVUkxDb21wb25lbnRzIDogdHJ1ZSxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0VXRpbFxyXG4qXHJcbiovXHJcbmZ1bmN0aW9uIHJlZGlyZWN0UGFnZShkZXN0aW5hdGlvbikge1xyXG5cdHBhZ2UucmVkaXJlY3QoZGVzdGluYXRpb24pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zykge1xyXG5cdHJldHVybiBTVEFUSUMud29ybGRzXHJcblx0XHQuZmluZCh3b3JsZCA9PiB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pID09PSB3b3JsZFNsdWcpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGVtbCgpIHtcclxuXHRjb25zdCBjaHVua3MgPSBbJ2d3MncydycsICdzY2h0dXBoJywgJ2NvbScsICdAJywgJy4nXTtcclxuXHRjb25zdCBhZGRyID0gW2NodW5rc1swXSwgY2h1bmtzWzNdLCBjaHVua3NbMV0sIGNodW5rc1s0XSwgY2h1bmtzWzJdXS5qb2luKCcnKTtcclxuXHJcblx0JCgnLm5vc3BhbS1wcnonKS5lYWNoKChpLCBlbCkgPT4ge1xyXG5cdFx0JChlbCkucmVwbGFjZVdpdGgoXHJcblx0XHRcdCQoJzxhPicsIHtocmVmOiBgbWFpbHRvOiR7YWRkcn1gLCB0ZXh0OiBhZGRyfSlcclxuXHRcdCk7XHJcblx0fSk7XHJcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuaWYgKGdsb2JhbC5fYmFiZWxQb2x5ZmlsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJvbmx5IG9uZSBpbnN0YW5jZSBvZiBiYWJlbC9wb2x5ZmlsbCBpcyBhbGxvd2VkXCIpO1xufVxuZ2xvYmFsLl9iYWJlbFBvbHlmaWxsID0gdHJ1ZTtcblxucmVxdWlyZShcImNvcmUtanMvc2hpbVwiKTtcblxucmVxdWlyZShcInJlZ2VuZXJhdG9yLWJhYmVsL3J1bnRpbWVcIik7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXHJcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXHJcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdCh0aGlzKVxyXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gJC50b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKVxyXG4gICAgICAsIHZhbHVlO1xyXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xyXG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XHJcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XHJcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXg7XHJcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XHJcbiAgfTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxyXG4vLyAxIC0+IEFycmF5I21hcFxyXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxyXG4vLyAzIC0+IEFycmF5I3NvbWVcclxuLy8gNCAtPiBBcnJheSNldmVyeVxyXG4vLyA1IC0+IEFycmF5I2ZpbmRcclxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcclxudmFyICQgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggPSByZXF1aXJlKCcuLyQuY3R4Jyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSl7XHJcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcclxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXHJcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcclxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxyXG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBzZWxmICAgPSAkLkVTNU9iamVjdChPKVxyXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0sIDMpXHJcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChzZWxmLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQID8gQXJyYXkobGVuZ3RoKSA6IElTX0ZJTFRFUiA/IFtdIDogdW5kZWZpbmVkXHJcbiAgICAgICwgdmFsLCByZXM7XHJcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xyXG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcclxuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcclxuICAgICAgaWYoVFlQRSl7XHJcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xyXG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcclxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXHJcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XHJcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXHJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcclxuICB9O1xyXG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1zZzEsIG1zZzIpe1xyXG4gIGlmKCFjb25kaXRpb24pdGhyb3cgVHlwZUVycm9yKG1zZzIgPyBtc2cxICsgbXNnMiA6IG1zZzEpO1xyXG59XHJcbmFzc2VydC5kZWYgPSAkLmFzc2VydERlZmluZWQ7XHJcbmFzc2VydC5mbiA9IGZ1bmN0aW9uKGl0KXtcclxuICBpZighJC5pc0Z1bmN0aW9uKGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xyXG4gIHJldHVybiBpdDtcclxufTtcclxuYXNzZXJ0Lm9iaiA9IGZ1bmN0aW9uKGl0KXtcclxuICBpZighJC5pc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xyXG4gIHJldHVybiBpdDtcclxufTtcclxuYXNzZXJ0Lmluc3QgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUpe1xyXG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XHJcbiAgcmV0dXJuIGl0O1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2VydDsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICB2YXIgVCA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGFyZ2V0KSlcclxuICAgICwgbCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgaSA9IDE7XHJcbiAgd2hpbGUobCA+IGkpe1xyXG4gICAgdmFyIFMgICAgICA9ICQuRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxyXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhTKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaiAgICAgID0gMFxyXG4gICAgICAsIGtleTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGopVFtrZXkgPSBrZXlzW2orK11dID0gU1trZXldO1xyXG4gIH1cclxuICByZXR1cm4gVDtcclxufTsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgVEFHICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcclxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XHJcbmZ1bmN0aW9uIGNvZihpdCl7XHJcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcclxufVxyXG5jb2YuY2xhc3NvZiA9IGZ1bmN0aW9uKGl0KXtcclxuICB2YXIgTywgVDtcclxuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXHJcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUIDogY29mKE8pO1xyXG59O1xyXG5jb2Yuc2V0ID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XHJcbiAgaWYoaXQgJiYgISQuaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSQuaGlkZShpdCwgVEFHLCB0YWcpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvZjsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgc2FmZSAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxyXG4gICwgYXNzZXJ0ICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcclxuICAsICRpdGVyICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgaGFzICAgICAgPSAkLmhhc1xyXG4gICwgc2V0ICAgICAgPSAkLnNldFxyXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XHJcbiAgLCBoaWRlICAgICA9ICQuaGlkZVxyXG4gICwgc3RlcCAgICAgPSAkaXRlci5zdGVwXHJcbiAgLCBpc0Zyb3plbiA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXHJcbiAgLCBJRCAgICAgICA9IHNhZmUoJ2lkJylcclxuICAsIE8xICAgICAgID0gc2FmZSgnTzEnKVxyXG4gICwgTEFTVCAgICAgPSBzYWZlKCdsYXN0JylcclxuICAsIEZJUlNUICAgID0gc2FmZSgnZmlyc3QnKVxyXG4gICwgSVRFUiAgICAgPSBzYWZlKCdpdGVyJylcclxuICAsIFNJWkUgICAgID0gJC5ERVNDID8gc2FmZSgnc2l6ZScpIDogJ3NpemUnXHJcbiAgLCBpZCAgICAgICA9IDA7XHJcblxyXG5mdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xyXG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcclxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xyXG4gIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XHJcbiAgaWYoaXNGcm96ZW4oaXQpKXJldHVybiAnRic7XHJcbiAgaWYoIWhhcyhpdCwgSUQpKXtcclxuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXHJcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XHJcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcclxuICAgIGhpZGUoaXQsIElELCArK2lkKTtcclxuICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XHJcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyeSh0aGF0LCBrZXkpe1xyXG4gIC8vIGZhc3QgY2FzZVxyXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XHJcbiAgaWYoaW5kZXggIT0gJ0YnKXJldHVybiB0aGF0W08xXVtpbmRleF07XHJcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXHJcbiAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKE5BTUUsIElTX01BUCwgQURERVIpe1xyXG4gICAgZnVuY3Rpb24gQyhpdGVyYWJsZSl7XHJcbiAgICAgIHZhciB0aGF0ID0gYXNzZXJ0Lmluc3QodGhpcywgQywgTkFNRSk7XHJcbiAgICAgIHNldCh0aGF0LCBPMSwgJC5jcmVhdGUobnVsbCkpO1xyXG4gICAgICBzZXQodGhhdCwgU0laRSwgMCk7XHJcbiAgICAgIHNldCh0aGF0LCBMQVNULCB1bmRlZmluZWQpO1xyXG4gICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkkaXRlci5mb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XHJcbiAgICB9XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwge1xyXG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcclxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAgIGNsZWFyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0W08xXSwgZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XHJcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcclxuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xyXG4gICAgICAgIGlmKGVudHJ5KXtcclxuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxyXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xyXG4gICAgICAgICAgZGVsZXRlIHRoYXRbTzFdW2VudHJ5LmldO1xyXG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XHJcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XHJcbiAgICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XHJcbiAgICAgICAgICBpZih0aGF0W0xBU1RdID09IGVudHJ5KXRoYXRbTEFTVF0gPSBwcmV2O1xyXG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xyXG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAgICAgLCBlbnRyeTtcclxuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcclxuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XHJcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgICAgaGFzOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYoJC5ERVNDKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gYXNzZXJ0LmRlZih0aGlzW1NJWkVdKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQztcclxuICB9LFxyXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XHJcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXHJcbiAgICAgICwgcHJldiwgaW5kZXg7XHJcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcclxuICAgIGlmKGVudHJ5KXtcclxuICAgICAgZW50cnkudiA9IHZhbHVlO1xyXG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xyXG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxyXG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcclxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgICBwOiBwcmV2ID0gdGhhdFtMQVNUXSwgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcclxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxyXG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXHJcbiAgICAgIH07XHJcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xyXG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xyXG4gICAgICB0aGF0W1NJWkVdKys7XHJcbiAgICAgIC8vIGFkZCB0byBpbmRleFxyXG4gICAgICBpZihpbmRleCAhPSAnRicpdGhhdFtPMV1baW5kZXhdID0gZW50cnk7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH0sXHJcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxyXG4gIGdldEl0ZXJDb25zdHJ1Y3RvcjogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgICAgIHNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGs6IGtpbmR9KTtcclxuICAgIH07XHJcbiAgfSxcclxuICBuZXh0OiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAgICwgZW50cnkgPSBpdGVyLmw7XHJcbiAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgLy8gZ2V0IG5leHQgZW50cnlcclxuICAgIGlmKCFpdGVyLm8gfHwgIShpdGVyLmwgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IGl0ZXIub1tGSVJTVF0pKXtcclxuICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cclxuICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICByZXR1cm4gc3RlcCgxKTtcclxuICAgIH1cclxuICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcclxuICAgIGlmKGtpbmQgPT0gJ2tleScgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcclxuICAgIGlmKGtpbmQgPT0gJ3ZhbHVlJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcclxuICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XHJcbiAgfVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBzYWZlICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxyXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBmb3JPZiAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpLmZvck9mXHJcbiAgLCBoYXMgICAgICAgPSAkLmhhc1xyXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxyXG4gICwgaGlkZSAgICAgID0gJC5oaWRlXHJcbiAgLCBpc0Zyb3plbiAgPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxyXG4gICwgaWQgICAgICAgID0gMFxyXG4gICwgSUQgICAgICAgID0gc2FmZSgnaWQnKVxyXG4gICwgV0VBSyAgICAgID0gc2FmZSgnd2VhaycpXHJcbiAgLCBMRUFLICAgICAgPSBzYWZlKCdsZWFrJylcclxuICAsIG1ldGhvZCAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJylcclxuICAsIGZpbmQgICAgICA9IG1ldGhvZCg1KVxyXG4gICwgZmluZEluZGV4ID0gbWV0aG9kKDYpO1xyXG5mdW5jdGlvbiBmaW5kRnJvemVuKHN0b3JlLCBrZXkpe1xyXG4gIHJldHVybiBmaW5kLmNhbGwoc3RvcmUuYXJyYXksIGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xyXG4gIH0pO1xyXG59XHJcbi8vIGZhbGxiYWNrIGZvciBmcm96ZW4ga2V5c1xyXG5mdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XHJcbiAgcmV0dXJuIHRoYXRbTEVBS10gfHwgaGlkZSh0aGF0LCBMRUFLLCB7XHJcbiAgICBhcnJheTogW10sXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgICAgaWYoZW50cnkpcmV0dXJuIGVudHJ5WzFdO1xyXG4gICAgfSxcclxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgcmV0dXJuICEhZmluZEZyb3plbih0aGlzLCBrZXkpO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcclxuICAgICAgZWxzZSB0aGlzLmFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcclxuICAgIH0sXHJcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4LmNhbGwodGhpcy5hcnJheSwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xyXG4gICAgICB9KTtcclxuICAgICAgaWYofmluZGV4KXRoaXMuYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgcmV0dXJuICEhfmluZGV4O1xyXG4gICAgfVxyXG4gIH0pW0xFQUtdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24oTkFNRSwgSVNfTUFQLCBBRERFUil7XHJcbiAgICBmdW5jdGlvbiBDKGl0ZXJhYmxlKXtcclxuICAgICAgJC5zZXQoYXNzZXJ0Lmluc3QodGhpcywgQywgTkFNRSksIElELCBpZCsrKTtcclxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoaXNbQURERVJdLCB0aGlzKTtcclxuICAgIH1cclxuICAgICQubWl4KEMucHJvdG90eXBlLCB7XHJcbiAgICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcclxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcclxuICAgICAgICByZXR1cm4gaGFzKGtleSwgV0VBSykgJiYgaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tJRF1dO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmhhcyhrZXkpO1xyXG4gICAgICAgIHJldHVybiBoYXMoa2V5LCBXRUFLKSAmJiBoYXMoa2V5W1dFQUtdLCB0aGlzW0lEXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgaWYoaXNGcm96ZW4oYXNzZXJ0Lm9iaihrZXkpKSl7XHJcbiAgICAgIGxlYWtTdG9yZSh0aGF0KS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoYXMoa2V5LCBXRUFLKSB8fCBoaWRlKGtleSwgV0VBSywge30pO1xyXG4gICAgICBrZXlbV0VBS11bdGhhdFtJRF1dID0gdmFsdWU7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH0sXHJcbiAgbGVha1N0b3JlOiBsZWFrU3RvcmUsXHJcbiAgV0VBSzogV0VBSyxcclxuICBJRDogSURcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBhc3NlcnRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5pbnN0O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgaXNXZWFrKXtcclxuICB2YXIgQmFzZSAgPSAkLmdbTkFNRV1cclxuICAgICwgQyAgICAgPSBCYXNlXHJcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xyXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcclxuICAgICwgTyAgICAgPSB7fTtcclxuICBmdW5jdGlvbiBmaXhNZXRob2QoS0VZLCBDSEFJTil7XHJcbiAgICB2YXIgbWV0aG9kID0gcHJvdG9bS0VZXTtcclxuICAgIGlmKCQuRlcpcHJvdG9bS0VZXSA9IGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICB2YXIgcmVzdWx0ID0gbWV0aG9kLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTtcclxuICAgICAgcmV0dXJuIENIQUlOID8gdGhpcyA6IHJlc3VsdDtcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmKCEkLmlzRnVuY3Rpb24oQykgfHwgIShpc1dlYWsgfHwgISRpdGVyLkJVR0dZICYmIHByb3RvLmZvckVhY2ggJiYgcHJvdG8uZW50cmllcykpe1xyXG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3IoTkFNRSwgSVNfTUFQLCBBRERFUik7XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBpbnN0ICA9IG5ldyBDXHJcbiAgICAgICwgY2hhaW4gPSBpbnN0W0FEREVSXShpc1dlYWsgPyB7fSA6IC0wLCAxKVxyXG4gICAgICAsIGJ1Z2d5WmVybztcclxuICAgIC8vIHdyYXAgZm9yIGluaXQgY29sbGVjdGlvbnMgZnJvbSBpdGVyYWJsZVxyXG4gICAgaWYoJGl0ZXIuZmFpbChmdW5jdGlvbihpdGVyKXtcclxuICAgICAgbmV3IEMoaXRlcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XHJcbiAgICB9KSB8fCAkaXRlci5EQU5HRVJfQ0xPU0lORyl7XHJcbiAgICAgIEMgPSBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgQywgTkFNRSk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBuZXcgQmFzZTtcclxuICAgICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpJGl0ZXIuZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgICB9O1xyXG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xyXG4gICAgICBpZigkLkZXKXByb3RvLmNvbnN0cnVjdG9yID0gQztcclxuICAgIH1cclxuICAgIGlzV2VhayB8fCBpbnN0LmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpe1xyXG4gICAgICBidWdneVplcm8gPSAxIC8ga2V5ID09PSAtSW5maW5pdHk7XHJcbiAgICB9KTtcclxuICAgIC8vIGZpeCBjb252ZXJ0aW5nIC0wIGtleSB0byArMFxyXG4gICAgaWYoYnVnZ3laZXJvKXtcclxuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcclxuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcclxuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XHJcbiAgICB9XHJcbiAgICAvLyArIGZpeCAuYWRkICYgLnNldCBmb3IgY2hhaW5pbmdcclxuICAgIGlmKGJ1Z2d5WmVybyB8fCBjaGFpbiAhPT0gaW5zdClmaXhNZXRob2QoQURERVIsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcmVxdWlyZSgnLi8kLmNvZicpLnNldChDLCBOQU1FKTtcclxuICByZXF1aXJlKCcuLyQuc3BlY2llcycpKEMpO1xyXG5cclxuICBPW05BTUVdID0gQztcclxuICAkZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqIChDICE9IEJhc2UpLCBPKTtcclxuXHJcbiAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXHJcbiAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxyXG4gIGlmKCFpc1dlYWspJGl0ZXIuc3RkKFxyXG4gICAgQywgTkFNRSxcclxuICAgIGNvbW1vbi5nZXRJdGVyQ29uc3RydWN0b3IoKSwgY29tbW9uLm5leHQsXHJcbiAgICBJU19NQVAgPyAna2V5K3ZhbHVlJyA6ICd2YWx1ZScgLCAhSVNfTUFQLCB0cnVlXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIEM7XHJcbn07IiwiLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXHJcbnZhciBhc3NlcnRGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5mbjtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcclxuICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgaWYofmxlbmd0aCAmJiB0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xyXG4gIHN3aXRjaChsZW5ndGgpe1xyXG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xyXG4gICAgfTtcclxuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcclxuICAgIH07XHJcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XHJcbiAgICB9O1xyXG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgZ2xvYmFsICAgICA9ICQuZ1xyXG4gICwgY29yZSAgICAgICA9ICQuY29yZVxyXG4gICwgaXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvbjtcclxuZnVuY3Rpb24gY3R4KGZuLCB0aGF0KXtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gIH07XHJcbn1cclxuZ2xvYmFsLmNvcmUgPSBjb3JlO1xyXG4vLyB0eXBlIGJpdG1hcFxyXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXHJcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcclxuJGRlZi5TID0gNDsgIC8vIHN0YXRpY1xyXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cclxuJGRlZi5CID0gMTY7IC8vIGJpbmRcclxuJGRlZi5XID0gMzI7IC8vIHdyYXBcclxuZnVuY3Rpb24gJGRlZih0eXBlLCBuYW1lLCBzb3VyY2Upe1xyXG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcclxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgJGRlZi5HXHJcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiB0eXBlICYgJGRlZi5TXHJcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KS5wcm90b3R5cGVcclxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xyXG4gIGlmKGlzR2xvYmFsKXNvdXJjZSA9IG5hbWU7XHJcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xyXG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXHJcbiAgICBvd24gPSAhKHR5cGUgJiAkZGVmLkYpICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xyXG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcclxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XHJcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxyXG4gICAgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcclxuICAgIGVsc2UgZXhwID0gdHlwZSAmICRkZWYuUCAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcclxuICAgIC8vIGV4dGVuZCBnbG9iYWxcclxuICAgIGlmKHRhcmdldCAmJiAhb3duKXtcclxuICAgICAgaWYoaXNHbG9iYWwpdGFyZ2V0W2tleV0gPSBvdXQ7XHJcbiAgICAgIGVsc2UgZGVsZXRlIHRhcmdldFtrZXldICYmICQuaGlkZSh0YXJnZXQsIGtleSwgb3V0KTtcclxuICAgIH1cclxuICAgIC8vIGV4cG9ydFxyXG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCkkLmhpZGUoZXhwb3J0cywga2V5LCBleHApO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkKXtcclxuICAkLkZXICAgPSB0cnVlO1xyXG4gICQucGF0aCA9ICQuZztcclxuICByZXR1cm4gJDtcclxufTsiLCIvLyBGYXN0IGFwcGx5XHJcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcclxuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XHJcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcclxuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xyXG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xyXG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xyXG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xyXG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xyXG4gICAgY2FzZSA1OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xyXG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgY29mICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBhc3NlcnRPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmpcclxuICAsIFNZTUJPTF9JVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXHJcbiAgLCBGRl9JVEVSQVRPUiAgICAgICA9ICdAQGl0ZXJhdG9yJ1xyXG4gICwgSXRlcmF0b3JzICAgICAgICAgPSB7fVxyXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcclxuLy8gU2FmYXJpIGhhcyBieWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxyXG52YXIgQlVHR1kgPSAna2V5cycgaW4gW10gJiYgISgnbmV4dCcgaW4gW10ua2V5cygpKTtcclxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcclxuc2V0SXRlcmF0b3IoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XHJcbmZ1bmN0aW9uIHNldEl0ZXJhdG9yKE8sIHZhbHVlKXtcclxuICAkLmhpZGUoTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XHJcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxyXG4gIGlmKEZGX0lURVJBVE9SIGluIFtdKSQuaGlkZShPLCBGRl9JVEVSQVRPUiwgdmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yKENvbnN0cnVjdG9yLCBOQU1FLCB2YWx1ZSwgREVGQVVMVCl7XHJcbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3IucHJvdG90eXBlXHJcbiAgICAsIGl0ZXIgID0gcHJvdG9bU1lNQk9MX0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXSB8fCB2YWx1ZTtcclxuICAvLyBEZWZpbmUgaXRlcmF0b3JcclxuICBpZigkLkZXKXNldEl0ZXJhdG9yKHByb3RvLCBpdGVyKTtcclxuICBpZihpdGVyICE9PSB2YWx1ZSl7XHJcbiAgICB2YXIgaXRlclByb3RvID0gJC5nZXRQcm90byhpdGVyLmNhbGwobmV3IENvbnN0cnVjdG9yKSk7XHJcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXHJcbiAgICBjb2Yuc2V0KGl0ZXJQcm90bywgTkFNRSArICcgSXRlcmF0b3InLCB0cnVlKTtcclxuICAgIC8vIEZGIGZpeFxyXG4gICAgaWYoJC5GVykkLmhhcyhwcm90bywgRkZfSVRFUkFUT1IpICYmIHNldEl0ZXJhdG9yKGl0ZXJQcm90bywgJC50aGF0KTtcclxuICB9XHJcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxyXG4gIEl0ZXJhdG9yc1tOQU1FXSA9IGl0ZXI7XHJcbiAgLy8gRkYgJiB2OCBmaXhcclxuICBJdGVyYXRvcnNbTkFNRSArICcgSXRlcmF0b3InXSA9ICQudGhhdDtcclxuICByZXR1cm4gaXRlcjtcclxufVxyXG5mdW5jdGlvbiBnZXRJdGVyYXRvcihpdCl7XHJcbiAgdmFyIFN5bWJvbCAgPSAkLmcuU3ltYm9sXHJcbiAgICAsIGV4dCAgICAgPSBpdFtTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SXVxyXG4gICAgLCBnZXRJdGVyID0gZXh0IHx8IGl0W1NZTUJPTF9JVEVSQVRPUl0gfHwgSXRlcmF0b3JzW2NvZi5jbGFzc29mKGl0KV07XHJcbiAgcmV0dXJuIGFzc2VydE9iamVjdChnZXRJdGVyLmNhbGwoaXQpKTtcclxufVxyXG5mdW5jdGlvbiBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKXtcclxuICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xyXG4gIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFzc2VydE9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xyXG59XHJcbmZ1bmN0aW9uIHN0ZXBDYWxsKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFzc2VydE9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICB0aHJvdyBlO1xyXG4gIH1cclxufVxyXG52YXIgREFOR0VSX0NMT1NJTkcgPSB0cnVlO1xyXG4hZnVuY3Rpb24oKXtcclxuICB0cnkge1xyXG4gICAgdmFyIGl0ZXIgPSBbMV0ua2V5cygpO1xyXG4gICAgaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBEQU5HRVJfQ0xPU0lORyA9IGZhbHNlOyB9O1xyXG4gICAgQXJyYXkuZnJvbShpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbn0oKTtcclxudmFyICRpdGVyID0gbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgQlVHR1k6IEJVR0dZLFxyXG4gIERBTkdFUl9DTE9TSU5HOiBEQU5HRVJfQ0xPU0lORyxcclxuICBmYWlsOiBmdW5jdGlvbihleGVjKXtcclxuICAgIHZhciBmYWlsID0gdHJ1ZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBhcnIgID0gW1t7fSwgMV1dXHJcbiAgICAgICAgLCBpdGVyID0gYXJyW1NZTUJPTF9JVEVSQVRPUl0oKVxyXG4gICAgICAgICwgbmV4dCA9IGl0ZXIubmV4dDtcclxuICAgICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBmYWlsID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgfTtcclxuICAgICAgYXJyW1NZTUJPTF9JVEVSQVRPUl0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBpdGVyO1xyXG4gICAgICB9O1xyXG4gICAgICBleGVjKGFycik7XHJcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgICByZXR1cm4gZmFpbDtcclxuICB9LFxyXG4gIEl0ZXJhdG9yczogSXRlcmF0b3JzLFxyXG4gIHByb3RvdHlwZTogSXRlcmF0b3JQcm90b3R5cGUsXHJcbiAgc3RlcDogZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XHJcbiAgfSxcclxuICBzdGVwQ2FsbDogc3RlcENhbGwsXHJcbiAgY2xvc2U6IGNsb3NlSXRlcmF0b3IsXHJcbiAgaXM6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoaXQpXHJcbiAgICAgICwgU3ltYm9sID0gJC5nLlN5bWJvbFxyXG4gICAgICAsIFNZTSAgICA9IFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1I7XHJcbiAgICByZXR1cm4gU1lNIGluIE8gfHwgU1lNQk9MX0lURVJBVE9SIGluIE8gfHwgJC5oYXMoSXRlcmF0b3JzLCBjb2YuY2xhc3NvZihPKSk7XHJcbiAgfSxcclxuICBnZXQ6IGdldEl0ZXJhdG9yLFxyXG4gIHNldDogc2V0SXRlcmF0b3IsXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCwgcHJvdG8pe1xyXG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUocHJvdG8gfHwgJGl0ZXIucHJvdG90eXBlLCB7bmV4dDogJC5kZXNjKDEsIG5leHQpfSk7XHJcbiAgICBjb2Yuc2V0KENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xyXG4gIH0sXHJcbiAgZGVmaW5lOiBkZWZpbmVJdGVyYXRvcixcclxuICBzdGQ6IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFKXtcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUl0ZXIoa2luZCl7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICAkaXRlci5jcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xyXG4gICAgdmFyIGVudHJpZXMgPSBjcmVhdGVJdGVyKCdrZXkrdmFsdWUnKVxyXG4gICAgICAsIHZhbHVlcyAgPSBjcmVhdGVJdGVyKCd2YWx1ZScpXHJcbiAgICAgICwgcHJvdG8gICA9IEJhc2UucHJvdG90eXBlXHJcbiAgICAgICwgbWV0aG9kcywga2V5O1xyXG4gICAgaWYoREVGQVVMVCA9PSAndmFsdWUnKXZhbHVlcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIHZhbHVlcywgJ3ZhbHVlcycpO1xyXG4gICAgZWxzZSBlbnRyaWVzID0gZGVmaW5lSXRlcmF0b3IoQmFzZSwgTkFNRSwgZW50cmllcywgJ2VudHJpZXMnKTtcclxuICAgIGlmKERFRkFVTFQpe1xyXG4gICAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGVudHJpZXM6IGVudHJpZXMsXHJcbiAgICAgICAga2V5czogICAgSVNfU0VUID8gdmFsdWVzIDogY3JlYXRlSXRlcigna2V5JyksXHJcbiAgICAgICAgdmFsdWVzOiAgdmFsdWVzXHJcbiAgICAgIH07XHJcbiAgICAgICRkZWYoJGRlZi5QICsgJGRlZi5GICogQlVHR1ksIE5BTUUsIG1ldGhvZHMpO1xyXG4gICAgICBpZihGT1JDRSlmb3Ioa2V5IGluIG1ldGhvZHMpe1xyXG4gICAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkLmhpZGUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZm9yT2Y6IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XHJcbiAgICB2YXIgaXRlcmF0b3IgPSBnZXRJdGVyYXRvcihpdGVyYWJsZSlcclxuICAgICAgLCBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXHJcbiAgICAgICwgc3RlcDtcclxuICAgIHdoaWxlKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSl7XHJcbiAgICAgIGlmKHN0ZXBDYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKSA9PT0gZmFsc2Upe1xyXG4gICAgICAgIHJldHVybiBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpXHJcbiAgLCBjb3JlICAgPSB7fVxyXG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcclxuICAsIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHlcclxuICAsIGNlaWwgID0gTWF0aC5jZWlsXHJcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcclxuICAsIG1heCAgID0gTWF0aC5tYXhcclxuICAsIG1pbiAgID0gTWF0aC5taW47XHJcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxyXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiAyOyB9fSkuYSA9PSAyO1xyXG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cclxufSgpO1xyXG52YXIgaGlkZSA9IGNyZWF0ZURlZmluZXIoMSk7XHJcbi8vIDcuMS40IFRvSW50ZWdlclxyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xyXG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xyXG59XHJcbmZ1bmN0aW9uIGRlc2MoYml0bWFwLCB2YWx1ZSl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcclxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcclxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcclxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcclxuICB9O1xyXG59XHJcbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gIG9iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XHJcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgZGVzYyhiaXRtYXAsIHZhbHVlKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcclxuICB9IDogc2ltcGxlU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XHJcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xyXG59XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcclxufVxyXG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcclxuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5cclxudmFyICQgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mdycpKHtcclxuICBnOiBnbG9iYWwsXHJcbiAgY29yZTogY29yZSxcclxuICBodG1sOiBnbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcmUtanMtaXNvYmplY3RcclxuICBpc09iamVjdDogICBpc09iamVjdCxcclxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxyXG4gIGl0OiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXQ7XHJcbiAgfSxcclxuICB0aGF0OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICAvLyA3LjEuNCBUb0ludGVnZXJcclxuICB0b0ludGVnZXI6IHRvSW50ZWdlcixcclxuICAvLyA3LjEuMTUgVG9MZW5ndGhcclxuICB0b0xlbmd0aDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcclxuICB9LFxyXG4gIHRvSW5kZXg6IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xyXG4gICAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xyXG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XHJcbiAgfSxcclxuICBoYXM6IGZ1bmN0aW9uKGl0LCBrZXkpe1xyXG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XHJcbiAgfSxcclxuICBjcmVhdGU6ICAgICBPYmplY3QuY3JlYXRlLFxyXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcclxuICBERVNDOiAgICAgICBERVNDLFxyXG4gIGRlc2M6ICAgICAgIGRlc2MsXHJcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcclxuICBzZXREZXNjOiAgICBkZWZpbmVQcm9wZXJ0eSxcclxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcclxuICBnZXROYW1lczogICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcclxuICBnZXRTeW1ib2xzOiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxyXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxyXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXHJcbiAgRVM1T2JqZWN0OiBPYmplY3QsXHJcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiAkLkVTNU9iamVjdChhc3NlcnREZWZpbmVkKGl0KSk7XHJcbiAgfSxcclxuICBoaWRlOiBoaWRlLFxyXG4gIGRlZjogY3JlYXRlRGVmaW5lcigwKSxcclxuICBzZXQ6IGdsb2JhbC5TeW1ib2wgPyBzaW1wbGVTZXQgOiBoaWRlLFxyXG4gIG1peDogZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xyXG4gICAgZm9yKHZhciBrZXkgaW4gc3JjKWhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfSxcclxuICBlYWNoOiBbXS5mb3JFYWNoXHJcbn0pO1xyXG5pZih0eXBlb2YgX19lICE9ICd1bmRlZmluZWQnKV9fZSA9IGNvcmU7XHJcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XHJcbiAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxyXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcclxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICwgaW5kZXggID0gMFxyXG4gICAgLCBrZXk7XHJcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcclxufTsiLCJ2YXIgJCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmo7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xyXG4gIGFzc2VydE9iamVjdChpdCk7XHJcbiAgcmV0dXJuICQuZ2V0U3ltYm9scyA/ICQuZ2V0TmFtZXMoaXQpLmNvbmNhdCgkLmdldFN5bWJvbHMoaXQpKSA6ICQuZ2V0TmFtZXMoaXQpO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcclxuICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAsIGkgICAgICA9IDBcclxuICAgICwgXyAgICAgID0gJC5wYXRoLl9cclxuICAgICwgaG9sZGVyID0gZmFsc2U7XHJcbiAgd2hpbGUobGVuZ3RoID4gaSlpZigocGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXSkgPT09IF8paG9sZGVyID0gdHJ1ZTtcclxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcclxuICAgICAgLCBfbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGogPSAwLCBrID0gMCwgYXJncztcclxuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xyXG4gICAgYXJncyA9IHBhcmdzLnNsaWNlKCk7XHJcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBqOyBqKyspaWYoYXJnc1tqXSA9PT0gXylhcmdzW2pdID0gYXJndW1lbnRzW2srK107XHJcbiAgICB3aGlsZShfbGVuZ3RoID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xyXG4gICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhhdCk7XHJcbiAgfTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVnRXhwLCByZXBsYWNlLCBpc1N0YXRpYyl7XHJcbiAgdmFyIHJlcGxhY2VyID0gcmVwbGFjZSA9PT0gT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XHJcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcclxuICB9IDogcmVwbGFjZTtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIFN0cmluZyhpc1N0YXRpYyA/IGl0IDogdGhpcykucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcclxuICB9O1xyXG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrcyB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cclxuLyplc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xyXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGFzc2VydCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICA/IGZ1bmN0aW9uKGJ1Z2d5LCBzZXQpe1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCAkLmdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XHJcbiAgICAgICAgc2V0KHt9LCBbXSk7XHJcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oTywgcHJvdG8pe1xyXG4gICAgICAgIGFzc2VydC5vYmooTyk7XHJcbiAgICAgICAgYXNzZXJ0KHByb3RvID09PSBudWxsIHx8ICQuaXNPYmplY3QocHJvdG8pLCBwcm90bywgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xyXG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XHJcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xyXG4gICAgICAgIHJldHVybiBPO1xyXG4gICAgICB9O1xyXG4gICAgfSgpXHJcbiAgOiB1bmRlZmluZWQpOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQyl7XHJcbiAgaWYoJC5ERVNDICYmICQuRlcpJC5zZXREZXNjKEMsIHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6ICQudGhhdFxyXG4gIH0pO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XHJcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHBvcyl7XHJcbiAgICB2YXIgcyA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgaSA9ICQudG9JbnRlZ2VyKHBvcylcclxuICAgICAgLCBsID0gcy5sZW5ndGhcclxuICAgICAgLCBhLCBiO1xyXG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcclxuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXHJcbiAgICAgIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxyXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXHJcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XHJcbiAgfTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIGludm9rZSA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxyXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gJC5nXHJcbiAgLCBpc0Z1bmN0aW9uICAgICAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcclxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxyXG4gICwgcG9zdE1lc3NhZ2UgICAgICAgID0gZ2xvYmFsLnBvc3RNZXNzYWdlXHJcbiAgLCBhZGRFdmVudExpc3RlbmVyICAgPSBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXHJcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXHJcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxyXG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcclxuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xyXG5mdW5jdGlvbiBydW4oKXtcclxuICB2YXIgaWQgPSArdGhpcztcclxuICBpZigkLmhhcyhxdWV1ZSwgaWQpKXtcclxuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcclxuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgICBmbigpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBsaXN0bmVyKGV2ZW50KXtcclxuICBydW4uY2FsbChldmVudC5kYXRhKTtcclxufVxyXG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XHJcbmlmKCFpc0Z1bmN0aW9uKHNldFRhc2spIHx8ICFpc0Z1bmN0aW9uKGNsZWFyVGFzaykpe1xyXG4gIHNldFRhc2sgPSBmdW5jdGlvbihmbil7XHJcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcclxuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcclxuICAgICAgaW52b2tlKGlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xyXG4gICAgfTtcclxuICAgIGRlZmVyKGNvdW50ZXIpO1xyXG4gICAgcmV0dXJuIGNvdW50ZXI7XHJcbiAgfTtcclxuICBjbGVhclRhc2sgPSBmdW5jdGlvbihpZCl7XHJcbiAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gIH07XHJcbiAgLy8gTm9kZS5qcyAwLjgtXHJcbiAgaWYoY29mKGdsb2JhbC5wcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIGdsb2JhbC5wcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XHJcbiAgICB9O1xyXG4gIC8vIE1vZGVybiBicm93c2Vycywgc2tpcCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViV29ya2Vyc1xyXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxyXG4gIH0gZWxzZSBpZihhZGRFdmVudExpc3RlbmVyICYmIGlzRnVuY3Rpb24ocG9zdE1lc3NhZ2UpICYmICEkLmcuaW1wb3J0U2NyaXB0cyl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgcG9zdE1lc3NhZ2UoaWQsICcqJyk7XHJcbiAgICB9O1xyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcclxuICAvLyBXZWJXb3JrZXJzXHJcbiAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oTWVzc2FnZUNoYW5uZWwpKXtcclxuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XHJcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcclxuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcclxuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xyXG4gIC8vIElFOC1cclxuICB9IGVsc2UgaWYoJC5nLmRvY3VtZW50ICYmIE9OUkVBRFlTVEFURUNIQU5HRSBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgJC5odG1sLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkLmh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc2V0OiAgIHNldFRhc2ssXHJcbiAgY2xlYXI6IGNsZWFyVGFza1xyXG59OyIsInZhciBzaWQgPSAwO1xyXG5mdW5jdGlvbiB1aWQoa2V5KXtcclxuICByZXR1cm4gJ1N5bWJvbCgnICsga2V5ICsgJylfJyArICgrK3NpZCArIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcclxufVxyXG51aWQuc2FmZSA9IHJlcXVpcmUoJy4vJCcpLmcuU3ltYm9sIHx8IHVpZDtcclxubW9kdWxlLmV4cG9ydHMgPSB1aWQ7IiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxyXG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3Vuc2NvcGFibGVzJyk7XHJcbmlmKCQuRlcgJiYgIShVTlNDT1BBQkxFUyBpbiBbXSkpJC5oaWRlKEFycmF5LnByb3RvdHlwZSwgVU5TQ09QQUJMRVMsIHt9KTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xyXG4gIGlmKCQuRlcpW11bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xyXG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLyQnKS5nXHJcbiAgLCBzdG9yZSAgPSB7fTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcclxuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cclxuICAgIGdsb2JhbC5TeW1ib2wgJiYgZ2xvYmFsLlN5bWJvbFtuYW1lXSB8fCByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnU3ltYm9sLicgKyBuYW1lKSk7XHJcbn07IiwidmFyICQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgaW52b2tlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxyXG4gICwgYXJyYXlNZXRob2QgICAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJylcclxuICAsIElFX1BST1RPICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnX19wcm90b19fJylcclxuICAsIGFzc2VydCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcclxuICAsIGFzc2VydE9iamVjdCAgICAgPSBhc3NlcnQub2JqXHJcbiAgLCBPYmplY3RQcm90byAgICAgID0gT2JqZWN0LnByb3RvdHlwZVxyXG4gICwgQSAgICAgICAgICAgICAgICA9IFtdXHJcbiAgLCBzbGljZSAgICAgICAgICAgID0gQS5zbGljZVxyXG4gICwgaW5kZXhPZiAgICAgICAgICA9IEEuaW5kZXhPZlxyXG4gICwgY2xhc3NvZiAgICAgICAgICA9IGNvZi5jbGFzc29mXHJcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcclxuICAsIGhhcyAgICAgICAgICAgICAgPSAkLmhhc1xyXG4gICwgZGVmaW5lUHJvcGVydHkgICA9ICQuc2V0RGVzY1xyXG4gICwgZ2V0T3duRGVzY3JpcHRvciA9ICQuZ2V0RGVzY1xyXG4gICwgaXNGdW5jdGlvbiAgICAgICA9ICQuaXNGdW5jdGlvblxyXG4gICwgdG9PYmplY3QgICAgICAgICA9ICQudG9PYmplY3RcclxuICAsIHRvTGVuZ3RoICAgICAgICAgPSAkLnRvTGVuZ3RoXHJcbiAgLCBJRThfRE9NX0RFRklORSAgID0gZmFsc2U7XHJcblxyXG5pZighJC5ERVNDKXtcclxuICB0cnkge1xyXG4gICAgSUU4X0RPTV9ERUZJTkUgPSBkZWZpbmVQcm9wZXJ0eShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgJ3gnLFxyXG4gICAgICB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gODsgfX1cclxuICAgICkueCA9PSA4O1xyXG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cclxuICAkLnNldERlc2MgPSBmdW5jdGlvbihPLCBQLCBBdHRyaWJ1dGVzKXtcclxuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XHJcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcclxuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cclxuICAgIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xyXG4gICAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKWFzc2VydE9iamVjdChPKVtQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XHJcbiAgICByZXR1cm4gTztcclxuICB9O1xyXG4gICQuZ2V0RGVzYyA9IGZ1bmN0aW9uKE8sIFApe1xyXG4gICAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcclxuICAgICAgcmV0dXJuIGdldE93bkRlc2NyaXB0b3IoTywgUCk7XHJcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgICBpZihoYXMoTywgUCkpcmV0dXJuICQuZGVzYyghT2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChPLCBQKSwgT1tQXSk7XHJcbiAgfTtcclxuICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oTywgUHJvcGVydGllcyl7XHJcbiAgICBhc3NlcnRPYmplY3QoTyk7XHJcbiAgICB2YXIga2V5cyAgID0gJC5nZXRLZXlzKFByb3BlcnRpZXMpXHJcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgLCBpID0gMFxyXG4gICAgICAsIFA7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpKSQuc2V0RGVzYyhPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcclxuICAgIHJldHVybiBPO1xyXG4gIH07XHJcbn1cclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhJC5ERVNDLCAnT2JqZWN0Jywge1xyXG4gIC8vIDE5LjEuMi42IC8gMTUuMi4zLjMgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxyXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJC5nZXREZXNjLFxyXG4gIC8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXHJcbiAgZGVmaW5lUHJvcGVydHk6ICQuc2V0RGVzYyxcclxuICAvLyAxOS4xLjIuMyAvIDE1LjIuMy43IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXHJcbiAgZGVmaW5lUHJvcGVydGllczogZGVmaW5lUHJvcGVydGllc1xyXG59KTtcclxuXHJcbiAgLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xyXG52YXIga2V5czEgPSAoJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsJyArXHJcbiAgICAgICAgICAgICd0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJykuc3BsaXQoJywnKVxyXG4gIC8vIEFkZGl0aW9uYWwga2V5cyBmb3IgZ2V0T3duUHJvcGVydHlOYW1lc1xyXG4gICwga2V5czIgPSBrZXlzMS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKVxyXG4gICwga2V5c0xlbjEgPSBrZXlzMS5sZW5ndGg7XHJcblxyXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxyXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcclxuICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJylcclxuICAgICwgaSAgICAgID0ga2V5c0xlbjFcclxuICAgICwgaWZyYW1lRG9jdW1lbnQ7XHJcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgJC5odG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XHJcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxyXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XHJcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xyXG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xyXG4gIGlmcmFtZURvY3VtZW50LndyaXRlKCc8c2NyaXB0PmRvY3VtZW50LkY9T2JqZWN0PC9zY3JpcHQ+Jyk7XHJcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcclxuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcclxuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3QucHJvdG90eXBlW2tleXMxW2ldXTtcclxuICByZXR1cm4gY3JlYXRlRGljdCgpO1xyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVHZXRLZXlzKG5hbWVzLCBsZW5ndGgpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gW11cclxuICAgICAgLCBrZXk7XHJcbiAgICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXHJcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XHJcbiAgICAgIH5pbmRleE9mLmNhbGwocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn1cclxuZnVuY3Rpb24gaXNQcmltaXRpdmUoaXQpeyByZXR1cm4gISQuaXNPYmplY3QoaXQpOyB9XHJcbmZ1bmN0aW9uIEVtcHR5KCl7fVxyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxyXG4gIGdldFByb3RvdHlwZU9mOiAkLmdldFByb3RvID0gJC5nZXRQcm90byB8fCBmdW5jdGlvbihPKXtcclxuICAgIE8gPSBPYmplY3QoYXNzZXJ0LmRlZihPKSk7XHJcbiAgICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcclxuICAgIGlmKGlzRnVuY3Rpb24oTy5jb25zdHJ1Y3RvcikgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xyXG4gICAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICQuZ2V0TmFtZXMgPSAkLmdldE5hbWVzIHx8IGNyZWF0ZUdldEtleXMoa2V5czIsIGtleXMyLmxlbmd0aCwgdHJ1ZSksXHJcbiAgLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXHJcbiAgY3JlYXRlOiAkLmNyZWF0ZSA9ICQuY3JlYXRlIHx8IGZ1bmN0aW9uKE8sIC8qPyovUHJvcGVydGllcyl7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYoTyAhPT0gbnVsbCl7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IGFzc2VydE9iamVjdChPKTtcclxuICAgICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XHJcbiAgICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2Ygc2hpbVxyXG4gICAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcclxuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XHJcbiAgICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXHJcbiAga2V5czogJC5nZXRLZXlzID0gJC5nZXRLZXlzIHx8IGNyZWF0ZUdldEtleXMoa2V5czEsIGtleXNMZW4xLCBmYWxzZSksXHJcbiAgLy8gMTkuMS4yLjE3IC8gMTUuMi4zLjggT2JqZWN0LnNlYWwoTylcclxuICBzZWFsOiAkLml0LCAvLyA8LSBjYXBcclxuICAvLyAxOS4xLjIuNSAvIDE1LjIuMy45IE9iamVjdC5mcmVlemUoTylcclxuICBmcmVlemU6ICQuaXQsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xNSAvIDE1LjIuMy4xMCBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcclxuICBwcmV2ZW50RXh0ZW5zaW9uczogJC5pdCwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEzIC8gMTUuMi4zLjExIE9iamVjdC5pc1NlYWxlZChPKVxyXG4gIGlzU2VhbGVkOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjEyIC8gMTUuMi4zLjEyIE9iamVjdC5pc0Zyb3plbihPKVxyXG4gIGlzRnJvemVuOiBpc1ByaW1pdGl2ZSwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjExIC8gMTUuMi4zLjEzIE9iamVjdC5pc0V4dGVuc2libGUoTylcclxuICBpc0V4dGVuc2libGU6ICQuaXNPYmplY3QgLy8gPC0gY2FwXHJcbn0pO1xyXG5cclxuLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxyXG4kZGVmKCRkZWYuUCwgJ0Z1bmN0aW9uJywge1xyXG4gIGJpbmQ6IGZ1bmN0aW9uKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xyXG4gICAgdmFyIGZuICAgICAgID0gYXNzZXJ0LmZuKHRoaXMpXHJcbiAgICAgICwgcGFydEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKXtcclxuICAgICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gJC5jcmVhdGUoZm4ucHJvdG90eXBlKSA6IHRoYXQpO1xyXG4gICAgfVxyXG4gICAgaWYoZm4ucHJvdG90eXBlKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcclxuICAgIHJldHVybiBib3VuZDtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gRml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nXHJcbmZ1bmN0aW9uIGFycmF5TWV0aG9kRml4KGZuKXtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmbi5hcHBseSgkLkVTNU9iamVjdCh0aGlzKSwgYXJndW1lbnRzKTtcclxuICB9O1xyXG59XHJcbmlmKCEoMCBpbiBPYmplY3QoJ3onKSAmJiAneidbMF0gPT0gJ3onKSl7XHJcbiAgJC5FUzVPYmplY3QgPSBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICgkLkVTNU9iamVjdCAhPSBPYmplY3QpLCAnQXJyYXknLCB7XHJcbiAgc2xpY2U6IGFycmF5TWV0aG9kRml4KHNsaWNlKSxcclxuICBqb2luOiBhcnJheU1ldGhvZEZpeChBLmpvaW4pXHJcbn0pO1xyXG5cclxuLy8gMjIuMS4yLjIgLyAxNS40LjMuMiBBcnJheS5pc0FycmF5KGFyZylcclxuJGRlZigkZGVmLlMsICdBcnJheScsIHtcclxuICBpc0FycmF5OiBmdW5jdGlvbihhcmcpe1xyXG4gICAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XHJcbiAgfVxyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlSZWR1Y2UoaXNSaWdodCl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4sIG1lbW8pe1xyXG4gICAgYXNzZXJ0LmZuKGNhbGxiYWNrZm4pO1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXHJcbiAgICAgICwgaSAgICAgID0gaXNSaWdodCA/IC0xIDogMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAyKWZvcig7Oyl7XHJcbiAgICAgIGlmKGluZGV4IGluIE8pe1xyXG4gICAgICAgIG1lbW8gPSBPW2luZGV4XTtcclxuICAgICAgICBpbmRleCArPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGluZGV4ICs9IGk7XHJcbiAgICAgIGFzc2VydChpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4LCAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xyXG4gICAgfVxyXG4gICAgZm9yKDtpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKWlmKGluZGV4IGluIE8pe1xyXG4gICAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1lbW87XHJcbiAgfTtcclxufVxyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGZvckVhY2g6ICQuZWFjaCA9ICQuZWFjaCB8fCBhcnJheU1ldGhvZCgwKSxcclxuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIG1hcDogYXJyYXlNZXRob2QoMSksXHJcbiAgLy8gMjIuMS4zLjcgLyAxNS40LjQuMjAgQXJyYXkucHJvdG90eXBlLmZpbHRlcihjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGZpbHRlcjogYXJyYXlNZXRob2QoMiksXHJcbiAgLy8gMjIuMS4zLjIzIC8gMTUuNC40LjE3IEFycmF5LnByb3RvdHlwZS5zb21lKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgc29tZTogYXJyYXlNZXRob2QoMyksXHJcbiAgLy8gMjIuMS4zLjUgLyAxNS40LjQuMTYgQXJyYXkucHJvdG90eXBlLmV2ZXJ5KGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXHJcbiAgZXZlcnk6IGFycmF5TWV0aG9kKDQpLFxyXG4gIC8vIDIyLjEuMy4xOCAvIDE1LjQuNC4yMSBBcnJheS5wcm90b3R5cGUucmVkdWNlKGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcclxuICByZWR1Y2U6IGNyZWF0ZUFycmF5UmVkdWNlKGZhbHNlKSxcclxuICAvLyAyMi4xLjMuMTkgLyAxNS40LjQuMjIgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcclxuICByZWR1Y2VSaWdodDogY3JlYXRlQXJyYXlSZWR1Y2UodHJ1ZSksXHJcbiAgLy8gMjIuMS4zLjExIC8gMTUuNC40LjE0IEFycmF5LnByb3RvdHlwZS5pbmRleE9mKHNlYXJjaEVsZW1lbnQgWywgZnJvbUluZGV4XSlcclxuICBpbmRleE9mOiBpbmRleE9mID0gaW5kZXhPZiB8fCByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKShmYWxzZSksXHJcbiAgLy8gMjIuMS4zLjE0IC8gMTUuNC40LjE1IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXHJcbiAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKGVsLCBmcm9tSW5kZXggLyogPSBAWyotMV0gKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gbGVuZ3RoIC0gMTtcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsICQudG9JbnRlZ2VyKGZyb21JbmRleCkpO1xyXG4gICAgaWYoaW5kZXggPCAwKWluZGV4ID0gdG9MZW5ndGgobGVuZ3RoICsgaW5kZXgpO1xyXG4gICAgZm9yKDtpbmRleCA+PSAwOyBpbmRleC0tKWlmKGluZGV4IGluIE8paWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpbmRleDtcclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gMjEuMS4zLjI1IC8gMTUuNS40LjIwIFN0cmluZy5wcm90b3R5cGUudHJpbSgpXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge3RyaW06IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eXFxzKihbXFxzXFxTXSpcXFMpP1xccyokLywgJyQxJyl9KTtcclxuXHJcbi8vIDIwLjMuMy4xIC8gMTUuOS40LjQgRGF0ZS5ub3coKVxyXG4kZGVmKCRkZWYuUywgJ0RhdGUnLCB7bm93OiBmdW5jdGlvbigpe1xyXG4gIHJldHVybiArbmV3IERhdGU7XHJcbn19KTtcclxuXHJcbmZ1bmN0aW9uIGx6KG51bSl7XHJcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XHJcbn1cclxuLy8gMjAuMy40LjM2IC8gMTUuOS41LjQzIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKClcclxuJGRlZigkZGVmLlAsICdEYXRlJywge3RvSVNPU3RyaW5nOiBmdW5jdGlvbigpe1xyXG4gIGlmKCFpc0Zpbml0ZSh0aGlzKSl0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIHRpbWUgdmFsdWUnKTtcclxuICB2YXIgZCA9IHRoaXNcclxuICAgICwgeSA9IGQuZ2V0VVRDRnVsbFllYXIoKVxyXG4gICAgLCBtID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKVxyXG4gICAgLCBzID0geSA8IDAgPyAnLScgOiB5ID4gOTk5OSA/ICcrJyA6ICcnO1xyXG4gIHJldHVybiBzICsgKCcwMDAwMCcgKyBNYXRoLmFicyh5KSkuc2xpY2UocyA/IC02IDogLTQpICtcclxuICAgICctJyArIGx6KGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgbHooZC5nZXRVVENEYXRlKCkpICtcclxuICAgICdUJyArIGx6KGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBseihkLmdldFVUQ01pbnV0ZXMoKSkgK1xyXG4gICAgJzonICsgbHooZC5nZXRVVENTZWNvbmRzKCkpICsgJy4nICsgKG0gPiA5OSA/IG0gOiAnMCcgKyBseihtKSkgKyAnWic7XHJcbn19KTtcclxuXHJcbmlmKGNsYXNzb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnT2JqZWN0Jyljb2YuY2xhc3NvZiA9IGZ1bmN0aW9uKGl0KXtcclxuICB2YXIgdGFnID0gY2xhc3NvZihpdCk7XHJcbiAgcmV0dXJuIHRhZyA9PSAnT2JqZWN0JyAmJiBpc0Z1bmN0aW9uKGl0LmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHRhZztcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgY29weVdpdGhpbjogZnVuY3Rpb24odGFyZ2V0LyogPSAwICovLCBzdGFydCAvKiA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xyXG4gICAgdmFyIE8gICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBsZW4gICA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgdG8gICAgPSB0b0luZGV4KHRhcmdldCwgbGVuKVxyXG4gICAgICAsIGZyb20gID0gdG9JbmRleChzdGFydCwgbGVuKVxyXG4gICAgICAsIGVuZCAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICwgZmluICAgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IHRvSW5kZXgoZW5kLCBsZW4pXHJcbiAgICAgICwgY291bnQgPSBNYXRoLm1pbihmaW4gLSBmcm9tLCBsZW4gLSB0bylcclxuICAgICAgLCBpbmMgICA9IDE7XHJcbiAgICBpZihmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpe1xyXG4gICAgICBpbmMgID0gLTE7XHJcbiAgICAgIGZyb20gPSBmcm9tICsgY291bnQgLSAxO1xyXG4gICAgICB0byAgID0gdG8gICArIGNvdW50IC0gMTtcclxuICAgIH1cclxuICAgIHdoaWxlKGNvdW50LS0gPiAwKXtcclxuICAgICAgaWYoZnJvbSBpbiBPKU9bdG9dID0gT1tmcm9tXTtcclxuICAgICAgZWxzZSBkZWxldGUgT1t0b107XHJcbiAgICAgIHRvICAgKz0gaW5jO1xyXG4gICAgICBmcm9tICs9IGluYztcclxuICAgIH0gcmV0dXJuIE87XHJcbiAgfVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnY29weVdpdGhpbicpOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgdG9JbmRleCA9ICQudG9JbmRleDtcclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcclxuICBmaWxsOiBmdW5jdGlvbih2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgIHZhciBPICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcclxuICAgICAgLCBlbmQgICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xyXG4gICAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnZmlsbCcpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gIGZpbmRJbmRleDogcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKSg2KVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnZmluZEluZGV4Jyk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4zLjggQXJyYXkucHJvdG90eXBlLmZpbmQocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gIGZpbmQ6IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNSlcclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbmQnKTsiLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgPSByZXF1aXJlKCcuLyQuY3R4JylcclxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIHN0ZXBDYWxsID0gJGl0ZXIuc3RlcENhbGw7XHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogJGl0ZXIuREFOR0VSX0NMT1NJTkcsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgZnJvbTogZnVuY3Rpb24oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xyXG4gICAgdmFyIE8gICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKGFycmF5TGlrZSkpXHJcbiAgICAgICwgbWFwZm4gICA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICwgZiAgICAgICA9IG1hcHBpbmcgPyBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMikgOiB1bmRlZmluZWRcclxuICAgICAgLCBpbmRleCAgID0gMFxyXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcclxuICAgIGlmKCRpdGVyLmlzKE8pKXtcclxuICAgICAgaXRlcmF0b3IgPSAkaXRlci5nZXQoTyk7XHJcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXHJcbiAgICAgIHJlc3VsdCAgID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KTtcclxuICAgICAgZm9yKDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcclxuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IHN0ZXBDYWxsKGl0ZXJhdG9yLCBmLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXHJcbiAgICAgIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aCkpO1xyXG4gICAgICBmb3IoOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XHJcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn0pOyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHNldFVuc2NvcGUgPSByZXF1aXJlKCcuLyQudW5zY29wZScpXHJcbiAgLCBJVEVSICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgJGl0ZXIgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIHN0ZXAgICAgICAgPSAkaXRlci5zdGVwXHJcbiAgLCBJdGVyYXRvcnMgID0gJGl0ZXIuSXRlcmF0b3JzO1xyXG5cclxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxyXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxyXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXHJcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG4kaXRlci5zdGQoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAkLnNldCh0aGlzLCBJVEVSLCB7bzogJC50b09iamVjdChpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcclxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXHJcbn0sIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgLCBPICAgICA9IGl0ZXIub1xyXG4gICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgLCBpbmRleCA9IGl0ZXIuaSsrO1xyXG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcclxuICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBzdGVwKDEpO1xyXG4gIH1cclxuICBpZihraW5kID09ICdrZXknICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xyXG4gIGlmKGtpbmQgPT0gJ3ZhbHVlJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XHJcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xyXG59LCAndmFsdWUnKTtcclxuXHJcbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcclxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcclxuXHJcbnNldFVuc2NvcGUoJ2tleXMnKTtcclxuc2V0VW5zY29wZSgndmFsdWVzJyk7XHJcbnNldFVuc2NvcGUoJ2VudHJpZXMnKTsiLCJ2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlMsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXHJcbiAgb2Y6IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgdmFyIGluZGV4ICA9IDBcclxuICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXHJcbiAgICAgICwgcmVzdWx0ID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KShsZW5ndGgpO1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcclxuICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7IiwicmVxdWlyZSgnLi8kLnNwZWNpZXMnKShBcnJheSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBOQU1FID0gJ25hbWUnXHJcbiAgLCBzZXREZXNjID0gJC5zZXREZXNjXHJcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4vLyAxOS4yLjQuMiBuYW1lXHJcbk5BTUUgaW4gRnVuY3Rpb25Qcm90byB8fCAkLkZXICYmICQuREVTQyAmJiBzZXREZXNjKEZ1bmN0aW9uUHJvdG8sIE5BTUUsIHtcclxuICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgZ2V0OiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIG1hdGNoID0gU3RyaW5nKHRoaXMpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLylcclxuICAgICAgLCBuYW1lICA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxuICAgICQuaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgJC5kZXNjKDUsIG5hbWUpKTtcclxuICAgIHJldHVybiBuYW1lO1xyXG4gIH0sXHJcbiAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYygwLCB2YWx1ZSkpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XHJcblxyXG4vLyAyMy4xIE1hcCBPYmplY3RzXHJcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ01hcCcsIHtcclxuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcclxuICB9LFxyXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcclxuICB9XHJcbn0sIHN0cm9uZywgdHJ1ZSk7IiwidmFyIEluZmluaXR5ID0gMSAvIDBcclxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBFICAgICA9IE1hdGguRVxyXG4gICwgcG93ICAgPSBNYXRoLnBvd1xyXG4gICwgYWJzICAgPSBNYXRoLmFic1xyXG4gICwgZXhwICAgPSBNYXRoLmV4cFxyXG4gICwgbG9nICAgPSBNYXRoLmxvZ1xyXG4gICwgc3FydCAgPSBNYXRoLnNxcnRcclxuICAsIGNlaWwgID0gTWF0aC5jZWlsXHJcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcclxuICAsIHNpZ24gID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XHJcbiAgICB9O1xyXG5cclxuLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG5mdW5jdGlvbiBhc2luaCh4KXtcclxuICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IGxvZyh4ICsgc3FydCh4ICogeCArIDEpKTtcclxufVxyXG4vLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG5mdW5jdGlvbiBleHBtMSh4KXtcclxuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcclxufVxyXG5cclxuJGRlZigkZGVmLlMsICdNYXRoJywge1xyXG4gIC8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcclxuICBhY29zaDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuICBhc2luaDogYXNpbmgsXHJcbiAgLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxyXG4gIGF0YW5oOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXHJcbiAgY2JydDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcclxuICBjbHozMjogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMyIC0geC50b1N0cmluZygyKS5sZW5ndGggOiAzMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcclxuICBjb3NoOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG4gIGV4cG0xOiBleHBtMSxcclxuICAvLyAyMC4yLjIuMTYgTWF0aC5mcm91bmQoeClcclxuICAvLyBUT0RPOiBmYWxsYmFjayBmb3IgSUU5LVxyXG4gIGZyb3VuZDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbeF0pWzBdO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXHJcbiAgaHlwb3Q6IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gICAgdmFyIHN1bSAgPSAwXHJcbiAgICAgICwgbGVuMSA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCBsZW4yID0gbGVuMVxyXG4gICAgICAsIGFyZ3MgPSBBcnJheShsZW4xKVxyXG4gICAgICAsIGxhcmcgPSAtSW5maW5pdHlcclxuICAgICAgLCBhcmc7XHJcbiAgICB3aGlsZShsZW4xLS0pe1xyXG4gICAgICBhcmcgPSBhcmdzW2xlbjFdID0gK2FyZ3VtZW50c1tsZW4xXTtcclxuICAgICAgaWYoYXJnID09IEluZmluaXR5IHx8IGFyZyA9PSAtSW5maW5pdHkpcmV0dXJuIEluZmluaXR5O1xyXG4gICAgICBpZihhcmcgPiBsYXJnKWxhcmcgPSBhcmc7XHJcbiAgICB9XHJcbiAgICBsYXJnID0gYXJnIHx8IDE7XHJcbiAgICB3aGlsZShsZW4yLS0pc3VtICs9IHBvdyhhcmdzW2xlbjJdIC8gbGFyZywgMik7XHJcbiAgICByZXR1cm4gbGFyZyAqIHNxcnQoc3VtKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xOCBNYXRoLmltdWwoeCwgeSlcclxuICBpbXVsOiBmdW5jdGlvbih4LCB5KXtcclxuICAgIHZhciBVSW50MTYgPSAweGZmZmZcclxuICAgICAgLCB4biA9ICt4XHJcbiAgICAgICwgeW4gPSAreVxyXG4gICAgICAsIHhsID0gVUludDE2ICYgeG5cclxuICAgICAgLCB5bCA9IFVJbnQxNiAmIHluO1xyXG4gICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSW50MTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSW50MTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXHJcbiAgbG9nMXA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogbG9nKDEgKyB4KTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXHJcbiAgbG9nMTA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4xMDtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcclxuICBsb2cyOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuICBzaWduOiBzaWduLFxyXG4gIC8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcclxuICBzaW5oOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiBhYnMoeCA9ICt4KSA8IDEgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMiA6IChleHAoeCAtIDEpIC0gZXhwKC14IC0gMSkpICogKEUgLyAyKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4zMyBNYXRoLnRhbmgoeClcclxuICB0YW5oOiBmdW5jdGlvbih4KXtcclxuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxyXG4gICAgICAsIGIgPSBleHBtMSgteCk7XHJcbiAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcclxuICB0cnVuYzogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgaXNPYmplY3QgICA9ICQuaXNPYmplY3RcclxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb25cclxuICAsIE5VTUJFUiAgICAgPSAnTnVtYmVyJ1xyXG4gICwgTnVtYmVyICAgICA9ICQuZ1tOVU1CRVJdXHJcbiAgLCBCYXNlICAgICAgID0gTnVtYmVyXHJcbiAgLCBwcm90byAgICAgID0gTnVtYmVyLnByb3RvdHlwZTtcclxuZnVuY3Rpb24gdG9QcmltaXRpdmUoaXQpe1xyXG4gIHZhciBmbiwgdmFsO1xyXG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgaWYoaXNGdW5jdGlvbihmbiA9IGl0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gbnVtYmVyXCIpO1xyXG59XHJcbmZ1bmN0aW9uIHRvTnVtYmVyKGl0KXtcclxuICBpZihpc09iamVjdChpdCkpaXQgPSB0b1ByaW1pdGl2ZShpdCk7XHJcbiAgaWYodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIgJiYgaXQuY2hhckNvZGVBdCgwKSA9PSA0OCl7XHJcbiAgICB2YXIgYmluYXJ5ID0gZmFsc2U7XHJcbiAgICBzd2l0Y2goaXQuY2hhckNvZGVBdCgxKSl7XHJcbiAgICAgIGNhc2UgNjYgOiBjYXNlIDk4ICA6IGJpbmFyeSA9IHRydWU7XHJcbiAgICAgIGNhc2UgNzkgOiBjYXNlIDExMSA6IHJldHVybiBwYXJzZUludChpdC5zbGljZSgyKSwgYmluYXJ5ID8gMiA6IDgpO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuICtpdDtcclxufVxyXG5pZigkLkZXICYmICEoTnVtYmVyKCcwbzEnKSAmJiBOdW1iZXIoJzBiMScpKSl7XHJcbiAgTnVtYmVyID0gZnVuY3Rpb24gTnVtYmVyKGl0KXtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgTnVtYmVyID8gbmV3IEJhc2UodG9OdW1iZXIoaXQpKSA6IHRvTnVtYmVyKGl0KTtcclxuICB9O1xyXG4gICQuZWFjaC5jYWxsKCQuREVTQyA/ICQuZ2V0TmFtZXMoQmFzZSkgOiAoXHJcbiAgICAgIC8vIEVTMzpcclxuICAgICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xyXG4gICAgICAvLyBFUzYgKGluIGNhc2UsIGlmIG1vZHVsZXMgd2l0aCBFUzYgTnVtYmVyIHN0YXRpY3MgcmVxdWlyZWQgYmVmb3JlKTpcclxuICAgICAgJ0VQU0lMT04saXNGaW5pdGUsaXNJbnRlZ2VyLGlzTmFOLGlzU2FmZUludGVnZXIsTUFYX1NBRkVfSU5URUdFUiwnICtcclxuICAgICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXHJcbiAgICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKCQuaGFzKEJhc2UsIGtleSkgJiYgISQuaGFzKE51bWJlciwga2V5KSl7XHJcbiAgICAgICAgJC5zZXREZXNjKE51bWJlciwga2V5LCAkLmdldERlc2MoQmFzZSwga2V5KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIE51bWJlci5wcm90b3R5cGUgPSBwcm90bztcclxuICBwcm90by5jb25zdHJ1Y3RvciA9IE51bWJlcjtcclxuICAkLmhpZGUoJC5nLCBOVU1CRVIsIE51bWJlcik7XHJcbn0iLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGFicyAgID0gTWF0aC5hYnNcclxuICAsIGZsb29yID0gTWF0aC5mbG9vclxyXG4gICwgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmY7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTE7XHJcbmZ1bmN0aW9uIGlzSW50ZWdlcihpdCl7XHJcbiAgcmV0dXJuICEkLmlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcclxufVxyXG4kZGVmKCRkZWYuUywgJ051bWJlcicsIHtcclxuICAvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxyXG4gIEVQU0lMT046IE1hdGgucG93KDIsIC01MiksXHJcbiAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcclxuICBpc0Zpbml0ZTogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShpdCk7XHJcbiAgfSxcclxuICAvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcclxuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcclxuICAvLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxyXG4gIGlzTmFOOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XHJcbiAgfSxcclxuICAvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXHJcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24obnVtYmVyKXtcclxuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxyXG4gIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxyXG4gIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXHJcbiAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcclxuICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXHJcbiAgcGFyc2VJbnQ6IHBhcnNlSW50XHJcbn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vJC5hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcclxuICBpczogZnVuY3Rpb24oeCwgeSl7XHJcbiAgICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxuICB9XHJcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpfSk7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBpc09iamVjdCA9ICQuaXNPYmplY3RcclxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdDtcclxuZnVuY3Rpb24gd3JhcE9iamVjdE1ldGhvZChNRVRIT0QsIE1PREUpe1xyXG4gIHZhciBmbiAgPSAoJC5jb3JlLk9iamVjdCB8fCB7fSlbTUVUSE9EXSB8fCBPYmplY3RbTUVUSE9EXVxyXG4gICAgLCBmICAgPSAwXHJcbiAgICAsIG8gICA9IHt9O1xyXG4gIG9bTUVUSE9EXSA9IE1PREUgPT0gMSA/IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcclxuICB9IDogTU9ERSA9PSAyID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IHRydWU7XHJcbiAgfSA6IE1PREUgPT0gMyA/IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBmYWxzZTtcclxuICB9IDogTU9ERSA9PSA0ID8gZnVuY3Rpb24oaXQsIGtleSl7XHJcbiAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpLCBrZXkpO1xyXG4gIH0gOiBNT0RFID09IDUgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gZm4oT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChpdCkpKTtcclxuICB9IDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XHJcbiAgfTtcclxuICB0cnkge1xyXG4gICAgZm4oJ3onKTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgZiA9IDE7XHJcbiAgfVxyXG4gICRkZWYoJGRlZi5TICsgJGRlZi5GICogZiwgJ09iamVjdCcsIG8pO1xyXG59XHJcbndyYXBPYmplY3RNZXRob2QoJ2ZyZWV6ZScsIDEpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdzZWFsJywgMSk7XHJcbndyYXBPYmplY3RNZXRob2QoJ3ByZXZlbnRFeHRlbnNpb25zJywgMSk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2lzRnJvemVuJywgMik7XHJcbndyYXBPYmplY3RNZXRob2QoJ2lzU2VhbGVkJywgMik7XHJcbndyYXBPYmplY3RNZXRob2QoJ2lzRXh0ZW5zaWJsZScsIDMpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCA0KTtcclxud3JhcE9iamVjdE1ldGhvZCgnZ2V0UHJvdG90eXBlT2YnLCA1KTtcclxud3JhcE9iamVjdE1ldGhvZCgna2V5cycpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eU5hbWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcclxudmFyICQgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIHRtcCA9IHt9O1xyXG50bXBbcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcclxuaWYoJC5GVyAmJiBjb2YodG1wKSAhPSAneicpJC5oaWRlKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuICdbb2JqZWN0ICcgKyBjb2YuY2xhc3NvZih0aGlzKSArICddJztcclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjdHggICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBjb2YgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBhc3NlcnQgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCAkaXRlciAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXHJcbiAgLCBSRUNPUkQgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ3JlY29yZCcpXHJcbiAgLCBmb3JPZiAgID0gJGl0ZXIuZm9yT2ZcclxuICAsIFBST01JU0UgPSAnUHJvbWlzZSdcclxuICAsIGdsb2JhbCAgPSAkLmdcclxuICAsIHByb2Nlc3MgPSBnbG9iYWwucHJvY2Vzc1xyXG4gICwgYXNhcCAgICA9IHByb2Nlc3MgJiYgcHJvY2Vzcy5uZXh0VGljayB8fCByZXF1aXJlKCcuLyQudGFzaycpLnNldFxyXG4gICwgUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXVxyXG4gICwgQmFzZSAgICA9IFByb21pc2VcclxuICAsIGlzRnVuY3Rpb24gICAgID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBpc09iamVjdCAgICAgICA9ICQuaXNPYmplY3RcclxuICAsIGFzc2VydEZ1bmN0aW9uID0gYXNzZXJ0LmZuXHJcbiAgLCBhc3NlcnRPYmplY3QgICA9IGFzc2VydC5vYmpcclxuICAsIHRlc3Q7XHJcbmZ1bmN0aW9uIGdldENvbnN0cnVjdG9yKEMpe1xyXG4gIHZhciBTID0gYXNzZXJ0T2JqZWN0KEMpW1NQRUNJRVNdO1xyXG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xyXG59XHJcbmlzRnVuY3Rpb24oUHJvbWlzZSkgJiYgaXNGdW5jdGlvbihQcm9taXNlLnJlc29sdmUpXHJcbiYmIFByb21pc2UucmVzb2x2ZSh0ZXN0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24oKXt9KSkgPT0gdGVzdFxyXG58fCBmdW5jdGlvbigpe1xyXG4gIGZ1bmN0aW9uIGlzVGhlbmFibGUoaXQpe1xyXG4gICAgdmFyIHRoZW47XHJcbiAgICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XHJcbiAgICByZXR1cm4gaXNGdW5jdGlvbih0aGVuKSA/IHRoZW4gOiBmYWxzZTtcclxuICB9XHJcbiAgZnVuY3Rpb24gaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKXtcclxuICAgIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cclxuICAgICAgLCBjaGFpbiAgPSByZWNvcmQuY1xyXG4gICAgICAsIGkgICAgICA9IDBcclxuICAgICAgLCByZWFjdDtcclxuICAgIGlmKHJlY29yZC5oKXJldHVybiB0cnVlO1xyXG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XHJcbiAgICAgIHJlYWN0ID0gY2hhaW5baSsrXTtcclxuICAgICAgaWYocmVhY3QuZmFpbCB8fCBoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHJlYWN0LlApKXJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBub3RpZnkocmVjb3JkLCBpc1JlamVjdCl7XHJcbiAgICB2YXIgY2hhaW4gPSByZWNvcmQuYztcclxuICAgIGlmKGlzUmVqZWN0IHx8IGNoYWluLmxlbmd0aClhc2FwKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcclxuICAgICAgICAsIHZhbHVlICAgPSByZWNvcmQudlxyXG4gICAgICAgICwgb2sgICAgICA9IHJlY29yZC5zID09IDFcclxuICAgICAgICAsIGkgICAgICAgPSAwO1xyXG4gICAgICBpZihpc1JlamVjdCAmJiAhaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKSl7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYoIWhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSkpe1xyXG4gICAgICAgICAgICBpZihjb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcclxuICAgICAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKGdsb2JhbC5jb25zb2xlICYmIGlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpe1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDFlMyk7XHJcbiAgICAgIH0gZWxzZSB3aGlsZShjaGFpbi5sZW5ndGggPiBpKSFmdW5jdGlvbihyZWFjdCl7XHJcbiAgICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcclxuICAgICAgICAgICwgcmV0LCB0aGVuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZihjYil7XHJcbiAgICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldCA9IGNiID09PSB0cnVlID8gdmFsdWUgOiBjYih2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XHJcbiAgICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcihQUk9NSVNFICsgJy1jaGFpbiBjeWNsZScpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJldCkpe1xyXG4gICAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xyXG4gICAgICAgICAgfSBlbHNlIHJlYWN0LnJlaih2YWx1ZSk7XHJcbiAgICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgICAgcmVhY3QucmVqKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KGNoYWluW2krK10pO1xyXG4gICAgICBjaGFpbi5sZW5ndGggPSAwO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSl7XHJcbiAgICB2YXIgcmVjb3JkID0gdGhpcztcclxuICAgIGlmKHJlY29yZC5kKXJldHVybjtcclxuICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICByZWNvcmQudiA9IHZhbHVlO1xyXG4gICAgcmVjb3JkLnMgPSAyO1xyXG4gICAgbm90aWZ5KHJlY29yZCwgdHJ1ZSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlc29sdmUodmFsdWUpe1xyXG4gICAgdmFyIHJlY29yZCA9IHRoaXNcclxuICAgICAgLCB0aGVuLCB3cmFwcGVyO1xyXG4gICAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gICAgcmVjb3JkLmQgPSB0cnVlO1xyXG4gICAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XHJcbiAgICAgICAgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxyXG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgocmVqZWN0LCB3cmFwcGVyLCAxKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgICAgICByZWNvcmQucyA9IDE7XHJcbiAgICAgICAgbm90aWZ5KHJlY29yZCk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgcmVqZWN0LmNhbGwod3JhcHBlciB8fCB7cjogcmVjb3JkLCBkOiBmYWxzZX0sIGVycik7IC8vIHdyYXBcclxuICAgIH1cclxuICB9XHJcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcclxuICBQcm9taXNlID0gZnVuY3Rpb24oZXhlY3V0b3Ipe1xyXG4gICAgYXNzZXJ0RnVuY3Rpb24oZXhlY3V0b3IpO1xyXG4gICAgdmFyIHJlY29yZCA9IHtcclxuICAgICAgcDogYXNzZXJ0Lmluc3QodGhpcywgUHJvbWlzZSwgUFJPTUlTRSksIC8vIDwtIHByb21pc2VcclxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoYWluXHJcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxyXG4gICAgICBkOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gZG9uZVxyXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgaDogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXHJcbiAgICB9O1xyXG4gICAgJC5oaWRlKHRoaXMsIFJFQ09SRCwgcmVjb3JkKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGV4ZWN1dG9yKGN0eChyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgocmVqZWN0LCByZWNvcmQsIDEpKTtcclxuICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgJC5taXgoUHJvbWlzZS5wcm90b3R5cGUsIHtcclxuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXHJcbiAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XHJcbiAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKS5jb25zdHJ1Y3RvcilbU1BFQ0lFU107XHJcbiAgICAgIHZhciByZWFjdCA9IHtcclxuICAgICAgICBvazogICBpc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogdHJ1ZSxcclxuICAgICAgICBmYWlsOiBpc0Z1bmN0aW9uKG9uUmVqZWN0ZWQpICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgdmFyIFAgPSByZWFjdC5QID0gbmV3IChTICE9IHVuZGVmaW5lZCA/IFMgOiBQcm9taXNlKShmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzKTtcclxuICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWopO1xyXG4gICAgICB9KTtcclxuICAgICAgdmFyIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcclxuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XHJcbiAgICAgIHJlY29yZC5zICYmIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICByZXR1cm4gUDtcclxuICAgIH0sXHJcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxyXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XHJcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcclxuICAgIH1cclxuICB9KTtcclxufSgpO1xyXG4kZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqIChQcm9taXNlICE9IEJhc2UpLCB7UHJvbWlzZTogUHJvbWlzZX0pO1xyXG4kZGVmKCRkZWYuUywgUFJPTUlTRSwge1xyXG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXHJcbiAgcmVqZWN0OiBmdW5jdGlvbihyKXtcclxuICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXMsIHJlail7XHJcbiAgICAgIHJlaihyKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXHJcbiAgcmVzb2x2ZTogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoeCkgJiYgUkVDT1JEIGluIHggJiYgJC5nZXRQcm90byh4KSA9PT0gdGhpcy5wcm90b3R5cGVcclxuICAgICAgPyB4IDogbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICByZXMoeCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufSk7XHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKCRpdGVyLmZhaWwoZnVuY3Rpb24oaXRlcil7XHJcbiAgUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcclxufSkgfHwgJGl0ZXIuREFOR0VSX0NMT1NJTkcpLCBQUk9NSVNFLCB7XHJcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXHJcbiAgYWxsOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICB2YXIgQyAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcclxuICAgICAgLCB2YWx1ZXMgPSBbXTtcclxuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xyXG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxyXG4gICAgICAgICwgcmVzdWx0cyAgID0gQXJyYXkocmVtYWluaW5nKTtcclxuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xyXG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0sIHJlamVjdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcclxuICByYWNlOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICB2YXIgQyA9IGdldENvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XHJcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5jb2Yuc2V0KFByb21pc2UsIFBST01JU0UpO1xyXG5yZXF1aXJlKCcuLyQuc3BlY2llcycpKFByb21pc2UpOyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBzZXRQcm90byAgPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJylcclxuICAsICRpdGVyICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIElURVIgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcclxuICAsIHN0ZXAgICAgICA9ICRpdGVyLnN0ZXBcclxuICAsIGFzc2VydCAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxyXG4gICwgZ2V0RGVzYyAgID0gJC5nZXREZXNjXHJcbiAgLCBzZXREZXNjICAgPSAkLnNldERlc2NcclxuICAsIGdldFByb3RvICA9ICQuZ2V0UHJvdG9cclxuICAsIGFwcGx5ICAgICA9IEZ1bmN0aW9uLmFwcGx5XHJcbiAgLCBhc3NlcnRPYmplY3QgPSBhc3NlcnQub2JqXHJcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8ICQuaXQ7XHJcbmZ1bmN0aW9uIEVudW1lcmF0ZShpdGVyYXRlZCl7XHJcbiAgdmFyIGtleXMgPSBbXSwga2V5O1xyXG4gIGZvcihrZXkgaW4gaXRlcmF0ZWQpa2V5cy5wdXNoKGtleSk7XHJcbiAgJC5zZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBhOiBrZXlzLCBpOiAwfSk7XHJcbn1cclxuJGl0ZXIuY3JlYXRlKEVudW1lcmF0ZSwgJ09iamVjdCcsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAsIGtleXMgPSBpdGVyLmFcclxuICAgICwga2V5O1xyXG4gIGRvIHtcclxuICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcclxuICB9IHdoaWxlKCEoKGtleSA9IGtleXNbaXRlci5pKytdKSBpbiBpdGVyLm8pKTtcclxuICByZXR1cm4gc3RlcCgwLCBrZXkpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHdyYXAoZm4pe1xyXG4gIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWZsZWN0R2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cclxuICAgICwgZGVzYyA9IGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XHJcbiAgaWYoZGVzYylyZXR1cm4gJC5oYXMoZGVzYywgJ3ZhbHVlJylcclxuICAgID8gZGVzYy52YWx1ZVxyXG4gICAgOiBkZXNjLmdldCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XHJcbiAgcmV0dXJuIGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSlcclxuICAgID8gcmVmbGVjdEdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKVxyXG4gICAgOiB1bmRlZmluZWQ7XHJcbn1cclxuZnVuY3Rpb24gcmVmbGVjdFNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWLyosIHJlY2VpdmVyKi8pe1xyXG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXHJcbiAgICAsIG93bkRlc2MgID0gZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpXHJcbiAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XHJcbiAgaWYoIW93bkRlc2Mpe1xyXG4gICAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90byh0YXJnZXQpKSl7XHJcbiAgICAgIHJldHVybiByZWZsZWN0U2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xyXG4gICAgfVxyXG4gICAgb3duRGVzYyA9ICQuZGVzYygwKTtcclxuICB9XHJcbiAgaWYoJC5oYXMob3duRGVzYywgJ3ZhbHVlJykpe1xyXG4gICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XHJcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgJC5kZXNjKDApO1xyXG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcclxuICAgIHNldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xyXG59XHJcblxyXG52YXIgcmVmbGVjdCA9IHtcclxuICAvLyAyNi4xLjEgUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdClcclxuICBhcHBseTogcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsIGFwcGx5LCAzKSxcclxuICAvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXHJcbiAgY29uc3RydWN0OiBmdW5jdGlvbih0YXJnZXQsIGFyZ3VtZW50c0xpc3QgLyosIG5ld1RhcmdldCovKXtcclxuICAgIHZhciBwcm90byAgICA9IGFzc2VydC5mbihhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXSkucHJvdG90eXBlXHJcbiAgICAgICwgaW5zdGFuY2UgPSAkLmNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdC5wcm90b3R5cGUpXHJcbiAgICAgICwgcmVzdWx0ICAgPSBhcHBseS5jYWxsKHRhcmdldCwgaW5zdGFuY2UsIGFyZ3VtZW50c0xpc3QpO1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcclxuICB9LFxyXG4gIC8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXHJcbiAgZGVmaW5lUHJvcGVydHk6IHdyYXAoc2V0RGVzYyksXHJcbiAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICB2YXIgZGVzYyA9IGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XHJcbiAgfSxcclxuICAvLyAyNi4xLjUgUmVmbGVjdC5lbnVtZXJhdGUodGFyZ2V0KVxyXG4gIGVudW1lcmF0ZTogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgIHJldHVybiBuZXcgRW51bWVyYXRlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICB9LFxyXG4gIC8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcclxuICBnZXQ6IHJlZmxlY3RHZXQsXHJcbiAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgIHJldHVybiBnZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgfSxcclxuICAvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXHJcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICByZXR1cm4gZ2V0UHJvdG8oYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgaGFzOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XHJcbiAgfSxcclxuICAvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcclxuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICByZXR1cm4gISFpc0V4dGVuc2libGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxyXG4gIG93bktleXM6IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpLFxyXG4gIC8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXHJcbiAgcHJldmVudEV4dGVuc2lvbnM6IHdyYXAoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zIHx8ICQuaXQpLFxyXG4gIC8vIDI2LjEuMTMgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgViBbLCByZWNlaXZlcl0pXHJcbiAgc2V0OiByZWZsZWN0U2V0XHJcbn07XHJcbi8vIDI2LjEuMTQgUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKVxyXG5pZihzZXRQcm90bylyZWZsZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24odGFyZ2V0LCBwcm90byl7XHJcbiAgc2V0UHJvdG8oYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3RvKTtcclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbiRkZWYoJGRlZi5HLCB7UmVmbGVjdDoge319KTtcclxuJGRlZigkZGVmLlMsICdSZWZsZWN0JywgcmVmbGVjdCk7IiwidmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIFJlZ0V4cCA9ICQuZy5SZWdFeHBcclxuICAsIEJhc2UgICA9IFJlZ0V4cFxyXG4gICwgcHJvdG8gID0gUmVnRXhwLnByb3RvdHlwZTtcclxuaWYoJC5GVyAmJiAkLkRFU0Mpe1xyXG4gIC8vIFJlZ0V4cCBhbGxvd3MgYSByZWdleCB3aXRoIGZsYWdzIGFzIHRoZSBwYXR0ZXJuXHJcbiAgaWYoIWZ1bmN0aW9uKCl7dHJ5eyByZXR1cm4gUmVnRXhwKC9hL2csICdpJykgPT0gJy9hL2knOyB9Y2F0Y2goZSl7IC8qIGVtcHR5ICovIH19KCkpe1xyXG4gICAgUmVnRXhwID0gZnVuY3Rpb24gUmVnRXhwKHBhdHRlcm4sIGZsYWdzKXtcclxuICAgICAgcmV0dXJuIG5ldyBCYXNlKGNvZihwYXR0ZXJuKSA9PSAnUmVnRXhwJyAmJiBmbGFncyAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyBwYXR0ZXJuLnNvdXJjZSA6IHBhdHRlcm4sIGZsYWdzKTtcclxuICAgIH07XHJcbiAgICAkLmVhY2guY2FsbCgkLmdldE5hbWVzKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBrZXkgaW4gUmVnRXhwIHx8ICQuc2V0RGVzYyhSZWdFeHAsIGtleSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBCYXNlW2tleV07IH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbihpdCl7IEJhc2Vba2V5XSA9IGl0OyB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBwcm90by5jb25zdHJ1Y3RvciA9IFJlZ0V4cDtcclxuICAgIFJlZ0V4cC5wcm90b3R5cGUgPSBwcm90bztcclxuICAgICQuaGlkZSgkLmcsICdSZWdFeHAnLCBSZWdFeHApO1xyXG4gIH1cclxuICAvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXHJcbiAgaWYoLy4vZy5mbGFncyAhPSAnZycpJC5zZXREZXNjKHByb3RvLCAnZmxhZ3MnLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eLipcXC8oXFx3KikkLywgJyQxJylcclxuICB9KTtcclxufVxyXG5yZXF1aXJlKCcuLyQuc3BlY2llcycpKFJlZ0V4cCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XHJcblxyXG4vLyAyMy4yIFNldCBPYmplY3RzXHJcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1NldCcsIHtcclxuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcclxuICB9XHJcbn0sIHN0cm9uZyk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxyXG4gIGNvZGVQb2ludEF0OiByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykoZmFsc2UpXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgdG9MZW5ndGggPSAkLnRvTGVuZ3RoO1xyXG5cclxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxyXG4gIGVuZHNXaXRoOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLyl7XHJcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICAgIHZhciB0aGF0ID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAsIGxlbiA9IHRvTGVuZ3RoKHRoYXQubGVuZ3RoKVxyXG4gICAgICAsIGVuZCA9IGVuZFBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBsZW4gOiBNYXRoLm1pbih0b0xlbmd0aChlbmRQb3NpdGlvbiksIGxlbik7XHJcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICByZXR1cm4gdGhhdC5zbGljZShlbmQgLSBzZWFyY2hTdHJpbmcubGVuZ3RoLCBlbmQpID09PSBzZWFyY2hTdHJpbmc7XHJcbiAgfVxyXG59KTsiLCJ2YXIgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgdG9JbmRleCA9IHJlcXVpcmUoJy4vJCcpLnRvSW5kZXhcclxuICAsIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XHJcblxyXG4kZGVmKCRkZWYuUywgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxyXG4gIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uKHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgICB2YXIgcmVzID0gW11cclxuICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgaSAgID0gMFxyXG4gICAgICAsIGNvZGU7XHJcbiAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcclxuICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XHJcbiAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXHJcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcclxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXHJcbiAgICAgICk7XHJcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxyXG4gIGluY2x1ZGVzOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICAgIHJldHVybiAhIX5TdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKS5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKTtcclxuICB9XHJcbn0pOyIsInZhciBzZXQgICA9IHJlcXVpcmUoJy4vJCcpLnNldFxyXG4gICwgYXQgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSlcclxuICAsIElURVIgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwICA9ICRpdGVyLnN0ZXA7XHJcblxyXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiRpdGVyLnN0ZChTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XHJcbiAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxufSwgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAsIGluZGV4ID0gaXRlci5pXHJcbiAgICAsIHBvaW50O1xyXG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xyXG4gIHBvaW50ID0gYXQuY2FsbChPLCBpbmRleCk7XHJcbiAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcclxuICByZXR1cm4gc3RlcCgwLCBwb2ludCk7XHJcbn0pOyIsInZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUywgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxyXG4gIHJhdzogZnVuY3Rpb24oY2FsbFNpdGUpe1xyXG4gICAgdmFyIHJhdyA9ICQudG9PYmplY3QoY2FsbFNpdGUucmF3KVxyXG4gICAgICAsIGxlbiA9ICQudG9MZW5ndGgocmF3Lmxlbmd0aClcclxuICAgICAgLCBzbG4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgcmVzID0gW11cclxuICAgICAgLCBpICAgPSAwO1xyXG4gICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgIHJlcy5wdXNoKFN0cmluZyhyYXdbaSsrXSkpO1xyXG4gICAgICBpZihpIDwgc2xuKXJlcy5wdXNoKFN0cmluZyhhcmd1bWVudHNbaV0pKTtcclxuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy4xMyBTdHJpbmcucHJvdG90eXBlLnJlcGVhdChjb3VudClcclxuICByZXBlYXQ6IGZ1bmN0aW9uKGNvdW50KXtcclxuICAgIHZhciBzdHIgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIHJlcyA9ICcnXHJcbiAgICAgICwgbiAgID0gJC50b0ludGVnZXIoY291bnQpO1xyXG4gICAgaWYobiA8IDAgfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XHJcbiAgICBmb3IoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSlpZihuICYgMSlyZXMgKz0gc3RyO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXHJcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xyXG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgICB2YXIgdGhhdCAgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGluZGV4ID0gJC50b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHNbMV0sIHRoYXQubGVuZ3RoKSk7XHJcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICByZXR1cm4gdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJpbmcubGVuZ3RoKSA9PT0gc2VhcmNoU3RyaW5nO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXHJcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBzZXRUYWcgICA9IHJlcXVpcmUoJy4vJC5jb2YnKS5zZXRcclxuICAsIHVpZCAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXHJcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgaGFzICAgICAgPSAkLmhhc1xyXG4gICwgaGlkZSAgICAgPSAkLmhpZGVcclxuICAsIGdldE5hbWVzID0gJC5nZXROYW1lc1xyXG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0XHJcbiAgLCBTeW1ib2wgICA9ICQuZy5TeW1ib2xcclxuICAsIEJhc2UgICAgID0gU3ltYm9sXHJcbiAgLCBzZXR0ZXIgICA9IGZhbHNlXHJcbiAgLCBUQUcgICAgICA9IHVpZC5zYWZlKCd0YWcnKVxyXG4gICwgU3ltYm9sUmVnaXN0cnkgPSB7fVxyXG4gICwgQWxsU3ltYm9scyAgICAgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHdyYXAodGFnKXtcclxuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gJC5zZXQoJC5jcmVhdGUoU3ltYm9sLnByb3RvdHlwZSksIFRBRywgdGFnKTtcclxuICAkLkRFU0MgJiYgc2V0dGVyICYmICQuc2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCB0YWcsIHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICBoaWRlKHRoaXMsIHRhZywgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBzeW07XHJcbn1cclxuXHJcbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxyXG5pZighJC5pc0Z1bmN0aW9uKFN5bWJvbCkpe1xyXG4gIFN5bWJvbCA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKXtcclxuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgIHJldHVybiB3cmFwKHVpZChkZXNjcmlwdGlvbikpO1xyXG4gIH07XHJcbiAgaGlkZShTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXNbVEFHXTtcclxuICB9KTtcclxufVxyXG4kZGVmKCRkZWYuRyArICRkZWYuVywge1N5bWJvbDogU3ltYm9sfSk7XHJcblxyXG52YXIgc3ltYm9sU3RhdGljcyA9IHtcclxuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcclxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcclxuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcclxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXHJcbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9IFN5bWJvbChrZXkpO1xyXG4gIH0sXHJcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXHJcbiAga2V5Rm9yOiByZXF1aXJlKCcuLyQucGFydGlhbCcpLmNhbGwocmVxdWlyZSgnLi8kLmtleW9mJyksIFN5bWJvbFJlZ2lzdHJ5LCAwKSxcclxuICBwdXJlOiB1aWQuc2FmZSxcclxuICBzZXQ6ICQuc2V0LFxyXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcclxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XHJcbn07XHJcbi8vIDE5LjQuMi4yIFN5bWJvbC5oYXNJbnN0YW5jZVxyXG4vLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXHJcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxyXG4vLyAxOS40LjIuNiBTeW1ib2wubWF0Y2hcclxuLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2VcclxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxyXG4vLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcclxuLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxyXG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXHJcbi8vIDE5LjQuMi4xMyBTeW1ib2wudG9TdHJpbmdUYWdcclxuLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xyXG4kLmVhY2guY2FsbCgoXHJcbiAgICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLCcgK1xyXG4gICAgJ3NwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXHJcbiAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XHJcbiAgICB2YXIgc3ltID0gcmVxdWlyZSgnLi8kLndrcycpKGl0KTtcclxuICAgIHN5bWJvbFN0YXRpY3NbaXRdID0gU3ltYm9sID09PSBCYXNlID8gc3ltIDogd3JhcChzeW0pO1xyXG4gIH1cclxuKTtcclxuXHJcbnNldHRlciA9IHRydWU7XHJcblxyXG4kZGVmKCRkZWYuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xyXG5cclxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoU3ltYm9sICE9IEJhc2UpLCAnT2JqZWN0Jywge1xyXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXHJcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogZnVuY3Rpb24oaXQpe1xyXG4gICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcclxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBuYW1lcyA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSksIHJlc3VsdCA9IFtdLCBrZXksIGkgPSAwO1xyXG4gICAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSloYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59KTtcclxuXHJcbnNldFRhZyhTeW1ib2wsICdTeW1ib2wnKTtcclxuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxyXG5zZXRUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcclxuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cclxuc2V0VGFnKCQuZy5KU09OLCAnSlNPTicsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCB3ZWFrICAgICAgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi13ZWFrJylcclxuICAsIGxlYWtTdG9yZSA9IHdlYWsubGVha1N0b3JlXHJcbiAgLCBJRCAgICAgICAgPSB3ZWFrLklEXHJcbiAgLCBXRUFLICAgICAgPSB3ZWFrLldFQUtcclxuICAsIGhhcyAgICAgICA9ICQuaGFzXHJcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XHJcbiAgLCBpc0Zyb3plbiAgPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxyXG4gICwgdG1wICAgICAgID0ge307XHJcblxyXG4vLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xyXG52YXIgV2Vha01hcCA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtNYXAnLCB7XHJcbiAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICBpZihpc09iamVjdChrZXkpKXtcclxuICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmdldChrZXkpO1xyXG4gICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbSURdXTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG59LCB3ZWFrLCB0cnVlLCB0cnVlKTtcclxuXHJcbi8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcclxuaWYoJC5GVyAmJiBuZXcgV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDcpe1xyXG4gICQuZWFjaC5jYWxsKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uKGtleSl7XHJcbiAgICB2YXIgbWV0aG9kID0gV2Vha01hcC5wcm90b3R5cGVba2V5XTtcclxuICAgIFdlYWtNYXAucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gbGVha3kgbWFwXHJcbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmIGlzRnJvemVuKGEpKXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbGVha1N0b3JlKHRoaXMpW2tleV0oYSwgYik7XHJcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxyXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcclxuICAgIH07XHJcbiAgfSk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpO1xyXG5cclxuLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha1NldCcsIHtcclxuICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgYWRkOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywgdmFsdWUsIHRydWUpO1xyXG4gIH1cclxufSwgd2VhaywgZmFsc2UsIHRydWUpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb21lbmljL0FycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICBpbmNsdWRlczogcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykodHJ1ZSlcclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2luY2x1ZGVzJyk7IiwiLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vV2ViUmVmbGVjdGlvbi85MzUzNzgxXHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIG93bktleXMgPSByZXF1aXJlKCcuLyQub3duLWtleXMnKTtcclxuXHJcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xyXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXHJcbiAgICAgICwgcmVzdWx0ID0ge307XHJcbiAgICAkLmVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAkLnNldERlc2MocmVzdWx0LCBrZXksICQuZGVzYygwLCAkLmdldERlc2MoTywga2V5KSkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhvYmplY3QpXHJcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICwgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgICAsIGtleTtcclxuICAgIGlmKGlzRW50cmllcyl3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IFtrZXkgPSBrZXlzW2krK10sIE9ba2V5XV07XHJcbiAgICBlbHNlIHdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gT1trZXlzW2krK11dO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG59XHJcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xyXG4gIHZhbHVlczogIGNyZWF0ZU9iamVjdFRvQXJyYXkoZmFsc2UpLFxyXG4gIGVudHJpZXM6IGNyZWF0ZU9iamVjdFRvQXJyYXkodHJ1ZSlcclxufSk7IiwiLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20va2FuZ2F4Lzk2OTgxMDBcclxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcbiRkZWYoJGRlZi5TLCAnUmVnRXhwJywge1xyXG4gIGVzY2FwZTogcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoLyhbXFxcXFxcLVtcXF17fSgpKis/LixeJHxdKS9nLCAnXFxcXCQxJywgdHJ1ZSlcclxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5hdFxyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XHJcbiAgYXQ6IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKVxyXG59KTsiLCIvLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBjb3JlICAgID0gJC5jb3JlXHJcbiAgLCBzdGF0aWNzID0ge307XHJcbmZ1bmN0aW9uIHNldFN0YXRpY3Moa2V5cywgbGVuZ3RoKXtcclxuICAkLmVhY2guY2FsbChrZXlzLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICBpZihsZW5ndGggPT0gdW5kZWZpbmVkICYmIGtleSBpbiBjb3JlLkFycmF5KXN0YXRpY3Nba2V5XSA9IGNvcmUuQXJyYXlba2V5XTtcclxuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xyXG4gIH0pO1xyXG59XHJcbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcclxuc2V0U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xyXG5zZXRTdGF0aWNzKCdqb2luLHNsaWNlLGNvbmNhdCxwdXNoLHNwbGljZSx1bnNoaWZ0LHNvcnQsbGFzdEluZGV4T2YsJyArXHJcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xyXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywgc3RhdGljcyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcclxudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcicpLkl0ZXJhdG9yc1xyXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXHJcbiAgLCBOb2RlTGlzdCAgPSAkLmcuTm9kZUxpc3Q7XHJcbmlmKCQuRlcgJiYgTm9kZUxpc3QgJiYgIShJVEVSQVRPUiBpbiBOb2RlTGlzdC5wcm90b3R5cGUpKXtcclxuICAkLmhpZGUoTm9kZUxpc3QucHJvdG90eXBlLCBJVEVSQVRPUiwgSXRlcmF0b3JzLkFycmF5KTtcclxufVxyXG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnMuQXJyYXk7IiwidmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCAkdGFzayA9IHJlcXVpcmUoJy4vJC50YXNrJyk7XHJcbiRkZWYoJGRlZi5HICsgJGRlZi5CLCB7XHJcbiAgc2V0SW1tZWRpYXRlOiAgICR0YXNrLnNldCxcclxuICBjbGVhckltbWVkaWF0ZTogJHRhc2suY2xlYXJcclxufSk7IiwiLy8gaWU5LSBzZXRUaW1lb3V0ICYgc2V0SW50ZXJ2YWwgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZpeFxyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBpbnZva2UgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXHJcbiAgLCBwYXJ0aWFsID0gcmVxdWlyZSgnLi8kLnBhcnRpYWwnKVxyXG4gICwgTVNJRSAgICA9ICEhJC5nLm5hdmlnYXRvciAmJiAvTVNJRSAuXFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpOyAvLyA8LSBkaXJ0eSBpZTktIGNoZWNrXHJcbmZ1bmN0aW9uIHdyYXAoc2V0KXtcclxuICByZXR1cm4gTVNJRSA/IGZ1bmN0aW9uKGZuLCB0aW1lIC8qLCAuLi5hcmdzICovKXtcclxuICAgIHJldHVybiBzZXQoaW52b2tlKFxyXG4gICAgICBwYXJ0aWFsLFxyXG4gICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXHJcbiAgICAgICQuaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKVxyXG4gICAgKSwgdGltZSk7XHJcbiAgfSA6IHNldDtcclxufVxyXG4kZGVmKCRkZWYuRyArICRkZWYuQiArICRkZWYuRiAqIE1TSUUsIHtcclxuICBzZXRUaW1lb3V0OiAgd3JhcChzZXRUaW1lb3V0KSxcclxuICBzZXRJbnRlcnZhbDogd3JhcChzZXRJbnRlcnZhbClcclxufSk7IiwicmVxdWlyZSgnLi9tb2R1bGVzL2VzNScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuaXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3InKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJhdycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkub2YnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbicpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbGwnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnByb21pc2UnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXAnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LndlYWstc2V0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9qcy5hcnJheS5zdGF0aWNzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIudGltZXJzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIuaW1tZWRpYXRlJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzLyQnKS5jb3JlOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID1cbiAgICB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYgfHwgbnVsbCwgdHJ5TG9jc0xpc3QgfHwgW10pO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuZXJhdG9yID0gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCk7XG4gICAgICB2YXIgY2FsbE5leHQgPSBzdGVwLmJpbmQoZ2VuZXJhdG9yLm5leHQpO1xuICAgICAgdmFyIGNhbGxUaHJvdyA9IHN0ZXAuYmluZChnZW5lcmF0b3JbXCJ0aHJvd1wiXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0ZXAoYXJnKSB7XG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaCh0aGlzLCBudWxsLCBhcmcpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICByZXNvbHZlKGluZm8udmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpbmZvLnZhbHVlKS50aGVuKGNhbGxOZXh0LCBjYWxsVGhyb3cpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbGxOZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGdlbmVyYXRvciA9IG91dGVyRm4gPyBPYmplY3QuY3JlYXRlKG91dGVyRm4ucHJvdG90eXBlKSA6IHRoaXM7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCk7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKFxuICAgICAgICAgICAgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSxcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yLFxuICAgICAgICAgICAgYXJnXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGVsZWdhdGUgZ2VuZXJhdG9yIHJhbiBhbmQgaGFuZGxlZCBpdHMgb3duIGV4Y2VwdGlvbnMgc29cbiAgICAgICAgICAvLyByZWdhcmRsZXNzIG9mIHdoYXQgdGhlIG1ldGhvZCB3YXMsIHdlIGNvbnRpbnVlIGFzIGlmIGl0IGlzXG4gICAgICAgICAgLy8gXCJuZXh0XCIgd2l0aCBhbiB1bmRlZmluZWQgYXJnLlxuICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcbiAgICAgICAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIGFyZyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgXCJhdHRlbXB0IHRvIHNlbmQgXCIgKyBKU09OLnN0cmluZ2lmeShhcmcpICsgXCIgdG8gbmV3Ym9ybiBnZW5lcmF0b3JcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkWWllbGQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IGFyZztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbnRleHQuc2VudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuZGVsZWdhdGUgJiYgbWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cbiAgICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihyZWNvcmQuYXJnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0b3IubmV4dCA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgIGdlbmVyYXRvcltcInRocm93XCJdID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInRocm93XCIpO1xuICAgIGdlbmVyYXRvcltcInJldHVyblwiXSA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJyZXR1cm5cIik7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICAvLyBQcmUtaW5pdGlhbGl6ZSBhdCBsZWFzdCAyMCB0ZW1wb3JhcnkgdmFyaWFibGVzIHRvIGVuYWJsZSBoaWRkZW5cbiAgICAgIC8vIGNsYXNzIG9wdGltaXphdGlvbnMgZm9yIHNpbXBsZSBnZW5lcmF0b3JzLlxuICAgICAgZm9yICh2YXIgdGVtcEluZGV4ID0gMCwgdGVtcE5hbWU7XG4gICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIHRlbXBOYW1lID0gXCJ0XCIgKyB0ZW1wSW5kZXgpIHx8IHRlbXBJbmRleCA8IDIwO1xuICAgICAgICAgICArK3RlbXBJbmRleCkge1xuICAgICAgICB0aGlzW3RlbXBOYW1lXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcbiAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuICAvLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3RcbiAgLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0aGlzXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvYmFiZWwvcG9seWZpbGxcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1jb3JlL3BvbHlmaWxsXCIpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdGh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ub2RlLWd3MlxyXG4qICAgaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6TWFpblxyXG4qXHJcblxyXG4qL1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cdGNvbG9yczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbG9ycy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbG9yc1xyXG5cdGd1aWxkRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2d1aWxkX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9ndWlsZF9kZXRhaWxzXHJcblxyXG5cdGl0ZW1zOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvaXRlbXMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1zXHJcblx0aXRlbURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbXYxL2l0ZW1fZGV0YWlscy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbV9kZXRhaWxzXHJcblx0cmVjaXBlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZXMuanNvbicsXHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVzXHJcblx0cmVjaXBlRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3JlY2lwZV9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlX2RldGFpbHNcclxuXHJcblx0bWFwTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfbmFtZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX25hbWVzXHJcblx0Y29udGluZW50czogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2NvbnRpbmVudHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2NvbnRpbmVudHNcclxuXHRtYXBzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwc1xyXG5cdG1hcEZsb29yOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX2Zsb29yLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9mbG9vclxyXG5cclxuXHRvYmplY3RpdmVOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9vYmplY3RpdmVfbmFtZXMuanNvbicsXHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaGVzXHJcblx0bWF0Y2hlczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaGVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9tYXRjaF9kZXRhaWxzXHJcblx0bWF0Y2hEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoX2RldGFpbHMuanNvbicsXHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L29iamVjdGl2ZV9uYW1lc1xyXG5cclxuXHRtYXRjaGVzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzJyxcclxuXHRtYXRjaERldGFpbHNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tLycsXHJcbn07XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBVQkxJQyBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlx0V09STEQgdnMgV09STERcclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE9iamVjdGl2ZU5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdvYmplY3RpdmVOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdtYXRjaGVzJywge30sIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0dmFyIHd2d19tYXRjaGVzID0gKGRhdGEgJiYgZGF0YS53dndfbWF0Y2hlcykgPyBkYXRhLnd2d19tYXRjaGVzIDogW107XHJcblx0XHRjYWxsYmFjayhlcnIsIHd2d19tYXRjaGVzKTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0dGhyb3cgKCdtYXRjaF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hdGNoRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50cy5tYXRjaGVzU3RhdGU7XHJcblxyXG5cdGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gKCcnICsgcGFyYW1zLm1hdGNoX2lkKTtcclxuXHR9XHJcblxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkIHx8IHdvcmxkX3NsdWdcclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzLm1hdGNoRGV0YWlsc1N0YXRlO1xyXG5cclxuXHRpZiAoIXBhcmFtcy5tYXRjaF9pZCAmJiAhcGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIG1hdGNoX2lkIG9yIHdvcmxkX3NsdWcgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9IHBhcmFtcy5tYXRjaF9pZDtcclxuXHR9XHJcblx0ZWxzZSBpZiAocGFyYW1zLndvcmxkX3NsdWcpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gJ3dvcmxkLycgKyBwYXJhbXMud29ybGRfc2x1ZztcclxuXHR9XHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0R0VORVJBTFxyXG4qL1xyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nLCBpZHNcclxuZnVuY3Rpb24gZ2V0V29ybGROYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cclxuXHRpZiAoIXBhcmFtcy5pZHMpIHtcclxuXHRcdHBhcmFtcy5wYWdlID0gMDtcclxuXHR9XHJcblx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuaWRzKSkge1xyXG5cdFx0cGFyYW1zLmlkcyA9IHBhcmFtcy5pZHMuam9pbignLCcpO1xyXG5cdH1cclxuXHRnZXQoJ3dvcmxkTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogZ3VpbGRfaWQgfHwgZ3VpbGRfbmFtZSAoaWQgdGFrZXMgcHJpb3JpdHkpXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuZ3VpbGRfaWQgJiYgIXBhcmFtcy5ndWlsZF9uYW1lKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBndWlsZF9pZCBvciBndWlsZF9uYW1lIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cclxuXHRnZXQoJ2d1aWxkRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdElURU1TXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0SXRlbXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2l0ZW1zJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBpdGVtX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldEl0ZW1EZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5pdGVtX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2l0ZW1faWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdpdGVtRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldFJlY2lwZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ3JlY2lwZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBSRVFVSVJFRDogcmVjaXBlX2lkXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldFJlY2lwZURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnJlY2lwZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdyZWNpcGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdyZWNpcGVEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TUFQIElORk9STUFUSU9OXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldENvbnRpbmVudHMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2NvbnRpbmVudHMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IG1hcF9pZCwgbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogY29udGluZW50X2lkLCBmbG9vclxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRNYXBGbG9vcihwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuY29udGluZW50X2lkKSB7XHJcblx0XHR0aHJvdyAoJ2NvbnRpbmVudF9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZsb29yKSB7XHJcblx0XHR0aHJvdyAoJ2Zsb29yIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWFwRmxvb3InLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1pc2NlbGxhbmVvdXNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRCdWlsZChjYWxsYmFjaykge1xyXG5cdGdldCgnYnVpbGQnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0Q29sb3JzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdjb2xvcnMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG4vLyB0byBnZXQgZmlsZXM6IGh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUve3NpZ25hdHVyZX0ve2ZpbGVfaWR9Lntmb3JtYXR9XHJcbmZ1bmN0aW9uIGdldEZpbGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdmaWxlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgVVRJTElUWSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG4vLyBTUEVDSUFMIENBU0VcclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChnZXRGaWxlUmVuZGVyVXJsKHBhcmFtcykpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGVSZW5kZXJVcmwocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyVXJsID0gKFxyXG5cdFx0J2h0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvJ1xyXG5cdFx0KyBwYXJhbXMuc2lnbmF0dXJlXHJcblx0XHQrICcvJ1xyXG5cdFx0KyBwYXJhbXMuZmlsZV9pZFxyXG5cdFx0KyAnLidcclxuXHRcdCsgcGFyYW1zLmZvcm1hdFxyXG5cdCk7XHJcblx0cmV0dXJuIHJlbmRlclVybDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXQoa2V5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuXHR2YXIgYXBpVXJsID0gZ2V0QXBpVXJsKGtleSwgcGFyYW1zKTtcclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChhcGlVcmwpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHRyZXF1ZXN0VXJsID0gKGVuZFBvaW50c1tyZXF1ZXN0VXJsXSlcclxuXHRcdD8gZW5kUG9pbnRzW3JlcXVlc3RVcmxdXHJcblx0XHQ6IHJlcXVlc3RVcmw7XHJcblxyXG5cdHZhciBxdWVyeSA9IHFzLnN0cmluZ2lmeShwYXJhbXMpO1xyXG5cclxuXHRpZiAocXVlcnkubGVuZ3RoKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICc/JyArIHF1ZXJ5O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlcXVlc3RVcmw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUpzb24oZGF0YSkge1xyXG5cdHZhciByZXN1bHRzO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0cmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblx0fVxyXG5cdGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290ID0gJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHdpbmRvd1xuICA/IHRoaXNcbiAgOiB3aW5kb3c7XG5cbi8qKlxuICogTm9vcC5cbiAqL1xuXG5mdW5jdGlvbiBub29wKCl7fTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBUT0RPOiBmdXR1cmUgcHJvb2YsIG1vdmUgdG8gY29tcG9lbnQgbGFuZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0hvc3Qob2JqKSB7XG4gIHZhciBzdHIgPSB7fS50b1N0cmluZy5jYWxsKG9iaik7XG5cbiAgc3dpdGNoIChzdHIpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICBjYXNlICdbb2JqZWN0IEJsb2JdJzpcbiAgICBjYXNlICdbb2JqZWN0IEZvcm1EYXRhXSc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAmJiAoJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBhZGRlZCB0byBzdXBwb3J0IElFLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgdHJpbSA9ICcnLnRyaW1cbiAgPyBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKTsgfVxuICA6IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7IH07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgdmFyIHBhaXJzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAobnVsbCAhPSBvYmpba2V5XSkge1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICAgICArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmpba2V5XSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYXJ0cztcbiAgdmFyIHBhaXI7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBhcnRzID0gcGFpci5zcGxpdCgnPScpO1xuICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4cG9zZSBwYXJzZXIuXG4gKi9cblxucmVxdWVzdC5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG4vKipcbiAqIERlZmF1bHQgTUlNRSB0eXBlIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKi9cblxucmVxdWVzdC50eXBlcyA9IHtcbiAgaHRtbDogJ3RleHQvaHRtbCcsXG4gIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgeG1sOiAnYXBwbGljYXRpb24veG1sJyxcbiAgdXJsZW5jb2RlZDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtLWRhdGEnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHNlcmlhbGl6YXRpb24gbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihvYmope1xuICogICAgICAgcmV0dXJuICdnZW5lcmF0ZWQgeG1sIGhlcmUnO1xuICogICAgIH07XG4gKlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZSA9IHtcbiAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBzZXJpYWxpemUsXG4gICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5XG4gfTtcblxuIC8qKlxuICAqIERlZmF1bHQgcGFyc2Vycy5cbiAgKlxuICAqICAgICBzdXBlcmFnZW50LnBhcnNlWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKHN0cil7XG4gICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICAqICAgICB9O1xuICAqXG4gICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgvXFxyP1xcbi8pO1xuICB2YXIgZmllbGRzID0ge307XG4gIHZhciBpbmRleDtcbiAgdmFyIGxpbmU7XG4gIHZhciBmaWVsZDtcbiAgdmFyIHZhbDtcblxuICBsaW5lcy5wb3AoKTsgLy8gdHJhaWxpbmcgQ1JMRlxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBpbmRleCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGZpZWxkID0gbGluZS5zbGljZSgwLCBpbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZHM7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykuc2hpZnQoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcmFtcyhzdHIpe1xuICByZXR1cm4gcmVkdWNlKHN0ci5zcGxpdCgvICo7ICovKSwgZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKVxuICAgICAgLCBrZXkgPSBwYXJ0cy5zaGlmdCgpXG4gICAgICAsIHZhbCA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoa2V5ICYmIHZhbCkgb2JqW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZWAgd2l0aCB0aGUgZ2l2ZW4gYHhocmAuXG4gKlxuICogIC0gc2V0IGZsYWdzICgub2ssIC5lcnJvciwgZXRjKVxuICogIC0gcGFyc2UgaGVhZGVyXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogIEFsaWFzaW5nIGBzdXBlcmFnZW50YCBhcyBgcmVxdWVzdGAgaXMgbmljZTpcbiAqXG4gKiAgICAgIHJlcXVlc3QgPSBzdXBlcmFnZW50O1xuICpcbiAqICBXZSBjYW4gdXNlIHRoZSBwcm9taXNlLWxpa2UgQVBJLCBvciBwYXNzIGNhbGxiYWNrczpcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJykuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJywgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgU2VuZGluZyBkYXRhIGNhbiBiZSBjaGFpbmVkOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5zZW5kKClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnBvc3QoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIE9yIGZ1cnRoZXIgcmVkdWNlZCB0byBhIHNpbmdsZSBjYWxsIGZvciBzaW1wbGUgY2FzZXM6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogQHBhcmFtIHtYTUxIVFRQUmVxdWVzdH0geGhyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2UocmVxLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLnJlcSA9IHJlcTtcbiAgdGhpcy54aHIgPSB0aGlzLnJlcS54aHI7XG4gIC8vIHJlc3BvbnNlVGV4dCBpcyBhY2Nlc3NpYmxlIG9ubHkgaWYgcmVzcG9uc2VUeXBlIGlzICcnIG9yICd0ZXh0JyBhbmQgb24gb2xkZXIgYnJvd3NlcnNcbiAgdGhpcy50ZXh0ID0gKCh0aGlzLnJlcS5tZXRob2QgIT0nSEVBRCcgJiYgKHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJycgfHwgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndGV4dCcpKSB8fCB0eXBlb2YgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndW5kZWZpbmVkJylcbiAgICAgPyB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgOiBudWxsO1xuICB0aGlzLnN0YXR1c1RleHQgPSB0aGlzLnJlcS54aHIuc3RhdHVzVGV4dDtcbiAgdGhpcy5zZXRTdGF0dXNQcm9wZXJ0aWVzKHRoaXMueGhyLnN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcbiAgdGhpcy5ib2R5ID0gdGhpcy5yZXEubWV0aG9kICE9ICdIRUFEJ1xuICAgID8gdGhpcy5wYXJzZUJvZHkodGhpcy50ZXh0ID8gdGhpcy50ZXh0IDogdGhpcy54aHIucmVzcG9uc2UpXG4gICAgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgcmV0dXJuIHBhcnNlICYmIHN0ciAmJiAoc3RyLmxlbmd0aCB8fCBzdHIgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cyB8fCAxMjIzID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307XG4gIHRoaXMuX2hlYWRlciA9IHt9O1xuICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBlcnIgPSBudWxsO1xuICAgIHZhciByZXMgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcignUGFyc2VyIGlzIHVuYWJsZSB0byBwYXJzZSB0aGUgcmVzcG9uc2UnKTtcbiAgICAgIGVyci5wYXJzZSA9IHRydWU7XG4gICAgICBlcnIub3JpZ2luYWwgPSBlO1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICBpZiAocmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIHZhciBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgIG5ld19lcnIub3JpZ2luYWwgPSBlcnI7XG4gICAgbmV3X2Vyci5yZXNwb25zZSA9IHJlcztcbiAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG5cbiAgICBzZWxmLmNhbGxiYWNrKGVyciB8fCBuZXdfZXJyLCByZXMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBTZXQgdGltZW91dCB0byBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbihtcyl7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3RpbWVvdXQgPSAwO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmFib3J0ZWQpIHJldHVybjtcbiAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIuYWJvcnQoKTtcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5nZXRIZWFkZXIgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3Mpe1xuICB2YXIgc3RyID0gYnRvYSh1c2VyICsgJzonICsgcGFzcyk7XG4gIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuKlxuKiBFeGFtcGxlczpcbipcbiogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4qICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4qXG4qIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4qIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuKiBAYXBpIHB1YmxpY1xuKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpe1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkgdmFsID0gc2VyaWFsaXplKHZhbCk7XG4gIGlmICh2YWwpIHRoaXMuX3F1ZXJ5LnB1c2godmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICogcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBmaWxlbmFtZWAuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgdGhpcy5fZm9ybURhdGEuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBxdWVyeXN0cmluZ1xuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG11bHRpcGxlIGRhdGEgXCJ3cml0ZXNcIlxuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuc2VuZCh7IHNlYXJjaDogJ3F1ZXJ5JyB9KVxuICogICAgICAgICAuc2VuZCh7IHJhbmdlOiAnMS4uNScgfSlcbiAqICAgICAgICAgLnNlbmQoeyBvcmRlcjogJ2Rlc2MnIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaiB8fCBpc0hvc3QoZGF0YSkpIHJldHVybiB0aGlzO1xuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdPcmlnaW4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggdGltZW91dCBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0RXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ3RpbWVvdXQgb2YgJyArIHRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnKTtcbiAgZXJyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSB0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCk7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoNCAhPSB4aHIucmVhZHlTdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gSW4gSUU5LCByZWFkcyB0byBhbnkgcHJvcGVydHkgKGUuZy4gc3RhdHVzKSBvZmYgb2YgYW4gYWJvcnRlZCBYSFIgd2lsbFxuICAgIC8vIHJlc3VsdCBpbiB0aGUgZXJyb3IgXCJDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcIlxuICAgIHZhciBzdGF0dXM7XG4gICAgdHJ5IHsgc3RhdHVzID0geGhyLnN0YXR1cyB9IGNhdGNoKGUpIHsgc3RhdHVzID0gMDsgfVxuXG4gICAgaWYgKDAgPT0gc3RhdHVzKSB7XG4gICAgICBpZiAoc2VsZi50aW1lZG91dCkgcmV0dXJuIHNlbGYudGltZW91dEVycm9yKCk7XG4gICAgICBpZiAoc2VsZi5hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdHJ5IHtcbiAgICBpZiAoeGhyLnVwbG9hZCAmJiB0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICAgICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICAgICAgfTtcbiAgICB9XG4gIH0gY2F0Y2goZSkge1xuICAgIC8vIEFjY2Vzc2luZyB4aHIudXBsb2FkIGZhaWxzIGluIElFIGZyb20gYSB3ZWIgd29ya2VyLCBzbyBqdXN0IHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cbiAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODM3MjQ1L3htbGh0dHByZXF1ZXN0LXVwbG9hZC10aHJvd3MtaW52YWxpZC1hcmd1bWVudC13aGVuLXVzZWQtZnJvbS13ZWItd29ya2VyLWNvbnRleHRcbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QocXVlcnkpO1xuICAgIHRoaXMudXJsICs9IH50aGlzLnVybC5pbmRleE9mKCc/JylcbiAgICAgID8gJyYnICsgcXVlcnlcbiAgICAgIDogJz8nICsgcXVlcnk7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIWlzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVt0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyldO1xuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuICB4aHIuc2VuZChkYXRhKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmRlbCA9IGZ1bmN0aW9uKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcbi8qKlxuICogUmVkdWNlIGBhcnJgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge01peGVkfSBpbml0aWFsXG4gKlxuICogVE9ETzogY29tYmF0aWJsZSBlcnJvciBoYW5kbGluZz9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpeyAgXG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIGN1cnIgPSBhcmd1bWVudHMubGVuZ3RoID09IDNcbiAgICA/IGluaXRpYWxcbiAgICA6IGFycltpZHgrK107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGN1cnIgPSBmbi5jYWxsKG51bGwsIGN1cnIsIGFycltpZHhdLCArK2lkeCwgYXJyKTtcbiAgfVxuICBcbiAgcmV0dXJuIGN1cnI7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IFwiMVwiLCBcImVuXCI6IFwiT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlXCIsIFwiZXNcIjogXCJNaXJhZG9yXCIsIFwiZGVcIjogXCJBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogXCIyXCIsIFwiZW5cIjogXCJWYWxsZXlcIiwgXCJmclwiOiBcIlZhbGzDqWVcIiwgXCJlc1wiOiBcIlZhbGxlXCIsIFwiZGVcIjogXCJUYWxcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IFwiM1wiLCBcImVuXCI6IFwiTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXNcIiwgXCJlc1wiOiBcIlZlZ2FcIiwgXCJkZVwiOiBcIlRpZWZsYW5kXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiBcIjRcIiwgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIiwgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiLCBcImVzXCI6IFwiQ2xhcm8gR29sYW50YVwiLCBcImRlXCI6IFwiR29sYW50YS1MaWNodHVuZ1wifSxcclxuXHRcIjVcIjoge1wiaWRcIjogXCI1XCIsIFwiZW5cIjogXCJQYW5nbG9zcyBSaXNlXCIsIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCIsIFwiZXNcIjogXCJDb2xpbmEgUGFuZ2xvc3NcIiwgXCJkZVwiOiBcIlBhbmdsb3NzLUFuaMO2aGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IFwiNlwiLCBcImVuXCI6IFwiU3BlbGRhbiBDbGVhcmN1dFwiLCBcImZyXCI6IFwiRm9yw6p0IHJhc8OpZSBkZSBTcGVsZGFuXCIsIFwiZXNcIjogXCJDbGFybyBFc3BlbGRpYVwiLCBcImRlXCI6IFwiU3BlbGRhbiBLYWhsc2NobGFnXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiBcIjdcIiwgXCJlblwiOiBcIkRhbmVsb24gUGFzc2FnZVwiLCBcImZyXCI6IFwiUGFzc2FnZSBEYW5lbG9uXCIsIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLCBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiBcIjhcIiwgXCJlblwiOiBcIlVtYmVyZ2xhZGUgV29vZHNcIiwgXCJmclwiOiBcIkJvaXMgZCdPbWJyZWNsYWlyXCIsIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiBcIjlcIiwgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIiwgXCJmclwiOiBcIkNow6J0ZWF1IEJydW1lcGllcnJlXCIsIFwiZXNcIjogXCJDYXN0aWxsbyBQaWVkcmFuaWVibGFcIiwgXCJkZVwiOiBcIlNjaGxvc3MgU3RlaW5uZWJlbFwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IFwiMTBcIiwgXCJlblwiOiBcIlJvZ3VlJ3MgUXVhcnJ5XCIsIFwiZnJcIjogXCJDYXJyacOocmUgZGVzIHZvbGV1cnNcIiwgXCJlc1wiOiBcIkNhbnRlcmEgZGVsIFDDrWNhcm9cIiwgXCJkZVwiOiBcIlNjaHVya2VuYnJ1Y2hcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiBcIjExXCIsIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCIsIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogXCIxMlwiLCBcImVuXCI6IFwiV2lsZGNyZWVrIFJ1blwiLCBcImZyXCI6IFwiUGlzdGUgZHUgUnVpc3NlYXUgc2F1dmFnZVwiLCBcImVzXCI6IFwiUGlzdGEgQXJyb3lvc2FsdmFqZVwiLCBcImRlXCI6IFwiV2lsZGJhY2hzdHJlY2tlXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogXCIxM1wiLCBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIiwgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCIsIFwiZXNcIjogXCJDZW5hZ2FsIGRlIEplcnJpZmVyXCIsIFwiZGVcIjogXCJKZXJyaWZlcnMgU3VtcGZsb2NoXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogXCIxNFwiLCBcImVuXCI6IFwiS2xvdmFuIEd1bGx5XCIsIFwiZnJcIjogXCJQZXRpdCByYXZpbiBkZSBLbG92YW5cIiwgXCJlc1wiOiBcIkJhcnJhbmNvIEtsb3ZhblwiLCBcImRlXCI6IFwiS2xvdmFuLVNlbmtlXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogXCIxNVwiLCBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBMYW5nb3JcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIExhbmdvclwiLCBcImRlXCI6IFwiTGFuZ29yIC0gU2NobHVjaHRcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiBcIjE2XCIsIFwiZW5cIjogXCJRdWVudGluIExha2VcIiwgXCJmclwiOiBcIkxhYyBRdWVudGluXCIsIFwiZXNcIjogXCJMYWdvIFF1ZW50aW5cIiwgXCJkZVwiOiBcIlF1ZW50aW5zZWVcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiBcIjE3XCIsIFwiZW5cIjogXCJNZW5kb24ncyBHYXBcIiwgXCJmclwiOiBcIkZhaWxsZSBkZSBNZW5kb25cIiwgXCJlc1wiOiBcIlphbmphIGRlIE1lbmRvblwiLCBcImRlXCI6IFwiTWVuZG9ucyBTcGFsdFwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IFwiMThcIiwgXCJlblwiOiBcIkFuemFsaWFzIFBhc3NcIiwgXCJmclwiOiBcIkNvbCBkJ0FuemFsaWFzXCIsIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogXCIxOVwiLCBcImVuXCI6IFwiT2dyZXdhdGNoIEN1dFwiLCBcImZyXCI6IFwiUGVyY8OpZSBkZSBHYXJkb2dyZVwiLCBcImVzXCI6IFwiVGFqbyBkZSBsYSBHdWFyZGlhIGRlbCBPZ3JvXCIsIFwiZGVcIjogXCJPZ2Vyd2FjaHQtS2FuYWxcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiBcIjIwXCIsIFwiZW5cIjogXCJWZWxva2EgU2xvcGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiLCBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLCBcImRlXCI6IFwiVmVsb2thLUhhbmdcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiBcIjIxXCIsIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIER1cmlvc1wiLCBcImVzXCI6IFwiQmFycmFuY28gRHVyaW9zXCIsIFwiZGVcIjogXCJEdXJpb3MtU2NobHVjaHRcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiBcIjIyXCIsIFwiZW5cIjogXCJCcmF2b3N0IEVzY2FycG1lbnRcIiwgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiLCBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLCBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiBcIjIzXCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IFwiMjRcIiwgXCJlblwiOiBcIkNoYW1waW9uJ3MgRGVtZW5zZVwiLCBcImZyXCI6IFwiRmllZiBkdSBjaGFtcGlvblwiLCBcImVzXCI6IFwiRG9taW5pbyBkZWwgQ2FtcGXDs25cIiwgXCJkZVwiOiBcIkxhbmRndXQgZGVzIENoYW1waW9uc1wifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IFwiMjVcIiwgXCJlblwiOiBcIlJlZGJyaWFyXCIsIFwiZnJcIjogXCJCcnV5ZXJvdWdlXCIsIFwiZXNcIjogXCJaYXJ6YXJyb2phXCIsIFwiZGVcIjogXCJSb3Rkb3Juc3RyYXVjaFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IFwiMjZcIiwgXCJlblwiOiBcIkdyZWVubGFrZVwiLCBcImZyXCI6IFwiTGFjIFZlcnRcIiwgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zZWVcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiBcIjI3XCIsIFwiZW5cIjogXCJBc2NlbnNpb24gQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlIGwnQXNjZW5zaW9uXCIsIFwiZXNcIjogXCJCYWjDrWEgZGUgbGEgQXNjZW5zacOzblwiLCBcImRlXCI6IFwiQnVjaHQgZGVzIEF1ZnN0aWVnc1wifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IFwiMjhcIiwgXCJlblwiOiBcIkRhd24ncyBFeXJpZVwiLCBcImZyXCI6IFwiUHJvbW9udG9pcmUgZGUgbCdhdWJlXCIsIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLCBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmRhbW1lcnVuZ1wifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IFwiMjlcIiwgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLCBcImZyXCI6IFwiTCdhbnRyZSBkZXMgZXNwcml0c1wiLCBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIiwgXCJkZVwiOiBcIkRlciBHZWlzdGVyaG9sbVwifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IFwiMzBcIiwgXCJlblwiOiBcIldvb2RoYXZlblwiLCBcImZyXCI6IFwiR2VudGVzeWx2ZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLCBcImRlXCI6IFwiV2FsZCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IFwiMzFcIiwgXCJlblwiOiBcIkFza2FsaW9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEFza2FsaW9uXCIsIFwiZGVcIjogXCJBc2thbGlvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IFwiMzJcIiwgXCJlblwiOiBcIkV0aGVyb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnRXRoZXJvblwiLCBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsIFwiZGVcIjogXCJFdGhlcm9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogXCIzM1wiLCBcImVuXCI6IFwiRHJlYW1pbmcgQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIiwgXCJlc1wiOiBcIkJhaMOtYSBPbsOtcmljYVwiLCBcImRlXCI6IFwiVHJhdW1idWNodFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IFwiMzRcIiwgXCJlblwiOiBcIlZpY3RvcidzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSB2YWlucXVldXJcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBWZW5jZWRvclwiLCBcImRlXCI6IFwiU2llZ2VyIC0gSMO8dHRlXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogXCIzNVwiLCBcImVuXCI6IFwiR3JlZW5icmlhclwiLCBcImZyXCI6IFwiVmVydGVicmFuY2hlXCIsIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiBcIjM2XCIsIFwiZW5cIjogXCJCbHVlbGFrZVwiLCBcImZyXCI6IFwiTGFjIGJsZXVcIiwgXCJlc1wiOiBcIkxhZ29henVsXCIsIFwiZGVcIjogXCJCbGF1c2VlXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogXCIzN1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiBcIjM4XCIsIFwiZW5cIjogXCJMb25ndmlld1wiLCBcImZyXCI6IFwiTG9uZ3VldnVlXCIsIFwiZXNcIjogXCJWaXN0YWx1ZW5nYVwiLCBcImRlXCI6IFwiV2VpdHNpY2h0XCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogXCIzOVwiLCBcImVuXCI6IFwiVGhlIEdvZHN3b3JkXCIsIFwiZnJcIjogXCJMJ0Vww6llIGRpdmluZVwiLCBcImVzXCI6IFwiTGEgSG9qYSBEaXZpbmFcIiwgXCJkZVwiOiBcIkRhcyBHb3R0c2Nod2VydFwifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IFwiNDBcIiwgXCJlblwiOiBcIkNsaWZmc2lkZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgZmFsYWlzZVwiLCBcImVzXCI6IFwiRGVzcGXDsWFkZXJvXCIsIFwiZGVcIjogXCJGZWxzd2FuZFwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IFwiNDFcIiwgXCJlblwiOiBcIlNoYWRhcmFuIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkZSBTaGFkYXJhblwiLCBcImVzXCI6IFwiQ29saW5hcyBTaGFkYXJhblwiLCBcImRlXCI6IFwiU2hhZGFyYW4gSMO8Z2VsXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogXCI0MlwiLCBcImVuXCI6IFwiUmVkbGFrZVwiLCBcImZyXCI6IFwiUm91Z2VsYWNcIiwgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLCBcImRlXCI6IFwiUm90c2VlXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogXCI0M1wiLCBcImVuXCI6IFwiSGVybydzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIiwgXCJkZVwiOiBcIkjDvHR0ZSBkZXMgSGVsZGVuXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogXCI0NFwiLCBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkdSBOb2lyIGTDqWNsaW5cIiwgXCJlc1wiOiBcIkJhaMOtYSBTYWx0byBBY2lhZ29cIiwgXCJkZVwiOiBcIlNjaHJlY2tlbnNmYWxsIC0gQnVjaHRcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiBcIjQ1XCIsIFwiZW5cIjogXCJCbHVlYnJpYXJcIiwgXCJmclwiOiBcIkJydXlhenVyXCIsIFwiZXNcIjogXCJaYXJ6YXp1bFwiLCBcImRlXCI6IFwiQmxhdWRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogXCI0NlwiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiBcIjQ3XCIsIFwiZW5cIjogXCJTdW5ueWhpbGxcIiwgXCJmclwiOiBcIkNvbGxpbmUgZW5zb2xlaWxsw6llXCIsIFwiZXNcIjogXCJDb2xpbmEgU29sZWFkYVwiLCBcImRlXCI6IFwiU29ubmVubGljaHRow7xnZWxcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiBcIjQ4XCIsIFwiZW5cIjogXCJGYWl0aGxlYXBcIiwgXCJmclwiOiBcIkZlcnZldXJcIiwgXCJlc1wiOiBcIlNhbHRvIGRlIEZlXCIsIFwiZGVcIjogXCJHbGF1YmVuc3NwcnVuZ1wifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IFwiNDlcIiwgXCJlblwiOiBcIkJsdWV2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIGJsZXV2YWxcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVhenVsXCIsIFwiZGVcIjogXCJCbGF1dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiBcIjUwXCIsIFwiZW5cIjogXCJCbHVld2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtQXp1clwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsIFwiZGVcIjogXCJCbGF1d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiBcIjUxXCIsIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLCBcImZyXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJlc1wiOiBcIklzbGV0YSBBc3RyYWxcIiwgXCJkZVwiOiBcIkFzdHJhbGhvbG1cIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiBcIjUyXCIsIFwiZW5cIjogXCJBcmFoJ3MgSG9wZVwiLCBcImZyXCI6IFwiRXNwb2lyIGQnQXJhaFwiLCBcImVzXCI6IFwiRXNwZXJhbnphIGRlIEFyYWhcIiwgXCJkZVwiOiBcIkFyYWhzIEhvZmZudW5nXCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogXCI1M1wiLCBcImVuXCI6IFwiR3JlZW52YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHZlcnRcIiwgXCJlc1wiOiBcIlJlZnVnaW8gZGUgVmFsbGV2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG50YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IFwiNTRcIiwgXCJlblwiOiBcIkZvZ2hhdmVuXCIsIFwiZnJcIjogXCJIYXZyZSBncmlzXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIE5lYmxpbm9zb1wiLCBcImRlXCI6IFwiTmViZWwgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiBcIjU1XCIsIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWFycm9qYVwiLCBcImRlXCI6IFwiUm90d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiBcIjU2XCIsIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIiwgXCJmclwiOiBcIkJyYXMgZHUgdGl0YW5cIiwgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIiwgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogXCI1N1wiLCBcImVuXCI6IFwiQ3JhZ3RvcFwiLCBcImZyXCI6IFwiU29tbWV0IGRlIGwnZXNjYXJwZW1lbnRcIiwgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsIFwiZGVcIjogXCJGZWxzZW5zcGl0emVcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiBcIjU4XCIsIFwiZW5cIjogXCJHb2RzbG9yZVwiLCBcImZyXCI6IFwiRGl2aW5hdGlvblwiLCBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsIFwiZGVcIjogXCJHw7Z0dGVya3VuZGVcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiBcIjU5XCIsIFwiZW5cIjogXCJSZWR2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcm9qb1wiLCBcImRlXCI6IFwiUm90dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiBcIjYwXCIsIFwiZW5cIjogXCJTdGFyZ3JvdmVcIiwgXCJmclwiOiBcIkJvc3F1ZXQgc3RlbGxhaXJlXCIsIFwiZXNcIjogXCJBcmJvbGVkYSBkZSBsYXMgRXN0cmVsbGFzXCIsIFwiZGVcIjogXCJTdGVybmVuaGFpblwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IFwiNjFcIiwgXCJlblwiOiBcIkdyZWVud2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtVmVyZG95YW50ZVwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xud2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiBcIjYyXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogXCI2M1wiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IFwiNjRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiBcIjY1XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IFwiNjZcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiBcIjY3XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogXCI2OFwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiBcIjY5XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogXCI3MFwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IFwiNzFcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiBcIjcyXCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogXCI3M1wiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiBcIjc0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogXCI3NVwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IFwiNzZcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdHtcclxuXHRcdFwia2V5XCI6IFwiQ2VudGVyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFdGVybmFsIEJhdHRsZWdyb3VuZHNcIixcclxuXHRcdFwiYWJiclwiOiBcIkVCR1wiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAzLFxyXG5cdFx0XCJjb2xvclwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQ2FzdGxlXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs5XSwgXHRcdFx0XHRcdFx0XHRcdC8vIHNtXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiUmVkIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsxLCAxNywgMjAsIDE4LCAxOSwgNiwgNV0sXHRcdC8vIG92ZXJsb29rLCBtZW5kb25zLCB2ZWxva2EsIGFueiwgb2dyZSwgc3BlbGRhbiwgcGFuZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkJsdWUgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyLCAxNSwgMjIsIDE2LCAyMSwgNywgOF1cdFx0XHQvLyB2YWxsZXksIGxhbmdvciwgYnJhdm9zdCwgcXVlbnRpbiwgZHVyaW9zLCBkYW5lLCB1bWJlclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkdyZWVuIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMsIDExLCAxMywgMTIsIDE0LCAxMCwgNF0gXHRcdC8vIGxvd2xhbmRzLCBhbGRvbnMsIGplcnJpZmVyLCB3aWxkY3JlZWssIGtsb3Zhbiwgcm9ndWVzLCBnb2xhbnRhXHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIlJlZEhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIlJlZEhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIlJlZFwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAwLFxyXG5cdFx0XCJjb2xvclwiOiBcInJlZFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszNywgMzMsIDMyXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBsb25ndmlldywgY2xpZmZzaWRlLCBnb2Rzd29yZCwgaG9wZXMsIGFzdHJhbFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM4LCA0MCwgMzksIDUyLCA1MV0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBsb25ndmlldywgY2xpZmZzaWRlLCBnb2Rzd29yZCwgaG9wZXMsIGFzdHJhbFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszNSwgMzYsIDM0LCA1MywgNTBdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNjIsIDYzLCA2NCwgNjUsIDY2XSBcdFx0XHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkJsdVwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAyLFxyXG5cdFx0XCJjb2xvclwiOiBcImJsdWVcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIzLCAyNywgMzFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszMCwgMjgsIDI5LCA1OCwgNjBdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzI1LCAyNiwgMjQsIDU5LCA2MV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgY2hhbXAsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3MSwgNzAsIDY5LCA2OCwgNjddIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJHcm5cIixcclxuXHRcdFwibWFwSW5kZXhcIjogMSxcclxuXHRcdFwiY29sb3JcIjogXCJncmVlblwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ2LCA0NCwgNDFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDcsIDU3LCA1NiwgNDgsIDU0XSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NSwgNDIsIDQzLCA0OSwgNTVdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzYgLCA3NSAsIDc0ICwgNzMgLCA3MiBdIFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdXHJcblx0fSxcclxuXTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Ly9cdEVCR1xyXG5cdFwiOVwiOlx0e1widHlwZVwiOiAxLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAwLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTdG9uZW1pc3QgQ2FzdGxlXHJcblxyXG5cdC8vXHRSZWQgQ29ybmVyXHJcblx0XCIxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFJlZCBLZWVwIC0gT3Zlcmxvb2tcclxuXHRcIjE3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIE1lbmRvbidzIEdhcFxyXG5cdFwiMjBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gVmVsb2thIFNsb3BlXHJcblx0XCIxOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBBbnphbGlhcyBQYXNzXHJcblx0XCIxOVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBPZ3Jld2F0Y2ggQ3V0XHJcblx0XCI2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBDYW1wIC0gTWlsbCAtIFNwZWxkYW5cclxuXHRcIjVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIENhbXAgLSBNaW5lIC0gUGFuZ2xvc3NcclxuXHJcblx0Ly9cdEJsdWUgQ29ybmVyXHJcblx0XCIyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgS2VlcCAtIFZhbGxleVxyXG5cdFwiMTVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIExhbmdvciBHdWxjaFxyXG5cdFwiMjJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIEJyYXZvc3QgRXNjYXJwbWVudFxyXG5cdFwiMTZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIFF1ZW50aW4gTGFrZVxyXG5cdFwiMjFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIER1cmlvcyBHdWxjaFxyXG5cdFwiN1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBCbHVlIENhbXAgLSBNaW5lIC0gRGFuZWxvblxyXG5cdFwiOFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIENhbXAgLSBNaWxsIC0gVW1iZXJnbGFkZVxyXG5cclxuXHQvL1x0R3JlZW4gQ29ybmVyXHJcblx0XCIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIEtlZXAgLSBMb3dsYW5kc1xyXG5cdFwiMTFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBBbGRvbnNcclxuXHRcIjEzXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gSmVycmlmZXIncyBTbG91Z2hcclxuXHRcIjEyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gV2lsZGNyZWVrXHJcblx0XCIxNFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEtsb3ZhbiBHdWxseVxyXG5cdFwiMTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbmUgLSBSb2d1ZXMgUXVhcnJ5XHJcblx0XCI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIENhbXAgLSBNaWxsIC0gR29sYW50YVxyXG5cclxuXHJcblx0Ly9cdFJlZEhvbWVcclxuXHRcIjM3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIzM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhbWluZyBCYXlcclxuXHRcIjMyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gRXRoZXJvbiBIaWxsc1xyXG5cdFwiMzhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBMb25ndmlld1xyXG5cdFwiNDBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDbGlmZnNpZGVcclxuXHRcIjM5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIEdvZHN3b3JkXHJcblx0XCI1MlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEFyYWgncyBIb3BlXHJcblx0XCI1MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEFzdHJhbGhvbG1lXHJcblxyXG5cdFwiMzVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBHcmVlbmJyaWFyXHJcblx0XCIzNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEJsdWVsYWtlXHJcblx0XCIzNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIFZpY3RvcidzIExvZGdlXHJcblx0XCI1M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBHcmVlbnZhbGUgUmVmdWdlXHJcblx0XCI1MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gQmx1ZXdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0R3JlZW5Ib21lXHJcblx0XCI0NlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiNDRcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYWRmYWxsIEJheVxyXG5cdFwiNDFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBTaGFkYXJhbiBIaWxsc1xyXG5cdFwiNDdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBTdW5ueWhpbGxcclxuXHRcIjU3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ3JhZ3RvcFxyXG5cdFwiNTZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgVGl0YW5wYXdcclxuXHRcIjQ4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gRmFpdGhsZWFwXHJcblx0XCI1NFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEZvZ2hhdmVuXHJcblxyXG5cdFwiNDVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBCbHVlYnJpYXJcclxuXHRcIjQyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gUmVkbGFrZVxyXG5cdFwiNDNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBIZXJvJ3MgTG9kZ2VcclxuXHRcIjQ5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEJsdWV2YWxlIFJlZnVnZVxyXG5cdFwiNTVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIFJlZHdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0Qmx1ZUhvbWVcclxuXHRcIjIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIyN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBBc2NlbnNpb24gQmF5XHJcblx0XCIzMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEFza2FsaW9uIEhpbGxzXHJcblx0XCIzMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFdvb2RoYXZlblxyXG5cdFwiMjhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBEYXduJ3MgRXlyaWVcclxuXHRcIjI5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFNwaXJpdGhvbG1lXHJcblx0XCI1OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEdvZHNsb3JlXHJcblx0XCI2MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIFN0YXJncm92ZVxyXG5cclxuXHRcIjI1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gUmVkYnJpYXJcclxuXHRcIjI2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gR3JlZW5sYWtlXHJcblx0XCIyNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIENoYW1waW9uJ3MgRGVtZW5zZVxyXG5cdFwiNTlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gUmVkdmFsZSBSZWZ1Z2VcclxuXHRcIjYxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBHcmVlbndhdGVyIExvd2xhbmRzXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcIm5hbWVcIjogXCJHcmVlbiBNaWxsXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcIm5hbWVcIjogXCJSZWQgTWluZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJuYW1lXCI6IFwiUmVkIE1pbGxcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwibmFtZVwiOiBcIkJsdWUgTWluZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJuYW1lXCI6IFwiQmx1ZSBNaWxsXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcIm5hbWVcIjogXCJDYXN0bGVcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiAxMCwgXCJuYW1lXCI6IFwiR3JlZW4gTWluZVwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IDExLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IDEyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IDEzLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IDE0LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IDE1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IDE2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IDE3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IDE4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IDE5LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IDIwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IDIxLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IDIyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IDIzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogMjUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogMjQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiAyNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiAyNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IDI4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IDI5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogMzAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogMzEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiAzMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IDMzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogMzQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiAzNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiAzNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiAzNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IDM4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IDM5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogNDAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogNDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiA0MiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiA0MywgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IDQ0LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogNDUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogNDYsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiA0NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiA0OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogNDksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogNTAsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IDUxLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IDUyLCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiA1MywgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiA1NCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiA1NSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogNTYsIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiA1NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiA1OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogNTksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogNjAsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogNjEsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IDYyLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IDYzLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogNjQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IDY1LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IDY2LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogNjcsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiA2OCwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiA2OSwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogNzAsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiA3MSwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiA3MiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IDczLCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IDc0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiA3NSwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IDc2LCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDM1LCBcIm5hbWVcIjogXCJjYXN0bGVcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAyNSwgXCJuYW1lXCI6IFwia2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDEwLCBcIm5hbWVcIjogXCJ0b3dlclwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDUsIFwibmFtZVwiOiBcImNhbXBcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJ0ZW1wbGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJob2xsb3dcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJlc3RhdGVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJvdmVybG9va1wifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImFzY2VudFwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGxhbmdzOiByZXF1aXJlKCcuL2RhdGEvbGFuZ3MnKSxcclxuXHR3b3JsZHM6IHJlcXVpcmUoJy4vZGF0YS93b3JsZF9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV9uYW1lczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV90eXBlczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV90eXBlcycpLFxyXG5cdG9iamVjdGl2ZV9tZXRhOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21ldGEnKSxcclxuXHRvYmplY3RpdmVfbGFiZWxzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX2xhYmVscycpLFxyXG5cdG9iamVjdGl2ZV9tYXA6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWFwJyksXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaFdvcmxkID0gcmVxdWlyZSgnLi9NYXRjaFdvcmxkJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KFwic2NvcmVzXCIpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KFwic2NvcmVzXCIpKTtcclxuXHRcdGNvbnN0IG5ld01hdGNoID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldChcInN0YXJ0VGltZVwiKSwgbmV4dFByb3BzLm1hdGNoLmdldChcInN0YXJ0VGltZVwiKSk7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMgfHwgbmV3TWF0Y2ggfHwgbmV3V29ybGRzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaDo6cmVuZGVyKCknLCBwcm9wcy5tYXRjaC50b0pTKCkpO1xyXG5cclxuXHRcdGNvbnN0IHdvcmxkQ29sb3JzID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddO1xyXG5cclxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1hdGNoQ29udGFpbmVyXCI+XHJcblx0XHRcdDx0YWJsZSBjbGFzc05hbWU9XCJtYXRjaFwiPlxyXG5cdFx0XHRcdHt3b3JsZENvbG9ycy5tYXAoKGNvbG9yLCBpeENvbG9yKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCB3b3JsZEtleSA9IGNvbG9yICsgJ0lkJztcclxuXHRcdFx0XHRcdGNvbnN0IHdvcmxkSWQgPSBwcm9wcy5tYXRjaC5nZXQod29ybGRLZXkpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRjb25zdCB3b3JsZCA9IHByb3BzLndvcmxkcy5nZXQod29ybGRJZCk7XHJcblx0XHRcdFx0XHRjb25zdCBzY29yZXMgPSBwcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiA8TWF0Y2hXb3JsZFxyXG5cdFx0XHRcdFx0XHRjb21wb25lbnQ9J3RyJ1xyXG5cdFx0XHRcdFx0XHRrZXk9e3dvcmxkSWR9XHJcblxyXG5cdFx0XHRcdFx0XHR3b3JsZD17d29ybGR9XHJcblx0XHRcdFx0XHRcdHNjb3Jlcz17c2NvcmVzfVxyXG5cclxuXHRcdFx0XHRcdFx0Y29sb3I9e2NvbG9yfVxyXG5cdFx0XHRcdFx0XHRpeENvbG9yPXtpeENvbG9yfVxyXG5cdFx0XHRcdFx0XHRzaG93UGllPXtpeENvbG9yID09PSAwfVxyXG5cdFx0XHRcdFx0Lz47XHJcblx0XHRcdFx0fSl9XHJcblx0XHRcdDwvdGFibGU+XHJcblx0XHQ8L2Rpdj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hdGNoLnByb3BUeXBlcyA9IHtcclxuXHRtYXRjaDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNjb3JlID0gcmVxdWlyZSgnLi9TY29yZScpO1xyXG5jb25zdCBQaWUgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvUGllJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hdGNoV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1Njb3JlcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG5cdFx0Y29uc3QgbmV3Q29sb3IgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuY29sb3IsIG5leHRQcm9wcy5jb2xvcik7XHJcblx0XHRjb25zdCBuZXdXb3JsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMgfHwgbmV3Q29sb3IgfHwgbmV3V29ybGQpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdTY29yZXMsIG5ld0NvbG9yLCBuZXdXb3JsZCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG5cdFx0cmV0dXJuIDx0cj5cclxuXHRcdFx0PHRkIGNsYXNzTmFtZT17YHRlYW0gbmFtZSAke3Byb3BzLmNvbG9yfWB9PlxyXG5cdFx0XHRcdDxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT57cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9PC9hPlxyXG5cdFx0XHQ8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3NOYW1lPXtgdGVhbSBzY29yZSAke3Byb3BzLmNvbG9yfWB9PlxyXG5cdFx0XHRcdDxTY29yZVxyXG5cdFx0XHRcdFx0dGVhbT17cHJvcHMuY29sb3J9XHJcblx0XHRcdFx0XHRzY29yZT17cHJvcHMuc2NvcmVzLmdldChwcm9wcy5peENvbG9yKX1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L3RkPlxyXG5cdFx0XHR7KHByb3BzLnNob3dQaWUpXHJcblx0XHRcdFx0PyA8dGQgcm93U3Bhbj1cIjNcIiBjbGFzc05hbWU9XCJwaWVcIj5cclxuXHRcdFx0XHRcdDxQaWVcclxuXHRcdFx0XHRcdFx0c2NvcmVzPXtwcm9wcy5zY29yZXN9XHJcblx0XHRcdFx0XHRcdHNpemU9ezYwfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQ8L3RkPlxyXG5cdFx0XHRcdDogbnVsbFxyXG5cdFx0XHR9XHJcblx0XHQ8L3RyPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWF0Y2hXb3JsZC5wcm9wVHlwZXMgPSB7XHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0c2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGl4Q29sb3I6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHRzaG93UGllOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hXb3JsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqUXVlcnknKTtcclxuY29uc3QgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFNjb3JlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHtkaWZmOiAwfTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyl7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7ZGlmZjogbmV4dFByb3BzLnNjb3JlIC0gcHJvcHMuc2NvcmV9KTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdGlmKHN0YXRlLmRpZmYgIT09IDApIHtcclxuXHRcdFx0YW5pbWF0ZVNjb3JlRGlmZih0aGlzLnJlZnMuZGlmZi5nZXRET01Ob2RlKCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRyZXR1cm4gPGRpdj5cclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZGlmZlwiIHJlZj1cImRpZmZcIj57Z2V0RGlmZlRleHQoc3RhdGUuZGlmZil9PC9zcGFuPlxyXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPntnZXRTY29yZVRleHQocHJvcHMuc2NvcmUpfTwvc3Bhbj5cclxuXHRcdDwvZGl2PjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuU2NvcmUucHJvcFR5cGVzID0ge1xyXG5cdHNjb3JlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY29yZTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlU2NvcmVEaWZmKGVsKSB7XHJcblx0JChlbClcclxuXHRcdC52ZWxvY2l0eSgnZmFkZU91dCcsIHtkdXJhdGlvbjogMH0pXHJcblx0XHQudmVsb2NpdHkoJ2ZhZGVJbicsIHtkdXJhdGlvbjogMjAwfSlcclxuXHRcdC52ZWxvY2l0eSgnZmFkZU91dCcsIHtkdXJhdGlvbjogMTIwMCwgZGVsYXk6IDQwMH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RGlmZlRleHQoZGlmZikge1xyXG5cdHJldHVybiAoZGlmZilcclxuXHRcdD8gbnVtZXJhbChkaWZmKS5mb3JtYXQoJyswLDAnKVxyXG5cdFx0OiBudWxsO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2NvcmVUZXh0KHNjb3JlKSB7XHJcblx0cmV0dXJuIChzY29yZSlcclxuXHRcdD8gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKVxyXG5cdFx0OiBudWxsO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoID0gcmVxdWlyZSgnLi9NYXRjaCcpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17e3BhZGRpbmdMZWZ0OiAnLjVlbSd9fT48aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hdGNoZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1JlZ2lvbiA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24sIG5leHRQcm9wcy5yZWdpb24pO1xyXG5cdFx0Y29uc3QgbmV3TWF0Y2hlcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaGVzLCBuZXh0UHJvcHMubWF0Y2hlcyk7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdSZWdpb24gfHwgbmV3TWF0Y2hlcyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCB7c2hvdWxkVXBkYXRlLCBuZXdSZWdpb24sIG5ld01hdGNoZXMsIG5ld1dvcmxkc30pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ3JlZ2lvbicsIHByb3BzLnJlZ2lvbi50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdtYXRjaGVzJywgcHJvcHMubWF0Y2hlcy50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICd3b3JsZHMnLCBwcm9wcy53b3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdSZWdpb25NYXRjaGVzJz5cclxuXHRcdFx0XHQ8aDI+XHJcblx0XHRcdFx0XHR7cHJvcHMucmVnaW9uLmdldCgnbGFiZWwnKX0gTWF0Y2hlc1xyXG5cdFx0XHRcdFx0eyFwcm9wcy5tYXRjaGVzLnNpemUgPyBsb2FkaW5nSHRtbCA6IG51bGx9XHJcblx0XHRcdFx0PC9oMj5cclxuXHJcblx0XHRcdFx0e3Byb3BzLm1hdGNoZXMubWFwKG1hdGNoID0+XHJcblx0XHRcdFx0XHQ8TWF0Y2hcclxuXHRcdFx0XHRcdFx0a2V5PXttYXRjaC5nZXQoJ2lkJyl9XHJcblx0XHRcdFx0XHRcdGNsYXNzTmFtZT0nbWF0Y2gnXHJcblxyXG5cdFx0XHRcdFx0XHR3b3JsZHM9e3Byb3BzLndvcmxkc31cclxuXHRcdFx0XHRcdFx0bWF0Y2g9e21hdGNofVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hdGNoZXMucHJvcFR5cGVzID0ge1xyXG5cdHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaGVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBSZWdpb25Xb3JsZHNXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdXb3JsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld1dvcmxkKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdSZWdpb25Xb3JsZHNXb3JsZDo6cmVuZGVyJywgcHJvcHMud29ybGQudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gPGxpPjxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT57cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9PC9hPjwvbGk+O1xyXG5cdH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuUmVnaW9uV29ybGRzV29ybGQucHJvcFR5cGVzID0ge1xyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVnaW9uV29ybGRzV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBXb3JsZCA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgV29ybGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcblx0XHRjb25zdCBuZXdSZWdpb24gPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMucmVnaW9uLmdldCgnd29ybGRzJyksIG5leHRQcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdSZWdpb24pO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6UmVnaW9uV29ybGRzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgbmV3TGFuZywgbmV3UmVnaW9uKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpXb3JsZHM6OnJlbmRlcigpJywgcHJvcHMucmVnaW9uLmdldCgnbGFiZWwnKSwgcHJvcHMucmVnaW9uLmdldCgnd29ybGRzJykudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlJlZ2lvbldvcmxkc1wiPlxyXG5cdFx0XHRcdDxoMj57cHJvcHMucmVnaW9uLmdldCgnbGFiZWwnKX0gV29ybGRzPC9oMj5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZFwiPlxyXG5cdFx0XHRcdFx0e3Byb3BzLndvcmxkcy5tYXAod29ybGQgPT5cclxuXHRcdFx0XHRcdFx0PFdvcmxkXHJcblx0XHRcdFx0XHRcdFx0a2V5PXt3b3JsZC5nZXQoJ2lkJyl9XHJcblx0XHRcdFx0XHRcdFx0d29ybGQ9e3dvcmxkfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0KX1cclxuXHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbldvcmxkcy5wcm9wVHlwZXMgPSB7XHJcblx0cmVnaW9uOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgYXBpID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoZXMgPSByZXF1aXJlKCcuL01hdGNoZXMnKTtcclxuY29uc3QgV29ybGRzID0gcmVxdWlyZSgnLi9Xb3JsZHMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE92ZXJ2aWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMubW91bnRlZCA9IHRydWU7XHJcblx0XHR0aGlzLnRpbWVvdXRzID0ge307XHJcblxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0cmVnaW9uczogSW1tdXRhYmxlLmZyb21KUyh7XHJcblx0XHRcdFx0JzEnOiB7bGFiZWw6ICdOQScsIGlkOiAnMSd9LFxyXG5cdFx0XHRcdCcyJzoge2xhYmVsOiAnRVUnLCBpZDogJzInfSxcclxuXHRcdFx0fSksXHJcblxyXG5cdFx0XHRtYXRjaGVzQnlSZWdpb246IEltbXV0YWJsZS5mcm9tSlMoeycxJzp7fSwgJzInOnt9fSksXHJcblx0XHRcdHdvcmxkc0J5UmVnaW9uOiBJbW11dGFibGUuZnJvbUpTKHsnMSc6e30sICcyJzp7fX0pLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXMocHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3TWF0Y2hEYXRhID0gIUltbXV0YWJsZS5pcyhzdGF0ZS5tYXRjaGVzQnlSZWdpb24sIG5leHRTdGF0ZS5tYXRjaGVzQnlSZWdpb24pO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgIHx8IG5ld01hdGNoRGF0YSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld01hdGNoRGF0YX0pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuXHRcdHNldFBhZ2VUaXRsZS5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcblx0XHRzZXRXb3JsZHMuY2FsbCh0aGlzLCB0aGlzLnByb3BzLmxhbmcpO1xyXG5cclxuXHRcdGdldERhdGEuY2FsbCh0aGlzKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuXHRcdHNldFBhZ2VUaXRsZS5jYWxsKHRoaXMsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdHNldFdvcmxkcy5jYWxsKHRoaXMsIG5leHRQcm9wcy5sYW5nKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcblx0XHR0aGlzLm1vdW50ZWQgPSBmYWxzZTtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRzLm1hdGNoRGF0YSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJywgJ2xhbmcnLCBwcm9wcy5sYW5nLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJywgJ3JlZ2lvbnMnLCBzdGF0ZS5yZWdpb25zLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJywgJ21hdGNoZXNCeVJlZ2lvbicsIHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpyZW5kZXIoKScsICd3b3JsZHNCeVJlZ2lvbicsIHN0YXRlLndvcmxkc0J5UmVnaW9uLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIDxkaXYgaWQ9XCJvdmVydmlld1wiPlxyXG5cdFx0XHR7PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHR7c3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG5cdFx0XHRcdFx0XHQ8TWF0Y2hlc1xyXG5cdFx0XHRcdFx0XHRcdHJlZ2lvbj17cmVnaW9ufVxyXG5cdFx0XHRcdFx0XHRcdG1hdGNoZXM9e3N0YXRlLm1hdGNoZXNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG5cdFx0XHRcdFx0XHRcdHdvcmxkcz17c3RhdGUud29ybGRzQnlSZWdpb24uZ2V0KHJlZ2lvbklkKX1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvZGl2Pn1cclxuXHJcblx0XHRcdDxociAvPlxyXG5cclxuXHRcdFx0ezxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0e3N0YXRlLnJlZ2lvbnMubWFwKChyZWdpb24sIHJlZ2lvbklkKSA9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTJcIiBrZXk9e3JlZ2lvbklkfT5cclxuXHRcdFx0XHRcdFx0PFdvcmxkc1xyXG5cdFx0XHRcdFx0XHRcdHJlZ2lvbj17cmVnaW9ufVxyXG5cdFx0XHRcdFx0XHRcdHdvcmxkcz17c3RhdGUud29ybGRzQnlSZWdpb24uZ2V0KHJlZ2lvbklkKX1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvZGl2Pn1cclxuXHRcdDwvZGl2PjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuT3ZlcnZpZXcucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPdmVydmlldztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERpcmVjdCBET00gTWFuaXB1bGF0aW9uXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nKSB7XHJcblx0bGV0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG5cdGlmIChsYW5nLmdldCgnc2x1ZycpICE9PSAnZW4nKSB7XHJcblx0XHR0aXRsZS5wdXNoKGxhbmcuZ2V0KCduYW1lJykpO1xyXG5cdH1cclxuXHJcblx0JCgndGl0bGUnKS50ZXh0KHRpdGxlLmpvaW4oJyAtICcpKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREYXRhXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlx0RGF0YSAtIFdvcmxkc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0V29ybGRzKGxhbmcpIHtcclxuXHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGNvbnN0IG5ld1dvcmxkc0J5UmVnaW9uID0gSW1tdXRhYmxlXHJcblx0XHQuU2VxKFNUQVRJQy53b3JsZHMpXHJcblx0XHQubWFwKHdvcmxkID0+IGdldFdvcmxkQnlMYW5nKGxhbmcsIHdvcmxkKSlcclxuXHRcdC5zb3J0Qnkod29ybGQgPT4gd29ybGQuZ2V0KCduYW1lJykpXHJcblx0XHQuZ3JvdXBCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ3JlZ2lvbicpKTtcclxuXHJcblx0c2VsZi5zZXRTdGF0ZSh7d29ybGRzQnlSZWdpb246IG5ld1dvcmxkc0J5UmVnaW9ufSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRCeUxhbmcobGFuZywgd29ybGQpIHtcclxuXHRjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG5cdGNvbnN0IHdvcmxkQnlMYW5nID0gd29ybGQuZ2V0KGxhbmdTbHVnKTtcclxuXHJcblx0Y29uc3QgcmVnaW9uID0gd29ybGQuZ2V0KCdyZWdpb24nKTtcclxuXHRjb25zdCBsaW5rID0gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZyk7XHJcblxyXG5cdHJldHVybiB3b3JsZEJ5TGFuZy5tZXJnZSh7bGluaywgcmVnaW9ufSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG5cdHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZC5nZXQoJ3NsdWcnKV0uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdERhdGEgLSBNYXRjaGVzXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXREYXRhKCkge1xyXG5cdGxldCBzZWxmID0gdGhpcztcclxuXHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OmdldERhdGEoKScpO1xyXG5cclxuXHRhcGkuZ2V0TWF0Y2hlcygoZXJyLCBkYXRhKSA9PiB7XHJcblx0XHRjb25zdCBtYXRjaERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEpO1xyXG5cclxuXHRcdGlmIChzZWxmLm1vdW50ZWQpIHtcclxuXHRcdFx0aWYgKCFlcnIgJiYgbWF0Y2hEYXRhICYmICFtYXRjaERhdGEuaXNFbXB0eSgpKSB7XHJcblx0XHRcdFx0c2VsZi5zZXRTdGF0ZShnZXRNYXRjaGVzQnlSZWdpb24uYmluZChzZWxmLCBtYXRjaERhdGEpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2V0RGF0YVRpbWVvdXQuY2FsbChzZWxmKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzQnlSZWdpb24obWF0Y2hEYXRhLCBzdGF0ZSkge1xyXG5cdGNvbnN0IG5ld01hdGNoZXNCeVJlZ2lvbiA9IEltbXV0YWJsZVxyXG5cdFx0LlNlcShtYXRjaERhdGEpXHJcblx0XHQuZ3JvdXBCeShtYXRjaCA9PiBtYXRjaC5nZXQoXCJyZWdpb25cIikudG9TdHJpbmcoKSk7XHJcblxyXG5cdHJldHVybiB7bWF0Y2hlc0J5UmVnaW9uOiBzdGF0ZS5tYXRjaGVzQnlSZWdpb24ubWVyZ2VEZWVwKG5ld01hdGNoZXNCeVJlZ2lvbil9O1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldERhdGFUaW1lb3V0KCkge1xyXG5cdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi50aW1lb3V0cy5tYXRjaERhdGEgPSBzZXRUaW1lb3V0KFxyXG5cdFx0Z2V0RGF0YS5iaW5kKHNlbGYpLFxyXG5cdFx0Z2V0SW50ZXJ2YWwoKVxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SW50ZXJ2YWwoKSB7XHJcblx0cmV0dXJuIF8ucmFuZG9tKDIwMDAsIDQwMDApO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBvYmplY3RpdmVDb2xzID0ge1xyXG5cdGVsYXBzZWQ6IHRydWUsXHJcblx0dGltZXN0YW1wOiB0cnVlLFxyXG5cdG1hcEFiYnJldjogdHJ1ZSxcclxuXHRhcnJvdzogdHJ1ZSxcclxuXHRzcHJpdGU6IHRydWUsXHJcblx0bmFtZTogdHJ1ZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogZmFsc2UsXHJcblx0Z3VpbGRUYWc6IGZhbHNlLFxyXG5cdHRpbWVyOiBmYWxzZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGRDbGFpbXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3Q2xhaW1zID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLmdldCgnY2xhaW1zJyksIG5leHRQcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDbGFpbXMpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0NsYWltczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9pZCcpKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBndWlsZElkID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcblx0XHRjb25zdCBjbGFpbXMgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnY2xhaW1zJyk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0NsYWltczo6cmVuZGVyKCknLCBndWlsZElkKTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuXHRcdFx0XHR7Y2xhaW1zLm1hcChlbnRyeSA9PlxyXG5cdFx0XHRcdFx0PGxpIGtleT17ZW50cnkuZ2V0KCdpZCcpfT5cclxuXHRcdFx0XHRcdFx0PE9iamVjdGl2ZVxyXG5cdFx0XHRcdFx0XHRcdGNvbHM9e29iamVjdGl2ZUNvbHN9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdFx0XHRndWlsZElkPXtndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRcdGd1aWxkPXt0aGlzLnByb3BzLmd1aWxkfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRvYmplY3RpdmVJZD17ZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpfVxyXG5cdFx0XHRcdFx0XHRcdHdvcmxkQ29sb3I9e2VudHJ5LmdldCgnd29ybGQnKX1cclxuXHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA9e2VudHJ5LmdldCgndGltZXN0YW1wJyl9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuR3VpbGRDbGFpbXMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHdWlsZENsYWltcztcclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbWJsZW0gPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcbmNvbnN0IENsYWltcyA9IHJlcXVpcmUoJy4vQ2xhaW1zJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBsb2FkaW5nSHRtbCA9IDxoMSBzdHlsZT17e3doaXRlU3BhY2U6IFwibm93cmFwXCIsIG92ZXJmbG93OiBcImhpZGRlblwiLCB0ZXh0T3ZlcmZsb3c6IFwiZWxsaXBzaXNcIn19PlxyXG5cdDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiIC8+XHJcblx0eycgTG9hZGluZy4uLid9XHJcbjwvaDE+O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGRhdGFSZWFkeSA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdsb2FkZWQnKTtcclxuXHJcblx0XHRjb25zdCBndWlsZElkID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcblx0XHRjb25zdCBndWlsZE5hbWUgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG5cdFx0Y29uc3QgZ3VpbGRUYWcgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgndGFnJyk7XHJcblx0XHRjb25zdCBndWlsZENsYWltcyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnR3VpbGQ6OnJlbmRlcigpJywgZ3VpbGRJZCwgZ3VpbGROYW1lKTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJndWlsZFwiIGlkPXtndWlsZElkfT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTRcIj5cclxuXHRcdFx0XHRcdFx0eyhkYXRhUmVhZHkpXHJcblx0XHRcdFx0XHRcdFx0PyA8YSBocmVmPXtgaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tL2d1aWxkcy8ke3NsdWdpZnkoZ3VpbGROYW1lKX1gfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxFbWJsZW0gZ3VpbGROYW1lPXtndWlsZE5hbWV9IHNpemU9ezI1Nn0gLz5cclxuXHRcdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHRcdFx0OiA8RW1ibGVtIHNpemU9ezI1Nn0gLz5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMjBcIj5cclxuXHRcdFx0XHRcdFx0eyhkYXRhUmVhZHkpXHJcblx0XHRcdFx0XHRcdFx0PyA8aDE+PGEgaHJlZj17YGh0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS9ndWlsZHMvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9YH0gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdFx0XHRcdFx0XHR7Z3VpbGROYW1lfSBbe2d1aWxkVGFnfV1cclxuXHRcdFx0XHRcdFx0XHQ8L2E+PC9oMT5cclxuXHRcdFx0XHRcdFx0XHQ6IGxvYWRpbmdIdG1sXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHshZ3VpbGRDbGFpbXMuaXNFbXB0eSgpXHJcblx0XHRcdFx0XHRcdFx0PyA8Q2xhaW1zIHsuLi50aGlzLnByb3BzfSAvPlxyXG5cdFx0XHRcdFx0XHRcdDogbnVsbFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuR3VpbGQucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHdWlsZDtcclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcblx0cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIucmVwbGFjZSgvIC9nLCAnLScpKS50b0xvd2VyQ2FzZSgpO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgR3VpbGQgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEd1aWxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Ly8gY29uc3RydWN0b3IoKSB7fVxyXG5cdC8vIGNvbXBvbmVudERpZE1vdW50KCkge31cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnR3VpbGRzOjpyZW5kZXIoKScpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3Byb3BzLmd1aWxkcycsIHByb3BzLmd1aWxkcy50b09iamVjdCgpKTtcclxuXHJcblx0XHRjb25zdCBzb3J0ZWRHdWlsZHMgPSBwcm9wcy5ndWlsZHMudG9TZXEoKVxyXG5cdFx0XHQuc29ydEJ5KGd1aWxkID0+IGd1aWxkLmdldCgnZ3VpbGRfbmFtZScpKVxyXG5cdFx0XHQuc29ydEJ5KGd1aWxkID0+IC1ndWlsZC5nZXQoJ2xhc3RDbGFpbScpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBpZD1cImd1aWxkc1wiPlxyXG5cdFx0XHRcdDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRlclwiPkd1aWxkIENsYWltczwvaDI+XHJcblx0XHRcdFx0e3NvcnRlZEd1aWxkcy5tYXAoZ3VpbGQgPT5cclxuXHRcdFx0XHRcdDxHdWlsZFxyXG5cdFx0XHRcdFx0XHRrZXk9e2d1aWxkLmdldCgnZ3VpbGRfaWQnKX1cclxuXHRcdFx0XHRcdFx0bGFuZz17cHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdFx0Z3VpbGQ9e2d1aWxkfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZHMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR3VpbGRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCcuLi9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGNhcHR1cmVDb2xzID0ge1xyXG5cdGVsYXBzZWQ6IHRydWUsXHJcblx0dGltZXN0YW1wOiB0cnVlLFxyXG5cdG1hcEFiYnJldjogdHJ1ZSxcclxuXHRhcnJvdzogdHJ1ZSxcclxuXHRzcHJpdGU6IHRydWUsXHJcblx0bmFtZTogdHJ1ZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogZmFsc2UsXHJcblx0Z3VpbGRUYWc6IGZhbHNlLFxyXG5cdHRpbWVyOiBmYWxzZSxcclxufTtcclxuXHJcbmNvbnN0IGNsYWltQ29scyA9IHtcclxuXHRlbGFwc2VkOiB0cnVlLFxyXG5cdHRpbWVzdGFtcDogdHJ1ZSxcclxuXHRtYXBBYmJyZXY6IHRydWUsXHJcblx0YXJyb3c6IHRydWUsXHJcblx0c3ByaXRlOiB0cnVlLFxyXG5cdG5hbWU6IHRydWUsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IHRydWUsXHJcblx0Z3VpbGRUYWc6IHRydWUsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHRcdGNvbnN0IG5ld0VudHJ5ID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmVudHJ5LCBuZXh0UHJvcHMuZW50cnkpO1xyXG5cclxuXHRcdGNvbnN0IG5ld0ZpbHRlcnMgPSAoXHJcblx0XHRcdCFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXBGaWx0ZXIsIG5leHRQcm9wcy5tYXBGaWx0ZXIpXHJcblx0XHRcdHx8ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKVxyXG5cdFx0KTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcblx0XHRcdG5ld0xhbmdcclxuXHRcdFx0fHwgbmV3R3VpbGRcclxuXHRcdFx0fHwgbmV3RW50cnlcclxuXHRcdFx0fHwgbmV3RmlsdGVyc1xyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnRW50cnk6cmVuZGVyKCknLCB7bmV3VHJpZ2dlclN0YXRlLCBuZXdGaWx0ZXJzLCBzaG91bGRVcGRhdGV9KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnRW50cnk6cmVuZGVyKCknKTtcclxuXHRcdGNvbnN0IGV2ZW50VHlwZSA9IHRoaXMucHJvcHMuZW50cnkuZ2V0KCd0eXBlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29scyA9IChldmVudFR5cGUgPT09ICdjbGFpbScpXHJcblx0XHRcdD8gY2xhaW1Db2xzXHJcblx0XHRcdDogY2FwdHVyZUNvbHM7XHJcblxyXG5cdFx0Y29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21ldGFbdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyldO1xyXG5cdFx0Y29uc3QgbWFwQ29sb3IgPSBfLmZpbmQoU1RBVElDLm9iamVjdGl2ZV9tYXAsIG1hcCA9PiBtYXAubWFwSW5kZXggPT09IG9NZXRhLm1hcCkuY29sb3I7XHJcblxyXG5cclxuXHRcdGNvbnN0IG1hdGNoZXNNYXBGaWx0ZXIgPSB0aGlzLnByb3BzLm1hcEZpbHRlciA9PT0gJ2FsbCcgfHwgdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09IG1hcENvbG9yO1xyXG5cdFx0Y29uc3QgbWF0Y2hlc0V2ZW50RmlsdGVyID0gdGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gJ2FsbCcgfHwgdGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gZXZlbnRUeXBlO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZEJlVmlzaWJsZSA9IChtYXRjaGVzTWFwRmlsdGVyICYmIG1hdGNoZXNFdmVudEZpbHRlcik7XHJcblx0XHRjb25zdCBjbGFzc05hbWUgPSBzaG91bGRCZVZpc2libGUgPyAnc2hvdy1lbnRyeScgOiAnaGlkZS1lbnRyeSc7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcblx0XHRcdFx0PE9iamVjdGl2ZVxyXG5cdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cclxuXHRcdFx0XHRcdGNvbHM9e2NvbHN9XHJcblx0XHRcdFx0XHRndWlsZElkPXt0aGlzLnByb3BzLmd1aWxkSWR9XHJcblx0XHRcdFx0XHRndWlsZD17dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcblx0XHRcdFx0XHRlbnRyeUlkPXt0aGlzLnByb3BzLmVudHJ5LmdldCgnaWQnKX1cclxuXHRcdFx0XHRcdG9iamVjdGl2ZUlkPXt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKX1cclxuXHRcdFx0XHRcdHdvcmxkQ29sb3I9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCd3b3JsZCcpfVxyXG5cdFx0XHRcdFx0dGltZXN0YW1wPXt0aGlzLnByb3BzLmVudHJ5LmdldCgndGltZXN0YW1wJyl9XHJcblx0XHRcdFx0XHRldmVudFR5cGU9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0eXBlJyl9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0PC9saT5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkVudHJ5LnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGVudHJ5OiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcblxyXG5cdG1hcEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRyeTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcEZpbHRlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdHJldHVybiAodGhpcy5wcm9wcy5ldmVudEZpbHRlciAhPT0gbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBpZD1cImxvZy1ldmVudC1maWx0ZXJzXCIgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxsc1wiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9eyhwcm9wcy5ldmVudEZpbHRlciA9PT0gJ2NsYWltJykgPyAnYWN0aXZlJzogbnVsbH0+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjbGFpbVwiPkNsYWltczwvYT5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9eyhwcm9wcy5ldmVudEZpbHRlciA9PT0gJ2NhcHR1cmUnKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuXHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImNhcHR1cmVcIj5DYXB0dXJlczwvYT5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9eyhwcm9wcy5ldmVudEZpbHRlciA9PT0gJ2FsbCcpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiYWxsXCI+QWxsPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBGaWx0ZXJzLnByb3BUeXBlcyA9IHtcclxuXHRldmVudEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFtcclxuXHRcdCdhbGwnLFxyXG5cdFx0J2NhcHR1cmUnLFxyXG5cdFx0J2NsYWltJyxcclxuXHRdKS5pc1JlcXVpcmVkLFxyXG5cdHNldEV2ZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRmlsdGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgRW50cnkgPSByZXF1aXJlKCcuL0VudHJ5Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExvZ0VudHJpZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblxyXG5cdFx0Y29uc3QgbmV3VHJpZ2dlclN0YXRlID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24sIG5leHRQcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uKTtcclxuXHRcdGNvbnN0IG5ld0ZpbHRlclN0YXRlID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hcEZpbHRlciwgbmV4dFByb3BzLm1hcEZpbHRlcikgfHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuXHRcdFx0bmV3TGFuZ1xyXG5cdFx0XHR8fCBuZXdHdWlsZHNcclxuXHRcdFx0fHwgbmV3VHJpZ2dlclN0YXRlXHJcblx0XHRcdHx8IG5ld0ZpbHRlclN0YXRlXHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnTG9nRW50cmllczo6cmVuZGVyKCknLCBwcm9wcy5tYXBGaWx0ZXIsIHByb3BzLmV2ZW50RmlsdGVyLCBwcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgaWQ9XCJsb2dcIj5cclxuXHRcdFx0XHR7cHJvcHMuZXZlbnRIaXN0b3J5Lm1hcChlbnRyeSA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCBldmVudFR5cGUgPSBlbnRyeS5nZXQoJ3R5cGUnKTtcclxuXHRcdFx0XHRcdGNvbnN0IGVudHJ5SWQgPSBlbnRyeS5nZXQoJ2lkJyk7XHJcblx0XHRcdFx0XHRsZXQgZ3VpbGRJZCwgZ3VpbGQ7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGV2ZW50VHlwZSA9PT0gJ2NsYWltJykge1xyXG5cdFx0XHRcdFx0XHRndWlsZElkID0gZW50cnkuZ2V0KCdndWlsZCcpO1xyXG5cdFx0XHRcdFx0XHRndWlsZCA9IChwcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpKVxyXG5cdFx0XHRcdFx0XHRcdD8gcHJvcHMuZ3VpbGRzLmdldChndWlsZElkKVxyXG5cdFx0XHRcdFx0XHRcdDogbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIDxFbnRyeVxyXG5cdFx0XHRcdFx0XHRrZXk9e2VudHJ5SWR9XHJcblx0XHRcdFx0XHRcdGNvbXBvbmVudD0nbGknXHJcblxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyTm90aWZpY2F0aW9uPXtwcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG5cdFx0XHRcdFx0XHRtYXBGaWx0ZXI9e3Byb3BzLm1hcEZpbHRlcn1cclxuXHRcdFx0XHRcdFx0ZXZlbnRGaWx0ZXI9e3Byb3BzLmV2ZW50RmlsdGVyfVxyXG5cclxuXHRcdFx0XHRcdFx0bGFuZz17cHJvcHMubGFuZ31cclxuXHJcblx0XHRcdFx0XHRcdGd1aWxkSWQ9e2d1aWxkSWR9XHJcblx0XHRcdFx0XHRcdGVudHJ5PXtlbnRyeX1cclxuXHRcdFx0XHRcdFx0Z3VpbGQ9e2d1aWxkfVxyXG5cdFx0XHRcdFx0Lz47XHJcblx0XHRcdFx0fSl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuXHQvLyBcdCQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpXHJcblx0Ly8gXHRcdC5jaGlsZHJlbignbGknKVxyXG5cdC8vIFx0XHRcdC5maWx0ZXIoJy5zaG93LWVudHJ5JylcclxuXHQvLyBcdFx0XHRcdC5lYWNoKChpeFJvdywgZWwpID0+IChpeFJvdyAlIDIpID8gJChlbCkuYWRkQ2xhc3MoJ3RvLWFsdCcpIDogbnVsbClcclxuXHQvLyBcdFx0XHQuZW5kKClcclxuXHQvLyBcdFx0XHQuZmlsdGVyKCcuYWx0Om5vdCgudG8tYWx0KScpXHJcblx0Ly8gXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2FsdCcpXHJcblx0Ly8gXHRcdFx0LmVuZCgpXHJcblx0Ly8gXHRcdFx0LmZpbHRlcignLnRvLWFsdCcpXHJcblx0Ly8gXHRcdFx0XHQuYWRkQ2xhc3MoJ2FsdCcpXHJcblx0Ly8gXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3RvLWFsdCcpXHJcblx0Ly8gXHRcdFx0LmVuZCgpXHJcblx0Ly8gXHRcdC5lbmQoKTtcclxuXHQvLyB9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTG9nRW50cmllcy5kZWZhdWx0UHJvcHMgPSB7XHJcblx0Z3VpbGRzOiB7fSxcclxufTtcclxuXHJcbkxvZ0VudHJpZXMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuXHR0cmlnZ2VyTm90aWZpY2F0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdG1hcEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2dFbnRyaWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICh0aGlzLnByb3BzLm1hcEZpbHRlciAhPT0gbmV4dFByb3BzLm1hcEZpbHRlcik7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgaWQ9XCJsb2ctbWFwLWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcblxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnKSA/ICdhY3RpdmUnOiAnbnVsbCd9PlxyXG5cdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0V29ybGR9IGRhdGEtZmlsdGVyPVwiYWxsXCI+QWxsPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblxyXG5cdFx0XHRcdHtfLm1hcChTVEFUSUMub2JqZWN0aXZlX21hcCwgbWFwTWV0YSA9PlxyXG5cdFx0XHRcdFx0PGxpIGtleT17bWFwTWV0YS5tYXBJbmRleH0gY2xhc3NOYW1lPXsocHJvcHMubWFwRmlsdGVyID09PSBtYXBNZXRhLmNvbG9yKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuXHRcdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0V29ybGR9IGRhdGEtZmlsdGVyPXttYXBNZXRhLmNvbG9yfT57bWFwTWV0YS5hYmJyfTwvYT5cclxuXHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0KX1cclxuXHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBGaWx0ZXJzLnByb3BUeXBlcyA9IHtcclxuXHRtYXBGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRzZXRXb3JsZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcEZpbHRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcEZpbHRlcnMgPSByZXF1aXJlKCcuL01hcEZpbHRlcnMnKTtcclxuY29uc3QgRXZlbnRGaWx0ZXJzID0gcmVxdWlyZSgnLi9FdmVudEZpbHRlcnMnKTtcclxuY29uc3QgTG9nRW50cmllcyA9IHJlcXVpcmUoJy4vTG9nRW50cmllcycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0bWFwRmlsdGVyOiAnYWxsJyxcclxuXHRcdFx0ZXZlbnRGaWx0ZXI6ICdhbGwnLFxyXG5cdFx0XHR0cmlnZ2VyTm90aWZpY2F0aW9uOiBmYWxzZSxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0hpc3RvcnkgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKSwgbmV4dFByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5JykpO1xyXG5cclxuXHRcdGNvbnN0IG5ld01hcEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5tYXBGaWx0ZXIsIG5leHRTdGF0ZS5tYXBGaWx0ZXIpO1xyXG5cdFx0Y29uc3QgbmV3RXZlbnRGaWx0ZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZXZlbnRGaWx0ZXIsIG5leHRTdGF0ZS5ldmVudEZpbHRlcik7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRuZXdMYW5nXHJcblx0XHRcdHx8IG5ld0d1aWxkc1xyXG5cdFx0XHR8fCBuZXdIaXN0b3J5XHJcblx0XHRcdHx8IG5ld01hcEZpbHRlclxyXG5cdFx0XHR8fCBuZXdFdmVudEZpbHRlclxyXG5cdFx0KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG5cdFx0aWYgKCF0aGlzLnN0YXRlLnRyaWdnZXJOb3RpZmljYXRpb24pIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7dHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMb2c6OnJlbmRlcigpJywgc3RhdGUubWFwRmlsdGVyLCBzdGF0ZS5ldmVudEZpbHRlciwgc3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblxyXG5cdFx0Y29uc3QgZXZlbnRIaXN0b3J5ID0gcHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGlkPVwibG9nLWNvbnRhaW5lclwiPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImxvZy10YWJzXCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xNlwiPlxyXG5cdFx0XHRcdFx0XHRcdDxNYXBGaWx0ZXJzXHJcblx0XHRcdFx0XHRcdFx0XHRtYXBGaWx0ZXI9e3N0YXRlLm1hcEZpbHRlcn1cclxuXHRcdFx0XHRcdFx0XHRcdHNldFdvcmxkPXtzZXRXb3JsZC5iaW5kKGNvbXBvbmVudCl9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuXHRcdFx0XHRcdFx0XHQ8RXZlbnRGaWx0ZXJzXHJcblx0XHRcdFx0XHRcdFx0XHRldmVudEZpbHRlcj17c3RhdGUuZXZlbnRGaWx0ZXJ9XHJcblx0XHRcdFx0XHRcdFx0XHRzZXRFdmVudD17c2V0RXZlbnQuYmluZChjb21wb25lbnQpfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdHshZXZlbnRIaXN0b3J5LmlzRW1wdHkoKVxyXG5cdFx0XHRcdFx0PyA8TG9nRW50cmllc1xyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyTm90aWZpY2F0aW9uPXtzdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG5cdFx0XHRcdFx0XHRtYXBGaWx0ZXI9e3N0YXRlLm1hcEZpbHRlcn1cclxuXHRcdFx0XHRcdFx0ZXZlbnRGaWx0ZXI9e3N0YXRlLmV2ZW50RmlsdGVyfVxyXG5cclxuXHRcdFx0XHRcdFx0bGFuZz17cHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdFx0Z3VpbGRzPXtwcm9wcy5ndWlsZHN9XHJcblxyXG5cdFx0XHRcdFx0XHRldmVudEhpc3Rvcnk9e2V2ZW50SGlzdG9yeX1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQ6IG51bGxcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxvZy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRXb3JsZChlKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG5cdGNvbXBvbmVudC5zZXRTdGF0ZSh7bWFwRmlsdGVyOiBmaWx0ZXIsIHRyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRFdmVudChlKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG5cdGNvbXBvbmVudC5zZXRTdGF0ZSh7ZXZlbnRGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqUXVlcnknKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcFNjb3JlcyA9IHJlcXVpcmUoJy4vTWFwU2NvcmVzJyk7XHJcbmNvbnN0IE1hcFNlY3Rpb24gPSByZXF1aXJlKCcuL01hcFNlY3Rpb24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcERldGFpbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdEZXRhaWxzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IG1hcE1ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21hcC5maW5kKG1tID0+IG1tLmdldCgna2V5JykgPT09IHRoaXMucHJvcHMubWFwS2V5KTtcclxuXHRcdGNvbnN0IG1hcEluZGV4ID0gbWFwTWV0YS5nZXQoJ21hcEluZGV4JykudG9TdHJpbmcoKTtcclxuXHJcblx0XHRjb25zdCBtYXBTY29yZXMgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydtYXBzJywgJ3Njb3JlcycsIG1hcEluZGV4XSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6Ok1hcHM6Ok1hcERldGFpbHM6cmVuZGVyKCknLCBtYXBTY29yZXMudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1hcFwiPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1hcFNjb3Jlc1wiPlxyXG5cdFx0XHRcdFx0PGgyIGNsYXNzTmFtZT17J3RlYW0gJyArIG1hcE1ldGEuZ2V0KCdjb2xvcicpfSBvbkNsaWNrPXtvblRpdGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0XHR7bWFwTWV0YS5nZXQoJ25hbWUnKX1cclxuXHRcdFx0XHRcdDwvaDI+XHJcblx0XHRcdFx0XHQ8TWFwU2NvcmVzIHNjb3Jlcz17bWFwU2NvcmVzfSAvPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0e21hcE1ldGEuZ2V0KCdzZWN0aW9ucycpLm1hcCgobWFwU2VjdGlvbiwgaXhTZWN0aW9uKSA9PiB7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdDxNYXBTZWN0aW9uXHJcblx0XHRcdFx0XHRcdFx0XHRjb21wb25lbnQ9XCJ1bFwiXHJcblx0XHRcdFx0XHRcdFx0XHRrZXk9e2l4U2VjdGlvbn1cclxuXHRcdFx0XHRcdFx0XHRcdG1hcFNlY3Rpb249e21hcFNlY3Rpb259XHJcblx0XHRcdFx0XHRcdFx0XHRtYXBNZXRhPXttYXBNZXRhfVxyXG5cdFx0XHRcdFx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0pfVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwRGV0YWlscy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBEZXRhaWxzO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uVGl0bGVDbGljayhlKSB7XHJcblx0bGV0ICRtYXBzID0gJCgnLm1hcCcpO1xyXG5cdGxldCAkbWFwID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLm1hcCcsICRtYXBzKTtcclxuXHJcblx0bGV0IGhhc0ZvY3VzID0gJG1hcC5oYXNDbGFzcygnbWFwLWZvY3VzJyk7XHJcblxyXG5cclxuXHRpZighaGFzRm9jdXMpIHtcclxuXHRcdCRtYXBcclxuXHRcdFx0LmFkZENsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdFx0JG1hcHMubm90KCRtYXApXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0LmFkZENsYXNzKCdtYXAtYmx1cicpO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdCRtYXBzXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuXHR9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG51bWVyYWwgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBTY29yZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1Njb3JlcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuXHRcdFx0XHR7cHJvcHMuc2NvcmVzLm1hcCgoc2NvcmUsIGl4U2NvcmUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGZvcm1hdHRlZCA9IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyk7XHJcblx0XHRcdFx0XHRjb25zdCB0ZWFtID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddW2l4U2NvcmVdO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiA8bGkga2V5PXt0ZWFtfSBjbGFzc05hbWU9e2B0ZWFtICR7dGVhbX1gfT5cclxuXHRcdFx0XHRcdFx0e2Zvcm1hdHRlZH1cclxuXHRcdFx0XHRcdDwvbGk+O1xyXG5cdFx0XHRcdH0pfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwU2NvcmVzLnByb3BUeXBlcyA9IHtcclxuXHRzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwU2NvcmVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCdUcmFja2VyL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1vZHVsZSBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogZmFsc2UsXHJcblx0dGltZXN0YW1wOiBmYWxzZSxcclxuXHRtYXBBYmJyZXY6IGZhbHNlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogdHJ1ZSxcclxuXHR0aW1lcjogdHJ1ZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcFNlY3Rpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdEZXRhaWxzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IG1hcE9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdvYmplY3RpdmVzJyk7XHJcblx0XHRjb25zdCBvd25lcnMgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ293bmVycyddKTtcclxuXHRcdGNvbnN0IGNsYWltZXJzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnb2JqZWN0aXZlcycsICdjbGFpbWVycyddKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwU2VjdGlvbjpyZW5kZXIoKScsIG1hcE9iamVjdGl2ZXMsIG1hcE9iamVjdGl2ZXMudG9KUygpKTtcclxuXHJcblxyXG5cdFx0Y29uc3Qgc2VjdGlvbkNsYXNzID0gZ2V0U2VjdGlvbkNsYXNzKHRoaXMucHJvcHMubWFwTWV0YS5nZXQoJ2tleScpLCB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdsYWJlbCcpKTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT17YGxpc3QtdW5zdHlsZWQgJHtzZWN0aW9uQ2xhc3N9YH0+XHJcblx0XHRcdFx0e21hcE9iamVjdGl2ZXMubWFwKG9iamVjdGl2ZUlkID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IG93bmVyID0gb3duZXJzLmdldChvYmplY3RpdmVJZC50b1N0cmluZygpKTtcclxuXHRcdFx0XHRcdGNvbnN0IGNsYWltZXIgPSBjbGFpbWVycy5nZXQob2JqZWN0aXZlSWQudG9TdHJpbmcoKSk7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgZ3VpbGRJZCA9IChjbGFpbWVyKSA/IGNsYWltZXIuZ3VpbGQgOiBudWxsO1xyXG5cdFx0XHRcdFx0Y29uc3QgaGFzQ2xhaW1lciA9ICEhZ3VpbGRJZDtcclxuXHRcdFx0XHRcdGNvbnN0IGhhc0d1aWxkRGF0YSA9IGhhc0NsYWltZXIgJiYgdGhpcy5wcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpO1xyXG5cdFx0XHRcdFx0Y29uc3QgZ3VpbGQgPSBoYXNHdWlsZERhdGEgPyB0aGlzLnByb3BzLmd1aWxkcy5nZXQoZ3VpbGRJZCkgOiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdDxsaSBrZXk9e29iamVjdGl2ZUlkfSBpZD17J29iamVjdGl2ZS0nICsgb2JqZWN0aXZlSWR9PlxyXG5cdFx0XHRcdFx0XHRcdDxPYmplY3RpdmVcclxuXHRcdFx0XHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdFx0XHRcdGNvbHM9e29iamVjdGl2ZUNvbHN9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqZWN0aXZlSWQ9e29iamVjdGl2ZUlkfVxyXG5cdFx0XHRcdFx0XHRcdFx0d29ybGRDb2xvcj17b3duZXIuZ2V0KCd3b3JsZCcpfVxyXG5cdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wPXtvd25lci5nZXQoJ3RpbWVzdGFtcCcpfVxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGRJZD17Z3VpbGRJZH1cclxuXHRcdFx0XHRcdFx0XHRcdGd1aWxkPXtndWlsZH1cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0fSl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBTZWN0aW9uLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblx0bWFwU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcFNlY3Rpb247XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZWN0aW9uQ2xhc3MobWFwS2V5LCBzZWN0aW9uTGFiZWwpIHtcclxuXHRsZXQgc2VjdGlvbkNsYXNzID0gW1xyXG5cdFx0J2NvbC1tZC0yNCcsXHJcblx0XHQnbWFwLXNlY3Rpb24nLFxyXG5cdF07XHJcblxyXG5cdGlmIChtYXBLZXkgPT09ICdDZW50ZXInKSB7XHJcblx0XHRpZiAoc2VjdGlvbkxhYmVsID09PSAnQ2FzdGxlJykge1xyXG5cdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTI0Jyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VjdGlvbkNsYXNzLmpvaW4oJyAnKTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwRGV0YWlscyA9IHJlcXVpcmUoJy4vTWFwRGV0YWlscycpO1xyXG5jb25zdCBMb2cgPSByZXF1aXJlKCdUcmFja2VyL0xvZycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3RGV0YWlscyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGRzIHx8IG5ld0RldGFpbHMgfHwgbmV3V29ybGRzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Y29uc3QgaXNEYXRhSW5pdGlhbGl6ZWQgPSBwcm9wcy5kZXRhaWxzLmdldCgnaW5pdGlhbGl6ZWQnKTtcclxuXHJcblx0XHRpZiAoIWlzRGF0YUluaXRpYWxpemVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBpZD1cIm1hcHNcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTZcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiQ2VudGVyXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0xOFwiPlxyXG5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC04XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIlJlZEhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiQmx1ZUhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiR3JlZW5Ib21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTI0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8TG9nIHsuLi5wcm9wc30gLz5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0IDwvZGl2PlxyXG5cdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0bWF0Y2hXb3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBFbWJsZW0gPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBHdWlsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3R3VpbGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRJZCwgbmV4dFByb3BzLmd1aWxkSWQpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0d1aWxkIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IGhhc0d1aWxkID0gISF0aGlzLnByb3BzLmd1aWxkSWQ7XHJcblx0XHRjb25zdCBpc0VuYWJsZWQgPSBoYXNHdWlsZCAmJiAodGhpcy5wcm9wcy5zaG93TmFtZSB8fCB0aGlzLnByb3BzLnNob3dUYWcpO1xyXG5cclxuXHRcdGlmICghaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IGhhc0d1aWxkRGF0YSA9IHByb3BzLmd1aWxkICYmIHByb3BzLmd1aWxkLmdldCgnbG9hZGVkJyk7XHJcblx0XHRcdGNvbnN0IGlkID0gcHJvcHMuZ3VpbGRJZDtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdHdWlsZDpyZW5kZXIoKScsIGlkKTtcclxuXHJcblx0XHRcdGNvbnN0IGhyZWYgPSBgIyR7aWR9YDtcclxuXHJcblx0XHRcdGxldCBjb250ZW50ID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPjtcclxuXHRcdFx0bGV0IHRpdGxlID0gbnVsbDtcclxuXHJcblx0XHRcdGlmIChoYXNHdWlsZERhdGEpIHtcclxuXHRcdFx0XHRjb25zdCBuYW1lID0gcHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJyk7XHJcblx0XHRcdFx0Y29uc3QgdGFnID0gcHJvcHMuZ3VpbGQuZ2V0KCd0YWcnKTtcclxuXHJcblx0XHRcdFx0aWYgKHByb3BzLnNob3dOYW1lICYmIHByb3BzLnNob3dUYWcpIHtcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSA8c3Bhbj5cclxuXHRcdFx0XHRcdFx0e2Ake25hbWV9IFske3RhZ31dIGB9XHJcblx0XHRcdFx0XHRcdDxFbWJsZW0gZ3VpbGROYW1lPXtuYW1lfSBzaXplPXsyMH0gLz5cclxuXHRcdFx0XHRcdDwvc3Bhbj47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHByb3BzLnNob3dOYW1lKSB7XHJcblx0XHRcdFx0XHRjb250ZW50ID0gYCR7bmFtZX1gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSBgJHt0YWd9YDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRpdGxlID0gYCR7bmFtZX0gWyR7dGFnfV1gO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gPGEgY2xhc3NOYW1lPVwiZ3VpbGRuYW1lXCIgaHJlZj17aHJlZn0gdGl0bGU9e3RpdGxlfT5cclxuXHRcdFx0XHR7Y29udGVudH1cclxuXHRcdFx0PC9hPjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuR3VpbGQucHJvcFR5cGVzID0ge1xyXG5cdHNob3dOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHNob3dUYWc6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHdWlsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU3ByaXRlID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL1Nwcml0ZScpO1xyXG5jb25zdCBBcnJvdyA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9BcnJvdycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgSWNvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0NvbG9yID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0NvbG9yKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuc2hvd0Fycm93ICYmICF0aGlzLnByb3BzLnNob3dTcHJpdGUpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG5cdFx0XHRjb25zdCBvYmplY3RpdmVUeXBlSWQgPSBvTWV0YS5nZXQoJ3R5cGUnKS50b1N0cmluZygpO1xyXG5cdFx0XHRjb25zdCBvVHlwZSA9IFNUQVRJQy5vYmplY3RpdmVfdHlwZXMuZ2V0KG9iamVjdGl2ZVR5cGVJZCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtaWNvbnNcIj5cclxuXHRcdFx0XHR7KHRoaXMucHJvcHMuc2hvd0Fycm93KSA/XHJcblx0XHRcdFx0XHQ8QXJyb3cgb01ldGE9e29NZXRhfSAvPlxyXG5cdFx0XHRcdDogbnVsbH1cclxuXHJcblx0XHRcdFx0eyh0aGlzLnByb3BzLnNob3dTcHJpdGUpID9cclxuXHRcdFx0XHRcdDxTcHJpdGVcclxuXHRcdFx0XHRcdFx0dHlwZT17b1R5cGUuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLmNvbG9yfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQ6IG51bGx9XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuSWNvbnMucHJvcFR5cGVzID0ge1xyXG5cdHNob3dBcnJvdzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRzaG93U3ByaXRlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEljb25zO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBvTGFiZWwgPSBTVEFUSUMub2JqZWN0aXZlX2xhYmVscy5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblx0XHRcdGNvbnN0IGxhbmdTbHVnID0gdGhpcy5wcm9wcy5sYW5nLmdldCgnc2x1ZycpO1xyXG5cclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLWxhYmVsXCI+XHJcblx0XHRcdFx0PHNwYW4+e29MYWJlbC5nZXQobGFuZ1NsdWcpfTwvc3Bhbj5cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5MYWJlbC5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExhYmVsO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcE5hbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdC8vIG1hcCBuYW1lIGNhbiBuZXZlciBjaGFuZ2UsIG5vdCBsb2NhbGl6ZWRcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUoKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG5cdFx0XHRjb25zdCBtYXBJbmRleCA9IG9NZXRhLmdldCgnbWFwJyk7XHJcblx0XHRcdGNvbnN0IG1hcE1ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21hcC5maW5kKG1tID0+IG1tLmdldCgnbWFwSW5kZXgnKSA9PT0gbWFwSW5kZXgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLW1hcFwiPlxyXG5cdFx0XHRcdDxzcGFuIHRpdGxlPXttYXBNZXRhLmdldCgnbmFtZScpfT57bWFwTWV0YS5nZXQoJ2FiYnInKX08L3NwYW4+XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwTmFtZS5wcm9wVHlwZXMgPSB7XHJcblx0aXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgVGltZUNvdW50ZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IGV4cGlyZXMgPSB0aGlzLnByb3BzLnRpbWVzdGFtcCArICg1ICogNjApO1xyXG5cclxuXHRcdFx0cmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0ndGltZXIgY291bnRkb3duIGluYWN0aXZlJyBkYXRhLWV4cGlyZXM9e2V4cGlyZXN9PlxyXG5cdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT5cclxuXHRcdFx0PC9zcGFuPjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuVGltZUNvdW50ZG93bi5wcm9wVHlwZXMgPSB7XHJcblx0aXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZUNvdW50ZG93bjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgVGltZXJSZWxhdGl2ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1yZWxhdGl2ZVwiPlxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInRpbWVyIHJlbGF0aXZlXCIgZGF0YS10aW1lc3RhbXA9e3RoaXMucHJvcHMudGltZXN0YW1wfT5cclxuXHRcdFx0XHRcdHttb21lbnQodGhpcy5wcm9wcy50aW1lc3RhbXAgKiAxMDAwKS50d2l0dGVyU2hvcnQoKX1cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuVGltZXJSZWxhdGl2ZS5wcm9wVHlwZXMgPSB7XHJcblx0aXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXJSZWxhdGl2ZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgVGltZXN0YW1wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgdGltZXN0YW1wSHRtbCA9IG1vbWVudCgodGhpcy5wcm9wcy50aW1lc3RhbXApICogMTAwMCkuZm9ybWF0KCdoaDptbTpzcycpO1xyXG5cclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXRpbWVzdGFtcFwiPlxyXG5cdFx0XHRcdHt0aW1lc3RhbXBIdG1sfVxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblRpbWVzdGFtcC5wcm9wVHlwZXMgPSB7XHJcblx0aXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXN0YW1wO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBUaW1lclJlbGF0aXZlID0gcmVxdWlyZSgnLi9UaW1lclJlbGF0aXZlJyk7XHJcbmNvbnN0IFRpbWVzdGFtcCA9IHJlcXVpcmUoJy4vVGltZXN0YW1wJyk7XHJcbmNvbnN0IE1hcE5hbWUgPSByZXF1aXJlKCcuL01hcE5hbWUnKTtcclxuY29uc3QgSWNvbnMgPSByZXF1aXJlKCcuL0ljb25zJyk7XHJcbmNvbnN0IExhYmVsID0gcmVxdWlyZSgnLi9MYWJlbCcpO1xyXG5jb25zdCBHdWlsZCA9IHJlcXVpcmUoJy4vR3VpbGQnKTtcclxuY29uc3QgVGltZXJDb3VudGRvd24gPSByZXF1aXJlKCcuL1RpbWVyQ291bnRkb3duJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xEZWZhdWx0cyA9IHtcclxuXHRlbGFwc2VkOiBmYWxzZSxcclxuXHR0aW1lc3RhbXA6IGZhbHNlLFxyXG5cdG1hcEFiYnJldjogZmFsc2UsXHJcblx0YXJyb3c6IGZhbHNlLFxyXG5cdHNwcml0ZTogZmFsc2UsXHJcblx0bmFtZTogZmFsc2UsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IGZhbHNlLFxyXG5cdGd1aWxkVGFnOiBmYWxzZSxcclxuXHR0aW1lcjogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBPYmplY3RpdmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3Q2FwdHVyZSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG5cdFx0Y29uc3QgbmV3T3duZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRDb2xvciwgbmV4dFByb3BzLndvcmxkQ29sb3IpO1xyXG5cdFx0Y29uc3QgbmV3Q2xhaW1lciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3Q2FwdHVyZSB8fCBuZXdPd25lciB8fCBuZXdDbGFpbWVyIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ09iamVjdGl2ZTpyZW5kZXIoKScsIHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG5cclxuXHRcdGNvbnN0IG9iamVjdGl2ZUlkID0gdGhpcy5wcm9wcy5vYmplY3RpdmVJZC50b1N0cmluZygpO1xyXG5cdFx0Y29uc3Qgb01ldGEgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KG9iamVjdGl2ZUlkKTtcclxuXHJcblx0XHQvLyBzaG9ydCBjaXJjdWl0XHJcblx0XHRpZiAob01ldGEuaXNFbXB0eSgpKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNvbHMgPSBfLmRlZmF1bHRzKHRoaXMucHJvcHMuY29scywgY29sRGVmYXVsdHMpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17YG9iamVjdGl2ZSB0ZWFtICR7dGhpcy5wcm9wcy53b3JsZENvbG9yfWB9PlxyXG5cdFx0XHRcdDxUaW1lclJlbGF0aXZlIGlzRW5hYmxlZD17ISFjb2xzLmVsYXBzZWR9IHRpbWVzdGFtcD17cHJvcHMudGltZXN0YW1wfSAvPlxyXG5cdFx0XHRcdDxUaW1lc3RhbXAgaXNFbmFibGVkPXshIWNvbHMudGltZXN0YW1wfSB0aW1lc3RhbXA9e3Byb3BzLnRpbWVzdGFtcH0gLz5cclxuXHRcdFx0XHQ8TWFwTmFtZSBpc0VuYWJsZWQ9eyEhY29scy5tYXBBYmJyZXZ9IG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH0gLz5cclxuXHJcblx0XHRcdFx0PEljb25zXHJcblx0XHRcdFx0XHRzaG93QXJyb3c9eyEhY29scy5hcnJvd31cclxuXHRcdFx0XHRcdHNob3dTcHJpdGU9eyEhY29scy5zcHJpdGV9XHJcblx0XHRcdFx0XHRvYmplY3RpdmVJZD17b2JqZWN0aXZlSWR9XHJcblx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy53b3JsZENvbG9yfVxyXG5cdFx0XHRcdC8+XHJcblxyXG5cdFx0XHRcdDxMYWJlbCBpc0VuYWJsZWQ9eyEhY29scy5uYW1lfSBvYmplY3RpdmVJZD17b2JqZWN0aXZlSWR9IGxhbmc9e3RoaXMucHJvcHMubGFuZ30gLz5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtc3RhdGVcIj5cclxuXHRcdFx0XHRcdDxHdWlsZFxyXG5cdFx0XHRcdFx0XHRzaG93TmFtZT17Y29scy5ndWlsZE5hbWV9XHJcblx0XHRcdFx0XHRcdHNob3dUYWc9e2NvbHMuZ3VpbGRUYWd9XHJcblx0XHRcdFx0XHRcdGd1aWxkSWQ9e3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuXHRcdFx0XHRcdFx0Z3VpbGQ9e3RoaXMucHJvcHMuZ3VpbGR9XHJcblx0XHRcdFx0XHQvPlxyXG5cclxuXHRcdFx0XHRcdDxUaW1lckNvdW50ZG93biBpc0VuYWJsZWQ9eyEhY29scy50aW1lcn0gdGltZXN0YW1wPXtwcm9wcy50aW1lc3RhbXB9IC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuT2JqZWN0aXZlLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuXHRvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkQ29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHR0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHRldmVudFR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblxyXG5cdGd1aWxkSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0Z3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cclxuXHRjb2xzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0aXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTcHJpdGUgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvL1Nwcml0ZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBIb2xkaW5nc0l0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0b1R5cGU6IFNUQVRJQy5vYmplY3RpdmVfdHlwZXMuZ2V0KHByb3BzLnR5cGVJZClcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1F1YW50aXR5ID0gKHRoaXMucHJvcHMudHlwZVF1YW50aXR5ICE9PSBuZXh0UHJvcHMudHlwZVF1YW50aXR5KTtcclxuXHRcdGNvbnN0IG5ld1R5cGUgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG5cdFx0Y29uc3QgbmV3Q29sb3IgPSAodGhpcy5wcm9wcy5jb2xvciAhPT0gbmV4dFByb3BzLmNvbG9yKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdRdWFudGl0eSB8fCBuZXdUeXBlIHx8IG5ld0NvbG9yKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblxyXG5cdFx0aWYgKG5ld1R5cGUpIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7b1R5cGU6IFNUQVRJQy5vYmplY3RpdmVfdHlwZXMuZ2V0KHRoaXMucHJvcHMudHlwZUlkKX0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6U2NvcmVib2FyZDo6SG9sZGluZ3NJdGVtOnJlbmRlcigpJywgdGhpcy5zdGF0ZS5vVHlwZS50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0XHQ8U3ByaXRlXHJcblx0XHRcdFx0XHR0eXBlPXt0aGlzLnN0YXRlLm9UeXBlLmdldCgnbmFtZScpfVxyXG5cdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMuY29sb3J9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0XHR7YCB4JHt0aGlzLnByb3BzLnR5cGVRdWFudGl0eX1gfVxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuSG9sZGluZ3NJdGVtLnByb3BUeXBlcyA9IHtcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdHR5cGVRdWFudGl0eTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdHR5cGVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9sZGluZ3NJdGVtOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBJdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEhvbGRpbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdIb2xkaW5ncyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ob2xkaW5ncywgbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdIb2xkaW5ncyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIDx1bCBjbGFzc05hbWU9XCJsaXN0LWlubGluZVwiPlxyXG5cdFx0XHR7dGhpcy5wcm9wcy5ob2xkaW5ncy5tYXAoKHR5cGVRdWFudGl0eSwgdHlwZUluZGV4KSA9PlxyXG5cdFx0XHRcdDxJdGVtXHJcblx0XHRcdFx0XHRrZXk9e3R5cGVJbmRleH1cclxuXHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLmNvbG9yfVxyXG5cdFx0XHRcdFx0dHlwZVF1YW50aXR5PXt0eXBlUXVhbnRpdHl9XHJcblx0XHRcdFx0XHR0eXBlSWQ9eyh0eXBlSW5kZXgrMSkudG9TdHJpbmcoKX1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQpfVxyXG5cdFx0PC91bD47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkhvbGRpbmdzLnByb3BUeXBlcyA9IHtcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGhvbGRpbmdzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbGRpbmdzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7aGVpZ2h0OiAnOTBweCcsIGZvbnRTaXplOiAnMzJwdCcsIGxpbmVIZWlnaHQ6ICc5MHB4J319PlxyXG5cdDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT5cclxuPC9oMT47XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEhvbGRpbmdzID0gcmVxdWlyZSgnLi9Ib2xkaW5ncycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3V29ybGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCk7XHJcblx0XHRjb25zdCBuZXdTY29yZSA9ICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpO1xyXG5cdFx0Y29uc3QgbmV3VGljayA9ICh0aGlzLnByb3BzLnRpY2sgIT09IG5leHRQcm9wcy50aWNrKTtcclxuXHRcdGNvbnN0IG5ld0hvbGRpbmdzID0gKHRoaXMucHJvcHMuaG9sZGluZ3MgIT09IG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3V29ybGQgfHwgbmV3U2NvcmUgfHwgbmV3VGljayB8fCBuZXdIb2xkaW5ncyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtgc2NvcmVib2FyZCB0ZWFtLWJnIHRlYW0gdGV4dC1jZW50ZXIgJHt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1gfT5cclxuXHRcdFx0XHRcdHsodGhpcy5wcm9wcy53b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHRoaXMucHJvcHMud29ybGQpKVxyXG5cdFx0XHRcdFx0XHQ/ICA8ZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxoMT48YSBocmVmPXt0aGlzLnByb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuXHRcdFx0XHRcdFx0XHRcdHt0aGlzLnByb3BzLndvcmxkLmdldCgnbmFtZScpfVxyXG5cdFx0XHRcdFx0XHRcdDwvYT48L2gxPlxyXG5cdFx0XHRcdFx0XHRcdDxoMj5cclxuXHRcdFx0XHRcdFx0XHRcdHtudW1lcmFsKHRoaXMucHJvcHMuc2NvcmUpLmZvcm1hdCgnMCwwJyl9XHJcblx0XHRcdFx0XHRcdFx0XHR7JyAnfVxyXG5cdFx0XHRcdFx0XHRcdFx0e251bWVyYWwodGhpcy5wcm9wcy50aWNrKS5mb3JtYXQoJyswLDAnKX1cclxuXHRcdFx0XHRcdFx0XHQ8L2gyPlxyXG5cclxuXHRcdFx0XHRcdFx0XHQ8SG9sZGluZ3NcclxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1cclxuXHRcdFx0XHRcdFx0XHRcdGhvbGRpbmdzPXt0aGlzLnByb3BzLmhvbGRpbmdzfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ6IGxvYWRpbmdIdG1sXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuV29ybGQucHJvcFR5cGVzID0ge1xyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHNjb3JlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0dGljazogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdGhvbGRpbmdzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBXb3JsZCA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgU2NvcmVib2FyZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyksIG5leHRQcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZHMgfHwgbmV3U2NvcmVzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnU2NvcmVib2FyZDo6V29ybGRzOjpyZW5kZXIoKScpO1xyXG5cclxuXHRcdGNvbnN0IHNjb3JlcyA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHRcdGNvbnN0IHRpY2tzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3RpY2tzJyk7XHJcblx0XHRjb25zdCBob2xkaW5ncyA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCdob2xkaW5ncycpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGNsYXNzTmFtZT1cInJvd1wiIGlkPVwic2NvcmVib2FyZHNcIj5cclxuXHRcdFx0XHR7dGhpcy5wcm9wcy5tYXRjaFdvcmxkcy50b1NlcSgpLm1hcCgod29ybGQsIGl4V29ybGQpID0+XHJcblx0XHRcdFx0XHQ8V29ybGRcclxuXHRcdFx0XHRcdFx0a2V5PXtpeFdvcmxkfVxyXG5cdFx0XHRcdFx0XHR3b3JsZD17d29ybGR9XHJcblx0XHRcdFx0XHRcdHNjb3JlPXtzY29yZXMuZ2V0KGl4V29ybGQpIHx8IDB9XHJcblx0XHRcdFx0XHRcdHRpY2s9e3RpY2tzLmdldChpeFdvcmxkKSB8fCAwfVxyXG5cdFx0XHRcdFx0XHRob2xkaW5ncz17aG9sZGluZ3MuZ2V0KGl4V29ybGQpfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5TY29yZWJvYXJkLnByb3BUeXBlcyA9IHtcclxuXHRtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0bWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY29yZWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuXHJcblxyXG5jb25zdCBhcGkgPSByZXF1aXJlKCdsaWIvYXBpLmpzJyk7XHJcbmNvbnN0IGxpYkRhdGUgPSByZXF1aXJlKCdsaWIvZGF0ZS5qcycpO1xyXG5jb25zdCB0cmFja2VyVGltZXJzID0gcmVxdWlyZSgnbGliL3RyYWNrZXJUaW1lcnMnKTtcclxuXHJcbmNvbnN0IEd1aWxkc0xpYiA9IHJlcXVpcmUoJ2xpYi90cmFja2VyL2d1aWxkcy5qcycpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNjb3JlYm9hcmQgPSByZXF1aXJlKCcuL1Njb3JlYm9hcmQnKTtcclxuY29uc3QgTWFwcyA9IHJlcXVpcmUoJy4vTWFwcycpO1xyXG5jb25zdCBHdWlsZHMgPSByZXF1aXJlKCcuL0d1aWxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUcmFja2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdGhhc0RhdGE6IGZhbHNlLFxyXG5cclxuXHRcdFx0ZGF0ZU5vdzogbGliRGF0ZS5kYXRlTm93KCksXHJcblx0XHRcdGxhc3Rtb2Q6IDAsXHJcblx0XHRcdHRpbWVPZmZzZXQ6IDAsXHJcblxyXG5cdFx0XHRtYXRjaDogSW1tdXRhYmxlLk1hcCh7bGFzdG1vZDowfSksXHJcblx0XHRcdG1hdGNoV29ybGRzOiBJbW11dGFibGUuTGlzdCgpLFxyXG5cdFx0XHRkZXRhaWxzOiBJbW11dGFibGUuTWFwKCksXHJcblx0XHRcdGNsYWltRXZlbnRzOiBJbW11dGFibGUuTGlzdCgpLFxyXG5cdFx0XHRndWlsZHM6IEltbXV0YWJsZS5NYXAoKSxcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMubW91bnRlZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5pbnRlcnZhbHMgPSB7XHJcblx0XHRcdHRpbWVyczogbnVsbFxyXG5cdFx0fTtcclxuXHRcdHRoaXMudGltZW91dHMgPSB7XHJcblx0XHRcdGRhdGE6IG51bGxcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuZ3VpbGRMaWIgPSBuZXcgR3VpbGRzTGliKHRoaXMpO1xyXG5cdH1cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0Y29uc3QgaW5pdGlhbERhdGEgPSAhXy5pc0VxdWFsKHRoaXMuc3RhdGUuaGFzRGF0YSwgbmV4dFN0YXRlLmhhc0RhdGEpO1xyXG5cdFx0Y29uc3QgbmV3TWF0Y2hEYXRhID0gIV8uaXNFcXVhbCh0aGlzLnN0YXRlLmxhc3Rtb2QsIG5leHRTdGF0ZS5sYXN0bW9kKTtcclxuXHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZ3VpbGRzLCBuZXh0U3RhdGUuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuXHRcdFx0aW5pdGlhbERhdGFcclxuXHRcdFx0fHwgbmV3TWF0Y2hEYXRhXHJcblx0XHRcdHx8IG5ld0d1aWxkRGF0YVxyXG5cdFx0XHR8fCBuZXdMYW5nXHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudERpZE1vdW50KCknKTtcclxuXHJcblx0XHR0aGlzLmludGVydmFscy50aW1lcnMgPSBzZXRJbnRlcnZhbCh1cGRhdGVUaW1lcnMuYmluZCh0aGlzKSwgMTAwMCk7XHJcblx0XHRzZXRJbW1lZGlhdGUodXBkYXRlVGltZXJzLmJpbmQodGhpcykpO1xyXG5cclxuXHRcdHNldEltbWVkaWF0ZShnZXRNYXRjaERldGFpbHMuYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVbm1vdW50KCknKTtcclxuXHJcblx0XHRjbGVhclRpbWVycy5jYWxsKHRoaXMpO1xyXG5cclxuXHRcdHRoaXMubW91bnRlZCA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKScsIG5ld0xhbmcpO1xyXG5cclxuXHRcdGlmIChuZXdMYW5nKSB7XHJcblx0XHRcdHNldE1hdGNoV29ybGRzLmNhbGwodGhpcywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xyXG5cdC8vIFx0Y29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVcGRhdGUoKScpO1xyXG5cdC8vIH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6cmVuZGVyKCknKTtcclxuXHRcdHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcsIHRoaXMucHJvcHMud29ybGQpO1xyXG5cclxuXHJcblx0XHRpZiAoIXRoaXMuc3RhdGUuaGFzRGF0YSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9XCJ0cmFja2VyXCI+XHJcblxyXG5cdFx0XHRcdHs8U2NvcmVib2FyZFxyXG5cdFx0XHRcdFx0bWF0Y2hXb3JsZHM9e3RoaXMuc3RhdGUubWF0Y2hXb3JsZHN9XHJcblx0XHRcdFx0XHRtYXRjaD17dGhpcy5zdGF0ZS5tYXRjaH1cclxuXHRcdFx0XHQvPn1cclxuXHJcblx0XHRcdFx0ezxNYXBzXHJcblx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRkZXRhaWxzPXt0aGlzLnN0YXRlLmRldGFpbHN9XHJcblx0XHRcdFx0XHRtYXRjaFdvcmxkcz17dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuXHRcdFx0XHRcdGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9XHJcblx0XHRcdFx0Lz59XHJcblxyXG5cdFx0XHRcdHs8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMjRcIj5cclxuXHRcdFx0XHRcdFx0eyghdGhpcy5zdGF0ZS5ndWlsZHMuaXNFbXB0eSgpKVxyXG5cdFx0XHRcdFx0XHRcdD8gPEd1aWxkc1xyXG5cdFx0XHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGd1aWxkcz17dGhpcy5zdGF0ZS5ndWlsZHN9XHJcblx0XHRcdFx0XHRcdFx0XHRjbGFpbUV2ZW50cz17dGhpcy5zdGF0ZS5jbGFpbUV2ZW50c31cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHRcdDogbnVsbFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj59XHJcblxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuVHJhY2tlci5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrZXI7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRUaW1lcnNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRpbWVycygpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRjb25zdCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHQvLyBjb25zb2xlLmxvZygndXBkYXRlVGltZXJzKCknKTtcclxuXHJcblx0Y29uc3QgdGltZU9mZnNldCA9IHN0YXRlLnRpbWVPZmZzZXQ7XHJcblx0Y29uc3Qgbm93ID0gbGliRGF0ZS5kYXRlTm93KCkgLSB0aW1lT2Zmc2V0O1xyXG5cclxuXHR0cmFja2VyVGltZXJzLnVwZGF0ZShub3csIHRpbWVPZmZzZXQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNsZWFyVGltZXJzKCl7XHJcblx0Ly8gY29uc29sZS5sb2coJ2NsZWFyVGltZXJzKCknKTtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0Xy5mb3JFYWNoKGNvbXBvbmVudC5pbnRlcnZhbHMsIGNsZWFySW50ZXJ2YWwpO1xyXG5cdF8uZm9yRWFjaChjb21wb25lbnQudGltZW91dHMsIGNsZWFyVGltZW91dCk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNYXRjaCBEZXRhaWxzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscygpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRjb25zdCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcclxuXHJcblx0Y29uc3Qgd29ybGQgPSBwcm9wcy53b3JsZDtcclxuXHRjb25zdCBsYW5nU2x1ZyA9IHByb3BzLmxhbmcuZ2V0KCdzbHVnJyk7XHJcblx0Y29uc3Qgd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuXHJcblx0YXBpLmdldE1hdGNoRGV0YWlsc0J5V29ybGQoXHJcblx0XHR3b3JsZFNsdWcsXHJcblx0XHRvbk1hdGNoRGV0YWlscy5iaW5kKHRoaXMpXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvbk1hdGNoRGV0YWlscyhlcnIsIGRhdGEpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRjb25zdCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcclxuXHRjb25zdCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblxyXG5cdGlmIChjb21wb25lbnQubW91bnRlZCkge1xyXG5cdFx0aWYgKCFlcnIgJiYgZGF0YSAmJiBkYXRhLm1hdGNoICYmIGRhdGEuZGV0YWlscykge1xyXG5cdFx0XHRjb25zdCBsYXN0bW9kID0gZGF0YS5tYXRjaC5sYXN0bW9kO1xyXG5cdFx0XHRjb25zdCBpc01vZGlmaWVkID0gKGxhc3Rtb2QgIT09IHN0YXRlLm1hdGNoLmdldCgnbGFzdG1vZCcpKTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsIGRhdGEubWF0Y2gubGFzdG1vZCwgaXNNb2RpZmllZCk7XHJcblxyXG5cdFx0XHRpZiAoaXNNb2RpZmllZCkge1xyXG5cdFx0XHRcdGNvbnN0IGRhdGVOb3cgPSBsaWJEYXRlLmRhdGVOb3coKTtcclxuXHRcdFx0XHRjb25zdCB0aW1lT2Zmc2V0ID0gTWF0aC5mbG9vcihkYXRlTm93ICAtIChkYXRhLm5vdyAvIDEwMDApKTtcclxuXHJcblx0XHRcdFx0Y29uc3QgbWF0Y2hEYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhLm1hdGNoKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCAnbWF0Y2gnLCBJbW11dGFibGUuaXMobWF0Y2hEYXRhLCBzdGF0ZS5tYXRjaCkpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsIG1hdGNoKTtcclxuXHJcblx0XHRcdFx0Y29uc3QgZGV0YWlsc0RhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEuZGV0YWlscyk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgJ2RldGFpbHMnLCBJbW11dGFibGUuaXMoZGV0YWlsc0RhdGEsIHN0YXRlLmRldGFpbHMpKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCBkZXRhaWxzKTtcclxuXHJcblx0XHRcdFx0Ly8gdXNlIHRyYW5zYWN0aW9uYWwgc2V0U3RhdGVcclxuXHRcdFx0XHRjb21wb25lbnQuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuXHRcdFx0XHRcdGhhc0RhdGE6IHRydWUsXHJcblx0XHRcdFx0XHRkYXRlTm93LFxyXG5cdFx0XHRcdFx0dGltZU9mZnNldCxcclxuXHRcdFx0XHRcdGxhc3Rtb2QsXHJcblxyXG5cdFx0XHRcdFx0bWF0Y2g6IHN0YXRlLm1hdGNoLm1lcmdlRGVlcChtYXRjaERhdGEpLFxyXG5cdFx0XHRcdFx0ZGV0YWlsczogc3RhdGUuZGV0YWlscy5tZXJnZURlZXAoZGV0YWlsc0RhdGEpLFxyXG5cdFx0XHRcdH0pKTtcclxuXHJcblxyXG5cdFx0XHRcdHNldEltbWVkaWF0ZShjb21wb25lbnQuZ3VpbGRMaWIub25NYXRjaERhdGEuYmluZChjb21wb25lbnQuZ3VpbGRMaWIsIGRldGFpbHNEYXRhKSk7XHJcblxyXG5cdFx0XHRcdGlmIChzdGF0ZS5tYXRjaFdvcmxkcy5pc0VtcHR5KCkpIHtcclxuXHRcdFx0XHRcdHNldEltbWVkaWF0ZShzZXRNYXRjaFdvcmxkcy5iaW5kKGNvbXBvbmVudCwgcHJvcHMubGFuZykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRyZXNjaGVkdWxlRGF0YVVwZGF0ZS5jYWxsKGNvbXBvbmVudCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlc2NoZWR1bGVEYXRhVXBkYXRlKCkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCoyLCAxMDAwKjQpO1xyXG5cclxuXHRjb21wb25lbnQudGltZW91dHMuZGF0YSA9IHNldFRpbWVvdXQoZ2V0TWF0Y2hEZXRhaWxzLmJpbmQoY29tcG9uZW50KSwgcmVmcmVzaFRpbWUpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TWF0Y2hXb3JsZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0TWF0Y2hXb3JsZHMobGFuZykge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRjb21wb25lbnQuc2V0U3RhdGUoe21hdGNoV29ybGRzOiBJbW11dGFibGVcclxuXHRcdC5MaXN0KFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXSlcclxuXHRcdC5tYXAoZ2V0TWF0Y2hXb3JsZC5iaW5kKGNvbXBvbmVudCwgbGFuZykpXHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hXb3JsZChsYW5nLCBjb2xvcikge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG5cdGNvbnN0IHdvcmxkS2V5ID0gY29sb3IgKyAnSWQnO1xyXG5cdGNvbnN0IHdvcmxkSWQgPSBzdGF0ZS5tYXRjaC5nZXRJbihbd29ybGRLZXldKS50b1N0cmluZygpO1xyXG5cclxuXHRjb25zdCB3b3JsZEJ5TGFuZyA9IFNUQVRJQy53b3JsZHMuZ2V0SW4oW3dvcmxkSWQsIGxhbmdTbHVnXSk7XHJcblxyXG5cdHJldHVybiB3b3JsZEJ5TGFuZ1xyXG5cdFx0LnNldCgnY29sb3InLCBjb2xvcilcclxuXHRcdC5zZXQoJ2xpbmsnLCBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkQnlMYW5nKSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG5cdHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZC5nZXQoJ3NsdWcnKV0uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNYXRjaCBEZXRhaWxzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFBhZ2VUaXRsZShsYW5nLCB3b3JsZCkge1xyXG5cdGxldCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblx0bGV0IHdvcmxkTmFtZSA9IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ25hbWUnXSk7XHJcblxyXG5cdGxldCB0aXRsZSA9IFt3b3JsZE5hbWUsICdndzJ3MncnXTtcclxuXHJcblx0aWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcblx0XHR0aXRsZS5wdXNoKGxhbmcuZ2V0KCduYW1lJykpO1xyXG5cdH1cclxuXHJcblx0JCgndGl0bGUnKS50ZXh0KHRpdGxlLmpvaW4oJyAtICcpKTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld09iamVjdGl2ZU1ldGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMub01ldGEsIG5leHRQcm9wcy5vTWV0YSk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3T2JqZWN0aXZlTWV0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGltZ1NyYyA9IGdldEFycm93U3JjKHRoaXMucHJvcHMub01ldGEpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImRpcmVjdGlvblwiPlxyXG5cdFx0XHRcdHtpbWdTcmMgPyA8aW1nIHNyYz17aW1nU3JjfSAvPiA6IG51bGx9XHJcblx0XHRcdDwvc3Bhbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkFycm93LnByb3BUeXBlcyA9IHtcclxuXHRvTWV0YTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRBcnJvd1NyYyhtZXRhKSB7XHJcblx0aWYgKCFtZXRhLmdldCgnZCcpKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdGxldCBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuXHRpZiAobWV0YS5nZXQoJ24nKSkge3NyYy5wdXNoKCdub3J0aCcpOyB9XHJcblx0ZWxzZSBpZiAobWV0YS5nZXQoJ3MnKSkge3NyYy5wdXNoKCdzb3V0aCcpOyB9XHJcblxyXG5cdGlmIChtZXRhLmdldCgndycpKSB7c3JjLnB1c2goJ3dlc3QnKTsgfVxyXG5cdGVsc2UgaWYgKG1ldGEuZ2V0KCdlJykpIHtzcmMucHVzaCgnZWFzdCcpOyB9XHJcblxyXG5cdHJldHVybiBzcmMuam9pbignLScpICsgJy5zdmcnO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBpbWdQbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48L3N2Zz4nO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEVtYmxlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3R3VpbGROYW1lID0gKHRoaXMucHJvcHMuZ3VpbGROYW1lICE9PSBuZXh0UHJvcHMuZ3VpbGROYW1lKTtcclxuXHRcdGNvbnN0IG5ld1NpemUgPSAodGhpcy5wcm9wcy5zaXplICE9PSBuZXh0UHJvcHMuc2l6ZSk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0d1aWxkTmFtZSB8fCBuZXdTaXplKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgZW1ibGVtU3JjID0gZ2V0RW1ibGVtU3JjKHRoaXMucHJvcHMuZ3VpbGROYW1lKTtcclxuXHJcblx0XHRyZXR1cm4gPGltZ1xyXG5cdFx0XHRjbGFzc05hbWU9XCJlbWJsZW1cIlxyXG5cdFx0XHRzcmM9e2VtYmxlbVNyY31cclxuXHRcdFx0d2lkdGg9e3RoaXMucHJvcHMuc2l6ZX1cclxuXHRcdFx0aGVpZ2h0PXt0aGlzLnByb3BzLnNpemV9XHJcblx0XHRcdG9uRXJyb3I9e2ltZ09uRXJyb3J9XHJcblx0XHQvPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuRW1ibGVtLmRlZmF1bHRQcm9wcyA9IHtcclxuXHRndWlsZE5hbWU6IHVuZGVmaW5lZCxcclxuXHRzaXplOiAyNTYsXHJcbn07XHJcblxyXG5FbWJsZW0ucHJvcFR5cGVzID0ge1xyXG5cdGd1aWxkTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbWJsZW07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0RW1ibGVtU3JjKGd1aWxkTmFtZSkge1xyXG5cdHJldHVybiAoZ3VpbGROYW1lKVxyXG5cdFx0PyBgaHR0cDpcXC9cXC9ndWlsZHMuZ3cydzJ3LmNvbVxcL2d1aWxkc1xcLyR7c2x1Z2lmeShndWlsZE5hbWUpfVxcLzI1Ni5zdmdgXHJcblx0XHQ6IGltZ1BsYWNlaG9sZGVyO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcblx0cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIucmVwbGFjZSgvIC9nLCAnLScpKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGltZ09uRXJyb3IoZSkge1xyXG5cdGNvbnN0IGN1cnJlbnRTcmMgPSAkKGUudGFyZ2V0KS5hdHRyKCdzcmMnKTtcclxuXHJcblx0aWYgKGN1cnJlbnRTcmMgIT09IGltZ1BsYWNlaG9sZGVyKSB7XHJcblx0XHQkKGUudGFyZ2V0KS5hdHRyKCdzcmMnLCBpbWdQbGFjZWhvbGRlcik7XHJcblx0fVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgSU5TVEFOQ0UgPSB7XHJcblx0c2l6ZTogNjAsXHJcblx0c3Ryb2tlOiAyLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBQaWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdHJldHVybiAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2NvcmVzLCBuZXh0UHJvcHMuc2NvcmVzKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnUGllOjpyZW5kZXInLCBwcm9wcy5zY29yZXMudG9BcnJheSgpKTtcclxuXHJcblx0XHRyZXR1cm4gPGltZ1xyXG5cdFx0XHR3aWR0aD17SU5TVEFOQ0Uuc2l6ZX1cclxuXHRcdFx0aGVpZ2h0PXtJTlNUQU5DRS5zaXplfVxyXG5cdFx0XHRzcmM9e2dldEltYWdlU291cmNlKHByb3BzLnNjb3Jlcy50b0FycmF5KCkpfVxyXG5cdFx0Lz47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblBpZS5wcm9wVHlwZXMgPSB7XHJcblx0c2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldEltYWdlU291cmNlKHNjb3Jlcykge1xyXG5cdHJldHVybiBgaHR0cDpcXC9cXC93d3cucGllbHkubmV0XFwvJHtJTlNUQU5DRS5zaXplfVxcLyR7c2NvcmVzLmpvaW4oJywnKX0/c3Ryb2tlV2lkdGg9JHtJTlNUQU5DRS5zdHJva2V9YDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBTcHJpdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtyZXR1cm4gIV8uaXNFcXVhbCh0aGlzLnByb3BzLCBuZXh0UHJvcHMpO31cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiA8c3BhbiBjbGFzc05hbWU9e2BzcHJpdGUgJHtwcm9wcy50eXBlfSAke3Byb3BzLmNvbG9yfWB9IC8+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5TcHJpdGUucHJvcFR5cGVzID0ge1xyXG5cdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0ZWQgQ29tcG9uZW50XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExhbmdMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Y29uc3QgaXNBY3RpdmUgPSBJbW11dGFibGUuaXMocHJvcHMubGFuZywgcHJvcHMubGlua0xhbmcpO1xyXG5cdFx0Y29uc3QgdGl0bGUgPSBwcm9wcy5saW5rTGFuZy5nZXQoJ25hbWUnKTtcclxuXHRcdGNvbnN0IGxhYmVsID0gcHJvcHMubGlua0xhbmcuZ2V0KCdsYWJlbCcpO1xyXG5cdFx0Y29uc3QgbGluayA9IGdldExpbmsocHJvcHMubGlua0xhbmcsIHByb3BzLndvcmxkKTtcclxuXHJcblx0XHRyZXR1cm4gPGxpIGNsYXNzTmFtZT17aXNBY3RpdmUgPyAnYWN0aXZlJyA6ICcnfSB0aXRsZT17dGl0bGV9PlxyXG5cdFx0XHQ8YSBocmVmPXtsaW5rfT57bGFiZWx9PC9hPlxyXG5cdFx0PC9saT47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxhbmdMaW5rLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuXHRsaW5rTGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExhbmdMaW5rO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TGluayhsYW5nLCB3b3JsZCkge1xyXG5cdGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0bGV0IGxpbmsgPSBgLyR7bGFuZ1NsdWd9YDtcclxuXHJcblx0aWYgKHdvcmxkKSB7XHJcblx0XHRsZXQgd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuXHRcdGxpbmsgKz0gYC8ke3dvcmxkU2x1Z31gO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGxpbms7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTGFuZ0xpbmsgPSByZXF1aXJlKCcuL0xhbmdMaW5rJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnRlZCBDb21wb25lbnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTGFuZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHJlbmRlcigpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnTGFuZ3M6OnJlbmRlcigpJywgdGhpcy5wcm9wcy5sYW5nLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT0nbmF2IG5hdmJhci1uYXYnPlxyXG5cdFx0XHRcdHtTVEFUSUMubGFuZ3MudG9TZXEoKS5tYXAoKGxpbmtMYW5nLCBrZXkpID0+XHJcblx0XHRcdFx0XHQ8TGFuZ0xpbmtcclxuXHRcdFx0XHRcdFx0a2V5PXtrZXl9XHJcblx0XHRcdFx0XHRcdGxpbmtMYW5nPXtsaW5rTGFuZ31cclxuXHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHR3b3JsZD17dGhpcy5wcm9wcy53b3JsZH1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxhbmdzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExhbmdzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBndzJhcGkgPSByZXF1aXJlKCdndzJhcGknKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHRnZXRNYXRjaGVzOiBnZXRNYXRjaGVzLFxyXG5cdC8vIGdldE1hdGNoRGV0YWlsczogZ2V0TWF0Y2hEZXRhaWxzLFxyXG5cdGdldE1hdGNoRGV0YWlsc0J5V29ybGQ6IGdldE1hdGNoRGV0YWlsc0J5V29ybGQsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuXHRndzJhcGkuZ2V0TWF0Y2hlc1N0YXRlKGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMoZ3VpbGRJZCwgY2FsbGJhY2spIHtcclxuXHRndzJhcGkuZ2V0R3VpbGREZXRhaWxzKHtndWlsZF9pZDogZ3VpbGRJZH0sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMobWF0Y2hJZCwgY2FsbGJhY2spIHtcclxuXHRndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe21hdGNoX2lkOiBtYXRjaElkfSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc0J5V29ybGQod29ybGRTbHVnLCBjYWxsYmFjaykge1xyXG5cdC8vIHNldFRpbWVvdXQoXHJcblx0Ly8gXHRndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUuYmluZChudWxsLCB7d29ybGRfc2x1Zzogd29ybGRTbHVnfSwgY2FsbGJhY2spLFxyXG5cdC8vIFx0MzAwMFxyXG5cdC8vICk7XHJcblx0Z3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlKHt3b3JsZF9zbHVnOiB3b3JsZFNsdWd9LCBjYWxsYmFjayk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGRhdGVOb3c6IGRhdGVOb3csXHJcblx0YWRkNTogYWRkNSxcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBkYXRlTm93KCkge1xyXG5cdHJldHVybiBNYXRoLmZsb29yKF8ubm93KCkgLyAxMDAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZDUoaW5EYXRlKSB7XHJcblx0bGV0IF9iYXNlRGF0ZSA9IGluRGF0ZSB8fCBkYXRlTm93KCk7XHJcblxyXG5cdHJldHVybiAoX2Jhc2VEYXRlICsgKDUgKiA2MCkpO1xyXG59XHJcbiIsImNvbnN0IHN0YXRpY3MgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IGltbXV0YWJsZVN0YXRpY3MgPSB7XHJcblx0bGFuZ3M6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5sYW5ncyksXHJcblx0d29ybGRzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mud29ybGRzKSxcclxuXHRvYmplY3RpdmVfbmFtZXM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbmFtZXMpLFxyXG5cdG9iamVjdGl2ZV90eXBlczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV90eXBlcyksXHJcblx0b2JqZWN0aXZlX21ldGE6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbWV0YSksXHJcblx0b2JqZWN0aXZlX2xhYmVsczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9sYWJlbHMpLFxyXG5cdG9iamVjdGl2ZV9tYXA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbWFwKSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW1tdXRhYmxlU3RhdGljczsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0IGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7dXBkYXRlfTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShub3csIHRpbWVPZmZzZXQpIHtcclxuXHRsZXQgJHRpbWVycyA9ICQoJy50aW1lcicpO1xyXG5cdGxldCAkY291bnRkb3ducyA9ICR0aW1lcnMuZmlsdGVyKCcuY291bnRkb3duJyk7XHJcblx0bGV0ICRyZWxhdGl2ZXMgPSAkdGltZXJzLmZpbHRlcignLnJlbGF0aXZlJyk7XHJcblxyXG5cdGFzeW5jLnBhcmFsbGVsKFtcclxuXHRcdHVwZGF0ZVJlbGF0aXZlVGltZXJzLmJpbmQobnVsbCwgJHJlbGF0aXZlcywgdGltZU9mZnNldCksXHJcblx0XHR1cGRhdGVDb3VudGRvd25UaW1lcnMuYmluZChudWxsLCAkY291bnRkb3ducywgbm93KSxcclxuXHRdLCBfLm5vb3ApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbGF0aXZlVGltZXJzKHJlbGF0aXZlcywgdGltZU9mZnNldCwgY2IpIHtcclxuXHRhc3luYy5lYWNoKFxyXG5cdFx0cmVsYXRpdmVzLFxyXG5cdFx0dXBkYXRlUmVsYXRpdmVUaW1lTm9kZS5iaW5kKG51bGwsIHRpbWVPZmZzZXQpLFxyXG5cdFx0Y2JcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVycyhjb3VudGRvd25zLCBub3csIGNiKSB7XHJcblx0YXN5bmMuZWFjaChcclxuXHRcdGNvdW50ZG93bnMsXHJcblx0XHR1cGRhdGVDb3VudGRvd25UaW1lck5vZGUuYmluZChudWxsLCBub3cpLFxyXG5cdFx0Y2JcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbGF0aXZlVGltZU5vZGUodGltZU9mZnNldCwgZWwsIG5leHQpIHtcclxuXHRsZXQgJGVsID0gJChlbCk7XHJcblxyXG5cdGNvbnN0IHRpbWVzdGFtcCA9IF8ucGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdGltZXN0YW1wJykpO1xyXG5cdGNvbnN0IG9mZnNldFRpbWVzdGFtcCA9IHRpbWVzdGFtcCArIHRpbWVPZmZzZXQ7XHJcblx0Y29uc3QgdGltZXN0YW1wTW9tZW50ID0gbW9tZW50KG9mZnNldFRpbWVzdGFtcCAqIDEwMDApO1xyXG5cdGNvbnN0IHRpbWVzdGFtcFJlbGF0aXZlID0gdGltZXN0YW1wTW9tZW50LnR3aXR0ZXJTaG9ydCgpO1xyXG5cclxuXHQkZWwudGV4dCh0aW1lc3RhbXBSZWxhdGl2ZSk7XHJcblxyXG5cdG5leHQoKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGRvd25UaW1lck5vZGUobm93LCBlbCwgbmV4dCkge1xyXG5cdGxldCAkZWwgPSAkKGVsKTtcclxuXHJcblx0Y29uc3QgZGF0YUV4cGlyZXMgPSAkZWwuYXR0cignZGF0YS1leHBpcmVzJyk7XHJcblx0Y29uc3QgZXhwaXJlcyA9IF8ucGFyc2VJbnQoZGF0YUV4cGlyZXMpO1xyXG5cdGNvbnN0IHNlY1JlbWFpbmluZyA9IChleHBpcmVzIC0gbm93KTtcclxuXHRjb25zdCBzZWNFbGFwc2VkID0gMzAwIC0gc2VjUmVtYWluaW5nO1xyXG5cclxuXHRjb25zdCBoaWdobGl0ZVRpbWUgPSAxMDtcclxuXHRjb25zdCBpc1Zpc2libGUgPSBleHBpcmVzICsgaGlnaGxpdGVUaW1lID49IG5vdztcclxuXHRjb25zdCBpc0V4cGlyZWQgPSBleHBpcmVzIDwgbm93O1xyXG5cdGNvbnN0IGlzQWN0aXZlID0gIWlzRXhwaXJlZDtcclxuXHRjb25zdCBpc1RpbWVySGlnaGxpZ2h0ZWQgPSAoc2VjUmVtYWluaW5nIDw9IE1hdGguYWJzKGhpZ2hsaXRlVGltZSkpO1xyXG5cdGNvbnN0IGlzVGltZXJGcmVzaCA9IChzZWNFbGFwc2VkIDw9IGhpZ2hsaXRlVGltZSk7XHJcblxyXG5cclxuXHRjb25zdCB0aW1lclRleHQgPSAoaXNBY3RpdmUpXHJcblx0XHQ/IG1vbWVudChzZWNSZW1haW5pbmcgKiAxMDAwKS5mb3JtYXQoJ206c3MnKVxyXG5cdFx0OiAnMDowMCc7XHJcblxyXG5cclxuXHRpZiAoaXNWaXNpYmxlKSB7XHJcblx0XHRsZXQgJG9iamVjdGl2ZSA9ICRlbC5jbG9zZXN0KCcub2JqZWN0aXZlJyk7XHJcblx0XHRsZXQgaGFzQ2xhc3NIaWdobGlnaHQgPSAkZWwuaGFzQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG5cdFx0bGV0IGhhc0NsYXNzRnJlc2ggPSAkb2JqZWN0aXZlLmhhc0NsYXNzKCdmcmVzaCcpO1xyXG5cclxuXHRcdGlmIChpc1RpbWVySGlnaGxpZ2h0ZWQgJiYgIWhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcblx0XHRcdCRlbC5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghaXNUaW1lckhpZ2hsaWdodGVkICYmIGhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcblx0XHRcdCRlbC5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzVGltZXJGcmVzaCAmJiAhaGFzQ2xhc3NGcmVzaCkge1xyXG5cdFx0XHQkb2JqZWN0aXZlLmFkZENsYXNzKCdmcmVzaCcpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoIWlzVGltZXJGcmVzaCAmJiBoYXNDbGFzc0ZyZXNoKSB7XHJcblx0XHRcdCRvYmplY3RpdmUucmVtb3ZlQ2xhc3MoJ2ZyZXNoJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0JGVsLnRleHQodGltZXJUZXh0KVxyXG5cdFx0XHQuZmlsdGVyKCcuaW5hY3RpdmUnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJylcclxuXHRcdFx0LmVuZCgpO1xyXG5cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHQkZWwuZmlsdGVyKCcuYWN0aXZlJylcclxuXHRcdFx0LmFkZENsYXNzKCdpbmFjdGl2ZScpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKVxyXG5cdFx0LmVuZCgpO1xyXG5cdH1cclxuXHJcblx0bmV4dCgpO1xyXG59XHJcbiIsIlxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuXHJcbmNvbnN0IGFwaSA9IHJlcXVpcmUoJ2xpYi9hcGkuanMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1vZHVsZSBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGd1aWxkRGVmYXVsdCA9IEltbXV0YWJsZS5NYXAoe1xyXG5cdCdsb2FkZWQnOiBmYWxzZSxcclxuXHQnbGFzdENsYWltJzogMCxcclxuXHQnY2xhaW1zJzogSW1tdXRhYmxlLk1hcCgpLFxyXG59KTtcclxuXHJcblxyXG5jb25zdCBudW1RdWV1ZUNvbmN1cnJlbnQgPSA0O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQdWJsaWMgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMaWJHdWlsZHMge1xyXG5cdGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xyXG5cdFx0dGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XHJcblxyXG5cdFx0dGhpcy5hc3luY0d1aWxkUXVldWUgPSBhc3luYy5xdWV1ZShcclxuXHRcdFx0dGhpcy5nZXRHdWlsZERldGFpbHMuYmluZCh0aGlzKSxcclxuXHRcdFx0bnVtUXVldWVDb25jdXJyZW50XHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRvbk1hdGNoRGF0YShtYXRjaERldGFpbHMpIHtcclxuXHRcdC8vIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLmNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnTGliR3VpbGRzOjpvbk1hdGNoRGF0YSgpJyk7XHJcblxyXG5cdFx0Y29uc3Qgb2JqZWN0aXZlQ2xhaW1lcnMgPSBtYXRjaERldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG5cdFx0Y29uc3QgY2xhaW1FdmVudHMgPSAgZ2V0RXZlbnRzQnlUeXBlKG1hdGNoRGV0YWlscywgJ2NsYWltJyk7XHJcblx0XHRjb25zdCBndWlsZHNUb0xvb2t1cCA9IGdldFVua25vd25HdWlsZHMoc3RhdGUuZ3VpbGRzLCBvYmplY3RpdmVDbGFpbWVycywgY2xhaW1FdmVudHMpO1xyXG5cclxuXHRcdC8vIHNlbmQgbmV3IGd1aWxkcyB0byBhc3luYyBxdWV1ZSBtYW5hZ2VyIGZvciBkYXRhIHJldHJpZXZhbFxyXG5cdFx0aWYgKCFndWlsZHNUb0xvb2t1cC5pc0VtcHR5KCkpIHtcclxuXHRcdFx0dGhpcy5hc3luY0d1aWxkUXVldWUucHVzaChndWlsZHNUb0xvb2t1cC50b0FycmF5KCkpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRsZXQgbmV3R3VpbGRzID0gc3RhdGUuZ3VpbGRzO1xyXG5cdFx0bmV3R3VpbGRzID0gaW5pdGlhbGl6ZUd1aWxkcyhuZXdHdWlsZHMsIGd1aWxkc1RvTG9va3VwKTtcclxuXHRcdG5ld0d1aWxkcyA9IGd1aWxkc1Byb2Nlc3NDbGFpbXMobmV3R3VpbGRzLCBjbGFpbUV2ZW50cyk7XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHN0YXRlIGlmIG5lY2Vzc2FyeVxyXG5cdFx0aWYgKCFJbW11dGFibGUuaXMoc3RhdGUuZ3VpbGRzLCBuZXdHdWlsZHMpKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdndWlsZHM6Om9uTWF0Y2hEYXRhKCknLCAnaGFzIHVwZGF0ZScpO1xyXG5cdFx0XHR0aGlzLmNvbXBvbmVudC5zZXRTdGF0ZSh7Z3VpbGRzOiBuZXdHdWlsZHN9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0Z2V0R3VpbGREZXRhaWxzKGd1aWxkSWQsIG9uQ29tcGxldGUpIHtcclxuXHRcdGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudDtcclxuXHRcdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRcdGNvbnN0IGhhc0RhdGEgPSBzdGF0ZS5ndWlsZHMuZ2V0SW4oW2d1aWxkSWQsICdsb2FkZWQnXSk7XHJcblxyXG5cdFx0aWYgKGhhc0RhdGEpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmdldEd1aWxkRGV0YWlscygpJywgJ3NraXAnLCBndWlsZElkKTtcclxuXHRcdFx0b25Db21wbGV0ZShudWxsKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Z2V0R3VpbGREZXRhaWxzKCknLCAnbG9va3VwJywgZ3VpbGRJZCk7XHJcblx0XHRcdGFwaS5nZXRHdWlsZERldGFpbHMoXHJcblx0XHRcdFx0Z3VpbGRJZCxcclxuXHRcdFx0XHRvbkd1aWxkRGF0YS5iaW5kKHRoaXMsIG9uQ29tcGxldGUpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGliR3VpbGRzO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEob25Db21wbGV0ZSwgZXJyLCBkYXRhKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50O1xyXG5cdGxldCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblx0aWYgKGNvbXBvbmVudC5tb3VudGVkKSB7XHJcblx0XHRpZiAoIWVyciAmJiBkYXRhKSB7XHJcblx0XHRcdGRlbGV0ZSBkYXRhLmVtYmxlbTtcclxuXHRcdFx0ZGF0YS5sb2FkZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0Y29uc3QgZ3VpbGRJZCA9IGRhdGEuZ3VpbGRfaWQ7XHJcblx0XHRcdGNvbnN0IGd1aWxkRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG5cdFx0XHRjb21wb25lbnQuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuXHRcdFx0XHRndWlsZHM6IHN0YXRlLmd1aWxkcy5tZXJnZUluKFtndWlsZElkXSwgZ3VpbGREYXRhKVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0b25Db21wbGV0ZShudWxsKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBndWlsZHNQcm9jZXNzQ2xhaW1zKGd1aWxkcywgY2xhaW1FdmVudHMpIHtcclxuXHQvLyBjb25zb2xlLmxvZygnZ3VpbGRzUHJvY2Vzc0NsYWltcygpJywgZ3VpbGRzLnNpemUpO1xyXG5cclxuXHRyZXR1cm4gZ3VpbGRzLm1hcChcclxuXHRcdGd1aWxkQXR0YWNoQ2xhaW1zLmJpbmQobnVsbCwgY2xhaW1FdmVudHMpXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBndWlsZEF0dGFjaENsYWltcyhjbGFpbUV2ZW50cywgZ3VpbGQsIGd1aWxkSWQpIHtcclxuXHRjb25zdCBoYXNDbGFpbXMgPSAhZ3VpbGQuZ2V0KCdjbGFpbXMnKS5pc0VtcHR5KCk7XHJcblx0Y29uc3QgbmV3ZXN0Q2xhaW0gPSBoYXNDbGFpbXMgPyBndWlsZC5nZXQoJ2NsYWltcycpLmZpcnN0KCkgOiBudWxsO1xyXG5cclxuXHRjb25zdCBpbmNDbGFpbXMgPSBjbGFpbUV2ZW50c1xyXG5cdFx0LmZpbHRlcihlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykgPT09IGd1aWxkSWQpXHJcblx0XHQudG9NYXAoKTtcclxuXHJcblx0Y29uc3QgaW5jSGFzQ2xhaW1zID0gIWluY0NsYWltcy5pc0VtcHR5KCk7XHJcblx0Y29uc3QgaW5jTmV3ZXN0Q2xhaW0gPSBpbmNIYXNDbGFpbXMgPyBpbmNDbGFpbXMuZmlyc3QoKSA6IG51bGw7XHJcblxyXG5cclxuXHRjb25zdCBoYXNOZXdDbGFpbXMgPSAoIUltbXV0YWJsZS5pcyhuZXdlc3RDbGFpbSwgaW5jTmV3ZXN0Q2xhaW0pKTtcclxuXHJcblxyXG5cdGlmIChoYXNOZXdDbGFpbXMpIHtcclxuXHRcdGNvbnN0IGxhc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY05ld2VzdENsYWltLmdldCgndGltZXN0YW1wJykgOiAwO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2NsYWltcyBhbHRlcmVkJywgZ3VpbGRJZCwgaGFzTmV3Q2xhaW1zLCBsYXN0Q2xhaW0pO1xyXG5cdFx0Z3VpbGQgPSBndWlsZC5zZXQoJ2NsYWltcycsIGluY0NsYWltcyk7XHJcblx0XHRndWlsZCA9IGd1aWxkLnNldCgnbGFzdENsYWltJywgbGFzdENsYWltKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBndWlsZDtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplR3VpbGRzKGd1aWxkcywgbmV3R3VpbGRzKSB7XHJcblx0Ly8gY29uc29sZS5sb2coJ2luaXRpYWxpemVHdWlsZHMoKScpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCduZXdHdWlsZHMnLCBuZXdHdWlsZHMpO1xyXG5cclxuXHRuZXdHdWlsZHMuZm9yRWFjaChndWlsZElkID0+IHtcclxuXHRcdGlmICghZ3VpbGRzLmhhcyhndWlsZElkKSkge1xyXG5cdFx0XHRsZXQgZ3VpbGQgPSBndWlsZERlZmF1bHQuc2V0KCdndWlsZF9pZCcsIGd1aWxkSWQpO1xyXG5cdFx0XHRndWlsZHMgPSBndWlsZHMuc2V0KGd1aWxkSWQsIGd1aWxkKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIGd1aWxkcztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCBldmVudFR5cGUpIHtcclxuXHRyZXR1cm4gbWF0Y2hEZXRhaWxzXHJcblx0XHQuZ2V0KCdoaXN0b3J5JylcclxuXHRcdC5maWx0ZXIoZW50cnkgPT4gZW50cnkuZ2V0KCd0eXBlJykgPT09IGV2ZW50VHlwZSlcclxuXHRcdC5zb3J0QnkoZW50cnkgPT4gLWVudHJ5LmdldCgndGltZXN0YW1wJykpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFVua25vd25HdWlsZHMoc3RhdGVHdWlsZHMsIG9iamVjdGl2ZUNsYWltZXJzLCBjbGFpbUV2ZW50cykge1xyXG5cdGNvbnN0IGd1aWxkc1dpdGhDdXJyZW50Q2xhaW1zID0gb2JqZWN0aXZlQ2xhaW1lcnNcclxuXHRcdC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpKVxyXG5cdFx0LnRvU2V0KCk7XHJcblxyXG5cdGNvbnN0IGd1aWxkc1dpdGhQcmV2aW91c0NsYWltcyA9IGNsYWltRXZlbnRzXHJcblx0XHQubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSlcclxuXHRcdC50b1NldCgpO1xyXG5cclxuXHRjb25zdCBndWlsZENsYWltcyA9IGd1aWxkc1dpdGhDdXJyZW50Q2xhaW1zXHJcblx0XHQudW5pb24oZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zKTtcclxuXHJcblxyXG5cdGNvbnN0IGtub3duR3VpbGRzID0gc3RhdGVHdWlsZHNcclxuXHRcdC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZF9pZCcpKVxyXG5cdFx0LnRvU2V0KCk7XHJcblxyXG5cdGNvbnN0IHVua25vd25HdWlsZHMgPSBndWlsZENsYWltc1xyXG5cdFx0LnN1YnRyYWN0KGtub3duR3VpbGRzKTtcclxuXHJcblxyXG5cdC8vIGNvbnNvbGUubG9nKCdndWlsZENsYWltcycsIGd1aWxkQ2xhaW1zLnRvQXJyYXkoKSk7XHJcblx0Ly8gY29uc29sZS5sb2coJ2tub3duR3VpbGRzJywga25vd25HdWlsZHMudG9BcnJheSgpKTtcclxuXHQvLyBjb25zb2xlLmxvZygndW5rbm93bkd1aWxkcycsIHVua25vd25HdWlsZHMudG9BcnJheSgpKTtcclxuXHJcblx0cmV0dXJuIHVua25vd25HdWlsZHM7XHJcbn0iXX0=
