/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 136);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var core = __webpack_require__(7);
var hide = __webpack_require__(14);
var redefine = __webpack_require__(11);
var ctx = __webpack_require__(17);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(50)('wks');
var uid = __webpack_require__(31);
var Symbol = __webpack_require__(1).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(19);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(2)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(3);
var IE8_DOM_DEFINE = __webpack_require__(96);
var toPrimitive = __webpack_require__(28);
var dP = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var hide = __webpack_require__(14);
var has = __webpack_require__(13);
var SRC = __webpack_require__(31)('src');
var $toString = __webpack_require__(141);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(7).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var fails = __webpack_require__(2);
var defined = __webpack_require__(24);
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(9);
var createDesc = __webpack_require__(30);
module.exports = __webpack_require__(8) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(46);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(2);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(18);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(47);
var createDesc = __webpack_require__(30);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(28);
var has = __webpack_require__(13);
var IE8_DOM_DEFINE = __webpack_require__(96);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(7);
var fails = __webpack_require__(2);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(17);
var IObject = __webpack_require__(46);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(6);
var asc = __webpack_require__(112);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__(8)) {
  var LIBRARY = __webpack_require__(32);
  var global = __webpack_require__(1);
  var fails = __webpack_require__(2);
  var $export = __webpack_require__(0);
  var $typed = __webpack_require__(61);
  var $buffer = __webpack_require__(89);
  var ctx = __webpack_require__(17);
  var anInstance = __webpack_require__(44);
  var propertyDesc = __webpack_require__(30);
  var hide = __webpack_require__(14);
  var redefineAll = __webpack_require__(45);
  var toInteger = __webpack_require__(19);
  var toLength = __webpack_require__(6);
  var toIndex = __webpack_require__(123);
  var toAbsoluteIndex = __webpack_require__(34);
  var toPrimitive = __webpack_require__(28);
  var has = __webpack_require__(13);
  var classof = __webpack_require__(48);
  var isObject = __webpack_require__(4);
  var toObject = __webpack_require__(10);
  var isArrayIter = __webpack_require__(81);
  var create = __webpack_require__(35);
  var getPrototypeOf = __webpack_require__(37);
  var gOPN = __webpack_require__(36).f;
  var getIterFn = __webpack_require__(83);
  var uid = __webpack_require__(31);
  var wks = __webpack_require__(5);
  var createArrayMethod = __webpack_require__(22);
  var createArrayIncludes = __webpack_require__(51);
  var speciesConstructor = __webpack_require__(49);
  var ArrayIterators = __webpack_require__(85);
  var Iterators = __webpack_require__(42);
  var $iterDetect = __webpack_require__(54);
  var setSpecies = __webpack_require__(43);
  var arrayFill = __webpack_require__(84);
  var arrayCopyWithin = __webpack_require__(114);
  var $DP = __webpack_require__(9);
  var $GOPD = __webpack_require__(20);
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Stores basic information that all html components use

*/

var Html = function () {
    function Html(config) {
        _classCallCheck(this, Html);

        if (!config) {
            config = {};
        }
        this._config = config;

        config = this.setConfigDefaults({
            parent: document.body
        });

        this.template = '<div>Hello World!</div>';
        this.node = $(this.template);
        this.parent = $(config.parent);
        this.attr = {};
        this.prop = {};
        this.css = {};
        this.class = '';
    }

    _createClass(Html, [{
        key: 'assignConfig',
        value: function assignConfig(config) {
            Object.assign(this, config);
        }
    }, {
        key: '_render',
        value: function _render(parent) {
            if (this._rendered) {
                console.warn('Element tried to render more than once.');console.trace();
                return;
            }

            // convert template html into a node
            this.node = $(this.template);

            // assign attributes
            // Attributes are assigned first since they must be strings
            this.node.attr(this.attr);

            // assign properties
            // prop and attr can assign the same things to an element,
            // but prop allows for non-string values.
            this.node.prop(this.prop);

            // Apply inline styling
            this.node.css(this.css);

            // add styling classes
            this.node.addClass(this.class);

            // Append object to parent
            this.parent.append(this.node[0]);

            this._rendered = true;
        }
    }, {
        key: 'render',
        value: function render(parent) {
            this._render(parent);
        }
    }, {
        key: 'renderToParent',
        value: function renderToParent() {
            this.render(this.parent);
        }
    }, {
        key: 'setConfigDefaults',
        value: function setConfigDefaults(defaults, assign) {
            var config = void 0,
                item = void 0,
                key = void 0;

            config = this._config;

            if (!config) {
                config = {};
            }

            for (key in defaults) {
                item = defaults[key];

                if (!(key in config)) {
                    config[key] = item;
                }
            }

            return config;
        }
    }]);

    return Html;
}();

exports.default = Html;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Serves as the base component for SVG elements
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Svg = function (_Html) {
    _inherits(Svg, _Html);

    function Svg(config) {
        _classCallCheck(this, Svg);

        // Modify properties to better suit use in SVG
        var _this = _possibleConstructorReturn(this, (Svg.__proto__ || Object.getPrototypeOf(Svg)).call(this, config));
        // Run HTML Object Setup


        _this.element = 'g';
        _this.innerHTML = '';
        _this.svg = {
            height: '100px',
            width: '100px',
            x: 10,
            y: 10
        };
        return _this;
    }

    _createClass(Svg, [{
        key: '_render',
        value: function _render(parent) {
            if (this._rendered) {
                console.warn('Element tried to render more than once.');console.trace();
                return;
            }

            // convert template html into a node
            this.node = $(document.createElementNS('http://www.w3.org/2000/svg', this.element));

            // assign attributes
            // Attributes are assigned first since they must be strings
            this.node.attr(this.attr);

            // assign properties
            // prop and attr can assign the same things to an element,
            // but prop allows for non-string values.
            this.node.prop(this.prop);

            // Apply inline styling
            this.node.css(this.css);

            // add styling classes
            this.node.addClass(this.class);

            // Append object to parent
            this.parent.append(this.node[0]);

            this.updateNode();

            this.node.html(this.innerHTML);

            this._rendered = true;
        }
    }, {
        key: '_getNamespaceForAttribute',
        value: function _getNamespaceForAttribute(attr) {
            switch (attr) {
                case 'some-property':
                    return 'http://www.w3.org/1999/xlink';
                default:
                    return null;
            }
        }
    }, {
        key: 'updateNode',
        value: function updateNode() {
            var item = void 0,
                key = void 0,
                list = void 0,
                ns = void 0;
            list = this.svg;
            for (key in list) {
                item = list[key];

                ns = this._getNamespaceForAttribute(key);
                this.node[0].setAttributeNS(ns, key, item);
            }
        }
    }]);

    return Svg;
}(_HTML2.default);

exports.default = Svg;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(31)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(13);
var setDesc = __webpack_require__(9).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(2)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(98);
var enumBugKeys = __webpack_require__(68);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(19);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(3);
var dPs = __webpack_require__(99);
var enumBugKeys = __webpack_require__(68);
var IE_PROTO = __webpack_require__(67)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(65)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(69).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(98);
var hiddenKeys = __webpack_require__(68).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(13);
var toObject = __webpack_require__(10);
var IE_PROTO = __webpack_require__(67)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(14)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(9).f;
var has = __webpack_require__(13);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(24);
var fails = __webpack_require__(2);
var spaces = __webpack_require__(71);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(1);
var dP = __webpack_require__(9);
var DESCRIPTORS = __webpack_require__(8);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(11);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(23);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(23);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(3);
var aFunction = __webpack_require__(18);
var SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(7);
var global = __webpack_require__(1);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(32) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(6);
var toAbsoluteIndex = __webpack_require__(34);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 52 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(23);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(3);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(48);
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(116);
var redefine = __webpack_require__(11);
var hide = __webpack_require__(14);
var fails = __webpack_require__(2);
var defined = __webpack_require__(24);
var wks = __webpack_require__(5);
var regexpExec = __webpack_require__(86);

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(17);
var call = __webpack_require__(111);
var isArrayIter = __webpack_require__(81);
var anObject = __webpack_require__(3);
var toLength = __webpack_require__(6);
var getIterFn = __webpack_require__(83);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(1);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(11);
var redefineAll = __webpack_require__(45);
var meta = __webpack_require__(29);
var forOf = __webpack_require__(58);
var anInstance = __webpack_require__(44);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(2);
var $iterDetect = __webpack_require__(54);
var setToStringTag = __webpack_require__(40);
var inheritIfRequired = __webpack_require__(72);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var hide = __webpack_require__(14);
var uid = __webpack_require__(31);
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Allows labels to be created inside of an svg element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgLabel = function (_Svg) {
    _inherits(SvgLabel, _Svg);

    function SvgLabel(config) {
        _classCallCheck(this, SvgLabel);

        var _this = _possibleConstructorReturn(this, (SvgLabel.__proto__ || Object.getPrototypeOf(SvgLabel)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'text',
            innerHTML: 'Hello World!',
            svg: {
                x: 0,
                y: 20
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    return SvgLabel;
}(_SVG2.default);

exports.default = SvgLabel;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages the rendering of a SVG line between two points
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgLine = function (_Svg) {
    _inherits(SvgLine, _Svg);

    function SvgLine(config) {
        _classCallCheck(this, SvgLine);

        var _this = _possibleConstructorReturn(this, (SvgLine.__proto__ || Object.getPrototypeOf(SvgLine)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'line',
            svg: {
                x1: 5, x2: 50,
                y1: 50, y2: 10,
                stroke: 'white',
                'stroke-width': 2,
                width: 2
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    // Move the whole line


    _createClass(SvgLine, [{
        key: 'moveBy',
        value: function moveBy(x, y) {
            if (isNaN(x)) {
                x = 0;
            }
            if (isNaN(y)) {
                y = 0;
            }

            this.svg.x1 += x;
            this.svg.x2 += x;
            this.svg.y1 += y;
            this.svg.y2 += y;

            this.updateNode();
        }

        // Set the draw coordinates of the line

    }, {
        key: 'setPosition',
        value: function setPosition(x1, x2, y1, y2) {
            if (isNaN(x1)) {
                x1 = this.svg.x1;
            }
            if (isNaN(x2)) {
                x1 = this.svg.x2;
            }
            if (isNaN(y1)) {
                x1 = this.svg.y1;
            }
            if (isNaN(y2)) {
                x1 = this.svg.y2;
            }

            this.svg.x1 = x1;
            this.svg.x2 = x2;
            this.svg.y1 = y1;
            this.svg.y2 = y2;

            this.updateNode();
        }
    }]);

    return SvgLine;
}(_SVG2.default);

exports.default = SvgLine;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages rendering of an svg box element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgBox = function (_Svg) {
    _inherits(SvgBox, _Svg);

    function SvgBox(config) {
        _classCallCheck(this, SvgBox);

        var _this = _possibleConstructorReturn(this, (SvgBox.__proto__ || Object.getPrototypeOf(SvgBox)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'rect',
            svg: {
                x: 10, y: 10,
                height: 25, width: 25,
                fill: 'white',
                stroke: 'red',
                'stroke-width': 2
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    return SvgBox;
}(_SVG2.default);

exports.default = SvgBox;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(1).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(50)('keys');
var uid = __webpack_require__(31);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(1).document;
module.exports = document && document.documentElement;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(3);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(17)(Function.call, __webpack_require__(20).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var setPrototypeOf = __webpack_require__(70).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(19);
var defined = __webpack_require__(24);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};


/***/ }),
/* 75 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(19);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(32);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(11);
var hide = __webpack_require__(14);
var Iterators = __webpack_require__(42);
var $iterCreate = __webpack_require__(110);
var setToStringTag = __webpack_require__(40);
var getPrototypeOf = __webpack_require__(37);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(79);
var defined = __webpack_require__(24);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4);
var cof = __webpack_require__(23);
var MATCH = __webpack_require__(5)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(42);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(9);
var createDesc = __webpack_require__(30);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(48);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(42);
module.exports = __webpack_require__(7).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(10);
var toAbsoluteIndex = __webpack_require__(34);
var toLength = __webpack_require__(6);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(38);
var step = __webpack_require__(115);
var Iterators = __webpack_require__(42);
var toIObject = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(77)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(55);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(76)(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(17);
var invoke = __webpack_require__(104);
var html = __webpack_require__(69);
var cel = __webpack_require__(65);
var global = __webpack_require__(1);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(23)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(1);
var DESCRIPTORS = __webpack_require__(8);
var LIBRARY = __webpack_require__(32);
var $typed = __webpack_require__(61);
var hide = __webpack_require__(14);
var redefineAll = __webpack_require__(45);
var fails = __webpack_require__(2);
var anInstance = __webpack_require__(44);
var toInteger = __webpack_require__(19);
var toLength = __webpack_require__(6);
var toIndex = __webpack_require__(123);
var gOPN = __webpack_require__(36).f;
var dP = __webpack_require__(9).f;
var arrayFill = __webpack_require__(84);
var setToStringTag = __webpack_require__(40);
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),
/* 90 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(128)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * anime.js v3.1.0
 * (c) 2019 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

!function(n,e){ true?module.exports=e():"function"==typeof define&&define.amd?define(e):n.anime=e()}(this,function(){"use strict";var n={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},e={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},r=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective"],t={CSS:{},springs:{}};function a(n,e,r){return Math.min(Math.max(n,e),r)}function o(n,e){return n.indexOf(e)>-1}function u(n,e){return n.apply(null,e)}var i={arr:function(n){return Array.isArray(n)},obj:function(n){return o(Object.prototype.toString.call(n),"Object")},pth:function(n){return i.obj(n)&&n.hasOwnProperty("totalLength")},svg:function(n){return n instanceof SVGElement},inp:function(n){return n instanceof HTMLInputElement},dom:function(n){return n.nodeType||i.svg(n)},str:function(n){return"string"==typeof n},fnc:function(n){return"function"==typeof n},und:function(n){return void 0===n},hex:function(n){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n)},rgb:function(n){return/^rgb/.test(n)},hsl:function(n){return/^hsl/.test(n)},col:function(n){return i.hex(n)||i.rgb(n)||i.hsl(n)},key:function(r){return!n.hasOwnProperty(r)&&!e.hasOwnProperty(r)&&"targets"!==r&&"keyframes"!==r}};function c(n){var e=/\(([^)]+)\)/.exec(n);return e?e[1].split(",").map(function(n){return parseFloat(n)}):[]}function s(n,e){var r=c(n),o=a(i.und(r[0])?1:r[0],.1,100),u=a(i.und(r[1])?100:r[1],.1,100),s=a(i.und(r[2])?10:r[2],.1,100),f=a(i.und(r[3])?0:r[3],.1,100),l=Math.sqrt(u/o),d=s/(2*Math.sqrt(u*o)),p=d<1?l*Math.sqrt(1-d*d):0,h=1,v=d<1?(d*l-f)/p:-f+l;function g(n){var r=e?e*n/1e3:n;return r=d<1?Math.exp(-r*d*l)*(h*Math.cos(p*r)+v*Math.sin(p*r)):(h+v*r)*Math.exp(-r*l),0===n||1===n?n:1-r}return e?g:function(){var e=t.springs[n];if(e)return e;for(var r=0,a=0;;)if(1===g(r+=1/6)){if(++a>=16)break}else a=0;var o=r*(1/6)*1e3;return t.springs[n]=o,o}}function f(n){return void 0===n&&(n=10),function(e){return Math.round(e*n)*(1/n)}}var l,d,p=function(){var n=11,e=1/(n-1);function r(n,e){return 1-3*e+3*n}function t(n,e){return 3*e-6*n}function a(n){return 3*n}function o(n,e,o){return((r(e,o)*n+t(e,o))*n+a(e))*n}function u(n,e,o){return 3*r(e,o)*n*n+2*t(e,o)*n+a(e)}return function(r,t,a,i){if(0<=r&&r<=1&&0<=a&&a<=1){var c=new Float32Array(n);if(r!==t||a!==i)for(var s=0;s<n;++s)c[s]=o(s*e,r,a);return function(n){return r===t&&a===i?n:0===n||1===n?n:o(f(n),t,i)}}function f(t){for(var i=0,s=1,f=n-1;s!==f&&c[s]<=t;++s)i+=e;var l=i+(t-c[--s])/(c[s+1]-c[s])*e,d=u(l,r,a);return d>=.001?function(n,e,r,t){for(var a=0;a<4;++a){var i=u(e,r,t);if(0===i)return e;e-=(o(e,r,t)-n)/i}return e}(t,l,r,a):0===d?l:function(n,e,r,t,a){for(var u,i,c=0;(u=o(i=e+(r-e)/2,t,a)-n)>0?r=i:e=i,Math.abs(u)>1e-7&&++c<10;);return i}(t,i,i+e,r,a)}}}(),h=(l={linear:function(){return function(n){return n}}},d={Sine:function(){return function(n){return 1-Math.cos(n*Math.PI/2)}},Circ:function(){return function(n){return 1-Math.sqrt(1-n*n)}},Back:function(){return function(n){return n*n*(3*n-2)}},Bounce:function(){return function(n){for(var e,r=4;n<((e=Math.pow(2,--r))-1)/11;);return 1/Math.pow(4,3-r)-7.5625*Math.pow((3*e-2)/22-n,2)}},Elastic:function(n,e){void 0===n&&(n=1),void 0===e&&(e=.5);var r=a(n,1,10),t=a(e,.1,2);return function(n){return 0===n||1===n?n:-r*Math.pow(2,10*(n-1))*Math.sin((n-1-t/(2*Math.PI)*Math.asin(1/r))*(2*Math.PI)/t)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach(function(n,e){d[n]=function(){return function(n){return Math.pow(n,e+2)}}}),Object.keys(d).forEach(function(n){var e=d[n];l["easeIn"+n]=e,l["easeOut"+n]=function(n,r){return function(t){return 1-e(n,r)(1-t)}},l["easeInOut"+n]=function(n,r){return function(t){return t<.5?e(n,r)(2*t)/2:1-e(n,r)(-2*t+2)/2}}}),l);function v(n,e){if(i.fnc(n))return n;var r=n.split("(")[0],t=h[r],a=c(n);switch(r){case"spring":return s(n,e);case"cubicBezier":return u(p,a);case"steps":return u(f,a);default:return u(t,a)}}function g(n){try{return document.querySelectorAll(n)}catch(n){return}}function m(n,e){for(var r=n.length,t=arguments.length>=2?arguments[1]:void 0,a=[],o=0;o<r;o++)if(o in n){var u=n[o];e.call(t,u,o,n)&&a.push(u)}return a}function y(n){return n.reduce(function(n,e){return n.concat(i.arr(e)?y(e):e)},[])}function b(n){return i.arr(n)?n:(i.str(n)&&(n=g(n)||n),n instanceof NodeList||n instanceof HTMLCollection?[].slice.call(n):[n])}function M(n,e){return n.some(function(n){return n===e})}function x(n){var e={};for(var r in n)e[r]=n[r];return e}function w(n,e){var r=x(n);for(var t in n)r[t]=e.hasOwnProperty(t)?e[t]:n[t];return r}function k(n,e){var r=x(n);for(var t in e)r[t]=i.und(n[t])?e[t]:n[t];return r}function O(n){return i.rgb(n)?(r=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e=n))?"rgba("+r[1]+",1)":e:i.hex(n)?(t=n.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(n,e,r,t){return e+e+r+r+t+t}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),"rgba("+parseInt(a[1],16)+","+parseInt(a[2],16)+","+parseInt(a[3],16)+",1)"):i.hsl(n)?function(n){var e,r,t,a=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(n)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(n),o=parseInt(a[1],10)/360,u=parseInt(a[2],10)/100,i=parseInt(a[3],10)/100,c=a[4]||1;function s(n,e,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?n+6*(e-n)*r:r<.5?e:r<2/3?n+(e-n)*(2/3-r)*6:n}if(0==u)e=r=t=i;else{var f=i<.5?i*(1+u):i+u-i*u,l=2*i-f;e=s(l,f,o+1/3),r=s(l,f,o),t=s(l,f,o-1/3)}return"rgba("+255*e+","+255*r+","+255*t+","+c+")"}(n):void 0;var e,r,t,a}function C(n){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(n);if(e)return e[1]}function B(n,e){return i.fnc(n)?n(e.target,e.id,e.total):n}function P(n,e){return n.getAttribute(e)}function I(n,e,r){if(M([r,"deg","rad","turn"],C(e)))return e;var a=t.CSS[e+r];if(!i.und(a))return a;var o=document.createElement(n.tagName),u=n.parentNode&&n.parentNode!==document?n.parentNode:document.body;u.appendChild(o),o.style.position="absolute",o.style.width=100+r;var c=100/o.offsetWidth;u.removeChild(o);var s=c*parseFloat(e);return t.CSS[e+r]=s,s}function T(n,e,r){if(e in n.style){var t=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=n.style[e]||getComputedStyle(n).getPropertyValue(t)||"0";return r?I(n,a,r):a}}function D(n,e){return i.dom(n)&&!i.inp(n)&&(P(n,e)||i.svg(n)&&n[e])?"attribute":i.dom(n)&&M(r,e)?"transform":i.dom(n)&&"transform"!==e&&T(n,e)?"css":null!=n[e]?"object":void 0}function E(n){if(i.dom(n)){for(var e,r=n.style.transform||"",t=/(\w+)\(([^)]*)\)/g,a=new Map;e=t.exec(r);)a.set(e[1],e[2]);return a}}function F(n,e,r,t){var a,u=o(e,"scale")?1:0+(o(a=e,"translate")||"perspective"===a?"px":o(a,"rotate")||o(a,"skew")?"deg":void 0),i=E(n).get(e)||u;return r&&(r.transforms.list.set(e,i),r.transforms.last=e),t?I(n,i,t):i}function N(n,e,r,t){switch(D(n,e)){case"transform":return F(n,e,t,r);case"css":return T(n,e,r);case"attribute":return P(n,e);default:return n[e]||0}}function A(n,e){var r=/^(\*=|\+=|-=)/.exec(n);if(!r)return n;var t=C(n)||0,a=parseFloat(e),o=parseFloat(n.replace(r[0],""));switch(r[0][0]){case"+":return a+o+t;case"-":return a-o+t;case"*":return a*o+t}}function L(n,e){if(i.col(n))return O(n);if(/\s/g.test(n))return n;var r=C(n),t=r?n.substr(0,n.length-r.length):n;return e?t+e:t}function j(n,e){return Math.sqrt(Math.pow(e.x-n.x,2)+Math.pow(e.y-n.y,2))}function S(n){for(var e,r=n.points,t=0,a=0;a<r.numberOfItems;a++){var o=r.getItem(a);a>0&&(t+=j(e,o)),e=o}return t}function q(n){if(n.getTotalLength)return n.getTotalLength();switch(n.tagName.toLowerCase()){case"circle":return o=n,2*Math.PI*P(o,"r");case"rect":return 2*P(a=n,"width")+2*P(a,"height");case"line":return j({x:P(t=n,"x1"),y:P(t,"y1")},{x:P(t,"x2"),y:P(t,"y2")});case"polyline":return S(n);case"polygon":return r=(e=n).points,S(e)+j(r.getItem(r.numberOfItems-1),r.getItem(0))}var e,r,t,a,o}function $(n,e){var r=e||{},t=r.el||function(n){for(var e=n.parentNode;i.svg(e)&&i.svg(e.parentNode);)e=e.parentNode;return e}(n),a=t.getBoundingClientRect(),o=P(t,"viewBox"),u=a.width,c=a.height,s=r.viewBox||(o?o.split(" "):[0,0,u,c]);return{el:t,viewBox:s,x:s[0]/1,y:s[1]/1,w:u/s[2],h:c/s[3]}}function X(n,e){function r(r){void 0===r&&(r=0);var t=e+r>=1?e+r:0;return n.el.getPointAtLength(t)}var t=$(n.el,n.svg),a=r(),o=r(-1),u=r(1);switch(n.property){case"x":return(a.x-t.x)*t.w;case"y":return(a.y-t.y)*t.h;case"angle":return 180*Math.atan2(u.y-o.y,u.x-o.x)/Math.PI}}function Y(n,e){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,t=L(i.pth(n)?n.totalLength:n,e)+"";return{original:t,numbers:t.match(r)?t.match(r).map(Number):[0],strings:i.str(n)||e?t.split(r):[]}}function Z(n){return m(n?y(i.arr(n)?n.map(b):b(n)):[],function(n,e,r){return r.indexOf(n)===e})}function Q(n){var e=Z(n);return e.map(function(n,r){return{target:n,id:r,total:e.length,transforms:{list:E(n)}}})}function V(n,e){var r=x(e);if(/^spring/.test(r.easing)&&(r.duration=s(r.easing)),i.arr(n)){var t=n.length;2===t&&!i.obj(n[0])?n={value:n}:i.fnc(e.duration)||(r.duration=e.duration/t)}var a=i.arr(n)?n:[n];return a.map(function(n,r){var t=i.obj(n)&&!i.pth(n)?n:{value:n};return i.und(t.delay)&&(t.delay=r?0:e.delay),i.und(t.endDelay)&&(t.endDelay=r===a.length-1?e.endDelay:0),t}).map(function(n){return k(n,r)})}function z(n,e){var r=[],t=e.keyframes;for(var a in t&&(e=k(function(n){for(var e=m(y(n.map(function(n){return Object.keys(n)})),function(n){return i.key(n)}).reduce(function(n,e){return n.indexOf(e)<0&&n.push(e),n},[]),r={},t=function(t){var a=e[t];r[a]=n.map(function(n){var e={};for(var r in n)i.key(r)?r==a&&(e.value=n[r]):e[r]=n[r];return e})},a=0;a<e.length;a++)t(a);return r}(t),e)),e)i.key(a)&&r.push({name:a,tweens:V(e[a],n)});return r}function H(n,e){var r;return n.tweens.map(function(t){var a=function(n,e){var r={};for(var t in n){var a=B(n[t],e);i.arr(a)&&1===(a=a.map(function(n){return B(n,e)})).length&&(a=a[0]),r[t]=a}return r.duration=parseFloat(r.duration),r.delay=parseFloat(r.delay),r}(t,e),o=a.value,u=i.arr(o)?o[1]:o,c=C(u),s=N(e.target,n.name,c,e),f=r?r.to.original:s,l=i.arr(o)?o[0]:f,d=C(l)||C(s),p=c||d;return i.und(u)&&(u=f),a.from=Y(l,p),a.to=Y(A(u,l),p),a.start=r?r.end:0,a.end=a.start+a.delay+a.duration+a.endDelay,a.easing=v(a.easing,a.duration),a.isPath=i.pth(o),a.isColor=i.col(a.from.original),a.isColor&&(a.round=1),r=a,a})}var G={css:function(n,e,r){return n.style[e]=r},attribute:function(n,e,r){return n.setAttribute(e,r)},object:function(n,e,r){return n[e]=r},transform:function(n,e,r,t,a){if(t.list.set(e,r),e===t.last||a){var o="";t.list.forEach(function(n,e){o+=e+"("+n+") "}),n.style.transform=o}}};function R(n,e){Q(n).forEach(function(n){for(var r in e){var t=B(e[r],n),a=n.target,o=C(t),u=N(a,r,o,n),i=A(L(t,o||C(u)),u),c=D(a,r);G[c](a,r,i,n.transforms,!0)}})}function W(n,e){return m(y(n.map(function(n){return e.map(function(e){return function(n,e){var r=D(n.target,e.name);if(r){var t=H(e,n),a=t[t.length-1];return{type:r,property:e.name,animatable:n,tweens:t,duration:a.end,delay:t[0].delay,endDelay:a.endDelay}}}(n,e)})})),function(n){return!i.und(n)})}function J(n,e){var r=n.length,t=function(n){return n.timelineOffset?n.timelineOffset:0},a={};return a.duration=r?Math.max.apply(Math,n.map(function(n){return t(n)+n.duration})):e.duration,a.delay=r?Math.min.apply(Math,n.map(function(n){return t(n)+n.delay})):e.delay,a.endDelay=r?a.duration-Math.max.apply(Math,n.map(function(n){return t(n)+n.duration-n.endDelay})):e.endDelay,a}var K=0;var U,_=[],nn=[],en=function(){function n(){U=requestAnimationFrame(e)}function e(e){var r=_.length;if(r){for(var t=0;t<r;){var a=_[t];if(a.paused){var o=_.indexOf(a);o>-1&&(_.splice(o,1),r=_.length)}else a.tick(e);t++}n()}else U=cancelAnimationFrame(U)}return n}();function rn(r){void 0===r&&(r={});var t,o=0,u=0,i=0,c=0,s=null;function f(n){var e=window.Promise&&new Promise(function(n){return s=n});return n.finished=e,e}var l,d,p,h,v,g,y,b,M=(d=w(n,l=r),p=w(e,l),h=z(p,l),v=Q(l.targets),g=W(v,h),y=J(g,p),b=K,K++,k(d,{id:b,children:[],animatables:v,animations:g,duration:y.duration,delay:y.delay,endDelay:y.endDelay}));f(M);function x(){var n=M.direction;"alternate"!==n&&(M.direction="normal"!==n?"normal":"reverse"),M.reversed=!M.reversed,t.forEach(function(n){return n.reversed=M.reversed})}function O(n){return M.reversed?M.duration-n:n}function C(){o=0,u=O(M.currentTime)*(1/rn.speed)}function B(n,e){e&&e.seek(n-e.timelineOffset)}function P(n){for(var e=0,r=M.animations,t=r.length;e<t;){var o=r[e],u=o.animatable,i=o.tweens,c=i.length-1,s=i[c];c&&(s=m(i,function(e){return n<e.end})[0]||s);for(var f=a(n-s.start-s.delay,0,s.duration)/s.duration,l=isNaN(f)?1:s.easing(f),d=s.to.strings,p=s.round,h=[],v=s.to.numbers.length,g=void 0,y=0;y<v;y++){var b=void 0,x=s.to.numbers[y],w=s.from.numbers[y]||0;b=s.isPath?X(s.value,l*x):w+l*(x-w),p&&(s.isColor&&y>2||(b=Math.round(b*p)/p)),h.push(b)}var k=d.length;if(k){g=d[0];for(var O=0;O<k;O++){d[O];var C=d[O+1],B=h[O];isNaN(B)||(g+=C?B+C:B+" ")}}else g=h[0];G[o.type](u.target,o.property,g,u.transforms),o.currentValue=g,e++}}function I(n){M[n]&&!M.passThrough&&M[n](M)}function T(n){var e=M.duration,r=M.delay,l=e-M.endDelay,d=O(n);M.progress=a(d/e*100,0,100),M.reversePlayback=d<M.currentTime,t&&function(n){if(M.reversePlayback)for(var e=c;e--;)B(n,t[e]);else for(var r=0;r<c;r++)B(n,t[r])}(d),!M.began&&M.currentTime>0&&(M.began=!0,I("begin")),!M.loopBegan&&M.currentTime>0&&(M.loopBegan=!0,I("loopBegin")),d<=r&&0!==M.currentTime&&P(0),(d>=l&&M.currentTime!==e||!e)&&P(e),d>r&&d<l?(M.changeBegan||(M.changeBegan=!0,M.changeCompleted=!1,I("changeBegin")),I("change"),P(d)):M.changeBegan&&(M.changeCompleted=!0,M.changeBegan=!1,I("changeComplete")),M.currentTime=a(d,0,e),M.began&&I("update"),n>=e&&(u=0,M.remaining&&!0!==M.remaining&&M.remaining--,M.remaining?(o=i,I("loopComplete"),M.loopBegan=!1,"alternate"===M.direction&&x()):(M.paused=!0,M.completed||(M.completed=!0,I("loopComplete"),I("complete"),!M.passThrough&&"Promise"in window&&(s(),f(M)))))}return M.reset=function(){var n=M.direction;M.passThrough=!1,M.currentTime=0,M.progress=0,M.paused=!0,M.began=!1,M.loopBegan=!1,M.changeBegan=!1,M.completed=!1,M.changeCompleted=!1,M.reversePlayback=!1,M.reversed="reverse"===n,M.remaining=M.loop,t=M.children;for(var e=c=t.length;e--;)M.children[e].reset();(M.reversed&&!0!==M.loop||"alternate"===n&&1===M.loop)&&M.remaining++,P(M.reversed?M.duration:0)},M.set=function(n,e){return R(n,e),M},M.tick=function(n){i=n,o||(o=i),T((i+(u-o))*rn.speed)},M.seek=function(n){T(O(n))},M.pause=function(){M.paused=!0,C()},M.play=function(){M.paused&&(M.completed&&M.reset(),M.paused=!1,_.push(M),C(),U||en())},M.reverse=function(){x(),C()},M.restart=function(){M.reset(),M.play()},M.reset(),M.autoplay&&M.play(),M}function tn(n,e){for(var r=e.length;r--;)M(n,e[r].animatable.target)&&e.splice(r,1)}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",function(){document.hidden?(_.forEach(function(n){return n.pause()}),nn=_.slice(0),rn.running=_=[]):nn.forEach(function(n){return n.play()})}),rn.version="3.1.0",rn.speed=1,rn.running=_,rn.remove=function(n){for(var e=Z(n),r=_.length;r--;){var t=_[r],a=t.animations,o=t.children;tn(e,a);for(var u=o.length;u--;){var i=o[u],c=i.animations;tn(e,c),c.length||i.children.length||o.splice(u,1)}a.length||o.length||t.pause()}},rn.get=N,rn.set=R,rn.convertPx=I,rn.path=function(n,e){var r=i.str(n)?g(n)[0]:n,t=e||100;return function(n){return{property:n,el:r,svg:$(r),totalLength:q(r)*(t/100)}}},rn.setDashoffset=function(n){var e=q(n);return n.setAttribute("stroke-dasharray",e),e},rn.stagger=function(n,e){void 0===e&&(e={});var r=e.direction||"normal",t=e.easing?v(e.easing):null,a=e.grid,o=e.axis,u=e.from||0,c="first"===u,s="center"===u,f="last"===u,l=i.arr(n),d=l?parseFloat(n[0]):parseFloat(n),p=l?parseFloat(n[1]):0,h=C(l?n[1]:n)||0,g=e.start||0+(l?d:0),m=[],y=0;return function(n,e,i){if(c&&(u=0),s&&(u=(i-1)/2),f&&(u=i-1),!m.length){for(var v=0;v<i;v++){if(a){var b=s?(a[0]-1)/2:u%a[0],M=s?(a[1]-1)/2:Math.floor(u/a[0]),x=b-v%a[0],w=M-Math.floor(v/a[0]),k=Math.sqrt(x*x+w*w);"x"===o&&(k=-x),"y"===o&&(k=-w),m.push(k)}else m.push(Math.abs(u-v));y=Math.max.apply(Math,m)}t&&(m=m.map(function(n){return t(n/y)*y})),"reverse"===r&&(m=m.map(function(n){return o?n<0?-1*n:-n:Math.abs(y-n)}))}return g+(l?(p-d)/y:d)*(Math.round(100*m[e])/100)+h}},rn.timeline=function(n){void 0===n&&(n={});var r=rn(n);return r.duration=0,r.add=function(t,a){var o=_.indexOf(r),u=r.children;function c(n){n.passThrough=!0}o>-1&&_.splice(o,1);for(var s=0;s<u.length;s++)c(u[s]);var f=k(t,w(e,n));f.targets=f.targets||n.targets;var l=r.duration;f.autoplay=!1,f.direction=r.direction,f.timelineOffset=i.und(a)?l:A(a,l),c(r),r.seek(f.timelineOffset);var d=rn(f);c(d),u.push(d);var p=J(u,n);return r.delay=p.delay,r.endDelay=p.endDelay,r.duration=p.duration,r.seek(0),r.reset(),r.autoplay&&r.play(),r},r},rn.easing=v,rn.penner=h,rn.random=function(n,e){return Math.floor(Math.random()*(e-n+1))+n},rn});

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Creates a label comprised of three parts: prefix, content, and suffix
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Holds helper functions for making modifications easy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Label = function (_Html) {
    _inherits(Label, _Html);

    function Label(config) {
        _classCallCheck(this, Label);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            onClick: function onClick(data) {
                console.log('clicked', data);
            },
            class: 'ui label',
            prefix: '',
            content: 'Hello world!',
            suffix: ''
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    _createClass(Label, [{
        key: 'render',
        value: function render(parent) {
            this.template = '\n            <div>\n                <div class="prefix">' + this.prefix + '</div>\n                <div class="content">' + this.content + '</div>\n                <div class="suffix">' + this.suffix + '</div>\n            </div>\n        ';

            this._render(parent);

            this.prefixNode = this.node.find('.prefix');
            this.contentNode = this.node.find('.content');
            this.suffixNode = this.node.find('.suffix');
        }
    }, {
        key: 'setPrefix',
        value: function setPrefix(prefix) {
            this.prefixNode.html(prefix);
        }
    }, {
        key: 'setContent',
        value: function setContent(content) {
            this.contentNode.html(content);
        }
    }, {
        key: 'setSuffix',
        value: function setSuffix(suffix) {
            this.suffixNode.html(suffix);
        }
    }, {
        key: 'getPrefix',
        value: function getPrefix() {
            return this.prefixNode.html();
        }
    }, {
        key: 'getContent',
        value: function getContent() {
            return this.contentNode.html();
        }
    }, {
        key: 'getSuffix',
        value: function getSuffix() {
            return this.suffixNode.html();
        }
    }]);

    return Label;
}(_HTML2.default);

exports.default = Label;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages drawing a cirlce in SVG
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgCircle = function (_Svg) {
    _inherits(SvgCircle, _Svg);

    function SvgCircle(config) {
        _classCallCheck(this, SvgCircle);

        var _this = _possibleConstructorReturn(this, (SvgCircle.__proto__ || Object.getPrototypeOf(SvgCircle)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'circle',
            svg: {
                cx: 55, cy: 55, r: 50,
                fill: '#7e3353',
                stroke: '#e7dab5',
                'stroke-width': 2
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    return SvgCircle;
}(_SVG2.default);

exports.default = SvgCircle;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(2)(function () {
  return Object.defineProperty(__webpack_require__(65)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var core = __webpack_require__(7);
var LIBRARY = __webpack_require__(32);
var wksExt = __webpack_require__(66);
var defineProperty = __webpack_require__(9).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(13);
var toIObject = __webpack_require__(15);
var arrayIndexOf = __webpack_require__(51)(false);
var IE_PROTO = __webpack_require__(67)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(9);
var anObject = __webpack_require__(3);
var getKeys = __webpack_require__(33);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15);
var gOPN = __webpack_require__(36).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__(8);
var getKeys = __webpack_require__(33);
var gOPS = __webpack_require__(52);
var pIE = __webpack_require__(47);
var toObject = __webpack_require__(10);
var IObject = __webpack_require__(46);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(2)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(18);
var isObject = __webpack_require__(4);
var invoke = __webpack_require__(104);
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};


/***/ }),
/* 104 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
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
  } return fn.apply(that, args);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(1).parseInt;
var $trim = __webpack_require__(41).trim;
var ws = __webpack_require__(71);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(1).parseFloat;
var $trim = __webpack_require__(41).trim;

module.exports = 1 / $parseFloat(__webpack_require__(71) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(23);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(35);
var descriptor = __webpack_require__(30);
var setToStringTag = __webpack_require__(40);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(14)(IteratorPrototype, __webpack_require__(5)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(3);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(231);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(18);
var toObject = __webpack_require__(10);
var IObject = __webpack_require__(46);
var toLength = __webpack_require__(6);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(10);
var toAbsoluteIndex = __webpack_require__(34);
var toLength = __webpack_require__(6);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(86);
__webpack_require__(0)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(8) && /./g.flags != 'g') __webpack_require__(9).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(55)
});


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(32);
var global = __webpack_require__(1);
var ctx = __webpack_require__(17);
var classof = __webpack_require__(48);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(18);
var anInstance = __webpack_require__(44);
var forOf = __webpack_require__(58);
var speciesConstructor = __webpack_require__(49);
var task = __webpack_require__(88).set;
var microtask = __webpack_require__(251)();
var newPromiseCapabilityModule = __webpack_require__(119);
var perform = __webpack_require__(252);
var userAgent = __webpack_require__(59);
var promiseResolve = __webpack_require__(120);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(45)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(40)($Promise, PROMISE);
__webpack_require__(43)(PROMISE);
Wrapper = __webpack_require__(7)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(54)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(18);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(3);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(119);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(9).f;
var create = __webpack_require__(35);
var redefineAll = __webpack_require__(45);
var ctx = __webpack_require__(17);
var anInstance = __webpack_require__(44);
var forOf = __webpack_require__(58);
var $iterDefine = __webpack_require__(77);
var step = __webpack_require__(115);
var setSpecies = __webpack_require__(43);
var DESCRIPTORS = __webpack_require__(8);
var fastKey = __webpack_require__(29).fastKey;
var validate = __webpack_require__(39);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(45);
var getWeak = __webpack_require__(29).getWeak;
var anObject = __webpack_require__(3);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(44);
var forOf = __webpack_require__(58);
var createArrayMethod = __webpack_require__(22);
var $has = __webpack_require__(13);
var validate = __webpack_require__(39);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(19);
var toLength = __webpack_require__(6);
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(36);
var gOPS = __webpack_require__(52);
var anObject = __webpack_require__(3);
var Reflect = __webpack_require__(1).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(6);
var repeat = __webpack_require__(73);
var defined = __webpack_require__(24);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(8);
var getKeys = __webpack_require__(33);
var toIObject = __webpack_require__(15);
var isEnum = __webpack_require__(47).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};


/***/ }),
/* 127 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 128 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Creates a button object and its own html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Takes a callback for when it is clicked
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Button = function (_Html) {
    _inherits(Button, _Html);

    function Button(config) {
        _classCallCheck(this, Button);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            template: false,
            onClick: function onClick(data) {
                console.log('clicked', data);
            },
            class: 'ui button',
            label: 'Click Me!'
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();

        // Assign event handlers
        _this.node.click(function (event) {
            _this.clickHandler(event);
        });
        return _this;
    }

    // default click hanlder if nothing is given


    _createClass(Button, [{
        key: 'clickHandler',
        value: function clickHandler(event) {
            this.onClick({
                node: this.node,
                target: this,
                event: event
            });
        }

        // Overriding render function to update template as well

    }, {
        key: 'render',
        value: function render(parent) {
            // Update template
            if (!this.template) {
                this.template = '<div>' + this.label + '</div>';
            }

            // Call original render function
            this._render(parent);
        }
    }]);

    return Button;
}(_HTML2.default);

exports.default = Button;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Creates a slider.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Runs a callback when the user changes something
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Slider = function (_Html) {
    _inherits(Slider, _Html);

    function Slider(config) {
        _classCallCheck(this, Slider);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            onInput: function onInput(data) {
                console.log('Input', data);
            },
            prop: {
                min: 1,
                max: 100,
                value: 50
            },
            template: '<input type="range">'
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();

        _this.node.on('input', function (event) {
            _this.inputHandler(event);
        });
        return _this;
    }

    _createClass(Slider, [{
        key: 'inputHandler',
        value: function inputHandler(event) {
            this.onInput({
                target: this,
                node: this.node,
                event: event,
                value: Number(this.node[0].value)
            });
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return Number(this.node.prop('value'));
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            value = value.toString();
            this.node.prop({ value: value });
        }
    }]);

    return Slider;
}(_HTML2.default);

exports.default = Slider;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Creates an input field
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Handles changes to input and enter key press
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Input = function (_Html) {
    _inherits(Input, _Html);

    function Input(config) {
        _classCallCheck(this, Input);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            onInput: function onInput(data) {
                console.log('User typed in input: ', data);
            },
            onEnter: function onEnter(data) {
                console.log('User pressed enter in input: ', data);
            },
            template: '<input>',
            class: 'ui input'
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();

        // Create event handlers
        _this.node.on('input', function (event) {
            _this.inputHandler(event);
        });
        _this.node.on('keypress', function (event) {
            if (event.which != 13) {
                return;
            }_this.enterHandler(event);
        });
        return _this;
    }

    _createClass(Input, [{
        key: 'inputHandler',
        value: function inputHandler(event) {
            this.onInput({
                target: this,
                event: event,
                node: this.node,
                value: this.node[0].value
            });
        }
    }, {
        key: 'enterHandler',
        value: function enterHandler(event) {
            this.onEnter({
                target: this,
                event: event,
                node: this.node,
                value: this.node[0].value
            });
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            var val = this.node.prop('value');

            if (!isNaN(Number(val))) {
                val = Number(val);
            }

            return val;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this.node.prop({ value: value });
        }
    }]);

    return Input;
}(_HTML2.default);

exports.default = Input;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

var _Input = __webpack_require__(131);

var _Input2 = _interopRequireDefault(_Input);

var _Slider = __webpack_require__(130);

var _Slider2 = _interopRequireDefault(_Slider);

var _Label = __webpack_require__(94);

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages an input and a slider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Maintains their values to be the same
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var InputSlider = function (_Html) {
    _inherits(InputSlider, _Html);

    function InputSlider(config) {
        _classCallCheck(this, InputSlider);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (InputSlider.__proto__ || Object.getPrototypeOf(InputSlider)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            onInput: function onInput(data) {
                console.log('User typed in input: ', data);
            },
            onSlider: function onSlider(data) {
                console.log('User moved slider: ', data);
            },
            onEnter: function onEnter(data) {
                console.log('User pressed enter in input: ', data);
            },
            template: '<div><div class="ui header"></div><div class="ui input-slider"></div>',
            class: 'ui input-slider',
            label: {
                content: 'Hello World',
                class: 'ui label'
            },
            slider: {},
            input: {}
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();

        // Create child objects
        config.label.parent = _this.node.find('.ui.header');
        _this.label = new _Label2.default(config.label);

        config.slider.parent = _this.node.find('.ui.input-slider'), config.slider.onInput = function (data) {
            _this.sliderHandler(data);
        };
        _this.slider = new _Slider2.default(config.slider);

        config.input.parent = _this.node.find('.ui.input-slider'), config.input.onInput = function (data) {
            _this.inputHandler(data);
        };
        config.input.onEnter = function (data) {
            _this.enterHandler(data);
        };
        _this.input = new _Input2.default(config.input);
        return _this;
    }

    _createClass(InputSlider, [{
        key: 'sliderHandler',
        value: function sliderHandler(event) {
            this._changed = 'slider';

            this.syncFields();
            this.onSlider({
                target: this,
                node: this.slider.node,
                value: this.slider.getValue(),
                event: event
            });
        }
    }, {
        key: 'inputHandler',
        value: function inputHandler(event) {
            this._changed = 'input';

            this.syncFields();
            this.onInput({
                target: this,
                node: this.input.node,
                value: this.input.getValue(),
                event: event
            });
        }
    }, {
        key: 'enterHandler',
        value: function enterHandler(event) {
            this._changed = 'input';

            this.syncFields();
            this.onEnter({
                target: this,
                node: this.input.node,
                value: this.input.getValue(),
                event: event
            });
        }
    }, {
        key: 'syncFields',
        value: function syncFields() {
            if (this._changed == 'slider') {
                this.input.setValue(this.slider.getValue());
            } else {
                this.slider.setValue(this.input.getValue());
            }

            this._changed = 'clean';
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this.input.setValue(value);
            this.slider.setValue(value);
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.input.getValue();
        }
    }]);

    return InputSlider;
}(_HTML2.default);

exports.default = InputSlider;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

var _Label = __webpack_require__(94);

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Groups elements together under a div
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Can easily add or remove elements
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Group = function (_Html) {
    _inherits(Group, _Html);

    function Group(config) {
        _classCallCheck(this, Group);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, config));
        // Run HTML object setup


        config = _this.setConfigDefaults({
            label: {},
            class: 'ui segment group'
        });

        // Assign properties from config and render our dom
        _this.assignConfig(config);
        _this.renderToParent();

        // Collect needed information to work
        _this.content = _this.node.find('div.content');

        // Create child objects
        config.label.parent = _this.node.find('div.label > div > label');
        _this.label = new _Label2.default(config.label);

        return _this;
    }

    _createClass(Group, [{
        key: 'render',
        value: function render(parent) {
            this.template = '\n            <div>\n                <div class="label">\n                    <div>\n                        <label></label>\n                    </div>\n                </div>\n                <div class="content">\n                </div>\n            </div>\n        ';

            this._render(parent);
        }
    }, {
        key: 'addContent',
        value: function addContent(node) {
            this.content.append(node);
        }
    }, {
        key: 'removeContent',
        value: function removeContent(node) {
            this.content.remove(node);
        }
    }]);

    return Group;
}(_HTML2.default);

exports.default = Group;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Creates an SVG element for other svg elements to render onto
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgArea = function (_Svg) {
    _inherits(SvgArea, _Svg);

    function SvgArea(config) {
        _classCallCheck(this, SvgArea);

        // Make sure config has certain properties
        var _this = _possibleConstructorReturn(this, (SvgArea.__proto__ || Object.getPrototypeOf(SvgArea)).call(this, config));
        // Run SVG Object setup


        config = _this.setConfigDefaults({
            element: 'svg',
            class: 'ui svg'
        });

        // Assign config and render
        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    return SvgArea;
}(_SVG2.default);

exports.default = SvgArea;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _animejs = __webpack_require__(93);

var _animejs2 = _interopRequireDefault(_animejs);

var _SvgCircle2 = __webpack_require__(95);

var _SvgCircle3 = _interopRequireDefault(_SvgCircle2);

var _SvgEllipse = __webpack_require__(332);

var _SvgEllipse2 = _interopRequireDefault(_SvgEllipse);

var _SvgBox = __webpack_require__(64);

var _SvgBox2 = _interopRequireDefault(_SvgBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Handles the super cool animation for when
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   an impactor collides with the surface
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Impactor = function (_SvgCircle) {
    _inherits(Impactor, _SvgCircle);

    function Impactor(config) {
        _classCallCheck(this, Impactor);

        var _this = _possibleConstructorReturn(this, (Impactor.__proto__ || Object.getPrototypeOf(Impactor)).call(this, config));

        _this.centerStage = _this.parent.width() / 2;
        _this.color = '#687577';

        _this.maxMass = config.maxMass;
        _this.minMass = config.minMass;
        _this.maxWidth = config.maxWidth;
        _this.minWidth = config.minWidth;
        _this.surfaceY = config.surfaceY;

        _this.crater = new _SvgEllipse2.default({
            parent: _this.parent,
            svg: {
                rx: 0, ry: 0, cx: -1000, cy: -1000,
                fill: '#000000',
                'fill-opacity': 1
            }
        });

        _this.flatBottom = new _SvgBox2.default({
            parent: _this.parent,
            svg: {
                // stroke: 'red',
                // 'stroke-width': 1,
                width: _this.parent.width(),
                height: 1000,
                fill: _this.color,
                x: 0, y: _this.surfaceY + 20
            }
        });

        _this.terrace = new _SvgEllipse2.default({
            parent: _this.parent,
            svg: {
                rx: 25, ry: 200, cx: _this.centerStage, cy: _this.surfaceY + 205,
                fill: _this.color,
                'fill-opacity': 1
            }
        });

        _this.explosion = new _SvgCircle3.default({
            parent: _this.parent,
            svg: {
                r: 50,
                fill: '#ffbb46',
                cx: -1000, cy: -1000
            }
        });

        // draw on top of children object
        _this.parent.append(_this.node);
        return _this;
    }

    _createClass(Impactor, [{
        key: 'cleanUp',
        value: function cleanUp() {
            this.node.attr({
                cx: -1000, cy: this.centerStage
            });
            this.explosion.node.attr({
                cx: -1000, cy: this.centerStage
            });
            this.crater.node.attr({
                cx: -1000, cy: this.centerStage
            });
        }
    }, {
        key: 'impactAnimation',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mass, velocity, diameter, actualDiameter) {
                var _this2 = this;

                var tempMaxVelocity, dur, radius, meteorMass, craterDepth, centralPeak, flatBottom, diameterKm;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.node.attr({
                                    'cx': this.centerStage / 2,
                                    'cy': 25,
                                    'fill-opacity': 1,
                                    'r': 0,
                                    'fill': this.color
                                });

                                this.explosion.node.attr({
                                    'cx': -1000,
                                    'cy': -1000,
                                    'fill-opacity': 1,
                                    'r': Number(this.node.attr('r'))
                                });

                                this.crater.node.attr({
                                    'cy': this.surfaceY,
                                    'cx': this.centerStage,
                                    'rx': 0,
                                    'ry': 0
                                });

                                tempMaxVelocity = 60 * 10;
                                dur = tempMaxVelocity - velocity * 10 + 250;
                                radius = diameter / 2;
                                meteorMass = (mass - this.minMass) / (this.maxMass - this.minMass) * this.maxWidth + this.minWidth;
                                craterDepth = 0;
                                centralPeak = false;
                                flatBottom = false;

                                // Convert miles to km

                                diameterKm = actualDiameter; // 1000;

                                /*
                                Round Craters:
                                    <15 km
                                    depth = .2*diameter
                                */

                                if (diameterKm < 15) {
                                    craterDepth = diameter * 0.2;
                                }
                                /*
                                Flat Bottom:
                                    15-20 km
                                    depth = .1*diameter
                                */
                                else if (diameterKm >= 15 && diameterKm < 20) {
                                        craterDepth = diameter * 0.1;
                                        // Set up flags for flattening crater bottom
                                        flatBottom = true;
                                    }
                                    /*
                                    Flat Bottom with Central Peak:
                                        > 20 km
                                        depth = .1*diameter
                                    */
                                    else if (diameterKm >= 20) {
                                            craterDepth = diameter * 0.1;
                                            // Set up flags for flattening crater bottom
                                            flatBottom = true;
                                            // Set up flags for creating a central peak
                                            centralPeak = true;
                                        }

                                if (flatBottom) {
                                    this.flatBottom.node.attr({
                                        y: this.surfaceY + craterDepth / 1.75
                                    });
                                } else {
                                    this.flatBottom.node.attr({ y: 10000 });
                                }

                                if (centralPeak) {
                                    console.log('Moving terrace to be visible');
                                    this.terrace.node.attr({ cy: this.surfaceY + 205 });
                                } else {
                                    console.log('Hiding terrace');
                                    this.terrace.node.attr({ cy: 10000 });
                                }

                                // console.log (
                                //     'Crater Diameter:', actualDiameter,
                                //     '\nCrater Depth:', craterDepth,
                                //     '\nFlat bottom?', flatBottom,
                                //     '\n Central Peak?', centralPeak
                                // );

                                _context.next = 16;
                                return new Promise(function (resolve) {
                                    (0, _animejs2.default)({
                                        targets: _this2.node[0],
                                        cx: _this2.centerStage,
                                        cy: _this2.surfaceY,
                                        r: meteorMass,
                                        easing: 'easeInQuint',
                                        duration: dur,
                                        complete: function complete() {
                                            _this2.explosion.node.attr({
                                                cx: _this2.node.attr('cx'),
                                                cy: _this2.node.attr('cy')
                                            });

                                            _this2.node.attr({
                                                'fill': '#f53831'
                                            });

                                            var duration = 1500;
                                            var delay = 500;

                                            (0, _animejs2.default)({
                                                targets: _this2.crater.node[0],
                                                rx: radius,
                                                ry: craterDepth,
                                                duration: duration,
                                                easing: 'easeOutExpo'
                                            });

                                            (0, _animejs2.default)({
                                                targets: _this2.node[0],
                                                'fill-opacity': 0,
                                                duration: duration / 2,
                                                delay: delay,
                                                easing: 'linear'
                                            });

                                            (0, _animejs2.default)({
                                                targets: _this2.explosion.node[0],
                                                'fill-opacity': 0,
                                                duration: duration,
                                                delay: delay,
                                                easing: 'linear'
                                            });

                                            (0, _animejs2.default)({
                                                targets: _this2.node[0],
                                                r: radius,
                                                duration: duration + delay,
                                                easing: 'spring(1, 100, 10, 50)',
                                                complete: function complete() {
                                                    // Move the explosion out of the way
                                                    _this2.explosion.node.attr({
                                                        cy: -1000
                                                    });
                                                    resolve();
                                                }
                                            });

                                            (0, _animejs2.default)({
                                                targets: _this2.explosion.node[0],
                                                r: radius * 2,
                                                duration: duration + delay,
                                                easing: 'easeOutCubic'
                                            });
                                        }
                                    });
                                });

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function impactAnimation(_x, _x2, _x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return impactAnimation;
        }()
    }]);

    return Impactor;
}(_SvgCircle3.default);

exports.default = Impactor;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(137);

var _App = __webpack_require__(323);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create the App
// Setup the polyfill so we can use async functions
var app = new _App2.default();

// import files needed here

window.App = app;

/*

    DEBUG FUNCTIONS

*/
window._debugMassGraph = function () {
    app.graphTabber.changeTab('Mass');
    var massValues = [1.00e+8, 5.00e+8, 1.00e+9, 5.00e+9, 1.00e+10, 5.00e+10, 1.00e+11, 5.00e+11, 1.00e+12, 5.00e+12, 1.00e+13, 5.00e+13, 2.00e+14, 4.00e+14, 7.50e+14, 1.00e+15];

    // Test mass graph
    app.velocityInputSlider.setValue(30);
    massValues.forEach(function (value) {
        app.massInputSlider.setValue(value);
        app.plotData();
    });

    var points = [];
    app.massPointList.forEach(function (item, index) {
        points.push({
            x: item.svg.cx,
            y: item.svg.cy
        });
    });

    console.log(JSON.stringify(points));
};

window._debugVelocityGraph = function () {
    app.graphTabber.changeTab('Velocity');
    var velValues = [10, 11, 12, 15, 17, 20, 25, 27, 30, 33, 35, 40, 43, 45, 47, 50];

    // Test velocity graph
    app.massInputSlider.setValue((1e8 + 1e15) / 2);
    velValues.forEach(function (value) {
        app.velocityInputSlider.setValue(value);
        app.plotData();
    });

    var points = [];
    app.velocityPointList.forEach(function (item, index) {
        points.push({
            x: item.svg.cx,
            y: item.svg.cy
        });
    });

    console.log(JSON.stringify(points));
};

/*

    CAPI EXPOSURE AND SETUP

*/

// Make sure the simcapi object is even available to use.
// If not, don't bother with the rest of the script.
if (!simcapi) {
    throw new Error('Sim Capi not found. Stopping sim capi set up.');
}
console.log('Setting up CAPI');

// Handle CAPI
window.preventRecursion = false;
function capiHandler(name, value) {
    if (window.preventRecursion) {
        return;
    }

    window.preventRecursion = true;

    switch (name) {
        case 'velocity':
            app.velocityInputSlider.setValue(value);
            break;
        case 'mass':
            app.massInputSlider.setValue(value);
            break;

        //Read only
        case 'diameter':
            break;
        //Read only
        case 'pointsPlotted':
            break;
        //Read only
        case 'smallestMassPoint':
            break;
        //Read only
        case 'largestMassPoint':
            break;
        //Read only
        case 'smallestVelocityPoint':
            break;
        //Read only
        case 'largestVelocityPoint':
            break;
        // Read only
        case 'xInputAnswer':
            break;
        // Read only
        case 'yInputAnswer':
            break;

        case 'disableMeasureTool':
            window.app.setMeasuringEnabled(value);break;

        case 'resetSurface':
            app.resetSurface();
            simModel.set('resetSurface', false);
            break;
        case 'clearGraph':
            app.clearGraph();
            simModel.set('clearGraph', false);
            break;
        case 'undoGraphPoint':
            app.undoPoint();
            simModel.set('undoGraphPoint', false);
            break;

        case 'debugMassGraph':
            window._debugMassGraph();
            simModel.set('debugMassGraph', false);
            break;

        case 'debugVelocityGraph':
            window._debugVelocityGraph();
            simModel.set('debugVelocityGraph', false);
            break;

        // UI control
        case 'uiHideTheBottomHalf':
            // Create a black square to
            if (!window.bottomHalfHider) {
                window.bottomHalfHider = $(document.createElement('div'));
                window.bottomHalfHider.css({
                    height: '50vh',
                    position: 'absolute',
                    top: '50vh',
                    left: '0',
                    width: '100vw',
                    'background-color': '#000000'
                });

                $(document.body).append(window.bottomHalfHider);
            }

            setElementVisible(window.bottomHalfHider, value);
            break;

        case 'uiHideTheGraphHalf':
            // Create a black square to hide right half
            if (!window.rightHalfHider) {
                window.rightHalfHider = $(document.createElement('div'));
                window.rightHalfHider.css({
                    height: '100vh',
                    position: 'absolute',
                    left: '50vw',
                    top: '0',
                    width: '500vw',
                    'background-color': '#000000'
                });

                $(document.body).append(window.rightHalfHider);
            }

            setElementVisible(window.rightHalfHider, value);
            break;

        // Mass and Velocity Slider Group
        case 'uiSliderGroupVisible':
            setElementVisible($('.ui.group.mass-velocity'), value);break;
        case 'uiSliderGroupEnabled':
            setElementEnabled($('.ui.group.mass-velocity > .content > div > div'), value);
            setElementEnabled($('.ui.group.mass-velocity > .content > div > div > input'), value);
            break;

        // Mass Slider
        case 'uiMassSliderVisible':
            setElementVisible($('.ui.group.mass-velocity > .content > .ui.input-slider:first-child'), value);break;
        case 'uiMassSliderEnabled':
            setElementEnabled($('.ui.group.mass-velocity > .content > .ui.input-slider:first-child > div'), value);
            setElementEnabled($('.ui.group.mass-velocity > .content > .ui.input-slider:first-child > div > input'), value);
            break;

        // Velocity Slider
        case 'uiVelSliderVisible':
            setElementVisible($('.ui.group.mass-velocity > .content > .ui.input-slider:last-child'), value);break;
        case 'uiVelSliderEnabled':
            setElementEnabled($('.ui.group.mass-velocity > .content > .ui.input-slider:last-child > div'), value);
            setElementEnabled($('.ui.group.mass-velocity > .content > .ui.input-slider:last-child > div > input'), value);
            break;

        // Surface button group
        case 'uiSurfaceGroupVisible':
            setElementVisible($('.ui.group.surface'), value);break;
        case 'uiSurfaceGroupEnabled':
            setElementEnabled($('.ui.group.surface > .content > div'), value);break;

        case 'uiLaunchButtonVisible':
            setElementVisible($('.ui.group.surface > .content > div:first-child'), value);break;
        case 'uiLaunchButtonEnabled':
            setElementEnabled($('.ui.group.surface > .content > div:first-child'), value);break;

        case 'uiResetButtonVisible':
            setElementVisible($('.ui.group.surface > .content > div:last-child'), value);break;
        case 'uiResetButtonEnabled':
            setElementEnabled($('.ui.group.surface > .content > div:last-child'), value);break;

        case 'uiCraterMeasureToolVisible':
            app.surface.measureTool.setVisible(value);break;
        case 'uiCraterMeasureToolEnabled':
            app.surface.measureTool.setEnabled(value);break;

        case 'uiDataGroupVisible':
            setElementVisible($('.ui.group.data'), value);break;
        case 'uiDataGroupEnabled':
            setElementEnabled($('.ui.group.data > .content > div'), value);break;
        case 'uiDataMassVisible':
            setElementVisible($('.ui.group.data > .content > div:first-child'), value);break;
        case 'uiDataVelocityVisible':
            setElementVisible($('.ui.group.data > .content > div:nth-child(2)'), value);break;
        case 'uiDataDiameterVisible':
            setElementVisible($('.ui.group.data > .content > div:last-child'), value);break;

        case 'uiMassTabVisible':
            setElementVisible($('div[data-tab="Mass"]'), value);break;
        case 'uiMassTabEnabled':
            setElementEnabled($('div[data-tab="Mass"]'), value);break;
        case 'uiMassTabSelected':
            if (value) {
                app.graphTabber.changeTab('Mass');
            } else if (!value) {
                app.graphTabber.changeTab('Velocity');
            }
            simModel.set('uiVelocityTabSelected', !value);
            break;

        case 'uiVelocityTabVisible':
            setElementVisible($('div[data-tab="Velocity"]'), value);break;
        case 'uiVelocityTabEnabled':
            setElementEnabled($('div[data-tab="Velocity"]'), value);break;
        case 'uiVelocityTabSelected':
            if (value) {
                app.graphTabber.changeTab('Velocity');
            } else if (!value) {
                app.graphTabber.changeTab('Mass');
            }
            simModel.set('uiMassTabSelected', !value);
            break;

        case 'uiMassTabMassInputVisible':
            setElementVisible($('#massXInput'), value);break;
        case 'uiMassTabMassInputEnabled':
            setElementEnabled($('#massXInput'), value);break;
        case 'uiMassTabDiameterInputVisible':
            setElementVisible($('#massYInput'), value);break;
        case 'uiMassTabDiameterInputEnabled':
            setElementEnabled($('#massYInput'), value);break;
        case 'uiMassTabPlotDataButtonVisible':
            setElementVisible($('div.tab:nth-child(2) > div:nth-child(5)'), value);break;
        case 'uiMassTabPlotDataButtonEnabled':
            setElementEnabled($('div.tab:nth-child(2) > div:nth-child(5)'), value);break;
        case 'uiMassTabFitSliderEnabled':
            setElementEnabled(app.massCurveSlider.node, value);break;
        case 'uiMassTabFitSliderVisible':
            setElementVisible(app.massCurveSlider.node, value);break;

        case 'uiVelocityTabVelocityInputVisible':
            setElementVisible($('#velocityXInput'), value);break;
        case 'uiVelocityTabVelocityInputEnabled':
            setElementEnabled($('#velocityXInput'), value);break;
        case 'uiVelocityTabDiameterInputVisible':
            setElementVisible($('#velocityYInput'), value);break;
        case 'uiVelocityTabDiameterInputEnabled':
            setElementEnabled($('#velocityYInput'), value);break;
        case 'uiVelocityTabPlotDataButtonVisible':
            setElementVisible($('div.tab:nth-child(3) > div:nth-child(5)'), value);break;
        case 'uiVelocityTabPlotDataButtonEnabled':
            setElementEnabled($('div.tab:nth-child(3) > div:nth-child(5)'), value);break;
        case 'uiVelocityTabFitSliderEnabled':
            setElementEnabled(app.velocityCurveSlider.node, value);break;
        case 'uiVelocityTabFitSliderVisible':
            setElementVisible(app.velocityCurveSlider.node, value);break;

        case 'uiControlsGroupVisible':
            setElementVisible($('.ui.group.extra.controls'), value);break;
        case 'uiControlsGroupEnabled':
            setElementEnabled($('.ui.group.extra.controls > .content > div'), value);break;
        case 'uiFitCurveToggleVisible':
            setElementVisible($('.ui.group.extra.controls > .content > div:nth-child(2)'), value);break;
        case 'uiFitCurveToggleEnabled':
            setElementEnabled($('.ui.group.extra.controls > .content > div:nth-child(2)'), value);break;
        case 'uiControlsUndoVisible':
            setElementVisible($('.ui.group.extra.controls > .content > div:last-child'), value);break;
        case 'uiControlsUndoEnabled':
            setElementEnabled($('.ui.group.extra.controls > .content > div:last-child'), value);break;
        case 'uiControlsClearVisible':
            setElementVisible($('.ui.group.extra.controls > .content > div:nth-child(3)'), value);break;
        case 'uiControlsClearEnabled':
            setElementEnabled($('.ui.group.extra.controls > .content > div:nth-child(3)'), value);break;

        default:
            console.log(name, value);
            break;
    }

    window.preventRecursion = false;
}

function setElementEnabled(element, value) {
    if (value) {
        element.removeClass('disabled');
    } else {
        element.addClass('disabled');
    }
}

function setElementVisible(element, value) {
    if (value) {
        element.removeClass('hide');
    } else {
        element.addClass('hide');
    }
}

// Define CAPI for this sim
var capi = {
    defaults: {
        // Sim state
        velocity: 10,
        mass: 10,
        diameter: 100,
        pointsPlotted: 0,
        xInputAnswer: 0,
        yInputAnswer: 0,
        massFit: 3,
        velocityFit: 3,
        disableMeasureTool: false,

        // Graph stuff
        velocityGraphPlottedPoints: '[]',
        velocityGraphPointCount: 0,
        smallestVelocityPoint: 99999999,
        largestVelocityPoint: 0,
        velocityGraphDiameters: '[]',

        massGraphPlottedPoints: '[]',
        massGraphPointCount: 0,
        smallestMassPoint: 99999999,
        largestMassPoint: 0,
        massGraphDiameters: '[]',

        // functional stuff
        resetSurface: false,
        clearGraph: false,
        undoGraphPoint: false,
        debugMassGraph: false,
        debugVelocityGraph: false,

        // UI control
        uiHideTheBottomHalf: false,
        uiHideTheGraphHalf: false,

        uiSliderGroupVisible: true,
        uiSliderGroupEnabled: true,

        uiMassSliderVisible: true,
        uiMassSliderEnabled: true,

        uiVelSliderVisible: true,
        uiVelSliderEnabled: true,

        uiSurfaceGroupVisible: true,
        uiSurfaceGroupEnabled: true,

        uiLaunchButtonVisible: true,
        uiLaunchButtonEnabled: true,

        uiResetButtonVisible: true,
        uiResetButtonEnabled: true,

        uiCraterMeasureToolVisible: true,
        uiCraterMeasureToolEnabled: true,

        uiDataGroupVisible: true,
        uiDataGroupEnabled: true,
        uiDataMassVisible: true,
        uiDataVelocityVisible: true,
        uiDataDiameterVisible: true,

        uiMassTabEnabled: true,
        uiMassTabVisible: true,
        uiMassTabSelected: true,

        uiVelocityTabEnabled: true,
        uiVelocityTabVisible: true,
        uiVelocityTabSelected: false,

        uiMassTabMassInputEnabled: true,
        uiMassTabMassInputVisible: true,
        uiMassTabDiameterInputEnabled: true,
        uiMassTabDiameterInputVisible: true,
        uiMassTabPlotDataButtonEnabled: true,
        uiMassTabPlotDataButtonVisible: true,
        uiMassTabFitSliderEnabled: true,
        uiMassTabFitSliderVisible: true,

        uiVelocityTabVelocityInputEnabled: true,
        uiVelocityTabVelocityInputVisible: true,
        uiVelocityTabDiameterInputEnabled: true,
        uiVelocityTabDiameterInputVisible: true,
        uiVelocityTabPlotDataButtonEnabled: true,
        uiVelocityTabPlotDataButtonVisible: true,
        uiVelocityTabFitSliderEnabled: true,
        uiVelocityTabFitSliderVisible: true,

        uiControlsGroupVisible: true,
        uiControlsGroupEnabled: true,
        uiFitCurveToggleEnabled: true,
        uiFitCurveToggleVisible: true,
        uiControlsUndoVisible: true,
        uiControlsUndoEnabled: true,
        uiControlsClearVisible: true,
        uiControlsClearEnabled: true,

        uiDiameterReadOutVisible: true
    },

    exposeWith: {
        velocity: { alias: 'sim.velocity' },
        mass: { alias: 'sim.mass' },
        diameter: { alias: 'sim.diameter' },
        xInputAnswer: { alias: 'sim.xInput' },
        yInputAnswer: { alias: 'sim.yInput' },
        massFit: { alias: 'sim.massFit' },
        velocityFit: { alias: 'sim.velocityFit' },
        disableMeasureTool: { alias: 'sim.disableMeasureTool' },

        pointsPlotted: { alias: 'sim.graph.pointsPlotted' },
        velocityGraphPlottedPoints: { alias: 'sim.graph.velocity.points' },
        velocityGraphPointCount: { alias: 'sim.graph.velocity.pointCount' },
        smallestVelocityPoint: { alias: 'sim.graph.velocity.smallestPoint' },
        largestVelocityPoint: { alias: 'sim.graph.velocity.largestPoint' },
        velocityGraphDiameters: { alias: 'sim.graph.velocity.diameters' },

        massGraphPlottedPoints: { alias: 'sim.graph.mass.points' },
        massGraphPointCount: { alias: 'sim.graph.mass.pointCount' },
        smallestMassPoint: { alias: 'sim.graph.mass.smallestPoint' },
        largestMassPoint: { alias: 'sim.graph.mass.largestPoint' },
        massGraphDiameters: { alias: 'sim.graph.mass.diameters' },

        resetSurface: { alias: 'function.reset' },
        clearGraph: { alias: 'function.clearGraph' },
        undoGraphPoint: { alias: 'function.undoPoint' },

        uiHideTheGraphHalf: { alias: 'ui.hideGraph' },
        uiHideTheBottomHalf: { alias: 'ui.hideBottom' },

        uiSliderGroupVisible: { alias: 'ui.group.Sliders.visible' },
        uiSliderGroupEnabled: { alias: 'ui.group.Sliders.enabled' },

        uiMassSliderVisible: { alias: 'ui.group.Sliders.mass.visible' },
        uiMassSliderEnabled: { alias: 'ui.group.Sliders.mass.enabled' },

        uiVelSliderVisible: { alias: 'ui.group.Sliders.velocity.visible' },
        uiVelSliderEnabled: { alias: 'ui.group.Sliders.velocity.enabled' },

        uiSurfaceGroupVisible: { alias: 'ui.group.Surface.visible' },
        uiSurfaceGroupEnabled: { alias: 'ui.group.Surface.enabled' },

        uiLaunchButtonVisible: { alias: 'ui.group.Surface.launch.visible' },
        uiLaunchButtonEnabled: { alias: 'ui.group.Surface.launch.enabled' },

        uiResetButtonVisible: { alias: 'ui.group.Surface.reset.visible' },
        uiResetButtonEnabled: { alias: 'ui.group.Surface.reset.enabled' },

        uiCraterMeasureToolVisible: { alias: 'diameter.visible' },
        uiCraterMeasureToolEnabled: { alias: 'diameter.enabled' },

        uiDataGroupVisible: { alias: 'ui.group.Data.visible' },
        uiDataGroupEnabled: { alias: 'ui.group.Data.enabled' },
        uiDataMassVisible: { alias: 'ui.group.Data.mass.visible' },
        uiDataVelocityVisible: { alias: 'ui.group.Data.velocity.visible' },
        uiDataDiameterVisible: { alias: 'ui.group.Data.diameter.visible' },

        uiMassTabVisible: { alias: 'ui.tab.mass.visible' },
        uiMassTabEnabled: { alias: 'ui.tab.mass.enabled' },
        uiMassTabSelected: { alias: 'ui.tab.mass.selected' },

        uiVelocityTabVisible: { alias: 'ui.tab.velocity.visible' },
        uiVelocityTabEnabled: { alias: 'ui.tab.velocity.enabled' },
        uiVelocityTabSelected: { alias: 'ui.tab.velocity.selected' },

        uiMassTabMassInputVisible: { alias: 'ui.tab.mass.massInput.visible' },
        uiMassTabMassInputEnabled: { alias: 'ui.tab.mass.massInput.enabled' },
        uiMassTabDiameterInputVisible: { alias: 'ui.tab.mass.diameterInput.visible' },
        uiMassTabDiameterInputEnabled: { alias: 'ui.tab.mass.diameterInput.enabled' },
        uiMassTabPlotDataButtonVisible: { alias: 'ui.tab.mass.plotDataButton.visible' },
        uiMassTabPlotDataButtonEnabled: { alias: 'ui.tab.mass.plotDataButton.enabled' },
        uiMassTabFitSliderEnabled: { alias: 'ui.tab.mass.fitDataSlider.enabled' },
        uiMassTabFitSliderVisible: { alias: 'ui.tab.mass.fitDataSlider.visible' },

        uiVelocityTabVelocityInputVisible: { alias: 'ui.tab.velocity.velocityInput.visible' },
        uiVelocityTabVelocityInputEnabled: { alias: 'ui.tab.velocity.velocityInput.enabled' },
        uiVelocityTabDiameterInputEnabled: { alias: 'ui.tab.velocity.diameterInput.enabled' },
        uiVelocityTabDiameterInputVisible: { alias: 'ui.tab.velocity.diameterInput.visible' },
        uiVelocityTabPlotDataButtonVisible: { alias: 'ui.tab.velocity.plotDataButton.visible' },
        uiVelocityTabPlotDataButtonEnabled: { alias: 'ui.tab.velocity.plotDataButton.enabled' },
        uiVelocityTabFitSliderEnabled: { alias: 'ui.tab.velocity.fitDataSlider.enabled' },
        uiVelocityTabFitSliderVisible: { alias: 'ui.tab.velocity.fitDataSlider.visible' },

        uiControlsGroupVisible: { alias: 'ui.group.controls.visible' },
        uiControlsGroupEnabled: { alias: 'ui.group.controls.enabled' },
        uiFitCurveToggleVisible: { alias: 'ui.group.controls.toggle.visible' },
        uiFitCurveToggleEnabled: { alias: 'ui.group.controls.toggle.enabled' },
        uiControlsUndoVisible: { alias: 'ui.group.controls.undo.visible' },
        uiControlsUndoEnabled: { alias: 'ui.group.controls.undo.enabled' },
        uiControlsClearVisible: { alias: 'ui.group.controls.clear.visible' },
        uiControlsClearEnabled: { alias: 'ui.group.controls.clear.enabled' }
    }

    // Instantiate a sim model
};var simModel = new simcapi.CapiAdapter.CapiModel(capi.defaults);

// Give the app a reference to the sim model
app.simModel = simModel;

// Helper function for adding listeners for our capi handler to catch
function addListener(key) {
    simModel.on('change:' + key, function (simModel, value) {
        capiHandler(key, value);
    });
}

// Iterate over defined capi, expose it, and listen for changes
var item = void 0,
    key = void 0;
for (key in capi.defaults) {
    item = capi.exposeWith[key];

    simcapi.CapiAdapter.expose(key, simModel, item);
    addListener(key);
}

// Tell smart sparrow we are ready to go
simcapi.Transporter.notifyOnReady();

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(138);

var _global = _interopRequireDefault(__webpack_require__(310));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (_global["default"]._babelPolyfill && typeof console !== "undefined" && console.warn) {
  console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " + "and may have consequences if different versions of the polyfills are applied sequentially. " + "If you do need to load the polyfill more than once, use @babel/polyfill/noConflict " + "instead to bypass the warning.");
}

_global["default"]._babelPolyfill = true;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(139);

__webpack_require__(282);

__webpack_require__(284);

__webpack_require__(287);

__webpack_require__(289);

__webpack_require__(291);

__webpack_require__(293);

__webpack_require__(295);

__webpack_require__(297);

__webpack_require__(299);

__webpack_require__(301);

__webpack_require__(303);

__webpack_require__(305);

__webpack_require__(309);

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(140);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(148);
__webpack_require__(149);
__webpack_require__(150);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(155);
__webpack_require__(156);
__webpack_require__(157);
__webpack_require__(158);
__webpack_require__(159);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(162);
__webpack_require__(163);
__webpack_require__(164);
__webpack_require__(165);
__webpack_require__(166);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(171);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(210);
__webpack_require__(211);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(221);
__webpack_require__(222);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(230);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(85);
__webpack_require__(245);
__webpack_require__(116);
__webpack_require__(246);
__webpack_require__(117);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(118);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(273);
__webpack_require__(274);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(279);
__webpack_require__(280);
__webpack_require__(281);
module.exports = __webpack_require__(7);


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(1);
var has = __webpack_require__(13);
var DESCRIPTORS = __webpack_require__(8);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(11);
var META = __webpack_require__(29).KEY;
var $fails = __webpack_require__(2);
var shared = __webpack_require__(50);
var setToStringTag = __webpack_require__(40);
var uid = __webpack_require__(31);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(66);
var wksDefine = __webpack_require__(97);
var enumKeys = __webpack_require__(142);
var isArray = __webpack_require__(53);
var anObject = __webpack_require__(3);
var isObject = __webpack_require__(4);
var toObject = __webpack_require__(10);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(28);
var createDesc = __webpack_require__(30);
var _create = __webpack_require__(35);
var gOPNExt = __webpack_require__(100);
var $GOPD = __webpack_require__(20);
var $GOPS = __webpack_require__(52);
var $DP = __webpack_require__(9);
var $keys = __webpack_require__(33);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(36).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(47).f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(32)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(14)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(50)('native-function-to-string', Function.toString);


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(33);
var gOPS = __webpack_require__(52);
var pIE = __webpack_require__(47);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(35) });


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', { defineProperty: __webpack_require__(9).f });


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', { defineProperties: __webpack_require__(99) });


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(15);
var $getOwnPropertyDescriptor = __webpack_require__(20).f;

__webpack_require__(21)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(10);
var $getPrototypeOf = __webpack_require__(37);

__webpack_require__(21)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(10);
var $keys = __webpack_require__(33);

__webpack_require__(21)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(21)('getOwnPropertyNames', function () {
  return __webpack_require__(100).f;
});


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(29).onFreeze;

__webpack_require__(21)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(29).onFreeze;

__webpack_require__(21)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(29).onFreeze;

__webpack_require__(21)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(21)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(21)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(21)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(101) });


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(102) });


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(70).set });


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(48);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(11)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', { bind: __webpack_require__(103) });


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(9).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(8) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(4);
var getPrototypeOf = __webpack_require__(37);
var HAS_INSTANCE = __webpack_require__(5)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(9).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(105);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(106);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(1);
var has = __webpack_require__(13);
var cof = __webpack_require__(23);
var inheritIfRequired = __webpack_require__(72);
var toPrimitive = __webpack_require__(28);
var fails = __webpack_require__(2);
var gOPN = __webpack_require__(36).f;
var gOPD = __webpack_require__(20).f;
var dP = __webpack_require__(9).f;
var $trim = __webpack_require__(41).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(35)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(8) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(11)(global, NUMBER, $Number);
}


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toInteger = __webpack_require__(19);
var aNumberValue = __webpack_require__(107);
var repeat = __webpack_require__(73);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(2)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $fails = __webpack_require__(2);
var aNumberValue = __webpack_require__(107);
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(1).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(108) });


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(108);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(106);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(105);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);
var log1p = __webpack_require__(109);
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);
var sign = __webpack_require__(74);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);
var $expm1 = __webpack_require__(75);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { fround: __webpack_require__(185) });


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(74);
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(2)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { log1p: __webpack_require__(109) });


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { sign: __webpack_require__(74) });


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(75);
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(2)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(75);
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(34);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(6);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(41)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(76)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(77)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $at = __webpack_require__(76)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(6);
var context = __webpack_require__(78);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(80)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(78);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(80)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(73)
});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(6);
var context = __webpack_require__(78);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(80)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(12)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(12)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(12)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(12)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(12)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(12)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(12)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(12)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(12)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(12)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(12)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(12)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(12)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(28);

$export($export.P + $export.F * __webpack_require__(2)(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(220);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__(2);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(11)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(14)(proto, TO_PRIMITIVE, __webpack_require__(223));


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(3);
var toPrimitive = __webpack_require__(28);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(53) });


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(17);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var call = __webpack_require__(111);
var isArrayIter = __webpack_require__(81);
var toLength = __webpack_require__(6);
var createProperty = __webpack_require__(82);
var getIterFn = __webpack_require__(83);

$export($export.S + $export.F * !__webpack_require__(54)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var createProperty = __webpack_require__(82);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(2)(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(46) != Object || !__webpack_require__(16)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var html = __webpack_require__(69);
var cof = __webpack_require__(23);
var toAbsoluteIndex = __webpack_require__(34);
var toLength = __webpack_require__(6);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(2)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(18);
var toObject = __webpack_require__(10);
var fails = __webpack_require__(2);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(16)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(22)(0);
var STRICT = __webpack_require__(16)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(53);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $map = __webpack_require__(22)(1);

$export($export.P + $export.F * !__webpack_require__(16)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(22)(2);

$export($export.P + $export.F * !__webpack_require__(16)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $some = __webpack_require__(22)(3);

$export($export.P + $export.F * !__webpack_require__(16)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $every = __webpack_require__(22)(4);

$export($export.P + $export.F * !__webpack_require__(16)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(113);

$export($export.P + $export.F * !__webpack_require__(16)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(113);

$export($export.P + $export.F * !__webpack_require__(16)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(51)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(16)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toInteger = __webpack_require__(19);
var toLength = __webpack_require__(6);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(16)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(114) });

__webpack_require__(38)('copyWithin');


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(84) });

__webpack_require__(38)('fill');


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(22)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(38)(KEY);


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(22)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(38)(KEY);


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(43)('Array');


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var inheritIfRequired = __webpack_require__(72);
var dP = __webpack_require__(9).f;
var gOPN = __webpack_require__(36).f;
var isRegExp = __webpack_require__(79);
var $flags = __webpack_require__(55);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(8) && (!CORRECT_NEW || __webpack_require__(2)(function () {
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(11)(global, 'RegExp', $RegExp);
}

__webpack_require__(43)('RegExp');


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(117);
var anObject = __webpack_require__(3);
var $flags = __webpack_require__(55);
var DESCRIPTORS = __webpack_require__(8);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(11)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(2)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(3);
var toLength = __webpack_require__(6);
var advanceStringIndex = __webpack_require__(87);
var regExpExec = __webpack_require__(56);

// @@match logic
__webpack_require__(57)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(3);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(6);
var toInteger = __webpack_require__(19);
var advanceStringIndex = __webpack_require__(87);
var regExpExec = __webpack_require__(56);
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(57)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(3);
var sameValue = __webpack_require__(102);
var regExpExec = __webpack_require__(56);

// @@search logic
__webpack_require__(57)('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(79);
var anObject = __webpack_require__(3);
var speciesConstructor = __webpack_require__(49);
var advanceStringIndex = __webpack_require__(87);
var toLength = __webpack_require__(6);
var callRegExpExec = __webpack_require__(56);
var regexpExec = __webpack_require__(86);
var fails = __webpack_require__(2);
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__(57)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1);
var macrotask = __webpack_require__(88).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(23)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 252 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(121);
var validate = __webpack_require__(39);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(60)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(121);
var validate = __webpack_require__(39);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(60)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(1);
var each = __webpack_require__(22)(0);
var redefine = __webpack_require__(11);
var meta = __webpack_require__(29);
var assign = __webpack_require__(101);
var weak = __webpack_require__(122);
var isObject = __webpack_require__(4);
var validate = __webpack_require__(39);
var NATIVE_WEAK_MAP = __webpack_require__(39);
var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(60)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(122);
var validate = __webpack_require__(39);
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
__webpack_require__(60)(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $typed = __webpack_require__(61);
var buffer = __webpack_require__(89);
var anObject = __webpack_require__(3);
var toAbsoluteIndex = __webpack_require__(34);
var toLength = __webpack_require__(6);
var isObject = __webpack_require__(4);
var ArrayBuffer = __webpack_require__(1).ArrayBuffer;
var speciesConstructor = __webpack_require__(49);
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(2)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(43)(ARRAY_BUFFER);


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(61).ABV, {
  DataView: __webpack_require__(89).DataView
});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(18);
var anObject = __webpack_require__(3);
var rApply = (__webpack_require__(1).Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(2)(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);
var create = __webpack_require__(35);
var aFunction = __webpack_require__(18);
var anObject = __webpack_require__(3);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(2);
var bind = __webpack_require__(103);
var rConstruct = (__webpack_require__(1).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(9);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(3);
var toPrimitive = __webpack_require__(28);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(2)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);
var gOPD = __webpack_require__(20).f;
var anObject = __webpack_require__(3);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(3);
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
__webpack_require__(110)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(20);
var getPrototypeOf = __webpack_require__(37);
var has = __webpack_require__(13);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(3);

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(20);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(3);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);
var getProto = __webpack_require__(37);
var anObject = __webpack_require__(3);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(3);
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', { ownKeys: __webpack_require__(124) });


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(3);
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(9);
var gOPD = __webpack_require__(20);
var getPrototypeOf = __webpack_require__(37);
var has = __webpack_require__(13);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(30);
var anObject = __webpack_require__(3);
var isObject = __webpack_require__(4);

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);
var setProto = __webpack_require__(70);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(283);
module.exports = __webpack_require__(7).Array.includes;


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(0);
var $includes = __webpack_require__(51)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(38)('includes');


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(285);
module.exports = __webpack_require__(7).Array.flatMap;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(286);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(6);
var aFunction = __webpack_require__(18);
var arraySpeciesCreate = __webpack_require__(112);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(38)('flatMap');


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = __webpack_require__(53);
var isObject = __webpack_require__(4);
var toLength = __webpack_require__(6);
var ctx = __webpack_require__(17);
var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(288);
module.exports = __webpack_require__(7).String.padStart;


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);
var userAgent = __webpack_require__(59);

// https://github.com/zloirock/core-js/issues/280
var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(290);
module.exports = __webpack_require__(7).String.padEnd;


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);
var userAgent = __webpack_require__(59);

// https://github.com/zloirock/core-js/issues/280
var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(292);
module.exports = __webpack_require__(7).String.trimLeft;


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(41)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(294);
module.exports = __webpack_require__(7).String.trimRight;


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(41)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(296);
module.exports = __webpack_require__(66).f('asyncIterator');


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(97)('asyncIterator');


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(298);
module.exports = __webpack_require__(7).Object.getOwnPropertyDescriptors;


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(124);
var toIObject = __webpack_require__(15);
var gOPD = __webpack_require__(20);
var createProperty = __webpack_require__(82);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(300);
module.exports = __webpack_require__(7).Object.values;


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(126)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(302);
module.exports = __webpack_require__(7).Object.entries;


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(126)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(118);
__webpack_require__(304);
module.exports = __webpack_require__(7).Promise['finally'];


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(0);
var core = __webpack_require__(7);
var global = __webpack_require__(1);
var speciesConstructor = __webpack_require__(49);
var promiseResolve = __webpack_require__(120);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(306);
__webpack_require__(307);
__webpack_require__(308);
module.exports = __webpack_require__(7);


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global = __webpack_require__(1);
var $export = __webpack_require__(0);
var userAgent = __webpack_require__(59);
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $task = __webpack_require__(88);
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(85);
var getKeys = __webpack_require__(33);
var redefine = __webpack_require__(11);
var global = __webpack_require__(1);
var hide = __webpack_require__(14);
var Iterators = __webpack_require__(42);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

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

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
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

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
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
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
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
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
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
    this.reset(true);
  }

  exports.keys = function(object) {
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
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
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

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
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
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
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

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(311);
module.exports = __webpack_require__(127).global;


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(312);

$export($export.G, { global: __webpack_require__(90) });


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(90);
var core = __webpack_require__(127);
var ctx = __webpack_require__(313);
var hide = __webpack_require__(315);
var has = __webpack_require__(322);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(314);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 314 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(316);
var createDesc = __webpack_require__(321);
module.exports = __webpack_require__(92) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(317);
var IE8_DOM_DEFINE = __webpack_require__(318);
var toPrimitive = __webpack_require__(320);
var dP = Object.defineProperty;

exports.f = __webpack_require__(92) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(91);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(92) && !__webpack_require__(128)(function () {
  return Object.defineProperty(__webpack_require__(319)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(91);
var document = __webpack_require__(90).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(91);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 321 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 322 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// Import objects
// Import Third party libraries


// Import component library


// Import objects for this app


var _animejs = __webpack_require__(93);

var _animejs2 = _interopRequireDefault(_animejs);

var _Button = __webpack_require__(129);

var _Button2 = _interopRequireDefault(_Button);

var _Label = __webpack_require__(94);

var _Label2 = _interopRequireDefault(_Label);

var _Slider = __webpack_require__(130);

var _Slider2 = _interopRequireDefault(_Slider);

var _Input = __webpack_require__(131);

var _Input2 = _interopRequireDefault(_Input);

var _InputSlider = __webpack_require__(132);

var _InputSlider2 = _interopRequireDefault(_InputSlider);

var _WeightedInputSlider = __webpack_require__(324);

var _WeightedInputSlider2 = _interopRequireDefault(_WeightedInputSlider);

var _Group = __webpack_require__(133);

var _Group2 = _interopRequireDefault(_Group);

var _Tabber = __webpack_require__(325);

var _Tabber2 = _interopRequireDefault(_Tabber);

var _Toggle = __webpack_require__(326);

var _Toggle2 = _interopRequireDefault(_Toggle);

var _SvgArea = __webpack_require__(134);

var _SvgArea2 = _interopRequireDefault(_SvgArea);

var _SvgLabel = __webpack_require__(62);

var _SvgLabel2 = _interopRequireDefault(_SvgLabel);

var _SvgLine = __webpack_require__(63);

var _SvgLine2 = _interopRequireDefault(_SvgLine);

var _SvgBox = __webpack_require__(64);

var _SvgBox2 = _interopRequireDefault(_SvgBox);

var _SvgGraph = __webpack_require__(327);

var _SvgGraph2 = _interopRequireDefault(_SvgGraph);

var _SvgCircle = __webpack_require__(95);

var _SvgCircle2 = _interopRequireDefault(_SvgCircle);

var _Surface = __webpack_require__(330);

var _Surface2 = _interopRequireDefault(_Surface);

var _Impactor = __webpack_require__(135);

var _Impactor2 = _interopRequireDefault(_Impactor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Variables shared across instances
var MIN_MASS = 1e8; //Math.pow (10, 8);
var MID_MASS = 1e13; //Math.pow (10, 8);
var MAX_MASS = 1e15; //Math.pow (10,11);

// const MIN_MASS = 0 //Math.pow (10, 8);
// const MID_MASS = 1 //Math.pow (10, 8);
// const MAX_MASS = 100 //Math.pow (10,11);

var MASS_UNIT = 'kg';

var MIN_VELOCITY = 10;
var MAX_VELOCITY = 50;
var VELOCITY_UNIT = 'km/s';

var MIN_DIAMETER = 1.58E-4 * Math.pow(MIN_MASS, 0.26) * Math.pow(1000 * MIN_VELOCITY, 0.44);
var MAX_DIAMETER = 1.58E-4 * Math.pow(MAX_MASS, 0.26) * Math.pow(1000 * MAX_VELOCITY, 0.44);
var DIAMETER_UNIT = 'km';

var SVG_HEIGHT = 302;

var GRAPH_X = 70;
var GRAPH_Y = 10;
var GRAPH_HEIGHT = 235;
var GRAPH_WIDTH = 330;
var GRAPH_Y_TITLE_PADDING = 35;
var GRAPH_BG_COLOR = '#1b0107';
var GRAPH_POINT_COLOR = '#ffd600';
var GRAPH_GRID_COLOR = '#784655';

// const USE_SCIENTIFIC_NOTATION = false;

// The starting point for the application

var App = function () {

    // Set up UI and event handlers
    function App(config) {
        var _this = this;

        _classCallCheck(this, App);

        // Prepare data
        this.velocityPointList = [];
        this.massPointList = [];
        this.activeTabName = 'Mass';

        // Left Side
        // Create group for housing mass and velocity input sliders
        var inputSliderGroup = new _Group2.default({
            parent: $('#visualization'),
            label: { content: 'Mass and Velocity of Impactor' },
            class: 'ui group mass-velocity'
        });

        // create mass input slider
        var massInputSlider = new _InputSlider2.default({
            label: { content: 'Mass', suffix: '<sub>(' + MASS_UNIT + ')</sub>' },
            slider: { prop: { min: 0, max: 100 } },
            onInput: function onInput(data) {
                data.inputEvent = true;_this.massChangeHandler(data);
            },
            // onInput: () => { /* Silence this handler */ },
            onSlider: function onSlider(data) {
                _this.massChangeHandler(data);
            },
            onEnter: function onEnter(data) {
                data.inputEvent = true;_this.massChangeHandler(data);
            }
        });

        massInputSlider.setValue(MIN_MASS);
        massInputSlider.input.node.val(this.convertToTenToThePowerOf(MIN_MASS.toExponential(2)));

        // create velocity input slider
        var velocityInputSlider = new _InputSlider2.default({
            label: { content: 'Velocity', suffix: '<sub>(' + VELOCITY_UNIT + ')</sub>' },
            slider: { prop: { min: MIN_VELOCITY, max: MAX_VELOCITY } },
            onInput: function onInput(data) {
                _this.velocityChangeHandler(data);
            },
            onSlider: function onSlider(data) {
                _this.velocityChangeHandler(data);
            },
            onEnter: function onEnter(data) {
                _this.velocityChangeHandler(data);
            }
        });
        velocityInputSlider.setValue(MIN_VELOCITY);

        // Add content to input slider group
        inputSliderGroup.addContent(massInputSlider.node);
        inputSliderGroup.addContent(velocityInputSlider.node);

        // Store input sliders
        this.massInputSlider = massInputSlider;
        this.velocityInputSlider = velocityInputSlider;

        // Create group for housing surface impact/reset buttons
        var surfaceGroup = new _Group2.default({
            parent: $('#visualization'),
            label: { content: 'Lunar Surface' },
            class: 'ui group surface'
        });
        // Create launch button
        var surfaceLaunchButton = new _Button2.default({
            label: 'Impact!',
            onClick: function onClick(data) {
                _this.launchImpactor(data);
            },
            prop: {
                id: 'launch-button'
            }
        });

        // Create Reset button
        var surfaceResetButton = new _Button2.default({
            label: 'Reset',
            onClick: function onClick(data) {
                _this.resetSurface(data);
            },
            prop: {
                id: 'reset-button'
            }
        });

        $('#reset-button').addClass('disabled');

        // Add content to surface group
        surfaceGroup.addContent(surfaceLaunchButton.node);
        surfaceGroup.addContent(surfaceResetButton.node);

        // Create tabber for housing graphs
        var graphTabber = new _Tabber2.default({
            tabs: ['Mass', 'Velocity'],
            onTabChange: function onTabChange(data) {
                _this.tabChangeHandler(data);
            },
            parent: $('#graph')
        });

        // store tabber for reference later
        this.graphTabber = graphTabber;

        // Create mass graph
        var graphMassSvg = new _SvgArea2.default({
            svg: { height: SVG_HEIGHT, width: '100%' }
        });

        this.graphMassSvg = graphMassSvg;

        var graphMass = new _SvgGraph2.default({
            parent: graphMassSvg.node,
            svg: {
                x: GRAPH_X, y: GRAPH_Y,
                width: GRAPH_WIDTH, height: GRAPH_HEIGHT
            },
            box: {
                svg: {
                    fill: GRAPH_BG_COLOR,
                    stroke: GRAPH_GRID_COLOR,
                    'stroke-width': 2
                }
            },
            grid: {
                segments: 10,
                svg: {
                    fill: GRAPH_GRID_COLOR,
                    stroke: GRAPH_GRID_COLOR,
                    'stroke-width': 1
                }
            },
            yAxis: {
                left: {
                    labelOffset: 40,
                    titlePadding: GRAPH_Y_TITLE_PADDING,
                    title: {
                        innerHTML: 'Diameter (' + DIAMETER_UNIT + ')',
                        svg: {}
                    },
                    labelPadding: 0,
                    rotateLabels: false,
                    type: 'y',
                    minValue: MIN_DIAMETER,
                    maxValue: MAX_DIAMETER,
                    labels: ['30', '60', '90', '120', '150'],
                    svg: {}
                }
            },
            xAxis: {
                bottom: {
                    labelOffset: -10,
                    titlePadding: 30,
                    title: {
                        innerHTML: 'Mass (' + MASS_UNIT + ')',
                        svg: {}
                    },
                    labelPadding: 10,
                    type: 'x',
                    minValue: MIN_MASS,
                    maxValue: MAX_MASS,
                    labels: ['1e8', '2e14', '4e14', '6e14', '8e14', '1e15'],
                    rotateLabels: false,
                    svg: {}
                }
            }
        });

        // Create velocity graph
        var graphVelocitySvg = new _SvgArea2.default({
            svg: { height: SVG_HEIGHT, width: '100%' }
        });

        this.graphVelocitySvg = graphVelocitySvg;

        var graphVelocity = new _SvgGraph2.default({
            parent: graphVelocitySvg.node,
            svg: {
                x: GRAPH_X, y: GRAPH_Y,
                width: GRAPH_WIDTH, height: GRAPH_HEIGHT
            },
            box: {
                svg: {
                    fill: GRAPH_BG_COLOR,
                    stroke: GRAPH_GRID_COLOR,
                    'stroke-width': 2
                }
            },
            grid: {
                segments: 10,
                svg: {
                    fill: GRAPH_GRID_COLOR,
                    stroke: GRAPH_GRID_COLOR,
                    'stroke-width': 1
                }
            },
            yAxis: {
                left: {
                    labelOffset: 40,
                    titlePadding: GRAPH_Y_TITLE_PADDING,
                    title: {
                        innerHTML: 'Diameter (' + DIAMETER_UNIT + ')',
                        svg: {}
                    },
                    labelPadding: 0,
                    rotateLabels: false,
                    type: 'y',
                    minValue: MIN_DIAMETER,
                    maxValue: MAX_DIAMETER,
                    labels: ['30', '60', '90', '120', '150'],
                    svg: {}
                }
            },
            xAxis: {
                bottom: {
                    scientificNotation: false,
                    labelOffset: -10,
                    titlePadding: 30,
                    title: {
                        innerHTML: 'Velocity (' + VELOCITY_UNIT + ')',
                        svg: {}
                    },
                    labelPadding: 10,
                    type: 'x',
                    minValue: MIN_VELOCITY,
                    maxValue: MAX_VELOCITY,
                    labels: ['10', '18', '26', '34', '42', '50'],
                    rotateLabels: false,
                    svg: {}
                }
            }
        });

        // Store the svg objects for later reference
        this.graphMassSvg = graphMassSvg;
        this.graphMass = graphMass;
        this.graphVelocitySvg = graphVelocitySvg;
        this.graphVelocity = graphVelocity;

        // Create coordinate inputs for each tab
        var massXInput = new _Input2.default({
            onInput: function onInput() {
                _this.checkFields();
            },
            onEnter: function onEnter() {
                _this.checkFields();
            },
            prop: { placeholder: 'X', id: 'massXInput' }
        });
        var massYInput = new _Input2.default({
            onInput: function onInput() {
                _this.checkFields();
            },
            onEnter: function onEnter() {
                _this.checkFields();
            },
            prop: { placeholder: 'Y', id: 'massYInput' }
        });

        var velXInput = new _Input2.default({
            onInput: function onInput() {
                _this.checkFields();
            },
            onEnter: function onEnter() {
                _this.checkFields();
            },
            prop: { placeholder: 'X', id: 'velocityXInput' }
        });
        var velYInput = new _Input2.default({
            onInput: function onInput() {
                _this.checkFields();
            },
            onEnter: function onEnter() {
                _this.checkFields();
            },
            prop: { placeholder: 'Y', id: 'velocityYInput' }
        });

        // Create a button for plotting the current point
        var plotMassDataButton = new _Button2.default({
            prop: { id: 'plotMass' },
            label: 'Plot Data',
            class: 'ui button disabled',
            onClick: function onClick(data) {
                _this.plotData(data);
            }
        });
        var plotVelocityDataButton = new _Button2.default({
            prop: { id: 'plotVelocity' },
            label: 'Plot Data',
            class: 'ui button disabled',
            onClick: function onClick(data) {
                _this.plotData(data);
            }
        });
        // Add sliders for determining curve of points
        var massCurveLabel = new _Label2.default({
            class: 'ui curve label hide',
            prefix: 'Set Curve:',
            content: 'm<sup>1/4</sup>'
        });
        var massCurveSlider = new _Slider2.default({
            class: 'ui curve slide hide',
            onInput: function onInput(data) {
                var val = Number(data.value);

                var content = void 0;
                switch (val) {
                    case 1:
                        _this.curvePower = 2;
                        content = 'm<sup>1/4</sup>';
                        break;
                    case 2:
                        _this.curvePower = 3;
                        content = 'm<sup>1/3</sup>';
                        break;
                    case 3:
                        _this.curvePower = 1;
                        content = 'm<sup>1/2</sup>';
                        break;
                }

                // Val can only be 1, 2, or 3. We need the inverse of the value
                _this.massCurveLabel.setContent(content);

                _this.plotCurve();

                if (_this.simModel) {
                    _this.simModel.set('massFit', val);
                }
            },
            prop: {
                min: 1, max: 3, step: 1,
                value: 1
            }
        });
        var velocityCurveLabel = new _Label2.default({
            class: 'ui curve label hide',
            prefix: 'Set Curve:',
            content: 'v<sup>1/4</sup>'
        });
        var velocityCurveSlider = new _Slider2.default({
            class: 'ui curve slide hide',
            onInput: function onInput(data) {
                var val = Number(data.value);
                _this.curvePower = val;

                var content = void 0;
                switch (val) {
                    case 1:
                        _this.curvePower = 2;
                        content = 'v<sup>1/4</sup>';
                        break;
                    case 2:
                        _this.curvePower = 3;
                        content = 'v<sup>1/3</sup>';
                        break;
                    case 3:
                        _this.curvePower = 1;
                        content = 'v<sup>1/2</sup>';
                        break;
                }

                // Val can only be 1, 2, or 3. We need the inverse of the value
                _this.velocityCurveLabel.setContent(content);
                _this.plotCurve();
                if (_this.simModel) {
                    _this.simModel.set('velocityFit', val);
                }
            },
            prop: {
                min: 1, max: 3, step: 1,
                value: 1
            }
        });

        this.massCurveSlider = massCurveSlider;
        this.velocityCurveSlider = velocityCurveSlider;

        graphTabber.addContent('Mass', massCurveLabel.node);
        graphTabber.addContent('Mass', massCurveSlider.node);
        graphTabber.addContent('Velocity', velocityCurveLabel.node);
        graphTabber.addContent('Velocity', velocityCurveSlider.node);

        this.massCurveLabel = massCurveLabel;
        this.massCurveSlider = massCurveSlider;
        this.velocityCurveLabel = velocityCurveLabel;
        this.velocityCurveSlider = velocityCurveSlider;

        // Store inputs for later use
        this.massXInput = massXInput;
        this.massYInput = massYInput;
        this.velXInput = velXInput;
        this.velYInput = velYInput;
        this.plotMassDataButton = plotMassDataButton;
        this.plotVelocityDataButton = plotVelocityDataButton;

        // Add content to tabber
        graphTabber.addContent('Mass', massXInput.node);
        graphTabber.addContent('Mass', massYInput.node);
        graphTabber.addContent('Mass', plotMassDataButton.node);
        graphTabber.addContent('Mass', graphMassSvg.node);

        graphTabber.addContent('Velocity', velXInput.node);
        graphTabber.addContent('Velocity', velYInput.node);
        graphTabber.addContent('Velocity', plotVelocityDataButton.node);
        graphTabber.addContent('Velocity', graphVelocitySvg.node);

        var extraControls = new _Group2.default({
            parent: $('#graph'),
            label: { content: ' ' },
            class: 'ui group extra controls'
        });

        var removePointsButton = new _Button2.default({
            template: '\n            <button class="ui labeled icon button">\n                <i class="trash icon"></i>\n                Clear\n            </button>\n            ',
            class: 'ui button delete',
            onClick: function onClick() {
                _this.clearGraph();
            }
        });

        var undoPointButton = new _Button2.default({
            template: '\n            <button class="ui labeled icon button">\n                <i class="undo icon"></i>\n                Undo\n            </button>\n            ',
            class: 'ui button undo',
            onClick: function onClick() {
                _this.undoPoint();
            }
        });

        var curveToggle = new _Toggle2.default({
            parent: extraControls.content,
            onClick: function onClick(data) {
                _this.toggleGraphInputs();
            }
        });

        var curveToggleLabel = new _Label2.default({
            parent: extraControls.content,
            content: 'Fit Data'
        });

        extraControls.addContent(removePointsButton.node);
        extraControls.addContent(undoPointButton.node);

        this.curveToggle = curveToggle;

        // Stuff that needs compiled styling to work:
        window.setTimeout(function () {
            // Create SVG Area for visualization
            _this.surface = new _Surface2.default({
                parent: $('#visualization'),
                onMeasureToolMove: function onMeasureToolMove(data) {
                    _this.measureToolMoveHandler(data);
                },
                onMeasureToolConnected: function onMeasureToolConnected(data) {
                    _this.measureToolConnectedHandler(data);
                },
                maxDiameter: MAX_DIAMETER,
                minDiameter: MIN_DIAMETER,
                maxMass: MAX_MASS,
                minMass: MIN_MASS
            });

            _this.impactor = new _Impactor2.default({
                parent: $('#visualization'),
                surface: _this.surface
            });

            // This stuff just needs to be added after the surface
            // so it renders in the correct order
            // Create group for housing data labels
            var dataGroup = new _Group2.default({
                parent: $('#visualization'),
                label: { content: 'Data' },
                class: 'ui group data'
            });

            // Create data label for mass?
            var dataMassLabel = new _Label2.default({
                prefix: 'Mass <sub>(' + MASS_UNIT + ')</sub>', content: '0'
            });

            // Create data label for velocity?
            var dataVelocityLabel = new _Label2.default({
                prefix: 'Velocity <sub>(' + VELOCITY_UNIT + ')</sub>', content: '0'
            });

            // Create data label for diameter
            var dataDiameterLabel = new _Label2.default({
                prefix: 'Diameter <sub>(' + DIAMETER_UNIT + ')</sub>', content: '???'
            });

            // Add content to data group
            dataGroup.addContent(dataMassLabel.node);
            dataGroup.addContent(dataVelocityLabel.node);
            dataGroup.addContent(dataDiameterLabel.node);

            _this.dataDiameterLabel = dataDiameterLabel;
            _this.dataMassLabel = dataMassLabel;
            _this.dataVelocityLabel = dataVelocityLabel;

            _this.dataMassLabel.setContent(_this.convertToScientificNotation(_this.massInputSlider.getValue()));
            _this.dataVelocityLabel.setContent(_this.velocityInputSlider.getValue());

            _this.radarBlip = new _SvgCircle2.default({
                parent: graphMassSvg.node,
                svg: {
                    'stroke': GRAPH_POINT_COLOR,
                    'stroke-width': 2,
                    'fill-opacity': 1,
                    r: 10, cx: -1000, cy: -1000
                }
            });

            _this.plotCurve();
            _this.hideCurve();
        }, 500);

        this.curvePower = 2;
        this.massInputSlider.slider.setValue(0);
    }

    // Clear out the visualization and contact our surface object
    // to tell it to play the impact animation


    _createClass(App, [{
        key: 'launchImpactor',
        value: function launchImpactor() {
            var diameter = void 0,
                mass = void 0,
                vel = void 0;

            mass = Number(this.convertToScientificNotation(this.massInputSlider.getValue()));
            vel = this.velocityInputSlider.getValue();
            diameter = this.craterDiameter;

            this.surface.measureTool.clearLine();
            this.surface.measureTool.hidePoints();
            this.surface.launchImpactor(mass, vel);
        }

        // What to do when our mass slider changes

    }, {
        key: 'massChangeHandler',
        value: function massChangeHandler(data) {
            // if the user is typing
            if (data.inputEvent) {
                var value = data.value;
                // The typed value is invalid
                if (value > MAX_MASS || value < MIN_MASS || isNaN(value)) {
                    this.dataMassLabel.setContent('???');
                    return;
                }

                value = value.toExponential(2);
                // Now convert it back to a log and convert it to its E notation
                this.dataMassLabel.setContent(value);

                if (this.simModel) {
                    window.preventRecursion = true;
                    this.simModel.set('mass', Number(value));
                    window.preventRecursion = false;
                }
            }
            // If the user used the slider
            else {
                    var _value = Number(data.value);

                    var logVal = this.logSlider(_value);
                    _value = logVal.toExponential(2);

                    if (this.simModel) {
                        window.preventRecursion = true;
                        this.simModel.set('mass', Number(_value));
                        window.preventRecursion = false;
                    }

                    // value = this.convertToTenToThePowerOf ( value );

                    this.dataMassLabel.setContent(_value);
                    this.massInputSlider.input.setValue(_value);
                    this.massInputSlider.slider.setValue(data.value);
                }
        }

        /*
             Ganked from: https://stackoverflow.com/questions/846221/logarithmic-slider
         */

    }, {
        key: 'logSlider',
        value: function logSlider(position) {
            // position will be between 0 and 100
            var minp = 0;
            var maxp = 100;

            // The result should be between 100 an 10000000
            var minv = Math.log(MIN_MASS);
            var maxv = Math.log(MAX_MASS);

            // calculate adjustment factor
            var scale = (maxv - minv) / (maxp - minp);

            return Math.exp(minv + scale * (position - minp));
        }

        // What to do when the user is connecting the
        // two white dots at both ends of a crater

    }, {
        key: 'measureToolMoveHandler',
        value: function measureToolMoveHandler(data) {
            var value = Math.round(data.distance);
            value = this.numberWithCommas(value);

            // console.log ('Actual received value:', data.distance, '\nPrinted value:', value)

            this.craterDiameter = Math.round(data.distance);

            // console.log (data)

            this.dataDiameterLabel.setContent('???');
        }
    }, {
        key: 'measureToolConnectedHandler',
        value: function measureToolConnectedHandler() {
            var vel = this.velocityInputSlider.getValue();
            var mass = this.massInputSlider.getValue();
            var diameter = this.surface.getDiameter(mass, vel);

            var value = this.numberWithCommas(Math.round(diameter));
            this.dataDiameterLabel.setContent(value);
        }

        // What to do when the velocity slider changes

    }, {
        key: 'velocityChangeHandler',
        value: function velocityChangeHandler(data) {
            var value = this.velocityInputSlider.getValue();
            this.dataVelocityLabel.setContent(value);

            if (this.simModel) {
                this.simModel.set('velocity', Number(value));
            }
        }

        // Clean up your mess, Impactor.
        // Resets the visualization area

    }, {
        key: 'resetSurface',
        value: function resetSurface(data) {
            $('#launch-button').removeClass('disabled');
            $('#reset-button').addClass('disabled');

            this.massXInput.node.val('');
            this.massYInput.node.val('');
            this.velXInput.node.val('');
            this.velYInput.node.val('');

            this.dataDiameterLabel.setContent('???');
            this.surface.measureTool.clearLine();
            this.surface.measureTool.hidePoints();
            this.surface.impactor.cleanUp();
        }

        // Hides and reveals approrpiate input fields
        // This switches between entering an X and Y
        // value to manipulating a slider.

    }, {
        key: 'toggleGraphInputs',
        value: function toggleGraphInputs() {
            if (this.curveToggle.on) {
                this.massXInput.node.addClass('hide');
                this.massYInput.node.addClass('hide');
                this.velXInput.node.addClass('hide');
                this.velYInput.node.addClass('hide');
                this.plotMassDataButton.node.addClass('hide');
                this.plotVelocityDataButton.node.addClass('hide');

                this.massCurveLabel.node.removeClass('hide');
                this.massCurveSlider.node.removeClass('hide');
                this.velocityCurveLabel.node.removeClass('hide');
                this.velocityCurveSlider.node.removeClass('hide');

                if (!this.curvePower) {
                    this.curvePower = 1;
                }
                this.plotCurve();
            } else {
                this.massXInput.node.removeClass('hide');
                this.massYInput.node.removeClass('hide');
                this.velXInput.node.removeClass('hide');
                this.velYInput.node.removeClass('hide');
                this.plotMassDataButton.node.removeClass('hide');
                this.plotVelocityDataButton.node.removeClass('hide');

                this.massCurveLabel.node.addClass('hide');
                this.massCurveSlider.node.addClass('hide');
                this.velocityCurveLabel.node.addClass('hide');
                this.velocityCurveSlider.node.addClass('hide');

                this.hideCurve();
            }

            this.tabChangeHandler();
        }

        // Puts a point on the graph and creates a cool
        // radar ping so the user can clearly see where
        // their new point is.

    }, {
        key: 'plotData',
        value: function plotData() {
            // Collect the mass and velocity;
            var incorrect = void 0,
                diameter = void 0,
                mass = void 0,
                vel = void 0;

            var activeGraph = this.graphTabber.activeTabName;

            mass = Number(this.convertToScientificNotation(this.massInputSlider.getValue()));
            vel = this.velocityInputSlider.getValue();

            // Try to grab the diameter value from the read out
            diameter = Number(this.dataDiameterLabel.getContent());
            // console.log (diameter);

            // if that failed, grab the diameter using the equation
            if (isNaN(diameter)) {
                diameter = this.surface.getDiameter(mass, vel);
            }

            var coordinate = {};
            var point = void 0;
            var blipCoord = {};

            // Plot the mass graph coordinate
            coordinate.x = this.graphMass.findXOfValue(mass);
            coordinate.y = this.graphMass.findYOfValue(diameter);

            // console.log (coordinate)

            point = new _SvgCircle2.default({
                parent: this.graphMassSvg.node,
                svg: {
                    cx: coordinate.x,
                    cy: coordinate.y,
                    r: 5, fill: GRAPH_POINT_COLOR
                }
            });

            if (activeGraph == 'Mass') {
                blipCoord = Object.assign({}, coordinate);
            }

            this.massPointList.push(point);

            // Plot the velocity graph coordinate
            coordinate.x = this.graphVelocity.findXOfValue(vel);
            coordinate.y = this.graphVelocity.findYOfValue(diameter);

            point = new _SvgCircle2.default({
                parent: this.graphVelocitySvg.node,
                svg: {
                    cx: coordinate.x,
                    cy: coordinate.y,
                    r: 5, fill: GRAPH_POINT_COLOR
                }
            });

            if (activeGraph == 'Velocity') {
                blipCoord = Object.assign({}, coordinate);
            }

            this.velocityPointList.push(point);

            // Play an animation for the radar blip
            this.radarBlip.node.attr({
                cx: blipCoord.x,
                cy: blipCoord.y,
                r: 0,
                'stroke-opacity': 1,
                'fill-opacity': 1
            });

            (0, _animejs2.default)(_defineProperty({
                targets: this.radarBlip.node[0],
                r: 100,
                cx: blipCoord.x,
                cy: blipCoord.y,
                'stroke-opacity': 0,
                'fill-opacity': 0,
                duration: 3000,
                easing: 'linear'
            }, 'easing', 'easeInOutSine'));

            this.massXInput.node.val('');
            this.massYInput.node.val('');
            this.velXInput.node.val('');
            this.velYInput.node.val('');
            this.plotMassDataButton.node.addClass('disabled');
            this.plotVelocityDataButton.node.addClass('disabled');

            if (this.simModel) {
                var count = void 0,
                    diameters = void 0,
                    points = void 0;
                diameter = this.surface.getDiameter(mass, vel);

                if (activeGraph == 'Velocity') {
                    count = Number(this.simModel.get('velocityGraphPointCount'));
                    count++;
                    this.simModel.set('velocityGraphPointCount', count);

                    diameters = JSON.parse(this.simModel.get('velocityGraphDiameters'));
                    diameters.push(diameter);
                    this.simModel.set('velocityGraphDiameters', JSON.stringify(diameters));

                    points = JSON.parse(this.simModel.get('velocityGraphPlottedPoints'));
                    points.push(coordinate);
                    this.simModel.set('velocityGraphPlottedPoints', JSON.stringify(points));
                } else {
                    count = Number(this.simModel.get('massGraphPointCount'));
                    count++;
                    this.simModel.set('massGraphPointCount', count);

                    diameters = JSON.parse(this.simModel.get('massGraphDiameters'));
                    diameters.push(diameter);
                    this.simModel.set('massGraphDiameters', JSON.stringify(diameters));

                    points = JSON.parse(this.simModel.get('massGraphPlottedPoints'));
                    points.push(coordinate);
                    this.simModel.set('massGraphPlottedPoints', JSON.stringify(points));
                }

                // update how many points were plotted
                var pointsPlotted = Number(this.simModel.get('pointsPlotted'));
                pointsPlotted++;
                this.simModel.set('pointsPlotted', pointsPlotted);

                // Check if there is a new smallest mass graph point
                var smallestMassPoint = Number(this.simModel.get('smallestMassPoint'));
                if (diameter < smallestMassPoint) {
                    smallestMassPoint = diameter;
                }
                this.simModel.set('smallestMassPoint', smallestMassPoint);

                // Check if there is a new largest mass graph point
                var largestMassPoint = Number(this.simModel.get('largestMassPoint'));
                if (diameter > largestMassPoint) {
                    largestMassPoint = diameter;
                }
                this.simModel.set('largestMassPoint', largestMassPoint);

                // Check is there is a new smallest velocity graph point
                var smallestVelocityPoint = Number(this.simModel.get('smallestVelocityPoint'));
                if (diameter < smallestVelocityPoint) {
                    smallestVelocityPoint = diameter;
                }
                this.simModel.set('smallestVelocityPoint', smallestVelocityPoint);

                var largestVelocityPoint = Number(this.simModel.get('largestVelocityPoint'));
                if (diameter > largestVelocityPoint) {
                    largestVelocityPoint = diameter;
                }
                this.simModel.set('largestVelocityPoint', largestVelocityPoint);
            }

            // Make sure the user cannot plot a new point without re-launching the impactor
            this.craterDiameter = 'plotted';
        }

        // Renders a curve when the "Fit Data" toggle
        // is turned on

    }, {
        key: 'plotCurve',
        value: function plotCurve() {
            var end = void 0,
                increment = void 0,
                index = void 0,
                minY = void 0,
                offset = void 0,
                power = void 0,
                stroke = void 0,
                x1 = void 0,
                x2 = void 0,
                y1 = void 0,
                y2 = void 0;

            power = this.curvePower;

            if (isNaN(power)) {
                power = 1;
            }

            var svg = $('.ui.tab.active').find('svg')[0];
            svg = $(svg);

            index = 1;
            end = 17;
            var height = svg.height();
            var width = svg.width();
            increment = height / (end - 1);
            offset = { x: 100, y: -47 };
            minY = 10;
            var maxX = 500;

            var xIncrement = GRAPH_WIDTH / (end - 1);
            var yIncrement = GRAPH_HEIGHT / (end - 1);

            // If curve points don't exist, create them
            if (!this.curve) {
                this.curve = {};
                this.curve.points = [];
                stroke = 'white';

                while (index < end) {

                    this.curve.points.push(new _SvgLine2.default({
                        parent: svg,
                        svg: { x1: 0, x2: 0, y1: 0, y2: 0, stroke: stroke }
                    }));

                    index++;
                }
            }

            var largestX = 0;

            switch (power) {
                case 1:
                    this.plotLinearLine();break;
                case 2:
                    this.plotCurvedLine();break;
                case 3:
                    // Manipulate curve points to fit given exponential
                    this.curve.points.forEach(function (item, index) {
                        stroke = 'white';

                        // Position the y coordinate
                        // Move coordinate to unmodified position on graph.
                        // Just this should create a linear line.
                        y1 = index * yIncrement;
                        y2 = (index + 1) * yIncrement;

                        // flip the plotted point so the graph plots in Quadrant 1
                        y1 = height - y1;
                        y2 = height - y2;

                        // Apply an offset so the plotted line actually fits in the graph
                        y1 = y1 + offset.y;
                        y2 = y2 + offset.y;

                        // Position the x coordinate
                        // Move the coordinate to the unmodified position of graph
                        x1 = index;
                        x2 = index + 1;

                        // Now apply our increment
                        x1 *= xIncrement;
                        x2 *= xIncrement;

                        // Apply the exponent so our line curves
                        x1 = Math.pow(x1, power);
                        x2 = Math.pow(x2, power);

                        // Offset the coordinate so it fits on the graph
                        x1 = x1 + offset.x;
                        x2 = x2 + offset.x;

                        // store the largest x value
                        if (x2 > largestX) {
                            largestX = x2;
                        }
                        item.node.attr({ x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke });
                    });

                    // Check to see if we over-shot the width of our graph.
                    var percent = (largestX - offset.x) / width;
                    // console.log ('X percent overshoot:', percent)

                    //If we did, scale down the whole graph on the x-axis
                    if (percent > 1) {
                        this.curve.points.forEach(function (item, index) {
                            x1 = Number(item.node.attr('x1'));
                            x2 = Number(item.node.attr('x2'));

                            y1 = Number(item.node.attr('y1'));
                            y2 = Number(item.node.attr('y2'));

                            y1 *= 0.55;
                            y2 *= 0.55;

                            y1 += 125 - 20;
                            y2 += 125 - 20;

                            x1 /= percent;
                            x2 /= percent;

                            x1 += offset.x - GRAPH_X / 2 + 5;
                            x2 += offset.x - GRAPH_X / 2 + 5;

                            stroke = 'white';

                            if (x1 > GRAPH_X + GRAPH_WIDTH) {
                                stroke = 'transparent';
                            } else if (x2 > GRAPH_X + GRAPH_WIDTH) {
                                x2 = GRAPH_X + GRAPH_WIDTH;
                            }

                            item.node.attr({ x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke });
                        });
                    }
                    break;
            }
        }

        // Plots data that matches the velocity graph

    }, {
        key: 'plotLinearLine',
        value: function plotLinearLine() {
            var points = [{ "x": 70, "y": 149.37763335791078 }, { "x": 78.25, "y": 145.20669974866001 }, { "x": 86.5, "y": 141.24314735581254 }, { "x": 111.25, "y": 130.3569929021371 }, { "x": 127.75, "y": 123.76637772173216 }, { "x": 152.5, "y": 114.64883902249224 }, { "x": 193.75, "y": 101.01908740046335 }, { "x": 210.25, "y": 95.99919639149533 }, { "x": 235, "y": 88.8453558693634 }, { "x": 259.75, "y": 82.08193163820374 }, { "x": 276.25, "y": 77.76264233230481 }, { "x": 317.5, "y": 67.53560634002326 }, { "x": 342.25, "y": 61.74061561051931 }, { "x": 358.75, "y": 58.00222274793637 }, { "x": 375.25, "y": 54.35576427133739 }, { "x": 400, "y": 49.04542630754196 }];

            var stroke = void 0,
                x1 = void 0,
                x2 = void 0,
                y1 = void 0,
                y2 = void 0;
            this.curve.points.forEach(function (item, index) {
                stroke = 'white';

                if (index === 0) {
                    x1 = points[0].x;
                    y1 = points[0].y;
                } else {
                    x1 = points[index - 1].x;
                    y1 = points[index - 1].y;
                }

                x2 = points[index].x;
                y2 = points[index].y;

                item.node.attr({ x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke });
            });
        }

        // Plots data that matches the mass graph

    }, {
        key: 'plotCurvedLine',
        value: function plotCurvedLine() {
            // let target = $ ('.ui.tab.active').find ('svg') [0]

            // console.log (target)

            // let height = target.height ();
            // let width = target.width ();
            // let offset = { x: 85, y: -47 - 10 }

            var points = [{ "x": 70, "y": 243.9028782795832 }, { "x": 70.0001320000132, "y": 242.41563532832268 }, { "x": 70.0002970000297, "y": 241.55670741009595 }, { "x": 70.0016170001617, "y": 238.8503701347255 }, { "x": 70.0032670003267, "y": 237.28737826444424 }, { "x": 70.0164670016467, "y": 232.36265400076442 }, { "x": 70.0329670032967, "y": 229.51847635241322 }, { "x": 70.1649670164967, "y": 220.55695138137762 }, { "x": 70.3299670329967, "y": 215.3813988726336 }, { "x": 71.64996716499671, "y": 199.07410418838532 }, { "x": 73.29996732999673, "y": 189.65614684444282 }, { "x": 86.49996864999687, "y": 159.98174870591015 }, { "x": 135.99997359999736, "y": 122.32165518266667 }, { "x": 201.99998019999802, "y": 97.74672363274448 }, { "x": 317.49999174999914, "y": 71.28811624384306 }, { "x": 400, "y": 57.65956809561456 }];

            var stroke = void 0,
                x1 = void 0,
                x2 = void 0,
                y1 = void 0,
                y2 = void 0;
            this.curve.points.forEach(function (item, index) {
                stroke = 'white';

                if (index === 0) {
                    x1 = points[0].x;
                    y1 = points[0].y;
                } else {
                    x1 = points[index - 1].x;
                    y1 = points[index - 1].y;
                }

                x2 = points[index].x;
                y2 = points[index].y;

                item.node.attr({ x1: x1, x2: x2, y1: y1, y2: y2, stroke: stroke });
            });
        }

        // Hides the curve

    }, {
        key: 'hideCurve',
        value: function hideCurve() {
            if (this.curve) {
                this.curve.points.forEach(function (item, index) {
                    item.node.attr({ stroke: 'transparent' });
                });
            }
        }

        // Makes sure the user entered correct numbers into the
        // input areas before allowing them to plot that point.

    }, {
        key: 'checkFields',
        value: function checkFields() {
            // Remove any incorrect classes
            this.massXInput.node.removeClass('invalid');
            this.massYInput.node.removeClass('invalid');
            this.velXInput.node.removeClass('invalid');
            this.velYInput.node.removeClass('invalid');

            // Get needed data
            var mass = this.massInputSlider.getValue();
            var vel = this.velocityInputSlider.getValue();

            // Try to grab the diameter value from the read out
            var diameter = Number(this.dataDiameterLabel.getContent());

            // if that failed, grab the diameter using the equation
            if (isNaN(diameter)) {
                diameter = Math.round(this.surface.getDiameter(mass, vel));
            }

            var incorrect = false;

            // Compare if the user entered the correct coordinates
            // Check the active tab
            var activeGraph = this.graphTabber.activeTabName;

            if (!activeGraph) {
                activeGraph = 'Mass';
            }

            var userDiameter = void 0,
                userMass = void 0,
                userVelocity = void 0;
            // Get the needed input values
            if (activeGraph == 'Mass') {
                userMass = this.massXInput.getValue();

                // console.log (userMass)

                userDiameter = this.massYInput.getValue();
                // Make sure our blip is on the right graph
                // this is not the point that appears upon a successful plot
                this.graphMassSvg.node.append(this.radarBlip.node);
            } else {
                userVelocity = this.velXInput.getValue();
                userDiameter = this.velYInput.getValue();
                // Make sure our blip is on the right graph
                // this is not the point that appears upon a successful plot
                this.graphVelocitySvg.node.append(this.radarBlip.node);
            }

            // console.log ('Mass:', mass, '\nVel:', vel, '\nDiameter:', diameter);
            // console.log ('\nUser Mass:', userMass, '\nUser Vel:', userVelocity, '\nUser Diameter:', userDiameter);

            if (this.simModel) {
                this.simModel.set('yInputAnswer', diameter);
            }

            var diameterCorrect = this.compareDiameter(diameter, userDiameter);

            if (isNaN(diameter)) {
                diameter = 1;
            }
            // if (isNaN (mass)) { mass = 10 }
            if (isNaN(vel)) {
                vel = 10;
            }
            // compare that the retrieved mass and velocity match the user's inputs
            if (activeGraph == 'Mass') {
                this.plotMassDataButton.node.removeClass('disabled');

                var mVal = Number(this.convertToScientificNotation(mass));

                var umVal = void 0;
                if (typeof userMass == 'string') {
                    umVal = Number(this.convertToScientificNotation(userMass));
                } else {
                    umVal = userMass;
                }

                if (Math.round(mVal) != Math.round(umVal)) {
                    this.plotMassDataButton.node.addClass('disabled');
                    // this.massXInput.node.addClass ('invalid');
                }

                if (!diameterCorrect) {
                    this.plotMassDataButton.node.addClass('disabled');
                    // this.massYInput.node.addClass ('invalid');
                }

                // The x input value needs to equal the mass slider
                if (this.simModel) {
                    this.simModel.set('xInputAnswer', mVal);
                }
            } else {
                this.plotVelocityDataButton.node.removeClass('disabled');

                if (Math.round(vel) != Math.round(userVelocity)) {
                    // this.velXInput.node.addClass ('invalid');
                    this.plotVelocityDataButton.node.addClass('disabled');
                }

                if (!diameterCorrect) {
                    // this.velYInput.node.addClass ('invalid');
                    this.plotVelocityDataButton.node.addClass('disabled');
                }

                // The x input value needs to equal the velocity slider
                if (this.simModel) {
                    this.simModel.set('yInputAnswer', vel);
                }
            }
        }
    }, {
        key: 'compareDiameter',
        value: function compareDiameter(d1, d2) {
            var useStrings = false;
            if (isNaN(Number(d1)) || isNaN(Number(d2))) {
                useStrings = true;
            }

            if (!useStrings) {
                return !(Math.round(d1) != Math.round(d2) && Math.floor(d1) != Math.floor(d2) && Math.ceil(d1) != Math.ceil(d2));
            } else {
                if (typeof d1 == 'number') {
                    d1 = this.numberWithCommas(Math.floor(d1));
                }
                if (typeof d2 == 'number') {
                    d2 = this.numberWithCommas(Math.floor(d2));
                }

                return d1 == d2;
            }
        }

        // What to do when either of the tabs are clicked

    }, {
        key: 'tabChangeHandler',
        value: function tabChangeHandler(data) {
            var _this2 = this;

            if (!data) {
                data = { tab: {} };
            }

            var name = data.tab.name;

            if (!name) {
                name = $('.ui.tab.active').find('div.content').html();
            }

            if (name == 'Mass') {
                var val = this.massCurveSlider.getValue();
                switch (val) {
                    case 1:
                        this.curvePower = 2;break;
                    case 2:
                        this.curvePower = 3;break;
                    case 3:
                        this.curvePower = 1;break;
                }
                this.curve.points.forEach(function (item) {
                    _this2.graphMassSvg.node.append(item.node);
                });
            } else {
                var _val = this.velocityCurveSlider.getValue();
                switch (_val) {
                    case 1:
                        this.curvePower = 2;break;
                    case 2:
                        this.curvePower = 3;break;
                    case 3:
                        this.curvePower = 1;break;
                }
                this.curve.points.forEach(function (item) {
                    _this2.graphVelocitySvg.node.append(item.node);
                });
            }

            if (this.curveToggle.on) {
                this.plotCurve();
            } else {
                this.hideCurve();
            }
        }

        // Removes the most recent point from both graphs

    }, {
        key: 'undoPoint',
        value: function undoPoint() {
            var key = this.velocityPointList.length - 1;
            this.massPointList[key].node.remove();
            this.massPointList.pop();
            this.velocityPointList[key].node.remove();
            this.velocityPointList.pop();

            if (this.simModel) {
                var pointsPlotted = Number(this.simModel.get('pointsPlotted'));
                pointsPlotted--;
                if (pointsPlotted < 0) {
                    pointsPlotted = 0;
                }
                this.simModel.set('pointsPlotted', pointsPlotted);
            }
        }

        // Removes all points from both graphs

    }, {
        key: 'clearGraph',
        value: function clearGraph() {
            this.massPointList.forEach(function (item) {
                item.node.remove();
            });
            this.massPointList = [];

            this.velocityPointList.forEach(function (item) {
                item.node.remove();
            });
            this.velocityPointList = [];

            if (this.simModel) {
                var pointsPlotted = Number(this.simModel.get('pointsPlotted'));
                pointsPlotted = 0;
                this.simModel.set('pointsPlotted', pointsPlotted);
            }
        }

        // Formats the number that goes into the "Diameter" label
        // in the "Data" box below the visualization.
        // Turns a number like 50000 into "50,000"

    }, {
        key: 'numberWithCommas',
        value: function numberWithCommas(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Converts scientific notation (for example: 5.34e+10)
        // to 10^ (for example: 5.34x10^9)

    }, {
        key: 'convertToTenToThePowerOf',
        value: function convertToTenToThePowerOf(num) {
            // let str;
            //
            // // Convert number to a string
            // if (typeof num == 'string' && num.indexOf ('e') > -1) { str = num; }
            // else { str = num.toExponential () }
            //
            // // 5.34e+10 becomes ['5.34', '10']
            // str = str.split ('e+');
            //
            // // ['5.34', '10'] becomes ['5.34', '10^10'];
            // str [1] = '10^' + str [1];
            //
            // // ['5.34', '10^10'] becomes '5.34x10^10';
            // str = str.join ('x');

            // return str;

            // Astronomy back peddled on wanting this. Hope this works...
            return num;
        }

        // Unconverts our exponential conversion to get a usuable value
        // For example: 5.34x10^10 becomes 5.34e+10

    }, {
        key: 'convertToScientificNotation',
        value: function convertToScientificNotation(str) {
            if (typeof str == 'number') {
                str = str.toExponential(2);
            }

            // 5.34x10^10 becomes ['5.34', '10'];
            var num = str.split('x10^');

            // [ '5.34', '10'] becomes '5.34e+10';
            num = num.join('e+');

            return num;
        }
    }, {
        key: 'setMeasuringEnabled',
        value: function setMeasuringEnabled(enabled) {
            if (enabled) {} else {
                // hide circles
                // preven circles

            }
        }
    }]);

    return App;
}();

exports.default = App;

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InputSlider2 = __webpack_require__(132);

var _InputSlider3 = _interopRequireDefault(_InputSlider2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   The same as an input slider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   It takes an additional set of parameters that cut the slider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   in half and tweens between two sets of values.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   This gives the option of having a slider that goes from 0 to 100
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   have resolution between 0 and 1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   So the slider will return values like this
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   --------------o--------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   0   0.4  0.8  1   25   75   100
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var WeightedInputSlider = function (_InputSlider) {
    _inherits(WeightedInputSlider, _InputSlider);

    function WeightedInputSlider(config) {
        _classCallCheck(this, WeightedInputSlider);

        // Add config stuff before setup so we don't need to re-render the slider

        // Make sure the basics are there
        if (!config) {
            config = {};
        }
        if (!('slider' in config)) {
            config.slider = {};
        }
        if (!('prop' in config.slider)) {
            config.slider.prop = {};
        }

        // Create default weighted values if there are any missing
        if (!('min' in config.slider.prop)) {
            config.slider.prop.min = 0;
        }
        if (!('mid' in config.slider.prop)) {
            config.slider.prop.mid = 1;
        }
        if (!('max' in config.slider.prop)) {
            config.slider.prop.max = 100;
        }

        // Run setup of extended objects

        // collect the min, mid, and max values for use in our functions
        var _this = _possibleConstructorReturn(this, (WeightedInputSlider.__proto__ || Object.getPrototypeOf(WeightedInputSlider)).call(this, config));

        _this.weight = config.slider.prop;
        return _this;
    }

    _createClass(WeightedInputSlider, [{
        key: 'determineWeightedOutcome',
        value: function determineWeightedOutcome(value) {
            var percent = void 0,
                truePercent = void 0;
            var minValue = void 0,
                maxValue = void 0,
                weightedValue = void 0;
            var maxSliderProgress = void 0,
                minSliderProgress = void 0,
                sliderProgress = void 0;

            // Looks at the given value
            // checks which side of the slider this lands on

            // Collect the true percentage of the slider
            truePercent = (value - this.weight.min) / (this.weight.max - this.weight.min);

            // Collect our weighted ranges based on the true percent
            if (truePercent <= 0.5) {
                minValue = this.weight.min;
                maxValue = this.weight.mid;
                percent = truePercent * 2; // This gives us a number between 0 and 1
            } else {
                minValue = this.weight.mid;
                maxValue = this.weight.max;
                percent = (truePercent - 0.5) * 2; // this gives us a number between 0 and 1
            }

            // Get our weighted value
            weightedValue = maxValue * percent + minValue;

            /*
                 We already know which half of the slider the thumb should be on
                So we need to set the slider's value so it looks like the thumb lands
                in the right place
             */
            var val = void 0;
            // determine our slider progress
            if (value > this.weight.mid) {
                // We know our slider should be on the right half
                val = this.weight.max / 2;
                val *= (value - this.weight.min) / (this.weight.max - this.weight.min);
                val += this.weight.max / 2;
            } else {
                // We know our slider should be on the left
                // Get a percentage of how close it is the the mid point
                val = (value - this.weight.min) / (this.weight.mid - this.weight.min);
                // Apply that percentage to the max value
                val *= this.weight.max - this.weight.min;
                // Divide by two
                val /= 2;
                val += this.weight.min;
            }

            sliderProgress = val;

            return { weightedValue: weightedValue, sliderProgress: sliderProgress };
        }

        /*
             When either input is changed
                We need to run our new function for determining:
                    1) Where the slider's grabber should land
                    2) The actual value of the slider since the slider still technically moves between its min and max values
                        equilaterally
         */

    }, {
        key: 'setValue',
        value: function setValue(value) {
            // Set the value outright to the input
            this.input.setValue(value);

            // Get the false value we need for the slider so it looks right
            var val = Number(value);
            val = this.determineWeightedOutcome(val).sliderProgress;
            this.slider.setValue(val);
        }
    }, {
        key: 'sliderHandler',
        value: function sliderHandler(event) {
            this._changed = 'slider';

            this.syncFields();
            this.onSlider({
                target: this,
                node: this.slider.node,
                value: this.determineWeightedOutcome(this.slider.getValue()).weightedValue,
                event: event
            });
        }
    }, {
        key: 'syncFields',
        value: function syncFields() {
            var state = void 0,
                val = void 0;

            if (this._changed == 'slider') {
                // If our slider changed, collect the value of the slider and determine its weighted value
                val = this.slider.getValue();
                state = this.determineWeightedOutcome(val);

                this.input.setValue(state.weightedValue);
            } else if (this._changed == 'input') {
                // If the input was set we need to collect the input value and then set the slider
                // so it looks like it should go where it should

                val = this.input.getValue();
                state = this.determineWeightedOutcome(val);

                this.slider.setValue(state.sliderProgress);
            }

            this._changed = 'clean';
        }
    }]);

    return WeightedInputSlider;
}(_InputSlider3.default);

exports.default = WeightedInputSlider;

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

var _Button = __webpack_require__(129);

var _Button2 = _interopRequireDefault(_Button);

var _Group = __webpack_require__(133);

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Allows data to be hidden behind tabs via a tabular menu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Tabber = function (_Html) {
    _inherits(Tabber, _Html);

    function Tabber(config) {
        _classCallCheck(this, Tabber);

        // Make sure config has certain properties
        var _this = _possibleConstructorReturn(this, (Tabber.__proto__ || Object.getPrototypeOf(Tabber)).call(this, config));
        // Run HTML object constructor


        config = _this.setConfigDefaults({
            tabs: ['first', 'second'],
            class: 'tabber',
            template: '\n                <div>\n                    <div class="ui tabular menu">\n                    </div>\n                </div>\n            ',
            activeTab: 0,
            onTabChange: function onTabChange(data) {
                console.log('Tab was changed:', data);
            }
        });

        // Render
        _this.assignConfig(config);
        _this.renderToParent();

        // Collect info needed to function
        _this.buttonNode = _this.node.find('.ui.tabular.menu');

        // Create child Objects
        _this._tabs = config.tabs;
        _this.tabs = [];
        _this._tabs.forEach(function (item, index) {
            var tabButton = new _Button2.default({
                parent: _this.buttonNode,
                label: item,
                attr: { 'data-tab': item },
                class: 'item',
                onClick: function onClick(event) {
                    _this.tabChangeHandler(event);
                }
            });

            var tabContent = new _Group2.default({
                parent: _this.node,
                attr: { 'data-tab': item },
                class: 'ui tab',
                label: { content: item }
            });

            tabButton.node.tab();
            tabContent.node.tab();

            _this.tabs.push({
                name: item,
                button: tabButton,
                content: tabContent,
                index: index
            });
        });

        _this.setActiveTab(_this.activeTab);
        return _this;
    }

    _createClass(Tabber, [{
        key: 'addContent',
        value: function addContent(tab, content) {
            var tabIndex = tab;

            if (typeof tabIndex == 'string') {
                tabIndex = this.getTabByName(tabIndex).index;
            }

            var tabObject = this.tabs[tabIndex];

            tabObject.content.node.append(content);
        }
    }, {
        key: 'changeTab',
        value: function changeTab(tab) {
            var tabIndex = tab;

            if (typeof tabIndex == 'string') {
                tabIndex = this.getTabByName(tabIndex).index;
            }

            this.setActiveTab(tabIndex);
        }
    }, {
        key: 'getTabByName',
        value: function getTabByName(name) {
            var item = void 0,
                key = void 0;

            for (key in this.tabs) {
                item = this.tabs[key];

                if (item.name == name) {
                    return item;
                }
            }
        }
    }, {
        key: 'setActiveTab',
        value: function setActiveTab(index) {
            // Deactivate all tab
            this.tabs.forEach(function (item, index) {
                item.button.node.removeClass('active');
                item.content.node.removeClass('active');
            });

            // Activate the given index
            this.tabs[index].button.node.addClass('active');
            this.tabs[index].content.node.addClass('active');

            this.activeTab = index;
            this.activeTabName = this.tabs[index].name;
        }
    }, {
        key: 'tabChangeHandler',
        value: function tabChangeHandler(data) {
            var tab = this.getTabByName(data.target.label);
            this.activeTab = tab.index;
            this.activeTabName = tab.name;

            this.onTabChange({
                event: data.event,
                target: this,
                node: this.node,
                tab: tab
            });
        }
    }]);

    return Tabber;
}(_HTML2.default);

exports.default = Tabber;

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTML = __webpack_require__(26);

var _HTML2 = _interopRequireDefault(_HTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Create and manage the rendering of a toggle switch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Toggle = function (_Html) {
    _inherits(Toggle, _Html);

    function Toggle(config) {
        _classCallCheck(this, Toggle);

        var _this = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this, config));

        config = _this.setConfigDefaults({
            onClick: function onClick(data) {
                console.log('Toggle clicked', data);
            },
            on: false
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    _createClass(Toggle, [{
        key: 'render',
        value: function render(parent) {
            var _this2 = this;

            this.template = '\n        <label class="switch">\n            <input type="checkbox">\n            <span class="slider round"></span>\n        </label>\n        ';

            this._render(parent);

            this.inputNode = this.node.find('input');
            this.inputNode.click(function (event) {
                _this2.clickHandler(event);
            });
        }
    }, {
        key: 'clickHandler',
        value: function clickHandler(event) {
            this.on = !this.on;

            this.onClick({
                target: this,
                node: this.node,
                event: event
            });
        }
    }]);

    return Toggle;
}(_HTML2.default);

exports.default = Toggle;

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

var _SvgBox = __webpack_require__(64);

var _SvgBox2 = _interopRequireDefault(_SvgBox);

var _SvgLine = __webpack_require__(63);

var _SvgLine2 = _interopRequireDefault(_SvgLine);

var _SvgLabel = __webpack_require__(62);

var _SvgLabel2 = _interopRequireDefault(_SvgLabel);

var _SvgAxis = __webpack_require__(328);

var _SvgAxis2 = _interopRequireDefault(_SvgAxis);

var _SvgGrid = __webpack_require__(329);

var _SvgGrid2 = _interopRequireDefault(_SvgGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Handles visualization of data
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgGraph = function (_Svg) {
    _inherits(SvgGraph, _Svg);

    function SvgGraph(config) {
        _classCallCheck(this, SvgGraph);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (SvgGraph.__proto__ || Object.getPrototypeOf(SvgGraph)).call(this, config));
        // Run svg object constructor


        config = _this.setConfigDefaults({
            element: 'g',
            axisPadding: 13,
            xAxis: {
                bottom: {
                    titlePadding: 65,
                    title: {
                        innerHTML: 'Advanced D&D Classes',
                        svg: {}
                    },
                    type: 'x',
                    minValue: 1,
                    maxValue: 5,
                    labels: ['Fighter', 'Wizard', 'Rogue', 'Dwarf', 'Elf'],
                    svg: {}
                }
            },
            yAxis: {
                left: {
                    titlePadding: 40,
                    title: {
                        innerHTML: 'Play Time (hrs)',
                        svg: {}
                    },
                    rotateLabels: false,
                    type: 'y',
                    minValue: 0,
                    maxValue: 100,
                    svg: {}
                },
                right: {
                    titlePadding: 90,
                    title: {
                        innerHTML: 'Monsters Defeated',
                        svg: {}
                    },
                    rotateLabels: false,
                    type: 'y',
                    minValue: 1,
                    maxValue: 9,
                    labels: ['none', 'a few', 'several', 'plenty', 'bunches', 'hundreds', 'countless', 'literaly all'],
                    svg: {}
                }
            },
            svg: {
                width: 150,
                height: 150,
                x: 60, y: 50
            },
            box: {
                svg: {
                    fill: 'black',
                    stroke: '#bebbc1',
                    'stroke-width': 2
                }
            },
            grid: {
                segments: 5,
                svg: {
                    fill: '#bebbc1',
                    stroke: '#bebbc1',
                    'stroke-width': 1
                }
            }
        });

        // Assign config and render to parent
        _this.assignConfig(config);
        _this.renderToParent();

        // Modify sub-component configs to work as proper configs

        // Create child objects
        // Create background
        _this._box = _this.box;
        _this._box.parent = _this.node;
        _this._box.svg.x = _this.svg.x;
        _this._box.svg.y = _this.svg.y;
        _this._box.svg.width = _this.svg.width;
        _this._box.svg.height = _this.svg.height;
        _this.box = new _SvgBox2.default(_this._box);

        // Create grid
        _this._grid = _this.grid;
        _this._grid.parent = _this.node;
        _this._grid.svg.width = _this.svg.width;
        _this._grid.svg.height = _this.svg.height;
        _this._grid.svg.x = _this.svg.x;
        _this._grid.svg.y = _this.svg.y;
        _this.grid = new _SvgGrid2.default(_this._grid);

        // Create Axes
        _this._yAxis = _this.yAxis;
        _this._xAxis = _this.xAxis;

        if (_this._yAxis) {
            _this.createYAxes();
        }
        if (_this._xAxis) {
            _this.createXAxes();
        }
        return _this;
    }

    _createClass(SvgGraph, [{
        key: 'findXOfValue',
        value: function findXOfValue(value, axis) {
            if (!axis) {
                axis = 'bottom';
            }

            var ax = this._xAxis[axis];

            // Compare the value against the max possible value of this axis
            // to get a percentage
            var percent = (value - ax.minValue) / (ax.maxValue - ax.minValue);

            // Apply that percentage to the width of the graph and add the x offset
            // to get the final x coordinate
            var width = Number(this.box.node.attr('width'));
            var x = width * percent + Number(this.node.attr('x'));

            if (isNaN(x)) {
                x = width + Number(this.node.attr('x'));
            }

            return x;
        }
    }, {
        key: 'findValueOfX',
        value: function findValueOfX(x, axis) {}
    }, {
        key: 'findYOfValue',
        value: function findYOfValue(value, axis) {
            if (!axis) {
                axis = 'left';
            }

            var ax = this._yAxis[axis];

            // Compare the value against the max possible value of this axis
            // to get a percentage
            var percent = (value - ax.minValue) / (ax.maxValue - ax.minValue);

            // Apply that percentage to the width of the graph and add the x offset
            // to get the final x coordinate
            var height = Number(this.box.node.attr('height'));
            var y = height - height * percent + Number(this.node.attr('y'));

            if (isNaN(y)) {
                y = height + Number(this.node.attr('y'));
            }

            return y;
        }
    }, {
        key: 'findValueOfY',
        value: function findValueOfY(y, axis) {}
    }, {
        key: 'createXAxes',
        value: function createXAxes() {
            var titleX = void 0,
                titleY = void 0;

            if (this._xAxis.bottom) {
                // X Axis Bottom
                // Assign parent to the axis
                this._xAxis.bottom.parent = this.node;

                // Adjust for the size of a cell so labels are centered
                this._xAxis.bottom.svg.x = this.svg.x + (this.svg.width / this._grid.segments / 2 - 10);
                this._xAxis.bottom.svg.y = this.svg.y + this.svg.height + this.axisPadding;
                this._xAxis.bottom.svg.width = this.svg.width;
                this._xAxis.bottom.svg.height = this.svg.height;

                // Adjust the title of the axis to be in a sensible place
                this._xAxis.bottom.title.svg.x = 0;
                this._xAxis.bottom.title.svg.y = 0;
                titleX = this.svg.x + this.svg.width / 2;
                titleY = this.svg.y + this.svg.height + this.axisPadding + this._xAxis.bottom.titlePadding;
                this._xAxis.bottom.title.svg['transform'] = 'translate(' + titleX + ' ' + titleY + ')';
                this._xAxis.bottom.title.svg['text-anchor'] = 'middle';

                // Create the actual axis object
                this.xAxis.bottom = new _SvgAxis2.default(this._xAxis.bottom);
            }
        }
    }, {
        key: 'createYAxes',
        value: function createYAxes() {
            var titleX = void 0,
                titleY = void 0;

            if (this._yAxis.left) {
                // Y Axis Left
                // Assign a parent to the axis
                this._yAxis.left.parent = this.node;

                this._yAxis.left.svg.y = this.svg.y - (this.svg.height / this._grid.segments / 2 - 10);
                this._yAxis.left.svg.x = this.svg.x - this.axisPadding;
                this._yAxis.left.svg.width = this.svg.width;
                this._yAxis.left.svg.height = this.svg.height;
                this._yAxis.left.svg['text-anchor'] = 'end';

                // Adjust the title of the axis to be in a sensible place
                this._yAxis.left.title.svg.x = 0;
                this._yAxis.left.title.svg.y = 0;
                titleX = this.svg.x - this.axisPadding - this._yAxis.left.titlePadding;
                titleY = this.svg.y + this.svg.height / 2;
                this._yAxis.left.title.svg['transform'] = 'translate(' + titleX + ' ' + titleY + ') rotate(270)';
                this._yAxis.left.title.svg['text-anchor'] = 'middle';

                // Create the actual axis object
                this.yAxis.left = new _SvgAxis2.default(this._yAxis.left);
            }

            if (this._yAxis.right) {
                // Y Axis Right
                // Assign parent to the axis
                this._yAxis.right.parent = this.node;

                // Make sure our labels are centered to each cell
                this._yAxis.right.svg.x = this.svg.x + this.svg.width + this.axisPadding;
                this._yAxis.right.svg.y = this.svg.y - (this.svg.height / this._grid.segments / 2 - 10);
                this._yAxis.right.svg.width = this.svg.width;
                this._yAxis.right.svg.height = this.svg.height;
                // Adjust the title of the axis to be in a sensible place
                this._yAxis.right.title.svg.x = 0;
                this._yAxis.right.title.svg.y = 0;
                titleX = this.svg.x + this.svg.width + this.axisPadding + this._yAxis.right.titlePadding;
                titleY = this.svg.y + this.svg.height / 2;
                this._yAxis.right.title.svg['transform'] = 'translate(' + titleX + ' ' + titleY + ') rotate(90)';
                this._yAxis.right.title.svg['text-anchor'] = 'middle';

                // Create the actual axis object
                this.yAxis.right = new _SvgAxis2.default(this._yAxis.right);
            }
        }
    }]);

    return SvgGraph;
}(_SVG2.default);

exports.default = SvgGraph;

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

var _SvgLabel = __webpack_require__(62);

var _SvgLabel2 = _interopRequireDefault(_SvgLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Draws a line between two coordinates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Renders labels and can plot items
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   based on given values instead of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   coordinates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgAxis = function (_Svg) {
    _inherits(SvgAxis, _Svg);

    function SvgAxis(config) {
        _classCallCheck(this, SvgAxis);

        // Make sure the config has certain properties
        var _this = _possibleConstructorReturn(this, (SvgAxis.__proto__ || Object.getPrototypeOf(SvgAxis)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'g',
            minValue: 0,
            maxValue: 100,
            labels: [],
            labelCount: 5,
            labelPadding: 5,
            labelOffset: 5,
            type: 'x',
            rotateLabels: true,
            scientificNotation: true,
            notationDecimals: 1,
            title: {
                innerHTML: 'Axis',
                svg: {
                    x: 10, y: 25
                }
            },
            svg: {
                x: 10, y: 10,
                height: 100,
                width: 100,
                fill: '#bebbc1',
                stroke: '#bebbc1',
                'stroke-width': 1
            }
        });

        // Assign config and render to parent
        _this.assignConfig(config);
        _this.renderToParent();

        // If no labels are given, use label count to auto generate
        // labels between  the min and max values
        if (!_this.labels.length) {
            _this.generateLabels();
        }

        // Create a series of labels across either the width or height
        // Based on which type of axis we are making

        switch (_this.type) {
            case 'x':
                _this.createXAxis();break;
            case 'y':
                _this.createYAxis();break;
            default:
                console.warn('Invalid axis type given. Accepted values: x, y');
        }

        // Create title of axis
        _this.title.parent = _this.node;
        _this.title = new _SvgLabel2.default(_this.title);
        return _this;
    }

    _createClass(SvgAxis, [{
        key: 'createXAxis',
        value: function createXAxis() {
            var _this2 = this;

            var increment = this.svg.width / (this.labels.length - 1);
            var x = void 0,
                y = void 0;
            var transform = void 0;
            var offset = this.labelOffset;

            // Create value labels
            this.labels.forEach(function (item, index) {
                transform = null;
                x = increment * index + _this2.svg.x + offset;
                y = _this2.svg.y + _this2.labelPadding;

                if (_this2.rotateLabels) {
                    transform = 'translate(' + x + ' ' + y + ') rotate(45)';
                } else {
                    transform = 'translate(' + x + ' ' + y + ')';
                }

                _this2.labels[index] = new _SvgLabel2.default({
                    innerHTML: item,
                    parent: _this2.node,
                    svg: {
                        x: 0, y: 0,
                        transform: transform
                    }
                });
            });
        }
    }, {
        key: 'createYAxis',
        value: function createYAxis() {
            var _this3 = this;

            var increment = this.svg.height / this.labels.length;
            var x = void 0,
                y = void 0;
            var transform = void 0;
            var offset = this.labelOffset;

            // Create value labels
            this.labels.forEach(function (item, index) {
                transform = null;
                x = _this3.svg.x + _this3.labelPadding;
                y = increment * (_this3.labels.length - index) + _this3.svg.y - _this3.labelOffset;

                if (_this3.rotateLabels) {
                    transform = 'translate(' + x + ' ' + y + ') rotate(45)';
                } else {
                    transform = 'translate(' + x + ' ' + y + ')';
                }

                _this3.labels[index] = new _SvgLabel2.default({
                    innerHTML: item,
                    parent: _this3.node,
                    svg: {
                        x: 0, y: 0,
                        transform: transform
                    }
                });
            });
        }
    }, {
        key: 'generateLabels',
        value: function generateLabels() {
            var endLabel = this.maxValue;

            var end = void 0,
                exponent = void 0,
                increment = void 0,
                index = void 0,
                value = void 0;

            increment = (this.maxValue - this.minValue) / this.labelCount;
            index = 0;
            end = this.labelCount - 1;

            while (index < end) {
                value = increment * index + this.minValue;

                if (this.scientificNotation) {
                    value = value.toExponential(this.notationDecimals);
                }

                this.labels.push(value);

                index++;
            }

            if (this.scientificNotation) {
                endLabel = endLabel.toExponential(this.notationDecimals);
            }
            this.labels.push(endLabel);
        }
    }]);

    return SvgAxis;
}(_SVG2.default);

exports.default = SvgAxis;

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

var _SvgLine = __webpack_require__(63);

var _SvgLine2 = _interopRequireDefault(_SvgLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Draws a grid of lines over an area
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages updating the look of that grid
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgGrid = function (_Svg) {
    _inherits(SvgGrid, _Svg);

    function SvgGrid(config) {
        _classCallCheck(this, SvgGrid);

        var _this = _possibleConstructorReturn(this, (SvgGrid.__proto__ || Object.getPrototypeOf(SvgGrid)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'g',
            segments: 3,
            svg: {
                width: 100,
                height: 100,
                x: 10, y: 10
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();

        // Figure out some coordinates to make child creation easier
        _this.top = _this.svg.y;
        _this.bottom = _this.svg.y + _this.svg.height;
        _this.left = _this.svg.x;
        _this.right = _this.svg.x + _this.svg.width;

        // Create child objects
        _this.createRows();
        _this.createColumns();
        return _this;
    }

    _createClass(SvgGrid, [{
        key: 'createRows',
        value: function createRows() {
            // Rows only need to space out their Y coordinates
            this.rows = [];

            var end = void 0,
                height = void 0,
                increment = void 0,
                index = void 0,
                line = void 0,
                width = void 0,
                x1 = void 0,
                x2 = void 0,
                y1 = void 0,
                y2 = void 0;
            x1 = this.left;
            x2 = this.right;

            increment = this.svg.height / this.segments;

            index = 1;
            end = this.segments + 1;
            while (index < end) {
                y1 = index * increment + this.top;
                y2 = y1;

                line = new _SvgLine2.default({
                    parent: this.node,
                    svg: {
                        fill: this.svg.fill,
                        stroke: this.svg.stroke,
                        'stroke-width': this.svg['stroke-width'],
                        x1: x1, x2: x2, y1: y1, y2: y2
                    }
                });

                this.rows.push(line);

                index++;
            }
        }
    }, {
        key: 'createColumns',
        value: function createColumns() {
            // Columns only need their x coordinate moved
            this.columns = [];

            var end = void 0,
                height = void 0,
                increment = void 0,
                index = void 0,
                line = void 0,
                width = void 0,
                x1 = void 0,
                x2 = void 0,
                y1 = void 0,
                y2 = void 0;
            y1 = this.top;
            y2 = this.bottom;

            increment = this.svg.width / this.segments;

            index = 1;
            end = this.segments + 1;
            while (index < end) {
                x1 = index * increment + this.left;
                x2 = x1;

                line = new _SvgLine2.default({
                    parent: this.node,
                    svg: {
                        fill: this.svg.fill,
                        stroke: this.svg.stroke,
                        'stroke-width': this.svg['stroke-width'],
                        x1: x1, x2: x2, y1: y1, y2: y2
                    }
                });

                this.columns.push(line);

                index++;
            }
        }
    }]);

    return SvgGrid;
}(_SVG2.default);

exports.default = SvgGrid;

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Manages rendering the surface that is impacted
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _SvgArea = __webpack_require__(134);

var _SvgArea2 = _interopRequireDefault(_SvgArea);

var _SvgBox = __webpack_require__(64);

var _SvgBox2 = _interopRequireDefault(_SvgBox);

var _SvgLabel = __webpack_require__(62);

var _SvgLabel2 = _interopRequireDefault(_SvgLabel);

var _MeasureTool = __webpack_require__(331);

var _MeasureTool2 = _interopRequireDefault(_MeasureTool);

var _Impactor = __webpack_require__(135);

var _Impactor2 = _interopRequireDefault(_Impactor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Surface = function () {
    function Surface(config) {
        _classCallCheck(this, Surface);

        this.svgArea = new _SvgArea2.default({
            parent: $('#visualization'),
            svg: { height: 280, width: '100%' },
            class: 'ui svg visualization'
        });

        this.node = this.svgArea.node;

        // This number needs to be the max value of the mass/velocity sliders
        // Compare the user's impactor properties against this to get a percentage
        // that is applied to the width of the surface pixels to figure out how
        // to render the crater
        this.maxDiameter = config.maxDiameter;
        this.minDiameter = config.minDiameter;
        this.maxPixelWidth = this.node.width() - 20;
        this.minPixelWidth = 10;

        var surfaceY = 180;

        // Placeholder for the soon-to-be surface
        //  ... I will likely need a polygon object
        this.box = new _SvgBox2.default({
            parent: this.svgArea.node,
            svg: {
                x: 0, y: surfaceY,
                width: this.svgArea.node.width(), height: this.svgArea.node.height(),
                fill: '#687577'
            }
        });

        this.impactor = new _Impactor2.default({
            parent: this.svgArea.node,
            maxMass: config.maxMass,
            minMass: config.minMass,
            minWidth: 10,
            maxWidth: 100,
            surfaceY: surfaceY,
            svg: {
                r: 15,
                cx: this.node.width() / 2,
                cy: -100,
                fill: '#95918e'
            }
        });

        this.measureTool = new _MeasureTool2.default({
            svgArea: this.svgArea,
            maxDiameter: this.maxDiameter,
            onMeasureToolMove: config.onMeasureToolMove,
            onMeasureToolConnected: config.onMeasureToolConnected,
            surfaceY: surfaceY
        });

        this.nameLabel = new _SvgLabel2.default({
            parent: this.svgArea.node,
            innerHTML: 'Lunar Surface',
            class: 'surface header label',
            svg: {
                x: 7, y: 25
            }
        });

        this.visualDivider = new _SvgBox2.default({
            parent: this.svgArea.node,
            svg: {
                width: 1, height: 30,
                x: 157, y: 5,
                fill: '#bebbc1'
            }
        });

        var instructionColor = '#ecb800';

        this.instruction1 = new _SvgLabel2.default({
            parent: this.svgArea.node,
            innerHTML: 'To measure diameter, click and drag',
            class: 'surface instruction label',
            svg: {
                x: 165, y: 17,
                stroke: instructionColor,
                fill: instructionColor,
                'stroke-width': 0.5
            }
        });

        this.instruction2 = new _SvgLabel2.default({
            parent: this.svgArea.node,
            innerHTML: 'from one crater edge to the other.',
            class: 'surface instruction label',
            svg: {
                x: 165, y: 33,
                stroke: instructionColor,
                fill: instructionColor,
                'stroke-width': 0.5
            }
        });
    }

    _createClass(Surface, [{
        key: 'launchImpactor',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mass, velocity) {
                var diameter, percentage, pixelWidth, w, start, end;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // console.log ('Launching impactor')

                                diameter = this.getDiameter(mass, velocity);
                                percentage = (diameter - this.minDiameter) / (this.maxDiameter - this.minDiameter);
                                pixelWidth = this.maxPixelWidth * percentage;

                                // console.log (
                                //     'Actual Diameter of Crater:', diameter,
                                //     'The diameter size percent compared to max diameter size:', percentage,
                                //     'The width of the crater in pixels:', pixelWidth
                                // );

                                // Store the diameter

                                this.diameter = diameter;

                                // Let measuring tool know the width of the impact
                                w = this.node.width();
                                // let difference = w - this.maxPixelWidth;

                                // Play a cool animation

                                $('#launch-button').addClass('disabled');
                                if (pixelWidth < 50) {
                                    pixelWidth = 50;
                                }
                                _context.next = 9;
                                return this.impactor.impactAnimation(mass, velocity, pixelWidth, diameter);

                            case 9:
                                $('#reset-button').removeClass('disabled');

                                // Place the dots at the ends of the crater
                                start = w / 2 - pixelWidth / 2; //  - difference;

                                end = w / 2 + pixelWidth / 2; // + difference;

                                this.measureTool.showPoints(start, end);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function launchImpactor(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return launchImpactor;
        }()
    }, {
        key: 'getDiameter',
        value: function getDiameter(mass, velocity) {
            // return Math.pow (mass, 1/3) * Math.pow (velocity, 2/3);
            return 1.58E-4 * Math.pow(mass, 0.26) * Math.pow(1000 * velocity, 0.44);
        }
    }]);

    return Surface;
}();

/*

    impactor functionality:

        get formula from Leon for relationship between crater diameter,mass, and velocity

*/


exports.default = Surface;

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Manages rendering the surface that is impacted
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _animejs = __webpack_require__(93);

var _animejs2 = _interopRequireDefault(_animejs);

var _SvgLine = __webpack_require__(63);

var _SvgLine2 = _interopRequireDefault(_SvgLine);

var _SvgCircle = __webpack_require__(95);

var _SvgCircle2 = _interopRequireDefault(_SvgCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CIRCLE_FILL_OPACITY = 0.5;

var MeasureTool = function () {
    function MeasureTool(config) {
        var _this = this;

        _classCallCheck(this, MeasureTool);

        this.svgArea = config.svgArea;
        this.distance = 1000;
        this.width = this.svgArea.node.width();
        this.maxDiameter = config.maxDiameter;

        this.surfaceY = config.surfaceY;
        this.onMeasureToolMove = config.onMeasureToolMove;
        this.onMeasureToolConnected = config.onMeasureToolConnected;
        this.enabled = true;
        this.visible = true;

        // Create visual components.
        // Draw order is initially determined by instantiation order

        this.measureLine = new _SvgLine2.default({
            parent: this.svgArea.node,
            svg: {
                x1: 0, y1: 0,
                x2: 0, y2: 0,
                fill: 'transparent',
                stoke: 'transparent',
                'stroke-width': 0
            }
        });

        this.measureTip = new _SvgCircle2.default({
            parent: this.svgArea.node,
            svg: {
                cx: 0, cy: 0, r: 5,
                fill: 'transparent'
            }
        });

        // Create the circles that will go at either end of the crater
        this.leftCircle = new _SvgCircle2.default({
            parent: this.svgArea.node,
            svg: {
                cx: 20, cy: this.surfaceY, r: 10,
                fill: 'white'
            }
        });

        this.rightCircle = new _SvgCircle2.default({
            parent: this.svgArea.node,
            svg: {
                cx: this.svgArea.node.width() - 20, cy: this.surfaceY, r: 10,
                fill: 'white'
            }
        });

        // Highlight the circles when moused over
        $(this.leftCircle.node).on('mouseover', function (event) {
            _this.handleCircleMouseOver(event);
        });
        $(this.rightCircle.node).on('mouseover', function (event) {
            _this.handleCircleMouseOver(event);
        });

        // Unhighlight the circle when the mouse leaves the circle
        $(this.leftCircle.node).on('mouseleave', function (event) {
            _this.handleCircleMouseLeave(event);
        });
        $(this.rightCircle.node).on('mouseleave', function (event) {
            _this.handleCircleMouseLeave(event);
        });

        // Start drawing a line if a circle is clicked
        $(this.leftCircle.node).on('mousedown', function (event) {
            _this.handleCircleMouseDown(event);
        });
        $(this.rightCircle.node).on('mousedown', function (event) {
            _this.handleCircleMouseDown(event);
        });

        // Stop drawing a line on mouse up
        $(window).on('mouseup', function (event) {
            _this.handleMouseUp(event);
        });

        // Calculate distance when the mouse moves
        $(window).on('mousemove', function (event) {
            _this.handleMouseMove(event);
        });

        this.hidePoints();
    }

    _createClass(MeasureTool, [{
        key: 'calculateCraterDiameter',
        value: function calculateCraterDiameter() {
            var x1 = this.measureLine.node.attr('x1');
            var x2 = this.measureLine.node.attr('x2');
            var measurement = Math.abs(x1 - x2);

            var distance = measurement / this.width * this.maxDiameter;
            // console.log ('The crater is', distance, 'kilometers')

            this.measurement = distance;

            this.onMeasureToolMove({ distance: distance });
        }
    }, {
        key: 'clearLine',
        value: function clearLine() {
            this.measureLine.node.attr({
                x1: 0, y1: 0,
                x2: 0, y2: 0,
                fill: 'transparent',
                stoke: 'transparent',
                'stroke-width': 0
            });
            this.measureTip.node.attr({
                cx: 0, cy: 0,
                fill: 'transparent'
            });
        }
    }, {
        key: 'moveEndOfLine',
        value: function moveEndOfLine(event) {
            if (!this.enabled) {
                return;
            }
            var offset = this.svgArea.node[0].getBoundingClientRect();
            this.measureLine.node.attr({
                x2: event.clientX - offset.left,
                y2: event.clientY - offset.top
            });
            this.measureTip.node.attr({
                cx: event.clientX - offset.left,
                cy: event.clientY - offset.top
            });
        }
    }, {
        key: 'handleCircleMouseOver',
        value: function handleCircleMouseOver(event) {
            if (!this.enabled) {
                return;
            }
            // get which node is being targeted:
            var target = $(event.target);
            target.attr({
                stroke: 'white',
                'stroke-width': 3
            });

            this.mousedCircle = target;
        }
    }, {
        key: 'handleCircleMouseLeave',
        value: function handleCircleMouseLeave(event) {
            if (!this.enabled) {
                return;
            }
            // get which node is being targeted:
            var target = $(event.target);
            target.attr({
                stroke: 'transparent',
                'stroke-width': 0
            });

            this.mousedCircle = null;
        }
    }, {
        key: 'handleCircleMouseDown',
        value: function handleCircleMouseDown(event) {
            if (!this.enabled) {
                return;
            }
            // get which node is being targeted:
            var target = $(event.target);

            this.drawingLine = true;
            this.startCircle = target;

            this.measureLine.node.attr({
                stroke: 'white',
                'stroke-width': 2,
                x1: target.attr('cx'),
                y1: target.attr('cy'),
                x2: target.attr('cx'),
                y2: target.attr('cy')
            });
            this.measureTip.node.attr({
                fill: 'white',
                cx: target.attr('cx'),
                cy: target.attr('cy')
            });
        }
    }, {
        key: 'handleMouseUp',
        value: function handleMouseUp(event) {
            if (!this.enabled) {
                return;
            }
            // Make sure we are even trying to draw a line
            if (!this.drawingLine) {
                return;
            }

            // get which node is being targeted:
            var target = $(event.target);
            var deleteLine = true;

            if (this.mousedCircle) {

                // Make sure the target node is not the node
                // the user started drawing the line from
                if (target[0] != this.startCircle[0]) {
                    this.measureLine.node.attr({
                        x2: target.attr('cx'),
                        y2: target.attr('cy')
                    });
                    this.measureTip.node.attr({
                        cx: target.attr('cx'),
                        cy: target.attr('cy')
                    });

                    deleteLine = false;
                    this.calculateCraterDiameter();
                    this.onMeasureToolConnected();
                }
            }

            this.drawingLine = false;

            if (deleteLine) {
                this.clearLine();
            }
        }
    }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(event) {
            if (!this.enabled) {
                return;
            }

            if (this.drawingLine) {
                this.moveEndOfLine(event);
                this.calculateCraterDiameter();
            }
        }
    }, {
        key: 'showPoints',
        value: function showPoints(start, end) {
            if (!this.visible) {
                return;
            }
            if (isNaN(start)) {
                start = 10;
            }
            if (isNaN(end)) {
                start = 100;
            }

            this.leftCircle.node.attr({
                fill: 'white',
                'stroke-fill': 'white',
                'fill-opacity': 0,
                'stroke-opacity': 0
            });
            this.rightCircle.node.attr({
                fill: 'white',
                'stroke-fill': 'white',
                'fill-opacity': 0,
                'stroke-opacity': 0
            });

            (0, _animejs2.default)({
                targets: [this.rightCircle.node[0], this.leftCircle.node[0]],
                'fill-opacity': CIRCLE_FILL_OPACITY,
                'stroke-opacity': CIRCLE_FILL_OPACITY,
                duration: 1000,
                easing: 'linear'
            });

            this.leftCircle.node.attr({ cx: start });
            this.rightCircle.node.attr({ cx: end });
        }
    }, {
        key: 'hidePoints',
        value: function hidePoints() {
            this.leftCircle.node.attr({
                fill: 'transparent',
                'stroke-fill': 'transparent',
                'stroke-opacity': 0
            });
            this.rightCircle.node.attr({
                fill: 'transparent',
                'stroke-fill': 'transparent',
                'stroke-opacity': 0
            });
        }
    }, {
        key: 'setEnabled',
        value: function setEnabled(enabled) {
            this.enabled = enabled;
        }
    }, {
        key: 'setVisible',
        value: function setVisible(visible) {
            this.visible = visible;

            if (visible) {
                this.leftCircle.node.attr({
                    fill: 'white',
                    'stroke-fill': 'white',
                    'stroke-opacity': CIRCLE_FILL_OPACITY
                });
                this.rightCircle.node.attr({
                    fill: 'white',
                    'stroke-fill': 'white',
                    'stroke-opacity': CIRCLE_FILL_OPACITY
                });
            } else {
                this.hidePoints();
            }
        }
    }]);

    return MeasureTool;
}();

exports.default = MeasureTool;

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _SVG = __webpack_require__(27);

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Manages drawing a cirlce in SVG
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SvgEllipse = function (_Svg) {
    _inherits(SvgEllipse, _Svg);

    function SvgEllipse(config) {
        _classCallCheck(this, SvgEllipse);

        var _this = _possibleConstructorReturn(this, (SvgEllipse.__proto__ || Object.getPrototypeOf(SvgEllipse)).call(this, config));

        config = _this.setConfigDefaults({
            element: 'ellipse',
            svg: {
                cx: 55, cy: 55, rx: 100, ry: 50,
                fill: '#7e3353',
                stroke: '#e7dab5',
                'stroke-width': 2
            }
        });

        _this.assignConfig(config);
        _this.renderToParent();
        return _this;
    }

    return SvgEllipse;
}(_SVG2.default);

exports.default = SvgEllipse;

/***/ })
/******/ ]);