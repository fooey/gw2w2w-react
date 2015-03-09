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
					{ className: "matchContainer", key: props.match.get("id") },
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
				var props = this.props;

				var newRegion = !Immutable.is(props.region, nextProps.region);
				var newMatches = !Immutable.is(props.matches, nextProps.matches);
				var newWorlds = !Immutable.is(props.worlds, nextProps.worlds);
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
						" Matches"
					),
					props.matches.map(function (match, matchId) {
						return React.createElement(Match, {
							key: matchId,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJhcGkvbGliL2dldERhdGFCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9sYW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21ldGEuanMiLCJub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS93b3JsZF9uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvTWF0Y2hlcy9NYXRjaC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvTWF0Y2hXb3JsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL092ZXJ2aWV3L01hdGNoZXMvU2NvcmUuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9PdmVydmlldy9NYXRjaGVzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvV29ybGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvT3ZlcnZpZXcvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9DbGFpbXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0d1aWxkcy9HdWlsZC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvR3VpbGRzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvRW50cnkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9FdmVudEZpbHRlcnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL0xvZy9Mb2dFbnRyaWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9Mb2cvTWFwRmlsdGVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvTG9nL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcERldGFpbHMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvTWFwU2NvcmVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9NYXBzL01hcFNlY3Rpb24uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL01hcHMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvR3VpbGQuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvSWNvbnMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTGFiZWwuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9UcmFja2VyL09iamVjdGl2ZXMvTWFwTmFtZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lckNvdW50ZG93bi5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9UaW1lclJlbGF0aXZlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9PYmplY3RpdmVzL1RpbWVzdGFtcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvT2JqZWN0aXZlcy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL1RyYWNrZXIvU2NvcmVib2FyZC9Ib2xkaW5ncy9JdGVtLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL0hvbGRpbmdzL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL1dvcmxkLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9TY29yZWJvYXJkL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvVHJhY2tlci9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9BcnJvdy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9JY29ucy9FbWJsZW0uanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9jb21tb24vSWNvbnMvUGllLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvY29tbW9uL0ljb25zL1Nwcml0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9MYW5nTGluay5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2NvbW1vbi9MYW5ncy9pbmRleC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9zdGF0aWMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvdHJhY2tlclRpbWVycy5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi90cmFja2VyL2d1aWxkcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQ1FBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7OztBQVFyQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7Ozs7QUFZbkMsQ0FBQyxDQUFDLFlBQVc7QUFDWixhQUFZLEVBQUUsQ0FBQztBQUNmLGFBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNsQixDQUFDLENBQUM7Ozs7Ozs7O0FBWUgsU0FBUyxZQUFZLEdBQUc7QUFDdkIsS0FBTSxTQUFTLEdBQUc7QUFDakIsVUFBUSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQzlDLFNBQU8sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUMzQyxDQUFDOztBQUdGLEtBQUksQ0FBQyw4Q0FBOEMsRUFBRSxVQUFTLEdBQUcsRUFBRTtBQUNsRSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxN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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDallBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5L0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxP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LENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUQsUUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsUUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUMsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsRCxXQUFPOztPQUFJLFNBQVMsRUFBRSxRQUFRLEdBQUcsUUFBUSxHQUFHLEVBQUUsQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEFBQUM7S0FDNUQ7O1FBQUcsSUFBSSxFQUFFLElBQUksQUFBQztNQUFFLEtBQUs7TUFBSztLQUN0QixDQUFDO0lBQ047Ozs7OztRQVpJLFFBQVE7R0FBUyxLQUFLLENBQUMsU0FBUzs7Ozs7O0FBcUJ0QyxRQUFRLENBQUMsU0FBUyxHQUFHO0FBQ3BCLEtBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVTtBQUMxRCxNQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQUNoRCxTQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFDOUQsQ0FBQzs7Ozs7Ozs7QUFXRixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFXMUIsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM3QixLQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxLQUFJLElBQUksU0FBTyxRQUFRLEFBQUUsQ0FBQzs7QUFFMUIsS0FBSSxLQUFLLEVBQUU7QUFDVixNQUFJLFNBQVMsR0FBRyxLQUFL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QUNoRCxNQUFNLENBQUMsVUFBQSxLQUFLO1NBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztFQUFBLENBQUMsQ0FBQztDQUMzQzs7QUFJRCxTQUFTLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUU7QUFDdEUsS0FBTSx1QkFBdUIsR0FBRyxpQkFBaUIsQ0FDL0MsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0VBQUEsQ0FBQyxDQUNoQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLHdCQUF3QixHQUFHLFdBQVcsQ0FDMUMsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0VBQUEsQ0FBQyxDQUNoQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FDekMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBR2xDLEtBQU0sV0FBVyxHQUFHLFdBQVcsQ0FDN0IsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0VBQUEsQ0FBQyxDQUNuQyxLQUFLLEVBQUUsQ0FBQzs7QUFFVixLQUFNLGFBQWEsR0FBRyxXQUFXLENBQy9CLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7O0FBT3hCLFFBQU8sYUFBYSxDQUFDO0NBQ3JCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IHBhZ2UgPSByZXF1aXJlKCdwYWdlJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IExhbmdzID0gcmVxdWlyZSgnY29tbW9uL0xhbmdzJyk7XHJcbmNvbnN0IE92ZXJ2aWV3ID0gcmVxdWlyZSgnT3ZlcnZpZXcnKTtcclxuY29uc3QgVHJhY2tlciA9IHJlcXVpcmUoJ1RyYWNrZXInKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERPTSBSZWFkeVxyXG4qXHJcbiovXHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdGF0dGFjaFJvdXRlcygpO1xyXG5cdHNldEltbWVkaWF0ZShlbWwpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFJvdXRlc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhdHRhY2hSb3V0ZXMoKSB7XHJcblx0Y29uc3QgZG9tTW91bnRzID0ge1xyXG5cdFx0bmF2TGFuZ3M6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSxcclxuXHRcdGNvbnRlbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JyksXHJcblx0fTtcclxuXHJcblxyXG5cdHBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyk/JywgZnVuY3Rpb24oY3R4KSB7XHJcblx0XHRjb25zdCBsYW5nU2x1ZyA9IGN0eC5wYXJhbXMubGFuZ1NsdWc7XHJcblx0XHRjb25zdCBsYW5nID0gU1RBVElDLmxhbmdzLmdldChsYW5nU2x1Zyk7XHJcblxyXG5cclxuXHRcdGNvbnN0IHdvcmxkU2x1ZyA9IGN0eC5wYXJhbXMud29ybGRTbHVnO1xyXG5cdFx0Y29uc3Qgd29ybGQgPSBnZXRXb3JsZEZyb21TbHVnKGxhbmdTbHVnLCB3b3JsZFNsdWcpO1xyXG5cclxuXHJcblx0XHRsZXQgQXBwID0gT3ZlcnZpZXc7XHJcblx0XHRsZXQgcHJvcHMgPSB7bGFuZ307XHJcblxyXG5cdFx0aWYgKHdvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAod29ybGQpICYmICF3b3JsZC5pc0VtcHR5KCkpIHtcclxuXHRcdFx0QXBwID0gVHJhY2tlcjtcclxuXHRcdFx0cHJvcHMud29ybGQgPSB3b3JsZDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0UmVhY3QucmVuZGVyKDxMYW5ncyB7Li4ucHJvcHN9IC8+LCBkb21Nb3VudHMubmF2TGFuZ3MpO1xyXG5cdFx0UmVhY3QucmVuZGVyKDxBcHAgey4uLnByb3BzfSAvPiwgZG9tTW91bnRzLmNvbnRlbnQpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vIHJlZGlyZWN0ICcvJyB0byAnL2VuJ1xyXG5cdHBhZ2UoJy8nLCByZWRpcmVjdFBhZ2UuYmluZChudWxsLCAnL2VuJykpO1xyXG5cclxuXHJcblxyXG5cclxuXHRwYWdlLnN0YXJ0KHtcclxuXHRcdGNsaWNrOiB0cnVlLFxyXG5cdFx0cG9wc3RhdGU6IHRydWUsXHJcblx0XHRkaXNwYXRjaDogdHJ1ZSxcclxuXHRcdGhhc2hiYW5nOiBmYWxzZSxcclxuXHRcdGRlY29kZVVSTENvbXBvbmVudHMgOiB0cnVlLFxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRVdGlsXHJcbipcclxuKi9cclxuZnVuY3Rpb24gcmVkaXJlY3RQYWdlKGRlc3RpbmF0aW9uKSB7XHJcblx0cGFnZS5yZWRpcmVjdChkZXN0aW5hdGlvbik7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0V29ybGRGcm9tU2x1ZyhsYW5nU2x1Zywgd29ybGRTbHVnKSB7XHJcblx0cmV0dXJuIFNUQVRJQy53b3JsZHNcclxuXHRcdC5maW5kKHdvcmxkID0+IHdvcmxkLmdldEluKFtsYW5nU2x1ZywgJ3NsdWcnXSkgPT09IHdvcmxkU2x1Zyk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZW1sKCkge1xyXG5cdGNvbnN0IGNodW5rcyA9IFsnZ3cydzJ3JywgJ3NjaHR1cGgnLCAnY29tJywgJ0AnLCAnLiddO1xyXG5cdGNvbnN0IGFkZHIgPSBbY2h1bmtzWzBdLCBjaHVua3NbM10sIGNodW5rc1sxXSwgY2h1bmtzWzRdLCBjaHVua3NbMl1dLmpvaW4oJycpO1xyXG5cclxuXHQkKCcubm9zcGFtLXByeicpLmVhY2goKGksIGVsKSA9PiB7XHJcblx0XHQkKGVsKS5yZXBsYWNlV2l0aChcclxuXHRcdFx0JCgnPGE+Jywge2hyZWY6IGBtYWlsdG86JHthZGRyfWAsIHRleHQ6IGFkZHJ9KVxyXG5cdFx0KTtcclxuXHR9KTtcclxufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiLypcclxuKlx0cGFja2FnZS5qc29uIHJlcXdyaXRlcyB0byB0aGlzIGZyb20gZ2V0RGF0YS5qcyBmb3IgQnJvd3NlcmlmeVxyXG4qL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1ZXN0SnNvbihyZXF1ZXN0VXJsLCBmbkNhbGxiYWNrKSB7XHJcblx0cmVxdWVzdENsaWVudChyZXF1ZXN0VXJsLCBmbkNhbGxiYWNrKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiByZXF1ZXN0Q2xpZW50KHJlcXVlc3RVcmwsIGZuQ2FsbGJhY2spIHtcclxuXHRpZiAoIXdpbmRvdyB8fCAhd2luZG93LmpRdWVyeSkge1xyXG5cdFx0dGhyb3cgKCdndzJhcGkgcmVxdWlyZXMgalF1ZXJ5IHdoZW4gdXNlZCBpbiB0aGUgYnJvd3NlcicpO1xyXG5cdH1cclxuXHR3aW5kb3cualF1ZXJ5LmdldEpTT04ocmVxdWVzdFVybClcclxuXHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XHJcblx0XHRcdGZuQ2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcblx0XHR9KVxyXG5cdFx0LmZhaWwoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcblx0XHRcdGZuQ2FsbGJhY2soe1xyXG5cdFx0XHRcdGpxWEhSOiBqcVhIUixcclxuXHRcdFx0XHR0ZXh0U3RhdHVzOiB0ZXh0U3RhdHVzLFxyXG5cdFx0XHRcdGVycm9yVGhyb3duOiBlcnJvclRocm93blxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L25vZGUtZ3cyXHJcbiogICBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSTpNYWluXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cclxuXHRndWlsZERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvZ3VpbGRfZGV0YWlsc1xyXG5cclxuXHRpdGVtczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2l0ZW1zLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtc1xyXG5cdGl0ZW1EZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb212MS9pdGVtX2RldGFpbHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1fZGV0YWlsc1xyXG5cdHJlY2lwZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVzLmpzb24nLFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlc1xyXG5cdHJlY2lwZURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZV9kZXRhaWxzXHJcblxyXG5cdG1hcE5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX25hbWVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9uYW1lc1xyXG5cdGNvbnRpbmVudHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9jb250aW5lbnRzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9jb250aW5lbnRzXHJcblx0bWFwczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcHMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcHNcclxuXHRtYXBGbG9vcjogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9mbG9vci5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfZmxvb3JcclxuXHJcblx0b2JqZWN0aXZlTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvb2JqZWN0aXZlX25hbWVzLmpzb24nLFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hlc1xyXG5cdG1hdGNoZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hlcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hfZGV0YWlsc1xyXG5cdG1hdGNoRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaF9kZXRhaWxzLmpzb24nLFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9vYmplY3RpdmVfbmFtZXNcclxuXHJcblx0bWF0Y2hlc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlcycsXHJcblx0bWF0Y2hEZXRhaWxzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS8nLFxyXG59O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQVUJMSUMgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFdPUkxEIHZzIFdPUkxEXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnb2JqZWN0aXZlTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnbWF0Y2hlcycsIHt9LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdHZhciB3dndfbWF0Y2hlcyA9IChkYXRhICYmIGRhdGEud3Z3X21hdGNoZXMpID8gZGF0YS53dndfbWF0Y2hlcyA6IFtdO1xyXG5cdFx0Y2FsbGJhY2soZXJyLCB3dndfbWF0Y2hlcyk7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHRocm93ICgnbWF0Y2hfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXRjaERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHNbJ21hdGNoZXNTdGF0ZSddO1xyXG5cclxuXHRpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICcnICsgbWF0Y2hfaWQ7XHJcblx0fVxyXG5cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZCB8fCB3b3JsZF9zbHVnXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50c1snbWF0Y2hEZXRhaWxzU3RhdGUnXTtcclxuXHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQgJiYgIXBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBtYXRjaF9pZCBvciB3b3JsZF9zbHVnIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSBwYXJhbXMubWF0Y2hfaWQ7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICd3b3JsZC8nICsgcGFyYW1zLndvcmxkX3NsdWc7XHJcblx0fVxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdEdFTkVSQUxcclxuKi9cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZywgaWRzXHJcbmZ1bmN0aW9uIGdldFdvcmxkTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0aWYgKCFwYXJhbXMuaWRzKSB7XHJcblx0XHRwYXJhbXMucGFnZSA9IDA7XHJcblx0fVxyXG5cdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmlkcykpIHtcclxuXHRcdHBhcmFtcy5pZHMgPSBwYXJhbXMuaWRzLmpvaW4oJywnKTtcclxuXHR9XHJcblx0Z2V0KCd3b3JsZE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGd1aWxkX2lkIHx8IGd1aWxkX25hbWUgKGlkIHRha2VzIHByaW9yaXR5KVxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmd1aWxkX2lkICYmICFwYXJhbXMuZ3VpbGRfbmFtZSkge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgZ3VpbGRfaWQgb3IgZ3VpbGRfbmFtZSBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHJcblx0Z2V0KCdndWlsZERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRJVEVNU1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEl0ZW1zKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdpdGVtcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogaXRlbV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRJdGVtRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuaXRlbV9pZCkge1xyXG5cdFx0dGhyb3cgKCdpdGVtX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnaXRlbURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdyZWNpcGVzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gUkVRVUlSRUQ6IHJlY2lwZV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5yZWNpcGVfaWQpIHtcclxuXHRcdHRocm93ICgncmVjaXBlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgncmVjaXBlRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1BUCBJTkZPUk1BVElPTlxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRDb250aW5lbnRzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdjb250aW5lbnRzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXBfaWQsIGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGNvbnRpbmVudF9pZCwgZmxvb3JcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwRmxvb3IocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmNvbnRpbmVudF9pZCkge1xyXG5cdFx0dGhyb3cgKCdjb250aW5lbnRfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mbG9vcikge1xyXG5cdFx0dGhyb3cgKCdmbG9vciBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hcEZsb29yJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNaXNjZWxsYW5lb3VzXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0QnVpbGQoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2J1aWxkJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldENvbG9ycyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnY29sb3JzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuLy8gdG8gZ2V0IGZpbGVzOiBodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL3tzaWduYXR1cmV9L3tmaWxlX2lkfS57Zm9ybWF0fVxyXG5mdW5jdGlvbiBnZXRGaWxlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnZmlsZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFVUSUxJVFkgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuLy8gU1BFQ0lBTCBDQVNFXHJcbi8vIFJFUVVJUkVEOiBzaWduYXR1cmUsIGZpbGVfaWQsIGZvcm1hdFxyXG5mdW5jdGlvbiBnZXRGaWxlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5zaWduYXR1cmUpIHtcclxuXHRcdHRocm93ICgnc2lnbmF0dXJlIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmlsZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdmaWxlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZm9ybWF0KSB7XHJcblx0XHR0aHJvdyAoJ2Zvcm1hdCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdEpzb24oZ2V0RmlsZVJlbmRlclVybChwYXJhbXMpLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogc2lnbmF0dXJlLCBmaWxlX2lkLCBmb3JtYXRcclxuZnVuY3Rpb24gZ2V0RmlsZVJlbmRlclVybChwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuc2lnbmF0dXJlKSB7XHJcblx0XHR0aHJvdyAoJ3NpZ25hdHVyZSBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZpbGVfaWQpIHtcclxuXHRcdHRocm93ICgnZmlsZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZvcm1hdCkge1xyXG5cdFx0dGhyb3cgKCdmb3JtYXQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblxyXG5cdHZhciByZW5kZXJVcmwgPSAoXHJcblx0XHQnaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8nXHJcblx0XHQrIHBhcmFtcy5zaWduYXR1cmVcclxuXHRcdCsgJy8nXHJcblx0XHQrIHBhcmFtcy5maWxlX2lkXHJcblx0XHQrICcuJ1xyXG5cdFx0KyBwYXJhbXMuZm9ybWF0XHJcblx0KTtcclxuXHRyZXR1cm4gcmVuZGVyVXJsO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFJJVkFURSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldChrZXksIHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcblxyXG5cdHZhciBhcGlVcmwgPSBnZXRBcGlVcmwoa2V5LCBwYXJhbXMpO1xyXG5cdHZhciBnZXREYXRhID0gcmVxdWlyZSgnLi9saWIvZ2V0RGF0YS5qcycpO1xyXG5cclxuXHRnZXREYXRhKGFwaVVybCwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHR2YXIgcmVxdWVzdFVybCA9IChlbmRQb2ludHNbcmVxdWVzdFVybF0pXHJcblx0XHQ/IGVuZFBvaW50c1tyZXF1ZXN0VXJsXVxyXG5cdFx0OiByZXF1ZXN0VXJsO1xyXG5cclxuXHR2YXIgcXVlcnkgPSBxcy5zdHJpbmdpZnkocGFyYW1zKTtcclxuXHJcblx0aWYgKHF1ZXJ5Lmxlbmd0aCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnPycgKyBxdWVyeTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXF1ZXN0VXJsO1xyXG59XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImVuXCI6IHtcclxuXHRcdFwic29ydFwiOiAxLFxyXG5cdFx0XCJzbHVnXCI6IFwiZW5cIixcclxuXHRcdFwibGFiZWxcIjogXCJFTlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VuXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFbmdsaXNoXCJcclxuXHR9LFxyXG5cdFwiZGVcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDIsXHJcblx0XHRcInNsdWdcIjogXCJkZVwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkRFXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZGVcIixcclxuXHRcdFwibmFtZVwiOiBcIkRldXRzY2hcIlxyXG5cdH0sXHJcblx0XCJlc1wiOiB7XHJcblx0XHRcInNvcnRcIjogMyxcclxuXHRcdFwic2x1Z1wiOiBcImVzXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRVNcIixcclxuXHRcdFwibGlua1wiOiBcIi9lc1wiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXNwYcOxb2xcIlxyXG5cdH0sXHJcblx0XCJmclwiOiB7XHJcblx0XHRcInNvcnRcIjogNCxcclxuXHRcdFwic2x1Z1wiOiBcImZyXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRlJcIixcclxuXHRcdFwibGlua1wiOiBcIi9mclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRnJhbsOnYWlzXCJcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiBcIjFcIiwgXCJlblwiOiBcIk92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZVwiLCBcImVzXCI6IFwiTWlyYWRvclwiLCBcImRlXCI6IFwiQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IFwiMlwiLCBcImVuXCI6IFwiVmFsbGV5XCIsIFwiZnJcIjogXCJWYWxsw6llXCIsIFwiZXNcIjogXCJWYWxsZVwiLCBcImRlXCI6IFwiVGFsXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiBcIjNcIiwgXCJlblwiOiBcIkxvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzXCIsIFwiZXNcIjogXCJWZWdhXCIsIFwiZGVcIjogXCJUaWVmbGFuZFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogXCI0XCIsIFwiZW5cIjogXCJHb2xhbnRhIENsZWFyaW5nXCIsIFwiZnJcIjogXCJDbGFpcmnDqHJlIGRlIEdvbGFudGFcIiwgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIiwgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IFwiNVwiLCBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLCBcImZyXCI6IFwiTW9udMOpZSBkZSBQYW5nbG9zc1wiLCBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiBcIjZcIiwgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIiwgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiLCBcImVzXCI6IFwiQ2xhcm8gRXNwZWxkaWFcIiwgXCJkZVwiOiBcIlNwZWxkYW4gS2FobHNjaGxhZ1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogXCI3XCIsIFwiZW5cIjogXCJEYW5lbG9uIFBhc3NhZ2VcIiwgXCJmclwiOiBcIlBhc3NhZ2UgRGFuZWxvblwiLCBcImVzXCI6IFwiUGFzYWplIERhbmVsb25cIiwgXCJkZVwiOiBcIkRhbmVsb24tUGFzc2FnZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogXCI4XCIsIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiLCBcImVzXCI6IFwiQm9zcXVlcyBDbGFyb3NvbWJyYVwiLCBcImRlXCI6IFwiVW1iZXJsaWNodHVuZy1Gb3JzdFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogXCI5XCIsIFwiZW5cIjogXCJTdG9uZW1pc3QgQ2FzdGxlXCIsIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiLCBcImVzXCI6IFwiQ2FzdGlsbG8gUGllZHJhbmllYmxhXCIsIFwiZGVcIjogXCJTY2hsb3NzIFN0ZWlubmViZWxcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiBcIjEwXCIsIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLCBcImZyXCI6IFwiQ2FycmnDqHJlIGRlcyB2b2xldXJzXCIsIFwiZXNcIjogXCJDYW50ZXJhIGRlbCBQw61jYXJvXCIsIFwiZGVcIjogXCJTY2h1cmtlbmJydWNoXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogXCIxMVwiLCBcImVuXCI6IFwiQWxkb24ncyBMZWRnZVwiLCBcImZyXCI6IFwiQ29ybmljaGUgZCdBbGRvblwiLCBcImVzXCI6IFwiQ29ybmlzYSBkZSBBbGRvblwiLCBcImRlXCI6IFwiQWxkb25zIFZvcnNwcnVuZ1wifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IFwiMTJcIiwgXCJlblwiOiBcIldpbGRjcmVlayBSdW5cIiwgXCJmclwiOiBcIlBpc3RlIGR1IFJ1aXNzZWF1IHNhdXZhZ2VcIiwgXCJlc1wiOiBcIlBpc3RhIEFycm95b3NhbHZhamVcIiwgXCJkZVwiOiBcIldpbGRiYWNoc3RyZWNrZVwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IFwiMTNcIiwgXCJlblwiOiBcIkplcnJpZmVyJ3MgU2xvdWdoXCIsIFwiZnJcIjogXCJCb3VyYmllciBkZSBKZXJyaWZlclwiLCBcImVzXCI6IFwiQ2VuYWdhbCBkZSBKZXJyaWZlclwiLCBcImRlXCI6IFwiSmVycmlmZXJzIFN1bXBmbG9jaFwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IFwiMTRcIiwgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLCBcImZyXCI6IFwiUGV0aXQgcmF2aW4gZGUgS2xvdmFuXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBLbG92YW5cIiwgXCJkZVwiOiBcIktsb3Zhbi1TZW5rZVwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IFwiMTVcIiwgXCJlblwiOiBcIkxhbmdvciBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIiwgXCJkZVwiOiBcIkxhbmdvciAtIFNjaGx1Y2h0XCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogXCIxNlwiLCBcImVuXCI6IFwiUXVlbnRpbiBMYWtlXCIsIFwiZnJcIjogXCJMYWMgUXVlbnRpblwiLCBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsIFwiZGVcIjogXCJRdWVudGluc2VlXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogXCIxN1wiLCBcImVuXCI6IFwiTWVuZG9uJ3MgR2FwXCIsIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCIsIFwiZXNcIjogXCJaYW5qYSBkZSBNZW5kb25cIiwgXCJkZVwiOiBcIk1lbmRvbnMgU3BhbHRcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiBcIjE4XCIsIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiLCBcImVzXCI6IFwiUGFzbyBBbnphbGlhc1wiLCBcImRlXCI6IFwiQW56YWxpYXMtUGFzc1wifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IFwiMTlcIiwgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIiwgXCJmclwiOiBcIlBlcmPDqWUgZGUgR2FyZG9ncmVcIiwgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLCBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogXCIyMFwiLCBcImVuXCI6IFwiVmVsb2thIFNsb3BlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBWZWxva2FcIiwgXCJlc1wiOiBcIlBlbmRpZW50ZSBWZWxva2FcIiwgXCJkZVwiOiBcIlZlbG9rYS1IYW5nXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogXCIyMVwiLCBcImVuXCI6IFwiRHVyaW9zIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLCBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogXCIyMlwiLCBcImVuXCI6IFwiQnJhdm9zdCBFc2NhcnBtZW50XCIsIFwiZnJcIjogXCJGYWxhaXNlIGRlIEJyYXZvc3RcIiwgXCJlc1wiOiBcIkVzY2FycGFkdXJhIEJyYXZvc3RcIiwgXCJkZVwiOiBcIkJyYXZvc3QtQWJoYW5nXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogXCIyM1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiBcIjI0XCIsIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVuc2VcIiwgXCJmclwiOiBcIkZpZWYgZHUgY2hhbXBpb25cIiwgXCJlc1wiOiBcIkRvbWluaW8gZGVsIENhbXBlw7NuXCIsIFwiZGVcIjogXCJMYW5kZ3V0IGRlcyBDaGFtcGlvbnNcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiBcIjI1XCIsIFwiZW5cIjogXCJSZWRicmlhclwiLCBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiLCBcImVzXCI6IFwiWmFyemFycm9qYVwiLCBcImRlXCI6IFwiUm90ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiBcIjI2XCIsIFwiZW5cIjogXCJHcmVlbmxha2VcIiwgXCJmclwiOiBcIkxhYyBWZXJ0XCIsIFwiZXNcIjogXCJMYWdvdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc2VlXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogXCIyN1wiLCBcImVuXCI6IFwiQXNjZW5zaW9uIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiLCBcImVzXCI6IFwiQmFow61hIGRlIGxhIEFzY2Vuc2nDs25cIiwgXCJkZVwiOiBcIkJ1Y2h0IGRlcyBBdWZzdGllZ3NcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiBcIjI4XCIsIFwiZW5cIjogXCJEYXduJ3MgRXlyaWVcIiwgXCJmclwiOiBcIlByb21vbnRvaXJlIGRlIGwnYXViZVwiLCBcImVzXCI6IFwiQWd1aWxlcmEgZGVsIEFsYmFcIiwgXCJkZVwiOiBcIkhvcnN0IGRlciBNb3JnZW5kYW1tZXJ1bmdcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiBcIjI5XCIsIFwiZW5cIjogXCJUaGUgU3Bpcml0aG9sbWVcIiwgXCJmclwiOiBcIkwnYW50cmUgZGVzIGVzcHJpdHNcIiwgXCJlc1wiOiBcIkxhIElzbGV0YSBFc3Bpcml0dWFsXCIsIFwiZGVcIjogXCJEZXIgR2Vpc3RlcmhvbG1cIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiBcIjMwXCIsIFwiZW5cIjogXCJXb29kaGF2ZW5cIiwgXCJmclwiOiBcIkdlbnRlc3lsdmVcIiwgXCJlc1wiOiBcIlJlZnVnaW8gRm9yZXN0YWxcIiwgXCJkZVwiOiBcIldhbGQgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiBcIjMxXCIsIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdBc2thbGlvblwiLCBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLCBcImRlXCI6IFwiQXNrYWxpb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiBcIjMyXCIsIFwiZW5cIjogXCJFdGhlcm9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0V0aGVyb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgRXRoZXJvblwiLCBcImRlXCI6IFwiRXRoZXJvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IFwiMzNcIiwgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZXMgcsOqdmVzXCIsIFwiZXNcIjogXCJCYWjDrWEgT27DrXJpY2FcIiwgXCJkZVwiOiBcIlRyYXVtYnVjaHRcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiBcIjM0XCIsIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgdmFpbnF1ZXVyXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgVmVuY2Vkb3JcIiwgXCJkZVwiOiBcIlNpZWdlciAtIEjDvHR0ZVwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IFwiMzVcIiwgXCJlblwiOiBcIkdyZWVuYnJpYXJcIiwgXCJmclwiOiBcIlZlcnRlYnJhbmNoZVwiLCBcImVzXCI6IFwiWmFyemF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zdHJhdWNoXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogXCIzNlwiLCBcImVuXCI6IFwiQmx1ZWxha2VcIiwgXCJmclwiOiBcIkxhYyBibGV1XCIsIFwiZXNcIjogXCJMYWdvYXp1bFwiLCBcImRlXCI6IFwiQmxhdXNlZVwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IFwiMzdcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogXCIzOFwiLCBcImVuXCI6IFwiTG9uZ3ZpZXdcIiwgXCJmclwiOiBcIkxvbmd1ZXZ1ZVwiLCBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIiwgXCJkZVwiOiBcIldlaXRzaWNodFwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IFwiMzlcIiwgXCJlblwiOiBcIlRoZSBHb2Rzd29yZFwiLCBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIiwgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsIFwiZGVcIjogXCJEYXMgR290dHNjaHdlcnRcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiBcIjQwXCIsIFwiZW5cIjogXCJDbGlmZnNpZGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIGZhbGFpc2VcIiwgXCJlc1wiOiBcIkRlc3Blw7FhZGVyb1wiLCBcImRlXCI6IFwiRmVsc3dhbmRcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiBcIjQxXCIsIFwiZW5cIjogXCJTaGFkYXJhbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZGUgU2hhZGFyYW5cIiwgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIiwgXCJkZVwiOiBcIlNoYWRhcmFuIEjDvGdlbFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IFwiNDJcIiwgXCJlblwiOiBcIlJlZGxha2VcIiwgXCJmclwiOiBcIlJvdWdlbGFjXCIsIFwiZXNcIjogXCJMYWdvcnJvam9cIiwgXCJkZVwiOiBcIlJvdHNlZVwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IFwiNDNcIiwgXCJlblwiOiBcIkhlcm8ncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgSMOpcm9zXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgSMOpcm9lXCIsIFwiZGVcIjogXCJIw7x0dGUgZGVzIEhlbGRlblwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IFwiNDRcIiwgXCJlblwiOiBcIkRyZWFkZmFsbCBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCIsIFwiZXNcIjogXCJCYWjDrWEgU2FsdG8gQWNpYWdvXCIsIFwiZGVcIjogXCJTY2hyZWNrZW5zZmFsbCAtIEJ1Y2h0XCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogXCI0NVwiLCBcImVuXCI6IFwiQmx1ZWJyaWFyXCIsIFwiZnJcIjogXCJCcnV5YXp1clwiLCBcImVzXCI6IFwiWmFyemF6dWxcIiwgXCJkZVwiOiBcIkJsYXVkb3Juc3RyYXVjaFwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IFwiNDZcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogXCI0N1wiLCBcImVuXCI6IFwiU3VubnloaWxsXCIsIFwiZnJcIjogXCJDb2xsaW5lIGVuc29sZWlsbMOpZVwiLCBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIiwgXCJkZVwiOiBcIlNvbm5lbmxpY2h0aMO8Z2VsXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogXCI0OFwiLCBcImVuXCI6IFwiRmFpdGhsZWFwXCIsIFwiZnJcIjogXCJGZXJ2ZXVyXCIsIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLCBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiBcIjQ5XCIsIFwiZW5cIjogXCJCbHVldmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBibGV1dmFsXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLCBcImRlXCI6IFwiQmxhdXRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogXCI1MFwiLCBcImVuXCI6IFwiQmx1ZXdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXp1bFwiLCBcImRlXCI6IFwiQmxhdXdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogXCI1MVwiLCBcImVuXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJmclwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZXNcIjogXCJJc2xldGEgQXN0cmFsXCIsIFwiZGVcIjogXCJBc3RyYWxob2xtXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogXCI1MlwiLCBcImVuXCI6IFwiQXJhaCdzIEhvcGVcIiwgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIiwgXCJlc1wiOiBcIkVzcGVyYW56YSBkZSBBcmFoXCIsIFwiZGVcIjogXCJBcmFocyBIb2ZmbnVuZ1wifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IFwiNTNcIiwgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCIsIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIFZhbGxldmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xudGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiBcIjU0XCIsIFwiZW5cIjogXCJGb2doYXZlblwiLCBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiLCBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIiwgXCJkZVwiOiBcIk5lYmVsIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogXCI1NVwiLCBcImVuXCI6IFwiUmVkd2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZGUgUnViaWNvblwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIiwgXCJkZVwiOiBcIlJvdHdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogXCI1NlwiLCBcImVuXCI6IFwiVGhlIFRpdGFucGF3XCIsIFwiZnJcIjogXCJCcmFzIGR1IHRpdGFuXCIsIFwiZXNcIjogXCJMYSBHYXJyYSBkZWwgVGl0w6FuXCIsIFwiZGVcIjogXCJEaWUgVGl0YW5lbnByYW5rZVwifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IFwiNTdcIiwgXCJlblwiOiBcIkNyYWd0b3BcIiwgXCJmclwiOiBcIlNvbW1ldCBkZSBsJ2VzY2FycGVtZW50XCIsIFwiZXNcIjogXCJDdW1icmVwZcOxYXNjb1wiLCBcImRlXCI6IFwiRmVsc2Vuc3BpdHplXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogXCI1OFwiLCBcImVuXCI6IFwiR29kc2xvcmVcIiwgXCJmclwiOiBcIkRpdmluYXRpb25cIiwgXCJlc1wiOiBcIlNhYmlkdXLDrWEgZGUgbG9zIERpb3Nlc1wiLCBcImRlXCI6IFwiR8O2dHRlcmt1bmRlXCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogXCI1OVwiLCBcImVuXCI6IFwiUmVkdmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWxyb3VnZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXJvam9cIiwgXCJkZVwiOiBcIlJvdHRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogXCI2MFwiLCBcImVuXCI6IFwiU3Rhcmdyb3ZlXCIsIFwiZnJcIjogXCJCb3NxdWV0IHN0ZWxsYWlyZVwiLCBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLCBcImRlXCI6IFwiU3Rlcm5lbmhhaW5cIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiBcIjYxXCIsIFwiZW5cIjogXCJHcmVlbndhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bndhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogXCI2MlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IFwiNjNcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiBcIjY0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogXCI2NVwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiBcIjY2XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogXCI2N1wiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IFwiNjhcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogXCI2OVwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IFwiNzBcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiBcIjcxXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogXCI3MlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IFwiNzNcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogXCI3NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IFwiNzVcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiBcIjc2XCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHR7XHJcblx0XHRcImtleVwiOiBcIkNlbnRlclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXRlcm5hbCBCYXR0bGVncm91bmRzXCIsXHJcblx0XHRcImFiYnJcIjogXCJFQkdcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMyxcclxuXHRcdFwiY29sb3JcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkNhc3RsZVwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbOV0sIFx0XHRcdFx0XHRcdFx0XHQvLyBzbVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlJlZCBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMSwgMTcsIDIwLCAxOCwgMTksIDYsIDVdLFx0XHQvLyBvdmVybG9vaywgbWVuZG9ucywgdmVsb2thLCBhbnosIG9ncmUsIHNwZWxkYW4sIHBhbmdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJCbHVlIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMiwgMTUsIDIyLCAxNiwgMjEsIDcsIDhdXHRcdFx0Ly8gdmFsbGV5LCBsYW5nb3IsIGJyYXZvc3QsIHF1ZW50aW4sIGR1cmlvcywgZGFuZSwgdW1iZXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJHcmVlbiBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszLCAxMSwgMTMsIDEyLCAxNCwgMTAsIDRdIFx0XHQvLyBsb3dsYW5kcywgYWxkb25zLCBqZXJyaWZlciwgd2lsZGNyZWVrLCBrbG92YW4sIHJvZ3VlcywgZ29sYW50YVxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcIm5hbWVcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJSZWRcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMCxcclxuXHRcdFwiY29sb3JcIjogXCJyZWRcIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzcsIDMzLCAzMl0gXHRcdFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszOCwgNDAsIDM5LCA1MiwgNTFdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzUsIDM2LCAzNCwgNTMsIDUwXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzYyLCA2MywgNjQsIDY1LCA2Nl0gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcImFiYnJcIjogXCJCbHVcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMixcclxuXHRcdFwiY29sb3JcIjogXCJibHVlXCIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyMywgMjcsIDMxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzAsIDI4LCAyOSwgNTgsIDYwXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyNSwgMjYsIDI0LCA1OSwgNjFdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGNoYW1wLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzEsIDcwLCA2OSwgNjgsIDY3XSBcdFx0XHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwibmFtZVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJhYmJyXCI6IFwiR3JuXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDEsXHJcblx0XHRcImNvbG9yXCI6IFwiZ3JlZW5cIixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NiwgNDQsIDQxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ3LCA1NywgNTYsIDQ4LCA1NF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDUsIDQyLCA0MywgNDksIDU1XSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzc2ICwgNzUgLCA3NCAsIDczICwgNzIgXSBcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXVxyXG5cdH0sXHJcbl07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdC8vXHRFQkdcclxuXHRcIjlcIjpcdHtcInR5cGVcIjogMSwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMCwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU3RvbmVtaXN0IENhc3RsZVxyXG5cclxuXHQvL1x0UmVkIENvcm5lclxyXG5cdFwiMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBSZWQgS2VlcCAtIE92ZXJsb29rXHJcblx0XCIxN1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBNZW5kb24ncyBHYXBcclxuXHRcIjIwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIFZlbG9rYSBTbG9wZVxyXG5cdFwiMThcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gQW56YWxpYXMgUGFzc1xyXG5cdFwiMTlcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gT2dyZXdhdGNoIEN1dFxyXG5cdFwiNlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgQ2FtcCAtIE1pbGwgLSBTcGVsZGFuXHJcblx0XCI1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBDYW1wIC0gTWluZSAtIFBhbmdsb3NzXHJcblxyXG5cdC8vXHRCbHVlIENvcm5lclxyXG5cdFwiMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIEtlZXAgLSBWYWxsZXlcclxuXHRcIjE1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBMYW5nb3IgR3VsY2hcclxuXHRcIjIyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBCcmF2b3N0IEVzY2FycG1lbnRcclxuXHRcIjE2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBRdWVudGluIExha2VcclxuXHRcIjIxXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBEdXJpb3MgR3VsY2hcclxuXHRcIjdcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBDYW1wIC0gTWluZSAtIERhbmVsb25cclxuXHRcIjhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBDYW1wIC0gTWlsbCAtIFVtYmVyZ2xhZGVcclxuXHJcblx0Ly9cdEdyZWVuIENvcm5lclxyXG5cdFwiM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBLZWVwIC0gTG93bGFuZHNcclxuXHRcIjExXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gQWxkb25zXHJcblx0XCIxM1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEplcnJpZmVyJ3MgU2xvdWdoXHJcblx0XCIxMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIFdpbGRjcmVla1xyXG5cdFwiMTRcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBLbG92YW4gR3VsbHlcclxuXHRcIjEwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIENhbXAgLSBNaW5lIC0gUm9ndWVzIFF1YXJyeVxyXG5cdFwiNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBDYW1wIC0gTWlsbCAtIEdvbGFudGFcclxuXHJcblxyXG5cdC8vXHRSZWRIb21lXHJcblx0XCIzN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMzNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYW1pbmcgQmF5XHJcblx0XCIzMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEV0aGVyb24gSGlsbHNcclxuXHRcIjM4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gTG9uZ3ZpZXdcclxuXHRcIjQwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ2xpZmZzaWRlXHJcblx0XCIzOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBHb2Rzd29yZFxyXG5cdFwiNTJcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBBcmFoJ3MgSG9wZVxyXG5cdFwiNTFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBBc3RyYWxob2xtZVxyXG5cclxuXHRcIjM1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gR3JlZW5icmlhclxyXG5cdFwiMzZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBCbHVlbGFrZVxyXG5cdFwiMzRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBWaWN0b3IncyBMb2RnZVxyXG5cdFwiNTNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gR3JlZW52YWxlIFJlZnVnZVxyXG5cdFwiNTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEJsdWV3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEdyZWVuSG9tZVxyXG5cdFwiNDZcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjQ0XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFkZmFsbCBCYXlcclxuXHRcIjQxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gU2hhZGFyYW4gSGlsbHNcclxuXHRcIjQ3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gU3VubnloaWxsXHJcblx0XCI1N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENyYWd0b3BcclxuXHRcIjU2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFRpdGFucGF3XHJcblx0XCI0OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEZhaXRobGVhcFxyXG5cdFwiNTRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBGb2doYXZlblxyXG5cclxuXHRcIjQ1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gQmx1ZWJyaWFyXHJcblx0XCI0MlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIFJlZGxha2VcclxuXHRcIjQzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gSGVybydzIExvZGdlXHJcblx0XCI0OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBCbHVldmFsZSBSZWZ1Z2VcclxuXHRcIjU1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBSZWR3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEJsdWVIb21lXHJcblx0XCIyM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMjdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gQXNjZW5zaW9uIEJheVxyXG5cdFwiMzFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBBc2thbGlvbiBIaWxsc1xyXG5cdFwiMzBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBXb29kaGF2ZW5cclxuXHRcIjI4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gRGF3bidzIEV5cmllXHJcblx0XCIyOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBTcGlyaXRob2xtZVxyXG5cdFwiNThcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBHb2RzbG9yZVxyXG5cdFwiNjBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBTdGFyZ3JvdmVcclxuXHJcblx0XCIyNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIFJlZGJyaWFyXHJcblx0XCIyNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEdyZWVubGFrZVxyXG5cdFwiMjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBDaGFtcGlvbidzIERlbWVuc2VcclxuXHRcIjU5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIFJlZHZhbGUgUmVmdWdlXHJcblx0XCI2MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gR3JlZW53YXRlciBMb3dsYW5kc1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJuYW1lXCI6IFwiR3JlZW4gTWlsbFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJuYW1lXCI6IFwiUmVkIE1pbmVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwibmFtZVwiOiBcIlJlZCBNaWxsXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcIm5hbWVcIjogXCJCbHVlIE1pbmVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwibmFtZVwiOiBcIkJsdWUgTWlsbFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJuYW1lXCI6IFwiQ2FzdGxlXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogMTAsIFwibmFtZVwiOiBcIkdyZWVuIE1pbmVcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiAxMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiAxMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiAxMywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiAxNCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiAxNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiAxNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiAxNywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiAxOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiAxOSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiAyMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiAyMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiAyMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiAyMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IDI1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IDI0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogMjYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogMjcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiAyOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiAyOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IDMwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IDMxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogMzIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiAzMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IDM0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogMzUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogMzYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogMzcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiAzOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiAzOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IDQwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IDQxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogNDIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogNDMsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiA0NCwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IDQ1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IDQ2LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogNDcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogNDgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IDQ5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IDUwLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiA1MSwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiA1MiwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogNTMsIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogNTQsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogNTUsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IDU2LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogNTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogNTgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IDU5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IDYwLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IDYxLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiA2MiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiA2MywgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IDY0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiA2NSwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiA2NiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IDY3LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogNjgsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogNjksIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IDcwLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogNzEsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogNzIsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiA3MywgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiA3NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogNzUsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiA3NiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAzNSwgXCJuYW1lXCI6IFwiY2FzdGxlXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMjUsIFwibmFtZVwiOiBcImtlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAxMCwgXCJuYW1lXCI6IFwidG93ZXJcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiA1LCBcIm5hbWVcIjogXCJjYW1wXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwidGVtcGxlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiaG9sbG93XCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiZXN0YXRlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwib3Zlcmxvb2tcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJhc2NlbnRcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbWJvc3NmZWxzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFtYm9zc2ZlbHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbnZpbCBSb2NrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFudmlsLXJvY2tcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBZdW5xdWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwteXVucXVlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGVyIGRlIGwnZW5jbHVtZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZXItZGUtbGVuY2x1bWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkpha2JpZWd1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFrYmllZ3VuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIllhaydzIEJlbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwieWFrcy1iZW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVjbGl2ZSBkZWwgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlY2xpdmUtZGVsLXlha1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvdXJiZSBkdSBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY291cmJlLWR1LXlha1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlbnJhdmlzIEVyZHdlcmtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVucmF2aXMtZXJkd2Vya1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlbmdlIG9mIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVuZ2Utb2YtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDrXJjdWxvIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2lyY3Vsby1kZS1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvbWxlY2ggZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9tbGVjaC1kZS1kZW5yYXZpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSG9jaG9mZW4gZGVyIEJldHLDvGJuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaG9jaG9mZW4tZGVyLWJldHJ1Ym5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNvcnJvdydzIEZ1cm5hY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic29ycm93cy1mdXJuYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhZ3VhIGRlbCBQZXNhclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmcmFndWEtZGVsLXBlc2FyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm91cm5haXNlIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm91cm5haXNlLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUb3IgZGVzIElycnNpbm5zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRvci1kZXMtaXJyc2lubnNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYXRlIG9mIE1hZG5lc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2F0ZS1vZi1tYWRuZXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhIGRlIGxhIExvY3VyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGEtZGUtbGEtbG9jdXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGUgZGUgbGEgZm9saWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGUtZGUtbGEtZm9saWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgRXNwZW53YWxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtZXNwZW53YWxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFRyZW1ibGVmb3LDqnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC10cmVtYmxlZm9yZXRcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeS1CdWNodFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1idWNodFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5IEJheVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1iYXlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtZWhtcnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGQnRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZWhtcnlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaW5zdGVyZnJlaXN0YXR0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpbnN0ZXJmcmVpc3RhdHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEYXJraGF2ZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGFya2hhdmVuXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBPc2N1cm9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1vc2N1cm9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2Ugbm9pclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2Utbm9pclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlaWxpZ2UgSGFsbGUgdm9uIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVpbGlnZS1oYWxsZS12b24tcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dW0gb2YgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVtLW9mLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYWdyYXJpbyBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhZ3JhcmlvLWRlLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVhaXJlIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1YWlyZS1kZS1yYWxsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFudGhpci1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYW50aGlyLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsZSBvZiBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGUtb2YtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWRlLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtamFudGhpclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lZXIgZGVzIExlaWRzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lZXItZGVzLWxlaWRzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhIG9mIFNvcnJvd3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhLW9mLXNvcnJvd3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbCBNYXIgZGUgbG9zIFBlc2FyZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWwtbWFyLWRlLWxvcy1wZXNhcmVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTsO2cmRsaWNoZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9yZGxpY2hlLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vcnRoZXJuIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcnRoZXJuLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGljb3Nlc2NhbG9mcmlhbnRlcyBkZWwgTm9ydGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGljb3Nlc2NhbG9mcmlhbnRlcy1kZWwtbm9ydGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDaW1lZnJvaWRlcyBub3JkaXF1ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2ltZWZyb2lkZXMtbm9yZGlxdWVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyenRvclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6dG9yXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2tnYXRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrZ2F0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YW5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGVub2lyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZW5vaXJlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhY2hlbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWNoZW5icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWdvbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWdvbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyY2EgZGVsIERyYWfDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyY2EtZGVsLWRyYWdvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0aWdtYXRlIGR1IGRyYWdvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdGlnbWF0ZS1kdS1kcmFnb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbi1UZXJyYXNzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFzc2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24gVGVycmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJhemEgZGUgRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRlcnJhemEtZGUtZXJlZG9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhdGVhdSBkJ0VyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF0ZWF1LWRlcmVkb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLbGFnZW5yaXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtsYWdlbnJpc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIG9mIFdvZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLW9mLXdvZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3VyYSBkZSBsYSBBZmxpY2Npw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3VyYS1kZS1sYS1hZmxpY2Npb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIGR1IG1hbGhldXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1kdS1tYWxoZXVyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6Zmx1dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6Zmx1dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrdGlkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja3RpZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJlYSBOZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJlYS1uZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vaXJmbG90XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vaXJmbG90XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW50ZXJ3ZWx0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVudGVyd2VsdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVuZGVyd29ybGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW5kZXJ3b3JsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkluZnJhbXVuZG9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaW5mcmFtdW5kb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk91dHJlLW1vbmRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm91dHJlLW1vbmRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVybmUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcm5lLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZhciBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmYXItc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMZWphbmFzIFBpY29zZXNjYWxvZnJpYW50ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGVqYW5hcy1waWNvc2VzY2Fsb2ZyaWFudGVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTG9pbnRhaW5lcyBDaW1lZnJvaWRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsb2ludGFpbmVzLWNpbWVmcm9pZGVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lbiB2b24gU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lbi12b24tc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbnMgb2YgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5zLW9mLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5hcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmFzLWRlLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVzLWRlLXN1cm1pYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlZW1hbm5zcmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWVtYW5uc3Jhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWFmYXJlcidzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhZmFyZXJzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIGRlbCBWaWFqYW50ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLWRlbC12aWFqYW50ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGR1IE1hcmluXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWR1LW1hcmluXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbi1QbGF0elwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1wbGF0elwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuIFNxdWFyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1zcXVhcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS1waWtlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLXBpa2VuXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGljaHR1bmcgZGVyIE1vcmdlbnLDtnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxpY2h0dW5nLWRlci1tb3JnZW5yb3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVyb3JhIEdsYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1cm9yYS1nbGFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYXJvIGRlIGxhIEF1cm9yYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFyby1kZS1sYS1hdXJvcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFpcmnDqHJlIGRlIGwnYXVyb3JlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYWlyaWVyZS1kZS1sYXVyb3JlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlbWVlciBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGVtZWVyLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBTZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXNlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyLWRlLWphZGUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZS1qYWRlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haC1QbGF0eiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtcGxhdHotZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoIFNxdWFyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtc3F1YXJlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtZGUtdml6dW5haC1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhdWJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGF1YmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBcmJvcnN0b25lIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXJib3JzdG9uZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZWRyYSBBcmLDs3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZWRyYS1hcmJvcmVhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllcnJlIEFyYm9yZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVycmUtYXJib3JlYS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmx1c3N1ZmVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmx1c3N1ZmVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUml2ZXJzaWRlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicml2ZXJzaWRlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmliZXJhIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmliZXJhLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHJvdmluY2VzIGZsdXZpYWxlcyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInByb3ZpbmNlcy1mbHV2aWFsZXMtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYWZlbHMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYWZlbHMtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYSBSZWFjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hLXJlYWNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2HDscOzbiBkZSBFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbm9uLWRlLWVsb25hLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmllZiBkJ0Vsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmllZi1kZWxvbmEtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXItU2VlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1zZWUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyIExha2UgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLWxha2UtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWdvIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWdvLWRyYWtrYXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWMgRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhYy1kcmFra2FyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyc3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnN1bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXIncyBTb3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnMtc291bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFc3RyZWNobyBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlc3RyZWNoby1kZS1taWxsZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6l0cm9pdCBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXRyb2l0LWRlLW1pbGxlci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2gtQnVjaHQgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYnVjaHQtc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2ggQmF5IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJheS1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBCYXJ1Y2ggW0VTXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1iYXJ1Y2gtZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGRlIEJhcnVjaCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGUtYmFydWNoLXNwXCJcclxuXHRcdH1cclxuXHR9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRsYW5nczogcmVxdWlyZSgnLi9kYXRhL2xhbmdzJyksXHJcblx0d29ybGRzOiByZXF1aXJlKCcuL2RhdGEvd29ybGRfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfbmFtZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfdHlwZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfdHlwZXMnKSxcclxuXHRvYmplY3RpdmVfbWV0YTogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tZXRhJyksXHJcblx0b2JqZWN0aXZlX2xhYmVsczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9sYWJlbHMnKSxcclxuXHRvYmplY3RpdmVfbWFwOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21hcCcpLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hXb3JsZCA9IHJlcXVpcmUoJy4vTWF0Y2hXb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSwgbmV4dFByb3BzLm1hdGNoLmdldChcInNjb3Jlc1wiKSk7XHJcblx0XHRjb25zdCBuZXdNYXRjaCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaC5nZXQoXCJzdGFydFRpbWVcIiksIG5leHRQcm9wcy5tYXRjaC5nZXQoXCJzdGFydFRpbWVcIikpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkcywgbmV4dFByb3BzLndvcmxkcyk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld01hdGNoIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2g6OnJlbmRlcigpJywgcHJvcHMubWF0Y2gudG9KUygpKTtcclxuXHJcblx0XHRjb25zdCB3b3JsZENvbG9ycyA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXTtcclxuXHJcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtYXRjaENvbnRhaW5lclwiIGtleT17cHJvcHMubWF0Y2guZ2V0KFwiaWRcIil9PlxyXG5cdFx0XHQ8dGFibGUgY2xhc3NOYW1lPVwibWF0Y2hcIj5cclxuXHRcdFx0XHR7d29ybGRDb2xvcnMubWFwKChjb2xvciwgaXhDb2xvcikgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcblx0XHRcdFx0XHRjb25zdCB3b3JsZElkID0gcHJvcHMubWF0Y2guZ2V0KHdvcmxkS2V5KS50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0Y29uc3Qgd29ybGQgPSBwcm9wcy53b3JsZHMuZ2V0KHdvcmxkSWQpO1xyXG5cdFx0XHRcdFx0Y29uc3Qgc2NvcmVzID0gcHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gPE1hdGNoV29ybGRcclxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PSd0cidcclxuXHRcdFx0XHRcdFx0a2V5PXt3b3JsZElkfVxyXG5cclxuXHRcdFx0XHRcdFx0d29ybGQ9e3dvcmxkfVxyXG5cdFx0XHRcdFx0XHRzY29yZXM9e3Njb3Jlc31cclxuXHJcblx0XHRcdFx0XHRcdGNvbG9yPXtjb2xvcn1cclxuXHRcdFx0XHRcdFx0aXhDb2xvcj17aXhDb2xvcn1cclxuXHRcdFx0XHRcdFx0c2hvd1BpZT17aXhDb2xvciA9PT0gMH1cclxuXHRcdFx0XHRcdC8+O1xyXG5cdFx0XHRcdH0pfVxyXG5cdFx0XHQ8L3RhYmxlPlxyXG5cdFx0PC9kaXY+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXRjaC5wcm9wVHlwZXMgPSB7XHJcblx0bWF0Y2g6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2g7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTY29yZSA9IHJlcXVpcmUoJy4vU2NvcmUnKTtcclxuY29uc3QgUGllID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL1BpZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IEV4cG9ydFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXRjaFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuc2NvcmVzLCBuZXh0UHJvcHMuc2NvcmVzKTtcclxuXHRcdGNvbnN0IG5ld0NvbG9yID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmNvbG9yLCBuZXh0UHJvcHMuY29sb3IpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGQgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGQsIG5leHRQcm9wcy53b3JsZCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3U2NvcmVzIHx8IG5ld0NvbG9yIHx8IG5ld1dvcmxkKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoV29ybGRzOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgbmV3U2NvcmVzLCBuZXdDb2xvciwgbmV3V29ybGQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoV29ybGRzOjpyZW5kZXIoKScpO1xyXG5cclxuXHRcdHJldHVybiA8dHI+XHJcblx0XHRcdDx0ZCBjbGFzc05hbWU9e2B0ZWFtIG5hbWUgJHtwcm9wcy5jb2xvcn1gfT5cclxuXHRcdFx0XHQ8YSBocmVmPXtwcm9wcy53b3JsZC5nZXQoJ2xpbmsnKX0+e3Byb3BzLndvcmxkLmdldCgnbmFtZScpfTwvYT5cclxuXHRcdFx0PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzTmFtZT17YHRlYW0gc2NvcmUgJHtwcm9wcy5jb2xvcn1gfT5cclxuXHRcdFx0XHQ8U2NvcmVcclxuXHRcdFx0XHRcdHRlYW09e3Byb3BzLmNvbG9yfVxyXG5cdFx0XHRcdFx0c2NvcmU9e3Byb3BzLnNjb3Jlcy5nZXQocHJvcHMuaXhDb2xvcil9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0PC90ZD5cclxuXHRcdFx0eyhwcm9wcy5zaG93UGllKVxyXG5cdFx0XHRcdD8gPHRkIHJvd1NwYW49XCIzXCIgY2xhc3NOYW1lPVwicGllXCI+XHJcblx0XHRcdFx0XHQ8UGllXHJcblx0XHRcdFx0XHRcdHNjb3Jlcz17cHJvcHMuc2NvcmVzfVxyXG5cdFx0XHRcdFx0XHRzaXplPXs2MH1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0PC90ZD5cclxuXHRcdFx0XHQ6IG51bGxcclxuXHRcdFx0fVxyXG5cdFx0PC90cj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hdGNoV29ybGQucHJvcFR5cGVzID0ge1xyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRpeENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0c2hvd1BpZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCAkID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IG51bWVyYWwgPSByZXF1aXJlKCdudW1lcmFsJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBTY29yZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7ZGlmZjogMH07XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdHJldHVybiAodGhpcy5wcm9wcy5zY29yZSAhPT0gbmV4dFByb3BzLnNjb3JlKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoe2RpZmY6IG5leHRQcm9wcy5zY29yZSAtIHByb3BzLnNjb3JlfSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRpZihzdGF0ZS5kaWZmICE9PSAwKSB7XHJcblx0XHRcdGFuaW1hdGVTY29yZURpZmYodGhpcy5yZWZzLmRpZmYuZ2V0RE9NTm9kZSgpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0cmV0dXJuIDxkaXY+XHJcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImRpZmZcIiByZWY9XCJkaWZmXCI+e2dldERpZmZUZXh0KHN0YXRlLmRpZmYpfTwvc3Bhbj5cclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57Z2V0U2NvcmVUZXh0KHByb3BzLnNjb3JlKX08L3NwYW4+XHJcblx0XHQ8L2Rpdj47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNjb3JlLnByb3BUeXBlcyA9IHtcclxuXHRzY29yZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NvcmU7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVNjb3JlRGlmZihlbCkge1xyXG5cdCQoZWwpXHJcblx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDB9KVxyXG5cdFx0LnZlbG9jaXR5KCdmYWRlSW4nLCB7ZHVyYXRpb246IDIwMH0pXHJcblx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDEyMDAsIGRlbGF5OiA0MDB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldERpZmZUZXh0KGRpZmYpIHtcclxuXHRyZXR1cm4gKGRpZmYpXHJcblx0XHQ/IG51bWVyYWwoZGlmZikuZm9ybWF0KCcrMCwwJylcclxuXHRcdDogbnVsbDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNjb3JlVGV4dChzY29yZSkge1xyXG5cdHJldHVybiAoc2NvcmUpXHJcblx0XHQ/IG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJylcclxuXHRcdDogbnVsbDtcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXRjaCA9IHJlcXVpcmUoJy4vTWF0Y2gnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWF0Y2hlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGNvbnN0IG5ld1JlZ2lvbiA9ICFJbW11dGFibGUuaXMocHJvcHMucmVnaW9uLCBuZXh0UHJvcHMucmVnaW9uKTtcclxuXHRcdGNvbnN0IG5ld01hdGNoZXMgPSAhSW1tdXRhYmxlLmlzKHByb3BzLm1hdGNoZXMsIG5leHRQcm9wcy5tYXRjaGVzKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXMocHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdSZWdpb24gfHwgbmV3TWF0Y2hlcyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6TWF0Y2hlczo6c2hvdWxkQ29tcG9uZW50VXBkYXRlKCknLCB7c2hvdWxkVXBkYXRlLCBuZXdSZWdpb24sIG5ld01hdGNoZXMsIG5ld1dvcmxkc30pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Ok1hdGNoZXM6OnJlbmRlcigpJywgJ3JlZ2lvbicsIHByb3BzLnJlZ2lvbi50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICdtYXRjaGVzJywgcHJvcHMubWF0Y2hlcy50b0pTKCkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpNYXRjaGVzOjpyZW5kZXIoKScsICd3b3JsZHMnLCBwcm9wcy53b3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdSZWdpb25NYXRjaGVzJz5cclxuXHRcdFx0XHQ8aDI+e3Byb3BzLnJlZ2lvbi5nZXQoJ2xhYmVsJyl9IE1hdGNoZXM8L2gyPlxyXG5cclxuXHRcdFx0XHR7cHJvcHMubWF0Y2hlcy5tYXAoKG1hdGNoLCBtYXRjaElkKSA9PlxyXG5cdFx0XHRcdFx0PE1hdGNoXHJcblx0XHRcdFx0XHRcdGtleT17bWF0Y2hJZH1cclxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdtYXRjaCdcclxuXHJcblx0XHRcdFx0XHRcdHdvcmxkcz17cHJvcHMud29ybGRzfVxyXG5cdFx0XHRcdFx0XHRtYXRjaD17bWF0Y2h9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTWF0Y2hlcy5wcm9wVHlwZXMgPSB7XHJcblx0cmVnaW9uOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdG1hdGNoZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFJlZ2lvbldvcmxkc1dvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLndvcmxkLCBuZXh0UHJvcHMud29ybGQpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0xhbmcgfHwgbmV3V29ybGQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1JlZ2lvbldvcmxkc1dvcmxkOjpyZW5kZXInLCBwcm9wcy53b3JsZC50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiA8bGk+PGEgaHJlZj17cHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9Pntwcm9wcy53b3JsZC5nZXQoJ25hbWUnKX08L2E+PC9saT47XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5SZWdpb25Xb3JsZHNXb3JsZC5wcm9wVHlwZXMgPSB7XHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWdpb25Xb3JsZHNXb3JsZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBXb3JsZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMud29ybGRzLCBuZXh0UHJvcHMud29ybGRzKTtcclxuXHRcdGNvbnN0IG5ld1JlZ2lvbiA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKSwgbmV4dFByb3BzLnJlZ2lvbi5nZXQoJ3dvcmxkcycpKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld1JlZ2lvbik7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ292ZXJ2aWV3OjpSZWdpb25Xb3JsZHM6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywgc2hvdWxkVXBkYXRlLCBuZXdMYW5nLCBuZXdSZWdpb24pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6Oldvcmxkczo6cmVuZGVyKCknLCBwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpLCBwcm9wcy5yZWdpb24uZ2V0KCd3b3JsZHMnKS50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiUmVnaW9uV29ybGRzXCI+XHJcblx0XHRcdFx0PGgyPntwcm9wcy5yZWdpb24uZ2V0KCdsYWJlbCcpfSBXb3JsZHM8L2gyPlxyXG5cdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJsaXN0LXVuc3R5bGVkXCI+XHJcblx0XHRcdFx0XHR7cHJvcHMud29ybGRzLm1hcCh3b3JsZCA9PlxyXG5cdFx0XHRcdFx0XHQ8V29ybGRcclxuXHRcdFx0XHRcdFx0XHRrZXk9e3dvcmxkLmdldCgnaWQnKX1cclxuXHRcdFx0XHRcdFx0XHR3b3JsZD17d29ybGR9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQpfVxyXG5cdFx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuV29ybGRzLnByb3BUeXBlcyA9IHtcclxuXHRyZWdpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuU2VxKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBhcGkgPSByZXF1aXJlKCdsaWIvYXBpJyk7XHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWF0Y2hlcyA9IHJlcXVpcmUoJy4vTWF0Y2hlcycpO1xyXG5jb25zdCBXb3JsZHMgPSByZXF1aXJlKCcuL1dvcmxkcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgT3ZlcnZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMudGltZW91dHMgPSB7fTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRyZWdpb25zOiBJbW11dGFibGUuZnJvbUpTKHtcclxuXHRcdFx0XHQnMSc6IHtsYWJlbDogJ05BJywgaWQ6ICcxJ30sXHJcblx0XHRcdFx0JzInOiB7bGFiZWw6ICdFVScsIGlkOiAnMid9LFxyXG5cdFx0XHR9KSxcclxuXHJcblx0XHRcdG1hdGNoZXNCeVJlZ2lvbjogSW1tdXRhYmxlLmZyb21KUyh7JzEnOnt9LCAnMic6e319KSxcclxuXHRcdFx0d29ybGRzQnlSZWdpb246IEltbXV0YWJsZS5mcm9tSlMoeycxJzp7fSwgJzInOnt9fSksXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyhwcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdNYXRjaERhdGEgPSAhSW1tdXRhYmxlLmlzKHN0YXRlLm1hdGNoZXNCeVJlZ2lvbiwgbmV4dFN0YXRlLm1hdGNoZXNCeVJlZ2lvbik7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyAgfHwgbmV3TWF0Y2hEYXRhKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnNob3VsZENvbXBvbmVudFVwZGF0ZSgpJywge3Nob3VsZFVwZGF0ZSwgbmV3TGFuZywgbmV3TWF0Y2hEYXRhfSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbE1vdW50KCkge1xyXG5cdFx0c2V0UGFnZVRpdGxlLmNhbGwodGhpcywgdGhpcy5wcm9wcy5sYW5nKTtcclxuXHRcdHNldFdvcmxkcy5jYWxsKHRoaXMsIHRoaXMucHJvcHMubGFuZyk7XHJcblxyXG5cdFx0Z2V0RGF0YS5jYWxsKHRoaXMpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0c2V0UGFnZVRpdGxlLmNhbGwodGhpcywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0c2V0V29ybGRzLmNhbGwodGhpcywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuXHRcdHRoaXMubW91bnRlZCA9IGZhbHNlO1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dHMubWF0Y2hEYXRhKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAnbGFuZycsIHByb3BzLmxhbmcudG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAncmVnaW9ucycsIHN0YXRlLnJlZ2lvbnMudG9KUygpKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6cmVuZGVyKCknLCAnbWF0Y2hlc0J5UmVnaW9uJywgc3RhdGUubWF0Y2hlc0J5UmVnaW9uLnRvSlMoKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnb3ZlcnZpZXc6OnJlbmRlcigpJywgJ3dvcmxkc0J5UmVnaW9uJywgc3RhdGUud29ybGRzQnlSZWdpb24udG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gPGRpdiBpZD1cIm92ZXJ2aWV3XCI+XHJcblx0XHRcdHs8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdHtzdGF0ZS5yZWdpb25zLm1hcCgocmVnaW9uLCByZWdpb25JZCkgPT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyXCIga2V5PXtyZWdpb25JZH0+XHJcblx0XHRcdFx0XHRcdDxNYXRjaGVzXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uPXtyZWdpb259XHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcz17c3RhdGUubWF0Y2hlc0J5UmVnaW9uLmdldChyZWdpb25JZCl9XHJcblx0XHRcdFx0XHRcdFx0d29ybGRzPXtzdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9kaXY+fVxyXG5cclxuXHRcdFx0PGhyIC8+XHJcblxyXG5cdFx0XHR7PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHR7c3RhdGUucmVnaW9ucy5tYXAoKHJlZ2lvbiwgcmVnaW9uSWQpID0+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xMlwiIGtleT17cmVnaW9uSWR9PlxyXG5cdFx0XHRcdFx0XHQ8V29ybGRzXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uPXtyZWdpb259XHJcblx0XHRcdFx0XHRcdFx0d29ybGRzPXtzdGF0ZS53b3JsZHNCeVJlZ2lvbi5nZXQocmVnaW9uSWQpfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC9kaXY+fVxyXG5cdFx0PC9kaXY+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5PdmVydmlldy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGlyZWN0IERPTSBNYW5pcHVsYXRpb25cclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcpIHtcclxuXHRsZXQgdGl0bGUgPSBbJ2d3Mncydy5jb20nXTtcclxuXHJcblx0aWYgKGxhbmcuZ2V0KCdzbHVnJykgIT09ICdlbicpIHtcclxuXHRcdHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcblx0fVxyXG5cclxuXHQkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERhdGFcclxuKlxyXG4qL1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHREYXRhIC0gV29ybGRzXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRXb3JsZHMobGFuZykge1xyXG5cdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0Y29uc3QgbmV3V29ybGRzQnlSZWdpb24gPSBJbW11dGFibGVcclxuXHRcdC5TZXEoU1RBVElDLndvcmxkcylcclxuXHRcdC5tYXAod29ybGQgPT4gZ2V0V29ybGRCeUxhbmcobGFuZywgd29ybGQpKVxyXG5cdFx0LnNvcnRCeSh3b3JsZCA9PiB3b3JsZC5nZXQoJ25hbWUnKSlcclxuXHRcdC5ncm91cEJ5KHdvcmxkID0+IHdvcmxkLmdldCgncmVnaW9uJykpO1xyXG5cclxuXHRzZWxmLnNldFN0YXRlKHt3b3JsZHNCeVJlZ2lvbjogbmV3V29ybGRzQnlSZWdpb259KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZEJ5TGFuZyhsYW5nLCB3b3JsZCkge1xyXG5cdGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0Y29uc3Qgd29ybGRCeUxhbmcgPSB3b3JsZC5nZXQobGFuZ1NsdWcpO1xyXG5cclxuXHRjb25zdCByZWdpb24gPSB3b3JsZC5nZXQoJ3JlZ2lvbicpO1xyXG5cdGNvbnN0IGxpbmsgPSBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkQnlMYW5nKTtcclxuXHJcblx0cmV0dXJuIHdvcmxkQnlMYW5nLm1lcmdlKHtsaW5rLCByZWdpb259KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcblx0cmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0RGF0YSAtIE1hdGNoZXNcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEoKSB7XHJcblx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdC8vIGNvbnNvbGUubG9nKCdvdmVydmlldzo6Z2V0RGF0YSgpJyk7XHJcblxyXG5cdGFwaS5nZXRNYXRjaGVzKChlcnIsIGRhdGEpID0+IHtcclxuXHRcdGNvbnN0IG1hdGNoRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YSk7XHJcblxyXG5cdFx0aWYgKHNlbGYubW91bnRlZCkge1xyXG5cdFx0XHRpZiAoIWVyciAmJiBtYXRjaERhdGEgJiYgIW1hdGNoRGF0YS5pc0VtcHR5KCkpIHtcclxuXHRcdFx0XHRzZWxmLnNldFN0YXRlKGdldE1hdGNoZXNCeVJlZ2lvbi5iaW5kKHNlbGYsIG1hdGNoRGF0YSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXREYXRhVGltZW91dC5jYWxsKHNlbGYpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNCeVJlZ2lvbihtYXRjaERhdGEsIHN0YXRlKSB7XHJcblx0Y29uc3QgbmV3TWF0Y2hlc0J5UmVnaW9uID0gSW1tdXRhYmxlXHJcblx0XHQuU2VxKG1hdGNoRGF0YSlcclxuXHRcdC5ncm91cEJ5KG1hdGNoID0+IG1hdGNoLmdldChcInJlZ2lvblwiKS50b1N0cmluZygpKTtcclxuXHJcblx0cmV0dXJuIHttYXRjaGVzQnlSZWdpb246IHN0YXRlLm1hdGNoZXNCeVJlZ2lvbi5tZXJnZURlZXAobmV3TWF0Y2hlc0J5UmVnaW9uKX07XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2V0RGF0YVRpbWVvdXQoKSB7XHJcblx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnRpbWVvdXRzLm1hdGNoRGF0YSA9IHNldFRpbWVvdXQoXHJcblx0XHRnZXREYXRhLmJpbmQoc2VsZiksXHJcblx0XHRnZXRJbnRlcnZhbCgpXHJcblx0KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCgpIHtcclxuXHRyZXR1cm4gXy5yYW5kb20oMjAwMCwgNDAwMCk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBPYmplY3RpdmUgPSByZXF1aXJlKCcuLi9PYmplY3RpdmVzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IG9iamVjdGl2ZUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogdHJ1ZSxcclxuXHR0aW1lc3RhbXA6IHRydWUsXHJcblx0bWFwQWJicmV2OiB0cnVlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogZmFsc2UsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBHdWlsZENsYWltcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdDbGFpbXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKSwgbmV4dFByb3BzLmd1aWxkLmdldCgnY2xhaW1zJykpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0NsYWltcyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnQ2xhaW1zOjpzaG91bGRDb21wb25lbnRVcGRhdGUoKScsIHNob3VsZFVwZGF0ZSwgdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX2lkJykpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuXHRcdGNvbnN0IGNsYWltcyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdjbGFpbXMnKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnQ2xhaW1zOjpyZW5kZXIoKScsIGd1aWxkSWQpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZFwiPlxyXG5cdFx0XHRcdHtjbGFpbXMubWFwKGVudHJ5ID0+XHJcblx0XHRcdFx0XHQ8bGkga2V5PXtlbnRyeS5nZXQoJ2lkJyl9PlxyXG5cdFx0XHRcdFx0XHQ8T2JqZWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0Y29scz17b2JqZWN0aXZlQ29sc31cclxuXHJcblx0XHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRcdGd1aWxkSWQ9e2d1aWxkSWR9XHJcblx0XHRcdFx0XHRcdFx0Z3VpbGQ9e3RoaXMucHJvcHMuZ3VpbGR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdG9iamVjdGl2ZUlkPXtlbnRyeS5nZXQoJ29iamVjdGl2ZUlkJyl9XHJcblx0XHRcdFx0XHRcdFx0d29ybGRDb2xvcj17ZW50cnkuZ2V0KCd3b3JsZCcpfVxyXG5cdFx0XHRcdFx0XHRcdHRpbWVzdGFtcD17ZW50cnkuZ2V0KCd0aW1lc3RhbXAnKX1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZENsYWltcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkQ2xhaW1zO1xyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEVtYmxlbSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuY29uc3QgQ2xhaW1zID0gcmVxdWlyZSgnLi9DbGFpbXMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0Q29tcG9uZW50IEdsb2JhbHNcclxuKi9cclxuXHJcbmNvbnN0IGxvYWRpbmdIdG1sID0gPGgxIHN0eWxlPXt7d2hpdGVTcGFjZTogXCJub3dyYXBcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wifX0+XHJcblx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCIgLz5cclxuXHR7JyBMb2FkaW5nLi4uJ31cclxuPC9oMT47XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGREYXRhID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgZGF0YVJlYWR5ID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2xvYWRlZCcpO1xyXG5cclxuXHRcdGNvbnN0IGd1aWxkSWQgPSB0aGlzLnByb3BzLmd1aWxkLmdldCgnZ3VpbGRfaWQnKTtcclxuXHRcdGNvbnN0IGd1aWxkTmFtZSA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJyk7XHJcblx0XHRjb25zdCBndWlsZFRhZyA9IHRoaXMucHJvcHMuZ3VpbGQuZ2V0KCd0YWcnKTtcclxuXHRcdGNvbnN0IGd1aWxkQ2xhaW1zID0gdGhpcy5wcm9wcy5ndWlsZC5nZXQoJ2NsYWltcycpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdHdWlsZDo6cmVuZGVyKCknLCBndWlsZElkLCBndWlsZE5hbWUpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImd1aWxkXCIgaWQ9e2d1aWxkSWR9PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tNFwiPlxyXG5cdFx0XHRcdFx0XHR7KGRhdGFSZWFkeSlcclxuXHRcdFx0XHRcdFx0XHQ/IDxhIGhyZWY9e2BodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLyR7c2x1Z2lmeShndWlsZE5hbWUpfWB9IHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PEVtYmxlbSBndWlsZE5hbWU9e2d1aWxkTmFtZX0gc2l6ZT17MjU2fSAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdFx0XHQ6IDxFbWJsZW0gc2l6ZT17MjU2fSAvPlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0yMFwiPlxyXG5cdFx0XHRcdFx0XHR7KGRhdGFSZWFkeSlcclxuXHRcdFx0XHRcdFx0XHQ/IDxoMT48YSBocmVmPXtgaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tL2d1aWxkcy8ke3NsdWdpZnkoZ3VpbGROYW1lKX1gfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0XHRcdFx0XHRcdHtndWlsZE5hbWV9IFt7Z3VpbGRUYWd9XVxyXG5cdFx0XHRcdFx0XHRcdDwvYT48L2gxPlxyXG5cdFx0XHRcdFx0XHRcdDogbG9hZGluZ0h0bWxcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0eyFndWlsZENsYWltcy5pc0VtcHR5KClcclxuXHRcdFx0XHRcdFx0XHQ/IDxDbGFpbXMgey4uLnRoaXMucHJvcHN9IC8+XHJcblx0XHRcdFx0XHRcdFx0OiBudWxsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkO1xyXG5cclxuZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcclxuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBHdWlsZCA9IHJlcXVpcmUoJy4vR3VpbGQnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgR3VpbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHQvLyBjb25zdHJ1Y3RvcigpIHt9XHJcblx0Ly8gY29tcG9uZW50RGlkTW91bnQoKSB7fVxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkRGF0YSk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdHdWlsZHM6OnJlbmRlcigpJyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncHJvcHMuZ3VpbGRzJywgcHJvcHMuZ3VpbGRzLnRvT2JqZWN0KCkpO1xyXG5cclxuXHRcdGNvbnN0IHNvcnRlZEd1aWxkcyA9IHByb3BzLmd1aWxkcy50b1NlcSgpXHJcblx0XHRcdC5zb3J0QnkoZ3VpbGQgPT4gZ3VpbGQuZ2V0KCdndWlsZF9uYW1lJykpXHJcblx0XHRcdC5zb3J0QnkoZ3VpbGQgPT4gLWd1aWxkLmdldCgnbGFzdENsYWltJykpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGlkPVwiZ3VpbGRzXCI+XHJcblx0XHRcdFx0PGgyIGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZGVyXCI+R3VpbGQgQ2xhaW1zPC9oMj5cclxuXHRcdFx0XHR7c29ydGVkR3VpbGRzLm1hcChndWlsZCA9PlxyXG5cdFx0XHRcdFx0PEd1aWxkXHJcblx0XHRcdFx0XHRcdGtleT17Z3VpbGQuZ2V0KCdndWlsZF9pZCcpfVxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRndWlsZD17Z3VpbGR9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkd1aWxkcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHdWlsZHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCAkID0gcmVxdWlyZSgnalF1ZXJ5Jyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJy4uL09iamVjdGl2ZXMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgY2FwdHVyZUNvbHMgPSB7XHJcblx0ZWxhcHNlZDogdHJ1ZSxcclxuXHR0aW1lc3RhbXA6IHRydWUsXHJcblx0bWFwQWJicmV2OiB0cnVlLFxyXG5cdGFycm93OiB0cnVlLFxyXG5cdHNwcml0ZTogdHJ1ZSxcclxuXHRuYW1lOiB0cnVlLFxyXG5cdGV2ZW50VHlwZTogZmFsc2UsXHJcblx0Z3VpbGROYW1lOiBmYWxzZSxcclxuXHRndWlsZFRhZzogZmFsc2UsXHJcblx0dGltZXI6IGZhbHNlLFxyXG59O1xyXG5cclxuY29uc3QgY2xhaW1Db2xzID0ge1xyXG5cdGVsYXBzZWQ6IHRydWUsXHJcblx0dGltZXN0YW1wOiB0cnVlLFxyXG5cdG1hcEFiYnJldjogdHJ1ZSxcclxuXHRhcnJvdzogdHJ1ZSxcclxuXHRzcHJpdGU6IHRydWUsXHJcblx0bmFtZTogdHJ1ZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogdHJ1ZSxcclxuXHRndWlsZFRhZzogdHJ1ZSxcclxuXHR0aW1lcjogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkLCBuZXh0UHJvcHMuZ3VpbGQpO1xyXG5cdFx0Y29uc3QgbmV3RW50cnkgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZW50cnksIG5leHRQcm9wcy5lbnRyeSk7XHJcblxyXG5cdFx0Y29uc3QgbmV3RmlsdGVycyA9IChcclxuXHRcdFx0IUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hcEZpbHRlciwgbmV4dFByb3BzLm1hcEZpbHRlcilcclxuXHRcdFx0fHwgIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmV2ZW50RmlsdGVyLCBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpXHJcblx0XHQpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChcclxuXHRcdFx0bmV3TGFuZ1xyXG5cdFx0XHR8fCBuZXdHdWlsZFxyXG5cdFx0XHR8fCBuZXdFbnRyeVxyXG5cdFx0XHR8fCBuZXdGaWx0ZXJzXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdFbnRyeTpyZW5kZXIoKScsIHtuZXdUcmlnZ2VyU3RhdGUsIG5ld0ZpbHRlcnMsIHNob3VsZFVwZGF0ZX0pO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdFbnRyeTpyZW5kZXIoKScpO1xyXG5cdFx0Y29uc3QgZXZlbnRUeXBlID0gdGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKTtcclxuXHJcblx0XHRjb25zdCBjb2xzID0gKGV2ZW50VHlwZSA9PT0gJ2NsYWltJylcclxuXHRcdFx0PyBjbGFpbUNvbHNcclxuXHRcdFx0OiBjYXB0dXJlQ29scztcclxuXHJcblx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YVt0aGlzLnByb3BzLmVudHJ5LmdldCgnb2JqZWN0aXZlSWQnKV07XHJcblx0XHRjb25zdCBtYXBDb2xvciA9IF8uZmluZChTVEFUSUMub2JqZWN0aXZlX21hcCwgbWFwID0+IG1hcC5tYXBJbmRleCA9PT0gb01ldGEubWFwKS5jb2xvcjtcclxuXHJcblxyXG5cdFx0Y29uc3QgbWF0Y2hlc01hcEZpbHRlciA9IHRoaXMucHJvcHMubWFwRmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLm1hcEZpbHRlciA9PT0gbWFwQ29sb3I7XHJcblx0XHRjb25zdCBtYXRjaGVzRXZlbnRGaWx0ZXIgPSB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJyB8fCB0aGlzLnByb3BzLmV2ZW50RmlsdGVyID09PSBldmVudFR5cGU7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkQmVWaXNpYmxlID0gKG1hdGNoZXNNYXBGaWx0ZXIgJiYgbWF0Y2hlc0V2ZW50RmlsdGVyKTtcclxuXHRcdGNvbnN0IGNsYXNzTmFtZSA9IHNob3VsZEJlVmlzaWJsZSA/ICdzaG93LWVudHJ5JyA6ICdoaWRlLWVudHJ5JztcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuXHRcdFx0XHQ8T2JqZWN0aXZlXHJcblx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG5cdFx0XHRcdFx0Y29scz17Y29sc31cclxuXHRcdFx0XHRcdGd1aWxkSWQ9e3RoaXMucHJvcHMuZ3VpbGRJZH1cclxuXHRcdFx0XHRcdGd1aWxkPXt0aGlzLnByb3BzLmd1aWxkfVxyXG5cclxuXHRcdFx0XHRcdGVudHJ5SWQ9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCdpZCcpfVxyXG5cdFx0XHRcdFx0b2JqZWN0aXZlSWQ9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCdvYmplY3RpdmVJZCcpfVxyXG5cdFx0XHRcdFx0d29ybGRDb2xvcj17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3dvcmxkJyl9XHJcblx0XHRcdFx0XHR0aW1lc3RhbXA9e3RoaXMucHJvcHMuZW50cnkuZ2V0KCd0aW1lc3RhbXAnKX1cclxuXHRcdFx0XHRcdGV2ZW50VHlwZT17dGhpcy5wcm9wcy5lbnRyeS5nZXQoJ3R5cGUnKX1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuRW50cnkucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZW50cnk6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxuXHJcblx0bWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0ZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudHJ5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICh0aGlzLnByb3BzLmV2ZW50RmlsdGVyICE9PSBuZXh0UHJvcHMuZXZlbnRGaWx0ZXIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGlkPVwibG9nLWV2ZW50LWZpbHRlcnNcIiBjbGFzc05hbWU9XCJuYXYgbmF2LXBpbGxzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnY2xhaW0nKSA/ICdhY3RpdmUnOiBudWxsfT5cclxuXHRcdFx0XHRcdDxhIG9uQ2xpY2s9e3Byb3BzLnNldEV2ZW50fSBkYXRhLWZpbHRlcj1cImNsYWltXCI+Q2xhaW1zPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnY2FwdHVyZScpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0PGEgb25DbGljaz17cHJvcHMuc2V0RXZlbnR9IGRhdGEtZmlsdGVyPVwiY2FwdHVyZVwiPkNhcHR1cmVzPC9hPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLmV2ZW50RmlsdGVyID09PSAnYWxsJykgPyAnYWN0aXZlJzogbnVsbH0+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRFdmVudH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0ge1xyXG5cdGV2ZW50RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoW1xyXG5cdFx0J2FsbCcsXHJcblx0XHQnY2FwdHVyZScsXHJcblx0XHQnY2xhaW0nLFxyXG5cdF0pLmlzUmVxdWlyZWQsXHJcblx0c2V0RXZlbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBGaWx0ZXJzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBFbnRyeSA9IHJlcXVpcmUoJy4vRW50cnknKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTG9nRW50cmllcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHJcblx0XHRjb25zdCBuZXdUcmlnZ2VyU3RhdGUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudHJpZ2dlck5vdGlmaWNhdGlvbiwgbmV4dFByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cdFx0Y29uc3QgbmV3RmlsdGVyU3RhdGUgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWFwRmlsdGVyLCBuZXh0UHJvcHMubWFwRmlsdGVyKSB8fCAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZXZlbnRGaWx0ZXIsIG5leHRQcm9wcy5ldmVudEZpbHRlcik7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRuZXdMYW5nXHJcblx0XHRcdHx8IG5ld0d1aWxkc1xyXG5cdFx0XHR8fCBuZXdUcmlnZ2VyU3RhdGVcclxuXHRcdFx0fHwgbmV3RmlsdGVyU3RhdGVcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMb2dFbnRyaWVzOjpyZW5kZXIoKScsIHByb3BzLm1hcEZpbHRlciwgcHJvcHMuZXZlbnRGaWx0ZXIsIHByb3BzLnRyaWdnZXJOb3RpZmljYXRpb24pO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBpZD1cImxvZ1wiPlxyXG5cdFx0XHRcdHtwcm9wcy5ldmVudEhpc3RvcnkubWFwKGVudHJ5ID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGV2ZW50VHlwZSA9IGVudHJ5LmdldCgndHlwZScpO1xyXG5cdFx0XHRcdFx0Y29uc3QgZW50cnlJZCA9IGVudHJ5LmdldCgnaWQnKTtcclxuXHRcdFx0XHRcdGxldCBndWlsZElkLCBndWlsZDtcclxuXHJcblx0XHRcdFx0XHRpZiAoZXZlbnRUeXBlID09PSAnY2xhaW0nKSB7XHJcblx0XHRcdFx0XHRcdGd1aWxkSWQgPSBlbnRyeS5nZXQoJ2d1aWxkJyk7XHJcblx0XHRcdFx0XHRcdGd1aWxkID0gKHByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCkpXHJcblx0XHRcdFx0XHRcdFx0PyBwcm9wcy5ndWlsZHMuZ2V0KGd1aWxkSWQpXHJcblx0XHRcdFx0XHRcdFx0OiBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gPEVudHJ5XHJcblx0XHRcdFx0XHRcdGtleT17ZW50cnlJZH1cclxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PSdsaSdcclxuXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb249e3Byb3BzLnRyaWdnZXJOb3RpZmljYXRpb259XHJcblx0XHRcdFx0XHRcdG1hcEZpbHRlcj17cHJvcHMubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRldmVudEZpbHRlcj17cHJvcHMuZXZlbnRGaWx0ZXJ9XHJcblxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cclxuXHRcdFx0XHRcdFx0Z3VpbGRJZD17Z3VpbGRJZH1cclxuXHRcdFx0XHRcdFx0ZW50cnk9e2VudHJ5fVxyXG5cdFx0XHRcdFx0XHRndWlsZD17Z3VpbGR9XHJcblx0XHRcdFx0XHQvPjtcclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG5cdC8vIFx0JChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSlcclxuXHQvLyBcdFx0LmNoaWxkcmVuKCdsaScpXHJcblx0Ly8gXHRcdFx0LmZpbHRlcignLnNob3ctZW50cnknKVxyXG5cdC8vIFx0XHRcdFx0LmVhY2goKGl4Um93LCBlbCkgPT4gKGl4Um93ICUgMikgPyAkKGVsKS5hZGRDbGFzcygndG8tYWx0JykgOiBudWxsKVxyXG5cdC8vIFx0XHRcdC5lbmQoKVxyXG5cdC8vIFx0XHRcdC5maWx0ZXIoJy5hbHQ6bm90KC50by1hbHQpJylcclxuXHQvLyBcdFx0XHRcdC5yZW1vdmVDbGFzcygnYWx0JylcclxuXHQvLyBcdFx0XHQuZW5kKClcclxuXHQvLyBcdFx0XHQuZmlsdGVyKCcudG8tYWx0JylcclxuXHQvLyBcdFx0XHRcdC5hZGRDbGFzcygnYWx0JylcclxuXHQvLyBcdFx0XHRcdC5yZW1vdmVDbGFzcygndG8tYWx0JylcclxuXHQvLyBcdFx0XHQuZW5kKClcclxuXHQvLyBcdFx0LmVuZCgpO1xyXG5cdC8vIH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Mb2dFbnRyaWVzLmRlZmF1bHRQcm9wcyA9IHtcclxuXHRndWlsZHM6IHt9LFxyXG59O1xyXG5cclxuTG9nRW50cmllcy5wcm9wVHlwZXMgPSB7XHJcblx0bGFuZzogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRndWlsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdHRyaWdnZXJOb3RpZmljYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0bWFwRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0ZXZlbnRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZ0VudHJpZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBNYXBGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMucHJvcHMubWFwRmlsdGVyICE9PSBuZXh0UHJvcHMubWFwRmlsdGVyKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBpZD1cImxvZy1tYXAtZmlsdGVyc1wiIGNsYXNzTmFtZT1cIm5hdiBuYXYtcGlsbHNcIj5cclxuXHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT17KHByb3BzLm1hcEZpbHRlciA9PT0gJ2FsbCcpID8gJ2FjdGl2ZSc6ICdudWxsJ30+XHJcblx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9XCJhbGxcIj5BbGw8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHJcblx0XHRcdFx0e18ubWFwKFNUQVRJQy5vYmplY3RpdmVfbWFwLCBtYXBNZXRhID0+XHJcblx0XHRcdFx0XHQ8bGkga2V5PXttYXBNZXRhLm1hcEluZGV4fSBjbGFzc05hbWU9eyhwcm9wcy5tYXBGaWx0ZXIgPT09IG1hcE1ldGEuY29sb3IpID8gJ2FjdGl2ZSc6IG51bGx9PlxyXG5cdFx0XHRcdFx0XHQ8YSBvbkNsaWNrPXtwcm9wcy5zZXRXb3JsZH0gZGF0YS1maWx0ZXI9e21hcE1ldGEuY29sb3J9PnttYXBNZXRhLmFiYnJ9PC9hPlxyXG5cdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQpfVxyXG5cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcEZpbHRlcnMucHJvcFR5cGVzID0ge1xyXG5cdG1hcEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdHNldFdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRmlsdGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwRmlsdGVycyA9IHJlcXVpcmUoJy4vTWFwRmlsdGVycycpO1xyXG5jb25zdCBFdmVudEZpbHRlcnMgPSByZXF1aXJlKCcuL0V2ZW50RmlsdGVycycpO1xyXG5jb25zdCBMb2dFbnRyaWVzID0gcmVxdWlyZSgnLi9Mb2dFbnRyaWVzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRtYXBGaWx0ZXI6ICdhbGwnLFxyXG5cdFx0XHRldmVudEZpbHRlcjogJ2FsbCcsXHJcblx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb246IGZhbHNlLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZHMsIG5leHRQcm9wcy5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3SGlzdG9yeSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpLCBuZXh0UHJvcHMuZGV0YWlscy5nZXQoJ2hpc3RvcnknKSk7XHJcblxyXG5cdFx0Y29uc3QgbmV3TWFwRmlsdGVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnN0YXRlLm1hcEZpbHRlciwgbmV4dFN0YXRlLm1hcEZpbHRlcik7XHJcblx0XHRjb25zdCBuZXdFdmVudEZpbHRlciA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5ldmVudEZpbHRlciwgbmV4dFN0YXRlLmV2ZW50RmlsdGVyKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAoXHJcblx0XHRcdG5ld0xhbmdcclxuXHRcdFx0fHwgbmV3R3VpbGRzXHJcblx0XHRcdHx8IG5ld0hpc3RvcnlcclxuXHRcdFx0fHwgbmV3TWFwRmlsdGVyXHJcblx0XHRcdHx8IG5ld0V2ZW50RmlsdGVyXHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7dHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcblx0XHRpZiAoIXRoaXMuc3RhdGUudHJpZ2dlck5vdGlmaWNhdGlvbikge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHt0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ0xvZzo6cmVuZGVyKCknLCBzdGF0ZS5tYXBGaWx0ZXIsIHN0YXRlLmV2ZW50RmlsdGVyLCBzdGF0ZS50cmlnZ2VyTm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRjb25zdCBldmVudEhpc3RvcnkgPSBwcm9wcy5kZXRhaWxzLmdldCgnaGlzdG9yeScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9XCJsb2ctY29udGFpbmVyXCI+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibG9nLXRhYnNcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTE2XCI+XHJcblx0XHRcdFx0XHRcdFx0PE1hcEZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRcdG1hcEZpbHRlcj17c3RhdGUubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRcdFx0c2V0V29ybGQ9e3NldFdvcmxkLmJpbmQoY29tcG9uZW50KX1cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxFdmVudEZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50RmlsdGVyPXtzdGF0ZS5ldmVudEZpbHRlcn1cclxuXHRcdFx0XHRcdFx0XHRcdHNldEV2ZW50PXtzZXRFdmVudC5iaW5kKGNvbXBvbmVudCl9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0eyFldmVudEhpc3RvcnkuaXNFbXB0eSgpXHJcblx0XHRcdFx0XHQ/IDxMb2dFbnRyaWVzXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJOb3RpZmljYXRpb249e3N0YXRlLnRyaWdnZXJOb3RpZmljYXRpb259XHJcblx0XHRcdFx0XHRcdG1hcEZpbHRlcj17c3RhdGUubWFwRmlsdGVyfVxyXG5cdFx0XHRcdFx0XHRldmVudEZpbHRlcj17c3RhdGUuZXZlbnRGaWx0ZXJ9XHJcblxyXG5cdFx0XHRcdFx0XHRsYW5nPXtwcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRndWlsZHM9e3Byb3BzLmd1aWxkc31cclxuXHJcblx0XHRcdFx0XHRcdGV2ZW50SGlzdG9yeT17ZXZlbnRIaXN0b3J5fVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdDogbnVsbFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTG9nLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHNldFdvcmxkKGUpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0bGV0IGZpbHRlciA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcclxuXHJcblx0Y29tcG9uZW50LnNldFN0YXRlKHttYXBGaWx0ZXI6IGZpbHRlciwgdHJpZ2dlck5vdGlmaWNhdGlvbjogdHJ1ZX0pO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldEV2ZW50KGUpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0bGV0IGZpbHRlciA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcclxuXHJcblx0Y29tcG9uZW50LnNldFN0YXRlKHtldmVudEZpbHRlcjogZmlsdGVyLCB0cmlnZ2VyTm90aWZpY2F0aW9uOiB0cnVlfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgTWFwU2NvcmVzID0gcmVxdWlyZSgnLi9NYXBTY29yZXMnKTtcclxuY29uc3QgTWFwU2VjdGlvbiA9IHJlcXVpcmUoJy4vTWFwU2VjdGlvbicpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwRGV0YWlscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0RldGFpbHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cdFx0Y29uc3QgbmV3V29ybGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLm1hdGNoV29ybGRzLCBuZXh0UHJvcHMubWF0Y2hXb3JsZHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzIHx8IG5ld1dvcmxkcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgbWFwTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdrZXknKSA9PT0gdGhpcy5wcm9wcy5tYXBLZXkpO1xyXG5cdFx0Y29uc3QgbWFwSW5kZXggPSBtYXBNZXRhLmdldCgnbWFwSW5kZXgnKS50b1N0cmluZygpO1xyXG5cclxuXHRcdGNvbnN0IG1hcFNjb3JlcyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ21hcHMnLCAnc2NvcmVzJywgbWFwSW5kZXhdKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6TWFwczo6TWFwRGV0YWlsczpyZW5kZXIoKScsIG1hcFNjb3Jlcy50b0pTKCkpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWFwXCI+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWFwU2NvcmVzXCI+XHJcblx0XHRcdFx0XHQ8aDIgY2xhc3NOYW1lPXsndGVhbSAnICsgbWFwTWV0YS5nZXQoJ2NvbG9yJyl9IG9uQ2xpY2s9e29uVGl0bGVDbGlja30+XHJcblx0XHRcdFx0XHRcdHttYXBNZXRhLmdldCgnbmFtZScpfVxyXG5cdFx0XHRcdFx0PC9oMj5cclxuXHRcdFx0XHRcdDxNYXBTY29yZXMgc2NvcmVzPXttYXBTY29yZXN9IC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHR7bWFwTWV0YS5nZXQoJ3NlY3Rpb25zJykubWFwKChtYXBTZWN0aW9uLCBpeFNlY3Rpb24pID0+IHtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0PE1hcFNlY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRcdGNvbXBvbmVudD1cInVsXCJcclxuXHRcdFx0XHRcdFx0XHRcdGtleT17aXhTZWN0aW9ufVxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwU2VjdGlvbj17bWFwU2VjdGlvbn1cclxuXHRcdFx0XHRcdFx0XHRcdG1hcE1ldGE9e21hcE1ldGF9XHJcblx0XHRcdFx0XHRcdFx0XHR7Li4udGhpcy5wcm9wc31cclxuXHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSl9XHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBEZXRhaWxzLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGRldGFpbHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0bWF0Y2hXb3JsZHM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG5cdGd1aWxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcERldGFpbHM7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gb25UaXRsZUNsaWNrKGUpIHtcclxuXHRsZXQgJG1hcHMgPSAkKCcubWFwJyk7XHJcblx0bGV0ICRtYXAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWFwJywgJG1hcHMpO1xyXG5cclxuXHRsZXQgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG5cdGlmKCFoYXNGb2N1cykge1xyXG5cdFx0JG1hcFxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWJsdXInKTtcclxuXHJcblx0XHQkbWFwcy5ub3QoJG1hcClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0JG1hcHNcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcFNjb3JlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3U2NvcmVzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnNjb3JlcywgbmV4dFByb3BzLnNjb3Jlcyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1Njb3Jlcyk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJsaXN0LWlubGluZVwiPlxyXG5cdFx0XHRcdHtwcm9wcy5zY29yZXMubWFwKChzY29yZSwgaXhTY29yZSkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgZm9ybWF0dGVkID0gbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKTtcclxuXHRcdFx0XHRcdGNvbnN0IHRlYW0gPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ11baXhTY29yZV07XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIDxsaSBrZXk9e3RlYW19IGNsYXNzTmFtZT17YHRlYW0gJHt0ZWFtfWB9PlxyXG5cdFx0XHRcdFx0XHR7Zm9ybWF0dGVkfVxyXG5cdFx0XHRcdFx0PC9saT47XHJcblx0XHRcdFx0fSl9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBTY29yZXMucHJvcFR5cGVzID0ge1xyXG5cdHNjb3JlczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBTY29yZXM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IE9iamVjdGl2ZSA9IHJlcXVpcmUoJ1RyYWNrZXIvT2JqZWN0aXZlcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3Qgb2JqZWN0aXZlQ29scyA9IHtcclxuXHRlbGFwc2VkOiBmYWxzZSxcclxuXHR0aW1lc3RhbXA6IGZhbHNlLFxyXG5cdG1hcEFiYnJldjogZmFsc2UsXHJcblx0YXJyb3c6IHRydWUsXHJcblx0c3ByaXRlOiB0cnVlLFxyXG5cdG5hbWU6IHRydWUsXHJcblx0ZXZlbnRUeXBlOiBmYWxzZSxcclxuXHRndWlsZE5hbWU6IGZhbHNlLFxyXG5cdGd1aWxkVGFnOiB0cnVlLFxyXG5cdHRpbWVyOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwU2VjdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdHdWlsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGRzLCBuZXh0UHJvcHMuZ3VpbGRzKTtcclxuXHRcdGNvbnN0IG5ld0RldGFpbHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZGV0YWlscywgbmV4dFByb3BzLmRldGFpbHMpO1xyXG5cclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nIHx8IG5ld0d1aWxkcyB8fCBuZXdEZXRhaWxzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgbWFwT2JqZWN0aXZlcyA9IHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ29iamVjdGl2ZXMnKTtcclxuXHRcdGNvbnN0IG93bmVycyA9IHRoaXMucHJvcHMuZGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnb3duZXJzJ10pO1xyXG5cdFx0Y29uc3QgY2xhaW1lcnMgPSB0aGlzLnByb3BzLmRldGFpbHMuZ2V0SW4oWydvYmplY3RpdmVzJywgJ2NsYWltZXJzJ10pO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpNYXBzOjpNYXBTZWN0aW9uOnJlbmRlcigpJywgbWFwT2JqZWN0aXZlcywgbWFwT2JqZWN0aXZlcy50b0pTKCkpO1xyXG5cclxuXHJcblx0XHRjb25zdCBzZWN0aW9uQ2xhc3MgPSBnZXRTZWN0aW9uQ2xhc3ModGhpcy5wcm9wcy5tYXBNZXRhLmdldCgna2V5JyksIHRoaXMucHJvcHMubWFwU2VjdGlvbi5nZXQoJ2xhYmVsJykpO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPXtgbGlzdC11bnN0eWxlZCAke3NlY3Rpb25DbGFzc31gfT5cclxuXHRcdFx0XHR7bWFwT2JqZWN0aXZlcy5tYXAob2JqZWN0aXZlSWQgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3Qgb3duZXIgPSBvd25lcnMuZ2V0KG9iamVjdGl2ZUlkLnRvU3RyaW5nKCkpO1xyXG5cdFx0XHRcdFx0Y29uc3QgY2xhaW1lciA9IGNsYWltZXJzLmdldChvYmplY3RpdmVJZC50b1N0cmluZygpKTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBndWlsZElkID0gKGNsYWltZXIpID8gY2xhaW1lci5ndWlsZCA6IG51bGw7XHJcblx0XHRcdFx0XHRjb25zdCBoYXNDbGFpbWVyID0gISFndWlsZElkO1xyXG5cdFx0XHRcdFx0Y29uc3QgaGFzR3VpbGREYXRhID0gaGFzQ2xhaW1lciAmJiB0aGlzLnByb3BzLmd1aWxkcy5oYXMoZ3VpbGRJZCk7XHJcblx0XHRcdFx0XHRjb25zdCBndWlsZCA9IGhhc0d1aWxkRGF0YSA/IHRoaXMucHJvcHMuZ3VpbGRzLmdldChndWlsZElkKSA6IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0PGxpIGtleT17b2JqZWN0aXZlSWR9IGlkPXsnb2JqZWN0aXZlLScgKyBvYmplY3RpdmVJZH0+XHJcblx0XHRcdFx0XHRcdFx0PE9iamVjdGl2ZVxyXG5cdFx0XHRcdFx0XHRcdFx0bGFuZz17dGhpcy5wcm9wcy5sYW5nfVxyXG5cdFx0XHRcdFx0XHRcdFx0Y29scz17b2JqZWN0aXZlQ29sc31cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmVJZD17b2JqZWN0aXZlSWR9XHJcblx0XHRcdFx0XHRcdFx0XHR3b3JsZENvbG9yPXtvd25lci5nZXQoJ3dvcmxkJyl9XHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA9e293bmVyLmdldCgndGltZXN0YW1wJyl9XHJcblx0XHRcdFx0XHRcdFx0XHRndWlsZElkPXtndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGQ9e2d1aWxkfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHR9KX1cclxuXHRcdFx0PC91bD5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcFNlY3Rpb24ucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuXHRtYXBTZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwU2VjdGlvbjtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlY3Rpb25DbGFzcyhtYXBLZXksIHNlY3Rpb25MYWJlbCkge1xyXG5cdGxldCBzZWN0aW9uQ2xhc3MgPSBbXHJcblx0XHQnY29sLW1kLTI0JyxcclxuXHRcdCdtYXAtc2VjdGlvbicsXHJcblx0XTtcclxuXHJcblx0aWYgKG1hcEtleSA9PT0gJ0NlbnRlcicpIHtcclxuXHRcdGlmIChzZWN0aW9uTGFiZWwgPT09ICdDYXN0bGUnKSB7XHJcblx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tMjQnKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWN0aW9uQ2xhc3Muam9pbignICcpO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBNYXBEZXRhaWxzID0gcmVxdWlyZSgnLi9NYXBEZXRhaWxzJyk7XHJcbmNvbnN0IExvZyA9IHJlcXVpcmUoJ1RyYWNrZXIvTG9nJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0xhbmcgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubGFuZywgbmV4dFByb3BzLmxhbmcpO1xyXG5cdFx0Y29uc3QgbmV3R3VpbGRzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkcywgbmV4dFByb3BzLmd1aWxkcyk7XHJcblx0XHRjb25zdCBuZXdEZXRhaWxzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmRldGFpbHMsIG5leHRQcm9wcy5kZXRhaWxzKTtcclxuXHRcdGNvbnN0IG5ld1dvcmxkcyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5tYXRjaFdvcmxkcywgbmV4dFByb3BzLm1hdGNoV29ybGRzKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdHdWlsZHMgfHwgbmV3RGV0YWlscyB8fCBuZXdXb3JsZHMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRjb25zdCBpc0RhdGFJbml0aWFsaXplZCA9IHByb3BzLmRldGFpbHMuZ2V0KCdpbml0aWFsaXplZCcpO1xyXG5cclxuXHRcdGlmICghaXNEYXRhSW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGlkPVwibWFwc1wiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNlwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJDZW50ZXJcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTE4XCI+XHJcblxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLThcIj57PE1hcERldGFpbHMgbWFwS2V5PVwiUmVkSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJCbHVlSG9tZVwiIHsuLi5wcm9wc30gLz59PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPns8TWFwRGV0YWlscyBtYXBLZXk9XCJHcmVlbkhvbWVcIiB7Li4ucHJvcHN9IC8+fTwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxMb2cgey4uLnByb3BzfSAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQgPC9kaXY+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbk1hcHMucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0ZGV0YWlsczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaFdvcmxkczogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXHJcblx0Z3VpbGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcbmNvbnN0IEVtYmxlbSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy9FbWJsZW0nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEd1aWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdHdWlsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZElkLCBuZXh0UHJvcHMuZ3VpbGRJZCk7XHJcblx0XHRjb25zdCBuZXdHdWlsZERhdGEgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuZ3VpbGQsIG5leHRQcm9wcy5ndWlsZCk7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGQgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3QgaGFzR3VpbGQgPSAhIXRoaXMucHJvcHMuZ3VpbGRJZDtcclxuXHRcdGNvbnN0IGlzRW5hYmxlZCA9IGhhc0d1aWxkICYmICh0aGlzLnByb3BzLnNob3dOYW1lIHx8IHRoaXMucHJvcHMuc2hvd1RhZyk7XHJcblxyXG5cdFx0aWYgKCFpc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgaGFzR3VpbGREYXRhID0gcHJvcHMuZ3VpbGQgJiYgcHJvcHMuZ3VpbGQuZ2V0KCdsb2FkZWQnKTtcclxuXHRcdFx0Y29uc3QgaWQgPSBwcm9wcy5ndWlsZElkO1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ0d1aWxkOnJlbmRlcigpJywgaWQpO1xyXG5cclxuXHRcdFx0Y29uc3QgaHJlZiA9IGAjJHtpZH1gO1xyXG5cclxuXHRcdFx0bGV0IGNvbnRlbnQgPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+O1xyXG5cdFx0XHRsZXQgdGl0bGUgPSBudWxsO1xyXG5cclxuXHRcdFx0aWYgKGhhc0d1aWxkRGF0YSkge1xyXG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBwcm9wcy5ndWlsZC5nZXQoJ2d1aWxkX25hbWUnKTtcclxuXHRcdFx0XHRjb25zdCB0YWcgPSBwcm9wcy5ndWlsZC5nZXQoJ3RhZycpO1xyXG5cclxuXHRcdFx0XHRpZiAocHJvcHMuc2hvd05hbWUgJiYgcHJvcHMuc2hvd1RhZykge1xyXG5cdFx0XHRcdFx0Y29udGVudCA9IDxzcGFuPlxyXG5cdFx0XHRcdFx0XHR7YCR7bmFtZX0gWyR7dGFnfV0gYH1cclxuXHRcdFx0XHRcdFx0PEVtYmxlbSBndWlsZE5hbWU9e25hbWV9IHNpemU9ezIwfSAvPlxyXG5cdFx0XHRcdFx0PC9zcGFuPjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAocHJvcHMuc2hvd05hbWUpIHtcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSBgJHtuYW1lfWA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29udGVudCA9IGAke3RhZ31gO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGl0bGUgPSBgJHtuYW1lfSBbJHt0YWd9XWA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiA8YSBjbGFzc05hbWU9XCJndWlsZG5hbWVcIiBocmVmPXtocmVmfSB0aXRsZT17dGl0bGV9PlxyXG5cdFx0XHRcdHtjb250ZW50fVxyXG5cdFx0XHQ8L2E+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5HdWlsZC5wcm9wVHlwZXMgPSB7XHJcblx0c2hvd05hbWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0c2hvd1RhZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRndWlsZElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdGd1aWxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEd1aWxkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBTcHJpdGUgPSByZXF1aXJlKCdjb21tb24vSWNvbnMvU3ByaXRlJyk7XHJcbmNvbnN0IEFycm93ID0gcmVxdWlyZSgnY29tbW9uL0ljb25zL0Fycm93Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBJY29ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3Q29sb3IgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMuY29sb3IsIG5leHRQcm9wcy5jb2xvcik7XHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3Q29sb3IpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5zaG93QXJyb3cgJiYgIXRoaXMucHJvcHMuc2hvd1Nwcml0ZSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblx0XHRcdGNvbnN0IG9iamVjdGl2ZVR5cGVJZCA9IG9NZXRhLmdldCgndHlwZScpLnRvU3RyaW5nKCk7XHJcblx0XHRcdGNvbnN0IG9UeXBlID0gU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQob2JqZWN0aXZlVHlwZUlkKTtcclxuXHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1pY29uc1wiPlxyXG5cdFx0XHRcdHsodGhpcy5wcm9wcy5zaG93QXJyb3cpID9cclxuXHRcdFx0XHRcdDxBcnJvdyBvTWV0YT17b01ldGF9IC8+XHJcblx0XHRcdFx0OiBudWxsfVxyXG5cclxuXHRcdFx0XHR7KHRoaXMucHJvcHMuc2hvd1Nwcml0ZSkgP1xyXG5cdFx0XHRcdFx0PFNwcml0ZVxyXG5cdFx0XHRcdFx0XHR0eXBlPXtvVHlwZS5nZXQoJ25hbWUnKX1cclxuXHRcdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMuY29sb3J9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdDogbnVsbH1cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5JY29ucy5wcm9wVHlwZXMgPSB7XHJcblx0c2hvd0Fycm93OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cdHNob3dTcHJpdGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWNvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcbmNvbnN0IFNUQVRJQyA9IHJlcXVpcmUoJ2xpYi9zdGF0aWMnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExhYmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdMYW5nKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNFbmFibGVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IG9MYWJlbCA9IFNUQVRJQy5vYmplY3RpdmVfbGFiZWxzLmdldCh0aGlzLnByb3BzLm9iamVjdGl2ZUlkKTtcclxuXHRcdFx0Y29uc3QgbGFuZ1NsdWcgPSB0aGlzLnByb3BzLmxhbmcuZ2V0KCdzbHVnJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbGFiZWxcIj5cclxuXHRcdFx0XHQ8c3Bhbj57b0xhYmVsLmdldChsYW5nU2x1Zyl9PC9zcGFuPlxyXG5cdFx0XHQ8L2Rpdj47XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcbkxhYmVsLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdGlzRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuXHRvYmplY3RpdmVJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTWFwTmFtZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Ly8gbWFwIG5hbWUgY2FuIG5ldmVyIGNoYW5nZSwgbm90IGxvY2FsaXplZFxyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZSgpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQodGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblx0XHRcdGNvbnN0IG1hcEluZGV4ID0gb01ldGEuZ2V0KCdtYXAnKTtcclxuXHRcdFx0Y29uc3QgbWFwTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWFwLmZpbmQobW0gPT4gbW0uZ2V0KCdtYXBJbmRleCcpID09PSBtYXBJbmRleCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtbWFwXCI+XHJcblx0XHRcdFx0PHNwYW4gdGl0bGU9e21hcE1ldGEuZ2V0KCduYW1lJyl9PnttYXBNZXRhLmdldCgnYWJicicpfTwvc3Bhbj5cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5NYXBOYW1lLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0b2JqZWN0aXZlSWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcE5hbWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lQ291bnRkb3duIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgZXhwaXJlcyA9IHRoaXMucHJvcHMudGltZXN0YW1wICsgKDUgKiA2MCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSd0aW1lciBjb3VudGRvd24gaW5hY3RpdmUnIGRhdGEtZXhwaXJlcz17ZXhwaXJlc30+XHJcblx0XHRcdFx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG5cdFx0XHQ8L3NwYW4+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UaW1lQ291bnRkb3duLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lQ291bnRkb3duO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lclJlbGF0aXZlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUaW1lc3RhbXAgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMudGltZXN0YW1wLCBuZXh0UHJvcHMudGltZXN0YW1wKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdUaW1lc3RhbXApO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5pc0VuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2JqZWN0aXZlLXJlbGF0aXZlXCI+XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidGltZXIgcmVsYXRpdmVcIiBkYXRhLXRpbWVzdGFtcD17dGhpcy5wcm9wcy50aW1lc3RhbXB9PlxyXG5cdFx0XHRcdFx0e21vbWVudCh0aGlzLnByb3BzLnRpbWVzdGFtcCAqIDEwMDApLnR3aXR0ZXJTaG9ydCgpfVxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0PC9kaXY+O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UaW1lclJlbGF0aXZlLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lclJlbGF0aXZlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBUaW1lc3RhbXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld1RpbWVzdGFtcCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy50aW1lc3RhbXAsIG5leHRQcm9wcy50aW1lc3RhbXApO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1RpbWVzdGFtcCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCB0aW1lc3RhbXBIdG1sID0gbW9tZW50KCh0aGlzLnByb3BzLnRpbWVzdGFtcCkgKiAxMDAwKS5mb3JtYXQoJ2hoOm1tOnNzJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJvYmplY3RpdmUtdGltZXN0YW1wXCI+XHJcblx0XHRcdFx0e3RpbWVzdGFtcEh0bWx9XHJcblx0XHRcdDwvZGl2PjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuVGltZXN0YW1wLnByb3BUeXBlcyA9IHtcclxuXHRpc0VuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblx0dGltZXN0YW1wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lc3RhbXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFRpbWVyUmVsYXRpdmUgPSByZXF1aXJlKCcuL1RpbWVyUmVsYXRpdmUnKTtcclxuY29uc3QgVGltZXN0YW1wID0gcmVxdWlyZSgnLi9UaW1lc3RhbXAnKTtcclxuY29uc3QgTWFwTmFtZSA9IHJlcXVpcmUoJy4vTWFwTmFtZScpO1xyXG5jb25zdCBJY29ucyA9IHJlcXVpcmUoJy4vSWNvbnMnKTtcclxuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuL0xhYmVsJyk7XHJcbmNvbnN0IEd1aWxkID0gcmVxdWlyZSgnLi9HdWlsZCcpO1xyXG5jb25zdCBUaW1lckNvdW50ZG93biA9IHJlcXVpcmUoJy4vVGltZXJDb3VudGRvd24nKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1vZHVsZSBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGNvbERlZmF1bHRzID0ge1xyXG5cdGVsYXBzZWQ6IGZhbHNlLFxyXG5cdHRpbWVzdGFtcDogZmFsc2UsXHJcblx0bWFwQWJicmV2OiBmYWxzZSxcclxuXHRhcnJvdzogZmFsc2UsXHJcblx0c3ByaXRlOiBmYWxzZSxcclxuXHRuYW1lOiBmYWxzZSxcclxuXHRldmVudFR5cGU6IGZhbHNlLFxyXG5cdGd1aWxkTmFtZTogZmFsc2UsXHJcblx0Z3VpbGRUYWc6IGZhbHNlLFxyXG5cdHRpbWVyOiBmYWxzZSxcclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIE9iamVjdGl2ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHRjb25zdCBuZXdDYXB0dXJlID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLnRpbWVzdGFtcCwgbmV4dFByb3BzLnRpbWVzdGFtcCk7XHJcblx0XHRjb25zdCBuZXdPd25lciA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZENvbG9yLCBuZXh0UHJvcHMud29ybGRDb2xvcik7XHJcblx0XHRjb25zdCBuZXdDbGFpbWVyID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmd1aWxkSWQsIG5leHRQcm9wcy5ndWlsZElkKTtcclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5ndWlsZCwgbmV4dFByb3BzLmd1aWxkKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3TGFuZyB8fCBuZXdDYXB0dXJlIHx8IG5ld093bmVyIHx8IG5ld0NsYWltZXIgfHwgbmV3R3VpbGREYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnT2JqZWN0aXZlOnJlbmRlcigpJywgdGhpcy5wcm9wcy5vYmplY3RpdmVJZCk7XHJcblxyXG5cdFx0Y29uc3Qgb2JqZWN0aXZlSWQgPSB0aGlzLnByb3BzLm9iamVjdGl2ZUlkLnRvU3RyaW5nKCk7XHJcblx0XHRjb25zdCBvTWV0YSA9IFNUQVRJQy5vYmplY3RpdmVfbWV0YS5nZXQob2JqZWN0aXZlSWQpO1xyXG5cclxuXHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdGlmIChvTWV0YS5pc0VtcHR5KCkpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgY29scyA9IF8uZGVmYXVsdHModGhpcy5wcm9wcy5jb2xzLCBjb2xEZWZhdWx0cyk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtgb2JqZWN0aXZlIHRlYW0gJHt0aGlzLnByb3BzLndvcmxkQ29sb3J9YH0+XHJcblx0XHRcdFx0PFRpbWVyUmVsYXRpdmUgaXNFbmFibGVkPXshIWNvbHMuZWxhcHNlZH0gdGltZXN0YW1wPXtwcm9wcy50aW1lc3RhbXB9IC8+XHJcblx0XHRcdFx0PFRpbWVzdGFtcCBpc0VuYWJsZWQ9eyEhY29scy50aW1lc3RhbXB9IHRpbWVzdGFtcD17cHJvcHMudGltZXN0YW1wfSAvPlxyXG5cdFx0XHRcdDxNYXBOYW1lIGlzRW5hYmxlZD17ISFjb2xzLm1hcEFiYnJldn0gb2JqZWN0aXZlSWQ9e29iamVjdGl2ZUlkfSAvPlxyXG5cclxuXHRcdFx0XHQ8SWNvbnNcclxuXHRcdFx0XHRcdHNob3dBcnJvdz17ISFjb2xzLmFycm93fVxyXG5cdFx0XHRcdFx0c2hvd1Nwcml0ZT17ISFjb2xzLnNwcml0ZX1cclxuXHRcdFx0XHRcdG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH1cclxuXHRcdFx0XHRcdGNvbG9yPXt0aGlzLnByb3BzLndvcmxkQ29sb3J9XHJcblx0XHRcdFx0Lz5cclxuXHJcblx0XHRcdFx0PExhYmVsIGlzRW5hYmxlZD17ISFjb2xzLm5hbWV9IG9iamVjdGl2ZUlkPXtvYmplY3RpdmVJZH0gbGFuZz17dGhpcy5wcm9wcy5sYW5nfSAvPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1zdGF0ZVwiPlxyXG5cdFx0XHRcdFx0PEd1aWxkXHJcblx0XHRcdFx0XHRcdHNob3dOYW1lPXtjb2xzLmd1aWxkTmFtZX1cclxuXHRcdFx0XHRcdFx0c2hvd1RhZz17Y29scy5ndWlsZFRhZ31cclxuXHRcdFx0XHRcdFx0Z3VpbGRJZD17dGhpcy5wcm9wcy5ndWlsZElkfVxyXG5cdFx0XHRcdFx0XHRndWlsZD17dGhpcy5wcm9wcy5ndWlsZH1cclxuXHRcdFx0XHRcdC8+XHJcblxyXG5cdFx0XHRcdFx0PFRpbWVyQ291bnRkb3duIGlzRW5hYmxlZD17ISFjb2xzLnRpbWVyfSB0aW1lc3RhbXA9e3Byb3BzLnRpbWVzdGFtcH0gLz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5PYmplY3RpdmUucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblxyXG5cdG9iamVjdGl2ZUlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0d29ybGRDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdHRpbWVzdGFtcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG5cdGV2ZW50VHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcblx0Z3VpbGRJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRndWlsZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCksXHJcblxyXG5cdGNvbHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3RpdmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFNwcml0ZSA9IHJlcXVpcmUoJ2NvbW1vbi9JY29ucy8vU3ByaXRlJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIEhvbGRpbmdzSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQocHJvcHMudHlwZUlkKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3UXVhbnRpdHkgPSAodGhpcy5wcm9wcy50eXBlUXVhbnRpdHkgIT09IG5leHRQcm9wcy50eXBlUXVhbnRpdHkpO1xyXG5cdFx0Y29uc3QgbmV3VHlwZSA9ICh0aGlzLnByb3BzLnR5cGVJZCAhPT0gbmV4dFByb3BzLnR5cGVJZCk7XHJcblx0XHRjb25zdCBuZXdDb2xvciA9ICh0aGlzLnByb3BzLmNvbG9yICE9PSBuZXh0UHJvcHMuY29sb3IpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1F1YW50aXR5IHx8IG5ld1R5cGUgfHwgbmV3Q29sb3IpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdUeXBlID0gKHRoaXMucHJvcHMudHlwZUlkICE9PSBuZXh0UHJvcHMudHlwZUlkKTtcclxuXHJcblx0XHRpZiAobmV3VHlwZSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtvVHlwZTogU1RBVElDLm9iamVjdGl2ZV90eXBlcy5nZXQodGhpcy5wcm9wcy50eXBlSWQpfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpTY29yZWJvYXJkOjpIb2xkaW5nc0l0ZW06cmVuZGVyKCknLCB0aGlzLnN0YXRlLm9UeXBlLnRvSlMoKSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpPlxyXG5cdFx0XHRcdDxTcHJpdGVcclxuXHRcdFx0XHRcdHR5cGU9e3RoaXMuc3RhdGUub1R5cGUuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHRjb2xvcj17dGhpcy5wcm9wcy5jb2xvcn1cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHRcdHtgIHgke3RoaXMucHJvcHMudHlwZVF1YW50aXR5fWB9XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Ib2xkaW5nc0l0ZW0ucHJvcFR5cGVzID0ge1xyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0dHlwZVF1YW50aXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0dHlwZUlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb2xkaW5nc0l0ZW07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgSG9sZGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IG5ld0hvbGRpbmdzID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmhvbGRpbmdzLCBuZXh0UHJvcHMuaG9sZGluZ3MpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld0hvbGRpbmdzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcblx0XHRcdHt0aGlzLnByb3BzLmhvbGRpbmdzLm1hcCgodHlwZVF1YW50aXR5LCB0eXBlSW5kZXgpID0+XHJcblx0XHRcdFx0PEl0ZW1cclxuXHRcdFx0XHRcdGtleT17dHlwZUluZGV4fVxyXG5cdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMuY29sb3J9XHJcblx0XHRcdFx0XHR0eXBlUXVhbnRpdHk9e3R5cGVRdWFudGl0eX1cclxuXHRcdFx0XHRcdHR5cGVJZD17KHR5cGVJbmRleCsxKS50b1N0cmluZygpfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdCl9XHJcblx0XHQ8L3VsPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuSG9sZGluZ3MucHJvcFR5cGVzID0ge1xyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblx0aG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9sZGluZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5jb25zdCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDb21wb25lbnQgR2xvYmFsc1xyXG4qL1xyXG5cclxuY29uc3QgbG9hZGluZ0h0bWwgPSA8aDEgc3R5bGU9e3toZWlnaHQ6ICc5MHB4JywgZm9udFNpemU6ICczMnB0JywgbGluZUhlaWdodDogJzkwcHgnfX0+XHJcblx0PGkgY2xhc3NOYW1lPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPlxyXG48L2gxPjtcclxuXHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgSG9sZGluZ3MgPSByZXF1aXJlKCcuL0hvbGRpbmdzJyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdXb3JsZCA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy53b3JsZCwgbmV4dFByb3BzLndvcmxkKTtcclxuXHRcdGNvbnN0IG5ld1Njb3JlID0gKHRoaXMucHJvcHMuc2NvcmUgIT09IG5leHRQcm9wcy5zY29yZSk7XHJcblx0XHRjb25zdCBuZXdUaWNrID0gKHRoaXMucHJvcHMudGljayAhPT0gbmV4dFByb3BzLnRpY2spO1xyXG5cdFx0Y29uc3QgbmV3SG9sZGluZ3MgPSAodGhpcy5wcm9wcy5ob2xkaW5ncyAhPT0gbmV4dFByb3BzLmhvbGRpbmdzKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdXb3JsZCB8fCBuZXdTY29yZSB8fCBuZXdUaWNrIHx8IG5ld0hvbGRpbmdzKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2BzY29yZWJvYXJkIHRlYW0tYmcgdGVhbSB0ZXh0LWNlbnRlciAke3RoaXMucHJvcHMud29ybGQuZ2V0KCdjb2xvcicpfWB9PlxyXG5cdFx0XHRcdFx0eyh0aGlzLnByb3BzLndvcmxkICYmIEltbXV0YWJsZS5NYXAuaXNNYXAodGhpcy5wcm9wcy53b3JsZCkpXHJcblx0XHRcdFx0XHRcdD8gIDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0PGgxPjxhIGhyZWY9e3RoaXMucHJvcHMud29ybGQuZ2V0KCdsaW5rJyl9PlxyXG5cdFx0XHRcdFx0XHRcdFx0e3RoaXMucHJvcHMud29ybGQuZ2V0KCduYW1lJyl9XHJcblx0XHRcdFx0XHRcdFx0PC9hPjwvaDE+XHJcblx0XHRcdFx0XHRcdFx0PGgyPlxyXG5cdFx0XHRcdFx0XHRcdFx0e251bWVyYWwodGhpcy5wcm9wcy5zY29yZSkuZm9ybWF0KCcwLDAnKX1cclxuXHRcdFx0XHRcdFx0XHRcdHsnICd9XHJcblx0XHRcdFx0XHRcdFx0XHR7bnVtZXJhbCh0aGlzLnByb3BzLnRpY2spLmZvcm1hdCgnKzAsMCcpfVxyXG5cdFx0XHRcdFx0XHRcdDwvaDI+XHJcblxyXG5cdFx0XHRcdFx0XHRcdDxIb2xkaW5nc1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I9e3RoaXMucHJvcHMud29ybGQuZ2V0KCdjb2xvcicpfVxyXG5cdFx0XHRcdFx0XHRcdFx0aG9sZGluZ3M9e3RoaXMucHJvcHMuaG9sZGluZ3N9XHJcblx0XHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDogbG9hZGluZ0h0bWxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5Xb3JsZC5wcm9wVHlwZXMgPSB7XHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0c2NvcmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuXHR0aWNrOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcblx0aG9sZGluZ3M6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFJlYWN0IENvbXBvbmVudHNcclxuKi9cclxuXHJcbmNvbnN0IFdvcmxkID0gcmVxdWlyZSgnLi9Xb3JsZCcpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBTY29yZWJvYXJkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdXb3JsZHMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2hXb3JsZHMsIG5leHRQcm9wcy5tYXRjaFdvcmxkcyk7XHJcblx0XHRjb25zdCBuZXdTY29yZXMgPSAhSW1tdXRhYmxlLmlzKHRoaXMucHJvcHMubWF0Y2guZ2V0KCdzY29yZXMnKSwgbmV4dFByb3BzLm1hdGNoLmdldCgnc2NvcmVzJykpO1xyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKG5ld1dvcmxkcyB8fCBuZXdTY29yZXMpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdTY29yZWJvYXJkOjpXb3JsZHM6OnJlbmRlcigpJyk7XHJcblxyXG5cdFx0Y29uc3Qgc2NvcmVzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ3Njb3JlcycpO1xyXG5cdFx0Y29uc3QgdGlja3MgPSB0aGlzLnByb3BzLm1hdGNoLmdldCgndGlja3MnKTtcclxuXHRcdGNvbnN0IGhvbGRpbmdzID0gdGhpcy5wcm9wcy5tYXRjaC5nZXQoJ2hvbGRpbmdzJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNlY3Rpb24gY2xhc3NOYW1lPVwicm93XCIgaWQ9XCJzY29yZWJvYXJkc1wiPlxyXG5cdFx0XHRcdHt0aGlzLnByb3BzLm1hdGNoV29ybGRzLnRvU2VxKCkubWFwKCh3b3JsZCwgaXhXb3JsZCkgPT5cclxuXHRcdFx0XHRcdDxXb3JsZFxyXG5cdFx0XHRcdFx0XHRrZXk9e2l4V29ybGR9XHJcblx0XHRcdFx0XHRcdHdvcmxkPXt3b3JsZH1cclxuXHRcdFx0XHRcdFx0c2NvcmU9e3Njb3Jlcy5nZXQoaXhXb3JsZCkgfHwgMH1cclxuXHRcdFx0XHRcdFx0dGljaz17dGlja3MuZ2V0KGl4V29ybGQpIHx8IDB9XHJcblx0XHRcdFx0XHRcdGhvbGRpbmdzPXtob2xkaW5ncy5nZXQoaXhXb3JsZCl9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNjb3JlYm9hcmQucHJvcFR5cGVzID0ge1xyXG5cdG1hdGNoV29ybGRzOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcclxuXHRtYXRjaDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcCkuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlYm9hcmQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGFwaSA9IHJlcXVpcmUoJ2xpYi9hcGkuanMnKTtcclxuY29uc3QgbGliRGF0ZSA9IHJlcXVpcmUoJ2xpYi9kYXRlLmpzJyk7XHJcbmNvbnN0IHRyYWNrZXJUaW1lcnMgPSByZXF1aXJlKCdsaWIvdHJhY2tlclRpbWVycycpO1xyXG5cclxuY29uc3QgR3VpbGRzTGliID0gcmVxdWlyZSgnbGliL3RyYWNrZXIvZ3VpbGRzLmpzJyk7XHJcblxyXG5jb25zdCBTVEFUSUMgPSByZXF1aXJlKCdsaWIvc3RhdGljJyk7XHJcblxyXG5cclxuLypcclxuKlx0UmVhY3QgQ29tcG9uZW50c1xyXG4qL1xyXG5cclxuY29uc3QgU2NvcmVib2FyZCA9IHJlcXVpcmUoJy4vU2NvcmVib2FyZCcpO1xyXG5jb25zdCBNYXBzID0gcmVxdWlyZSgnLi9NYXBzJyk7XHJcbmNvbnN0IEd1aWxkcyA9IHJlcXVpcmUoJy4vR3VpbGRzJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRXhwb3J0XHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0aGFzRGF0YTogZmFsc2UsXHJcblxyXG5cdFx0XHRkYXRlTm93OiBsaWJEYXRlLmRhdGVOb3coKSxcclxuXHRcdFx0bGFzdG1vZDogMCxcclxuXHRcdFx0dGltZU9mZnNldDogMCxcclxuXHJcblx0XHRcdG1hdGNoOiBJbW11dGFibGUuTWFwKHtsYXN0bW9kOjB9KSxcclxuXHRcdFx0bWF0Y2hXb3JsZHM6IEltbXV0YWJsZS5MaXN0KCksXHJcblx0XHRcdGRldGFpbHM6IEltbXV0YWJsZS5NYXAoKSxcclxuXHRcdFx0Y2xhaW1FdmVudHM6IEltbXV0YWJsZS5MaXN0KCksXHJcblx0XHRcdGd1aWxkczogSW1tdXRhYmxlLk1hcCgpLFxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmludGVydmFscyA9IHtcclxuXHRcdFx0dGltZXJzOiBudWxsXHJcblx0XHR9O1xyXG5cdFx0dGhpcy50aW1lb3V0cyA9IHtcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5ndWlsZExpYiA9IG5ldyBHdWlsZHNMaWIodGhpcyk7XHJcblx0fVxyXG5cclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcblx0XHRjb25zdCBpbml0aWFsRGF0YSA9ICFfLmlzRXF1YWwodGhpcy5zdGF0ZS5oYXNEYXRhLCBuZXh0U3RhdGUuaGFzRGF0YSk7XHJcblx0XHRjb25zdCBuZXdNYXRjaERhdGEgPSAhXy5pc0VxdWFsKHRoaXMuc3RhdGUubGFzdG1vZCwgbmV4dFN0YXRlLmxhc3Rtb2QpO1xyXG5cclxuXHRcdGNvbnN0IG5ld0d1aWxkRGF0YSA9ICFJbW11dGFibGUuaXModGhpcy5zdGF0ZS5ndWlsZHMsIG5leHRTdGF0ZS5ndWlsZHMpO1xyXG5cdFx0Y29uc3QgbmV3TGFuZyA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5sYW5nLCBuZXh0UHJvcHMubGFuZyk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvdWxkVXBkYXRlID0gKFxyXG5cdFx0XHRpbml0aWFsRGF0YVxyXG5cdFx0XHR8fCBuZXdNYXRjaERhdGFcclxuXHRcdFx0fHwgbmV3R3VpbGREYXRhXHJcblx0XHRcdHx8IG5ld0xhbmdcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHNob3VsZFVwZGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50RGlkTW91bnQoKScpO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxzLnRpbWVycyA9IHNldEludGVydmFsKHVwZGF0ZVRpbWVycy5iaW5kKHRoaXMpLCAxMDAwKTtcclxuXHRcdHNldEltbWVkaWF0ZSh1cGRhdGVUaW1lcnMuYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0c2V0SW1tZWRpYXRlKGdldE1hdGNoRGV0YWlscy5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVubW91bnQoKScpO1xyXG5cclxuXHRcdGNsZWFyVGltZXJzLmNhbGwodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5tb3VudGVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdMYW5nID0gIUltbXV0YWJsZS5pcyh0aGlzLnByb3BzLmxhbmcsIG5leHRQcm9wcy5sYW5nKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZygnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpJywgbmV3TGFuZyk7XHJcblxyXG5cdFx0aWYgKG5ld0xhbmcpIHtcclxuXHRcdFx0c2V0TWF0Y2hXb3JsZHMuY2FsbCh0aGlzLCBuZXh0UHJvcHMubGFuZyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XHJcblx0Ly8gXHRjb25zb2xlLmxvZygnVHJhY2tlcjo6Y29tcG9uZW50V2lsbFVwZGF0ZSgpJyk7XHJcblx0Ly8gfVxyXG5cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpyZW5kZXIoKScpO1xyXG5cdFx0c2V0UGFnZVRpdGxlKHRoaXMucHJvcHMubGFuZywgdGhpcy5wcm9wcy53b3JsZCk7XHJcblxyXG5cclxuXHRcdGlmICghdGhpcy5zdGF0ZS5oYXNEYXRhKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBpZD1cInRyYWNrZXJcIj5cclxuXHJcblx0XHRcdFx0ezxTY29yZWJvYXJkXHJcblx0XHRcdFx0XHRtYXRjaFdvcmxkcz17dGhpcy5zdGF0ZS5tYXRjaFdvcmxkc31cclxuXHRcdFx0XHRcdG1hdGNoPXt0aGlzLnN0YXRlLm1hdGNofVxyXG5cdFx0XHRcdC8+fVxyXG5cclxuXHRcdFx0XHR7PE1hcHNcclxuXHRcdFx0XHRcdGxhbmc9e3RoaXMucHJvcHMubGFuZ31cclxuXHRcdFx0XHRcdGRldGFpbHM9e3RoaXMuc3RhdGUuZGV0YWlsc31cclxuXHRcdFx0XHRcdG1hdGNoV29ybGRzPXt0aGlzLnN0YXRlLm1hdGNoV29ybGRzfVxyXG5cdFx0XHRcdFx0Z3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuXHRcdFx0XHQvPn1cclxuXHJcblx0XHRcdFx0ezxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yNFwiPlxyXG5cdFx0XHRcdFx0XHR7KCF0aGlzLnN0YXRlLmd1aWxkcy5pc0VtcHR5KCkpXHJcblx0XHRcdFx0XHRcdFx0PyA8R3VpbGRzXHJcblx0XHRcdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGRzPXt0aGlzLnN0YXRlLmd1aWxkc31cclxuXHRcdFx0XHRcdFx0XHRcdGNsYWltRXZlbnRzPXt0aGlzLnN0YXRlLmNsYWltRXZlbnRzfVxyXG5cdFx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdFx0OiBudWxsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2Pn1cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5UcmFja2VyLnByb3BUeXBlcyA9IHtcclxuXHRsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG5cdHdvcmxkOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJhY2tlcjtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFRpbWVyc1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGltZXJzKCkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVUaW1lcnMoKScpO1xyXG5cclxuXHRjb25zdCB0aW1lT2Zmc2V0ID0gc3RhdGUudGltZU9mZnNldDtcclxuXHRjb25zdCBub3cgPSBsaWJEYXRlLmRhdGVOb3coKSAtIHRpbWVPZmZzZXQ7XHJcblxyXG5cdHRyYWNrZXJUaW1lcnMudXBkYXRlKG5vdywgdGltZU9mZnNldCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2xlYXJUaW1lcnMoKXtcclxuXHQvLyBjb25zb2xlLmxvZygnY2xlYXJUaW1lcnMoKScpO1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRfLmZvckVhY2goY29tcG9uZW50LmludGVydmFscywgY2xlYXJJbnRlcnZhbCk7XHJcblx0Xy5mb3JFYWNoKGNvbXBvbmVudC50aW1lb3V0cywgY2xlYXJUaW1lb3V0KTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzKCkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHByb3BzID0gY29tcG9uZW50LnByb3BzO1xyXG5cclxuXHRjb25zdCB3b3JsZCA9IHByb3BzLndvcmxkO1xyXG5cdGNvbnN0IGxhbmdTbHVnID0gcHJvcHMubGFuZy5nZXQoJ3NsdWcnKTtcclxuXHRjb25zdCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG5cclxuXHRhcGkuZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZChcclxuXHRcdHdvcmxkU2x1ZyxcclxuXHRcdG9uTWF0Y2hEZXRhaWxzLmJpbmQodGhpcylcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG9uTWF0Y2hEZXRhaWxzKGVyciwgZGF0YSkge1xyXG5cdGxldCBjb21wb25lbnQgPSB0aGlzO1xyXG5cdGNvbnN0IHByb3BzID0gY29tcG9uZW50LnByb3BzO1xyXG5cdGNvbnN0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHJcblx0aWYgKGNvbXBvbmVudC5tb3VudGVkKSB7XHJcblx0XHRpZiAoIWVyciAmJiBkYXRhICYmIGRhdGEubWF0Y2ggJiYgZGF0YS5kZXRhaWxzKSB7XHJcblx0XHRcdGNvbnN0IGxhc3Rtb2QgPSBkYXRhLm1hdGNoLmxhc3Rtb2Q7XHJcblx0XHRcdGNvbnN0IGlzTW9kaWZpZWQgPSAobGFzdG1vZCAhPT0gc3RhdGUubWF0Y2guZ2V0KCdsYXN0bW9kJykpO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgZGF0YS5tYXRjaC5sYXN0bW9kLCBpc01vZGlmaWVkKTtcclxuXHJcblx0XHRcdGlmIChpc01vZGlmaWVkKSB7XHJcblx0XHRcdFx0Y29uc3QgZGF0ZU5vdyA9IGxpYkRhdGUuZGF0ZU5vdygpO1xyXG5cdFx0XHRcdGNvbnN0IHRpbWVPZmZzZXQgPSBNYXRoLmZsb29yKGRhdGVOb3cgIC0gKGRhdGEubm93IC8gMTAwMCkpO1xyXG5cclxuXHRcdFx0XHRjb25zdCBtYXRjaERhdGEgPSBJbW11dGFibGUuZnJvbUpTKGRhdGEubWF0Y2gpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsICdtYXRjaCcsIEltbXV0YWJsZS5pcyhtYXRjaERhdGEsIHN0YXRlLm1hdGNoKSk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ29uTWF0Y2hEZXRhaWxzJywgbWF0Y2gpO1xyXG5cclxuXHRcdFx0XHRjb25zdCBkZXRhaWxzRGF0YSA9IEltbXV0YWJsZS5mcm9tSlMoZGF0YS5kZXRhaWxzKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnb25NYXRjaERldGFpbHMnLCAnZGV0YWlscycsIEltbXV0YWJsZS5pcyhkZXRhaWxzRGF0YSwgc3RhdGUuZGV0YWlscykpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdvbk1hdGNoRGV0YWlscycsIGRldGFpbHMpO1xyXG5cclxuXHRcdFx0XHQvLyB1c2UgdHJhbnNhY3Rpb25hbCBzZXRTdGF0ZVxyXG5cdFx0XHRcdGNvbXBvbmVudC5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG5cdFx0XHRcdFx0aGFzRGF0YTogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGVOb3csXHJcblx0XHRcdFx0XHR0aW1lT2Zmc2V0LFxyXG5cdFx0XHRcdFx0bGFzdG1vZCxcclxuXHJcblx0XHRcdFx0XHRtYXRjaDogc3RhdGUubWF0Y2gubWVyZ2VEZWVwKG1hdGNoRGF0YSksXHJcblx0XHRcdFx0XHRkZXRhaWxzOiBzdGF0ZS5kZXRhaWxzLm1lcmdlRGVlcChkZXRhaWxzRGF0YSksXHJcblx0XHRcdFx0fSkpO1xyXG5cclxuXHJcblx0XHRcdFx0c2V0SW1tZWRpYXRlKGNvbXBvbmVudC5ndWlsZExpYi5vbk1hdGNoRGF0YS5iaW5kKGNvbXBvbmVudC5ndWlsZExpYiwgZGV0YWlsc0RhdGEpKTtcclxuXHJcblx0XHRcdFx0aWYgKHN0YXRlLm1hdGNoV29ybGRzLmlzRW1wdHkoKSkge1xyXG5cdFx0XHRcdFx0c2V0SW1tZWRpYXRlKHNldE1hdGNoV29ybGRzLmJpbmQoY29tcG9uZW50LCBwcm9wcy5sYW5nKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJlc2NoZWR1bGVEYXRhVXBkYXRlLmNhbGwoY29tcG9uZW50KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gcmVzY2hlZHVsZURhdGFVcGRhdGUoKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3QgcmVmcmVzaFRpbWUgPSBfLnJhbmRvbSgxMDAwKjIsIDEwMDAqNCk7XHJcblxyXG5cdGNvbXBvbmVudC50aW1lb3V0cy5kYXRhID0gc2V0VGltZW91dChnZXRNYXRjaERldGFpbHMuYmluZChjb21wb25lbnQpLCByZWZyZXNoVGltZSk7XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRNYXRjaFdvcmxkc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBzZXRNYXRjaFdvcmxkcyhsYW5nKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdGNvbXBvbmVudC5zZXRTdGF0ZSh7bWF0Y2hXb3JsZHM6IEltbXV0YWJsZVxyXG5cdFx0Lkxpc3QoWydyZWQnLCAnYmx1ZScsICdncmVlbiddKVxyXG5cdFx0Lm1hcChnZXRNYXRjaFdvcmxkLmJpbmQoY29tcG9uZW50LCBsYW5nKSlcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaFdvcmxkKGxhbmcsIGNvbG9yKSB7XHJcblx0bGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdGNvbnN0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHJcblx0Y29uc3Qgd29ybGRLZXkgPSBjb2xvciArICdJZCc7XHJcblx0Y29uc3Qgd29ybGRJZCA9IHN0YXRlLm1hdGNoLmdldEluKFt3b3JsZEtleV0pLnRvU3RyaW5nKCk7XHJcblxyXG5cdGNvbnN0IHdvcmxkQnlMYW5nID0gU1RBVElDLndvcmxkcy5nZXRJbihbd29ybGRJZCwgbGFuZ1NsdWddKTtcclxuXHJcblx0cmV0dXJuIHdvcmxkQnlMYW5nXHJcblx0XHQuc2V0KCdjb2xvcicsIGNvbG9yKVxyXG5cdFx0LnNldCgnbGluaycsIGdldFdvcmxkTGluayhsYW5nU2x1Zywgd29ybGRCeUxhbmcpKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRXb3JsZExpbmsobGFuZ1NsdWcsIHdvcmxkKSB7XHJcblx0cmV0dXJuIFsnJywgbGFuZ1NsdWcsIHdvcmxkLmdldCgnc2x1ZycpXS5qb2luKCcvJyk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdE1hdGNoIERldGFpbHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gc2V0UGFnZVRpdGxlKGxhbmcsIHdvcmxkKSB7XHJcblx0bGV0IGxhbmdTbHVnID0gbGFuZy5nZXQoJ3NsdWcnKTtcclxuXHRsZXQgd29ybGROYW1lID0gd29ybGQuZ2V0SW4oW2xhbmdTbHVnLCAnbmFtZSddKTtcclxuXHJcblx0bGV0IHRpdGxlID0gW3dvcmxkTmFtZSwgJ2d3MncydyddO1xyXG5cclxuXHRpZiAobGFuZ1NsdWcgIT09ICdlbicpIHtcclxuXHRcdHRpdGxlLnB1c2gobGFuZy5nZXQoJ25hbWUnKSk7XHJcblx0fVxyXG5cclxuXHQkKCd0aXRsZScpLnRleHQodGl0bGUuam9pbignIC0gJykpO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3QgSW1tdXRhYmxlID0gcmVxdWlyZSgnSW1tdXRhYmxlJyk7XHJcblxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRDb21wb25lbnQgRGVmaW5pdGlvblxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0Y29uc3QgbmV3T2JqZWN0aXZlTWV0YSA9ICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5vTWV0YSwgbmV4dFByb3BzLm9NZXRhKTtcclxuXHRcdGNvbnN0IHNob3VsZFVwZGF0ZSA9IChuZXdPYmplY3RpdmVNZXRhKTtcclxuXHJcblx0XHRyZXR1cm4gc2hvdWxkVXBkYXRlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgaW1nU3JjID0gZ2V0QXJyb3dTcmModGhpcy5wcm9wcy5vTWV0YSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZGlyZWN0aW9uXCI+XHJcblx0XHRcdFx0e2ltZ1NyYyA/IDxpbWcgc3JjPXtpbWdTcmN9IC8+IDogbnVsbH1cclxuXHRcdFx0PC9zcGFuPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuQXJyb3cucHJvcFR5cGVzID0ge1xyXG5cdG9NZXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0UHJpdmF0ZSBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldEFycm93U3JjKG1ldGEpIHtcclxuXHRpZiAoIW1ldGEuZ2V0KCdkJykpIHtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0bGV0IHNyYyA9IFsnL2ltZy9pY29ucy9kaXN0L2Fycm93J107XHJcblxyXG5cdGlmIChtZXRhLmdldCgnbicpKSB7c3JjLnB1c2goJ25vcnRoJyk7IH1cclxuXHRlbHNlIGlmIChtZXRhLmdldCgncycpKSB7c3JjLnB1c2goJ3NvdXRoJyk7IH1cclxuXHJcblx0aWYgKG1ldGEuZ2V0KCd3JykpIHtzcmMucHVzaCgnd2VzdCcpOyB9XHJcblx0ZWxzZSBpZiAobWV0YS5nZXQoJ2UnKSkge3NyYy5wdXNoKCdlYXN0Jyk7IH1cclxuXHJcblx0cmV0dXJuIHNyYy5qb2luKCctJykgKyAnLnN2Zyc7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IGltZ1BsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjwvc3ZnPic7XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Q29tcG9uZW50IERlZmluaXRpb25cclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgRW1ibGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XHJcblx0XHRjb25zdCBuZXdHdWlsZE5hbWUgPSAodGhpcy5wcm9wcy5ndWlsZE5hbWUgIT09IG5leHRQcm9wcy5ndWlsZE5hbWUpO1xyXG5cdFx0Y29uc3QgbmV3U2l6ZSA9ICh0aGlzLnByb3BzLnNpemUgIT09IG5leHRQcm9wcy5zaXplKTtcclxuXHJcblx0XHRjb25zdCBzaG91bGRVcGRhdGUgPSAobmV3R3VpbGROYW1lIHx8IG5ld1NpemUpO1xyXG5cclxuXHRcdHJldHVybiBzaG91bGRVcGRhdGU7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBlbWJsZW1TcmMgPSBnZXRFbWJsZW1TcmModGhpcy5wcm9wcy5ndWlsZE5hbWUpO1xyXG5cclxuXHRcdHJldHVybiA8aW1nXHJcblx0XHRcdGNsYXNzTmFtZT1cImVtYmxlbVwiXHJcblx0XHRcdHNyYz17ZW1ibGVtU3JjfVxyXG5cdFx0XHR3aWR0aD17dGhpcy5wcm9wcy5zaXplfVxyXG5cdFx0XHRoZWlnaHQ9e3RoaXMucHJvcHMuc2l6ZX1cclxuXHRcdFx0b25FcnJvcj17aW1nT25FcnJvcn1cclxuXHRcdC8+O1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRDbGFzcyBQcm9wZXJ0aWVzXHJcbiovXHJcblxyXG5FbWJsZW0uZGVmYXVsdFByb3BzID0ge1xyXG5cdGd1aWxkTmFtZTogdW5kZWZpbmVkLFxyXG5cdHNpemU6IDI1NixcclxufTtcclxuXHJcbkVtYmxlbS5wcm9wVHlwZXMgPSB7XHJcblx0Z3VpbGROYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0RXhwb3J0IE1vZHVsZVxyXG4qXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVtYmxlbTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcblx0cmV0dXJuIChndWlsZE5hbWUpXHJcblx0XHQ/IGBodHRwOlxcL1xcL2d1aWxkcy5ndzJ3MncuY29tXFwvZ3VpbGRzXFwvJHtzbHVnaWZ5KGd1aWxkTmFtZSl9XFwvMjU2LnN2Z2BcclxuXHRcdDogaW1nUGxhY2Vob2xkZXI7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcclxuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC8gL2csICctJykpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW1nT25FcnJvcihlKSB7XHJcblx0Y29uc3QgY3VycmVudFNyYyA9ICQoZS50YXJnZXQpLmF0dHIoJ3NyYycpO1xyXG5cclxuXHRpZiAoY3VycmVudFNyYyAhPT0gaW1nUGxhY2Vob2xkZXIpIHtcclxuXHRcdCQoZS50YXJnZXQpLmF0dHIoJ3NyYycsIGltZ1BsYWNlaG9sZGVyKTtcclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLypcclxuKlxyXG4qXHREZXBlbmRlbmNpZXNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENvbXBvbmVudCBHbG9iYWxzXHJcbiovXHJcblxyXG5jb25zdCBJTlNUQU5DRSA9IHtcclxuXHRzaXplOiA2MCxcclxuXHRzdHJva2U6IDIsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFBpZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xyXG5cdFx0cmV0dXJuICFJbW11dGFibGUuaXModGhpcy5wcm9wcy5zY29yZXMsIG5leHRQcm9wcy5zY29yZXMpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdQaWU6OnJlbmRlcicsIHByb3BzLnNjb3Jlcy50b0FycmF5KCkpO1xyXG5cclxuXHRcdHJldHVybiA8aW1nXHJcblx0XHRcdHdpZHRoPXtJTlNUQU5DRS5zaXplfVxyXG5cdFx0XHRoZWlnaHQ9e0lOU1RBTkNFLnNpemV9XHJcblx0XHRcdHNyYz17Z2V0SW1hZ2VTb3VyY2UocHJvcHMuc2NvcmVzLnRvQXJyYXkoKSl9XHJcblx0XHQvPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuUGllLnByb3BUeXBlcyA9IHtcclxuXHRzY29yZXM6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGllO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRQcml2YXRlIE1ldGhvZHNcclxuKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZ2V0SW1hZ2VTb3VyY2Uoc2NvcmVzKSB7XHJcblx0cmV0dXJuIGBodHRwOlxcL1xcL3d3dy5waWVseS5uZXRcXC8ke0lOU1RBTkNFLnNpemV9XFwvJHtzY29yZXMuam9pbignLCcpfT9zdHJva2VXaWR0aD0ke0lOU1RBTkNFLnN0cm9rZX1gO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0RGVwZW5kZW5jaWVzXHJcbipcclxuKi9cclxuXHJcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdENvbXBvbmVudCBEZWZpbml0aW9uXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIFNwcml0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge3JldHVybiAhXy5pc0VxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblxyXG5cdFx0cmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17YHNwcml0ZSAke3Byb3BzLnR5cGV9ICR7cHJvcHMuY29sb3J9YH0gLz47XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdENsYXNzIFByb3BlcnRpZXNcclxuKi9cclxuXHJcblNwcml0ZS5wcm9wVHlwZXMgPSB7XHJcblx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnRlZCBDb21wb25lbnRcclxuKlxyXG4qL1xyXG5cclxuY2xhc3MgTGFuZ0xpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcclxuXHJcblx0XHRjb25zdCBpc0FjdGl2ZSA9IEltbXV0YWJsZS5pcyhwcm9wcy5sYW5nLCBwcm9wcy5saW5rTGFuZyk7XHJcblx0XHRjb25zdCB0aXRsZSA9IHByb3BzLmxpbmtMYW5nLmdldCgnbmFtZScpO1xyXG5cdFx0Y29uc3QgbGFiZWwgPSBwcm9wcy5saW5rTGFuZy5nZXQoJ2xhYmVsJyk7XHJcblx0XHRjb25zdCBsaW5rID0gZ2V0TGluayhwcm9wcy5saW5rTGFuZywgcHJvcHMud29ybGQpO1xyXG5cclxuXHRcdHJldHVybiA8bGkgY2xhc3NOYW1lPXtpc0FjdGl2ZSA/ICdhY3RpdmUnIDogJyd9IHRpdGxlPXt0aXRsZX0+XHJcblx0XHRcdDxhIGhyZWY9e2xpbmt9PntsYWJlbH08L2E+XHJcblx0XHQ8L2xpPjtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTGFuZ0xpbmsucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG5cdGxpbmtMYW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKS5pc1JlcXVpcmVkLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFuZ0xpbms7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXRMaW5rKGxhbmcsIHdvcmxkKSB7XHJcblx0Y29uc3QgbGFuZ1NsdWcgPSBsYW5nLmdldCgnc2x1ZycpO1xyXG5cclxuXHRsZXQgbGluayA9IGAvJHtsYW5nU2x1Z31gO1xyXG5cclxuXHRpZiAod29ybGQpIHtcclxuXHRcdGxldCB3b3JsZFNsdWcgPSB3b3JsZC5nZXRJbihbbGFuZ1NsdWcsICdzbHVnJ10pO1xyXG5cdFx0bGluayArPSBgLyR7d29ybGRTbHVnfWA7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbGluaztcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgU1RBVElDID0gcmVxdWlyZSgnbGliL3N0YXRpYycpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRSZWFjdCBDb21wb25lbnRzXHJcbiovXHJcblxyXG5jb25zdCBMYW5nTGluayA9IHJlcXVpcmUoJy4vTGFuZ0xpbmsnKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydGVkIENvbXBvbmVudFxyXG4qXHJcbiovXHJcblxyXG5jbGFzcyBMYW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMYW5nczo6cmVuZGVyKCknLCB0aGlzLnByb3BzLmxhbmcudG9KUygpKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPSduYXYgbmF2YmFyLW5hdic+XHJcblx0XHRcdFx0e1NUQVRJQy5sYW5ncy50b1NlcSgpLm1hcCgobGlua0xhbmcsIGtleSkgPT5cclxuXHRcdFx0XHRcdDxMYW5nTGlua1xyXG5cdFx0XHRcdFx0XHRrZXk9e2tleX1cclxuXHRcdFx0XHRcdFx0bGlua0xhbmc9e2xpbmtMYW5nfVxyXG5cdFx0XHRcdFx0XHRsYW5nPXt0aGlzLnByb3BzLmxhbmd9XHJcblx0XHRcdFx0XHRcdHdvcmxkPXt0aGlzLnByb3BzLndvcmxkfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuKlx0Q2xhc3MgUHJvcGVydGllc1xyXG4qL1xyXG5cclxuTGFuZ3MucHJvcFR5cGVzID0ge1xyXG5cdGxhbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLmlzUmVxdWlyZWQsXHJcblx0d29ybGQ6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5NYXApLFxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRFeHBvcnQgTW9kdWxlXHJcbipcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFuZ3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldEd1aWxkRGV0YWlsczogZ2V0R3VpbGREZXRhaWxzLFxyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Ly8gZ2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzQnlXb3JsZDogZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCxcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRHdWlsZERldGFpbHMoe2d1aWxkX2lkOiBndWlsZElkfSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhtYXRjaElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7bWF0Y2hfaWQ6IG1hdGNoSWR9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCh3b3JsZFNsdWcsIGNhbGxiYWNrKSB7XHJcblx0Ly8gc2V0VGltZW91dChcclxuXHQvLyBcdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZS5iaW5kKG51bGwsIHt3b3JsZF9zbHVnOiB3b3JsZFNsdWd9LCBjYWxsYmFjayksXHJcblx0Ly8gXHQzMDAwXHJcblx0Ly8gKTtcclxuXHRndzJhcGkuZ2V0TWF0Y2hEZXRhaWxzU3RhdGUoe3dvcmxkX3NsdWc6IHdvcmxkU2x1Z30sIGNhbGxiYWNrKTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0ZGF0ZU5vdzogZGF0ZU5vdyxcclxuXHRhZGQ1OiBhZGQ1LFxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRhdGVOb3coKSB7XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoXy5ub3coKSAvIDEwMDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkNShpbkRhdGUpIHtcclxuXHRsZXQgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcblx0cmV0dXJuIChfYmFzZURhdGUgKyAoNSAqIDYwKSk7XHJcbn1cclxuIiwiY29uc3Qgc3RhdGljcyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxuXHJcbmNvbnN0IEltbXV0YWJsZSA9IHJlcXVpcmUoJ0ltbXV0YWJsZScpO1xyXG5cclxuY29uc3QgaW1tdXRhYmxlU3RhdGljcyA9IHtcclxuXHRsYW5nczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLmxhbmdzKSxcclxuXHR3b3JsZHM6IEltbXV0YWJsZS5mcm9tSlMoc3RhdGljcy53b3JsZHMpLFxyXG5cdG9iamVjdGl2ZV9uYW1lczogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9uYW1lcyksXHJcblx0b2JqZWN0aXZlX3R5cGVzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX3R5cGVzKSxcclxuXHRvYmplY3RpdmVfbWV0YTogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tZXRhKSxcclxuXHRvYmplY3RpdmVfbGFiZWxzOiBJbW11dGFibGUuZnJvbUpTKHN0YXRpY3Mub2JqZWN0aXZlX2xhYmVscyksXHJcblx0b2JqZWN0aXZlX21hcDogSW1tdXRhYmxlLmZyb21KUyhzdGF0aWNzLm9iamVjdGl2ZV9tYXApLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbW11dGFibGVTdGF0aWNzOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHt1cGRhdGV9O1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKG5vdywgdGltZU9mZnNldCkge1xyXG5cdGxldCAkdGltZXJzID0gJCgnLnRpbWVyJyk7XHJcblx0bGV0ICRjb3VudGRvd25zID0gJHRpbWVycy5maWx0ZXIoJy5jb3VudGRvd24nKTtcclxuXHRsZXQgJHJlbGF0aXZlcyA9ICR0aW1lcnMuZmlsdGVyKCcucmVsYXRpdmUnKTtcclxuXHJcblx0YXN5bmMucGFyYWxsZWwoW1xyXG5cdFx0dXBkYXRlUmVsYXRpdmVUaW1lcnMuYmluZChudWxsLCAkcmVsYXRpdmVzLCB0aW1lT2Zmc2V0KSxcclxuXHRcdHVwZGF0ZUNvdW50ZG93blRpbWVycy5iaW5kKG51bGwsICRjb3VudGRvd25zLCBub3cpLFxyXG5cdF0sIF8ubm9vcCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lcnMocmVsYXRpdmVzLCB0aW1lT2Zmc2V0LCBjYikge1xyXG5cdGFzeW5jLmVhY2goXHJcblx0XHRyZWxhdGl2ZXMsXHJcblx0XHR1cGRhdGVSZWxhdGl2ZVRpbWVOb2RlLmJpbmQobnVsbCwgdGltZU9mZnNldCksXHJcblx0XHRjYlxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ291bnRkb3duVGltZXJzKGNvdW50ZG93bnMsIG5vdywgY2IpIHtcclxuXHRhc3luYy5lYWNoKFxyXG5cdFx0Y291bnRkb3ducyxcclxuXHRcdHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZS5iaW5kKG51bGwsIG5vdyksXHJcblx0XHRjYlxyXG5cdCk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVsYXRpdmVUaW1lTm9kZSh0aW1lT2Zmc2V0LCBlbCwgbmV4dCkge1xyXG5cdGxldCAkZWwgPSAkKGVsKTtcclxuXHJcblx0Y29uc3QgdGltZXN0YW1wID0gXy5wYXJzZUludCgkZWwuYXR0cignZGF0YS10aW1lc3RhbXAnKSk7XHJcblx0Y29uc3Qgb2Zmc2V0VGltZXN0YW1wID0gdGltZXN0YW1wICsgdGltZU9mZnNldDtcclxuXHRjb25zdCB0aW1lc3RhbXBNb21lbnQgPSBtb21lbnQob2Zmc2V0VGltZXN0YW1wICogMTAwMCk7XHJcblx0Y29uc3QgdGltZXN0YW1wUmVsYXRpdmUgPSB0aW1lc3RhbXBNb21lbnQudHdpdHRlclNob3J0KCk7XHJcblxyXG5cdCRlbC50ZXh0KHRpbWVzdGFtcFJlbGF0aXZlKTtcclxuXHJcblx0bmV4dCgpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZG93blRpbWVyTm9kZShub3csIGVsLCBuZXh0KSB7XHJcblx0bGV0ICRlbCA9ICQoZWwpO1xyXG5cclxuXHRjb25zdCBkYXRhRXhwaXJlcyA9ICRlbC5hdHRyKCdkYXRhLWV4cGlyZXMnKTtcclxuXHRjb25zdCBleHBpcmVzID0gXy5wYXJzZUludChkYXRhRXhwaXJlcyk7XHJcblx0Y29uc3Qgc2VjUmVtYWluaW5nID0gKGV4cGlyZXMgLSBub3cpO1xyXG5cdGNvbnN0IHNlY0VsYXBzZWQgPSAzMDAgLSBzZWNSZW1haW5pbmc7XHJcblxyXG5cdGNvbnN0IGhpZ2hsaXRlVGltZSA9IDEwO1xyXG5cdGNvbnN0IGlzVmlzaWJsZSA9IGV4cGlyZXMgKyBoaWdobGl0ZVRpbWUgPj0gbm93O1xyXG5cdGNvbnN0IGlzRXhwaXJlZCA9IGV4cGlyZXMgPCBub3c7XHJcblx0Y29uc3QgaXNBY3RpdmUgPSAhaXNFeHBpcmVkO1xyXG5cdGNvbnN0IGlzVGltZXJIaWdobGlnaHRlZCA9IChzZWNSZW1haW5pbmcgPD0gTWF0aC5hYnMoaGlnaGxpdGVUaW1lKSk7XHJcblx0Y29uc3QgaXNUaW1lckZyZXNoID0gKHNlY0VsYXBzZWQgPD0gaGlnaGxpdGVUaW1lKTtcclxuXHJcblxyXG5cdGNvbnN0IHRpbWVyVGV4dCA9IChpc0FjdGl2ZSlcclxuXHRcdD8gbW9tZW50KHNlY1JlbWFpbmluZyAqIDEwMDApLmZvcm1hdCgnbTpzcycpXHJcblx0XHQ6ICcwOjAwJztcclxuXHJcblxyXG5cdGlmIChpc1Zpc2libGUpIHtcclxuXHRcdGxldCAkb2JqZWN0aXZlID0gJGVsLmNsb3Nlc3QoJy5vYmplY3RpdmUnKTtcclxuXHRcdGxldCBoYXNDbGFzc0hpZ2hsaWdodCA9ICRlbC5oYXNDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcblx0XHRsZXQgaGFzQ2xhc3NGcmVzaCA9ICRvYmplY3RpdmUuaGFzQ2xhc3MoJ2ZyZXNoJyk7XHJcblxyXG5cdFx0aWYgKGlzVGltZXJIaWdobGlnaHRlZCAmJiAhaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuXHRcdFx0JGVsLmFkZENsYXNzKCdoaWdobGlnaHQnKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKCFpc1RpbWVySGlnaGxpZ2h0ZWQgJiYgaGFzQ2xhc3NIaWdobGlnaHQpIHtcclxuXHRcdFx0JGVsLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNUaW1lckZyZXNoICYmICFoYXNDbGFzc0ZyZXNoKSB7XHJcblx0XHRcdCRvYmplY3RpdmUuYWRkQ2xhc3MoJ2ZyZXNoJyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghaXNUaW1lckZyZXNoICYmIGhhc0NsYXNzRnJlc2gpIHtcclxuXHRcdFx0JG9iamVjdGl2ZS5yZW1vdmVDbGFzcygnZnJlc2gnKTtcclxuXHRcdH1cclxuXHJcblx0XHQkZWwudGV4dCh0aW1lclRleHQpXHJcblx0XHRcdC5maWx0ZXIoJy5pbmFjdGl2ZScpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKVxyXG5cdFx0XHQuZW5kKCk7XHJcblxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdCRlbC5maWx0ZXIoJy5hY3RpdmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2luYWN0aXZlJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodCcpXHJcblx0XHQuZW5kKCk7XHJcblx0fVxyXG5cclxuXHRuZXh0KCk7XHJcbn1cclxuIiwiXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdERlcGVuZGVuY2llc1xyXG4qXHJcbiovXHJcblxyXG5jb25zdCBJbW11dGFibGUgPSByZXF1aXJlKCdJbW11dGFibGUnKTtcclxuY29uc3QgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpO1xyXG5cclxuY29uc3QgYXBpID0gcmVxdWlyZSgnbGliL2FwaS5qcycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0TW9kdWxlIEdsb2JhbHNcclxuKlxyXG4qL1xyXG5cclxuY29uc3QgZ3VpbGREZWZhdWx0ID0gSW1tdXRhYmxlLk1hcCh7XHJcblx0J2xvYWRlZCc6IGZhbHNlLFxyXG5cdCdsYXN0Q2xhaW0nOiAwLFxyXG5cdCdjbGFpbXMnOiBJbW11dGFibGUuTWFwKCksXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG51bVF1ZXVlQ29uY3VycmVudCA9IDQ7XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFB1YmxpYyBNZXRob2RzXHJcbipcclxuKi9cclxuXHJcbmNsYXNzIExpYkd1aWxkcyB7XHJcblx0Y29uc3RydWN0b3IoY29tcG9uZW50KSB7XHJcblx0XHR0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuXHJcblx0XHR0aGlzLmFzeW5jR3VpbGRRdWV1ZSA9IGFzeW5jLnF1ZXVlKFxyXG5cdFx0XHR0aGlzLmdldEd1aWxkRGV0YWlscy5iaW5kKHRoaXMpLFxyXG5cdFx0XHRudW1RdWV1ZUNvbmN1cnJlbnRcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdG9uTWF0Y2hEYXRhKG1hdGNoRGV0YWlscykge1xyXG5cdFx0Ly8gbGV0IGNvbXBvbmVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBzdGF0ZSA9IHRoaXMuY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdMaWJHdWlsZHM6Om9uTWF0Y2hEYXRhKCknKTtcclxuXHJcblx0XHRjb25zdCBvYmplY3RpdmVDbGFpbWVycyA9IG1hdGNoRGV0YWlscy5nZXRJbihbJ29iamVjdGl2ZXMnLCAnY2xhaW1lcnMnXSk7XHJcblx0XHRjb25zdCBjbGFpbUV2ZW50cyA9ICBnZXRFdmVudHNCeVR5cGUobWF0Y2hEZXRhaWxzLCAnY2xhaW0nKTtcclxuXHRcdGNvbnN0IGd1aWxkc1RvTG9va3VwID0gZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZS5ndWlsZHMsIG9iamVjdGl2ZUNsYWltZXJzLCBjbGFpbUV2ZW50cyk7XHJcblxyXG5cdFx0Ly8gc2VuZCBuZXcgZ3VpbGRzIHRvIGFzeW5jIHF1ZXVlIG1hbmFnZXIgZm9yIGRhdGEgcmV0cmlldmFsXHJcblx0XHRpZiAoIWd1aWxkc1RvTG9va3VwLmlzRW1wdHkoKSkge1xyXG5cdFx0XHR0aGlzLmFzeW5jR3VpbGRRdWV1ZS5wdXNoKGd1aWxkc1RvTG9va3VwLnRvQXJyYXkoKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBuZXdHdWlsZHMgPSBzdGF0ZS5ndWlsZHM7XHJcblx0XHRuZXdHdWlsZHMgPSBpbml0aWFsaXplR3VpbGRzKG5ld0d1aWxkcywgZ3VpbGRzVG9Mb29rdXApO1xyXG5cdFx0bmV3R3VpbGRzID0gZ3VpbGRzUHJvY2Vzc0NsYWltcyhuZXdHdWlsZHMsIGNsYWltRXZlbnRzKTtcclxuXHJcblx0XHQvLyB1cGRhdGUgc3RhdGUgaWYgbmVjZXNzYXJ5XHJcblx0XHRpZiAoIUltbXV0YWJsZS5pcyhzdGF0ZS5ndWlsZHMsIG5ld0d1aWxkcykpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2d1aWxkczo6b25NYXRjaERhdGEoKScsICdoYXMgdXBkYXRlJyk7XHJcblx0XHRcdHRoaXMuY29tcG9uZW50LnNldFN0YXRlKHtndWlsZHM6IG5ld0d1aWxkc30pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRnZXRHdWlsZERldGFpbHMoZ3VpbGRJZCwgb25Db21wbGV0ZSkge1xyXG5cdFx0bGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50O1xyXG5cdFx0Y29uc3Qgc3RhdGUgPSBjb21wb25lbnQuc3RhdGU7XHJcblxyXG5cdFx0Y29uc3QgaGFzRGF0YSA9IHN0YXRlLmd1aWxkcy5nZXRJbihbZ3VpbGRJZCwgJ2xvYWRlZCddKTtcclxuXHJcblx0XHRpZiAoaGFzRGF0YSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnVHJhY2tlcjo6Z2V0R3VpbGREZXRhaWxzKCknLCAnc2tpcCcsIGd1aWxkSWQpO1xyXG5cdFx0XHRvbkNvbXBsZXRlKG51bGwpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdUcmFja2VyOjpnZXRHdWlsZERldGFpbHMoKScsICdsb29rdXAnLCBndWlsZElkKTtcclxuXHRcdFx0YXBpLmdldEd1aWxkRGV0YWlscyhcclxuXHRcdFx0XHRndWlsZElkLFxyXG5cdFx0XHRcdG9uR3VpbGREYXRhLmJpbmQodGhpcywgb25Db21wbGV0ZSlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdEV4cG9ydCBNb2R1bGVcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWJHdWlsZHM7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbipcdFByaXZhdGUgTWV0aG9kc1xyXG4qXHJcbiovXHJcblxyXG5mdW5jdGlvbiBvbkd1aWxkRGF0YShvbkNvbXBsZXRlLCBlcnIsIGRhdGEpIHtcclxuXHRsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQ7XHJcblx0bGV0IHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xyXG5cclxuXHRpZiAoY29tcG9uZW50Lm1vdW50ZWQpIHtcclxuXHRcdGlmICghZXJyICYmIGRhdGEpIHtcclxuXHRcdFx0ZGVsZXRlIGRhdGEuZW1ibGVtO1xyXG5cdFx0XHRkYXRhLmxvYWRlZCA9IHRydWU7XHJcblxyXG5cdFx0XHRjb25zdCBndWlsZElkID0gZGF0YS5ndWlsZF9pZDtcclxuXHRcdFx0Y29uc3QgZ3VpbGREYXRhID0gSW1tdXRhYmxlLmZyb21KUyhkYXRhKTtcclxuXHJcblx0XHRcdGNvbXBvbmVudC5zZXRTdGF0ZShzdGF0ZSA9PiAoe1xyXG5cdFx0XHRcdGd1aWxkczogc3RhdGUuZ3VpbGRzLm1lcmdlSW4oW2d1aWxkSWRdLCBndWlsZERhdGEpXHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRvbkNvbXBsZXRlKG51bGwpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWxkc1Byb2Nlc3NDbGFpbXMoZ3VpbGRzLCBjbGFpbUV2ZW50cykge1xyXG5cdC8vIGNvbnNvbGUubG9nKCdndWlsZHNQcm9jZXNzQ2xhaW1zKCknLCBndWlsZHMuc2l6ZSk7XHJcblxyXG5cdHJldHVybiBndWlsZHMubWFwKFxyXG5cdFx0Z3VpbGRBdHRhY2hDbGFpbXMuYmluZChudWxsLCBjbGFpbUV2ZW50cylcclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWxkQXR0YWNoQ2xhaW1zKGNsYWltRXZlbnRzLCBndWlsZCwgZ3VpbGRJZCkge1xyXG5cdGNvbnN0IGhhc0NsYWltcyA9ICFndWlsZC5nZXQoJ2NsYWltcycpLmlzRW1wdHkoKTtcclxuXHRjb25zdCBuZXdlc3RDbGFpbSA9IGhhc0NsYWltcyA/IGd1aWxkLmdldCgnY2xhaW1zJykuZmlyc3QoKSA6IG51bGw7XHJcblxyXG5cdGNvbnN0IGluY0NsYWltcyA9IGNsYWltRXZlbnRzXHJcblx0XHQuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmdldCgnZ3VpbGQnKSA9PT0gZ3VpbGRJZClcclxuXHRcdC50b01hcCgpO1xyXG5cclxuXHRjb25zdCBpbmNIYXNDbGFpbXMgPSAhaW5jQ2xhaW1zLmlzRW1wdHkoKTtcclxuXHRjb25zdCBpbmNOZXdlc3RDbGFpbSA9IGluY0hhc0NsYWltcyA/IGluY0NsYWltcy5maXJzdCgpIDogbnVsbDtcclxuXHJcblxyXG5cdGNvbnN0IGhhc05ld0NsYWltcyA9ICghSW1tdXRhYmxlLmlzKG5ld2VzdENsYWltLCBpbmNOZXdlc3RDbGFpbSkpO1xyXG5cclxuXHJcblx0aWYgKGhhc05ld0NsYWltcykge1xyXG5cdFx0Y29uc3QgbGFzdENsYWltID0gaW5jSGFzQ2xhaW1zID8gaW5jTmV3ZXN0Q2xhaW0uZ2V0KCd0aW1lc3RhbXAnKSA6IDA7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnY2xhaW1zIGFsdGVyZWQnLCBndWlsZElkLCBoYXNOZXdDbGFpbXMsIGxhc3RDbGFpbSk7XHJcblx0XHRndWlsZCA9IGd1aWxkLnNldCgnY2xhaW1zJywgaW5jQ2xhaW1zKTtcclxuXHRcdGd1aWxkID0gZ3VpbGQuc2V0KCdsYXN0Q2xhaW0nLCBsYXN0Q2xhaW0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGd1aWxkO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVHdWlsZHMoZ3VpbGRzLCBuZXdHdWlsZHMpIHtcclxuXHQvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZUd1aWxkcygpJyk7XHJcblx0Ly8gY29uc29sZS5sb2coJ25ld0d1aWxkcycsIG5ld0d1aWxkcyk7XHJcblxyXG5cdG5ld0d1aWxkcy5mb3JFYWNoKGd1aWxkSWQgPT4ge1xyXG5cdFx0aWYgKCFndWlsZHMuaGFzKGd1aWxkSWQpKSB7XHJcblx0XHRcdGxldCBndWlsZCA9IGd1aWxkRGVmYXVsdC5zZXQoJ2d1aWxkX2lkJywgZ3VpbGRJZCk7XHJcblx0XHRcdGd1aWxkcyA9IGd1aWxkcy5zZXQoZ3VpbGRJZCwgZ3VpbGQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRyZXR1cm4gZ3VpbGRzO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEV2ZW50c0J5VHlwZShtYXRjaERldGFpbHMsIGV2ZW50VHlwZSkge1xyXG5cdHJldHVybiBtYXRjaERldGFpbHNcclxuXHRcdC5nZXQoJ2hpc3RvcnknKVxyXG5cdFx0LmZpbHRlcihlbnRyeSA9PiBlbnRyeS5nZXQoJ3R5cGUnKSA9PT0gZXZlbnRUeXBlKVxyXG5cdFx0LnNvcnRCeShlbnRyeSA9PiAtZW50cnkuZ2V0KCd0aW1lc3RhbXAnKSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VW5rbm93bkd1aWxkcyhzdGF0ZUd1aWxkcywgb2JqZWN0aXZlQ2xhaW1lcnMsIGNsYWltRXZlbnRzKSB7XHJcblx0Y29uc3QgZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXMgPSBvYmplY3RpdmVDbGFpbWVyc1xyXG5cdFx0Lm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkJykpXHJcblx0XHQudG9TZXQoKTtcclxuXHJcblx0Y29uc3QgZ3VpbGRzV2l0aFByZXZpb3VzQ2xhaW1zID0gY2xhaW1FdmVudHNcclxuXHRcdC5tYXAoZW50cnkgPT4gZW50cnkuZ2V0KCdndWlsZCcpKVxyXG5cdFx0LnRvU2V0KCk7XHJcblxyXG5cdGNvbnN0IGd1aWxkQ2xhaW1zID0gZ3VpbGRzV2l0aEN1cnJlbnRDbGFpbXNcclxuXHRcdC51bmlvbihndWlsZHNXaXRoUHJldmlvdXNDbGFpbXMpO1xyXG5cclxuXHJcblx0Y29uc3Qga25vd25HdWlsZHMgPSBzdGF0ZUd1aWxkc1xyXG5cdFx0Lm1hcChlbnRyeSA9PiBlbnRyeS5nZXQoJ2d1aWxkX2lkJykpXHJcblx0XHQudG9TZXQoKTtcclxuXHJcblx0Y29uc3QgdW5rbm93bkd1aWxkcyA9IGd1aWxkQ2xhaW1zXHJcblx0XHQuc3VidHJhY3Qoa25vd25HdWlsZHMpO1xyXG5cclxuXHJcblx0Ly8gY29uc29sZS5sb2coJ2d1aWxkQ2xhaW1zJywgZ3VpbGRDbGFpbXMudG9BcnJheSgpKTtcclxuXHQvLyBjb25zb2xlLmxvZygna25vd25HdWlsZHMnLCBrbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd1bmtub3duR3VpbGRzJywgdW5rbm93bkd1aWxkcy50b0FycmF5KCkpO1xyXG5cclxuXHRyZXR1cm4gdW5rbm93bkd1aWxkcztcclxufSJdfQ==
