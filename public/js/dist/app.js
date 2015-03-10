(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/js/src/app.js":[function(require,module,exports){
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

},{"./Overview":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\index.js","./Tracker":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\index.js","./common/Langs":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Langs\\index.js","./lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js"}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\decode.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\encode.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\index.js":[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\decode.js","./encode":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\encode.js"}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2api\\lib\\getDataBrowser.js":[function(require,module,exports){
/*
*	package.json reqwrites to this from getData.js for Browserify
*/

"use strict";


module.exports = function requestJson(requestUrl, fnCallback) {
	requestClient(requestUrl, fnCallback);
};


function requestClient(requestUrl, fnCallback) {
	if (!window || !window.jQuery) {
		throw ('gw2api requires jQuery when used in the browser');
	}
	window.jQuery.getJSON(requestUrl)
		.done(function(data, textStatus, jqXHR) {
			fnCallback(null, data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			fnCallback({
				jqXHR: jqXHR,
				textStatus: textStatus,
				errorThrown: errorThrown
			});
		});
}

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2api\\main.js":[function(require,module,exports){
'use strict';

/*
*
*	https://github.com/fooey/node-gw2
*   http://wiki.guildwars2.com/wiki/API:Main
*
*/




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

	var requestUrl = endPoints['matchesState'];

	if (params.match_id) {
		requestUrl += '' + match_id;
	}

	get(requestUrl, {}, callback);
}


// REQUIRED: match_id || world_slug
function getMatchDetailsState(params, callback) {
	var requestUrl = endPoints['matchDetailsState'];

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

	requestJson(getFileRenderUrl(params), callback);
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
	var getData = require('./lib/getData.js');

	getData(apiUrl, callback);
}



function getApiUrl(requestUrl, params) {
	var qs = require('querystring');

	var requestUrl = (endPoints[requestUrl])
		? endPoints[requestUrl]
		: requestUrl;

	var query = qs.stringify(params);

	if (query.length) {
		requestUrl += '?' + query;
	}

	return requestUrl;
}


},{"./lib/getData.js":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2api\\lib\\getDataBrowser.js","querystring":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\browserify\\node_modules\\querystring-es3\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\langs.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_labels.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_map.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_meta.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_names.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_types.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\world_names.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js":[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\langs.js","./data/objective_labels":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_labels.js","./data/objective_map":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_map.js","./data/objective_meta":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_meta.js","./data/objective_names":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_names.js","./data/objective_types":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\objective_types.js","./data/world_names":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\data\\world_names.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\Match.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Match, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.match.get("scores"), nextProps.match.get("scores"));
				var newMatch = !Immutable.is(this.props.match.get("startTime"), nextProps.match.get("startTime"));
				var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
				var shouldUpdate = newScores || newMatch || newWorlds;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./MatchWorld":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\MatchWorld.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\MatchWorld.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MatchWorld, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.scores, nextProps.scores);
				var newColor = !Immutable.is(this.props.color, nextProps.color);
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var shouldUpdate = newScores || newColor || newWorld;

				// console.log('overview::MatchWorlds::shouldComponentUpdate()', shouldUpdate, newScores, newColor, newWorld);

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../common/Icons/Pie":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Pie.js","./Score":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\Score.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\Score.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Score, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.score !== nextProps.score;
			},
			writable: true,
			configurable: true
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var props = this.props;

				this.setState({ diff: nextProps.score - props.score });
			},
			writable: true,
			configurable: true
		},
		componentDidUpdate: {
			value: function componentDidUpdate() {
				var state = this.state;

				if (state.diff !== 0) {
					animateScoreDiff(this.refs.diff.getDOMNode());
				}
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Matches, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newRegion = !Immutable.is(this.props.region, nextProps.region);
				var newMatches = !Immutable.is(this.props.matches, nextProps.matches);
				var newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
				var shouldUpdate = newRegion || newMatches || newWorlds;

				// console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./Match":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\Match.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Worlds\\World.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(RegionWorldsWorld, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var shouldUpdate = newLang || newWorld;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Worlds\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Worlds, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.worlds, nextProps.worlds);
				var newRegion = !Immutable.is(this.props.region.get("worlds"), nextProps.region.get("worlds"));
				var shouldUpdate = newLang || newRegion;

				// console.log('overview::RegionWorlds::shouldComponentUpdate()', shouldUpdate, newLang, newRegion);

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./World":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Worlds\\World.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Overview, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var props = this.props;
				var state = this.state;

				var newLang = !Immutable.is(props.lang, nextProps.lang);
				var newMatchData = !Immutable.is(state.matchesByRegion, nextState.matchesByRegion);
				var shouldUpdate = newLang || newMatchData;

				// console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

				return shouldUpdate;
			},
			writable: true,
			configurable: true
		},
		componentWillMount: {
			value: function componentWillMount() {
				setPageTitle.call(this, this.props.lang);
				setWorlds.call(this, this.props.lang);

				getData.call(this);
			},
			writable: true,
			configurable: true
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				setPageTitle.call(this, nextProps.lang);
				setWorlds.call(this, nextProps.lang);
			},
			writable: true,
			configurable: true
		},
		componentWillUnmount: {
			value: function componentWillUnmount() {
				this.mounted = false;
				clearTimeout(this.timeouts.matchData);
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../lib/api":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\api.js","./../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js","./Matches":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Matches\\index.js","./Worlds":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Overview\\Worlds\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\Claims.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(GuildClaims, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newClaims = !Immutable.is(this.props.guild.get("claims"), nextProps.guild.get("claims"));

				var shouldUpdate = newLang || newClaims;
				// console.log('Claims::shouldComponentUpdate()', shouldUpdate, this.props.guild.get('guild_id'));

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"../Objectives":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\Guild.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Guild, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

				var shouldUpdate = newLang || newGuildData;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../common/Icons/Emblem":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Emblem.js","./Claims":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\Claims.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Guilds, null, {
		shouldComponentUpdate: {
			// constructor() {}
			// componentDidMount() {}

			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuildData = !Immutable.is(this.props.guilds, nextProps.guilds);

				var shouldUpdate = newLang || newGuildData;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./Guild":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\Guild.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\Entry.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Entry, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuild = !Immutable.is(this.props.guild, nextProps.guild);
				var newEntry = !Immutable.is(this.props.entry, nextProps.entry);

				var newFilters = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

				var shouldUpdate = newLang || newGuild || newEntry || newFilters;

				// console.log('Entry:render()', {newTriggerState, newFilters, shouldUpdate});

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"../Objectives":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\index.js","gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\EventFilters.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapFilters, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.eventFilter !== nextProps.eventFilter;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\LogEntries.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(LogEntries, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);

				var newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
				var newFilterState = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

				var shouldUpdate = newLang || newGuilds || newTriggerState || newFilterState;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			,
			writable: true,
			configurable: true
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

},{"./Entry":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\Entry.js","gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\MapFilters.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapFilters, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return this.props.mapFilter !== nextProps.mapFilter;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Log, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newHistory = !Immutable.is(this.props.details.get("history"), nextProps.details.get("history"));

				var newMapFilter = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
				var newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);

				var shouldUpdate = newLang || newGuilds || newHistory || newMapFilter || newEventFilter;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
		},
		componentDidMount: {
			value: function componentDidMount() {
				this.setState({ triggerNotification: true });
			},
			writable: true,
			configurable: true
		},
		componentDidUpdate: {
			value: function componentDidUpdate() {
				if (!this.state.triggerNotification) {
					this.setState({ triggerNotification: true });
				}
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./EventFilters":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\EventFilters.js","./LogEntries":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\LogEntries.js","./MapFilters":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\MapFilters.js","gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapDetails.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapDetails, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);

				var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js","./MapScores":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapScores.js","./MapSection":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapSection.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapScores.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapScores, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newScores = !Immutable.is(this.props.scores, nextProps.scores);

				var shouldUpdate = newScores;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapSection.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapSection, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);

				var shouldUpdate = newLang || newGuilds || newDetails;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../Objectives":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Maps, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
				var newDetails = !Immutable.is(this.props.details, nextProps.details);
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);

				var shouldUpdate = newLang || newGuilds || newDetails || newWorlds;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../Log":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Log\\index.js","./MapDetails":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\MapDetails.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Guild.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Guild, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newGuild = !Immutable.is(this.props.guildId, nextProps.guildId);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
				var shouldUpdate = newGuild || newGuildData;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../common/Icons/Emblem":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Emblem.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Icons.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Icons, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newColor = !Immutable.is(this.props.color, nextProps.color);
				var shouldUpdate = newColor;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../common/Icons/Arrow":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Arrow.js","./../../common/Icons/Sprite":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Sprite.js","./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Label.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Label, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var shouldUpdate = newLang;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\MapName.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(MapName, null, {
		shouldComponentUpdate: {
			// map name can never change, not localized

			value: function shouldComponentUpdate() {
				return false;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\TimerCountdown.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(TimeCountdown, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\TimerRelative.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(TimerRelative, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Timestamp.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Timestamp, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var shouldUpdate = newTimestamp;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Objective, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);
				var newCapture = !Immutable.is(this.props.timestamp, nextProps.timestamp);
				var newOwner = !Immutable.is(this.props.worldColor, nextProps.worldColor);
				var newClaimer = !Immutable.is(this.props.guildId, nextProps.guildId);
				var newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

				var shouldUpdate = newLang || newCapture || newOwner || newClaimer || newGuildData;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js","./Guild":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Guild.js","./Icons":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Icons.js","./Label":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Label.js","./MapName":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\MapName.js","./TimerCountdown":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\TimerCountdown.js","./TimerRelative":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\TimerRelative.js","./Timestamp":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Objectives\\Timestamp.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\Holdings\\Item.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(HoldingsItem, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newQuantity = this.props.typeQuantity !== nextProps.typeQuantity;
				var newType = this.props.typeId !== nextProps.typeId;
				var newColor = this.props.color !== nextProps.color;
				var shouldUpdate = newQuantity || newType || newColor;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var newType = this.props.typeId !== nextProps.typeId;

				if (newType) {
					this.setState({ oType: STATIC.objective_types.get(this.props.typeId) });
				}
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../../../common/Icons/Sprite":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Sprite.js","./../../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\Holdings\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Holdings, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newHoldings = !Immutable.is(this.props.holdings, nextProps.holdings);
				var shouldUpdate = newHoldings;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./Item":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\Holdings\\Item.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\World.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(World, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newWorld = !Immutable.is(this.props.world, nextProps.world);
				var newScore = this.props.score !== nextProps.score;
				var newTick = this.props.tick !== nextProps.tick;
				var newHoldings = this.props.holdings !== nextProps.holdings;
				var shouldUpdate = newWorld || newScore || newTick || newHoldings;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./Holdings":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\Holdings\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Scoreboard, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
				var newScores = !Immutable.is(this.props.match.get("scores"), nextProps.match.get("scores"));
				var shouldUpdate = newWorlds || newScores;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./World":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\World.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Tracker, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps, nextState) {
				var initialData = !_.isEqual(this.state.hasData, nextState.hasData);
				var newMatchData = !_.isEqual(this.state.lastmod, nextState.lastmod);

				var newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);

				var shouldUpdate = initialData || newMatchData || newGuildData || newLang;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
		},
		componentDidMount: {
			value: function componentDidMount() {
				console.log("Tracker::componentDidMount()");

				this.intervals.timers = setInterval(updateTimers.bind(this), 1000);
				setImmediate(updateTimers.bind(this));

				setImmediate(getMatchDetails.bind(this));
			},
			writable: true,
			configurable: true
		},
		componentWillUnmount: {
			value: function componentWillUnmount() {
				console.log("Tracker::componentWillUnmount()");

				clearTimers.call(this);

				this.mounted = false;
			},
			writable: true,
			configurable: true
		},
		componentWillReceiveProps: {
			value: function componentWillReceiveProps(nextProps) {
				var newLang = !Immutable.is(this.props.lang, nextProps.lang);

				console.log("componentWillReceiveProps()", newLang);

				if (newLang) {
					setMatchWorlds.call(this, nextProps.lang);
				}
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../lib/api.js":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\api.js","./../lib/date.js":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\date.js","./../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js","./../lib/tracker/guilds.js":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\tracker\\guilds.js","./../lib/trackerTimers":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\trackerTimers.js","./Guilds":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Guilds\\index.js","./Maps":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Maps\\index.js","./Scoreboard":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\Tracker\\Scoreboard\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Arrow.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Arrow, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newObjectiveMeta = !Immutable.is(this.props.oMeta, nextProps.oMeta);
				var shouldUpdate = newObjectiveMeta;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var imgSrc = getArrowSrc(this.props.oMeta);

				return React.createElement(
					"span",
					{ className: "direction" },
					imgSrc ? React.createElement("img", { src: imgSrc }) : null
				);
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Emblem.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Emblem, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				var newGuildName = this.props.guildName !== nextProps.guildName;
				var newSize = this.props.size !== nextProps.size;

				var shouldUpdate = newGuildName || newSize;

				return shouldUpdate;
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Pie.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Pie, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return !Immutable.is(this.props.scores, nextProps.scores);
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Icons\\Sprite.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Sprite, null, {
		shouldComponentUpdate: {
			value: function shouldComponentUpdate(nextProps) {
				return !_.isEqual(this.props, nextProps);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var props = this.props;

				return React.createElement("span", { className: "sprite " + props.type + " " + props.color });
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Langs\\LangLink.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(LangLink, null, {
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
			},
			writable: true,
			configurable: true
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Langs\\index.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(Langs, null, {
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
			},
			writable: true,
			configurable: true
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

},{"./../../lib/static":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js","./LangLink":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\common\\Langs\\LangLink.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\api.js":[function(require,module,exports){
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

},{"gw2api":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2api\\main.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\date.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\static.js":[function(require,module,exports){
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

},{"gw2w2w-static":"D:\\inet\\heroku\\gw2w2w-react\\node_modules\\gw2w2w-static\\index.js"}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\trackerTimers.js":[function(require,module,exports){
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

},{}],"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\tracker\\guilds.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

	_prototypeProperties(LibGuilds, null, {
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
			},
			writable: true,
			configurable: true
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
			},
			writable: true,
			configurable: true
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

},{"./../api.js":"D:\\inet\\heroku\\gw2w2w-react\\public\\js\\src\\lib\\api.js"}]},{},["./public/js/src/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbGliL2dldERhdGFCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21ldGEuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2hXb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvU2NvcmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9DbGFpbXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRW50cnkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FdmVudEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9Mb2dFbnRyaWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTWFwRmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcERldGFpbHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2NvcmVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNlY3Rpb24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvSWNvbnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTGFiZWwuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTWFwTmFtZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lckNvdW50ZG93bi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lclJlbGF0aXZlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVzdGFtcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9JdGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9BcnJvdy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9FbWJsZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvUGllLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1Nwcml0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9MYW5nTGluay5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9zdGF0aWMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvdHJhY2tlclRpbWVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi90cmFja2VyL2d1aWxkcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQ1FBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7OztBQVFyQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7Ozs7QUFZbkMsQ0FBQyxDQUFDLFlBQVc7QUFDWixhQUFZLEVBQUUsQ0FBQztBQUNmLGFBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNsQixDQUFDLENBQUM7Ozs7Ozs7O0FBWUgsU0FBUyxZQUFZLEdBQUc7QUFDdkIsS0FBTSxTQUFTLEdBQUc7QUFDakIsVUFBUSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQzlDLFNBQU8sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUMzQyxDQUFDOztBQUdGLEtBQUksQ0FBQyw4Q0FBOEMsRUFBRSxVQUFTLEdBQUcsRUFBRTtBQUNsRSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxN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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDallBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5L0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxP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QU8sWUFBWSxDQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLENBQ2QsTUFBTSxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUztFQUFBLENBQUMsQ0FDaEQsTUFBTSxDQUFDLFVBQUEsS0FBSztTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7RUFBQSxDQUFDLENBQUM7Q0FDM0M7O0FBSUQsU0FBUyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFO0FBQ3RFLEtBQU0sdUJBQXVCLEdBQUcsaUJBQWlCLENBQy9DLEdBQUcsQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztFQUFBLENBQUMsQ0FDaEMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSx3QkFBd0IsR0FBRyxXQUFXLENBQzFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztFQUFBLENBQUMsQ0FDaEMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSxXQUFXLEdBQUcsdUJBQXVCLENBQ3pDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUdsQyxLQUFNLFdBQVcsR0FBRyxXQUFXLENBQzdCLEdBQUcsQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztFQUFBLENBQUMsQ0FDbkMsS0FBSyxFQUFFLENBQUM7O0FBRVYsS0FBTSxhQUFhLEdBQUcsV0FBVyxDQUMvQixRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7OztBQU94QixRQUFPLGFBQWEsQ0FBQztDQUNyQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBwYWdlID0gcmVxdWlyZSgncGFnZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBMYW5ncyA9IHJlcXVpcmUoJ2NvbW1vbi9MYW5ncycpO1xyXG5jb25zdCBPdmVydmlldyA9IHJlcXVpcmUoJ092ZXJ2aWV3Jyk7XHJcbmNvbnN0IFRyYWNrZXIgPSByZXF1aXJlKCdUcmFja2VyJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRET00gUmVhZHlcclxuKlxyXG4qL1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRhdHRhY2hSb3V0ZXMoKTtcclxuXHRzZXRJbW1lZGlhdGUoZW1sKTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRSb3V0ZXNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYXR0YWNoUm91dGVzKCkge1xyXG5cdGNvbnN0IGRvbU1vdW50cyA9IHtcclxuXHRcdG5hdkxhbmdzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWxhbmdzJyksXHJcblx0XHRjb250ZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxyXG5cdH07XHJcblxyXG5cclxuXHRwYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspPycsIGZ1bmN0aW9uKGN0eCkge1xyXG5cdFx0Y29uc3QgbGFuZ1NsdWcgPSBjdHgucGFyYW1zLmxhbmdTbHVnO1xyXG5cdFx0Y29uc3QgbGFuZyA9IFNUQVRJQy5sYW5ncy5nZXQobGFuZ1NsdWcpO1xyXG5cclxuXHJcblx0XHRjb25zdCB3b3JsZFNsdWcgPSBjdHgucGFyYW1zLndvcmxkU2x1ZztcclxuXHRcdGNvbnN0IHdvcmxkID0gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKTtcclxuXHJcblxyXG5cdFx0bGV0IEFwcCA9IE92ZXJ2aWV3O1xyXG5cdFx0bGV0IHByb3BzID0ge2xhbmd9O1xyXG5cclxuXHRcdGlmICh3b3JsZCAmJiBJbW11dGFibGUuTWFwLmlzTWFwKHdvcmxkKSAmJiAhd29ybGQuaXNFbXB0eSgpKSB7XHJcblx0XHRcdEFwcCA9IFRyYWNrZXI7XHJcblx0XHRcdHByb3BzLndvcmxkID0gd29ybGQ7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdFJlYWN0LnJlbmRlcig8TGFuZ3Mgey4uLnByb3BzfSAvPiwgZG9tTW91bnRzLm5hdkxhbmdzKTtcclxuXHRcdFJlYWN0LnJlbmRlcig8QXBwIHsuLi5wcm9wc30gLz4sIGRvbU1vdW50cy5jb250ZW50KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyByZWRpcmVjdCAnLycgdG8gJy9lbidcclxuXHRwYWdlKCcvJywgcmVkaXJlY3RQYWdlLmJpbmQobnVsbCwgJy9lbicpKTtcclxuXHJcblxyXG5cclxuXHJcblx0cGFnZS5zdGFydCh7XHJcblx0XHRjbGljazogdHJ1ZSxcclxuXHRcdHBvcHN0YXRlOiB0cnVlLFxyXG5cdFx0ZGlzcGF0Y2g6IHRydWUsXHJcblx0XHRoYXNoYmFuZzogZmFsc2UsXHJcblx0XHRkZWNvZGVVUkxDb21wb25lbnRzIDogdHJ1ZSxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0VXRpbFxyXG4qXHJcbiovXHJcbmZ1bmN0aW9uIHJlZGlyZWN0UGFnZShkZXN0aW5hdGlvbikge1xyXG5cdHBhZ2UucmVkaXJlY3QoZGVzdGluYXRpb24pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFdvcmxkRnJvbVNsdWcobGFuZ1NsdWcsIHdvcmxkU2x1Zykge1xyXG5cdHJldHVybiBTVEFUSUMud29ybGRzXHJcblx0XHQuZmluZCh3b3JsZCA9PiB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pID09PSB3b3JsZFNsdWcpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGVtbCgpIHtcclxuXHRjb25zdCBjaHVua3MgPSBbJ2d3MncydycsICdzY2h0dXBoJywgJ2NvbScsICdAJywgJy4nXTtcclxuXHRjb25zdCBhZGRyID0gW2NodW5rc1swXSwgY2h1bmtzWzNdLCBjaHVua3NbMV0sIGNodW5rc1s0XSwgY2h1bmtzWzJdXS5qb2luKCcnKTtcclxuXHJcblx0JCgnLm5vc3BhbS1wcnonKS5lYWNoKChpLCBlbCkgPT4ge1xyXG5cdFx0JChlbCkucmVwbGFjZVdpdGgoXHJcblx0XHRcdCQoJzxhPicsIHtocmVmOiBgbWFpbHRvOiR7YWRkcn1gLCB0ZXh0OiBhZGRyfSlcclxuXHRcdCk7XHJcblx0fSk7XHJcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIi8qXHJcbipcdHBhY2thZ2UuanNvbiByZXF3cml0ZXMgdG8gdGhpcyBmcm9tIGdldERhdGEuanMgZm9yIEJyb3dzZXJpZnlcclxuKi9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVxdWVzdEpzb24ocmVxdWVzdFVybCwgZm5DYWxsYmFjaykge1xyXG5cdHJlcXVlc3RDbGllbnQocmVxdWVzdFVybCwgZm5DYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gcmVxdWVzdENsaWVudChyZXF1ZXN0VXJsLCBmbkNhbGxiYWNrKSB7XHJcblx0aWYgKCF3aW5kb3cgfHwgIXdpbmRvdy5qUXVlcnkpIHtcclxuXHRcdHRocm93ICgnZ3cyYXBpIHJlcXVpcmVzIGpRdWVyeSB3aGVuIHVzZWQgaW4gdGhlIGJyb3dzZXInKTtcclxuXHR9XHJcblx0d2luZG93LmpRdWVyeS5nZXRKU09OKHJlcXVlc3RVcmwpXHJcblx0XHQuZG9uZShmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xyXG5cdFx0XHRmbkNhbGxiYWNrKG51bGwsIGRhdGEpO1xyXG5cdFx0fSlcclxuXHRcdC5mYWlsKGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG5cdFx0XHRmbkNhbGxiYWNrKHtcclxuXHRcdFx0XHRqcVhIUjoganFYSFIsXHJcblx0XHRcdFx0dGV4dFN0YXR1czogdGV4dFN0YXR1cyxcclxuXHRcdFx0XHRlcnJvclRocm93bjogZXJyb3JUaHJvd25cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdGh0dHBzOi8vZ2l0aHViLmNvbS9mb29leS9ub2RlLWd3MlxyXG4qICAgaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6TWFpblxyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBERUZJTkUgRVhQT1JUXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Z2V0TWF0Y2hlc1N0YXRlOiBnZXRNYXRjaGVzU3RhdGUsXHJcblx0Z2V0T2JqZWN0aXZlTmFtZXM6IGdldE9iamVjdGl2ZU5hbWVzLFxyXG5cdGdldE1hdGNoRGV0YWlsczogZ2V0TWF0Y2hEZXRhaWxzLFxyXG5cdGdldE1hdGNoRGV0YWlsc1N0YXRlOiBnZXRNYXRjaERldGFpbHNTdGF0ZSxcclxuXHJcblx0Z2V0SXRlbXM6IGdldEl0ZW1zLFxyXG5cdGdldEl0ZW1EZXRhaWxzOiBnZXRJdGVtRGV0YWlscyxcclxuXHRnZXRSZWNpcGVzOiBnZXRSZWNpcGVzLFxyXG5cdGdldFJlY2lwZURldGFpbHM6IGdldFJlY2lwZURldGFpbHMsXHJcblxyXG5cdGdldFdvcmxkTmFtZXM6IGdldFdvcmxkTmFtZXMsXHJcblx0Z2V0R3VpbGREZXRhaWxzOiBnZXRHdWlsZERldGFpbHMsXHJcblxyXG5cdGdldE1hcE5hbWVzOiBnZXRNYXBOYW1lcyxcclxuXHRnZXRDb250aW5lbnRzOiBnZXRDb250aW5lbnRzLFxyXG5cdGdldE1hcHM6IGdldE1hcHMsXHJcblx0Z2V0TWFwRmxvb3I6IGdldE1hcEZsb29yLFxyXG5cclxuXHRnZXRCdWlsZDogZ2V0QnVpbGQsXHJcblx0Z2V0Q29sb3JzOiBnZXRDb2xvcnMsXHJcblxyXG5cdGdldEZpbGVzOiBnZXRGaWxlcyxcclxuXHRnZXRGaWxlOiBnZXRGaWxlLFxyXG5cdGdldEZpbGVSZW5kZXJVcmw6IGdldEZpbGVSZW5kZXJVcmwsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQUklWQVRFIFBST1BFUlRJRVNcclxuKlxyXG4qL1xyXG5cclxudmFyIGVuZFBvaW50cyA9IHtcclxuXHR3b3JsZE5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YyL3dvcmxkcz9wYWdlPTBcclxuXHJcblx0Z3VpbGREZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvZ3VpbGRfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2d1aWxkX2RldGFpbHNcclxuXHJcblx0aXRlbXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9pdGVtcy5qc29uJyxcdFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvaXRlbXNcclxuXHRpdGVtRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tdjEvaXRlbV9kZXRhaWxzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtX2RldGFpbHNcclxuXHRyZWNpcGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlcy5qc29uJyxcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZXNcclxuXHRyZWNpcGVEZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvcmVjaXBlX2RldGFpbHMuanNvbicsXHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9yZWNpcGVfZGV0YWlsc1xyXG5cclxuXHRtYXBOYW1lczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9uYW1lcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfbmFtZXNcclxuXHRjb250aW5lbnRzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvY29udGluZW50cy5qc29uJyxcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvY29udGluZW50c1xyXG5cdG1hcHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBzLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBzXHJcblx0bWFwRmxvb3I6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9tYXBfZmxvb3IuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvbWFwX2Zsb29yXHJcblxyXG5cdG9iamVjdGl2ZU5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L29iamVjdGl2ZV9uYW1lcy5qc29uJyxcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoZXNcclxuXHRtYXRjaGVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoZXMuanNvbicsXHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvd3Z3L21hdGNoX2RldGFpbHNcclxuXHRtYXRjaERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hfZGV0YWlscy5qc29uJyxcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvb2JqZWN0aXZlX25hbWVzXHJcblxyXG5cdG1hdGNoZXNTdGF0ZTogJ2h0dHA6Ly9zdGF0ZS5ndzJ3MncuY29tL21hdGNoZXMnLFxyXG5cdG1hdGNoRGV0YWlsc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vJyxcclxufTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFVCTElDIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRXT1JMRCB2cyBXT1JMRFxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0T2JqZWN0aXZlTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ29iamVjdGl2ZU5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ21hdGNoZXMnLCB7fSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHR2YXIgd3Z3X21hdGNoZXMgPSAoZGF0YSAmJiBkYXRhLnd2d19tYXRjaGVzKSA/IGRhdGEud3Z3X21hdGNoZXMgOiBbXTtcclxuXHRcdGNhbGxiYWNrKGVyciwgd3Z3X21hdGNoZXMpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHR0aHJvdyAoJ21hdGNoX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnbWF0Y2hEZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWF0Y2hfaWRcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHZhciByZXF1ZXN0VXJsID0gZW5kUG9pbnRzWydtYXRjaGVzU3RhdGUnXTtcclxuXHJcblx0aWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnJyArIG1hdGNoX2lkO1xyXG5cdH1cclxuXHJcblx0Z2V0KHJlcXVlc3RVcmwsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogbWF0Y2hfaWQgfHwgd29ybGRfc2x1Z1xyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHNTdGF0ZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHNbJ21hdGNoRGV0YWlsc1N0YXRlJ107XHJcblxyXG5cdGlmICghcGFyYW1zLm1hdGNoX2lkICYmICFwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgbWF0Y2hfaWQgb3Igd29ybGRfc2x1ZyBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gcGFyYW1zLm1hdGNoX2lkO1xyXG5cdH1cclxuXHRlbHNlIGlmIChwYXJhbXMud29ybGRfc2x1Zykge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnd29ybGQvJyArIHBhcmFtcy53b3JsZF9zbHVnO1xyXG5cdH1cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRHRU5FUkFMXHJcbiovXHJcblxyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmcsIGlkc1xyXG5mdW5jdGlvbiBnZXRXb3JsZE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdGlmICghcGFyYW1zLmlkcykge1xyXG5cdFx0cGFyYW1zLnBhZ2UgPSAwO1xyXG5cdH1cclxuXHRlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5pZHMpKSB7XHJcblx0XHRwYXJhbXMuaWRzID0gcGFyYW1zLmlkcy5qb2luKCcsJyk7XHJcblx0fVxyXG5cdGdldCgnd29ybGROYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBndWlsZF9pZCB8fCBndWlsZF9uYW1lIChpZCB0YWtlcyBwcmlvcml0eSlcclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5ndWlsZF9pZCAmJiAhcGFyYW1zLmd1aWxkX25hbWUpIHtcclxuXHRcdHRocm93ICgnRWl0aGVyIGd1aWxkX2lkIG9yIGd1aWxkX25hbWUgbXVzdCBiZSBwYXNzZWQnKTtcclxuXHR9XHJcblxyXG5cdGdldCgnZ3VpbGREZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0SVRFTVNcclxuKi9cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRJdGVtcyhjYWxsYmFjaykge1xyXG5cdGdldCgnaXRlbXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGl0ZW1faWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0SXRlbURldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLml0ZW1faWQpIHtcclxuXHRcdHRocm93ICgnaXRlbV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ2l0ZW1EZXRhaWxzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0UmVjaXBlcyhjYWxsYmFjaykge1xyXG5cdGdldCgncmVjaXBlcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIFJFUVVJUkVEOiByZWNpcGVfaWRcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0UmVjaXBlRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMucmVjaXBlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ3JlY2lwZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ3JlY2lwZURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNQVAgSU5GT1JNQVRJT05cclxuKi9cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcE5hbWVzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XHJcblx0XHRwYXJhbXMgPSB7fTtcclxuXHR9XHJcblx0Z2V0KCdtYXBOYW1lcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0Q29udGluZW50cyhjYWxsYmFjaykge1xyXG5cdGdldCgnY29udGluZW50cycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbWFwX2lkLCBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBjb250aW5lbnRfaWQsIGZsb29yXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldE1hcEZsb29yKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5jb250aW5lbnRfaWQpIHtcclxuXHRcdHRocm93ICgnY29udGluZW50X2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmxvb3IpIHtcclxuXHRcdHRocm93ICgnZmxvb3IgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXBGbG9vcicsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0TWlzY2VsbGFuZW91c1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEJ1aWxkKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdidWlsZCcsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRDb2xvcnMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ2NvbG9ycycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gTk8gUEFSQU1TXHJcbi8vIHRvIGdldCBmaWxlczogaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS97c2lnbmF0dXJlfS97ZmlsZV9pZH0ue2Zvcm1hdH1cclxuZnVuY3Rpb24gZ2V0RmlsZXMoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2ZpbGVzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBVVElMSVRZIE1FVEhPRFNcclxuKlxyXG4qL1xyXG5cclxuXHJcbi8vIFNQRUNJQUwgQ0FTRVxyXG4vLyBSRVFVSVJFRDogc2lnbmF0dXJlLCBmaWxlX2lkLCBmb3JtYXRcclxuZnVuY3Rpb24gZ2V0RmlsZShwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuc2lnbmF0dXJlKSB7XHJcblx0XHR0aHJvdyAoJ3NpZ25hdHVyZSBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZpbGVfaWQpIHtcclxuXHRcdHRocm93ICgnZmlsZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZvcm1hdCkge1xyXG5cdFx0dGhyb3cgKCdmb3JtYXQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblxyXG5cdHJlcXVlc3RKc29uKGdldEZpbGVSZW5kZXJVcmwocGFyYW1zKSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IHNpZ25hdHVyZSwgZmlsZV9pZCwgZm9ybWF0XHJcbmZ1bmN0aW9uIGdldEZpbGVSZW5kZXJVcmwocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLnNpZ25hdHVyZSkge1xyXG5cdFx0dGhyb3cgKCdzaWduYXR1cmUgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5maWxlX2lkKSB7XHJcblx0XHR0aHJvdyAoJ2ZpbGVfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mb3JtYXQpIHtcclxuXHRcdHRocm93ICgnZm9ybWF0IGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyVXJsID0gKFxyXG5cdFx0J2h0dHBzOi8vcmVuZGVyLmd1aWxkd2FyczIuY29tL2ZpbGUvJ1xyXG5cdFx0KyBwYXJhbXMuc2lnbmF0dXJlXHJcblx0XHQrICcvJ1xyXG5cdFx0KyBwYXJhbXMuZmlsZV9pZFxyXG5cdFx0KyAnLidcclxuXHRcdCsgcGFyYW1zLmZvcm1hdFxyXG5cdCk7XHJcblx0cmV0dXJuIHJlbmRlclVybDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXQoa2V5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuXHR2YXIgYXBpVXJsID0gZ2V0QXBpVXJsKGtleSwgcGFyYW1zKTtcclxuXHR2YXIgZ2V0RGF0YSA9IHJlcXVpcmUoJy4vbGliL2dldERhdGEuanMnKTtcclxuXHJcblx0Z2V0RGF0YShhcGlVcmwsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRBcGlVcmwocmVxdWVzdFVybCwgcGFyYW1zKSB7XHJcblx0dmFyIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcclxuXHJcblx0dmFyIHJlcXVlc3RVcmwgPSAoZW5kUG9pbnRzW3JlcXVlc3RVcmxdKVxyXG5cdFx0PyBlbmRQb2ludHNbcmVxdWVzdFVybF1cclxuXHRcdDogcmVxdWVzdFVybDtcclxuXHJcblx0dmFyIHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KHBhcmFtcyk7XHJcblxyXG5cdGlmIChxdWVyeS5sZW5ndGgpIHtcclxuXHRcdHJlcXVlc3RVcmwgKz0gJz8nICsgcXVlcnk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVxdWVzdFVybDtcclxufVxyXG5cclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogXCIxXCIsIFwiZW5cIjogXCJPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmVcIiwgXCJlc1wiOiBcIk1pcmFkb3JcIiwgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiBcIjJcIiwgXCJlblwiOiBcIlZhbGxleVwiLCBcImZyXCI6IFwiVmFsbMOpZVwiLCBcImVzXCI6IFwiVmFsbGVcIiwgXCJkZVwiOiBcIlRhbFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogXCIzXCIsIFwiZW5cIjogXCJMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlc1wiLCBcImVzXCI6IFwiVmVnYVwiLCBcImRlXCI6IFwiVGllZmxhbmRcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IFwiNFwiLCBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLCBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCIsIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiBcIjVcIiwgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIiwgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIiwgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLCBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogXCI2XCIsIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIiwgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsIFwiZGVcIjogXCJTcGVsZGFuIEthaGxzY2hsYWdcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IFwiN1wiLCBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIiwgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IFwiOFwiLCBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLCBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIiwgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIiwgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IFwiOVwiLCBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLCBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIiwgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLCBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogXCIxMFwiLCBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIiwgXCJmclwiOiBcIkNhcnJpw6hyZSBkZXMgdm9sZXVyc1wiLCBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLCBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IFwiMTFcIiwgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIiwgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIiwgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIiwgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiBcIjEyXCIsIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsIFwiZnJcIjogXCJQaXN0ZSBkdSBSdWlzc2VhdSBzYXV2YWdlXCIsIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsIFwiZGVcIjogXCJXaWxkYmFjaHN0cmVja2VcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiBcIjEzXCIsIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLCBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIiwgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIiwgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiBcIjE0XCIsIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIiwgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiLCBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiBcIjE1XCIsIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiLCBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsIFwiZGVcIjogXCJMYW5nb3IgLSBTY2hsdWNodFwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IFwiMTZcIiwgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLCBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIiwgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLCBcImRlXCI6IFwiUXVlbnRpbnNlZVwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IFwiMTdcIiwgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLCBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiLCBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogXCIxOFwiLCBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLCBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIiwgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIiwgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiBcIjE5XCIsIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCIsIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIiwgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IFwiMjBcIiwgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCIsIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IFwiMjFcIiwgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIiwgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IFwiMjJcIiwgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLCBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCIsIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IFwiMjNcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogXCIyNFwiLCBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lbnNlXCIsIFwiZnJcIjogXCJGaWVmIGR1IGNoYW1waW9uXCIsIFwiZXNcIjogXCJEb21pbmlvIGRlbCBDYW1wZcOzblwiLCBcImRlXCI6IFwiTGFuZGd1dCBkZXMgQ2hhbXBpb25zXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogXCIyNVwiLCBcImVuXCI6IFwiUmVkYnJpYXJcIiwgXCJmclwiOiBcIkJydXllcm91Z2VcIiwgXCJlc1wiOiBcIlphcnphcnJvamFcIiwgXCJkZVwiOiBcIlJvdGRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogXCIyNlwiLCBcImVuXCI6IFwiR3JlZW5sYWtlXCIsIFwiZnJcIjogXCJMYWMgVmVydFwiLCBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnNlZVwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IFwiMjdcIiwgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIiwgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsIFwiZGVcIjogXCJCdWNodCBkZXMgQXVmc3RpZWdzXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogXCIyOFwiLCBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsIFwiZnJcIjogXCJQcm9tb250b2lyZSBkZSBsJ2F1YmVcIiwgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZGFtbWVydW5nXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogXCIyOVwiLCBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsIFwiZnJcIjogXCJMJ2FudHJlIGRlcyBlc3ByaXRzXCIsIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLCBcImRlXCI6IFwiRGVyIEdlaXN0ZXJob2xtXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogXCIzMFwiLCBcImVuXCI6IFwiV29vZGhhdmVuXCIsIFwiZnJcIjogXCJHZW50ZXN5bHZlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsIFwiZGVcIjogXCJXYWxkIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogXCIzMVwiLCBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIiwgXCJkZVwiOiBcIkFza2FsaW9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogXCIzMlwiLCBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIiwgXCJkZVwiOiBcIkV0aGVyb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiBcIjMzXCIsIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiLCBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogXCIzNFwiLCBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IHZhaW5xdWV1clwiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsIFwiZGVcIjogXCJTaWVnZXIgLSBIw7x0dGVcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiBcIjM1XCIsIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsIFwiZnJcIjogXCJWZXJ0ZWJyYW5jaGVcIiwgXCJlc1wiOiBcIlphcnphdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IFwiMzZcIiwgXCJlblwiOiBcIkJsdWVsYWtlXCIsIFwiZnJcIjogXCJMYWMgYmxldVwiLCBcImVzXCI6IFwiTGFnb2F6dWxcIiwgXCJkZVwiOiBcIkJsYXVzZWVcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiBcIjM3XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IFwiMzhcIiwgXCJlblwiOiBcIkxvbmd2aWV3XCIsIFwiZnJcIjogXCJMb25ndWV2dWVcIiwgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsIFwiZGVcIjogXCJXZWl0c2ljaHRcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiBcIjM5XCIsIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIiwgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCIsIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLCBcImRlXCI6IFwiRGFzIEdvdHRzY2h3ZXJ0XCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogXCI0MFwiLCBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCIsIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIiwgXCJkZVwiOiBcIkZlbHN3YW5kXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogXCI0MVwiLCBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGRlIFNoYWRhcmFuXCIsIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsIFwiZGVcIjogXCJTaGFkYXJhbiBIw7xnZWxcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiBcIjQyXCIsIFwiZW5cIjogXCJSZWRsYWtlXCIsIFwiZnJcIjogXCJSb3VnZWxhY1wiLCBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsIFwiZGVcIjogXCJSb3RzZWVcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiBcIjQzXCIsIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLCBcImRlXCI6IFwiSMO8dHRlIGRlcyBIZWxkZW5cIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiBcIjQ0XCIsIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiLCBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLCBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwgLSBCdWNodFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IFwiNDVcIiwgXCJlblwiOiBcIkJsdWVicmlhclwiLCBcImZyXCI6IFwiQnJ1eWF6dXJcIiwgXCJlc1wiOiBcIlphcnphenVsXCIsIFwiZGVcIjogXCJCbGF1ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiBcIjQ2XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IFwiNDdcIiwgXCJlblwiOiBcIlN1bm55aGlsbFwiLCBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIiwgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsIFwiZGVcIjogXCJTb25uZW5saWNodGjDvGdlbFwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IFwiNDhcIiwgXCJlblwiOiBcIkZhaXRobGVhcFwiLCBcImZyXCI6IFwiRmVydmV1clwiLCBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIiwgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogXCI0OVwiLCBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgYmxldXZhbFwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IFwiNTBcIiwgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IFwiNTFcIiwgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZnJcIjogXCJBc3RyYWxob2xtZVwiLCBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLCBcImRlXCI6IFwiQXN0cmFsaG9sbVwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IFwiNTJcIiwgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCIsIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLCBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiBcIjUzXCIsIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiLCBcImVzXCI6IFwiUmVmdWdpbyBkZSBWYWxsZXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogXCI1NFwiLCBcImVuXCI6IFwiRm9naGF2ZW5cIiwgXCJmclwiOiBcIkhhdnJlIGdyaXNcIiwgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsIFwiZGVcIjogXCJOZWJlbCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IFwiNTVcIiwgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsIFwiZGVcIjogXCJSb3R3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IFwiNTZcIiwgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLCBcImZyXCI6IFwiQnJhcyBkdSB0aXRhblwiLCBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLCBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiBcIjU3XCIsIFwiZW5cIjogXCJDcmFndG9wXCIsIFwiZnJcIjogXCJTb21tZXQgZGUgbCdlc2NhcnBlbWVudFwiLCBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIiwgXCJkZVwiOiBcIkZlbHNlbnNwaXR6ZVwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IFwiNThcIiwgXCJlblwiOiBcIkdvZHNsb3JlXCIsIFwiZnJcIjogXCJEaXZpbmF0aW9uXCIsIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIiwgXCJkZVwiOiBcIkfDtnR0ZXJrdW5kZVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IFwiNTlcIiwgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVyb2pvXCIsIFwiZGVcIjogXCJSb3R0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IFwiNjBcIiwgXCJlblwiOiBcIlN0YXJncm92ZVwiLCBcImZyXCI6IFwiQm9zcXVldCBzdGVsbGFpcmVcIiwgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIiwgXCJkZVwiOiBcIlN0ZXJuZW5oYWluXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogXCI2MVwiLCBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG53YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IFwiNjJcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiBcIjYzXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogXCI2NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IFwiNjVcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogXCI2NlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IFwiNjdcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiBcIjY4XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IFwiNjlcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiBcIjcwXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogXCI3MVwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IFwiNzJcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiBcIjczXCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IFwiNzRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiBcIjc1XCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogXCI3NlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0XCJrZXlcIjogXCJDZW50ZXJcIixcclxuXHRcdFwibmFtZVwiOiBcIkV0ZXJuYWwgQmF0dGxlZ3JvdW5kc1wiLFxyXG5cdFx0XCJhYmJyXCI6IFwiRUJHXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcImNvbG9yXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJDYXN0bGVcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzldLCBcdFx0XHRcdFx0XHRcdFx0Ly8gc21cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJSZWQgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzEsIDE3LCAyMCwgMTgsIDE5LCA2LCA1XSxcdFx0Ly8gb3Zlcmxvb2ssIG1lbmRvbnMsIHZlbG9rYSwgYW56LCBvZ3JlLCBzcGVsZGFuLCBwYW5nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQmx1ZSBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIsIDE1LCAyMiwgMTYsIDIxLCA3LCA4XVx0XHRcdC8vIHZhbGxleSwgbGFuZ29yLCBicmF2b3N0LCBxdWVudGluLCBkdXJpb3MsIGRhbmUsIHVtYmVyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiR3JlZW4gQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMywgMTEsIDEzLCAxMiwgMTQsIDEwLCA0XSBcdFx0Ly8gbG93bGFuZHMsIGFsZG9ucywgamVycmlmZXIsIHdpbGRjcmVlaywga2xvdmFuLCByb2d1ZXMsIGdvbGFudGFcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiUmVkXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcImNvbG9yXCI6IFwicmVkXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzgsIDQwLCAzOSwgNTIsIDUxXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM1LCAzNiwgMzQsIDUzLCA1MF0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs2MiwgNjMsIDY0LCA2NSwgNjZdIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJCbHVlSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiQmx1XCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDIsXHJcblx0XHRcImNvbG9yXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjMsIDI3LCAzMV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzMwLCAyOCwgMjksIDU4LCA2MF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMjUsIDI2LCAyNCwgNTksIDYxXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBjaGFtcCwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzcxLCA3MCwgNjksIDY4LCA2N10gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiR3JlZW5Ib21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwiYWJiclwiOiBcIkdyblwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJjb2xvclwiOiBcImdyZWVuXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDYsIDQ0LCA0MV0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NywgNTcsIDU2LCA0OCwgNTRdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgc3VubnksIGNyYWcsIHRpdGFuLCBmYWl0aCwgZm9nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ1LCA0MiwgNDMsIDQ5LCA1NV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3NiAsIDc1ICwgNzQgLCA3MyAsIDcyIF0gXHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF1cclxuXHR9LFxyXG5dO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQvL1x0RUJHXHJcblx0XCI5XCI6XHR7XCJ0eXBlXCI6IDEsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDAsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFN0b25lbWlzdCBDYXN0bGVcclxuXHJcblx0Ly9cdFJlZCBDb3JuZXJcclxuXHRcIjFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gUmVkIEtlZXAgLSBPdmVybG9va1xyXG5cdFwiMTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gTWVuZG9uJ3MgR2FwXHJcblx0XCIyMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBWZWxva2EgU2xvcGVcclxuXHRcIjE4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIEFuemFsaWFzIFBhc3NcclxuXHRcIjE5XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIE9ncmV3YXRjaCBDdXRcclxuXHRcIjZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIENhbXAgLSBNaWxsIC0gU3BlbGRhblxyXG5cdFwiNVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgQ2FtcCAtIE1pbmUgLSBQYW5nbG9zc1xyXG5cclxuXHQvL1x0Qmx1ZSBDb3JuZXJcclxuXHRcIjJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBLZWVwIC0gVmFsbGV5XHJcblx0XCIxNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gTGFuZ29yIEd1bGNoXHJcblx0XCIyMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gQnJhdm9zdCBFc2NhcnBtZW50XHJcblx0XCIxNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gUXVlbnRpbiBMYWtlXHJcblx0XCIyMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIFRvd2VyIC0gRHVyaW9zIEd1bGNoXHJcblx0XCI3XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbmUgLSBEYW5lbG9uXHJcblx0XCI4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbGwgLSBVbWJlcmdsYWRlXHJcblxyXG5cdC8vXHRHcmVlbiBDb3JuZXJcclxuXHRcIjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gS2VlcCAtIExvd2xhbmRzXHJcblx0XCIxMVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIEFsZG9uc1xyXG5cdFwiMTNcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBKZXJyaWZlcidzIFNsb3VnaFxyXG5cdFwiMTJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBXaWxkY3JlZWtcclxuXHRcIjE0XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gS2xvdmFuIEd1bGx5XHJcblx0XCIxMFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBDYW1wIC0gTWluZSAtIFJvZ3VlcyBRdWFycnlcclxuXHRcIjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbGwgLSBHb2xhbnRhXHJcblxyXG5cclxuXHQvL1x0UmVkSG9tZVxyXG5cdFwiMzdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjMzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFtaW5nIEJheVxyXG5cdFwiMzJcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBFdGhlcm9uIEhpbGxzXHJcblx0XCIzOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIExvbmd2aWV3XHJcblx0XCI0MFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENsaWZmc2lkZVxyXG5cdFwiMzlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgR29kc3dvcmRcclxuXHRcIjUyXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gQXJhaCdzIEhvcGVcclxuXHRcIjUxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gQXN0cmFsaG9sbWVcclxuXHJcblx0XCIzNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEdyZWVuYnJpYXJcclxuXHRcIjM2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gQmx1ZWxha2VcclxuXHRcIjM0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gVmljdG9yJ3MgTG9kZ2VcclxuXHRcIjUzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEdyZWVudmFsZSBSZWZ1Z2VcclxuXHRcIjUwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBCbHVld2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRHcmVlbkhvbWVcclxuXHRcIjQ2XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCI0NFwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhZGZhbGwgQmF5XHJcblx0XCI0MVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIFNoYWRhcmFuIEhpbGxzXHJcblx0XCI0N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFN1bm55aGlsbFxyXG5cdFwiNTdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDcmFndG9wXHJcblx0XCI1NlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBUaXRhbnBhd1xyXG5cdFwiNDhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBGYWl0aGxlYXBcclxuXHRcIjU0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gRm9naGF2ZW5cclxuXHJcblx0XCI0NVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEJsdWVicmlhclxyXG5cdFwiNDJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBSZWRsYWtlXHJcblx0XCI0M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIEhlcm8ncyBMb2RnZVxyXG5cdFwiNDlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gQmx1ZXZhbGUgUmVmdWdlXHJcblx0XCI1NVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gUmVkd2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRCbHVlSG9tZVxyXG5cdFwiMjNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjI3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIEFzY2Vuc2lvbiBCYXlcclxuXHRcIjMxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gQXNrYWxpb24gSGlsbHNcclxuXHRcIjMwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gV29vZGhhdmVuXHJcblx0XCIyOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIERhd24ncyBFeXJpZVxyXG5cdFwiMjlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgU3Bpcml0aG9sbWVcclxuXHRcIjU4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gR29kc2xvcmVcclxuXHRcIjYwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIENhbXAgLSBNaWxsIC0gU3Rhcmdyb3ZlXHJcblxyXG5cdFwiMjVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBSZWRicmlhclxyXG5cdFwiMjZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBHcmVlbmxha2VcclxuXHRcIjI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gQ2hhbXBpb24ncyBEZW1lbnNlXHJcblx0XCI1OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBSZWR2YWxlIFJlZnVnZVxyXG5cdFwiNjFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEdyZWVud2F0ZXIgTG93bGFuZHNcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwibmFtZVwiOiBcIkdyZWVuIE1pbGxcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwibmFtZVwiOiBcIlJlZCBNaW5lXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcIm5hbWVcIjogXCJSZWQgTWlsbFwifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJuYW1lXCI6IFwiQmx1ZSBNaW5lXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcIm5hbWVcIjogXCJCbHVlIE1pbGxcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwibmFtZVwiOiBcIkNhc3RsZVwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IDEwLCBcIm5hbWVcIjogXCJHcmVlbiBNaW5lXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogMTEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogMTIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogMTMsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogMTQsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogMTUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogMTYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogMTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogMTgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogMTksIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogMjAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogMjEsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogMjIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogMjMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiAyNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiAyNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IDI2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IDI3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogMjgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogMjksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiAzMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiAzMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IDMyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogMzMsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiAzNCwgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IDM1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IDM2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IDM3LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogMzgsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogMzksIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiA0MCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiA0MSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IDQyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IDQzLCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogNDQsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiA0NSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiA0NiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IDQ3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IDQ4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiA0OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiA1MCwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogNTEsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogNTIsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IDUzLCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IDU0LCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IDU1LCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiA1NiwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IDU3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IDU4LCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiA1OSwgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiA2MCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiA2MSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogNjIsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogNjMsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiA2NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogNjUsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogNjYsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiA2NywgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IDY4LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IDY5LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiA3MCwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IDcxLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IDcyLCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogNzMsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogNzQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IDc1LCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogNzYsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMzUsIFwibmFtZVwiOiBcImNhc3RsZVwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDI1LCBcIm5hbWVcIjogXCJrZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMTAsIFwibmFtZVwiOiBcInRvd2VyXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogNSwgXCJuYW1lXCI6IFwiY2FtcFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcInRlbXBsZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImhvbGxvd1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogNywgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImVzdGF0ZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcIm92ZXJsb29rXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiYXNjZW50XCJ9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW1ib3NzZmVsc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbWJvc3NmZWxzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW52aWwgUm9ja1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbnZpbC1yb2NrXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgWXVucXVlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLXl1bnF1ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlciBkZSBsJ2VuY2x1bWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGVyLWRlLWxlbmNsdW1lXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzLVBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMgUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc28gZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc28tZGUtYm9ybGlzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzc2FnZSBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzc2FnZS1kZS1ib3JsaXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZW5yYXZpcyBFcmR3ZXJrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlbnJhdmlzLWVyZHdlcmtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZW5nZSBvZiBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlbmdlLW9mLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw61yY3VsbyBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpcmN1bG8tZGUtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb21sZWNoIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvbWxlY2gtZGUtZGVucmF2aVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hZ3V1bWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFndXVtYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVG9yIGRlcyBJcnJzaW5uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0b3ItZGVzLWlycnNpbm5zXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2F0ZSBvZiBNYWRuZXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhdGUtb2YtbWFkbmVzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YSBkZSBsYSBMb2N1cmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhLWRlLWxhLWxvY3VyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlIGRlIGxhIGZvbGllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlLWRlLWxhLWZvbGllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZS1TdGVpbmJydWNoXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc3RlaW5icnVjaFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgUXVhcnJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtcXVhcnJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FudGVyYSBkZSBKYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbnRlcmEtZGUtamFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhcnJpw6hyZSBkZSBqYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhcnJpZXJlLWRlLWphZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnktQnVjaHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYnVjaHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeSBCYXlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWhtcnktYmF5XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEVobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWVobXJ5XCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkJ0VobXJ5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGVobXJ5XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3R1cm1rbGlwcGVuLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0dXJta2xpcHBlbi1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0b3JtYmx1ZmYgSXNsZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdG9ybWJsdWZmLWlzbGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIENpbWF0b3JtZW50YVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWNpbWF0b3JtZW50YVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBsYSBGYWxhaXNlIHR1bXVsdHVldXNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1sYS1mYWxhaXNlLXR1bXVsdHVldXNlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIZWlsaWdlIEhhbGxlIHZvbiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhlaWxpZ2UtaGFsbGUtdm9uLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVtIG9mIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1bS1vZi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FncmFyaW8gZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYWdyYXJpby1kZS1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1YWlyZSBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dWFpcmUtZGUtcmFsbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktyaXN0YWxsd8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtyaXN0YWxsd3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcnlzdGFsIERlc2VydFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcnlzdGFsLWRlc2VydFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2llcnRvIGRlIENyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzaWVydG8tZGUtY3Jpc3RhbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNlcnQgZGUgY3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNlcnQtZGUtY3Jpc3RhbFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZWVyIGRlcyBMZWlkc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZWVyLWRlcy1sZWlkc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYSBvZiBTb3Jyb3dzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYS1vZi1zb3Jyb3dzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWwgTWFyIGRlIGxvcyBQZXNhcmVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsLW1hci1kZS1sb3MtcGVzYXJlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmVmbGVja3RlIEvDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiZWZsZWNrdGUta3VzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUYXJuaXNoZWQgQ29hc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGFybmlzaGVkLWNvYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ29zdGEgZGUgQnJvbmNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvc3RhLWRlLWJyb25jZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDtHRlIHRlcm5pZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3RlLXRlcm5pZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMThcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMThcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnp0b3JcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyenRvclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrZ2F0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja2dhdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGFuZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGFuZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBvcnRlbm9pcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGVub2lyZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29ucyBLcmV1enVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMta3JldXp1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbidzIENyb3NzaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1jcm9zc2luZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVuY3J1Y2lqYWRhIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVuY3J1Y2lqYWRhLWRlLWZlcmd1c29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvaXPDqWUgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JvaXNlZS1kZS1mZXJndXNvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2FpbmVuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrYWluZW5nXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hcyBSYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYSdzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzY2Fuc28gZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2NhbnNvLWRlLWRldm9uYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kZS1kZXZvbmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDI0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDI0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS2xhZ2Vucmlzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrbGFnZW5yaXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBvZiBXb2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1vZi13b2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXN1cmEgZGUgbGEgQWZsaWNjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXN1cmEtZGUtbGEtYWZsaWNjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzc3VyZSBkdSBtYWxoZXVyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtZHUtbWFsaGV1clwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIsOWZG5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvZG5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc29sYWNpw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYWNpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyemZsdXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2Nod2FyemZsdXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja3RpZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2t0aWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyZWEgTmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyZWEtbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb2lyZmxvdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub2lyZmxvdFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZldWVycmluZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXVlcnJpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaW5nIG9mIEZpcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmluZy1vZi1maXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQW5pbGxvIGRlIEZ1ZWdvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFuaWxsby1kZS1mdWVnb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNlcmNsZSBkZSBmZXVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2VyY2xlLWRlLWZldVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcm5lIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJuZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGYXIgU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmFyLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGVqYW5hcyBQaWNvc2VzY2Fsb2ZyaWFudGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxlamFuYXMtcGljb3Nlc2NhbG9mcmlhbnRlc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxvaW50YWluZXMgQ2ltZWZyb2lkZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibG9pbnRhaW5lcy1jaW1lZnJvaWRlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldlacOfZmxhbmtncmF0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndlaXNzZmxhbmtncmF0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2hpdGVzaWRlIFJpZGdlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIndoaXRlc2lkZS1yaWRnZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhZGVuYSBMYWRlcmFibGFuY2FcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FkZW5hLWxhZGVyYWJsYW5jYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyw6p0ZSBkZSBWZXJzZWJsYW5jXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyZXRlLWRlLXZlcnNlYmxhbmNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWVtYW5uc3Jhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VlbWFubnNyYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhZmFyZXIncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlYWZhcmVycy1yZXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBkZWwgVmlhamFudGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1kZWwtdmlhamFudGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkdSBNYXJpblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZXBvcy1kdS1tYXJpblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxpY2h0dW5nIGRlciBNb3JnZW5yw7Z0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsaWNodHVuZy1kZXItbW9yZ2Vucm90ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1cm9yYSBHbGFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdXJvcmEtZ2xhZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFybyBkZSBsYSBBdXJvcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhcm8tZGUtbGEtYXVyb3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhaXJpw6hyZSBkZSBsJ2F1cm9yZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFpcmllcmUtZGUtbGF1cm9yZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcnMgRmVzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1mZXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkd1bm5hcidzIEhvbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ3VubmFycy1ob2xkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtZGUtZ3VubmFyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FtcGVtZW50IGRlIEd1bm5hclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW1wZW1lbnQtZGUtZ3VubmFyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkF1Z3VyeSBSb2NrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJ5LXJvY2stZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBBdWd1cmlvIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwtYXVndXJpby1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2hlIGRlIGwnQXVndXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jaGUtZGUtbGF1Z3VyZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYXViZW5zdGVpbiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhdWJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXJib3JzdG9uZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFyYm9yc3RvbmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVkcmEgQXJiw7NyZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVkcmEtYXJib3JlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZXJyZSBBcmJvcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllcnJlLWFyYm9yZWEtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2NoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzaC1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmFmZWxzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmFmZWxzLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWxvbmEgUmVhY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYS1yZWFjaC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhw7HDs24gZGUgRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW5vbi1kZS1lbG9uYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJpZWYgZCdFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJpZWYtZGVsb25hLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbnMgTXVuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW11bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9uJ3MgTW91dGggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tb3V0aC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvY2EgZGUgQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvY2EtZGUtYWJhZGRvbi1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvdWNoZSBkJ0FiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3VjaGUtZGFiYWRkb24tZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcnN1bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyJ3MgU291bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtaWxsZXJzLXNvdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXN0cmVjaG8gZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXN0cmVjaG8tZGUtbWlsbGVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpdHJvaXQgZGUgTWlsbGVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV0cm9pdC1kZS1taWxsZXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjMwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjMwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0bGFuZ3M6IHJlcXVpcmUoJy4vZGF0YS9sYW5ncycpLFxyXG5cdHdvcmxkczogcmVxdWlyZSgnLi9kYXRhL3dvcmxkX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX25hbWVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX25hbWVzJyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX3R5cGVzJyksXHJcblx0b2JqZWN0aXZlX21ldGE6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWV0YScpLFxyXG5cdG9iamVjdGl2ZV9sYWJlbHM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbGFiZWxzJyksXHJcblx0b2JqZWN0aXZlX21hcDogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tYXAnKSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE1hdGNoV29ybGQgPSByZXF1aXJlKCcuL01hdGNoV29ybGQnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWF0Y2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1Njb3JlcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaC5nZXQoXCJzY29yZXNcIiksIG5leHRQcm9wcy5tYXRjaC5nZXQoXCJzY29yZXNcIikpO1xyXG5cdFx0Y29uc3QgbmV3TWF0Y2ggPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KFwic3RhcnRUaW1lXCIpLCBuZXh0UHJvcHMubWF0Y2guZ2V0KFwic3RhcnRUaW1lXCIpKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3JlcyB8fCBuZXdNYXRjaCB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoOjpyZW5kZXIoKScsIHByb3BzLm1hdGNoLnRvSlMoKSk7XHJcblxyXG5cdFx0Y29uc3Qgd29ybGRDb2xvcnMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibWF0Y2hDb250YWluZXJcIj5cclxuXHRcdFx0PHRhYmxlIGNsYXNzTmFtZT1cIm1hdGNoXCI+XHJcblx0XHRcdFx0e3dvcmxkQ29sb3JzLm1hcCgoY29sb3IsIGl4Q29sb3IpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IHdvcmxkS2V5ID0gY29sb3IgKyAnSWQnO1xyXG5cdFx0XHRcdFx0Y29uc3Qgd29ybGRJZCA9IHByb3BzLm1hdGNoLmdldCh3b3JsZEtleSkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdGNvbnN0IHdvcmxkID0gcHJvcHMud29ybGRzLmdldCh3b3JsZElkKTtcclxuXHRcdFx0XHRcdGNvbnN0IHNjb3JlcyA9IHByb3BzLm1hdGNoLmdldCgnc2NvcmVzJyk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIDxNYXRjaFdvcmxkXHJcblx0XHRcdFx0XHRcdGNvbXBvbmVudD0ndHInXHJcblx0XHRcdFx0XHRcdGtleT17d29ybGRJZH1cclxuXHJcblx0XHRcdFx0XHRcdHdvcmxkPXt3b3JsZH1cclxuXHRcdFx0XHRcdFx0c2NvcmVzPXtzY29yZXN9XHJcblxyXG5cdFx0XHRcdFx0XHRjb2xvcj17Y29sb3J9XHJcblx0XHRcdFx0XHRcdGl4Q29sb3I9e2l4Q29sb3J9XHJcblx0XHRcdFx0XHRcdHNob3dQaWU9e2l4Q29sb3IgPT09IDB9XHJcblx0XHRcdFx0XHQvPjtcclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC90YWJsZT5cclxuXHRcdDwvZGl2PjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWF0Y2gucHJvcFR5cGVzID0ge1xyXG5cdG1hdGNoOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLlNlcSkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmUgPSByZXF1aXJlKCcuL1Njb3JlJyk7XHJcbmNvbnN0IFBpZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9QaWUnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBFeHBvcnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWF0Y2hXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcblx0XHRjb25zdCBuZXdDb2xvciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5jb2xvciwgbmV4dFByb3BzLmNvbG9yKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3JlcyB8fCBuZXdDb2xvciB8fCBuZXdXb3JsZCk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaFdvcmxkczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCBzaG91bGRVcGRhdGUsIG5ld1Njb3JlcywgbmV3Q29sb3IsIG5ld1dvcmxkKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaFdvcmxkczo6cmVuZGVyKCknKTtcclxuXHJcblx0XHRyZXR1cm4gPHRyPlxyXG5cdFx0XHQ8dGQgY2xhc3NOYW1lPXtgdGVhbSBuYW1lICR7cHJvcHMuY29sb3J9YH0+XHJcblx0XHRcdFx0PGEgaHJlZj17cHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9Pntwcm9wcy53b3JsZC5nZXQoJ25hbWUnKX08L2E+XHJcblx0XHRcdDwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzc05hbWU9e2B0ZWFtIHNjb3JlICR7cHJvcHMuY29sb3J9YH0+XHJcblx0XHRcdFx0PFNjb3JlXHJcblx0XHRcdFx0XHR0ZWFtPXtwcm9wcy5jb2xvcn1cclxuXHRcdFx0XHRcdHNjb3JlPXtwcm9wcy5zY29yZXMuZ2V0KHByb3BzLml4Q29sb3IpfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvdGQ+XHJcblx0XHRcdHsocHJvcHMuc2hvd1BpZSlcclxuXHRcdFx0XHQ/IDx0ZCByb3dTcGFuPVwiM1wiIGNsYXNzTmFtZT1cInBpZVwiPlxyXG5cdFx0XHRcdFx0PFBpZVxyXG5cdFx0XHRcdFx0XHRzY29yZXM9e3Byb3BzLnNjb3Jlc31cclxuXHRcdFx0XHRcdFx0c2l6ZT17NjB9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdDwvdGQ+XHJcblx0XHRcdFx0OiBudWxsXHJcblx0XHRcdH1cclxuXHRcdDwvdHI+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXRjaFdvcmxkLnByb3BUeXBlcyA9IHtcclxuXHR3b3JsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0aXhDb2xvcjogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdHNob3dQaWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFdvcmxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgU2NvcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHR0aGlzLnN0YXRlID0ge2RpZmY6IDB9O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKXtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHtkaWZmOiBuZXh0UHJvcHMuc2NvcmUgLSBwcm9wcy5zY29yZX0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0aWYoc3RhdGUuZGlmZiAhPT0gMCkge1xyXG5cdFx0XHRhbmltYXRlU2NvcmVEaWZmKHRoaXMucmVmcy5kaWZmLmdldERPTU5vZGUoKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdHJldHVybiA8ZGl2PlxyXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJkaWZmXCIgcmVmPVwiZGlmZlwiPntnZXREaWZmVGV4dChzdGF0ZS5kaWZmKX08L3NwYW4+XHJcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e2dldFNjb3JlVGV4dChwcm9wcy5zY29yZSl9PC9zcGFuPlxyXG5cdFx0PC9kaXY+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5TY29yZS5wcm9wVHlwZXMgPSB7XHJcblx0c2NvcmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVTY29yZURpZmYoZWwpIHtcclxuXHQkKGVsKVxyXG5cdFx0LnZlbG9jaXR5KCdmYWRlT3V0Jywge2R1cmF0aW9uOiAwfSlcclxuXHRcdC52ZWxvY2l0eSgnZmFkZUluJywge2R1cmF0aW9uOiAyMDB9KVxyXG5cdFx0LnZlbG9jaXR5KCdmYWRlT3V0Jywge2R1cmF0aW9uOiAxMjAwLCBkZWxheTogNDAwfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXREaWZmVGV4dChkaWZmKSB7XHJcblx0cmV0dXJuIChkaWZmKVxyXG5cdFx0PyBudW1lcmFsKGRpZmYpLmZvcm1hdCgnKzAsMCcpXHJcblx0XHQ6IG51bGw7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTY29yZVRleHQoc2NvcmUpIHtcclxuXHRyZXR1cm4gKHNjb3JlKVxyXG5cdFx0PyBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpXHJcblx0XHQ6IG51bGw7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2ggPSByZXF1aXJlKCcuL01hdGNoJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBsb2FkaW5nSHRtbCA9IDxzcGFuIHN0eWxlPXt7cGFkZGluZ0xlZnQ6ICcuNWVtJ319PjxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW5uZXIgZmEtc3BpblwiIC8+PC9zcGFuPjtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3UmVnaW9uID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnJlZ2lvbiwgbmV4dFByb3BzLnJlZ2lvbik7XHJcblx0XHRjb25zdCBuZXdNYXRjaGVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoZXMsIG5leHRQcm9wcy5tYXRjaGVzKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZHMsIG5leHRQcm9wcy53b3JsZHMpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1JlZ2lvbiB8fCBuZXdNYXRjaGVzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHtzaG91bGRVcGRhdGUsIG5ld1JlZ2lvbiwgbmV3TWF0Y2hlcywgbmV3V29ybGRzfSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6cmVuZGVyKCknLCAncmVnaW9uJywgcHJvcHMucmVnaW9uLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ21hdGNoZXMnLCBwcm9wcy5tYXRjaGVzLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ3dvcmxkcycsIHByb3BzLndvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J1JlZ2lvbk1hdGNoZXMnPlxyXG5cdFx0XHRcdDxoMj5cclxuXHRcdFx0XHRcdHtwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBNYXRjaGVzXHJcblx0XHRcdFx0XHR7IXByb3BzLm1hdGNoZXMuc2l6ZSA/IGxvYWRpbmdIdG1sIDogbnVsbH1cclxuXHRcdFx0XHQ8L2gyPlxyXG5cclxuXHRcdFx0XHR7cHJvcHMubWF0Y2hlcy5tYXAobWF0Y2ggPT5cclxuXHRcdFx0XHRcdDxNYXRjaFxyXG5cdFx0XHRcdFx0XHRrZXk9e21hdGNoLmdldCgnaWQnKX1cclxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdtYXRjaCdcclxuXHJcblx0XHRcdFx0XHRcdHdvcmxkcz17cHJvcHMud29ybGRzfVxyXG5cdFx0XHRcdFx0XHRtYXRjaD17bWF0Y2h9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWF0Y2hlcy5wcm9wVHlwZXMgPSB7XHJcblx0cmVnaW9uOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdG1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFJlZ2lvbldvcmxkc1dvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3V29ybGQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1JlZ2lvbldvcmxkc1dvcmxkOjpyZW5kZXInLCBwcm9wcy53b3JsZC50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiA8bGk+PGEgaHJlZj17cHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9Pntwcm9wcy53b3JsZC5nZXQoJ25hbWUnKX08L2E+PC9saT47XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5SZWdpb25Xb3JsZHNXb3JsZC5wcm9wVHlwZXMgPSB7XHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWdpb25Xb3JsZHNXb3JsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBXb3JsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuXHRcdGNvbnN0IG5ld1JlZ2lvbiA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSwgbmV4dFByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld1JlZ2lvbik7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpSZWdpb25Xb3JsZHM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdMYW5nLCBuZXdSZWdpb24pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Oldvcmxkczo6cmVuZGVyKCknLCBwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpLCBwcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKS50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiUmVnaW9uV29ybGRzXCI+XHJcblx0XHRcdFx0PGgyPntwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBXb3JsZHM8L2gyPlxyXG5cdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJsaXN0LXVuc3R5bGVkXCI+XHJcblx0XHRcdFx0XHR7cHJvcHMud29ybGRzLm1hcCh3b3JsZCA9PlxyXG5cdFx0XHRcdFx0XHQ8V29ybGRcclxuXHRcdFx0XHRcdFx0XHRrZXk9e3dvcmxkLmdldCgnaWQnKX1cclxuXHRcdFx0XHRcdFx0XHR3b3JsZD17d29ybGR9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQpfVxyXG5cdFx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuV29ybGRzLnByb3BUeXBlcyA9IHtcclxuXHRyZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBhcGkgPSByZXF1aXJlKCdsaWIvYXBpJyk7XHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hlcyA9IHJlcXVpcmUoJy4vTWF0Y2hlcycpO1xyXG5jb25zdCBXb3JsZHMgPSByZXF1aXJlKCcuL1dvcmxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMudGltZW91dHMgPSB7fTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRyZWdpb25zOiBJbW11dGFibGUuZnJvbUpTKHtcclxuXHRcdFx0XHQnMSc6IHtsYWJlbDogJ05BJywgaWQ6ICcxJ30sXHJcblx0XHRcdFx0JzInOiB7bGFiZWw6ICdFVScsIGlkOiAnMid9LFxyXG5cdFx0XHR9KSxcclxuXHJcblx0XHRcdG1hdGNoZXNCeVJlZ2lvbjogSW1tdXRhYmxlLmZyb21KUyh7JzEnOnt9LCAnMic6e319KSxcclxuXHRcdFx0d29ybGRzQnlSZWdpb246IEltbXV0YWJsZS5mcm9tSlMoeycxJzp7fSwgJzInOnt9fSksXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyhwcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdNYXRjaERhdGEgPSAhSW1tdXRhYmxlLmlzKHN0YXRlLm1hdGNoZXNCeVJlZ2lvbiwgbmV4dFN0YXRlLm1hdGNoZXNCeVJlZ2lvbik7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyAgfHwgbmV3TWF0Y2hEYXRhKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywge3Nob3VsZFVwZGF0ZSwgbmV3TGFuZywgbmV3TWF0Y2hEYXRhfSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbE1vdW50KCkge1xyXG5cdFx0c2V0UGFnZVRpdGxlLmNhbGwodGhpcywgdGhpcy5wcm9wcy5sYW5nKTtcclxuXHRcdHNldFdvcmxkcy5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcblxyXG5cdFx0Z2V0RGF0YS5jYWxsKHRoaXMpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0c2V0UGFnZVRpdGxlLmNhbGwodGhpcywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0c2V0V29ybGRzLmNhbGwodGhpcywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuXHRcdHRoaXMubW91bnRlZCA9IGZhbHNlO1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dHMubWF0Y2hEYXRhKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAnbGFuZycsIHByb3BzLmxhbmcudG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAncmVnaW9ucycsIHN0YXRlLnJlZ2lvbnMudG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAnbWF0Y2hlc0J5UmVnaW9uJywgc3RhdGUubWF0Y2hlc0J5UmVnaW9uLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJywgJ3dvcmxkc0J5UmVnaW9uJywgc3RhdGUud29ybGRzQnlSZWdpb24udG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gPGRpdiBpZD1cIm92ZXJ2aWV3XCI+XHJcblx0XHRcdHs8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdHtzdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcblx0XHRcdFx0XHRcdDxNYXRjaGVzXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uPXtyZWdpb259XHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcz17c3RhdGUubWF0Y2hlc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcblx0XHRcdFx0XHRcdFx0d29ybGRzPXtzdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9kaXY+fVxyXG5cclxuXHRcdFx0PGhyIC8+XHJcblxyXG5cdFx0XHR7PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHR7c3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG5cdFx0XHRcdFx0XHQ8V29ybGRzXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uPXtyZWdpb259XHJcblx0XHRcdFx0XHRcdFx0d29ybGRzPXtzdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9kaXY+fVxyXG5cdFx0PC9kaXY+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5PdmVydmlldy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGlyZWN0IERPTSBNYW5pcHVsYXRpb25cclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcpIHtcclxuXHRsZXQgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcblx0aWYgKGxhbmcuZ2V0KCdzbHVnJykgIT09ICdlbicpIHtcclxuXHRcdHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcblx0fVxyXG5cclxuXHQkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERhdGFcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHREYXRhIC0gV29ybGRzXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRXb3JsZHMobGFuZykge1xyXG5cdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0Y29uc3QgbmV3V29ybGRzQnlSZWdpb24gPSBJbW11dGFibGVcclxuXHRcdC5TZXEoU1RBVElDLndvcmxkcylcclxuXHRcdC5tYXAod29ybGQgPT4gZ2V0V29ybGRCeUxhbmcobGFuZywgd29ybGQpKVxyXG5cdFx0LnNvcnRCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ25hbWUnKSlcclxuXHRcdC5ncm91cEJ5KHdvcmxkID0+IHdvcmxkLmdldCgncmVnaW9uJykpO1xyXG5cclxuXHRzZWxmLnNldFN0YXRlKHt3b3JsZHNCeVJlZ2lvbjogbmV3V29ybGRzQnlSZWdpb259KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkge1xyXG5cdGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0Y29uc3Qgd29ybGRCeUxhbmcgPSB3b3JsZC5nZXQobGFuZ1NsdWcpO1xyXG5cclxuXHRjb25zdCByZWdpb24gPSB3b3JsZC5nZXQoJ3JlZ2lvbicpO1xyXG5cdGNvbnN0IGxpbmsgPSBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkQnlMYW5nKTtcclxuXHJcblx0cmV0dXJuIHdvcmxkQnlMYW5nLm1lcmdlKHtsaW5rLCByZWdpb259KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcblx0cmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0RGF0YSAtIE1hdGNoZXNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEoKSB7XHJcblx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6Z2V0RGF0YSgpJyk7XHJcblxyXG5cdGFwaS5nZXRNYXRjaGVzKChlcnIsIGRhdGEpID0+IHtcclxuXHRcdGNvbnN0IG1hdGNoRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG5cdFx0aWYgKHNlbGYubW91bnRlZCkge1xyXG5cdFx0XHRpZiAoIWVyciAmJiBtYXRjaERhdGEgJiYgIW1hdGNoRGF0YS5pc0VtcHR5KCkpIHtcclxuXHRcdFx0XHRzZWxmLnNldFN0YXRlKGdldE1hdGNoZXNCeVJlZ2lvbi5iaW5kKHNlbGYsIG1hdGNoRGF0YSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXREYXRhVGltZW91dC5jYWxsKHNlbGYpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNCeVJlZ2lvbihtYXRjaERhdGEsIHN0YXRlKSB7XHJcblx0Y29uc3QgbmV3TWF0Y2hlc0J5UmVnaW9uID0gSW1tdXRhYmxlXHJcblx0XHQuU2VxKG1hdGNoRGF0YSlcclxuXHRcdC5ncm91cEJ5KG1hdGNoID0+IG1hdGNoLmdldChcInJlZ2lvblwiKS50b1N0cmluZygpKTtcclxuXHJcblx0cmV0dXJuIHttYXRjaGVzQnlSZWdpb246IHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5tZXJnZURlZXAobmV3TWF0Y2hlc0J5UmVnaW9uKX07XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0RGF0YVRpbWVvdXQoKSB7XHJcblx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnRpbWVvdXRzLm1hdGNoRGF0YSA9IHNldFRpbWVvdXQoXHJcblx0XHRnZXREYXRhLmJpbmQoc2VsZiksXHJcblx0XHRnZXRJbnRlcnZhbCgpXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCgpIHtcclxuXHRyZXR1cm4gXy5yYW5kb20oMjAwMCwgNDAwMCk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCcuLi9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogdHJ1ZSxcclxuXHR0aW1lc3RhbXA6IHRydWUsXHJcblx0bWFwQWJicmV2OiB0cnVlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogZmFsc2UsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBHdWlsZENsYWltcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdDbGFpbXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSwgbmV4dFByb3BzLmd1aWxkLmdldCgnY2xhaW1zJykpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0NsYWltcyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnQ2xhaW1zOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJykpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuXHRcdGNvbnN0IGNsYWltcyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnQ2xhaW1zOjpyZW5kZXIoKScsIGd1aWxkSWQpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZFwiPlxyXG5cdFx0XHRcdHtjbGFpbXMubWFwKGVudHJ5ID0+XHJcblx0XHRcdFx0XHQ8bGkga2V5PXtlbnRyeS5nZXQoJ2lkJyl9PlxyXG5cdFx0XHRcdFx0XHQ8T2JqZWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0Y29scz17b2JqZWN0aXZlQ29sc31cclxuXHJcblx0XHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRcdGd1aWxkSWQ9e2d1aWxkSWR9XHJcblx0XHRcdFx0XHRcdFx0Z3VpbGQ9e3RoaXMucHJvcHMuZ3VpbGR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdG9iamVjdGl2ZUlkPXtlbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcblx0XHRcdFx0XHRcdFx0d29ybGRDb2xvcj17ZW50cnkuZ2V0KCd3b3JsZCcpfVxyXG5cdFx0XHRcdFx0XHRcdHRpbWVzdGFtcD17ZW50cnkuZ2V0KCd0aW1lc3RhbXAnKX1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZENsYWltcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkQ2xhaW1zO1xyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEVtYmxlbSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuY29uc3QgQ2xhaW1zID0gcmVxdWlyZSgnLi9DbGFpbXMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7d2hpdGVTcGFjZTogXCJub3dyYXBcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wifX0+XHJcblx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCIgLz5cclxuXHR7JyBMb2FkaW5nLi4uJ31cclxuPC9oMT47XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgZGF0YVJlYWR5ID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpO1xyXG5cclxuXHRcdGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuXHRcdGNvbnN0IGd1aWxkTmFtZSA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJyk7XHJcblx0XHRjb25zdCBndWlsZFRhZyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCd0YWcnKTtcclxuXHRcdGNvbnN0IGd1aWxkQ2xhaW1zID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdHdWlsZDo6cmVuZGVyKCknLCBndWlsZElkLCBndWlsZE5hbWUpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImd1aWxkXCIgaWQ9e2d1aWxkSWR9PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tNFwiPlxyXG5cdFx0XHRcdFx0XHR7KGRhdGFSZWFkeSlcclxuXHRcdFx0XHRcdFx0XHQ/IDxhIGhyZWY9e2BodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLyR7c2x1Z2lmeShndWlsZE5hbWUpfWB9IHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PEVtYmxlbSBndWlsZE5hbWU9e2d1aWxkTmFtZX0gc2l6ZT17MjU2fSAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdFx0XHQ6IDxFbWJsZW0gc2l6ZT17MjU2fSAvPlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0yMFwiPlxyXG5cdFx0XHRcdFx0XHR7KGRhdGFSZWFkeSlcclxuXHRcdFx0XHRcdFx0XHQ/IDxoMT48YSBocmVmPXtgaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tL2d1aWxkcy8ke3NsdWdpZnkoZ3VpbGROYW1lKX1gfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0XHRcdFx0XHRcdHtndWlsZE5hbWV9IFt7Z3VpbGRUYWd9XVxyXG5cdFx0XHRcdFx0XHRcdDwvYT48L2gxPlxyXG5cdFx0XHRcdFx0XHRcdDogbG9hZGluZ0h0bWxcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0eyFndWlsZENsYWltcy5pc0VtcHR5KClcclxuXHRcdFx0XHRcdFx0XHQ/IDxDbGFpbXMgey4uLnRoaXMucHJvcHN9IC8+XHJcblx0XHRcdFx0XHRcdFx0OiBudWxsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkO1xyXG5cclxuZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcclxuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBHdWlsZCA9IHJlcXVpcmUoJy4vR3VpbGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHQvLyBjb25zdHJ1Y3RvcigpIHt9XHJcblx0Ly8gY29tcG9uZW50RGlkTW91bnQoKSB7fVxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdHdWlsZHM6OnJlbmRlcigpJyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncHJvcHMuZ3VpbGRzJywgcHJvcHMuZ3VpbGRzLnRvT2JqZWN0KCkpO1xyXG5cclxuXHRcdGNvbnN0IHNvcnRlZEd1aWxkcyA9IHByb3BzLmd1aWxkcy50b1NlcSgpXHJcblx0XHRcdC5zb3J0QnkoZ3VpbGQgPT4gZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJykpXHJcblx0XHRcdC5zb3J0QnkoZ3VpbGQgPT4gLWd1aWxkLmdldCgnbGFzdENsYWltJykpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGlkPVwiZ3VpbGRzXCI+XHJcblx0XHRcdFx0PGgyIGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZGVyXCI+R3VpbGQgQ2xhaW1zPC9oMj5cclxuXHRcdFx0XHR7c29ydGVkR3VpbGRzLm1hcChndWlsZCA9PlxyXG5cdFx0XHRcdFx0PEd1aWxkXHJcblx0XHRcdFx0XHRcdGtleT17Z3VpbGQuZ2V0KCdndWlsZF9pZCcpfVxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRndWlsZD17Z3VpbGR9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkd1aWxkcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHdWlsZHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCAkID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJy4uL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgY2FwdHVyZUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogdHJ1ZSxcclxuXHR0aW1lc3RhbXA6IHRydWUsXHJcblx0bWFwQWJicmV2OiB0cnVlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogZmFsc2UsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuY29uc3QgY2xhaW1Db2xzID0ge1xyXG5cdGVsYXBzZWQ6IHRydWUsXHJcblx0dGltZXN0YW1wOiB0cnVlLFxyXG5cdG1hcEFiYnJldjogdHJ1ZSxcclxuXHRhcnJvdzogdHJ1ZSxcclxuXHRzcHJpdGU6IHRydWUsXHJcblx0bmFtZTogdHJ1ZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogdHJ1ZSxcclxuXHRndWlsZFRhZzogdHJ1ZSxcclxuXHR0aW1lcjogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cdFx0Y29uc3QgbmV3RW50cnkgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZW50cnksIG5leHRQcm9wcy5lbnRyeSk7XHJcblxyXG5cdFx0Y29uc3QgbmV3RmlsdGVycyA9IChcclxuXHRcdFx0IUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hcEZpbHRlciwgbmV4dFByb3BzLm1hcEZpbHRlcilcclxuXHRcdFx0fHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpXHJcblx0XHQpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuXHRcdFx0bmV3TGFuZ1xyXG5cdFx0XHR8fCBuZXdHdWlsZFxyXG5cdFx0XHR8fCBuZXdFbnRyeVxyXG5cdFx0XHR8fCBuZXdGaWx0ZXJzXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdFbnRyeTpyZW5kZXIoKScsIHtuZXdUcmlnZ2VyU3RhdGUsIG5ld0ZpbHRlcnMsIHNob3VsZFVwZGF0ZX0pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdFbnRyeTpyZW5kZXIoKScpO1xyXG5cdFx0Y29uc3QgZXZlbnRUeXBlID0gdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKTtcclxuXHJcblx0XHRjb25zdCBjb2xzID0gKGV2ZW50VHlwZSA9PT0gJ2NsYWltJylcclxuXHRcdFx0PyBjbGFpbUNvbHNcclxuXHRcdFx0OiBjYXB0dXJlQ29scztcclxuXHJcblx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YVt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKV07XHJcblx0XHRjb25zdCBtYXBDb2xvciA9IF8uZmluZChTVEFUSUMub2JqZWN0aXZlX21hcCwgbWFwID0+IG1hcC5tYXBJbmRleCA9PT0gb01ldGEubWFwKS5jb2xvcjtcclxuXHJcblxyXG5cdFx0Y29uc3QgbWF0Y2hlc01hcEZpbHRlciA9IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLm1hcEZpbHRlciA9PT0gbWFwQ29sb3I7XHJcblx0XHRjb25zdCBtYXRjaGVzRXZlbnRGaWx0ZXIgPSB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSBldmVudFR5cGU7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkQmVWaXNpYmxlID0gKG1hdGNoZXNNYXBGaWx0ZXIgJiYgbWF0Y2hlc0V2ZW50RmlsdGVyKTtcclxuXHRcdGNvbnN0IGNsYXNzTmFtZSA9IHNob3VsZEJlVmlzaWJsZSA/ICdzaG93LWVudHJ5JyA6ICdoaWRlLWVudHJ5JztcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuXHRcdFx0XHQ8T2JqZWN0aXZlXHJcblx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG5cdFx0XHRcdFx0Y29scz17Y29sc31cclxuXHRcdFx0XHRcdGd1aWxkSWQ9e3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuXHRcdFx0XHRcdGd1aWxkPXt0aGlzLnByb3BzLmd1aWxkfVxyXG5cclxuXHRcdFx0XHRcdGVudHJ5SWQ9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCdpZCcpfVxyXG5cdFx0XHRcdFx0b2JqZWN0aXZlSWQ9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpfVxyXG5cdFx0XHRcdFx0d29ybGRDb2xvcj17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3dvcmxkJyl9XHJcblx0XHRcdFx0XHR0aW1lc3RhbXA9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0aW1lc3RhbXAnKX1cclxuXHRcdFx0XHRcdGV2ZW50VHlwZT17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKX1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuRW50cnkucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZW50cnk6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuXHJcblx0bWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0ZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudHJ5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICh0aGlzLnByb3BzLmV2ZW50RmlsdGVyICE9PSBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGlkPVwibG9nLWV2ZW50LWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnY2xhaW0nKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuXHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImNsYWltXCI+Q2xhaW1zPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnY2FwdHVyZScpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiY2FwdHVyZVwiPkNhcHR1cmVzPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJykgPyAnYWN0aXZlJzogbnVsbH0+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0ge1xyXG5cdGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoW1xyXG5cdFx0J2FsbCcsXHJcblx0XHQnY2FwdHVyZScsXHJcblx0XHQnY2xhaW0nLFxyXG5cdF0pLmlzUmVxdWlyZWQsXHJcblx0c2V0RXZlbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBGaWx0ZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbnRyeSA9IHJlcXVpcmUoJy4vRW50cnknKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTG9nRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHJcblx0XHRjb25zdCBuZXdUcmlnZ2VyU3RhdGUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbiwgbmV4dFByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cdFx0Y29uc3QgbmV3RmlsdGVyU3RhdGUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKSB8fCAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIsIG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRuZXdMYW5nXHJcblx0XHRcdHx8IG5ld0d1aWxkc1xyXG5cdFx0XHR8fCBuZXdUcmlnZ2VyU3RhdGVcclxuXHRcdFx0fHwgbmV3RmlsdGVyU3RhdGVcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMb2dFbnRyaWVzOjpyZW5kZXIoKScsIHByb3BzLm1hcEZpbHRlciwgcHJvcHMuZXZlbnRGaWx0ZXIsIHByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBpZD1cImxvZ1wiPlxyXG5cdFx0XHRcdHtwcm9wcy5ldmVudEhpc3RvcnkubWFwKGVudHJ5ID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGV2ZW50VHlwZSA9IGVudHJ5LmdldCgndHlwZScpO1xyXG5cdFx0XHRcdFx0Y29uc3QgZW50cnlJZCA9IGVudHJ5LmdldCgnaWQnKTtcclxuXHRcdFx0XHRcdGxldCBndWlsZElkLCBndWlsZDtcclxuXHJcblx0XHRcdFx0XHRpZiAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSB7XHJcblx0XHRcdFx0XHRcdGd1aWxkSWQgPSBlbnRyeS5nZXQoJ2d1aWxkJyk7XHJcblx0XHRcdFx0XHRcdGd1aWxkID0gKHByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCkpXHJcblx0XHRcdFx0XHRcdFx0PyBwcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpXHJcblx0XHRcdFx0XHRcdFx0OiBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gPEVudHJ5XHJcblx0XHRcdFx0XHRcdGtleT17ZW50cnlJZH1cclxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PSdsaSdcclxuXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb249e3Byb3BzLnRyaWdnZXJOb3RpZmljYXRpb259XHJcblx0XHRcdFx0XHRcdG1hcEZpbHRlcj17cHJvcHMubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRldmVudEZpbHRlcj17cHJvcHMuZXZlbnRGaWx0ZXJ9XHJcblxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cclxuXHRcdFx0XHRcdFx0Z3VpbGRJZD17Z3VpbGRJZH1cclxuXHRcdFx0XHRcdFx0ZW50cnk9e2VudHJ5fVxyXG5cdFx0XHRcdFx0XHRndWlsZD17Z3VpbGR9XHJcblx0XHRcdFx0XHQvPjtcclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG5cdC8vIFx0JChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSlcclxuXHQvLyBcdFx0LmNoaWxkcmVuKCdsaScpXHJcblx0Ly8gXHRcdFx0LmZpbHRlcignLnNob3ctZW50cnknKVxyXG5cdC8vIFx0XHRcdFx0LmVhY2goKGl4Um93LCBlbCkgPT4gKGl4Um93ICUgMikgPyAkKGVsKS5hZGRDbGFzcygndG8tYWx0JykgOiBudWxsKVxyXG5cdC8vIFx0XHRcdC5lbmQoKVxyXG5cdC8vIFx0XHRcdC5maWx0ZXIoJy5hbHQ6bm90KC50by1hbHQpJylcclxuXHQvLyBcdFx0XHRcdC5yZW1vdmVDbGFzcygnYWx0JylcclxuXHQvLyBcdFx0XHQuZW5kKClcclxuXHQvLyBcdFx0XHQuZmlsdGVyKCcudG8tYWx0JylcclxuXHQvLyBcdFx0XHRcdC5hZGRDbGFzcygnYWx0JylcclxuXHQvLyBcdFx0XHRcdC5yZW1vdmVDbGFzcygndG8tYWx0JylcclxuXHQvLyBcdFx0XHQuZW5kKClcclxuXHQvLyBcdFx0LmVuZCgpO1xyXG5cdC8vIH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Mb2dFbnRyaWVzLmRlZmF1bHRQcm9wcyA9IHtcclxuXHRndWlsZHM6IHt9LFxyXG59O1xyXG5cclxuTG9nRW50cmllcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdHRyaWdnZXJOb3RpZmljYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0bWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0ZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZ0VudHJpZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMucHJvcHMubWFwRmlsdGVyICE9PSBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBpZD1cImxvZy1tYXAtZmlsdGVyc1wiIGNsYXNzTmFtZT1cIm5hdiBuYXYtcGlsbHNcIj5cclxuXHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLm1hcEZpbHRlciA9PT0gJ2FsbCcpID8gJ2FjdGl2ZSc6ICdudWxsJ30+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHJcblx0XHRcdFx0e18ubWFwKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXBNZXRhID0+XHJcblx0XHRcdFx0XHQ8bGkga2V5PXttYXBNZXRhLm1hcEluZGV4fSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09IG1hcE1ldGEuY29sb3IpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9e21hcE1ldGEuY29sb3J9PnttYXBNZXRhLmFiYnJ9PC9hPlxyXG5cdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQpfVxyXG5cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0ge1xyXG5cdG1hcEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdHNldFdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRmlsdGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwRmlsdGVycyA9IHJlcXVpcmUoJy4vTWFwRmlsdGVycycpO1xyXG5jb25zdCBFdmVudEZpbHRlcnMgPSByZXF1aXJlKCcuL0V2ZW50RmlsdGVycycpO1xyXG5jb25zdCBMb2dFbnRyaWVzID0gcmVxdWlyZSgnLi9Mb2dFbnRyaWVzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRtYXBGaWx0ZXI6ICdhbGwnLFxyXG5cdFx0XHRldmVudEZpbHRlcjogJ2FsbCcsXHJcblx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb246IGZhbHNlLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3SGlzdG9yeSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpLCBuZXh0UHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKSk7XHJcblxyXG5cdFx0Y29uc3QgbmV3TWFwRmlsdGVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hcEZpbHRlciwgbmV4dFN0YXRlLm1hcEZpbHRlcik7XHJcblx0XHRjb25zdCBuZXdFdmVudEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5ldmVudEZpbHRlciwgbmV4dFN0YXRlLmV2ZW50RmlsdGVyKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcblx0XHRcdG5ld0xhbmdcclxuXHRcdFx0fHwgbmV3R3VpbGRzXHJcblx0XHRcdHx8IG5ld0hpc3RvcnlcclxuXHRcdFx0fHwgbmV3TWFwRmlsdGVyXHJcblx0XHRcdHx8IG5ld0V2ZW50RmlsdGVyXHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7dHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcblx0XHRpZiAoIXRoaXMuc3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHt0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0xvZzo6cmVuZGVyKCknLCBzdGF0ZS5tYXBGaWx0ZXIsIHN0YXRlLmV2ZW50RmlsdGVyLCBzdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRjb25zdCBldmVudEhpc3RvcnkgPSBwcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9XCJsb2ctY29udGFpbmVyXCI+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibG9nLXRhYnNcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTE2XCI+XHJcblx0XHRcdFx0XHRcdFx0PE1hcEZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRcdG1hcEZpbHRlcj17c3RhdGUubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRcdFx0c2V0V29ybGQ9e3NldFdvcmxkLmJpbmQoY29tcG9uZW50KX1cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxFdmVudEZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50RmlsdGVyPXtzdGF0ZS5ldmVudEZpbHRlcn1cclxuXHRcdFx0XHRcdFx0XHRcdHNldEV2ZW50PXtzZXRFdmVudC5iaW5kKGNvbXBvbmVudCl9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0eyFldmVudEhpc3RvcnkuaXNFbXB0eSgpXHJcblx0XHRcdFx0XHQ/IDxMb2dFbnRyaWVzXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb249e3N0YXRlLnRyaWdnZXJOb3RpZmljYXRpb259XHJcblx0XHRcdFx0XHRcdG1hcEZpbHRlcj17c3RhdGUubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRldmVudEZpbHRlcj17c3RhdGUuZXZlbnRGaWx0ZXJ9XHJcblxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRndWlsZHM9e3Byb3BzLmd1aWxkc31cclxuXHJcblx0XHRcdFx0XHRcdGV2ZW50SGlzdG9yeT17ZXZlbnRIaXN0b3J5fVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDogbnVsbFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTG9nLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFdvcmxkKGUpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0bGV0IGZpbHRlciA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcclxuXHJcblx0Y29tcG9uZW50LnNldFN0YXRlKHttYXBGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldEV2ZW50KGUpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0bGV0IGZpbHRlciA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcclxuXHJcblx0Y29tcG9uZW50LnNldFN0YXRlKHtldmVudEZpbHRlcjogZmlsdGVyLCB0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzID0gcmVxdWlyZSgnLi9NYXBTY29yZXMnKTtcclxuY29uc3QgTWFwU2VjdGlvbiA9IHJlcXVpcmUoJy4vTWFwU2VjdGlvbicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0RldGFpbHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgbWFwTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdrZXknKSA9PT0gdGhpcy5wcm9wcy5tYXBLZXkpO1xyXG5cdFx0Y29uc3QgbWFwSW5kZXggPSBtYXBNZXRhLmdldCgnbWFwSW5kZXgnKS50b1N0cmluZygpO1xyXG5cclxuXHRcdGNvbnN0IG1hcFNjb3JlcyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ21hcHMnLCAnc2NvcmVzJywgbWFwSW5kZXhdKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczpyZW5kZXIoKScsIG1hcFNjb3Jlcy50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWFwXCI+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWFwU2NvcmVzXCI+XHJcblx0XHRcdFx0XHQ8aDIgY2xhc3NOYW1lPXsndGVhbSAnICsgbWFwTWV0YS5nZXQoJ2NvbG9yJyl9IG9uQ2xpY2s9e29uVGl0bGVDbGlja30+XHJcblx0XHRcdFx0XHRcdHttYXBNZXRhLmdldCgnbmFtZScpfVxyXG5cdFx0XHRcdFx0PC9oMj5cclxuXHRcdFx0XHRcdDxNYXBTY29yZXMgc2NvcmVzPXttYXBTY29yZXN9IC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHR7bWFwTWV0YS5nZXQoJ3NlY3Rpb25zJykubWFwKChtYXBTZWN0aW9uLCBpeFNlY3Rpb24pID0+IHtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0PE1hcFNlY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRcdGNvbXBvbmVudD1cInVsXCJcclxuXHRcdFx0XHRcdFx0XHRcdGtleT17aXhTZWN0aW9ufVxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwU2VjdGlvbj17bWFwU2VjdGlvbn1cclxuXHRcdFx0XHRcdFx0XHRcdG1hcE1ldGE9e21hcE1ldGF9XHJcblx0XHRcdFx0XHRcdFx0XHR7Li4udGhpcy5wcm9wc31cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSl9XHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBEZXRhaWxzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0bWF0Y2hXb3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcERldGFpbHM7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gb25UaXRsZUNsaWNrKGUpIHtcclxuXHRsZXQgJG1hcHMgPSAkKCcubWFwJyk7XHJcblx0bGV0ICRtYXAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWFwJywgJG1hcHMpO1xyXG5cclxuXHRsZXQgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG5cdGlmKCFoYXNGb2N1cykge1xyXG5cdFx0JG1hcFxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcblx0XHQkbWFwcy5ub3QoJG1hcClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0JG1hcHNcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcFNjb3JlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3Jlcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJsaXN0LWlubGluZVwiPlxyXG5cdFx0XHRcdHtwcm9wcy5zY29yZXMubWFwKChzY29yZSwgaXhTY29yZSkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgZm9ybWF0dGVkID0gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKTtcclxuXHRcdFx0XHRcdGNvbnN0IHRlYW0gPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ11baXhTY29yZV07XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIDxsaSBrZXk9e3RlYW19IGNsYXNzTmFtZT17YHRlYW0gJHt0ZWFtfWB9PlxyXG5cdFx0XHRcdFx0XHR7Zm9ybWF0dGVkfVxyXG5cdFx0XHRcdFx0PC9saT47XHJcblx0XHRcdFx0fSl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBTY29yZXMucHJvcFR5cGVzID0ge1xyXG5cdHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBTY29yZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJ1RyYWNrZXIvT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuXHRlbGFwc2VkOiBmYWxzZSxcclxuXHR0aW1lc3RhbXA6IGZhbHNlLFxyXG5cdG1hcEFiYnJldjogZmFsc2UsXHJcblx0YXJyb3c6IHRydWUsXHJcblx0c3ByaXRlOiB0cnVlLFxyXG5cdG5hbWU6IHRydWUsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IGZhbHNlLFxyXG5cdGd1aWxkVGFnOiB0cnVlLFxyXG5cdHRpbWVyOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwU2VjdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0RldGFpbHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgbWFwT2JqZWN0aXZlcyA9IHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ29iamVjdGl2ZXMnKTtcclxuXHRcdGNvbnN0IG93bmVycyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG5cdFx0Y29uc3QgY2xhaW1lcnMgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBTZWN0aW9uOnJlbmRlcigpJywgbWFwT2JqZWN0aXZlcywgbWFwT2JqZWN0aXZlcy50b0pTKCkpO1xyXG5cclxuXHJcblx0XHRjb25zdCBzZWN0aW9uQ2xhc3MgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPXtgbGlzdC11bnN0eWxlZCAke3NlY3Rpb25DbGFzc31gfT5cclxuXHRcdFx0XHR7bWFwT2JqZWN0aXZlcy5tYXAob2JqZWN0aXZlSWQgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3Qgb3duZXIgPSBvd25lcnMuZ2V0KG9iamVjdGl2ZUlkLnRvU3RyaW5nKCkpO1xyXG5cdFx0XHRcdFx0Y29uc3QgY2xhaW1lciA9IGNsYWltZXJzLmdldChvYmplY3RpdmVJZC50b1N0cmluZygpKTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBndWlsZElkID0gKGNsYWltZXIpID8gY2xhaW1lci5ndWlsZCA6IG51bGw7XHJcblx0XHRcdFx0XHRjb25zdCBoYXNDbGFpbWVyID0gISFndWlsZElkO1xyXG5cdFx0XHRcdFx0Y29uc3QgaGFzR3VpbGREYXRhID0gaGFzQ2xhaW1lciAmJiB0aGlzLnByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCk7XHJcblx0XHRcdFx0XHRjb25zdCBndWlsZCA9IGhhc0d1aWxkRGF0YSA/IHRoaXMucHJvcHMuZ3VpbGRzLmdldChndWlsZElkKSA6IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0PGxpIGtleT17b2JqZWN0aXZlSWR9IGlkPXsnb2JqZWN0aXZlLScgKyBvYmplY3RpdmVJZH0+XHJcblx0XHRcdFx0XHRcdFx0PE9iamVjdGl2ZVxyXG5cdFx0XHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRcdFx0Y29scz17b2JqZWN0aXZlQ29sc31cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmVJZD17b2JqZWN0aXZlSWR9XHJcblx0XHRcdFx0XHRcdFx0XHR3b3JsZENvbG9yPXtvd25lci5nZXQoJ3dvcmxkJyl9XHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA9e293bmVyLmdldCgndGltZXN0YW1wJyl9XHJcblx0XHRcdFx0XHRcdFx0XHRndWlsZElkPXtndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGQ9e2d1aWxkfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcFNlY3Rpb24ucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuXHRtYXBTZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwU2VjdGlvbjtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlY3Rpb25DbGFzcyhtYXBLZXksIHNlY3Rpb25MYWJlbCkge1xyXG5cdGxldCBzZWN0aW9uQ2xhc3MgPSBbXHJcblx0XHQnY29sLW1kLTI0JyxcclxuXHRcdCdtYXAtc2VjdGlvbicsXHJcblx0XTtcclxuXHJcblx0aWYgKG1hcEtleSA9PT0gJ0NlbnRlcicpIHtcclxuXHRcdGlmIChzZWN0aW9uTGFiZWwgPT09ICdDYXN0bGUnKSB7XHJcblx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tMjQnKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWN0aW9uQ2xhc3Muam9pbignICcpO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBEZXRhaWxzID0gcmVxdWlyZSgnLi9NYXBEZXRhaWxzJyk7XHJcbmNvbnN0IExvZyA9IHJlcXVpcmUoJ1RyYWNrZXIvTG9nJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdEZXRhaWxzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRjb25zdCBpc0RhdGFJbml0aWFsaXplZCA9IHByb3BzLmRldGFpbHMuZ2V0KCdpbml0aWFsaXplZCcpO1xyXG5cclxuXHRcdGlmICghaXNEYXRhSW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGlkPVwibWFwc1wiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNlwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJDZW50ZXJcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTE4XCI+XHJcblxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiUmVkSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJCbHVlSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJHcmVlbkhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxMb2cgey4uLnByb3BzfSAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQgPC9kaXY+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcHMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IEVtYmxlbSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdHdWlsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGQgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3QgaGFzR3VpbGQgPSAhIXRoaXMucHJvcHMuZ3VpbGRJZDtcclxuXHRcdGNvbnN0IGlzRW5hYmxlZCA9IGhhc0d1aWxkICYmICh0aGlzLnByb3BzLnNob3dOYW1lIHx8IHRoaXMucHJvcHMuc2hvd1RhZyk7XHJcblxyXG5cdFx0aWYgKCFpc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgaGFzR3VpbGREYXRhID0gcHJvcHMuZ3VpbGQgJiYgcHJvcHMuZ3VpbGQuZ2V0KCdsb2FkZWQnKTtcclxuXHRcdFx0Y29uc3QgaWQgPSBwcm9wcy5ndWlsZElkO1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ0d1aWxkOnJlbmRlcigpJywgaWQpO1xyXG5cclxuXHRcdFx0Y29uc3QgaHJlZiA9IGAjJHtpZH1gO1xyXG5cclxuXHRcdFx0bGV0IGNvbnRlbnQgPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG5cdFx0XHRsZXQgdGl0bGUgPSBudWxsO1xyXG5cclxuXHRcdFx0aWYgKGhhc0d1aWxkRGF0YSkge1xyXG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBwcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuXHRcdFx0XHRjb25zdCB0YWcgPSBwcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG5cclxuXHRcdFx0XHRpZiAocHJvcHMuc2hvd05hbWUgJiYgcHJvcHMuc2hvd1RhZykge1xyXG5cdFx0XHRcdFx0Y29udGVudCA9IDxzcGFuPlxyXG5cdFx0XHRcdFx0XHR7YCR7bmFtZX0gWyR7dGFnfV0gYH1cclxuXHRcdFx0XHRcdFx0PEVtYmxlbSBndWlsZE5hbWU9e25hbWV9IHNpemU9ezIwfSAvPlxyXG5cdFx0XHRcdFx0PC9zcGFuPjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAocHJvcHMuc2hvd05hbWUpIHtcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSBgJHtuYW1lfWA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29udGVudCA9IGAke3RhZ31gO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGl0bGUgPSBgJHtuYW1lfSBbJHt0YWd9XWA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiA8YSBjbGFzc05hbWU9XCJndWlsZG5hbWVcIiBocmVmPXtocmVmfSB0aXRsZT17dGl0bGV9PlxyXG5cdFx0XHRcdHtjb250ZW50fVxyXG5cdFx0XHQ8L2E+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSB7XHJcblx0c2hvd05hbWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0c2hvd1RhZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRndWlsZElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTcHJpdGUgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvU3ByaXRlJyk7XHJcbmNvbnN0IEFycm93ID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0Fycm93Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBJY29ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3Q29sb3IgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuY29sb3IsIG5leHRQcm9wcy5jb2xvcik7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3Q29sb3IpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5zaG93QXJyb3cgJiYgIXRoaXMucHJvcHMuc2hvd1Nwcml0ZSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblx0XHRcdGNvbnN0IG9iamVjdGl2ZVR5cGVJZCA9IG9NZXRhLmdldCgndHlwZScpLnRvU3RyaW5nKCk7XHJcblx0XHRcdGNvbnN0IG9UeXBlID0gU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQob2JqZWN0aXZlVHlwZUlkKTtcclxuXHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1pY29uc1wiPlxyXG5cdFx0XHRcdHsodGhpcy5wcm9wcy5zaG93QXJyb3cpID9cclxuXHRcdFx0XHRcdDxBcnJvdyBvTWV0YT17b01ldGF9IC8+XHJcblx0XHRcdFx0OiBudWxsfVxyXG5cclxuXHRcdFx0XHR7KHRoaXMucHJvcHMuc2hvd1Nwcml0ZSkgP1xyXG5cdFx0XHRcdFx0PFNwcml0ZVxyXG5cdFx0XHRcdFx0XHR0eXBlPXtvVHlwZS5nZXQoJ25hbWUnKX1cclxuXHRcdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMuY29sb3J9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdDogbnVsbH1cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5JY29ucy5wcm9wVHlwZXMgPSB7XHJcblx0c2hvd0Fycm93OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHNob3dTcHJpdGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExhYmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IG9MYWJlbCA9IFNUQVRJQy5vYmplY3RpdmVfbGFiZWxzLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHRcdFx0Y29uc3QgbGFuZ1NsdWcgPSB0aGlzLnByb3BzLmxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbGFiZWxcIj5cclxuXHRcdFx0XHQ8c3Bhbj57b0xhYmVsLmdldChsYW5nU2x1Zyl9PC9zcGFuPlxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwTmFtZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Ly8gbWFwIG5hbWUgY2FuIG5ldmVyIGNoYW5nZSwgbm90IGxvY2FsaXplZFxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZSgpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblx0XHRcdGNvbnN0IG1hcEluZGV4ID0gb01ldGEuZ2V0KCdtYXAnKTtcclxuXHRcdFx0Y29uc3QgbWFwTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdtYXBJbmRleCcpID09PSBtYXBJbmRleCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbWFwXCI+XHJcblx0XHRcdFx0PHNwYW4gdGl0bGU9e21hcE1ldGEuZ2V0KCduYW1lJyl9PnttYXBNZXRhLmdldCgnYWJicicpfTwvc3Bhbj5cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBOYW1lLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcE5hbWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lQ291bnRkb3duIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgZXhwaXJlcyA9IHRoaXMucHJvcHMudGltZXN0YW1wICsgKDUgKiA2MCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSd0aW1lciBjb3VudGRvd24gaW5hY3RpdmUnIGRhdGEtZXhwaXJlcz17ZXhwaXJlc30+XHJcblx0XHRcdFx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG5cdFx0XHQ8L3NwYW4+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UaW1lQ291bnRkb3duLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lQ291bnRkb3duO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lclJlbGF0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXJlbGF0aXZlXCI+XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidGltZXIgcmVsYXRpdmVcIiBkYXRhLXRpbWVzdGFtcD17dGhpcy5wcm9wcy50aW1lc3RhbXB9PlxyXG5cdFx0XHRcdFx0e21vbWVudCh0aGlzLnByb3BzLnRpbWVzdGFtcCAqIDEwMDApLnR3aXR0ZXJTaG9ydCgpfVxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UaW1lclJlbGF0aXZlLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lclJlbGF0aXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lc3RhbXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCB0aW1lc3RhbXBIdG1sID0gbW9tZW50KCh0aGlzLnByb3BzLnRpbWVzdGFtcCkgKiAxMDAwKS5mb3JtYXQoJ2hoOm1tOnNzJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtdGltZXN0YW1wXCI+XHJcblx0XHRcdFx0e3RpbWVzdGFtcEh0bWx9XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuVGltZXN0YW1wLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lc3RhbXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFRpbWVyUmVsYXRpdmUgPSByZXF1aXJlKCcuL1RpbWVyUmVsYXRpdmUnKTtcclxuY29uc3QgVGltZXN0YW1wID0gcmVxdWlyZSgnLi9UaW1lc3RhbXAnKTtcclxuY29uc3QgTWFwTmFtZSA9IHJlcXVpcmUoJy4vTWFwTmFtZScpO1xyXG5jb25zdCBJY29ucyA9IHJlcXVpcmUoJy4vSWNvbnMnKTtcclxuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuL0xhYmVsJyk7XHJcbmNvbnN0IEd1aWxkID0gcmVxdWlyZSgnLi9HdWlsZCcpO1xyXG5jb25zdCBUaW1lckNvdW50ZG93biA9IHJlcXVpcmUoJy4vVGltZXJDb3VudGRvd24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1vZHVsZSBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGNvbERlZmF1bHRzID0ge1xyXG5cdGVsYXBzZWQ6IGZhbHNlLFxyXG5cdHRpbWVzdGFtcDogZmFsc2UsXHJcblx0bWFwQWJicmV2OiBmYWxzZSxcclxuXHRhcnJvdzogZmFsc2UsXHJcblx0c3ByaXRlOiBmYWxzZSxcclxuXHRuYW1lOiBmYWxzZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogZmFsc2UsXHJcblx0Z3VpbGRUYWc6IGZhbHNlLFxyXG5cdHRpbWVyOiBmYWxzZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE9iamVjdGl2ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdDYXB0dXJlID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcblx0XHRjb25zdCBuZXdPd25lciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZENvbG9yLCBuZXh0UHJvcHMud29ybGRDb2xvcik7XHJcblx0XHRjb25zdCBuZXdDbGFpbWVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkSWQsIG5leHRQcm9wcy5ndWlsZElkKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnT2JqZWN0aXZlOnJlbmRlcigpJywgdGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblxyXG5cdFx0Y29uc3Qgb2JqZWN0aXZlSWQgPSB0aGlzLnByb3BzLm9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcblx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQob2JqZWN0aXZlSWQpO1xyXG5cclxuXHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdGlmIChvTWV0YS5pc0VtcHR5KCkpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgY29scyA9IF8uZGVmYXVsdHModGhpcy5wcm9wcy5jb2xzLCBjb2xEZWZhdWx0cyk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtgb2JqZWN0aXZlIHRlYW0gJHt0aGlzLnByb3BzLndvcmxkQ29sb3J9YH0+XHJcblx0XHRcdFx0PFRpbWVyUmVsYXRpdmUgaXNFbmFibGVkPXshIWNvbHMuZWxhcHNlZH0gdGltZXN0YW1wPXtwcm9wcy50aW1lc3RhbXB9IC8+XHJcblx0XHRcdFx0PFRpbWVzdGFtcCBpc0VuYWJsZWQ9eyEhY29scy50aW1lc3RhbXB9IHRpbWVzdGFtcD17cHJvcHMudGltZXN0YW1wfSAvPlxyXG5cdFx0XHRcdDxNYXBOYW1lIGlzRW5hYmxlZD17ISFjb2xzLm1hcEFiYnJldn0gb2JqZWN0aXZlSWQ9e29iamVjdGl2ZUlkfSAvPlxyXG5cclxuXHRcdFx0XHQ8SWNvbnNcclxuXHRcdFx0XHRcdHNob3dBcnJvdz17ISFjb2xzLmFycm93fVxyXG5cdFx0XHRcdFx0c2hvd1Nwcml0ZT17ISFjb2xzLnNwcml0ZX1cclxuXHRcdFx0XHRcdG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH1cclxuXHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLndvcmxkQ29sb3J9XHJcblx0XHRcdFx0Lz5cclxuXHJcblx0XHRcdFx0PExhYmVsIGlzRW5hYmxlZD17ISFjb2xzLm5hbWV9IG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH0gbGFuZz17dGhpcy5wcm9wcy5sYW5nfSAvPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG5cdFx0XHRcdFx0PEd1aWxkXHJcblx0XHRcdFx0XHRcdHNob3dOYW1lPXtjb2xzLmd1aWxkTmFtZX1cclxuXHRcdFx0XHRcdFx0c2hvd1RhZz17Y29scy5ndWlsZFRhZ31cclxuXHRcdFx0XHRcdFx0Z3VpbGRJZD17dGhpcy5wcm9wcy5ndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRndWlsZD17dGhpcy5wcm9wcy5ndWlsZH1cclxuXHRcdFx0XHRcdC8+XHJcblxyXG5cdFx0XHRcdFx0PFRpbWVyQ291bnRkb3duIGlzRW5hYmxlZD17ISFjb2xzLnRpbWVyfSB0aW1lc3RhbXA9e3Byb3BzLnRpbWVzdGFtcH0gLz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5PYmplY3RpdmUucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0d29ybGRDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdGV2ZW50VHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcblx0Z3VpbGRJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcblxyXG5cdGNvbHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3RpdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy8vU3ByaXRlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEhvbGRpbmdzSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQocHJvcHMudHlwZUlkKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3UXVhbnRpdHkgPSAodGhpcy5wcm9wcy50eXBlUXVhbnRpdHkgIT09IG5leHRQcm9wcy50eXBlUXVhbnRpdHkpO1xyXG5cdFx0Y29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblx0XHRjb25zdCBuZXdDb2xvciA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1F1YW50aXR5IHx8IG5ld1R5cGUgfHwgbmV3Q29sb3IpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUeXBlID0gKHRoaXMucHJvcHMudHlwZUlkICE9PSBuZXh0UHJvcHMudHlwZUlkKTtcclxuXHJcblx0XHRpZiAobmV3VHlwZSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQodGhpcy5wcm9wcy50eXBlSWQpfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpTY29yZWJvYXJkOjpIb2xkaW5nc0l0ZW06cmVuZGVyKCknLCB0aGlzLnN0YXRlLm9UeXBlLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpPlxyXG5cdFx0XHRcdDxTcHJpdGVcclxuXHRcdFx0XHRcdHR5cGU9e3RoaXMuc3RhdGUub1R5cGUuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy5jb2xvcn1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHRcdHtgIHgke3RoaXMucHJvcHMudHlwZVF1YW50aXR5fWB9XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Ib2xkaW5nc0l0ZW0ucHJvcFR5cGVzID0ge1xyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0dHlwZVF1YW50aXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0dHlwZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb2xkaW5nc0l0ZW07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgSG9sZGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0hvbGRpbmdzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmhvbGRpbmdzLCBuZXh0UHJvcHMuaG9sZGluZ3MpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0hvbGRpbmdzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcblx0XHRcdHt0aGlzLnByb3BzLmhvbGRpbmdzLm1hcCgodHlwZVF1YW50aXR5LCB0eXBlSW5kZXgpID0+XHJcblx0XHRcdFx0PEl0ZW1cclxuXHRcdFx0XHRcdGtleT17dHlwZUluZGV4fVxyXG5cdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMuY29sb3J9XHJcblx0XHRcdFx0XHR0eXBlUXVhbnRpdHk9e3R5cGVRdWFudGl0eX1cclxuXHRcdFx0XHRcdHR5cGVJZD17KHR5cGVJbmRleCsxKS50b1N0cmluZygpfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdCl9XHJcblx0XHQ8L3VsPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuSG9sZGluZ3MucHJvcFR5cGVzID0ge1xyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0aG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9sZGluZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8aDEgc3R5bGU9e3toZWlnaHQ6ICc5MHB4JywgZm9udFNpemU6ICczMnB0JywgbGluZUhlaWdodDogJzkwcHgnfX0+XHJcblx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgSG9sZGluZ3MgPSByZXF1aXJlKCcuL0hvbGRpbmdzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdXb3JsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuXHRcdGNvbnN0IG5ld1Njb3JlID0gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcblx0XHRjb25zdCBuZXdUaWNrID0gKHRoaXMucHJvcHMudGljayAhPT0gbmV4dFByb3BzLnRpY2spO1xyXG5cdFx0Y29uc3QgbmV3SG9sZGluZ3MgPSAodGhpcy5wcm9wcy5ob2xkaW5ncyAhPT0gbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZCB8fCBuZXdTY29yZSB8fCBuZXdUaWNrIHx8IG5ld0hvbGRpbmdzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2BzY29yZWJvYXJkIHRlYW0tYmcgdGVhbSB0ZXh0LWNlbnRlciAke3RoaXMucHJvcHMud29ybGQuZ2V0KCdjb2xvcicpfWB9PlxyXG5cdFx0XHRcdFx0eyh0aGlzLnByb3BzLndvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAodGhpcy5wcm9wcy53b3JsZCkpXHJcblx0XHRcdFx0XHRcdD8gIDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgxPjxhIGhyZWY9e3RoaXMucHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9PlxyXG5cdFx0XHRcdFx0XHRcdFx0e3RoaXMucHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHRcdFx0PC9hPjwvaDE+XHJcblx0XHRcdFx0XHRcdFx0PGgyPlxyXG5cdFx0XHRcdFx0XHRcdFx0e251bWVyYWwodGhpcy5wcm9wcy5zY29yZSkuZm9ybWF0KCcwLDAnKX1cclxuXHRcdFx0XHRcdFx0XHRcdHsnICd9XHJcblx0XHRcdFx0XHRcdFx0XHR7bnVtZXJhbCh0aGlzLnByb3BzLnRpY2spLmZvcm1hdCgnKzAsMCcpfVxyXG5cdFx0XHRcdFx0XHRcdDwvaDI+XHJcblxyXG5cdFx0XHRcdFx0XHRcdDxIb2xkaW5nc1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMud29ybGQuZ2V0KCdjb2xvcicpfVxyXG5cdFx0XHRcdFx0XHRcdFx0aG9sZGluZ3M9e3RoaXMucHJvcHMuaG9sZGluZ3N9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDogbG9hZGluZ0h0bWxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSB7XHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0c2NvcmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHR0aWNrOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0aG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBTY29yZWJvYXJkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc2NvcmVzJykpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkcyB8fCBuZXdTY29yZXMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdTY29yZWJvYXJkOjpXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG5cdFx0Y29uc3Qgc2NvcmVzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpO1xyXG5cdFx0Y29uc3QgdGlja3MgPSB0aGlzLnByb3BzLm1hdGNoLmdldCgndGlja3MnKTtcclxuXHRcdGNvbnN0IGhvbGRpbmdzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ2hvbGRpbmdzJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNlY3Rpb24gY2xhc3NOYW1lPVwicm93XCIgaWQ9XCJzY29yZWJvYXJkc1wiPlxyXG5cdFx0XHRcdHt0aGlzLnByb3BzLm1hdGNoV29ybGRzLnRvU2VxKCkubWFwKCh3b3JsZCwgaXhXb3JsZCkgPT5cclxuXHRcdFx0XHRcdDxXb3JsZFxyXG5cdFx0XHRcdFx0XHRrZXk9e2l4V29ybGR9XHJcblx0XHRcdFx0XHRcdHdvcmxkPXt3b3JsZH1cclxuXHRcdFx0XHRcdFx0c2NvcmU9e3Njb3Jlcy5nZXQoaXhXb3JsZCkgfHwgMH1cclxuXHRcdFx0XHRcdFx0dGljaz17dGlja3MuZ2V0KGl4V29ybGQpIHx8IDB9XHJcblx0XHRcdFx0XHRcdGhvbGRpbmdzPXtob2xkaW5ncy5nZXQoaXhXb3JsZCl9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNjb3JlYm9hcmQucHJvcFR5cGVzID0ge1xyXG5cdG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlYm9hcmQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGFwaSA9IHJlcXVpcmUoJ2xpYi9hcGkuanMnKTtcclxuY29uc3QgbGliRGF0ZSA9IHJlcXVpcmUoJ2xpYi9kYXRlLmpzJyk7XHJcbmNvbnN0IHRyYWNrZXJUaW1lcnMgPSByZXF1aXJlKCdsaWIvdHJhY2tlclRpbWVycycpO1xyXG5cclxuY29uc3QgR3VpbGRzTGliID0gcmVxdWlyZSgnbGliL3RyYWNrZXIvZ3VpbGRzLmpzJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmVib2FyZCA9IHJlcXVpcmUoJy4vU2NvcmVib2FyZCcpO1xyXG5jb25zdCBNYXBzID0gcmVxdWlyZSgnLi9NYXBzJyk7XHJcbmNvbnN0IEd1aWxkcyA9IHJlcXVpcmUoJy4vR3VpbGRzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0aGFzRGF0YTogZmFsc2UsXHJcblxyXG5cdFx0XHRkYXRlTm93OiBsaWJEYXRlLmRhdGVOb3coKSxcclxuXHRcdFx0bGFzdG1vZDogMCxcclxuXHRcdFx0dGltZU9mZnNldDogMCxcclxuXHJcblx0XHRcdG1hdGNoOiBJbW11dGFibGUuTWFwKHtsYXN0bW9kOjB9KSxcclxuXHRcdFx0bWF0Y2hXb3JsZHM6IEltbXV0YWJsZS5MaXN0KCksXHJcblx0XHRcdGRldGFpbHM6IEltbXV0YWJsZS5NYXAoKSxcclxuXHRcdFx0Y2xhaW1FdmVudHM6IEltbXV0YWJsZS5MaXN0KCksXHJcblx0XHRcdGd1aWxkczogSW1tdXRhYmxlLk1hcCgpLFxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmludGVydmFscyA9IHtcclxuXHRcdFx0dGltZXJzOiBudWxsXHJcblx0XHR9O1xyXG5cdFx0dGhpcy50aW1lb3V0cyA9IHtcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5ndWlsZExpYiA9IG5ldyBHdWlsZHNMaWIodGhpcyk7XHJcblx0fVxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcblx0XHRjb25zdCBpbml0aWFsRGF0YSA9ICFfLmlzRXF1YWwodGhpcy5zdGF0ZS5oYXNEYXRhLCBuZXh0U3RhdGUuaGFzRGF0YSk7XHJcblx0XHRjb25zdCBuZXdNYXRjaERhdGEgPSAhXy5pc0VxdWFsKHRoaXMuc3RhdGUubGFzdG1vZCwgbmV4dFN0YXRlLmxhc3Rtb2QpO1xyXG5cclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5ndWlsZHMsIG5leHRTdGF0ZS5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRpbml0aWFsRGF0YVxyXG5cdFx0XHR8fCBuZXdNYXRjaERhdGFcclxuXHRcdFx0fHwgbmV3R3VpbGREYXRhXHJcblx0XHRcdHx8IG5ld0xhbmdcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50RGlkTW91bnQoKScpO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxzLnRpbWVycyA9IHNldEludGVydmFsKHVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCAxMDAwKTtcclxuXHRcdHNldEltbWVkaWF0ZSh1cGRhdGVUaW1lcnMuYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0c2V0SW1tZWRpYXRlKGdldE1hdGNoRGV0YWlscy5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVubW91bnQoKScpO1xyXG5cclxuXHRcdGNsZWFyVGltZXJzLmNhbGwodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZygnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpJywgbmV3TGFuZyk7XHJcblxyXG5cdFx0aWYgKG5ld0xhbmcpIHtcclxuXHRcdFx0c2V0TWF0Y2hXb3JsZHMuY2FsbCh0aGlzLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XHJcblx0Ly8gXHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVwZGF0ZSgpJyk7XHJcblx0Ly8gfVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cdFx0c2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG5cclxuXHRcdGlmICghdGhpcy5zdGF0ZS5oYXNEYXRhKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBpZD1cInRyYWNrZXJcIj5cclxuXHJcblx0XHRcdFx0ezxTY29yZWJvYXJkXHJcblx0XHRcdFx0XHRtYXRjaFdvcmxkcz17dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuXHRcdFx0XHRcdG1hdGNoPXt0aGlzLnN0YXRlLm1hdGNofVxyXG5cdFx0XHRcdC8+fVxyXG5cclxuXHRcdFx0XHR7PE1hcHNcclxuXHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdGRldGFpbHM9e3RoaXMuc3RhdGUuZGV0YWlsc31cclxuXHRcdFx0XHRcdG1hdGNoV29ybGRzPXt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG5cdFx0XHRcdFx0Z3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuXHRcdFx0XHQvPn1cclxuXHJcblx0XHRcdFx0ezxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG5cdFx0XHRcdFx0XHR7KCF0aGlzLnN0YXRlLmd1aWxkcy5pc0VtcHR5KCkpXHJcblx0XHRcdFx0XHRcdFx0PyA8R3VpbGRzXHJcblx0XHRcdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuXHRcdFx0XHRcdFx0XHRcdGNsYWltRXZlbnRzPXt0aGlzLnN0YXRlLmNsYWltRXZlbnRzfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdFx0OiBudWxsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2Pn1cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UcmFja2VyLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJhY2tlcjtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFRpbWVyc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGltZXJzKCkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVUaW1lcnMoKScpO1xyXG5cclxuXHRjb25zdCB0aW1lT2Zmc2V0ID0gc3RhdGUudGltZU9mZnNldDtcclxuXHRjb25zdCBub3cgPSBsaWJEYXRlLmRhdGVOb3coKSAtIHRpbWVPZmZzZXQ7XHJcblxyXG5cdHRyYWNrZXJUaW1lcnMudXBkYXRlKG5vdywgdGltZU9mZnNldCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2xlYXJUaW1lcnMoKXtcclxuXHQvLyBjb25zb2xlLmxvZygnY2xlYXJUaW1lcnMoKScpO1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRfLmZvckVhY2goY29tcG9uZW50LmludGVydmFscywgY2xlYXJJbnRlcnZhbCk7XHJcblx0Xy5mb3JFYWNoKGNvbXBvbmVudC50aW1lb3V0cywgY2xlYXJUaW1lb3V0KTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKCkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHByb3BzID0gY29tcG9uZW50LnByb3BzO1xyXG5cclxuXHRjb25zdCB3b3JsZCA9IHByb3BzLndvcmxkO1xyXG5cdGNvbnN0IGxhbmdTbHVnID0gcHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHRjb25zdCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG5cclxuXHRhcGkuZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZChcclxuXHRcdHdvcmxkU2x1ZyxcclxuXHRcdG9uTWF0Y2hEZXRhaWxzLmJpbmQodGhpcylcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uTWF0Y2hEZXRhaWxzKGVyciwgZGF0YSkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHByb3BzID0gY29tcG9uZW50LnByb3BzO1xyXG5cdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHJcblx0aWYgKGNvbXBvbmVudC5tb3VudGVkKSB7XHJcblx0XHRpZiAoIWVyciAmJiBkYXRhICYmIGRhdGEubWF0Y2ggJiYgZGF0YS5kZXRhaWxzKSB7XHJcblx0XHRcdGNvbnN0IGxhc3Rtb2QgPSBkYXRhLm1hdGNoLmxhc3Rtb2Q7XHJcblx0XHRcdGNvbnN0IGlzTW9kaWZpZWQgPSAobGFzdG1vZCAhPT0gc3RhdGUubWF0Y2guZ2V0KCdsYXN0bW9kJykpO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgZGF0YS5tYXRjaC5sYXN0bW9kLCBpc01vZGlmaWVkKTtcclxuXHJcblx0XHRcdGlmIChpc01vZGlmaWVkKSB7XHJcblx0XHRcdFx0Y29uc3QgZGF0ZU5vdyA9IGxpYkRhdGUuZGF0ZU5vdygpO1xyXG5cdFx0XHRcdGNvbnN0IHRpbWVPZmZzZXQgPSBNYXRoLmZsb29yKGRhdGVOb3cgIC0gKGRhdGEubm93IC8gMTAwMCkpO1xyXG5cclxuXHRcdFx0XHRjb25zdCBtYXRjaERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubWF0Y2gpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsICdtYXRjaCcsIEltbXV0YWJsZS5pcyhtYXRjaERhdGEsIHN0YXRlLm1hdGNoKSk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgbWF0Y2gpO1xyXG5cclxuXHRcdFx0XHRjb25zdCBkZXRhaWxzRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5kZXRhaWxzKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCAnZGV0YWlscycsIEltbXV0YWJsZS5pcyhkZXRhaWxzRGF0YSwgc3RhdGUuZGV0YWlscykpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsIGRldGFpbHMpO1xyXG5cclxuXHRcdFx0XHQvLyB1c2UgdHJhbnNhY3Rpb25hbCBzZXRTdGF0ZVxyXG5cdFx0XHRcdGNvbXBvbmVudC5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG5cdFx0XHRcdFx0aGFzRGF0YTogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGVOb3csXHJcblx0XHRcdFx0XHR0aW1lT2Zmc2V0LFxyXG5cdFx0XHRcdFx0bGFzdG1vZCxcclxuXHJcblx0XHRcdFx0XHRtYXRjaDogc3RhdGUubWF0Y2gubWVyZ2VEZWVwKG1hdGNoRGF0YSksXHJcblx0XHRcdFx0XHRkZXRhaWxzOiBzdGF0ZS5kZXRhaWxzLm1lcmdlRGVlcChkZXRhaWxzRGF0YSksXHJcblx0XHRcdFx0fSkpO1xyXG5cclxuXHJcblx0XHRcdFx0c2V0SW1tZWRpYXRlKGNvbXBvbmVudC5ndWlsZExpYi5vbk1hdGNoRGF0YS5iaW5kKGNvbXBvbmVudC5ndWlsZExpYiwgZGV0YWlsc0RhdGEpKTtcclxuXHJcblx0XHRcdFx0aWYgKHN0YXRlLm1hdGNoV29ybGRzLmlzRW1wdHkoKSkge1xyXG5cdFx0XHRcdFx0c2V0SW1tZWRpYXRlKHNldE1hdGNoV29ybGRzLmJpbmQoY29tcG9uZW50LCBwcm9wcy5sYW5nKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJlc2NoZWR1bGVEYXRhVXBkYXRlLmNhbGwoY29tcG9uZW50KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcmVzY2hlZHVsZURhdGFVcGRhdGUoKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3QgcmVmcmVzaFRpbWUgPSBfLnJhbmRvbSgxMDAwKjIsIDEwMDAqNCk7XHJcblxyXG5cdGNvbXBvbmVudC50aW1lb3V0cy5kYXRhID0gc2V0VGltZW91dChnZXRNYXRjaERldGFpbHMuYmluZChjb21wb25lbnQpLCByZWZyZXNoVGltZSk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNYXRjaFdvcmxkc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRNYXRjaFdvcmxkcyhsYW5nKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdGNvbXBvbmVudC5zZXRTdGF0ZSh7bWF0Y2hXb3JsZHM6IEltbXV0YWJsZVxyXG5cdFx0Lkxpc3QoWydyZWQnLCAnYmx1ZScsICdncmVlbiddKVxyXG5cdFx0Lm1hcChnZXRNYXRjaFdvcmxkLmJpbmQoY29tcG9uZW50LCBsYW5nKSlcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaFdvcmxkKGxhbmcsIGNvbG9yKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0Y29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcblx0Y29uc3Qgd29ybGRJZCA9IHN0YXRlLm1hdGNoLmdldEluKFt3b3JsZEtleV0pLnRvU3RyaW5nKCk7XHJcblxyXG5cdGNvbnN0IHdvcmxkQnlMYW5nID0gU1RBVElDLndvcmxkcy5nZXRJbihbd29ybGRJZCwgbGFuZ1NsdWddKTtcclxuXHJcblx0cmV0dXJuIHdvcmxkQnlMYW5nXHJcblx0XHQuc2V0KCdjb2xvcicsIGNvbG9yKVxyXG5cdFx0LnNldCgnbGluaycsIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGRCeUxhbmcpKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcblx0cmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcblx0bGV0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHRsZXQgd29ybGROYW1lID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnbmFtZSddKTtcclxuXHJcblx0bGV0IHRpdGxlID0gW3dvcmxkTmFtZSwgJ2d3MncydyddO1xyXG5cclxuXHRpZiAobGFuZ1NsdWcgIT09ICdlbicpIHtcclxuXHRcdHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcblx0fVxyXG5cclxuXHQkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3T2JqZWN0aXZlTWV0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vTWV0YSwgbmV4dFByb3BzLm9NZXRhKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdPYmplY3RpdmVNZXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgaW1nU3JjID0gZ2V0QXJyb3dTcmModGhpcy5wcm9wcy5vTWV0YSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZGlyZWN0aW9uXCI+XHJcblx0XHRcdFx0e2ltZ1NyYyA/IDxpbWcgc3JjPXtpbWdTcmN9IC8+IDogbnVsbH1cclxuXHRcdFx0PC9zcGFuPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuQXJyb3cucHJvcFR5cGVzID0ge1xyXG5cdG9NZXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldEFycm93U3JjKG1ldGEpIHtcclxuXHRpZiAoIW1ldGEuZ2V0KCdkJykpIHtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0bGV0IHNyYyA9IFsnL2ltZy9pY29ucy9kaXN0L2Fycm93J107XHJcblxyXG5cdGlmIChtZXRhLmdldCgnbicpKSB7c3JjLnB1c2goJ25vcnRoJyk7IH1cclxuXHRlbHNlIGlmIChtZXRhLmdldCgncycpKSB7c3JjLnB1c2goJ3NvdXRoJyk7IH1cclxuXHJcblx0aWYgKG1ldGEuZ2V0KCd3JykpIHtzcmMucHVzaCgnd2VzdCcpOyB9XHJcblx0ZWxzZSBpZiAobWV0YS5nZXQoJ2UnKSkge3NyYy5wdXNoKCdlYXN0Jyk7IH1cclxuXHJcblx0cmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGltZ1BsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjwvc3ZnPic7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgRW1ibGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdHdWlsZE5hbWUgPSAodGhpcy5wcm9wcy5ndWlsZE5hbWUgIT09IG5leHRQcm9wcy5ndWlsZE5hbWUpO1xyXG5cdFx0Y29uc3QgbmV3U2l6ZSA9ICh0aGlzLnByb3BzLnNpemUgIT09IG5leHRQcm9wcy5zaXplKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGROYW1lIHx8IG5ld1NpemUpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBlbWJsZW1TcmMgPSBnZXRFbWJsZW1TcmModGhpcy5wcm9wcy5ndWlsZE5hbWUpO1xyXG5cclxuXHRcdHJldHVybiA8aW1nXHJcblx0XHRcdGNsYXNzTmFtZT1cImVtYmxlbVwiXHJcblx0XHRcdHNyYz17ZW1ibGVtU3JjfVxyXG5cdFx0XHR3aWR0aD17dGhpcy5wcm9wcy5zaXplfVxyXG5cdFx0XHRoZWlnaHQ9e3RoaXMucHJvcHMuc2l6ZX1cclxuXHRcdFx0b25FcnJvcj17aW1nT25FcnJvcn1cclxuXHRcdC8+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5FbWJsZW0uZGVmYXVsdFByb3BzID0ge1xyXG5cdGd1aWxkTmFtZTogdW5kZWZpbmVkLFxyXG5cdHNpemU6IDI1NixcclxufTtcclxuXHJcbkVtYmxlbS5wcm9wVHlwZXMgPSB7XHJcblx0Z3VpbGROYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVtYmxlbTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcblx0cmV0dXJuIChndWlsZE5hbWUpXHJcblx0XHQ/IGBodHRwOlxcL1xcL2d1aWxkcy5ndzJ3MncuY29tXFwvZ3VpbGRzXFwvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9XFwvMjU2LnN2Z2BcclxuXHRcdDogaW1nUGxhY2Vob2xkZXI7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcclxuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW1nT25FcnJvcihlKSB7XHJcblx0Y29uc3QgY3VycmVudFNyYyA9ICQoZS50YXJnZXQpLmF0dHIoJ3NyYycpO1xyXG5cclxuXHRpZiAoY3VycmVudFNyYyAhPT0gaW1nUGxhY2Vob2xkZXIpIHtcclxuXHRcdCQoZS50YXJnZXQpLmF0dHIoJ3NyYycsIGltZ1BsYWNlaG9sZGVyKTtcclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBJTlNUQU5DRSA9IHtcclxuXHRzaXplOiA2MCxcclxuXHRzdHJva2U6IDIsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFBpZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdQaWU6OnJlbmRlcicsIHByb3BzLnNjb3Jlcy50b0FycmF5KCkpO1xyXG5cclxuXHRcdHJldHVybiA8aW1nXHJcblx0XHRcdHdpZHRoPXtJTlNUQU5DRS5zaXplfVxyXG5cdFx0XHRoZWlnaHQ9e0lOU1RBTkNFLnNpemV9XHJcblx0XHRcdHNyYz17Z2V0SW1hZ2VTb3VyY2UocHJvcHMuc2NvcmVzLnRvQXJyYXkoKSl9XHJcblx0XHQvPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuUGllLnByb3BUeXBlcyA9IHtcclxuXHRzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGllO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0SW1hZ2VTb3VyY2Uoc2NvcmVzKSB7XHJcblx0cmV0dXJuIGBodHRwOlxcL1xcL3d3dy5waWVseS5uZXRcXC8ke0lOU1RBTkNFLnNpemV9XFwvJHtzY29yZXMuam9pbignLCcpfT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFNwcml0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge3JldHVybiAhXy5pc0VxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17YHNwcml0ZSAke3Byb3BzLnR5cGV9ICR7cHJvcHMuY29sb3J9YH0gLz47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNwcml0ZS5wcm9wVHlwZXMgPSB7XHJcblx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnRlZCBDb21wb25lbnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTGFuZ0xpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRjb25zdCBpc0FjdGl2ZSA9IEltbXV0YWJsZS5pcyhwcm9wcy5sYW5nLCBwcm9wcy5saW5rTGFuZyk7XHJcblx0XHRjb25zdCB0aXRsZSA9IHByb3BzLmxpbmtMYW5nLmdldCgnbmFtZScpO1xyXG5cdFx0Y29uc3QgbGFiZWwgPSBwcm9wcy5saW5rTGFuZy5nZXQoJ2xhYmVsJyk7XHJcblx0XHRjb25zdCBsaW5rID0gZ2V0TGluayhwcm9wcy5saW5rTGFuZywgcHJvcHMud29ybGQpO1xyXG5cclxuXHRcdHJldHVybiA8bGkgY2xhc3NOYW1lPXtpc0FjdGl2ZSA/ICdhY3RpdmUnIDogJyd9IHRpdGxlPXt0aXRsZX0+XHJcblx0XHRcdDxhIGhyZWY9e2xpbmt9PntsYWJlbH08L2E+XHJcblx0XHQ8L2xpPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTGFuZ0xpbmsucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cdGxpbmtMYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFuZ0xpbms7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcblx0Y29uc3QgbGFuZ1NsdWcgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG5cclxuXHRsZXQgbGluayA9IGAvJHtsYW5nU2x1Z31gO1xyXG5cclxuXHRpZiAod29ybGQpIHtcclxuXHRcdGxldCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG5cdFx0bGluayArPSBgLyR7d29ybGRTbHVnfWA7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbGluaztcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBMYW5nTGluayA9IHJlcXVpcmUoJy4vTGFuZ0xpbmsnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydGVkIENvbXBvbmVudFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMYW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMYW5nczo6cmVuZGVyKCknLCB0aGlzLnByb3BzLmxhbmcudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPSduYXYgbmF2YmFyLW5hdic+XHJcblx0XHRcdFx0e1NUQVRJQy5sYW5ncy50b1NlcSgpLm1hcCgobGlua0xhbmcsIGtleSkgPT5cclxuXHRcdFx0XHRcdDxMYW5nTGlua1xyXG5cdFx0XHRcdFx0XHRrZXk9e2tleX1cclxuXHRcdFx0XHRcdFx0bGlua0xhbmc9e2xpbmtMYW5nfVxyXG5cdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdHdvcmxkPXt0aGlzLnByb3BzLndvcmxkfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTGFuZ3MucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFuZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldEd1aWxkRGV0YWlsczogZ2V0R3VpbGREZXRhaWxzLFxyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Ly8gZ2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzQnlXb3JsZDogZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCxcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRHdWlsZERldGFpbHMoe2d1aWxkX2lkOiBndWlsZElkfSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhtYXRjaElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7bWF0Y2hfaWQ6IG1hdGNoSWR9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCh3b3JsZFNsdWcsIGNhbGxiYWNrKSB7XHJcblx0Ly8gc2V0VGltZW91dChcclxuXHQvLyBcdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZS5iaW5kKG51bGwsIHt3b3JsZF9zbHVnOiB3b3JsZFNsdWd9LCBjYWxsYmFjayksXHJcblx0Ly8gXHQzMDAwXHJcblx0Ly8gKTtcclxuXHRndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe3dvcmxkX3NsdWc6IHdvcmxkU2x1Z30sIGNhbGxiYWNrKTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0ZGF0ZU5vdzogZGF0ZU5vdyxcclxuXHRhZGQ1OiBhZGQ1LFxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRhdGVOb3coKSB7XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoXy5ub3coKSAvIDEwMDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkNShpbkRhdGUpIHtcclxuXHRsZXQgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcblx0cmV0dXJuIChfYmFzZURhdGUgKyAoNSAqIDYwKSk7XHJcbn1cclxuIiwiY29uc3Qgc3RhdGljcyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgaW1tdXRhYmxlU3RhdGljcyA9IHtcclxuXHRsYW5nczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLmxhbmdzKSxcclxuXHR3b3JsZHM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy53b3JsZHMpLFxyXG5cdG9iamVjdGl2ZV9uYW1lczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9uYW1lcyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX3R5cGVzKSxcclxuXHRvYmplY3RpdmVfbWV0YTogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tZXRhKSxcclxuXHRvYmplY3RpdmVfbGFiZWxzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX2xhYmVscyksXHJcblx0b2JqZWN0aXZlX21hcDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tYXApLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbW11dGFibGVTdGF0aWNzOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHt1cGRhdGV9O1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKG5vdywgdGltZU9mZnNldCkge1xyXG5cdGxldCAkdGltZXJzID0gJCgnLnRpbWVyJyk7XHJcblx0bGV0ICRjb3VudGRvd25zID0gJHRpbWVycy5maWx0ZXIoJy5jb3VudGRvd24nKTtcclxuXHRsZXQgJHJlbGF0aXZlcyA9ICR0aW1lcnMuZmlsdGVyKCcucmVsYXRpdmUnKTtcclxuXHJcblx0YXN5bmMucGFyYWxsZWwoW1xyXG5cdFx0dXBkYXRlUmVsYXRpdmVUaW1lcnMuYmluZChudWxsLCAkcmVsYXRpdmVzLCB0aW1lT2Zmc2V0KSxcclxuXHRcdHVwZGF0ZUNvdW50ZG93blRpbWVycy5iaW5kKG51bGwsICRjb3VudGRvd25zLCBub3cpLFxyXG5cdF0sIF8ubm9vcCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lcnMocmVsYXRpdmVzLCB0aW1lT2Zmc2V0LCBjYikge1xyXG5cdGFzeW5jLmVhY2goXHJcblx0XHRyZWxhdGl2ZXMsXHJcblx0XHR1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlLmJpbmQobnVsbCwgdGltZU9mZnNldCksXHJcblx0XHRjYlxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJzKGNvdW50ZG93bnMsIG5vdywgY2IpIHtcclxuXHRhc3luYy5lYWNoKFxyXG5cdFx0Y291bnRkb3ducyxcclxuXHRcdHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZS5iaW5kKG51bGwsIG5vdyksXHJcblx0XHRjYlxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lTm9kZSh0aW1lT2Zmc2V0LCBlbCwgbmV4dCkge1xyXG5cdGxldCAkZWwgPSAkKGVsKTtcclxuXHJcblx0Y29uc3QgdGltZXN0YW1wID0gXy5wYXJzZUludCgkZWwuYXR0cignZGF0YS10aW1lc3RhbXAnKSk7XHJcblx0Y29uc3Qgb2Zmc2V0VGltZXN0YW1wID0gdGltZXN0YW1wICsgdGltZU9mZnNldDtcclxuXHRjb25zdCB0aW1lc3RhbXBNb21lbnQgPSBtb21lbnQob2Zmc2V0VGltZXN0YW1wICogMTAwMCk7XHJcblx0Y29uc3QgdGltZXN0YW1wUmVsYXRpdmUgPSB0aW1lc3RhbXBNb21lbnQudHdpdHRlclNob3J0KCk7XHJcblxyXG5cdCRlbC50ZXh0KHRpbWVzdGFtcFJlbGF0aXZlKTtcclxuXHJcblx0bmV4dCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZShub3csIGVsLCBuZXh0KSB7XHJcblx0bGV0ICRlbCA9ICQoZWwpO1xyXG5cclxuXHRjb25zdCBkYXRhRXhwaXJlcyA9ICRlbC5hdHRyKCdkYXRhLWV4cGlyZXMnKTtcclxuXHRjb25zdCBleHBpcmVzID0gXy5wYXJzZUludChkYXRhRXhwaXJlcyk7XHJcblx0Y29uc3Qgc2VjUmVtYWluaW5nID0gKGV4cGlyZXMgLSBub3cpO1xyXG5cdGNvbnN0IHNlY0VsYXBzZWQgPSAzMDAgLSBzZWNSZW1haW5pbmc7XHJcblxyXG5cdGNvbnN0IGhpZ2hsaXRlVGltZSA9IDEwO1xyXG5cdGNvbnN0IGlzVmlzaWJsZSA9IGV4cGlyZXMgKyBoaWdobGl0ZVRpbWUgPj0gbm93O1xyXG5cdGNvbnN0IGlzRXhwaXJlZCA9IGV4cGlyZXMgPCBub3c7XHJcblx0Y29uc3QgaXNBY3RpdmUgPSAhaXNFeHBpcmVkO1xyXG5cdGNvbnN0IGlzVGltZXJIaWdobGlnaHRlZCA9IChzZWNSZW1haW5pbmcgPD0gTWF0aC5hYnMoaGlnaGxpdGVUaW1lKSk7XHJcblx0Y29uc3QgaXNUaW1lckZyZXNoID0gKHNlY0VsYXBzZWQgPD0gaGlnaGxpdGVUaW1lKTtcclxuXHJcblxyXG5cdGNvbnN0IHRpbWVyVGV4dCA9IChpc0FjdGl2ZSlcclxuXHRcdD8gbW9tZW50KHNlY1JlbWFpbmluZyAqIDEwMDApLmZvcm1hdCgnbTpzcycpXHJcblx0XHQ6ICcwOjAwJztcclxuXHJcblxyXG5cdGlmIChpc1Zpc2libGUpIHtcclxuXHRcdGxldCAkb2JqZWN0aXZlID0gJGVsLmNsb3Nlc3QoJy5vYmplY3RpdmUnKTtcclxuXHRcdGxldCBoYXNDbGFzc0hpZ2hsaWdodCA9ICRlbC5oYXNDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcblx0XHRsZXQgaGFzQ2xhc3NGcmVzaCA9ICRvYmplY3RpdmUuaGFzQ2xhc3MoJ2ZyZXNoJyk7XHJcblxyXG5cdFx0aWYgKGlzVGltZXJIaWdobGlnaHRlZCAmJiAhaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuXHRcdFx0JGVsLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKCFpc1RpbWVySGlnaGxpZ2h0ZWQgJiYgaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuXHRcdFx0JGVsLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNUaW1lckZyZXNoICYmICFoYXNDbGFzc0ZyZXNoKSB7XHJcblx0XHRcdCRvYmplY3RpdmUuYWRkQ2xhc3MoJ2ZyZXNoJyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghaXNUaW1lckZyZXNoICYmIGhhc0NsYXNzRnJlc2gpIHtcclxuXHRcdFx0JG9iamVjdGl2ZS5yZW1vdmVDbGFzcygnZnJlc2gnKTtcclxuXHRcdH1cclxuXHJcblx0XHQkZWwudGV4dCh0aW1lclRleHQpXHJcblx0XHRcdC5maWx0ZXIoJy5pbmFjdGl2ZScpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKVxyXG5cdFx0XHQuZW5kKCk7XHJcblxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdCRlbC5maWx0ZXIoJy5hY3RpdmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2luYWN0aXZlJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpXHJcblx0XHQuZW5kKCk7XHJcblx0fVxyXG5cclxuXHRuZXh0KCk7XHJcbn1cclxuIiwiXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuY29uc3QgYXBpID0gcmVxdWlyZSgnbGliL2FwaS5qcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgZ3VpbGREZWZhdWx0ID0gSW1tdXRhYmxlLk1hcCh7XHJcblx0J2xvYWRlZCc6IGZhbHNlLFxyXG5cdCdsYXN0Q2xhaW0nOiAwLFxyXG5cdCdjbGFpbXMnOiBJbW11dGFibGUuTWFwKCksXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG51bVF1ZXVlQ29uY3VycmVudCA9IDQ7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFB1YmxpYyBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExpYkd1aWxkcyB7XHJcblx0Y29uc3RydWN0b3IoY29tcG9uZW50KSB7XHJcblx0XHR0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuXHJcblx0XHR0aGlzLmFzeW5jR3VpbGRRdWV1ZSA9IGFzeW5jLnF1ZXVlKFxyXG5cdFx0XHR0aGlzLmdldEd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG5cdFx0XHRudW1RdWV1ZUNvbmN1cnJlbnRcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdG9uTWF0Y2hEYXRhKG1hdGNoRGV0YWlscykge1xyXG5cdFx0Ly8gbGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMaWJHdWlsZHM6Om9uTWF0Y2hEYXRhKCknKTtcclxuXHJcblx0XHRjb25zdCBvYmplY3RpdmVDbGFpbWVycyA9IG1hdGNoRGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnY2xhaW1lcnMnXSk7XHJcblx0XHRjb25zdCBjbGFpbUV2ZW50cyA9ICBnZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCAnY2xhaW0nKTtcclxuXHRcdGNvbnN0IGd1aWxkc1RvTG9va3VwID0gZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZS5ndWlsZHMsIG9iamVjdGl2ZUNsYWltZXJzLCBjbGFpbUV2ZW50cyk7XHJcblxyXG5cdFx0Ly8gc2VuZCBuZXcgZ3VpbGRzIHRvIGFzeW5jIHF1ZXVlIG1hbmFnZXIgZm9yIGRhdGEgcmV0cmlldmFsXHJcblx0XHRpZiAoIWd1aWxkc1RvTG9va3VwLmlzRW1wdHkoKSkge1xyXG5cdFx0XHR0aGlzLmFzeW5jR3VpbGRRdWV1ZS5wdXNoKGd1aWxkc1RvTG9va3VwLnRvQXJyYXkoKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBuZXdHdWlsZHMgPSBzdGF0ZS5ndWlsZHM7XHJcblx0XHRuZXdHdWlsZHMgPSBpbml0aWFsaXplR3VpbGRzKG5ld0d1aWxkcywgZ3VpbGRzVG9Mb29rdXApO1xyXG5cdFx0bmV3R3VpbGRzID0gZ3VpbGRzUHJvY2Vzc0NsYWltcyhuZXdHdWlsZHMsIGNsYWltRXZlbnRzKTtcclxuXHJcblx0XHQvLyB1cGRhdGUgc3RhdGUgaWYgbmVjZXNzYXJ5XHJcblx0XHRpZiAoIUltbXV0YWJsZS5pcyhzdGF0ZS5ndWlsZHMsIG5ld0d1aWxkcykpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2d1aWxkczo6b25NYXRjaERhdGEoKScsICdoYXMgdXBkYXRlJyk7XHJcblx0XHRcdHRoaXMuY29tcG9uZW50LnNldFN0YXRlKHtndWlsZHM6IG5ld0d1aWxkc30pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRnZXRHdWlsZERldGFpbHMoZ3VpbGRJZCwgb25Db21wbGV0ZSkge1xyXG5cdFx0bGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50O1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdFx0Y29uc3QgaGFzRGF0YSA9IHN0YXRlLmd1aWxkcy5nZXRJbihbZ3VpbGRJZCwgJ2xvYWRlZCddKTtcclxuXHJcblx0XHRpZiAoaGFzRGF0YSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Z2V0R3VpbGREZXRhaWxzKCknLCAnc2tpcCcsIGd1aWxkSWQpO1xyXG5cdFx0XHRvbkNvbXBsZXRlKG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpnZXRHdWlsZERldGFpbHMoKScsICdsb29rdXAnLCBndWlsZElkKTtcclxuXHRcdFx0YXBpLmdldEd1aWxkRGV0YWlscyhcclxuXHRcdFx0XHRndWlsZElkLFxyXG5cdFx0XHRcdG9uR3VpbGREYXRhLmJpbmQodGhpcywgb25Db21wbGV0ZSlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWJHdWlsZHM7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBvbkd1aWxkRGF0YShvbkNvbXBsZXRlLCBlcnIsIGRhdGEpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQ7XHJcblx0bGV0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRpZiAoY29tcG9uZW50Lm1vdW50ZWQpIHtcclxuXHRcdGlmICghZXJyICYmIGRhdGEpIHtcclxuXHRcdFx0ZGVsZXRlIGRhdGEuZW1ibGVtO1xyXG5cdFx0XHRkYXRhLmxvYWRlZCA9IHRydWU7XHJcblxyXG5cdFx0XHRjb25zdCBndWlsZElkID0gZGF0YS5ndWlsZF9pZDtcclxuXHRcdFx0Y29uc3QgZ3VpbGREYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhKTtcclxuXHJcblx0XHRcdGNvbXBvbmVudC5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG5cdFx0XHRcdGd1aWxkczogc3RhdGUuZ3VpbGRzLm1lcmdlSW4oW2d1aWxkSWRdLCBndWlsZERhdGEpXHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRvbkNvbXBsZXRlKG51bGwpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWxkc1Byb2Nlc3NDbGFpbXMoZ3VpbGRzLCBjbGFpbUV2ZW50cykge1xyXG5cdC8vIGNvbnNvbGUubG9nKCdndWlsZHNQcm9jZXNzQ2xhaW1zKCknLCBndWlsZHMuc2l6ZSk7XHJcblxyXG5cdHJldHVybiBndWlsZHMubWFwKFxyXG5cdFx0Z3VpbGRBdHRhY2hDbGFpbXMuYmluZChudWxsLCBjbGFpbUV2ZW50cylcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWxkQXR0YWNoQ2xhaW1zKGNsYWltRXZlbnRzLCBndWlsZCwgZ3VpbGRJZCkge1xyXG5cdGNvbnN0IGhhc0NsYWltcyA9ICFndWlsZC5nZXQoJ2NsYWltcycpLmlzRW1wdHkoKTtcclxuXHRjb25zdCBuZXdlc3RDbGFpbSA9IGhhc0NsYWltcyA/IGd1aWxkLmdldCgnY2xhaW1zJykuZmlyc3QoKSA6IG51bGw7XHJcblxyXG5cdGNvbnN0IGluY0NsYWltcyA9IGNsYWltRXZlbnRzXHJcblx0XHQuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSA9PT0gZ3VpbGRJZClcclxuXHRcdC50b01hcCgpO1xyXG5cclxuXHRjb25zdCBpbmNIYXNDbGFpbXMgPSAhaW5jQ2xhaW1zLmlzRW1wdHkoKTtcclxuXHRjb25zdCBpbmNOZXdlc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY0NsYWltcy5maXJzdCgpIDogbnVsbDtcclxuXHJcblxyXG5cdGNvbnN0IGhhc05ld0NsYWltcyA9ICghSW1tdXRhYmxlLmlzKG5ld2VzdENsYWltLCBpbmNOZXdlc3RDbGFpbSkpO1xyXG5cclxuXHJcblx0aWYgKGhhc05ld0NsYWltcykge1xyXG5cdFx0Y29uc3QgbGFzdENsYWltID0gaW5jSGFzQ2xhaW1zID8gaW5jTmV3ZXN0Q2xhaW0uZ2V0KCd0aW1lc3RhbXAnKSA6IDA7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnY2xhaW1zIGFsdGVyZWQnLCBndWlsZElkLCBoYXNOZXdDbGFpbXMsIGxhc3RDbGFpbSk7XHJcblx0XHRndWlsZCA9IGd1aWxkLnNldCgnY2xhaW1zJywgaW5jQ2xhaW1zKTtcclxuXHRcdGd1aWxkID0gZ3VpbGQuc2V0KCdsYXN0Q2xhaW0nLCBsYXN0Q2xhaW0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGd1aWxkO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVHdWlsZHMoZ3VpbGRzLCBuZXdHdWlsZHMpIHtcclxuXHQvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZUd1aWxkcygpJyk7XHJcblx0Ly8gY29uc29sZS5sb2coJ25ld0d1aWxkcycsIG5ld0d1aWxkcyk7XHJcblxyXG5cdG5ld0d1aWxkcy5mb3JFYWNoKGd1aWxkSWQgPT4ge1xyXG5cdFx0aWYgKCFndWlsZHMuaGFzKGd1aWxkSWQpKSB7XHJcblx0XHRcdGxldCBndWlsZCA9IGd1aWxkRGVmYXVsdC5zZXQoJ2d1aWxkX2lkJywgZ3VpbGRJZCk7XHJcblx0XHRcdGd1aWxkcyA9IGd1aWxkcy5zZXQoZ3VpbGRJZCwgZ3VpbGQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRyZXR1cm4gZ3VpbGRzO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEV2ZW50c0J5VHlwZShtYXRjaERldGFpbHMsIGV2ZW50VHlwZSkge1xyXG5cdHJldHVybiBtYXRjaERldGFpbHNcclxuXHRcdC5nZXQoJ2hpc3RvcnknKVxyXG5cdFx0LmZpbHRlcihlbnRyeSA9PiBlbnRyeS5nZXQoJ3R5cGUnKSA9PT0gZXZlbnRUeXBlKVxyXG5cdFx0LnNvcnRCeShlbnRyeSA9PiAtZW50cnkuZ2V0KCd0aW1lc3RhbXAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZUd1aWxkcywgb2JqZWN0aXZlQ2xhaW1lcnMsIGNsYWltRXZlbnRzKSB7XHJcblx0Y29uc3QgZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXMgPSBvYmplY3RpdmVDbGFpbWVyc1xyXG5cdFx0Lm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcblx0XHQudG9TZXQoKTtcclxuXHJcblx0Y29uc3QgZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuXHRcdC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpKVxyXG5cdFx0LnRvU2V0KCk7XHJcblxyXG5cdGNvbnN0IGd1aWxkQ2xhaW1zID0gZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXNcclxuXHRcdC51bmlvbihndWlsZHNXaXRoUHJldmlvdXNDbGFpbXMpO1xyXG5cclxuXHJcblx0Y29uc3Qga25vd25HdWlsZHMgPSBzdGF0ZUd1aWxkc1xyXG5cdFx0Lm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkX2lkJykpXHJcblx0XHQudG9TZXQoKTtcclxuXHJcblx0Y29uc3QgdW5rbm93bkd1aWxkcyA9IGd1aWxkQ2xhaW1zXHJcblx0XHQuc3VidHJhY3Qoa25vd25HdWlsZHMpO1xyXG5cclxuXHJcblx0Ly8gY29uc29sZS5sb2coJ2d1aWxkQ2xhaW1zJywgZ3VpbGRDbGFpbXMudG9BcnJheSgpKTtcclxuXHQvLyBjb25zb2xlLmxvZygna25vd25HdWlsZHMnLCBrbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd1bmtub3duR3VpbGRzJywgdW5rbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cclxuXHRyZXR1cm4gdW5rbm93bkd1aWxkcztcclxufSJdfQ==
