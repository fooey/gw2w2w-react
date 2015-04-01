(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

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
*	Util
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

},{"./Overview":23,"./Tracker":48,"./common/Langs":54,"./lib/static":57}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
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


},{"querystring":4,"superagent":6}],6:[function(require,module,exports){
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

},{"emitter":7,"reduce":8}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

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
},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":9,"./data/objective_labels":10,"./data/objective_map":11,"./data/objective_meta":12,"./data/objective_names":13,"./data/objective_types":14,"./data/world_names":15}],17:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var MatchWorld = require("./MatchWorld");

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

	_createClass(Match, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.match.get("scores"), nextProps.match.get("scores"));
				var newMatch = !Immutable.is(this.props.match.get("startTime"), nextProps.match.get("startTime"));
				var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
				var shouldUpdate = newScores || newMatch || newWorlds;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('overview::Match::render()', props.match.toJS());

				var worldColors = ["red", "blue", "green"];

				return React.createElement(
					"div",
					{ className: "matchContainer" },
					React.createElement(
						"table",
						{ className: "match" },
						worldColors.map(function (color, ixColor) {
							var worldKey = color + "Id";
							var worldId = props.match.get(worldKey).toString();
							var world = props.worlds.get(worldId);
							var scores = props.match.get("scores");

							return React.createElement(MatchWorld, {
								component: "tr",
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
		}
	});

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

},{"./MatchWorld":18}],18:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Score = require("./Score");
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

	_createClass(MatchWorld, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.scores, nextProps.scores);
				var newColor = !Immutable.is(this.props.color, nextProps.color);
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var shouldUpdate = newScores || newColor || newWorld;

				// console.log('overview::MatchWorlds::shouldComponentUpdate()', shouldUpdate, newScores, newColor, newWorld);

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('overview::MatchWorlds::render()');

				return React.createElement(
					"tr",
					null,
					React.createElement(
						"td",
						{ className: "team name " + props.color },
						React.createElement(
							"a",
							{ href: props.world.get("link") },
							props.world.get("name")
						)
					),
					React.createElement(
						"td",
						{ className: "team score " + props.color },
						React.createElement(Score, {
							team: props.color,
							score: props.scores.get(props.ixColor)
						})
					),
					props.showPie ? React.createElement(
						"td",
						{ rowSpan: "3", className: "pie" },
						React.createElement(Pie, {
							scores: props.scores,
							size: 60
						})
					) : null
				);
			}
		}
	});

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

},{"./../../common/Icons/Pie":51,"./Score":19}],19:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

		_get(Object.getPrototypeOf(Score.prototype), "constructor", this).call(this, props);
		this.state = { diff: 0 };
	}

	_inherits(Score, _React$Component);

	_createClass(Score, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.score !== nextProps.score;
			}
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var props = this.props;

				this.setState({ diff: nextProps.score - props.score });
			}
		},
		componentDidUpdate: {
			value: function componentDidUpdate() {
				var state = this.state;

				if (state.diff !== 0) {
					animateScoreDiff(this.refs.diff.getDOMNode());
				}
			}
		},
		render: {
			value: function render() {
				var props = this.props;
				var state = this.state;

				return React.createElement(
					"div",
					null,
					React.createElement(
						"span",
						{ className: "diff", ref: "diff" },
						getDiffText(state.diff)
					),
					React.createElement(
						"span",
						{ className: "value" },
						getScoreText(props.score)
					)
				);
			}
		}
	});

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
	$(el).velocity("fadeOut", { duration: 0 }).velocity("fadeIn", { duration: 200 }).velocity("fadeOut", { duration: 1200, delay: 400 });
}

function getDiffText(diff) {
	return diff ? numeral(diff).format("+0,0") : null;
}

function getScoreText(score) {
	return score ? numeral(score).format("0,0") : null;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],20:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Match = require("./Match");

/*
*	Component Globals
*/

var loadingHtml = React.createElement(
	"span",
	{ style: { paddingLeft: ".5em" } },
	React.createElement("i", { className: "fa fa-spinner fa-spin" })
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

	_createClass(Matches, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newRegion = !Immutable.is(this.props.region, nextProps.region);
				var newMatches = !Immutable.is(this.props.matches, nextProps.matches);
				var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
				var shouldUpdate = newRegion || newMatches || newWorlds;

				// console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('overview::Matches::render()');
				// console.log('overview::Matches::render()', 'region', props.region.toJS());
				// console.log('overview::Matches::render()', 'matches', props.matches.toJS());
				// console.log('overview::Matches::render()', 'worlds', props.worlds);

				return React.createElement(
					"div",
					{ className: "RegionMatches" },
					React.createElement(
						"h2",
						null,
						props.region.get("label"),
						" Matches",
						!props.matches.size ? loadingHtml : null
					),
					props.matches.map(function (match) {
						return React.createElement(Match, {
							key: match.get("id"),
							className: "match",

							worlds: props.worlds,
							match: match
						});
					})
				);
			}
		}
	});

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

},{"./Match":17}],21:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(RegionWorldsWorld, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var shouldUpdate = newLang || newWorld;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('RegionWorldsWorld::render', props.world.toJS());

				return React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ href: props.world.get("link") },
						props.world.get("name")
					)
				);
			}
		}
	});

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

},{}],22:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var World = require("./World");

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

	_createClass(Worlds, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.worlds, nextProps.worlds);
				var newRegion = !Immutable.is(this.props.region.get("worlds"), nextProps.region.get("worlds"));
				var shouldUpdate = newLang || newRegion;

				// console.log('overview::RegionWorlds::shouldComponentUpdate()', shouldUpdate, newLang, newRegion);

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('overview::Worlds::render()', props.region.get('label'), props.region.get('worlds').toJS());

				return React.createElement(
					"div",
					{ className: "RegionWorlds" },
					React.createElement(
						"h2",
						null,
						props.region.get("label"),
						" Worlds"
					),
					React.createElement(
						"ul",
						{ className: "list-unstyled" },
						props.worlds.map(function (world) {
							return React.createElement(World, {
								key: world.get("id"),
								world: world
							});
						})
					)
				);
			}
		}
	});

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

},{"./World":21}],23:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Matches = require("./Matches");
var Worlds = require("./Worlds");

/*
*
*	Component Definition
*
*/

var Overview = (function (_React$Component) {
	function Overview(props) {
		_classCallCheck(this, Overview);

		_get(Object.getPrototypeOf(Overview.prototype), "constructor", this).call(this, props);

		this.mounted = true;
		this.timeouts = {};

		this.state = {
			regions: Immutable.fromJS({
				"1": { label: "NA", id: "1" },
				"2": { label: "EU", id: "2" } }),

			matchesByRegion: Immutable.fromJS({ "1": {}, "2": {} }),
			worldsByRegion: Immutable.fromJS({ "1": {}, "2": {} }) };
	}

	_inherits(Overview, _React$Component);

	_createClass(Overview, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var props = this.props;
				var state = this.state;

				var newLang = !Immutable.is(props.lang, nextProps.lang);
				var newMatchData = !Immutable.is(state.matchesByRegion, nextState.matchesByRegion);
				var shouldUpdate = newLang || newMatchData;

				// console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

				return shouldUpdate;
			}
		},
		componentWillMount: {
			value: function componentWillMount() {
				setPageTitle.call(this, this.props.lang);
				setWorlds.call(this, this.props.lang);

				getData.call(this);
			}
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				setPageTitle.call(this, nextProps.lang);
				setWorlds.call(this, nextProps.lang);
			}
		},
		componentWillUnmount: {
			value: function componentWillUnmount() {
				this.mounted = false;
				clearTimeout(this.timeouts.matchData);
			}
		},
		render: {
			value: function render() {
				var props = this.props;
				var state = this.state;

				// console.log('overview::render()');
				// console.log('overview::render()', 'lang', props.lang.toJS());
				// console.log('overview::render()', 'regions', state.regions.toJS());
				// console.log('overview::render()', 'matchesByRegion', state.matchesByRegion.toJS());
				// console.log('overview::render()', 'worldsByRegion', state.worldsByRegion.toJS());

				return React.createElement(
					"div",
					{ id: "overview" },
					React.createElement(
						"div",
						{ className: "row" },
						state.regions.map(function (region, regionId) {
							return React.createElement(
								"div",
								{ className: "col-sm-12", key: regionId },
								React.createElement(Matches, {
									region: region,
									matches: state.matchesByRegion.get(regionId),
									worlds: state.worldsByRegion.get(regionId)
								})
							);
						})
					),
					React.createElement("hr", null),
					React.createElement(
						"div",
						{ className: "row" },
						state.regions.map(function (region, regionId) {
							return React.createElement(
								"div",
								{ className: "col-sm-12", key: regionId },
								React.createElement(Worlds, {
									region: region,
									worlds: state.worldsByRegion.get(regionId)
								})
							);
						})
					)
				);
			}
		}
	});

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
	var title = ["gw2w2w.com"];

	if (lang.get("slug") !== "en") {
		title.push(lang.get("name"));
	}

	$("title").text(title.join(" - "));
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
		return world.get("name");
	}).groupBy(function (world) {
		return world.get("region");
	});

	self.setState({ worldsByRegion: newWorldsByRegion });
}

function getWorldByLang(lang, world) {
	var langSlug = lang.get("slug");

	var worldByLang = world.get(langSlug);

	var region = world.get("region");
	var link = getWorldLink(langSlug, worldByLang);

	return worldByLang.merge({ link: link, region: region });
}

function getWorldLink(langSlug, world) {
	return ["", langSlug, world.get("slug")].join("/");
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
		return match.get("region").toString();
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

},{"./../lib/api":55,"./../lib/static":57,"./Matches":20,"./Worlds":22}],24:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Objective = require("../Objectives");

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

	_createClass(GuildClaims, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newClaims = !Immutable.is(this.props.guild.get("claims"), nextProps.guild.get("claims"));

				var shouldUpdate = newLang || newClaims;
				// console.log('Claims::shouldComponentUpdate()', shouldUpdate, this.props.guild.get('guild_id'));

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var _this = this;

				var guildId = this.props.guild.get("guild_id");
				var claims = this.props.guild.get("claims");

				// console.log('Claims::render()', guildId);

				return React.createElement(
					"ul",
					{ className: "list-unstyled" },
					claims.map(function (entry) {
						return React.createElement(
							"li",
							{ key: entry.get("id") },
							React.createElement(Objective, {
								cols: objectiveCols,

								lang: _this.props.lang,
								guildId: guildId,
								guild: _this.props.guild,

								objectiveId: entry.get("objectiveId"),
								worldColor: entry.get("world"),
								timestamp: entry.get("timestamp")
							})
						);
					})
				);
			}
		}
	});

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

},{"../Objectives":43}],25:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
var Claims = require("./Claims");

/*
*	Component Globals
*/

var loadingHtml = React.createElement(
	"h1",
	{ style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } },
	React.createElement("i", { className: "fa fa-spinner fa-spin" }),
	" Loading..."
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

	_createClass(Guild, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

				var shouldUpdate = newLang || newGuildData;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var dataReady = this.props.guild.get("loaded");

				var guildId = this.props.guild.get("guild_id");
				var guildName = this.props.guild.get("guild_name");
				var guildTag = this.props.guild.get("tag");
				var guildClaims = this.props.guild.get("claims");

				// console.log('Guild::render()', guildId, guildName);

				return React.createElement(
					"div",
					{ className: "guild", id: guildId },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							dataReady ? React.createElement(
								"a",
								{ href: "http://guilds.gw2w2w.com/guilds/" + slugify(guildName), target: "_blank" },
								React.createElement(Emblem, { guildName: guildName, size: 256 })
							) : React.createElement(Emblem, { size: 256 })
						),
						React.createElement(
							"div",
							{ className: "col-sm-20" },
							dataReady ? React.createElement(
								"h1",
								null,
								React.createElement(
									"a",
									{ href: "http://guilds.gw2w2w.com/guilds/" + slugify(guildName), target: "_blank" },
									guildName,
									" [",
									guildTag,
									"]"
								)
							) : loadingHtml,
							!guildClaims.isEmpty() ? React.createElement(Claims, this.props) : null
						)
					)
				);
			}
		}
	});

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
	return encodeURIComponent(str.replace(/ /g, "-")).toLowerCase();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../common/Icons/Emblem":50,"./Claims":24}],26:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Guild = require("./Guild");

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

	_createClass(Guilds, {
		shouldComponentUpdate: {
			// constructor() {}
			// componentDidMount() {}

			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuildData = !Immutable.is(this.props.guilds, nextProps.guilds);

				var shouldUpdate = newLang || newGuildData;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('Guilds::render()');
				// console.log('props.guilds', props.guilds.toObject());

				var sortedGuilds = props.guilds.toSeq().sortBy(function (guild) {
					return guild.get("guild_name");
				}).sortBy(function (guild) {
					return -guild.get("lastClaim");
				});

				return React.createElement(
					"section",
					{ id: "guilds" },
					React.createElement(
						"h2",
						{ className: "section-header" },
						"Guild Claims"
					),
					sortedGuilds.map(function (guild) {
						return React.createElement(Guild, {
							key: guild.get("guild_id"),
							lang: props.lang,
							guild: guild
						});
					})
				);
			}
		}
	});

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

},{"./Guild":25}],27:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !== "undefined" ? global.jQuery : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require("gw2w2w-static");

/*
*	React Components
*/

var Objective = require("../Objectives");

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

	_createClass(Entry, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuild = !Immutable.is(this.props.guild, nextProps.guild);
				var newEntry = !Immutable.is(this.props.entry, nextProps.entry);

				var newFilters = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

				var shouldUpdate = newLang || newGuild || newEntry || newFilters;

				// console.log('Entry:render()', {newTriggerState, newFilters, shouldUpdate});

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				// console.log('Entry:render()');
				var eventType = this.props.entry.get("type");

				var cols = eventType === "claim" ? claimCols : captureCols;

				var oMeta = STATIC.objective_meta[this.props.entry.get("objectiveId")];
				var mapColor = _.find(STATIC.objective_map, function (map) {
					return map.mapIndex === oMeta.map;
				}).color;

				var matchesMapFilter = this.props.mapFilter === "all" || this.props.mapFilter === mapColor;
				var matchesEventFilter = this.props.eventFilter === "all" || this.props.eventFilter === eventType;

				var shouldBeVisible = matchesMapFilter && matchesEventFilter;
				var className = shouldBeVisible ? "show-entry" : "hide-entry";

				return React.createElement(
					"li",
					{ className: className },
					React.createElement(Objective, {
						lang: this.props.lang,

						cols: cols,
						guildId: this.props.guildId,
						guild: this.props.guild,

						entryId: this.props.entry.get("id"),
						objectiveId: this.props.entry.get("objectiveId"),
						worldColor: this.props.entry.get("world"),
						timestamp: this.props.entry.get("timestamp"),
						eventType: this.props.entry.get("type")
					})
				);
			}
		}
	});

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

},{"../Objectives":43,"gw2w2w-static":16}],28:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require("gw2w2w-static");

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

	_createClass(MapFilters, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.eventFilter !== nextProps.eventFilter;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				return React.createElement(
					"ul",
					{ id: "log-event-filters", className: "nav nav-pills" },
					React.createElement(
						"li",
						{ className: props.eventFilter === "claim" ? "active" : null },
						React.createElement(
							"a",
							{ onClick: props.setEvent, "data-filter": "claim" },
							"Claims"
						)
					),
					React.createElement(
						"li",
						{ className: props.eventFilter === "capture" ? "active" : null },
						React.createElement(
							"a",
							{ onClick: props.setEvent, "data-filter": "capture" },
							"Captures"
						)
					),
					React.createElement(
						"li",
						{ className: props.eventFilter === "all" ? "active" : null },
						React.createElement(
							"a",
							{ onClick: props.setEvent, "data-filter": "all" },
							"All"
						)
					)
				);
			}
		}
	});

	return MapFilters;
})(React.Component);

/*
*	Class Properties
*/

MapFilters.propTypes = {
	eventFilter: React.PropTypes.oneOf(["all", "capture", "claim"]).isRequired,
	setEvent: React.PropTypes.func.isRequired };

/*
*
*	Export Module
*
*/

module.exports = MapFilters;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"gw2w2w-static":16}],29:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require("gw2w2w-static");

/*
*	React Components
*/

var Entry = require("./Entry");

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

	_createClass(LogEntries, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);

				var newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
				var newFilterState = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

				var shouldUpdate = newLang || newGuilds || newTriggerState || newFilterState;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('LogEntries::render()', props.mapFilter, props.eventFilter, props.triggerNotification);

				return React.createElement(
					"ul",
					{ id: "log" },
					props.eventHistory.map(function (entry) {
						var eventType = entry.get("type");
						var entryId = entry.get("id");
						var guildId = undefined,
						    guild = undefined;

						if (eventType === "claim") {
							guildId = entry.get("guild");
							guild = props.guilds.has(guildId) ? props.guilds.get(guildId) : null;
						}

						return React.createElement(Entry, {
							key: entryId,
							component: "li",

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

		}
	});

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

},{"./Entry":27,"gw2w2w-static":16}],30:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var STATIC = require("gw2w2w-static");

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

	_createClass(MapFilters, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.mapFilter !== nextProps.mapFilter;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				return React.createElement(
					"ul",
					{ id: "log-map-filters", className: "nav nav-pills" },
					React.createElement(
						"li",
						{ className: props.mapFilter === "all" ? "active" : "null" },
						React.createElement(
							"a",
							{ onClick: props.setWorld, "data-filter": "all" },
							"All"
						)
					),
					_.map(STATIC.objective_map, function (mapMeta) {
						return React.createElement(
							"li",
							{ key: mapMeta.mapIndex, className: props.mapFilter === mapMeta.color ? "active" : null },
							React.createElement(
								"a",
								{ onClick: props.setWorld, "data-filter": mapMeta.color },
								mapMeta.abbr
							)
						);
					})
				);
			}
		}
	});

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

},{"gw2w2w-static":16}],31:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var STATIC = require("gw2w2w-static");

/*
*	React Components
*/

var MapFilters = require("./MapFilters");
var EventFilters = require("./EventFilters");
var LogEntries = require("./LogEntries");

/*
*
*	Component Definition
*
*/

var Log = (function (_React$Component) {
	function Log(props) {
		_classCallCheck(this, Log);

		_get(Object.getPrototypeOf(Log.prototype), "constructor", this).call(this, props);

		this.state = {
			mapFilter: "all",
			eventFilter: "all",
			triggerNotification: false };
	}

	_inherits(Log, _React$Component);

	_createClass(Log, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newHistory = !Immutable.is(this.props.details.get("history"), nextProps.details.get("history"));

				var newMapFilter = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
				var newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);

				var shouldUpdate = newLang || newGuilds || newHistory || newMapFilter || newEventFilter;

				return shouldUpdate;
			}
		},
		componentDidMount: {
			value: function componentDidMount() {
				this.setState({ triggerNotification: true });
			}
		},
		componentDidUpdate: {
			value: function componentDidUpdate() {
				if (!this.state.triggerNotification) {
					this.setState({ triggerNotification: true });
				}
			}
		},
		render: {
			value: function render() {
				var component = this;
				var props = this.props;
				var state = this.state;

				// console.log('Log::render()', state.mapFilter, state.eventFilter, state.triggerNotification);

				var eventHistory = props.details.get("history");

				return React.createElement(
					"div",
					{ id: "log-container" },
					React.createElement(
						"div",
						{ className: "log-tabs" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-sm-16" },
								React.createElement(MapFilters, {
									mapFilter: state.mapFilter,
									setWorld: setWorld.bind(component)
								})
							),
							React.createElement(
								"div",
								{ className: "col-sm-8" },
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
		}
	});

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

	var filter = e.target.getAttribute("data-filter");

	component.setState({ mapFilter: filter, triggerNotification: true });
}

function setEvent(e) {
	var component = this;

	var filter = e.target.getAttribute("data-filter");

	component.setState({ eventFilter: filter, triggerNotification: true });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./EventFilters":28,"./LogEntries":29,"./MapFilters":30,"gw2w2w-static":16}],32:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var MapScores = require("./MapScores");
var MapSection = require("./MapSection");

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

	_createClass(MapDetails, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);

				var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var _this = this;

				var mapMeta = STATIC.objective_map.find(function (mm) {
					return mm.get("key") === _this.props.mapKey;
				});
				var mapIndex = mapMeta.get("mapIndex").toString();

				var mapScores = this.props.details.getIn(["maps", "scores", mapIndex]);

				// console.log('Tracker::Maps::MapDetails:render()', mapScores.toJS());

				return React.createElement(
					"div",
					{ className: "map" },
					React.createElement(
						"div",
						{ className: "mapScores" },
						React.createElement(
							"h2",
							{ className: "team " + mapMeta.get("color"), onClick: onTitleClick },
							mapMeta.get("name")
						),
						React.createElement(MapScores, { scores: mapScores })
					),
					React.createElement(
						"div",
						{ className: "row" },
						mapMeta.get("sections").map(function (mapSection, ixSection) {

							return React.createElement(MapSection, _extends({
								component: "ul",
								key: ixSection,
								mapSection: mapSection,
								mapMeta: mapMeta
							}, _this.props));
						})
					)
				);
			}
		}
	});

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
	var $maps = $(".map");
	var $map = $(e.target).closest(".map", $maps);

	var hasFocus = $map.hasClass("map-focus");

	if (!hasFocus) {
		$map.addClass("map-focus").removeClass("map-blur");

		$maps.not($map).removeClass("map-focus").addClass("map-blur");
	} else {
		$maps.removeClass("map-focus").removeClass("map-blur");
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../lib/static":57,"./MapScores":33,"./MapSection":34}],33:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(MapScores, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.scores, nextProps.scores);

				var shouldUpdate = newScores;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				return React.createElement(
					"ul",
					{ className: "list-inline" },
					props.scores.map(function (score, ixScore) {
						var formatted = numeral(score).format("0,0");
						var team = ["red", "blue", "green"][ixScore];

						return React.createElement(
							"li",
							{ key: team, className: "team " + team },
							formatted
						);
					})
				);
			}
		}
	});

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

},{}],34:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(MapSection, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);

				var shouldUpdate = newLang || newGuilds || newDetails;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var _this = this;

				var mapObjectives = this.props.mapSection.get("objectives");
				var owners = this.props.details.getIn(["objectives", "owners"]);
				var claimers = this.props.details.getIn(["objectives", "claimers"]);

				// console.log('Tracker::Maps::MapSection:render()', mapObjectives, mapObjectives.toJS());

				var sectionClass = getSectionClass(this.props.mapMeta.get("key"), this.props.mapSection.get("label"));

				return React.createElement(
					"ul",
					{ className: "list-unstyled " + sectionClass },
					mapObjectives.map(function (objectiveId) {
						var owner = owners.get(objectiveId.toString());
						var claimer = claimers.get(objectiveId.toString());

						var guildId = claimer ? claimer.guild : null;
						var hasClaimer = !!guildId;
						var hasGuildData = hasClaimer && _this.props.guilds.has(guildId);
						var guild = hasGuildData ? _this.props.guilds.get(guildId) : null;

						return React.createElement(
							"li",
							{ key: objectiveId, id: "objective-" + objectiveId },
							React.createElement(Objective, {
								lang: _this.props.lang,
								cols: objectiveCols,

								objectiveId: objectiveId,
								worldColor: owner.get("world"),
								timestamp: owner.get("timestamp"),
								guildId: guildId,
								guild: guild
							})
						);
					})
				);
			}
		}
	});

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
	var sectionClass = ["col-md-24", "map-section"];

	if (mapKey === "Center") {
		if (sectionLabel === "Castle") {
			sectionClass.push("col-sm-24");
		} else {
			sectionClass.push("col-sm-8");
		}
	} else {
		sectionClass.push("col-sm-8");
	}

	return sectionClass.join(" ");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../Objectives":43}],35:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var MapDetails = require("./MapDetails");
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

	_createClass(Maps, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);

				var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				var isDataInitialized = props.details.get("initialized");

				if (!isDataInitialized) {
					return null;
				}

				return React.createElement(
					"section",
					{ id: "maps" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement(MapDetails, _extends({ mapKey: "Center" }, props))
						),
						React.createElement(
							"div",
							{ className: "col-md-18" },
							React.createElement(
								"div",
								{ className: "row" },
								React.createElement(
									"div",
									{ className: "col-md-8" },
									React.createElement(MapDetails, _extends({ mapKey: "RedHome" }, props))
								),
								React.createElement(
									"div",
									{ className: "col-md-8" },
									React.createElement(MapDetails, _extends({ mapKey: "BlueHome" }, props))
								),
								React.createElement(
									"div",
									{ className: "col-md-8" },
									React.createElement(MapDetails, _extends({ mapKey: "GreenHome" }, props))
								)
							),
							React.createElement(
								"div",
								{ className: "row" },
								React.createElement(
									"div",
									{ className: "col-md-24" },
									React.createElement(Log, props)
								)
							)
						)
					)
				);
			}
		}
	});

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

},{"./../Log":31,"./MapDetails":32}],36:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
*
*	Dependencies
*
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var Emblem = require('./../../common/Icons/Emblem');

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

	_createClass(Guild, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newGuild = !Immutable.is(this.props.guildId, nextProps.guildId);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
				var shouldUpdate = newGuild || newGuildData;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var props = this.props;
				var hasGuild = !!this.props.guildId;
				var isEnabled = hasGuild && (this.props.showName || this.props.showTag);

				if (!isEnabled) {
					return null;
				} else {
					var hasGuildData = props.guild && props.guild.get("loaded");
					var id = props.guildId;

					// console.log('Guild:render()', id);

					var href = "#" + id;

					var content = React.createElement("i", { className: "fa fa-spinner fa-spin" });
					var title = null;

					if (hasGuildData) {
						var _name = props.guild.get("guild_name");
						var tag = props.guild.get("tag");

						if (props.showName && props.showTag) {
							content = React.createElement(
								"span",
								null,
								"" + _name + " [" + tag + "] ",
								React.createElement(Emblem, { guildName: _name, size: 20 })
							);
						} else if (props.showName) {
							content = "" + _name;
						} else {
							content = "" + tag;
						}

						title = "" + _name + " [" + tag + "]";
					}

					return React.createElement(
						"a",
						{ className: "guildname", href: href, title: title },
						content
					);
				}
			}
		}
	});

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

},{"./../../common/Icons/Emblem":50}],37:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Icons, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newColor = !Immutable.is(this.props.color, nextProps.color);
				var shouldUpdate = newColor;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				if (!this.props.showArrow && !this.props.showSprite) {
					return null;
				} else {
					var oMeta = STATIC.objective_meta.get(this.props.objectiveId);
					var objectiveTypeId = oMeta.get("type").toString();
					var oType = STATIC.objective_types.get(objectiveTypeId);

					return React.createElement(
						"div",
						{ className: "objective-icons" },
						this.props.showArrow ? React.createElement(Arrow, { oMeta: oMeta }) : null,
						this.props.showSprite ? React.createElement(Sprite, {
							type: oType.get("name"),
							color: this.props.color
						}) : null
					);
				}
			}
		}
	});

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

},{"./../../common/Icons/Arrow":49,"./../../common/Icons/Sprite":52,"./../../lib/static":57}],38:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Label, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var shouldUpdate = newLang;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				if (!this.props.isEnabled) {
					return null;
				} else {
					var oLabel = STATIC.objective_labels.get(this.props.objectiveId);
					var langSlug = this.props.lang.get("slug");

					return React.createElement(
						"div",
						{ className: "objective-label" },
						React.createElement(
							"span",
							null,
							oLabel.get(langSlug)
						)
					);
				}
			}
		}
	});

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

},{"./../../lib/static":57}],39:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(MapName, {
		shouldComponentUpdate: {
			// map name can never change, not localized

			value: function shouldComponentUpdate() {
				return false;
			}
		},
		render: {
			value: function render() {
				var _this = this;

				if (!this.props.isEnabled) {
					return null;
				} else {
					var _ret = (function () {
						var oMeta = STATIC.objective_meta.get(_this.props.objectiveId);
						var mapIndex = oMeta.get("map");
						var mapMeta = STATIC.objective_map.find(function (mm) {
							return mm.get("mapIndex") === mapIndex;
						});

						return {
							v: React.createElement(
								"div",
								{ className: "objective-map" },
								React.createElement(
									"span",
									{ title: mapMeta.get("name") },
									mapMeta.get("abbr")
								)
							)
						};
					})();

					if (typeof _ret === "object") {
						return _ret.v;
					}
				}
			}
		}
	});

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

},{"./../../lib/static":57}],40:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(TimeCountdown, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				if (!this.props.isEnabled) {
					return null;
				} else {
					var expires = this.props.timestamp + 5 * 60;

					return React.createElement(
						"span",
						{ className: "timer countdown inactive", "data-expires": expires },
						React.createElement("i", { className: "fa fa-spinner fa-spin" })
					);
				}
			}
		}
	});

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

},{}],41:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(TimerRelative, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				if (!this.props.isEnabled) {
					return null;
				} else {
					return React.createElement(
						"div",
						{ className: "objective-relative" },
						React.createElement(
							"span",
							{ className: "timer relative", "data-timestamp": this.props.timestamp },
							moment(this.props.timestamp * 1000).twitterShort()
						)
					);
				}
			}
		}
	});

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

},{}],42:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Timestamp, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				if (!this.props.isEnabled) {
					return null;
				} else {
					var timestampHtml = moment(this.props.timestamp * 1000).format("hh:mm:ss");

					return React.createElement(
						"div",
						{ className: "objective-timestamp" },
						timestampHtml
					);
				}
			}
		}
	});

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

},{}],43:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var TimerRelative = require("./TimerRelative");
var Timestamp = require("./Timestamp");
var MapName = require("./MapName");
var Icons = require("./Icons");
var Label = require("./Label");
var Guild = require("./Guild");
var TimerCountdown = require("./TimerCountdown");

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

	_createClass(Objective, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newCapture = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var newOwner = !Immutable.is(this.props.worldColor, nextProps.worldColor);
				var newClaimer = !Immutable.is(this.props.guildId, nextProps.guildId);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

				var shouldUpdate = newLang || newCapture || newOwner || newClaimer || newGuildData;

				return shouldUpdate;
			}
		},
		render: {
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
					"div",
					{ className: "objective team " + this.props.worldColor },
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
						"div",
						{ className: "objective-state" },
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
		}
	});

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

},{"./../../lib/static":57,"./Guild":36,"./Icons":37,"./Label":38,"./MapName":39,"./TimerCountdown":40,"./TimerRelative":41,"./Timestamp":42}],44:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

		_get(Object.getPrototypeOf(HoldingsItem.prototype), "constructor", this).call(this, props);

		this.state = {
			oType: STATIC.objective_types.get(props.typeId)
		};
	}

	_inherits(HoldingsItem, _React$Component);

	_createClass(HoldingsItem, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newQuantity = this.props.typeQuantity !== nextProps.typeQuantity;
				var newType = this.props.typeId !== nextProps.typeId;
				var newColor = this.props.color !== nextProps.color;
				var shouldUpdate = newQuantity || newType || newColor;

				return shouldUpdate;
			}
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var newType = this.props.typeId !== nextProps.typeId;

				if (newType) {
					this.setState({ oType: STATIC.objective_types.get(this.props.typeId) });
				}
			}
		},
		render: {
			value: function render() {
				// console.log('Tracker::Scoreboard::HoldingsItem:render()', this.state.oType.toJS());

				return React.createElement(
					"li",
					null,
					React.createElement(Sprite, {
						type: this.state.oType.get("name"),
						color: this.props.color
					}),
					" x" + this.props.typeQuantity
				);
			}
		}
	});

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

},{"./../../../common/Icons/Sprite":52,"./../../../lib/static":57}],45:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Item = require("./Item");

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

	_createClass(Holdings, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newHoldings = !Immutable.is(this.props.holdings, nextProps.holdings);
				var shouldUpdate = newHoldings;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var _this = this;

				return React.createElement(
					"ul",
					{ className: "list-inline" },
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
		}
	});

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

},{"./Item":44}],46:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
	"h1",
	{ style: { height: "90px", fontSize: "32pt", lineHeight: "90px" } },
	React.createElement("i", { className: "fa fa-spinner fa-spin" })
);

/*
*	React Components
*/

var Holdings = require("./Holdings");

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

	_createClass(World, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var newScore = this.props.score !== nextProps.score;
				var newTick = this.props.tick !== nextProps.tick;
				var newHoldings = this.props.holdings !== nextProps.holdings;
				var shouldUpdate = newWorld || newScore || newTick || newHoldings;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				return React.createElement(
					"div",
					{ className: "col-sm-8" },
					React.createElement(
						"div",
						{ className: "scoreboard team-bg team text-center " + this.props.world.get("color") },
						this.props.world && Immutable.Map.isMap(this.props.world) ? React.createElement(
							"div",
							null,
							React.createElement(
								"h1",
								null,
								React.createElement(
									"a",
									{ href: this.props.world.get("link") },
									this.props.world.get("name")
								)
							),
							React.createElement(
								"h2",
								null,
								numeral(this.props.score).format("0,0"),
								" ",
								numeral(this.props.tick).format("+0,0")
							),
							React.createElement(Holdings, {
								color: this.props.world.get("color"),
								holdings: this.props.holdings
							})
						) : loadingHtml
					)
				);
			}
		}
	});

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

},{"./Holdings":45}],47:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var World = require("./World");

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

	_createClass(Scoreboard, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
				var newScores = !Immutable.is(this.props.match.get("scores"), nextProps.match.get("scores"));
				var shouldUpdate = newWorlds || newScores;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				// console.log('Scoreboard::Worlds::render()');

				var scores = this.props.match.get("scores");
				var ticks = this.props.match.get("ticks");
				var holdings = this.props.match.get("holdings");

				return React.createElement(
					"section",
					{ className: "row", id: "scoreboards" },
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
		}
	});

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

},{"./World":46}],48:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Scoreboard = require("./Scoreboard");
var Maps = require("./Maps");
var Guilds = require("./Guilds");

/*
*
*	Component Export
*
*/

var Tracker = (function (_React$Component) {
	function Tracker(props) {
		_classCallCheck(this, Tracker);

		_get(Object.getPrototypeOf(Tracker.prototype), "constructor", this).call(this, props);

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

	_createClass(Tracker, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var initialData = !_.isEqual(this.state.hasData, nextState.hasData);
				var newMatchData = !_.isEqual(this.state.lastmod, nextState.lastmod);

				var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);

				var shouldUpdate = initialData || newMatchData || newGuildData || newLang;

				return shouldUpdate;
			}
		},
		componentDidMount: {
			value: function componentDidMount() {
				console.log("Tracker::componentDidMount()");

				this.intervals.timers = setInterval(updateTimers.bind(this), 1000);
				setImmediate(updateTimers.bind(this));

				setImmediate(getMatchDetails.bind(this));
			}
		},
		componentWillUnmount: {
			value: function componentWillUnmount() {
				console.log("Tracker::componentWillUnmount()");

				clearTimers.call(this);

				this.mounted = false;
			}
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);

				console.log("componentWillReceiveProps()", newLang);

				if (newLang) {
					setMatchWorlds.call(this, nextProps.lang);
				}
			}
		},
		render: {

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
					"div",
					{ id: "tracker" },
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
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-24" },
							!this.state.guilds.isEmpty() ? React.createElement(Guilds, {
								lang: this.props.lang,

								guilds: this.state.guilds,
								claimEvents: this.state.claimEvents
							}) : null
						)
					)
				);
			}
		}
	});

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
	var langSlug = props.lang.get("slug");
	var worldSlug = world.getIn([langSlug, "slug"]);

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
				var isModified = lastmod !== state.match.get("lastmod");

				console.log("onMatchDetails", data.match.lastmod, isModified);

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

	component.setState({ matchWorlds: Immutable.List(["red", "blue", "green"]).map(getMatchWorld.bind(component, lang))
	});
}

function getMatchWorld(lang, color) {
	var component = this;
	var state = component.state;

	var langSlug = lang.get("slug");

	var worldKey = color + "Id";
	var worldId = state.match.getIn([worldKey]).toString();

	var worldByLang = STATIC.worlds.getIn([worldId, langSlug]);

	return worldByLang.set("color", color).set("link", getWorldLink(langSlug, worldByLang));
}

function getWorldLink(langSlug, world) {
	return ["", langSlug, world.get("slug")].join("/");
}

/*
*
*	Match Details
*
*/

function setPageTitle(lang, world) {
	var langSlug = lang.get("slug");
	var worldName = world.getIn([langSlug, "name"]);

	var title = [worldName, "gw2w2w"];

	if (langSlug !== "en") {
		title.push(lang.get("name"));
	}

	$("title").text(title.join(" - "));
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../lib/api.js":55,"./../lib/date.js":56,"./../lib/static":57,"./../lib/tracker/guilds.js":59,"./../lib/trackerTimers":58,"./Guilds":26,"./Maps":35,"./Scoreboard":47}],49:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Arrow, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newObjectiveMeta = !Immutable.is(this.props.oMeta, nextProps.oMeta);
				var shouldUpdate = newObjectiveMeta;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var imgSrc = getArrowSrc(this.props.oMeta);

				return React.createElement(
					"span",
					{ className: "direction" },
					imgSrc ? React.createElement("img", { src: imgSrc }) : null
				);
			}
		}
	});

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
	if (!meta.get("d")) {
		return null;
	}

	var src = ["/img/icons/dist/arrow"];

	if (meta.get("n")) {
		src.push("north");
	} else if (meta.get("s")) {
		src.push("south");
	}

	if (meta.get("w")) {
		src.push("west");
	} else if (meta.get("e")) {
		src.push("east");
	}

	return src.join("-") + ".svg";
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],50:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var imgPlaceholder = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>";

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

	_createClass(Emblem, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newGuildName = this.props.guildName !== nextProps.guildName;
				var newSize = this.props.size !== nextProps.size;

				var shouldUpdate = newGuildName || newSize;

				return shouldUpdate;
			}
		},
		render: {
			value: function render() {
				var emblemSrc = getEmblemSrc(this.props.guildName);

				return React.createElement("img", {
					className: "emblem",
					src: emblemSrc,
					width: this.props.size,
					height: this.props.size,
					onError: imgOnError
				});
			}
		}
	});

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
	return guildName ? "http://guilds.gw2w2w.com/guilds/" + slugify(guildName) + "/256.svg" : imgPlaceholder;
}

function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, "-")).toLowerCase();
}

function imgOnError(e) {
	var currentSrc = $(e.target).attr("src");

	if (currentSrc !== imgPlaceholder) {
		$(e.target).attr("src", imgPlaceholder);
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],51:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Pie, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return !Immutable.is(this.props.scores, nextProps.scores);
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				// console.log('Pie::render', props.scores.toArray());

				return React.createElement("img", {
					width: INSTANCE.size,
					height: INSTANCE.size,
					src: getImageSource(props.scores.toArray())
				});
			}
		}
	});

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
	return "http://www.piely.net/" + INSTANCE.size + "/" + scores.join(",") + "?strokeWidth=" + INSTANCE.stroke;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(Sprite, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return !_.isEqual(this.props, nextProps);
			}
		},
		render: {
			value: function render() {
				var props = this.props;

				return React.createElement("span", { className: "sprite " + props.type + " " + props.color });
			}
		}
	});

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

},{}],53:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(LangLink, {
		render: {
			value: function render() {
				var props = this.props;

				var isActive = Immutable.is(props.lang, props.linkLang);
				var title = props.linkLang.get("name");
				var label = props.linkLang.get("label");
				var link = getLink(props.linkLang, props.world);

				return React.createElement(
					"li",
					{ className: isActive ? "active" : "", title: title },
					React.createElement(
						"a",
						{ href: link },
						label
					)
				);
			}
		}
	});

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
	var langSlug = lang.get("slug");

	var link = "/" + langSlug;

	if (world) {
		var worldSlug = world.getIn([langSlug, "slug"]);
		link += "/" + worldSlug;
	}

	return link;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],54:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var LangLink = require("./LangLink");

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

	_createClass(Langs, {
		render: {
			value: function render() {
				var _this = this;

				// console.log('Langs::render()', this.props.lang.toJS());

				return React.createElement(
					"ul",
					{ className: "nav navbar-nav" },
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
		}
	});

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

},{"./../../lib/static":57,"./LangLink":53}],55:[function(require,module,exports){
"use strict";

var gw2api = require("gw2api");

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

},{"gw2api":5}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
(function (global){
"use strict";

var statics = require("gw2w2w-static");

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

},{"gw2w2w-static":16}],58:[function(require,module,exports){
(function (global){
"use strict";

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

module.exports = { update: update };

function update(now, timeOffset) {
	var $timers = $(".timer");
	var $countdowns = $timers.filter(".countdown");
	var $relatives = $timers.filter(".relative");

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

	var timestamp = _.parseInt($el.attr("data-timestamp"));
	var offsetTimestamp = timestamp + timeOffset;
	var timestampMoment = moment(offsetTimestamp * 1000);
	var timestampRelative = timestampMoment.twitterShort();

	$el.text(timestampRelative);

	next();
}

function updateCountdownTimerNode(now, el, next) {
	var $el = $(el);

	var dataExpires = $el.attr("data-expires");
	var expires = _.parseInt(dataExpires);
	var secRemaining = expires - now;
	var secElapsed = 300 - secRemaining;

	var highliteTime = 10;
	var isVisible = expires + highliteTime >= now;
	var isExpired = expires < now;
	var isActive = !isExpired;
	var isTimerHighlighted = secRemaining <= Math.abs(highliteTime);
	var isTimerFresh = secElapsed <= highliteTime;

	var timerText = isActive ? moment(secRemaining * 1000).format("m:ss") : "0:00";

	if (isVisible) {
		var $objective = $el.closest(".objective");
		var hasClassHighlight = $el.hasClass("highlight");
		var hasClassFresh = $objective.hasClass("fresh");

		if (isTimerHighlighted && !hasClassHighlight) {
			$el.addClass("highlight");
		} else if (!isTimerHighlighted && hasClassHighlight) {
			$el.removeClass("highlight");
		}

		if (isTimerFresh && !hasClassFresh) {
			$objective.addClass("fresh");
		} else if (!isTimerFresh && hasClassFresh) {
			$objective.removeClass("fresh");
		}

		$el.text(timerText).filter(".inactive").addClass("active").removeClass("inactive").end();
	} else {
		$el.filter(".active").addClass("inactive").removeClass("active").removeClass("highlight").end();
	}

	next();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],59:[function(require,module,exports){
(function (global){

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	_createClass(LibGuilds, {
		onMatchData: {
			value: function onMatchData(matchDetails) {
				// let component = this;
				var state = this.component.state;

				// console.log('LibGuilds::onMatchData()');

				var objectiveClaimers = matchDetails.getIn(["objectives", "claimers"]);
				var claimEvents = getEventsByType(matchDetails, "claim");
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
					console.log("guilds::onMatchData()", "has update");
					this.component.setState({ guilds: newGuilds });
				}
			}
		},
		getGuildDetails: {
			value: function getGuildDetails(guildId, onComplete) {
				var component = this.component;
				var state = component.state;

				var hasData = state.guilds.getIn([guildId, "loaded"]);

				if (hasData) {
					// console.log('Tracker::getGuildDetails()', 'skip', guildId);
					onComplete(null);
				} else {
					// console.log('Tracker::getGuildDetails()', 'lookup', guildId);
					api.getGuildDetails(guildId, onGuildData.bind(this, onComplete));
				}
			}
		}
	});

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
	var hasClaims = !guild.get("claims").isEmpty();
	var newestClaim = hasClaims ? guild.get("claims").first() : null;

	var incClaims = claimEvents.filter(function (entry) {
		return entry.get("guild") === guildId;
	}).toMap();

	var incHasClaims = !incClaims.isEmpty();
	var incNewestClaim = incHasClaims ? incClaims.first() : null;

	var hasNewClaims = !Immutable.is(newestClaim, incNewestClaim);

	if (hasNewClaims) {
		var lastClaim = incHasClaims ? incNewestClaim.get("timestamp") : 0;
		// console.log('claims altered', guildId, hasNewClaims, lastClaim);
		guild = guild.set("claims", incClaims);
		guild = guild.set("lastClaim", lastClaim);
	}

	return guild;
}

function initializeGuilds(guilds, newGuilds) {
	// console.log('initializeGuilds()');
	// console.log('newGuilds', newGuilds);

	newGuilds.forEach(function (guildId) {
		if (!guilds.has(guildId)) {
			var guild = guildDefault.set("guild_id", guildId);
			guilds = guilds.set(guildId, guild);
		}
	});

	return guilds;
}

function getEventsByType(matchDetails, eventType) {
	return matchDetails.get("history").filter(function (entry) {
		return entry.get("type") === eventType;
	}).sortBy(function (entry) {
		return -entry.get("timestamp");
	});
}

function getUnknownGuilds(stateGuilds, objectiveClaimers, claimEvents) {
	var guildsWithCurrentClaims = objectiveClaimers.map(function (entry) {
		return entry.get("guild");
	}).toSet();

	var guildsWithPreviousClaims = claimEvents.map(function (entry) {
		return entry.get("guild");
	}).toSet();

	var guildClaims = guildsWithCurrentClaims.union(guildsWithPreviousClaims);

	var knownGuilds = stateGuilds.map(function (entry) {
		return entry.get("guild_id");
	}).toSet();

	var unknownGuilds = guildClaims.subtract(knownGuilds);

	// console.log('guildClaims', guildClaims.toArray());
	// console.log('knownGuilds', knownGuilds.toArray());
	// console.log('unknownGuilds', unknownGuilds.toArray());

	return unknownGuilds;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../api.js":55}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9ub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9ub2RlX21vZHVsZXMvcmVkdWNlLWNvbXBvbmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9sYWJlbHMuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9tYXAuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9tZXRhLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbmFtZXMuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV90eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2guanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL01hdGNoV29ybGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL1Njb3JlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L1dvcmxkcy9Xb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L1dvcmxkcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9HdWlsZHMvQ2xhaW1zLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9HdWlsZHMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL0VudHJ5LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRXZlbnRGaWx0ZXJzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTG9nRW50cmllcy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL01hcEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9NYXBEZXRhaWxzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNjb3Jlcy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTWFwcy9NYXBTZWN0aW9uLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL0d1aWxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL0ljb25zLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL0xhYmVsLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL01hcE5hbWUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvVGltZXJDb3VudGRvd24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvVGltZXJSZWxhdGl2ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lc3RhbXAuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL1Njb3JlYm9hcmQvSG9sZGluZ3MvSXRlbS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Xb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvQXJyb3cuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvRW1ibGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1BpZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9TcHJpdGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vTGFuZ3MvTGFuZ0xpbmsuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vTGFuZ3MvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvYXBpLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL2RhdGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvc3RhdGljLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvbGliL3RyYWNrZXJUaW1lcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvdHJhY2tlci9ndWlsZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsWUFBWSxDQUFDOzs7Ozs7OztBQVFiLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7OztBQVFyQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7Ozs7QUFZbkMsQ0FBQyxDQUFDLFlBQVc7QUFDWixhQUFZLEVBQUUsQ0FBQztBQUNmLGFBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNsQixDQUFDLENBQUM7Ozs7Ozs7O0FBWUgsU0FBUyxZQUFZLEdBQUc7QUFDdkIsS0FBTSxTQUFTLEdBQUc7QUFDakIsVUFBUSxFQUFFLFFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RCxNQUFNLENBQUMsVUFBQSxLQUFLO1NBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztFQUFBLENBQUMsQ0FBQztDQUMzQzs7QUFJRCxTQUFTLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUU7QUFDdEUsS0FBTSx1QkFBdUIsR0FBRyxpQkFBaUIsQ0FDL0MsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0VBQUEsQ0FBQyxDQUNoQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLHdCQUF3QixHQUFHLFdBQVcsQ0FDMUMsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0VBQUEsQ0FBQyxDQUNoQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FDekMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBR2xDLEtBQU0sV0FBVyxHQUFHLFdBQVcsQ0FDN0IsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0VBQUEsQ0FBQyxDQUNuQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLGFBQWEsR0FBRyxXQUFXLENBQy9CLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7O0FBT3hCLFFBQU8sYUFBYSxDQUFDO0NBQ3JCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IHBhZ2UgPSByZXF1aXJlKCdwYWdlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IExhbmdzID0gcmVxdWlyZSgnY29tbW9uL0xhbmdzJyk7XHJcbmNvbnN0IE92ZXJ2aWV3ID0gcmVxdWlyZSgnT3ZlcnZpZXcnKTtcclxuY29uc3QgVHJhY2tlciA9IHJlcXVpcmUoJ1RyYWNrZXInKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERPTSBSZWFkeVxyXG4qXHJcbiovXHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdGF0dGFjaFJvdXRlcygpO1xyXG5cdHNldEltbWVkaWF0ZShlbWwpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFJvdXRlc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhdHRhY2hSb3V0ZXMoKSB7XHJcblx0Y29uc3QgZG9tTW91bnRzID0ge1xyXG5cdFx0bmF2TGFuZ3M6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSxcclxuXHRcdGNvbnRlbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JyksXHJcblx0fTtcclxuXHJcblxyXG5cdHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgZnVuY3Rpb24oY3R4KSB7XHJcblx0XHRjb25zdCBsYW5nU2x1ZyA9IGN0eC5wYXJhbXMubGFuZ1NsdWc7XHJcblx0XHRjb25zdCBsYW5nID0gU1RBVElDLmxhbmdzLmdldChsYW5nU2x1Zyk7XHJcblxyXG5cclxuXHRcdGNvbnN0IHdvcmxkU2x1ZyA9IGN0eC5wYXJhbXMud29ybGRTbHVnO1xyXG5cdFx0Y29uc3Qgd29ybGQgPSBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuXHJcblx0XHRsZXQgQXBwID0gT3ZlcnZpZXc7XHJcblx0XHRsZXQgcHJvcHMgPSB7bGFuZ307XHJcblxyXG5cdFx0aWYgKHdvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAod29ybGQpICYmICF3b3JsZC5pc0VtcHR5KCkpIHtcclxuXHRcdFx0QXBwID0gVHJhY2tlcjtcclxuXHRcdFx0cHJvcHMud29ybGQgPSB3b3JsZDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0UmVhY3QucmVuZGVyKDxMYW5ncyB7Li4ucHJvcHN9IC8+LCBkb21Nb3VudHMubmF2TGFuZ3MpO1xyXG5cdFx0UmVhY3QucmVuZGVyKDxBcHAgey4uLnByb3BzfSAvPiwgZG9tTW91bnRzLmNvbnRlbnQpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vIHJlZGlyZWN0ICcvJyB0byAnL2VuJ1xyXG5cdHBhZ2UoJy8nLCByZWRpcmVjdFBhZ2UuYmluZChudWxsLCAnL2VuJykpO1xyXG5cclxuXHJcblxyXG5cclxuXHRwYWdlLnN0YXJ0KHtcclxuXHRcdGNsaWNrOiB0cnVlLFxyXG5cdFx0cG9wc3RhdGU6IHRydWUsXHJcblx0XHRkaXNwYXRjaDogdHJ1ZSxcclxuXHRcdGhhc2hiYW5nOiBmYWxzZSxcclxuXHRcdGRlY29kZVVSTENvbXBvbmVudHMgOiB0cnVlLFxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRVdGlsXHJcbipcclxuKi9cclxuZnVuY3Rpb24gcmVkaXJlY3RQYWdlKGRlc3RpbmF0aW9uKSB7XHJcblx0cGFnZS5yZWRpcmVjdChkZXN0aW5hdGlvbik7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcblx0cmV0dXJuIFNUQVRJQy53b3JsZHNcclxuXHRcdC5maW5kKHdvcmxkID0+IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSkgPT09IHdvcmxkU2x1Zyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZW1sKCkge1xyXG5cdGNvbnN0IGNodW5rcyA9IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddO1xyXG5cdGNvbnN0IGFkZHIgPSBbY2h1bmtzWzBdLCBjaHVua3NbM10sIGNodW5rc1sxXSwgY2h1bmtzWzRdLCBjaHVua3NbMl1dLmpvaW4oJycpO1xyXG5cclxuXHQkKCcubm9zcGFtLXByeicpLmVhY2goKGksIGVsKSA9PiB7XHJcblx0XHQkKGVsKS5yZXBsYWNlV2l0aChcclxuXHRcdFx0JCgnPGE+Jywge2hyZWY6IGBtYWlsdG86JHthZGRyfWAsIHRleHQ6IGFkZHJ9KVxyXG5cdFx0KTtcclxuXHR9KTtcclxufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHRodHRwczovL2dpdGh1Yi5jb20vZm9vZXkvbm9kZS1ndzJcclxuKiAgIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOk1haW5cclxuKlxyXG5cclxuKi9cclxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBERUZJTkUgRVhQT1JUXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Z2V0TWF0Y2hlc1N0YXRlOiBnZXRNYXRjaGVzU3RhdGUsXHJcblx0Z2V0T2JqZWN0aXZlTmFtZXM6IGdldE9iamVjdGl2ZU5hbWVzLFxyXG5cdGdldE1hdGNoRGV0YWlsczogZ2V0TWF0Y2hEZXRhaWxzLFxyXG5cdGdldE1hdGNoRGV0YWlsc1N0YXRlOiBnZXRNYXRjaERldGFpbHNTdGF0ZSxcclxuXHJcblx0Z2V0SXRlbXM6IGdldEl0ZW1zLFxyXG5cdGdldEl0ZW1EZXRhaWxzOiBnZXRJdGVtRGV0YWlscyxcclxuXHRnZXRSZWNpcGVzOiBnZXRSZWNpcGVzLFxyXG5cdGdldFJlY2lwZURldGFpbHM6IGdldFJlY2lwZURldGFpbHMsXHJcblxyXG5cdGdldFdvcmxkTmFtZXM6IGdldFdvcmxkTmFtZXMsXHJcblx0Z2V0R3VpbGREZXRhaWxzOiBnZXRHdWlsZERldGFpbHMsXHJcblxyXG5cdGdldE1hcE5hbWVzOiBnZXRNYXBOYW1lcyxcclxuXHRnZXRDb250aW5lbnRzOiBnZXRDb250aW5lbnRzLFxyXG5cdGdldE1hcHM6IGdldE1hcHMsXHJcblx0Z2V0TWFwRmxvb3I6IGdldE1hcEZsb29yLFxyXG5cclxuXHRnZXRCdWlsZDogZ2V0QnVpbGQsXHJcblx0Z2V0Q29sb3JzOiBnZXRDb2xvcnMsXHJcblxyXG5cdGdldEZpbGVzOiBnZXRGaWxlcyxcclxuXHRnZXRGaWxlOiBnZXRGaWxlLFxyXG5cdGdldEZpbGVSZW5kZXJVcmw6IGdldEZpbGVSZW5kZXJVcmwsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQUklWQVRFIFBST1BFUlRJRVNcclxuKlxyXG4qL1xyXG5cclxudmFyIGVuZFBvaW50cyA9IHtcclxuXHR3b3JsZE5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YyL3dvcmxkcz9wYWdlPTBcclxuXHRjb2xvcnM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9jb2xvcnMuanNvbicsXHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9jb2xvcnNcclxuXHRndWlsZERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvZ3VpbGRfZGV0YWlsc1xyXG5cclxuXHRpdGVtczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2l0ZW1zLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtc1xyXG5cdGl0ZW1EZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb212MS9pdGVtX2RldGFpbHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1fZGV0YWlsc1xyXG5cdHJlY2lwZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVzLmpzb24nLFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlc1xyXG5cdHJlY2lwZURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZV9kZXRhaWxzXHJcblxyXG5cdG1hcE5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX25hbWVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9uYW1lc1xyXG5cdGNvbnRpbmVudHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9jb250aW5lbnRzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9jb250aW5lbnRzXHJcblx0bWFwczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcHMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcHNcclxuXHRtYXBGbG9vcjogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9mbG9vci5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfZmxvb3JcclxuXHJcblx0b2JqZWN0aXZlTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvb2JqZWN0aXZlX25hbWVzLmpzb24nLFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hlc1xyXG5cdG1hdGNoZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hlcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hfZGV0YWlsc1xyXG5cdG1hdGNoRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaF9kZXRhaWxzLmpzb24nLFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9vYmplY3RpdmVfbmFtZXNcclxuXHJcblx0bWF0Y2hlc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlcycsXHJcblx0bWF0Y2hEZXRhaWxzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS8nLFxyXG59O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQVUJMSUMgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFdPUkxEIHZzIFdPUkxEXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnb2JqZWN0aXZlTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnbWF0Y2hlcycsIHt9LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdHZhciB3dndfbWF0Y2hlcyA9IChkYXRhICYmIGRhdGEud3Z3X21hdGNoZXMpID8gZGF0YS53dndfbWF0Y2hlcyA6IFtdO1xyXG5cdFx0Y2FsbGJhY2soZXJyLCB3dndfbWF0Y2hlcyk7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHRocm93ICgnbWF0Y2hfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXRjaERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHMubWF0Y2hlc1N0YXRlO1xyXG5cclxuXHRpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICgnJyArIHBhcmFtcy5tYXRjaF9pZCk7XHJcblx0fVxyXG5cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZCB8fCB3b3JsZF9zbHVnXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50cy5tYXRjaERldGFpbHNTdGF0ZTtcclxuXHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQgJiYgIXBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBtYXRjaF9pZCBvciB3b3JsZF9zbHVnIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSBwYXJhbXMubWF0Y2hfaWQ7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICd3b3JsZC8nICsgcGFyYW1zLndvcmxkX3NsdWc7XHJcblx0fVxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdEdFTkVSQUxcclxuKi9cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZywgaWRzXHJcbmZ1bmN0aW9uIGdldFdvcmxkTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0aWYgKCFwYXJhbXMuaWRzKSB7XHJcblx0XHRwYXJhbXMucGFnZSA9IDA7XHJcblx0fVxyXG5cdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmlkcykpIHtcclxuXHRcdHBhcmFtcy5pZHMgPSBwYXJhbXMuaWRzLmpvaW4oJywnKTtcclxuXHR9XHJcblx0Z2V0KCd3b3JsZE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGd1aWxkX2lkIHx8IGd1aWxkX25hbWUgKGlkIHRha2VzIHByaW9yaXR5KVxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmd1aWxkX2lkICYmICFwYXJhbXMuZ3VpbGRfbmFtZSkge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgZ3VpbGRfaWQgb3IgZ3VpbGRfbmFtZSBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHJcblx0Z2V0KCdndWlsZERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRJVEVNU1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEl0ZW1zKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdpdGVtcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogaXRlbV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRJdGVtRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuaXRlbV9pZCkge1xyXG5cdFx0dGhyb3cgKCdpdGVtX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnaXRlbURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdyZWNpcGVzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gUkVRVUlSRUQ6IHJlY2lwZV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5yZWNpcGVfaWQpIHtcclxuXHRcdHRocm93ICgncmVjaXBlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgncmVjaXBlRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1BUCBJTkZPUk1BVElPTlxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRDb250aW5lbnRzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdjb250aW5lbnRzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXBfaWQsIGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGNvbnRpbmVudF9pZCwgZmxvb3JcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwRmxvb3IocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmNvbnRpbmVudF9pZCkge1xyXG5cdFx0dGhyb3cgKCdjb250aW5lbnRfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mbG9vcikge1xyXG5cdFx0dGhyb3cgKCdmbG9vciBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hcEZsb29yJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNaXNjZWxsYW5lb3VzXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0QnVpbGQoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2J1aWxkJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldENvbG9ycyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnY29sb3JzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuLy8gdG8gZ2V0IGZpbGVzOiBodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL3tzaWduYXR1cmV9L3tmaWxlX2lkfS57Zm9ybWF0fVxyXG5mdW5jdGlvbiBnZXRGaWxlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnZmlsZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFVUSUxJVFkgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuLy8gU1BFQ0lBTCBDQVNFXHJcbi8vIFJFUVVJUkVEOiBzaWduYXR1cmUsIGZpbGVfaWQsIGZvcm1hdFxyXG5mdW5jdGlvbiBnZXRGaWxlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5zaWduYXR1cmUpIHtcclxuXHRcdHRocm93ICgnc2lnbmF0dXJlIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmlsZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdmaWxlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZm9ybWF0KSB7XHJcblx0XHR0aHJvdyAoJ2Zvcm1hdCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHJcblxyXG5cdHJlcXVlc3RcclxuXHRcdC5nZXQoZ2V0RmlsZVJlbmRlclVybChwYXJhbXMpKVxyXG5cdFx0LmVuZChmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdFx0Y2FsbGJhY2soZXJyLCBwYXJzZUpzb24oZGF0YS50ZXh0KSk7XHJcblx0XHR9KTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBzaWduYXR1cmUsIGZpbGVfaWQsIGZvcm1hdFxyXG5mdW5jdGlvbiBnZXRGaWxlUmVuZGVyVXJsKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5zaWduYXR1cmUpIHtcclxuXHRcdHRocm93ICgnc2lnbmF0dXJlIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmlsZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdmaWxlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZm9ybWF0KSB7XHJcblx0XHR0aHJvdyAoJ2Zvcm1hdCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHJcblx0dmFyIHJlbmRlclVybCA9IChcclxuXHRcdCdodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlLydcclxuXHRcdCsgcGFyYW1zLnNpZ25hdHVyZVxyXG5cdFx0KyAnLydcclxuXHRcdCsgcGFyYW1zLmZpbGVfaWRcclxuXHRcdCsgJy4nXHJcblx0XHQrIHBhcmFtcy5mb3JtYXRcclxuXHQpO1xyXG5cdHJldHVybiByZW5kZXJVcmw7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQUklWQVRFIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0KGtleSwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuXHJcblx0dmFyIGFwaVVybCA9IGdldEFwaVVybChrZXksIHBhcmFtcyk7XHJcblxyXG5cdHJlcXVlc3RcclxuXHRcdC5nZXQoYXBpVXJsKVxyXG5cdFx0LmVuZChmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdFx0Y2FsbGJhY2soZXJyLCBwYXJzZUpzb24oZGF0YS50ZXh0KSk7XHJcblx0XHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRBcGlVcmwocmVxdWVzdFVybCwgcGFyYW1zKSB7XHJcblx0dmFyIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcclxuXHJcblx0cmVxdWVzdFVybCA9IChlbmRQb2ludHNbcmVxdWVzdFVybF0pXHJcblx0XHQ/IGVuZFBvaW50c1tyZXF1ZXN0VXJsXVxyXG5cdFx0OiByZXF1ZXN0VXJsO1xyXG5cclxuXHR2YXIgcXVlcnkgPSBxcy5zdHJpbmdpZnkocGFyYW1zKTtcclxuXHJcblx0aWYgKHF1ZXJ5Lmxlbmd0aCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnPycgKyBxdWVyeTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXF1ZXN0VXJsO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcGFyc2VKc29uKGRhdGEpIHtcclxuXHR2YXIgcmVzdWx0cztcclxuXHJcblx0dHJ5IHtcclxuXHRcdHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cdH1cclxuXHRjYXRjaCAoZSkge31cclxuXHJcblx0cmV0dXJuIHJlc3VsdHM7XHJcbn1cclxuXHJcbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciByZWR1Y2UgPSByZXF1aXJlKCdyZWR1Y2UnKTtcblxuLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdCA9ICd1bmRlZmluZWQnID09IHR5cGVvZiB3aW5kb3dcbiAgPyB0aGlzXG4gIDogd2luZG93O1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgJiYgKCdmaWxlOicgIT0gcm9vdC5sb2NhdGlvbi5wcm90b2NvbCB8fCAhcm9vdC5BY3RpdmVYT2JqZWN0KSkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC42LjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuMy4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgYWRkZWQgdG8gc3VwcG9ydCBJRS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHRyaW0gPSAnJy50cmltXG4gID8gZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH1cbiAgOiBmdW5jdGlvbihzKSB7IHJldHVybiBzLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpOyB9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHZhciBwYWlycyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG51bGwgIT0gb2JqW2tleV0pIHtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhaXJzLmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBFeHBvc2Ugc2VyaWFsaXphdGlvbiBtZXRob2QuXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplO1xuXG4gLyoqXG4gICogUGFyc2UgdGhlIGdpdmVuIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBgc3RyYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICogQGFwaSBwcml2YXRlXG4gICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICB2YXIgb2JqID0ge307XG4gIHZhciBwYWlycyA9IHN0ci5zcGxpdCgnJicpO1xuICB2YXIgcGFydHM7XG4gIHZhciBwYWlyO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwYXJ0cyA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHBvc2UgcGFyc2VyLlxuICovXG5cbnJlcXVlc3QucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxuLyoqXG4gKiBEZWZhdWx0IE1JTUUgdHlwZSBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICovXG5cbnJlcXVlc3QudHlwZXMgPSB7XG4gIGh0bWw6ICd0ZXh0L2h0bWwnLFxuICBqc29uOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHhtbDogJ2FwcGxpY2F0aW9uL3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybS1kYXRhJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzZXJpYWxpemF0aW9uIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ob2JqKXtcbiAqICAgICAgIHJldHVybiAnZ2VuZXJhdGVkIHhtbCBoZXJlJztcbiAqICAgICB9O1xuICpcbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogc2VyaWFsaXplLFxuICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeVxuIH07XG5cbiAvKipcbiAgKiBEZWZhdWx0IHBhcnNlcnMuXG4gICpcbiAgKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICAqICAgICAgIHJldHVybiB7IG9iamVjdCBwYXJzZWQgZnJvbSBzdHIgfTtcbiAgKiAgICAgfTtcbiAgKlxuICAqL1xuXG5yZXF1ZXN0LnBhcnNlID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogcGFyc2VTdHJpbmcsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5wYXJzZVxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaGVhZGVyIGBzdHJgIGludG9cbiAqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXBwZWQgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVyKHN0cikge1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoL1xccj9cXG4vKTtcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgaW5kZXg7XG4gIHZhciBsaW5lO1xuICB2YXIgZmllbGQ7XG4gIHZhciB2YWw7XG5cbiAgbGluZXMucG9wKCk7IC8vIHRyYWlsaW5nIENSTEZcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgaW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdHJpbShsaW5lLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIGZpZWxkc1tmaWVsZF0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gZmllbGRzO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHlwZShzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJhbXMoc3RyKXtcbiAgcmV0dXJuIHJlZHVjZShzdHIuc3BsaXQoLyAqOyAqLyksIGZ1bmN0aW9uKG9iaiwgc3RyKXtcbiAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoLyAqPSAqLylcbiAgICAgICwga2V5ID0gcGFydHMuc2hpZnQoKVxuICAgICAgLCB2YWwgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWwpIG9ialtrZXldID0gdmFsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5yZXEgPSByZXE7XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICAvLyByZXNwb25zZVRleHQgaXMgYWNjZXNzaWJsZSBvbmx5IGlmIHJlc3BvbnNlVHlwZSBpcyAnJyBvciAndGV4dCcgYW5kIG9uIG9sZGVyIGJyb3dzZXJzXG4gIHRoaXMudGV4dCA9ICgodGhpcy5yZXEubWV0aG9kICE9J0hFQUQnICYmICh0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICcnIHx8IHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnKSkgfHwgdHlwZW9mIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgID8gdGhpcy54aHIucmVzcG9uc2VUZXh0XG4gICAgIDogbnVsbDtcbiAgdGhpcy5zdGF0dXNUZXh0ID0gdGhpcy5yZXEueGhyLnN0YXR1c1RleHQ7XG4gIHRoaXMuc2V0U3RhdHVzUHJvcGVydGllcyh0aGlzLnhoci5zdGF0dXMpO1xuICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVyKHRoaXMueGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgLy8gZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIHNvbWV0aW1lcyBmYWxzZWx5IHJldHVybnMgXCJcIiBmb3IgQ09SUyByZXF1ZXN0cywgYnV0XG4gIC8vIGdldFJlc3BvbnNlSGVhZGVyIHN0aWxsIHdvcmtzLiBzbyB3ZSBnZXQgY29udGVudC10eXBlIGV2ZW4gaWYgZ2V0dGluZ1xuICAvLyBvdGhlciBoZWFkZXJzIGZhaWxzLlxuICB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gPSB0aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJyk7XG4gIHRoaXMuc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG4gIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICA/IHRoaXMucGFyc2VCb2R5KHRoaXMudGV4dCA/IHRoaXMudGV4dCA6IHRoaXMueGhyLnJlc3BvbnNlKVxuICAgIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgcmVsYXRlZCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgLnR5cGVgIHRoZSBjb250ZW50IHR5cGUgd2l0aG91dCBwYXJhbXNcbiAqXG4gKiBBIHJlc3BvbnNlIG9mIFwiQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04XCJcbiAqIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhIGAudHlwZWAgb2YgXCJ0ZXh0L3BsYWluXCIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnNldEhlYWRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihoZWFkZXIpe1xuICAvLyBjb250ZW50LXR5cGVcbiAgdmFyIGN0ID0gdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddIHx8ICcnO1xuICB0aGlzLnR5cGUgPSB0eXBlKGN0KTtcblxuICAvLyBwYXJhbXNcbiAgdmFyIG9iaiA9IHBhcmFtcyhjdCk7XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHRoaXNba2V5XSA9IG9ialtrZXldO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYm9keSBgc3RyYC5cbiAqXG4gKiBVc2VkIGZvciBhdXRvLXBhcnNpbmcgb2YgYm9kaWVzLiBQYXJzZXJzXG4gKiBhcmUgZGVmaW5lZCBvbiB0aGUgYHN1cGVyYWdlbnQucGFyc2VgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5wYXJzZUJvZHkgPSBmdW5jdGlvbihzdHIpe1xuICB2YXIgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIHJldHVybiBwYXJzZSAmJiBzdHIgJiYgKHN0ci5sZW5ndGggfHwgc3RyIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgID8gcGFyc2Uoc3RyKVxuICAgIDogbnVsbDtcbn07XG5cbi8qKlxuICogU2V0IGZsYWdzIHN1Y2ggYXMgYC5va2AgYmFzZWQgb24gYHN0YXR1c2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYSAyeHggcmVzcG9uc2Ugd2lsbCBnaXZlIHlvdSBhIGAub2tgIG9mIF9fdHJ1ZV9fXG4gKiB3aGVyZWFzIDV4eCB3aWxsIGJlIF9fZmFsc2VfXyBhbmQgYC5lcnJvcmAgd2lsbCBiZSBfX3RydWVfXy4gVGhlXG4gKiBgLmNsaWVudEVycm9yYCBhbmQgYC5zZXJ2ZXJFcnJvcmAgYXJlIGFsc28gYXZhaWxhYmxlIHRvIGJlIG1vcmVcbiAqIHNwZWNpZmljLCBhbmQgYC5zdGF0dXNUeXBlYCBpcyB0aGUgY2xhc3Mgb2YgZXJyb3IgcmFuZ2luZyBmcm9tIDEuLjVcbiAqIHNvbWV0aW1lcyB1c2VmdWwgZm9yIG1hcHBpbmcgcmVzcG9uZCBjb2xvcnMgZXRjLlxuICpcbiAqIFwic3VnYXJcIiBwcm9wZXJ0aWVzIGFyZSBhbHNvIGRlZmluZWQgZm9yIGNvbW1vbiBjYXNlcy4gQ3VycmVudGx5IHByb3ZpZGluZzpcbiAqXG4gKiAgIC0gLm5vQ29udGVudFxuICogICAtIC5iYWRSZXF1ZXN0XG4gKiAgIC0gLnVuYXV0aG9yaXplZFxuICogICAtIC5ub3RBY2NlcHRhYmxlXG4gKiAgIC0gLm5vdEZvdW5kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnNldFN0YXR1c1Byb3BlcnRpZXMgPSBmdW5jdGlvbihzdGF0dXMpe1xuICB2YXIgdHlwZSA9IHN0YXR1cyAvIDEwMCB8IDA7XG5cbiAgLy8gc3RhdHVzIC8gY2xhc3NcbiAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIHRoaXMuc3RhdHVzVHlwZSA9IHR5cGU7XG5cbiAgLy8gYmFzaWNzXG4gIHRoaXMuaW5mbyA9IDEgPT0gdHlwZTtcbiAgdGhpcy5vayA9IDIgPT0gdHlwZTtcbiAgdGhpcy5jbGllbnRFcnJvciA9IDQgPT0gdHlwZTtcbiAgdGhpcy5zZXJ2ZXJFcnJvciA9IDUgPT0gdHlwZTtcbiAgdGhpcy5lcnJvciA9ICg0ID09IHR5cGUgfHwgNSA9PSB0eXBlKVxuICAgID8gdGhpcy50b0Vycm9yKClcbiAgICA6IGZhbHNlO1xuXG4gIC8vIHN1Z2FyXG4gIHRoaXMuYWNjZXB0ZWQgPSAyMDIgPT0gc3RhdHVzO1xuICB0aGlzLm5vQ29udGVudCA9IDIwNCA9PSBzdGF0dXMgfHwgMTIyMyA9PSBzdGF0dXM7XG4gIHRoaXMuYmFkUmVxdWVzdCA9IDQwMCA9PSBzdGF0dXM7XG4gIHRoaXMudW5hdXRob3JpemVkID0gNDAxID09IHN0YXR1cztcbiAgdGhpcy5ub3RBY2NlcHRhYmxlID0gNDA2ID09IHN0YXR1cztcbiAgdGhpcy5ub3RGb3VuZCA9IDQwNCA9PSBzdGF0dXM7XG4gIHRoaXMuZm9yYmlkZGVuID0gNDAzID09IHN0YXR1cztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGBFcnJvcmAgcmVwcmVzZW50YXRpdmUgb2YgdGhpcyByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgcmVxID0gdGhpcy5yZXE7XG4gIHZhciBtZXRob2QgPSByZXEubWV0aG9kO1xuICB2YXIgdXJsID0gcmVxLnVybDtcblxuICB2YXIgbXNnID0gJ2Nhbm5vdCAnICsgbWV0aG9kICsgJyAnICsgdXJsICsgJyAoJyArIHRoaXMuc3RhdHVzICsgJyknO1xuICB2YXIgZXJyID0gbmV3IEVycm9yKG1zZyk7XG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IG1ldGhvZDtcbiAgZXJyLnVybCA9IHVybDtcblxuICByZXR1cm4gZXJyO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlYC5cbiAqL1xuXG5yZXF1ZXN0LlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdGAgd2l0aCB0aGUgZ2l2ZW4gYG1ldGhvZGAgYW5kIGB1cmxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIEVtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9O1xuICB0aGlzLl9oZWFkZXIgPSB7fTtcbiAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgZXJyID0gbnVsbDtcbiAgICB2YXIgcmVzID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICByZXMgPSBuZXcgUmVzcG9uc2Uoc2VsZik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ1BhcnNlciBpcyB1bmFibGUgdG8gcGFyc2UgdGhlIHJlc3BvbnNlJyk7XG4gICAgICBlcnIucGFyc2UgPSB0cnVlO1xuICAgICAgZXJyLm9yaWdpbmFsID0gZTtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycik7XG4gICAgfVxuXG4gICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlcyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgaWYgKHJlcy5zdGF0dXMgPj0gMjAwICYmIHJlcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICB2YXIgbmV3X2VyciA9IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dCB8fCAnVW5zdWNjZXNzZnVsIEhUVFAgcmVzcG9uc2UnKTtcbiAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgIG5ld19lcnIucmVzcG9uc2UgPSByZXM7XG4gICAgbmV3X2Vyci5zdGF0dXMgPSByZXMuc3RhdHVzO1xuXG4gICAgc2VsZi5jYWxsYmFjayhlcnIgfHwgbmV3X2VyciwgcmVzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbihmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogU2V0IHRpbWVvdXQgdG8gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24obXMpe1xuICB0aGlzLl90aW1lb3V0ID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyLmFib3J0KCk7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBoZWFkZXIgYGZpZWxkYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnVuc2V0KCdVc2VyLUFnZW50JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS51bnNldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgZGVsZXRlIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbiAgZGVsZXRlIHRoaXMuaGVhZGVyW2ZpZWxkXTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgQ29udGVudC1UeXBlIHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi94bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0FjY2VwdCcsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzKXtcbiAgdmFyIHN0ciA9IGJ0b2EodXNlciArICc6JyArIHBhc3MpO1xuICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgc3RyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbipcbiogRXhhbXBsZXM6XG4qXG4qICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4qICAgICAucXVlcnkoJ3NpemU9MTAnKVxuKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuKlxuKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiogQGFwaSBwdWJsaWNcbiovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJcbiAqIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd8QmxvYnxGaWxlfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5maWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgdGhpcy5fZm9ybURhdGEuYXBwZW5kKG5hbWUsIHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBRdWV1ZSB0aGUgZ2l2ZW4gYGZpbGVgIGFzIGFuIGF0dGFjaG1lbnQgdG8gdGhlIHNwZWNpZmllZCBgZmllbGRgLFxuICogd2l0aCBvcHRpb25hbCBgZmlsZW5hbWVgLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmF0dGFjaChuZXcgQmxvYihbJzxhIGlkPVwiYVwiPjxiIGlkPVwiYlwiPmhleSE8L2I+PC9hPiddLCB7IHR5cGU6IFwidGV4dC9odG1sXCJ9KSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7QmxvYnxGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbihmaWVsZCwgZmlsZSwgZmlsZW5hbWUpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChmaWVsZCwgZmlsZSwgZmlsZW5hbWUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2VuZCBgZGF0YWAsIGRlZmF1bHRpbmcgdGhlIGAudHlwZSgpYCB0byBcImpzb25cIiB3aGVuXG4gKiBhbiBvYmplY3QgaXMgZ2l2ZW4uXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gcXVlcnlzdHJpbmdcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvc2VhcmNoJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtdWx0aXBsZSBkYXRhIFwid3JpdGVzXCJcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvc2VhcmNoJylcbiAqICAgICAgICAgLnNlbmQoeyBzZWFyY2g6ICdxdWVyeScgfSlcbiAqICAgICAgICAgLnNlbmQoeyByYW5nZTogJzEuLjUnIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgb3JkZXI6ICdkZXNjJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAgKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAgKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBvYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKG9iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFvYmogfHwgaXNIb3N0KGRhdGEpKSByZXR1cm4gdGhpcztcbiAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2pzb24nKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2sgd2l0aCBgZXJyYCBhbmQgYHJlc2BcbiAqIGFuZCBoYW5kbGUgYXJpdHkgY2hlY2suXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCByZXMpe1xuICB2YXIgZm4gPSB0aGlzLl9jYWxsYmFjaztcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgZm4oZXJyLCByZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dEVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpe1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKHJlcylgXG4gKiB3aXRoIGFuIGluc3RhbmNlb2YgYFJlc3BvbnNlYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgeGhyID0gdGhpcy54aHIgPSByZXF1ZXN0LmdldFhIUigpO1xuICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyeS5qb2luKCcmJyk7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIC8vIHN0b3JlIGNhbGxiYWNrXG4gIHRoaXMuX2NhbGxiYWNrID0gZm4gfHwgbm9vcDtcblxuICAvLyBzdGF0ZSBjaGFuZ2VcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKDQgIT0geGhyLnJlYWR5U3RhdGUpIHJldHVybjtcblxuICAgIC8vIEluIElFOSwgcmVhZHMgdG8gYW55IHByb3BlcnR5IChlLmcuIHN0YXR1cykgb2ZmIG9mIGFuIGFib3J0ZWQgWEhSIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gdGhlIGVycm9yIFwiQ291bGQgbm90IGNvbXBsZXRlIHRoZSBvcGVyYXRpb24gZHVlIHRvIGVycm9yIGMwMGMwMjNmXCJcbiAgICB2YXIgc3RhdHVzO1xuICAgIHRyeSB7IHN0YXR1cyA9IHhoci5zdGF0dXMgfSBjYXRjaChlKSB7IHN0YXR1cyA9IDA7IH1cblxuICAgIGlmICgwID09IHN0YXR1cykge1xuICAgICAgaWYgKHNlbGYudGltZWRvdXQpIHJldHVybiBzZWxmLnRpbWVvdXRFcnJvcigpO1xuICAgICAgaWYgKHNlbGYuYWJvcnRlZCkgcmV0dXJuO1xuICAgICAgcmV0dXJuIHNlbGYuY3Jvc3NEb21haW5FcnJvcigpO1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9O1xuXG4gIC8vIHByb2dyZXNzXG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgICAgIH07XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgLy8gUmVwb3J0ZWQgaGVyZTpcbiAgICAvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgzNzI0NS94bWxodHRwcmVxdWVzdC11cGxvYWQtdGhyb3dzLWludmFsaWQtYXJndW1lbnQtd2hlbi11c2VkLWZyb20td2ViLXdvcmtlci1jb250ZXh0XG4gIH1cblxuICAvLyB0aW1lb3V0XG4gIGlmICh0aW1lb3V0ICYmICF0aGlzLl90aW1lcikge1xuICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi50aW1lZG91dCA9IHRydWU7XG4gICAgICBzZWxmLmFib3J0KCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBxdWVyeXN0cmluZ1xuICBpZiAocXVlcnkpIHtcbiAgICBxdWVyeSA9IHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0KHF1ZXJ5KTtcbiAgICB0aGlzLnVybCArPSB+dGhpcy51cmwuaW5kZXhPZignPycpXG4gICAgICA/ICcmJyArIHF1ZXJ5XG4gICAgICA6ICc/JyArIHF1ZXJ5O1xuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuXG4gIC8vIENPUlNcbiAgaWYgKHRoaXMuX3dpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgLy8gYm9keVxuICBpZiAoJ0dFVCcgIT0gdGhpcy5tZXRob2QgJiYgJ0hFQUQnICE9IHRoaXMubWV0aG9kICYmICdzdHJpbmcnICE9IHR5cGVvZiBkYXRhICYmICFpc0hvc3QoZGF0YSkpIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICB2YXIgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXTtcbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAobnVsbCA9PSB0aGlzLmhlYWRlcltmaWVsZF0pIGNvbnRpbnVlO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCB0aGlzLmhlYWRlcltmaWVsZF0pO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcbiAgeGhyLnNlbmQoZGF0YSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlcXVlc3RgLlxuICovXG5cbnJlcXVlc3QuUmVxdWVzdCA9IFJlcXVlc3Q7XG5cbi8qKlxuICogSXNzdWUgYSByZXF1ZXN0OlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIHJlcXVlc3QoJ0dFVCcsICcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnLCBjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdXJsIG9yIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiByZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIC8vIGNhbGxiYWNrXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB1cmwpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCkuZW5kKHVybCk7XG4gIH1cblxuICAvLyB1cmwgZmlyc3RcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVxdWVzdChtZXRob2QsIHVybCk7XG59XG5cbi8qKlxuICogR0VUIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuaGVhZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnSEVBRCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIERFTEVURSBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5kZWwgPSBmdW5jdGlvbih1cmwsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucGF0Y2ggPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BBVENIJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUE9TVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBvc3QgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BPU1QnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQVVQgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0O1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXG4vKipcbiAqIFJlZHVjZSBgYXJyYCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFxuICpcbiAqIFRPRE86IGNvbWJhdGlibGUgZXJyb3IgaGFuZGxpbmc/XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIGZuLCBpbml0aWFsKXsgIFxuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIHZhciBjdXJyID0gYXJndW1lbnRzLmxlbmd0aCA9PSAzXG4gICAgPyBpbml0aWFsXG4gICAgOiBhcnJbaWR4KytdO1xuXG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBjdXJyID0gZm4uY2FsbChudWxsLCBjdXJyLCBhcnJbaWR4XSwgKytpZHgsIGFycik7XG4gIH1cbiAgXG4gIHJldHVybiBjdXJyO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImVuXCI6IHtcclxuXHRcdFwic29ydFwiOiAxLFxyXG5cdFx0XCJzbHVnXCI6IFwiZW5cIixcclxuXHRcdFwibGFiZWxcIjogXCJFTlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VuXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFbmdsaXNoXCJcclxuXHR9LFxyXG5cdFwiZGVcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDIsXHJcblx0XHRcInNsdWdcIjogXCJkZVwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkRFXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZGVcIixcclxuXHRcdFwibmFtZVwiOiBcIkRldXRzY2hcIlxyXG5cdH0sXHJcblx0XCJlc1wiOiB7XHJcblx0XHRcInNvcnRcIjogMyxcclxuXHRcdFwic2x1Z1wiOiBcImVzXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRVNcIixcclxuXHRcdFwibGlua1wiOiBcIi9lc1wiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXNwYcOxb2xcIlxyXG5cdH0sXHJcblx0XCJmclwiOiB7XHJcblx0XHRcInNvcnRcIjogNCxcclxuXHRcdFwic2x1Z1wiOiBcImZyXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRlJcIixcclxuXHRcdFwibGlua1wiOiBcIi9mclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRnJhbsOnYWlzXCJcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiBcIjFcIiwgXCJlblwiOiBcIk92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZVwiLCBcImVzXCI6IFwiTWlyYWRvclwiLCBcImRlXCI6IFwiQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IFwiMlwiLCBcImVuXCI6IFwiVmFsbGV5XCIsIFwiZnJcIjogXCJWYWxsw6llXCIsIFwiZXNcIjogXCJWYWxsZVwiLCBcImRlXCI6IFwiVGFsXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiBcIjNcIiwgXCJlblwiOiBcIkxvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzXCIsIFwiZXNcIjogXCJWZWdhXCIsIFwiZGVcIjogXCJUaWVmbGFuZFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogXCI0XCIsIFwiZW5cIjogXCJHb2xhbnRhIENsZWFyaW5nXCIsIFwiZnJcIjogXCJDbGFpcmnDqHJlIGRlIEdvbGFudGFcIiwgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIiwgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IFwiNVwiLCBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLCBcImZyXCI6IFwiTW9udMOpZSBkZSBQYW5nbG9zc1wiLCBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiBcIjZcIiwgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIiwgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiLCBcImVzXCI6IFwiQ2xhcm8gRXNwZWxkaWFcIiwgXCJkZVwiOiBcIlNwZWxkYW4gS2FobHNjaGxhZ1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogXCI3XCIsIFwiZW5cIjogXCJEYW5lbG9uIFBhc3NhZ2VcIiwgXCJmclwiOiBcIlBhc3NhZ2UgRGFuZWxvblwiLCBcImVzXCI6IFwiUGFzYWplIERhbmVsb25cIiwgXCJkZVwiOiBcIkRhbmVsb24tUGFzc2FnZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogXCI4XCIsIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiLCBcImVzXCI6IFwiQm9zcXVlcyBDbGFyb3NvbWJyYVwiLCBcImRlXCI6IFwiVW1iZXJsaWNodHVuZy1Gb3JzdFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogXCI5XCIsIFwiZW5cIjogXCJTdG9uZW1pc3QgQ2FzdGxlXCIsIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiLCBcImVzXCI6IFwiQ2FzdGlsbG8gUGllZHJhbmllYmxhXCIsIFwiZGVcIjogXCJTY2hsb3NzIFN0ZWlubmViZWxcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiBcIjEwXCIsIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLCBcImZyXCI6IFwiQ2FycmnDqHJlIGRlcyB2b2xldXJzXCIsIFwiZXNcIjogXCJDYW50ZXJhIGRlbCBQw61jYXJvXCIsIFwiZGVcIjogXCJTY2h1cmtlbmJydWNoXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogXCIxMVwiLCBcImVuXCI6IFwiQWxkb24ncyBMZWRnZVwiLCBcImZyXCI6IFwiQ29ybmljaGUgZCdBbGRvblwiLCBcImVzXCI6IFwiQ29ybmlzYSBkZSBBbGRvblwiLCBcImRlXCI6IFwiQWxkb25zIFZvcnNwcnVuZ1wifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IFwiMTJcIiwgXCJlblwiOiBcIldpbGRjcmVlayBSdW5cIiwgXCJmclwiOiBcIlBpc3RlIGR1IFJ1aXNzZWF1IHNhdXZhZ2VcIiwgXCJlc1wiOiBcIlBpc3RhIEFycm95b3NhbHZhamVcIiwgXCJkZVwiOiBcIldpbGRiYWNoc3RyZWNrZVwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IFwiMTNcIiwgXCJlblwiOiBcIkplcnJpZmVyJ3MgU2xvdWdoXCIsIFwiZnJcIjogXCJCb3VyYmllciBkZSBKZXJyaWZlclwiLCBcImVzXCI6IFwiQ2VuYWdhbCBkZSBKZXJyaWZlclwiLCBcImRlXCI6IFwiSmVycmlmZXJzIFN1bXBmbG9jaFwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IFwiMTRcIiwgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLCBcImZyXCI6IFwiUGV0aXQgcmF2aW4gZGUgS2xvdmFuXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBLbG92YW5cIiwgXCJkZVwiOiBcIktsb3Zhbi1TZW5rZVwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IFwiMTVcIiwgXCJlblwiOiBcIkxhbmdvciBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIiwgXCJkZVwiOiBcIkxhbmdvciAtIFNjaGx1Y2h0XCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogXCIxNlwiLCBcImVuXCI6IFwiUXVlbnRpbiBMYWtlXCIsIFwiZnJcIjogXCJMYWMgUXVlbnRpblwiLCBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsIFwiZGVcIjogXCJRdWVudGluc2VlXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogXCIxN1wiLCBcImVuXCI6IFwiTWVuZG9uJ3MgR2FwXCIsIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCIsIFwiZXNcIjogXCJaYW5qYSBkZSBNZW5kb25cIiwgXCJkZVwiOiBcIk1lbmRvbnMgU3BhbHRcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiBcIjE4XCIsIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiLCBcImVzXCI6IFwiUGFzbyBBbnphbGlhc1wiLCBcImRlXCI6IFwiQW56YWxpYXMtUGFzc1wifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IFwiMTlcIiwgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIiwgXCJmclwiOiBcIlBlcmPDqWUgZGUgR2FyZG9ncmVcIiwgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLCBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogXCIyMFwiLCBcImVuXCI6IFwiVmVsb2thIFNsb3BlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBWZWxva2FcIiwgXCJlc1wiOiBcIlBlbmRpZW50ZSBWZWxva2FcIiwgXCJkZVwiOiBcIlZlbG9rYS1IYW5nXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogXCIyMVwiLCBcImVuXCI6IFwiRHVyaW9zIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLCBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogXCIyMlwiLCBcImVuXCI6IFwiQnJhdm9zdCBFc2NhcnBtZW50XCIsIFwiZnJcIjogXCJGYWxhaXNlIGRlIEJyYXZvc3RcIiwgXCJlc1wiOiBcIkVzY2FycGFkdXJhIEJyYXZvc3RcIiwgXCJkZVwiOiBcIkJyYXZvc3QtQWJoYW5nXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogXCIyM1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiBcIjI0XCIsIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVuc2VcIiwgXCJmclwiOiBcIkZpZWYgZHUgY2hhbXBpb25cIiwgXCJlc1wiOiBcIkRvbWluaW8gZGVsIENhbXBlw7NuXCIsIFwiZGVcIjogXCJMYW5kZ3V0IGRlcyBDaGFtcGlvbnNcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiBcIjI1XCIsIFwiZW5cIjogXCJSZWRicmlhclwiLCBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiLCBcImVzXCI6IFwiWmFyemFycm9qYVwiLCBcImRlXCI6IFwiUm90ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiBcIjI2XCIsIFwiZW5cIjogXCJHcmVlbmxha2VcIiwgXCJmclwiOiBcIkxhYyBWZXJ0XCIsIFwiZXNcIjogXCJMYWdvdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc2VlXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogXCIyN1wiLCBcImVuXCI6IFwiQXNjZW5zaW9uIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiLCBcImVzXCI6IFwiQmFow61hIGRlIGxhIEFzY2Vuc2nDs25cIiwgXCJkZVwiOiBcIkJ1Y2h0IGRlcyBBdWZzdGllZ3NcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiBcIjI4XCIsIFwiZW5cIjogXCJEYXduJ3MgRXlyaWVcIiwgXCJmclwiOiBcIlByb21vbnRvaXJlIGRlIGwnYXViZVwiLCBcImVzXCI6IFwiQWd1aWxlcmEgZGVsIEFsYmFcIiwgXCJkZVwiOiBcIkhvcnN0IGRlciBNb3JnZW5kYW1tZXJ1bmdcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiBcIjI5XCIsIFwiZW5cIjogXCJUaGUgU3Bpcml0aG9sbWVcIiwgXCJmclwiOiBcIkwnYW50cmUgZGVzIGVzcHJpdHNcIiwgXCJlc1wiOiBcIkxhIElzbGV0YSBFc3Bpcml0dWFsXCIsIFwiZGVcIjogXCJEZXIgR2Vpc3RlcmhvbG1cIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiBcIjMwXCIsIFwiZW5cIjogXCJXb29kaGF2ZW5cIiwgXCJmclwiOiBcIkdlbnRlc3lsdmVcIiwgXCJlc1wiOiBcIlJlZnVnaW8gRm9yZXN0YWxcIiwgXCJkZVwiOiBcIldhbGQgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiBcIjMxXCIsIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdBc2thbGlvblwiLCBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLCBcImRlXCI6IFwiQXNrYWxpb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiBcIjMyXCIsIFwiZW5cIjogXCJFdGhlcm9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0V0aGVyb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgRXRoZXJvblwiLCBcImRlXCI6IFwiRXRoZXJvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IFwiMzNcIiwgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZXMgcsOqdmVzXCIsIFwiZXNcIjogXCJCYWjDrWEgT27DrXJpY2FcIiwgXCJkZVwiOiBcIlRyYXVtYnVjaHRcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiBcIjM0XCIsIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgdmFpbnF1ZXVyXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgVmVuY2Vkb3JcIiwgXCJkZVwiOiBcIlNpZWdlciAtIEjDvHR0ZVwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IFwiMzVcIiwgXCJlblwiOiBcIkdyZWVuYnJpYXJcIiwgXCJmclwiOiBcIlZlcnRlYnJhbmNoZVwiLCBcImVzXCI6IFwiWmFyemF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zdHJhdWNoXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogXCIzNlwiLCBcImVuXCI6IFwiQmx1ZWxha2VcIiwgXCJmclwiOiBcIkxhYyBibGV1XCIsIFwiZXNcIjogXCJMYWdvYXp1bFwiLCBcImRlXCI6IFwiQmxhdXNlZVwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IFwiMzdcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogXCIzOFwiLCBcImVuXCI6IFwiTG9uZ3ZpZXdcIiwgXCJmclwiOiBcIkxvbmd1ZXZ1ZVwiLCBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIiwgXCJkZVwiOiBcIldlaXRzaWNodFwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IFwiMzlcIiwgXCJlblwiOiBcIlRoZSBHb2Rzd29yZFwiLCBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIiwgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsIFwiZGVcIjogXCJEYXMgR290dHNjaHdlcnRcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiBcIjQwXCIsIFwiZW5cIjogXCJDbGlmZnNpZGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIGZhbGFpc2VcIiwgXCJlc1wiOiBcIkRlc3Blw7FhZGVyb1wiLCBcImRlXCI6IFwiRmVsc3dhbmRcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiBcIjQxXCIsIFwiZW5cIjogXCJTaGFkYXJhbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZGUgU2hhZGFyYW5cIiwgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIiwgXCJkZVwiOiBcIlNoYWRhcmFuIEjDvGdlbFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IFwiNDJcIiwgXCJlblwiOiBcIlJlZGxha2VcIiwgXCJmclwiOiBcIlJvdWdlbGFjXCIsIFwiZXNcIjogXCJMYWdvcnJvam9cIiwgXCJkZVwiOiBcIlJvdHNlZVwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IFwiNDNcIiwgXCJlblwiOiBcIkhlcm8ncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgSMOpcm9zXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgSMOpcm9lXCIsIFwiZGVcIjogXCJIw7x0dGUgZGVzIEhlbGRlblwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IFwiNDRcIiwgXCJlblwiOiBcIkRyZWFkZmFsbCBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCIsIFwiZXNcIjogXCJCYWjDrWEgU2FsdG8gQWNpYWdvXCIsIFwiZGVcIjogXCJTY2hyZWNrZW5zZmFsbCAtIEJ1Y2h0XCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogXCI0NVwiLCBcImVuXCI6IFwiQmx1ZWJyaWFyXCIsIFwiZnJcIjogXCJCcnV5YXp1clwiLCBcImVzXCI6IFwiWmFyemF6dWxcIiwgXCJkZVwiOiBcIkJsYXVkb3Juc3RyYXVjaFwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IFwiNDZcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogXCI0N1wiLCBcImVuXCI6IFwiU3VubnloaWxsXCIsIFwiZnJcIjogXCJDb2xsaW5lIGVuc29sZWlsbMOpZVwiLCBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIiwgXCJkZVwiOiBcIlNvbm5lbmxpY2h0aMO8Z2VsXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogXCI0OFwiLCBcImVuXCI6IFwiRmFpdGhsZWFwXCIsIFwiZnJcIjogXCJGZXJ2ZXVyXCIsIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLCBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiBcIjQ5XCIsIFwiZW5cIjogXCJCbHVldmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBibGV1dmFsXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLCBcImRlXCI6IFwiQmxhdXRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogXCI1MFwiLCBcImVuXCI6IFwiQmx1ZXdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXp1bFwiLCBcImRlXCI6IFwiQmxhdXdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogXCI1MVwiLCBcImVuXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJmclwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZXNcIjogXCJJc2xldGEgQXN0cmFsXCIsIFwiZGVcIjogXCJBc3RyYWxob2xtXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogXCI1MlwiLCBcImVuXCI6IFwiQXJhaCdzIEhvcGVcIiwgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIiwgXCJlc1wiOiBcIkVzcGVyYW56YSBkZSBBcmFoXCIsIFwiZGVcIjogXCJBcmFocyBIb2ZmbnVuZ1wifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IFwiNTNcIiwgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCIsIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIFZhbGxldmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xudGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiBcIjU0XCIsIFwiZW5cIjogXCJGb2doYXZlblwiLCBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiLCBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIiwgXCJkZVwiOiBcIk5lYmVsIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogXCI1NVwiLCBcImVuXCI6IFwiUmVkd2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZGUgUnViaWNvblwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIiwgXCJkZVwiOiBcIlJvdHdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogXCI1NlwiLCBcImVuXCI6IFwiVGhlIFRpdGFucGF3XCIsIFwiZnJcIjogXCJCcmFzIGR1IHRpdGFuXCIsIFwiZXNcIjogXCJMYSBHYXJyYSBkZWwgVGl0w6FuXCIsIFwiZGVcIjogXCJEaWUgVGl0YW5lbnByYW5rZVwifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IFwiNTdcIiwgXCJlblwiOiBcIkNyYWd0b3BcIiwgXCJmclwiOiBcIlNvbW1ldCBkZSBsJ2VzY2FycGVtZW50XCIsIFwiZXNcIjogXCJDdW1icmVwZcOxYXNjb1wiLCBcImRlXCI6IFwiRmVsc2Vuc3BpdHplXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogXCI1OFwiLCBcImVuXCI6IFwiR29kc2xvcmVcIiwgXCJmclwiOiBcIkRpdmluYXRpb25cIiwgXCJlc1wiOiBcIlNhYmlkdXLDrWEgZGUgbG9zIERpb3Nlc1wiLCBcImRlXCI6IFwiR8O2dHRlcmt1bmRlXCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogXCI1OVwiLCBcImVuXCI6IFwiUmVkdmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWxyb3VnZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXJvam9cIiwgXCJkZVwiOiBcIlJvdHRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogXCI2MFwiLCBcImVuXCI6IFwiU3Rhcmdyb3ZlXCIsIFwiZnJcIjogXCJCb3NxdWV0IHN0ZWxsYWlyZVwiLCBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLCBcImRlXCI6IFwiU3Rlcm5lbmhhaW5cIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiBcIjYxXCIsIFwiZW5cIjogXCJHcmVlbndhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bndhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogXCI2MlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IFwiNjNcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiBcIjY0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogXCI2NVwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiBcIjY2XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogXCI2N1wiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IFwiNjhcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogXCI2OVwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IFwiNzBcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiBcIjcxXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogXCI3MlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IFwiNzNcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogXCI3NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IFwiNzVcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiBcIjc2XCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHR7XHJcblx0XHRcImtleVwiOiBcIkNlbnRlclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXRlcm5hbCBCYXR0bGVncm91bmRzXCIsXHJcblx0XHRcImFiYnJcIjogXCJFQkdcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMyxcclxuXHRcdFwiY29sb3JcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkNhc3RsZVwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbOV0sIFx0XHRcdFx0XHRcdFx0XHQvLyBzbVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlJlZCBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMSwgMTcsIDIwLCAxOCwgMTksIDYsIDVdLFx0XHQvLyBvdmVybG9vaywgbWVuZG9ucywgdmVsb2thLCBhbnosIG9ncmUsIHNwZWxkYW4sIHBhbmdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJCbHVlIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMiwgMTUsIDIyLCAxNiwgMjEsIDcsIDhdXHRcdFx0Ly8gdmFsbGV5LCBsYW5nb3IsIGJyYXZvc3QsIHF1ZW50aW4sIGR1cmlvcywgZGFuZSwgdW1iZXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJHcmVlbiBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszLCAxMSwgMTMsIDEyLCAxNCwgMTAsIDRdIFx0XHQvLyBsb3dsYW5kcywgYWxkb25zLCBqZXJyaWZlciwgd2lsZGNyZWVrLCBrbG92YW4sIHJvZ3VlcywgZ29sYW50YVxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJSZWRcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMCxcclxuXHRcdFwiY29sb3JcIjogXCJyZWRcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzcsIDMzLCAzMl0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszOCwgNDAsIDM5LCA1MiwgNTFdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzUsIDM2LCAzNCwgNTMsIDUwXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzYyLCA2MywgNjQsIDY1LCA2Nl0gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJCbHVcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMixcclxuXHRcdFwiY29sb3JcIjogXCJibHVlXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyMywgMjcsIDMxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzAsIDI4LCAyOSwgNTgsIDYwXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyNSwgMjYsIDI0LCA1OSwgNjFdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGNoYW1wLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzEsIDcwLCA2OSwgNjgsIDY3XSBcdFx0XHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiR3JuXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDEsXHJcblx0XHRcImNvbG9yXCI6IFwiZ3JlZW5cIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NiwgNDQsIDQxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ3LCA1NywgNTYsIDQ4LCA1NF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDUsIDQyLCA0MywgNDksIDU1XSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzc2ICwgNzUgLCA3NCAsIDczICwgNzIgXSBcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXVxyXG5cdH0sXHJcbl07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdC8vXHRFQkdcclxuXHRcIjlcIjpcdHtcInR5cGVcIjogMSwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMCwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU3RvbmVtaXN0IENhc3RsZVxyXG5cclxuXHQvL1x0UmVkIENvcm5lclxyXG5cdFwiMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBSZWQgS2VlcCAtIE92ZXJsb29rXHJcblx0XCIxN1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBNZW5kb24ncyBHYXBcclxuXHRcIjIwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIFZlbG9rYSBTbG9wZVxyXG5cdFwiMThcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gQW56YWxpYXMgUGFzc1xyXG5cdFwiMTlcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gT2dyZXdhdGNoIEN1dFxyXG5cdFwiNlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgQ2FtcCAtIE1pbGwgLSBTcGVsZGFuXHJcblx0XCI1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBDYW1wIC0gTWluZSAtIFBhbmdsb3NzXHJcblxyXG5cdC8vXHRCbHVlIENvcm5lclxyXG5cdFwiMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIEtlZXAgLSBWYWxsZXlcclxuXHRcIjE1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBMYW5nb3IgR3VsY2hcclxuXHRcIjIyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBCcmF2b3N0IEVzY2FycG1lbnRcclxuXHRcIjE2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBRdWVudGluIExha2VcclxuXHRcIjIxXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBEdXJpb3MgR3VsY2hcclxuXHRcIjdcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBDYW1wIC0gTWluZSAtIERhbmVsb25cclxuXHRcIjhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBDYW1wIC0gTWlsbCAtIFVtYmVyZ2xhZGVcclxuXHJcblx0Ly9cdEdyZWVuIENvcm5lclxyXG5cdFwiM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBLZWVwIC0gTG93bGFuZHNcclxuXHRcIjExXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gQWxkb25zXHJcblx0XCIxM1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEplcnJpZmVyJ3MgU2xvdWdoXHJcblx0XCIxMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIFdpbGRjcmVla1xyXG5cdFwiMTRcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBLbG92YW4gR3VsbHlcclxuXHRcIjEwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIENhbXAgLSBNaW5lIC0gUm9ndWVzIFF1YXJyeVxyXG5cdFwiNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBDYW1wIC0gTWlsbCAtIEdvbGFudGFcclxuXHJcblxyXG5cdC8vXHRSZWRIb21lXHJcblx0XCIzN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMzNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYW1pbmcgQmF5XHJcblx0XCIzMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEV0aGVyb24gSGlsbHNcclxuXHRcIjM4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gTG9uZ3ZpZXdcclxuXHRcIjQwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ2xpZmZzaWRlXHJcblx0XCIzOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBHb2Rzd29yZFxyXG5cdFwiNTJcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBBcmFoJ3MgSG9wZVxyXG5cdFwiNTFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBBc3RyYWxob2xtZVxyXG5cclxuXHRcIjM1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gR3JlZW5icmlhclxyXG5cdFwiMzZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBCbHVlbGFrZVxyXG5cdFwiMzRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBWaWN0b3IncyBMb2RnZVxyXG5cdFwiNTNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gR3JlZW52YWxlIFJlZnVnZVxyXG5cdFwiNTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEJsdWV3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEdyZWVuSG9tZVxyXG5cdFwiNDZcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjQ0XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFkZmFsbCBCYXlcclxuXHRcIjQxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gU2hhZGFyYW4gSGlsbHNcclxuXHRcIjQ3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gU3VubnloaWxsXHJcblx0XCI1N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENyYWd0b3BcclxuXHRcIjU2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFRpdGFucGF3XHJcblx0XCI0OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEZhaXRobGVhcFxyXG5cdFwiNTRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBGb2doYXZlblxyXG5cclxuXHRcIjQ1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gQmx1ZWJyaWFyXHJcblx0XCI0MlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIFJlZGxha2VcclxuXHRcIjQzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gSGVybydzIExvZGdlXHJcblx0XCI0OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBCbHVldmFsZSBSZWZ1Z2VcclxuXHRcIjU1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBSZWR3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEJsdWVIb21lXHJcblx0XCIyM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMjdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gQXNjZW5zaW9uIEJheVxyXG5cdFwiMzFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBBc2thbGlvbiBIaWxsc1xyXG5cdFwiMzBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBXb29kaGF2ZW5cclxuXHRcIjI4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gRGF3bidzIEV5cmllXHJcblx0XCIyOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBTcGlyaXRob2xtZVxyXG5cdFwiNThcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBHb2RzbG9yZVxyXG5cdFwiNjBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBTdGFyZ3JvdmVcclxuXHJcblx0XCIyNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIFJlZGJyaWFyXHJcblx0XCIyNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEdyZWVubGFrZVxyXG5cdFwiMjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBDaGFtcGlvbidzIERlbWVuc2VcclxuXHRcIjU5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIFJlZHZhbGUgUmVmdWdlXHJcblx0XCI2MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gR3JlZW53YXRlciBMb3dsYW5kc1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJuYW1lXCI6IFwiR3JlZW4gTWlsbFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJuYW1lXCI6IFwiUmVkIE1pbmVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwibmFtZVwiOiBcIlJlZCBNaWxsXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcIm5hbWVcIjogXCJCbHVlIE1pbmVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwibmFtZVwiOiBcIkJsdWUgTWlsbFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJuYW1lXCI6IFwiQ2FzdGxlXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogMTAsIFwibmFtZVwiOiBcIkdyZWVuIE1pbmVcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiAxMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiAxMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiAxMywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiAxNCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiAxNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiAxNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiAxNywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiAxOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiAxOSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiAyMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiAyMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiAyMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiAyMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IDI1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IDI0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogMjYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogMjcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiAyOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiAyOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IDMwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IDMxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogMzIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiAzMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IDM0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogMzUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogMzYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogMzcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiAzOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiAzOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IDQwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IDQxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogNDIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogNDMsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiA0NCwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IDQ1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IDQ2LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogNDcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogNDgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IDQ5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IDUwLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiA1MSwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiA1MiwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogNTMsIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogNTQsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogNTUsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IDU2LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogNTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogNTgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IDU5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IDYwLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IDYxLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiA2MiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiA2MywgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IDY0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiA2NSwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiA2NiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IDY3LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogNjgsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogNjksIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IDcwLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogNzEsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogNzIsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiA3MywgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiA3NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogNzUsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiA3NiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAzNSwgXCJuYW1lXCI6IFwiY2FzdGxlXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMjUsIFwibmFtZVwiOiBcImtlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAxMCwgXCJuYW1lXCI6IFwidG93ZXJcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiA1LCBcIm5hbWVcIjogXCJjYW1wXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwidGVtcGxlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiaG9sbG93XCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiZXN0YXRlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwib3Zlcmxvb2tcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJhc2NlbnRcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbWJvc3NmZWxzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFtYm9zc2ZlbHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbnZpbCBSb2NrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFudmlsLXJvY2tcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBZdW5xdWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwteXVucXVlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGVyIGRlIGwnZW5jbHVtZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZXItZGUtbGVuY2x1bWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkpha2JpZWd1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFrYmllZ3VuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIllhaydzIEJlbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwieWFrcy1iZW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVjbGl2ZSBkZWwgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlY2xpdmUtZGVsLXlha1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvdXJiZSBkdSBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY291cmJlLWR1LXlha1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlbnJhdmlzIEVyZHdlcmtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVucmF2aXMtZXJkd2Vya1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlbmdlIG9mIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVuZ2Utb2YtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDrXJjdWxvIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2lyY3Vsby1kZS1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvbWxlY2ggZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9tbGVjaC1kZS1kZW5yYXZpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSG9jaG9mZW4gZGVyIEJldHLDvGJuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaG9jaG9mZW4tZGVyLWJldHJ1Ym5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNvcnJvdydzIEZ1cm5hY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic29ycm93cy1mdXJuYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhZ3VhIGRlbCBQZXNhclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmcmFndWEtZGVsLXBlc2FyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm91cm5haXNlIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm91cm5haXNlLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUb3IgZGVzIElycnNpbm5zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRvci1kZXMtaXJyc2lubnNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYXRlIG9mIE1hZG5lc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2F0ZS1vZi1tYWRuZXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhIGRlIGxhIExvY3VyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGEtZGUtbGEtbG9jdXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGUgZGUgbGEgZm9saWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGUtZGUtbGEtZm9saWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgRXNwZW53YWxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtZXNwZW53YWxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFRyZW1ibGVmb3LDqnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC10cmVtYmxlZm9yZXRcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeS1CdWNodFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1idWNodFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5IEJheVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1iYXlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtZWhtcnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGQnRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZWhtcnlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaW5zdGVyZnJlaXN0YXR0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpbnN0ZXJmcmVpc3RhdHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEYXJraGF2ZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGFya2hhdmVuXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBPc2N1cm9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1vc2N1cm9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2Ugbm9pclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2Utbm9pclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlaWxpZ2UgSGFsbGUgdm9uIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVpbGlnZS1oYWxsZS12b24tcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dW0gb2YgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVtLW9mLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYWdyYXJpbyBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhZ3JhcmlvLWRlLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVhaXJlIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1YWlyZS1kZS1yYWxsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFudGhpci1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYW50aGlyLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsZSBvZiBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGUtb2YtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWRlLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtamFudGhpclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lZXIgZGVzIExlaWRzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lZXItZGVzLWxlaWRzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhIG9mIFNvcnJvd3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhLW9mLXNvcnJvd3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbCBNYXIgZGUgbG9zIFBlc2FyZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWwtbWFyLWRlLWxvcy1wZXNhcmVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTsO2cmRsaWNoZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9yZGxpY2hlLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vcnRoZXJuIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcnRoZXJuLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGljb3Nlc2NhbG9mcmlhbnRlcyBkZWwgTm9ydGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGljb3Nlc2NhbG9mcmlhbnRlcy1kZWwtbm9ydGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDaW1lZnJvaWRlcyBub3JkaXF1ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2ltZWZyb2lkZXMtbm9yZGlxdWVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyenRvclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6dG9yXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2tnYXRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrZ2F0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YW5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGVub2lyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZW5vaXJlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhY2hlbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWNoZW5icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWdvbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWdvbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyY2EgZGVsIERyYWfDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyY2EtZGVsLWRyYWdvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0aWdtYXRlIGR1IGRyYWdvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdGlnbWF0ZS1kdS1kcmFnb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbi1UZXJyYXNzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFzc2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24gVGVycmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJhemEgZGUgRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRlcnJhemEtZGUtZXJlZG9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhdGVhdSBkJ0VyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF0ZWF1LWRlcmVkb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLbGFnZW5yaXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtsYWdlbnJpc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIG9mIFdvZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLW9mLXdvZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3VyYSBkZSBsYSBBZmxpY2Npw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3VyYS1kZS1sYS1hZmxpY2Npb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIGR1IG1hbGhldXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1kdS1tYWxoZXVyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6Zmx1dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6Zmx1dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrdGlkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja3RpZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJlYSBOZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJlYS1uZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vaXJmbG90XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vaXJmbG90XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW50ZXJ3ZWx0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVudGVyd2VsdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVuZGVyd29ybGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW5kZXJ3b3JsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkluZnJhbXVuZG9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaW5mcmFtdW5kb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk91dHJlLW1vbmRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm91dHJlLW1vbmRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVybmUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcm5lLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZhciBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmYXItc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMZWphbmFzIFBpY29zZXNjYWxvZnJpYW50ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGVqYW5hcy1waWNvc2VzY2Fsb2ZyaWFudGVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTG9pbnRhaW5lcyBDaW1lZnJvaWRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsb2ludGFpbmVzLWNpbWVmcm9pZGVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lbiB2b24gU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lbi12b24tc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbnMgb2YgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5zLW9mLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5hcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmFzLWRlLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVzLWRlLXN1cm1pYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlZW1hbm5zcmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWVtYW5uc3Jhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWFmYXJlcidzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhZmFyZXJzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIGRlbCBWaWFqYW50ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLWRlbC12aWFqYW50ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGR1IE1hcmluXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWR1LW1hcmluXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbi1QbGF0elwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1wbGF0elwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuIFNxdWFyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1zcXVhcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS1waWtlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLXBpa2VuXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGljaHR1bmcgZGVyIE1vcmdlbnLDtnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxpY2h0dW5nLWRlci1tb3JnZW5yb3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVyb3JhIEdsYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1cm9yYS1nbGFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYXJvIGRlIGxhIEF1cm9yYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFyby1kZS1sYS1hdXJvcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFpcmnDqHJlIGRlIGwnYXVyb3JlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYWlyaWVyZS1kZS1sYXVyb3JlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlbWVlciBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGVtZWVyLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBTZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXNlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyLWRlLWphZGUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZS1qYWRlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haC1QbGF0eiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtcGxhdHotZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoIFNxdWFyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtc3F1YXJlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtZGUtdml6dW5haC1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhdWJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGF1YmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBcmJvcnN0b25lIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXJib3JzdG9uZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZWRyYSBBcmLDs3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZWRyYS1hcmJvcmVhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllcnJlIEFyYm9yZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVycmUtYXJib3JlYS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmx1c3N1ZmVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmx1c3N1ZmVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUml2ZXJzaWRlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicml2ZXJzaWRlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmliZXJhIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmliZXJhLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHJvdmluY2VzIGZsdXZpYWxlcyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInByb3ZpbmNlcy1mbHV2aWFsZXMtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYWZlbHMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYWZlbHMtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYSBSZWFjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hLXJlYWNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2HDscOzbiBkZSBFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbm9uLWRlLWVsb25hLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmllZiBkJ0Vsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmllZi1kZWxvbmEtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXItU2VlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1zZWUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyIExha2UgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLWxha2UtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWdvIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWdvLWRyYWtrYXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWMgRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhYy1kcmFra2FyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyc3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnN1bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXIncyBTb3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnMtc291bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFc3RyZWNobyBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlc3RyZWNoby1kZS1taWxsZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6l0cm9pdCBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXRyb2l0LWRlLW1pbGxlci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2gtQnVjaHQgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYnVjaHQtc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2ggQmF5IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJheS1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBCYXJ1Y2ggW0VTXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1iYXJ1Y2gtZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGRlIEJhcnVjaCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGUtYmFydWNoLXNwXCJcclxuXHRcdH1cclxuXHR9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRsYW5nczogcmVxdWlyZSgnLi9kYXRhL2xhbmdzJyksXHJcblx0d29ybGRzOiByZXF1aXJlKCcuL2RhdGEvd29ybGRfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfbmFtZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfdHlwZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfdHlwZXMnKSxcclxuXHRvYmplY3RpdmVfbWV0YTogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tZXRhJyksXHJcblx0b2JqZWN0aXZlX2xhYmVsczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9sYWJlbHMnKSxcclxuXHRvYmplY3RpdmVfbWFwOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21hcCcpLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hXb3JsZCA9IHJlcXVpcmUoJy4vTWF0Y2hXb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSwgbmV4dFByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSk7XHJcblx0XHRjb25zdCBuZXdNYXRjaCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaC5nZXQoXCJzdGFydFRpbWVcIiksIG5leHRQcm9wcy5tYXRjaC5nZXQoXCJzdGFydFRpbWVcIikpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld01hdGNoIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2g6OnJlbmRlcigpJywgcHJvcHMubWF0Y2gudG9KUygpKTtcclxuXHJcblx0XHRjb25zdCB3b3JsZENvbG9ycyA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXTtcclxuXHJcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtYXRjaENvbnRhaW5lclwiPlxyXG5cdFx0XHQ8dGFibGUgY2xhc3NOYW1lPVwibWF0Y2hcIj5cclxuXHRcdFx0XHR7d29ybGRDb2xvcnMubWFwKChjb2xvciwgaXhDb2xvcikgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcblx0XHRcdFx0XHRjb25zdCB3b3JsZElkID0gcHJvcHMubWF0Y2guZ2V0KHdvcmxkS2V5KS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0Y29uc3Qgd29ybGQgPSBwcm9wcy53b3JsZHMuZ2V0KHdvcmxkSWQpO1xyXG5cdFx0XHRcdFx0Y29uc3Qgc2NvcmVzID0gcHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gPE1hdGNoV29ybGRcclxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PSd0cidcclxuXHRcdFx0XHRcdFx0a2V5PXt3b3JsZElkfVxyXG5cclxuXHRcdFx0XHRcdFx0d29ybGQ9e3dvcmxkfVxyXG5cdFx0XHRcdFx0XHRzY29yZXM9e3Njb3Jlc31cclxuXHJcblx0XHRcdFx0XHRcdGNvbG9yPXtjb2xvcn1cclxuXHRcdFx0XHRcdFx0aXhDb2xvcj17aXhDb2xvcn1cclxuXHRcdFx0XHRcdFx0c2hvd1BpZT17aXhDb2xvciA9PT0gMH1cclxuXHRcdFx0XHRcdC8+O1xyXG5cdFx0XHRcdH0pfVxyXG5cdFx0XHQ8L3RhYmxlPlxyXG5cdFx0PC9kaXY+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXRjaC5wcm9wVHlwZXMgPSB7XHJcblx0bWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2g7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZSA9IHJlcXVpcmUoJy4vU2NvcmUnKTtcclxuY29uc3QgUGllID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL1BpZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXRjaFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2NvcmVzLCBuZXh0UHJvcHMuc2NvcmVzKTtcclxuXHRcdGNvbnN0IG5ld0NvbG9yID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld0NvbG9yIHx8IG5ld1dvcmxkKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoV29ybGRzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgbmV3U2NvcmVzLCBuZXdDb2xvciwgbmV3V29ybGQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoV29ybGRzOjpyZW5kZXIoKScpO1xyXG5cclxuXHRcdHJldHVybiA8dHI+XHJcblx0XHRcdDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtwcm9wcy5jb2xvcn1gfT5cclxuXHRcdFx0XHQ8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+e3Byb3BzLndvcmxkLmdldCgnbmFtZScpfTwvYT5cclxuXHRcdFx0PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzTmFtZT17YHRlYW0gc2NvcmUgJHtwcm9wcy5jb2xvcn1gfT5cclxuXHRcdFx0XHQ8U2NvcmVcclxuXHRcdFx0XHRcdHRlYW09e3Byb3BzLmNvbG9yfVxyXG5cdFx0XHRcdFx0c2NvcmU9e3Byb3BzLnNjb3Jlcy5nZXQocHJvcHMuaXhDb2xvcil9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0PC90ZD5cclxuXHRcdFx0eyhwcm9wcy5zaG93UGllKVxyXG5cdFx0XHRcdD8gPHRkIHJvd1NwYW49XCIzXCIgY2xhc3NOYW1lPVwicGllXCI+XHJcblx0XHRcdFx0XHQ8UGllXHJcblx0XHRcdFx0XHRcdHNjb3Jlcz17cHJvcHMuc2NvcmVzfVxyXG5cdFx0XHRcdFx0XHRzaXplPXs2MH1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0PC90ZD5cclxuXHRcdFx0XHQ6IG51bGxcclxuXHRcdFx0fVxyXG5cdFx0PC90cj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hdGNoV29ybGQucHJvcFR5cGVzID0ge1xyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRpeENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0c2hvd1BpZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCAkID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IG51bWVyYWwgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBTY29yZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7ZGlmZjogMH07XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdHJldHVybiAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoe2RpZmY6IG5leHRQcm9wcy5zY29yZSAtIHByb3BzLnNjb3JlfSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRpZihzdGF0ZS5kaWZmICE9PSAwKSB7XHJcblx0XHRcdGFuaW1hdGVTY29yZURpZmYodGhpcy5yZWZzLmRpZmYuZ2V0RE9NTm9kZSgpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0cmV0dXJuIDxkaXY+XHJcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImRpZmZcIiByZWY9XCJkaWZmXCI+e2dldERpZmZUZXh0KHN0YXRlLmRpZmYpfTwvc3Bhbj5cclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57Z2V0U2NvcmVUZXh0KHByb3BzLnNjb3JlKX08L3NwYW4+XHJcblx0XHQ8L2Rpdj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNjb3JlLnByb3BUeXBlcyA9IHtcclxuXHRzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NvcmU7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVNjb3JlRGlmZihlbCkge1xyXG5cdCQoZWwpXHJcblx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDB9KVxyXG5cdFx0LnZlbG9jaXR5KCdmYWRlSW4nLCB7ZHVyYXRpb246IDIwMH0pXHJcblx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDEyMDAsIGRlbGF5OiA0MDB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldERpZmZUZXh0KGRpZmYpIHtcclxuXHRyZXR1cm4gKGRpZmYpXHJcblx0XHQ/IG51bWVyYWwoZGlmZikuZm9ybWF0KCcrMCwwJylcclxuXHRcdDogbnVsbDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNjb3JlVGV4dChzY29yZSkge1xyXG5cdHJldHVybiAoc2NvcmUpXHJcblx0XHQ/IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJylcclxuXHRcdDogbnVsbDtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaCA9IHJlcXVpcmUoJy4vTWF0Y2gnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPHNwYW4gc3R5bGU9e3twYWRkaW5nTGVmdDogJy41ZW0nfX0+PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCIgLz48L3NwYW4+O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXRjaGVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdSZWdpb24gPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMucmVnaW9uLCBuZXh0UHJvcHMucmVnaW9uKTtcclxuXHRcdGNvbnN0IG5ld01hdGNoZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hlcywgbmV4dFByb3BzLm1hdGNoZXMpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UmVnaW9uIHx8IG5ld01hdGNoZXMgfHwgbmV3V29ybGRzKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywge3Nob3VsZFVwZGF0ZSwgbmV3UmVnaW9uLCBuZXdNYXRjaGVzLCBuZXdXb3JsZHN9KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdyZWdpb24nLCBwcm9wcy5yZWdpb24udG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknLCAnbWF0Y2hlcycsIHByb3BzLm1hdGNoZXMudG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknLCAnd29ybGRzJywgcHJvcHMud29ybGRzKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nUmVnaW9uTWF0Y2hlcyc+XHJcblx0XHRcdFx0PGgyPlxyXG5cdFx0XHRcdFx0e3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IE1hdGNoZXNcclxuXHRcdFx0XHRcdHshcHJvcHMubWF0Y2hlcy5zaXplID8gbG9hZGluZ0h0bWwgOiBudWxsfVxyXG5cdFx0XHRcdDwvaDI+XHJcblxyXG5cdFx0XHRcdHtwcm9wcy5tYXRjaGVzLm1hcChtYXRjaCA9PlxyXG5cdFx0XHRcdFx0PE1hdGNoXHJcblx0XHRcdFx0XHRcdGtleT17bWF0Y2guZ2V0KCdpZCcpfVxyXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J21hdGNoJ1xyXG5cclxuXHRcdFx0XHRcdFx0d29ybGRzPXtwcm9wcy53b3JsZHN9XHJcblx0XHRcdFx0XHRcdG1hdGNoPXttYXRjaH1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXRjaGVzLnByb3BUeXBlcyA9IHtcclxuXHRyZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0bWF0Y2hlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgUmVnaW9uV29ybGRzV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdXb3JsZCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnUmVnaW9uV29ybGRzV29ybGQ6OnJlbmRlcicsIHByb3BzLndvcmxkLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIDxsaT48YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+e3Byb3BzLndvcmxkLmdldCgnbmFtZScpfTwvYT48L2xpPjtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblJlZ2lvbldvcmxkc1dvcmxkLnByb3BUeXBlcyA9IHtcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlZ2lvbldvcmxkc1dvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgV29ybGQgPSByZXF1aXJlKCcuL1dvcmxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFdvcmxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG5cdFx0Y29uc3QgbmV3UmVnaW9uID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpLCBuZXh0UHJvcHMucmVnaW9uLmdldCgnd29ybGRzJykpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3UmVnaW9uKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OlJlZ2lvbldvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld0xhbmcsIG5ld1JlZ2lvbik7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6V29ybGRzOjpyZW5kZXIoKScsIHByb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyksIHByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJSZWdpb25Xb3JsZHNcIj5cclxuXHRcdFx0XHQ8aDI+e3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IFdvcmxkczwvaDI+XHJcblx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cclxuXHRcdFx0XHRcdHtwcm9wcy53b3JsZHMubWFwKHdvcmxkID0+XHJcblx0XHRcdFx0XHRcdDxXb3JsZFxyXG5cdFx0XHRcdFx0XHRcdGtleT17d29ybGQuZ2V0KCdpZCcpfVxyXG5cdFx0XHRcdFx0XHRcdHdvcmxkPXt3b3JsZH1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdCl9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Xb3JsZHMucHJvcFR5cGVzID0ge1xyXG5cdHJlZ2lvbjogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5TZXEpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGFwaSA9IHJlcXVpcmUoJ2xpYi9hcGknKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaGVzID0gcmVxdWlyZSgnLi9NYXRjaGVzJyk7XHJcbmNvbnN0IFdvcmxkcyA9IHJlcXVpcmUoJy4vV29ybGRzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBPdmVydmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLm1vdW50ZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy50aW1lb3V0cyA9IHt9O1xyXG5cclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdHJlZ2lvbnM6IEltbXV0YWJsZS5mcm9tSlMoe1xyXG5cdFx0XHRcdCcxJzoge2xhYmVsOiAnTkEnLCBpZDogJzEnfSxcclxuXHRcdFx0XHQnMic6IHtsYWJlbDogJ0VVJywgaWQ6ICcyJ30sXHJcblx0XHRcdH0pLFxyXG5cclxuXHRcdFx0bWF0Y2hlc0J5UmVnaW9uOiBJbW11dGFibGUuZnJvbUpTKHsnMSc6e30sICcyJzp7fX0pLFxyXG5cdFx0XHR3b3JsZHNCeVJlZ2lvbjogSW1tdXRhYmxlLmZyb21KUyh7JzEnOnt9LCAnMic6e319KSxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld01hdGNoRGF0YSA9ICFJbW11dGFibGUuaXMoc3RhdGUubWF0Y2hlc0J5UmVnaW9uLCBuZXh0U3RhdGUubWF0Y2hlc0J5UmVnaW9uKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nICB8fCBuZXdNYXRjaERhdGEpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCB7c2hvdWxkVXBkYXRlLCBuZXdMYW5nLCBuZXdNYXRjaERhdGF9KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcblx0XHRzZXRQYWdlVGl0bGUuY2FsbCh0aGlzLCB0aGlzLnByb3BzLmxhbmcpO1xyXG5cdFx0c2V0V29ybGRzLmNhbGwodGhpcywgdGhpcy5wcm9wcy5sYW5nKTtcclxuXHJcblx0XHRnZXREYXRhLmNhbGwodGhpcyk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcblx0XHRzZXRQYWdlVGl0bGUuY2FsbCh0aGlzLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRzZXRXb3JsZHMuY2FsbCh0aGlzLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG5cdFx0dGhpcy5tb3VudGVkID0gZmFsc2U7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0cy5tYXRjaERhdGEpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpyZW5kZXIoKScpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpyZW5kZXIoKScsICdsYW5nJywgcHJvcHMubGFuZy50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpyZW5kZXIoKScsICdyZWdpb25zJywgc3RhdGUucmVnaW9ucy50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpyZW5kZXIoKScsICdtYXRjaGVzQnlSZWdpb24nLCBzdGF0ZS5tYXRjaGVzQnlSZWdpb24udG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAnd29ybGRzQnlSZWdpb24nLCBzdGF0ZS53b3JsZHNCeVJlZ2lvbi50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiA8ZGl2IGlkPVwib3ZlcnZpZXdcIj5cclxuXHRcdFx0ezxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0e3N0YXRlLnJlZ2lvbnMubWFwKChyZWdpb24sIHJlZ2lvbklkKSA9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTJcIiBrZXk9e3JlZ2lvbklkfT5cclxuXHRcdFx0XHRcdFx0PE1hdGNoZXNcclxuXHRcdFx0XHRcdFx0XHRyZWdpb249e3JlZ2lvbn1cclxuXHRcdFx0XHRcdFx0XHRtYXRjaGVzPXtzdGF0ZS5tYXRjaGVzQnlSZWdpb24uZ2V0KHJlZ2lvbklkKX1cclxuXHRcdFx0XHRcdFx0XHR3b3JsZHM9e3N0YXRlLndvcmxkc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L2Rpdj59XHJcblxyXG5cdFx0XHQ8aHIgLz5cclxuXHJcblx0XHRcdHs8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdHtzdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcblx0XHRcdFx0XHRcdDxXb3JsZHNcclxuXHRcdFx0XHRcdFx0XHRyZWdpb249e3JlZ2lvbn1cclxuXHRcdFx0XHRcdFx0XHR3b3JsZHM9e3N0YXRlLndvcmxkc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L2Rpdj59XHJcblx0XHQ8L2Rpdj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk92ZXJ2aWV3LnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3ZlcnZpZXc7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREaXJlY3QgRE9NIE1hbmlwdWxhdGlvblxyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG5cdGxldCB0aXRsZSA9IFsnZ3cydzJ3LmNvbSddO1xyXG5cclxuXHRpZiAobGFuZy5nZXQoJ3NsdWcnKSAhPT0gJ2VuJykge1xyXG5cdFx0dGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuXHR9XHJcblxyXG5cdCQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGF0YVxyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdERhdGEgLSBXb3JsZHNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFdvcmxkcyhsYW5nKSB7XHJcblx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRjb25zdCBuZXdXb3JsZHNCeVJlZ2lvbiA9IEltbXV0YWJsZVxyXG5cdFx0LlNlcShTVEFUSUMud29ybGRzKVxyXG5cdFx0Lm1hcCh3b3JsZCA9PiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkpXHJcblx0XHQuc29ydEJ5KHdvcmxkID0+IHdvcmxkLmdldCgnbmFtZScpKVxyXG5cdFx0Lmdyb3VwQnkod29ybGQgPT4gd29ybGQuZ2V0KCdyZWdpb24nKSk7XHJcblxyXG5cdHNlbGYuc2V0U3RhdGUoe3dvcmxkc0J5UmVnaW9uOiBuZXdXb3JsZHNCeVJlZ2lvbn0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkQnlMYW5nKGxhbmcsIHdvcmxkKSB7XHJcblx0Y29uc3QgbGFuZ1NsdWcgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG5cclxuXHRjb25zdCB3b3JsZEJ5TGFuZyA9IHdvcmxkLmdldChsYW5nU2x1Zyk7XHJcblxyXG5cdGNvbnN0IHJlZ2lvbiA9IHdvcmxkLmdldCgncmVnaW9uJyk7XHJcblx0Y29uc3QgbGluayA9IGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGRCeUxhbmcpO1xyXG5cclxuXHRyZXR1cm4gd29ybGRCeUxhbmcubWVyZ2Uoe2xpbmssIHJlZ2lvbn0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuXHRyZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGQuZ2V0KCdzbHVnJyldLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHREYXRhIC0gTWF0Y2hlc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YSgpIHtcclxuXHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpnZXREYXRhKCknKTtcclxuXHJcblx0YXBpLmdldE1hdGNoZXMoKGVyciwgZGF0YSkgPT4ge1xyXG5cdFx0Y29uc3QgbWF0Y2hEYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhKTtcclxuXHJcblx0XHRpZiAoc2VsZi5tb3VudGVkKSB7XHJcblx0XHRcdGlmICghZXJyICYmIG1hdGNoRGF0YSAmJiAhbWF0Y2hEYXRhLmlzRW1wdHkoKSkge1xyXG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoZ2V0TWF0Y2hlc0J5UmVnaW9uLmJpbmQoc2VsZiwgbWF0Y2hEYXRhKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNldERhdGFUaW1lb3V0LmNhbGwoc2VsZik7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc0J5UmVnaW9uKG1hdGNoRGF0YSwgc3RhdGUpIHtcclxuXHRjb25zdCBuZXdNYXRjaGVzQnlSZWdpb24gPSBJbW11dGFibGVcclxuXHRcdC5TZXEobWF0Y2hEYXRhKVxyXG5cdFx0Lmdyb3VwQnkobWF0Y2ggPT4gbWF0Y2guZ2V0KFwicmVnaW9uXCIpLnRvU3RyaW5nKCkpO1xyXG5cclxuXHRyZXR1cm4ge21hdGNoZXNCeVJlZ2lvbjogc3RhdGUubWF0Y2hlc0J5UmVnaW9uLm1lcmdlRGVlcChuZXdNYXRjaGVzQnlSZWdpb24pfTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXREYXRhVGltZW91dCgpIHtcclxuXHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYudGltZW91dHMubWF0Y2hEYXRhID0gc2V0VGltZW91dChcclxuXHRcdGdldERhdGEuYmluZChzZWxmKSxcclxuXHRcdGdldEludGVydmFsKClcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEludGVydmFsKCkge1xyXG5cdHJldHVybiBfLnJhbmRvbSgyMDAwLCA0MDAwKTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJy4uL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuXHRlbGFwc2VkOiB0cnVlLFxyXG5cdHRpbWVzdGFtcDogdHJ1ZSxcclxuXHRtYXBBYmJyZXY6IHRydWUsXHJcblx0YXJyb3c6IHRydWUsXHJcblx0c3ByaXRlOiB0cnVlLFxyXG5cdG5hbWU6IHRydWUsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IGZhbHNlLFxyXG5cdGd1aWxkVGFnOiBmYWxzZSxcclxuXHR0aW1lcjogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEd1aWxkQ2xhaW1zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0NsYWltcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpLCBuZXh0UHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3Q2xhaW1zKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdDbGFpbXM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgZ3VpbGRJZCA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9pZCcpO1xyXG5cdFx0Y29uc3QgY2xhaW1zID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdDbGFpbXM6OnJlbmRlcigpJywgZ3VpbGRJZCk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJsaXN0LXVuc3R5bGVkXCI+XHJcblx0XHRcdFx0e2NsYWltcy5tYXAoZW50cnkgPT5cclxuXHRcdFx0XHRcdDxsaSBrZXk9e2VudHJ5LmdldCgnaWQnKX0+XHJcblx0XHRcdFx0XHRcdDxPYmplY3RpdmVcclxuXHRcdFx0XHRcdFx0XHRjb2xzPXtvYmplY3RpdmVDb2xzfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdFx0Z3VpbGRJZD17Z3VpbGRJZH1cclxuXHRcdFx0XHRcdFx0XHRndWlsZD17dGhpcy5wcm9wcy5ndWlsZH1cclxuXHJcblx0XHRcdFx0XHRcdFx0b2JqZWN0aXZlSWQ9e2VudHJ5LmdldCgnb2JqZWN0aXZlSWQnKX1cclxuXHRcdFx0XHRcdFx0XHR3b3JsZENvbG9yPXtlbnRyeS5nZXQoJ3dvcmxkJyl9XHJcblx0XHRcdFx0XHRcdFx0dGltZXN0YW1wPXtlbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkd1aWxkQ2xhaW1zLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR3VpbGRDbGFpbXM7XHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgRW1ibGVtID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0VtYmxlbScpO1xyXG5jb25zdCBDbGFpbXMgPSByZXF1aXJlKCcuL0NsYWltcycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8aDEgc3R5bGU9e3t3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLCBvdmVyZmxvdzogXCJoaWRkZW5cIiwgdGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCJ9fT5cclxuXHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPlxyXG5cdHsnIExvYWRpbmcuLi4nfVxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBHdWlsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBkYXRhUmVhZHkgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnbG9hZGVkJyk7XHJcblxyXG5cdFx0Y29uc3QgZ3VpbGRJZCA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9pZCcpO1xyXG5cdFx0Y29uc3QgZ3VpbGROYW1lID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuXHRcdGNvbnN0IGd1aWxkVGFnID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG5cdFx0Y29uc3QgZ3VpbGRDbGFpbXMgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnY2xhaW1zJyk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0d1aWxkOjpyZW5kZXIoKScsIGd1aWxkSWQsIGd1aWxkTmFtZSk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ3VpbGRcIiBpZD17Z3VpbGRJZH0+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS00XCI+XHJcblx0XHRcdFx0XHRcdHsoZGF0YVJlYWR5KVxyXG5cdFx0XHRcdFx0XHRcdD8gPGEgaHJlZj17YGh0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS9ndWlsZHMvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9YH0gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8RW1ibGVtIGd1aWxkTmFtZT17Z3VpbGROYW1lfSBzaXplPXsyNTZ9IC8+XHJcblx0XHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0XHRcdDogPEVtYmxlbSBzaXplPXsyNTZ9IC8+XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTIwXCI+XHJcblx0XHRcdFx0XHRcdHsoZGF0YVJlYWR5KVxyXG5cdFx0XHRcdFx0XHRcdD8gPGgxPjxhIGhyZWY9e2BodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLyR7c2x1Z2lmeShndWlsZE5hbWUpfWB9IHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0e2d1aWxkTmFtZX0gW3tndWlsZFRhZ31dXHJcblx0XHRcdFx0XHRcdFx0PC9hPjwvaDE+XHJcblx0XHRcdFx0XHRcdFx0OiBsb2FkaW5nSHRtbFxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR7IWd1aWxkQ2xhaW1zLmlzRW1wdHkoKVxyXG5cdFx0XHRcdFx0XHRcdD8gPENsYWltcyB7Li4udGhpcy5wcm9wc30gLz5cclxuXHRcdFx0XHRcdFx0XHQ6IG51bGxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR3VpbGQ7XHJcblxyXG5mdW5jdGlvbiBzbHVnaWZ5KHN0cikge1xyXG5cdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoLyAvZywgJy0nKSkudG9Mb3dlckNhc2UoKTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEd1aWxkID0gcmVxdWlyZSgnLi9HdWlsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBHdWlsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdC8vIGNvbnN0cnVjdG9yKCkge31cclxuXHQvLyBjb21wb25lbnREaWRNb3VudCgpIHt9XHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0d1aWxkczo6cmVuZGVyKCknKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdwcm9wcy5ndWlsZHMnLCBwcm9wcy5ndWlsZHMudG9PYmplY3QoKSk7XHJcblxyXG5cdFx0Y29uc3Qgc29ydGVkR3VpbGRzID0gcHJvcHMuZ3VpbGRzLnRvU2VxKClcclxuXHRcdFx0LnNvcnRCeShndWlsZCA9PiBndWlsZC5nZXQoJ2d1aWxkX25hbWUnKSlcclxuXHRcdFx0LnNvcnRCeShndWlsZCA9PiAtZ3VpbGQuZ2V0KCdsYXN0Q2xhaW0nKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNlY3Rpb24gaWQ9XCJndWlsZHNcIj5cclxuXHRcdFx0XHQ8aDIgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkZXJcIj5HdWlsZCBDbGFpbXM8L2gyPlxyXG5cdFx0XHRcdHtzb3J0ZWRHdWlsZHMubWFwKGd1aWxkID0+XHJcblx0XHRcdFx0XHQ8R3VpbGRcclxuXHRcdFx0XHRcdFx0a2V5PXtndWlsZC5nZXQoJ2d1aWxkX2lkJyl9XHJcblx0XHRcdFx0XHRcdGxhbmc9e3Byb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdGd1aWxkPXtndWlsZH1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9zZWN0aW9uPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuR3VpbGRzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqUXVlcnknKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi4vT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBjYXB0dXJlQ29scyA9IHtcclxuXHRlbGFwc2VkOiB0cnVlLFxyXG5cdHRpbWVzdGFtcDogdHJ1ZSxcclxuXHRtYXBBYmJyZXY6IHRydWUsXHJcblx0YXJyb3c6IHRydWUsXHJcblx0c3ByaXRlOiB0cnVlLFxyXG5cdG5hbWU6IHRydWUsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IGZhbHNlLFxyXG5cdGd1aWxkVGFnOiBmYWxzZSxcclxuXHR0aW1lcjogZmFsc2UsXHJcbn07XHJcblxyXG5jb25zdCBjbGFpbUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogdHJ1ZSxcclxuXHR0aW1lc3RhbXA6IHRydWUsXHJcblx0bWFwQWJicmV2OiB0cnVlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiB0cnVlLFxyXG5cdGd1aWxkVGFnOiB0cnVlLFxyXG5cdHRpbWVyOiBmYWxzZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblx0XHRjb25zdCBuZXdFbnRyeSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5lbnRyeSwgbmV4dFByb3BzLmVudHJ5KTtcclxuXHJcblx0XHRjb25zdCBuZXdGaWx0ZXJzID0gKFxyXG5cdFx0XHQhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKVxyXG5cdFx0XHR8fCAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIsIG5leHRQcm9wcy5ldmVudEZpbHRlcilcclxuXHRcdCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRuZXdMYW5nXHJcblx0XHRcdHx8IG5ld0d1aWxkXHJcblx0XHRcdHx8IG5ld0VudHJ5XHJcblx0XHRcdHx8IG5ld0ZpbHRlcnNcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0VudHJ5OnJlbmRlcigpJywge25ld1RyaWdnZXJTdGF0ZSwgbmV3RmlsdGVycywgc2hvdWxkVXBkYXRlfSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0VudHJ5OnJlbmRlcigpJyk7XHJcblx0XHRjb25zdCBldmVudFR5cGUgPSB0aGlzLnByb3BzLmVudHJ5LmdldCgndHlwZScpO1xyXG5cclxuXHRcdGNvbnN0IGNvbHMgPSAoZXZlbnRUeXBlID09PSAnY2xhaW0nKVxyXG5cdFx0XHQ/IGNsYWltQ29sc1xyXG5cdFx0XHQ6IGNhcHR1cmVDb2xzO1xyXG5cclxuXHRcdGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhW3RoaXMucHJvcHMuZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpXTtcclxuXHRcdGNvbnN0IG1hcENvbG9yID0gXy5maW5kKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXAgPT4gbWFwLm1hcEluZGV4ID09PSBvTWV0YS5tYXApLmNvbG9yO1xyXG5cclxuXHJcblx0XHRjb25zdCBtYXRjaGVzTWFwRmlsdGVyID0gdGhpcy5wcm9wcy5tYXBGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSBtYXBDb2xvcjtcclxuXHRcdGNvbnN0IG1hdGNoZXNFdmVudEZpbHRlciA9IHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdhbGwnIHx8IHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgPT09IGV2ZW50VHlwZTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRCZVZpc2libGUgPSAobWF0Y2hlc01hcEZpbHRlciAmJiBtYXRjaGVzRXZlbnRGaWx0ZXIpO1xyXG5cdFx0Y29uc3QgY2xhc3NOYW1lID0gc2hvdWxkQmVWaXNpYmxlID8gJ3Nob3ctZW50cnknIDogJ2hpZGUtZW50cnknO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG5cdFx0XHRcdDxPYmplY3RpdmVcclxuXHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHJcblx0XHRcdFx0XHRjb2xzPXtjb2xzfVxyXG5cdFx0XHRcdFx0Z3VpbGRJZD17dGhpcy5wcm9wcy5ndWlsZElkfVxyXG5cdFx0XHRcdFx0Z3VpbGQ9e3RoaXMucHJvcHMuZ3VpbGR9XHJcblxyXG5cdFx0XHRcdFx0ZW50cnlJZD17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ2lkJyl9XHJcblx0XHRcdFx0XHRvYmplY3RpdmVJZD17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcblx0XHRcdFx0XHR3b3JsZENvbG9yPXt0aGlzLnByb3BzLmVudHJ5LmdldCgnd29ybGQnKX1cclxuXHRcdFx0XHRcdHRpbWVzdGFtcD17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpfVxyXG5cdFx0XHRcdFx0ZXZlbnRUeXBlPXt0aGlzLnByb3BzLmVudHJ5LmdldCgndHlwZScpfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5FbnRyeS5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRlbnRyeTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcblx0Z3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cclxuXHRtYXBGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRldmVudEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50cnk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIgIT09IG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgaWQ9XCJsb2ctZXZlbnQtZmlsdGVyc1wiIGNsYXNzTmFtZT1cIm5hdiBuYXYtcGlsbHNcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPXsocHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdjbGFpbScpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiY2xhaW1cIj5DbGFpbXM8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPXsocHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdjYXB0dXJlJykgPyAnYWN0aXZlJzogbnVsbH0+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJjYXB0dXJlXCI+Q2FwdHVyZXM8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPXsocHJvcHMuZXZlbnRGaWx0ZXIgPT09ICdhbGwnKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuXHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImFsbFwiPkFsbDwvYT5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwRmlsdGVycy5wcm9wVHlwZXMgPSB7XHJcblx0ZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbXHJcblx0XHQnYWxsJyxcclxuXHRcdCdjYXB0dXJlJyxcclxuXHRcdCdjbGFpbScsXHJcblx0XSkuaXNSZXF1aXJlZCxcclxuXHRzZXRFdmVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcEZpbHRlcnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEVudHJ5ID0gcmVxdWlyZSgnLi9FbnRyeScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMb2dFbnRyaWVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuXHRcdGNvbnN0IG5ld1RyaWdnZXJTdGF0ZSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50cmlnZ2VyTm90aWZpY2F0aW9uLCBuZXh0UHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblx0XHRjb25zdCBuZXdGaWx0ZXJTdGF0ZSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXBGaWx0ZXIsIG5leHRQcm9wcy5tYXBGaWx0ZXIpIHx8ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ldmVudEZpbHRlciwgbmV4dFByb3BzLmV2ZW50RmlsdGVyKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcblx0XHRcdG5ld0xhbmdcclxuXHRcdFx0fHwgbmV3R3VpbGRzXHJcblx0XHRcdHx8IG5ld1RyaWdnZXJTdGF0ZVxyXG5cdFx0XHR8fCBuZXdGaWx0ZXJTdGF0ZVxyXG5cdFx0KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0xvZ0VudHJpZXM6OnJlbmRlcigpJywgcHJvcHMubWFwRmlsdGVyLCBwcm9wcy5ldmVudEZpbHRlciwgcHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbik7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGlkPVwibG9nXCI+XHJcblx0XHRcdFx0e3Byb3BzLmV2ZW50SGlzdG9yeS5tYXAoZW50cnkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgZXZlbnRUeXBlID0gZW50cnkuZ2V0KCd0eXBlJyk7XHJcblx0XHRcdFx0XHRjb25zdCBlbnRyeUlkID0gZW50cnkuZ2V0KCdpZCcpO1xyXG5cdFx0XHRcdFx0bGV0IGd1aWxkSWQsIGd1aWxkO1xyXG5cclxuXHRcdFx0XHRcdGlmIChldmVudFR5cGUgPT09ICdjbGFpbScpIHtcclxuXHRcdFx0XHRcdFx0Z3VpbGRJZCA9IGVudHJ5LmdldCgnZ3VpbGQnKTtcclxuXHRcdFx0XHRcdFx0Z3VpbGQgPSAocHJvcHMuZ3VpbGRzLmhhcyhndWlsZElkKSlcclxuXHRcdFx0XHRcdFx0XHQ/IHByb3BzLmd1aWxkcy5nZXQoZ3VpbGRJZClcclxuXHRcdFx0XHRcdFx0XHQ6IG51bGw7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdHJldHVybiA8RW50cnlcclxuXHRcdFx0XHRcdFx0a2V5PXtlbnRyeUlkfVxyXG5cdFx0XHRcdFx0XHRjb21wb25lbnQ9J2xpJ1xyXG5cclxuXHRcdFx0XHRcdFx0dHJpZ2dlck5vdGlmaWNhdGlvbj17cHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbn1cclxuXHRcdFx0XHRcdFx0bWFwRmlsdGVyPXtwcm9wcy5tYXBGaWx0ZXJ9XHJcblx0XHRcdFx0XHRcdGV2ZW50RmlsdGVyPXtwcm9wcy5ldmVudEZpbHRlcn1cclxuXHJcblx0XHRcdFx0XHRcdGxhbmc9e3Byb3BzLmxhbmd9XHJcblxyXG5cdFx0XHRcdFx0XHRndWlsZElkPXtndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRlbnRyeT17ZW50cnl9XHJcblx0XHRcdFx0XHRcdGd1aWxkPXtndWlsZH1cclxuXHRcdFx0XHRcdC8+O1xyXG5cdFx0XHRcdH0pfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcblx0Ly8gXHQkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKVxyXG5cdC8vIFx0XHQuY2hpbGRyZW4oJ2xpJylcclxuXHQvLyBcdFx0XHQuZmlsdGVyKCcuc2hvdy1lbnRyeScpXHJcblx0Ly8gXHRcdFx0XHQuZWFjaCgoaXhSb3csIGVsKSA9PiAoaXhSb3cgJSAyKSA/ICQoZWwpLmFkZENsYXNzKCd0by1hbHQnKSA6IG51bGwpXHJcblx0Ly8gXHRcdFx0LmVuZCgpXHJcblx0Ly8gXHRcdFx0LmZpbHRlcignLmFsdDpub3QoLnRvLWFsdCknKVxyXG5cdC8vIFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhbHQnKVxyXG5cdC8vIFx0XHRcdC5lbmQoKVxyXG5cdC8vIFx0XHRcdC5maWx0ZXIoJy50by1hbHQnKVxyXG5cdC8vIFx0XHRcdFx0LmFkZENsYXNzKCdhbHQnKVxyXG5cdC8vIFx0XHRcdFx0LnJlbW92ZUNsYXNzKCd0by1hbHQnKVxyXG5cdC8vIFx0XHRcdC5lbmQoKVxyXG5cdC8vIFx0XHQuZW5kKCk7XHJcblx0Ly8gfVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxvZ0VudHJpZXMuZGVmYXVsdFByb3BzID0ge1xyXG5cdGd1aWxkczoge30sXHJcbn07XHJcblxyXG5Mb2dFbnRyaWVzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcblx0dHJpZ2dlck5vdGlmaWNhdGlvbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRtYXBGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRldmVudEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nRW50cmllcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcEZpbHRlcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdHJldHVybiAodGhpcy5wcm9wcy5tYXBGaWx0ZXIgIT09IG5leHRQcm9wcy5tYXBGaWx0ZXIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGlkPVwibG9nLW1hcC1maWx0ZXJzXCIgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxsc1wiPlxyXG5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPXsocHJvcHMubWFwRmlsdGVyID09PSAnYWxsJykgPyAnYWN0aXZlJzogJ251bGwnfT5cclxuXHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldFdvcmxkfSBkYXRhLWZpbHRlcj1cImFsbFwiPkFsbDwvYT5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cclxuXHRcdFx0XHR7Xy5tYXAoU1RBVElDLm9iamVjdGl2ZV9tYXAsIG1hcE1ldGEgPT5cclxuXHRcdFx0XHRcdDxsaSBrZXk9e21hcE1ldGEubWFwSW5kZXh9IGNsYXNzTmFtZT17KHByb3BzLm1hcEZpbHRlciA9PT0gbWFwTWV0YS5jb2xvcikgPyAnYWN0aXZlJzogbnVsbH0+XHJcblx0XHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldFdvcmxkfSBkYXRhLWZpbHRlcj17bWFwTWV0YS5jb2xvcn0+e21hcE1ldGEuYWJicn08L2E+XHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCl9XHJcblxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwRmlsdGVycy5wcm9wVHlwZXMgPSB7XHJcblx0bWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0c2V0V29ybGQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBGaWx0ZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBGaWx0ZXJzID0gcmVxdWlyZSgnLi9NYXBGaWx0ZXJzJyk7XHJcbmNvbnN0IEV2ZW50RmlsdGVycyA9IHJlcXVpcmUoJy4vRXZlbnRGaWx0ZXJzJyk7XHJcbmNvbnN0IExvZ0VudHJpZXMgPSByZXF1aXJlKCcuL0xvZ0VudHJpZXMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdG1hcEZpbHRlcjogJ2FsbCcsXHJcblx0XHRcdGV2ZW50RmlsdGVyOiAnYWxsJyxcclxuXHRcdFx0dHJpZ2dlck5vdGlmaWNhdGlvbjogZmFsc2UsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdIaXN0b3J5ID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5JyksIG5leHRQcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpKTtcclxuXHJcblx0XHRjb25zdCBuZXdNYXBGaWx0ZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMuc3RhdGUubWFwRmlsdGVyLCBuZXh0U3RhdGUubWFwRmlsdGVyKTtcclxuXHRcdGNvbnN0IG5ld0V2ZW50RmlsdGVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmV2ZW50RmlsdGVyLCBuZXh0U3RhdGUuZXZlbnRGaWx0ZXIpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuXHRcdFx0bmV3TGFuZ1xyXG5cdFx0XHR8fCBuZXdHdWlsZHNcclxuXHRcdFx0fHwgbmV3SGlzdG9yeVxyXG5cdFx0XHR8fCBuZXdNYXBGaWx0ZXJcclxuXHRcdFx0fHwgbmV3RXZlbnRGaWx0ZXJcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHt0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuXHRcdGlmICghdGhpcy5zdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9uKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe3RyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgY29tcG9uZW50ID0gdGhpcztcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnTG9nOjpyZW5kZXIoKScsIHN0YXRlLm1hcEZpbHRlciwgc3RhdGUuZXZlbnRGaWx0ZXIsIHN0YXRlLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cclxuXHRcdGNvbnN0IGV2ZW50SGlzdG9yeSA9IHByb3BzLmRldGFpbHMuZ2V0KCdoaXN0b3J5Jyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBpZD1cImxvZy1jb250YWluZXJcIj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJsb2ctdGFic1wiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTZcIj5cclxuXHRcdFx0XHRcdFx0XHQ8TWFwRmlsdGVyc1xyXG5cdFx0XHRcdFx0XHRcdFx0bWFwRmlsdGVyPXtzdGF0ZS5tYXBGaWx0ZXJ9XHJcblx0XHRcdFx0XHRcdFx0XHRzZXRXb3JsZD17c2V0V29ybGQuYmluZChjb21wb25lbnQpfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04XCI+XHJcblx0XHRcdFx0XHRcdFx0PEV2ZW50RmlsdGVyc1xyXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRGaWx0ZXI9e3N0YXRlLmV2ZW50RmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRcdFx0c2V0RXZlbnQ9e3NldEV2ZW50LmJpbmQoY29tcG9uZW50KX1cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHR7IWV2ZW50SGlzdG9yeS5pc0VtcHR5KClcclxuXHRcdFx0XHRcdD8gPExvZ0VudHJpZXNcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck5vdGlmaWNhdGlvbj17c3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbn1cclxuXHRcdFx0XHRcdFx0bWFwRmlsdGVyPXtzdGF0ZS5tYXBGaWx0ZXJ9XHJcblx0XHRcdFx0XHRcdGV2ZW50RmlsdGVyPXtzdGF0ZS5ldmVudEZpbHRlcn1cclxuXHJcblx0XHRcdFx0XHRcdGxhbmc9e3Byb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdGd1aWxkcz17cHJvcHMuZ3VpbGRzfVxyXG5cclxuXHRcdFx0XHRcdFx0ZXZlbnRIaXN0b3J5PXtldmVudEhpc3Rvcnl9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0OiBudWxsXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Mb2cucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2c7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0V29ybGQoZSkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuXHRjb21wb25lbnQuc2V0U3RhdGUoe21hcEZpbHRlcjogZmlsdGVyLCB0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0RXZlbnQoZSkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRsZXQgZmlsdGVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcicpO1xyXG5cclxuXHRjb21wb25lbnQuc2V0U3RhdGUoe2V2ZW50RmlsdGVyOiBmaWx0ZXIsIHRyaWdnZXJOb3RpZmljYXRpb246IHRydWV9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBTY29yZXMgPSByZXF1aXJlKCcuL01hcFNjb3JlcycpO1xyXG5jb25zdCBNYXBTZWN0aW9uID0gcmVxdWlyZSgnLi9NYXBTZWN0aW9uJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBEZXRhaWxzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3RGV0YWlscyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGRzIHx8IG5ld0RldGFpbHMgfHwgbmV3V29ybGRzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBtYXBNZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tYXAuZmluZChtbSA9PiBtbS5nZXQoJ2tleScpID09PSB0aGlzLnByb3BzLm1hcEtleSk7XHJcblx0XHRjb25zdCBtYXBJbmRleCA9IG1hcE1ldGEuZ2V0KCdtYXBJbmRleCcpLnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0Y29uc3QgbWFwU2NvcmVzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnbWFwcycsICdzY29yZXMnLCBtYXBJbmRleF0pO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBEZXRhaWxzOnJlbmRlcigpJywgbWFwU2NvcmVzLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtYXBcIj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtYXBTY29yZXNcIj5cclxuXHRcdFx0XHRcdDxoMiBjbGFzc05hbWU9eyd0ZWFtICcgKyBtYXBNZXRhLmdldCgnY29sb3InKX0gb25DbGljaz17b25UaXRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdFx0e21hcE1ldGEuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHQ8L2gyPlxyXG5cdFx0XHRcdFx0PE1hcFNjb3JlcyBzY29yZXM9e21hcFNjb3Jlc30gLz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHRcdHttYXBNZXRhLmdldCgnc2VjdGlvbnMnKS5tYXAoKG1hcFNlY3Rpb24sIGl4U2VjdGlvbikgPT4ge1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHQ8TWFwU2VjdGlvblxyXG5cdFx0XHRcdFx0XHRcdFx0Y29tcG9uZW50PVwidWxcIlxyXG5cdFx0XHRcdFx0XHRcdFx0a2V5PXtpeFNlY3Rpb259XHJcblx0XHRcdFx0XHRcdFx0XHRtYXBTZWN0aW9uPXttYXBTZWN0aW9ufVxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwTWV0YT17bWFwTWV0YX1cclxuXHRcdFx0XHRcdFx0XHRcdHsuLi50aGlzLnByb3BzfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KX1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcERldGFpbHMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRGV0YWlscztcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBvblRpdGxlQ2xpY2soZSkge1xyXG5cdGxldCAkbWFwcyA9ICQoJy5tYXAnKTtcclxuXHRsZXQgJG1hcCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5tYXAnLCAkbWFwcyk7XHJcblxyXG5cdGxldCBoYXNGb2N1cyA9ICRtYXAuaGFzQ2xhc3MoJ21hcC1mb2N1cycpO1xyXG5cclxuXHJcblx0aWYoIWhhc0ZvY3VzKSB7XHJcblx0XHQkbWFwXHJcblx0XHRcdC5hZGRDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuXHRcdCRtYXBzLm5vdCgkbWFwKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdC5hZGRDbGFzcygnbWFwLWJsdXInKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHQkbWFwc1xyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcblx0fVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwU2NvcmVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2NvcmVzLCBuZXh0UHJvcHMuc2NvcmVzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcblx0XHRcdFx0e3Byb3BzLnNjb3Jlcy5tYXAoKHNjb3JlLCBpeFNjb3JlKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCBmb3JtYXR0ZWQgPSBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpO1xyXG5cdFx0XHRcdFx0Y29uc3QgdGVhbSA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXVtpeFNjb3JlXTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gPGxpIGtleT17dGVhbX0gY2xhc3NOYW1lPXtgdGVhbSAke3RlYW19YH0+XHJcblx0XHRcdFx0XHRcdHtmb3JtYXR0ZWR9XHJcblx0XHRcdFx0XHQ8L2xpPjtcclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcFNjb3Jlcy5wcm9wVHlwZXMgPSB7XHJcblx0c2NvcmVzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcFNjb3JlcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgT2JqZWN0aXZlID0gcmVxdWlyZSgnVHJhY2tlci9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBvYmplY3RpdmVDb2xzID0ge1xyXG5cdGVsYXBzZWQ6IGZhbHNlLFxyXG5cdHRpbWVzdGFtcDogZmFsc2UsXHJcblx0bWFwQWJicmV2OiBmYWxzZSxcclxuXHRhcnJvdzogdHJ1ZSxcclxuXHRzcHJpdGU6IHRydWUsXHJcblx0bmFtZTogdHJ1ZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogZmFsc2UsXHJcblx0Z3VpbGRUYWc6IHRydWUsXHJcblx0dGltZXI6IHRydWUsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBTZWN0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3RGV0YWlscyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLCBuZXh0UHJvcHMuZGV0YWlscyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3R3VpbGRzIHx8IG5ld0RldGFpbHMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBtYXBPYmplY3RpdmVzID0gdGhpcy5wcm9wcy5tYXBTZWN0aW9uLmdldCgnb2JqZWN0aXZlcycpO1xyXG5cdFx0Y29uc3Qgb3duZXJzID0gdGhpcy5wcm9wcy5kZXRhaWxzLmdldEluKFsnb2JqZWN0aXZlcycsICdvd25lcnMnXSk7XHJcblx0XHRjb25zdCBjbGFpbWVycyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnY2xhaW1lcnMnXSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6Ok1hcHM6Ok1hcFNlY3Rpb246cmVuZGVyKCknLCBtYXBPYmplY3RpdmVzLCBtYXBPYmplY3RpdmVzLnRvSlMoKSk7XHJcblxyXG5cclxuXHRcdGNvbnN0IHNlY3Rpb25DbGFzcyA9IGdldFNlY3Rpb25DbGFzcyh0aGlzLnByb3BzLm1hcE1ldGEuZ2V0KCdrZXknKSwgdGhpcy5wcm9wcy5tYXBTZWN0aW9uLmdldCgnbGFiZWwnKSk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBjbGFzc05hbWU9e2BsaXN0LXVuc3R5bGVkICR7c2VjdGlvbkNsYXNzfWB9PlxyXG5cdFx0XHRcdHttYXBPYmplY3RpdmVzLm1hcChvYmplY3RpdmVJZCA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCBvd25lciA9IG93bmVycy5nZXQob2JqZWN0aXZlSWQudG9TdHJpbmcoKSk7XHJcblx0XHRcdFx0XHRjb25zdCBjbGFpbWVyID0gY2xhaW1lcnMuZ2V0KG9iamVjdGl2ZUlkLnRvU3RyaW5nKCkpO1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0IGd1aWxkSWQgPSAoY2xhaW1lcikgPyBjbGFpbWVyLmd1aWxkIDogbnVsbDtcclxuXHRcdFx0XHRcdGNvbnN0IGhhc0NsYWltZXIgPSAhIWd1aWxkSWQ7XHJcblx0XHRcdFx0XHRjb25zdCBoYXNHdWlsZERhdGEgPSBoYXNDbGFpbWVyICYmIHRoaXMucHJvcHMuZ3VpbGRzLmhhcyhndWlsZElkKTtcclxuXHRcdFx0XHRcdGNvbnN0IGd1aWxkID0gaGFzR3VpbGREYXRhID8gdGhpcy5wcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpIDogbnVsbDtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHQ8bGkga2V5PXtvYmplY3RpdmVJZH0gaWQ9eydvYmplY3RpdmUtJyArIG9iamVjdGl2ZUlkfT5cclxuXHRcdFx0XHRcdFx0XHQ8T2JqZWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdFx0XHRjb2xzPXtvYmplY3RpdmVDb2xzfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH1cclxuXHRcdFx0XHRcdFx0XHRcdHdvcmxkQ29sb3I9e293bmVyLmdldCgnd29ybGQnKX1cclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcD17b3duZXIuZ2V0KCd0aW1lc3RhbXAnKX1cclxuXHRcdFx0XHRcdFx0XHRcdGd1aWxkSWQ9e2d1aWxkSWR9XHJcblx0XHRcdFx0XHRcdFx0XHRndWlsZD17Z3VpbGR9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdH0pfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwU2VjdGlvbi5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG5cdG1hcFNlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuXHRkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBTZWN0aW9uO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2VjdGlvbkNsYXNzKG1hcEtleSwgc2VjdGlvbkxhYmVsKSB7XHJcblx0bGV0IHNlY3Rpb25DbGFzcyA9IFtcclxuXHRcdCdjb2wtbWQtMjQnLFxyXG5cdFx0J21hcC1zZWN0aW9uJyxcclxuXHRdO1xyXG5cclxuXHRpZiAobWFwS2V5ID09PSAnQ2VudGVyJykge1xyXG5cdFx0aWYgKHNlY3Rpb25MYWJlbCA9PT0gJ0Nhc3RsZScpIHtcclxuXHRcdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlY3Rpb25DbGFzcy5qb2luKCcgJyk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hcERldGFpbHMgPSByZXF1aXJlKCcuL01hcERldGFpbHMnKTtcclxuY29uc3QgTG9nID0gcmVxdWlyZSgnVHJhY2tlci9Mb2cnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0RldGFpbHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGNvbnN0IGlzRGF0YUluaXRpYWxpemVkID0gcHJvcHMuZGV0YWlscy5nZXQoJ2luaXRpYWxpemVkJyk7XHJcblxyXG5cdFx0aWYgKCFpc0RhdGFJbml0aWFsaXplZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNlY3Rpb24gaWQ9XCJtYXBzXCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkNlbnRlclwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMThcIj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJSZWRIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC04XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkJsdWVIb21lXCIgey4uLnByb3BzfSAvPn08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC04XCI+ezxNYXBEZXRhaWxzIG1hcEtleT1cIkdyZWVuSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PExvZyB7Li4ucHJvcHN9IC8+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdCA8L2Rpdj5cclxuXHRcdFx0PC9zZWN0aW9uPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWFwcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRkZXRhaWxzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgRW1ibGVtID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0VtYmxlbScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0d1aWxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkSWQsIG5leHRQcm9wcy5ndWlsZElkKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdHdWlsZCB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBoYXNHdWlsZCA9ICEhdGhpcy5wcm9wcy5ndWlsZElkO1xyXG5cdFx0Y29uc3QgaXNFbmFibGVkID0gaGFzR3VpbGQgJiYgKHRoaXMucHJvcHMuc2hvd05hbWUgfHwgdGhpcy5wcm9wcy5zaG93VGFnKTtcclxuXHJcblx0XHRpZiAoIWlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBoYXNHdWlsZERhdGEgPSBwcm9wcy5ndWlsZCAmJiBwcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpO1xyXG5cdFx0XHRjb25zdCBpZCA9IHByb3BzLmd1aWxkSWQ7XHJcblxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnR3VpbGQ6cmVuZGVyKCknLCBpZCk7XHJcblxyXG5cdFx0XHRjb25zdCBocmVmID0gYCMke2lkfWA7XHJcblxyXG5cdFx0XHRsZXQgY29udGVudCA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT47XHJcblx0XHRcdGxldCB0aXRsZSA9IG51bGw7XHJcblxyXG5cdFx0XHRpZiAoaGFzR3VpbGREYXRhKSB7XHJcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHByb3BzLmd1aWxkLmdldCgnZ3VpbGRfbmFtZScpO1xyXG5cdFx0XHRcdGNvbnN0IHRhZyA9IHByb3BzLmd1aWxkLmdldCgndGFnJyk7XHJcblxyXG5cdFx0XHRcdGlmIChwcm9wcy5zaG93TmFtZSAmJiBwcm9wcy5zaG93VGFnKSB7XHJcblx0XHRcdFx0XHRjb250ZW50ID0gPHNwYW4+XHJcblx0XHRcdFx0XHRcdHtgJHtuYW1lfSBbJHt0YWd9XSBgfVxyXG5cdFx0XHRcdFx0XHQ8RW1ibGVtIGd1aWxkTmFtZT17bmFtZX0gc2l6ZT17MjB9IC8+XHJcblx0XHRcdFx0XHQ8L3NwYW4+O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChwcm9wcy5zaG93TmFtZSkge1xyXG5cdFx0XHRcdFx0Y29udGVudCA9IGAke25hbWV9YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRjb250ZW50ID0gYCR7dGFnfWA7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aXRsZSA9IGAke25hbWV9IFske3RhZ31dYDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIDxhIGNsYXNzTmFtZT1cImd1aWxkbmFtZVwiIGhyZWY9e2hyZWZ9IHRpdGxlPXt0aXRsZX0+XHJcblx0XHRcdFx0e2NvbnRlbnR9XHJcblx0XHRcdDwvYT47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkd1aWxkLnByb3BUeXBlcyA9IHtcclxuXHRzaG93TmFtZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRzaG93VGFnOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0Z3VpbGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR3VpbGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9TcHJpdGUnKTtcclxuY29uc3QgQXJyb3cgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvQXJyb3cnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEljb25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdDb2xvciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5jb2xvciwgbmV4dFByb3BzLmNvbG9yKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdDb2xvcik7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLnNob3dBcnJvdyAmJiAhdGhpcy5wcm9wcy5zaG93U3ByaXRlKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHRcdFx0Y29uc3Qgb2JqZWN0aXZlVHlwZUlkID0gb01ldGEuZ2V0KCd0eXBlJykudG9TdHJpbmcoKTtcclxuXHRcdFx0Y29uc3Qgb1R5cGUgPSBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldChvYmplY3RpdmVUeXBlSWQpO1xyXG5cclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLWljb25zXCI+XHJcblx0XHRcdFx0eyh0aGlzLnByb3BzLnNob3dBcnJvdykgP1xyXG5cdFx0XHRcdFx0PEFycm93IG9NZXRhPXtvTWV0YX0gLz5cclxuXHRcdFx0XHQ6IG51bGx9XHJcblxyXG5cdFx0XHRcdHsodGhpcy5wcm9wcy5zaG93U3ByaXRlKSA/XHJcblx0XHRcdFx0XHQ8U3ByaXRlXHJcblx0XHRcdFx0XHRcdHR5cGU9e29UeXBlLmdldCgnbmFtZScpfVxyXG5cdFx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy5jb2xvcn1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0OiBudWxsfVxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkljb25zLnByb3BUeXBlcyA9IHtcclxuXHRzaG93QXJyb3c6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0c2hvd1Nwcml0ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJY29ucztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3Qgb0xhYmVsID0gU1RBVElDLm9iamVjdGl2ZV9sYWJlbHMuZ2V0KHRoaXMucHJvcHMub2JqZWN0aXZlSWQpO1xyXG5cdFx0XHRjb25zdCBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPlxyXG5cdFx0XHRcdDxzcGFuPntvTGFiZWwuZ2V0KGxhbmdTbHVnKX08L3NwYW4+XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTGFiZWwucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0aXNFbmFibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBOYW1lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHQvLyBtYXAgbmFtZSBjYW4gbmV2ZXIgY2hhbmdlLCBub3QgbG9jYWxpemVkXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHRcdFx0Y29uc3QgbWFwSW5kZXggPSBvTWV0YS5nZXQoJ21hcCcpO1xyXG5cdFx0XHRjb25zdCBtYXBNZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tYXAuZmluZChtbSA9PiBtbS5nZXQoJ21hcEluZGV4JykgPT09IG1hcEluZGV4KTtcclxuXHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1tYXBcIj5cclxuXHRcdFx0XHQ8c3BhbiB0aXRsZT17bWFwTWV0YS5nZXQoJ25hbWUnKX0+e21hcE1ldGEuZ2V0KCdhYmJyJyl9PC9zcGFuPlxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcE5hbWUucHJvcFR5cGVzID0ge1xyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTmFtZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFRpbWVDb3VudGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBleHBpcmVzID0gdGhpcy5wcm9wcy50aW1lc3RhbXAgKyAoNSAqIDYwKTtcclxuXHJcblx0XHRcdHJldHVybiA8c3BhbiBjbGFzc05hbWU9J3RpbWVyIGNvdW50ZG93biBpbmFjdGl2ZScgZGF0YS1leHBpcmVzPXtleHBpcmVzfT5cclxuXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+XHJcblx0XHRcdDwvc3Bhbj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblRpbWVDb3VudGRvd24ucHJvcFR5cGVzID0ge1xyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHR0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb3VudGRvd247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFRpbWVyUmVsYXRpdmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtcmVsYXRpdmVcIj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ0aW1lciByZWxhdGl2ZVwiIGRhdGEtdGltZXN0YW1wPXt0aGlzLnByb3BzLnRpbWVzdGFtcH0+XHJcblx0XHRcdFx0XHR7bW9tZW50KHRoaXMucHJvcHMudGltZXN0YW1wICogMTAwMCkudHdpdHRlclNob3J0KCl9XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblRpbWVyUmVsYXRpdmUucHJvcFR5cGVzID0ge1xyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHR0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyUmVsYXRpdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFRpbWVzdGFtcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3VGltZXN0YW1wID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3VGltZXN0YW1wKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IHRpbWVzdGFtcEh0bWwgPSBtb21lbnQoKHRoaXMucHJvcHMudGltZXN0YW1wKSAqIDEwMDApLmZvcm1hdCgnaGg6bW06c3MnKTtcclxuXHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS10aW1lc3RhbXBcIj5cclxuXHRcdFx0XHR7dGltZXN0YW1wSHRtbH1cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UaW1lc3RhbXAucHJvcFR5cGVzID0ge1xyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHR0aW1lc3RhbXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVzdGFtcDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgVGltZXJSZWxhdGl2ZSA9IHJlcXVpcmUoJy4vVGltZXJSZWxhdGl2ZScpO1xyXG5jb25zdCBUaW1lc3RhbXAgPSByZXF1aXJlKCcuL1RpbWVzdGFtcCcpO1xyXG5jb25zdCBNYXBOYW1lID0gcmVxdWlyZSgnLi9NYXBOYW1lJyk7XHJcbmNvbnN0IEljb25zID0gcmVxdWlyZSgnLi9JY29ucycpO1xyXG5jb25zdCBMYWJlbCA9IHJlcXVpcmUoJy4vTGFiZWwnKTtcclxuY29uc3QgR3VpbGQgPSByZXF1aXJlKCcuL0d1aWxkJyk7XHJcbmNvbnN0IFRpbWVyQ291bnRkb3duID0gcmVxdWlyZSgnLi9UaW1lckNvdW50ZG93bicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgY29sRGVmYXVsdHMgPSB7XHJcblx0ZWxhcHNlZDogZmFsc2UsXHJcblx0dGltZXN0YW1wOiBmYWxzZSxcclxuXHRtYXBBYmJyZXY6IGZhbHNlLFxyXG5cdGFycm93OiBmYWxzZSxcclxuXHRzcHJpdGU6IGZhbHNlLFxyXG5cdG5hbWU6IGZhbHNlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogZmFsc2UsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT2JqZWN0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0NhcHR1cmUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IG5ld093bmVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkQ29sb3IsIG5leHRQcm9wcy53b3JsZENvbG9yKTtcclxuXHRcdGNvbnN0IG5ld0NsYWltZXIgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRJZCwgbmV4dFByb3BzLmd1aWxkSWQpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0NhcHR1cmUgfHwgbmV3T3duZXIgfHwgbmV3Q2xhaW1lciB8fCBuZXdHdWlsZERhdGEpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdPYmplY3RpdmU6cmVuZGVyKCknLCB0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHJcblx0XHRjb25zdCBvYmplY3RpdmVJZCA9IHRoaXMucHJvcHMub2JqZWN0aXZlSWQudG9TdHJpbmcoKTtcclxuXHRcdGNvbnN0IG9NZXRhID0gU1RBVElDLm9iamVjdGl2ZV9tZXRhLmdldChvYmplY3RpdmVJZCk7XHJcblxyXG5cdFx0Ly8gc2hvcnQgY2lyY3VpdFxyXG5cdFx0aWYgKG9NZXRhLmlzRW1wdHkoKSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb2xzID0gXy5kZWZhdWx0cyh0aGlzLnByb3BzLmNvbHMsIGNvbERlZmF1bHRzKTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2BvYmplY3RpdmUgdGVhbSAke3RoaXMucHJvcHMud29ybGRDb2xvcn1gfT5cclxuXHRcdFx0XHQ8VGltZXJSZWxhdGl2ZSBpc0VuYWJsZWQ9eyEhY29scy5lbGFwc2VkfSB0aW1lc3RhbXA9e3Byb3BzLnRpbWVzdGFtcH0gLz5cclxuXHRcdFx0XHQ8VGltZXN0YW1wIGlzRW5hYmxlZD17ISFjb2xzLnRpbWVzdGFtcH0gdGltZXN0YW1wPXtwcm9wcy50aW1lc3RhbXB9IC8+XHJcblx0XHRcdFx0PE1hcE5hbWUgaXNFbmFibGVkPXshIWNvbHMubWFwQWJicmV2fSBvYmplY3RpdmVJZD17b2JqZWN0aXZlSWR9IC8+XHJcblxyXG5cdFx0XHRcdDxJY29uc1xyXG5cdFx0XHRcdFx0c2hvd0Fycm93PXshIWNvbHMuYXJyb3d9XHJcblx0XHRcdFx0XHRzaG93U3ByaXRlPXshIWNvbHMuc3ByaXRlfVxyXG5cdFx0XHRcdFx0b2JqZWN0aXZlSWQ9e29iamVjdGl2ZUlkfVxyXG5cdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMud29ybGRDb2xvcn1cclxuXHRcdFx0XHQvPlxyXG5cclxuXHRcdFx0XHQ8TGFiZWwgaXNFbmFibGVkPXshIWNvbHMubmFtZX0gb2JqZWN0aXZlSWQ9e29iamVjdGl2ZUlkfSBsYW5nPXt0aGlzLnByb3BzLmxhbmd9IC8+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXN0YXRlXCI+XHJcblx0XHRcdFx0XHQ8R3VpbGRcclxuXHRcdFx0XHRcdFx0c2hvd05hbWU9e2NvbHMuZ3VpbGROYW1lfVxyXG5cdFx0XHRcdFx0XHRzaG93VGFnPXtjb2xzLmd1aWxkVGFnfVxyXG5cdFx0XHRcdFx0XHRndWlsZElkPXt0aGlzLnByb3BzLmd1aWxkSWR9XHJcblx0XHRcdFx0XHRcdGd1aWxkPXt0aGlzLnByb3BzLmd1aWxkfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHJcblx0XHRcdFx0XHQ8VGltZXJDb3VudGRvd24gaXNFbmFibGVkPXshIWNvbHMudGltZXJ9IHRpbWVzdGFtcD17cHJvcHMudGltZXN0YW1wfSAvPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk9iamVjdGl2ZS5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHR3b3JsZENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0ZXZlbnRUeXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cclxuXHRndWlsZElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuXHJcblx0Y29sczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdGl2ZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU3ByaXRlID0gcmVxdWlyZSgnY29tbW9uL0ljb25zLy9TcHJpdGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgSG9sZGluZ3NJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdG9UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldChwcm9wcy50eXBlSWQpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdRdWFudGl0eSA9ICh0aGlzLnByb3BzLnR5cGVRdWFudGl0eSAhPT0gbmV4dFByb3BzLnR5cGVRdWFudGl0eSk7XHJcblx0XHRjb25zdCBuZXdUeXBlID0gKHRoaXMucHJvcHMudHlwZUlkICE9PSBuZXh0UHJvcHMudHlwZUlkKTtcclxuXHRcdGNvbnN0IG5ld0NvbG9yID0gKHRoaXMucHJvcHMuY29sb3IgIT09IG5leHRQcm9wcy5jb2xvcik7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3UXVhbnRpdHkgfHwgbmV3VHlwZSB8fCBuZXdDb2xvcik7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1R5cGUgPSAodGhpcy5wcm9wcy50eXBlSWQgIT09IG5leHRQcm9wcy50eXBlSWQpO1xyXG5cclxuXHRcdGlmIChuZXdUeXBlKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe29UeXBlOiBTVEFUSUMub2JqZWN0aXZlX3R5cGVzLmdldCh0aGlzLnByb3BzLnR5cGVJZCl9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6OlNjb3JlYm9hcmQ6OkhvbGRpbmdzSXRlbTpyZW5kZXIoKScsIHRoaXMuc3RhdGUub1R5cGUudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8bGk+XHJcblx0XHRcdFx0PFNwcml0ZVxyXG5cdFx0XHRcdFx0dHlwZT17dGhpcy5zdGF0ZS5vVHlwZS5nZXQoJ25hbWUnKX1cclxuXHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLmNvbG9yfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdFx0e2AgeCR7dGhpcy5wcm9wcy50eXBlUXVhbnRpdHl9YH1cclxuXHRcdFx0PC9saT5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkhvbGRpbmdzSXRlbS5wcm9wVHlwZXMgPSB7XHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHR0eXBlUXVhbnRpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHR0eXBlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbGRpbmdzSXRlbTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBIb2xkaW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3SG9sZGluZ3MgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuaG9sZGluZ3MsIG5leHRQcm9wcy5ob2xkaW5ncyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3SG9sZGluZ3MpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiA8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuXHRcdFx0e3RoaXMucHJvcHMuaG9sZGluZ3MubWFwKCh0eXBlUXVhbnRpdHksIHR5cGVJbmRleCkgPT5cclxuXHRcdFx0XHQ8SXRlbVxyXG5cdFx0XHRcdFx0a2V5PXt0eXBlSW5kZXh9XHJcblx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy5jb2xvcn1cclxuXHRcdFx0XHRcdHR5cGVRdWFudGl0eT17dHlwZVF1YW50aXR5fVxyXG5cdFx0XHRcdFx0dHlwZUlkPXsodHlwZUluZGV4KzEpLnRvU3RyaW5nKCl9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0KX1cclxuXHRcdDwvdWw+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Ib2xkaW5ncy5wcm9wVHlwZXMgPSB7XHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRob2xkaW5nczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb2xkaW5ncztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IG51bWVyYWwgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBsb2FkaW5nSHRtbCA9IDxoMSBzdHlsZT17e2hlaWdodDogJzkwcHgnLCBmb250U2l6ZTogJzMycHQnLCBsaW5lSGVpZ2h0OiAnOTBweCd9fT5cclxuXHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+XHJcbjwvaDE+O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBIb2xkaW5ncyA9IHJlcXVpcmUoJy4vSG9sZGluZ3MnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1dvcmxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG5cdFx0Y29uc3QgbmV3U2NvcmUgPSAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuXHRcdGNvbnN0IG5ld1RpY2sgPSAodGhpcy5wcm9wcy50aWNrICE9PSBuZXh0UHJvcHMudGljayk7XHJcblx0XHRjb25zdCBuZXdIb2xkaW5ncyA9ICh0aGlzLnByb3BzLmhvbGRpbmdzICE9PSBuZXh0UHJvcHMuaG9sZGluZ3MpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkIHx8IG5ld1Njb3JlIHx8IG5ld1RpY2sgfHwgbmV3SG9sZGluZ3MpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17YHNjb3JlYm9hcmQgdGVhbS1iZyB0ZWFtIHRleHQtY2VudGVyICR7dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2NvbG9yJyl9YH0+XHJcblx0XHRcdFx0XHR7KHRoaXMucHJvcHMud29ybGQgJiYgSW1tdXRhYmxlLk1hcC5pc01hcCh0aGlzLnByb3BzLndvcmxkKSlcclxuXHRcdFx0XHRcdFx0PyAgPGRpdj5cclxuXHRcdFx0XHRcdFx0XHQ8aDE+PGEgaHJlZj17dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+XHJcblx0XHRcdFx0XHRcdFx0XHR7dGhpcy5wcm9wcy53b3JsZC5nZXQoJ25hbWUnKX1cclxuXHRcdFx0XHRcdFx0XHQ8L2E+PC9oMT5cclxuXHRcdFx0XHRcdFx0XHQ8aDI+XHJcblx0XHRcdFx0XHRcdFx0XHR7bnVtZXJhbCh0aGlzLnByb3BzLnNjb3JlKS5mb3JtYXQoJzAsMCcpfVxyXG5cdFx0XHRcdFx0XHRcdFx0eycgJ31cclxuXHRcdFx0XHRcdFx0XHRcdHtudW1lcmFsKHRoaXMucHJvcHMudGljaykuZm9ybWF0KCcrMCwwJyl9XHJcblx0XHRcdFx0XHRcdFx0PC9oMj5cclxuXHJcblx0XHRcdFx0XHRcdFx0PEhvbGRpbmdzXHJcblx0XHRcdFx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy53b3JsZC5nZXQoJ2NvbG9yJyl9XHJcblx0XHRcdFx0XHRcdFx0XHRob2xkaW5ncz17dGhpcy5wcm9wcy5ob2xkaW5nc31cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0OiBsb2FkaW5nSHRtbFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbldvcmxkLnByb3BUeXBlcyA9IHtcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdHRpY2s6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHRob2xkaW5nczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgV29ybGQgPSByZXF1aXJlKCcuL1dvcmxkJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFNjb3JlYm9hcmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuXHRcdGNvbnN0IG5ld1Njb3JlcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3V29ybGRzIHx8IG5ld1Njb3Jlcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1Njb3JlYm9hcmQ6Oldvcmxkczo6cmVuZGVyKCknKTtcclxuXHJcblx0XHRjb25zdCBzY29yZXMgPSB0aGlzLnByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyk7XHJcblx0XHRjb25zdCB0aWNrcyA9IHRoaXMucHJvcHMubWF0Y2guZ2V0KCd0aWNrcycpO1xyXG5cdFx0Y29uc3QgaG9sZGluZ3MgPSB0aGlzLnByb3BzLm1hdGNoLmdldCgnaG9sZGluZ3MnKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9XCJyb3dcIiBpZD1cInNjb3JlYm9hcmRzXCI+XHJcblx0XHRcdFx0e3RoaXMucHJvcHMubWF0Y2hXb3JsZHMudG9TZXEoKS5tYXAoKHdvcmxkLCBpeFdvcmxkKSA9PlxyXG5cdFx0XHRcdFx0PFdvcmxkXHJcblx0XHRcdFx0XHRcdGtleT17aXhXb3JsZH1cclxuXHRcdFx0XHRcdFx0d29ybGQ9e3dvcmxkfVxyXG5cdFx0XHRcdFx0XHRzY29yZT17c2NvcmVzLmdldChpeFdvcmxkKSB8fCAwfVxyXG5cdFx0XHRcdFx0XHR0aWNrPXt0aWNrcy5nZXQoaXhXb3JsZCkgfHwgMH1cclxuXHRcdFx0XHRcdFx0aG9sZGluZ3M9e2hvbGRpbmdzLmdldChpeFdvcmxkKX1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9zZWN0aW9uPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuU2NvcmVib2FyZC5wcm9wVHlwZXMgPSB7XHJcblx0bWF0Y2hXb3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cdG1hdGNoOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NvcmVib2FyZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0IGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKTtcclxuXHJcblxyXG5cclxuY29uc3QgYXBpID0gcmVxdWlyZSgnbGliL2FwaS5qcycpO1xyXG5jb25zdCBsaWJEYXRlID0gcmVxdWlyZSgnbGliL2RhdGUuanMnKTtcclxuY29uc3QgdHJhY2tlclRpbWVycyA9IHJlcXVpcmUoJ2xpYi90cmFja2VyVGltZXJzJyk7XHJcblxyXG5jb25zdCBHdWlsZHNMaWIgPSByZXF1aXJlKCdsaWIvdHJhY2tlci9ndWlsZHMuanMnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZWJvYXJkID0gcmVxdWlyZSgnLi9TY29yZWJvYXJkJyk7XHJcbmNvbnN0IE1hcHMgPSByZXF1aXJlKCcuL01hcHMnKTtcclxuY29uc3QgR3VpbGRzID0gcmVxdWlyZSgnLi9HdWlsZHMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgVHJhY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRoYXNEYXRhOiBmYWxzZSxcclxuXHJcblx0XHRcdGRhdGVOb3c6IGxpYkRhdGUuZGF0ZU5vdygpLFxyXG5cdFx0XHRsYXN0bW9kOiAwLFxyXG5cdFx0XHR0aW1lT2Zmc2V0OiAwLFxyXG5cclxuXHRcdFx0bWF0Y2g6IEltbXV0YWJsZS5NYXAoe2xhc3Rtb2Q6MH0pLFxyXG5cdFx0XHRtYXRjaFdvcmxkczogSW1tdXRhYmxlLkxpc3QoKSxcclxuXHRcdFx0ZGV0YWlsczogSW1tdXRhYmxlLk1hcCgpLFxyXG5cdFx0XHRjbGFpbUV2ZW50czogSW1tdXRhYmxlLkxpc3QoKSxcclxuXHRcdFx0Z3VpbGRzOiBJbW11dGFibGUuTWFwKCksXHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLm1vdW50ZWQgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxzID0ge1xyXG5cdFx0XHR0aW1lcnM6IG51bGxcclxuXHRcdH07XHJcblx0XHR0aGlzLnRpbWVvdXRzID0ge1xyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmd1aWxkTGliID0gbmV3IEd1aWxkc0xpYih0aGlzKTtcclxuXHR9XHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuXHRcdGNvbnN0IGluaXRpYWxEYXRhID0gIV8uaXNFcXVhbCh0aGlzLnN0YXRlLmhhc0RhdGEsIG5leHRTdGF0ZS5oYXNEYXRhKTtcclxuXHRcdGNvbnN0IG5ld01hdGNoRGF0YSA9ICFfLmlzRXF1YWwodGhpcy5zdGF0ZS5sYXN0bW9kLCBuZXh0U3RhdGUubGFzdG1vZCk7XHJcblxyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLmd1aWxkcywgbmV4dFN0YXRlLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcblx0XHRcdGluaXRpYWxEYXRhXHJcblx0XHRcdHx8IG5ld01hdGNoRGF0YVxyXG5cdFx0XHR8fCBuZXdHdWlsZERhdGFcclxuXHRcdFx0fHwgbmV3TGFuZ1xyXG5cdFx0KTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnREaWRNb3VudCgpJyk7XHJcblxyXG5cdFx0dGhpcy5pbnRlcnZhbHMudGltZXJzID0gc2V0SW50ZXJ2YWwodXBkYXRlVGltZXJzLmJpbmQodGhpcyksIDEwMDApO1xyXG5cdFx0c2V0SW1tZWRpYXRlKHVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHRzZXRJbW1lZGlhdGUoZ2V0TWF0Y2hEZXRhaWxzLmJpbmQodGhpcykpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnRXaWxsVW5tb3VudCgpJyk7XHJcblxyXG5cdFx0Y2xlYXJUaW1lcnMuY2FsbCh0aGlzKTtcclxuXHJcblx0XHR0aGlzLm1vdW50ZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cclxuXHRcdGNvbnNvbGUubG9nKCdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCknLCBuZXdMYW5nKTtcclxuXHJcblx0XHRpZiAobmV3TGFuZykge1xyXG5cdFx0XHRzZXRNYXRjaFdvcmxkcy5jYWxsKHRoaXMsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcclxuXHQvLyBcdGNvbnNvbGUubG9nKCdUcmFja2VyOjpjb21wb25lbnRXaWxsVXBkYXRlKCknKTtcclxuXHQvLyB9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6OnJlbmRlcigpJyk7XHJcblx0XHRzZXRQYWdlVGl0bGUodGhpcy5wcm9wcy5sYW5nLCB0aGlzLnByb3BzLndvcmxkKTtcclxuXHJcblxyXG5cdFx0aWYgKCF0aGlzLnN0YXRlLmhhc0RhdGEpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGlkPVwidHJhY2tlclwiPlxyXG5cclxuXHRcdFx0XHR7PFNjb3JlYm9hcmRcclxuXHRcdFx0XHRcdG1hdGNoV29ybGRzPXt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG5cdFx0XHRcdFx0bWF0Y2g9e3RoaXMuc3RhdGUubWF0Y2h9XHJcblx0XHRcdFx0Lz59XHJcblxyXG5cdFx0XHRcdHs8TWFwc1xyXG5cdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0ZGV0YWlscz17dGhpcy5zdGF0ZS5kZXRhaWxzfVxyXG5cdFx0XHRcdFx0bWF0Y2hXb3JsZHM9e3RoaXMuc3RhdGUubWF0Y2hXb3JsZHN9XHJcblx0XHRcdFx0XHRndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG5cdFx0XHRcdC8+fVxyXG5cclxuXHRcdFx0XHR7PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTI0XCI+XHJcblx0XHRcdFx0XHRcdHsoIXRoaXMuc3RhdGUuZ3VpbGRzLmlzRW1wdHkoKSlcclxuXHRcdFx0XHRcdFx0XHQ/IDxHdWlsZHNcclxuXHRcdFx0XHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRndWlsZHM9e3RoaXMuc3RhdGUuZ3VpbGRzfVxyXG5cdFx0XHRcdFx0XHRcdFx0Y2xhaW1FdmVudHM9e3RoaXMuc3RhdGUuY2xhaW1FdmVudHN9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0XHQ6IG51bGxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+fVxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblRyYWNrZXIucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmFja2VyO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuLypcclxuKlx0VGltZXJzXHJcbiovXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUaW1lcnMoKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZVRpbWVycygpJyk7XHJcblxyXG5cdGNvbnN0IHRpbWVPZmZzZXQgPSBzdGF0ZS50aW1lT2Zmc2V0O1xyXG5cdGNvbnN0IG5vdyA9IGxpYkRhdGUuZGF0ZU5vdygpIC0gdGltZU9mZnNldDtcclxuXHJcblx0dHJhY2tlclRpbWVycy51cGRhdGUobm93LCB0aW1lT2Zmc2V0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjbGVhclRpbWVycygpe1xyXG5cdC8vIGNvbnNvbGUubG9nKCdjbGVhclRpbWVycygpJyk7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdF8uZm9yRWFjaChjb21wb25lbnQuaW50ZXJ2YWxzLCBjbGVhckludGVydmFsKTtcclxuXHRfLmZvckVhY2goY29tcG9uZW50LnRpbWVvdXRzLCBjbGVhclRpbWVvdXQpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TWF0Y2ggRGV0YWlsc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMoKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3QgcHJvcHMgPSBjb21wb25lbnQucHJvcHM7XHJcblxyXG5cdGNvbnN0IHdvcmxkID0gcHJvcHMud29ybGQ7XHJcblx0Y29uc3QgbGFuZ1NsdWcgPSBwcm9wcy5sYW5nLmdldCgnc2x1ZycpO1xyXG5cdGNvbnN0IHdvcmxkU2x1ZyA9IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSk7XHJcblxyXG5cdGFwaS5nZXRNYXRjaERldGFpbHNCeVdvcmxkKFxyXG5cdFx0d29ybGRTbHVnLFxyXG5cdFx0b25NYXRjaERldGFpbHMuYmluZCh0aGlzKVxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25NYXRjaERldGFpbHMoZXJyLCBkYXRhKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3QgcHJvcHMgPSBjb21wb25lbnQucHJvcHM7XHJcblx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cclxuXHRpZiAoY29tcG9uZW50Lm1vdW50ZWQpIHtcclxuXHRcdGlmICghZXJyICYmIGRhdGEgJiYgZGF0YS5tYXRjaCAmJiBkYXRhLmRldGFpbHMpIHtcclxuXHRcdFx0Y29uc3QgbGFzdG1vZCA9IGRhdGEubWF0Y2gubGFzdG1vZDtcclxuXHRcdFx0Y29uc3QgaXNNb2RpZmllZCA9IChsYXN0bW9kICE9PSBzdGF0ZS5tYXRjaC5nZXQoJ2xhc3Rtb2QnKSk7XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCBkYXRhLm1hdGNoLmxhc3Rtb2QsIGlzTW9kaWZpZWQpO1xyXG5cclxuXHRcdFx0aWYgKGlzTW9kaWZpZWQpIHtcclxuXHRcdFx0XHRjb25zdCBkYXRlTm93ID0gbGliRGF0ZS5kYXRlTm93KCk7XHJcblx0XHRcdFx0Y29uc3QgdGltZU9mZnNldCA9IE1hdGguZmxvb3IoZGF0ZU5vdyAgLSAoZGF0YS5ub3cgLyAxMDAwKSk7XHJcblxyXG5cdFx0XHRcdGNvbnN0IG1hdGNoRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5tYXRjaCk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgJ21hdGNoJywgSW1tdXRhYmxlLmlzKG1hdGNoRGF0YSwgc3RhdGUubWF0Y2gpKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCBtYXRjaCk7XHJcblxyXG5cdFx0XHRcdGNvbnN0IGRldGFpbHNEYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhLmRldGFpbHMpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsICdkZXRhaWxzJywgSW1tdXRhYmxlLmlzKGRldGFpbHNEYXRhLCBzdGF0ZS5kZXRhaWxzKSk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgZGV0YWlscyk7XHJcblxyXG5cdFx0XHRcdC8vIHVzZSB0cmFuc2FjdGlvbmFsIHNldFN0YXRlXHJcblx0XHRcdFx0Y29tcG9uZW50LnNldFN0YXRlKHN0YXRlID0+ICh7XHJcblx0XHRcdFx0XHRoYXNEYXRhOiB0cnVlLFxyXG5cdFx0XHRcdFx0ZGF0ZU5vdyxcclxuXHRcdFx0XHRcdHRpbWVPZmZzZXQsXHJcblx0XHRcdFx0XHRsYXN0bW9kLFxyXG5cclxuXHRcdFx0XHRcdG1hdGNoOiBzdGF0ZS5tYXRjaC5tZXJnZURlZXAobWF0Y2hEYXRhKSxcclxuXHRcdFx0XHRcdGRldGFpbHM6IHN0YXRlLmRldGFpbHMubWVyZ2VEZWVwKGRldGFpbHNEYXRhKSxcclxuXHRcdFx0XHR9KSk7XHJcblxyXG5cclxuXHRcdFx0XHRzZXRJbW1lZGlhdGUoY29tcG9uZW50Lmd1aWxkTGliLm9uTWF0Y2hEYXRhLmJpbmQoY29tcG9uZW50Lmd1aWxkTGliLCBkZXRhaWxzRGF0YSkpO1xyXG5cclxuXHRcdFx0XHRpZiAoc3RhdGUubWF0Y2hXb3JsZHMuaXNFbXB0eSgpKSB7XHJcblx0XHRcdFx0XHRzZXRJbW1lZGlhdGUoc2V0TWF0Y2hXb3JsZHMuYmluZChjb21wb25lbnQsIHByb3BzLmxhbmcpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmVzY2hlZHVsZURhdGFVcGRhdGUuY2FsbChjb21wb25lbnQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiByZXNjaGVkdWxlRGF0YVVwZGF0ZSgpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRjb25zdCByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAqMiwgMTAwMCo0KTtcclxuXHJcblx0Y29tcG9uZW50LnRpbWVvdXRzLmRhdGEgPSBzZXRUaW1lb3V0KGdldE1hdGNoRGV0YWlscy5iaW5kKGNvbXBvbmVudCksIHJlZnJlc2hUaW1lKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1hdGNoV29ybGRzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldE1hdGNoV29ybGRzKGxhbmcpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0Y29tcG9uZW50LnNldFN0YXRlKHttYXRjaFdvcmxkczogSW1tdXRhYmxlXHJcblx0XHQuTGlzdChbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ10pXHJcblx0XHQubWFwKGdldE1hdGNoV29ybGQuYmluZChjb21wb25lbnQsIGxhbmcpKVxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoV29ybGQobGFuZywgY29sb3IpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRjb25zdCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblx0Y29uc3QgbGFuZ1NsdWcgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG5cclxuXHRjb25zdCB3b3JsZEtleSA9IGNvbG9yICsgJ0lkJztcclxuXHRjb25zdCB3b3JsZElkID0gc3RhdGUubWF0Y2guZ2V0SW4oW3dvcmxkS2V5XSkudG9TdHJpbmcoKTtcclxuXHJcblx0Y29uc3Qgd29ybGRCeUxhbmcgPSBTVEFUSUMud29ybGRzLmdldEluKFt3b3JsZElkLCBsYW5nU2x1Z10pO1xyXG5cclxuXHRyZXR1cm4gd29ybGRCeUxhbmdcclxuXHRcdC5zZXQoJ2NvbG9yJywgY29sb3IpXHJcblx0XHQuc2V0KCdsaW5rJywgZ2V0V29ybGRMaW5rKGxhbmdTbHVnLCB3b3JsZEJ5TGFuZykpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGQpIHtcclxuXHRyZXR1cm4gWycnLCBsYW5nU2x1Zywgd29ybGQuZ2V0KCdzbHVnJyldLmpvaW4oJy8nKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TWF0Y2ggRGV0YWlsc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpIHtcclxuXHRsZXQgbGFuZ1NsdWcgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG5cdGxldCB3b3JsZE5hbWUgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICduYW1lJ10pO1xyXG5cclxuXHRsZXQgdGl0bGUgPSBbd29ybGROYW1lLCAnZ3cydzJ3J107XHJcblxyXG5cdGlmIChsYW5nU2x1ZyAhPT0gJ2VuJykge1xyXG5cdFx0dGl0bGUucHVzaChsYW5nLmdldCgnbmFtZScpKTtcclxuXHR9XHJcblxyXG5cdCQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdPYmplY3RpdmVNZXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm9NZXRhLCBuZXh0UHJvcHMub01ldGEpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld09iamVjdGl2ZU1ldGEpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBpbWdTcmMgPSBnZXRBcnJvd1NyYyh0aGlzLnByb3BzLm9NZXRhKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJkaXJlY3Rpb25cIj5cclxuXHRcdFx0XHR7aW1nU3JjID8gPGltZyBzcmM9e2ltZ1NyY30gLz4gOiBudWxsfVxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5BcnJvdy5wcm9wVHlwZXMgPSB7XHJcblx0b01ldGE6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3dTcmMobWV0YSkge1xyXG5cdGlmICghbWV0YS5nZXQoJ2QnKSkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRsZXQgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcblx0aWYgKG1ldGEuZ2V0KCduJykpIHtzcmMucHVzaCgnbm9ydGgnKTsgfVxyXG5cdGVsc2UgaWYgKG1ldGEuZ2V0KCdzJykpIHtzcmMucHVzaCgnc291dGgnKTsgfVxyXG5cclxuXHRpZiAobWV0YS5nZXQoJ3cnKSkge3NyYy5wdXNoKCd3ZXN0Jyk7IH1cclxuXHRlbHNlIGlmIChtZXRhLmdldCgnZScpKSB7c3JjLnB1c2goJ2Vhc3QnKTsgfVxyXG5cclxuXHRyZXR1cm4gc3JjLmpvaW4oJy0nKSArICcuc3ZnJztcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgaW1nUGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PC9zdmc+JztcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBFbWJsZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0d1aWxkTmFtZSA9ICh0aGlzLnByb3BzLmd1aWxkTmFtZSAhPT0gbmV4dFByb3BzLmd1aWxkTmFtZSk7XHJcblx0XHRjb25zdCBuZXdTaXplID0gKHRoaXMucHJvcHMuc2l6ZSAhPT0gbmV4dFByb3BzLnNpemUpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdHdWlsZE5hbWUgfHwgbmV3U2l6ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGVtYmxlbVNyYyA9IGdldEVtYmxlbVNyYyh0aGlzLnByb3BzLmd1aWxkTmFtZSk7XHJcblxyXG5cdFx0cmV0dXJuIDxpbWdcclxuXHRcdFx0Y2xhc3NOYW1lPVwiZW1ibGVtXCJcclxuXHRcdFx0c3JjPXtlbWJsZW1TcmN9XHJcblx0XHRcdHdpZHRoPXt0aGlzLnByb3BzLnNpemV9XHJcblx0XHRcdGhlaWdodD17dGhpcy5wcm9wcy5zaXplfVxyXG5cdFx0XHRvbkVycm9yPXtpbWdPbkVycm9yfVxyXG5cdFx0Lz47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkVtYmxlbS5kZWZhdWx0UHJvcHMgPSB7XHJcblx0Z3VpbGROYW1lOiB1bmRlZmluZWQsXHJcblx0c2l6ZTogMjU2LFxyXG59O1xyXG5cclxuRW1ibGVtLnByb3BUeXBlcyA9IHtcclxuXHRndWlsZE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW1ibGVtO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldEVtYmxlbVNyYyhndWlsZE5hbWUpIHtcclxuXHRyZXR1cm4gKGd1aWxkTmFtZSlcclxuXHRcdD8gYGh0dHA6XFwvXFwvZ3VpbGRzLmd3Mncydy5jb21cXC9ndWlsZHNcXC8ke3NsdWdpZnkoZ3VpbGROYW1lKX1cXC8yNTYuc3ZnYFxyXG5cdFx0OiBpbWdQbGFjZWhvbGRlcjtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzbHVnaWZ5KHN0cikge1xyXG5cdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoLyAvZywgJy0nKSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbWdPbkVycm9yKGUpIHtcclxuXHRjb25zdCBjdXJyZW50U3JjID0gJChlLnRhcmdldCkuYXR0cignc3JjJyk7XHJcblxyXG5cdGlmIChjdXJyZW50U3JjICE9PSBpbWdQbGFjZWhvbGRlcikge1xyXG5cdFx0JChlLnRhcmdldCkuYXR0cignc3JjJywgaW1nUGxhY2Vob2xkZXIpO1xyXG5cdH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IElOU1RBTkNFID0ge1xyXG5cdHNpemU6IDYwLFxyXG5cdHN0cm9rZTogMixcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgUGllIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRyZXR1cm4gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1BpZTo6cmVuZGVyJywgcHJvcHMuc2NvcmVzLnRvQXJyYXkoKSk7XHJcblxyXG5cdFx0cmV0dXJuIDxpbWdcclxuXHRcdFx0d2lkdGg9e0lOU1RBTkNFLnNpemV9XHJcblx0XHRcdGhlaWdodD17SU5TVEFOQ0Uuc2l6ZX1cclxuXHRcdFx0c3JjPXtnZXRJbWFnZVNvdXJjZShwcm9wcy5zY29yZXMudG9BcnJheSgpKX1cclxuXHRcdC8+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5QaWUucHJvcFR5cGVzID0ge1xyXG5cdHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaWU7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRJbWFnZVNvdXJjZShzY29yZXMpIHtcclxuXHRyZXR1cm4gYGh0dHA6XFwvXFwvd3d3LnBpZWx5Lm5ldFxcLyR7SU5TVEFOQ0Uuc2l6ZX1cXC8ke3Njb3Jlcy5qb2luKCcsJyl9P3N0cm9rZVdpZHRoPSR7SU5TVEFOQ0Uuc3Ryb2tlfWA7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgU3ByaXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7cmV0dXJuICFfLmlzRXF1YWwodGhpcy5wcm9wcywgbmV4dFByb3BzKTt9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRyZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtgc3ByaXRlICR7cHJvcHMudHlwZX0gJHtwcm9wcy5jb2xvcn1gfSAvPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuU3ByaXRlLnByb3BUeXBlcyA9IHtcclxuXHR0eXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydGVkIENvbXBvbmVudFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMYW5nTGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGNvbnN0IGlzQWN0aXZlID0gSW1tdXRhYmxlLmlzKHByb3BzLmxhbmcsIHByb3BzLmxpbmtMYW5nKTtcclxuXHRcdGNvbnN0IHRpdGxlID0gcHJvcHMubGlua0xhbmcuZ2V0KCduYW1lJyk7XHJcblx0XHRjb25zdCBsYWJlbCA9IHByb3BzLmxpbmtMYW5nLmdldCgnbGFiZWwnKTtcclxuXHRcdGNvbnN0IGxpbmsgPSBnZXRMaW5rKHByb3BzLmxpbmtMYW5nLCBwcm9wcy53b3JsZCk7XHJcblxyXG5cdFx0cmV0dXJuIDxsaSBjbGFzc05hbWU9e2lzQWN0aXZlID8gJ2FjdGl2ZScgOiAnJ30gdGl0bGU9e3RpdGxlfT5cclxuXHRcdFx0PGEgaHJlZj17bGlua30+e2xhYmVsfTwvYT5cclxuXHRcdDwvbGk+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5MYW5nTGluay5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcblx0bGlua0xhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYW5nTGluaztcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldExpbmsobGFuZywgd29ybGQpIHtcclxuXHRjb25zdCBsYW5nU2x1ZyA9IGxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG5cdGxldCBsaW5rID0gYC8ke2xhbmdTbHVnfWA7XHJcblxyXG5cdGlmICh3b3JsZCkge1xyXG5cdFx0bGV0IHdvcmxkU2x1ZyA9IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSk7XHJcblx0XHRsaW5rICs9IGAvJHt3b3JsZFNsdWd9YDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsaW5rO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IExhbmdMaW5rID0gcmVxdWlyZSgnLi9MYW5nTGluaycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0ZWQgQ29tcG9uZW50XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExhbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRyZW5kZXIoKSB7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0xhbmdzOjpyZW5kZXIoKScsIHRoaXMucHJvcHMubGFuZy50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBjbGFzc05hbWU9J25hdiBuYXZiYXItbmF2Jz5cclxuXHRcdFx0XHR7U1RBVElDLmxhbmdzLnRvU2VxKCkubWFwKChsaW5rTGFuZywga2V5KSA9PlxyXG5cdFx0XHRcdFx0PExhbmdMaW5rXHJcblx0XHRcdFx0XHRcdGtleT17a2V5fVxyXG5cdFx0XHRcdFx0XHRsaW5rTGFuZz17bGlua0xhbmd9XHJcblx0XHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdFx0d29ybGQ9e3RoaXMucHJvcHMud29ybGR9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5MYW5ncy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYW5ncztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZ3cyYXBpID0gcmVxdWlyZSgnZ3cyYXBpJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0R3VpbGREZXRhaWxzOiBnZXRHdWlsZERldGFpbHMsXHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHQvLyBnZXRNYXRjaERldGFpbHM6IGdldE1hdGNoRGV0YWlscyxcclxuXHRnZXRNYXRjaERldGFpbHNCeVdvcmxkOiBnZXRNYXRjaERldGFpbHNCeVdvcmxkLFxyXG59O1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGNhbGxiYWNrKSB7XHJcblx0Z3cyYXBpLmdldE1hdGNoZXNTdGF0ZShjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzKGd1aWxkSWQsIGNhbGxiYWNrKSB7XHJcblx0Z3cyYXBpLmdldEd1aWxkRGV0YWlscyh7Z3VpbGRfaWQ6IGd1aWxkSWR9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKG1hdGNoSWQsIGNhbGxiYWNrKSB7XHJcblx0Z3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlKHttYXRjaF9pZDogbWF0Y2hJZH0sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHNCeVdvcmxkKHdvcmxkU2x1ZywgY2FsbGJhY2spIHtcclxuXHQvLyBzZXRUaW1lb3V0KFxyXG5cdC8vIFx0Z3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlLmJpbmQobnVsbCwge3dvcmxkX3NsdWc6IHdvcmxkU2x1Z30sIGNhbGxiYWNrKSxcclxuXHQvLyBcdDMwMDBcclxuXHQvLyApO1xyXG5cdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7d29ybGRfc2x1Zzogd29ybGRTbHVnfSwgY2FsbGJhY2spO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRkYXRlTm93OiBkYXRlTm93LFxyXG5cdGFkZDU6IGFkZDUsXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gZGF0ZU5vdygpIHtcclxuXHRyZXR1cm4gTWF0aC5mbG9vcihfLm5vdygpIC8gMTAwMCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBhZGQ1KGluRGF0ZSkge1xyXG5cdGxldCBfYmFzZURhdGUgPSBpbkRhdGUgfHwgZGF0ZU5vdygpO1xyXG5cclxuXHRyZXR1cm4gKF9iYXNlRGF0ZSArICg1ICogNjApKTtcclxufVxyXG4iLCJjb25zdCBzdGF0aWNzID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBpbW11dGFibGVTdGF0aWNzID0ge1xyXG5cdGxhbmdzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3MubGFuZ3MpLFxyXG5cdHdvcmxkczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLndvcmxkcyksXHJcblx0b2JqZWN0aXZlX25hbWVzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX25hbWVzKSxcclxuXHRvYmplY3RpdmVfdHlwZXM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfdHlwZXMpLFxyXG5cdG9iamVjdGl2ZV9tZXRhOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX21ldGEpLFxyXG5cdG9iamVjdGl2ZV9sYWJlbHM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy5vYmplY3RpdmVfbGFiZWxzKSxcclxuXHRvYmplY3RpdmVfbWFwOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX21hcCksXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGltbXV0YWJsZVN0YXRpY3M7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3VwZGF0ZX07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUobm93LCB0aW1lT2Zmc2V0KSB7XHJcblx0bGV0ICR0aW1lcnMgPSAkKCcudGltZXInKTtcclxuXHRsZXQgJGNvdW50ZG93bnMgPSAkdGltZXJzLmZpbHRlcignLmNvdW50ZG93bicpO1xyXG5cdGxldCAkcmVsYXRpdmVzID0gJHRpbWVycy5maWx0ZXIoJy5yZWxhdGl2ZScpO1xyXG5cclxuXHRhc3luYy5wYXJhbGxlbChbXHJcblx0XHR1cGRhdGVSZWxhdGl2ZVRpbWVycy5iaW5kKG51bGwsICRyZWxhdGl2ZXMsIHRpbWVPZmZzZXQpLFxyXG5cdFx0dXBkYXRlQ291bnRkb3duVGltZXJzLmJpbmQobnVsbCwgJGNvdW50ZG93bnMsIG5vdyksXHJcblx0XSwgXy5ub29wKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZVRpbWVycyhyZWxhdGl2ZXMsIHRpbWVPZmZzZXQsIGNiKSB7XHJcblx0YXN5bmMuZWFjaChcclxuXHRcdHJlbGF0aXZlcyxcclxuXHRcdHVwZGF0ZVJlbGF0aXZlVGltZU5vZGUuYmluZChudWxsLCB0aW1lT2Zmc2V0KSxcclxuXHRcdGNiXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGRvd25UaW1lcnMoY291bnRkb3ducywgbm93LCBjYikge1xyXG5cdGFzeW5jLmVhY2goXHJcblx0XHRjb3VudGRvd25zLFxyXG5cdFx0dXBkYXRlQ291bnRkb3duVGltZXJOb2RlLmJpbmQobnVsbCwgbm93KSxcclxuXHRcdGNiXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlKHRpbWVPZmZzZXQsIGVsLCBuZXh0KSB7XHJcblx0bGV0ICRlbCA9ICQoZWwpO1xyXG5cclxuXHRjb25zdCB0aW1lc3RhbXAgPSBfLnBhcnNlSW50KCRlbC5hdHRyKCdkYXRhLXRpbWVzdGFtcCcpKTtcclxuXHRjb25zdCBvZmZzZXRUaW1lc3RhbXAgPSB0aW1lc3RhbXAgKyB0aW1lT2Zmc2V0O1xyXG5cdGNvbnN0IHRpbWVzdGFtcE1vbWVudCA9IG1vbWVudChvZmZzZXRUaW1lc3RhbXAgKiAxMDAwKTtcclxuXHRjb25zdCB0aW1lc3RhbXBSZWxhdGl2ZSA9IHRpbWVzdGFtcE1vbWVudC50d2l0dGVyU2hvcnQoKTtcclxuXHJcblx0JGVsLnRleHQodGltZXN0YW1wUmVsYXRpdmUpO1xyXG5cclxuXHRuZXh0KCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJOb2RlKG5vdywgZWwsIG5leHQpIHtcclxuXHRsZXQgJGVsID0gJChlbCk7XHJcblxyXG5cdGNvbnN0IGRhdGFFeHBpcmVzID0gJGVsLmF0dHIoJ2RhdGEtZXhwaXJlcycpO1xyXG5cdGNvbnN0IGV4cGlyZXMgPSBfLnBhcnNlSW50KGRhdGFFeHBpcmVzKTtcclxuXHRjb25zdCBzZWNSZW1haW5pbmcgPSAoZXhwaXJlcyAtIG5vdyk7XHJcblx0Y29uc3Qgc2VjRWxhcHNlZCA9IDMwMCAtIHNlY1JlbWFpbmluZztcclxuXHJcblx0Y29uc3QgaGlnaGxpdGVUaW1lID0gMTA7XHJcblx0Y29uc3QgaXNWaXNpYmxlID0gZXhwaXJlcyArIGhpZ2hsaXRlVGltZSA+PSBub3c7XHJcblx0Y29uc3QgaXNFeHBpcmVkID0gZXhwaXJlcyA8IG5vdztcclxuXHRjb25zdCBpc0FjdGl2ZSA9ICFpc0V4cGlyZWQ7XHJcblx0Y29uc3QgaXNUaW1lckhpZ2hsaWdodGVkID0gKHNlY1JlbWFpbmluZyA8PSBNYXRoLmFicyhoaWdobGl0ZVRpbWUpKTtcclxuXHRjb25zdCBpc1RpbWVyRnJlc2ggPSAoc2VjRWxhcHNlZCA8PSBoaWdobGl0ZVRpbWUpO1xyXG5cclxuXHJcblx0Y29uc3QgdGltZXJUZXh0ID0gKGlzQWN0aXZlKVxyXG5cdFx0PyBtb21lbnQoc2VjUmVtYWluaW5nICogMTAwMCkuZm9ybWF0KCdtOnNzJylcclxuXHRcdDogJzA6MDAnO1xyXG5cclxuXHJcblx0aWYgKGlzVmlzaWJsZSkge1xyXG5cdFx0bGV0ICRvYmplY3RpdmUgPSAkZWwuY2xvc2VzdCgnLm9iamVjdGl2ZScpO1xyXG5cdFx0bGV0IGhhc0NsYXNzSGlnaGxpZ2h0ID0gJGVsLmhhc0NsYXNzKCdoaWdobGlnaHQnKTtcclxuXHRcdGxldCBoYXNDbGFzc0ZyZXNoID0gJG9iamVjdGl2ZS5oYXNDbGFzcygnZnJlc2gnKTtcclxuXHJcblx0XHRpZiAoaXNUaW1lckhpZ2hsaWdodGVkICYmICFoYXNDbGFzc0hpZ2hsaWdodCkge1xyXG5cdFx0XHQkZWwuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoIWlzVGltZXJIaWdobGlnaHRlZCAmJiBoYXNDbGFzc0hpZ2hsaWdodCkge1xyXG5cdFx0XHQkZWwucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc1RpbWVyRnJlc2ggJiYgIWhhc0NsYXNzRnJlc2gpIHtcclxuXHRcdFx0JG9iamVjdGl2ZS5hZGRDbGFzcygnZnJlc2gnKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKCFpc1RpbWVyRnJlc2ggJiYgaGFzQ2xhc3NGcmVzaCkge1xyXG5cdFx0XHQkb2JqZWN0aXZlLnJlbW92ZUNsYXNzKCdmcmVzaCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRlbC50ZXh0KHRpbWVyVGV4dClcclxuXHRcdFx0LmZpbHRlcignLmluYWN0aXZlJylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpXHJcblx0XHRcdC5lbmQoKTtcclxuXHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0JGVsLmZpbHRlcignLmFjdGl2ZScpXHJcblx0XHRcdC5hZGRDbGFzcygnaW5hY3RpdmUnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0JylcclxuXHRcdC5lbmQoKTtcclxuXHR9XHJcblxyXG5cdG5leHQoKTtcclxufVxyXG4iLCJcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5jb25zdCBhcGkgPSByZXF1aXJlKCdsaWIvYXBpLmpzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNb2R1bGUgR2xvYmFsc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBndWlsZERlZmF1bHQgPSBJbW11dGFibGUuTWFwKHtcclxuXHQnbG9hZGVkJzogZmFsc2UsXHJcblx0J2xhc3RDbGFpbSc6IDAsXHJcblx0J2NsYWltcyc6IEltbXV0YWJsZS5NYXAoKSxcclxufSk7XHJcblxyXG5cclxuY29uc3QgbnVtUXVldWVDb25jdXJyZW50ID0gNDtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHVibGljIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTGliR3VpbGRzIHtcclxuXHRjb25zdHJ1Y3Rvcihjb21wb25lbnQpIHtcclxuXHRcdHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG5cclxuXHRcdHRoaXMuYXN5bmNHdWlsZFF1ZXVlID0gYXN5bmMucXVldWUoXHJcblx0XHRcdHRoaXMuZ2V0R3VpbGREZXRhaWxzLmJpbmQodGhpcyksXHJcblx0XHRcdG51bVF1ZXVlQ29uY3VycmVudFxyXG5cdFx0KTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHJcblx0b25NYXRjaERhdGEobWF0Y2hEZXRhaWxzKSB7XHJcblx0XHQvLyBsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5jb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0xpYkd1aWxkczo6b25NYXRjaERhdGEoKScpO1xyXG5cclxuXHRcdGNvbnN0IG9iamVjdGl2ZUNsYWltZXJzID0gbWF0Y2hEZXRhaWxzLmdldEluKFsnb2JqZWN0aXZlcycsICdjbGFpbWVycyddKTtcclxuXHRcdGNvbnN0IGNsYWltRXZlbnRzID0gIGdldEV2ZW50c0J5VHlwZShtYXRjaERldGFpbHMsICdjbGFpbScpO1xyXG5cdFx0Y29uc3QgZ3VpbGRzVG9Mb29rdXAgPSBnZXRVbmtub3duR3VpbGRzKHN0YXRlLmd1aWxkcywgb2JqZWN0aXZlQ2xhaW1lcnMsIGNsYWltRXZlbnRzKTtcclxuXHJcblx0XHQvLyBzZW5kIG5ldyBndWlsZHMgdG8gYXN5bmMgcXVldWUgbWFuYWdlciBmb3IgZGF0YSByZXRyaWV2YWxcclxuXHRcdGlmICghZ3VpbGRzVG9Mb29rdXAuaXNFbXB0eSgpKSB7XHJcblx0XHRcdHRoaXMuYXN5bmNHdWlsZFF1ZXVlLnB1c2goZ3VpbGRzVG9Mb29rdXAudG9BcnJheSgpKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0bGV0IG5ld0d1aWxkcyA9IHN0YXRlLmd1aWxkcztcclxuXHRcdG5ld0d1aWxkcyA9IGluaXRpYWxpemVHdWlsZHMobmV3R3VpbGRzLCBndWlsZHNUb0xvb2t1cCk7XHJcblx0XHRuZXdHdWlsZHMgPSBndWlsZHNQcm9jZXNzQ2xhaW1zKG5ld0d1aWxkcywgY2xhaW1FdmVudHMpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSBzdGF0ZSBpZiBuZWNlc3NhcnlcclxuXHRcdGlmICghSW1tdXRhYmxlLmlzKHN0YXRlLmd1aWxkcywgbmV3R3VpbGRzKSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZ3VpbGRzOjpvbk1hdGNoRGF0YSgpJywgJ2hhcyB1cGRhdGUnKTtcclxuXHRcdFx0dGhpcy5jb21wb25lbnQuc2V0U3RhdGUoe2d1aWxkczogbmV3R3VpbGRzfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBvbkNvbXBsZXRlKSB7XHJcblx0XHRsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQ7XHJcblx0XHRjb25zdCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZTtcclxuXHJcblx0XHRjb25zdCBoYXNEYXRhID0gc3RhdGUuZ3VpbGRzLmdldEluKFtndWlsZElkLCAnbG9hZGVkJ10pO1xyXG5cclxuXHRcdGlmIChoYXNEYXRhKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpnZXRHdWlsZERldGFpbHMoKScsICdza2lwJywgZ3VpbGRJZCk7XHJcblx0XHRcdG9uQ29tcGxldGUobnVsbCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1RyYWNrZXI6OmdldEd1aWxkRGV0YWlscygpJywgJ2xvb2t1cCcsIGd1aWxkSWQpO1xyXG5cdFx0XHRhcGkuZ2V0R3VpbGREZXRhaWxzKFxyXG5cdFx0XHRcdGd1aWxkSWQsXHJcblx0XHRcdFx0b25HdWlsZERhdGEuYmluZCh0aGlzLCBvbkNvbXBsZXRlKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpYkd1aWxkcztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uR3VpbGREYXRhKG9uQ29tcGxldGUsIGVyciwgZGF0YSkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudDtcclxuXHRsZXQgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdGlmIChjb21wb25lbnQubW91bnRlZCkge1xyXG5cdFx0aWYgKCFlcnIgJiYgZGF0YSkge1xyXG5cdFx0XHRkZWxldGUgZGF0YS5lbWJsZW07XHJcblx0XHRcdGRhdGEubG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdGNvbnN0IGd1aWxkSWQgPSBkYXRhLmd1aWxkX2lkO1xyXG5cdFx0XHRjb25zdCBndWlsZERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEpO1xyXG5cclxuXHRcdFx0Y29tcG9uZW50LnNldFN0YXRlKHN0YXRlID0+ICh7XHJcblx0XHRcdFx0Z3VpbGRzOiBzdGF0ZS5ndWlsZHMubWVyZ2VJbihbZ3VpbGRJZF0sIGd1aWxkRGF0YSlcclxuXHRcdFx0fSkpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdG9uQ29tcGxldGUobnVsbCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ3VpbGRzUHJvY2Vzc0NsYWltcyhndWlsZHMsIGNsYWltRXZlbnRzKSB7XHJcblx0Ly8gY29uc29sZS5sb2coJ2d1aWxkc1Byb2Nlc3NDbGFpbXMoKScsIGd1aWxkcy5zaXplKTtcclxuXHJcblx0cmV0dXJuIGd1aWxkcy5tYXAoXHJcblx0XHRndWlsZEF0dGFjaENsYWltcy5iaW5kKG51bGwsIGNsYWltRXZlbnRzKVxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ3VpbGRBdHRhY2hDbGFpbXMoY2xhaW1FdmVudHMsIGd1aWxkLCBndWlsZElkKSB7XHJcblx0Y29uc3QgaGFzQ2xhaW1zID0gIWd1aWxkLmdldCgnY2xhaW1zJykuaXNFbXB0eSgpO1xyXG5cdGNvbnN0IG5ld2VzdENsYWltID0gaGFzQ2xhaW1zID8gZ3VpbGQuZ2V0KCdjbGFpbXMnKS5maXJzdCgpIDogbnVsbDtcclxuXHJcblx0Y29uc3QgaW5jQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuXHRcdC5maWx0ZXIoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpID09PSBndWlsZElkKVxyXG5cdFx0LnRvTWFwKCk7XHJcblxyXG5cdGNvbnN0IGluY0hhc0NsYWltcyA9ICFpbmNDbGFpbXMuaXNFbXB0eSgpO1xyXG5cdGNvbnN0IGluY05ld2VzdENsYWltID0gaW5jSGFzQ2xhaW1zID8gaW5jQ2xhaW1zLmZpcnN0KCkgOiBudWxsO1xyXG5cclxuXHJcblx0Y29uc3QgaGFzTmV3Q2xhaW1zID0gKCFJbW11dGFibGUuaXMobmV3ZXN0Q2xhaW0sIGluY05ld2VzdENsYWltKSk7XHJcblxyXG5cclxuXHRpZiAoaGFzTmV3Q2xhaW1zKSB7XHJcblx0XHRjb25zdCBsYXN0Q2xhaW0gPSBpbmNIYXNDbGFpbXMgPyBpbmNOZXdlc3RDbGFpbS5nZXQoJ3RpbWVzdGFtcCcpIDogMDtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdjbGFpbXMgYWx0ZXJlZCcsIGd1aWxkSWQsIGhhc05ld0NsYWltcywgbGFzdENsYWltKTtcclxuXHRcdGd1aWxkID0gZ3VpbGQuc2V0KCdjbGFpbXMnLCBpbmNDbGFpbXMpO1xyXG5cdFx0Z3VpbGQgPSBndWlsZC5zZXQoJ2xhc3RDbGFpbScsIGxhc3RDbGFpbSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZ3VpbGQ7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUd1aWxkcyhndWlsZHMsIG5ld0d1aWxkcykge1xyXG5cdC8vIGNvbnNvbGUubG9nKCdpbml0aWFsaXplR3VpbGRzKCknKTtcclxuXHQvLyBjb25zb2xlLmxvZygnbmV3R3VpbGRzJywgbmV3R3VpbGRzKTtcclxuXHJcblx0bmV3R3VpbGRzLmZvckVhY2goZ3VpbGRJZCA9PiB7XHJcblx0XHRpZiAoIWd1aWxkcy5oYXMoZ3VpbGRJZCkpIHtcclxuXHRcdFx0bGV0IGd1aWxkID0gZ3VpbGREZWZhdWx0LnNldCgnZ3VpbGRfaWQnLCBndWlsZElkKTtcclxuXHRcdFx0Z3VpbGRzID0gZ3VpbGRzLnNldChndWlsZElkLCBndWlsZCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdHJldHVybiBndWlsZHM7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RXZlbnRzQnlUeXBlKG1hdGNoRGV0YWlscywgZXZlbnRUeXBlKSB7XHJcblx0cmV0dXJuIG1hdGNoRGV0YWlsc1xyXG5cdFx0LmdldCgnaGlzdG9yeScpXHJcblx0XHQuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgndHlwZScpID09PSBldmVudFR5cGUpXHJcblx0XHQuc29ydEJ5KGVudHJ5ID0+IC1lbnRyeS5nZXQoJ3RpbWVzdGFtcCcpKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRVbmtub3duR3VpbGRzKHN0YXRlR3VpbGRzLCBvYmplY3RpdmVDbGFpbWVycywgY2xhaW1FdmVudHMpIHtcclxuXHRjb25zdCBndWlsZHNXaXRoQ3VycmVudENsYWltcyA9IG9iamVjdGl2ZUNsYWltZXJzXHJcblx0XHQubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSlcclxuXHRcdC50b1NldCgpO1xyXG5cclxuXHRjb25zdCBndWlsZHNXaXRoUHJldmlvdXNDbGFpbXMgPSBjbGFpbUV2ZW50c1xyXG5cdFx0Lm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcblx0XHQudG9TZXQoKTtcclxuXHJcblx0Y29uc3QgZ3VpbGRDbGFpbXMgPSBndWlsZHNXaXRoQ3VycmVudENsYWltc1xyXG5cdFx0LnVuaW9uKGd1aWxkc1dpdGhQcmV2aW91c0NsYWltcyk7XHJcblxyXG5cclxuXHRjb25zdCBrbm93bkd1aWxkcyA9IHN0YXRlR3VpbGRzXHJcblx0XHQubWFwKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGRfaWQnKSlcclxuXHRcdC50b1NldCgpO1xyXG5cclxuXHRjb25zdCB1bmtub3duR3VpbGRzID0gZ3VpbGRDbGFpbXNcclxuXHRcdC5zdWJ0cmFjdChrbm93bkd1aWxkcyk7XHJcblxyXG5cclxuXHQvLyBjb25zb2xlLmxvZygnZ3VpbGRDbGFpbXMnLCBndWlsZENsYWltcy50b0FycmF5KCkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCdrbm93bkd1aWxkcycsIGtub3duR3VpbGRzLnRvQXJyYXkoKSk7XHJcblx0Ly8gY29uc29sZS5sb2coJ3Vua25vd25HdWlsZHMnLCB1bmtub3duR3VpbGRzLnRvQXJyYXkoKSk7XHJcblxyXG5cdHJldHVybiB1bmtub3duR3VpbGRzO1xyXG59Il19
