(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":90,"regenerator/runtime":91}],2:[function(require,module,exports){
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
},{"./$":23}],3:[function(require,module,exports){
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
},{"./$":23,"./$.ctx":11}],4:[function(require,module,exports){
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
},{"./$":23}],5:[function(require,module,exports){
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
},{"./$":23,"./$.enum-keys":14}],6:[function(require,module,exports){
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
},{"./$":23,"./$.wks":41}],7:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , $has     = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isExtensible = Object.isExtensible || isObject
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
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
  if(index !== 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      assert.inst(that, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
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
      if(index !== 'F')that[O1][index] = entry;
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
},{"./$":23,"./$.assert":4,"./$.ctx":11,"./$.for-of":15,"./$.iter":22,"./$.iter-define":20,"./$.mix":25,"./$.uid":39}],8:[function(require,module,exports){
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
},{"./$.def":12,"./$.for-of":15}],9:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.for-of')
  , $has      = $.has
  , isObject  = $.isObject
  , hide      = $.hide
  , isExtensible = Object.isExtensible || isObject
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
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      $.set(assert.inst(that, C, NAME), ID, id++);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":23,"./$.array-methods":3,"./$.assert":4,"./$.for-of":15,"./$.mix":25,"./$.uid":39}],10:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , BUGGY = require('./$.iter').BUGGY
  , forOf = require('./$.for-of')
  , species = require('./$.species')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  function fixMethod(KEY){
    var fn = proto[KEY];
    require('./$.redef')(proto, KEY,
      KEY == 'delete' ? function(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'has' ? function has(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'get' ? function get(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
      : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  }
  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = wrapper(function(target, iterable){
        assertInstance(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
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
    if(buggyZero || chain !== inst)fixMethod(ADDER);
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);
  species(C);
  species($.core[NAME]); // for wrapper

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":23,"./$.assert":4,"./$.cof":6,"./$.def":12,"./$.for-of":15,"./$.iter":22,"./$.iter-detect":21,"./$.mix":25,"./$.redef":28,"./$.species":33}],11:[function(require,module,exports){
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
},{"./$.assert":4}],12:[function(require,module,exports){
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
},{"./$":23,"./$.redef":28}],13:[function(require,module,exports){
var $        = require('./$')
  , document = $.g.document
  , isObject = $.isObject
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$":23}],14:[function(require,module,exports){
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
},{"./$":23}],15:[function(require,module,exports){
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
},{"./$.ctx":11,"./$.iter":22,"./$.iter-call":19}],16:[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],17:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var $ = require('./$')
  , toString = {}.toString
  , getNames = $.getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

function getWindowNames(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
}

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames($.toObject(it));
};
},{"./$":23}],18:[function(require,module,exports){
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
},{"./$.assert":4}],20:[function(require,module,exports){
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
  if($.FW || FORCE)$iter.set(proto, _default);
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
},{"./$":23,"./$.cof":6,"./$.def":12,"./$.iter":22,"./$.redef":28,"./$.wks":41}],21:[function(require,module,exports){
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
},{"./$.wks":41}],22:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , classof           = cof.classof
  , assert            = require('./$.assert')
  , assertObject      = assert.obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = require('./$.shared')('iterators')
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
      , Symbol = $.g.Symbol;
    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
      || SYMBOL_ITERATOR in O
      || $.has(Iterators, classof(O));
  },
  get: function(it){
    var Symbol = $.g.Symbol
      , getIter;
    if(it != undefined){
      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
        || it[SYMBOL_ITERATOR]
        || Iterators[classof(it)];
    }
    assert($.isFunction(getIter), it, ' is not iterable!');
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":23,"./$.assert":4,"./$.cof":6,"./$.shared":32,"./$.wks":41}],23:[function(require,module,exports){
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
},{"./$.fw":16}],24:[function(require,module,exports){
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
},{"./$":23,"./$.assert":4}],27:[function(require,module,exports){
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
},{"./$":23,"./$.assert":4,"./$.invoke":18}],28:[function(require,module,exports){
var $   = require('./$')
  , tpl = String({}.hasOwnProperty)
  , SRC = require('./$.uid').safe('src')
  , _toString = Function.toString;

function $redef(O, key, val, safe){
  if($.isFunction(val)){
    var base = O[key];
    $.hide(val, SRC, base ? String(base) : tpl.replace(/hasOwnProperty/, String(key)));
    if(!('name' in val))val.name = key;
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
},{"./$":23,"./$.uid":39}],29:[function(require,module,exports){
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
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],31:[function(require,module,exports){
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
},{"./$":23,"./$.assert":4,"./$.ctx":11}],32:[function(require,module,exports){
var $      = require('./$')
  , SHARED = '__core-js_shared__'
  , store  = $.g[SHARED] || ($.g[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$":23}],33:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":23,"./$.wks":41}],34:[function(require,module,exports){
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
},{"./$":23}],35:[function(require,module,exports){
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
},{"./$":23,"./$.string-repeat":36}],36:[function(require,module,exports){
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
},{"./$":23}],37:[function(require,module,exports){
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
  } else if(global.addEventListener && isFunction(global.postMessage) && !global.importScripts){
    defer = function(id){
      global.postMessage(id, '*');
    };
    global.addEventListener('message', listner, false);
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
},{"./$":23,"./$.cof":6,"./$.ctx":11,"./$.dom-create":13,"./$.invoke":18}],38:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],39:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":23}],40:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables');
if(!(UNSCOPABLES in []))require('./$').hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  [][UNSCOPABLES][key] = true;
};
},{"./$":23,"./$.wks":41}],41:[function(require,module,exports){
var global = require('./$').g
  , store  = require('./$.shared')('wks');
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":23,"./$.shared":32,"./$.uid":39}],42:[function(require,module,exports){
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
  , isObject         = $.isObject
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
  seal: function seal(it){
    return it; // <- cap
  },
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: function freeze(it){
    return it; // <- cap
  },
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: function preventExtensions(it){
    return it; // <- cap
  },
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: function isSealed(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: function isFrozen(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: function isExtensible(it){
    return isObject(it); // <- cap
  }
});

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = assert.fn(this)
      , partArgs = _slice.call(arguments, 1);
    function bound(/* args... */){
      var args   = partArgs.concat(_slice.call(arguments))
        , constr = this instanceof bound
        , ctx    = constr ? $.create(fn.prototype) : that
        , result = invoke(fn, args, ctx);
      return constr ? ctx : result;
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
},{"./$":23,"./$.array-includes":2,"./$.array-methods":3,"./$.assert":4,"./$.cof":6,"./$.def":12,"./$.dom-create":13,"./$.invoke":18,"./$.replacer":29,"./$.throws":38,"./$.uid":39}],43:[function(require,module,exports){
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
},{"./$":23,"./$.def":12,"./$.unscope":40}],44:[function(require,module,exports){
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
},{"./$":23,"./$.def":12,"./$.unscope":40}],45:[function(require,module,exports){
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
},{"./$.array-methods":3,"./$.def":12,"./$.unscope":40}],46:[function(require,module,exports){
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
},{"./$.array-methods":3,"./$.def":12,"./$.unscope":40}],47:[function(require,module,exports){
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
},{"./$":23,"./$.ctx":11,"./$.def":12,"./$.iter":22,"./$.iter-call":19,"./$.iter-detect":21}],48:[function(require,module,exports){
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
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.uid":39,"./$.unscope":40}],49:[function(require,module,exports){
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
},{"./$.def":12}],50:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":33}],51:[function(require,module,exports){
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
},{"./$":23,"./$.wks":41}],52:[function(require,module,exports){
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
},{"./$":23}],53:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
}, {
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
},{"./$.collection":10,"./$.collection-strong":7}],54:[function(require,module,exports){
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
      , i    = 0
      , len  = arguments.length
      , larg = 0
      , arg, div;
    while(i < len){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
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
},{"./$.def":12}],55:[function(require,module,exports){
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
},{"./$":23,"./$.redef":28}],56:[function(require,module,exports){
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
},{"./$":23,"./$.def":12}],57:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":5,"./$.def":12}],58:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: require('./$.same')
});
},{"./$.def":12,"./$.same":30}],59:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":12,"./$.set-proto":31}],60:[function(require,module,exports){
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
  } : require('./$.get-names').get;
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":23,"./$.def":12,"./$.get-names":17}],61:[function(require,module,exports){
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
},{"./$":23,"./$.cof":6,"./$.redef":28,"./$.wks":41}],62:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , setProto = require('./$.set-proto').set
  , same     = require('./$.same')
  , species  = require('./$.species')
  , SPECIES  = require('./$.wks')('species')
  , RECORD   = require('./$.uid').safe('record')
  , PROMISE  = 'Promise'
  , global   = $.g
  , process  = global.process
  , isNode   = cof(process) == 'process'
  , asap     = process && process.nextTick || require('./$.task').set
  , P        = global[PROMISE]
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , Wrapper;

function testResolve(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
}

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = isFunction(P) && isFunction(P.resolve) && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && $.DESC){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
function isPromise(it){
  return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
}
function sameConstructor(a, b){
  // library wrapper special case
  if(!$.FW && a === P && b === Wrapper)return true;
  return same(a, b);
}
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
  // strange IE + webpack dev server bug - use .call(global)
  if(chain.length)asap.call(global, function(){
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
    // strange IE + webpack dev server bug - use .call(global)
    asap.call(global, function(){
      if(isUnhandled(promise = record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(global.console && console.error){
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
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      // strange IE + webpack dev server bug - use .call(global)
      asap.call(global, function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
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
      if(record.s)notify(record);
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
species(Wrapper = $.core[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new (getConstructor(this))(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
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
},{"./$":23,"./$.assert":4,"./$.cof":6,"./$.ctx":11,"./$.def":12,"./$.for-of":15,"./$.iter-detect":21,"./$.mix":25,"./$.same":30,"./$.set-proto":31,"./$.species":33,"./$.task":37,"./$.uid":39,"./$.wks":41}],63:[function(require,module,exports){
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
  , _isExtensible = Object.isExtensible || isObject
  , _preventExtensions = Object.preventExtensions
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
      if(_preventExtensions)_preventExtensions(target);
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
},{"./$":23,"./$.assert":4,"./$.def":12,"./$.iter":22,"./$.own-keys":26,"./$.set-proto":31,"./$.uid":39,"./$.wks":41}],64:[function(require,module,exports){
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
},{"./$":23,"./$.cof":6,"./$.redef":28,"./$.replacer":29,"./$.species":33}],65:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":10,"./$.collection-strong":7}],66:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":12,"./$.string-at":34}],67:[function(require,module,exports){
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
},{"./$":23,"./$.cof":6,"./$.def":12,"./$.throws":38}],68:[function(require,module,exports){
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
},{"./$":23,"./$.def":12}],69:[function(require,module,exports){
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
},{"./$":23,"./$.cof":6,"./$.def":12}],70:[function(require,module,exports){
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
},{"./$":23,"./$.iter":22,"./$.iter-define":20,"./$.string-at":34,"./$.uid":39}],71:[function(require,module,exports){
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
},{"./$":23,"./$.def":12}],72:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":12,"./$.string-repeat":36}],73:[function(require,module,exports){
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
},{"./$":23,"./$.cof":6,"./$.def":12,"./$.throws":38}],74:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , shared   = require('./$.shared')
  , $def     = require('./$.def')
  , $redef   = require('./$.redef')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , ObjectProto = Object.prototype
  , DESC     = $.DESC
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , $names   = require('./$.get-names')
  , getNames = $names.get
  , toObject = $.toObject
  , $Symbol  = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , _propertyIsEnumerable = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols = shared('symbols')
  , useNative = $.isFunction($Symbol);

var setSymbolDesc = DESC ? function(){ // fallback for old Android
  try {
    return $create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
  DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, desc(1, value));
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
    } return setSymbolDesc(it, key, D);
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
  $.getNames   = $names.get = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;

  if($.DESC && $.FW)$redef(ObjectProto, 'propertyIsEnumerable', propertyIsEnumerable, true);
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
},{"./$":23,"./$.assert":4,"./$.cof":6,"./$.def":12,"./$.enum-keys":14,"./$.get-names":17,"./$.keyof":24,"./$.redef":28,"./$.shared":32,"./$.uid":39,"./$.wks":41}],75:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , weak      = require('./$.collection-weak')
  , leakStore = weak.leakStore
  , ID        = weak.ID
  , WEAK      = weak.WEAK
  , has       = $.has
  , isObject  = $.isObject
  , isExtensible = Object.isExtensible || isObject
  , tmp       = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments[0]); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    require('./$.redef')(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":23,"./$.collection":10,"./$.collection-weak":9,"./$.redef":28}],76:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments[0]); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":10,"./$.collection-weak":9}],77:[function(require,module,exports){
'use strict';
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":2,"./$.def":12,"./$.unscope":40}],78:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":8}],79:[function(require,module,exports){
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
},{"./$":23,"./$.def":12,"./$.own-keys":26}],80:[function(require,module,exports){
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
},{"./$":23,"./$.def":12}],81:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&', true)
});

},{"./$.def":12,"./$.replacer":29}],82:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":8}],83:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":12,"./$.string-at":34}],84:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  lpad: function lpad(n){
    return $pad(this, n, arguments[1], true);
  }
});
},{"./$.def":12,"./$.string-pad":35}],85:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  rpad: function rpad(n){
    return $pad(this, n, arguments[1], false);
  }
});
},{"./$.def":12,"./$.string-pad":35}],86:[function(require,module,exports){
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
},{"./$":23,"./$.ctx":11,"./$.def":12}],87:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NL          = $.g.NodeList
  , HTC         = $.g.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype;
if($.FW){
  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
}
Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;
},{"./$":23,"./$.iter":22,"./$.wks":41,"./es6.array.iterator":48}],88:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":12,"./$.task":37}],89:[function(require,module,exports){
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
},{"./$":23,"./$.def":12,"./$.invoke":18,"./$.partial":27}],90:[function(require,module,exports){
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

},{"./modules/$":23,"./modules/es5":42,"./modules/es6.array.copy-within":43,"./modules/es6.array.fill":44,"./modules/es6.array.find":46,"./modules/es6.array.find-index":45,"./modules/es6.array.from":47,"./modules/es6.array.iterator":48,"./modules/es6.array.of":49,"./modules/es6.array.species":50,"./modules/es6.function.has-instance":51,"./modules/es6.function.name":52,"./modules/es6.map":53,"./modules/es6.math":54,"./modules/es6.number.constructor":55,"./modules/es6.number.statics":56,"./modules/es6.object.assign":57,"./modules/es6.object.is":58,"./modules/es6.object.set-prototype-of":59,"./modules/es6.object.statics-accept-primitives":60,"./modules/es6.object.to-string":61,"./modules/es6.promise":62,"./modules/es6.reflect":63,"./modules/es6.regexp":64,"./modules/es6.set":65,"./modules/es6.string.code-point-at":66,"./modules/es6.string.ends-with":67,"./modules/es6.string.from-code-point":68,"./modules/es6.string.includes":69,"./modules/es6.string.iterator":70,"./modules/es6.string.raw":71,"./modules/es6.string.repeat":72,"./modules/es6.string.starts-with":73,"./modules/es6.symbol":74,"./modules/es6.weak-map":75,"./modules/es6.weak-set":76,"./modules/es7.array.includes":77,"./modules/es7.map.to-json":78,"./modules/es7.object.get-own-property-descriptors":79,"./modules/es7.object.to-array":80,"./modules/es7.regexp.escape":81,"./modules/es7.set.to-json":82,"./modules/es7.string.at":83,"./modules/es7.string.lpad":84,"./modules/es7.string.rpad":85,"./modules/js.array.statics":86,"./modules/web.dom.iterable":87,"./modules/web.immediate":88,"./modules/web.timers":89}],91:[function(require,module,exports){
(function (process,global){
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

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

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

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            result.value = unwrapped;
            return result;
          }, invokeThrow);
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(function() {
          return invoke(method, arg);
        }) : new Promise(function(resolve) {
          resolve(invoke(method, arg));
        });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator, and call generator.return() to
      // allow the generator a chance to clean up.
      previousPromise = enqueueResult["catch"](invokeReturn);

      return enqueueResult;
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
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

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

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

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":94}],92:[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":1}],93:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":92}],94:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":95,"./encode":96}],98:[function(require,module,exports){
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
	colors: 'https://api.guildwars2.com/v2/colors',								// http://wiki.guildwars2.com/wiki/API:1/colors
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
		params.ids = 'all';
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
	if (!params.ids) {
		params.ids = 'all';
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


},{"querystring":97,"superagent":99}],99:[function(require,module,exports){
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

},{"emitter":100,"reduce":101}],100:[function(require,module,exports){

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

},{}],101:[function(require,module,exports){

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
},{}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
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

},{}],106:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
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

},{}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":102,"./data/objective_labels":103,"./data/objective_map":104,"./data/objective_meta":105,"./data/objective_names":106,"./data/objective_types":107,"./data/world_names":108}],110:[function(require,module,exports){
(function (global){
'use strict';

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
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired
};

var Match = (function (_React$Component) {
    function Match() {
        _classCallCheck(this, Match);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Match, _React$Component);

    Match.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newScores = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
        var newMatch = !Immutable.is(this.props.match.get('startTime'), nextProps.match.get('startTime'));
        var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
        var shouldUpdate = newScores || newMatch || newWorlds;

        return shouldUpdate;
    };

    Match.prototype.render = function render() {
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
    };

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

},{"./MatchWorld":111}],111:[function(require,module,exports){
(function (global){
'use strict';

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
    showPie: React.PropTypes.bool.isRequired
};

var MatchWorld = (function (_React$Component) {
    function MatchWorld() {
        _classCallCheck(this, MatchWorld);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MatchWorld, _React$Component);

    MatchWorld.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newScores = !Immutable.is(this.props.scores, nextProps.scores);
        var newColor = !Immutable.is(this.props.color, nextProps.color);
        var newWorld = !Immutable.is(this.props.world, nextProps.world);
        var shouldUpdate = newScores || newColor || newWorld;

        // console.log('overview::MatchWorlds::shouldComponentUpdate()', shouldUpdate, newScores, newColor, newWorld);

        return shouldUpdate;
    };

    MatchWorld.prototype.render = function render() {
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
    };

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

},{"./../../common/Icons/Pie":145,"./Score":112}],112:[function(require,module,exports){
(function (global){
'use strict';

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
    score: React.PropTypes.number.isRequired
};

var defaultProps = {
    score: 0
};

var Score = (function (_React$Component) {
    function Score(props) {
        _classCallCheck(this, Score);

        _React$Component.call(this, props);
        this.state = {
            diff: 0,
            $diffNode: null
        };
    }

    _inherits(Score, _React$Component);

    Score.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.score !== nextProps.score;
    };

    Score.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var props = this.props;

        this.setState({ diff: nextProps.score - props.score });
    };

    Score.prototype.componentDidUpdate = function componentDidUpdate() {
        var state = this.state;

        if (state.diff !== 0) {
            animateScoreDiff(this.state.$diffNode);
        }
    };

    Score.prototype.componentDidMount = function componentDidMount() {
        // cache jQuery object to state
        this.setState({
            $diffNode: $('.diff', React.findDOMNode(this))
        });
    };

    Score.prototype.render = function render() {
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
    };

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

},{}],113:[function(require,module,exports){
(function (global){
'use strict';

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
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired
};

var Matches = (function (_React$Component) {
    function Matches() {
        _classCallCheck(this, Matches);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Matches, _React$Component);

    Matches.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newRegion = !Immutable.is(this.props.region, nextProps.region);
        var newMatches = !Immutable.is(this.props.matches, nextProps.matches);
        var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
        var shouldUpdate = newRegion || newMatches || newWorlds;

        // console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

        return shouldUpdate;
    };

    Matches.prototype.render = function render() {
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
    };

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

},{"./Match":110}],114:[function(require,module,exports){
(function (global){
'use strict';

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
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var World = (function (_React$Component) {
    function World() {
        _classCallCheck(this, World);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(World, _React$Component);

    World.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var newWorld = !Immutable.is(this.props.world, nextProps.world);
        var shouldUpdate = newLang || newWorld;

        return shouldUpdate;
    };

    World.prototype.render = function render() {
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
    };

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

},{}],115:[function(require,module,exports){
(function (global){
'use strict';

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
    worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired
};

var Worlds = (function (_React$Component) {
    function Worlds() {
        _classCallCheck(this, Worlds);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Worlds, _React$Component);

    Worlds.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.worlds, nextProps.worlds);
        var newRegion = !Immutable.is(this.props.region.get('worlds'), nextProps.region.get('worlds'));
        var shouldUpdate = newLang || newRegion;

        // console.log('overview::RegionWorlds::shouldComponentUpdate()', shouldUpdate, newLang, newRegion);

        return shouldUpdate;
    };

    Worlds.prototype.render = function render() {
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
    };

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

},{"./World":114}],116:[function(require,module,exports){
(function (global){
'use strict';

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
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var _ref = React.createElement('hr', null);

var Overview = (function (_React$Component) {

    /*
    *
    *     React Lifecycle
    *
    */

    function Overview(props) {
        _classCallCheck(this, Overview);

        _React$Component.call(this, props);

        this.dao = new DAO({
            onMatchData: this.onMatchData.bind(this)
        });

        this.state = {
            regions: Immutable.fromJS({
                1: { label: 'NA', id: '1' },
                2: { label: 'EU', id: '2' }
            }),
            matchesByRegion: Immutable.fromJS({ 1: {}, 2: {} }),
            worldsByRegion: this.dao.getWorldsByRegion(props.lang) };
    }

    _inherits(Overview, _React$Component);

    Overview.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var newMatchData = !Immutable.is(this.state.matchesByRegion, nextState.matchesByRegion);
        var shouldUpdate = newLang || newMatchData;

        // console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

        return shouldUpdate;
    };

    Overview.prototype.componentWillMount = function componentWillMount() {
        setPageTitle(this.props.lang);
        // setWorlds.call(this, this.props.lang);
    };

    Overview.prototype.componentDidMount = function componentDidMount() {
        this.dao.init(this.props.lang);
    };

    Overview.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!Immutable.is(nextProps.lang, this.props.lang)) {
            var worldsByRegion = this.dao.getWorldsByRegion(nextProps.lang);
            this.setState({ worldsByRegion: worldsByRegion });

            setPageTitle(nextProps.lang);
        }
    };

    Overview.prototype.componentWillUnmount = function componentWillUnmount() {
        this.dao.close();
    };

    Overview.prototype.render = function render() {
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
    };

    /*
    *
    *   Data Listeners
    *
    */

    Overview.prototype.onMatchData = function onMatchData(matchData) {
        var newMatchesByRegion = this.dao.getMatchesByRegion(matchData);

        this.setState(function (state) {
            return {
                matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion)
            };
        });
    };

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

},{"./../lib/data/overview":150,"./Matches":113,"./Worlds":115}],117:[function(require,module,exports){
(function (global){
'use strict';

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
    timer: false
};

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guild: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var GuildClaims = (function (_React$Component) {
    function GuildClaims() {
        _classCallCheck(this, GuildClaims);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(GuildClaims, _React$Component);

    GuildClaims.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var newClaims = !Immutable.is(this.props.guild.get('claims'), nextProps.guild.get('claims'));

        var shouldUpdate = newLang || newClaims;

        return shouldUpdate;
    };

    GuildClaims.prototype.render = function render() {
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
    };

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

},{"../Objectives":136}],118:[function(require,module,exports){
(function (global){
'use strict';

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
    guild: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var _ref = React.createElement('br', null);

var Guild = (function (_React$Component) {
    function Guild() {
        _classCallCheck(this, Guild);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Guild, _React$Component);

    Guild.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

        var shouldUpdate = newLang || newGuildData;

        return shouldUpdate;
    };

    Guild.prototype.render = function render() {
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
    };

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

},{"./../../common/Icons/Emblem":144,"./Claims":117}],119:[function(require,module,exports){
(function (global){
'use strict';

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
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

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

    Guilds.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var newGuildData = !Immutable.is(this.props.guilds, nextProps.guilds);

        var shouldUpdate = newLang || newGuildData;

        return shouldUpdate;
    };

    Guilds.prototype.render = function render() {
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
    };

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

},{"./Guild":118}],120:[function(require,module,exports){
(function (global){
'use strict';

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
    timer: false
};

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
    timer: false
};

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
    eventFilter: React.PropTypes.string.isRequired
};

var Entry = (function (_React$Component) {
    function Entry() {
        _classCallCheck(this, Entry);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Entry, _React$Component);

    Entry.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
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
    };

    Entry.prototype.render = function render() {
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
    };

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

},{"../Objectives":136,"gw2w2w-static":109}],121:[function(require,module,exports){
(function (global){
'use strict';

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
    setEvent: React.PropTypes.func.isRequired
};

var MapFilters = (function (_React$Component) {
    function MapFilters() {
        _classCallCheck(this, MapFilters);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapFilters, _React$Component);

    MapFilters.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.eventFilter !== nextProps.eventFilter;
    };

    MapFilters.prototype.render = function render() {
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
    };

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

},{}],122:[function(require,module,exports){
(function (global){
'use strict';

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
    guilds: {}
};

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    eventHistory: React.PropTypes.instanceOf(Immutable.List).isRequired,

    triggerNotification: React.PropTypes.bool.isRequired,
    mapFilter: React.PropTypes.string.isRequired,
    eventFilter: React.PropTypes.string.isRequired
};

var LogEntries = (function (_React$Component) {
    function LogEntries() {
        _classCallCheck(this, LogEntries);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(LogEntries, _React$Component);

    LogEntries.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
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
    };

    LogEntries.prototype.render = function render() {
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
    };

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

},{"./Entry":120}],123:[function(require,module,exports){
(function (global){
'use strict';

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
    setWorld: React.PropTypes.func.isRequired
};

var MapFilters = (function (_React$Component) {
    function MapFilters() {
        _classCallCheck(this, MapFilters);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapFilters, _React$Component);

    MapFilters.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.mapFilter !== nextProps.mapFilter;
    };

    MapFilters.prototype.render = function render() {
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
    };

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

},{"gw2w2w-static":109}],124:[function(require,module,exports){
(function (global){
'use strict';

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
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var Log = (function (_React$Component) {
    function Log(props) {
        _classCallCheck(this, Log);

        _React$Component.call(this, props);

        this.state = {
            mapFilter: 'all',
            eventFilter: 'all',
            triggerNotification: false
        };
    }

    _inherits(Log, _React$Component);

    Log.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
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
    };

    Log.prototype.componentDidMount = function componentDidMount() {
        this.setState({ triggerNotification: true });
    };

    Log.prototype.componentDidUpdate = function componentDidUpdate() {
        if (!this.state.triggerNotification) {
            this.setState({ triggerNotification: true });
        }
    };

    Log.prototype.render = function render() {

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
    };

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

},{"./EventFilters":121,"./LogEntries":122,"./MapFilters":123}],125:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var MapDetails = (function (_React$Component) {
    function MapDetails() {
        _classCallCheck(this, MapDetails);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapDetails, _React$Component);

    MapDetails.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);

        var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
        var newDetails = !Immutable.is(this.props.details, nextProps.details);
        var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        var newData = newGuilds || newDetails || newWorlds;

        var shouldUpdate = newLang || newData;

        // console.log('Tracker::Maps::MapDetails::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    };

    MapDetails.prototype.render = function render() {
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
    };

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

},{"./../../lib/static":154,"./MapScores":126,"./MapSection":127}],126:[function(require,module,exports){
(function (global){
'use strict';

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
    scores: React.PropTypes.instanceOf(Immutable.List).isRequired
};

var MapScores = (function (_React$Component) {
    function MapScores() {
        _classCallCheck(this, MapScores);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapScores, _React$Component);

    MapScores.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newScores = !Immutable.is(this.props.scores, nextProps.scores);
        var shouldUpdate = newScores;

        return shouldUpdate;
    };

    MapScores.prototype.render = function render() {
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
    };

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

},{}],127:[function(require,module,exports){
(function (global){
'use strict';

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
    timer: true
};

/*
*
* Component Definition
*
*/

var propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    mapSection: React.PropTypes.object.isRequired

};

var MapSection = (function (_React$Component) {
    function MapSection() {
        _classCallCheck(this, MapSection);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapSection, _React$Component);

    MapSection.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);

        var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
        var newDetails = !Immutable.is(this.props.details, nextProps.details);
        var newData = newGuilds || newDetails;

        var shouldUpdate = newLang || newData;

        // console.log('Tracker::Maps::MapSection::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    };

    MapSection.prototype.render = function render() {
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
    };

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

},{"./../Objectives":136}],128:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var Maps = (function (_React$Component) {
    function Maps() {
        _classCallCheck(this, Maps);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Maps, _React$Component);

    Maps.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);

        var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
        var newDetails = !Immutable.is(this.props.details, nextProps.details);
        var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        var newData = newGuilds || newDetails || newWorlds;

        var shouldUpdate = newLang || newData;

        return shouldUpdate;
    };

    Maps.prototype.render = function render() {
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
    };

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

},{"./../Log":124,"./MapDetails":125}],129:[function(require,module,exports){
(function (global){
'use strict';

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
    guild: React.PropTypes.instanceOf(Immutable.Map)
};

var _ref = React.createElement('i', { className: 'fa fa-spinner fa-spin' });

var Guild = (function (_React$Component) {
    function Guild() {
        _classCallCheck(this, Guild);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Guild, _React$Component);

    Guild.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newGuild = !Immutable.is(this.props.guildId, nextProps.guildId);
        var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
        var shouldUpdate = newGuild || newGuildData;

        return shouldUpdate;
    };

    Guild.prototype.render = function render() {
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
    };

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

},{"./../../common/Icons/Emblem":144}],130:[function(require,module,exports){
(function (global){
'use strict';

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
    color: React.PropTypes.string.isRequired
};

var Icons = (function (_React$Component) {
    function Icons() {
        _classCallCheck(this, Icons);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Icons, _React$Component);

    Icons.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newColor = !Immutable.is(this.props.color, nextProps.color);
        var shouldUpdate = newColor;

        return shouldUpdate;
    };

    Icons.prototype.render = function render() {
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
    };

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

},{"./../../common/Icons/Arrow":143,"./../../common/Icons/Sprite":146,"./../../lib/static":154}],131:[function(require,module,exports){
(function (global){
'use strict';

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
    objectiveId: React.PropTypes.string.isRequired
};

var Label = (function (_React$Component) {
    function Label() {
        _classCallCheck(this, Label);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Label, _React$Component);

    Label.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);
        var shouldUpdate = newLang;

        return shouldUpdate;
    };

    Label.prototype.render = function render() {
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
    };

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

},{"./../../lib/static":154}],132:[function(require,module,exports){
(function (global){
'use strict';

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
    objectiveId: React.PropTypes.string.isRequired
};

var MapName = (function (_React$Component) {
    function MapName() {
        _classCallCheck(this, MapName);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MapName, _React$Component);

    // map name can never change, not localized

    MapName.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return false;
    };

    MapName.prototype.render = function render() {
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
    };

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

},{"./../../lib/static":154}],133:[function(require,module,exports){
(function (global){
'use strict';

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
    timestamp: React.PropTypes.number.isRequired
};

var TimerCountdown = (function (_React$Component) {
    function TimerCountdown() {
        _classCallCheck(this, TimerCountdown);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(TimerCountdown, _React$Component);

    TimerCountdown.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newIsEnabled = !Immutable.is(this.props.isEnabled, nextProps.isEnabled);
        var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        var shouldUpdate = newIsEnabled || newTimestamp;

        return shouldUpdate;
    };

    TimerCountdown.prototype.render = function render() {
        if (!this.props.isEnabled) {
            return null;
        } else {
            return React.createElement('span', {
                className: 'timer countdown inactive',
                'data-timestamp': this.props.timestamp
            });
        }
    };

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

},{}],134:[function(require,module,exports){
(function (global){
'use strict';

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
    timestamp: React.PropTypes.number.isRequired
};

var TimerRelative = (function (_React$Component) {
    function TimerRelative() {
        _classCallCheck(this, TimerRelative);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(TimerRelative, _React$Component);

    TimerRelative.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        var shouldUpdate = newTimestamp;

        return shouldUpdate;
    };

    TimerRelative.prototype.render = function render() {
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
    };

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

},{}],135:[function(require,module,exports){
(function (global){
'use strict';

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
    timestamp: React.PropTypes.number.isRequired
};

var Timestamp = (function (_React$Component) {
    function Timestamp() {
        _classCallCheck(this, Timestamp);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Timestamp, _React$Component);

    Timestamp.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        var shouldUpdate = newTimestamp;

        return shouldUpdate;
    };

    Timestamp.prototype.render = function render() {
        if (!this.props.isEnabled) {
            return null;
        } else {
            return React.createElement(
                'div',
                { className: 'objective-timestamp' },
                moment(this.props.timestamp * 1000).format('hh:mm:ss')
            );
        }
    };

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

},{}],136:[function(require,module,exports){
(function (global){
'use strict';

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
    timer: false
};

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

    cols: React.PropTypes.object
};

var Objective = (function (_React$Component) {
    function Objective() {
        _classCallCheck(this, Objective);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Objective, _React$Component);

    Objective.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);

        var newCapture = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        var newOwner = !Immutable.is(this.props.worldColor, nextProps.worldColor);
        var newClaimer = !Immutable.is(this.props.guildId, nextProps.guildId);
        var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
        var newData = newCapture || newOwner || newClaimer || newGuildData;

        var shouldUpdate = newLang || newData;

        // console.log('Tracker::Objectives::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    };

    Objective.prototype.render = function render() {
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
    };

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

},{"./../../lib/static":154,"./Guild":129,"./Icons":130,"./Label":131,"./MapName":132,"./TimerCountdown":133,"./TimerRelative":134,"./Timestamp":135}],137:[function(require,module,exports){
(function (global){
'use strict';

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
    typeId: React.PropTypes.string.isRequired
};

var HoldingsItem = (function (_React$Component) {
    function HoldingsItem(props) {
        _classCallCheck(this, HoldingsItem);

        _React$Component.call(this, props);

        this.state = {
            oType: STATIC.objective_types.get(props.typeId)
        };
    }

    _inherits(HoldingsItem, _React$Component);

    HoldingsItem.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newQuantity = this.props.typeQuantity !== nextProps.typeQuantity;
        var newType = this.props.typeId !== nextProps.typeId;
        var newColor = this.props.color !== nextProps.color;
        var shouldUpdate = newQuantity || newType || newColor;

        return shouldUpdate;
    };

    HoldingsItem.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var newType = this.props.typeId !== nextProps.typeId;

        if (newType) {
            this.setState({ oType: STATIC.objective_types.get(this.props.typeId) });
        }
    };

    HoldingsItem.prototype.render = function render() {
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
    };

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

},{"./../../../common/Icons/Sprite":146,"./../../../lib/static":154}],138:[function(require,module,exports){
(function (global){
'use strict';

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
    holdings: React.PropTypes.instanceOf(Immutable.List).isRequired
};

var Holdings = (function (_React$Component) {
    function Holdings() {
        _classCallCheck(this, Holdings);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Holdings, _React$Component);

    Holdings.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newHoldings = !Immutable.is(this.props.holdings, nextProps.holdings);
        var shouldUpdate = newHoldings;

        return shouldUpdate;
    };

    Holdings.prototype.render = function render() {
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
    };

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

},{"./Item":137}],139:[function(require,module,exports){
(function (global){
'use strict';

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
    holdings: React.PropTypes.instanceOf(Immutable.List).isRequired
};

var World = (function (_React$Component) {
    function World() {
        _classCallCheck(this, World);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(World, _React$Component);

    World.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newWorld = !Immutable.is(this.props.world, nextProps.world);
        var newScore = this.props.score !== nextProps.score;
        var newTick = this.props.tick !== nextProps.tick;
        var newHoldings = this.props.holdings !== nextProps.holdings;
        var shouldUpdate = newWorld || newScore || newTick || newHoldings;

        return shouldUpdate;
    };

    World.prototype.render = function render() {
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
    };

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

},{"./Holdings":138}],140:[function(require,module,exports){
(function (global){
'use strict';

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
    match: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var Scoreboard = (function (_React$Component) {
    function Scoreboard() {
        _classCallCheck(this, Scoreboard);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Scoreboard, _React$Component);

    Scoreboard.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        var newScores = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
        var shouldUpdate = newWorlds || newScores;

        return shouldUpdate;
    };

    Scoreboard.prototype.render = function render() {
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
    };

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

},{"./World":139}],141:[function(require,module,exports){
(function (global){
'use strict';

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
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var Tracker = (function (_React$Component) {

    /*
    *
    *     React Lifecycle
    *
    */

    function Tracker(props) {
        _classCallCheck(this, Tracker);

        _React$Component.call(this, props);

        this.__mounted = false;
        this.__timeouts = {};
        this.__intervals = {};

        var dataListeners = {
            onMatchDetails: this.onMatchDetails.bind(this),
            onGuildDetails: this.onGuildDetails.bind(this)
        };
        this.dao = new DAO(dataListeners);

        this.state = {
            hasData: false,
            lastmod: 0,

            time: {
                local: libDate.dateNow(),
                remote: 0,
                offset: 0
            },

            match: Immutable.Map({ lastmod: 0 }),
            matchWorlds: Immutable.List(),
            details: Immutable.Map(),
            claimEvents: Immutable.List(),
            guilds: Immutable.Map()
        };
    }

    _inherits(Tracker, _React$Component);

    Tracker.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var newLang = !Immutable.is(this.props.lang, nextProps.lang);

        var initialData = !Immutable.is(this.state.hasData, nextState.hasData);
        var newMatchData = !Immutable.is(this.state.lastmod, nextState.lastmod);
        var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
        var newData = initialData || newMatchData || newGuildData;

        var shouldUpdate = newLang || newData;

        return shouldUpdate;
    };

    Tracker.prototype.componentDidMount = function componentDidMount() {
        // console.log('Tracker::componentDidMount()');
        this.__mounted = true;

        this.dao.init(this.props.lang, this.props.world);

        setPageTitle(this.props.lang, this.props.world);

        // this.updateTimers(() => setInterval(this.updateTimers.bind(this), 1000));
        this.updateTimers.call(this);
    };

    Tracker.prototype.componentWillUnmount = function componentWillUnmount() {
        // console.log('Tracker::componentWillUnmount()');

        this.__mounted = false;
        this.__timeouts = _.map(this.__timeouts, function (t) {
            return clearTimeout(t);
        });
        this.__intervals = _.map(this.__intervals, function (i) {
            return clearInterval(i);
        });

        this.dao.close();
    };

    Tracker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps()', newLang);
        setPageTitle(this.props.lang, this.props.world);

        this.setState({
            matchWorlds: this.dao.getMatchWorlds(nextProps.lang, this.state.match)
        });
    };

    // componentWillUpdate() {
    //  console.log('Tracker::componentWillUpdate()');
    // }

    Tracker.prototype.render = function render() {
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
    };

    /*
    *
    *   Data Listeners
    *
    */

    Tracker.prototype.updateTimers = function updateTimers() {
        var cb = arguments[0] === undefined ? _.noop : arguments[0];

        if (this.__mounted) {
            trackerTimers.update(this.state.time.offset, cb);
            this.__timeouts.updateTimers = setTimeout(this.updateTimers.bind(this), updateTimeInterval);
        }
    };

    Tracker.prototype.onMatchDetails = function onMatchDetails(timeRemote, matchData, detailsData) {
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
                    remote: timeRemote
                };

                // use transactional setState
                _this.setState(function (state) {
                    return {
                        hasData: true,

                        lastmod: lastmod,
                        time: time,
                        claimEvents: claimEvents,

                        match: state.match.mergeDeep(matchData),
                        details: state.details.mergeDeep(detailsData)
                    };
                });

                _this.dao.guilds.lookup(_this.state.guilds, detailsData, _this.onGuildDetails.bind(_this));

                if (_this.state.matchWorlds.isEmpty()) {
                    _this.setState({
                        matchWorlds: _this.dao.getMatchWorlds(_this.props.lang, _this.state.match)
                    });
                }
            })();
        }
    };

    Tracker.prototype.onGuildDetails = function onGuildDetails(guild, guildId) {
        var _guildId = guildId || guild.get('guild_id');
        if (!this.state.claimEvents.isEmpty()) {
            guild = this.dao.guilds.attachClaims(this.state.claimEvents, guild);
        }

        this.setState(function (state) {
            return {
                guilds: state.guilds.mergeIn([_guildId], guild)
            };
        });
    };

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

},{"./../lib/data/tracker":152,"./../lib/date":153,"./../lib/trackerTimers":155,"./Guilds":119,"./Maps":128,"./Scoreboard":140}],142:[function(require,module,exports){
(function (global){
'use strict';

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
        decodeURLComponents: true
    });
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

    App.prototype.componentDidMount = function componentDidMount() {
        console.log('App Started!');
    };

    App.prototype.render = function render() {
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
    };

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

},{"./Overview":116,"./Tracker":141,"./common/Langs":148,"./lib/static":154,"babel/polyfill":93}],143:[function(require,module,exports){
(function (global){
'use strict';

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
    oMeta: React.PropTypes.object.isRequired
};

var Arrow = (function (_React$Component) {
    function Arrow() {
        _classCallCheck(this, Arrow);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Arrow, _React$Component);

    Arrow.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newObjectiveMeta = !Immutable.is(this.props.oMeta, nextProps.oMeta);
        var shouldUpdate = newObjectiveMeta;

        return shouldUpdate;
    };

    Arrow.prototype.render = function render() {
        var imgSrc = getArrowSrc(this.props.oMeta);

        return React.createElement(
            'span',
            { className: 'direction' },
            imgSrc ? React.createElement('img', { src: imgSrc }) : null
        );
    };

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

},{}],144:[function(require,module,exports){
(function (global){
'use strict';

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
    guildName: React.PropTypes.string
};

var defaultProps = {
    size: 256,
    guildName: undefined
};

var Emblem = (function (_React$Component) {
    function Emblem() {
        _classCallCheck(this, Emblem);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Emblem, _React$Component);

    Emblem.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newName = this.props.guildName !== nextProps.guildName; // changes when defined
        var newSize = this.props.size !== nextProps.size;
        var shouldUpdate = newSize || newName;

        return shouldUpdate;
    };

    Emblem.prototype.render = function render() {
        var emblemSrc = getEmblemSrc(this.props.guildName);

        // console.log('emblem', this.props.guildName, emblemSrc);

        return React.createElement('img', {
            className: 'emblem',
            src: emblemSrc,
            width: this.props.size,
            height: this.props.size,
            onError: imgOnError
        });
    };

    return Emblem;
})(React.Component);

/*
 *
 * Private Methods
 *
 */

function getEmblemSrc(guildName) {
    return guildName ? 'http://guilds.gw2w2w.com/guilds/' + slugify(guildName) + '/256.svg' : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
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

},{}],145:[function(require,module,exports){
(function (global){
'use strict';

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
    stroke: 2
};

/*
 *
 * Component Definition
 *
 */

var propTypes = {
    scores: React.PropTypes.instanceOf(Immutable.List).isRequired
};

var Pie = (function (_React$Component) {
    function Pie() {
        _classCallCheck(this, Pie);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Pie, _React$Component);

    Pie.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return !Immutable.is(this.props.scores, nextProps.scores);
    };

    Pie.prototype.render = function render() {
        var props = this.props;

        // console.log('Pie::render', props.scores.toArray());

        return React.createElement('img', {
            width: INSTANCE.size,
            height: INSTANCE.size,
            src: getImageSource(props.scores.toArray())
        });
    };

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

},{}],146:[function(require,module,exports){
(function (global){
'use strict';

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
    color: React.PropTypes.string.isRequired
};

var Sprite = (function (_React$Component) {
    function Sprite() {
        _classCallCheck(this, Sprite);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Sprite, _React$Component);

    Sprite.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        var newType = this.props.type !== nextProps.type;
        var newColor = this.props.color !== nextProps.color;
        var shouldUpdate = newType || newColor;

        return shouldUpdate;
    };

    Sprite.prototype.render = function render() {
        return React.createElement('span', { className: 'sprite ' + this.props.type + ' ' + this.props.color });
    };

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

},{}],147:[function(require,module,exports){
(function (global){
'use strict';

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
    linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired
};

var LangLink = (function (_React$Component) {
    function LangLink() {
        _classCallCheck(this, LangLink);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(LangLink, _React$Component);

    LangLink.prototype.render = function render() {
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
    };

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

},{}],148:[function(require,module,exports){
(function (global){
'use strict';

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
    world: React.PropTypes.instanceOf(Immutable.Map)
};

var Langs = (function (_React$Component) {
    function Langs() {
        _classCallCheck(this, Langs);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Langs, _React$Component);

    Langs.prototype.render = function render() {
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
    };

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

},{"./../../lib/static":154,"./LangLink":147}],149:[function(require,module,exports){
'use strict';

var gw2api = require('gw2api');

module.exports = {
    getGuildDetails: getGuildDetails,
    getMatches: getMatches,
    getMatchDetailsByWorld: getMatchDetailsByWorld
};

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

},{"gw2api":98}],150:[function(require,module,exports){
(function (global){
'use strict';

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

    OverviewDataProvider.prototype.init = function init() {
        // console.log('lib::data::overview::init()');

        this.__mounted = true;
        this.__getData();
    };

    OverviewDataProvider.prototype.close = function close() {
        // console.log('lib::data::overview::close()');

        this.__mounted = false;

        this.__timeouts = _.map(this.__timeouts, function (t) {
            return clearTimeout(t);
        });
        this.__intervals = _.map(this.__intervals, function (i) {
            return clearInterval(i);
        });
    };

    OverviewDataProvider.prototype.getWorldsByRegion = function getWorldsByRegion(lang) {
        return Immutable.Seq(STATIC.worlds).map(function (world) {
            return getWorldByLang(lang, world);
        }).sortBy(function (world) {
            return world.get('name');
        }).groupBy(function (world) {
            return world.get('region');
        });
    };

    OverviewDataProvider.prototype.getMatchesByRegion = function getMatchesByRegion(matchData) {
        return Immutable.Seq(matchData).groupBy(function (match) {
            return match.get('region').toString();
        });
    };

    /*
    *
    *   Private Methods
    *
    */

    OverviewDataProvider.prototype.__getData = function __getData() {
        // console.log('lib::data::overview::__getData()');
        api.getMatches(this.__onMatchData.bind(this));
    };

    OverviewDataProvider.prototype.__setDataTimeout = function __setDataTimeout() {
        var interval = getInterval();
        // console.log('lib::data::overview::__setDataTimeout()', interval);

        this.__timeouts.matchData = setTimeout(this.__getData.bind(this), interval);
    };

    OverviewDataProvider.prototype.__onMatchData = function __onMatchData(err, data) {
        // console.log('lib::data::overview::__onMatchData()', data);

        if (!this.__mounted) {
            return;
        }

        var matchData = Immutable.fromJS(data);

        if (!err && matchData && !matchData.isEmpty()) {
            (this.__listeners.onMatchData || _.noop)(matchData);
        }

        this.__setDataTimeout();
    };

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
        region: region
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

},{"./../api":149,"./../static":154}],151:[function(require,module,exports){
(function (global){
'use strict';

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
    claims: Immutable.Map()
});

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

        this.__asyncGuildQueue = async.queue(getGuildDetails, 8);
    }

    LibGuilds.prototype.getGuildDefault = function getGuildDefault() {
        return guildDefault;
    };

    LibGuilds.prototype.getEventsByType = function getEventsByType(matchDetails, eventType) {
        return matchDetails.get('history').filter(function (entry) {
            return entry.get('type') === eventType;
        });
        // .sortBy(entry => -entry.get('timestamp'));
    };

    LibGuilds.prototype.getUnknownGuilds = function getUnknownGuilds(stateGuilds, matchDetails) {
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
    };

    LibGuilds.prototype.lookup = function lookup(knownGuilds, matchDetails, listener) {
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
    };

    LibGuilds.prototype.attachClaims = function attachClaims(claimEvents, guild) {
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
    };

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

},{"./../../api":149}],152:[function(require,module,exports){
(function (global){
'use strict';

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

    OverviewDataProvider.prototype.init = function init(lang, world) {
        // console.log('lib::data::tracker::init()');

        this.__langSlug = lang.get('slug');
        this.__worldSlug = world.getIn([this.__langSlug, 'slug']);

        this.__mounted = true;
        this.__getData();
    };

    OverviewDataProvider.prototype.close = function close() {
        // console.log('lib::data::tracker::close()');

        this.__mounted = false;

        this.__timeouts = _.map(this.__timeouts, function (t) {
            return clearTimeout(t);
        });
        this.__intervals = _.map(this.__intervals, function (i) {
            return clearInterval(i);
        });
    };

    OverviewDataProvider.prototype.getMatchWorlds = function getMatchWorlds(lang, match) {
        return Immutable.List(['red', 'blue', 'green']).map(getMatchWorld.bind(null, lang, match));
    };

    /*
    *
    *   Private Methods
    *
    */

    OverviewDataProvider.prototype.__getData = function __getData() {
        // console.log('lib::data::tracker::__getData()');

        api.getMatchDetailsByWorld(this.__worldSlug, this.__onMatchDetails.bind(this));
    };

    OverviewDataProvider.prototype.__onMatchDetails = function __onMatchDetails(err, data) {
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
    };

    OverviewDataProvider.prototype.__rescheduleDataUpdate = function __rescheduleDataUpdate() {
        var refreshTime = _.random(2000, 4000);

        this.__timeouts.data = setTimeout(this.__getData.bind(this), refreshTime);
    };

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

},{"./../../api":149,"./../../static":154,"./guilds":151}],153:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

module.exports = {
    dateNow: dateNow,
    add5: add5
};

function dateNow() {
    return Math.floor(_.now() / 1000);
}

function add5(inDate) {
    var _baseDate = inDate || dateNow();

    return _baseDate + 300;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],154:[function(require,module,exports){
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
    objective_map: Immutable.fromJS(statics.objective_map)
};

module.exports = immutableStatics;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":109}],155:[function(require,module,exports){
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
    var expires = timestamp + 300000;
    var msRemaining = expires - timeRemote;
    var msElapsed = 300000 - msRemaining;

    var isVisible = expires + 10000 >= timeRemote;
    var isExpired = expires < timeRemote;
    var isActive = !isExpired;
    var isHighlighted = msRemaining <= 10000;
    var isFresh = msElapsed <= 10000;

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

},{}]},{},[142])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24tdG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jdHguanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmludm9rZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQubWl4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5vd24ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQucGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQucmVkZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnJlcGxhY2VyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctcGFkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC50YXNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC50aHJvd3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnVpZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM1LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5oYXMtaW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLnN0YXRpY3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnNldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5mcm9tLWNvZGUtcG9pbnQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmF3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi53ZWFrLW1hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi53ZWFrLXNldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QudG8tYXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcuYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLmxwYWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnJwYWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9qcy5hcnJheS5zdGF0aWNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5pbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsL25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL3NoaW0uanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yL3J1bnRpbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvcG9seWZpbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwvcG9seWZpbGwuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL21haW4uanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZ3cyYXBpL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9jb21wb25lbnQtZW1pdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbm9kZV9tb2R1bGVzL3JlZHVjZS1jb21wb25lbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL2xhbmdzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbGFiZWxzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbWFwLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX25hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfdHlwZXMuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL3dvcmxkX25hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL01hdGNoLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaFdvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9TY29yZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9Xb3JsZHMvV29ybGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9Xb3JsZHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL0NsYWltcy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL0d1aWxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9HdWlsZHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FbnRyeS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL0V2ZW50RmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL0xvZ0VudHJpZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9NYXBGaWx0ZXJzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwRGV0YWlscy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9NYXBTY29yZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2VjdGlvbi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9JY29ucy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9MYWJlbC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9NYXBOYW1lLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVyQ291bnRkb3duLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVyUmVsYXRpdmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvVGltZXN0YW1wLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL0l0ZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvSG9sZGluZ3MvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvV29ybGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvYXBwLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL0Fycm93LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL0VtYmxlbS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9QaWUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvU3ByaXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0xhbmdzL0xhbmdMaW5rLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0xhbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2FwaS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRhL292ZXJ2aWV3LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2RhdGEvdHJhY2tlci9ndWlsZHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0YS90cmFja2VyL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2RhdGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvc3RhdGljLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3RyYWNrZXJUaW1lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdG5CQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNubUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEEsYUFBYTs7Ozs7Ozs7Ozs7O0FBU2IsSUFBTSxLQUFLLEdBQVEsT0FBTyxTQUFTLENBQUM7QUFDcEMsSUFBTSxTQUFTLEdBQUksT0FBTyxhQUFhLENBQUM7Ozs7OztBQU94QyxJQUFNLFVBQVUsR0FBRyxPQUFPLGdCQUFnQixDQUFDOzs7Ozs7OztBQVkzQyxJQUFNLFNBQVMsR0FBRztBQUNkLFNBQUssRUFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVTtBQUM1RCxVQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVU7Q0FDL0QsQ0FBQzs7SUFFSSxLQUFLO2FBQUwsS0FBSzs4QkFB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c0JBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEMsTUFBTSxJQUFJLENBQUMsT0FBTyxJQUFJLGFBQWEsRUFBRTtBQUNsQyxzQkFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQzs7QUFFRCxXQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUNkLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FDbkIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUNsQixXQUFXLENBQUMsVUFBVSxDQUFDLENBQ3ZCLEdBQUcsRUFBRSxDQUFDO0tBRWQsTUFBTTtBQUNILFdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQ2hCLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FDcEIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUNyQixXQUFXLENBQUMsV0FBVyxDQUFDLENBQ3hCLEdBQUcsRUFBRSxDQUFDO0tBQ2Q7O0FBRUQsUUFBSSxFQUFFLENBQUM7Q0FDVjs7QUFLRCxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUMsTUFBTSxFQUFOLE1BQU0sRUFBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKFwiY29yZS1qcy9zaGltXCIpO1xuXG5yZXF1aXJlKFwicmVnZW5lcmF0b3IvcnVudGltZVwiKTtcblxuaWYgKGdsb2JhbC5fYmFiZWxQb2x5ZmlsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJvbmx5IG9uZSBpbnN0YW5jZSBvZiBiYWJlbC9wb2x5ZmlsbCBpcyBhbGxvd2VkXCIpO1xufVxuZ2xvYmFsLl9iYWJlbFBvbHlmaWxsID0gdHJ1ZTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAkLnRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciAkICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCA9IHJlcXVpcmUoJy4vJC5jdHgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQoJHRoaXMpKVxuICAgICAgLCBzZWxmICAgPSAkLkVTNU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBBcnJheShsZW5ndGgpIDogSVNfRklMVEVSID8gW10gOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnMSwgbXNnMil7XG4gIGlmKCFjb25kaXRpb24pdGhyb3cgVHlwZUVycm9yKG1zZzIgPyBtc2cxICsgbXNnMiA6IG1zZzEpO1xufVxuYXNzZXJ0LmRlZiA9ICQuYXNzZXJ0RGVmaW5lZDtcbmFzc2VydC5mbiA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoISQuaXNGdW5jdGlvbihpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbmFzc2VydC5vYmogPSBmdW5jdGlvbihpdCl7XG4gIGlmKCEkLmlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG5hc3NlcnQuaW5zdCA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2VydDsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2Upe1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICB2YXIgVCA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGFyZ2V0KSlcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpID0gMTtcbiAgd2hpbGUobCA+IGkpe1xuICAgIHZhciBTICAgICAgPSAkLkVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcbiAgICAgICwga2V5cyAgID0gZW51bUtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailUW2tleSA9IGtleXNbaisrXV0gPSBTW2tleV07XG4gIH1cbiAgcmV0dXJuIFQ7XG59OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgVEFHICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLCB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuZnVuY3Rpb24gY29mKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn1cbmNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVDtcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFQgOiBjb2YoTyk7XG59O1xuY29mLnNldCA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhJC5oYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpJC5oaWRlKGl0LCBUQUcsIHRhZyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBjb2Y7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIHNhZmUgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcbiAgLCBhc3NlcnQgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGZvck9mICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc3RlcCAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpLnN0ZXBcbiAgLCAkaGFzICAgICA9ICQuaGFzXG4gICwgc2V0ICAgICAgPSAkLnNldFxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAsIGhpZGUgICAgID0gJC5oaWRlXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIElEICAgICAgID0gc2FmZSgnaWQnKVxuICAsIE8xICAgICAgID0gc2FmZSgnTzEnKVxuICAsIExBU1QgICAgID0gc2FmZSgnbGFzdCcpXG4gICwgRklSU1QgICAgPSBzYWZlKCdmaXJzdCcpXG4gICwgSVRFUiAgICAgPSBzYWZlKCdpdGVyJylcbiAgLCBTSVpFICAgICA9ICQuREVTQyA/IHNhZmUoJ3NpemUnKSA6ICdzaXplJ1xuICAsIGlkICAgICAgID0gMDtcblxuZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCEkaGFzKGl0LCBJRCkpe1xuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XG4gIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xufVxuXG5mdW5jdGlvbiBnZXRFbnRyeSh0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhc3NlcnQuaW5zdCh0aGF0LCBDLCBOQU1FKTtcbiAgICAgIHNldCh0aGF0LCBPMSwgJC5jcmVhdGUobnVsbCkpO1xuICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xuICAgICAgc2V0KHRoYXQsIExBU1QsIHVuZGVmaW5lZCk7XG4gICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdFtPMV1bZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gYXNzZXJ0LmRlZih0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0W0xBU1RdLCAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0W08xXVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gIHNldEl0ZXI6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazoga2luZH0pO1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgICAgICwga2luZCAgPSBpdGVyLmtcbiAgICAgICAgLCBlbnRyeSA9IGl0ZXIubDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIWl0ZXIubyB8fCAhKGl0ZXIubCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogaXRlci5vW0ZJUlNUXSkpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICAkZGVmKCRkZWYuUCwgTkFNRSwge1xuICAgIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgICB2YXIgYXJyID0gW107XG4gICAgICBmb3JPZih0aGlzLCBmYWxzZSwgYXJyLnB1c2gsIGFycik7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNhZmUgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgJGhhcyAgICAgID0gJC5oYXNcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XG4gICwgaGlkZSAgICAgID0gJC5oaWRlXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIGlkICAgICAgICA9IDBcbiAgLCBJRCAgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgV0VBSyAgICAgID0gc2FmZSgnd2VhaycpXG4gICwgTEVBSyAgICAgID0gc2FmZSgnbGVhaycpXG4gICwgbWV0aG9kICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsIGZpbmQgICAgICA9IG1ldGhvZCg1KVxuICAsIGZpbmRJbmRleCA9IG1ldGhvZCg2KTtcbmZ1bmN0aW9uIGZpbmRGcm96ZW4oc3RvcmUsIGtleSl7XG4gIHJldHVybiBmaW5kKHN0b3JlLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufVxuLy8gZmFsbGJhY2sgZm9yIGZyb3plbiBrZXlzXG5mdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XG4gIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGUodGhhdCwgTEVBSywge1xuICAgIGFycmF5OiBbXSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgICBpZihlbnRyeSlyZXR1cm4gZW50cnlbMV07XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XG4gICAgICByZXR1cm4gISFmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgdmFyIGVudHJ5ID0gZmluZEZyb3plbih0aGlzLCBrZXkpO1xuICAgICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcbiAgICAgIGVsc2UgdGhpcy5hcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgfSxcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCh0aGlzLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgICBpZih+aW5kZXgpdGhpcy5hcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcmV0dXJuICEhfmluZGV4O1xuICAgIH1cbiAgfSlbTEVBS107XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgICQuc2V0KGFzc2VydC5pbnN0KHRoYXQsIEMsIE5BTUUpLCBJRCwgaWQrKyk7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCFpc0V4dGVuc2libGUoa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpWydkZWxldGUnXShrZXkpO1xuICAgICAgICByZXR1cm4gJGhhcyhrZXksIFdFQUspICYmICRoYXMoa2V5W1dFQUtdLCB0aGlzW0lEXSkgJiYgZGVsZXRlIGtleVtXRUFLXVt0aGlzW0lEXV07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIWlzRXh0ZW5zaWJsZShrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuaGFzKGtleSk7XG4gICAgICAgIHJldHVybiAkaGFzKGtleSwgV0VBSykgJiYgJGhhcyhrZXlbV0VBS10sIHRoaXNbSURdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICBpZighaXNFeHRlbnNpYmxlKGFzc2VydC5vYmooa2V5KSkpe1xuICAgICAgbGVha1N0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGhhcyhrZXksIFdFQUspIHx8IGhpZGUoa2V5LCBXRUFLLCB7fSk7XG4gICAgICBrZXlbV0VBS11bdGhhdFtJRF1dID0gdmFsdWU7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgbGVha1N0b3JlOiBsZWFrU3RvcmUsXG4gIFdFQUs6IFdFQUssXG4gIElEOiBJRFxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgQlVHR1kgPSByZXF1aXJlKCcuLyQuaXRlcicpLkJVR0dZXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzcGVjaWVzID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxuICAsIGFzc2VydEluc3RhbmNlID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmluc3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSAkLmdbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGZ1bmN0aW9uIGZpeE1ldGhvZChLRVkpe1xuICAgIHZhciBmbiA9IHByb3RvW0tFWV07XG4gICAgcmVxdWlyZSgnLi8kLnJlZGVmJykocHJvdG8sIEtFWSxcbiAgICAgIEtFWSA9PSAnZGVsZXRlJyA/IGZ1bmN0aW9uKGEpeyByZXR1cm4gZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyB9XG4gICAgICA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhhKXsgcmV0dXJuIGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTsgfVxuICAgICAgOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSl7IHJldHVybiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7IH1cbiAgICAgIDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7IHJldHVybiB0aGlzOyB9XG4gICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKXsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpOyByZXR1cm4gdGhpczsgfVxuICAgICk7XG4gIH1cbiAgaWYoISQuaXNGdW5jdGlvbihDKSB8fCAhKElTX1dFQUsgfHwgIUJVR0dZICYmIHByb3RvLmZvckVhY2ggJiYgcHJvdG8uZW50cmllcykpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZXF1aXJlKCcuLyQubWl4JykoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0ICA9IG5ldyBDXG4gICAgICAsIGNoYWluID0gaW5zdFtBRERFUl0oSVNfV0VBSyA/IHt9IDogLTAsIDEpXG4gICAgICAsIGJ1Z2d5WmVybztcbiAgICAvLyB3cmFwIGZvciBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcbiAgICBpZighcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IG5ldyBDKGl0ZXIpOyB9KSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgICAgdmFyIHRoYXQgPSBuZXcgQmFzZTtcbiAgICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICB9KTtcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XG4gICAgICBwcm90by5jb25zdHJ1Y3RvciA9IEM7XG4gICAgfVxuICAgIElTX1dFQUsgfHwgaW5zdC5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwga2V5KXtcbiAgICAgIGJ1Z2d5WmVybyA9IDEgLyBrZXkgPT09IC1JbmZpbml0eTtcbiAgICB9KTtcbiAgICAvLyBmaXggY29udmVydGluZyAtMCBrZXkgdG8gKzBcbiAgICBpZihidWdneVplcm8pe1xuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcbiAgICB9XG4gICAgLy8gKyBmaXggLmFkZCAmIC5zZXQgZm9yIGNoYWluaW5nXG4gICAgaWYoYnVnZ3laZXJvIHx8IGNoYWluICE9PSBpbnN0KWZpeE1ldGhvZChBRERFUik7XG4gIH1cblxuICByZXF1aXJlKCcuLyQuY29mJykuc2V0KEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqIChDICE9IEJhc2UpLCBPKTtcbiAgc3BlY2llcyhDKTtcbiAgc3BlY2llcygkLmNvcmVbTkFNRV0pOyAvLyBmb3Igd3JhcHBlclxuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRJdGVyKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsIi8vIE9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9IHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICAgIH07XG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgID0gJC5nXG4gICwgY29yZSAgICAgICA9ICQuY29yZVxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb25cbiAgLCAkcmVkZWYgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJyk7XG5mdW5jdGlvbiBjdHgoZm4sIHRoYXQpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXG4kZGVmLkcgPSAyOyAgLy8gZ2xvYmFsXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cbiRkZWYuQiA9IDE2OyAvLyBiaW5kXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxuZnVuY3Rpb24gJGRlZih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwXG4gICAgLCBpc0dsb2JhbCA9IHR5cGUgJiAkZGVmLkdcbiAgICAsIGlzUHJvdG8gID0gdHlwZSAmICRkZWYuUFxuICAgICwgdGFyZ2V0ICAgPSBpc0dsb2JhbCA/IGdsb2JhbCA6IHR5cGUgJiAkZGVmLlNcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KS5wcm90b3R5cGVcbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcbiAgICBlbHNlIGV4cCA9IGlzUHJvdG8gJiYgaXNGdW5jdGlvbihvdXQpID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmKHRhcmdldCAmJiAhb3duKSRyZWRlZih0YXJnZXQsIGtleSwgb3V0KTtcbiAgICAvLyBleHBvcnRcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KSQuaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYoaXNQcm90bykoZXhwb3J0cy5wcm90b3R5cGUgfHwgKGV4cG9ydHMucHJvdG90eXBlID0ge30pKVtrZXldID0gb3V0O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBkb2N1bWVudCA9ICQuZy5kb2N1bWVudFxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXRLZXlzKGl0KVxuICAgICwgZ2V0RGVzYyAgICA9ICQuZ2V0RGVzY1xuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcbiAgaWYoZ2V0U3ltYm9scykkLmVhY2guY2FsbChnZXRTeW1ib2xzKGl0KSwgZnVuY3Rpb24oa2V5KXtcbiAgICBpZihnZXREZXNjKGl0LCBrZXkpLmVudW1lcmFibGUpa2V5cy5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4ga2V5cztcbn07IiwidmFyIGN0eCAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBnZXQgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5nZXRcbiAgLCBjYWxsID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xuICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpXG4gICAgLCBmICAgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgc3RlcDtcbiAgd2hpbGUoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKXtcbiAgICBpZihjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKSA9PT0gZmFsc2Upe1xuICAgICAgcmV0dXJuIGNhbGwuY2xvc2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCQpe1xuICAkLkZXICAgPSB0cnVlO1xuICAkLnBhdGggPSAkLmc7XG4gIHJldHVybiAkO1xufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XHJcbnZhciAkID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmdcclxuICAsIGdldE5hbWVzID0gJC5nZXROYW1lcztcclxuXHJcbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcclxuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcclxuXHJcbmZ1bmN0aW9uIGdldFdpbmRvd05hbWVzKGl0KXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGdldE5hbWVzKGl0KTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcclxuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xyXG4gIHJldHVybiBnZXROYW1lcygkLnRvT2JqZWN0KGl0KSk7XHJcbn07IiwiLy8gRmFzdCBhcHBseVxuLy8gaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICAgIGNhc2UgNTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwidmFyIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmo7XG5mdW5jdGlvbiBjbG9zZShpdGVyYXRvcil7XG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFzc2VydE9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xufVxuZnVuY3Rpb24gY2FsbChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFzc2VydE9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgfSBjYXRjaChlKXtcbiAgICBjbG9zZShpdGVyYXRvcik7XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuY2FsbC5jbG9zZSA9IGNsb3NlO1xubW9kdWxlLmV4cG9ydHMgPSBjYWxsOyIsInZhciAkZGVmICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcmVkZWYgICAgICAgICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKVxuICAsICQgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGl0ZXIgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEZGX0lURVJBVE9SICAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgICA9ICd2YWx1ZXMnXG4gICwgSXRlcmF0b3JzICAgICAgID0gJGl0ZXIuSXRlcmF0b3JzO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XG4gICRpdGVyLmNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIGZ1bmN0aW9uIGNyZWF0ZU1ldGhvZChraW5kKXtcbiAgICBmdW5jdGlvbiAkJCh0aGF0KXtcbiAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhhdCwga2luZCk7XG4gICAgfVxuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICB9XG4gIHZhciBUQUcgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgcHJvdG8gICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgX25hdGl2ZSAgPSBwcm90b1tTWU1CT0xfSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCBfZGVmYXVsdCA9IF9uYXRpdmUgfHwgY3JlYXRlTWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoX25hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gJC5nZXRQcm90byhfZGVmYXVsdC5jYWxsKG5ldyBCYXNlKSk7XG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgIGNvZi5zZXQoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgLy8gRkYgZml4XG4gICAgaWYoJC5GVyAmJiAkLmhhcyhwcm90bywgRkZfSVRFUkFUT1IpKSRpdGVyLnNldChJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoJC5GVyB8fCBGT1JDRSkkaXRlci5zZXQocHJvdG8sIF9kZWZhdWx0KTtcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSBfZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gJC50aGF0O1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChLRVlTKSxcbiAgICAgIHZhbHVlczogIERFRkFVTFQgPT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoVkFMVUVTKSxcbiAgICAgIGVudHJpZXM6IERFRkFVTFQgIT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoJ2VudHJpZXMnKVxuICAgIH07XG4gICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkcmVkZWYocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAkaXRlci5CVUdHWSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbn07IiwidmFyIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyAgICA9IGZhbHNlO1xudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICBpZighU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbU1lNQk9MX0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIGNsYXNzb2YgICAgICAgICAgID0gY29mLmNsYXNzb2ZcbiAgLCBhc3NlcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGFzc2VydE9iamVjdCAgICAgID0gYXNzZXJ0Lm9ialxuICAsIFNZTUJPTF9JVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgRkZfSVRFUkFUT1IgICAgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBJdGVyYXRvcnMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5zaGFyZWQnKSgnaXRlcmF0b3JzJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnNldEl0ZXJhdG9yKEl0ZXJhdG9yUHJvdG90eXBlLCAkLnRoYXQpO1xuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xuICAkLmhpZGUoTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XG4gIC8vIEFkZCBpdGVyYXRvciBmb3IgRkYgaXRlcmF0b3IgcHJvdG9jb2xcbiAgaWYoRkZfSVRFUkFUT1IgaW4gW10pJC5oaWRlKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gIEJVR0dZOiAna2V5cycgaW4gW10gJiYgISgnbmV4dCcgaW4gW10ua2V5cygpKSxcbiAgSXRlcmF0b3JzOiBJdGVyYXRvcnMsXG4gIHN0ZXA6IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbiAgfSxcbiAgaXM6IGZ1bmN0aW9uKGl0KXtcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxuICAgICAgLCBTeW1ib2wgPSAkLmcuU3ltYm9sO1xuICAgIHJldHVybiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUikgaW4gT1xuICAgICAgfHwgU1lNQk9MX0lURVJBVE9SIGluIE9cbiAgICAgIHx8ICQuaGFzKEl0ZXJhdG9ycywgY2xhc3NvZihPKSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oaXQpe1xuICAgIHZhciBTeW1ib2wgPSAkLmcuU3ltYm9sXG4gICAgICAsIGdldEl0ZXI7XG4gICAgaWYoaXQgIT0gdW5kZWZpbmVkKXtcbiAgICAgIGdldEl0ZXIgPSBpdFtTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SXVxuICAgICAgICB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdXG4gICAgICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG4gICAgfVxuICAgIGFzc2VydCgkLmlzRnVuY3Rpb24oZ2V0SXRlciksIGl0LCAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgICByZXR1cm4gYXNzZXJ0T2JqZWN0KGdldEl0ZXIuY2FsbChpdCkpO1xuICB9LFxuICBzZXQ6IHNldEl0ZXJhdG9yLFxuICBjcmVhdGU6IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0LCBwcm90byl7XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUocHJvdG8gfHwgSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiAkLmRlc2MoMSwgbmV4dCl9KTtcbiAgICBjb2Yuc2V0KENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpXG4gICwgY29yZSAgID0ge31cbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAsIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHlcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIG1heCAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICA9IE1hdGgubWluO1xuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDI7IH19KS5hID09IDI7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcbnZhciBoaWRlID0gY3JlYXRlRGVmaW5lcigxKTtcbi8vIDcuMS40IFRvSW50ZWdlclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59XG5mdW5jdGlvbiBkZXNjKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn1cbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufVxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgZGVzYyhiaXRtYXAsIHZhbHVlKSk7XG4gIH0gOiBzaW1wbGVTZXQ7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGl0KXtcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFzc2VydERlZmluZWQoaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59XG5cbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XG4gIGc6IGdsb2JhbCxcbiAgY29yZTogY29yZSxcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29yZS1qcy1pc29iamVjdFxuICBpc09iamVjdDogICBpc09iamVjdCxcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgdGhhdDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXG4gIHRvSW50ZWdlcjogdG9JbnRlZ2VyLFxuICAvLyA3LjEuMTUgVG9MZW5ndGhcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxuICB9LFxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oaXQsIGtleSl7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG4gIH0sXG4gIGNyZWF0ZTogICAgIE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgREVTQzogICAgICAgREVTQyxcbiAgZGVzYzogICAgICAgZGVzYyxcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxuICBFUzVPYmplY3Q6IE9iamVjdCxcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xuICB9LFxuICBoaWRlOiBoaWRlLFxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXG4gIHNldDogZ2xvYmFsLlN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGUsXG4gIGVhY2g6IFtdLmZvckVhY2hcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmlmKHR5cGVvZiBfX2UgIT0gJ3VuZGVmaW5lZCcpX19lID0gY29yZTtcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsInZhciAkcmVkZWYgPSByZXF1aXJlKCcuLyQucmVkZWYnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XHJcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSRyZWRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3duS2V5cyhpdCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXROYW1lcyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBfICAgICAgPSAkLnBhdGguX1xuICAgICwgaG9sZGVyID0gZmFsc2U7XG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaiA9IDAsIGsgPSAwLCBhcmdzO1xuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGo7IGorKylpZihhcmdzW2pdID09PSBfKWFyZ3Nbal0gPSBhcmd1bWVudHNbaysrXTtcbiAgICB3aGlsZShfbGVuZ3RoID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xufTsiLCJ2YXIgJCAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHRwbCA9IFN0cmluZyh7fS5oYXNPd25Qcm9wZXJ0eSlcclxuICAsIFNSQyA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdzcmMnKVxyXG4gICwgX3RvU3RyaW5nID0gRnVuY3Rpb24udG9TdHJpbmc7XHJcblxyXG5mdW5jdGlvbiAkcmVkZWYoTywga2V5LCB2YWwsIHNhZmUpe1xyXG4gIGlmKCQuaXNGdW5jdGlvbih2YWwpKXtcclxuICAgIHZhciBiYXNlID0gT1trZXldO1xyXG4gICAgJC5oaWRlKHZhbCwgU1JDLCBiYXNlID8gU3RyaW5nKGJhc2UpIDogdHBsLnJlcGxhY2UoL2hhc093blByb3BlcnR5LywgU3RyaW5nKGtleSkpKTtcclxuICAgIGlmKCEoJ25hbWUnIGluIHZhbCkpdmFsLm5hbWUgPSBrZXk7XHJcbiAgfVxyXG4gIGlmKE8gPT09ICQuZyl7XHJcbiAgICBPW2tleV0gPSB2YWw7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFzYWZlKWRlbGV0ZSBPW2tleV07XHJcbiAgICAkLmhpZGUoTywga2V5LCB2YWwpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnNcclxuLy8gd2l0aCBtZXRob2RzIHNpbWlsYXIgdG8gTG9EYXNoIGlzTmF0aXZlXHJcbiRyZWRlZihGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XHJcbiAgcmV0dXJuICQuaGFzKHRoaXMsIFNSQykgPyB0aGlzW1NSQ10gOiBfdG9TdHJpbmcuY2FsbCh0aGlzKTtcclxufSk7XHJcblxyXG4kLmNvcmUuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gX3RvU3RyaW5nLmNhbGwoaXQpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAkcmVkZWY7IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZWdFeHAsIHJlcGxhY2UsIGlzU3RhdGljKXtcbiAgdmFyIHJlcGxhY2VyID0gcmVwbGFjZSA9PT0gT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XG4gICAgcmV0dXJuIHJlcGxhY2VbcGFydF07XG4gIH0gOiByZXBsYWNlO1xuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBTdHJpbmcoaXNTdGF0aWMgPyBpdCA6IHRoaXMpLnJlcGxhY2UocmVnRXhwLCByZXBsYWNlcik7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpe1xyXG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xyXG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGFzc2VydCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKTtcbmZ1bmN0aW9uIGNoZWNrKE8sIHByb3RvKXtcbiAgYXNzZXJ0Lm9iaihPKTtcbiAgYXNzZXJ0KHByb3RvID09PSBudWxsIHx8ICQuaXNPYmplY3QocHJvdG8pLCBwcm90bywgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgPyBmdW5jdGlvbihidWdneSwgc2V0KXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgJC5nZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICAgIHNldCh7fSwgW10pO1xuICAgICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgICAgcmV0dXJuIE87XG4gICAgICAgIH07XG4gICAgICB9KClcbiAgICA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCJ2YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXHJcbiAgLCBzdG9yZSAgPSAkLmdbU0hBUkVEXSB8fCAoJC5nW1NIQVJFRF0gPSB7fSk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcclxufTsiLCJ2YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDKXtcbiAgaWYoJC5ERVNDICYmICEoU1BFQ0lFUyBpbiBDKSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICQudGhhdFxuICB9KTtcbn07IiwiLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9ICQudG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGxcbiAgICAgIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwiLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9c3RyYXdtYW46c3RyaW5nX3BhZGRpbmdcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHJlcGVhdCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcmVwZWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgbWluTGVuZ3RoLCBmaWxsQ2hhciwgbGVmdCl7XG4gIC8vIDEuIExldCBPIGJlIENoZWNrT2JqZWN0Q29lcmNpYmxlKHRoaXMgdmFsdWUpLlxuICAvLyAyLiBMZXQgUyBiZSBUb1N0cmluZyhPKS5cbiAgdmFyIFMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoYXQpKTtcbiAgLy8gNC4gSWYgaW50TWluTGVuZ3RoIGlzIHVuZGVmaW5lZCwgcmV0dXJuIFMuXG4gIGlmKG1pbkxlbmd0aCA9PT0gdW5kZWZpbmVkKXJldHVybiBTO1xuICAvLyA0LiBMZXQgaW50TWluTGVuZ3RoIGJlIFRvSW50ZWdlcihtaW5MZW5ndGgpLlxuICB2YXIgaW50TWluTGVuZ3RoID0gJC50b0ludGVnZXIobWluTGVuZ3RoKTtcbiAgLy8gNS4gTGV0IGZpbGxMZW4gYmUgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIFMgbWludXMgaW50TWluTGVuZ3RoLlxuICB2YXIgZmlsbExlbiA9IGludE1pbkxlbmd0aCAtIFMubGVuZ3RoO1xuICAvLyA2LiBJZiBmaWxsTGVuIDwgMCwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAvLyA3LiBJZiBmaWxsTGVuIGlzICviiJ4sIHRoZW4gdGhyb3cgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbi5cbiAgaWYoZmlsbExlbiA8IDAgfHwgZmlsbExlbiA9PT0gSW5maW5pdHkpe1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDYW5ub3Qgc2F0aXNmeSBzdHJpbmcgbGVuZ3RoICcgKyBtaW5MZW5ndGggKyAnIGZvciBzdHJpbmc6ICcgKyBTKTtcbiAgfVxuICAvLyA4LiBMZXQgc0ZpbGxTdHIgYmUgdGhlIHN0cmluZyByZXByZXNlbnRlZCBieSBmaWxsU3RyLlxuICAvLyA5LiBJZiBzRmlsbFN0ciBpcyB1bmRlZmluZWQsIGxldCBzRmlsbFN0ciBiZSBhIHNwYWNlIGNoYXJhY3Rlci5cbiAgdmFyIHNGaWxsU3RyID0gZmlsbENoYXIgPT09IHVuZGVmaW5lZCA/ICcgJyA6IFN0cmluZyhmaWxsQ2hhcik7XG4gIC8vIDEwLiBMZXQgc0ZpbGxWYWwgYmUgYSBTdHJpbmcgbWFkZSBvZiBzRmlsbFN0ciwgcmVwZWF0ZWQgdW50aWwgZmlsbExlbiBpcyBtZXQuXG4gIHZhciBzRmlsbFZhbCA9IHJlcGVhdC5jYWxsKHNGaWxsU3RyLCBNYXRoLmNlaWwoZmlsbExlbiAvIHNGaWxsU3RyLmxlbmd0aCkpO1xuICAvLyB0cnVuY2F0ZSBpZiB3ZSBvdmVyZmxvd2VkXG4gIGlmKHNGaWxsVmFsLmxlbmd0aCA+IGZpbGxMZW4pc0ZpbGxWYWwgPSBsZWZ0XG4gICAgPyBzRmlsbFZhbC5zbGljZShzRmlsbFZhbC5sZW5ndGggLSBmaWxsTGVuKVxuICAgIDogc0ZpbGxWYWwuc2xpY2UoMCwgZmlsbExlbik7XG4gIC8vIDExLiBSZXR1cm4gYSBzdHJpbmcgbWFkZSBmcm9tIHNGaWxsVmFsLCBmb2xsb3dlZCBieSBTLlxuICAvLyAxMS4gUmV0dXJuIGEgU3RyaW5nIG1hZGUgZnJvbSBTLCBmb2xsb3dlZCBieSBzRmlsbFZhbC5cbiAgcmV0dXJuIGxlZnQgPyBzRmlsbFZhbC5jb25jYXQoUykgOiBTLmNvbmNhdChzRmlsbFZhbCk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwZWF0KGNvdW50KXtcbiAgdmFyIHN0ciA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgLCByZXMgPSAnJ1xuICAgICwgbiAgID0gJC50b0ludGVnZXIoY291bnQpO1xuICBpZihuIDwgMCB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcbiAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcbiAgcmV0dXJuIHJlcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY29mICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgY2VsICAgID0gcmVxdWlyZSgnLi8kLmRvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9ICQuZ1xuICAsIGlzRnVuY3Rpb24gICAgICAgICA9ICQuaXNGdW5jdGlvblxuICAsIGh0bWwgICAgICAgICAgICAgICA9ICQuaHRtbFxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG5mdW5jdGlvbiBydW4oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKCQuaGFzKHF1ZXVlLCBpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGxpc3RuZXIoZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn1cbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFpc0Z1bmN0aW9uKHNldFRhc2spIHx8ICFpc0Z1bmN0aW9uKGNsZWFyVGFzaykpe1xuICBzZXRUYXNrID0gZnVuY3Rpb24oZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UoaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24oaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihjb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBNb2Rlcm4gYnJvd3NlcnMsIHNraXAgaW1wbGVtZW50YXRpb24gZm9yIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgb2JqZWN0XG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKGdsb2JhbC5wb3N0TWVzc2FnZSkgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCwgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xuICAvLyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBzaWQgPSAwO1xuZnVuY3Rpb24gdWlkKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK3NpZCArIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KSk7XG59XG51aWQuc2FmZSA9IHJlcXVpcmUoJy4vJCcpLmcuU3ltYm9sIHx8IHVpZDtcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndW5zY29wYWJsZXMnKTtcbmlmKCEoVU5TQ09QQUJMRVMgaW4gW10pKXJlcXVpcmUoJy4vJCcpLmhpZGUoQXJyYXkucHJvdG90eXBlLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICBbXVtVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLyQnKS5nXG4gICwgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIGdsb2JhbC5TeW1ib2wgJiYgZ2xvYmFsLlN5bWJvbFtuYW1lXSB8fCByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciAkICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjZWwgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRvbS1jcmVhdGUnKVxuICAsIGNvZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgaW52b2tlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIGFycmF5TWV0aG9kICAgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXG4gICwgSUVfUFJPVE8gICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdfX3Byb3RvX18nKVxuICAsIGFzc2VydCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBhc3NlcnRPYmplY3QgICAgID0gYXNzZXJ0Lm9ialxuICAsIE9iamVjdFByb3RvICAgICAgPSBPYmplY3QucHJvdG90eXBlXG4gICwgaHRtbCAgICAgICAgICAgICA9ICQuaHRtbFxuICAsIEEgICAgICAgICAgICAgICAgPSBbXVxuICAsIF9zbGljZSAgICAgICAgICAgPSBBLnNsaWNlXG4gICwgX2pvaW4gICAgICAgICAgICA9IEEuam9pblxuICAsIGNsYXNzb2YgICAgICAgICAgPSBjb2YuY2xhc3NvZlxuICAsIGhhcyAgICAgICAgICAgICAgPSAkLmhhc1xuICAsIGRlZmluZVByb3BlcnR5ICAgPSAkLnNldERlc2NcbiAgLCBnZXRPd25EZXNjcmlwdG9yID0gJC5nZXREZXNjXG4gICwgZGVmaW5lUHJvcGVydGllcyA9ICQuc2V0RGVzY3NcbiAgLCBpc0Z1bmN0aW9uICAgICAgID0gJC5pc0Z1bmN0aW9uXG4gICwgaXNPYmplY3QgICAgICAgICA9ICQuaXNPYmplY3RcbiAgLCB0b09iamVjdCAgICAgICAgID0gJC50b09iamVjdFxuICAsIHRvTGVuZ3RoICAgICAgICAgPSAkLnRvTGVuZ3RoXG4gICwgdG9JbmRleCAgICAgICAgICA9ICQudG9JbmRleFxuICAsIElFOF9ET01fREVGSU5FICAgPSBmYWxzZVxuICAsICRpbmRleE9mICAgICAgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCAkZm9yRWFjaCAgICAgICAgID0gYXJyYXlNZXRob2QoMClcbiAgLCAkbWFwICAgICAgICAgICAgID0gYXJyYXlNZXRob2QoMSlcbiAgLCAkZmlsdGVyICAgICAgICAgID0gYXJyYXlNZXRob2QoMilcbiAgLCAkc29tZSAgICAgICAgICAgID0gYXJyYXlNZXRob2QoMylcbiAgLCAkZXZlcnkgICAgICAgICAgID0gYXJyYXlNZXRob2QoNCk7XG5cbmlmKCEkLkRFU0Mpe1xuICB0cnkge1xuICAgIElFOF9ET01fREVGSU5FID0gZGVmaW5lUHJvcGVydHkoY2VsKCdkaXYnKSwgJ3gnLFxuICAgICAge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDg7IH19XG4gICAgKS54ID09IDg7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgJC5zZXREZXNjID0gZnVuY3Rpb24oTywgUCwgQXR0cmlidXRlcyl7XG4gICAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gICAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gICAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKWFzc2VydE9iamVjdChPKVtQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gICAgcmV0dXJuIE87XG4gIH07XG4gICQuZ2V0RGVzYyA9IGZ1bmN0aW9uKE8sIFApe1xuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgICByZXR1cm4gZ2V0T3duRGVzY3JpcHRvcihPLCBQKTtcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gICAgaWYoaGFzKE8sIFApKXJldHVybiAkLmRlc2MoIU9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoTywgUCksIE9bUF0pO1xuICB9O1xuICAkLnNldERlc2NzID0gZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKE8sIFByb3BlcnRpZXMpe1xuICAgIGFzc2VydE9iamVjdChPKTtcbiAgICB2YXIga2V5cyAgID0gJC5nZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGkgPSAwXG4gICAgICAsIFA7XG4gICAgd2hpbGUobGVuZ3RoID4gaSkkLnNldERlc2MoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gICAgcmV0dXJuIE87XG4gIH07XG59XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICEkLkRFU0MsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi42IC8gMTUuMi4zLjMgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICQuZ2V0RGVzYyxcbiAgLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICQuc2V0RGVzYyxcbiAgLy8gMTkuMS4yLjMgLyAxNS4yLjMuNyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzXG59KTtcblxuICAvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG52YXIga2V5czEgPSAoJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsJyArXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZicpLnNwbGl0KCcsJylcbiAgLy8gQWRkaXRpb25hbCBrZXlzIGZvciBnZXRPd25Qcm9wZXJ0eU5hbWVzXG4gICwga2V5czIgPSBrZXlzMS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKVxuICAsIGtleXNMZW4xID0ga2V5czEubGVuZ3RoO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gY2VsKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0ga2V5c0xlbjFcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKCc8c2NyaXB0PmRvY3VtZW50LkY9T2JqZWN0PC9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0LnByb3RvdHlwZVtrZXlzMVtpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuZnVuY3Rpb24gY3JlYXRlR2V0S2V5cyhuYW1lcywgbGVuZ3RoKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcbiAgICAgICwgaSAgICAgID0gMFxuICAgICAgLCByZXN1bHQgPSBbXVxuICAgICAgLCBrZXk7XG4gICAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAgIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgICB+JGluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBFbXB0eSgpe31cbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxuICBnZXRQcm90b3R5cGVPZjogJC5nZXRQcm90byA9ICQuZ2V0UHJvdG8gfHwgZnVuY3Rpb24oTyl7XG4gICAgTyA9IE9iamVjdChhc3NlcnQuZGVmKE8pKTtcbiAgICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgICBpZihpc0Z1bmN0aW9uKE8uY29uc3RydWN0b3IpICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xuICB9LFxuICAvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICQuZ2V0TmFtZXMgPSAkLmdldE5hbWVzIHx8IGNyZWF0ZUdldEtleXMoa2V5czIsIGtleXMyLmxlbmd0aCwgdHJ1ZSksXG4gIC8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICQuY3JlYXRlID0gJC5jcmVhdGUgfHwgZnVuY3Rpb24oTywgLyo/Ki9Qcm9wZXJ0aWVzKXtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmKE8gIT09IG51bGwpe1xuICAgICAgRW1wdHkucHJvdG90eXBlID0gYXNzZXJ0T2JqZWN0KE8pO1xuICAgICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBzaGltXG4gICAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICAgIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwgUHJvcGVydGllcyk7XG4gIH0sXG4gIC8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxuICBrZXlzOiAkLmdldEtleXMgPSAkLmdldEtleXMgfHwgY3JlYXRlR2V0S2V5cyhrZXlzMSwga2V5c0xlbjEsIGZhbHNlKSxcbiAgLy8gMTkuMS4yLjE3IC8gMTUuMi4zLjggT2JqZWN0LnNlYWwoTylcbiAgc2VhbDogZnVuY3Rpb24gc2VhbChpdCl7XG4gICAgcmV0dXJuIGl0OyAvLyA8LSBjYXBcbiAgfSxcbiAgLy8gMTkuMS4yLjUgLyAxNS4yLjMuOSBPYmplY3QuZnJlZXplKE8pXG4gIGZyZWV6ZTogZnVuY3Rpb24gZnJlZXplKGl0KXtcbiAgICByZXR1cm4gaXQ7IC8vIDwtIGNhcFxuICB9LFxuICAvLyAxOS4xLjIuMTUgLyAxNS4yLjMuMTAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKE8pXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyhpdCl7XG4gICAgcmV0dXJuIGl0OyAvLyA8LSBjYXBcbiAgfSxcbiAgLy8gMTkuMS4yLjEzIC8gMTUuMi4zLjExIE9iamVjdC5pc1NlYWxlZChPKVxuICBpc1NlYWxlZDogZnVuY3Rpb24gaXNTZWFsZWQoaXQpe1xuICAgIHJldHVybiAhaXNPYmplY3QoaXQpOyAvLyA8LSBjYXBcbiAgfSxcbiAgLy8gMTkuMS4yLjEyIC8gMTUuMi4zLjEyIE9iamVjdC5pc0Zyb3plbihPKVxuICBpc0Zyb3plbjogZnVuY3Rpb24gaXNGcm96ZW4oaXQpe1xuICAgIHJldHVybiAhaXNPYmplY3QoaXQpOyAvLyA8LSBjYXBcbiAgfSxcbiAgLy8gMTkuMS4yLjExIC8gMTUuMi4zLjEzIE9iamVjdC5pc0V4dGVuc2libGUoTylcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCk7IC8vIDwtIGNhcFxuICB9XG59KTtcblxuLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxuJGRlZigkZGVmLlAsICdGdW5jdGlvbicsIHtcbiAgYmluZDogZnVuY3Rpb24odGhhdCAvKiwgYXJncy4uLiAqLyl7XG4gICAgdmFyIGZuICAgICAgID0gYXNzZXJ0LmZuKHRoaXMpXG4gICAgICAsIHBhcnRBcmdzID0gX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKXtcbiAgICAgIHZhciBhcmdzICAgPSBwYXJ0QXJncy5jb25jYXQoX3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgLCBjb25zdHIgPSB0aGlzIGluc3RhbmNlb2YgYm91bmRcbiAgICAgICAgLCBjdHggICAgPSBjb25zdHIgPyAkLmNyZWF0ZShmbi5wcm90b3R5cGUpIDogdGhhdFxuICAgICAgICAsIHJlc3VsdCA9IGludm9rZShmbiwgYXJncywgY3R4KTtcbiAgICAgIHJldHVybiBjb25zdHIgPyBjdHggOiByZXN1bHQ7XG4gICAgfVxuICAgIGlmKGZuLnByb3RvdHlwZSlib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9XG59KTtcblxuLy8gRml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGFuZCBET00gb2JqZWN0c1xuaWYoISgwIGluIE9iamVjdCgneicpICYmICd6J1swXSA9PSAneicpKXtcbiAgJC5FUzVPYmplY3QgPSBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xuICB9O1xufVxuXG52YXIgYnVnZ3lTbGljZSA9IHRydWU7XG50cnkge1xuICBpZihodG1sKV9zbGljZS5jYWxsKGh0bWwpO1xuICBidWdneVNsaWNlID0gZmFsc2U7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbiRkZWYoJGRlZi5QICsgJGRlZi5GICogYnVnZ3lTbGljZSwgJ0FycmF5Jywge1xuICBzbGljZTogZnVuY3Rpb24gc2xpY2UoYmVnaW4sIGVuZCl7XG4gICAgdmFyIGxlbiAgID0gdG9MZW5ndGgodGhpcy5sZW5ndGgpXG4gICAgICAsIGtsYXNzID0gY29mKHRoaXMpO1xuICAgIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogZW5kO1xuICAgIGlmKGtsYXNzID09ICdBcnJheScpcmV0dXJuIF9zbGljZS5jYWxsKHRoaXMsIGJlZ2luLCBlbmQpO1xuICAgIHZhciBzdGFydCAgPSB0b0luZGV4KGJlZ2luLCBsZW4pXG4gICAgICAsIHVwVG8gICA9IHRvSW5kZXgoZW5kLCBsZW4pXG4gICAgICAsIHNpemUgICA9IHRvTGVuZ3RoKHVwVG8gLSBzdGFydClcbiAgICAgICwgY2xvbmVkID0gQXJyYXkoc2l6ZSlcbiAgICAgICwgaSAgICAgID0gMDtcbiAgICBmb3IoOyBpIDwgc2l6ZTsgaSsrKWNsb25lZFtpXSA9IGtsYXNzID09ICdTdHJpbmcnXG4gICAgICA/IHRoaXMuY2hhckF0KHN0YXJ0ICsgaSlcbiAgICAgIDogdGhpc1tzdGFydCArIGldO1xuICAgIHJldHVybiBjbG9uZWQ7XG4gIH1cbn0pO1xuXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICgkLkVTNU9iamVjdCAhPSBPYmplY3QpLCAnQXJyYXknLCB7XG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oKXtcbiAgICByZXR1cm4gX2pvaW4uYXBwbHkoJC5FUzVPYmplY3QodGhpcyksIGFyZ3VtZW50cyk7XG4gIH1cbn0pO1xuXG4vLyAyMi4xLjIuMiAvIDE1LjQuMy4yIEFycmF5LmlzQXJyYXkoYXJnKVxuJGRlZigkZGVmLlMsICdBcnJheScsIHtcbiAgaXNBcnJheTogZnVuY3Rpb24oYXJnKXtcbiAgICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5JztcbiAgfVxufSk7XG5mdW5jdGlvbiBjcmVhdGVBcnJheVJlZHVjZShpc1JpZ2h0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4sIG1lbW8pe1xuICAgIGFzc2VydC5mbihjYWxsYmFja2ZuKTtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IGlzUmlnaHQgPyBsZW5ndGggLSAxIDogMFxuICAgICAgLCBpICAgICAgPSBpc1JpZ2h0ID8gLTEgOiAxO1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAyKWZvcig7Oyl7XG4gICAgICBpZihpbmRleCBpbiBPKXtcbiAgICAgICAgbWVtbyA9IE9baW5kZXhdO1xuICAgICAgICBpbmRleCArPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ICs9IGk7XG4gICAgICBhc3NlcnQoaXNSaWdodCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleCwgJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICB9XG4gICAgZm9yKDtpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKWlmKGluZGV4IGluIE8pe1xuICAgICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgT1tpbmRleF0sIGluZGV4LCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59XG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTAgLyAxNS40LjQuMTggQXJyYXkucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZm9yRWFjaDogJC5lYWNoID0gJC5lYWNoIHx8IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjE1IC8gMTUuNC40LjE5IEFycmF5LnByb3RvdHlwZS5tYXAoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJG1hcCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuNyAvIDE1LjQuNC4yMCBBcnJheS5wcm90b3R5cGUuZmlsdGVyKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaWx0ZXIodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjIzIC8gMTUuNC40LjE3IEFycmF5LnByb3RvdHlwZS5zb21lKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIHNvbWU6IGZ1bmN0aW9uIHNvbWUoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJHNvbWUodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjUgLyAxNS40LjQuMTYgQXJyYXkucHJvdG90eXBlLmV2ZXJ5KGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZXZlcnkodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjE4IC8gMTUuNC40LjIxIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UoY2FsbGJhY2tmbiBbLCBpbml0aWFsVmFsdWVdKVxuICByZWR1Y2U6IGNyZWF0ZUFycmF5UmVkdWNlKGZhbHNlKSxcbiAgLy8gMjIuMS4zLjE5IC8gMTUuNC40LjIyIEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodChjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXG4gIHJlZHVjZVJpZ2h0OiBjcmVhdGVBcnJheVJlZHVjZSh0cnVlKSxcbiAgLy8gMjIuMS4zLjExIC8gMTUuNC40LjE0IEFycmF5LnByb3RvdHlwZS5pbmRleE9mKHNlYXJjaEVsZW1lbnQgWywgZnJvbUluZGV4XSlcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XG4gICAgcmV0dXJuICRpbmRleE9mKHRoaXMsIGVsLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMTQgLyAxNS40LjQuMTUgQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mKHNlYXJjaEVsZW1lbnQgWywgZnJvbUluZGV4XSlcbiAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKGVsLCBmcm9tSW5kZXggLyogPSBAWyotMV0gKi8pe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gbGVuZ3RoIC0gMTtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID4gMSlpbmRleCA9IE1hdGgubWluKGluZGV4LCAkLnRvSW50ZWdlcihmcm9tSW5kZXgpKTtcbiAgICBpZihpbmRleCA8IDApaW5kZXggPSB0b0xlbmd0aChsZW5ndGggKyBpbmRleCk7XG4gICAgZm9yKDtpbmRleCA+PSAwOyBpbmRleC0tKWlmKGluZGV4IGluIE8paWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpbmRleDtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn0pO1xuXG4vLyAyMS4xLjMuMjUgLyAxNS41LjQuMjAgU3RyaW5nLnByb3RvdHlwZS50cmltKClcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge3RyaW06IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eXFxzKihbXFxzXFxTXSpcXFMpP1xccyokLywgJyQxJyl9KTtcblxuLy8gMjAuMy4zLjEgLyAxNS45LjQuNCBEYXRlLm5vdygpXG4kZGVmKCRkZWYuUywgJ0RhdGUnLCB7bm93OiBmdW5jdGlvbigpe1xuICByZXR1cm4gK25ldyBEYXRlO1xufX0pO1xuXG5mdW5jdGlvbiBseihudW0pe1xuICByZXR1cm4gbnVtID4gOSA/IG51bSA6ICcwJyArIG51bTtcbn1cblxuLy8gMjAuMy40LjM2IC8gMTUuOS41LjQzIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKClcbi8vIFBoYW50b21KUyBhbmQgb2xkIHdlYmtpdCBoYWQgYSBicm9rZW4gRGF0ZSBpbXBsZW1lbnRhdGlvbi5cbnZhciBkYXRlICAgICAgID0gbmV3IERhdGUoLTVlMTMgLSAxKVxuICAsIGJyb2tlbkRhdGUgPSAhKGRhdGUudG9JU09TdHJpbmcgJiYgZGF0ZS50b0lTT1N0cmluZygpID09ICcwMzg1LTA3LTI1VDA3OjA2OjM5Ljk5OVonXG4gICAgICAmJiByZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgbmV3IERhdGUoTmFOKS50b0lTT1N0cmluZygpOyB9KSk7XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqIGJyb2tlbkRhdGUsICdEYXRlJywge3RvSVNPU3RyaW5nOiBmdW5jdGlvbigpe1xuICBpZighaXNGaW5pdGUodGhpcykpdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCB0aW1lIHZhbHVlJyk7XG4gIHZhciBkID0gdGhpc1xuICAgICwgeSA9IGQuZ2V0VVRDRnVsbFllYXIoKVxuICAgICwgbSA9IGQuZ2V0VVRDTWlsbGlzZWNvbmRzKClcbiAgICAsIHMgPSB5IDwgMCA/ICctJyA6IHkgPiA5OTk5ID8gJysnIDogJyc7XG4gIHJldHVybiBzICsgKCcwMDAwMCcgKyBNYXRoLmFicyh5KSkuc2xpY2UocyA/IC02IDogLTQpICtcbiAgICAnLScgKyBseihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIGx6KGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgbHooZC5nZXRVVENIb3VycygpKSArICc6JyArIGx6KGQuZ2V0VVRDTWludXRlcygpKSArXG4gICAgJzonICsgbHooZC5nZXRVVENTZWNvbmRzKCkpICsgJy4nICsgKG0gPiA5OSA/IG0gOiAnMCcgKyBseihtKSkgKyAnWic7XG59fSk7XG5cbmlmKGNsYXNzb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnT2JqZWN0Jyljb2YuY2xhc3NvZiA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRhZyA9IGNsYXNzb2YoaXQpO1xuICByZXR1cm4gdGFnID09ICdPYmplY3QnICYmIGlzRnVuY3Rpb24oaXQuY2FsbGVlKSA/ICdBcmd1bWVudHMnIDogdGFnO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcbiAgY29weVdpdGhpbjogZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQvKiA9IDAgKi8sIHN0YXJ0IC8qID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XG4gICAgdmFyIE8gICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAgICwgbGVuICAgPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCB0byAgICA9IHRvSW5kZXgodGFyZ2V0LCBsZW4pXG4gICAgICAsIGZyb20gID0gdG9JbmRleChzdGFydCwgbGVuKVxuICAgICAgLCBlbmQgICA9IGFyZ3VtZW50c1syXVxuICAgICAgLCBmaW4gICA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbilcbiAgICAgICwgY291bnQgPSBNYXRoLm1pbihmaW4gLSBmcm9tLCBsZW4gLSB0bylcbiAgICAgICwgaW5jICAgPSAxO1xuICAgIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XG4gICAgICBpbmMgID0gLTE7XG4gICAgICBmcm9tID0gZnJvbSArIGNvdW50IC0gMTtcbiAgICAgIHRvICAgPSB0byAgICsgY291bnQgLSAxO1xuICAgIH1cbiAgICB3aGlsZShjb3VudC0tID4gMCl7XG4gICAgICBpZihmcm9tIGluIE8pT1t0b10gPSBPW2Zyb21dO1xuICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB0byAgICs9IGluYztcbiAgICAgIGZyb20gKz0gaW5jO1xuICAgIH0gcmV0dXJuIE87XG4gIH1cbn0pO1xucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnY29weVdpdGhpbicpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgdG9JbmRleCA9ICQudG9JbmRleDtcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxuICBmaWxsOiBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xuICAgIHZhciBPICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKVxuICAgICAgLCBlbmQgICAgPSBhcmd1bWVudHNbMl1cbiAgICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcbiAgICB3aGlsZShlbmRQb3MgPiBpbmRleClPW2luZGV4KytdID0gdmFsdWU7XG4gICAgcmV0dXJuIE87XG4gIH1cbn0pO1xucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnZmlsbCcpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyIEtFWSAgICA9ICdmaW5kSW5kZXgnXG4gICwgJGRlZiAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgZm9yY2VkID0gdHJ1ZVxuICAsICRmaW5kICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNik7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYoS0VZIGluIFtdKUFycmF5KDEpW0tFWV0oZnVuY3Rpb24oKXsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKEtFWSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjggQXJyYXkucHJvdG90eXBlLmZpbmQocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyIEtFWSAgICA9ICdmaW5kJ1xuICAsICRkZWYgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGZvcmNlZCA9IHRydWVcbiAgLCAkZmluZCAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDUpO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKEtFWSk7IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgY2FsbCAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcbiAgICB2YXIgTyAgICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQoYXJyYXlMaWtlKSlcbiAgICAgICwgbWFwZm4gICA9IGFyZ3VtZW50c1sxXVxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBmICAgICAgID0gbWFwcGluZyA/IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKSA6IHVuZGVmaW5lZFxuICAgICAgLCBpbmRleCAgID0gMFxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYoJGl0ZXIuaXMoTykpe1xuICAgICAgaXRlcmF0b3IgPSAkaXRlci5nZXQoTyk7XG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICAgICAgcmVzdWx0ICAgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpO1xuICAgICAgZm9yKDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBmLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXG4gICAgICByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpKTtcbiAgICAgIGZvcig7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBzZXRVbnNjb3BlID0gcmVxdWlyZSgnLi8kLnVuc2NvcGUnKVxuICAsIElURVIgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgJGl0ZXIgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBzdGVwICAgICAgID0gJGl0ZXIuc3RlcFxuICAsIEl0ZXJhdG9ycyAgPSAkaXRlci5JdGVyYXRvcnM7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiAkLnRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgLCBPICAgICA9IGl0ZXIub1xuICAgICwga2luZCAgPSBpdGVyLmtcbiAgICAsIGluZGV4ID0gaXRlci5pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnNldFVuc2NvcGUoJ2tleXMnKTtcbnNldFVuc2NvcGUoJ3ZhbHVlcycpO1xuc2V0VW5zY29wZSgnZW50cmllcycpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxuICBvZjogZnVuY3Rpb24gb2YoLyogLi4uYXJncyAqLyl7XG4gICAgdmFyIGluZGV4ICA9IDBcbiAgICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cbiAgICAgICwgcmVzdWx0ID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KShsZW5ndGgpO1xuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KXJlc3VsdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXgrK107XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCJyZXF1aXJlKCcuLyQuc3BlY2llcycpKEFycmF5KTsiLCJ2YXIgJCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgSEFTX0lOU1RBTkNFICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaGFzSW5zdGFuY2UnKVxuICAsIEZ1bmN0aW9uUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyAxOS4yLjMuNiBGdW5jdGlvbi5wcm90b3R5cGVbQEBoYXNJbnN0YW5jZV0oVilcbmlmKCEoSEFTX0lOU1RBTkNFIGluIEZ1bmN0aW9uUHJvdG8pKSQuc2V0RGVzYyhGdW5jdGlvblByb3RvLCBIQVNfSU5TVEFOQ0UsIHt2YWx1ZTogZnVuY3Rpb24oTyl7XG4gIGlmKCEkLmlzRnVuY3Rpb24odGhpcykgfHwgISQuaXNPYmplY3QoTykpcmV0dXJuIGZhbHNlO1xuICBpZighJC5pc09iamVjdCh0aGlzLnByb3RvdHlwZSkpcmV0dXJuIE8gaW5zdGFuY2VvZiB0aGlzO1xuICAvLyBmb3IgZW52aXJvbm1lbnQgdy9vIG5hdGl2ZSBgQEBoYXNJbnN0YW5jZWAgbG9naWMgZW5vdWdoIGBpbnN0YW5jZW9mYCwgYnV0IGFkZCB0aGlzOlxuICB3aGlsZShPID0gJC5nZXRQcm90byhPKSlpZih0aGlzLnByb3RvdHlwZSA9PT0gTylyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufX0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBOQU1FID0gJ25hbWUnXG4gICwgc2V0RGVzYyA9ICQuc2V0RGVzY1xuICAsIEZ1bmN0aW9uUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyAxOS4yLjQuMiBuYW1lXG5OQU1FIGluIEZ1bmN0aW9uUHJvdG8gfHwgJC5GVyAmJiAkLkRFU0MgJiYgc2V0RGVzYyhGdW5jdGlvblByb3RvLCBOQU1FLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpe1xuICAgIHZhciBtYXRjaCA9IFN0cmluZyh0aGlzKS5tYXRjaCgvXlxccypmdW5jdGlvbiAoW14gKF0qKS8pXG4gICAgICAsIG5hbWUgID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xuICAgICQuaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgJC5kZXNjKDUsIG5hbWUpKTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgJC5oYXModGhpcywgTkFNRSkgfHwgc2V0RGVzYyh0aGlzLCBOQU1FLCAkLmRlc2MoMCwgdmFsdWUpKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzWzBdKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwidmFyIEluZmluaXR5ID0gMSAvIDBcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIEUgICAgID0gTWF0aC5FXG4gICwgcG93ICAgPSBNYXRoLnBvd1xuICAsIGFicyAgID0gTWF0aC5hYnNcbiAgLCBleHAgICA9IE1hdGguZXhwXG4gICwgbG9nICAgPSBNYXRoLmxvZ1xuICAsIHNxcnQgID0gTWF0aC5zcXJ0XG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcbiAgLCBFUFNJTE9OICAgPSBwb3coMiwgLTUyKVxuICAsIEVQU0lMT04zMiA9IHBvdygyLCAtMjMpXG4gICwgTUFYMzIgICAgID0gcG93KDIsIDEyNykgKiAoMiAtIEVQU0lMT04zMilcbiAgLCBNSU4zMiAgICAgPSBwb3coMiwgLTEyNik7XG5mdW5jdGlvbiByb3VuZFRpZXNUb0V2ZW4obil7XG4gIHJldHVybiBuICsgMSAvIEVQU0lMT04gLSAxIC8gRVBTSUxPTjtcbn1cblxuLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxuZnVuY3Rpb24gc2lnbih4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xufVxuLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxuZnVuY3Rpb24gYXNpbmgoeCl7XG4gIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogbG9nKHggKyBzcXJ0KHggKiB4ICsgMSkpO1xufVxuLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbmZ1bmN0aW9uIGV4cG0xKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcbn1cblxuJGRlZigkZGVmLlMsICdNYXRoJywge1xuICAvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXG4gIGFjb3NoOiBmdW5jdGlvbiBhY29zaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcbiAgfSxcbiAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxuICBhc2luaDogYXNpbmgsXG4gIC8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcbiAgYXRhbmg6IGZ1bmN0aW9uIGF0YW5oKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xuICB9LFxuICAvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcbiAgY2JydDogZnVuY3Rpb24gY2JydCh4KXtcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xuICB9LFxuICAvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxuICBjbHozMjogZnVuY3Rpb24gY2x6MzIoeCl7XG4gICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMSAtIGZsb29yKGxvZyh4ICsgMC41KSAqIE1hdGguTE9HMkUpIDogMzI7XG4gIH0sXG4gIC8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcbiAgY29zaDogZnVuY3Rpb24gY29zaCh4KXtcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xuICB9LFxuICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxuICBleHBtMTogZXhwbTEsXG4gIC8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxuICBmcm91bmQ6IGZ1bmN0aW9uIGZyb3VuZCh4KXtcbiAgICB2YXIgJGFicyAgPSBhYnMoeClcbiAgICAgICwgJHNpZ24gPSBzaWduKHgpXG4gICAgICAsIGEsIHJlc3VsdDtcbiAgICBpZigkYWJzIDwgTUlOMzIpcmV0dXJuICRzaWduICogcm91bmRUaWVzVG9FdmVuKCRhYnMgLyBNSU4zMiAvIEVQU0lMT04zMikgKiBNSU4zMiAqIEVQU0lMT04zMjtcbiAgICBhID0gKDEgKyBFUFNJTE9OMzIgLyBFUFNJTE9OKSAqICRhYnM7XG4gICAgcmVzdWx0ID0gYSAtIChhIC0gJGFicyk7XG4gICAgaWYocmVzdWx0ID4gTUFYMzIgfHwgcmVzdWx0ICE9IHJlc3VsdClyZXR1cm4gJHNpZ24gKiBJbmZpbml0eTtcbiAgICByZXR1cm4gJHNpZ24gKiByZXN1bHQ7XG4gIH0sXG4gIC8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHN1bSAgPSAwXG4gICAgICAsIGkgICAgPSAwXG4gICAgICAsIGxlbiAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGxhcmcgPSAwXG4gICAgICAsIGFyZywgZGl2O1xuICAgIHdoaWxlKGkgPCBsZW4pe1xuICAgICAgYXJnID0gYWJzKGFyZ3VtZW50c1tpKytdKTtcbiAgICAgIGlmKGxhcmcgPCBhcmcpe1xuICAgICAgICBkaXYgID0gbGFyZyAvIGFyZztcbiAgICAgICAgc3VtICA9IHN1bSAqIGRpdiAqIGRpdiArIDE7XG4gICAgICAgIGxhcmcgPSBhcmc7XG4gICAgICB9IGVsc2UgaWYoYXJnID4gMCl7XG4gICAgICAgIGRpdiAgPSBhcmcgLyBsYXJnO1xuICAgICAgICBzdW0gKz0gZGl2ICogZGl2O1xuICAgICAgfSBlbHNlIHN1bSArPSBhcmc7XG4gICAgfVxuICAgIHJldHVybiBsYXJnID09PSBJbmZpbml0eSA/IEluZmluaXR5IDogbGFyZyAqIHNxcnQoc3VtKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxuICBpbXVsOiBmdW5jdGlvbiBpbXVsKHgsIHkpe1xuICAgIHZhciBVSW50MTYgPSAweGZmZmZcbiAgICAgICwgeG4gPSAreFxuICAgICAgLCB5biA9ICt5XG4gICAgICAsIHhsID0gVUludDE2ICYgeG5cbiAgICAgICwgeWwgPSBVSW50MTYgJiB5bjtcbiAgICByZXR1cm4gMCB8IHhsICogeWwgKyAoKFVJbnQxNiAmIHhuID4+PiAxNikgKiB5bCArIHhsICogKFVJbnQxNiAmIHluID4+PiAxNikgPDwgMTYgPj4+IDApO1xuICB9LFxuICAvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxuICBsb2cxcDogZnVuY3Rpb24gbG9nMXAoeCl7XG4gICAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogbG9nKDEgKyB4KTtcbiAgfSxcbiAgLy8gMjAuMi4yLjIxIE1hdGgubG9nMTAoeClcbiAgbG9nMTA6IGZ1bmN0aW9uIGxvZzEwKHgpe1xuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMTA7XG4gIH0sXG4gIC8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcbiAgbG9nMjogZnVuY3Rpb24gbG9nMih4KXtcbiAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjI7XG4gIH0sXG4gIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbiAgc2lnbjogc2lnbixcbiAgLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxuICBzaW5oOiBmdW5jdGlvbiBzaW5oKHgpe1xuICAgIHJldHVybiBhYnMoeCA9ICt4KSA8IDEgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMiA6IChleHAoeCAtIDEpIC0gZXhwKC14IC0gMSkpICogKEUgLyAyKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxuICB0YW5oOiBmdW5jdGlvbiB0YW5oKHgpe1xuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxuICAgICAgLCBiID0gZXhwbTEoLXgpO1xuICAgIHJldHVybiBhID09IEluZmluaXR5ID8gMSA6IGIgPT0gSW5maW5pdHkgPyAtMSA6IChhIC0gYikgLyAoZXhwKHgpICsgZXhwKC14KSk7XG4gIH0sXG4gIC8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXG4gIHRydW5jOiBmdW5jdGlvbiB0cnVuYyhpdCl7XG4gICAgcmV0dXJuIChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGlzT2JqZWN0ICAgPSAkLmlzT2JqZWN0XG4gICwgaXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvblxuICAsIE5VTUJFUiAgICAgPSAnTnVtYmVyJ1xuICAsICROdW1iZXIgICAgPSAkLmdbTlVNQkVSXVxuICAsIEJhc2UgICAgICAgPSAkTnVtYmVyXG4gICwgcHJvdG8gICAgICA9ICROdW1iZXIucHJvdG90eXBlO1xuZnVuY3Rpb24gdG9QcmltaXRpdmUoaXQpe1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoaXNGdW5jdGlvbihmbiA9IGl0LnZhbHVlT2YpICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoaXNGdW5jdGlvbihmbiA9IGl0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIG51bWJlclwiKTtcbn1cbmZ1bmN0aW9uIHRvTnVtYmVyKGl0KXtcbiAgaWYoaXNPYmplY3QoaXQpKWl0ID0gdG9QcmltaXRpdmUoaXQpO1xuICBpZih0eXBlb2YgaXQgPT0gJ3N0cmluZycgJiYgaXQubGVuZ3RoID4gMiAmJiBpdC5jaGFyQ29kZUF0KDApID09IDQ4KXtcbiAgICB2YXIgYmluYXJ5ID0gZmFsc2U7XG4gICAgc3dpdGNoKGl0LmNoYXJDb2RlQXQoMSkpe1xuICAgICAgY2FzZSA2NiA6IGNhc2UgOTggIDogYmluYXJ5ID0gdHJ1ZTtcbiAgICAgIGNhc2UgNzkgOiBjYXNlIDExMSA6IHJldHVybiBwYXJzZUludChpdC5zbGljZSgyKSwgYmluYXJ5ID8gMiA6IDgpO1xuICAgIH1cbiAgfSByZXR1cm4gK2l0O1xufVxuaWYoJC5GVyAmJiAhKCROdW1iZXIoJzBvMScpICYmICROdW1iZXIoJzBiMScpKSl7XG4gICROdW1iZXIgPSBmdW5jdGlvbiBOdW1iZXIoaXQpe1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgJE51bWJlciA/IG5ldyBCYXNlKHRvTnVtYmVyKGl0KSkgOiB0b051bWJlcihpdCk7XG4gIH07XG4gICQuZWFjaC5jYWxsKCQuREVTQyA/ICQuZ2V0TmFtZXMoQmFzZSkgOiAoXG4gICAgICAvLyBFUzM6XG4gICAgICAnTUFYX1ZBTFVFLE1JTl9WQUxVRSxOYU4sTkVHQVRJVkVfSU5GSU5JVFksUE9TSVRJVkVfSU5GSU5JVFksJyArXG4gICAgICAvLyBFUzYgKGluIGNhc2UsIGlmIG1vZHVsZXMgd2l0aCBFUzYgTnVtYmVyIHN0YXRpY3MgcmVxdWlyZWQgYmVmb3JlKTpcbiAgICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXG4gICAgICAnTUlOX1NBRkVfSU5URUdFUixwYXJzZUZsb2F0LHBhcnNlSW50LGlzSW50ZWdlcidcbiAgICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gICAgICBpZigkLmhhcyhCYXNlLCBrZXkpICYmICEkLmhhcygkTnVtYmVyLCBrZXkpKXtcbiAgICAgICAgJC5zZXREZXNjKCROdW1iZXIsIGtleSwgJC5nZXREZXNjKEJhc2UsIGtleSkpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbiAgJE51bWJlci5wcm90b3R5cGUgPSBwcm90bztcbiAgcHJvdG8uY29uc3RydWN0b3IgPSAkTnVtYmVyO1xuICByZXF1aXJlKCcuLyQucmVkZWYnKSgkLmcsIE5VTUJFUiwgJE51bWJlcik7XG59IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGFicyAgID0gTWF0aC5hYnNcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcbiAgLCBfaXNGaW5pdGUgPSAkLmcuaXNGaW5pdGVcbiAgLCBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZjsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MTtcbmZ1bmN0aW9uIGlzSW50ZWdlcihpdCl7XG4gIHJldHVybiAhJC5pc09iamVjdChpdCkgJiYgX2lzRmluaXRlKGl0KSAmJiBmbG9vcihpdCkgPT09IGl0O1xufVxuJGRlZigkZGVmLlMsICdOdW1iZXInLCB7XG4gIC8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXG4gIEVQU0lMT046IE1hdGgucG93KDIsIC01MiksXG4gIC8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXG4gIGlzRmluaXRlOiBmdW5jdGlvbiBpc0Zpbml0ZShpdCl7XG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xuICB9LFxuICAvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXG4gIC8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXG4gIGlzTmFOOiBmdW5jdGlvbiBpc05hTihudW1iZXIpe1xuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xuICB9LFxuICAvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKXtcbiAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gTUFYX1NBRkVfSU5URUdFUjtcbiAgfSxcbiAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgTUFYX1NBRkVfSU5URUdFUjogTUFYX1NBRkVfSU5URUdFUixcbiAgLy8gMjAuMS4yLjEwIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG4gIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxuICAvLyAyMC4xLjIuMTIgTnVtYmVyLnBhcnNlRmxvYXQoc3RyaW5nKVxuICBwYXJzZUZsb2F0OiBwYXJzZUZsb2F0LFxuICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXG4gIHBhcnNlSW50OiBwYXJzZUludFxufSk7IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuLyQuYXNzaWduJyl9KTsiLCIvLyAxOS4xLjMuMTAgT2JqZWN0LmlzKHZhbHVlMSwgdmFsdWUyKVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcbiAgaXM6IHJlcXVpcmUoJy4vJC5zYW1lJylcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0fSk7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdDtcbiQuZWFjaC5jYWxsKCgnZnJlZXplLHNlYWwscHJldmVudEV4dGVuc2lvbnMsaXNGcm96ZW4saXNTZWFsZWQsaXNFeHRlbnNpYmxlLCcgK1xuICAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLGdldFByb3RvdHlwZU9mLGtleXMsZ2V0T3duUHJvcGVydHlOYW1lcycpLnNwbGl0KCcsJylcbiwgZnVuY3Rpb24oS0VZLCBJRCl7XG4gIHZhciBmbiAgICAgPSAoJC5jb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZm9yY2VkID0gMFxuICAgICwgbWV0aG9kID0ge307XG4gIG1ldGhvZFtLRVldID0gSUQgPT0gMCA/IGZ1bmN0aW9uIGZyZWV6ZShpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMSA/IGZ1bmN0aW9uIHNlYWwoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcbiAgfSA6IElEID09IDIgPyBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyhpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMyA/IGZ1bmN0aW9uIGlzRnJvemVuKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcbiAgfSA6IElEID09IDQgPyBmdW5jdGlvbiBpc1NlYWxlZChpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IHRydWU7XG4gIH0gOiBJRCA9PSA1ID8gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XG4gIH0gOiBJRCA9PSA2ID8gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XG4gIH0gOiBJRCA9PSA3ID8gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YoaXQpe1xuICAgIHJldHVybiBmbihPYmplY3QoJC5hc3NlcnREZWZpbmVkKGl0KSkpO1xuICB9IDogSUQgPT0gOCA/IGZ1bmN0aW9uIGtleXMoaXQpe1xuICAgIHJldHVybiBmbih0b09iamVjdChpdCkpO1xuICB9IDogcmVxdWlyZSgnLi8kLmdldC1uYW1lcycpLmdldDtcbiAgdHJ5IHtcbiAgICBmbigneicpO1xuICB9IGNhdGNoKGUpe1xuICAgIGZvcmNlZCA9IDE7XG4gIH1cbiAgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiBmb3JjZWQsICdPYmplY3QnLCBtZXRob2QpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgdG1wID0ge307XG50bXBbcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcbmlmKHJlcXVpcmUoJy4vJCcpLkZXICYmIGNvZih0bXApICE9ICd6Jyl7XG4gIHJlcXVpcmUoJy4vJC5yZWRlZicpKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjb2YuY2xhc3NvZih0aGlzKSArICddJztcbiAgfSwgdHJ1ZSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNvZiAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBhc3NlcnQgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGZvck9mICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc2V0UHJvdG8gPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0XG4gICwgc2FtZSAgICAgPSByZXF1aXJlKCcuLyQuc2FtZScpXG4gICwgc3BlY2llcyAgPSByZXF1aXJlKCcuLyQuc3BlY2llcycpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKVxuICAsIFJFQ09SRCAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ3JlY29yZCcpXG4gICwgUFJPTUlTRSAgPSAnUHJvbWlzZSdcbiAgLCBnbG9iYWwgICA9ICQuZ1xuICAsIHByb2Nlc3MgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICA9IGNvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBhc2FwICAgICA9IHByb2Nlc3MgJiYgcHJvY2Vzcy5uZXh0VGljayB8fCByZXF1aXJlKCcuLyQudGFzaycpLnNldFxuICAsIFAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgaXNGdW5jdGlvbiAgICAgPSAkLmlzRnVuY3Rpb25cbiAgLCBpc09iamVjdCAgICAgICA9ICQuaXNPYmplY3RcbiAgLCBhc3NlcnRGdW5jdGlvbiA9IGFzc2VydC5mblxuICAsIGFzc2VydE9iamVjdCAgID0gYXNzZXJ0Lm9ialxuICAsIFdyYXBwZXI7XG5cbmZ1bmN0aW9uIHRlc3RSZXNvbHZlKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59XG5cbnZhciB1c2VOYXRpdmUgPSBmdW5jdGlvbigpe1xuICB2YXIgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBpc0Z1bmN0aW9uKFApICYmIGlzRnVuY3Rpb24oUC5yZXNvbHZlKSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFAyLCBQKTtcbiAgICBQMi5wcm90b3R5cGUgPSAkLmNyZWF0ZShQLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFAyfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBhY3R1YWwgVjggYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmICQuREVTQyl7XG4gICAgICB2YXIgdGhlbmFibGVUaGVuR290dGVuID0gZmFsc2U7XG4gICAgICBQLnJlc29sdmUoJC5zZXREZXNjKHt9LCAndGhlbicsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSB0cnVlOyB9XG4gICAgICB9KSk7XG4gICAgICB3b3JrcyA9IHRoZW5hYmxlVGhlbkdvdHRlbjtcbiAgICB9XG4gIH0gY2F0Y2goZSl7IHdvcmtzID0gZmFsc2U7IH1cbiAgcmV0dXJuIHdvcmtzO1xufSgpO1xuXG4vLyBoZWxwZXJzXG5mdW5jdGlvbiBpc1Byb21pc2UoaXQpe1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICh1c2VOYXRpdmUgPyBjb2YuY2xhc3NvZihpdCkgPT0gJ1Byb21pc2UnIDogUkVDT1JEIGluIGl0KTtcbn1cbmZ1bmN0aW9uIHNhbWVDb25zdHJ1Y3RvcihhLCBiKXtcbiAgLy8gbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICBpZighJC5GVyAmJiBhID09PSBQICYmIGIgPT09IFdyYXBwZXIpcmV0dXJuIHRydWU7XG4gIHJldHVybiBzYW1lKGEsIGIpO1xufVxuZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3IoQyl7XG4gIHZhciBTID0gYXNzZXJ0T2JqZWN0KEMpW1NQRUNJRVNdO1xuICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcbn1cbmZ1bmN0aW9uIGlzVGhlbmFibGUoaXQpe1xuICB2YXIgdGhlbjtcbiAgaWYoaXNPYmplY3QoaXQpKXRoZW4gPSBpdC50aGVuO1xuICByZXR1cm4gaXNGdW5jdGlvbih0aGVuKSA/IHRoZW4gOiBmYWxzZTtcbn1cbmZ1bmN0aW9uIG5vdGlmeShyZWNvcmQpe1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICBpZihjaGFpbi5sZW5ndGgpYXNhcC5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSByZWNvcmQudlxuICAgICAgLCBvayAgICA9IHJlY29yZC5zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIGZ1bmN0aW9uIHJ1bihyZWFjdCl7XG4gICAgICB2YXIgY2IgPSBvayA/IHJlYWN0Lm9rIDogcmVhY3QuZmFpbFxuICAgICAgICAsIHJldCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGNiKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJldCA9IGNiID09PSB0cnVlID8gdmFsdWUgOiBjYih2YWx1ZSk7XG4gICAgICAgICAgaWYocmV0ID09PSByZWFjdC5QKXtcbiAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJldCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJldCwgcmVhY3QucmVzLCByZWFjdC5yZWopO1xuICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcbiAgICAgICAgfSBlbHNlIHJlYWN0LnJlaih2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIHJlYWN0LnJlaihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzVW5oYW5kbGVkKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXG4gICAgLCBjaGFpbiAgPSByZWNvcmQuYSB8fCByZWNvcmQuY1xuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVhY3Q7XG4gIGlmKHJlY29yZC5oKXJldHVybiBmYWxzZTtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3QgPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0LmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0LlApKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uICRyZWplY3QodmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgcHJvbWlzZTtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIGFzYXAuY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlID0gcmVjb3JkLnApKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGdsb2JhbC5jb25zb2xlICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH0sIDEpO1xuICBub3RpZnkocmVjb3JkKTtcbn1cbmZ1bmN0aW9uICRyZXNvbHZlKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBhc2FwLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCk7XG4gICAgfVxuICB9IGNhdGNoKGUpe1xuICAgICRyZWplY3QuY2FsbCh7cjogcmVjb3JkLCBkOiBmYWxzZX0sIGUpOyAvLyB3cmFwXG4gIH1cbn1cblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCF1c2VOYXRpdmUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYXNzZXJ0RnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIHZhciByZWNvcmQgPSB7XG4gICAgICBwOiBhc3NlcnQuaW5zdCh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgLy8gPC0gcHJvbWlzZVxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgICAgYTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICAgIGQ6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBkb25lXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgIGg6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxuICAgIH07XG4gICAgJC5oaWRlKHRoaXMsIFJFQ09SRCwgcmVjb3JkKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5taXgnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgUyA9IGFzc2VydE9iamVjdChhc3NlcnRPYmplY3QodGhpcykuY29uc3RydWN0b3IpW1NQRUNJRVNdO1xuICAgICAgdmFyIHJlYWN0ID0ge1xuICAgICAgICBvazogICBpc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogdHJ1ZSxcbiAgICAgICAgZmFpbDogaXNGdW5jdGlvbihvblJlamVjdGVkKSAgPyBvblJlamVjdGVkICA6IGZhbHNlXG4gICAgICB9O1xuICAgICAgdmFyIHByb21pc2UgPSByZWFjdC5QID0gbmV3IChTICE9IHVuZGVmaW5lZCA/IFMgOiBQKShmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICAgIHJlYWN0LnJlcyA9IGFzc2VydEZ1bmN0aW9uKHJlcyk7XG4gICAgICAgIHJlYWN0LnJlaiA9IGFzc2VydEZ1bmN0aW9uKHJlaik7XG4gICAgICB9KTtcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzW1JFQ09SRF07XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0KTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3QpO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gZXhwb3J0XG4kZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqICF1c2VOYXRpdmUsIHtQcm9taXNlOiBQfSk7XG5jb2Yuc2V0KFAsIFBST01JU0UpO1xuc3BlY2llcyhQKTtcbnNwZWNpZXMoV3JhcHBlciA9ICQuY29yZVtQUk9NSVNFXSk7XG5cbi8vIHN0YXRpY3NcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICByZXR1cm4gbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzLCByZWopeyByZWoocik7IH0pO1xuICB9XG59KTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKCF1c2VOYXRpdmUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIHJldHVybiBpc1Byb21pc2UoeCkgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpXG4gICAgICA/IHggOiBuZXcgdGhpcyhmdW5jdGlvbihyZXMpeyByZXMoeCk7IH0pO1xuICB9XG59KTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISh1c2VOYXRpdmUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgdmFsdWVzID0gW107XG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlcyhyZXN1bHRzKTtcbiAgICAgICAgfSwgcmVqKTtcbiAgICAgIH0pO1xuICAgICAgZWxzZSByZXMocmVzdWx0cyk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzLCByZWopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pOyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHNldFByb3RvICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKVxuICAsICRpdGVyICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJVEVSICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgc3RlcCAgICAgID0gJGl0ZXIuc3RlcFxuICAsIGFzc2VydCAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcbiAgLCBnZXRQcm90byAgPSAkLmdldFByb3RvXG4gICwgJFJlZmxlY3QgID0gJC5nLlJlZmxlY3RcbiAgLCBfYXBwbHkgICAgPSBGdW5jdGlvbi5hcHBseVxuICAsIGFzc2VydE9iamVjdCA9IGFzc2VydC5vYmpcbiAgLCBfaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIF9wcmV2ZW50RXh0ZW5zaW9ucyA9IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9uc1xuICAvLyBJRSBUUCBoYXMgYnJva2VuIFJlZmxlY3QuZW51bWVyYXRlXG4gICwgYnVnZ3lFbnVtZXJhdGUgPSAhKCRSZWZsZWN0ICYmICRSZWZsZWN0LmVudW1lcmF0ZSAmJiBJVEVSQVRPUiBpbiAkUmVmbGVjdC5lbnVtZXJhdGUoe30pKTtcblxuZnVuY3Rpb24gRW51bWVyYXRlKGl0ZXJhdGVkKXtcbiAgJC5zZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiB1bmRlZmluZWQsIGk6IDB9KTtcbn1cbiRpdGVyLmNyZWF0ZShFbnVtZXJhdGUsICdPYmplY3QnLCBmdW5jdGlvbigpe1xuICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cbiAgICAsIGtleXMgPSBpdGVyLmtcbiAgICAsIGtleTtcbiAgaWYoa2V5cyA9PSB1bmRlZmluZWQpe1xuICAgIGl0ZXIuayA9IGtleXMgPSBbXTtcbiAgICBmb3Ioa2V5IGluIGl0ZXIubylrZXlzLnB1c2goa2V5KTtcbiAgfVxuICBkbyB7XG4gICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xuICB9IHdoaWxlKCEoKGtleSA9IGtleXNbaXRlci5pKytdKSBpbiBpdGVyLm8pKTtcbiAgcmV0dXJuIHN0ZXAoMCwga2V5KTtcbn0pO1xuXG52YXIgcmVmbGVjdCA9IHtcbiAgLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXG4gIGFwcGx5OiBmdW5jdGlvbiBhcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCl7XG4gICAgcmV0dXJuIF9hcHBseS5jYWxsKHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KTtcbiAgfSxcbiAgLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgLyosIG5ld1RhcmdldCovKXtcbiAgICB2YXIgcHJvdG8gICAgPSBhc3NlcnQuZm4oYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl0pLnByb3RvdHlwZVxuICAgICAgLCBpbnN0YW5jZSA9ICQuY3JlYXRlKGlzT2JqZWN0KHByb3RvKSA/IHByb3RvIDogT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgICwgcmVzdWx0ICAgPSBfYXBwbHkuY2FsbCh0YXJnZXQsIGluc3RhbmNlLCBhcmd1bWVudHNMaXN0KTtcbiAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IGluc3RhbmNlO1xuICB9LFxuICAvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyl7XG4gICAgYXNzZXJ0T2JqZWN0KHRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgICQuc2V0RGVzYyh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICAvLyAyNi4xLjQgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KVxuICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgdmFyIGRlc2MgPSAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xuICB9LFxuICAvLyAyNi4xLjYgUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSBbLCByZWNlaXZlcl0pXG4gIGdldDogZnVuY3Rpb24gZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cbiAgICAgICwgZGVzYyA9ICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpLCBwcm90bztcbiAgICBpZihkZXNjKXJldHVybiAkLmhhcyhkZXNjLCAndmFsdWUnKVxuICAgICAgPyBkZXNjLnZhbHVlXG4gICAgICA6IGRlc2MuZ2V0ID09PSB1bmRlZmluZWRcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICByZXR1cm4gaXNPYmplY3QocHJvdG8gPSBnZXRQcm90byh0YXJnZXQpKVxuICAgICAgPyBnZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcilcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9LFxuICAvLyAyNi4xLjcgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICB9LFxuICAvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZih0YXJnZXQpe1xuICAgIHJldHVybiBnZXRQcm90byhhc3NlcnRPYmplY3QodGFyZ2V0KSk7XG4gIH0sXG4gIC8vIDI2LjEuOSBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KVxuICBoYXM6IGZ1bmN0aW9uIGhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xuICB9LFxuICAvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUodGFyZ2V0KXtcbiAgICByZXR1cm4gX2lzRXh0ZW5zaWJsZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XG4gIH0sXG4gIC8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcbiAgb3duS2V5czogcmVxdWlyZSgnLi8kLm93bi1rZXlzJyksXG4gIC8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuICAgIGFzc2VydE9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICBpZihfcHJldmVudEV4dGVuc2lvbnMpX3ByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxuICAgICAgLCBvd25EZXNjICA9ICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpXG4gICAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XG4gICAgaWYoIW93bkRlc2Mpe1xuICAgICAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90byh0YXJnZXQpKSl7XG4gICAgICAgIHJldHVybiBzZXQocHJvdG8sIHByb3BlcnR5S2V5LCBWLCByZWNlaXZlcik7XG4gICAgICB9XG4gICAgICBvd25EZXNjID0gJC5kZXNjKDApO1xuICAgIH1cbiAgICBpZigkLmhhcyhvd25EZXNjLCAndmFsdWUnKSl7XG4gICAgICBpZihvd25EZXNjLndyaXRhYmxlID09PSBmYWxzZSB8fCAhaXNPYmplY3QocmVjZWl2ZXIpKXJldHVybiBmYWxzZTtcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9ICQuZ2V0RGVzYyhyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8ICQuZGVzYygwKTtcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XG4gICAgICAkLnNldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xuICB9XG59O1xuLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXG5pZihzZXRQcm90bylyZWZsZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byl7XG4gIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xuICB0cnkge1xuICAgIHNldFByb3RvLnNldCh0YXJnZXQsIHByb3RvKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbiRkZWYoJGRlZi5HLCB7UmVmbGVjdDoge319KTtcblxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiBidWdneUVudW1lcmF0ZSwgJ1JlZmxlY3QnLCB7XG4gIC8vIDI2LjEuNSBSZWZsZWN0LmVudW1lcmF0ZSh0YXJnZXQpXG4gIGVudW1lcmF0ZTogZnVuY3Rpb24gZW51bWVyYXRlKHRhcmdldCl7XG4gICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9XG59KTtcblxuJGRlZigkZGVmLlMsICdSZWZsZWN0JywgcmVmbGVjdCk7IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkUmVnRXhwID0gJC5nLlJlZ0V4cFxuICAsIEJhc2UgICAgPSAkUmVnRXhwXG4gICwgcHJvdG8gICA9ICRSZWdFeHAucHJvdG90eXBlXG4gICwgcmUgICAgICA9IC9hL2dcbiAgLy8gXCJuZXdcIiBjcmVhdGVzIGEgbmV3IG9iamVjdFxuICAsIENPUlJFQ1RfTkVXID0gbmV3ICRSZWdFeHAocmUpICE9PSByZVxuICAvLyBSZWdFeHAgYWxsb3dzIGEgcmVnZXggd2l0aCBmbGFncyBhcyB0aGUgcGF0dGVyblxuICAsIEFMTE9XU19SRV9XSVRIX0ZMQUdTID0gZnVuY3Rpb24oKXtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICRSZWdFeHAocmUsICdpJykgPT0gJy9hL2knO1xuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgfSgpO1xuaWYoJC5GVyAmJiAkLkRFU0Mpe1xuICBpZighQ09SUkVDVF9ORVcgfHwgIUFMTE9XU19SRV9XSVRIX0ZMQUdTKXtcbiAgICAkUmVnRXhwID0gZnVuY3Rpb24gUmVnRXhwKHBhdHRlcm4sIGZsYWdzKXtcbiAgICAgIHZhciBwYXR0ZXJuSXNSZWdFeHAgID0gY29mKHBhdHRlcm4pID09ICdSZWdFeHAnXG4gICAgICAgICwgZmxhZ3NJc1VuZGVmaW5lZCA9IGZsYWdzID09PSB1bmRlZmluZWQ7XG4gICAgICBpZighKHRoaXMgaW5zdGFuY2VvZiAkUmVnRXhwKSAmJiBwYXR0ZXJuSXNSZWdFeHAgJiYgZmxhZ3NJc1VuZGVmaW5lZClyZXR1cm4gcGF0dGVybjtcbiAgICAgIHJldHVybiBDT1JSRUNUX05FV1xuICAgICAgICA/IG5ldyBCYXNlKHBhdHRlcm5Jc1JlZ0V4cCAmJiAhZmxhZ3NJc1VuZGVmaW5lZCA/IHBhdHRlcm4uc291cmNlIDogcGF0dGVybiwgZmxhZ3MpXG4gICAgICAgIDogbmV3IEJhc2UocGF0dGVybklzUmVnRXhwID8gcGF0dGVybi5zb3VyY2UgOiBwYXR0ZXJuXG4gICAgICAgICAgLCBwYXR0ZXJuSXNSZWdFeHAgJiYgZmxhZ3NJc1VuZGVmaW5lZCA/IHBhdHRlcm4uZmxhZ3MgOiBmbGFncyk7XG4gICAgfTtcbiAgICAkLmVhY2guY2FsbCgkLmdldE5hbWVzKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xuICAgICAga2V5IGluICRSZWdFeHAgfHwgJC5zZXREZXNjKCRSZWdFeHAsIGtleSwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIEJhc2Vba2V5XTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbihpdCl7IEJhc2Vba2V5XSA9IGl0OyB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm90by5jb25zdHJ1Y3RvciA9ICRSZWdFeHA7XG4gICAgJFJlZ0V4cC5wcm90b3R5cGUgPSBwcm90bztcbiAgICByZXF1aXJlKCcuLyQucmVkZWYnKSgkLmcsICdSZWdFeHAnLCAkUmVnRXhwKTtcbiAgfVxuICAvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG4gIGlmKC8uL2cuZmxhZ3MgIT0gJ2cnKSQuc2V0RGVzYyhwcm90bywgJ2ZsYWdzJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9eLipcXC8oXFx3KikkLywgJyQxJylcbiAgfSk7XG59XG5yZXF1aXJlKCcuLyQuc3BlY2llcycpKCRSZWdFeHApOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50c1swXSk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKShmYWxzZSk7XG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjMgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdChwb3MpXG4gIGNvZGVQb2ludEF0OiBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3Mpe1xuICAgIHJldHVybiAkYXQodGhpcywgcG9zKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgdG9MZW5ndGggPSAkLnRvTGVuZ3RoO1xuXG4vLyBzaG91bGQgdGhyb3cgZXJyb3Igb24gcmVnZXhcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC50aHJvd3MnKShmdW5jdGlvbigpeyAncScuZW5kc1dpdGgoLy4vKTsgfSksICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcbiAgZW5kc1dpdGg6IGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKXtcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB2YXIgdGhhdCA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgICAsIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzFdXG4gICAgICAsIGxlbiA9IHRvTGVuZ3RoKHRoYXQubGVuZ3RoKVxuICAgICAgLCBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogTWF0aC5taW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xuICAgIHNlYXJjaFN0cmluZyArPSAnJztcbiAgICByZXR1cm4gdGhhdC5zbGljZShlbmQgLSBzZWFyY2hTdHJpbmcubGVuZ3RoLCBlbmQpID09PSBzZWFyY2hTdHJpbmc7XG4gIH1cbn0pOyIsInZhciAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgdG9JbmRleCA9IHJlcXVpcmUoJy4vJCcpLnRvSW5kZXhcbiAgLCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlXG4gICwgJGZyb21Db2RlUG9pbnQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludDtcblxuLy8gbGVuZ3RoIHNob3VsZCBiZSAxLCBvbGQgRkYgcHJvYmxlbVxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoISEkZnJvbUNvZGVQb2ludCAmJiAkZnJvbUNvZGVQb2ludC5sZW5ndGggIT0gMSksICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMi4yIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpXG4gIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoeCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgcmVzID0gW11cbiAgICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBpICAgPSAwXG4gICAgICAsIGNvZGU7XG4gICAgd2hpbGUobGVuID4gaSl7XG4gICAgICBjb2RlID0gK2FyZ3VtZW50c1tpKytdO1xuICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XG4gICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxuICAgICAgICA/IGZyb21DaGFyQ29kZShjb2RlKVxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXG4gICAgICApO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gISF+U3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSkuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pOyIsInZhciBzZXQgICA9IHJlcXVpcmUoJy4vJCcpLnNldFxuICAsICRhdCAgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpXG4gICwgSVRFUiAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgc3RlcCAgPSAkaXRlci5zdGVwO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHNldCh0aGlzLCBJVEVSLCB7bzogU3RyaW5nKGl0ZXJhdGVkKSwgaTogMH0pO1xuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxuICAgICwgTyAgICAgPSBpdGVyLm9cbiAgICAsIGluZGV4ID0gaXRlci5pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHN0ZXAoMSk7XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHN0ZXAoMCwgcG9pbnQpO1xufSk7IiwidmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbiRkZWYoJGRlZi5TLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxuICByYXc6IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSl7XG4gICAgdmFyIHRwbCA9ICQudG9PYmplY3QoY2FsbFNpdGUucmF3KVxuICAgICAgLCBsZW4gPSAkLnRvTGVuZ3RoKHRwbC5sZW5ndGgpXG4gICAgICAsIHNsbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgcmVzID0gW11cbiAgICAgICwgaSAgID0gMDtcbiAgICB3aGlsZShsZW4gPiBpKXtcbiAgICAgIHJlcy5wdXNoKFN0cmluZyh0cGxbaSsrXSkpO1xuICAgICAgaWYoaSA8IHNsbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xuICB9XG59KTsiLCJ2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4xMyBTdHJpbmcucHJvdG90eXBlLnJlcGVhdChjb3VudClcbiAgcmVwZWF0OiByZXF1aXJlKCcuLyQuc3RyaW5nLXJlcGVhdCcpXG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbi8vIHNob3VsZCB0aHJvdyBlcnJvciBvbiByZWdleFxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAhcmVxdWlyZSgnLi8kLnRocm93cycpKGZ1bmN0aW9uKCl7ICdxJy5zdGFydHNXaXRoKC8uLyk7IH0pLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcbiAgICBpZihjb2Yoc2VhcmNoU3RyaW5nKSA9PSAnUmVnRXhwJyl0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB2YXIgdGhhdCAgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBpbmRleCA9ICQudG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xuICAgIHNlYXJjaFN0cmluZyArPSAnJztcbiAgICByZXR1cm4gdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJpbmcubGVuZ3RoKSA9PT0gc2VhcmNoU3RyaW5nO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNldFRhZyAgID0gcmVxdWlyZSgnLi8kLmNvZicpLnNldFxuICAsIHVpZCAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgc2hhcmVkICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJylcbiAgLCBrZXlPZiAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgZW51bUtleXMgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJylcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlXG4gICwgREVTQyAgICAgPSAkLkRFU0NcbiAgLCBoYXMgICAgICA9ICQuaGFzXG4gICwgJGNyZWF0ZSAgPSAkLmNyZWF0ZVxuICAsIGdldERlc2MgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgPSAkLnNldERlc2NcbiAgLCBkZXNjICAgICA9ICQuZGVzY1xuICAsICRuYW1lcyAgID0gcmVxdWlyZSgnLi8kLmdldC1uYW1lcycpXG4gICwgZ2V0TmFtZXMgPSAkbmFtZXMuZ2V0XG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0XG4gICwgJFN5bWJvbCAgPSAkLmcuU3ltYm9sXG4gICwgc2V0dGVyICAgPSBmYWxzZVxuICAsIFRBRyAgICAgID0gdWlkKCd0YWcnKVxuICAsIEhJRERFTiAgID0gdWlkKCdoaWRkZW4nKVxuICAsIF9wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgdXNlTmF0aXZlID0gJC5pc0Z1bmN0aW9uKCRTeW1ib2wpO1xuXG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0MgPyBmdW5jdGlvbigpeyAvLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWRcbiAgdHJ5IHtcbiAgICByZXR1cm4gJGNyZWF0ZShzZXREZXNjKHt9LCBISURERU4sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHNldERlc2ModGhpcywgSElEREVOLCB7dmFsdWU6IGZhbHNlfSlbSElEREVOXTtcbiAgICAgIH1cbiAgICB9KSlbSElEREVOXSB8fCBzZXREZXNjO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgICAgIHZhciBwcm90b0Rlc2MgPSBnZXREZXNjKE9iamVjdFByb3RvLCBrZXkpO1xuICAgICAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICAgICAgc2V0RGVzYyhpdCwga2V5LCBEKTtcbiAgICAgIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pc2V0RGVzYyhPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xuICAgIH07XG4gIH1cbn0oKSA6IHNldERlc2M7XG5cbmZ1bmN0aW9uIHdyYXAodGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCRjcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XG4gIERFU0MgJiYgc2V0dGVyICYmIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBkZXNjKDEsIHZhbHVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN5bTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlzZXREZXNjKGl0LCBISURERU4sIGRlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gJGNyZWF0ZShELCB7ZW51bWVyYWJsZTogZGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBzZXREZXNjKGl0LCBrZXksIEQpO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSlkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59XG5mdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gJGNyZWF0ZShpdCkgOiBkZWZpbmVQcm9wZXJ0aWVzKCRjcmVhdGUoaXQpLCBQKTtcbn1cbmZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gX3Byb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59XG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvT2JqZWN0KGl0KSwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b09iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHNbMF0pKTtcbiAgfTtcbiAgJHJlZGVmKCRTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzW1RBR107XG4gIH0pO1xuXG4gICQuY3JlYXRlICAgICA9IGNyZWF0ZTtcbiAgJC5zZXREZXNjICAgID0gZGVmaW5lUHJvcGVydHk7XG4gICQuZ2V0RGVzYyAgICA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJC5zZXREZXNjcyAgID0gZGVmaW5lUHJvcGVydGllcztcbiAgJC5nZXROYW1lcyAgID0gJG5hbWVzLmdldCA9IGdldE93blByb3BlcnR5TmFtZXM7XG4gICQuZ2V0U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZigkLkRFU0MgJiYgJC5GVykkcmVkZWYoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsIHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCwnICtcbiAgICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbiAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gICAgdmFyIHN5bSA9IHJlcXVpcmUoJy4vJC53a3MnKShpdCk7XG4gICAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XG4gIH1cbik7XG5cbnNldHRlciA9IHRydWU7XG5cbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbiRkZWYoJGRlZi5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XG5cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6IGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiBkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoJC5nLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgd2VhayAgICAgID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpXG4gICwgbGVha1N0b3JlID0gd2Vhay5sZWFrU3RvcmVcbiAgLCBJRCAgICAgICAgPSB3ZWFrLklEXG4gICwgV0VBSyAgICAgID0gd2Vhay5XRUFLXG4gICwgaGFzICAgICAgID0gJC5oYXNcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIHRtcCAgICAgICA9IHt9O1xuXG4vLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xudmFyICRXZWFrTWFwID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzWzBdKTsgfTtcbn0sIHtcbiAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICBpZihpc09iamVjdChrZXkpKXtcbiAgICAgIGlmKCFpc0V4dGVuc2libGUoa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmdldChrZXkpO1xuICAgICAgaWYoaGFzKGtleSwgV0VBSykpcmV0dXJuIGtleVtXRUFLXVt0aGlzW0lEXV07XG4gICAgfVxuICB9LFxuICAvLyAyMy4zLjMuNSBXZWFrTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIGtleSwgdmFsdWUpO1xuICB9XG59LCB3ZWFrLCB0cnVlLCB0cnVlKTtcblxuLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxuaWYobmV3ICRXZWFrTWFwKCkuc2V0KChPYmplY3QuZnJlZXplIHx8IE9iamVjdCkodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XG4gICQuZWFjaC5jYWxsKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIHByb3RvICA9ICRXZWFrTWFwLnByb3RvdHlwZVxuICAgICAgLCBtZXRob2QgPSBwcm90b1trZXldO1xuICAgIHJlcXVpcmUoJy4vJC5yZWRlZicpKHByb3RvLCBrZXksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gbGVha3kgbWFwXG4gICAgICBpZihpc09iamVjdChhKSAmJiAhaXNFeHRlbnNpYmxlKGEpKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxlYWtTdG9yZSh0aGlzKVtrZXldKGEsIGIpO1xuICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxuICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XG4gICAgfSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24td2VhaycpO1xuXG4vLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzWzBdKTsgfTtcbn0sIHtcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIHZhbHVlLCB0cnVlKTtcbiAgfVxufSwgd2VhaywgZmFsc2UsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkaW5jbHVkZXMgPSByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKSh0cnVlKTtcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb21lbmljL0FycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnaW5jbHVkZXMnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpOyIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vOTM1Mzc4MVxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBvd25LZXlzID0gcmVxdWlyZSgnLi8kLm93bi1rZXlzJyk7XG5cbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxuICAgICAgLCByZXN1bHQgPSB7fTtcbiAgICAkLmVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xuICAgICAgJC5zZXREZXNjKHJlc3VsdCwga2V5LCAkLmRlc2MoMCwgJC5nZXREZXNjKE8sIGtleSkpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCIvLyBodHRwOi8vZ29vLmdsL1hrQnJqRFxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5mdW5jdGlvbiBjcmVhdGVPYmplY3RUb0FycmF5KGlzRW50cmllcyl7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcbiAgICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGkgICAgICA9IDBcbiAgICAgICwgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKVxuICAgICAgLCBrZXk7XG4gICAgaWYoaXNFbnRyaWVzKXdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gW2tleSA9IGtleXNbaSsrXSwgT1trZXldXTtcbiAgICBlbHNlIHdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gT1trZXlzW2krK11dO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcbiAgdmFsdWVzOiAgY3JlYXRlT2JqZWN0VG9BcnJheShmYWxzZSksXG4gIGVudHJpZXM6IGNyZWF0ZU9iamVjdFRvQXJyYXkodHJ1ZSlcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZW5qYW1pbmdyL1JleEV4cC5lc2NhcGVcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdSZWdFeHAnLCB7XG4gIGVzY2FwZTogcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoL1tcXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJywgdHJ1ZSlcbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4ndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgYXQ6IGZ1bmN0aW9uIGF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRwYWQgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIGxwYWQ6IGZ1bmN0aW9uIGxwYWQobil7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbiwgYXJndW1lbnRzWzFdLCB0cnVlKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcGFkID0gcmVxdWlyZSgnLi8kLnN0cmluZy1wYWQnKTtcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICBycGFkOiBmdW5jdGlvbiBycGFkKG4pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG4sIGFyZ3VtZW50c1sxXSwgZmFsc2UpO1xuICB9XG59KTsiLCIvLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkQXJyYXkgID0gJC5jb3JlLkFycmF5IHx8IEFycmF5XG4gICwgc3RhdGljcyA9IHt9O1xuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xuICAkLmVhY2guY2FsbChrZXlzLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gICAgaWYobGVuZ3RoID09IHVuZGVmaW5lZCAmJiBrZXkgaW4gJEFycmF5KXN0YXRpY3Nba2V5XSA9ICRBcnJheVtrZXldO1xuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xuICB9KTtcbn1cbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcbnNldFN0YXRpY3MoJ2luZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMnLCAzKTtcbnNldFN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xuJGRlZigkZGVmLlMsICdBcnJheScsIHN0YXRpY3MpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcbiAgLCBJVEVSQVRPUiAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5XG4gICwgTkwgICAgICAgICAgPSAkLmcuTm9kZUxpc3RcbiAgLCBIVEMgICAgICAgICA9ICQuZy5IVE1MQ29sbGVjdGlvblxuICAsIE5MUHJvdG8gICAgID0gTkwgJiYgTkwucHJvdG90eXBlXG4gICwgSFRDUHJvdG8gICAgPSBIVEMgJiYgSFRDLnByb3RvdHlwZTtcbmlmKCQuRlcpe1xuICBpZihOTCAmJiAhKElURVJBVE9SIGluIE5MUHJvdG8pKSQuaGlkZShOTFByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICBpZihIVEMgJiYgIShJVEVSQVRPUiBpbiBIVENQcm90bykpJC5oaWRlKEhUQ1Byb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xufVxuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gQXJyYXlWYWx1ZXM7IiwidmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHRhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpO1xuJGRlZigkZGVmLkcgKyAkZGVmLkIsIHtcbiAgc2V0SW1tZWRpYXRlOiAgICR0YXNrLnNldCxcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXG59KTsiLCIvLyBpZTktIHNldFRpbWVvdXQgJiBzZXRJbnRlcnZhbCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZml4XG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpbnZva2UgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBwYXJ0aWFsICAgPSByZXF1aXJlKCcuLyQucGFydGlhbCcpXG4gICwgbmF2aWdhdG9yID0gJC5nLm5hdmlnYXRvclxuICAsIE1TSUUgICAgICA9ICEhbmF2aWdhdG9yICYmIC9NU0lFIC5cXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcbmZ1bmN0aW9uIHdyYXAoc2V0KXtcbiAgcmV0dXJuIE1TSUUgPyBmdW5jdGlvbihmbiwgdGltZSAvKiwgLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIHNldChpbnZva2UoXG4gICAgICBwYXJ0aWFsLFxuICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgJC5pc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pXG4gICAgKSwgdGltZSk7XG4gIH0gOiBzZXQ7XG59XG4kZGVmKCRkZWYuRyArICRkZWYuQiArICRkZWYuRiAqIE1TSUUsIHtcbiAgc2V0VGltZW91dDogIHdyYXAoJC5nLnNldFRpbWVvdXQpLFxuICBzZXRJbnRlcnZhbDogd3JhcCgkLmcuc2V0SW50ZXJ2YWwpXG59KTsiLCJyZXF1aXJlKCcuL21vZHVsZXMvZXM1Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5pcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuZnVuY3Rpb24uaGFzLWluc3RhbmNlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3RvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5mcm9tLWNvZGUtcG9pbnQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJhdycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5vZicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbGwnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1tYXAnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcuYXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmxwYWQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLnJwYWQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QudG8tYXJyYXknKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9qcy5hcnJheS5zdGF0aWNzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLnRpbWVycycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5pbW1lZGlhdGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbW9kdWxlcy8kJykuY29yZTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID1cbiAgICB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKFxuICAgICAgaW5uZXJGbiwgc2VsZiB8fCBudWxsLFxuICAgICAgbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pXG4gICAgKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50YCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4gU29tZSBtYXkgY29uc2lkZXIgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgdG9vXG4gIC8vIGN1dGVzeSwgYnV0IHRoZXkgYXJlIGN1cm11ZGdlb25zLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIG5ldyBBd2FpdEFyZ3VtZW50KGFyZyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gQXdhaXRBcmd1bWVudChhcmcpIHtcbiAgICB0aGlzLmFyZyA9IGFyZztcbiAgfVxuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgLy8gVGhpcyBpbnZva2UgZnVuY3Rpb24gaXMgd3JpdHRlbiBpbiBhIHN0eWxlIHRoYXQgYXNzdW1lcyBzb21lXG4gICAgLy8gY2FsbGluZyBmdW5jdGlvbiAob3IgUHJvbWlzZSkgd2lsbCBoYW5kbGUgZXhjZXB0aW9ucy5cbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSBnZW5lcmF0b3JbbWV0aG9kXShhcmcpO1xuICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXdhaXRBcmd1bWVudFxuICAgICAgICA/IFByb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oaW52b2tlTmV4dCwgaW52b2tlVGhyb3cpXG4gICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9LCBpbnZva2VUaHJvdyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIGludm9rZU5leHQgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwibmV4dFwiKTtcbiAgICB2YXIgaW52b2tlVGhyb3cgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgdmFyIGludm9rZVJldHVybiA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJyZXR1cm5cIik7XG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIHZhciBlbnF1ZXVlUmVzdWx0ID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBpbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgICB9KSA6IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICByZXNvbHZlKGludm9rZShtZXRob2QsIGFyZykpO1xuICAgICAgICB9KTtcblxuICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZW5xdWV1ZVJlc3VsdCBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieVxuICAgICAgLy8gbGF0ZXIgaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLCBhbmQgY2FsbCBnZW5lcmF0b3IucmV0dXJuKCkgdG9cbiAgICAgIC8vIGFsbG93IHRoZSBnZW5lcmF0b3IgYSBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPSBlbnF1ZXVlUmVzdWx0W1wiY2F0Y2hcIl0oaW52b2tlUmV0dXJuKTtcblxuICAgICAgcmV0dXJuIGVucXVldWVSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiIHx8XG4gICAgICAgICAgICAgIChtZXRob2QgPT09IFwidGhyb3dcIiAmJiBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAvLyBBIHJldHVybiBvciB0aHJvdyAod2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIHRocm93XG4gICAgICAgICAgICAvLyBtZXRob2QpIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgICB2YXIgcmV0dXJuTWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl07XG4gICAgICAgICAgICBpZiAocmV0dXJuTWV0aG9kKSB7XG4gICAgICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChyZXR1cm5NZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuICAgICAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXR1cm4gbWV0aG9kIHRocmV3IGFuIGV4Y2VwdGlvbiwgbGV0IHRoYXRcbiAgICAgICAgICAgICAgICAvLyBleGNlcHRpb24gcHJldmFpbCBvdmVyIHRoZSBvcmlnaW5hbCByZXR1cm4gb3IgdGhyb3cuXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBvdXRlciByZXR1cm4sIG5vdyB0aGF0IHRoZSBkZWxlZ2F0ZVxuICAgICAgICAgICAgICAvLyBpdGVyYXRvciBoYXMgYmVlbiB0ZXJtaW5hdGVkLlxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goXG4gICAgICAgICAgICBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdLFxuICAgICAgICAgICAgZGVsZWdhdGUuaXRlcmF0b3IsXG4gICAgICAgICAgICBhcmdcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBMaWtlIHJldHVybmluZyBnZW5lcmF0b3IudGhyb3codW5jYXVnaHQpLCBidXQgd2l0aG91dCB0aGVcbiAgICAgICAgICAgIC8vIG92ZXJoZWFkIG9mIGFuIGV4dHJhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGVsZWdhdGUgZ2VuZXJhdG9yIHJhbiBhbmQgaGFuZGxlZCBpdHMgb3duIGV4Y2VwdGlvbnMgc29cbiAgICAgICAgICAvLyByZWdhcmRsZXNzIG9mIHdoYXQgdGhlIG1ldGhvZCB3YXMsIHdlIGNvbnRpbnVlIGFzIGlmIGl0IGlzXG4gICAgICAgICAgLy8gXCJuZXh0XCIgd2l0aCBhbiB1bmRlZmluZWQgYXJnLlxuICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcbiAgICAgICAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkWWllbGQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IGFyZztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbnRleHQuc2VudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuZGVsZWdhdGUgJiYgbWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgdGhpcy5zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIC8vIFByZS1pbml0aWFsaXplIGF0IGxlYXN0IDIwIHRlbXBvcmFyeSB2YXJpYWJsZXMgdG8gZW5hYmxlIGhpZGRlblxuICAgICAgLy8gY2xhc3Mgb3B0aW1pemF0aW9ucyBmb3Igc2ltcGxlIGdlbmVyYXRvcnMuXG4gICAgICBmb3IgKHZhciB0ZW1wSW5kZXggPSAwLCB0ZW1wTmFtZTtcbiAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgdGVtcE5hbWUgPSBcInRcIiArIHRlbXBJbmRleCkgfHwgdGVtcEluZGV4IDwgMjA7XG4gICAgICAgICAgICsrdGVtcEluZGV4KSB7XG4gICAgICAgIHRoaXNbdGVtcE5hbWVdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbiAgLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4gIC8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpc1xuKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL2JhYmVsL3BvbHlmaWxsXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtY29yZS9wb2x5ZmlsbFwiKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdGh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ub2RlLWd3MlxyXG4qICAgaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6TWFpblxyXG4qXHJcblxyXG4qL1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cdGNvbG9yczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YyL2NvbG9ycycsXHRcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvY29sb3JzXHJcblx0Z3VpbGREZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2d1aWxkX2RldGFpbHNcclxuXHJcblx0aXRlbXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9pdGVtcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbXNcclxuXHRpdGVtRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tdjEvaXRlbV9kZXRhaWxzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtX2RldGFpbHNcclxuXHRyZWNpcGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlcy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZXNcclxuXHRyZWNpcGVEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVfZGV0YWlsc1xyXG5cclxuXHRtYXBOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9uYW1lcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfbmFtZXNcclxuXHRjb250aW5lbnRzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvY29udGluZW50cy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvY29udGluZW50c1xyXG5cdG1hcHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBzLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBzXHJcblx0bWFwRmxvb3I6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfZmxvb3IuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX2Zsb29yXHJcblxyXG5cdG9iamVjdGl2ZU5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L29iamVjdGl2ZV9uYW1lcy5qc29uJyxcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoZXNcclxuXHRtYXRjaGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoX2RldGFpbHNcclxuXHRtYXRjaERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hfZGV0YWlscy5qc29uJyxcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvb2JqZWN0aXZlX25hbWVzXHJcblxyXG5cdG1hdGNoZXNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tL21hdGNoZXMnLFxyXG5cdG1hdGNoRGV0YWlsc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vJyxcclxufTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFVCTElDIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRXT1JMRCB2cyBXT1JMRFxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ29iamVjdGl2ZU5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ21hdGNoZXMnLCB7fSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHR2YXIgd3Z3X21hdGNoZXMgPSAoZGF0YSAmJiBkYXRhLnd2d19tYXRjaGVzKSA/IGRhdGEud3Z3X21hdGNoZXMgOiBbXTtcclxuXHRcdGNhbGxiYWNrKGVyciwgd3Z3X21hdGNoZXMpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHR0aHJvdyAoJ21hdGNoX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWF0Y2hEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzLm1hdGNoZXNTdGF0ZTtcclxuXHJcblx0aWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAoJycgKyBwYXJhbXMubWF0Y2hfaWQpO1xyXG5cdH1cclxuXHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWQgfHwgd29ybGRfc2x1Z1xyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHMubWF0Y2hEZXRhaWxzU3RhdGU7XHJcblxyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkICYmICFwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgbWF0Y2hfaWQgb3Igd29ybGRfc2x1ZyBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gcGFyYW1zLm1hdGNoX2lkO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnd29ybGQvJyArIHBhcmFtcy53b3JsZF9zbHVnO1xyXG5cdH1cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRHRU5FUkFMXHJcbiovXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmcsIGlkc1xyXG5mdW5jdGlvbiBnZXRXb3JsZE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdGlmICghcGFyYW1zLmlkcykge1xyXG5cdFx0cGFyYW1zLmlkcyA9ICdhbGwnO1xyXG5cdH1cclxuXHRlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5pZHMpKSB7XHJcblx0XHRwYXJhbXMuaWRzID0gcGFyYW1zLmlkcy5qb2luKCcsJyk7XHJcblx0fVxyXG5cdGdldCgnd29ybGROYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBndWlsZF9pZCB8fCBndWlsZF9uYW1lIChpZCB0YWtlcyBwcmlvcml0eSlcclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5ndWlsZF9pZCAmJiAhcGFyYW1zLmd1aWxkX25hbWUpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIGd1aWxkX2lkIG9yIGd1aWxkX25hbWUgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblxyXG5cdGdldCgnZ3VpbGREZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0SVRFTVNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRJdGVtcyhjYWxsYmFjaykge1xyXG5cdGdldCgnaXRlbXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGl0ZW1faWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0SXRlbURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLml0ZW1faWQpIHtcclxuXHRcdHRocm93ICgnaXRlbV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ2l0ZW1EZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0UmVjaXBlcyhjYWxsYmFjaykge1xyXG5cdGdldCgncmVjaXBlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIFJFUVVJUkVEOiByZWNpcGVfaWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0UmVjaXBlRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMucmVjaXBlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ3JlY2lwZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ3JlY2lwZURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNQVAgSU5GT1JNQVRJT05cclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0Q29udGluZW50cyhjYWxsYmFjaykge1xyXG5cdGdldCgnY29udGluZW50cycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWFwX2lkLCBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBjb250aW5lbnRfaWQsIGZsb29yXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcEZsb29yKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5jb250aW5lbnRfaWQpIHtcclxuXHRcdHRocm93ICgnY29udGluZW50X2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmxvb3IpIHtcclxuXHRcdHRocm93ICgnZmxvb3IgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXBGbG9vcicsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TWlzY2VsbGFuZW91c1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEJ1aWxkKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdidWlsZCcsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRDb2xvcnMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRpZiAoIXBhcmFtcy5pZHMpIHtcclxuXHRcdHBhcmFtcy5pZHMgPSAnYWxsJztcclxuXHR9XHJcblx0Z2V0KCdjb2xvcnMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG4vLyB0byBnZXQgZmlsZXM6IGh0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUve3NpZ25hdHVyZX0ve2ZpbGVfaWR9Lntmb3JtYXR9XHJcbmZ1bmN0aW9uIGdldEZpbGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdmaWxlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgVVRJTElUWSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcblxyXG4vLyBTUEVDSUFMIENBU0VcclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChnZXRGaWxlUmVuZGVyVXJsKHBhcmFtcykpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGVSZW5kZXJVcmwocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyVXJsID0gKFxyXG5cdFx0J2h0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvJ1xyXG5cdFx0KyBwYXJhbXMuc2lnbmF0dXJlXHJcblx0XHQrICcvJ1xyXG5cdFx0KyBwYXJhbXMuZmlsZV9pZFxyXG5cdFx0KyAnLidcclxuXHRcdCsgcGFyYW1zLmZvcm1hdFxyXG5cdCk7XHJcblx0cmV0dXJuIHJlbmRlclVybDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXQoa2V5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuXHR2YXIgYXBpVXJsID0gZ2V0QXBpVXJsKGtleSwgcGFyYW1zKTtcclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LmdldChhcGlVcmwpXHJcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRjYWxsYmFjayhlcnIsIHBhcnNlSnNvbihkYXRhLnRleHQpKTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHRyZXF1ZXN0VXJsID0gKGVuZFBvaW50c1tyZXF1ZXN0VXJsXSlcclxuXHRcdD8gZW5kUG9pbnRzW3JlcXVlc3RVcmxdXHJcblx0XHQ6IHJlcXVlc3RVcmw7XHJcblxyXG5cdHZhciBxdWVyeSA9IHFzLnN0cmluZ2lmeShwYXJhbXMpO1xyXG5cclxuXHRpZiAocXVlcnkubGVuZ3RoKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICc/JyArIHF1ZXJ5O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlcXVlc3RVcmw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUpzb24oZGF0YSkge1xyXG5cdHZhciByZXN1bHRzO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0cmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblx0fVxyXG5cdGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290ID0gJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHdpbmRvd1xuICA/ICh0aGlzIHx8IHNlbGYpXG4gIDogd2luZG93O1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgICAmJiAoIXJvb3QubG9jYXRpb24gfHwgJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sXG4gICAgICAgICAgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcblxuICAgIHNlbGYuY2FsbGJhY2soZXJyIHx8IG5ld19lcnIsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcyl7XG4gIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQoZmllbGQsIGZpbGUsIGZpbGVuYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgLCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIHF1ZXJ5c3RyaW5nXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbXVsdGlwbGUgZGF0YSBcIndyaXRlc1wiXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5zZW5kKHsgc2VhcmNoOiAncXVlcnknIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgcmFuZ2U6ICcxLi41JyB9KVxuICogICAgICAgICAuc2VuZCh7IG9yZGVyOiAnZGVzYycgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAgKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IGlzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ09yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplW3RoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKV07XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG4gIHhoci5zZW5kKGRhdGEpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZGVsID0gZnVuY3Rpb24odXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogXCIxXCIsIFwiZW5cIjogXCJPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmVcIiwgXCJlc1wiOiBcIk1pcmFkb3JcIiwgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiBcIjJcIiwgXCJlblwiOiBcIlZhbGxleVwiLCBcImZyXCI6IFwiVmFsbMOpZVwiLCBcImVzXCI6IFwiVmFsbGVcIiwgXCJkZVwiOiBcIlRhbFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogXCIzXCIsIFwiZW5cIjogXCJMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlc1wiLCBcImVzXCI6IFwiVmVnYVwiLCBcImRlXCI6IFwiVGllZmxhbmRcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IFwiNFwiLCBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLCBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCIsIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiBcIjVcIiwgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIiwgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIiwgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLCBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogXCI2XCIsIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIiwgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsIFwiZGVcIjogXCJTcGVsZGFuIEthaGxzY2hsYWdcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IFwiN1wiLCBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIiwgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IFwiOFwiLCBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLCBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIiwgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIiwgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IFwiOVwiLCBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLCBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIiwgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLCBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogXCIxMFwiLCBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIiwgXCJmclwiOiBcIkNhcnJpw6hyZSBkZXMgdm9sZXVyc1wiLCBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLCBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IFwiMTFcIiwgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIiwgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIiwgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIiwgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiBcIjEyXCIsIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsIFwiZnJcIjogXCJQaXN0ZSBkdSBSdWlzc2VhdSBzYXV2YWdlXCIsIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsIFwiZGVcIjogXCJXaWxkYmFjaHN0cmVja2VcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiBcIjEzXCIsIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLCBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIiwgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIiwgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiBcIjE0XCIsIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIiwgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiLCBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiBcIjE1XCIsIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiLCBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsIFwiZGVcIjogXCJMYW5nb3IgLSBTY2hsdWNodFwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IFwiMTZcIiwgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLCBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIiwgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLCBcImRlXCI6IFwiUXVlbnRpbnNlZVwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IFwiMTdcIiwgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLCBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiLCBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogXCIxOFwiLCBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLCBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIiwgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIiwgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiBcIjE5XCIsIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCIsIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIiwgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IFwiMjBcIiwgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCIsIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IFwiMjFcIiwgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIiwgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IFwiMjJcIiwgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLCBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCIsIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IFwiMjNcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogXCIyNFwiLCBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lbnNlXCIsIFwiZnJcIjogXCJGaWVmIGR1IGNoYW1waW9uXCIsIFwiZXNcIjogXCJEb21pbmlvIGRlbCBDYW1wZcOzblwiLCBcImRlXCI6IFwiTGFuZGd1dCBkZXMgQ2hhbXBpb25zXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogXCIyNVwiLCBcImVuXCI6IFwiUmVkYnJpYXJcIiwgXCJmclwiOiBcIkJydXllcm91Z2VcIiwgXCJlc1wiOiBcIlphcnphcnJvamFcIiwgXCJkZVwiOiBcIlJvdGRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogXCIyNlwiLCBcImVuXCI6IFwiR3JlZW5sYWtlXCIsIFwiZnJcIjogXCJMYWMgVmVydFwiLCBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnNlZVwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IFwiMjdcIiwgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIiwgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsIFwiZGVcIjogXCJCdWNodCBkZXMgQXVmc3RpZWdzXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogXCIyOFwiLCBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsIFwiZnJcIjogXCJQcm9tb250b2lyZSBkZSBsJ2F1YmVcIiwgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZGFtbWVydW5nXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogXCIyOVwiLCBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsIFwiZnJcIjogXCJMJ2FudHJlIGRlcyBlc3ByaXRzXCIsIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLCBcImRlXCI6IFwiRGVyIEdlaXN0ZXJob2xtXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogXCIzMFwiLCBcImVuXCI6IFwiV29vZGhhdmVuXCIsIFwiZnJcIjogXCJHZW50ZXN5bHZlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsIFwiZGVcIjogXCJXYWxkIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogXCIzMVwiLCBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIiwgXCJkZVwiOiBcIkFza2FsaW9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogXCIzMlwiLCBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIiwgXCJkZVwiOiBcIkV0aGVyb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiBcIjMzXCIsIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiLCBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogXCIzNFwiLCBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IHZhaW5xdWV1clwiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsIFwiZGVcIjogXCJTaWVnZXIgLSBIw7x0dGVcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiBcIjM1XCIsIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsIFwiZnJcIjogXCJWZXJ0ZWJyYW5jaGVcIiwgXCJlc1wiOiBcIlphcnphdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IFwiMzZcIiwgXCJlblwiOiBcIkJsdWVsYWtlXCIsIFwiZnJcIjogXCJMYWMgYmxldVwiLCBcImVzXCI6IFwiTGFnb2F6dWxcIiwgXCJkZVwiOiBcIkJsYXVzZWVcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiBcIjM3XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IFwiMzhcIiwgXCJlblwiOiBcIkxvbmd2aWV3XCIsIFwiZnJcIjogXCJMb25ndWV2dWVcIiwgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsIFwiZGVcIjogXCJXZWl0c2ljaHRcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiBcIjM5XCIsIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIiwgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCIsIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLCBcImRlXCI6IFwiRGFzIEdvdHRzY2h3ZXJ0XCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogXCI0MFwiLCBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCIsIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIiwgXCJkZVwiOiBcIkZlbHN3YW5kXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogXCI0MVwiLCBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGRlIFNoYWRhcmFuXCIsIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsIFwiZGVcIjogXCJTaGFkYXJhbiBIw7xnZWxcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiBcIjQyXCIsIFwiZW5cIjogXCJSZWRsYWtlXCIsIFwiZnJcIjogXCJSb3VnZWxhY1wiLCBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsIFwiZGVcIjogXCJSb3RzZWVcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiBcIjQzXCIsIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLCBcImRlXCI6IFwiSMO8dHRlIGRlcyBIZWxkZW5cIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiBcIjQ0XCIsIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiLCBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLCBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwgLSBCdWNodFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IFwiNDVcIiwgXCJlblwiOiBcIkJsdWVicmlhclwiLCBcImZyXCI6IFwiQnJ1eWF6dXJcIiwgXCJlc1wiOiBcIlphcnphenVsXCIsIFwiZGVcIjogXCJCbGF1ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiBcIjQ2XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IFwiNDdcIiwgXCJlblwiOiBcIlN1bm55aGlsbFwiLCBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIiwgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsIFwiZGVcIjogXCJTb25uZW5saWNodGjDvGdlbFwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IFwiNDhcIiwgXCJlblwiOiBcIkZhaXRobGVhcFwiLCBcImZyXCI6IFwiRmVydmV1clwiLCBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIiwgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogXCI0OVwiLCBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgYmxldXZhbFwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IFwiNTBcIiwgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IFwiNTFcIiwgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZnJcIjogXCJBc3RyYWxob2xtZVwiLCBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLCBcImRlXCI6IFwiQXN0cmFsaG9sbVwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IFwiNTJcIiwgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCIsIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLCBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiBcIjUzXCIsIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiLCBcImVzXCI6IFwiUmVmdWdpbyBkZSBWYWxsZXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogXCI1NFwiLCBcImVuXCI6IFwiRm9naGF2ZW5cIiwgXCJmclwiOiBcIkhhdnJlIGdyaXNcIiwgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsIFwiZGVcIjogXCJOZWJlbCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IFwiNTVcIiwgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsIFwiZGVcIjogXCJSb3R3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IFwiNTZcIiwgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLCBcImZyXCI6IFwiQnJhcyBkdSB0aXRhblwiLCBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLCBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiBcIjU3XCIsIFwiZW5cIjogXCJDcmFndG9wXCIsIFwiZnJcIjogXCJTb21tZXQgZGUgbCdlc2NhcnBlbWVudFwiLCBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIiwgXCJkZVwiOiBcIkZlbHNlbnNwaXR6ZVwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IFwiNThcIiwgXCJlblwiOiBcIkdvZHNsb3JlXCIsIFwiZnJcIjogXCJEaXZpbmF0aW9uXCIsIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIiwgXCJkZVwiOiBcIkfDtnR0ZXJrdW5kZVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IFwiNTlcIiwgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVyb2pvXCIsIFwiZGVcIjogXCJSb3R0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IFwiNjBcIiwgXCJlblwiOiBcIlN0YXJncm92ZVwiLCBcImZyXCI6IFwiQm9zcXVldCBzdGVsbGFpcmVcIiwgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIiwgXCJkZVwiOiBcIlN0ZXJuZW5oYWluXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogXCI2MVwiLCBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG53YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IFwiNjJcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiBcIjYzXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogXCI2NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IFwiNjVcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogXCI2NlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IFwiNjdcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiBcIjY4XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IFwiNjlcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiBcIjcwXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogXCI3MVwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IFwiNzJcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiBcIjczXCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IFwiNzRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiBcIjc1XCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogXCI3NlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0XCJrZXlcIjogXCJDZW50ZXJcIixcclxuXHRcdFwibmFtZVwiOiBcIkV0ZXJuYWwgQmF0dGxlZ3JvdW5kc1wiLFxyXG5cdFx0XCJhYmJyXCI6IFwiRUJHXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcImNvbG9yXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJDYXN0bGVcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzldLCBcdFx0XHRcdFx0XHRcdFx0Ly8gc21cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJSZWQgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzEsIDE3LCAyMCwgMTgsIDE5LCA2LCA1XSxcdFx0Ly8gb3Zlcmxvb2ssIG1lbmRvbnMsIHZlbG9rYSwgYW56LCBvZ3JlLCBzcGVsZGFuLCBwYW5nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQmx1ZSBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIsIDE1LCAyMiwgMTYsIDIxLCA3LCA4XVx0XHRcdC8vIHZhbGxleSwgbGFuZ29yLCBicmF2b3N0LCBxdWVudGluLCBkdXJpb3MsIGRhbmUsIHVtYmVyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiR3JlZW4gQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMywgMTEsIDEzLCAxMiwgMTQsIDEwLCA0XSBcdFx0Ly8gbG93bGFuZHMsIGFsZG9ucywgamVycmlmZXIsIHdpbGRjcmVlaywga2xvdmFuLCByb2d1ZXMsIGdvbGFudGFcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiUmVkXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcImNvbG9yXCI6IFwicmVkXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzgsIDQwLCAzOSwgNTIsIDUxXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM1LCAzNiwgMzQsIDUzLCA1MF0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs2MiwgNjMsIDY0LCA2NSwgNjZdIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiQmx1XCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDIsXHJcblx0XHRcImNvbG9yXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjMsIDI3LCAzMV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMwLCAyOCwgMjksIDU4LCA2MF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjUsIDI2LCAyNCwgNTksIDYxXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBjaGFtcCwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzcxLCA3MCwgNjksIDY4LCA2N10gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkdyblwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJjb2xvclwiOiBcImdyZWVuXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDYsIDQ0LCA0MV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NywgNTcsIDU2LCA0OCwgNTRdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ1LCA0MiwgNDMsIDQ5LCA1NV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3NiAsIDc1ICwgNzQgLCA3MyAsIDcyIF0gXHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF1cclxuXHR9LFxyXG5dO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQvL1x0RUJHXHJcblx0XCI5XCI6XHR7XCJ0eXBlXCI6IDEsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDAsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFN0b25lbWlzdCBDYXN0bGVcclxuXHJcblx0Ly9cdFJlZCBDb3JuZXJcclxuXHRcIjFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gUmVkIEtlZXAgLSBPdmVybG9va1xyXG5cdFwiMTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gTWVuZG9uJ3MgR2FwXHJcblx0XCIyMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBWZWxva2EgU2xvcGVcclxuXHRcIjE4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIEFuemFsaWFzIFBhc3NcclxuXHRcIjE5XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIE9ncmV3YXRjaCBDdXRcclxuXHRcIjZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIENhbXAgLSBNaWxsIC0gU3BlbGRhblxyXG5cdFwiNVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgQ2FtcCAtIE1pbmUgLSBQYW5nbG9zc1xyXG5cclxuXHQvL1x0Qmx1ZSBDb3JuZXJcclxuXHRcIjJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBLZWVwIC0gVmFsbGV5XHJcblx0XCIxNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gTGFuZ29yIEd1bGNoXHJcblx0XCIyMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gQnJhdm9zdCBFc2NhcnBtZW50XHJcblx0XCIxNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gUXVlbnRpbiBMYWtlXHJcblx0XCIyMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gRHVyaW9zIEd1bGNoXHJcblx0XCI3XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbmUgLSBEYW5lbG9uXHJcblx0XCI4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbGwgLSBVbWJlcmdsYWRlXHJcblxyXG5cdC8vXHRHcmVlbiBDb3JuZXJcclxuXHRcIjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gS2VlcCAtIExvd2xhbmRzXHJcblx0XCIxMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIEFsZG9uc1xyXG5cdFwiMTNcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBKZXJyaWZlcidzIFNsb3VnaFxyXG5cdFwiMTJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBXaWxkY3JlZWtcclxuXHRcIjE0XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gS2xvdmFuIEd1bGx5XHJcblx0XCIxMFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBDYW1wIC0gTWluZSAtIFJvZ3VlcyBRdWFycnlcclxuXHRcIjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbGwgLSBHb2xhbnRhXHJcblxyXG5cclxuXHQvL1x0UmVkSG9tZVxyXG5cdFwiMzdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjMzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFtaW5nIEJheVxyXG5cdFwiMzJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBFdGhlcm9uIEhpbGxzXHJcblx0XCIzOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIExvbmd2aWV3XHJcblx0XCI0MFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENsaWZmc2lkZVxyXG5cdFwiMzlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgR29kc3dvcmRcclxuXHRcIjUyXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gQXJhaCdzIEhvcGVcclxuXHRcIjUxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gQXN0cmFsaG9sbWVcclxuXHJcblx0XCIzNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEdyZWVuYnJpYXJcclxuXHRcIjM2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gQmx1ZWxha2VcclxuXHRcIjM0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gVmljdG9yJ3MgTG9kZ2VcclxuXHRcIjUzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEdyZWVudmFsZSBSZWZ1Z2VcclxuXHRcIjUwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBCbHVld2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRHcmVlbkhvbWVcclxuXHRcIjQ2XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCI0NFwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhZGZhbGwgQmF5XHJcblx0XCI0MVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIFNoYWRhcmFuIEhpbGxzXHJcblx0XCI0N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFN1bm55aGlsbFxyXG5cdFwiNTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDcmFndG9wXHJcblx0XCI1NlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBUaXRhbnBhd1xyXG5cdFwiNDhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBGYWl0aGxlYXBcclxuXHRcIjU0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gRm9naGF2ZW5cclxuXHJcblx0XCI0NVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEJsdWVicmlhclxyXG5cdFwiNDJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBSZWRsYWtlXHJcblx0XCI0M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIEhlcm8ncyBMb2RnZVxyXG5cdFwiNDlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gQmx1ZXZhbGUgUmVmdWdlXHJcblx0XCI1NVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gUmVkd2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRCbHVlSG9tZVxyXG5cdFwiMjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjI3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIEFzY2Vuc2lvbiBCYXlcclxuXHRcIjMxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gQXNrYWxpb24gSGlsbHNcclxuXHRcIjMwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gV29vZGhhdmVuXHJcblx0XCIyOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIERhd24ncyBFeXJpZVxyXG5cdFwiMjlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgU3Bpcml0aG9sbWVcclxuXHRcIjU4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gR29kc2xvcmVcclxuXHRcIjYwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gU3Rhcmdyb3ZlXHJcblxyXG5cdFwiMjVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBSZWRicmlhclxyXG5cdFwiMjZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBHcmVlbmxha2VcclxuXHRcIjI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gQ2hhbXBpb24ncyBEZW1lbnNlXHJcblx0XCI1OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBSZWR2YWxlIFJlZnVnZVxyXG5cdFwiNjFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEdyZWVud2F0ZXIgTG93bGFuZHNcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwibmFtZVwiOiBcIkdyZWVuIE1pbGxcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwibmFtZVwiOiBcIlJlZCBNaW5lXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcIm5hbWVcIjogXCJSZWQgTWlsbFwifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJuYW1lXCI6IFwiQmx1ZSBNaW5lXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcIm5hbWVcIjogXCJCbHVlIE1pbGxcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwibmFtZVwiOiBcIkNhc3RsZVwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IDEwLCBcIm5hbWVcIjogXCJHcmVlbiBNaW5lXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogMTEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogMTIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogMTMsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogMTQsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogMTUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogMTYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogMTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogMTgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogMTksIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogMjAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogMjEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogMjIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogMjMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiAyNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiAyNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IDI2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IDI3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogMjgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogMjksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiAzMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiAzMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IDMyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogMzMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiAzNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IDM1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IDM2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IDM3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogMzgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogMzksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiA0MCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiA0MSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IDQyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IDQzLCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogNDQsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiA0NSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiA0NiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IDQ3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IDQ4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiA0OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiA1MCwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogNTEsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogNTIsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IDUzLCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IDU0LCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IDU1LCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiA1NiwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IDU3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IDU4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiA1OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiA2MCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiA2MSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogNjIsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogNjMsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiA2NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogNjUsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogNjYsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiA2NywgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IDY4LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IDY5LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiA3MCwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IDcxLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IDcyLCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogNzMsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogNzQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IDc1LCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogNzYsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMzUsIFwibmFtZVwiOiBcImNhc3RsZVwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDI1LCBcIm5hbWVcIjogXCJrZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMTAsIFwibmFtZVwiOiBcInRvd2VyXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogNSwgXCJuYW1lXCI6IFwiY2FtcFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcInRlbXBsZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImhvbGxvd1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImVzdGF0ZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcIm92ZXJsb29rXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiYXNjZW50XCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0bGFuZ3M6IHJlcXVpcmUoJy4vZGF0YS9sYW5ncycpLFxyXG5cdHdvcmxkczogcmVxdWlyZSgnLi9kYXRhL3dvcmxkX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX25hbWVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX3R5cGVzJyksXHJcblx0b2JqZWN0aXZlX21ldGE6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWV0YScpLFxyXG5cdG9iamVjdGl2ZV9sYWJlbHM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbGFiZWxzJyksXHJcblx0b2JqZWN0aXZlX21hcDogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tYXAnKSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoV29ybGQgPSByZXF1aXJlKCcuL01hdGNoV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXRjaCA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyksIG5leHRQcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpKTtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzdGFydFRpbWUnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc3RhcnRUaW1lJykpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdTY29yZXMgfHwgbmV3TWF0Y2ggfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2g6OnJlbmRlcigpJywgcHJvcHMubWF0Y2gudG9KUygpKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd29ybGRDb2xvcnMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1hdGNoQ29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJtYXRjaFwiPjx0Ym9keT5cclxuICAgICAgICAgICAgICAgIHt3b3JsZENvbG9ycy5tYXAoKGNvbG9yLCBpeENvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRJZCAgPSBwcm9wcy5tYXRjaC5nZXQod29ybGRLZXkpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGQgICAgPSBwcm9wcy53b3JsZHMuZ2V0KHdvcmxkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3JlcyAgID0gcHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxNYXRjaFdvcmxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICd0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgID0ge3dvcmxkSWR9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZCAgICAgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyAgICA9IHtzY29yZXN9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgPSB7Y29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl4Q29sb3IgICA9IHtpeENvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93UGllICAgPSB7aXhDb2xvciA9PT0gMH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3Rib2R5PjwvdGFibGU+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWF0Y2gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBNYXRjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZSAgICAgPSByZXF1aXJlKCcuL1Njb3JlJyk7XHJcbmNvbnN0IFBpZSAgICAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9QaWUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB3b3JsZCAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgc2NvcmVzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBjb2xvciAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBpeENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBzaG93UGllOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICAgICAgY29uc3QgbmV3Q29sb3IgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld0NvbG9yIHx8IG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaFdvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld1Njb3JlcywgbmV3Q29sb3IsIG5ld1dvcmxkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG4gICAgICAgIHJldHVybiA8dHI+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtwcm9wcy5jb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9e3Byb3BzLndvcmxkLmdldCgnbGluaycpfT5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7cHJvcHMuY29sb3J9YH0+XHJcbiAgICAgICAgICAgICAgICA8U2NvcmVcclxuICAgICAgICAgICAgICAgICAgICB0ZWFtICA9IHtwcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICBzY29yZSA9IHtwcm9wcy5zY29yZXMuZ2V0KHByb3BzLml4Q29sb3IpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgeyhwcm9wcy5zaG93UGllKVxyXG4gICAgICAgICAgICAgICAgPyA8dGQgcm93U3Bhbj1cIjNcIiBjbGFzc05hbWU9XCJwaWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8UGllXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlcyA9IHtwcm9wcy5zY29yZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICA9IHs2MH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC90cj47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoV29ybGQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hdGNoV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuLy8gY29uc3QgJCAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2NvcmU6IDAsXHJcbn07XHJcblxyXG5jbGFzcyBTY29yZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBkaWZmOiAwLFxyXG4gICAgICAgICAgICAkZGlmZk5vZGU6IG51bGwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlmZjogbmV4dFByb3BzLnNjb3JlIC0gcHJvcHMuc2NvcmV9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZS5kaWZmICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVTY29yZURpZmYodGhpcy5zdGF0ZS4kZGlmZk5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIC8vIGNhY2hlIGpRdWVyeSBvYmplY3QgdG8gc3RhdGVcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgJGRpZmZOb2RlOiAkKCcuZGlmZicsIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPGRpdj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGlmZlwiIHJlZj1cImRpZmZcIj57Z2V0RGlmZlRleHQodGhpcy5zdGF0ZS5kaWZmKX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e2dldFNjb3JlVGV4dCh0aGlzLnByb3BzLnNjb3JlKX08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVNjb3JlRGlmZigkZWwpIHtcclxuICAgICRlbFxyXG4gICAgICAgIC52ZWxvY2l0eSgnc3RvcCcpXHJcbiAgICAgICAgLnZlbG9jaXR5KHtvcGFjaXR5OiAwfSwge2R1cmF0aW9uOiAwfSlcclxuICAgICAgICAudmVsb2NpdHkoe29wYWNpdHk6IDF9LCB7ZHVyYXRpb246IDIwMH0pXHJcbiAgICAgICAgLnZlbG9jaXR5KHtvcGFjaXR5OiAwfSwge2R1cmF0aW9uOiA4MDAsIGRlbGF5OiAxMDAwfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXREaWZmVGV4dChkaWZmKSB7XHJcbiAgICByZXR1cm4gKGRpZmYpXHJcbiAgICAgICAgPyBudW1lcmFsKGRpZmYpLmZvcm1hdCgnKzAsMCcpXHJcbiAgICAgICAgOiBudWxsO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2NvcmVUZXh0KHNjb3JlKSB7XHJcbiAgICByZXR1cm4gKHNjb3JlKVxyXG4gICAgICAgID8gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKVxyXG4gICAgICAgIDogbnVsbDtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5TY29yZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcblNjb3JlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcclxubW9kdWxlLmV4cG9ydHMgID0gU2NvcmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoICAgICA9IHJlcXVpcmUoJy4vTWF0Y2gnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8c3BhbiBzdHlsZT17e3BhZGRpbmdMZWZ0OiAnLjVlbSd9fT48aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPjwvc3Bhbj47XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgcmVnaW9uIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHMgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UmVnaW9uICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbiwgbmV4dFByb3BzLnJlZ2lvbik7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hlcyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoZXMsIG5leHRQcm9wcy5tYXRjaGVzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UmVnaW9uIHx8IG5ld01hdGNoZXMgfHwgbmV3V29ybGRzKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld1JlZ2lvbiwgbmV3TWF0Y2hlcywgbmV3V29ybGRzfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdyZWdpb24nLCBwcm9wcy5yZWdpb24udG9KUygpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ21hdGNoZXMnLCBwcm9wcy5tYXRjaGVzLnRvSlMoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICd3b3JsZHMnLCBwcm9wcy53b3JsZHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcbiAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAge3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IE1hdGNoZXNcclxuICAgICAgICAgICAgICAgICAgICB7IXByb3BzLm1hdGNoZXMuc2l6ZSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAge3Byb3BzLm1hdGNoZXMubWFwKG1hdGNoID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICA9IHttYXRjaC5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICdtYXRjaCdcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgICA9IHtwcm9wcy53b3JsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoICAgICA9IHttYXRjaH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hdGNoZXMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IE1hdGNoZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dvcmxkICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdXb3JsZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1dvcmxkOjpyZW5kZXInLCBwcm9wcy53b3JsZC50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+XHJcbiAgICAgICAgICAgICAgICB7cHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IFdvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkICAgICA9IHJlcXVpcmUoJy4vV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICByZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBXb3JsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbiAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSwgbmV4dFByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdSZWdpb24pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OlJlZ2lvbldvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld1JlZ2lvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Oldvcmxkczo6cmVuZGVyKCknLCBwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpLCBwcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKS50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlZ2lvbldvcmxkc1wiPlxyXG4gICAgICAgICAgICAgICAgPGgyPntwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBXb3JsZHM8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7cHJvcHMud29ybGRzLm1hcCh3b3JsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V29ybGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgID0ge3dvcmxkLmdldCgnaWQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkID0ge3dvcmxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuV29ybGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IFdvcmxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qICAgRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8qXHJcbiogICBEYXRhXHJcbiovXHJcblxyXG5jb25zdCBEQU8gPSByZXF1aXJlKCdsaWIvZGF0YS9vdmVydmlldycpO1xyXG5cclxuXHJcbi8qXHJcbiogICBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaGVzICAgICAgPSByZXF1aXJlKCcuL01hdGNoZXMnKTtcclxuY29uc3QgV29ybGRzICAgICAgID0gcmVxdWlyZSgnLi9Xb3JsZHMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICAgIC8qXHJcbiAgICAqXHJcbiAgICAqICAgICBSZWFjdCBMaWZlY3ljbGVcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyh7XHJcbiAgICAgICAgICAgIG9uTWF0Y2hEYXRhOiB0aGlzLm9uTWF0Y2hEYXRhLmJpbmQodGhpcyksXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICByZWdpb25zOiBJbW11dGFibGUuZnJvbUpTKHtcclxuICAgICAgICAgICAgICAgIDE6IHtsYWJlbDogJ05BJywgaWQ6ICcxJ30sXHJcbiAgICAgICAgICAgICAgICAyOiB7bGFiZWw6ICdFVScsIGlkOiAnMid9LFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbWF0Y2hlc0J5UmVnaW9uOiBJbW11dGFibGUuZnJvbUpTKHsxOiB7fSwgMjoge319KSxcclxuICAgICAgICAgICAgd29ybGRzQnlSZWdpb24gOiB0aGlzLmRhby5nZXRXb3JsZHNCeVJlZ2lvbihwcm9wcy5sYW5nKSwgLy8gSW1tdXRhYmxlLmZyb21KUyh7JzEnOiB7fSwgJzInOiB7fX0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hEYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hdGNoZXNCeVJlZ2lvbiwgbmV4dFN0YXRlLm1hdGNoZXNCeVJlZ2lvbik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3TWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld01hdGNoRGF0YX0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcpO1xyXG4gICAgICAgIC8vIHNldFdvcmxkcy5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5pbml0KHRoaXMucHJvcHMubGFuZyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGlmICghSW1tdXRhYmxlLmlzKG5leHRQcm9wcy5sYW5nLCB0aGlzLnByb3BzLmxhbmcpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkc0J5UmVnaW9uID0gdGhpcy5kYW8uZ2V0V29ybGRzQnlSZWdpb24obmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt3b3JsZHNCeVJlZ2lvbn0pO1xyXG5cclxuICAgICAgICAgICAgc2V0UGFnZVRpdGxlKG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRhby5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGlkPVwib3ZlcnZpZXdcIj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3RoaXMuc3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbiAgPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0ge3RoaXMuc3RhdGUubWF0Y2hlc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkcyAgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxociAvPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj57dGhpcy5zdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdvcmxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb24gPSB7cmVnaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZHMgPSB7dGhpcy5zdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX08L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBEYXRhIExpc3RlbmVyc1xyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBvbk1hdGNoRGF0YShtYXRjaERhdGEpIHtcclxuICAgICAgICBjb25zdCBuZXdNYXRjaGVzQnlSZWdpb24gPSB0aGlzLmRhby5nZXRNYXRjaGVzQnlSZWdpb24obWF0Y2hEYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBtYXRjaGVzQnlSZWdpb246IHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5tZXJnZURlZXAobmV3TWF0Y2hlc0J5UmVnaW9uKSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBEaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG4gICAgbGV0IHRpdGxlID0gWydndzJ3MncuY29tJ107XHJcblxyXG4gICAgaWYgKGxhbmcuZ2V0KCdzbHVnJykgIT09ICdlbicpIHtcclxuICAgICAgICB0aXRsZS5wdXNoKGxhbmcuZ2V0KCduYW1lJykpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk92ZXJ2aWV3LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgID0gT3ZlcnZpZXc7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcbiAgICBlbGFwc2VkICA6IHRydWUsXHJcbiAgICB0aW1lc3RhbXA6IHRydWUsXHJcbiAgICBtYXBBYmJyZXY6IHRydWUsXHJcbiAgICBhcnJvdyAgICA6IHRydWUsXHJcbiAgICBzcHJpdGUgICA6IHRydWUsXHJcbiAgICBuYW1lICAgICA6IHRydWUsXHJcbiAgICBldmVudFR5cGU6IGZhbHNlLFxyXG4gICAgZ3VpbGROYW1lOiBmYWxzZSxcclxuICAgIGd1aWxkVGFnIDogZmFsc2UsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBHdWlsZENsYWltcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdDbGFpbXMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSwgbmV4dFByb3BzLmd1aWxkLmdldCgnY2xhaW1zJykpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDbGFpbXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBjbGFpbXMgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuICAgICAgICAgICAgICAgIHtjbGFpbXMubWFwKGVudHJ5ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17ZW50cnkuZ2V0KCdpZCcpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nICAgICAgICA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtlbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZENvbG9yICA9IHtlbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXAgICA9IHtlbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZENsYWltcy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgICA9IEd1aWxkQ2xhaW1zO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcbmNvbnN0IENsYWltcyAgICA9IHJlcXVpcmUoJy4vQ2xhaW1zJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7d2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnfX0+XHJcbiAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3BpbicgLz5cclxuICAgIHsnIExvYWRpbmcuLi4nfVxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBHdWlsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YVJlYWR5ICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnbG9hZGVkJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkSWQgICAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJyk7XHJcbiAgICAgICAgY29uc3QgZ3VpbGROYW1lICAgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGd1aWxkVGFnICAgID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG4gICAgICAgIGNvbnN0IGd1aWxkQ2xhaW1zID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuICAgICAgICBjb25zdCBndWlsZExpbmsgICA9IChndWlsZE5hbWUpXHJcbiAgICAgICAgICAgID8gYGh0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS9ndWlsZHMvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9YFxyXG4gICAgICAgICAgICA6IGBodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vJHtndWlsZElkfWA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdHdWlsZDo6cmVuZGVyKCknLCBndWlsZElkLCBndWlsZE5hbWUpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2d1aWxkJyBpZD17Z3VpbGRJZH0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC1zbS00Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17Z3VpbGRMaW5rfSB0YXJnZXQ9J19ibGFuayc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RW1ibGVtIGtleT17Z3VpbGRJZH0gZ3VpbGROYW1lPXtndWlsZE5hbWV9IHNpemU9ezI1Nn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTIwJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyhkYXRhUmVhZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxoMT48YSBocmVmPXtndWlsZExpbmt9IHRhcmdldD0nX2JsYW5rJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3VpbGROYW1lfSBbe2d1aWxkVGFnfV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8ZGl2Pntsb2FkaW5nSHRtbH08YnIgLz57Z3VpbGRJZH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyFndWlsZENsYWltcy5pc0VtcHR5KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPENsYWltcyB7Li4udGhpcy5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNsdWdpZnkoc3RyKSB7XHJcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgPSBHdWlsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBHdWlsZCAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgR3VpbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0d1aWxkczo6cmVuZGVyKCknKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvcHMuZ3VpbGRzJywgcHJvcHMuZ3VpbGRzLnRvT2JqZWN0KCkpO1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0ZWRHdWlsZHMgPSBwcm9wcy5ndWlsZHMudG9TZXEoKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IGd1aWxkLmdldCgnZ3VpbGRfbmFtZScpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KGd1aWxkID0+IC1ndWlsZC5nZXQoJ2xhc3RDbGFpbScpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJndWlsZHNcIj5cclxuICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRlclwiPkd1aWxkIENsYWltczwvaDI+XHJcbiAgICAgICAgICAgICAgICB7c29ydGVkR3VpbGRzLm1hcChndWlsZCA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgICA9IHtndWlsZC5nZXQoJ2d1aWxkX2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgID0ge3Byb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkID0ge2d1aWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuR3VpbGRzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICA9IEd1aWxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbi8vIGNvbnN0ICQgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogQ29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGNhcHR1cmVDb2xzID0ge1xyXG4gICAgZWxhcHNlZCAgOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiB0cnVlLFxyXG4gICAgbWFwQWJicmV2OiB0cnVlLFxyXG4gICAgYXJyb3cgICAgOiB0cnVlLFxyXG4gICAgc3ByaXRlICAgOiB0cnVlLFxyXG4gICAgbmFtZSAgICAgOiB0cnVlLFxyXG4gICAgZXZlbnRUeXBlOiBmYWxzZSxcclxuICAgIGd1aWxkTmFtZTogZmFsc2UsXHJcbiAgICBndWlsZFRhZyA6IGZhbHNlLFxyXG4gICAgdGltZXIgICAgOiBmYWxzZSxcclxufTtcclxuXHJcbmNvbnN0IGNsYWltQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogdHJ1ZSxcclxuICAgIHRpbWVzdGFtcDogdHJ1ZSxcclxuICAgIG1hcEFiYnJldjogdHJ1ZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IHRydWUsXHJcbiAgICBndWlsZFRhZyA6IHRydWUsXHJcbiAgICB0aW1lciAgICA6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZW50cnkgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZCAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbiAgICBtYXBGaWx0ZXIgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0VudHJ5ICAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmVudHJ5LCBuZXh0UHJvcHMuZW50cnkpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICAgID0gKG5ld0d1aWxkIHx8IG5ld0VudHJ5KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3TWFwRmlsdGVyICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdFdmVudEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBuZXdGaWx0ZXJzICAgICA9IChuZXdNYXBGaWx0ZXIgfHwgbmV3RXZlbnRGaWx0ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgICA9IChuZXdMYW5nIHx8IG5ld0RhdGEgfHwgbmV3RmlsdGVycyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpMb2c6OkVudHJ5OjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0VudHJ5OnJlbmRlcigpJyk7XHJcbiAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKTtcclxuICAgICAgICBjb25zdCBjb2xzICAgICAgPSAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSA/IGNsYWltQ29scyA6IGNhcHR1cmVDb2xzO1xyXG4gICAgICAgIGNvbnN0IG9NZXRhICAgICA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YVt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKV07XHJcbiAgICAgICAgY29uc3QgbWFwQ29sb3IgID0gXy5maW5kKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXAgPT4gbWFwLm1hcEluZGV4ID09PSBvTWV0YS5tYXApLmNvbG9yO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlc01hcEZpbHRlciAgID0gdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSBtYXBDb2xvcjtcclxuICAgICAgICBjb25zdCBtYXRjaGVzRXZlbnRGaWx0ZXIgPSB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSBldmVudFR5cGU7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkQmVWaXNpYmxlICAgID0gKG1hdGNoZXNNYXBGaWx0ZXIgJiYgbWF0Y2hlc0V2ZW50RmlsdGVyKTtcclxuICAgICAgICBjb25zdCBjbGFzc05hbWUgICAgICAgICAgPSBzaG91bGRCZVZpc2libGUgPyAnc2hvdy1lbnRyeScgOiAnaGlkZS1lbnRyeSc7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7Y29sc31cclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHt0aGlzLnByb3BzLmd1aWxkSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZW50cnlJZCAgICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ2lkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGRDb2xvciAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3dvcmxkJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSAgID0ge3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0eXBlJyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkVudHJ5LnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gRW50cnk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydhbGwnLCAnY2FwdHVyZScsICdjbGFpbSddKS5pc1JlcXVpcmVkLFxyXG4gICAgc2V0RXZlbnQgICA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgIT09IG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgbGlua0NsYWltcyAgID0gPGEgb25DbGljaz17dGhpcy5wcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjbGFpbVwiPkNsYWltczwvYT47XHJcbiAgICAgICAgY29uc3QgbGlua0NhcHR1cmVzID0gPGEgb25DbGljaz17dGhpcy5wcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjYXB0dXJlXCI+Q2FwdHVyZXM8L2E+O1xyXG4gICAgICAgIGNvbnN0IGxpbmtBbGwgICAgICA9IDxhIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiYWxsXCI+QWxsPC9hPjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGlkPVwibG9nLWV2ZW50LWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXsodGhpcy5wcm9wcy5ldmVudEZpbHRlciA9PT0gJ2NsYWltJykgICA/ICdhY3RpdmUnOiBudWxsfT57bGlua0NsYWltc308L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdjYXB0dXJlJykgPyAnYWN0aXZlJzogbnVsbH0+e2xpbmtDYXB0dXJlc308L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17KHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdhbGwnKSAgID8gJ2FjdGl2ZSc6IG51bGx9PntsaW5rQWxsfTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IE1hcEZpbHRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgRW50cnkgICAgID0gcmVxdWlyZSgnLi9FbnRyeScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGd1aWxkczoge30sXHJcbn07XHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzICAgICAgICAgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIGV2ZW50SGlzdG9yeSAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIHRyaWdnZXJOb3RpZmljYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBtYXBGaWx0ZXIgICAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBldmVudEZpbHRlciAgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMb2dFbnRyaWVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdFdmVudHMgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRIaXN0b3J5LCBuZXh0UHJvcHMuZXZlbnRIaXN0b3J5KTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhICAgICAgICAgPSAobmV3R3VpbGRzIHx8IG5ld0V2ZW50cyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1RyaWdnZXJTdGF0ZSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uLCBuZXh0UHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgY29uc3QgbmV3RmlsdGVyU3RhdGUgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hcEZpbHRlciwgbmV4dFByb3BzLm1hcEZpbHRlcikgfHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG5ld09wdGlvbnMgICAgICA9IChuZXdUcmlnZ2VyU3RhdGUgfHwgbmV3RmlsdGVyU3RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgICAgPSAobmV3TGFuZyB8fCBuZXdEYXRhIHx8IG5ld09wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TG9nRW50cmllczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0RhdGEsIG5ld09wdGlvbnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xvZ0VudHJpZXM6OnJlbmRlcigpJywgcHJvcHMubWFwRmlsdGVyLCBwcm9wcy5ldmVudEZpbHRlciwgcHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx1bCBpZD1cImxvZ1wiPlxyXG4gICAgICAgICAgICAgICAge3Byb3BzLmV2ZW50SGlzdG9yeS5tYXAoZW50cnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IGVudHJ5LmdldCgndHlwZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5SWQgICA9IGVudHJ5LmdldCgnaWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGd1aWxkSWQsIGd1aWxkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudFR5cGUgPT09ICdjbGFpbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZCA9IGVudHJ5LmdldCgnZ3VpbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICA9IChwcm9wcy5ndWlsZHMuaGFzKGd1aWxkSWQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHByb3BzLmd1aWxkcy5nZXQoZ3VpbGRJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8RW50cnlcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgICAgICAgICA9IHtlbnRyeUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgICAgICAgICAgID0gJ2xpJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbiA9IHtwcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGaWx0ZXIgICAgICAgICAgID0ge3Byb3BzLm1hcEZpbHRlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGaWx0ZXIgICAgICAgICA9IHtwcm9wcy5ldmVudEZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgICAgICAgICAgPSB7cHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgICAgICAgICAgICAgPSB7Z3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkgICAgICAgICAgICAgICA9IHtlbnRyeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgICAgICAgICA9IHtndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPjtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxvZ0VudHJpZXMuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xyXG5Mb2dFbnRyaWVzLnByb3BUeXBlcyAgICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgPSBMb2dFbnRyaWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBtYXBGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHNldFdvcmxkIDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcEZpbHRlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5tYXBGaWx0ZXIgIT09IG5leHRQcm9wcy5tYXBGaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGlkPVwibG9nLW1hcC1maWx0ZXJzXCIgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxsc1wiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnKSA/ICdhY3RpdmUnOiAnbnVsbCd9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3Byb3BzLnNldFdvcmxkfSBkYXRhLWZpbHRlcj1cImFsbFwiPkFsbDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgICAgICAgICAge18ubWFwKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXBNZXRhID0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17bWFwTWV0YS5tYXBJbmRleH0gY2xhc3NOYW1lPXsocHJvcHMubWFwRmlsdGVyID09PSBtYXBNZXRhLmNvbG9yKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17cHJvcHMuc2V0V29ybGR9IGRhdGEtZmlsdGVyPXttYXBNZXRhLmNvbG9yfT57bWFwTWV0YS5hYmJyfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRmlsdGVycy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRmlsdGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbi8vIGNvbnN0IFNUQVRJQyAgICAgICA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBGaWx0ZXJzICAgPSByZXF1aXJlKCcuL01hcEZpbHRlcnMnKTtcclxuY29uc3QgRXZlbnRGaWx0ZXJzID0gcmVxdWlyZSgnLi9FdmVudEZpbHRlcnMnKTtcclxuY29uc3QgTG9nRW50cmllcyAgID0gcmVxdWlyZSgnLi9Mb2dFbnRyaWVzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcbiAgICBkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgZ3VpbGRzIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIExvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbWFwRmlsdGVyICAgICAgICAgIDogJ2FsbCcsXHJcbiAgICAgICAgICAgIGV2ZW50RmlsdGVyICAgICAgICA6ICdhbGwnLFxyXG4gICAgICAgICAgICB0cmlnZ2VyTm90aWZpY2F0aW9uOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdHdWlsZHMgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnkgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5JyksIG5leHRQcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpKTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhICAgICAgICA9IChuZXdHdWlsZHMgfHwgbmV3SGlzdG9yeSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld01hcEZpbHRlciAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hcEZpbHRlciwgbmV4dFN0YXRlLm1hcEZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgbmV3RXZlbnRGaWx0ZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZXZlbnRGaWx0ZXIsIG5leHRTdGF0ZS5ldmVudEZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgbmV3RmlsdGVycyAgICAgPSAobmV3TWFwRmlsdGVyIHx8IG5ld0V2ZW50RmlsdGVyKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlICAgPSAobmV3TGFuZyB8fCBuZXdEYXRhIHx8IG5ld0ZpbHRlcnMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TG9nczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0RhdGEsIG5ld0ZpbHRlcnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50SGlzdG9yeSA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cImxvZy1jb250YWluZXJcIj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvZy10YWJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXBGaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRmlsdGVyID0ge3RoaXMuc3RhdGUubWFwRmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFdvcmxkICA9IHtzZXRXb3JsZC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFdmVudEZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEZpbHRlciA9IHt0aGlzLnN0YXRlLmV2ZW50RmlsdGVyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEV2ZW50ICAgID0ge3NldEV2ZW50LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIHshZXZlbnRIaXN0b3J5LmlzRW1wdHkoKVxyXG4gICAgICAgICAgICAgICAgICAgID8gPExvZ0VudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlck5vdGlmaWNhdGlvbiA9IHt0aGlzLnN0YXRlLnRyaWdnZXJOb3RpZmljYXRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZpbHRlciAgICAgICAgICAgPSB7dGhpcy5zdGF0ZS5tYXBGaWx0ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50RmlsdGVyICAgICAgICAgPSB7dGhpcy5zdGF0ZS5ldmVudEZpbHRlcn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgICAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBndWlsZHMgICAgICAgICAgICAgID0ge3RoaXMucHJvcHMuZ3VpbGRzfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRIaXN0b3J5ICAgICAgICA9IHtldmVudEhpc3Rvcnl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFdvcmxkKGUpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuICAgIGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHttYXBGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldEV2ZW50KGUpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuICAgIGxldCBmaWx0ZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyJyk7XHJcblxyXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHtldmVudEZpbHRlcjogZmlsdGVyLCB0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Mb2cucHJvcFR5cGVzICA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBMb2c7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCAgICAgICAgICA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzICA9IHJlcXVpcmUoJy4vTWFwU2NvcmVzJyk7XHJcbmNvbnN0IE1hcFNlY3Rpb24gPSByZXF1aXJlKCcuL01hcFNlY3Rpb24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBkZXRhaWxzICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuICAgIGd1aWxkcyAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGV0YWlscyAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuICAgICAgICBjb25zdCBuZXdXb3JsZHMgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBuZXdSZW1vdGVOb3csIG5leHRQcm9wcy5yZW1vdGVOb3cpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE1ldGEgICA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdrZXknKSA9PT0gdGhpcy5wcm9wcy5tYXBLZXkpO1xyXG4gICAgICAgIGNvbnN0IG1hcEluZGV4ICA9IG1hcE1ldGEuZ2V0KCdtYXBJbmRleCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgbWFwU2NvcmVzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnbWFwcycsICdzY29yZXMnLCBtYXBJbmRleF0pO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczpyZW5kZXIoKScsIG1hcFNjb3Jlcy50b0pTKCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcFwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT17J3RlYW0gJyArIG1hcE1ldGEuZ2V0KCdjb2xvcicpfSBvbkNsaWNrPXtvblRpdGxlQ2xpY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7bWFwTWV0YS5nZXQoJ25hbWUnKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNYXBTY29yZXMgc2NvcmVzPXttYXBTY29yZXN9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHttYXBNZXRhLmdldCgnc2VjdGlvbnMnKS5tYXAoKG1hcFNlY3Rpb24sIGl4U2VjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNYXBTZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ICA9IFwidWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSAgICAgICAgPSB7aXhTZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFNlY3Rpb24gPSB7bWFwU2VjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBNZXRhICAgID0ge21hcE1ldGF9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uVGl0bGVDbGljayhlKSB7XHJcbiAgICBsZXQgJG1hcHMgICAgPSAkKCcubWFwJyk7XHJcbiAgICBsZXQgJG1hcCAgICAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWFwJywgJG1hcHMpO1xyXG5cclxuICAgIGxldCBoYXNGb2N1cyA9ICRtYXAuaGFzQ2xhc3MoJ21hcC1mb2N1cycpO1xyXG5cclxuXHJcbiAgICBpZiAoIWhhc0ZvY3VzKSB7XHJcbiAgICAgICAgJG1hcFxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcbiAgICAgICAgJG1hcHMubm90KCRtYXApXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdtYXAtYmx1cicpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgJG1hcHNcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwRGV0YWlscy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgID0gTWFwRGV0YWlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IG51bWVyYWwgICA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgc2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcFNjb3JlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2NvcmVzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3Jlcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5zY29yZXMubWFwKChzY29yZSwgaXhTY29yZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVhbSAgICAgID0gWydyZWQnLCAnYmx1ZScsICdncmVlbiddW2l4U2NvcmVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGtleT17dGVhbX0gY2xhc3NOYW1lPXtgdGVhbSAke3RlYW19YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXR0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT47XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuTWFwU2NvcmVzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICA9IE1hcFNjb3JlcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qIERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCdUcmFja2VyL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogTW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogdHJ1ZSxcclxuICAgIHNwcml0ZSAgIDogdHJ1ZSxcclxuICAgIG5hbWUgICAgIDogdHJ1ZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiB0cnVlLFxyXG4gICAgdGltZXIgICAgOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIGRldGFpbHMgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgbWFwU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cclxufTtcclxuXHJcbmNsYXNzIE1hcFNlY3Rpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSAgICAgID0gKG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBTZWN0aW9uOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm1hcFNlY3Rpb24uZ2V0KCdvYmplY3RpdmVzJyk7XHJcbiAgICAgICAgY29uc3Qgb3duZXJzICAgICAgICA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IGNsYWltZXJzICAgICAgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb25DbGFzcyAgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtgbGlzdC11bnN0eWxlZCAke3NlY3Rpb25DbGFzc31gfT5cclxuICAgICAgICAgICAgICAgIHttYXBPYmplY3RpdmVzLm1hcChvYmplY3RpdmVJZCA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ0lkICAgICA9IG9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXIgICAgICAgID0gb3duZXJzLmdldChzdHJpbmdJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xhaW1lciAgICAgID0gY2xhaW1lcnMuZ2V0KHN0cmluZ0lkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGRJZCAgICAgID0gKGNsYWltZXIpID8gY2xhaW1lci5nZXQoJ2d1aWxkJykgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc0NsYWltZXIgICA9ICEhZ3VpbGRJZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzR3VpbGREYXRhID0gaGFzQ2xhaW1lciAmJiB0aGlzLnByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpbGQgICAgICAgID0gaGFzR3VpbGREYXRhID8gdGhpcy5wcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpIDogbnVsbDtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtvYmplY3RpdmVJZH0gaWQ9eydvYmplY3RpdmUtJyArIG9iamVjdGl2ZUlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE9iamVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29scyAgICAgICAgPSB7b2JqZWN0aXZlQ29sc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RpdmVJZCA9IHtvYmplY3RpdmVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkQ29sb3IgID0ge293bmVyLmdldCgnd29ybGQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge293bmVyLmdldCgndGltZXN0YW1wJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndWlsZElkICAgICA9IHtndWlsZElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgICAgPSB7Z3VpbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT47XHJcblxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0U2VjdGlvbkNsYXNzKG1hcEtleSwgc2VjdGlvbkxhYmVsKSB7XHJcbiAgICBsZXQgc2VjdGlvbkNsYXNzID0gW1xyXG4gICAgICAgICdjb2wtbWQtMjQnLFxyXG4gICAgICAgICdtYXAtc2VjdGlvbicsXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChtYXBLZXkgPT09ICdDZW50ZXInKSB7XHJcbiAgICAgICAgaWYgKHNlY3Rpb25MYWJlbCA9PT0gJ0Nhc3RsZScpIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlY3Rpb25DbGFzcy5qb2luKCcgJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5NYXBTZWN0aW9uLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgPSBNYXBTZWN0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcERldGFpbHMgPSByZXF1aXJlKCcuL01hcERldGFpbHMnKTtcclxuY29uc3QgTG9nICAgICAgICA9IHJlcXVpcmUoJ1RyYWNrZXIvTG9nJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgZGV0YWlscyAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZHMgICAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RldGFpbHMgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzRGF0YUluaXRpYWxpemVkID0gcHJvcHMuZGV0YWlscy5nZXQoJ2luaXRpYWxpemVkJyk7XHJcblxyXG4gICAgICAgIGlmICghaXNEYXRhSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gaWQ9XCJtYXBzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkNlbnRlclwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTE4XCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJSZWRIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiQmx1ZUhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJHcmVlbkhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMb2cgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcHMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBFbWJsZW0gICAgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvRW1ibGVtJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNob3dOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1RhZyA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZElkIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGd1aWxkICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZCAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRJZCwgbmV4dFByb3BzLmd1aWxkSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGQgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgICAgID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgY29uc3QgaGFzR3VpbGQgID0gISF0aGlzLnByb3BzLmd1aWxkSWQ7XHJcbiAgICAgICAgY29uc3QgaXNFbmFibGVkID0gKGhhc0d1aWxkICYmICh0aGlzLnByb3BzLnNob3dOYW1lIHx8IHRoaXMucHJvcHMuc2hvd1RhZykpO1xyXG5cclxuICAgICAgICBpZiAoIWlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0d1aWxkRGF0YSA9IChwcm9wcy5ndWlsZCAmJiBwcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGd1aWxkSWQgPSBwcm9wcy5ndWlsZElkO1xyXG4gICAgICAgICAgICBjb25zdCBocmVmICAgID0gYCMke2d1aWxkSWR9YDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ICAgPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG4gICAgICAgICAgICBsZXQgdGl0bGUgICAgID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNHdWlsZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhZyAgPSBwcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zaG93TmFtZSAmJiBwcm9wcy5zaG93VGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7YCR7bmFtZX0gWyR7dGFnfV0gYH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtYmxlbSBndWlsZE5hbWU9e25hbWV9IHNpemU9ezIwfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wcy5zaG93TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtuYW1lfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gYCR7dGFnfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBgJHtuYW1lfSBbJHt0YWd9XWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8YSBjbGFzc05hbWU9XCJndWlsZG5hbWVcIiBocmVmPXtocmVmfSB0aXRsZT17dGl0bGV9PlxyXG4gICAgICAgICAgICAgICAge2NvbnRlbnR9XHJcbiAgICAgICAgICAgIDwvYT47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEd1aWxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSAgICA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9TcHJpdGUnKTtcclxuY29uc3QgQXJyb3cgICAgID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0Fycm93Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHNob3dBcnJvdyAgOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgc2hvd1Nwcml0ZSA6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgY29sb3IgICAgICA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIEljb25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdDb2xvciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuY29sb3IsIG5leHRQcm9wcy5jb2xvcik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuc2hvd0Fycm93ICYmICF0aGlzLnByb3BzLnNob3dTcHJpdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvTWV0YSAgID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuICAgICAgICAgICAgY29uc3Qgb1R5cGVJZCA9IG9NZXRhLmdldCgndHlwZScpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9UeXBlICAgPSBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldChvVHlwZUlkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1pY29uc1wiPlxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnByb3BzLnNob3dBcnJvdykgP1xyXG4gICAgICAgICAgICAgICAgICAgIDxBcnJvdyBvTWV0YT17b01ldGF9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnByb3BzLnNob3dTcHJpdGUpID9cclxuICAgICAgICAgICAgICAgICAgICA8U3ByaXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge29UeXBlLmdldCgnbmFtZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHt0aGlzLnByb3BzLmNvbG9yfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkljb25zLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gSWNvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGFuZyAgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9MYWJlbCAgID0gU1RBVElDLm9iamVjdGl2ZV9sYWJlbHMuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e29MYWJlbC5nZXQobGFuZ1NsdWcpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gTGFiZWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBpc0VuYWJsZWQgIDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBNYXBOYW1lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIC8vIG1hcCBuYW1lIGNhbiBuZXZlciBjaGFuZ2UsIG5vdCBsb2NhbGl6ZWRcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9NZXRhICAgID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuICAgICAgICAgICAgY29uc3QgbWFwSW5kZXggPSBvTWV0YS5nZXQoJ21hcCcpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXBNZXRhICA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdtYXBJbmRleCcpID09PSBtYXBJbmRleCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbWFwXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT17bWFwTWV0YS5nZXQoJ25hbWUnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAge21hcE1ldGEuZ2V0KCdhYmJyJyl9XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk1hcE5hbWUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICA9IE1hcE5hbWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiAgIFRIRSBDT05URU5UIE9GIENPTVBPTkVOVCBJUyBNQU5BR0VEIEVYVEVSTkFMTFlcclxuKiAgIGxpYi50cmFja2VyVGltZXJzIElTIElOSVRJQUxJWkVEIElOIFRyYWNrZXIuY29tcG9uZW50RGlkTW91bnQoKTtcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbi8vIGNvbnN0IHNwaW5uZXIgICA9ICA8aSBjbGFzc05hbWU9J2ZhIGZhLXNwaW5uZXIgZmEtc3Bpbic+PC9pPjtcclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgaXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUaW1lckNvdW50ZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3SXNFbmFibGVkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmlzRW5hYmxlZCwgbmV4dFByb3BzLmlzRW5hYmxlZCk7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0lzRW5hYmxlZCB8fCBuZXdUaW1lc3RhbXApO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gPHNwYW5cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndGltZXIgY291bnRkb3duIGluYWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgZGF0YS10aW1lc3RhbXA9e3RoaXMucHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICA+PC9zcGFuPjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblRpbWVyQ291bnRkb3duLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgID0gVGltZXJDb3VudGRvd247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiAgIFRIRSBDT05URU5UIE9GIENPTVBPTkVOVCBJUyBNQU5BR0VEIEVYVEVSTkFMTFlcclxuKiAgIGxpYi50cmFja2VyVGltZXJzIElTIElOSVRJQUxJWkVEIElOIFRyYWNrZXIuY29tcG9uZW50RGlkTW91bnQoKTtcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcbmNvbnN0IHNwaW5uZXIgICA9ICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgaXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBUaW1lclJlbGF0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRpbWVyIHJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRpbWVzdGFtcD17dGhpcy5wcm9wcy50aW1lc3RhbXB9XHJcbiAgICAgICAgICAgICAgICA+e3NwaW5uZXJ9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5UaW1lclJlbGF0aXZlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgPSBUaW1lclJlbGF0aXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVGltZXN0YW1wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXRpbWVzdGFtcFwiPlxyXG4gICAgICAgICAgICAgICAge21vbWVudCgodGhpcy5wcm9wcy50aW1lc3RhbXApICogMTAwMCkuZm9ybWF0KCdoaDptbTpzcycpfVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5UaW1lc3RhbXAucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgID0gVGltZXN0YW1wO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbiogRGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlICAgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgICAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBUaW1lclJlbGF0aXZlICA9IHJlcXVpcmUoJy4vVGltZXJSZWxhdGl2ZScpO1xyXG5jb25zdCBUaW1lc3RhbXAgICAgICA9IHJlcXVpcmUoJy4vVGltZXN0YW1wJyk7XHJcbmNvbnN0IE1hcE5hbWUgICAgICAgID0gcmVxdWlyZSgnLi9NYXBOYW1lJyk7XHJcbmNvbnN0IEljb25zICAgICAgICAgID0gcmVxdWlyZSgnLi9JY29ucycpO1xyXG5jb25zdCBMYWJlbCAgICAgICAgICA9IHJlcXVpcmUoJy4vTGFiZWwnKTtcclxuY29uc3QgR3VpbGQgICAgICAgICAgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcbmNvbnN0IFRpbWVyQ291bnRkb3duID0gcmVxdWlyZSgnLi9UaW1lckNvdW50ZG93bicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBjb2xEZWZhdWx0cyA9IHtcclxuICAgIGVsYXBzZWQgIDogZmFsc2UsXHJcbiAgICB0aW1lc3RhbXA6IGZhbHNlLFxyXG4gICAgbWFwQWJicmV2OiBmYWxzZSxcclxuICAgIGFycm93ICAgIDogZmFsc2UsXHJcbiAgICBzcHJpdGUgICA6IGZhbHNlLFxyXG4gICAgbmFtZSAgICAgOiBmYWxzZSxcclxuICAgIGV2ZW50VHlwZTogZmFsc2UsXHJcbiAgICBndWlsZE5hbWU6IGZhbHNlLFxyXG4gICAgZ3VpbGRUYWcgOiBmYWxzZSxcclxuICAgIHRpbWVyICAgIDogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIGxhbmcgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cclxuICAgIG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZENvbG9yIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgdGltZXN0YW1wICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGV2ZW50VHlwZSAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cclxuICAgIGd1aWxkSWQgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgZ3VpbGQgICAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cclxuICAgIGNvbHMgICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG59O1xyXG5cclxuY2xhc3MgT2JqZWN0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdMYW5nICAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdDYXB0dXJlICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuICAgICAgICBjb25zdCBuZXdPd25lciAgICAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRDb2xvciwgbmV4dFByb3BzLndvcmxkQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NsYWltZXIgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcbiAgICAgICAgY29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGEgICAgICA9IChuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpPYmplY3RpdmVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIG5ld1JlbW90ZU5vdywgbmV4dFByb3BzLnJlbW90ZU5vdyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdPYmplY3RpdmU6cmVuZGVyKCknLCB0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0aXZlSWQgPSB0aGlzLnByb3BzLm9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3Qgb01ldGEgICAgICAgPSBTVEFUSUMub2JqZWN0aXZlX21ldGEuZ2V0KG9iamVjdGl2ZUlkKTtcclxuXHJcbiAgICAgICAgLy8gc2hvcnQgY2lyY3VpdFxyXG4gICAgICAgIGlmIChvTWV0YS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb2xzID0gXy5kZWZhdWx0cyh0aGlzLnByb3BzLmNvbHMsIGNvbERlZmF1bHRzKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lID0ge2BvYmplY3RpdmUgdGVhbSAke3RoaXMucHJvcHMud29ybGRDb2xvcn1gfT5cclxuICAgICAgICAgICAgICAgIDxUaW1lclJlbGF0aXZlXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLmVsYXBzZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wICAgPSB7cHJvcHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxUaW1lc3RhbXBcclxuICAgICAgICAgICAgICAgICAgICBpc0VuYWJsZWQgICA9IHshIWNvbHMudGltZXN0YW1wfVxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCAgID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8TWFwTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIGlzRW5hYmxlZCAgID0geyEhY29scy5tYXBBYmJyZXZ9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgIDxJY29uc1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dBcnJvdyAgID0geyEhY29scy5hcnJvd31cclxuICAgICAgICAgICAgICAgICAgICBzaG93U3ByaXRlICA9IHshIWNvbHMuc3ByaXRlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdGl2ZUlkID0ge29iamVjdGl2ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yICAgICAgID0ge3RoaXMucHJvcHMud29ybGRDb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPExhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkICAgPSB7ISFjb2xzLm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0aXZlSWQgPSB7b2JqZWN0aXZlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyAgICAgICAgPSB7dGhpcy5wcm9wcy5sYW5nfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHdWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TmFtZSA9IHshIWNvbHMuZ3VpbGROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93VGFnICA9IHshIWNvbHMuZ3VpbGRUYWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQgID0ge3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3VpbGQgICAgPSB7dGhpcy5wcm9wcy5ndWlsZH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8VGltZXJDb3VudGRvd25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkID0geyEhY29scy50aW1lcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wID0ge3Byb3BzLnRpbWVzdGFtcH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbk9iamVjdGl2ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgICAgPSBPYmplY3RpdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9TcHJpdGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBjb2xvciAgICAgICA6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHR5cGVRdWFudGl0eTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgdHlwZUlkICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBIb2xkaW5nc0l0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG9UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldChwcm9wcy50eXBlSWQpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3UXVhbnRpdHkgID0gKHRoaXMucHJvcHMudHlwZVF1YW50aXR5ICE9PSBuZXh0UHJvcHMudHlwZVF1YW50aXR5KTtcclxuICAgICAgICBjb25zdCBuZXdUeXBlICAgICAgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbG9yICAgICA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdRdWFudGl0eSB8fCBuZXdUeXBlIHx8IG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblxyXG4gICAgICAgIGlmIChuZXdUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe29UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldCh0aGlzLnByb3BzLnR5cGVJZCl9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OlNjb3JlYm9hcmQ6OkhvbGRpbmdzSXRlbTpyZW5kZXIoKScsIHRoaXMuc3RhdGUub1R5cGUudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgPFNwcml0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgID0ge3RoaXMuc3RhdGUub1R5cGUuZ2V0KCduYW1lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICAgICAge2AgeCR7dGhpcy5wcm9wcy50eXBlUXVhbnRpdHl9YH1cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogRXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5Ib2xkaW5nc0l0ZW0ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgID0gSG9sZGluZ3NJdGVtOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBJdGVtICAgICAgPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBjb2xvciAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgaG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgSG9sZGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IG5ld0hvbGRpbmdzICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ob2xkaW5ncywgbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3SG9sZGluZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMuaG9sZGluZ3MubWFwKCh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIDxJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgICAgID0ge3R5cGVJbmRleH1cclxuICAgICAgICAgICAgICAgICAgICBjb2xvciAgICAgICAgPSB7dGhpcy5wcm9wcy5jb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICB0eXBlUXVhbnRpdHkgPSB7dHlwZVF1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVJZCAgICAgICA9IHsodHlwZUluZGV4ICsgMSkudG9TdHJpbmcoKX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbkhvbGRpbmdzLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgICAgID0gSG9sZGluZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IG51bWVyYWwgICA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG4vKlxyXG4qIFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEhvbGRpbmdzICA9IHJlcXVpcmUoJy4vSG9sZGluZ3MnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8aDEgc3R5bGU9e3toZWlnaHQ6ICc5MHB4JywgZm9udFNpemU6ICczMnB0JywgbGluZUhlaWdodDogJzkwcHgnfX0+XHJcbiAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+XHJcbjwvaDE+O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIHdvcmxkICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG4gICAgc2NvcmUgICA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHRpY2sgICAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBob2xkaW5nczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGQgICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG4gICAgICAgIGNvbnN0IG5ld1Njb3JlICAgICA9ICh0aGlzLnByb3BzLnNjb3JlICE9PSBuZXh0UHJvcHMuc2NvcmUpO1xyXG4gICAgICAgIGNvbnN0IG5ld1RpY2sgICAgICA9ICh0aGlzLnByb3BzLnRpY2sgIT09IG5leHRQcm9wcy50aWNrKTtcclxuICAgICAgICBjb25zdCBuZXdIb2xkaW5ncyAgPSAodGhpcy5wcm9wcy5ob2xkaW5ncyAhPT0gbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3V29ybGQgfHwgbmV3U2NvcmUgfHwgbmV3VGljayB8fCBuZXdIb2xkaW5ncyk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BzY29yZWJvYXJkIHRlYW0tYmcgdGVhbSB0ZXh0LWNlbnRlciAke3RoaXMucHJvcHMud29ybGQuZ2V0KCdjb2xvcicpfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy53b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHRoaXMucHJvcHMud29ybGQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPjxhIGhyZWY9e3RoaXMucHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLndvcmxkLmdldCgnbmFtZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge251bWVyYWwodGhpcy5wcm9wcy5zY29yZSkuZm9ybWF0KCcwLDAnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtudW1lcmFsKHRoaXMucHJvcHMudGljaykuZm9ybWF0KCcrMCwwJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIb2xkaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXt0aGlzLnByb3BzLndvcmxkLmdldCgnY29sb3InKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob2xkaW5ncz17dGhpcy5wcm9wcy5ob2xkaW5nc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGxvYWRpbmdIdG1sXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbldvcmxkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgID0gV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgV29ybGQgICAgID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuICAgIG1hdGNoICAgICAgOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgU2NvcmVib2FyZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3V29ybGRzICAgID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG4gICAgICAgIGNvbnN0IG5ld1Njb3JlcyAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkcyB8fCBuZXdTY29yZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHNjb3JlcyAgID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpO1xyXG4gICAgICAgIGNvbnN0IHRpY2tzICAgID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3RpY2tzJyk7XHJcbiAgICAgICAgY29uc3QgaG9sZGluZ3MgPSB0aGlzLnByb3BzLm1hdGNoLmdldCgnaG9sZGluZ3MnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicm93XCIgaWQ9XCJzY29yZWJvYXJkc1wiPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubWF0Y2hXb3JsZHMubWFwKCh3b3JsZCwgaXhXb3JsZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICA8V29ybGRcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICAgICAgPSB7aXhXb3JsZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQgICAgPSB7d29ybGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlICAgID0ge3Njb3Jlcy5nZXQoaXhXb3JsZCkgfHwgMH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGljayAgICAgPSB7dGlja3MuZ2V0KGl4V29ybGQpIHx8IDB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRpbmdzID0ge2hvbGRpbmdzLmdldChpeFdvcmxkKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcblNjb3JlYm9hcmQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xyXG5tb2R1bGUuZXhwb3J0cyAgICAgICA9IFNjb3JlYm9hcmQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSAgICAgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gICAgICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiAgIGxpYnNcclxuKi9cclxuXHJcbmNvbnN0IGxpYkRhdGUgICAgICAgPSByZXF1aXJlKCdsaWIvZGF0ZScpO1xyXG5jb25zdCB0cmFja2VyVGltZXJzID0gcmVxdWlyZSgnbGliL3RyYWNrZXJUaW1lcnMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiAgIERhdGFcclxuKi9cclxuXHJcbmNvbnN0IERBTyAgICAgICAgICAgPSByZXF1aXJlKCdsaWIvZGF0YS90cmFja2VyJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbiogUmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmVib2FyZCAgICA9IHJlcXVpcmUoJy4vU2NvcmVib2FyZCcpO1xyXG5jb25zdCBNYXBzICAgICAgICAgID0gcmVxdWlyZSgnLi9NYXBzJyk7XHJcbmNvbnN0IEd1aWxkcyAgICAgICAgPSByZXF1aXJlKCcuL0d1aWxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKiBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCB1cGRhdGVUaW1lSW50ZXJ2YWwgPSAxMDAwO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogQ29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICBsYW5nIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuICAgIHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuY2xhc3MgVHJhY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICAgIFJlYWN0IExpZmVjeWNsZVxyXG4gICAgKlxyXG4gICAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgZGF0YUxpc3RlbmVycyA9IHtcclxuICAgICAgICAgICAgb25NYXRjaERldGFpbHM6IHRoaXMub25NYXRjaERldGFpbHMuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgb25HdWlsZERldGFpbHM6IHRoaXMub25HdWlsZERldGFpbHMuYmluZCh0aGlzKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZGFvID0gbmV3IERBTyhkYXRhTGlzdGVuZXJzKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoYXNEYXRhICAgIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGxhc3Rtb2QgICAgOiAwLFxyXG5cclxuICAgICAgICAgICAgdGltZSAgICAgICA6IHtcclxuICAgICAgICAgICAgICAgIGxvY2FsICA6IGxpYkRhdGUuZGF0ZU5vdygpLFxyXG4gICAgICAgICAgICAgICAgcmVtb3RlIDogMCxcclxuICAgICAgICAgICAgICAgIG9mZnNldCA6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBtYXRjaCAgICAgIDogSW1tdXRhYmxlLk1hcCh7bGFzdG1vZDogMH0pLFxyXG4gICAgICAgICAgICBtYXRjaFdvcmxkczogSW1tdXRhYmxlLkxpc3QoKSxcclxuICAgICAgICAgICAgZGV0YWlscyAgICA6IEltbXV0YWJsZS5NYXAoKSxcclxuICAgICAgICAgICAgY2xhaW1FdmVudHM6IEltbXV0YWJsZS5MaXN0KCksXHJcbiAgICAgICAgICAgIGd1aWxkcyAgICAgOiBJbW11dGFibGUuTWFwKCksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0xhbmcgICAgICA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluaXRpYWxEYXRhICA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5oYXNEYXRhLCBuZXh0U3RhdGUuaGFzRGF0YSk7XHJcbiAgICAgICAgY29uc3QgbmV3TWF0Y2hEYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmxhc3Rtb2QsIG5leHRTdGF0ZS5sYXN0bW9kKTtcclxuICAgICAgICBjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUuZ3VpbGRzLCBuZXh0U3RhdGUuZ3VpbGRzKTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhICAgICAgPSAoaW5pdGlhbERhdGEgfHwgbmV3TWF0Y2hEYXRhIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0RhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudERpZE1vdW50KCknKTtcclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8uaW5pdCh0aGlzLnByb3BzLmxhbmcsIHRoaXMucHJvcHMud29ybGQpO1xyXG5cclxuICAgICAgICBzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVUaW1lcnMoKCkgPT4gc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVUaW1lcnMuYmluZCh0aGlzKSwgMTAwMCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGltZXJzLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVubW91bnQoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IF8ubWFwKHRoaXMuX190aW1lb3V0cywgIHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0gXy5tYXAodGhpcy5fX2ludGVydmFscywgaSA9PiBjbGVhckludGVydmFsKGkpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYW8uY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKScsIG5ld0xhbmcpO1xyXG4gICAgICAgIHNldFBhZ2VUaXRsZSh0aGlzLnByb3BzLmxhbmcsIHRoaXMucHJvcHMud29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IHRoaXMuZGFvLmdldE1hdGNoV29ybGRzKG5leHRQcm9wcy5sYW5nLCB0aGlzLnN0YXRlLm1hdGNoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XHJcbiAgICAvLyAgY29uc29sZS5sb2coJ1RyYWNrZXI6OmNvbXBvbmVudFdpbGxVcGRhdGUoKScpO1xyXG4gICAgLy8gfVxyXG5cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0RhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwidHJhY2tlclwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxTY29yZWJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hXb3JsZHMgPSB7dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuICAgICAgICAgICAgICAgICAgICBtYXRjaCAgICAgICA9IHt0aGlzLnN0YXRlLm1hdGNofVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8TWFwc1xyXG4gICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSAgICAgICAgPSB7dGhpcy5zdGF0ZS50aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHMgICAgID0ge3RoaXMuc3RhdGUuZGV0YWlsc31cclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFdvcmxkcyA9IHt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkcyAgICAgID0ge3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTI0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsoIXRoaXMuc3RhdGUuZ3VpbGRzLmlzRW1wdHkoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPEd1aWxkc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmcgICAgICAgID0ge3RoaXMucHJvcHMubGFuZ31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZSAgICAgICAgPSB7dGhpcy5zdGF0ZS50aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkcyAgICAgID0ge3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltRXZlbnRzID0ge3RoaXMuc3RhdGUuY2xhaW1FdmVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgKlxyXG4gICAgKiAgIERhdGEgTGlzdGVuZXJzXHJcbiAgICAqXHJcbiAgICAqL1xyXG5cclxuICAgIHVwZGF0ZVRpbWVycyhjYj1fLm5vb3ApIHtcclxuICAgICAgICBpZiAodGhpcy5fX21vdW50ZWQpIHtcclxuICAgICAgICAgICAgdHJhY2tlclRpbWVycy51cGRhdGUodGhpcy5zdGF0ZS50aW1lLm9mZnNldCwgY2IpO1xyXG4gICAgICAgICAgICB0aGlzLl9fdGltZW91dHMudXBkYXRlVGltZXJzID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCB1cGRhdGVUaW1lSW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBvbk1hdGNoRGV0YWlscyh0aW1lUmVtb3RlLCBtYXRjaERhdGEsIGRldGFpbHNEYXRhKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdG1vZCAgICAgID0gbWF0Y2hEYXRhLmdldCgnbGFzdG1vZCcpO1xyXG4gICAgICAgIGNvbnN0IGlzTW9kaWZpZWQgICA9IChsYXN0bW9kICE9PSB0aGlzLnN0YXRlLm1hdGNoLmdldCgnbGFzdG1vZCcpKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChpc01vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsYWltRXZlbnRzID0gdGhpcy5kYW8uZ3VpbGRzLmdldEV2ZW50c0J5VHlwZShkZXRhaWxzRGF0YSwgJ2NsYWltJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0aW1lTG9jYWwgICAgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdGVPZmZzZXQgPSB0aW1lTG9jYWwgLSB0aW1lUmVtb3RlO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lT2Zmc2V0ICAgPSAodGhpcy5zdGF0ZS50aW1lLm9mZnNldClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChyZW1vdGVPZmZzZXQgKyB0aGlzLnN0YXRlLnRpbWUub2Zmc2V0KSAvIDIgLy8gYXZlcmFnZSB3aXRoIHByZXZpb3VzIG9mZnNldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmVtb3RlT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IHtcclxuICAgICAgICAgICAgICAgIGxvY2FsIDogdGltZUxvY2FsLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJvdW5kKHRpbWVPZmZzZXQpLFxyXG4gICAgICAgICAgICAgICAgcmVtb3RlOiB0aW1lUmVtb3RlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIHVzZSB0cmFuc2FjdGlvbmFsIHNldFN0YXRlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgICAgIGhhc0RhdGE6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdG1vZCxcclxuICAgICAgICAgICAgICAgIHRpbWUsXHJcbiAgICAgICAgICAgICAgICBjbGFpbUV2ZW50cyxcclxuXHJcbiAgICAgICAgICAgICAgICBtYXRjaCAgOiBzdGF0ZS5tYXRjaC5tZXJnZURlZXAobWF0Y2hEYXRhKSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6IHN0YXRlLmRldGFpbHMubWVyZ2VEZWVwKGRldGFpbHNEYXRhKSxcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGFvLmd1aWxkcy5sb29rdXAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmd1aWxkcyxcclxuICAgICAgICAgICAgICAgIGRldGFpbHNEYXRhLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkd1aWxkRGV0YWlscy5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm1hdGNoV29ybGRzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hXb3JsZHM6IHRoaXMuZGFvLmdldE1hdGNoV29ybGRzKHRoaXMucHJvcHMubGFuZywgdGhpcy5zdGF0ZS5tYXRjaCksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIG9uR3VpbGREZXRhaWxzKGd1aWxkLCBndWlsZElkKSB7XHJcbiAgICAgICAgY29uc3QgX2d1aWxkSWQgPSBndWlsZElkIHx8IGd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuY2xhaW1FdmVudHMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGd1aWxkID0gdGhpcy5kYW8uZ3VpbGRzLmF0dGFjaENsYWltcyh0aGlzLnN0YXRlLmNsYWltRXZlbnRzLCBndWlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgIGd1aWxkczogc3RhdGUuZ3VpbGRzLm1lcmdlSW4oW19ndWlsZElkXSwgZ3VpbGQpLFxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBsZXQgbGFuZ1NsdWcgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgIGxldCB3b3JsZE5hbWUgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICduYW1lJ10pO1xyXG5cclxuICAgIGxldCB0aXRsZSAgICAgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG4gICAgaWYgKGxhbmdTbHVnICE9PSAnZW4nKSB7XHJcbiAgICAgICAgdGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuICAgIH1cclxuXHJcbiAgICAkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxuVHJhY2tlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgID0gVHJhY2tlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxuXHJcbi8qXHJcbipcclxuKiBEZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IHBhZ2UgICAgICA9IHJlcXVpcmUoJ3BhZ2UnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKiBSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBMYW5ncyAgICAgPSByZXF1aXJlKCdjb21tb24vTGFuZ3MnKTtcclxuY29uc3QgT3ZlcnZpZXcgID0gcmVxdWlyZSgnT3ZlcnZpZXcnKTtcclxuY29uc3QgVHJhY2tlciAgID0gcmVxdWlyZSgnVHJhY2tlcicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBET00gUmVhZHlcclxuKlxyXG4qL1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAgIGF0dGFjaFJvdXRlcygpO1xyXG4gICAgc2V0SW1tZWRpYXRlKGVtbCk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogUm91dGVzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGF0dGFjaFJvdXRlcygpIHtcclxuXHJcbiAgICAvLyBSZWRpcmVjdCAnLycgdG8gJy9lbidcclxuICAgIHBhZ2UoJy8nLCByZWRpcmVjdFBhZ2UuYmluZChudWxsLCAnL2VuJykpO1xyXG5cclxuICAgIHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgUmVhY3QucmVuZGVyKFxyXG4gICAgICAgICAgICA8QXBwIHsuLi5jdHgucGFyYW1zfSAvPixcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWFwcCcpXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBwYWdlLnN0YXJ0KHtcclxuICAgICAgICBjbGljayAgIDogdHJ1ZSxcclxuICAgICAgICBwb3BzdGF0ZTogdHJ1ZSxcclxuICAgICAgICBkaXNwYXRjaDogdHJ1ZSxcclxuICAgICAgICBoYXNoYmFuZzogZmFsc2UsXHJcbiAgICAgICAgZGVjb2RlVVJMQ29tcG9uZW50czogdHJ1ZSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qIEFwcCBDb250YWluZXJcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBcHAgU3RhcnRlZCEnKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgbGFuZ1NsdWcgID0gdGhpcy5wcm9wcy5sYW5nU2x1ZztcclxuICAgICAgICBjb25zdCB3b3JsZFNsdWcgPSB0aGlzLnByb3BzLndvcmxkU2x1ZztcclxuXHJcbiAgICAgICAgY29uc3QgbGFuZyAgICAgID0gU1RBVElDLmxhbmdzLmdldChsYW5nU2x1Zyk7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgICAgID0gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzV29ybGQgID0gKHdvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAod29ybGQpICYmICF3b3JsZC5pc0VtcHR5KCkpO1xyXG5cclxuICAgICAgICBjb25zdCBIYW5kbGVyICAgPSAoaGFzV29ybGQpID8gVHJhY2tlciA6IE92ZXJ2aWV3O1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnTGFuZ3M6OnJlbmRlcigpJywgdGhpcy5wcm9wcy5sYW5nLnRvSlMoKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hdmJhckhlYWRlciA9IDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvaW1nL2xvZ28vbG9nby05NngzNi5wbmdcIiAvPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+O1xyXG5cclxuICAgICAgICByZXR1cm4gPGRpdj5cclxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge25hdmJhckhlYWRlcn1cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibmF2LWxhbmdzXCIgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGFuZ3MgbGFuZz17bGFuZ30gd29ybGQ9e3dvcmxkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNvbnRlbnRcIiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxIYW5kbGVyIGxhbmc9e2xhbmd9IHdvcmxkPXt3b3JsZH0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiBVdGlsXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHJlZGlyZWN0UGFnZShkZXN0aW5hdGlvbikge1xyXG4gICAgcGFnZS5yZWRpcmVjdChkZXN0aW5hdGlvbik7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcbiAgICByZXR1cm4gU1RBVElDLndvcmxkc1xyXG4gICAgICAgIC5maW5kKHdvcmxkID0+IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSkgPT09IHdvcmxkU2x1Zyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZW1sKCkge1xyXG4gICAgY29uc3QgY2h1bmtzID0gWydndzJ3MncnLCAnc2NodHVwaCcsICdjb20nLCAnQCcsICcuJ107XHJcbiAgICBjb25zdCBhZGRyICAgPSBbY2h1bmtzWzBdLCBjaHVua3NbM10sIGNodW5rc1sxXSwgY2h1bmtzWzRdLCBjaHVua3NbMl1dLmpvaW4oJycpO1xyXG5cclxuICAgICQoJy5ub3NwYW0tcHJ6JykuZWFjaCgoaSwgZWwpID0+IHtcclxuICAgICAgICAkKGVsKS5yZXBsYWNlV2l0aChcclxuICAgICAgICAgICAgJCgnPGE+Jywge2hyZWY6IGBtYWlsdG86JHthZGRyfWAsIHRleHQ6IGFkZHJ9KVxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBDb21wb25lbnQgRGVmaW5pdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IHByb3BUeXBlcyA9IHtcclxuICAgIG9NZXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0aXZlTWV0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vTWV0YSwgbmV4dFByb3BzLm9NZXRhKTtcclxuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3T2JqZWN0aXZlTWV0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGltZ1NyYyA9IGdldEFycm93U3JjKHRoaXMucHJvcHMub01ldGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lID0gXCJkaXJlY3Rpb25cIj5cclxuICAgICAgICAgICAgeyhpbWdTcmMpXHJcbiAgICAgICAgICAgICAgICA/IDxpbWcgc3JjID0ge2ltZ1NyY30gLz5cclxuICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgPC9zcGFuPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRBcnJvd1NyYyhtZXRhKSB7XHJcbiAgICBpZiAoIW1ldGEuZ2V0KCdkJykpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ24nKSkgICAgICB7c3JjLnB1c2goJ25vcnRoJyk7fVxyXG4gICAgZWxzZSBpZiAobWV0YS5nZXQoJ3MnKSkge3NyYy5wdXNoKCdzb3V0aCcpO31cclxuXHJcbiAgICBpZiAobWV0YS5nZXQoJ3cnKSkgICAgICB7c3JjLnB1c2goJ3dlc3QnKTt9XHJcbiAgICBlbHNlIGlmIChtZXRhLmdldCgnZScpKSB7c3JjLnB1c2goJ2Vhc3QnKTt9XHJcblxyXG4gICAgcmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5BcnJvdy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IEFycm93O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBDb21wb25lbnQgR2xvYmFsc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IGltZ1BsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjwvc3ZnPic7XHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgc2l6ZSAgICAgOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBndWlsZE5hbWUgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHNpemUgICAgIDogMjU2LFxyXG4gICAgZ3VpbGROYW1lICA6IHVuZGVmaW5lZCxcclxufTtcclxuXHJcbmNsYXNzIEVtYmxlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TmFtZSAgICAgID0gKHRoaXMucHJvcHMuZ3VpbGROYW1lICE9PSBuZXh0UHJvcHMuZ3VpbGROYW1lKTsgLy8gY2hhbmdlcyB3aGVuIGRlZmluZWRcclxuICAgICAgICBjb25zdCBuZXdTaXplICAgICAgPSAodGhpcy5wcm9wcy5zaXplICE9PSBuZXh0UHJvcHMuc2l6ZSk7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1NpemUgfHwgbmV3TmFtZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG91bGRVcGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGVtYmxlbVNyYyA9IGdldEVtYmxlbVNyYyh0aGlzLnByb3BzLmd1aWxkTmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbWJsZW0nLCB0aGlzLnByb3BzLmd1aWxkTmFtZSwgZW1ibGVtU3JjKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxpbWdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJlbWJsZW1cIlxyXG4gICAgICAgICAgICBzcmMgICAgICAgPSB7ZW1ibGVtU3JjfVxyXG4gICAgICAgICAgICB3aWR0aCAgICAgPSB7dGhpcy5wcm9wcy5zaXplfVxyXG4gICAgICAgICAgICBoZWlnaHQgICAgPSB7dGhpcy5wcm9wcy5zaXplfVxyXG4gICAgICAgICAgICBvbkVycm9yICAgPSB7aW1nT25FcnJvcn1cclxuICAgICAgICAvPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0RW1ibGVtU3JjKGd1aWxkTmFtZSkge1xyXG4gICAgcmV0dXJuIChndWlsZE5hbWUpXHJcbiAgICAgICAgPyBgaHR0cDpcXC9cXC9ndWlsZHMuZ3cydzJ3LmNvbVxcL2d1aWxkc1xcLyR7c2x1Z2lmeShndWlsZE5hbWUpfVxcLzI1Ni5zdmdgXHJcbiAgICAgICAgOiBpbWdQbGFjZWhvbGRlcjtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzbHVnaWZ5KHN0cikge1xyXG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIucmVwbGFjZSgvIC9nLCAnLScpKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGltZ09uRXJyb3IoZSkge1xyXG4gICAgY29uc3QgY3VycmVudFNyYyA9ICQoZS50YXJnZXQpLmF0dHIoJ3NyYycpO1xyXG5cclxuICAgIGlmIChjdXJyZW50U3JjICE9PSBpbWdQbGFjZWhvbGRlcikge1xyXG4gICAgICAgICQoZS50YXJnZXQpLmF0dHIoJ3NyYycsIGltZ1BsYWNlaG9sZGVyKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5FbWJsZW0ucHJvcFR5cGVzICAgID0gcHJvcFR5cGVzO1xyXG5FbWJsZW0uZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgICAgICA9IEVtYmxlbTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKiBDb21wb25lbnQgR2xvYmFsc1xyXG4gKi9cclxuXHJcbmNvbnN0IElOU1RBTkNFID0ge1xyXG4gICAgc2l6ZSAgOiA2MCxcclxuICAgIHN0cm9rZTogMixcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIENvbXBvbmVudCBEZWZpbml0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgc2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFBpZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdQaWU6OnJlbmRlcicsIHByb3BzLnNjb3Jlcy50b0FycmF5KCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gPGltZ1xyXG4gICAgICAgICAgICB3aWR0aCA9IHtJTlNUQU5DRS5zaXplfVxyXG4gICAgICAgICAgICBoZWlnaHQgPSB7SU5TVEFOQ0Uuc2l6ZX1cclxuICAgICAgICAgICAgc3JjID0ge2dldEltYWdlU291cmNlKHByb3BzLnNjb3Jlcy50b0FycmF5KCkpfVxyXG4gICAgICAgIC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0SW1hZ2VTb3VyY2Uoc2NvcmVzKSB7XHJcbiAgICByZXR1cm4gYGh0dHA6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5qb2luKCcsJyl9P3N0cm9rZVdpZHRoPSR7SU5TVEFOQ0Uuc3Ryb2tlfWA7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnQgTW9kdWxlXHJcbiAqXHJcbiAqL1xyXG5cclxuUGllLnByb3BUeXBlcyAgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzID0gUGllO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBEZXBlbmRlbmNpZXNcclxuICpcclxuICovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogQ29tcG9uZW50IERlZmluaXRpb25cclxuICpcclxuICovXHJcblxyXG5jb25zdCBwcm9wVHlwZXMgPSB7XHJcbiAgICB0eXBlIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIFNwcml0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VHlwZSAgICAgID0gKHRoaXMucHJvcHMudHlwZSAhPT0gbmV4dFByb3BzLnR5cGUpO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbG9yICAgICA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUeXBlIHx8IG5ld0NvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lID0ge2BzcHJpdGUgJHt0aGlzLnByb3BzLnR5cGV9ICR7dGhpcy5wcm9wcy5jb2xvcn1gfSAvPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcblNwcml0ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICAgPSBTcHJpdGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0ZWQgQ29tcG9uZW50XHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyAgICA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZCAgIDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbiAgICBsaW5rTGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcbmNsYXNzIExhbmdMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSAgPSBJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLmxpbmtMYW5nKTtcclxuICAgICAgICBjb25zdCBsaXN0Q2xhc3MgPSBpc0FjdGl2ZSA/ICdhY3RpdmUnIDogJyc7XHJcblxyXG4gICAgICAgIGNvbnN0IHRpdGxlICAgICA9IHRoaXMucHJvcHMubGlua0xhbmcuZ2V0KCduYW1lJyk7XHJcbiAgICAgICAgY29uc3QgbGFiZWwgICAgID0gdGhpcy5wcm9wcy5saW5rTGFuZy5nZXQoJ2xhYmVsJyk7XHJcbiAgICAgICAgY29uc3QgbGluayAgICAgID0gZ2V0TGluayh0aGlzLnByb3BzLmxpbmtMYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWUgPSB7bGlzdENsYXNzfSB0aXRsZSA9IHt0aXRsZX0+XHJcbiAgICAgICAgICAgIDxhIGhyZWYgPSB7bGlua30+e2xhYmVsfTwvYT5cclxuICAgICAgICA8L2xpPjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQcml2YXRlIE1ldGhvZHNcclxuICpcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG4gICAgbGV0IGxpbmsgPSBgLyR7bGFuZ1NsdWd9YDtcclxuXHJcbiAgICBpZiAod29ybGQpIHtcclxuICAgICAgICBsZXQgd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnc2x1ZyddKTtcclxuICAgICAgICBsaW5rICs9IGAvJHt3b3JsZFNsdWd9YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGluaztcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0IE1vZHVsZVxyXG4gKlxyXG4gKi9cclxuXHJcbkxhbmdMaW5rLnByb3BUeXBlcyA9IHByb3BUeXBlcztcclxubW9kdWxlLmV4cG9ydHMgPSBMYW5nTGluaztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICpcclxuICogRGVwZW5kZW5jaWVzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgICAgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5jb25zdCBMYW5nTGluayAgPSByZXF1aXJlKCcuL0xhbmdMaW5rJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogRXhwb3J0ZWQgQ29tcG9uZW50XHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgcHJvcFR5cGVzID0ge1xyXG4gICAgbGFuZyA6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbiAgICB3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbn07XHJcblxyXG5jbGFzcyBMYW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMYW5nczo6cmVuZGVyKCknLCB0aGlzLnByb3BzLmxhbmcudG9KUygpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDx1bCBjbGFzc05hbWUgPSAnbmF2IG5hdmJhci1uYXYnPlxyXG4gICAgICAgICAgICB7U1RBVElDLmxhbmdzLm1hcCgobGlua0xhbmcsIGtleSkgPT5cclxuICAgICAgICAgICAgICAgIDxMYW5nTGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHtrZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua0xhbmcgPSB7bGlua0xhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyA9IHt0aGlzLnByb3BzLmxhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGQgPSB7dGhpcy5wcm9wcy53b3JsZH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC91bD47XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIEV4cG9ydCBNb2R1bGVcclxuICpcclxuICovXHJcblxyXG5MYW5ncy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XHJcbm1vZHVsZS5leHBvcnRzICA9IExhbmdzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBndzJhcGkgPSByZXF1aXJlKCdndzJhcGknKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGdldEd1aWxkRGV0YWlscyAgICAgICA6IGdldEd1aWxkRGV0YWlscyxcclxuICAgIGdldE1hdGNoZXMgICAgICAgICAgICA6IGdldE1hdGNoZXMsXHJcbiAgICBnZXRNYXRjaERldGFpbHNCeVdvcmxkOiBnZXRNYXRjaERldGFpbHNCeVdvcmxkLFxyXG4gICAgLy8gZ2V0TWF0Y2hEZXRhaWxzICAgIDogZ2V0TWF0Y2hEZXRhaWxzLFxyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGNhbGxiYWNrKSB7XHJcbiAgICBndzJhcGkuZ2V0TWF0Y2hlc1N0YXRlKGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMoZ3VpbGRJZCwgY2FsbGJhY2spIHtcclxuICAgIGd3MmFwaS5nZXRHdWlsZERldGFpbHMoe1xyXG4gICAgICAgIGd1aWxkX2lkOiBndWlsZElkLFxyXG4gICAgfSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIGZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhtYXRjaElkLCBjYWxsYmFjaykge1xyXG4vLyAgIGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7bWF0Y2hfaWQ6IG1hdGNoSWR9LCBjYWxsYmFjayk7XHJcbi8vIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCh3b3JsZFNsdWcsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBzZXRUaW1lb3V0KFxyXG4gICAgLy8gIGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZS5iaW5kKG51bGwsIHt3b3JsZF9zbHVnOiB3b3JsZFNsdWd9LCBjYWxsYmFjayksXHJcbiAgICAvLyAgMzAwMFxyXG4gICAgLy8gKTtcclxuICAgIGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7XHJcbiAgICAgICAgd29ybGRfc2x1Zzogd29ybGRTbHVnLFxyXG4gICAgfSwgY2FsbGJhY2spO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGFwaSAgICAgICA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuY29uc3QgU1RBVElDICAgID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcbmNsYXNzIE92ZXJ2aWV3RGF0YVByb3ZpZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0ZW5lcnMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGliOjpkYXRhOjpvdmVydmlldzo6Y29uc3RydWN0b3IoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX2xpc3RlbmVycyA9IGxpc3RlbmVycztcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IHt9O1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSB7fTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6b3ZlcnZpZXc6OmluaXQoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fX2dldERhdGEoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpjbG9zZSgpJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpbWVvdXRzICA9IF8ubWFwKHRoaXMuX190aW1lb3V0cywgIHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcclxuICAgICAgICB0aGlzLl9faW50ZXJ2YWxzID0gXy5tYXAodGhpcy5fX2ludGVydmFscywgaSA9PiBjbGVhckludGVydmFsKGkpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGdldFdvcmxkc0J5UmVnaW9uKGxhbmcpIHtcclxuICAgICAgICByZXR1cm4gSW1tdXRhYmxlXHJcbiAgICAgICAgICAgIC5TZXEoU1RBVElDLndvcmxkcylcclxuICAgICAgICAgICAgLm1hcCh3b3JsZCAgICAgPT4gZ2V0V29ybGRCeUxhbmcobGFuZywgd29ybGQpKVxyXG4gICAgICAgICAgICAuc29ydEJ5KHdvcmxkICA9PiB3b3JsZC5nZXQoJ25hbWUnKSlcclxuICAgICAgICAgICAgLmdyb3VwQnkod29ybGQgPT4gd29ybGQuZ2V0KCdyZWdpb24nKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZXRNYXRjaGVzQnlSZWdpb24obWF0Y2hEYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIEltbXV0YWJsZVxyXG4gICAgICAgICAgICAuU2VxKG1hdGNoRGF0YSlcclxuICAgICAgICAgICAgLmdyb3VwQnkobWF0Y2ggPT4gbWF0Y2guZ2V0KCdyZWdpb24nKS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBQcml2YXRlIE1ldGhvZHNcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgX19nZXREYXRhKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpfX2dldERhdGEoKScpO1xyXG4gICAgICAgIGFwaS5nZXRNYXRjaGVzKHRoaXMuX19vbk1hdGNoRGF0YS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIF9fc2V0RGF0YVRpbWVvdXQoKSB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBnZXRJbnRlcnZhbCgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpfX3NldERhdGFUaW1lb3V0KCknLCBpbnRlcnZhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cy5tYXRjaERhdGEgPSBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0RGF0YS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBpbnRlcnZhbFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX29uTWF0Y2hEYXRhKGVyciwgZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6Om92ZXJ2aWV3OjpfX29uTWF0Y2hEYXRhKCknLCBkYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9fbW91bnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYXRjaERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIWVyciAmJiBtYXRjaERhdGEgJiYgIW1hdGNoRGF0YS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgKHRoaXMuX19saXN0ZW5lcnMub25NYXRjaERhdGEgfHwgXy5ub29wKShtYXRjaERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fX3NldERhdGFUaW1lb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuICogRGF0YSAtIFdvcmxkc1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkQnlMYW5nKGxhbmcsIHdvcmxkKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgICA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcbiAgICBjb25zdCB3b3JsZEJ5TGFuZyA9IHdvcmxkLmdldChsYW5nU2x1Zyk7XHJcblxyXG4gICAgY29uc3QgcmVnaW9uICAgICAgPSB3b3JsZC5nZXQoJ3JlZ2lvbicpO1xyXG4gICAgY29uc3QgbGluayAgICAgICAgPSBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkQnlMYW5nKTtcclxuXHJcbiAgICByZXR1cm4gd29ybGRCeUxhbmcubWVyZ2Uoe1xyXG4gICAgICAgIGxpbmssXHJcbiAgICAgICAgcmVnaW9uLFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuICAgIHJldHVybiBbJycsIGxhbmdTbHVnLCB3b3JsZC5nZXQoJ3NsdWcnKV0uam9pbignLycpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEludGVydmFsKCkge1xyXG4gICAgcmV0dXJuIF8ucmFuZG9tKDIwMDAsIDQwMDApO1xyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3ZlcnZpZXdEYXRhUHJvdmlkZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbiAqXHJcbiAqIERlcGVuZGVuY2llc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBhc3luYyAgICAgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuY29uc3QgYXBpICAgICAgID0gcmVxdWlyZSgnbGliL2FwaScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIE1vZHVsZSBHbG9iYWxzXHJcbiAqXHJcbiAqL1xyXG5cclxuY29uc3QgZ3VpbGREZWZhdWx0ID0gSW1tdXRhYmxlLk1hcCh7XHJcbiAgICBsb2FkZWQgICAgOiBmYWxzZSxcclxuICAgIGxhc3RDbGFpbSA6IDAsXHJcbiAgICBjbGFpbXMgICAgOiBJbW11dGFibGUuTWFwKCksXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG51bVF1ZXVlQ29uY3VycmVudCA9IDg7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBQdWJsaWMgTWV0aG9kc1xyXG4gKlxyXG4gKi9cclxuXHJcbmNsYXNzIExpYkd1aWxkcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgICAgdGhpcy5fX2FzeW5jR3VpbGRRdWV1ZSA9IGFzeW5jLnF1ZXVlKFxyXG4gICAgICAgICAgICBnZXRHdWlsZERldGFpbHMsXHJcbiAgICAgICAgICAgIG51bVF1ZXVlQ29uY3VycmVudFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEd1aWxkRGVmYXVsdCgpIHtcclxuICAgICAgICByZXR1cm4gZ3VpbGREZWZhdWx0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0RXZlbnRzQnlUeXBlKG1hdGNoRGV0YWlscywgZXZlbnRUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoRGV0YWlsc1xyXG4gICAgICAgICAgICAuZ2V0KCdoaXN0b3J5JylcclxuICAgICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5nZXQoJ3R5cGUnKSA9PT0gZXZlbnRUeXBlKTtcclxuICAgICAgICAvLyAuc29ydEJ5KGVudHJ5ID0+IC1lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZUd1aWxkcywgbWF0Y2hEZXRhaWxzKSB7XHJcbiAgICAgICAgY29uc3QgY2xhaW1FdmVudHMgICAgICAgPSB0aGlzLmdldEV2ZW50c0J5VHlwZShtYXRjaERldGFpbHMsICdjbGFpbScpO1xyXG4gICAgICAgIGNvbnN0IG9iamVjdGl2ZUNsYWltZXJzID0gbWF0Y2hEZXRhaWxzLmdldEluKFsnb2JqZWN0aXZlcycsICdjbGFpbWVycyddKTtcclxuXHJcbiAgICAgICAgY29uc3Qga25vd25HdWlsZHMgPSBzdGF0ZUd1aWxkc1xyXG4gICAgICAgICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGRfaWQnKSlcclxuICAgICAgICAgICAgLnRvU2V0KCk7XHJcblxyXG5cclxuICAgICAgICBjb25zdCBndWlsZHNXaXRoQ3VycmVudENsYWltcyA9IG9iamVjdGl2ZUNsYWltZXJzXHJcbiAgICAgICAgICAgIC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpKVxyXG4gICAgICAgICAgICAudG9TZXQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuICAgICAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcbiAgICAgICAgICAgIC50b1NldCgpO1xyXG5cclxuICAgICAgICBjb25zdCBndWlsZENsYWltcyA9IGd1aWxkc1dpdGhDdXJyZW50Q2xhaW1zXHJcbiAgICAgICAgICAgIC51bmlvbihndWlsZHNXaXRoUHJldmlvdXNDbGFpbXMpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSBndWlsZENsYWltc1xyXG4gICAgICAgICAgICAuc3VidHJhY3Qoa25vd25HdWlsZHMpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2d1aWxkQ2xhaW1zJywgZ3VpbGRDbGFpbXMudG9BcnJheSgpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygna25vd25HdWlsZHMnLCBrbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1bmtub3duR3VpbGRzJywgdW5rbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdW5rbm93bkd1aWxkcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxvb2t1cChrbm93bkd1aWxkcywgbWF0Y2hEZXRhaWxzLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIGNvbnN0IHVua25vd25HdWlsZHMgPSB0aGlzLmdldFVua25vd25HdWlsZHMoa25vd25HdWlsZHMsIG1hdGNoRGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEd1aWxkID0gdGhpcy5nZXRHdWlsZERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdW5rbm93bkd1aWxkcy5mb3JFYWNoKGd1aWxkSWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgICAgICBjb25zdCBndWlsZCA9IGRlZmF1bHRHdWlsZC5zZXQoJ2d1aWxkX2lkJywgZ3VpbGRJZCk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyKGd1aWxkLCBndWlsZElkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCBmcm9tIHJlbW90ZVxyXG4gICAgICAgICAgICB0aGlzLl9fYXN5bmNHdWlsZFF1ZXVlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhdHRhY2hDbGFpbXMoY2xhaW1FdmVudHMsIGd1aWxkKSB7XHJcbiAgICAgICAgY29uc3QgZ3VpbGRJZCA9IGd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuICAgICAgICBjb25zdCBpbmNDbGFpbXMgPSBjbGFpbUV2ZW50c1xyXG4gICAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSA9PT0gZ3VpbGRJZClcclxuICAgICAgICAgICAgLnRvTWFwKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc0NsYWltcyAgICAgID0gZ3VpbGQuZ2V0KCdjbGFpbXMnKSAmJiAhZ3VpbGQuZ2V0KCdjbGFpbXMnKS5pc0VtcHR5KCk7XHJcbiAgICAgICAgY29uc3QgbmV3ZXN0Q2xhaW0gICAgPSBoYXNDbGFpbXMgPyBndWlsZC5nZXQoJ2NsYWltcycpLmZpcnN0KCkgOiBudWxsO1xyXG4gICAgICAgIGNvbnN0IGluY0hhc0NsYWltcyAgID0gIWluY0NsYWltcy5pc0VtcHR5KCk7XHJcbiAgICAgICAgY29uc3QgaW5jTmV3ZXN0Q2xhaW0gPSBpbmNIYXNDbGFpbXMgPyBpbmNDbGFpbXMuZmlyc3QoKSA6IG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc05ld0NsYWltcyAgID0gKCFJbW11dGFibGUuaXMobmV3ZXN0Q2xhaW0sIGluY05ld2VzdENsYWltKSk7XHJcblxyXG5cclxuICAgICAgICBpZiAoaGFzTmV3Q2xhaW1zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY05ld2VzdENsYWltLmdldCgndGltZXN0YW1wJykgOiAwO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2xhaW1zIGFsdGVyZWQnLCBndWlsZElkLCBoYXNOZXdDbGFpbXMsIGxhc3RDbGFpbSk7XHJcbiAgICAgICAgICAgIGd1aWxkID0gZ3VpbGQuc2V0KCdjbGFpbXMnLCBpbmNDbGFpbXMpO1xyXG4gICAgICAgICAgICBndWlsZCA9IGd1aWxkLnNldCgnbGFzdENsYWltJywgbGFzdENsYWltKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBndWlsZDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICpcclxuICogUHJpdmF0ZSBNZXRob2RzXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMoY2FyZ28sIG9uQ29tcGxldGUpIHtcclxuICAgIGFwaS5nZXRHdWlsZERldGFpbHMoXHJcbiAgICAgICAgY2FyZ28uZ3VpbGRJZCxcclxuICAgICAgICBvbkd1aWxkRGF0YS5iaW5kKG51bGwsIGNhcmdvKVxyXG4gICAgKTtcclxuXHJcbiAgICBvbkNvbXBsZXRlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25HdWlsZERhdGEoY2FyZ28sIGVyciwgZGF0YSkge1xyXG4gICAgaWYgKCFlcnIgJiYgZGF0YSkge1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmVtYmxlbTtcclxuICAgICAgICBkYXRhLmxvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGd1aWxkRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG4gICAgICAgIGNhcmdvLmxpc3RlbmVyKGd1aWxkRGF0YSwgY2FyZ28uZ3VpbGRJZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBFeHBvcnQgTW9kdWxlXHJcbiAqXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWJHdWlsZHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBfICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IEd1aWxkc0RBTyA9IHJlcXVpcmUoJy4vZ3VpbGRzJyk7XHJcblxyXG5jb25zdCBhcGkgICAgICAgPSByZXF1aXJlKCdsaWIvYXBpJyk7XHJcbmNvbnN0IFNUQVRJQyAgICA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5jbGFzcyBPdmVydmlld0RhdGFQcm92aWRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpYjo6ZGF0YTo6dHJhY2tlcjo6Y29uc3RydWN0b3IoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGFuZ1NsdWcgID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9fd29ybGRTbHVnID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ndWlsZHMgICAgICA9IG5ldyBHdWlsZHNEQU8oKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19tb3VudGVkICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9fbGlzdGVuZXJzID0gbGlzdGVuZXJzO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0ge307XHJcbiAgICAgICAgdGhpcy5fX2ludGVydmFscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaW5pdChsYW5nLCB3b3JsZCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmluaXQoKScpO1xyXG5cclxuICAgICAgICB0aGlzLl9fbGFuZ1NsdWcgID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuICAgICAgICB0aGlzLl9fd29ybGRTbHVnID0gd29ybGQuZ2V0SW4oW3RoaXMuX19sYW5nU2x1ZywgJ3NsdWcnXSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl9fbW91bnRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fX2dldERhdGEoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6OmNsb3NlKCknKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX21vdW50ZWQgICA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGltZW91dHMgID0gXy5tYXAodGhpcy5fX3RpbWVvdXRzLCAgdCA9PiBjbGVhclRpbWVvdXQodCkpO1xyXG4gICAgICAgIHRoaXMuX19pbnRlcnZhbHMgPSBfLm1hcCh0aGlzLl9faW50ZXJ2YWxzLCBpID0+IGNsZWFySW50ZXJ2YWwoaSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0TWF0Y2hXb3JsZHMobGFuZywgbWF0Y2gpIHtcclxuICAgICAgICByZXR1cm4gSW1tdXRhYmxlXHJcbiAgICAgICAgICAgIC5MaXN0KFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXSlcclxuICAgICAgICAgICAgLm1hcChnZXRNYXRjaFdvcmxkLmJpbmQobnVsbCwgbGFuZywgbWF0Y2gpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICpcclxuICAgICogICBQcml2YXRlIE1ldGhvZHNcclxuICAgICpcclxuICAgICovXHJcblxyXG4gICAgX19nZXREYXRhKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6Ol9fZ2V0RGF0YSgpJyk7XHJcblxyXG4gICAgICAgIGFwaS5nZXRNYXRjaERldGFpbHNCeVdvcmxkKFxyXG4gICAgICAgICAgICB0aGlzLl9fd29ybGRTbHVnLFxyXG4gICAgICAgICAgICB0aGlzLl9fb25NYXRjaERldGFpbHMuYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBfX29uTWF0Y2hEZXRhaWxzKGVyciwgZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaWI6OmRhdGE6OnRyYWNrZXI6Ol9fb25NYXRjaERhdGEoKScsIGRhdGEpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX19tb3VudGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAoIWVyciAmJiBkYXRhICYmIGRhdGEubWF0Y2ggJiYgZGF0YS5kZXRhaWxzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWVSZW1vdGUgID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhLm5vdyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoRGF0YSAgID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhLm1hdGNoKTtcclxuICAgICAgICAgICAgY29uc3QgZGV0YWlsc0RhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEuZGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9fbGlzdGVuZXJzLm9uTWF0Y2hEZXRhaWxzKHRpbWVSZW1vdGUsIG1hdGNoRGF0YSwgZGV0YWlsc0RhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuX19yZXNjaGVkdWxlRGF0YVVwZGF0ZS5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgX19yZXNjaGVkdWxlRGF0YVVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAgKiAyLCAxMDAwICogNCk7XHJcblxyXG4gICAgICAgIHRoaXMuX190aW1lb3V0cy5kYXRhID0gc2V0VGltZW91dCh0aGlzLl9fZ2V0RGF0YS5iaW5kKHRoaXMpLCByZWZyZXNoVGltZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiogICBXb3JsZHNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoV29ybGQobGFuZywgbWF0Y2gsIGNvbG9yKSB7XHJcbiAgICBjb25zdCBsYW5nU2x1ZyAgICA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcbiAgICBjb25zdCB3b3JsZEtleSAgICA9IGNvbG9yICsgJ0lkJztcclxuICAgIGNvbnN0IHdvcmxkSWQgICAgID0gbWF0Y2guZ2V0SW4oW3dvcmxkS2V5XSkudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IHdvcmxkQnlMYW5nID0gU1RBVElDLndvcmxkcy5nZXRJbihbd29ybGRJZCwgbGFuZ1NsdWddKTtcclxuXHJcbiAgICByZXR1cm4gd29ybGRCeUxhbmdcclxuICAgICAgICAuc2V0KCdjb2xvcicsIGNvbG9yKVxyXG4gICAgICAgIC5zZXQoJ2xpbmsnLCBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkQnlMYW5nKSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZCkge1xyXG4gICAgcmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPdmVydmlld0RhdGFQcm92aWRlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBkYXRlTm93OiBkYXRlTm93LFxyXG4gICAgYWRkNSAgIDogYWRkNSxcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBkYXRlTm93KCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoXy5ub3coKSAvIDEwMDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkNShpbkRhdGUpIHtcclxuICAgIGNvbnN0IF9iYXNlRGF0ZSA9IGluRGF0ZSB8fCBkYXRlTm93KCk7XHJcblxyXG4gICAgcmV0dXJuIChfYmFzZURhdGUgKyAoNSAqIDYwKSk7XHJcbn1cclxuIiwiY29uc3Qgc3RhdGljcyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGltbXV0YWJsZVN0YXRpY3MgPSB7XHJcbiAgICBsYW5ncyAgICAgICAgICAgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3MubGFuZ3MpLFxyXG4gICAgd29ybGRzICAgICAgICAgIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLndvcmxkcyksXHJcbiAgICBvYmplY3RpdmVfbmFtZXMgOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX25hbWVzKSxcclxuICAgIG9iamVjdGl2ZV90eXBlcyA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfdHlwZXMpLFxyXG4gICAgb2JqZWN0aXZlX21ldGEgIDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tZXRhKSxcclxuICAgIG9iamVjdGl2ZV9sYWJlbHM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbGFiZWxzKSxcclxuICAgIG9iamVjdGl2ZV9tYXAgICA6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbWFwKSxcclxufTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbW11dGFibGVTdGF0aWNzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBfICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgYXN5bmMgID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBidWZmVGltZSAgICAgPSA1ICogNjAgKiAxMDAwO1xyXG5jb25zdCBoaWdobGl0ZVRpbWUgPSAxMCAqIDEwMDA7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShyZW1vdGVPZmZzZXQ9MCwgY2I9Xy5ub29wKSB7XHJcbiAgICBjb25zdCB0aW1lTG9jYWwgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdGltZVJlbW90ZSA9IHRpbWVMb2NhbCAtIHJlbW90ZU9mZnNldDtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlJywgcmVtb3RlT2Zmc2V0LCB0aW1lTG9jYWwsIHRpbWVSZW1vdGUpO1xyXG5cclxuICAgIGxldCAkdGltZXJzICAgICA9ICQoJy50aW1lcicpO1xyXG4gICAgbGV0ICRjb3VudGRvd25zID0gJHRpbWVycy5maWx0ZXIoJy5jb3VudGRvd24nKTtcclxuICAgIGxldCAkcmVsYXRpdmVzICA9ICR0aW1lcnMuZmlsdGVyKCcucmVsYXRpdmUnKTtcclxuXHJcbiAgICBhc3luYy5wYXJhbGxlbChbXHJcbiAgICAgICAgdXBkYXRlUmVsYXRpdmVUaW1lcnMuYmluZChudWxsLCAkcmVsYXRpdmVzLCByZW1vdGVPZmZzZXQpLFxyXG4gICAgICAgIHVwZGF0ZUNvdW50ZG93blRpbWVycy5iaW5kKG51bGwsICRjb3VudGRvd25zLCB0aW1lUmVtb3RlKSxcclxuICAgIF0sIGNiKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZVRpbWVycyhyZWxhdGl2ZXMsIG9mZnNldCwgY2IpIHtcclxuICAgIGFzeW5jLmVhY2goXHJcbiAgICAgICAgcmVsYXRpdmVzLFxyXG4gICAgICAgIHVwZGF0ZVJlbGF0aXZlVGltZU5vZGUuYmluZChudWxsLCBvZmZzZXQpLFxyXG4gICAgICAgIGNiXHJcbiAgICApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVycyhjb3VudGRvd25zLCB0aW1lUmVtb3RlLCBjYikge1xyXG4gICAgYXN5bmMuZWFjaChcclxuICAgICAgICBjb3VudGRvd25zLFxyXG4gICAgICAgIHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZS5iaW5kKG51bGwsIHRpbWVSZW1vdGUpLFxyXG4gICAgICAgIGNiXHJcbiAgICApO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbGF0aXZlVGltZU5vZGUob2Zmc2V0LCBlbCwgbmV4dCkge1xyXG4gICAgY29uc3QgJGVsID0gJChlbCk7XHJcblxyXG4gICAgY29uc3QgdGltZXN0YW1wICAgICAgICAgPSBfLnBhcnNlSW50KCRlbC5hdHRyKCdkYXRhLXRpbWVzdGFtcCcpKTtcclxuICAgIGNvbnN0IG9mZnNldFRpbWVzdGFtcCAgID0gKHRpbWVzdGFtcCAqIDEwMDApICsgb2Zmc2V0O1xyXG4gICAgY29uc3QgdGltZXN0YW1wTW9tZW50ICAgPSBtb21lbnQob2Zmc2V0VGltZXN0YW1wKTtcclxuICAgIGNvbnN0IHRpbWVzdGFtcFJlbGF0aXZlID0gdGltZXN0YW1wTW9tZW50LnR3aXR0ZXJTaG9ydCgpO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKG9mZnNldCwgJGVsLCB0aW1lc3RhbXAsIG9mZnNldFRpbWVzdGFtcCwgdGltZXN0YW1wTW9tZW50KTtcclxuXHJcbiAgICAkZWwudGV4dCh0aW1lc3RhbXBSZWxhdGl2ZSk7XHJcblxyXG4gICAgbmV4dCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZSh0aW1lUmVtb3RlLCBlbCwgbmV4dCkge1xyXG4gICAgY29uc3QgJGVsID0gJChlbCk7XHJcblxyXG4gICAgY29uc3QgdGltZXN0YW1wICAgPSBfLnBhcnNlSW50KCRlbC5hdHRyKCdkYXRhLXRpbWVzdGFtcCcpKSAqIDEwMDA7XHJcbiAgICBjb25zdCBleHBpcmVzICAgICA9IHRpbWVzdGFtcCArIGJ1ZmZUaW1lO1xyXG4gICAgY29uc3QgbXNSZW1haW5pbmcgPSBleHBpcmVzIC0gdGltZVJlbW90ZTtcclxuICAgIGNvbnN0IG1zRWxhcHNlZCAgID0gYnVmZlRpbWUgLSBtc1JlbWFpbmluZztcclxuXHJcblxyXG4gICAgY29uc3QgaXNWaXNpYmxlICAgICA9IGV4cGlyZXMgKyBoaWdobGl0ZVRpbWUgPj0gdGltZVJlbW90ZTtcclxuICAgIGNvbnN0IGlzRXhwaXJlZCAgICAgPSBleHBpcmVzIDwgdGltZVJlbW90ZTtcclxuICAgIGNvbnN0IGlzQWN0aXZlICAgICAgPSAhaXNFeHBpcmVkO1xyXG4gICAgY29uc3QgaXNIaWdobGlnaHRlZCA9IChtc1JlbWFpbmluZyA8PSBNYXRoLmFicyhoaWdobGl0ZVRpbWUpKTtcclxuICAgIGNvbnN0IGlzRnJlc2ggICAgICAgPSAobXNFbGFwc2VkIDw9IGhpZ2hsaXRlVGltZSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgaWYgKGlzVmlzaWJsZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9IChpc0FjdGl2ZSkgPyBtb21lbnQobXNSZW1haW5pbmcpLmZvcm1hdCgnbTpzcycpIDogJzA6MDAnO1xyXG5cclxuICAgICAgICBjb25zdCAkb2JqZWN0aXZlICAgICAgICA9ICRlbC5jbG9zZXN0KCcub2JqZWN0aXZlJyk7XHJcbiAgICAgICAgY29uc3QgaGFzQ2xhc3NIaWdobGlnaHQgPSAkb2JqZWN0aXZlLmhhc0NsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgICAgICBjb25zdCBoYXNDbGFzc0ZyZXNoICAgICA9ICRvYmplY3RpdmUuaGFzQ2xhc3MoJ2ZyZXNoJyk7XHJcblxyXG4gICAgICAgIGlmIChpc0hpZ2hsaWdodGVkICYmICFoYXNDbGFzc0hpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICAkb2JqZWN0aXZlLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFpc0hpZ2hsaWdodGVkICYmIGhhc0NsYXNzSGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvYmplY3RpdmUucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzRnJlc2ggJiYgIWhhc0NsYXNzRnJlc2gpIHtcclxuICAgICAgICAgICAgJG9iamVjdGl2ZS5hZGRDbGFzcygnZnJlc2gnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFpc0ZyZXNoICYmIGhhc0NsYXNzRnJlc2gpIHtcclxuICAgICAgICAgICAgJG9iamVjdGl2ZS5yZW1vdmVDbGFzcygnZnJlc2gnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRlbC50ZXh0KHRpbWVyVGV4dClcclxuICAgICAgICAgICAgLmZpbHRlcignLmluYWN0aXZlJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJylcclxuICAgICAgICAgICAgLmVuZCgpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJGVsLmZpbHRlcignLmFjdGl2ZScpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnaW5hY3RpdmUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0JylcclxuICAgICAgICAgICAgLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7dXBkYXRlfTtcclxuIl19
